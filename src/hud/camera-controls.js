import { CAMERA_PRESETS } from "../core/camera.js";
import { createHudElement, playHudSound } from "./dom.js";

const CAMERA_CONTROL_ORDER = [
  "overview",
  "valley",
  "town",
  "lake",
  "cabin",
  "waterfall",
  "summit",
  "bird",
  "follow",
];

class CameraControls {
  constructor(ctx, hud) {
    this.ctx = ctx;
    this.hud = hud;
    this.buttons = new Map();
    this.el = createHudElement("div", { class: "wg-camera-controls" });
    this.list = createHudElement("div", {
      class: "wg-camera-list",
      role: "group",
      "aria-label": "风景镜头",
    });
    this.el.append(this.list);
    for (const id of CAMERA_CONTROL_ORDER) {
      const preset = CAMERA_PRESETS[id];
      if (!preset) continue;
      const description = preset.detail || preset.description || "";
      const button = createHudElement(
        "button",
        {
          class:
            "wg-camera-preset" +
            (id === "follow" || id === "bird" ? " is-follow" : ""),
          type: "button",
          "data-camera": id,
          "aria-pressed": "false",
          "aria-label": preset.label || id,
          title: description,
        },
        [
          createHudElement("span", {
            class: "wg-camera-mark",
            "aria-hidden": "true",
          }),
          // Keep the narrow list to one line per destination. The full
          // description remains available as the button title on hover.
          createHudElement("span", { class: "wg-camera-copy" }, [
            createHudElement("span", {
              class: "wg-camera-name",
              text: preset.label || id,
            }),
          ]),
        ],
      );
      button.addEventListener("click", () => this.selectPreset(id));
      this.buttons.set(id, button);
      (id === "follow" ? this.el : this.list).append(button);
    }
    this.el.addEventListener("keydown", (event) => this._navigate(event));
    hud.createClimateCard("camera", "镜头位置", this.el);
    ctx.events.on("camera:change", () => this.slow());
    ctx.events.on("photo:change", () => this.slow());
    ctx.events.on("exploration:change", () => this.slow());
    this.slow();
  }

  selectPreset(id) {
    const selected = this.ctx.selectCameraPreset
      ? this.ctx.selectCameraPreset(id)
      : this.ctx.cameraRig.preset(id);
    if (selected === false) return;
    this.ctx.cameraRig.poke();
    this.selected = id;
    this.ctx.params.set("cam", id);
    const url = new URL(location.href);
    url.searchParams.set("cam", id);
    history.replaceState(history.state, "", url);
    playHudSound(this.ctx, "pop", { volume: 0.08 });
    this.hud.markUse("camera");
    this.slow();
  }

  _navigate(event) {
    if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const buttons = [...this.buttons.values()].filter(
      (button) => !button.disabled,
    );
    const current = buttons.indexOf(event.target);
    if (current < 0) return;
    event.preventDefault();
    event.stopPropagation();
    const index =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) %
            buttons.length;
    buttons[index].focus({ preventScroll: true });
    buttons[index].scrollIntoView({ block: "nearest" });
  }

  slow() {
    this.selected =
      this.ctx.cameraRig.activePreset !== undefined
        ? this.ctx.cameraRig.activePreset
        : this.selected || this.ctx.params.get("cam") || "overview";
    for (const [id, button] of this.buttons) {
      const active = id === this.selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      button.disabled = !!this.ctx.photo?.cameraLocked;
    }
  }
}

export { CameraControls };
