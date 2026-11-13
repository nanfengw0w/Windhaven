const CAPTURE_SAMPLE_RATE = 48000;
const CAPTURE_PREROLL_SECONDS = 1.5;
const AMBIENCE_UPDATE_STEP = 0.05;

class OfflineAudioCapture {
  constructor({ fps, totalFrames }) {
    const AudioContext = globalThis.OfflineAudioContext;
    if (!AudioContext) throw new Error("当前浏览器无法导出场景声音。");
    this.dt = 1 / fps;
    this.length = Math.round((totalFrames * CAPTURE_SAMPLE_RATE) / fps);
    this.prerollLength = CAPTURE_PREROLL_SECONDS * CAPTURE_SAMPLE_RATE;
    this.context = new AudioContext(
      2,
      this.length + this.prerollLength,
      CAPTURE_SAMPLE_RATE,
    );
    this.time = 0;
  }

  prime(update) {
    // Establish the current ambience before the first exported sample.
    const steps = Math.round(CAPTURE_PREROLL_SECONDS / AMBIENCE_UPDATE_STEP);
    for (let index = 0; index < steps; index++) {
      this.time = index * AMBIENCE_UPDATE_STEP;
      update(AMBIENCE_UPDATE_STEP);
    }
    this.time = CAPTURE_PREROLL_SECONDS;
  }

  sample(index, update) {
    this.time = CAPTURE_PREROLL_SECONDS + index * this.dt;
    update(this.dt);
    // Scene events between samples, including those during the next world
    // step, belong to the next rendered frame's timestamp.
    this.time = CAPTURE_PREROLL_SECONDS + (index + 1) * this.dt;
  }

  async finish() {
    const rendered = await this.context.startRendering();
    const audio = this.context.createBuffer(
      2,
      this.length,
      CAPTURE_SAMPLE_RATE,
    );
    for (let channel = 0; channel < 2; channel++) {
      audio.copyToChannel(
        rendered.getChannelData(channel).subarray(this.prerollLength),
        channel,
      );
    }
    return audio;
  }
}

export { OfflineAudioCapture };
