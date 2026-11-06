import {
  LANDSCAPE_BOUNDS,
  TERRARIUM_BOUNDS,
  WATER_LEVEL_CONFIG,
} from "../core/config.js";
import {
  createSeededRandom,
  createSimplexNoise,
  lerp,
  smoothstep,
} from "../core/math.js";
import { landmarkPlantClearance } from "../layout/world-layout.js";
import { farmClearance } from "../layout/farm-layout.js";
import {
  terrainHeight,
  terrainNormal,
  waterDistance,
} from "../simulation/terrain-shape.js";

const SUNFLOWER_SEED = 6022111;
const meadowNoise = createSimplexNoise(6022110);
const TAU = Math.PI * 2;
const MIN_SPACING = 0.055;
const CELL_SIZE = 0.1;
const SUNFLOWER_HEIGHT_SCALE = 0.72;
const SUNFLOWER_HEAD_SCALE = 0.65;

// A broad foreground sweep turns into a narrower strip beside the village.
// Sampled curves make one continuous meadow with rounded, uneven edges.
const ribbons = [
  {
    points: [
      [-5.25, 5.65],
      [-1.9, 6.45],
      [4.6, 6.55],
      [7.85, 5.45],
    ],
    width: [0.8, 1.1],
  },
  {
    points: [
      [7.85, 5.45],
      [8.45, 4.55],
      [7.1, 2.65],
      [7.45, 1.05],
    ],
    width: [1.1, 0.7],
  },
];
const ribbonSegments = ribbons.flatMap(({ points, width }) => {
  const samples = Array.from({ length: 33 }, (_, index) => {
    const t = index / 32;
    const v = 1 - t;
    return {
      x:
        v ** 3 * points[0][0] +
        3 * v * v * t * points[1][0] +
        3 * v * t * t * points[2][0] +
        t ** 3 * points[3][0],
      z:
        v ** 3 * points[0][1] +
        3 * v * v * t * points[1][1] +
        3 * v * t * t * points[2][1] +
        t ** 3 * points[3][1],
      width: lerp(width[0], width[1], smoothstep(0, 1, t)),
    };
  });
  return samples.slice(1).map((b, index) => ({ a: samples[index], b }));
});

function meadowDensity(x, z) {
  let normalizedDistance = Infinity;
  for (const { a, b } of ribbonSegments) {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const t = Math.max(
      0,
      Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)),
    );
    const distance = Math.hypot(x - a.x - dx * t, z - a.z - dz * t);
    normalizedDistance = Math.min(
      normalizedDistance,
      distance / lerp(a.width, b.width, t),
    );
  }
  const edgeNoise = meadowNoise.noise2(x * 1.35 + 4, z * 1.35 - 7);
  const edge = 1 - smoothstep(0.58, 1, normalizedDistance - edgeNoise * 0.13);
  const patch = smoothstep(-0.6, 0.55, meadowNoise.noise2(x * 0.65, z * 0.65));
  return edge * (0.64 + patch * 0.36) * smoothstep(-5.95, -5.4, x);
}

/**
 * Additive meadow data only; existing placement arrays are never mutated.
 * root: [x, terrainHeight + .002, z, random]
 * shape: [height, headRadius, windPhase, yaw]
 */
