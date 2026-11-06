// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeColor,
  ThreeDoubleSide,
  ThreeDynamicDrawUsage,
  ThreeFloat32BufferAttribute,
  ThreeInstancedBufferAttribute,
  ThreeInstancedMesh,
  ThreeMeshStandardMaterial,
  ThreePoints,
  ThreeShaderMaterial,
  ThreeVector2,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { clamp, createSeededRandom, damp, smoothstep } from "../core/math.js";
import { getTreeRegistry } from "../vegetation/tree-registry.js";
import {
  PLANT_SPECIES_CODES,
  isDeciduousSpecies,
  treeBlossomAmount,
} from "../vegetation/tree-species.js";
const leafWindScratch = {
  x: 0,
  z: 0,
};
const LEAF_TYPE_AUTUMN = 0;
const LEAF_TYPE_PETAL = 1;
const LEAF_TYPE_GREEN = 2;
const LEAF_STATE_FLYING = 1;
const ul = 2;
const i1 = 3;
const leafSecondaryWindScratch = {
  x: 0,
  z: 0,
};
const leafColorScratch = new ThreeColor();
const leafSecondaryColorScratch = new ThreeColor();
const AUTUMN_LEAF_COLORS = [
  "#c8461a",
  "#e07b1f",
  "#e9a92b",
  "#b5301c",
  "#8f3a17",
  "#d69a3a",
  "#a8561e",
  "#f0c24a",
].map((r) => new ThreeColor(r));
const BLOSSOM_COLORS = ["#ffd6e4", "#ffc2d6", "#fff0f5", "#f7b3cb"].map(
  (r) => new ThreeColor(r),
);
const PLUM_PETAL_COLORS = ["#e995ae", "#f5b4c7", "#cf6486", "#ffd0dd"].map(
  (color) => new ThreeColor(color),
);
const APPLE_PETAL_COLORS = ["#fff5eb", "#ffe7e4", "#ffeef0", "#f4d6dc"].map(
  (color) => new ThreeColor(color),
);
const APPLE_LEAF_COLORS = ["#cda63e", "#deb95b", "#b58932", "#d2b46a"].map(
  (color) => new ThreeColor(color),
);
const LEAF_VERTEX_DECLARATIONS = `
attribute vec4 iLeaf;   // type, seed, fade, curl
varying vec4 vLeaf;
varying vec2 vLUv;
`;
const LEAF_FRAGMENT_DECLARATIONS = `
varying vec4 vLeaf;
varying vec2 vLUv;
float leafHash(float n) { return fract(sin(n * 78.233) * 43758.5453); }
`;
function createLeafGeometry() {
  const t = [
      [-0.5, 0.12, -0.5],
      [0, 0, -0.5],
      [0.5, 0.12, -0.5],
      [-0.5, 0.12, 0.5],
      [0, 0, 0.5],
      [0.5, 0.12, 0.5],
    ],
    e = [],
    i = [],
    s = [];
  for (const o of t)
    (e.push(...o), i.push(o[0], o[2]), s.push(-o[0] * 0.25, 1, 0));
  const n = new ThreeBufferGeometry();
  return (
    n.setAttribute("position", new ThreeFloat32BufferAttribute(e, 3)),
    n.setAttribute("normal", new ThreeFloat32BufferAttribute(s, 3)),
    n.setAttribute("aLUv", new ThreeFloat32BufferAttribute(i, 2)),
    n.setIndex([0, 1, 4, 0, 4, 3, 1, 2, 5, 1, 5, 4]),
    n.computeBoundingSphere(),
    n
  );
}
function createLeafMaterial(r) {
  const t = new ThreeMeshStandardMaterial({
    color: 16777215,
    roughness: 0.7,
    metalness: 0,
    side: ThreeDoubleSide,
  });
  return (
    (t.onBeforeCompile = (e) => {
      (Object.assign(e.uniforms, r.uniforms),
        (e.vertexShader =
          r.GLSL_COMMON +
          LEAF_VERTEX_DECLARATIONS +
          `attribute vec2 aLUv;
` +
          e.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
        // curl the card a little (dry leaves cup)
        transformed.y += iLeaf.w * (transformed.x * transformed.x + transformed.z * transformed.z * 0.5) * 0.6;
        vLeaf = iLeaf; vLUv = aLUv;`,
          )),
        (e.fragmentShader =
          r.GLSL_COMMON +
          LEAF_FRAGMENT_DECLARATIONS +
          e.fragmentShader
            .replace(
              "#include <map_fragment>",
              `#include <map_fragment>
      {
        vec2 p = vLUv;
        float type = vLeaf.x;
        float seed = vLeaf.y;
        float inside;
        float vein = 0.0;
        if (type > 0.5 && type < 1.5) {
          // petal: rounded with a notch at the tip
          vec2 q = p * vec2(1.6, 1.2);
          float r = length(q - vec2(0.0, -0.05));
          float notch = smoothstep(0.08, 0.0, abs(p.x)) * smoothstep(0.25, 0.42, p.y);
          inside = step(r + notch * 0.4, 0.5);
        } else {
          // leaf: pointed oval, a few lobes for autumn oak/maple feel, a stem
          float a = atan(p.x, p.y);
          float lobes = 1.0 + (type < 0.5 ? 0.13 : 0.04) * cos(a * (5.0 + floor(leafHash(seed) * 3.0)));
          vec2 q = p / vec2(0.36, 0.5);
          float tip = 1.0 + 0.35 * smoothstep(0.0, 0.5, p.y);
          inside = step(length(q * vec2(tip, 1.0)), lobes);
          inside = max(inside, step(abs(p.x), 0.025) * step(p.y, -0.3));   // stem
          vein = (1.0 - smoothstep(0.0, 0.025, abs(p.x))) + (1.0 - smoothstep(0.0, 0.02, abs(abs(p.x) * 1.4 - (p.y + 0.4) * 0.5 + 0.1))) * 0.4 * step(-0.35, p.y);
        }
        // fade: dissolve with a soft dither
        float n = leafHash(dot(floor(gl_FragCoord.xy), vec2(1.0, 113.0)) + seed * 17.0);
        if (inside < 0.5 || n > vLeaf.z) discard;
        vec3 col = diffuseColor.rgb;
        col *= 0.82 + 0.3 * wgNoise(p * 7.0 + seed * 9.0);
        col *= 1.0 - vein * 0.22;
        col = mix(col, col * vec3(0.55, 0.42, 0.3), smoothstep(0.32, 0.5, length(p)) * step(type, 0.5) * 0.6);  // dry brown rims
        diffuseColor.rgb = col;
      }`,
            )
            .replace(
              "#include <lights_fragment_end>",
              `#include <lights_fragment_end>
        // translucency: thin leaves glow when lit from behind
        reflectedLight.directDiffuse += diffuseColor.rgb * uLightColor * 0.16 * max(0.0, -dot(normal, normalize((viewMatrix * vec4(uLightDir, 0.0)).xyz)));`,
            )));
    }),
    (t.customProgramCacheKey = () => "wg-life-leaves"),
    t
  );
}
const LEAF_PUFF_VERTEX_SHADER = `
attribute vec4 aPuff;   // size, alpha, type, seed
uniform float uPointScale;
varying vec3 vCol;
varying float vAlpha;
varying float vSeed;
void main() {
  vec4 mv = viewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.5, aPuff.x * uPointScale / max(0.1, -mv.z));
  float type = aPuff.z;
  vec3 base = type < 0.5 ? vec3(0.95, 0.97, 1.0) : (type < 1.5 ? vec3(1.0, 0.92, 0.55) : vec3(0.75, 0.62, 0.45));
  float sh = cloudShadowAt(position);
  vec3 hemi = mix(uGroundColor, uSkyColor, 0.7) * uAmbientIntensity;
  vCol = base * (uLightColor * 0.75 * sh + hemi) * 0.33 + base * uFlash * 0.2;
  vAlpha = aPuff.y;
  vSeed = aPuff.w;
}
`;
const LEAF_PUFF_FRAGMENT_SHADER = `
varying vec3 vCol;
varying float vAlpha;
varying float vSeed;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float a = (1.0 - smoothstep(0.2, 1.0, r)) * vAlpha;
  gl_FragColor = vec4(vCol * (1.05 - r * 0.25), a);
}
`;
class FallingLeaves {
  constructor(t, e) {
    this.ctx = t;
    const i = t.quality;
    this.rand = createSeededRandom(6262);
    const s = (this.N = i.pick(150, 260, 380));
    ((this.px = new Float32Array(s)),
      (this.py = new Float32Array(s)),
      (this.pz = new Float32Array(s)),
      (this.vx = new Float32Array(s)),
      (this.vy = new Float32Array(s)),
      (this.vz = new Float32Array(s)),
      (this.rx = new Float32Array(s)),
      (this.ry = new Float32Array(s)),
      (this.rz = new Float32Array(s)),
      (this.wx = new Float32Array(s)),
      (this.wy = new Float32Array(s)),
      (this.wz = new Float32Array(s)),
      (this.size = new Float32Array(s)),
      (this.age = new Float32Array(s)),
      (this.life = new Float32Array(s)),
      (this.type = new Uint8Array(s)),
      (this.state = new Uint8Array(s)),
      (this.seed = new Float32Array(s)),
      (this.phase = new Float32Array(s)),
      (this.curl = new Float32Array(s)),
      (this.fade = new Float32Array(s)),
      (this.next = 0),
      (this.iLeaf = new ThreeInstancedBufferAttribute(
        new Float32Array(s * 4),
        4,
      ).setUsage(ThreeDynamicDrawUsage)));
    const n = createLeafGeometry();
    (n.setAttribute("iLeaf", this.iLeaf),
      (this.mesh = new ThreeInstancedMesh(n, createLeafMaterial(t), s)),
      (this.mesh.name = "life-leaves"),
      (this.mesh.frustumCulled = !1),
      this.mesh.instanceMatrix.setUsage(ThreeDynamicDrawUsage),
      this.mesh.setColorAt(0, leafColorScratch.setRGB(1, 1, 1)),
      this.mesh.instanceColor.setUsage(ThreeDynamicDrawUsage),
      (this.mesh.count = 0),
      (this.mesh.receiveShadow = !0),
      e.add(this.mesh),
      (this.colors = new Float32Array(s * 3)));
    const o = (this.NP = i.pick(140, 220, 320));
    ((this.ppos = new Float32Array(o * 3)),
      (this.pv = new Float32Array(o * 3)),
      (this.pdat = new Float32Array(o * 4)),
      (this.page = new Float32Array(o)),
      (this.plife = new Float32Array(o)),
      (this.psize = new Float32Array(o)),
      (this.palpha = new Float32Array(o)),
      (this.pnext = 0));
    const a = new ThreeBufferGeometry();
    ((this.puffPos = new ThreeBufferAttribute(
      new Float32Array(o * 3),
      3,
    ).setUsage(ThreeDynamicDrawUsage)),
      (this.puffDat = new ThreeBufferAttribute(
        new Float32Array(o * 4),
        4,
      ).setUsage(ThreeDynamicDrawUsage)),
      a.setAttribute("position", this.puffPos),
      a.setAttribute("aPuff", this.puffDat),
      a.setDrawRange(0, 0),
      (this.puffU = {
        uPointScale: {
          value: 500,
        },
      }),
      (this.puffs = new ThreePoints(
        a,
        new ThreeShaderMaterial({
          uniforms: {
            ...t.uniforms,
            ...this.puffU,
          },
          vertexShader: t.GLSL_COMMON + LEAF_PUFF_VERTEX_SHADER,
          fragmentShader: LEAF_PUFF_FRAGMENT_SHADER,
          transparent: !0,
          depthWrite: !1,
        }),
      )),
      (this.puffs.name = "life-puffs"),
      (this.puffs.frustumCulled = !1),
      (this.puffs.renderOrder = 6),
      e.add(this.puffs),
      (this._v2 = new ThreeVector2()),
      (this.acc = 0),
      (this.petalAcc = 0),
      (this.gustAcc = 0),
      (this._treeRevision = -1),
      (this.trees = []),
      (this.broad = []),
      (this.blossom = []));
  }
  hide() {
    ((this.mesh.visible = !1), (this.puffs.visible = !1));
  }
  _refreshTrees() {
    const registry = getTreeRegistry(this.ctx);
    if (registry.revision === this._treeRevision) return;
    this._treeRevision = registry.revision;
    this.trees.length = 0;
    this.broad.length = 0;
    this.blossom.length = 0;
    for (const { plant, leafEffect } of registry.entries) {
      // Willows keep their own narrow leaves and catkin particle system.
      if (leafEffect !== "standard") continue;
      this.trees.push(plant);
      if (plant.kind === "broad" || plant.kind === "blossom")
        this.broad.push(plant);
      if (
        plant.code === PLANT_SPECIES_CODES.cherry ||
        plant.code === PLANT_SPECIES_CODES.plum ||
        plant.code === PLANT_SPECIES_CODES.apple
      )
        this.blossom.push(plant);
    }
    this._bloomWeights = new Float32Array(this.blossom.length);
  }
  _blossomAmount(plant, env) {
    return treeBlossomAmount(plant.code, this.ctx.world.season, env.blossom);
  }
  reset(t) {
    if (
      (this.state.fill(0),
      this.page.fill(0),
      this.plife.fill(0),
      (this.mesh.count = 0),
      (this.acc = this.petalAcc = 0),
      this._refreshTrees(),
      t.leafFall > 0.05 ||
        this.blossom.some((plant) => this._blossomAmount(plant, t) > 0.2))
    )
      for (let e = 0; e < 120; e++) this._sim(1 / 15, t, !0);
    this._write();
  }
  _spawnCard(t, e, i, s, n = 0, o = 0, a = 0, species) {
    const l = this.N,
      c = this.rand;
    let h = -1;
    for (let d = 0; d < l; d++) {
      const p = (this.next + d) % l;
      if (!this.state[p]) {
        h = p;
        break;
      }
    }
    (h < 0 && (h = this.next),
      (this.next = (h + 1) % l),
      (this.state[h] = LEAF_STATE_FLYING),
      (this.type[h] = t),
      (this.px[h] = e),
      (this.py[h] = i),
      (this.pz[h] = s),
      (this.vx[h] = n),
      (this.vy[h] = o),
      (this.vz[h] = a),
      (this.rx[h] = c() * 6.28),
      (this.ry[h] = c() * 6.28),
      (this.rz[h] = c() * 6.28));
    const f = t === LEAF_TYPE_PETAL ? 5 : 3.5;
    ((this.wx[h] = (c() - 0.5) * f),
      (this.wy[h] = (c() - 0.5) * f),
      (this.wz[h] = (c() - 0.5) * f),
      (this.size[h] =
        t === LEAF_TYPE_PETAL ? 0.026 + c() * 0.01 : 0.042 + c() * 0.02),
      (this.age[h] = 0),
      (this.life[h] = 7 + c() * 6),
      (this.seed[h] = c() * 10),
      (this.phase[h] = c() * 6.28),
      (this.curl[h] =
        t === LEAF_TYPE_AUTUMN
          ? 0.1 + c() * 0.35
          : t === LEAF_TYPE_PETAL
            ? 0.2
            : 0.05),
      (this.fade[h] = 1));
    const petalColors =
      species === PLANT_SPECIES_CODES.plum
        ? PLUM_PETAL_COLORS
        : species === PLANT_SPECIES_CODES.apple
          ? APPLE_PETAL_COLORS
          : BLOSSOM_COLORS;
    const leafColors =
      species === PLANT_SPECIES_CODES.apple
        ? APPLE_LEAF_COLORS
        : AUTUMN_LEAF_COLORS;
    if (t === LEAF_TYPE_PETAL && species === PLANT_SPECIES_CODES.plum)
      this.size[h] *= 0.75;
    let u;
    return (
      t === LEAF_TYPE_PETAL
        ? (u = petalColors[Math.floor(c() * petalColors.length)])
        : t === LEAF_TYPE_GREEN
          ? (u = leafSecondaryColorScratch
              .copy(this.ctx.world.seasonal.foliage)
              .lerp(this.ctx.world.seasonal.foliage2, c()))
          : ((u = leafSecondaryColorScratch.copy(
              leafColors[Math.floor(c() * leafColors.length)],
            )),
            u.lerp(this.ctx.world.seasonal.foliage, 0.25 * c())),
      leafColorScratch.copy(u).multiplyScalar(0.85 + c() * 0.25),
      (this.colors[h * 3] = leafColorScratch.r),
      (this.colors[h * 3 + 1] = leafColorScratch.g),
      (this.colors[h * 3 + 2] = leafColorScratch.b),
      h
    );
  }
  _spawnFromTree(t, e, i, s = 0) {
    const n = this.rand;
    for (let o = 0; o < i; o++) {
      const a = n() * Math.PI * 2,
        l = Math.sqrt(n()) * t.radius * 0.85,
        fraction = 0.45 + n() * 0.45,
        bendX = t.bendX || 0,
        bendZ = t.bendZ || 0,
        c =
          t.y +
          t.height * fraction -
          ((bendX * bendX + bendZ * bendZ) / t.height) * 0.55 * fraction ** 3;
      this._spawnCard(
        e,
        t.x + Math.cos(a) * l + bendX * fraction ** 2,
        c,
        t.z + Math.sin(a) * l + bendZ * fraction ** 2,
        Math.cos(a) * s * (0.3 + n() * 0.5),
        s * n() * 0.4,
        Math.sin(a) * s * (0.3 + n() * 0.5),
        t.code,
      );
    }
  }
  _spawnPuff(t, e, i, s, n, o, a, l, c, h = 0.7) {
    const f = this.NP,
      u = this.pnext;
    ((this.pnext = (u + 1) % f),
      (this.ppos[u * 3] = e),
      (this.ppos[u * 3 + 1] = i),
      (this.ppos[u * 3 + 2] = s),
      (this.pv[u * 3] = n),
      (this.pv[u * 3 + 1] = o),
      (this.pv[u * 3 + 2] = a),
      (this.page[u] = 0),
      (this.plife[u] = c),
      (this.psize[u] = l),
      (this.palpha[u] = h),
      (this.pdat[u * 4 + 2] = t),
      (this.pdat[u * 4 + 3] = this.rand()));
  }
  shake(t, e) {
    if (!t) return;
    this._refreshTrees();
    const i = this.rand,
      s = clamp(t.strength ?? 0.6, 0, 1.5),
      n = {
        x: t.x,
        y: (t.y ?? 1) - 0.5,
        z: t.z,
        height: 1,
        radius: 0.45,
        code: t.code,
        bendX: t.bendX || 0,
        bendZ: t.bendZ || 0,
      };
    // Mouse interactions carry the actual tree dimensions, including trees
    // outside the original biome. Older callers can still use the core lookup.
    if (
      Number.isFinite(t.rootY) &&
      Number.isFinite(t.height) &&
      t.height > 0 &&
      Number.isFinite(t.radius) &&
      t.radius > 0
    ) {
      n.y = t.rootY;
      n.height = t.height;
      n.radius = t.radius;
    } else if (Array.isArray(this.trees)) {
      let a = null,
        l = 0.6;
      for (const c of this.trees) {
        const h = Math.hypot(c.x - t.x, c.z - t.z);
        h < l && ((l = h), (a = c));
      }
      a &&
        ((n.x = a.x),
        (n.y = a.y),
        (n.z = a.z),
        (n.height = a.height),
        (n.radius = a.radius),
        (n.code = a.code));
    }
    const o =
      (this.ctx.fields.snowAt?.(n.x, n.z) ?? 0) > 0.08 || e.winter > 0.6;
    if ((o && t.kind !== "bush") || (o && i() < 0.5)) {
      const a = Math.round(14 + s * 26);
      for (let l = 0; l < a; l++) {
        const c = i() * Math.PI * 2,
          h = Math.sqrt(i()) * n.radius * 0.9;
        this._spawnPuff(
          0,
          n.x + Math.cos(c) * h,
          n.y + n.height * (0.4 + i() * 0.55),
          n.z + Math.sin(c) * h,
          Math.cos(c) * (0.1 + i() * 0.3) * s,
          -0.05 + i() * 0.2,
          Math.sin(c) * (0.1 + i() * 0.3) * s,
          0.025 + i() * 0.035,
          1.4 + i() * 1.2,
          0.75,
        );
      }
    }
    const blossom = this._blossomAmount(n, e);
    if (blossom > 0.05) {
      this._spawnFromTree(
        n,
        LEAF_TYPE_PETAL,
        Math.round((8 + s * 18) * blossom),
        0.4 * s,
      );
    } else if (isDeciduousSpecies(n.code)) {
      if (e.leafFall > 0.02 || e.autumn > 0.5) {
        this._spawnFromTree(
          n,
          LEAF_TYPE_AUTUMN,
          Math.round((6 + s * 14) * (0.4 + e.leafFall)),
          0.4 * s,
        );
      } else if (
        !o &&
        e.winter < 0.5 &&
        this.ctx.world.seasonal.leafAmount > 0.25
      ) {
        this._spawnFromTree(n, LEAF_TYPE_GREEN, Math.round(1 + s * 3), 0.3 * s);
      }
    }
  }
  stroke(t, e) {
    if (!t) return;
    const i = this.rand,
      s = clamp(t.strength ?? 0.5, 0, 1),
      n = Math.hypot(t.vx || 0, t.vz || 0) || 1,
      o = (t.vx || 0) / n,
      a = (t.vz || 0) / n,
      l = 0.55 * 0.55;
    for (let u = 0; u < this.N; u++) {
      if (this.state[u] !== ul) continue;
      const d = this.px[u] - t.x,
        p = this.pz[u] - t.z;
      d * d + p * p > l ||
        ((this.state[u] = LEAF_STATE_FLYING),
        (this.vx[u] = o * (0.6 + i()) * (0.5 + s)),
        (this.vz[u] = a * (0.6 + i()) * (0.5 + s)),
        (this.vy[u] = 0.4 + i() * 0.6 * (0.5 + s)),
        (this.wx[u] = (i() - 0.5) * 8),
        (this.wz[u] = (i() - 0.5) * 8),
        (this.age[u] = Math.min(this.age[u], this.life[u] * 0.4)));
    }
    const c = this.ctx.terrain.height(t.x, t.z),
      h = this.ctx.fields.snowAt?.(t.x, t.z) ?? 0,
      f = Math.round((1 + s * 3) * (h > 0.1 ? 2 : 1));
    for (let u = 0; u < f; u++) {
      const d = (i() - 0.5) * 0.5,
        p = (i() - 0.5) * 0.5,
        v = this.ctx.terrain.height(t.x + d, t.z + p);
      h > 0.1
        ? this._spawnPuff(
            0,
            t.x + d,
            v + 0.02,
            t.z + p,
            o * (0.5 + i()) * (0.4 + s),
            0.15 + i() * 0.35,
            a * (0.5 + i()) * (0.4 + s),
            0.02 + i() * 0.03,
            1 + i() * 0.8,
            0.65,
          )
        : e.summer + e.spring > 0.4 &&
          e.flowers > 0.3 &&
          i() < 0.6 &&
          this._spawnPuff(
            1,
            t.x + d,
            v + 0.05 + i() * 0.2,
            t.z + p,
            o * (0.4 + i()) * (0.4 + s),
            0.1 + i() * 0.2,
            a * (0.4 + i()) * (0.4 + s),
            0.008 + i() * 0.008,
            2 + i() * 1.5,
            0.8,
          );
    }
    e.autumn > 0.4 &&
      e.leafFall > 0.05 &&
      i() < 0.5 + s * 0.4 &&
      this._spawnCard(
        LEAF_TYPE_AUTUMN,
        t.x + (i() - 0.5) * 0.4,
        c + 0.03,
        t.z + (i() - 0.5) * 0.4,
        o * (0.6 + i()) * (0.5 + s),
        0.5 + i() * 0.5,
        a * (0.6 + i()) * (0.5 + s),
      );
  }
  _sim(t, e, i = !1) {
    if (t <= 0) return;
    this._refreshTrees();
    const s = this.rand,
      n = this.ctx.wind,
      o = this.ctx.terrain,
      a = e.level,
      l = smoothstep(0.35, 0.75, e.ice),
      c = 1 + smoothstep(1, 3, e.wind) * 3;
    if (this.broad.length && e.leafFall > 0.01)
      for (
        this.acc += t * e.leafFall * this.broad.length * 0.8 * c;
        this.acc >= 1;
      )
        ((this.acc -= 1),
          this._spawnFromTree(
            this.broad[Math.floor(s() * this.broad.length)],
            LEAF_TYPE_AUTUMN,
            1,
            0,
          ));
    let totalBloom = 0;
    for (let index = 0; index < this.blossom.length; index++) {
      const bloom = this._blossomAmount(this.blossom[index], e);
      this._bloomWeights[index] = bloom > 0.15 ? bloom : 0;
      totalBloom += this._bloomWeights[index];
    }
    this.petalAcc += t * totalBloom * 0.9 * c;
    while (totalBloom > 0 && this.petalAcc >= 1) {
      this.petalAcc--;
      let pick = s() * totalBloom;
      for (let index = 0; index < this.blossom.length; index++) {
        pick -= this._bloomWeights[index];
        if (pick >= 0) continue;
        this._spawnFromTree(this.blossom[index], LEAF_TYPE_PETAL, 1);
        break;
      }
    }
    const h = this.N,
      f = LANDSCAPE_BOUNDS.halfW - 0.05,
      u = LANDSCAPE_BOUNDS.halfD - 0.05;
    for (let p = 0; p < h; p++) {
      const v = this.state[p];
      if (!v) continue;
      this.age[p] += t;
      const g = this.life[p] - this.age[p];
      if (g <= 0) {
        this.state[p] = 0;
        continue;
      }
      this.fade[p] = clamp(g / 1.6, 0, 1) * clamp(this.age[p] / 0.25, 0, 1);
      const x = this.type[p] === LEAF_TYPE_PETAL;
      if (v === LEAF_STATE_FLYING) {
        const m = o.height(this.px[p], this.pz[p]),
          w = clamp((this.py[p] - m) * 0.3, 0, 0.6);
        (n.sample(this.px[p], this.pz[p], leafSecondaryWindScratch, w),
          (this.phase[p] += t * (x ? 4.5 : 3.2)));
        const y = Math.sin(this.phase[p]),
          _ = x ? -0.16 : -0.24,
          M = x ? 2.6 : 2;
        ((this.vx[p] +=
          (leafSecondaryWindScratch.x * 0.9 +
            Math.cos(this.seed[p]) * y * 0.22 -
            this.vx[p]) *
          M *
          t),
          (this.vz[p] +=
            (leafSecondaryWindScratch.z * 0.9 +
              Math.sin(this.seed[p]) * y * 0.22 -
              this.vz[p]) *
            M *
            t),
          (this.vy[p] += (_ + Math.abs(y) * 0.08 - this.vy[p]) * 2.2 * t));
        const A = n.turbulenceAt(this.px[p], this.pz[p]);
        ((this.vy[p] += A * (s() - 0.35) * 2 * t),
          (this.px[p] += this.vx[p] * t),
          (this.py[p] += this.vy[p] * t),
          (this.pz[p] += this.vz[p] * t),
          (this.rx[p] += this.wx[p] * t * (1 + Math.abs(y))),
          (this.ry[p] += this.wy[p] * t),
          (this.rz[p] += this.wz[p] * t),
          this.px[p] > f
            ? ((this.px[p] = f), (this.vx[p] *= -0.3))
            : this.px[p] < -f && ((this.px[p] = -f), (this.vx[p] *= -0.3)),
          this.pz[p] > u
            ? ((this.pz[p] = u), (this.vz[p] *= -0.3))
            : this.pz[p] < -u && ((this.pz[p] = -u), (this.vz[p] *= -0.3)),
          this.py[p] > LANDSCAPE_BOUNDS.topY - 0.3 &&
            ((this.py[p] = LANDSCAPE_BOUNDS.topY - 0.3), (this.vy[p] = -0.1)));
        const b = o.height(this.px[p], this.pz[p]),
          S = b < a - 0.004 && o.lakeMask(this.px[p], this.pz[p]) > 0.3,
          E = S ? a + (l > 0.5 ? 0.004 : 0.002) : b + 0.003;
        if (
          this.py[p] <= E &&
          ((this.py[p] = E),
          (this.state[p] = S && l < 0.5 ? i1 : ul),
          (this.vy[p] = 0),
          (this.rx[p] = (s() - 0.5) * 0.3),
          (this.rz[p] = (s() - 0.5) * 0.3),
          (this.life[p] = this.age[p] + (S ? 5 + s() * 5 : 4 + s() * 6)),
          S && !i)
        ) {
          const T = this.ctx.modules.water?.ripples;
          T?.add && s() < 0.5 && T.add(this.px[p], this.pz[p], 0.02, -0.4);
        }
      } else if (v === ul) {
        n.sample(this.px[p], this.pz[p], leafSecondaryWindScratch, 0);
        const m = Math.hypot(
          leafSecondaryWindScratch.x,
          leafSecondaryWindScratch.z,
        );
        m > 2.2 &&
          s() < (m - 2.2) * t * 1.5 &&
          ((this.state[p] = LEAF_STATE_FLYING),
          (this.vx[p] = leafSecondaryWindScratch.x * 0.6),
          (this.vz[p] = leafSecondaryWindScratch.z * 0.6),
          (this.vy[p] = 0.3 + s() * 0.5),
          (this.wx[p] = (s() - 0.5) * 8),
          (this.wz[p] = (s() - 0.5) * 8));
      } else if (v === i1) {
        (n.sample(this.px[p], this.pz[p], leafSecondaryWindScratch, 0),
          (this.vx[p] = damp(
            this.vx[p],
            leafSecondaryWindScratch.x * 0.12,
            1.5,
            t,
          )),
          (this.vz[p] = damp(
            this.vz[p],
            leafSecondaryWindScratch.z * 0.12,
            1.5,
            t,
          )),
          (this.px[p] += this.vx[p] * t),
          (this.pz[p] += this.vz[p] * t),
          (this.ry[p] += this.vx[p] * t * 3),
          (this.py[p] =
            a + 0.002 + Math.sin(this.age[p] * 2.2 + this.seed[p]) * 0.0015));
        const m = o.height(this.px[p], this.pz[p]);
        (m > a - 0.002 && ((this.state[p] = ul), (this.py[p] = m + 0.003)),
          l > 0.5 && (this.state[p] = ul));
      }
    }
    const d = this.NP;
    for (let p = 0; p < d; p++) {
      if (this.page[p] >= this.plife[p]) continue;
      this.page[p] += t;
      const v = p * 3;
      (n.sample(this.ppos[v], this.ppos[v + 2], leafSecondaryWindScratch, 0.2),
        (this.pv[v] +=
          (leafSecondaryWindScratch.x * 0.8 - this.pv[v]) * 1.5 * t),
        (this.pv[v + 2] +=
          (leafSecondaryWindScratch.z * 0.8 - this.pv[v + 2]) * 1.5 * t));
      const g = this.pdat[p * 4 + 2];
      ((this.pv[v + 1] +=
        ((g < 0.5 ? -0.12 : -0.02) - this.pv[v + 1]) * 1.2 * t),
        (this.ppos[v] += this.pv[v] * t),
        (this.ppos[v + 1] += this.pv[v + 1] * t),
        (this.ppos[v + 2] += this.pv[v + 2] * t));
      const x = o.height(this.ppos[v], this.ppos[v + 2]);
      this.ppos[v + 1] < x + 0.01 &&
        ((this.ppos[v + 1] = x + 0.01),
        (this.pv[v + 1] = 0),
        (this.page[p] += t * 2));
    }
  }
  _write() {
    const t = this.N,
      e = this.mesh.instanceMatrix.array,
      i = this.mesh.instanceColor.array,
      s = this.iLeaf.array;
    let n = 0;
    for (let c = 0; c < t; c++) {
      if (!this.state[c]) continue;
      const h = this.size[c] * (0.4 + 0.6 * Math.min(1, this.fade[c] * 1.5)),
        f = this.rx[c],
        u = this.ry[c],
        d = this.rz[c],
        p = Math.cos(f),
        v = Math.sin(f),
        g = Math.cos(u),
        x = Math.sin(u),
        m = Math.cos(d),
        w = Math.sin(d),
        y = n * 16;
      ((e[y] = g * m * h),
        (e[y + 1] = g * w * h),
        (e[y + 2] = -x * h),
        (e[y + 3] = 0),
        (e[y + 4] = (v * x * m - p * w) * h),
        (e[y + 5] = (v * x * w + p * m) * h),
        (e[y + 6] = v * g * h),
        (e[y + 7] = 0),
        (e[y + 8] = (p * x * m + v * w) * h),
        (e[y + 9] = (p * x * w - v * m) * h),
        (e[y + 10] = p * g * h),
        (e[y + 11] = 0),
        (e[y + 12] = this.px[c]),
        (e[y + 13] = this.py[c]),
        (e[y + 14] = this.pz[c]),
        (e[y + 15] = 1),
        (i[n * 3] = this.colors[c * 3]),
        (i[n * 3 + 1] = this.colors[c * 3 + 1]),
        (i[n * 3 + 2] = this.colors[c * 3 + 2]),
        (s[n * 4] = this.type[c]),
        (s[n * 4 + 1] = this.seed[c]),
        (s[n * 4 + 2] = this.fade[c]),
        (s[n * 4 + 3] = this.curl[c]),
        n++);
    }
    ((this.mesh.count = n),
      n &&
        ((this.mesh.instanceMatrix.needsUpdate = !0),
        (this.mesh.instanceColor.needsUpdate = !0),
        (this.iLeaf.needsUpdate = !0)),
      (this.mesh.visible = n > 0));
    const o = this.puffPos.array,
      a = this.puffDat.array;
    let l = 0;
    for (let c = 0; c < this.NP; c++) {
      if (this.page[c] >= this.plife[c]) continue;
      const h = this.page[c] / this.plife[c];
      ((o[l * 3] = this.ppos[c * 3]),
        (o[l * 3 + 1] = this.ppos[c * 3 + 1]),
        (o[l * 3 + 2] = this.ppos[c * 3 + 2]),
        (a[l * 4] = this.psize[c] * (0.6 + h * 0.9)),
        (a[l * 4 + 1] =
          this.palpha[c] * smoothstep(0, 0.1, h) * (1 - h) * (1 - h)),
        (a[l * 4 + 2] = this.pdat[c * 4 + 2]),
        (a[l * 4 + 3] = this.pdat[c * 4 + 3]),
        l++);
    }
    (this.puffs.geometry.setDrawRange(0, l),
      (this.puffs.visible = l > 0),
      l && ((this.puffPos.needsUpdate = !0), (this.puffDat.needsUpdate = !0)));
  }
  syncPhotoCamera() {
    this.ctx.renderer.getDrawingBufferSize(this._v2);
    this.puffU.uPointScale.value =
      this._v2.y / (2 * Math.tan((this.ctx.camera.fov * Math.PI) / 360));
  }
  update(t, e, i) {
    this._sim(t, i);
    const s = this.ctx;
    (s.renderer.getDrawingBufferSize(this._v2),
      (this.puffU.uPointScale.value =
        this._v2.y / (2 * Math.tan((s.camera.fov * Math.PI) / 360))),
      this._write());
  }
}
export { FallingLeaves, leafWindScratch };
