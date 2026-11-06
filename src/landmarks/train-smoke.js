import { ThreeColor, ThreeVector3 } from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { clamp, createSeededRandom } from "../core/math.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import { ChimneySmoke } from "../life/smoke.js";

// The imported engine faces +Z. Measure the top ring of its front chimney,
// excluding the rear cab roof and the smaller dome in the middle of the boiler.
function importedTrainChimney(geometry) {
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const front = max.z - (max.z - min.z) * 0.28;
  const middleX = (min.x + max.x) * 0.5;
  const halfWidth = (max.x - min.x) * 0.2;
  const positions = geometry.attributes.position;
  let top = -Infinity;
  for (let index = 0; index < positions.count; index++)
    if (
      positions.getZ(index) > front &&
      Math.abs(positions.getX(index) - middleX) < halfWidth
    )
      top = Math.max(top, positions.getY(index));
  let minX = Infinity,
    maxX = -Infinity,
    minZ = Infinity,
    maxZ = -Infinity;
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index),
      y = positions.getY(index),
      z = positions.getZ(index);
    if (
      z <= front ||
      Math.abs(x - middleX) >= halfWidth ||
      y < top - (max.y - min.y) * 0.015
    )
      continue;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }
  return new ThreeVector3((minX + maxX) * 0.5, top, (minZ + maxZ) * 0.5);
}

class TrainSmoke {
  constructor(town) {
    this.town = town;
    this.origin = new ThreeVector3();
    this.environment = { fire: 0.45, rain: 0 };
    this.resetCount = town.resetCount;
    this.emitting = false;
    this.offScenario = town.ctx.events?.on?.("scenario", () => this.reset());
  }

  update(dt) {
    if (this.disposed) return;
    const { town } = this;
    const { ctx } = town;
    const engine = town.cars[0];
    if (!engine?.smokeAnchor) return;
    engine.group.updateWorldMatrix(true, false);
    this.origin.copy(engine.smokeAnchor).applyMatrix4(engine.group.matrixWorld);
    if (this.resetCount !== town.resetCount) this.reset();
    // Geometry-only fixtures can construct the railway without a particle scene.
    if (!ctx.camera || !ctx.wind?.sample || !ctx.quality?.pick) return;
    if (!this.smoke) {
      this.smoke = new ChimneySmoke(ctx, town.group, this.origin, {
        tint: new ThreeColor(0.94, 0.97, 1),
        random: createSeededRandom(71363),
      });
      this.smoke.mesh.name = "train-chimney-smoke";
    }
    this.smoke.origin.copy(this.origin);
    const insideMap =
      Math.abs(this.origin.x) < LANDSCAPE_BOUNDS.halfW - 0.08 &&
      Math.abs(this.origin.z) < LANDSCAPE_BOUNDS.halfD - 0.08;
    const underground =
      insideMap &&
      terrainHeight(this.origin.x, this.origin.z) > this.origin.y - 0.02;
    this.emitting = insideMap && !underground;
    this.smoke.emission = this.emitting ? 1 : 0;
    if (!this.emitting) this.smoke.acc = 0;
    this.environment.rain = clamp((ctx.world?.rainfall ?? 0) * 1.2, 0, 1);
    // The shared smoke shader uses world-space particle positions. Only new
    // puffs follow the chimney; older puffs keep drifting behind the engine.
    this.smoke.update(Math.min(Math.max(dt, 0), 0.1), 0, this.environment);
  }

  reset() {
    this.resetCount = this.town.resetCount;
    this.smoke?.clear();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.offScenario?.();
    this.smoke?.dispose();
  }
}

export { TrainSmoke, importedTrainChimney };
