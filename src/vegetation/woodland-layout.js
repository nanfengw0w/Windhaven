import {
  LANDSCAPE_BOUNDS,
  TERRARIUM_BOUNDS,
  WATER_LEVEL_CONFIG,
} from "../core/config.js";
import { createSeededRandom, lerp, smoothstep } from "../core/math.js";
import { landmarkPlantClearance } from "../layout/world-layout.js";
import { farmClearance } from "../layout/farm-layout.js";
import { woodlandYardClearance } from "../layout/woodworking-layout.js";
import { hikingTrailClearance } from "../layout/hiking-layout.js";
import {
  ruinFootprintClearance,
  ruinPathDistance,
} from "../layout/mountain-ruins-layout.js";
import {
  terrainHeight,
  terrainNormal,
  waterDistance,
} from "../simulation/terrain-shape.js";
import {
  PLANT_SPECIES_CODES,
  vegetationPlacementNoise,
} from "./tree-placement.js";

const WOODLAND_BUDGETS = {
  low: { plants: 55, rocks: 50 },
  medium: { plants: 90, rocks: 80 },
  high: { plants: 115, rocks: 100 },
};

// Pines frame the rear foothills; broadleaf groves leave the foreground meadow
// open and soften the western rise and village edge. No retired-object reserves.
const WOODLAND_GROVES = [
  { x: -9, z: -5.4, radius: 2.2, pine: true },
  { x: -1.4, z: -6.6, radius: 1.7, pine: true },
  { x: 7.5, z: -5.4, radius: 2.3, pine: true },
  { x: -9, z: 0.9, radius: 2.5, pine: false },
  { x: 9.1, z: 1.4, radius: 2.1, pine: false },
  { x: -7.8, z: 5.6, radius: 1.6, pine: false },
  { x: 8.2, z: 5.6, radius: 1.7, pine: false },
];

function inWoodlandBounds(x, z, margin) {
  return (
    (Math.abs(x) > TERRARIUM_BOUNDS.halfW + margin ||
      Math.abs(z) > TERRARIUM_BOUNDS.halfD + margin) &&
    Math.abs(x) < LANDSCAPE_BOUNDS.halfW - margin - 0.08 &&
    Math.abs(z) < LANDSCAPE_BOUNDS.halfD - margin - 0.08
  );
}

function generateWoodlandPlants(count) {
  const random = createSeededRandom(6022101);
  const plants = [];
  for (
    let attempt = 0;
    plants.length < count && attempt < count * 150;
    attempt++
  ) {
    const grove =
      WOODLAND_GROVES[Math.floor(random() * WOODLAND_GROVES.length)];
    const angle = random() * Math.PI * 2;
    const distance = grove.radius * Math.sqrt(random());
    const x = grove.x + Math.cos(angle) * distance;
    const z = grove.z + Math.sin(angle) * distance;
    const shrub = random() < 0.3;
    const code = shrub
      ? grove.pine
        ? PLANT_SPECIES_CODES.evergreen
        : PLANT_SPECIES_CODES.bush
      : grove.pine
        ? PLANT_SPECIES_CODES.pine
        : random() < 0.58
          ? PLANT_SPECIES_CODES.birch
          : PLANT_SPECIES_CODES.oak;
    const height = shrub
      ? lerp(0.18, 0.36, random())
      : grove.pine
        ? lerp(0.95, 1.65, random())
        : lerp(0.8, 1.3, random());
    const radius =
      height * (shrub ? 0.85 : code === PLANT_SPECIES_CODES.oak ? 0.46 : 0.28);
    if (
      !inWoodlandBounds(x, z, radius + 0.25) ||
      landmarkPlantClearance(x, z) < radius + 0.12 ||
      waterDistance(x, z) < radius + 0.18
    )
      continue;
    const y = terrainHeight(x, z);
    if (
      terrainNormal(x, z).y < (grove.pine ? 0.78 : 0.92) ||
      y < WATER_LEVEL_CONFIG.lakeLevel + 0.05 ||
      y > (grove.pine ? 3.1 : 2) ||
      plants.some(
        (plant) =>
          Math.hypot(plant.x - x, plant.z - z) < (plant.radius + radius) * 0.9,
      )
    )
      continue;
    plants.push({
      x,
      y: y - 0.018,
      z,
      height,
      radius,
      code,
      kind: shrub ? "bush" : grove.pine ? "pine" : "broad",
      seed: Math.floor(random() * 1e9),
      lean: random() * Math.PI * 2,
      canopyY: y + height * (grove.pine ? 0.5 : 0.65),
    });
  }
  return plants;
}

