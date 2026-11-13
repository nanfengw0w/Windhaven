// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  CachedDomProperty,
  CachedText,
  bindHudDrag,
  clampHud,
  createHudElement,
  parseHudMarkup,
  playHudSound,
  positiveModuloHud,
  wrapSignedHud,
} from "./dom.js";
import { HUD_ICONS } from "./icons.js";
const TIME_TRACK_PADDING = 0.035;
const TIME_TRACK_AMPLITUDE = 0.36;
const TIME_TRACK_BASELINE = 0.5;
const timeTrackX = (r) => TIME_TRACK_PADDING + r * (1 - 2 * TIME_TRACK_PADDING);
const timeTrackY = (r) =>
  TIME_TRACK_BASELINE -
  TIME_TRACK_AMPLITUDE * Math.sin((r - 0.25) * Math.PI * 2);
function describeTimeOfDay(r) {
  return r < 0.2
    ? "Night"
    : r < 0.25
      ? "Dawn"
      : r < 0.31
        ? "Sunrise"
        : r < 0.44
          ? "Morning"
          : r < 0.56
            ? "Midday"
            : r < 0.68
              ? "Afternoon"
              : r < 0.75
                ? "Golden hour"
                : r < 0.81
                  ? "Dusk"
                  : "Night";
}
function formatTimeOfDay(r) {
  const t = Math.floor(positiveModuloHud(r, 1) * 24 * 60 + 1e-6) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}
