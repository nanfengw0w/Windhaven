// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeACESFilmicToneMapping,
  ThreeHalfFloatType,
  ThreePCFShadowMap,
  ThreeSRGBColorSpace,
  ThreeShaderMaterial,
  ThreeUniformsUtils,
  ThreeVector2,
  ThreeWebGLRenderTarget,
  ThreeWebGLRenderer,
} from "../vendor/three-runtime.js";
import {
  CopyShader,
  EffectComposer,
  FullscreenQuad,
  OutputPass,
  PostprocessingPass,
  ShaderPass,
  UnrealBloomPass,
} from "../vendor/postprocessing.js";
import { SceneDepthPass, sceneDepthUniforms } from "./scene-depth.js";
// Keep valid HDR values untouched; reject non-finite half-float samples before
// Bloom can spread a single bad reflection pixel across its downsample chain.
const finiteSceneCopyFragment = `
  uniform sampler2D tDiffuse;
  uniform float opacity;
  varying vec2 vUv;
  float finiteChannel(float v) {
    return (v >= -65504.0 && v <= 65504.0) ? v : 0.0;
  }
  void main() {
    vec4 c = texture2D(tDiffuse, vUv);
    gl_FragColor = opacity * vec4(finiteChannel(c.r), finiteChannel(c.g),
      finiteChannel(c.b), finiteChannel(c.a));
  }
`;
class MultisampleScenePass extends PostprocessingPass {
  constructor(t, e, i) {
    (super(),
      (this.scene = t),
      (this.camera = e),
      (this.sceneDepth = new SceneDepthPass(t, e)),
      (this.needsSwap = !1),
      (this.target =
        i > 0
          ? new ThreeWebGLRenderTarget(1, 1, {
              type: ThreeHalfFloatType,
              samples: i,
            })
          : null),
      (this.copy = new FullscreenQuad(
        new ThreeShaderMaterial({
          uniforms: ThreeUniformsUtils.clone(CopyShader.uniforms),
          vertexShader: CopyShader.vertexShader,
          fragmentShader: finiteSceneCopyFragment,
          depthTest: !1,
          depthWrite: !1,
        }),
      )));
  }
  setSize(t, e) {
    this.target?.setSize(t, e);
    this.sceneDepth.setSize(t, e);
  }
  render(t, e, i) {
    const s = this.target || i;
    try {
      this.sceneDepth.render(t);
      (t.setRenderTarget(s),
        t.autoClear === !1 && t.clear(),
        t.render(this.scene, this.camera),
        this.target &&
          ((this.copy.material.uniforms.tDiffuse.value = this.target.texture),
          t.setRenderTarget(i),
          this.copy.render(t)));
    } finally {
      sceneDepthUniforms.uSceneDepthEnabled.value = 0;
    }
  }
  dispose() {
    (this.target?.dispose(), this.sceneDepth.dispose(), this.copy.dispose());
  }
}
const TiltShiftShader = {
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uDir: {
      value: new ThreeVector2(1, 0),
    },
    uResolution: {
      value: new ThreeVector2(1, 1),
    },
    uFocus: {
      value: 0.52,
    },
    uBand: {
      value: 0.2,
    },
    uAmount: {
      value: 0,
    },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uDir;
    uniform vec2 uResolution;
    uniform float uFocus;
    uniform float uBand;
    uniform float uAmount;
    varying vec2 vUv;
    void main() {
      float d = abs(vUv.y - uFocus);
      float k = smoothstep(uBand, uBand + 0.38, d);
      float r = k * uAmount * (uResolution.y / 900.0) * 3.2;
      vec4 sum = texture2D(tDiffuse, vUv) * 0.2270270270;
      if (r < 0.05) { gl_FragColor = texture2D(tDiffuse, vUv); return; }
      vec2 st = uDir / uResolution * r;
      sum += texture2D(tDiffuse, vUv + st * 1.3846153846) * 0.3162162162;
      sum += texture2D(tDiffuse, vUv - st * 1.3846153846) * 0.3162162162;
      sum += texture2D(tDiffuse, vUv + st * 3.2307692308) * 0.0702702703;
      sum += texture2D(tDiffuse, vUv - st * 3.2307692308) * 0.0702702703;
      gl_FragColor = sum;
    }
  `,
};
const FilmGradeShader = {
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uTime: {
      value: 0,
    },
    uVignette: {
      value: 0.32,
    },
    uGrain: {
      value: 0.035,
    },
    uFlash: {
      value: 0,
    },
    uResolution: {
      value: new ThreeVector2(1, 1),
    },
  },
  vertexShader: TiltShiftShader.vertexShader,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uFlash;
    uniform vec2 uResolution;
    varying vec2 vUv;
    float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 q = vUv - 0.5;
      q.x *= uResolution.x / uResolution.y;
      float v = smoothstep(1.05, 0.25, length(q));
      c.rgb *= mix(1.0 - uVignette, 1.0, v);
      // gentle filmic lift in the shadows, warm highlights
      c.rgb = c.rgb * vec3(1.01, 1.0, 0.985) + vec3(0.008, 0.007, 0.01) * (1.0 - c.rgb);
      float g = h(vUv * uResolution + fract(uTime * 7.13) * 100.0) - 0.5;
      c.rgb += g * uGrain * (1.0 - c.rgb * 0.6);
      c.rgb += uFlash * 0.05;
      gl_FragColor = c;
    }
  `,
};
function createRenderer(r, t) {
  const e = new ThreeWebGLRenderer({
    canvas: r,
    antialias: !1,
    powerPreference: "high-performance",
    preserveDrawingBuffer: !1,
    stencil: !1,
  });
  return (
    e.setDrawingBufferSize(window.innerWidth, window.innerHeight, t.dpr),
    (e.outputColorSpace = ThreeSRGBColorSpace),
    (e.toneMapping = ThreeACESFilmicToneMapping),
    (e.toneMappingExposure = 1),
    (e.shadowMap.enabled = !0),
    (e.shadowMap.type = ThreePCFShadowMap),
    e.setClearColor(855051, 1),
    e
  );
}
class PostprocessingPipeline {
  constructor(t, e, i, s) {
    ((this.renderer = t),
      (this.scene = e),
      (this.camera = i),
      (this.quality = s));
    const n = t.getDrawingBufferSize(new ThreeVector2());
    // Size the composer in physical pixels, applying DPR exactly once.
    ((this.composer = new EffectComposer(t)),
      this.composer.setPixelRatio(1),
      (this.renderPass = new MultisampleScenePass(e, i, s.tier === 0 ? 0 : 4)),
      this.composer.addPass(this.renderPass),
      (this.bloom = new UnrealBloomPass(
        new ThreeVector2(n.x, n.y),
        0.32,
        0.55,
        0.92,
      )),
      this.composer.addPass(this.bloom),
      (this.tiltX = new ShaderPass(TiltShiftShader)),
      (this.tiltY = new ShaderPass(TiltShiftShader)),
      this.tiltY.uniforms.uDir.value.set(0, 1),
      (this.tiltX.enabled = this.tiltY.enabled = false),
      this.composer.addPass(this.tiltX),
      this.composer.addPass(this.tiltY),
      (this.output = new OutputPass()),
      this.composer.addPass(this.output),
      (this.grade = new ShaderPass(FilmGradeShader)),
      this.composer.addPass(this.grade),
      this.setSize(window.innerWidth, window.innerHeight));
  }
  setTiltShift(t, e, i) {
    for (const s of [this.tiltX, this.tiltY])
      (t !== void 0 && (s.uniforms.uFocus.value = t),
        e !== void 0 && (s.uniforms.uBand.value = e),
        i !== void 0 && (s.uniforms.uAmount.value = i));
  }
  setSize(t, e, dpr = this.quality.dpr) {
    if (![t, e, dpr].every(Number.isFinite) || dpr <= 0) return false;
    t = Math.floor(t);
    e = Math.floor(e);
    if (Math.floor(t * dpr) < 1 || Math.floor(e * dpr) < 1) return false;
    if (this.width === t && this.height === e && this.dpr === dpr) return false;
    const current = this.renderer.getSize(new ThreeVector2());
    // Writing canvas dimensions clears it, even when the values are identical.
    // Do it once, only on a real size change, immediately before a new frame.
    if (
      current.x !== t ||
      current.y !== e ||
      this.renderer.getPixelRatio() !== dpr
    )
      this.renderer.setDrawingBufferSize(t, e, dpr);
    const i = this.renderer.getDrawingBufferSize(new ThreeVector2());
    (this.composer.setSize(i.x, i.y),
      this.tiltX.uniforms.uResolution.value.copy(i),
      this.tiltY.uniforms.uResolution.value.copy(i),
      this.grade.uniforms.uResolution.value.copy(i));
    this.width = t;
    this.height = e;
    this.dpr = dpr;
    return true;
  }
  render(t, e, i) {
    ((this.grade.uniforms.uTime.value = e),
      (this.grade.uniforms.uFlash.value = i.flash),
      (this.bloom.strength =
        0.3 + i.flash * 0.9 * (1 - 0.6 * i.day) + i.night * 0.25),
      this.composer.render(t));
  }
}
export { PostprocessingPipeline, createRenderer };
