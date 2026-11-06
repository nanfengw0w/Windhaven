import { createSeededRandom } from "../core/math.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import { Ry, ThreeMesh, ThreeVector3 } from "../vendor/three-runtime.js";
import { createDressedStoneGeometry } from "../landmarks/dressed-stone.js";
import { PropGeometryBuilder } from "./geometry.js";
import {
  loadImportedModels,
  disposeImportedModels,
} from "../landmarks/imported-models.js";
import { createMapClippedDepthMaterial } from "../landmarks/map-clipping.js";
import {
  MOUNTAIN_RUINS,
  RUIN_MODEL_SCALE,
} from "../layout/mountain-ruins-layout.js";

const MOUNTAIN_RUIN_ASSETS = [
  {
    id: "mountain-ruin",
    mesh: new URL(
      "../../assets/imported-models/mountain-ruin.mesh",
      import.meta.url,
    ),
    texture: new URL(
      "../../assets/imported-models/mountain-ruin.webp",
      import.meta.url,
    ),
  },
];

function loadMountainRuinAsset(ctx, options = {}) {
  return loadImportedModels(ctx, { ...options, assets: MOUNTAIN_RUIN_ASSETS });
}

function groundMountainRuin(geometry) {
  const layout = MOUNTAIN_RUINS;
  const scale = RUIN_MODEL_SCALE;
  const positions = geometry.attributes.position;
  geometry.computeBoundingBox();
  const box = geometry.boundingBox.clone();
  const center = box.getCenter(new ThreeVector3());
  const cosine = Math.cos(layout.yaw),
    sine = Math.sin(layout.yaw);
  function worldPoint(index) {
    const x = (positions.getX(index) - center.x) * scale;
    const z = (positions.getZ(index) - center.z) * scale;
    return {
      x: layout.x + x * cosine + z * sine,
      z: layout.z - x * sine + z * cosine,
    };
  }
  let baseY = -Infinity;
  // 用入口最低一阶找落地高度，避免后坡最高点把整座遗迹抬起来。
  for (let i = 0; i < positions.count; i++) {
    if (
      Math.abs(positions.getX(i) - center.x) > 0.07 ||
      positions.getZ(i) < box.max.z - 0.025 ||
      positions.getY(i) > box.min.y + 0.015
    )
      continue;
    const p = worldPoint(i);
    baseY = Math.max(
      baseY,
      terrainHeight(p.x, p.z) - positions.getY(i) * scale,
    );
  }
  if (!Number.isFinite(baseY))
    throw new Error("Ruin entrance has no ground contact samples");
  baseY -= 0.004;
  const normals = geometry.attributes.normal;
  for (let i = 0; i < positions.count; i++) {
    const p = worldPoint(i);
    const y = positions.getY(i);
    positions.setXYZ(i, p.x, baseY + y * scale, p.z);
    const nx = normals.getX(i),
      ny = normals.getY(i),
      nz = normals.getZ(i);
    normals.setXYZ(i, cosine * nx + sine * nz, ny, -sine * nx + cosine * nz);
  }
  positions.needsUpdate = normals.needsUpdate = true;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return { baseY, scale };
}

