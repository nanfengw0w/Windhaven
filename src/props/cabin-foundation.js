import { PROP_COLORS, createPropSurface } from "./palette.js";
import {
  CABIN_HALF_WIDTH,
  CABIN_HALF_DEPTH,
  CABIN_ROOF_FRONT_OVERHANG,
  CABIN_ROOF_WALL_Y,
  CABIN_ROOF_SLOPE,
} from "./cabin-dimensions.js";
import { PROP_MATERIAL_KINDS, composeChildPropTransform } from "./geometry.js";
function buildCabinFoundation(props, t) {
  const e = props.cabinFrame,
    i = props.R,
    s = [PROP_COLORS.stone, PROP_COLORS.stoneW, PROP_COLORS.stoneD],
    n = CABIN_HALF_WIDTH + 0.025,
    o = CABIN_HALF_DEPTH + 0.025;
  for (let u = 0; u < 2; u++) {
    const d = -0.03 + u * 0.042,
      p = 0.042,
      v = [
        [-n, n, o, "x", 1],
        [-n, n, -o, "x", -1],
        [-o, o, n, "z", 1],
        [-o, o, -n, "z", -1],
      ];
    for (const [g, x, m, w, y] of v) {
      let _ = g - i(0, 0.03);
      for (; _ < x;) {
        const M = Math.min(i(0.045, 0.085), x + 0.02 - _),
          A = _ + M / 2,
          b = s[Math.floor(i(0, 3))].clone().multiplyScalar(i(0.8, 1.12)),
          S = createPropSurface(b, PROP_MATERIAL_KINDS.stone, {
            stone: !0,
            expo: 0.85,
          }),
          E = 0.045,
          T = i(-0.003, 0.003);
        (w === "x"
          ? t.box(
              composeChildPropTransform(
                e,
                A,
                d + p / 2,
                m - (y * E) / 2 + y * (0.01 + T),
                i(-0.05, 0.05),
                i(-0.03, 0.03),
              ),
              M - 0.005,
              p - i(0.004, 0.008),
              E,
              S,
            )
          : t.box(
              composeChildPropTransform(
                e,
                m - (y * E) / 2 + y * (0.01 + T),
                d + p / 2,
                A,
                i(-0.05, 0.05),
                0,
                i(-0.03, 0.03),
              ),
              E,
              p - i(0.004, 0.008),
              M - 0.005,
              S,
            ),
          (_ += M));
      }
    }
  }
  t.box(
    composeChildPropTransform(e, 0, 0.012, 0),
    n * 2 - 0.03,
    0.08,
    o * 2 - 0.03,
    createPropSurface(PROP_COLORS.mortar, PROP_MATERIAL_KINDS.mortar, {
      expo: 0.2,
    }),
  );
  const a = CABIN_HALF_DEPTH + 0.035,
    l = CABIN_HALF_DEPTH + CABIN_ROOF_FRONT_OVERHANG - 0.004,
    c = 0.062,
    h = 4;
  for (let u = 0; u < h; u++) {
    const d = a + ((u + 0.5) * (l - a)) / h;
    t.box(
      composeChildPropTransform(
        e,
        i(-0.004, 0.004),
        c - 0.004 + i(-0.001, 0.001),
        d,
        i(-0.006, 0.006),
      ),
      CABIN_HALF_WIDTH * 2 + 0.05 + i(-0.01, 0.01),
      0.008,
      (l - a) / h - 0.003,
      createPropSurface(
        PROP_COLORS.plankL.clone().multiplyScalar(i(0.85, 1.08)),
        PROP_MATERIAL_KINDS.plank,
        {
          expo: 0.15,
          grain: "x",
          pith: [i(0.02, 0.05), i(0.02, 0.04)],
        },
      ),
    );
  }
  t.box(
    composeChildPropTransform(e, 0, c - 0.03, l - 0.004),
    CABIN_HALF_WIDTH * 2 + 0.05,
    0.05,
    0.01,
    createPropSurface(PROP_COLORS.plank, PROP_MATERIAL_KINDS.plank, {
      expo: 0.4,
      grain: "x",
      pith: [0.03, 0.02],
    }),
  );
  const f = CABIN_ROOF_WALL_Y - CABIN_ROOF_FRONT_OVERHANG * CABIN_ROOF_SLOPE;
  for (const u of [-CABIN_HALF_WIDTH + 0.01, CABIN_HALF_WIDTH - 0.01]) {
    const d = createPropSurface(PROP_COLORS.plank, PROP_MATERIAL_KINDS.plank, {
      expo: 0.4,
      grain: "y",
      pith: [0.02, 0.025],
    });
    (t.box(
      composeChildPropTransform(e, u, (c + f) / 2, l - 0.012),
      0.019,
      f - c,
      0.019,
      d,
    ),
      t.box(
        composeChildPropTransform(
          e,
          u + (u < 0 ? 0.022 : -0.022),
          f - 0.024,
          l - 0.012,
          0,
          0,
          u < 0 ? -0.75 : 0.75,
        ),
        0.008,
        0.06,
        0.008,
        d,
      ),
      t.box(
        composeChildPropTransform(e, u, -0.004, l - 0.012),
        0.034,
        0.03,
        0.034,
        createPropSurface(PROP_COLORS.stoneW, PROP_MATERIAL_KINDS.stone, {
          stone: !0,
          expo: 0.6,
        }),
      ));
  }
  t.box(
    composeChildPropTransform(e, 0, f - 0.006, l - 0.012),
    CABIN_HALF_WIDTH * 2 + 0.03,
    0.014,
    0.016,
    createPropSurface(PROP_COLORS.plank, PROP_MATERIAL_KINDS.plank, {
      expo: 0.2,
      grain: "x",
      pith: [0.02, 0.02],
    }),
  );
  {
    let p = c;
    for (let v = 0; v < 7; v++) {
      const g = i(0.0105, 0.0125);
      p += g;
      let x = 0.262 + (v % 2) * 0.004;
      for (; x + g * 2 < 0.328 + 0.004;) {
        const m = g * i(0.86, 1.1),
          w = x + m,
          y = PROP_COLORS.plankL.clone().multiplyScalar(i(0.85, 1.12)),
          _ = createPropSurface(
            PROP_COLORS.bark.clone().lerp(PROP_COLORS.barkL, i(0, 1)),
            PROP_MATERIAL_KINDS.bark,
            {
              expo: 0.15,
              param: m,
              twist: i(0, 6.3),
              capMat: createPropSurface(y, PROP_MATERIAL_KINDS.bark, {
                expo: 0.15,
              }),
            },
          );
        (t.cylinder(
          e,
          w,
          p + i(-0.0015, 0.0015),
          a + 0.002 + i(0, 0.004),
          w + i(-0.003, 0.003),
          p + i(-0.0015, 0.0015),
          l - 0.004 - i(0, 0.006),
          m,
          Math.floor(i(5, 8)),
          _,
        ),
          (x += m * 2 + 8e-4));
      }
      p += g * 0.82;
    }
    (props.perches.push({
      ...props._wp(e, 0.295, p + 0.006, (a + l) / 2),
      shelter: !0,
    }),
      props.perches.push({
        ...props._wp(e, -0.2, c + 0.004, l - 0.02),
        shelter: !0,
      }));
  }
}
export { buildCabinFoundation };
