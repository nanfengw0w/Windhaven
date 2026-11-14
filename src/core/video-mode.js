import { createVideoEncoder } from "../render/video-encoder.js";
import { VIDEO_MAX_SECONDS } from "./config.js";

const VIDEO_FRAME_RATES = [24, 30, 60];
const VIDEO_RESOLUTIONS = [1080, 1440, 2160];

function videoDimensions(aspect, resolution) {
  const landscape = aspect >= 1;
  const maxWidth = resolution * (landscape ? 16 / 9 : 1);
  const maxHeight = resolution * (landscape ? 1 : 16 / 9);
  return {
    width: Math.max(
      2,
      Math.round(Math.min(maxWidth, maxHeight * aspect) / 2) * 2,
    ),
    height: Math.max(
      2,
      Math.round(Math.min(maxHeight, maxWidth / aspect) / 2) * 2,
    ),
  };
}

class VideoModeController {
  constructor(ctx, stepSimulation, renderFrame, restoreViewport) {
    this.ctx = ctx;
    this.canvas = ctx.renderer.domElement;
    this.stepSimulation = stepSimulation;
    this.renderFrame = renderFrame;
    this.restoreViewport = restoreViewport;
    this.active = false;
    this.job = null;
    this.download = null;
  }

  get recording() {
    return this.job !== null;
  }
  get usingSceneControls() {
    return this.job?.phase === "recording";
  }

  emit(message = "") {
    const { job, download } = this;
    this.ctx.events.emit("video:change", {
      active: this.active,
      recording: this.recording,
      phase: job?.phase,
      finishing: job?.phase === "encoding",
      completedFrames: job?.completedFrames ?? 0,
      totalFrames: job?.totalFrames ?? 0,
      message,
      downloadUrl: job ? undefined : download?.url,
      filename: job ? undefined : download?.filename,
      ...(job?.size ?? download?.size),
    });
  }

  enter() {
    if (this.active || !this.ctx.photo.active || this.ctx.photo.capturing)
      return;
    this.active = true;
    this.emit();
  }

  exit() {
    if (!this.active) return;
    this.cancel();
    this.active = false;
    this.emit();
  }

  async start({ fps, totalFrames, resolution = 1440, includeAudio = true }) {
    if (!this.active || this.recording) return;
    if (
      !VIDEO_FRAME_RATES.includes(fps) ||
      !Number.isInteger(totalFrames) ||
      totalFrames < 1 ||
      totalFrames > fps * VIDEO_MAX_SECONDS
    ) {
      this.emit(`请输入有效的帧率和帧数，成片最长 ${VIDEO_MAX_SECONDS} 秒。`);
      return;
    }
    if (!VIDEO_RESOLUTIONS.includes(resolution)) {
      this.emit("请选择有效的视频分辨率。");
      return;
    }
    const size = videoDimensions(this.ctx.camera.aspect, resolution);
    const job = {
      dt: 1 / fps,
      totalFrames,
      completedFrames: 0,
      size,
      phase: "preparing",
      pending: false,
      photoTimeRunning: this.ctx.photo.timeRunning,
    };
    this.job = job;
    this.ctx.photo.setCaptureLocked(true, true);
    this.emit();
    try {
      const { width, height } = size;
      const maxTextureSize = this.ctx.renderer.capabilities.maxTextureSize;
      if (width > maxTextureSize || height > maxTextureSize)
        throw new Error("当前显卡无法渲染该分辨率，请选择较低的分辨率。");
      const encoder = await createVideoEncoder({ ...size, fps, includeAudio });
      if (this.job !== job) {
        await encoder.close();
        return;
      }
      job.encoder = encoder;
      if (includeAudio) {
        if (!this.ctx.audio) throw new Error("山谷音频尚未准备好。");
        job.audio = this.ctx.audio.createCapture({ fps, totalFrames });
      }
      job.savedBloom = this.ctx.post.bloom.enabled;
      job.viewportChanged = true;
      this.ctx.post.bloom.enabled = true;
      this.ctx.post.setSize(width, height, 1);
      this.ctx.camera.aspect = width / height;
      this.ctx.camera.updateProjectionMatrix();
      this.ctx.photo.beginSceneControls();
      job.phase = "recording";
      this.ctx.input.setEnabled(true);
      this.emit();
    } catch (error) {
      this.fail(job, error);
    }
  }

  // The normal frame loop yields while the encoder is busy. Each accepted
  // frame advances the same fixed interval, independently of wall-clock time.
  captureFrame() {
    const job = this.job;
    if (!job || job.pending || job.phase !== "recording") return;
    job.pending = true;
    void this.writeFrame(job);
  }

  async writeFrame(job) {
    try {
      const index = job.completedFrames;
      if (index > 0) this.stepSimulation(job.dt);
      this.renderFrame(index === 0 ? 0 : job.dt);
      job.audio?.sample(index);
      await job.encoder.addFrame(this.canvas, index);
      if (this.job !== job) return;
      job.completedFrames++;
      if (job.completedFrames < job.totalFrames) {
        job.pending = false;
        this.emit();
        return;
      }
      // The final frame occupies one interval, just like the others.
      this.stepSimulation(job.dt);
      job.phase = "encoding";
      this.ctx.input.setEnabled(false);
      this.emit();
      const audioBuffer = await job.audio?.finish();
      if (this.job !== job) return;
      const blob = await job.encoder.finish(audioBuffer);
      if (this.job !== job) return;
      const url = URL.createObjectURL(blob);
      if (this.download) URL.revokeObjectURL(this.download.url);
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      this.download = {
        url,
        filename: `windhaven-${stamp}.webm`,
        size: job.size,
      };
      this.finish(job, "视频已生成，可以下载。");
    } catch (error) {
      this.fail(job, error);
    }
  }

  finish(job, message) {
    if (this.job !== job) return;
    this.job = null;
    this.ctx.input.setEnabled(false);
    job.audio?.close();
    if (job.viewportChanged) {
      this.ctx.post.bloom.enabled = job.savedBloom;
      this.restoreViewport();
      this.ctx.photo.endSceneControls();
    }
    this.ctx.photo.setCaptureLocked(false, job.photoTimeRunning);
    this.emit(message);
  }

  fail(job, error) {
    if (this.job !== job) return;
    console.warn("[video] Capture failed", error);
    this.cancel(error?.message || "视频生成失败，请重试。");
  }

  cancel(message = "已取消录制。") {
    const job = this.job;
    if (!job) return;
    this.finish(job, message);
    void job.encoder?.close().catch(() => {});
  }
}

export { VideoModeController };
