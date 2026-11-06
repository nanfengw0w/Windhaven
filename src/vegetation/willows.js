// The two fixed riverside willows: dedicated strand geometry, bending shader
// and the catkin particle subsystem.
import { ThreeGroup } from "../vendor/three-runtime.js";
import { createForestMeshes } from "./forest-materials.js";
import { TreeInteractionController } from "./tree-interaction.js";
import { createWillowPlants } from "./willow-placement.js";
import {
  appendWillowTree,
  finishWillowGeometry,
  WILLOW_BENDING_GLSL,
} from "./willow-geometry.js";
import { WillowDynamics } from "./willow-dynamics.js";
import { createWillowAtlas } from "./willow-atlas.js";
import { WillowCatkins } from "./willow-catkins.js";

class WillowSystem {
  constructor(ctx, { atlas = null } = {}) {
    this.ctx = ctx;
    this.group = new ThreeGroup();
    this.group.name = "bank-willows";
    ctx.scene.add(this.group);
    this.plants = createWillowPlants(ctx);
    this.catkins = new WillowCatkins(ctx, this.plants, this.group);
    this.interaction = new TreeInteractionController(ctx, this.plants, {
      name: "willows",
      leafEffect: "dedicated",
      onAgitate: (payload, index) => this.catkins.shake(payload, index),
    });
    this.ownsAtlas = !atlas;
    this.atlas = atlas || createWillowAtlas(ctx.quality.pick(512, 512, 1024));
    this.branches = [];
    const motionUniform = { value: null };
    const curveUniform = { value: null };
    this.forest = createForestMeshes(
      ctx,
      this.plants,
      {
        uVegShake: { value: this.interaction.shakeTexture },
        uLeafAtlas: { value: this.atlas },
        uWillowMotion: motionUniform,
        uWillowCurve: curveUniform,
      },
      {
        appendTree: (bark, foliage, plant, index, random) =>
          appendWillowTree(bark, foliage, plant, index, random, this.branches),
        decorateGeometry: finishWillowGeometry,
        bendingGLSL: WILLOW_BENDING_GLSL,
        normalFunction: "willowNormal",
        keyPrefix: "willow-branches-v3",
        bareWinter: true,
        goldenAutumn: true,
      },
    );
    this.dynamics = new WillowDynamics(
      ctx,
      this.plants,
      this.branches,
      this.interaction,
    );
    motionUniform.value = this.dynamics.texture;
    curveUniform.value = this.dynamics.curveTexture;
    this.forest.bark.name = "willow-bark";
    this.forest.foliage.name = "willow-foliage";
    this.group.add(this.forest.bark, this.forest.foliage);
    this.stats = {
      plants: this.plants.length,
      drawCalls: 3,
      ...this.forest.stats,
      particles: this.catkins.stats,
      dynamics: this.dynamics.stats,
    };
    this._offScenario = ctx.events?.on("scenario", () => {
      this.catkins.reset();
      this.dynamics.reset();
    });
    this._offWindStroke = ctx.events?.on("wind:stroke", (payload) => {
      const ray = ctx.input?.pointer?.ray;
      if (!ray || !Number.isFinite(payload.vx) || !Number.isFinite(payload.vz))
        return;
      // The shared canopy picker rejects terrain in front of the tree. The
      // wind tool's ground projection can land well behind this visible crown.
      const hit = this.interaction._pick(ray);
      if (!hit) return;
      const plant = this.plants[hit.index];
      ctx.wind?.addForce?.(
        hit.point.x,
        hit.point.z,
        payload.vx,
        payload.vz,
        Math.max(0.65, plant.pickRadius ?? plant.radius),
        0.8,
      );
    });
  }
  shake(x, z, radius = 1, strength = 1) {
    this.interaction.shake(x, z, radius, strength);
  }
  update(dt) {
    if (this._disposed) return;
    this.interaction.update(dt);
    this.dynamics.update(dt);
    this.catkins.update(dt);
  }
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._offScenario?.();
    this._offWindStroke?.();
    this.interaction.dispose();
    this.dynamics.dispose();
    this.catkins.dispose();
    this.forest.dispose();
    if (this.ownsAtlas) this.atlas.dispose();
    this.group.removeFromParent();
  }
}

export { WillowSystem };
