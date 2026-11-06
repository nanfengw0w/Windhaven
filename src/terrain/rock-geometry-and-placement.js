// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeIcosahedronGeometry,
} from "../vendor/three-runtime.js";
import { TERRARIUM_BOUNDS, WATER_LEVEL_CONFIG } from "../core/config.js";
import {
  clamp,
  createSeededRandom,
  createSimplexNoise,
  lerp,
} from "../core/math.js";
import {
  CABIN_PLACEMENT,
  LAKE_SHAPE,
  RIVER_CONTROL_POINTS,
  RIVER_PATH,
  lakeEllipse,
  queryRiver,
  riverHalfWidth,
  terrainHeight,
  terrainNormal,
  terrainSuitability,
  waterDistance,
} from "../simulation/terrain-shape.js";
import { RIVER_CROSSING, TERRAIN_FOOTPATHS } from "./footpaths-and-masks.js";
import { weldGeometryVertices } from "../geometry/buffer-geometry-utils.js";
import { RIVER_SOURCE, sourcePoint } from "../layout/river-source-layout.js";
const ROCK_VARIANT_COUNT = 4;
function rockSmoothMinimum(r, t, e) {
  const i = clamp(0.5 + (0.5 * (t - r)) / e, 0, 1);
  return lerp(t, r, i) - e * i * (1 - i);
}
function deformRockVariant(r, t, e) {
  const i = createSimplexNoise(t),
    s = createSeededRandom(t * 7 + 3),
    n = [],
    o = e.cuts + Math.floor(s() * 4);
  for (let d = 0; d < o; d++) {
    const p = s() * Math.PI * 2,
      v = lerp(-0.2, 0.85, s()),
      g = Math.sqrt(1 - v * v);
    n.push({
      x: Math.cos(p) * g,
      y: v,
      z: Math.sin(p) * g,
      d: lerp(0.58, 0.86, s()),
    });
  }
  const a = r.attributes.position,
    l = new ThreeBufferGeometry(),
    c = new Float32Array(a.count * 3);
  let h = 1 / 0,
    f = -1 / 0,
    u = 0;
  for (let d = 0; d < a.count; d++) {
    const p = a.getX(d),
      v = a.getY(d),
      g = a.getZ(d);
    let x =
      1 +
      0.2 * i.noise3(p * 1.2, v * 1.2, g * 1.2) +
      0.08 * i.noise3(p * 2.9 + 5, v * 2.9, g * 2.9) +
      0.03 * i.noise3(p * 7, v * 7, g * 7);
    for (const _ of n) {
      const M = p * _.x + v * _.y + g * _.z;
      M > 0.05 && (x = rockSmoothMinimum(x, _.d / M, 0.035));
    }
    v < -0.05 && (x = rockSmoothMinimum(x, 0.62 / -v, 0.12));
    const m = p * x * e.sx,
      w = v * x * e.sy,
      y = g * x * e.sz;
    ((c[d * 3] = m),
      (c[d * 3 + 1] = w),
      (c[d * 3 + 2] = y),
      (h = Math.min(h, w)),
      (f = Math.max(f, w)),
      (u = Math.max(u, Math.hypot(m, y))));
  }
  return (
    l.setAttribute("position", new ThreeBufferAttribute(c, 3)),
    l.setIndex(r.index),
    l.computeVertexNormals(),
    {
      pos: c,
      nrm: l.attributes.normal.array,
      ymin: h,
      ymax: f,
      rh: u * 0.9,
    }
  );
}
function buildRockVariantGeometry(r) {
  const t = new ThreeIcosahedronGeometry(1, r);
  (t.deleteAttribute("uv"), t.deleteAttribute("normal"));
  const e = weldGeometryVertices(t, 1e-4),
    s = [
      {
        sx: 1.15,
        sy: 0.78,
        sz: 0.95,
        cuts: 4,
      },
      {
        sx: 1.3,
        sy: 0.62,
        sz: 1,
        cuts: 5,
      },
      {
        sx: 0.95,
        sy: 0.95,
        sz: 0.9,
        cuts: 6,
      },
      {
        sx: 1.2,
        sy: 0.7,
        sz: 0.82,
        cuts: 3,
      },
    ].map((o, a) => deformRockVariant(e, 911 + a * 131, o)),
    n = new ThreeBufferGeometry();
  (n.setIndex(e.index),
    n.setAttribute("position", new ThreeBufferAttribute(s[0].pos, 3)),
    n.setAttribute("normal", new ThreeBufferAttribute(s[0].nrm, 3)));
  for (let o = 1; o < ROCK_VARIANT_COUNT; o++)
    (n.setAttribute(`aPos${o}`, new ThreeBufferAttribute(s[o].pos, 3)),
      n.setAttribute(`aNrm${o}`, new ThreeBufferAttribute(s[o].nrm, 3)));
  return (
    n.computeBoundingSphere(),
    (n.boundingSphere.radius *= 1.1),
    t.dispose(),
    {
      geo: n,
      variants: s,
    }
  );
}
const rockRiverSample = {};
const rockTerrainNormal = {
  x: 0,
  y: 1,
  z: 0,
};
class RockPlacementSampler {
  constructor(t) {
    ((this.rand = createSeededRandom(t)), (this.list = []));
  }
  r(t, e) {
    return t + (e - t) * this.rand();
  }
  free(t, e, i, s = 0.9) {
    for (const n of this.list)
      if (Math.hypot(n.x - t, n.z - e) < (n.r + i) * s) return !1;
    return !0;
  }
  inBox(t, e, i) {
    return (
      Math.abs(t) < TERRARIUM_BOUNDS.halfW - i * 1.35 - 0.04 &&
      Math.abs(e) < TERRARIUM_BOUNDS.halfD - i * 1.35 - 0.04
    );
  }
  add(t) {
    return this.inBox(t.x, t.z, t.r) ? (this.list.push(t), !0) : !1;
  }
}
function intersectsTerrainFootpath(r, t, e) {
  for (const i of TERRAIN_FOOTPATHS)
    for (const s of i.pts)
      if (Math.hypot(s.x - r, s.z - t) < i.width * 0.5 + e) return !0;
  return !1;
}
function clearsRiverChannel(r, t, e) {
  const i = queryRiver(r, t, rockRiverSample);
  return i ? i.dist > riverHalfWidth(i.t) + e * 0.6 : !0;
}
function placeTerrainRocks(r) {
  const t = new RockPlacementSampler(4242),
    e = (x, m) => t.r(x, m),
    i = (x, m, w, y = {}) => ({
      x,
      z: m,
      r: w,
      kind: "rock",
      squash: 1,
      align: 0.55,
      waterY: -10,
      moss: 0,
      ...y,
    }),
    s = RIVER_CROSSING,
    n = s.halfWidth * 1.9 + 0.05,
    o = (x) => {
      for (let m = 0.02; m < n; m += 0.01)
        if (
          terrainHeight(s.x + s.px * m * x, s.z + s.pz * m * x) >=
          s.y + 0.004
        )
          return m;
      return n;
    },
    a = o(1) + 0.02,
    l = o(-1) + 0.02,
    c = Math.max(4, Math.round((a + l) / 0.15) + 1);
  for (let x = 0; x < c; x++) {
    const m = lerp(-l, a, x / (c - 1)) + e(-0.012, 0.012),
      w = e(-0.035, 0.035);
    t.add(
      i(
        s.x + s.px * m + s.dirX * w,
        s.z + s.pz * m + s.dirZ * w,
        e(0.088, 0.1),
        {
          kind: "stepping",
          squash: 0.55,
          align: 0,
          top: s.y + e(0.032, 0.045),
          waterY: s.y,
          moss: 0.6,
          variant: 1,
        },
      ),
    );
  }
  const h = RIVER_CONTROL_POINTS[2],
    f = RIVER_CONTROL_POINTS[1],
    u = Math.atan2(f.z - h.z, f.x - h.x),
    d = RIVER_CONTROL_POINTS[3],
    p = Math.atan2(d.z - h.z, d.x - h.x);
  for (let x = 0; x < 16 && t.list.length < 18; x++) {
    const m = (x / 16) * Math.PI * 2 + e(-0.15, 0.15);
    if (
      Math.min(
        Math.abs(Math.atan2(Math.sin(m - u), Math.cos(m - u))),
        Math.abs(Math.atan2(Math.sin(m - p), Math.cos(m - p))),
      ) < 0.55
    )
      continue;
    const y = e(0.1, 0.24),
      _ = 0.2 + y * 0.9 + e(0, 0.12),
      M = h.x + Math.cos(m) * _,
      A = h.z + Math.sin(m) * _;
    t.free(M, A, y, 0.8) &&
      t.add(
        i(M, A, y, {
          waterY: h.y,
          moss: 0.8,
        }),
      );
  }
  for (const x of [-1, 1]) {
    const m = queryRiver(f.x, f.z, {}),
      w = -m.dirZ,
      y = m.dirX,
      _ = e(0.1, 0.16),
      M = f.x + w * x * (riverHalfWidth(m.t) + _ * 0.7),
      A = f.z + y * x * (riverHalfWidth(m.t) + _ * 0.7);
    t.free(M, A, _, 0.8) &&
      t.add(
        i(M, A, _, {
          waterY: f.y,
          moss: 0.7,
        }),
      );
  }
  for (let x = 0; x < 40 && t.list.length < 40; x++) {
    const m = e(-2.9, -0.2),
      w = e(-1.35, -0.85),
      y = e(0.05, 0.19);
    if (
      terrainHeight(m, w) > 1.4 ||
      !clearsRiverChannel(m, w, y) ||
      !t.free(m, w, y)
    )
      continue;
    const M = queryRiver(m, w, rockRiverSample);
    t.add(
      i(m, w, y, {
        moss: 0.5,
        waterY: M && M.dist < 0.5 ? M.y : -10,
      }),
    );
  }
  const v = RIVER_CONTROL_POINTS[0];
  for (let x = 0; x < 12; x++) {
    const m = e(0, Math.PI * 2),
      w = e(0.16, 0.42),
      y = v.x + Math.cos(m) * w,
      _ = v.z + Math.sin(m) * w,
      M = e(0.07, 0.16);
    clearsRiverChannel(y, _, M) &&
      t.free(y, _, M) &&
      t.add(
        i(y, _, M, {
          waterY: v.y,
          moss: 0.7,
        }),
      );
  }
  const g = [
    [-4.7, 2.75, 0.42],
    [-1.35, 3.05, 0.3],
    [4.95, 0.35, 0.38],
    [0.95, -0.6, 0.26],
    [-4.3, -0.15, 0.34],
    [3.6, -0.1, 0.22],
  ];
  for (const [x, m, w] of g) {
    let y = null;
    for (let _ = 0; _ < 24 && !y; _++) {
      const M = x + (_ ? e(-0.5, 0.5) : 0),
        A = m + (_ ? e(-0.5, 0.5) : 0);
      waterDistance(M, A) < w + 0.25 ||
        Math.hypot(M - CABIN_PLACEMENT.x, A - CABIN_PLACEMENT.z) < 1.2 + w ||
        intersectsTerrainFootpath(M, A, w + 0.1) ||
        !t.free(M, A, w, 1.1) ||
        !t.inBox(M, A, w) ||
        (y = i(M, A, w, {
          align: 0.35,
          moss: 0.35,
        }));
    }
    if (y) {
      t.add(y);
      for (let _ = 0; _ < 3; _++) {
        const M = e(0, Math.PI * 2),
          A = e(0.05, 0.12),
          b = w + A + e(0.02, 0.18),
          S = y.x + Math.cos(M) * b,
          E = y.z + Math.sin(M) * b;
        t.free(S, E, A) &&
          waterDistance(S, E) > 0.1 &&
          !intersectsTerrainFootpath(S, E, A) &&
          t.add(
            i(S, E, A, {
              moss: 0.3,
            }),
          );
      }
    }
  }
  for (let x = 0; x < 60 && t.list.length < r * 0.55; x++) {
    const m = e(0, Math.PI * 2),
      w = e(0.92, 1.25),
      y = LAKE_SHAPE.cx + Math.cos(m) * LAKE_SHAPE.rx * w,
      _ = LAKE_SHAPE.cz + Math.sin(m) * LAKE_SHAPE.rz * w;
    if (_ > TERRARIUM_BOUNDS.halfD - 0.3 || lakeEllipse(y, _) < 0.9) continue;
    const M = e(0.05, 0.15);
    !clearsRiverChannel(y, _, M) ||
      !t.free(y, _, M) ||
      intersectsTerrainFootpath(y, _, M) ||
      (t.rand() < 0.45 &&
        t.add(
          i(y, _, M, {
            waterY: WATER_LEVEL_CONFIG.lakeLevel,
            moss: 0.5,
          }),
        ));
  }
  for (let x = 0; x < RIVER_PATH.length && t.list.length < r * 0.72; x += 3) {
    const m = RIVER_PATH[x];
    if (m.t < 0.22 || m.t > 0.94 || t.rand() < 0.35) continue;
    const w = Math.min(RIVER_PATH.length - 1, x + 1),
      y = RIVER_PATH[w].x - m.x,
      _ = RIVER_PATH[w].z - m.z,
      M = Math.hypot(y, _) || 1,
      A = t.rand() < 0.5 ? -1 : 1,
      b = e(0.035, 0.1),
      E = riverHalfWidth(m.t) + b * e(0.2, 1.4),
      T = m.x - (_ / M) * E * A,
      R = m.z + (y / M) * E * A;
    Math.hypot(T - s.x, R - s.z) < 0.35 ||
      !t.free(T, R, b) ||
      intersectsTerrainFootpath(T, R, b) ||
      t.add(
        i(T, R, b, {
          waterY: m.y,
          moss: 0.65,
        }),
      );
  }
  for (let x = 0; x < 4e3 && t.list.length < r; x++) {
    const m = e(-TERRARIUM_BOUNDS.halfW + 0.2, TERRARIUM_BOUNDS.halfW - 0.2),
      w = e(-TERRARIUM_BOUNDS.halfD + 0.2, 1.2),
      y = terrainSuitability(m, w, "rock");
    if (t.rand() > y * 0.6 || terrainNormal(m, w, rockTerrainNormal).y < 0.62)
      continue;
    const _ = terrainHeight(m, w),
      M =
        e(0.05, 0.12) + e(0, 0.12) * clamp(y, 0, 1) + (_ > 2 ? e(0, 0.06) : 0);
    waterDistance(m, w) < 0.12 + M ||
      Math.hypot(m - CABIN_PLACEMENT.x, w - CABIN_PLACEMENT.z) < 1.2 ||
      intersectsTerrainFootpath(m, w, M) ||
      (t.free(m, w, M) &&
        t.add(
          i(m, w, M, {
            moss: _ < 1.5 ? 0.4 : 0.15,
            align: 0.7,
          }),
        ));
  }
  // Embedded, asymmetrical stones frame a small cleft. The broad back stone
  // conceals the first water row; the banks open out before the gathering pool.
  // Append after the scatter so this cluster consumes none of its random stream.
  for (const [across, along, radius, squash, variant] of [
    [0.015, -0.18, 0.27, 0.82, 0],
    [-0.21, 0.025, 0.185, 0.9, 2],
    [0.19, 0.035, 0.16, 0.72, 3],
  ]) {
    const point = sourcePoint(across, along);
    t.add(
      i(point.x, point.z, radius, {
        kind: "spring",
        squash,
        align: 0.15,
        waterY: RIVER_SOURCE.y,
        moss: 0.82,
        variant,
      }),
    );
  }
  return t.list;
}
export { ROCK_VARIANT_COUNT, buildRockVariantGeometry, placeTerrainRocks };
