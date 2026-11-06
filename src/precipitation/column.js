// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  CLOUD_VISUAL_HEIGHT_OFFSET,
  TEMPERATURE_CONFIG,
  LANDSCAPE_BOUNDS,
} from "../core/config.js";
import { clamp, damp, smoothstep } from "../core/math.js";
import { LANDSCAPE_AREA_SCALE } from "../core/weather-extent.js";
const PRECIPITATION_SLOT_COUNT = Math.ceil(8 * LANDSCAPE_AREA_SCALE);
const SNOW_FALL_SPEED = 0.95;
const RAIN_FALL_SPEED = 6.4;
const To = 1.2;
const ec = 3;
const f1 = 64;
const H0 = [0.6, 2];
const d1 = 3.4;
const PRECIPITATION_EDGE_GLSL = `
// World-space distance to the expanded landscape's four edges.
vec2 precipEdgeDistance(vec2 xz) {
  return min(xz - uFieldMin, uFieldMin + uFieldSize - xz);
}
`;
const PRECIPITATION_FALL_GLSL = `
${PRECIPITATION_EDGE_GLSL}
// col = (yTop, y1, y2, yBot), prof = (vs, vr, tA, tB). Returns distance fallen after tau seconds.
float precipFallDist(float tau, vec4 col, vec4 prof, out float v) {
  float dA = col.x - col.y;
  float h = col.y - col.z;
  if (tau < prof.z) { v = prof.x; return prof.x * tau; }
  float t2 = tau - prof.z;
  if (t2 < prof.w) {
    float k = (prof.y - prof.x) / max(h, 1e-4);
    float e = exp(k * t2);
    v = prof.x * e;
    return dA + prof.x / k * (e - 1.0);
  }
  v = prof.y;
  return dA + h + prof.y * (t2 - prof.w);
}
// Seconds needed to fall a distance d below the cloud base.
float precipFallTime(float d, vec4 col, vec4 prof) {
  float dA = col.x - col.y;
  float h = col.y - col.z;
  if (d < dA) return d / prof.x;
  float s = d - dA;
  if (s < h) { float k = (prof.y - prof.x) / max(h, 1e-4); return prof.z + log(1.0 + k * s / prof.x) / k; }
  return prof.z + prof.w + (s - h) / prof.y;
}
// Horizontal wind drift distance factor after t seconds of falling (saturating).
float precipDrift(float t) { return ${ec.toFixed(1)} * (1.0 - exp(-t / ${ec.toFixed(1)})); }
// Surface temperature stays in true world coordinates (also used by splashes).
float precipSnowAt(float y) { return 1.0 - smoothstep(${(-To).toFixed(2)}, ${To.toFixed(2)}, temperatureAt(y)); }
// Only airborne precipitation maps the display lift back to climate altitude.
// climate = (scale, bias); the column's ground altitude remains a fixed point.
float precipClimateHeight(float y, vec2 climate) { return y * climate.x + climate.y; }
float precipAirSnowAt(float y, vec2 climate) { return precipSnowAt(precipClimateHeight(y, climate)); }
// A frozen layer only a few decimetres thick under the cloud base is a melting layer: it reads
// as rain from the base (summer storms), not as a clump of flakes. Mirrors PrecipSlot.snowVis.
float precipSnowVis(vec4 col, vec2 climate) {
  float top = precipClimateHeight(col.x, climate);
  float melt = clamp((uSeaTemp - ${To.toFixed(2)}) / max(uLapse, 1e-4), col.w, top);
  return smoothstep(${H0[0].toFixed(2)}, ${H0[1].toFixed(2)}, top - melt);
}
// Gaussian-ish radial offset inside a source disk of radius r from two uniform randoms.
vec2 precipDisk(vec2 rnd, float r) {
  float rr = r * min(1.2, 0.47 * sqrt(-2.0 * log(1.0 - 0.985 * rnd.x)));
  float a = rnd.y * 6.2831853;
  return vec2(cos(a), sin(a)) * rr;
}
// Where a falling particle stops: ground, lake surface, or roughly the river surface.
float precipFloorAt(vec2 xz) {
  vec4 ter = terrainAt(xz);
  float f = ter.x + ter.y * 0.07;
  return ter.z > 0.5 ? max(f, uWaterLevel) : f;
}
`;
const p1 = 8;
function precipitationSurfaceHeight(r, t, e, i) {
  ((e = clamp(e, -LANDSCAPE_BOUNDS.halfW, LANDSCAPE_BOUNDS.halfW)),
    (i = clamp(i, -LANDSCAPE_BOUNDS.halfD, LANDSCAPE_BOUNDS.halfD)));
  const s = r.height(e, i);
  return r.lakeMask(e, i) > 0.5 ? Math.max(s, t) : s;
}
class PrecipitationColumn {
  constructor(t) {
    ((this.index = t),
      (this.live = !1),
      (this.visible = !1),
      (this.claimed = !1),
      (this.cloudId = null),
      (this.cloud = null),
      (this.x = 0),
      (this.y = 5),
      (this.z = 0),
      (this.radius = 1),
      (this.rate = 0),
      (this.srcRate = 0),
      (this.vx = 0),
      (this.vz = 0),
      (this.storm = 0),
      (this.clock = 0),
      (this.tStart = 0),
      (this.tStop = 1 / 0),
      (this.phase = Math.random() * f1),
      (this.seed = (t * 0.618034) % 1),
      (this.yBot = 0),
      (this.y1 = 0),
      (this.y2 = 0),
      (this.vs = SNOW_FALL_SPEED),
      (this.vr = RAIN_FALL_SPEED),
      (this.tA = 0),
      (this.tB = 0),
      (this.total = 1),
      (this.lo = 0),
      (this.hi = 0),
      (this.groundY = 0),
      (this.snowTop = 0),
      (this.snowGround = 0),
      (this.snowVis = 1),
      (this.climateScale = 1),
      (this.climateBias = 0),
      (this.arrival = 0),
      (this.count = 0),
      (this._fresh = !0));
  }
  begin(t, e, i) {
    ((this.live = !0),
      (this.visible = !0),
      (this.cloudId = t.cloudId ?? null),
      (this.cloud = e),
      (this.x = t.x),
      (this.y = t.y),
      (this.z = t.z),
      (this.radius = t.radius),
      (this.rate = i ? t.rate : t.rate * 0.5),
      (this.vx = 0),
      (this.vz = 0),
      (this.clock = 0),
      (this.tStart = i ? -1e4 : 0),
      (this.tStop = 1 / 0),
      (this.count = i ? -1 : 0),
      (this._fresh = !0));
  }
  feed(t, e, i) {
    if (
      (this.live || ((this.live = !0), (this.tStop = 1 / 0)),
      (this.cloud = e),
      i > 0)
    ) {
      const s = (t.x - this.x) / i,
        n = (t.z - this.z) / i,
        o = Math.abs(s) < 25 && Math.abs(n) < 25;
      ((this.vx = damp(this.vx, o ? s : 0, 5, i)),
        (this.vz = damp(this.vz, o ? n : 0, 5, i)));
    }
    ((this.x = t.x),
      (this.y = t.y),
      (this.z = t.z),
      (this.radius = t.radius),
      (this.srcRate = t.rate));
  }
  stop() {
    this.live &&
      ((this.live = !1), (this.tStop = this.clock), (this.srcRate = 0));
  }
  static temp(t, e) {
    return t.seaLevelTemp - TEMPERATURE_CONFIG.lapse * Math.max(0, e);
  }
  climateHeight(y) {
    return y * this.climateScale + this.climateBias;
  }
  update(t, e, i) {
    const { world: s, terrain: n } = e;
    ((this.clock += t),
      this.live
        ? (this.rate = damp(this.rate, this.srcRate, 2.5, t))
        : ((this.vx = damp(this.vx, 0, 1.5, t)),
          (this.vz = damp(this.vz, 0, 1.5, t))),
      (this.x = clamp(
        this.x,
        -LANDSCAPE_BOUNDS.halfW + 0.3,
        LANDSCAPE_BOUNDS.halfW - 0.3,
      )),
      (this.z = clamp(
        this.z,
        -LANDSCAPE_BOUNDS.halfD + 0.3,
        LANDSCAPE_BOUNDS.halfD - 0.3,
      )));
    const o = Math.min(this.y, LANDSCAPE_BOUNDS.topY - 0.2);
    this.y = o;
    const a =
        RAIN_FALL_SPEED +
        (SNOW_FALL_SPEED * 2.5 - RAIN_FALL_SPEED) * this.snowTop,
      l = Math.max(0.2, (o - this.groundY) / a);
    e.wind.sample(this.x, this.z, i);
    const c = ec * (1 - Math.exp(-l / ec)),
      h = this.x + i.x * c * 0.6 - this.vx * Math.min(l, 1.2) * 0.5,
      f = this.z + i.z * c * 0.6 - this.vz * Math.min(l, 1.2) * 0.5,
      u = s.lakeLevel;
    let d = precipitationSurfaceHeight(n, u, h, f);
    this.groundY = d;
    const p = this.radius * 1.05 + Math.hypot(i.x, i.z) * c * 0.5;
    for (let E = 0; E < p1; E++) {
      const T = (E / p1) * Math.PI * 2 + this.index;
      ((d = Math.min(
        d,
        precipitationSurfaceHeight(
          n,
          u,
          h + Math.cos(T) * p,
          f + Math.sin(T) * p,
        ),
      )),
        (d = Math.min(
          d,
          precipitationSurfaceHeight(
            n,
            u,
            this.x + Math.cos(T) * this.radius * 0.6,
            this.z + Math.sin(T) * this.radius * 0.6,
          ),
        )));
    }
    const v = Math.max(LANDSCAPE_BOUNDS.bottomY, Math.min(d - 0.3, o - 0.6));
    ((this.yBot = this._fresh ? v : Math.min(v, damp(this.yBot, v, 1.5, t))),
      (this._fresh = !1));
    const g = s.seaLevelTemp,
      x = TEMPERATURE_CONFIG.lapse,
      m = this.yBot;
    // Stretch the original climate column into the extra display space while
    // fixing ground temperature. A cloud almost touching a mountain keeps a
    // positive climate span instead of inverting its height/temperature order.
    const span = Math.max(0.001, o - this.groundY);
    const offset = Math.min(
      CLOUD_VISUAL_HEIGHT_OFFSET,
      Math.max(0, span - 0.2),
    );
    this.climateScale = (span - offset) / span;
    this.climateBias = this.groundY * (1 - this.climateScale);
    const climateTop = this.climateHeight(o);
    const climateMelt = clamp((g - To) / x, m, climateTop);
    ((this.y1 = clamp(
      ((g + To) / x - this.climateBias) / this.climateScale,
      m,
      o,
    )),
      (this.y2 = clamp(
        ((g - To) / x - this.climateBias) / this.climateScale,
        m,
        this.y1,
      )),
      (this.snowVis = smoothstep(H0[0], H0[1], climateTop - climateMelt)),
      (this.vs = d1 + (SNOW_FALL_SPEED - d1) * this.snowVis));
    const w = this.vs,
      y = this.vr;
    this.tA = (o - this.y1) / w;
    const _ = this.y1 - this.y2;
    this.tB = _ > 1e-4 ? (_ * Math.log(y / w)) / (y - w) : 0;
    const M = (this.y2 - m) / y;
    ((this.total = Math.max(0.05, this.tA + this.tB + M)),
      t > 0 && (this.phase = (this.phase + t / this.total) % f1),
      (this.snowTop =
        smoothstep(To, -To, PrecipitationColumn.temp(s, climateTop - 0.3)) *
        this.snowVis),
      (this.snowGround = smoothstep(
        To,
        -To,
        PrecipitationColumn.temp(s, this.groundY),
      )),
      (this.lo = this.live ? 0 : this.clock - this.tStop),
      (this.hi = Math.min(1e4, this.clock - this.tStart)));
    const A = this.fallTime(Math.max(0, o - this.groundY)),
      b = smoothstep(A * 0.85, A * 1.05, this.hi),
      S = smoothstep(A * 0.9, A * 1.1, this.lo);
    ((this.arrival = b * (1 - S)),
      !this.live &&
        this.lo > this.total / 0.8 + 0.3 &&
        ((this.visible = !1),
        (this.cloudId = null),
        (this.cloud = null),
        (this.rate = 0),
        (this.count = 0)));
  }
  fallDist(t) {
    const e = this.y - this.y1,
      i = this.y1 - this.y2;
    if (t < this.tA) return this.vs * t;
    const s = t - this.tA;
    if (s < this.tB) {
      const n = (this.vr - this.vs) / Math.max(i, 1e-4);
      return e + (this.vs / n) * (Math.exp(n * s) - 1);
    }
    return e + i + this.vr * (s - this.tB);
  }
  fallTime(t) {
    const e = this.y - this.y1,
      i = this.y1 - this.y2;
    if (t < e) return t / this.vs;
    const s = t - e;
    if (s < i) {
      const n = (this.vr - this.vs) / Math.max(i, 1e-4);
      return this.tA + Math.log(1 + (n * s) / this.vs) / n;
    }
    return this.tA + this.tB + (s - i) / this.vr;
  }
  writeCol(t) {
    return t.set(this.y, this.y1, this.y2, this.yBot);
  }
  writeProf(t) {
    return t.set(this.vs, this.vr, this.tA, this.tB);
  }
  writeClimate(t) {
    return t.set(this.climateScale, this.climateBias, 0, 0);
  }
}
export {
  PRECIPITATION_EDGE_GLSL,
  PRECIPITATION_FALL_GLSL,
  PRECIPITATION_SLOT_COUNT,
  PrecipitationColumn,
  RAIN_FALL_SPEED,
  ec,
};
