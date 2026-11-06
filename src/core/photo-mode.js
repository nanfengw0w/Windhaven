import { ThreeEuler, ThreeVector3 } from "../vendor/three-runtime.js";

const PHOTO_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyQ",
  "KeyE",
  "ShiftLeft",
  "ShiftRight",
]);
const PHOTO_PITCH_LIMIT = Math.PI / 2 - 0.02;

// A temporary free camera with optional world playback. The walking actor and
// original camera stay suspended even when the scene is allowed to advance.
class PhotoModeController {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.renderer.domElement;
    this.active = false;
    this.timeRunning = false;
    this.capturing = false;
    this.keys = new Set();
    this.drag = null;
    this._captureId = 0;
    this._listeners = [];
    this._direction = new ThreeVector3();
    this._rotation = new ThreeEuler(0, 0, 0, "YXZ");
    // Initial asset replacement is asynchronous. Do not freeze a fallback
    // building only to have its imported model appear midway through a shot.
    this.ready = false;
    Promise.allSettled([
      ctx.modules.alpineTown?.modelsReady,
      ctx.modules.farm?.scarecrow?.ready,
      ctx.modules.mountainRuins?.modelsReady,
      ctx.modules.character?.ready,
    ]).then(() => {
      this.ready = true;
    });
    this._listen(window, "keydown", (event) => this._key(event, true), true);
    this._listen(window, "keyup", (event) => this._key(event, false), true);
    this._listen(this.canvas, "pointerdown", (event) => this._down(event));
    const stopForControls = (event) => {
      if (
        this.active &&
        event.target?.closest?.(
          ".wg-hud, .wg-photo-actions, .wg-camera-inspector",
        )
      )
        this._clearInput();
    };
    this._listen(window, "pointerdown", stopForControls, true);
    this._listen(window, "focusin", stopForControls, true);
    this._listen(window, "pointermove", (event) => this._move(event));
    this._listen(window, "pointerup", () => this._stopDrag());
    this._listen(window, "pointercancel", () => this._stopDrag());
    this._listen(this.canvas, "lostpointercapture", () => this._stopDrag());
    this._listen(this.canvas, "wheel", (event) => this._wheel(event), {
      passive: false,
    });
    this._listen(window, "blur", () => this._clearInput());
    this._listen(document, "visibilitychange", () => {
      if (document.hidden) this._clearInput();
    });
  }
  _listen(target, name, handler, options = false) {
    target.addEventListener(name, handler, options);
    this._listeners.push(() =>
      target.removeEventListener(name, handler, options),
    );
  }
  _emit() {
    this.ctx.events.emit("photo:change", {
      active: this.active,
      timeRunning: this.timeRunning,
      capturing: this.capturing,
    });
  }
  enter() {
    if (this.active) return;
    if (!this.ready) {
      this.ctx.events.emit("photo:error", {
        message: "场景仍在加载，请稍候再进入拍照模式。",
      });
      return;
    }
    if (this.ctx.exploration.pending) return;
    const { camera, input, exploration } = this.ctx;
    this._saved = {
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
      rotationOrder: camera.rotation.order,
      fov: camera.fov,
      near: camera.near,
      far: camera.far,
      zoom: camera.zoom,
      inputEnabled: input.enabled,
      focus: document.activeElement,
      rig: this.ctx.cameraRig.captureState(),
    };
    this.active = true;
    this.timeRunning = false;
    this._presetCamera = false;
    // Keep the walker's saved overview and vertical velocity intact. The
    // cursor stays free on return; a canvas click recaptures it as usual.
    exploration.releaseCursor();
    input.setEnabled(false);
    this._saved.focus?.blur?.();
    this.speed = exploration.active ? 0.8 : 6;
    camera.near = Math.min(camera.near, 0.008);
    camera.updateProjectionMatrix();
    this._syncAngles();
    this._clearInput();
    this._emit();
  }
  exit() {
    if (!this.active) return;
    this._clearInput();
    this._captureId++;
    this._capturePending = false;
    this.capturing = false;
    this._restoreCamera();
    this.ctx.input.setEnabled(this._saved.inputEnabled);
    this.active = false;
    this.timeRunning = false;
    // Consume the Escape that dismissed photography before the walker's or
    // original HUD's handlers see it, including the keyup and key repeats.
    this.ctx.exploration._suppressEscapeUntil = performance.now() + 250;
    this._suppressEscapeUntil = performance.now() + 250;
    this._emit();
    if (this._saved.focus?.isConnected && !this._saved.focus.closest("[inert]"))
      this._saved.focus.focus({ preventScroll: true });
    this._saved = null;
  }
  _restoreCamera() {
    const { camera } = this.ctx;
    const saved = this._saved;
    this._presetCamera = false;
    this.ctx.cameraRig.restoreState(saved.rig);
    camera.rotation.order = saved.rotationOrder;
    camera.position.copy(saved.position);
    camera.quaternion.copy(saved.quaternion);
    for (const key of ["fov", "near", "far", "zoom"]) camera[key] = saved[key];
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }
  _syncAngles() {
    this._rotation.setFromQuaternion(this.ctx.camera.quaternion, "YXZ");
    this.yaw = this._rotation.y;
    this.pitch = this._rotation.x;
  }
  selectPreset(name) {
    if (!this.active || this.capturing) return false;
    this._clearInput();
    if (!this.ctx.cameraRig.preset(name)) return false;
    this._presetCamera = true;
    return true;
  }
  _takeCameraControl() {
    if (!this._presetCamera) return;
    this._presetCamera = false;
    this.ctx.cameraRig.adoptCamera(true);
    this._syncAngles();
  }
  resetCamera() {
    if (!this.active || this.capturing) return;
    this._clearInput();
    this._restoreCamera();
    this.ctx.camera.near = Math.min(this.ctx.camera.near, 0.008);
    this.ctx.camera.updateProjectionMatrix();
    this._syncAngles();
  }
  toggleTime() {
    if (!this.active || this.capturing) return;
    this.timeRunning = !this.timeRunning;
    this._emit();
  }
  _clearInput() {
    this.keys.clear();
    this._stopDrag();
  }
  _stopDrag() {
    const drag = this.drag;
    this.drag = null;
    if (drag && this.canvas.hasPointerCapture(drag.id))
      this.canvas.releasePointerCapture(drag.id);
  }
  _key(event, down) {
    // Key releases may land on a control after focus changes mid-movement.
    if (!down) this.keys.delete(event.code);
    const editable = event.target?.closest?.(
      "input, textarea, select, [contenteditable=true]",
    );
    if (
      event.code === "KeyP" &&
      !editable &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (down && !event.repeat) this.active ? this.exit() : this.enter();
      return;
    }
    if (
      event.code === "Escape" &&
      (this.active || performance.now() < this._suppressEscapeUntil)
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (down && !event.repeat) this.exit();
      return;
    }
    if (
      !this.active ||
      editable ||
      event.target?.closest?.('[role="slider"]') ||
      !PHOTO_KEYS.has(event.code)
    )
      return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (down && !event.ctrlKey && !event.metaKey && !event.altKey) {
      this._takeCameraControl();
      this.keys.add(event.code);
    } else this.keys.delete(event.code);
  }
  _down(event) {
    if (!this.active || this.capturing) return;
    // The canvas is not focusable; clicking back into the scene must release
    // keyboard focus from the restored climate sliders explicitly.
    document.activeElement?.blur?.();
    if (event.button !== 2) return;
    event.preventDefault();
    this._takeCameraControl();
    this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    this.canvas.setPointerCapture(event.pointerId);
  }
  _move(event) {
    if (
      !this.active ||
      this.capturing ||
      !this.drag ||
      this.drag.id !== event.pointerId
    )
      return;
    this.yaw -= (event.clientX - this.drag.x) * 0.003;
    this.pitch = Math.max(
      -PHOTO_PITCH_LIMIT,
      Math.min(
        PHOTO_PITCH_LIMIT,
        this.pitch - (event.clientY - this.drag.y) * 0.003,
      ),
    );
    this.drag.x = event.clientX;
    this.drag.y = event.clientY;
    this.ctx.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ");
    this.ctx.camera.updateMatrixWorld();
  }
  _wheel(event) {
    if (!this.active) return;
    event.preventDefault();
    if (this.capturing) return;
    this._takeCameraControl();
    const { camera } = this.ctx;
    camera.fov = Math.max(
      15,
      Math.min(100, camera.fov + Math.sign(event.deltaY) * 2),
    );
    camera.updateProjectionMatrix();
  }
  update(dt) {
    if (!this.active || this.capturing) return;
    if (this._presetCamera) {
      this.ctx.cameraRig.update(dt);
      this._syncAngles();
      return;
    }
    const forward =
      Number(this.keys.has("KeyW")) - Number(this.keys.has("KeyS"));
    const sideways =
      Number(this.keys.has("KeyD")) - Number(this.keys.has("KeyA"));
    const vertical =
      Number(this.keys.has("KeyE")) - Number(this.keys.has("KeyQ"));
    const { camera } = this.ctx;
    this._direction
      .set(sideways, 0, -forward)
      .applyQuaternion(camera.quaternion);
    this._direction.y += vertical;
    if (this._direction.lengthSq() > 0) {
      const fast = this.keys.has("ShiftLeft") || this.keys.has("ShiftRight");
      camera.position.addScaledVector(
        this._direction.normalize(),
        this.speed * (fast ? 3 : 1) * Math.min(0.05, Math.max(0, dt)),
      );
      camera.updateMatrixWorld();
    }
  }
  capture() {
    if (!this.active || this.capturing) return;
    this._clearInput();
    this.capturing = true;
    this._capturePending = true;
    this._emit();
  }
  // Called synchronously after the final postprocessed frame. This works with
  // preserveDrawingBuffer=false and excludes every HTML overlay from the PNG.
  afterRender() {
    if (!this.active || !this._capturePending) return;
    this._capturePending = false;
    const id = ++this._captureId;
    const finish = (blob) => {
      if (id !== this._captureId) return;
      this.capturing = false;
      this._emit();
      if (!blob) {
        this.ctx.events.emit("photo:error", {
          message: "照片保存失败，请再次尝试。",
        });
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `windhaven-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      this.ctx.events.emit("photo:saved");
    };
    try {
      this.canvas.toBlob(finish, "image/png");
    } catch {
      finish(null);
    }
  }
  dispose() {
    this.exit();
    for (const remove of this._listeners) remove();
    this._listeners.length = 0;
  }
}

export { PhotoModeController };
