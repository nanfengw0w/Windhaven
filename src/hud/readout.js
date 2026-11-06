// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  CachedDomProperty,
  CachedText,
  createHudElement,
  parseHudMarkup,
  playHudSound,
} from "./dom.js";
import { HUD_ICONS } from "./icons.js";
import { describePrecipitation, describeWind } from "./weather-format.js";
class WeatherReadout {
  constructor(t, e, i) {
    ((this.ctx = t), (this.hud = e));
    const s = createHudElement("b"),
      n = createHudElement("b"),
      o = createHudElement("b");
    ((this.precIcon = createHudElement(
      "span",
      {
        class: "wg-ro-ico wg-ro-prec",
      },
      [parseHudMarkup(HUD_ICONS.rain), parseHudMarkup(HUD_ICONS.flake)],
    )),
      (this.brand = createHudElement(
        "div",
        {
          class: "wg-brand",
        },
        [
          createHudElement("div", {
            class: "wg-title",
            text: "Windhaven Valley",
          }),
          createHudElement(
            "div",
            {
              class: "wg-readout",
            },
            [
              createHudElement(
                "span",
                {
                  class: "wg-ro",
                  title: "Humidity",
                },
                [
                  createHudElement(
                    "span",
                    {
                      class: "wg-ro-ico",
                    },
                    [parseHudMarkup(HUD_ICONS.drop)],
                  ),
                  s,
                ],
              ),
              createHudElement(
                "span",
                {
                  class: "wg-ro",
                  title: "Wind",
                },
                [
                  createHudElement(
                    "span",
                    {
                      class: "wg-ro-ico",
                    },
                    [parseHudMarkup(HUD_ICONS.breeze)],
                  ),
                  n,
                ],
              ),
              createHudElement(
                "span",
                {
                  class: "wg-ro",
                  title: "Precipitation",
                },
                [this.precIcon, o],
              ),
            ],
          ),
        ],
      )),
      (this.hum = new CachedText(s)),
      (this.wind = new CachedText(n)),
      (this.prec = new CachedText(o)),
      (this.precSnow = new CachedDomProperty(this.brand, "class", "is-snow")),
      (this.precWet = new CachedDomProperty(this.brand, "class", "is-wet")),
      i.append(this.brand),
      (this.el = createHudElement("div", {
        class: "wg-panel wg-actions",
        role: "group",
        "aria-label": "View",
      })));
    const a = !!(
      document.fullscreenEnabled || document.webkitFullscreenEnabled
    );
    this.btn = {};
    const l = (h, f, u, d, p = !1) => {
      const v = createHudElement(
        "button",
        {
          class: "wg-ibtn",
          type: "button",
          "data-act": h,
          "aria-label": f,
        },
        [
          ...u.map((g) => parseHudMarkup(HUD_ICONS[g])),
          createHudElement("span", {
            class: "wg-tip wg-tip-below",
            text: f,
          }),
        ],
      );
      return (
        v.addEventListener("click", d),
        p && (v.hidden = !0),
        this.el.append(v),
        (this.btn[h] = v),
        v
      );
    };
    (l("clear", "Clear skies", ["clear"], () => this.clearSkies()),
      l("reset", "Reset to a calm spring day", ["reset"], () => this.reset()),
      l("sound", "Sound on / off", ["soundOff", "soundOn"], () =>
        this.toggleSound(),
      ),
      l(
        "fullscreen",
        "Fullscreen",
        ["fullscreen", "fullscreenExit"],
        () => this.toggleFullscreen(),
        !a,
      ),
      l("settings", "场景设置", ["settings"], () =>
        this.hud.settings?.toggle(),
      ),
      l("hide", "隐藏全部界面（U 恢复）", ["eyeOff"], () =>
        this.hud.setHidden(!0),
      ),
      i.append(this.el),
      (this.soundOn = new CachedDomProperty(this.btn.sound, "class", "is-on")),
      (this.soundLabel = new CachedDomProperty(
        this.btn.sound,
        "attr",
        "aria-pressed",
      )),
      (this.fsOn = new CachedDomProperty(
        this.btn.fullscreen,
        "class",
        "is-on",
      )));
    const c = () =>
      this.fsOn.set(
        !!(document.fullscreenElement || document.webkitFullscreenElement),
      );
    (document.addEventListener("fullscreenchange", c),
      document.addEventListener("webkitfullscreenchange", c));
  }
  clearSkies() {
    try {
      this.ctx.modules?.clouds?.clear?.();
    } catch (t) {
      console.error("[hud] clear skies", t);
    }
    (playHudSound(this.ctx, "whoosh", {
      volume: 0.25,
    }),
      this._flash(this.btn.clear));
  }
  reset() {
    const t = this.ctx;
    try {
      (window.__wg?.scenario && window.__wg.scenario("calm"),
        t.fields?.clear?.(),
        t.modules?.fog?.clear?.(),
        (t.world.waterRise = 0));
    } catch (e) {
      console.error("[hud] reset", e);
    }
    (playHudSound(t, "chime", {
      volume: 0.16,
      pitch: 1,
    }),
      this._flash(this.btn.reset));
  }
  get muted() {
    const t = this.ctx.audio;
    return t ? t.muted !== !1 : !0;
  }
  toggleSound() {
    const t = this.ctx.audio;
    if (!t) return;
    const e = !this.muted;
    try {
      (e || t.resume?.(),
        typeof t.setMuted == "function" ? t.setMuted(e) : (t.muted = e));
    } catch (i) {
      console.error("[hud] sound", i);
    }
    (this.slow(),
      e ||
        playHudSound(this.ctx, "pop", {
          volume: 0.2,
          pitch: 1.2,
        }));
  }
  toggleFullscreen() {
    const t = document,
      e = t.documentElement;
    try {
      t.fullscreenElement || t.webkitFullscreenElement
        ? (t.exitFullscreen || t.webkitExitFullscreen)?.call(t)
        : (e.requestFullscreen || e.webkitRequestFullscreen)
            ?.call(e)
            ?.catch?.(() => {});
    } catch {}
  }
  _flash(t) {
    t &&
      (t.classList.remove("is-flash"),
      t.offsetWidth,
      t.classList.add("is-flash"));
  }
  slow() {
    const t = this.ctx.world;
    (this.hum.set(`${Math.round((t.humidity || 0) * 100)}%`),
      this.wind.set(describeWind(t.windEnergy || 0)));
    const e = t.rainfall || 0,
      i = t.snowfall || 0;
    (this.prec.set(describePrecipitation(e, i)),
      this.precSnow.set(i > e && i > 0.04),
      this.precWet.set(e + i >= 0.04));
    const s = !this.muted;
    (this.soundOn.set(s), this.soundLabel.set(String(s)));
  }
}
export { WeatherReadout };
