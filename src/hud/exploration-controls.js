import { createHudElement, parseHudMarkup } from "./dom.js";

const EXPLORATION_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="14" cy="4" r="2"/><path d="m7 12 3-4 4 1 3 4h3M10 8l-1 8-4 5m6-9 4 4v5"/></svg>';

class ExplorationControls {
  constructor(ctx, root) {
    this.ctx = ctx;
    this.climateControls = [
      ...root.querySelectorAll(".wg-dock, .wg-weather-presets"),
    ];
    this.inertBeforeLock = null;
    this.supported =
      typeof ctx.renderer.domElement.requestPointerLock === "function";
    this.button = createHudElement(
      "button",
      {
        class: "wg-panel wg-exploration-button",
        type: "button",
        "aria-label":
          "步行探索，WASD 移动，Shift 加速，空格跳跃，右键操作界面，Esc 返回",
        "aria-pressed": "false",
        title: this.supported
          ? "从主人公位置进入第一人称 · 上帝视角可左键拖拽主人公 · WASD 移动 · Shift 加速 · 空格跳跃 · Esc 返回"
          : "此浏览器不支持步行探索，请使用支持鼠标锁定的桌面浏览器。",
        disabled: !this.supported,
      },
      [
        parseHudMarkup(EXPLORATION_ICON),
        createHudElement("span", { text: "步行探索" }),
      ],
    );
    this.button.addEventListener("click", () => {
      // Keep the request in this click's user activation for pointer lock.
      const exploration = this.ctx.exploration;
      if (exploration) exploration.enter();
      else this.showMessage("场景尚未准备好，请稍后再试。");
    });
    root.append(this.button);

    this.help = createHudElement("p", {
      class: "wg-exploration-help",
      role: "status",
      text: "WASD 移动 · Shift 加速 · 空格跳跃 · 右键操作界面 · U 隐藏界面 · Esc 返回",
    });
    this.overlay = createHudElement(
      "div",
      { class: "wg-exploration-overlay", hidden: true },
      [
        createHudElement("span", {
          class: "wg-exploration-reticle",
          "aria-hidden": "true",
        }),
        this.help,
      ],
    );
    this.notice = createHudElement("p", {
      class: "wg-exploration-notice",
      role: "status",
      "aria-live": "polite",
      hidden: true,
    });
    document.body.append(this.overlay, this.notice);
    ctx.events.on("exploration:change", (state) => this.setState(state));
    ctx.events.on("exploration:error", ({ message } = {}) => {
      this.showMessage(message || "无法进入步行探索，请再次点击尝试。");
    });
    this.setState(ctx.exploration || {});
  }
  setState({ active = false, pending = false, cursorFree = false } = {}) {
    document.body.classList.toggle("exploration-active", active);
    document.body.classList.toggle(
      "exploration-cursor-free",
      active && cursorFree,
    );
    this.overlay.hidden = !active;
    this.help.textContent = cursorFree
      ? "点击场景继续探索 · U 隐藏界面 · Esc 返回"
      : "WASD 移动 · Shift 加速 · 空格跳跃 · 右键操作界面 · U 隐藏界面 · Esc 返回";
    this.button.disabled = !this.supported || pending;
    this.button.setAttribute("aria-pressed", String(active));
    this.button.setAttribute("aria-busy", String(pending));
    if (active && !cursorFree) {
      this.inertBeforeLock ??= this.climateControls.map((element) => [
        element,
        element.inert,
      ]);
      for (const element of this.climateControls) element.inert = true;
    } else if (this.inertBeforeLock) {
      for (const [element, inert] of this.inertBeforeLock)
        element.inert = inert;
      this.inertBeforeLock = null;
    }
    if (active) this.clearMessage();
  }
  clearMessage() {
    window.clearTimeout(this.messageTimer);
    this.notice.hidden = true;
    this.notice.textContent = "";
  }
  showMessage(message) {
    this.clearMessage();
    this.notice.textContent = message;
    this.notice.hidden = false;
    this.messageTimer = window.setTimeout(() => this.clearMessage(), 7000);
  }
}

export { ExplorationControls };
