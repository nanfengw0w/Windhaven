// Cloud compression, precipitation, humidity exchange and storm lifetime.
import {
  clampCloudSystem,
  saturateCloudSystem,
  smoothstepCloudSystem,
  dampCloudSystem,
} from "./math.js";
function advanceCloudWaterCycle(system, t, e, i) {
  const s = i.humidity,
    n = t.water;
  t.wheelHold > 0
    ? (t.wheelHold -= e)
    : (t.wheelSqueeze = Math.max(0, t.wheelSqueeze - e * 0.18));
  const o = Math.max(
    t.grabbed ? 0 : t.heldSqueeze,
    t.userSqueeze,
    t.wheelSqueeze,
  );
  t.squeeze = dampCloudSystem(t.squeeze, o, o > t.squeeze ? 5 : 2.6, e);
  const a = 62;
  ((t.compVel +=
    ((t.squeeze - t.comp) * a - t.compVel * 2 * Math.sqrt(a) * 0.24) * e),
    (t.comp = clampCloudSystem(t.comp + t.compVel * e, -0.5, 1.15)));
  const l = t.effSqueeze,
    c = smoothstepCloudSystem(0.02, 0.3, t.water),
    h = smoothstepCloudSystem(1.05, 1.5, t.water) * 0.5;
  let f =
    c *
    (Math.pow(l, 1.25) * (0.5 + 1.1 * Math.min(t.water, 1.2)) +
      h +
      t.storm * (0.45 + 0.8 * Math.min(t.water, 1.2)));
  ((f = t.dissolving ? 0 : Math.min(2.2, f * t.fade)),
    (t.rate = dampCloudSystem(t.rate, f, f > t.rate ? 3 : 1.6, e)));
  const u = t.heldSqueeze > 0 && !t.grabbed && t.userSqueeze === 0;
  ((t.water -= t.rate * e * (u ? 0.006 : 0.03) * (1 - 0.6 * t.storm)),
    s > 0.58 && (t.water += (s - 0.58) * e * 0.06 * (0.6 + 0.4 * t.size)),
    (t.water += t.storm * s * e * 0.022));
  const d = saturateCloudSystem((0.5 - s) / 0.25);
  if (d > 0) {
    const p = smoothstepCloudSystem(12, 26, i.seaLevelTemp),
      v = i.day * (1 - 0.6 * i.cloudCover);
    t.water -=
      e * 0.03 * d * (0.35 + p) * v * (1.3 - Math.min(t.size, 1.2) * 0.6);
  }
  // 预设降雨也使用 heldSqueeze；互动反馈只读取抓取/滚轮输入。
  const interactionSqueeze = Math.max(
    t.grabbed ? t.userSqueeze : 0,
    t.wheelHold > 0 ? t.wheelSqueeze : 0,
  );
  ((t.water = clampCloudSystem(t.water, 0, 1.5)),
    (t.size = clampCloudSystem(t.size + (t.water - n) * 0.28, 0.05, 2.4)),
    t.water < 0.03 &&
      !t.grabbed &&
      !t.dissolving &&
      system.condense?.cloud !== t &&
      ((t.size -= e * 0.12), t.size < 0.18 && (t.dissolving = !0)),
    t.water < 0.45
      ? (t.stormTarget = Math.max(0, t.stormTarget - e * 0.08))
      : t.storm > 0.5 &&
        (t.stormTarget = Math.max(0, t.stormTarget - e * 0.0035)),
    (t.storm = dampCloudSystem(t.storm, t.stormTarget, 0.35, e)),
    (t.outflowT = (t.outflowT || 0) - e),
    t.rate > 0.7 &&
      t.outflowT <= 0 &&
      ((t.outflowT = 0.3),
      system.ctx.wind.addRadial(
        t.position.x,
        t.position.z,
        0.14 * t.rate,
        Math.max(0.8, t.radius * 0.9),
      )),
    (t.sqT = (t.sqT || 0) - e),
    interactionSqueeze > (t.sqLast ?? 0) + 0.06 &&
    t.sqT <= 0 &&
    interactionSqueeze > 0.08
      ? ((t.sqT = 0.28),
        (t.sqLast = interactionSqueeze),
        system.ctx.events.emit("cloud:squeeze", {
          cloud: t,
          amount: interactionSqueeze,
        }),
        system.ctx.audio?.play?.("squish", {
          volume: 0.25 + 0.5 * interactionSqueeze,
          pitch: 1.15 - 0.4 * interactionSqueeze,
        }))
      : interactionSqueeze === 0
        ? ((t.sqLast = 0), (t.sqT = 0))
        : interactionSqueeze < (t.sqLast ?? 0) - 0.1 &&
          (t.sqLast = interactionSqueeze));
}
export { advanceCloudWaterCycle };
