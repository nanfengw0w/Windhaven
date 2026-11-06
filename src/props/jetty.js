import { TERRAIN_FOOTPATHS } from "../terrain/footpaths-and-masks.js";
import { LAKE_SHAPE, terrainHeight } from "../simulation/terrain-shape.js";
import { ThreeMatrix4, ThreeVector3 } from "../vendor/three-runtime.js";
import { PROP_COLORS, createPropSurface } from "./palette.js";
import {
  createPropColor,
  composeChildPropTransform,
  PROP_MATERIAL_KINDS,
} from "./geometry.js";
function buildJetty(props, t) {
  const e = props.R,
    i = TERRAIN_FOOTPATHS[0].pts,
    s = i[i.length - 1];
  let n = LAKE_SHAPE.cx - s.x,
    o = LAKE_SHAPE.cz - s.z;
  const a = Math.hypot(n, o);
  ((n /= a), (o /= a));
  const l = Math.atan2(-o, n),
    c = 0.262,
    h = new ThreeMatrix4().makeRotationY(l).setPosition(s.x, 0, s.z);
  ((props.jettyFrame = h),
    (props.jettyDir = {
      x: n,
      z: o,
      theta: l,
    }),
    (props.jettyDeckY = c));
  const f = -0.06,
    u = 0.8,
    d = 0.085,
    p = (m, w) => new ThreeVector3(m, 0, w).applyMatrix4(h),
    v = (m, w) => {
      const y = p(m, w);
      return terrainHeight(y.x, y.z);
    };
  let g = f;
  for (; g < u;) {
    const m = e(0.021, 0.026),
      w = d * 2 + e(-0.008, 0.012),
      y = PROP_COLORS.grey.clone().multiplyScalar(e(0.78, 1.12));
    (e(0, 1) < 0.15 && y.lerp(createPropColor("#7d6a52"), 0.5),
      t.box(
        composeChildPropTransform(
          h,
          g + m / 2,
          c - 0.004 + e(-0.0012, 0.0012),
          e(-0.004, 0.004),
          e(-0.025, 0.025),
          0,
          e(-0.01, 0.01),
        ),
        m - 0.0035,
        0.008,
        w,
        createPropSurface(y, PROP_MATERIAL_KINDS.grey, {
          expo: 1,
          grain: "z",
          pith: [e(0.02, 0.05), e(0.02, 0.05)],
        }),
      ),
      (g += m + e(0.003, 0.0055)));
  }
  for (const m of [-0.055, 0.055])
    t.box(
      composeChildPropTransform(h, (f + u) / 2, c - 0.018, m),
      u - f,
      0.02,
      0.014,
      createPropSurface(
        PROP_COLORS.grey.clone().multiplyScalar(0.8),
        PROP_MATERIAL_KINDS.grey,
        {
          expo: 0.3,
          grain: "x",
          pith: [0.03, 0.03],
        },
      ),
    );
  const x = [0.1, 0.34, 0.57, 0.78];
  props.jettyPosts = [];
  for (const m of x) {
    const w = m === x[x.length - 1];
    for (const y of [-d + 0.006, d - 0.006]) {
      const _ = v(m, y),
        M = c + (w ? 0.06 : 0.004),
        A = e(0.0105, 0.0125);
      if (
        (t.cylinder(
          h,
          m,
          _ - 0.05,
          y,
          m + e(-0.003, 0.003),
          M,
          y + e(-0.003, 0.003),
          A,
          8,
          createPropSurface(
            PROP_COLORS.grey.clone().multiplyScalar(e(0.7, 0.9)),
            PROP_MATERIAL_KINDS.grey,
            {
              expo: 1,
              param: A,
              capMat: createPropSurface(
                PROP_COLORS.grey,
                PROP_MATERIAL_KINDS.grey,
                {
                  expo: 1,
                },
              ),
            },
          ),
        ),
        w)
      ) {
        const b = p(m, y);
        (props.jettyPosts.push({
          x: b.x,
          y: M,
          z: b.z,
          l: y,
        }),
          props.perches.push({
            x: b.x,
            y: M + 0.004,
            z: b.z,
            shelter: !1,
          }));
      }
    }
    t.box(
      composeChildPropTransform(h, m, c - 0.034, 0),
      0.016,
      0.014,
      d * 2 + 0.01,
      createPropSurface(
        PROP_COLORS.grey.clone().multiplyScalar(0.75),
        PROP_MATERIAL_KINDS.grey,
        {
          expo: 0.3,
          grain: "z",
          pith: [0.03, 0.02],
        },
      ),
    );
  }
  for (let m = 0; m < x.length - 1; m++)
    for (const w of [-d + 0.002, d - 0.002]) {
      const y = x[m],
        _ = x[m + 1],
        M = c - 0.03,
        A = Math.max(v(_, w), 0.02) + 0.03;
      t.cylinder(
        h,
        y,
        M,
        w,
        _,
        A,
        w,
        0.0055,
        5,
        createPropSurface(
          PROP_COLORS.grey.clone().multiplyScalar(0.7),
          PROP_MATERIAL_KINDS.grey,
          {
            expo: 0.6,
          },
        ),
      );
    }
  for (let m = 0; m < 3; m++) {
    const w = f - 0.05 - m * 0.07,
      y = e(-0.03, 0.03),
      _ = v(w, y);
    t.box(
      composeChildPropTransform(h, w, _ + 0.004, y, e(0, 3)),
      e(0.05, 0.07),
      0.016,
      e(0.045, 0.06),
      createPropSurface(
        PROP_COLORS.stoneW.clone().multiplyScalar(e(0.8, 1.05)),
        PROP_MATERIAL_KINDS.stone,
        {
          stone: !0,
          expo: 1,
        },
      ),
    );
  }
  {
    const w = d - 0.03;
    for (let y = 0; y < 3; y++) {
      const _ = 0.016 - y * 0.004,
        M = 10;
      for (let A = 0; A < M; A++) {
        const b = (A / M) * Math.PI * 2,
          S = ((A + 1) / M) * Math.PI * 2;
        t.cylinder(
          h,
          0.7 + Math.cos(b) * _,
          c + 0.003 + y * 0.003,
          w + Math.sin(b) * _,
          0.7 + Math.cos(S) * _,
          c + 0.003 + y * 0.003,
          w + Math.sin(S) * _,
          0.0028,
          4,
          createPropSurface(PROP_COLORS.rope, PROP_MATERIAL_KINDS.rope, {
            expo: 0.8,
          }),
          !1,
        );
      }
    }
  }
  ((props.jettyEnd = p(u, 0)),
    (props.boatHome = p(0.53, d + 0.095)),
    (props.boatHome.y = 0),
    (props.boatYaw = l),
    (props.boatRopeAnchor = new ThreeVector3(
      props.jettyPosts.find((m) => m.l > 0)?.x ?? props.jettyEnd.x,
      c + 0.045,
      props.jettyPosts.find((m) => m.l > 0)?.z ?? props.jettyEnd.z,
    )));
}
export { buildJetty };
