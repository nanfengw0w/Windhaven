import { CORE_FIELD_BOUNDS, FIELD_BOUNDS } from "./config.js";
import { createSeededRandom } from "./math.js";

// Keep weather density per world unit when the land grows.
const LANDSCAPE_AREA_SCALE =
  (FIELD_BOUNDS.sizeX * FIELD_BOUNDS.sizeZ) /
  (CORE_FIELD_BOUNDS.sizeX * CORE_FIELD_BOUNDS.sizeZ);

function landscapeWeatherPoints(count, seed = 23841) {
  const random = createSeededRandom(seed);
  const halfX = (FIELD_BOUNDS.sizeX + CORE_FIELD_BOUNDS.sizeX) * 0.25;
  const halfZ = (FIELD_BOUNDS.sizeZ + CORE_FIELD_BOUNDS.sizeZ) * 0.25;
  return Array.from({ length: count }, (_, index) => {
    const angle = ((index + 0.35) / count) * Math.PI * 2;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    const edge = Math.max(Math.abs(x), Math.abs(z));
    return {
      x: (x / edge) * halfX + (random() - 0.5) * 0.5,
      z: (z / edge) * halfZ + (random() - 0.5) * 0.5,
      seed: Math.floor(random() * 0x7fffffff),
    };
  });
}

export { LANDSCAPE_AREA_SCALE, landscapeWeatherPoints };
