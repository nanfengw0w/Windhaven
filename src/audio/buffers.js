// Reconstructed module: identifiers and file boundaries are refactor choices.
import { createAudioRandom } from "./math.js";
const noiseBufferCache = new WeakMap();
function getNoiseBuffers(r) {
  let t = noiseBufferCache.get(r);
  if (t) return t;
  const e = createAudioRandom(9173);
  return (
    (t = {
      white: createLoopingNoiseBuffer(r, 2, "white", e),
      pink: createLoopingNoiseBuffer(r, 4, "pink", e),
      brown: createLoopingNoiseBuffer(r, 4, "brown", e),
      _crackle: null,
      _drops: null,
      get crackle() {
        return (
          this._crackle ||
          (this._crackle = [0, 1, 2].map((i) =>
            createCrackleBuffer(r, createAudioRandom(301 + i * 17)),
          ))
        );
      },
      get drops() {
        return (
          this._drops ||
          (this._drops = createDropBuffers(r, createAudioRandom(77)))
        );
      },
    }),
    noiseBufferCache.set(r, t),
    t
  );
}
function fillNormalizedNoise(r, t, e) {
  const i = r.length;
  if (t === "white") for (let a = 0; a < i; a++) r[a] = e() * 2 - 1;
  else if (t === "pink") {
    let a = 0,
      l = 0,
      c = 0,
      h = 0,
      f = 0,
      u = 0,
      d = 0;
    for (let p = 0; p < i; p++) {
      const v = e() * 2 - 1;
      ((a = 0.99886 * a + v * 0.0555179),
        (l = 0.99332 * l + v * 0.0750759),
        (c = 0.969 * c + v * 0.153852),
        (h = 0.8665 * h + v * 0.3104856),
        (f = 0.55 * f + v * 0.5329522),
        (u = -0.7616 * u - v * 0.016898),
        (r[p] = a + l + c + h + f + u + d + v * 0.5362),
        (d = v * 0.115926));
    }
  } else {
    let a = 0;
    for (let l = 0; l < i; l++)
      ((a = (a + 0.02 * (e() * 2 - 1)) / 1.02), (r[l] = a));
  }
  let s = 0;
  for (let a = 0; a < i; a++) s += r[a];
  s /= i;
  let n = 0;
  for (let a = 0; a < i; a++) ((r[a] -= s), (n += r[a] * r[a]));
  const o = 0.25 / Math.sqrt(n / i || 1);
  for (let a = 0; a < i; a++) r[a] *= o;
}
function createLoopingNoiseBuffer(r, t, e, i) {
  const s = r.sampleRate,
    n = Math.floor(t * s),
    o = Math.floor(0.06 * s),
    a = r.createBuffer(2, n, s),
    l = new Float32Array(n + o);
  for (let c = 0; c < 2; c++) {
    fillNormalizedNoise(l, e, i);
    const h = a.getChannelData(c);
    h.set(l.subarray(0, n));
    for (let f = 0; f < o; f++) {
      const u = f / o;
      h[f] = l[f] * Math.sqrt(u) + l[n + f] * Math.sqrt(1 - u);
    }
  }
  return a;
}
function createCrackleBuffer(r, t, e = 0.6) {
  const i = r.sampleRate,
    s = Math.floor(e * i),
    n = r.createBuffer(1, s, i),
    o = n.getChannelData(0),
    a = Math.exp(-1 / (35e-5 * i));
  let l = 0,
    c = 0,
    h = 1e-6;
  for (let u = 0; u < s; u++)
    (u % 256 === 0 && (c = (Math.pow(t(), 3) * 1100) / i),
      t() < c && (l = Math.max(l, 0.15 + 0.85 * t() * t())),
      (l *= a),
      (o[u] = l * (t() * 2 - 1)),
      (h = Math.max(h, Math.abs(o[u]))));
  const f = 0.9 / h;
  for (let u = 0; u < s; u++) o[u] *= f;
  return n;
}
function createDropBuffers(r, t) {
  const e = r.sampleRate,
    i = [];
  for (let s = 0; s < 14; s++) {
    const n = Math.floor(e * 0.07),
      o = new Float32Array(n),
      a = s % 3;
    if (a === 0) {
      const g = (0.0012 + t() * 0.003) * e;
      let x = 0;
      const m = 0.25 + t() * 0.4;
      for (let w = 0; w < n; w++)
        ((x += m * (t() * 2 - 1 - x)), (o[w] = x * Math.exp(-w / g)));
    } else if (a === 1) {
      const g = 1400 + t() * 2800,
        x = Math.exp((-Math.PI * (g / (2 + t() * 3))) / e),
        m = 2 * x * Math.cos((2 * Math.PI * g) / e),
        w = (0.003 + t() * 0.004) * e;
      let y = 0,
        _ = 0;
      for (let M = 0; M < n; M++) {
        const A = M < w * 0.6 ? (t() * 2 - 1) * Math.exp(-M / (w * 0.25)) : 0,
          b = m * y - x * x * _ + A * (1 - x);
        ((_ = y), (y = b), (o[M] = b * Math.exp(-M / (w * 3))));
      }
    } else {
      const g = 1300 + t() * 2400,
        x = (0.006 + t() * 0.01) * e;
      let m = 0;
      for (let w = 0; w < n; w++) {
        const y = g * (1 + 0.9 * Math.min(1, w / (0.025 * e)));
        m += (2 * Math.PI * y) / e;
        const _ = w < 40 ? (t() * 2 - 1) * (1 - w / 40) * 0.3 : 0;
        o[w] = Math.sin(m) * Math.exp(-w / x) * Math.min(1, w / 12) + _;
      }
    }
    let l = 1e-6;
    for (let g = 0; g < n; g++) l = Math.max(l, Math.abs(o[g]));
    const c = (t() * 2 - 1) * 0.85,
      h = Math.cos(((c + 1) * Math.PI) / 4) * (0.8 / l),
      f = Math.sin(((c + 1) * Math.PI) / 4) * (0.8 / l),
      u = r.createBuffer(2, n, e),
      d = u.getChannelData(0),
      p = u.getChannelData(1),
      v = Math.floor(n * 0.25);
    for (let g = 0; g < n; g++) {
      const x = g > n - v ? (n - g) / v : 1;
      ((d[g] = o[g] * h * x), (p[g] = o[g] * f * x));
    }
    ((u.kind = a), i.push(u));
  }
  return i;
}
function createReverbImpulse(r, t = 1.6) {
  const e = r.sampleRate,
    i = Math.floor(e * t),
    s = r.createBuffer(2, i, e),
    n = createAudioRandom(4242),
    o = Math.floor(0.008 * e),
    a = t * 0.7;
  for (let l = 0; l < 2; l++) {
    const c = s.getChannelData(l);
    let h = 0;
    for (let u = o; u < i; u++) {
      const d = (u - o) / e,
        p = Math.exp((-6.9 * d) / a),
        v = 0.12 + 0.75 * Math.exp(-d * 4);
      ((h += v * (n() * 2 - 1 - h)), (c[u] = h * p));
    }
    for (let u = 0; u < 10; u++) {
      const d = o + Math.floor(n() * 0.045 * e);
      d < i && (c[d] += (n() * 2 - 1) * 0.5 * (1 - u / 10));
    }
    const f = Math.floor(0.1 * e);
    for (let u = i - f; u < i; u++) c[u] *= (i - u) / f;
  }
  return s;
}
export { createReverbImpulse, getNoiseBuffers };
