// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferGeometry,
  ThreeColor,
  ThreeEuler,
  ThreeFloat32BufferAttribute,
  ThreeIcosahedronGeometry,
  ThreeMatrix3,
  ThreeMatrix4,
  ThreeQuaternion,
  ThreeUint16BufferAttribute,
  ThreeUint32BufferAttribute,
  ThreeVector3,
} from "../vendor/three-runtime.js";
const PROP_MATERIAL_KINDS = {
  log: 0,
  plank: 1,
  grey: 2,
  bark: 3,
  paint: 4,
  metal: 5,
  stone: 6,
  mortar: 7,
  roof: 8,
  window: 9,
  lantern: 10,
  rope: 11,
  leaf: 12,
  soot: 13,
};
const propPositionScratch = new ThreeVector3();
const propNormalScratch = new ThreeVector3();
const propPointAScratch = new ThreeVector3();
const propPointBScratch = new ThreeVector3();
const propAxisScratch = new ThreeVector3();
const propTangentScratch = new ThreeVector3();
const propBitangentScratch = new ThreeVector3();
const propNormalMatrixScratch = new ThreeMatrix3();
new ThreeMatrix4();
const propQuaternionScratch = new ThreeQuaternion();
const propEulerScratch = new ThreeEuler();
const propScaleScratch = new ThreeVector3();
function composePropTransform(
  r,
  t,
  e,
  i = 0,
  s = 0,
  n = 0,
  o = null,
  a = new ThreeMatrix4(),
) {
  return (
    propEulerScratch.set(s, i, n, "YXZ"),
    propQuaternionScratch.setFromEuler(propEulerScratch),
    propScaleScratch.set(1, 1, 1),
    a.compose(
      propPositionScratch.set(r, t, e),
      propQuaternionScratch,
      propScaleScratch,
    ),
    o && a.premultiply(o),
    a
  );
}
function createPropColor(r) {
  return new ThreeColor(r);
}
class PropGeometryBuilder {
  constructor() {
    ((this.pos = []),
      (this.nrm = []),
      (this.col = []),
      (this.grain = []),
      (this.info = []),
      (this.roof = []),
      (this.idx = []));
  }
  get vertexCount() {
    return this.pos.length / 3;
  }
  _vert(t, e, i, s, n, o, a, l, c, h, f, u, d) {
    (propPositionScratch.set(i, s, n).applyMatrix4(t),
      propNormalScratch.set(o, a, l).applyMatrix3(e).normalize(),
      this.pos.push(
        propPositionScratch.x,
        propPositionScratch.y,
        propPositionScratch.z,
      ),
      this.nrm.push(
        propNormalScratch.x,
        propNormalScratch.y,
        propNormalScratch.z,
      ));
    const p = c.col;
    return (
      this.col.push(p.r, p.g, p.b),
      this.grain.push(h, f, u),
      this.info.push(c.seed ?? 0, c.kind ?? 0, c.expo ?? 1, c.param ?? 0),
      d ? this.roof.push(d[0], d[1], d[2], d[3]) : this.roof.push(0, 0, 0, 0),
      this.pos.length / 3 - 1
    );
  }
  _quadIdx(t, e, i, s) {
    this.idx.push(t, e, i, t, i, s);
  }
  box(t, e, i, s, n) {
    propNormalMatrixScratch.getNormalMatrix(t);
    const o = e / 2,
      a = i / 2,
      l = s / 2,
      c = [
        [1, 0, 0, 0, 0, -1, 0, 1, 0],
        [-1, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, -1],
        [0, -1, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 0, 0, 0, 1, 0],
        [0, 0, -1, -1, 0, 0, 0, 1, 0],
      ],
      h = n.skip || "",
      f = ["px", "nx", "py", "ny", "pz", "nz"];
    for (let u = 0; u < 6; u++) {
      if (h.includes(f[u])) continue;
      const [d, p, v, g, x, m, w, y, _] = c[u],
        M = [];
      for (let A = 0; A < 4; A++) {
        const b = A === 0 || A === 3 ? -1 : 1,
          S = A < 2 ? -1 : 1,
          E = (d + g * b + w * S) * o,
          T = (p + x * b + y * S) * a,
          R = (v + m * b + _ * S) * l,
          z = this._grainOf(E, T, R, o, a, l, n);
        M.push(
          this._vert(
            t,
            propNormalMatrixScratch,
            E,
            T,
            R,
            d,
            p,
            v,
            n,
            z[0],
            z[1],
            z[2],
          ),
        );
      }
      this._quadIdx(M[0], M[1], M[2], M[3]);
    }
  }
  _grainOf(t, e, i, s, n, o, a) {
    if (a.stone) return [t / s, e / n, i / o];
    const l = a.pith ? a.pith[0] : 0,
      c = a.pith ? a.pith[1] : 0,
      h = a.goff || 0;
    switch (a.grain || "x") {
      case "y":
        return [e + h, t + l, i + c];
      case "z":
        return [i + h, t + l, e + c];
      default:
        return [t + h, e + l, i + c];
    }
  }
  cylinder(t, e, i, s, n, o, a, l, c, h, f = !0) {
    propNormalMatrixScratch.getNormalMatrix(t);
    const u = Array.isArray(l) ? l[0] : l,
      d = Array.isArray(l) ? l[1] : l;
    (propPointAScratch.set(e, i, s),
      propPointBScratch.set(n, o, a),
      propAxisScratch.subVectors(propPointBScratch, propPointAScratch));
    const p = propAxisScratch.length();
    (propAxisScratch.normalize(),
      Math.abs(propAxisScratch.y) < 0.9
        ? propTangentScratch.set(0, 1, 0)
        : propTangentScratch.set(1, 0, 0),
      propBitangentScratch
        .crossVectors(propAxisScratch, propTangentScratch)
        .normalize(),
      propTangentScratch
        .crossVectors(propBitangentScratch, propAxisScratch)
        .normalize());
    const v = h.twist || 0,
      g = [],
      x = (u - d) / p;
    for (let w = 0; w < 2; w++) {
      const y = w ? d : u,
        _ = [];
      for (let M = 0; M <= c; M++) {
        const A = (M / c) * Math.PI * 2 + v,
          b = Math.cos(A),
          S = Math.sin(A),
          E = propTangentScratch.x * b + propBitangentScratch.x * S,
          T = propTangentScratch.y * b + propBitangentScratch.y * S,
          R = propTangentScratch.z * b + propBitangentScratch.z * S,
          z = (w ? n : e) + E * y,
          L = (w ? o : i) + T * y,
          k = (w ? a : s) + R * y,
          U = E + propAxisScratch.x * x,
          F = T + propAxisScratch.y * x,
          G = R + propAxisScratch.z * x,
          B = h.pith || [0, 0];
        _.push(
          this._vert(
            t,
            propNormalMatrixScratch,
            z,
            L,
            k,
            U,
            F,
            G,
            {
              ...h,
              param: h.param ?? y,
            },
            (w ? p : 0) + (h.goff || 0),
            b * y + B[0],
            S * y + B[1],
          ),
        );
      }
      g.push(_);
    }
    for (let w = 0; w < c; w++)
      this._quadIdx(g[0][w], g[0][w + 1], g[1][w + 1], g[1][w]);
    if (!f) return;
    const m = h.capMat || h;
    for (let w = 0; w < 2; w++) {
      const y = w ? d : u,
        _ = w ? n : e,
        M = w ? o : i,
        A = w ? a : s,
        b = w ? 1 : -1,
        S = h.pith || [0, 0],
        E = {
          ...m,
          param: -y,
        },
        T = this._vert(
          t,
          propNormalMatrixScratch,
          _,
          M,
          A,
          propAxisScratch.x * b,
          propAxisScratch.y * b,
          propAxisScratch.z * b,
          E,
          (w ? p : 0) + (h.goff || 0),
          S[0],
          S[1],
        ),
        R = this.vertexCount;
      for (let z = 0; z <= c; z++) {
        const L = (z / c) * Math.PI * 2 + v,
          k = Math.cos(L),
          U = Math.sin(L),
          F = propTangentScratch.x * k + propBitangentScratch.x * U,
          G = propTangentScratch.y * k + propBitangentScratch.y * U,
          B = propTangentScratch.z * k + propBitangentScratch.z * U;
        this._vert(
          t,
          propNormalMatrixScratch,
          _ + F * y,
          M + G * y,
          A + B * y,
          propAxisScratch.x * b,
          propAxisScratch.y * b,
          propAxisScratch.z * b,
          E,
          (w ? p : 0) + (h.goff || 0),
          k * y + S[0],
          U * y + S[1],
        );
      }
      for (let z = 0; z < c; z++)
        w
          ? this.idx.push(T, R + z, R + z + 1)
          : this.idx.push(T, R + z + 1, R + z);
    }
  }
  quad(t, e, i, s, n = null) {
    (propNormalMatrixScratch.getNormalMatrix(t),
      propPointAScratch.set(
        e[1][0] - e[0][0],
        e[1][1] - e[0][1],
        e[1][2] - e[0][2],
      ),
      propPointBScratch.set(
        e[3][0] - e[0][0],
        e[3][1] - e[0][1],
        e[3][2] - e[0][2],
      ),
      propNormalScratch
        .crossVectors(propPointAScratch, propPointBScratch)
        .normalize());
    const o = propNormalScratch.x,
      a = propNormalScratch.y,
      l = propNormalScratch.z,
      c = e.map((h, f) =>
        this._vert(
          t,
          propNormalMatrixScratch,
          h[0],
          h[1],
          h[2],
          o,
          a,
          l,
          s,
          i[f][0],
          i[f][1],
          i[f][2],
          n ? n[f] : null,
        ),
      );
    this._quadIdx(c[0], c[1], c[2], c[3]);
  }
  tri(t, e, i, s) {
    (propNormalMatrixScratch.getNormalMatrix(t),
      propPointAScratch.set(
        e[1][0] - e[0][0],
        e[1][1] - e[0][1],
        e[1][2] - e[0][2],
      ),
      propPointBScratch.set(
        e[2][0] - e[0][0],
        e[2][1] - e[0][1],
        e[2][2] - e[0][2],
      ),
      propNormalScratch
        .crossVectors(propPointAScratch, propPointBScratch)
        .normalize());
    const n = e.map((o, a) =>
      this._vert(
        t,
        propNormalMatrixScratch,
        o[0],
        o[1],
        o[2],
        propNormalScratch.x,
        propNormalScratch.y,
        propNormalScratch.z,
        s,
        i[a][0],
        i[a][1],
        i[a][2],
      ),
    );
    this.idx.push(n[0], n[1], n[2]);
  }
  blob(t, e, i, s, n, o, a = 0, l = 1) {
    const c = new ThreeIcosahedronGeometry(1, a),
      h = c.attributes.position;
    propNormalMatrixScratch.getNormalMatrix(t);
    const f = [];
    for (let u = 0; u < h.count; u++) {
      const d = h.getX(u),
        p = h.getY(u),
        v = h.getZ(u);
      f.push(
        this._vert(
          t,
          propNormalMatrixScratch,
          e + d * n,
          i + p * n * l,
          s + v * n,
          d,
          p / l,
          v,
          o,
          d,
          p,
          v,
        ),
      );
    }
    for (let u = 0; u < f.length; u += 3)
      this.idx.push(f[u], f[u + 1], f[u + 2]);
    c.dispose();
  }
  raw(t, e, i, s, n, o) {
    propNormalMatrixScratch.getNormalMatrix(t);
    const a = this.vertexCount;
    for (let l = 0; l < e.length / 3; l++)
      this._vert(
        t,
        propNormalMatrixScratch,
        e[l * 3],
        e[l * 3 + 1],
        e[l * 3 + 2],
        i[l * 3],
        i[l * 3 + 1],
        i[l * 3 + 2],
        n,
        s[l * 3],
        s[l * 3 + 1],
        s[l * 3 + 2],
      );
    for (const l of o) this.idx.push(a + l);
  }
  toGeometry() {
    const t = new ThreeBufferGeometry();
    return (
      t.setAttribute("position", new ThreeFloat32BufferAttribute(this.pos, 3)),
      t.setAttribute("normal", new ThreeFloat32BufferAttribute(this.nrm, 3)),
      t.setAttribute("aCol", new ThreeFloat32BufferAttribute(this.col, 3)),
      t.setAttribute("aGrain", new ThreeFloat32BufferAttribute(this.grain, 3)),
      t.setAttribute("aInfo", new ThreeFloat32BufferAttribute(this.info, 4)),
      t.setAttribute("aRoof", new ThreeFloat32BufferAttribute(this.roof, 4)),
      t.setIndex(
        this.vertexCount > 65535
          ? new ThreeUint32BufferAttribute(this.idx, 1)
          : new ThreeUint16BufferAttribute(this.idx, 1),
      ),
      t.computeBoundingSphere(),
      t.computeBoundingBox(),
      t
    );
  }
}
function composeChildPropTransform(r, t, e, i, s = 0, n = 0, o = 0) {
  return composePropTransform(t, e, i, s, n, o, r, new ThreeMatrix4());
}
export {
  PROP_MATERIAL_KINDS,
  PropGeometryBuilder,
  composeChildPropTransform,
  createPropColor,
};
