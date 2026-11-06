// Development-only viewing aids. Terrain, vegetation, materials and lighting
// remain the application's normal high-quality spring/noon rendering.
const TERRAIN_INSPECTION_VIEWS = {
  front: { label: "前侧交界", theta: 0, phi: 1.1, radius: 12.5, x: -1, z: 4 },
  right: {
    label: "右侧交界",
    theta: Math.PI / 2,
    phi: 1.1,
    radius: 12.5,
    x: 6,
    z: 0.5,
  },
  low: { label: "低角度", theta: 0, phi: 1.47, radius: 10.5, x: -2.5, z: 4 },
  overview: { label: "全景" },
};

function prepareTerrainInspection(params) {
  params.set("quality", "high");
  params.set("scenario", "calm");
  params.set("season", "0.25");
  params.set("time", "0.5");
  params.set("shot", "1");
  params.delete("warm");
}

function setupTerrainInspection(ctx) {
  const requested = ctx.params.get("inspectView") || "front";
  const viewName = Object.hasOwn(TERRAIN_INSPECTION_VIEWS, requested)
    ? requested
    : "front";
  const view = TERRAIN_INSPECTION_VIEWS[viewName];
  const rig = ctx.cameraRig;
  ctx.modules.clouds.clear();
  ctx.world.dayCycle = false;
  ctx.input.setTool("hand");
  rig.enabledDrift = false;
  rig.time = 0;
  rig.shakeAmount = 0;
  if (viewName === "overview") {
    rig.preset("overview", true);
  } else {
    rig.overview = false;
    rig._aspect = null;
    Object.assign(rig.goal, {
      theta: view.theta,
      phi: view.phi,
      radius: view.radius,
    });
    rig.goalTarget.set(
      view.x,
      ctx.terrain.height(view.x, view.z) + 0.08,
      view.z,
    );
    rig.update(0);
  }
  const disableTiltShift = () => {
    ctx.post.tiltX.enabled = false;
    ctx.post.tiltY.enabled = false;
  };
  disableTiltShift();
  const updatePostLevel = ctx.quality.onPostLevel;
  ctx.quality.onPostLevel = (level) => {
    updatePostLevel?.(level);
    disableTiltShift();
  };

  const panel = document.createElement("aside");
  panel.id = "terrain-inspection";
  panel.setAttribute("aria-label", "地形视觉验收");
  panel.style.cssText =
    "position:fixed;z-index:1000;top:12px;left:50%;transform:translateX(-50%);" +
    "max-width:calc(100vw - 24px);padding:9px 12px;border-radius:9px;" +
    "background:rgba(25,30,24,.91);border:1px solid #b8c5a4;color:#f3f5ec;" +
    "font:12px/1.5 system-ui,sans-serif;box-shadow:0 2px 12px #0004;";
  const label = document.createElement("strong");
  label.textContent = "地形检查：无云 / 无景深";
  panel.append(label);
  const detail = document.createElement("span");
  detail.textContent = " · 高画质 · 春季正午 · 时间暂停";
  panel.append(detail);
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "地形检查视角");
  nav.style.cssText = "display:flex;gap:12px;flex-wrap:wrap;margin-top:4px;";
  for (const [name, entry] of Object.entries(TERRAIN_INSPECTION_VIEWS)) {
    const url = new URL(location.href);
    url.searchParams.set("inspection", "terrain");
    url.searchParams.set("inspectView", name);
    url.searchParams.delete("cam");
    const link = document.createElement("a");
    link.href = url.href;
    link.textContent = entry.label;
    link.style.color = name === viewName ? "#fff1a1" : "#dce9d2";
    if (name === viewName) link.setAttribute("aria-current", "page");
    nav.append(link);
  }
  const exitUrl = new URL(location.href);
  for (const name of [
    "inspection",
    "inspectView",
    "paused",
    "shot",
    "time",
    "season",
    "ui",
  ]) {
    exitUrl.searchParams.delete(name);
  }
  exitUrl.searchParams.set("quality", "high");
  exitUrl.searchParams.set("scenario", "calm");
  exitUrl.searchParams.set(
    "cam",
    viewName === "overview" ? "overview" : "front",
  );
  const exit = document.createElement("a");
  exit.href = exitUrl.href;
  exit.textContent = "退出检查";
  exit.style.color = "#e2d7c8";
  nav.append(exit);
  panel.append(nav);
  document.body.append(panel);

  return {
    view: viewName,
    target: rig.target.toArray(),
    position: ctx.camera.position.toArray(),
    theta: rig.theta,
    phi: rig.phi,
    radius: rig.radius,
  };
}

export { prepareTerrainInspection, setupTerrainInspection };
