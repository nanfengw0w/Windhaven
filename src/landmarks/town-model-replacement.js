// Asynchronous asset replacement for the town and train.
// Prepare the entire replacement before committing it; retain procedural fallbacks.
import {
  ThreeGroup,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeMesh,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { SCENE_SCALE } from "../layout/world-layout.js";
import { importedTrainChimney } from "./train-smoke.js";
import {
  loadImportedModels,
  disposeImportedModels,
} from "./imported-models.js";
import {
  buildingModelLayout,
  IMPORTED_DOOR_HEIGHT,
} from "../layout/building-model-layout.js";

async function loadTownModels(town, loader = loadImportedModels) {
  if (town.disposed || town.importedModels) return false;
  town.stats.models = "loading";
  let models;
  try {
    models = await loader(town.ctx);
    if (town.disposed) {
      disposeImportedModels(models);
      return false;
    }
    town._applyImportedModels(models);
    town.importedModels = models;
    town.stats.models = "ready";
    return true;
  } catch (error) {
    if (models) disposeImportedModels(models);
    town.stats.models = "failed";
    town.stats.modelError = error.message;
    console.warn("[models] Keeping procedural landmarks:", error);
    return false;
  }
}

function applyTownImportedModels(town, models) {
  for (const id of [
    "cottage",
    "clocktower",
    "station",
    "coach",
    "locomotive",
    "house-long",
    "house-inn",
    "house-tall",
  ])
    if (!models.get(id)?.geometry || !models.get(id)?.material)
      throw new Error(`Missing imported model: ${id}`);
  const imported = new ThreeGroup();
  imported.name = "imported-village-models";
  const center = new ThreeVector3();
  const offset = new ThreeMatrix4();
  // Reuse one mesh/material per building type; foundations and steps stay
  // where they were, while each complete model keeps its native proportions.
  for (const id of [
    "cottage",
    "house-long",
    "house-inn",
    "house-tall",
    "station",
    "clocktower",
  ]) {
    const asset = models.get(id);
    const buildings = town.buildings.filter(
      (building) =>
        id ===
        (building.tower
          ? "clocktower"
          : building.station
            ? "station"
            : building.modelId),
    );
    const mesh = new ThreeInstancedMesh(
      asset.geometry,
      asset.material,
      buildings.length,
    );
    mesh.name = `imported-${id}`;
    mesh.userData.assetSlot = id;
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.customDepthMaterial = town.depthMaterial;
    asset.bounds.getCenter(center);
    buildings.forEach((building, index) => {
      // Calibrate by the doorway, not the roof's bounding box: these are
      // two-storey cottages, and fitting them into a one-storey proxy would
      // make their people/doors much smaller than the original cabin.
      const layout = buildingModelLayout(id);
      const { scale, sourceDoorHeight } = layout;
      const matrix = town._frame(
        building.x,
        building.foundationTop,
        building.z,
        building.yaw,
      );
      matrix.scale(new ThreeVector3(scale, scale, scale));
      matrix.multiply(
        offset.makeTranslation(-center.x, -asset.bounds.min.y, -center.z),
      );
      mesh.setMatrixAt(index, matrix);
      building.imported = {
        id,
        scale,
        sourceDoorHeight,
        sourceDoor: layout.sourceDoor,
        doorHeight: IMPORTED_DOOR_HEIGHT,
        wallWidth:
          layout.wallWidth ||
          asset.size.x * scale * (id === "cottage" ? 0.8 : 1),
        wallDepth:
          layout.wallDepth ||
          asset.size.z * scale * (id === "cottage" ? 0.8 : 1),
        size: asset.size.clone().multiplyScalar(scale).toArray(),
      };
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingBox();
    mesh.computeBoundingSphere();
    imported.add(mesh);
  }

  town.windowGlowMaterials = [];
  for (const asset of models.values())
    if (asset.material.userData?.windowGlow)
      town.windowGlowMaterials.push(asset.material);
  const trainMeshes = town.cars.map((car, index) => {
    const id = index ? "coach" : "locomotive";
    const asset = models.get(id);
    const scale = Math.min(
      SCENE_SCALE.trainWidth / asset.size.x,
      SCENE_SCALE.trainHeight / asset.size.y,
      (index ? SCENE_SCALE.coachLength : SCENE_SCALE.engineLength) /
        asset.size.z,
    );
    const mesh = new ThreeMesh(asset.geometry, asset.material);
    asset.bounds.getCenter(center);
    mesh.scale.setScalar(scale);
    mesh.position.set(
      -center.x * scale,
      -asset.bounds.min.y * scale,
      -center.z * scale,
    );
    mesh.name = `imported-${id}-${index}`;
    mesh.userData.assetSlot = index ? "train-coach" : "train-engine";
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.customDepthMaterial = town.depthMaterial;
    mesh.updateMatrix();
    return {
      mesh,
      smokeAnchor: index
        ? null
        : importedTrainChimney(asset.geometry).applyMatrix4(mesh.matrix),
      length: asset.size.z * scale,
      width: asset.size.x * scale,
      height: asset.size.y * scale,
    };
  });

  // Commit only once the complete replacement set has been prepared.
  for (const batch of town.batches.values()) {
    const retained = batch.transforms.filter((_, index) => !batch.slots[index]);
    batch.mesh.count = retained.length;
    batch.mesh.visible = retained.length > 0;
    retained.forEach((matrix, index) => batch.mesh.setMatrixAt(index, matrix));
    batch.mesh.instanceMatrix.needsUpdate = true;
    batch.mesh.computeBoundingBox();
    batch.mesh.computeBoundingSphere();
  }
  town.group.add(imported);
  trainMeshes.forEach(({ mesh, length, width, height, smokeAnchor }, index) => {
    const car = town.cars[index];
    car.group.traverse((object) => {
      if (object.isInstancedMesh) object.dispose();
    });
    car.group.clear();
    car.group.add(mesh);
    car.length = length;
    car.wheelbase = length * (index ? 0.65 : 0.62);
    car.offset = index
      ? town.cars[index - 1].offset +
        town.cars[index - 1].length / 2 +
        length / 2 +
        0.075
      : 0;
    car.imported = { width, height, length };
    car.smokeAnchor = smokeAnchor;
  });
  town.wheelMesh.visible = false;
  town.stats.importedAssets = models.size;
  town.stats.staticDrawCalls =
    [...town.batches.values()].filter((batch) => batch.mesh.visible).length +
    imported.children.length;
  town.stats.trainDrawCalls = trainMeshes.length + 1;
  town.update(0);
}

export { loadTownModels, applyTownImportedModels };
