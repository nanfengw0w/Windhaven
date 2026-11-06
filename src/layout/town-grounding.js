// Each building settles into its own small patch of the existing meadow.
// A caller supplies the unmodified terrain sampler: never recurse through the
// final terrainHeight while calculating a building's resting height.
import { clamp, smoothstep } from "../core/math.js";
import {
  TOWN_HOUSES,
  TOWN_TOWER,
  createTownStation,
  houseDoorPoint,
} from "./town-layout.js";
import {
  railwayPoint,
  railwayRouteDistance,
  railwayTangent,
} from "./world-layout.js";

const groundingCache = new WeakMap();
let activeGrounding;

function buildingFootprint(layout) {
  const cottage = layout.modelId === "cottage";
  const station = layout.modelId === "station";
  return {
    width:
      (layout.supportWidth || Math.max(layout.width, cottage ? 0.71 : 0)) +
      0.04,
    depth:
      (layout.supportDepth ||
        Math.max(layout.depth, cottage ? 0.72 : station ? 0.64 : 0)) + 0.04,
  };
}

function makeBuildingGround(layout, sampleNatural, index) {
  const footprint = buildingFootprint(layout);
  const cos = Math.cos(layout.yaw);
  const sin = Math.sin(layout.yaw);
  const samples = [];
  for (let row = 0; row <= 8; row++) {
    for (let column = 0; column <= 8; column++) {
      const across = (column / 8 - 0.5) * footprint.width;
      const along = (row / 8 - 0.5) * footprint.depth;
      samples.push(
        sampleNatural(
          layout.x + across * cos + along * sin,
          layout.z - across * sin + along * cos,
        ),
      );
    }
  }
  samples.sort((a, b) => a - b);
  const door = houseDoorPoint(layout);
  const naturalCenterY = sampleNatural(layout.x, layout.z);
  const naturalDoorY = sampleNatural(door.x, door.z);
  const naturalMedianY = samples[Math.floor(samples.length / 2)];
  const naturalMinY = samples[0];
  const naturalMaxY = samples.at(-1);
  // Close houses share the hillside grade, rather than individually cutting
  // flat pads at unrelated center heights and creating cliffs between them.
  // These small cut/fill corrections move the soil and house together.
  const villageGrade = sampleNatural(7.6, -0.65) + 0.067;
  const targetY =
    index < 4
      ? villageGrade -
        (layout.z + 0.65) * 0.06 +
        (layout.x - 7.6) * 0.03 -
        (index === 2 ? 0.04 : index === 3 ? 0.007 : 0)
      : index === 4
        ? villageGrade - 0.04
        : index === 5
          ? villageGrade - 0.01
          : index === 7
            ? villageGrade + 0.05
            : naturalCenterY * 0.5 + naturalDoorY * 0.3 + naturalMedianY * 0.2;
  const shoulder =
    index < 4
      ? 0.85
      : index === 4 || index === 5 || index === 7
        ? 0.65
        : 0.27 + 0.06 * clamp((naturalMaxY - naturalMinY) / 0.4, 0, 1);
  const extentX =
    (Math.abs(cos) * footprint.width) / 2 +
    (Math.abs(sin) * footprint.depth) / 2 +
    shoulder +
    0.02;
  const extentZ =
    (Math.abs(sin) * footprint.width) / 2 +
    (Math.abs(cos) * footprint.depth) / 2 +
    shoulder +
    0.02;
  return Object.freeze({
    index,
    layout,
    x: layout.x,
    z: layout.z,
    yaw: layout.yaw,
    cos,
    sin,
    targetY,
    footprintWidth: footprint.width,
    footprintDepth: footprint.depth,
    shoulder,
    naturalCenterY,
    naturalDoorY,
    naturalMedianY,
    naturalMinY,
    naturalMaxY,
    naturalSamples: Object.freeze(samples),
    minX: layout.x - extentX,
    maxX: layout.x + extentX,
    minZ: layout.z - extentZ,
    maxZ: layout.z + extentZ,
  });
}

function createTownGrounding(sampleNatural) {
  if (typeof sampleNatural !== "function")
    throw new TypeError("Town grounding requires the natural terrain sampler");
  const cached = groundingCache.get(sampleNatural);
  if (cached) return cached;
  const station = {
    ...createTownStation(railwayPoint, railwayTangent),
    modelId: "station",
  };
  const sites = Object.freeze(
    [...TOWN_HOUSES, { ...TOWN_TOWER, modelId: "clocktower" }, station].map(
      (layout, index) => makeBuildingGround(layout, sampleNatural, index),
    ),
  );
  const grounding = {
    sites,
    getBuilding(layout) {
      const site = sites.find(
        (candidate) =>
          Math.abs(candidate.x - layout.x) < 1e-7 &&
          Math.abs(candidate.z - layout.z) < 1e-7,
      );
      if (!site)
        throw new Error("No village grounding at the supplied location");
      return site;
    },
    height(x, z, naturalHeight = sampleNatural(x, z)) {
      // The original terrain and its normal-sampling collar remain exact.
      if (x <= 6.55 || x > 11 || z < -3.4 || z > 4.7) return naturalHeight;
      let weightedHeight = naturalHeight;
      let weightSum = 1;
      let railProtection;
      for (const site of sites) {
        if (x < site.minX || x > site.maxX || z < site.minZ || z > site.maxZ)
          continue;
        const dx = x - site.x;
        const dz = z - site.z;
        const across = dx * site.cos - dz * site.sin;
        const along = dx * site.sin + dz * site.cos;
        const outside = Math.hypot(
          Math.max(0, Math.abs(across) - site.footprintWidth / 2),
          Math.max(0, Math.abs(along) - site.footprintDepth / 2),
        );
        const feather =
          site.shoulder +
          0.02 * Math.sin(x * 4.7 + z * 2.3) * Math.cos(z * 3.8 - x * 1.4);
        if (outside >= feather) continue;
        railProtection ??=
          x > 9.1 ? smoothstep(0.3, 0.38, railwayRouteDistance(x, z)) : 1;
        // Broad village grades use ordinary smooth shoulders so adjacent
        // heights meet gradually. Isolated narrow patches stay flatter at the
        // wall to keep the low-resolution terrain below the model's feet.
        const weight =
          (1 -
            smoothstep(0, feather, outside) ** (site.shoulder > 0.6 ? 1 : 2)) *
          smoothstep(6.55, 6.65, x) *
          railProtection;
        if (weight <= 0) continue;
        if (weight > 1 - 1e-9) return site.targetY;
        // Blend overlapping soft shoulders without a hard nearest-pad seam.
        // With one pad this is exactly lerp(naturalHeight, targetY, weight).
        const odds = weight / (1 - weight);
        weightedHeight += odds * site.targetY;
        weightSum += odds;
      }
      return weightedHeight / weightSum;
    },
  };
  groundingCache.set(sampleNatural, grounding);
  activeGrounding = grounding;
  return grounding;
}

function getTownBuildingGround(layout, sampleNatural) {
  const grounding = sampleNatural
    ? createTownGrounding(sampleNatural)
    : activeGrounding;
  if (!grounding)
    throw new Error(
      "Initialize village grounding with the natural terrain sampler first",
    );
  return grounding.getBuilding(layout);
}

export { createTownGrounding, getTownBuildingGround };
