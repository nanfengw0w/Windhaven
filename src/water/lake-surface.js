// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAddEquation,
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeCustomBlending,
  ThreeFloat32BufferAttribute,
  ThreeFrontSide,
  ThreeMathUtils,
  ThreeMesh,
  ThreeOneFactor,
  ThreeShaderMaterial,
  ThreeSrcColorFactor,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
import { TERRARIUM_BOUNDS } from "../core/config.js";
import {
  lakeEllipse,
  queryRiver,
  riverHalfWidth,
  terrainHeight,
} from "../simulation/terrain-shape.js";
import {
  LAKE_FRONT_Z,
  LAKE_SURFACE_BOUNDS,
  MAX_LAKE_SURFACE_Y,
  waterShadowDefines,
} from "./uniforms-and-shadow-binding.js";
import { WATER_COMMON_GLSL } from "./common-shader.js";
import {
  LAKE_SECTION_FRAGMENT_GLSL,
  LAKE_SECTION_VERTEX_GLSL,
  LAKE_SURFACE_FRAGMENT_GLSL,
  LAKE_SURFACE_VERTEX_GLSL,
} from "./lake-shaders.js";
const WATER_ABSORPTION_BLEND = {
  blending: ThreeCustomBlending,
  blendEquation: ThreeAddEquation,
  blendSrc: ThreeZeroFactor,
  blendDst: ThreeSrcColorFactor,
  blendSrcAlpha: ThreeZeroFactor,
  blendDstAlpha: ThreeOneFactor,
};
const WATER_EMISSION_BLEND = {
  blending: ThreeCustomBlending,
  blendEquation: ThreeAddEquation,
  blendSrc: ThreeOneFactor,
  blendDst: ThreeOneFactor,
  blendSrcAlpha: ThreeZeroFactor,
  blendDstAlpha: ThreeOneFactor,
};
function createWaterAbsorptionEmissionMaterials(r, t, e, i, s, n = {}) {
  const o = {
      uniforms: {
        ...r.uniforms,
        ...t,
      },
      vertexShader: r.GLSL_COMMON + WATER_COMMON_GLSL + e,
      fragmentShader: r.GLSL_COMMON + WATER_COMMON_GLSL + i,
      transparent: !0,
      depthWrite: !1,
      depthTest: !0,
      side: ThreeFrontSide,
    },
    a = new ThreeShaderMaterial({
      ...o,
      ...WATER_ABSORPTION_BLEND,
      defines: {
        ...s,
        W_MUL: 1,
      },
    }),
    l = new ThreeShaderMaterial({
      ...o,
      ...WATER_EMISSION_BLEND,
      defines: {
        ...s,
        ...n,
      },
    });
  return {
    mul: a,
    add: l,
  };
}
class LakeSurface {
  constructor(t, e, i) {
    this.ctx = t;
    const n = {
      W_Q: t.quality.tier,
      W_STEPS: t.quality.pick(8, 11, 14),
    };
    this.surfaceGeo = this._buildSurface(t.quality.pick(0.07, 0.05, 0.04));
    const o = createWaterAbsorptionEmissionMaterials(
      t,
      e,
      LAKE_SURFACE_VERTEX_GLSL,
      LAKE_SURFACE_FRAGMENT_GLSL,
      n,
      waterShadowDefines(t),
    );
    ((this.lakeMul = new ThreeMesh(this.surfaceGeo, o.mul)),
      (this.lakeAdd = new ThreeMesh(this.surfaceGeo, o.add)),
      (this.lakeMul.renderOrder = 1.03),
      (this.lakeAdd.renderOrder = 1.031),
      (this.lakeMul.name = "water:lake-absorb"),
      (this.lakeAdd.name = "water:lake"),
      (this.frontGeo = this._buildFront()));
    const a = createWaterAbsorptionEmissionMaterials(
      t,
      e,
      LAKE_SECTION_VERTEX_GLSL,
      LAKE_SECTION_FRAGMENT_GLSL,
      n,
    );
    ((this.frontMul = new ThreeMesh(this.frontGeo, a.mul)),
      (this.frontAdd = new ThreeMesh(this.frontGeo, a.add)),
      (this.frontMul.renderOrder = 1),
      (this.frontAdd.renderOrder = 1.001),
      (this.frontMul.name = "water:section-absorb"),
      (this.frontAdd.name = "water:section"));
    for (const l of [this.lakeMul, this.lakeAdd, this.frontMul, this.frontAdd])
      ((l.frustumCulled = !1), (l.matrixAutoUpdate = !1), i.add(l));
    // The old cutaway is now inside the landscape, not an exposed edge.
    this.frontMul.visible = false;
    this.frontAdd.visible = false;
  }
  _buildSurface(t) {
    const { minX: e, maxX: i, minZ: s, maxZ: n } = LAKE_SURFACE_BOUNDS,
      o = Math.ceil((i - e) / t) + 1,
      a = Math.ceil((n - s) / t) + 1,
      l = this.ctx.terrain,
      c = new Float32Array(o * a * 3),
      h = new Float32Array(o * a * 3),
      f = new Float32Array(o * a),
      u = {};
    for (let g = 0; g < a; g++) {
      const x = Math.min(n, s + g * t);
      for (let m = 0; m < o; m++) {
        const w = Math.min(i, e + m * t),
          y = g * o + m;
        ((c[y * 3] = w),
          (c[y * 3 + 1] = 0),
          (c[y * 3 + 2] = x),
          (f[y] = l.height(w, x)));
        let _ = -10,
          M = 0;
        if (queryRiver(w, x, u)) {
          const A = riverHalfWidth(u.t);
          ((M = 1 - ThreeMathUtils.smoothstep(u.dist, A * 1.5, A * 2.1 + 0.08)),
            M > 0 && (_ = u.y));
        }
        ((h[y * 3] = _),
          (h[y * 3 + 1] = M),
          (h[y * 3 + 2] = lakeEllipse(w, x)));
      }
    }
    const d = [],
      p = MAX_LAKE_SURFACE_Y + 0.035;
    for (let g = 0; g < a - 1; g++)
      for (let x = 0; x < o - 1; x++) {
        const m = g * o + x,
          w = m + 1,
          y = m + o,
          _ = y + 1;
        Math.min(f[m], f[w], f[y], f[_]) > p || d.push(m, y, w, w, y, _);
      }
    const v = new ThreeBufferGeometry();
    return (
      v.setAttribute("position", new ThreeBufferAttribute(c, 3)),
      v.setAttribute("aInfo", new ThreeBufferAttribute(h, 3)),
      v.setIndex(d),
      v
    );
  }
  _buildFront() {
    const e = [];
    for (
      let h = LAKE_SURFACE_BOUNDS.minX;
      h <= LAKE_SURFACE_BOUNDS.maxX + 1e-6;
      h += 0.02
    ) {
      const f = terrainHeight(h, LAKE_FRONT_Z);
      e.push({
        x: h,
        bed: f,
        wet:
          f < MAX_LAKE_SURFACE_Y + 0.02 && Math.abs(h) < TERRARIUM_BOUNDS.halfW,
      });
    }
    const i = e.map((h, f) => h.wet || e[f - 1]?.wet || e[f + 1]?.wet),
      s = [],
      n = [],
      o = [],
      a = [];
    let l = -1;
    for (let h = 0; h < e.length; h++) {
      if (!i[h]) {
        l = -1;
        continue;
      }
      const f = e[h],
        u = s.length / 3;
      (s.push(f.x, 0, LAKE_FRONT_Z, f.x, 0, LAKE_FRONT_Z),
        n.push(0, 1),
        o.push(f.bed, f.bed),
        l >= 0 && a.push(l, u, l + 1, l + 1, u, u + 1),
        (l = u));
    }
    const c = new ThreeBufferGeometry();
    return (
      c.setAttribute("position", new ThreeFloat32BufferAttribute(s, 3)),
      c.setAttribute("aTop", new ThreeFloat32BufferAttribute(n, 1)),
      c.setAttribute("aBed", new ThreeFloat32BufferAttribute(o, 1)),
      c.setIndex(a),
      c
    );
  }
  get meshes() {
    return [this.lakeMul, this.lakeAdd, this.frontMul, this.frontAdd];
  }
}
export { LakeSurface };
