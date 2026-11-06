import { ThreeMathUtils, ThreeVector3 } from "../vendor/three-runtime.js";
import { clamp, damp } from "./math.js";
import { LANDSCAPE_BOUNDS } from "./config.js";
import { CAMERA_PRESETS, CAMERA_PRESET_ALIASES } from "./camera-presets.js";

const CAMERA_TRANSITION_SECONDS = 3;

function nearestCameraAngle(from, to) {
  return from + Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

function copyCameraTransition(transition) {
  return transition
    ? {
        ...transition,
        target: [...transition.target],
        position: [...transition.position],
        quaternion: [...transition.quaternion],
      }
    : null;
}

class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.target = new ThreeVector3(0, 1.7, 0);
    this.goalTarget = this.target.clone();
    this.theta = 0.38;
    this.phi = 1.13;
    this.radius = 21.5;
    this.goal = { theta: this.theta, phi: this.phi, radius: this.radius };
    this.limits = {
      minPhi: 0.22,
      maxPhi: 1.8,
      minRadius: 0.35,
      maxRadius: 64,
    };
    this.activePreset = "overview";
    this.overview = false;
    this.idle = 0;
    this.shakeAmount = 0;
    this.time = 0;
    this.enabledDrift = false;
    this.fit = 1;
    this._fitGoal = 1;
    this._baseFov = camera.fov;
    this._fovGoal = camera.fov;
    this._defaultNear = camera.near;
    this._nearGoal = camera.near;
    this._followYawOffset = 0;
    this._transition = null;
    this._offset = new ThreeVector3();
    this._desired = new ThreeVector3();
    this._resolved = new ThreeVector3();
    this._viewCamera = camera.clone();
    this.update(0);
  }

  setContext(ctx) {
    this.ctx = ctx;
    return this;
  }

  setFollowCollision(resolve) {
    this._followCollision = resolve;
    return this;
  }

  get following() {
    return this.activePreset === "follow";
  }

  get transitioning() {
    return this._transition !== null;
  }

  _emit() {
    this.ctx?.events?.emit("camera:change", {
      preset: this.activePreset,
      following: this.following,
    });
  }

  preset(name, immediate = false) {
    name = CAMERA_PRESET_ALIASES[name] || name;
    const preset = CAMERA_PRESETS[name];
    if (!preset) return false;
    const delta = this._offset.copy(this.camera.position).sub(this.target);
    const distance = Math.max(delta.length(), 0.01);
    const start = {
      elapsed: 0,
      duration: CAMERA_TRANSITION_SECONDS,
      theta: Math.atan2(delta.x, delta.z),
      phi: Math.acos(clamp(delta.y / distance, -1, 1)),
      radius: distance,
      target: this.target.toArray(),
      position: this.camera.position.toArray(),
      quaternion: this.camera.quaternion.toArray(),
      fov: this.camera.fov,
    };
    this.activePreset = name;
    this.overview = name === "overview";
    this._baseFov = preset.fov ?? 40;
    this._aspect = null;
    this._followYawOffset = 0;
    this.goal.theta = nearestCameraAngle(start.theta, preset.theta ?? 0);
    this.goal.phi = preset.phi ?? 1.15;
    this.goal.radius = preset.radius ?? 0.85;
    if (preset.target) this.goalTarget.fromArray(preset.target);
    if (this.following) this._updateFollowGoal();
    this._updateFit();
    this.poke();
    this._transition = immediate ? null : start;
    if (immediate) this.update(0);
    this._emit();
    return true;
  }

  // Adopt a free photo camera without changing its current frame.
  adoptCamera(manual = false) {
    const distance = Math.max(
      this.camera.position.distanceTo(this.target),
      0.1,
    );
    this.camera.getWorldDirection(this._offset);
    this.target
      .copy(this.camera.position)
      .addScaledVector(this._offset, distance);
    this.goalTarget.copy(this.target);
    this._offset.copy(this.camera.position).sub(this.target);
    this.theta = Math.atan2(this._offset.x, this._offset.z);
    this.phi = Math.acos(clamp(this._offset.y / distance, -1, 1));
    this.radius = distance / (this.fit || 1);
    Object.assign(this.goal, {
      theta: this.theta,
      phi: this.phi,
      radius: this.radius,
    });
    this._baseFov = this.camera.fov;
    this._fovGoal = this.camera.fov;
    this._transition = null;
    if (this.following) {
      const yaw = this.ctx?.modules.character?.actor.yaw ?? 0;
      this._followYawOffset = nearestCameraAngle(yaw, this.theta) - yaw;
    }
    if (manual) this._manual();
  }

  _interrupt() {
    // While approaching a small character, keep closing the distance if the
    // user orbits or zooms. Those gestures refine the destination; stopping
    // the flight here would leave a tiny character viewed from far away.
    if (this._transition && !this.following) this.adoptCamera();
    this.idle = 0;
  }

  rotate(dx, dy) {
    this._interrupt();
    this.goal.theta -= dx * 0.0052;
    this.goal.phi = clamp(
      this.goal.phi - dy * 0.0045,
      this.following ? 0.4 : this.limits.minPhi,
      this.following ? 1.48 : this.limits.maxPhi,
    );
    if (this.following) this._followYawOffset -= dx * 0.0052;
    else this._manual();
  }

  zoom(scale) {
    this._interrupt();
    this.goal.radius = clamp(
      this.goal.radius * scale,
      this.following ? 0.38 : this.limits.minRadius,
      this.following ? 2.4 : this.limits.maxRadius,
    );
    if (!this.following) this._manual();
  }

  pan(dx, dy) {
    this._interrupt();
    if (this.following) this.adoptCamera();
    this._manual();
    const scale = this.radius * (this.fit || 1) * 0.0012;
    const right = new ThreeVector3().setFromMatrixColumn(this.camera.matrix, 0);
    const up = new ThreeVector3().setFromMatrixColumn(this.camera.matrix, 1);
    this.goalTarget
      .addScaledVector(right, -dx * scale)
      .addScaledVector(up, dy * scale);
    this.goalTarget.x = clamp(
      this.goalTarget.x,
      -LANDSCAPE_BOUNDS.halfW + 1,
      LANDSCAPE_BOUNDS.halfW - 1,
    );
    this.goalTarget.y = clamp(
      this.goalTarget.y,
      -0.5,
      LANDSCAPE_BOUNDS.topY - 1,
    );
    this.goalTarget.z = clamp(
      this.goalTarget.z,
      -LANDSCAPE_BOUNDS.halfD + 0.5,
      LANDSCAPE_BOUNDS.halfD - 0.5,
    );
  }

  _manual() {
    if (this.activePreset === null) return;
    this.activePreset = null;
    // Preserve the framing when taking over a fitted overview.
    this._emit();
  }

  shake(amount) {
    this.shakeAmount = Math.max(this.shakeAmount, amount);
  }

  poke() {
    this.idle = 0;
  }

  setDrift(enabled) {
    if (this.enabledDrift && !enabled && !this.following)
      this.goal.theta = this.theta;
    this.enabledDrift = !!enabled;
    this.poke();
  }

  _updateFollowGoal() {
    const character = this.ctx?.modules.character;
    const actor = character?.actor;
    if (!actor || !character.initialized) return;
    const position =
      actor.held && character.group ? character.group.position : actor.position;
    this.goalTarget.set(
      position.x,
      actor.swimming && !actor.held && Number.isFinite(actor.waterY)
        ? Math.max(position.y + 0.13, actor.waterY + 0.07)
        : position.y + 0.13,
      position.z,
    );
    this.goal.theta = nearestCameraAngle(
      this.goal.theta,
      actor.yaw + this._followYawOffset,
    );
  }

  _updateFit() {
    const aspect = this.camera.aspect;
    this._nearGoal =
      this.following || this.goal.radius < 2 ? 0.008 : this._defaultNear;
    if (aspect === this._aspect) return;
    this._aspect = aspect;
    this._fovGoal = Math.min(78, this._baseFov + Math.max(0, 1 - aspect) * 16);
    if (this.following) {
      this._fitGoal = 1;
    } else if (this.overview) {
      const extent = Math.hypot(LANDSCAPE_BOUNDS.halfW, LANDSCAPE_BOUNDS.halfD);
      const radius =
        (extent * 2 + 2) /
          (2 * Math.tan(ThreeMathUtils.degToRad(this._fovGoal / 2)) * aspect) +
        extent * 0.6;
      this._fitGoal = Math.max(1, radius / CAMERA_PRESETS.overview.radius);
    } else {
      this._fitGoal = Math.max(
        1,
        (1.5 / aspect) *
          (Math.tan(ThreeMathUtils.degToRad(this._baseFov / 2)) /
            Math.tan(ThreeMathUtils.degToRad(this._fovGoal / 2))),
      );
    }
  }

  _placeCamera() {
    const sinPhi = Math.sin(this.phi);
    this._offset
      .set(
        sinPhi * Math.sin(this.theta),
        Math.cos(this.phi),
        sinPhi * Math.cos(this.theta),
      )
      .multiplyScalar(this.radius * this.fit);
    this.camera.position.copy(this.target).add(this._offset);
    this.camera.lookAt(this.target);
  }

  _updateTransition(dt) {
    const transition = this._transition;
    transition.elapsed = Math.min(transition.duration, transition.elapsed + dt);
    const fraction = transition.elapsed / transition.duration;
    const blend =
      fraction * fraction * fraction * (fraction * (fraction * 6 - 15) + 10);
    this.fit = this._fitGoal;
    this.theta =
      transition.theta +
      (nearestCameraAngle(transition.theta, this.goal.theta) -
        transition.theta) *
        blend;
    this.phi = transition.phi + (this.goal.phi - transition.phi) * blend;
    this.radius =
      (transition.radius +
        (this.goal.radius * this.fit - transition.radius) * blend) /
      this.fit;
    for (const [index, axis] of ["x", "y", "z"].entries())
      this.target[axis] =
        transition.target[index] +
        (this.goalTarget[axis] - transition.target[index]) * blend;
    this._placeCamera();
    this._viewCamera.position.copy(this.camera.position);
    this._viewCamera.lookAt(this.target);
    this.camera.quaternion
      .fromArray(transition.quaternion)
      .slerp(this._viewCamera.quaternion, blend);
    this.camera.fov = transition.fov + (this._fovGoal - transition.fov) * blend;
    // A zero-step update must not jump a free photo view or finish its flight.
    if (fraction === 0) this.camera.position.fromArray(transition.position);
    if (fraction === 1) {
      this.goal.theta = this.theta;
      this._transition = null;
    }
    return blend;
  }

  update(dt) {
    dt = Number.isFinite(dt) ? Math.max(0, dt) : 0;
    this.time += dt;
    this.idle += dt;
    if (this.following) this._updateFollowGoal();
    this._updateFit();
    const oldFov = this.camera.fov;
    const oldNear = this.camera.near;
    let transitionBlend = 1;
    if (this._transition) {
      transitionBlend = this._updateTransition(dt);
      this.camera.near = Math.min(this.camera.near, this._nearGoal);
    } else {
      if (this.enabledDrift && !this.following && this.idle > 30)
        this.goal.theta += Math.sin(this.time * 0.05) * dt * 0.012;
      this.theta = damp(
        this.theta,
        nearestCameraAngle(this.theta, this.goal.theta),
        this.following ? 3 : 7,
        dt,
      );
      this.phi = damp(this.phi, this.goal.phi, 7, dt);
      this.radius = damp(this.radius, this.goal.radius, 6, dt);
      this.fit = damp(this.fit, this._fitGoal, 5, dt);
      this.target.lerp(
        this.goalTarget,
        1 - Math.exp(-dt * (this.following ? 7 : 5)),
      );
      this.camera.fov = damp(this.camera.fov, this._fovGoal, 5, dt);
      if (dt === 0) {
        this.theta = this.goal.theta;
        this.phi = this.goal.phi;
        this.radius = this.goal.radius;
        this.fit = this._fitGoal;
        this.target.copy(this.goalTarget);
        this.camera.fov = this._fovGoal;
      }
      this._placeCamera();
      this.camera.near = this._nearGoal;
    }
    if (this.following && transitionBlend > 0.9 && this._followCollision) {
      this._desired.copy(this.camera.position);
      this._resolved.copy(this._desired);
      this._followCollision(this.target, this._desired, this._resolved);
      this.camera.position.copy(this._resolved);
      this.camera.lookAt(this.target);
    }
    if (
      this.enabledDrift &&
      !this.following &&
      !this._transition &&
      this.idle > 30
    )
      this.camera.position.y += Math.sin(this.time * 0.4) * 0.03;
    if (this.shakeAmount > 0.001) {
      const shake = this.shakeAmount;
      this.camera.position.x += (Math.random() - 0.5) * shake * 0.25;
      this.camera.position.y += (Math.random() - 0.5) * shake * 0.25;
      this.shakeAmount *= Math.exp(-dt * 6);
    }
    if (oldFov !== this.camera.fov || oldNear !== this.camera.near)
      this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
  }

  captureState() {
    const scalars = {};
    for (const key of [
      "theta",
      "phi",
      "radius",
      "idle",
      "time",
      "shakeAmount",
      "enabledDrift",
      "activePreset",
      "overview",
      "fit",
      "_fitGoal",
      "_baseFov",
      "_fovGoal",
      "_defaultNear",
      "_nearGoal",
      "_aspect",
      "_followYawOffset",
    ])
      scalars[key] = this[key];
    return {
      ...scalars,
      target: this.target.toArray(),
      goalTarget: this.goalTarget.toArray(),
      goal: { ...this.goal },
      transition: copyCameraTransition(this._transition),
    };
  }

  restoreState(state) {
    if (!state) return;
    const { target, goalTarget, goal, transition, ...scalars } = state;
    Object.assign(this, scalars);
    this.target.fromArray(target);
    this.goalTarget.fromArray(goalTarget);
    Object.assign(this.goal, goal);
    this._transition = copyCameraTransition(transition);
    this._emit();
  }
}

export { CAMERA_PRESETS, CAMERA_TRANSITION_SECONDS, CameraRig };
