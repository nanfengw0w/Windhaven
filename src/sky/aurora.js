// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAddEquation,
  ThreeBufferGeometry,
  ThreeCustomBlending,
  ThreeDoubleSide,
  ThreeFloat32BufferAttribute,
  ThreeMesh,
  ThreeOneFactor,
  ThreeShaderMaterial,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
import { clamp, damp, smoothstep } from "../core/math.js";
const AURORA_VERTEX_GLSL = `
attribute vec3 aRib;      // s (0..1 along), v (0 hem … 1 top), ribbon index
uniform float uTime;
uniform float uLengthScale;
varying vec3 vRib;
varying vec3 vWorld;
void main() {
  float s = (aRib.x - 0.5) * uLengthScale + 0.5, v = aRib.y, id = aRib.z;
  vec3 p = position;
  float t = uTime * 0.18 + id * 2.1;
  // slow folding of the curtain
  p.z += sin(s * 7.0 + t) * 0.28 + sin(s * 17.0 - t * 1.6) * 0.07;
  p.x += sin(s * 5.0 - t * 0.7) * 0.12;
  // ragged hem that ripples
  float hem = sin(s * 23.0 + t * 2.3) * 0.08 + sin(s * 9.0 - t * 1.3) * 0.12;
  p.y += (1.0 - v) * hem;
  vRib = aRib;
  vec4 w = modelMatrix * vec4(p, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
const AURORA_FRAGMENT_GLSL = `
uniform float uTime;
uniform float uAmount;
uniform float uLengthScale;
varying vec3 vRib;
varying vec3 vWorld;
float h1(float n) { return fract(sin(n) * 43758.5453); }
float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
void main() {
  float s = (vRib.x - 0.5) * uLengthScale + 0.5, v = vRib.y, id = vRib.z;
  float t = uTime;
  // vertical rays streaming along the curtain
  float rays = n1(s * 90.0 + t * 0.9 + id * 17.0) * 0.6 + n1(s * 230.0 - t * 1.7 + id * 5.0) * 0.4;
  rays = pow(rays, 2.2) * 1.8;
  // surges travelling along the ribbon
  float surge = 0.45 + 0.55 * smoothstep(0.35, 0.9, n1(s * 3.0 - t * 0.35 + id * 4.0));
  // bright hem, soft fade upward
  float prof = smoothstep(0.0, 0.07, v) * exp(-v * 2.6);
  float ends = smoothstep(0.0, 0.12, vRib.x * uLengthScale) * smoothstep(0.0, 0.12, (1.0 - vRib.x) * uLengthScale);
  vec3 green = vec3(0.16, 1.0, 0.46);
  vec3 violet = vec3(0.55, 0.2, 0.95);
  vec3 col = mix(green, violet, smoothstep(0.25, 0.85, v));
  col += vec3(0.6, 0.1, 0.35) * smoothstep(0.75, 1.0, v) * 0.5;
  float I = prof * ends * surge * (0.35 + rays) * uAmount;
  gl_FragColor = vec4(col * I * 1.15, 0.0);
}
`;
class AuroraEffect {
  constructor(t, e) {
    this.ctx = t;
    const i = [
        {
          z: -2.6,
          amp: 0.7,
          f: 1.1,
          ph: 0.3,
          y0: 6.05,
          h: 1.1,
        },
        {
          z: -1,
          amp: 0.9,
          f: 0.8,
          ph: 2,
          y0: 6.25,
          h: 0.95,
        },
        {
          z: 0.9,
          amp: 0.6,
          f: 1.4,
          ph: 4.1,
          y0: 6.45,
          h: 0.8,
        },
      ],
      lengthScale =
        (LANDSCAPE_BOUNDS.halfW * 2 - 1) / (TERRARIUM_BOUNDS.halfW * 2 - 1),
      s = Math.ceil(t.quality.pick(60, 110, 160) * lengthScale),
      n = [],
      o = [],
      a = [];
    // Repeat the original curtain pattern in depth, leaving its heights and
    // world-space ripple wavelengths unchanged above the original land.
    const coreRibbons = [...i];
    const depthPeriod = TERRARIUM_BOUNDS.halfD * 2;
    const depthRepeats = Math.ceil(LANDSCAPE_BOUNDS.halfD / depthPeriod);
    for (let repeat = -depthRepeats; repeat <= depthRepeats; repeat++) {
      if (repeat === 0) continue;
      for (const ribbon of coreRibbons) {
        const z = ribbon.z + repeat * depthPeriod;
        if (Math.abs(z) <= LANDSCAPE_BOUNDS.halfD - 0.4) {
          i.push({ ...ribbon, z });
        }
      }
    }
    // Keep the curtains just a touch above their original height; the depth
    // repeats stay at the same band across the wider land.
    const hemLift = 0.1;
    for (const ribbon of i) ribbon.y0 += hemLift;
    let l = 0;
    i.forEach((h, f) => {
      for (let u = 0; u <= s; u++) {
        const d = u / s,
          p =
            -LANDSCAPE_BOUNDS.halfW +
            0.5 +
            d * (LANDSCAPE_BOUNDS.halfW * 2 - 1),
          coreAlong = (d - 0.5) * lengthScale + 0.5,
          v = clamp(
            h.z + Math.sin(coreAlong * Math.PI * 2 * h.f + h.ph) * h.amp,
            -LANDSCAPE_BOUNDS.halfD + 0.4,
            LANDSCAPE_BOUNDS.halfD - 0.4,
          ),
          g = Math.min(LANDSCAPE_BOUNDS.topY - 0.08, h.y0 + h.h);
        if ((n.push(p, h.y0, v, p, g, v), o.push(d, 0, f, d, 1, f), u < s)) {
          const x = l + u * 2;
          a.push(x, x + 1, x + 2, x + 1, x + 3, x + 2);
        }
      }
      l += (s + 1) * 2;
    });
    const c = new ThreeBufferGeometry();
    (c.setAttribute("position", new ThreeFloat32BufferAttribute(n, 3)),
      c.setAttribute("aRib", new ThreeFloat32BufferAttribute(o, 3)),
      c.setIndex(a),
      (this.material = new ThreeShaderMaterial({
        name: "sky-aurora",
        uniforms: {
          uTime: t.uniforms.uTime,
          uLengthScale: {
            value: lengthScale,
          },
          uAmount: {
            value: 0,
          },
        },
        vertexShader: AURORA_VERTEX_GLSL,
        fragmentShader: AURORA_FRAGMENT_GLSL,
        transparent: !0,
        depthWrite: !1,
        side: ThreeDoubleSide,
        blending: ThreeCustomBlending,
        blendEquation: ThreeAddEquation,
        blendSrc: ThreeOneFactor,
        blendDst: ThreeOneFactor,
        blendSrcAlpha: ThreeZeroFactor,
        blendDstAlpha: ThreeOneFactor,
      })),
      (this.mesh = new ThreeMesh(c, this.material)),
      (this.mesh.name = "sky-aurora"),
      (this.mesh.renderOrder = 2.3),
      (this.mesh.frustumCulled = !1),
      (this.mesh.visible = !1),
      (this.mesh.userData.noReflect = !0),
      e.add(this.mesh),
      (this.amount = 0),
      (this.forced = null));
  }
  update(t, e) {
    const { world: i } = this.ctx,
      s = i.season,
      n = smoothstep(2.35, 2.85, s) * (1 - smoothstep(3.6, 3.95, s)),
      o = smoothstep(-1, -9, i.seaLevelTemp),
      a =
        (1 - smoothstep(0.12, 0.5, i.cloudCover)) *
        (1 - i.storminess) *
        (1 - i.fogAmount);
    let l = smoothstep(0.6, 1, i.night) * Math.max(n, o) * a;
    ((l *= 0.7 + 0.3 * Math.sin(e * 0.07) * Math.sin(e * 0.031 + 1)),
      this.forced !== null && (l = this.forced),
      (this.amount = damp(this.amount, l, 0.6, t)),
      (this.material.uniforms.uAmount.value = this.amount),
      (this.mesh.visible = this.amount > 0.004));
  }
}
export { AuroraEffect };
