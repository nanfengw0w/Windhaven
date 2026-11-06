// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeColor,
  ThreeDynamicDrawUsage,
  ThreeFloat32BufferAttribute,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreeShaderMaterial,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
import { clamp, createSimplexNoise, smoothstep } from "../core/math.js";
const SMOKE_VERTEX_SHADER = `
attribute vec4 iPos;   // xyz, size
attribute vec4 iData;  // alpha, rotation, seed, age01
varying vec2 vUv;
varying vec2 vNrm;
varying float vAlpha;
varying float vSeed;
varying float vAge;
varying vec3 vWorld;
varying float vShadow;
void main() {
  vec4 mv = viewMatrix * vec4(iPos.xyz, 1.0);
  float c = cos(iData.y), s = sin(iData.y);
  vec2 corner = position.xy;
  vec2 rc = vec2(c * corner.x - s * corner.y, s * corner.x + c * corner.y);
  mv.xy += rc * iPos.w;
  gl_Position = projectionMatrix * mv;
  vUv = corner * 2.0;
  vNrm = rc * 2.0;
  vAlpha = iData.x;
  vSeed = iData.z;
  vAge = iData.w;
  vWorld = iPos.xyz;
  vShadow = cloudShadowAt(iPos.xyz);
}
`;
const SMOKE_FRAGMENT_SHADER = `
uniform vec3 uSmokeTint;
varying vec2 vUv;
varying vec2 vNrm;
varying float vAlpha;
varying float vSeed;
varying float vAge;
varying vec3 vWorld;
varying float vShadow;
void main() {
  float r = length(vUv);
  if (r > 1.0) discard;
  vec2 drift = vec2(0.0, vAge * 1.3);
  float n = wgNoise(vUv * 1.7 + vSeed * 17.0 + drift) * 0.55 + wgNoise(vUv * 3.9 + vSeed * 5.0 - drift * 1.6) * 0.3 + wgNoise(vUv * 8.0 + vSeed * 9.0) * 0.15;
  float d = smoothstep(1.0, 0.15, r + (n - 0.5) * (0.8 + vAge * 0.6));
  d *= d * (3.0 - 2.0 * d);
  float a = d * vAlpha;
  if (a < 0.004) discard;
  // soft-sphere normal in view space → world
  float rr = min(1.0, length(vNrm));
  vec3 nv = normalize(vec3(vNrm * 0.9, sqrt(max(0.0, 1.0 - rr * rr)) + 0.35));
  vec3 nw = normalize(mat3(uCameraWorld) * nv);
  vec3 L = normalize(uLightDir);
  float ndl = dot(nw, L);
  float wrap = clamp(ndl * 0.55 + 0.45, 0.0, 1.0);
  wrap *= mix(0.6, 1.0, smoothstep(0.0, 0.8, 1.0 - d * 0.6));      // denser core self-shadows
  vec3 hemi = mix(uGroundColor * 0.8, uSkyColor, nw.y * 0.5 + 0.5) * uAmbientIntensity;
  vec3 col = uSmokeTint * (uLightColor * wrap * vShadow + hemi) * 0.36;
  vec3 V = normalize(vWorld - cameraPosition);
  float fwd = pow(max(dot(V, L), 0.0), 8.0);
  col += uSmokeTint * uLightColor * fwd * 0.22 * vShadow * (1.2 - d);
  col += uSmokeTint * uFlash * 0.25;
  gl_FragColor = vec4(col, a);
}
`;
const smokeWindScratch = {
  x: 0,
  z: 0,
};
const smokeCameraDirectionScratch = new ThreeVector3();
class ChimneySmoke {
  constructor(t, e, i, { tint = null, random = null } = {}) {
    ((this.ctx = t), (this.origin = i.clone()));
    this.fixedTint = tint ? new ThreeColor(tint) : null;
    this.random = random;
    this.emission = 1;
    const s = (this.N = t.quality.pick(40, 64, 90));
    ((this.noise = createSimplexNoise(4401)),
      (this.px = new Float32Array(s)),
      (this.py = new Float32Array(s)),
      (this.pz = new Float32Array(s)),
      (this.vx = new Float32Array(s)),
      (this.vy = new Float32Array(s)),
      (this.vz = new Float32Array(s)),
      (this.age = new Float32Array(s)),
      (this.life = new Float32Array(s)),
      (this.s0 = new Float32Array(s)),
      (this.s1 = new Float32Array(s)),
      (this.rot = new Float32Array(s)),
      (this.rotV = new Float32Array(s)),
      (this.seed = new Float32Array(s)),
      (this.dens = new Float32Array(s)),
      (this.alive = new Uint8Array(s)),
      (this.order = new Uint16Array(s)),
      (this.depth = new Float32Array(s)),
      (this.acc = 0),
      (this.time = 0));
    const n = new ThreeInstancedBufferGeometry();
    (n.setAttribute(
      "position",
      new ThreeFloat32BufferAttribute(
        [-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0],
        3,
      ),
    ),
      n.setIndex([0, 1, 2, 0, 2, 3]),
      (this.iPos = new ThreeInstancedBufferAttribute(
        new Float32Array(s * 4),
        4,
      ).setUsage(ThreeDynamicDrawUsage)),
      (this.iData = new ThreeInstancedBufferAttribute(
        new Float32Array(s * 4),
        4,
      ).setUsage(ThreeDynamicDrawUsage)),
      n.setAttribute("iPos", this.iPos),
      n.setAttribute("iData", this.iData),
      (n.instanceCount = 0),
      (this.geometry = n),
      (this.tint = new ThreeColor(0.8, 0.8, 0.82)),
      (this.material = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
          uSmokeTint: {
            value: this.tint,
          },
        },
        vertexShader: t.GLSL_COMMON + SMOKE_VERTEX_SHADER,
        fragmentShader: t.GLSL_COMMON + SMOKE_FRAGMENT_SHADER,
        transparent: !0,
        depthWrite: !1,
      })),
      (this.mesh = new ThreeMesh(n, this.material)),
      (this.mesh.name = "life-smoke"),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 3),
      (this.mesh.userData.noReflect = !0),
      e.add(this.mesh));
  }
  hide() {
    this.mesh.visible = !1;
  }
  reset(t) {
    (this.alive.fill(0), (this.acc = 0));
    for (let e = 0; e < 90; e++) this._sim(1 / 15, t);
    this._write();
  }
  clear() {
    this.alive.fill(0);
    this.acc = 0;
    this.geometry.instanceCount = 0;
  }
  _spawn(t) {
    const random = this.random ?? Math.random;
    const e = this.N;
    let i = -1;
    for (let o = 0; o < e; o++)
      if (!this.alive[o]) {
        i = o;
        break;
      }
    if (i < 0) return;
    const s = t.fire,
      n = this.origin;
    ((this.alive[i] = 1),
      (this.px[i] = n.x + (random() - 0.5) * 0.03),
      (this.py[i] = n.y + random() * 0.01),
      (this.pz[i] = n.z + (random() - 0.5) * 0.03),
      (this.vx[i] = (random() - 0.5) * 0.04),
      (this.vy[i] = 0.28 + s * 0.14 + random() * 0.06),
      (this.vz[i] = (random() - 0.5) * 0.04),
      (this.age[i] = 0),
      (this.life[i] = 3.6 + random() * 2.2 + s * 1.4),
      (this.s0[i] = 0.07 + random() * 0.03),
      (this.s1[i] = (0.32 + random() * 0.2) * (0.7 + s * 0.65)),
      (this.rot[i] = random() * 6.28),
      (this.rotV[i] = (random() - 0.5) * 0.5),
      (this.seed[i] = random() * 10),
      (this.dens[i] = (0.5 + random() * 0.25) * (0.55 + s * 0.65)));
  }
  _sim(t, e) {
    if (t <= 0) return;
    this.time += t;
    const i = (2.2 + e.fire * 9) * (1 - e.rain * 0.35) * this.emission;
    for (this.acc += t * i; this.acc >= 1;) ((this.acc -= 1), this._spawn(e));
    const s = this.ctx.wind,
      n = this.N,
      o = this.noise,
      a = this.time,
      l = this.origin.y,
      c = TERRARIUM_BOUNDS.topY - 0.35,
      h = LANDSCAPE_BOUNDS.halfW - 0.15,
      f = LANDSCAPE_BOUNDS.halfD - 0.15;
    for (let u = 0; u < n; u++) {
      if (!this.alive[u]) continue;
      this.age[u] += t;
      const d = this.age[u] / this.life[u];
      if (d >= 1) {
        this.alive[u] = 0;
        continue;
      }
      const p = clamp((this.py[u] - l) * 0.3, 0, 0.6);
      s.sample(this.px[u], this.pz[u], smokeWindScratch, p);
      const v = 0.55 + 0.45 * Math.min(1, d * 3),
        g = (1.1 + d * 1.5) * t;
      ((this.vx[u] += (smokeWindScratch.x * v - this.vx[u]) * g),
        (this.vz[u] += (smokeWindScratch.z * v - this.vz[u]) * g));
      const x = (0.36 * (1 - d) + 0.07) * (0.7 + e.fire * 0.5) - e.rain * 0.12;
      this.vy[u] += (x - this.vy[u]) * 1.4 * t;
      const m = this.seed[u],
        w = o.noise3(this.px[u] * 2.2 + m, this.py[u] * 2.2, a * 0.35),
        y = o.noise3(
          this.px[u] * 2.2 - 5.1,
          this.py[u] * 2.2 + m,
          a * 0.35 + 3.3,
        ),
        _ = (0.12 + d * 0.25) * t;
      ((this.vx[u] += w * _),
        (this.vz[u] += y * _),
        (this.px[u] += this.vx[u] * t),
        (this.py[u] += this.vy[u] * t),
        (this.pz[u] += this.vz[u] * t),
        this.py[u] > c &&
          ((this.py[u] = c), (this.vy[u] *= -0.1), (this.age[u] += t * 2)),
        this.px[u] > h
          ? ((this.px[u] = h), (this.vx[u] *= -0.3))
          : this.px[u] < -h && ((this.px[u] = -h), (this.vx[u] *= -0.3)),
        this.pz[u] > f
          ? ((this.pz[u] = f), (this.vz[u] *= -0.3))
          : this.pz[u] < -f && ((this.pz[u] = -f), (this.vz[u] *= -0.3)),
        (this.rot[u] += this.rotV[u] * t));
    }
  }
  _write() {
    const t = this.ctx.camera;
    t.getWorldDirection(smokeCameraDirectionScratch);
    const e = t.position.x,
      i = t.position.y,
      s = t.position.z,
      n = this.N,
      o = this.order,
      a = this.depth;
    let l = 0;
    for (let f = 0; f < n; f++) {
      if (!this.alive[f]) continue;
      a[f] =
        (this.px[f] - e) * smokeCameraDirectionScratch.x +
        (this.py[f] - i) * smokeCameraDirectionScratch.y +
        (this.pz[f] - s) * smokeCameraDirectionScratch.z;
      let u = l++;
      for (; u > 0 && a[o[u - 1]] < a[f];) ((o[u] = o[u - 1]), u--);
      o[u] = f;
    }
    const c = this.iPos.array,
      h = this.iData.array;
    for (let f = 0; f < l; f++) {
      const u = o[f],
        d = this.age[u] / this.life[u],
        p = this.s0[u] + (this.s1[u] - this.s0[u]) * Math.sqrt(d),
        v = smoothstep(0, 0.05, d) * Math.pow(1 - d, 1.6) * this.dens[u];
      ((c[f * 4] = this.px[u]),
        (c[f * 4 + 1] = this.py[u]),
        (c[f * 4 + 2] = this.pz[u]),
        (c[f * 4 + 3] = p),
        (h[f * 4] = v),
        (h[f * 4 + 1] = this.rot[u]),
        (h[f * 4 + 2] = this.seed[u]),
        (h[f * 4 + 3] = d));
    }
    ((this.geometry.instanceCount = l),
      l && ((this.iPos.needsUpdate = !0), (this.iData.needsUpdate = !0)));
  }
  update(t, e, i) {
    this._sim(t, i);
    const s = i.fire;
    if (this.fixedTint) this.tint.copy(this.fixedTint);
    else this.tint.setRGB(0.84 - s * 0.26, 0.85 - s * 0.28, 0.9 - s * 0.31);
    this._write();
  }
  syncPhotoCamera() {
    this._write();
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.clear();
    this.mesh.removeFromParent();
    this.geometry.dispose();
    this.material.dispose();
  }
}
export { ChimneySmoke };
