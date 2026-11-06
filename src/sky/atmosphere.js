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
  ThreeShaderMaterial,
  ThreeVector2,
  ThreeVector3,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
import { clamp, lerp } from "../core/math.js";
import { SCENE_DEPTH_GLSL, sceneDepthUniforms } from "../render/scene-depth.js";
const SKY_SHADOW_GLSL = `
uniform sampler2DShadow uShadowMap;
uniform mat4 uShadowMatrix;
/** 1 = lit by the key light, 0 = in shadow (outside the shadow frustum counts as lit). */
float skyShadow(vec3 p, float bias) {
#ifdef SKY_NO_SHADOW
  return 1.0;
#else
  vec4 sc = uShadowMatrix * vec4(p, 1.0);
  vec3 c = sc.xyz / sc.w;
  if (c.x <= 0.0 || c.x >= 1.0 || c.y <= 0.0 || c.y >= 1.0 || c.z >= 1.0) return 1.0;
  return texture(uShadowMap, vec3(c.xy, c.z - bias));
#endif
}
`;
function createSkyShadowMaterialPair(r, t) {
  ((t.uniforms.uShadowMap = {
    value: null,
  }),
    (t.uniforms.uShadowMatrix = {
      value: r.lights.key.shadow.matrix,
    }));
  const e = new ThreeShaderMaterial({
      ...t,
      defines: {
        ...(t.defines || {}),
      },
    }),
    i = new ThreeShaderMaterial({
      ...t,
      defines: {
        ...(t.defines || {}),
        SKY_NO_SHADOW: 1,
      },
    });
  return (
    (e.uniforms = i.uniforms = t.uniforms),
    {
      lit: e,
      unlit: i,
    }
  );
}
function bindSkyShadowMaterial(r, t, e) {
  const i = r.lights.key,
    s = i.shadow.map?.depthTexture ?? null,
    n = s && i.castShadow,
    o = e.lit.uniforms;
  return (
    (o.uShadowMatrix.value = i.shadow.matrix),
    n
      ? ((o.uShadowMap.value = s), (t.material = e.lit))
      : ((o.uShadowMap.value = null), (t.material = e.unlit)),
    n ? 1 : 0
  );
}
function setSkyVolumeRenderSides(r, t, e) {
  for (const i of [r.lit, r.unlit]) ((i.side = t), (i.depthTest = e));
}
const ATMOSPHERE_BOX_INSET = 0.02;
const $f = new ThreeVector3();
const ATMOSPHERE_VERTEX_GLSL = `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
const ATMOSPHERE_FRAGMENT_GLSL = `
uniform vec3 uBoxMin;
uniform vec3 uBoxMax;
uniform float uDensity;      // extinction per unit at valley level
uniform vec3 uAmbient;       // isotropic in-scatter radiance (sky + haze)
uniform vec3 uScatter;       // key light × scattering albedo
uniform vec3 uFlashPos;
uniform float uShafts;       // 0..1 how much the shadow map modulates the key-light term
uniform vec2 uFocusXZ;       // camera target (the diorama's focal point)
uniform vec2 uFwdXZ;         // horizontal camera forward (length = cos pitch)
varying vec3 vWorld;

float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }

/** Height of the first opaque-ish surface below xz: landscape, or the lake surface. */
float surfaceAt(vec2 xz) {
  vec4 t = terrainAt(xz);
  return t.z > 0.35 ? max(t.x, uWaterLevel) : t.x;
}

/** Henyey–Greenstein, normalised so that isotropic = 1. */
float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / pow(max(1.0 + g2 - 2.0 * g * c, 1e-4), 1.5);
}

