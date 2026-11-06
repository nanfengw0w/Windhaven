// Reconstructed module: identifiers and file boundaries are refactor choices.
function createSeededRandom(r) {
  let t = r >>> 0;
  return function () {
    t = (t + 1831565813) >>> 0;
    let i = t;
    return (
      (i = Math.imul(i ^ (i >>> 15), i | 1)),
      (i ^= i + Math.imul(i ^ (i >>> 7), i | 61)),
      ((i ^ (i >>> 14)) >>> 0) / 4294967296
    );
  };
}
const SIMPLEX_SKEW_2D = 0.5 * (Math.sqrt(3) - 1);
const SIMPLEX_UNSKEW_2D = (3 - Math.sqrt(3)) / 6;
const SIMPLEX_SKEW_3D = 1 / 3;
const SIMPLEX_UNSKEW_3D = 1 / 6;
const SIMPLEX_GRADIENTS = new Float32Array([
  1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0,
  -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
]);
function createSimplexNoise(r = 1337) {
  const t = createSeededRandom(r),
    e = new Uint8Array(256);
  for (let c = 0; c < 256; c++) e[c] = c;
  for (let c = 255; c > 0; c--) {
    const h = Math.floor(t() * (c + 1)),
      f = e[c];
    ((e[c] = e[h]), (e[h] = f));
  }
  const i = new Uint8Array(512),
    s = new Uint8Array(512);
  for (let c = 0; c < 512; c++) ((i[c] = e[c & 255]), (s[c] = i[c] % 12));
  function n(c, h) {
    let f = 0,
      u = 0,
      d = 0;
    const p = (c + h) * SIMPLEX_SKEW_2D,
      v = Math.floor(c + p),
      g = Math.floor(h + p),
      x = (v + g) * SIMPLEX_UNSKEW_2D,
      m = c - (v - x),
      w = h - (g - x),
      y = m > w ? 1 : 0,
      _ = m > w ? 0 : 1,
      M = m - y + SIMPLEX_UNSKEW_2D,
      A = w - _ + SIMPLEX_UNSKEW_2D,
      b = m - 1 + 2 * SIMPLEX_UNSKEW_2D,
      S = w - 1 + 2 * SIMPLEX_UNSKEW_2D,
      E = v & 255,
      T = g & 255;
    let R = 0.5 - m * m - w * w;
    if (R >= 0) {
      const k = s[E + i[T]] * 3;
      ((R *= R),
        (f =
          R * R * (SIMPLEX_GRADIENTS[k] * m + SIMPLEX_GRADIENTS[k + 1] * w)));
    }
    let z = 0.5 - M * M - A * A;
    if (z >= 0) {
      const k = s[E + y + i[T + _]] * 3;
      ((z *= z),
        (u =
          z * z * (SIMPLEX_GRADIENTS[k] * M + SIMPLEX_GRADIENTS[k + 1] * A)));
    }
    let L = 0.5 - b * b - S * S;
    if (L >= 0) {
      const k = s[E + 1 + i[T + 1]] * 3;
      ((L *= L),
        (d =
          L * L * (SIMPLEX_GRADIENTS[k] * b + SIMPLEX_GRADIENTS[k + 1] * S)));
    }
    return 70 * (f + u + d);
  }
  function o(c, h, f) {
    let u, d, p, v;
    const g = (c + h + f) * SIMPLEX_SKEW_3D,
      x = Math.floor(c + g),
      m = Math.floor(h + g),
      w = Math.floor(f + g),
      y = (x + m + w) * SIMPLEX_UNSKEW_3D,
      _ = c - (x - y),
      M = h - (m - y),
      A = f - (w - y);
    let b, S, E, T, R, z;
    _ >= M
      ? M >= A
        ? ((b = 1), (S = 0), (E = 0), (T = 1), (R = 1), (z = 0))
        : _ >= A
          ? ((b = 1), (S = 0), (E = 0), (T = 1), (R = 0), (z = 1))
          : ((b = 0), (S = 0), (E = 1), (T = 1), (R = 0), (z = 1))
      : M < A
        ? ((b = 0), (S = 0), (E = 1), (T = 0), (R = 1), (z = 1))
        : _ < A
          ? ((b = 0), (S = 1), (E = 0), (T = 0), (R = 1), (z = 1))
          : ((b = 0), (S = 1), (E = 0), (T = 1), (R = 1), (z = 0));
    const L = _ - b + SIMPLEX_UNSKEW_3D,
      k = M - S + SIMPLEX_UNSKEW_3D,
      U = A - E + SIMPLEX_UNSKEW_3D,
      F = _ - T + 2 * SIMPLEX_UNSKEW_3D,
      G = M - R + 2 * SIMPLEX_UNSKEW_3D,
      B = A - z + 2 * SIMPLEX_UNSKEW_3D,
      q = _ - 1 + 3 * SIMPLEX_UNSKEW_3D,
      X = M - 1 + 3 * SIMPLEX_UNSKEW_3D,
      vt = A - 1 + 3 * SIMPLEX_UNSKEW_3D,
      gt = x & 255,
      Qt = m & 255,
      te = w & 255;
    let Zt = 0.6 - _ * _ - M * M - A * A;
    if (Zt < 0) u = 0;
    else {
      const Y = s[gt + i[Qt + i[te]]] * 3;
      ((Zt *= Zt),
        (u =
          Zt *
          Zt *
          (SIMPLEX_GRADIENTS[Y] * _ +
            SIMPLEX_GRADIENTS[Y + 1] * M +
            SIMPLEX_GRADIENTS[Y + 2] * A)));
    }
    let J = 0.6 - L * L - k * k - U * U;
    if (J < 0) d = 0;
    else {
      const Y = s[gt + b + i[Qt + S + i[te + E]]] * 3;
      ((J *= J),
        (d =
          J *
          J *
          (SIMPLEX_GRADIENTS[Y] * L +
            SIMPLEX_GRADIENTS[Y + 1] * k +
            SIMPLEX_GRADIENTS[Y + 2] * U)));
    }
    let nt = 0.6 - F * F - G * G - B * B;
    if (nt < 0) p = 0;
    else {
      const Y = s[gt + T + i[Qt + R + i[te + z]]] * 3;
      ((nt *= nt),
        (p =
          nt *
          nt *
          (SIMPLEX_GRADIENTS[Y] * F +
            SIMPLEX_GRADIENTS[Y + 1] * G +
            SIMPLEX_GRADIENTS[Y + 2] * B)));
    }
    let mt = 0.6 - q * q - X * X - vt * vt;
    if (mt < 0) v = 0;
    else {
      const Y = s[gt + 1 + i[Qt + 1 + i[te + 1]]] * 3;
      ((mt *= mt),
        (v =
          mt *
          mt *
          (SIMPLEX_GRADIENTS[Y] * q +
            SIMPLEX_GRADIENTS[Y + 1] * X +
            SIMPLEX_GRADIENTS[Y + 2] * vt)));
    }
    return 32 * (u + d + p + v);
  }
  function a(c, h, f = 5, u = 2, d = 0.5) {
    let p = 0,
      v = 0.5,
      g = 1,
      x = 0;
    for (let m = 0; m < f; m++)
      ((p += v * n(c * g, h * g)), (x += v), (v *= d), (g *= u));
    return p / x;
  }
  function l(c, h, f = 5, u = 2.1, d = 0.5) {
    let p = 0,
      v = 0.5,
      g = 1,
      x = 0,
      m = 1;
    for (let w = 0; w < f; w++) {
      let y = 1 - Math.abs(n(c * g, h * g));
      ((y *= y), (p += y * v * m), (x += v), (m = y), (v *= d), (g *= u));
    }
    return p / x;
  }
  return {
    noise2: n,
    noise3: o,
    fbm2: a,
    ridged2: l,
    rand: t,
  };
}
const clamp = (r, t, e) => (r < t ? t : r > e ? e : r);
const lerp = (r, t, e) => r + (t - r) * e;
const smoothstep = (r, t, e) => {
  const i = clamp((e - r) / (t - r), 0, 1);
  return i * i * (3 - 2 * i);
};
const damp = (r, t, e, i) => lerp(r, t, 1 - Math.exp(-e * i));
export {
  clamp,
  createSeededRandom,
  createSimplexNoise,
  damp,
  lerp,
  smoothstep,
};
