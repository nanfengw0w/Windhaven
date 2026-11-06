import { smoothstep } from "../core/math.js";

// A small working clearing on the woodland side of the western railway.
// Geometry, terrain and vegetation all use these same ground footprints.
const WOODWORKING_YARD = Object.freeze({
  center: { x: -9.85, z: 3.95 },
  clearing: { radiusX: 1.25, radiusZ: 1.05 },
  shelter: {
    x: -10.2,
    z: 3.35,
    width: 1.18,
    depth: 0.7,
    yaw: 0.12,
    eaves: 0.46,
    ridge: 0.66,
  },
  logPile: { x: -9.05, z: 3.75, yaw: 0.15, length: 0.84, radius: 0.052 },
  cart: { x: -9.5, z: 4.55, yaw: -0.35 },
  stumps: [
    { x: -10.45, z: 4.35, radius: 0.115, height: 0.17 },
    { x: -8.95, z: 4.55, radius: 0.09, height: 0.12 },
  ],
});

const WOODWORKING_GROUND_BOUNDS = Object.freeze({
  minX: -12.35,
  minZ: 1.35,
  sizeX: 4.25,
  sizeZ: 4.9,
});

const woodworkingCartFootprint = {
  x: WOODWORKING_YARD.cart.x + Math.sin(WOODWORKING_YARD.cart.yaw) * 0.3,
  z: WOODWORKING_YARD.cart.z + Math.cos(WOODWORKING_YARD.cart.yaw) * 0.3,
  yaw: WOODWORKING_YARD.cart.yaw,
};

// A cart-width trail emerges from the grove, passes through the yard and
// continues beyond the west map edge. The railway is never crossed.
const WOODLAND_CART_ROUTE = [
  [
    [-9.45, 1.8],
    [-9.4, 2.45],
    [-9.65, 3.1],
    [-9.7, 3.85],
  ],
  [
    [-9.7, 3.85],
    [-9.75, 4.6],
    [-10.5, 5.05],
    [-11.15, 5.3],
  ],
  [
    [-11.15, 5.3],
    [-11.55, 5.454],
    [-11.95, 5.52],
    [-12.3, 5.58],
  ],
];

const woodlandCartPoints = [];
for (const [a, b, c, d] of WOODLAND_CART_ROUTE) {
  for (let i = 0; i <= 24; i++) {
    if (i === 0 && woodlandCartPoints.length) continue;
    const t = i / 24;
    const s = 1 - t;
    woodlandCartPoints.push({
      x:
        s ** 3 * a[0] +
        3 * s * s * t * b[0] +
        3 * s * t * t * c[0] +
        t ** 3 * d[0],
      z:
        s ** 3 * a[1] +
        3 * s * s * t * b[1] +
        3 * s * t * t * c[1] +
        t ** 3 * d[1],
    });
  }
}

function woodlandCartPathDistance(x, z) {
  let nearest = Infinity;
  for (let i = 1; i < woodlandCartPoints.length; i++) {
    const a = woodlandCartPoints[i - 1],
      b = woodlandCartPoints[i];
    const dx = b.x - a.x,
      dz = b.z - a.z;
    const t = Math.max(
      0,
      Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)),
    );
    nearest = Math.min(
      nearest,
      (x - a.x - t * dx) ** 2 + (z - a.z - t * dz) ** 2,
    );
  }
  return Math.sqrt(nearest);
}

function woodworkingRectDistance(x, z, object, width, depth) {
  const dx = x - object.x,
    dz = z - object.z;
  const c = Math.cos(object.yaw ?? 0),
    s = Math.sin(object.yaw ?? 0);
  const qx = Math.abs(c * dx - s * dz) - width / 2;
  const qz = Math.abs(s * dx + c * dz) - depth / 2;
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0)
  );
}

function woodlandYardObjectClearance(x, z) {
  if (!inWoodworkingBounds(x, z, 0.5)) return Infinity;
  const { shelter, logPile, stumps } = WOODWORKING_YARD;
  let distance = Math.min(
    woodworkingRectDistance(
      x,
      z,
      shelter,
      shelter.width + 0.12,
      shelter.depth + 0.12,
    ),
    Math.hypot(x - logPile.x, z - logPile.z) - 0.55,
    woodworkingRectDistance(
      x,
      z,
      woodworkingCartFootprint,
      0.62,
      1.24,
    ),
  );
  for (const stump of stumps)
    distance = Math.min(
      distance,
      Math.hypot(x - stump.x, z - stump.z) - stump.radius - 0.08,
    );
  return distance;
}

function woodworkingClearingDistance(x, z) {
  const { center, clearing } = WOODWORKING_YARD;
  const edge =
    Math.sin(x * 5.1 + z * 2.7) * 0.055 + Math.sin(z * 6.4 - x) * 0.045;
  return (
    (Math.hypot(
      (x - center.x) / clearing.radiusX,
      (z - center.z) / clearing.radiusZ,
    ) -
      1) *
      Math.min(clearing.radiusX, clearing.radiusZ) +
    edge
  );
}

function inWoodworkingBounds(x, z, margin = 0) {
  const b = WOODWORKING_GROUND_BOUNDS;
  return (
    x >= b.minX - margin &&
    x <= b.minX + b.sizeX + margin &&
    z >= b.minZ - margin &&
    z <= b.minZ + b.sizeZ + margin
  );
}

function woodlandYardClearance(x, z) {
  // Most of the map exits here before testing the sampled cart trail.
  if (!inWoodworkingBounds(x, z, 1)) return Infinity;
  return Math.min(
    woodworkingClearingDistance(x, z),
    woodlandYardObjectClearance(x, z),
    woodlandCartPathDistance(x, z) - 0.22,
  );
}

function sampleWoodworkingGround(x, z, out = {}) {
  out.coverage = out.wear = out.gravel = out.clearing = 0;
  if (!inWoodworkingBounds(x, z)) return out;
  const pathDistance = woodlandCartPathDistance(x, z);
  const roughEdge =
    Math.sin(x * 19 + z * 7) * 0.018 + Math.sin(z * 31 - x * 9) * 0.012;
  const trail = 1 - smoothstep(0.16, 0.32, pathDistance + roughEdge);
  // Feather the blind end within the forest, not the exit at the map edge.
  const approach = smoothstep(1.55, 2.05, z);
  out.clearing = 1 - smoothstep(-0.12, 0.2, woodworkingClearingDistance(x, z));
  const patches =
    0.58 + Math.sin(x * 12.3 + z * 7.4) * Math.sin(z * 11.1 - x * 3.8) * 0.18;
  const objects =
    1 - smoothstep(-0.03, 0.08, woodlandYardObjectClearance(x, z));
  out.coverage = Math.max(
    trail * approach * 0.9,
    out.clearing * patches,
    objects * 0.72,
  );
  out.wear =
    (1 - smoothstep(0.025, 0.055, Math.abs(pathDistance - 0.105))) *
    trail *
    approach *
    0.7;
  out.gravel = out.coverage * 0.16;
  return out;
}

export {
  WOODWORKING_YARD,
  WOODWORKING_GROUND_BOUNDS,
  WOODLAND_CART_ROUTE,
  woodlandCartPathDistance,
  woodlandYardObjectClearance,
  woodlandYardClearance,
  sampleWoodworkingGround,
};
