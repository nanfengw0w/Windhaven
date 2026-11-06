import {
  CABIN_ROOF_PITCH,
  CABIN_ROOF_FRONT_OVERHANG,
  CABIN_ROOF_BACK_OVERHANG,
  CABIN_HALF_DEPTH,
  CABIN_ROOF_RIDGE_Y,
  CABIN_ROOF_DECK_THICKNESS,
  CABIN_ROOF_LEFT_EXTENT,
  CABIN_ROOF_RIGHT_EXTENT,
} from "./cabin-dimensions.js";
import { ThreeVector3 } from "../vendor/three-runtime.js";
import { createPropSurface, PROP_COLORS } from "./palette.js";
import { PROP_MATERIAL_KINDS, composeChildPropTransform } from "./geometry.js";
import { CABIN_PLACEMENT } from "../simulation/terrain-shape.js";
function buildCabinRoof(props, t) {
  const e = props.cabinFrame,
    i = props.R,
    s = 0.034,
    n = 0.0055,
    o = Math.sin(CABIN_ROOF_PITCH),
    a = Math.cos(CABIN_ROOF_PITCH),
    l = new ThreeVector3();
  for (const c of [1, -1]) {
    const h = c > 0 ? CABIN_ROOF_FRONT_OVERHANG : CABIN_ROOF_BACK_OVERHANG,
      f = c * (CABIN_HALF_DEPTH + h),
      u = Math.abs(f) / a,
      d = CABIN_ROOF_RIDGE_Y + CABIN_ROOF_DECK_THICKNESS / a,
      p = [0, a, c * o];
    l.set(p[0], p[1], p[2]).applyMatrix3(props.cabinRot).normalize();
    const v = (b, S, E) => [
        b + p[0] * E,
        d - S * o + p[1] * E,
        c * S * a + p[2] * E,
      ],
      g = Math.ceil(u / s),
      x = 14,
      m = createPropSurface(PROP_COLORS.shingle, PROP_MATERIAL_KINDS.roof, {
        expo: 1,
        seed: c,
      });
    for (let b = 0; b < g; b++) {
      const S = u - b * s,
        E = Math.max(0, S - s),
        T = (n * (S - E)) / s;
      for (let R = 0; R < x; R++) {
        const z =
            -CABIN_ROOF_LEFT_EXTENT +
            ((CABIN_ROOF_LEFT_EXTENT + CABIN_ROOF_RIGHT_EXTENT) * R) / x,
          L =
            -CABIN_ROOF_LEFT_EXTENT +
            ((CABIN_ROOF_LEFT_EXTENT + CABIN_ROOF_RIGHT_EXTENT) * (R + 1)) / x,
          k =
            c > 0
              ? [v(z, S, T), v(L, S, T), v(L, E, 0), v(z, E, 0)]
              : [v(L, S, T), v(z, S, T), v(z, E, 0), v(L, E, 0)],
          U = c > 0 ? [z, L, L, z] : [L, z, z, L],
          F = [S, S, E, E],
          G = [T, T, 0, 0];
        t.quad(
          e,
          k,
          U.map((q, X) => [q, F[X], b]),
          m,
          G.map((q) => [l.x, l.y, l.z, q]),
        );
        const B =
          c > 0
            ? [v(z, S, 0), v(L, S, 0), v(L, S, T), v(z, S, T)]
            : [v(L, S, 0), v(z, S, 0), v(z, S, T), v(L, S, T)];
        t.quad(
          e,
          B,
          (c > 0 ? [z, L, L, z] : [L, z, z, L]).map((q, X) => [
            q,
            S + 0.001,
            b,
          ]),
          m,
          [0, 0, T, T].map((q) => [l.x, l.y, l.z, q]),
        );
      }
    }
    const w = u / 2,
      y = c * CABIN_ROOF_PITCH,
      _ = composeChildPropTransform(
        e,
        (CABIN_ROOF_RIGHT_EXTENT - CABIN_ROOF_LEFT_EXTENT) / 2,
        CABIN_ROOF_RIDGE_Y + CABIN_ROOF_DECK_THICKNESS / 2 / a - w * o,
        c * w * a,
        0,
        y,
      );
    t.box(
      _,
      CABIN_ROOF_LEFT_EXTENT + CABIN_ROOF_RIGHT_EXTENT,
      CABIN_ROOF_DECK_THICKNESS,
      u + 0.004,
      createPropSurface(PROP_COLORS.plank, PROP_MATERIAL_KINDS.plank, {
        expo: 0.1,
        grain: "z",
        param: 0.03,
        pith: [0.03, 0.02],
        skip: "py",
      }),
    );
    const M = CABIN_ROOF_RIDGE_Y - u * o,
      A = c * u * a;
    t.box(
      composeChildPropTransform(
        e,
        (CABIN_ROOF_RIGHT_EXTENT - CABIN_ROOF_LEFT_EXTENT) / 2,
        M + 0.009,
        A + c * 0.004,
      ),
      CABIN_ROOF_LEFT_EXTENT + CABIN_ROOF_RIGHT_EXTENT + 0.02,
      0.03,
      0.008,
      createPropSurface(PROP_COLORS.plankL, PROP_MATERIAL_KINDS.plank, {
        expo: 0.7,
        grain: "x",
        pith: [0.02, 0.02],
      }),
    );
    for (const b of [
      -CABIN_ROOF_LEFT_EXTENT - 0.005,
      CABIN_ROOF_RIGHT_EXTENT + 0.005,
    ])
      t.box(
        composeChildPropTransform(
          e,
          b,
          CABIN_ROOF_RIDGE_Y + 0.004 - w * o,
          c * w * a,
          0,
          y,
        ),
        0.01,
        0.036,
        u + 0.02,
        createPropSurface(PROP_COLORS.plankL, PROP_MATERIAL_KINDS.plank, {
          expo: 0.7,
          grain: "z",
          pith: [0.02, 0.02],
        }),
      );
    t.box(
      composeChildPropTransform(
        e,
        (CABIN_ROOF_RIGHT_EXTENT - CABIN_ROOF_LEFT_EXTENT) / 2,
        d + 0.004 - 0.012 * o,
        c * 0.012 * a,
        0,
        y,
      ),
      CABIN_ROOF_LEFT_EXTENT + CABIN_ROOF_RIGHT_EXTENT + 0.016,
      0.006,
      0.03,
      createPropSurface(PROP_COLORS.grey, PROP_MATERIAL_KINDS.grey, {
        expo: 1,
        grain: "x",
        pith: [0.02, 0.02],
      }),
    );
  }
  for (const c of [-0.25, 0.02, 0.28]) {
    const h = props.cabinPoint(
      c + i(-0.03, 0.03),
      CABIN_ROOF_RIDGE_Y +
        CABIN_ROOF_DECK_THICKNESS / Math.cos(CABIN_ROOF_PITCH) +
        0.012,
      0,
    );
    props.perches.push({
      x: h.x,
      y: h.y,
      z: h.z,
      shelter: !1,
      roof: !0,
    });
  }
  props.ridgeY = CABIN_PLACEMENT.y + CABIN_ROOF_RIDGE_Y;
}
export { buildCabinRoof };
