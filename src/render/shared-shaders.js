// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeColor,
  ThreeDataTexture,
  ThreeFloatType,
  ThreeMatrix4,
  ThreeRGBAFormat,
  ThreeShaderChunk,
  ThreeVector2,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { CLOUD_LAYER_HEIGHTS, FIELD_BOUNDS } from "../core/config.js";
const emptyFieldTexture = new ThreeDataTexture(
  new Float32Array([0, 0, 0, 0]),
  1,
  1,
  ThreeRGBAFormat,
  ThreeFloatType,
);
emptyFieldTexture.needsUpdate = !0;
const sharedUniforms = {
  uTime: {
    value: 0,
  },
  uSunDir: {
    value: new ThreeVector3(0, 1, 0),
  },
  uLightDir: {
    value: new ThreeVector3(0, 1, 0),
  },
  uLightColor: {
    value: new ThreeColor(1, 1, 1),
  },
  uSkyColor: {
    value: new ThreeColor(0.6, 0.75, 1),
  },
  uGroundColor: {
    value: new ThreeColor(0.3, 0.26, 0.2),
  },
  uHazeColor: {
    value: new ThreeColor(0.75, 0.83, 0.95),
  },
  uNight: {
    value: 0,
  },
  uGolden: {
    value: 0,
  },
  uFlash: {
    value: 0,
  },
  uStorm: {
    value: 0,
  },
  uSeason: {
    value: 0,
  },
  uSeaTemp: {
    value: 15,
  },
  uLapse: {
    value: 5,
  },
  uLeafAmount: {
    value: 1,
  },
  uBlossom: {
    value: 0,
  },
  uFlowers: {
    value: 1,
  },
  uGrassColor: {
    value: new ThreeColor(),
  },
  uGrassDry: {
    value: new ThreeColor(),
  },
  uFoliageColor: {
    value: new ThreeColor(),
  },
  uFoliageColor2: {
    value: new ThreeColor(),
  },
  uPineColor: {
    value: new ThreeColor(),
  },
  uWaterLevel: {
    value: 0.1,
  },
  uHumidity: {
    value: 0.5,
  },
  uFieldMin: {
    value: new ThreeVector2(FIELD_BOUNDS.minX, FIELD_BOUNDS.minZ),
  },
  uFieldSize: {
    value: new ThreeVector2(FIELD_BOUNDS.sizeX, FIELD_BOUNDS.sizeZ),
  },
  uWindTex: {
    value: null,
  },
  uGroundTex: {
    value: null,
  },
  uTerrainTex: {
    value: null,
  },
  uGustDir: {
    value: new ThreeVector2(1, 0),
  },
  uAmbientIntensity: {
    value: 1,
  },
  uCloudShadowTex: {
    value: emptyFieldTexture,
  },
  uCloudLayerY: {
    value: CLOUD_LAYER_HEIGHTS.defaultY,
  },
  uCameraWorld: {
    value: new ThreeMatrix4(),
  },
};
function updateSharedUniforms(r, t) {
  const { world: e, wind: i, fields: s } = r;
  ((sharedUniforms.uTime.value = t),
    sharedUniforms.uSunDir.value.copy(e.sunDir),
    sharedUniforms.uLightDir.value.copy(e.lightDir),
    sharedUniforms.uLightColor.value
      .copy(e.lightColor)
      .multiplyScalar(e.lightIntensity),
    sharedUniforms.uSkyColor.value.copy(e.skyColor),
    sharedUniforms.uGroundColor.value.copy(e.groundColor),
    sharedUniforms.uHazeColor.value.copy(e.hazeColor),
    (sharedUniforms.uNight.value = e.night),
    (sharedUniforms.uGolden.value = e.golden),
    (sharedUniforms.uFlash.value = e.flash),
    (sharedUniforms.uStorm.value = e.storminess),
    (sharedUniforms.uSeason.value = e.season),
    (sharedUniforms.uSeaTemp.value = e.seaLevelTemp),
    (sharedUniforms.uLapse.value = e.seaLevelTemp - e.temperatureAt(1)));
  const n = e.seasonal;
  ((sharedUniforms.uLeafAmount.value = n.leafAmount),
    (sharedUniforms.uBlossom.value = n.blossom),
    (sharedUniforms.uFlowers.value = n.flowers),
    sharedUniforms.uGrassColor.value.copy(n.grass),
    sharedUniforms.uGrassDry.value.copy(n.grassDry),
    sharedUniforms.uFoliageColor.value.copy(n.foliage),
    sharedUniforms.uFoliageColor2.value.copy(n.foliage2),
    sharedUniforms.uPineColor.value.copy(n.pine),
    (sharedUniforms.uWaterLevel.value = e.lakeLevel),
    (sharedUniforms.uHumidity.value = e.humidity),
    (sharedUniforms.uWindTex.value = i.texture),
    (sharedUniforms.uGroundTex.value = s.texture),
    sharedUniforms.uGustDir.value.copy(i.ambient),
    (sharedUniforms.uAmbientIntensity.value = e.ambientIntensity),
    r.camera.updateMatrixWorld(),
    sharedUniforms.uCameraWorld.value.copy(r.camera.matrixWorld));
}
let cloudShadowPatchInstalled = !1;
function installCloudShadowPatch() {
  if (cloudShadowPatchInstalled) return;
  cloudShadowPatchInstalled = !0;
  const r = "getDirectionalLightInfo( directionalLight, directLight );",
    t = ThreeShaderChunk.lights_fragment_begin;
  if (!t.includes(r)) {
    console.warn(
      "[shared] lights_fragment_begin hook not found; cloud shadows disabled on built-in materials",
    );
    return;
  }
  ThreeShaderChunk.lights_fragment_begin = t.replace(
    r,
    `${r}
		#ifdef WG_COMMON
		directLight.color *= cloudShadowAt( ( uCameraWorld * vec4( geometryPosition, 1.0 ) ).xyz );
		#endif`,
  );
}
const COMMON_GLSL = `
#ifndef WG_COMMON
#define WG_COMMON
uniform float uTime;
uniform vec3 uSunDir;
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uHazeColor;
uniform float uNight;
uniform float uGolden;
uniform float uFlash;
uniform float uStorm;
uniform float uSeason;
uniform float uSeaTemp;
uniform float uLapse;
uniform float uLeafAmount;
uniform float uBlossom;
uniform float uFlowers;
uniform vec3 uGrassColor;
uniform vec3 uGrassDry;
uniform vec3 uFoliageColor;
uniform vec3 uFoliageColor2;
uniform vec3 uPineColor;
uniform float uWaterLevel;
uniform float uHumidity;
uniform vec2 uFieldMin;
uniform vec2 uFieldSize;
uniform sampler2D uWindTex;
uniform sampler2D uGroundTex;
uniform sampler2D uTerrainTex;
uniform vec2 uGustDir;
uniform float uAmbientIntensity;
uniform sampler2D uCloudShadowTex;
uniform float uCloudLayerY;
uniform mat4 uCameraWorld;

vec2 fieldUV(vec2 xz) { return clamp((xz - uFieldMin) / uFieldSize, 0.0, 1.0); }

float wgHash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float wgHash3(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float wgNoise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(wgHash(i), wgHash(i + vec2(1, 0)), u.x), mix(wgHash(i + vec2(0, 1)), wgHash(i + vec2(1, 1)), u.x), u.y);
}
float wgNoise3(vec3 x) {
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wgHash3(i + vec3(0, 0, 0)), wgHash3(i + vec3(1, 0, 0)), f.x),
                 mix(wgHash3(i + vec3(0, 1, 0)), wgHash3(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(wgHash3(i + vec3(0, 0, 1)), wgHash3(i + vec3(1, 0, 1)), f.x),
                 mix(wgHash3(i + vec3(0, 1, 1)), wgHash3(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float wgFbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * wgNoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
float wgFbm3(vec3 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * wgNoise3(p); p = p * 2.02 + 11.7; a *= 0.5; } return s; }

/** Wind (units/s) at xz: simulated field + travelling gusts. .xy = horizontal velocity. */
vec2 windAt(vec2 xz) {
  vec4 w = texture2D(uWindTex, fieldUV(xz));
  vec2 dir = uGustDir;
  float g = wgNoise(xz * 0.35 - dir * uTime * 0.5 + vec2(uTime * 0.05, 0.0));
  float gust = 0.55 + 0.9 * g;
  return w.xy + dir * (gust - 1.0) * (0.6 + uStorm);
}
/** Wind turbulence 0..1 at xz. */
float windTurbAt(vec2 xz) { return texture2D(uWindTex, fieldUV(xz)).a; }

/** Ground fields at xz: x = snow depth, y = wetness, z = rain-now, w = frost. */
vec4 groundAt(vec2 xz) { return texture2D(uGroundTex, fieldUV(xz)); }
/** Snow coverage 0..1 for a surface with world normal n (flat surfaces hold more). */
float snowCover(vec2 xz, vec3 n) {
  float d = texture2D(uGroundTex, fieldUV(xz)).x;
  float flat_ = smoothstep(0.35, 0.85, n.y);
  return smoothstep(0.03, 0.35, d * (0.35 + 0.65 * flat_));
}

/** Terrain: x = height, y = river mask, z = lake mask, w = slope. */
vec4 terrainAt(vec2 xz) { return texture2D(uTerrainTex, fieldUV(xz)); }
float groundHeightAt(vec2 xz) { return texture2D(uTerrainTex, fieldUV(xz)).x; }

/** Direct-light transmittance (0..1) through the clouds for a world-space point: soft, partial cloud shadows. */
float cloudShadowAt(vec3 wp) {
  vec3 L = normalize(uLightDir);
  vec2 q = wp.xz + L.xz / max(L.y, 0.2) * max(uCloudLayerY - wp.y, 0.0);
  vec2 uv = (q - uFieldMin) / uFieldSize;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 1.0;
  return exp(-texture2D(uCloudShadowTex, uv).r);
}

/** Air temperature (°C) at altitude y. */
float temperatureAt(float y) { return uSeaTemp - uLapse * max(y, 0.0); }

/** Cheap interior-atmosphere tint: blends colour toward haze with distance d (world units). */
vec3 applyHaze(vec3 col, float d, float heightY) {
  float k = 1.0 - exp(-d * (0.012 + uStorm * 0.02 + uHumidity * 0.006));
  k *= mix(1.0, 0.6, smoothstep(0.0, 5.0, heightY));
  return mix(col, uHazeColor * (1.0 + uFlash), clamp(k, 0.0, 1.0));
}
#endif
`;
export {
  COMMON_GLSL,
  installCloudShadowPatch,
  sharedUniforms,
  updateSharedUniforms,
};
