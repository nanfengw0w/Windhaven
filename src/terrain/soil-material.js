// Reconstructed module: identifiers and file boundaries are refactor choices.
import { ThreeMeshStandardMaterial } from "../vendor/three-runtime.js";
import {
  TERRAIN_DETAIL_COMMON_GLSL,
  TERRAIN_SNOW_LIFT_GLSL,
} from "./surface-shaders.js";
const TERRAIN_SOIL_SECTION_GLSL = `
struct TSoil { vec3 albedo; float rough; vec3 n; float ao; };

// Hanging roots: one wiggly, tapering root per column of width 1/scale. Coverage-antialiased.
float tRoots(float u, float d, float scale, float density, float maxLen, float w0, float fw) {
  float cu = u * scale;
  float ci = floor(cu);
  float h1 = wgHash(vec2(ci, 5.1));
  float len = maxLen * (0.35 + 0.65 * wgHash(vec2(ci, 2.3)));
  float x0 = ci + 0.3 + 0.4 * wgHash(vec2(ci, 9.7));
  float wig = (wgNoise(vec2(d * 16.0, ci * 3.1)) - 0.5) * 0.3 + sin(d * 34.0 + h1 * 20.0) * 0.05;
  float dist = abs(cu - x0 - wig) / scale;
  float taper = 1.0 - smoothstep(0.0, len, d);
  float w = w0 * (0.3 + 0.7 * taper);
  float wAA = max(w, fw * 0.75);
  float cover = (1.0 - smoothstep(wAA * 0.5, wAA, dist)) * min(1.0, w / wAA);
  return cover * step(h1, density) * step(0.0, d) * step(d, len);
}

TSoil soilSection(vec3 p, vec3 N, float u, float S, float ny) {
  TSoil s;
  float fw = length(fwidth(p));
  float fine = 1.0 - smoothstep(0.01, 0.04, fw);
  float d = S - p.y;                                               // depth below the surface
  float m = smoothstep(0.85, 1.7, S);                              // mountain column
  float lake = smoothstep(T_BASE_LAKE + 0.08, T_BASE_LAKE - 0.04, S); // lake-bed column
  float steep = smoothstep(0.78, 0.58, ny);                        // bare rock at the surface
  vec4 G = groundAt(p.xz);
  vec2 q = vec2(u, p.y);

  // wavy boundaries that follow the terrain profile (thick soil under meadows, rock under peaks)
  float w1 = wgNoise(vec2(u * 2.3, 1.3)) - 0.5;
  float w2 = wgNoise(vec2(u * 1.2, 7.9)) - 0.5;
  float w3 = wgNoise(vec2(u * 0.6, 3.3)) - 0.5;
  float w4 = wgNoise(vec2(u * 6.0, 9.1)) - 0.5;
  float rimB = mix(0.04, 0.012, max(steep, lake)) + 0.014 * wgNoise(vec2(u * 34.0, 0.5));
  float topB = mix(mix(0.27, 0.09, m), 0.05, lake) + w1 * 0.06 + w4 * 0.015;
  float yRock = mix(-0.98 + w3 * 0.22, S - 0.13 - abs(w1) * 0.12, m);
  float yTop = S - topB;
  float yLoam = min(max(-0.16 + (S - 0.6) * 0.5 + w2 * 0.12 + w4 * 0.02, yRock), yTop - 0.02);
  float yClay = min(max(yLoam - (0.16 + w1 * 0.06 + w3 * 0.05), yRock), yLoam);
  float yGrav = min(max(-0.9 + (S - 0.6) * 0.15 + w3 * 0.2 + w1 * 0.04, yRock), yClay);

  // layer masks + how much of each layer actually shows (upper layers paint over lower ones),
  // so the expensive cellular patterns are only evaluated where visible
  float inSnow = step(S + 0.0005, p.y);
  float inRim = smoothstep(S - rimB - 0.004, S - rimB + 0.004, p.y);
  float inTop = smoothstep(yTop - 0.05, yTop + 0.02, p.y + (wgNoise(q * 24.0) - 0.5) * 0.04);
  float topW = inTop * (1.0 - steep * 0.6);
  float inLoam = smoothstep(yLoam - 0.012, yLoam + 0.012, p.y + w4 * 0.015);
  float inClay = smoothstep(yClay - 0.004, yClay + 0.004, p.y);
  float inGrav = smoothstep(yGrav - 0.004, yGrav + 0.008, p.y + (w4 * 0.02));
  float vis = (1.0 - inSnow) * (1.0 - inRim) * (1.0 - topW);
  float wLoam = vis * inLoam;
  vis *= 1.0 - inLoam;
  float wClay = vis * inClay;
  vis *= 1.0 - inClay;
  float wGrav = vis * inGrav;
  float wRock = vis * (1.0 - inGrav);
  vec3 col = vec3(0.0);
  float H = 0.0, rough = 0.85, ao = 1.0;

  // ---- bedrock: sandstone & shale beds of uneven thickness, tilted under the mountains
  vec3 rock = vec3(0.2, 0.15, 0.1);
  if (wRock > 0.001 || steep > 0.001) {
  float tilt = mix(0.05, 0.42, m);
  float sc = p.y + u * tilt + w2 * 0.15 + (wgNoise(q * vec2(1.5, 3.0)) - 0.5) * 0.06;
  float sb = sc * 8.0 + sin(sc * 21.0 + w3 * 3.0) * 0.45;          // non-uniform bed spacing
  float sid = floor(sb), sfr = fract(sb);
  float sh = wgHash(vec2(sid, 1.7));
  vec3 sand = mix(vec3(0.25, 0.155, 0.095), vec3(0.38, 0.26, 0.16), sh);
  sand = mix(sand, vec3(0.15, 0.11, 0.09), step(0.8, sh) * 0.85);
  vec3 grey = mix(vec3(0.17, 0.165, 0.16), vec3(0.3, 0.285, 0.265), sh);
  vec3 rock = mix(sand, grey, smoothstep(0.25, 0.85, m + (p.y - S + 1.2) * 0.25));
  rock *= 0.9 + 0.1 * (sin(sb * 18.85 + wgNoise(q * 8.0) * 2.0) * 0.5 + 0.5);   // laminations
  float bedEdge = smoothstep(0.0, 0.08, sfr) * smoothstep(1.0, 0.9, sfr);
  rock *= 0.86 + 0.14 * bedEdge;
  float rn = wgNoise(q * 14.0);
  rock *= 0.85 + 0.25 * rn + 0.1 * (wgNoise(q * 60.0) - 0.5);
  // sparse, slanted joints — only some beds are fractured
  float jc = abs(wgNoise(vec2(u * 1.6 + p.y * 0.9, sid * 1.7)) - 0.5);
  float joint = (1.0 - smoothstep(0.0, 0.012, jc)) * step(0.62, wgHash(vec2(sid, 9.3))) * bedEdge;
  rock *= 1.0 - joint * 0.5;
  col = rock;
  H = (bedEdge * 0.006 + rn * 0.005 - joint * 0.006);
  ao = 1.0 - joint * 0.4;
  }

  // ---- gravel: rounded, flat-lying stones of mixed sizes packed in dark grit
  if (wGrav > 0.001) {
  vec2 toF;
  vec3 gc = tCell(q * vec2(8.0, 10.5), toF);
  float gr = 0.28 + 0.2 * fract(gc.z * 7.7);
  float gIn = 1.0 - smoothstep(gr - 0.05, gr, gc.x);
  float gDome = sqrt(max(0.0, 1.0 - gc.x * gc.x / (gr * gr)));
  vec2 toC;
  vec3 cc = tCell(q * vec2(3.6, 4.6) + 31.0, toC);                    // occasional cobbles
  float cr_ = 0.3 + 0.12 * fract(cc.z * 3.3);
  float cIn = (1.0 - smoothstep(cr_ - 0.03, cr_, cc.x)) * step(fract(cc.z * 7.1), 0.35);
  float cDome = sqrt(max(0.0, 1.0 - cc.x * cc.x / (cr_ * cr_)));
  vec3 stone = tPebbleColor(gc.z, wgNoise(q * 70.0)) * mix(0.6, 1.0, fract(gc.z * 17.3));
  vec3 cobble = tPebbleColor(cc.z + 0.37, wgNoise(q * 40.0)) * 0.9;
  vec3 grit = vec3(0.14, 0.11, 0.08) * (0.75 + 0.4 * wgNoise(q * 90.0)) * mix(0.55, 1.0, smoothstep(gr, gr + 0.18, gc.x));
  vec3 gravel = mix(mix(grit, stone, gIn), cobble, cIn);
  float gH = mix(gIn * gDome * 0.018, cDome * 0.03, cIn);
  col = mix(col, gravel, inGrav);
  H = mix(H, gH, inGrav);
  rough = mix(rough, mix(0.95, 0.55, max(gIn, cIn)), inGrav);
  ao = mix(ao, mix(0.6, 1.0, max(max(gIn, cIn), smoothstep(gr, gr + 0.25, gc.x))), inGrav);
  }

  // ---- clay band: smooth, laminated, slightly sheeny
  if (wClay > 0.001) {
  vec3 clay = mix(vec3(0.36, 0.17, 0.07), vec3(0.45, 0.25, 0.12), wgNoise(q * vec2(3.0, 20.0)));
  clay *= 0.92 + 0.08 * sin(p.y * 260.0 + w4 * 24.0);
  clay = mix(clay, vec3(0.27, 0.27, 0.25), lake * 0.6);                 // grey lake clay
  col = mix(col, clay, inClay);
  H = mix(H, (wgNoise(q * 30.0) - 0.5) * 0.002, inClay);
  rough = mix(rough, 0.62, inClay);
  ao = mix(ao, 1.0, inClay);
  }

  // ---- loam: mottled, streaky, with embedded stones and worm burrows
  if (wLoam > 0.001) {
  float mott = wgNoise(q * vec2(2.2, 6.0) + 3.0);
  vec3 loam = mix(vec3(0.11, 0.07, 0.042), vec3(0.19, 0.12, 0.07), wgNoise(q * 9.0) * 0.6 + mott * 0.4);
  loam = mix(loam, vec3(0.21, 0.12, 0.06), smoothstep(0.62, 0.8, mott) * 0.5);        // iron mottles
  loam *= 0.88 + 0.24 * wgNoise(q * vec2(20.0, 90.0));                                 // fine streaks
  loam *= mix(1.0, 1.12, smoothstep(0.0, 0.4, (yTop - p.y)));                          // lighter with depth
  float burrow = smoothstep(0.86, 0.9, wgNoise(q * vec2(16.0, 13.0) + 9.0)) * step(0.5, wgNoise(q * 3.0 + 1.0));
  loam = mix(loam, vec3(0.05, 0.035, 0.025), burrow * 0.7);
  loam = mix(loam, vec3(0.24, 0.21, 0.155) * (0.85 + 0.3 * wgNoise(q * 40.0)), lake);  // lake sand
  vec2 toE;
  vec3 ec = tCell(q * 4.5 + 17.0, toE);
  float er = 0.12 + 0.3 * fract(ec.z * 5.9);
  float eIn = (1.0 - smoothstep(er - 0.035, er, ec.x)) * step(fract(ec.z * 3.1), 0.12);
  float eDome = sqrt(max(0.0, 1.0 - ec.x * ec.x / (er * er)));
  loam = mix(loam, tPebbleColor(ec.z, wgNoise(q * 70.0)) * 0.55, eIn);
  col = mix(col, loam, inLoam);
  H = mix(H, eIn * eDome * 0.03 + (wgNoise(q * 45.0) - 0.5) * 0.003 - burrow * 0.004, inLoam);
  rough = mix(rough, mix(0.95, 0.6, eIn), inLoam);
  ao = mix(ao, 1.0 - burrow * 0.4, inLoam);
  }

  // ---- humus topsoil, bleeding softly into the loam
  vec3 humus = mix(vec3(0.03, 0.022, 0.016), vec3(0.055, 0.04, 0.028), wgNoise(q * 25.0));
  humus = mix(humus, vec3(0.1, 0.1, 0.08), lake);                  // lake silt
  col = mix(col, humus, topW);
  H = mix(H, (wgNoise(q * 60.0) - 0.5) * 0.003, inTop);
  rough = mix(rough, 0.97, inTop);

  // ---- roots hanging from the turf (thin rootlets + a few thicker ones)
  float rootZone = (1.0 - lake) * (1.0 - steep) * smoothstep(yClay, yClay + 0.05, p.y) * step(p.y, S - rimB * 0.6);
  float roots = 0.0;
  if (rootZone > 0.001) {
    roots = max(tRoots(u, d - rimB, 22.0, 0.75, mix(0.34, 0.12, m), 0.0045, fw),
                tRoots(u + 7.3, d - rimB, 7.0, 0.45, mix(0.5, 0.16, m), 0.009, fw)) * rootZone;
  }
  col = mix(col, vec3(0.3, 0.23, 0.15) * (0.85 + 0.3 * wgNoise(q * 50.0)), roots);
  H += roots * 0.004;

  // ---- turf / moss rim (or bare rock / silt where the surface is rock or lake bed)
  vec3 turf = mix(uGrassColor * 0.32, vec3(0.07, 0.09, 0.035), wgNoise(vec2(u * 40.0, p.y * 30.0)));
  turf *= 0.7 + 0.5 * wgNoise(vec2(u * 140.0, p.y * 6.0));           // blade streaks
  turf = mix(turf, rock * 0.9, steep);
  turf = mix(turf, vec3(0.13, 0.13, 0.1), lake);
  col = mix(col, turf, inRim);
  H = mix(H, wgNoise(vec2(u * 140.0, p.y * 6.0)) * 0.004, inRim);
  ao *= mix(0.72, 1.0, smoothstep(0.0, 0.07, d - rimB));             // overhang of the turf

  // ---- wetness soaks down from the surface
  float wetD = G.y * 0.45 + G.z * 0.15;
  float wet = G.y * smoothstep(wetD + 0.06, wetD - 0.04, d) * (1.0 - lake);
  col *= 1.0 - wet * 0.4;
  rough = mix(rough, 0.45, wet);

  // ---- snow cap (above the surface: the snow-lifted band)
  col = mix(col, vec3(0.55, 0.58, 0.63), inSnow);
  rough = mix(rough, 0.6, inSnow);

  // ---- deeper = darker (less light reaches through the glass floor)
  float deep = smoothstep(T_BOTTOM_Y, T_BOTTOM_Y + 1.0, p.y);
  col *= mix(0.62, 1.0, deep);
  ao *= mix(0.55, 1.0, deep);

  // the floor under the block
  float floor_ = step(N.y, -0.5);
  col = mix(col, vec3(0.04, 0.032, 0.025), floor_);

  s.albedo = col;
  s.rough = rough;
  s.n = tBump(p, N, H * fine * (1.0 - floor_));
  s.ao = ao;
  return s;
}
`;
const TERRAIN_SOIL_VARYINGS_GLSL = `varying vec3 vSPos;
varying vec3 vSNrm;
varying float vSU;
varying float vSSurf;
varying float vSNy;
`;
function createTerrainSoilMaterial(r, t) {
  const e = new ThreeMeshStandardMaterial({
    color: 16777215,
    roughness: 0.9,
    metalness: 0,
  });
  return (
    (e.onBeforeCompile = (i) => {
      (Object.assign(i.uniforms, r.uniforms, t),
        (i.vertexShader =
          r.GLSL_COMMON +
          TERRAIN_SNOW_LIFT_GLSL +
          i.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
attribute float aU;
attribute float aSurf;
attribute float aTop;
attribute float aNy;
` + TERRAIN_SOIL_VARYINGS_GLSL,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
        if (aTop > 0.5) transformed.y += tSnowLift(transformed, aNy);
        vSPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vSNrm = normal;
        vSU = aU;
        vSSurf = aSurf;
        vSNy = aNy;`,
            )),
        (i.fragmentShader =
          r.GLSL_COMMON +
          TERRAIN_SNOW_LIFT_GLSL +
          TERRAIN_DETAIL_COMMON_GLSL +
          TERRAIN_SOIL_SECTION_GLSL +
          i.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
` + TERRAIN_SOIL_VARYINGS_GLSL,
            )
            .replace(
              "#include <map_fragment>",
              `#include <map_fragment>
        TSoil tS = soilSection(vSPos, normalize(vSNrm), vSU, vSSurf, vSNy);
        diffuseColor.rgb = tS.albedo;`,
            )
            .replace(
              "#include <roughnessmap_fragment>",
              "float roughnessFactor = tS.rough;",
            )
            .replace(
              "#include <normal_fragment_maps>",
              `#include <normal_fragment_maps>
        normal = normalize((viewMatrix * vec4(tS.n, 0.0)).xyz);`,
            )
            .replace(
              "#include <lights_fragment_end>",
              `#include <lights_fragment_end>
        reflectedLight.indirectDiffuse *= tS.ao;
        reflectedLight.indirectSpecular *= tS.ao;
        reflectedLight.directDiffuse *= mix(0.75, 1.0, tS.ao);`,
            )));
    }),
    (e.customProgramCacheKey = () => "wg-terrain-soil"),
    e
  );
}
export { createTerrainSoilMaterial };
