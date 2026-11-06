// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  audioSmoothstep,
  audioValueNoise,
  createAudioRandom,
  seasonDistance,
} from "./math.js";
function createInsectPulseBuffer(
  r,
  {
    seconds: t,
    carrier: e,
    period: i,
    pulses: s,
    pan: n,
    seed: o,
    pulseDur: a = 0.016,
    pulseGap: l = 0.016,
    amp: c = 0.5,
  },
) {
  const h = r.sampleRate,
    f = Math.floor(t * h),
    u = r.createBuffer(2, f, h),
    d = u.getChannelData(0),
    p = u.getChannelData(1),
    v = Math.cos(((n + 1) * Math.PI) / 4),
    g = Math.sin(((n + 1) * Math.PI) / 4),
    x = createAudioRandom(o),
    m = s * (a + l);
  let w = 0.02 + x() * 0.1;
  for (; w + m < t - 0.02;) {
    const y = (2 * Math.PI * e * (1 + (x() - 0.5) * 0.01)) / h,
      _ = Math.floor(a * h);
    for (let M = 0; M < s; M++) {
      const A = Math.floor((w + M * (a + l)) * h),
        b = c * (M === 0 ? 0.65 : 1) * (0.85 + 0.15 * x());
      for (let S = 0; S < _; S++) {
        const E = A + S;
        if (E >= f) break;
        const T = Math.sin((Math.PI * S) / _),
          R = y * E,
          z =
            b *
            T *
            T *
            (Math.sin(R) + 0.2 * Math.sin(2 * R) + 0.05 * Math.sin(3 * R));
        ((d[E] += z * v), (p[E] += z * g));
      }
    }
    w += i * (0.93 + x() * 0.14);
  }
  return u;
}
function createInsectLoops(r, t = 1) {
  const e = [
    createInsectPulseBuffer(r, {
      seconds: 3.1,
      carrier: 4600,
      period: 0.52,
      pulses: 3,
      pan: -0.55,
      seed: 11,
    }),
    createInsectPulseBuffer(r, {
      seconds: 3.7,
      carrier: 4100,
      period: 0.71,
      pulses: 4,
      pan: 0.5,
      seed: 23,
      amp: 0.4,
    }),
  ];
  return (
    t > 0 &&
      e.push(
        createInsectPulseBuffer(r, {
          seconds: 4.4,
          carrier: 2900,
          period: 2.1,
          pulses: 60,
          pan: 0.12,
          seed: 37,
          pulseDur: 0.011,
          pulseGap: 0.011,
          amp: 0.22,
        }),
      ),
    e
  );
}
class InsectAmbience {
  constructor(t) {
    ((this.sc = t),
      (this.ac = t.ac),
      (this.bus = this.ac.createGain()),
      (this.bus.gain.value = 0),
      this.bus.connect(t.out),
      (this.loops = null),
      (this.voices = null),
      (this.quietSince = -1),
      (this.t = Math.random() * 100));
  }
  level(t) {
    const e = 1 - audioSmoothstep(0.15, 0.9, seasonDistance(t.season, 1.25)),
      i = audioSmoothstep(9, 16, t.temp),
      s =
        (1 - audioSmoothstep(0.2, 0.6, t.storm)) *
        (1 - audioSmoothstep(0.15, 0.9, t.rain)) *
        (1 - audioSmoothstep(0.05, 0.5, t.snow));
    return e * i * audioSmoothstep(0.25, 0.75, t.night) * s;
  }
  update(t, e, i) {
    this.t += i;
    const s = 0.3 * this.level(t);
    if (s > 0.002) {
      ((this.quietSince = -1),
        this.voices || this._start(e),
        this.bus.gain.setTargetAtTime(s, e, 1.5));
      const n = 0.95 + 0.1 * audioSmoothstep(10, 28, t.temp);
      for (let o = 0; o < this.voices.length; o++) {
        const { src: a, gain: l } = this.voices[o];
        (l.gain.setTargetAtTime(
          0.5 + 0.5 * audioValueNoise(this.t * 0.12, 31 + o),
          e,
          0.6,
        ),
          a.playbackRate.setTargetAtTime(n * (1 + o * 0.004), e, 2));
      }
    } else
      this.voices &&
        (this.quietSince < 0
          ? ((this.quietSince = e), this.bus.gain.setTargetAtTime(0, e, 1.5))
          : e - this.quietSince > 12 && this._stop(e));
  }
  _start(t) {
    (this.loops || (this.loops = createInsectLoops(this.ac, this.sc.tier)),
      (this.voices = this.loops.map((e) => {
        const i = this.ac.createBufferSource();
        ((i.buffer = e), (i.loop = !0));
        const s = this.ac.createGain();
        return (
          (s.gain.value = 0.7),
          i.connect(s),
          s.connect(this.bus),
          i.start(t, Math.random() * e.duration),
          {
            src: i,
            gain: s,
          }
        );
      })));
  }
  _stop(t) {
    for (const { src: e, gain: i } of this.voices || []) {
      e.onended = () => {
        (e.disconnect(), i.disconnect());
      };
      try {
        e.stop(t + 0.05);
      } catch {}
    }
    ((this.voices = null), (this.quietSince = -1));
  }
  dispose() {
    this.voices && this._stop(this.ac.currentTime);
    try {
      this.bus.disconnect();
    } catch {}
  }
}
export { InsectAmbience };
