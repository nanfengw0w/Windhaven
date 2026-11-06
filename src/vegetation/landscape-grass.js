// Whole-map meadow placement, spatial mesh batches and camera-driven blade detail.
import {
  ThreeBox3,
  ThreeSphere,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
import { smoothstep } from "../core/math.js";
import { landmarkPlantClearance } from "../layout/world-layout.js";
import { FARM, farmObjectClearance } from "../layout/farm-layout.js";
import {
  WOODWORKING_GROUND_BOUNDS,
  sampleWoodworkingGround,
  woodlandYardObjectClearance,
} from "../layout/woodworking-layout.js";
import {
  HIKING_GROUND_BOUNDS,
  hikingObjectClearance,
  sampleHikingGround,
} from "../layout/hiking-layout.js";
import {
  ruinGroundcoverClearance,
  ruinsInsideBounds,
  sampleRuinsGround,
} from "../layout/mountain-ruins-layout.js";
import { terrainSuitability } from "../simulation/terrain-shape.js";
import { BiomeDensityGrid } from "./tree-placement.js";
import {
  VegetationPlacementMasks,
  generateGrassInstances,
  grassDensityAt,
} from "./groundcover-placement.js";
import { createGrassMesh, createGrassLodGeometry } from "./grass-and-reeds.js";
import {
  grassLodLevels,
  projectedGrassHeight,
  selectGrassLodLevel,
} from "./grass-lod.js";
const farmGrassPoints = [
  [FARM.field.x - FARM.field.width / 2, FARM.field.z - FARM.field.depth / 2],
  [FARM.field.x + FARM.field.width / 2, FARM.field.z + FARM.field.depth / 2],
  ...FARM.obstacles.map(({ x, z }) => [x, z]),
];
const farmGrassBounds = {
  minX: Math.min(...farmGrassPoints.map((point) => point[0])) - 0.6,
  maxX: Math.max(...farmGrassPoints.map((point) => point[0])) + 0.6,
  minZ: Math.min(...farmGrassPoints.map((point) => point[1])) - 0.6,
  maxZ: Math.max(...farmGrassPoints.map((point) => point[1])) + 0.6,
};
// One suitability rule for the whole meadow; only the actual map perimeter
// limits growth. The old core footprint is not a habitat boundary.
function landscapeGrassSuitability(x, z) {
  return (
    smoothstep(-0.12, 0.18, landmarkPlantClearance(x, z)) *
    terrainSuitability(x, z, "grass", LANDSCAPE_BOUNDS)
  );
}
function integrateGrassDensity(biome, masks, bounds, accept = () => true) {
  const step = 0.1;
  let area = 0;
  for (let iz = 0; iz < Math.round((bounds.halfD * 2) / step); iz++) {
    const z = -bounds.halfD + (iz + 0.5) * step;
    for (let ix = 0; ix < Math.round((bounds.halfW * 2) / step); ix++) {
      const x = -bounds.halfW + (ix + 0.5) * step;
      if (accept(x, z))
        area += grassDensityAt(biome, masks, x, z) * step * step;
    }
  }
  return area;
}
function applyFarmGrass(data) {
  let retained = 0;
  for (let index = 0; index < data.count; index++) {
    const source = index * 4;
    const x = data.root[source];
    const z = data.root[source + 2];
    if (
      x < farmGrassBounds.minX ||
      x > farmGrassBounds.maxX ||
      z < farmGrassBounds.minZ ||
      z > farmGrassBounds.maxZ
    ) {
      const target = retained * 4;
      for (const name of ["root", "shape", "tint"])
        data[name].copyWithin(target, source, source + 4);
      retained++;
      continue;
    }
    // Keep meadow grass underneath the wheat. The shared seasonal shader
    // withers it as crops grow; only solid props permanently exclude blades.
    if (farmObjectClearance(x, z) < 0.025) continue;
    const target = retained * 4;
    for (const name of ["root", "shape", "tint"])
      data[name].copyWithin(target, source, source + 4);
    retained++;
  }
  for (const name of ["root", "shape", "tint"])
    data[name] = data[name].subarray(0, retained * 4);
  data.count = retained;
  return data;
}
function generateLandscapeGrass(ctx, plants, rocks) {
  const original = ctx.modules.vegetation;
  const terrain = ctx.modules.terrain;
  const masks = new VegetationPlacementMasks(
    [...original.plants, ...plants],
    {
      bareAt(x, z) {
        let bare = terrain.bareAt(x, z);
        for (const rock of rocks) {
          const distance = Math.hypot(x - rock.x, z - rock.z);
          if (distance < rock.radius * 1.35) {
            bare = Math.max(
              bare,
              (1 -
                smoothstep(rock.radius * 0.7, rock.radius * 1.35, distance)) *
                0.34,
            );
          }
        }
        return bare;
      },
    },
    LANDSCAPE_BOUNDS,
  );
  const biome = new BiomeDensityGrid(
    "grass",
    0.1,
    LANDSCAPE_BOUNDS,
    landscapeGrassSuitability,
  );
  const coreArea = integrateGrassDensity(biome, masks, TERRARIUM_BOUNDS);
  const extensionArea = integrateGrassDensity(
    biome,
    masks,
    LANDSCAPE_BOUNDS,
    (x, z) =>
      Math.abs(x) > TERRARIUM_BOUNDS.halfW ||
      Math.abs(z) > TERRARIUM_BOUNDS.halfD,
  );
  const coreCount = original.grassBudget;
  const count = Math.round((coreCount * (coreArea + extensionArea)) / coreArea);
  // One pass over the complete map: the former core boundary does not appear
  // in rejection sampling, clump generation, root tint or blade construction.
  const data = generateGrassInstances(
    count,
    masks,
    (x, z) => ctx.terrain.height(x, z),
    {
      bounds: LANDSCAPE_BOUNDS,
      biome,
      seed: 6022103,
    },
  );
  return {
    data: applyRuinsGrass(
      applyHikingGrass(applyWoodworkingGrass(applyFarmGrass(data))),
    ),
    coreArea,
    extensionArea,
    coreCount,
  };
}
// Keep irregular grass tufts along the working area's fringe. Filtering after
// generation leaves retained roots, blade shapes and colours untouched.
function applyWoodworkingGrass(data) {
  const { minX, minZ, sizeX, sizeZ } = WOODWORKING_GROUND_BOUNDS;
  const sample = {};
  let retained = 0;
  for (let index = 0; index < data.count; index++) {
    const source = index * 4;
    const x = data.root[source],
      z = data.root[source + 2];
    if (x >= minX && x <= minX + sizeX && z >= minZ && z <= minZ + sizeZ) {
      if (woodlandYardObjectClearance(x, z) < 0.025) continue;
      sampleWoodworkingGround(x, z, sample);
      const worn = smoothstep(0.05, 0.65, sample.coverage) * 0.98;
      if (data.root[source + 3] < worn) continue;
    }
    const target = retained * 4;
    for (const name of ["root", "shape", "tint"])
      data[name].copyWithin(target, source, source + 4);
    retained++;
  }
  for (const name of ["root", "shape", "tint"])
    data[name] = data[name].subarray(0, retained * 4);
  data.count = retained;
  return data;
}
// Retain the existing blades and their attributes everywhere except the
// actual tread and props. Soft, irregular verges keep the path in the meadow.
function applyHikingGrass(data) {
  const { minX, minZ, sizeX, sizeZ } = HIKING_GROUND_BOUNDS;
  const sample = {};
  let retained = 0;
  for (let index = 0; index < data.count; index++) {
    const source = index * 4;
    const x = data.root[source],
      z = data.root[source + 2];
    if (x >= minX && x <= minX + sizeX && z >= minZ && z <= minZ + sizeZ) {
      if (hikingObjectClearance(x, z) < 0.02) continue;
      sampleHikingGround(x, z, sample);
      const worn = smoothstep(0.08, 0.72, sample.coverage) * 0.98;
      if (data.root[source + 3] < worn) continue;
    }
    const target = retained * 4;
    for (const name of ["root", "shape", "tint"])
      data[name].copyWithin(target, source, source + 4);
    retained++;
  }
  for (const name of ["root", "shape", "tint"])
    data[name] = data[name].subarray(0, retained * 4);
  data.count = retained;
  return data;
}
// 只清理模型底盘；底盘外仅沿窄支路稀疏，保留遗迹两侧原有草丛。
function applyRuinsGrass(data) {
  const sample = {};
  let retained = 0;
  for (let index = 0; index < data.count; index++) {
    const source = index * 4;
    const x = data.root[source],
      z = data.root[source + 2];
    if (ruinsInsideBounds(x, z)) {
      if (ruinGroundcoverClearance(x, z) < 0.025) continue;
      sampleRuinsGround(x, z, sample);
      if (data.root[source + 3] < sample.pathCoverage * 0.8) continue;
    }
    const target = retained * 4;
    for (const name of ["root", "shape", "tint"])
      data[name].copyWithin(target, source, source + 4);
    retained++;
  }
  for (const name of ["root", "shape", "tint"])
    data[name] = data[name].subarray(0, retained * 4);
  data.count = retained;
  return data;
}
// Small batches let the renderer cull grass outside a close camera view.
function createLandscapeGrassMeshes(ctx, data) {
  const tiles = new Map();
  for (let index = 0; index < data.count; index++) {
    const x = data.root[index * 4];
    const z = data.root[index * 4 + 2];
    const key = `${Math.floor((x + LANDSCAPE_BOUNDS.halfW) / 4)}:${Math.floor((z + LANDSCAPE_BOUNDS.halfD) / 4)}`;
    if (!tiles.has(key)) tiles.set(key, []);
    tiles.get(key).push(index);
  }
  let sharedMaterial;
  return [...tiles.entries()].map(([key, indices]) => {
    const tile = {
      count: indices.length,
    };
    for (const name of ["root", "shape", "tint"]) {
      tile[name] = new Float32Array(indices.length * 4);
      indices.forEach((source, target) =>
        tile[name].set(
          data[name].subarray(source * 4, source * 4 + 4),
          target * 4,
        ),
      );
    }
    const segments = ctx.quality.pick(3, 4, 5);
    const mesh = createGrassMesh(ctx, tile, segments);
    if (sharedMaterial) {
      mesh.material.dispose();
      mesh.material = sharedMaterial;
    } else sharedMaterial = mesh.material;
    mesh.userData.bladeSegments = segments;
    mesh.name = `landscape-grass-${key}`;
    const box = new ThreeBox3();
    const point = new ThreeVector3();
    let maxBladeHeight = 0;
    for (let index = 0; index < tile.count; index++) {
      maxBladeHeight = Math.max(maxBladeHeight, tile.shape[index * 4]);
      point.fromArray(tile.root, index * 4);
      box.expandByPoint(point);
      point.y += tile.shape[index * 4] + 0.1;
      box.expandByPoint(point);
    }
    box.expandByScalar(0.25);
    mesh.geometry.boundingBox = box;
    mesh.geometry.boundingSphere = box.getBoundingSphere(new ThreeSphere());
    const levels = grassLodLevels(segments);
    mesh.userData.grassLod = {
      levels,
      level: levels.length - 1,
      maxBladeHeight,
      geometries: levels.map((level) =>
        level === segments
          ? mesh.geometry
          : createGrassLodGeometry(mesh.geometry, level),
      ),
    };
    return mesh;
  });
}
function updateLandscapeGrassLod(system) {
  const { camera, renderer } = system.ctx;
  if (!camera || !renderer) return;
  camera.updateMatrixWorld();
  renderer.getDrawingBufferSize(system.grassViewportSize);
  let triangles = 0;
  const counts = {};
  for (const mesh of system.grassMeshes) {
    const lod = mesh.userData.grassLod;
    const pixels = projectedGrassHeight(
      mesh.geometry.boundingSphere,
      lod.maxBladeHeight,
      camera,
      system.grassViewportSize.y,
    );
    lod.level = selectGrassLodLevel(pixels, lod.level, lod.levels);
    mesh.geometry = lod.geometries[lod.level];
    const segments = (mesh.userData.bladeSegments = lod.levels[lod.level]);
    counts[segments] = (counts[segments] || 0) + 1;
    triangles += (mesh.geometry.index.count / 3) * mesh.geometry.instanceCount;
  }
  system.stats.grassTriangles = triangles;
  system.stats.grassLod = counts;
}
export {
  landscapeGrassSuitability,
  integrateGrassDensity,
  applyFarmGrass,
  applyWoodworkingGrass,
  applyHikingGrass,
  applyRuinsGrass,
  generateLandscapeGrass,
  createLandscapeGrassMeshes,
  updateLandscapeGrassLod,
};
