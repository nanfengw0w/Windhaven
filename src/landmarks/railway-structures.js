// Static track, ballast, bridge supports and tunnel portals.
import { terrainHeight } from "../simulation/terrain-shape.js";
import {
  BALLAST_PROFILE,
  forEachRailwayBallastStone,
} from "./railway-ballast.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { RAILWAY_TUNNEL } from "../layout/railway-cut.js";
import {
  RAILWAY,
  SCENE_SCALE,
  railwayPoint,
  railwayTangent,
} from "../layout/world-layout.js";

function buildRailwaySupports(town) {
  town.supportSpacing = 1.5;
  town.supports = [];
  const width = 0.2;
  const depth = 0.19;
  const point = {};
  for (
    let distance = 0;
    distance <= town.pathLength;
    distance += town.supportSpacing
  ) {
    town.sampleTrack(distance, point);
    if (
      Math.abs(point.x) > LANDSCAPE_BOUNDS.halfW ||
      Math.abs(point.z) > LANDSCAPE_BOUNDS.halfD
    )
      continue;

    // The pitched deck's lower face at the vertical support centerline.
    const deckBottom = point.y - 0.26 / Math.cos(point.pitch);
    const ground = terrainHeight(point.x, point.z);
    const groundGap = deckBottom - ground;
    // Near-grade sections already rest on the terrain; they need no column.
    if (groundGap <= 0.08) continue;

    let lowestGround = ground;
    for (const across of [-width / 2, 0, width / 2])
      for (const along of [-depth / 2, 0, depth / 2])
        lowestGround = Math.min(
          lowestGround,
          terrainHeight(
            point.x +
              Math.cos(point.yaw) * across +
              Math.sin(point.yaw) * along,
            point.z -
              Math.sin(point.yaw) * across +
              Math.cos(point.yaw) * along,
          ),
        );
    const bottom = lowestGround - 0.02;
    const top =
      deckBottom + Math.abs(Math.tan(point.pitch)) * (depth / 2) + 0.02;
    // Slim vertical piers meet the continuous deck directly, without caps.
    const frame = town._frame(point.x, point.y, point.z, point.yaw);
    town._piece(
      "box",
      "stone",
      0,
      (top + bottom) / 2 - point.y,
      0,
      width,
      top - bottom,
      depth,
      0,
      0,
      0,
      frame,
      true,
    );
    town.supports.push({
      distance,
      x: point.x,
      y: point.y,
      z: point.z,
      yaw: point.yaw,
      pitch: point.pitch,
      width,
      depth,
      bottom,
      top,
      groundGap,
    });
  }
}

function buildRailwayStructures(town) {
  const count = Math.ceil(town.pathLength / 0.13) + 1;
  const step = town.pathLength / (count - 1);
  town.trackSpacing = step;
  town.trackSampleDistances = [];
  const point = {};
  for (let i = 0; i < count; i++) {
    town.sampleTrack(i * step, point);
    // No scenery is needed along the completely hidden connecting journey;
    // the near-boundary pieces still use exact color/depth fragment clipping.
    if (
      Math.abs(point.x) > LANDSCAPE_BOUNDS.halfW + 0.4 ||
      Math.abs(point.z) > LANDSCAPE_BOUNDS.halfD + 0.4
    )
      continue;
    town.trackSampleDistances.push(i * step);
    const frame = town._frame(
      point.x,
      point.y,
      point.z,
      point.yaw,
      point.pitch,
    );
    const add = (mat, x, y, z, sx, sy, sz) =>
      town._piece("box", mat, x, y, z, sx, sy, sz, 0, 0, 0, frame, true);
    add("wood", 0, -0.035, 0, SCENE_SCALE.sleeperWidth, 0.04, 0.06);
    add("rail", -SCENE_SCALE.trackGauge / 2, 0, 0, 0.018, 0.025, step + 0.014);
    add("rail", SCENE_SCALE.trackGauge / 2, 0, 0, 0.018, 0.025, step + 0.014);
    // Continuous ballast also fills the floor of the mountain opening.
    town._piece(
      "ballast",
      "ballast",
      0,
      BALLAST_PROFILE.centerY,
      0,
      BALLAST_PROFILE.width,
      BALLAST_PROFILE.height,
      step + 0.02,
      0,
      0,
      0,
      frame,
      true,
    );
    forEachRailwayBallastStone(i, step, (stone) => {
      town._piece(
        "gravel",
        "ballast",
        stone.x,
        stone.y,
        stone.z,
        stone.sx,
        stone.sy,
        stone.sz,
        stone.rx,
        stone.ry,
        stone.rz,
        frame,
        true,
      );
    });
    // The low viaduct has a continuous masonry deck beneath its loose bed.
    add("stone", 0, -0.21, 0, 0.35, 0.1, step + 0.02);
  }
  town.sleeperCount = town.trackSampleDistances.length;
  buildRailwaySupports(town);
}

function buildRailwayTunnels(town) {
  const { floorY, springY, radius } = RAILWAY_TUNNEL;
  const threshold = springY;
  const spring = springY - floorY;
  const buried = (t) => {
    const p = railwayPoint(t);
    return terrainHeight(p.x, p.z) > threshold;
  };
  for (let i = 1; i <= 720; i++) {
    if (!buried((i - 1) / 720) || buried(i / 720)) continue;
    let low = (i - 1) / 720,
      high = i / 720;
    for (let iteration = 0; iteration < 18; iteration++) {
      const mid = (low + high) / 2;
      if (buried(mid)) low = mid;
      else high = mid;
    }
    const t = (low + high) / 2,
      point = railwayPoint(t),
      direction = railwayTangent(t);
    if (point.z > -1.5) continue;
    const yaw = Math.atan2(direction.x, direction.z);
    const frame = town._frame(
      point.x + direction.x * 0.1,
      floorY,
      point.z + direction.z * 0.1,
      yaw,
    );
    const add = (mat, x, y, z, sx, sy, sz, rz = 0) =>
      town._piece("box", mat, x, y, z, sx, sy, sz, 0, 0, rz, frame, true);
    for (const side of [-1, 1]) {
      add("stone", side * (radius + 0.07), spring / 2, 0, 0.14, spring, 0.24);
      add(
        "dark",
        side * (radius + 0.015),
        spring / 2,
        -0.37,
        0.03,
        spring,
        0.7,
      );
      add("stone", side * (radius + 0.24), 0.2, -0.03, 0.18, 0.4, 0.26);
    }
    for (let block = 0; block < 11; block++) {
      const angle = ((block + 0.5) / 11) * Math.PI;
      add(
        "stone",
        Math.cos(angle) * (radius + 0.07),
        spring + Math.sin(angle) * (radius + 0.07),
        0,
        0.095,
        0.14,
        0.25,
        angle - Math.PI / 2,
      );
      add(
        "dark",
        Math.cos(angle) * (radius + 0.015),
        spring + Math.sin(angle) * (radius + 0.015),
        -0.37,
        0.085,
        0.03,
        0.7,
        angle - Math.PI / 2,
      );
    }
    town.portals.push({
      t,
      x: point.x,
      y: RAILWAY.y,
      z: point.z,
      yaw,
      outwardX: direction.x,
      outwardZ: direction.z,
      threshold,
      floorY,
      springY,
      radius,
      halfWidth: radius,
      floor: floorY,
      spring: springY,
      top: springY + radius,
    });
    break;
  }
}

export { buildRailwayStructures, buildRailwayTunnels };
