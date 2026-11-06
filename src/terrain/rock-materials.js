// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeMeshDepthMaterial,
  ThreeMeshStandardMaterial,
} from "../vendor/three-runtime.js";
const ROCK_VERTEX_ATTRIBUTES_GLSL = `
attribute vec3 aPos1; attribute vec3 aPos2; attribute vec3 aPos3;
attribute vec4 aRock;   // variant weights 1..3, seed
`;
const ROCK_VARIANT_BLEND_GLSL = `
float rw0 = max(0.0, 1.0 - aRock.x - aRock.y - aRock.z);
vec3 transformed = position * rw0 + aPos1 * aRock.x + aPos2 * aRock.y + aPos3 * aRock.z;
`;
const ROCK_SURFACE_GLSL = `
// Mikkelsen derivative bump (world space)
vec3 rBump(vec3 pos, vec3 n, float H) {
  vec3 dpx = dFdx(pos), dpy = dFdy(pos);
  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx);
  float det = dot(dpx, r1);
  vec3 grad = sign(det) * (dFdx(H) * r1 + dFdy(H) * r2);
  return normalize(abs(det) * n - grad);
}

struct TRock { vec3 albedo; float rough; vec3 n; float ao; float sparkle; };

TRock rockSurface(vec3 p, vec3 nG, vec3 loc, vec4 rk, vec4 rk2) {
  TRock s;
  float seed = rk.w;
  float fw = length(fwidth(p));
  float fine = 1.0 - smoothstep(0.006, 0.03, fw);
  vec3 sp = p + seed * 13.7;
  vec3 base = mix(vec3(0.17, 0.165, 0.155), vec3(0.32, 0.3, 0.27), fract(seed * 7.13));
  base = mix(base, vec3(0.3, 0.23, 0.17), step(0.72, fract(seed * 3.71)) * 0.65);   // warm granite
  base = mix(base, vec3(0.14, 0.15, 0.16), step(0.82, fract(seed * 5.37)) * 0.7);    // cool basalt
  float n1 = wgNoise3(sp * 7.0);
  float n2 = wgNoise3(sp * 26.0);
  float n3 = wgNoise3(sp * 70.0);
  vec3 col = base * (0.76 + 0.34 * n1 + 0.14 * (n2 - 0.5));
  col *= 0.92 + 0.16 * step(0.72, n3) * fine;                               // mineral grains
  float cr = abs(wgNoise3(loc * 2.6 + seed * 17.0) - 0.5);
  float crack = (1.0 - smoothstep(0.0, 0.03, cr)) * step(0.35, fract(seed * 11.3));
  col *= 1.0 - crack * 0.55;

  // grounding: grime and darker contact band at the soil line
  float hag = p.y - groundHeightAt(p.xz);
  float contact = 1.0 - smoothstep(0.0, 0.06, hag);
  col = mix(col, col * vec3(0.55, 0.5, 0.45), contact);

  // lichen crusts on top, moss on the shaded / damp flanks
  float lich = smoothstep(0.66, 0.7, wgNoise3(sp * 16.0)) * smoothstep(0.1, 0.6, nG.y) * step(0.3, fract(seed * 9.1));
  vec3 lichCol = mix(vec3(0.42, 0.45, 0.3), vec3(0.55, 0.36, 0.12), step(0.6, wgNoise3(sp * 3.0 + 4.0)));
  col = mix(col, lichCol * (0.85 + 0.3 * n2), lich * 0.7);
  float mossN = wgNoise3(sp * 4.0 + 3.0) * 0.6 + n2 * 0.4;
  float moss = smoothstep(0.66, 0.82, mossN + rk2.z * 0.22 - nG.z * 0.12 + contact * 0.25 - max(nG.y, 0.0) * 0.12) * (0.3 + 0.5 * rk2.z);
  moss *= 1.0 - smoothstep(0.7, 1.0, uSeason - 2.2) * 0.4;
  vec3 mossCol = mix(vec3(0.07, 0.11, 0.03), vec3(0.14, 0.18, 0.05), n3) * mix(vec3(1.0), vec3(1.35, 1.0, 0.6), smoothstep(1.6, 2.4, uSeason) * (1.0 - smoothstep(3.0, 3.6, uSeason)));
  col = mix(col, mossCol, moss);

  // wetness: rain, damp ground and the splash zone above the water line
  vec4 G = groundAt(p.xz);
  float wet = max(G.y * 0.9, smoothstep(rk2.x + 0.028, rk2.x + 0.004, p.y) * 0.85);
  wet = max(wet, smoothstep(rk2.x + 0.005, rk2.x - 0.01, p.y));
  col *= 1.0 - wet * 0.45;
  float rough = mix(0.84, 0.22, wet) + (n2 - 0.5) * 0.08;
  rough = mix(rough, 0.95, moss);

  // snow caps on the tops
  float sc = snowCover(p.xz, nG);
  float snow = smoothstep(0.35, 0.55, sc * smoothstep(0.3, 0.75, nG.y) + (n1 - 0.5) * 0.25) * step(rk2.x + 0.01, p.y);
  col = mix(col, vec3(0.55, 0.58, 0.63) * (0.95 + 0.05 * n2), snow);
  rough = mix(rough, 0.6, snow);
  float frost = G.w * (1.0 - snow);
  col = mix(col, vec3(0.72, 0.78, 0.84), frost * 0.25 * smoothstep(0.4, 0.8, n3));

  float H = (n1 * 0.012 + (n2 - 0.5) * 0.004 + (n3 - 0.5) * 0.0015 * fine - crack * 0.008) * (1.0 - snow * 0.7);
  vec3 n = rBump(p, nG, H);
  // "flat-shaded-soft": a whisper of the true facet normal for a chiselled read
  vec3 fn = normalize(cross(dFdx(p), dFdy(p)));
  n = normalize(mix(n, fn, 0.22 * (1.0 - snow)));

  vec3 V = normalize(cameraPosition - p);
  vec3 gc = floor(p * 90.0);
  vec3 gn = normalize(vec3(wgHash3(gc + 1.7), wgHash3(gc + 3.1), wgHash3(gc + 5.3)) * 2.0 - 1.0 + vec3(0.0, 0.7, 0.0));
  s.sparkle = snow * step(0.9, wgHash3(gc + 0.5)) * pow(max(dot(gn, normalize(uLightDir + V)), 0.0), 80.0);
  s.albedo = col;
  s.rough = clamp(rough, 0.05, 1.0);
  s.n = n;
  s.ao = mix(1.0, 0.45, contact) * (1.0 - crack * 0.4);
  return s;
}
`;
const ROCK_VARYINGS_GLSL = `varying vec3 vRPos;
varying vec3 vRNrm;
varying vec3 vRLoc;
varying vec4 vRock;
varying vec4 vRock2;
`;
function createRockSurfaceMaterial(r) {
  const t = new ThreeMeshStandardMaterial({
    color: 16777215,
    roughness: 0.85,
    metalness: 0,
  });
  return (
    (t.onBeforeCompile = (e) => {
      (Object.assign(e.uniforms, r.uniforms),
        (e.vertexShader =
          r.GLSL_COMMON +
          e.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` +
                ROCK_VERTEX_ATTRIBUTES_GLSL +
                `attribute vec3 aNrm1; attribute vec3 aNrm2; attribute vec3 aNrm3;
attribute vec4 aRock2;
` +
                ROCK_VARYINGS_GLSL,
            )
            .replace(
              "#include <beginnormal_vertex>",
              `
        float nw0 = max(0.0, 1.0 - aRock.x - aRock.y - aRock.z);
        vec3 objectNormal = normalize(normal * nw0 + aNrm1 * aRock.x + aNrm2 * aRock.y + aNrm3 * aRock.z);`,
            )
            .replace("#include <begin_vertex>", ROCK_VARIANT_BLEND_GLSL)
            .replace(
              "#include <worldpos_vertex>",
              `#include <worldpos_vertex>
        mat3 rIm = mat3(instanceMatrix);
        vec3 rN = objectNormal / vec3(dot(rIm[0], rIm[0]), dot(rIm[1], rIm[1]), dot(rIm[2], rIm[2]));
        vRNrm = normalize(mat3(modelMatrix) * (rIm * rN));
        vRPos = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
        vRLoc = transformed;
        vRock = aRock;
        vRock2 = aRock2;`,
            )),
        (e.fragmentShader =
          r.GLSL_COMMON +
          ROCK_SURFACE_GLSL +
          e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
` + ROCK_VARYINGS_GLSL,
            )
            .replace(
              "#include <map_fragment>",
              `#include <map_fragment>
        TRock tR = rockSurface(vRPos, normalize(vRNrm), vRLoc, vRock, vRock2);
        diffuseColor.rgb = tR.albedo;`,
            )
            .replace(
              "#include <roughnessmap_fragment>",
              "float roughnessFactor = tR.rough;",
            )
            .replace(
              "#include <normal_fragment_maps>",
              `#include <normal_fragment_maps>
        normal = normalize((viewMatrix * vec4(tR.n, 0.0)).xyz);`,
            )
            .replace(
              "#include <lights_fragment_end>",
              `#include <lights_fragment_end>
        reflectedLight.directSpecular += reflectedLight.directDiffuse / max(diffuseColor.rgb, vec3(0.02)) * tR.sparkle * 1.6;
        reflectedLight.indirectDiffuse *= tR.ao;
        reflectedLight.indirectSpecular *= tR.ao;`,
            )));
    }),
    (t.customProgramCacheKey = () => "wg-terrain-rock"),
    t
  );
}
function createRockDepthMaterial() {
  const r = new ThreeMeshDepthMaterial();
  return (
    (r.onBeforeCompile = (t) => {
      t.vertexShader = t.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
` + ROCK_VERTEX_ATTRIBUTES_GLSL,
        )
        .replace("#include <begin_vertex>", ROCK_VARIANT_BLEND_GLSL);
    }),
    (r.customProgramCacheKey = () => "wg-terrain-rock-depth"),
    r
  );
}
export { createRockDepthMaterial, createRockSurfaceMaterial };
