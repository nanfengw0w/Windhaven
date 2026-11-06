// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeVector3 } from "../vendor/three-runtime.js";
import {
  CORE_FIELD_BOUNDS,
  FIELD_BOUNDS,
  LANDSCAPE_BOUNDS,
} from "../core/config.js";
import { clamp } from "../core/math.js";
import { bakeTerrainData, terrainShape } from "./terrain-shape.js";
import { createFieldTexture } from "../render/field-texture.js";
class TerrainField {
  constructor() {
    const resX = Math.round(
      (384 * FIELD_BOUNDS.sizeX) / CORE_FIELD_BOUNDS.sizeX,
    );
    const resZ = Math.round(
      (256 * FIELD_BOUNDS.sizeZ) / CORE_FIELD_BOUNDS.sizeZ,
    );
    const t = bakeTerrainData(resX, resZ);
    ((this.baked = t),
      (this.resX = t.resX),
      (this.resZ = t.resZ),
      (this.data = t.data),
      (this.texture = createFieldTexture(this.data, this.resX, this.resZ)),
      (this.shape = terrainShape));
    const coreData = new Float32Array(384 * 256 * 4);
    const offsetX = Math.round(
      ((CORE_FIELD_BOUNDS.minX - FIELD_BOUNDS.minX) / FIELD_BOUNDS.sizeX) *
        resX,
    );
    const offsetZ = Math.round(
      ((CORE_FIELD_BOUNDS.minZ - FIELD_BOUNDS.minZ) / FIELD_BOUNDS.sizeZ) *
        resZ,
    );
    for (let z = 0; z < 256; z++) {
      const start = ((z + offsetZ) * resX + offsetX) * 4;
      coreData.set(t.data.subarray(start, start + 384 * 4), z * 384 * 4);
    }
    this.coreBaked = { data: coreData, resX: 384, resZ: 256 };
  }
  _s(t, e, i) {
    // Match fieldUV and the texture's linear ClampToEdge sampling everywhere.
    // coreBaked is a comparison snapshot, never a separate runtime domain.
    const bounds = FIELD_BOUNDS;
    const source = this.baked;
    const s = clamp(
        ((e - bounds.minX) / bounds.sizeX) * source.resX - 0.5,
        0,
        source.resX - 1,
      ),
      n = clamp(
        ((i - bounds.minZ) / bounds.sizeZ) * source.resZ - 0.5,
        0,
        source.resZ - 1,
      ),
      o = Math.floor(s),
      a = Math.floor(n),
      nextX = Math.min(o + 1, source.resX - 1),
      nextZ = Math.min(a + 1, source.resZ - 1),
      l = s - o,
      c = n - a,
      h = source.resX,
      f = source.data,
      u = f[(a * h + o) * 4 + t],
      d = f[(a * h + nextX) * 4 + t],
      p = f[(nextZ * h + o) * 4 + t],
      v = f[(nextZ * h + nextX) * 4 + t];
    return (u * (1 - l) + d * l) * (1 - c) + (p * (1 - l) + v * l) * c;
  }
  height(t, e) {
    return this._s(0, t, e);
  }
  riverMask(t, e) {
    return this._s(1, t, e);
  }
  lakeMask(t, e) {
    return this._s(2, t, e);
  }
  slope(t, e) {
    return this._s(3, t, e);
  }
  normal(t, e, i = new ThreeVector3()) {
    return i
      .set(
        this.height(t - 0.05, e) - this.height(t + 0.05, e),
        2 * 0.05,
        this.height(t, e - 0.05) - this.height(t, e + 0.05),
      )
      .normalize();
  }
  raycast(t, e = new ThreeVector3(), i = 250) {
    const s = t.origin,
      n = t.direction;
    let o = 0,
      a = i;
    const l = (u, d, p, v) => {
      if (Math.abs(d) < 1e-8) return u >= p && u <= v;
      let g = (p - u) / d,
        x = (v - u) / d;
      return (
        g > x && ([g, x] = [x, g]),
        (o = Math.max(o, g)),
        (a = Math.min(a, x)),
        o <= a
      );
    };
    if (
      !l(s.x, n.x, -LANDSCAPE_BOUNDS.halfW, LANDSCAPE_BOUNDS.halfW) ||
      !l(s.z, n.z, -LANDSCAPE_BOUNDS.halfD, LANDSCAPE_BOUNDS.halfD) ||
      !l(s.y, n.y, LANDSCAPE_BOUNDS.bottomY, LANDSCAPE_BOUNDS.topY)
    )
      return null;
    const c = 0.04;
    let h = o,
      f = !0;
    for (let u = o; u <= a; u += c) {
      const d = s.x + n.x * u,
        p = s.y + n.y * u,
        v = s.z + n.z * u,
        g = p > this.height(d, v);
      if (!g) {
        if (u === o) return (e.set(d, p, v), e);
        let x = h,
          m = u;
        for (let w = 0; w < 10; w++) {
          const y = (x + m) * 0.5,
            _ = s.x + n.x * y,
            M = s.y + n.y * y,
            A = s.z + n.z * y;
          M > this.height(_, A) ? (x = y) : (m = y);
        }
        return e.set(s.x + n.x * m, s.y + n.y * m, s.z + n.z * m);
      }
      ((h = u), (f = g));
    }
    return null;
  }
}
export { TerrainField };
