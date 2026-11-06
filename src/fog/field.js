// Reconstructed module: identifiers and file boundaries are refactor choices.
import { FIELD_BOUNDS } from "../core/config.js";
import { clamp, smoothstep } from "../core/math.js";
const FOG_GRID_WIDTH = Math.round((FIELD_BOUNDS.sizeX / 12) * 64);
const FOG_GRID_DEPTH = Math.round((FIELD_BOUNDS.sizeZ / 8) * 43);
const FOG_GRID_CELL_COUNT = FOG_GRID_WIDTH * FOG_GRID_DEPTH;
const FOG_CELL_WIDTH = FIELD_BOUNDS.sizeX / FOG_GRID_WIDTH;
const FOG_CELL_DEPTH = FIELD_BOUNDS.sizeZ / FOG_GRID_DEPTH;
const v1 = 0.05;
const x1 = 0.3;
const ca = 2.2;
const y1 = 1.5;
const od = 0.018;
const Fh = 0.6;
class FogField {
  constructor(t, e) {
    ((this.terrain = t),
      (this.d = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.h = new Float32Array(FOG_GRID_CELL_COUNT).fill(x1)),
      (this.fresh = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.vx = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.vz = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._d = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._hd = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._f = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._t = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._k = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._vu = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._vw = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._m1 = new Uint8Array(FOG_GRID_CELL_COUNT)),
      (this._m2 = new Uint8Array(FOG_GRID_CELL_COUNT)),
      (this._a = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._b = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._c = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._e = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.bed = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.ground = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.waterLevel = -1 / 0),
      (this.lake = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.river = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.valley = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.bank = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.flat = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.windNX = e ? e.nx : 48),
      (this._wk = new Int32Array(FOG_GRID_CELL_COUNT)),
      (this._wfx = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._wfz = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._wpx = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._wnx = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._wpz = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this._wnz = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.top = new Float32Array(FOG_GRID_CELL_COUNT)),
      (this.data = new Float32Array(FOG_GRID_CELL_COUNT * 4)),
      (this.amount = 0),
      (this.any = !1),
      (this.empty = !0),
      (this.drift = {
        x: 0,
        z: 0,
      }),
      (this.bounds = {
        minX: 0,
        maxX: 0,
        minZ: 0,
        maxZ: 0,
        minY: 0,
        maxY: 0,
      }),
      this._initStatic(e),
      this.pack());
  }
  cellX(t) {
    return FIELD_BOUNDS.minX + (t + 0.5) * FOG_CELL_WIDTH;
  }
  cellZ(t) {
    return FIELD_BOUNDS.minZ + (t + 0.5) * FOG_CELL_DEPTH;
  }
  _initStatic(t) {
    const e = this.terrain,
      i = this.bed,
      s = this.windNX,
      n = t ? t.nz : 32,
      o = t ? t.cell : FIELD_BOUNDS.sizeX / 48;
    for (let l = 0; l < FOG_GRID_DEPTH; l++)
      for (let c = 0; c < FOG_GRID_WIDTH; c++) {
        const h = this.cellX(c),
          f = this.cellZ(l),
          u = l * FOG_GRID_WIDTH + c;
        ((i[u] = e.height(h, f)),
          (this.ground[u] = i[u]),
          (this.lake[u] = e.lakeMask(h, f)),
          (this.river[u] = e.riverMask(h, f)),
          (this.flat[u] = 1 - smoothstep(0.1, 0.4, e.slope(h, f))));
        const d = clamp((h - FIELD_BOUNDS.minX) / o - 0.5, 0, s - 1.001),
          p = clamp((f - FIELD_BOUNDS.minZ) / o - 0.5, 0, n - 1.001),
          v = Math.floor(d),
          g = Math.floor(p);
        ((this._wk[u] = g * s + v),
          (this._wfx[u] = d - v),
          (this._wfz[u] = p - g),
          (this._wpx[u] = smoothstep(
            0,
            Fh,
            FIELD_BOUNDS.minX + FIELD_BOUNDS.sizeX - h - FOG_CELL_WIDTH * 0.5,
          )),
          (this._wnx[u] = smoothstep(
            0,
            Fh,
            h - FIELD_BOUNDS.minX - FOG_CELL_WIDTH * 0.5,
          )),
          (this._wpz[u] = smoothstep(
            0,
            Fh,
            FIELD_BOUNDS.minZ + FIELD_BOUNDS.sizeZ - f - FOG_CELL_DEPTH * 0.5,
          )),
          (this._wnz[u] = smoothstep(
            0,
            Fh,
            f - FIELD_BOUNDS.minZ - FOG_CELL_DEPTH * 0.5,
          )));
      }
    const a = 7;
    for (let l = 0; l < FOG_GRID_DEPTH; l++)
      for (let c = 0; c < FOG_GRID_WIDTH; c++) {
        let h = 0,
          f = 0;
        for (let v = -a; v <= a; v++) {
          const g = l + v;
          if (!(g < 0 || g >= FOG_GRID_DEPTH))
            for (let x = -a; x <= a; x++) {
              const m = c + x;
              m < 0 ||
                m >= FOG_GRID_WIDTH ||
                x * x + v * v > a * a ||
                ((h += i[g * FOG_GRID_WIDTH + m]), f++);
            }
        }
        const u = l * FOG_GRID_WIDTH + c,
          d = h / f - i[u];
        let p =
          smoothstep(-0.04, 0.3, d) * 0.55 + smoothstep(1.1, 0.3, i[u]) * 0.6;
        ((p = Math.max(p, this.lake[u], this.river[u] * 0.9)),
          (p *= smoothstep(1.7, 1, i[u])),
          (this.valley[u] = clamp(p, 0, 1)),
          (this.bank[u] =
            smoothstep(1.25, 1.9, i[u]) * smoothstep(3.8, 3, i[u])));
      }
  }
  setWaterLevel(t) {
    if (Math.abs(t - this.waterLevel) < 0.003) return;
    this.waterLevel = t;
    const { bed: e, ground: i } = this;
    for (let s = 0; s < FOG_GRID_CELL_COUNT; s++) i[s] = e[s] < t ? t : e[s];
  }
  splat(t, e, i, s, n = 0.5, o = 0, a = 1) {
    if (!(s > 0) || !(i > 0)) return;
    const l = (t - FIELD_BOUNDS.minX) / FOG_CELL_WIDTH - 0.5,
      c = (e - FIELD_BOUNDS.minZ) / FOG_CELL_DEPTH - 0.5,
      h = i / FOG_CELL_WIDTH,
      f = i / FOG_CELL_DEPTH,
      u = Math.max(0, Math.floor(l - h)),
      d = Math.min(FOG_GRID_WIDTH - 1, Math.ceil(l + h)),
      p = Math.max(0, Math.floor(c - f)),
      v = Math.min(FOG_GRID_DEPTH - 1, Math.ceil(c + f)),
      { d: g, h: x } = this;
    for (let m = p; m <= v; m++)
      for (let w = u; w <= d; w++) {
        const y = (w - l) * FOG_CELL_WIDTH,
          _ = (m - c) * FOG_CELL_DEPTH,
          M = Math.sqrt(y * y + _ * _) / i;
        if (M >= 1) continue;
        const A = 1 - smoothstep(0.3, 1, M),
          b = m * FOG_GRID_WIDTH + w,
          S = Math.min(s * A, ca - g[b]);
        if (S <= 0) continue;
        const E = g[b] + S;
        if (
          ((x[b] = (x[b] * g[b] + n * S) / E),
          (g[b] = E),
          (this.fresh[b] = Math.min(
            1,
            this.fresh[b] + A * a * Math.min(1, s * 3),
          )),
          o > 0 && M > 0.02)
        ) {
          const T = o * A * Math.min(1, M * 2.2);
          ((this.vx[b] += (y / (M * i)) * T),
            (this.vz[b] += (_ / (M * i)) * T));
        }
      }
    this.empty = !1;
  }
  clear() {
    (this.d.fill(0),
      this.h.fill(x1),
      this.fresh.fill(0),
      this.vx.fill(0),
      this.vz.fill(0));
  }
  sources(t, e, i, s) {
    const {
        d: n,
        h: o,
        ground: a,
        valley: l,
        lake: c,
        river: h,
        bank: f,
      } = this,
      u = e.bank > 1e-4;
    let d = !1;
    for (let p = 0; p < FOG_GRID_CELL_COUNT; p++) {
      const v = a[p];
      let g = 0,
        x = 0;
      if (e.valley > 0 && l[p] > 0.02) {
        const _ =
          e.valley *
          l[p] *
          Math.max(0, e.valleyTarget * (0.55 + 0.45 * l[p]) - n[p]);
        ((g += _), (x += _ * clamp(e.valleyTop - v, 0.08, 0.55)));
      }
      const m = c[p] + h[p] * 0.5;
      if (e.steam > 0 && m > 0.05) {
        const _ = e.steam * m * Math.max(0, e.steamTarget - n[p]);
        ((g += _), (x += _ * 0.6));
      }
      if (u && f[p] > 0.02) {
        const _ = p % FOG_GRID_WIDTH,
          M = (p / FOG_GRID_WIDTH) | 0,
          A = smoothstep(
            -0.1,
            0.45,
            i.noise3(_ * 0.11 + s * 0.018, M * 0.14, s * 0.012),
          ),
          b = e.bank * f[p] * A * Math.max(0, e.bankTarget - n[p]);
        ((g += b), (x += b * (0.4 + 0.25 * A)));
      }
      if (e.mist > 0) {
        const _ =
          e.mist *
          (0.3 + 0.7 * l[p]) *
          Math.max(0, e.mistTarget - n[p]) *
          (v < 3.2 ? 1 : 0.3);
        ((g += _), (x += _ * (0.28 + 0.22 * l[p])));
      }
      if (g <= 0) continue;
      const w = g * t,
        y = n[p] + w;
      ((o[p] = (o[p] * n[p] + (x / g) * w) / y), (n[p] = y), (d = !0));
    }
    d && (this.empty = !1);
  }
  step(t, e) {
    if (t <= 0) return;
    const { d: i, h: s, fresh: n, vx: o, vz: a, ground: l } = this,
      c = this._d,
      h = this._hd,
      f = this._f,
      u = this._k,
      d = e.wind,
      p = d.u,
      v = d.w,
      g = d.turb,
      x = this.windNX,
      m = this._wk,
      w = this._wfx,
      y = this._wfz,
      _ = this._wpx,
      M = this._wnx,
      A = this._wpz,
      b = this._wnz,
      S = d.gustAt(0, 0),
      E = d.ambient.x * S,
      T = d.ambient.y * S,
      R = E * e.ambientK,
      z = T * e.ambientK;
    for (let Y = 0; Y < FOG_GRID_CELL_COUNT; Y++)
      ((c[Y] = i[Y]), (h[Y] = s[Y] * i[Y]), (f[Y] = n[Y]));
    const L = this._activeMask(c),
      k = this._vu,
      U = this._vw,
      F = this._t;
    for (let Y = 0; Y < FOG_GRID_CELL_COUNT; Y++)
      F[Y] = l[Y] + s[Y] * smoothstep(0.02, 0.35, c[Y]);
    let G = 0,
      B = 0,
      q = 0;
    for (let Y = 0; Y < FOG_GRID_CELL_COUNT; Y++) {
      if (!L[Y]) {
        ((k[Y] = 0), (U[Y] = 0), (u[Y] = 0));
        continue;
      }
      const xt = Y % FOG_GRID_WIDTH,
        yt = (Y - xt) / FOG_GRID_WIDTH,
        fe =
          (F[xt < FOG_GRID_WIDTH - 1 ? Y + 1 : Y] - F[xt > 0 ? Y - 1 : Y]) /
          ((xt > 0 && xt < FOG_GRID_WIDTH - 1 ? 2 : 1) * FOG_CELL_WIDTH),
        et =
          (F[yt < FOG_GRID_DEPTH - 1 ? Y + FOG_GRID_WIDTH : Y] -
            F[yt > 0 ? Y - FOG_GRID_WIDTH : Y]) /
          ((yt > 0 && yt < FOG_GRID_DEPTH - 1 ? 2 : 1) * FOG_CELL_DEPTH),
        ut = Math.sqrt(fe * fe + et * et),
        dt = ut > 1.6 ? 1.6 / ut : 1,
        ft = m[Y],
        wt = w[Y],
        Wt = y[Y],
        Ht = 1 - wt,
        qt = 1 - Wt,
        ce =
          (p[ft] * Ht + p[ft + 1] * wt) * qt +
          (p[ft + x] * Ht + p[ft + x + 1] * wt) * Wt,
        O =
          (v[ft] * Ht + v[ft + 1] * wt) * qt +
          (v[ft + x] * Ht + v[ft + x + 1] * wt) * Wt,
        Ae =
          (g[ft] * Ht + g[ft + 1] * wt) * qt +
          (g[ft + x] * Ht + g[ft + x + 1] * wt) * Wt,
        de = c[Y],
        D = e.drain * smoothstep(0.12, 0.9, de);
      let P = ce * 0.9 + R - fe * dt * D + o[Y],
        W = O * 0.9 + z - et * dt * D + a[Y];
      ((P *= P > 0 ? _[Y] : M[Y]),
        (W *= W > 0 ? A[Y] : b[Y]),
        (k[Y] = P),
        (U[Y] = W),
        de > 0.02 && ((G += (ce + R) * de), (B += (O + z) * de), (q += de)));
      const Z = ce + E,
        st = O + T,
        _t = Math.sqrt(Z * Z + st * st);
      u[Y] = e.windK * (_t > 1.1 ? _t - 1.1 : 0) + e.turbK * Ae;
    }
    q > 0 && ((this.drift.x = G / q), (this.drift.z = B / q));
    const X = t / FOG_CELL_WIDTH,
      vt = t / FOG_CELL_DEPTH;
    for (let Y = 0; Y < FOG_GRID_DEPTH; Y++)
      for (let xt = 0; xt < FOG_GRID_WIDTH; xt++) {
        const yt = Y * FOG_GRID_WIDTH + xt;
        if (!L[yt]) {
          ((i[yt] = 0), (n[yt] = 0));
          continue;
        }
        const fe = k[yt],
          et = U[yt];
        let ut = xt - fe * X,
          dt = Y - et * vt;
        ((ut =
          ut < 0
            ? 0
            : ut > FOG_GRID_WIDTH - 1.001
              ? FOG_GRID_WIDTH - 1.001
              : ut),
          (dt =
            dt < 0
              ? 0
              : dt > FOG_GRID_DEPTH - 1.001
                ? FOG_GRID_DEPTH - 1.001
                : dt));
        const ft = ut | 0,
          wt = dt | 0,
          Wt = ut - ft,
          Ht = dt - wt,
          qt = wt * FOG_GRID_WIDTH + ft,
          ce = (1 - Wt) * (1 - Ht),
          O = Wt * (1 - Ht),
          Ae = (1 - Wt) * Ht,
          de = Wt * Ht;
        let D =
          c[qt] * ce +
          c[qt + 1] * O +
          c[qt + FOG_GRID_WIDTH] * Ae +
          c[qt + FOG_GRID_WIDTH + 1] * de;
        (D > 1e-5 &&
          (s[yt] =
            (h[qt] * ce +
              h[qt + 1] * O +
              h[qt + FOG_GRID_WIDTH] * Ae +
              h[qt + FOG_GRID_WIDTH + 1] * de) /
            D),
          (n[yt] =
            f[qt] * ce +
            f[qt + 1] * O +
            f[qt + FOG_GRID_WIDTH] * Ae +
            f[qt + FOG_GRID_WIDTH + 1] * de));
        const P = xt < FOG_GRID_WIDTH - 1 ? k[yt + 1] : 0,
          W = xt > 0 ? k[yt - 1] : 0,
          Z = Y < FOG_GRID_DEPTH - 1 ? U[yt + FOG_GRID_WIDTH] : 0,
          st = Y > 0 ? U[yt - FOG_GRID_WIDTH] : 0;
        let bt =
          1 -
          ((P - W) / (2 * FOG_CELL_WIDTH) + (Z - st) / (2 * FOG_CELL_DEPTH)) *
            t;
        bt = bt < 0.7 ? 0.7 : bt > 1.3 ? 1.3 : bt;
        const ot = Math.sqrt(bt);
        D *= ot;
        let lt = s[yt] * ot;
        (D > ca && ((lt *= D / ca), (D = ca)),
          (s[yt] = lt < y1 ? lt : y1),
          (i[yt] = D));
      }
    const gt = Math.min(0.2, e.diffusion * t),
      Qt = Math.min(0.45, e.level * t);
    for (let Y = 0; Y < FOG_GRID_CELL_COUNT; Y++)
      ((c[Y] = i[Y]), (h[Y] = l[Y] + s[Y]));
    for (let Y = 0; Y < FOG_GRID_DEPTH; Y++)
      for (let xt = 0; xt < FOG_GRID_WIDTH; xt++) {
        const yt = Y * FOG_GRID_WIDTH + xt;
        if (!L[yt]) continue;
        const fe = c[yt],
          et = xt > 0 ? yt - 1 : yt,
          ut = xt < FOG_GRID_WIDTH - 1 ? yt + 1 : yt,
          dt = Y > 0 ? yt - FOG_GRID_WIDTH : yt,
          ft = Y < FOG_GRID_DEPTH - 1 ? yt + FOG_GRID_WIDTH : yt,
          wt = fe + gt * (c[et] + c[ut] + c[dt] + c[ft] - 4 * fe);
        if (((i[yt] = wt), wt < od * 0.25)) continue;
        const Wt = h[yt],
          Ht = c[et] / (c[et] + 0.08),
          qt = c[ut] / (c[ut] + 0.08),
          ce = c[dt] / (c[dt] + 0.08),
          O = c[ft] / (c[ft] + 0.08),
          Ae =
            Ht * (h[et] - Wt) +
            qt * (h[ut] - Wt) +
            ce * (h[dt] - Wt) +
            O * (h[ft] - Wt),
          de = Wt + Qt * this.flat[yt] * Ae * 0.25;
        s[yt] = Math.max(v1, de - l[yt]);
      }
    const te = Math.exp(-t / 5),
      Zt = Math.exp(-t * 2.4),
      J = Math.exp(-e.sun * 0.35 * t),
      nt = 0.0025 * t;
    let mt = !1;
    for (let Y = 0; Y < FOG_GRID_CELL_COUNT; Y++) {
      if (!L[Y]) continue;
      if (((o[Y] *= Zt), (a[Y] *= Zt), i[Y] < 1e-5)) {
        i[Y] = 0;
        continue;
      }
      const xt = e.seaTemp - e.lapse * Math.max(0, l[Y]),
        yt =
          e.base +
          e.sun * (1 - 0.65 * n[Y]) +
          e.dry +
          e.warmK * Math.max(0, xt - 17) +
          u[Y],
        fe = i[Y],
        et = fe * Math.exp(-yt * t) - (fe < 0.08 ? nt * (1 - fe / 0.08) : 0);
      ((i[Y] = et > 0 ? (et < ca ? et : ca) : 0),
        (s[Y] = Math.max(v1, s[Y] * J)),
        (n[Y] *= te),
        i[Y] > 0 && (mt = !0));
    }
    this.empty = !mt;
  }
  _activeMask(t) {
    const e = this._m1,
      i = this._m2,
      s = 3;
    for (let n = 0; n < FOG_GRID_CELL_COUNT; n++) e[n] = t[n] > 1e-5 ? 1 : 0;
    for (let n = 0; n < FOG_GRID_DEPTH; n++) {
      const o = n * FOG_GRID_WIDTH;
      for (let a = 0; a < FOG_GRID_WIDTH; a++) {
        let l = 0;
        const c = a > s ? a - s : 0,
          h = a < FOG_GRID_WIDTH - 1 - s ? a + s : FOG_GRID_WIDTH - 1;
        for (let f = c; f <= h && !l; f++) l = e[o + f];
        i[o + a] = l;
      }
    }
    for (let n = 0; n < FOG_GRID_DEPTH; n++) {
      const o = n > s ? n - s : 0,
        a = n < FOG_GRID_DEPTH - 1 - s ? n + s : FOG_GRID_DEPTH - 1;
      for (let l = 0; l < FOG_GRID_WIDTH; l++) {
        let c = 0;
        for (let h = o; h <= a && !c; h++) c = i[h * FOG_GRID_WIDTH + l];
        e[n * FOG_GRID_WIDTH + l] = c;
      }
    }
    return e;
  }
  pack() {
    const {
        d: t,
        h: e,
        ground: i,
        top: s,
        data: n,
        fresh: o,
        vx: a,
        vz: l,
      } = this,
      c = this._t,
      h = this._a,
      f = this._b,
      u = this._c,
      d = this._e;
    let p = 0,
      v = 0;
    for (let m = 0; m < FOG_GRID_CELL_COUNT; m++) {
      const w = t[m];
      ((c[m] = i[m] + e[m] * (0.45 + 0.55 * smoothstep(0, 0.8, w))),
        (h[m] = w + 0.002),
        (f[m] = h[m] * c[m]),
        (p += w < 1 ? w : 1),
        w > v && (v = w));
    }
    ((this.amount = p / FOG_GRID_CELL_COUNT),
      (this.empty = v < 1e-5),
      this._box3(h, u),
      this._box3(f, d));
    for (let m = 0; m < FOG_GRID_CELL_COUNT; m++) s[m] = d[m] / u[m];
    for (let m = 0; m < FOG_GRID_CELL_COUNT; m++) {
      const w = t[m];
      ((h[m] = w),
        (f[m] =
          w > od ? s[m] + 0.08 + 0.58 * Math.max(0.05, s[m] - i[m]) : -1e9));
    }
    (this._max3(h, u), this._max3(f, d));
    const g = this.bounds;
    ((g.minX = g.minZ = g.minY = 1 / 0), (g.maxX = g.maxZ = g.maxY = -1 / 0));
    let x = !1;
    for (let m = 0; m < FOG_GRID_DEPTH; m++) {
      const w = this.cellZ(m);
      for (let y = 0; y < FOG_GRID_WIDTH; y++) {
        const _ = m * FOG_GRID_WIDTH + y,
          M = i[_];
        let A;
        if (u[_] > od) {
          ((A = Math.max(d[_], M + 0.06)), (x = !0));
          const E = this.cellX(y);
          (E < g.minX && (g.minX = E),
            E > g.maxX && (g.maxX = E),
            w < g.minZ && (g.minZ = w),
            w > g.maxZ && (g.maxZ = w),
            M < g.minY && (g.minY = M),
            A > g.maxY && (g.maxY = A));
        } else A = M - 0.35;
        const b = _ * 4;
        ((n[b] = t[_]), (n[b + 1] = s[_]), (n[b + 2] = A));
        const S = a[_] * a[_] + l[_] * l[_];
        n[b + 3] = Math.min(1, o[_] + (S > 0 ? Math.sqrt(S) * 0.5 : 0));
      }
    }
    ((this.any = x),
      x &&
        ((g.minX -= FOG_CELL_WIDTH * 1.5),
        (g.maxX += FOG_CELL_WIDTH * 1.5),
        (g.minZ -= FOG_CELL_DEPTH * 1.5),
        (g.maxZ += FOG_CELL_DEPTH * 1.5),
        (g.minY -= 0.1),
        (g.maxY += 0.1)));
  }
  _box3(t, e) {
    const i =
      this._tmpRow || (this._tmpRow = new Float32Array(FOG_GRID_CELL_COUNT));
    for (let s = 0; s < FOG_GRID_DEPTH; s++) {
      const n = s * FOG_GRID_WIDTH;
      for (let o = 0; o < FOG_GRID_WIDTH; o++) {
        let a = t[n + o];
        (o > 0 && (a += t[n + o - 1]),
          o < FOG_GRID_WIDTH - 1 && (a += t[n + o + 1]),
          (i[n + o] = a));
      }
    }
    for (let s = 0; s < FOG_GRID_DEPTH; s++) {
      const n = s * FOG_GRID_WIDTH;
      for (let o = 0; o < FOG_GRID_WIDTH; o++) {
        let a = i[n + o];
        (s > 0 && (a += i[n - FOG_GRID_WIDTH + o]),
          s < FOG_GRID_DEPTH - 1 && (a += i[n + FOG_GRID_WIDTH + o]),
          (e[n + o] = a));
      }
    }
  }
  _max3(t, e) {
    const i =
      this._tmpRow || (this._tmpRow = new Float32Array(FOG_GRID_CELL_COUNT));
    for (let s = 0; s < FOG_GRID_DEPTH; s++) {
      const n = s * FOG_GRID_WIDTH;
      for (let o = 0; o < FOG_GRID_WIDTH; o++) {
        let a = t[n + o];
        (o > 0 && t[n + o - 1] > a && (a = t[n + o - 1]),
          o < FOG_GRID_WIDTH - 1 && t[n + o + 1] > a && (a = t[n + o + 1]),
          (i[n + o] = a));
      }
    }
    for (let s = 0; s < FOG_GRID_DEPTH; s++) {
      const n = s * FOG_GRID_WIDTH;
      for (let o = 0; o < FOG_GRID_WIDTH; o++) {
        let a = i[n + o];
        (s > 0 &&
          i[n - FOG_GRID_WIDTH + o] > a &&
          (a = i[n - FOG_GRID_WIDTH + o]),
          s < FOG_GRID_DEPTH - 1 &&
            i[n + FOG_GRID_WIDTH + o] > a &&
            (a = i[n + FOG_GRID_WIDTH + o]),
          (e[n + o] = a));
      }
    }
  }
  sampleData(t, e, i) {
    const s = (e - FIELD_BOUNDS.minX) / FOG_CELL_WIDTH - 0.5,
      n = (i - FIELD_BOUNDS.minZ) / FOG_CELL_DEPTH - 0.5,
      o = s < 0 ? 0 : s > FOG_GRID_WIDTH - 1.001 ? FOG_GRID_WIDTH - 1.001 : s,
      a = n < 0 ? 0 : n > FOG_GRID_DEPTH - 1.001 ? FOG_GRID_DEPTH - 1.001 : n,
      l = o | 0,
      c = a | 0,
      h = o - l,
      f = a - c,
      u = (c * FOG_GRID_WIDTH + l) * 4 + t,
      d = this.data;
    return (
      (d[u] * (1 - h) + d[u + 4] * h) * (1 - f) +
      (d[u + FOG_GRID_WIDTH * 4] * (1 - h) +
        d[u + FOG_GRID_WIDTH * 4 + 4] * h) *
        f
    );
  }
}
export { FOG_GRID_DEPTH, FOG_GRID_WIDTH, FogField };
