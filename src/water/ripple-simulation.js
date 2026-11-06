// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeColor,
  ThreeHalfFloatType,
  ThreeLinearFilter,
  ThreeMesh,
  ThreeOrthographicCamera,
  ThreePlaneGeometry,
  ThreeRGBAFormat,
  ThreeScene,
  ThreeShaderMaterial,
  ThreeVector2,
  ThreeVector4,
  ThreeWebGLRenderTarget,
} from "../vendor/three-runtime.js";
import { LAKE_SURFACE_BOUNDS } from "./uniforms-and-shadow-binding.js";
import { WATER_COMMON_GLSL } from "./common-shader.js";
const MAX_RIPPLE_DROPS = 24;
const RIPPLE_SIMULATION_HZ = 48;
const RIPPLE_SIMULATION_VERTEX_GLSL = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const RIPPLE_SIMULATION_FRAGMENT_GLSL = `
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform vec4 uBox;
uniform float uLevel;
uniform float uDamping;
uniform vec4 uDrops[${MAX_RIPPLE_DROPS}];
uniform int uDropCount;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(uPrev, vUv);
  float n = texture2D(uPrev, vUv + vec2(uTexel.x, 0.0)).r
          + texture2D(uPrev, vUv - vec2(uTexel.x, 0.0)).r
          + texture2D(uPrev, vUv + vec2(0.0, uTexel.y)).r
          + texture2D(uPrev, vUv - vec2(0.0, uTexel.y)).r;
  float h = (n * 0.5 - c.g) * uDamping;
  vec2 xz = uBox.xy + vUv * uBox.zw;
  float depth = uLevel - groundHeightAt(xz);
  // shallows swallow the waves; dry land and ice hold still
  float wet = smoothstep(-0.004, 0.05, depth);
  h *= mix(0.9, 1.0, smoothstep(0.02, 0.12, depth)) * wet * (1.0 - wIceMask(xz, depth));
  for (int i = 0; i < ${MAX_RIPPLE_DROPS}; i++) {
    if (i >= uDropCount) break;
    vec4 d = uDrops[i];
    vec2 r = (xz - d.xy) / d.z;
    h += d.w * exp(-dot(r, r) * 2.2) * wet;
  }
  gl_FragColor = vec4(clamp(h, -40.0, 40.0), c.r, 0.0, 1.0);
}
`;
class WaterRippleSimulation {
  constructor(t, e) {
    ((this.ctx = t), (this.wu = e));
    const i = t.quality.pick(144, 208, 256),
      s = LAKE_SURFACE_BOUNDS.maxX - LAKE_SURFACE_BOUNDS.minX,
      n = LAKE_SURFACE_BOUNDS.maxZ - LAKE_SURFACE_BOUNDS.minZ;
    ((this.w = i), (this.h = Math.round(i * (n / s))));
    const o = {
      type: ThreeHalfFloatType,
      format: ThreeRGBAFormat,
      minFilter: ThreeLinearFilter,
      magFilter: ThreeLinearFilter,
      depthBuffer: !1,
      stencilBuffer: !1,
      generateMipmaps: !1,
    };
    ((this.rtA = new ThreeWebGLRenderTarget(this.w, this.h, o)),
      (this.rtB = new ThreeWebGLRenderTarget(this.w, this.h, o)),
      (this.rtA.texture.name = this.rtB.texture.name = "waterRipples"),
      (this.drops = []));
    for (let a = 0; a < MAX_RIPPLE_DROPS; a++)
      this.drops.push(new ThreeVector4());
    ((this.queue = []),
      (this._pool = []),
      (this.material = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
          ...e,
          uPrev: {
            value: null,
          },
          uTexel: {
            value: new ThreeVector2(1 / this.w, 1 / this.h),
          },
          uBox: {
            value: new ThreeVector4(
              LAKE_SURFACE_BOUNDS.minX,
              LAKE_SURFACE_BOUNDS.minZ,
              s,
              n,
            ),
          },
          uLevel: {
            value: 0.1,
          },
          uDamping: {
            value: 0.988,
          },
          uDrops: {
            value: this.drops,
          },
          uDropCount: {
            value: 0,
          },
        },
        vertexShader: RIPPLE_SIMULATION_VERTEX_GLSL,
        fragmentShader:
          t.GLSL_COMMON + WATER_COMMON_GLSL + RIPPLE_SIMULATION_FRAGMENT_GLSL,
        depthTest: !1,
        depthWrite: !1,
      })),
      (this.scene = new ThreeScene()),
      (this.quad = new ThreeMesh(new ThreePlaneGeometry(2, 2), this.material)),
      (this.quad.frustumCulled = !1),
      this.scene.add(this.quad),
      (this.camera = new ThreeOrthographicCamera(-1, 1, 1, -1, 0, 1)),
      (this.acc = 0),
      (this.cleared = !1),
      (this.activity = 0),
      (e.uRippleTex.value = this.rtA.texture),
      e.uRippleTexel.value.set(1 / this.w, 1 / this.h));
  }
  add(t, e, i, s) {
    if (
      t < LAKE_SURFACE_BOUNDS.minX ||
      t > LAKE_SURFACE_BOUNDS.maxX ||
      e < LAKE_SURFACE_BOUNDS.minZ ||
      e > LAKE_SURFACE_BOUNDS.maxZ ||
      this.queue.length > 96
    )
      return;
    const n = this._pool.pop() || {};
    ((n.x = t),
      (n.z = e),
      (n.r = i),
      (n.s = s),
      this.queue.push(n),
      (this.activity = 1));
  }
  _clear(t) {
    const e = t.getClearColor(new ThreeColor()),
      i = t.getClearAlpha(),
      s = t.getRenderTarget();
    t.setClearColor(0, 0);
    for (const n of [this.rtA, this.rtB])
      (t.setRenderTarget(n), t.clear(!0, !1, !1));
    (t.setRenderTarget(s), t.setClearColor(e, i), (this.cleared = !0));
  }
  step(t, e) {
    const i = this.ctx.renderer;
    if (
      (this.cleared || this._clear(i),
      (this.acc = Math.min(this.acc + t, 3 / RIPPLE_SIMULATION_HZ)),
      this.queue.length ||
        (this.activity = Math.max(0, this.activity - t * 0.1)),
      this.activity <= 0 && !this.queue.length)
    ) {
      ((this.acc = 0), (this.wu.uRippleAlpha.value = 1));
      return;
    }
    const s = this.material.uniforms;
    s.uLevel.value = e;
    const n = i.getRenderTarget(),
      o = i.autoClear;
    for (i.autoClear = !1; this.acc >= 1 / RIPPLE_SIMULATION_HZ;) {
      this.acc -= 1 / RIPPLE_SIMULATION_HZ;
      let a = 0;
      for (; this.queue.length && a < 24;) {
        const c = this.queue.shift();
        (this.drops[a++].set(c.x, c.z, c.r, c.s), this._pool.push(c));
      }
      ((s.uDropCount.value = a),
        (s.uPrev.value = this.rtA.texture),
        i.setRenderTarget(this.rtB),
        i.render(this.scene, this.camera));
      const l = this.rtA;
      ((this.rtA = this.rtB), (this.rtB = l));
    }
    (i.setRenderTarget(n),
      (i.autoClear = o),
      (this.wu.uRippleTex.value = this.rtA.texture),
      (this.wu.uRippleAlpha.value = Math.min(
        1,
        this.acc * RIPPLE_SIMULATION_HZ,
      )));
  }
  dispose() {
    (this.rtA.dispose(),
      this.rtB.dispose(),
      this.material.dispose(),
      this.quad.geometry.dispose());
  }
}
export { WaterRippleSimulation };
