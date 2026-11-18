import { createSeededRandom } from "../core/math.js";
import { disposeModel } from "../core/model-loading.js";
import { ExplorationNavigation } from "../simulation/exploration-navigation.js";
import { CharacterAnimation } from "./animation.js";
import { CharacterDrag } from "./drag.js";
import { createFallbackCharacter, loadCharacterModel } from "./model.js";

const CHARACTER_WANDER_RADIUS = 0.6;
const CHARACTER_WANDER_SPEED = 0.12;

class CharacterSystem {
  constructor(ctx, { loader = loadCharacterModel } = {}) {
    this.ctx = ctx;
    this.navigation = new ExplorationNavigation(ctx);
    this.actor = {
      position: this.navigation.position,
      yaw: 0,
      pitch: 0,
      moving: false,
      grounded: true,
      swimming: false,
      held: false,
      waterY: null,
      surfaceKind: "land",
    };
    this.group = new ctx.THREE.Group();
    this.group.name = "player-character";
    this.group.visible = false;
    ctx.scene.add(this.group);
    this.model = null;
    this.visualRoot = null;
    this.profile = null;
    this.animation = null;
    this.initialized = false;
    this.controlled = false;
    this.disposed = false;
    this.anchor = { ...this.actor.position };
    this._lastPosition = { ...this.actor.position };
    this._target = null;
    this._wait = 1.2;
    this._blockedTime = 0;
    this._spawnRetry = 0;
    this._random = createSeededRandom(138113);
    this.stats = { model: "loading", mode: "idle", speed: 0, animation: null };
    this.avatar = {
      onEnter: () => this._enter(),
      update: (actor) => this._syncActor(actor),
      onExit: () => this._exit(),
    };
    this.drag = new CharacterDrag(ctx, this);
    this.ready = this._load(loader);
  }

  async _load(loader) {
    let model;
    try {
      model = await loader();
      if (!model?.root?.isObject3D || !Array.isArray(model.animations))
        throw new Error(
          "Character asset is missing its scene or animation clips",
        );
      if (this.disposed) {
        disposeModel(model.root);
        return false;
      }
      this.model = model.root;
      this.visualRoot = model.visualRoot ?? model.root;
      this.profile = model.profile;
      this.model.traverse((object) => {
        if (!object.isMesh) return;
        object.castShadow = true;
        object.receiveShadow = true;
        // A single animated character is inexpensive; its skinned bounds can
        // exceed bind-pose bounds in both the main and reflection cameras.
        object.frustumCulled = false;
      });
      this.animation = new CharacterAnimation(
        this.ctx.THREE,
        this.model,
        model.animations,
      );
      this.group.add(this.model);
      this.stats.model = "ready";
      this.syncVisual();
      return true;
    } catch (error) {
      this.animation?.dispose();
      this.animation = null;
      this.model = null;
      this.visualRoot = null;
      this.profile = null;
      if (model?.root?.isObject3D) {
        model.root.removeFromParent();
        disposeModel(model.root);
      }
      if (this.disposed) return false;
      this.model = createFallbackCharacter();
      this.group.add(this.model);
      this.stats.model = "fallback";
      this.stats.error = error.message;
      console.warn("[character] Using procedural traveler:", error);
      this.syncVisual();
      return false;
    }
  }

  initialize() {
    if (this.disposed) return false;
    if (this.initialized) return true;
    const spawn = this.navigation.findSpawn(this.navigation.position);
    if (!spawn) return false;
    Object.assign(this.actor.position, spawn);
    this.navigation.resetVertical();
    this.initialized = true;
    this._resetWander();
    this.syncVisual();
    return true;
  }

  _resetWander() {
    Object.assign(this.anchor, this.actor.position);
    Object.assign(this._lastPosition, this.actor.position);
    this._target = null;
    this._wait = 1.2;
    this._blockedTime = 0;
    this.actor.moving = false;
    this._syncSurface();
  }

  _syncSurface() {
    this.actor.grounded = this.navigation.grounded;
    this.actor.swimming = this.navigation.swimming;
    this.actor.waterY = this.navigation.surface?.waterY ?? null;
    this.actor.surfaceKind = this.navigation.surface?.kind ?? "land";
  }

  _enter() {
    this.drag.cancel();
    if (!this.initialized) this.initialize();
    this.controlled = true;
    this._target = null;
    Object.assign(this._lastPosition, this.actor.position);
    this.syncVisual();
  }

  _syncActor(actor) {
    if (actor && actor !== this.actor) {
      Object.assign(this.actor.position, actor.position);
      for (const key of [
        "yaw",
        "pitch",
        "moving",
        "grounded",
        "swimming",
        "waterY",
        "surfaceKind",
      ])
        if (actor[key] !== undefined) this.actor[key] = actor[key];
    }
    this.syncVisual();
  }

  _exit() {
    this.controlled = false;
    this._resetWander();
    this.syncVisual();
  }

  place(position) {
    if (!this.navigation.isTraversable(position.x, position.z)) return false;
    Object.assign(this.actor.position, position);
    this.navigation.resetVertical();
    this._resetWander();
    this.animation?.settlePose(this.actor);
    this.ctx.input.invalidateHover();
    this.syncVisual();
    return true;
  }

  refreshSupport() {
    // Weather keeps running while an actor is held. Releasing or cancelling
    // follows the current water/snow level without advancing simulation time.
    this.navigation.move(0, 0, 0);
    this._syncSurface();
    this.animation?.settlePose(this.actor);
  }

