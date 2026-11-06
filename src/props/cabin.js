import { composeChildPropTransform, PROP_MATERIAL_KINDS } from "./geometry.js";
import {
  CABIN_HALF_DEPTH,
  CABIN_HALF_WIDTH,
  CABIN_WALL_BASE_Y,
  CABIN_LOG_RADIUS,
  CABIN_LOG_COURSE_SPACING,
  CABIN_LOG_END_OVERHANG,
  CABIN_ROOF_WALL_Y,
  CABIN_ROOF_SLOPE,
  CABIN_ROOF_RIDGE_Y,
} from "./cabin-dimensions.js";
import { PROP_COLORS, createPropSurface } from "./palette.js";
import { buildCabinOpening } from "./cabin-openings.js";
import { buildCabinRoof } from "./cabin-roof.js";
import { buildCabinChimney } from "./cabin-chimney.js";
import { buildCabinFoundation } from "./cabin-foundation.js";
function buildCabin(props, t) {
  const e = props.cabinFrame,
    i = props.R,
    s = [
      {
        name: "front",
        m: composeChildPropTransform(e, 0, 0, CABIN_HALF_DEPTH, 0),
        half: CABIN_HALF_WIDTH,
        open: [
          {
            x0: 0.06,
            x1: 0.2,
            y0: CABIN_WALL_BASE_Y,
            y1: 0.285,
            door: !0,
          },
          {
            x0: -0.24,
            x1: -0.1,
            y0: 0.135,
            y1: 0.255,
            win: 0,
            shutters: !0,
            box: !0,
          },
        ],
        off: 0,
      },
      {
        name: "back",
        m: composeChildPropTransform(e, 0, 0, -CABIN_HALF_DEPTH, Math.PI),
        half: CABIN_HALF_WIDTH,
        open: [
          {
            x0: -0.09,
            x1: 0.05,
            y0: 0.135,
            y1: 0.255,
            win: 1,
          },
        ],
        off: 0,
      },
      {
        name: "left",
        m: composeChildPropTransform(e, -CABIN_HALF_WIDTH, 0, 0, -Math.PI / 2),
        half: CABIN_HALF_DEPTH,
        open: [
          {
            x0: -0.215,
            x1: -0.125,
            y0: 0.15,
            y1: 0.25,
            win: 2,
          },
        ],
        off: 0.5,
      },
      {
        name: "right",
        m: composeChildPropTransform(e, CABIN_HALF_WIDTH, 0, 0, Math.PI / 2),
        half: CABIN_HALF_DEPTH,
        open: [
          {
            x0: -0.06,
            x1: 0.06,
            y0: 0.135,
            y1: 0.255,
            win: 3,
            shutters: !0,
          },
        ],
        off: 0.5,
      },
    ];
  props.walls = s;
  for (const n of s) {
    for (let l = 0; l < 6; l++) {
      const c =
        CABIN_WALL_BASE_Y +
        CABIN_LOG_RADIUS +
        (l + n.off) * CABIN_LOG_COURSE_SPACING;
      let h = [
        [
          -n.half - CABIN_LOG_END_OVERHANG - i(0, 0.012),
          n.half + CABIN_LOG_END_OVERHANG + i(0, 0.012),
        ],
      ];
      for (const u of n.open)
        if (
          c + CABIN_LOG_RADIUS * 0.6 > u.y0 &&
          c - CABIN_LOG_RADIUS * 0.6 < u.y1
        ) {
          const d = [];
          for (const [p, v] of h) {
            if (u.x1 <= p || u.x0 >= v) {
              d.push([p, v]);
              continue;
            }
            (u.x0 - p > 0.02 && d.push([p, u.x0]),
              v - u.x1 > 0.02 && d.push([u.x1, v]));
          }
          h = d;
        }
      const f = [PROP_COLORS.log, PROP_COLORS.logB, PROP_COLORS.logC][
        Math.floor(i(0, 3))
      ]
        .clone()
        .multiplyScalar(i(0.88, 1.1));
      for (const [u, d] of h) {
        const p = CABIN_LOG_RADIUS * i(0.94, 1.06),
          v = 0.35 + 0.25 * (1 - l / 6);
        t.cylinder(
          n.m,
          u,
          c,
          0,
          d,
          c + i(-0.002, 0.002),
          0,
          p,
          10,
          createPropSurface(f, PROP_MATERIAL_KINDS.log, {
            expo: v,
            param: p,
            pith: [i(-0.003, 0.003), i(-0.003, 0.003)],
          }),
        );
      }
    }
    const o =
        CABIN_WALL_BASE_Y +
        6 * CABIN_LOG_COURSE_SPACING +
        n.off * CABIN_LOG_COURSE_SPACING,
      a = composeChildPropTransform(
        n.m,
        0,
        (CABIN_WALL_BASE_Y + o) / 2,
        -0.001,
      );
    t.box(
      a,
      n.half * 2 + 0.01,
      o - CABIN_WALL_BASE_Y,
      0.012,
      createPropSurface(PROP_COLORS.chink, PROP_MATERIAL_KINDS.mortar, {
        expo: 0.2,
        skip: "nz",
      }),
    );
    for (const l of n.open) buildCabinOpening(props, t, n, l);
  }
  for (const n of [CABIN_HALF_DEPTH, -CABIN_HALF_DEPTH]) {
    const o = composeChildPropTransform(e, 0, 0.358, n + Math.sign(n) * 0.004);
    t.box(
      o,
      CABIN_HALF_WIDTH * 2 + 0.08,
      0.034,
      0.03,
      createPropSurface(PROP_COLORS.plank, PROP_MATERIAL_KINDS.plank, {
        expo: 0.15,
        grain: "x",
        pith: [0.03, 0.02],
      }),
    );
  }
  for (const n of [s[2], s[3]]) {
    const o = CABIN_ROOF_WALL_Y - 0.02 * CABIN_ROOF_SLOPE - 0.012,
      a = CABIN_HALF_DEPTH + 0.02,
      l = CABIN_ROOF_RIDGE_Y - 0.005,
      c = createPropSurface(PROP_COLORS.plank, PROP_MATERIAL_KINDS.plank, {
        expo: 0.3,
        param: 0.032,
      }),
      h = 0.004;
    t.tri(
      n.m,
      [
        [-a, o, h],
        [a, o, h],
        [0, l, h],
      ],
      [
        [o, -a, 0.04],
        [o, a, 0.04],
        [l, 0, 0.04],
      ],
      c,
    );
    for (let f = -a + 0.032; f < a - 0.01; f += 0.032) {
      const u = l - Math.abs(f) * CABIN_ROOF_SLOPE - 0.006;
      u - o < 0.02 ||
        t.box(
          composeChildPropTransform(n.m, f, (o + u) / 2, h + 0.004),
          0.007,
          u - o,
          0.006,
          createPropSurface(PROP_COLORS.plankL, PROP_MATERIAL_KINDS.plank, {
            expo: 0.3,
            grain: "y",
            pith: [0.02, 0.03],
          }),
        );
    }
    n.name === "right" &&
      (t.box(
        composeChildPropTransform(n.m, 0, 0.47, h + 0.006),
        0.05,
        0.03,
        0.006,
        createPropSurface(PROP_COLORS.trim, PROP_MATERIAL_KINDS.paint, {
          expo: 0.3,
          grain: "x",
        }),
      ),
      t.box(
        composeChildPropTransform(n.m, 0, 0.47, h + 0.008),
        0.04,
        0.02,
        0.004,
        createPropSurface(PROP_COLORS.soot, PROP_MATERIAL_KINDS.soot, {
          expo: 0,
        }),
      ));
  }
  (buildCabinRoof(props, t),
    buildCabinChimney(props, t),
    buildCabinFoundation(props, t));
}
export { buildCabin };
