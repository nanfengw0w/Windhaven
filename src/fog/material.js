// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBackSide,
  ThreeBufferGeometry,
  ThreeFloat32BufferAttribute,
  ThreeFrontSide,
  ThreeShaderMaterial,
  ThreeSphere,
  ThreeUniformsLib,
  ThreeUniformsUtils,
  ThreeVector3,
  ThreeVector4,
} from "../vendor/three-runtime.js";
import { FIELD_BOUNDS } from "../core/config.js";
import { SCENE_DEPTH_GLSL, sceneDepthUniforms } from "../render/scene-depth.js";
import { FOG_GRID_DEPTH, FOG_GRID_WIDTH } from "./field.js";
const FOG_VOLUME_VERTEX_SHADER = `
uniform sampler2D uFogTex;
uniform float uBottomY;
attribute float aSkirt;
varying vec3 vWorld;
void main() {
  vec3 pos = position;
#ifndef INSIDE
  float lid = texture(uFogTex, fieldUV(pos.xz)).b;
  pos.y = mix(lid, uBottomY, aSkirt);
#endif
  vec4 wp = modelMatrix * vec4(pos, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;
const FOG_VOLUME_FRAGMENT_SHADER = `
precision highp sampler3D;
uniform sampler2D uFogTex;   // RGBA = density, layer top y, proxy top y, billow
uniform sampler3D uFogNoise;
uniform sampler2D uBlueNoise; // 64² tileable blue noise (R)
uniform vec3 uBoxMin;
uniform vec3 uBoxMax;
uniform float uSteam;      // 0..1 steam styling over warm water
uniform float uStep;       // base step length
uniform vec4 uLook;        // x extinction, y sun gain, z ambient gain, w night gain
uniform vec4 uDrift0;      // xyz broad-noise offset (texture space, wind-integrated on the CPU), w steam rise
uniform vec4 uDrift1;      // xyz detail-noise offset
uniform vec4 uBolt;        // xyz lightning light position, w intensity
varying vec3 vWorld;

#if defined( USE_SHADOWMAP ) && defined( SHADOWMAP_TYPE_PCF )
#if NUM_DIR_LIGHT_SHADOWS > 0
#define FOG_SHADOWMAP 1
uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
struct DirectionalLightShadow { float shadowIntensity; float shadowBias; float shadowNormalBias; float shadowRadius; vec2 shadowMapSize; };
uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
#endif
#endif

const vec3 NB = vec3(0.42, 0.9, 0.42);   // broad rolls (one tile ≈ 2.4 units)
const vec3 ND = vec3(0.8, 1.3, 0.8);     // detail wisps (one tile ≈ 1.25 units; finest features ≳ step size)

float fogHG(float c, float g) { float g2 = g * g; return (1.0 - g2) / pow(max(1.0 + g2 - 2.0 * g * c, 1e-3), 1.5); }

/** Key-light shadow map at p (trees, cabin, mountains, the brass frame): 1 lit … 0 shadowed. */
float fogShadowMap(vec3 p) {
#ifdef FOG_SHADOWMAP
  vec4 sc = directionalShadowMatrix[0] * vec4(p, 1.0);
  sc.xyz /= sc.w;
  if (sc.x > 0.0 && sc.x < 1.0 && sc.y > 0.0 && sc.y < 1.0 && sc.z < 1.0) {
    float s = texture(directionalShadowMap[0], vec3(sc.xy, sc.z + directionalLightShadows[0].shadowBias - 0.0012));
    return mix(1.0, s, directionalLightShadows[0].shadowIntensity);
  }
#endif
  return 1.0;
}

void main() {
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vWorld - ro);
  vec3 safe = mix(rd, vec3(1e-5), vec3(lessThan(abs(rd), vec3(1e-5))));
  vec3 ta = (uBoxMin - ro) / safe, tb = (uBoxMax - ro) / safe;
  vec3 tmn = min(ta, tb), tmx = max(ta, tb);
  float tBoxN = max(max(tmn.x, tmn.y), tmn.z);
  float tBoxF = min(min(tmx.x, tmx.y), tmx.z);
