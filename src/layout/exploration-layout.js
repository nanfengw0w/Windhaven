import { SCENE_SCALE, railwayPoint, railwayTangent } from "./world-layout.js";
import { TOWN_HOUSES, TOWN_TOWER, createTownStation } from "./town-layout.js";
import { buildingModelLayout } from "./building-model-layout.js";
import { FARM } from "./farm-layout.js";
import { WOODWORKING_YARD } from "./woodworking-layout.js";
import { HIKING_TRAIL } from "./hiking-layout.js";
import { MOUNTAIN_RUINS } from "./mountain-ruins-layout.js";

// Rounded outward from assets/imported-models/manifest.json bounds. These
// include roof overhangs and both the imported and procedural fallback walls.
// Building interiors are deliberately outside the walking area.
const EXPLORATION_MODEL_BOUNDS = Object.freeze({
  cottage: [8.01, 8.12],
  station: [12.01, 9.63],
  clocktower: [3.65, 4.08],
  "house-long": [0.301, 0.179],
  "house-inn": [0.44, 0.349],
  "house-tall": [0.25, 0.283],
});

function createExplorationObstacles(cabin) {
  const obstacles = [];
  const rectangle = (id, item, width = item.width, depth = item.depth) => {
    const yaw = item.yaw ?? item.rot ?? 0;
    obstacles.push({
      id,
      kind: "rectangle",
      x: item.x,
      z: item.z,
      yaw,
      cos: Math.cos(yaw),
      sin: Math.sin(yaw),
      width,
      depth,
    });
  };
  const circle = (id, item, radius = item.radius) =>
    obstacles.push({ id, kind: "circle", x: item.x, z: item.z, radius });
  const building = (id, item, modelId) => {
    const model = buildingModelLayout(modelId);
    const bounds = EXPLORATION_MODEL_BOUNDS[modelId];
    rectangle(
      id,
      item,
      Math.max(item.width, model.supportWidth, bounds[0] * model.scale) + 0.02,
      Math.max(item.depth, model.supportDepth, bounds[1] * model.scale) + 0.02,
    );
  };
  rectangle(
    "cabin",
    cabin,
    SCENE_SCALE.cabinWidth + 0.12,
    SCENE_SCALE.cabinDepth + 0.12,
  );
  // The external stone chimney projects beyond the left wall. Its brick
  // courses include small randomized offsets, covered by this fixed margin.
  rectangle(
    "cabin-chimney",
    {
      x: cabin.x - Math.cos(cabin.rot) * 0.45,
      z: cabin.z + Math.sin(cabin.rot) * 0.45,
      yaw: cabin.rot,
    },
    0.22,
    0.23,
  );
  TOWN_HOUSES.forEach((house, index) =>
    building(`town-house-${index}`, house, house.modelId),
  );
  building(
    "station",
    createTownStation(railwayPoint, railwayTangent),
    "station",
  );
  building("clocktower", TOWN_TOWER, "clocktower");
  rectangle(
    "farm-shelter",
    FARM.shelter,
    FARM.shelter.width + 0.04,
    FARM.shelter.depth + 0.04,
  );
  FARM.hay.forEach((bale, index) => circle(`hay-${index}`, bale));
  circle("scarecrow", FARM.scarecrow);
  const yard = WOODWORKING_YARD;
  rectangle(
    "woodworking-shelter",
    yard.shelter,
    yard.shelter.width + 0.04,
    yard.shelter.depth + 0.04,
  );
  circle("woodworking-logs", yard.logPile, 0.55);
  rectangle(
    "woodworking-cart",
    {
      ...yard.cart,
      x: yard.cart.x + Math.sin(yard.cart.yaw) * 0.3,
      z: yard.cart.z + Math.cos(yard.cart.yaw) * 0.3,
    },
    0.62,
    1.24,
  );
  yard.stumps.forEach((stump, index) =>
    circle(`woodworking-stump-${index}`, stump),
  );
  const hiking = HIKING_TRAIL;
  rectangle(
    "hiking-shelter",
    hiking.shelter,
    hiking.shelter.width + 0.04,
    hiking.shelter.depth + 0.04,
  );
  hiking.benches.forEach((bench, index) =>
    rectangle(`hiking-bench-${index}`, bench, bench.width + 0.04, 0.12),
  );
  hiking.signs.forEach((sign, index) =>
    circle(`hiking-sign-${index}`, sign, 0.025),
  );
  rectangle(
    "mountain-ruins",
    MOUNTAIN_RUINS,
    MOUNTAIN_RUINS.width + 0.16,
    1.12,
  );
  return obstacles;
}

function explorationObstacleDistance(x, z, obstacle) {
  const dx = x - obstacle.x;
  const dz = z - obstacle.z;
  if (obstacle.kind === "circle") return Math.hypot(dx, dz) - obstacle.radius;
  const qx =
    Math.abs(obstacle.cos * dx - obstacle.sin * dz) - obstacle.width / 2;
  const qz =
    Math.abs(obstacle.sin * dx + obstacle.cos * dz) - obstacle.depth / 2;
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0)
  );
}

export { createExplorationObstacles, explorationObstacleDistance };
