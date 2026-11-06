// Reconstructed module: identifiers and file boundaries are refactor choices.
import { TERRARIUM_BOUNDS, WATER_LEVEL_CONFIG } from "../core/config.js";
import { TOWN_PATH_GLSL } from "./town-path-texture.js";
import { FARM_GROUND_GLSL } from "./farm-texture.js";
import { WOODWORKING_GROUND_GLSL } from "./woodworking-texture.js";
import { HIKING_GROUND_GLSL } from "./hiking-texture.js";
const formatTerrainShaderFloat = (r) => r.toFixed(4);
const TERRAIN_SNOW_LIFT_GLSL = `
#define T_BASE_LAKE ${formatTerrainShaderFloat(WATER_LEVEL_CONFIG.lakeLevel)}
#define T_BOTTOM_Y ${formatTerrainShaderFloat(TERRARIUM_BOUNDS.bottomY)}
float tAlpineSnow(vec3 p) {
  float outside = max(abs(p.x) - ${formatTerrainShaderFloat(TERRARIUM_BOUNDS.halfW)}, abs(p.z) - ${formatTerrainShaderFloat(TERRARIUM_BOUNDS.halfD)});
  float line = 4.25 + wgNoise(p.xz * 1.35 + 23.0) * 0.55;
  return smoothstep(0.55, 1.4, outside) * smoothstep(line, line + 0.85, p.y);
}
float tSnowLift(vec3 p, float ny) {
  float d = max(groundAt(p.xz).x, tAlpineSnow(p) * 0.65);
  float dry = smoothstep(uWaterLevel - 0.01, uWaterLevel + 0.04, p.y) * (1.0 - terrainAt(p.xz).y);
  return min(d, 1.2) * 0.05 * (0.3 + 0.7 * smoothstep(0.45, 0.9, ny)) * dry;
}
`;
const TERRAIN_DETAIL_COMMON_GLSL = `
${TOWN_PATH_GLSL}
${FARM_GROUND_GLSL}
${WOODWORKING_GROUND_GLSL}
${HIKING_GROUND_GLSL}
uniform sampler2D uTDetail;
uniform float uTIce;

// Cellular noise: x = F1, y = F2, z = hash of the nearest cell; toF = offset to its feature point.
vec3 tCell(vec2 p, out vec2 toF) {
  vec2 i = floor(p), fr = fract(p);
  float d1 = 8.0, d2 = 8.0, id = 0.0;
  toF = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 c = i + g;
      vec2 r = g + vec2(wgHash(c), wgHash(c + 17.31)) * 0.8 + 0.1 - fr;
      float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; id = wgHash(c + 5.17); toF = r; }
      else if (d < d2) { d2 = d; }
    }
  }
  return vec3(sqrt(d1), sqrt(d2), id);
}

// Animated caustic web (iterated domain warp); bright thin filaments on a dark field.
float tCaustic(vec2 p, float t) {
  vec2 q = p * 6.0 - 250.0;
  vec2 i = q;
  float c = 1.0;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - 3.5 / float(n + 1));
    i = q + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(q.x / (sin(i.x + tt) / 0.005), q.y / (cos(i.y + tt) / 0.005)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}

// Expanding raindrop rings; returns a horizontal normal offset (xz).
vec2 tRipples(vec2 p, float t) {
  vec2 acc = vec2(0.0);
  for (int k = 0; k < 2; k++) {
    vec2 q = p * 7.5 + float(k) * vec2(0.43, 0.71);
    vec2 c = floor(q);
    vec2 d = fract(q) - 0.5 - (vec2(wgHash(c + 1.37), wgHash(c + 4.11)) - 0.5) * 0.4;
    float ph = fract(t * (0.8 + 0.3 * float(k)) + wgHash(c + float(k) * 7.31));
    float r = length(d);
    float x = r - ph * 0.42;
    float wave = sin(x * 70.0) * smoothstep(0.07, 0.0, abs(x)) * (1.0 - ph) * (1.0 - ph);
    acc += d / max(r, 1e-3) * wave;
  }
  return acc;
}

// Bump from a scalar height field H (world units) via screen derivatives (Mikkelsen 2010).
// Must be called in uniform control flow.
vec3 tBump(vec3 pos, vec3 n, float H) {
  vec3 dpx = dFdx(pos), dpy = dFdy(pos);
  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx);
  float det = dot(dpx, r1);
  vec3 grad = sign(det) * (dFdx(H) * r1 + dFdy(H) * r2);
  return normalize(abs(det) * n - grad);
}

// Pebbles: shared by beaches, banks, beds and paths. x = inside mask, y = dome height, z = cell hash.
vec3 tPebbles(vec2 xz, float scale) {
  vec2 toF;
  vec3 c = tCell(xz * scale, toF);
  float pr = 0.26 + 0.2 * fract(c.z * 7.7);
  float inside = 1.0 - smoothstep(pr * 0.8, pr, c.x);
  float dome = sqrt(max(0.0, 1.0 - (c.x * c.x) / (pr * pr)));
  return vec3(inside, dome, c.z);
}

vec3 tPebbleColor(float id, float grain) {
  vec3 c = mix(vec3(0.17, 0.165, 0.155), vec3(0.36, 0.33, 0.29), fract(id * 13.3));
  c = mix(c, vec3(0.33, 0.23, 0.16), step(0.78, fract(id * 5.1)) * 0.7);
  c = mix(c, vec3(0.5, 0.48, 0.45), step(0.94, fract(id * 3.7)));
  return c * (0.85 + 0.3 * grain);
}

float tLum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
`;
const TERRAIN_SURFACE_GLSL = `
struct TSurf { vec3 albedo; float rough; vec3 n; float sparkle; float caustic; float ao; float puddle; float ripple; };

// Mountain rock: folded beds that show in patches, ridged crags, joints, rain streaks, lichen.
// out H = relief (world units), ao = cavity occlusion.
vec3 tRock(vec3 p, vec3 nG, float h, float fine, out float H, out float ao, out float cav) {
  float m1 = wgNoise3(p * 0.8 + 2.0);
  float fold = wgNoise3(p * 0.45 + 9.0) * 2.6 + wgNoise3(p * 1.3) * 0.7;
  float sy = p.y * 5.5 + fold + p.x * 0.3;
  float bandId = floor(sy), bf = fract(sy);
  float bh = wgHash(vec2(bandId, 3.1));
  float strata = smoothstep(0.38, 0.62, wgNoise3(p * 0.9 + 1.0));          // beds show in patches
  float crag = (1.0 - abs(wgNoise3(p * vec3(2.2, 1.1, 2.2)) * 2.0 - 1.0)) * 0.62
             + (1.0 - abs(wgNoise3(p * vec3(5.5, 3.0, 5.5) + 4.0) * 2.0 - 1.0)) * 0.38;
  float r1 = wgNoise3(p * 7.0);
  float r2 = wgNoise3(p * 23.0 + 3.0);
  vec3 rock = mix(vec3(0.13, 0.125, 0.12), vec3(0.3, 0.28, 0.25), m1 * 0.55 + crag * 0.45);
  rock = mix(rock, rock * mix(0.78, 1.18, bh), strata);
  rock = mix(rock, vec3(0.26, 0.18, 0.12), step(0.84, bh) * strata * 0.5);  // iron-stained beds
  float ledge = smoothstep(0.0, 0.3, bf) * smoothstep(1.0, 0.9, bf);    // continuous → no bump seams
  rock *= mix(1.0, 0.78 + 0.22 * ledge, strata);
  float r3 = wgNoise3(p * 64.0);                                            // close-up grain
  rock *= (0.68 + 0.32 * crag) * (0.84 + 0.26 * r1 + 0.14 * (r2 - 0.5)) * (1.0 + (r3 - 0.5) * 0.18 * fine);
  float cr = abs(wgNoise3(p * vec3(4.2, 0.8, 4.2) + bandId * 1.37) - 0.5);
  float crack = (1.0 - smoothstep(0.0, 0.07, cr)) * step(0.35, bh) * smoothstep(0.0, 0.1, bf) * smoothstep(1.0, 0.9, bf);
  rock *= 1.0 - crack * 0.22;
  rock *= 0.84 + 0.16 * smoothstep(0.2, 0.6, wgNoise3(p * vec3(10.0, 0.5, 10.0)));  // rain streaks
  float lich = smoothstep(0.67, 0.71, wgNoise3(p * 8.0 + 11.0)) * smoothstep(0.1, 0.6, nG.y);
  vec3 lichCol = mix(vec3(0.34, 0.37, 0.24), vec3(0.44, 0.3, 0.11), step(0.62, wgNoise(p.xz * 7.0 + p.y)));
  rock = mix(rock, lichCol * (0.8 + 0.3 * r2), lich * 0.6);
  rock = mix(rock, vec3(0.07, 0.11, 0.035), (1.0 - crag) * smoothstep(2.0, 0.9, h) * 0.5 * smoothstep(0.4, 0.62, r1));
  H = crag * 0.045 + ledge * 0.022 * strata + r1 * 0.018 + ((r2 - 0.5) * 0.01 + (r3 - 0.5) * 0.0025) * fine - crack * 0.012;
  ao = 1.0 - (1.0 - crag) * 0.35 - (1.0 - ledge) * 0.22 * strata - crack * 0.25;
  cav = clamp((1.0 - crag) * 0.8 + (1.0 - ledge) * 0.4 * strata, 0.0, 1.0);
  return rock;
}

TSurf terrainSurface(vec3 p, vec3 nG, float lift) {
  TSurf s;
  vec4 T = terrainAt(p.xz);
  vec4 G = groundAt(p.xz);
  vec4 D = texture2D(uTDetail, fieldUV(p.xz));
  vec3 townPath = max(townPathAt(p.xz), vec3(farmGroundAt(p.xz), 0.0, 0.0));
  townPath = max(townPath, woodworkingGroundAt(p.xz));
  townPath = max(townPath, hikingGroundAt(p.xz));
  float fw = length(fwidth(p));
  float fine = 1.0 - smoothstep(0.012, 0.05, fw);   // fade sub-pixel detail
  float h = p.y - lift;                             // ground height under the snow
  float slope = 1.0 - nG.y;
  float wl = uWaterLevel;
  vec3 V = normalize(cameraPosition - p);

  float nA = wgNoise(p.xz * 0.85 + 3.7);
  float nB = wgNoise(p.xz * 3.1 - 1.3);
  float nC = wgNoise(p.xz * 10.0 + 7.1);
  float nD = wgNoise(p.xz * 31.0 - 2.9);
  float n3 = wgNoise3(p * 2.4);
  float autumn = smoothstep(1.35, 2.0, uSeason) * (1.0 - smoothstep(2.6, 3.2, uSeason));
  float winter = smoothstep(2.55, 3.1, uSeason) * (1.0 - smoothstep(3.6, 3.95, uSeason));

  // ---- where is what
  float underwater = smoothstep(wl + 0.004, wl - 0.03, h);
  float depth = max(0.0, wl - h);
  float riverBed = smoothstep(0.35, 0.85, T.y);
  float alpine = smoothstep(1.3, 2.4, h + (nA - 0.5) * 0.6);
  float rockM = smoothstep(0.3, 0.46, slope + (n3 - 0.5) * 0.3);
  rockM = max(rockM, smoothstep(2.5, 3.3, h + (nA - 0.5) * 0.8 + (nB - 0.5) * 0.3) * smoothstep(0.02, 0.1, slope + nB * 0.05));
  rockM = max(rockM, alpine * smoothstep(0.58, 0.7, n3 * 0.65 + nB * 0.35) * smoothstep(0.1, 0.22, slope));
  rockM *= 1.0 - riverBed;
  float bankM = smoothstep(0.42, 0.78, D.r + (nB - 0.5) * 0.3 + (nC - 0.5) * 0.12) * (1.0 - rockM * 0.7);
  float beachM = D.g * smoothstep(T_BASE_LAKE + 0.24, T_BASE_LAKE + 0.1, h + (nB - 0.5) * 0.08 + (nC - 0.5) * 0.03);
  float bareM = smoothstep(0.3, 0.62, D.b + (nB - 0.5) * 0.46 + (nC - 0.5) * 0.24) * (1.0 - rockM);
  bareM = max(bareM, townPath.r * (1.0 - rockM * 0.7));
  float beachW = beachM * (1.0 - bankM * 0.5);

  // pebbles only where some pebbly material shows (branching is safe: derivatives are taken
  // on the final height outside any branch)
  vec3 peb = vec3(0.0);
  vec3 pebCol = vec3(0.3);
  if (bareM + bankM + beachW + riverBed + underwater > 0.003) {
    peb = tPebbles(p.xz, 26.0);
    pebCol = tPebbleColor(peb.z, nD);
  }

  // ---- meadow floor: what shows between the grass blades
  float dryP = smoothstep(0.32, 0.78, nA * 0.55 + nB * 0.3 + nC * 0.15 + alpine * 0.3);
  vec3 grass = mix(uGrassColor, uGrassDry, dryP);
  float tuft = nC * 0.55 + nD * 0.45;
  vec3 col = grass * (0.4 + 0.34 * tuft);
  float band = dot(p.xz, vec2(0.8, 0.6)) * 2.6 + nA * 1.4;          // soft mowing-like streaks
  col *= 1.0 + (smoothstep(0.3, 0.7, abs(fract(band) - 0.5) * 2.0) - 0.5) * 0.14 * (1.0 - alpine);
  // autumn: russet patches, but damp hollows and banks hang on to their green
  float damp = clamp(D.r * 0.9 + D.a * 0.7 + D.g * 0.3, 0.0, 1.0);
  col = mix(col, vec3(0.28, 0.14, 0.05) * (0.6 + 0.6 * tuft), autumn * smoothstep(0.4, 0.85, nB * 0.5 + nA * 0.3 + nD * 0.2) * 0.6);
  col = mix(col, vec3(0.12, 0.17, 0.05) * (0.6 + 0.6 * tuft), autumn * smoothstep(0.3, 0.7, damp + (nB - 0.5) * 0.5) * 0.65);
  col = mix(col, vec3(0.33, 0.28, 0.18) * (0.6 + 0.5 * tuft), winter * 0.6);
  col = mix(col, mix(col, vec3(0.22, 0.2, 0.14), 0.55) * (0.8 + 0.4 * nD), alpine * 0.65);
  float rough = 0.92;
  float H = (tuft - 0.5) * 0.008 * fine;
  float ao = 1.0;
  float cav = 0.5;   // rock cavities (gullies, bedding ledges) hold snow on steep faces

  // ---- bare, trodden earth (cabin clearing, paths, under trees, around rocks)
  if (bareM > 0.001) {
    vec3 soil = mix(vec3(0.16, 0.11, 0.07), vec3(0.25, 0.18, 0.115), nC) * (0.82 + 0.36 * nD);
    float trod = smoothstep(0.62, 0.95, D.b);
    soil = mix(soil, vec3(0.36, 0.29, 0.2) * (0.9 + 0.2 * nD), trod * 0.6);
    float litter = smoothstep(0.55, 0.8, nD * 0.7 + nC * 0.3) * (1.0 - trod);
    soil = mix(soil, mix(vec3(0.2, 0.11, 0.05), vec3(0.6, 0.27, 0.06), autumn), litter * 0.55);
    float sp = step(fract(peb.z * 3.3), 0.16) * peb.x;
    soil = mix(soil, pebCol * 0.75, sp);
    col = mix(col, soil, bareM);
    rough = mix(rough, 0.95, bareM);
    H = mix(H, (sp * peb.y * 0.006 + (nD - 0.5) * 0.004 * (1.0 - trod)) * fine, bareM);
  }

  // ---- rich dark river banks with pebbles and moss
  if (bankM > 0.001) {
    vec3 bank = mix(vec3(0.07, 0.05, 0.035), vec3(0.12, 0.088, 0.055), nC);
    bank = mix(bank, vec3(0.1, 0.15, 0.045), smoothstep(0.55, 0.75, nB) * 0.6 * (1.0 - D.r * 0.5));
    float bp = step(fract(peb.z * 3.3), mix(0.25, 0.85, D.r)) * peb.x;
    bank = mix(bank, pebCol * 0.8, bp);
    col = mix(col, bank, bankM);
    rough = mix(rough, 0.8, bankM);
    H = mix(H, bp * peb.y * 0.009 * fine, bankM);
  }

  // ---- sandy, pebbly beach
  if (beachW > 0.001) {
    vec3 sand = mix(vec3(0.42, 0.35, 0.25), vec3(0.54, 0.46, 0.33), nC) * (0.88 + 0.24 * nD);
    sand *= 1.0 + 0.06 * sin(dot(p.xz, vec2(0.35, 1.0)) * 70.0 + nB * 6.0) * fine;  // ripple marks
    float bsp = step(fract(peb.z * 3.3), 0.3 + 0.35 * smoothstep(0.12, 0.0, h - T_BASE_LAKE)) * peb.x;
    sand = mix(sand, pebCol, bsp);
    col = mix(col, sand, beachW);
    rough = mix(rough, 0.9, beachW);
    H = mix(H, bsp * peb.y * 0.008 * fine, beachW);
  }

  // ---- rock
  if (rockM > 0.001) {
    float rH, rAO;
    vec3 rock = tRock(p, nG, h, fine, rH, rAO, cav);
    col = mix(col, rock, rockM);
    rough = mix(rough, 0.84, rockM);
    H = mix(H, rH, rockM);
    ao = mix(1.0, rAO, rockM);
  }

  // ---- village earth paths, part of the same terrain surface, not floating slabs
  // Soft ragged verges, worn tracks and sparse grit stay at world scale.
  float road = townPath.r * (1.0 - underwater);
  road = clamp(road + (nC - 0.5) * 0.18 * road * (1.0 - road), 0.0, 1.0);
  if (road > 0.001) {
    float grit = step(fract(peb.z * 3.3), 0.08 + townPath.b * 0.19) * peb.x;
    float gritNoise = wgNoise(p.xz * 93.0 + 6.7);
    vec3 earth = mix(vec3(0.23, 0.172, 0.112), vec3(0.34, 0.274, 0.183), nB * 0.35 + nC * 0.65);
    earth *= 0.90 + 0.18 * nD + (gritNoise - 0.5) * 0.10 * fine;
    earth *= 1.0 - townPath.g * 0.11;
    earth = mix(earth, pebCol * 0.91, grit * 0.68);
    float edgeMoss = townPath.b * smoothstep(0.44, 0.78, nC) * 0.23;
    earth = mix(earth, uGrassColor * 0.48, edgeMoss);
    col = mix(col, earth, road);
    rough = mix(rough, 0.96 - townPath.g * 0.08, road);
    float roadRelief = (nD - 0.5) * 0.002 + grit * peb.y * 0.0035 - townPath.g * 0.002;
    H = mix(H, roadRelief * fine, road);
  }

  // ---- river bed and lake floor
  float sub = max(underwater, riverBed);
  float caus = 0.0;
  if (sub > 0.001) {
    float bedP = step(fract(peb.z * 3.3), 0.8) * peb.x;
    col = mix(col, mix(vec3(0.15, 0.13, 0.095), pebCol * 0.85, bedP), riverBed);
    H = mix(H, bedP * peb.y * 0.008 * fine, riverBed);
    vec3 silt = mix(vec3(0.23, 0.21, 0.155), vec3(0.15, 0.16, 0.125), smoothstep(0.0, 0.35, depth)) * (0.85 + 0.3 * nC);
    col = mix(col, mix(col, silt, 0.35 + 0.65 * smoothstep(0.02, 0.25, depth)), underwater);
    col *= mix(1.0, 0.62, sub);
    col *= mix(vec3(1.0), vec3(0.72, 0.86, 0.84) * exp(-depth * 0.9), underwater);
    rough = mix(rough, 0.85, sub);   // the shine belongs to the water surface, not the bed
    float cd = max(depth * underwater, riverBed * 0.08);
    caus = tCaustic(p.xz, uTime * 0.6) * 0.7 + tCaustic(vec2(p.z, -p.x) * 0.73 + 3.0, uTime * 0.47 + 1.7) * 0.5;
    caus *= smoothstep(0.0, 0.03, cd) * exp(-cd * 1.4) * sub * (1.0 - uTIce) * (1.0 - uNight) * (1.0 - uStorm * 0.6);
  }

  // ---- wetness: darker, richer, glossier
  float wet = G.y;
  wet = max(wet, bankM * 0.55 * smoothstep(0.5, 1.0, D.r));
  wet = max(wet, beachM * smoothstep(wl + 0.07, wl, h));
  wet *= 1.0 - sub;
  float por = 1.0 - rockM * 0.45;
  float turf = (1.0 - bareM) * (1.0 - bankM) * (1.0 - beachW) * (1.0 - rockM);
  col *= 1.0 - wet * 0.5 * por;
  col = mix(vec3(tLum(col)), col, 1.0 + wet * 0.15);
  rough = mix(rough, mix(mix(0.3, 0.62, turf), 0.2, rockM), wet);   // soil & rock glisten, turf just darkens

  // ---- puddles in flat hollows
  float flatG = smoothstep(0.045, 0.01, slope);
  float pudN = D.a * 1.3 + (nB - 0.5) * 0.55 + (nC - 0.5) * 0.18 + wet * 0.25;
  float puddle = smoothstep(0.5, 0.58, pudN) * flatG * smoothstep(0.35, 0.7, wet) * (1.0 - rockM) * (1.0 - sub);

  // ---- snow: flat tops first, patchy edges, soft drifts
  float snow = 0.0;
  float alpineSnow = tAlpineSnow(vec3(p.x, h, p.z));
  if (G.x > 0.004 || alpineSnow > 0.004) {
    float sc = max(snowCover(p.xz, nG), alpineSnow);
    sc *= 1.0 - smoothstep(0.26, 0.52, slope) * mix(0.95, 0.3, cav * rockM);  // steep faces shed it
    float sN = wgNoise(p.xz * 2.2 + 1.7) * 0.55 + nC * 0.3 + nD * 0.15;
    snow = smoothstep(sN * 0.75, sN * 0.75 + 0.22, sc) * (1.0 - sub);
    col = mix(col, vec3(0.55, 0.58, 0.63) * (0.95 + 0.05 * nC), snow);
    rough = mix(rough, 0.62, snow);
    H = mix(H, nB * 0.03 + nC * 0.008, snow);
    ao = mix(ao, 1.0, snow * 0.7);
  }
  puddle *= 1.0 - snow;
  col *= 1.0 - smoothstep(0.0, 0.5, puddle) * (1.0 - puddle) * 0.5;     // soaked rim
  col = mix(col, vec3(0.045, 0.042, 0.034), puddle);                  // muddy water
  rough = mix(rough, 0.03, puddle);

  // ---- frost rime on cold ground
  float frost = G.w * (1.0 - snow) * (1.0 - sub);
  frost *= 1.0 - 0.7 * smoothstep(0.1, 0.6, dot(nG, uSunDir)) * (1.0 - uNight);   // sunny slopes thaw first
  frost *= 0.75 + 0.25 * smoothstep(0.3, 0.7, nA);
  float rime = frost * (0.06 + 0.16 * smoothstep(0.5, 0.85, nD * 0.6 + nC * 0.4)) * (1.0 - wet * 0.6);
  col = mix(col, vec3(tLum(col)) * vec3(1.02, 1.06, 1.12), frost * 0.22);   // dulled, bluish
  col = mix(col, vec3(0.6, 0.65, 0.7), rime);

  // ---- normal: micro relief, flat puddle mirrors dimpled by rain rings
  vec3 n = tBump(p, nG, H * (1.0 - puddle));
  vec2 rip = vec2(0.0);
  if (G.z > 0.02 && wet + puddle > 0.05) rip = tRipples(p.xz, uTime) * G.z * (1.0 - snow);
  n = normalize(mix(n, normalize(vec3(rip.x * 0.9, 1.0, rip.y * 0.9)), puddle));
  n = normalize(n + vec3(rip.x, 0.0, rip.y) * 0.3 * wet * (1.0 - puddle));

  // ---- glints: snow crystals and frost
  float spark = 0.0;
  float glintAmt = snow + frost * 0.3;
  if (glintAmt > 0.01) {
    vec3 gc = floor(p * 70.0);
    vec3 gn = normalize(vec3(wgHash3(gc + 1.7), wgHash3(gc + 3.1), wgHash3(gc + 5.3)) * 2.0 - 1.0 + vec3(0.0, 0.7, 0.0));
    spark = step(0.9, wgHash3(gc + 0.5)) * pow(max(dot(gn, normalize(uLightDir + V)), 0.0), 80.0) * glintAmt;
  }

  s.albedo = col;
  s.rough = clamp(rough, 0.03, 1.0);
  s.n = n;
  s.sparkle = spark;
  s.caustic = caus;
  s.ao = ao * (1.0 - D.a * 0.12);
  s.puddle = puddle;
  s.ripple = length(rip);
  return s;
}
`;
const TERRAIN_SURFACE_VARYINGS_GLSL = `varying vec3 vTPos;
varying vec3 vTNrm;
varying float vTLift;
`;
export {
  TERRAIN_DETAIL_COMMON_GLSL,
  TERRAIN_SNOW_LIFT_GLSL,
  TERRAIN_SURFACE_GLSL,
  TERRAIN_SURFACE_VARYINGS_GLSL,
};
