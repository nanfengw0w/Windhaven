import { smoothstep, lerp } from "../core/math.js";
import { TERRARIUM_BOUNDS } from "../core/config.js";
import {
  ALPINE_PEAKS,
  WEST_MEADOW_RISE,
  leftRailwayTerrainSample,
} from "../layout/world-layout.js";

// A quiet collar protects both the original land and the finite-difference
// samples used for its normals. Sculpting begins beyond that collar.
function landscapeBlend(x, z) {
  const distance = Math.max(
    Math.abs(x) - TERRARIUM_BOUNDS.halfW,
    Math.abs(z) - TERRARIUM_BOUNDS.halfD,
  );
  return smoothstep(0.55, 1.6, distance);
}

function shapeLeftRailwayCut(x, z, height) {
  if (x >= -6.55 || z >= -2) return height;
  const track = leftRailwayTerrainSample(x, z);
  if (track.distance >= 0.85 || height <= track.y - 0.29) return height;
  // A narrow cutting clears the masonry bed. Its shoulders blend into the
  // meadow; even here the original land's 0.55 m collar stays untouched.
  const shoulder = 1 - smoothstep(0.25, 0.85, track.distance);
  const protectedEdge = smoothstep(6.55, 6.63, -x);
  const rearOnly = smoothstep(2, 2.35, -z);
  return lerp(height, track.y - 0.29, shoulder * protectedEdge * rearOnly);
}

function sculptLandscapeHeight(x, z, originalHeight, noise) {
  const blend = landscapeBlend(x, z);
  if (blend === 0) return originalHeight;
  let height = originalHeight;
  for (const peak of ALPINE_PEAKS) {
    const dx = (x - peak.x) / peak.radiusX;
    const dz = (z - peak.z) / peak.radiusZ;
    const angle = Math.atan2(dz, dx);
    // Uneven radial ridges, a sharp summit and softened foothills.
    const radius =
      Math.hypot(dx, dz) *
      (1 +
        0.13 * Math.sin(angle * 5 + peak.phase) +
        0.055 * Math.sin(angle * 9 - peak.phase));
    const cone = Math.max(0, 1 - radius);
    if (cone === 0) continue;
    const ridge = Math.pow(cone, 1.45);
    const detail = noise.ridged2(x * 1.25 + 18, z * 1.25 - 9, 3);
    const mountain =
      originalHeight +
      (peak.height - originalHeight) * ridge * (0.89 + 0.15 * detail);
    // Smooth max avoids a sharp skirt where the rock meets the meadow.
    const k = 0.2 * smoothstep(0, 0.15, cone);
    const h = Math.max(0, Math.min(1, 0.5 + (mountain - height) / (2 * k)));
    height = lerp(height, mountain, h) + k * h * (1 - h);
  }
  // Broad rear saddle connects the new massif to the existing mountain range.
  height += 0.42 * Math.exp(-(((x - 0.7) / 4.8) ** 2 + ((z + 6.2) / 1.3) ** 2));
  // A low wooded rise and shallow folds shape the western meadow.
  const meadowRadius = Math.hypot(
    (x - WEST_MEADOW_RISE.x) / 2.8,
    (z - WEST_MEADOW_RISE.z) / 3.5,
  );
  height += 0.38 * Math.exp(-meadowRadius * meadowRadius * 1.4);
  height +=
    0.13 * noise.noise2(x * 0.65 - 3, z * 0.65 + 1) * smoothstep(6.2, 8, -x);
  // The village follows the existing foothill; only broad, shallow meadow folds
  // are added. Houses adapt their own small foundations instead of leveling it.
  // The rear fade is zero before the tunnel mouth and all alpine peak slopes.
  const town =
    (1 - smoothstep(1.1, 2.25, Math.abs(x - 8.65))) *
    smoothstep(-2.45, -1.35, z) *
    (1 - smoothstep(3.25, 4.3, z));
  const meadowFolds =
    0.1 +
    0.095 * Math.sin(x * 1.35 + z * 0.66) +
    0.065 * Math.cos(z * 1.42 - x * 0.38) +
    0.045 * noise.noise2(x * 1.55 + 7, z * 1.55 - 11);
  height += town * meadowFolds;
  return shapeLeftRailwayCut(x, z, lerp(originalHeight, height, blend));
}

export { landscapeBlend, sculptLandscapeHeight, shapeLeftRailwayCut };
