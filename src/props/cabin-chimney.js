import { composeChildPropTransform, PROP_MATERIAL_KINDS } from "./geometry.js";
import { CABIN_HALF_WIDTH } from "./cabin-dimensions.js";
import { PROP_COLORS, createPropSurface } from "./palette.js";
import { smoothstep } from "../core/math.js";
import { ThreeVector3 } from "../vendor/three-runtime.js";
function buildCabinChimney(props, t) {
  const e = props.cabinFrame,
    i = props.R,
    s = composeChildPropTransform(e, -CABIN_HALF_WIDTH, 0, 0, -Math.PI / 2),
    n = [PROP_COLORS.stone, PROP_COLORS.stoneW, PROP_COLORS.stoneD],
    o = (f, u, d, p, v, g, x) => {
      const m = [
        {
          ax: "x",
          a: f,
          b: u,
          c: p,
          n: 1,
        },
        {
          ax: "x",
          a: f,
          b: u,
          c: d,
          n: -1,
        },
        {
          ax: "z",
          a: d,
          b: p,
          c: u,
          n: 1,
        },
        {
          ax: "z",
          a: d,
          b: p,
          c: f,
          n: -1,
        },
      ];
      for (const w of m) {
        let y = w.a - i(0, 0.02);
        for (; y < w.b - 0.01;) {
          const _ = Math.min(i(0.035, 0.07), w.b + 0.01 - y),
            M = y + _ / 2,
            A = i(0.026, 0.04),
            b = i(-0.0025, 0.003),
            S = g - i(0.003, 0.006),
            E = n[Math.floor(i(0, 3))].clone().multiplyScalar(i(0.82, 1.15)),
            T = createPropSurface(E, PROP_MATERIAL_KINDS.stone, {
              stone: !0,
              expo: 0.9,
              param: x,
            });
          (w.ax === "x"
            ? t.box(
                composeChildPropTransform(
                  s,
                  M,
                  v + g / 2 + i(-0.002, 0.002),
                  w.c - (w.n * A) / 2 + w.n * b,
                  i(-0.05, 0.05),
                  i(-0.04, 0.04),
                ),
                _ - 0.004,
                S,
                A,
                T,
              )
            : t.box(
                composeChildPropTransform(
                  s,
                  w.c - (w.n * A) / 2 + w.n * b,
                  v + g / 2 + i(-0.002, 0.002),
                  M,
                  i(-0.05, 0.05),
                  0,
                  i(-0.04, 0.04),
                ),
                A,
                S,
                _ - 0.004,
                T,
              ),
            (y += _));
        }
      }
      t.box(
        composeChildPropTransform(s, (f + u) / 2, v + g / 2, (d + p) / 2),
        u - f - 0.012,
        g,
        p - d - 0.012,
        createPropSurface(PROP_COLORS.mortar, PROP_MATERIAL_KINDS.mortar, {
          expo: 0.3,
        }),
      );
    };
  let a = -0.035;
  for (; a < 0.36;) {
    const f = i(0.026, 0.036);
    (o(-0.088, 0.088, 0.02, 0.185, a, f, 0), (a += f));
  }
  (t.box(
    composeChildPropTransform(s, 0, a + 0.007, 0.105),
    0.19,
    0.014,
    0.17,
    createPropSurface(PROP_COLORS.stoneD, PROP_MATERIAL_KINDS.stone, {
      stone: !0,
      expo: 1,
    }),
  ),
    (a += 0.014),
    t.box(
      composeChildPropTransform(s, 0, a + 0.01, 0.118),
      0.15,
      0.02,
      0.125,
      createPropSurface(PROP_COLORS.stone, PROP_MATERIAL_KINDS.stone, {
        stone: !0,
        expo: 1,
      }),
    ),
    (a += 0.02));
  const l = 0.79;
  for (; a < l - 0.03;) {
    const f = i(0.026, 0.034);
    (o(-0.055, 0.055, 0.07, 0.17, a, f, smoothstep(0.55, 0.78, a)), (a += f));
  }
  const c = a + 0.008,
    h = (f, u, d, p) =>
      t.box(
        composeChildPropTransform(s, f, c, u, i(-0.04, 0.04)),
        d,
        0.016,
        p,
        createPropSurface(PROP_COLORS.stoneD, PROP_MATERIAL_KINDS.stone, {
          stone: !0,
          expo: 1,
          param: 0.5,
        }),
      );
  (h(0, 0.07 + 0.012, 0.135, 0.032),
    h(0, 0.17 - 0.012, 0.135, 0.032),
    h(-0.052, 0.12, 0.032, 0.07),
    h(0.052, 0.12, 0.032, 0.07),
    t.box(
      composeChildPropTransform(s, 0, c - 0.004, 0.12),
      0.07,
      0.016,
      0.068,
      createPropSurface(PROP_COLORS.soot, PROP_MATERIAL_KINDS.soot, {
        expo: 0,
      }),
    ),
    (props.chimneyTop = new ThreeVector3(0, c + 0.01, 0.12).applyMatrix4(s)),
    props.perches.push({
      x: props.chimneyTop.x + 0.03,
      y: props.chimneyTop.y + 0.006,
      z: props.chimneyTop.z,
      shelter: !1,
    }));
}
export { buildCabinChimney };