  _chooseTarget() {
    const { navigation, anchor } = this;
    const position = this.actor.position;
    for (let attempt = 0; attempt < 12; attempt++) {
      const angle = this._random() * Math.PI * 2;
      const radius = CHARACTER_WANDER_RADIUS * Math.sqrt(this._random());
      const x = anchor.x + Math.cos(angle) * radius;
      const z = anchor.z + Math.sin(angle) * radius;
      const distance = Math.hypot(x - position.x, z - position.z);
      if (distance < 0.12 || !navigation.isTraversable(x, z)) continue;
      const count = Math.ceil(distance / (navigation.radius * 0.45));
      let reachable = true;
      let previousX = position.x;
      let previousZ = position.z;
      for (let step = 1; step <= count; step++) {
        const px = position.x + ((x - position.x) * step) / count;
        const pz = position.z + ((z - position.z) * step) / count;
        if (!navigation.canStep(previousX, previousZ, px, pz)) {
          reachable = false;
          break;
        }
        previousX = px;
        previousZ = pz;
      }
      if (reachable) {
        this._target = { x, z };
        this._blockedTime = 0;
        return;
      }
    }
    this._wait = 1 + this._random() * 2;
  }

  _wander(dt) {
    const { navigation, actor } = this;
    const previousX = actor.position.x;
    const previousZ = actor.position.z;
    // Even an idle actor follows settling snow and recovers from rising water
    // or an asynchronously replaced building footprint.
    navigation.move(0, 0, dt);
    if (
      Math.hypot(actor.position.x - previousX, actor.position.z - previousZ) >
      1e-6
    )
      this._resetWander();
    if (this._wait > 0) {
      this._wait -= dt;
      actor.moving = false;
      return;
    }
    if (!this._target) this._chooseTarget();
    if (!this._target) return;
    const dx = this._target.x - actor.position.x;
    const dz = this._target.z - actor.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.015) {
      this._target = null;
      this._wait = 2.5 + this._random() * 4.5;
      actor.moving = false;
      return;
    }
    const travel = Math.min(distance, CHARACTER_WANDER_SPEED * dt);
    const x = actor.position.x;
    const z = actor.position.z;
    navigation.move((dx / distance) * travel, (dz / distance) * travel, 0);
    if (
      Math.hypot(
        actor.position.x - this.anchor.x,
        actor.position.z - this.anchor.z,
      ) > CHARACTER_WANDER_RADIUS
    ) {
      // Sliding around a wall must not gradually move the roaming area.
      actor.position.x = x;
      actor.position.z = z;
      navigation.resetVertical();
    }
    const moved = Math.hypot(actor.position.x - x, actor.position.z - z);
    actor.moving = moved > 1e-6;
    if (actor.moving) {
      const yaw = Math.atan2(-(actor.position.x - x), -(actor.position.z - z));
      const turn = Math.atan2(
        Math.sin(yaw - actor.yaw),
        Math.cos(yaw - actor.yaw),
      );
      actor.yaw += turn * Math.min(1, dt * 10);
    }
    this._blockedTime = moved < travel * 0.25 ? this._blockedTime + dt : 0;
    if (this._blockedTime > 0.25) {
      this._target = null;
      this._wait = 0.5 + this._random();
    }
  }

  update(dt) {
    if (this.disposed) return;
    const { photo, exploration } = this.ctx;
    const frozen = photo?.active && (!photo.timeRunning || exploration?.active);
    if (frozen || !Number.isFinite(dt) || dt <= 0) {
      this.syncVisual();
      return;
    }
    const step = Math.min(dt, 0.05);
    if (!this.initialized) {
      this._spawnRetry -= step;
      if (this._spawnRetry > 0) return;
      this._spawnRetry = 1;
      if (!this.initialize()) return;
    }
    if (this.drag.active) {
      this.actor.moving = false;
    } else if (!this.controlled && !exploration?.active) {
      this._wander(step);
    }
    this._syncSurface();
    const distance = Math.hypot(
      this.actor.position.x - this._lastPosition.x,
      this.actor.position.z - this._lastPosition.z,
    );
    const speed = this.actor.moving ? Math.min(distance / step, 0.45) : 0;
    this.animation?.update(this.actor, step, speed);
    Object.assign(this._lastPosition, this.actor.position);
    Object.assign(this.stats, {
      mode: this.drag.active ? "drag" : this.controlled ? "player" : "wander",
      speed,
      animation: this.animation?.currentName ?? null,
      swimming: this.actor.swimming,
    });
    this.syncVisual();
  }

  syncVisual() {
    // A pure transform calculation also handles placement/cancel just before
    // photo freeze; it never advances an animation or reads live water state.
    if (this.visualRoot && this.animation)
      this.visualRoot.position.y = this.animation.visualOffset(
        this.actor,
        this.profile,
      );
    const drag = this.drag?.active;
    const position = drag?.displayPosition ?? this.actor.position;
    this.group.position.set(position.x, position.y, position.z);
    if (drag) this.group.position.y += 0.15;
    this.group.rotation.y = this.actor.yaw;
    this.group.visible =
      this.initialized &&
      !!this.model &&
      (!this.ctx.exploration?.active || !!this.ctx.photo?.active);
    this.group.updateMatrixWorld(true);
  }

  beforeRender() {
    this.syncVisual();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.drag.dispose();
    this.animation?.dispose();
    if (this.model) {
      this.model.removeFromParent();
      disposeModel(this.model);
    }
    this.group.removeFromParent();
    this.model = null;
    this.animation = null;
    this.stats.model = "disposed";
    this.stats.mode = "disposed";
  }
}

export { CharacterSystem };
