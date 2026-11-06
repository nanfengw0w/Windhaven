// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAddEquation,
  ThreeBackSide,
  ThreeBoxGeometry,
  ThreeColor,
  ThreeCustomBlending,
  ThreeFrontSide,
  ThreeMesh,
  ThreeOneFactor,
  ThreeOneMinusSrcAlphaFactor,
  ThreeVector3,
  ThreeVector4,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
import { clamp, damp, smoothstep } from "../core/math.js";
import { SCENE_DEPTH_GLSL, sceneDepthUniforms } from "../render/scene-depth.js";
import {
  SKY_SHADOW_GLSL,
  bindSkyShadowMaterial,
  createSkyShadowMaterialPair,
  setSkyVolumeRenderSides,
} from "./atmosphere.js";
// Retain the same rain-cell capacity per unit area as the original landscape.
const MAX_RAINBOW_CELLS = Math.ceil(
  (6 * LANDSCAPE_BOUNDS.halfW * LANDSCAPE_BOUNDS.halfD) /
    (TERRARIUM_BOUNDS.halfW * TERRARIUM_BOUNDS.halfD),
);
const RAINBOW_VERTEX_GLSL = `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
const RAINBOW_FRAGMENT_GLSL = `
#define MAX_CELLS ${MAX_RAINBOW_CELLS}
uniform vec3 uBoxMin;
uniform vec3 uBoxMax;
uniform vec3 uAnti;              // anti-solar direction
uniform vec4 uCells[MAX_CELLS];  // x, z, radius, strength
uniform float uCellTop[MAX_CELLS];
uniform float uMist;             // droplets everywhere (heavy rain)
uniform float uAmount;
uniform vec3 uTint;              // sunlight colour × brightness
varying vec3 vWorld;

float surfaceAt(vec2 xz) {
  vec4 t = terrainAt(xz);
  return t.z > 0.35 ? max(t.x, uWaterLevel) : t.x;
}
// Zucconi's spectral fit: w 0 = violet (400 nm) … 1 = red (700 nm)
vec3 bump3(vec3 x) { return max(1.0 - x * x, 0.0); }
vec3 spectral(float w) {
  vec3 cs = vec3(3.54541723, 2.86670055, 2.29421995);
  vec3 xs = vec3(0.69548916, 0.49416934, 0.28269708);
  vec3 ys = vec3(0.02320775, 0.15936245, 0.53520021);
  return max(bump3(cs * (w - xs)) - ys, 0.0);
}

