// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeDoubleSide,
  ThreeMesh,
  ThreeMeshDepthMaterial,
  ThreeMeshStandardMaterial,
} from "../vendor/three-runtime.js";
import { createSeededRandom } from "../core/math.js";
import { PLANT_SPECIES_CODES, isShrubSpecies } from "./tree-species.js";
import {
  TREE_BENDING_GLSL,
  patchVegetationMaterial,
} from "./material-patching.js";
import { PlantGeometryBuilder } from "./branch-geometry.js";
import {
  appendBroadleafTree,
  appendPineTree,
  appendShrub,
} from "./tree-geometry.js";
const BARK_TRANSFORM_GLSL = `
  vec4 vegSh = vegShake();
  vec3 transformed = position + vegTreeDisplace(position, vegSh, vec3(0.0), 0.0, 0.0);
`;
const FOLIAGE_VERTEX_HEADER_GLSL = `
attribute vec4 aCard;
attribute vec3 aOff;
attribute float aAO;
varying float vAO;
varying vec2 vLeafUv;
varying vec4 vLeafInfo;   // cell, kind, tree rand, keep
varying vec3 vVegWorld;
varying vec3 vVegN;
varying float vLeafFrac;  // share of the card's leaves / flowers still on

/**
 * Which atlas cell a card shows now (leaf / bare twigs / blossom), how grown it is (return)
 * and what share of its leaves / flowers are still on (frac). Leaves come and go one by one
 * inside each card (the atlas G channel is a per-leaf random), so canopies thin smoothly
 * instead of losing whole clumps.
 */
float vegCard(vec4 sh, out float cell, out float frac) {
  cell = aCard.w;
  frac = 1.0;
  float kind = aInfo.w;
  if (cell < -0.5 || vegIsEvergreen(kind)) return 1.0;
  float trnd = fract(aInfo.z * 7.31);
  float autumn = vegAutumn();
  float keep = sh.w;
  // per-tree timing: some trees leaf out, turn and drop earlier than others
  float leaf = clamp(uLeafAmount + (trnd - 0.5) * 0.3 * (autumn + vegSpring() * 0.6), 0.0, 1.0);
  // Plum flowers on bare wood; its leaves follow the late-winter blossom.
  if (abs(kind - 6.0) < 0.5) leaf *= smoothstep(0.08, 0.48, uSeason) * (1.0 - smoothstep(2.25, 2.85, uSeason));
  leaf *= mix(1.0, keep, autumn);                               // a shaken autumn tree sheds
  // a few oaks hold on to a scatter of dead leaves all winter
  leaf = max(leaf, 0.07 * step(kind, 1.5) * step(0.55, fract(trnd * 9.1)) * vegWinter());
  float r1 = aCard.y;
  float r2 = fract(aCard.y * 13.37);
  float blossom = vegBlossomAmount(kind) * mix(1.0, keep, 0.5);
  float fB = clamp(blossom * 1.3 - (r2 - 0.5) * 0.6, 0.0, 1.0);
  if (fB > 0.35 && r2 < 0.85) { cell = 2.0; frac = fB; return 1.0; }
  float fL = clamp(leaf * 1.2 - (r1 - 0.5) * 0.4, 0.0, 1.0);
  if (kind > 5.5) fL *= smoothstep(0.0, 0.15, leaf);
  if (aCard.x > 0.5 && fL < 0.22) {
    cell = 1.0;                                  // bare twig spray grows in as the leaves go
    return smoothstep(0.22, 0.04, fL);
  }
  cell = 0.0;
  frac = fL;
  return step(0.02, fL);
}
`;
const FOLIAGE_TRANSFORM_GLSL = `
  vec4 vegSh = vegShake();
  float vegCell, vegFrac;
  float vegScale = vegCard(vegSh, vegCell, vegFrac);
  vLeafFrac = vegFrac;
  vec3 vegA = position - aOff;
  float vegCardSize = vegCell > 0.5 && vegCell < 1.5 ? 1.15 : 1.0;
  if (vegCell > 1.5 && abs(aInfo.w - 6.0) < 0.5) vegCardSize *= 0.82;
  vec3 vegP = vegA + aOff * vegScale * vegCardSize;
  if (vegScale < 0.01) vegP = vec3(aTree.x, -60.0, aTree.z);        // hidden: degenerate card
  vec3 transformed = vegP + vegTreeDisplace(vegP, vegSh, normal, aCard.z, aCard.y);
  vec2 vegCellUv = vec2(mod(max(vegCell, 0.0), 2.0), floor(max(vegCell, 0.0) * 0.5)) * 0.5;
  vLeafUv = vegCellUv + (uv * 0.49 + 0.005);
  vLeafInfo = vec4(vegCell, aInfo.w, fract(aInfo.z * 7.31), vegSh.w);
  vVegWorld = transformed;
  vVegN = normal;
  vAO = aAO;
`;
const FOLIAGE_FRAGMENT_HEADER_GLSL = `
uniform sampler2D uLeafAtlas;
varying float vAO;
varying vec2 vLeafUv;
varying vec4 vLeafInfo;
varying vec3 vVegWorld;
varying vec3 vVegN;
varying float vLeafFrac;

/** Leaves / petals beyond the card's current share drop out one by one (G = per-leaf random). */
float vegLeafMask(vec4 tx) {
  // 花朵图集夹带的嫩叶不属于梅花；普通叶片仍由季节控制。
  if (abs(vLeafInfo.y - 6.0) < 0.5 && vLeafInfo.x > 1.5 && tx.b >= 0.3 && tx.b <= 0.75) return 0.0;
  if (tx.b > 0.8) return step(0.04, vLeafFrac);       // twigs stay while any leaf does
  return step(tx.g, vLeafFrac * 1.02);
}

vec3 vegBarkTint(float kind) {
  if (kind < 0.5) return vec3(0.2, 0.12, 0.08);
  if (kind < 1.5) return vec3(0.2, 0.16, 0.12);
  if (kind < 2.5) return vec3(0.3, 0.17, 0.11);     // birch twigs are reddish-brown
  if (kind < 3.5) return vec3(0.22, 0.11, 0.09);
  if (abs(kind - 6.0) < 0.5) return vec3(0.22, 0.13, 0.12);
  return vec3(0.2, 0.16, 0.12);
}

/** Atlas sample with alpha compensated for mip coverage loss (canopies stay full at distance). */
vec4 vegAtlas() {
  if (vLeafInfo.x < -0.5) {
    float n = wgNoise(vVegWorld.xz * 70.0 + vVegWorld.y * 50.0);
    return vec4(0.45 + 0.4 * n, 0.5, 0.0, 1.0);
  }
  vec4 tx = texture2D(uLeafAtlas, vLeafUv);
  vec2 ts = vLeafUv * vec2(textureSize(uLeafAtlas, 0));
  float lod = max(0.0, 0.5 * log2(max(dot(dFdx(ts), dFdx(ts)), dot(dFdy(ts), dFdy(ts)))));
  tx.a = clamp(tx.a * (1.0 + lod * 0.32), 0.0, 1.0);
  tx.a *= vegLeafMask(tx);
  return tx;
}
`;
const FOLIAGE_COLOR_GLSL = `
  vec4 vegTx = vegAtlas();
  diffuseColor.a = vegTx.a;
  float kind = vLeafInfo.y;
  float cell = vLeafInfo.x;
  float trnd = vLeafInfo.z;
  float L = vegTx.r, lr = vegTx.g, mat = vegTx.b;
  vec3 col;
  if (vegIsEvergreen(kind)) {
    // needles (conifers, evergreen shrubs)
    vec3 base = vegIsShrub(kind) ? mix(uPineColor * vec3(1.3, 1.35, 1.0), uFoliageColor * 0.6, 0.25) : uPineColor;
    base *= mix(vec3(1.0), vec3(0.84, 0.95, 1.12), step(0.5, fract(trnd * 3.1)) * step(kind, 0.5));   // blue spruces
    col = base * (0.24 + 0.62 * L) * (0.85 + 0.3 * trnd);
    col *= cell < -0.5 ? 0.55 : 1.0;                                   // tier skirts sit in shade
    col = mix(col, vec3(0.28, 0.5, 0.1), vegSpring() * smoothstep(0.8, 0.97, L) * 0.75);   // new shoots
  } else if (cell > 1.5) {
    // blossom: white-pink petals, deep pink eyes, bronze young leaves
    vec3 petal = mix(vec3(0.82, 0.36, 0.44), vec3(0.98, 0.76, 0.8), smoothstep(0.5, 0.95, L)) * (0.82 + 0.22 * trnd);
    col = mix(vec3(0.42, 0.05, 0.1), petal, smoothstep(0.28, 0.5, L));
    if (abs(kind - 6.0) < 0.5) {
      petal = mix(vec3(0.62, 0.09, 0.23), vec3(0.98, 0.52, 0.67), smoothstep(0.4, 0.95, L));
      col = mix(vec3(0.54, 0.24, 0.09), petal, smoothstep(0.28, 0.5, L));
    } else if (abs(kind - 7.0) < 0.5) {
      petal = mix(vec3(0.87, 0.63, 0.67), vec3(0.98, 0.95, 0.87), smoothstep(0.4, 0.9, L));
      col = mix(vec3(0.7, 0.45, 0.13), petal, smoothstep(0.28, 0.5, L));
    }
    col = mix(col, vec3(0.34, 0.3, 0.1) * (0.6 + 0.6 * L), step(0.3, mat) * step(mat, 0.75));
  } else {
    // broadleaf: each tree leans to one side of the seasonal palette, leaves vary within it
    float pick = clamp(fract(trnd * 3.7) * 0.85 + (lr - 0.5) * 0.45, 0.0, 1.0);
    vec3 base = mix(uFoliageColor, uFoliageColor2, pick);
    float autumn = vegAutumn();
    // some trees (and some leaves) hold on to their summer green longer
    float lag = smoothstep(0.5, 0.9, fract(trnd * 5.3)) * (1.0 - smoothstep(2.05, 2.55, uSeason));
    base = mix(base, vec3(0.2, 0.4, 0.11) * (0.8 + 0.4 * lr), autumn * clamp(lag + (lr - 0.75) * 1.6, 0.0, 0.9));
    base = mix(base, base * vec3(0.72, 0.5, 0.35), autumn * smoothstep(0.85, 1.0, lr) * 0.8);   // a few brown leaves
    // species character in autumn: birches clear gold, cherries crimson, oaks russet-bronze
    vec3 autumnTint = kind > 1.5 && kind < 2.5 ? vec3(1.12, 1.12, 0.5)
                    : kind > 2.5 && kind < 3.5 ? vec3(1.15, 0.42, 0.36)
                    : vec3(0.92, 0.72, 0.62);
    base *= mix(vec3(1.0), autumnTint, autumn * 0.8);
    if (kind > 5.5) {
      vec3 orchardAutumn = abs(kind - 6.0) < 0.5 ? vec3(0.58, 0.24, 0.08) : vec3(0.69, 0.5, 0.13);
      base = mix(base, orchardAutumn * (0.78 + 0.35 * lr), autumn * 0.82);
    }
    if (kind > 1.5 && kind < 2.5) base *= mix(vec3(1.0), vec3(1.08, 1.1, 0.7), 0.35);        // birch: yellower
    col = base * (0.13 + 0.52 * L);
  }
  if (mat > 0.8) col = vegBarkTint(kind) * (0.65 + 0.6 * L);          // stems & bare twigs

  vec4 vegG = groundAt(vVegWorld.xz);
  vec3 vegN = normalize(vVegN);
  float vegSnowBase = snowCover(vVegWorld.xz, vegN) * vLeafInfo.w;
  float vegSnow;
  if (vegIsEvergreen(kind)) {
    // conifers: snow loads the upper faces of the tiers in clumps; the shaded needles, the
    // drooping frond tips and the skirt hems stay dark green underneath
    float hem = cell < -0.5 ? clamp((vLeafUv.y - 0.005) / 0.49, 0.0, 1.0) : 0.0;
    float tipV = cell > 2.5 ? clamp((vLeafUv.y - 0.505) / 0.49, 0.0, 1.0) : 0.0;
    float clump = wgNoise(vVegWorld.xz * 23.0 + vVegWorld.y * 17.0);
    vegSnow = vegSnowBase * smoothstep(0.58, 0.9, vegN.y * 0.75 + (L - 0.5) * 1.1 + (clump - 0.5) * 0.35 - tipV * 0.25 - hem * 0.3);
  } else if (mat > 0.8) {
    vegSnow = vegSnowBase * 0.55 * smoothstep(0.3, 0.8, vegN.y + (L - 0.5) * 0.6);   // a dusting on fine twigs
  } else {
    vegSnow = vegSnowBase * smoothstep(0.0, 0.5, vegN.y + (L - 0.5) * 0.8);
  }
  col = mix(col, vec3(0.9, 0.93, 0.98), vegSnow);
  col = mix(col, vec3(0.72, 0.8, 0.86), vegG.w * 0.45 * smoothstep(0.55, 1.0, L));   // hoar frost
  col *= 1.0 - vegG.y * 0.18;                                                      // rain-darkened
  diffuseColor.rgb = col;
  vegTransAmt = (1.0 - vegSnow) * (mat > 0.8 ? 0.1 : (cell > 1.5 ? 0.35 : 0.6));
`;
const FOLIAGE_LIGHTING_GLSL = `
  reflectedLight.indirectDiffuse *= vAO;
  reflectedLight.indirectSpecular *= vAO * vAO;
  reflectedLight.directDiffuse *= mix(1.0, vAO, 0.35);
  reflectedLight.directSpecular *= vAO;
  {
    vec3 vegLV = normalize((viewMatrix * vec4(uLightDir, 0.0)).xyz);
    float vegBack = saturate(dot(normalize(vViewPosition), -vegLV));
    float vegScat = pow(vegBack, 4.0) * (0.35 + 0.65 * uGolden) + 0.04;
    reflectedLight.directDiffuse += uLightColor * diffuseColor.rgb * vegScat * vegTransAmt * mix(0.25, 1.0, vAO) * 0.32 * cloudShadowAt(vVegWorld);
  }
`;
const FOLIAGE_ROUGHNESS_GLSL = `
  float roughnessFactor = mix(roughness, 0.38, groundAt(vVegWorld.xz).y * 0.7);
`;
const BARK_VARYINGS_GLSL = `
varying vec2 vBarkUv;
varying vec4 vBarkInfo;   // kind, flex, tree rand, keep
varying vec3 vVegWorld;
varying vec3 vVegN;
`;
const BARK_VARYING_ASSIGNMENTS_GLSL = `
  vBarkUv = uv;
  vBarkInfo = vec4(aInfo.w, aInfo.y, fract(aInfo.z * 7.31), vegSh.w);
  vVegWorld = transformed;
  vVegN = normal;
`;
const BARK_COLOR_GLSL = `
  float kind = vBarkInfo.x, flex = vBarkInfo.y;
  vec2 buv = vec2(vBarkUv.x, vBarkUv.y * 14.0);
  vec3 col;
  float fine = wgNoise(vec2(buv.x * 12.0, buv.y * 3.0));
  if (kind < 0.5) {
    // conifer: scaly red-brown plates
    float pl = wgNoise(vec2(buv.x * 7.0, buv.y * 2.2));
    col = mix(vec3(0.13, 0.07, 0.045), vec3(0.3, 0.16, 0.09), smoothstep(0.3, 0.7, pl)) * (0.85 + 0.3 * fine);
  } else if (kind < 1.5 || vegIsShrub(kind) || abs(kind - 7.0) < 0.5) {
    // oak / shrubs: grey-brown, deep vertical furrows, lichen
    float f = wgNoise(vec2(buv.x * 9.0, buv.y * 0.9));
    float ridge = 1.0 - abs(2.0 * f - 1.0);
    col = vec3(0.19, 0.16, 0.13) * (0.45 + 0.75 * ridge) * (0.9 + 0.2 * fine);
    col = mix(col, vec3(0.34, 0.37, 0.28), smoothstep(0.62, 0.8, wgNoise(buv * vec2(4.0, 1.3) + 7.0)) * 0.5);
  } else if (kind < 2.5) {
    // birch: chalk-white with dark lenticels, black fissured base, reddish twigs
    col = vec3(0.78, 0.76, 0.72) * (0.9 + 0.12 * fine);
    float len = smoothstep(0.7, 0.8, wgNoise(vec2(buv.x * 5.0, buv.y * 9.0)));
    col = mix(col, vec3(0.05, 0.045, 0.04), len * 0.9);
    float base = smoothstep(0.12, 0.0, flex) * smoothstep(0.35, 0.6, wgNoise(vec2(buv.x * 6.0, buv.y * 2.0)) + (0.12 - flex) * 3.0);
    col = mix(col, vec3(0.06, 0.055, 0.05), clamp(base, 0.0, 1.0));
    col = mix(col, vec3(0.3, 0.17, 0.11), smoothstep(0.55, 0.8, flex));
  } else {
    // Cherry and plum: dark bark with pale horizontal lenticel bands.
    col = vec3(0.19, 0.09, 0.075) * (0.85 + 0.3 * fine);
    col = mix(col, vec3(0.42, 0.3, 0.26), smoothstep(0.72, 0.85, wgNoise(vec2(buv.x * 3.0, buv.y * 12.0))) * 0.6);
    if (abs(kind - 6.0) < 0.5) col *= vec3(1.0, 1.16, 1.2);
  }
  vec3 vegN = normalize(vVegN);
  vec4 vegG = groundAt(vVegWorld.xz);
  // moss on the shaded, damp side of trunks
  col = mix(col, vec3(0.1, 0.17, 0.04), smoothstep(0.35, 0.0, flex) * smoothstep(0.0, 0.8, -vegN.z * 0.7 + 0.3) * (0.3 + 0.5 * uHumidity) * step(kind, 1.5) * 0.7);
  col *= 1.0 - vegG.y * 0.45;                                          // rain-soaked bark
  float vegSnow = snowCover(vVegWorld.xz, vegN) * vBarkInfo.w * smoothstep(0.4, 0.85, vegN.y);
  col = mix(col, vec3(0.9, 0.93, 0.98), vegSnow);
  diffuseColor.rgb = col;
`;
const BARK_ROUGHNESS_GLSL = `
  float roughnessFactor = mix(roughness, 0.32, groundAt(vVegWorld.xz).y * 0.8);
`;
const FOLIAGE_DEPTH_ALPHA_GLSL = `
  if (vLeafInfo.x > -0.5) {
    vec4 tx = texture2D(uLeafAtlas, vLeafUv);
    diffuseColor.a = tx.a * vegLeafMask(tx);
  }
  #include <alphatest_fragment>
`;
function createForestMeshes(r, t, e, options = {}) {
  const bendingGLSL = options.bendingGLSL || TREE_BENDING_GLSL;
  const keyPrefix = options.keyPrefix || "veg";
  const normalVertex = options.normalFunction
    ? {
        beginnormal_vertex: `#include <beginnormal_vertex>\nobjectNormal = ${options.normalFunction}(objectNormal);`,
      }
    : {};
  const normalVaryings = (source) =>
    options.normalFunction
      ? source.replace(
          "vVegN = normal;",
          `vVegN = ${options.normalFunction}(normal);`,
        )
      : source;
  const foliageVertexHead = options.bareWinter
    ? FOLIAGE_VERTEX_HEADER_GLSL.replace(
        "leaf = max(leaf, 0.07 * step(kind, 1.5) * step(0.55, fract(trnd * 9.1)) * vegWinter());",
        "// This deciduous species sheds all leaves for winter.",
      ).replace(
        "float fL = clamp(leaf * 1.2 - (r1 - 0.5) * 0.4, 0.0, 1.0);",
        "float fL = clamp(leaf * 1.2 - (r1 - 0.5) * 0.4, 0.0, 1.0) * smoothstep(0.0, 0.15, uLeafAmount);",
      )
    : FOLIAGE_VERTEX_HEADER_GLSL;
  const foliageColor = options.goldenAutumn
    ? FOLIAGE_COLOR_GLSL.replace(
        "base *= mix(vec3(1.0), autumnTint, autumn * 0.8);",
        "base = mix(base, vec3(0.78, 0.57, 0.13) * (0.8 + 0.3 * lr), autumn * 0.85);",
      )
    : FOLIAGE_COLOR_GLSL;
  const i = new PlantGeometryBuilder(!1),
    s = new PlantGeometryBuilder(!0);
  t.forEach((v, g) => {
    const x = createSeededRandom(v.seed);
    if (options.appendTree) {
      options.appendTree(i, s, v, g, x);
      return;
    }
    v.code === PLANT_SPECIES_CODES.pine
      ? appendPineTree(i, s, v, g, x)
      : isShrubSpecies(v.code)
        ? appendShrub(i, s, v, g, x)
        : appendBroadleafTree(i, s, v, g, x);
  });
  const n = i.build(),
    o = s.build();
  options.decorateGeometry?.(n, i);
  options.decorateGeometry?.(o, s);
  const a = e,
    l = patchVegetationMaterial(
      new ThreeMeshStandardMaterial({
        roughness: 0.92,
        metalness: 0,
      }),
      r,
      {
        key: `${keyPrefix}-bark`,
        uniforms: a,
        vertexHead: bendingGLSL + BARK_VARYINGS_GLSL,
        fragmentHead: BARK_VARYINGS_GLSL,
        vertex: {
          ...normalVertex,
          begin_vertex:
            BARK_TRANSFORM_GLSL + normalVaryings(BARK_VARYING_ASSIGNMENTS_GLSL),
        },
        fragment: {
          color_fragment: BARK_COLOR_GLSL,
          roughnessmap_fragment: BARK_ROUGHNESS_GLSL,
        },
      },
    ),
    c = patchVegetationMaterial(new ThreeMeshDepthMaterial(), r, {
      key: `${keyPrefix}-bark-depth`,
      uniforms: a,
      vertexHead: bendingGLSL,
      vertex: {
        begin_vertex: BARK_TRANSFORM_GLSL,
      },
    }),
    h = r.quality.tier > 0,
    f = patchVegetationMaterial(
      new ThreeMeshStandardMaterial({
        roughness: 0.68,
        metalness: 0,
        side: ThreeDoubleSide,
        alphaTest: 0.5,
        alphaToCoverage: h,
        envMapIntensity: 0.6,
      }),
      r,
      {
        key: `${keyPrefix}-foliage`,
        uniforms: a,
        vertexHead: bendingGLSL + foliageVertexHead,
        fragmentHead: FOLIAGE_FRAGMENT_HEADER_GLSL,
        vertex: {
          ...normalVertex,
          begin_vertex: normalVaryings(FOLIAGE_TRANSFORM_GLSL),
        },
        fragment: {
          color_fragment: foliageColor,
          roughnessmap_fragment: FOLIAGE_ROUGHNESS_GLSL,
          aomap_fragment: FOLIAGE_LIGHTING_GLSL,
        },
        light: !0,
        noFlip: !0,
      },
    ),
    u = patchVegetationMaterial(
      new ThreeMeshDepthMaterial({
        side: ThreeDoubleSide,
        alphaTest: 0.5,
      }),
      r,
      {
        key: `${keyPrefix}-foliage-depth`,
        uniforms: a,
        vertexHead: bendingGLSL + foliageVertexHead,
        fragmentHead: FOLIAGE_FRAGMENT_HEADER_GLSL,
        vertex: {
          begin_vertex: normalVaryings(FOLIAGE_TRANSFORM_GLSL),
        },
        fragment: {
          alphatest_fragment: FOLIAGE_DEPTH_ALPHA_GLSL,
        },
      },
    ),
    d = new ThreeMesh(n, l);
  ((d.name = "vegetation-bark"),
    (d.castShadow = !0),
    (d.receiveShadow = !0),
    (d.customDepthMaterial = c));
  const p = new ThreeMesh(o, f);
  return (
    (p.name = "vegetation-foliage"),
    (p.castShadow = !0),
    (p.receiveShadow = !0),
    (p.customDepthMaterial = u),
    {
      bark: d,
      foliage: p,
      stats: {
        barkVerts: i.count,
        foliageVerts: s.count,
      },
      dispose() {
        (n.dispose(),
          o.dispose(),
          l.dispose(),
          c.dispose(),
          f.dispose(),
          u.dispose());
      },
    }
  );
}
export { createForestMeshes };
