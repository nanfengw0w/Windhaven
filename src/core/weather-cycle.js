import { CLOUD_LAYER_HEIGHTS, LANDSCAPE_BOUNDS } from "./config.js";
import { damp } from "./math.js";
import { FEATURED_WEATHER_SCENARIOS, SCENARIOS } from "./scenarios.js";
import { WorldState } from "../simulation/world.js";
import { CloudWeatherTransition } from "../clouds/weather-transition.js";
import {
  LANDSCAPE_AREA_SCALE,
  landscapeWeatherPoints,
} from "./weather-extent.js";

// Read the authored presets into data with an isolated recording context. Their
// reset/fill operations never touch the running world or its accumulated snow.
function readWeatherProfile(name) {
  const clouds = [];
  const fog = [];
  const wetPatches = [];
  let snowAmount = 0;
  const fields = {
    lakeFrozen: 0,
    addWet: (...patch) => wetPatches.push(patch),
    fillSnowByTemperature: (amount) => {
      snowAmount = amount;
    },
  };
  const world = { season: 0.25, timeOfDay: 0.635, tempOffset: 0, update() {} };
  SCENARIOS[name]({
    world,
    fields,
    wind: { addForce() {} },
    modules: {
      clouds: { clear() {}, spawn: (cloud) => clouds.push(cloud) },
      fog: { addFog: (...patch) => fog.push(patch) },
    },
  });
  return {
    season: world.season,
    time: world.timeOfDay,
    temp: world.tempOffset,
    clouds,
    fog,
    wetPatches,
    snowAmount,
    lakeFrozen: fields.lakeFrozen,
    waterRise: world.waterRise ?? 0,
  };
}

const WEATHER_PROFILES = Object.fromEntries(
  Object.keys(SCENARIOS).map((name) => [name, readWeatherProfile(name)]),
);
const WEATHER_TRANSITION_SECONDS = 30;
const FEATURED_WEATHER_TRANSITION_SECONDS = 8;
const WEATHER_CLOUD_LIMIT = Math.min(16, Math.ceil(3 * LANDSCAPE_AREA_SCALE));
const wrapWeatherValue = (value, period) =>
  ((value % period) + period) % period;
const weatherDelta = (value, previous, period) =>
  wrapWeatherValue(value - previous + period / 2, period) - period / 2;

