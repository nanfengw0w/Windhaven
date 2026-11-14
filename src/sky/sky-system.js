// Reconstructed module: identifiers and file boundaries are refactor choices.
// Sky dome: sun/moon orbit with drag-to-set-time, stars and meteors, atmosphere,
// aurora and the rain-tracking rainbow.
import { ThreeGroup } from "../vendor/three-runtime.js";
import { clamp } from "../core/math.js";
import { CelestialOrbit, signedTimeOfDayDelta } from "./celestial-orbit.js";
import { SunAndMoon } from "./sun-and-moon.js";
import { SkyAtmosphere } from "./atmosphere.js";
import { StarsAndMeteors } from "./stars-and-meteors.js";
import { RainbowEffect } from "./rainbow.js";
import { AuroraEffect } from "./aurora.js";
import { SkyLanterns } from "./sky-lanterns.js";
const wrapTimeOfDay = (r) => ((r % 1) + 1) % 1;
class SkySystem {
  constructor(t) {
    ((this.ctx = t),
      (this.group = new ThreeGroup()),
      (this.group.name = "sky"),
      t.scene.add(this.group),
      (this.orbit = new CelestialOrbit(t.world)),
      (this.orbs = new SunAndMoon(t, this.group)),
      (this.atmosphere = new SkyAtmosphere(t, this.group)),
      (this.stars = new StarsAndMeteors(t, this.group)),
      (this.aurora = new AuroraEffect(t, this.group)),
      (this.lanterns = new SkyLanterns(t, this.group)),
      (this.rainbowFx = new RainbowEffect(t, this.group)),
      (this.grabbing = null),
      (this.sunVisibility = 0),
      (this.drag = null),
      (this.glide = null),
      (this.timeVel = 0),
      (this._hinted = !1),
      (this._time = 0),
      this._installInput(),
      t.events.on("scenario", () => {
        ((this.timeVel = 0), (this.glide = null));
      }));
  }
  get rainbow() {
    return this.rainbowFx.amount;
  }
  get starsVisible() {
    return this.stars.visibility;
  }
  glideTo(t) {
    this.glide = wrapTimeOfDay(t);
  }
  _installInput() {
    const { input: t, world: e, events: i } = this.ctx;
    t.addHandler({
      name: "sky",
      priority: 50,
      tools: ["hand"],
      releaseAfterSimulation: true,
      cursor: "grab",
      activeCursor: "grabbing",
      hitTest: (s) => this.orbs.hitTest(s),
      onDown: (s, n) => {
        this.ctx.weather?.cancelTransition("time");
        e.dayCycle = false;
        const o = this.orbs.orb(s.body),
          a = this.orbit.solve(s.body, n.ndc, this.ctx.camera, e.timeOfDay);
        return (
          (this.drag = {
            body: s.body,
            target: e.timeOfDay,
            offset: signedTimeOfDayDelta(e.timeOfDay - a),
          }),
          (this.glide = null),
          (this.grabbing = s.body),
          (o.grabbed = !0),
          (o.pulse = 1),
          this.ctx.audio?.play?.("chime", {
            volume: 0.22,
            pitch: s.body === "moon" ? 0.75 : 1.15,
          }),
          i.emit("sky:grab", {
            body: s.body,
          }),
          !0
        );
      },
      onMove: (s) => {
        if (!this.drag) return;
        const n = this.orbit.solve(
          this.drag.body,
          s.ndc,
          this.ctx.camera,
          this.drag.target,
        );
        this.drag.target = wrapTimeOfDay(n + this.drag.offset);
      },
      onUp: (s) => {
        if (!this.drag) return;
        const n = this.orbs.orb(this.drag.body);
        ((n.grabbed = !1),
          (n.pulse = Math.max(n.pulse, 0.55)),
          s.stillTime > 0.08 && (this.timeVel = 0),
          (this.timeVel = clamp(this.timeVel, -0.3, 0.3)),
          i.emit("sky:release", {
            body: this.drag.body,
          }),
          this.ctx.audio?.play?.("release", {
            volume: 0.08,
            pitch: 1.4,
          }),
          (this.drag = null),
          (this.grabbing = null));
      },
      onHover: (s) => {
        ((this.orbs.sun.hovered = s?.body === "sun"),
          (this.orbs.moon.hovered = s?.body === "moon"),
          s &&
            !this._hinted &&
            ((this._hinted = !0),
            i.emit("hud:hint", {
              text:
                s.body === "moon"
                  ? "Drag the moon to turn the night"
                  : "Drag the sun to change the time of day",
            })));
      },
    });
  }
  update(t, e) {
    ((this._time = e),
      this.orbit.sync(),
      this._clock(t),
      this.orbs.update(t, e, this),
      this.atmosphere.update(t),
      this.stars.update(t),
      this.aurora.update(t, e),
      this.lanterns.update(t),
      this.ctx.input.hover?.handler?.name !== "sky" &&
        (this.orbs.sun.hovered = this.orbs.moon.hovered = !1));
  }
  _clock(t) {
    const e = this.ctx.world,
      i = this.drag ? this.drag.target : this.glide;
    if (i != null) {
      const s = signedTimeOfDayDelta(i - e.timeOfDay);
      if (t <= 0) ((e.timeOfDay = wrapTimeOfDay(i)), (this.timeVel = 0));
      else {
        const n = this.drag ? 13 : 4.5,
          o = this.drag ? 0.62 : 1;
        ((this.timeVel += (n * n * s - 2 * o * n * this.timeVel) * t),
          (e.timeOfDay = wrapTimeOfDay(e.timeOfDay + this.timeVel * t)));
      }
      !this.drag &&
        Math.abs(s) < 1e-4 &&
        Math.abs(this.timeVel) < 0.001 &&
        ((this.glide = null), (this.timeVel = 0));
    } else
      Math.abs(this.timeVel) > 1e-4 && t > 0
        ? ((e.timeOfDay = wrapTimeOfDay(e.timeOfDay + this.timeVel * t)),
          (this.timeVel *= Math.exp(-t * 2.4)))
        : (this.timeVel = 0);
  }
  beforeRender(t) {
    if (this.ctx.photo?.active && !this.ctx.photo.timeRunning) {
      this.ctx.camera.updateMatrixWorld();
      this.orbs.syncPhotoCamera(this._time, this);
      this.atmosphere.update(0);
      this.stars.syncPhotoCamera();
      this.rainbowFx.syncPhotoCamera();
      return;
    }
    (this.rainbowFx.update(t),
      this.rainbowFx.celebrate(this._time) &&
        (this.ctx.audio?.play?.("chime", {
          volume: 0.12,
          pitch: 1.6,
        }),
        this.ctx.events.emit("sky:rainbow", {
          strength: this.rainbowFx.amount,
        })));
  }
}
export { SkySystem };
