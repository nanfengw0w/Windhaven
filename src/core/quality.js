// Reconstructed module: identifiers and file boundaries are refactor choices.
function probeWebGLRenderer() {
  try {
    const r = document.createElement("canvas"),
      t = r.getContext("webgl2") || r.getContext("webgl");
    if (!t)
      return {
        name: "",
        ok: !1,
      };
    const e = t.getExtension("WEBGL_debug_renderer_info"),
      i = String(
        e
          ? t.getParameter(e.UNMASKED_RENDERER_WEBGL)
          : t.getParameter(t.RENDERER) || "",
      );
    return (
      t.getExtension("WEBGL_lose_context")?.loseContext(),
      {
        name: i,
        ok: !0,
      }
    );
  } catch {
    return {
      name: "",
      ok: !1,
    };
  }
}
function classifyGpuTier(r, t) {
  const e = r.toLowerCase();
  return e
    ? /swiftshader|llvmpipe|software|basic render/.test(e) ||
      /mali|adreno|powervr|videocore|tegra/.test(e)
      ? 0
      : /apple gpu/.test(e)
        ? t
          ? 0
          : 1
        : /nvidia|geforce|rtx|gtx|quadro|radeon rx|radeon pro|rx \d{3,4}|arc a\d/.test(
              e,
            ) || /apple m\d (pro|max|ultra)|apple m[3-9]/.test(e)
          ? 2
          : /apple m\d|apple/.test(e) ||
              /intel|iris|uhd|hd graphics|radeon(tm)? graphics|radeon vega/.test(
                e,
              )
            ? 1
            : null
    : null;
}
class QualityController {
  constructor(t) {
    const e = t.get("quality"),
      i =
        typeof matchMedia == "function" &&
        matchMedia("(pointer: coarse)").matches,
      s =
        /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
        (i &&
          navigator.maxTouchPoints > 1 &&
          Math.min(screen.width, screen.height) < 900),
      n = navigator.hardwareConcurrency || 4,
      o = probeWebGLRenderer();
    let a = classifyGpuTier(o.name, s);
    (a === null && (a = s ? 0 : (n >= 8, 1)),
      s && (a = Math.min(a, 0)),
      e === "low" && (a = 0),
      e === "medium" && (a = 1),
      e === "high" && (a = 2),
      (this.tier = a),
      (this.gpu = o.name),
      (this.mobile = s),
      (this.adaptive = !t.has("quality") && !t.has("shot")),
      this.refreshDpr(),
      (this.dpr = this.maxDpr),
      (this.minDpr = 0.6),
      (this.postLevel = 2),
      (this._acc = 0),
      (this._frames = 0),
      (this._cool = 2.5),
      (this._lowStreak = 0),
      (this.onChange = null),
      (this.onPostLevel = null));
  }
  refreshDpr() {
    const t = this.tier,
      e = window.innerWidth * window.innerHeight,
      i = t === 2 ? 2 : t === 1 ? 1.5 : 1.25,
      s = Math.sqrt((t === 2 ? 42e5 : t === 1 ? 26e5 : 14e5) / Math.max(1, e));
    ((this.maxDpr = Math.max(
      0.75,
      Math.min(window.devicePixelRatio || 1, i, s),
    )),
      this.dpr !== void 0 && (this.dpr = Math.min(this.dpr, this.maxDpr)));
  }
  pick(t, e, i) {
    return this.tier === 0 ? t : this.tier === 1 ? e : i;
  }
  sample(t) {
    if (
      !this.adaptive ||
      t > 0.5 ||
      ((this._acc += t), this._frames++, (this._cool -= t), this._acc < 0.75)
    )
      return;
    const e = this._frames / this._acc;
    if (((this._acc = 0), (this._frames = 0), this._cool > 0)) return;
    let i = this.dpr;
    (e < 50
      ? (i = Math.max(this.minDpr, this.dpr * (e < 35 ? 0.8 : 0.9)))
      : e > 58 &&
        this.dpr < this.maxDpr &&
        (i = Math.min(this.maxDpr, this.dpr * 1.06)),
      Math.abs(i - this.dpr) > 0.01 &&
        ((this.dpr = i), (this._cool = 1.2), this.onChange?.(this.dpr)),
      e < 45 && this.dpr <= this.minDpr + 0.01
        ? ++this._lowStreak >= 3 &&
          this.postLevel > 0 &&
          (this.postLevel--,
          (this._lowStreak = 0),
          (this._cool = 2),
          this.onPostLevel?.(this.postLevel))
        : (this._lowStreak = 0));
  }
}
export { QualityController };
