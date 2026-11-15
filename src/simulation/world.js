// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeColor, ThreeVector3 } from "../vendor/three-runtime.js";
import {
  CELESTIAL_ORBIT,
  TEMPERATURE_CONFIG,
  WATER_LEVEL_CONFIG,
  rotateCelestialDirection,
} from "../core/config.js";
import { clamp, damp, lerp, smoothstep } from "../core/math.js";
const SEASON_NAMES = ["Spring", "Summer", "Autumn", "Winter"];
// A full day takes 2.5 minutes; one season takes 24 seconds (96s per year).
const DAY_CYCLE_SECONDS = 150;
const SEASON_CYCLE_SECONDS = 24;
const CYCLE_SPEED_SCALE_MIN = 0.25;
const CYCLE_SPEED_SCALE_MAX = 8;
const SEASONAL_PALETTE = {
  grass: [
    [0.33, 0.6, 0.2],
    [0.33, 0.5, 0.15],
    [0.6, 0.5, 0.2],
    [0.46, 0.42, 0.3],
  ],
  grassDry: [
    [0.52, 0.62, 0.25],
    [0.62, 0.58, 0.26],
    [0.7, 0.52, 0.24],
    [0.55, 0.5, 0.4],
  ],
  foliage: [
    [0.42, 0.68, 0.22],
    [0.2, 0.42, 0.12],
    [0.86, 0.36, 0.08],
    [0.55, 0.3, 0.12],
  ],
  foliage2: [
    [0.62, 0.8, 0.3],
    [0.3, 0.5, 0.16],
    [0.95, 0.68, 0.14],
    [0.5, 0.36, 0.16],
  ],
  pine: [
    [0.13, 0.3, 0.16],
    [0.11, 0.26, 0.13],
    [0.12, 0.25, 0.14],
    [0.13, 0.24, 0.2],
  ],
  leafAmount: [0.85, 1, 0.72, 0],
  flowers: [0.8, 1, 0.15, 0],
  activity: [1, 1, 0.6, 0.15],
  humidity: [0.55, 0.45, 0.6, 0.5],
  breeze: [0.35, 0.2, 0.55, 0.45],
  sunTilt: [0.55, 0.3, 0.62, 0.92],
};
function interpolateSeason(r, t) {
  const e = Math.floor(t) & 3,
    i = (e + 1) & 3,
    s = t - Math.floor(t),
    n = s * s * (3 - 2 * s),
    o = r[e],
    a = r[i];
  return typeof o == "number"
    ? lerp(o, a, n)
    : [lerp(o[0], a[0], n), lerp(o[1], a[1], n), lerp(o[2], a[2], n)];
}
const createWorldColor = (r, t, e) => new ThreeColor(r, t, e);
const DAYLIGHT_COLOR = createWorldColor(1, 0.94, 0.86);
const GOLDEN_LIGHT_COLOR = createWorldColor(1, 0.68, 0.38);
const SUNSET_LIGHT_COLOR = createWorldColor(1, 0.43, 0.2);
const OVERCAST_LIGHT_COLOR = createWorldColor(0.86, 0.9, 1);
const MOONLIGHT_COLOR = createWorldColor(0.42, 0.56, 1);
const DAY_SKY_COLOR = createWorldColor(0.4, 0.58, 1);
const GOLDEN_SKY_COLOR = createWorldColor(0.47, 0.5, 0.8);
const TWILIGHT_SKY_COLOR = createWorldColor(0.2, 0.22, 0.46);
const NIGHT_SKY_COLOR = createWorldColor(0.05, 0.075, 0.19);
const OVERCAST_DAY_SKY_COLOR = createWorldColor(0.34, 0.38, 0.44);
const OVERCAST_NIGHT_SKY_COLOR = createWorldColor(0.05, 0.055, 0.08);
const GROUND_LIGHT_COLOR = createWorldColor(0.3, 0.25, 0.17);
const DAY_HAZE_COLOR = createWorldColor(0.7, 0.8, 0.95);
const GOLDEN_HAZE_COLOR = createWorldColor(1, 0.62, 0.4);
const NIGHT_HAZE_COLOR = createWorldColor(0.04, 0.06, 0.14);
const OVERCAST_HAZE_COLOR = createWorldColor(0.3, 0.33, 0.38);
const ROOM_BACKGROUND_COLOR = createWorldColor(0.05, 0.045, 0.04);
const LIGHTNING_SKY_COLOR = createWorldColor(0.85, 0.88, 1);
const LIGHTNING_HAZE_COLOR = createWorldColor(0.8, 0.84, 1);
class WorldState {
  constructor() {
    ((this.season = 0.25),
      (this.seasonTarget = null),
      (this.seasonCycle = false),
      (this.seasonSpeed = 1 / SEASON_CYCLE_SECONDS),
      (this.timeOfDay = 0.4),
      (this.dayCycle = !1),
      (this.daySpeed = 1 / DAY_CYCLE_SECONDS),
      (this.tempOffset = 0),
      (this.humidity = 0.5),
      (this.storminess = 0),
      (this.cloudCover = 0),
      (this.rainfall = 0),
      (this.snowfall = 0),
      (this.meteorShower = false),
      (this.flash = 0),
      (this.waterRise = 0),
      (this.fogAmount = 0),
      (this.groundWetness = 0),
      (this.snowCover = 0),
      (this.windEnergy = 0),
      (this.elapsed = 0),
      (this.sunDir = new ThreeVector3(0, 1, 0)),
      (this.moonDir = new ThreeVector3(0, -1, 0)),
      (this.lightDir = new ThreeVector3(0, 1, 0)),
      (this.sunPosition = new ThreeVector3()),
      (this.moonPosition = new ThreeVector3()),
      (this.sunElevation = 0),
      (this.day = 1),
      (this.night = 0),
      (this.golden = 0),
      (this.lightColor = createWorldColor(1, 1, 1)),
      (this.lightIntensity = 3),
      (this.skyColor = createWorldColor(0.6, 0.75, 1)),
      (this.groundColor = createWorldColor(0.35, 0.3, 0.2)),
      (this.ambientIntensity = 1),
      (this.hazeColor = createWorldColor(0.75, 0.83, 0.95)),
      (this.roomColor = createWorldColor(0.07, 0.065, 0.06)),
      (this.seasonal = {
        grass: createWorldColor(0, 0, 0),
        grassDry: createWorldColor(0, 0, 0),
        foliage: createWorldColor(0, 0, 0),
        foliage2: createWorldColor(0, 0, 0),
        pine: createWorldColor(0, 0, 0),
        leafAmount: 1,
        blossom: 0,
        flowers: 1,
        fallingLeaves: 0,
        activity: 1,
        baseTemp: 15,
        breeze: 0.3,
        name: "Spring",
      }),
      this.update(0));
  }
  get seasonName() {
    return SEASON_NAMES[Math.round(this.season) & 3];
  }
  get daySpeedScale() {
    return this.daySpeed * DAY_CYCLE_SECONDS;
  }
  get seasonSpeedScale() {
    return this.seasonSpeed * SEASON_CYCLE_SECONDS;
  }
  setDaySpeedScale(scale) {
    const value = Number(scale);
    this.daySpeed =
      (1 / DAY_CYCLE_SECONDS) *
      clamp(
        Number.isFinite(value) ? value : 1,
        CYCLE_SPEED_SCALE_MIN,
        CYCLE_SPEED_SCALE_MAX,
      );
  }
  setSeasonSpeedScale(scale) {
    const value = Number(scale);
    this.seasonSpeed =
      (1 / SEASON_CYCLE_SECONDS) *
      clamp(
        Number.isFinite(value) ? value : 1,
        CYCLE_SPEED_SCALE_MIN,
        CYCLE_SPEED_SCALE_MAX,
      );
  }
  setSeasonTarget(t) {
    let i = (((t % 4) + 4) % 4) - this.season;
    (i > 2 && (i -= 4),
      i < -2 && (i += 4),
      (this.seasonTarget = this.season + i));
  }
  get seaLevelTemp() {
    return this._seaTemp;
  }
  temperatureAt(t) {
    return this._seaTemp - TEMPERATURE_CONFIG.lapse * Math.max(0, t);
  }
  snowFractionAt(t) {
    return smoothstep(1.2, -1.2, this.temperatureAt(t));
  }
  get freezingLevel() {
    return this._seaTemp / TEMPERATURE_CONFIG.lapse;
  }
  get lakeLevel() {
    return WATER_LEVEL_CONFIG.lakeLevel + this.waterRise;
  }
  reportClouds({ cover: t = 0, storm: e = 0 } = {}) {
    ((this.cloudCover = t), (this.storminess = e));
  }
  triggerFlash(t = 1) {
    this.flash = Math.max(this.flash, t);
  }
  update(t) {
    if (((this.elapsed += t), this.seasonTarget !== null)) {
      const u = this.seasonTarget - this.season,
        d =
          Math.sign(u) * Math.min(Math.abs(u), t * (0.35 + Math.abs(u) * 0.9));
      ((this.season += d),
        Math.abs(this.seasonTarget - this.season) < 0.001 &&
          ((this.season = this.seasonTarget), (this.seasonTarget = null)));
    } else if (this.seasonCycle) {
      this.season += t * this.seasonSpeed;
    }
    if (this.season >= 4 || this.season < 0) {
      const u = ((this.season % 4) + 4) % 4;
      (this.seasonTarget !== null && (this.seasonTarget += u - this.season),
        (this.season = u));
    }
    this.dayCycle &&
      (this.timeOfDay = (this.timeOfDay + t * this.daySpeed) % 1);
    const e = this.season,
      i = this.seasonal;
    (i.grass.setRGB(...interpolateSeason(SEASONAL_PALETTE.grass, e)),
      i.grassDry.setRGB(...interpolateSeason(SEASONAL_PALETTE.grassDry, e)),
      i.foliage.setRGB(...interpolateSeason(SEASONAL_PALETTE.foliage, e)),
      i.foliage2.setRGB(...interpolateSeason(SEASONAL_PALETTE.foliage2, e)),
      i.pine.setRGB(...interpolateSeason(SEASONAL_PALETTE.pine, e)),
      (i.leafAmount = interpolateSeason(SEASONAL_PALETTE.leafAmount, e)),
      (i.flowers = interpolateSeason(SEASONAL_PALETTE.flowers, e)),
      (i.activity = interpolateSeason(SEASONAL_PALETTE.activity, e)),
      (i.breeze = interpolateSeason(SEASONAL_PALETTE.breeze, e)));
    const s = Math.min(Math.abs(e - 0.1), Math.abs(e - 4.1));
    ((i.blossom = smoothstep(0.55, 0.05, s)),
      (i.fallingLeaves = smoothstep(1.55, 2.1, e) * smoothstep(3, 2.45, e)),
      (i.baseTemp = interpolateSeason(TEMPERATURE_CONFIG.seasonBase, e)),
      (i.name = this.seasonName));
    const n = interpolateSeason(SEASONAL_PALETTE.sunTilt, e),
      o = (this.timeOfDay - 0.25) * Math.PI * 2;
    (this.sunDir
      .set(
        Math.cos(o) * 0.96,
        Math.sin(o) * Math.cos(n),
        Math.sin(o) * Math.sin(n) + 0.18,
      )
      .normalize(),
      this.moonDir
        .set(-this.sunDir.x * 0.9, -this.sunDir.y, -this.sunDir.z * 0.4 + 0.35)
        .normalize(),
      rotateCelestialDirection(this.sunDir),
      rotateCelestialDirection(this.moonDir));
    const a = CELESTIAL_ORBIT.center;
    (this.sunPosition
      .set(a[0], a[1], a[2])
      .addScaledVector(this.sunDir, CELESTIAL_ORBIT.radius),
      this.moonPosition
        .set(a[0], a[1], a[2])
        .addScaledVector(this.moonDir, CELESTIAL_ORBIT.radius));
    const l = this.sunDir.y;
    ((this.sunElevation = l),
      (this.day = smoothstep(-0.12, 0.12, l)),
      (this.night = 1 - smoothstep(-0.2, 0.02, l)),
      (this.golden =
        smoothstep(-0.06, 0.06, l) * (1 - smoothstep(0.12, 0.42, l))));
    const c = Math.sin((this.timeOfDay - 0.36) * Math.PI * 2),
      h = 1 - this.cloudCover * 0.5;
    this._seaTemp =
      i.baseTemp +
      TEMPERATURE_CONFIG.dayNightSwing * c * h -
      this.storminess * 4 +
      this.tempOffset;
    const f = clamp(
      interpolateSeason(SEASONAL_PALETTE.humidity, e) +
        this.groundWetness * 0.25 +
        this.fogAmount * 0.15 +
        this.storminess * 0.2,
      0,
      1,
    );
    ((this.humidity = damp(this.humidity, f, 0.08, t)),
      (this.waterRise = Math.max(
        0,
        this.waterRise - t * 0.0035 * (1 + Math.max(0, this._seaTemp) / 15),
      )),
      (this.waterRise = Math.min(this.waterRise, WATER_LEVEL_CONFIG.maxRise)),
      (this.flash = Math.max(0, this.flash - t * 3.2 * (0.6 + this.flash))),
      this._updateLight());
  }
  _updateLight() {
    const t = this.sunElevation,
      e = this.storminess,
      i = clamp(this.cloudCover * 0.55 + e * 0.75, 0, 1),
      s = i * i * (3 - 2 * i),
      n = t > -0.03;
    if (
      (this.lightDir.copy(n ? this.sunDir : this.moonDir),
      this.lightDir.y < 0.06 &&
        ((this.lightDir.y = 0.06), this.lightDir.normalize()),
      n)
    ) {
      const h = smoothstep(0.42, 0, t),
        f = smoothstep(0.1, -0.03, t);
      this.lightColor
        .copy(DAYLIGHT_COLOR)
        .lerp(GOLDEN_LIGHT_COLOR, h)
        .lerp(SUNSET_LIGHT_COLOR, f)
        .lerp(OVERCAST_LIGHT_COLOR, s * 0.6);
      const u = smoothstep(-0.035, 0.07, t),
        d = 0.68 + 0.32 * smoothstep(0.1, 0.55, t);
      this.lightIntensity = 4.6 * u * d * lerp(1, 0.13, s);
    } else
      (this.lightColor.copy(MOONLIGHT_COLOR),
        (this.lightIntensity = 1 * this.night * lerp(1, 0.12, s)));
    const o = smoothstep(0.03, -0.08, t) * (1 - this.night);
    this.skyColor
      .copy(DAY_SKY_COLOR)
      .lerp(GOLDEN_SKY_COLOR, this.golden)
      .lerp(TWILIGHT_SKY_COLOR, o)
      .lerp(NIGHT_SKY_COLOR, this.night)
      .lerp(OVERCAST_DAY_SKY_COLOR, s * this.day * 0.85)
      .lerp(OVERCAST_NIGHT_SKY_COLOR, s * this.night * 0.5);
    const a = clamp(
      (this.lightIntensity * Math.max(this.lightDir.y, 0.1)) / 3.5,
      0,
      1,
    );
    this.groundColor
      .copy(GROUND_LIGHT_COLOR)
      .multiplyScalar((0.35 + 0.65 * a) * lerp(1, 0.3, this.night));
    const l = lerp(1.15, 1.5, s),
      c = lerp(0.85, 0.6, s);
    if (
      ((this.ambientIntensity =
        lerp(l, c, this.night) * lerp(1, 0.82, this.golden * (1 - s))),
      this.hazeColor
        .copy(DAY_HAZE_COLOR)
        .lerp(GOLDEN_HAZE_COLOR, this.golden * 0.85)
        .lerp(NIGHT_HAZE_COLOR, this.night)
        .lerp(OVERCAST_HAZE_COLOR, s * (1 - this.night * 0.6)),
      this.roomColor
        .copy(ROOM_BACKGROUND_COLOR)
        .multiplyScalar(lerp(1, 0.5, this.night) * (1 - s * 0.3)),
      this.flash > 0)
    ) {
      const h = this.flash * (1 - 0.65 * this.day);
      (this.skyColor.lerp(LIGHTNING_SKY_COLOR, clamp(h, 0, 1) * 0.8),
        (this.ambientIntensity += h * 2.2),
        this.hazeColor.lerp(LIGHTNING_HAZE_COLOR, clamp(h * 0.6, 0, 1)));
    }
  }
}
export { WorldState };
