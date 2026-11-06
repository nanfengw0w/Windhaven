// Cloud advection, bounds, collisions and merges. The owning CloudSystem keeps all state.
import { CLOUD_LAYER_HEIGHTS, LANDSCAPE_BOUNDS } from "../core/config.js";
import {
  CLOUD_CEILING_Y,
  CLOUD_MAX_BODY_PUFFS,
  createCloudPuffLayout,
} from "./body.js";
import {
  clampCloudSystem,
  saturateCloudSystem,
  smoothstepCloudSystem,
  dampCloudSystem,
} from "./math.js";
function cloudWallWindFactor(r, t, e) {
  const i = t > 0 ? e - r : e + r;
  if (i > 1.8) return 1;
  const s = saturateCloudSystem(i / 1.8);
  return -0.15 + 1.15 * s * s;
}
function advanceCloudMotion(system, t, e, i) {
  const { ctx: s } = system,
    n = t.position,
    o = t.velocity;
  if (
    ((t.age += e),
    (t.fade = t.dissolving
      ? Math.max(0, t.fade - e * 0.7)
      : t.weatherFade !== undefined
        ? clampCloudSystem(t.weatherFade, 0, 1)
        : Math.min(1, t.fade + e * 1.6)),
    t.grabbed && system.grab?.cloud === t)
  ) {
    const v = system.grab.target;
    ((o.x += ((v.x - n.x) * 48 - o.x * 10.5) * e),
      (o.z += ((v.z - n.z) * 48 - o.z * 10.5) * e),
      (o.y += ((system.grab.y - n.y) * 30 - o.y * 9) * e));
  } else {
    const v = s.wind.sample(n.x, n.z, system._w2, 1),
      g = LANDSCAPE_BOUNDS.halfW - t.extent.x * 0.8,
      x = LANDSCAPE_BOUNDS.halfD - t.extent.z * 0.8,
      m = v.x * cloudWallWindFactor(n.x, v.x, g),
      w = v.z * cloudWallWindFactor(n.z, v.z, x),
      y = 1 / (0.55 + 0.45 * t.size),
      _ = 1 - Math.exp(-e * 0.75 * y);
    ((o.x += (m * 0.5 - o.x) * _), (o.z += (w * 0.5 - o.z) * _));
    const M =
      clampCloudSystem(
        t.homeY,
        CLOUD_LAYER_HEIGHTS.minY,
        CLOUD_LAYER_HEIGHTS.maxY,
      ) -
      t.storm * 0.3 +
      Math.sin(i * 0.45 + t.phase) * 0.07;
    o.y += ((M - n.y) * 2.2 - o.y * 2) * e;
  }
  n.addScaledVector(o, e);
  const a = t.extent.x * 0.8,
    l = t.extent.z * 0.8,
    c = LANDSCAPE_BOUNDS.halfW - 0.06 - a,
    h = LANDSCAPE_BOUNDS.halfD - 0.06 - l;
  (c > 0
    ? (n.x > c
        ? ((o.x -= (n.x - c) * 60 * e),
          o.x > 0 && (o.x *= -0.45),
          system._bump(t, "x"))
        : n.x < -c &&
          ((o.x -= (n.x + c) * 60 * e),
          o.x < 0 && (o.x *= -0.45),
          system._bump(t, "x")),
      (n.x = clampCloudSystem(n.x, -c - a * 0.45, c + a * 0.45)))
    : (o.x -= n.x * 20 * e),
    h > 0
      ? (n.z > h
          ? ((o.z -= (n.z - h) * 60 * e),
            o.z > 0 && (o.z *= -0.45),
            system._bump(t, "z"))
          : n.z < -h &&
            ((o.z -= (n.z + h) * 60 * e),
            o.z < 0 && (o.z *= -0.45),
            system._bump(t, "z")),
        (n.z = clampCloudSystem(n.z, -h - l * 0.45, h + l * 0.45)))
      : (o.z -= n.z * 20 * e));
  const u = t.floorY() + 0.28 * t.vScale;
  n.y < u && ((n.y = dampCloudSystem(n.y, u, 10, e)), o.y < 0 && (o.y *= 0.5));
  const d = t.restTop * t.vScale * (1 + 0.32 * t.storm),
    p = CLOUD_CEILING_Y - 0.1 - n.y;
  (p < d && ((o.y -= (d - p) * 8 * e), o.y > 0 && (o.y *= 0.6)),
    (t.vfit = dampCloudSystem(
      t.vfit,
      clampCloudSystem(p / Math.max(0.1, d), 0.7, 1),
      6,
      e,
    )));
}
function bumpCloud(system, t, e) {
  const i = Math.abs(e === "x" ? t.velocity.x : t.velocity.z);
  i > 0.9 &&
    t.age - (t._bumpT || 0) > 0.3 &&
    ((t._bumpT = t.age), (t.compVel += i * 0.6));
}
function resolveCloudInteractions(system, t) {
  const e = system.list;
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    if (!(s.dissolving || s.fade < 0.5))
      for (let n = i + 1; n < e.length; n++) {
        const o = e[n];
        if (o.dissolving || o.fade < 0.5) continue;
        const a = o.position.x - s.position.x,
          l = o.position.z - s.position.z;
        if (
          Math.abs(o.position.y - s.position.y) >
          s.extent.y + o.extent.y + 0.6
        )
          continue;
        const c = Math.hypot(a, l) + 1e-5,
          h = s.radius,
          f = o.radius,
          u = (h + f) * 0.75;
        if (c >= u) continue;
        const d = a / c,
          p = l / c,
          v =
            (s.velocity.x - o.velocity.x) * d +
            (s.velocity.z - o.velocity.z) * p;
        if (
          ((s.grabbed || o.grabbed) && c < (h + f) * 0.6) ||
          (v > 2.4 && c < (h + f) * 0.62)
        ) {
          const y = s.grabbed ? s : o.grabbed ? o : s.size >= o.size ? s : o;
          system._merge(y, y === s ? o : s);
          return;
        }
        const x = s.size ** 3,
          m = o.size ** 3,
          w = ((u - c) / u) * 5.5 * t;
        if (!s.grabbed) {
          const y = o.grabbed ? 0.35 : m / (x + m);
          ((s.velocity.x -= d * w * y * 2), (s.velocity.z -= p * w * y * 2));
        }
        if (!o.grabbed) {
          const y = s.grabbed ? 0.35 : x / (x + m);
          ((o.velocity.x += d * w * y * 2), (o.velocity.z += p * w * y * 2));
        }
      }
  }
}
function mergeClouds(system, t, e) {
  const i = t.size ** 3,
    s = e.size ** 3,
    n = i + s,
    o = t.puffs.concat(e.puffs);
  (t.grabbed || t.position.lerp(e.position, s / n),
    t.velocity.multiplyScalar(i / n).addScaledVector(e.velocity, s / n),
    (t.size = Math.min(2.4, Math.cbrt(n))),
    (t.water = Math.min(1.5, t.water + e.water)),
    (t.charge = Math.max(t.charge, e.charge)),
    (t.storm = Math.max(t.storm, e.storm)),
    (t.stormTarget = Math.max(t.stormTarget, e.stormTarget)),
    t.water >= 1 &&
      t.size >= 1.4 &&
      (t.stormTarget = Math.max(
        t.stormTarget,
        0.55 + 0.45 * smoothstepCloudSystem(1, 1.45, t.water),
      )),
    (t.heldSqueeze = t.grabbed ? 0 : Math.max(t.heldSqueeze, e.heldSqueeze)));
  const a = clampCloudSystem(
    Math.round((t.puffs.length + e.puffs.length) * 0.7),
    9,
    CLOUD_MAX_BODY_PUFFS,
  );
  (t.setLayout(
    createCloudPuffLayout(system.rand, {
      elong: 1 + Math.max(0, t.size - 1.1) * 0.3,
      count: a,
    }),
    !1,
    o,
  ),
    (t.compVel += 2.4),
    system._remove(e),
    system.ctx.events.emit("cloud:merge", {
      cloud: t,
    }),
    system.ctx.audio?.play?.("merge", {
      volume: 0.7,
      pitch: clampCloudSystem(1.25 - t.size * 0.2, 0.7, 1.2),
    }));
}
export { advanceCloudMotion, bumpCloud, resolveCloudInteractions, mergeClouds };
