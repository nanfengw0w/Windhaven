// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferGeometry,
  ThreeFloat32BufferAttribute,
  ThreeUint16BufferAttribute,
  ThreeUint32BufferAttribute,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { lerp } from "../core/math.js";
const vegetationUpAxis = new ThreeVector3(0, 1, 0);
const U0 = new ThreeVector3();
const O0 = new ThreeVector3();
const Uf = new ThreeVector3();
const fv = new ThreeVector3();
class PlantGeometryBuilder {
  constructor(t) {
    ((this.foliage = t),
      (this.pos = []),
      (this.nrm = []),
      (this.uv = []),
      (this.tree = []),
      (this.info = []),
      (this.idx = []),
      t && ((this.card = []), (this.off = []), (this.ao = [])),
      (this.curAO = 1));
  }
  get count() {
    return this.pos.length / 3;
  }
  vert(t, e, i, s, n, o, a, l) {
    (this.pos.push(t.x, t.y, t.z),
      this.nrm.push(e.x, e.y, e.z),
      this.uv.push(i, s),
      this.tree.push(n[0], n[1], n[2], n[3]),
      this.info.push(o[0], o[1], o[2], o[3]),
      this.foliage &&
        (this.card.push(a[0], a[1], a[2], a[3]),
        this.off.push(l.x, l.y, l.z),
        this.ao.push(this.curAO)));
  }
  build() {
    const t = new ThreeBufferGeometry();
    return (
      t.setAttribute("position", new ThreeFloat32BufferAttribute(this.pos, 3)),
      t.setAttribute("normal", new ThreeFloat32BufferAttribute(this.nrm, 3)),
      t.setAttribute("uv", new ThreeFloat32BufferAttribute(this.uv, 2)),
      t.setAttribute("aTree", new ThreeFloat32BufferAttribute(this.tree, 4)),
      t.setAttribute("aInfo", new ThreeFloat32BufferAttribute(this.info, 4)),
      this.foliage &&
        (t.setAttribute("aCard", new ThreeFloat32BufferAttribute(this.card, 4)),
        t.setAttribute("aOff", new ThreeFloat32BufferAttribute(this.off, 3)),
        t.setAttribute("aAO", new ThreeFloat32BufferAttribute(this.ao, 1))),
      t.setIndex(
        this.count > 65535
          ? new ThreeUint32BufferAttribute(this.idx, 1)
          : new ThreeUint16BufferAttribute(this.idx, 1),
      ),
      t.computeBoundingSphere(),
      (t.boundingSphere.radius += 0.5),
      t
    );
  }
}
function appendBranchTube(r, t, e, i, s, n, o, a, l, c) {
  const h = t.length,
    f = r.count,
    u = new ThreeVector3(),
    d = new ThreeVector3(),
    p = new ThreeVector3();
  let v = 0;
  for (let x = 0; x < h; x++) {
    (x < h - 1
      ? p.subVectors(t[x + 1], t[Math.max(0, x - 1)]).normalize()
      : p.subVectors(t[x], t[x - 1]).normalize(),
      x === 0
        ? (u.set(1, 0, 0),
          Math.abs(p.x) > 0.9 && u.set(0, 0, 1),
          u.addScaledVector(p, -u.dot(p)).normalize())
        : (u.addScaledVector(p, -u.dot(p)).normalize(),
          (v += t[x].distanceTo(t[x - 1]))),
      d.crossVectors(p, u));
    const m = lerp(o, a, x / (h - 1));
    for (let w = 0; w <= i; w++) {
      const y = (w / i) * Math.PI * 2;
      (Uf.copy(u).multiplyScalar(Math.cos(y)).addScaledVector(d, Math.sin(y)),
        U0.copy(t[x]).addScaledVector(Uf, e[x]),
        r.vert(U0, Uf, w / i, v, s, [n, m, l, c]));
    }
  }
  const g = i + 1;
  for (let x = 0; x < h - 1; x++)
    for (let m = 0; m < i; m++) {
      const w = f + x * g + m,
        y = w + g;
      r.idx.push(w, y, w + 1, y, y + 1, w + 1);
    }
}
function appendFoliageCard(
  r,
  t,
  e,
  i,
  s,
  n,
  o,
  a,
  l,
  c,
  h = null,
  f = 1,
  u = 1,
) {
  const d = r.count,
    p = s * n * 0.5,
    v = h ? 3 : 2,
    g = new ThreeVector3(),
    x = new ThreeVector3();
  for (let m = 0; m < v; m++) {
    const w = m / (v - 1);
    (h
      ? m === 1
        ? x.copy(e).multiplyScalar(s * 0.5)
        : m === 2
          ? x
              .copy(e)
              .multiplyScalar(s * 0.5)
              .addScaledVector(h, s * 0.5)
          : x.set(0, 0, 0)
      : x.copy(e).multiplyScalar(s * w),
      (r.curAO = lerp(f, u, w)));
    for (const y of [-1, 1])
      (g.copy(x).addScaledVector(i, y * p),
        U0.copy(t).add(g),
        r.vert(U0, o, y < 0 ? 0 : 1, w, a, l, [c[0], c[1], w, c[3]], g));
  }
  for (let m = 0; m < v - 1; m++) {
    const w = d + m * 2;
    r.idx.push(w, w + 1, w + 2, w + 1, w + 3, w + 2);
  }
}
function randomPerpendicularVector(r, t, e) {
  return (
    O0.set(t() - 0.5, t() - 0.5, t() - 0.5),
    e.crossVectors(r, O0),
    e.lengthSq() < 1e-6 && e.set(1, 0, 0).cross(r),
    e.normalize()
  );
}
function rotatePlantVector(r, t, e) {
  return r.applyAxisAngle(t, e);
}
function growBranchSkeleton(r, t, e, i, s, n, o, a, l, c = null) {
  const h = t.segs[o],
    f = [e.clone()],
    u = [n],
    d = i.clone(),
    p = e.clone(),
    v = t.tip[o];
  for (let y = 1; y <= h; y++)
    (O0.set(r() - 0.5, (r() - 0.5) * 0.5, r() - 0.5).multiplyScalar(
      t.wander[o],
    ),
      d.add(O0).addScaledVector(vegetationUpAxis, t.tropism[o]).normalize(),
      p.addScaledVector(d, s / h),
      f.push(p.clone()),
      u.push(n * lerp(1, v, y / h)));
  const g = Math.min(1, a + t.flexStep[o]);
  if (
    (l.branches.push({
      pts: f,
      radii: u,
      level: o,
      flex0: a,
      flex1: g,
    }),
    !c &&
      o >= (t.clumpLevel ?? 2) &&
      ((c = {
        c: new ThreeVector3(),
        n: 0,
        r: 0,
      }),
      l.clumps.push(c)),
    o >= t.levels)
  ) {
    (l.spots.push({
      p: p.clone(),
      d: d.clone(),
      level: o,
      flex: g,
      clump: c,
    }),
      r() < 0.6 &&
        l.spots.push({
          p: f[Math.max(1, h - 1)].clone(),
          d: d.clone(),
          level: o,
          flex: g * 0.9,
          clump: c,
        }));
    return;
  }
  const x = t.kids[o] + (r() < 0.5 ? 1 : 0),
    m = new ThreeVector3();
  let w = r() * Math.PI * 2;
  for (let y = 0; y < x; y++) {
    const _ = lerp(t.kidFrom[o], 1, (y + 0.5 + (r() - 0.5) * 0.4) / x),
      M = Math.min(h, Math.max(1, Math.round(_ * h))),
      A = d.clone();
    (randomPerpendicularVector(A, r, m),
      rotatePlantVector(m, A, w),
      (w += 2.39996));
    const b = lerp(t.angle[o][0], t.angle[o][1], r());
    A.applyAxisAngle(m, b).normalize();
    const S = s * t.lenRatio[o] * lerp(0.75, 1.15, r()) * (1.15 - _ * 0.4),
      E = u[M] * lerp(0.55, 0.72, r());
    growBranchSkeleton(r, t, f[M], A, S, E, o + 1, lerp(a, g, _), l, c);
  }
  o === t.levels - 1 &&
    l.spots.push({
      p: p.clone(),
      d: d.clone(),
      level: o,
      flex: g,
      clump: c,
    });
}
export {
  PlantGeometryBuilder,
  appendBranchTube,
  appendFoliageCard,
  fv,
  growBranchSkeleton,
  randomPerpendicularVector,
  vegetationUpAxis,
};
