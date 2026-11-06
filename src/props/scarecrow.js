import {
  ThreeGroup,
  ThreeMesh,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { FARM } from "../layout/farm-layout.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import {
  disposeImportedModels,
  loadImportedModels,
} from "../landmarks/imported-models.js";
import { createMapClippedDepthMaterial } from "../landmarks/map-clipping.js";
import { ScarecrowMotion } from "./scarecrow-motion.js";
import { bindScarecrowMotion } from "./scarecrow-material.js";

const SCARECROW_ASSETS = [
  {
    id: "scarecrow",
    mesh: new URL(
      "../../assets/imported-models/scarecrow.mesh",
      import.meta.url,
    ),
    texture: new URL(
      "../../assets/imported-models/scarecrow.webp",
      import.meta.url,
    ),
  },
];

function loadScarecrowModel(ctx, options = {}) {
  return loadImportedModels(ctx, { ...options, assets: SCARECROW_ASSETS });
}

class FarmScarecrow {
  constructor(ctx, parent = ctx.scene, { loader = loadScarecrowModel } = {}) {
    this.group = new ThreeGroup();
    this.group.name = "farm-scarecrow";
    this.stats = { model: "loading", count: 0, drawCalls: 0, triangles: 0 };
    this.mesh = null;
    this.models = null;
    this.depthMaterial = null;
    this.motion = new ScarecrowMotion(ctx);
    parent.add(this.group);
    this.ready = this._load(ctx, loader);
  }

  async _load(ctx, loader) {
    let models;
    try {
      models = await loader(ctx);
      if (this.disposed) {
        disposeImportedModels(models);
        return false;
      }
      const asset = models.get("scarecrow");
      if (!asset?.geometry || !asset.material || !(asset.size?.y > 0))
        throw new Error("Invalid scarecrow model");
      const { x, z, yaw, height, burial } = FARM.scarecrow;
      const center = asset.bounds.getCenter(new ThreeVector3());
      const scale = height / asset.size.y;
      const mesh = new ThreeMesh(asset.geometry, asset.material);
      mesh.name = "imported-scarecrow";
      mesh.userData.assetSlot = "scarecrow";
      mesh.scale.setScalar(scale);
      mesh.position.set(
        -center.x * scale,
        -asset.bounds.min.y * scale,
        -center.z * scale,
      );
      mesh.castShadow = mesh.receiveShadow = true;
      // GPU flutter can move the outer straw beyond the source mesh's bounds.
      mesh.frustumCulled = false;
      this.depthMaterial = createMapClippedDepthMaterial();
      bindScarecrowMotion(mesh.material, asset, this.motion.uniforms);
      bindScarecrowMotion(this.depthMaterial, asset, this.motion.uniforms);
      mesh.customDepthMaterial = this.depthMaterial;
      this.group.position.set(x, terrainHeight(x, z) - burial, z);
      this.group.rotation.y = yaw;
      this.group.add(mesh);
      this.group.updateMatrixWorld(true);
      this.mesh = mesh;
      this.models = models;
      Object.assign(this.stats, {
        model: "ready",
        count: 1,
        drawCalls: 1,
        triangles: asset.geometry.index.count / 3,
        height,
      });
      return true;
    } catch (error) {
      if (models) disposeImportedModels(models);
      this.depthMaterial?.dispose();
      this.depthMaterial = null;
      this.motion.dispose();
      if (!this.disposed) {
        this.stats.model = "failed";
        this.stats.error = error.message;
        console.error("[farm] Could not load scarecrow:", error);
      }
      return false;
    }
  }

  update(dt) {
    if (!this.disposed && this.mesh) this.motion.update(dt);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.motion.dispose();
    this.group.removeFromParent();
    this.group.clear();
    if (this.models) disposeImportedModels(this.models);
    this.models = null;
    this.mesh = null;
    this.depthMaterial?.dispose();
    this.depthMaterial = null;
    this.stats.model = "disposed";
    this.stats.count = this.stats.drawCalls = 0;
  }
}

export { FarmScarecrow, loadScarecrowModel };
