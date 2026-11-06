// Reconstructed module: identifiers and file boundaries are refactor choices.
import { audioClamp, audioSmoothstep, audioValueNoise } from "./math.js";
import {
  AmbientEventScheduler,
  LoopingNoiseLayer,
  createBiquadFilter,
  playAmbientSample,
} from "./layers.js";
class WindAmbience {
  constructor(t) {
    const e = t.N;
    ((this.body = new LoopingNoiseLayer(
      t,
      e.pink,
      (i, s, n) => (
        (n.bp = createBiquadFilter(i, "bandpass", 400, 0.8)),
        (n.lp = createBiquadFilter(i, "lowpass", 2200, 0.5)),
        n.nodes.push(n.bp, n.lp),
        s.connect(n.bp),
        n.bp.connect(n.lp),
        n.lp
      ),
    )),
      (this.rustle = new LoopingNoiseLayer(
        t,
        e.white,
        (i, s, n) => (
          (n.hp = createBiquadFilter(i, "highpass", 2800, 0.6)),
          (n.lp = createBiquadFilter(i, "lowpass", 8e3, 0.5)),
          n.nodes.push(n.hp, n.lp),
          s.connect(n.hp),
          n.hp.connect(n.lp),
          n.lp
        ),
      )),
      (this.howl = new LoopingNoiseLayer(
        t,
        e.pink,
        (i, s, n) => {
          ((n.b1 = createBiquadFilter(i, "bandpass", 220, 9)),
            (n.b2 = createBiquadFilter(i, "bandpass", 330, 11)));
          const o = i.createGain();
          return (
            n.nodes.push(n.b1, n.b2, o),
            s.connect(n.b1),
            s.connect(n.b2),
            n.b1.connect(o),
            n.b2.connect(o),
            o
          );
        },
        {
          rate: 0.98,
        },
      )),
      (this.t = Math.random() * 100));
  }
  update(t, e, i) {
    this.t += i;
    const s = audioSmoothstep(0, 2.4, t.wind),
      n = audioValueNoise(this.t * 0.21, 3),
      o = audioValueNoise(this.t * 0.83, 7),
      a = n * 0.7 + o * 0.3,
      l = 0.6 + 0.85 * a * (0.35 + 0.65 * s);
    (this.body.set((0.05 + 0.55 * Math.pow(s, 1.1)) * l, e, 0.4),
      this.body.active &&
        (this.body.bp.frequency.setTargetAtTime(
          240 + 620 * s + 260 * a,
          e,
          0.5,
        ),
        this.body.bp.Q.setTargetAtTime(0.6 + 0.9 * s, e, 0.5)));
    const c = 0.2 + 0.8 * audioClamp(t.leaf, 0, 1);
    this.rustle.set(
      0.12 * audioSmoothstep(0.12, 1, s) * c * (0.25 + 0.95 * o * a),
      e,
      0.25,
    );
    const h = audioSmoothstep(0.25, 0.85, t.storm);
    if (
      (this.howl.set(h * (0.5 + 0.6 * s) * (0.45 + 0.65 * a) * 1.1, e, 0.6),
      this.howl.active)
    ) {
      const f = 170 + 140 * audioValueNoise(this.t * 0.13, 11) + 90 * s;
      (this.howl.b1.frequency.setTargetAtTime(f, e, 0.4),
        this.howl.b2.frequency.setTargetAtTime(
          f * (1.42 + 0.12 * audioValueNoise(this.t * 0.2, 13)),
          e,
          0.4,
        ));
    }
  }
  dispose() {
    (this.body.dispose(), this.rustle.dispose(), this.howl.dispose());
  }
}
class RainAmbience {
  constructor(t) {
    const e = t.N,
      i = t.ac;
    ((this.sc = t),
      (this.ac = i),
      (this.hiss = new LoopingNoiseLayer(
        t,
        e.white,
        (s, n, o) => (
          (o.hp = createBiquadFilter(s, "highpass", 450, 0.5)),
          (o.lp = createBiquadFilter(s, "lowpass", 2500, 0.5)),
          o.nodes.push(o.hp, o.lp),
          n.connect(o.hp),
          o.hp.connect(o.lp),
          o.lp
        ),
      )),
      (this.roar = new LoopingNoiseLayer(
        t,
        e.pink,
        (s, n, o) => (
          (o.lp = createBiquadFilter(s, "lowpass", 650, 0.6)),
          (o.hp = createBiquadFilter(s, "highpass", 70, 0.7)),
          o.nodes.push(o.lp, o.hp),
          n.connect(o.lp),
          o.lp.connect(o.hp),
          o.hp
        ),
      )),
      (this.tickBus = i.createGain()),
      this.tickBus.connect(t.out),
      (this.sched = new AmbientEventScheduler()),
      (this.tierMul = [0.5, 0.8, 1][audioClamp(t.tier, 0, 2)]),
      (this.t = 0));
  }
  update(t, e, i) {
    this.t += i;
    const s = audioClamp(t.rain / 2.2, 0, 1.4),
      n = audioSmoothstep(0.35, 1.1, s);
    (this.hiss.set(
      0.3 *
        Math.pow(audioSmoothstep(0, 1, s), 0.9) *
        (0.85 + 0.3 * audioValueNoise(this.t * 0.4, 21)),
      e,
      0.6,
    ),
      this.hiss.active &&
        this.hiss.lp.frequency.setTargetAtTime(
          1800 + 4800 * audioSmoothstep(0, 1.2, s),
          e,
          0.8,
        ),
      this.roar.set(0.22 * n, e, 0.8));
    const o = s > 0.005 ? (4 + 75 * Math.pow(s, 0.85)) * this.tierMul : 0,
      a = this.sc.N.drops,
      l = 1 - 0.45 * n;
    this.sched.run(e, o, 0.18, (c) => {
      const h = Math.random();
      playAmbientSample(
        this.ac,
        a[(Math.random() * a.length) | 0],
        this.tickBus,
        c,
        0.65 + Math.random() * 0.9,
        (0.04 + 0.16 * h * h * h) * l,
      );
    });
  }
  dispose() {
    (this.hiss.dispose(), this.roar.dispose());
    try {
      this.tickBus.disconnect();
    } catch {}
  }
}
class SnowAmbience {
  constructor(t) {
    this.hush = new LoopingNoiseLayer(
      t,
      t.N.pink,
      (e, i, s) => (
        (s.lp = createBiquadFilter(e, "lowpass", 1e3, 0.5)),
        (s.hp = createBiquadFilter(e, "highpass", 180, 0.6)),
        s.nodes.push(s.lp, s.hp),
        i.connect(s.lp),
        s.lp.connect(s.hp),
        s.hp
      ),
      {
        rate: 0.9,
      },
    );
  }
  update(t, e) {
    this.hush.set(0.09 * audioSmoothstep(0, 1.4, t.snow), e, 1.2);
  }
  dispose() {
    this.hush.dispose();
  }
}
class WaterAmbience {
  constructor(t) {
    const e = t.N,
      i = t.ac;
    ((this.sc = t),
      (this.ac = i),
      (this.fall = new LoopingNoiseLayer(
        t,
        e.pink,
        (s, n, o) => (
          (o.hp = createBiquadFilter(s, "highpass", 140, 0.6)),
          (o.lp = createBiquadFilter(s, "lowpass", 1400, 0.5)),
          o.nodes.push(o.hp, o.lp),
          n.connect(o.hp),
          o.hp.connect(o.lp),
          o.lp
        ),
        {
          pan: !0,
        },
      )),
      (this.brook = new LoopingNoiseLayer(
        t,
        e.pink,
        (s, n, o) => (
          (o.bp = createBiquadFilter(s, "bandpass", 1900, 0.9)),
          o.nodes.push(o.bp),
          n.connect(o.bp),
          o.bp
        ),
        {
          pan: !0,
          rate: 1.03,
        },
      )),
      (this.gurgleBus = i.createGain()),
      i.createStereoPanner
        ? ((this.gurglePan = i.createStereoPanner()),
          this.gurgleBus.connect(this.gurglePan),
          this.gurglePan.connect(t.out))
        : this.gurgleBus.connect(t.out),
      (this.sched = new AmbientEventScheduler()),
      (this.tierMul = [0.5, 0.8, 1][audioClamp(t.tier, 0, 2)]),
      (this.t = Math.random() * 50),
      (this.plinks = null));
  }
  update(t, e, i) {
    this.t += i;
    const s = 1 - 0.88 * audioClamp(t.riverFreeze, 0, 1),
      n = audioClamp(
        1 + 1.2 * audioSmoothstep(0, 2, t.rain) + 4 * t.waterRise,
        1,
        2.6,
      );
    (this.fall.set(0.1 * s * (0.75 + 0.35 * (n - 1)), e, 1),
      this.fall.active &&
        (this.fall.lp.frequency.setTargetAtTime(1300 + 1300 * (n - 1), e, 1),
        this.fall.pan(t.panFall * 0.8, e, 0.4)));
    const o = 0.6 + 0.5 * audioValueNoise(this.t * 1.3, 5);
    (this.brook.set(0.045 * s * o * Math.pow(n, 0.6), e, 0.3),
      this.brook.active &&
        (this.brook.bp.frequency.setTargetAtTime(
          1500 + 900 * audioValueNoise(this.t * 0.6, 9) + 400 * (n - 1),
          e,
          0.3,
        ),
        this.brook.pan(t.panRiver * 0.8, e, 0.4)),
      this.gurglePan &&
        this.gurglePan.pan.setTargetAtTime(
          audioClamp(t.panRiver * 0.7, -1, 1),
          e,
          0.4,
        ),
      this.plinks ||
        (this.plinks = this.sc.N.drops.filter((l) => l.kind === 2)));
    const a = (4 + 4 * (n - 1)) * s * this.tierMul;
    this.sched.run(e, a, 0.2, (l) => {
      const c = this.plinks[(Math.random() * this.plinks.length) | 0];
      playAmbientSample(
        this.ac,
        c,
        this.gurgleBus,
        l,
        0.32 + Math.random() * 0.45,
        (0.012 + 0.03 * Math.random() ** 2) * (0.8 + 0.3 * (n - 1)),
      );
    });
  }
  dispose() {
    (this.fall.dispose(), this.brook.dispose());
    try {
      (this.gurgleBus.disconnect(), this.gurglePan?.disconnect());
    } catch {}
  }
}
class RoomAmbience {
  constructor(t) {
    this.layer = new LoopingNoiseLayer(
      t,
      t.N.brown,
      (e, i, s) => (
        (s.lp = createBiquadFilter(e, "lowpass", 220, 0.6)),
        s.nodes.push(s.lp),
        i.connect(s.lp),
        s.lp
      ),
      {
        rate: 0.85,
      },
    );
  }
  update(t, e) {
    this.layer.set(0.03, e, 1.5);
  }
  dispose() {
    this.layer.dispose();
  }
}
export {
  RainAmbience,
  RoomAmbience,
  SnowAmbience,
  WaterAmbience,
  WindAmbience,
};
