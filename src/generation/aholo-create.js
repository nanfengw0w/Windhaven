// Aholo Lux3D atelier: generate a landmark from a photo or prompt, then
// place it in the living valley. The API key stays on the Node server.
import { Ry } from "../vendor/three-runtime.js";
import { TransformControls } from "../vendor/transform-controls.js";
import { CharacterGLTFLoader } from "../character/gltf-loader.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { COMMON_GLSL } from "../render/shared-shaders.js";
import { ModelThumbnails } from "./model-thumbnails.js";
import { ValleySaves } from "./valley-saves.js";

const TARGET_HEIGHT = 0.82;
const TRANSFORM_LAYER = 1;
const MIN_PLACEMENT_SCALE = 0.25;
const MAX_PLACEMENT_SCALE = 4;
const SCALE_DOUBLING_DISTANCE = 96;
const LANTERN_LIGHT_COUNT = 3;
const ANCHOR_DIRECTIONS = [-1, 0, 1].flatMap((x) =>
  [-1, 0, 1].flatMap((y) =>
    [-1, 0, 1].filter((z) => x || y || z).map((z) => new Ry.Vector3(x, y, z)),
  ),
);
const MAX_UPLOAD_BYTES = 12 * 1024 * 1024;
const MAX_PHOTOS = 32;
const POLL_INTERVAL_MS = 2000;
const POLL_MAX_FAILURES = 4;
const POLL_MAX_WAIT_MS = 15 * 60_000;
const MODEL_LOADER = new CharacterGLTFLoader();
const ROLES = [
  {
    id: "guardian",
    label: "静态摆件 / Static",
    hint: "放在原地，适合人物或普通装饰。",
  },
  {
    id: "lantern",
    label: "夜间照明 / Lantern",
    hint: "入夜后亮起暖光，亮度会轻微闪动。",
  },
  {
    id: "wind",
    label: "随风转向 / Wind Vane",
    hint: "跟随摆放位置的风向转动。",
  },
  {
    id: "shrine",
    label: "引雷地标 / Lightning Target",
    hint: "雷暴时更容易成为附近闪电的落点。",
  },
];
const STYLES = [
  ["photorealistic", "真实 / Photoreal"],
  ["hand_painted", "手绘 / Hand-painted"],
  ["fantasy", "奇幻 / Fantasy"],
  ["glass", "玻璃 / Glass"],
  ["cartoon", "卡通 / Cartoon"],
];
const FACE_COUNTS = [
  [20000, "20k · 快"],
  [30000, "30k · 推荐"],
  [60000, "60k · 精细"],
];
const DEFAULT_ROLE = ROLES[0];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function shortAngle(value) {
  let angle = value;
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function generationView() {
  return {
    role: DEFAULT_ROLE.id,
    faceCount: 30000,
    jobId: null,
    busy: false,
    pollFailures: 0,
    pollDeadline: 0,
    pollToken: 0,
  };
}

function getModelAnchorPoints(template) {
  // Cache extremal model vertices to keep the toolbar near the silhouette as it rotates.
  const candidates = ANCHOR_DIRECTIONS.map((direction) => ({
    direction,
    distance: -Infinity,
    point: new Ry.Vector3(),
  }));
  const sample = new Ry.Vector3();
  const record = () => {
    for (const candidate of candidates) {
      const distance = sample.dot(candidate.direction);
      if (distance > candidate.distance) {
        candidate.distance = distance;
        candidate.point.copy(sample);
      }
    }
  };
  template.updateMatrixWorld(true);
  template.traverse((object) => {
    if (!object.isMesh) return;
    if (object.isInstancedMesh) {
      const { min, max } = new Ry.Box3().setFromObject(object);
      for (let corner = 0; corner < 8; corner++) {
        sample.set(
          corner & 1 ? max.x : min.x,
          corner & 2 ? max.y : min.y,
          corner & 4 ? max.z : min.z,
        );
        record();
      }
      return;
    }
    const count = object.geometry.getAttribute("position")?.count ?? 0;
    for (let index = 0; index < count; index++) {
      object.getVertexPosition(index, sample).applyMatrix4(object.matrixWorld);
      record();
    }
  });
  return candidates
    .filter(({ distance }) => Number.isFinite(distance))
    .map(({ point }) => point);
}

class AholoCreate {
  constructor(ctx) {
    this.ctx = ctx;
    this.scene = ctx.scene;
    this.camera = ctx.camera;
    this.open = false;
    this.tab = "photo";
    this.views = {
      photo: generationView(),
      text: generationView(),
      models: {},
    };
    this.photoFiles = [];
    this.cardPlacement = null;
    this.placing = null;
    this.selectedEntry = null;
    this.editAnchors = new WeakMap();
    this.loadingTemplates = new Map();
    this.editProjection = new Ry.Vector3();
    this.transformControls = null;
    this.transformDrag = null;
    this.transformMode = "translate";
    this.ghost = null;
    this.marker = null;
    this.placed = [];
    this.lanterns = [];
    // Keep the scene's point-light count stable from its first render.
    this.lanternLights = Array.from(
      { length: LANTERN_LIGHT_COUNT },
      () => new Ry.PointLight(0xffb46a, 0, 2.8, 2),
    );
    this.scene.add(...this.lanternLights);
    this.saves = new ValleySaves();
    this.layoutBusy = false;
    this.pendingLayout = null;
    this.layoutNotice = "";
    this.modelsLoading = false;
    this.style = "photorealistic";
    this.time = 0;
    this._rayPoint = new Ry.Vector3();
    this._windSample = { x: 0, z: 0 };
    this._installInput();
    this._build();
    ctx.aholoLandmarks ??= [];
    ctx.aholoCreate = this;
    this._onKeyDown = (event) => this._handleKey(event);
    window.addEventListener("keydown", this._onKeyDown, true);
    const onSceneMode = ({ active, pending }) => {
      if (!active && !pending) return;
      this.cancelPlacement();
      this.closePanel(false);
    };
    ctx.events.on("photo:change", onSceneMode);
    ctx.events.on("exploration:change", onSceneMode);
    ctx.events.on("tap", () => {
      if (this.selectedEntry) this._selectPlaced(null);
    });
    this._restoreCurrentLayout();
  }

  /* ---------------------------------------------------------------- UI ---- */
  _build() {
    this.launch = el("button", "wg-aholo-launch");
    this.launch.type = "button";
    this.launch.setAttribute("aria-controls", "aholo-workbench");
    this.launch.setAttribute("aria-expanded", "false");
    this.launch.innerHTML =
      '<span class="wg-aholo-spark" aria-hidden="true">✦</span>' +
      '<span class="wg-aholo-launch-copy"><b>Aholo</b><small>造物 / Create</small></span>';
    this.launch.addEventListener("click", () =>
      this.open ? this.closePanel() : this.openPanel(),
    );
    document.body.append(this.launch);

    this.overlay = el("aside", "wg-aholo-overlay");
    this.overlay.id = "aholo-workbench";
    this.overlay.hidden = true;
    this.overlay.setAttribute("aria-label", "Aholo 造物工作台");
    this.panel = el("div", "wg-aholo-panel");
    this.overlay.append(this.panel);

    const header = el("div", "wg-aholo-head");
    const brand = el("div", "wg-aholo-brand");
    brand.innerHTML =
      '<span class="wg-aholo-brand-mark">A</span>' +
      "<span><b>AHOLO LUX3D</b><small>造物工作台</small></span>";
    this.closeButton = el("button", "wg-aholo-close", "×");
    this.closeButton.type = "button";
    this.closeButton.setAttribute("aria-label", "收起造物工作台");
    this.closeButton.addEventListener("click", () => this.closePanel());
    header.append(brand, this.closeButton);

    const lead = el(
      "p",
      "wg-aholo-lead",
      "用照片或文字生成地标。生成期间可以继续观察和操作山谷。",
    );

    const tabs = el("div", "wg-aholo-tabs");
    this.tabButtons = new Map();
    for (const [id, label] of [
      ["photo", "照片 / Photo"],
      ["text", "文字 / Text"],
      ["models", "我的模型"],
      ["saves", "山谷存档"],
    ]) {
      const button = el("button", "wg-aholo-tab", label);
      button.type = "button";
      button.dataset.tab = id;
      button.addEventListener("click", () => this.setTab(id));
      this.tabButtons.set(id, button);
      tabs.append(button);
    }

    this.panes = {};
    const panePhoto = el("div", "wg-aholo-pane");
    this.drop = el("label", "wg-aholo-drop");
    const dropIcon = el("span", "wg-aholo-drop-icon", "＋");
    dropIcon.setAttribute("aria-hidden", "true");
    this.dropTitle = el("b", "", "上传照片");
    this.dropHelp = el(
      "small",
      "",
      "同一物体的不同角度，第一张作为主视角 · PNG / JPG / WebP · 最多 32 张，合计 12 MB",
    );
    this.photoInput = el("input", "wg-aholo-file");
    this.photoInput.type = "file";
    this.photoInput.accept = "image/png,image/jpeg,image/webp";
    this.photoInput.multiple = true;
    this.photoInput.addEventListener("change", () => {
      const files = Array.from(this.photoInput.files || []);
      this.photoInput.value = "";
      if (files.length) this._addPhotos(files);
    });
    this.drop.append(dropIcon, this.dropTitle, this.dropHelp, this.photoInput);
    this.photoList = el("ul", "wg-aholo-photo-list");
    this.photoList.setAttribute("aria-label", "已选视角");
    this._renderPhotos();
    this.drop.addEventListener("dragover", (event) => {
      event.preventDefault();
      this.drop.classList.add("is-over");
    });
    this.drop.addEventListener("dragleave", () =>
      this.drop.classList.remove("is-over"),
    );
    this.drop.addEventListener("drop", (event) => {
      event.preventDefault();
      this.drop.classList.remove("is-over");
      const files = Array.from(event.dataTransfer?.files || []);
      if (files.length) this._addPhotos(files);
    });
    panePhoto.append(this.photoList, this.drop);

    const paneText = el("div", "wg-aholo-pane");
    this.promptInput = el("textarea", "wg-aholo-prompt");
    this.promptInput.placeholder =
      "例如：一座长满青苔的小石庙，手工陶土质感，有一个小铃铛…";
    this.promptInput.maxLength = 1200;
    const styleRow = el("label", "wg-aholo-field");
    styleRow.append(el("span", "", "风格 / Style"));
    this.styleSelect = el("select", "wg-aholo-select");
    for (const [value, label] of STYLES) {
      const option = el("option", "", label);
      option.value = value;
      this.styleSelect.append(option);
    }
    this.styleSelect.value = this.style;
    this.styleSelect.addEventListener("change", () => {
      this.style = this.styleSelect.value;
    });
    styleRow.append(this.styleSelect);
    paneText.append(this.promptInput, styleRow);

    const paneModels = el("div", "wg-aholo-pane");
    this.modelsHint = el("p", "wg-aholo-hint");
    this.modelsGrid = el("div", "wg-aholo-models");
    this.modelThumbnails = new ModelThumbnails();
    this.thumbnailObserver = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting || !target.isConnected) continue;
          this.thumbnailObserver.unobserve(target);
          this._loadModelThumbnail(target);
        }
      },
      { root: this.panel },
    );
    paneModels.append(this.modelsHint, this.modelsGrid);

    this.panes.photo = panePhoto;
    this.panes.text = paneText;
    this.panes.models = paneModels;
    this.panes.saves = this._buildSaves();

    this.options = el("div", "wg-aholo-options");
    const roleField = el("label", "wg-aholo-field");
    roleField.append(el("span", "", "摆放行为"));
    this.roleSelect = el("select", "wg-aholo-select");
    for (const role of ROLES) {
      const option = el("option", "", role.label);
      option.value = role.id;
      this.roleSelect.append(option);
    }
    this.roleSelect.addEventListener("change", () => {
      this.views[this.tab].role = this.roleSelect.value;
      this._updateRoleHint();
    });
    roleField.append(this.roleSelect);
    const faceField = el("label", "wg-aholo-field");
    faceField.append(el("span", "", "精度 / Detail"));
    this.faceSelect = el("select", "wg-aholo-select");
    for (const [value, label] of FACE_COUNTS) {
      const option = el("option", "", label);
      option.value = String(value);
      this.faceSelect.append(option);
    }
    this.faceSelect.addEventListener("change", () => {
      this.views[this.tab].faceCount = Number(this.faceSelect.value);
    });
    faceField.append(this.faceSelect);
    this.options.append(roleField, faceField);
    this.roleHint = el("p", "wg-aholo-hint");

    this.statusEl = el("div", "wg-aholo-status");
    this.statusEl.hidden = true;
    this.statusText = el("div", "wg-aholo-status-text");
    this.statusDetail = el("div", "wg-aholo-status-detail");
    this.retryPollBtn = el("button", "wg-aholo-btn", "继续查询 / Retry status");
    this.retryPollBtn.type = "button";
    this.retryPollBtn.hidden = true;
    this.retryPollBtn.addEventListener("click", () =>
      this._startPolling(this.tab),
    );
    const progress = el("div", "wg-aholo-progress");
    this.progressBar = el("span", "wg-aholo-progress-bar");
    progress.append(this.progressBar);
    this.statusEl.append(
      this.statusText,
      progress,
      this.statusDetail,
      this.retryPollBtn,
    );

    this.resultEl = el("div", "wg-aholo-result");
    this.resultEl.hidden = true;
    this.resultImage = el("img", "wg-aholo-result-image");
    this.resultImage.alt = "Generated landmark";
    this.resultInfo = el("div", "wg-aholo-result-info");
    this.resultPlaceholder = el(
      "div",
      "wg-aholo-result-placeholder",
      "Aholo Lux3D",
    );
    const resultCopy = el("div", "wg-aholo-result-copy");
    const resultKicker = el(
      "small",
      "wg-aholo-kicker",
      "GENERATED WITH AHOLO LUX3D",
    );
    const resultButtons = el("div", "wg-aholo-result-buttons");
    this.placeBtn = el(
      "button",
      "wg-aholo-btn wg-aholo-primary",
      "放入山谷 / Place",
    );
    this.placeBtn.type = "button";
    this.placeBtn.disabled = true;
    this.placeBtn.addEventListener("click", () => this.beginPlacement());
    this.againBtn = el("button", "wg-aholo-btn", "再生成 / Again");
    this.againBtn.type = "button";
    this.againBtn.addEventListener("click", () => {
      const view = this.views[this.tab];
      view.result = null;
      view.template = null;
      this._setStatus(this.tab, null);
      (this.tab === "photo" ? this.photoInput : this.promptInput).focus();
    });
    resultButtons.append(this.placeBtn, this.againBtn);
    resultCopy.append(resultKicker, this.resultInfo, resultButtons);
    this.resultEl.append(this.resultImage, this.resultPlaceholder, resultCopy);

    this.footer = el("div", "wg-aholo-footer");
    this.generateBtn = el(
      "button",
      "wg-aholo-btn wg-aholo-primary wg-aholo-generate",
      "生成 / Generate",
    );
    this.generateBtn.type = "button";
    this.generateBtn.addEventListener("click", () => this.generate());
    const note = el(
      "p",
      "wg-aholo-note",
      "由 Aholo Lux3D 生成 · 图片与提示词只用于本次生成",
    );
    this.footer.append(this.generateBtn, note);

    this.modelResult = el("div", "");
    this.modelResult.append(this.statusEl, this.resultEl);

    this.editTools = el("div", "wg-aholo-edit-tools");
    this.editHint = el("p", "wg-aholo-hint");
    this.editModes = el("div", "wg-aholo-edit-modes");
    this.editModes.hidden = true;
    this.editModes.setAttribute("role", "group");
    this.editModes.setAttribute("aria-label", "地标操控");
    for (const [mode, label, glyph] of [
      ["translate", "移动", "✥"],
      ["rotate", "旋转", "↻"],
      ["scale", "缩放", "⤢"],
    ]) {
      const button = el("button", "wg-aholo-btn");
      const icon = el("span", "wg-aholo-edit-icon", glyph);
      icon.setAttribute("aria-hidden", "true");
      button.append(icon, label);
      button.type = "button";
      button.dataset.transformMode = mode;
      button.addEventListener("click", () => this._setTransformMode(mode));
      this.editModes.append(button);
    }
    this.editTools.append(this.editHint);
    this._renderEditTools();

    this.panel.append(
      header,
      lead,
      this.editTools,
      tabs,
      panePhoto,
      paneText,
      paneModels,
      this.panes.saves,
      this.options,
      this.roleHint,
      this.modelResult,
      this.footer,
    );
    document.body.append(this.overlay, this.editModes);
    this.setTab("photo");
  }

  _updateRoleHint() {
    const id = this.views[this.tab].role;
    const role = ROLES.find((item) => item.id === id) || DEFAULT_ROLE;
    this.roleHint.textContent = `放入山谷后：${role.hint}`;
  }

  setTab(tab) {
    if (tab !== this.tab) this._clearCardPlacement();
    this.tab = tab;
    for (const [id, button] of this.tabButtons) {
      const active = id === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    }
    for (const [id, pane] of Object.entries(this.panes)) {
      pane.hidden = id !== tab;
    }
    const generating = tab === "photo" || tab === "text";
    this.options.hidden =
      this.roleHint.hidden =
      this.footer.hidden =
        !generating;
    this.modelResult.hidden = !generating;
    if (generating) {
      this.roleSelect.value = this.views[tab].role;
      this.faceSelect.value = String(this.views[tab].faceCount);
      this._updateRoleHint();
    }
    this._renderView();
    if (tab === "models") this._loadModels();
    if (tab === "saves") this._renderSaves();
  }

  _buildSaves() {
    const pane = el("div", "wg-aholo-pane wg-aholo-saves");
    const form = el("form", "wg-aholo-save-form");
    this.saveName = el("input", "wg-aholo-select");
    this.saveName.setAttribute("aria-label", "存档名称");
    this.saveName.placeholder = "存档名称，例如「柳岸石灯」";
    this.saveName.maxLength = 60;
    this.saveName.required = true;
    this.saveButton = el(
      "button",
      "wg-aholo-btn wg-aholo-primary",
      "保存为新存档",
    );
    this.saveButton.type = "submit";
    form.append(this.saveName, this.saveButton);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = this.saveName.value.trim();
      if (!name || this.layoutBusy || this.pendingLayout) return;
      try {
        this.saves.save(name, this._placementRecords());
        this.saveName.value = "";
        this.layoutNotice = `已保存「${name}」。`;
      } catch {
        this.layoutNotice = "存档保存失败，请检查浏览器存储空间。";
      }
      this._renderSaves();
    });

    const actions = el("div", "wg-aholo-save-actions");
    this.resetLayoutButton = el("button", "wg-aholo-btn", "恢复原始山谷");
    this.resetLayoutButton.type = "button";
    this.resetLayoutButton.addEventListener("click", () =>
      this._applyLayout([], "已恢复原始山谷，命名存档仍可载入。"),
    );
    this.retryLayoutButton = el("button", "wg-aholo-btn", "重试上次布局");
    this.retryLayoutButton.type = "button";
    this.retryLayoutButton.hidden = true;
    this.retryLayoutButton.addEventListener("click", () =>
      this._restoreCurrentLayout(),
    );
    actions.append(this.resetLayoutButton, this.retryLayoutButton);
    this.saveNotice = el("p", "wg-aholo-save-note");
    this.saveNotice.setAttribute("role", "status");
    this.saveList = el("div", "wg-aholo-save-list");
    pane.append(
      el(
        "p",
        "wg-aholo-save-note",
        "地标的位置和朝向会自动保存在当前浏览器。载入存档或恢复原始山谷会替换当前摆放。",
      ),
      form,
      actions,
      this.saveNotice,
      this.saveList,
    );
    return pane;
  }

  _renderSaves() {
    const locked = this.layoutBusy || Boolean(this.pendingLayout);
    this.saveName.disabled = this.saveButton.disabled = locked;
    this.resetLayoutButton.disabled = this.layoutBusy;
    this.retryLayoutButton.hidden = !this.pendingLayout;
    this.retryLayoutButton.disabled = this.layoutBusy;
    this.saveNotice.textContent =
      this.layoutNotice || `当前摆放 ${this.placed.length} 个地标。`;
    this.saveList.replaceChildren();
    let saves;
    try {
      ({ saves } = this.saves.load());
    } catch {
      this.saveList.append(
        el("p", "wg-aholo-save-note", "暂时无法读取本地存档。"),
      );
      return;
    }
    if (!saves.length) {
      this.saveList.append(el("p", "wg-aholo-save-note", "还没有命名存档。"));
      return;
    }
    for (const save of saves) {
      const row = el("div", "wg-aholo-save-row");
      const name = el("div", "wg-aholo-save-name");
      name.append(
        el("b", "", save.name),
        el("small", "", `${save.placements.length} 个地标`),
      );
      const actions = el("div", "wg-aholo-save-actions");
      const load = el("button", "wg-aholo-btn", "载入");
      const remove = el("button", "wg-aholo-btn", "删除");
      load.type = remove.type = "button";
      load.disabled = remove.disabled = this.layoutBusy;
      load.setAttribute("aria-label", `载入 ${save.name}`);
      remove.setAttribute("aria-label", `删除 ${save.name}`);
      load.addEventListener("click", () =>
        this._applyLayout(save.placements, `已载入「${save.name}」。`),
      );
      remove.addEventListener("click", () => {
        if (!window.confirm(`删除存档「${save.name}」？`)) return;
        try {
          this.saves.remove(save.id);
          this.layoutNotice = `已删除「${save.name}」。`;
        } catch {
          this.layoutNotice = "删除失败，请检查浏览器存储。";
        }
        this._renderSaves();
      });
      actions.append(load, remove);
      row.append(name, actions);
      this.saveList.append(row);
    }
  }

  _restoreCurrentLayout() {
    try {
      const { current } = this.saves.load();
      if (!current.length) return;
      this.pendingLayout = current;
      this._applyLayout(current, "已恢复上次摆放。", false);
    } catch {
      this.layoutNotice = "暂时无法读取上次布局。";
    }
  }

  async _applyLayout(placements, message, remember = true) {
    if (this.layoutBusy) return;
    this.layoutBusy = true;
    this.layoutNotice = "正在载入布局…";
    if (this.tab === "saves") this._renderSaves();
    try {
      const loading = new Map();
      for (const { url, height, template } of this.placed) {
        loading.set(`${url}|${height}`, template);
      }
      for (const { result, template } of Object.values(this.views)) {
        if (template) {
          loading.set(`${result.modelUrl}|${template.height}`, template.root);
        }
      }
      const models = await Promise.all(
        placements.map(({ url, height }) => {
          const key = `${url}|${height}`;
          if (!loading.has(key)) {
            loading.set(
              key,
              this._fetchTemplate(url, { height }).then(({ root }) => root),
            );
          }
          return loading.get(key);
        }),
      );
      if (remember) this.saves.setCurrent(placements);
      this._disposeGhost();
      this.placing = null;
      this._clearPlacements();
      placements.forEach((placement, index) =>
        this._addPlacement(models[index], placement),
      );
      this.pendingLayout = null;
      this.layoutNotice = message;
    } catch {
      this.layoutNotice = "布局载入失败。请检查模型文件或浏览器存储后重试。";
      if (this.tab !== "saves") this._toast(this.layoutNotice, 5000);
    } finally {
      this.layoutBusy = false;
      if (this.tab === "saves") this._renderSaves();
    }
  }

  openPanel() {
    if (this.open) return;
    this.open = true;
    this.overlay.hidden = false;
    this.overlay.classList.add("is-open");
    document.body.classList.add("aholo-open");
    this.launch.setAttribute("aria-expanded", "true");
    this.setTab(this.tab);
    const focusTarget =
      this.tab === "text" ? this.promptInput : this.closeButton;
    focusTarget.focus({ preventScroll: true });
  }

  closePanel(restoreFocus = true) {
    if (!this.open) return;
    const hadFocus =
      this.overlay.contains(document.activeElement) ||
      this.editModes.contains(document.activeElement);
    this._clearCardPlacement();
    this._selectPlaced(null);
    this.open = false;
    this.overlay.classList.remove("is-open");
    this.overlay.hidden = true;
    document.body.classList.remove("aholo-open");
    this.launch.setAttribute("aria-expanded", "false");
    if (restoreFocus && hadFocus) this.launch.focus({ preventScroll: true });
  }

  _setStatus(tab, status, text, progress, detail) {
    this.views[tab].status = status && { status, text, progress, detail };
    this._renderView(tab);
  }

  _renderView(tab = this.tab) {
    if (tab !== this.tab || (tab !== "photo" && tab !== "text")) return;
    const { status, result, template, thumbnail, busy, jobId } =
      this.views[tab];
    const locked = Boolean(busy || jobId);
    this.generateBtn.disabled = locked;
    this.roleSelect.disabled = locked;
    this.faceSelect.disabled = locked;
    if (tab === "photo") {
      this.photoInput.disabled = locked;
      for (const button of this.photoList.querySelectorAll("button")) {
        button.disabled = locked;
      }
    } else {
      this.promptInput.disabled = locked;
      this.styleSelect.disabled = locked;
    }
    this.statusEl.hidden = !status;
    if (status) {
      this.statusEl.dataset.state = status.status;
      this.statusText.textContent = status.text;
      this.statusDetail.textContent = status.detail || "";
      this.statusDetail.hidden = !status.detail;
      this.progressBar.style.width =
        Math.max(0, Math.min(1, status.progress || 0)) * 100 + "%";
      this.retryPollBtn.hidden = !jobId || busy;
    }
    this.resultEl.hidden = !result;
    if (!result) return;
    const visual = thumbnail || result.thumbUrl || result.inputUrl;
    this.resultImage.hidden = !visual;
    this.resultPlaceholder.hidden = Boolean(visual);
    if (visual && this.resultImage.getAttribute("src") !== visual) {
      this.resultImage.src = visual;
    }
    this._showMeta(result.meta, result);
    this.placeBtn.disabled = !template;
    this.placeBtn.textContent =
      template || status?.status === "error" ? "放入山谷 / Place" : "加载模型…";
  }

  _toast(text, duration = 3600) {
    this.ctx.modules?.hud?.toast?.(text, duration);
  }

  _addPhotos(files) {
    const view = this.views.photo;
    if (view.busy || view.jobId) return;
    if (
      files.some(
        ({ type, size }) => !/^image\/(png|jpeg|webp)$/.test(type) || !size,
      )
    ) {
      this._setStatus(
        "photo",
        "error",
        "请上传有效的 PNG / JPG / WebP 图片。",
        0,
      );
      return;
    }
    if (this.photoFiles.length + files.length > MAX_PHOTOS) {
      this._setStatus("photo", "error", "最多添加 32 张照片。", 0);
      return;
    }
    const existingBytes = this.photoFiles.reduce(
      (sum, { file }) => sum + file.size,
      0,
    );
    if (
      files.reduce((sum, file) => sum + file.size, existingBytes) >
      MAX_UPLOAD_BYTES
    ) {
      this._setStatus(
        "photo",
        "error",
        "照片合计超过 12 MB，请压缩后再试。",
        0,
      );
      return;
    }
    this.photoFiles.push(
      ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    );
    this._renderPhotos();
    this._setStatus("photo", null);
  }

  _renderPhotos() {
    const hasPhotos = this.photoFiles.length > 0;
    this.drop.classList.toggle("has-photo", hasPhotos);
    this.dropTitle.textContent = hasPhotos ? "添加视角" : "上传照片";
    this.dropHelp.hidden = hasPhotos;
    this.photoList.hidden = !hasPhotos;
    this.photoList.replaceChildren(
      ...this.photoFiles.map(({ file, url }, index) => {
        const item = el("li", "wg-aholo-photo-item");
        const image = el("img", "wg-aholo-photo-image");
        image.src = url;
        image.alt = "";
        const name = el("span", "wg-aholo-photo-label", file.name);
        name.title = file.name;
        const label = el("span", "wg-aholo-photo-caption");
        label.append(
          el("b", "", index === 0 ? "主视角" : `视角 ${index + 1}`),
          name,
        );
        const remove = el("button", "wg-aholo-photo-remove", "×");
        remove.type = "button";
        remove.setAttribute("aria-label", `移除 ${file.name}`);
        remove.addEventListener("click", () => {
          const view = this.views.photo;
          if (view.busy || view.jobId) return;
          URL.revokeObjectURL(url);
          this.photoFiles.splice(index, 1);
          this._renderPhotos();
          this._setStatus("photo", null);
          (
            this.photoList.children[
              Math.min(index, this.photoFiles.length - 1)
            ]?.querySelector("button") || this.photoInput
          ).focus();
        });
        item.append(image, label, remove);
        return item;
      }),
    );
  }

  /* --------------------------------------------------------- generation --- */
  async generate() {
    const tab = this.tab;
    if (tab !== "photo" && tab !== "text") return;
    const view = this.views[tab];
    if (view.busy || view.jobId) return;
    let body;
    const isJson = tab === "text";
    if (!isJson) {
      if (!this.photoFiles.length) {
        this._setStatus(tab, "error", "先选一张照片，或者切到“文字”。", 0);
        return;
      }
      body = new FormData();
      for (const { file } of this.photoFiles) {
        body.append("photo", file, file.name || "reference.png");
      }
      body.append("role", view.role);
      body.append("faceCount", String(view.faceCount));
    } else {
      const prompt = this.promptInput.value.trim();
      if (!prompt) {
        this._setStatus(tab, "error", "先写一句你想生成的东西。", 0);
        return;
      }
      body = {
        prompt,
        style: this.style,
        role: view.role,
        faceCount: view.faceCount,
      };
    }
    view.busy = true;
    view.result = null;
    view.template = null;
    this._setStatus(tab, "queued", "正在连接 Aholo Lux3D…", 0.03);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        ...(isJson
          ? {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }
          : { body }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(data?.error || "Generation request failed.");
      if (typeof data?.jobId !== "string" || !data.jobId)
        throw new Error("服务器没有返回任务编号。");
      view.jobId = data.jobId;
      this._startPolling(tab);
    } catch (error) {
      view.busy = false;
      this._setStatus(
        tab,
        "error",
        "生成请求失败。",
        0,
        error.message || String(error),
      );
    }
  }

  _startPolling(tab) {
    const view = this.views[tab];
    if (!view?.jobId) return;
    view.busy = true;
    view.pollFailures = 0;
    view.pollDeadline = Date.now() + POLL_MAX_WAIT_MS;
    this._setStatus(tab, "running", "正在查询生成任务…", 0.2);
    this._poll(tab, ++view.pollToken);
  }

  _pausePolling(tab, detail) {
    this.views[tab].busy = false;
    this._setStatus(tab, "error", "暂时无法确认生成结果。", 0, detail);
  }

  async _poll(tab, token) {
    const view = this.views[tab];
    if (token !== view.pollToken) return;
    try {
      const response = await fetch(
        "/api/jobs/" + encodeURIComponent(view.jobId),
        { signal: AbortSignal.timeout(10_000) },
      );
      const job = await response.json().catch(() => ({}));
      if (token !== view.pollToken) return;
      if (response.status === 404) {
        view.busy = false;
        view.jobId = null;
        this._setStatus(tab, "error", "找不到这次生成任务。", 0, job?.error);
        return;
      }
      if (!response.ok)
        throw new Error(
          job?.error || `任务查询失败（HTTP ${response.status}）。`,
        );
      if (job?.id !== view.jobId || !job.status)
        throw new Error("服务器没有返回有效的任务状态。");
      view.pollFailures = 0;
      if (job.status === "done") {
        view.busy = false;
        view.jobId = null;
        if (tab === "photo") {
          for (const { url } of this.photoFiles) URL.revokeObjectURL(url);
          this.photoFiles = [];
          this._renderPhotos();
        } else {
          this.promptInput.value = "";
        }
        if (this.tab === "models") this._loadModels();
        this._selectResult(tab, { ...job, role: job.role || view.role });
        return;
      }
      if (job.status === "error") {
        view.busy = false;
        view.jobId = null;
        this._setStatus(tab, "error", "这次生成没有完成。", 0, job.error);
        return;
      }
      this._applyJob(tab, job);
      if (Date.now() >= view.pollDeadline) {
        this._pausePolling(tab, "任务仍在处理中，可以继续查询同一任务。");
        return;
      }
      setTimeout(() => this._poll(tab, token), POLL_INTERVAL_MS);
    } catch (error) {
      if (token !== view.pollToken) return;
      const failures = ++view.pollFailures;
      if (failures >= POLL_MAX_FAILURES || Date.now() >= view.pollDeadline) {
        this._pausePolling(tab, error.message || "任务状态查询失败。");
        return;
      }
      view.status.detail = "连接暂时中断，正在重新查询同一任务…";
      this._renderView(tab);
      setTimeout(
        () => this._poll(tab, token),
        POLL_INTERVAL_MS * 2 ** (failures - 1),
      );
    }
  }

  _applyJob(tab, job) {
    const labels = {
      queued: "排队中…",
      creating: "Aholo Lux3D 正在准备…",
      running: "Aholo Lux3D 正在生成…",
      downloading: "正在下载并整理模型…",
    };
    this._setStatus(
      tab,
      job.status,
      job.message || labels[job.status] || "处理中…",
      job.progress,
      job.error || (job.taskId ? "Aholo task #" + job.taskId : ""),
    );
  }

  async _selectResult(tab, result, height = TARGET_HEIGHT) {
    const view = this.views[tab];
    const previous = view.result;
    const reuse =
      previous?.modelUrl === result.modelUrl &&
      view.template?.height === height;
    view.result = result;
    if (!reuse) view.template = null;
    view.thumbnail = null;
    this._setStatus(tab, null);
    try {
      if (!result.modelUrl) throw new Error("任务未返回模型文件。");
      if (!view.template) {
        const template = await this._fetchTemplate(result.modelUrl, { height });
        if (view.result !== result) return;
        view.template = template;
        this._renderView(tab);
      }
    } catch (error) {
      if (view.result !== result) return;
      this._setStatus(
        tab,
        "error",
        "模型已生成，但加载失败。",
        1,
        error.message || String(error),
      );
      return;
    }
    try {
      const thumbnail = await this.modelThumbnails.get(result.modelUrl);
      if (view.result !== result) return;
      view.thumbnail = thumbnail;
      this._renderView(tab);
    } catch {
      // Keep the provider thumbnail or reference photo if rendering fails.
    }
  }

  _showMeta(meta, job) {
    const bits = [];
    if (meta?.triangles) bits.push(meta.triangles.toLocaleString() + " tris");
    if (meta?.bytes) bits.push(formatBytes(meta.bytes));
    if (job?.elapsedMs) bits.push(Math.round(job.elapsedMs / 1000) + "s");
    if (job?.taskId) bits.push("Aholo #" + job.taskId);
    this.resultInfo.textContent =
      bits.join(" · ") || "Generated with Aholo Lux3D";
  }

  async _fetchTemplate(url, meta) {
    const height = Math.max(0.2, Number(meta?.height) || TARGET_HEIGHT);
    const placed = this.placed.find(
      (entry) => entry.url === url && entry.height === height,
    );
    if (placed) return { root: placed.template, height };
    for (const { result, template } of Object.values(this.views)) {
      if (result?.modelUrl === url && template?.height === height)
        return template;
    }
    const key = `${url}|${height}`;
    if (!this.loadingTemplates.has(key)) {
      const loading = MODEL_LOADER.loadAsync(url)
        .then((gltf) => {
          const template = this._prepareModel(gltf, { ...meta, height });
          this.editAnchors.set(
            template.root,
            getModelAnchorPoints(template.root),
          );
          return template;
        })
        .finally(() => this.loadingTemplates.delete(key));
      this.loadingTemplates.set(key, loading);
    }
    return this.loadingTemplates.get(key);
  }

  _prepareModel(gltf, meta) {
    if (!gltf?.scene)
      throw new Error("The GLB did not contain a renderable scene.");
    const source = gltf.scene;
    source.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = true;
      object.receiveShadow = true;
      object.frustumCulled = true;
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) {
        if (!material) continue;
        if (material.transparent) {
          material.alphaTest = Math.max(material.alphaTest || 0, 0.08);
        }
        material.transparent = false;
        material.opacity = 1;
        material.depthWrite = true;
        material.depthTest = true;
        material.alphaToCoverage = false;
        if ("transmission" in material) material.transmission = 0;
        material.envMapIntensity = 0.7;
        material.needsUpdate = true;
        if (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial)
          this._patchWeatherMaterial(material);
      }
    });
    const wrapper = new Ry.Group();
    wrapper.name = "AholoLandmark";
    const pivot = new Ry.Group();
    pivot.name = "AholoLandmarkPivot";
    pivot.add(source);
    wrapper.add(pivot);
    wrapper.updateMatrixWorld(true);
    let box = new Ry.Box3().setFromObject(pivot);
    const size = box.getSize(new Ry.Vector3());
    if (!Number.isFinite(size.y) || size.y <= 1e-6)
      throw new Error("The generated model has no measurable height.");
    const targetHeight = Math.max(0.2, Number(meta?.height) || TARGET_HEIGHT);
    const scale = targetHeight / size.y;
    pivot.scale.setScalar(scale);
    wrapper.updateMatrixWorld(true);
    box = new Ry.Box3().setFromObject(pivot);
    const center = box.getCenter(new Ry.Vector3());
    pivot.position.x -= center.x;
    pivot.position.z -= center.z;
    pivot.position.y -= box.min.y;
    wrapper.updateMatrixWorld(true);
    wrapper.userData.aholo = { ...(meta || {}), height: targetHeight };
    return { root: wrapper, height: targetHeight };
  }

  _patchWeatherMaterial(material) {
    if (material.userData.aholoWeather) return;
    material.userData.aholoWeather = true;
    const previous = material.onBeforeCompile;
    material.onBeforeCompile = (shader, renderer) => {
      if (typeof previous === "function")
        previous.call(material, shader, renderer);
      Object.assign(shader.uniforms, this.ctx.uniforms);
      shader.fragmentShader =
        COMMON_GLSL +
        shader.fragmentShader.replace(
          "#include <normal_fragment_maps>",
          `#include <normal_fragment_maps>
        vec3 aholoWorldPos = cameraPosition - vViewPosition * mat3(viewMatrix);
        vec3 aholoWorldNormal = transformNormalByInverseViewMatrix(nonPerturbedNormal, viewMatrix);
        vec3 aholoFaceNormal = cross(dFdx(vViewPosition), dFdy(vViewPosition));
        float aholoFaceUp = transformNormalByInverseViewMatrix(aholoFaceNormal, viewMatrix).y;
        // Keep smoothed corners from carrying snow down the actual side faces.
        float aholoUp = min(aholoWorldNormal.y, aholoFaceUp + 0.12);
        float aholoGrain = wgNoise3(aholoWorldPos * 43.0);
        float aholoCatch = smoothstep(0.38, 0.86, aholoUp + (aholoGrain - 0.5) * 0.12);
        float aholoSnow = smoothstep(0.18, 0.8, snowCover(aholoWorldPos.xz, aholoWorldNormal) * aholoCatch);
        vec4 aholoGround = groundAt(aholoWorldPos.xz);
        float aholoFrost = aholoGround.w * smoothstep(-0.3, 0.7, aholoUp) * 0.4 * (1.0 - aholoSnow);
        vec3 aholoSnowColor = vec3(0.64, 0.68, 0.72) * mix(0.95, 1.05, aholoGrain);
        diffuseColor.rgb *= mix(1.0, 0.64, aholoGround.y * 0.72);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.78, 0.83, 0.9), aholoFrost);
        diffuseColor.rgb = mix(diffuseColor.rgb, aholoSnowColor, aholoSnow * 0.94);
        roughnessFactor = mix(roughnessFactor, max(roughnessFactor, 0.9), aholoFrost);
        roughnessFactor = mix(roughnessFactor, 0.84, aholoSnow);
        metalnessFactor *= 1.0 - aholoSnow;
        normal = normalize(mix(normal, nonPerturbedNormal, aholoSnow * 0.7));`,
        );
    };
    material.customProgramCacheKey = () => "aholo-weather-3";
    material.needsUpdate = true;
  }

  /* ------------------------------------------------------- model library --- */
  _modelCard(title, subtitle, result) {
    const card = el("button", "wg-aholo-example");
    card.type = "button";
    const copy = el("span", "wg-aholo-example-copy");
    const action = el("span", "wg-aholo-card-action", "放入山谷");
    copy.append(el("b", "", title), el("small", "", subtitle), action);
    card.append(copy);
    card.addEventListener("click", () =>
      this._placeFromCard(card, action, result),
    );
    return card;
  }

  async _loadModelThumbnail(preview) {
    const image = preview.querySelector("img");
    const label = preview.querySelector(".wg-aholo-model-preview-label");
    try {
      try {
        image.src = await this.modelThumbnails.get(preview.dataset.modelUrl);
        await image.decode();
      } catch (error) {
        const fallback = preview.dataset.thumbUrl;
        if (!fallback) throw error;
        image.src = fallback;
        await image.decode();
      }
      image.hidden = false;
      label.hidden = true;
    } catch {
      label.textContent = "预览不可用";
    }
  }

  async _loadModels() {
    if (this.modelsLoading) return;
    this.modelsLoading = true;
    this.modelsHint.textContent = "正在读取模型…";
    try {
      const response = await fetch("/api/models", {
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("Could not load models");
      const models = await response.json();
      if (!Array.isArray(models)) throw new Error("Invalid model library");
      this.modelsHint.textContent = models.length
        ? "点击模型卡片，再到山谷画面里选择位置。"
        : "还没有生成的模型。可以从照片或文字开始。";
      this.thumbnailObserver.disconnect();
      this.modelsGrid.replaceChildren(
        ...models.map((model) => {
          const role = (
            ROLES.find(({ id }) => id === model.role) || DEFAULT_ROLE
          ).label.split(" / ")[0];
          const title = `${role} #${model.taskId || model.id.slice(0, 8)}`;
          const type = model.mode === "photo" ? "照片生成" : "文字生成";
          const date = new Date(model.createdAt).toLocaleDateString("zh-CN");
          const card = this._modelCard(title, `${type} · ${date}`, model);
          const preview = el("span", "wg-aholo-model-preview");
          preview.setAttribute("aria-hidden", "true");
          preview.dataset.modelUrl = model.modelUrl;
          preview.dataset.thumbUrl = model.thumbUrl || "";
          const image = el("img", "wg-aholo-model-image");
          image.alt = "";
          image.hidden = true;
          preview.append(
            image,
            el("span", "wg-aholo-model-preview-label", "预览加载中…"),
          );
          card.prepend(preview);
          this.thumbnailObserver.observe(preview);
          return card;
        }),
      );
    } catch {
      this.modelsHint.textContent = "暂时无法读取模型库，请确认后端已启动。";
    } finally {
      this.modelsLoading = false;
    }
  }

  async _placeFromCard(card, action, result) {
    if (this.cardPlacement?.card === card || !this._canPlace()) return;
    const view = this.views[this.tab];
    this._clearCardPlacement();
    this._disposeGhost();
    this.placing = null;
    const request = { card, action };
    this.cardPlacement = request;
    card.setAttribute("aria-busy", "true");
    action.textContent = "加载模型…";
    let template;
    try {
      template =
        view.result?.modelUrl === result.modelUrl &&
        view.template?.height === TARGET_HEIGHT
          ? view.template
          : await this._fetchTemplate(result.modelUrl, {
              height: TARGET_HEIGHT,
            });
    } catch {
      if (this.cardPlacement !== request) return;
      this._clearCardPlacement();
      action.textContent = "加载失败，点击重试";
      return;
    }
    if (this.cardPlacement !== request) return;
    this._clearCardPlacement();
    view.result = result;
    view.template = template;
    this.beginPlacement();
  }

  _clearCardPlacement() {
    if (!this.cardPlacement) return;
    const { card, action } = this.cardPlacement;
    this.cardPlacement = null;
    card.removeAttribute("aria-busy");
    action.textContent = "放入山谷";
  }

  /* ---------------------------------------------------------- placement --- */
  _installInput() {
    this._unregister = this.ctx.input.addHandler({
      name: "aholo-placement",
      priority: 120,
      tools: ["hand"],
      cursor: "crosshair",
      activeCursor: "crosshair",
      hitTest: (pointer) => {
        if (!this.placing || this.layoutBusy) return null;
        const hit = this._placementHit(pointer.ray);
        if (!hit) return null;
        return {
          distance: this.camera.position.distanceTo(hit.point),
          point: hit.point,
          valid: hit.valid,
          reason: hit.reason,
        };
      },
      onHover: (hit) => {
        if (this.placing) this._updateGhost(hit);
      },
      onDown: (hit, pointer) => {
        if (!this.placing || this.layoutBusy) return false;
        const result = this._placementHit(pointer.ray);
        if (!result?.valid) {
          this._toast(result?.reason || "这里不适合放置，换一片空地。");
          return true;
        }
        this._place(result.point);
        return true;
      },
      onMove: (pointer) => {
        if (this.placing) this._updateGhost(this._placementHit(pointer.ray));
      },
      onCancel: () => this.cancelPlacement(),
    });
    this.editRaycaster = new Ry.Raycaster();
    this.ctx.input.addHandler({
      name: "aholo-transform",
      priority: 130,
      tools: "*",
      cursor: "pointer",
      activeCursor: "grabbing",
      hitTest: (pointer) => this._editHit(pointer),
      onDown: (hit, pointer) => {
        if (hit.entry) {
          this._selectPlaced(hit.entry);
          return true;
        }
        const controls = this.transformControls;
        controls.getHelper().updateMatrixWorld(true);
        controls.pointerDown({ x: pointer.ndc.x, y: pointer.ndc.y, button: 0 });
        if (!controls.dragging) return false;
        const entry = this.selectedEntry;
        const { position, quaternion, scale } = entry.root;
        this.transformDrag = {
          entry,
          position: position.clone(),
          quaternion: quaternion.clone(),
          scale: scale.x,
          scaleGesture:
            this.transformMode === "scale"
              ? this._startScaleGesture(entry, pointer)
              : null,
          surfaceY: this._editSurfaceHeight(position.x, position.z),
        };
        return true;
      },
      onMove: (pointer) => this._moveTransform(pointer),
      onUp: () => this._finishTransform(true),
      onCancel: () => this._finishTransform(false),
      onWheel: () => Boolean(this.transformDrag),
      onHover: (hit) => {
        if (!hit && this.transformControls && !this.transformDrag) {
          this.transformControls.axis = null;
        }
      },
    });
  }

  _renderEditTools() {
    this.editTools.hidden = !this.placed.length;
    if (!this.selectedEntry) this.editModes.hidden = true;
    for (const button of this.editModes.children) {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.transformMode === this.transformMode),
      );
    }
    this.editHint.textContent = !this.selectedEntry
      ? "点击山谷中的地标即可编辑。"
      : this.transformMode === "rotate"
        ? "拖动圆环旋转地标。"
        : this.transformMode === "scale"
          ? "拖动方块等比缩放地标。"
          : "拖动箭头移动地标，绿色箭头调节高度。";
  }

  _selectPlaced(entry) {
    if (entry === this.selectedEntry) return;
    this._finishTransform(false);
    this.selectedEntry = entry;
    if (entry) {
      if (!this.editAnchors.has(entry.template)) {
        this.editAnchors.set(
          entry.template,
          getModelAnchorPoints(entry.template),
        );
      }
      const controls = this._getTransformControls();
      controls.setMode(this.transformMode);
      controls.attach(entry.root);
    } else {
      this.transformControls?.detach();
    }
    this.ctx.input.invalidateHover();
    this._renderEditTools();
  }

  _getTransformControls() {
    if (this.transformControls) return this.transformControls;
    const controls = new TransformControls(this.camera);
    const helper = controls.getHelper();
    helper.traverse((object) => object.layers.set(TRANSFORM_LAYER));
    controls.getRaycaster().layers.set(TRANSFORM_LAYER);
    controls.setSize(0.7);
    controls.addEventListener("objectChange", () =>
      this._constrainTranslation(),
    );
    this.camera.layers.enable(TRANSFORM_LAYER);
    this.scene.add(helper);
    this.transformControls = controls;
    return controls;
  }

  _setTransformMode(mode) {
    this._finishTransform(false);
    this.transformMode = mode;
    if (this.transformControls) {
      this.transformControls.axis = null;
      this.transformControls.setMode(mode);
    }
    this.ctx.input.invalidateHover();
    this._renderEditTools();
  }

  _editHit(pointer) {
    if (
      !this.open ||
      this.placing ||
      this.cardPlacement ||
      this.layoutBusy ||
      this.pendingLayout ||
      this.ctx.modules?.hud?.settings?.open ||
      !this.placed.length
    )
      return null;
    if (this.selectedEntry) {
      this.transformControls.getHelper().updateMatrixWorld(true);
      this.transformControls.pointerHover(pointer.ndc);
      if (this.transformControls.axis) return { distance: 0 };
    }
    this.editRaycaster.ray.copy(pointer.ray);
    let nearest = null;
    for (const entry of this.placed) {
      const [hit] = this.editRaycaster.intersectObject(entry.root);
      if (hit && (!nearest || hit.distance < nearest.distance)) {
        nearest = { entry, distance: hit.distance };
      }
    }
    if (!nearest) return null;
    const ground = this.ctx.terrain.raycast(pointer.ray, this._rayPoint);
    return !ground || pointer.ray.origin.distanceTo(ground) >= nearest.distance
      ? nearest
      : null;
  }

  _editSurfaceHeight(x, z) {
    return Math.max(
      this.ctx.terrain.height(x, z),
      this.ctx.world.lakeLevel + 0.035,
    );
  }

  _startScaleGesture(entry, pointer) {
    const { root, height } = entry;
    const bounds = new Ry.Box3().setFromObject(root, true);
    const bottomOffset = bounds.isEmpty()
      ? height * 0.5
      : (root.position.y - bounds.min.y) / root.scale.y;
    // Drag away from an outer handle to grow, or up/right from the center.
    const direction = new Ry.Vector2(1, -1);
    if (this.transformControls.axis !== "XYZ") {
      const pivot = root
        .getWorldPosition(new Ry.Vector3())
        .project(this.camera);
      const { width, height } =
        this.ctx.renderer.domElement.getBoundingClientRect();
      const dx = ((pointer.ndc.x - pivot.x) * width) / 2;
      const dy = ((pivot.y - pointer.ndc.y) * height) / 2;
      if (Math.hypot(dx, dy) >= 1) direction.set(dx, dy);
    }
    return {
      x: pointer.x,
      y: pointer.y,
      direction: direction.normalize(),
      bottomOffset,
    };
  }

  _moveTransform(pointer) {
    const drag = this.transformDrag;
    if (!drag) return;
    if (drag.scaleGesture) {
      const { x, y, direction, bottomOffset } = drag.scaleGesture;
      const distance =
        (pointer.x - x) * direction.x + (pointer.y - y) * direction.y;
      const scale = Ry.MathUtils.clamp(
        drag.scale * 2 ** (distance / SCALE_DOUBLING_DISTANCE),
        MIN_PLACEMENT_SCALE,
        MAX_PLACEMENT_SCALE,
      );
      drag.entry.root.scale.setScalar(scale);
      drag.entry.root.position.y =
        drag.position.y + (scale - drag.scale) * bottomOffset;
      return;
    }
    const controls = this.transformControls;
    controls.getHelper().updateMatrixWorld(true);
    controls.pointerMove({ x: pointer.ndc.x, y: pointer.ndc.y, button: -1 });
  }

  _constrainTranslation() {
    const drag = this.transformDrag;
    if (!drag || this.transformMode !== "translate") return;
    const { position } = drag.entry.root;
    const limitX = LANDSCAPE_BOUNDS.halfW - 0.25;
    const limitZ = LANDSCAPE_BOUNDS.halfD - 0.25;
    position.x = Ry.MathUtils.clamp(position.x, -limitX, limitX);
    position.z = Ry.MathUtils.clamp(position.z, -limitZ, limitZ);
    const floor = this._editSurfaceHeight(position.x, position.z);
    position.y = Math.max(
      position.y + floor - drag.surfaceY,
      floor + drag.entry.height * drag.entry.scale * 0.5,
    );
  }

  _finishTransform(commit) {
    if (!this.transformDrag) return;
    const { entry, position, quaternion, scale } = this.transformDrag;
    this.transformDrag = null;
    this.transformControls.pointerUp(null);
    const { root } = entry;
    if (
      !commit ||
      !root.position.toArray().every(Number.isFinite) ||
      !root.quaternion.toArray().every(Number.isFinite) ||
      !Number.isFinite(root.scale.x)
    ) {
      root.position.copy(position);
      root.quaternion.copy(quaternion);
      root.scale.setScalar(scale);
      return;
    }
    if (
      root.position.equals(position) &&
      root.quaternion.equals(quaternion) &&
      root.scale.x === scale
    )
      return;
    entry.x = root.position.x;
    entry.scale = root.scale.x;
    entry.y = root.position.y - entry.height * entry.scale * 0.5;
    entry.z = root.position.z;
    if (this.transformMode === "rotate") {
      entry.pitch = root.rotation.x;
      entry.yaw = root.rotation.y;
      entry.roll = root.rotation.z;
      if (entry.role === "wind") {
        entry.windYawOffset = shortAngle(entry.yaw - this._windYaw(entry));
      }
    }
    if (entry.obstacle) {
      entry.obstacle.x = entry.x;
      entry.obstacle.z = entry.z;
      entry.obstacle.radius = Math.max(0.1, entry.height * entry.scale * 0.16);
    }
    this._savePlacementLayout();
  }

  _placementHit(ray) {
    const point = this.ctx.terrain.raycast(ray, this._rayPoint);
    if (!point) return null;
    const x = point.x;
    const z = point.z;
    const limitX = LANDSCAPE_BOUNDS.halfW - 0.25;
    const limitZ = LANDSCAPE_BOUNDS.halfD - 0.25;
    if (Math.abs(x) > limitX || Math.abs(z) > limitZ)
      return { point, x, z, valid: false, reason: "太靠近地图边缘了。" };
    if (point.y <= this.ctx.world.lakeLevel + 0.035)
      return {
        point,
        x,
        z,
        valid: false,
        reason: "水面不能放置地标，找一片陆地。",
      };
    const step = 0.09;
    const dhx = this.ctx.terrain.height(x + step, z) - point.y;
    const dhz = this.ctx.terrain.height(x, z + step) - point.y;
    const slope = Math.hypot(dhx, dhz) / step;
    if (slope > 1.55)
      return { point, x, z, valid: false, reason: "坡太陡了，换一片平地。" };
    if (this.placed.some((item) => Math.hypot(item.x - x, item.z - z) < 0.24))
      return { point, x, z, valid: false, reason: "离另一个地标太近了。" };
    return { point, x, z, valid: true, reason: "" };
  }

  _canPlace() {
    if (this.layoutBusy || this.pendingLayout) {
      this._toast("请先在山谷存档中恢复或切换布局。");
      return false;
    }
    if (this.ctx.photo?.active || this.ctx.exploration?.active) {
      this._toast("先退出拍照/探索模式，再放置地标。");
      return false;
    }
    return true;
  }

  beginPlacement() {
    if (!this._canPlace()) return;
    const view = this.views[this.tab];
    if (!view?.template) {
      this._toast("模型还没加载好，稍等一下。");
      return;
    }
    document.activeElement?.blur?.();
    this._selectPlaced(null);
    this.ctx.input.setTool("hand");
    this.placing = {
      template: view.template.root,
      url: view.result.modelUrl,
      height: view.template.height,
      role: view.result.role || DEFAULT_ROLE.id,
      valid: false,
    };
    this._getTransformControls();
    this._createGhost(this.placing.template);
    this._toast("移动鼠标选择位置，点击放置；Esc 取消。", 4200);
    this.ctx.events?.emit?.("aholo:placement-start", {});
  }

  _createGhost(template) {
    this._disposeGhost();
    const ghost = template.clone(true);
    ghost.name = "AholoGhost";
    ghost.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = false;
      object.receiveShadow = false;
      object.renderOrder = 20;
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      object.material = materials.map((material) => {
        if (!material) return material;
        const clone = material.clone();
        clone.transparent = true;
        clone.opacity = 0.46;
        clone.depthWrite = false;
        clone.depthTest = true;
        if (clone.color) clone.color.multiplyScalar(0.9);
        clone.needsUpdate = true;
        return clone;
      });
      if (!Array.isArray(materials)) object.material = object.material[0];
    });
    ghost.visible = false;
    this.ghost = ghost;
    this.scene.add(ghost);
    const markerMaterial = new Ry.MeshBasicMaterial({
      color: 0x8dffb0,
      transparent: true,
      opacity: 0.85,
      side: Ry.DoubleSide,
      depthWrite: false,
    });
    const marker = new Ry.Mesh(
      new Ry.RingGeometry(0.22, 0.29, 48),
      markerMaterial,
    );
    marker.rotation.x = -Math.PI / 2;
    marker.visible = false;
    marker.renderOrder = 21;
    this.marker = marker;
    this.scene.add(marker);
  }

  _updateGhost(hit) {
    if (!this.ghost || !this.marker) return;
    if (!hit?.point) {
      this.ghost.visible = false;
      this.marker.visible = false;
      return;
    }
    const point = hit.point;
    this.ghost.position.set(point.x, point.y, point.z);
    this.ghost.rotation.y = Math.atan2(
      this.camera.position.x - point.x,
      this.camera.position.z - point.z,
    );
    this.ghost.visible = true;
    this.marker.position.set(point.x, point.y + 0.012, point.z);
    this.marker.visible = true;
    this.marker.material.color.setHex(hit.valid ? 0x8dffb0 : 0xff6b5e);
    this.marker.scale.setScalar(hit.valid ? 1 : 0.82);
    this.placing.valid = Boolean(hit.valid);
  }

  _place(point) {
    if (!this.placing) return;
    const { template, url, height, role } = this.placing;
    const entry = this._addPlacement(template, {
      url,
      x: point.x,
      y: point.y,
      z: point.z,
      yaw: Math.atan2(
        this.camera.position.x - point.x,
        this.camera.position.z - point.z,
      ),
      height,
      role,
    });
    this._disposeGhost();
    this.placing = null;
    this.ctx.audio?.play?.("pop", { volume: 0.45, pitch: 1.1 });
    this._savePlacementLayout("地标已放进风栖谷，摆放位置已自动保存。");
    if (this.open) {
      this._setTransformMode("translate");
      this._selectPlaced(entry);
    }
    this.ctx.events?.emit?.("aholo:place", {
      id: entry.id,
      role: entry.role,
      x: entry.x,
      y: entry.y,
      z: entry.z,
    });
  }

  _savePlacementLayout(message) {
    try {
      this.saves.setCurrent(this._placementRecords());
      this.layoutNotice = "当前摆放已自动保存。";
      if (message) this._toast(message, 4200);
    } catch {
      this.layoutNotice = "摆放已完成，但浏览器未能自动保存。";
      this._toast(this.layoutNotice, 5000);
    }
    if (this.tab === "saves") this.saveNotice.textContent = this.layoutNotice;
  }

  _addPlacement(template, placement) {
    const {
      x,
      y,
      z,
      yaw,
      pitch = 0,
      roll = 0,
      windYawOffset = 0,
      role,
      height,
      scale = 1,
    } = placement;
    const root = new Ry.Group();
    const model = template.clone(true);
    model.position.y = -height * 0.5;
    root.add(model);
    root.position.set(x, y + height * scale * 0.5, z);
    root.rotation.set(pitch, yaw, roll, "YXZ");
    root.scale.setScalar(scale);
    this.scene.add(root);
    const entry = {
      ...placement,
      pitch,
      roll,
      windYawOffset,
      scale,
      id: "aholo-" + root.id,
      root,
      template,
    };
    if (role === "lantern") this.lanterns.push(entry);
    this.placed.push(entry);
    this.ctx.aholoLandmarks.push(entry);
    const navigation = this.ctx.modules.character?.navigation;
    if (navigation?.obstacles) {
      entry.obstacle = {
        id: entry.id,
        kind: "circle",
        x,
        z,
        radius: Math.max(0.1, height * scale * 0.16),
      };
      navigation.obstacles.push(entry.obstacle);
    }
    this._renderEditTools();
    return entry;
  }

  _placementRecords() {
    return this.placed.map(
      ({
        url,
        x,
        y,
        z,
        yaw,
        pitch,
        roll,
        windYawOffset,
        role,
        height,
        scale,
      }) => ({
        url,
        x,
        y,
        z,
        yaw,
        pitch,
        roll,
        windYawOffset,
        role,
        height,
        scale,
      }),
    );
  }

  _clearPlacements() {
    this._selectPlaced(null);
    const ids = new Set(this.placed.map(({ id }) => id));
    for (const { root } of this.placed) this.scene.remove(root);
    this.placed.length = 0;
    this.lanterns.length = 0;
    for (const light of this.lanternLights) light.intensity = 0;
    this._renderEditTools();
    const obstacles = this.ctx.modules.character?.navigation?.obstacles;
    for (const entries of [this.ctx.aholoLandmarks, obstacles]) {
      if (!entries) continue;
      for (let index = entries.length - 1; index >= 0; index--) {
        if (ids.has(entries[index].id)) entries.splice(index, 1);
      }
    }
  }

  cancelPlacement() {
    if (!this.placing && !this.cardPlacement) return;
    this._clearCardPlacement();
    this._disposeGhost();
    this.placing = null;
    this._toast("已取消放置。");
  }

  _disposeGhost() {
    if (this.ghost) {
      this.scene.remove(this.ghost);
      this.ghost.traverse((object) => {
        if (!object.isMesh) return;
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        for (const material of materials) material?.dispose?.();
      });
      this.ghost = null;
    }
    if (this.marker) {
      this.scene.remove(this.marker);
      this.marker.geometry?.dispose?.();
      this.marker.material?.dispose?.();
      this.marker = null;
    }
  }

  _windYaw(entry) {
    this.ctx.wind.sample(entry.x, entry.z, this._windSample);
    return Math.atan2(this._windSample.x, this._windSample.z) + Math.PI * 0.5;
  }

  _updateLanternLights() {
    const night = this.ctx.world.night;
    if (night && this.lanterns.length > this.lanternLights.length) {
      const cameraPosition = this.camera.position;
      this.lanterns.sort(
        (a, b) =>
          a.root.position.distanceToSquared(cameraPosition) -
          b.root.position.distanceToSquared(cameraPosition),
      );
    }
    for (const [index, light] of this.lanternLights.entries()) {
      const entry = this.lanterns[index];
      if (!entry || !night) {
        light.intensity = 0;
        continue;
      }
      entry.root.localToWorld(light.position.set(0, entry.height * 0.05, 0));
      const flicker = 0.86 + 0.14 * Math.sin(this.time * 9 + entry.x * 3);
      light.intensity = night * 1.15 * flicker;
    }
  }

  beforeRender() {
    const entry = this.selectedEntry;
    if (!entry || !this.open || this.cardPlacement) {
      this.editModes.hidden = true;
      return;
    }
    this.camera.updateMatrixWorld();
    entry.root.updateWorldMatrix(true, false);
    const anchors = this.editAnchors.get(entry.template);
    const point = this.editProjection;
    let left = Infinity;
    let right = -Infinity;
    let top = -Infinity;
    let bottom = Infinity;
    for (const anchor of anchors) {
      point
        .copy(anchor)
        .setY(anchor.y - entry.height * 0.5)
        .applyMatrix4(entry.root.matrixWorld)
        .project(this.camera);
      if (!(point.z >= -1 && point.z <= 1)) {
        this.editModes.hidden = true;
        return;
      }
      left = Math.min(left, point.x);
      right = Math.max(right, point.x);
      top = Math.max(top, point.y);
      bottom = Math.min(bottom, point.y);
    }
    if (left > 1 || right < -1 || top < -1 || bottom > 1) {
      this.editModes.hidden = true;
      return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = ((Math.max(left, -1) + Math.min(right, 1) + 2) * width) / 4;
    const y = ((1 - Math.min(top, 1)) * height) / 2 - 12;
    this.editModes.hidden = false;
    const gap = 8;
    const halfToolbarWidth = this.editModes.offsetWidth * 0.5;
    const toolbarHeight = this.editModes.offsetHeight;
    const insetX = halfToolbarWidth + gap;
    const insetY = toolbarHeight + gap;
    let toolbarX = Ry.MathUtils.clamp(x, insetX, width - insetX);
    let toolbarY = Ry.MathUtils.clamp(y, insetY, height - gap);
    const panel = this.overlay.getBoundingClientRect();
    if (
      toolbarX + halfToolbarWidth > panel.left &&
      toolbarX - halfToolbarWidth < panel.right &&
      toolbarY > panel.top &&
      toolbarY - toolbarHeight < panel.bottom
    ) {
      const candidates = [
        [panel.left - halfToolbarWidth - gap, toolbarY],
        [panel.right + halfToolbarWidth + gap, toolbarY],
        [toolbarX, panel.top - gap],
        [toolbarX, panel.bottom + toolbarHeight + gap],
      ];
      let nearest = Infinity;
      for (const [candidateX, candidateY] of candidates) {
        if (
          candidateX < insetX ||
          candidateX > width - insetX ||
          candidateY < insetY ||
          candidateY > height - gap
        )
          continue;
        const distance = Math.hypot(candidateX - x, candidateY - y);
        if (distance < nearest) {
          nearest = distance;
          toolbarX = candidateX;
          toolbarY = candidateY;
        }
      }
    }
    const leftPx = `${Math.round(toolbarX)}px`;
    const topPx = `${Math.round(toolbarY)}px`;
    if (this.editModes.style.left !== leftPx)
      this.editModes.style.left = leftPx;
    if (this.editModes.style.top !== topPx) this.editModes.style.top = topPx;
  }

  update(dt) {
    this.time += dt;
    if (this.selectedEntry && this.ctx.modules?.hud?.settings?.open) {
      this._selectPlaced(null);
    }
    if (this.marker) {
      const pulse = 0.62 + 0.25 * Math.sin(this.time * 5);
      this.marker.material.opacity = this.placing?.valid ? pulse : 0.55;
      this.marker.rotation.z += dt * 0.4;
    }
    for (const entry of this.placed) {
      if (entry.role === "wind" && entry !== this.selectedEntry) {
        const target = this._windYaw(entry) + entry.windYawOffset;
        const delta = shortAngle(target - entry.root.rotation.y);
        entry.root.rotation.y += delta * Math.min(1, dt * 2.2);
      }
    }
    this._updateLanternLights();
  }

  _handleKey(event) {
    if (event.key !== "Escape" || event.isComposing || event.defaultPrevented)
      return;
    if (this.placing || this.cardPlacement) {
      event.preventDefault();
      event.stopPropagation();
      this.cancelPlacement();
      return;
    }
    if (this.selectedEntry) {
      event.preventDefault();
      event.stopPropagation();
      if (this.transformDrag) this._finishTransform(false);
      else this._selectPlaced(null);
      return;
    }
    if (this.open) {
      event.preventDefault();
      event.stopPropagation();
      this.closePanel();
    }
  }
}

export { AholoCreate };
