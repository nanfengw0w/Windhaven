// Coordinates birds, insects, leaves, smoke and wind wisps with their shared environment; scene props are delegated to props/.
import { createSimplexNoise, smoothstep, clamp, damp } from "../core/math.js";
import {
  ThreeGroup,
  ThreeMesh,
  ThreePointLight,
} from "../vendor/three-runtime.js";
import { CabinAndYardProps } from "../props/cabin-and-yard.js";
import { createPropMaterial } from "../props/material.js";
import { CABIN_PLACEMENT } from "../simulation/terrain-shape.js";
import { MooredBoatSystem } from "../props/boat-system.js";
import { ChimneySmoke } from "./smoke.js";
import { FallingLeaves } from "./leaves.js";
import { WindWisps } from "./wisps.js";
import { InsectSystem } from "./insects.js";
import { BirdFlock } from "./birds.js";
class LifeSystem {
  constructor(t) {
    this.ctx = t;
    const { scene: e, events: i } = t;
    ((this.noise = createSimplexNoise(777)),
      (this.group = new ThreeGroup()),
      (this.group.name = "life"),
      e.add(this.group),
      (this.uniforms = {
        uLifeGlow: {
          value: 0,
        },
        uLifeFlicker: {
          value: 0,
        },
        uLifeWet: {
          value: 0,
        },
        uRoofSnow: {
          value: 0,
        },
      }),
      (this.env = {
        day: 1,
        night: 0,
        golden: 0,
        dusk: 0,
        sunny: 1,
        rain: 0,
        snow: 0,
        storm: 0,
        wet: 0,
        temp: 15,
        cold: 0,
        summer: 1,
        spring: 0,
        autumn: 0,
        winter: 0,
        activity: 1,
        wind: 0,
        fire: 0.2,
        glow: 0,
        flowers: 1,
        fireflies: 0,
        butterflies: 0,
        motes: 0,
        leafFall: 0,
        blossom: 0,
        ice: 0,
        level: t.world.lakeLevel,
        time: 0,
      }),
      (this.props = new CabinAndYardProps(t, this.group, this.uniforms)),
      (this.material = createPropMaterial(t, this.uniforms, CABIN_PLACEMENT.y)),
      (this.propMesh = new ThreeMesh(this.props.geometry, this.material)),
      (this.propMesh.name = "life-props"),
      (this.propMesh.castShadow = !0),
      (this.propMesh.receiveShadow = !0),
      (this.propMesh.matrixAutoUpdate = !1),
      this.group.add(this.propMesh));
    ((this.boatSystem = new MooredBoatSystem(
      t,
      this.group,
      this.props,
      this.material,
      this.env,
    )),
      (this.hearth = new ThreePointLight(16751184, 0, 1.7, 2)),
      this.hearth.position.copy(this.props.cabinPoint(0.17, 0.2, 0.36)),
      (this.hearth.castShadow = !1),
      this.group.add(this.hearth),
      (this.glow = 0),
      (this._flick = 0),
      (this.cabin = {
        x: CABIN_PLACEMENT.x,
        y: CABIN_PLACEMENT.y,
        z: CABIN_PLACEMENT.z,
      }),
      (this.chimneyTop = this.props.chimneyTop),
      (this.jettyEnd = this.props.jettyEnd),
      (this.perches = this.props.perches),
      (this.systems = []));
    const n = (a, l) => {
      try {
        const c = l();
        ((this[a] = c),
          this.systems.push({
            name: a,
            s: c,
            dead: !1,
          }));
      } catch (c) {
        console.error(`[life] ${a} failed to initialise`, c);
      }
    };
    (n("smoke", () => new ChimneySmoke(t, this.group, this.props.chimneyTop)),
      n("leaves", () => new FallingLeaves(t, this.group)),
      n("wisps", () => new WindWisps(t, this.group)),
      n("insects", () => new InsectSystem(t, this.group, this)),
      n(
        "birds",
        () =>
          new BirdFlock(t, this.group, this, {
            side: -1,
            count: [5, 7, 9],
            seed: 7151,
          }),
      ),
      n(
        "birdsEast",
        () =>
          new BirdFlock(t, this.group, this, {
            side: 1,
            count: [3, 4, 5],
            seed: 7152,
            roamDelay: 6,
          }),
      ),
      i.on("tree:shake", (a) => this.leaves?.shake?.(a, this.env)),
      i.on("wind:stroke", (a) => {
        (this.wisps?.stroke?.(a, this.env),
          this.leaves?.stroke?.(a, this.env),
          this.insects?.disturb?.(a.x, a.z, 0.6 + (a.strength || 0)));
      }));
    const o = (a, l, c) => {
      (this.scatterBirds(a, l, c), this.insects?.disturb?.(a, l, c));
    };
    (i.on("tap", () => o(void 0, void 0, 1)),
      i.on("lightning", (a) => {
        (o(a?.end?.x, a?.end?.z, 2), this.insects?.flash?.());
      }),
      i.on("splash", (a) => this.boatSystem.splash(a)),
      i.on("scenario", () => this._reset()),
      this._updateEnv(0),
      this._reset());
  }
  scatterBirds(x, z, strength = 1) {
    this.birds?.scatter(x, z, strength);
    this.birdsEast?.scatter(x, z, strength);
  }
  _updateEnv(t) {
    const { world: e, wind: i, fields: s } = this.ctx,
      n = this.env,
      o = e.seasonal,
      a = e.season,
      l = (x) => Math.abs(((((a - x) % 4) + 6) % 4) - 2);
    ((n.time = e.timeOfDay),
      (n.day = e.day),
      (n.night = e.night),
      (n.golden = e.golden),
      (n.dusk = smoothstep(0.3, 0, e.sunElevation) * (1 - e.night)),
      (n.storm = e.storminess),
      (n.rain = clamp(e.rainfall * 1.2, 0, 1)),
      (n.snow = clamp(e.snowfall * 1.2, 0, 1)),
      (n.temp = e.temperatureAt(CABIN_PLACEMENT.y)),
      (n.cold = smoothstep(15, -2, n.temp)),
      (n.spring = 1 - smoothstep(0.3, 0.95, l(0))),
      (n.summer = 1 - smoothstep(0.35, 0.95, l(1))),
      (n.autumn = 1 - smoothstep(0.3, 0.9, l(2))),
      (n.winter = 1 - smoothstep(0.35, 0.95, l(3))),
      (n.activity = o.activity),
      (n.flowers = o.flowers),
      (n.blossom = o.blossom),
      (n.leafFall = o.fallingLeaves),
      (n.wind = e.windEnergy),
      (n.wet = clamp(
        s.wetAt?.(CABIN_PLACEMENT.x, CABIN_PLACEMENT.z) ?? e.groundWetness,
        0,
        1,
      )));
    const c = clamp(e.cloudCover * 0.8 + e.storminess, 0, 1);
    n.sunny = e.day * (1 - c * 0.75) * (1 - n.rain) * (1 - n.snow * 0.8);
    const h = this.ctx.modules.water;
    ((n.level = typeof h?.level == "number" ? h.level : e.lakeLevel),
      (n.ice = typeof h?.ice == "number" ? h.ice : s.lakeFrozen || 0));
    const f = smoothstep(0.22, -0.06, e.sunElevation),
      u = smoothstep(0.03, 0.08, n.time) * smoothstep(0.24, 0.17, n.time),
      d = clamp(
        e.storminess * 1.1 + c * 0.35 * (1 - e.day * 0.6) + n.rain * 0.4,
        0,
        1,
      ),
      p = clamp(Math.max(f * (1 - u * 0.65), d * 0.85), 0, 1);
    ((this.glow = t > 0 ? damp(this.glow, p, 1.5, t) : p),
      (n.glow = this.glow),
      (n.fire = clamp(
        0.12 + n.cold * 0.85 + this.glow * 0.45 + n.storm * 0.2,
        0.1,
        1,
      )));
    const v = (1 - n.rain) * (1 - n.storm) * (1 - smoothstep(1.5, 3, n.wind));
    n.butterflies = clamp(
      Math.max(n.spring, n.summer) *
        n.sunny *
        smoothstep(0.2, 0.6, o.flowers) *
        v *
        smoothstep(8, 14, n.temp),
      0,
      1,
    );
    const g = Math.max(e.night, smoothstep(0.12, -0.04, e.sunElevation));
    ((n.fireflies = clamp(
      Math.max(n.summer, n.spring * 0.25) *
        g *
        v *
        smoothstep(10, 16, n.temp) *
        (1 - smoothstep(0.08, 0.2, n.time) * smoothstep(0.3, 0.2, n.time) * 0),
      0,
      1,
    )),
      (n.motes = clamp(
        n.sunny *
          Math.max(n.summer, n.spring * 0.6, n.autumn * 0.4) *
          (1 - n.rain),
        0,
        1,
      )));
  }
  update(t, e) {
    this._updateEnv(t);
    const i = this.env,
      { fields: s } = this.ctx,
      n = this.noise;
    this._flick =
      0.55 * n.noise2(e * 5.3, 1.7) +
      0.3 * n.noise2(e * 13.1, 4.2) +
      0.15 * n.noise2(e * 29, 9.9);
    const o = this.uniforms;
    ((o.uLifeGlow.value = this.glow), (o.uLifeFlicker.value = this._flick));
    const a = s.snowAt?.(CABIN_PLACEMENT.x, CABIN_PLACEMENT.z) ?? 0,
      l = clamp(a, 0, 1.4) * 0.024;
    ((o.uRoofSnow.value = t > 0 ? damp(o.uRoofSnow.value, l, 0.8, t) : l),
      (o.uLifeWet.value = i.rain * 0.5),
      (this.hearth.intensity = this.glow * (0.22 + 0.06 * this._flick)),
      this.boatSystem.update(t, e));
    for (const c of this.systems)
      if (!c.dead)
        try {
          c.s.update(t, e, i);
        } catch (h) {
          (console.error(`[life] ${c.name} update failed; disabling it`, h),
            (c.dead = !0));
          try {
            c.s.hide?.();
          } catch {}
        }
  }
  beforeRender() {
    if (!this.ctx.photo?.active || this.ctx.photo.timeRunning) return;
    for (const system of this.systems)
      if (!system.dead) system.s.syncPhotoCamera?.();
    this.ctx.modules.alpineTown?.trainSmoke?.smoke?.syncPhotoCamera();
  }
  _reset() {
    this._updateEnv(0);
    this.boatSystem.reset(this.ctx.time || 0);
    for (const e of this.systems)
      if (!e.dead)
        try {
          e.s.reset?.(this.env);
        } catch (i) {
          console.error(`[life] ${e.name} reset failed`, i);
        }
  }
}
export { LifeSystem };
