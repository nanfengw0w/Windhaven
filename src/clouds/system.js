// Cloud lifecycle and frame orchestration. Helpers share this system's state.
import {
  ThreeBoxGeometry,
  ThreeColor,
  ThreeGroup,
  ThreeMatrix4,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import {
  CLOUD_LAYER_HEIGHTS,
  FIELD_BOUNDS,
  LANDSCAPE_BOUNDS,
} from "../core/config.js";
import { createSeededRandom } from "../core/math.js";
import { LANDSCAPE_AREA_SCALE } from "../core/weather-extent.js";
import { createCloudNoiseTexture } from "./noise.js";
import { CloudBody } from "./body.js";
import {
  clampCloudSystem,
  saturateCloudSystem,
  smoothstepCloudSystem,
  dampCloudSystem,
} from "./math.js";
import {
  advanceCloudMotion,
  bumpCloud,
  resolveCloudInteractions,
  mergeClouds,
} from "./motion-and-merging.js";
import { advanceCloudWaterCycle } from "./water-cycle.js";
import { strikeCloudLightning, advanceCloudCharge } from "./electrics.js";
import {
  sortCloudRendering,
  initializeCloudShadows,
  syncCloudShadows,
} from "./render-sync.js";
import {
  registerCloudInput,
  cloudPointerPlanePoint,
  beginCloudGrab,
  updateCloudGrab,
  endCloudGrab,
  beginCloudCondensation,
  updateCloudCondensation,
} from "./input.js";
const CLOUD_CAP = Math.ceil(10 * LANDSCAPE_AREA_SCALE);
class CloudSystem {
  constructor(t) {
    ((this.ctx = t), (this.list = []), (this.rand = createSeededRandom(49421)));
    const e = t.quality;
    ((this.shared = {
      uNoise: {
        value: createCloudNoiseTexture(e.pick(48, 64, 64)),
      },
    }),
      (this.matOpts = {
        steps: e.pick(26, 38, 48),
        lightSteps: e.pick(4, 5, 6),
      }),
      (this.boxGeo = new ThreeBoxGeometry(1, 1, 1)),
      (this.group = new ThreeGroup()),
      (this.group.name = "clouds"),
      t.scene.add(this.group),
      (this.grab = null),
      (this.condense = null),
      (this.hovered = null),
      (this.time = 0),
      (this._w = {
        x: 0,
        z: 0,
      }),
      (this._w2 = {
        x: 0,
        z: 0,
      }),
      (this._rel = {
        x: 0,
        z: 0,
        turb: 0,
      }),
      (this._p = new ThreeVector3()),
      (this._q = new ThreeVector3()),
      (this._anchor = new ThreeVector3()),
      (this._m = new ThreeMatrix4()),
      (this._col = new ThreeColor()),
      (this._hitT = 1 / 0),
      (this._report = {
        cover: 0,
        storm: 0,
      }),
      this._initShadows(),
      this._initInput());
  }
  spawn({
    x: t = 0,
    z: e = 0,
    y: i = CLOUD_LAYER_HEIGHTS.defaultY,
    size: s = 1,
    water: n = 0.5,
    squeeze: o = 0,
    charge: a = 0,
    storm: l = 0,
    fadeIn: c = !1,
    seed,
  } = {}) {
    this._enforceCap(1);
    const h = new CloudBody(this, {
      x: clampCloudSystem(
        t,
        -LANDSCAPE_BOUNDS.halfW + 0.8,
        LANDSCAPE_BOUNDS.halfW - 0.8,
      ),
      z: clampCloudSystem(
        e,
        -LANDSCAPE_BOUNDS.halfD + 0.8,
        LANDSCAPE_BOUNDS.halfD - 0.8,
      ),
      y: clampCloudSystem(
        i,
        CLOUD_LAYER_HEIGHTS.minY,
        CLOUD_LAYER_HEIGHTS.maxY,
      ),
      size: clampCloudSystem(s, 0.1, 2.4),
      water: clampCloudSystem(n, 0, 1.5),
      squeeze: clampCloudSystem(o, 0, 1),
      charge: clampCloudSystem(a, 0, 1),
      storm: clampCloudSystem(l, 0, 1),
      fadeIn: c,
      seed,
    });
    return (
      this.list.push(h),
      h.stepBody(0, this.time, this._rel),
      h.syncRender(),
      this.ctx.events.emit("cloud:spawn", {
        cloud: h,
      }),
      h
    );
  }
  clear() {
    for (const t of this.list) t.dispose();
    ((this.list.length = 0),
      (this.grab = null),
      (this.condense = null),
      (this.hovered = null));
  }
  pick(t) {
    let e = null,
      i = 1 / 0;
    for (const s of this.list) {
      if (s.dissolving || s.fade < 0.2) continue;
      const n = s.raycast(t);
      n < i && ((i = n), (e = s));
    }
    return ((this._hitT = i), e);
  }
  strike(t = null, e = 1) {
    return strikeCloudLightning(this, t, e);
  }
  update(t, e) {
    this.time = e;
    const { ctx: i } = this,
      { world: s, wind: n } = i,
      o = this.list;
    if (t > 0) {
      // Resolve merges before moving clouds; water loss precedes charging.
      this._interactions(t);
      for (let h = o.length - 1; h >= 0; h--) {
        const f = o[h];
        (this._physics(f, t, e),
          this._waterCycle(f, t, s),
          this._electrics(f, t),
          f.dissolving && f.fade <= 0 && this._remove(f));
      }
    }
    let a = 0,
      l = 0;
    // Body shapes feed rain sources, coverage, render ordering and shadows.
    for (const h of o) {
      const f = n.sample(h.position.x, h.position.z, this._w, 1);
      if (
        ((this._rel.x = clampCloudSystem(f.x - h.velocity.x, -4, 4)),
        (this._rel.z = clampCloudSystem(f.z - h.velocity.z, -4, 4)),
        (this._rel.turb = n.turbulenceAt(h.position.x, h.position.z)),
        h.stepBody(t, e, this._rel),
        (h.hover = dampCloudSystem(
          h.hover,
          (this.hovered === h ? 0.65 : 0) + (h.grabbed ? 0.45 : 0),
          8,
          t || 1,
        )),
        h.syncRender(),
        h.rate > 0.02)
      ) {
        const u =
          h.src ||
          (h.src = {
            x: 0,
            y: 0,
            z: 0,
            radius: 1,
            rate: 0,
            cloudId: h.id,
          });
        ((u.x = h.position.x),
          (u.y = h.baseY),
          (u.z = h.position.z),
          (u.radius = h.radius * 0.72),
          (u.rate = h.rate),
          i.precip.sources.push(u));
      }
      ((a +=
        Math.PI *
        h.extent.x *
        h.extent.z *
        (0.55 + 0.45 * Math.min(1, h.water)) *
        h.fade),
        (l = Math.max(
          l,
          h.storm * smoothstepCloudSystem(0.25, 0.8, h.water) * h.fade,
        )));
    }
    const c = this._report;
    ((c.cover = saturateCloudSystem(
      (a / (FIELD_BOUNDS.sizeX * FIELD_BOUNDS.sizeZ)) * 1.5,
    )),
      (c.storm = saturateCloudSystem(
        l * 0.92 + Math.min(0.08, (o.length / LANDSCAPE_AREA_SCALE) * 0.004),
      )),
      s.reportClouds(c),
      this._sortAndSide(),
      this._syncShadows());
  }
  _physics(t, e, i) {
    return advanceCloudMotion(this, t, e, i);
  }
  _bump(t, e) {
    return bumpCloud(this, t, e);
  }
  _interactions(t) {
    return resolveCloudInteractions(this, t);
  }
  _merge(t, e) {
    return mergeClouds(this, t, e);
  }
  _remove(t) {
    const e = this.list.indexOf(t);
    (e >= 0 && this.list.splice(e, 1),
      this.grab?.cloud === t && (this.grab = null),
      this.condense?.cloud === t && (this.condense = null),
      this.hovered === t && (this.hovered = null),
      t.dispose());
  }
  _enforceCap(t) {
    let e = 0;
    for (const i of this.list) i.dissolving || e++;
    for (; e + t > CLOUD_CAP;) {
      const i = this.list.find(
        (s) => !s.dissolving && !s.grabbed && this.condense?.cloud !== s,
      );
      if (!i) break;
      ((i.dissolving = !0), e--);
    }
  }
  _waterCycle(t, e, i) {
    return advanceCloudWaterCycle(this, t, e, i);
  }
  _electrics(t, e) {
    return advanceCloudCharge(this, t, e);
  }
  _sortAndSide() {
    return sortCloudRendering(this);
  }
  beforeRender() {
    if (this.ctx.photo?.active && !this.ctx.photo.timeRunning)
      this._sortAndSide();
  }
  _initShadows() {
    return initializeCloudShadows(this);
  }
  _syncShadows() {
    return syncCloudShadows(this);
  }
  _initInput() {
    return registerCloudInput(this);
  }
  _planePoint(t, e, i) {
    return cloudPointerPlanePoint(this, t, e, i);
  }
  _grabStart(t, e) {
    return beginCloudGrab(this, t, e);
  }
  _grabFrame(t, e) {
    return updateCloudGrab(this, t, e);
  }
  _grabEnd() {
    return endCloudGrab(this);
  }
  _condenseStart(t) {
    return beginCloudCondensation(this, t);
  }
  _condenseFrame(t, e) {
    return updateCloudCondensation(this, t, e);
  }
}
export { CloudSystem };
