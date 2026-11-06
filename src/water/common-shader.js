// Reconstructed module: identifiers and file boundaries are refactor choices.
import { $E, YE } from "./uniforms-and-shadow-binding.js";
const WATER_COMMON_GLSL = `
#ifndef WG_WATER
#define WG_WATER
uniform float uIce;
uniform float uIceTemp;
uniform float uFlow;
uniform float uFlowTime;
uniform float uFallClock;
uniform float uFallFrozen;
uniform float uTurbid;
uniform sampler2D uRippleTex;
uniform vec4 uRippleBox;
uniform vec2 uRippleTexel;
uniform float uRippleAlpha;
uniform sampler2D uReflTex;
uniform mat4 uReflMatrix;
uniform float uReflOn;
uniform vec4 uReflClamp;
uniform vec2 uReflShift;
uniform vec4 uImpacts[4];

#define W_WAVE_H ${YE.toFixed(4)}
#define W_RIPPLE_H ${$E.toFixed(5)}

float wSat(float x) { return clamp(x, 0.0, 1.0); }
vec2 wRot(vec2 d, float a) { float c = cos(a), s = sin(a); return vec2(c * d.x - s * d.y, s * d.x + c * d.y); }

/**
 * Schlick fresnel for water (F0 = 0.02), with a little extra reflectance at mid angles: the
 * interior sky is far dimmer relative to the water body than a real sky, so a physically exact
 * curve leaves the mirror too weak from the usual 25–40° viewing elevations.
 */
float wFresnel(float cosT) {
  float c = wSat(1.0 - cosT);
  float c2 = c * c;
  return 0.02 + 0.98 * mix(c2 * c2 * c, c2 * c, 0.3);
}

/** Hemisphere (ambient) intensity, mirroring World.ambientIntensity. */
float wAmbI() {
  return uAmbientIntensity;
}

float wLum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
float wMax3(vec3 c) { return max(c.r, max(c.g, c.b)); }

/** Golden-hour weight (0 by day / at night). */
float wDusk() { return uGolden * (1.0 - uNight); }

/**
 * The interior "sky" seen in reflections. The art-directed fill (uSkyColor) is cool and the warm
 * light lives in uLightColor / uHazeColor; blending those linearly gives mauve (and greys out
 * any blue → orange gradient), so the dome is built from hue + luminance instead. Its hue walks
 * the way a real twilight sky does — blue → pale aqua → pale yellow → gold — never through
 * purple: a clean blue dome, paler low down, and at golden hour a warm band toward the low sun
 * (gold near it, a soft warm horizon all round). Luminance stays moderate so ACES keeps the
 * colour instead of bleaching it to cream.
 */
vec3 wSky(vec3 R) {
  float up = wSat(R.y);
  float dusk = wDusk();
  float ambI = wAmbI();
  // cool dome: the fill colour pulled toward a clean blue (never lavender)
  float ls = wLum(uSkyColor);
  vec3 cool = mix(uSkyColor, ls * vec3(0.7, 0.96, 1.42), 0.6);
  vec3 coolHue = cool / max(wLum(cool), 1e-4);
  float lumDome = ls * ambI * mix(0.85, mix(0.62, 0.45, dusk), smoothstep(0.0, 0.7, up)) * (1.0 - 0.45 * uNight);
  // warm band toward the light's azimuth, low in the sky
  vec2 rh = R.xz, lh = uLightDir.xz;
  // Float32 rounding can put antiparallel directions just below zero.
  // A negative base with a fractional exponent would poison the HDR/Bloom chain.
  float az = clamp(dot(rh, lh) * inversesqrt(max(dot(rh, rh) * dot(lh, lh), 1e-8)) * 0.5 + 0.5, 0.0, 1.0);
  float glow = pow(az, mix(3.5, 2.0, dusk)) * exp(-up * mix(4.0, 2.6, dusk)) * (0.3 + 0.7 * dusk);
  float broad = dusk * 0.5 * exp(-up * 2.0);
  float day = (1.0 - uNight) * (1.0 - 0.6 * uStorm);
  float h = wSat((glow + broad) * day * 1.3);
  // hue stops (each normalised to unit luminance)
  vec3 warm = mix(uHazeColor / max(wMax3(uHazeColor), 1e-4), uLightColor / max(wMax3(uLightColor), 1e-4), 0.55);
  warm = pow(warm, vec3(2.0));                         // a saturated gold, not a pastel
  warm /= max(wLum(warm), 1e-4);
  const vec3 AQUA = vec3(0.78, 1.0, 1.0) / 0.9529;
  const vec3 PYEL = vec3(1.0, 0.94, 0.7) / 0.9352;
  vec3 hue = h < 0.33 ? mix(coolHue, AQUA, h / 0.33)
           : h < 0.66 ? mix(AQUA, PYEL, (h - 0.33) / 0.33)
           : mix(PYEL, warm, (h - 0.66) / 0.34);
  float lumWarm = wLum(uLightColor) * (0.06 + 0.4 * dusk);
  vec3 c = hue * (lumDome + lumWarm * (glow + broad * 0.6) * day);
  // the light's aureole and its core
  float s = max(dot(R, uLightDir), 0.0);
  c += uLightColor * (0.04 * pow(s, 6.0) + (0.06 + 0.04 * dusk) * pow(s, 24.0) + 0.3 * pow(s, 160.0)) * (1.0 - 0.6 * uStorm);
  c += vec3(0.78, 0.82, 1.0) * uFlash * 1.8;
  return c;
}

/** The cool dome alone (no warm band): the tint of shade and distance away from the sun. */
vec3 wSkyCool(float up) {
  float ls = wLum(uSkyColor);
  vec3 cool = mix(uSkyColor, ls * vec3(0.7, 0.96, 1.42), 0.6);
  return cool * (wAmbI() * mix(0.85, 0.62, smoothstep(0.0, 0.7, up)) * (1.0 - 0.45 * uNight));
}

/**
 * What a low reflected ray meets inside the box when no mirror says otherwise: the landscape
 * (hills, banks, trees) in mostly shaded diffuse light, hazed with the cool dome.
 */
vec3 wLandscape(float up, float sunVis) {
  vec3 lit = uSkyColor * 0.5 * wAmbI() + uLightColor * max(uLightDir.y, 0.0) * 0.35 * sunVis;
  return mix(vec3(0.07, 0.085, 0.05) * lit, wSkyCool(up), 0.18);
}

/** Extinction coefficient per world unit (rgb): absorption kills red first; silt after storms. */
vec3 wSigma() {
  return vec3(2.35, 0.62, 0.74) + vec3(0.3) + vec3(0.8, 0.95, 1.35) * uTurbid;
}
/** Colour of light scattered back out of the water body (darker under a low sun: glassier). */
vec3 wAlbedo() {
  return mix(vec3(0.03, 0.2, 0.19), vec3(0.2, 0.22, 0.12), uTurbid) * (1.0 - 0.4 * wDusk());
}
/**
 * Light available for in-scattering (sky dome + direct key light, incl. lightning). sunVis =
 * key-light visibility (shadow map × cloud shadow). Moonlight barely lights a water body.
 */
vec3 wAmbient(float sunVis) {
  return uSkyColor * 0.52 * wAmbI() + uLightColor * max(uLightDir.y, 0.0) * 0.32 * sunVis * (1.0 - 0.65 * uNight);
}
vec3 wAmbient() { return wAmbient(1.0); }
/** Sun direction after refraction into the water (points downward). */
vec3 wLightRefracted() {
  return refract(-uLightDir, vec3(0.0, 1.0, 0.0), 1.0 / 1.333);
}

// ---------------------------------------------------------------- waves
void wTrain(inout vec3 acc, vec2 p, vec2 d, float lambda, float steep, float spd, float t, float ph) {
  float k = 6.2831853 / lambda;
  float f = (dot(d, p) - t * spd) * k + ph;
  float a = steep / k;
  acc += vec3(a * sin(f), steep * cos(f) * d);
}

/**
 * Wind-driven wave field: returns (height, dh/dx, dh/dz). Calm air gives a near-mirror;
 * gusts add travelling "cat's-paw" patches of roughness. rough = local roughness, dir = wind dir.
 */
vec3 wWaves(vec2 p, float t, out float rough, out vec2 dir) {
  vec2 w = windAt(p);
  float sp = length(w);
  dir = sp > 1e-4 ? w / sp : vec2(1.0, 0.0);
  float paw = wgNoise((p - dir * t * (0.45 + sp * 0.32)) * 0.85 + 11.3);
  float paw2 = wgNoise((p - dir * t * (0.6 + sp * 0.4)) * 2.1 - 4.7);
  rough = 0.07 + smoothstep(0.12, 3.4, sp) * (0.45 + 1.35 * smoothstep(0.42, 0.8, paw) + 0.4 * paw2) + uStorm * 0.35;
  vec3 acc = vec3(0.0);
  wTrain(acc, p, dir, 0.55, 0.085 * rough, 0.3, t, 0.0);
  wTrain(acc, p, wRot(dir, 0.55), 0.33, 0.075 * rough, 0.25, t, 1.7);
  wTrain(acc, p, wRot(dir, -0.45), 0.2, 0.065 * rough, 0.2, t, 4.1);
  wTrain(acc, p, wRot(dir, 1.05), 0.125, 0.05 * rough, 0.15, t, 2.3);
  return acc;
}

vec2 wNoiseGrad(vec2 q) {
  const float e = 0.12;
  float h = wgNoise(q);
  return vec2(wgNoise(q + vec2(e, 0.0)) - h, wgNoise(q + vec2(0.0, e)) - h) / e;
}
/**
 * Fine capillary chop (fragment only): advected noise gradients. fp = pixel footprint (world
 * units): octaves the pixel cannot resolve fade out instead of aliasing into speckles.
 */
vec2 wChop(vec2 p, float t, vec2 dir, float rough, float fp) {
  float k1 = 1.0 - smoothstep(0.035, 0.1, fp);
  float k2 = 1.0 - smoothstep(0.014, 0.045, fp);
  vec2 g = vec2(0.0);
  if (k1 > 0.0) g += wNoiseGrad(p * 6.5 - dir * t * 1.2) * (6.5 * 0.0055 * k1);
  if (k2 > 0.0) g += wRot(wNoiseGrad(wRot(p, 0.9) * 15.0 - wRot(dir, 0.9) * t * 2.4 + 7.1), -0.9) * (15.0 * 0.0021 * k2);
  return g * (0.35 + rough);
}
/** Slope variance of the chop octaves faded out by wChop (feeds the glint lobe width instead). */
float wChopLostVar(float rough, float fp) {
  float k1 = 1.0 - smoothstep(0.035, 0.1, fp);
  float k2 = 1.0 - smoothstep(0.014, 0.045, fp);
  float a = 0.35 + rough;
  return a * a * (0.0013 * (1.0 - k1) + 0.001 * (1.0 - k2));
}

/**
 * Expanding raindrop rings (procedural, cell based). Returns (slope.xz, crest brightness).
 * fp = pixel footprint (world units): ring sets finer than the pixel fade out (no speckles).
 */
vec3 wRainRings(vec2 p, float t, float amount, float fp) {
  vec3 g = vec3(0.0);
  if (amount < 0.02) return g;
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    float sc = 3.1 + fl * 2.3;
    float lam = 0.24 / sc;                            // ≈ crest spacing in world units
    float kL = 1.0 - smoothstep(lam * 0.35, lam * 0.9, fp);
    if (kL <= 0.0) continue;
    vec2 q = p * sc + fl * vec2(13.7, 7.3);
    vec2 id = floor(q);
    vec2 f = fract(q);
    float h1 = wgHash(id), h2 = wgHash(id + 41.3), h3 = wgHash(id + 17.9);
    if (h3 > amount * 0.85) continue;
    vec2 c = 0.3 + 0.4 * vec2(h1, h2);
    float ph = fract(t * (0.75 + 0.35 * h1) + h2 * 7.0 + fl * 0.37);
    vec2 r = f - c;
    float d = length(r) + 1e-4;
    // a crisp leading crest with a softer trailing ring
    float x = (d - ph * 0.32) * 26.0;
    float env = (1.0 - ph) * (1.0 - ph) * exp(-x * x * 0.12) * kL;
    g.xy += (r / d) * (cos(x) + 0.35 * cos(x * 2.1 + 1.0)) * env * 0.7;
    g.z += max(sin(x + 1.2), 0.0) * env * (1.0 - ph);
  }
  return g;
}
vec3 wRainRings(vec2 p, float t, float amount) { return wRainRings(p, t, amount, 0.0); }

// ---------------------------------------------------------------- ripple simulation
vec2 wRippleUV(vec2 p) { return (p - uRippleBox.xy) / uRippleBox.zw; }
float wRippleAt(vec2 uv) {
  vec2 hg = texture2D(uRippleTex, uv).rg;
  return mix(hg.g, hg.r, uRippleAlpha);
}
float wRippleH(vec2 p) {
  vec2 uv = wRippleUV(p);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  return wRippleAt(uv);
}
/** Slope of the simulated ripples (world units). */
vec2 wRippleGrad(vec2 p) {
  vec2 uv = wRippleUV(p);
  vec2 e = uRippleTexel;
  float l = wRippleAt(uv - vec2(e.x, 0.0));
  float r = wRippleAt(uv + vec2(e.x, 0.0));
  float d = wRippleAt(uv - vec2(0.0, e.y));
  float u = wRippleAt(uv + vec2(0.0, e.y));
  vec2 texW = e * uRippleBox.zw;
  return vec2(r - l, u - d) / (2.0 * texW) * W_RIPPLE_H;
}

// ---------------------------------------------------------------- caustics
float wCell(vec2 p, float t) {
  vec2 i = floor(p), f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 h = vec2(wgHash(i + g), wgHash(i + g + 19.19));
      vec2 o = 0.5 + 0.4 * sin(t + 6.2831 * h);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
    }
  }
  return sqrt(d2) - sqrt(d1);
}
/** Dancing caustic network (bright thin lines), roughly 0..1.6. */
float wCaustic(vec2 p, float t) {
  vec2 w = p + 0.3 * vec2(wgNoise(p * 0.7 + t * 0.21), wgNoise(p * 0.7 - t * 0.18 + 5.2));
  float a = wCell(w, t * 0.9);
  float b = wCell(w * 1.63 + 3.1, -t * 0.75);
  float c = pow(1.0 - smoothstep(0.0, 0.3, a), 3.0) + 0.55 * pow(1.0 - smoothstep(0.0, 0.26, b), 3.0);
  return c;
}
/** Cheap soft caustic for light shafts (no cell search). */
float wShaftPattern(vec2 p, float t) {
  float n = wgNoise(p * 2.6 + vec2(t * 0.23, -t * 0.17)) * 0.6 + wgNoise(p * 5.3 - vec2(t * 0.31, t * 0.12)) * 0.4;
  return pow(smoothstep(0.35, 0.95, n), 2.0);
}

// ---------------------------------------------------------------- ice
/** Lake ice cover at p for a given water depth: freezes from the shallows toward the deep middle. */
float wIceMask(vec2 p, float depth) {
  if (uIce <= 0.001) return 0.0;
  float n = wgNoise(p * 1.7 + 3.3) * 0.62 + wgNoise(p * 5.3) * 0.26;
  float front = uIce * 1.4 - wSat(depth / 0.9) * 0.82 - n * 0.36 + 0.08;
  return smoothstep(0.0, 0.05, front);
}
/** River / waterfall ice from the lagged temperature at altitude y. */
float wFreezeAt(float y) {
  float T = uIceTemp - uLapse * max(y, 0.0);
  return smoothstep(-0.5, -6.5, T);
}

/** Diffuse irradiance / π for a matte surface with normal N — same scale as three's Lambert. */
vec3 wDiffuse(vec3 N, float sunVis) {
  vec3 hemi = mix(uGroundColor, uSkyColor, N.y * 0.5 + 0.5) * wAmbI();
  return (uLightColor * max(dot(N, uLightDir), 0.0) * sunVis + hemi) * 0.3183;
}
vec3 wDiffuse(vec3 N) { return wDiffuse(N, 1.0); }

/** Lit foam colour (diffuse white, a touch blue, matched to the scene's exposure). sunUp includes shadowing. */
vec3 wFoamLight(float sunUp) {
  return vec3(0.86, 0.92, 0.97) * (uSkyColor * 0.48 * wAmbI() + uLightColor * sunUp * 0.32);
}

/**
 * Sun / moon glint: microfacet reflection of the key light, D·F/(4·N·V) with a normalised
 * Blinn-Phong lobe. The 1/(N·V) term is what stretches a low sun into a long path across the
 * water at grazing angles. HDR (blooms); multiply by the key-light visibility at the call site.
 */
vec3 wGlint(vec3 N, vec3 V, float sharp) {
  vec3 H = normalize(uLightDir + V);
  float nh = max(dot(N, H), 0.0);
  float D = pow(nh, sharp) * (sharp + 2.0) * 0.159;
  float F = wFresnel(max(dot(V, H), 0.0));
  float nv = max(dot(N, V), 0.12);
  float spec = min(D * F / (4.0 * nv), 40.0);
  return uLightColor * spec * smoothstep(0.0, 0.07, uLightDir.y);
}

/**
 * Sun glitter: tiny wind-tossed facets twinkling along the sun's path. Sparkle density follows a
 * Gaussian facet-slope distribution around the tilt needed to mirror the sun (Cox–Munk style), so
 * glitter gathers into a path that stretches toward the viewer at grazing angles. A low sun keeps
 * a little glitter even on a calm lake (golden path). fade = 0..1 for pixels too coarse to
 * resolve the facets.
 */
vec3 wGlitter(vec2 p, vec3 N, vec3 V, vec2 dir, float rough, float fade) {
  vec3 H = normalize(uLightDir + V);
  float c = max(dot(N, H), 1e-3);
  float t2 = (1.0 - c * c) / (c * c);                    // tan² of the facet tilt needed
  float dusk = wDusk();
  float s2 = 0.004 + 0.03 * wSat(rough) + 0.012 * dusk;  // facet slope variance
  float pdf = exp(-t2 / s2);
  vec2 gc = floor(p * 90.0 - dir * uTime * 0.5);
  float tw = wgHash(gc + floor(uTime * 5.0 + wgHash(gc) * 5.0) * 0.731);   // each facet flickers
  float g = step(1.0 - 0.4 * pdf, tw);
  float amount = max(smoothstep(0.08, 0.5, rough), dusk * 0.8);
  float F = wFresnel(max(dot(V, H), 0.0));
  // sparkles + the averaged glitter underneath (a warm sheen along the path; it carries the
  // light's colour where the sparkles alone would tone-map to white)
  float k = (g * 5.0 * fade + pdf * 1.1) * F * amount;
  return uLightColor * k * smoothstep(0.0, 0.07, uLightDir.y) * (1.0 - uNight * 0.4);
}
vec3 wGlitter(vec2 p, vec3 N, vec3 V, vec2 dir, float rough) { return wGlitter(p, N, V, dir, rough, 1.0); }

/** Planar mirror at water point wpos (world), distorted by 'distort' (fraction of the screen). a = coverage. */
vec4 wMirror(vec3 wpos, vec2 distort) {
  vec4 c = uReflMatrix * vec4(wpos, 1.0);
  vec2 uv = clamp(c.xy / max(c.w, 1e-4) + distort * uReflShift, uReflClamp.xy, uReflClamp.zw);
  vec4 m = texture2D(uReflTex, uv);
  // clamp alone does not reliably remove NaN on all graphics drivers.
  // Invalid mirror samples fall back to procedural sky rather than spreading.
  if (!(m.r >= -65504.0 && m.r <= 65504.0 &&
        m.g >= -65504.0 && m.g <= 65504.0 &&
        m.b >= -65504.0 && m.b <= 65504.0 &&
        m.a >= 0.0 && m.a <= 1.0)) return vec4(0.0);
  m = clamp(m, vec4(0.0), vec4(24.0, 24.0, 24.0, 1.0));
  return m;
}

/**
 * Planar reflection with the procedural sky where the mirror saw nothing. Coverage is binary
 * per mirror texel (empty texels are 0,0,0,0), so the filtered sample is premultiplied: 'over'
 * the sky, no dark fringe. The mirror pass has no interior air, so the reflected world gets a
 * light atmospheric veil (warmer at golden hour).
 */
vec3 wReflect(vec3 R, vec3 wpos, vec2 distort) {
  vec3 sky = wSky(R);
  if (uReflOn < 0.5) return sky;
  vec4 m = wMirror(wpos, distort);
  // veil colour: mostly the cool dome (the bank in reflection is usually shaded), a little warm
  float veil = 0.08 + 0.08 * wDusk();
  vec3 veilCol = mix(wSkyCool(R.y), sky, 0.25);
  return sky * (1.0 - m.a) + m.rgb * (1.0 - veil) + veilCol * (0.8 * veil * m.a);
}

/**
 * Final touch for emitted water light. The sky module's atmosphere already hazes everything
 * behind its box faces (incl. the water), so no extra distance haze here (that read as a milky,
 * mauve veil at dusk). Moonlight: the eye loses some colour.
 */
vec3 wHazeEmit(vec3 emit, vec3 T, vec3 wpos) {
  return mix(emit, vec3(dot(emit, vec3(0.3, 0.5, 0.2))), uNight * 0.3);
}

// ---------------------------------------------------------------- key-light shadow
#ifdef W_SHADOW
uniform sampler2DShadow uShadowMap;
uniform mat4 uShadowMatrix;
uniform vec2 uShadowParams;
/** Key-light visibility (1 lit … 0 shadowed) at world point wp: a soft 6-tap PCF. */
float wKeyShadow(vec3 wp) {
  if (uShadowParams.y < 0.5) return 1.0;
  vec4 sc = uShadowMatrix * vec4(wp + vec3(0.0, 0.012, 0.0), 1.0);
  vec3 c = sc.xyz / sc.w;
  if (c.x <= 0.0 || c.x >= 1.0 || c.y <= 0.0 || c.y >= 1.0 || c.z >= 1.0) return 1.0;
#ifdef W_REVERSED_DEPTH
  float z = c.z + 0.0003;
#else
  float z = c.z - 0.0003;
#endif
  float r = uShadowParams.x;
  float s = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float rr = sqrt((fi + 0.5) / 6.0) * r;
    float a = fi * 2.39996 + 0.6;
    s += texture(uShadowMap, vec3(c.xy + vec2(cos(a), sin(a)) * rr, z));
  }
  return s / 6.0;
}
/** Cheap single-tap (hardware 2×2 PCF) variant for volume samples that get averaged. */
float wKeyShadow1(vec3 wp) {
  if (uShadowParams.y < 0.5) return 1.0;
  vec4 sc = uShadowMatrix * vec4(wp, 1.0);
  vec3 c = sc.xyz / sc.w;
  if (c.x <= 0.0 || c.x >= 1.0 || c.y <= 0.0 || c.y >= 1.0 || c.z >= 1.0) return 1.0;
#ifdef W_REVERSED_DEPTH
  return texture(uShadowMap, vec3(c.xy, c.z + 0.0004));
#else
  return texture(uShadowMap, vec3(c.xy, c.z - 0.0004));
#endif
}
#else
float wKeyShadow(vec3 wp) { return 1.0; }
float wKeyShadow1(vec3 wp) { return 1.0; }
#endif

/** Direct key-light visibility: shadow map × soft cloud shadow. */
float wSunVis(vec3 wp) { return wKeyShadow(wp) * cloudShadowAt(wp); }
#endif
`;
export { WATER_COMMON_GLSL };
