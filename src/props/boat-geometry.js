import {
  PropGeometryBuilder,
  PROP_MATERIAL_KINDS,
  createPropColor,
  composeChildPropTransform,
} from "./geometry.js";
import {
  ThreeVector3,
  ThreeMatrix4,
  ThreeMatrix3,
} from "../vendor/three-runtime.js";
import { PROP_COLORS } from "./palette.js";
function createBoatGeometry() {
  const r = new PropGeometryBuilder(),
    t = 0.34,
    e = 0.125,
    i = 20,
    s = 12,
    n = 0.0035,
    o = (A) =>
      A < 0.3
        ? (e / 2) * (0.66 + 0.34 * Math.sin(((A / 0.3) * Math.PI) / 2))
        : (e / 2) * Math.sqrt(Math.max(0, 1 - Math.pow((A - 0.3) / 0.7, 2.2))),
    a = (A) => 0.03 + 0.017 * Math.pow((A - 0.45) / 0.55, 2),
    l = (A) => -0.022 * (1 - Math.pow(Math.abs(A - 0.42) / 0.62, 2.5)),
    c = (A, b) => {
      const S = o(A),
        E = a(A),
        T = l(A),
        R = (b * Math.PI) / 2;
      return [
        (A - 0.5) * t,
        T + (E - T) * Math.pow(1 - Math.cos(R), 0.85),
        S * Math.sin(R),
      ];
    },
    h = [];
  for (let A = 0; A <= i; A++) {
    const b = A / i,
      S = [];
    for (let E = 0; E <= s; E++) S.push(c(b, -1 + (2 * E) / s));
    h.push(S);
  }
  const f = (A, b) => {
      const S = h[Math.min(i, A + 1)][b],
        E = h[Math.max(0, A - 1)][b],
        T = h[A][Math.min(s, b + 1)],
        R = h[A][Math.max(0, b - 1)],
        z = new ThreeVector3(S[0] - E[0], S[1] - E[1], S[2] - E[2]),
        L = new ThreeVector3(T[0] - R[0], T[1] - R[1], T[2] - R[2]),
        k = new ThreeVector3().crossVectors(z, L);
      return (k.lengthSq() < 1e-12 && k.set(1, 0, 0), k.normalize());
    },
    u = (A, b) => {
      let S = 0;
      for (let E = s / 2; E !== b; E += b > s / 2 ? 1 : -1) {
        const T = h[A][E],
          R = h[A][E + (b > s / 2 ? 1 : -1)];
        S += Math.hypot(T[1] - R[1], T[2] - R[2]);
      }
      return b > s / 2 ? S : -S;
    },
    d = new ThreeMatrix4(),
    p = [],
    v = [],
    g = PROP_COLORS.hull,
    x = PROP_COLORS.hullBottom,
    m = {
      kind: PROP_MATERIAL_KINDS.paint,
      seed: 3.3,
      expo: 1,
      param: 0.0125,
    },
    w = {
      kind: PROP_MATERIAL_KINDS.plank,
      seed: 5.1,
      expo: 1,
      param: 0.0125,
    };
  for (let A = 0; A <= i; A++)
    for (let b = 0; b <= s; b++) {
      const S = h[A][b],
        E = f(A, b),
        T = u(A, b);
      p.push(
        r._vert(
          d,
          new ThreeMatrix3(),
          S[0],
          S[1],
          S[2],
          E.x,
          E.y,
          E.z,
          {
            ...m,
            col: S[1] < -0.001 ? x : g,
          },
          S[0],
          T + 0.0063,
          0.04,
        ),
      );
    }
  for (let A = 0; A < i; A++)
    for (let b = 0; b < s; b++) {
      const S = p[A * (s + 1) + b],
        E = p[(A + 1) * (s + 1) + b],
        T = p[(A + 1) * (s + 1) + b + 1],
        R = p[A * (s + 1) + b + 1];
      r.idx.push(S, E, T, S, T, R);
    }
  for (let A = 0; A <= i; A++)
    for (let b = 0; b <= s; b++) {
      const S = h[A][b],
        E = f(A, b),
        T = u(A, b);
      v.push(
        r._vert(
          d,
          new ThreeMatrix3(),
          S[0] - E.x * n,
          S[1] - E.y * n,
          S[2] - E.z * n,
          -E.x,
          -E.y,
          -E.z,
          {
            ...w,
            col: PROP_COLORS.boatIn,
          },
          S[0],
          T + 0.0063,
          0.04,
        ),
      );
    }
  for (let A = 0; A < i; A++)
    for (let b = 0; b < s; b++) {
      const S = v[A * (s + 1) + b],
        E = v[(A + 1) * (s + 1) + b],
        T = v[(A + 1) * (s + 1) + b + 1],
        R = v[A * (s + 1) + b + 1];
      r.idx.push(S, T, E, S, R, T);
    }
  const y = {
    col: createPropColor("#c9a46e"),
    kind: PROP_MATERIAL_KINDS.plank,
    seed: 2,
    expo: 1,
    param: 0,
  };
  for (const A of [0, s])
    for (let b = 0; b < i; b++) {
      const S = h[b][A],
        E = h[b + 1][A];
      (Math.abs(S[2]) < 0.002 && Math.abs(E[2]) < 0.002) ||
        r.cylinder(
          d,
          S[0],
          S[1] + 0.002,
          S[2] * 1.02,
          E[0],
          E[1] + 0.002,
          E[2] * 1.02,
          0.0042,
          5,
          {
            ...y,
            twist: 0.6,
          },
          !1,
        );
    }
  {
    const A = h[0],
      b = {
        col: g,
        kind: PROP_MATERIAL_KINDS.paint,
        seed: 9,
        expo: 1,
        param: 0.012,
      },
      S = A[0][0];
    for (let E = 0; E < s; E++) {
      const T = A[E],
        R = A[E + 1],
        z = [S, a(0), 0];
      (r.tri(
        d,
        [z, T, R],
        [
          [z[1], z[2], 0],
          [T[1], T[2], 0],
          [R[1], R[2], 0],
        ],
        {
          ...b,
          col: (T[1] + R[1]) / 2 < -0.001 ? x : g,
        },
      ),
        r.tri(
          d,
          [
            [z[0] + n, z[1], z[2]],
            [R[0] + n, R[1], R[2]],
            [T[0] + n, T[1], T[2]],
          ],
          [
            [z[1], z[2], 0],
            [R[1], R[2], 0],
            [T[1], T[2], 0],
          ],
          {
            ...w,
            col: PROP_COLORS.boatIn,
            param: 0,
          },
        ));
    }
    r.box(
      composeChildPropTransform(d, S - 0.0015, a(0) - 0.012, 0),
      0.002,
      0.008,
      0.026,
      {
        col: createPropColor("#b08a3a"),
        kind: PROP_MATERIAL_KINDS.metal,
        seed: 1,
        expo: 1,
      },
    );
  }
  {
    const A = h[i][0];
    r.cylinder(
      d,
      A[0],
      l(1) + 0.002,
      0,
      A[0] + 0.004,
      a(1) + 0.006,
      0,
      0.004,
      5,
      {
        ...y,
      },
      !0,
    );
  }
  const _ = (A, b) => {
    const S = (A - 0.5) * t,
      E = a(A) - 0.013,
      T = o(A) * 0.84;
    r.box(composeChildPropTransform(d, S, E, 0), b, 0.006, T * 2, {
      col: createPropColor("#b08656"),
      kind: PROP_MATERIAL_KINDS.plank,
      seed: A * 10,
      expo: 1,
      grain: "z",
      pith: [0.02, 0.02],
    });
  };
  (_(0.16, 0.05), _(0.44, 0.032), _(0.7, 0.03));
  for (const A of [-1, 1]) {
    const b = A * 0.024,
      S = {
        col: createPropColor("#c8a777"),
        kind: PROP_MATERIAL_KINDS.plank,
        seed: A + 4,
        expo: 1,
        grain: "x",
      };
    (r.cylinder(
      d,
      -0.12,
      a(0.15) - 0.006,
      b,
      0.08,
      a(0.74) - 0.006,
      b * 0.8,
      0.0028,
      5,
      S,
    ),
      r.box(
        composeChildPropTransform(
          d,
          0.11,
          a(0.8) - 0.009,
          b * 0.75,
          A * 0.06,
          0,
          -0.06,
        ),
        0.07,
        0.003,
        0.016,
        {
          ...S,
          grain: "x",
        },
      ));
  }
  return (
    r.box(
      composeChildPropTransform(d, 0, l(0.45) + 0.007, 0),
      0.2,
      0.002,
      0.04,
      {
        col: createPropColor("#8f6b47"),
        kind: PROP_MATERIAL_KINDS.plank,
        seed: 7,
        expo: 1,
        grain: "x",
        param: 0.012,
        pith: [0.02, 0.02],
      },
    ),
    {
      geometry: r.toGeometry(),
      bowLocal: new ThreeVector3(t / 2 - 0.005, a(1) - 0.004, 0),
      length: t,
      beam: e,
    }
  );
}
export { createBoatGeometry };
