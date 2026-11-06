// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeVector3 } from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { getTreeRegistry } from "../vegetation/tree-registry.js";
const clampLightningTarget = (r, t, e) => (r < t ? t : r > e ? e : r);
function pickCloudLightningTarget(r, t, e, i, s) {
  const n = getTreeRegistry(r).entries;
  let o = null,
    a = -1 / 0;
  for (const { plant: v } of n) {
    const g = Math.hypot(v.x - t, v.z - e);
    if (g > i) continue;
    const m = (v.y ?? 0) + (v.height ?? 0.5) - g * 0.35 + s() * 0.35;
    m > a && ((a = m), (o = v));
  }
  const l = r.terrain.shape,
    c = l.highestNear(t, e, i * 0.85, 20);
  if (o) {
    const v = (o.y ?? 0) + (o.height ?? 0.5);
    if (v + 0.25 > c.y)
      return {
        point: new ThreeVector3(o.x, v, o.z),
        kind: "tree",
        tree: o,
      };
  }
  const h = clampLightningTarget(
      c.x + (s() - 0.5) * 0.3,
      -LANDSCAPE_BOUNDS.halfW + 0.2,
      LANDSCAPE_BOUNDS.halfW - 0.2,
    ),
    f = clampLightningTarget(
      c.z + (s() - 0.5) * 0.3,
      -LANDSCAPE_BOUNDS.halfD + 0.2,
      LANDSCAPE_BOUNDS.halfD - 0.2,
    );
  let u = r.terrain.height(h, f),
    d = "ground";
  const p = r.world.lakeLevel;
  return (
    l.isWater(h, f, p) && u < p + 0.05 && ((u = Math.max(u, p)), (d = "water")),
    {
      point: new ThreeVector3(h, u, f),
      kind: d,
      tree: null,
    }
  );
}
const lightningPathDirectionScratch = new ThreeVector3();
const lightningPathTangentScratch = new ThreeVector3();
const lightningPathBitangentScratch = new ThreeVector3();
const LIGHTNING_PATH_UP = new ThreeVector3(0, 1, 0);
function subdivideLightningPath(r, t, e, i, s) {
  let n = [r.clone(), t.clone()],
    o = i;
  for (let a = 0; a < e; a++) {
    const l = [n[0]];
    for (let c = 0; c < n.length - 1; c++) {
      const h = n[c],
        f = n[c + 1],
        u = h.distanceTo(f);
      (lightningPathDirectionScratch.subVectors(f, h).normalize(),
        lightningPathTangentScratch.crossVectors(
          lightningPathDirectionScratch,
          LIGHTNING_PATH_UP,
        ),
        lightningPathTangentScratch.lengthSq() < 1e-6 &&
          lightningPathTangentScratch.set(1, 0, 0),
        lightningPathTangentScratch.normalize(),
        lightningPathBitangentScratch
          .crossVectors(
            lightningPathDirectionScratch,
            lightningPathTangentScratch,
          )
          .normalize());
      const d = h.clone().lerp(f, 0.4 + s() * 0.2),
        p = (s() - 0.5) * 2 * o * u,
        v = (s() - 0.5) * 2 * o * u;
      (d
        .addScaledVector(lightningPathTangentScratch, p)
        .addScaledVector(lightningPathBitangentScratch, v),
        l.push(d, f));
    }
    ((n = l), (o *= 0.62));
  }
  return n;
}
function createBranchedLightningPath(
  r,
  t,
  e,
  i,
  { levels: s = 5, branches: n = 3 } = {},
) {
  const o = subdivideLightningPath(t, e, s, 0.32, i),
    a = [],
    l = o.length,
    c = Math.max(0, Math.round(n * (0.6 + i() * 0.8)));
  for (let h = 0; h < c; h++) {
    const f = Math.floor(l * (0.1 + i() * 0.55)),
      u = o[f],
      d = (u.y - e.y) * (0.25 + i() * 0.35),
      p = i() * Math.PI * 2,
      v = d * (0.5 + i() * 0.6),
      g = new ThreeVector3(
        u.x + Math.cos(p) * v,
        u.y - d,
        u.z + Math.sin(p) * v,
      );
    ((g.x = clampLightningTarget(
      g.x,
      -LANDSCAPE_BOUNDS.halfW + 0.1,
      LANDSCAPE_BOUNDS.halfW - 0.1,
    )),
      (g.z = clampLightningTarget(
        g.z,
        -LANDSCAPE_BOUNDS.halfD + 0.1,
        LANDSCAPE_BOUNDS.halfD - 0.1,
      )),
      (g.y = Math.max(g.y, r.terrain.height(g.x, g.z) + 0.15)),
      a.push(subdivideLightningPath(u, g, Math.max(2, s - 2), 0.38, i)));
  }
  return {
    points: o,
    branches: a,
  };
}
export { createBranchedLightningPath, pickCloudLightningTarget };
