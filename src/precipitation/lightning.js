// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAdditiveBlending,
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeColor,
  ThreeDoubleSide,
  ThreeDynamicDrawUsage,
  ThreeFloat32BufferAttribute,
  ThreeGroup,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreePlaneGeometry,
  ThreeShaderMaterial,
  ThreeVector2,
  ThreeVector3,
  ThreeVector4,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { getTreeRegistry } from "../vegetation/tree-registry.js";
function smoothstepLightning(r, t, e) {
  const i = Math.min(1, Math.max(0, (e - r) / (t - r)));
  return i * i * (3 - 2 * i);
}
const LIGHTNING_BOLT_POOL_SIZE = 3;
const LIGHTNING_MAX_SEGMENTS = 240;
const g1 = 0.075;
const Wz = 1.6;
const LIGHTNING_BOLT_VERTEX_SHADER = `
attribute vec3 aDir;
attribute vec4 aInfo;   // side, width scale, level (0 main, 1 branch, 2 twig), t along the channel
uniform vec4 uEnv;      // main, branches, afterglow, leader progress
uniform float uPixel;
uniform float uWidth;   // glow half-width (world)
uniform float uCore;    // core half-width (world)
varying float vAcross;
varying float vCoreRatio;
varying float vI;
varying float vAfter;
void main() {
  vec3 p = position;
  vec3 d = cameraPosition - p;
  float dist = length(d);
  vec3 toCam = d / dist;
  vec3 side = normalize(cross(aDir, toCam) + 1e-5);
  float px = dist * uPixel;
  float ws = aInfo.y;
  float core = max(uCore * ws, px * 1.25);
  float glow = max(uWidth * ws, px * 6.0);
  p += side * glow * aInfo.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  vAcross = aInfo.x;
  vCoreRatio = core / glow;
  float lvl = aInfo.z;
  float env = lvl < 0.5 ? uEnv.x : uEnv.y * (lvl < 1.5 ? 1.0 : 0.65);
  // the leader reveals the channel top-down; the first metre sits inside the cloud
  float lead = 1.0 - smoothstep(uEnv.w - 0.03, uEnv.w, aInfo.w);
  float inCloud = mix(0.25, 1.0, smoothstep(0.0, 0.12, aInfo.w));
  vI = env * lead * inCloud;
  vAfter = uEnv.z * (lvl < 0.5 ? 1.0 : 0.35) * inCloud;
}
`;
const LIGHTNING_BOLT_FRAGMENT_SHADER = `
varying float vAcross;
varying float vCoreRatio;
varying float vI;
varying float vAfter;
void main() {
  float a = abs(vAcross);
  float x = a / vCoreRatio;
  float core = exp(-x * x * 1.6);
  float glow = exp(-a * a * 4.0) * 0.5 + exp(-a * a * 16.0) * 1.0;
  vec3 col = vec3(0.92, 0.94, 1.0) * core * 9.0 * vI
           + vec3(0.5, 0.54, 1.0) * glow * 0.7 * vI
           + vec3(0.75, 0.55, 1.0) * (core * 1.2 + glow * 0.12) * vAfter;
  gl_FragColor = vec4(col, 1.0);
}
`;
const LIGHTNING_FLASH_VERTEX_SHADER = `
uniform vec3 uCenter;
uniform float uSize;
varying vec2 vUv;
void main() {
  vec3 toCam = normalize(cameraPosition - uCenter);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toCam) + vec3(1e-5, 0.0, 0.0));
  vec3 up = cross(toCam, right);
  // pulled toward the camera so the ground doesn't slice the glow in half
  vec3 p = uCenter + (right * position.x + up * position.y) * uSize + toCam * min(uSize * 0.35, 0.3);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  vUv = position.xy;
}
`;
const LIGHTNING_FLASH_FRAGMENT_SHADER = `
uniform vec3 uColor;
uniform vec3 uColor2;
uniform vec2 uI;       // core intensity, halo intensity
varying vec2 vUv;
void main() {
  float r2 = dot(vUv, vUv);
  if (r2 > 1.0) discard;
  float edge = 1.0 - r2;
  vec3 col = uColor * exp(-r2 * 45.0) * uI.x + uColor2 * (exp(-r2 * 6.0) * 0.8 + exp(-r2 * 2.0) * 0.25) * edge * uI.y;
  gl_FragColor = vec4(col, 1.0);
}
`;
const LIGHTNING_GROUND_VERTEX_SHADER = `
uniform vec3 uCenter;
uniform float uRadius;
varying vec2 vLocal;
varying vec2 vXZ;
void main() {
  vec2 xz = uCenter.xz + position.xz * uRadius;
  vec4 ter = terrainAt(xz);
  float y = ter.z > 0.5 ? max(ter.x, uWaterLevel) : ter.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(xz.x, y + 0.018, xz.y, 1.0);
  vLocal = position.xz;
  vXZ = xz;
}
`;
const LIGHTNING_GROUND_FRAGMENT_SHADER = `
uniform vec2 uI;       // flash, ember
uniform float uSeed;
varying vec2 vLocal;
varying vec2 vXZ;
void main() {
  float r2 = dot(vLocal, vLocal);
  if (r2 > 1.0) discard;
  float edge = 1.0 - r2;
  vec3 flash = vec3(0.8, 0.84, 1.0) * (exp(-r2 * 30.0) * 2.5 + exp(-r2 * 5.0) * 0.35) * uI.x;
  // scattered embers + a scorched hot spot that cools to a dull orange
  float n = wgNoise(vXZ * 26.0 + uSeed * 17.0) * wgNoise(vXZ * 61.0 - uSeed * 5.0);
  float emb = smoothstep(0.18, 0.42, n) * exp(-r2 * 7.0) + exp(-r2 * 60.0) * 0.8;
  vec3 ember = mix(vec3(1.0, 0.18, 0.03), vec3(1.0, 0.62, 0.25), uI.y) * emb * uI.y * 3.2;
  gl_FragColor = vec4((flash + ember) * edge, 1.0);
}
`;
const LIGHTNING_SPARK_VERTEX_SHADER = `
attribute vec4 aSeed;
uniform vec3 uOrigin;
uniform vec4 uTimes;   // age, stroke 2 time, stroke 3 time, strength
uniform float uSeed;
uniform float uPixel;
uniform float uKind;   // 0 sparks, 1 water spray
varying vec2 vUv;
varying float vHeat;
varying float vA;
void cull() { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); vA = 0.0; }
void main() {
  vec4 sd = fract(aSeed + uSeed * vec4(1.0, 0.618, 0.414, 0.732));
  float birth = sd.w < 0.62 ? 0.0 : (sd.w < 0.85 ? uTimes.y : uTimes.z);
  float t = uTimes.x - birth;
  float life = 0.28 + 0.55 * sd.z;
  if (t < 0.0 || t > life) { cull(); return; }
  float th = sd.x * 6.2831853;
  float cz = 0.18 + 0.82 * sd.y;
  float sz = sqrt(1.0 - cz * cz);
  float sp = (1.6 + 4.2 * sd.z * sd.z) * (0.6 + 0.4 * uTimes.w) * (1.0 - 0.35 * uKind);
  vec3 v0 = vec3(cos(th) * sz, cz, sin(th) * sz) * sp;
  // ballistic with drag: v → terminal velocity vt
  const float k = 1.7;
  vec3 vt = vec3(0.0, -9.0 / k, 0.0);
  float e = exp(-k * t);
  vec3 p = uOrigin + vt * t + (v0 - vt) * (1.0 - e) / k;
  vec3 vel = (v0 - vt) * e + vt;
  if (p.y < groundHeightAt(p.xz) - 0.01) { cull(); return; }
  vec3 d = cameraPosition - p;
  float dist = length(d);
  vec3 toCam = d / dist;
  float speed = length(vel);
  vec3 axis = vel / max(speed, 1e-3);
  float px = dist * uPixel;
  float len = clamp(speed * 0.055, 0.02, 0.22);
  float wid = max(0.007 + 0.004 * uKind, px * 1.2);
  vec3 side = normalize(cross(axis, toCam) + 1e-5);
  p += side * wid * position.x - axis * len * (position.y * 0.5 + 0.5);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  vUv = position.xy;
  vHeat = 1.0 - t / life;
  vA = min(1.0, 0.005 / wid + 0.35);
}
`;
const LIGHTNING_SPARK_FRAGMENT_SHADER = `
uniform float uKind;
varying vec2 vUv;
varying float vHeat;
varying float vA;
void main() {
  if (vA <= 0.0) discard;
  float along = vUv.y * 0.5 + 0.5;
  float prof = exp(-vUv.x * vUv.x * 2.5) * (1.0 - along) * smoothstep(0.0, 0.1, along);
  float h = vHeat * vHeat * vHeat;
  // white-hot sparks cooling through orange to red; or flash-lit water spray
  vec3 fire = mix(vec3(1.0, 0.24, 0.04) * 3.0, vec3(1.0, 0.8, 0.55) * 14.0, h);
  vec3 spray = vec3(0.72, 0.82, 1.0) * (0.5 + 2.5 * h);
  vec3 col = mix(fire, spray, uKind) * prof * vA * smoothstep(0.0, 0.25, vHeat);
  gl_FragColor = vec4(col, 1.0);
}
`;
const boltStartScratch = new ThreeVector3();
const boltEndScratch = new ThreeVector3();
const boltDirectionScratch = new ThreeVector3();
const boltMidpointScratch = new ThreeVector3();
const boltPerpendicularScratch = new ThreeVector3();
function randomLightningPerpendicular(r, t) {
  return (
    t.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5),
    t.addScaledVector(r, -t.dot(r)),
    t.lengthSq() < 1e-8 && t.set(1, 0, 0).addScaledVector(r, -r.x),
    t.normalize()
  );
}
function createLightningPolyline(r, t, e, i) {
  let s = [r.x, r.y, r.z, t.x, t.y, t.z],
    n = r.distanceTo(t) * i;
  for (let o = 0; o < e; o++) {
    const a = [],
      l = s.length / 3;
    for (let c = 0; c < l - 1; c++)
      (boltStartScratch.fromArray(s, c * 3),
        boltEndScratch.fromArray(s, c * 3 + 3),
        boltDirectionScratch
          .subVectors(boltEndScratch, boltStartScratch)
          .normalize(),
        randomLightningPerpendicular(
          boltDirectionScratch,
          boltPerpendicularScratch,
        ),
        boltMidpointScratch
          .addVectors(boltStartScratch, boltEndScratch)
          .multiplyScalar(0.5)
          .addScaledVector(
            boltPerpendicularScratch,
            n * (Math.random() * 2 - 1),
          ),
        boltMidpointScratch.addScaledVector(
          boltDirectionScratch,
          n * 0.25 * (Math.random() * 2 - 1),
        ),
        a.push(
          boltStartScratch.x,
          boltStartScratch.y,
          boltStartScratch.z,
          boltMidpointScratch.x,
          boltMidpointScratch.y,
          boltMidpointScratch.z,
        ));
    (a.push(s[s.length - 3], s[s.length - 2], s[s.length - 1]),
      (s = a),
      (n *= 0.52));
  }
  return s;
}
class LightningBolt {
  constructor(t, e, i) {
    ((this.ctx = t),
      (this.active = !1),
      (this.age = 0),
      (this.strength = 1),
      (this.strokes = [0, 0.12, 0.24, 0.36]),
      (this.amps = [1, 0.7, 0.5, 0.3]),
      (this.fired = 0),
      (this.grounded = !0),
      (this.water = !1),
      (this.start = new ThreeVector3()),
      (this.end = new ThreeVector3()),
      (this.group = new ThreeGroup()),
      (this.group.name = "lightning-bolt"),
      (this.group.visible = !1));
    const s = new ThreeBufferGeometry();
    ((this.pos = new Float32Array(LIGHTNING_MAX_SEGMENTS * 2 * 3)),
      (this.dir = new Float32Array(LIGHTNING_MAX_SEGMENTS * 2 * 3)),
      (this.info = new Float32Array(LIGHTNING_MAX_SEGMENTS * 2 * 4)),
      (this.index = new Uint16Array(LIGHTNING_MAX_SEGMENTS * 6)),
      s.setAttribute(
        "position",
        new ThreeBufferAttribute(this.pos, 3).setUsage(ThreeDynamicDrawUsage),
      ),
      s.setAttribute(
        "aDir",
        new ThreeBufferAttribute(this.dir, 3).setUsage(ThreeDynamicDrawUsage),
      ),
      s.setAttribute(
        "aInfo",
        new ThreeBufferAttribute(this.info, 4).setUsage(ThreeDynamicDrawUsage),
      ),
      s.setIndex(
        new ThreeBufferAttribute(this.index, 1).setUsage(ThreeDynamicDrawUsage),
      ),
      s.setDrawRange(0, 0),
      (this.boltMat = new ThreeShaderMaterial({
        uniforms: {
          uEnv: {
            value: new ThreeVector4(),
          },
          uPixel: {
            value: 0.001,
          },
          uWidth: {
            value: 0.13,
          },
          uCore: {
            value: 0.012,
          },
        },
        vertexShader: LIGHTNING_BOLT_VERTEX_SHADER,
        fragmentShader: LIGHTNING_BOLT_FRAGMENT_SHADER,
        transparent: !0,
        depthWrite: !1,
        blending: ThreeAdditiveBlending,
        side: ThreeDoubleSide,
      })),
      (this.ribbon = new ThreeMesh(s, this.boltMat)),
      (this.ribbon.frustumCulled = !1),
      (this.ribbon.renderOrder = 12),
      this.group.add(this.ribbon));
    const n = new ThreePlaneGeometry(2, 2),
      o = (c, h) => {
        const f = new ThreeShaderMaterial({
            uniforms: {
              uCenter: {
                value: new ThreeVector3(),
              },
              uSize: {
                value: 1,
              },
              uColor: {
                value: new ThreeColor(c),
              },
              uColor2: {
                value: new ThreeColor(h),
              },
              uI: {
                value: new ThreeVector2(),
              },
            },
            vertexShader: LIGHTNING_FLASH_VERTEX_SHADER,
            fragmentShader: LIGHTNING_FLASH_FRAGMENT_SHADER,
            transparent: !0,
            depthWrite: !1,
            blending: ThreeAdditiveBlending,
          }),
          u = new ThreeMesh(n, f);
        return (
          (u.frustumCulled = !1),
          (u.renderOrder = 12),
          this.group.add(u),
          u
        );
      };
    ((this.flash = o(16054015, 10135295)),
      (this.cloudGlow = o(14673663, 10465535)));
    const a = new ThreePlaneGeometry(2, 2, 18, 18);
    (a.rotateX(-Math.PI / 2),
      (this.groundMat = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
          uCenter: {
            value: new ThreeVector3(),
          },
          uRadius: {
            value: 0.9,
          },
          uI: {
            value: new ThreeVector2(),
          },
          uSeed: {
            value: 0,
          },
        },
        vertexShader: t.GLSL_COMMON + LIGHTNING_GROUND_VERTEX_SHADER,
        fragmentShader: t.GLSL_COMMON + LIGHTNING_GROUND_FRAGMENT_SHADER,
        transparent: !0,
        depthWrite: !1,
        blending: ThreeAdditiveBlending,
      })),
      (this.ground = new ThreeMesh(a, this.groundMat)),
      (this.ground.frustumCulled = !1),
      (this.ground.renderOrder = 12),
      this.group.add(this.ground));
    const l = new ThreeInstancedBufferGeometry();
    (l.setIndex([0, 1, 2, 0, 2, 3]),
      l.setAttribute(
        "position",
        new ThreeFloat32BufferAttribute(
          [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0],
          3,
        ),
      ),
      l.setAttribute("aSeed", i),
      (l.instanceCount = e),
      (this.sparkMat = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
          uOrigin: {
            value: new ThreeVector3(),
          },
          uTimes: {
            value: new ThreeVector4(),
          },
          uSeed: {
            value: 0,
          },
          uPixel: {
            value: 0.001,
          },
          uKind: {
            value: 0,
          },
        },
        vertexShader: t.GLSL_COMMON + LIGHTNING_SPARK_VERTEX_SHADER,
        fragmentShader: t.GLSL_COMMON + LIGHTNING_SPARK_FRAGMENT_SHADER,
        transparent: !0,
        depthWrite: !1,
        blending: ThreeAdditiveBlending,
        side: ThreeDoubleSide,
      })),
      (this.sparks = new ThreeMesh(l, this.sparkMat)),
      (this.sparks.frustumCulled = !1),
      (this.sparks.renderOrder = 12),
      this.group.add(this.sparks));
  }
  fire({ start: t, end: e, points: i, branches: s, strength: n = 1 }) {
    const o = this.ctx;
    ((this.active = !0),
      (this.group.visible = !0),
      (this.age = -g1),
      (this.fired = 0),
      (this.strength = Math.max(0.2, Math.min(1.5, n))),
      this.start.copy(t),
      this.end.copy(e));
    const a = Math.random() < 0.45 ? 4 : 3;
    ((this.strokes[1] = 0.085 + Math.random() * 0.05),
      (this.strokes[2] = this.strokes[1] + 0.08 + Math.random() * 0.07),
      (this.strokes[3] =
        a > 3 ? this.strokes[2] + 0.09 + Math.random() * 0.08 : 99),
      (this.amps[1] = 0.6 + Math.random() * 0.3),
      (this.amps[2] = 0.4 + Math.random() * 0.3),
      (this.amps[3] = 0.25 + Math.random() * 0.2));
    const l = o.terrain.height(e.x, e.z);
    this.grounded = e.y - l < 0.35;
    let c;
    if (i && i.length >= 2) {
      c = [];
      for (const g of i) c.push(g.x, g.y, g.z);
      if (i.length < 48) {
        const g = i.length < 20 ? 2 : 1,
          x = [];
        for (let m = 0; m < i.length - 1; m++) {
          const w = createLightningPolyline(i[m], i[m + 1], g, 0.14);
          for (let y = m === 0 ? 0 : 3; y < w.length; y++) x.push(w[y]);
        }
        c = x;
      }
    } else c = createLightningPolyline(t, e, 6, 0.26);
    const h = [
        {
          pts: c,
          level: 0,
          t0: 0,
          t1: 1,
          width: 1,
        },
      ],
      f = c.length / 3,
      u = t.distanceTo(e);
    if (s?.length)
      for (const g of s) {
        if (!g || g.length < 2) continue;
        const x = [];
        for (const w of g) x.push(w.x, w.y, w.z);
        const m = this._nearestT(c, g[0]);
        h.push({
          pts: x,
          level: 1,
          t0: m,
          t1: m + g[0].distanceTo(g[g.length - 1]) / u,
          width: 0.55,
        });
      }
    const d = s?.length ? 0 : 1 + Math.floor(Math.random() * 3);
    for (let g = 0; g < d; g++) {
      const x = Math.floor(f * (0.12 + Math.random() * 0.5)),
        m = Math.min(f - 1, x + 4);
      (boltStartScratch.fromArray(c, x * 3),
        boltDirectionScratch
          .fromArray(c, m * 3)
          .sub(boltStartScratch)
          .normalize(),
        randomLightningPerpendicular(
          boltDirectionScratch,
          boltPerpendicularScratch,
        ),
        (boltPerpendicularScratch.y = Math.min(
          boltPerpendicularScratch.y,
          0.1,
        )),
        boltDirectionScratch
          .addScaledVector(boltPerpendicularScratch, 0.8 + Math.random() * 0.6)
          .normalize(),
        (boltDirectionScratch.y = Math.min(boltDirectionScratch.y, -0.25)),
        boltDirectionScratch.normalize());
      const w = u * (1 - x / f) * (0.28 + Math.random() * 0.3);
      (boltEndScratch
        .copy(boltStartScratch)
        .addScaledVector(boltDirectionScratch, w),
        (boltEndScratch.y = Math.max(
          boltEndScratch.y,
          o.terrain.height(boltEndScratch.x, boltEndScratch.z) + 0.25,
        )));
      const y = x / (f - 1),
        _ = createLightningPolyline(boltStartScratch, boltEndScratch, 4, 0.22);
      if (
        (h.push({
          pts: _,
          level: 1,
          t0: y,
          t1: y + w / u,
          width: 0.55,
        }),
        Math.random() < 0.6)
      ) {
        const M = _.length / 3,
          A = Math.floor(M * (0.3 + Math.random() * 0.3));
        (boltStartScratch.fromArray(_, A * 3),
          randomLightningPerpendicular(
            boltDirectionScratch,
            boltPerpendicularScratch,
          ),
          (boltPerpendicularScratch.y =
            -Math.abs(boltPerpendicularScratch.y) - 0.3),
          boltEndScratch
            .copy(boltStartScratch)
            .addScaledVector(
              boltPerpendicularScratch.normalize(),
              w * (0.3 + Math.random() * 0.25),
            ));
        const b = y + (A / M) * (w / u);
        h.push({
          pts: createLightningPolyline(
            boltStartScratch,
            boltEndScratch,
            3,
            0.25,
          ),
          level: 2,
          t0: b,
          t1: b + 0.1,
          width: 0.35,
        });
      }
    }
    this._writeGeometry(h);
    const p = o.terrain.lakeMask(e.x, e.z) > 0.5,
      v = this.strength;
    (this.flash.material.uniforms.uCenter.value.set(e.x, e.y + 0.1, e.z),
      (this.flash.material.uniforms.uSize.value = 0.42 + 0.22 * v),
      this.cloudGlow.material.uniforms.uCenter.value.copy(t),
      (this.cloudGlow.material.uniforms.uSize.value = 1.9 + 0.8 * v),
      this.groundMat.uniforms.uCenter.value.set(e.x, 0, e.z),
      (this.groundMat.uniforms.uRadius.value = 0.7 + 0.35 * v),
      (this.groundMat.uniforms.uSeed.value = Math.random() * 10),
      this.sparkMat.uniforms.uOrigin.value.set(
        e.x,
        Math.max(e.y, l) + 0.02,
        e.z,
      ),
      (this.sparkMat.uniforms.uSeed.value = Math.random() * 10),
      (this.ground.visible = this.grounded),
      (this.sparks.visible = this.grounded),
      (this.water = p || o.terrain.riverMask(e.x, e.z) > 0.55),
      (this.sparkMat.uniforms.uKind.value = this.water ? 1 : 0),
      (this.flash.visible = !0));
  }
  _nearestT(t, e) {
    const i = t.length / 3;
    let s = 0,
      n = 1 / 0;
    for (let o = 0; o < i; o++) {
      const a =
        (t[o * 3] - e.x) ** 2 +
        (t[o * 3 + 1] - e.y) ** 2 +
        (t[o * 3 + 2] - e.z) ** 2;
      a < n && ((n = a), (s = o));
    }
    return s / Math.max(1, i - 1);
  }
  _writeGeometry(t) {
    const { pos: e, dir: i, info: s, index: n } = this;
    let o = 0,
      a = 0;
    for (const c of t) {
      const h = c.pts,
        f = Math.min(h.length / 3, LIGHTNING_MAX_SEGMENTS - o / 2);
      if (f < 2) break;
      const u = o;
      for (let d = 0; d < f; d++) {
        const p = Math.max(0, d - 1),
          v = Math.min(f - 1, d + 1);
        boltDirectionScratch
          .set(
            h[v * 3] - h[p * 3],
            h[v * 3 + 1] - h[p * 3 + 1],
            h[v * 3 + 2] - h[p * 3 + 2],
          )
          .normalize();
        const g = d / (f - 1),
          x = c.width * (c.level === 0 ? 1 - 0.25 * g : 1 - 0.6 * g),
          m = c.t0 + (c.t1 - c.t0) * g;
        for (let w = 0; w < 2; w++) {
          const y = o + w;
          ((e[y * 3] = h[d * 3]),
            (e[y * 3 + 1] = h[d * 3 + 1]),
            (e[y * 3 + 2] = h[d * 3 + 2]),
            (i[y * 3] = boltDirectionScratch.x),
            (i[y * 3 + 1] = boltDirectionScratch.y),
            (i[y * 3 + 2] = boltDirectionScratch.z),
            (s[y * 4] = w === 0 ? -1 : 1),
            (s[y * 4 + 1] = x),
            (s[y * 4 + 2] = c.level),
            (s[y * 4 + 3] = m));
        }
        if (d < f - 1) {
          const w = u + d * 2;
          ((n[a++] = w),
            (n[a++] = w + 1),
            (n[a++] = w + 2),
            (n[a++] = w + 1),
            (n[a++] = w + 3),
            (n[a++] = w + 2));
        }
        o += 2;
      }
    }
    const l = this.ribbon.geometry;
    for (const c of ["position", "aDir", "aInfo"]) {
      const h = l.getAttribute(c);
      (h.clearUpdateRanges(),
        h.addUpdateRange(0, o * h.itemSize),
        (h.needsUpdate = !0));
    }
    (l.index.clearUpdateRanges(),
      l.index.addUpdateRange(0, a),
      (l.index.needsUpdate = !0),
      l.setDrawRange(0, a));
  }
  envelope(t) {
    let e = 0;
    for (let i = 0; i < 4; i++) {
      const s = t - this.strokes[i];
      if (s < 0) continue;
      const n = i === 0 ? 0.045 : 0.025;
      e += this.amps[i] * (s < n ? 1 : Math.exp(-(s - n) * 15));
    }
    return e;
  }
  update(t, e) {
    if (!this.active) return;
    const i = this.ctx.world;
    this.age += t;
    const s = this.age,
      n = this.strength;
    for (; this.fired < 4 && s >= this.strokes[this.fired];) {
      const d = this.amps[this.fired] * n * (0.8 - 0.35 * i.day);
      (i.triggerFlash(Math.min(1, d)), this.fired++);
    }
    let o, a, l, c;
    (s < 0
      ? ((c = 1 + s / g1),
        (o = (0.1 + 0.12 * Math.random()) * n),
        (a = o * 0.8),
        (l = 0))
      : ((c = 1.2),
        (o = this.envelope(s) * n),
        (a = o * Math.exp(-s * 7)),
        (l = 0.1 * n * Math.exp(-s * 2.4))),
      this.boltMat.uniforms.uEnv.value.set(o, a, l, c),
      (this.boltMat.uniforms.uPixel.value = e),
      (this.boltMat.uniforms.uWidth.value = 0.05 + 0.03 * n));
    const f = (s < 0 ? 0 : o) * Math.exp(-Math.max(0, s) * 5);
    (this.flash.material.uniforms.uI.value.set(f * 3.5, f * 0.45),
      this.cloudGlow.material.uniforms.uI.value.set(
        0,
        (s < 0 ? o * 1.5 : o + l * 2) * 0.32,
      ));
    const u = s < 0 || this.water ? 0 : Math.exp(-s * 1.9) * n;
    (this.groundMat.uniforms.uI.value.set(f, u),
      this.sparkMat.uniforms.uTimes.value.set(
        s,
        this.strokes[1],
        this.strokes[2],
        n,
      ),
      (this.sparkMat.uniforms.uPixel.value = e),
      s > Wz && ((this.active = !1), (this.group.visible = !1)));
  }
}
class LightningSystem {
  constructor(t) {
    this.ctx = t;
    const e = t.quality.pick(32, 72, 120),
      i = new Float32Array(e * 4);
    for (let n = 0; n < i.length; n++) i[n] = Math.random();
    const s = new ThreeInstancedBufferAttribute(i, 4);
    this.bolts = [];
    for (let n = 0; n < LIGHTNING_BOLT_POOL_SIZE; n++) {
      const o = new LightningBolt(t, e, s);
      (t.scene.add(o.group), this.bolts.push(o));
    }
    ((this.count = 0), t.events.on("lightning", (n) => this.strike(n || {})));
  }
  pickTarget(t, e) {
    const i = this.ctx,
      n = i.terrain.shape.highestNear(t.x, t.z, 1.3, 20);
    e.set(n.x, n.y, n.z);
    let o = n.y - 0.35 * Math.hypot(n.x - t.x, n.z - t.z);
    const a = getTreeRegistry(i).entries;
    for (const { plant: l } of a) {
      const c = Math.hypot(l.x - t.x, l.z - t.z);
      if (c > 1.6) continue;
      const h = (l.y ?? i.terrain.height(l.x, l.z)) + (l.height ?? 0.5),
        f = h + 0.25 - 0.35 * c;
      f > o && ((o = f), e.set(l.x, h, l.z));
    }
    // Aholo-generated shrines act as lightning rods: tall enough to attract
    // strikes and close enough to the cloud's target column.
    for (const landmark of i.aholoLandmarks || []) {
      if (landmark.role !== "shrine") continue;
      const c = Math.hypot(landmark.x - t.x, landmark.z - t.z);
      if (c > 1.8) continue;
      const h =
        (landmark.y ?? i.terrain.height(landmark.x, landmark.z)) +
        (landmark.height ?? 0.8) * (landmark.scale ?? 1) +
        0.12;
      const f = h - 0.35 * c;
      f > o && ((o = f), e.set(landmark.x, h, landmark.z));
    }
    return (
      (e.x = Math.max(
        -LANDSCAPE_BOUNDS.halfW + 0.2,
        Math.min(LANDSCAPE_BOUNDS.halfW - 0.2, e.x),
      )),
      (e.z = Math.max(
        -LANDSCAPE_BOUNDS.halfD + 0.2,
        Math.min(LANDSCAPE_BOUNDS.halfD - 0.2, e.z),
      )),
      e
    );
  }
  strike({ start: t, end: e, points: i, branches: s, strength: n = 1 }) {
    const o = this.ctx;
    (!t && i?.length && (t = i[0]), !e && i?.length && (e = i[i.length - 1]));
    const a = new ThreeVector3(),
      l = new ThreeVector3();
    (t ? a.copy(t) : a.set(0, 5.2, 0),
      e ? l.copy(e) : this.pickTarget(a, l),
      (a.x = Math.max(
        -LANDSCAPE_BOUNDS.halfW + 0.1,
        Math.min(LANDSCAPE_BOUNDS.halfW - 0.1, a.x),
      )),
      (a.z = Math.max(
        -LANDSCAPE_BOUNDS.halfD + 0.1,
        Math.min(LANDSCAPE_BOUNDS.halfD - 0.1, a.z),
      )),
      (a.y = Math.min(a.y, LANDSCAPE_BOUNDS.topY - 0.2)),
      (l.x = Math.max(
        -LANDSCAPE_BOUNDS.halfW + 0.1,
        Math.min(LANDSCAPE_BOUNDS.halfW - 0.1, l.x),
      )),
      (l.z = Math.max(
        -LANDSCAPE_BOUNDS.halfD + 0.1,
        Math.min(LANDSCAPE_BOUNDS.halfD - 0.1, l.z),
      )),
      (l.y = Math.max(l.y, o.terrain.height(l.x, l.z))),
      a.distanceToSquared(l) < 0.01 && (a.y += 1));
    let c = this.bolts.find((h) => !h.active);
    (c || (c = this.bolts.reduce((h, f) => (h.age > f.age ? h : f))),
      c.fire({
        start: a,
        end: l,
        points: i,
        branches: s,
        strength: n,
      }),
      this.count++);
  }
  get active() {
    return this.bolts.some((t) => t.active);
  }
  update(t, e, i) {
    for (const s of this.bolts) s.update(t, i);
  }
}
export { LightningSystem, smoothstepLightning };
