import { CLOUD_LAYER_HEIGHTS } from "../core/config.js";
import { LANDSCAPE_AREA_SCALE } from "../core/weather-extent.js";
import { clampCloudSystem, saturateCloudSystem } from "./math.js";

// Match the cloud system's physical capacity without asking spawn() to evict
// visible clouds in the middle of constructing a transition.
const WEATHER_CLOUD_CAP = Math.ceil(10 * LANDSCAPE_AREA_SCALE);
const fadeOwners = new WeakMap();
const mix = (from, to, amount) => from + (to - from) * amount;

function cloudIsBeingUsed(system, cloud) {
  return !!(
    cloud.grabbed ||
    system.grab?.cloud === cloud ||
    system.condense?.cloud === cloud ||
    cloud.userSqueeze > 0 ||
    cloud.wheelHold > 0 ||
    cloud.wheelSqueeze > 0
  );
}

function snapshotCloud(cloud) {
  return {
    size: cloud.size ?? 1,
    water: cloud.water ?? 0.3,
    heldSqueeze: cloud.heldSqueeze ?? 0,
    stormTarget: cloud.stormTarget ?? 0,
    squeeze: cloud.squeeze ?? 0,
    storm: cloud.storm ?? 0,
    charge: cloud.charge ?? 0,
    rate: cloud.rate ?? 0,
    fade: cloud.fade ?? 1,
  };
}

function targetCloud(template, from) {
  if (!template) {
    return {
      size: from.size,
      water: Math.min(0.25, from.water),
      heldSqueeze: 0,
      stormTarget: 0,
      charge: 0,
      fade: 0,
    };
  }
  return {
    size: clampCloudSystem(template.size ?? 1, 0.1, 2.4),
    water: clampCloudSystem(template.water ?? 0.3, 0, 1.5),
    heldSqueeze: clampCloudSystem(template.squeeze ?? 0, 0, 1),
    stormTarget: clampCloudSystem(template.storm ?? 0, 0, 1),
    charge: clampCloudSystem(template.charge ?? 0, 0, 1),
    fade: 1,
  };
}

class CloudWeatherTransition {
  constructor(ctx, templates, duration = 8) {
    this.ctx = ctx;
    this.system = ctx.modules.clouds;
    this.duration = Number.isFinite(duration) && duration > 0 ? duration : 8;
    this.done = false;
    this._elapsed = 0;
    this._progress = 0;
    this._entries = new Map();
    this._offs = [];
    const system = this.system;
    if (!system?.list) return;
    const targets = templates.slice(0, WEATHER_CLOUD_CAP);
    const existing = system.list.filter((cloud) => !cloud.dissolving);
    for (const [index, cloud] of existing.entries()) {
      // An interacting cloud still occupies its slot; replacing it would add
      // unwanted weather around a cloud the user has deliberately taken over.
      if (!cloudIsBeingUsed(system, cloud)) this._take(cloud, targets[index]);
    }
    for (let index = existing.length; index < targets.length; index++) {
      if (!system.spawn || system.list.length >= WEATHER_CLOUD_CAP) break;
      const template = targets[index];
      const cloud = system.spawn({
        ...template,
        y: template.y ?? CLOUD_LAYER_HEIGHTS.defaultY,
        water: Math.min(0.3, template.water ?? 0.3),
        squeeze: 0,
        storm: 0,
        charge: 0,
        fadeIn: true,
      });
      if (cloud) {
        // CloudSystem.spawn({fadeIn:true}) creates invisible geometry already.
        // Keep the explicit value for lightweight callers with the same API.
        cloud.fade = 0;
        this._take(cloud, template);
      }
    }
    for (const event of ["cloud:grab", "cloud:merge"]) {
      const off = ctx.events?.on?.(event, ({ cloud } = {}) =>
        this._release(cloud),
      );
      if (off) this._offs.push(off);
    }
  }
  _take(cloud, template) {
    const from = snapshotCloud(cloud);
    const to = targetCloud(template, from);
    this._entries.set(cloud, {
      from,
      to,
      retire: !template,
      dry: to.heldSqueeze === 0 && to.stormTarget === 0 && to.water <= 1.05,
      lastEased: 0,
    });
    fadeOwners.set(cloud, this);
    cloud.weatherFade = from.fade;
  }
  update(dt, progress) {
    if (this.done || !Number.isFinite(dt) || dt < 0) return;
    this._elapsed += dt;
    const requested = Number.isFinite(progress)
      ? progress
      : this._elapsed / this.duration;
    this._progress = Math.max(this._progress, saturateCloudSystem(requested));
    const eased = this._progress * this._progress * (3 - 2 * this._progress);
    for (const [cloud, entry] of this._entries) {
      if (
        fadeOwners.get(cloud) !== this ||
        !this.system.list.includes(cloud) ||
        cloud.dissolving ||
        cloudIsBeingUsed(this.system, cloud)
      ) {
        this._release(cloud);
        continue;
      }
      const { from, to } = entry;
      cloud.size = mix(from.size, to.size, eased);
      cloud.water = mix(from.water, to.water, eased);
      cloud.heldSqueeze = mix(from.heldSqueeze, to.heldSqueeze, eased);
      cloud.stormTarget = mix(from.stormTarget, to.stormTarget, eased);
      cloud.fade = mix(from.fade, to.fade, eased);
      cloud.weatherFade = cloud.fade;
      if (to.charge > from.charge) {
        // Supply only the finite authored charge increase. A natural strike
        // may spend that charge; never refill it to a high target every frame.
        cloud.charge = Math.min(
          1.02,
          cloud.charge + (to.charge - from.charge) * (eased - entry.lastEased),
        );
      } else {
        cloud.charge = Math.min(
          cloud.charge,
          mix(from.charge, to.charge, eased),
        );
      }
      entry.lastEased = eased;
      if (entry.dry) {
        // The water cycle normally lags its held/storm targets. A shrinking
        // envelope makes dry-weather rain sources reach zero at the endpoint
        // without clearing live precipitation columns or stopping rain early.
        cloud.squeeze = Math.min(cloud.squeeze, from.squeeze * (1 - eased));
        cloud.storm = Math.min(cloud.storm, from.storm * (1 - eased));
        cloud.rate = Math.min(cloud.rate, from.rate * (1 - eased));
      }
      if (this._progress === 1) {
        if (entry.retire) cloud.dissolving = true;
        this._release(cloud);
      }
    }
    if (this._progress === 1) this.cancel();
  }
  _release(cloud) {
    this._entries.delete(cloud);
    if (fadeOwners.get(cloud) === this) {
      fadeOwners.delete(cloud);
      delete cloud.weatherFade;
    }
  }
  cancel() {
    if (this.done) return;
    for (const cloud of this._entries.keys()) this._release(cloud);
    for (const off of this._offs) off();
    this._offs.length = 0;
    this.done = true;
  }
}

export { CloudWeatherTransition };
