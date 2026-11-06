// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferGeometry,
  ThreeDoubleSide,
  ThreeDynamicDrawUsage,
  ThreeEuler,
  ThreeFloat32BufferAttribute,
  ThreeInstancedBufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeNoBlending,
  ThreeQuaternion,
  ThreeShaderMaterial,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LAKE_SHAPE } from "../simulation/terrain-shape.js";
import {
  LAKE_FRONT_Z,
  createWaterRandom,
} from "./uniforms-and-shadow-binding.js";
import { WATER_COMMON_GLSL } from "./common-shader.js";
const FISH_VERTEX_GLSL = `
attribute float aBody;   // 0 nose … 1 tail tip
attribute vec4 aFish;    // swim phase, wiggle amplitude, variant (0 silver … 1 orange), size
varying vec3 vWorld;
varying vec3 vNrm;
varying vec3 vLocal;
varying float vVariant;
varying float vBody;
void main() {
  vec3 p = position;
  float b = aBody;
  // travelling body wave, stronger toward the tail
  float wave = sin(aFish.x - b * 5.2) * aFish.y * (0.15 + b * b * 1.1);
  p.z += wave;
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vWorld = w.xyz;
  vNrm = normalize(mat3(modelMatrix * instanceMatrix) * normal);
  vLocal = position;
  vVariant = aFish.z;
  vBody = b;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
const FISH_FRAGMENT_GLSL = `
varying vec3 vWorld;
varying vec3 vNrm;
varying vec3 vLocal;
varying float vVariant;
varying float vBody;
void main() {
  vec3 N = normalize(vNrm);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 sigma = wSigma();
  float depth = max(uWaterLevel - vWorld.y, 0.0);
  vec3 Lr = wLightRefracted();
  float sunUp = max(uLightDir.y, 0.0);

  // countershading: dark back, pale belly, a lateral stripe; orange fish with pale patches
  float up = clamp(vLocal.y / 0.09 + 0.5, 0.0, 1.0);
  vec3 silverBack = vec3(0.16, 0.2, 0.17), silverBelly = vec3(0.78, 0.8, 0.8);
  vec3 col = mix(silverBelly, silverBack, smoothstep(0.35, 0.8, up));
  col = mix(col, vec3(0.42, 0.44, 0.4), smoothstep(0.02, 0.0, abs(up - 0.55)) * 0.6);
  vec3 orange = mix(vec3(1.0, 0.45, 0.1), vec3(0.95, 0.9, 0.82), step(0.62, wgNoise(vLocal.xy * 38.0 + vVariant * 9.0)));
  orange *= mix(1.0, 0.7, smoothstep(0.5, 0.95, up));
  col = mix(col, orange, step(0.5, vVariant));
  col *= mix(1.0, 0.75, smoothstep(0.82, 1.0, vBody)); // translucent fins read darker

  // light reaching this depth (sun through the surface, dappled by caustics) + sky
  vec3 sunAtDepth = uLightColor * sunUp * exp(-sigma * depth / max(-Lr.y, 0.25));
  float dapple = 0.6 + 0.9 * wShaftPattern(vWorld.xz * 2.2, uTime);
  vec3 skyAtDepth = uSkyColor * 0.5 * wAmbI() * exp(-sigma * depth * 0.6);
  float ndl = max(dot(N, -Lr), 0.0);
  vec3 lit = col * (sunAtDepth * (0.35 + 0.65 * ndl) * dapple + skyAtDepth * (0.6 + 0.4 * N.y));
  // silvery scales flash
  vec3 H = normalize(-Lr + V);
  float spec = pow(max(dot(N, H), 0.0), 40.0);
  lit += sunAtDepth * spec * mix(1.2, 0.45, step(0.5, vVariant));

  // The closed lake surface now supplies view-path absorption; no cutaway veil.
  gl_FragColor = vec4(mix(lit, vec3(dot(lit, vec3(0.3, 0.5, 0.2))), uNight * 0.5), 1.0);
}
`;
function buildFishGeometry() {
  const r = [
      [0.5, 0, 0],
      [0.42, 0.07, 0.045],
      [0.28, 0.11, 0.07],
      [0.1, 0.12, 0.072],
      [-0.08, 0.1, 0.06],
      [-0.24, 0.065, 0.04],
      [-0.34, 0.03, 0.018],
    ],
    t = 7,
    e = [],
    i = [],
    s = [],
    n = (f) => (0.5 - f) / 1;
  for (let f = 0; f < r.length; f++) {
    const [u, d, p] = r[f];
    for (let v = 0; v < t; v++) {
      const g = (v / t) * Math.PI * 2,
        x = Math.sin(g) * d * (Math.sin(g) < 0 ? 1.05 : 0.95);
      (e.push(u, x, Math.cos(g) * p), i.push(n(u)));
    }
  }
  for (let f = 0; f < r.length - 1; f++)
    for (let u = 0; u < t; u++) {
      const d = f * t + u,
        p = f * t + ((u + 1) % t),
        v = d + t,
        g = p + t;
      s.push(d, p, v, p, g, v);
    }
  const o = e.length / 3,
    a = [
      [-0.33, 0.02],
      [-0.33, -0.02],
      [-0.52, 0.13],
      [-0.45, 0],
      [-0.52, -0.13],
    ];
  for (const [f, u] of a) (e.push(f, u, 0), i.push(n(f)));
  s.push(o, o + 2, o + 3, o, o + 3, o + 1, o + 1, o + 3, o + 4);
  const l = e.length / 3;
  for (const [f, u] of [
    [0.14, 0.11],
    [-0.05, 0.1],
    [0.02, 0.2],
  ])
    (e.push(f, u, 0), i.push(n(f)));
  s.push(l, l + 1, l + 2);
  const c = e.length / 3;
  for (const f of [1, -1])
    (e.push(0.26, -0.05, 0.06 * f, 0.18, -0.06, 0.07 * f, 0.17, -0.1, 0.13 * f),
      i.push(n(0.26), n(0.18), n(0.17)));
  s.push(c, c + 1, c + 2, c + 3, c + 5, c + 4);
  const h = new ThreeBufferGeometry();
  return (
    h.setAttribute("position", new ThreeFloat32BufferAttribute(e, 3)),
    h.setAttribute("aBody", new ThreeFloat32BufferAttribute(i, 1)),
    h.setIndex(s),
    h.computeVertexNormals(),
    h
  );
}
const rv = new ThreeQuaternion();
const av = new ThreeEuler(0, 0, 0, "YZX");
const lv = new ThreeMatrix4();
const cv = new ThreeVector3();
const Zi = new ThreeVector3();
const SC = new ThreeVector3();
class FishSchool {
  constructor(t, e, i, s) {
    ((this.ctx = t), (this.water = s));
    const n = t.quality.pick(6, 8, 10);
    ((this.geo = buildFishGeometry()),
      (this.aFish = new ThreeInstancedBufferAttribute(
        new Float32Array(n * 4),
        4,
      ).setUsage(ThreeDynamicDrawUsage)),
      this.geo.setAttribute("aFish", this.aFish),
      (this.material = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
          ...e,
        },
        vertexShader: t.GLSL_COMMON + WATER_COMMON_GLSL + FISH_VERTEX_GLSL,
        fragmentShader: t.GLSL_COMMON + WATER_COMMON_GLSL + FISH_FRAGMENT_GLSL,
        side: ThreeDoubleSide,
        transparent: !0,
        blending: ThreeNoBlending,
        depthWrite: !0,
      })),
      (this.mesh = new ThreeInstancedMesh(this.geo, this.material, n)),
      (this.mesh.renderOrder = 1.02),
      (this.mesh.frustumCulled = !1),
      (this.mesh.name = "water:fish"),
      i.add(this.mesh));
    const o = createWaterRandom(515);
    ((this.rand = o), (this.fish = []));
    for (let a = 0; a < n; a++) {
      const l = o() * Math.PI * 2,
        c = LAKE_SHAPE.cx + Math.cos(l) * 0.6,
        h = LAKE_SHAPE.cz + 0.5 + Math.sin(l) * 0.4;
      this.fish.push({
        p: new ThreeVector3(c, -0.2, h),
        v: new ThreeVector3(
          Math.cos(l + 1.6) * 0.2,
          0,
          Math.sin(l + 1.6) * 0.2,
        ),
        phase: o() * 10,
        size: 0.15 + o() * 0.07,
        variant: a % 3 === 1 ? 1 : 0,
        flee: new ThreeVector3(),
        fear: 0,
        rise: 0,
        wander: o() * 100,
      });
    }
    ((this.goal = new ThreeVector3(LAKE_SHAPE.cx, -0.25, 3.4)),
      (this.goalTimer = 0),
      (this.riseTimer = 4 + o() * 6));
  }
  scare(t, e, i = 1) {
    for (const s of this.fish) {
      const n = s.p.x - t,
        o = s.p.z - e,
        a = Math.hypot(n, o),
        l = i * Math.max(0, 1 - a / 1.4);
      l <= 0 ||
        (s.flee.set(n / (a || 1), -0.6, o / (a || 1)).multiplyScalar(l),
        (s.fear = Math.max(s.fear, l)),
        (s.rise = 0));
    }
  }
  _depthRange(t, e, i) {
    const s = this.ctx.terrain.height(t, e);
    return ((i.x = s + 0.07), (i.y = this.water.level - 0.06), i);
  }
  update(t) {
    if (t <= 0) return;
    const { world: e } = this.ctx,
      i = this.water,
      s = this.rand,
      n = i.ice,
      o =
        (1 - e.night * 0.4) *
        (1 - n * 0.55) *
        (0.6 + 0.4 * e.seasonal.activity);
    if (((this.goalTimer -= t), this.goalTimer <= 0)) {
      this.goalTimer = 4 + s() * 6;
      const l = s() < 0.65,
        c = LAKE_SHAPE.cx + (s() - 0.5) * (l ? 2.2 : 2.6),
        h = l ? 3.3 + s() * 0.45 : LAKE_SHAPE.cz - 0.4 + s() * 1.2;
      this.goal.set(c, 0, h);
    }
    if (
      ((this.riseTimer -= t),
      this.riseTimer <= 0 && ((this.riseTimer = 5 + s() * 9), n < 0.3))
    ) {
      const l = this.fish[Math.floor(s() * this.fish.length)];
      l.fear < 0.1 && (l.rise = 1);
    }
    const a = SC;
    for (let l = 0; l < this.fish.length; l++) {
      const c = this.fish[l];
      Zi.set(0, 0, 0);
      let h = 0,
        f = 0,
        u = 0,
        d = 0,
        p = 0,
        v = 0;
      for (let R = 0; R < this.fish.length; R++) {
        if (l === R) continue;
        const z = this.fish[R],
          L = z.p.x - c.p.x,
          k = z.p.y - c.p.y,
          U = z.p.z - c.p.z,
          F = L * L + k * k + U * U;
        if (
          !(F > 0.5) &&
          (v++,
          (h += L),
          (f += k),
          (u += U),
          (d += z.v.x),
          (p += z.v.z),
          F < 0.02)
        ) {
          const G = 1 / (Math.sqrt(F) + 0.02);
          ((Zi.x -= L * G * 0.9), (Zi.y -= k * G * 0.3), (Zi.z -= U * G * 0.9));
        }
      }
      (v &&
        ((Zi.x += (h / v) * 0.6),
        (Zi.y += (f / v) * 0.3),
        (Zi.z += (u / v) * 0.6),
        (Zi.x += (d / v - c.v.x) * 0.8),
        (Zi.z += (p / v - c.v.z) * 0.8)),
        (c.wander += t * 0.35),
        (Zi.x +=
          (this.goal.x - c.p.x) * 0.12 + Math.sin(c.wander * 1.7 + l) * 0.25),
        (Zi.z +=
          (this.goal.z - c.p.z) * 0.12 +
          Math.cos(c.wander * 1.3 + l * 2.1) * 0.25),
        this._depthRange(c.p.x, c.p.z, a));
      const g = a.x,
        x = a.y;
      let m = g + (x - g) * (0.45 + 0.25 * Math.sin(c.wander + l));
      (n > 0.2 && (m = g + (x - g) * 0.15),
        c.rise === 1 && (m = i.level - 0.015),
        (Zi.y += (m - c.p.y) * (c.rise === 1 ? 3 : 1.2)));
      const w = c.p.x + c.v.x * 0.5,
        y = c.p.z + c.v.z * 0.5;
      ((i.level - this.ctx.terrain.height(w, y) < 0.22 ||
        y > LAKE_FRONT_Z - 0.1) &&
        ((Zi.x += (LAKE_SHAPE.cx - c.p.x) * 1.6),
        (Zi.z += (LAKE_SHAPE.cz + 0.4 - c.p.z) * 1.6)),
        c.fear > 0.01 &&
          (Zi.addScaledVector(c.flee, 6 * c.fear),
          (c.fear *= Math.exp(-t * 1.1))),
        c.v.addScaledVector(Zi, t));
      const M = (0.2 + 0.08 * Math.sin(c.wander * 0.7 + l)) * o,
        A = M + c.fear * 1.3 + (c.rise === 1 ? 0.15 : 0),
        b = c.v.length();
      (b > A && c.v.multiplyScalar(A / b),
        b < M * 0.5 && c.v.multiplyScalar((M * 0.5) / (b || 1)),
        (c.v.y = Math.max(-0.5, Math.min(0.5, c.v.y))),
        c.p.addScaledVector(c.v, t),
        this._depthRange(c.p.x, c.p.z, a),
        a.y < a.x &&
          ((c.p.x += (LAKE_SHAPE.cx - c.p.x) * t * 2),
          (c.p.z += (LAKE_SHAPE.cz - c.p.z) * t * 2)),
        (c.p.y = Math.max(
          a.x,
          Math.min(a.y + (c.rise === 1 ? 0.05 : 0), c.p.y),
        )),
        (c.p.z = Math.min(LAKE_FRONT_Z - 0.05, c.p.z)),
        c.rise === 1 &&
          c.p.y > i.level - 0.03 &&
          (i.ripples?.add(c.p.x, c.p.z, 0.03, -1),
          (c.rise = 0),
          (c.v.y = -0.3)));
      const S = c.v.length();
      ((c.phase += t * (5 + S * 26)),
        this.aFish.setXYZW(
          l,
          c.phase,
          0.035 + Math.min(0.05, S * 0.08),
          c.variant,
          c.size,
        ));
      const E = Math.atan2(-c.v.z, c.v.x),
        T = Math.asin(Math.max(-0.6, Math.min(0.6, c.v.y / (S || 1)))) * 0.8;
      (av.set(0, E, T, "YZX"),
        rv.setFromEuler(av),
        cv.setScalar(c.size),
        lv.compose(c.p, rv, cv),
        this.mesh.setMatrixAt(l, lv));
    }
    ((this.mesh.instanceMatrix.needsUpdate = !0),
      (this.aFish.needsUpdate = !0));
  }
}
export { FishSchool };
