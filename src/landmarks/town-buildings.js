// Procedural houses, station, clock tower, village paths and yard details.
// The landmark owns the shared batches; construction order is kept here.
import {
  terrainHeight,
  naturalTerrainHeight,
} from "../simulation/terrain-shape.js";
import { getTownBuildingGround } from "../layout/town-grounding.js";
import {
  TOWN_HOUSES,
  TOWN_LANE,
  TOWN_TOWER,
  createTownStation,
  houseDoorPoint,
  getTownPaths,
  townPlantClearance,
} from "../layout/town-layout.js";
import {
  RAILWAY,
  SCENE_SCALE,
  railwayPoint,
  railwayTangent,
  railwayRouteDistance,
} from "../layout/world-layout.js";

function buildTownHouse(
  town,
  x,
  z,
  width,
  height,
  depth,
  yaw,
  index,
  station = false,
) {
  const ground = terrainHeight(x, z);
  const layout = station
    ? createTownStation(railwayPoint, railwayTangent)
    : TOWN_HOUSES[index];
  const grounding = getTownBuildingGround(layout, naturalTerrainHeight);
  const foundationWidth = grounding.footprintWidth;
  const foundationDepth = grounding.footprintDepth;
  const groundSamples = [];
  for (const across of [-0.5, -0.25, 0, 0.25, 0.5])
    for (const along of [-0.5, -0.25, 0, 0.25, 0.5])
      groundSamples.push(
        terrainHeight(
          x +
            across * foundationWidth * Math.cos(yaw) +
            along * foundationDepth * Math.sin(yaw),
          z -
            across * foundationWidth * Math.sin(yaw) +
            along * foundationDepth * Math.cos(yaw),
        ),
      );
  // The supplied houses already have stone feet. Seat those directly on a
  // softly graded patch, as with the original cabin, without an extra podium.
  const base = 0.045;
  const floor = grounding.targetY + 0.006 - base;
  const foundationBottom = grounding.targetY - 0.025;
  const frame = town._frame(x, floor, z, yaw);
  const roofHeight = station ? 0.19 : height > 0.5 ? 0.23 : 0.21;
  const box = (mat, a, b, c, sx, sy, sz) =>
    town._piece("box", mat, a, b, c, sx, sy, sz, 0, 0, 0, frame);
  const modelSlot = station ? "station" : "cottage";
  town._modelSlot = modelSlot;
  box(
    index % 3 === 0 ? "ochre" : "plaster",
    0,
    base + height / 2,
    0,
    width,
    height,
    depth,
  );
  town._piece(
    "roof",
    index % 3 === 1 ? "slate" : "roof",
    0,
    base + height,
    0,
    width + 0.12,
    roofHeight,
    depth + 0.14,
    0,
    0,
    0,
    frame,
  );
  box("wood", 0, base + height + roofHeight, 0, 0.025, 0.025, depth + 0.15);
  box("wood", 0, base + 0.025, depth / 2 + 0.009, width, 0.025, 0.022);
  for (const side of [-1, 1]) {
    box(
      "wood",
      side * (width / 2 - 0.016),
      base + height / 2,
      depth / 2 + 0.01,
      0.03,
      height,
      0.025,
    );
    const levels = height > 0.5 ? [0.2, 0.49] : [0.2];
    for (const level of levels) {
      const wy = base + level;
      box(
        "wood",
        side * width * 0.29,
        wy,
        depth / 2 + 0.016,
        0.14,
        SCENE_SCALE.windowHeight + 0.03,
        0.025,
      );
      box(
        index % 2 ? "warm" : "glass",
        side * width * 0.29,
        wy,
        depth / 2 + 0.034,
        0.105,
        SCENE_SCALE.windowHeight,
        0.012,
      );
      box(
        "wood",
        side * width * 0.29,
        wy,
        depth / 2 + 0.042,
        0.012,
        SCENE_SCALE.windowHeight,
        0.012,
      );
    }
    box(
      "wood",
      side * (width / 2 + 0.006),
      base + 0.2,
      0,
      0.02,
      SCENE_SCALE.windowHeight + 0.03,
      0.14,
    );
    box(
      "glass",
      side * (width / 2 + 0.018),
      base + 0.2,
      0,
      0.01,
      SCENE_SCALE.windowHeight,
      0.105,
    );
  }
  box(
    "wood",
    0,
    base + SCENE_SCALE.doorHeight / 2,
    depth / 2 + 0.022,
    0.115,
    SCENE_SCALE.doorHeight,
    0.035,
  );
  town._modelSlot = null;
  const doorAcross = layout?.doorAcross ?? 0;
  const doorAlong = layout?.doorAlong;
  const doorRise = layout?.doorRise ?? 0;
  const door = houseDoorPoint({ x, z, depth, yaw, doorAcross, doorAlong });
  const doorThreshold = floor + base + doorRise;
  const steps = [];
  const thresholdStart =
    Math.max(
      layout.doorAlong ?? depth / 2,
      (layout.supportDepth || depth) / 2,
    ) + 0.035;
  for (let step = 0; step < 2; step++) {
    const along = thresholdStart + step * 0.075;
    const px = x + Math.cos(yaw) * doorAcross + Math.sin(yaw) * along;
    const pz = z - Math.sin(yaw) * doorAcross + Math.cos(yaw) * along;
    const localGround = terrainHeight(px, pz);
    const desired = doorThreshold - 0.028 - step * 0.038;
    if (desired - localGround < 0.014) break;
    const top = Math.min(localGround + 0.055, desired);
    const low = localGround - 0.012;
    box(
      "paving",
      doorAcross,
      (low + top) / 2 - floor,
      along,
      0.2,
      top - low,
      0.085,
    );
    steps.push({ x: px, z: pz, top, ground: localGround });
  }
  const chimney = base + height + roofHeight * 0.65;
  town._modelSlot = modelSlot;
  box("stone", width * 0.25, chimney + 0.02, -depth * 0.2, 0.085, 0.17, 0.085);
  box("wood", width * 0.25, chimney + 0.115, -depth * 0.2, 0.115, 0.025, 0.115);
  town._modelSlot = null;
  town.buildings.push({
    x,
    z,
    ground,
    floor,
    foundationBottom,
    foundationTop: floor + base,
    foundationWidth,
    foundationDepth,
    grounding,
    groundSamples,
    doorThreshold,
    door,
    doorAcross,
    doorAlong,
    doorRise,
    modelId: station ? "station" : layout.modelId,
    steps,
    width,
    wallHeight: height,
    height: base + height + roofHeight + 0.0275,
    depth,
    yaw,
    station,
    doorHeight: SCENE_SCALE.doorHeight,
    windowHeight: SCENE_SCALE.windowHeight,
  });
}

