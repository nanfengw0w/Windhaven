// Owns moored-boat dynamics and the animated rope; life supplies its shared environment.
import { createBoatGeometry } from "./boat-geometry.js";
import {
  ThreeMesh,
  ThreeBufferGeometry,
  ThreeColor,
  ThreeBufferAttribute,
  ThreeDynamicDrawUsage,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { smoothstep, clamp } from "../core/math.js";
import { PROP_MATERIAL_KINDS } from "./geometry.js";
const lifeWindScratch = {
  x: 0,
  z: 0,
};
class MooredBoatSystem {
  constructor(ctx, group, props, material, env) {
    this.ctx = ctx;
    this.group = group;
    this.props = props;
    this.material = material;
    this.env = env;
    const s = createBoatGeometry();
    ((this.boat = new ThreeMesh(s.geometry, this.material)),
      (this.boat.name = "life-boat"),
      (this.boat.castShadow = !0),
      (this.boat.receiveShadow = !0),
      (this.boatInfo = s),
      this.group.add(this.boat),
      (this._boat = {
        yaw: 0,
        yawV: 0,
        roll: 0,
        rollV: 0,
        pitch: 0,
        pitchV: 0,
        heave: 0,
        heaveV: 0,
        ripT: 0,
        x: 0,
        z: 0,
      }),
      this._initRope());
  }
  reset(time) {
    const t = this._boat;
    ((t.yaw =
      t.yawV =
      t.roll =
      t.rollV =
      t.pitch =
      t.pitchV =
      t.heave =
      t.heaveV =
        0),
      this.update(0, time));
  }
  update(t, e) {
    const i = this.env,
      s = this.props,
      n = this._boat,
      o = s.boatHome,
      a = this.ctx.wind.sample(o.x, o.z, lifeWindScratch),
      l = Math.hypot(a.x, a.z),
      c = smoothstep(
        0.35,
        0.75,
        this.ctx.modules.water?.iceAt?.(o.x, o.z) ?? i.ice,
      ),
      h = 1 - c,
      f = s.jettyDir,
      u = a.x * -f.z + a.z * f.x,
      d = a.x * f.x + a.z * f.z;
    if (t > 0) {
      const M = clamp(d * 0.05, -0.18, 0.18) * h;
      ((n.yawV += ((M - n.yaw) * 2 - n.yawV * 1.2) * t), (n.yaw += n.yawV * t));
      const A = clamp(u * 0.035, -0.12, 0.12) * h;
      if (
        ((n.rollV += ((A - n.roll) * 9 - n.rollV * 2.2) * t),
        (n.roll += n.rollV * t),
        (n.pitchV += ((0 - n.pitch) * 9 - n.pitchV * 2.2) * t),
        (n.pitch += n.pitchV * t),
        (n.heaveV += ((0 - n.heave) * 14 - n.heaveV * 3) * t),
        (n.heave += n.heaveV * t),
        (n.ripT -= t),
        n.ripT <= 0 && h > 0.5)
      ) {
        n.ripT = 1.1 + Math.random() * 1.6 - Math.min(0.8, l * 0.25);
        const b = this.ctx.modules.water?.ripples;
        if (b?.add) {
          const S = Math.random() * Math.PI * 2;
          b.add(
            o.x + Math.cos(S) * 0.1,
            o.z + Math.sin(S) * 0.05,
            0.035,
            -(0.35 + l * 0.25 + i.rain),
          );
        }
      }
    }
    const p = 0.4 + Math.min(1.6, l * 0.45) + i.storm * 1.2,
      v =
        (0.0035 * Math.sin(e * 1.7) + 0.0022 * Math.sin(e * 2.9 + 1.3)) * p * h,
      g =
        (0.03 * Math.sin(e * 1.25 + 0.4) + 0.018 * Math.sin(e * 2.3)) * p * h +
        n.roll,
      x =
        (0.016 * Math.sin(e * 1.05 + 2) + 0.01 * Math.sin(e * 2.7 + 0.2)) *
          p *
          h +
        n.pitch,
      m = s.boatYaw + n.yaw + 0.03 * Math.sin(e * 0.21) * h,
      w = 0.012 * Math.max(0, u) * h;
    ((n.x = o.x - f.z * w),
      (n.z = o.z + f.x * w),
      this.boat.position.set(n.x, i.level + v + n.heave - c * 0.004, n.z),
      this.boat.rotation.set(g, m, x, "YXZ"),
      this.boat.updateMatrix(),
      this._updateRope());
  }
  splash(t) {
    if (!t) return;
    const e = this.props.boatHome,
      i = Math.hypot(t.x - e.x, t.z - e.z);
    if (i > 0.9) return;
    const s = (1 - i / 0.9) * (t.strength ?? 0.6),
      n = this._boat;
    ((n.rollV += (Math.random() - 0.5) * 1.6 * s),
      (n.pitchV += (Math.random() - 0.5) * 0.9 * s),
      (n.heaveV -= 0.12 * s));
  }
  _initRope() {
    ((this._ropeSeg = 12), (this._ropeSides = 4));
    const i = 65,
      s = new ThreeBufferGeometry();
    ((this._ropePos = new Float32Array(i * 3)),
      (this._ropeNrm = new Float32Array(i * 3)));
    const n = new Float32Array(i * 3),
      o = new Float32Array(i * 3),
      a = new Float32Array(i * 4),
      l = new Float32Array(i * 4),
      c = new ThreeColor("#b59a6a");
    for (let f = 0; f < i; f++)
      ((n[f * 3] = c.r),
        (n[f * 3 + 1] = c.g),
        (n[f * 3 + 2] = c.b),
        (a[f * 4] = 1.3),
        (a[f * 4 + 1] = PROP_MATERIAL_KINDS.rope),
        (a[f * 4 + 2] = 1),
        (a[f * 4 + 3] = 0.003));
    for (let f = 0; f <= 12; f++)
      for (let u = 0; u <= 4; u++) {
        const d = f * 5 + u,
          p = (u / 4) * Math.PI * 2;
        ((o[d * 3] = f * 0.02),
          (o[d * 3 + 1] = Math.cos(p) * 0.003),
          (o[d * 3 + 2] = Math.sin(p) * 0.003));
      }
    const h = [];
    for (let f = 0; f < 12; f++)
      for (let u = 0; u < 4; u++) {
        const d = f * 5 + u,
          p = d + 4 + 1;
        h.push(d, p, p + 1, d, p + 1, d + 1);
      }
    (s.setAttribute(
      "position",
      new ThreeBufferAttribute(this._ropePos, 3).setUsage(
        ThreeDynamicDrawUsage,
      ),
    ),
      s.setAttribute(
        "normal",
        new ThreeBufferAttribute(this._ropeNrm, 3).setUsage(
          ThreeDynamicDrawUsage,
        ),
      ),
      s.setAttribute("aCol", new ThreeBufferAttribute(n, 3)),
      s.setAttribute("aGrain", new ThreeBufferAttribute(o, 3)),
      s.setAttribute("aInfo", new ThreeBufferAttribute(a, 4)),
      s.setAttribute("aRoof", new ThreeBufferAttribute(l, 4)),
      s.setIndex(h),
      (this.rope = new ThreeMesh(s, this.material)),
      (this.rope.name = "life-rope"),
      (this.rope.frustumCulled = !1),
      (this.rope.receiveShadow = !0),
      this.group.add(this.rope),
      (this._ropeA = new ThreeVector3()),
      (this._ropeB = new ThreeVector3()),
      (this._ropeLen = 0));
  }
  _updateRope() {
    const t = this._ropeA.copy(this.props.boatRopeAnchor),
      e = this._ropeB
        .copy(this.boatInfo.bowLocal)
        .applyMatrix4(this.boat.matrix),
      i = t.distanceTo(e);
    this._ropeLen || (this._ropeLen = i * 1.12);
    const s =
        Math.sqrt(Math.max(0, this._ropeLen * this._ropeLen - i * i)) * 0.5,
      n = this._ropeSeg,
      o = this._ropeSides,
      a = 0.0026,
      l = this._ropePos,
      c = this._ropeNrm;
    let h = 0,
      f = 0,
      u = 0;
    for (let d = 0; d <= n; d++) {
      const p = d / n,
        v = t.x + (e.x - t.x) * p,
        g = t.z + (e.z - t.z) * p,
        x = t.y + (e.y - t.y) * p - s * 4 * p * (1 - p);
      let m, w, y;
      if (d < n) {
        const z = (d + 1) / n;
        ((m = (e.x - t.x) / n),
          (y = (e.z - t.z) / n),
          (w = t.y + (e.y - t.y) * z - s * 4 * z * (1 - z) - x));
      } else ((m = v - h), (w = x - f), (y = g - u));
      ((h = v), (f = x), (u = g));
      const _ = Math.hypot(m, w, y) || 1;
      ((m /= _), (w /= _), (y /= _));
      let M = w * 0 - y * 1,
        A = y * 0 - m * 0,
        b = m * 1 - w * 0;
      const S = Math.hypot(M, A, b) || 1;
      ((M /= S), (A /= S), (b /= S));
      const E = A * y - b * w,
        T = b * m - M * y,
        R = M * w - A * m;
      for (let z = 0; z <= o; z++) {
        const L = (z / o) * Math.PI * 2,
          k = Math.cos(L),
          U = Math.sin(L),
          F = M * k + E * U,
          G = A * k + T * U,
          B = b * k + R * U,
          q = (d * (o + 1) + z) * 3;
        ((l[q] = v + F * a),
          (l[q + 1] = x + G * a),
          (l[q + 2] = g + B * a),
          (c[q] = F),
          (c[q + 1] = G),
          (c[q + 2] = B));
      }
    }
    ((this.rope.geometry.attributes.position.needsUpdate = !0),
      (this.rope.geometry.attributes.normal.needsUpdate = !0));
  }
}
export { MooredBoatSystem };
