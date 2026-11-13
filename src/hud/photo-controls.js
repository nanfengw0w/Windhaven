import { createHudElement, parseHudMarkup } from "./dom.js";

const PHOTO_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6l1.5-2h5L16 6h4a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="4"/></svg>';

class PhotoControls {
  constructor(ctx, root, videoButton) {
    this.ctx = ctx;
    this.active = false;
    this.button = createHudElement(
      "button",
      {
        class: "wg-panel wg-photo-button",
        type: "button",
        "aria-label": "拍照模式，快捷键 P",
        "aria-pressed": "false",
        title: "拍照模式（P）· 暂停时间，自由取景",
      },
      [
        parseHudMarkup(PHOTO_ICON),
        createHudElement("span", { text: "拍照模式" }),
        createHudElement("kbd", { text: "P" }),
      ],
    );
    this.button.addEventListener("click", () => this.invoke("enter"));
    root.append(this.button);

    this.saveButton = this.action("保存照片", "capture", "is-primary");
    this.timeButton = this.action("继续时间", "toggleTime");
    this.resetButton = this.action("重置镜头", "resetCamera");
    this.exitButton = this.action("退出拍照", "exit");
    this.videoButton = videoButton;
    this.actions = createHudElement(
      "div",
      {
        class: "wg-photo-actions",
        role: "group",
        "aria-label": "拍照操作",
      },
      [
        this.saveButton,
        this.videoButton,
        this.timeButton,
        this.resetButton,
        this.exitButton,
      ],
    );
    for (const name of [
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
      "wheel",
      "click",
      "dblclick",
    ])
      this.actions.addEventListener(name, (event) => event.stopPropagation());
    this.actions.addEventListener("contextmenu", (event) =>
      event.preventDefault(),
    );
    this.badge = createHudElement("div", {
      class: "wg-photo-badge",
      text: "拍照模式 · 时间已暂停",
      "aria-live": "polite",
    });
    this.overlay = createHudElement(
      "div",
      { class: "wg-photo-overlay", hidden: true },
      [
        this.badge,
        this.actions,
        createHudElement("div", { class: "wg-photo-help" }, [
          createHudElement("p", {
            text: "WASD 移动 · Q 降 / E 升 · Shift 加速",
          }),
          createHudElement("p", {
            text: "右键拖动环顾 · 滚轮变焦 · U 隐藏界面 · P / Esc 退出",
          }),
          createHudElement("p", {
            class: "wg-photo-paused-help",
            text: "天气与时间调整将在继续时间后推进",
          }),
        ]),
      ],
    );
    this.notice = createHudElement("p", {
      class: "wg-photo-notice",
      role: "status",
      "aria-live": "polite",
      hidden: true,
    });
    document.body.append(this.overlay, this.notice);
    ctx.events.on("photo:change", (state) => this.setState(state));
    ctx.events.on("photo:error", ({ message } = {}) =>
      this.showMessage(message || "照片生成失败，请重试。"),
    );
    ctx.events.on("photo:saved", () =>
      this.showMessage("照片已生成，请查看浏览器下载。"),
    );
    this.setState(ctx.photo || {});
  }
  action(text, method, className = "") {
    const button = createHudElement("button", {
      class: "wg-photo-action " + className,
      type: "button",
      text,
    });
    button.addEventListener("click", () => this.invoke(method));
    return button;
  }
  invoke(method) {
    if (this.ctx.photo) this.ctx.photo[method]();
    else this.showMessage("场景尚未准备好，请稍后再试。");
  }
  setState({ active = false, capturing = false, timeRunning = false } = {}) {
    if (active !== this.active) this.clearMessage();
    this.active = active;
    document.body.classList.toggle("photo-active", active);
    this.overlay.hidden = !active;
    this.button.setAttribute("aria-pressed", String(active));
    this.saveButton.disabled = capturing;
    this.videoButton.disabled = capturing;
    this.timeButton.disabled = capturing;
    this.resetButton.disabled = capturing;
    this.timeButton.textContent = timeRunning ? "暂停时间" : "继续时间";
    this.overlay.querySelector(".wg-photo-paused-help").hidden = timeRunning;
    this.badge.textContent = timeRunning
      ? "拍照模式 · 时间运行中"
      : "拍照模式 · 时间已暂停";
    this.saveButton.setAttribute("aria-busy", String(capturing));
    this.saveButton.textContent = capturing ? "正在保存…" : "保存照片";
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
    this.messageTimer = window.setTimeout(() => this.clearMessage(), 6000);
  }
}

export { PhotoControls };
