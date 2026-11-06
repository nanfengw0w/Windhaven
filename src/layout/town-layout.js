// Shared village footprints, lanes and station access. No terrain or layout
// imports: vegetation and geometry use the same clearings without a cycle.
import { buildingModelLayout } from "./building-model-layout.js";
import { createTownPaths, sampleTownPaths } from "./town-paths.js";
function historicalTownLanePoint(t) {
  const z = -2.55 + Math.max(0, Math.min(1, t)) * 6.22;
  return { x: 8.77 + 0.17 * Math.sin(z * 1.05) + 0.06 * Math.sin(z * 2.3), z };
}
function townLanePoint(t) {
  const point = historicalTownLanePoint(t);
  const rearBend = 0.22 * Math.exp(-(((point.z + 1.65) / 1.05) ** 4));
  return { x: point.x - rearBend, z: point.z };
}

const TOWN_LANE = Object.freeze(
  Array.from({ length: 45 }, (_, index) =>
    Object.freeze(townLanePoint(index / 44)),
  ),
);
const PLACEMENT_LANE = Object.freeze(
  Array.from({ length: 45 }, (_, index) =>
    Object.freeze(historicalTownLanePoint(index / 44)),
  ),
);

// Keep the original reservations for seeded woodland placement.
const PLACEMENT_HOUSES = Object.freeze(
  [
    [7.98, -1.94, 0.65, 0.33, 0.52, -1.78],
    [7.88, -0.62, 0.68, 0.62, 0.55, -0.48],
    [9.43, -1.53, 0.7, 0.35, 0.54, -1.68],
    [9.54, -0.3, 0.65, 0.33, 0.52, -0.4],
    [8.06, 0.73, 0.7, 0.37, 0.55, 0.9],
    [7.98, 2.05, 0.72, 0.34, 0.55, 1.91],
    [9.4, 2.18, 0.68, 0.62, 0.54, 2.01],
    [8.45, 3.43, 0.7, 0.34, 0.55, 2.97],
  ].map(([x, z, width, height, depth, laneZ]) => {
    const lane = historicalTownLanePoint((laneZ + 2.55) / 6.22);
    return Object.freeze({
      x,
      z,
      width,
      height,
      depth,
      lane,
      yaw: Math.atan2(lane.x - x, lane.z - z),
    });
  }),
);

const TOWN_HOUSES = Object.freeze(
  PLACEMENT_HOUSES.map((house, index) => {
    const modelId = [
      "house-tall",
      "house-inn",
      "house-long",
      "cottage",
      "cottage",
      "house-long",
      "house-tall",
      "cottage",
    ][index];
    const model = buildingModelLayout(modelId);
    const x =
      index === 0
        ? 7.86
        : index === 1
          ? 7.6
          : index === 2
            ? 9.03
            : index === 6
              ? 9.45
              : index === 7
                ? 8.15
                : house.x;
    const z =
      index === 1 ? -0.65 : index === 2 ? -1.6 : index === 7 ? 3.38 : house.z;
    const lane = townLanePoint(
      ((index === 7 ? 3.38 : house.lane.z) + 2.55) / 6.22,
    );
    return Object.freeze({
      ...house,
      modelId,
      ...model,
      x,
      z,
      lane,
      yaw: Math.atan2(lane.x - x, lane.z - z),
    });
  }),
);

const TOWN_TOWER = Object.freeze({
  x: 9.37,
  z: 3.42,
  width: 0.5,
  depth: 0.5,
  yaw: -2.05,
  lane: Object.freeze(townLanePoint((3.12 + 2.55) / 6.22)),
});

function houseDoorPoint(house, distance = house.depth / 2 + 0.04) {
  const across = house.doorAcross ?? 0;
  const along = house.doorAlong ?? distance;
  return {
    x: house.x + Math.cos(house.yaw) * across + Math.sin(house.yaw) * along,
    z: house.z - Math.sin(house.yaw) * across + Math.cos(house.yaw) * along,
  };
}

function houseApproachPoint(house) {
  if (!house.supportDepth) return houseDoorPoint(house);
  return houseDoorPoint({ ...house, doorAlong: house.supportDepth / 2 + 0.07 });
}

function segmentDistance(x, z, a, b) {
  const dx = b.x - a.x,
    dz = b.z - a.z;
  const t = Math.max(
    0,
    Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz || 1)),
  );
  return Math.hypot(x - a.x - t * dx, z - a.z - t * dz);
}

function footprintDistance(x, z, item, margin = 0.055) {
  const dx = x - item.x,
    dz = z - item.z;
  const across = dx * Math.cos(item.yaw) - dz * Math.sin(item.yaw);
  const along = dx * Math.sin(item.yaw) + dz * Math.cos(item.yaw);
  const qx = Math.abs(across) - item.width / 2 - margin;
  const qz = Math.abs(along) - item.depth / 2 - margin;
  return (
    Math.hypot(Math.max(0, qx), Math.max(0, qz)) + Math.min(0, Math.max(qx, qz))
  );
}

