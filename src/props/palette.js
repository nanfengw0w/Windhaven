// One shared material seed stream preserves the cabin → yard → jetty → boat build order.
import { createPropColor } from "./geometry.js";
import { createSeededRandom } from "../core/math.js";
const PROP_COLORS = {
  log: createPropColor("#8a6440"),
  logB: createPropColor("#9c7348"),
  logC: createPropColor("#7a5636"),
  chink: createPropColor("#d8d0bc"),
  plank: createPropColor("#8f6b47"),
  plankL: createPropColor("#9c7650"),
  grey: createPropColor("#8a857a"),
  bark: createPropColor("#4a3a2c"),
  barkL: createPropColor("#5d4a36"),
  door: createPropColor("#7a2c22"),
  trim: createPropColor("#e4dcc6"),
  shutter: createPropColor("#3c5e48"),
  iron: createPropColor("#2a2826"),
  stone: createPropColor("#7e776b"),
  stoneW: createPropColor("#8c806c"),
  stoneD: createPropColor("#5f5a53"),
  mortar: createPropColor("#77726a"),
  shingle: createPropColor("#76604c"),
  glass: createPropColor("#101418"),
  hull: createPropColor("#3d6b5e"),
  hullBottom: createPropColor("#7a3426"),
  boatIn: createPropColor("#a07a4e"),
  rope: createPropColor("#b59a6a"),
  soot: createPropColor("#151210"),
  box: createPropColor("#5f7f52"),
};
const propMaterialRandom = createSeededRandom(9091);
const createPropSurface = (r, t, e = {}) => ({
  col: r,
  kind: t,
  seed: e.seed ?? propMaterialRandom() * 10,
  expo: e.expo ?? 1,
  param: e.param ?? 0,
  ...e,
});
export { PROP_COLORS, createPropSurface };
