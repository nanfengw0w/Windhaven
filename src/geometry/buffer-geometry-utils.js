// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferAttribute,
  ThreeBufferGeometry,
} from "../vendor/three-runtime.js";
function mergeBufferGeometries(r, t = !1) {
  const e = r[0].index !== null,
    i = new Set(Object.keys(r[0].attributes)),
    s = new Set(Object.keys(r[0].morphAttributes)),
    n = {},
    o = {},
    a = r[0].morphTargetsRelative,
    l = new ThreeBufferGeometry();
  let c = 0;
  for (let h = 0; h < r.length; ++h) {
    const f = r[h];
    let u = 0;
    if (e !== (f.index !== null))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.",
        ),
        null
      );
    for (const d in f.attributes) {
      if (!i.has(d))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              h +
              '. All geometries must have compatible attributes; make sure "' +
              d +
              '" attribute exists among all geometries, or in none of them.',
          ),
          null
        );
      (n[d] === void 0 && (n[d] = []), n[d].push(f.attributes[d]), u++);
    }
    if (u !== i.size)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            ". Make sure all geometries have the same number of attributes.",
        ),
        null
      );
    if (a !== f.morphTargetsRelative)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            ". .morphTargetsRelative must be consistent throughout all geometries.",
        ),
        null
      );
    for (const d in f.morphAttributes) {
      if (!s.has(d))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              h +
              ".  .morphAttributes must be consistent throughout all geometries.",
          ),
          null
        );
      (o[d] === void 0 && (o[d] = []), o[d].push(f.morphAttributes[d]));
    }
    if (t) {
      let d;
      if (e) d = f.index.count;
      else if (f.attributes.position !== void 0)
        d = f.attributes.position.count;
      else
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              h +
              ". The geometry must have either an index or a position attribute",
          ),
          null
        );
      (l.addGroup(c, d, h), (c += d));
    }
  }
  if (e) {
    let h = 0;
    const f = [];
    for (let u = 0; u < r.length; ++u) {
      const d = r[u].index;
      for (let p = 0; p < d.count; ++p) f.push(d.getX(p) + h);
      h += r[u].attributes.position.count;
    }
    l.setIndex(f);
  }
  for (const h in n) {
    const f = mergeBufferAttributes(n[h]);
    if (!f)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
            h +
            " attribute.",
        ),
        null
      );
    l.setAttribute(h, f);
  }
  for (const h in o) {
    const f = o[h][0].length;
    if (f !== 0) {
      ((l.morphAttributes = l.morphAttributes || {}),
        (l.morphAttributes[h] = []));
      for (let u = 0; u < f; ++u) {
        const d = [];
        for (let v = 0; v < o[h].length; ++v) d.push(o[h][v][u]);
        const p = mergeBufferAttributes(d);
        if (!p)
          return (
            console.error(
              "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
                h +
                " morphAttribute.",
            ),
            null
          );
        l.morphAttributes[h].push(p);
      }
    }
  }
  return l;
}
function mergeBufferAttributes(r) {
  let t,
    e,
    i,
    s = -1,
    n = 0;
  for (let c = 0; c < r.length; ++c) {
    const h = r[c];
    if ((t === void 0 && (t = h.array.constructor), t !== h.array.constructor))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.",
        ),
        null
      );
    if ((e === void 0 && (e = h.itemSize), e !== h.itemSize))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.",
        ),
        null
      );
    if ((i === void 0 && (i = h.normalized), i !== h.normalized))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.",
        ),
        null
      );
    if ((s === -1 && (s = h.gpuType), s !== h.gpuType))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.",
        ),
        null
      );
    n += h.count * e;
  }
  const o = new t(n),
    a = new ThreeBufferAttribute(o, e, i);
  let l = 0;
  for (let c = 0; c < r.length; ++c) {
    const h = r[c];
    if (h.isInterleavedBufferAttribute) {
      const f = l / e;
      for (let u = 0, d = h.count; u < d; u++)
        for (let p = 0; p < e; p++) {
          const v = h.getComponent(u, p);
          a.setComponent(u + f, p, v);
        }
    } else o.set(h.array, l);
    l += h.count * e;
  }
  return (s !== void 0 && (a.gpuType = s), a);
}
function weldGeometryVertices(r, t = 1e-4) {
  t = Math.max(t, Number.EPSILON);
  const e = {},
    i = r.getIndex(),
    s = r.getAttribute("position"),
    n = i ? i.count : s.count;
  let o = 0;
  const a = Object.keys(r.attributes),
    l = {},
    c = {},
    h = [],
    f = ["getX", "getY", "getZ", "getW"],
    u = ["setX", "setY", "setZ", "setW"];
  for (let m = 0, w = a.length; m < w; m++) {
    const y = a[m],
      _ = r.attributes[y];
    l[y] = new _.constructor(
      new _.array.constructor(_.count * _.itemSize),
      _.itemSize,
      _.normalized,
    );
    const M = r.morphAttributes[y];
    M &&
      (c[y] || (c[y] = []),
      M.forEach((A, b) => {
        const S = new A.array.constructor(A.count * A.itemSize);
        c[y][b] = new A.constructor(S, A.itemSize, A.normalized);
      }));
  }
  const d = t * 0.5,
    p = Math.log10(1 / t),
    v = Math.pow(10, p),
    g = d * v;
  for (let m = 0; m < n; m++) {
    const w = i ? i.getX(m) : m;
    let y = "";
    for (let _ = 0, M = a.length; _ < M; _++) {
      const A = a[_],
        b = r.getAttribute(A),
        S = b.itemSize;
      for (let E = 0; E < S; E++) y += `${Math.trunc(b[f[E]](w) * v + g)},`;
    }
    if (y in e) h.push(e[y]);
    else {
      for (let _ = 0, M = a.length; _ < M; _++) {
        const A = a[_],
          b = r.getAttribute(A),
          S = r.morphAttributes[A],
          E = b.itemSize,
          T = l[A],
          R = c[A];
        for (let z = 0; z < E; z++) {
          const L = f[z],
            k = u[z];
          if ((T[k](o, b[L](w)), S))
            for (let U = 0, F = S.length; U < F; U++) R[U][k](o, S[U][L](w));
        }
      }
      ((e[y] = o), h.push(o), o++);
    }
  }
  const x = r.clone();
  for (const m in r.attributes) {
    const w = l[m];
    if (
      (x.setAttribute(
        m,
        new w.constructor(
          w.array.slice(0, o * w.itemSize),
          w.itemSize,
          w.normalized,
        ),
      ),
      m in c)
    )
      for (let y = 0; y < c[m].length; y++) {
        const _ = c[m][y];
        x.morphAttributes[m][y] = new _.constructor(
          _.array.slice(0, o * _.itemSize),
          _.itemSize,
          _.normalized,
        );
      }
  }
  return (x.setIndex(h), x);
}
export { mergeBufferGeometries, weldGeometryVertices };
