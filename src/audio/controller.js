// Reconstructed module: identifiers and file boundaries are refactor choices.
// Audio: event subscriptions map scene actions to synthesized one-shots, while
// the soundscape beds follow world state every frame.
import { audioClamp } from "./math.js";
import { AudioEngine } from "./engine.js";
import { Soundscape } from "./soundscape.js";
function createSoundscapeState() {
  return {
    wind: 0.3,
    storm: 0,
    rain: 0,
    snow: 0,
    day: 1,
    night: 0,
    golden: 0,
    timeOfDay: 0.4,
    season: 0.25,
    activity: 1,
    leaf: 0.85,
    temp: 15,
    waterRise: 0,
    ice: 0,
    riverFreeze: 0,
    snowCover: 0,
    panFall: -0.2,
    panRiver: 0,
    panLake: 0.4,
  };
}
const AUDIO_MASTER_LEVEL = 0.8;
const AUDIO_DEDUP_WINDOW_MS = 60;
const AUDIO_UNLOCK_EVENTS = [
  "pointerdown",
  "pointerup",
  "touchend",
  "keydown",
  "click",
];
const AUDIO_SOURCE_POSITIONS = {
  fall: [-1.45, -1.45],
  river: [0.1, 0.3],
  lake: [2.75, 2.65],
};
const audioNowMilliseconds = () =>
  typeof performance < "u" ? performance.now() : Date.now();
