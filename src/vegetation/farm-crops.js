import {
  ThreeDoubleSide,
  ThreeGroup,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreeMeshDepthMaterial,
  ThreeMeshStandardMaterial,
  ThreeRGBADepthPacking,
  ThreeVector4,
} from "../vendor/three-runtime.js";
import { clamp, createSeededRandom, smoothstep } from "../core/math.js";
import {
  FARM,
  farmCropCoverage,
  farmObjectClearance,
} from "../layout/farm-layout.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import { COMMON_GLSL, sharedUniforms } from "../render/shared-shaders.js";
import { createCropGeometry } from "./crop-geometry.js";
import { VEGETATION_TRANSLUCENCY_GLSL } from "./material-patching.js";
import { wheatActivity } from "./farm-season.js";

const WHEAT_GRID_SPACING = 0.09;
// Continuous annual stages: season, height, golden colour, ears, winter.
const WHEAT_STAGES = [
  [0, 0.34, 0, 0.05, 0],
  [0.65, 0.82, 0.06, 0.65, 0],
  [1, 1, 0.36, 1, 0],
  [2, 1.08, 1, 1, 0],
  [2.55, 1.06, 1, 1, 0],
  [3, 0.14, 0.5, 0.025, 1],
  [3.6, 0.14, 0.34, 0.025, 1],
  [4, 0.34, 0, 0.05, 0],
];

function wheatSeason(season, establishment = 1) {
  const s = ((season % 4) + 4) % 4;
  let index = 0;
  while (index < WHEAT_STAGES.length - 2 && s > WHEAT_STAGES[index + 1][0])
    index++;
  const a = WHEAT_STAGES[index],
    b = WHEAT_STAGES[index + 1];
  const t = smoothstep(a[0], b[0], s);
  const values = a
    .slice(1)
    .map((value, channel) => value + (b[channel + 1] - value) * t);
  // Within a fixed season the crop only grows into its seasonal size. It never
  // enters an unrelated harvest timer that would open holes in the wheat field.
  values[0] *=
    1 -
    (1 - clamp(establishment, 0, 1)) *
      (0.08 + 0.35 * (1 - values[1])) *
      (1 - values[3]);
  return {
    height: values[0],
    golden: values[1],
    ears: values[2],
    winter: values[3],
    presence: wheatActivity(s),
  };
}

