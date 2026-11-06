const CHARACTER_FADE_SECONDS = 0.12;
const CHARACTER_WALK_SPEED = 0.12;

// One mixer advance per simulation frame. Render/depth/reflection passes only
// consume the resulting pose, including while the free photo camera moves.
class CharacterAnimation {
  constructor(THREE, root, clips) {
    this.root = root;
    this.mixer = new THREE.AnimationMixer(root);
    this.actions = new Map();
    this.currentName = null;
    this._idleTime = 0;
    this._fade = null;
    for (const clip of clips) {
      const action = this.mixer.clipAction(clip);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.setEffectiveWeight(0);
      this.actions.set(clip.name, action);
    }
    this._select("Idle_Loop");
    this._blend(CHARACTER_FADE_SECONDS);
    this.mixer.update(0);
  }

  _select(name) {
    if (!this.actions.has(name)) {
      name = this.actions.has("Idle_Loop")
        ? "Idle_Loop"
        : this.actions.keys().next().value;
    }
    if (!name || name === this.currentName) return;
    const weights = new Map(
      [...this.actions].map(([key, action]) => [
        key,
        action.getEffectiveWeight(),
      ]),
    );
    const next = this.actions.get(name);
    next
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(weights.get(name))
      .play();
    this.currentName = name;
    this._fade = { elapsed: 0, weights };
  }

  _blend(dt) {
    if (!this._fade) return;
    this._fade.elapsed += dt;
    const amount = Math.min(1, this._fade.elapsed / CHARACTER_FADE_SECONDS);
    for (const [name, action] of this.actions) {
      const target = name === this.currentName ? 1 : 0;
      const start = this._fade.weights.get(name) || 0;
      action.setEffectiveWeight(start + (target - start) * amount);
      if (amount === 1 && !target) action.stop();
    }
    if (amount === 1) this._fade = null;
  }

  visualOffset(actor, profile = {}) {
    let offset = 0;
    for (const [name, action] of this.actions) {
      const y =
        name === "Swim_Loop" && !actor.held && actor.waterY != null
          ? actor.waterY - actor.position.y - (profile.swimWaterlineY || 0)
          : profile.clipGroundOffsets?.[name] || 0;
      offset += action.getEffectiveWeight() * y;
    }
    return offset;
  }

  settlePose(actor) {
    // A drop/cancel is a placement, not elapsed time. Resolve its pose now so
    // immediately freezing a photo cannot leave the held pose on the ground.
    this._idleTime = 0;
    this._select(actor.swimming ? "Swim_Loop" : "Idle_Loop");
    this._blend(CHARACTER_FADE_SECONDS);
    this.mixer.update(0);
  }

  update(actor, dt, speed = 0) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    const step = Math.min(dt, 0.05);
    const idle =
      !actor.held && !actor.swimming && !actor.moving && actor.grounded;
    this._idleTime = idle ? this._idleTime + step : 0;
    // The airborne export is a picked-up pose, never a physical jump action.
    this._select(
      actor.held
        ? "Held_Loop"
        : actor.swimming
          ? "Swim_Loop"
          : actor.moving && actor.grounded
            ? "Walk_Loop"
            : this._idleTime % 12 >= 4
              ? "Idle_Crossed_Loop"
              : "Idle_Loop",
    );
    const walk = this.actions.get("Walk_Loop");
    if (walk && this.currentName === "Walk_Loop") {
      walk.setEffectiveTimeScale(
        Math.max(0.35, Math.min(3.75, speed / CHARACTER_WALK_SPEED)),
      );
    }
    const swim = this.actions.get("Swim_Loop");
    if (swim && this.currentName === "Swim_Loop") {
      swim.setEffectiveTimeScale(
        actor.moving ? Math.max(0.65, Math.min(1.6, speed / 0.16)) : 0.55,
      );
    }
    this._blend(step);
    this.mixer.update(step);
  }

  dispose() {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.root);
    this.actions.clear();
  }
}

export { CharacterAnimation };
