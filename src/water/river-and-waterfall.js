// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferGeometry,
  ThreeCircleGeometry,
  ThreeConeGeometry,
  ThreeDoubleSide,
  ThreeFloat32BufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeMesh,
  ThreeMeshStandardMaterial,
  ThreeQuaternion,
  ThreeShaderMaterial,
  ThreeVector2,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import {
  RIVER_PATH,
  lakeEllipse,
  riverHalfWidth,
  terrainHeight,
} from "../simulation/terrain-shape.js";
import {
  createWaterRandom,
  waterShadowDefines,
} from "./uniforms-and-shadow-binding.js";
import { sourceSurfaceHalfWidth } from "../layout/river-source-layout.js";
import { WATER_COMMON_GLSL } from "./common-shader.js";
import {
  RIVER_FRAGMENT_GLSL,
  RIVER_VERTEX_GLSL,
  WATERFALL_LIP_SEGMENT,
  WATERFALL_POOL_SEGMENT,
  icicleInstanceMatrix,
  icicleInstanceScale,
} from "./river-shaders.js";
import {
  PLUNGE_POOL_FRAGMENT_GLSL,
  PLUNGE_POOL_VERTEX_GLSL,
  RIVER_MATERIAL_OPTIONS,
  WATERFALL_FRAGMENT_GLSL,
  WATERFALL_VERTEX_GLSL,
} from "./waterfall-shaders.js";
class RiverAndWaterfall {
  constructor(t, e, i) {
    this.ctx = t;
    const s = (f, u, d = {}, p = {}) =>
        new ThreeShaderMaterial({
          uniforms: {
            ...t.uniforms,
            ...e,
            ...d,
          },
          vertexShader: t.GLSL_COMMON + WATER_COMMON_GLSL + f,
          fragmentShader: t.GLSL_COMMON + WATER_COMMON_GLSL + u,
          defines: p,
          ...RIVER_MATERIAL_OPTIONS,
        }),
      { geo: n, poolS: o, lipS: a } = this._buildRibbon();
    ((this.ribbon = new ThreeMesh(
      n,
      s(
        RIVER_VERTEX_GLSL,
        RIVER_FRAGMENT_GLSL,
        {
          uPoolS: {
            value: o,
          },
          uLipS: {
            value: a,
          },
        },
        waterShadowDefines(t),
      ),
    )),
      (this.ribbon.renderOrder = 1.04),
      (this.ribbon.name = "water:river"),
      (this.lip = sampleRiverSegment(WATERFALL_LIP_SEGMENT)),
      (this.pool = sampleRiverSegment(WATERFALL_POOL_SEGMENT)),
      (this.fallGeo = this._buildFall()));
    const l = s(WATERFALL_VERTEX_GLSL, WATERFALL_FRAGMENT_GLSL, {
      uAcross: {
        value: this._across(),
      },
    });
    ((l.side = ThreeDoubleSide),
      (this.fall = new ThreeMesh(this.fallGeo, l)),
      (this.fall.renderOrder = 1.05),
      (this.fall.name = "water:waterfall"));
    const c = 0.36,
      h = new ThreeCircleGeometry(c, 40);
    (h.rotateX(-Math.PI / 2),
      h.translate(this.pool.x, this.pool.y + 0.006, this.pool.z),
      (this.poolMesh = new ThreeMesh(
        h,
        s(PLUNGE_POOL_VERTEX_GLSL, PLUNGE_POOL_FRAGMENT_GLSL),
      )),
      (this.poolMesh.renderOrder = 1.051),
      (this.poolMesh.name = "water:plunge-pool"),
      (this.icicles = this._buildIcicles()));
    for (const f of [this.ribbon, this.fall, this.poolMesh, this.icicles])
      ((f.frustumCulled = !1), (f.matrixAutoUpdate = !1), i.add(f));
    this.frost = 0;
  }
  _buildRibbon() {
    const t = RIVER_PATH,
      e = t.length,
      i = new Float32Array(e),
      s = new Float32Array(e),
      n = new Float32Array(e),
      o = new Float32Array(e);
    for (let S = 0; S < e; S++) {
      const E = t[Math.max(0, S - 1)],
        T = t[Math.min(e - 1, S + 1)],
        R = T.x - E.x,
        z = T.z - E.z,
        L = Math.hypot(R, z) || 1;
      ((i[S] = R / L), (s[S] = z / L), (n[S] = Math.max(0, (E.y - T.y) / L)));
    }
    const a = Float32Array.from(n);
    for (let S = 0; S < e; S++) {
      let E = 0,
        T = 0;
      for (let R = -3; R <= 3; R++) {
        const z = S + R;
        z >= 0 && z < e && ((E += n[z]), T++);
      }
      a[S] = E / T;
    }
    for (let S = 1; S < e; S++) {
      const E = t[S].s - t[S - 1].s;
      o[S] = o[S - 1] + E / (0.2 + Math.min(a[S], 1.2) * 2);
    }
    const l = new Float32Array(e),
      c = new Float32Array(e);
    for (let S = 0; S < e; S++) {
      const E = t[S],
        T =
          E.seg < 1
            ? sourceSurfaceHalfWidth(E.seg, riverHalfWidth(E.t) * 1.9 + 0.05)
            : riverHalfWidth(E.t) * 1.9 + 0.05,
        R = -s[S],
        z = i[S];
      for (const L of [1, -1]) {
        let k = T;
        for (let U = 0.02; U < T; U += 0.01)
          if (terrainHeight(E.x + R * U * L, E.z + z * U * L) >= E.y + 0.004) {
            k = Math.min(T, U + 0.035);
            break;
          }
        (L > 0 ? l : c)[S] = k;
      }
    }
    const h = (S) => {
        const E = Float32Array.from(S);
        for (let T = 0; T < e; T++) {
          let R = 0,
            z = 0;
          for (let L = -4; L <= 4; L++) {
            const k = T + L;
            k >= 0 && k < e && ((R += S[k]), z++);
          }
          E[T] = R / z;
        }
        return E;
      },
      f = h(l),
      u = h(c),
      d = 9,
      p = [],
      v = [],
      g = [],
      x = [],
      m = [];
    let w = 0;
    const y = [
      [0, -1],
      [-1, e - 1],
    ];
    let _ = 0,
      M = 0;
    for (let S = 0; S < e; S++)
      (t[S].seg <= WATERFALL_LIP_SEGMENT + 0.02 && (_ = S),
        !M && t[S].seg >= WATERFALL_POOL_SEGMENT - 0.02 && (M = S));
    ((y[0][1] = _), (y[1][0] = M), (w = t[M].s));
    const A = t[_].s;
    for (const [S, E] of y) {
      const T = p.length / 3;
      for (let z = S; z <= E; z++) {
        const L = t[z],
          k = -s[z],
          U = i[z],
          F = lakeEllipse(L.x, L.z),
          G = Math.min(1, L.s / 0.035);
        for (let B = 0; B < d; B++) {
          const q = (B / (d - 1)) * 2 - 1,
            bankWidth = q >= 0 ? f[z] : u[z],
            X =
              L.seg < 1 ? sourceSurfaceHalfWidth(L.seg, bankWidth) : bankWidth;
          (p.push(L.x + k * q * X, L.y, L.z + U * q * X),
            v.push(o[z], q, a[z], L.t),
            g.push(X, F, L.s, G),
            x.push(i[z], s[z]));
        }
      }
      const R = E - S + 1;
      for (let z = 0; z < R - 1; z++)
        for (let L = 0; L < d - 1; L++) {
          const k = T + z * d + L,
            U = k + 1,
            F = k + d,
            G = F + 1;
          m.push(k, U, F, U, G, F);
        }
    }
    const b = new ThreeBufferGeometry();
    return (
      b.setAttribute("position", new ThreeFloat32BufferAttribute(p, 3)),
      b.setAttribute("aFlow", new ThreeFloat32BufferAttribute(v, 4)),
      b.setAttribute("aSide", new ThreeFloat32BufferAttribute(g, 4)),
      b.setAttribute("aDir", new ThreeFloat32BufferAttribute(x, 2)),
      b.setIndex(m),
      {
        geo: b,
        poolS: w,
        lipS: A,
      }
    );
  }
  _across() {
    const t = this.pool.x - this.lip.x,
      e = this.pool.z - this.lip.z,
      i = Math.hypot(t, e);
    return new ThreeVector2(-e / i, t / i);
  }
  _buildFall() {
    const t = this.lip,
      e = this.pool,
      i = e.x - t.x,
      s = e.z - t.z,
      n = Math.hypot(i, s),
      o = i / n,
      a = s / n,
      l = -a,
      c = o,
      h = t.y - e.y,
      f = 32,
      u = 10,
      d = [],
      p = [],
      v = [],
      g = [];
    for (let m = 0; m <= f; m++) {
      const w = m / f,
        y = t.y + 0.004 - h * w * w,
        _ = 0.1 + 0.05 * w,
        M = o * n,
        A = a * n,
        b = -2 * h * w;
      let S = -c * b,
        E = c * M - l * A,
        T = l * b;
      S * o + T * a < 0 && ((S = -S), (E = -E), (T = -T));
      const R = Math.hypot(S, E, T) || 1;
      for (let z = 0; z <= u; z++) {
        const L = (z / u) * 2 - 1,
          k = 0.018 * (1 - L * L) * Math.sin(Math.PI * Math.min(1, w * 1.3));
        (d.push(
          t.x + o * n * w + l * _ * L + (S / R) * k,
          y + (E / R) * k,
          t.z + a * n * w + c * _ * L + (T / R) * k,
        ),
          p.push(w, L),
          v.push(S / R, E / R, T / R));
      }
    }
    for (let m = 0; m < f; m++)
      for (let w = 0; w < u; w++) {
        const y = m * (u + 1) + w,
          _ = y + 1,
          M = y + u + 1,
          A = M + 1;
        g.push(y, M, _, _, M, A);
      }
    const x = new ThreeBufferGeometry();
    return (
      x.setAttribute("position", new ThreeFloat32BufferAttribute(d, 3)),
      x.setAttribute("uv", new ThreeFloat32BufferAttribute(p, 2)),
      x.setAttribute("normal", new ThreeFloat32BufferAttribute(v, 3)),
      x.setIndex(g),
      x
    );
  }
  _buildIcicles() {
    const t = new ThreeConeGeometry(0.011, 1, 6, 1, !1);
    (t.rotateX(Math.PI), t.translate(0, -0.5, 0));
    const e = new ThreeMeshStandardMaterial({
        color: 14085367,
        roughness: 0.12,
        metalness: 0,
        transparent: !0,
        opacity: 0.82,
        emissive: 1451052,
      }),
      i = this.lip,
      s = this.pool,
      n = s.x - i.x,
      o = s.z - i.z,
      a = Math.hypot(n, o),
      l = n / a,
      c = o / a,
      h = -c,
      f = l,
      u = createWaterRandom(99),
      d = [];
    for (let w = 0; w < 16; w++) {
      const y = (w / 15) * 2 - 1;
      d.push({
        u: 0.02 + u() * 0.04,
        w: y * 1.25,
        len: 0.08 + u() * 0.28 * (1 - Math.abs(y) * 0.5),
      });
    }
    for (let w = 0; w < 10; w++) {
      const y = w % 2 ? 1 : -1;
      d.push({
        u: 0.1 + u() * 0.45,
        w: y * (1.35 + u() * 0.5),
        len: 0.05 + u() * 0.15,
      });
    }
    const p = new ThreeInstancedMesh(t, e, d.length),
      v = new ThreeMatrix4(),
      g = new ThreeQuaternion(),
      x = new ThreeVector3(),
      m = new ThreeVector3();
    return (
      (this._icicleBase = []),
      d.forEach((w, y) => {
        const _ = i.y - s.y,
          M = 0.1 + 0.05 * w.u,
          A = i.x + l * a * w.u + h * M * w.w - l * 0.03,
          b = i.z + c * a * w.u + f * M * w.w - c * 0.03,
          S = Math.max(i.y + 0.01 - _ * w.u * w.u, terrainHeight(A, b) + 0.02);
        (g.setFromAxisAngle(
          new ThreeVector3(u() - 0.5, 0, u() - 0.5).normalize(),
          (u() - 0.5) * 0.25,
        ),
          m.set(A, S, b),
          x.set(0.7 + u() * 0.8, w.len, 0.7 + u() * 0.8),
          this._icicleBase.push({
            p: m.clone(),
            q: g.clone(),
            s: x.clone(),
            delay: u() * 0.35,
          }),
          v.compose(m, g, x),
          p.setMatrixAt(y, v));
      }),
      (p.renderOrder = 1.06),
      (p.name = "water:icicles"),
      (p.visible = !1),
      (p.castShadow = !1),
      p
    );
  }
  update(t, e) {
    const i = e;
    this.frost +=
      (i - this.frost) * Math.min(1, t * (i > this.frost ? 0.25 : 0.4));
    const s = this.frost > 0.02;
    ((this.icicles.visible = s),
      s &&
        (this._icicleBase.forEach((n, o) => {
          const a = Math.max(
            0,
            Math.min(1, (this.frost - n.delay) / (1 - n.delay)),
          );
          (icicleInstanceScale.set(
            n.s.x * (0.4 + 0.6 * a),
            Math.max(1e-4, n.s.y * a * a),
            n.s.z * (0.4 + 0.6 * a),
          ),
            icicleInstanceMatrix.compose(n.p, n.q, icicleInstanceScale),
            this.icicles.setMatrixAt(o, icicleInstanceMatrix));
        }),
        (this.icicles.instanceMatrix.needsUpdate = !0)));
  }
  get meshes() {
    return [this.ribbon, this.fall, this.poolMesh, this.icicles];
  }
}
function sampleRiverSegment(r) {
  const t = RIVER_PATH;
  for (let i = 0; i < t.length - 1; i++)
    if (t[i + 1].seg >= r) {
      const s = (r - t[i].seg) / Math.max(1e-6, t[i + 1].seg - t[i].seg);
      return {
        x: t[i].x + (t[i + 1].x - t[i].x) * s,
        y: t[i].y + (t[i + 1].y - t[i].y) * s,
        z: t[i].z + (t[i + 1].z - t[i].z) * s,
        t: t[i].t,
      };
    }
  const e = t[t.length - 1];
  return {
    x: e.x,
    y: e.y,
    z: e.z,
    t: 1,
  };
}
export { RiverAndWaterfall };
