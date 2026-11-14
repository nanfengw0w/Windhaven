import { VIDEO_MAX_SECONDS } from "../core/config.js";
import { createHudElement, parseHudMarkup } from "./dom.js";

const VIDEO_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3"/></svg>';
const videoSeconds = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 3,
});

function videoAction(text, attrs = {}) {
  return createHudElement("button", {
    class: "wg-photo-action",
    type: "button",
    text,
    ...attrs,
  });
}

function videoField(text, input) {
  return createHudElement("label", { class: "wg-video-field" }, [
    createHudElement("span", { text }),
    input,
  ]);
}

class VideoControls {
  constructor(ctx) {
    this.ctx = ctx;
    this.active = false;
    this.recording = false;
    this.button = createHudElement(
      "button",
      {
        class: "wg-photo-action wg-video-button",
        type: "button",
        "aria-controls": "wg-video-controls",
        "aria-expanded": "false",
        title: "逐帧录像",
      },
      [parseHudMarkup(VIDEO_ICON), createHudElement("span", { text: "录像" })],
    );
    this.fps = createHudElement(
      "select",
      {},
      [24, 30, 60].map((fps) =>
        createHudElement("option", { value: fps, text: `${fps} 帧/秒` }),
      ),
    );
    this.fps.value = "30";
    this.resolution = createHudElement(
      "select",
      {},
      [1080, 1440, 2160].map((height) =>
        createHudElement("option", {
          value: height,
          text: height === 2160 ? "4K" : `${height}p`,
        }),
      ),
    );
    this.resolution.value = "1440";
    this.audio = createHudElement("input", { type: "checkbox", checked: true });
    this.frames = createHudElement("input", {
      type: "number",
      inputmode: "numeric",
      value: 150,
      min: 1,
      step: 1,
      required: true,
    });
    this.summary = createHudElement("p", { class: "wg-video-summary" });
    this.startButton = videoAction("开始录制", {
      type: "submit",
      class: "wg-photo-action is-primary",
    });
    this.closeButton = videoAction("返回拍照");
    this.cancelButton = videoAction("取消录制");
    this.download = createHudElement("a", {
      class: "wg-photo-action is-primary wg-video-download",
      text: "下载视频",
      hidden: true,
    });
    this.progressText = createHudElement("p", { class: "wg-video-summary" });
    this.progress = createHudElement("progress", {
      "aria-label": "已渲染帧数",
      value: 0,
    });
    this.progressPane = createHudElement(
      "div",
      { class: "wg-video-progress", hidden: true },
      [
        this.progressText,
        this.progress,
        this.cancelButton,
        createHudElement("p", {
          class: "wg-video-help",
          text: "拖动空白处环绕 · 中键平移 · 滚轮缩放",
        }),
      ],
    );
    this.message = createHudElement("p", {
      class: "wg-video-notice",
      role: "status",
      hidden: true,
    });
    this.settings = createHudElement("form", { class: "wg-video-settings" }, [
      createHudElement("div", { class: "wg-video-fields" }, [
        videoField("输出帧率", this.fps),
        videoField("总帧数", this.frames),
        videoField("分辨率", this.resolution),
        createHudElement("label", { class: "wg-video-audio" }, [
          this.audio,
          createHudElement("span", { text: "山谷声音" }),
        ]),
      ]),
      this.summary,
      this.startButton,
      createHudElement("p", {
        class: "wg-video-help",
        text: "开始录制后使用山谷的默认操作。",
      }),
    ]);
    this.heading = createHudElement("h2", {
      id: "wg-video-heading",
      text: "录像",
      tabindex: -1,
    });
    this.overlay = createHudElement(
      "section",
      {
        id: "wg-video-controls",
        class: "wg-video-controls",
        "aria-labelledby": this.heading.id,
        hidden: true,
      },
      [
        createHudElement("div", { class: "wg-video-head" }, [
          this.heading,
          this.closeButton,
        ]),
        this.settings,
        this.progressPane,
        this.message,
        this.download,
      ],
    );
    document.body.append(this.overlay);

    this.button.addEventListener("click", () => this.ctx.video?.enter());
    this.closeButton.addEventListener("click", () => this.ctx.video?.exit());
    this.cancelButton.addEventListener("click", () => this.ctx.video?.cancel());
    this.fps.addEventListener("change", () => this.syncSettings(true));
    this.frames.addEventListener("input", () => this.syncSettings());
    this.settings.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.recording || !this.frames.validity.valid) return;
      this.ctx.video?.start({
        fps: Number(this.fps.value),
        totalFrames: this.frames.valueAsNumber,
        resolution: Number(this.resolution.value),
        includeAudio: this.audio.checked,
      });
    });
    for (const name of [
      "pointerdown",
      "pointerup",
      "pointermove",
      "wheel",
      "click",
      "dblclick",
    ]) {
      this.overlay.addEventListener(name, (event) => event.stopPropagation());
    }
    this.overlay.addEventListener("contextmenu", (event) =>
      event.preventDefault(),
    );
    ctx.events.on("video:change", (state) => this.setState(state));
    this.syncSettings();
  }

  syncSettings(clampFrames = false) {
    const fps = Number(this.fps.value);
    const max = VIDEO_MAX_SECONDS * fps;
    this.frames.max = max;
    if (clampFrames && this.frames.valueAsNumber > max) this.frames.value = max;
    const valid = this.frames.validity.valid;
    this.startButton.disabled = !valid;
    this.summary.textContent = valid
      ? `成片 ${videoSeconds.format(this.frames.valueAsNumber / fps)} 秒 · 上限 ${max} 帧`
      : `请输入 1–${max} 帧`;
  }

  setState({
    active = false,
    recording = false,
    completedFrames = 0,
    totalFrames = 0,
    finishing = false,
    phase,
    message,
    downloadUrl,
    filename,
    width,
    height,
  } = {}) {
    const entering = active && !this.active;
    const leaving = !active && this.active;
    const starting = recording && !this.recording;
    const completed = !recording && this.recording;
    const canDownload = !recording && Boolean(downloadUrl);
    this.active = active;
    this.recording = recording;
    document.body.classList.toggle("video-active", active);
    document.body.classList.toggle("video-recording", recording);
    this.button.setAttribute("aria-expanded", String(active));
    this.overlay.hidden = !active;
    this.settings.hidden = recording;
    this.closeButton.hidden = recording;
    this.progressPane.hidden = !recording;
    this.progress.max = totalFrames || 1;
    this.progress.value = completedFrames;
    this.progressText.textContent =
      finishing || phase === "encoding"
        ? "正在生成视频文件…"
        : phase === "preparing"
          ? "正在准备录制…"
          : `已渲染 ${completedFrames} / ${totalFrames} 帧`;
    this.message.hidden = !message;
    this.message.textContent = message || "";
    this.download.hidden = !canDownload;
    if (canDownload) {
      this.download.href = downloadUrl;
      this.download.download = filename || "windhaven.webm";
      this.download.textContent =
        width && height ? `下载视频 · ${width} × ${height}` : "下载视频";
    } else {
      this.download.removeAttribute("href");
    }
    if (message && !active) this.ctx.modules.hud?.toast(message);
    if (entering) this.heading.focus({ preventScroll: true });
    if (leaving && this.button.getClientRects().length)
      this.button.focus({ preventScroll: true });
    if (starting) this.cancelButton.focus({ preventScroll: true });
    if (active && completed)
      (canDownload ? this.download : this.startButton).focus({
        preventScroll: true,
      });
  }
}

export { VideoControls };
