// Reconstructed module: identifiers and file boundaries are refactor choices.
class FrameProfiler {
  constructor() {
    ((this.acc = new Map()),
      (this.t0 = new Map()),
      (this.frames = 0),
      (this.steps = 0),
      (this.calls = 0),
      (this.tris = 0),
      (this.lastCalls = 0),
      (this.lastTris = 0));
  }
  tick() {
    this.steps++;
  }
  begin(t) {
    this.t0.set(t, performance.now());
  }
  end(t) {
    const e = this.t0.get(t);
    e !== void 0 &&
      this.acc.set(t, (this.acc.get(t) || 0) + performance.now() - e);
  }
  frame(t) {
    (this.frames++,
      (this.lastCalls = t.render.calls),
      (this.lastTris = t.render.triangles),
      (this.calls += this.lastCalls),
      (this.tris += this.lastTris));
  }
  report() {
    const t = Math.max(1, this.steps),
      e = Math.max(1, this.frames),
      i = {
        frames: this.frames,
        steps: this.steps,
        drawCalls: Math.round(this.calls / e),
        triangles: Math.round(this.tris / e),
        ms: {},
      };
    let s = 0;
    for (const [n, o] of this.acc) {
      const a = n === "render" || n === "beforeRender" ? e : t;
      ((i.ms[n] = +(o / a).toFixed(3)), n !== "render" && (s += o / a));
    }
    return (
      (i.cpuUpdateMs = +s.toFixed(3)),
      this.acc.clear(),
      (this.frames = 0),
      (this.steps = 0),
      (this.calls = 0),
      (this.tris = 0),
      i
    );
  }
}
class PerformanceOverlay {
  constructor(profiler, ctx = null) {
    this.prof = profiler;
    this.ctx = ctx;
    this.frames = [];
    this.elapsed = 0;
    this.history = [];
    this.sequence = 0;
    this.skipNext = true;
    this.el = document.createElement("section");
    this.el.id = "performance-stats";
    this.el.setAttribute("aria-label", "Performance statistics");
    this.el.style.cssText =
      "position:fixed;left:8px;bottom:8px;z-index:50;font:11px/1.35 ui-monospace,Menlo,monospace;color:#d8f0d8;background:rgba(0,0,0,.78);padding:6px 8px;border-radius:6px;max-width:calc(100vw - 32px)";
    this.summary = document.createElement("pre");
    this.summary.id = "performance-summary";
    this.summary.style.cssText = "margin:0;white-space:pre-wrap";
    this.summary.textContent = "Performance: collecting visible frames…";
    const details = document.createElement("details");
    details.open = true;
    const label = document.createElement("summary");
    label.textContent = "Performance sample JSON (last 5 windows)";
    label.style.cursor = "pointer";
    this.data = document.createElement("pre");
    this.data.id = "performance-samples";
    this.data.setAttribute("aria-label", "Performance samples JSON");
    this.data.style.cssText =
      "margin:4px 0 0;max-height:88px;overflow:auto;white-space:pre-wrap;max-width:680px";
    this.data.textContent = "[]";
    details.append(label, this.data);
    this.el.append(this.summary, details);
    document.body.appendChild(this.el);
    document.addEventListener("visibilitychange", () => {
      this.frames.length = 0;
      this.elapsed = 0;
      this.skipNext = true;
      this.prof.report();
    });
  }
  update(dt, dpr) {
    // A resumed RAF includes time spent hidden; never count that interval.
    if (document.hidden || this.skipNext || !Number.isFinite(dt) || dt <= 0) {
      this.skipNext = document.hidden;
      this.frames.length = 0;
      this.elapsed = 0;
      this.prof.report();
      return;
    }
    this.frames.push(dt * 1000);
    this.elapsed += dt;
    if (this.elapsed < 2 && this.frames.length < 300) return;
    const report = this.prof.report();
    const sorted = [...this.frames].sort((a, b) => a - b);
    const canvas = this.ctx?.renderer.domElement;
    const rect = canvas?.getBoundingClientRect();
    const gl = this.ctx?.renderer.getContext();
    const round = (value) => +value.toFixed(3);
    const sample = {
      sequence: ++this.sequence,
      elapsedPageMs: Math.round(performance.now()),
      windowMs: round(this.elapsed * 1000),
      samples: this.frames.length,
      fps: round(this.frames.length / this.elapsed),
      frameMeanMs: round((this.elapsed * 1000) / this.frames.length),
      frameP95Ms: round(sorted[Math.ceil(sorted.length * 0.95) - 1]),
      frameWorstMs: round(sorted[sorted.length - 1]),
      cpuUpdateMs: report.cpuUpdateMs,
      cpuSubmissionMs: report.ms.render || 0,
      drawCalls: report.drawCalls,
      triangles: report.triangles,
      dpr: round(dpr),
      devicePixelRatio: window.devicePixelRatio,
      canvasCss: rect ? [round(rect.width), round(rect.height)] : null,
      drawingBuffer: gl
        ? [gl.drawingBufferWidth, gl.drawingBufferHeight]
        : null,
      gpu: this.ctx?.quality.gpu || "Unavailable",
      qualityTier: this.ctx?.quality.tier ?? null,
      adaptive: this.ctx?.quality.adaptive ?? null,
      postLevel: this.ctx?.quality.postLevel ?? null,
      postprocessing: this.ctx?.post
        ? {
            tiltX: {
              enabled: this.ctx.post.tiltX.enabled,
              focus: this.ctx.post.tiltX.uniforms.uFocus.value,
              band: this.ctx.post.tiltX.uniforms.uBand.value,
              amount: this.ctx.post.tiltX.uniforms.uAmount.value,
            },
            tiltY: {
              enabled: this.ctx.post.tiltY.enabled,
              focus: this.ctx.post.tiltY.uniforms.uFocus.value,
              band: this.ctx.post.tiltY.uniforms.uBand.value,
              amount: this.ctx.post.tiltY.uniforms.uAmount.value,
            },
            bloom: { enabled: this.ctx.post.bloom.enabled },
          }
        : null,
      landscapeVegetation: this.ctx?.modules.landscapeVegetation?.stats
        ? structuredClone(this.ctx.modules.landscapeVegetation.stats)
        : null,
      cpuModulesMs: report.ms,
    };
    // These are RAF intervals and CPU submission times, not GPU timer queries.
    this.history.push(sample);
    if (this.history.length > 5) this.history.shift();
    this.data.textContent = JSON.stringify(this.history, null, 2);
    const topModules = Object.entries(report.ms)
      .filter(([name]) => name !== "render")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, ms]) => `${name} ${ms.toFixed(2)}`)
      .join("  ");
    this.summary.textContent = `${sample.fps.toFixed(1)} fps  mean ${sample.frameMeanMs.toFixed(1)}ms  p95 ${sample.frameP95Ms.toFixed(1)}ms (${sample.samples} frames)
CPU update ${sample.cpuUpdateMs.toFixed(2)}ms  submit ${sample.cpuSubmissionMs.toFixed(2)}ms  draws ${sample.drawCalls}  tris ${(sample.triangles / 1e6).toFixed(2)}M
buffer ${sample.drawingBuffer?.join("×") || "?"} / CSS ${sample.canvasCss?.join("×") || "?"}  DPR ${dpr.toFixed(2)}
GPU ${sample.gpu}
${topModules}`;
    this.frames.length = 0;
    this.elapsed = 0;
  }
}
export { FrameProfiler, PerformanceOverlay };
