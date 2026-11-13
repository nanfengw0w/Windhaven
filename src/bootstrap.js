// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  Ry,
  ThreePerspectiveCamera,
  ThreeScene,
} from "./vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "./core/config.js";
import { LANDSCAPE_AREA_SCALE } from "./core/weather-extent.js";
import { EventBus } from "./core/events.js";
import { QualityController } from "./core/quality.js";
import {
  PostprocessingPipeline,
  createRenderer,
} from "./render/postprocessing.js";
import { CameraRig } from "./core/camera.js";
import { setupCameraViews } from "./core/camera-views.js";
import { ExplorationController } from "./core/exploration.js";
import { PhotoModeController } from "./core/photo-mode.js";
import { VideoModeController } from "./core/video-mode.js";
import { InputController } from "./core/input.js";
import { registerWindTool } from "./core/wind-tool.js";
import { LightingController } from "./render/lighting.js";
import { detectFloatLinearFiltering } from "./render/field-texture.js";
import { TerrainField } from "./simulation/terrain-field.js";
import {
  COMMON_GLSL,
  installCloudShadowPatch,
  sharedUniforms,
  updateSharedUniforms,
} from "./render/shared-shaders.js";
import { SCENARIOS, applyScenario } from "./core/scenarios.js";
import { WeatherController } from "./core/weather-cycle.js";
import { FrameProfiler, PerformanceOverlay } from "./core/profiler.js";
import { WorldState } from "./simulation/world.js";
import { WindField } from "./simulation/wind.js";
import { SurfaceFields } from "./simulation/surface-fields.js";
import { TerrainSystem } from "./terrain/terrain-system.js";
import { WaterSystem } from "./water/water-system.js";
import { VegetationSystem } from "./vegetation/vegetation-system.js";
import { LandscapeVegetationSystem } from "./vegetation/landscape-vegetation.js";
import { WillowSystem } from "./vegetation/willows.js";
import { AlpineTownLandmark } from "./landmarks/alpine-town.js";
import { FarmSystem } from "./landmarks/farm.js";
import { WoodworkingYard } from "./props/woodworking-yard.js";
import { HikingTrail } from "./props/hiking-trail.js";
import { MountainRuins } from "./props/mountain-ruins.js";
import { BackdropSystem } from "./backdrop/backdrop-system.js";
import { SkySystem } from "./sky/sky-system.js";
import { LifeSystem } from "./life/system.js";
import { TreeFruitSystem } from "./life/tree-fruit.js";
import { CloudSystem } from "./clouds/system.js";
import { PrecipitationSystem } from "./precipitation/system.js";
import { FogSystem } from "./fog/system.js";
import { HudSystem } from "./hud/system.js";
import { AholoCreate } from "./generation/aholo-create.js";
import { CameraInspector } from "./hud/camera-inspector.js";
import { CharacterSystem } from "./character/system.js";
import { AudioController } from "./audio/controller.js";
import {
  prepareTerrainInspection,
  setupTerrainInspection,
} from "./dev/terrain-inspection.js";
import { setupModelInspection } from "./dev/model-inspection.js";
import { setupWillowInspection } from "./dev/willow-inspection.js";
// Subsystem lifecycle order (audio first: other modules play spawn sounds via
// ctx.audio). This is the update/order contract, NOT the ES import graph —
// cross-module coupling goes through the shared context, events and world state.
// Reordering these entries changes per-frame behaviour (e.g. rain deposition).
const MODULE_REGISTRY = [
  ["audio", AudioController],
  ["sky", SkySystem],
  ["terrain", TerrainSystem],
  ["water", WaterSystem],
  ["vegetation", VegetationSystem],
  ["landscapeVegetation", LandscapeVegetationSystem],
  ["willows", WillowSystem],
  ["alpineTown", AlpineTownLandmark],
  ["farm", FarmSystem],
  ["woodworkingYard", WoodworkingYard],
  ["hikingTrail", HikingTrail],
  ["life", LifeSystem],
  ["treeFruit", TreeFruitSystem],
  ["clouds", CloudSystem],
  ["precipitation", PrecipitationSystem],
  ["fog", FogSystem],
  ["backdrop", BackdropSystem],
  ["hud", HudSystem],
  ["aholo", AholoCreate],
  ["mountainRuins", MountainRuins],
  ["character", CharacterSystem],
];
const appParams = new URLSearchParams(location.search);
const terrainInspectionEnabled =
  import.meta.env.DEV && appParams.get("inspection") === "terrain";