class WeatherController {
  constructor(ctx) {
    this.ctx = ctx;
    this.currentScenario = "calm";
    this._transition = {};
    this._remaining = 0;
    this._featuredTransition = null;
    this._elapsed = 0;
    this._cloudTimer = 0;
    this._fogTimer = 0;
    this._fogStrength = 0;
    this._spawnIndex = 0;
    this._fogIndex = 0;
    this._nextCloudSlot = 0;
    this._cloudSlots = new WeakMap();
    this._protectedUntil = new WeakMap();
    this._weatherPoints = landscapeWeatherPoints(WEATHER_CLOUD_LIMIT, 45321);
  }
  get transitioning() {
    return this._remaining > 0 || this._featuredTransition !== null;
  }
  initialize(name) {
    this._stopFeaturedTransition();
    this.currentScenario = Object.hasOwn(WEATHER_PROFILES, name)
      ? name
      : "calm";
    this._transition = {};
    this._remaining = 0;
    this._emitChange();
  }
  select(name) {
    if (!Object.hasOwn(WEATHER_PROFILES, name)) return false;
    if (FEATURED_WEATHER_SCENARIOS.includes(name))
      return this._selectFeatured(name);
    this._stopFeaturedTransition();
    this.ctx.world.meteorShower = false;
    this.currentScenario = name;
    const world = this.ctx.world;
    const profile = WEATHER_PROFILES[name];
    world.seasonTarget = null;
    world.seasonCycle = false;
    world.dayCycle = false;
    this._transition = {
      season: profile.season,
      time: profile.time,
      temp: profile.temp,
    };
    const sky = this.ctx.modules.sky;
    if (sky?.drag) delete this._transition.time;
    else if (sky) {
      sky.glide = null;
      sky.timeVel = 0;
    }
    this._remaining = WEATHER_TRANSITION_SECONDS;
    this._cloudTimer = 0;
    this._fogTimer = 0;
    this._fogStrength = 0;
    this._spawnIndex = 0;
    this._fogIndex = 0;
    this._emitChange();
    return true;
  }
  cancelTransition(axis) {
    delete this._transition[axis];
    if (this._featuredTransition) {
      delete this._featuredTransition.axes[axis];
      if (axis === "season" || axis === "temp")
        this.ctx.fields.cancelWeatherTransition?.();
    }
  }
  _stopFeaturedTransition() {
    if (!this._featuredTransition) return;
    this._featuredTransition.clouds.cancel();
    this.ctx.fields.cancelWeatherTransition?.();
    this._featuredTransition = null;
  }
  _selectFeatured(name) {
    this._stopFeaturedTransition();
    const { world, modules, fields } = this.ctx;
    const profile = WEATHER_PROFILES[name];
    const axes = {};
    for (const [axis, property, target, period] of [
      ["season", "season", profile.season, 4],
      ["time", "timeOfDay", profile.time, 1],
      ["temp", "tempOffset", profile.temp, 0],
    ]) {
      const from = world[property];
      axes[axis] = {
        property,
        from,
        to: target,
        period,
        delta: period ? weatherDelta(target, from, period) : target - from,
      };
    }
    world.dayCycle = false;
    world.seasonCycle = false;
    world.seasonTarget = null;
    if (modules.sky?.drag) delete axes.time;
    else if (modules.sky) {
      modules.sky.glide = null;
      modules.sky.timeVel = 0;
    }
    world.meteorShower = name === "meteor";
    this.currentScenario = name;
    this._remaining = 0;
    this._transition = {};

    const templates = profile.clouds;
    const count = Math.min(
      WEATHER_CLOUD_LIMIT,
      Math.round(templates.length * LANDSCAPE_AREA_SCALE),
    );
    const clouds = [];
    const wetPatches = profile.wetPatches.map((patch) => [...patch]);
    for (let index = 0; index < count; index++) {
      const template = templates[index % templates.length];
      const point =
        index < templates.length
          ? template
          : this._weatherPoints[index - templates.length];
      clouds.push({
        ...template,
        x: point.x,
        z: point.z,
        y: template.y ?? CLOUD_LAYER_HEIGHTS.defaultY,
      });
      if (
        index >= templates.length &&
        (name === "rain" || name === "storm") &&
        template.squeeze > 0.1
      )
        wetPatches.push([
          point.x,
          point.z,
          template.size * 1.8,
          name === "storm" ? 1 : 0.8,
        ]);
    }
    // 用目标气候计算预设雪量，绝不把目标季节临时写进正在显示的世界。
    const targetWorld = new WorldState();
    targetWorld.season = profile.season;
    targetWorld.timeOfDay = profile.time;
    targetWorld.tempOffset = profile.temp;
    targetWorld.update(0);
    fields.beginWeatherTransition(
      {
        snowAmount: profile.snowAmount,
        temperatureAt: (height) => targetWorld.temperatureAt(height),
        wetPatches,
        lakeFrozen: profile.lakeFrozen,
      },
      FEATURED_WEATHER_TRANSITION_SECONDS,
    );
    this._emitChange();
    this._featuredTransition = {
      elapsed: 0,
      axes,
      waterRise: { from: world.waterRise, to: profile.waterRise },
      clouds: new CloudWeatherTransition(
        this.ctx,
        clouds,
        FEATURED_WEATHER_TRANSITION_SECONDS,
      ),
    };
    return true;
  }
  _advanceFeatured(dt) {
    const transition = this._featuredTransition;
    const world = this.ctx.world;
    if (world.dayCycle || this.ctx.modules.sky?.drag)
      delete transition.axes.time;
    if (world.seasonCycle || world.seasonTarget !== null)
      this.cancelTransition("season");
    transition.elapsed += dt;
    const progress =
      transition.elapsed >= FEATURED_WEATHER_TRANSITION_SECONDS - 1e-8
        ? 1
        : transition.elapsed / FEATURED_WEATHER_TRANSITION_SECONDS;
    const eased = progress * progress * (3 - 2 * progress);
    for (const axis of Object.values(transition.axes)) {
      const value = axis.from + axis.delta * eased;
      world[axis.property] =
        progress >= 1 - 1e-8
          ? axis.to
          : axis.period
            ? wrapWeatherValue(value, axis.period)
            : value;
    }
    world.waterRise =
      transition.waterRise.from +
      (transition.waterRise.to - transition.waterRise.from) * eased;
    transition.clouds.update(dt, progress);
    if (progress >= 1 - 1e-8) this._featuredTransition = null;
  }
  update(dt) {
    // Only an explicit selection grants this controller a short transition
    // window. The normal simulation owns weather before and after that window.
    if (!this.transitioning || !(dt > 0) || !Number.isFinite(dt)) return;
    if (this._featuredTransition) {
      this._advanceFeatured(dt);
      return;
    }
    const step = Math.min(dt, this._remaining);
    this._elapsed += step;
    this._advanceTransition(step);
    this._advanceClouds(step);
    this._advanceFog(step);
    this._remaining = Math.max(0, this._remaining - step);
    if (this._remaining < 1e-8) {
      this._remaining = 0;
      this._transition = {};
    }
  }
  _advanceTransition(dt) {
    const world = this.ctx.world;
    const axes = {
      season: ["season", 4],
      time: ["timeOfDay", 1],
      temp: ["tempOffset", 0],
    };
    for (const [axis, target] of Object.entries(this._transition)) {
      const [property, period] = axes[axis];
      const delta = period
        ? weatherDelta(target, world[property], period)
        : target - world[property];
      const epsilon =
        axis === "time" ? 0.0002 : axis === "season" ? 0.001 : 0.01;
      const value =
        Math.abs(delta) < epsilon
          ? target
          : world[property] + delta * (1 - Math.exp(-dt * 0.45));
      world[property] = period ? wrapWeatherValue(value, period) : value;
      if (Math.abs(delta) < epsilon) delete this._transition[axis];
    }
  }
  _isCloudProtected(cloud, system) {
    if (
      cloud.grabbed ||
      system.grab?.cloud === cloud ||
      system.condense?.cloud === cloud ||
      cloud.userSqueeze > 0.001 ||
      cloud.wheelHold > 0 ||
      cloud.wheelSqueeze > 0.001
    ) {
      this._protectedUntil.set(cloud, this._elapsed + 12);
      return true;
    }
    return (this._protectedUntil.get(cloud) || 0) > this._elapsed;
  }
  _advanceClouds(dt) {
    const system = this.ctx.modules.clouds;
    if (!system?.list || !system.spawn) return;
    const templates = WEATHER_PROFILES[this.currentScenario].clouds;
    const active = [];
    const available = [];
    for (const cloud of system.list) {
      if (cloud.dissolving) continue;
      active.push(cloud);
      if (this._isCloudProtected(cloud, system)) continue;
      available.push(cloud);
      if (!this._cloudSlots.has(cloud))
        this._cloudSlots.set(cloud, this._nextCloudSlot++);
      const target = templates[this._cloudSlots.get(cloud) % templates.length];
      cloud.water = damp(cloud.water, target.water ?? 0.3, 0.065, dt);
      cloud.heldSqueeze = damp(cloud.heldSqueeze, target.squeeze ?? 0, 0.1, dt);
      cloud.stormTarget = damp(cloud.stormTarget, target.storm ?? 0, 0.1, dt);
    }
    this._cloudTimer -= dt;
    if (this._cloudTimer > 0) return;
    this._cloudTimer = 4;
    const desired = Math.min(
      WEATHER_CLOUD_LIMIT,
      Math.max(1, Math.round(templates.length * LANDSCAPE_AREA_SCALE)),
    );
    // Retire at most one idle cloud per interval, using the cloud system's fade.
    if (active.length > desired && available.length) {
      available[available.length - 1].dissolving = true;
    } else if (
      active.length < desired &&
      system.list.length < WEATHER_CLOUD_LIMIT
    ) {
      const index = this._spawnIndex++;
      const target = templates[index % templates.length];
      const point =
        index < templates.length
          ? target
          : this._weatherPoints[
              (index - templates.length) % this._weatherPoints.length
            ];
      system.spawn({
        x: Math.max(
          -LANDSCAPE_BOUNDS.halfW + 1,
          Math.min(LANDSCAPE_BOUNDS.halfW - 1, point.x),
        ),
        z: Math.max(
          -LANDSCAPE_BOUNDS.halfD + 1,
          Math.min(LANDSCAPE_BOUNDS.halfD - 1, point.z),
        ),
        y: target.y ?? CLOUD_LAYER_HEIGHTS.defaultY,
        size: target.size,
        water: Math.min(0.3, target.water),
        squeeze: 0,
        storm: 0,
        fadeIn: true,
      });
    }
  }
  _advanceFog(dt) {
    this._fogStrength = damp(
      this._fogStrength,
      this.currentScenario === "fog" ? 1 : 0,
      0.16,
      dt,
    );
    if (this._fogStrength < 0.01) return;
    this._fogTimer -= dt;
    if (this._fogTimer > 0) return;
    this._fogTimer = 1.5;
    const patches = WEATHER_PROFILES.fog.fog;
    const index = this._fogIndex++;
    const patch = patches[index % patches.length];
    const point =
      index % 4 === 0
        ? this._weatherPoints[index % this._weatherPoints.length]
        : null;
    this.ctx.modules.fog?.addFog?.(
      point?.x ?? patch[0],
      point?.z ?? patch[1],
      patch[2],
      patch[3] * 0.15 * this._fogStrength,
    );
  }
  _emitChange() {
    this.ctx.events.emit("weather:change", {
      name: this.currentScenario,
    });
  }
}

export { WeatherController };
