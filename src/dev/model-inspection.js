// Development-only controls for reviewing real assets in the live scene.
import { CABIN_PLACEMENT, terrainHeight } from "../simulation/terrain-shape.js";
import { FARM } from "../layout/farm-layout.js";
import { WOODWORKING_YARD } from "../layout/woodworking-layout.js";
import { HIKING_TRAIL } from "../layout/hiking-layout.js";
import { RIVER_SOURCE } from "../layout/river-source-layout.js";

function setupModelInspection(ctx) {
  const town = ctx.modules.alpineTown;
  if (!town) return;
  ctx.world.dayCycle = false;
  ctx.modules.clouds.clear();
  ctx.cameraRig.enabledDrift = false;
  town.speed = 0;
  const panel = document.createElement("aside");
  panel.setAttribute("aria-label", "导入模型验收");
  panel.style.cssText =
    "position:fixed;z-index:1000;top:48px;left:12px;right:12px;padding:8px 10px;background:#202820e8;color:#f4f1df;border-radius:8px;font:12px/1.5 system-ui";
  const status = document.createElement("div");
  status.textContent = "正在加载模型…";
  panel.append(status);
  const controls = document.createElement("div");
  controls.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin-top:5px";
  panel.append(controls);
  function view(target, radius, theta = 0.8, phi = 1.15) {
    const rig = ctx.cameraRig;
    rig.overview = false;
    rig._aspect = null;
    Object.assign(rig.goal, { radius, theta, phi });
    rig.goalTarget.set(...target);
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
  button("全景", () => ctx.cameraRig.preset("overview", true));
  button("稻草人", () => {
    const { x, z, yaw, height } = FARM.scarecrow;
    view([x, terrainHeight(x, z) + height * 0.52, z], 1.8, yaw + 0.4, 1.1);
  });
  button("林间木工小院", () => {
    const { x, z } = WOODWORKING_YARD.center;
    view([x, terrainHeight(x, z) + 0.15, z], 4.6, 0.35, 0.85);
  });
  button("山间步道", () => {
    const { x, z } = HIKING_TRAIL.shelter;
    view([x + 2.6, terrainHeight(x, z) + 0.1, z], 16, 0.05, 0.65);
  });
  button("小镇", () => view([9, 1.3, 0.7], 10, 0.8, 0.85));
  button("山泉源头", () => {
    const { x, y, z } = RIVER_SOURCE;
    view([x + 0.3, y - 0.5, z + 0.75], 5, -0.2, 0.82);
  });
  button("村路近景", () => view([8.85, 1.05, 1.05], 3.2, 0.3, 0.6));
  button("路面俯视", () => view([8.85, 1, 0.6], 6.6, 0.06, 0.28));
  button("墙脚近景", () => {
    const house = town.buildings.find((item) => item.modelId === "house-inn");
    view(
      [house.x, house.foundationTop + 0.15, house.z],
      2.8,
      house.yaw + 0.65,
      1.05,
    );
  });
  button("轨道路基", () => {
    const track = town.sampleTrack(town.station.distance + 1.5, {});
    view([track.x, track.y - 0.18, track.z], 2.5, track.yaw + 1.25, 1.05);
  });
  button("北侧房屋", () => view([8.55, 0.85, -1.6], 5.6, 0.3, 0.45));
  button("站台材质", () =>
    view(
      [town.station.platformX, 1, town.station.platformZ],
      3.3,
      town.station.yaw + 1.1,
      0.78,
    ),
  );
  button("原屋对照", () =>
    view(
      [CABIN_PLACEMENT.x, CABIN_PLACEMENT.y + 0.15, CABIN_PLACEMENT.z],
      2.8,
      CABIN_PLACEMENT.rot + 0.6,
      1.05,
    ),
  );
  button("雨后材质", () => ctx.fields.addWet(9, 0.6, 4, 1));
  for (const [label, match] of [
    ["长屋", (building) => building.modelId === "house-long"],
    ["旅店", (building) => building.modelId === "house-inn"],
    ["高屋", (building) => building.modelId === "house-tall"],
    ["原木屋", (building) => building.modelId === "cottage"],
    ["站房", (building) => building.station],
    ["钟楼", (building) => building.tower],
  ]) {
    button(label, () => {
      const building = town.buildings.find(match);
      if (!building) return;
      view(
        [
          building.x,
          building.foundationTop +
            (building.imported?.size[1] ?? building.height) * 0.45,
          building.z,
        ],
        building.tower ? 4.8 : 3.5,
        building.yaw + 0.65,
      );
    });
  }
  button("列车", () => {
    town.distance = town.station.distance + 2.7;
    town.update(0);
    const car = town.cars[1];
    view(
      [car.sample.x, car.sample.y + 0.15, car.sample.z],
      5.3,
      car.sample.yaw + 1.15,
    );
  });
  button("驶出地图", () => {
    const crossing = town.pathZ.findIndex(
      (z, index) => z > ctx.box.halfD && town.pathX[index] > 0,
    );
    town.distance = town.pathArc[crossing] + 0.1;
    town.update(0);
    view([8.7, 1, 7.7], 6, 0.55);
  });
  button("左侧再入", () => {
    const crossing = town.pathZ.findIndex(
      (z, index) =>
        index > 0 &&
        z <= ctx.box.halfD &&
        town.pathZ[index - 1] > ctx.box.halfD &&
        town.pathX[index] < 0,
    );
    town.distance = town.pathArc[crossing] + 1.6;
    town.update(0);
    view([-6.85, 1.2, 7.5], 6, 0.75);
  });
  button("开动 / 停车", () => {
    town.speed = town.speed ? 0 : 0.42;
  });
  button("退出检查", () => {
    town.speed = 0.42;
    panel.remove();
  });
  document.body.append(panel);
  town.modelsReady?.then((ready) => {
    status.textContent = ready
      ? `${town.stats.importedAssets} 种模型已载入 · 长屋 / 旅店 / 高屋 / 原木屋 / 站房 / 钟楼 / 列车`
      : "模型加载失败：" + (town.stats.modelError || "场景已结束");
  });
}

export { setupModelInspection };