// Both visible and depth shaders sample the same live WindField texture. The
// existing wind brush writes that field; there is no duplicate event handler.
const CROP_VERTEX_HEADER = `
uniform vec4 uFarmStage;
uniform float uFarmPresence;
// Filtered prevailing direction and integrated travel; local brush velocity
// never changes the phase of the field-wide gust pattern.
uniform vec4 uFarmFlow;
attribute vec4 aCropRoot;
attribute vec4 aCropState;
attribute float aCropPart;
attribute vec3 aCropAnchor;
vec3 farmScale() {
  float growth = uFarmStage.x;
  return vec3(0.65 + 0.35 * growth, growth, 0.65 + 0.35 * growth) * aCropState.x;
}
vec2 farmBend() {
  vec2 W = windAt(aCropRoot.xz);
  float speed = length(W);
  vec2 direction = uFarmFlow.xy;
  vec2 across = vec2(-direction.y, direction.x);
  float turbulence = clamp(windTurbAt(aCropRoot.xz), 0.0, 1.0);
  vec2 domain = (aCropRoot.xz - uFarmFlow.zw) * 0.8;
  float broad = wgNoise(domain * 0.7 + vec2(19.2, 5.7));
  float detail = wgNoise(domain * 1.65 + vec2(4.8, 23.1) - uFarmFlow.zw * 0.13);
  float crest = smoothstep(0.16, 0.86, broad * 0.78 + detail * 0.22);
  float breeze = 0.10 + 0.28 * crest;
  // Like vegTreeDisplace, layer visible swaying and quick, small flutter on
  // top of the wind's lean. Slow noise alone looks almost static at this scale.
  float patchPhase = wgNoise(aCropRoot.xz * 0.65) * 6.2831853;
  float phase = aCropState.z * 6.2831853;
  float sway = sin(uTime * 2.8 + patchPhase) * 0.70
    + sin(uTime * 4.9 + patchPhase * 1.7) * 0.30;
  float sideSway = sin(uTime * 3.9 + patchPhase * 1.3) * 0.65
    + sin(uTime * 6.1 + phase) * 0.35;
  float swayAmount = 0.17 + crest * 0.10 + min(speed, 4.0) * 0.018;
  // Preserve the accepted ambient sway. The simulated local field is stored
  // on top of the ambient velocity, so amplify only that extra brush force.
  vec2 localWind = texture2D(uWindTex, fieldUV(aCropRoot.xz)).xy - uGustDir;
  float localSpeed = length(localWind);
  // Leave the weak, distant wake gentle rather than amplifying the whole field.
  float localResponse = smoothstep(0.15, 1.0, localSpeed);
  vec2 bend = direction * (breeze + sway * swayAmount)
    + across * sideSway * (0.065 + crest * 0.035)
    + W * (0.21 / (1.0 + speed * 0.14))
    + localWind * (0.64 * localResponse / (1.0 + localSpeed * 0.12));
  bend += across * (detail - broad) * (0.035 + turbulence * 0.015);
  // One phase per stalk keeps its stem, leaves and ear joined; neighbouring
  // stalks still have the independent fine movement visible in tree leaves.
  float stalkPhase = phase + dot(aCropAnchor.xz, vec2(83.0, 47.0));
  float flutter = sin(uTime * (11.0 + aCropState.z * 7.0) + stalkPhase * 7.0)
    + 0.5 * sin(uTime * (17.0 + aCropState.z * 5.0) + stalkPhase * 4.1);
  bend += (direction * 0.4 + across * 0.6) * flutter * (0.028 + turbulence * 0.025);
  bend *= 0.93 + aCropState.z * 0.14;
  vec3 scale = farmScale();
  float H = 0.392 * scale.y;
  // Keep the inner side of even a short seedling from folding over itself.
  // All template vertices lie inside a 0.125 horizontal radius.
  float maxAngle = min(1.05, 0.7 * H / (0.125 * scale.x));
  return bend * maxAngle / sqrt(maxAngle * maxAngle + dot(bend, bend)) * mix(1.0, 0.45, uFarmStage.w);
}
vec2 farmRotate(vec2 p) {
  float c = cos(aCropRoot.w), s = sin(aCropRoot.w);
  return vec2(c * p.x + s * p.y, -s * p.x + c * p.y);
}
vec3 farmLocal(vec3 p) {
  if (aCropPart > 1.5) p = aCropAnchor + (p - aCropAnchor) * uFarmStage.z;
  return p * farmScale();
}
vec3 farmRotateBend(vec3 p, vec3 axis, float theta) {
  return p * cos(theta) + cross(axis, p) * sin(theta) + axis * dot(axis, p) * (1.0 - cos(theta));
}
vec3 farmPosition(vec3 local, vec2 bend) {
  vec3 p = farmLocal(local);
  p.xz = farmRotate(p.xz);
  // Uniform scaling around each root hides dormant crops without zero scales
  // in the normal/curvature calculation. Each clump emerges a little apart.
  float presence = smoothstep(aCropState.z * 0.14, 0.65 + aCropState.z * 0.2, uFarmPresence);
  presence *= mix(0.75, 1.0, aCropState.w);
  float H = max(0.392 * farmScale().y, 0.0001);
  float angle = length(bend);
  if (angle < 0.00001) return aCropRoot.xyz + p * presence;
  vec2 direction = bend / angle;
  float curvature = angle / H;
  float theta = curvature * p.y;
  vec3 axis = vec3(direction.y, 0.0, -direction.x);
  vec3 center = vec3(direction.x * (1.0 - cos(theta)), sin(theta), direction.y * (1.0 - cos(theta))) / curvature;
  return aCropRoot.xyz + (center + farmRotateBend(vec3(p.x, 0.0, p.z), axis, theta)) * presence;
}
vec3 farmNormal(vec3 n, vec3 local, vec2 bend) {
  vec3 scale = farmScale();
  n /= scale;
  n.xz = farmRotate(n.xz);
  float angle = length(bend);
  if (angle < 0.00001) return normalize(n);
  vec2 direction = bend / angle;
  vec3 p = farmLocal(local);
  p.xz = farmRotate(p.xz);
  float curvature = angle / max(0.392 * scale.y, 0.0001);
  float theta = curvature * p.y;
  // Inverse-transpose of the same curved cross-section used by farmPosition.
  n.y /= max(1.0 - curvature * dot(p.xz, direction), 0.3);
  return normalize(farmRotateBend(n, vec3(direction.y, 0.0, -direction.x), theta));
}
`;
const CROP_VARYINGS = "varying vec4 vFarmCrop;\nvarying vec2 vFarmRoot;\n";

