// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeMatrix4, ThreeVector3 } from "../vendor/three-runtime.js";
const WATERFALL_LIP_SEGMENT = 1.04;
const icicleInstanceMatrix = new ThreeMatrix4();
const icicleInstanceScale = new ThreeVector3();
const WATERFALL_POOL_SEGMENT = 1.93;
const RIVER_VERTEX_GLSL = `
attribute vec4 aFlow;   // τ (flow time), v (-1..1 across), slope, t
attribute vec4 aSide;   // half-width on this side, lake ellipse, arc length s, spring fade
attribute vec2 aDir;    // flow direction (xz)
varying vec3 vWorld;
varying vec4 vFlow;
varying vec4 vSide;
varying vec2 vDir;
varying float vYe;
void main() {
  vec3 p = position;
  float ry = p.y + (uFlow - 1.0) * 0.012 * smoothstep(1.0, 0.6, abs(aFlow.y));
  // approaching the lake the river surface eases down onto the lake surface
  float ye = max(uWaterLevel, mix(ry, uWaterLevel, smoothstep(1.35, 0.98, aSide.y)));
  p.y = aSide.y < 1.5 ? ye + 0.0015 : ry;
  vYe = ye;
  vWorld = p;
  vFlow = aFlow;
  vSide = aSide;
  vDir = aDir;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`;
