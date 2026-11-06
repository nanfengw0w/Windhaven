import { clamp, lerp, smoothstep } from "../core/math.js";
import { sourceSurfaceHalfWidth } from "../layout/river-source-layout.js";
import {
  RIVER_PATH,
  lakeEllipse,
  queryRiver,
  riverHalfWidth,
  terrainHeight,
} from "./terrain-shape.js";

// CPU counterparts of the existing lake bounds and river ribbon. Keep these
// numerical rules aligned with LakeSurface, RiverAndWaterfall and their shaders;
// navigation must not depend on renderer instances or the broader river mask.
const LAKE_BOUNDS = { minX: -0.55, maxX: 5.85, minZ: 0.3, maxZ: 5.15 };
const FALL_LIP = 1.04;
const FALL_POOL = 1.93;
const RIVER_COLUMNS = 9;
const HASH_SIZE = 0.25;
let riverSurface;

function waterNoise(x, z) {
  const fract = (v) => v - Math.floor(v);
  const hash = (px, pz) => {
    px = fract(px * 123.34);
    pz = fract(pz * 456.21);
    const dot = px * (px + 45.32) + pz * (pz + 45.32);
    return fract((px + dot) * (pz + dot));
  };
  const ix = Math.floor(x),
    iz = Math.floor(z);
  const fx = fract(x),
    fz = fract(z);
  const ux = fx * fx * (3 - 2 * fx),
    uz = fz * fz * (3 - 2 * fz);
  return lerp(
    lerp(hash(ix, iz), hash(ix + 1, iz), ux),
    lerp(hash(ix, iz + 1), hash(ix + 1, iz + 1), ux),
    uz,
  );
}

function lakeIce(x, z, depth, ice) {
  if (ice <= 0.001) return 0;
  const noise =
    waterNoise(x * 1.7 + 3.3, z * 1.7 + 3.3) * 0.62 +
    waterNoise(x * 5.3, z * 5.3) * 0.26;
  return smoothstep(
    0,
    0.05,
    ice * 1.4 - clamp(depth / 0.9, 0, 1) * 0.82 - noise * 0.36 + 0.08,
  );
}

function riverIce(x, z, y, across, temperature, lapse) {
  const freeze = smoothstep(-0.5, -6.5, temperature - lapse * Math.max(y, 0));
  // Decorative edge flecks exist even in warm water. Physical ice support
  // forms continuously, instead of lifting the feet at the freezing threshold.
  const strength = smoothstep(0, 0.15, freeze);
  if (strength === 0) return 0;
  const noise = waterNoise(x * 9, z * 9) - 0.5;
  return (
    strength *
    Math.max(
      smoothstep(
        1 - freeze * 1.3,
        1.1 - freeze * 1.3,
        Math.abs(across) + noise * 0.3,
      ),
      smoothstep(0.82, 0.97, freeze + noise * 0.1),
    )
  );
}

