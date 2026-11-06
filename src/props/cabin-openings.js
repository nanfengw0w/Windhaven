import { createPropSurface, PROP_COLORS } from "./palette.js";
import {
  PROP_MATERIAL_KINDS,
  composeChildPropTransform,
  createPropColor,
} from "./geometry.js";
import { CABIN_LOG_RADIUS } from "./cabin-dimensions.js";
import { ThreeVector3 } from "../vendor/three-runtime.js";
function buildCabinOpening(props, t, e, i) {
  const s = props.R,
    n = e.m,
    o = (i.x0 + i.x1) / 2,
    a = (i.y0 + i.y1) / 2,
    l = i.x1 - i.x0,
    c = i.y1 - i.y0,
    h = 0.012,
    f = createPropSurface(
      i.door ? PROP_COLORS.plankL : PROP_COLORS.trim,
      i.door ? PROP_MATERIAL_KINDS.plank : PROP_MATERIAL_KINDS.paint,
      {
        expo: 0.3,
        grain: "y",
        pith: [0.02, 0.03],
      },
    );
  (t.box(
    composeChildPropTransform(n, i.x0 - h / 2, a, 0.001),
    h,
    c + h * 2,
    0.048,
    f,
  ),
    t.box(
      composeChildPropTransform(n, i.x1 + h / 2, a, 0.001),
      h,
      c + h * 2,
      0.048,
      f,
    ),
    t.box(
      composeChildPropTransform(n, o, i.y1 + h / 2, 0.001),
      l + h * 2,
      h,
      0.048,
      {
        ...f,
        grain: "x",
      },
    ),
    i.door ||
      t.box(
        composeChildPropTransform(n, o, i.y0 - h / 2, 0.001),
        l + h * 2,
        h,
        0.048,
        {
          ...f,
          grain: "x",
        },
      ));
  const u = CABIN_LOG_RADIUS + 0.004,
    d = 0.006,
    p = 0.014;
  if (
    (t.box(
      composeChildPropTransform(n, i.x0 - h - p / 2 + 0.004, a + 0.002, u),
      p,
      c + h * 2 + p,
      d,
      f,
    ),
    t.box(
      composeChildPropTransform(n, i.x1 + h + p / 2 - 0.004, a + 0.002, u),
      p,
      c + h * 2 + p,
      d,
      f,
    ),
    t.box(
      composeChildPropTransform(n, o, i.y1 + h + p / 2 - 0.002, u),
      l + h * 2 + p * 2,
      p,
      d,
      {
        ...f,
        grain: "x",
      },
    ),
    t.box(
      composeChildPropTransform(n, o, i.y1 + h + p + 0.002, u + 0.004),
      l + h * 2 + p * 2 + 0.01,
      0.005,
      0.016,
      {
        ...f,
        grain: "x",
        expo: 0.8,
      },
    ),
    i.door)
  ) {
    const x = createPropSurface(PROP_COLORS.door, PROP_MATERIAL_KINDS.paint, {
      expo: 0.25,
      param: 0.029,
      grain: "y",
      pith: [0, 0.03],
    });
    t.box(composeChildPropTransform(n, o, a, 0.008), l, c, 0.012, x);
    const m = createPropSurface(
      PROP_COLORS.door.clone().multiplyScalar(0.85),
      PROP_MATERIAL_KINDS.paint,
      {
        expo: 0.25,
        grain: "x",
        pith: [0.02, 0.03],
      },
    );
    (t.box(
      composeChildPropTransform(n, o, i.y0 + 0.04, 0.016),
      l - 0.016,
      0.018,
      0.006,
      m,
    ),
      t.box(
        composeChildPropTransform(n, o, i.y1 - 0.04, 0.016),
        l - 0.016,
        0.018,
        0.006,
        m,
      ));
    const w = Math.atan2(c - 0.08, l - 0.03);
    t.box(
      composeChildPropTransform(n, o, a, 0.016, 0, 0, w),
      Math.hypot(c - 0.08, l - 0.03) - 0.01,
      0.016,
      0.006,
      m,
    );
    const y = createPropSurface(PROP_COLORS.iron, PROP_MATERIAL_KINDS.metal, {
      expo: 0.3,
    });
    (t.box(
      composeChildPropTransform(n, i.x0 + 0.03, i.y0 + 0.04, 0.021),
      0.05,
      0.007,
      0.003,
      y,
    ),
      t.box(
        composeChildPropTransform(n, i.x0 + 0.03, i.y1 - 0.04, 0.021),
        0.05,
        0.007,
        0.003,
        y,
      ),
      t.cylinder(
        n,
        i.x1 - 0.022,
        a - 0.01,
        0.02,
        i.x1 - 0.022,
        a + 0.012,
        0.02,
        0.0028,
        6,
        y,
      ),
      t.box(
        composeChildPropTransform(n, i.x1 - 0.022, a + 0.016, 0.017),
        0.012,
        0.004,
        0.006,
        y,
      ),
      t.box(
        composeChildPropTransform(n, o, 0.03, 0.17, 0.04),
        l + 0.05,
        0.024,
        0.07,
        createPropSurface(PROP_COLORS.stoneW, PROP_MATERIAL_KINDS.stone, {
          stone: !0,
          expo: 1,
        }),
      ));
    const _ = i.x1 + h + p + 0.03,
      M = 0.235;
    (t.box(
      composeChildPropTransform(n, _, M + 0.04, CABIN_LOG_RADIUS + 0.004),
      0.012,
      0.03,
      0.004,
      y,
    ),
      t.box(
        composeChildPropTransform(n, _, M + 0.05, CABIN_LOG_RADIUS + 0.02),
        0.004,
        0.004,
        0.034,
        y,
      ),
      t.box(
        composeChildPropTransform(n, _, M + 0.034, CABIN_LOG_RADIUS + 0.036),
        0.002,
        0.02,
        0.002,
        y,
      ),
      t.box(
        composeChildPropTransform(n, _, M - 0, CABIN_LOG_RADIUS + 0.036),
        0.026,
        0.005,
        0.026,
        y,
      ),
      t.box(
        composeChildPropTransform(n, _, M + 0.017, CABIN_LOG_RADIUS + 0.036),
        0.019,
        0.028,
        0.019,
        createPropSurface(PROP_COLORS.glass, PROP_MATERIAL_KINDS.lantern, {
          expo: 0,
          stone: !0,
        }),
      ));
    for (const [A, b] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ])
      t.box(
        composeChildPropTransform(
          n,
          _ + A * 0.0105,
          M + 0.017,
          CABIN_LOG_RADIUS + 0.036 + b * 0.0105,
        ),
        0.003,
        0.03,
        0.003,
        y,
      );
    (t.box(
      composeChildPropTransform(n, _, M + 0.034, CABIN_LOG_RADIUS + 0.036),
      0.024,
      0.004,
      0.024,
      y,
    ),
      t.box(
        composeChildPropTransform(
          n,
          _,
          M + 0.04,
          CABIN_LOG_RADIUS + 0.036,
          Math.PI / 4,
        ),
        0.014,
        0.008,
        0.014,
        y,
      ),
      (props.lantern = new ThreeVector3(
        _,
        M + 0.017,
        CABIN_LOG_RADIUS + 0.036,
      ).applyMatrix4(n)));
    return;
  }
  const v = i.win;
  t.quad(
    n,
    [
      [i.x0, i.y0, 0.006],
      [i.x1, i.y0, 0.006],
      [i.x1, i.y1, 0.006],
      [i.x0, i.y1, 0.006],
    ],
    [
      [0, 0, v],
      [1, 0, v],
      [1, 1, v],
      [0, 1, v],
    ],
    createPropSurface(PROP_COLORS.glass, PROP_MATERIAL_KINDS.window, {
      expo: 0,
    }),
  );
  const g = createPropSurface(PROP_COLORS.trim, PROP_MATERIAL_KINDS.paint, {
    expo: 0.2,
    grain: "y",
    pith: [0.01, 0.01],
  });
  if (
    (t.box(composeChildPropTransform(n, o, a, 0.009), 0.006, c, 0.006, g),
    t.box(composeChildPropTransform(n, o, a, 0.009), l, 0.006, 0.006, {
      ...g,
      grain: "x",
    }),
    t.box(
      composeChildPropTransform(n, o, i.y0 - h - 0.002, u + 0.008),
      l + h * 2 + 0.03,
      0.007,
      0.03,
      {
        ...f,
        grain: "x",
        expo: 0.9,
      },
    ),
    i.shutters)
  ) {
    const x = createPropSurface(
        PROP_COLORS.shutter,
        PROP_MATERIAL_KINDS.paint,
        {
          expo: 0.4,
          param: 0.022,
          grain: "y",
          pith: [0.01, 0.03],
        },
      ),
      m = l / 2 + 0.008;
    for (const w of [-1, 1]) {
      const y =
        w < 0 ? i.x0 - h - p - m / 2 - 0.002 : i.x1 + h + p + m / 2 + 0.002;
      (t.box(
        composeChildPropTransform(
          n,
          y,
          a + 0.002,
          CABIN_LOG_RADIUS + 0.006,
          w * 0.08,
        ),
        m,
        c + 0.02,
        0.006,
        x,
      ),
        t.box(
          composeChildPropTransform(
            n,
            y,
            a + 0.002 + c * 0.28,
            CABIN_LOG_RADIUS + 0.011,
            w * 0.08,
          ),
          m - 0.006,
          0.01,
          0.004,
          {
            ...x,
            grain: "x",
            param: 0,
          },
        ),
        t.box(
          composeChildPropTransform(
            n,
            y,
            a + 0.002 - c * 0.28,
            CABIN_LOG_RADIUS + 0.011,
            w * 0.08,
          ),
          m - 0.006,
          0.01,
          0.004,
          {
            ...x,
            grain: "x",
            param: 0,
          },
        ));
    }
  }
  if (i.box) {
    const x = i.y0 - h - 0.026;
    (t.box(
      composeChildPropTransform(n, o, x, u + 0.022),
      l + 0.03,
      0.03,
      0.032,
      createPropSurface(PROP_COLORS.box, PROP_MATERIAL_KINDS.paint, {
        expo: 0.8,
        grain: "x",
        param: 0.015,
      }),
    ),
      t.box(
        composeChildPropTransform(n, o, x + 0.014, u + 0.022),
        l + 0.022,
        0.003,
        0.026,
        createPropSurface(
          createPropColor("#3b2a1c"),
          PROP_MATERIAL_KINDS.soot,
          {
            expo: 0.8,
          },
        ),
      ));
    const m = [
      createPropColor("#d7263d"),
      createPropColor("#f25c78"),
      createPropColor("#ffffff"),
      createPropColor("#f4a259"),
      createPropColor("#d7263d"),
    ];
    for (let w = 0; w < 9; w++) {
      const y = i.x0 - 0.008 + ((w + 0.5) * (l + 0.016)) / 9 + s(-0.004, 0.004);
      (t.blob(
        n,
        y,
        x + 0.02 + s(0, 0.004),
        u + 0.022 + s(-0.008, 0.008),
        0.009,
        createPropSurface(
          createPropColor("#2f5a24"),
          PROP_MATERIAL_KINDS.leaf,
          {
            expo: 0.8,
          },
        ),
        0,
        0.8,
      ),
        (w % 2 === 0 || s(0, 1) > 0.5) &&
          t.blob(
            n,
            y + s(-0.003, 0.003),
            x + 0.03 + s(0, 0.005),
            u + 0.024 + s(-0.006, 0.006),
            0.0065,
            createPropSurface(m[w % m.length], PROP_MATERIAL_KINDS.leaf, {
              expo: 0.8,
            }),
            0,
          ));
    }
    for (let w = 0; w < 4; w++)
      t.blob(
        n,
        i.x0 + s(0, l),
        x - 0.016 - s(0, 0.01),
        u + 0.04,
        0.006,
        createPropSurface(
          createPropColor("#355f2a"),
          PROP_MATERIAL_KINDS.leaf,
          {
            expo: 0.8,
          },
        ),
        0,
        1.6,
      );
  }
}
export { buildCabinOpening };
