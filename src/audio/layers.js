// Reconstructed module: identifiers and file boundaries are refactor choices.
import { audioClamp } from "./math.js";
function createBiquadFilter(r, t, e, i = 0.707) {
  const s = r.createBiquadFilter();
  return ((s.type = t), (s.frequency.value = e), (s.Q.value = i), s);
}
class LoopingNoiseLayer {
  constructor(t, e, i, { pan: s = !1, rate: n = 1, dest: o = null } = {}) {
    const a = t.ac;
    ((this.sc = t),
      (this.ac = a),
      (this.buf = e),
      (this.rate = n),
      (this.input = a.createGain()),
      (this.gain = a.createGain()),
      (this.gain.gain.value = 0),
      (this.nodes = [this.input, this.gain]),
      (i ? i(a, this.input, this) : this.input).connect(this.gain),
      (this.panner = null));
    const c = o || t.out;
    (s && a.createStereoPanner
      ? ((this.panner = a.createStereoPanner()),
        this.nodes.push(this.panner),
        this.gain.connect(this.panner),
        this.panner.connect(c))
      : this.gain.connect(c),
      (this.src = null),
      (this.quietSince = -1));
  }
  set(t, e, i = 0.35) {
    t > 2e-4
      ? ((this.quietSince = -1),
        this.src || this._start(e),
        this.gain.gain.setTargetAtTime(t, e, i))
      : this.src &&
        (this.quietSince < 0
          ? ((this.quietSince = e), this.gain.gain.setTargetAtTime(0, e, i))
          : e - this.quietSince > i * 9 + 0.5 && this._stop(e));
  }
  get active() {
    return !!this.src;
  }
  pan(t, e, i = 0.3) {
    this.panner &&
      this.src &&
      this.panner.pan.setTargetAtTime(audioClamp(t, -1, 1), e, i);
  }
  _start(t) {
    const e = this.ac.createBufferSource();
    ((e.buffer = this.buf),
      (e.loop = !0),
      (e.playbackRate.value = this.rate),
      e.connect(this.input),
      e.start(t, Math.random() * this.buf.duration * 0.95),
      (this.src = e));
  }
  _stop(t) {
    const e = this.src;
    if (((this.src = null), (this.quietSince = -1), !!e)) {
      e.onended = () => {
        try {
          e.disconnect();
        } catch {}
      };
      try {
        e.stop(t + 0.05);
      } catch {}
    }
  }
  dispose() {
    this._stop(this.ac.currentTime);
    for (const t of this.nodes)
      try {
        t.disconnect();
      } catch {}
  }
}
function playAmbientSample(r, t, e, i, s, n) {
  const o = r.createBufferSource();
  ((o.buffer = t), (o.playbackRate.value = s));
  const a = r.createGain();
  ((a.gain.value = n),
    o.connect(a),
    a.connect(e),
    (o.onended = () => {
      (o.disconnect(), a.disconnect());
    }),
    o.start(i));
}
class AmbientEventScheduler {
  constructor() {
    this.next = 0;
  }
  run(t, e, i, s, n = 40) {
    if (!(e > 0)) {
      this.next = 0;
      return;
    }
    this.next < t && (this.next = t + (Math.random() / e) * 0.5);
    const o = t + i;
    let a = 0;
    for (; this.next < o && a++ < n;)
      (s(this.next), (this.next += -Math.log(1 - Math.random() * 0.999) / e));
  }
}
export {
  AmbientEventScheduler,
  LoopingNoiseLayer,
  createBiquadFilter,
  playAmbientSample,
};
