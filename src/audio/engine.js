// Reconstructed module: identifiers and file boundaries are refactor choices.
import { audioClamp } from "./math.js";
import { createReverbImpulse, getNoiseBuffers } from "./buffers.js";
import { AudioVoice } from "./voice.js";
import {
  CENTERED_SOUND_EFFECTS,
  SOUND_EFFECTS,
  SOUND_VOICE_LIMITS,
} from "./effects.js";
function createSoftClipCurve(r = 2048) {
  const t = new Float32Array(r);
  for (let e = 0; e < r; e++) {
    const i = ((e / (r - 1)) * 2 - 1) * 2,
      s = Math.abs(i),
      n = s <= 0.75 ? s : 0.75 + 0.22 * Math.tanh((s - 0.75) / 0.22);
    t[e] = Math.sign(i) * n;
  }
  return t;
}
function createAudioCompressor(r, t, e, i, s, n) {
  const o = r.createDynamicsCompressor();
  return (
    (o.threshold.value = t),
    (o.knee.value = e),
    (o.ratio.value = i),
    (o.attack.value = s),
    (o.release.value = n),
    o
  );
}
class AudioEngine {
  constructor(t, e = {}) {
    if (
      ((this.ac = t),
      (this.tier = e.tier ?? 1),
      (this.noise = getNoiseBuffers(t)),
      (this.voices = []),
      (this.maxVoices = this.tier === 0 ? 22 : 36),
      (this.limiter = createAudioCompressor(t, -3, 0, 20, 0.002, 0.15)),
      (this.comp = createAudioCompressor(t, -18, 12, 2.5, 0.008, 0.35)),
      (this.master = t.createGain()),
      (this.master.gain.value = e.level ?? 0.8),
      (this.clipIn = t.createGain()),
      (this.clipIn.gain.value = 0.5),
      (this.clip = t.createWaveShaper()),
      (this.clip.curve = createSoftClipCurve()),
      this.master.connect(this.comp),
      this.comp.connect(this.limiter),
      this.limiter.connect(this.clipIn),
      this.clipIn.connect(this.clip),
      this.clip.connect(e.destination || t.destination),
      (this.sfx = t.createGain()),
      this.sfx.connect(this.master),
      (this.beds = t.createGain()),
      this.beds.connect(this.master),
      (this.verbIn = null),
      e.reverb !== !1)
    ) {
      this.verbIn = t.createGain();
      const i = t.createConvolver();
      ((i.buffer = createReverbImpulse(t, this.tier >= 2 ? 1.8 : 1.4)),
        (this.verbOut = t.createGain()),
        (this.verbOut.gain.value = 0.5),
        this.verbIn.connect(i),
        i.connect(this.verbOut),
        this.verbOut.connect(this.master),
        (this.conv = i));
    }
  }
  get now() {
    return this.ac.currentTime;
  }
  voice(t, e, i, s, n = SOUND_VOICE_LIMITS[t] ?? 6) {
    let o = 0,
      a = 0,
      l = null,
      c = null;
    for (const u of this.voices)
      u.killed ||
        (a++,
        u.name === t && (o++, l || (l = u)),
        !c && !u.persistent && (c = u));
    const h = this.ac.currentTime;
    o >= n && l ? l.kill(h) : a >= this.maxVoices && c && c.kill(h);
    const f = new AudioVoice(this, t, e || this.sfx, i, s);
    return (this.voices.push(f), f);
  }
  _removeVoice(t) {
    const e = this.voices.indexOf(t);
    e >= 0 && this.voices.splice(e, 1);
  }
  has(t) {
    return Object.prototype.hasOwnProperty.call(SOUND_EFFECTS, t);
  }
  play(t, e = {}, i = null) {
    const s = this.has(t) ? SOUND_EFFECTS[t] : null;
    if (!s) return !1;
    const n = audioClamp(Number.isFinite(e.volume) ? e.volume : 1, 0, 2);
    if (n <= 0.001) return !1;
    const o = audioClamp(Number.isFinite(e.delay) ? e.delay : 0, 0, 30),
      a = i ?? this.ac.currentTime + 0.006 + o,
      l = Number.isFinite(e.pan),
      c = l
        ? audioClamp(e.pan, -1, 1)
        : CENTERED_SOUND_EFFECTS.has(t)
          ? 0
          : null,
      h = this.voice(t, this.sfx, a, c);
    h.out.gain.value = n;
    const f = {
      pitch: audioClamp(Number.isFinite(e.pitch) ? e.pitch : 1, 0.25, 4),
      strength: audioClamp(Number.isFinite(e.strength) ? e.strength : 1, 0, 2),
      delay: o,
      panGiven: l,
      rand: Math.random,
    };
    let u;
    try {
      u = s(h, a, f);
    } catch (d) {
      throw (h.dispose(), d);
    }
    return (h.start(u), !0);
  }
  stopAll() {
    for (const t of this.voices.slice()) t.kill();
  }
}
export { AudioEngine };
