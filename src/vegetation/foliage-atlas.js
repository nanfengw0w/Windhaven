// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeClampToEdgeWrapping,
  ThreeDataTexture,
  ThreeLinearFilter,
  ThreeLinearMipmapLinearFilter,
  ThreeRGBAFormat,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import { createSeededRandom } from "../core/math.js";
const FOLIAGE_ATLAS_ASPECTS = [0.95, 0.9, 0.95, 0.62];
function createFoliageAtlas(r = 1024) {
  const t = document.createElement("canvas");
  t.width = t.height = r;
  const e = t.getContext("2d");
  e.clearRect(0, 0, r, r);
  const i = r / 2,
    s = createSeededRandom(8123),
    n = (m, w) => m + (w - m) * s();
  let o = 0,
    a = 0;
  const l = (m) => {
      ((o = (m % 2) * i), (a = Math.floor(m / 2) * i));
    },
    c = (m) => o + m * i,
    h = (m) => a + m * i,
    f = (m, w, y) => `rgb(${m | 0},${w | 0},${y | 0})`,
    u = (m) => {
      (l(m),
        e.save(),
        e.beginPath(),
        e.rect(o + 1, a + 1, i - 2, i - 2),
        e.clip());
    };
  function d(m, w, y, _) {
    for (let M = 0; M < m.length - 1; M++) {
      const A = M / Math.max(1, m.length - 2);
      ((e.strokeStyle = _),
        (e.lineWidth = Math.max(0.8, w + (y - w) * A)),
        (e.lineCap = "round"),
        e.beginPath(),
        e.moveTo(c(m[M][0]), h(m[M][1])),
        e.lineTo(c(m[M + 1][0]), h(m[M + 1][1])),
        e.stroke());
    }
  }
  function p(m, w, y, _, M, A, b, S = 0) {
    const E = Math.cos(y),
      T = Math.sin(y),
      R = (B, q) => [c(m + B * E + q * T), h(w - B * T + q * E)],
      z = (B) => {
        const q = R(B * M * 0.62, _ * 0.12),
          X = R(B * M * 0.58, _ * 0.72),
          vt = R(0, _);
        e.bezierCurveTo(q[0], q[1], X[0], X[1], vt[0], vt[1]);
      },
      L = R(0, 0);
    ((e.fillStyle = f(A, b, S)), e.beginPath(), e.moveTo(L[0], L[1]), z(1));
    const k = R(0, _),
      U = R(-M * 0.58, _ * 0.72),
      F = R(-M * 0.62, _ * 0.12);
    (e.bezierCurveTo(U[0], U[1], F[0], F[1], L[0], L[1]),
      e.fill(),
      (e.fillStyle = f(A * 0.8, b, S)),
      e.beginPath(),
      e.moveTo(L[0], L[1]),
      z(1),
      e.lineTo(k[0], k[1]),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = f(A * 0.62, b, S)),
      (e.lineWidth = Math.max(1, i / 300)),
      e.beginPath(),
      e.moveTo(L[0], L[1]),
      z(1),
      e.bezierCurveTo(U[0], U[1], F[0], F[1], L[0], L[1]),
      e.stroke(),
      (e.strokeStyle = f(Math.min(255, A * 1.22), b, S)),
      (e.lineWidth = Math.max(1, i / 220)));
    const G = R(0, _ * 0.86);
    (e.beginPath(), e.moveTo(L[0], L[1]), e.lineTo(G[0], G[1]), e.stroke());
  }
  u(0);
  {
    const m = f(120, 128, 255),
      w = [[0.5, 0.6]],
      y = 7;
    for (let M = 0; M < y; M++) {
      const A = (M / y) * Math.PI * 2 + n(-0.25, 0.25);
      w.push([
        0.5 + Math.cos(A) * n(0.24, 0.3),
        0.56 + Math.sin(A) * n(0.22, 0.27),
      ]);
    }
    const _ = [];
    for (const [M, A] of w) {
      const b = [],
        S = (M - 0.5) * 0.5;
      for (let T = 0; T <= 8; T++) {
        const R = T / 8;
        b.push([
          0.5 + (M - 0.5) * R + S * Math.sin(R * Math.PI) * 0.3,
          0.03 + (A - 0.03) * Math.pow(R, 0.85),
        ]);
      }
      d(b, i / 130, i / 320, m);
      const E = 16;
      for (let T = 0; T < E; T++) {
        const R = (T / E) * Math.PI * 2 + n(-0.3, 0.3),
          z = n(0.01, 0.085),
          L = M + Math.cos(R) * z * 0.9,
          k = A + Math.sin(R) * z,
          U = Math.atan2(Math.cos(R), Math.sin(R)) + n(-0.35, 0.35);
        _.push({
          u: L,
          v: k,
          a: U,
          L: n(0.075, 0.11),
          d: Math.hypot(L - 0.5, k - 0.03),
        });
      }
    }
    _.sort((M, A) => M.d - A.d + (s() - 0.5) * 0.12);
    for (const M of _) {
      const A = Math.min(1, M.d / 0.85),
        b = n(118, 165) + A * 80;
      p(M.u, M.v, M.a, M.L, M.L * n(0.5, 0.62), Math.min(250, b), n(0, 255));
    }
  }
  (e.restore(), u(1));
  {
    const m = (w, y, _, M, A, b) => {
      const S = [[w, y]];
      let E = w,
        T = y,
        R = _;
      const z = 5;
      for (let k = 0; k < z; k++)
        ((R += n(-0.22, 0.22)),
          (E += (Math.sin(R) * M) / z),
          (T += (Math.cos(R) * M) / z),
          S.push([E, T]));
      if (
        (d(S, A, A * 0.55, f(n(115, 175), n(0, 255), 255)),
        (e.fillStyle = f(n(140, 190), n(0, 255), 255)),
        e.beginPath(),
        e.arc(c(E), h(T), Math.max(1, A * 0.7), 0, Math.PI * 2),
        e.fill(),
        b <= 0)
      )
        return;
      const L = b > 1 ? 3 : 2;
      for (let k = 0; k < L; k++) {
        const U = 0.3 + (k / L) * 0.62,
          F = Math.min(z, Math.round(U * z)),
          G = k % 2 ? 1 : -1;
        m(
          S[F][0],
          S[F][1],
          R + G * n(0.3, 0.7),
          M * n(0.48, 0.66),
          A * 0.6,
          b - 1,
        );
      }
    };
    (m(0.5, 0.02, n(-0.08, 0.08), 0.52, i / 85, 3),
      m(0.49, 0.06, n(-0.55, -0.35), 0.4, i / 110, 2),
      m(0.51, 0.06, n(0.35, 0.55), 0.4, i / 110, 2));
  }
  (e.restore(), u(2));
  {
    const m = [];
    for (let _ = 0; _ <= 10; _++) {
      const M = _ / 10;
      m.push([0.5 + 0.06 * Math.sin(M * 3), 0.02 + M * 0.62]);
    }
    d(m, i / 70, i / 170, f(110, 128, 255));
    for (let _ = 0; _ < 4; _++) {
      const [M, A] = m[3 + _ * 2],
        b = _ % 2 ? 1 : -1;
      p(
        M,
        A,
        b * n(0.7, 1.1),
        n(0.13, 0.18),
        0.07,
        n(160, 220),
        n(0, 255),
        128,
      );
    }
    const w = (_, M, A) => {
        const b = n(0, Math.PI * 2),
          S = n(200, 250);
        for (let E = 0; E < 5; E++) {
          const T = b + (E / 5) * Math.PI * 2,
            R = _ + Math.cos(T) * A * 0.55,
            z = M + Math.sin(T) * A * 0.55;
          ((e.fillStyle = f(S * n(0.9, 1), n(0, 255), 0)),
            e.beginPath(),
            e.ellipse(
              c(R),
              h(z),
              A * i * 0.56,
              A * i * 0.46,
              T,
              0,
              Math.PI * 2,
            ),
            e.fill(),
            (e.strokeStyle = f(S * 0.7, 128, 0)),
            (e.lineWidth = Math.max(1, i / 400)),
            e.stroke());
        }
        ((e.fillStyle = f(60, 200, 0)),
          e.beginPath(),
          e.arc(c(_), h(M), A * i * 0.26, 0, Math.PI * 2),
          e.fill());
      },
      y = [
        [0.5, 0.72],
        [0.3, 0.56],
        [0.7, 0.5],
        [0.36, 0.34],
        [0.64, 0.3],
        [0.5, 0.18],
        [0.24, 0.76],
        [0.76, 0.74],
        [0.52, 0.9],
      ];
    for (const [_, M] of y) {
      const A = 3 + Math.floor(s() * 3);
      for (let b = 0; b < A; b++)
        w(_ + n(-0.08, 0.08), M + n(-0.07, 0.07), n(0.055, 0.075));
    }
  }
  (e.restore(), u(3));
  {
    const m = (w, y, _, M, A, b, S) => {
      const E = [],
        T = Math.max(8, Math.round(M * 90));
      let R = w,
        z = y,
        L = _;
      for (let k = 0; k <= T; k++)
        (E.push([R, z, L]),
          (L += n(-0.02, 0.02)),
          (R += (Math.sin(L) * M) / T),
          (z += (Math.cos(L) * M) / T));
      for (let k = 1; k < E.length; k++) {
        const U = k / E.length,
          [F, G, B] = E[k];
        for (const q of [-1, 1]) {
          const X = B + q * (1.05 - U * 0.35) + n(-0.12, 0.12),
            vt = A * (1 - U * 0.55) * n(0.8, 1.15),
            gt = n(140, 205) + U * 45;
          ((e.strokeStyle = f(Math.min(255, gt), n(0, 255), 0)),
            (e.lineWidth = Math.max(1, i / 240)),
            e.beginPath(),
            e.moveTo(c(F), h(G)),
            e.lineTo(c(F + Math.sin(X) * vt), h(G + Math.cos(X) * vt)),
            e.stroke());
        }
      }
      if ((d(E, b, b * 0.4, f(110, 128, 255)), !(S <= 0)))
        for (const [k, U] of [
          [0.18, 1],
          [0.3, -1],
          [0.44, 1],
          [0.56, -1],
          [0.7, 1],
        ]) {
          const F = E[Math.round(k * T)];
          m(
            F[0],
            F[1],
            F[2] + U * n(0.55, 0.8),
            M * (0.62 - k * 0.55),
            A * 0.8,
            b * 0.55,
            S - 1,
          );
        }
    };
    m(0.5, 0.01, 0, 0.95, 0.085, i / 90, 1);
  }
  e.restore();
  const g = e.getImageData(0, 0, r, r).data;
  for (let m = 0; m < r; m++)
    for (let w = 0; w < r; w++) {
      const y = (m * r + w) * 4;
      if (g[y + 3] < 8) {
        const _ = (w >= i ? 1 : 0) + (m >= i ? 2 : 0);
        ((g[y] = 150),
          (g[y + 1] = 128),
          (g[y + 2] = _ === 1 ? 255 : 0),
          (g[y + 3] = 0));
      }
    }
  const x = new ThreeDataTexture(
    new Uint8Array(g.buffer.slice(0)),
    r,
    r,
    ThreeRGBAFormat,
    ThreeUnsignedByteType,
  );
  return (
    (x.generateMipmaps = !0),
    (x.minFilter = ThreeLinearMipmapLinearFilter),
    (x.magFilter = ThreeLinearFilter),
    (x.wrapS = x.wrapT = ThreeClampToEdgeWrapping),
    (x.anisotropy = 4),
    (x.needsUpdate = !0),
    x
  );
}
export { FOLIAGE_ATLAS_ASPECTS, createFoliageAtlas };
