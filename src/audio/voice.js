// Reconstructed module: identifiers and file boundaries are refactor choices.
import { audioClamp } from "./math.js";
class AudioVoice {
  constructor(t, e, i, s, n) {
    const o = t.ac;
    ((this.eng = t),
      (this.ac = o),
      (this.name = e),
      (this.t0 = s),
      (this.end = s),
      (this.nodes = []),
      (this.srcs = []),
      (this.live = 0),
      (this.killed = !1),
      (this.disposed = !1),
      (this.persistent = !1),
      (this.out = o.createGain()),
      this.nodes.push(this.out),
      (this.panner = null),
      n != null && o.createStereoPanner
        ? ((this.panner = o.createStereoPanner()),
          (this.panner.pan.value = audioClamp(n, -1, 1)),
          this.out.connect(this.panner),
          this.panner.connect(i),
          this.nodes.push(this.panner))
        : this.out.connect(i));
  }
  gain(t = 0) {
    const e = this.ac.createGain();
    return ((e.gain.value = t), this.nodes.push(e), e);
  }
  filter(t, e, i = 0.707) {
    const s = this.ac.createBiquadFilter();
    return (
      (s.type = t),
      (s.frequency.value = e),
      (s.Q.value = i),
      this.nodes.push(s),
      s
    );
  }
  osc(t, e, i = this.t0) {
    const s = this.ac.createOscillator();
    return (
      (s.type = t),
      (s.frequency.value = e),
      this.nodes.push(s),
      this.srcs.push({
        s,
        t: i,
        offset: -1,
      }),
      s
    );
  }
  noise(t, e = this.t0, i = 1) {
    const s = this.ac.createBufferSource();
    return (
      (s.buffer = t),
      (s.loop = !0),
      (s.playbackRate.value = i),
      this.nodes.push(s),
      this.srcs.push({
        s,
        t: e,
        offset: Math.random() * t.duration * 0.9,
      }),
      s
    );
  }
  sample(t, e = this.t0, i = 1) {
    const s = this.ac.createBufferSource();
    return (
      (s.buffer = t),
      (s.playbackRate.value = i),
      this.nodes.push(s),
      this.srcs.push({
        s,
        t: e,
        offset: 0,
      }),
      s
    );
  }
  chain(...t) {
    for (let e = 0; e < t.length - 1; e++) t[e].connect(t[e + 1]);
    return t[t.length - 1];
  }
  send(t) {
    if (!this.eng.verbIn || !(t > 0)) return;
    const e = this.gain(t);
    (this.out.connect(e), e.connect(this.eng.verbIn));
  }
  start(t) {
    if (((this.end = t ?? 1 / 0), (this.live = this.srcs.length), !this.live)) {
      this.dispose();
      return;
    }
    const e = () => {
      --this.live <= 0 && this.dispose();
    };
    for (const { s: i, t: s, offset: n } of this.srcs)
      ((i.onended = e),
        n >= 0 ? i.start(s, n) : i.start(s),
        t != null && i.stop(Math.max(t, s + 0.02)));
  }
  stopAt(t) {
    for (const { s: e } of this.srcs)
      try {
        e.stop(t);
      } catch {}
    if (!this.eng.offline)
      this._fallback((t - this.ac.currentTime) * 1e3 + 400);
  }
  kill(t = this.ac.currentTime) {
    if (!(this.killed || this.disposed)) {
      this.killed = !0;
      try {
        const e = this.out.gain;
        (e.cancelScheduledValues(t),
          e.setValueAtTime(e.value, t),
          e.linearRampToValueAtTime(0, t + 0.04));
      } catch {}
      this.stopAt(t + 0.05);
    }
  }
  _fallback(t) {
    (this._fb && clearTimeout(this._fb),
      (this._fb = setTimeout(
        () => this.dispose(),
        Math.max(200, Math.min(t, 2e4)),
      )));
  }
  dispose() {
    if (!this.disposed) {
      ((this.disposed = !0), this._fb && clearTimeout(this._fb));
      for (const { s: t } of this.srcs) t.onended = null;
      for (const t of this.nodes)
        try {
          t.disconnect();
        } catch {}
      ((this.nodes.length = 0),
        (this.srcs.length = 0),
        this.eng._removeVoice(this));
    }
  }
}
export { AudioVoice };