function buildRiverSurface() {
  const rows = RIVER_PATH,
    count = rows.length;
  const dirX = new Float32Array(count),
    dirZ = new Float32Array(count);
  const positive = new Float32Array(count),
    negative = new Float32Array(count);
  for (let index = 0; index < count; index++) {
    const before = rows[Math.max(0, index - 1)];
    const after = rows[Math.min(count - 1, index + 1)];
    const dx = after.x - before.x,
      dz = after.z - before.z;
    const length = Math.hypot(dx, dz) || 1;
    dirX[index] = dx / length;
    dirZ[index] = dz / length;
    const row = rows[index];
    const baseWidth = riverHalfWidth(row.t) * 1.9 + 0.05;
    const width =
      row.seg < 1 ? sourceSurfaceHalfWidth(row.seg, baseWidth) : baseWidth;
    for (const sign of [1, -1]) {
      let bank = width;
      for (let distance = 0.02; distance < width; distance += 0.01) {
        if (
          terrainHeight(
            row.x - dirZ[index] * distance * sign,
            row.z + dirX[index] * distance * sign,
          ) >=
          row.y + 0.004
        ) {
          bank = Math.min(width, distance + 0.035);
          break;
        }
      }
      (sign > 0 ? positive : negative)[index] = bank;
    }
  }
  const smoothWidths = (widths) =>
    Float32Array.from(widths, (_, index) => {
      let sum = 0,
        samples = 0;
      for (let offset = -4; offset <= 4; offset++) {
        const row = index + offset;
        if (row >= 0 && row < count) {
          sum += widths[row];
          samples++;
        }
      }
      return sum / samples;
    });
  const left = smoothWidths(positive),
    right = smoothWidths(negative);
  let lipRow = 0,
    poolRow = 0;
  for (let index = 0; index < count; index++) {
    if (rows[index].seg <= FALL_LIP + 0.02) lipRow = index;
    if (!poolRow && rows[index].seg >= FALL_POOL - 0.02) poolRow = index;
  }
  const vertices = [],
    triangles = [],
    cells = new Map();
  for (const [first, last] of [
    [0, lipRow],
    [poolRow, count - 1],
  ]) {
    const start = vertices.length;
    for (let index = first; index <= last; index++) {
      const row = rows[index];
      for (let column = 0; column < RIVER_COLUMNS; column++) {
        const across = (column / (RIVER_COLUMNS - 1)) * 2 - 1;
        const bank = across >= 0 ? left[index] : right[index];
        const width =
          row.seg < 1 ? sourceSurfaceHalfWidth(row.seg, bank) : bank;
        vertices.push({
          x: Math.fround(row.x - dirZ[index] * across * width),
          y: Math.fround(row.y),
          z: Math.fround(row.z + dirX[index] * across * width),
          across: Math.fround(across),
          ellipse: Math.fround(lakeEllipse(row.x, row.z)),
          distance: Math.fround(row.s),
          spring: Math.fround(Math.min(1, row.s / 0.035)),
          segment: row.seg,
        });
      }
    }
    for (let row = 0; row < last - first; row++) {
      for (let column = 0; column < RIVER_COLUMNS - 1; column++) {
        const a = start + row * RIVER_COLUMNS + column,
          b = a + 1;
        const c = a + RIVER_COLUMNS,
          d = c + 1;
        triangles.push(
          [vertices[a], vertices[b], vertices[c]],
          [vertices[b], vertices[d], vertices[c]],
        );
      }
    }
  }
  for (const triangle of triangles) {
    const minX = Math.floor(Math.min(...triangle.map((v) => v.x)) / HASH_SIZE);
    const maxX = Math.floor(Math.max(...triangle.map((v) => v.x)) / HASH_SIZE);
    const minZ = Math.floor(Math.min(...triangle.map((v) => v.z)) / HASH_SIZE);
    const maxZ = Math.floor(Math.max(...triangle.map((v) => v.z)) / HASH_SIZE);
    for (let x = minX; x <= maxX; x++)
      for (let z = minZ; z <= maxZ; z++) {
        const key = `${x},${z}`;
        if (!cells.has(key)) cells.set(key, []);
        cells.get(key).push(triangle);
      }
  }
  return { cells, lipS: rows[lipRow].s, poolS: rows[poolRow].s };
}

function riverVertex(vertex, level, flow) {
  const rawY =
    vertex.y + (flow - 1) * 0.012 * smoothstep(1, 0.6, Math.abs(vertex.across));
  const blendedY = Math.max(
    level,
    lerp(rawY, level, smoothstep(1.35, 0.98, vertex.ellipse)),
  );
  return { y: vertex.ellipse < 1.5 ? blendedY + 0.0015 : rawY, blendedY };
}

/**
 * Return a visible horizontal water/ice surface, or null. groundY is the actual
 * navigable terrain including snow; terrainHeight in state samples the shader's
 * baked bed texture instead. Lake waves/ripples only lower the rendered surface,
 * so navigation deliberately follows its stable level, not individual troughs.
 * The waterfall sheet and decorative plunge-pool foam are never swim surfaces.
 */
