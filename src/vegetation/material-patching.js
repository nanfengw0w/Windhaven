// Reconstructed module: identifiers and file boundaries are refactor choices.
import { TREE_SPECIES_GLSL } from "./tree-species.js";
const VEGETATION_COMMON_GLSL = `
#ifndef WG_VEG
#define WG_VEG
float vegAutumn() { return smoothstep(1.35, 2.0, uSeason) * (1.0 - smoothstep(2.6, 3.2, uSeason)); }
float vegWinter() { return smoothstep(2.55, 3.1, uSeason) * (1.0 - smoothstep(3.6, 3.95, uSeason)); }
/** 1 around mid-spring (cyclic), for fresh growth. */
float vegSpring() {
  float d = min(abs(uSeason - 0.35), abs(uSeason - 4.35));
  return smoothstep(0.9, 0.2, d);
}

/**
 * A blade of length L bending toward B (xz; |B| = total bend angle in radians) as a circular
 * arc, so its length is preserved however hard the wind pushes. Returns the offset of the
 * point at t (0 root … 1 tip) and the unit tangent there.
 */
vec3 vegArc(vec2 B, float L, float t, out vec3 T) {
  float th = max(length(B), 0.002);
  vec2 d = B / th;
  float a = th * t;
  float s = sin(a), c = cos(a);
  float r = L / th;
  T = vec3(d.x * s, c, d.y * s);
  return vec3(d.x * r * (1.0 - c), r * s, d.y * r * (1.0 - c));
}

/**
 * Wind bend (radians, xz) for grass-like plants rooted at xz. stiff > 1 = stiffer.
 * Crests travel downwind across the meadow (a travelling wave on top of the simulated
 * field), plus a quick flutter that grows with turbulence. gust returns the bend amount 0..1.
 */
vec2 vegWindBend(vec2 xz, float rnd, float stiff, out float gust) {
  vec2 W = windAt(xz);
  float sp = length(W);
  vec2 dir = sp > 1e-4 ? W / sp : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);
  float turb = windTurbAt(xz);
  float along = dot(xz, dir);
  // travelling crests (constant phase speed, so a changing wind never makes them jump)
  float wave = 0.5 + 0.5 * sin(along * 2.3 - uTime * (2.2 + min(sp, 4.0) * 0.5) + wgNoise(xz * 0.8) * 5.0);
  wave *= wave * (3.0 - 2.0 * wave);                            // sharper crests, broader troughs
  float amt = (1.0 - exp(-sp * 0.55 / stiff)) * 1.3;
  amt *= 0.68 + 0.64 * wave;
  float fl = sin(uTime * (6.5 + rnd * 4.0) + rnd * 40.0 + along * 5.0);
  float fl2 = sin(uTime * (4.1 + rnd * 2.0) + rnd * 23.0 - along * 3.0);
  float flAmp = (0.035 + 0.16 * turb + 0.035 * min(sp, 4.0)) / stiff;
  // crest sheen: where the wave pushes the blades over, scaled by how windy it is
  gust = wave * (1.0 - exp(-sp * 0.7)) * (0.6 + 0.4 * turb);
  return dir * (amt + fl * flAmp * 0.5) + perp * fl2 * flAmp * 0.55;
}
#endif
`;
const TREE_BENDING_GLSL = `
#ifndef WG_VEG_TREE
#define WG_VEG_TREE
uniform sampler2D uVegShake;   // per plant: (bend x, bend z [world units at the top], rustle, keep)
attribute vec4 aTree;          // root xyz, height
attribute vec4 aInfo;          // plant index, flex (0 trunk … 1 twig tip), phase 0..1, kind

// Species codes and predicates are defined in tree-species.js.
vec4 vegShake() { return texelFetch(uVegShake, ivec2(int(aInfo.x + 0.5), 0), 0); }

/**
 * Whole-plant sway (bend ∝ height², low frequency, leaning with the wind at the root) +
 * the flick/lightning spring state + branch/leaf flutter at higher frequency.
 * flutterDir: direction for extra per-leaf flutter (card normal), cardV: 0 at the attach
 * point … 1 at the card tip.
 */
vec3 vegTreeDisplace(vec3 p, vec4 sh, vec3 flutterDir, float cardV, float cardRnd) {
  vec3 root = aTree.xyz;
  float H = aTree.w;
  float kind = aInfo.w;
  float flex = aInfo.y;
  float ph = aInfo.z * 6.2831853;
  float r = clamp((p.y - root.y) / H, 0.0, 1.4);
  vec2 W = windAt(root.xz);
  float sp = length(W);
  vec2 dir = sp > 1e-4 ? W / sp : vec2(1.0, 0.0);
  vec2 perp = vec2(-dir.y, dir.x);
  float turb = windTurbAt(root.xz);
  float stiff = kind < 0.5 ? 0.6 : (vegIsShrub(kind) ? 0.75 : 1.0);
  float f = 0.95 / sqrt(H);
  float lean = (1.0 - exp(-sp * 0.3)) * 0.2 * stiff;
  float osc = sin(uTime * f * 6.2832 + ph) * 0.6 + sin(uTime * f * 14.7 + ph * 1.7) * 0.22;
  float swirl = sin(uTime * f * 8.3 + ph * 2.3) + 0.4 * sin(uTime * f * 19.0 + ph);
  float whip = 0.22 + turb * 0.8 + min(sp, 5.0) * 0.1;
  vec2 top = dir * lean * (1.0 + osc * whip) + perp * lean * swirl * (0.12 + turb * 0.6 + uStorm * 0.3);
  top = top * H + sh.xy;
  float r2 = r * r;
  vec3 d = vec3(top.x, 0.0, top.y) * r2;
  d.y = -dot(top, top) / H * 0.55 * r2 * r;      // arc: the top dips as it leans

  // branches: coherent over a branch (coarse position), faster than the trunk
  float energy = 0.004 + 0.006 * min(sp, 6.0) + 0.018 * turb + uStorm * 0.006 + sh.z * 0.035;
  vec3 q = p * 3.1;
  vec3 br = vec3(sin(uTime * 3.7 + q.x + q.y + ph), sin(uTime * 4.3 + q.z * 1.3 + ph * 1.3) * 0.5, sin(uTime * 3.1 + q.z + q.y * 0.7 + ph * 0.7));
  d += br * energy * H * flex * flex;
  // leaves: each card flickers about its attach point
  float lf = sin(uTime * (11.0 + cardRnd * 7.0) + cardRnd * 60.0 + ph) + 0.5 * sin(uTime * (17.0 + cardRnd * 5.0) + cardRnd * 31.0);
  d += flutterDir * lf * cardV * (energy * 1.8 + 0.003) * H;
  return d;
}
#endif
`;
const VEGETATION_TRANSLUCENCY_GLSL = `
float vegTransAmt = 0.0;
void RE_Direct_Veg(const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
  RE_Direct_Physical(directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight);
  // light passing through the leaf toward the eye, plus a soft wrap for the unlit side
  float back = saturate(dot(geometryViewDir, -directLight.direction));
  float wrap = saturate(-dot(geometryNormal, directLight.direction) * 0.6 + 0.25);
  float tr = (pow(back, 3.0) * 1.0 + wrap * 0.22) * vegTransAmt;
  reflectedLight.directDiffuse += directLight.color * material.diffuseColor * tr;
}
#undef RE_Direct
#define RE_Direct RE_Direct_Veg
`;
const VEGETATION_NO_FLIP_NORMAL_GLSL = `
float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
vec3 normal = normalize( vNormal );
vec3 nonPerturbedNormal = normal;
`;
function patchVegetationMaterial(r, t, e) {
  return (
    (r.onBeforeCompile = (i) => {
      Object.assign(i.uniforms, t.uniforms, e.uniforms || {});
      let s = i.vertexShader,
        n = i.fragmentShader;
      for (const [o, a] of Object.entries(e.vertex || {}))
        s = replaceVegetationShaderChunk(s, o, a);
      for (const [o, a] of Object.entries(e.fragment || {}))
        n = replaceVegetationShaderChunk(n, o, a);
      (e.light &&
        (n = replaceVegetationShaderChunk(
          n,
          "+lights_physical_pars_fragment",
          VEGETATION_TRANSLUCENCY_GLSL,
        )),
        e.noFlip &&
          (n = replaceVegetationShaderChunk(
            n,
            "normal_fragment_begin",
            VEGETATION_NO_FLIP_NORMAL_GLSL,
          )),
        (i.vertexShader =
          t.GLSL_COMMON +
          VEGETATION_COMMON_GLSL +
          TREE_SPECIES_GLSL +
          (e.vertexHead || "") +
          s),
        (i.fragmentShader =
          t.GLSL_COMMON +
          VEGETATION_COMMON_GLSL +
          TREE_SPECIES_GLSL +
          (e.fragmentHead || "") +
          n));
    }),
    (r.customProgramCacheKey = () => e.key),
    r
  );
}
function replaceVegetationShaderChunk(r, t, e) {
  const i = t.startsWith("+"),
    s = i ? t.slice(1) : t,
    n = `#include <${s}>`;
  return r.includes(n)
    ? r.replace(
        n,
        i
          ? `${n}
${e}`
          : e,
      )
    : (console.warn(`[vegetation] shader chunk <${s}> not found`), r);
}
export {
  TREE_BENDING_GLSL,
  VEGETATION_TRANSLUCENCY_GLSL,
  patchVegetationMaterial,
};