class TimeControl {
  constructor(t, e, i) {
    ((this.ctx = t),
      (this.hud = e),
      (this.dragging = !1),
      (this.target = null),
      (this.glide = null),
      (this.w = 200),
      (this.h = 56));
    const s = (this.el = createHudElement("div", {
      class: "wg-panel wg-time",
    }));
    ((this.playBtn = createHudElement(
      "button",
      {
        class: "wg-ibtn wg-play",
        type: "button",
        "aria-pressed": "false",
        "aria-label": "Play the day",
      },
      [parseHudMarkup(HUD_ICONS.play), parseHudMarkup(HUD_ICONS.pause)],
    )),
      this.playBtn.addEventListener("click", () => this.togglePlay()));
    const n = createHudElement("span", {
        class: "wg-time-clock",
      }),
      o = createHudElement("span", {
        class: "wg-time-phase",
      });
    (s.append(
      createHudElement(
        "div",
        {
          class: "wg-time-head",
        },
        [
          this.playBtn,
          createHudElement(
            "div",
            {
              class: "wg-time-read",
            },
            [n, o],
          ),
        ],
      ),
    ),
      (this.clockTxt = new CachedText(n)),
      (this.phaseTxt = new CachedText(o)));
    const a = 200,
      l = 56;
    let c = "";
    for (let p = 0; p <= 64; p++) {
      const v = p / 64;
      c += `${p ? "L" : "M"}${(timeTrackX(v) * a).toFixed(2)} ${(timeTrackY(v) * l).toFixed(2)}`;
    }
    const h = TIME_TRACK_BASELINE * l,
      f = (p) =>
        `<line class="wg-time-tick" x1="${(timeTrackX(p) * a).toFixed(2)}" y1="${h - 3}" x2="${(timeTrackX(p) * a).toFixed(2)}" y2="${h + 3}"/>`,
      u = `
      <svg class="wg-time-svg" viewBox="0 0 ${a} ${l}" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <clipPath id="wg-clip-day"><rect x="0" y="0" width="${a}" height="${h}"/></clipPath>
          <clipPath id="wg-clip-night"><rect x="0" y="${h}" width="${a}" height="${l - h}"/></clipPath>
          <linearGradient id="wg-day-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffd98a" stop-opacity=".30"/>
            <stop offset="1" stop-color="#ffd98a" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="wg-day-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0.22" stop-color="#f3a36a"/>
            <stop offset="0.5" stop-color="#ffe2a0"/>
            <stop offset="0.78" stop-color="#f3a36a"/>
          </linearGradient>
        </defs>
        <path class="wg-time-dayfill" d="${c}L${a} ${h}L0 ${h}Z" clip-path="url(#wg-clip-day)"/>
        <path class="wg-time-night" d="${c}" clip-path="url(#wg-clip-night)"/>
        <line class="wg-time-horizon" x1="0" y1="${h}" x2="${a}" y2="${h}"/>
        <path class="wg-time-day" d="${c}" clip-path="url(#wg-clip-day)"/>
        ${f(0.25)}${f(0.5)}${f(0.75)}
      </svg>`;
    ((this.knob = createHudElement(
      "div",
      {
        class: "wg-time-knob",
        "aria-hidden": "true",
      },
      [
        createHudElement("span", {
          class: "wg-time-disc",
        }),
        parseHudMarkup(HUD_ICONS.sunFace),
        parseHudMarkup(HUD_ICONS.moonFace),
      ],
    )),
      (this.track = createHudElement(
        "div",
        {
          class: "wg-time-track",
          role: "slider",
          tabindex: "0",
          "aria-label": "Time of day",
          "aria-valuemin": "0",
          "aria-valuemax": "24",
        },
        [parseHudMarkup(u), this.knob],
      )),
      s.append(this.track),
      i.append(s),
      (this.knobT = new CachedDomProperty(this.knob, "style", "transform")),
      (this.night = new CachedDomProperty(this.knob, "var", "--night")),
      (this.isNight = new CachedDomProperty(this.el, "class", "is-night")),
      (this.ariaNow = new CachedDomProperty(
        this.track,
        "attr",
        "aria-valuenow",
      )),
      (this.ariaText = new CachedDomProperty(
        this.track,
        "attr",
        "aria-valuetext",
      )),
      (this.playing = new CachedDomProperty(
        this.playBtn,
        "attr",
        "aria-pressed",
      )),
      (this.playClass = new CachedDomProperty(this.el, "class", "is-playing")),
      (this.playLabel = new CachedDomProperty(
        this.playBtn,
        "attr",
        "aria-label",
      )),
      (this.sky = new CachedDomProperty(this.el, "var", "--sky")));
    const d = () => {
      const p = this.track.getBoundingClientRect();
      p.width > 0 &&
        ((this.w = p.width), (this.h = p.height), (this.knobT.v = void 0));
    };
    try {
      new ResizeObserver(d).observe(this.track);
    } catch {
      window.addEventListener("resize", d);
    }
    (requestAnimationFrame(d),
      this._bind(),
      t.events.on("scenario", () => {
        this.glide = null;
      }));
  }
  _timeAt(t, e) {
    const i = (t.clientX - e.left) / Math.max(1, e.width);
    return positiveModuloHud(
      (i - TIME_TRACK_PADDING) / (1 - 2 * TIME_TRACK_PADDING),
      1,
    );
  }
  _bind() {
    (bindHudDrag(this.track, {
      onDown: () => {
        this.hud.markUse("time");
      },
      onDrag: (t, e, i) => {
        (i && this._beginDrag(),
          (this.target = this._timeAt(t, e)),
          this.hud.markUse("time"));
      },
      onUp: (t, e, i, cancelled) => {
        if ((this.hud.markUse("time"), this.dragging)) {
          // A capture or a frozen photo can go several input events without
          // a simulation step. Keep the last target after releasing the drag.
          if (
            !cancelled &&
            (this.ctx.video?.recording ||
              (this.ctx.photo?.active && !this.ctx.photo.timeRunning)) &&
            this.target != null
          )
            this.glideTo(this.target);
          ((this.dragging = !1),
            (this.target = null),
            this.track.classList.remove("is-dragging"));
          return;
        }
        i || this.glideTo(this._timeAt(t, e));
      },
    }),
      this.track.addEventListener(
        "wheel",
        (t) => {
          t.preventDefault();
          const e = (t.deltaY + t.deltaX) * (t.deltaMode === 1 ? 16 : 1);
          this.nudge(clampHud(e, -60, 60) * 45e-5);
        },
        {
          passive: !1,
        },
      ),
      this.track.addEventListener("keydown", (t) => {
        const e = t.key;
        let i = !0;
        (e === "ArrowRight" || e === "ArrowUp"
          ? this.nudge(1 / 96)
          : e === "ArrowLeft" || e === "ArrowDown"
            ? this.nudge(-1 / 96)
            : e === "PageUp"
              ? this.nudge(1 / 24)
              : e === "PageDown"
                ? this.nudge(-1 / 24)
                : e === "Home"
                  ? this.glideTo(0.25)
                  : e === "End"
                    ? this.glideTo(0.75)
                    : (i = !1),
          i && (t.preventDefault(), t.stopPropagation()));
      }));
  }
  _stopSky() {
    const t = this.ctx.modules?.sky;
    t && ((t.glide = null), (t.timeVel = 0));
  }
  _beginDrag() {
    this.ctx.weather?.cancelTransition("time");
    this.ctx.world.dayCycle = false;
    ((this.dragging = !0),
      (this.glide = null),
      this._stopSky(),
      this.track.classList.add("is-dragging"));
  }
  glideTo(t) {
    this.ctx.weather?.cancelTransition("time");
    this.ctx.world.dayCycle = false;
    this.hud.markUse("time");
    const e = this.ctx.modules?.sky;
    (e?.glideTo
      ? ((e.timeVel = 0), e.glideTo(t), (this.glide = null))
      : (this.glide = positiveModuloHud(t, 1)),
      playHudSound(this.ctx, "tink", {
        volume: 0.06,
        pitch: 1.2,
      }));
  }
  nudge(t) {
    if (this.ctx.photo?.active && !this.ctx.photo.timeRunning) {
      this.glideTo(
        positiveModuloHud(
          (this.ctx.modules?.sky?.glide ??
            this.glide ??
            this.ctx.world.timeOfDay) + t,
          1,
        ),
      );
      return;
    }
    this.ctx.weather?.cancelTransition("time");
    this.ctx.world.dayCycle = false;
    const e = this.ctx.world;
    (this._stopSky(),
      (this.glide = null),
      (e.timeOfDay = positiveModuloHud(e.timeOfDay + t, 1)),
      this.hud.markUse("time"));
  }
  togglePlay() {
    this.ctx.weather?.cancelTransition("time");
    this.glide = null;
    this._stopSky();
    const t = this.ctx.world;
    ((t.dayCycle = !t.dayCycle),
      this.hud.markUse("time"),
      playHudSound(this.ctx, "pop", {
        volume: 0.12,
        pitch: t.dayCycle ? 1.3 : 1,
      }),
      this.slow());
  }
  frame(t) {
    const e = this.ctx.world;
    (this.glide !== null &&
      this._wrote !== void 0 &&
      Math.abs(e.timeOfDay - this._wrote) > 1e-6 &&
      (this.glide = null),
      (this._wrote = void 0));
    const i = this.dragging ? this.target : this.glide;
    if (i != null) {
      const c = wrapSignedHud(i - e.timeOfDay, 1),
        h = t > 0 ? 1 - Math.exp(-t * (this.dragging ? 14 : 5)) : 1;
      (this.dragging && (this._stopSky(), this.hud.markUse("time")),
        !this.dragging && Math.abs(c) < 0.0015
          ? ((e.timeOfDay = positiveModuloHud(i, 1)), (this.glide = null))
          : ((e.timeOfDay = positiveModuloHud(e.timeOfDay + c * h, 1)),
            this.dragging || (this._wrote = e.timeOfDay)));
    }
    const s = positiveModuloHud(e.timeOfDay, 1),
      n = timeTrackX(s) * this.w,
      o = timeTrackY(s) * this.h;
    this.knobT.set(`translate(${n.toFixed(1)}px, ${o.toFixed(1)}px)`);
    const a = Math.sin((s - 0.25) * Math.PI * 2),
      l = clampHud(0.5 - a * 6, 0, 1);
    this.night.set((Math.round(l * 20) / 20).toFixed(2));
  }
  slow() {
    const t = this.ctx.world,
      e = positiveModuloHud(t.timeOfDay, 1),
      i = formatTimeOfDay(e);
    this.clockTxt.set(i);
    const s = describeTimeOfDay(e);
    (this.phaseTxt.set(s),
      this.isNight.set(t.night > 0.5),
      this.ariaNow.set((e * 24).toFixed(2)),
      this.ariaText.set(`${i}, ${s}`));
    const n = !!t.dayCycle;
    (this.playing.set(String(n)),
      this.playClass.set(n),
      this.playLabel.set(n ? "Pause the day" : "Play the day"));
    const o = t.hazeColor;
    if (o) {
      const a = (l) =>
        Math.round(
          clampHud(Math.pow(Math.max(0, l), 0.45454545454545453), 0, 1) * 255,
        );
      this.sky.set(`${a(o.r)} ${a(o.g)} ${a(o.b)}`);
    }
  }
}
export { TimeControl };
