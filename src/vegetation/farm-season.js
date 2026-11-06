import { smoothstep } from "../core/math.js";

// Early spring/winter is meadow; wheat takes over through spring and summer,
// then gives the ground back after autumn. Both layers use this same calendar.
const WHEAT_ACTIVE_SEASON = [0.12, 0.95, 2.5, 3.05];
const GRASS_WITHER_WINDOW = [0.03, 0.55];
const GRASS_RETREAT_WINDOW = [0.2, 0.95];

function wheatActivity(season) {
  const s = ((season % 4) + 4) % 4;
  const [start, full, decline, end] = WHEAT_ACTIVE_SEASON;
  return smoothstep(start, full, s) * (1 - smoothstep(decline, end, s));
}

function farmGrassState(season, coverage) {
  const pressure = coverage * wheatActivity(season);
  return {
    wither: smoothstep(...GRASS_WITHER_WINDOW, pressure),
    retreat: smoothstep(...GRASS_RETREAT_WINDOW, pressure),
  };
}

const farmSeasonFloat = (value) => value.toFixed(3);
const FARM_SEASON_GLSL = `
float farmSeasonActivity(float season) {
  float s = mod(mod(season, 4.0) + 4.0, 4.0);
  return smoothstep(${WHEAT_ACTIVE_SEASON.slice(0, 2).map(farmSeasonFloat).join(", ")}, s)
    * (1.0 - smoothstep(${WHEAT_ACTIVE_SEASON.slice(2).map(farmSeasonFloat).join(", ")}, s));
}
vec2 farmGrassSuccession(float coverage, float season) {
  float pressure = coverage * farmSeasonActivity(season);
  return vec2(
    smoothstep(${GRASS_WITHER_WINDOW.map(farmSeasonFloat).join(", ")}, pressure),
    smoothstep(${GRASS_RETREAT_WINDOW.map(farmSeasonFloat).join(", ")}, pressure)
  );
}
`;

export { wheatActivity, farmGrassState, FARM_SEASON_GLSL };
