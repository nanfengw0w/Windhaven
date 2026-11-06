import { lerp, smoothstep } from "../core/math.js";

// A small seep in the mountain feeds the existing upper reach. Keep the river
// control-point count and arc length: the fall and downstream crossing use them.
const sourceReachLength = Math.hypot(0.25, 0.63);
const RIVER_SOURCE = Object.freeze({
  x: -1.8,
  z: -2.35,
  y: 2.2,
  dirX: 0.25 / sourceReachLength,
  dirZ: 0.63 / sourceReachLength,
  length: sourceReachLength,
});

function sourcePoint(across, along) {
  return {
    x: RIVER_SOURCE.x - RIVER_SOURCE.dirZ * across + RIVER_SOURCE.dirX * along,
    z: RIVER_SOURCE.z + RIVER_SOURCE.dirX * across + RIVER_SOURCE.dirZ * along,
  };
}

function sourceHalfWidth(progress) {
  const t = Math.max(0, Math.min(1, progress));
  // Narrow at the rock cleft, a modest gathering hollow, then the spillway.
  return 0.055 + Math.sin(Math.PI * t) ** 1.2 * 0.095 + 0.055 * t;
}

function sourceWaterHeight(progress) {
  const t = Math.max(0, Math.min(1, progress));
  return lerp(RIVER_SOURCE.y, 2.02, t * t * t);
}

function sourceSurfaceHalfWidth(progress, bankHalfWidth) {
  const springWidth = Math.min(
    bankHalfWidth,
    sourceHalfWidth(progress) * 1.35 + 0.02,
  );
  return lerp(springWidth, bankHalfWidth, smoothstep(0.78, 1, progress));
}

function shapeRiverSourceBanks(x, z, height, river) {
  const dx = x - RIVER_SOURCE.x,
    dz = z - RIVER_SOURCE.z;
  if (Math.abs(dx) > 0.9 || Math.abs(dz) > 1) return height;
  const along = dx * RIVER_SOURCE.dirX + dz * RIVER_SOURCE.dirZ;
  if (along < -0.28 || along > RIVER_SOURCE.length) return height;
  const reach =
    smoothstep(-0.28, -0.08, along) *
    (1 - smoothstep(0.48, RIVER_SOURCE.length, along));
  const width = sourceHalfWidth(river.seg);
  const shore = smoothstep(width * 0.65, width * 1.45, river.dist);
  const bank = river.y - 0.07 + shore * 0.14;
  const blend =
    reach * (1 - smoothstep(width + 0.09, width + 0.26, river.dist));
  // Raise the low shoulders as well as cut the shallow bed, so the water is
  // contained by actual terrain rather than a blue surface laid on the slope.
  return lerp(height, bank, blend);
}

export {
  RIVER_SOURCE,
  sourcePoint,
  sourceHalfWidth,
  sourceWaterHeight,
  sourceSurfaceHalfWidth,
  shapeRiverSourceBanks,
};
