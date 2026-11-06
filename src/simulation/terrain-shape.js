// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  FIELD_BOUNDS,
  LANDSCAPE_BOUNDS,
  TERRARIUM_BOUNDS,
  WATER_LEVEL_CONFIG,
} from "../core/config.js";
import { clamp, createSimplexNoise, lerp, smoothstep } from "../core/math.js";
import { sculptLandscapeHeight } from "./landscape-shape.js";
import { createTownGrounding } from "../layout/town-grounding.js";
import {
  RIVER_SOURCE,
  sourceWaterHeight,
  shapeRiverSourceBanks,
} from "../layout/river-source-layout.js";
const terrainNoise = createSimplexNoise(20240917);
const TERRAIN_PEAKS = [
  {
    x: -3.4,
    z: -2.8,
    h: 3.95,
    r: 2.25,
    squash: 1.25,
  },
  {
    x: -0.55,
    z: -3.25,
    h: 3.05,
    r: 1.8,
    squash: 1.1,
  },
  {
    x: 1.95,
    z: -2.95,
    h: 3.3,
    r: 2,
    squash: 1.2,
  },
  {
    x: 4.5,
    z: -3.05,
    h: 2.45,
    r: 1.9,
    squash: 1,
  },
  {
    x: -5.4,
    z: -1.6,
    h: 1.55,
    r: 1.5,
    squash: 1,
  },
];
const LAKE_SHAPE = {
  cx: 2.75,
  cz: 2.65,
  rx: 2.35,
  rz: 1.75,
  bottomY: -0.85,
};
const RIVER_CONTROL_POINTS = [
  {
    x: RIVER_SOURCE.x,
    z: RIVER_SOURCE.z,
    y: RIVER_SOURCE.y,
  },
  {
    x: -1.55,
    z: -1.72,
    y: 2.02,
  },
  {
    x: -1.35,
    z: -1.22,
    y: 0.98,
  },
  {
    x: -0.7,
    z: -0.55,
    y: 0.66,
  },
  {
    x: -0.05,
    z: 0.25,
    y: 0.46,
  },
  {
    x: 0.75,
    z: 0.8,
    y: 0.3,
  },
  {
    x: 1.5,
    z: 1.5,
    y: 0.16,
  },
  {
    x: 2.15,
    z: 2.1,
    y: 0.06,
  },
];
const WATERFALL_SEGMENT = {
  topIndex: 1,
  bottomIndex: 2,
};
const CABIN_PLACEMENT = {
  x: -2.95,
  z: 1.35,
  rot: 0.55,
  padRadius: 0.75,
};
const riverSplineSamples = [];
(function () {
  const t = RIVER_CONTROL_POINTS,
    e = 28;
  for (let n = 0; n < t.length - 1; n++) {
    const o = t[Math.max(0, n - 1)],
      a = t[n],
      l = t[n + 1],
      c = t[Math.min(t.length - 1, n + 2)];
    for (let h = 0; h < e; h++) {
      const f = h / e,
        u = f * f,
        d = u * f,
        p = (g, x, m, w) =>
          0.5 *
          (2 * x +
            (-g + m) * f +
            (2 * g - 5 * x + 4 * m - w) * u +
            (-g + 3 * x - 3 * m + w) * d),
        v = f * f * (3 - 2 * f);
      riverSplineSamples.push({
        x: p(o.x, a.x, l.x, c.x),
        z: p(o.z, a.z, l.z, c.z),
        y: n === 0 ? sourceWaterHeight(f) : lerp(a.y, l.y, v),
        seg: n + f,
      });
    }
  }
  const i = t[t.length - 1];
  riverSplineSamples.push({
    x: i.x,
    z: i.z,
    y: i.y,
    seg: t.length - 1,
  });
  let s = 0;
  riverSplineSamples[0].s = 0;
  for (let n = 1; n < riverSplineSamples.length; n++) {
    const o = riverSplineSamples[n - 1],
      a = riverSplineSamples[n];
    ((s += Math.hypot(a.x - o.x, a.z - o.z)), (a.s = s));
  }
  for (const n of riverSplineSamples) n.t = n.s / s;
})();
const RIVER_LENGTH = riverSplineSamples[riverSplineSamples.length - 1].s;
const RIVER_PATH = riverSplineSamples;
let riverMinX = 1 / 0;
let riverMaxX = -1 / 0;
let riverMinZ = 1 / 0;
let riverMaxZ = -1 / 0;
for (const r of riverSplineSamples)
  ((riverMinX = Math.min(riverMinX, r.x)),
    (riverMaxX = Math.max(riverMaxX, r.x)),
    (riverMinZ = Math.min(riverMinZ, r.z)),
    (riverMaxZ = Math.max(riverMaxZ, r.z)));
