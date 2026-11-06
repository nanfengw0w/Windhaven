import { smoothstep } from "../core/math.js";

// A quiet route across the rear meadow ends at a lookout before the steep
// central scarp. Resting places sit beside its grassy shoulder.
const HIKING_TRAIL = Object.freeze({
  shelter: {
    x: -9.25,
    z: -6.9,
    width: 0.72,
    depth: 0.48,
    yaw: -0.12,
    eaves: 0.32,
    ridge: 0.52,
  },
  benches: [
    { x: -8.2, z: -7.0, yaw: -0.12, width: 0.26 },
    { x: -3.65, z: -6.9, yaw: 0.12, width: 0.26 },
  ],
  signs: [
    { x: -10.3, z: -6.45, yaw: 0.15 },
    { x: -5.65, z: -6.16, yaw: -0.25 },
  ],
});

const HIKING_GROUND_BOUNDS = Object.freeze({
  minX: -12.4,
  minZ: -7.85,
  sizeX: 9.8,
  sizeZ: 2.75,
});

// Broad bends follow the grassy shoulder; no switchbacks across the scarp.
const hikingRouteSegments = [
  [
    [-12.25, -5.85],
    [-11.15, -6.22],
    [-10.15, -5.9],
    [-9.1, -6.0],
  ],
  [
    [-9.1, -6.0],
    [-8.4, -6.07],
    [-7.8, -6.65],
    [-6.7, -6.6],
  ],
  [
    [-6.7, -6.6],
    [-5.9, -6.57],
    [-5.25, -6.8],
    [-4.45, -6.65],
  ],
  [
    [-4.45, -6.65],
    [-4.05, -6.608],
    [-3.7, -6.3],
    [-3.28, -6.28],
  ],
];
const HIKING_ROUTE_POINTS = [];
for (const [a, b, c, d] of hikingRouteSegments) {
  for (let index = 0; index <= 28; index++) {
    if (index === 0 && HIKING_ROUTE_POINTS.length) continue;
    const t = index / 28,
      s = 1 - t;
    HIKING_ROUTE_POINTS.push([
      s ** 3 * a[0] +
        3 * s * s * t * b[0] +
        3 * s * t * t * c[0] +
        t ** 3 * d[0],
      s ** 3 * a[1] +
        3 * s * s * t * b[1] +
        3 * s * t * t * c[1] +
        t ** 3 * d[1],
    ]);
  }
}

function hikingInsideBounds(x, z, margin = 0) {
  const b = HIKING_GROUND_BOUNDS;
  return (
    x >= b.minX - margin &&
    x <= b.minX + b.sizeX + margin &&
    z >= b.minZ - margin &&
    z <= b.minZ + b.sizeZ + margin
  );
}

function hikingSegmentDistanceSquared(x, z, ax, az, bx, bz) {
  const dx = bx - ax,
    dz = bz - az;
  const t = Math.max(
    0,
    Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)),
  );
  return (x - ax - t * dx) ** 2 + (z - az - t * dz) ** 2;
}

function hikingPathDistance(x, z, includeShelterSpur = true) {
  if (!hikingInsideBounds(x, z, 1)) return Infinity;
  // A short spur meets the shelter's open front, instead of ending in grass.
  const shelter = HIKING_TRAIL.shelter;
  const frontX = shelter.x + Math.sin(shelter.yaw) * (shelter.depth / 2 + 0.05);
  const frontZ = shelter.z + Math.cos(shelter.yaw) * (shelter.depth / 2 + 0.05);
  let nearest = includeShelterSpur
    ? hikingSegmentDistanceSquared(x, z, shelter.x, -5.99, frontX, frontZ)
    : Infinity;
  for (let index = 1; index < HIKING_ROUTE_POINTS.length; index++) {
    const a = HIKING_ROUTE_POINTS[index - 1],
      b = HIKING_ROUTE_POINTS[index];
    const dx = Math.max(a[0] - x, 0, x - b[0]);
    const dz = Math.max(Math.min(a[1], b[1]) - z, 0, z - Math.max(a[1], b[1]));
    if (dx * dx + dz * dz >= nearest) continue;
    nearest = Math.min(nearest, hikingSegmentDistanceSquared(x, z, ...a, ...b));
  }
  return Math.sqrt(nearest);
}

function hikingRectangleDistance(x, z, item, width, depth) {
  const dx = x - item.x,
    dz = z - item.z;
  const c = Math.cos(item.yaw),
    s = Math.sin(item.yaw);
  const qx = Math.abs(c * dx - s * dz) - width / 2;
  const qz = Math.abs(s * dx + c * dz) - depth / 2;
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0)
  );
}

function hikingObjectClearance(x, z) {
  if (!hikingInsideBounds(x, z, 0.5)) return Infinity;
  const { shelter, benches, signs } = HIKING_TRAIL;
  let nearest = hikingRectangleDistance(
    x,
    z,
    shelter,
    shelter.width + 0.1,
    shelter.depth + 0.1,
  );
  for (const bench of benches)
    nearest = Math.min(
      nearest,
      hikingRectangleDistance(x, z, bench, bench.width + 0.04, 0.12),
    );
  for (const sign of signs)
    nearest = Math.min(
      nearest,
      hikingRectangleDistance(x, z, sign, 0.22, 0.05),
    );
  return nearest;
}

function hikingTrailClearance(x, z) {
  if (!hikingInsideBounds(x, z, 1)) return Infinity;
  return Math.min(hikingPathDistance(x, z) - 0.14, hikingObjectClearance(x, z));
}

function sampleHikingGround(x, z, out = {}) {
  out.coverage = out.wear = out.gravel = 0;
  if (!hikingInsideBounds(x, z)) return out;
  const distance = hikingPathDistance(x, z);
  const edge =
    Math.sin(x * 17.3 + z * 9.4) * 0.014 + Math.sin(z * 32.1 - x * 4.2) * 0.01;
  const path = 1 - smoothstep(0.09, 0.22, distance + edge);
  const objects = 1 - smoothstep(-0.03, 0.11, hikingObjectClearance(x, z));
  out.coverage = Math.max(path * 0.88, objects * 0.62);
  out.wear = (1 - smoothstep(0.025, 0.11, distance)) * 0.16;
  out.gravel = path * 0.3;
  return out;
}

export {
  HIKING_TRAIL,
  HIKING_GROUND_BOUNDS,
  HIKING_ROUTE_POINTS,
  hikingPathDistance,
  hikingObjectClearance,
  hikingTrailClearance,
  sampleHikingGround,
};