function buildTownBuildings(town) {
  TOWN_HOUSES.forEach((house, index) =>
    town._house(
      house.x,
      house.z,
      house.width,
      house.height,
      house.depth,
      house.yaw,
      index,
    ),
  );
  // Place the station against the current open route, with a clear boarding gap.
  const stationLayout = createTownStation(railwayPoint, railwayTangent);
  const stationIndex = Math.round(stationLayout.t * town.pathSegments);
  const track = town.sampleTrack(town.pathArc[stationIndex], {});
  const { rightX, rightZ, x: stationX, z: stationZ } = stationLayout;
  town._house(stationX, stationZ, 0.98, 0.36, 0.55, stationLayout.yaw, 8, true);
  const { platformX, platformZ } = stationLayout;
  const frame = town._frame(platformX, RAILWAY.y, platformZ, track.yaw);
  const add = (kind, mat, x, y, z, sx, sy, sz) =>
    town._piece(kind, mat, x, y, z, sx, sy, sz, 0, 0, 0, frame);
  // Short sections keep the boarding edge parallel to the curved track.
  town.platformSections = [];
  const stationDistance = town.pathArc[stationIndex];
  for (let section = -5; section <= 5; section++) {
    const sample = town.sampleTrack(stationDistance + section * 0.16, {});
    const x = sample.x - Math.cos(sample.yaw) * 0.4;
    const z = sample.z + Math.sin(sample.yaw) * 0.4;
    const height = Math.max(0.12, RAILWAY.y - 0.02 - terrainHeight(x, z));
    const sectionFrame = town._frame(x, RAILWAY.y, z, sample.yaw);
    town._piece(
      "box",
      "stone",
      0,
      -0.02 - height / 2,
      0,
      0.34,
      height,
      0.17,
      0,
      0,
      0,
      sectionFrame,
    );
    town._piece(
      "box",
      "paving",
      0,
      -0.012,
      0,
      0.35,
      0.03,
      0.17,
      0,
      0,
      0,
      sectionFrame,
    );
    town.platformSections.push({
      x,
      z,
      yaw: sample.yaw,
      distance: stationDistance + section * 0.16,
    });
  }
  for (const z of [-0.65, 0.65])
    add("box", "wood", -0.1, 0.23, z, 0.025, 0.46, 0.025);
  add("roof", "slate", -0.055, 0.46, 0, 0.4, 0.085, 1.65);
  town.station = {
    layout: stationLayout,
    x: stationX,
    z: stationZ,
    platformX,
    platformZ,
    trackX: track.x,
    trackZ: track.z,
    yaw: track.yaw,
    distance: stationDistance,
    railGap: 0.4 - 0.175 - SCENE_SCALE.trainWidth / 2,
  };
  // The forecourt is worn earth on the terrain. Only its final rise needs
  // masonry steps to meet the raised railway platform.
  town.stationAccess = [];
  for (let i = 0; i <= 13; i++) {
    const { x, z } = stationLayout.accessPoints[i];
    const surface = terrainHeight(x, z);
    const blend = Math.max(0, Math.min(1, (i - 8) / 5));
    const top = surface + (RAILWAY.y + 0.003 - surface) * blend;
    if (i > 8) {
      const base = surface - 0.015;
      town._piece(
        "box",
        "paving",
        x,
        (base + top) / 2,
        z,
        0.125,
        top - base,
        0.22,
        0,
        track.yaw,
        0,
      );
    }
    town.stationAccess.push({ x, z, top, kind: i > 8 ? "step" : "earth" });
  }
  for (const { x, z } of stationLayout.doorAccessPoints) {
    town.stationAccess.push({
      x,
      z,
      top: terrainHeight(x, z),
      kind: "earth",
    });
  }
  town.streetPoints = TOWN_LANE.map((point) => ({ ...point }));
  town.villagePaths = getTownPaths(stationLayout);
  town._clockTower(TOWN_TOWER.x, TOWN_TOWER.z);
  town.yardDetails = [];
  // Small rocky shrub groups sit among grass, rather than enclosing a paved
  // rectangular development. Keep gaps around doors and the winding lane.
  for (let index = 0; index < 42; index++) {
    const x = 7.5 + ((index * 0.61803398875) % 1) * 2.8;
    const z = -2.45 + ((index * 0.38196601125) % 1) * 6.25;
    const clearance = townPlantClearance(x, z, stationLayout);
    if (clearance < 0.16 || railwayRouteDistance(x, z) < 0.55) continue;
    const y = terrainHeight(x, z);
    const size = 0.09 + 0.045 * (index % 3);
    town._piece(
      "cylinder",
      "paving",
      x,
      y + size * 0.12,
      z,
      size * 1.25,
      size * 0.6,
      size,
      0.22,
      index * 1.4,
      0.16,
    );
    if (index % 3 !== 0) {
      town._piece(
        "cone",
        "foliage",
        x + 0.11,
        terrainHeight(x + 0.11, z) + 0.09,
        z,
        0.22,
        0.2,
        0.21,
        0.08,
        index,
        -0.12,
      );
      town._piece(
        "cone",
        "foliage",
        x + 0.04,
        terrainHeight(x + 0.04, z + 0.09) + 0.06,
        z + 0.09,
        0.17,
        0.14,
        0.16,
        -0.12,
        index + 1,
        0.1,
      );
    }
    town.yardDetails.push({ x, z, size });
  }
  for (const index of [7, 20, 33]) {
    const point = TOWN_LANE[index];
    const x = point.x - 0.21,
      z = point.z,
      y = terrainHeight(x, z);
    town._piece("cylinder", "iron", x, y + 0.23, z, 0.022, 0.46, 0.022);
    town._piece("box", "iron", x, y + 0.48, z, 0.08, 0.02, 0.08);
    town._piece("box", "warm", x, y + 0.44, z, 0.045, 0.065, 0.045);
    town._piece("cone", "iron", x, y + 0.515, z, 0.11, 0.055, 0.11);
  }
}

