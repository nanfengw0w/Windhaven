// Development-only visual checks use the same trees, wind field and seasons.
function setupWillowInspection(ctx) {
  const willows = ctx.modules.willows;
  if (!willows) return;
  ctx.world.dayCycle = false;
  ctx.modules.clouds.clear();
  ctx.cameraRig.enabledDrift = false;
  const panel = document.createElement("aside");
  panel.setAttribute("aria-label", "柳树验收");
  panel.style.cssText =
    "position:fixed;z-index:1000;top:48px;left:12px;right:12px;padding:8px 10px;background:#202820e8;color:#f4f1df;border-radius:8px;font:12px/1.5 system-ui";
  const status = document.createElement("div");
  const controls = document.createElement("div");
  controls.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin-top:5px";
  panel.append(status, controls);
  function refresh() {
    const stats = willows.catkins.stats;
    status.textContent = `湖岸柳树 ${willows.plants.length} 棵 · 柳絮 ${stats.catkins} · 落叶 ${stats.leaves} · ${ctx.world.seasonName} · 可用手抓和风工具`;
  }
  function view(index = null) {
    const rig = ctx.cameraRig;
    const tree = index === null ? null : willows.plants[index];
    rig.overview = false;
    rig._aspect = null;
    Object.assign(rig.goal, {
      radius: tree ? 4.6 : 9,
      theta: tree ? 0.32 : 0,
      phi: tree ? 1.18 : 1.08,
    });
    rig.goalTarget.set(
      tree ? tree.x : 3.2,
      tree ? tree.y + tree.height * 0.53 : 1.2,
      tree ? tree.z : 4.4,
    );
    rig.update(0);
  }
  function button(label, action) {
    const element = document.createElement("button");
    element.textContent = label;
    element.style.cssText =
      "font:inherit;padding:4px 7px;color:#fff;background:#465542;border:1px solid #79876d;border-radius:4px;cursor:pointer";
    element.addEventListener("click", action);
    controls.append(element);
  }
  button("湖岸", () => view());
  button("左柳树", () => view(0));
  button("右柳树", () => view(1));
  button("全景", () => ctx.cameraRig.preset("overview", true));
  for (const [name, season] of [
    ["春", 0.25],
    ["夏", 1],
    ["秋", 2.25],
    ["冬", 3],
  ]) {
    button(name, () => {
      ctx.world.season = season;
      ctx.world.seasonTarget = null;
      ctx.world.update(0);
      refresh();
    });
  }
  button("一阵风", () => {
    for (const tree of willows.plants)
      ctx.wind.addForce(tree.x, tree.z, 3, 0.4, 2, 1);
    refresh();
  });
  button("退出检查", () => {
    panel.remove();
    clearInterval(timer);
  });
  document.body.append(panel);
  view();
  refresh();
  const timer = setInterval(refresh, 1000);
  window.addEventListener("pagehide", () => clearInterval(timer), {
    once: true,
  });
}

export { setupWillowInspection };
