// Reconstructed module: identifiers and file boundaries are refactor choices.
import { TERRARIUM_BOUNDS, WATER_LEVEL_CONFIG } from "../core/config.js";
import { clamp, createSeededRandom, lerp, smoothstep } from "../core/math.js";
import {
  CABIN_PLACEMENT,
  LAKE_SHAPE,
  lakeEllipse,
  queryRiver,
  riverHalfWidth,
  waterDistance,
} from "../simulation/terrain-shape.js";
import { TERRAIN_FOOTPATHS } from "../terrain/footpaths-and-masks.js";
import { isShrubSpecies } from "./tree-species.js";
import {
  BiomeDensityGrid,
  PLANT_SPECIES_CODES,
  vegetationPlacementNoise,
} from "./tree-placement.js";
class VegetationPlacementMasks {
  constructor(t, e, bounds = TERRARIUM_BOUNDS) {
    this.bounds = bounds;
    const i = (this.res = 0.05),
      s = (this.nx = Math.ceil((bounds.halfW * 2) / i) + 1),
      n = (this.nz = Math.ceil((bounds.halfD * 2) / i) + 1);
    ((this.path = new Float32Array(s * n).fill(9)),
      (this.shade = new Float32Array(s * n)),
      (this.bare = new Float32Array(s * n)));
    const o = (h) => -bounds.halfW + h * i,
      a = (h) => -bounds.halfD + h * i,
      l = (h, f, u, d, p) => {
        const v = Math.max(0, Math.floor((h + bounds.halfW) / i)),
          g = Math.min(s - 1, Math.ceil((f + bounds.halfW) / i)),
          x = Math.max(0, Math.floor((u + bounds.halfD) / i)),
          m = Math.min(n - 1, Math.ceil((d + bounds.halfD) / i));
        for (let w = x; w <= m; w++)
          for (let y = v; y <= g; y++) p(w * s + y, o(y), a(w));
      },
      c = 0.4;
    for (const h of TERRAIN_FOOTPATHS)
      for (let f = 0; f < h.pts.length - 1; f++) {
        const u = h.pts[f],
          d = h.pts[f + 1],
          p = d.x - u.x,
          v = d.z - u.z,
          g = p * p + v * v || 1e-9;
        l(
          Math.min(u.x, d.x) - c,
          Math.max(u.x, d.x) + c,
          Math.min(u.z, d.z) - c,
          Math.max(u.z, d.z) + c,
          (x, m, w) => {
            let y = ((m - u.x) * p + (w - u.z) * v) / g;
            y = y < 0 ? 0 : y > 1 ? 1 : y;
            const _ =
              Math.hypot(u.x + p * y - m, u.z + v * y - w) - h.width * 0.5;
            _ < this.path[x] && (this.path[x] = _);
          },
        );
      }
    for (const h of t) {
      const f =
          h.radius *
          (h.code === PLANT_SPECIES_CODES.pine
            ? 0.95
            : isShrubSpecies(h.code)
              ? 0.85
              : 0.75),
        u =
          h.code === PLANT_SPECIES_CODES.pine
            ? 1
            : isShrubSpecies(h.code)
              ? 0.95
              : 0.7;
      l(h.x - f, h.x + f, h.z - f, h.z + f, (d, p, v) => {
        const g = ((p - h.x) ** 2 + (v - h.z) ** 2) / (f * f);
        g < 1 && (this.shade[d] = Math.max(this.shade[d], (1 - g * g) * u));
      });
    }
    if (typeof e?.bareAt == "function")
      for (let h = 0; h < n; h++)
        for (let f = 0; f < s; f++) this.bare[h * s + f] = e.bareAt(o(f), a(h));
    else
      l(
        CABIN_PLACEMENT.x - 1.2,
        CABIN_PLACEMENT.x + 1.2,
        CABIN_PLACEMENT.z - 1.2,
        CABIN_PLACEMENT.z + 1.2,
        (h, f, u) => {
          this.bare[h] =
            1 -
            smoothstep(
              0.3,
              0.95,
              Math.hypot(f - CABIN_PLACEMENT.x, u - CABIN_PLACEMENT.z),
            );
        },
      );
  }
  _s(t, e, i) {
    const s = clamp((e + this.bounds.halfW) / this.res, 0, this.nx - 1.001),
      n = clamp((i + this.bounds.halfD) / this.res, 0, this.nz - 1.001),
      o = Math.floor(s),
      a = Math.floor(n),
      l = s - o,
      c = n - a,
      h = this.nx;
    return (
      (t[a * h + o] * (1 - l) + t[a * h + o + 1] * l) * (1 - c) +
      (t[(a + 1) * h + o] * (1 - l) + t[(a + 1) * h + o + 1] * l) * c
    );
  }
  pathAt(t, e) {
    return this._s(this.path, t, e);
  }
  shadeAt(t, e) {
    return this._s(this.shade, t, e);
  }
  bareAt(t, e) {
    return this._s(this.bare, t, e);
  }
}
function grassDensityAt(biome, masks, x, z) {
  let density = biome.at(x, z);
  if (density <= 0.02) return 0;
  const patch =
    0.5 +
    0.5 *
      smoothstep(
        -0.35,
        0.3,
        vegetationPlacementNoise.noise2(x * 0.7 + 1.3, z * 0.7 - 4.1),
      );
  density *=
    patch *
    (1 - 0.9 * masks.bareAt(x, z)) *
    smoothstep(-0.02, 0.1, masks.pathAt(x, z)) *
    (1 - masks.shadeAt(x, z) * 0.85);
  return density;
}
function generateGrassInstances(r, t, e, options = {}) {
  const bounds = options.bounds ?? TERRARIUM_BOUNDS;
  const accept = options.accept;
  const i = createSeededRandom(options.seed ?? 777),
    s = options.biome ?? new BiomeDensityGrid("grass", 0.1),
    n = new Float32Array(r * 4),
    o = new Float32Array(r * 4),
    a = new Float32Array(r * 4);
  let l = 0;
  const c = (u, d) =>
      accept && !accept(u, d) ? 0 : grassDensityAt(s, t, u, d),
    h = (u, d, p, v = 0) => {
      if (
        l >= r ||
        Math.abs(u) > bounds.halfW - 0.03 ||
        Math.abs(d) > bounds.halfD - 0.03 ||
        (accept && !accept(u, d))
      )
        return;
      const g = waterDistance(u, d);
      if (g < 0.03) return;
      const x = e(u, d),
        m = smoothstep(0.6, 0.05, g),
        w = clamp(
          smoothstep(0.9, 2.2, x) +
            (vegetationPlacementNoise.noise2(u * 1.7, d * 1.7) * 0.5 + 0.5) *
              0.35 -
            m * 0.3,
          0,
          1,
        ),
        y = smoothstep(
          -0.2,
          0.45,
          vegetationPlacementNoise.noise2(u * 0.42 - 3.3, d * 0.42 + 8.1),
        ),
        _ = smoothstep(0.02, 0.45, t.pathAt(u, d)) * (1 - 0.7 * t.bareAt(u, d)),
        M =
          (0.042 + 0.07 * i() * i() + m * 0.045 + p * 0.05 + y * 0.05) *
          lerp(1, 0.6, smoothstep(1.2, 2.4, x)) *
          lerp(0.5, 1, _),
        A = l * 4;
      ((n[A] = u),
        (n[A + 1] = x - 0.004),
        (n[A + 2] = d),
        (n[A + 3] = i()),
        (o[A] = M),
        (o[A + 1] = lerp(0.009, 0.017, i()) * (0.85 + p * 0.3)),
        (o[A + 2] = i() * Math.PI * 2),
        (o[A + 3] = lerp(0.12, 0.55, i() * i()) + p * 0.1),
        (a[A] = w),
        (a[A + 1] = lakeEllipse(u, d) < 1.7 ? 1 : 0),
        (a[A + 2] = m),
        (a[A + 3] = clamp(c(u, d) * 1.1 + v * 0.35 + y * 0.2, 0, 1)),
        l++);
    };
  let f = 0;
  for (; l < r * 0.45 && f++ < r * 4;) {
    const u = lerp(-bounds.halfW, bounds.halfW, i()),
      d = lerp(-bounds.halfD, bounds.halfD, i());
    if (i() > c(u, d)) continue;
    const p = 6 + Math.floor(i() * 14),
      v = lerp(0.025, 0.06, i()),
      g = i() * 0.8;
    for (let x = 0; x < p; x++) {
      const m = i() * Math.PI * 2,
        w = v * Math.sqrt(i());
      h(
        u + Math.cos(m) * w,
        d + Math.sin(m) * w,
        g * (1 - (w / v) * 0.5),
        1 - w / v,
      );
    }
  }
  for (f = 0; l < r && f++ < r * 12;) {
    const u = lerp(-bounds.halfW, bounds.halfW, i()),
      d = lerp(-bounds.halfD, bounds.halfD, i());
    i() > c(u, d) || h(u, d, 0);
  }
  return {
    root: n,
    shape: o,
    tint: a,
    count: l,
  };
}
function generateFlowerInstances(r, t, e) {
  const i = createSeededRandom(4411),
    s = new BiomeDensityGrid("flower", 0.1),
    n = new Float32Array(r * 4),
    o = new Float32Array(r * 4);
  let a = 0,
    l = 0;
  const c = [0.024, 0.02, 0.022, 0.016, 0.026, 0.022],
    h = [0.07, 0.085, 0.1, 0.05, 0.11, 0.1];
  for (; a < r && l++ < r * 40;) {
    const f = lerp(-TERRARIUM_BOUNDS.halfW, TERRARIUM_BOUNDS.halfW, i()),
      u = lerp(-TERRARIUM_BOUNDS.halfD, TERRARIUM_BOUNDS.halfD, i());
    let d = s.at(f, u);
    if (d < 0.05) continue;
    const p = smoothstep(
      0.05,
      0.45,
      vegetationPlacementNoise.noise2(f * 0.8 - 2.2, u * 0.8 + 6.1),
    );
    if (
      ((d *=
        p *
        (1 - t.bareAt(f, u)) *
        (1 - t.shadeAt(f, u)) *
        smoothstep(0.02, 0.1, t.pathAt(f, u))),
      i() > d)
    )
      continue;
    let v = Math.floor(
      (vegetationPlacementNoise.noise2(f * 0.55 + 9.1, u * 0.55 - 3.3) * 0.5 +
        0.5) *
        6,
    );
    (i() < 0.22 && (v = Math.floor(i() * 6)), (v = clamp(v, 0, 5)));
    const g = a * 4;
    ((n[g] = f),
      (n[g + 1] = e(f, u) - 0.003),
      (n[g + 2] = u),
      (n[g + 3] = i()),
      (o[g] = h[v] * lerp(0.7, 1.25, i())),
      (o[g + 1] = c[v] * lerp(0.8, 1.2, i())),
      (o[g + 2] = v),
      (o[g + 3] = i() * Math.PI * 2),
      a++);
  }
  return {
    root: n,
    shape: o,
    count: a,
  };
}
function generateReedInstances(r, t, e) {
  const i = createSeededRandom(3131),
    s = new Float32Array(r * 4),
    n = new Float32Array(r * 4),
    o = new Float32Array(r * 4),
    a = {};
  let l = 0;
  const c = WATER_LEVEL_CONFIG.lakeLevel,
    h = (u, d) => {
      if (
        Math.abs(u) > TERRARIUM_BOUNDS.halfW - 0.05 ||
        Math.abs(d) > TERRARIUM_BOUNDS.halfD - 0.12 ||
        t.pathAt(u, d) < 0.12
      )
        return !1;
      const p = e(u, d);
      if (lakeEllipse(u, d) < 1.35) return p > c - 0.07 && p < c + 0.07;
      const g = queryRiver(u, d, a);
      if (g && g.t > 0.28) {
        const x = riverHalfWidth(g.t);
        return g.dist > x * 0.72 && g.dist < x + 0.12 && p < g.y + 0.06;
      }
      return !1;
    };
  let f = 0;
  for (; l < r && f++ < 2e4;) {
    let u, d;
    if (i() < 0.62) {
      const g = i() * Math.PI * 2,
        x = lerp(0.98, 1.2, i());
      ((u = LAKE_SHAPE.cx + Math.cos(g) * LAKE_SHAPE.rx * x),
        (d = LAKE_SHAPE.cz + Math.sin(g) * LAKE_SHAPE.rz * x));
    } else ((u = lerp(-1.6, 2.2, i())), (d = lerp(-1.2, 2.2, i())));
    if (
      !h(u, d) ||
      vegetationPlacementNoise.noise2(u * 1.4 + 4.4, d * 1.4) < -0.15
    )
      continue;
    const p = 8 + Math.floor(i() * 18),
      v = lerp(0.05, 0.13, i());
    for (let g = 0; g < p && l < r; g++) {
      const x = i() * Math.PI * 2,
        m = v * Math.sqrt(i()),
        w = u + Math.cos(x) * m,
        y = d + Math.sin(x) * m;
      if (!h(w, y)) continue;
      const _ = e(w, y),
        M = l * 4,
        A = i() < 0.09 ? 1 : 0;
      ((s[M] = w),
        (s[M + 1] = _ - 0.005),
        (s[M + 2] = y),
        (s[M + 3] = i()),
        (n[M] = lerp(0.14, 0.32, i()) * (1 - (m / v) * 0.35) * (A ? 1.12 : 1)),
        (n[M + 1] = A ? 0.0075 : lerp(0.011, 0.019, i())),
        (n[M + 2] = i() * Math.PI * 2),
        (n[M + 3] = A ? lerp(0.02, 0.12, i()) : lerp(0.08, 0.5, i() * i())),
        (o[M] = A),
        (o[M + 1] = _ < c ? 1 : 0),
        l++);
    }
  }
  return {
    root: s,
    shape: n,
    tint: o,
    count: l,
  };
}
export {
  VegetationPlacementMasks,
  generateFlowerInstances,
  generateGrassInstances,
  grassDensityAt,
  generateReedInstances,
};
