// Projected size, not a region of the map, controls blade curvature detail.
const GRASS_LOD_THRESHOLDS = [11, 24];
const GRASS_LOD_HYSTERESIS = 0.2;

function grassLodLevels(maxSegments) {
  return maxSegments > 3 ? [2, 3, maxSegments] : [2, 3];
}

function selectGrassLodLevel(pixelHeight, currentLevel, levels) {
  let level = currentLevel;
  while (
    level < levels.length - 1 &&
    pixelHeight > GRASS_LOD_THRESHOLDS[level] * (1 + GRASS_LOD_HYSTERESIS)
  )
    level++;
  while (
    level > 0 &&
    pixelHeight < GRASS_LOD_THRESHOLDS[level - 1] * (1 - GRASS_LOD_HYSTERESIS)
  )
    level--;
  return level;
}

function projectedGrassHeight(sphere, bladeHeight, camera, bufferHeight) {
  const view = camera.matrixWorldInverse.elements;
  const center = sphere.center;
  const centerDepth = -(
    view[2] * center.x +
    view[6] * center.y +
    view[10] * center.z +
    view[14]
  );
  // The nearest point and tallest blade conservatively retain foreground detail.
  const nearestDepth = Math.max(camera.near, centerDepth - sphere.radius);
  const projectionScale = Math.abs(camera.projectionMatrix.elements[5]);
  return (bladeHeight * projectionScale * bufferHeight * 0.5) / nearestDepth;
}

export { grassLodLevels, projectedGrassHeight, selectGrassLodLevel };
