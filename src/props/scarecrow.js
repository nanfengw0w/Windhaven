import {
  Ry,
  ThreeGroup,
  ThreeMesh,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { disposeModel } from "../core/model-loading.js";
import { FARM } from "../layout/farm-layout.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import {
  bindImportedWeather,
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

function createFallbackScarecrow(ctx) {
  const root = new ThreeGroup();
  root.name = "procedural-scarecrow";
  const wood = new Ry.MeshStandardMaterial({ color: 0x69503b });
  const cloth = new Ry.MeshStandardMaterial({ color: 0x804a38 });
  const straw = new Ry.MeshStandardMaterial({ color: 0xc9a469 });
  for (const material of [wood, cloth, straw])
    bindImportedWeather(material, ctx);
  function add(geometry, material, y) {
    const mesh = new ThreeMesh(geometry, material);
    mesh.position.y = y;
    mesh.castShadow = mesh.receiveShadow = true;
    root.add(mesh);
  }
  add(new Ry.BoxGeometry(0.05, 0.8, 0.05), wood, 0.4);
  add(new Ry.BoxGeometry(0.88, 0.09, 0.12), cloth, 0.62);
  add(new Ry.CylinderGeometry(0.16, 0.21, 0.31, 8), cloth, 0.52);
  add(new Ry.SphereGeometry(0.125, 8, 6), straw, 0.77);
  add(new Ry.CylinderGeometry(0.16, 0.26, 0.13, 10), straw, 0.935);
  root.scale.setScalar(FARM.scarecrow.height);
  return root;
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
    const { x, z, yaw, burial } = FARM.scarecrow;
    this.group.position.set(x, terrainHeight(x, z) - burial, z);
    this.group.rotation.y = yaw;
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
      const { height } = FARM.scarecrow;
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
        this.fallback = createFallbackScarecrow(ctx);
        this.group.add(this.fallback);
        Object.assign(this.stats, {
          model: "fallback",
          count: 1,
          height: FARM.scarecrow.height,
          drawCalls: this.fallback.children.length,
          triangles: this.fallback.children.reduce(
            (sum, { geometry }) => sum + geometry.index.count / 3,
            0,
          ),
          error: error.message,
        });
        console.warn("[farm] Using procedural scarecrow:", error);
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
    if (this.fallback) disposeModel(this.fallback);
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
