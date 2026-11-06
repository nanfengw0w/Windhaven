// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAddEquation,
  ThreeCustomBlending,
  ThreeOneFactor,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
const SUN_DISC_RADIUS = 0.32;
const MOON_DISC_RADIUS = 0.36;
const CELESTIAL_BILLBOARD_VERTEX_GLSL = `
uniform vec2 uHalf;      // quad half-size (world units)
varying vec2 vUv;        // -1..1 across the quad
void main() {
  vUv = position.xy * 2.0;
  vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  mv.xy += vUv * uHalf;
  gl_Position = projectionMatrix * mv;
}
`;
const SUN_DISC_FRAGMENT_GLSL = `
uniform vec3 uCore;      // disc colour (HDR)
uniform vec3 uLimb;      // limb-darkening tint (redder toward the rim)
uniform vec3 uGlow;      // chromosphere / corona colour (HDR, saturated)
uniform float uDiscR;    // disc radius as a fraction of the quad half-size
uniform float uCorona;
uniform float uSquash;   // < 1 flattens the disc near the horizon
uniform float uFade;
uniform float uPulse;
varying vec2 vUv;
void main() {
  vec2 p = vec2(vUv.x, vUv.y / uSquash);
  vec2 q = p / uDiscR;                         // disc space: |q| = 1 at the limb
  float r = length(q);
  float aa = max(fwidth(r), 1e-3) * 1.2;
  float disc = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, r);
  vec3 col = vec3(0.0);
  if (disc > 0.0) {
    float mu = sqrt(max(1.0 - r * r, 0.0));
    vec3 limb = mix(uLimb, vec3(1.0), pow(mu, 0.55));
    // slow boiling granulation
    float g = wgNoise3(vec3(q * 3.5, uTime * 0.32)) * 0.6 + wgNoise3(vec3(q * 9.0 + 7.0, uTime * 0.55)) * 0.4;
    col = uCore * limb * (0.9 + 0.2 * g) * disc;
  }
  // outside the limb: a bright thin chromosphere, streamered corona, faint warm aureole
  float d = max(r - 1.0, 0.0);
  float ang = atan(q.y, q.x);
  float streamers = 0.7 + 0.3 * wgNoise(vec2(ang * 6.0 + uTime * 0.05, d * 0.7 - uTime * 0.12));
  float glow = exp(-d * 7.0) * 0.9 + exp(-d * 1.7) * 0.3 * streamers + exp(-d * 0.42) * 0.06;
  col += uGlow * glow * (1.0 + uPulse * 0.8) * uCorona * (1.0 - disc);
  float edge = 1.0 - smoothstep(0.7, 1.0, length(vUv));
  gl_FragColor = vec4(col * edge * uFade, 0.0);
}
`;
const SUN_GLARE_FRAGMENT_GLSL = `
uniform vec3 uColor;
uniform float uIntensity;
uniform float uRot;
uniform float uAspect;   // glare quad is wider than tall
uniform sampler2D uSceneDepthMap;
uniform float uSceneDepthEnabled;
varying vec2 vUv;
varying vec4 vSourceClip;
varying vec2 vSourceRadiusUv;

float glareSourceSample(vec2 uv, float sourceDepth) {
  // Offscreen rays have no captured depth; preserve glare entering from an offscreen sun.
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 1.0;
  return step(sourceDepth, texture2D(uSceneDepthMap, uv).r);
}

float glareSourceVisibility() {
  if (uSceneDepthEnabled < 0.5) return 1.0;
  if (vSourceClip.w <= 0.0) return 0.0;
  vec3 source = vSourceClip.xyz / vSourceClip.w * 0.5 + 0.5;
  if (source.z < 0.0 || source.z > 1.0) return 0.0;
  float visible = glareSourceSample(source.xy, source.z);
  // Probe the actual solar disc, not the much wider decorative glare quad.
  for (int i = 0; i < 8; i++) {
    float angle = float(i) * 0.7853981633974483;
    vec2 offset = vec2(cos(angle), sin(angle)) * vSourceRadiusUv * 0.7;
    visible += glareSourceSample(source.xy + offset, source.z);
  }
  return visible / 9.0;
}

void main() {
  float visibility = glareSourceVisibility();
  if (visibility <= 0.0) discard;
  vec2 p = vUv * vec2(uAspect, 1.0);
  float d = length(p);
  float ang = atan(p.y, p.x) + uRot;
  // thin 6-point aperture starburst + finer rays (no broad veil: that reads as a grey smudge)
  float spikes = pow(abs(cos(ang * 3.0)), 220.0) * exp(-d * 5.0);
  spikes += pow(abs(cos(ang * 7.0 + 0.4)), 320.0) * exp(-d * 8.0) * 0.45;
  // faint anamorphic streak
  float streak = exp(-abs(vUv.y) * 60.0) * exp(-abs(p.x) * 1.8) * 0.22;
  float core = exp(-d * d * 60.0) * 0.5;
  vec3 col = uColor * (spikes * 0.6 + streak + core);
  float edge = 1.0 - smoothstep(0.7, 1.0, max(abs(vUv.x), abs(vUv.y)));
  gl_FragColor = vec4(col * uIntensity * edge * visibility, 0.0);
}
`;
const SUN_GLARE_VERTEX_GLSL = `
uniform vec2 uHalf;
uniform vec2 uSourceRadius;
varying vec2 vUv;
varying vec4 vSourceClip;
varying vec2 vSourceRadiusUv;
void main() {
  vUv = position.xy * 2.0;
  vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vSourceClip = projectionMatrix * mv;
  vSourceRadiusUv = vec2(projectionMatrix[0][0], projectionMatrix[1][1])
    * uSourceRadius * 0.5 / max(vSourceClip.w, 1e-6);
  mv.xy += vUv * uHalf;
  gl_Position = projectionMatrix * mv;
}
`;
const MOON_DISC_FRAGMENT_GLSL = `
uniform vec3 uSunV;      // sun direction in view space (biased toward the viewer: mostly full)
uniform vec3 uTint;      // albedo × brightness (HDR)
uniform vec3 uHaloCol;
uniform float uDiscR;
uniform float uHalo;
uniform float uCoronaRing; // lunar corona (humid air)
uniform float uFade;
uniform float uPulse;
varying vec2 vUv;

// soft elliptical blob in disc space
float blob(vec2 q, vec2 c, vec2 r, float rot) {
  vec2 d = q - c;
  float cs = cos(rot), sn = sin(rot);
  d = vec2(cs * d.x - sn * d.y, sn * d.x + cs * d.y) / r;
  return 1.0 - smoothstep(0.55, 1.0, length(d));
}
// crater with a dark floor, bright rim and optional ejecta rays; foreshortened toward the limb
vec2 crater(vec2 q, vec2 c, float r, float rays) {
  vec2 d = q - c;
  float fz = sqrt(max(1.0 - dot(c, c), 0.05));
  vec2 radial = normalize(c + 1e-4);
  float along = dot(d, radial) / fz;
  vec2 dd = vec2(along, dot(d, vec2(-radial.y, radial.x)));
  float l = length(dd) / r;
  float floorD = (1.0 - smoothstep(0.6, 0.95, l)) * 0.18;
  float rim = exp(-pow((l - 1.0) * 5.0, 2.0)) * 0.22;
  float ang = atan(dd.y, dd.x);
  float ray = rays * pow(abs(sin(ang * 7.0 + 1.3) * sin(ang * 3.0)), 6.0) * exp(-max(l - 1.0, 0.0) * 1.3) * step(1.0, l);
  return vec2(rim + ray * 0.35, floorD);
}

void main() {
  vec2 p = vUv;
  vec2 q = p / uDiscR;
  float r = length(q);
  float aa = max(fwidth(r), 1e-3) * 1.5;
  float disc = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, r);
  vec3 col = vec3(0.0);
  if (r < 1.0 + aa) {
    vec3 n = vec3(q, sqrt(max(1.0 - r * r, 0.0)));
    // maria (the familiar near-side face)
    float warp = wgNoise(q * 3.0 + 4.0) * 0.12;
    vec2 w = q + warp;
    float m = 0.0;
    m = max(m, blob(w, vec2(-0.32, 0.36), vec2(0.36, 0.28), 0.3));   // Imbrium
    m = max(m, blob(w, vec2(-0.55, -0.02), vec2(0.28, 0.5), 0.1));   // Procellarum
    m = max(m, blob(w, vec2(0.18, 0.34), vec2(0.18, 0.16), 0.0));    // Serenitatis
    m = max(m, blob(w, vec2(0.32, 0.08), vec2(0.24, 0.2), -0.4));    // Tranquillitatis
    m = max(m, blob(w, vec2(0.68, 0.28), vec2(0.12, 0.14), 0.0));    // Crisium
    m = max(m, blob(w, vec2(0.46, -0.24), vec2(0.18, 0.14), 0.3));   // Fecunditatis
    m = max(m, blob(w, vec2(-0.12, -0.36), vec2(0.22, 0.14), 0.2));  // Nubium
    m *= 0.75 + 0.25 * wgNoise(q * 9.0);
    float alb = mix(1.0, 0.56, m);
    // fine regolith texture
    alb *= 0.9 + 0.1 * wgNoise(q * 22.0) + 0.05 * wgNoise(q * 47.0);
    // craters: Tycho (rays), Copernicus, Kepler, Aristarchus, Plato, Grimaldi + small ones
    vec2 cr = crater(q, vec2(-0.12, -0.62), 0.07, 1.0);
    vec2 c2 = crater(q, vec2(-0.3, 0.12), 0.06, 0.45); cr += c2;
    c2 = crater(q, vec2(-0.5, 0.08), 0.04, 0.3); cr += c2;
    c2 = crater(q, vec2(-0.66, 0.3), 0.035, 0.2); cr += c2;
    c2 = crater(q, vec2(-0.1, 0.7), 0.05, 0.0); cr.y += c2.y * 1.6; cr.x += c2.x * 0.4;
    c2 = crater(q, vec2(-0.82, -0.1), 0.06, 0.0); cr.y += c2.y * 1.8;
    c2 = crater(q, vec2(0.3, -0.52), 0.05, 0.0); cr += c2 * 0.7;
    c2 = crater(q, vec2(0.58, -0.5), 0.045, 0.0); cr += c2 * 0.7;
    c2 = crater(q, vec2(0.1, -0.14), 0.035, 0.0); cr += c2 * 0.6;
    alb = alb * (1.0 - cr.y) + cr.x * 0.8;
    // Lommel–Seeliger: the lunar disc stays flat-bright right to the limb
    float mu0 = max(dot(n, uSunV), 0.0);
    float mu = max(n.z, 0.05);
    float ls = mu0 / (mu0 + mu) * 2.0;
    float term = smoothstep(-0.02, 0.12, dot(n, uSunV));
    float lit = mix(0.035, 1.0, term) * ls;   // faint earthshine on the dark side
    col = uTint * alb * lit * disc;
  }
  float d = length(p) / uDiscR;
  float halo = exp(-max(d - 1.0, 0.0) * 4.5) * 0.16 + exp(-max(d - 1.0, 0.0) * 0.9) * 0.04;
  halo *= uHalo * (1.0 + uPulse);
  // lunar corona: pale iridescent ring when the air is humid
  float ringX = d - 2.6;
  vec3 iri = 0.6 + 0.4 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + d * 0.9));
  vec3 ring = iri * exp(-ringX * ringX * 3.0) * 0.07 * uCoronaRing;
  col += (uHaloCol * halo + ring * uHaloCol) * (1.0 - disc * 0.9);
  float edge = 1.0 - smoothstep(0.62, 1.0, length(p));
  gl_FragColor = vec4(col * edge * uFade, 0.0);
}
`;
function configureCelestialAdditiveBlending(r) {
  return (
    (r.transparent = !0),
    (r.depthWrite = !1),
    (r.blending = ThreeCustomBlending),
    (r.blendEquation = ThreeAddEquation),
    (r.blendSrc = ThreeOneFactor),
    (r.blendDst = ThreeOneFactor),
    (r.blendSrcAlpha = ThreeZeroFactor),
    (r.blendDstAlpha = ThreeOneFactor),
    r
  );
}
export {
  CELESTIAL_BILLBOARD_VERTEX_GLSL,
  MOON_DISC_FRAGMENT_GLSL,
  MOON_DISC_RADIUS,
  SUN_DISC_FRAGMENT_GLSL,
  SUN_DISC_RADIUS,
  SUN_GLARE_FRAGMENT_GLSL,
  SUN_GLARE_VERTEX_GLSL,
  configureCelestialAdditiveBlending,
};
