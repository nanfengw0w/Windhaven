// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAddEquation,
  ThreeCustomBlending,
  ThreeOneFactor,
  ThreeOneMinusSrcAlphaFactor,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
const WATERFALL_VERTEX_GLSL = `
uniform vec2 uAcross;
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNrm;
void main() {
  vec3 p = position;
  // the sheet swells with the flow and flutters slightly in the wind
  vec2 w = windAt(p.xz);
  float u = uv.x;
  p.xz += w * u * u * 0.025 * (1.0 - uFallFrozen);
  // more water → a wider, heavier sheet
  p.xz += uAcross * uv.y * (0.1 + 0.05 * u) * clamp(uFlow - 1.0, -0.4, 1.6) * 0.3 * (1.0 - uFallFrozen);
  vUv = uv;
  vWorld = p;
  vNrm = normal;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`;
const WATERFALL_FRAGMENT_GLSL = `
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNrm;
void main() {
  float u = vUv.x, w = vUv.y;       // u: 0 lip → 1 pool, w: -1..1 across
  float fz = uFallFrozen;
  float along = u * 1.7 - uFallClock * 2.1;
  float n1 = wgNoise(vec2(w * 7.0, along * 2.6));
  float n2 = wgNoise(vec2(w * 21.0 + 5.0, along * 6.0));
  float n3 = wgNoise(vec2(w * 48.0 - 3.0, along * 11.0));
  float streak = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;
  float flowAmt = clamp(uFlow, 0.4, 3.0);

  // edges fray, the sheet opens into strands lower down (fewer with more water)
  float fray = abs(w) + (n2 - 0.5) * 0.45 * u;
  float edge = 1.0 - smoothstep(0.6 - 0.15 * u, 1.0, fray);
  float strands = smoothstep(0.18, 0.45, streak + 0.3 - u * 0.28 + (flowAmt - 1.0) * 0.18);
  float aer = smoothstep(0.02, 0.6, u);              // white water develops as it falls
  float tongue = 1.0 - smoothstep(0.0, 0.2, u);      // smooth glassy tongue over the lip
  float foam = smoothstep(0.32, 0.82, streak * 0.95 + aer * 0.42 - 0.08 + (flowAmt - 1.0) * 0.1);
  foam *= 1.0 - tongue * 0.85;
  float alpha = edge * (0.34 + 0.6 * foam) * mix(1.0, 0.4 + 0.6 * strands, aer) * smoothstep(0.0, 0.03, u);
  alpha = mix(alpha, edge * 0.8, tongue * 0.6);

  vec3 V = normalize(cameraPosition - vWorld);
  vec3 N = normalize(vNrm);
  N = dot(N, V) < 0.0 ? -N : N; // thin sheet: light the side we look at
  float sunUp = max(uLightDir.y, 0.0);
  vec3 lit = uLightColor * (max(dot(N, uLightDir), 0.0) * 0.2 + 0.09 * sunUp) + uSkyColor * 0.4 * wAmbI();
  vec3 back = uLightColor * pow(max(dot(-V, uLightDir), 0.0), 4.0) * 0.35;  // sun shining through
  vec3 waterCol = vec3(0.05, 0.19, 0.2) * lit + wSky(reflect(-V, N)) * mix(wFresnel(max(dot(N, V), 0.0)), 1.0, 0.12);
  waterCol += uLightColor * sunUp * 0.25 * pow(n3, 6.0) * tongue;
  vec3 foamCol = vec3(0.8, 0.87, 0.93) * lit * (0.55 + 0.6 * n3 * n2 + 0.25 * n1);
  vec3 col = mix(waterCol, foamCol, foam) + back * (0.35 + 0.4 * (1.0 - foam));
  col += wGlint(N, V, 180.0) * (1.0 - foam) * 0.5;

  // frozen curtain: fluted ice columns, icicle tips instead of the plunge
  float flute = wgNoise(vec2(w * 26.0, u * 1.6)) * 0.65 + wgNoise(vec2(w * 70.0, u * 4.0)) * 0.35;
  vec3 iceCol = mix(vec3(0.55, 0.7, 0.8), vec3(0.88, 0.94, 0.98), flute) * (wDiffuse(N) * 0.8 + wDiffuse(vec3(0.0, 1.0, 0.0)) * 0.35);
  iceCol += wGlint(N, V, 60.0) * 0.6 + back * 0.3;
  float tips = 0.72 + 0.26 * wgNoise(vec2(w * 30.0, 1.7)) - 0.12 * wgNoise(vec2(w * 90.0, 2.9));
  float iceAlpha = (1.0 - smoothstep(tips - 0.02, tips, u)) * (1.0 - smoothstep(0.75, 1.02, abs(w) + (flute - 0.5) * 0.3)) * 0.9;
  col = mix(col, iceCol, fz);
  alpha = mix(alpha, iceAlpha, fz);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(wHazeEmit(col, vec3(1.0 - alpha), vWorld) * alpha, alpha);
}
`;
const PLUNGE_POOL_VERTEX_GLSL = `
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  vUv = uv;
  vWorld = position;
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}
`;
const PLUNGE_POOL_FRAGMENT_GLSL = `
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  vec2 d = (vUv - 0.5) * 2.0;
  float r = length(d);
  float ang = atan(d.y, d.x);
  float fz = uFallFrozen;
  float clock = uFallClock;
  float ring = wgNoise(vec2(ang * 3.0 + r * 2.0, r * 9.0 - clock * 2.6)) * 0.6 + wgNoise(vec2(ang * 7.0, r * 22.0 - clock * 4.5)) * 0.4;
  float core = smoothstep(0.75, 0.0, r);
  float foam = clamp(core * 0.8 + smoothstep(0.45, 0.8, ring) * (1.0 - r) * 1.3, 0.0, 1.0) * clamp(0.55 + uFlow * 0.35, 0.0, 1.2);
  float bubbles = step(0.72, wgHash(floor(vWorld.xz * 70.0 + floor(clock * 6.0)))) * core;
  foam = clamp(foam + bubbles * 0.4, 0.0, 1.0);
  float alpha = foam * smoothstep(1.0, 0.55, r);
  float sunUp = max(uLightDir.y, 0.0);
  vec3 col = wFoamLight(sunUp);
  // frozen: a snowy ice mound under the curtain
  vec3 iceCol = vec3(0.82, 0.9, 0.96) * wDiffuse(vec3(0.0, 1.0, 0.0));
  float iceA = smoothstep(1.0, 0.6, r + (wgNoise(vWorld.xz * 12.0) - 0.5) * 0.3) * 0.95;
  col = mix(col, iceCol, fz);
  alpha = mix(alpha, iceA, fz);
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(wHazeEmit(col, vec3(1.0 - alpha), vWorld) * alpha, alpha);
}
`;
const RIVER_MATERIAL_OPTIONS = {
  transparent: !0,
  depthWrite: !1,
  blending: ThreeCustomBlending,
  blendEquation: ThreeAddEquation,
  blendSrc: ThreeOneFactor,
  blendDst: ThreeOneMinusSrcAlphaFactor,
  blendSrcAlpha: ThreeZeroFactor,
  blendDstAlpha: ThreeOneFactor,
};
export {
  PLUNGE_POOL_FRAGMENT_GLSL,
  PLUNGE_POOL_VERTEX_GLSL,
  RIVER_MATERIAL_OPTIONS,
  WATERFALL_FRAGMENT_GLSL,
  WATERFALL_VERTEX_GLSL,
};