class AudioController {
  constructor(t) {
    ((this.ctx = t),
      (this.muted = !1),
      (this.volume = 1),
      (this.ac = null),
      (this.engine = null),
      (this.scape = null),
      (this.state = createSoundscapeState()));
    const e = typeof window < "u" ? window : null;
    ((this._AC = (e && (e.AudioContext || e.webkitAudioContext)) || null),
      (this.available = !!this._AC),
      (this._want = !1),
      (this._resumeAt = -1e9),
      (this._hidden = typeof document < "u" && !!document.hidden),
      (this._pending = []),
      (this._explicit = new Map()),
      (this._played = new Map()),
      (this._burst = new Map()),
      (this._lastBed = 0),
      (this._bolt = null),
      (this._stroke = null),
      (this._scenarioT = -1e9),
      (this._warned = !1));
    const i = t?.params;
    if (
      (i &&
        (i.get("mute") === "1" ||
          i.get("audio") === "0" ||
          i.get("sound") === "0") &&
        (this.muted = !0),
      !!this.available)
    )
      try {
        this._onGesture = () => {
          (!this.ac || this.ac.state !== "running") && this.resume();
        };
        for (const s of AUDIO_UNLOCK_EVENTS)
          window.addEventListener(s, this._onGesture, {
            capture: !0,
            passive: !0,
          });
        ((this._onVis = () => this._visibility()),
          document.addEventListener("visibilitychange", this._onVis),
          this._subscribe(t?.events));
      } catch {}
  }
  get running() {
    return !!this.ac && this.ac.state === "running";
  }
  resume() {
    if (this.available)
      try {
        ((this._want = !0), this.ac || this._create());
        const t = this.ac;
        if (!t || this.muted || this._hidden) return;
        t.state !== "running" &&
          t.state !== "closed" &&
          ((this._resumeAt = audioNowMilliseconds()),
          t.resume()?.catch?.(() => {}));
      } catch {}
  }
  _create() {
    let t = null;
    try {
      t = new this._AC({
        latencyHint: "interactive",
      });
    } catch {
      try {
        t = new this._AC();
      } catch {
        t = null;
      }
    }
    if (!t) {
      this.available = !1;
      return;
    }
    try {
      const e = this.ctx?.quality?.tier ?? 1;
      ((this.engine = new AudioEngine(t, {
        tier: e,
        reverb: e > 0,
        level: this.muted ? 0 : this.volume * AUDIO_MASTER_LEVEL,
      })),
        (this.scape = new Soundscape(this.engine, {
          tier: e,
        })),
        (this.ac = t),
        this.muted && t.suspend()?.catch?.(() => {}));
    } catch (e) {
      console.warn("[audio] could not initialise Web Audio", e);
      try {
        t.close();
      } catch {}
      ((this.available = !1),
        (this.engine = null),
        (this.scape = null),
        (this.ac = null));
    }
  }
  _visibility() {
    this._hidden = !!document.hidden;
    const t = this.ac;
    if (t)
      try {
        this._hidden
          ? t.suspend()?.catch?.(() => {})
          : this._want &&
            !this.muted &&
            ((this._resumeAt = audioNowMilliseconds()),
            t.resume()?.catch?.(() => {}));
      } catch {}
  }
  setMuted(t) {
    if (((t = !!t), t === this.muted)) return t;
    this.muted = t;
    try {
      (this.ctx?.events?.emit?.("audio:mute", {
        muted: t,
      }),
        t && this._strokeEnd());
      const e = this.ac;
      if (!e || !this.engine) return (!t && this._want && this.resume(), t);
      const i = e.currentTime,
        s = this.engine.master.gain;
      (s.cancelScheduledValues(i),
        s.setValueAtTime(s.value, i),
        s.setTargetAtTime(t ? 0 : this.volume * AUDIO_MASTER_LEVEL, i, 0.12),
        clearTimeout(this._muteTimer),
        t
          ? (this._muteTimer = setTimeout(() => {
              this.muted && this.ac && this.ac.suspend()?.catch?.(() => {});
            }, 900))
          : ((this._want = !0),
            !this._hidden &&
              e.state !== "running" &&
              ((this._resumeAt = audioNowMilliseconds()),
              e.resume()?.catch?.(() => {}))));
    } catch {}
    return t;
  }
  toggleMute() {
    return this.setMuted(!this.muted);
  }
  setVolume(t) {
    this.volume = audioClamp(Number(t) || 0, 0, 1.5);
    try {
      this.engine &&
        !this.muted &&
        this.engine.master.gain.setTargetAtTime(
          this.volume * AUDIO_MASTER_LEVEL,
          this.ac.currentTime,
          0.08,
        );
    } catch {}
    return this.volume;
  }
  dispose() {
    try {
      if (this._onGesture)
        for (const t of AUDIO_UNLOCK_EVENTS)
          window.removeEventListener(t, this._onGesture, {
            capture: !0,
          });
      this._onVis &&
        document.removeEventListener("visibilitychange", this._onVis);
      for (const t of this._offs || []) t?.();
      (this.scape?.dispose(),
        this.engine?.stopAll(),
        this.ac?.close?.()?.catch?.(() => {}));
    } catch {}
    ((this.ac = null), (this.engine = null), (this.scape = null));
  }
  play(t, e) {
    return this.available
      ? (this._explicit.set(t, audioNowMilliseconds()), this._play(t, e || {}))
      : !1;
  }
  _play(t, e) {
    const i = this.engine;
    if (!i || this.muted || this._hidden) return !1;
    try {
      const s = this.ac.state;
      if (
        s === "closed" ||
        (s !== "running" && audioNowMilliseconds() - this._resumeAt > 600) ||
        !i.has(t)
      )
        return !1;
      const n = audioNowMilliseconds();
      let o = this._burst.get(t);
      for (o || ((o = []), this._burst.set(t, o)); o.length && n - o[0] > 40;)
        o.shift();
      return o.length >= 3
        ? !1
        : (o.push(n), this._played.set(t, n), i.play(t, e));
    } catch (s) {
      return (
        this._warned ||
          ((this._warned = !0), console.warn("[audio] play failed", t, s)),
        !1
      );
    }
  }
  _auto(t, e, i = null, s = 0) {
    !this.engine ||
      this.muted ||
      this._pending.length > 32 ||
      this._pending.push({
        name: t,
        opts: e,
        kind: i,
        gapMs: s,
        t: audioNowMilliseconds(),
      });
  }
  _flush(t) {
    const e = this._bolt;
    if (
      (e &&
        !e.thunder &&
        t - e.t > 250 &&
        ((e.thunder = !0),
        this._play("rumble", {
          delay: 0.35,
          strength: e.s,
          pan: e.pan * 0.6,
          volume: 0.85,
        })),
      !this._pending.length)
    )
      return;
    const i = this._pending;
    this._pending = [];
    for (const s of i) {
      if (
        (s.kind === "spawn" && Math.abs(s.t - this._scenarioT) < 250) ||
        (s.kind === "ui" && this._anyExplicitNear(s.t))
      )
        continue;
      const n = this._explicit.get(s.name);
      if (!(n !== void 0 && Math.abs(n - s.t) < AUDIO_DEDUP_WINDOW_MS)) {
        if (s.gapMs) {
          const o = this._played.get(s.name);
          if (o !== void 0 && t - o < s.gapMs) continue;
        }
        this._play(s.name, s.opts);
      }
    }
  }
  _anyExplicitNear(t) {
    for (const e of this._explicit.values())
      if (Math.abs(e - t) < AUDIO_DEDUP_WINDOW_MS) return !0;
    return !1;
  }
  _subscribe(t) {
    if (!t?.on) return;
    const e = (i, s) => {
      const n = t.on(i, (o) => {
        try {
          s(o || {});
        } catch {}
      });
      (this._offs || (this._offs = [])).push(n);
    };
    (e("lightning", (i) => this._onLightning(i)),
      e("thunder", (i) => this._onThunder(i)),
      e("cloud:grab", (i) =>
        this._auto("grab", {
          volume: 0.5,
          pan: this._panOf(i.cloud),
        }),
      ),
      e("cloud:release", (i) =>
        this._auto("release", {
          volume: 0.4,
          pan: this._panOf(i.cloud),
        }),
      ),
      e("cloud:merge", (i) =>
        this._auto("merge", {
          volume: 0.6,
          pan: this._panOf(i.cloud),
        }),
      ),
      e("cloud:spawn", (i) =>
        this._auto(
          "pop",
          {
            volume: 0.3,
            pitch: 1 + Math.random() * 0.2,
            pan: this._panOf(i.cloud),
          },
          "spawn",
          80,
        ),
      ),
      e("cloud:squeeze", (i) => {
        const s = audioClamp(Number(i.amount) || 0.5, 0, 1);
        this._auto(
          "squish",
          {
            volume: 0.25 + 0.45 * s,
            pitch: 1.15 - 0.4 * s,
            pan: this._panOf(i.cloud),
          },
          "squeeze",
          200,
        );
      }),
      e("splash", (i) => {
        if (i.source === "water") return;
        const s = audioClamp(Number(i.strength) || 1, 0, 2);
        this._auto(
          "splash",
          {
            volume: 0.3 + 0.3 * Math.min(1, s),
            pitch: 0.9 + Math.random() * 0.25,
            pan: this._panAt(i.x, i.z),
          },
          null,
          60,
        );
      }),
      e("wind:start", () => this._strokeStart()),
      e("wind:stroke", (i) => this._strokeMove(i)),
      e("wind:end", () => this._strokeEnd()),
      e("tool", () =>
        this._auto(
          "click",
          {
            volume: 0.35,
          },
          "ui",
        ),
      ),
      e("scenario", () => {
        this._scenarioT = audioNowMilliseconds();
      }),
      e("weather:change", () => {
        // 预设天气渐变时补入的云不播放手动造云音效。
        this._scenarioT = audioNowMilliseconds();
      }));
  }
  _onLightning(t) {
    const e = audioClamp(Number(t.strength) || 1, 0.2, 1.5),
      i = t.end ? this._panAt(t.end.x, t.end.z) : 0;
    (this._play("crack", {
      volume: 0.5 + 0.3 * Math.min(1, e),
      strength: e,
      pan: i,
    }),
      (this._bolt = {
        t: audioNowMilliseconds(),
        pan: i,
        s: e,
        thunder: !1,
      }));
  }
  _onThunder(t) {
    const e = audioClamp(Number(t.delay) || 0, 0, 20),
      i = audioClamp(Number(t.strength) || 1, 0.1, 1.5),
      s = this._bolt;
    s && !s.thunder && audioNowMilliseconds() - s.t < 400
      ? ((s.thunder = !0),
        this._play("rumble", {
          delay: e,
          strength: i,
          pan: s.pan * 0.6,
          volume: 0.9,
        }))
      : this._play("thunder", {
          delay: e,
          strength: i,
          volume: 0.9,
        });
  }
  _strokeStart() {
    const t = this.engine;
    if (
      !(!t || this.muted || this._hidden || this.ac.state !== "running") &&
      !this._stroke
    )
      try {
        const e = this.ac.currentTime,
          i = t.voice("windstroke", t.sfx, e, 0, 2);
        i.persistent = !0;
        const s = i.noise(t.noise.pink, e),
          n = i.filter("bandpass", 450, 1),
          o = i.filter("lowpass", 2600, 0.5),
          a = i.gain(0);
        (i.chain(s, n, o, a, i.out),
          (i.out.gain.value = 1),
          i.send(0.08),
          i.start(null),
          (this._stroke = {
            v: i,
            bp: n,
            g: a,
            last: e,
            idle: !0,
          }));
      } catch {
        this._stroke = null;
      }
  }
  _strokeMove(t) {
    this._stroke || this._strokeStart();
    const e = this._stroke;
    if (!e) return;
    const i = this.ac.currentTime,
      s = audioClamp(Number(t.strength) || 0, 0, 1.3);
    (e.g.gain.setTargetAtTime(0.06 + 0.6 * Math.pow(s, 0.85), i, 0.07),
      e.bp.frequency.setTargetAtTime(320 + 1500 * s, i, 0.09),
      e.bp.Q.setTargetAtTime(0.8 + 0.8 * s, i, 0.1),
      e.v.panner &&
        Number.isFinite(t.x) &&
        e.v.panner.pan.setTargetAtTime(this._panAt(t.x, t.z), i, 0.12),
      (e.last = i),
      (e.idle = !1));
  }
  _strokeTick(t) {
    const e = this._stroke;
    e &&
      !e.idle &&
      t - e.last > 0.12 &&
      (e.g.gain.setTargetAtTime(0, t, 0.18), (e.idle = !0));
  }
  _strokeEnd() {
    const t = this._stroke;
    if (t) {
      this._stroke = null;
      try {
        const e = this.ac.currentTime;
        (t.g.gain.setTargetAtTime(0, e, 0.15), t.v.stopAt(e + 1.2));
      } catch {
        t.v.dispose();
      }
    }
  }
  update() {
    if (!this.engine) {
      this._pending.length = 0;
      return;
    }
    try {
      const t = audioNowMilliseconds();
      if (
        (this._flush(t), this.ac.state !== "running" || t - this._lastBed < 48)
      )
        return;
      const e = this._lastBed
        ? Math.min(0.25, (t - this._lastBed) / 1e3)
        : 0.05;
      this._lastBed = t;
      const i = this.ac.currentTime;
      (this._fillState(),
        this.scape.update(this.state, i, e),
        this._strokeTick(i));
    } catch (t) {
      this._warned ||
        ((this._warned = !0), console.warn("[audio] update failed", t));
    }
  }
  _fillState() {
    const t = this.ctx?.world,
      e = this.state;
    if (!t) return;
    const i = t.seasonal || {},
      s = (o, a) => (Number.isFinite(o) ? o : a);
    ((e.wind = s(t.windEnergy, 0.3)),
      (e.storm = s(t.storminess, 0)),
      (e.rain = s(t.rainfall, 0)),
      (e.snow = s(t.snowfall, 0)),
      (e.day = s(t.day, 1)),
      (e.night = s(t.night, 0)),
      (e.golden = s(t.golden, 0)),
      (e.timeOfDay = s(t.timeOfDay, 0.4)),
      (e.season = s(t.season, 0.25)),
      (e.activity = s(i.activity, 1)),
      (e.leaf = s(i.leafAmount, 1)),
      (e.temp = s(t.seaLevelTemp, 12)),
      (e.waterRise = s(t.waterRise, 0)),
      (e.snowCover = s(t.snowCover, 0)));
    const n = this.ctx.modules?.water;
    ((e.ice = s(n?.ice, s(this.ctx.fields?.lakeFrozen, 0))),
      (e.riverFreeze = s(n?.riverFreeze, e.ice)),
      (e.panFall = this._panAt(
        AUDIO_SOURCE_POSITIONS.fall[0],
        AUDIO_SOURCE_POSITIONS.fall[1],
      )),
      (e.panRiver = this._panAt(
        AUDIO_SOURCE_POSITIONS.river[0],
        AUDIO_SOURCE_POSITIONS.river[1],
      )),
      (e.panLake = this._panAt(
        AUDIO_SOURCE_POSITIONS.lake[0],
        AUDIO_SOURCE_POSITIONS.lake[1],
      )));
  }
  _panAt(t, e) {
    const i = this.ctx?.camera;
    if (!i || !Number.isFinite(t) || !Number.isFinite(e)) return 0;
    const s = i.matrixWorld.elements,
      n = t - s[12],
      o = e - s[14],
      a = Math.hypot(n, o) || 1;
    return audioClamp(((n * s[0] + o * s[2]) / a) * 1.6, -0.9, 0.9);
  }
  _panOf(t) {
    const e = t?.position;
    return e ? this._panAt(e.x, e.z) : 0;
  }
}
export { AudioController };
