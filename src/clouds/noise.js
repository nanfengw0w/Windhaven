// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeData3DTexture,
  ThreeLinearFilter,
  ThreeRGBAFormat,
  ThreeRepeatWrapping,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import { createSeededRandom } from "../core/math.js";
const cloudNoiseSaturate = (r) => (r < 0 ? 0 : r > 1 ? 1 : r);
const remapCloudNoise = (r, t, e, i, s) => i + ((r - t) / (e - t)) * (s - i);
function createCloudWorleyPoints(r, t) {
  const e = new Float32Array(r * r * r * 3);
  for (let i = 0; i < e.length; i++) e[i] = t();
  return e;
}
function sampleCloudWorleyNoise(r, t, e, i, s) {
  const n = r * i,
    o = t * i,
    a = e * i,
    l = Math.floor(n),
    c = Math.floor(o),
    h = Math.floor(a);
  let f = 9;
  for (let u = -1; u <= 1; u++) {
    const d = h + u,
      p = ((d % i) + i) % i;
    for (let v = -1; v <= 1; v++) {
      const g = c + v,
        x = ((g % i) + i) % i;
      for (let m = -1; m <= 1; m++) {
        const w = l + m,
          y = ((w % i) + i) % i,
          _ = ((p * i + x) * i + y) * 3,
          M = w + s[_] - n,
          A = g + s[_ + 1] - o,
          b = d + s[_ + 2] - a,
          S = M * M + A * A + b * b;
        S < f && (f = S);
      }
    }
  }
  return 1 - cloudNoiseSaturate(Math.sqrt(f));
}
function createCloudPerlinNoise(r) {
  const t = new Float32Array(768);
  for (let n = 0; n < 256; n++) {
    const o = r() * 2 - 1,
      a = r() * Math.PI * 2,
      l = Math.sqrt(1 - o * o);
    ((t[n * 3] = l * Math.cos(a)),
      (t[n * 3 + 1] = l * Math.sin(a)),
      (t[n * 3 + 2] = o));
  }
  const e = new Uint8Array(512);
  for (let n = 0; n < 256; n++) e[n] = n;
  for (let n = 255; n > 0; n--) {
    const o = Math.floor(r() * (n + 1)),
      a = e[n];
    ((e[n] = e[o]), (e[o] = a));
  }
  for (let n = 0; n < 256; n++) e[n + 256] = e[n];
  const i = (n) => n * n * n * (n * (n * 6 - 15) + 10),
    s = (n, o, a, l, c, h) => {
      const f = e[e[e[n & 255] + (o & 255)] + (a & 255)] * 3;
      return t[f] * l + t[f + 1] * c + t[f + 2] * h;
    };
  return function (o, a, l, c) {
    const h = Math.floor(o),
      f = Math.floor(a),
      u = Math.floor(l),
      d = o - h,
      p = a - f,
      v = l - u,
      g = ((h % c) + c) % c,
      x = (g + 1) % c,
      m = ((f % c) + c) % c,
      w = (m + 1) % c,
      y = ((u % c) + c) % c,
      _ = (y + 1) % c,
      M = i(d),
      A = i(p),
      b = i(v),
      S = s(g, m, y, d, p, v),
      E = s(x, m, y, d - 1, p, v),
      T = s(g, w, y, d, p - 1, v),
      R = s(x, w, y, d - 1, p - 1, v),
      z = s(g, m, _, d, p, v - 1),
      L = s(x, m, _, d - 1, p, v - 1),
      k = s(g, w, _, d, p - 1, v - 1),
      U = s(x, w, _, d - 1, p - 1, v - 1),
      F = S + (E - S) * M,
      G = T + (R - T) * M,
      B = z + (L - z) * M,
      q = k + (U - k) * M,
      X = F + (G - F) * A,
      vt = B + (q - B) * A;
    return (X + (vt - X) * b) * 1.6;
  };
}
function createCloudNoiseTexture(r = 64, t = 7) {
  const e = createSeededRandom(t),
    i = createCloudPerlinNoise(e),
    s = createCloudWorleyPoints(4, e),
    n = createCloudWorleyPoints(8, e),
    o = createCloudWorleyPoints(16, e),
    a = createCloudWorleyPoints(32, e),
    l = r * r * r,
    c = new Float32Array(l * 4),
    h = 1 / r;
  let f = 0;
  for (let v = 0; v < r; v++) {
    const g = (v + 0.5) * h;
    for (let x = 0; x < r; x++) {
      const m = (x + 0.5) * h;
      for (let w = 0; w < r; w++) {
        const y = (w + 0.5) * h,
          _ = sampleCloudWorleyNoise(y, m, g, 4, s),
          M = sampleCloudWorleyNoise(y, m, g, 8, n),
          A = sampleCloudWorleyNoise(y, m, g, 16, o),
          b = sampleCloudWorleyNoise(y, m, g, 32, a);
        let S = 0,
          E = 0.5,
          T = 4;
        for (let k = 0; k < 3; k++)
          ((S += E * i(y * T, m * T, g * T, T)), (E *= 0.5), (T *= 2));
        const R = cloudNoiseSaturate(S * 0.5 + 0.5),
          z = _ * 0.625 + M * 0.25 + A * 0.125,
          L = M * 0.625 + A * 0.25 + b * 0.125;
        ((c[f++] = remapCloudNoise(R, 0, 1, z, 1)),
          (c[f++] = z),
          (c[f++] = L),
          (c[f++] = R));
      }
    }
  }
  const u = new Uint8Array(l * 4),
    d = new Uint32Array(1024);
  for (let v = 0; v < 4; v++) {
    d.fill(0);
    for (let _ = v; _ < c.length; _ += 4)
      d[Math.min(1023, Math.max(0, Math.floor(c[_] * 1023)))]++;
    let g = 0,
      x = 1023,
      m = 0;
    for (let _ = 0; _ < 1024; _++)
      if (((m += d[_]), m > l * 0.005)) {
        g = _;
        break;
      }
    m = 0;
    for (let _ = 1023; _ >= 0; _--)
      if (((m += d[_]), m > l * 0.005)) {
        x = _;
        break;
      }
    const w = g / 1023,
      y = 1 / Math.max(0.001, (x - g) / 1023);
    for (let _ = v; _ < c.length; _ += 4)
      u[_] = Math.round(cloudNoiseSaturate((c[_] - w) * y) * 255);
  }
  const p = new ThreeData3DTexture(u, r, r, r);
  return (
    (p.format = ThreeRGBAFormat),
    (p.type = ThreeUnsignedByteType),
    (p.minFilter = ThreeLinearFilter),
    (p.magFilter = ThreeLinearFilter),
    (p.wrapS = p.wrapT = p.wrapR = ThreeRepeatWrapping),
    (p.unpackAlignment = 1),
    (p.generateMipmaps = !1),
    (p.needsUpdate = !0),
    p
  );
}
export { createCloudNoiseTexture };