function generateWoodlandRocks(count, plants) {
  const random = createSeededRandom(6022102);
  const rocks = [];
  for (
    let attempt = 0;
    rocks.length < count && attempt < count * 100;
    attempt++
  ) {
    const x = lerp(-LANDSCAPE_BOUNDS.halfW, LANDSCAPE_BOUNDS.halfW, random());
    const z = lerp(-LANDSCAPE_BOUNDS.halfD, LANDSCAPE_BOUNDS.halfD, random());
    if (!inWoodlandBounds(x, z, 0.25)) continue;
    const normalY = terrainNormal(x, z).y;
    // Small stones belong on slopes; larger boulders need gentler foothills.
    // Keep the sheer mountain faces clear instead of hanging rocks on them.
    if (normalY < 0.65) continue;
    const maxRadius = lerp(0.17, 0.34, smoothstep(0.65, 0.95, normalY));
    const radius = lerp(0.09, maxRadius, random() ** 2);
    const y = terrainHeight(x, z);
    const patch = vegetationPlacementNoise.noise2(x * 0.55 - 2, z * 0.55 + 5);
    if (
      !inWoodlandBounds(x, z, radius * 1.5 + 0.1) ||
      landmarkPlantClearance(x, z) < radius + 0.08 ||
      waterDistance(x, z) < radius + 0.06 ||
      y < WATER_LEVEL_CONFIG.lakeLevel + 0.04 ||
      random() > 0.3 + Math.max(0, patch) * 0.65 ||
      plants.some(
        (plant) =>
          Math.hypot(plant.x - x, plant.z - z) < plant.radius * 0.55 + radius,
      ) ||
      rocks.some(
        (rock) => Math.hypot(rock.x - x, rock.z - z) < rock.radius + radius,
      )
    )
      continue;
    rocks.push({
      x,
      y,
      z,
      radius,
      seed: random(),
      yaw: random() * Math.PI * 2,
      variant: Math.floor(random() * 4),
    });
  }
  return rocks;
}

function createWoodlandLayout(quality) {
  const budget = WOODLAND_BUDGETS[quality];
  if (!budget) throw new Error(`Unknown woodland quality: ${quality}`);
  // All tiers share one generated layout: more detail adds objects without
  // moving existing ones. Each call owns fresh records for tree interactions.
  const plants = generateWoodlandPlants(WOODLAND_BUDGETS.high.plants);
  const rocks = generateWoodlandRocks(WOODLAND_BUDGETS.high.rocks, plants);
  // Clear the wheat field after sampling, so a local land-use change does
  // not move the established trees and stones elsewhere or refill lower tiers.
  const outsideFarm = ({ x, z, radius }) => farmClearance(x, z) > radius + 0.12;
  const outsideWoodworkingYard = ({ x, z, radius }) =>
    woodlandYardClearance(x, z) > radius + 0.1;
  const outsideHikingTrail = ({ x, z, radius }) =>
    hikingTrailClearance(x, z) > radius + 0.06;
  // Choose from the low-tier, already-clear tree positions so these landmarks
  // remain present at every quality. Replacement never expands a clearance
  // envelope, and occurs after rock sampling to keep the surrounding layout.
  const varietyCandidates = plants
    .slice(0, WOODLAND_BUDGETS.low.plants)
    .filter(outsideFarm)
    .filter(outsideWoodworkingYard)
    .filter(outsideHikingTrail);
  for (const variety of [
    {
      x: -7.8,
      z: 4.8,
      from: PLANT_SPECIES_CODES.oak,
      code: PLANT_SPECIES_CODES.apple,
    },
    {
      x: 7.8,
      z: 5.3,
      from: PLANT_SPECIES_CODES.oak,
      code: PLANT_SPECIES_CODES.apple,
    },
    {
      x: -8.5,
      z: 0.4,
      from: PLANT_SPECIES_CODES.birch,
      code: PLANT_SPECIES_CODES.plum,
    },
    {
      x: 7.1,
      z: 1.2,
      from: PLANT_SPECIES_CODES.birch,
      code: PLANT_SPECIES_CODES.plum,
    },
  ]) {
    const tree = varietyCandidates
      .filter((plant) => plant.code === variety.from)
      .sort(
        (a, b) =>
          Math.hypot(a.x - variety.x, a.z - variety.z) -
          Math.hypot(b.x - variety.x, b.z - variety.z),
      )[0];
    if (!tree) continue;
    const apple = variety.code === PLANT_SPECIES_CODES.apple;
    tree.code = variety.code;
    tree.kind = apple ? "broad" : "blossom";
    tree.height = Math.min(tree.height, apple ? 1.02 : 0.82);
    tree.radius = Math.min(tree.radius, apple ? 0.46 : 0.38);
    tree.canopyY = tree.y + tree.height * 0.65;
  }
  const groundcoverObstacles = {
    plants: plants
      .slice(0, budget.plants)
      .filter(outsideFarm)
      .filter(outsideWoodworkingYard)
      .filter(outsideHikingTrail),
    rocks: rocks
      .slice(0, budget.rocks)
      .filter(outsideFarm)
      .filter(outsideWoodworkingYard)
      .filter(outsideHikingTrail),
  };
  const outsideRuins = ({ x, z, radius }) =>
    ruinFootprintClearance(x, z) > radius + 0.06 &&
    ruinPathDistance(x, z) > radius + 0.12;
  // 地被仍使用原抽样障碍物，之后再局部裁草，防止移走一块石头改变全图随机序列。
  return {
    plants: groundcoverObstacles.plants.filter(outsideRuins),
    rocks: groundcoverObstacles.rocks.filter(outsideRuins),
    groundcoverObstacles,
  };
}

export { createWoodlandLayout };
