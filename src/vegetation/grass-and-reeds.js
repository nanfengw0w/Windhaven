// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBox3,
  ThreeDoubleSide,
  ThreeFloat32BufferAttribute,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreeMeshStandardMaterial,
  ThreeSphere,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { patchVegetationMaterial } from "./material-patching.js";
import { farmCropCoverage } from "../layout/farm-layout.js";
import { FARM_SEASON_GLSL } from "./farm-season.js";
function buildGrassBladeGeometry(r) {
  const t = [],
    e = [];
  for (let n = 0; n < r; n++) {
    const o = n / r;
    t.push(-0.5, o, 0, 0.5, o, 0);
  }
  t.push(0, 1, 0);
  for (let n = 0; n < r - 1; n++) {
    const o = n * 2;
    e.push(o, o + 1, o + 2, o + 1, o + 3, o + 2);
  }
  const i = (r - 1) * 2;
  e.push(i, i + 1, r * 2);
  const s = new ThreeInstancedBufferGeometry();
  return (
    s.setAttribute("position", new ThreeFloat32BufferAttribute(t, 3)),
    s.setAttribute(
      "normal",
      new ThreeFloat32BufferAttribute(new Float32Array(t.length), 3),
    ),
    s.setIndex(e),
    s
  );
}
const GRASS_BENDING_GLSL = `
#ifndef VEG_REED
${FARM_SEASON_GLSL}
attribute float aFarmCoverage;
#endif
attribute vec4 aRoot;    // root xyz, rand
attribute vec4 aShape;   // height, width, yaw, lean
attribute vec4 aTint;    // grass: dryness, lake basin, damp   reeds: cattail, in water
varying vec4 vGrass;     // t, dryness, rand, wind-crest sheen
varying vec4 vGround;
varying vec2 vGrassXZ;
varying vec3 vGrassCol;  // per-blade albedo (grass; computed once per vertex, not per pixel)
varying vec4 vGrassFx;   // snow cover, frost, wetness, turf density (root occlusion)

/** Bend (radians, xz) and effective height of a blade; shared by blades and cattail heads. */
vec2 vegBladeBend(out float H, out float gust, out float alive) {
  vec4 G = groundAt(aRoot.xz);
  float rnd = aRoot.w;
  float winter = vegWinter(), autumn = vegAutumn();
  float snowFlat = smoothstep(0.04, 0.6, G.x);
  H = aShape.x;
#ifdef VEG_REED
  float stiff = aTint.x > 0.5 ? 2.0 : 1.2;
  alive = 1.0;
  H *= mix(1.0, 0.82, winter) * (0.85 + 0.15 * (1.0 - vegSpring() * 0.4));
  H *= 1.0 - 0.3 * snowFlat;
  float droop = aShape.w * (1.0 + winter * 1.4 + snowFlat * 1.2 + G.y * 0.3);
#else
  float stiff = 1.0;
  // winter: half the blades gone, the rest short dry straw; spring: fresh growth
  alive = step(rnd, 1.0 - winter * 0.5);
  H *= mix(1.0, 0.62, winter) * mix(1.0, 0.9, autumn) * mix(1.0, 0.88, vegSpring() * (1.0 - rnd));
  H *= 1.0 - 0.55 * snowFlat;
  vec2 cropTransition = farmGrassSuccession(aFarmCoverage, uSeason);
  H *= mix(1.0, 0.14, cropTransition.y);
  // drowned when the lake rises over the root
  alive *= 1.0 - aTint.y * step(aRoot.y + H * 0.4, uWaterLevel);
  float droop = aShape.w * (1.0 + snowFlat * 1.8 + G.y * 0.45) + cropTransition.x * 0.45;
#endif
  H *= alive;
  vec2 B = vegWindBend(aRoot.xz, rnd, stiff, gust);
  B *= mix(0.65, 1.3, clamp(H / 0.16, 0.0, 1.0));            // taller blades bend further (≈ height²)
#ifdef VEG_REED
  // reed beds rock as a body: a slow, deep sway on top of the flutter, growing with the wind
  {
    vec2 Wr = windAt(aRoot.xz);
    float spr = length(Wr);
    vec2 dr = spr > 1e-4 ? Wr / spr : vec2(1.0, 0.0);
    float ph = dot(aRoot.xz, dr) * 3.0 + rnd * 1.5;
    B += dr * sin(uTime * (1.5 + spr * 0.25) - ph) * (0.06 + 0.12 * min(spr, 3.0)) / stiff;
  }
#endif
  vec2 face = vec2(-sin(aShape.z), cos(aShape.z));
  B += face * droop;
  vGround = G;
  return B;
}

#ifndef VEG_REED
/** Per-blade albedo: meadow patches, lush damp swathes, odd straw blades, season. */
vec3 vegGrassAlbedo(vec4 G) {
  vec2 xz = aRoot.xz;
  float rnd = aRoot.w;
  float winter = vegWinter(), autumn = vegAutumn();
  float nA = wgNoise(xz * 0.85 + 3.7), nB = wgNoise(xz * 3.1 - 1.3), nL = wgNoise(xz * 0.45 - 7.3);
  float dryP = smoothstep(0.32, 0.78, nA * 0.55 + nB * 0.3 + fract(rnd * 3.1) * 0.15 + aTint.x * 0.35);
  vec3 base = mix(uGrassColor, uGrassDry, dryP);
  // lush swathes (damp ground, hollows, around water): deeper, cooler green
  float lush = clamp(aTint.z * 0.75 + smoothstep(0.5, 0.85, nL) * 0.7, 0.0, 1.0) * (1.0 - dryP * 0.5);
  base = mix(base, base * vec3(0.58, 0.8, 0.55), lush * 0.65);
  base *= 0.74 + 0.5 * fract(rnd * 7.13);
  base = mix(base, base * vec3(0.86, 1.06, 0.74), smoothstep(0.7, 1.0, fract(rnd * 11.3)) * 0.6);
  // a few dead / seeding blades: straw flecks that make a meadow read as real
  float straw = step(0.94 - 0.3 * autumn - 0.08 * smoothstep(0.7, 1.5, uSeason), fract(rnd * 17.9));
  base = mix(base, vec3(0.5, 0.42, 0.24) * (0.8 + 0.4 * fract(rnd * 5.3)), straw * 0.8);
  base = mix(base, vec3(0.42, 0.26, 0.1) * (0.8 + 0.4 * rnd), autumn * smoothstep(0.45, 0.85, nB * 0.6 + fract(rnd * 3.7) * 0.4) * 0.6);
  base = mix(base, vec3(0.5, 0.43, 0.29) * (0.78 + 0.44 * fract(rnd * 5.3)), winter * 0.8);
  float cropWither = farmGrassSuccession(aFarmCoverage, uSeason).x;
  base = mix(base, uGrassDry * (0.8 + 0.25 * rnd), cropWither * 0.85);
  return base * 0.64;
}
#endif
`;
const GRASS_VERTEX_TRANSFORM_GLSL = `
  float vegH, vegGust, vegAlive;
  vec2 vegB = vegBladeBend(vegH, vegGust, vegAlive);
  float vegT = position.y;
  vec3 vegTan;
  vec3 vegOff = vegArc(vegB, vegH, vegT, vegTan);
  float vegTw = aShape.z + (aRoot.w - 0.5) * 1.3 * vegT;            // slight twist up the blade
  vec3 vegSide = vec3(cos(vegTw), 0.0, sin(vegTw));
#ifdef VEG_REED
  float vegW = aShape.y * (aTint.x > 0.5 ? 1.0 : pow(1.0 - pow(vegT, 2.2), 0.7));
#else
  float vegW = aShape.y * pow(1.0 - pow(vegT, 1.5), 0.8);
#endif
  vec3 vegPos = aRoot.xyz + vegOff + vegSide * position.x * vegW * vegAlive;
  vec3 vegNrm = cross(vegSide, vegTan);
  vegNrm /= max(length(vegNrm), 1e-4);
  vegNrm *= sign(dot(vegNrm, cameraPosition - vegPos) + 1e-5);      // face the eye (thin blade)
  vec3 objectNormal = normalize(mix(vegNrm, vec3(0.0, 1.0, 0.0), 0.45));
  vGrass = vec4(vegT, aTint.x, aRoot.w, vegGust);
  vGrassXZ = aRoot.xz;
  vGrassFx = vec4(snowCover(aRoot.xz, vec3(0.0, 1.0, 0.0)), vGround.w, vGround.y, aTint.w);
#ifdef VEG_REED
  vGrassCol = vec3(0.0);
  vGrassFx.w = 0.4;
#else
  vGrassCol = vegGrassAlbedo(vGround);
#endif
`;
const GRASS_VARYINGS_GLSL = `
varying vec4 vGrass;
varying vec4 vGround;
varying vec2 vGrassXZ;
varying vec3 vGrassCol;
varying vec4 vGrassFx;
`;
const GRASS_COLOR_GLSL = `
  float t = vGrass.x;
  vec4 fx = vGrassFx;
  float winter = vegWinter();
  vec3 col = vGrassCol * mix(0.6, 1.0, smoothstep(0.0, 0.8, t));
  col = mix(col, col * 1.22 + vec3(0.01, 0.014, 0.0), smoothstep(0.6, 1.0, t) * (1.0 - winter * 0.5));   // fresh tips
  // wind crests: bent blades turn their pale, glossy flanks up, so gusts sweep visibly as bands
  col = mix(col, col * 1.45 + vec3(0.03, 0.036, 0.016), vGrass.w * t * t * (1.0 - fx.x));
  col *= 1.0 - fx.z * 0.3;                                                 // wet: darker
  col = mix(col, vec3(0.76, 0.83, 0.9), fx.y * smoothstep(0.35, 1.0, t) * 0.6);   // frosted tips
  col = mix(col, vec3(0.86, 0.9, 0.96), fx.x * smoothstep(0.15, 0.8, t) * 0.9);  // snow-tipped
  diffuseColor.rgb = col;
  vegTransAmt = (1.0 - fx.x) * 0.6 * smoothstep(0.1, 0.8, t);
`;
const GRASS_OCCLUSION_GLSL = `
  {
    float vegT = vGrass.x, vegD = vGrassFx.w;
    float vegAo = mix(mix(0.4, 0.14, vegD), 1.0, smoothstep(0.0, 0.85, vegT));
    reflectedLight.indirectDiffuse *= vegAo;
    reflectedLight.indirectSpecular *= vegAo * mix(0.3, 1.0, vGrassFx.z);
    reflectedLight.directDiffuse *= mix(mix(0.62, 0.36, vegD), 1.0, smoothstep(0.0, 0.7, vegT));
    reflectedLight.directSpecular *= mix(0.3, 1.0, vegT);
  }
`;
const REED_COLOR_GLSL = `
  float t = vGrass.x, rnd = vGrass.z;
  vec4 G = vGround;
  float winter = vegWinter(), autumn = vegAutumn();
  vec3 green = mix(vec3(0.09, 0.2, 0.045), vec3(0.19, 0.33, 0.08), fract(rnd * 3.3));
  green = mix(green, vec3(0.26, 0.42, 0.1), vegSpring() * 0.4);
  green = mix(green, vec3(0.1, 0.17, 0.05), vGrass.y);              // cattail stalks: darker, glossier
  vec3 base = mix(green, vec3(0.52, 0.38, 0.17) * (0.8 + 0.4 * rnd), autumn * (0.55 + 0.4 * rnd));
  base = mix(base, vec3(0.6, 0.52, 0.34) * (0.8 + 0.3 * rnd), winter);
  base = mix(base, base * vec3(1.2, 1.0, 0.6), smoothstep(0.6, 1.0, t) * (autumn + 0.25));   // sun-bleached tips
  vec3 col = base * mix(0.35, 0.85, smoothstep(0.0, 0.5, t));
  col *= 1.0 - G.y * 0.15;
  col = mix(col, vec3(0.86, 0.9, 0.96), vGrassFx.x * smoothstep(0.5, 1.0, t) * 0.5);
  col = mix(col, col * 1.3 + vec3(0.02, 0.024, 0.01), vGrass.w * t * 0.6);
  diffuseColor.rgb = col;
  vegTransAmt = 0.5 * smoothstep(0.1, 0.7, t);
`;
const GRASS_ROUGHNESS_GLSL = `
  float roughnessFactor = mix(roughness, 0.3, vGround.y * 0.75);
`;
function createGrassOrReedMaterial(r, t) {
  const e = new ThreeMeshStandardMaterial({
    roughness: t ? 0.6 : 0.8,
    metalness: 0,
    side: ThreeDoubleSide,
    envMapIntensity: t ? 0.5 : 0.35,
  });
  return (
    t &&
      (e.defines = {
        VEG_REED: "",
      }),
    patchVegetationMaterial(e, r, {
      key: t ? "veg-reed" : "veg-grass-farm-season-v1",
      vertexHead: GRASS_BENDING_GLSL,
      fragmentHead: GRASS_VARYINGS_GLSL,
      vertex: {
        beginnormal_vertex: GRASS_VERTEX_TRANSFORM_GLSL,
        begin_vertex: "vec3 transformed = vegPos;",
      },
      fragment: {
        color_fragment: t ? REED_COLOR_GLSL : GRASS_COLOR_GLSL,
        roughnessmap_fragment: GRASS_ROUGHNESS_GLSL,
        aomap_fragment: GRASS_OCCLUSION_GLSL,
      },
      light: !0,
      noFlip: !0,
    })
  );
}
function assignBladeInstanceAttributes(r, t, e) {
  return (
    r.setAttribute(
      "aRoot",
      new ThreeInstancedBufferAttribute(t.root.subarray(0, e * 4), 4),
    ),
    r.setAttribute(
      "aShape",
      new ThreeInstancedBufferAttribute(t.shape.subarray(0, e * 4), 4),
    ),
    r.setAttribute(
      "aTint",
      new ThreeInstancedBufferAttribute(t.tint.subarray(0, e * 4), 4),
    ),
    (r.instanceCount = e),
    (r.boundingSphere = new ThreeSphere(new ThreeVector3(0, 1, 0), 8)),
    (r.boundingBox = new ThreeBox3(
      new ThreeVector3(-6, -1, -4),
      new ThreeVector3(6, 4, 4),
    )),
    r
  );
}
function createGrassMesh(r, t, e) {
  const i = assignBladeInstanceAttributes(
      buildGrassBladeGeometry(e),
      t,
      t.count,
    ),
    s = new ThreeMesh(i, createGrassOrReedMaterial(r, !1));
  const coverage = new Float32Array(t.count);
  for (let index = 0; index < t.count; index++)
    coverage[index] = farmCropCoverage(
      t.root[index * 4],
      t.root[index * 4 + 2],
    );
  i.setAttribute(
    "aFarmCoverage",
    new ThreeInstancedBufferAttribute(coverage, 1),
  );
  return (
    (s.name = "vegetation-grass"),
    (s.receiveShadow = !0),
    (s.castShadow = !1),
    (s.userData.noReflect = !0),
    s
  );
}

