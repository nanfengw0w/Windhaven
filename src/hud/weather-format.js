// Reconstructed module: identifiers and file boundaries are refactor choices.
const TEMPERATURE_BIAS_LIMIT = 15;
const TEMPERATURE_DISPLAY_MIN = -20;
const TEMPERATURE_DISPLAY_MAX = 40;
const TP = 4;
const formatTemperature = (r) => {
  const t = Math.round(r);
  return `${t < 0 ? "−" : ""}${Math.abs(t)}°`;
};
function describeWind(r) {
  return r < 0.18
    ? "still"
    : r < 0.38
      ? "light air"
      : r < 0.65
        ? "breezy"
        : r < 1.1
          ? "windy"
          : r < 1.7
            ? "gusty"
            : "gale";
}
function describePrecipitation(r, t) {
  const e = r + t;
  return e < 0.04
    ? "dry"
    : t >= r
      ? t < 0.35
        ? "flurries"
        : t < 1.1
          ? "snow"
          : "heavy snow"
      : t > e * 0.2
        ? "sleet"
        : r < 0.3
          ? "drizzle"
          : r < 1.1
            ? "rain"
            : "downpour";
}
function describeWeather(r) {
  const t = [],
    e = r.rainfall || 0,
    i = r.snowfall || 0,
    s = r.storminess || 0,
    n = r.fogAmount || 0,
    o = r.windEnergy || 0,
    a = r.seaLevelTemp ?? 10,
    l = r.freezingLevel ?? 10;
  if (
    (s > 0.55 && t.push("thunderstorm"),
    i > 0.05 && i >= e
      ? t.length
        ? t.push("snow")
        : t.push(i > 1.1 ? "heavy snow" : i < 0.35 ? "flurries" : "snowing")
      : e > 0.05 &&
        (t.length ||
          t.push(e > 1.1 ? "downpour" : e < 0.3 ? "drizzle" : "rain"),
        l < TP && l > 0.2 && t.push("snow on the peaks")),
    n > 0.3 ? t.push("foggy") : n > 0.14 && t.length < 2 && t.push("misty"),
    t.length < 2 &&
      o >= 0.65 &&
      !t.includes("thunderstorm") &&
      t.push(describeWind(o)),
    !t.length)
  ) {
    const c = r.cloudCover || 0;
    (o >= 0.38 && t.push("breezy"),
      c > 0.65
        ? t.push("overcast")
        : c > 0.3
          ? t.push("some cloud")
          : (r.night || 0) > 0.5
            ? t.push(a < 0 ? "frosty night" : "clear night")
            : a < 0
              ? t.push("crisp & clear")
              : a > 26
                ? t.push("hot & sunny")
                : t.push((r.sunElevation || 0) > 0.25 ? "sunny" : "clear"));
  }
  return t.slice(0, 2).join(", ");
}
const TEMPERATURE_COLOR_STOPS = [
  [-15, [130, 186, 255]],
  [0, [186, 222, 246]],
  [10, [255, 216, 140]],
  [22, [255, 164, 92]],
  [34, [240, 96, 72]],
];
function temperatureToCssRgb(r) {
  if (r <= TEMPERATURE_COLOR_STOPS[0][0])
    return TEMPERATURE_COLOR_STOPS[0][1].join(" ");
  for (let t = 1; t < TEMPERATURE_COLOR_STOPS.length; t++)
    if (r <= TEMPERATURE_COLOR_STOPS[t][0]) {
      const [e, i] = TEMPERATURE_COLOR_STOPS[t - 1],
        [s, n] = TEMPERATURE_COLOR_STOPS[t],
        o = (r - e) / (s - e);
      return i.map((a, l) => Math.round(a + (n[l] - a) * o)).join(" ");
    }
  return TEMPERATURE_COLOR_STOPS[TEMPERATURE_COLOR_STOPS.length - 1][1].join(
    " ",
  );
}
export {
  TEMPERATURE_BIAS_LIMIT,
  TEMPERATURE_DISPLAY_MAX,
  TEMPERATURE_DISPLAY_MIN,
  describePrecipitation,
  describeWeather,
  describeWind,
  formatTemperature,
  temperatureToCssRgb,
};
