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
import { bindWindowGlow, updateWindowGlow } from "../render/window-glow.js";
import { sampleLanternFlame } from "./lantern-light.js";

const MODEL_URL = new URL(
  "../../assets/sky-lantern/aholo-kongming.glb",
  import.meta.url,
);
const GLOW_URL = new URL(
  "../../assets/sky-lantern/aholo-kongming.glow.webp",
  import.meta.url,
);
const LANTERN_WINDOW_GLOW_SCALE = 0.16;
const LANTERN_GROUND_LIGHT_INTENSITY = 0.18;
const LANTERN_WICK_Y = -0.33;
const LANTERN_LAUNCH_CYCLE = 48;

function createLanternMaterial(source, glowTexture) {
  const material = new Ry.MeshStandardMaterial({
    color: source.color,
    map: source.map,
    alphaMap: source.alphaMap,
    alphaTest: source.alphaTest,
    side: source.side,
    vertexColors: source.vertexColors,
    roughness: 1,
    metalness: 0,
    transparent: true,
    depthWrite: false,
  });
  if (glowTexture) {
    bindWindowGlow(material, glowTexture, LANTERN_WINDOW_GLOW_SCALE);
    updateWindowGlow(material, 1);
  }
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        attribute float aLanternOpacity;
        attribute float aLanternFlame;
        varying float vLanternOpacity;
        varying float vLanternFlame;
        varying float vLanternHeight;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vLanternOpacity = aLanternOpacity;
        vLanternFlame = aLanternFlame;
        vLanternHeight = position.y;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying float vLanternOpacity;
        varying float vLanternFlame;
        varying float vLanternHeight;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float flame = clamp(vLanternFlame, 0.0, 1.0);
        // Preserve the wick's bloom after downsampling in the valley overview.
        float distant = smoothstep(0.08, 0.33, fwidth(vLanternHeight));
        float wickOffset = vLanternHeight - ${LANTERN_WICK_Y};
        float wickWidth = wickOffset < 0.0 ? 0.075 : mix(0.16, 0.24, distant);
        float wickDistance = wickOffset / wickWidth;
        float wick = exp2(-wickDistance * wickDistance);
        float wickGlow = wick * mix(5.5, 7.4, flame) * mix(1.0, 3.0, distant);
        totalEmissiveRadiance *= mix(0.78, 1.0, flame) + wickGlow;`,
      )
      .replace(
        "#include <opaque_fragment>",
        `diffuseColor.a *= vLanternOpacity;
        #include <opaque_fragment>`,
      );
  };
  material.customProgramCacheKey = () => "sky-lantern-window-glow";
  return material;
}

function instanceLanternModel(scene, opacity, flame, glowTexture) {
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
      ? object.material.map((source) =>
          createLanternMaterial(source, glowTexture),
        )
      : createLanternMaterial(object.material, glowTexture);
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
  // Spread one flight per cell, including above the lake.
  const slots = Array.from({ length: columns * rows }, (_, index) => {
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
      ground,
      startHeight,
      travelHeight,
      size: lerp(0.145, 0.225, random()),
      duration: lerp(38, 46, random()),
      phase: random() * Math.PI * 2,
      yaw: random() * Math.PI * 2,
    };
  });
  // Shuffle the spatial order so launches don't sweep across the valley in
  // rows. Stagger launches across the whole cycle, including the first one.
  for (let index = slots.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [slots[index], slots[other]] = [slots[other], slots[index]];
  }
  const interval = LANTERN_LAUNCH_CYCLE / slots.length;
  for (const [index, slot] of slots.entries()) {
    slot.launchOffset = (index + lerp(0.2, 0.8, random())) * interval;
  }
  return slots;
}

class SkyLanterns {
  constructor(ctx, group) {
    this.ctx = ctx;
    this.group = new Ry.Group();
    this.group.name = "sky-lanterns";
    this.group.visible = false;
    group.add(this.group);
    // A fixed light count avoids recompiling lit materials when lanterns launch.
    this.groundLights = [0, 1].map(
      () => new Ry.PointLight(0xffb46a, 0, 1.55, 2),
    );
    group.add(...this.groundLights);
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
      const [{ scene }, glowTexture] = await Promise.all([
        new CharacterGLTFLoader().loadAsync(MODEL_URL.href),
        new Ry.TextureLoader().loadAsync(GLOW_URL.href).catch(() => null),
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
      const parts = instanceLanternModel(scene, opacity, flame, glowTexture);
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
    const [firstLight, secondLight] = this.groundLights;
    firstLight.intensity = secondLight.intensity = 0;
    if (!this.group.visible) {
      this.elapsed = 0;
      return;
    }
    this.elapsed += dt;

    const { ambient } = this.ctx.wind;
    let count = 0;
    for (const slot of this.slots) {
      const flightTime = this.elapsed - slot.launchOffset;
      if (flightTime < 0) continue;
      const age = flightTime % LANTERN_LAUNCH_CYCLE;
      if (age >= slot.duration) continue;
      const progress = age / slot.duration;
      const sway = slot.phase + age * 0.39;
      const height = slot.startHeight + slot.travelHeight * progress;
      const fadeIn = smoothstep(0, 2.2, age);
      const fadeOut = 1 - smoothstep(0.77, 1, progress);
      const opacity = this.visibility * fadeIn * fadeOut;
      const flame = sampleLanternFlame(age, slot.phase);
      this.opacity.setX(count, opacity);
      this.flame.setX(count, flame);

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
      const groundLight =
        firstLight.intensity <= secondLight.intensity
          ? firstLight
          : secondLight;
      const lift = height - slot.ground;
      const intensity =
        LANTERN_GROUND_LIGHT_INTENSITY *
        opacity *
        (1 - smoothstep(0.8, 1.65, lift)) *
        lerp(0.65, 1, clamp(flame, 0, 1));
      if (intensity > groundLight.intensity) {
        groundLight.position
          .set(0, LANTERN_WICK_Y, 0)
          .applyMatrix4(this.transform.matrix);
        groundLight.intensity = intensity;
      }
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