const placementBuildings = [...PLACEMENT_HOUSES, TOWN_TOWER];
const villageBuildings = [
  ...TOWN_HOUSES.map((house) => ({
    ...house,
    width: house.supportWidth || Math.max(house.width, 0.71),
    depth: house.supportDepth || Math.max(house.depth, 0.72),
  })),
  TOWN_TOWER,
];
const villageAccess = [...TOWN_HOUSES, TOWN_TOWER].flatMap((house) => [
  { start: houseDoorPoint(house), end: houseApproachPoint(house) },
  { start: houseApproachPoint(house), end: house.lane },
  ...(house.sourceDoor
    ? [
        {
          // Offset doors have straight flights before the garden path turns.
          // Reserve only that narrow flight, as far as the near street margin.
          start: houseDoorPoint(house),
          end: houseDoorPoint({
            ...house,
            doorAlong: Math.max(
              house.supportDepth / 2 + 0.07,
              (house.lane.x - house.x) * Math.sin(house.yaw) +
                (house.lane.z - house.z) * Math.cos(house.yaw) +
                0.16,
            ),
          }),
          halfWidth: 0.125,
        },
      ]
    : []),
]);
const placementAccess = placementBuildings.map((house) => ({
  start: houseDoorPoint(house),
  end: house.lane,
}));

function createTownStation(pointAt, tangentAt) {
  let t = 0,
    nearest = Infinity;
  for (let index = 0; index <= 1536; index++) {
    const point = pointAt(index / 1536);
    const distance = (point.x - 10.4) ** 2 + (point.z - 0.75) ** 2;
    if (distance < nearest) {
      nearest = distance;
      t = index / 1536;
    }
  }
  const track = pointAt(t),
    tangent = tangentAt(t);
  const yaw = Math.atan2(tangent.x, tangent.z);
  const rightX = Math.cos(yaw),
    rightZ = -Math.sin(yaw);
  const accessPoints = [];
  for (let index = 0; index <= 13; index++) {
    const across = -2.04 + index * 0.12;
    accessPoints.push({
      x: track.x + rightX * across + Math.sin(yaw) * 0.68,
      z: track.z + rightZ * across + Math.cos(yaw) * 0.68,
    });
  }
  const doorAccessPoints = Array.from({ length: 5 }, (_, index) => ({
    x: track.x - rightX * 0.67 + Math.sin(yaw) * index * 0.14,
    z: track.z - rightZ * 0.67 + Math.cos(yaw) * index * 0.14,
  }));
  const platform = {
    x: track.x - rightX * 0.4,
    z: track.z - rightZ * 0.4,
    yaw,
    width: 0.35,
    depth: 1.8,
  };
  const station = {
    t,
    track,
    trackYaw: yaw,
    rightX,
    rightZ,
    x: track.x - rightX * 1.03,
    z: track.z - rightZ * 1.03,
    yaw: yaw - Math.PI / 2,
    width: 0.98,
    depth: 0.55,
    platformX: platform.x,
    platformZ: platform.z,
    platform,
    accessPoints,
    doorAccessPoints,
  };
  station.door = houseDoorPoint(station);
  station.lane = townLanePoint((station.z + 2.55) / 6.22);
  return station;
}

const stationPathCache = new WeakMap();
let villagePathCache;
function getTownPaths(station = null) {
  const cached = station ? stationPathCache.get(station) : villagePathCache;
  if (cached) return cached;
  const paths = createTownPaths({
    houses: TOWN_HOUSES,
    tower: TOWN_TOWER,
    lane: TOWN_LANE,
    station,
    approachPoint: houseApproachPoint,
  });
  if (station) stationPathCache.set(station, paths);
  else villagePathCache = paths;
  return paths;
}
const pathSample = {};

function townPlantClearance(x, z, station = null, historicalPlacement = false) {
  // Most vegetation candidates are well outside this small village.
  const region = Math.max(7.2 - x, x - 11.5, -2.9 - z, z - 4.1);
  if (region > 0.45) return region;
  let distance = Infinity;
  for (const house of historicalPlacement
    ? placementBuildings
    : villageBuildings)
    distance = Math.min(distance, footprintDistance(x, z, house));
  for (const access of historicalPlacement ? placementAccess : villageAccess)
    distance = Math.min(
      distance,
      segmentDistance(x, z, access.start, access.end) -
        (access.halfWidth ?? 0.105),
    );
  const lane = historicalPlacement ? PLACEMENT_LANE : TOWN_LANE;
  for (let index = 1; index < lane.length; index++)
    distance = Math.min(
      distance,
      segmentDistance(x, z, lane[index - 1], lane[index]) - 0.12,
    );
  if (!historicalPlacement)
    distance = Math.min(
      distance,
      sampleTownPaths(getTownPaths(station), x, z, pathSample).distance,
    );
  if (station) {
    distance = Math.min(distance, footprintDistance(x, z, station));
    distance = Math.min(
      distance,
      footprintDistance(x, z, station.platform, 0.025),
    );
    const access = station.accessPoints;
    distance = Math.min(
      distance,
      segmentDistance(x, z, access[0], access.at(-1)) - 0.12,
    );
    const doorAccess = station.doorAccessPoints;
    distance = Math.min(
      distance,
      segmentDistance(x, z, doorAccess[0], doorAccess.at(-1)) - 0.12,
    );
    distance = Math.min(
      distance,
      segmentDistance(x, z, station.door, station.lane) - 0.105,
    );
  }
  return distance;
}

export {
  TOWN_HOUSES,
  TOWN_LANE,
  TOWN_TOWER,
  createTownStation,
  houseDoorPoint,
  houseApproachPoint,
  townLanePoint,
  townPlantClearance,
  getTownPaths,
};
