// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeDynamicDrawUsage,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreePlaneGeometry,
  ThreeShaderMaterial,
} from "../vendor/three-runtime.js";
import { createSeededRandom } from "../core/math.js";
const FOG_PUFF_VERTEX_SHADER = `
attribute vec4 aPuff;    // xyz centre, w size
attribute vec4 aPuff2;   // x opacity, y seed, z age 0..1, w flatten
varying vec2 vUv;
varying vec4 vData;
varying vec3 vWorld;
void main() {
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float a = aPuff2.y * 6.2831 + aPuff2.z * (aPuff2.y - 0.5) * 1.5;   // slow roll
  vec2 c = vec2(cos(a), sin(a));
  vec2 v = vec2(position.x * c.x - position.y * c.y, position.x * c.y + position.y * c.x);
  vec3 wp = aPuff.xyz + (right * v.x + up * v.y * aPuff2.w) * aPuff.w;
  vWorld = wp;
  vUv = position.xy + 0.5;
  vData = aPuff2;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
}
`;
const FOG_PUFF_FRAGMENT_SHADER = `
uniform vec4 uLook;   // same as the volume: x extinction, y sun gain, z ambient gain, w night gain
varying vec2 vUv;
varying vec4 vData;
varying vec3 vWorld;
float puffHG(float c, float g) { float g2 = g * g; return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * c, 1.5); }
void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  if (r > 1.0) discard;
  float seed = vData.y * 37.0;
  float age = vData.z;
  // cauliflower edge: noise-eroded disc that frays as it ages
  float n = wgFbm(p * 1.6 + vec2(seed, seed * 0.7) + vec2(0.0, -age * 0.8));
  float shape = smoothstep(1.0, 0.25, r + (n - 0.5) * (0.7 + age * 0.6));
  float a = shape * shape * vData.x;
  // don't cut hard into the ground / water
  vec4 ter = terrainAt(vWorld.xz);
  float floorY = max(ter.x, uWaterLevel);
  a *= smoothstep(0.0, 0.1, vWorld.y - floorY);
  if (a < 0.004) discard;
  vec3 rd = normalize(vWorld - cameraPosition);
  float cosT = dot(rd, uLightDir);
  float phase = mix(puffHG(cosT, -0.15), puffHG(cosT, 0.62), 0.5);
  float core = 1.0 - shape * 0.35;   // thicker middle is a little shadowed
  vec3 Lin = uLightColor * uLook.y * phase * (1.0 + uNight * uLook.w) * (0.55 + 0.45 * core)
           + mix(uGroundColor * 1.3, uSkyColor, 0.55 + 0.45 * p.y) * uLook.z * (1.0 + uNight * 0.8)
           + vec3(0.8, 0.85, 1.0) * uFlash * 1.2;
  vec3 c = applyHaze(Lin * vec3(0.93, 0.94, 0.96), length(vWorld - cameraPosition), vWorld.y);
  gl_FragColor = vec4(c * a, a);
}
`;
class FogPuffs {
  constructor(t, e, i) {
    ((this.ctx = t), (this.max = e), (this.free = []));
    for (let o = 0; o < e; o++)
      this.free.push({
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        age: 0,
        life: 1,
        size: 0.3,
        grow: 0.5,
        seed: 0,
        alpha: 0.5,
        lift: 0.2,
      });
    ((this.live = []),
      (this.rand = createSeededRandom(985493)),
      (this._w = {
        x: 0,
        z: 0,
      }));
    const s = new ThreePlaneGeometry(1, 1),
      n = new ThreeInstancedBufferGeometry();
    ((n.index = s.index),
      n.setAttribute("position", s.getAttribute("position")),
      (this.a1 = new ThreeInstancedBufferAttribute(
        new Float32Array(e * 4),
        4,
      ).setUsage(ThreeDynamicDrawUsage)),
      (this.a2 = new ThreeInstancedBufferAttribute(
        new Float32Array(e * 4),
        4,
      ).setUsage(ThreeDynamicDrawUsage)),
      n.setAttribute("aPuff", this.a1),
      n.setAttribute("aPuff2", this.a2),
      (n.instanceCount = 0),
      (this.geo = n),
      (this.material = new ThreeShaderMaterial({
        uniforms: {
          ...t.uniforms,
          uLook: i,
        },
        vertexShader: t.GLSL_COMMON + FOG_PUFF_VERTEX_SHADER,
        fragmentShader: t.GLSL_COMMON + FOG_PUFF_FRAGMENT_SHADER,
        transparent: !0,
        premultipliedAlpha: !0,
        depthWrite: !1,
      })),
      (this.mesh = new ThreeMesh(n, this.material)),
      (this.mesh.name = "fog-puffs"),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 5),
      (this.mesh.visible = !1),
      t.scene.add(this.mesh));
  }
  emit(t, e, i, s, n, o, a) {
    const l = this.free.pop() || this.live.shift(),
      c = this.rand;
    ((l.x = t),
      (l.y = e),
      (l.z = i),
      (l.vx = s * o),
      (l.vz = n * o),
      (l.vy = 0.15 + c() * 0.25),
      (l.age = 0),
      (l.life = 1.3 + c() * 1.1),
      (l.size = a * (0.55 + c() * 0.35)),
      (l.grow = a * (1.1 + c() * 0.8)),
      (l.seed = c()),
      (l.alpha = 0.32 + c() * 0.22),
      (l.lift = 0.12 + c() * 0.2),
      this.live.push(l));
  }
  update(t) {
    const { live: e } = this,
      i = this.ctx.terrain,
      s = this.ctx.wind,
      n = this._w,
      o = Math.exp(-t * 1.6);
    let a = 0;
    for (let h = 0; h < e.length; h++) {
      const f = e[h];
      if (((f.age += t / f.life), f.age >= 1)) {
        this.free.push(f);
        continue;
      }
      (s.sample(f.x, f.z, n, 0),
        (f.vx = f.vx * o + n.x * (1 - o) * 0.8),
        (f.vz = f.vz * o + n.z * (1 - o) * 0.8),
        (f.x += f.vx * t),
        (f.z += f.vz * t));
      const d =
        Math.max(i.height(f.x, f.z), this.ctx.world.lakeLevel) +
        f.lift * (1 - f.age * 0.6);
      ((f.vy += ((d - f.y) * 3 - f.vy * 1.8) * t),
        (f.y += f.vy * t),
        (e[a++] = f));
    }
    e.length = a;
    const l = this.a1.array,
      c = this.a2.array;
    for (let h = 0; h < a; h++) {
      const f = e[h],
        u = h * 4,
        d = f.age;
      ((l[u] = f.x),
        (l[u + 1] = f.y),
        (l[u + 2] = f.z),
        (l[u + 3] = f.size + f.grow * (1 - (1 - d) * (1 - d))),
        (c[u] = f.alpha * Math.min(1, d * 9) * (1 - d) * (1 - d)),
        (c[u + 1] = f.seed),
        (c[u + 2] = d),
        (c[u + 3] = 0.62));
    }
    ((this.geo.instanceCount = a),
      (this.mesh.visible = a > 0),
      a > 0 && ((this.a1.needsUpdate = !0), (this.a2.needsUpdate = !0)));
  }
  clear() {
    for (const t of this.live) this.free.push(t);
    ((this.live.length = 0),
      (this.geo.instanceCount = 0),
      (this.mesh.visible = !1));
  }
}
export { FogPuffs };
