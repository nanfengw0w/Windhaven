// Assembles woodland, rocks, meadow grass and flowers; owns their shared lifecycle.
import { ThreeGroup, ThreeVector2 } from "../vendor/three-runtime.js";
import { createForestMeshes } from "./forest-materials.js";
import { TreeInteractionController } from "./tree-interaction.js";
import { createFlowerMesh } from "./flowers.js";
import { generateSunflowerMeadow } from "./sunflower-placement.js";
import { createSunflowerMesh, updateSunflowerSeason } from "./sunflowers.js";
import { createWoodlandLayout } from "./woodland-layout.js";
import { createLandscapeRocks } from "./woodland-rocks.js";
import {
  generateLandscapeGrass,
  createLandscapeGrassMeshes,
  updateLandscapeGrassLod,
} from "./landscape-grass.js";
import {
  generateLandscapeFlowers,
  setLandscapeCulling,
} from "./landscape-flowers.js";
class LandscapeVegetationSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.grassViewportSize = new ThreeVector2();
    this.group = new ThreeGroup();
    this.group.name = "landscape-vegetation";
    const atlas = ctx.modules.vegetation?.atlas;
    if (!atlas)
      throw new Error(
        "Landscape vegetation requires the original foliage atlas",
      );
    const localLayout = createWoodlandLayout(
      ctx.quality.pick("low", "medium", "high"),
    );
    this.plants = localLayout.plants;
    this.rocks = localLayout.rocks;
    this.interaction = new TreeInteractionController(ctx, this.plants, {
      name: "landscape-vegetation",
    });
    this.shakeTexture = this.interaction.shakeTexture;
    this.forest = createForestMeshes(ctx, this.plants, {
      uVegShake: {
        value: this.shakeTexture,
      },
      uLeafAtlas: {
        value: atlas,
      },
    });
    this.woodland = new ThreeGroup();
    this.woodland.name = "landscape-woodland";
    this.woodland.userData = {
      assetSlot: "landscape-woodland",
      placeholder: true,
      placements: this.plants,
    };
    this.forest.bark.name = "landscape-bark";
    this.forest.foliage.name = "landscape-foliage";
    this.woodland.add(this.forest.bark, this.forest.foliage);
    this.rockMesh = createLandscapeRocks(ctx, this.rocks);

    // Preserve the original sampling sequence; ruins clear groundcover locally.
    const obstacles = localLayout.groundcoverObstacles;
    const grass = generateLandscapeGrass(
      ctx,
      obstacles.plants,
      obstacles.rocks,
    );
    const flowerData = generateLandscapeFlowers(
      ctx.quality.pick(700, 1400, 2200),
      [...(ctx.modules.vegetation?.plants ?? []), ...obstacles.plants],
      [...(ctx.modules.terrain?.rocks ?? []), ...obstacles.rocks],
    );
    this.grass = new ThreeGroup();
    this.grassMeshes = createLandscapeGrassMeshes(ctx, grass.data);
    this.grass.add(...this.grassMeshes);
    this.flowers = createFlowerMesh(ctx, flowerData);
    const sunflowerData = generateSunflowerMeadow(
      ctx.quality.pick(700, 1200, 1800),
      [...(ctx.modules.vegetation?.plants ?? []), ...obstacles.plants],
      [...(ctx.modules.terrain?.rocks ?? []), ...obstacles.rocks],
    );
    this.sunflowers = createSunflowerMesh(ctx, sunflowerData);
    this.grass.name = "world-grass";
    this.flowers.name = "landscape-flowers";
    this.grass.userData.assetSlot = "landscape-grass";
    this.flowers.userData.assetSlot = "landscape-flowers";
    this.grass.userData.placeholder = this.flowers.userData.placeholder = true;
    setLandscapeCulling(this.flowers);
    this.group.add(
      this.woodland,
      this.rockMesh,
      this.grass,
      this.flowers,
      this.sunflowers,
    );
    this.stats = {
      plants: this.plants.length,
      rocks: this.rocks.length,
      grass: grass.data.count,
      grassTiles: this.grassMeshes.length,
      coreGrassArea: grass.coreArea,
      extensionGrassArea: grass.extensionArea,
      coreGrassCount: grass.coreCount,
      flowers: flowerData.count,
      sunflowers: sunflowerData.count,
      sunflowerTriangles:
        (this.sunflowers.geometry.index.count / 3) * sunflowerData.count,
      sunflowerLayout: sunflowerData.stats,
      ...this.forest.stats,
    };
    ctx.scene.add(this.group);
  }
  shake(x, z, radius = 1, strength = 1) {
    this.interaction.shake(x, z, radius, strength);
  }
  update(dt) {
    this.interaction.update(dt);
  }
  beforeRender(dt = 0) {
    if (this.ctx.photo?.active && !this.ctx.photo.timeRunning) {
      updateLandscapeGrassLod(this);
      return;
    }
    this.stats.sunflowerSeason = updateSunflowerSeason(
      this.sunflowers,
      this.ctx.world?.season ?? 0.25,
      this.ctx.world,
      dt,
    );
    updateLandscapeGrassLod(this);
  }
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.interaction.dispose();
    this.group.removeFromParent();
    this.forest.dispose();
    const materials = new Set();
    const geometries = new Set();
    for (const mesh of [
      this.rockMesh,
      ...this.grassMeshes,
      this.flowers,
      this.sunflowers,
    ]) {
      for (const geometry of mesh.userData.grassLod?.geometries ?? [
        mesh.geometry,
      ])
        geometries.add(geometry);
      materials.add(mesh.material);
      mesh.customDepthMaterial?.dispose();
    }
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    // The foliage atlas is shared with the original biome, which retains ownership.
  }
}
export { LandscapeVegetationSystem };
