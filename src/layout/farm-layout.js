import { smoothstep } from "../core/math.js";

const field = { x: -2.5, z: 6.05, width: 4.7, depth: 2.24 };
const shelter = { x: -5.55, z: 5.25, width: 0.78, depth: 0.52, yaw: 0.12 };
const hay = [
  { x: -5.12, z: 5.95, yaw: 0.2, scale: 0.8, radius: 0.17 },
  { x: -5.03, z: 6.22, yaw: -0.18, scale: 0.7, radius: 0.15 },
];
const scarecrow = {
  x: -2.65,
  z: 6.05,
  yaw: 0.15,
  radius: 0.045,
  height: 0.544,
  burial: 0.015,
};

// One uninterrupted wheat field. All vegetation uses this footprint;
// the scarecrow's narrow stake sits inside the crop, without a cleared plaza.
const FARM = Object.freeze({
  field,
  shelter,
  hay,
  scarecrow,
  obstacles: [{ ...shelter, radius: 0.49 }, ...hay, scarecrow],
});

function farmFieldDistance(x, z) {
  const dx = Math.abs(x - field.x) - field.width / 2;
  const dz = Math.abs(z - field.z) - field.depth / 2;
  return (
    Math.hypot(Math.max(dx, 0), Math.max(dz, 0)) + Math.min(Math.max(dx, dz), 0)
  );
}

// The rectangular planting area fades into the meadow instead of ending on
// a ruler-straight line. Shared by wheat, grass and wildflowers at their roots.
function farmCropCoverage(x, z) {
  const distance = farmFieldDistance(x, z);
  if (distance >= 0.32) return 0;
  if (distance <= -0.56) return 1;
  const edge =
    Math.sin(x * 4.7 + Math.sin(z * 3.1)) * 0.09 +
    Math.sin(z * 7.3 - x * 2.2) * 0.09;
  return 1 - smoothstep(-0.38, 0.14, distance + edge);
}

function shelterClearance(x, z) {
  const dx = x - shelter.x;
  const dz = z - shelter.z;
  const qx =
    Math.abs(Math.cos(shelter.yaw) * dx - Math.sin(shelter.yaw) * dz) -
    shelter.width / 2 -
    0.05;
  const qz =
    Math.abs(Math.sin(shelter.yaw) * dx + Math.cos(shelter.yaw) * dz) -
    shelter.depth / 2 -
    0.05;
  return (
    Math.hypot(Math.max(0, qx), Math.max(0, qz)) + Math.min(Math.max(qx, qz), 0)
  );
}

function farmObjectClearance(x, z) {
  let distance = shelterClearance(x, z);
  for (let index = 1; index < FARM.obstacles.length; index++) {
    const obstacle = FARM.obstacles[index];
    distance = Math.min(
      distance,
      Math.hypot(x - obstacle.x, z - obstacle.z) - obstacle.radius,
    );
  }
  return distance;
}

function farmClearance(x, z) {
  return Math.min(farmFieldDistance(x, z), farmObjectClearance(x, z));
}

function sampleFarmGround(x, z, out = {}) {
  // Only the shelter has trodden earth; wheat keeps the surrounding ground.
  out.coverage = (1 - smoothstep(-0.03, 0.08, shelterClearance(x, z))) * 0.85;
  return out;
}

export {
  FARM,
  farmFieldDistance,
  farmCropCoverage,
  farmObjectClearance,
  farmClearance,
  sampleFarmGround,
};
