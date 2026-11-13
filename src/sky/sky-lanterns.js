import { Ry } from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import {
  clamp,
  createSeededRandom,
  damp,
  lerp,
  smoothstep,
} from "../core/math.js";
import { CharacterGLTFLoader } from "../character/gltf-loader.js";
import { sampleLanternFlame } from "./lantern-light.js";

const MODEL_URL = new URL(
  "../../assets/sky-lantern/aholo-kongming.glb",
  import.meta.url,
);
const GLOW_URL = new URL(
  "../../assets/sky-lantern/aholo-kongming.glow.webp",
  import.meta.url,
);
// Same emissive-atlas window-glow language as the imported buildings, but
// deliberately much dimmer: these are large, close paper props, not windows.
// A separately painted glow map (tooling/window-glow-painter.html) takes over
// when present; the base paper texture is only a fallback.
const LANTERN_GLOW_INTENSITY = 0.38;
const LANTERN_PAINTED_GLOW_INTENSITY = 0.6;
const LANTERN_GLOW_COLOR = 0xffe2c0;

function createLanternMaterial(source, paintedGlow = null) {
  // Use the same emissive-atlas treatment as the imported buildings' window
  // glow. A painted mask is sparse and hand-authored; without one, the base
  // paper texture doubles as the glow atlas at a lower fallback intensity.
  const glowMap = paintedGlow || source.map;
  const material = new Ry.MeshStandardMaterial({
    color: source.color,
    map: source.map,
    emissiveMap: glowMap,
    emissive: new Ry.Color(paintedGlow ? 0xffffff : LANTERN_GLOW_COLOR),
    emissiveIntensity: paintedGlow
      ? LANTERN_PAINTED_GLOW_INTENSITY
      : LANTERN_GLOW_INTENSITY,
    alphaMap: source.alphaMap,
    alphaTest: source.alphaTest,
    side: source.side,
    vertexColors: source.vertexColors,
    roughness: 1,
    metalness: 0,
    transparent: true,
    depthWrite: false,
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        attribute float aLanternOpacity;
        attribute float aLanternFlame;
        varying float vLanternOpacity;
        varying float vLanternFlame;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vLanternOpacity = aLanternOpacity;
        vLanternFlame = aLanternFlame;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying float vLanternOpacity;
        varying float vLanternFlame;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        totalEmissiveRadiance *= vLanternOpacity
          * mix(0.85, 1.0, clamp(vLanternFlame, 0.0, 1.0));`,
      )
      .replace(
        "#include <opaque_fragment>",
        `diffuseColor.a *= vLanternOpacity;
        #include <opaque_fragment>`,
      );
  };
  material.customProgramCacheKey = () => "sky-lantern-window-glow-v1";
  return material;
}

function instanceLanternModel(scene, opacity, flame, paintedGlow = null) {
  scene.updateMatrixWorld(true);
  const bounds = new Ry.Box3().setFromObject(scene, true);
  const center = bounds.getCenter(new Ry.Vector3());
  const height = bounds.max.y - bounds.min.y;
  if (!Number.isFinite(height) || height <= 0) {
    throw new Error("Invalid sky lantern GLB bounds.");
  }

  const scale = 1 / height;
  const normalize = new Ry.Matrix4().makeScale(scale, scale, scale);
  normalize.setPosition(center.multiplyScalar(-scale));
  const transform = new Ry.Matrix4();
  const parts = [];
  scene.traverse((object) => {
    if (!object.isMesh) return;
    const geometry = object.geometry.clone();
    geometry.applyMatrix4(
      transform.multiplyMatrices(normalize, object.matrixWorld),
    );
    geometry.setAttribute("aLanternOpacity", opacity);
    geometry.setAttribute("aLanternFlame", flame);
    const material = Array.isArray(object.material)
      ? object.material.map((source) => createLanternMaterial(source, paintedGlow))
      : createLanternMaterial(object.material, paintedGlow);
    const mesh = new Ry.InstancedMesh(geometry, material, opacity.count);
    mesh.instanceMatrix.setUsage(Ry.DynamicDrawUsage);
    mesh.frustumCulled = false;
    mesh.renderOrder = 1.2; // Above transparent water, beneath the sky haze.
    mesh.count = 0;
    parts.push(mesh);
  });
  if (parts.length === 0) throw new Error("No meshes in the sky lantern GLB.");
  return parts;
}