function createCropMaterials(ctx, uniforms) {
  const common = ctx.GLSL_COMMON || COMMON_GLSL;
  const material = new ThreeMeshStandardMaterial({
    vertexColors: true,
    side: ThreeDoubleSide,
    roughness: 0.88,
    metalness: 0,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      common +
      CROP_VERTEX_HEADER +
      CROP_VARYINGS +
      shader.vertexShader
        .replace(
          "#include <beginnormal_vertex>",
          "vec2 cropBend = farmBend();\nvec3 objectNormal = farmNormal(normal, position, cropBend);",
        )
        .replace(
          "#include <begin_vertex>",
          `vec3 transformed = farmPosition(position, cropBend);
        vFarmCrop = vec4(aCropPart, aCropState.y, aCropState.z, clamp(position.y / 0.392, 0.0, 1.0));
        vFarmRoot = aCropRoot.xz;`,
        );
    shader.fragmentShader =
      common +
      "uniform vec4 uFarmStage;\n" +
      CROP_VARYINGS +
      shader.fragmentShader
        .replace(
          "#include <lights_physical_pars_fragment>",
          `#include <lights_physical_pars_fragment>\n${VEGETATION_TRANSLUCENCY_GLSL}`,
        )
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
        float golden = clamp(uFarmStage.y + (vFarmCrop.y - 0.5) * 0.1, 0.0, 1.0);
        vec3 straw = mix(vec3(0.40, 0.26, 0.07), vec3(0.68, 0.46, 0.16), vFarmCrop.w);
        diffuseColor.rgb = mix(diffuseColor.rgb, straw, golden * 0.96);
        diffuseColor.rgb *= 0.9 + vFarmCrop.z * 0.2;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.3, 0.25, 0.15), uFarmStage.w * 0.65);
        vec4 field = groundAt(vFarmRoot);
        diffuseColor.rgb *= 1.0 - field.y * 0.16;
        float snow = smoothstep(0.015, 0.16, field.x) * smoothstep(0.1, 0.5, vFarmCrop.w);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.83, 0.88, 0.9), snow * 0.93);
        // Thin leaves and husks transmit light like the surrounding plants;
        // stems, buried roots and snow-covered tissue remain less translucent.
        float thinness = vFarmCrop.x < 0.5 ? 0.18 : (vFarmCrop.x < 1.5 ? 0.65 : 0.45);
        vegTransAmt = thinness * mix(0.35, 1.0, vFarmCrop.w) * (1.0 - snow * 0.93);`,
        )
        .replace(
          "#include <aomap_fragment>",
          `#include <aomap_fragment>
        // Approximate diffuse sky light scattered through neighbouring blades.
        // It follows the actual ambient illumination, including dusk and night.
        vec3 cropSky = mix(uGroundColor, uSkyColor, 0.8) * uAmbientIntensity;
        reflectedLight.indirectDiffuse += diffuseColor.rgb * cropSky * vegTransAmt * 0.55;`,
        );
  };
  material.customProgramCacheKey = () => "wg-wheat-field-v7";
  const depth = new ThreeMeshDepthMaterial({
    depthPacking: ThreeRGBADepthPacking,
    side: ThreeDoubleSide,
  });
  depth.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      common +
      CROP_VERTEX_HEADER +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        "vec3 transformed = farmPosition(position, farmBend());",
      );
  };
  depth.customProgramCacheKey = () => "wg-wheat-field-depth-v7";
  return { material, depth };
}

class FarmCrops {
  constructor(ctx, parent) {
    this.ctx = ctx;
    this.elapsed = 0;
    this.group = new ThreeGroup();
    this.group.name = "farm-wheat-field";
    this.uniforms = {
      ...sharedUniforms,
      ...ctx.uniforms,
      uFarmStage: { value: new ThreeVector4() },
      uFarmPresence: { value: 0 },
      uFarmFlow: { value: new ThreeVector4(1, 0, 0, 0) },
    };
    const ambient = ctx.wind?.ambient || this.uniforms.uGustDir.value;
    this.flowAngle = Math.atan2(ambient.y, ambient.x);
    this.flowSpeed =
      0.22 + Math.min(1.5, Math.hypot(ambient.x, ambient.y)) * 0.1;
    if (!ctx.uniforms?.uWindTex && ctx.wind?.texture)
      this.uniforms.uWindTex = { value: ctx.wind.texture };
    this.materials = createCropMaterials(ctx, this.uniforms);
    this.plants = [];
    const keep = ctx.quality?.pick(0.64, 0.84, 1) ?? 0.84;
    const { field } = FARM;
    const random = createSeededRandom(4087);
    const margin = 0.35;
    const columns = Math.ceil((field.width + margin * 2) / WHEAT_GRID_SPACING);
    const rows = Math.ceil((field.depth + margin * 2) / WHEAT_GRID_SPACING);
    for (let row = 0; row <= rows; row++) {
      for (let column = 0; column <= columns; column++) {
        const x =
          field.x +
          (column - columns / 2 + (row % 2) * 0.5) * WHEAT_GRID_SPACING +
          (random() - 0.5) * 0.03;
        const z =
          field.z +
          (row - rows / 2) * WHEAT_GRID_SPACING +
          (random() - 0.5) * 0.03;
        const plant = {
          row,
          column,
          x,
          y: terrainHeight(x, z) + 0.005,
          z,
          yaw: random() * Math.PI * 2,
          scale: 0.88 + random() * 0.24,
          tint: random(),
          seed: random(),
          coverage: farmCropCoverage(x, z),
        };
        const selected = random() <= keep;
        if (
          selected &&
          plant.tint < plant.coverage &&
          farmObjectClearance(x, z) > 0.015
        )
          this.plants.push(plant);
      }
    }
    const base = createCropGeometry();
    const geometry = new ThreeInstancedBufferGeometry();
    for (const [name, attribute] of Object.entries(base.attributes))
      geometry.setAttribute(name, attribute.clone());
    base.dispose();
    const roots = new Float32Array(this.plants.length * 4);
    const states = new Float32Array(this.plants.length * 4);
    this.plants.forEach((plant, index) => {
      roots.set([plant.x, plant.y, plant.z, plant.yaw], index * 4);
      states.set(
        [plant.scale, plant.tint, plant.seed, plant.coverage],
        index * 4,
      );
    });
    geometry.setAttribute(
      "aCropRoot",
      new ThreeInstancedBufferAttribute(roots, 4),
    );
    geometry.setAttribute(
      "aCropState",
      new ThreeInstancedBufferAttribute(states, 4),
    );
    geometry.instanceCount = this.plants.length;
    this.mesh = new ThreeMesh(geometry, this.materials.material);
    this.mesh.customDepthMaterial = this.materials.depth;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.mesh.name = "farm-wheat";
    this.group.add(this.mesh);
    this.stats = {
      plants: this.plants.length,
      wheat: this.plants.length,
      stalks: this.plants.length * 3,
      drawCalls: 1,
      triangles: (geometry.attributes.position.count / 3) * this.plants.length,
      gridSpacing: WHEAT_GRID_SPACING,
    };
    (parent || ctx.scene).add(this.group);
    this.update(0);
  }

  update(dt) {
    if (this.disposed || !(dt >= 0) || !Number.isFinite(dt)) return;
    const step = Math.min(dt, 0.25);
    this.elapsed += step;
    const ambient = this.ctx.wind?.ambient || this.uniforms.uGustDir.value;
    const speed = Math.hypot(ambient.x, ambient.y);
    if (speed > 0.0001) {
      const target = Math.atan2(ambient.y, ambient.x);
      const delta = Math.atan2(
        Math.sin(target - this.flowAngle),
        Math.cos(target - this.flowAngle),
      );
      this.flowAngle += delta * (1 - Math.exp(-step * 0.7));
    }
    this.flowSpeed +=
      (0.22 + Math.min(1.5, speed) * 0.1 - this.flowSpeed) *
      (1 - Math.exp(-step));
    const flow = this.uniforms.uFarmFlow.value;
    flow.x = Math.cos(this.flowAngle);
    flow.y = Math.sin(this.flowAngle);
    // Integrating travel avoids teleporting the noise domain when wind turns.
    flow.z += flow.x * this.flowSpeed * step;
    flow.w += flow.y * this.flowSpeed * step;
    const world = this.ctx.world || {};
    const stage = wheatSeason(
      world.season ?? 0.25,
      1 - Math.exp(-this.elapsed / 65),
    );
    this.uniforms.uFarmStage.value.set(
      stage.height,
      stage.golden,
      stage.ears,
      stage.winter,
    );
    this.uniforms.uFarmPresence.value = stage.presence;
    this.mesh.visible = stage.presence > 0;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.group.removeFromParent();
    this.mesh.geometry.dispose();
    this.materials.material.dispose();
    this.materials.depth.dispose();
  }
}

export { FarmCrops, wheatSeason };
