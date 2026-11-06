// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAddEquation,
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeCustomBlending,
  ThreeDynamicDrawUsage,
  ThreeMathUtils,
  ThreeOneFactor,
  ThreeOneMinusSrcAlphaFactor,
  ThreePoints,
  ThreeShaderMaterial,
  ThreeVector2,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
import { createWaterRandom } from "./uniforms-and-shadow-binding.js";
import { WATER_COMMON_GLSL } from "./common-shader.js";
const WATER_DROPLET_KIND = 0;
const WATER_MIST_KIND = 1;
const WATER_DROPLET_GRAVITY = 4.2;
const WATER_PARTICLE_VERTEX_GLSL = `
attribute vec4 aData;   // size (world), alpha, kind, seed
uniform float uScale;
varying vec4 vData;
void main() {
  vec4 mv = viewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.5, aData.x * uScale / -mv.z);
  vData = aData;
}
`;
const WATER_PARTICLE_FRAGMENT_GLSL = `
varying vec4 vData;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float sunUp = max(uLightDir.y, 0.0);
  vec3 light = uSkyColor * 0.5 * wAmbI() + uLightColor * sunUp * 0.35;
  if (vData.z < 0.5) {
    // droplet: a clear bead with a bright sun highlight
    float body = smoothstep(1.0, 0.55, r);
    float hi = smoothstep(0.45, 0.0, length(d - vec2(-0.12, 0.14)) * 2.0);
    float a = (body * 0.55 + hi * 0.45) * vData.y;
    vec3 c = vec3(0.78, 0.9, 1.0) * light * 0.75 * body + uLightColor * (0.35 + sunUp) * hi * 0.9;
    gl_FragColor = vec4(c * vData.y, a);
  } else {
    // mist puff: soft, lit, a little blue in shadow
    float a = (1.0 - r * r) * (1.0 - r * r) * vData.y * (0.5 + 0.5 * wgHash(vec2(vData.w, 1.7)));
    vec3 c = vec3(0.88, 0.93, 1.0) * light * 0.95;
    gl_FragColor = vec4(c * a, a);
  }
}
`;
class WaterParticles {
  constructor(t, e, i, s) {
    ((this.ctx = t), (this.water = s));
    const n = (this.max = t.quality.pick(260, 520, 820));
    ((this.pos = new Float32Array(n * 3)),
      (this.vel = new Float32Array(n * 3)),
      (this.life = new Float32Array(n)),
      (this.span = new Float32Array(n)),
      (this.size = new Float32Array(n)),
      (this.kind = new Uint8Array(n)),
      (this.seed = new Float32Array(n)),
      (this.count = 0),
      (this.gPos = new Float32Array(n * 3)),
      (this.gData = new Float32Array(n * 4)));
    const o = new ThreeBufferGeometry();
    ((this.posAttr = new ThreeBufferAttribute(this.gPos, 3).setUsage(
      ThreeDynamicDrawUsage,
    )),
      (this.dataAttr = new ThreeBufferAttribute(this.gData, 4).setUsage(
        ThreeDynamicDrawUsage,
      )),
      o.setAttribute("position", this.posAttr),
      o.setAttribute("aData", this.dataAttr),
      o.setDrawRange(0, 0),
      (this.material = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
          ...e,
          uScale: {
            value: 600,
          },
        },
        vertexShader:
          t.GLSL_COMMON + WATER_COMMON_GLSL + WATER_PARTICLE_VERTEX_GLSL,
        fragmentShader:
          t.GLSL_COMMON + WATER_COMMON_GLSL + WATER_PARTICLE_FRAGMENT_GLSL,
        transparent: !0,
        depthWrite: !1,
        blending: ThreeCustomBlending,
        blendEquation: ThreeAddEquation,
        blendSrc: ThreeOneFactor,
        blendDst: ThreeOneMinusSrcAlphaFactor,
        blendSrcAlpha: ThreeZeroFactor,
        blendDstAlpha: ThreeOneFactor,
      })),
      (this.points = new ThreePoints(o, this.material)),
      (this.points.frustumCulled = !1),
      (this.points.matrixAutoUpdate = !1),
      (this.points.renderOrder = 1.07),
      (this.points.name = "water:particles"),
      i.add(this.points),
      (this._rand = createWaterRandom(4242)),
      (this._spray = 0),
      (this._mist = 0),
      (this._wind = {
        x: 0,
        z: 0,
      }),
      (this._size = new ThreeVector2()));
  }
  spawn(t, e, i, s, n, o, a, l, c, h = 0) {
    if (this.count >= this.max) return !1;
    const f = this.count++,
      u = f * 3;
    return (
      (this.pos[u] = e),
      (this.pos[u + 1] = i),
      (this.pos[u + 2] = s),
      (this.vel[u] = n),
      (this.vel[u + 1] = o),
      (this.vel[u + 2] = a),
      (this.life[f] = -h),
      (this.span[f] = l),
      (this.size[f] = c),
      (this.kind[f] = t),
      (this.seed[f] = this._rand() * 100),
      !0
    );
  }
  burst(t, e, i, s = 1) {
    const n = this._rand,
      o = Math.min(2.5, s),
      a = Math.round(12 + 16 * o);
    for (let l = 0; l < a; l++) {
      const c = n() * Math.PI * 2,
        h = (0.2 + 0.45 * n()) * (0.6 + 0.4 * o),
        f = (0.55 + 0.75 * n()) * Math.sqrt(o);
      this.spawn(
        WATER_DROPLET_KIND,
        t + Math.cos(c) * 0.04,
        e + 0.01,
        i + Math.sin(c) * 0.04,
        Math.cos(c) * h,
        f,
        Math.sin(c) * h,
        1.2,
        0.012 + 0.014 * n(),
      );
    }
    for (let l = 0; l < 2 + Math.round(o * 1.5); l++)
      this.spawn(
        WATER_DROPLET_KIND,
        t,
        e + 0.02,
        i,
        (n() - 0.5) * 0.08,
        (1.05 + 0.35 * n()) * Math.sqrt(o),
        (n() - 0.5) * 0.08,
        1.2,
        0.02 + 0.01 * n(),
        0.08 + l * 0.05,
      );
    for (let l = 0; l < 2 + Math.round(o); l++) {
      const c = n() * Math.PI * 2;
      this.spawn(
        WATER_MIST_KIND,
        t + Math.cos(c) * 0.05,
        e + 0.03,
        i + Math.sin(c) * 0.05,
        Math.cos(c) * 0.08,
        0.06 + n() * 0.05,
        Math.sin(c) * 0.08,
        1.2 + n() * 0.6,
        0.12 + 0.08 * o,
      );
    }
  }
  puff(t, e, i, s = 1) {
    const n = this._rand;
    for (let o = 0; o < 3 + Math.round(s * 2); o++) {
      const a = n() * Math.PI * 2;
      this.spawn(
        WATER_MIST_KIND,
        t + Math.cos(a) * 0.03,
        e + 0.02,
        i + Math.sin(a) * 0.03,
        Math.cos(a) * 0.12,
        0.08 + n() * 0.06,
        Math.sin(a) * 0.12,
        0.9 + n() * 0.5,
        0.07 + 0.05 * s,
      );
    }
  }
  wake(t, e, i, s, n, o) {
    const a = this._rand,
      l = Math.hypot(s, n) || 1,
      c = Math.round(o * 4 * a() + (o > 0.5 ? 1 : 0));
    for (let h = 0; h < c; h++) {
      const f = a() < 0.5 ? -1 : 1,
        u = (-n / l) * f,
        d = (s / l) * f,
        p = 0.15 + 0.3 * a();
      this.spawn(
        WATER_DROPLET_KIND,
        t,
        e + 0.01,
        i,
        (s / l) * 0.35 * o + u * p,
        0.35 + 0.5 * a() * o,
        (n / l) * 0.35 * o + d * p,
        1,
        0.01 + 0.01 * a(),
      );
    }
  }
  drips(t, e, i) {
    const s = this._rand,
      n = 2 + Math.floor(s() * 3);
    for (let o = 0; o < n; o++)
      this.spawn(
        WATER_DROPLET_KIND,
        t + (s() - 0.5) * 0.03,
        e + 0.22 + s() * 0.05,
        i + (s() - 0.5) * 0.03,
        0,
        -0.05,
        0,
        1.5,
        0.016 + 0.006 * s(),
        0.08 + o * (0.18 + s() * 0.15),
      );
  }
  _kill(t) {
    const e = --this.count;
    if (t === e) return;
    const i = t * 3,
      s = e * 3;
    ((this.pos[i] = this.pos[s]),
      (this.pos[i + 1] = this.pos[s + 1]),
      (this.pos[i + 2] = this.pos[s + 2]),
      (this.vel[i] = this.vel[s]),
      (this.vel[i + 1] = this.vel[s + 1]),
      (this.vel[i + 2] = this.vel[s + 2]),
      (this.life[t] = this.life[e]),
      (this.span[t] = this.span[e]),
      (this.size[t] = this.size[e]),
      (this.kind[t] = this.kind[e]),
      (this.seed[t] = this.seed[e]));
  }
  _emitFalls(t) {
    const e = this.water.river;
    if (!e) return;
    const i = this.water.flow * (1 - this.water.fallFrozen);
    if (i < 0.05) return;
    const s = this._rand,
      n = e.pool,
      o = e.lip,
      a = this.ctx.quality.pick(0.5, 1, 1.4);
    for (
      this._spray += t * 26 * i * a, this._mist += t * 7 * i * a;
      this._spray >= 1;
    ) {
      this._spray -= 1;
      const l = s() * Math.PI * 2,
        c = 0.15 + 0.4 * s();
      this.spawn(
        WATER_DROPLET_KIND,
        n.x + Math.cos(l) * 0.05,
        n.y + 0.02,
        n.z + Math.sin(l) * 0.05,
        Math.cos(l) * c,
        0.4 + 0.6 * s(),
        Math.sin(l) * c,
        0.9,
        0.008 + 0.01 * s(),
      );
    }
    for (; this._mist >= 1;) {
      this._mist -= 1;
      const l = s() * Math.PI * 2,
        c = s() * 0.18,
        h = s() < 0.75 ? 1 : 0.55 + s() * 0.4,
        f = o.x + (n.x - o.x) * h + Math.cos(l) * c,
        u = o.z + (n.z - o.z) * h + Math.sin(l) * c,
        d = o.y - (o.y - n.y) * h * h + 0.03;
      this.spawn(
        WATER_MIST_KIND,
        f,
        d,
        u,
        Math.cos(l) * 0.1,
        0.06 + 0.1 * s(),
        Math.sin(l) * 0.1,
        1.8 + 1.4 * s(),
        0.14 + 0.14 * s(),
      );
    }
  }
  update(t) {
    if (t <= 0) return;
    this._emitFalls(t);
    const { wind: e } = this.ctx,
      i = this.water,
      s = this.pos,
      n = this.vel;
    for (let o = 0; o < this.count; o++) {
      const a = o * 3;
      if (((this.life[o] += t), this.life[o] < 0)) continue;
      if (this.life[o] > this.span[o]) {
        (this._kill(o), o--);
        continue;
      }
      if (this.kind[o] === WATER_DROPLET_KIND) {
        n[a + 1] -= WATER_DROPLET_GRAVITY * t;
        const f = Math.exp(-t * 0.6);
        ((n[a] *= f), (n[a + 2] *= f));
      } else {
        e.sample(s[a], s[a + 2], this._wind);
        const f = 1 - Math.exp(-t * 1.2);
        ((n[a] += (this._wind.x * 0.5 - n[a]) * f),
          (n[a + 2] += (this._wind.z * 0.5 - n[a + 2]) * f),
          (n[a + 1] += (0.05 - n[a + 1]) * f));
      }
      const l = s[a] + n[a] * t,
        c = s[a + 1] + n[a + 1] * t,
        h = s[a + 2] + n[a + 2] * t;
      if (
        ((s[a] = l),
        (s[a + 1] = c),
        (s[a + 2] = h),
        this.kind[o] === WATER_DROPLET_KIND && n[a + 1] < 0)
      ) {
        if (c < i.level && i.isLakeWater(l, h, 0.01)) {
          (i.iceAt(l, h) < 0.5 &&
            i.ripples.add(l, h, 0.02 + this.size[o], -0.25 - this.size[o] * 30),
            this._kill(o),
            o--);
          continue;
        }
        if (c < this.ctx.terrain.height(l, h)) {
          (this._kill(o), o--);
          continue;
        }
      }
    }
    this._upload();
  }
  _upload() {
    const t = this.count,
      e = this.gPos,
      i = this.gData;
    let s = 0;
    for (let o = 0; o < t; o++) {
      const a = this.life[o];
      if (a < 0) continue;
      const l = o * 3,
        c = a / this.span[o];
      ((e[s * 3] = this.pos[l]),
        (e[s * 3 + 1] = this.pos[l + 1]),
        (e[s * 3 + 2] = this.pos[l + 2]));
      let h = this.size[o],
        f;
      (this.kind[o] === WATER_MIST_KIND
        ? ((h *= 0.6 + 0.9 * c), (f = Math.min(1, a * 3) * (1 - c) * 0.5))
        : (f = 1 - Math.max(0, c - 0.7) / 0.3),
        (i[s * 4] = h),
        (i[s * 4 + 1] = f),
        (i[s * 4 + 2] = this.kind[o]),
        (i[s * 4 + 3] = this.seed[o]),
        s++);
    }
    (this.points.geometry.setDrawRange(0, s),
      s > 0 &&
        (this.posAttr.clearUpdateRanges(),
        this.posAttr.addUpdateRange(0, s * 3),
        (this.posAttr.needsUpdate = !0),
        this.dataAttr.clearUpdateRanges(),
        this.dataAttr.addUpdateRange(0, s * 4),
        (this.dataAttr.needsUpdate = !0)));
    const n = this.ctx.camera;
    (this.ctx.renderer.getDrawingBufferSize(this._size),
      (this.material.uniforms.uScale.value =
        this._size.y / (2 * Math.tan(ThreeMathUtils.degToRad(n.fov) / 2))));
  }
}
export { WaterParticles };
