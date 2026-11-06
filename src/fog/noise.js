// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeData3DTexture,
  ThreeDataTexture,
  ThreeLinearFilter,
  ThreeNearestFilter,
  ThreeRGBAFormat,
  ThreeRedFormat,
  ThreeRepeatWrapping,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import { createSeededRandom } from "../core/math.js";
const fogNoiseSaturate = (r) => (r < 0 ? 0 : r > 1 ? 1 : r);
function createFogWorleyNoise(r, t) {
  const e = new Float32Array(r * r * r * 3);
  for (let i = 0; i < e.length; i++) e[i] = t();
  return function (s, n, o) {
    const a = s * r,
      l = n * r,
      c = o * r,
      h = Math.floor(a),
      f = Math.floor(l),
      u = Math.floor(c);
    let d = 9;
    for (let p = -1; p <= 1; p++) {
      const v = u + p,
        g = ((v % r) + r) % r;
      for (let x = -1; x <= 1; x++) {
        const m = f + x,
          w = ((m % r) + r) % r;
        for (let y = -1; y <= 1; y++) {
          const _ = h + y,
            M = ((_ % r) + r) % r,
            A = ((g * r + w) * r + M) * 3,
            b = _ + e[A] - a,
            S = m + e[A + 1] - l,
            E = v + e[A + 2] - c,
            T = b * b + S * S + E * E;
          T < d && (d = T);
        }
      }
    }
    return 1 - fogNoiseSaturate(Math.sqrt(d));
  };
}
function createFogPerlinNoise(r) {
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
      const f = e[e[e[n] + o] + a] * 3;
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
      S =
        s(g, m, y, d, p, v) +
        (s(x, m, y, d - 1, p, v) - s(g, m, y, d, p, v)) * M,
      E =
        s(g, w, y, d, p - 1, v) +
        (s(x, w, y, d - 1, p - 1, v) - s(g, w, y, d, p - 1, v)) * M,
      T =
        s(g, m, _, d, p, v - 1) +
        (s(x, m, _, d - 1, p, v - 1) - s(g, m, _, d, p, v - 1)) * M,
      R =
        s(g, w, _, d, p - 1, v - 1) +
        (s(x, w, _, d - 1, p - 1, v - 1) - s(g, w, _, d, p - 1, v - 1)) * M,
      z = S + (E - S) * A,
      L = T + (R - T) * A;
    return (z + (L - z) * b) * 1.5;
  };
}
function createFogNoiseTexture(r = 32, t = 3846) {
  const e = createSeededRandom(t),
    i = createFogPerlinNoise(e),
    s = createFogWorleyNoise(3, e),
    n = createFogWorleyNoise(6, e),
    o = createFogWorleyNoise(12, e),
    a = r * r * r,
    l = new Float32Array(a * 4),
    c = 1 / r;
  let h = 0;
  for (let p = 0; p < r; p++) {
    const v = (p + 0.5) * c;
    for (let g = 0; g < r; g++) {
      const x = (g + 0.5) * c;
      for (let m = 0; m < r; m++) {
        const w = (m + 0.5) * c;
        let y = 0,
          _ = 0.55,
          M = 2;
        for (let T = 0; T < 3; T++)
          ((y += _ * i(w * M, x * M, v * M, M)), (_ *= 0.5), (M *= 2));
        let A = 0;
        ((_ = 0.55), (M = 4));
        for (let T = 0; T < 3; T++)
          ((A += _ * i(w * M + 7.3, x * M + 1.9, v * M + 4.1, M)),
            (_ *= 0.5),
            (M *= 2));
        const b = s(w, x, v),
          S = n(w, x, v),
          E = o(w, x, v);
        ((l[h++] = y * 0.5 + 0.5),
          (l[h++] = b * 0.6 + S * 0.28 + E * 0.12),
          (l[h++] = A * 0.5 + 0.5),
          (l[h++] = S * 0.65 + E * 0.35));
      }
    }
  }
  const f = new Uint8Array(a * 4),
    u = new Uint32Array(512);
  for (let p = 0; p < 4; p++) {
    u.fill(0);
    for (let y = p; y < l.length; y += 4)
      u[Math.min(511, Math.max(0, Math.floor(l[y] * 511)))]++;
    let v = 0,
      g = 511,
      x = 0;
    for (let y = 0; y < 512; y++)
      if (((x += u[y]), x > a * 0.01)) {
        v = y;
        break;
      }
    x = 0;
    for (let y = 511; y >= 0; y--)
      if (((x += u[y]), x > a * 0.01)) {
        g = y;
        break;
      }
    const m = v / 511,
      w = 1 / Math.max(0.001, (g - v) / 511);
    for (let y = p; y < l.length; y += 4)
      f[y] = Math.round(fogNoiseSaturate((l[y] - m) * w) * 255);
  }
  const d = new ThreeData3DTexture(f, r, r, r);
  return (
    (d.format = ThreeRGBAFormat),
    (d.type = ThreeUnsignedByteType),
    (d.minFilter = ThreeLinearFilter),
    (d.magFilter = ThreeLinearFilter),
    (d.wrapS = d.wrapT = d.wrapR = ThreeRepeatWrapping),
    (d.unpackAlignment = 1),
    (d.generateMipmaps = !1),
    (d.needsUpdate = !0),
    d
  );
}
function createFogBlueNoiseTexture(r = 64, t = 2846) {
  const e = createSeededRandom(t),
    i = r * r;
  let s = new Float32Array(i);
  for (let v = 0; v < i; v++) s[v] = e();
  const n = new Float32Array(i),
    o = new Float32Array(i),
    a = 3,
    l = 1.1,
    c = [];
  let h = 0;
  for (let v = -a; v <= a; v++) {
    const g = Math.exp(-(v * v) / (2 * l * l));
    (c.push(g), (h += g));
  }
  for (let v = 0; v < c.length; v++) c[v] /= h;
  const f = new Uint32Array(i),
    u = (v) => {
      for (let g = 0; g < i; g++) f[g] = g;
      f.sort((g, x) => v[g] - v[x]);
      for (let g = 0; g < i; g++) v[f[g]] = (g + 0.5) / i;
    };
  for (let v = 0; v < 6; v++) {
    for (let g = 0; g < r; g++)
      for (let x = 0; x < r; x++) {
        let m = 0;
        for (let w = -a; w <= a; w++)
          m += s[g * r + ((x + w + r) % r)] * c[w + a];
        n[g * r + x] = m;
      }
    for (let g = 0; g < r; g++)
      for (let x = 0; x < r; x++) {
        let m = 0;
        for (let w = -a; w <= a; w++)
          m += n[((g + w + r) % r) * r + x] * c[w + a];
        o[g * r + x] = m;
      }
    for (let g = 0; g < i; g++) s[g] = s[g] - o[g];
    u(s);
  }
  const d = new Uint8Array(i);
  for (let v = 0; v < i; v++) d[v] = Math.min(255, Math.floor(s[v] * 256));
  const p = new ThreeDataTexture(
    d,
    r,
    r,
    ThreeRedFormat,
    ThreeUnsignedByteType,
  );
  return (
    (p.minFilter = p.magFilter = ThreeNearestFilter),
    (p.wrapS = p.wrapT = ThreeRepeatWrapping),
    (p.generateMipmaps = !1),
    (p.unpackAlignment = 1),
    (p.needsUpdate = !0),
    p
  );
}
export { createFogBlueNoiseTexture, createFogNoiseTexture };