function buildTownClockTower(town, x, z) {
  const ground = terrainHeight(x, z);
  const yaw = TOWN_TOWER.yaw;
  const groundSamples = [];
  for (const across of [-0.25, 0, 0.25])
    for (const along of [-0.25, 0, 0.25])
      groundSamples.push(
        terrainHeight(
          x + across * Math.cos(yaw) + along * Math.sin(yaw),
          z - across * Math.sin(yaw) + along * Math.cos(yaw),
        ),
      );
  const grounding = getTownBuildingGround(TOWN_TOWER, naturalTerrainHeight);
  const floor = grounding.targetY + 0.006 - 0.05;
  const foundationBottom = grounding.targetY - 0.025;
  const frame = town._frame(x, floor, z, yaw);
  const add = (kind, mat, a, b, c, sx, sy, sz, rx = 0, ry = 0, rz = 0) =>
    town._piece(kind, mat, a, b, c, sx, sy, sz, rx, ry, rz, frame);
  town._modelSlot = "clocktower";
  add("box", "plaster", 0, 0.56, 0, 0.36, 1.02, 0.36);
  add("box", "wood", 0, 1.08, 0, 0.44, 0.07, 0.44);
  add("cone", "slate", 0, 1.29, 0, 0.62, 0.36, 0.62, 0, Math.PI / 4);
  add("cylinder", "iron", 0, 1.51, 0, 0.018, 0.12, 0.018);
  add("disk", "cream", 0, 0.9, 0.186, 0.23, 0.23, 1);
  add("box", "iron", 0.025, 0.915, 0.192, 0.075, 0.012, 0.009, 0, 0, 0.55);
  add("box", "iron", 0, 0.934, 0.194, 0.012, 0.08, 0.009);
  add(
    "box",
    "wood",
    0,
    0.045 + SCENE_SCALE.doorHeight / 2,
    0.187,
    0.115,
    SCENE_SCALE.doorHeight,
    0.025,
  );
  town._modelSlot = null;
  const doorThreshold = floor + 0.045;
  const door = houseDoorPoint(TOWN_TOWER);
  const steps = [];
  const along = 0.25;
  const px = x + Math.sin(yaw) * along;
  const pz = z + Math.cos(yaw) * along;
  const surface = terrainHeight(px, pz);
  if (doorThreshold - surface > 0.025) {
    const top = Math.min(surface + 0.04, doorThreshold - 0.015);
    const bottom = surface - 0.012;
    add(
      "box",
      "paving",
      0,
      (top + bottom) / 2 - floor,
      along,
      0.2,
      top - bottom,
      0.085,
    );
    steps.push({ x: px, z: pz, top, ground: surface });
  }
  town.buildings.push({
    x,
    z,
    ground,
    floor,
    foundationBottom,
    foundationTop: floor + 0.05,
    grounding,
    groundSamples,
    doorThreshold,
    door,
    steps,
    yaw,
    width: 0.5,
    height: 1.57,
    depth: 0.5,
    tower: true,
    doorHeight: SCENE_SCALE.doorHeight,
  });
}

export { buildTownHouse, buildTownBuildings, buildTownClockTower };
