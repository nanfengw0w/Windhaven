const LANDMARK_SURFACE_KINDS = Object.freeze({
  masonry: 0,
  stone: 1,
  ballast: 2,
  timber: 3,
  slate: 4,
});

const VERTEX_DECLARATIONS = `
varying vec3 vLmWorld;
varying vec3 vLmLocal;
varying vec3 vLmScale;
varying vec3 vLmLocalNormal;
varying float vLmSeed;
`;

const VERTEX_SURFACE_COORDINATES = `
{
  mat4 lmTransform = modelMatrix;
  #ifdef USE_INSTANCING
    lmTransform = modelMatrix * instanceMatrix;
  #endif
  vLmScale = vec3(length(lmTransform[0].xyz), length(lmTransform[1].xyz), length(lmTransform[2].xyz));
  vLmLocal = transformed * vLmScale;
  vLmLocalNormal = normalize(objectNormal / max(vLmScale, vec3(0.00001)));
  vLmWorld = (lmTransform * vec4(transformed, 1.0)).xyz;
  vLmSeed = fract(sin(dot(lmTransform[3].xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
}
`;

const FRAGMENT_SURFACES = `
varying vec3 vLmWorld;
varying vec3 vLmLocal;
varying vec3 vLmScale;
varying vec3 vLmLocalNormal;
varying float vLmSeed;

struct LmSurface { vec3 color; float roughness; float height; float ao; };

float lmHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float lmNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(lmHash(i), lmHash(i + vec2(1.0, 0.0)), f.x),
             mix(lmHash(i + vec2(0.0, 1.0)), lmHash(i + 1.0), f.x), f.y);
}
float lmNoise3(vec3 p) {
  return (lmNoise(p.xy + p.z * vec2(0.73, -0.41))
        + lmNoise(p.yz + p.x * vec2(-0.37, 0.61))) * 0.5;
}
float lmLum(vec3 color) { return dot(color, vec3(0.2126, 0.7152, 0.0722)); }

// Every coordinate is measured in scene units after instance scaling. A long
// beam therefore gets more fibres, not a stretched copy of a unit-box texture.
vec2 lmProjection(vec3 p, vec3 n) {
  vec3 a = abs(n);
  if (a.y >= a.x && a.y >= a.z) return p.xz;
  return a.x > a.z ? p.zy : p.xy;
}

// F1/F2 cells with angular distance contours, used for sharp quarried chips.
vec3 lmGravelCell(vec2 p, out vec2 nearest) {
  vec2 cell = floor(p), f = fract(p);
  float first = 10.0, second = 10.0, id = 0.0;
  nearest = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 index = cell + offset;
      vec2 feature = vec2(lmHash(index), lmHash(index + 19.71));
      vec2 delta = offset + 0.12 + feature * 0.76 - f;
      vec2 a = abs(delta);
      float distance = max(a.x * 0.94 + a.y * 0.24, a.y * 0.95 + a.x * 0.19);
      if (distance < first) {
        second = first; first = distance; id = lmHash(index + 7.13); nearest = delta;
      } else if (distance < second) second = distance;
    }
  }
  return vec3(first, second, id);
}

LmSurface lmSurface(vec3 base, float baseRoughness, vec3 worldNormal) {
  LmSurface s;
  s.color = base;
  s.roughness = baseRoughness;
  s.height = 0.0;
  s.ao = 1.0;
  vec3 p = vLmLocal;
  vec3 localNormal = normalize(vLmLocalNormal);
  vec2 q = lmProjection(p, localNormal);
  float seed = vLmSeed;
  float pixel = length(fwidth(vLmWorld));
  float grainAA = 1.0 - smoothstep(0.0015, 0.008, pixel);
  float reliefAA = 1.0 - smoothstep(0.004, 0.024, pixel);
  float broad = lmNoise3(vLmWorld * 11.0 + 4.1);
  float grain = lmNoise3(vLmWorld * 175.0 + 1.7);
  float up = smoothstep(0.25, 0.85, worldNormal.y);

  #if LM_SURFACE_KIND == 0
    // Irregular, staggered fieldstone courses with recessed lime mortar.
    // World Y aligns courses across adjacent support pieces and bridge piers.
    vec2 wall = lmProjection(p, localNormal);
    if (abs(localNormal.y) < 0.65) wall.y = vLmWorld.y;
    wall.x += seed * 0.17;
    float rowHeight = 0.038;
    float row = floor(wall.y / rowHeight);
    float stoneWidth = 0.068 + 0.032 * lmHash(vec2(row, seed * 11.0));
    float stagger = mod(row, 2.0) * 0.5 + (lmHash(vec2(row, 3.1)) - 0.5) * 0.16;
    float column = wall.x / stoneWidth + stagger;
    vec2 cell = vec2(floor(column), row);
    vec2 f = vec2(fract(column) * stoneWidth, fract(wall.y / rowHeight) * rowHeight);
    vec2 edge = min(f, vec2(stoneWidth, rowHeight) - f);
    float irregular = (lmNoise3(vLmWorld * 81.0) - 0.5) * 0.0008;
    float edgeDistance = min(edge.x, edge.y) + irregular;
    float aa = max(pixel * 0.65, 0.00015);
    float mortar = 1.0 - smoothstep(0.0006 - aa, 0.0018 + aa, edgeDistance);
    float courseAA = 1.0 - smoothstep(0.011, 0.036, pixel);
    mortar *= courseAA;
    float id = mix(0.5, lmHash(cell + seed * 17.0), courseAA);
    vec3 rock = base * (0.72 + id * 0.50) * (0.88 + broad * 0.23);
    rock *= 1.0 + (grain - 0.5) * 0.28 * grainAA;
    rock = mix(rock, rock * vec3(1.10, 0.99, 0.86), smoothstep(0.79, 0.96, id) * 0.38);
    vec3 lime = mix(base * 0.67, vec3(lmLum(base) * 0.76 + 0.035), 0.65);
    s.color = mix(rock, lime * 0.72, mortar);
    float cavity = 1.0 - smoothstep(0.001, 0.0055, edgeDistance);
    float moss = smoothstep(0.69, 0.84, lmNoise3(vLmWorld * 36.0 + 8.1));
    moss *= (0.18 + cavity * 0.35) * (0.6 + up * 0.4);
    s.color = mix(s.color, base * vec3(0.45, 0.59, 0.29), moss);
    s.height = ((broad - 0.5) * 0.0008 + (grain - 0.5) * 0.00065 * grainAA
      - cavity * 0.0015 * courseAA) * reliefAA;
    s.roughness = clamp(0.81 + broad * 0.10 + mortar * 0.06 + moss * 0.05, 0.0, 1.0);
    s.ao = 1.0 - mortar * 0.24 - cavity * 0.09 * courseAA;
  #elif LM_SURFACE_KIND == 1
    // Single dressed stones: smooth worn treads, rough risers, chips and veins.
    // No brick-grid pattern is imposed on an individual stair or coping slab.
    float coarse = mix(broad, lmNoise3(vLmWorld * 37.0 + seed * 7.0), reliefAA);
    float veinN = lmNoise3(vLmWorld * vec3(58.0, 93.0, 47.0) + 2.7);
    float vein = (1.0 - smoothstep(0.012, 0.047 + pixel * 5.0, abs(veinN - 0.49))) * grainAA;
    vec3 normalized = abs(p) / max(vLmScale, vec3(0.00001));
    float largest = max(normalized.x, max(normalized.y, normalized.z));
    float smallest = min(normalized.x, min(normalized.y, normalized.z));
    float middle = normalized.x + normalized.y + normalized.z - largest - smallest;
    float arris = smoothstep(0.41, 0.495, middle);
    float wear = up * smoothstep(0.22, 0.72, broad) * (1.0 - arris * 0.6);
    s.color = base * (0.78 + coarse * 0.40) * (1.0 + (grain - 0.5) * 0.23 * grainAA);
    s.color *= 1.0 - vein * 0.15;
    s.color = mix(s.color, s.color * 1.14 + 0.008, wear * 0.55 + arris * 0.15);
    float moss = smoothstep(0.72, 0.86, lmNoise3(vLmWorld * 49.0 + 13.0)) * arris * 0.26;
    s.color = mix(s.color, base * vec3(0.40, 0.57, 0.28), moss);
    s.height = ((coarse - 0.5) * mix(0.0015, 0.00065, wear)
      + (grain - 0.5) * 0.00065 * grainAA - vein * 0.0007 - arris * 0.0008) * reliefAA;
    s.roughness = mix(0.92, 0.64, wear) + moss * 0.04;
    s.ao = 1.0 - vein * 0.08;
  #elif LM_SURFACE_KIND == 2
    // Angular 6–10 mm scene-scale ballast, with dark interstices and chipped
    // planar facets. Macro variation survives after small grains become subpixel.
    vec2 gravelUV = lmProjection(vLmWorld, worldNormal) * 125.0;
    vec2 nearest;
    vec3 cell = lmGravelCell(gravelUV, nearest);
    float cellPixel = max(length(dFdx(gravelUV)), length(dFdy(gravelUV)));
    float cellAA = 1.0 - smoothstep(0.42, 1.25, cellPixel);
    float gap = 1.0 - smoothstep(0.025, 0.115 + cellPixel * 0.06, cell.y - cell.x);
    float facets = max(0.0, 0.55 - dot(abs(nearest), vec2(0.72, 0.95)));
    vec3 chip = base * (0.54 + cell.z * 0.74);
    chip = mix(chip, chip * vec3(0.90, 0.98, 1.08), step(0.64, cell.z) * 0.32);
    chip = mix(chip, chip * vec3(1.12, 1.01, 0.86), step(0.88, fract(cell.z * 7.3)) * 0.34);
    chip *= 0.83 + facets * 0.38;
    chip *= 1.0 - gap * 0.38;
    s.color = mix(base * (0.70 + broad * 0.25), chip, cellAA);
    s.color *= 1.0 + (grain - 0.5) * 0.14 * grainAA;
    s.height = (facets * 0.0022 - gap * 0.0011) * cellAA;
    s.roughness = 0.90 + gap * 0.07 * cellAA;
    s.ao = 1.0 - gap * 0.28 * cellAA;
  #elif LM_SURFACE_KIND == 3
    // Grain runs along the longest physical axis, including rotated, thin
    // sleepers, posts and long beams. End grain uses the remaining two axes.
    vec3 g = p;
    vec3 gn = localNormal;
    if (vLmScale.y >= vLmScale.x && vLmScale.y >= vLmScale.z) { g = p.yxz; gn = localNormal.yxz; }
    else if (vLmScale.z >= vLmScale.x && vLmScale.z >= vLmScale.y) { g = p.zxy; gn = localNormal.zxy; }
    float crossGrain = g.y * 0.73 + g.z;
    float slow = lmNoise(vec2(g.x * 8.0 + seed * 13.0, crossGrain * 31.0));
    float phase = crossGrain * 260.0 + slow * 2.0;
    float fiber = smoothstep(0.43, 0.56, fract(phase)) * (1.0 - smoothstep(0.73, 0.86, fract(phase)));
    float fiberAA = 1.0 - smoothstep(0.35, 1.2, fwidth(phase));
    float streak = mix(broad, lmNoise(vec2(g.x * 5.0 + seed, crossGrain * 91.0)), reliefAA);
    float checks = smoothstep(0.75, 0.89, lmNoise(vec2(g.x * 9.0 + seed * 11.0, crossGrain * 155.0)));
    vec2 knotUV = vec2(g.x * 11.0, crossGrain * 34.0) + seed * 9.0;
    vec2 knotCell = floor(knotUV), knotPos = fract(knotUV) - 0.5;
    float knot = (1.0 - smoothstep(0.045, 0.22, length(knotPos * vec2(0.75, 1.3)))) * step(0.78, lmHash(knotCell));
    float endFace = smoothstep(0.70, 0.90, abs(gn.x));
    float ringPhase = length(g.yz + vec2(0.009, -0.014)) * 210.0 + lmNoise(g.yz * 49.0 + seed) * 1.3;
    float rings = smoothstep(0.46, 0.61, fract(ringPhase)) * (1.0 - smoothstep(0.75, 0.91, fract(ringPhase)));
    float ringAA = 1.0 - smoothstep(0.35, 1.2, fwidth(ringPhase));
    float grainLines = mix(fiber * fiberAA, rings * ringAA, endFace);
    s.color = base * (0.80 + streak * 0.33) * (0.88 + seed * 0.20);
    s.color *= 1.0 - grainLines * 0.25 - checks * 0.38 * grainAA - knot * 0.27 * reliefAA;
    s.color = mix(s.color, vec3(lmLum(s.color)) * vec3(1.08, 1.04, 0.98), up * broad * 0.18);
    s.color = mix(s.color, s.color * 1.16, endFace * 0.45);
    s.height = ((streak - 0.5) * 0.0004 - grainLines * 0.00045
      - checks * 0.0010 * grainAA - knot * 0.0008) * reliefAA;
    s.roughness = clamp(0.76 + streak * 0.15 + checks * 0.05 * grainAA - up * 0.06, 0.0, 1.0);
    s.ao = 1.0 - checks * 0.12 * grainAA - knot * 0.06;
  #elif LM_SURFACE_KIND == 4
    // Courses follow the roof's physical slope; the long axis is the ridge.
    // Small staggered slate tabs and overlap shadows break up broad canopies.
    bool ridgeZ = vLmScale.z >= vLmScale.x;
    float ridge = ridgeZ ? p.z : p.x;
    float across = ridgeZ ? p.x : p.z;
    float down = abs(across) / max(abs(localNormal.y), 0.15);
    float rowHeight = 0.032;
    float row = floor(down / rowHeight);
    float tileWidth = 0.034 + 0.007 * lmHash(vec2(row, seed + 2.3));
    float tx = ridge / tileWidth + mod(row, 2.0) * 0.5;
    vec2 tile = vec2(floor(tx), row);
    vec2 f = vec2(fract(tx), fract(down / rowHeight));
    vec2 aa = max(fwidth(vec2(tx, down / rowHeight)), vec2(0.002));
    float tabGap = 1.0 - smoothstep(0.012, 0.045 + aa.x * 0.5, min(f.x, 1.0 - f.x));
    float overlap = 1.0 - smoothstep(0.015, 0.17 + aa.y * 0.4, f.y);
    float tileAA = 1.0 - smoothstep(0.35, 1.3, max(aa.x, aa.y));
    float id = mix(0.5, lmHash(tile + seed * 17.0), tileAA);
    vec3 slate = base * (0.73 + id * 0.44) * (0.91 + broad * 0.17);
    slate *= 1.0 + (grain - 0.5) * 0.19 * grainAA;
    slate *= 1.0 - (tabGap * 0.25 + overlap * 0.31) * tileAA;
    slate = mix(slate, slate * vec3(0.87, 0.98, 1.11), step(0.72, id) * 0.22);
    float moss = smoothstep(0.72, 0.86, lmNoise3(vLmWorld * 33.0 + 1.3)) * (0.25 + overlap * 0.55) * 0.22;
    s.color = mix(slate, base * vec3(0.48, 0.68, 0.34), moss);
    s.height = ((smoothstep(0.03, 0.96, f.y) * 0.0014 - overlap * 0.0005 - tabGap * 0.0007) * tileAA
      + (grain - 0.5) * 0.0004 * grainAA) * reliefAA;
    s.roughness = clamp(0.69 + id * 0.14 + moss * 0.16 + tabGap * 0.04 * tileAA, 0.0, 1.0);
    s.ao = 1.0 - (overlap * 0.22 + tabGap * 0.12) * tileAA;
  #endif

  #ifdef LM_SURFACE_WEATHER
    vec4 ground = groundAt(vLmWorld.xz);
    float exposure = smoothstep(-0.35, 0.55, worldNormal.y);
    float wet = clamp(ground.y * 0.80 + ground.z * 0.30, 0.0, 1.0) * (0.55 + exposure * 0.45);
    float snow = snowCover(vLmWorld.xz, worldNormal) * smoothstep(0.26, 0.82, worldNormal.y);
    float frost = ground.w * exposure * 0.18 * (1.0 - snow);
    s.color *= 1.0 - wet * 0.34 * (1.0 - snow);
    s.roughness = mix(s.roughness, max(0.25, s.roughness * 0.52), wet);
    s.color = mix(s.color, vec3(lmLum(s.color)) * vec3(1.03, 1.08, 1.14) + 0.035, frost);
    vec3 snowColor = vec3(0.56, 0.59, 0.65) * (0.96 + grain * 0.07);
    s.color = mix(s.color, snowColor, snow);
    s.roughness = mix(s.roughness, 0.68, snow);
    s.height *= (1.0 - wet * 0.18) * (1.0 - snow * 0.88);
    s.ao = mix(s.ao, 1.0, snow * 0.70);
  #endif
  s.roughness = clamp(s.roughness, 0.08, 1.0);
  return s;
}

// Surface-gradient bump in view space. Evaluate unconditionally for valid
// screen derivatives, including when distance has faded the relief to zero.
vec3 lmBumpNormal(vec3 position, vec3 normal, float height) {
  vec3 dx = dFdx(position), dy = dFdy(position);
  vec3 r1 = cross(dy, normal), r2 = cross(normal, dx);
  float det = dot(dx, r1);
  vec3 gradient = sign(det) * (dFdx(height) * r1 + dFdy(height) * r2);
  vec3 result = abs(det) * normal - gradient;
  return dot(result, result) > 1e-20 ? normalize(result) : normal;
}
`;

