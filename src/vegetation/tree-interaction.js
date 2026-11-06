import {
  ThreeDataTexture,
  ThreeFloatType,
  ThreeNearestFilter,
  ThreeRGBAFormat,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { clamp, smoothstep } from "../core/math.js";
import { PLANT_SPECIES_CODES, isShrubSpecies } from "./tree-species.js";
import { getTreeRegistry } from "./tree-registry.js";

const yv = new ThreeVector3();
const $n = new ThreeVector3();
const Zn = new ThreeVector3();
const bR = new ThreeVector3();
const vegetationWindSample = { x: 0, z: 0 };

// Each forest keeps its own instance indices and deformation texture while
// sharing picking, fixed-root dragging, spring recovery and leaf agitation.
class TreeInteractionController {
  constructor(
    ctx,
    plants,
    { name = "vegetation", onAgitate = null, leafEffect = "standard" } = {},
  ) {
    this.ctx = ctx;
    this.plants = plants;
    this.name = name;
    this.onAgitate = onAgitate;
    const o = this.plants.length;
    ((this._bend = new Float32Array(o * 2)),
      (this._vel = new Float32Array(o * 2)),
      (this._target = new Float32Array(o * 2)),
      (this._rustle = new Float32Array(o)),
      (this._keep = new Float32Array(o).fill(1)),
      (this._omega = new Float32Array(o)),
      (this._zeta = new Float32Array(o)),
      (this._lastGust = new Float32Array(o)),
      this.plants.forEach((v, g) => {
        ((this._omega[g] =
          (Math.PI * 2 * (v.code === PLANT_SPECIES_CODES.pine ? 1.05 : 0.9)) /
          Math.sqrt(v.height)),
          (this._zeta[g] =
            v.code === PLANT_SPECIES_CODES.pine
              ? 0.16
              : isShrubSpecies(v.code)
                ? 0.2
                : 0.11));
      }));
    const a = Math.max(1, o);
    this._shakeData = new Float32Array(a * 4);
    for (let v = 0; v < o; v++) this._shakeData[v * 4 + 3] = 1;
    ((this.shakeTexture = new ThreeDataTexture(
      this._shakeData,
      a,
      1,
      ThreeRGBAFormat,
      ThreeFloatType,
    )),
      (this.shakeTexture.magFilter = this.shakeTexture.minFilter =
        ThreeNearestFilter),
      (this.shakeTexture.needsUpdate = !0),
      (this._dirty = !1));
    this._grab = null;
    this._hoverIndex = -1;
    this._gustTimer = 0;
    this._disposed = false;
    this._installInput();
    this._offScenario = ctx.events?.on?.("scenario", () => this._reset());
    this._offTrees = getTreeRegistry(ctx).register(this, plants, {
      name,
      leafEffect,
    });
  }
  shake(t, e, i = 1, s = 1) {
    let n = 0;
    for (let o = 0; o < this.plants.length; o++) {
      const a = this.plants[o],
        l = a.x - t,
        c = a.z - e,
        h = Math.hypot(l, c);
      if (h > i + a.radius) continue;
      const f =
        s *
        Math.pow(
          1 - clamp((h - a.radius * 0.5) / Math.max(i, 0.001), 0, 1),
          1.5,
        );
      if (f <= 0.01) continue;
      let u = l / (h || 1),
        d = c / (h || 1);
      if (h < 0.05) {
        const v = Math.random() * Math.PI * 2;
        ((u = Math.cos(v)), (d = Math.sin(v)));
      }
      const p = f * a.height * 2.6;
      ((this._vel[o * 2] += u * p),
        (this._vel[o * 2 + 1] += d * p),
        this._agitate(o, f, n < 10),
        n++);
    }
  }
  _clearInput() {
    const input = this.ctx.input;
    // Drop only this batch's capture. Other trees and tools keep their state.
    if (this._handler && input?.active?.handler === this._handler)
      input._cancelActive?.();
    if (this._handler && input?.hover?.handler === this._handler)
      input._setHover?.(null);
    input?.invalidateHover?.();
    input?._updateCursor?.();
  }
  _reset() {
    (this._bend.fill(0),
      this._vel.fill(0),
      this._target.fill(0),
      this._rustle.fill(0),
      this._keep.fill(1),
      (this._grab = null),
      (this._hoverIndex = -1),
      (this._dirty = !0));
    this._clearInput();
  }
  _agitate(t, e, i = !0) {
    const s = this.plants[t];
    this._rustle[t] = Math.min(1.5, this._rustle[t] + e);
    this._keep[t] = Math.max(0, this._keep[t] - e * 0.55);
    this._dirty = true;
    if (i && e > 0.05) {
      const payload = {
        x: s.x,
        y: s.canopyY,
        z: s.z,
        kind: s.kind,
        code: s.code,
        plant: s,
        controller: this,
        index: t,
        bendX: this._bend[t * 2],
        bendZ: this._bend[t * 2 + 1],
        rootY: s.y,
        height: s.height,
        radius: s.radius,
        strength: clamp(e, 0, 1.5),
      };
      if (this.onAgitate) this.onAgitate(payload, t);
      else this.ctx.events?.emit?.("tree:shake", payload);
    }
  }
  _installInput() {
    const { ctx: t } = this,
      e = t.input;
    if (!e?.addHandler) return;
    this._unregister = e.addHandler(
      (this._handler = {
        name: this.name,
        priority: 25,
        tools: ["hand"],
        cursor: "grab",
        activeCursor: "grabbing",
        hitTest: (i) => this._pick(i.ray),
        onHover: (i) => {
          const s = i ? i.index : -1;
          if (s >= 0 && s !== this._hoverIndex) {
            this._rustle[s] = Math.max(this._rustle[s], 0.18);
            const o = this.plants[s].height * 0.05;
            ((this._vel[s * 2] += (Math.random() - 0.5) * o),
              (this._vel[s * 2 + 1] += (Math.random() - 0.5) * o),
              (this._dirty = !0));
          }
          this._hoverIndex = s;
        },
        onDown: (i) => {
          const s = i.index;
          return (
            (this._grab = {
              i: s,
              anchor: i.point.clone(),
              lastX: 0,
              lastZ: 0,
              travel: 0,
              emitT: 0,
              t: 0,
            }),
            this._agitate(s, 0.2),
            t.audio?.play?.("whoosh", {
              volume: 0.1,
              pitch: 1.3,
            }),
            !0
          );
        },
        onMove: (i) => this._drag(i),
        onFrame: (i, s) => {
          this._grab && ((this._grab.t += s), (this._grab.emitT -= s));
        },
        onUp: () => this._release(),
      }),
    );
  }
  _pick(t) {
    const e = t.origin,
      i = t.direction;
    let s = -1,
      n = 1 / 0;
    for (let l = 0; l < this.plants.length; l++) {
      const c = this.plants[l],
        h = c.code === PLANT_SPECIES_CODES.pine,
        f =
          c.pickRadius ??
          Math.max(c.radius, c.height * (h ? 0.3 : 0.35)) *
            (isShrubSpecies(c.code) ? 1.1 : 0.95),
        u = h ? c.y + c.height * 0.45 : c.canopyY,
        d = e.x - c.x,
        p = e.y - u,
        v = e.z - c.z,
        g = d * i.x + p * i.y + v * i.z,
        x = d * d + p * p + v * v - f * f,
        m = g * g - x;
      if (m < 0) continue;
      let w = -g - Math.sqrt(m);
      (w < 0 && (w = -g + Math.sqrt(m)), w > 0 && w < n && ((n = w), (s = l)));
    }
    if (s < 0) return null;
    const o = this.ctx.terrain.raycast(t, yv);
    if (o && o.distanceTo(e) < n - 0.15) return null;
    const a = e.clone().addScaledVector(i, n);
    return {
      distance: n,
      index: s,
      point: a,
    };
  }
  _dragAxes() {
    const t = this.ctx.camera;
    ($n.setFromMatrixColumn(t.matrixWorld, 0),
      ($n.y = 0),
      $n.normalize(),
      Zn.set(-$n.z, 0, $n.x),
      Zn.dot(t.getWorldDirection(bR)) < 0 && Zn.negate());
  }
  _drag(t) {
    const e = this._grab;
    if (!e) return;
    const i = this.ctx.input.rayToCameraPlane(e.anchor, yv);
    if (!i) return;
    const s = e.i,
      n = this.plants[s];
    this._dragAxes();
    const o = i.x - e.anchor.x,
      a = i.y - e.anchor.y,
      l = i.z - e.anchor.z,
      c = o * $n.x + l * $n.z,
      h = a + (o * Zn.x + l * Zn.z),
      f = clamp((e.anchor.y - n.y) / n.height, 0.3, 1);
    let u = ($n.x * c + Zn.x * h) / (f * f),
      d = ($n.z * c + Zn.z * h) / (f * f);
    const p = n.height * (isShrubSpecies(n.code) ? 0.45 : 0.55),
      v = Math.hypot(u, d);
    if (v > 1e-5) {
      const x = (p * Math.tanh(v / p)) / v;
      ((u *= x), (d *= x));
    }
    const g = Math.hypot(u - e.lastX, d - e.lastZ);
    ((e.travel += g),
      (e.lastX = u),
      (e.lastZ = d),
      (this._target[s * 2] = u),
      (this._target[s * 2 + 1] = d),
      (this._rustle[s] = Math.min(1.5, this._rustle[s] + (g / n.height) * 0.8)),
      e.emitT <= 0 &&
        g / n.height > 0.06 &&
        ((e.emitT = 0.15),
        this._agitate(s, clamp((g / n.height) * 2.2, 0.1, 0.8))),
      (this._dirty = !0));
  }
  _release() {
    const t = this._grab;
    if (!t) return;
    this._grab = null;
    const e = t.i,
      i = this.plants[e];
    ((this._target[e * 2] = 0), (this._target[e * 2 + 1] = 0));
    const s = Math.hypot(this._bend[e * 2], this._bend[e * 2 + 1]) / i.height;
    let n;
    if (t.travel < i.height * 0.04) {
      this._dragAxes();
      const o = i.height * 2.2;
      ((this._vel[e * 2] += Zn.x * o),
        (this._vel[e * 2 + 1] += Zn.z * o),
        (n = 0.55));
    } else {
      // A quick drag can finish before the spring catches up. Use its requested
      // bend as well, so shedding reflects the gesture rather than frame timing.
      const requested = Math.hypot(t.lastX, t.lastZ) / i.height;
      n = clamp(Math.max(s, requested * 0.65) * 1.8, 0.15, 1.2);
    }
    (this._agitate(e, n),
      this.ctx.audio?.play?.("whoosh", {
        volume: 0.25 * clamp(n + 0.2, 0.3, 1),
      }));
  }
  update(t) {
    if (t <= 0 || this._disposed || !this.ctx.world) return;
    const e = this.plants.length,
      i = this.ctx.world,
      s = i.seasonal,
      n = smoothstep(1.5, 2.1, i.season) * smoothstep(3.2, 2.6, i.season),
      o =
        0.006 +
        i.snowfall * 0.05 +
        (1 - n) * (i.snowCover > 0.05 ? 0.004 : 0.03),
      a = Math.exp(-t * 1.4);
    if (((this._gustTimer -= t), this._gustTimer <= 0)) {
      this._gustTimer = 0.25;
      let u = 0;
      const d = this.ctx.wind;
      for (let p = 0; d && p < e; p++) {
        const v = this.plants[p];
        if (isShrubSpecies(v.code)) continue;
        d.sample(v.x, v.z, vegetationWindSample);
        const g =
          Math.hypot(vegetationWindSample.x, vegetationWindSample.z) +
          d.turbulenceAt(v.x, v.z) * 2;
        if (((this._lastGust[p] -= 0.25), g > 2.2 && this._lastGust[p] <= 0)) {
          const x = clamp((g - 2.2) / 5, 0.05, 0.6);
          ((this._lastGust[p] = 1.6 + Math.random()),
            this._agitate(
              p,
              x,
              u < 6 &&
                (s.fallingLeaves > 0.05 ||
                  s.blossom > 0.2 ||
                  this._keep[p] > 0.4),
            ),
            u++);
        }
      }
    }
    const l = t > 1 / 45 ? 2 : 1,
      c = t / l;
    let h = this._dirty;
    const f = this._shakeData;
    for (let u = 0; u < e; u++) {
      const d = u * 2,
        p = this._omega[u],
        v = this._zeta[u];
      let g = this._bend[d],
        x = this._bend[d + 1],
        m = this._vel[d],
        w = this._vel[d + 1];
      const y = this._target[d],
        _ = this._target[d + 1];
      if (
        Math.abs(g - y) + Math.abs(x - _) + Math.abs(m) + Math.abs(w) >
        1e-5
      ) {
        const A = this._grab && this._grab.i === u ? p * 1.6 : p,
          b = this._grab && this._grab.i === u ? 0.55 : v;
        for (let S = 0; S < l; S++)
          ((m += (-A * A * (g - y) - 2 * b * A * m) * c),
            (w += (-A * A * (x - _) - 2 * b * A * w) * c),
            (g += m * c),
            (x += w * c));
        ((this._bend[d] = g),
          (this._bend[d + 1] = x),
          (this._vel[d] = m),
          (this._vel[d + 1] = w),
          (h = !0));
      }
      (this._rustle[u] > 0.001
        ? ((this._rustle[u] *= a), (h = !0))
        : (this._rustle[u] = 0),
        this._keep[u] < 1 &&
          ((this._keep[u] = Math.min(1, this._keep[u] + o * t)), (h = !0)),
        (f[u * 4] = this._bend[d]),
        (f[u * 4 + 1] = this._bend[d + 1]),
        (f[u * 4 + 2] = this._rustle[u]),
        (f[u * 4 + 3] = this._keep[u]));
    }
    (h && (this.shakeTexture.needsUpdate = !0), (this._dirty = !1));
  }
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._offTrees();
    this._reset();
    this._unregister?.();
    this._offScenario?.();
    this.shakeTexture.dispose();
  }
}

export { TreeInteractionController };
