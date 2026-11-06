// Reconstructed module: identifiers and file boundaries are refactor choices.
import { audioClamp, audioSmoothstep, seasonDistance } from "./math.js";
import { scheduleFrequencySweep, scheduleNoteEnvelope } from "./effects.js";
class WildlifeEventScheduler {
  constructor() {
    this.next = 0;
  }
  run(t, e, i, s) {
    if (!(e > 0)) {
      this.next = 0;
      return;
    }
    this.next < t && (this.next = t + (Math.random() / e) * 0.5);
    let n = 0;
    for (; this.next < t + i && n++ < 12;)
      (s(this.next), (this.next += -Math.log(1 - Math.random() * 0.999) / e));
  }
}
class FrogAmbience {
  constructor(t) {
    ((this.sc = t),
      (this.eng = t.eng),
      (this.ac = t.ac),
      (this.bus = this.ac.createGain()),
      this.bus.connect(t.out),
      (this.croaks = new WildlifeEventScheduler()),
      (this.peeps = new WildlifeEventScheduler()),
      (this.peepers = [0, 1, 2].map(() => ({
        f: 2550 + Math.random() * 500,
        pan: 0,
      }))));
  }
  level(t) {
    return (
      (1 - audioSmoothstep(0.1, 0.8, seasonDistance(t.season, 0.4))) *
      audioSmoothstep(0.3, 0.8, t.night) *
      audioSmoothstep(6, 11, t.temp) *
      (1 - audioSmoothstep(0.2, 0.6, t.storm)) *
      (1 - 0.6 * audioSmoothstep(0.3, 1.5, t.rain)) *
      (1 - audioClamp(t.ice, 0, 1))
    );
  }
  update(t, e) {
    const i = this.level(t);
    if (i < 0.03) {
      ((this.croaks.next = 0), (this.peeps.next = 0));
      return;
    }
    const s = audioClamp(t.panLake, -0.8, 0.8);
    (this.croaks.run(e, 0.7 * i, 0.25, (n) =>
      this._croak(n, s + (Math.random() - 0.5) * 0.5),
    ),
      this.peeps.run(e, 2.4 * i, 0.25, (n) => this._peep(n, s)));
  }
  _croak(t, e) {
    const i = this.eng.voice("frog", this.bus, t, audioClamp(e, -0.9, 0.9), 4);
    i.out.gain.value = 0.05 + 0.04 * Math.random();
    const s = 150 + Math.random() * 80,
      n = i.osc("sawtooth", s, t),
      o = i.filter("bandpass", 750 + Math.random() * 300, 2.5),
      a = i.filter("lowpass", 1800, 0.7),
      l = i.gain(0);
    i.chain(n, o, a, l, i.out);
    const c = 2 + (Math.random() < 0.4 ? 1 : 0);
    let h = t;
    for (let f = 0; f < c; f++) {
      const u = 0.04 + Math.random() * 0.02;
      (scheduleFrequencySweep(n.frequency, h, s * 0.92, s * 1.08, u),
        scheduleNoteEnvelope(l.gain, h, u, 0.9, 0.008, 0.015),
        (h += u + 0.025));
    }
    i.start(h + 0.05);
  }
  _peep(t, e) {
    const i = this.peepers[(Math.random() * this.peepers.length) | 0],
      s = audioClamp(e + (i.f - 2800) / 900, -0.9, 0.9),
      n = this.eng.voice("frog", this.bus, t, s, 4);
    n.out.gain.value = 0.03 * (0.7 + 0.3 * Math.random());
    const o = n.osc("sine", i.f, t),
      a = n.gain(0);
    (n.chain(o, a, n.out),
      scheduleFrequencySweep(o.frequency, t, i.f, i.f * 1.12, 0.11),
      scheduleNoteEnvelope(a.gain, t, 0.12, 0.9, 0.02, 0.03),
      n.start(t + 0.15));
  }
  dispose() {
    try {
      this.bus.disconnect();
    } catch {}
  }
}
export { FrogAmbience };
