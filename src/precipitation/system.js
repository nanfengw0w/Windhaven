// Reconstructed module: identifiers and file boundaries are refactor choices.
// Precipitation: assigns cloud rain sources to shared columns, then drives the
// rain/snow particles, curtains, splashes, hail and the lightning bolt pool.
import {
  ThreeMathUtils,
  ThreeVector2,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { CLOUD_LAYER_HEIGHTS, LANDSCAPE_BOUNDS } from "../core/config.js";
import { LANDSCAPE_AREA_SCALE } from "../core/weather-extent.js";
import { PRECIPITATION_SLOT_COUNT, PrecipitationColumn } from "./column.js";
import { FallingPrecipitation } from "./fall.js";
import { RainCurtains } from "./curtains.js";
import { RainSplashes } from "./splashes.js";
import { HailParticles } from "./hail.js";
import { LightningSystem } from "./lightning.js";
const eP = 0.35;
class PrecipitationSystem {
  constructor(t) {
    ((this.ctx = t), (this.slots = []));
    for (let e = 0; e < PRECIPITATION_SLOT_COUNT; e++)
      this.slots.push(new PrecipitationColumn(e));
    ((this.rainAmount = 0),
      (this.snowAmount = 0),
      (this.hailAmount = 0),
      (this._wind = {
        x: 0,
        z: 0,
      }),
      (this._px = new ThreeVector2()),
      (this._prefill = 0.6),
      (this.fall = new FallingPrecipitation(t, this.slots)),
      (this.curtain = new RainCurtains(t, this.slots)),
      (this.splash = new RainSplashes(t, this.slots)),
      (this.hail = new HailParticles(t, this.slots)),
      (this.lightning = new LightningSystem(t)),
      t.events.on("scenario", () => {
        this._prefill = 0.6;
      }));
  }
  strike({ start: t, end: e, strength: i = 1 } = {}) {
    const s = this.ctx;
    if (!t) {
      const n = s.modules.clouds?.list;
      let o = null;
      if (n)
        for (const a of n) (!o || (a.charge ?? 0) > (o.charge ?? 0)) && (o = a);
      t = o
        ? new ThreeVector3(
            o.position.x,
            o.position.y - (o.size ?? 1) * 0.3,
            o.position.z,
          )
        : new ThreeVector3(
            (Math.random() - 0.5) * LANDSCAPE_BOUNDS.halfW,
            CLOUD_LAYER_HEIGHTS.defaultY,
            (Math.random() - 0.5) * LANDSCAPE_BOUNDS.halfD,
          );
    }
    (e || (e = this.lightning.pickTarget(t, new ThreeVector3())),
      s.events.emit("lightning", {
        start: t,
        end: e,
        strength: i,
      }));
  }
  clear() {
    // 特制天气切换时丢弃仍在空中的旧雨雪，普通停雨仍按原轨迹落地。
    for (const slot of this.slots) {
      slot.stop();
      slot.visible = false;
      slot.claimed = false;
      slot.cloud = null;
      slot.cloudId = null;
      slot.rate = 0;
      slot.arrival = 0;
    }
    this.rainAmount = this.snowAmount = this.hailAmount = 0;
    for (const bolt of this.lightning.bolts) {
      bolt.active = false;
      bolt.group.visible = false;
    }
    this._prefill = 0.6;
  }
  _cloudById(t) {
    const e = this.ctx.modules.clouds?.list;
    if (!e || t == null) return null;
    for (let i = 0; i < e.length; i++) if (e[i].id === t) return e[i];
    return null;
  }
  _assign(t) {
    const e = this.slots,
      i = this.ctx.precip.sources;
    for (const n of e) n.claimed = !1;
    const s = this._prefill > 0;
    for (let n = 0; n < i.length; n++) {
      const o = i[n];
      if (!(o.rate > 0.002) || !(o.radius > 0)) continue;
      const a = this._cloudById(o.cloudId);
      let l = null;
      for (const f of e)
        if (!(
          f.claimed ||
          !f.visible ||
          !(o.cloudId != null
            ? f.cloudId === o.cloudId
            : f.cloudId == null && Math.hypot(f.x - o.x, f.z - o.z) < 0.8)
        )) {
          if (f.live || f.clock - f.tStop < eP) {
            l = f;
            break;
          }
          f.cloudId = null;
        }
      if (l) {
        ((l.claimed = !0), l.feed(o, a, t));
        continue;
      }
      let c = null,
        h = -1 / 0;
      for (const f of e) {
        if (f.claimed) continue;
        const u = f.visible ? (f.live ? -1 : f.clock - f.tStop) : 1e9;
        u > h && ((c = f), (h = u));
      }
      !c || h < 0 || ((c.claimed = !0), c.begin(o, a, s));
    }
    for (const n of e) n.live && !n.claimed && n.stop();
  }
  update(t, e) {
    const i = this.ctx;
    (this._assign(t), this._prefill > 0 && (this._prefill -= t));
    const s = i.renderer.getDrawingBufferSize(this._px).y || 720,
      n = (2 * Math.tan(ThreeMathUtils.degToRad(i.camera.fov) * 0.5)) / s;
    let o = 0,
      a = 0;
    for (const l of this.slots) {
      if (!l.visible) continue;
      (l.update(t, i, this._wind),
        (l.storm = Math.max(i.world.storminess, l.cloud?.storm ?? 0)));
      const c = l.rate * l.arrival;
      ((o += c * (1 - l.snowGround)), (a += c * l.snowGround));
    }
    ((this.rainAmount = o / LANDSCAPE_AREA_SCALE),
      (this.snowAmount = a / LANDSCAPE_AREA_SCALE),
      this.fall.update(t, n),
      this.curtain.update(t, e, n),
      this.splash.update(t, e, n),
      (this.hailAmount = this.hail.update(t, e)),
      this.lightning.update(t, e, n));
  }
  beforeRender() {
    if (!this.ctx.photo?.active || this.ctx.photo.timeRunning) return;
    const height = this.ctx.renderer.getDrawingBufferSize(this._px).y || 720;
    const pixel =
      (2 * Math.tan(ThreeMathUtils.degToRad(this.ctx.camera.fov) * 0.5)) /
      height;
    for (const mesh of this.fall.meshes)
      mesh.material.uniforms.uPixel.value = pixel;
    this.splash.uniforms.uPixel.value = pixel;
    for (const bolt of this.lightning.bolts) {
      bolt.boltMat.uniforms.uPixel.value = pixel;
      bolt.sparkMat.uniforms.uPixel.value = pixel;
    }
  }
}
export { PrecipitationSystem };