const RIVER_FRAGMENT_GLSL = `
uniform float uPoolS;
uniform float uLipS;
varying vec3 vWorld;
varying vec4 vFlow;
varying vec4 vSide;
varying vec2 vDir;
varying float vYe;

vec2 wImpactRings(vec2 p) {
  vec2 g = vec2(0.0);
  for (int i = 0; i < 4; i++) {
    vec4 im = uImpacts[i];
    float age = uTime - im.z;
    if (age < 0.0 || age > 2.5) continue;
    vec2 d = p - im.xy - vDir * age * 0.25; // rings drift downstream
    float r = length(d) + 1e-4;
    float x = (r - age * 0.28) * 45.0;
    g += d / r * cos(x) * exp(-x * x * 0.05) * (1.0 - age / 2.5) * 0.5 * im.w;
  }
  return g;
}

void main() {
  float tau = vFlow.x, v = vFlow.y, slope = vFlow.z;
  float hw = vSide.x, s = vSide.z;
  vec2 p = vWorld.xz;
  vec2 fw = fwidth(p);   // before any discard (derivatives need the whole quad)
  float depth = vWorld.y - groundHeightAt(p);
  float lakeVis = smoothstep(uWaterLevel + 0.004, uWaterLevel + 0.02, vYe);
  float lip = s < uPoolS ? smoothstep(uLipS + 0.005, uLipS - 0.07, s) : 1.0;  // pour over the lip, don't end in mid-air
  float coverage = lakeVis * (1.0 - smoothstep(0.7 - (1.0 - lip) * 0.4, 1.0, abs(v))) * smoothstep(-0.004, 0.02, depth) * vSide.w * lip;
  if (coverage < 0.004) discard;

  vec2 dir = normalize(vDir);
  vec2 nrm = vec2(-dir.y, dir.x);
  float across = v * hw;
  float speed = 0.2 + slope * 2.0;

  // ice creeps in from the banks; in hard frost the whole river locks up
  float freeze = wFreezeAt(vWorld.y);
  float iceN = wgNoise(p * 9.0) - 0.5;
  float ice = smoothstep(1.0 - freeze * 1.3, 1.1 - freeze * 1.3, abs(v) + iceN * 0.3);
  ice = max(ice, smoothstep(0.82, 0.97, freeze + iceN * 0.1));
  float flowK = 1.0 - ice;

  // flow-advected pattern space; eddies near the banks lag and curl
  float bank = smoothstep(0.45, 0.95, abs(v));
  float ft = tau - uFlowTime * (1.0 - bank * 0.55);
  vec2 eddy = vec2(wgNoise(vec2(across * 6.0, ft * 0.6)) - 0.5, 0.0) * bank * 0.6;
  vec2 q1 = vec2(across * 13.0 + eddy.x * 3.0, ft * 2.6);
  vec2 q2 = vec2(across * 31.0 - 4.0, ft * 6.0 + 3.1);
  vec2 g1 = wNoiseGrad(q1), g2 = wNoiseGrad(q2);
  float turb = (0.035 + min(slope, 0.6) * 0.28) * (0.75 + 0.35 * uFlow) * flowK;
  // pattern-space gradient → world slope (along-flow derivative of τ is 1/speed)
  vec2 gp = (g1 * vec2(13.0, 2.6 / speed) * 0.006 + g2 * vec2(31.0, 6.0 / speed) * 0.0022) * turb / 0.05;
  vec2 grad = nrm * gp.x + dir * gp.y;
  float fp = max(fw.x, fw.y);
  vec3 rain = wRainRings(p, uTime, groundAt(p).z, fp) * flowK;
  grad += rain.xy * 0.8;
  grad += wImpactRings(p);
  vec3 N = normalize(vec3(-grad.x, 1.0, -grad.y));

  vec3 V = normalize(cameraPosition - vWorld);
  float nvRaw = dot(N, V);
  if (nvRaw < 0.02) { N = normalize(N + V * (0.02 - nvRaw)); }
  float sunVis = wSunVis(vWorld);               // key-light shadow map × cloud shadow
  // a miniature river is optically "deeper" than its millimetres; plus a faint film sheen
  float F = mix(wFresnel(wSat(dot(N, V))), 1.0, 0.09);
  vec3 Rr = refract(-V, N, 0.75);
  vec3 sigma = (wSigma() + vec3(-0.35, -0.07, 0.21)) * 2.6; // greener over the brown bed
  vec3 T = exp(-sigma * max(depth, 0.0) / max(-Rr.y, 0.2));

  // foam: streaks riding the current, whitewater in the steep reaches, froth below the fall
  float streak = smoothstep(0.6, 0.9, wgNoise(vec2(across * 26.0, ft * 1.5)) * 0.7 + wgNoise(vec2(across * 55.0, ft * 4.0)) * 0.3);
  float white = smoothstep(0.2, 0.5, slope * (0.75 + 0.3 * uFlow));
  float post = exp(-max(s - uPoolS, 0.0) / 0.32) * step(uPoolS - 0.05, s);
  float churn = wgNoise(vec2(across * 18.0, ft * 3.4)) * 0.6 + wgNoise(vec2(across * 40.0, ft * 7.0)) * 0.4;
  float foam = streak * (0.12 + white * 0.5 + post * 0.6 + (uFlow - 1.0) * 0.3);
  foam += smoothstep(0.5, 0.78, churn) * (white * 0.6 + post * 0.7 + max(uFlow - 1.4, 0.0) * 0.25);
  foam += bank * 0.08 * smoothstep(0.55, 0.8, churn);
  // a thin lapping waterline against the banks
  foam += smoothstep(0.012, 0.0, abs(depth - 0.008 - 0.004 * sin(uTime * 1.7 + s * 9.0))) * smoothstep(0.35, 0.7, churn) * 0.45;
  // sparse bubble lines drifting with the current
  foam += smoothstep(0.84, 0.93, wgNoise(vec2(across * 38.0 + 2.0, ft * 2.4))) * 0.28;
  foam = clamp(foam * flowK, 0.0, 0.95);

  float sunUp = max(uLightDir.y, 0.0);
  vec3 inscat = wAlbedo() * vec3(1.2, 2.1, 1.9) * wAmbient(mix(0.35, 1.0, sunVis)) * (1.0 - T);
  // broken reflections: rippled facets catch bright sky or the dark banks
  vec3 R = reflect(-V, N);
  // low rays meet the banks and hills, not sky (consistent with the lake's mirror)
  vec3 refl = mix(wLandscape(R.y, sunVis), wSky(R), smoothstep(0.08, 0.6, R.y + (g1.x - g2.y) * 0.12));
  // the lower reaches borrow the lake's mirror (what hangs above the valley), fading upstream
  float mirrorK = uReflOn * (1.0 - smoothstep(0.15, 0.7, vWorld.y - uWaterLevel));
  if (mirrorK > 0.01) {
    vec4 m = wMirror(vec3(vWorld.x, uWaterLevel, vWorld.z), grad * 0.04);
    float k = mirrorK * 0.85;
    refl = refl * (1.0 - m.a * k) + m.rgb * k;          // premultiplied mirror over the sky
  }
  vec3 glint = wGlint(N, V, mix(900.0, 240.0, wSat(turb * 8.0))) * sunVis;
  vec3 emit = inscat * (1.0 - F) + refl * F + glint + wGlitter(p, N, V, dir, 0.4 + turb * 6.0, 1.0 - smoothstep(0.02, 0.06, fp)) * sunVis;
  emit += wSky(vec3(0.0, 1.0, 0.0)) * rain.z * 0.06;
  vec3 foamCol = wFoamLight(sunUp * sunVis);
  emit = mix(emit, foamCol, foam);
  vec3 trans = T * (1.0 - F) * (1.0 - foam);

  // river ice: milky and clear windows, cracks, bubbles, a dull sheen, snow in drifts
  if (ice > 0.001) {
    float n2 = wgNoise(p * 3.2 + 7.0) * 0.6 + wgNoise(p * 10.0 - 3.0) * 0.4;
    float clear = smoothstep(0.42, 0.7, n2) * (1.0 - smoothstep(0.9, 1.0, freeze) * 0.5);
    vec2 cp = p + 0.05 * vec2(wgNoise(p * 6.0), wgNoise(p * 6.0 + 3.0));
    float crack = (1.0 - smoothstep(0.0, 0.022, wCell(cp * 9.0 + 2.0, 0.0))) * smoothstep(0.45, 0.7, wgNoise(p * 2.7 - 5.0));
    vec2 bq = p * 60.0;
    float bub = step(0.86, wgHash(floor(bq))) * smoothstep(0.3, 0.1, length(fract(bq) - 0.5));
    vec3 Ni = normalize(vec3((n2 - 0.5) * 0.08, 1.0, (wgNoise(p * 4.0) - 0.5) * 0.08));
    vec3 iceLight = wDiffuse(Ni, sunVis);
    vec3 milky = mix(vec3(0.36, 0.48, 0.56), vec3(0.56, 0.67, 0.75), smoothstep(0.3, 1.0, freeze));
    vec3 iceCol = milky * iceLight;
    iceCol = mix(iceCol, emit * 0.55 + vec3(0.02, 0.05, 0.06) * iceLight, clear);   // see into the water
    iceCol = mix(iceCol, iceCol * 0.55, crack * 0.7) + bub * iceLight * 0.18;
    iceCol += wSky(reflect(-V, Ni)) * mix(wFresnel(max(dot(Ni, V), 0.0)), 1.0, 0.04) * 0.8 + wGlint(Ni, V, 120.0) * 0.5 * sunVis;
    float drift = wgNoise(p * 2.3 + 1.0) * 0.7 + wgNoise(p * 8.0) * 0.3;
    float snow = smoothstep(0.4, 0.62, drift + smoothstep(0.03, 0.5, groundAt(p).x) * 0.5 - 0.15) * smoothstep(0.02, 0.2, groundAt(p).x) * smoothstep(0.5, 1.0, freeze);
    iceCol = mix(iceCol, vec3(0.9, 0.93, 0.98) * wDiffuse(vec3(0.0, 1.0, 0.0)), snow);
    vec3 iceTrans = mix(vec3(0.22, 0.3, 0.33), T * 0.7, clear) * (1.0 - snow) * (1.0 - crack * 0.3);
    emit = mix(emit, iceCol, ice);
    trans = mix(trans, iceTrans, ice);
    // frozen margins feather irregularly into the banks
    coverage *= 1.0 - ice * smoothstep(0.5, 0.95, abs(v) + (wgNoise(p * 14.0) - 0.5) * 0.35) * 0.8;
  }

  float a = 1.0 - dot(trans, vec3(0.3333));
  emit = min(wHazeEmit(emit, trans, vWorld), vec3(64.0));
  gl_FragColor = vec4(emit * coverage, a * coverage);
}
`;
export {
  RIVER_FRAGMENT_GLSL,
  RIVER_VERTEX_GLSL,
  WATERFALL_LIP_SEGMENT,
  WATERFALL_POOL_SEGMENT,
  icicleInstanceMatrix,
  icicleInstanceScale,
};
