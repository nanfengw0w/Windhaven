// Camera-following studio background; independent of scene geometry.
import { ThreeColor, ThreeVector3 } from "../vendor/three-runtime.js";
import { TERRARIUM_BOUNDS } from "../core/config.js";
import { lerp } from "../core/math.js";
import { createBackdropUniforms } from "./backdrop-uniforms.js";
import { createBackdropMesh } from "./backdrop-mesh.js";
const goldenHaloColor = new ThreeColor(1.3, 0.92, 0.68);
const nightHaloColor = new ThreeColor(0.8, 0.9, 1.2);

// Preserve the original halo placement without changing terrain or camera bounds.
const haloTarget = new ThreeVector3(
  0,
  (TERRARIUM_BOUNDS.bottomY + TERRARIUM_BOUNDS.topY) * 0.5 - 0.6,
  0,
);

class BackdropSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.studio = createBackdropUniforms();
    this.cameraPosition = new ThreeVector3();
    this.backdrop = createBackdropMesh(ctx, this.studio);
    // The background must not be rendered into the water reflection.
    this.backdrop.userData.noReflect = true;
    ctx.scene.add(this.backdrop);
  }

  update() {
    const { world, camera } = this.ctx;
    const studio = this.studio;
    studio.uBdRoom.value.copy(world.roomColor);
    camera.getWorldPosition(this.cameraPosition);
    // Keep the same directional backdrop behind the scene at wider overview zooms.
    this.backdrop.position.copy(this.cameraPosition);
    this.backdrop.scale.setScalar(camera.far / 100);
    studio.uHaloDir.value.copy(haloTarget).sub(this.cameraPosition).normalize();
    studio.uHalo.value =
      lerp(1, 0.6, world.night) * (1 - 0.3 * world.storminess) +
      world.flash * 0.6;
    studio.uHaloTint.value
      .setRGB(1.12, 1, 0.84)
      .lerp(goldenHaloColor, world.golden * 0.7)
      .lerp(nightHaloColor, world.night);
  }

  beforeRender() {
    // This update only derives visual uniforms and placement from the frozen
    // world and the current camera; it does not advance clocks or simulation.
    if (this.ctx.photo?.active && !this.ctx.photo.timeRunning) this.update();
  }
}

export { BackdropSystem };
