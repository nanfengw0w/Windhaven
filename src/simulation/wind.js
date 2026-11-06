// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeVector2, ThreeVector3 } from "../vendor/three-runtime.js";
import { CORE_FIELD_BOUNDS, FIELD_BOUNDS } from "../core/config.js";
import { clamp, createSimplexNoise, damp } from "../core/math.js";
import {
  createFieldTexture,
  updateFieldTexture,
} from "../render/field-texture.js";
import { windSampleScratch } from "./surface-fields.js";
const WIND_GRID_WIDTH = Math.round(
  (48 * FIELD_BOUNDS.sizeX) / CORE_FIELD_BOUNDS.sizeX,
);
const WIND_GRID_DEPTH = Math.round(
  (32 * FIELD_BOUNDS.sizeZ) / CORE_FIELD_BOUNDS.sizeZ,
);
const WIND_CELL_SIZE = FIELD_BOUNDS.sizeX / WIND_GRID_WIDTH;
class WindField {
  constructor(t) {
    ((this.world = t),
      (this.nx = WIND_GRID_WIDTH),
      (this.nz = WIND_GRID_DEPTH),
      (this.cell = WIND_CELL_SIZE));
    const e = WIND_GRID_WIDTH * WIND_GRID_DEPTH;
    ((this.u = new Float32Array(e)),
      (this.w = new Float32Array(e)),
      (this.u0 = new Float32Array(e)),
      (this.w0 = new Float32Array(e)),
      (this.p = new Float32Array(e)),
      (this.div = new Float32Array(e)),
      (this.turb = new Float32Array(e)),
      (this.noise = createSimplexNoise(99)),
      (this.ambient = new ThreeVector2(0.3, 0.05)),
      (this.ambientDir = 0.2),
      (this.gustiness = 0.3),
      (this.energy = 0),
      (this.time = 0),
      (this.data = new Float32Array(e * 4)),
      (this.texture = createFieldTexture(
        this.data,
        WIND_GRID_WIDTH,
        WIND_GRID_DEPTH,
      )));
  }
  idx(t, e) {
    return e * WIND_GRID_WIDTH + t;
  }
  _gx(t) {
    return (t - FIELD_BOUNDS.minX) / WIND_CELL_SIZE - 0.5;
  }
  _gz(t) {
    return (t - FIELD_BOUNDS.minZ) / WIND_CELL_SIZE - 0.5;
  }
  _bilinear(t, e, i) {
    ((e = clamp(e, 0, WIND_GRID_WIDTH - 1.001)),
      (i = clamp(i, 0, WIND_GRID_DEPTH - 1.001)));
    const s = Math.floor(e),
      n = Math.floor(i),
      o = e - s,
      a = i - n,
      l = t[n * WIND_GRID_WIDTH + s],
      c = t[n * WIND_GRID_WIDTH + s + 1],
      h = t[(n + 1) * WIND_GRID_WIDTH + s],
      f = t[(n + 1) * WIND_GRID_WIDTH + s + 1];
    return (l * (1 - o) + c * o) * (1 - a) + (h * (1 - o) + f * o) * a;
  }
  gustAt(t, e) {
    const i = this.time,
      s = this.ambient.x,
      n = this.ambient.y,
      o = this.noise.noise3(
        t * 0.35 - s * i * 0.5,
        e * 0.35 - n * i * 0.5,
        i * 0.15,
      );
    return clamp(1 + o * (0.55 + this.gustiness), 0.1, 2.5);
  }
  sample(
    t,
    e,
    i = {
      x: 0,
      z: 0,
    },
    s = 0,
  ) {
    const n = this._gx(t),
      o = this._gz(e),
      a = this._bilinear(this.u, n, o),
      l = this._bilinear(this.w, n, o),
      c =
        s > 0 ? 1 + (this.gustAt(t, e) - 1) * (1 - s * 0.7) : this.gustAt(t, e),
      h = 1 + s * 0.6;
    return (
      (i.x = a + this.ambient.x * c * h),
      (i.z = l + this.ambient.y * c * h),
      i
    );
  }
  sampleVec3(t, e = new ThreeVector3(), i = 0) {
    const s = this.sample(t.x, t.z, windSampleScratch, i);
    return e.set(s.x, 0, s.z);
  }
  turbulenceAt(t, e) {
    return this._bilinear(this.turb, this._gx(t), this._gz(e));
  }
  addForce(t, e, i, s, n = 0.8, o = 1) {
    const a = n / WIND_CELL_SIZE,
      l = this._gx(t),
      c = this._gz(e),
      h = Math.max(0, Math.floor(l - a * 2)),
      f = Math.min(WIND_GRID_WIDTH - 1, Math.ceil(l + a * 2)),
      u = Math.max(0, Math.floor(c - a * 2)),
      d = Math.min(WIND_GRID_DEPTH - 1, Math.ceil(c + a * 2));
    for (let p = u; p <= d; p++)
      for (let v = h; v <= f; v++) {
        const g = ((v - l) ** 2 + (p - c) ** 2) / (a * a);
        if (g > 4) continue;
        const x = Math.exp(-g * 1.5) * o,
          m = p * WIND_GRID_WIDTH + v;
        ((this.u[m] += (i - this.u[m]) * Math.min(1, x)),
          (this.w[m] += (s - this.w[m]) * Math.min(1, x)));
      }
  }
  addRadial(t, e, i = 1, s = 1.2) {
    const n = s / WIND_CELL_SIZE,
      o = this._gx(t),
      a = this._gz(e),
      l = Math.max(0, Math.floor(o - n * 2)),
      c = Math.min(WIND_GRID_WIDTH - 1, Math.ceil(o + n * 2)),
      h = Math.max(0, Math.floor(a - n * 2)),
      f = Math.min(WIND_GRID_DEPTH - 1, Math.ceil(a + n * 2));
    for (let u = h; u <= f; u++)
      for (let d = l; d <= c; d++) {
        const p = d - o,
          v = u - a,
          g = Math.hypot(p, v) + 1e-4,
          x = Math.exp(-((g / n) ** 2) * 1.2) * i,
          m = u * WIND_GRID_WIDTH + d;
        ((this.u[m] += (p / g) * x), (this.w[m] += (v / g) * x));
      }
  }
  addVortex(t, e, i = 1, s = 1.5) {
    const n = s / WIND_CELL_SIZE,
      o = this._gx(t),
      a = this._gz(e),
      l = Math.max(0, Math.floor(o - n * 2)),
      c = Math.min(WIND_GRID_WIDTH - 1, Math.ceil(o + n * 2)),
      h = Math.max(0, Math.floor(a - n * 2)),
      f = Math.min(WIND_GRID_DEPTH - 1, Math.ceil(a + n * 2));
    for (let u = h; u <= f; u++)
      for (let d = l; d <= c; d++) {
        const p = d - o,
          v = u - a,
          g = Math.hypot(p, v) + 1e-4,
          x = Math.exp(-((g / n) ** 2)) * i,
          m = u * WIND_GRID_WIDTH + d;
        ((this.u[m] += (-v / g) * x), (this.w[m] += (p / g) * x));
      }
  }
  update(t) {
    if (t <= 0) return;
    this.time += t;
    const e = this.world,
      i = e.seasonal;
    // Ambient wind: seasonal breeze + storm pressure, with the direction slowly
    // wandering via noise so the weather never feels like a fixed fan.
    this.ambientDir += this.noise.noise2(this.time * 0.03, 4.2) * 0.25 * t;
    const s =
        i.breeze * (0.6 + 0.4 * this.noise.noise2(this.time * 0.07, 9.1)) +
        e.storminess * 1.6,
      n = Math.cos(this.ambientDir) * s,
      o = Math.sin(this.ambientDir) * s * 0.6;
    ((this.ambient.x = damp(this.ambient.x, n, 0.5, t)),
      (this.ambient.y = damp(this.ambient.y, o, 0.5, t)),
      (this.gustiness = 0.25 + e.storminess * 0.9));
    const a = this.u,
      l = this.w,
      c = WIND_GRID_WIDTH * WIND_GRID_DEPTH;
    // Semi-Lagrangian advection: back-trace each cell along its own velocity
    // (u0/w0 hold the pre-advecting snapshot) and sample upstream.
    (this.u0.set(a), this.w0.set(l));
    const h = t / WIND_CELL_SIZE;
    for (let m = 0; m < WIND_GRID_DEPTH; m++)
      for (let w = 0; w < WIND_GRID_WIDTH; w++) {
        const y = m * WIND_GRID_WIDTH + w,
          _ = w - this.u0[y] * h,
          M = m - this.w0[y] * h;
        ((a[y] = this._bilinear(this.u0, _, M)),
          (l[y] = this._bilinear(this.w0, _, M)));
      }
    // Boundary absorption: the grid edges only let wind leave, at 20% strength,
    // so tool-injected gusts do not reflect back into the field.
    for (let m = 0; m < WIND_GRID_DEPTH; m++)
      ((a[m * WIND_GRID_WIDTH] = Math.max(0, a[m * WIND_GRID_WIDTH]) * 0.2),
        (a[m * WIND_GRID_WIDTH + WIND_GRID_WIDTH - 1] =
          Math.min(0, a[m * WIND_GRID_WIDTH + WIND_GRID_WIDTH - 1]) * 0.2));
    for (let m = 0; m < WIND_GRID_WIDTH; m++)
      ((l[m] = Math.max(0, l[m]) * 0.2),
        (l[(WIND_GRID_DEPTH - 1) * WIND_GRID_WIDTH + m] =
          Math.min(0, l[(WIND_GRID_DEPTH - 1) * WIND_GRID_WIDTH + m]) * 0.2));
    // Pressure projection (make the field divergence-free):
    // 1) accumulate the negative divergence, 0.8-decayed pressure as warm start
    const f = this.div,
      u = this.p;
    for (let m = 0; m < WIND_GRID_DEPTH; m++)
      for (let w = 0; w < WIND_GRID_WIDTH; w++) {
        const y = m * WIND_GRID_WIDTH + w,
          _ = w < WIND_GRID_WIDTH - 1 ? a[y + 1] : -a[y],
          M = w > 0 ? a[y - 1] : -a[y],
          A = m < WIND_GRID_DEPTH - 1 ? l[y + WIND_GRID_WIDTH] : -l[y],
          b = m > 0 ? l[y - WIND_GRID_WIDTH] : -l[y];
        ((f[y] = -0.5 * (_ - M + A - b)), (u[y] *= 0.8));
      }
    // 2) 14 Jacobi iterations of ∇²p = div
    for (let m = 0; m < 14; m++)
      for (let w = 0; w < WIND_GRID_DEPTH; w++)
        for (let y = 0; y < WIND_GRID_WIDTH; y++) {
          const _ = w * WIND_GRID_WIDTH + y,
            M = y < WIND_GRID_WIDTH - 1 ? u[_ + 1] : u[_],
            A = y > 0 ? u[_ - 1] : u[_],
            b = w < WIND_GRID_DEPTH - 1 ? u[_ + WIND_GRID_WIDTH] : u[_],
            S = w > 0 ? u[_ - WIND_GRID_WIDTH] : u[_];
          u[_] = (f[_] + M + A + b + S) * 0.25;
        }
    // 3) subtract the pressure gradient
    for (let m = 0; m < WIND_GRID_DEPTH; m++)
      for (let w = 0; w < WIND_GRID_WIDTH; w++) {
        const y = m * WIND_GRID_WIDTH + w,
          _ = w < WIND_GRID_WIDTH - 1 ? u[y + 1] : u[y],
          M = w > 0 ? u[y - 1] : u[y],
          A = m < WIND_GRID_DEPTH - 1 ? u[y + WIND_GRID_WIDTH] : u[y],
          b = m > 0 ? u[y - WIND_GRID_WIDTH] : u[y];
        ((a[y] -= 0.5 * (_ - M)), (l[y] -= 0.5 * (A - b)));
      }
    // Exponential calm-down plus curl magnitude as the turbulence channel that
    // vegetation/audio consume; energy feeds world.windEnergy.
    const d = Math.exp(-t * 0.55);
    let p = 0;
    for (let m = 0; m < WIND_GRID_DEPTH; m++)
      for (let w = 0; w < WIND_GRID_WIDTH; w++) {
        const y = m * WIND_GRID_WIDTH + w;
        ((a[y] *= d), (l[y] *= d));
        const _ = w < WIND_GRID_WIDTH - 1 ? l[y + 1] : l[y],
          M = w > 0 ? l[y - 1] : l[y],
          A = m < WIND_GRID_DEPTH - 1 ? a[y + WIND_GRID_WIDTH] : a[y],
          b = m > 0 ? a[y - WIND_GRID_WIDTH] : a[y],
          S = Math.abs(0.5 * (_ - M - (A - b)));
        ((this.turb[y] = damp(this.turb[y], clamp(S * 0.8, 0, 1), 4, t)),
          (p += Math.hypot(a[y], l[y])));
      }
    ((this.energy = p / c + this.ambient.length()),
      (e.windEnergy = this.energy));
    const v = this.data,
      g = this.ambient.x,
      x = this.ambient.y;
    for (let m = 0; m < c; m++) {
      const w = a[m] + g,
        y = l[m] + x;
      ((v[m * 4] = w),
        (v[m * 4 + 1] = y),
        (v[m * 4 + 2] = Math.hypot(w, y)),
        (v[m * 4 + 3] = this.turb[m]));
    }
    updateFieldTexture(this.texture);
  }
}
export { WindField };
