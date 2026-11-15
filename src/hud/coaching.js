// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  createHudElement,
  hudNow,
  hudStorage,
  parseHudMarkup,
  playHudSound,
  wrapSignedHud,
} from "./dom.js";
import { HUD_ICONS } from "./icons.js";
const COACH_STORAGE_KEY = "weatherglass.coach.v2";
const COACH_STEPS = [
  {
    id: "grab",
    icon: "hand",
    text: "抓住一朵云，拖着它划过天空",
  },
  {
    id: "squeeze",
    icon: "rain",
    text: "在云上停住，挤出雨水",
  },
  {
    id: "storm",
    icon: "spark",
    text: "用力摇动云朵，制造雷暴",
  },
  {
    id: "wind",
    icon: "wind",
    text: "选择「风」工具，扫过草地",
    alt: "现在扫过草地",
  },
  {
    id: "sun",
    icon: "summer",
    text: "拖动太阳，改变时间",
  },
  {
    id: "season",
    icon: "autumn",
    text: "转动季节转盘",
  },
  {
    id: "aholo",
    icon: "spark",
    text: "打开 Aholo，把一张照片变成山谷地标",
    target: (ctx) => ctx.aholoCreate?.launch,
  },
];
class ToastManager {
  constructor(t) {
    ((this.el = createHudElement("div", {
      class: "wg-toasts",
      "aria-live": "polite",
    })),
      t.append(this.el),
      (this.live = []));
  }
  toast(t, e = 3200, { icon: i = null } = {}) {
    if (((t = String(t ?? "").trim()), !t)) return null;
    const s = this.live.find((a) => a.text === t);
    if (s) return (s.arm(e), s.handle);
    const n = createHudElement(
        "div",
        {
          class: "wg-toast",
          role: "status",
        },
        [
          i && HUD_ICONS[i]
            ? createHudElement(
                "span",
                {
                  class: "wg-toast-ico",
                },
                [parseHudMarkup(HUD_ICONS[i])],
              )
            : null,
          createHudElement("span", {
            class: "wg-toast-text",
            text: t,
          }),
        ],
      ),
      o = {
        text: t,
        el: n,
        timer: 0,
      };
    for (
      o.close = () => {
        o.closed ||
          ((o.closed = !0),
          clearTimeout(o.timer),
          (this.live = this.live.filter((a) => a !== o)),
          n.classList.remove("is-in"),
          n.classList.add("is-out"),
          setTimeout(() => n.remove(), 420));
      },
        o.arm = (a) => {
          (clearTimeout(o.timer),
            (o.timer = setTimeout(o.close, Math.max(800, a))));
        },
        o.handle = {
          close: o.close,
          el: n,
        },
        n.addEventListener("click", o.close),
        this.el.append(n),
        this.live.push(o);
      this.live.length > 3;
    )
      this.live[0].close();
    return (
      requestAnimationFrame(() =>
        requestAnimationFrame(() => n.classList.add("is-in")),
      ),
      o.arm(e),
      o.handle
    );
  }
  recentText(t) {
    return this.live.some((e) => e.text === t);
  }
}
class InteractionCoach {
  constructor(t, e, i) {
    ((this.ctx = t), (this.hud = e), (this.toasts = i));
    const s = hudStorage.get(COACH_STORAGE_KEY, null) || {};
    ((this.done = !!s.done),
      (this.seen = new Set(Array.isArray(s.seen) ? s.seen : [])),
      (this.current = -1),
      (this.el = null),
      (this.target = null),
      (this.lastGrab = -1e9),
      (this.strokes = 0),
      (this.sunAccum = 0),
      (this.lastTod = t.world.timeOfDay),
      (this.lastScenario = 0),
      (this.started = !1),
      (this.busy = !1));
    const n = t.params,
      o = n?.has?.("shot");
    (n?.get?.("coach") === "1"
      ? ((this.done = !1), this.seen.clear())
      : (o || n?.get?.("ui") === "0") && (this.done = !0),
      this._wire());
  }
  _save() {
    hudStorage.set(COACH_STORAGE_KEY, {
      done: this.done,
      seen: [...this.seen],
    });
  }
  start(t = 2400) {
    this.started ||
      this.done ||
      ((this.started = !0), setTimeout(() => this._next(), t));
  }
  _wire() {
    const t = this.ctx.events,
      e = (i, s) =>
        t.on(i, (n) => {
          try {
            s(n || {});
          } catch (o) {
            console.error("[hud] coach", o);
          }
        });
    (e("cloud:grab", () => {
      ((this.lastGrab = hudNow()), this._mark("grab"));
    }),
      e("cloud:squeeze", (i) => {
        (i.cloud?.grabbed || hudNow() - this.lastGrab < 15e3) &&
          (i.amount ?? 1) > 0.15 &&
          this._mark("squeeze");
      }),
      e("lightning", () => {
        hudNow() - this.lastGrab < 2e4 && this._mark("storm");
      }),
      e("wind:stroke", () => {
        ++this.strokes >= 8 && this._mark("wind");
      }),
      e("tool", ({ tool: i }) => {
        COACH_STEPS[this.current]?.id === "wind" &&
          (this._setText(
            i === "wind"
              ? COACH_STEPS[this.current].alt
              : COACH_STEPS[this.current].text,
          ),
          this._highlight(
            i === "wind" ? null : this.hud.toolbar?.button("wind"),
          ));
      }),
      e("season", () => this._mark("season")),
      e("aholo:open", () => this._mark("aholo")),
      e("sky:grab", () => {
        this.sunAccum += 0.01;
      }),
      e("scenario", () => {
        ((this.lastScenario = hudNow()),
          (this.lastTod = this.ctx.world.timeOfDay));
      }));
  }
  slow() {
    const t = this.ctx.world,
      e = Math.abs(wrapSignedHud(t.timeOfDay - this.lastTod, 1));
    if (((this.lastTod = t.timeOfDay), this.seen.has("sun") || e < 1e-5))
      return;
    const i = !!this.ctx.modules?.sky?.grabbing,
      s = this.hud.usedRecently("time", 1500);
    (i || (!s && !t.dayCycle && hudNow() - this.lastScenario > 600)) &&
      ((this.sunAccum += e), this.sunAccum > 0.025 && this._mark("sun"));
  }
  _mark(t) {
    this.seen.has(t) ||
      (this.seen.add(t),
      this.done || this._save(),
      COACH_STEPS[this.current]?.id === t && this._complete());
  }
  _complete() {
    if (!this.el || this.busy) return;
    ((this.busy = !0),
      this.el.classList.add("is-done"),
      playHudSound(this.ctx, "chime", {
        volume: 0.1,
        pitch: 1.5,
      }),
      this._highlight(null),
      setTimeout(() => {
        (this._closeEl(),
          setTimeout(() => {
            ((this.busy = !1), this._next());
          }, 650));
      }, 1100));
  }
  _next() {
    if (this.done) return;
    const t = COACH_STEPS.findIndex((e) => !this.seen.has(e.id));
    if (t < 0) {
      this._finish(!0);
      return;
    }
    ((this.current = t), this._show(COACH_STEPS[t], t));
  }
  _finish(t) {
    ((this.done = !0),
      (this.current = -1),
      this._save(),
      this._highlight(null),
      this._closeEl(),
      t &&
        setTimeout(
          () =>
            this.toasts.toast(
              "基础操作完成。用 Aholo 造一个属于你的地标吧。",
              5200,
              {
                icon: "spark",
              },
            ),
          500,
        ));
  }
  _show(t, e) {
    this._closeEl();
    this._highlight(null);
    const k = createHudElement("span", { class: "wg-coach-kicker" }, [
        createHudElement("span", { text: "快速上手" }),
        createHudElement("span", { text: `${e + 1} / ${COACH_STEPS.length}` }),
      ]),
      i = createHudElement(
        "span",
        {
          class: "wg-coach-dots",
          "aria-hidden": "true",
        },
        COACH_STEPS.map((l, c) =>
          createHudElement("i", {
            class: c === e ? "is-now" : this.seen.has(l.id) ? "is-seen" : "",
          }),
        ),
      ),
      s = createHudElement("span", {
        class: "wg-toast-text",
        text: t.text,
      }),
      n = createHudElement(
        "button",
        {
          class: "wg-coach-btn",
          type: "button",
          "aria-label": "下一步",
          title: "下一步",
        },
        [parseHudMarkup(HUD_ICONS.next)],
      ),
      o = createHudElement(
        "button",
        {
          class: "wg-coach-btn",
          type: "button",
          "aria-label": "跳过新手教程",
          title: "跳过新手教程",
        },
        [parseHudMarkup(HUD_ICONS.close)],
      ),
      a = createHudElement(
        "div",
        {
          class: "wg-toast wg-coach",
          role: "status",
        },
        [
          createHudElement(
            "span",
            {
              class: "wg-toast-ico wg-coach-ico",
            },
            [
              parseHudMarkup(HUD_ICONS[t.icon] || HUD_ICONS.spark),
              parseHudMarkup(HUD_ICONS.check),
            ],
          ),
          createHudElement(
            "span",
            {
              class: "wg-coach-main",
            },
            [k, s, i],
          ),
          n,
          o,
        ],
      );
    if (
      (n.addEventListener("click", () => {
        this.busy ||
          (this.seen.add(t.id),
          this._save(),
          this._closeEl(),
          this._highlight(null),
          setTimeout(() => this._next(), 300));
      }),
      o.addEventListener("click", () => this._finish(!1)),
      (this.textEl = s),
      (this.el = a),
      this.toasts.el.append(a),
      requestAnimationFrame(() =>
        requestAnimationFrame(() => a.classList.add("is-in")),
      ),
      t.id === "wind")
    ) {
      const l = this.ctx.input?.tool === "wind";
      (l && this._setText(t.alt),
        this._highlight(l ? null : this.hud.toolbar?.button("wind")));
    } else if (t.id === "season") this._highlight(this.hud.seasonTarget());
    else if (typeof t.target === "function")
      this._highlight(t.target(this.ctx));
  }
  _setText(t) {
    this.textEl &&
      this.textEl.textContent !== t &&
      (this.textEl.textContent = t);
  }
  _highlight(t) {
    this.target !== t &&
      (this.target?.classList.remove("wg-coach-target"),
      (this.target = t || null),
      this.target?.classList.add("wg-coach-target"));
  }
  _closeEl() {
    const t = this.el;
    t &&
      ((this.el = null),
      (this.textEl = null),
      t.classList.remove("is-in"),
      t.classList.add("is-out"),
      setTimeout(() => t.remove(), 420));
  }
  get text() {
    return this.el ? this.textEl?.textContent : null;
  }
  retarget() {
    COACH_STEPS[this.current]?.id === "season" &&
      !this.busy &&
      this._highlight(this.hud.seasonTarget());
  }
}
export { InteractionCoach, ToastManager };
