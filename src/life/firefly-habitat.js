import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
import { createSeededRandom, smoothstep } from "../core/math.js";
import { landmarkPlantClearance } from "../layout/world-layout.js";
import { waterDistance } from "../simulation/terrain-shape.js";

// Keep the entire wind-driven orbit inside a suitable patch of meadow.
const FIREFLY_DRIFT_RADIUS = 0.4;
const FIREFLY_HABITAT_MARGIN = FIREFLY_DRIFT_RADIUS + 0.08;
// The outer meadows rise above the original basin; admit their low terraces,
// while remaining below the grassy slope limit and permanent alpine snow.
const FIREFLY_MAX_GROUND_HEIGHT = 2.2;

function fireflyHabitatScore(terrain, x, z, rocks = []) {
  if (
    Math.abs(x) > LANDSCAPE_BOUNDS.halfW - FIREFLY_HABITAT_MARGIN ||
    Math.abs(z) > LANDSCAPE_BOUNDS.halfD - FIREFLY_HABITAT_MARGIN ||
    landmarkPlantClearance(x, z) < FIREFLY_HABITAT_MARGIN ||
    waterDistance(x, z) < FIREFLY_HABITAT_MARGIN + 0.05
  )
    return 0;
  for (const rock of rocks) {
    const radius = rock.r ?? rock.radius;
    if (
      Math.hypot(x - rock.x, z - rock.z) <
      radius * 1.15 + FIREFLY_HABITAT_MARGIN
    )
      return 0;
  }
  let score = 1;
  // The centre plus eight points around its orbit excludes steep rocks and
  // alpine ground without running collision work for every particle/frame.
  for (let index = -1; index < 8; index++) {
    const angle = (index / 8) * Math.PI * 2;
    const radius = index < 0 ? 0 : FIREFLY_DRIFT_RADIUS;
    const px = x + Math.cos(angle) * radius;
    const pz = z + Math.sin(angle) * radius;
    const height = terrain.height(px, pz);
    if (height > FIREFLY_MAX_GROUND_HEIGHT) return 0;
    score = Math.min(
      score,
      smoothstep(0.3, 0.1, terrain.slope(px, pz)) *
        smoothstep(FIREFLY_MAX_GROUND_HEIGHT, 0.7, height),
    );
  }
  return score;
}

function createExtendedFireflies(ctx, count) {
  const random = createSeededRandom(818181);
  const rocks = [
    ...(ctx.modules.terrain?.rocks ?? []),
    ...(ctx.modules.landscapeVegetation?.rocks ?? []),
  ];
  const cells = [];
  const cellSize = 1.2;
  const columns = Math.ceil((LANDSCAPE_BOUNDS.halfW * 2) / cellSize);
  const rows = Math.ceil((LANDSCAPE_BOUNDS.halfD * 2) / cellSize);
  const width = (LANDSCAPE_BOUNDS.halfW * 2) / columns;
  const depth = (LANDSCAPE_BOUNDS.halfD * 2) / rows;
  const candidate = (cell) => {
    const x = cell.x + random() * width;
    const z = cell.z + random() * depth;
    if (
      Math.abs(x) <= TERRARIUM_BOUNDS.halfW &&
      Math.abs(z) <= TERRARIUM_BOUNDS.halfD
    )
      return null;
    const score = fireflyHabitatScore(ctx.terrain, x, z, rocks);
    return score > 0.08 && random() < score ? { x, z } : null;
  };
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const cell = {
        x: -LANDSCAPE_BOUNDS.halfW + column * width,
        z: -LANDSCAPE_BOUNDS.halfD + row * depth,
      };
      for (let attempt = 0; attempt < 24; attempt++) {
        const point = candidate(cell);
        if (point) {
          cells.push({ ...cell, point });
          break;
        }
      }
    }
  }
  // Cycle through shuffled suitable cells so every quality covers the land,
  // instead of spending its entire particle budget in one favourable corner.
  for (let index = cells.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [cells[index], cells[other]] = [cells[other], cells[index]];
  }
  const actualCount = cells.length ? count : 0;
  const homes = new Float32Array(actualCount * 4);
  const seeds = new Float32Array(actualCount * 4);
  for (let index = 0; index < actualCount; index++) {
    const cell = cells[index % cells.length];
    let point = cell.point;
    if (index >= cells.length) {
      for (let attempt = 0; attempt < 12; attempt++) {
        const next = candidate(cell);
        if (next) {
          point = next;
          break;
        }
      }
    }
    const ground = ctx.terrain.height(point.x, point.z);
    homes.set(
      [point.x, ground + 0.05 + random() * random() * 0.55, point.z, 0],
      index * 4,
    );
    seeds.set([random(), random(), random(), random()], index * 4);
  }
  return { homes, seeds, count: actualCount, habitatCells: cells.length };
}

export {
  FIREFLY_DRIFT_RADIUS,
  FIREFLY_HABITAT_MARGIN,
  FIREFLY_MAX_GROUND_HEIGHT,
  createExtendedFireflies,
  fireflyHabitatScore,
};