void main() {
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vWorld - ro);
  float cosA = dot(rd, uAnti);
  // bow annulus only (≈36°…56° from the anti-solar point)
  if (cosA > 0.809 || cosA < 0.559) discard;
  float th = degrees(acos(cosA));

  vec3 inv = 1.0 / rd;
  vec3 ta = (uBoxMin - ro) * inv, tb = (uBoxMax - ro) * inv;
  vec3 lo = min(ta, tb), hi = max(ta, tb);
  float tn = max(max(lo.x, lo.y), max(lo.z, 0.0));
  float tf = min(min(hi.x, hi.y), hi.z);
  if (tf <= tn) discard;
  vec3 p0 = ro + rd * tn;
  float hPrev = p0.y - surfaceAt(p0.xz);
  if (hPrev < 0.0) discard;
  // where the ray meets the landscape (coarse march + linear refine)
  float tEnd = tf;
  float dt = (tf - tn) / 10.0;
  for (int i = 1; i <= 10; i++) {
    float t = tn + dt * float(i);
    vec3 p = ro + rd * t;
    float h = p.y - surfaceAt(p.xz);
    if (h < 0.0) { tEnd = t - dt * (-h) / max(hPrev - h, 1e-4); break; }
    hPrev = h;
  }
  // Retain the terrain search grid, then clip rain coverage at the visible opaque surface.
  tEnd = min(tEnd, opaqueSceneDistance(gl_FragCoord.xy));
  if (tEnd <= tn) discard;

  // sunlit rain along the ray
  float cov = 0.0;
  vec2 d2 = rd.xz;
  float dd = max(dot(d2, d2), 1e-5);
  for (int i = 0; i < MAX_CELLS; i++) {
    vec4 c = uCells[i];
    if (c.w <= 0.001) continue;
    float ts = clamp(dot(c.xy - ro.xz, d2) / dd, tn, tEnd);
    vec3 p = ro + rd * ts;
    float dist = length(p.xz - c.xy);
    float w = 1.0 - smoothstep(c.z * 0.4, c.z * 1.1, dist);
    float g = surfaceAt(p.xz);
    w *= smoothstep(g, g + 0.3, p.y) * (1.0 - smoothstep(uCellTop[i] - 0.7, uCellTop[i], p.y));
    if (w > 0.001) cov += w * c.w * skyShadow(p, 0.002);
  }
  cov += uMist * clamp((tEnd - tn) * 0.1, 0.0, 1.0);
  cov = clamp(cov, 0.0, 1.0);
  if (cov < 0.002) discard;

  // primary bow: violet 40.0° → red 42.6°
  float wP = (th - 40.0) / 2.6;
  vec3 prim = spectral(wP) * 1.15;
  // supernumerary fringes just inside the primary
  float inside = 40.0 - th;
  float sn = 0.5 + 0.5 * cos(inside / 0.75 * 6.2831);
  vec3 sup = mix(vec3(0.35, 0.9, 0.55), vec3(1.0, 0.55, 0.85), sn) * 0.11 * smoothstep(0.0, 0.3, inside) * exp(-max(inside, 0.0) * 0.9);
  // brighter sky inside the bow
  vec3 fill = vec3(0.07) * smoothstep(36.0, 39.6, th) * (1.0 - smoothstep(39.6, 40.4, th));
  // secondary bow (reversed, fainter): red 50.2° → violet 53.8°
  float wS = 1.0 - (th - 50.2) / 3.6;
  vec3 sec = spectral(wS) * 0.36;
  // Alexander's dark band between the bows
  float dark = smoothstep(42.4, 43.4, th) * (1.0 - smoothstep(49.4, 50.4, th)) * 0.07;

  vec3 col = (prim + sup + fill + sec) * uTint;
  float k = cov * uAmount;
  gl_FragColor = vec4(col * k, dark * k);
}
`;
class RainbowEffect {
  constructor(t, e) {
    this.ctx = t;
    const i = new ThreeVector3(
        -LANDSCAPE_BOUNDS.halfW + 0.03,
        LANDSCAPE_BOUNDS.bottomY + 0.03,
        -LANDSCAPE_BOUNDS.halfD + 0.03,
      ),
      s = new ThreeVector3(
        LANDSCAPE_BOUNDS.halfW - 0.03,
        LANDSCAPE_BOUNDS.topY - 0.03,
        LANDSCAPE_BOUNDS.halfD - 0.03,
      );
    ((this.min = i), (this.max = s));
    const n = [];
    for (let a = 0; a < MAX_RAINBOW_CELLS; a++) n.push(new ThreeVector4());
    ((this.pair = createSkyShadowMaterialPair(t, {
      name: "sky-rainbow",
      uniforms: {
        ...t.uniforms,
        ...sceneDepthUniforms,
        uBoxMin: {
          value: i,
        },
        uBoxMax: {
          value: s,
        },
        uAnti: {
          value: new ThreeVector3(0, -1, 0),
        },
        uCells: {
          value: n,
        },
        uCellTop: {
          value: new Float32Array(MAX_RAINBOW_CELLS),
        },
        uMist: {
          value: 0,
        },
        uAmount: {
          value: 0,
        },
        uTint: {
          value: new ThreeColor(),
        },
      },
      vertexShader: RAINBOW_VERTEX_GLSL,
      fragmentShader:
        t.GLSL_COMMON +
        SCENE_DEPTH_GLSL +
        SKY_SHADOW_GLSL +
        RAINBOW_FRAGMENT_GLSL,
      transparent: !0,
      depthWrite: !1,
      blending: ThreeCustomBlending,
      blendEquation: ThreeAddEquation,
      blendSrc: ThreeOneFactor,
      blendDst: ThreeOneMinusSrcAlphaFactor,
      blendSrcAlpha: ThreeZeroFactor,
      blendDstAlpha: ThreeOneFactor,
    })),
      (this.material = this.pair.unlit));
    const o = new ThreeVector3().subVectors(s, i);
    ((this.mesh = new ThreeMesh(
      new ThreeBoxGeometry(o.x, o.y, o.z),
      this.material,
    )),
      this.mesh.position.addVectors(i, s).multiplyScalar(0.5),
      (this.mesh.name = "sky-rainbow"),
      (this.mesh.renderOrder = 8.5),
      (this.mesh.frustumCulled = !1),
      (this.mesh.visible = !1),
      (this.mesh.userData.noReflect = !0),
      e.add(this.mesh),
      (this.cells = []),
      (this.amount = 0),
      (this.rainTime = 0),
      (this.lastCelebrate = -1e9),
      (this._shown = !1));
  }
  track(t) {
    const { world: e, terrain: i, precip: s } = this.ctx,
      n = this.cells;
    for (const o of n) o.seen = !1;
    for (const o of s.sources) {
      const a =
        o.rate * (1 - e.snowFractionAt(Math.max(0, i.height(o.x, o.z))));
      if (a < 0.03) continue;
      let l = null;
      for (const c of n)
        if (c.id === o.cloudId) {
          l = c;
          break;
        }
      if (!l) {
        if (n.length >= MAX_RAINBOW_CELLS) {
          let c = 0;
          for (let h = 1; h < n.length; h++)
            n[h].strength < n[c].strength && (c = h);
          if (n[c].strength > a) continue;
          n.splice(c, 1);
        }
        ((l = {
          id: o.cloudId,
          x: o.x,
          z: o.z,
          r: o.radius,
          top: o.y,
          strength: 0,
          seen: !0,
        }),
          n.push(l));
      }
      ((l.seen = !0),
        (l.x = o.x),
        (l.z = o.z),
        (l.top = o.y),
        (l.r = damp(l.r, o.radius, 4, t)),
        (l.strength = damp(l.strength, clamp(a, 0, 1.2), 2.5, t)));
    }
    for (let o = n.length - 1; o >= 0; o--) {
      const a = n[o];
      (a.seen || (a.strength *= Math.exp(-t / 2.5)),
        a.strength < 0.01 && n.splice(o, 1));
    }
  }
  update(t) {
    const { world: e, camera: i } = this.ctx;
    this.track(t);
    const s = e.sunElevation,
      n = smoothstep(0.02, 0.08, s) * (1 - smoothstep(0.64, 0.8, s)),
      o = clamp(e.cloudCover * 0.5 + e.storminess * 0.7, 0, 1),
      a = n * (1 - o * 0.6) * smoothstep(0.1, 0.6, e.lightIntensity);
    let l = 0;
    for (const m of this.cells) l += m.strength;
    const c = l > 0.2 && a > 0.05;
    this.rainTime = c
      ? this.rainTime + t
      : Math.max(0, this.rainTime - t * 0.5);
    const h = this.rainTime > 1 ? a : 0,
      f = h > this.amount ? 0.33 : 0.24;
    this.amount += clamp(h - this.amount, -f * t, f * t);
    const u = this.amount > 0.002;
    if (((this.mesh.visible = u), !u)) return;
    const d = this.pair.lit.uniforms;
    ((d.uAmount.value = this.amount * this.amount * (3 - 2 * this.amount)),
      d.uAnti.value.copy(e.sunDir).negate());
    const p = e.lightColor,
      v = Math.max(0.2, p.r * 0.3 + p.g * 0.55 + p.b * 0.15);
    (d.uTint.value.setRGB(p.r / v, p.g / v, p.b / v).multiplyScalar(0.55),
      (d.uMist.value = clamp((e.rainfall - 0.3) * 0.25, 0, 0.3)));
    for (let m = 0; m < MAX_RAINBOW_CELLS; m++) {
      const w = this.cells[m];
      w
        ? (d.uCells.value[m].set(w.x, w.z, w.r, w.strength),
          (d.uCellTop.value[m] = w.top))
        : d.uCells.value[m].set(0, 0, 1, 0);
    }
    bindSkyShadowMaterial(this.ctx, this.mesh, this.pair);
    const g = i.position,
      x =
        g.x > this.min.x &&
        g.x < this.max.x &&
        g.y > this.min.y &&
        g.y < this.max.y &&
        g.z > this.min.z &&
        g.z < this.max.z;
    setSkyVolumeRenderSides(this.pair, x ? ThreeBackSide : ThreeFrontSide, !x);
  }
  celebrate(t) {
    const e = this.amount > 0.45 ? !0 : this.amount < 0.2 ? !1 : this._shown,
      i = e && !this._shown && t - this.lastCelebrate > 40;
    return ((this._shown = e), i && (this.lastCelebrate = t), i);
  }
  syncPhotoCamera() {
    if (!this.mesh.visible) return;
    bindSkyShadowMaterial(this.ctx, this.mesh, this.pair);
    const camera = this.ctx.camera.position;
    const inside =
      camera.x > this.min.x &&
      camera.x < this.max.x &&
      camera.y > this.min.y &&
      camera.y < this.max.y &&
      camera.z > this.min.z &&
      camera.z < this.max.z;
    setSkyVolumeRenderSides(
      this.pair,
      inside ? ThreeBackSide : ThreeFrontSide,
      !inside,
    );
  }
}
export { RainbowEffect };
