// Cloud charge, glow and lightning events. Calls preserve the shared seeded random sequence.
import { ThreeVector3 } from "../vendor/three-runtime.js";
import { getTreeRegistry } from "../vegetation/tree-registry.js";
import {
  createBranchedLightningPath,
  pickCloudLightningTarget,
} from "./lightning-path.js";
import { clampCloudSystem, smoothstepCloudSystem } from "./math.js";
function strikeCloudLightning(system, t = null, e = 1) {
  const i =
    t ||
    system.list.reduce(
      (d, p) => (!d || p.charge + p.storm > d.charge + d.storm ? p : d),
      null,
    );
  if (!i) return null;
  const { ctx: s, rand: n } = system,
    o = new ThreeVector3(
      i.position.x + (n() - 0.5) * i.radius * 0.5,
      i.baseY + 0.08,
      i.position.z + (n() - 0.5) * i.radius * 0.4,
    ),
    a = pickCloudLightningTarget(s, o.x, o.z, Math.max(1.1, i.radius * 1.1), n),
    l = a.point,
    { points: c, branches: h } = createBranchedLightningPath(s, o, l, n, {
      levels: s.quality.pick(4, 5, 5),
      branches: 3,
    }),
    f = clampCloudSystem(e, 0.2, 1.5);
  s.events.emit("lightning", {
    start: o,
    end: l,
    points: c,
    strength: f,
    branches: h,
    cloudId: i.id,
    kind: a.kind,
  });
  const u = s.camera.position.distanceTo(l);
  return (
    s.events.emit("thunder", {
      delay: 0.12 + u * 0.025,
      strength: f,
    }),
    s.world.triggerFlash(1),
    s.cameraRig.shake(0.6),
    getTreeRegistry(s).shake(l.x, l.z, 0.8, 1),
    (i.glow = 2.6),
    i.glowPos.set(o.x, o.y + 0.25 * i.size, o.z),
    (i.charge = 0.04 + n() * 0.28),
    (i.compVel += 1.8),
    {
      start: o,
      end: l,
      points: c,
    }
  );
}
function advanceCloudCharge(system, t, e) {
  const i = system.rand;
  if (
    ((t.charge +=
      e *
      0.07 *
      t.storm *
      smoothstepCloudSystem(0.35, 0.9, t.water) *
      (0.6 + i() * 0.8)),
    !t.grabbed &&
      t.storm < 0.1 &&
      (t.charge = Math.max(0, t.charge - e * 0.035)),
    t.charge > 0.33 && !t.dissolving && ((t.crackleT -= e), t.crackleT <= 0))
  ) {
    ((t.crackleT = (0.05 + i() * 0.45) / (0.25 + t.charge * 1.6)),
      (t.glow = Math.max(
        t.glow,
        (0.3 + i() * 0.7) * t.charge * (t.grabbed ? 1.2 : 0.8),
      )));
    const s = t.puffs[Math.floor(i() * t.puffs.length)];
    (s &&
      t.glowPos.set(
        s.pos.x + (i() - 0.5) * s.rCur,
        s.pos.y - i() * s.rCur * 0.5,
        s.pos.z + (i() - 0.5) * s.rCur,
      ),
      t.grabbed &&
        system.ctx.audio?.play?.("zap", {
          volume: 0.12 + 0.35 * t.charge,
          pitch: 0.8 + i() * 0.6,
        }));
  }
  ((t.glow *= Math.exp(-e * 13)),
    t.charge >= 1 &&
      !t.dissolving &&
      t.water > 0.05 &&
      system.strike(t, 0.8 + 0.3 * Math.min(1, t.storm + t.water * 0.3)));
}
export { strikeCloudLightning, advanceCloudCharge };
