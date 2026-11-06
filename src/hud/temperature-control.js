// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  CachedDomProperty,
  bindHudDrag,
  clampHud,
  createHudElement,
  playHudSound,
  vibrateHud,
} from "./dom.js";
import {
  TEMPERATURE_BIAS_LIMIT,
  TEMPERATURE_DISPLAY_MAX,
  TEMPERATURE_DISPLAY_MIN,
  formatTemperature,
  temperatureToCssRgb,
} from "./weather-format.js";
class TemperatureControl {
  constructor(t, e, i) {
    ((this.ctx = t),
      (this.hud = e),
      (this.dragging = !1),
      (this.target = null),
      (this.level = null),
      (this.railH = 96),
      (this.merc = createHudElement("div", {
        class: "wg-thermo-merc",
      })),
      (this.tab = createHudElement("div", {
        class: "wg-thermo-tab",
      })),
      (this.rail = createHudElement(
        "div",
        {
          class: "wg-thermo-rail",
        },
        [
          createHudElement("span", {
            class: "wg-thermo-zero",
          }),
          this.tab,
        ],
      )),
      (this.el = createHudElement(
        "div",
        {
          class: "wg-thermo",
          role: "slider",
          tabindex: "0",
          "aria-label": "Temperature (warmer / colder)",
          "aria-valuemin": String(-TEMPERATURE_BIAS_LIMIT),
          "aria-valuemax": String(TEMPERATURE_BIAS_LIMIT),
          title: "Drag: warmer / colder · double-click to reset",
        },
        [
          createHudElement("span", {
            class: "wg-thermo-mark wg-thermo-plus",
            text: "+",
            "aria-hidden": "true",
          }),
          createHudElement(
            "div",
            {
              class: "wg-thermo-tube",
            },
            [
              this.merc,
              createHudElement("span", {
                class: "wg-thermo-scale",
              }),
            ],
          ),
          createHudElement("div", {
            class: "wg-thermo-bulb",
          }),
          this.rail,
          createHudElement("span", {
            class: "wg-thermo-mark wg-thermo-minus",
            text: "−",
            "aria-hidden": "true",
          }),
        ],
      )),
      i.append(this.el),
      (this.mercT = new CachedDomProperty(this.merc, "style", "transform")),
      (this.tabT = new CachedDomProperty(this.tab, "style", "transform")),
      (this.color = new CachedDomProperty(this.el, "var", "--merc")),
      (this.warm = new CachedDomProperty(this.el, "var", "--warm")),
      (this.ariaNow = new CachedDomProperty(this.el, "attr", "aria-valuenow")),
      (this.ariaText = new CachedDomProperty(
        this.el,
        "attr",
        "aria-valuetext",
      )));
    const s = () => {
      const n = this.rail.getBoundingClientRect();
      n.height > 0 && ((this.railH = n.height), (this.tabT.v = void 0));
    };
    try {
      new ResizeObserver(s).observe(this.rail);
    } catch {
      window.addEventListener("resize", s);
    }
    (requestAnimationFrame(s),
      this._bind(),
      t.events.on("scenario", () => {
        this.target = null;
      }));
  }
  _offsetAt(t) {
    const e = this._railRect || this.rail.getBoundingClientRect(),
      i = 1 - (t.clientY - e.top) / Math.max(1, e.height);
    let s =
      clampHud(i, 0, 1) * TEMPERATURE_BIAS_LIMIT * 2 - TEMPERATURE_BIAS_LIMIT;
    return (Math.abs(s) < 0.8 && (s = 0), Math.round(s * 10) / 10);
  }
  _set(t) {
    this.ctx.weather?.cancelTransition("temp");
    const e = this.ctx.world,
      i = e.tempOffset;
    ((e.tempOffset = clampHud(
      t,
      -TEMPERATURE_BIAS_LIMIT,
      TEMPERATURE_BIAS_LIMIT,
    )),
      i !== 0 &&
        e.tempOffset === 0 &&
        (vibrateHud(6),
        playHudSound(this.ctx, "tink", {
          volume: 0.05,
          pitch: 1.1,
        })),
      this.hud.markUse("temp"));
  }
  _bind() {
    (bindHudDrag(this.el, {
      immediate: !0,
      onDown: () => {
        ((this.target = null),
          (this._railRect = this.rail.getBoundingClientRect()),
          this.hud.markUse("temp"));
      },
      onDrag: (t, e, i) => {
        (i && ((this.dragging = !0), this.el.classList.add("is-dragging")),
          this._set(this._offsetAt(t)));
      },
      onUp: () => {
        ((this.dragging = !1), this.el.classList.remove("is-dragging"));
      },
    }),
      this.el.addEventListener("dblclick", (t) => {
        this.ctx.weather?.cancelTransition("temp");
        (t.preventDefault(), (this.target = 0), this.hud.markUse("temp"));
      }),
      this.el.addEventListener(
        "wheel",
        (t) => {
          t.preventDefault();
          const e = (t.deltaY + t.deltaX) * (t.deltaMode === 1 ? 16 : 1);
          ((this.target = null),
            this._set(
              Math.round(
                (this.ctx.world.tempOffset - clampHud(e, -60, 60) * 0.02) * 10,
              ) / 10,
            ));
        },
        {
          passive: !1,
        },
      ),
      this.el.addEventListener("keydown", (t) => {
        const e = t.key,
          i = this.ctx.world;
        let s = !0;
        (e === "ArrowUp" || e === "ArrowRight"
          ? this._set(Math.round(i.tempOffset) + 1)
          : e === "ArrowDown" || e === "ArrowLeft"
            ? this._set(Math.round(i.tempOffset) - 1)
            : e === "Home" || e === "0"
              ? (this.ctx.weather?.cancelTransition("temp"), (this.target = 0))
              : (s = !1),
          s && (t.preventDefault(), t.stopPropagation()));
      }));
  }
  frame(t) {
    const e = this.ctx.world;
    if (this.target !== null && !this.dragging) {
      const o = t > 0 ? 1 - Math.exp(-t * 7) : 1,
        a = e.tempOffset + (this.target - e.tempOffset) * o;
      ((e.tempOffset = Math.abs(a - this.target) < 0.05 ? this.target : a),
        e.tempOffset === this.target && (this.target = null),
        this.hud.markUse("temp"));
    }
    const i = e.seaLevelTemp ?? 10,
      s = clampHud(
        (i - TEMPERATURE_DISPLAY_MIN) /
          (TEMPERATURE_DISPLAY_MAX - TEMPERATURE_DISPLAY_MIN),
        0.02,
        1,
      );
    (this.level === null
      ? (this.level = s)
      : (this.level += (s - this.level) * (t > 0 ? 1 - Math.exp(-t * 5) : 1)),
      this.mercT.set(`scaleY(${this.level.toFixed(3)})`));
    const n =
      (clampHud(e.tempOffset, -TEMPERATURE_BIAS_LIMIT, TEMPERATURE_BIAS_LIMIT) +
        TEMPERATURE_BIAS_LIMIT) /
      (TEMPERATURE_BIAS_LIMIT * 2);
    this.tabT.set(`translateY(${((1 - n) * this.railH).toFixed(1)}px)`);
  }
  slow() {
    const t = this.ctx.world,
      e = t.seaLevelTemp ?? 10;
    this.color.set(temperatureToCssRgb(e));
    const i = t.tempOffset;
    (this.warm.set(i > 0.4 ? "1" : i < -0.4 ? "-1" : "0"),
      this.ariaNow.set(i.toFixed(1)),
      this.ariaText.set(
        `${i >= 0 ? "+" : "−"}${Math.abs(i).toFixed(0)} °C, now ${formatTemperature(e)}`,
      ));
  }
}
export { TemperatureControl };
