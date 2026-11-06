// Pointer handlers for grabbing, squeezing, throwing and condensing clouds.
import { ThreeVector3 } from "../vendor/three-runtime.js";
import { CLOUD_LAYER_HEIGHTS, LANDSCAPE_BOUNDS } from "../core/config.js";
import {
  clampCloudSystem,
  smoothstepCloudSystem,
  dampCloudSystem,
} from "./math.js";
function registerCloudInput(system) {
  const { input: t } = system.ctx;
  (t.addHandler({
    name: "clouds",
    priority: 40,
    tools: ["hand"],
    cursor: "grab",
    activeCursor: "grabbing",
    hitTest: (e) => {
      const i = system.pick(e.ray);
      return i
        ? {
            distance: system._hitT,
            cloud: i,
          }
        : null;
    },
    onDown: (e, i) => system._grabStart(e.cloud, i),
    onFrame: (e, i) => system._grabFrame(e, i),
    onUp: () => system._grabEnd(),
    onHover: (e) => {
      system.hovered = e ? e.cloud : null;
    },
    onWheel: (e, i, s) => {
      const n = e?.cloud;
      return !n || !system.list.includes(n)
        ? !1
        : ((n.wheelSqueeze = clampCloudSystem(
            n.wheelSqueeze + s * 0.0016,
            0,
            1,
          )),
          (n.wheelHold = 2.2),
          !0);
    },
  }),
    t.addHandler({
      name: "clouds-condense",
      priority: 40,
      tools: ["cloud"],
      cursor: "crosshair",
      activeCursor: "crosshair",
      hitTest: () => ({
        distance: 1e6,
      }),
      onDown: (e, i) => system._condenseStart(i),
      onFrame: (e, i) => system._condenseFrame(e, i),
      onUp: () => {
        system.condense = null;
      },
    }));
}
function cloudPointerPlanePoint(system, t, e, i) {
  const { input: s } = system.ctx,
    n = s.pointer.ray.direction;
  let o = Math.abs(n.y) > 0.1 ? s.rayToPlaneY(t, e) : null;
  return (
    o &&
      (Math.abs(o.x) > LANDSCAPE_BOUNDS.halfW + 4 ||
        Math.abs(o.z) > LANDSCAPE_BOUNDS.halfD + 4) &&
      (o = null),
    !o && ((o = s.rayToCameraPlane(i || system._anchor.set(0, t, 0), e)), !o)
      ? null
      : ((e.y = t), e)
  );
}
function beginCloudGrab(system, t, e) {
  if (!t || t.dissolving || !system.list.includes(t)) return !1;
  const i = (system.grab = {
    cloud: t,
    y: t.position.y,
    off: new ThreeVector3(),
    target: t.position.clone(),
    last: t.position.clone(),
    vel: new ThreeVector3(),
    prevVel: new ThreeVector3(),
    shake: 0,
  });
  return (
    system._planePoint(i.y, system._p, t.position) &&
      (i.off.set(system._p.x - t.position.x, 0, system._p.z - t.position.z),
      i.off.clampLength(0, t.radius * 0.8)),
    (t.grabbed = !0),
    (t.userSqueeze = Math.max(t.userSqueeze, t.heldSqueeze * 0.7)),
    (t.heldSqueeze = 0),
    (t.compVel -= 0.8),
    system.ctx.events.emit("cloud:grab", {
      cloud: t,
    }),
    system.ctx.audio?.play?.("grab", {
      volume: 0.55,
      pitch: clampCloudSystem(1.3 - t.size * 0.25, 0.7, 1.3),
    }),
    !0
  );
}
function updateCloudGrab(system, t, e) {
  const i = system.grab;
  if (!i || !system.list.includes(i.cloud)) {
    system.grab = null;
    return;
  }
  const s = i.cloud;
  if (system._planePoint(i.y, system._p, s.position)) {
    const o = Math.max(0.3, LANDSCAPE_BOUNDS.halfW - 0.1 - s.extent.x * 0.7),
      a = Math.max(0.3, LANDSCAPE_BOUNDS.halfD - 0.1 - s.extent.z * 0.7);
    i.target.set(
      clampCloudSystem(system._p.x - i.off.x, -o, o),
      i.y,
      clampCloudSystem(system._p.z - i.off.z, -a, a),
    );
  }
  if (e > 0) {
    (system._q.subVectors(i.target, i.last).divideScalar(e),
      i.vel.lerp(system._q, 1 - Math.exp(-e * 14)));
    const o = system._q.subVectors(i.vel, i.prevVel).length() / e;
    ((i.shake = dampCloudSystem(i.shake, o, 5, e)),
      i.prevVel.copy(i.vel),
      i.last.copy(i.target));
  }
  t.stillTime > 0.2
    ? (s.userSqueeze = Math.min(
        1,
        s.userSqueeze + e * 0.55 * (1 - s.userSqueeze * 0.35),
      ))
    : (s.userSqueeze = Math.max(0, s.userSqueeze - e * 0.6));
  const n = smoothstepCloudSystem(9, 36, i.shake);
  n > 0 && (s.charge = Math.min(1.02, s.charge + e * n * 0.8));
}
function endCloudGrab(system) {
  const t = system.grab;
  if (!t) return;
  system.grab = null;
  const e = t.cloud;
  ((e.grabbed = !1), e.velocity.set(t.vel.x, 0, t.vel.z).clampLength(0, 7));
  const i = e.squeeze;
  if (((e.userSqueeze = 0), !system.list.includes(e))) return;
  system.ctx.events.emit("cloud:release", {
    cloud: e,
  });
  const s = Math.hypot(t.vel.x, t.vel.z);
  system.ctx.audio?.play?.("release", {
    volume: clampCloudSystem(0.3 + s * 0.08 + i * 0.3, 0, 1),
    pitch: clampCloudSystem(1.2 - e.size * 0.2, 0.7, 1.3),
  });
}
function beginCloudCondensation(system, t) {
  const { rand: e } = system,
    i = system.pick(t.ray);
  let s = i && i.size < 2.2 ? i : null;
  if (!s) {
    const o = system._planePoint(CLOUD_LAYER_HEIGHTS.defaultY, system._p);
    if (!o) return !1;
    const a = LANDSCAPE_BOUNDS.halfW - 1,
      l = LANDSCAPE_BOUNDS.halfD - 0.9;
    ((s = system.spawn({
      x: clampCloudSystem(o.x, -a, a),
      z: clampCloudSystem(o.z, -l, l),
      y: CLOUD_LAYER_HEIGHTS.defaultY + (e() - 0.5) * 0.4,
      size: 0.22,
      water: 0.12,
      fadeIn: !0,
    })),
      system.ctx.audio?.play?.("pop", {
        volume: 0.5,
        pitch: 1 + e() * 0.2,
      }));
  }
  const n = new ThreeVector3();
  return (
    system._planePoint(s.position.y, n, s.position) || n.copy(s.position),
    (system.condense = {
      cloud: s,
      last: n,
    }),
    !0
  );
}
function updateCloudCondensation(system, t, e) {
  const i = system.condense;
  if (!i || !system.list.includes(i.cloud)) {
    system.condense = null;
    return;
  }
  const s = i.cloud,
    n = system.ctx.world.humidity;
  (s.size < 1.8 &&
    (s.size = Math.min(
      1.8,
      s.size + e * (0.18 + 0.5 * n) * (1.2 - s.size / 1.9),
    )),
    (s.water = Math.min(1.5, s.water + e * (0.04 + 0.1 * n))));
  const o = system._planePoint(s.position.y, system._p, s.position);
  if (!o) return;
  ((o.x = clampCloudSystem(
    o.x,
    -LANDSCAPE_BOUNDS.halfW + 0.5,
    LANDSCAPE_BOUNDS.halfW - 0.5,
  )),
    (o.z = clampCloudSystem(
      o.z,
      -LANDSCAPE_BOUNDS.halfD + 0.5,
      LANDSCAPE_BOUNDS.halfD - 0.5,
    )));
  const a = Math.max(0.32, s.size * 0.4);
  if (o.distanceTo(i.last) > a) {
    system._q.subVectors(o, i.last).setLength(a).add(i.last);
    const l = Math.max(0.2, s.size * (0.32 + system.rand() * 0.12));
    s.addPuffAt(
      system._q.x,
      s.position.y + (system.rand() - 0.35) * 0.12 * s.size,
      system._q.z,
      l,
    )
      ? (i.last.copy(system._q),
        (s.size = Math.min(2.2, s.size + 0.03)),
        system.ctx.audio?.play?.("pop", {
          volume: 0.18,
          pitch: 1.2 + system.rand() * 0.3,
        }))
      : i.last.copy(o);
  }
}
export {
  registerCloudInput,
  cloudPointerPlanePoint,
  beginCloudGrab,
  updateCloudGrab,
  endCloudGrab,
  beginCloudCondensation,
  updateCloudCondensation,
};
