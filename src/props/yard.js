import { TERRAIN_FOOTPATHS } from "../terrain/footpaths-and-masks.js";
import { terrainHeight, CABIN_PLACEMENT } from "../simulation/terrain-shape.js";
import {
  composeChildPropTransform,
  PROP_MATERIAL_KINDS,
  createPropColor,
} from "./geometry.js";
import { createPropSurface, PROP_COLORS } from "./palette.js";
import { CABIN_HALF_WIDTH, CABIN_HALF_DEPTH } from "./cabin-dimensions.js";
function distanceToRiverBank(r, t) {
  let e = 1 / 0;
  for (const i of TERRAIN_FOOTPATHS)
    for (const s of i.pts)
      e = Math.min(e, Math.hypot(s.x - r, s.z - t) - i.width * 0.5);
  return e;
}
function buildYard(props, t) {
  const e = props.cabinFrame,
    i = props.R,
    s = (n, o) => {
      const a = props.cabinPoint(n, 0, o);
      return terrainHeight(a.x, a.z) - CABIN_PLACEMENT.y;
    };
  {
    const a = s(-0.56, 0.5),
      l = composeChildPropTransform(e, -0.56, a, 0.5),
      c = 0.034;
    t.cylinder(
      l,
      0,
      -0.01,
      0,
      0,
      0.042,
      0,
      [c * 1.08, c],
      9,
      createPropSurface(PROP_COLORS.bark, PROP_MATERIAL_KINDS.bark, {
        expo: 1,
        param: c,
        capMat: createPropSurface(
          PROP_COLORS.plankL,
          PROP_MATERIAL_KINDS.bark,
          {
            expo: 1,
          },
        ),
      }),
    );
    const h = composeChildPropTransform(l, 0.006, 0.05, 0.002, 0.6, 0, -0.55);
    (t.box(
      composeChildPropTransform(h, 0, 0.03, 0),
      0.006,
      0.07,
      0.006,
      createPropSurface(createPropColor("#a07a50"), PROP_MATERIAL_KINDS.plank, {
        expo: 1,
        grain: "y",
        pith: [0.01, 0.01],
      }),
    ),
      t.box(
        composeChildPropTransform(h, 0.007, 0, 0),
        0.02,
        0.014,
        0.004,
        createPropSurface(PROP_COLORS.iron, PROP_MATERIAL_KINDS.metal, {
          expo: 1,
        }),
      ));
    for (let f = 0; f < 4; f++) {
      const u = i(0, Math.PI * 2),
        d = i(0.05, 0.1),
        p = Math.cos(u) * d,
        v = Math.sin(u) * d,
        g = i(0.008, 0.012),
        x = composeChildPropTransform(
          l,
          p,
          s(-0.56 + p, 0.5 + v) - a + g * 0.7,
          v,
          i(0, Math.PI),
        );
      t.cylinder(
        x,
        -0.03,
        0,
        0,
        0.03,
        0,
        0,
        g,
        5,
        createPropSurface(PROP_COLORS.barkL, PROP_MATERIAL_KINDS.bark, {
          expo: 1,
          param: g,
          twist: i(0, 6),
          capMat: createPropSurface(
            PROP_COLORS.plankL,
            PROP_MATERIAL_KINDS.bark,
            {
              expo: 1,
            },
          ),
        }),
      );
    }
    for (let f = 0; f < 10; f++) {
      const u = i(0, Math.PI * 2),
        d = i(0.04, 0.12),
        p = Math.cos(u) * d,
        v = Math.sin(u) * d;
      t.box(
        composeChildPropTransform(
          l,
          p,
          s(-0.56 + p, 0.5 + v) - a + 0.002,
          v,
          i(0, 3),
        ),
        i(0.006, 0.012),
        0.003,
        i(0.004, 0.008),
        createPropSurface(PROP_COLORS.plankL, PROP_MATERIAL_KINDS.plank, {
          expo: 1,
        }),
      );
    }
    props.perches.push({
      ...props._wp(l, 0, 0.044, -0.012),
      shelter: !1,
    });
  }
  {
    const n = CABIN_HALF_WIDTH + 0.07,
      o = CABIN_HALF_DEPTH + 0.07,
      a = s(n, o),
      l = composeChildPropTransform(e, n, a, o),
      c = 0.036;
    (t.cylinder(
      l,
      0,
      0,
      0,
      0,
      0.092,
      0,
      [c * 0.9, c * 0.9],
      14,
      createPropSurface(PROP_COLORS.plank, PROP_MATERIAL_KINDS.plank, {
        expo: 0.5,
        param: 0.012,
        grain: "x",
      }),
      !1,
    ),
      t.cylinder(
        l,
        0,
        0.03,
        0,
        0,
        0.062,
        0,
        [c * 0.93, c * 0.93],
        14,
        createPropSurface(PROP_COLORS.plank, PROP_MATERIAL_KINDS.plank, {
          expo: 0.5,
          param: 0.012,
        }),
        !1,
      ));
    for (const h of [0.012, 0.046, 0.08])
      t.cylinder(
        l,
        0,
        h - 0.003,
        0,
        0,
        h + 0.003,
        0,
        c * 0.92 + 0.0015,
        14,
        createPropSurface(PROP_COLORS.iron, PROP_MATERIAL_KINDS.metal, {
          expo: 0.6,
        }),
        !1,
      );
    (t.cylinder(
      l,
      0,
      0.082,
      0,
      0,
      0.083,
      0,
      c * 0.86,
      14,
      createPropSurface(createPropColor("#1d2a2e"), PROP_MATERIAL_KINDS.soot, {
        expo: 0,
      }),
    ),
      props.perches.push({
        ...props._wp(l, c * 0.85, 0.094, 0),
        shelter: !1,
      }));
  }
  {
    const n = [
        [-0.55, -0.42],
        [-0.78, -0.12],
        [-0.86, 0.24],
        [-0.84, 0.6],
        [-0.66, 0.92],
        [-0.42, 1.08],
      ],
      o = [];
    for (const [a, l] of n) {
      const c = props.cabinPoint(a, 0, l);
      if (distanceToRiverBank(c.x, c.z) < 0.08) continue;
      const h = s(a, l),
        f = i(0.1, 0.115),
        u = composeChildPropTransform(e, a, h, l, i(0, 3));
      (t.box(
        composeChildPropTransform(
          u,
          0,
          f / 2 - 0.012,
          0,
          0,
          i(-0.05, 0.05),
          i(-0.05, 0.05),
        ),
        0.016,
        f + 0.024,
        0.016,
        createPropSurface(
          PROP_COLORS.grey.clone().multiplyScalar(i(0.75, 1)),
          PROP_MATERIAL_KINDS.grey,
          {
            expo: 1,
            grain: "y",
            pith: [0.01, 0.015],
          },
        ),
      ),
        o.push({
          lx: a,
          lz: l,
          gy: h,
          h: f,
        }),
        props.perches.push({
          ...props._wp(e, a, h + f + 0.004, l),
          shelter: !1,
        }));
    }
    for (let a = 0; a < o.length - 1; a++) {
      const l = o[a],
        c = o[a + 1];
      for (const h of [0.045, 0.085]) {
        const f = l.gy + h + i(-0.004, 0.004),
          u = c.gy + h + i(-0.004, 0.004);
        t.cylinder(
          e,
          l.lx,
          f,
          l.lz,
          c.lx,
          u,
          c.lz,
          i(0.0065, 0.008),
          5,
          createPropSurface(
            PROP_COLORS.grey.clone().multiplyScalar(i(0.8, 1.05)),
            PROP_MATERIAL_KINDS.grey,
            {
              expo: 1,
              twist: i(0, 6),
            },
          ),
        );
      }
    }
  }
  {
    const n = [[0.235, 0.478]];
    for (const [o, a] of n) {
      const l = s(o, a);
      t.box(
        composeChildPropTransform(e, o, l + 0.004, a, i(0, 3)),
        i(0.05, 0.065),
        0.016,
        i(0.04, 0.05),
        createPropSurface(
          PROP_COLORS.stoneW.clone().multiplyScalar(i(0.85, 1.05)),
          PROP_MATERIAL_KINDS.stone,
          {
            stone: !0,
            expo: 1,
          },
        ),
      );
    }
  }
}
export { buildYard };
