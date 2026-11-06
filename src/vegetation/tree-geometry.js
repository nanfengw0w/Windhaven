// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeVector3 } from "../vendor/three-runtime.js";
import { clamp, lerp } from "../core/math.js";
import { PLANT_SPECIES_CODES } from "./tree-species.js";
import { FOLIAGE_ATLAS_ASPECTS } from "./foliage-atlas.js";
import {
  appendBranchTube,
  appendFoliageCard,
  fv,
  growBranchSkeleton,
  randomPerpendicularVector,
  vegetationUpAxis,
} from "./branch-geometry.js";
const BROADLEAF_TREE_PROFILES = {
  [PLANT_SPECIES_CODES.oak]: {
    levels: 3,
    segs: [7, 5, 3, 2],
    tip: [0.55, 0.45, 0.35, 0.3],
    wander: [0.12, 0.28, 0.4, 0.5],
    tropism: [0, 0.05, 0.04, 0.02],
    kids: [4, 3, 2],
    kidFrom: [0, 0.35, 0.3],
    angle: [
      [0.7, 1.1],
      [0.55, 0.95],
      [0.5, 0.9],
    ],
    lenRatio: [0, 0.55, 0.55],
    flexStep: [0.25, 0.25, 0.25, 0.25],
    trunk: [0.34, 0.42],
    trunkR: 0.042,
    card: 0.18,
    cardsPerSpot: 4,
    twigShare: 0.34,
    leader: 0.3,
  },
  [PLANT_SPECIES_CODES.birch]: {
    levels: 3,
    segs: [9, 4, 3, 2],
    tip: [0.3, 0.4, 0.35, 0.3],
    wander: [0.05, 0.2, 0.35, 0.4],
    tropism: [0, 0.1, -0.12, -0.18],
    kids: [8, 2, 2],
    kidFrom: [0.3, 0.3, 0.3],
    angle: [
      [0.55, 0.95],
      [0.4, 0.8],
      [0.4, 0.8],
    ],
    lenRatio: [0, 0.6, 0.6],
    flexStep: [0.3, 0.25, 0.25, 0.2],
    trunk: [0.97, 1],
    trunkR: 0.026,
    card: 0.13,
    cardsPerSpot: 3,
    twigShare: 0.42,
    leader: 0,
  },
  [PLANT_SPECIES_CODES.cherry]: {
    levels: 3,
    segs: [6, 5, 3, 2],
    tip: [0.55, 0.45, 0.35, 0.3],
    wander: [0.15, 0.3, 0.4, 0.5],
    tropism: [0, 0.08, 0.06, 0.03],
    kids: [4, 3, 2],
    kidFrom: [0, 0.3, 0.3],
    angle: [
      [0.85, 1.25],
      [0.5, 0.9],
      [0.5, 0.9],
    ],
    lenRatio: [0, 0.55, 0.55],
    flexStep: [0.25, 0.25, 0.25, 0.25],
    trunk: [0.26, 0.32],
    trunkR: 0.045,
    card: 0.19,
    cardsPerSpot: 4,
    twigShare: 0.34,
    leader: 0.2,
  },
  [PLANT_SPECIES_CODES.plum]: {
    levels: 3,
    segs: [7, 6, 4, 2],
    tip: [0.6, 0.42, 0.3, 0.25],
    wander: [0.28, 0.38, 0.42, 0.45],
    tropism: [0, 0.14, 0.12, 0.06],
    kids: [3, 2, 2],
    kidFrom: [0, 0.3, 0.4],
    angle: [
      [0.8, 1.2],
      [0.45, 0.85],
      [0.4, 0.8],
    ],
    lenRatio: [0, 0.58, 0.55],
    flexStep: [0.22, 0.26, 0.26, 0.26],
    trunk: [0.3, 0.39],
    trunkR: 0.037,
    card: 0.135,
    cardsPerSpot: 3,
    twigShare: 0.55,
    leader: 0.18,
  },
  [PLANT_SPECIES_CODES.apple]: {
    levels: 3,
    segs: [6, 5, 3, 2],
    tip: [0.6, 0.5, 0.36, 0.3],
    wander: [0.16, 0.22, 0.32, 0.4],
    tropism: [0, 0.05, 0.01, -0.06],
    kids: [4, 3, 2],
    kidFrom: [0, 0.3, 0.3],
    angle: [
      [0.7, 1.12],
      [0.55, 0.95],
      [0.5, 0.85],
    ],
    lenRatio: [0, 0.57, 0.52],
    flexStep: [0.22, 0.26, 0.26, 0.26],
    trunk: [0.3, 0.36],
    trunkR: 0.043,
    card: 0.16,
    cardsPerSpot: 4,
    twigShare: 0.42,
    leader: 0.22,
  },
};
function appendBroadleafTree(r, t, e, i, s) {
  const n = BROADLEAF_TREE_PROFILES[e.code],
    o = e.height,
    a = e.radius,
    l = [e.x, e.y, e.z, o],
    c = s(),
    h = {
      branches: [],
      spots: [],
      clumps: [],
    },
    f = new ThreeVector3(e.x, e.y, e.z),
    u = new ThreeVector3(Math.cos(e.lean), 0, Math.sin(e.lean)).multiplyScalar(
      0.06,
    ),
    d = vegetationUpAxis.clone().add(u).normalize(),
    p = o * lerp(n.trunk[0], n.trunk[1], s()),
    v = o * n.trunkR * lerp(0.85, 1.15, s());
  if (e.code === PLANT_SPECIES_CODES.birch) {
    const g = n.segs[0],
      x = [f.clone()],
      m = [v * 1.25],
      w = d.clone(),
      y = f.clone();
    for (let b = 1; b <= g; b++)
      ((w.x += (s() - 0.5) * 0.08),
        (w.z += (s() - 0.5) * 0.08),
        w.normalize(),
        y.addScaledVector(w, (o * 0.97) / g),
        x.push(y.clone()),
        m.push(v * lerp(1, 0.12, b / g)));
    h.branches.push({
      pts: x,
      radii: m,
      level: 0,
      flex0: 0,
      flex1: 0.4,
    });
    const _ = n.kids[0] + Math.floor(s() * 4),
      M = new ThreeVector3();
    let A = s() * Math.PI * 2;
    for (let b = 0; b < _; b++) {
      const S = lerp(0.32, 0.93, (b + s() * 0.6) / _),
        E = x[0].clone().lerp(x[g], S),
        T = vegetationUpAxis.clone();
      (M.set(Math.cos(A), 0, Math.sin(A)),
        (A += 2.39996 + (s() - 0.5) * 0.5),
        T.addScaledVector(M, lerp(0.9, 1.5, s())).normalize());
      const R = a * lerp(0.75, 1.15, s()) * (1.1 - Math.abs(S - 0.55) * 0.9);
      growBranchSkeleton(
        s,
        n,
        E,
        T,
        R,
        v * lerp(1, 0.2, S) * 0.55,
        1,
        S * 0.4,
        h,
      );
    }
  } else {
    const g = n.segs[0],
      x = [f.clone()],
      m = [v * 1.35],
      w = d.clone(),
      y = f.clone(),
      trunkWander = e.code === PLANT_SPECIES_CODES.plum ? 0.3 : 0.12;
    for (let b = 1; b <= g; b++)
      ((w.x += (s() - 0.5) * trunkWander),
        (w.z += (s() - 0.5) * trunkWander),
        w.normalize(),
        y.addScaledVector(w, p / g),
        x.push(y.clone()),
        m.push(v * lerp(1.1, 0.8, b / g)));
    h.branches.push({
      pts: x,
      radii: m,
      level: 0,
      flex0: 0,
      flex1: 0.22,
    });
    const _ = y.clone(),
      M = n.kids[0] + Math.floor(s() * 3);
    let A = s() * Math.PI * 2;
    for (let b = 0; b < M; b++) {
      const S = new ThreeVector3(Math.cos(A), 0, Math.sin(A));
      A += (Math.PI * 2) / M + (s() - 0.5) * 0.7;
      const E = lerp(n.angle[0][0], n.angle[0][1], s());
      S.multiplyScalar(Math.sin(E))
        .addScaledVector(vegetationUpAxis, Math.cos(E))
        .normalize();
      const T =
          ((a * lerp(0.85, 1.1, s())) / Math.max(0.6, Math.sin(E))) * 0.72,
        R = x[g - (s() < 0.4 ? 1 : 0)];
      growBranchSkeleton(s, n, R, S, T, v * lerp(0.55, 0.72, s()), 1, 0.22, h);
    }
    if (n.leader > 0) {
      const b = vegetationUpAxis.clone().addScaledVector(u, 2).normalize();
      growBranchSkeleton(
        s,
        n,
        _,
        b,
        (o - p) * lerp(0.6, 0.8, s()),
        v * 0.6,
        1,
        0.22,
        h,
      );
    }
  }
  for (const g of h.branches) {
    const x = [7, 5, 4, 3][g.level];
    appendBranchTube(r, g.pts, g.radii, x, l, i, g.flex0, g.flex1, c, e.code);
  }
  appendBroadleafFoliage(t, h, n, e, l, i, c, s);
  if (e.code === PLANT_SPECIES_CODES.apple) {
    // Fruit stems attach to actual outer branches, with the same bend phase and flex.
    const branches = h.branches.filter((branch) => branch.level === 2);
    const count = Math.min(14, branches.length);
    e.fruitAnchors = [];
    for (let index = 0; index < count; index++) {
      const branch = branches[Math.floor((index * branches.length) / count)];
      const fraction = 0.64 + ((index * 0.618034) % 1) * 0.25;
      const sample = fraction * (branch.pts.length - 1);
      const segment = Math.floor(sample);
      const position = branch.pts[segment]
        .clone()
        .lerp(branch.pts[segment + 1], sample - segment);
      e.fruitAnchors.push({
        position: position.toArray(),
        flex: lerp(branch.flex0, branch.flex1, fraction),
        phase: c,
      });
    }
  }
}
function appendBroadleafFoliage(r, t, e, i, s, n, o, a) {
  const l = i.height,
    c = t.spots;
  if (!c.length) return;
  const h = new ThreeVector3();
  for (const S of c) h.add(S.p);
  h.divideScalar(c.length);
  let f = 0.001,
    u = 1 / 0,
    d = -1 / 0;
  for (const S of c)
    ((f = Math.max(f, Math.hypot(S.p.x - h.x, S.p.z - h.z))),
      (u = Math.min(u, S.p.y)),
      (d = Math.max(d, S.p.y)));
  h.y = lerp(u, d, 0.45);
  const p = Math.max(0.12 * l, (d - u) * 0.6);
  f *= 0.92;
  for (const S of t.clumps) (S.c.set(0, 0, 0), (S.n = 0), (S.r = 0));
  for (const S of c) S.clump && (S.clump.c.add(S.p), S.clump.n++);
  for (const S of t.clumps) S.n && S.c.divideScalar(S.n);
  for (const S of c)
    S.clump && (S.clump.r = Math.max(S.clump.r, S.p.distanceTo(S.clump.c)));
  const v = l * e.card,
    g = new ThreeVector3(),
    x = new ThreeVector3(),
    m = new ThreeVector3(),
    w = new ThreeVector3(),
    y = new ThreeVector3(),
    _ = new ThreeVector3(),
    M = new ThreeVector3(),
    A = new ThreeVector3(),
    b = i.code === PLANT_SPECIES_CODES.birch;
  for (const S of c) {
    const E = e.cardsPerSpot - (a() < 0.25 ? 1 : 0),
      T = S.clump;
    for (let R = 0; R < E; R++) {
      const z = v * lerp(0.78, 1.2, a()) * (S.level < e.levels ? 1.08 : 1);
      (M.copy(S.p),
        (M.x += (a() - 0.5) * z * 0.5),
        (M.y += (a() - 0.5) * z * 0.4),
        (M.z += (a() - 0.5) * z * 0.5),
        A.subVectors(M, h),
        w.set(A.x / (f * f), A.y / (p * p), A.z / (f * f)).normalize(),
        T && T.n > 1
          ? y
              .subVectors(M, T.c)
              .addScaledVector(w, T.r * 0.6 + 0.001)
              .normalize()
          : y.copy(w),
        x
          .copy(S.d)
          .multiplyScalar(0.4)
          .addScaledVector(y, 0.55)
          .addScaledVector(w, 0.35),
        (x.x += (a() - 0.5) * 1),
        (x.y += (a() - 0.5) * 0.7 + 0.12),
        (x.z += (a() - 0.5) * 1),
        b && (x.y -= 0.55),
        x.normalize(),
        randomPerpendicularVector(x, a, g),
        M.addScaledVector(x, -z * 0.22),
        _.crossVectors(g, x).normalize(),
        _.dot(y) < 0 && _.negate(),
        m
          .copy(w)
          .multiplyScalar(0.5)
          .addScaledVector(y, 0.38)
          .addScaledVector(_, 0.12)
          .normalize(),
        A.subVectors(M, h));
      const L = Math.sqrt(
          (A.x * A.x + A.z * A.z) / (f * f) + (A.y * A.y) / (p * p),
        ),
        k =
          T && T.r > 0.001
            ? clamp(M.distanceTo(T.c) / (T.r + z * 0.3), 0, 1)
            : 1,
        U = clamp((M.y - (h.y - p)) / (2 * p), 0, 1),
        F =
          lerp(0.22, 1, Math.pow(clamp(L, 0, 1), 1.6)) *
          lerp(0.62, 1, k) *
          lerp(0.6, 1, Math.sqrt(U)),
        G = a() < e.twigShare ? 1 : 0;
      appendFoliageCard(
        r,
        M,
        x,
        g,
        z,
        FOLIAGE_ATLAS_ASPECTS[0],
        m,
        s,
        [n, lerp(0.75, 1, S.flex), o, i.code],
        [G, a(), 0, 0],
        null,
        F * 0.72,
        F,
      );
    }
  }
}
function appendPineTree(r, t, e, i, s) {
  const n = e.height,
    o = e.radius,
    a = [e.x, e.y, e.z, n],
    l = s(),
    c = PLANT_SPECIES_CODES.pine,
    h = new ThreeVector3(e.x, e.y, e.z),
    f = s() < 0.55,
    u = 6,
    d = n * 0.03 * lerp(0.85, 1.15, s()),
    p = new ThreeVector3(Math.cos(e.lean), 0, Math.sin(e.lean)).multiplyScalar(
      0.03,
    ),
    v = [],
    g = [];
  for (let z = 0; z <= u; z++) {
    const L = z / u;
    (v.push(
      h
        .clone()
        .addScaledVector(vegetationUpAxis, n * 1 * L)
        .addScaledVector(p, L * L * n),
    ),
      g.push(d * lerp(1.3, 0.12, Math.pow(L, 0.8))));
  }
  appendBranchTube(r, v, g, 6, a, i, 0, 0.35, l, c);
  const x = (z) => {
      const L = clamp((z - e.y) / n, 0, 1);
      return h
        .clone()
        .addScaledVector(vegetationUpAxis, n * L)
        .addScaledVector(p, L * L * n);
    },
    m = Math.round(f ? lerp(12, 16, s()) : lerp(9, 12, s())),
    w = n * (f ? lerp(0.06, 0.12, s()) : lerp(0.12, 0.2, s()));
  let y = s() * Math.PI * 2;
  const _ = new ThreeVector3(),
    M = new ThreeVector3(),
    A = new ThreeVector3(),
    b = new ThreeVector3(),
    S = new ThreeVector3(),
    E = new ThreeVector3(),
    T = (z, L, k, U, F, G, B, q, X, vt) => {
      (S.set(Math.cos(L), 0, Math.sin(L)),
        M.copy(S)
          .multiplyScalar(Math.cos(U))
          .addScaledVector(vegetationUpAxis, -Math.sin(U)),
        A.copy(S)
          .multiplyScalar(Math.cos(F))
          .addScaledVector(vegetationUpAxis, -Math.sin(F)),
        _.crossVectors(vegetationUpAxis, S).normalize(),
        _.applyAxisAngle(S, (s() - 0.5) * 0.6),
        E.copy(z)
          .addScaledVector(vegetationUpAxis, G)
          .addScaledVector(S, k * 0.04),
        b.crossVectors(_, M).normalize(),
        b.y < 0 && b.negate(),
        b
          .multiplyScalar(0.45)
          .addScaledVector(S, 0.55)
          .addScaledVector(vegetationUpAxis, 0.35 - vt * 0.1)
          .normalize(),
        appendFoliageCard(
          t,
          E,
          M,
          _,
          k,
          FOLIAGE_ATLAS_ASPECTS[3],
          b,
          a,
          [i, B, l, c],
          [0, s(), 0, 3],
          A,
          q,
          X,
        ));
    };
  for (let z = 0; z < m; z++) {
    const L = z / (m - 1),
      k = e.y + lerp(w, n * 0.9, Math.pow(L, 0.92)) + (s() - 0.5) * n * 0.012,
      U = f
        ? Math.pow(1 - L * 0.96, 1.05)
        : Math.pow(1 - L * 0.95, 0.9) * (1 - 0.12 * L),
      F = Math.max(n * 0.045, o * U * lerp(0.84, 1.1, s())),
      G = x(k),
      B = lerp(0.35, 0.85, L),
      q = lerp(0.42, 1, Math.pow(L, 0.8)),
      X = 10,
      vt = t.count,
      gt = F * 0.08,
      Qt = F * 0.62,
      te = F * 0.3,
      Zt = -F * 0.3;
    for (let mt = 0; mt <= X; mt++) {
      const Y = y + (mt / X) * Math.PI * 2,
        xt = Math.cos(Y),
        yt = Math.sin(Y),
        fe = mt === X ? 1 : lerp(0.75, 1.05, s());
      for (let et = 0; et < 2; et++) {
        const ut = et ? Qt * fe : gt,
          dt = et ? Zt * lerp(0.8, 1.25, s()) : te;
        (E.set(G.x + xt * ut, G.y + dt, G.z + yt * ut),
          b.set(xt * (te - Zt), Qt - gt, yt * (te - Zt)).normalize(),
          (b.y += 0.25),
          b.normalize(),
          fv.set(0, 0, 0),
          (t.curAO = q * (et ? 0.45 : 0.25)),
          t.vert(
            E,
            b,
            mt / X,
            et,
            a,
            [i, B * (et ? 1 : 0.6), l, c],
            [0, s(), et * 0.3, -1],
            fv,
          ));
      }
    }
    for (let mt = 0; mt < X; mt++) {
      const Y = vt + mt * 2;
      t.idx.push(Y, Y + 1, Y + 2, Y + 1, Y + 3, Y + 2);
    }
    const J = Math.round(clamp(6 + (F / n) * 30, 6, 14)),
      nt = f ? 0.18 : 0;
    for (let mt = 0; mt < J; mt++) {
      const Y = y + (mt / J) * Math.PI * 2 + (s() - 0.5) * 0.45,
        xt = F * lerp(0.88, 1.22, s()),
        yt = lerp(0.08, 0.32, s()) + L * 0.06 + nt * 0.5,
        fe = yt + lerp(0.3, 0.62, s()) + nt;
      T(G, Y, xt, yt, fe, F * lerp(0.1, 0.22, s()), B, q * 0.3, q, L);
    }
    if (F > n * 0.09) {
      const mt = Math.round(J * 0.6);
      for (let Y = 0; Y < mt; Y++) {
        const xt = y + ((Y + 0.5) / mt) * Math.PI * 2 + (s() - 0.5) * 0.5,
          yt = F * lerp(0.55, 0.75, s()),
          fe = lerp(0.25, 0.5, s()) + nt;
        T(
          G,
          xt,
          yt,
          fe,
          fe + lerp(0.3, 0.5, s()),
          F * lerp(0.2, 0.32, s()),
          B * 0.85,
          q * 0.22,
          q * 0.7,
          L,
        );
      }
    }
    y += 2.39996 * 0.5 + s() * 0.6;
  }
  const R = x(e.y + n * 0.86);
  for (let z = 0; z < 3; z++) {
    const L = s() * Math.PI + (z * Math.PI) / 3;
    (_.set(Math.cos(L), 0, Math.sin(L)),
      b.set(-_.z, 0.7, _.x).normalize(),
      M.copy(vegetationUpAxis),
      (M.x += (s() - 0.5) * 0.08),
      (M.z += (s() - 0.5) * 0.08),
      M.normalize(),
      appendFoliageCard(
        t,
        R,
        M,
        _,
        n * 0.17,
        0.42,
        b,
        a,
        [i, 1, l, c],
        [0, s(), 0, 3],
        null,
        0.7,
        1,
      ));
  }
}
function appendShrub(r, t, e, i, s) {
  const n = e.height,
    o = e.radius,
    a = [e.x, e.y, e.z, n],
    l = s(),
    c = e.code,
    h = c === PLANT_SPECIES_CODES.evergreen,
    f = new ThreeVector3(e.x, e.y + 0.01, e.z),
    u = {
      levels: 1,
      segs: [3, 2],
      tip: [0.4, 0.3],
      wander: [0.3, 0.5],
      tropism: [0.05, 0.03],
      kids: [2],
      kidFrom: [0.4],
      angle: [[0.5, 0.9]],
      lenRatio: [0.6],
      flexStep: [0.5, 0.5],
    },
    d = {
      branches: [],
      spots: [],
      clumps: [],
    },
    p = 3 + Math.floor(s() * 3);
  for (let M = 0; M < p; M++) {
    const A = (M / p) * Math.PI * 2 + s(),
      b = new ThreeVector3(
        Math.cos(A) * 0.55,
        1,
        Math.sin(A) * 0.55,
      ).normalize();
    growBranchSkeleton(
      s,
      u,
      f,
      b,
      n * lerp(0.55, 0.8, s()),
      n * 0.035,
      0,
      0.1,
      d,
    );
  }
  for (const M of d.branches)
    appendBranchTube(
      r,
      M.pts,
      M.radii,
      M.level ? 3 : 4,
      a,
      i,
      M.flex0,
      M.flex1,
      l,
      c,
    );
  const v = Math.round(lerp(24, 46, clamp(o / 0.3, 0, 1)) * (h ? 1.5 : 1)),
    g = new ThreeVector3(e.x, e.y + n * 0.52, e.z),
    x = new ThreeVector3(),
    m = new ThreeVector3(),
    w = new ThreeVector3(),
    y = new ThreeVector3(),
    _ = new ThreeVector3();
  for (let M = 0; M < v; M++) {
    const A = s() * 2 - 1,
      b = s() * Math.PI * 2,
      S = Math.sqrt(1 - A * A);
    x.set(
      S * Math.cos(b),
      Math.abs(A) * 0.8 + 0.2 * A,
      S * Math.sin(b),
    ).normalize();
    const E = lerp(0.35, 0.8, Math.sqrt(s()));
    (_.set(g.x + x.x * o * E, g.y + x.y * n * 0.45 * E, g.z + x.z * o * E),
      m.copy(x).addScaledVector(vegetationUpAxis, 0.35),
      (m.x += (s() - 0.5) * 0.7),
      (m.z += (s() - 0.5) * 0.7),
      m.normalize(),
      randomPerpendicularVector(m, s, w));
    const T = h && s() < 0.65 ? 3 : 0,
      R = (T === 3 ? o * 0.6 : o * 0.55) * lerp(0.8, 1.2, s());
    (_.addScaledVector(m, -R * 0.25),
      y.crossVectors(w, m).normalize(),
      y.dot(x) < 0 && y.negate(),
      y.multiplyScalar(0.3).addScaledVector(x, 0.7).normalize());
    const z = lerp(0.3, 1, E) * lerp(0.55, 1, clamp(x.y * 0.5 + 0.5, 0, 1));
    appendFoliageCard(
      t,
      _,
      m,
      w,
      R,
      FOLIAGE_ATLAS_ASPECTS[T],
      y,
      a,
      [i, lerp(0.6, 1, E), l, c],
      [h ? 0 : s() < 0.5 ? 1 : 0, s(), 0, T],
      null,
      z * 0.7,
      z,
    );
  }
}
export { appendBroadleafTree, appendPineTree, appendShrub };
