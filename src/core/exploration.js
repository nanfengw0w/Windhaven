import { ExplorationNavigation } from "../simulation/exploration-navigation.js";

const EXPLORATION_SPEED = 0.45;
const EXPLORATION_SWIM_SPEED = 0.2;
const EXPLORATION_SPRINT_MULTIPLIER = 2;
const EXPLORATION_SENSITIVITY = 0.002;
const EXPLORATION_PITCH_LIMIT = Math.PI / 2 - 0.04;
const EXPLORATION_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ShiftLeft",
  "ShiftRight",
]);

// Owns the camera throughout exploration, including the temporary UI cursor.
// CharacterSystem owns the shared feet transform, mesh and animation lifecycle.
class ExplorationController {
  constructor(ctx) {
    const character = ctx.modules?.character;
    this.ctx = ctx;
    this.canvas = ctx.renderer.domElement;
    this.supported = typeof this.canvas.requestPointerLock === "function";
    this.active = false;
    this.pending = false;
    this.cursorFree = false;
    this._requestId = 0;
    this._promiseRequest = false;
    this.navigation = character?.navigation ?? null;
    this.keys = new Set();
    this.yaw = 0;
    this.pitch = 0;
    this.avatar = character?.avatar ?? null;
    // A model-loading failure still leaves navigation usable. Minimal contexts
    // without CharacterSystem retain the standalone exploration fallback.
    this.actor = character?.actor ?? {
      position: { x: 0, y: 0, z: 0 },
      yaw: 0,
      pitch: 0,
      moving: false,
      grounded: true,
      swimming: false,
      surfaceKind: "land",
      waterY: null,
    };
    this._listeners = [];
    this._listen(document, "pointerlockchange", () => this._lockChanged());
    this._listen(document, "pointerlockerror", () => {
      // Promise-based requests identify which attempt failed. The legacy
      // event cannot distinguish a cancelled request from a newer attempt.
      if (!this._promiseRequest) this._lockFailed();
    });
    this._listen(document, "mousemove", (event) => this._look(event));
    this._listen(
      window,
      "pointerdown",
      (event) => this._pointerDown(event),
      true,
    );
    this._listen(
      window,
      "contextmenu",
      (event) => {
        if (this.active) event.preventDefault();
      },
      true,
    );
    this._listen(window, "keydown", (event) => this._key(event, true), true);
    this._listen(window, "keyup", (event) => this._key(event, false), true);
    this._listen(window, "blur", () => {
      if (!this.ctx.photo?.active) this.exit();
    });
    this._listen(document, "visibilitychange", () => {
      if (document.hidden && !this.ctx.photo?.active) this.exit();
    });
  }
  _listen(target, name, handler, capture = false) {
    target.addEventListener(name, handler, capture);
    this._listeners.push(() =>
      target.removeEventListener(name, handler, capture),
    );
  }
  _emit() {
    this.ctx.events.emit("exploration:change", {
      active: this.active,
      pending: this.pending,
      cursorFree: this.cursorFree,
    });
  }
  enter() {
    if (this.active || this.pending || this.ctx.photo?.active) return;
    if (!this.supported) {
      this.ctx.events.emit("exploration:error", {
        message: "当前浏览器不支持鼠标锁定，请使用桌面浏览器探索。",
      });
      return;
    }
    this._focusBeforeEntry = document.activeElement;
    this._requestLock();
  }
  resume() {
    if (
      !this.active ||
      !this.cursorFree ||
      this.pending ||
      this.ctx.photo?.active
    )
      return;
    this._requestLock();
  }
  _requestLock() {
    this.pending = true;
    const requestId = ++this._requestId;
    this._promiseRequest = false;
    this._emit();
    // Keep this call synchronous with the button's trusted click. Older
    // browsers return void; newer ones also reject a promise on failure.
    try {
      const request = this.canvas.requestPointerLock();
      this._promiseRequest = typeof request?.catch === "function";
      request?.catch(() => {
        if (requestId === this._requestId) this._lockFailed();
      });
    } catch {
      this._lockFailed();
    }
  }
  _lockFailed() {
    if (!this.pending) return;
    if (this.active) {
      // Failed recapture leaves the first-person camera and UI usable.
      this.pending = false;
      this._requestId++;
      this.cursorFree = true;
      this.keys.clear();
      this._emit();
    } else this.exit();
    this.ctx.events.emit("exploration:error", {
      message: this.active
        ? "未能锁定鼠标，请再次点击场景继续探索。"
        : "未能锁定鼠标，请再次点击“步行探索”。",
    });
  }
  releaseCursor() {
    if (!this.active || this.cursorFree) return;
    this.cursorFree = true;
    this.keys.clear();
    this.actor.moving = false;
    this._emit();
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
  }
  _pointerDown(event) {
    if (!this.active || this.ctx.photo?.active) return;
    if (event.button === 2) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.releaseCursor();
    } else if (
      event.button === 0 &&
      this.cursorFree &&
      event.target === this.canvas
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.resume();
    }
  }
  _lockChanged() {
    if (this.ctx.photo?.active) return;
    if (document.pointerLockElement !== this.canvas) {
      // Right-click intentionally releases the cursor without ending the mode.
      // Native Esc/unexpected unlocks still restore the original camera.
      if (this.active && this.cursorFree) return;
      if (this.active || this.pending) this.exit();
      return;
    }
    if (!this.pending) {
      if (!this.active || this.cursorFree) document.exitPointerLock();
      return;
    }
    if (this.active) {
      this.pending = false;
      this.cursorFree = false;
      this.keys.clear();
      document.activeElement?.blur?.();
      this._emit();
      return;
    }
    this.navigation ??= new ExplorationNavigation(this.ctx);
    const spawn = this.navigation.findSpawn(this.navigation.position);
    if (!spawn) {
      this.exit();
      this.ctx.events.emit("exploration:error", {
        message: "暂时没有安全的落脚点，请调整天气后重试。",
      });
      return;
    }
    const { camera, cameraRig: rig, input } = this.ctx;
    this._saved = {
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
      rotationOrder: camera.rotation.order,
      fov: camera.fov,
      near: camera.near,
      far: camera.far,
      zoom: camera.zoom,
      inputEnabled: input.enabled,
      rig: rig.captureState(),
    };
    Object.assign(this.navigation.position, spawn);
    this.navigation.resetVertical();
    // Autonomous movement can continue while native pointer lock is pending.
    // Take over the character's latest pose only after lock actually succeeds.
    this.yaw = Number.isFinite(this.actor.yaw) ? this.actor.yaw : this.yaw;
    this.pitch = Math.max(
      -EXPLORATION_PITCH_LIMIT,
      Math.min(
        EXPLORATION_PITCH_LIMIT,
        Number.isFinite(this.actor.pitch) ? this.actor.pitch : 0,
      ),
    );
    this.actor.moving = false;
    this.pending = false;
    this.active = true;
    this.cursorFree = false;
    this.keys.clear();
    input.setEnabled(false);
    camera.fov = 72;
    camera.near = 0.008;
    camera.updateProjectionMatrix();
    this._applyCamera();
    this._callAvatar("onEnter", this.actor);
    this.ctx.audio?.resume?.();
    this._emit();
  }
  exit() {
    const changed = this.active || this.pending;
    this._requestId++;
    this.pending = false;
    this.cursorFree = false;
    this.keys.clear();
    if (this.active) {
      this.active = false;
      const { camera, cameraRig: rig, input } = this.ctx;
      const saved = this._saved;
      rig.restoreState(saved.rig);
      camera.rotation.order = saved.rotationOrder;
      camera.position.copy(saved.position);
      camera.quaternion.copy(saved.quaternion);
      for (const key of ["fov", "near", "far", "zoom"])
        camera[key] = saved[key];
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();
      input.setEnabled(saved.inputEnabled);
      // Finish an interrupted jump before handing the character back to its
      // autonomous controller, whose new roaming anchor is this exit point.
      this.navigation.resetVertical();
      this.actor.moving = false;
      this._syncActor();
      this._callAvatar("onExit", this.actor);
      this._saved = null;
    }
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    if (changed) {
      // Native unlock may precede keydown. Do not let the same Escape close
      // a restored settings panel or change the original HUD visibility.
      this._suppressEscapeUntil = performance.now() + 250;
      this._emit();
      if (this._focusBeforeEntry?.isConnected)
        this._focusBeforeEntry.focus({ preventScroll: true });
    }
  }
  _key(event, down) {
    if (!down) this.keys.delete(event.code);
    if (this.ctx.photo?.active) return;
    if (
      event.code === "Escape" &&
      (this.active ||
        this.pending ||
        performance.now() < this._suppressEscapeUntil)
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (down && !event.repeat) this.exit();
      return;
    }
    if (!this.active && !this.pending) return;
    if (
      !this.active ||
      this.cursorFree ||
      document.pointerLockElement !== this.canvas
    )
      return;
    if (event.code === "Space") {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (
        down &&
        !event.repeat &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      )
        this.navigation.jump();
      return;
    }
    if (!EXPLORATION_KEYS.has(event.code)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (down && !event.ctrlKey && !event.metaKey && !event.altKey)
      this.keys.add(event.code);
    else this.keys.delete(event.code);
  }
  _look(event) {
    if (this.ctx.photo?.active) return;
    if (
      !this.active ||
      this.cursorFree ||
      document.pointerLockElement !== this.canvas
    )
      return;
    this.yaw -= event.movementX * EXPLORATION_SENSITIVITY;
    this.pitch = Math.max(
      -EXPLORATION_PITCH_LIMIT,
      Math.min(
        EXPLORATION_PITCH_LIMIT,
        this.pitch - event.movementY * EXPLORATION_SENSITIVITY,
      ),
    );
  }
  update(dt) {
    if (!this.active || this.ctx.photo?.active) return;
    const walking =
      !this.cursorFree && document.pointerLockElement === this.canvas;
    const forward = walking
      ? Number(this.keys.has("KeyW")) - Number(this.keys.has("KeyS"))
      : 0;
    const sideways = walking
      ? Number(this.keys.has("KeyD")) - Number(this.keys.has("KeyA"))
      : 0;
    const speed = this.navigation.swimming
      ? EXPLORATION_SWIM_SPEED
      : EXPLORATION_SPEED;
    const sprinting =
      walking && (this.keys.has("ShiftLeft") || this.keys.has("ShiftRight"));
    const distance =
      speed *
      (sprinting ? EXPLORATION_SPRINT_MULTIPLIER : 1) *
      Math.min(Math.max(dt, 0), 0.05);
    const length = Math.hypot(forward, sideways) || 1;
    const dx =
      ((sideways * Math.cos(this.yaw) - forward * Math.sin(this.yaw)) *
        distance) /
      length;
    const dz =
      ((-sideways * Math.sin(this.yaw) - forward * Math.cos(this.yaw)) *
        distance) /
      length;
    const previousX = this.navigation.position.x;
    const previousZ = this.navigation.position.z;
    this.navigation.move(dx, dz, dt);
    this.actor.moving =
      Math.hypot(
        this.navigation.position.x - previousX,
        this.navigation.position.z - previousZ,
      ) > 1e-6;
    this._applyCamera();
    this._callAvatar("update", this.actor, dt);
  }
  _applyCamera() {
    const { position, eyeHeight } = this.navigation;
    this.ctx.camera.position.set(
      position.x,
      position.y + eyeHeight,
      position.z,
    );
    this.ctx.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ");
    this.ctx.camera.updateMatrixWorld();
    this._syncActor();
  }
  _syncActor() {
    Object.assign(this.actor.position, this.navigation.position);
    this.actor.yaw = this.yaw;
    this.actor.pitch = this.pitch;
    this.actor.grounded = this.navigation.grounded;
    this.actor.swimming = this.navigation.swimming;
    this.actor.surfaceKind = this.navigation.surface.kind;
    this.actor.waterY = this.navigation.surface.waterY;
    this.actor.waterDepth = this.navigation.surface.depth;
  }
  // Adapter methods: onEnter(actor), update(actor, dt), onExit(actor).
  // CharacterSystem's adapter only synchronizes control state. Its registered
  // system update advances animation once, shared by all render passes.
  setAvatar(adapter = null) {
    if (this.active) this._callAvatar("onExit", this.actor);
    this.avatar = adapter;
    if (this.active) this._callAvatar("onEnter", this.actor);
  }
  _callAvatar(method, ...args) {
    try {
      this.avatar?.[method]?.(...args);
    } catch (error) {
      console.error(`[exploration] avatar.${method}`, error);
      this.avatar = null;
    }
  }
  dispose() {
    this.exit();
    for (const remove of this._listeners) remove();
    this._listeners.length = 0;
    this.avatar = null;
  }
}

export {
  EXPLORATION_SPEED,
  EXPLORATION_SWIM_SPEED,
  EXPLORATION_SPRINT_MULTIPLIER,
  ExplorationController,
};
