// Cloud render order, material facing and the shared ground-shadow texture.
import {
  ThreeBackSide,
  ThreeFrontSide,
  ThreeRedFormat,
} from "../vendor/three-runtime.js";
import { FIELD_BOUNDS } from "../core/config.js";
import {
  createFieldTexture,
  updateFieldTexture,
} from "../render/field-texture.js";
const sortCloudsBackToFront = (r, t) => t._camD - r._camD;
function sortCloudRendering(system) {
  const t = system.ctx.camera.position,
    e = system.list;
  for (const s of e) {
    const n = s.mesh;
    s._camD = n.position.distanceToSquared(t);
    const a =
      t.x > s.bmin.x - 0.4 &&
      t.x < s.bmax.x + 0.4 &&
      t.y > s.bmin.y - 0.4 &&
      t.y < s.bmax.y + 0.4 &&
      t.z > s.bmin.z - 0.4 &&
      t.z < s.bmax.z + 0.4
        ? ThreeBackSide
        : ThreeFrontSide;
    s.material.side !== a &&
      ((s.material.side = a), (s.material.needsUpdate = !0));
  }
  const i = system._order || (system._order = []);
  i.length = 0;
  for (const s of e) i.push(s);
  i.sort(sortCloudsBackToFront);
  for (let s = 0; s < i.length; s++) i[s].mesh.renderOrder = 10 + s * 0.01;
}
function initializeCloudShadows(system) {
  ((system._shW = Math.round(FIELD_BOUNDS.sizeX * 10)),
    (system._shH = Math.round(FIELD_BOUNDS.sizeZ * 10)),
    (system._shData = new Float32Array(system._shW * system._shH)),
    (system._shTmp = new Float32Array(system._shW * system._shH)));
  const i = createFieldTexture(
    system._shData,
    system._shW,
    system._shH,
    ThreeRedFormat,
  );
  ((system.shadowTexture = i), (system.ctx.uniforms.uCloudShadowTex.value = i));
}
function syncCloudShadows(system) {
  if (system.list.length) system._shEmpty = !1;
  else {
    if (system._shEmpty) return;
    system._shEmpty = !0;
  }
  const t = system._shW,
    e = system._shH,
    i = system._shTmp,
    s = system._shData;
  i.fill(0);
  const n = t / FIELD_BOUNDS.sizeX,
    o = e / FIELD_BOUNDS.sizeZ;
  let a = 0,
    l = 0;
  for (const c of system.list) {
    const h = c.material.uniforms.uLook.value.x,
      f =
        Math.min(1.6, 0.55 + h * 0.6 + c.storm * 0.8) *
        c.fade *
        (c.dissolving ? c.fade : 1);
    if (f <= 0.01) continue;
    const u = c.puffs.length + c.stormPuffs.length;
    for (let d = 0; d < u; d++) {
      const p =
        d < c.puffs.length ? c.puffs[d] : c.stormPuffs[d - c.puffs.length];
      if (p.rCur < 0.03) continue;
      const v = p.rCur * 1.15,
        g = (p.pos.x - FIELD_BOUNDS.minX) * n,
        x = (p.pos.z - FIELD_BOUNDS.minZ) * o,
        m = Math.max(0, Math.floor(g - v * n)),
        w = Math.min(t - 1, Math.ceil(g + v * n)),
        y = Math.max(0, Math.floor(x - v * o)),
        _ = Math.min(e - 1, Math.ceil(x + v * o)),
        M = 1.35 * f * 2 * p.rCur;
      for (let A = y; A <= _; A++) {
        const b = (A + 0.5 - x) / (v * o);
        for (let S = m; S <= w; S++) {
          const E = (S + 0.5 - g) / (v * n),
            T = 1 - E * E - b * b;
          T > 0 && (i[A * t + S] += M * T * Math.sqrt(T));
        }
      }
      ((a += p.pos.y * p.rCur), (l += p.rCur));
    }
  }
  for (let c = 0; c < e; c++) {
    const h = c * t;
    for (let f = 0; f < t; f++)
      s[h + f] =
        (i[h + Math.max(0, f - 1)] +
          2 * i[h + f] +
          i[h + Math.min(t - 1, f + 1)]) *
        0.25;
  }
  for (let c = 0; c < e; c++) {
    const h = Math.max(0, c - 1) * t,
      f = c * t,
      u = Math.min(e - 1, c + 1) * t;
    for (let d = 0; d < t; d++)
      i[f + d] = (s[h + d] + 2 * s[f + d] + s[u + d]) * 0.25;
  }
  (s.set(i),
    updateFieldTexture(system.shadowTexture),
    l > 0 && (system.ctx.uniforms.uCloudLayerY.value = a / l));
}
export { sortCloudRendering, initializeCloudShadows, syncCloudShadows };
