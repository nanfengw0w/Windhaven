import { smoothstep } from "../core/math.js";

// 后山步道旁的旧石屋。局部 +Z 为入口，布局数据同时供砌石、地面和植被使用。
const MOUNTAIN_RUINS = Object.freeze({
  x: -4.85,
  z: -7.33,
  yaw: 0,
  width: 1.12,
  depth: 0.78,
  wallThickness: 0.11,
  doorWidth: 0.24,
  maxWallHeight: 0.56,
});

// 网格自带碎石底盘和石阶，等比缩放后仍位于原来的局部清理范围。
const RUIN_MODEL_SCALE = 2.15;

function ruinGroundcoverClearance(x, z) {
  // 导入模型的底盘约 0.967 × 0.966；旧程序化墙体更宽，不能叠加其净空。
  return ruinRectangleDistance(x, z, 0, 0, 0.97, 0.97);
}

const RUINS_GROUND_BOUNDS = Object.freeze({
  minX: -5.65,
  minZ: -7.85,
  maxX: -3.1,
  maxZ: -6.1,
});

// 从既有步道末段折回门前；不另辟一条横穿山坡的宽路。
const RUINS_PATH_POINTS = Object.freeze([
  [-3.28, -6.28],
  [-3.95, -6.42],
  [-4.5, -6.62],
  [-4.78, -6.72],
  [-4.85, -6.94],
]);

function ruinWorldPoint(localX, localZ, out = {}) {
  const cosine = Math.cos(MOUNTAIN_RUINS.yaw);
  const sine = Math.sin(MOUNTAIN_RUINS.yaw);
  out.x = MOUNTAIN_RUINS.x + cosine * localX + sine * localZ;
  out.z = MOUNTAIN_RUINS.z - sine * localX + cosine * localZ;
  return out;
}

function ruinsInsideBounds(x, z, margin = 0) {
  const bounds = RUINS_GROUND_BOUNDS;
  return (
    x >= bounds.minX - margin &&
    x <= bounds.maxX + margin &&
    z >= bounds.minZ - margin &&
    z <= bounds.maxZ + margin
  );
}

function ruinRectangleDistance(x, z, centerX, centerZ, width, depth) {
  const dx = x - MOUNTAIN_RUINS.x;
  const dz = z - MOUNTAIN_RUINS.z;
  const cosine = Math.cos(MOUNTAIN_RUINS.yaw);
  const sine = Math.sin(MOUNTAIN_RUINS.yaw);
  const localX = cosine * dx - sine * dz - centerX;
  const localZ = sine * dx + cosine * dz - centerZ;
  const qx = Math.abs(localX) - width / 2;
  const qz = Math.abs(localZ) - depth / 2;
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0)
  );
}

// 树木和大石避开整座遗址；草只避让墙体和门前石阶，院内仍留杂草。
function ruinFootprintClearance(x, z) {
  return ruinRectangleDistance(
    x,
    z,
    0,
    0,
    MOUNTAIN_RUINS.width + 0.22,
    MOUNTAIN_RUINS.depth + 0.22,
  );
}

function ruinObjectClearance(x, z) {
  const { width, depth, wallThickness, doorWidth } = MOUNTAIN_RUINS;
  const frontPieceWidth = (width - doorWidth) / 2;
  const frontPieceX = (width + doorWidth) / 4;
  return Math.min(
    ruinRectangleDistance(
      x,
      z,
      0,
      -depth / 2,
      width + wallThickness,
      wallThickness,
    ),
    ruinRectangleDistance(x, z, -width / 2, 0, wallThickness, depth),
    ruinRectangleDistance(x, z, width / 2, 0, wallThickness, depth),
    ruinRectangleDistance(
      x,
      z,
      -frontPieceX,
      depth / 2,
      frontPieceWidth,
      wallThickness,
    ),
    ruinRectangleDistance(
      x,
      z,
      frontPieceX,
      depth / 2,
      frontPieceWidth,
      wallThickness,
    ),
    ruinRectangleDistance(x, z, 0, depth / 2 + 0.1, doorWidth + 0.1, 0.32),
  );
}

function ruinPathDistance(x, z) {
  if (!ruinsInsideBounds(x, z, 0.2)) return Infinity;
  let nearest = Infinity;
  for (let index = 1; index < RUINS_PATH_POINTS.length; index++) {
    const a = RUINS_PATH_POINTS[index - 1];
    const b = RUINS_PATH_POINTS[index];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const t = Math.max(
      0,
      Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz)),
    );
    nearest = Math.min(
      nearest,
      Math.hypot(x - a[0] - dx * t, z - a[1] - dz * t),
    );
  }
  return nearest;
}

function sampleRuinsGround(x, z, out = {}) {
  out.coverage = out.wear = out.gravel = out.pathCoverage = 0;
  if (!ruinsInsideBounds(x, z)) return out;
  const edge =
    Math.sin(x * 23.7 + z * 13.2) * 0.018 + Math.sin(z * 39.1) * 0.009;
  const path = 1 - smoothstep(0.035, 0.13, ruinPathDistance(x, z) + edge);
  const wall = 1 - smoothstep(-0.025, 0.025, ruinGroundcoverClearance(x, z));
  const floor =
    1 -
    smoothstep(
      -0.12,
      0.015,
      ruinRectangleDistance(
        x,
        z,
        0,
        0,
        MOUNTAIN_RUINS.width - 0.14,
        MOUNTAIN_RUINS.depth - 0.14,
      ),
    );
  const patch =
    0.5 + 0.5 * Math.sin(x * 14.3 + z * 9.2) * Math.sin(z * 18.1 - x * 4.7);
  out.pathCoverage = path * (0.36 + patch * 0.22);
  out.coverage = Math.max(
    out.pathCoverage,
    wall * 0.74,
    floor * (0.18 + patch * 0.24),
  );
  out.wear = path * 0.06;
  out.gravel = Math.max(wall * 0.45, floor * 0.38, path * 0.2);
  return out;
}

export {
  MOUNTAIN_RUINS,
  RUIN_MODEL_SCALE,
  ruinGroundcoverClearance,
  RUINS_GROUND_BOUNDS,
  RUINS_PATH_POINTS,
  ruinWorldPoint,
  ruinsInsideBounds,
  ruinFootprintClearance,
  ruinObjectClearance,
  ruinPathDistance,
  sampleRuinsGround,
};