function createFlightSlots(ctx) {
  const random = createSeededRandom(54121);
  const [columns, rows] = ctx.quality.pick([7, 5], [8, 6], [9, 6]);
  const halfWidth = LANDSCAPE_BOUNDS.halfW - 0.95;
  const halfDepth = LANDSCAPE_BOUNDS.halfD - 0.85;
  // Spread one independent flight per cell, including above the lake. Mild
  // jitter and bounded drift keep the top view free of lines and clusters.
  return Array.from({ length: columns * rows }, (_, index) => {
    const x = lerp(
      -halfWidth,
      halfWidth,
      ((index % columns) + 0.16 + random() * 0.68) / columns,
    );
    const z = lerp(
      -halfDepth,
      halfDepth,
      (Math.floor(index / columns) + 0.16 + random() * 0.68) / rows,
    );
    const ground = Math.max(ctx.terrain.height(x, z), ctx.world.lakeLevel);
    const startHeight = ground + lerp(0.65, 1.5, random());
    const travelHeight = Math.max(4.6, lerp(7.5, 9.9, random()) - startHeight);
    return {
      x,
      z,
      startHeight,
      travelHeight,
      size: lerp(0.145, 0.225, random()),
      delay: lerp(0.2, 9.2, random()),
      duration: lerp(32, 61, random()),
      pause: lerp(1.8, 5.4, random()),
      phase: random() * Math.PI * 2,
      yaw: random() * Math.PI * 2,
    };
  });
}

async function loadPaintedGlowTexture() {
  try {
    const response = await fetch(GLOW_URL.href, { cache: "no-cache" });
    if (!response.ok) return null;
    const bitmap = await createImageBitmap(await response.blob());
    const texture = new Ry.Texture(bitmap);
    texture.flipY = false;
    texture.colorSpace = Ry.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  } catch {
    // The painter output is optional; fall back to the paper texture.
    return null;
  }
}

class SkyLanterns {
  constructor(ctx, group) {
    this.ctx = ctx;
    this.group = new Ry.Group();
    this.group.name = "sky-lanterns";
    this.group.visible = false;
    group.add(this.group);
    this.parts = [];
    this.loading = false;
    this.loadFailed = false;
    this.elapsed = 0;
    this.visibility = 0;
    this.transform = new Ry.Object3D();
  }

  async load() {
    this.loading = true;
    try {
      const [{ scene }, paintedGlow] = await Promise.all([
        new CharacterGLTFLoader().loadAsync(MODEL_URL.href),
        loadPaintedGlowTexture(),
      ]);
      const slots = createFlightSlots(this.ctx);
      const opacity = new Ry.InstancedBufferAttribute(
        new Float32Array(slots.length),
        1,
      ).setUsage(Ry.DynamicDrawUsage);
      const flame = new Ry.InstancedBufferAttribute(
        new Float32Array(slots.length),
        1,
      ).setUsage(Ry.DynamicDrawUsage);
      const parts = instanceLanternModel(scene, opacity, flame, paintedGlow);
      this.group.add(...parts);
      this.slots = slots;
      this.opacity = opacity;
      this.flame = flame;
      this.parts = parts;
    } catch (error) {
      this.loadFailed = true;
      console.warn(
        "[sky-lanterns] Could not load the Aholo Lux3D model.",
        error,
      );
    } finally {
      this.loading = false;
    }
  }

  update(dt) {
    const selected = this.ctx.weather.currentScenario === "lanterns";
    if (!selected) this.loadFailed = false;
    if (!this.parts.length) {
      if (selected && !this.loading && !this.loadFailed) this.load();
      return;
    }

    const darkness = smoothstep(0.14, 0.85, this.ctx.world.night);
    const target = selected ? darkness : 0;
    this.visibility = damp(this.visibility, target, 1.35, dt);
    this.group.visible = this.visibility > 0.004;
    if (!this.group.visible) {
      this.elapsed = 0;
      return;
    }
    this.elapsed += dt;

    const { ambient } = this.ctx.wind;
    let count = 0;
    for (const slot of this.slots) {
      const flightTime = this.elapsed - slot.delay;
      if (flightTime < 0) continue;
      const age = flightTime % (slot.duration + slot.pause);
      if (age >= slot.duration) continue;
      const progress = age / slot.duration;
      const sway = slot.phase + age * 0.39;
      const height = slot.startHeight + slot.travelHeight * progress;
      const fadeIn = smoothstep(0, 2.2, age);
      const fadeOut = 1 - smoothstep(0.77, 1, progress);
      this.opacity.setX(count, this.visibility * fadeIn * fadeOut);
      this.flame.setX(count, sampleLanternFlame(age, slot.phase));

      this.transform.position.set(
        slot.x +
          Math.sin(sway) * 0.18 +
          clamp(ambient.x, -1, 1) * 0.56 * progress,
        height,
        slot.z +
          Math.cos(sway * 0.8) * 0.17 +
          clamp(ambient.y, -1, 1) * 0.56 * progress,
      );
      this.transform.rotation.set(
        Math.sin(sway * 0.83) * 0.065,
        slot.yaw + Math.sin(sway * 0.45) * 0.28,
        Math.cos(sway) * 0.085,
      );
      this.transform.scale.setScalar(slot.size);
      this.transform.updateMatrix();
      for (const mesh of this.parts)
        mesh.setMatrixAt(count, this.transform.matrix);
      count++;
    }
    this.opacity.needsUpdate = true;
    this.flame.needsUpdate = true;
    for (const mesh of this.parts) {
      mesh.count = count;
      mesh.instanceMatrix.needsUpdate = true;
    }
  }
}

export { SkyLanterns };
