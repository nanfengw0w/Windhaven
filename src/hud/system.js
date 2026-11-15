// Reconstructed module: identifiers and file boundaries are refactor choices.
// DOM HUD: toolbar, independently collapsible climate controls and settings.
import {
  CachedDomProperty,
  CachedText,
  createHudElement,
  hudNow,
  hudStorage,
  parseHudMarkup,
  playHudSound,
} from "./dom.js";
import { HUD_ICONS } from "./icons.js";
import { ToolBar } from "./toolbar.js";
import { SeasonDial } from "./season-dial.js";
import { TimeControl } from "./time-control.js";
import { describeWeather, formatTemperature } from "./weather-format.js";
import { TemperatureControl } from "./temperature-control.js";
import { WeatherReadout } from "./readout.js";
import { InteractionCoach, ToastManager } from "./coaching.js";
import { SettingsPanel } from "./settings-panel.js";
import { WeatherPresets } from "./weather-presets.js";
import { ExplorationControls } from "./exploration-controls.js";
import { PhotoControls } from "./photo-controls.js";
import { VideoControls } from "./video-mode.js";
import { CameraControls } from "./camera-controls.js";
const HUD_SLOW_UPDATE_INTERVAL = 100;
const COMPACT_HUD_MEDIA_QUERY = "(max-width: 859px), (max-height: 519px)";
class HudSystem {
  constructor(t) {
    ((this.ctx = t),
      (this._uses = Object.create(null)),
      (this._lastSlow = 0),
      (this._errs = new Set()),
      (this.hiddenByUser = !1),
      (this._inertBeforeHide = null),
      (this._focusBeforeHide = null),
      (this.climatePanels = {}));
    const e = document.getElementById("ui") || document.body,
      i = (this.root = createHudElement("div", {
        class: "wg-hud",
      }));
    (this._shield(i), (this.top = new WeatherReadout(t, this, i)));
    const s = createHudElement("div", {
      class: "wg-bottom",
    });
    (i.append(s), (this.toolbar = new ToolBar(t, this, s)));
    const n = (this.dock = createHudElement("div", {
      class: "wg-dock",
      id: "wg-dock",
    }));
    (i.append(n), (this.time = new TimeControl(t, this, n)));
    const o = createHudElement("div", {
        class: "wg-panel wg-climate",
      }),
      a = createHudElement("span", {
        class: "wg-temp",
      }),
      l = createHudElement("span", {
        class: "wg-offset",
      }),
      c = createHudElement("span", {
        class: "wg-cond",
      });
    o.append(
      createHudElement(
        "div",
        {
          class: "wg-climate-head",
        },
        [
          createHudElement("div", { class: "wg-season-readout" }, [
            createHudElement("span", { class: "wg-temp-row" }, [a, l]),
            c,
          ]),
        ],
      ),
    );
    const h = createHudElement("div", {
      class: "wg-climate-body",
    });
    (o.append(h),
      n.append(o),
      (this.thermo = new TemperatureControl(t, this, h)),
      (this.season = new SeasonDial(t, this, h)),
      o.querySelector(".wg-climate-head").prepend(this.season.playBtn),
      (this.tempTxt = new CachedText(a)),
      (this.offTxt = new CachedText(l)),
      (this.offShow = new CachedDomProperty(l, "class", "is-shown")),
      (this.condTxt = new CachedText(c)),
      (this.condTitle = new CachedDomProperty(c, "attr", "title")),
      (this.cameraControls = new CameraControls(t, this)),
      this.createClimateCard("season", "季节", o),
      this.createClimateCard("time", "时间", this.time.el),
      (this.toasts = new ToastManager(i)),
      (this.coach = new InteractionCoach(t, this, this.toasts)),
      (this.settings = new SettingsPanel(t, this, i)),
      (this.weatherPresets = new WeatherPresets(t, this, i)),
      (this.explorationControls = new ExplorationControls(t, i)),
      (this.videoControls = new VideoControls(t)),
      (this.photoControls = new PhotoControls(t, i, this.videoControls.button)),
      e.append(i));
    // Mode controllers disable InputController, so the visibility shortcut
    // belongs to the HUD rather than its ordinary-mode key event stream.
    window.addEventListener(
      "keydown",
      (event) => this._visibilityKey(event),
      true,
    );
    try {
      this.mq = window.matchMedia(COMPACT_HUD_MEDIA_QUERY);
      const u = () => {
        (i.classList.toggle("is-compact", this.mq.matches),
          this.coach.retarget());
      };
      (this.mq.addEventListener?.("change", u), u());
    } catch {}
    (t.events.on("hud:hint", (u) => this._hint(u?.text, u?.ms)),
      t.events.on("key", (u) => this._key(u || {})),
      t.events.on("scenario", () => this.slow()));
    const f = () => this.coach.start(1800);
    if (document.body.classList.contains("ready")) f();
    else {
      const u = new MutationObserver(() => {
        document.body.classList.contains("ready") && (u.disconnect(), f());
      });
      u.observe(document.body, {
        attributes: !0,
        attributeFilter: ["class"],
      });
    }
    ((this._dt = 0),
      (this._frameTime = () => this.time.frame(this._dt)),
      (this._frameSeason = () => this.season.frame(this._dt)),
      (this._frameThermo = () => this.thermo.frame(this._dt)),
      (this._slowCoach = () => this.coach.slow()),
      this.slow());
  }
  toast(t, e = 3200, i) {
    return this.toasts.toast(t, e, i);
  }
  setHidden(t) {
    t = !!t;
    if (t && !this._inertBeforeHide) {
      const focus = document.activeElement;
      if (focus !== document.body && focus !== this.ctx.renderer.domElement) {
        this._focusBeforeHide = focus;
        focus?.blur?.();
      }
      const elements = [this.root, this.photoControls.overlay];
      if (!this.videoControls.recording)
        elements.push(this.videoControls.overlay);
      this._inertBeforeHide = elements.map((element) => [
        element,
        element.inert,
      ]);
      for (const [element] of this._inertBeforeHide) element.inert = true;
    }
    document.body.classList.toggle("no-ui", t);
    this.hiddenByUser = t;
    if (!t) {
      for (const [element, inert] of this._inertBeforeHide || [])
        element.inert = inert;
      this._inertBeforeHide = null;
      const focus = this._focusBeforeHide;
      this._focusBeforeHide = null;
      if (
        focus?.isConnected &&
        !focus.disabled &&
        !focus.closest("[inert]") &&
        focus.getClientRects().length
      )
        focus.focus({ preventScroll: true });
      this.slow();
    }
  }
  _visibilityKey(event) {
    const target = event.target;
    if (
      (event.code !== "KeyU" && event.key?.toLowerCase() !== "u") ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.shiftKey ||
      event.repeat ||
      event.isComposing ||
      target?.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)
    )
      return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.setHidden(!document.body.classList.contains("no-ui"));
  }
  createClimateCard(name, label, control) {
    const content = createHudElement(
      "div",
      {
        class: "wg-climate-content",
        id: "wg-" + name + "-content",
      },
      [control],
    );
    const toggle = createHudElement(
      "button",
      {
        class: "wg-climate-toggle",
        type: "button",
        "aria-controls": content.id,
      },
      [
        createHudElement("span", { text: label }),
        parseHudMarkup(HUD_ICONS.collapse),
      ],
    );
    const card = createHudElement(
      "section",
      {
        class: "wg-panel wg-climate-card wg-" + name + "-card",
        "aria-label": label + "控件",
      },
      [toggle, content],
    );
    this.dock.append(card);
    this.climatePanels[name] = {
      card,
      content,
      toggle,
      label,
      collapsed: false,
    };
    toggle.addEventListener("click", () => {
      this.setClimateCollapsed(name, !this.climatePanels[name].collapsed);
      playHudSound(this.ctx, "pop", { volume: 0.1 });
    });
    this.setClimateCollapsed(
      name,
      hudStorage.get("windhaven.hud." + name + ".collapsed", false) === true,
    );
  }
  setClimateCollapsed(name, collapsed) {
    const panel = this.climatePanels[name];
    if (!panel) return;
    panel.collapsed = !!collapsed;
    panel.content.hidden = panel.collapsed;
    panel.card.classList.toggle("is-collapsed", panel.collapsed);
    panel.toggle.setAttribute("aria-expanded", String(!panel.collapsed));
    panel.toggle.setAttribute(
      "aria-label",
      (panel.collapsed ? "展开" : "收起") + panel.label + "控件",
    );
    panel.toggle.title = panel.toggle.getAttribute("aria-label");
    if (panel.collapsed && panel.content.contains(document.activeElement))
      panel.toggle.focus();
    hudStorage.set("windhaven.hud." + name + ".collapsed", panel.collapsed);
    this.coach?.retarget();
    this.settings?.slow();
  }
  seasonTarget() {
    return this.climatePanels.season?.collapsed
      ? this.climatePanels.season.toggle
      : this.season.el;
  }
  markUse(t) {
    this._uses[t] = hudNow();
  }
  usedRecently(t, e) {
    return hudNow() - (this._uses[t] ?? -1e9) < e;
  }
  _shield(t) {
    const e = (i) => i.stopPropagation();
    for (const i of [
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
      "wheel",
      "click",
      "dblclick",
      "touchstart",
      "touchmove",
    ])
      t.addEventListener(
        i,
        e,
        i === "wheel" || i.startsWith("touch")
          ? {
              passive: !0,
            }
          : !1,
      );
    for (const i of ["contextmenu", "dragstart", "selectstart"])
      t.addEventListener(i, (s) => s.preventDefault());
  }
  _hint(t, e) {
    if (((t = String(t ?? "").trim()), !t || this.coach.text === t)) return;
    const i = hudNow();
    (this._hinted ?? (this._hinted = new Map()),
      !(i - (this._hinted.get(t) ?? -1e9) < 3e4) &&
        (this._hinted.set(t, i), this.toast(t, e || 3600)));
  }
  _key({ key: t, event: e }) {
    if (!t || e?.ctrlKey || e?.metaKey || e?.altKey || e?.repeat) return;
    const i = e?.target?.tagName;
    i === "INPUT" ||
      i === "TEXTAREA" ||
      i === "SELECT" ||
      e?.target?.isContentEditable ||
      (t === "Escape" && this.settings.open && this.settings.setOpen(false));
  }
  _safe(t, e) {
    try {
      e();
    } catch (i) {
      this._errs.has(t) || (this._errs.add(t), console.error(`[hud] ${t}`, i));
    }
  }
  update(t) {
    const e = document.body.classList.contains("no-ui");
    ((this._dt = t),
      this._safe("time", this._frameTime),
      this._safe("season", this._frameSeason),
      this._safe("thermo", this._frameThermo));
    const i = hudNow();
    i - this._lastSlow >= HUD_SLOW_UPDATE_INTERVAL &&
      ((this._lastSlow = i),
      this._safe("coach", this._slowCoach),
      e || this.slow());
  }
  slow() {
    const t = this.ctx.world;
    (this._safe("top", () => this.top.slow()),
      this._safe("camera.slow", () => this.cameraControls.slow()),
      this._safe("time.slow", () => this.time.slow()),
      this._safe("season.slow", () => this.season.slow()),
      this._safe("thermo.slow", () => this.thermo.slow()),
      this._safe("settings.slow", () => this.settings.slow()),
      this._safe("climate", () => {
        this.tempTxt.set(formatTemperature(t.seaLevelTemp ?? 10));
        const e = Math.round(t.tempOffset || 0);
        (this.offTxt.set(e === 0 ? "" : `${e > 0 ? "+" : "−"}${Math.abs(e)}`),
          this.offShow.set(e !== 0));
        const i = describeWeather(t);
        (this.condTxt.set(i), this.condTitle.set(i));
      }));
  }
}
export { HudSystem };
