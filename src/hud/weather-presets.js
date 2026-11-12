import { createHudElement, parseHudMarkup } from "./dom.js";
import { HUD_ICONS } from "./icons.js";

const WEATHER_PRESET_BUTTONS = [
  { name: "calm", label: "晴朗春日", icon: "summer" },
  { name: "rain", label: "雨天", icon: "rain" },
  { name: "storm", label: "雷暴", icon: "storm" },
  { name: "snow", label: "冬日飘雪", icon: "flake" },
  { name: "meteor", label: "流星雨", icon: "meteor" },
  { name: "migration", label: "秋暮雁阵", icon: "migration" },
  { name: "lanterns", label: "孔明灯", icon: "lanterns" },
];

class WeatherPresets {
  constructor(ctx, hud, root) {
    this.ctx = ctx;
    this.hud = hud;
    this.buttons = new Map();
    this.el = createHudElement("div", {
      class: "wg-panel wg-weather-presets",
      role: "group",
      "aria-label": "天气场景",
    });
    for (const { name, label, icon } of WEATHER_PRESET_BUTTONS) {
      const button = createHudElement(
        "button",
        {
          class: "wg-weather-preset",
          type: "button",
          "data-weather": name,
          "aria-pressed": "false",
          "aria-label": label,
          title: label,
        },
        [
          parseHudMarkup(HUD_ICONS[icon]),
          createHudElement("span", { class: "wg-weather-label", text: label }),
        ],
      );
      button.addEventListener("click", () => this.select(name));
      this.buttons.set(name, button);
      this.el.append(button);
    }
    ctx.events.on("weather:change", ({ name }) => this.setActive(name));
    this.setActive(ctx.weather.currentScenario);
    root.append(this.el);
  }
  select(name) {
    this.hud.time.glide = null;
    this.hud.time.target = null;
    this.hud.thermo.target = null;
    if (this.ctx.weather.select(name) === false) return;
    const url = new URL(location.href);
    url.searchParams.set("scenario", this.ctx.weather.currentScenario);
    this.ctx.params.set("scenario", this.ctx.weather.currentScenario);
    for (const key of [
      "weather",
      "season",
      "time",
      "temp",
      "dayCycle",
      "seasonCycle",
    ]) {
      url.searchParams.delete(key);
      this.ctx.params.delete(key);
    }
    history.replaceState(history.state, "", url);
    this.setActive(this.ctx.weather.currentScenario);
    this.hud.slow();
  }
  setActive(name) {
    for (const [key, button] of this.buttons) {
      const selected = key === name;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    }
  }
}

export { WeatherPresets };
