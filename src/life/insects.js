// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAdditiveBlending,
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeDoubleSide,
  ThreeDynamicDrawUsage,
  ThreeEuler,
  ThreeFloat32BufferAttribute,
  ThreeInstancedBufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeMeshDepthMaterial,
  ThreeMeshStandardMaterial,
  ThreePoints,
  ThreeQuaternion,
  ThreeRGBADepthPacking,
  ThreeShaderMaterial,
  ThreeSphere,
  ThreeVector2,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import {
  LANDSCAPE_BOUNDS,
  TERRARIUM_BOUNDS,
  WATER_LEVEL_CONFIG,
} from "../core/config.js";
import { clamp, createSeededRandom, damp, smoothstep } from "../core/math.js";
import {
  lakeEllipse,
  terrainHeight,
  terrainSuitability,
  waterDistance,
} from "../simulation/terrain-shape.js";
import { leafWindScratch } from "./leaves.js";
import {
  BUTTERFLY_FLIGHT_MARGIN,
  createButterflyHabitat,
} from "./butterfly-habitat.js";
import {
  FIREFLY_DRIFT_RADIUS,
  createExtendedFireflies,
} from "./firefly-habitat.js";
const insectMatrixScratch = new ThreeMatrix4();
const insectQuaternionScratch = new ThreeQuaternion();
const insectEulerScratch = new ThreeEuler(0, 0, 0, "YXZ");
const insectPositionScratch = new ThreeVector3();
const insectScaleScratch = new ThreeVector3();
const insectVectorScratch = new ThreeVector2();
const INSECT_VERTEX_DECLARATIONS = `
attribute vec3 aBug;   // part (0 body, -1 left wing, +1 right wing), u, v
attribute vec4 iBug;   // type (0 butterfly, 1 dragonfly), flap angle, species, visibility
varying vec3 vBug;
varying vec4 vBugI;
`;
const INSECT_WING_TRANSFORM = `
{
  float part = aBug.x;
  float dragon = iBug.x;
  if (abs(part) > 0.5) {
    // wing hinge along the body axis; angle from the instance (both wings mirror)
    float a = iBug.y * part;
    float ca = cos(a), sa = sin(a);
    vec3 p = transformed;
    p.x *= mix(1.0, 1.25, dragon);
    p.z *= mix(1.0, 0.85, dragon);
    transformed = vec3(p.x * ca - p.y * sa, p.x * sa + p.y * ca, p.z);
  } else {
    // body: longer, thinner abdomen for dragonflies
    if (transformed.z < 0.0) transformed.z *= mix(1.0, 3.4, dragon);
    transformed.xy *= mix(1.0, 0.8, dragon);
  }
  transformed *= iBug.w;
}
`;
const INSECT_FRAGMENT_DECLARATIONS = `
varying vec3 vBug;
varying vec4 vBugI;
float bugHash(float n) { return fract(sin(n * 91.345) * 47453.21); }
`;
function createInsectGeometry() {
  const r = [],
    t = [],
    e = [],
    i = [],
    s = (d, p, v, g, x, m, w, y, _) => (
      r.push(d, p, v),
      t.push(g, x, m),
      e.push(w, y, _),
      r.length / 3 - 1
    ),
    c = [
      [-0.0016, -0.0016],
      [0.0016, -0.0016],
      [0.0016, 0.0016],
      [-0.0016, 0.0016],
    ];
  for (let d = 0; d < 4; d++) {
    const [p, v] = c[d],
      [g, x] = c[(d + 1) % 4],
      m = (p + g) / 2,
      w = (v + x) / 2,
      y = Math.hypot(m, w),
      _ = s(p, v, -0.011, m / y, w / y, 0, 0, 0, 0),
      M = s(g, x, -0.011, m / y, w / y, 0, 0, 0, 0),
      A = s(g, x, 0.009, m / y, w / y, 0, 0, 0, 1),
      b = s(p, v, 0.009, m / y, w / y, 0, 0, 0, 1);
    i.push(_, M, A, _, A, b);
  }
  const h = s(0, 0, 0.009 + 0.003, 0, 0, 1, 0, 0, 1),
    f = [
      s(-0.0016, -0.0016, 0.009, 0, 0, 1, 0, 0, 1),
      s(0.0016, -0.0016, 0.009, 0, 0, 1, 0, 0, 1),
      s(0.0016, 0.0016, 0.009, 0, 0, 1, 0, 0, 1),
      s(-0.0016, 0.0016, 0.009, 0, 0, 1, 0, 0, 1),
    ];
  for (let d = 0; d < 4; d++) i.push(f[d], f[(d + 1) % 4], h);
  for (const d of [-1, 1]) {
    const p = d * 0.0012,
      v = d * 0.021,
      g = s(p, 5e-4, -0.013, 0, 1, 0, d, 0, 0),
      x = s(v, 5e-4, -0.013, 0, 1, 0, d, 1, 0),
      m = s(v, 5e-4, 0.013, 0, 1, 0, d, 1, 1),
      w = s(p, 5e-4, 0.013, 0, 1, 0, d, 0, 1);
    d > 0 ? i.push(g, m, x, g, w, m) : i.push(g, x, m, g, m, w);
  }
  const u = new ThreeBufferGeometry();
  return (
    u.setAttribute("position", new ThreeFloat32BufferAttribute(r, 3)),
    u.setAttribute("normal", new ThreeFloat32BufferAttribute(t, 3)),
    u.setAttribute("aBug", new ThreeFloat32BufferAttribute(e, 3)),
    u.setIndex(i),
    u.computeBoundingSphere(),
    (u.boundingSphere.radius = 0.06),
    u
  );
}
function createInsectMaterial(r) {
  const t = new ThreeMeshStandardMaterial({
    color: 16777215,
    roughness: 0.55,
    metalness: 0,
    side: ThreeDoubleSide,
  });
  return (
    (t.onBeforeCompile = (e) => {
      (Object.assign(e.uniforms, r.uniforms),
        (e.vertexShader =
          r.GLSL_COMMON +
          INSECT_VERTEX_DECLARATIONS +
          e.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
` +
              INSECT_WING_TRANSFORM +
              `
vBug = aBug; vBugI = iBug;`,
          )),
        (e.fragmentShader =
          r.GLSL_COMMON +
          INSECT_FRAGMENT_DECLARATIONS +
          e.fragmentShader
            .replace(
              "#include <map_fragment>",
              `#include <map_fragment>
      {
        float part = vBug.x;
        float dragon = vBugI.x;
        float sp = vBugI.z;
        vec3 col;
        float rough = 0.6;
        if (abs(part) < 0.5) {
          col = mix(vec3(0.05, 0.04, 0.035), mix(vec3(0.05, 0.25, 0.42), vec3(0.08, 0.36, 0.2), step(0.5, sp)), dragon);
          rough = mix(0.6, 0.25, dragon);
        } else {
          vec2 uv = vBug.yz;    // u: 0 hinge … 1 tip, v: 0 back … 1 front
          if (dragon < 0.5) {
            // forewing (front) + hindwing (back) lobes
            vec2 f = (uv - vec2(0.42, 0.64)) / vec2(0.62, 0.36);
            f.y += f.x * 0.35;
            vec2 hh = (uv - vec2(0.3, 0.3)) / vec2(0.42, 0.32);
            float fore = length(f), hind = length(hh);
            float m = min(fore, hind);
            if (m > 1.0) discard;
            float edge = smoothstep(0.72, 0.98, m);
            int s = int(sp * 4.0);
            if (s == 0) {          // cabbage white: dark tips & a spot
              col = vec3(0.92, 0.91, 0.84);
              col = mix(col, vec3(0.12, 0.12, 0.12), smoothstep(0.7, 0.9, fore) * step(0.55, uv.x) * step(fore, hind));
              col = mix(col, vec3(0.15), 1.0 - smoothstep(0.06, 0.09, length(uv - vec2(0.55, 0.6))));
            } else if (s == 1) {   // brimstone
              col = mix(vec3(0.95, 0.85, 0.25), vec3(0.85, 0.9, 0.45), uv.x * 0.4);
              col = mix(col, vec3(0.9, 0.5, 0.15), 1.0 - smoothstep(0.03, 0.06, length(uv - vec2(0.45, 0.55))));
            } else if (s == 2) {   // small tortoiseshell / peacock: orange, dark borders, eye spots
              col = vec3(0.86, 0.36, 0.08);
              col = mix(col, vec3(0.08, 0.05, 0.04), edge);
              float eye = length(uv - vec2(0.62, 0.7));
              col = mix(col, vec3(0.1, 0.2, 0.6), 1.0 - smoothstep(0.07, 0.1, eye));
              col = mix(col, vec3(0.95, 0.9, 0.7), 1.0 - smoothstep(0.03, 0.05, eye));
            } else {               // common blue
              col = mix(vec3(0.3, 0.45, 0.95), vec3(0.55, 0.7, 1.0), uv.x * 0.6);
              col = mix(col, vec3(0.95), edge * 0.8);
            }
            col *= 0.85 + 0.25 * smoothstep(0.0, 0.5, uv.x);
            rough = 0.75;
          } else {
            // dragonfly: two long glassy wings per side, dark pterostigma
            float fore = abs(uv.y - 0.7) / (0.11 * (1.0 - uv.x * 0.25));
            float hind = abs(uv.y - 0.38) / (0.14 * (1.0 - uv.x * 0.3));
            float m = min(fore, hind);
            if (m > 1.0 || uv.x > 0.98) discard;
            // glassy: dithered coverage
            float n = bugHash(dot(floor(gl_FragCoord.xy), vec2(1.0, 57.0)) + sp * 13.0);
            if (n > 0.55 + 0.4 * smoothstep(0.8, 1.0, m)) discard;
            col = mix(vec3(0.75, 0.82, 0.9), vec3(0.85, 0.75, 0.95), uv.x);
            col = mix(col, vec3(0.08), (1.0 - smoothstep(0.03, 0.05, abs(uv.x - 0.86))) * step(m, 0.8));
            rough = 0.15;
          }
        }
        diffuseColor.rgb = col;
        vBugRough = rough;
      }`,
            )
            .replace(
              "#include <common>",
              `#include <common>
float vBugRough = 0.6;`,
            )
            .replace(
              "#include <roughnessmap_fragment>",
              "float roughnessFactor = vBugRough;",
            )
            .replace(
              "#include <lights_fragment_end>",
              `#include <lights_fragment_end>
        // thin wings glow when the sun shines through them
        if (abs(vBug.x) > 0.5) reflectedLight.directDiffuse += diffuseColor.rgb * uLightColor * 0.12 * max(0.0, -dot(normal, normalize((viewMatrix * vec4(uLightDir, 0.0)).xyz)));`,
            )));
    }),
    (t.customProgramCacheKey = () => "wg-life-bugs"),
    t
  );
}
const INSECT_GLOW_VERTEX_SHADER = `
attribute vec4 aHome;   // x, y (offset above ground / water), z, kind (0 meadow firefly, 1 lake firefly, 2 mote)
attribute vec4 aSeed;   // phases, period, size
attribute float aLandscape;
uniform float uFireflies;
uniform float uMotes;
uniform float uPointScale;
uniform float uDark;     // lightning: fireflies go dark
uniform vec2 uInsectHalfSize;
varying vec3 vCol;
varying float vCore;
void main() {
  float t = uTime;
  vec3 p = aHome.xyz;
  float kind = aHome.w;
  float s1 = aSeed.x * 6.2832, s2 = aSeed.y * 6.2832;
  float intensity;
  vec3 col;
  float size;
  if (kind < 1.5) {
    if (kind > 0.5) p.y += uWaterLevel;
    p.x += sin(t * (0.21 + aSeed.y * 0.2) + s1) * 0.2 + sin(t * 0.73 + s2) * 0.05;
    p.z += cos(t * (0.17 + aSeed.x * 0.2) + s2) * 0.2 + sin(t * 0.61 + s1) * 0.05;
    p.y += sin(t * 0.5 + s1 * 1.3) * 0.06 + sin(t * 1.7 + s2) * 0.012;
    p.xz += windAt(p.xz) * 0.12;
    if (aLandscape > 0.5) {
      vec2 drift = p.xz - aHome.xz;
      drift *= min(1.0, ${FIREFLY_DRIFT_RADIUS.toFixed(2)} / max(length(drift), 1e-5));
      p.xz = clamp(aHome.xz + drift, -uInsectHalfSize + 0.04, uInsectHalfSize - 0.04);
      p.y = max(p.y, max(groundHeightAt(p.xz), uWaterLevel) + 0.055);
    }
    float period = 2.6 + aSeed.z * 3.2;
    float ph = fract(t / period + aSeed.x * 7.0);
    float flash = smoothstep(0.0, 0.05, ph) * (1.0 - smoothstep(0.06, 0.3, ph));
    flash += 0.5 * smoothstep(0.34, 0.37, ph) * (1.0 - smoothstep(0.38, 0.5, ph)) * step(0.5, aSeed.w);
    intensity = (0.07 + flash * 1.25) * uFireflies * (1.0 - uDark);
    if (aLandscape > 0.5) intensity *= 1.0 - smoothstep(0.03, 0.15, groundAt(p.xz).x);
    col = mix(vec3(0.62, 1.0, 0.18), vec3(1.0, 0.85, 0.25), aSeed.y * 0.35);
    size = 0.1 * (0.7 + aSeed.w * 0.6) * (0.55 + 0.6 * flash);
    vCore = 1.0;
  } else {
    // dust / pollen mote in the sunlight
    p.x += sin(t * 0.07 + s1) * 0.35 + sin(t * 0.31 + s2) * 0.05;
    p.z += cos(t * 0.06 + s2) * 0.3;
    p.y += sin(t * 0.09 + s1 * 2.0) * 0.2 + fract(t * 0.01 + aSeed.z) * 0.0;
    p.xz += windAt(p.xz) * 0.25;
    vec3 V = normalize(p - cameraPosition);
    vec3 L = normalize(uLightDir);
    float fwd = pow(max(dot(V, L), 0.0), 5.0);
    float tw = 0.5 + 0.5 * sin(t * (2.0 + aSeed.w * 3.0) + s2);
    intensity = uMotes * cloudShadowAt(p) * (0.12 + fwd * 1.6) * (0.35 + 0.65 * tw * tw);
    col = uLightColor * 0.5 + vec3(0.04);
    size = 0.02 + aSeed.w * 0.012;
    vCore = 0.0;
  }
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float px = size * uPointScale / max(0.1, -mv.z);
  gl_PointSize = max(px, kind < 1.5 ? 2.5 : 1.5);
  // keep the energy of tiny points
  intensity *= min(1.0, px / max(gl_PointSize, 1e-3) * 1.5 + 0.35);
  if (intensity < 0.003) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  vCol = col * intensity;
}
`;
const INSECT_GLOW_FRAGMENT_SHADER = `
varying vec3 vCol;
varying float vCore;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d, d) * 4.0;
  if (r2 > 1.0) discard;
  float core = exp(-r2 * 26.0);
  float halo = exp(-r2 * 4.5) * (1.0 - r2);
  float k = mix(halo * 1.2 + core * 0.2, core * 7.0 + halo * 1.1, vCore);
  gl_FragColor = vec4(vCol * k, 1.0);
}
`;
let InsectSystem = class {
  constructor(t, e, i) {
    ((this.ctx = t), (this.life = i));
    const s = t.quality,
      n = (this.rand = createSeededRandom(8181));
    const originalButterflies = s.pick(5, 8, 11);
    ((this.NB = s.pick(8, 12, 16)), (this.ND = s.pick(2, 3, 4)));
    const o = (this.N = this.NB + this.ND);
    this.flowerSpots = [];
    for (let g = 0; g < 400 && this.flowerSpots.length < 40; g++) {
      const x = (n() - 0.5) * 2 * (TERRARIUM_BOUNDS.halfW - 0.5),
        m = (n() - 0.5) * 2 * (TERRARIUM_BOUNDS.halfD - 0.5);
      terrainSuitability(x, m, "flower") > 0.5 &&
        this.flowerSpots.push({
          x,
          z: m,
        });
    }
    (this.flowerSpots.length ||
      this.flowerSpots.push(
        {
          x: -1,
          z: 1.5,
        },
        {
          x: 1,
          z: 0.5,
        },
      ),
      (this.lakeSpots = []));
    for (let g = 0; g < 600 && this.lakeSpots.length < 30; g++) {
      const x = 2.75 + (n() - 0.5) * 4.4,
        m = 2.65 + (n() - 0.5) * 3.2,
        w = lakeEllipse(x, m);
      w > 0.55 &&
        w < 0.98 &&
        Math.abs(m) < TERRARIUM_BOUNDS.halfD - 0.25 &&
        Math.abs(x) < TERRARIUM_BOUNDS.halfW - 0.25 &&
        this.lakeSpots.push({
          x,
          z: m,
        });
    }
    this.lakeSpots.length ||
      this.lakeSpots.push({
        x: 2.5,
        z: 2.5,
      });
    const a = createInsectGeometry();
    ((this.iBug = new ThreeInstancedBufferAttribute(
      new Float32Array(o * 4),
      4,
    ).setUsage(ThreeDynamicDrawUsage)),
      a.setAttribute("iBug", this.iBug),
      (this.mesh = new ThreeInstancedMesh(a, createInsectMaterial(t), o)),
      (this.mesh.name = "life-insects"),
      (this.mesh.frustumCulled = !1),
      (this.mesh.castShadow = !0),
      this.mesh.instanceMatrix.setUsage(ThreeDynamicDrawUsage));
    const l = new ThreeMeshDepthMaterial({
      depthPacking: ThreeRGBADepthPacking,
      side: ThreeDoubleSide,
    });
    ((l.onBeforeCompile = (g) => {
      g.vertexShader =
        INSECT_VERTEX_DECLARATIONS +
        g.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
` + INSECT_WING_TRANSFORM,
        );
    }),
      (l.customProgramCacheKey = () => "wg-life-bugs-depth"),
      (this.mesh.customDepthMaterial = l),
      e.add(this.mesh),
      (this.px = new Float32Array(o)),
      (this.py = new Float32Array(o)),
      (this.pz = new Float32Array(o)),
      (this.vx = new Float32Array(o)),
      (this.vy = new Float32Array(o)),
      (this.vz = new Float32Array(o)),
      (this.hx = new Float32Array(o)),
      (this.hz = new Float32Array(o)),
      (this.yaw = new Float32Array(o)),
      (this.phase = new Float32Array(o)),
      (this.flapA = new Float32Array(o)),
      (this.vis = new Float32Array(o)),
      (this.mode = new Uint8Array(o)),
      (this.timer = new Float32Array(o)),
      (this.species = new Float32Array(o)),
      (this.scare = new Float32Array(o)));
    // 保留原初始化抽样次数，避免增加蝴蝶时重新打乱萤火虫与花粉。
    for (let index = 0; index < originalButterflies + this.ND; index++) {
      const g =
        index < originalButterflies
          ? index
          : index + this.NB - originalButterflies;
      const x = g >= this.NB;
      ((this.species[g] = x ? n() : Math.floor(n() * 4) / 4 + 0.01),
        this._home(g),
        (this.px[g] = this.hx[g]),
        (this.pz[g] = this.hz[g]),
        (this.py[g] = this._ground(g) + 0.2),
        (this.phase[g] = n() * 6.28),
        (this.timer[g] = n() * 4));
    }
    const c = s.pick(80, 150, 220),
      h = s.pick(40, 80, 120),
      extensionCount = s.pick(96, 160, 240),
      f = new Float32Array((c + h + extensionCount) * 4),
      u = new Float32Array((c + h + extensionCount) * 4);
    let d = 0,
      p = 0;
    for (; d < c && p++ < 2e4;) {
      const g = (n() - 0.5) * 2 * (TERRARIUM_BOUNDS.halfW - 0.4),
        x = (n() - 0.5) * 2 * (TERRARIUM_BOUNDS.halfD - 0.35),
        m = terrainHeight(g, x),
        w = lakeEllipse(g, x);
      if (w < 1 && m < WATER_LEVEL_CONFIG.lakeLevel - 0.02) {
        if (w < 0.6 || n() > 0.5) continue;
        f.set([g, 0.04 + n() * 0.28, x, 1], d * 4);
      } else {
        const _ = terrainSuitability(g, x, "grass"),
          M = smoothstep(0.9, 0.1, waterDistance(g, x));
        if (m > 1.4 || n() > _ * 0.7 + M * 0.6) continue;
        f.set([g, m + 0.05 + n() * n() * 0.55, x, 0], d * 4);
      }
      (u.set([n(), n(), n(), n()], d * 4), d++);
    }
    const coreFireflies = d;
    for (p = 0; d < c + h && p++ < 2e4;) {
      const g = (n() - 0.5) * 2 * (TERRARIUM_BOUNDS.halfW - 0.5),
        x = (n() - 0.5) * 2 * (TERRARIUM_BOUNDS.halfD - 0.4),
        m = Math.max(terrainHeight(g, x), WATER_LEVEL_CONFIG.lakeLevel);
      m > 2 ||
        (f.set([g, m + 0.15 + n() * 1.6, x, 2], d * 4),
        u.set([n(), n(), n(), n()], d * 4),
        d++);
    }
    const coreGlowCount = d;
    const extension = createExtendedFireflies(t, extensionCount);
    f.set(extension.homes, d * 4);
    u.set(extension.seeds, d * 4);
    d += extension.count;
    const landscape = new Float32Array(d);
    landscape.fill(1, coreGlowCount);
    this.glowCounts = {
      coreFireflies,
      coreMotes: coreGlowCount - coreFireflies,
      extendedFireflies: extension.count,
      habitatCells: extension.habitatCells,
      total: d,
    };
    const v = new ThreeBufferGeometry();
    (v.setAttribute(
      "position",
      new ThreeBufferAttribute(new Float32Array(d * 3), 3),
    ),
      v.setAttribute(
        "aHome",
        new ThreeBufferAttribute(f.subarray(0, d * 4), 4),
      ),
      v.setAttribute(
        "aSeed",
        new ThreeBufferAttribute(u.subarray(0, d * 4), 4),
      ),
      v.setAttribute("aLandscape", new ThreeBufferAttribute(landscape, 1)),
      (v.boundingSphere = new ThreeSphere(
        new ThreeVector3(0, 1, 0),
        Math.hypot(LANDSCAPE_BOUNDS.halfW, LANDSCAPE_BOUNDS.halfD, 3),
      )),
      (this.glowU = {
        uFireflies: {
          value: 0,
        },
        uMotes: {
          value: 0,
        },
        uPointScale: {
          value: 500,
        },
        uDark: {
          value: 0,
        },
        uInsectHalfSize: {
          value: new ThreeVector2(
            LANDSCAPE_BOUNDS.halfW,
            LANDSCAPE_BOUNDS.halfD,
          ),
        },
      }),
      (this.glowMat = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
          ...this.glowU,
        },
        vertexShader: t.GLSL_COMMON + INSECT_GLOW_VERTEX_SHADER,
        fragmentShader: INSECT_GLOW_FRAGMENT_SHADER,
        transparent: !0,
        depthWrite: !1,
        blending: ThreeAdditiveBlending,
      })),
      (this.points = new ThreePoints(v, this.glowMat)),
      (this.points.name = "life-glow"),
      (this.points.renderOrder = 4),
      (this.points.frustumCulled = !1),
      e.add(this.points),
      (this.fire = 0),
      (this.motes = 0),
      (this.butter = 0),
      (this.dark = 0));
    this.butterflyRandom = createSeededRandom(818182);
    this.butterflyHabitat = createButterflyHabitat(t);
    this.flowerSpots = this.butterflyHabitat.spots;
    this.butterflyRegions = Array.from({ length: 5 }, () => []);
    this.butterflyBlockedTime = new Float32Array(this.NB);
    for (const cell of this.butterflyHabitat.cells) {
      const region =
        cell.z < -TERRARIUM_BOUNDS.halfD
          ? 3
          : cell.x < -TERRARIUM_BOUNDS.halfW
            ? 1
            : cell.x > TERRARIUM_BOUNDS.halfW
              ? 2
              : cell.z > TERRARIUM_BOUNDS.halfD
                ? 4
                : 0;
      this.butterflyRegions[region].push(cell);
    }
    for (let index = 0; index < this.NB; index++) {
      this._home(index);
      this.px[index] = this.hx[index];
      this.pz[index] = this.hz[index];
      this.py[index] =
        this._ground(index) +
        this.butterflyHabitat.flowerHeightAt(this.px[index], this.pz[index]) +
        0.2;
      this.phase[index] = this.butterflyRandom() * Math.PI * 2;
      this.timer[index] = this.butterflyRandom() * 4;
      this.species[index] = Math.floor(this.butterflyRandom() * 4) / 4 + 0.01;
    }
  }
  hide() {
    ((this.mesh.visible = !1), (this.points.visible = !1));
  }
  _ground(t) {
    return Math.max(
      this.ctx.terrain.height(this.px[t], this.pz[t]),
      this.life.env.level,
    );
  }
  _home(t, nearby = false) {
    const e = this.rand;
    if (t >= this.NB) {
      const i = this.lakeSpots[Math.floor(e() * this.lakeSpots.length)];
      ((this.hx[t] = i.x), (this.hz[t] = i.z));
    } else if (this.butterflyHabitat) {
      const cells = this.butterflyRegions[t % this.butterflyRegions.length];
      const candidates = cells.length ? cells : this.butterflyHabitat.cells;
      if (!candidates.length) return;
      const random = this.butterflyRandom;
      let cell = candidates[Math.floor(random() * candidates.length)];
      if (nearby) {
        let nearest = Infinity;
        for (const candidate of candidates) {
          const distance = Math.hypot(
            candidate.x - this.px[t],
            candidate.z - this.pz[t],
          );
          if (distance < nearest) {
            nearest = distance;
            cell = candidate;
          }
        }
      }
      const spot = cell.spots[Math.floor(random() * cell.spots.length)];
      this.hx[t] = spot.x;
      this.hz[t] = spot.z;
    } else {
      const i = this.flowerSpots[Math.floor(e() * this.flowerSpots.length)];
      ((this.hx[t] = i.x + (e() - 0.5) * 0.4),
        (this.hz[t] = i.z + (e() - 0.5) * 0.4));
    }
  }
  reset(t) {
    ((this.butter = t.butterflies),
      (this.fire = t.fireflies),
      (this.motes = t.motes));
    for (let e = 0; e < this.N; e++)
      (this._home(e),
        (this.px[e] = this.hx[e]),
        (this.pz[e] = this.hz[e]),
        (this.py[e] = this._ground(e) + 0.15),
        (this.vis[e] = (e >= this.NB, t.butterflies)),
        (this.mode[e] = 0));
    this.butterflyBlockedTime.fill(0);
    this.vx.fill(0, 0, this.NB);
    this.vy.fill(0, 0, this.NB);
    this.vz.fill(0, 0, this.NB);
  }
  disturb(t, e, i = 1) {
    if (t === void 0) {
      for (let s = 0; s < this.N; s++)
        this.scare[s] = Math.max(this.scare[s], 1.2 * i);
      return;
    }
    for (let s = 0; s < this.N; s++) {
      const n = Math.hypot(this.px[s] - t, this.pz[s] - e);
      n < 1.4 &&
        ((this.scare[s] = Math.max(this.scare[s], (1 - n / 1.4) * 1.5 * i)),
        this.mode[s] === 1 &&
          s < this.NB &&
          ((this.mode[s] = 0), (this.vy[s] = 0.4)));
    }
  }
  flash() {
    this.dark = 1;
  }
  syncPhotoCamera() {
    this.ctx.renderer.getDrawingBufferSize(insectVectorScratch);
    this.glowU.uPointScale.value =
      insectVectorScratch.y /
      (2 * Math.tan((this.ctx.camera.fov * Math.PI) / 360));
  }
  update(t, e, i) {
    const s = this.ctx;
    ((this.butter =
      t > 0 ? damp(this.butter, i.butterflies, 0.5, t) : i.butterflies),
      (this.fire = t > 0 ? damp(this.fire, i.fireflies, 0.35, t) : i.fireflies),
      (this.motes = t > 0 ? damp(this.motes, i.motes, 0.4, t) : i.motes),
      (this.dark = Math.max(0, this.dark - t * 0.35)),
      (this.glowU.uFireflies.value = this.fire),
      (this.glowU.uMotes.value = this.motes),
      (this.glowU.uDark.value = smoothstep(0, 0.6, this.dark)),
      s.renderer.getDrawingBufferSize(insectVectorScratch),
      (this.glowU.uPointScale.value =
        insectVectorScratch.y / (2 * Math.tan((s.camera.fov * Math.PI) / 360))),
      (this.points.visible = this.fire > 0.003 || this.motes > 0.003));
    const n = this.N,
      o = this.NB,
      a =
        i.butterflies *
        (1 - smoothstep(0.3, 0.6, i.ice)) *
        Math.max(i.summer, i.spring * 0.4);
    let l = !1;
    for (let c = 0; c < n; c++) {
      const h = c >= o,
        u =
          (h || this.flowerSpots.length > 0) &&
          (h ? a : this.butter) > ((c * 0.37) % 1) * 0.6 + 0.05
            ? 1
            : 0;
      if (
        ((this.vis[c] = t > 0 ? damp(this.vis[c], u, 1.5, t) : u),
        this.vis[c] < 0.01)
      ) {
        this.vis[c] = 0;
        continue;
      }
      ((l = !0),
        t > 0 && (h ? this._dragon(c, t, e, i) : this._butterfly(c, t, e, i)),
        (this.scare[c] = Math.max(0, this.scare[c] - t)));
    }
    ((this.mesh.visible = l), l && this._write());
  }
  _butterfly(t, e, i, s) {
    const n = this.butterflyRandom,
      o = this._ground(t);
    if (this.mode[t] === 1) {
      ((this.timer[t] -= e),
        (this.flapA[t] = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(i * 1.3 + t))),
        (this.py[t] = damp(this.py[t], o + 0.035, 6, e)),
        (this.timer[t] <= 0 || this.scare[t] > 0.2) &&
          ((this.mode[t] = 0),
          (this.timer[t] = 4 + n() * 6),
          (this.vy[t] = 0.25)));
      return;
    }
    if (((this.timer[t] -= e), this.timer[t] <= 0)) {
      if (n() < 0.45) {
        ((this.mode[t] = 1), (this.timer[t] = 2 + n() * 4));
        return;
      }
      (n() < 0.3 && this._home(t), (this.timer[t] = 3 + n() * 5));
    }
    const a = this.hx[t] - this.px[t],
      l = this.hz[t] - this.pz[t],
      c = Math.hypot(a, l) || 1,
      h = Math.sin(i * 2.3 + t * 4.1) + Math.sin(i * 5.1 + t) * 0.5,
      f = Math.cos(i * 2.1 + t * 2.7) + Math.sin(i * 4.3 + t * 3) * 0.5,
      u = this.scare[t],
      d = 0.28 + u * 0.6;
    let p = (a / c) * Math.min(1, c) * 0.6 + h * 0.5,
      v = (l / c) * Math.min(1, c) * 0.6 + f * 0.5;
    const g = Math.hypot(p, v) || 1;
    ((p = (p / g) * d), (v = (v / g) * d));
    const x = this.ctx.wind.sample(this.px[t], this.pz[t], leafWindScratch);
    ((p += x.x * 0.35),
      (v += x.z * 0.35),
      (this.vx[t] = damp(this.vx[t], p, 3, e)),
      (this.vz[t] = damp(this.vz[t], v, 3, e)),
      (this.phase[t] += e * (10 + u * 6)));
    // 外围高花丛也按实际植株高度留出飞行空间。
    const flowerHeight = this.butterflyHabitat.flowerHeightAt(
      this.px[t],
      this.pz[t],
    );
    const m =
      o +
      Math.max(0.16, flowerHeight + 0.12) +
      0.1 * Math.sin(i * 0.7 + t) +
      u * 0.4;
    ((this.vy[t] = damp(
      this.vy[t],
      (m - this.py[t]) * 2.5 + Math.sin(this.phase[t]) * 0.25,
      6,
      e,
    )),
      (this.py[t] += this.vy[t] * e),
      this._moveButterfly(t, e),
      (this.py[t] = Math.max(this.py[t], this._ground(t) + 0.03)),
      (this.flapA[t] = 0.15 + 1.05 * (0.5 + 0.5 * Math.sin(this.phase[t]))),
      Math.hypot(this.vx[t], this.vz[t]) > 0.02 &&
        (this.yaw[t] = Math.atan2(this.vx[t], this.vz[t])));
  }
  _moveButterfly(index, dt) {
    const x = this.px[index],
      z = this.pz[index];
    // 先转换到位置缓冲区的精度，避免写入后舍入到障碍网格另一侧。
    const nextX = Math.fround(
      clamp(
        x + this.vx[index] * dt,
        -LANDSCAPE_BOUNDS.halfW + BUTTERFLY_FLIGHT_MARGIN,
        LANDSCAPE_BOUNDS.halfW - BUTTERFLY_FLIGHT_MARGIN,
      ),
    );
    const nextZ = Math.fround(
      clamp(
        z + this.vz[index] * dt,
        -LANDSCAPE_BOUNDS.halfD + BUTTERFLY_FLIGHT_MARGIN,
        LANDSCAPE_BOUNDS.halfD - BUTTERFLY_FLIGHT_MARGIN,
      ),
    );
    // 沿移动段检查，阵风也不能让蝴蝶跳过窄水面或建筑障碍。
    const canTravel = (endX, endZ) => {
      const steps = Math.max(
        1,
        Math.ceil(Math.hypot(endX - x, endZ - z) / 0.08),
      );
      for (let step = 1; step <= steps; step++)
        if (
          !this.butterflyHabitat.isClear(
            x + ((endX - x) * step) / steps,
            z + ((endZ - z) * step) / steps,
          )
        )
          return false;
      return true;
    };
    if (canTravel(nextX, nextZ)) {
      this.px[index] = nextX;
      this.pz[index] = nextZ;
      this.butterflyBlockedTime[index] = 0;
      return;
    }
    if (canTravel(nextX, z)) this.px[index] = nextX;
    else this.vx[index] *= -0.35;
    if (canTravel(this.px[index], nextZ)) this.pz[index] = nextZ;
    else this.vz[index] *= -0.35;
    this.butterflyBlockedTime[index] += dt;
    if (this.butterflyBlockedTime[index] > 0.4) {
      this._home(index, true);
      this.butterflyBlockedTime[index] = 0;
    }
  }
  _dragon(t, e, i, s) {
    const n = this.rand,
      o = s.level;
    if (((this.timer[t] -= e), this.mode[t] === 1)) {
      if (
        ((this.vx[t] = damp(this.vx[t], Math.sin(i * 3 + t) * 0.03, 5, e)),
        (this.vz[t] = damp(this.vz[t], Math.cos(i * 2.6 + t) * 0.03, 5, e)),
        this.timer[t] <= 0 || this.scare[t] > 0.3)
      ) {
        ((this.mode[t] = 0), (this.timer[t] = 0.5 + n() * 0.7), this._home(t));
        const c = n() * Math.PI * 2;
        n() < 0.5 &&
          ((this.hx[t] = this.px[t] + Math.cos(c) * 0.6),
          (this.hz[t] = this.pz[t] + Math.sin(c) * 0.5));
      }
    } else {
      const c = this.hx[t] - this.px[t],
        h = this.hz[t] - this.pz[t],
        f = Math.hypot(c, h) || 1,
        u = Math.min(1.4, f * 3);
      ((this.vx[t] = damp(this.vx[t], (c / f) * u, 6, e)),
        (this.vz[t] = damp(this.vz[t], (h / f) * u, 6, e)),
        (f < 0.05 || this.timer[t] < -2) &&
          ((this.mode[t] = 1), (this.timer[t] = 1 + n() * 2.5)));
    }
    const a = o + 0.09 + 0.06 * Math.sin(i * 0.5 + t * 2) + this.scare[t] * 0.3;
    if (
      ((this.vy[t] = damp(this.vy[t], (a - this.py[t]) * 3, 6, e)),
      (this.px[t] += this.vx[t] * e),
      (this.py[t] += this.vy[t] * e),
      (this.pz[t] += this.vz[t] * e),
      (this.px[t] = clamp(
        this.px[t],
        -TERRARIUM_BOUNDS.halfW + 0.2,
        TERRARIUM_BOUNDS.halfW - 0.2,
      )),
      (this.pz[t] = clamp(
        this.pz[t],
        -TERRARIUM_BOUNDS.halfD + 0.2,
        TERRARIUM_BOUNDS.halfD - 0.2,
      )),
      (this.phase[t] += e * 60),
      (this.flapA[t] = 0.12 + 0.18 * Math.sin(this.phase[t])),
      Math.hypot(this.vx[t], this.vz[t]) > 0.08)
    ) {
      let h = Math.atan2(this.vx[t], this.vz[t]) - this.yaw[t];
      ((h = Math.atan2(Math.sin(h), Math.cos(h))),
        (this.yaw[t] += h * Math.min(1, e * 12)));
    }
  }
  _write() {
    const t = this.iBug.array;
    for (let e = 0; e < this.N; e++) {
      const i = e >= this.NB,
        s = this.vis[e];
      (insectEulerScratch.set(i ? 0 : -0.25, this.yaw[e], 0, "YXZ"),
        insectQuaternionScratch.setFromEuler(insectEulerScratch),
        insectPositionScratch.set(this.px[e], this.py[e], this.pz[e]),
        insectScaleScratch.setScalar(i ? 1.3 : 1.4),
        insectMatrixScratch.compose(
          insectPositionScratch,
          insectQuaternionScratch,
          insectScaleScratch,
        ),
        this.mesh.setMatrixAt(e, insectMatrixScratch),
        (t[e * 4] = i ? 1 : 0),
        (t[e * 4 + 1] = this.flapA[e]),
        (t[e * 4 + 2] = this.species[e]),
        (t[e * 4 + 3] = s));
    }
    ((this.mesh.instanceMatrix.needsUpdate = !0), (this.iBug.needsUpdate = !0));
  }
};
export { InsectSystem };
