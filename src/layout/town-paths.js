// The same paths drive the terrain's worn-earth mask and vegetation clearance.
// Kept independent of terrain and village imports so both systems can use it.
const PATH_FEATHER = 0.04;
const EDGE_VARIATION = 0.009;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(low, high, value) {
  const t = clamp01((value - low) / (high - low));
  return t * t * (3 - 2 * t);
}

function makePath(id, kind, points, halfWidth, variation = 0.01) {
  const widths = points.map((point) => {
    const phase = point.x * 3.7 + point.z * 4.3;
    return halfWidth + variation * Math.sin(phase) * Math.cos(phase * 0.47);
  });
  const segments = [];
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity,
  };
  let length = 0;
  for (let index = 1; index < points.length; index++) {
    const a = points[index - 1];
    const b = points[index];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const segmentLength = Math.hypot(dx, dz);
    if (segmentLength < 1e-6) continue;
    const widthA = widths[index - 1];
    const widthB = widths[index];
    const extent = Math.max(widthA, widthB) + EDGE_VARIATION;
    const segment = {
      x: a.x,
      z: a.z,
      dx,
      dz,
      inverseLengthSquared: 1 / (segmentLength * segmentLength),
      length: segmentLength,
      along: length,
      widthA,
      widthB,
      normalX: dz / segmentLength,
      normalZ: -dx / segmentLength,
      minX: Math.min(a.x, b.x) - extent,
      maxX: Math.max(a.x, b.x) + extent,
      minZ: Math.min(a.z, b.z) - extent,
      maxZ: Math.max(a.z, b.z) + extent,
    };
    segments.push(segment);
    length += segmentLength;
    bounds.minX = Math.min(bounds.minX, segment.minX);
    bounds.maxX = Math.max(bounds.maxX, segment.maxX);
    bounds.minZ = Math.min(bounds.minZ, segment.minZ);
    bounds.maxZ = Math.max(bounds.maxZ, segment.maxZ);
  }
  return { id, kind, points, segments, halfWidth, length, bounds };
}

function approachCurve(house, approachPoint, index) {
  const start = approachPoint(house);
  const end = house.lane;
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const distance = Math.hypot(dx, dz);
  if (distance < 1e-5) return [start, end];
  // Continue straight out of a recessed doorway before turning; the control
  // point stays on the outside of the support footprint, clear of L-shaped wings.
  const outward = Math.min(0.12, distance * 0.32);
  const a = {
    x: start.x + Math.sin(house.yaw) * outward,
    z: start.z + Math.cos(house.yaw) * outward,
  };
  const bend = Math.min(0.035, distance * 0.08) * Math.sin(index * 2.19 + 0.4);
  const b = {
    x: end.x - dx * 0.25 + (dz / distance) * bend,
    z: end.z - dz * 0.25 - (dx / distance) * bend,
  };
  const count = Math.max(5, Math.ceil(distance / 0.07));
  return Array.from({ length: count + 1 }, (_, step) => {
    const t = step / count;
    const v = 1 - t;
    return {
      x:
        v ** 3 * start.x +
        3 * v * v * t * a.x +
        3 * v * t * t * b.x +
        t ** 3 * end.x,
      z:
        v ** 3 * start.z +
        3 * v * v * t * a.z +
        3 * v * t * t * b.z +
        t ** 3 * end.z,
    };
  });
}

function createTownPaths({
  houses = [],
  lane = [],
  tower,
  station,
  approachPoint,
}) {
  const paths = [];
  if (lane.length > 1) {
    paths.push(makePath("village-lane", "lane", lane, 0.158, 0.012));
  }
  const entries = [...houses];
  if (tower) entries.push(tower);
  if (station) entries.push(station);
  entries.forEach((house, index) => {
    if (!house.lane || !approachPoint) return;
    paths.push(
      makePath(
        house === tower
          ? "tower-approach"
          : house === station
            ? "station-door"
            : `house-${index}-approach`,
        "footpath",
        approachCurve(house, approachPoint, index),
        0.095,
        0.009,
      ),
    );
  });
  // Only the low forecourt belongs to the dirt lane. The remaining station
  // access rises on masonry steps, and must not paint dirt across the railway.
  if (station?.accessPoints?.length > 1) {
    paths.push(
      makePath(
        "station-forecourt",
        "footpath",
        station.accessPoints.slice(0, 9),
        0.102,
        0.008,
      ),
    );
  }
  if (station?.doorAccessPoints?.length > 1 && station.accessPoints?.[8]) {
    // Keep the narrow station-side walk connected to the foot of the steps.
    // It is earth below the masonry rise, never a strip over the track.
    paths.push(
      makePath(
        "station-side-walk",
        "footpath",
        [...station.doorAccessPoints, station.accessPoints[8]],
        0.09,
        0.006,
      ),
    );
  }
  return paths;
}

function boxDistanceSquared(bounds, x, z) {
  const dx = Math.max(bounds.minX - x, 0, x - bounds.maxX);
  const dz = Math.max(bounds.minZ - z, 0, z - bounds.maxZ);
  return dx * dx + dz * dz;
}

// out is reusable while baking a texture. No temporary objects are allocated
// in the sampling loop; expanded AABBs discard distant paths and segments.
function sampleTownPaths(paths, x, z, out = {}) {
  let distance = Infinity;
  let coverage = 0;
  let wear = 0;
  let gravel = 0;
  const edgeNoise =
    EDGE_VARIATION *
    Math.sin(x * 23.1 + z * 17.7) *
    Math.sin(z * 31.2 - x * 11.9);
  for (const path of paths) {
    let reach = Math.max(PATH_FEATHER, distance);
    if (boxDistanceSquared(path.bounds, x, z) > reach * reach) continue;
    for (const segment of path.segments) {
      reach = Math.max(PATH_FEATHER, distance);
      if (boxDistanceSquared(segment, x, z) > reach * reach) continue;
      const dx = x - segment.x;
      const dz = z - segment.z;
      const t = clamp01(
        (dx * segment.dx + dz * segment.dz) * segment.inverseLengthSquared,
      );
      const px = dx - segment.dx * t;
      const pz = dz - segment.dz * t;
      const width = segment.widthA + (segment.widthB - segment.widthA) * t;
      const edge = Math.hypot(px, pz) - width + edgeNoise;
      distance = Math.min(distance, edge);
      if (edge >= PATH_FEATHER) continue;
      const mask = 1 - smoothstep(-PATH_FEATHER, PATH_FEATHER, edge);
      coverage = Math.max(coverage, mask);
      // Sparse gravel concentrates at the worn shoulder instead of paving the
      // whole path. Cell-level variation is supplied by the terrain shader.
      const shoulder = Math.exp(-(((edge + 0.027) / 0.036) ** 2));
      gravel = Math.max(gravel, mask * (0.12 + 0.72 * shoulder));
      if (path.kind !== "lane") continue;
      const across = Math.abs(dx * segment.normalX + dz * segment.normalZ);
      const wheelDistance = Math.abs(across - width * 0.48);
      const rut = 1 - smoothstep(width * 0.08, width * 0.26, wheelDistance);
      const along = segment.along + segment.length * t;
      const endFade = smoothstep(
        0.015,
        0.2,
        Math.min(along, path.length - along),
      );
      wear = Math.max(
        wear,
        rut * mask * endFade * (0.68 + 0.1 * Math.sin(along * 4.3)),
      );
    }
  }
  out.distance = distance;
  out.coverage = coverage;
  out.wear = wear;
  out.gravel = gravel;
  return out;
}

export { createTownPaths, sampleTownPaths };
