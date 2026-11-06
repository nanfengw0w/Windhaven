// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeVector3 } from "../vendor/three-runtime.js";
import { CELESTIAL_ORBIT, rotateCelestialDirection } from "../core/config.js";
const SKY_FULL_TURN = Math.PI * 2;
const SKY_SEASONAL_ORBIT_TILTS = [0.55, 0.3, 0.62, 0.92];
const skyOrbitCenter = new ThreeVector3(...CELESTIAL_ORBIT.center);
function interpolateOrbitSeason(r, t) {
  const e = Math.floor(t) & 3,
    i = t - Math.floor(t),
    s = i * i * (3 - 2 * i);
  return r[e] + (r[(e + 1) & 3] - r[e]) * s;
}
function signedTimeOfDayDelta(r) {
  return ((r = ((r % 1) + 1) % 1), r >= 0.5 ? r - 1 : r);
}
const ir = new ThreeVector3();
const Rv = new ThreeVector3();
const zv = new ThreeVector3();
class CelestialOrbit {
  constructor(t) {
    ((this.world = t),
      (this.tilt = interpolateOrbitSeason(SKY_SEASONAL_ORBIT_TILTS, t.season)),
      (this.fitted = !1),
      (this.offset = new ThreeVector3()));
  }
  sunDir(t, e = zv, i = this.tilt) {
    const s = (t - 0.25) * SKY_FULL_TURN,
      n = Math.sin(s);
    return rotateCelestialDirection(
      e
        .set(Math.cos(s) * 0.96, n * Math.cos(i), n * Math.sin(i) + 0.18)
        .normalize(),
    );
  }
  _sunDirRaw(t, e, i = this.tilt) {
    const s = (t - 0.25) * SKY_FULL_TURN,
      n = Math.sin(s);
    return e
      .set(Math.cos(s) * 0.96, n * Math.cos(i), n * Math.sin(i) + 0.18)
      .normalize();
  }
  moonDir(t, e = zv) {
    const i = this._sunDirRaw(t, e);
    return rotateCelestialDirection(
      e.set(-i.x * 0.9, -i.y, -i.z * 0.4 + 0.35).normalize(),
    );
  }
  position(t, e, i = new ThreeVector3()) {
    const s = t === "moon" ? this.moonDir(e, Rv) : this.sunDir(e, Rv);
    return i
      .copy(skyOrbitCenter)
      .addScaledVector(s, CELESTIAL_ORBIT.radius)
      .add(this.offset);
  }
  sync() {
    const t = this.world,
      e = interpolateOrbitSeason(SKY_SEASONAL_ORBIT_TILTS, t.season),
      i = (s) => this.sunDir(t.timeOfDay, ir, s).distanceToSquared(t.sunDir);
    if (!this.fitted && i(e) < 1e-6) this.tilt = e;
    else if (i(this.tilt) > 1e-6) {
      let s = 0,
        n = 1.5;
      const o = 0.6180339887;
      let a = n - o * (n - s),
        l = s + o * (n - s);
      for (let c = 0; c < 28; c++)
        (i(a) < i(l) ? (n = l) : (s = a),
          (a = n - o * (n - s)),
          (l = s + o * (n - s)));
      ((this.tilt = (s + n) * 0.5), (this.fitted = !0));
    }
    (this.position("sun", t.timeOfDay, ir).sub(this.offset),
      this.offset.copy(t.sunPosition).sub(ir),
      this.offset.lengthSq() < 1e-8 && this.offset.set(0, 0, 0));
  }
  solve(t, e, i, s) {
    const n = i.aspect || 1,
      o = 96;
    let a = s,
      l = 1 / 0;
    const c = (u) => {
      if ((this.position(t, u, ir).project(i), ir.z > 1)) return 1 / 0;
      const d = (ir.x - e.x) * n,
        p = ir.y - e.y;
      return (
        Math.sqrt(d * d + p * p) + 0.22 * Math.abs(signedTimeOfDayDelta(u - s))
      );
    };
    for (let u = 0; u < o; u++) {
      const d = u / o,
        p = c(d);
      p < l && ((l = p), (a = d));
    }
    let h = a - 1 / o,
      f = a + 1 / o;
    for (let u = 0; u < 18; u++) {
      const d = h + (f - h) / 3,
        p = f - (f - h) / 3;
      c(d) < c(p) ? (f = p) : (h = d);
    }
    return ((((h + f) * 0.5) % 1) + 1) % 1;
  }
}
export { CelestialOrbit, signedTimeOfDayDelta };
