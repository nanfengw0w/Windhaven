import { terrainHeight } from "../simulation/terrain-shape.js";
import { PLANT_SPECIES_CODES } from "./tree-placement.js";

// Fixed independent additions: never consume the historical forest RNG or
// reshuffle existing trees, rocks, flowers, or the original terrain surface.
const WILLOW_PLACEMENTS = [
  { x: 1.4, z: 4.6, height: 1.85, radius: 0.73, seed: 883301 },
  { x: 5, z: 4.4, height: 1.7, radius: 0.68, seed: 883302 },
];

function createWillowPlants(ctx) {
  return WILLOW_PLACEMENTS.map((placement) => {
    const y = terrainHeight(placement.x, placement.z) - 0.016;
    return {
      ...placement,
      y,
      code: PLANT_SPECIES_CODES.oak,
      kind: "broad",
      species: "willow",
      lean: placement.seed * 0.017,
      canopyY: y + placement.height * 0.62,
      pickRadius: placement.radius + 0.16,
      strandsPerBranch: ctx.quality.pick(6, 8, 10),
    };
  });
}

export { WILLOW_PLACEMENTS, createWillowPlants };