const RIVER_QUERY_MARGIN = 1.35;
function riverHalfWidth(r) {
  return lerp(0.1, 0.24, smoothstep(0, 1, r));
}
function queryRiver(r, t, e = {}) {
  if (
    r < riverMinX - RIVER_QUERY_MARGIN ||
    r > riverMaxX + RIVER_QUERY_MARGIN ||
    t < riverMinZ - RIVER_QUERY_MARGIN ||
    t > riverMaxZ + RIVER_QUERY_MARGIN
  )
    return null;
  let i = 1 / 0,
    s = 0,
    n = 0;
  for (let c = 0; c < riverSplineSamples.length - 1; c++) {
    const h = riverSplineSamples[c],
      f = riverSplineSamples[c + 1],
      u = f.x - h.x,
      d = f.z - h.z,
      p = u * u + d * d || 1e-9;
    let v = ((r - h.x) * u + (t - h.z) * d) / p;
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    const g = h.x + u * v - r,
      x = h.z + d * v - t,
      m = g * g + x * x;
    m < i && ((i = m), (s = c), (n = v));
  }
  const o = riverSplineSamples[s],
    a = riverSplineSamples[s + 1],
    l = Math.hypot(a.x - o.x, a.z - o.z) || 1e-9;
  return (
    (e.dist = Math.sqrt(i)),
    (e.t = lerp(o.t, a.t, n)),
    (e.seg = lerp(o.seg, a.seg, n)),
    (e.y = lerp(o.y, a.y, n)),
    (e.dirX = (a.x - o.x) / l),
    (e.dirZ = (a.z - o.z) / l),
    (e.side = Math.sign((r - o.x) * e.dirZ - (t - o.z) * e.dirX) || 1),
    e
  );
}
function smoothMaximum(r, t, e) {
  const i = clamp(0.5 + (0.5 * (t - r)) / e, 0, 1);
  return lerp(r, t, i) + e * i * (1 - i);
}
function smoothMinimum(r, t, e) {
  return -smoothMaximum(-r, -t, e);
}
function lakeEllipse(r, t) {
  const e = (r - LAKE_SHAPE.cx) / LAKE_SHAPE.rx,
    i = (t - LAKE_SHAPE.cz) / LAKE_SHAPE.rz,
    s = Math.atan2(i, e),
    n =
      0.07 * Math.sin(s * 3 + 1.3) +
      0.05 * Math.sin(s * 5 - 0.4) +
      0.06 * terrainNoise.noise2(r * 0.9 + 7, t * 0.9 - 3);
  return Math.sqrt(e * e + i * i) * (1 + n);
}
function baseTerrainHeight(r, t) {
  let e =
    0.42 +
    terrainNoise.fbm2(r * 0.17 + 3.1, t * 0.17 - 1.7, 4) * 0.3 +
    terrainNoise.noise2(r * 0.9, t * 0.9) * 0.025;
  ((e +=
    0.32 *
    Math.exp(
      -((r - CABIN_PLACEMENT.x) ** 2 + (t - CABIN_PLACEMENT.z) ** 2) / 1.3,
    )),
    (e += 0.18 * smoothstep(-2.5, -6, r) * smoothstep(-1, 3.5, t)));
  const i = smoothstep(0.2, -3.9, t);
  e += i * i * 1.25;
  let s = 0;
  for (const f of TERRAIN_PEAKS) {
    const u = (r - f.x) / f.squash,
      d = t - f.z,
      p = (u * u + d * d) / (f.r * f.r);
    s = smoothMaximum(s, f.h * Math.exp(-p * 1.7), 0.55);
  }
  const n = terrainNoise.ridged2(r * 0.5 + 10.3, t * 0.5 + 4.1, 5),
    o = smoothstep(0.6, 3.5, s);
  ((s *= 0.78 + 0.34 * n * (0.35 + 0.65 * o)),
    (s += terrainNoise.fbm2(r * 1.3 - 5, t * 1.3 + 2, 3) * 0.12 * o),
    (e = smoothMaximum(e, s + 0.15, 0.55)));
  const a = r + 1.62 + 0.18 * Math.sin(t * 2.1),
    l = 1 - smoothstep(0.75, 1.55, Math.abs(a)),
    c = -1.5 + 0.08 * terrainNoise.noise2(r * 2.2, 3.3),
    h =
      2.18 * smoothstep(c + 0.28, c - 0.2, t) * l +
      terrainNoise.noise2(r * 2.6, t * 2.6) * 0.06 * l;
  return ((e = smoothMaximum(e, h, 0.12)), e);
}
const riverQueryScratch = {};
function naturalTerrainHeight(r, t) {
  let e = baseTerrainHeight(r, t);
  const i = Math.hypot(r - CABIN_PLACEMENT.x, t - CABIN_PLACEMENT.z);
  if (i < CABIN_PLACEMENT.padRadius * 1.8) {
    const o = terrainPadHeights.cabin;
    e = lerp(
      e,
      o,
      1 -
        smoothstep(
          CABIN_PLACEMENT.padRadius * 0.7,
          CABIN_PLACEMENT.padRadius * 1.8,
          i,
        ),
    );
  }
  const s = queryRiver(r, t, riverQueryScratch);
  if (s) {
    const o = riverHalfWidth(s.t),
      a = lerp(0.07, 0.16, smoothstep(0.1, 0.9, s.t)),
      l = s.y - a,
      c = smoothstep(o * 0.45, o + 0.55, s.dist),
      h = l + (e - l) * (c * c * (0.35 + 0.65 * c)),
      f = 1 - smoothstep(o + 0.45, o + 0.9, s.dist);
    e = lerp(e, h, f);
    e = shapeRiverSourceBanks(r, t, e, s);
  }
  const n = lakeEllipse(r, t);
  if (n < 2.4) {
    const o =
      LAKE_SHAPE.bottomY +
      (WATER_LEVEL_CONFIG.lakeLevel + 0.38 - LAKE_SHAPE.bottomY) *
        Math.pow(clamp(n / 1.25, 0, 1), 2.1) +
      Math.max(0, n - 1.25) * 2.2;
    e = smoothMinimum(e, o, 0.18);
  }
  return sculptLandscapeHeight(r, t, e, terrainNoise);
}
let townGrounding;
function terrainHeight(r, t) {
  const natural = naturalTerrainHeight(r, t);
  if (r <= 6.55 || r > 11 || t < -3.4 || t > 4.7) return natural;
  townGrounding ??= createTownGrounding(naturalTerrainHeight);
  return townGrounding.height(r, t, natural);
}
const terrainPadHeights = {
  cabin: baseTerrainHeight(CABIN_PLACEMENT.x, CABIN_PLACEMENT.z),
};
CABIN_PLACEMENT.y = terrainHeight(CABIN_PLACEMENT.x, CABIN_PLACEMENT.z);
function terrainNormal(
  r,
  t,
  e = {
    x: 0,
    y: 1,
    z: 0,
  },
) {
  const s = terrainHeight(r - 0.04, t),
    n = terrainHeight(r + 0.04, t),
    o = terrainHeight(r, t - 0.04),
    a = terrainHeight(r, t + 0.04);
  let l = s - n,
    c = 2 * 0.04,
    h = o - a;
  const f = Math.hypot(l, c, h);
  return ((e.x = l / f), (e.y = c / f), (e.z = h / f), e);
}
function lakeMask(r, t, e = WATER_LEVEL_CONFIG.lakeLevel) {
  if (lakeEllipse(r, t) > 1.5) return 0;
  const s = terrainHeight(r, t);
  return smoothstep(e + 0.02, e - 0.04, s);
}
function riverMask(r, t) {
  const e = queryRiver(r, t, riverQueryScratch);
  if (!e) return 0;
  const i = riverHalfWidth(e.t);
  return 1 - smoothstep(i * 0.8, i * 1.05, e.dist);
}
function isWater(r, t, e = WATER_LEVEL_CONFIG.lakeLevel) {
  return lakeMask(r, t, e) > 0.5 || riverMask(r, t) > 0.5;
}
function insideTerrarium(r, t, e = 0) {
  return (
    Math.abs(r) <= TERRARIUM_BOUNDS.halfW - e &&
    Math.abs(t) <= TERRARIUM_BOUNDS.halfD - e
  );
}
function terrainSuitability(r, t, e = "grass", bounds = TERRARIUM_BOUNDS) {
  if (Math.abs(r) > bounds.halfW - 0.05 || Math.abs(t) > bounds.halfD - 0.05)
    return 0;
  const i = terrainHeight(r, t),
    n = 1 - terrainNormal(r, t).y,
    o = waterDistance(r, t),
    a = Math.hypot(r - CABIN_PLACEMENT.x, t - CABIN_PLACEMENT.z);
  if (o < 0.05) return 0;
  switch (e) {
    case "grass":
      return (
        smoothstep(0.35, 0.12, n) *
        smoothstep(2.6, 1.6, i) *
        smoothstep(0.02, 0.14, o)
      );
    case "flower":
      return (
        smoothstep(0.2, 0.06, n) *
        smoothstep(1.2, 0.6, i) *
        smoothstep(0.2, 0.5, o) *
        smoothstep(0.6, 1, a)
      );
    case "tree":
      return (
        smoothstep(0.3, 0.1, n) *
        smoothstep(1.5, 0.8, i) *
        smoothstep(0.35, 0.7, o) *
        smoothstep(0.9, 1.4, a)
      );
    case "pine":
      return (
        smoothstep(0.55, 0.2, n) *
        smoothstep(0.5, 1, i) *
        smoothstep(3.1, 2.3, i) *
        smoothstep(0.3, 0.6, o) *
        smoothstep(0.9, 1.4, a)
      );
    case "rock":
      return smoothstep(0.15, 0.5, n) + smoothstep(2.2, 3.2, i) * 0.6;
    default:
      return 1;
  }
}
function waterDistance(r, t) {
  let e = 1 / 0;
  const i = queryRiver(r, t, riverQueryScratch);
  i && (e = Math.max(0, i.dist - riverHalfWidth(i.t)));
  const s = lakeEllipse(r, t),
    n = Math.max(0, s - 1.08) * Math.min(LAKE_SHAPE.rx, LAKE_SHAPE.rz);
  return ((e = Math.min(e, s < 1.08 ? 0 : n)), e);
}
function highestTerrainNearby(r, t, e = 1, i = 24) {
  let s = {
    x: r,
    z: t,
    y: terrainHeight(r, t),
  };
  for (let n = 0; n < i; n++) {
    const o = (n / i) * Math.PI * 2 * 2.618,
      a = e * Math.sqrt((n + 0.5) / i),
      l = clamp(
        r + Math.cos(o) * a,
        -LANDSCAPE_BOUNDS.halfW + 0.1,
        LANDSCAPE_BOUNDS.halfW - 0.1,
      ),
      c = clamp(
        t + Math.sin(o) * a,
        -LANDSCAPE_BOUNDS.halfD + 0.1,
        LANDSCAPE_BOUNDS.halfD - 0.1,
      ),
      h = terrainHeight(l, c);
    h > s.y &&
      (s = {
        x: l,
        z: c,
        y: h,
      });
  }
  return s;
}
function bakeTerrainData(r = 384, t = 256) {
  const e = new Float32Array(r * t * 4),
    i = {
      x: 0,
      y: 1,
      z: 0,
    };
  for (let s = 0; s < t; s++) {
    const n = FIELD_BOUNDS.minZ + ((s + 0.5) / t) * FIELD_BOUNDS.sizeZ;
    for (let o = 0; o < r; o++) {
      const a = FIELD_BOUNDS.minX + ((o + 0.5) / r) * FIELD_BOUNDS.sizeX,
        l = (s * r + o) * 4,
        c = terrainHeight(a, n);
      ((e[l] = c),
        (e[l + 1] = riverMask(a, n)),
        (e[l + 2] =
          smoothstep(
            WATER_LEVEL_CONFIG.lakeLevel + 0.02,
            WATER_LEVEL_CONFIG.lakeLevel - 0.04,
            c,
          ) * (lakeEllipse(a, n) < 1.5 ? 1 : 0)),
        terrainNormal(a, n, i),
        (e[l + 3] = 1 - i.y));
    }
  }
  return {
    data: e,
    resX: r,
    resZ: t,
  };
}
const terrainShape = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      CABIN: CABIN_PLACEMENT,
      LAKE: LAKE_SHAPE,
      PEAKS: TERRAIN_PEAKS,
      RIVER_LENGTH: RIVER_LENGTH,
      RIVER_PATH: RIVER_PATH,
      RIVER_POINTS: RIVER_CONTROL_POINTS,
      WATERFALL: WATERFALL_SEGMENT,
      bakeTerrainData: bakeTerrainData,
      baseHeight: baseTerrainHeight,
      highestNear: highestTerrainNearby,
      insideBox: insideTerrarium,
      isWater: isWater,
      lakeEllipse: lakeEllipse,
      lakeMask: lakeMask,
      riverHalfWidth: riverHalfWidth,
      riverMask: riverMask,
      riverQuery: queryRiver,
      suitability: terrainSuitability,
      terrainHeight: terrainHeight,
      terrainNormal: terrainNormal,
      waterDistance: waterDistance,
    },
    Symbol.toStringTag,
    {
      value: "Module",
    },
  ),
);
export {
  CABIN_PLACEMENT,
  LAKE_SHAPE,
  RIVER_CONTROL_POINTS,
  RIVER_PATH,
  bakeTerrainData,
  lakeEllipse,
  naturalTerrainHeight,
  queryRiver,
  riverHalfWidth,
  terrainHeight,
  terrainNormal,
  terrainShape,
  terrainSuitability,
  waterDistance,
};