#ifdef INSIDE
  float tEntry = max(tBoxN, 0.0);
  float tMax = min(tBoxF, length(vWorld - ro));
#else
  float tEntry = max(length(vWorld - ro), tBoxN);
  float tMax = tBoxF;
#endif
  tMax = min(tMax, opaqueSceneDistance(gl_FragCoord.xy));
  if (tMax <= tEntry) discard;

  // step length adapts to the local layer depth along the ray (fine through thin sheets, coarse
  // through deep banks); budgeted so a thin layer still gets ~8 samples top to bottom
  vec3 pe = ro + rd * tEntry;
  float invY = 1.0 / max(abs(rd.y), 0.22);
  float dsMin = uStep * 0.35, dsMax = uStep * 2.4;

  // lighting constants
  vec3 L = uLightDir;
  float cosT = dot(rd, L);
  float ph0 = mix(fogHG(cosT, -0.2), fogHG(cosT, 0.72), 0.55);   // single scatter: golden glow toward the sun
  float ph1 = mix(fogHG(cosT, -0.1), fogHG(cosT, 0.4), 0.5);
  float ph2 = mix(fogHG(cosT, -0.05), fogHG(cosT, 0.18), 0.5);
  vec3 sunCol = uLightColor * uLook.y * (1.0 + uNight * uLook.w) * mix(vec3(1.0), vec3(1.1, 0.92, 0.76), uGolden);
  float skyLum = dot(uSkyColor, vec3(0.3, 0.5, 0.2));
  vec3 skyCol = mix(uSkyColor, vec3(0.62, 0.68, 1.0) * skyLum * 1.05, 0.45 * uGolden)
              * uLook.z * uAmbientIntensity * (1.0 + uNight * 0.4);
  vec3 bounce = (uGroundColor * 0.9 + uLightColor * (0.04 + 0.08 * uGolden) * vec3(1.0, 0.82, 0.66)) * uLook.z;
  vec3 flashCol = vec3(0.8, 0.85, 1.0) * uFlash * 1.1;
  vec3 boltCol = vec3(0.72, 0.8, 1.0) * uBolt.w * 2.4;
  float vertK = 0.5 / max(L.y, 0.14);   // optical path out through the layer top, per unit depth
  vec3 sT1 = normalize(cross(L, abs(L.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 sT2 = cross(L, sT1);
  float sigma = uLook.x;
  vec3 albedo = vec3(0.95, 0.96, 0.98);

  float T = 1.0;
  vec3 col = vec3(0.0);
  // blue-noise jitter: without temporal accumulation it reads as an even, fine grain (white
  // noise clumps; interleaved-gradient noise prints a diagonal hatch through thin sheets)
  float jit = texelFetch(uBlueNoise, ivec2(gl_FragCoord.xy) & 63, 0).r;
  float t = tEntry;
  float tFirst = -1.0;
  float grow = 1.0;

  for (int i = 0; i < STEPS; i++) {
    if (t >= tMax || T < 0.03) break;
    vec3 p0 = ro + rd * t;
    vec4 f = texture(uFogTex, fieldUV(p0.xz));
    vec4 ter = terrainAt(p0.xz);
    float floorY = max(ter.x, uWaterLevel);              // mist rests on the lake surface (only its basin lies below it)
    float H = f.g - floorY;                              // layer thickness here
    float ds = clamp((max(H, 0.0) + 0.08) * invY * (1.0 / 8.0), dsMin, dsMax) * grow;
    // empty space above the highest possible billow: drop straight to the layer top
    float ceil_ = f.g + 0.6 * clamp(H, 0.08, 1.0) + 0.03;
    if (rd.y < -0.05 && p0.y > ceil_ + ds) {
      t += (p0.y - ceil_) / -rd.y;
      continue;
    }
    // A partial final segment must not sample or accumulate fog behind the opaque surface.
    ds = min(ds, tMax - t);
    vec3 p = ro + rd * (t + ds * jit);                   // jittered sample inside this segment
    t += ds;
    grow *= GROW;
    if (p.y < floorY) break;                             // into the ground / onto the water
#ifndef INSIDE
    if (i > 1 && p.y > f.b + 0.05) break;                // left the lid: another entry takes over
#endif
    float D = f.r;
    if (D > 0.004 && H > 0.0) {
      float h = p.y - floorY;
      float hf = clamp(h / max(H, 0.05), 0.0, 1.0);
      float billow = f.a;
      vec4 nb = texture(uFogNoise, p * NB - uDrift0.xyz);
      vec4 nd = texture(uFogNoise, p * ND - uDrift1.xyz + (nb.gbr - 0.5) * 0.22);

      // billowing, soft top: broad rolls + small curls, livelier where freshly poured
      float amp = clamp(H, 0.08, 1.0) * (0.55 + 0.45 * billow);
      float topN = f.g + ((nb.r - 0.5) * 1.1 + (nd.r - 0.5) * 0.18) * amp;
      float soft = max(0.035, 0.3 * H);
      float prof = smoothstep(topN + 0.015, topN - soft, p.y);
      prof *= mix(1.22, 0.85, hf);                       // settles toward the ground
      prof *= smoothstep(0.0, 0.03, h);                  // no hard seam at the soil

      // erosion: settled fog is silky (perlin), freshly poured fog rolls in rounded puffs
      // (worley); thin mist breaks up into drifting tendrils
      float bodyThick = mix(nb.b * 0.55 + nd.b * 0.45, mix(nb.g, nd.g, 0.35), 0.25 + 0.6 * billow);
      float body = mix(nb.b * 0.78 + nd.b * 0.22, bodyThick, smoothstep(0.12, 0.6, D)); // thin mist: broad, well-sampled tendrils
      float thr = mix(0.62, 0.1, clamp(D * 0.95, 0.0, 1.0));
      float m = smoothstep(thr - 0.17, thr + 0.24, body);
      // inside thick fog the erosion only modulates gently (it is opaque there; strong contrast
      // would just alias into grain at the skin)
      float dens = D * prof * mix(0.15 + 0.95 * m, 0.72 + 0.38 * m, smoothstep(0.35, 1.0, D));

      // steam off warm water: rising, streaky wisps
      float st = uSteam * clamp(ter.z + ter.y * 0.6, 0.0, 1.0) * (1.0 - billow);
      if (st > 0.02) {
        vec4 ns = texture(uFogNoise, vec3(p.x * 1.7, p.y * 0.55 - uDrift0.w, p.z * 1.7) + nb.rgb * 0.25);
        float wisp = smoothstep(0.42, 0.8, ns.a) * exp(-h * 2.4 / max(H, 0.15));
        float sd = D * (0.35 + 1.4 * wisp) * smoothstep(topN + 0.1, topN - soft * 1.5, p.y);
        dens = mix(dens, sd, st);
      }

      if (dens > 0.003) {
        if (tFirst < 0.0) tFirst = t;
        // optical depth toward the light. Near tap: depth under the billowing top one step
        // toward the light → with a low sun the crests catch it and the troughs fall into their
        // shade. Far taps: through the bank (noise-free); while the bank continues toward the
        // light, the path out through the top dominates (grazing sun → a thin, bright skin over
        // a cool body); near a sun-facing edge light pours in from the side instead.
        vec3 lp = p + L * 0.22;
        vec4 lf = texture(uFogTex, fieldUV(lp.xz));
        float lTop = lf.g + ((texture(uFogNoise, lp * NB - uDrift0.xyz).r - 0.5) * 1.1 + (nd.r - 0.5) * 0.18) * amp;
        float lDepth = max(lTop - lp.y, 0.0) * lf.r * 1.5;
        float od = lf.r * 0.22 * smoothstep(lTop + 0.015, lTop - soft, lp.y);
        lp = p + L * 0.5;
        lf = texture(uFogTex, fieldUV(lp.xz));
        float bank = lf.r * smoothstep(lf.g + 0.03, lf.g - 0.35 * max(lf.g - floorY, 0.1), lp.y);
        od += bank * 0.34;
#if TAPS > 2
        lp = p + L * 1.1;
        lf = texture(uFogTex, fieldUV(lp.xz));
        bank = max(bank * 0.5, lf.r * smoothstep(lf.g + 0.03, lf.g - 0.35 * max(lf.g - floorY, 0.1), lp.y));
        od += bank * 0.6;
#endif
        float inBank = clamp(bank / max(D, 0.05), 0.0, 1.0);
        od = (od + inBank * lDepth * vertK) * sigma;
        float depth = max(topN - p.y, 0.0);

        // shadow-map visibility × cloud shadows. Two taps on a rotating diameter across the light
        // direction: soft penumbrae, thin occluders (the brass posts) fade to faint bands while
        // tree crowns and the mountains still carve clear shafts
        float ang = jit * 6.2832 + float(i) * 2.39996;
        vec3 so = (sT1 * cos(ang) + sT2 * sin(ang)) * 0.09;    // antithetic pair: always straddles a thin sheet
        vec3 sp = p + L * 0.03;
        float vis = 0.5 * (fogShadowMap(sp + so) + fogShadowMap(sp - so)) * cloudShadowAt(p);
        // multiple-scattering octaves keep the deep body luminous instead of muddy grey, and
        // partly fill the shadow volumes (light diffusing in from the sides)
        float lum = vis * (exp(-od) * ph0 + 0.5 * exp(-od * 0.3) * ph1) + mix(vis, 1.0, 0.45) * 0.25 * exp(-od * 0.1) * ph2;

        float expo = exp(-depth * D * 2.4);              // how much open sky this sample still sees
        vec3 amb = mix(bounce, skyCol, 0.3 + 0.7 * hf) * (0.4 + 0.6 * expo);
        vec3 Lin = sunCol * lum + amb + flashCol * (0.5 + 0.5 * expo);
        if (uBolt.w > 0.001) {
          vec3 bd = p - uBolt.xyz;
          Lin += boltCol / (1.0 + dot(bd, bd) * 0.5);
        }

        float Tr = exp(-dens * sigma * ds);
        col += T * albedo * Lin * (1.0 - Tr);
        T *= Tr;
      }
    }
  }

  float alpha = 1.0 - T;
  if (alpha < 0.003) discard;
  vec3 c = col / alpha;
  c = applyHaze(c, max(tFirst, tEntry), pe.y);
  gl_FragColor = vec4(c * alpha, alpha);
}
`;
function createFogLidGeometry() {
  const t = [FIELD_BOUNDS.minX + 0.02],
    e = [FIELD_BOUNDS.minZ + 0.02];
  for (let d = 0; d < FOG_GRID_WIDTH; d++)
    t.push(
      FIELD_BOUNDS.minX + ((d + 0.5) / FOG_GRID_WIDTH) * FIELD_BOUNDS.sizeX,
    );
  for (let d = 0; d < FOG_GRID_DEPTH; d++)
    e.push(
      FIELD_BOUNDS.minZ + ((d + 0.5) / FOG_GRID_DEPTH) * FIELD_BOUNDS.sizeZ,
    );
  (t.push(FIELD_BOUNDS.minX + FIELD_BOUNDS.sizeX - 0.02),
    e.push(FIELD_BOUNDS.minZ + FIELD_BOUNDS.sizeZ - 0.02));
  const i = t.length,
    s = e.length,
    n = [],
    o = [],
    a = [],
    l = (d, p, v) => (n.push(d, v ? 0 : 1, p), o.push(v), o.length - 1);
  for (let d = 0; d < s; d++) for (let p = 0; p < i; p++) l(t[p], e[d], 0);
  const c = (d, p) => p * i + d;
  for (let d = 0; d < s - 1; d++)
    for (let p = 0; p < i - 1; p++) {
      const v = c(p, d),
        g = c(p, d + 1),
        x = c(p + 1, d),
        m = c(p + 1, d + 1);
      a.push(v, g, x, x, g, m);
    }
  const h = (d) => [n[d * 3], n[d * 3 + 1], n[d * 3 + 2]],
    f = (d, p, v) => {
      const g = l(n[d * 3], n[d * 3 + 2], 1),
        x = l(n[p * 3], n[p * 3 + 2], 1),
        m = h(d),
        w = h(p),
        y = h(g),
        _ = [w[0] - m[0], w[1] - m[1], w[2] - m[2]],
        M = [y[0] - m[0], y[1] - m[1], y[2] - m[2]],
        A = [
          _[1] * M[2] - _[2] * M[1],
          _[2] * M[0] - _[0] * M[2],
          _[0] * M[1] - _[1] * M[0],
        ];
      A[0] * v[0] + A[2] * v[2] >= 0
        ? a.push(d, p, g, g, p, x)
        : a.push(d, g, p, p, g, x);
    };
  for (let d = 0; d < i - 1; d++)
    (f(c(d, 0), c(d + 1, 0), [0, 0, -1]),
      f(c(d, s - 1), c(d + 1, s - 1), [0, 0, 1]));
  for (let d = 0; d < s - 1; d++)
    (f(c(0, d), c(0, d + 1), [-1, 0, 0]),
      f(c(i - 1, d), c(i - 1, d + 1), [1, 0, 0]));
  const u = new ThreeBufferGeometry();
  return (
    u.setAttribute("position", new ThreeFloat32BufferAttribute(n, 3)),
    u.setAttribute("aSkirt", new ThreeFloat32BufferAttribute(o, 1)),
    u.setIndex(a),
    (u.boundingSphere = new ThreeSphere(new ThreeVector3(0, 1, 0), 9)),
    u
  );
}
function createFogMaterials(
  r,
  {
    fogTex: t,
    noiseTex: e,
    blueTex: i,
    steps: s = 22,
    taps: n = 2,
    grow: o = 1.06,
  },
) {
  const a = {
      ...ThreeUniformsUtils.clone(ThreeUniformsLib.lights),
      ...r.uniforms,
      ...sceneDepthUniforms,
      uFogTex: {
        value: t,
      },
      uFogNoise: {
        value: e,
      },
      uBlueNoise: {
        value: i,
      },
      uBoxMin: {
        value: new ThreeVector3(-6, -1, -4),
      },
      uBoxMax: {
        value: new ThreeVector3(6, 3, 4),
      },
      uBottomY: {
        value: -1.1,
      },
      uSteam: {
        value: 0,
      },
      uStep: {
        value: 0.06,
      },
      uLook: {
        value: new ThreeVector4(3.6, 0.17, 0.24, 0),
      },
      uDrift0: {
        value: new ThreeVector4(),
      },
      uDrift1: {
        value: new ThreeVector4(),
      },
      uBolt: {
        value: new ThreeVector4(0, 6, 0, 0),
      },
    },
    l = {
      uniforms: a,
      vertexShader: r.GLSL_COMMON + FOG_VOLUME_VERTEX_SHADER,
      fragmentShader:
        r.GLSL_COMMON + SCENE_DEPTH_GLSL + FOG_VOLUME_FRAGMENT_SHADER,
      transparent: !0,
      premultipliedAlpha: !0,
      depthWrite: !1,
      lights: !0,
    },
    c = {
      STEPS: s,
      TAPS: n,
      GROW: o.toFixed(3),
    },
    h = new ThreeShaderMaterial({
      ...l,
      defines: {
        ...c,
      },
      side: ThreeFrontSide,
      depthTest: !0,
    }),
    f = new ThreeShaderMaterial({
      ...l,
      defines: {
        ...c,
        INSIDE: 1,
      },
      side: ThreeBackSide,
      depthTest: !1,
    });
  return {
    lid: h,
    inside: f,
    uniforms: a,
  };
}
export { createFogLidGeometry, createFogMaterials };
