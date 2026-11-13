async function createVideoEncoder({
  width,
  height,
  fps,
  includeAudio = false,
}) {
  if (
    ![width, height, fps].every((value) => Number.isInteger(value) && value > 0)
  ) {
    throw new Error("视频尺寸和帧率必须是正整数。");
  }
  if (
    typeof VideoEncoder === "undefined" ||
    typeof VideoFrame === "undefined"
  ) {
    throw new Error(
      "当前浏览器无法逐帧编码。请用新版 Chrome 或 Edge 打开本地页面或 HTTPS 页面。",
    );
  }

  // Load the muxer only when entering video capture.
  const {
    AudioBufferSource,
    BufferTarget,
    Output,
    Quality,
    VideoSample,
    VideoSampleSource,
    WebMOutputFormat,
    canEncodeAudio,
    canEncodeVideo,
  } = await import("mediabunny");
  const bitrate = Math.round(
    Math.min(90e6, Math.max(8e6, width * height * fps * 0.19)),
  );
  const quality = new Quality({ bitrate });
  const codecOptions = {
    width,
    height,
    frameRate: fps,
    latencyMode: "quality",
    quality,
  };
  let codec;
  for (const candidate of ["vp9", "vp8"]) {
    if (await canEncodeVideo(candidate, codecOptions)) {
      codec = candidate;
      break;
    }
  }
  if (!codec)
    throw new Error(
      `当前浏览器无法编码 ${width} × ${height}、${fps} 帧/秒的 WebM 视频。`,
    );
  const audioConfig = { codec: "opus", quality: new Quality("high") };
  if (
    includeAudio &&
    !(await canEncodeAudio(audioConfig.codec, {
      numberOfChannels: 2,
      sampleRate: 48000,
      quality: audioConfig.quality,
    }))
  ) {
    throw new Error(
      "当前浏览器无法编码声音。请使用新版 Chrome 或 Edge，或取消勾选山谷声音。",
    );
  }

  let framesAdded = 0;
  let framesEncoded = 0;
  const target = new BufferTarget();
  const output = new Output({ format: new WebMOutputFormat(), target });
  const source = new VideoSampleSource({
    codec,
    quality,
    latencyMode: "quality",
    onEncodedPacket() {
      framesEncoded++;
    },
  });
  output.addVideoTrack(source, { frameRate: fps });
  const audio = includeAudio ? new AudioBufferSource(audioConfig) : null;
  if (audio) output.addAudioTrack(audio);
  await output.start();

  return {
    async addFrame(canvas, index) {
      if (index !== framesAdded) throw new Error("视频帧必须按顺序提交。");
      if (canvas.width !== width || canvas.height !== height) {
        throw new Error("录制期间画布尺寸发生了变化。");
      }
      // Snapshot the WebGL canvas before yielding so its next draw cannot
      // overwrite this frame. Timestamps come from frame numbers alone.
      const sample = new VideoSample(canvas, {
        timestamp: index / fps,
        duration: 1 / fps,
      });
      try {
        await source.add(sample);
        framesAdded++;
      } finally {
        sample.close();
      }
    },
    async finish(audioBuffer) {
      if (framesAdded === 0) throw new Error("视频中还没有可导出的帧。");
      if (audio) {
        if (!audioBuffer) throw new Error("未能生成山谷音轨。");
        await audio.add(audioBuffer);
      }
      await output.finalize();
      if (framesEncoded !== framesAdded || !target.buffer?.byteLength) {
        throw new Error(
          `视频编码不完整（${framesEncoded}/${framesAdded} 帧）。`,
        );
      }
      return new Blob([target.buffer], { type: "video/webm" });
    },
    async close() {
      if (output.state !== "finalized") await output.cancel();
    },
  };
}

export { createVideoEncoder };
