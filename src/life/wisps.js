// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeDoubleSide,
  ThreeDynamicDrawUsage,
  ThreeMesh,
  ThreeShaderMaterial,
  ThreeSphere,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import {
  clamp,
  createSeededRandom,
  createSimplexNoise,
  smoothstep,
} from "../core/math.js";
const WISP_VERTEX_SHADER = `
attribute float aAlpha;
attribute float aSide;
attribute float aU;
varying float vAlpha;
varying float vSide;
varying float vU;
varying vec3 vWorld;
void main() {
  vAlpha = aAlpha;
  vSide = aSide;
  vU = aU;
  vWorld = position;
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}
`;
const WISP_FRAGMENT_SHADER = `
varying float vAlpha;
varying float vSide;
varying float vU;
varying vec3 vWorld;
void main() {
  float edge = 1.0 - vSide * vSide;
  edge *= edge;
  float streak = 0.7 + 0.3 * wgNoise(vec2(vU * 9.0 - uTime * 2.0, vSide * 2.0 + vWorld.y * 5.0));
  float a = vAlpha * edge * streak;
  if (a < 0.004) discard;
  vec3 hemi = mix(uGroundColor, uSkyColor, 0.8) * uAmbientIntensity;
  vec3 col = vec3(0.96, 0.98, 1.0) * (uLightColor * 0.55 * cloudShadowAt(vWorld) + hemi * 0.9) * 0.4;
  col += uFlash * 0.2;
  gl_FragColor = vec4(col, a);
}
`;
const wispWindScratch = {
  x: 0,
  z: 0,
};
class WindWisps {
  constructor(t, e) {
    this.ctx = t;
    const i = (this.W = t.quality.pick(16, 26, 36)),
      s = (this.P = 18);
    ((this.rand = createSeededRandom(3737)),
      (this.noise = createSimplexNoise(1212)),
      (this.hx = new Float32Array(i)),
      (this.hy = new Float32Array(i)),
      (this.hz = new Float32Array(i)),
      (this.bvx = new Float32Array(i)),
      (this.bvz = new Float32Array(i)),
      (this.hoff = new Float32Array(i)),
      (this.age = new Float32Array(i)),
      (this.life = new Float32Array(i).fill(0)),
      (this.width = new Float32Array(i)),
      (this.alpha = new Float32Array(i)),
      (this.seed = new Float32Array(i)),
      (this.emitT = new Float32Array(i)),
      (this.tx = new Float32Array(i * s)),
      (this.ty = new Float32Array(i * s)),
      (this.tz = new Float32Array(i * s)),
      (this.head = new Uint16Array(i)),
      (this.count = new Uint16Array(i)),
      (this.next = 0),
      (this.lastStroke = -1),
      (this.time = 0));
    const n = i * s * 2;
    ((this.pos = new Float32Array(n * 3)), (this.aAlpha = new Float32Array(n)));
    const o = new Float32Array(n),
      a = new Float32Array(n);
    for (let h = 0; h < i; h++)
      for (let f = 0; f < s; f++) {
        const u = (h * s + f) * 2;
        ((o[u] = -1), (o[u + 1] = 1), (a[u] = a[u + 1] = f / (s - 1)));
      }
    const l = [];
    for (let h = 0; h < i; h++)
      for (let f = 0; f < s - 1; f++) {
        const u = (h * s + f) * 2;
        l.push(u, u + 1, u + 3, u, u + 3, u + 2);
      }
    const c = new ThreeBufferGeometry();
    ((this.posAttr = new ThreeBufferAttribute(this.pos, 3).setUsage(
      ThreeDynamicDrawUsage,
    )),
      (this.alphaAttr = new ThreeBufferAttribute(this.aAlpha, 1).setUsage(
        ThreeDynamicDrawUsage,
      )),
      c.setAttribute("position", this.posAttr),
      c.setAttribute("aAlpha", this.alphaAttr),
      c.setAttribute("aSide", new ThreeBufferAttribute(o, 1)),
      c.setAttribute("aU", new ThreeBufferAttribute(a, 1)),
      c.setIndex(l),
      (c.boundingSphere = new ThreeSphere(new ThreeVector3(0, 1, 0), 12)),
      (this.material = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
        },
        vertexShader: WISP_VERTEX_SHADER,
        fragmentShader: t.GLSL_COMMON + WISP_FRAGMENT_SHADER,
        transparent: !0,
        depthWrite: !1,
        side: ThreeDoubleSide,
      })),
      (this.mesh = new ThreeMesh(c, this.material)),
      (this.mesh.name = "life-wisps"),
      (this.mesh.renderOrder = 7),
      (this.mesh.frustumCulled = !1),
      (this.mesh.visible = !1),
      e.add(this.mesh),
      (this.active = 0));
  }
  hide() {
    this.mesh.visible = !1;
  }
  reset() {
    (this.life.fill(0), (this.mesh.visible = !1));
  }
  stroke(t) {
    if (!t) return;
    const e = this.rand,
      i = Math.hypot(t.vx || 0, t.vz || 0);
    if (i < 0.2) return;
    const s = this.time,
      n =
        s - this.lastStroke < 0.05
          ? 1
          : 2 + (e() < (t.strength || 0.5) ? 1 : 0);
    this.lastStroke = s;
    const o = t.vx / i,
      a = t.vz / i;
    for (let l = 0; l < n; l++) {
      const c = this.next;
      this.next = (c + 1) % this.W;
      const h = (e() - 0.5) * 0.7,
        f = -e() * 0.25,
        u = clamp(
          t.x + -a * h + o * f,
          -LANDSCAPE_BOUNDS.halfW + 0.1,
          LANDSCAPE_BOUNDS.halfW - 0.1,
        ),
        d = clamp(
          t.z + o * h + a * f,
          -LANDSCAPE_BOUNDS.halfD + 0.1,
          LANDSCAPE_BOUNDS.halfD - 0.1,
        ),
        p = this.ctx.terrain.height(u, d);
      ((this.hoff[c] = 0.12 + e() * 0.45),
        (this.hx[c] = u),
        (this.hz[c] = d),
        (this.hy[c] = Math.max(
          p + this.hoff[c],
          (t.y ?? p + 0.4) - 0.25 + e() * 0.3,
        )),
        (this.bvx[c] = t.vx * 0.35),
        (this.bvz[c] = t.vz * 0.35),
        (this.age[c] = 0),
        (this.life[c] = 1 + e() * 0.5),
        (this.width[c] = 0.009 + e() * 0.013 + (t.strength || 0.5) * 0.006),
        (this.alpha[c] = 0.16 + e() * 0.16),
        (this.seed[c] = e() * 100),
        (this.emitT[c] = 0));
      const v = this.P;
      for (let g = 0; g < v; g++)
        ((this.tx[c * v + g] = this.hx[c]),
          (this.ty[c * v + g] = this.hy[c]),
          (this.tz[c * v + g] = this.hz[c]));
      ((this.head[c] = 0), (this.count[c] = 1));
    }
  }
  syncPhotoCamera() {
    this.update(0, this.ctx.time);
  }
  update(t, e) {
    this.time += t;
    const i = this.W,
      s = this.P,
      n = this.ctx.wind,
      o = this.ctx.terrain,
      a = this.noise;
    let l = !1;
    if (t > 0)
      for (let u = 0; u < i; u++) {
        if (this.age[u] >= this.life[u]) continue;
        ((this.age[u] += t),
          n.sample(this.hx[u], this.hz[u], wispWindScratch, 0.15));
        const d = this.seed[u],
          p = 0.7 + this.age[u] * 1.4,
          v = a.noise3(this.hx[u] * 2.4 + d, this.hz[u] * 2.4, e * 1.1) * p,
          g = a.noise3(this.hx[u] * 2.4, this.hz[u] * 2.4 + d, e * 1.1 + 7) * p,
          x = Math.max(0, 1 - this.age[u] * 1.6),
          m = 0.75 - this.age[u] * 0.2,
          w = (wispWindScratch.x + this.bvx[u] * x) * m + v,
          y = (wispWindScratch.z + this.bvz[u] * x) * m + g;
        ((this.hx[u] = clamp(
          this.hx[u] + w * t,
          -LANDSCAPE_BOUNDS.halfW + 0.08,
          LANDSCAPE_BOUNDS.halfW - 0.08,
        )),
          (this.hz[u] = clamp(
            this.hz[u] + y * t,
            -LANDSCAPE_BOUNDS.halfD + 0.08,
            LANDSCAPE_BOUNDS.halfD - 0.08,
          )));
        const M =
          Math.max(o.height(this.hx[u], this.hz[u]), this.ctx.world.lakeLevel) +
          this.hoff[u] +
          Math.sin(this.age[u] * 4.5 + d) * 0.07 +
          this.age[u] * 0.12;
        ((this.hy[u] += (M - this.hy[u]) * Math.min(1, t * 3.5)),
          (this.emitT[u] -= t),
          this.emitT[u] <= 0 &&
            ((this.emitT[u] = 0.018),
            (this.head[u] = (this.head[u] + 1) % s),
            this.count[u] < s && this.count[u]++));
        const A = u * s + this.head[u];
        ((this.tx[A] = this.hx[u]),
          (this.ty[A] = this.hy[u]),
          (this.tz[A] = this.hz[u]),
          (l = !0));
      }
    else
      for (let u = 0; u < i; u++)
        if (this.age[u] < this.life[u]) {
          l = !0;
          break;
        }
    if (((this.mesh.visible = l), !l)) return;
    const c = this.ctx.camera.position,
      h = this.pos,
      f = this.aAlpha;
    for (let u = 0; u < i; u++) {
      const d = u * s * 2,
        p = this.age[u] < this.life[u],
        v = p ? this.count[u] : 0,
        g = p ? this.age[u] / this.life[u] : 1,
        x = smoothstep(0, 0.12, g) * (1 - smoothstep(0.55, 1, g));
      for (let m = 0; m < s; m++) {
        const w = s - 1 - m,
          y = d + m * 2;
        if (!p || w >= v) {
          const Zt =
            u * s + ((this.head[u] - Math.min(w, Math.max(0, v - 1)) + s) % s);
          ((h[y * 3] = h[y * 3 + 3] = this.tx[Zt]),
            (h[y * 3 + 1] = h[y * 3 + 4] = this.ty[Zt]),
            (h[y * 3 + 2] = h[y * 3 + 5] = this.tz[Zt]),
            (f[y] = f[y + 1] = 0));
          continue;
        }
        const _ = u * s + ((this.head[u] - w + s) % s),
          M = u * s + ((this.head[u] - Math.max(0, w - 1) + s) % s),
          A = u * s + ((this.head[u] - Math.min(v - 1, w + 1) + s) % s),
          b = this.tx[_],
          S = this.ty[_],
          E = this.tz[_];
        let T = this.tx[M] - this.tx[A],
          R = this.ty[M] - this.ty[A],
          z = this.tz[M] - this.tz[A];
        const L = Math.hypot(T, R, z);
        L < 1e-6 ? ((T = 1), (R = 0), (z = 0)) : ((T /= L), (R /= L), (z /= L));
        const k = c.x - b,
          U = c.y - S,
          F = c.z - E;
        let G = R * F - z * U,
          B = z * k - T * F,
          q = T * U - R * k;
        const X = Math.hypot(G, B, q) || 1,
          vt = v > 1 ? 1 - w / (v - 1) : 1,
          gt = Math.sin(Math.min(1, vt * 1.15) * Math.PI) * 0.85 + 0.15 * vt,
          Qt = this.width[u] * gt;
        ((G *= Qt / X),
          (B *= Qt / X),
          (q *= Qt / X),
          (h[y * 3] = b - G),
          (h[y * 3 + 1] = S - B),
          (h[y * 3 + 2] = E - q),
          (h[y * 3 + 3] = b + G),
          (h[y * 3 + 4] = S + B),
          (h[y * 3 + 5] = E + q));
        const te = this.alpha[u] * x * smoothstep(0, 0.35, vt);
        f[y] = f[y + 1] = te;
      }
    }
    ((this.posAttr.needsUpdate = !0), (this.alphaAttr.needsUpdate = !0));
  }
}
export { WindWisps };
