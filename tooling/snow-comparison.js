import { Ry } from "../src/vendor/three-runtime.js";
import { disposeModel } from "../src/generation/model-thumbnails.js";
import {
  loadToolModel,
  loadToolModels,
  patchToolSnowMaterial,
} from "./model-catalog.js";

const DEFAULT_TASK = "4889009";
const FALLBACK_MODEL = "ceramic-cat";
const WINTER_SNOW_DEPTH = 0.9;
const DEFAULT_MODEL_HEIGHT = 0.82;
const MODEL_GROUPS = [
  ["project", "项目原有模型"],
  ["generated", "Aholo 生成模型"],
];
const DEFAULT_VIEW = { yaw: 0.58, pitch: 0.32, zoom: 1 };
const groundColor = new Ry.Color(0x555346);
const snowColor = new Ry.Color(0xc3d2d9);

const canvas = document.querySelector("#comparison-canvas");
const stage = document.querySelector("#comparison-stage");
const picker = document.querySelector("#model-select");
const slider = document.querySelector("#snow-amount");
const snowValue = document.querySelector("#snow-value");
const status = document.querySelector("#comparison-status");
const cleanButton = document.querySelector("#clean-view");

function createView(element, background) {
  const scene = new Ry.Scene();
  scene.background = new Ry.Color(background);
  scene.add(new Ry.HemisphereLight(0xeaf0f8, 0x8f887b, 2));

  const sun = new Ry.DirectionalLight(0xffeed8, 2.9);
  sun.position.set(-3, 5, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(768, 768);
  sun.shadow.normalBias = 0.012;
  sun.shadow.bias = -0.0003;
  const rim = new Ry.DirectionalLight(0xc8ddff, 1.3);
  rim.position.set(3, 2, -4);
  scene.add(sun, rim);

  const ground = new Ry.Mesh(
    new Ry.PlaneGeometry(100, 100),
    new Ry.MeshStandardMaterial({
      color: background,
      roughness: 0.96,
    }),
  );
  ground.position.y = -0.09;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  const surface = new Ry.MeshStandardMaterial({
    color: groundColor,
    roughness: 0.92,
  });
  const edge = new Ry.MeshStandardMaterial({
    color: 0x42413a,
    roughness: 0.94,
  });
  const base = new Ry.Mesh(new Ry.CylinderGeometry(1, 1.025, 0.08, 96), [
    edge,
    surface,
    edge,
  ]);
  base.position.y = -0.042;
  base.castShadow = true;
  base.receiveShadow = true;
  scene.add(ground, base);

  return { element, scene, sun, base, surface };
}

function normalizedModel(model, scale, center, bottom) {
  const pivot = new Ry.Group();
  pivot.add(model);
  pivot.scale.setScalar(scale);
  pivot.position.set(-center.x * scale, -bottom * scale, -center.z * scale);
  return pivot;
}

function snowMaterials(root, model, uniforms) {
  const variants = new Map();
  function variant(material) {
    if (!material?.isMeshStandardMaterial) return material;
    if (!variants.has(material)) {
      const copy = material.clone();
      patchToolSnowMaterial(copy, model, uniforms);
      variants.set(material, copy);
    }
    return variants.get(material);
  }
  root.traverse((object) => {
    if (!object.isMesh) return;
    object.material = Array.isArray(object.material)
      ? object.material.map(variant)
      : variant(object.material);
  });
}

async function initialize() {
  const renderer = new Ry.WebGLRenderer({ canvas, antialias: true });
  renderer.outputColorSpace = Ry.SRGBColorSpace;
  renderer.toneMapping = Ry.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = Ry.PCFShadowMap;
  renderer.setScissorTest(true);

  const views = [
    createView(document.querySelector("#original-view"), 0x1b211f),
    createView(document.querySelector("#snow-view"), 0x222b34),
  ];
  const camera = new Ry.OrthographicCamera(-1, 1, 1, -1, 0.01, 30);
  const target = new Ry.Vector3();
  const orbit = { ...DEFAULT_VIEW };
  const ground = new Ry.DataTexture(
    new Float32Array(4),
    1,
    1,
    Ry.RGBAFormat,
    Ry.FloatType,
  );
  const uniforms = {
    uGroundTex: { value: ground },
    uFieldMin: { value: new Ry.Vector2(-5, -5) },
    uFieldSize: { value: new Ry.Vector2(10, 10) },
  };

  let models = [];
  let current = [];
  let request = 0;
  let drawRequest = 0;
  let frameSize = 0.76;
  let drag = null;

  function draw() {
    drawRequest = 0;
    const area = stage.getBoundingClientRect();
    if (area.width < 1 || area.height < 1) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const width = Math.round(area.width * ratio);
    const height = Math.round(area.height * ratio);
    if (canvas.width !== width || canvas.height !== height)
      renderer.setSize(width, height, false);
    renderer.setScissor(0, 0, width, height);
    renderer.setClearColor(0x151919);
    renderer.clear();

    const horizontal = Math.cos(orbit.pitch);
    camera.position
      .set(
        Math.sin(orbit.yaw) * horizontal,
        Math.sin(orbit.pitch),
        Math.cos(orbit.yaw) * horizontal,
      )
      .multiplyScalar(Math.max(5, frameSize * 3))
      .add(target);
    camera.lookAt(target);
    camera.far = Math.max(30, frameSize * 7);
    for (const { element, scene } of views) {
      const rect = element.getBoundingClientRect();
      const x = Math.round((rect.left - area.left) * ratio);
      const y = Math.round((area.bottom - rect.bottom) * ratio);
      const w = Math.round(rect.width * ratio);
      const h = Math.round(rect.height * ratio);
      if (w < 1 || h < 1) continue;
      const aspect = w / h;
      const span = (frameSize / orbit.zoom) * Math.max(1, 1 / aspect);
      camera.top = span;
      camera.bottom = -span;
      camera.left = -span * aspect;
      camera.right = span * aspect;
      camera.updateProjectionMatrix();
      renderer.setViewport(x, y, w, h);
      renderer.setScissor(x, y, w, h);
      renderer.render(scene, camera);
    }
  }

  function invalidate() {
    if (!drawRequest) drawRequest = requestAnimationFrame(draw);
  }

  function updateSnow() {
    const amount = Number(slider.value) / 100;
    ground.image.data[0] = WINTER_SNOW_DEPTH * amount;
    ground.needsUpdate = true;
    views[1].surface.color.lerpColors(groundColor, snowColor, amount);
    snowValue.value = `${slider.value}%`;
    invalidate();
  }

  async function selectModel(model) {
    const selection = ++request;
    status.textContent = "正在加载模型…";
    let source;
    let snowy;
    try {
      source = await loadToolModel(model);
      if (selection !== request) {
        if (source) disposeModel(source);
        return;
      }
      if (!source) throw new Error("模型没有可显示的场景。");
      source.updateMatrixWorld(true);
      const bounds = new Ry.Box3().setFromObject(source);
      const size = bounds.getSize(new Ry.Vector3());
      if (!Number.isFinite(size.y) || size.y <= 1e-6)
        throw new Error("模型没有可显示的尺寸。");
      const scale = (Number(model.height) || DEFAULT_MODEL_HEIGHT) / size.y;
      const center = bounds.getCenter(new Ry.Vector3());

      source.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = true;
        object.receiveShadow = true;
      });
      snowy = source.clone(true);
      snowMaterials(snowy, model, uniforms);
      const next = [source, snowy].map((root) =>
        normalizedModel(root, scale, center, bounds.min.y),
      );
      for (const previous of current) previous.removeFromParent();
      disposeModel(...current);
      current = next;

      size.multiplyScalar(scale);
      target.y = size.y * 0.48;
      frameSize = Math.max(size.length() * 0.64, size.y * 0.68);
      const baseRadius = Math.max(Math.hypot(size.x, size.z) * 0.62, 0.56);
      views.forEach(({ scene, base, sun }, index) => {
        scene.add(current[index]);
        base.scale.set(baseRadius, 1, baseRadius);
        const spread = Math.max(baseRadius * 1.55, 1.1);
        Object.assign(sun.shadow.camera, {
          left: -spread,
          right: spread,
          top: spread,
          bottom: -spread,
        });
        sun.shadow.camera.updateProjectionMatrix();
      });
      const url = new URL(location.href);
      url.searchParams.set("model", model.id);
      history.replaceState(history.state, "", url);
      picker.value = model.id;
      status.textContent = "";
      invalidate();
    } catch (error) {
      disposeModel(...[source, snowy].filter(Boolean));
      if (selection !== request) return;
      status.textContent = "模型加载失败。请在上方切换模型。";
      console.warn("[snow comparison] failed to load the model", error);
    }
  }

  function zoom(change) {
    orbit.zoom = Ry.MathUtils.clamp(orbit.zoom * change, 0.65, 2.8);
    invalidate();
  }

  function rotate(dx, dy) {
    orbit.yaw -= dx;
    orbit.pitch = Ry.MathUtils.clamp(orbit.pitch + dy, 0.06, 1.38);
    invalidate();
  }

  function setCleanView(clean) {
    document.body.classList.toggle("clean-view", clean);
    (clean ? views[0].element : cleanButton).focus({ preventScroll: true });
    invalidate();
  }

  for (const { element } of views) {
    element.addEventListener("pointerdown", (event) => {
      if (drag || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      element.setPointerCapture(event.pointerId);
      element.classList.add("is-dragging");
    });
    element.addEventListener("pointermove", (event) => {
      if (event.pointerId !== drag?.id) return;
      rotate(
        (event.clientX - drag.x) * 0.009,
        (event.clientY - drag.y) * 0.009,
      );
      drag.x = event.clientX;
      drag.y = event.clientY;
    });
    element.addEventListener("lostpointercapture", () => {
      drag = null;
      element.classList.remove("is-dragging");
    });
    element.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const delta = event.deltaY * (event.deltaMode === 1 ? 16 : 1);
        zoom(Math.exp(-delta * 0.0015));
      },
      { passive: false },
    );
    element.addEventListener("keydown", (event) => {
      const actions = {
        ArrowLeft: () => rotate(-0.12, 0),
        ArrowRight: () => rotate(0.12, 0),
        ArrowUp: () => rotate(0, 0.09),
        ArrowDown: () => rotate(0, -0.09),
        "+": () => zoom(1.15),
        "-": () => zoom(1 / 1.15),
      };
      if (!Object.hasOwn(actions, event.key)) return;
      event.preventDefault();
      actions[event.key]();
    });
  }

  new ResizeObserver(invalidate).observe(stage);
  window.addEventListener("resize", invalidate);
  slider.addEventListener("input", updateSnow);
  document.querySelector("#reset-view").addEventListener("click", () => {
    Object.assign(orbit, DEFAULT_VIEW);
    invalidate();
  });
  cleanButton.addEventListener("click", () => setCleanView(true));
  stage.addEventListener("dblclick", () => {
    if (document.body.classList.contains("clean-view")) setCleanView(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      document.body.classList.contains("clean-view")
    )
      setCleanView(false);
  });
  picker.addEventListener("change", () => {
    const model = models.find(({ id }) => id === picker.value);
    if (model) void selectModel(model);
  });

  updateSnow();
  models = await loadToolModels();
  const groups = MODEL_GROUPS.map(([kind, label]) => {
    const group = document.createElement("optgroup");
    group.label = label;
    for (const model of models.filter(({ group }) => group === kind))
      group.append(new Option(model.label, model.id));
    return group;
  });
  picker.replaceChildren(...groups.filter((group) => group.childElementCount));
  const requested = new URLSearchParams(location.search).get("model");
  const initial =
    models.find(({ id }) => id === requested) ??
    models.find(({ id }) => id === DEFAULT_TASK) ??
    models.find(({ id }) => id === FALLBACK_MODEL) ??
    models[0];
  if (!initial) {
    status.textContent = "暂无可用模型。";
    return;
  }
  picker.disabled = false;
  picker.value = initial.id;
  await selectModel(initial);
}

initialize().catch((error) => {
  status.textContent = "无法启动 3D 预览。请在支持 WebGL 的浏览器中打开。";
  console.warn("[snow comparison] preview unavailable", error);
});
