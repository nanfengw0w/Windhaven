// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeMesh, ThreeVector3 } from "../vendor/three-runtime.js";
import { CLOUD_LAYER_HEIGHTS, LANDSCAPE_BOUNDS } from "../core/config.js";
import { CLOUD_SHADER_MAX_PUFFS, createCloudMaterial } from "./material.js";
import { createSeededRandom } from "../core/math.js";
const CLOUD_MAX_BODY_PUFFS = 13;
const CLOUD_MAX_STORM_PUFFS = 7;
const CLOUD_CEILING_Y = CLOUD_LAYER_HEIGHTS.ceilingY - 0.06;
const a1 = 0.04;
const clampCloudBody = (r, t, e) => (r < t ? t : r > e ? e : r);
const saturateCloudBody = (r) => (r < 0 ? 0 : r > 1 ? 1 : r);
const smoothstepCloudBody = (r, t, e) => {
  const i = saturateCloudBody((e - r) / (t - r));
  return i * i * (3 - 2 * i);
};
function createCloudPuffLayout(r, { elong: t = 1, count: e = 0 } = {}) {
  const i = [],
    s = (u) => (r() - 0.5) * 2 * u,
    n = (u, d, p, v, g) =>
      i.push({
        x: u + s(0.05),
        y: d + s(0.035),
        z: p + s(0.05),
        r: v * (0.92 + r() * 0.16),
        kind: g,
      });
  n(0, 0.14, 0, 0.6, "core");
  const o = r() < 0.5 ? 1 : -1;
  (n(-0.62 * t * o, 0.02, 0.14, 0.45, "body"),
    n(0.64 * t * o, 0, -0.1, 0.47, "body"),
    n(-0.3, 0.52, 0.06, 0.37, "top"),
    n(0.26, 0.46, -0.1, 0.35, "top"),
    n(0.04, -0.06, 0.4, 0.37, "base"),
    n(-0.06, -0.04, -0.4, 0.36, "base"));
  const a = [
      () => n(0.05, 0.76, 0.02, 0.27, "top"),
      () => n(-1.02 * t * o, -0.08, 0.06, 0.3, "body"),
      () => n(1.04 * t * o, -0.1, -0.04, 0.29, "body"),
      () => n(-0.4, -0.1, -0.3, 0.33, "base"),
      () => n(0.42, -0.12, 0.3, 0.32, "base"),
      () => n(0.62 * t * o, 0.36, 0.1, 0.28, "top"),
    ],
    l = e || 8 + Math.floor(r() * 4);
  for (let u = a.length - 1; u > 0; u--) {
    const d = Math.floor(r() * (u + 1)),
      p = a[u];
    ((a[u] = a[d]), (a[d] = p));
  }
  for (let u = 0; i.length < Math.min(l, 7 + a.length); u++) a[u]();
  const c = r() * Math.PI * 2,
    h = Math.cos(c),
    f = Math.sin(c);
  for (const u of i) {
    const d = u.x * h - u.z * f,
      p = u.x * f + u.z * h;
    ((u.x = d), (u.z = p));
  }
  return i;
}
let nextCloudId = 0;
const cloudPuffPositionScratch = new ThreeVector3();
class CloudBody {
  constructor(t, e) {
    const i = e.seed === undefined ? t.rand : createSeededRandom(e.seed);
    this.rand = i;
    ((this.sys = t),
      (this.id = ++nextCloudId),
      (this.position = new ThreeVector3(e.x, e.y, e.z)),
      (this.velocity = new ThreeVector3()),
      (this.size = e.size),
      (this.water = e.water),
      (this.squeeze = e.squeeze),
      (this.charge = e.charge),
      (this.storm = e.storm),
      (this.grabbed = !1),
      (this.homeY = e.y),
      (this.heldSqueeze = e.squeeze > 0 ? e.squeeze : 0),
      (this.userSqueeze = 0),
      (this.wheelSqueeze = 0),
      (this.comp = e.squeeze * 0.9),
      (this.compVel = 0),
      (this.stormTarget = e.storm),
      (this.fade = e.fadeIn ? 0 : 1),
      (this.dissolving = !1),
      (this.age = 0),
      (this.hover = 0),
      (this.rate = 0),
      (this.glow = 0),
      (this.glowPos = new ThreeVector3()),
      (this.crackleT = 0),
      (this.phase = i() * 100),
      (this.vfit = 1),
      (this.extent = new ThreeVector3(1, 0.6, 1)),
      (this.baseY = this.position.y - 0.3),
      (this.ceilY = CLOUD_CEILING_Y),
      (this.bmin = new ThreeVector3()),
      (this.bmax = new ThreeVector3()),
      (this.puffs = []),
      this.setLayout(
        createCloudPuffLayout(i, {
          elong: 1 + Math.max(0, this.size - 1.1) * 0.25,
        }),
        !0,
      ),
      (this.stormPuffs = []));
    for (let n = 0; n < CLOUD_MAX_STORM_PUFFS; n++)
      this.stormPuffs.push(
        this._newPuff(0, 0, 0, 0, n < 3 ? "tower" : "anvil", !0),
      );
    ((this.material = createCloudMaterial(t.ctx, t.shared, t.matOpts)),
      this.material.uniforms.uSeed.value.set(i() * 17, i() * 17, i() * 17),
      (this.mesh = new ThreeMesh(t.boxGeo, this.material)),
      (this.mesh.renderOrder = 10),
      (this.mesh.name = `cloud-${this.id}`),
      (this.mesh.castShadow = !1),
      (this.mesh.receiveShadow = !1),
      t.group.add(this.mesh));
  }
  _newPuff(t, e, i, s, n, o = !1) {
    const a = this.rand,
      l = Math.hypot(t, i),
      c = o
        ? 26 + a() * 8
        : clampCloudBody(
            88 - l * 26 - Math.max(0, e) * 20 + (a() - 0.5) * 10,
            46,
            96,
          );
    return {
      rest: new ThreeVector3(t, e, i),
      r: s,
      kind: n,
      k: c,
      c: 2 * Math.sqrt(c) * (o ? 0.55 : 0.3 + a() * 0.08),
      pos: this.position
        .clone()
        .add(
          cloudPuffPositionScratch.set(
            t * this.size,
            e * this.vScale,
            i * this.size,
          ),
        ),
      vel: new ThreeVector3(),
      rCur: o ? 0 : s * this.size * (this.fade < 1 ? 0.4 : 1),
      w: o ? 0 : 1,
      ph: a() * Math.PI * 2,
    };
  }
  setLayout(t, e = !1, i = null) {
    const s = i || this.puffs,
      n = [];
    for (const o of t.slice(0, CLOUD_MAX_BODY_PUFFS)) {
      const a = this._newPuff(o.x, o.y, o.z, o.r, o.kind);
      if (!e && s.length) {
        cloudPuffPositionScratch
          .copy(this.position)
          .addScaledVector(a.rest, this.size);
        let l = null,
          c = 1 / 0;
        for (const h of s) {
          const f = h.pos.distanceToSquared(cloudPuffPositionScratch);
          f < c && ((c = f), (l = h));
        }
        l && (a.pos.copy(l.pos), a.vel.copy(l.vel), (a.rCur = l.rCur * 0.9));
      }
      n.push(a);
    }
    ((this.puffs = n), this._measure());
  }
  addPuffAt(t, e, i, s) {
    if (this.puffs.length >= CLOUD_MAX_BODY_PUFFS) return !1;
    const n = Math.max(0.2, this.size),
      o = this._newPuff(
        (t - this.position.x) / n,
        (e - this.position.y) / n,
        (i - this.position.z) / n,
        s / n,
        "body",
      );
    return (
      o.pos.set(t, e, i),
      (o.rCur = s * 0.3),
      this.puffs.push(o),
      this.recenter(),
      !0
    );
  }
  recenter() {
    let t = 0,
      e = 0,
      i = 0;
    for (const s of this.puffs) {
      const n = s.r * s.r;
      ((t += s.rest.x * n), (e += s.rest.z * n), (i += n));
    }
    if (!(i <= 0)) {
      ((t /= i), (e /= i));
      for (const s of this.puffs) ((s.rest.x -= t), (s.rest.z -= e));
      ((this.position.x += t * this.size),
        (this.position.z += e * this.size),
        this._measure());
    }
  }
  _measure() {
    let t = 0.3;
    for (const e of this.puffs) t = Math.max(t, e.rest.y + e.r);
    this.restTop = t;
  }
  get effSqueeze() {
    return Math.max(this.squeeze, this.heldSqueeze);
  }
  get radius() {
    return Math.max(this.extent.x, this.extent.z);
  }
  get vScale() {
    // Merged cells widen faster than they tower: past unit size the vertical
    // envelope grows at half rate, so repeat merges build broad rain clouds
    // instead of rising towers (the old glass lid used to hide this growth).
    return this.size <= 1 ? this.size : 1 + (this.size - 1) * 0.5;
  }
  floorY() {
    // Clouds hold their layer height everywhere: peaks pierce the band instead
    // of pushing clouds up and over (the old terrain-following behaviour was
    // dormant in the small world and read as an unnatural climb after the
    // landscape expansion).
    return CLOUD_LAYER_HEIGHTS.minY - 0.05;
  }
  stepBody(t, e, i) {
    const s =
        this.size *
        (0.55 + 0.45 * smoothstepCloudBody(0, 1, this.fade * 1.4)) *
        (this.dissolving ? 0.7 + 0.3 * this.fade : 1),
      n = this.comp,
      o = this.storm,
      a = 1 - 0.38 * n,
      l = (1 - 0.16 * n) * (1 + 0.32 * o) * this.vfit,
      sv = (s / this.size) * this.vScale,
      c = (1 - 0.2 * n) * (1 + 0.12 * o),
      h = Math.max(0, n) * 0.05 * s,
      f = this.position,
      u = t > 0 ? 1 : 0,
      d = (i.turb || 0) * 14 * s;
    let p = 0,
      v = 0;
    for (let m = 0; m < this.puffs.length; m++) {
      const w = this.puffs[m],
        y =
          Math.sin(e * 0.55 + w.ph) * 0.03 +
          Math.sin(e * 0.23 + w.ph * 1.7) * 0.025,
        _ =
          f.x +
          w.rest.x * s * a +
          Math.sin(e * 0.31 + w.ph) * 0.02 * s +
          Math.sin(e * 13 + w.ph) * h * w.rest.x,
        M =
          f.y +
          w.rest.y * sv * l +
          Math.sin(e * 0.4 + w.ph * 2.1) * 0.025 * s +
          Math.sin(e * 11 + w.ph) * h,
        A =
          f.z +
          w.rest.z * s * a +
          Math.cos(e * 0.27 + w.ph) * 0.02 * s +
          Math.sin(e * 12 + w.ph) * h * w.rest.z,
        b = w.r * s * c * (1 + y);
      if (u) {
        const S = w.c,
          E = 5 * (0.35 + Math.max(0, w.rest.y) * 1.4),
          T = Math.sin(e * 6.1 + w.ph * 3.1) * d,
          R = Math.sin(e * 5.3 + w.ph * 1.9) * d * 0.5,
          z = Math.cos(e * 6.7 + w.ph * 2.3) * d;
        ((w.vel.x += ((_ - w.pos.x) * w.k - w.vel.x * S + i.x * E + T) * t),
          (w.vel.y += ((M - w.pos.y) * w.k - w.vel.y * S + R) * t),
          (w.vel.z += ((A - w.pos.z) * w.k - w.vel.z * S + i.z * E + z) * t),
          w.pos.addScaledVector(w.vel, t),
          (w.rCur += (b - w.rCur) * (1 - Math.exp(-t * 9))),
          this._confine(w));
      } else w.rCur <= 0 && (w.rCur = b);
      ((p = Math.max(p, Math.abs(w.rest.x * s * a) + b)),
        (v = Math.max(v, Math.abs(w.rest.z * s * a) + b)));
    }
    (this.extent.set(p, this.restTop * sv * l, v),
      (this.ceilY = CLOUD_CEILING_Y - 0.08));
    const x = f.y + this.restTop * sv * l;
    for (let m = 0; m < CLOUD_MAX_STORM_PUFFS; m++) {
      const w = this.stormPuffs[m];
      let y, _, M, A, b;
      if (m < 3) {
        const S = (m + 1) / 3.3;
        ((b = saturateCloudBody(o * 2.2 - m * 0.45)),
          (y = f.x + (m === 1 ? -0.1 : 0.08) * s),
          (M = f.z + (m === 2 ? -0.08 : 0.04) * s),
          (_ = f.y + (x + 0.3 * sv * b - f.y) * S * (0.5 + 0.5 * b)),
          (A = (0.64 - m * 0.05) * s * (0.55 + 0.45 * b)));
      } else {
        const S = ((m - 3) / 4) * Math.PI * 2 + 0.6 + this.phase;
        b = saturateCloudBody((o - 0.35) * 2.2);
        const E = s * (0.25 + 0.55 * b);
        ((y = f.x + Math.cos(S) * E + i.x * 0.12 * s * b),
          (M = f.z + Math.sin(S) * E * 0.75 + i.z * 0.12 * s * b),
          (_ = x + 0.15 - (m - 3) * 0.08 + Math.sin(e * 0.5 + m) * 0.03),
          (A = s * (0.4 + 0.12 * b)));
      }
      ((b *= this.fade),
        u
          ? ((w.vel.x += ((y - w.pos.x) * w.k - w.vel.x * w.c) * t),
            (w.vel.y += ((_ - w.pos.y) * w.k - w.vel.y * w.c) * t),
            (w.vel.z += ((M - w.pos.z) * w.k - w.vel.z * w.c) * t),
            w.pos.addScaledVector(w.vel, t),
            (w.w += (b - w.w) * (1 - Math.exp(-t * 1.5))))
          : (w.pos.set(y, _, M), (w.w = b)),
        (w.rCur = A * w.w),
        w.rCur > 0.01 && this._confine(w));
    }
  }
  _confine(t) {
    const e = Math.min(t.rCur, 1.6),
      i = LANDSCAPE_BOUNDS.halfW - a1 - e * 0.8,
      s = LANDSCAPE_BOUNDS.halfD - a1 - e * 0.8,
      n = CLOUD_CEILING_Y - e * 0.55;
    (t.pos.x > i
      ? ((t.pos.x = i), t.vel.x > 0 && (t.vel.x *= -0.3))
      : t.pos.x < -i && ((t.pos.x = -i), t.vel.x < 0 && (t.vel.x *= -0.3)),
      t.pos.z > s
        ? ((t.pos.z = s), t.vel.z > 0 && (t.vel.z *= -0.3))
        : t.pos.z < -s && ((t.pos.z = -s), t.vel.z < 0 && (t.vel.z *= -0.3)),
      t.pos.y > n && ((t.pos.y = n), t.vel.y > 0 && (t.vel.y *= -0.3)));
  }
  syncRender() {
    const t = this.material.uniforms,
      e = t.uPuffs.value;
    let i = 0,
      s = 1 / 0,
      n = 1 / 0,
      o = 1 / 0,
      a = -1 / 0,
      l = -1 / 0,
      c = -1 / 0,
      h = 1 / 0,
      f = -1 / 0;
    const u = Math.max(0.05, this.size),
      d = 0.06 + 0.26 * Math.min(u, 2.2),
      p = d * 1.08,
      v = this.puffs.length + this.stormPuffs.length;
    for (let y = 0; y < v && i < CLOUD_SHADER_MAX_PUFFS; y++) {
      const _ =
        y < this.puffs.length
          ? this.puffs[y]
          : this.stormPuffs[y - this.puffs.length];
      if (_.rCur < 0.01) continue;
      e[i++].set(_.pos.x, _.pos.y, _.pos.z, _.rCur);
      const M = _.rCur + p;
      (_.pos.x - M < s && (s = _.pos.x - M),
        _.pos.y - M < n && (n = _.pos.y - M),
        _.pos.z - M < o && (o = _.pos.z - M),
        _.pos.x + M > a && (a = _.pos.x + M),
        _.pos.y + M > l && (l = _.pos.y + M),
        _.pos.z + M > c && (c = _.pos.z + M),
        y < this.puffs.length && (h = Math.min(h, _.pos.y - _.rCur * 0.1)),
        _.pos.y + _.rCur > f && (f = _.pos.y + _.rCur));
    }
    if (
      ((t.uPuffCount.value = i),
      (this.mesh.visible = i > 0 && this.fade > 0.002),
      !i)
    )
      return;
    ((this.baseY = h - 0.06 * u * (1 - 0.3 * this.comp)),
      (s = Math.max(s, -LANDSCAPE_BOUNDS.halfW + 0.01)),
      (a = Math.min(a, LANDSCAPE_BOUNDS.halfW - 0.01)),
      (o = Math.max(o, -LANDSCAPE_BOUNDS.halfD + 0.01)),
      (c = Math.min(c, LANDSCAPE_BOUNDS.halfD - 0.01)),
      (l = Math.min(l, CLOUD_LAYER_HEIGHTS.ceilingY - 0.01)),
      (n = Math.max(n, this.baseY - d * 1.5)),
      this.bmin.set(s, n, o),
      this.bmax.set(a, l, c),
      t.uBoxMin.value.copy(this.bmin),
      t.uBoxMax.value.copy(this.bmax),
      this.mesh.position.set((s + a) * 0.5, (n + l) * 0.5, (o + c) * 0.5),
      this.mesh.scale.set(
        Math.max(0.01, a - s),
        Math.max(0.01, l - n),
        Math.max(0.01, c - o),
      ),
      this.mesh.updateMatrixWorld(),
      t.uCenter.value.copy(this.position),
      t.uShape.value.set(this.baseY, this.ceilY, d, 0.2 + 0.2 * u));
    const g = this.water,
      x = Math.max(0, this.comp),
      m = saturateCloudBody(
        smoothstepCloudBody(0.35, 1.35, g) * 0.55 +
          x * 0.6 +
          this.storm * 0.35 +
          this.rate * 0.1,
      ),
      w =
        (0.85 + (0.35 * Math.min(g, 1.2)) / 1.2 + 0.7 * x + this.storm * 0.55) *
        (this.dissolving ? 0.5 + 0.5 * this.fade : 1);
    (t.uLook.value.set(m, this.storm, w, this.hover),
      t.uLook2.value.set(
        saturateCloudBody(this.fade),
        saturateCloudBody(this.rate * 0.6 + m * 0.25),
        u,
        Math.min(f, this.ceilY),
      ),
      t.uGlow.value.set(
        this.glowPos.x,
        this.glowPos.y,
        this.glowPos.z,
        this.glow,
      ));
  }
  raycast(t) {
    let e = 1 / 0;
    const i = t.origin,
      s = t.direction,
      n = this.puffs.length + this.stormPuffs.length;
    for (let o = 0; o < n; o++) {
      const a =
          o < this.puffs.length
            ? this.puffs[o]
            : this.stormPuffs[o - this.puffs.length],
        l = a.rCur * 1.05;
      if (l < 0.05) continue;
      const c = a.pos.x - i.x,
        h = a.pos.y - i.y,
        f = a.pos.z - i.z,
        u = c * s.x + h * s.y + f * s.z,
        d = c * c + h * h + f * f - u * u;
      if (d > l * l) continue;
      const p = Math.sqrt(l * l - d),
        v = u - p > 0 ? u - p : u + p;
      v > 0 && v < e && (e = v);
    }
    return e;
  }
  dispose() {
    (this.mesh.removeFromParent(), this.material.dispose());
  }
}
export {
  CLOUD_CEILING_Y,
  CLOUD_MAX_BODY_PUFFS,
  CloudBody,
  createCloudPuffLayout,
};
