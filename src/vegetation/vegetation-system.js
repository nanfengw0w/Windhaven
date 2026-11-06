// Reconstructed module: identifiers and file boundaries are refactor choices.
// Vegetation inside the original terrarium bounds: trees, shrubs, flowers and
// reeds. Owns the leaf atlas that the landscape pass reuses.
import { ThreeGroup } from "../vendor/three-runtime.js";
import { placeTreesAndShrubs } from "./tree-placement.js";
import { TreeInteractionController } from "./tree-interaction.js";
import {
  VegetationPlacementMasks,
  generateFlowerInstances,
  generateReedInstances,
} from "./groundcover-placement.js";
import { createFoliageAtlas } from "./foliage-atlas.js";
import { createForestMeshes } from "./forest-materials.js";
import { createReedMeshes } from "./grass-and-reeds.js";
import { createFlowerMesh } from "./flowers.js";
class VegetationSystem {
  constructor(t) {
    this.ctx = t;
    const { quality: e, scene: i } = t,
      n = t.modules.terrain;
    ((this.group = new ThreeGroup()),
      (this.group.name = "vegetation"),
      i.add(this.group),
      (this.plants = placeTreesAndShrubs(
        {
          pine: e.pick(16, 24, 30),
          broad: e.pick(11, 16, 20),
          bush: e.pick(14, 24, 32),
        },
        n,
      )));
    const o = this.plants.length;
    this.interaction = new TreeInteractionController(t, this.plants);
    this.shakeTexture = this.interaction.shakeTexture;
    ((this.atlas = createFoliageAtlas(e.pick(512, 1024, 1024))),
      (this.uniforms = {
        uVegShake: {
          value: this.shakeTexture,
        },
        uLeafAtlas: {
          value: this.atlas,
        },
      }),
      (this.forest = createForestMeshes(t, this.plants, this.uniforms)),
      this.group.add(this.forest.bark, this.forest.foliage));
    const l = new VegetationPlacementMasks(this.plants, n),
      c = (v, g) => t.terrain.height(v, g);
    // Grass is generated once over the complete map by the world vegetation
    // pass. This budget retains the original meadow's blades per suitable area.
    this.grassBudget = e.pick(2e4, 6e4, 12e4);
    const f = generateFlowerInstances(e.pick(1800, 3500, 7e3), l, c);
    this.flowers = createFlowerMesh(t, f);
    const u = generateReedInstances(e.pick(700, 1400, 2200), l, c),
      { reeds: d, heads: p } = createReedMeshes(t, u);
    ((this.reeds = d),
      (this.cattails = p),
      this.group.add(this.flowers, this.reeds, this.cattails),
      (this.stats = {
        plants: o,
        grass: 0,
        grassBudget: this.grassBudget,
        flowers: f.count,
        reeds: u.count,
        ...this.forest.stats,
      }));
  }
  shake(x, z, radius = 1, strength = 1) {
    this.interaction.shake(x, z, radius, strength);
  }
  update(dt) {
    this.interaction.update(dt);
  }
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.interaction.dispose();
    this.group.removeFromParent();
    this.forest.dispose();
    const geometries = new Set();
    const materials = new Set();
    for (const mesh of [this.flowers, this.reeds, this.cattails]) {
      geometries.add(mesh.geometry);
      materials.add(mesh.material);
      if (mesh.customDepthMaterial) materials.add(mesh.customDepthMaterial);
    }
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    this.atlas.dispose();
  }
}
export { VegetationSystem };
