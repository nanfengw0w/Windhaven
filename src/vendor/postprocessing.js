// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeACESFilmicToneMapping,
  ThreeAdditiveBlending,
  ThreeAgXToneMapping,
  ThreeBufferGeometry,
  ThreeCineonToneMapping,
  ThreeColor,
  ThreeColorManagement,
  ThreeCustomToneMapping,
  ThreeFloat32BufferAttribute,
  ThreeHalfFloatType,
  ThreeLinearToneMapping,
  ThreeMesh,
  ThreeMeshBasicMaterial,
  ThreeNeutralToneMapping,
  ThreeNoBlending,
  ThreeOrthographicCamera,
  ThreeRawShaderMaterial,
  ThreeReinhardToneMapping,
  ThreeSRGBTransfer,
  ThreeShaderMaterial,
  ThreeTimer,
  ThreeUniformsUtils,
  ThreeVector2,
  ThreeVector3,
  ThreeWebGLRenderTarget,
} from "./three-runtime.js";
const CopyShader = {
  name: "CopyShader",
  uniforms: {
    tDiffuse: {
      value: null,
    },
    opacity: {
      value: 1,
    },
  },
  vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
  fragmentShader: `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`,
};
class PostprocessingPass {
  constructor() {
    ((this.isPass = !0),
      (this.enabled = !0),
      (this.needsSwap = !0),
      (this.clear = !1),
      (this.renderToScreen = !1));
  }
  setSize() {}
  render() {
    console.error("THREE.Pass: .render() must be implemented in derived pass.");
  }
  dispose() {}
}
const fullscreenCamera = new ThreeOrthographicCamera(-1, 1, 1, -1, 0, 1);
class FullscreenTriangleGeometry extends ThreeBufferGeometry {
  constructor() {
    (super(),
      this.setAttribute(
        "position",
        new ThreeFloat32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3),
      ),
      this.setAttribute(
        "uv",
        new ThreeFloat32BufferAttribute([0, 2, 0, 0, 2, 0], 2),
      ));
  }
}
const fullscreenTriangleGeometry = new FullscreenTriangleGeometry();
class FullscreenQuad {
  constructor(t) {
    this._mesh = new ThreeMesh(fullscreenTriangleGeometry, t);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(t) {
    t.render(this._mesh, fullscreenCamera);
  }
  get material() {
    return this._mesh.material;
  }
  set material(t) {
    this._mesh.material = t;
  }
}
class ShaderPass extends PostprocessingPass {
  constructor(t, e = "tDiffuse") {
    (super(),
      (this.textureID = e),
      (this.uniforms = null),
      (this.material = null),
      t instanceof ThreeShaderMaterial
        ? ((this.uniforms = t.uniforms), (this.material = t))
        : t &&
          ((this.uniforms = ThreeUniformsUtils.clone(t.uniforms)),
          (this.material = new ThreeShaderMaterial({
            name: t.name !== void 0 ? t.name : "unspecified",
            defines: Object.assign({}, t.defines),
            uniforms: this.uniforms,
            vertexShader: t.vertexShader,
            fragmentShader: t.fragmentShader,
          }))),
      (this._fsQuad = new FullscreenQuad(this.material)));
  }
  render(t, e, i) {
    (this.uniforms[this.textureID] &&
      (this.uniforms[this.textureID].value = i.texture),
      (this._fsQuad.material = this.material),
      this.renderToScreen
        ? (t.setRenderTarget(null), this._fsQuad.render(t))
        : (t.setRenderTarget(e),
          this.clear &&
            t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil),
          this._fsQuad.render(t)));
  }
  dispose() {
    (this.material.dispose(), this._fsQuad.dispose());
  }
}
class MaskPass extends PostprocessingPass {
  constructor(t, e) {
    (super(),
      (this.scene = t),
      (this.camera = e),
      (this.clear = !0),
      (this.needsSwap = !1),
      (this.inverse = !1));
  }
  render(t, e, i) {
    const s = t.getContext(),
      n = t.state;
    (n.buffers.color.setMask(!1),
      n.buffers.depth.setMask(!1),
      n.buffers.color.setLocked(!0),
      n.buffers.depth.setLocked(!0));
    let o, a;
    (this.inverse ? ((o = 0), (a = 1)) : ((o = 1), (a = 0)),
      n.buffers.stencil.setTest(!0),
      n.buffers.stencil.setOp(s.REPLACE, s.REPLACE, s.REPLACE),
      n.buffers.stencil.setFunc(s.ALWAYS, o, 4294967295),
      n.buffers.stencil.setClear(a),
      n.buffers.stencil.setLocked(!0),
      t.setRenderTarget(i),
      this.clear && t.clear(),
      t.render(this.scene, this.camera),
      t.setRenderTarget(e),
      this.clear && t.clear(),
      t.render(this.scene, this.camera),
      n.buffers.color.setLocked(!1),
      n.buffers.depth.setLocked(!1),
      n.buffers.color.setMask(!0),
      n.buffers.depth.setMask(!0),
      n.buffers.stencil.setLocked(!1),
      n.buffers.stencil.setFunc(s.EQUAL, 1, 4294967295),
      n.buffers.stencil.setOp(s.KEEP, s.KEEP, s.KEEP),
      n.buffers.stencil.setLocked(!0));
  }
}
class ClearMaskPass extends PostprocessingPass {
  constructor() {
    (super(), (this.needsSwap = !1));
  }
  render(t) {
    (t.state.buffers.stencil.setLocked(!1),
      t.state.buffers.stencil.setTest(!1));
  }
}
class EffectComposer {
  constructor(t, e) {
    if (
      ((this.renderer = t),
      (this._pixelRatio = t.getPixelRatio()),
      e === void 0)
    ) {
      const i = t.getSize(new ThreeVector2());
      ((this._width = i.width),
        (this._height = i.height),
        (e = new ThreeWebGLRenderTarget(
          this._width * this._pixelRatio,
          this._height * this._pixelRatio,
          {
            type: ThreeHalfFloatType,
          },
        )),
        (e.texture.name = "EffectComposer.rt1"));
    } else ((this._width = e.width), (this._height = e.height));
    ((this.renderTarget1 = e),
      (this.renderTarget2 = e.clone()),
      (this.renderTarget2.texture.name = "EffectComposer.rt2"),
      (this.writeBuffer = this.renderTarget1),
      (this.readBuffer = this.renderTarget2),
      (this.renderToScreen = !0),
      (this.passes = []),
      (this.copyPass = new ShaderPass(CopyShader)),
      (this.copyPass.material.blending = ThreeNoBlending),
      (this.timer = new ThreeTimer()));
  }
  swapBuffers() {
    const t = this.readBuffer;
    ((this.readBuffer = this.writeBuffer), (this.writeBuffer = t));
  }
  addPass(t) {
    (this.passes.push(t),
      t.setSize(
        this._width * this._pixelRatio,
        this._height * this._pixelRatio,
      ));
  }
  insertPass(t, e) {
    (this.passes.splice(e, 0, t),
      t.setSize(
        this._width * this._pixelRatio,
        this._height * this._pixelRatio,
      ));
  }
  removePass(t) {
    const e = this.passes.indexOf(t);
    e !== -1 && this.passes.splice(e, 1);
  }
  isLastEnabledPass(t) {
    for (let e = t + 1; e < this.passes.length; e++)
      if (this.passes[e].enabled) return !1;
    return !0;
  }
  render(t) {
    (this.timer.update(), t === void 0 && (t = this.timer.getDelta()));
    const e = this.renderer.getRenderTarget();
    let i = !1;
    for (let s = 0, n = this.passes.length; s < n; s++) {
      const o = this.passes[s];
      if (o.enabled !== !1) {
        if (
          ((o.renderToScreen =
            this.renderToScreen && this.isLastEnabledPass(s)),
          o.render(this.renderer, this.writeBuffer, this.readBuffer, t, i),
          o.needsSwap)
        ) {
          if (i) {
            const a = this.renderer.getContext(),
              l = this.renderer.state.buffers.stencil;
            (l.setFunc(a.NOTEQUAL, 1, 4294967295),
              this.copyPass.render(
                this.renderer,
                this.writeBuffer,
                this.readBuffer,
                t,
              ),
              l.setFunc(a.EQUAL, 1, 4294967295));
          }
          this.swapBuffers();
        }
        MaskPass !== void 0 &&
          (o instanceof MaskPass
            ? (i = !0)
            : o instanceof ClearMaskPass && (i = !1));
      }
    }
    this.renderer.setRenderTarget(e);
  }
  reset(t) {
    if (t === void 0) {
      const e = this.renderer.getSize(new ThreeVector2());
      ((this._pixelRatio = this.renderer.getPixelRatio()),
        (this._width = e.width),
        (this._height = e.height),
        (t = this.renderTarget1.clone()),
        t.setSize(
          this._width * this._pixelRatio,
          this._height * this._pixelRatio,
        ));
    }
    (this.renderTarget1.dispose(),
      this.renderTarget2.dispose(),
      (this.renderTarget1 = t),
      (this.renderTarget2 = t.clone()),
      (this.writeBuffer = this.renderTarget1),
      (this.readBuffer = this.renderTarget2));
  }
  setSize(t, e) {
    ((this._width = t), (this._height = e));
    const i = this._width * this._pixelRatio,
      s = this._height * this._pixelRatio;
    (this.renderTarget1.setSize(i, s), this.renderTarget2.setSize(i, s));
    for (let n = 0; n < this.passes.length; n++) this.passes[n].setSize(i, s);
  }
  setPixelRatio(t) {
    ((this._pixelRatio = t), this.setSize(this._width, this._height));
  }
  dispose() {
    (this.renderTarget1.dispose(),
      this.renderTarget2.dispose(),
      this.copyPass.dispose());
  }
}
const LuminosityHighPassShader = {
  uniforms: {
    tDiffuse: {
      value: null,
    },
    luminosityThreshold: {
      value: 1,
    },
    smoothWidth: {
      value: 1,
    },
    defaultColor: {
      value: new ThreeColor(0),
    },
    defaultOpacity: {
      value: 0,
    },
  },
  vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
  fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`,
};
class UnrealBloomPass extends PostprocessingPass {
  constructor(t, e = 1, i, s) {
    (super(),
      (this.strength = e),
      (this.radius = i),
      (this.threshold = s),
      (this.resolution =
        t !== void 0 ? new ThreeVector2(t.x, t.y) : new ThreeVector2(256, 256)),
      (this.clearColor = new ThreeColor(0, 0, 0)),
      (this.needsSwap = !1),
      (this.renderTargetsHorizontal = []),
      (this.renderTargetsVertical = []),
      (this.nMips = 5));
    let n = Math.round(this.resolution.x / 2),
      o = Math.round(this.resolution.y / 2);
    ((this.renderTargetBright = new ThreeWebGLRenderTarget(n, o, {
      type: ThreeHalfFloatType,
      depthBuffer: !1,
    })),
      (this.renderTargetBright.texture.name = "UnrealBloomPass.bright"),
      (this.renderTargetBright.texture.generateMipmaps = !1));
    for (let h = 0; h < this.nMips; h++) {
      const f = new ThreeWebGLRenderTarget(n, o, {
        type: ThreeHalfFloatType,
        depthBuffer: !1,
      });
      ((f.texture.name = "UnrealBloomPass.h" + h),
        (f.texture.generateMipmaps = !1),
        this.renderTargetsHorizontal.push(f));
      const u = new ThreeWebGLRenderTarget(n, o, {
        type: ThreeHalfFloatType,
        depthBuffer: !1,
      });
      ((u.texture.name = "UnrealBloomPass.v" + h),
        (u.texture.generateMipmaps = !1),
        this.renderTargetsVertical.push(u),
        (n = Math.round(n / 2)),
        (o = Math.round(o / 2)));
    }
    const a = LuminosityHighPassShader;
    ((this.highPassUniforms = ThreeUniformsUtils.clone(a.uniforms)),
      (this.highPassUniforms.luminosityThreshold.value = s),
      (this.highPassUniforms.smoothWidth.value = 0.01),
      (this.materialHighPassFilter = new ThreeShaderMaterial({
        uniforms: this.highPassUniforms,
        vertexShader: a.vertexShader,
        fragmentShader: a.fragmentShader,
      })),
      (this.separableBlurMaterials = []));
    const l = [6, 10, 14, 18, 22];
    ((n = Math.round(this.resolution.x / 2)),
      (o = Math.round(this.resolution.y / 2)));
    for (let h = 0; h < this.nMips; h++)
      (this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),
        (this.separableBlurMaterials[h].uniforms.invSize.value =
          new ThreeVector2(1 / n, 1 / o)),
        (n = Math.round(n / 2)),
        (o = Math.round(o / 2)));
    ((this.compositeMaterial = this._getCompositeMaterial(this.nMips)),
      (this.compositeMaterial.uniforms.blurTexture1.value =
        this.renderTargetsVertical[0].texture),
      (this.compositeMaterial.uniforms.blurTexture2.value =
        this.renderTargetsVertical[1].texture),
      (this.compositeMaterial.uniforms.blurTexture3.value =
        this.renderTargetsVertical[2].texture),
      (this.compositeMaterial.uniforms.blurTexture4.value =
        this.renderTargetsVertical[3].texture),
      (this.compositeMaterial.uniforms.blurTexture5.value =
        this.renderTargetsVertical[4].texture),
      (this.compositeMaterial.uniforms.bloomStrength.value = e),
      (this.compositeMaterial.uniforms.bloomRadius.value = 0.1));
    const c = [1, 0.8, 0.6, 0.4, 0.2];
    ((this.compositeMaterial.uniforms.bloomFactors.value = c),
      (this.bloomTintColors = [
        new ThreeVector3(1, 1, 1),
        new ThreeVector3(1, 1, 1),
        new ThreeVector3(1, 1, 1),
        new ThreeVector3(1, 1, 1),
        new ThreeVector3(1, 1, 1),
      ]),
      (this.compositeMaterial.uniforms.bloomTintColors.value =
        this.bloomTintColors),
      (this.copyUniforms = ThreeUniformsUtils.clone(CopyShader.uniforms)),
      (this.blendMaterial = new ThreeShaderMaterial({
        uniforms: this.copyUniforms,
        vertexShader: CopyShader.vertexShader,
        fragmentShader: CopyShader.fragmentShader,
        premultipliedAlpha: !0,
        blending: ThreeAdditiveBlending,
        depthTest: !1,
        depthWrite: !1,
        transparent: !0,
      })),
      (this._oldClearColor = new ThreeColor()),
      (this._oldClearAlpha = 1),
      (this._basic = new ThreeMeshBasicMaterial()),
      (this._fsQuad = new FullscreenQuad(null)));
  }
  dispose() {
    for (let t = 0; t < this.renderTargetsHorizontal.length; t++)
      this.renderTargetsHorizontal[t].dispose();
    for (let t = 0; t < this.renderTargetsVertical.length; t++)
      this.renderTargetsVertical[t].dispose();
    this.renderTargetBright.dispose();
    for (let t = 0; t < this.separableBlurMaterials.length; t++)
      this.separableBlurMaterials[t].dispose();
    (this.compositeMaterial.dispose(),
      this.blendMaterial.dispose(),
      this._basic.dispose(),
      this._fsQuad.dispose());
  }
  setSize(t, e) {
    let i = Math.round(t / 2),
      s = Math.round(e / 2);
    this.renderTargetBright.setSize(i, s);
    for (let n = 0; n < this.nMips; n++)
      (this.renderTargetsHorizontal[n].setSize(i, s),
        this.renderTargetsVertical[n].setSize(i, s),
        (this.separableBlurMaterials[n].uniforms.invSize.value =
          new ThreeVector2(1 / i, 1 / s)),
        (i = Math.round(i / 2)),
        (s = Math.round(s / 2)));
  }
  render(t, e, i, s, n) {
    (t.getClearColor(this._oldClearColor),
      (this._oldClearAlpha = t.getClearAlpha()));
    const o = t.autoClear;
    ((t.autoClear = !1),
      t.setClearColor(this.clearColor, 0),
      n && t.state.buffers.stencil.setTest(!1),
      this.renderToScreen &&
        ((this._fsQuad.material = this._basic),
        (this._basic.map = i.texture),
        t.setRenderTarget(null),
        t.clear(),
        this._fsQuad.render(t)),
      (this.highPassUniforms.tDiffuse.value = i.texture),
      (this.highPassUniforms.luminosityThreshold.value = this.threshold),
      (this._fsQuad.material = this.materialHighPassFilter),
      t.setRenderTarget(this.renderTargetBright),
      t.clear(),
      this._fsQuad.render(t));
    let a = this.renderTargetBright;
    for (let l = 0; l < this.nMips; l++)
      ((this._fsQuad.material = this.separableBlurMaterials[l]),
        (this.separableBlurMaterials[l].uniforms.colorTexture.value =
          a.texture),
        (this.separableBlurMaterials[l].uniforms.direction.value =
          UnrealBloomPass.BlurDirectionX),
        t.setRenderTarget(this.renderTargetsHorizontal[l]),
        t.clear(),
        this._fsQuad.render(t),
        (this.separableBlurMaterials[l].uniforms.colorTexture.value =
          this.renderTargetsHorizontal[l].texture),
        (this.separableBlurMaterials[l].uniforms.direction.value =
          UnrealBloomPass.BlurDirectionY),
        t.setRenderTarget(this.renderTargetsVertical[l]),
        t.clear(),
        this._fsQuad.render(t),
        (a = this.renderTargetsVertical[l]));
    ((this._fsQuad.material = this.compositeMaterial),
      (this.compositeMaterial.uniforms.bloomStrength.value = this.strength),
      (this.compositeMaterial.uniforms.bloomRadius.value = this.radius),
      (this.compositeMaterial.uniforms.bloomTintColors.value =
        this.bloomTintColors),
      t.setRenderTarget(this.renderTargetsHorizontal[0]),
      t.clear(),
      this._fsQuad.render(t),
      (this._fsQuad.material = this.blendMaterial),
      (this.copyUniforms.tDiffuse.value =
        this.renderTargetsHorizontal[0].texture),
      n && t.state.buffers.stencil.setTest(!0),
      this.renderToScreen
        ? (t.setRenderTarget(null), this._fsQuad.render(t))
        : (t.setRenderTarget(i), this._fsQuad.render(t)),
      t.setClearColor(this._oldClearColor, this._oldClearAlpha),
      (t.autoClear = o));
  }
  _getSeparableBlurMaterial(t) {
    const e = [],
      i = t / 3;
    for (let o = 0; o < t; o++)
      e.push((0.39894 * Math.exp((-0.5 * o * o) / (i * i))) / i);
    const s = [],
      n = [];
    for (let o = 1; o < t; o += 2) {
      const a = e[o],
        l = o + 1 < t ? e[o + 1] : 0,
        c = a + l;
      (s.push((o * a + (o + 1) * l) / c), n.push(c));
    }
    return new ThreeShaderMaterial({
      defines: {
        KERNEL_PAIRS: s.length,
      },
      uniforms: {
        colorTexture: {
          value: null,
        },
        invSize: {
          value: new ThreeVector2(0.5, 0.5),
        },
        direction: {
          value: new ThreeVector2(0.5, 0.5),
        },
        centerWeight: {
          value: e[0],
        },
        gaussianOffsets: {
          value: s,
        },
        gaussianWeights: {
          value: n,
        },
      },
      vertexShader: `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,
      fragmentShader: `

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`,
    });
  }
  _getCompositeMaterial(t) {
    return new ThreeShaderMaterial({
      defines: {
        NUM_MIPS: t,
      },
      uniforms: {
        blurTexture1: {
          value: null,
        },
        blurTexture2: {
          value: null,
        },
        blurTexture3: {
          value: null,
        },
        blurTexture4: {
          value: null,
        },
        blurTexture5: {
          value: null,
        },
        bloomStrength: {
          value: 1,
        },
        bloomFactors: {
          value: null,
        },
        bloomTintColors: {
          value: null,
        },
        bloomRadius: {
          value: 0,
        },
      },
      vertexShader: `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,
      fragmentShader: `

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`,
    });
  }
}
UnrealBloomPass.BlurDirectionX = new ThreeVector2(1, 0);
UnrealBloomPass.BlurDirectionY = new ThreeVector2(0, 1);
const OutputShader = {
  name: "OutputShader",
  uniforms: {
    tDiffuse: {
      value: null,
    },
    toneMappingExposure: {
      value: 1,
    },
  },
  vertexShader: `
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
  fragmentShader: `

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`,
};
class OutputPass extends PostprocessingPass {
  constructor() {
    (super(),
      (this.isOutputPass = !0),
      (this.uniforms = ThreeUniformsUtils.clone(OutputShader.uniforms)),
      (this.material = new ThreeRawShaderMaterial({
        name: OutputShader.name,
        uniforms: this.uniforms,
        vertexShader: OutputShader.vertexShader,
        fragmentShader: OutputShader.fragmentShader,
      })),
      (this._fsQuad = new FullscreenQuad(this.material)),
      (this._outputColorSpace = null),
      (this._toneMapping = null));
  }
  render(t, e, i) {
    ((this.uniforms.tDiffuse.value = i.texture),
      (this.uniforms.toneMappingExposure.value = t.toneMappingExposure),
      (this._outputColorSpace !== t.outputColorSpace ||
        this._toneMapping !== t.toneMapping) &&
        ((this._outputColorSpace = t.outputColorSpace),
        (this._toneMapping = t.toneMapping),
        (this.material.defines = {}),
        ThreeColorManagement.getTransfer(this._outputColorSpace) ===
          ThreeSRGBTransfer && (this.material.defines.SRGB_TRANSFER = ""),
        this._toneMapping === ThreeLinearToneMapping
          ? (this.material.defines.LINEAR_TONE_MAPPING = "")
          : this._toneMapping === ThreeReinhardToneMapping
            ? (this.material.defines.REINHARD_TONE_MAPPING = "")
            : this._toneMapping === ThreeCineonToneMapping
              ? (this.material.defines.CINEON_TONE_MAPPING = "")
              : this._toneMapping === ThreeACESFilmicToneMapping
                ? (this.material.defines.ACES_FILMIC_TONE_MAPPING = "")
                : this._toneMapping === ThreeAgXToneMapping
                  ? (this.material.defines.AGX_TONE_MAPPING = "")
                  : this._toneMapping === ThreeNeutralToneMapping
                    ? (this.material.defines.NEUTRAL_TONE_MAPPING = "")
                    : this._toneMapping === ThreeCustomToneMapping &&
                      (this.material.defines.CUSTOM_TONE_MAPPING = ""),
        (this.material.needsUpdate = !0)),
      this.renderToScreen === !0
        ? (t.setRenderTarget(null), this._fsQuad.render(t))
        : (t.setRenderTarget(e),
          this.clear &&
            t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil),
          this._fsQuad.render(t)));
  }
  dispose() {
    (this.material.dispose(), this._fsQuad.dispose());
  }
}
export {
  CopyShader,
  EffectComposer,
  FullscreenQuad,
  OutputPass,
  PostprocessingPass,
  ShaderPass,
  UnrealBloomPass,
};
