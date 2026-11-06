import {
  createTownStation,
  townPlantClearance,
  getTownPaths,
} from "./town-layout.js";

// Shared geographical layout for terrain, vegetation and scene structures.
const WEST_MEADOW_RISE = Object.freeze({ x: -9, z: 0.3 });
const SCENE_SCALE = Object.freeze({
  cabinWidth: 0.7,
  cabinDepth: 0.5,
  cabinEaves: 0.375,
  cabinRidge: 0.375 + 0.25 * Math.tan((40 * Math.PI) / 180),
  doorHeight: 0.23,
  windowHeight: 0.12,
  trainWidth: 0.27,
  trainHeight: 0.4,
  engineLength: 1.05,
  coachLength: 1.2,
  carSpacing: 1.34,
  trackGauge: 0.17,
  sleeperWidth: 0.34,
});
const RAILWAY = Object.freeze({ y: 1.1, leftExitY: 1.55, open: true });
const RAILWAY_TUNNEL_SEGMENT = Object.freeze({
  start: Object.freeze({ x: 8.1, z: -5.75 }),
  end: Object.freeze({ x: 10.45, z: -1.5 }),
});
const route = [
  [
    [8.1, -5.75],
    [8.883333333333, -4.333333333333],
    [9.666666666667, -2.916666666667],
    [10.45, -1.5],
  ],
  [
    [10.45, -1.5],
    [10.875, -0.7313829787235],
    [11.05, 1.1061170212765],
    [10.675, 2.751462765957375],
  ],
  [
    [10.675, 2.751462765957375],
    [10.3, 4.39680851063825],
    [9.25, 7.3],
    [8.3, 9.3],
  ],
  // The connecting journey is entirely beyond the front map boundary.
  [
    [8.3, 9.3],
    [7.35, 11.3],
    [4.8, 12.5],
    [2.6, 12.5],
  ],
  [
    [2.6, 12.5],
    [-1, 12.5],
    [-6.85, 12.2],
    [-6.85, 8.7],
  ],
  // Keep a direct approach beside the woodland, then turn west once with a
  // broad 4.2-unit radius. No lateral detour or reverse curve in the meadow.
  [
    [-6.85, 8.7],
    [-6.85, 6.05],
    [-6.85, 3.4],
    [-6.85, 0.75],
  ],
  [
    [-6.85, 0.75],
    [-6.85, -1.569595949289],
    [-8.730404050711, -3.45],
    [-11.05, -3.45],
  ],
  [
    [-11.05, -3.45],
    [-12.7, -3.45],
    [-14.35, -3.45],
    [-16, -3.45],
  ],
];
const routeBreaks = [0, 0.17, 0.3, 0.43, 0.55, 0.7, 0.84, 0.93, 1];
const ALPINE_PEAKS = Object.freeze([
  { x: 8.1, z: -5.75, height: 7.6, radiusX: 3.05, radiusZ: 2.7, phase: 0.7 },
  { x: 4.9, z: -6.25, height: 5.1, radiusX: 2.3, radiusZ: 1.9, phase: 2.1 },
  { x: 10.45, z: -5.2, height: 4.6, radiusX: 1.5, radiusZ: 2.25, phase: 4 },
]);

function leftRailwayHeight(z) {
  const grade = Math.max(0, Math.min(1, (8.7 - z) / 12.15));
  return (
    RAILWAY.y +
    (RAILWAY.leftExitY - RAILWAY.y) * grade * grade * (3 - 2 * grade)
  );
}

function railwayPoint(t) {
  let index = 0;
  while (index < route.length - 1 && t > routeBreaks[index + 1]) index++;
  const u = Math.max(
    0,
    Math.min(
      1,
      (t - routeBreaks[index]) / (routeBreaks[index + 1] - routeBreaks[index]),
    ),
  );
  const v = 1 - u;
  const [a, b, c, d] = route[index];
  const point = {
    x:
      v * v * v * a[0] +
      3 * v * v * u * b[0] +
      3 * v * u * u * c[0] +
      u * u * u * d[0],
    y: RAILWAY.y,
    z:
      v * v * v * a[1] +
      3 * v * v * u * b[1] +
      3 * v * u * u * c[1] +
      u * u * u * d[1],
  };
  if (index >= 5) {
    point.y = leftRailwayHeight(point.z);
  }
  return point;
}