function createRuinFoundation(ruins, geometry, baseY) {
  // 依实际模型底面取样，石基填平坡差；不拉长原石阶、碎石或贴图。
  const material = new Ry.MeshBasicMaterial({ side: Ry.DoubleSide });
  const probe = new ThreeMesh(geometry, material);
  probe.updateMatrixWorld(true);
  const ray = new Ry.Raycaster();
  ray.ray.direction.set(0, -1, 0);
  const box = geometry.boundingBox;
  const builder = new PropGeometryBuilder();
  const stoneContext = {
    frame: ruins.frame,
    random: createSeededRandom(261027),
    template: createDressedStoneGeometry(),
    stoneCount: 0,
  };
  const contacts = [];
  const step = 0.085;
  for (let z = box.min.z + step / 2; z < box.max.z; z += step) {
    for (let x = box.min.x + step / 2; x < box.max.x; x += step) {
      ray.ray.origin.set(x, box.max.y + 0.1, z);
      const hit = ray.intersectObject(probe).at(-1);
      // 扫到高墙/门洞上沿不代表有底盘，不能沿它堆出填窗的石柱。
      if (!hit || hit.point.y > baseY + 0.13) continue;
      const ground = terrainHeight(x, z);
      const top = Math.min(hit.point.y + 0.008, baseY + 0.018);
      if (top < ground + 0.015) continue;
      const bottom =
        Math.min(
          ground,
          ...[-1, 1].flatMap((a) =>
            [-1, 1].map((b) =>
              terrainHeight(x + (a * step) / 2, z + (b * step) / 2),
            ),
          ),
        ) - 0.018;
      const courses = Math.ceil((top - bottom) / 0.065);
      const height = (top - bottom) / courses;
      for (let course = 0; course < courses; course++) {
        ruins._stone.call(
          stoneContext,
          builder,
          x - ruins.layout.x,
          bottom + height * (course + 0.5),
          z - ruins.layout.z,
          step * 1.02,
          height * 1.12,
          step * 1.02,
          0,
        );
      }
      contacts.push({ x, z, bottom, ground, top, underside: hit.point.y });
    }
  }
  stoneContext.template.dispose();
  material.dispose();
  const mesh = new ThreeMesh(builder.toGeometry(), ruins.material);
  mesh.name = "mountain-ruin-hillside-foundation";
  mesh.castShadow = mesh.receiveShadow = true;
  return { mesh, contacts, stones: stoneContext.stoneCount };
}

async function attachMountainRuinModel(ruins, loader = loadMountainRuinAsset) {
  if (ruins.disposed || ruins.importedModels) return false;
  ruins.stats.model = "loading";
  let models, depthMaterial, foundation;
  try {
    models = await loader(ruins.ctx);
    if (ruins.disposed) {
      disposeImportedModels(models);
      return false;
    }
    const asset = models.get("mountain-ruin");
    if (!asset?.geometry || !asset.material)
      throw new Error("Missing ruin mesh or texture");
    const grounding = groundMountainRuin(asset.geometry);
    foundation = createRuinFoundation(ruins, asset.geometry, grounding.baseY);
    asset.material.roughness = 0.92;
    const mesh = new ThreeMesh(asset.geometry, asset.material);
    mesh.name = "imported-mountain-ruin";
    mesh.userData.assetSlot = "mountain-ruin";
    mesh.castShadow = mesh.receiveShadow = true;
    depthMaterial = createMapClippedDepthMaterial();
    mesh.customDepthMaterial = depthMaterial;
    ruins.group.add(mesh, foundation.mesh);
    ruins.mesh.visible = false;
    ruins.importedMesh = mesh;
    ruins.importedModels = models;
    ruins.importedDepthMaterial = depthMaterial;
    ruins.importedFoundation = foundation;
    Object.assign(ruins.stats, {
      model: "ready",
      vertices: asset.geometry.attributes.position.count,
      triangles: asset.geometry.index.count / 3,
      foundationTriangles: foundation.mesh.geometry.index.count / 3,
      drawCalls: 2,
      grounding,
    });
    return true;
  } catch (error) {
    if (models) disposeImportedModels(models);
    foundation?.mesh.geometry.dispose();
    depthMaterial?.dispose();
    if (!ruins.disposed) {
      ruins.stats.model = "failed";
      ruins.stats.modelError = error.message;
      console.error("[ruins] Keeping procedural fallback:", error);
    }
    return false;
  }
}

function disposeMountainRuinModel(ruins) {
  ruins.importedFoundation?.mesh.removeFromParent();
  ruins.importedFoundation?.mesh.geometry.dispose();
  ruins.importedFoundation = null;
  ruins.importedMesh?.removeFromParent();
  if (ruins.importedModels) disposeImportedModels(ruins.importedModels);
  ruins.importedDepthMaterial?.dispose();
  ruins.importedModels =
    ruins.importedMesh =
    ruins.importedDepthMaterial =
      null;
}

export {
  loadMountainRuinAsset,
  groundMountainRuin,
  attachMountainRuinModel,
  disposeMountainRuinModel,
};
