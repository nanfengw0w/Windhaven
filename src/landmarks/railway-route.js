// Arc-length sampling and hidden transit intervals for the open railway route.
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import {
  SCENE_SCALE,
  railwayPoint,
  railwayTangent,
} from "../layout/world-layout.js";

function buildRailwayRoute(town) {
  // Every route join falls on this grid, avoiding interpolation over a join.
  town.pathSegments = 3200;
  town.pathX = new Float64Array(town.pathSegments + 1);
  town.pathY = new Float64Array(town.pathSegments + 1);
  town.pathZ = new Float64Array(town.pathSegments + 1);
  town.pathArc = new Float64Array(town.pathSegments + 1);
  for (let i = 0; i <= town.pathSegments; i++) {
    const point = railwayPoint(i / town.pathSegments);
    town.pathX[i] = point.x;
    town.pathY[i] = point.y;
    town.pathZ[i] = point.z;
    if (i)
      town.pathArc[i] =
        town.pathArc[i - 1] +
        Math.hypot(
          point.x - town.pathX[i - 1],
          point.y - town.pathY[i - 1],
          point.z - town.pathZ[i - 1],
        );
  }
  town.pathLength = town.pathArc[town.pathSegments];
  town.startTangent = railwayTangent(0);
  town.endTangent = railwayTangent(1);
  // A conservative complete-car envelope defines the wholly clipped transit.
  // Acceleration is permitted only here, with a margin before reappearance.
  const point = {};
  let firstHidden = null,
    lastHidden = null;
  for (let distance = 0; distance < town.pathLength; distance += 0.04) {
    let hidden = true;
    for (let car = 0; car < 3; car++) {
      town.sampleTrack(distance - car * SCENE_SCALE.carSpacing, point);
      if (point.z <= LANDSCAPE_BOUNDS.halfD + 0.85) hidden = false;
    }
    if (hidden) {
      firstHidden ??= distance;
      lastHidden = distance;
    }
  }
  town.hiddenTransit =
    firstHidden === null
      ? null
      : {
          start: firstHidden + 0.1,
          end: lastHidden - 0.1,
          maxSpeed: 6,
        };
}

function sampleRailwayTrack(town, distance, out) {
  if (distance <= 0 || distance >= town.pathLength) {
    const atStart = distance <= 0;
    const index = atStart ? 0 : town.pathSegments;
    const direction = atStart ? town.startTangent : town.endTangent;
    const beyond = atStart ? distance : distance - town.pathLength;
    out.x = town.pathX[index] + direction.x * beyond;
    out.z = town.pathZ[index] + direction.z * beyond;
    out.y = town.pathY[index] + direction.y * beyond;
    out.yaw = Math.atan2(direction.x, direction.z);
    out.pitch = Math.atan2(direction.y, Math.hypot(direction.x, direction.z));
    out.t = atStart ? 0 : 1;
    return out;
  }
  let low = 0;
  let high = town.pathSegments;
  while (high - low > 1) {
    const middle = (low + high) >>> 1;
    if (town.pathArc[middle] <= distance) low = middle;
    else high = middle;
  }
  const blend =
    (distance - town.pathArc[low]) / (town.pathArc[high] - town.pathArc[low]);
  out.x = town.pathX[low] + (town.pathX[high] - town.pathX[low]) * blend;
  out.z = town.pathZ[low] + (town.pathZ[high] - town.pathZ[low]) * blend;
  out.y = town.pathY[low] + (town.pathY[high] - town.pathY[low]) * blend;
  out.yaw = Math.atan2(
    town.pathX[high] - town.pathX[low],
    town.pathZ[high] - town.pathZ[low],
  );
  out.pitch = Math.atan2(
    town.pathY[high] - town.pathY[low],
    Math.hypot(
      town.pathX[high] - town.pathX[low],
      town.pathZ[high] - town.pathZ[low],
    ),
  );
  out.t = (low + blend) / town.pathSegments;
  return out;
}

export { buildRailwayRoute, sampleRailwayTrack };