function railwayTangent(t) {
  let index = 0;
  while (index < route.length - 1 && t > routeBreaks[index + 1]) index++;
  const u = Math.max(
    0,
    Math.min(
      1,
      (t - routeBreaks[index]) / (routeBreaks[index + 1] - routeBreaks[index]),
    ),
  );
  const v = 1 - u;
  const [a, b, c, d] = route[index];
  const x =
    3 * v * v * (b[0] - a[0]) +
    6 * v * u * (c[0] - b[0]) +
    3 * u * u * (d[0] - c[0]);
  const z =
    3 * v * v * (b[1] - a[1]) +
    6 * v * u * (c[1] - b[1]) +
    3 * u * u * (d[1] - c[1]);
  const grade = Math.max(0, Math.min(1, (8.7 - railwayPoint(t).z) / 12.15));
  const y =
    index < 5
      ? 0
      : ((-z * (RAILWAY.leftExitY - RAILWAY.y)) / 12.15) *
        6 *
        grade *
        (1 - grade);
  const length = Math.hypot(x, y, z);
  return { x: x / length, y: y / length, z: z / length };
}

function distanceToSegmentSquared(x, z, a, b) {
  const dx = b.x - a.x,
    dz = b.z - a.z;
  const u = Math.max(
    0,
    Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)),
  );
  return (x - a.x - u * dx) ** 2 + (z - a.z - u * dz) ** 2;
}
const routeSections = [];
for (let segment = 0; segment < route.length; segment++) {
  // Sample the broad turn for terrain cuts and vegetation clearance; the
  // tunnel approach, left approach and final westbound exit are straight.
  const count = [0, 5, route.length - 1].includes(segment) ? 1 : 48;
  const section = {
    edges: [],
    minX: Infinity,
    maxX: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity,
  };
  let previous = railwayPoint(routeBreaks[segment]);
  const include = (point) => {
    section.minX = Math.min(section.minX, point.x);
    section.maxX = Math.max(section.maxX, point.x);
    section.minZ = Math.min(section.minZ, point.z);
    section.maxZ = Math.max(section.maxZ, point.z);
  };
  include(previous);
  for (let index = 1; index <= count; index++) {
    const next = railwayPoint(
      routeBreaks[segment] +
        ((routeBreaks[segment + 1] - routeBreaks[segment]) * index) / count,
    );
    section.edges.push([previous, next]);
    include(next);
    previous = next;
  }
  routeSections.push(section);
}
function railwayRouteDistance(x, z) {
  let distance = Infinity;
  for (const section of routeSections) {
    const dx = Math.max(section.minX - x, 0, x - section.maxX);
    const dz = Math.max(section.minZ - z, 0, z - section.maxZ);
    if (dx * dx + dz * dz >= distance) continue;
    for (const [a, b] of section.edges)
      distance = Math.min(distance, distanceToSegmentSquared(x, z, a, b));
  }
  return Math.sqrt(distance);
}

// Restricted terrain query: reuse only the left-side sections, excluding
// the hidden connector and the preserved town/mountain approach.
function leftRailwayTerrainSample(x, z) {
  let distanceSquared = Infinity,
    nearestZ = z;
  for (let index = 5; index < routeSections.length; index++) {
    const section = routeSections[index];
    const dx = Math.max(section.minX - x, 0, x - section.maxX);
    const dz = Math.max(section.minZ - z, 0, z - section.maxZ);
    if (dx * dx + dz * dz >= distanceSquared) continue;
    for (const [a, b] of section.edges) {
      const ex = b.x - a.x,
        ez = b.z - a.z;
      const u = Math.max(
        0,
        Math.min(1, ((x - a.x) * ex + (z - a.z) * ez) / (ex * ex + ez * ez)),
      );
      const px = a.x + ex * u,
        pz = a.z + ez * u;
      const candidate = (x - px) ** 2 + (z - pz) ** 2;
      if (candidate < distanceSquared) {
        distanceSquared = candidate;
        nearestZ = pz;
      }
    }
  }
  return {
    distance: Math.sqrt(distanceSquared),
    y: leftRailwayHeight(nearestZ),
  };
}

const townStation = createTownStation(railwayPoint, railwayTangent);
const TOWN_PATHS = getTownPaths(townStation);

// Live vegetation reserves space for the railway and town.
function landmarkPlantClearance(x, z) {
  const rail = railwayRouteDistance(x, z) - 0.26;
  return Math.min(rail, townPlantClearance(x, z, townStation));
}

export {
  TOWN_PATHS,
  ALPINE_PEAKS,
  RAILWAY,
  RAILWAY_TUNNEL_SEGMENT,
  SCENE_SCALE,
  WEST_MEADOW_RISE,
  landmarkPlantClearance,
  leftRailwayHeight,
  leftRailwayTerrainSample,
  railwayPoint,
  railwayRouteDistance,
  railwayTangent,
};
