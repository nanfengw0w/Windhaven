// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeVector3 } from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "./config.js";
import { clamp } from "./math.js";
function registerWindTool(r) {
  const { input: t, wind: e, events: i } = r,
    s = new ThreeVector3(),
    n = new ThreeVector3();
  let o = !1,
    a = 0;
  function l(c) {
    return t.rayToTerrain(c) ? ((c.y += 0.4), c) : t.rayToPlaneY(1.2, c);
  }
  t.addHandler({
    name: "wind-tool",
    priority: 5,
    tools: ["wind"],
    cursor: "crosshair",
    activeCursor: "crosshair",
    hitTest() {
      return {
        distance: 1e6,
      };
    },
    onDown() {
      return (
        (o = !!l(s)),
        (a = performance.now()),
        i.emit("wind:start", {}),
        !0
      );
    },
    onMove() {
      if (!l(n)) return;
      const c = performance.now(),
        h = Math.max(0.008, (c - a) / 1e3);
      if (((a = c), !o)) {
        (s.copy(n), (o = !0));
        return;
      }
      const f = n.x - s.x,
        u = n.z - s.z,
        d = Math.hypot(f, u);
      if (d < 1e-4) return;
      const p = clamp((d / h) * 0.9, 0, 9),
        v = (f / d) * p,
        g = (u / d) * p,
        x = Math.min(12, Math.ceil(d / 0.2));
      for (let m = 1; m <= x; m++) {
        const w = m / x,
          y = clamp(
            s.x + f * w,
            -LANDSCAPE_BOUNDS.halfW,
            LANDSCAPE_BOUNDS.halfW,
          ),
          _ = clamp(
            s.z + u * w,
            -LANDSCAPE_BOUNDS.halfD,
            LANDSCAPE_BOUNDS.halfD,
          );
        e.addForce(y, _, v, g, 0.9, 0.55);
      }
      (i.emit("wind:stroke", {
        x: n.x,
        y: n.y,
        z: n.z,
        vx: v,
        vz: g,
        strength: p / 9,
      }),
        s.copy(n));
    },
    onUp() {
      ((o = !1), i.emit("wind:end", {}));
    },
  });
}
export { registerWindTool };