function sampleNavigableWater(x, z, groundY, state = {}, out = {}) {
  if (![x, z, groundY].every(Number.isFinite)) return null;
  const value = (key, fallback) =>
    Number.isFinite(state[key]) ? state[key] : fallback;
  const level = value("level", 0.1),
    flow = value("flow", 1);
  const ice = value("ice", 0),
    temperature = value("iceTemp", 10),
    lapse = value("lapse", 5);
  const bed = (
    typeof state.terrainHeight === "function"
      ? state.terrainHeight
      : terrainHeight
  )(x, z);
  if (!Number.isFinite(bed)) return null;
  riverSurface ??= buildRiverSurface();
  const triangles =
    riverSurface.cells.get(
      `${Math.floor(x / HASH_SIZE)},${Math.floor(z / HASH_SIZE)}`,
    ) || [];
  let resultY = -Infinity,
    resultIce = 0;
  for (const [a, b, c] of triangles) {
    const denominator = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z);
    if (Math.abs(denominator) < 1e-14) continue;
    const wa =
      ((b.z - c.z) * (x - c.x) + (c.x - b.x) * (z - c.z)) / denominator;
    const wb =
      ((c.z - a.z) * (x - c.x) + (a.x - c.x) * (z - c.z)) / denominator;
    const wc = 1 - wa - wb;
    if (Math.min(wa, wb, wc) < -1e-7) continue;
    const interpolate = (key) => a[key] * wa + b[key] * wb + c[key] * wc;
    const segment = interpolate("segment");
    if (segment > FALL_LIP && segment < FALL_POOL) continue;
    const ay = riverVertex(a, level, flow),
      by = riverVertex(b, level, flow),
      cy = riverVertex(c, level, flow);
    const waterY = ay.y * wa + by.y * wb + cy.y * wc;
    if (waterY <= groundY || waterY <= resultY) continue;
    const blendedY = ay.blendedY * wa + by.blendedY * wb + cy.blendedY * wc;
    const distance = interpolate("distance"),
      across = interpolate("across");
    const lip =
      distance < riverSurface.poolS
        ? smoothstep(
            riverSurface.lipS + 0.005,
            riverSurface.lipS - 0.07,
            distance,
          )
        : 1;
    const coverage =
      smoothstep(level + 0.004, level + 0.02, blendedY) *
      (1 - smoothstep(0.7 - (1 - lip) * 0.4, 1, Math.abs(across))) *
      smoothstep(-0.004, 0.02, waterY - bed) *
      interpolate("spring") *
      lip;
    if (coverage < 0.004) continue;
    resultY = waterY;
    resultIce = riverIce(x, z, waterY, across, temperature, lapse);
  }
  if (Number.isFinite(resultY)) {
    Object.assign(out, {
      kind: "river",
      waterY: resultY,
      depth: resultY - groundY,
      iceCoverage: resultIce,
    });
    return out;
  }
  if (
    x < LAKE_BOUNDS.minX ||
    x > LAKE_BOUNDS.maxX ||
    z < LAKE_BOUNDS.minZ ||
    z > LAKE_BOUNDS.maxZ ||
    level <= groundY ||
    level - bed < -0.012
  )
    return null;
  // The lake shader relinquishes fully river-owned pixels. This is only its
  // ownership fade, never the old queryRiver.isWater navigation shortcut.
  const river = queryRiver(x, z);
  if (river) {
    const width = riverHalfWidth(river.t);
    const channel = 1 - smoothstep(width * 1.5, width * 2.1 + 0.08, river.dist);
    const y = Math.max(
      level,
      lerp(
        channel > 0 ? river.y : -10,
        level,
        smoothstep(1.35, 0.98, lakeEllipse(x, z)),
      ),
    );
    if (channel * smoothstep(level + 0.004, level + 0.02, y) > 0.995)
      return null;
  }
  Object.assign(out, {
    kind: "lake",
    waterY: level,
    depth: level - groundY,
    iceCoverage: lakeIce(x, z, level - bed, ice),
  });
  return out;
}

export { sampleNavigableWater };