function generateSunflowerMeadow(count, plants = [], rocks = []) {
  if (!Number.isFinite(count) || count < 0)
    throw new RangeError("Sunflower count must be finite and nonnegative");
  const requested = Math.floor(count);
  const root = new Float32Array(requested * 4);
  const shape = new Float32Array(requested * 4);
  const random = createSeededRandom(SUNFLOWER_SEED);
  const cells = new Map();
  const normal = { x: 0, y: 1, z: 0 };
  let accepted = 0;
  let attempts = 0;
  let besideTown = 0;
  let front = 0;
  for (; accepted < requested && attempts < requested * 120; attempts++) {
    // The village end has less open ground between trees and doorways. Give
    // those gaps extra candidates so the sweep remains legible beside town.
    const x =
      random() < 0.28
        ? lerp(6.35, 9.65, random())
        : lerp(-5.95, 9.65, random());
    const z = lerp(0.45, 7.75, random());
    if (random() > meadowDensity(x, z)) continue;
    const height = lerp(0.22, 0.38, random());
    const headRadius = lerp(0.035, 0.055, random());
    // Reserve the flower head plus room for leaf spread and wind bending.
    const margin = headRadius + 0.06 + height * 0.55;
    if (
      (Math.abs(x) < TERRARIUM_BOUNDS.halfW + margin &&
        Math.abs(z) < TERRARIUM_BOUNDS.halfD + margin) ||
      Math.abs(x) > LANDSCAPE_BOUNDS.halfW - margin - 0.08 ||
      Math.abs(z) > LANDSCAPE_BOUNDS.halfD - margin - 0.08 ||
      landmarkPlantClearance(x, z) < margin ||
      waterDistance(x, z) < Math.max(0.18 + headRadius, margin)
    )
      continue;
    const y = terrainHeight(x, z);
    if (y < WATER_LEVEL_CONFIG.lakeLevel + WATER_LEVEL_CONFIG.maxRise + 0.025)
      continue;
    terrainNormal(x, z, normal);
    if (normal.y < 0.86 || random() > smoothstep(0.86, 0.97, normal.y))
      continue;
    if (
      plants.some(
        (plant) => Math.hypot(x - plant.x, z - plant.z) < plant.radius + margin,
      ) ||
      rocks.some(
        (rock) =>
          Math.hypot(x - rock.x, z - rock.z) <
          (rock.radius ?? rock.r ?? 0) * 1.25 + margin,
      )
    )
      continue;
    const cellX = Math.floor(x / CELL_SIZE);
    const cellZ = Math.floor(z / CELL_SIZE);
    let crowded = false;
    for (let dz = -1; dz <= 1 && !crowded; dz++) {
      for (let dx = -1; dx <= 1 && !crowded; dx++) {
        for (const index of cells.get(`${cellX + dx}:${cellZ + dz}`) ?? []) {
          if (
            Math.hypot(root[index * 4] - x, root[index * 4 + 2] - z) <
            MIN_SPACING
          ) {
            crowded = true;
            break;
          }
        }
      }
    }
    if (crowded) continue;
    const offset = accepted * 4;
    root.set([x, y + 0.002, z, random()], offset);
    shape.set(
      [
        height * SUNFLOWER_HEIGHT_SCALE,
        headRadius * SUNFLOWER_HEAD_SCALE,
        random() * TAU,
        0.25 + (random() - 0.5) * 1.1,
      ],
      offset,
    );
    const key = `${cellX}:${cellZ}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(accepted);
    accepted++;
    if (z < 4.4) besideTown++;
    else front++;
  }
  // The wheat field replaces part of this meadow. Clip existing heads
  // locally rather than filling the removed quota into the remaining flowerbed.
  let retained = 0;
  front = 0;
  besideTown = 0;
  for (let index = 0; index < accepted; index++) {
    const source = index * 4;
    const x = root[source];
    const z = root[source + 2];
    const clearance = farmClearance(x, z);
    if (root[source + 3] >= smoothstep(0.16, 0.32, clearance)) continue;
    const target = retained * 4;
    root.copyWithin(target, source, source + 4);
    shape.copyWithin(target, source, source + 4);
    retained++;
    if (z < 4.4) besideTown++;
    else front++;
  }
  return {
    root: root.subarray(0, retained * 4),
    shape: shape.subarray(0, retained * 4),
    count: retained,
    stats: {
      requested,
      attempts,
      seed: SUNFLOWER_SEED,
      front,
      besideTown,
      clearedForFarm: accepted - retained,
    },
  };
}

export {
  generateSunflowerMeadow,
  SUNFLOWER_HEIGHT_SCALE,
  SUNFLOWER_HEAD_SCALE,
};
