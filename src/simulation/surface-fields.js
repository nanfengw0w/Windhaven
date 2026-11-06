// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  CORE_FIELD_BOUNDS,
  FIELD_BOUNDS,
  WATER_LEVEL_CONFIG,
} from "../core/config.js";
import { clamp, smoothstep } from "../core/math.js";
import {
  createFieldTexture,
  updateFieldTexture,
} from "../render/field-texture.js";
const windSampleScratch = {
  x: 0,
  z: 0,
};
const SURFACE_GRID_WIDTH = Math.round(
  (192 * FIELD_BOUNDS.sizeX) / CORE_FIELD_BOUNDS.sizeX,
);
const SURFACE_GRID_DEPTH = Math.round(
  (128 * FIELD_BOUNDS.sizeZ) / CORE_FIELD_BOUNDS.sizeZ,
);
class SurfaceFields {
  constructor(t, e) {
    ((this.world = t),
      (this.rx = SURFACE_GRID_WIDTH),
      (this.rz = SURFACE_GRID_DEPTH));
    const i = SURFACE_GRID_WIDTH * SURFACE_GRID_DEPTH;
    ((this.snow = new Float32Array(i)),
      (this.wet = new Float32Array(i)),
      (this.rain = new Float32Array(i)),
      (this.frost = new Float32Array(i)),
      (this.height = new Float32Array(i)),
      (this.water = new Uint8Array(i)),
      (this.lakeFrozen = 0),
      (this._weatherTransition = null),
      (this._weatherLakeHandoff = false));
    const { data: s, resX: n, resZ: o } = e;
    for (let a = 0; a < SURFACE_GRID_DEPTH; a++)
      for (let l = 0; l < SURFACE_GRID_WIDTH; l++) {
        const c = Math.min(
            n - 1,
            Math.floor(((l + 0.5) / SURFACE_GRID_WIDTH) * n),
          ),
          f =
            (Math.min(o - 1, Math.floor(((a + 0.5) / SURFACE_GRID_DEPTH) * o)) *
              n +
              c) *
            4,
          u = a * SURFACE_GRID_WIDTH + l;
        ((this.height[u] = s[f]),
          (this.water[u] = s[f + 1] > 0.5 || s[f + 2] > 0.5 ? 1 : 0));
      }
    ((this.data = new Float32Array(i * 4)),
      (this.texture = createFieldTexture(
        this.data,
        SURFACE_GRID_WIDTH,
        SURFACE_GRID_DEPTH,
      )),
      (this._uploadTimer = 0));
  }
  _cell(t, e) {
    const i = Math.floor(
        ((t - FIELD_BOUNDS.minX) / FIELD_BOUNDS.sizeX) * SURFACE_GRID_WIDTH,
      ),
      s = Math.floor(
        ((e - FIELD_BOUNDS.minZ) / FIELD_BOUNDS.sizeZ) * SURFACE_GRID_DEPTH,
      );
    return i < 0 || s < 0 || i >= SURFACE_GRID_WIDTH || s >= SURFACE_GRID_DEPTH
      ? -1
      : s * SURFACE_GRID_WIDTH + i;
  }
  _sample(t, e, i) {
    const s = clamp(
        ((e - FIELD_BOUNDS.minX) / FIELD_BOUNDS.sizeX) * SURFACE_GRID_WIDTH -
          0.5,
        0,
        SURFACE_GRID_WIDTH - 1.001,
      ),
      n = clamp(
        ((i - FIELD_BOUNDS.minZ) / FIELD_BOUNDS.sizeZ) * SURFACE_GRID_DEPTH -
          0.5,
        0,
        SURFACE_GRID_DEPTH - 1.001,
      ),
      o = Math.floor(s),
      a = Math.floor(n),
      l = s - o,
      c = n - a,
      h = t[a * SURFACE_GRID_WIDTH + o],
      f = t[a * SURFACE_GRID_WIDTH + o + 1],
      u = t[(a + 1) * SURFACE_GRID_WIDTH + o],
      d = t[(a + 1) * SURFACE_GRID_WIDTH + o + 1];
    return (h * (1 - l) + f * l) * (1 - c) + (u * (1 - l) + d * l) * c;
  }
  snowAt(t, e) {
    return this._sample(this.snow, t, e);
  }
  wetAt(t, e) {
    return this._sample(this.wet, t, e);
  }
  frostAt(t, e) {
    return this._sample(this.frost, t, e);
  }
  get weatherLakeFrozen() {
    return this._weatherTransition || this._weatherLakeHandoff
      ? this.lakeFrozen
      : null;
  }
  _stamp(t, e, i, s) {
    const n =
        ((t - FIELD_BOUNDS.minX) / FIELD_BOUNDS.sizeX) * SURFACE_GRID_WIDTH,
      o = ((e - FIELD_BOUNDS.minZ) / FIELD_BOUNDS.sizeZ) * SURFACE_GRID_DEPTH,
      a = (i / FIELD_BOUNDS.sizeX) * SURFACE_GRID_WIDTH,
      l = (i / FIELD_BOUNDS.sizeZ) * SURFACE_GRID_DEPTH,
      c = Math.max(0, Math.floor(n - a)),
      h = Math.min(SURFACE_GRID_WIDTH - 1, Math.ceil(n + a)),
      f = Math.max(0, Math.floor(o - l)),
      u = Math.min(SURFACE_GRID_DEPTH - 1, Math.ceil(o + l));
    for (let d = f; d <= u; d++)
      for (let p = c; p <= h; p++) {
        const v = ((p + 0.5 - n) / a) ** 2 + ((d + 0.5 - o) / l) ** 2;
        v > 1 || s(d * SURFACE_GRID_WIDTH + p, Math.exp(-v * 2.5));
      }
  }
  deposit(t, e, i, s, n) {
    const o = this.world,
      a = ((t - FIELD_BOUNDS.minX) / FIELD_BOUNDS.sizeX) * SURFACE_GRID_WIDTH,
      l = ((e - FIELD_BOUNDS.minZ) / FIELD_BOUNDS.sizeZ) * SURFACE_GRID_DEPTH,
      c = (i / FIELD_BOUNDS.sizeX) * SURFACE_GRID_WIDTH,
      h = (i / FIELD_BOUNDS.sizeZ) * SURFACE_GRID_DEPTH,
      f = Math.max(0, Math.floor(a - c)),
      u = Math.min(SURFACE_GRID_WIDTH - 1, Math.ceil(a + c)),
      d = Math.max(0, Math.floor(l - h)),
      p = Math.min(SURFACE_GRID_DEPTH - 1, Math.ceil(l + h)),
      v = o.seaLevelTemp,
      g = v - o.temperatureAt(1),
      x = this.lakeFrozen > 0.5;
    let m = 0;
    for (let w = d; w <= p; w++) {
      const y = (w + 0.5 - l) / h;
      for (let _ = f; _ <= u; _++) {
        const M = (_ + 0.5 - a) / c,
          A = M * M + y * y;
        if (A > 1) continue;
        const b = w * SURFACE_GRID_WIDTH + _,
          S = s * n * Math.exp(-A * 2.5),
          E = v - g * Math.max(0, this.height[b]),
          T = smoothstep(1, -1, E);
        if (this._weatherTransition) {
          this.rain[b] = Math.min(1, this.rain[b] + S * 3);
          m += this.water[b] ? S * (1 - T * 0.7) : S * (1 - T) * 0.15;
          continue;
        }
        if (
          ((this.rain[b] = Math.min(1, this.rain[b] + S * 3)), this.water[b])
        ) {
          (x && (this.snow[b] = Math.min(1.5, this.snow[b] + S * T * 0.07)),
            (m += S * (1 - T * 0.7)));
          continue;
        }
        ((this.snow[b] = Math.min(1.5, this.snow[b] + S * T * 0.085)),
          (this.wet[b] = Math.min(1, this.wet[b] + S * (1 - T) * 0.45)),
          T < 0.5 && (this.snow[b] = Math.max(0, this.snow[b] - S * 0.02)),
          (m += S * (1 - T) * 0.15));
      }
    }
    o.waterRise = Math.min(WATER_LEVEL_CONFIG.maxRise, o.waterRise + m * 22e-5);
  }
  addSnow(t, e, i, s) {
    this._stamp(t, e, i, (n, o) => {
      this.water[n] || (this.snow[n] = Math.min(1.5, this.snow[n] + s * o));
    });
  }
  addWet(t, e, i, s) {
    this._stamp(t, e, i, (n, o) => {
      this.wet[n] = Math.min(1, this.wet[n] + s * o);
    });
  }
  fillSnowByTemperature(t = 1) {
    for (let e = 0; e < this.snow.length; e++) {
      if (this.water[e] && this.lakeFrozen < 0.5) continue;
      const i = this.world.temperatureAt(this.height[e]);
      this.snow[e] = Math.max(this.snow[e], t * smoothstep(1.5, -2, i));
    }
  }
  beginWeatherTransition(
    {
      snowAmount = 0,
      temperatureAt = (height) => this.world.temperatureAt(height),
      wetPatches = [],
      lakeFrozen = 0,
    },
    duration = 8,
  ) {
    const snow = new Float32Array(this.snow.length);
    const wet = new Float32Array(this.wet.length);
    const targetIce = clamp(lakeFrozen, 0, 1);
    for (let index = 0; index < snow.length; index++) {
      if (this.water[index] && targetIce <= 0.5) continue;
      snow[index] =
        snowAmount * smoothstep(1.5, -2, temperatureAt(this.height[index]));
    }
    for (const [x, z, radius, amount] of wetPatches) {
      this._stamp(x, z, radius, (index, strength) => {
        wet[index] = Math.min(1, wet[index] + amount * strength);
      });
    }
    this._weatherTransition = {
      fromSnow: this.snow.slice(),
      fromWet: this.wet.slice(),
      fromIce: this.lakeFrozen,
      snow,
      wet,
      ice: targetIce,
      elapsed: 0,
      duration: Number.isFinite(duration) ? Math.max(1 / 15, duration) : 8,
    };
    this._weatherLakeHandoff = false;
  }
  cancelWeatherTransition() {
    if (!this._weatherTransition) return;
    this._weatherTransition = null;
    this._weatherLakeHandoff = true;
  }
  clear() {
    this.cancelWeatherTransition();
    (this.snow.fill(0), this.wet.fill(0), this.rain.fill(0));
  }
  update(t, force = false) {
    const weather = this._weatherTransition;
    if (weather) {
      weather.elapsed = Math.min(weather.duration, weather.elapsed + t);
      if (weather.duration - weather.elapsed < 1e-8)
        weather.elapsed = weather.duration;
    } else {
      // Water updates before fields, so the final ice value has had one frame
      // to transfer to WaterSystem before normal freezing/melting resumes.
      this._weatherLakeHandoff = false;
    }
    if (((this._acc = (this._acc || 0) + t), this._acc < 1 / 15 && !force))
      return;
    const e = this._acc;
    this._acc = 0;
    const weatherBlend = weather
      ? smoothstep(0, weather.duration, weather.elapsed)
      : 0;
    if (weather) {
      this.lakeFrozen =
        weather.fromIce + (weather.ice - weather.fromIce) * weatherBlend;
    }
    const i = this.world,
      s = i.day * (1 - i.cloudCover * 0.7) * Math.max(0, i.sunElevation),
      n = i.windEnergy,
      o = this.snow.length;
    let a = 0,
      l = 0;
    const c = i.seaLevelTemp,
      h = c - i.temperatureAt(1),
      f = Math.exp(-e * 2.5),
      u = s * 0.012,
      d = 0.004 + s * 0.012 + n * 0.002,
      p = 1 - s * 0.8,
      v = this.snow,
      g = this.wet,
      x = this.rain,
      m = this.frost,
      w = this.height,
      y = this.data;
    for (let _ = 0; _ < o; _++) {
      const M = c - h * Math.max(0, w[_]),
        A = M > 0 ? M : 0;
      let b = v[_],
        S = g[_];
      if (weather) {
        b =
          weather.fromSnow[_] +
          (weather.snow[_] - weather.fromSnow[_]) * weatherBlend;
        S =
          weather.fromWet[_] +
          (weather.wet[_] - weather.fromWet[_]) * weatherBlend;
      } else {
        if (b > 0) {
          const z = Math.min(b, (A * 0.006 + u * (M > -3 ? 1 : 0.2)) * e);
          ((b -= z), (S = Math.min(1, S + z * 1.6)));
        }
        S = Math.max(0, S - e * (d + A * 9e-4) * (b > 0.2 ? 0.2 : 1));
      }
      const E = x[_] * f,
        T = smoothstep(1.5, -3, M) * p;
      ((v[_] = b),
        (g[_] = S),
        (x[_] = E),
        (m[_] = T),
        (a += S),
        (l += b < 0.5 ? b * 2 : 1));
      const R = _ * 4;
      ((y[R] = b), (y[R + 1] = S), (y[R + 2] = E), (y[R + 3] = T));
    }
    ((i.groundWetness = a / o),
      (i.snowCover = l / o),
      updateFieldTexture(this.texture));
    if (weather && weather.elapsed >= weather.duration) {
      this._weatherTransition = null;
      this._weatherLakeHandoff = true;
    }
  }
}
export { SurfaceFields, windSampleScratch };
