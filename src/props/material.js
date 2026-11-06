// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeMeshStandardMaterial } from "../vendor/three-runtime.js";
const PROP_VERTEX_DECLARATIONS = `
attribute vec3 aCol;
attribute vec3 aGrain;
attribute vec4 aInfo;
attribute vec4 aRoof;
uniform float uRoofSnow;
varying vec3 vCol;
varying vec3 vGrain;
varying vec4 vInfo;
varying vec3 vLWPos;
varying vec3 vLWNrm;
varying vec3 vRoofN;
varying float vRoofStep;
`;
const PROP_VERTEX_TRANSFORM = `
#include <begin_vertex>
vRoofStep = aRoof.w;
if (dot(aRoof.xyz, aRoof.xyz) > 0.25) {
  // snow load on the shingles: fills the steps first, then grows (lumpy, thicker mid-roof)
  vec3 wpR = (modelMatrix * vec4(transformed, 1.0)).xyz;
  float lump = 0.75 + 0.5 * wgNoise(wpR.xz * 23.0) + 0.25 * wgNoise(wpR.xz * 61.0 + 3.0);
  float sd = uRoofSnow * lump;
  float lift = max(0.0, sd - aRoof.w);
  transformed += aRoof.xyz * lift;
}
`;
const PROP_WORLD_POSITION = `
{
  vec4 lw = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
  lw = instanceMatrix * lw;
  #endif
  lw = modelMatrix * lw;
  vLWPos = lw.xyz;
  vLWNrm = normalize(mat3(modelMatrix) * objectNormal);
  vRoofN = normalize(mat3(modelMatrix) * (dot(aRoof.xyz, aRoof.xyz) > 0.25 ? aRoof.xyz : objectNormal));
  vCol = aCol;
  vGrain = aGrain;
  vInfo = aInfo;
}
`;
const PROP_FRAGMENT_SURFACE = `
uniform float uRoofSnow;
uniform float uLifeGlow;
uniform float uLifeFlicker;
uniform float uLifeWet;
varying vec3 vCol;
varying vec3 vGrain;
varying vec4 vInfo;
varying vec3 vLWPos;
varying vec3 vLWNrm;
varying vec3 vRoofN;
varying float vRoofStep;

struct PropSurf { vec3 albedo; float rough; float metal; float height; float bump; float ao; vec3 emissive; float snowOK; };

float lHash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
float lHash2(vec2 p) { return fract(sin(dot(p, vec2(41.31, 289.17))) * 43758.5453); }
float lLum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

/** Shared wood body: rings around the (virtual) pith + fibres along the grain + knots. */
vec3 woodBody(vec3 g, vec3 base, float seed, float ringScale, out float h) {
  float n1 = wgNoise(vec2(g.x * 5.0 + seed * 31.0, seed * 7.3));
  float rr = length(g.yz);
  float rings = rr * ringScale + n1 * 2.4 + wgNoise3(g * vec3(7.0, 48.0, 48.0) + seed) * 1.1;
  float ringAA = clamp(1.4 - fwidth(rings) * 1.2, 0.0, 1.0);
  float rf = fract(rings);
  float late = smoothstep(0.45, 0.8, rf) * (1.0 - smoothstep(0.86, 1.0, rf)) * ringAA;
  float px = length(fwidth(vLWPos));
  float fibAA = clamp(1.0 - px * 220.0, 0.0, 1.0);
  float fib = wgNoise(vec2(g.x * 26.0 + seed, (g.y * 0.7 + g.z) * 330.0));
  float streak = wgNoise(vec2(g.x * 3.0 + seed * 3.0, (g.y + g.z) * 60.0));
  vec3 col = base * (0.86 + 0.24 * n1) * (1.0 - late * 0.2) * (1.0 + (fib - 0.5) * 0.2 * fibAA) * (0.92 + 0.16 * streak);
  h = (fib - 0.5) * 0.4 * fibAA - late * 0.5;
  return col;
}

PropSurf propSurface() {
  PropSurf s;
  vec3 g = vGrain;
  float seed = vInfo.x;
  int kind = int(vInfo.y + 0.5);
  float param = vInfo.w;
  vec3 base = vCol;
  s.albedo = base; s.rough = 0.82; s.metal = 0.0; s.height = 0.0; s.bump = 0.0; s.ao = 1.0;
  s.emissive = vec3(0.0); s.snowOK = 1.0;
  float px = length(fwidth(vLWPos));
  float detail = clamp(1.0 - px * 90.0, 0.0, 1.0);   // fades fine detail with distance

  if (kind == 0) {
    // ---- debarked round log (param = radius; negative = sawn end cap)
    float h;
    if (param < 0.0) {
      // end grain: pale, concentric rings, radial checks, darker weathered rim
      float r = length(g.yz) / max(-param, 1e-3);
      float rings = length(g.yz) * 260.0 + wgNoise(g.yz * 120.0 + seed * 9.0) * 1.6;
      float ring = smoothstep(0.35, 0.5, fract(rings)) * smoothstep(1.0, 0.7, fract(rings)) * clamp(1.4 - fwidth(rings), 0.0, 1.0);
      float ang = atan(g.z, g.y);
      float check = smoothstep(0.93, 0.99, wgNoise(vec2(ang * 3.0 + seed * 13.0, 1.0))) * smoothstep(0.15, 0.9, r);
      vec3 endc = mix(vec3(0.42, 0.3, 0.18), base * 1.05, 0.4);
      s.albedo = endc * (1.0 - ring * 0.16) * (1.0 - check * 0.55) * mix(1.0, 0.62, smoothstep(0.78, 1.0, r));
      s.albedo *= mix(1.0, 0.82, smoothstep(0.0, 0.25, r) * (1.0 - smoothstep(0.0, 0.12, r))); // pith
      s.height = -check * 0.6 - ring * 0.2;
      s.bump = 0.0012;
      s.rough = 0.9;
    } else {
      vec3 col = woodBody(g * vec3(1.0, 0.4, 0.4), base, seed, 80.0, h);
      float ang = atan(g.z, g.y);
      float arc = ang * param;
      // seasoning checks along the grain
      float chk = smoothstep(0.88, 0.96, wgNoise(vec2(g.x * 7.0 + seed * 5.0, arc * 95.0)));
      // knots
      vec2 kc = vec2(g.x * 14.0 + seed * 3.0, arc * 26.0);
      vec2 ki = floor(kc);
      vec2 kf = fract(kc) - 0.5 - (vec2(lHash2(ki), lHash2(ki + 7.1)) - 0.5) * 0.5;
      float knot = (1.0 - smoothstep(0.08, 0.2, length(kf * vec2(1.0, 1.6)))) * step(0.72, lHash2(ki + seed));
      col *= (1.0 - chk * 0.45 * detail) * (1.0 - knot * 0.45);
      // contact shadow where logs bed on each other / chinking
      float yN = g.y / max(param, 1e-3);
      s.ao = 1.0 - 0.55 * smoothstep(0.45, 0.98, abs(yN)) * (0.6 + 0.4 * step(yN, 0.0));
      // sun-bleached silver on the upper side
      col = mix(col, vec3(lLum(col)) * vec3(1.02, 1.0, 0.98) * 1.15, 0.18 * smoothstep(0.0, 0.8, yN));
      s.albedo = col;
      s.height = h * 0.6 - chk * 0.8 - knot * 0.3;
      s.bump = 0.0009 * detail;
      s.rough = 0.86;
    }
  } else if (kind == 1 || kind == 2 || kind == 4) {
    // ---- sawn boards: plank (1), weathered grey jetty board (2), painted board (4)
    float h;
    vec3 wb = base;
    if (kind == 4) wb = vec3(0.42, 0.29, 0.17);
    vec3 col = woodBody(g, wb, seed, 150.0, h);
    // board grooves (param = board width)
    float groove = 0.0;
    float boardId = 0.0;
    if (param > 0.0) {
      float b = g.y / param;
      boardId = floor(b);
      float gv = abs(fract(b) - 0.5) * 2.0;
      float aa = fwidth(b) * 2.0;
      groove = smoothstep(1.0 - 0.12 - aa, 1.0 - 0.02, gv);
      col *= 0.88 + 0.24 * lHash(boardId * 7.7 + seed * 3.1);
    }
    if (kind == 2) {
      // silver-grey weathered timber, raised grain, wet & algae near the waterline
      col = mix(col, vec3(lLum(col)) * vec3(0.98, 1.0, 1.03), 0.72) * 1.08;
      float wl = smoothstep(uWaterLevel + 0.035, uWaterLevel - 0.01, vLWPos.y);
      col = mix(col, col * vec3(0.42, 0.5, 0.36), wl);
      col = mix(col, col * vec3(0.38, 0.36, 0.32), smoothstep(uWaterLevel - 0.005, uWaterLevel - 0.06, vLWPos.y));
      s.rough = mix(0.88, 0.45, wl);
      h *= 1.6;
    } else if (kind == 4) {
      // paint over wood, chipped on edges and in patches
      float wearN = wgNoise(vLWPos.xz * 140.0 + vLWPos.y * 90.0 + seed * 11.0) * 0.6 + wgNoise(vLWPos.xy * 40.0 + seed) * 0.4;
      float wear = smoothstep(0.66, 0.74, wearN) * detail;
      vec3 paint = base * (0.93 + 0.1 * wgNoise(g.xy * 30.0 + seed));
      col = mix(paint, col, wear);
      s.rough = mix(0.52, 0.85, wear);
      h = h * wear + (1.0 - wear) * 0.25;
    } else {
      s.rough = 0.8;
    }
    col *= 1.0 - groove * 0.6;
    s.ao = 1.0 - groove * 0.4;
    s.albedo = col;
    s.height = h * 0.5 - groove * 1.2;
    s.bump = 0.0007 * detail;
  } else if (kind == 3) {
    // ---- bark (woodpile, stump)
    float ang = atan(g.z, g.y);
    float arc = ang * max(abs(param), 0.004);
    float ridge = wgNoise(vec2(g.x * 30.0 + seed * 9.0, arc * 220.0));
    float fiss = smoothstep(0.35, 0.15, ridge);
    float lich = smoothstep(0.7, 0.85, wgNoise(vec2(g.x * 12.0, arc * 60.0) + seed * 3.0));
    vec3 col = base * (0.75 + 0.5 * ridge) * (1.0 - fiss * 0.5);
    col = mix(col, vec3(0.5, 0.55, 0.42), lich * 0.4);
    if (param < 0.0) {
      // split / sawn face of firewood: pale fresh wood with rings
      float rings = length(g.yz) * 300.0 + wgNoise(g.yz * 100.0 + seed) * 1.5;
      float ring = smoothstep(0.4, 0.55, fract(rings)) * smoothstep(1.0, 0.75, fract(rings));
      float r = length(g.yz) / max(-param, 1e-3);
      col = vec3(0.46, 0.33, 0.19) * (0.85 + 0.3 * lHash(seed * 17.0)) * (1.0 - ring * 0.14) * mix(1.0, 0.45, smoothstep(0.82, 1.0, r));
      ridge = 0.5; fiss = 0.0;
    }
    s.albedo = col;
    s.height = ridge - fiss;
    s.bump = 0.0009 * detail;
    s.rough = 0.95;
  } else if (kind == 5) {
    // ---- wrought iron: dark, slightly metallic, rust blooms
    float rust = smoothstep(0.55, 0.8, wgNoise(vLWPos.xy * 220.0 + vLWPos.z * 130.0 + seed));
    s.albedo = mix(base, vec3(0.32, 0.14, 0.06), rust * 0.7);
    s.metal = mix(0.7, 0.1, rust);
    s.rough = mix(0.42, 0.9, rust);
    s.height = rust;
    s.bump = 0.0006 * detail;
  } else if (kind == 6) {
    // ---- fieldstone (grain = box-normalised coords): rounded edges, speckle, lichen, moss
    vec3 a = abs(g);
    float m1 = max(a.x, max(a.y, a.z));
    float m3 = min(a.x, min(a.y, a.z));
    float mid = a.x + a.y + a.z - m1 - m3;
    float edge = smoothstep(0.55, 1.0, mid);
    float sp = wgNoise3(vLWPos * 160.0 + seed * 7.0);
    float sp2 = wgNoise3(vLWPos * 45.0 + seed * 3.0);
    vec3 col = base * (0.82 + 0.3 * sp2) * (0.9 + 0.2 * sp);
    col = mix(col, col * 1.18 + 0.02, edge * 0.35);                // worn, paler arrises
    vec3 nW = normalize(vLWNrm);
    float lichen = smoothstep(0.68, 0.8, wgNoise3(vLWPos * 70.0 + seed)) * detail;
    col = mix(col, vec3(0.72, 0.7, 0.52), lichen * 0.55);
    float mossK = (0.35 + uHumidity * 0.6) * smoothstep(-0.2, 0.9, nW.y) * (1.0 - smoothstep(2.3, 3.2, uSeason) * 0.6);
    float moss = smoothstep(0.55, 0.75, wgNoise3(vLWPos * 38.0 + 4.0) * 0.7 + mossK * 0.45);
    col = mix(col, vec3(0.16, 0.26, 0.07), moss * 0.75);
    // soot stains near the chimney top
    col *= 1.0 - 0.55 * smoothstep(0.35, 1.0, param) * smoothstep(0.0, 1.0, g.y * 0.5 + 0.5);
    s.albedo = col;
    s.height = -edge * edge * 1.4 + sp * 0.35 + moss * 0.4;
    s.bump = 0.0012 * detail;
    s.rough = mix(0.86, 0.95, moss);
    s.ao = 1.0 - edge * 0.12;
  } else if (kind == 7) {
    // ---- lime chinking / mortar
    float sp = wgNoise3(vLWPos * 190.0);
    vec3 col = base * (0.88 + 0.22 * sp);
    col *= mix(0.78, 1.0, smoothstep(0.0, 0.25, vLWPos.y - CABIN_Y));   // splash dirt low down
    s.albedo = col;
    s.height = sp;
    s.bump = 0.0008 * detail;
    s.rough = 0.95;
    s.ao = 0.72;
  } else if (kind == 8) {
    // ---- cedar shingles: g = (u along ridge, s down-slope, row)
    float row = g.z;
    float tw = 0.032 + 0.014 * lHash(row * 3.7);
    float tx = g.x / tw + lHash(row * 1.31) * 7.0 + row * 0.5;
    float tab = floor(tx);
    float fx = fract(tx);
    float aa = min(fwidth(tx) * 1.2, 0.4);
    float gap = 1.0 - smoothstep(0.0, 0.035 + aa, fx) * smoothstep(1.0, 0.965 - aa, fx);
    float tint = lHash(tab * 3.1 + row * 17.7);
    float stepK = clamp(vRoofStep / 0.0055, 0.0, 1.0);   // 0 at the overlapped top, 1 at the butt
    float grainS = wgNoise(vec2(g.x * 140.0 + tab * 3.0, g.y * 14.0));
    vec3 col = base * (0.8 + 0.36 * tint) * (0.93 + 0.14 * grainS);
    col = mix(col, vec3(lLum(col)) * vec3(0.97, 0.99, 1.03) * 1.18, 0.3 + 0.35 * lHash(tab + row * 5.3));  // silvered tabs
    vec3 nW = normalize(vRoofN);
    float northness = smoothstep(0.3, -0.6, nW.z * 0.8 + nW.x * 0.3);
    float lowRows = smoothstep(0.18, 0.5, g.y);
    float mossK = (0.05 + uHumidity * 0.15 + northness * 0.25) * (1.0 - smoothstep(2.4, 3.3, uSeason) * 0.5);
    float mossN = wgNoise(vLWPos.xz * 9.0 + 2.0) * 0.65 + wgNoise(vLWPos.xz * 31.0) * 0.35;
    float moss = smoothstep(0.62, 0.78, mossN + mossK * 0.5 + lowRows * 0.08 - 0.1) * smoothstep(0.1, 0.5, stepK + 0.3);
    col = mix(col, mix(vec3(0.12, 0.17, 0.06), vec3(0.2, 0.23, 0.09), tint), moss * 0.6);
    col *= 1.0 - gap * 0.55;
    s.ao = mix(0.55, 1.0, smoothstep(0.0, 0.5, stepK)) * (1.0 - gap * 0.3);
    s.albedo = col;
    s.height = stepK * 0.5 + grainS * 0.25 + moss * 0.2;
    s.bump = 0.0006 * detail;
    s.rough = 0.88;
  } else if (kind == 9) {
    // ---- window glass: dark pane by day, warm lived-in interior at night
    vec2 uv = g.xy;
    float id = g.z;
    s.albedo = vec3(0.02, 0.025, 0.03);
    s.rough = 0.06;
    s.snowOK = 0.0;
    float grad = mix(1.15, 0.55, uv.y);
    float hearth = 0.75 + 0.25 * sin(uTime * 7.0 + id * 2.0) * sin(uTime * 3.1 + id) * 0.6 + 0.25 * uLifeFlicker;
    float curtain = mix(0.32, 1.0, smoothstep(0.02, 0.24, uv.x) * smoothstep(0.98, 0.76, uv.x));
    curtain *= mix(0.6, 1.0, smoothstep(0.98, 0.84, uv.y));                       // valance
    float sill = mix(0.55, 1.0, smoothstep(0.0, 0.12, uv.y));
    // a little silhouette inside one window (a pot plant on the table)
    float plant = (id < 0.5) ? (1.0 - smoothstep(0.08, 0.12, length((uv - vec2(0.68, 0.2)) * vec2(1.0, 0.8)))) : 0.0;
    float k = grad * curtain * sill * hearth * (1.0 - plant * 0.7);
    s.emissive = vec3(1.0, 0.55, 0.22) * k * uLifeGlow * 3.2 + vec3(0.02, 0.012, 0.006) * (1.0 - uLifeGlow);
  } else if (kind == 10) {
    // ---- lantern glass
    s.albedo = vec3(0.25, 0.2, 0.12);
    s.rough = 0.2;
    s.snowOK = 0.0;
    float fl = 0.85 + 0.15 * uLifeFlicker;
    s.emissive = vec3(1.0, 0.62, 0.26) * uLifeGlow * 7.5 * fl * mix(0.7, 1.0, g.y);
  } else if (kind == 11) {
    // ---- hemp rope (twisted strands)
    float ang = atan(g.z, g.y);
    float tw = fract(g.x * 260.0 + ang * 0.477);
    float strand = smoothstep(0.0, 0.3, tw) * smoothstep(1.0, 0.7, tw);
    s.albedo = base * (0.65 + 0.45 * strand);
    s.height = strand;
    s.bump = 0.0005 * detail;
    s.rough = 0.95;
  } else if (kind == 12) {
    // ---- flowers / leaves / herbs in the window box & garden
    s.albedo = base * (0.85 + 0.3 * wgNoise3(vLWPos * 300.0 + seed));
    s.rough = 0.6;
  } else {
    // ---- soot / dark interior
    s.albedo = base;
    s.rough = 0.95;
    s.snowOK = 0.0;
  }

  // ---------------------------------------------------------------- weathering
  if (kind != 9 && kind != 10) {
    vec3 nW = normalize(kind == 8 ? vRoofN : vLWNrm);
    vec4 gr = groundAt(vLWPos.xz);
    float expo = vInfo.z;
    float wet = clamp(gr.y * 1.1 + gr.z * 0.9 + uLifeWet, 0.0, 1.0) * expo * smoothstep(-0.8, 0.3, nW.y);
    wet = max(wet, smoothstep(uWaterLevel + 0.03, uWaterLevel - 0.004, vLWPos.y) * 0.9);
    s.albedo *= mix(1.0, 0.56, wet);
    s.rough = mix(s.rough, 0.2, wet * 0.8);
    s.bump *= 1.0 - wet * 0.4;

    float frost = gr.w * expo * smoothstep(-0.3, 0.7, nW.y) * 0.4;
    s.albedo = mix(s.albedo, vec3(0.78, 0.83, 0.9), frost);

    // terrain-style snowCover also coats slopes under deep snow; props only hold it on top faces
    float snow = snowCover(vLWPos.xz, nW) * expo * s.snowOK * smoothstep(0.25, 0.75, nW.y);
    snow *= smoothstep(uWaterLevel + 0.005, uWaterLevel + 0.03, vLWPos.y);
    float sn = wgNoise(vLWPos.xz * 55.0 + vLWPos.y * 9.0);
    snow = smoothstep(0.25, 0.75, snow + (sn - 0.5) * 0.45 * (1.0 - snow * 0.5));
    float lumpH = 0.0;
    if (kind == 8) {
      snow = max(snow, smoothstep(0.002, 0.012, uRoofSnow) * smoothstep(0.2, 0.5, nW.y));
      // soft drifts: the same lumps the vertex shader displaced, shaded through the bump
      lumpH = wgNoise(vLWPos.xz * 23.0) + 0.5 * wgNoise(vLWPos.xz * 61.0 + 3.0);
    }
    vec3 snowCol = vec3(0.9, 0.93, 0.98) * (0.94 + 0.08 * sn);
    s.albedo = mix(s.albedo, snowCol, snow);
    s.rough = mix(s.rough, 0.6, snow);
    s.metal *= 1.0 - snow;
    s.bump *= 1.0 - snow * 0.85;
    s.height = mix(s.height, sn * 0.25 + lumpH * 2.2, snow);
    if (kind == 8) s.bump = mix(s.bump, 0.0035, snow);
    s.ao = mix(s.ao, 1.0, snow * 0.6);
  }
  return s;
}

/** three's perturbNormalArb with a scalar height (view-space pos & normal). */
vec3 lifeBump(vec3 surf_pos, vec3 surf_norm, float h, float scale) {
  vec3 vSigmaX = dFdx(surf_pos);
  vec3 vSigmaY = dFdy(surf_pos);
  vec3 R1 = cross(vSigmaY, surf_norm);
  vec3 R2 = cross(surf_norm, vSigmaX);
  float fDet = dot(vSigmaX, R1);
  vec2 dHdxy = vec2(dFdx(h), dFdy(h)) * scale;
  vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
  return normalize(abs(fDet) * surf_norm - vGrad);
}
`;
function createPropMaterial(r, t, e) {
  const i = new ThreeMeshStandardMaterial({
      color: 16777215,
      roughness: 0.8,
      metalness: 0,
      envMapIntensity: 0.6,
    }),
    s = PROP_FRAGMENT_SURFACE.replace(/CABIN_Y/g, e.toFixed(4));
  return (
    (i.onBeforeCompile = (n) => {
      (Object.assign(n.uniforms, r.uniforms, t),
        (n.vertexShader =
          r.GLSL_COMMON +
          PROP_VERTEX_DECLARATIONS +
          n.vertexShader
            .replace("#include <begin_vertex>", PROP_VERTEX_TRANSFORM)
            .replace(
              "#include <worldpos_vertex>",
              `#include <worldpos_vertex>
` + PROP_WORLD_POSITION,
            )),
        (n.fragmentShader =
          r.GLSL_COMMON +
          s +
          n.fragmentShader
            .replace(
              "#include <map_fragment>",
              `#include <map_fragment>
PropSurf ps = propSurface();
diffuseColor.rgb = ps.albedo;`,
            )
            .replace(
              "#include <roughnessmap_fragment>",
              "float roughnessFactor = ps.rough;",
            )
            .replace(
              "#include <metalnessmap_fragment>",
              "float metalnessFactor = ps.metal;",
            )
            .replace(
              "#include <normal_fragment_maps>",
              `#include <normal_fragment_maps>
if (ps.bump > 0.0) normal = lifeBump(-vViewPosition, normal, ps.height, ps.bump);`,
            )
            .replace(
              "#include <emissivemap_fragment>",
              `#include <emissivemap_fragment>
totalEmissiveRadiance += ps.emissive;`,
            )
            .replace(
              "#include <lights_fragment_end>",
              `#include <lights_fragment_end>
reflectedLight.indirectDiffuse *= ps.ao;
reflectedLight.directDiffuse *= mix(1.0, ps.ao, 0.45);
reflectedLight.indirectSpecular *= ps.ao;`,
            )));
    }),
    (i.customProgramCacheKey = () => "wg-life-props"),
    i
  );
}
export { createPropMaterial };
