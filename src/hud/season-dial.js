// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  CachedDomProperty,
  CachedText,
  bindHudDrag,
  clampHud,
  createHudElement,
  hudNow,
  linearColorToCssRgb,
  parseHudMarkup,
  playHudSound,
  positiveModuloHud,
  vibrateHud,
  wrapSignedHud,
} from "./dom.js";
import { HUD_ICONS, SEASON_ICON_NAMES } from "./icons.js";
const SEASON_LABELS = ["Spring", "Summer", "Autumn", "Winter"];
function describeSeason(r) {
  r = positiveModuloHud(r, 4);
  const t = Math.round(r) & 3,
    e = wrapSignedHud(r - Math.round(r), 4);
  return e > 0.22
    ? {
        sub: "Late",
        name: SEASON_LABELS[t],
      }
    : e < -0.22
      ? {
          sub: "Early",
          name: SEASON_LABELS[t],
        }
      : {
          sub: t === 1 || t === 3 ? "Mid" : "",
          name: SEASON_LABELS[t],
        };
}
class SeasonDial {
  constructor(t, e, i) {
    ((this.ctx = t),
      (this.hud = e),
      (this.dragging = !1),
      (this.dragTarget = 0),
      (this.lastEmit = 0),
      (this.lastHeart = null));
    const s = (this.el = createHudElement("div", {
      class: "wg-dial",
      role: "slider",
      tabindex: "0",
      "aria-label": "Season dial",
      "aria-valuemin": "0",
      "aria-valuemax": "4",
    }));
    s.append(
      createHudElement("div", {
        class: "wg-dial-dish",
      }),
      createHudElement("div", {
        class: "wg-dial-ring",
      }),
      createHudElement("div", {
        class: "wg-dial-glow",
      }),
    );
    let n = "";
    for (let l = 0; l < 12; l++) {
      if (l % 3 === 0) continue;
      const c = (l / 12) * Math.PI * 2,
        h = 50 + Math.sin(c) * 35,
        f = 50 - Math.cos(c) * 35,
        u = 50 + Math.sin(c) * 37.4,
        d = 50 - Math.cos(c) * 37.4;
      n += `<line x1="${h.toFixed(2)}" y1="${f.toFixed(2)}" x2="${u.toFixed(2)}" y2="${d.toFixed(2)}"/>`;
    }
    (s.append(
      parseHudMarkup(
        `<svg class="wg-dial-ticks" viewBox="0 0 100 100" aria-hidden="true">${n}</svg>`,
      ),
    ),
      (this.glyphs = SEASON_ICON_NAMES.map((l, c) => {
        const h = createHudElement(
          "div",
          {
            class: `wg-dial-glyph wg-g-${l}`,
            "data-s": c,
            title: SEASON_LABELS[c],
            "aria-hidden": "true",
          },
          [parseHudMarkup(HUD_ICONS[l])],
        );
        return (
          h.style.setProperty("--a", `${c * 90}deg`),
          s.append(h),
          {
            el: h,
            near: new CachedDomProperty(h, "var", "--near"),
            on: new CachedDomProperty(h, "class", "is-near"),
          }
        );
      })),
      (this.arm = createHudElement(
        "div",
        {
          class: "wg-dial-arm",
          "aria-hidden": "true",
        },
        [
          createHudElement("span", {
            class: "wg-dial-knob",
          }),
        ],
      )),
      s.append(this.arm));
    const o = createHudElement("span", {
        class: "wg-dial-sub",
      }),
      a = createHudElement("span", {
        class: "wg-dial-name",
      });
    this.playBtn = createHudElement(
      "button",
      {
        class: "wg-ibtn wg-play wg-season-play",
        type: "button",
        "aria-pressed": "false",
        "aria-label": "播放季节流逝",
        title: "播放季节流逝",
      },
      [parseHudMarkup(HUD_ICONS.play), parseHudMarkup(HUD_ICONS.pause)],
    );
    this.playBtn.addEventListener("click", () => this.togglePlay());
    this.playing = new CachedDomProperty(this.playBtn, "attr", "aria-pressed");
    this.playClass = new CachedDomProperty(this.playBtn, "class", "is-playing");
    this.playLabel = new CachedDomProperty(this.playBtn, "attr", "aria-label");
    this.playTitle = new CachedDomProperty(this.playBtn, "attr", "title");
    (s.append(
      createHudElement(
        "div",
        {
          class: "wg-dial-label",
        },
        [o, a],
      ),
    ),
      (this.subTxt = new CachedText(o)),
      (this.nameTxt = new CachedText(a)),
      (this.armRot = new CachedDomProperty(this.arm, "style", "transform")),
      (this.tint = new CachedDomProperty(s, "var", "--tint")),
      (this.tint2 = new CachedDomProperty(s, "var", "--tint2")),
      (this.ariaNow = new CachedDomProperty(s, "attr", "aria-valuenow")),
      (this.ariaText = new CachedDomProperty(s, "attr", "aria-valuetext")),
      i.append(s),
      this._bind());
  }
  _angleSeason(t, e) {
    const i = e.left + e.width / 2,
      s = e.top + e.height / 2,
      n = Math.atan2(t.clientX - i, -(t.clientY - s));
    return positiveModuloHud((n / (Math.PI * 2)) * 4, 4);
  }
  _bind() {
    const t = this.el,
      e = this.ctx.world;
    let i = null,
      s = -1;
    (bindHudDrag(t, {
      onDown: (n, o) => {
        this._pausePlayback();
        const a = n.target.closest?.(".wg-dial-glyph"),
          l = o.left + o.width / 2,
          c = o.top + o.height / 2,
          h = Math.hypot(n.clientX - l, n.clientY - c) / (o.width / 2);
        ((s = a ? Number(a.dataset.s) : -1),
          (i = a ? "glyph" : h > 0.7 ? "ring" : "centre"),
          this.hud.markUse("season"),
          i === "ring" && this._startDrag(this._angleSeason(n, o)));
      },
      onDrag: (n, o) => {
        (this.dragging || this._startDrag(this._angleSeason(n, o)),
          (this.dragTarget = this._angleSeason(n, o)),
          this.hud.markUse("season"));
      },
      onUp: (n, o, a, cancelled) => {
        if (this.dragging) {
          if (
            !cancelled &&
            this.ctx.photo?.active &&
            !this.ctx.photo.timeRunning
          )
            this.glideTo(this.dragTarget);
          ((this.dragging = !1),
            t.classList.remove("is-dragging"),
            this._emit(!0));
          return;
        }
        a ||
          (i === "glyph" && s >= 0
            ? this.glideTo(s)
            : i === "centre" && this.glideTo((Math.round(e.season) + 1) & 3));
      },
    }),
      t.addEventListener(
        "wheel",
        (n) => {
          n.preventDefault();
          const o = (n.deltaY + n.deltaX) * (n.deltaMode === 1 ? 16 : 1);
          this.nudge(clampHud(o, -60, 60) * 0.0016);
        },
        {
          passive: !1,
        },
      ),
      t.addEventListener("keydown", (n) => {
        const o = n.key;
        let a = !0;
        (o === "ArrowRight" || o === "ArrowUp"
          ? this.nudge(0.05)
          : o === "ArrowLeft" || o === "ArrowDown"
            ? this.nudge(-0.05)
            : o === "PageUp" || o === "Enter" || o === " "
              ? this.glideTo((Math.round(e.season) + 1) & 3)
              : o === "PageDown"
                ? this.glideTo((Math.round(e.season) + 3) & 3)
                : o === "Home"
                  ? this.glideTo(0)
                  : (a = !1),
          a && (n.preventDefault(), n.stopPropagation()));
      }));
  }
  _pausePlayback() {
    const world = this.ctx.world;
    world.seasonCycle = false;
    world.seasonTarget = null;
    this.ctx.weather?.cancelTransition?.("season");
    this.slow();
  }
  _startDrag(t) {
    this._pausePlayback();
    ((this.dragging = !0),
      (this.dragTarget = t),
      (this.ctx.world.seasonTarget = null),
      this.el.classList.add("is-dragging"),
      (this.lastHeart = Math.round(this.ctx.world.season) & 3));
  }
  glideTo(t) {
    this._pausePlayback();
    (this.ctx.world.setSeasonTarget?.(t),
      this.hud.markUse("season"),
      this.ctx.events.emit("season", {
        season: t,
        target: !0,
      }),
      playHudSound(this.ctx, "chime", {
        volume: 0.14,
        pitch: 0.9 + t * 0.12,
      }),
      vibrateHud(8));
    const i = this.glyphs[t]?.el;
    i &&
      (i.classList.remove("is-picked"),
      i.offsetWidth,
      i.classList.add("is-picked"));
  }
  nudge(t) {
    if (this.ctx.photo?.active && !this.ctx.photo.timeRunning) {
      this.glideTo(
        positiveModuloHud(
          (this.ctx.world.seasonTarget ?? this.ctx.world.season) + t,
          4,
        ),
      );
      return;
    }
    this._pausePlayback();
    const e = this.ctx.world;
    ((e.seasonTarget = null),
      (e.season = positiveModuloHud(e.season + t, 4)),
      this.hud.markUse("season"),
      this._emit(!1));
  }
  togglePlay() {
    const world = this.ctx.world;
    world.seasonCycle = !world.seasonCycle;
    if (world.seasonCycle) {
      world.seasonTarget = null;
      this.ctx.weather?.cancelTransition?.("season");
      this.dragging = false;
      this.el.classList.remove("is-dragging");
    }
    this.hud.markUse("season");
    playHudSound(this.ctx, "pop", {
      volume: 0.12,
      pitch: world.seasonCycle ? 1.3 : 1,
    });
    this.slow();
  }
  _emit(t) {
    const e = hudNow();
    (!t && e - this.lastEmit < 120) ||
      ((this.lastEmit = e),
      this.ctx.events.emit("season", {
        season: this.ctx.world.season,
      }));
  }
  frame(t) {
    const e = this.ctx.world;
    if (this.dragging) {
      const s = wrapSignedHud(this.dragTarget - e.season, 4),
        n = t > 0 ? 1 - Math.exp(-t * 16) : 1;
      ((e.seasonTarget = null),
        (e.season = positiveModuloHud(e.season + s * n, 4)));
      const o = Math.round(e.season) & 3;
      (o !== this.lastHeart &&
        Math.abs(wrapSignedHud(e.season - Math.round(e.season), 4)) < 0.12 &&
        ((this.lastHeart = o),
        vibrateHud(5),
        playHudSound(this.ctx, "tink", {
          volume: 0.06,
          pitch: 1.4 + o * 0.1,
        })),
        this._emit(!1));
    }
    const i = positiveModuloHud(e.season, 4);
    this.armRot.set(`rotate(${(i * 90).toFixed(2)}deg)`);
    for (let s = 0; s < 4; s++) {
      const n = Math.max(0, 1 - Math.abs(wrapSignedHud(i - s, 4)) * 1.15),
        o = Math.round(n * 40) / 40;
      (this.glyphs[s].near.set(o.toFixed(3)), this.glyphs[s].on.set(o > 0.55));
    }
  }
  slow() {
    const t = this.ctx.world,
      e = positiveModuloHud(t.season, 4),
      { sub: i, name: s } = describeSeason(e);
    (this.subTxt.set(i), this.nameTxt.set(s));
    const playing = !!t.seasonCycle,
      playLabel = playing ? "暂停季节流逝" : "播放季节流逝";
    this.playing.set(String(playing));
    this.playClass.set(playing);
    this.playLabel.set(playLabel);
    this.playTitle.set(playLabel);
    const n = t.seasonal;
    (n?.foliage && this.tint.set(linearColorToCssRgb(n.foliage)),
      n?.grass && this.tint2.set(linearColorToCssRgb(n.grass)),
      this.ariaNow.set(e.toFixed(2)),
      this.ariaText.set(`${i ? i + " " : ""}${s}`.trim()));
  }
}
export { SeasonDial };
