import {
  CachedText,
  createHudElement,
  hudStorage,
  parseHudMarkup,
  positiveModuloHud,
} from "./dom.js";
import { HUD_ICONS } from "./icons.js";
import { TEMPERATURE_BIAS_LIMIT } from "./weather-format.js";

const SETTINGS_QUALITY_LABELS = {
  auto: "自动适配",
  high: "高画质",
  medium: "中画质",
  low: "低画质",
};

class SettingsPanel {
  constructor(ctx, hud, root) {
    this.ctx = ctx;
    this.hud = hud;
    this.open = false;
    const requestedQuality = ctx.params.get("quality");
    // quality=auto 也会禁用旧画质控制器的自适应，允许应用自动档清理它。
    this.currentQuality = !ctx.params.has("quality")
      ? "auto"
      : ["low", "medium", "high"].includes(requestedQuality)
        ? requestedQuality
        : null;
    this.button = hud.top.btn.settings;
    this.button.setAttribute("aria-controls", "wg-settings-panel");
    this.button.setAttribute("aria-expanded", "false");
    this.el = createHudElement("aside", {
      id: "wg-settings-panel",
      class: "wg-panel wg-settings",
      "aria-labelledby": "wg-settings-title",
      hidden: true,
    });
    this.closeButton = createHudElement(
      "button",
      {
        class: "wg-ibtn wg-settings-close",
        type: "button",
        "aria-label": "关闭场景设置",
      },
      [parseHudMarkup(HUD_ICONS.close)],
    );
    this.closeButton.addEventListener("click", () => this.setOpen(false));
    this.el.append(
      createHudElement("header", { class: "wg-settings-header" }, [
        createHudElement("div", {}, [
          createHudElement("h2", {
            class: "wg-settings-title",
            id: "wg-settings-title",
            text: "场景设置",
          }),
          createHudElement("p", {
            class: "wg-settings-subtitle",
            text: "为山谷换一种心情",
          }),
        ]),
        this.closeButton,
      ]),
    );
    const form = createHudElement("form", { class: "wg-settings-form" });
    this.el.append(form);
    const content = createHudElement("div", { class: "wg-settings-content" });
    form.append(content);
    const scene = this.section(content, "画质");
    this.quality = this.select(
      scene,
      "画质",
      Object.entries(SETTINGS_QUALITY_LABELS),
      this.currentQuality || "auto",
    );
    scene.append(
      createHudElement("p", {
        class: "wg-setting-help",
        text: "自动适配会随运行流畅度调整清晰度与光效。",
      }),
    );
    const view = this.section(content, "镜头习惯");
    this.cameraDrift = createHudElement("input", { type: "checkbox" });
    this.cameraDrift.checked =
      hudStorage.get("windhaven.camera.drift", false) === true;
    ctx.cameraRig.setDrift(this.cameraDrift.checked);
    view.append(
      createHudElement("label", { class: "wg-setting-check" }, [
        createHudElement("span", { text: "闲置时镜头缓慢移动" }),
        this.cameraDrift,
      ]),
    );
    this.cameraDrift.addEventListener("change", () => {
      ctx.cameraRig.setDrift(this.cameraDrift.checked);
      hudStorage.set("windhaven.camera.drift", this.cameraDrift.checked);
    });
    this.cameraTest = createHudElement("input", { type: "checkbox" });
    this.cameraTest.checked = ctx.params.get("debug") === "camera";
    view.append(
      createHudElement("label", { class: "wg-setting-check" }, [
        createHudElement("span", { text: "镜头测试（F2）" }),
        this.cameraTest,
      ]),
    );
    this.cameraTest.addEventListener("change", () => {
      ctx.cameraInspector?.setVisible(this.cameraTest.checked);
      this.setOpen(false);
    });
    ctx.events.on("camera-inspector:change", ({ visible }) => {
      this.cameraTest.checked = visible;
    });
    const environment = this.section(content, "环境微调");
    this.temperature = createHudElement("input", {
      type: "range",
      min: -TEMPERATURE_BIAS_LIMIT,
      max: TEMPERATURE_BIAS_LIMIT,
      step: 1,
      "aria-label": "温度偏移",
    });
    const temperatureOutput = createHudElement("output");
    this.temperatureText = new CachedText(temperatureOutput);
    environment.append(
      createHudElement("label", { class: "wg-setting-range" }, [
        createHudElement("span", { class: "wg-setting-range-head" }, [
          createHudElement("span", { text: "冷暖调节" }),
          temperatureOutput,
        ]),
        this.temperature,
      ]),
    );
    this.temperature.addEventListener("input", () => {
      ctx.weather?.cancelTransition("temp");
      ctx.world.tempOffset = Number(this.temperature.value);
      hud.thermo.target = null;
      hud.markUse("temp");
      this.slow();
    });
    const controls = this.section(content, "左下角控件");
    this.controlChecks = {};
    for (const [name, label] of [
      ["time", "时间"],
      ["season", "季节"],
    ]) {
      const input = createHudElement("input", { type: "checkbox" });
      controls.append(
        createHudElement("label", { class: "wg-setting-check" }, [
          createHudElement("span", { text: "展开" + label + "控件" }),
          input,
        ]),
      );
      input.addEventListener("change", () =>
        hud.setClimateCollapsed(name, !input.checked),
      );
      this.controlChecks[name] = input;
    }
    this.note = createHudElement("p", {
      class: "wg-settings-note",
      text: "视角调整即时生效；画质更改需要重新载入。",
      "aria-live": "polite",
    });
    this.applyButton = createHudElement("button", {
      class: "wg-settings-apply",
      type: "submit",
      text: "应用画质",
      disabled: true,
    });
    form.append(
      createHudElement("footer", { class: "wg-settings-footer" }, [
        this.note,
        this.applyButton,
      ]),
    );
    this.quality.addEventListener("change", () => this.updatePending());
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.applyButton.disabled)
        location.assign(this.buildApplyUrl().href);
    });
    this.el.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      this.setOpen(false);
    });
    root.append(this.el);
    this.updatePending();
  }
  section(parent, title) {
    const section = createHudElement(
      "section",
      { class: "wg-settings-section" },
      [createHudElement("h3", { class: "wg-settings-heading", text: title })],
    );
    parent.append(section);
    return section;
  }
  select(parent, label, options, value) {
    const select = createHudElement("select", { class: "wg-setting-select" });
    for (const [key, text] of options)
      select.append(createHudElement("option", { value: key, text }));
    select.value = value;
    parent.append(
      createHudElement("label", { class: "wg-setting-field" }, [
        createHudElement("span", { text: label }),
        select,
      ]),
    );
    return select;
  }
  saveWorldParameters(params) {
    const world = this.ctx.world;
    const values = {
      season: positiveModuloHud(world.season, 4),
      time: positiveModuloHud(world.timeOfDay, 1),
      temp: world.tempOffset,
    };
    for (const [key, value] of Object.entries(values)) {
      if (Number.isFinite(value)) params.set(key, String(value));
      else params.delete(key);
    }
    params.set("dayCycle", world.dayCycle ? "1" : "0");
    params.set("seasonCycle", world.seasonCycle ? "1" : "0");
  }
  buildApplyUrl() {
    const url = new URL(location.href);
    const params = url.searchParams;
    params.set("scenario", this.ctx.weather.currentScenario);
    params.delete("weather");
    params.set(
      "cam",
      this.ctx.cameraRig.activePreset ||
        this.hud.cameraControls.selected ||
        "overview",
    );
    // 自动档必须省略 quality；显式 quality 参数会关闭自适应。
    if (this.quality.value === "auto") params.delete("quality");
    else params.set("quality", this.quality.value);
    this.saveWorldParameters(params);
    return url;
  }
  updatePending() {
    this.applyButton.disabled = this.quality.value === this.currentQuality;
    this.note.textContent = this.applyButton.disabled
      ? "视角调整即时生效；画质更改需要重新载入。"
      : "应用画质将重新载入，并保留当前季节、时间和播放状态。";
  }
  toggle() {
    this.setOpen(!this.open);
  }
  setOpen(open) {
    this.open = !!open;
    this.el.hidden = !this.open;
    this.button.setAttribute("aria-expanded", String(this.open));
    this.button.classList.toggle("is-on", this.open);
    if (this.open) {
      this.slow();
      this.closeButton.focus({ preventScroll: true });
    } else this.button.focus({ preventScroll: true });
  }
  slow() {
    if (!this.open) return;
    this.cameraDrift.checked = !!this.ctx.cameraRig.enabledDrift;
    this.cameraTest.checked = !!this.ctx.cameraInspector?.visible;
    const offset = Math.round(this.ctx.world.tempOffset || 0);
    if (document.activeElement !== this.temperature)
      this.temperature.value = String(offset);
    this.temperatureText.set((offset > 0 ? "+" : "") + offset + " °C");
    for (const [name, input] of Object.entries(this.controlChecks)) {
      input.checked = !this.hud.climatePanels[name].collapsed;
    }
  }
}

export { SettingsPanel };