// All detail levels retain the same blades and share their GPU instance buffers.
function createGrassLodGeometry(source, segments) {
  const geometry = buildGrassBladeGeometry(segments);
  for (const name of ["aRoot", "aShape", "aTint", "aFarmCoverage"])
    geometry.setAttribute(name, source.attributes[name]);
  geometry.instanceCount = source.instanceCount;
  geometry.boundingBox = source.boundingBox;
  geometry.boundingSphere = source.boundingSphere;
  return geometry;
}
const CATTAIL_VERTEX_HEADER_GLSL =
  GRASS_BENDING_GLSL +
  `
attribute vec3 aHead;    // lathe: x, y (0..1.5 along the stalk), z
`;
const CATTAIL_TRANSFORM_GLSL = `
  float vegH, vegGust, vegAlive;
  vec2 vegB = vegBladeBend(vegH, vegGust, vegAlive);
  float t0 = 0.72;
  vec3 vegTan;
  vec3 vegOff = vegArc(vegB, vegH, t0, vegTan);
  vec3 s1 = normalize(cross(vegTan, abs(vegTan.x) > 0.9 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0)));
  vec3 s2 = cross(vegTan, s1);
  float winter = vegWinter();
  float rad = 0.0105 * (1.0 + winter * 0.35 * smoothstep(0.3, 1.1, aHead.y));   // winter heads go fluffy
  float len = 0.06;
  vec3 vegPos = aRoot.xyz + vegOff + (s1 * aHead.x + s2 * aHead.z) * rad + vegTan * aHead.y * len;
  vec3 objectNormal = normalize(s1 * aHead.x + s2 * aHead.z + vegTan * 0.2);
  vGrass = vec4(aHead.y, 1.0, aRoot.w, vegGust);
  vGrassXZ = aRoot.xz;
`;
const CATTAIL_COLOR_GLSL = `
  float winter = vegWinter();
  float spike = step(1.02, vGrass.x);
  vec3 col = mix(vec3(0.2, 0.1, 0.05), vec3(0.3, 0.17, 0.08), fract(vGrass.z * 5.1));
  col = mix(col, vec3(0.55, 0.47, 0.35), winter * 0.6 * wgNoise(vec2(vGrass.x * 20.0, vGrass.z * 40.0)));
  col = mix(col, vec3(0.3, 0.27, 0.12), spike);
  float sc = snowCover(vGrassXZ, vec3(0.0, 1.0, 0.0));
  col = mix(col, vec3(0.86, 0.9, 0.96), sc * 0.4);
  diffuseColor.rgb = col;
`;
function buildCattailHeadGeometry() {
  const r = [
      [0, 0],
      [0.7, 0.03],
      [1, 0.14],
      [1, 0.86],
      [0.75, 0.98],
      [0.18, 1.02],
      [0.14, 1.35],
      [0, 1.45],
    ],
    t = 6,
    e = [],
    i = [];
  for (let o = 0; o < r.length; o++)
    for (let a = 0; a <= t; a++) {
      const l = (a / t) * Math.PI * 2;
      e.push(Math.cos(l) * r[o][0], r[o][1], Math.sin(l) * r[o][0]);
    }
  const s = t + 1;
  for (let o = 0; o < r.length - 1; o++)
    for (let a = 0; a < t; a++) {
      const l = o * s + a,
        c = l + s;
      i.push(l, c, l + 1, c, c + 1, l + 1);
    }
  const n = new ThreeInstancedBufferGeometry();
  return (
    n.setAttribute(
      "position",
      new ThreeFloat32BufferAttribute(new Float32Array(e.length), 3),
    ),
    n.setAttribute(
      "normal",
      new ThreeFloat32BufferAttribute(new Float32Array(e.length), 3),
    ),
    n.setAttribute("aHead", new ThreeFloat32BufferAttribute(e, 3)),
    n.setIndex(i),
    n
  );
}
function createReedMeshes(r, t) {
  const e = assignBladeInstanceAttributes(
      buildGrassBladeGeometry(5),
      t,
      t.count,
    ),
    i = new ThreeMesh(e, createGrassOrReedMaterial(r, !0));
  ((i.name = "vegetation-reeds"), (i.receiveShadow = !0));
  let s = 0;
  for (let h = 0; h < t.count; h++) t.tint[h * 4] > 0.5 && s++;
  const n = {
    root: new Float32Array(s * 4),
    shape: new Float32Array(s * 4),
    tint: new Float32Array(s * 4),
  };
  let o = 0;
  for (let h = 0; h < t.count; h++)
    t.tint[h * 4] <= 0.5 ||
      (n.root.set(t.root.subarray(h * 4, h * 4 + 4), o * 4),
      n.shape.set(t.shape.subarray(h * 4, h * 4 + 4), o * 4),
      n.tint.set(t.tint.subarray(h * 4, h * 4 + 4), o * 4),
      o++);
  const a = assignBladeInstanceAttributes(buildCattailHeadGeometry(), n, s),
    l = new ThreeMeshStandardMaterial({
      roughness: 0.95,
      metalness: 0,
    });
  ((l.defines = {
    VEG_REED: "",
  }),
    patchVegetationMaterial(l, r, {
      key: "veg-cattail",
      vertexHead: CATTAIL_VERTEX_HEADER_GLSL,
      fragmentHead: GRASS_VARYINGS_GLSL,
      vertex: {
        beginnormal_vertex: CATTAIL_TRANSFORM_GLSL,
        begin_vertex: "vec3 transformed = vegPos;",
      },
      fragment: {
        color_fragment: CATTAIL_COLOR_GLSL,
      },
    }));
  const c = new ThreeMesh(a, l);
  return (
    (c.name = "vegetation-cattails"),
    (c.castShadow = !1),
    (c.receiveShadow = !0),
    {
      reeds: i,
      heads: c,
    }
  );
}
export { createGrassMesh, createGrassLodGeometry, createReedMeshes };
