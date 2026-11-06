// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeDataTexture,
  ThreeLinearFilter,
  ThreeRGBAFormat,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import { FIELD_BOUNDS } from "../core/config.js";
import { clamp, smoothstep } from "../core/math.js";
import { TOWN_PATHS } from "../layout/world-layout.js";
import { sampleTownPaths } from "../layout/town-paths.js";
import {
  CABIN_PLACEMENT,
  RIVER_PATH,
  lakeEllipse,
  riverHalfWidth,
} from "../simulation/terrain-shape.js";
function samplePathBezier(r, t, e, i, s) {
  const n = [];
  for (let o = 0; o <= s; o++) {
    const a = o / s,
      l = 1 - a,
      c = l * l * l,
      h = 3 * l * l * a,
      f = 3 * l * a * a,
      u = a * a * a;
    n.push({
      x: c * r[0] + h * t[0] + f * e[0] + u * i[0],
      z: c * r[1] + h * t[1] + f * e[1] + u * i[1],
      t: a,
    });
  }
  return n;
}
function findRiverCrossing() {
  let t = RIVER_PATH[0];
  for (const h of RIVER_PATH)
    Math.abs(h.t - 0.42) < Math.abs(t.t - 0.42) && (t = h);
  const e = RIVER_PATH.indexOf(t),
    i = RIVER_PATH[Math.max(0, e - 2)],
    s = RIVER_PATH[Math.min(RIVER_PATH.length - 1, e + 2)],
    n = Math.hypot(s.x - i.x, s.z - i.z) || 1,
    o = (s.x - i.x) / n,
    a = (s.z - i.z) / n;
  let l = -a,
    c = o;
  return (
    (CABIN_PLACEMENT.x - t.x) * l + (CABIN_PLACEMENT.z - t.z) * c < 0 &&
      ((l = -l), (c = -c)),
    {
      x: t.x,
      z: t.z,
      y: t.y,
      t: t.t,
      halfWidth: riverHalfWidth(t.t),
      dirX: o,
      dirZ: a,
      px: l,
      pz: c,
    }
  );
}
const RIVER_CROSSING = findRiverCrossing();
const CABIN_MAIN_PATH_START = [
  CABIN_PLACEMENT.x + 0.5,
  CABIN_PLACEMENT.z + 0.22,
];
const CROSSING_NEAR_BANK = [
  RIVER_CROSSING.x + RIVER_CROSSING.px * (RIVER_CROSSING.halfWidth + 0.14),
  RIVER_CROSSING.z + RIVER_CROSSING.pz * (RIVER_CROSSING.halfWidth + 0.14),
];
const CROSSING_FAR_BANK = [
  RIVER_CROSSING.x - RIVER_CROSSING.px * (RIVER_CROSSING.halfWidth + 0.12),
  RIVER_CROSSING.z - RIVER_CROSSING.pz * (RIVER_CROSSING.halfWidth + 0.12),
];
const TERRAIN_FOOTPATHS = [
  {
    pts: samplePathBezier(
      CABIN_MAIN_PATH_START,
      [-1.75, 2.3],
      [-0.95, 1.9],
      [0.02, 2.42],
      48,
    ),
    width: 0.2,
    taper: 0.6,
    strength: 1,
  },
  {
    pts: samplePathBezier(
      [CABIN_PLACEMENT.x + 0.45, CABIN_PLACEMENT.z - 0.35],
      [-2.1, 0.35],
      [CROSSING_NEAR_BANK[0] - 0.55, CROSSING_NEAR_BANK[1] + 0.35],
      CROSSING_NEAR_BANK,
      40,
    ),
    width: 0.13,
    taper: 0.8,
    strength: 0.7,
  },
  {
    pts: samplePathBezier(
      CROSSING_FAR_BANK,
      [
        CROSSING_FAR_BANK[0] - RIVER_CROSSING.px * 0.2,
        CROSSING_FAR_BANK[1] - RIVER_CROSSING.pz * 0.2,
      ],
      [
        CROSSING_FAR_BANK[0] - RIVER_CROSSING.px * 0.35 - 0.1,
        CROSSING_FAR_BANK[1] - RIVER_CROSSING.pz * 0.35,
      ],
      [
        CROSSING_FAR_BANK[0] - RIVER_CROSSING.px * 0.55 - 0.2,
        CROSSING_FAR_BANK[1] - RIVER_CROSSING.pz * 0.5,
      ],
      10,
    ),
    width: 0.11,
    taper: 0.3,
    strength: 0.5,
  },
];
const TERRAIN_BANK_MASK_WIDTH = 0.55;
class TerrainDetailMasks {
  constructor(t, bounds = FIELD_BOUNDS) {
    this.bounds = bounds;
    const e = (this.resX = t.resX),
      i = (this.resZ = t.resZ),
      s = e * i;
    ((this.cellX = this.bounds.sizeX / e),
      (this.cellZ = this.bounds.sizeZ / i),
      (this.bank = new Float32Array(s).fill(1e3)),
      (this.shore = new Float32Array(s)),
      (this.staticBare = new Float32Array(s)),
      (this.bare = new Float32Array(s)),
      (this.hollow = new Float32Array(s)),
      (this.data = new Uint8Array(s * 4)),
      this._bakeBanks(),
      this._bakeShore(),
      this._bakeHollows(t.data),
      this._bakeStaticBare(),
      this.bare.set(this.staticBare),
      (this.texture = new ThreeDataTexture(
        this.data,
        e,
        i,
        ThreeRGBAFormat,
        ThreeUnsignedByteType,
      )),
      (this.texture.magFilter = ThreeLinearFilter),
      (this.texture.minFilter = ThreeLinearFilter),
      (this.texture.generateMipmaps = !1),
      this._pack());
  }
  _x(t) {
    return this.bounds.minX + (t + 0.5) * this.cellX;
  }
  _z(t) {
    return this.bounds.minZ + (t + 0.5) * this.cellZ;
  }
  _rect(t, e, i, s, n) {
    const o = Math.max(0, Math.floor((t - this.bounds.minX) / this.cellX)),
      a = Math.min(
        this.resX - 1,
        Math.ceil((e - this.bounds.minX) / this.cellX),
      ),
      l = Math.max(0, Math.floor((i - this.bounds.minZ) / this.cellZ)),
      c = Math.min(
        this.resZ - 1,
        Math.ceil((s - this.bounds.minZ) / this.cellZ),
      );
    for (let h = l; h <= c; h++) {
      const f = this._z(h);
      for (let u = o; u <= a; u++) n(h * this.resX + u, this._x(u), f);
    }
  }
  _bakeBanks() {
    const t = RIVER_PATH,
      e = TERRAIN_BANK_MASK_WIDTH + 0.3;
    for (let i = 0; i < t.length - 1; i++) {
      const s = t[i],
        n = t[i + 1],
        o = n.x - s.x,
        a = n.z - s.z,
        l = o * o + a * a || 1e-9;
      this._rect(
        Math.min(s.x, n.x) - e,
        Math.max(s.x, n.x) + e,
        Math.min(s.z, n.z) - e,
        Math.max(s.z, n.z) + e,
        (c, h, f) => {
          let u = ((h - s.x) * o + (f - s.z) * a) / l;
          u = u < 0 ? 0 : u > 1 ? 1 : u;
          const d =
            Math.hypot(s.x + o * u - h, s.z + a * u - f) -
            riverHalfWidth(s.t + (n.t - s.t) * u);
          d < this.bank[c] && (this.bank[c] = d);
        },
      );
    }
  }
  _bakeShore() {
    for (let t = 0; t < this.resZ; t++)
      for (let e = 0; e < this.resX; e++) {
        const i = lakeEllipse(this._x(e), this._z(t));
        this.shore[t * this.resX + e] = 1 - smoothstep(1, 1.45, i);
      }
  }
  _bakeHollows(t) {
    const e = this.resX,
      i = this.resZ,
      s = e * i,
      n = new Float32Array(s),
      o = new Float32Array(s),
      a = new Float32Array(s);
    for (let h = 0; h < s; h++) n[h] = t[h * 4];
    const l = 6,
      c = (h, f, u) => {
        for (let d = 0; d < i; d++)
          for (let p = 0; p < e; p++) {
            let v = 0,
              g = 0;
            for (let x = -l; x <= l; x++) {
              const m = u ? clamp(p + x, 0, e - 1) : p,
                w = u ? d : clamp(d + x, 0, i - 1);
              ((v += h[w * e + m]), g++);
            }
            f[d * e + p] = v / g;
          }
      };
    (c(n, o, !0), c(o, a, !1), c(a, o, !0), c(o, a, !1));
    for (let h = 0; h < s; h++) {
      const f = t[h * 4 + 1] > 0.3 || t[h * 4 + 2] > 0.3;
      this.hollow[h] = f ? 0 : smoothstep(0, 0.045, a[h] - n[h]);
    }
  }
  _bakeStaticBare() {
    const t = this.staticBare,
      e = 1.15;
    this._rect(
      CABIN_PLACEMENT.x - e,
      CABIN_PLACEMENT.x + e,
      CABIN_PLACEMENT.z - e,
      CABIN_PLACEMENT.z + e,
      (i, s, n) => {
        const o = Math.hypot(s - CABIN_PLACEMENT.x, n - CABIN_PLACEMENT.z);
        t[i] = Math.max(t[i], 1 - smoothstep(0.3, 0.95, o));
      },
    );
    const townSample = {};
    this._rect(6.6, 11.8, -3.2, 4.6, (index, x, z) => {
      const coverage = sampleTownPaths(TOWN_PATHS, x, z, townSample).coverage;
      t[index] = Math.max(t[index], coverage);
    });
    for (const i of TERRAIN_FOOTPATHS) {
      const s = i.pts;
      for (let n = 0; n < s.length - 1; n++) {
        const o = s[n],
          a = s[n + 1],
          l = i.width;
        this._rect(
          Math.min(o.x, a.x) - l,
          Math.max(o.x, a.x) + l,
          Math.min(o.z, a.z) - l,
          Math.max(o.z, a.z) + l,
          (c, h, f) => {
            const u = a.x - o.x,
              d = a.z - o.z;
            let p = ((h - o.x) * u + (f - o.z) * d) / (u * u + d * d || 1e-9);
            p = p < 0 ? 0 : p > 1 ? 1 : p;
            const v = o.t + (a.t - o.t) * p,
              g = l * (1 - (1 - i.taper) * v) * 0.5,
              x = Math.hypot(o.x + u * p - h, o.z + d * p - f),
              m =
                (1 - smoothstep(g * 0.35, g * 1.6, x)) *
                i.strength *
                smoothstep(0, 0.06, v) *
                (1 - smoothstep(0.9, 1, v) * 0.7);
            m > t[c] && (t[c] = m);
          },
        );
      }
    }
  }
  stampRocks(t) {
    this.core?.stampRocks(t);
    const e = this.staticBare;
    for (const i of t) {
      if (i.r < 0.06 || i.kind === "stepping") continue;
      const s = i.r * 1.35;
      this._rect(i.x - s, i.x + s, i.z - s, i.z + s, (n, o, a) => {
        const l = Math.hypot(o - i.x, a - i.z);
        e[n] = Math.max(e[n], (1 - smoothstep(i.r * 0.7, s, l)) * 0.34);
      });
    }
    (this.bare.set(e), this._pack());
  }
  stampTrees(t) {
    this.core?.stampTrees(t);
    const e = this.bare;
    e.set(this.staticBare);
    for (const i of t) {
      const s = Math.max(
          0.12,
          (i.radius || 0.4) *
            (i.kind === "bush" ? 0.5 : i.kind === "pine" ? 0.75 : 0.62),
        ),
        n = s * 1.6,
        o = i.kind === "bush" ? 0.55 : 0.9;
      this._rect(i.x - n, i.x + n, i.z - n, i.z + n, (a, l, c) => {
        const h = Math.hypot(l - i.x, c - i.z);
        e[a] = Math.max(e[a], (1 - smoothstep(s * 0.25, n, h)) * o);
      });
    }
    this._pack();
  }
  bareAt(t, e) {
    if (
      this.core &&
      t >= this.core.bounds.minX &&
      t <= this.core.bounds.minX + this.core.bounds.sizeX &&
      e >= this.core.bounds.minZ &&
      e <= this.core.bounds.minZ + this.core.bounds.sizeZ
    ) {
      return this.core.bareAt(t, e);
    }
    const i = clamp(
        (t - this.bounds.minX) / this.cellX - 0.5,
        0,
        this.resX - 1.001,
      ),
      s = clamp(
        (e - this.bounds.minZ) / this.cellZ - 0.5,
        0,
        this.resZ - 1.001,
      ),
      n = Math.floor(i),
      o = Math.floor(s),
      a = i - n,
      l = s - o,
      c = this.resX,
      h = this.bare;
    return (
      (h[o * c + n] * (1 - a) + h[o * c + n + 1] * a) * (1 - l) +
      (h[(o + 1) * c + n] * (1 - a) + h[(o + 1) * c + n + 1] * a) * l
    );
  }
  _pack() {
    const t = this.data,
      e = this.resX * this.resZ;
    for (let i = 0; i < e; i++) {
      const s = 1 - smoothstep(0, TERRAIN_BANK_MASK_WIDTH, this.bank[i]);
      ((t[i * 4] = Math.round(s * 255)),
        (t[i * 4 + 1] = Math.round(this.shore[i] * 255)),
        (t[i * 4 + 2] = Math.round(clamp(this.bare[i], 0, 1) * 255)),
        (t[i * 4 + 3] = Math.round(this.hollow[i] * 255)));
    }
    if (this.core) {
      // Keep original paths and clearings. Hollows must use the full terrain:
      // the old box-edge blur clamp creates a rectangular AO/puddle collar.
      const core = this.core;
      const offsetX = Math.round(
        (core.bounds.minX - this.bounds.minX) / this.cellX,
      );
      const offsetZ = Math.round(
        (core.bounds.minZ - this.bounds.minZ) / this.cellZ,
      );
      for (let z = 0; z < core.resZ; z++) {
        const src = z * core.resX;
        const dst = (z + offsetZ) * this.resX + offsetX;
        for (const key of ["bank", "shore", "staticBare", "bare"]) {
          this[key].set(core[key].subarray(src, src + core.resX), dst);
        }
        for (let x = 0; x < core.resX; x++) {
          const from = (src + x) * 4;
          const to = (dst + x) * 4;
          for (let channel = 0; channel < 3; channel++)
            this.data[to + channel] = core.data[from + channel];
        }
      }
    }
    this.texture && (this.texture.needsUpdate = !0);
  }
  preserveCore(core) {
    this.core = core;
    this._pack();
    return this;
  }
}
export { RIVER_CROSSING, TERRAIN_FOOTPATHS, TerrainDetailMasks };
