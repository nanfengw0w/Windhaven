// Reconstructed module: identifiers and file boundaries are refactor choices.
import { TERRARIUM_BOUNDS } from "../core/config.js";
import {
  clamp,
  createSeededRandom,
  createSimplexNoise,
  lerp,
  smoothstep,
} from "../core/math.js";
import {
  CABIN_PLACEMENT,
  RIVER_CONTROL_POINTS,
  lakeEllipse,
  terrainHeight,
  terrainNormal,
  terrainSuitability,
  waterDistance,
} from "../simulation/terrain-shape.js";
import { TERRAIN_FOOTPATHS } from "../terrain/footpaths-and-masks.js";
import { PLANT_SPECIES_CODES, isShrubSpecies } from "./tree-species.js";
const vegetationPlacementNoise = createSimplexNoise(5151);
const PLANT_KIND_BY_SPECIES = [
  "pine",
  "broad",
  "broad",
  "blossom",
  "bush",
  "bush",
  "blossom",
  "broad",
];
class BiomeDensityGrid {
  constructor(
    t,
    e = 0.1,
    bounds = TERRARIUM_BOUNDS,
    sample = terrainSuitability,
  ) {
    this.bounds = bounds;
    ((this.nx = Math.ceil((bounds.halfW * 2) / e) + 1),
      (this.nz = Math.ceil((bounds.halfD * 2) / e) + 1),
      (this.res = e),
      (this.v = new Float32Array(this.nx * this.nz)));
    for (let i = 0; i < this.nz; i++)
      for (let s = 0; s < this.nx; s++)
        this.v[i * this.nx + s] = sample(
          -bounds.halfW + s * e,
          -bounds.halfD + i * e,
          t,
        );
  }
  at(t, e) {
    const i = clamp((t + this.bounds.halfW) / this.res, 0, this.nx - 1.001),
      s = clamp((e + this.bounds.halfD) / this.res, 0, this.nz - 1.001),
      n = Math.floor(i),
      o = Math.floor(s),
      a = i - n,
      l = s - o,
      c = this.v,
      h = this.nx;
    return (
      (c[o * h + n] * (1 - a) + c[o * h + n + 1] * a) * (1 - l) +
      (c[(o + 1) * h + n] * (1 - a) + c[(o + 1) * h + n + 1] * a) * l
    );
  }
}
function distanceToFootpathEdge(r, t) {
  let e = 1 / 0;
  for (const i of TERRAIN_FOOTPATHS) {
    const s = i.pts;
    for (let n = 0; n < s.length - 1; n++) {
      const o = s[n],
        a = s[n + 1],
        l = a.x - o.x,
        c = a.z - o.z;
      let h = ((r - o.x) * l + (t - o.z) * c) / (l * l + c * c || 1e-9);
      h = h < 0 ? 0 : h > 1 ? 1 : h;
      const f = Math.hypot(o.x + l * h - r, o.z + c * h - t) - i.width * 0.5;
      f < e && (e = f);
    }
  }
  return e;
}
function isVegetationViewCorridor(r, t, e) {
  if (lakeEllipse(r, t) < 1.55 || (t > 2.2 && r > 0.6) || (e && t > 3.05))
    return !0;
  const i = r + 1.45,
    s = t + 1.45;
  return s > -0.2 && Math.abs(i * 0.93 - s * 0.37) < 0.55;
}
function distanceToWaterfallSegment(r, t) {
  const e = RIVER_CONTROL_POINTS[1],
    i = RIVER_CONTROL_POINTS[2],
    s = i.x - e.x,
    n = i.z - e.z;
  let o = ((r - e.x) * s + (t - e.z) * n) / (s * s + n * n);
  return ((o = clamp(o, 0, 1)), Math.hypot(e.x + s * o - r, e.z + n * o - t));
}
const BROADLEAF_GROVES = [
  {
    x: -4.9,
    z: 1.9,
    r: 0.95,
    birch: 0.8,
  },
  {
    x: -3.7,
    z: -0.45,
    r: 0.9,
    birch: 0.25,
  },
  {
    x: 4.75,
    z: 0.1,
    r: 1,
    birch: 0.45,
  },
  {
    x: -1.9,
    z: 2.95,
    r: 0.55,
    birch: 0.7,
  },
  {
    x: 1.7,
    z: -0.55,
    r: 0.5,
    birch: 0.3,
  },
];
function placeTreesAndShrubs(r, t) {
  const e = createSeededRandom(90210),
    i = (w, y) => w + (y - w) * e(),
    s = Array.isArray(t?.rocks) ? t.rocks : [],
    n = [],
    o = {
      x: 0,
      y: 1,
      z: 0,
    },
    a = (w, y, _) =>
      Math.abs(w) < TERRARIUM_BOUNDS.halfW - _ * 0.8 - 0.12 &&
      Math.abs(y) < TERRARIUM_BOUNDS.halfD - _ * 0.8 - 0.12,
    l = (w, y, _) => {
      for (const M of s) if (Math.hypot(M.x - w, M.z - y) < M.r + _) return !1;
      return !0;
    },
    c = (w, y, _, M) => {
      for (const A of n)
        if (Math.hypot(A.x - w, A.z - y) < (A.radius + _) * M) return !1;
      return !0;
    },
    h = (w, y, _, M, A) =>
      !(
        !a(w, y, M) ||
        Math.hypot(w - CABIN_PLACEMENT.x, y - CABIN_PLACEMENT.z) <
          CABIN_PLACEMENT.padRadius + M * 0.6 + 0.2 ||
        distanceToFootpathEdge(w, y) < _ + (isShrubSpecies(A) ? 0.06 : 0.14) ||
        waterDistance(w, y) < (isShrubSpecies(A) ? 0.1 : 0.22) ||
        distanceToWaterfallSegment(w, y) < 0.7 ||
        !l(w, y, _ + 0.06)
      ),
    f = (w, y, _, M, A) => {
      terrainNormal(w, y, o);
      const b = 1 - o.y,
        S = terrainHeight(w, y) - 0.02 - b * A * 0.25,
        E = {
          x: w,
          y: S,
          z: y,
          height: M,
          radius: A,
          kind: PLANT_KIND_BY_SPECIES[_],
          code: _,
          seed: Math.floor(e() * 1e9),
          lean: i(0, Math.PI * 2),
          canopyY: S + M * (_ === PLANT_SPECIES_CODES.pine ? 0.5 : 0.65),
        };
      return (n.push(E), E);
    },
    u = (w, y, _, M, A, b = 0.45) => {
      let S = null,
        E = -1;
      for (let T = 0; T < 48; T++) {
        const R = T * 2.399,
          z = b * Math.sqrt(T / 48),
          L = w + Math.cos(R) * z,
          k = y + Math.sin(R) * z;
        if (!h(L, k, A * 0.12, A, _) || !c(L, k, A, 0.8)) continue;
        const U = terrainSuitability(L, k, "tree") + 0.2 - z * 0.4;
        U > E && ((E = U), (S = [L, k]));
      }
      return S ? f(S[0], S[1], _, M, A) : null;
    };
  (u(-3.95, 0.25, PLANT_SPECIES_CODES.oak, 1.3, 0.64, 0.5),
    u(-3.75, 2.4, PLANT_SPECIES_CODES.cherry, 0.8, 0.47, 0.35),
    u(3.3, 0.35, PLANT_SPECIES_CODES.cherry, 0.74, 0.44, 0.45),
    u(-4.95, 1.5, PLANT_SPECIES_CODES.birch, 1.2, 0.3, 0.4));
  const d = new BiomeDensityGrid("pine", 0.15);
  let p = 0;
  const v = n.length + r.pine;
  for (; n.length < v && p++ < 12e3;) {
    const w = i(-TERRARIUM_BOUNDS.halfW + 0.3, TERRARIUM_BOUNDS.halfW - 0.3),
      y = i(-TERRARIUM_BOUNDS.halfD + 0.3, 0.4),
      _ = d.at(w, y);
    if (_ < 0.05) continue;
    const M = terrainHeight(w, y),
      A = smoothstep(
        0.02,
        0.32,
        vegetationPlacementNoise.noise2(w * 0.5 + 3.1, y * 0.7 - 1.4),
      ),
      b = smoothstep(2.7, 1.3, M);
    if (
      e() > _ * A * (0.25 + 0.75 * b) * 1.4 ||
      isVegetationViewCorridor(w, y, !0)
    )
      continue;
    const S = i(0.72, 1.28) * lerp(1.1, 0.7, smoothstep(0.9, 2.6, M)),
      E = S * i(0.26, 0.33);
    !h(w, y, 0.04, E, PLANT_SPECIES_CODES.pine) ||
      !c(w, y, E, 0.9) ||
      f(w, y, PLANT_SPECIES_CODES.pine, S, E);
  }
  const g = new BiomeDensityGrid("tree", 0.15);
  p = 0;
  const x = n.length + r.broad;
  for (; n.length < x && p++ < 12e3;) {
    const w = i(-TERRARIUM_BOUNDS.halfW + 0.3, TERRARIUM_BOUNDS.halfW - 0.3),
      y = i(-TERRARIUM_BOUNDS.halfD + 0.3, TERRARIUM_BOUNDS.halfD - 0.3);
    if (isVegetationViewCorridor(w, y, !0)) continue;
    const _ = g.at(w, y);
    if (_ < 0.05) continue;
    let M = 0,
      A = 0.5;
    for (const T of BROADLEAF_GROVES) {
      const R = Math.exp(-((w - T.x) ** 2 + (y - T.z) ** 2) / (T.r * T.r));
      R > M && ((M = R), (A = T.birch));
    }
    if (e() > _ * (0.04 + M)) continue;
    const b = e() < A ? PLANT_SPECIES_CODES.birch : PLANT_SPECIES_CODES.oak,
      S = b === PLANT_SPECIES_CODES.birch ? i(0.85, 1.2) : i(0.78, 1.12),
      E =
        b === PLANT_SPECIES_CODES.birch ? S * i(0.23, 0.29) : S * i(0.42, 0.52);
    !h(w, y, 0.05, E, b) || !c(w, y, E, 0.85) || f(w, y, b, S, E);
  }
  p = 0;
  const m = n.length + r.bush;
  for (; n.length < m && p++ < 12e3;) {
    const w = i(-TERRARIUM_BOUNDS.halfW + 0.2, TERRARIUM_BOUNDS.halfW - 0.2),
      y = i(-TERRARIUM_BOUNDS.halfD + 0.2, TERRARIUM_BOUNDS.halfD - 0.2),
      _ = waterDistance(w, y),
      M = terrainHeight(w, y);
    let A = terrainSuitability(w, y, "grass") * 0.12,
      b = 0;
    for (const L of n) {
      if (isShrubSpecies(L.code)) continue;
      const k = Math.hypot(L.x - w, L.z - y) - L.radius;
      k > -0.05 && k < 0.45 && (b = Math.max(b, 1 - Math.abs(k - 0.1) / 0.45));
    }
    for (const L of s) {
      if (L.r < 0.15) continue;
      const k = Math.hypot(L.x - w, L.z - y) - L.r;
      k > 0 && k < 0.3 && (b = Math.max(b, 1 - k / 0.3));
    }
    const S = smoothstep(0.1, 0.2, _) * smoothstep(0.55, 0.3, _);
    if (((A += b * 0.7 + S * 0.45), M > 2.4 && (A *= 0.15), e() > A)) continue;
    const T =
        e() < 0.35 || M > 1.3
          ? PLANT_SPECIES_CODES.evergreen
          : PLANT_SPECIES_CODES.bush,
      R = i(0.14, 0.3),
      z = R * i(0.8, 1.15);
    (isVegetationViewCorridor(w, y, !1) &&
      (R > 0.22 || lakeEllipse(w, y) < 1.25)) ||
      !h(w, y, 0.03, z, T) ||
      !c(w, y, z, 0.9) ||
      f(w, y, T, R, z);
  }
  // Give established grove positions new character only after all sampling.
  // Keeping their roots, seeds and clearance envelopes preserves nearby paths,
  // groundcover and rocks, while the smaller crowns leave room around the cabin.
  for (const variety of [
    {
      x: -3.95,
      z: 0.25,
      code: PLANT_SPECIES_CODES.apple,
      height: 1.02,
      radius: 0.48,
    },
    {
      x: -4.75,
      z: -0.85,
      code: PLANT_SPECIES_CODES.plum,
      height: 0.92,
      radius: 0.42,
    },
  ]) {
    const tree = n
      .filter((plant) => plant.code === PLANT_SPECIES_CODES.oak)
      .sort(
        (a, b) =>
          Math.hypot(a.x - variety.x, a.z - variety.z) -
          Math.hypot(b.x - variety.x, b.z - variety.z),
      )[0];
    if (!tree) continue;
    tree.code = variety.code;
    tree.kind = PLANT_KIND_BY_SPECIES[variety.code];
    tree.height = Math.min(tree.height, variety.height);
    tree.radius = Math.min(tree.radius, variety.radius);
    tree.canopyY = tree.y + tree.height * 0.65;
  }
  return n;
}
export {
  BiomeDensityGrid,
  PLANT_SPECIES_CODES,
  placeTreesAndShrubs,
  vegetationPlacementNoise,
};
