import { ThreeVector3 } from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "./config.js";
import { CAMERA_PRESETS, CAMERA_PRESET_ALIASES } from "./camera-presets.js";
import { explorationObstacleDistance } from "../layout/exploration-layout.js";

// Probe the short arm behind the traveler, using the same ground and building
// footprints as walking. Pull the camera forward before it enters an obstacle.
function createFollowCameraCollision(ctx) {
  const sample = new ThreeVector3();
  const end = new ThreeVector3();
  const clearance = 0.025;
  return (target, desired, out) => {
    const navigation = ctx.modules.character?.navigation;
    if (!navigation) return out.copy(desired);
    end.copy(desired);
    end.x = Math.max(
      -LANDSCAPE_BOUNDS.halfW + clearance,
      Math.min(LANDSCAPE_BOUNDS.halfW - clearance, end.x),
    );
    end.z = Math.max(
      -LANDSCAPE_BOUNDS.halfD + clearance,
      Math.min(LANDSCAPE_BOUNDS.halfD - clearance, end.z),
    );
    const actor = ctx.modules.character.actor;
    if (actor.swimming && Number.isFinite(actor.waterY))
      end.y = Math.max(end.y, actor.waterY + 0.06);
    const distance = target.distanceTo(end);
    const steps = Math.max(1, Math.ceil(distance / 0.025));
    out.copy(target);
    for (let i = 1; i <= steps; i++) {
      sample.lerpVectors(target, end, i / steps);
      if (sample.y < navigation.groundHeight(sample.x, sample.z) + clearance)
        break;
      let blocked = false;
      for (const obstacle of navigation.obstacles) {
        if (
          explorationObstacleDistance(sample.x, sample.z, obstacle) >= clearance
        )
          continue;
        const building = ctx.modules.alpineTown?.buildings?.find(
          (item) =>
            Math.abs(item.x - obstacle.x) < 0.001 &&
            Math.abs(item.z - obstacle.z) < 0.001,
        );
        const ground = ctx.terrain.height(obstacle.x, obstacle.z);
        const top = building
          ? Math.max(building.floor ?? ground, ground) +
            Math.max(building.height ?? 0, building.imported?.size?.y ?? 0)
          : ground + (obstacle.id.startsWith("cabin") ? 1.1 : 0.65);
        if (sample.y <= top + clearance) {
          blocked = true;
          break;
        }
      }
      if (blocked) break;
      out.copy(sample);
    }
    return out;
  };
}

function setupCameraViews(ctx) {
  const rig = ctx.cameraRig;
  rig.setContext(ctx);
  rig.setFollowCollision(createFollowCameraCollision(ctx));
  ctx.events.on("camera:change", ({ preset }) => {
    if (!preset) return;
    ctx.params.set("cam", preset);
    const url = new URL(location.href);
    url.searchParams.set("cam", preset);
    history.replaceState(history.state, "", url);
  });
  ctx.selectCameraPreset = (requested) => {
    const name = CAMERA_PRESET_ALIASES[requested] || requested;
    if (!Object.hasOwn(CAMERA_PRESETS, name)) return false;
    if (ctx.photo?.active) return ctx.photo.selectPreset(name);
    if (ctx.exploration?.active || ctx.exploration?.pending) {
      // Leaving walking restores its saved orbit. Start this deliberate camera
      // change from the actual eye position instead, so there is no first-frame jump.
      const camera = ctx.camera;
      const position = camera.position.clone();
      const quaternion = camera.quaternion.clone();
      const projection = {
        fov: camera.fov,
        near: camera.near,
        zoom: camera.zoom,
      };
      ctx.exploration.exit();
      camera.position.copy(position);
      camera.quaternion.copy(quaternion);
      Object.assign(camera, projection);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
    }
    return rig.preset(name);
  };
}

export { createFollowCameraCollision, setupCameraViews };
