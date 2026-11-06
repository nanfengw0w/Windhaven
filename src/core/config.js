// Reconstructed module: identifiers and file boundaries are refactor choices.
const TERRARIUM_BOUNDS = {
  halfW: 6,
  halfD: 4,
  bottomY: -1.8,
  topY: 7.4,
};
// The original land remains the fixed core; new terrain is added around it.
const LANDSCAPE_BOUNDS = {
  halfW: 12,
  halfD: 8,
  bottomY: TERRARIUM_BOUNDS.bottomY,
  topY: 12,
};
const CORE_FIELD_BOUNDS = {
  minX: -TERRARIUM_BOUNDS.halfW,
  minZ: -TERRARIUM_BOUNDS.halfD,
  sizeX: TERRARIUM_BOUNDS.halfW * 2,
  sizeZ: TERRARIUM_BOUNDS.halfD * 2,
};
const FIELD_BOUNDS = {
  minX: -LANDSCAPE_BOUNDS.halfW,
  minZ: -LANDSCAPE_BOUNDS.halfD,
  sizeX: LANDSCAPE_BOUNDS.halfW * 2,
  sizeZ: LANDSCAPE_BOUNDS.halfD * 2,
};
// Display lift only: precipitation maps this added space back to its original
// climate height without changing the world's lapse rate or ground climate.
const CLOUD_VISUAL_HEIGHT_OFFSET = 0.75;
const CLOUD_LAYER_HEIGHTS = {
  minY: 4.5 + CLOUD_VISUAL_HEIGHT_OFFSET,
  maxY: 6.5 + CLOUD_VISUAL_HEIGHT_OFFSET,
  defaultY: 5.5 + CLOUD_VISUAL_HEIGHT_OFFSET,
  // The glass shell is gone, so nothing should visibly cap the clouds: this is
  // now only a high safety net that normal and merged clouds never reach.
  ceilingY: 10.45 + CLOUD_VISUAL_HEIGHT_OFFSET,
};
const WATER_LEVEL_CONFIG = {
  lakeLevel: 0.1,
  maxRise: 0.28,
};
const CELESTIAL_ORBIT = {
  // Display orbit behind the taller landscape; lighting still uses sunDir/moonDir.
  radius: 8.5,
  center: [0, 5, -9.5],
  yaw: -0.55,
};
function rotateCelestialDirection(r) {
  const t = Math.cos(CELESTIAL_ORBIT.yaw),
    e = Math.sin(CELESTIAL_ORBIT.yaw),
    i = r.x * t + r.z * e;
  return ((r.z = -r.x * e + r.z * t), (r.x = i), r);
}
const TEMPERATURE_CONFIG = {
  lapse: 5,
  seasonBase: [12, 24, 10, -7],
  dayNightSwing: 4.5,
};
const TOOL_NAMES = ["hand", "wind", "cloud", "fog"];
export {
  CELESTIAL_ORBIT,
  CLOUD_LAYER_HEIGHTS,
  CLOUD_VISUAL_HEIGHT_OFFSET,
  CORE_FIELD_BOUNDS,
  FIELD_BOUNDS,
  LANDSCAPE_BOUNDS,
  TEMPERATURE_CONFIG,
  TERRARIUM_BOUNDS,
  TOOL_NAMES,
  WATER_LEVEL_CONFIG,
  rotateCelestialDirection,
};