void main() {
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vWorld - ro);
  vec3 inv = 1.0 / rd;
  vec3 ta = (uBoxMin - ro) * inv, tb = (uBoxMax - ro) * inv;
  vec3 lo = min(ta, tb), hi = max(ta, tb);
  float tn = max(max(lo.x, lo.y), max(lo.z, 0.0));
  float tf = min(min(hi.x, hi.y), hi.z);
  float tEnd = min(tf, opaqueSceneDistance(gl_FragCoord.xy));
  if (tEnd <= tn + 1e-3) discard;
  vec3 p0 = ro + rd * tn;
  float hPrev = p0.y - surfaceAt(p0.xz);
  if (hPrev < 0.0) discard; // entering below ground: the soil / lake cross-section stays crisp

  float dt = (tf - tn) / float(ATMO_STEPS);
  float jit = ign(gl_FragCoord.xy);
  float cosL = dot(rd, uLightDir);
  float phase = mix(hg(cosL, 0.2), hg(cosL, 0.75), 0.12);
  vec3 keyS = uScatter * phase;
  vec3 flashC = vec3(0.8, 0.85, 1.0) * uFlash;

  float T = 1.0;
  vec3 L = vec3(0.0);
  float t = tn;
  for (int i = 0; i < ATMO_STEPS; i++) {
    // Keep the original sample spacing; only shorten the segment at an opaque surface.
    float stepLength = min(dt, tEnd - t);
    float tNext = min(t + dt, tEnd);
    vec3 pn = ro + rd * tNext;
    float hn = pn.y - surfaceAt(pn.xz);
    bool hit = hn < 0.0;
    float seg = hit ? stepLength * hPrev / max(hPrev - hn, 1e-4) : stepLength;
    vec3 ps = ro + rd * (t + seg * jit);
    // denser, slightly moister air in the valley; and art-directed aerial perspective: the air
    // thickens with depth past the focal point, so the far mountains recede while the
    // foreground stays crisp (a shallow camera sees the whole box through the front glass)
    float depth = dot(ps.xz - uFocusXZ, uFwdXZ);
    float dens = uDensity * (0.45 + 0.9 * exp(-max(ps.y, 0.0) * 0.6)) * mix(0.06, 1.5, smoothstep(-3.0, 6.0, depth));
    float vis = mix(1.0, skyShadow(ps, 0.0015), uShafts);
    vec3 fp = ps - uFlashPos;
    vec3 src = uAmbient + keyS * vis + flashC * (0.7 + 3.5 / (1.0 + dot(fp, fp) * 0.3));
    float ext = exp(-dens * seg);
    L += T * (1.0 - ext) * src;
    T *= ext;
    if (hit || tNext >= tEnd) break;
    t = tNext;
    hPrev = hn;
  }
  gl_FragColor = vec4(L, 1.0 - T);
}
`;
class SkyAtmosphere {
  constructor(t, e) {
    this.ctx = t;
    const i = t.quality.pick(5, 8, 12),
      s = new ThreeVector3(
        -LANDSCAPE_BOUNDS.halfW + ATMOSPHERE_BOX_INSET,
        TERRARIUM_BOUNDS.bottomY + ATMOSPHERE_BOX_INSET,
        -LANDSCAPE_BOUNDS.halfD + ATMOSPHERE_BOX_INSET,
      ),
      n = new ThreeVector3(
        LANDSCAPE_BOUNDS.halfW - ATMOSPHERE_BOX_INSET,
        LANDSCAPE_BOUNDS.topY - ATMOSPHERE_BOX_INSET,
        LANDSCAPE_BOUNDS.halfD - ATMOSPHERE_BOX_INSET,
      );
    ((this.min = s),
      (this.max = n),
      (this.pair = createSkyShadowMaterialPair(t, {
        name: "sky-atmosphere",
        defines: {
          ATMO_STEPS: i,
        },
        uniforms: {
          ...t.uniforms,
          ...sceneDepthUniforms,
          uBoxMin: {
            value: s,
          },
          uBoxMax: {
            value: n,
          },
          uDensity: {
            value: 0.03,
          },
          uAmbient: {
            value: new ThreeColor(),
          },
          uScatter: {
            value: new ThreeColor(),
          },
          uFlashPos: {
            value: new ThreeVector3(0, 6, 0),
          },
          uShafts: {
            value: 0,
          },
          uFocusXZ: {
            value: new ThreeVector2(),
          },
          uFwdXZ: {
            value: new ThreeVector2(0, -1),
          },
        },
        vertexShader: ATMOSPHERE_VERTEX_GLSL,
        fragmentShader:
          t.GLSL_COMMON +
          SCENE_DEPTH_GLSL +
          SKY_SHADOW_GLSL +
          ATMOSPHERE_FRAGMENT_GLSL,
        transparent: !0,
        depthWrite: !1,
        side: ThreeFrontSide,
        blending: ThreeCustomBlending,
        blendEquation: ThreeAddEquation,
        blendSrc: ThreeOneFactor,
        blendDst: ThreeOneMinusSrcAlphaFactor,
        blendSrcAlpha: ThreeZeroFactor,
        blendDstAlpha: ThreeOneFactor,
      })),
      (this.material = this.pair.unlit));
    const o = new ThreeVector3().subVectors(n, s),
      a = new ThreeBoxGeometry(o.x, o.y, o.z);
    ((this.mesh = new ThreeMesh(a, this.material)),
      this.mesh.position.addVectors(s, n).multiplyScalar(0.5),
      (this.mesh.name = "sky-atmosphere"),
      (this.mesh.renderOrder = 2),
      (this.mesh.frustumCulled = !1),
      (this.mesh.userData.noReflect = !0),
      e.add(this.mesh),
      (this.strength = 1));
  }
  update(t) {
    const { world: e, lights: i, camera: s } = this.ctx,
      n = this.pair.lit.uniforms,
      o = s.position,
      a =
        o.x > this.min.x &&
        o.x < this.max.x &&
        o.y > this.min.y &&
        o.y < this.max.y &&
        o.z > this.min.z &&
        o.z < this.max.z;
    setSkyVolumeRenderSides(this.pair, a ? ThreeBackSide : ThreeFrontSide, !a);
    const l = bindSkyShadowMaterial(this.ctx, this.mesh, this.pair);
    n.uShafts.value = l * this.ctx.quality.pick(0.75, 1, 1);
    const c = this.ctx.cameraRig.target;
    (n.uFocusXZ.value.set(c.x, c.z),
      s.getWorldDirection($f),
      n.uFwdXZ.value.set($f.x, $f.z));
    const h = clamp(e.cloudCover * 0.6 + e.storminess * 0.6, 0, 1),
      f = clamp(e.rainfall + e.snowfall * 0.7, 0, 2);
    n.uDensity.value =
      this.strength *
      (0.0085 +
        e.humidity * 0.004 +
        e.storminess * 0.017 +
        f * 0.008 +
        e.fogAmount * 0.016 +
        e.golden * 0.004);
    const u = lerp(0.42, 0.55, e.night) * (1 - h * 0.35) * (1 - e.golden * 0.2);
    n.uAmbient.value.copy(e.hazeColor).multiplyScalar(u);
    const d = lerp(0.03, 0.05, e.golden) * (1 - h * 0.5) * (1 + e.night * 0.4);
    (n.uScatter.value.copy(e.lightColor).multiplyScalar(e.lightIntensity * d),
      e.flash > 0.01 && n.uFlashPos.value.copy(i.flash.position));
  }
}
export {
  SKY_SHADOW_GLSL,
  SkyAtmosphere,
  bindSkyShadowMaterial,
  createSkyShadowMaterialPair,
  setSkyVolumeRenderSides,
};
