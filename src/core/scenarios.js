// Reconstructed module: identifiers and file boundaries are refactor choices.
import { CLOUD_LAYER_HEIGHTS, TERRARIUM_BOUNDS } from "./config.js";
import {
  LANDSCAPE_AREA_SCALE,
  landscapeWeatherPoints,
} from "./weather-extent.js";
function getCloudModule(r) {
  return r.modules.clouds;
}
function spawnScenarioCloud(r, t) {
  try {
    return getCloudModule(r)?.spawn?.(t) ?? null;
  } catch (e) {
    return (console.error("[scenario] spawn", e), null);
  }
}
const FEATURED_WEATHER_SCENARIOS = ["calm", "rain", "storm", "snow", "meteor"];
const SCENARIOS = {
  calm(r) {
    const { world: t } = r;
    ((t.season = 0.25),
      (t.timeOfDay = 0.635),
      (t.tempOffset = 0),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: -2.6,
        z: -0.6,
        size: 0.9,
        water: 0.3,
      }),
      spawnScenarioCloud(r, {
        x: 2.2,
        z: 0.4,
        y: CLOUD_LAYER_HEIGHTS.defaultY + 0.4,
        size: 1.1,
        water: 0.35,
      }),
      spawnScenarioCloud(r, {
        x: 0.2,
        z: 2.2,
        y: CLOUD_LAYER_HEIGHTS.defaultY - 0.3,
        size: 0.7,
        water: 0.25,
      }));
  },
  rain(r) {
    const { world: t, fields: e } = r;
    ((t.season = 0.9),
      (t.timeOfDay = 0.55),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: -1.2,
        z: 0.6,
        size: 1.35,
        water: 0.9,
        squeeze: 0.75,
      }),
      spawnScenarioCloud(r, {
        x: 2.6,
        z: 2.2,
        size: 1.2,
        water: 0.85,
        squeeze: 0.7,
      }),
      spawnScenarioCloud(r, {
        x: 3.4,
        z: -1.5,
        y: CLOUD_LAYER_HEIGHTS.defaultY + 0.5,
        size: 0.8,
        water: 0.4,
      }),
      e.addWet(-1.2, 0.6, 2.2, 0.8),
      (t.waterRise = 0.06));
  },
  storm(r) {
    const { world: t, fields: e, wind: i } = r;
    ((t.season = 1.3),
      (t.timeOfDay = 0.66),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: -0.6,
        z: -0.2,
        size: 2,
        water: 1.4,
        squeeze: 0.9,
        charge: 0.95,
        storm: 1,
      }),
      spawnScenarioCloud(r, {
        x: 3,
        z: 1.8,
        size: 1.5,
        water: 1.1,
        squeeze: 0.7,
        charge: 0.5,
        storm: 0.7,
      }),
      spawnScenarioCloud(r, {
        x: -3.8,
        z: 1.6,
        size: 1.2,
        water: 0.9,
        squeeze: 0.4,
      }),
      e.addWet(0, 0.5, 5, 1),
      (t.waterRise = 0.14),
      (i.ambientDir = 0.6),
      (t.storminess = 0.9));
  },
  snow(r) {
    const { world: t, fields: e } = r;
    ((t.season = 3),
      (t.timeOfDay = 0.45),
      (t.tempOffset = 0),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: -1.5,
        z: 0.2,
        size: 1.4,
        water: 1,
        squeeze: 0.6,
      }),
      spawnScenarioCloud(r, {
        x: 2.6,
        z: -0.8,
        y: CLOUD_LAYER_HEIGHTS.defaultY + 0.5,
        size: 1.1,
        water: 0.8,
        squeeze: 0.45,
      }),
      t.update(0),
      (e.lakeFrozen = 1),
      e.fillSnowByTemperature(0.9));
  },
  meteor(r) {
    const { world } = r;
    world.season = 1;
    world.timeOfDay = 0.96;
    world.tempOffset = 0;
    world.meteorShower = true;
    getCloudModule(r)?.clear?.();
  },
  mountainsnow(r) {
    const { world: t, fields: e } = r;
    ((t.season = 2.2),
      (t.timeOfDay = 0.42),
      (t.tempOffset = -2),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: -2.8,
        z: -2.4,
        y: CLOUD_LAYER_HEIGHTS.defaultY + 0.4,
        size: 1.4,
        water: 1.1,
        squeeze: 0.8,
      }),
      spawnScenarioCloud(r, {
        x: 1.8,
        z: -2.6,
        y: CLOUD_LAYER_HEIGHTS.defaultY + 0.6,
        size: 1.2,
        water: 0.9,
        squeeze: 0.6,
      }),
      t.update(0),
      e.fillSnowByTemperature(0.8));
  },
  fog(r) {
    const { world: t } = r;
    ((t.season = 2),
      (t.timeOfDay = 0.29),
      (t.humidity = 0.9),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: 1.5,
        z: -1.8,
        y: CLOUD_LAYER_HEIGHTS.defaultY + 0.7,
        size: 0.8,
        water: 0.3,
      }));
    const e = r.modules.fog;
    try {
      (e?.addFog?.(0.5, 1.2, 3.5, 1),
        e?.addFog?.(-3, 0.5, 2.5, 0.8),
        e?.addFog?.(2.8, 2.6, 2.2, 0.9));
    } catch (i) {
      console.error(i);
    }
  },
  autumn(r) {
    const { world: t, wind: e } = r;
    ((t.season = 2.05),
      (t.timeOfDay = 0.58),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: -2,
        z: 0.4,
        size: 1,
        water: 0.5,
      }),
      spawnScenarioCloud(r, {
        x: 2.5,
        z: -1,
        y: CLOUD_LAYER_HEIGHTS.defaultY + 0.5,
        size: 1.2,
        water: 0.6,
      }));
    for (let i = 0; i < 6; i++)
      e.addForce(-4 + i * 1.5, 0.5, 4.5, 0.8, 1.4, 0.8);
  },
  night(r) {
    const { world: t } = r;
    ((t.season = 1),
      (t.timeOfDay = 0.96),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: 3.2,
        z: -1.2,
        y: CLOUD_LAYER_HEIGHTS.defaultY + 0.6,
        size: 0.8,
        water: 0.3,
      }));
  },
  dusk(r) {
    const { world: t } = r;
    ((t.season = 1.1),
      (t.timeOfDay = 0.735),
      getCloudModule(r)?.clear?.(),
      spawnScenarioCloud(r, {
        x: -2.4,
        z: -1,
        size: 1.1,
        water: 0.4,
      }),
      spawnScenarioCloud(r, {
        x: 1.8,
        z: 0.8,
        y: CLOUD_LAYER_HEIGHTS.maxY - 0.3,
        size: 0.9,
        water: 0.35,
      }));
  },
};
function extendScenarioWeather(ctx, name) {
  const templates = [...(getCloudModule(ctx)?.list ?? [])];
  const extra = Math.max(0, LANDSCAPE_AREA_SCALE - 1);
  const count = Math.round(templates.length * extra);
  for (const [index, point] of landscapeWeatherPoints(count).entries()) {
    const source = templates[index % templates.length];
    spawnScenarioCloud(ctx, {
      ...point,
      y: source.position.y,
      size: source.size,
      water: source.water,
      squeeze: source.squeeze,
      charge: source.charge,
      storm: source.storm,
    });
    if ((name === "rain" || name === "storm") && source.squeeze > 0.1) {
      const coreDistance = Math.hypot(
        Math.max(0, Math.abs(point.x) - TERRARIUM_BOUNDS.halfW),
        Math.max(0, Math.abs(point.z) - TERRARIUM_BOUNDS.halfD),
      );
      ctx.fields.addWet(
        point.x,
        point.z,
        Math.min(source.size * 2, coreDistance - 0.05),
        name === "storm" ? 1 : 0.8,
      );
    }
  }
  if (name === "fog") {
    const patches = [
      [3.5, 1],
      [2.5, 0.8],
      [2.2, 0.9],
    ];
    for (const [index, point] of landscapeWeatherPoints(
      Math.round(patches.length * extra),
      23842,
    ).entries()) {
      ctx.modules.fog?.addFog?.(
        point.x,
        point.z,
        ...patches[index % patches.length],
      );
    }
  }
  if (name === "autumn") {
    for (const point of landscapeWeatherPoints(Math.round(6 * extra), 23843)) {
      ctx.wind.addForce(point.x, point.z, 4.5, 0.8, 1.4, 0.8);
    }
  }
}
function applyScenario(r, t) {
  const e = SCENARIOS[t];
  if (e) {
    r.world.meteorShower = t === "meteor";
    if (FEATURED_WEATHER_SCENARIOS.includes(t)) {
      // 特制场景一次性布置完整天气；普通季节/时间变化不经过这里。
      // 清掉上一场雨雪的沉积和余留降水，避免晴天仍在下雨。
      r.modules.fog?.clear?.();
      r.modules.precipitation?.clear?.();
      if (r.precip) r.precip.sources.length = 0;
      r.fields.clear();
      r.fields.lakeFrozen = 0;
      Object.assign(r.world, {
        tempOffset: 0,
        cloudCover: 0,
        storminess: 0,
        rainfall: 0,
        snowfall: 0,
        flash: 0,
        fogAmount: 0,
        groundWetness: 0,
        snowCover: 0,
        waterRise: 0,
      });
    }
  }
  return e
    ? (e(r),
      extendScenarioWeather(r, t),
      (r.world.seasonTarget = null),
      r.world.update(0),
      r.fields.update?.(0, true),
      r.events.emit("scenario", {
        name: t,
      }),
      !0)
    : (console.warn(`[scenario] unknown "${t}"`), !1);
}
export { FEATURED_WEATHER_SCENARIOS, SCENARIOS, applyScenario };