function bindLandmarkSurface(material, ctx, kind) {
  if (!(kind in LANDMARK_SURFACE_KINDS)) {
    throw new Error(`Unknown landmark surface: ${kind}`);
  }
  if (material.userData.landmarkSurface === kind) return material;
  if (material.userData.landmarkSurface) {
    throw new Error("A landmark material must have one surface kind");
  }
  const previousCompile = material.onBeforeCompile;
  const previousKey = material.customProgramCacheKey();
  const weather = Boolean(ctx?.GLSL_COMMON);
  material.userData.landmarkSurface = kind;
  material.onBeforeCompile = (shader, renderer) => {
    previousCompile.call(material, shader, renderer);
    if (weather) {
      Object.assign(shader.uniforms, ctx.uniforms);
      // bindMapClipping normally supplies the common field functions. Keep
      // standalone use valid without injecting a duplicate copy of them.
      if (!shader.fragmentShader.includes("vec4 groundAt(")) {
        shader.fragmentShader = ctx.GLSL_COMMON + shader.fragmentShader;
      }
    }
    shader.vertexShader =
      VERTEX_DECLARATIONS +
      shader.vertexShader.replace(
        "#include <project_vertex>",
        `${VERTEX_SURFACE_COORDINATES}\n#include <project_vertex>`,
      );
    shader.fragmentShader =
      `#define LM_SURFACE_KIND ${LANDMARK_SURFACE_KINDS[kind]}\n` +
      (weather ? "#define LM_SURFACE_WEATHER\n" : "") +
      shader.fragmentShader
        .replace("#include <common>", `#include <common>\n${FRAGMENT_SURFACES}`)
        .replace(
          "#include <normal_fragment_maps>",
          `#include <normal_fragment_maps>
          vec3 lmWorldNormal = normalize(inverseTransformDirection(normal, viewMatrix));
          LmSurface lm = lmSurface(diffuseColor.rgb, roughnessFactor, lmWorldNormal);
          diffuseColor.rgb = lm.color;
          roughnessFactor = lm.roughness;
          normal = lmBumpNormal(-vViewPosition, normal, lm.height);`,
        )
        .replace(
          "#include <lights_fragment_end>",
          `#include <lights_fragment_end>
          reflectedLight.indirectDiffuse *= lm.ao;
          reflectedLight.indirectSpecular *= lm.ao;
          reflectedLight.directDiffuse *= mix(1.0, lm.ao, 0.28);`,
        );
  };
  material.customProgramCacheKey = () =>
    `${previousKey}-landmark-${kind}-${weather ? "weather" : "dry"}-v1`;
  material.needsUpdate = true;
  return material;
}

export { bindLandmarkSurface };