if (terrainInspectionEnabled) prepareTerrainInspection(appParams);
const runtimeErrors = [];
window.addEventListener("error", (event) =>
  runtimeErrors.push(String(event.message || event)),
);
window.addEventListener("unhandledrejection", (event) =>
  runtimeErrors.push(String(event.reason)),
);
function bootWeatherglass() {
  installCloudShadowPatch();
  const canvas = document.getElementById("scene"),
    quality = new QualityController(appParams),
    renderer = createRenderer(canvas, quality);
  detectFloatLinearFiltering(renderer);
  const scene = new ThreeScene(),
    camera = new ThreePerspectiveCamera(
      34,
      window.innerWidth / window.innerHeight,
      0.1,
      250,
    ),
    cameraRig = new CameraRig(camera),
    events = new EventBus(),
    world = new WorldState(),
    terrain = new TerrainField();
  sharedUniforms.uTerrainTex.value = terrain.texture;
  const wind = new WindField(world),
    surfaceFields = new SurfaceFields(world, terrain.baked),
    ctx = {
      THREE: Ry,
      scene: scene,
      camera: camera,
      cameraRig: cameraRig,
      renderer: renderer,
      events: events,
      quality: quality,
      params: appParams,
      world: world,
      wind: wind,
      fields: surfaceFields,
      terrain: terrain,
      uniforms: sharedUniforms,
      GLSL_COMMON: COMMON_GLSL,
      precip: {
        sources: [],
      },
      modules: {},
      audio: null,
      time: 0,
      box: LANDSCAPE_BOUNDS,
    };
  ctx.weather = new WeatherController(ctx);
  ((scene.onBeforeRender = (
    renderingRenderer,
    renderingScene,
    renderingCamera,
  ) => {
    (renderingCamera.updateMatrixWorld(),
      sharedUniforms.uCameraWorld.value.copy(renderingCamera.matrixWorld));
  }),
    (ctx.input = new InputController(ctx)),
    registerWindTool(ctx),
    (ctx.lights = new LightingController(ctx)),
    (ctx.post = new PostprocessingPipeline(renderer, scene, camera, quality)),
    (ctx.moduleObjects = {}));
  // Instantiate every subsystem against the shared context. A module that
  // throws during construction or update is logged once and disabled for the
  // rest of the session instead of killing the whole loop.
  for (const [moduleName, ModuleClass] of MODULE_REGISTRY) {
    const existingSceneChildren = new Set(scene.children);
    try {
      const moduleInstance = new ModuleClass(ctx);
      ((ctx.modules[moduleName] = moduleInstance),
        (ctx.moduleObjects[moduleName] = scene.children.filter(
          (object) => !existingSceneChildren.has(object),
        )),
        moduleName === "audio" && (ctx.audio = moduleInstance));
    } catch (error) {
      (console.error(
        `[boot] module "${moduleName}" failed to initialise`,
        error,
      ),
        runtimeErrors.push(`${moduleName}: ${error.message}`));
    }
  }
  const scenarioName = Object.hasOwn(SCENARIOS, appParams.get("scenario"))
    ? appParams.get("scenario")
    : "calm";
  (SCENARIOS[scenarioName] && applyScenario(ctx, scenarioName),
    appParams.has("season") &&
      (world.season = parseFloat(appParams.get("season"))),
    appParams.has("time") &&
      (world.timeOfDay = parseFloat(appParams.get("time"))),
    appParams.has("temp") &&
      (world.tempOffset = parseFloat(appParams.get("temp"))),
    appParams.has("tool") && ctx.input.setTool(appParams.get("tool")),
    appParams.get("ui") === "0" && document.body.classList.add("no-ui"));
  world.dayCycle = appParams.get("dayCycle") === "1";
  world.seasonCycle = appParams.get("seasonCycle") === "1";
  world.update(0);
  ctx.weather.initialize(scenarioName);
  // The character's first safe position depends on the final initial climate
  // and water level; its navigation is then shared with first-person control.
  ctx.modules.character?.initialize();
  ctx.exploration = new ExplorationController(ctx);
  ctx.photo = new PhotoModeController(ctx);
  ctx.video = new VideoModeController(
    ctx,
    stepSimulation,
    renderFrame,
    resizeViewport,
  );
  setupCameraViews(ctx);
  cameraRig.preset(appParams.get("cam") || "overview", true);
  ctx.cameraInspector = new CameraInspector(ctx);
  const disabledModules = new Set(),
    profiler = new FrameProfiler();
  ctx.profiler = profiler;
  let surfaceFieldsUpdated = !1;
  // 将本帧降水沉积到雪、湿润和雨量字段；保持在降水系统更新之前执行。
  // surfaceFieldsUpdated 用于循环结束时的兜底检查，避免重复沉积。
  function updateSurfaceFields(dt) {
    profiler.begin("fields");
    for (const source of ctx.precip.sources)
      surfaceFields.deposit(source.x, source.z, source.radius, source.rate, dt);
    (surfaceFields.update(dt),
      profiler.end("fields"),
      (surfaceFieldsUpdated = !0));
  }
  // dt 的单位为秒。先更新气候、风、输入和相机，再按原注册顺序更新系统。
  // 降水源在循环前清空，由云重新填充，供地表沉积和水面雨滴涟漪使用。
  function stepSimulation(dt) {
    // Photography freezes state rather than running zero-delta updates, some
    // of which snap targets, rebuild particles or consume random numbers.
    if (ctx.photo.active && !ctx.photo.timeRunning) return;
    ((surfaceFieldsUpdated = !1), (ctx.time += dt));
    const simulationTime = ctx.time;
    (profiler.tick(),
      profiler.begin("sim"),
      ctx.weather.update(dt),
      world.update(dt),
      wind.update(dt));
    // World playback uses the free photo camera while the original camera and
    // walking actor remain suspended, including an in-progress jump.
    if (!ctx.photo.active) {
      ctx.input.update(dt);
      if (ctx.exploration.active) ctx.exploration.update(dt);
      else if (!cameraRig.following) cameraRig.update(dt);
    }
    (profiler.end("sim"), (ctx.precip.sources.length = 0));
    for (const [moduleName] of MODULE_REGISTRY) {
      moduleName === "precipitation" && updateSurfaceFields(dt);
      const moduleInstance = ctx.modules[moduleName];
      if (!(
        !moduleInstance ||
        !moduleInstance.update ||
        disabledModules.has(moduleName)
      )) {
        profiler.begin(moduleName);
        try {
          moduleInstance.update(dt, simulationTime);
        } catch (error) {
          (console.error(
            `[loop] module "${moduleName}" update failed; disabling`,
            error,
          ),
            runtimeErrors.push(`${moduleName}.update: ${error.message}`),
            disabledModules.add(moduleName));
        }
        profiler.end(moduleName);
      }
    }
    // Follow the actor after its autonomous navigation has advanced this frame.
    if (!ctx.photo.active && !ctx.exploration.active && cameraRig.following)
      cameraRig.update(dt);
    surfaceFieldsUpdated || updateSurfaceFields(dt);
    let totalRainfall = 0,
      totalSnowfall = 0;
    for (const source of ctx.precip.sources) {
      const snowFraction = world.snowFractionAt(
        Math.max(0, terrain.height(source.x, source.z)),
      );
      ((totalRainfall += source.rate * (1 - snowFraction)),
        (totalSnowfall += source.rate * snowFraction));
    }
    ((world.rainfall = totalRainfall / LANDSCAPE_AREA_SCALE),
      (world.snowfall = totalSnowfall / LANDSCAPE_AREA_SCALE),
      ctx.lights.update(dt),
      updateSharedUniforms(ctx, simulationTime));
  }
  renderer.info.autoReset = !1;
  // 先更新彩虹朝向、雾体内外切换等相机相关状态，再执行后处理渲染。
  function renderFrame(dt) {
    (renderer.info.reset(), profiler.begin("beforeRender"));
    // A photograph needs current-view LOD, smoke and cloud caches before its
    // mirror is drawn. Normal simulation keeps its original lifecycle order.
    const renderOrder = ctx.photo.active
      ? [
          ...MODULE_REGISTRY.filter(([moduleName]) => moduleName !== "water"),
          ["water"],
        ]
      : MODULE_REGISTRY;
    for (const [moduleName] of renderOrder) {
      const moduleInstance = ctx.modules[moduleName];
      if (moduleInstance?.beforeRender && !disabledModules.has(moduleName))
        try {
          moduleInstance.beforeRender(dt, ctx.time);
        } catch (error) {
          (console.error(`[render] ${moduleName}.beforeRender`, error),
            disabledModules.add(moduleName));
        }
    }
    (profiler.end("beforeRender"),
      profiler.begin("render"),
      ctx.post.render(dt, ctx.time, world),
      profiler.end("render"),
      profiler.frame(renderer.info));
  }
  let resizePending = false;
  // resize 事件只做标记；实际尺寸同步在下一帧集中执行。
  function resizeViewport() {
    resizePending = false;
    if (window.innerWidth < 1 || window.innerHeight < 1) return;
    quality.refreshDpr();
    const resized = ctx.post.setSize(window.innerWidth, window.innerHeight);
    ((camera.aspect = window.innerWidth / window.innerHeight),
      camera.updateProjectionMatrix());
    if (!resized) return;
    for (const moduleInstance of Object.values(ctx.modules))
      moduleInstance?.resize?.(window.innerWidth, window.innerHeight);
  }
  (window.addEventListener("resize", () => {
    resizePending = true;
  }),
    canvas.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        runtimeErrors.push("WebGL context lost");
        ctx.video.cancel("图形上下文已中断，录制已停止。");
        console.error("[render] WebGL context lost; waiting for restoration");
      },
      !1,
    ),
    canvas.addEventListener(
      "webglcontextrestored",
      () => location.reload(),
      !1,
    ),
    (quality.onChange = () => {
      resizePending = true;
    }),
    (quality.onPostLevel = (postLevel) => {
      ctx.post.bloom.enabled = postLevel >= 1;
    }));
  let previousFrameTimeMs = performance.now(),
    frameCount = 0;
  const simulationPaused = appParams.has("paused") || terrainInspectionEnabled,
    performanceOverlay = appParams.has("stats")
      ? new PerformanceOverlay(profiler, ctx)
      : null;
  function animateFrame() {
    requestAnimationFrame(animateFrame);
    const nowMs = performance.now(),
      frameDeltaSeconds = Math.max(0, (nowMs - previousFrameTimeMs) / 1e3);
    previousFrameTimeMs = nowMs;
    if (ctx.video.recording) {
      ctx.video.captureFrame();
      return;
    }
    // 性能采样使用真实帧间隔；模拟步长保留原有的 1/20 秒上限。
    const simulationDeltaSeconds = simulationPaused
      ? 0
      : Math.min(frameDeltaSeconds, 1 / 20);
    (!ctx.photo.active && quality.sample(frameDeltaSeconds),
      resizePending && resizeViewport());
    // Update the independent camera before world/view-dependent systems so
    // playback never pulls it back toward the saved orbit or walking position.
    if (ctx.photo.active) ctx.photo.update(frameDeltaSeconds);
    const photoFrozen = ctx.photo.active && !ctx.photo.timeRunning;
    if (!photoFrozen) stepSimulation(simulationDeltaSeconds);
    (renderFrame(photoFrozen ? 0 : simulationDeltaSeconds),
      ctx.photo.afterRender(),
      ctx.cameraInspector.update(nowMs),
      performanceOverlay?.update(frameDeltaSeconds, quality.dpr),
      frameCount++,
      frameCount === 2 &&
        (document.body.classList.add("ready"), (debugApi.ready = !0)));
  }
  const debugApi = {
    ready: !1,
    ctx: ctx,
    errors: runtimeErrors,
    scenario: (scenarioName) => {
      if (!applyScenario(ctx, scenarioName)) return false;
      ctx.weather.initialize(scenarioName);
      return true;
    },
    simulate(seconds) {
      if (ctx.video.recording || (ctx.photo.active && !ctx.photo.timeRunning))
        return 0;
      const stepCount = Math.round(seconds * 30);
      for (let stepIndex = 0; stepIndex < stepCount; stepIndex++)
        stepSimulation(1 / 30);
      return stepCount;
    },
    camera: (presetName) => cameraRig.preset(presetName, !0),
    cameraSnapshot: () => ctx.cameraInspector.snapshot(),
    frames: () => frameCount,
    profile: () => profiler.report(),
    setVisible(moduleName, visible) {
      for (const object of ctx.moduleObjects[moduleName] || [])
        object.visible = visible;
    },
  };
  // Debug/test hook: scenario switching, fixed-step simulation, camera presets,
  // module visibility toggles and profiling without touching the UI.
  window.__wg = debugApi;
  if (terrainInspectionEnabled) {
    debugApi.inspection = setupTerrainInspection(ctx);
  }
  if (import.meta.env.DEV && appParams.get("inspection") === "models")
    setupModelInspection(ctx);
  if (import.meta.env.DEV && appParams.get("inspection") === "willows")
    setupWillowInspection(ctx);
  const warmupSeconds = parseFloat(appParams.get("warm") || "0");
  (stepSimulation(0),
    warmupSeconds > 0 && debugApi.simulate(warmupSeconds),
    !terrainInspectionEnabled &&
      appParams.has("cam") &&
      cameraRig.preset(appParams.get("cam"), !0),
    animateFrame());
}
try {
  bootWeatherglass();
} catch (error) {
  (console.error("[boot] fatal", error),
    runtimeErrors.push(`fatal: ${error.message}`));
  const fatalMessage = document.getElementById("fatal");
  fatalMessage &&
    ((fatalMessage.textContent =
      "Windhaven Valley could not start: " + error.message),
    (fatalMessage.style.display = "block"));
}
