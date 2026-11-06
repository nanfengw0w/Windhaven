// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
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
const FLOWER_MAX_PETALS = 8;
function buildFlowerGeometry() {
  const r = [],
    t = [],
    e = [],
    i = (l, c, h, f) => (r.push(l, c, h), t.push(f), t.length - 1),
    s = t.length;
  for (let l = 0; l <= 2; l++) (i(-0.5, l / 2, 0, 0), i(0.5, l / 2, 0, 0));
  for (let l = 0; l < 2; l++) {
    const c = s + l * 2;
    e.push(c, c + 1, c + 2, c + 1, c + 3, c + 2);
  }
  for (let l = 0; l < 2; l++) {
    const c = t.length;
    (i(-0.5, 0, l, 3), i(0.5, 0, l, 3));
    const h = i(0, 1, l, 3);
    e.push(c, c + 1, h);
  }
  const n = i(0, 0, 1, 2),
    o = 5;
  for (let l = 0; l < o; l++) {
    const c = (l / o) * Math.PI * 2;
    i(Math.cos(c), Math.sin(c), 0, 2);
  }
  for (let l = 0; l < o; l++) e.push(n, n + 1 + l, n + 1 + ((l + 1) % o));
  for (let l = 0; l < FLOWER_MAX_PETALS; l++) {
    const c = t.length;
    (i(0, -1, l, 1),
      i(0, 1, l, 1),
      i(1, -1, l, 1),
      i(1, 1, l, 1),
      e.push(c, c + 2, c + 1, c + 1, c + 2, c + 3));
  }
  const a = new ThreeInstancedBufferGeometry();
  return (
    a.setAttribute("position", new ThreeFloat32BufferAttribute(r, 3)),
    a.setAttribute(
      "normal",
      new ThreeFloat32BufferAttribute(new Float32Array(r.length), 3),
    ),
    a.setAttribute("aPart", new ThreeFloat32BufferAttribute(t, 1)),
    a.setIndex(e),
    a
  );
}
const FLOWER_VERTEX_HEADER_GLSL = `
${FARM_SEASON_GLSL}
attribute vec4 aRoot;    // root xyz, rand
attribute vec4 aShape;   // height, head size, species, yaw
attribute float aPart;   // 0 stem, 1 petal, 2 centre, 3 leaf
attribute float aFarmCoverage;
varying vec4 vFl;        // part, u, v, species
varying vec4 vFl2;       // rand, t, petal index, 0
varying vec4 vGround;
varying vec2 vGrassXZ;
varying float vFarmWither;

float vegWindow(float s, float a, float b) {
  float x = mod(s - a + 4.0, 4.0);
  float w = mod(b - a + 4.0, 4.0);
  return smoothstep(0.0, 0.3, x) * smoothstep(w, w - 0.3, x);
}
float vegBloomWindow(float sp) {
  float s = uSeason;
  if (sp < 0.5) return vegWindow(s, 3.8, 1.9);    // daisy
  if (sp < 1.5) return vegWindow(s, 3.85, 1.35);  // buttercup
  if (sp < 2.5) return vegWindow(s, 0.65, 2.05);  // cornflower
  if (sp < 3.5) return vegWindow(s, 3.55, 0.95);  // violet
  if (sp < 4.5) return vegWindow(s, 0.55, 1.8);   // poppy
  return vegWindow(s, 1.35, 2.75);                // aster
}
// petals: count, length, width, cup (radians)
vec4 vegPetalShape(float sp) {
  if (sp < 0.5) return vec4(8.0, 1.0, 0.24, 0.06);
  if (sp < 1.5) return vec4(5.0, 0.72, 0.5, 0.7);
  if (sp < 2.5) return vec4(8.0, 0.9, 0.3, 0.28);
  if (sp < 3.5) return vec4(5.0, 0.78, 0.45, 0.22);
  if (sp < 4.5) return vec4(4.0, 0.95, 0.8, 0.6);
  return vec4(8.0, 1.0, 0.19, 0.12);
}
`;
const FLOWER_TRANSFORM_GLSL = `
  vec4 G = groundAt(aRoot.xz);
  float rnd = aRoot.w;
  float sp = aShape.z;
  // bloom: species window × meadow flowers × a lift after rain; asters carry autumn alone
  float amount = vegBloomWindow(sp) * mix(uFlowers, 1.0, sp > 4.5 ? 0.55 : 0.0) * (0.72 + 0.5 * G.y);
  float r2 = fract(rnd * 17.31);
  float show = smoothstep(r2 - 0.1, r2, amount) * (1.0 - smoothstep(0.08, 0.35, G.x));
  float H = aShape.x * (0.35 + 0.65 * show);
  float size = aShape.y * show * (0.9 + 0.2 * G.y);
  vec2 farmSuccession = farmGrassSuccession(aFarmCoverage, uSeason);
  float farmScale = mix(1.0, 0.16, farmSuccession.y);
  H *= farmScale;
  size *= mix(1.0, 0.08, farmSuccession.y);
  float gust;
  vec2 B = vegWindBend(aRoot.xz, rnd, 0.85, gust) * 1.15;
  vec2 face = vec2(-sin(aShape.w), cos(aShape.w));
  B += face * (0.12 + 0.2 * uNight);                                  // heads nod at night
  vec3 T;
  vec3 tip = aRoot.xyz + vegArc(B, H, 1.0, T);
  vec3 p;
  vec3 n;
  float part = aPart;
  if (part < 0.5) {
    // stem: a thin strip turned toward the eye
    vec3 Ts;
    p = aRoot.xyz + vegArc(B, H, position.y, Ts);
    vec3 side = normalize(cross(Ts, cameraPosition - p));
    p += side * position.x * 0.0035 * (0.4 + 0.6 * show) * farmScale;
    n = normalize(mix(cross(side, Ts), vec3(0.0, 1.0, 0.0), 0.5));
  } else if (part > 2.5) {
    // basal leaves: short arcs close to the ground
    float a = aShape.w + position.z * 3.14159 + 0.6;
    vec2 d = vec2(cos(a), sin(a));
    vec2 Bl = d * 1.1 + B * 0.3;
    vec3 Tl;
    float Ll = aShape.x * 0.38 * farmScale;
    p = aRoot.xyz + vegArc(Bl, Ll, position.y, Tl);
    vec3 side = normalize(vec3(-d.y, 0.0, d.x));
    p += side * position.x * 0.009 * (1.0 - position.y * 0.6) * farmScale;
    n = normalize(mix(cross(side, Tl), vec3(0.0, 1.0, 0.0), 0.5));
    n *= sign(n.y + 1e-4);
  } else {
    // head frame: stem tangent, turned toward the sun by day
    vec3 up = normalize(T + vec3(uSunDir.x, max(uSunDir.y, 0.0), uSunDir.z) * 0.55 * (1.0 - uNight));
    vec3 e1 = normalize(cross(up, abs(up.z) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0)));
    vec3 e2 = cross(up, e1);
    vec4 ps = vegPetalShape(sp);
    if (part < 1.5) {
      float idx = position.z;
      float a = aShape.w * 3.0 + idx / ps.x * 6.28318;
      vec3 radial = e1 * cos(a) + e2 * sin(a);
      float cup = ps.w + (1.25 - ps.w) * uNight * 0.75;              // close up at night
      vec3 pv = radial * cos(cup) + up * sin(cup);
      vec3 across = cross(up, radial);
      float len = size * ps.y;
      p = tip + pv * (size * 0.12 + position.x * len) + across * position.y * size * ps.z * 0.5;
      p += up * size * 0.05;
      if (idx >= ps.x) p = tip;                                       // unused petal slot
      n = normalize(up * cos(cup) - radial * sin(cup) * 0.6);
    } else {
      float cs = sp < 0.5 || sp > 4.5 ? 0.3 : 0.22;
      p = tip + (e1 * position.x + e2 * position.y) * size * cs + up * position.z * size * 0.14;
      n = normalize(up + (e1 * position.x + e2 * position.y) * 0.6);
    }
  }
  vec3 objectNormal = n;
  vec3 vegPos = p;
  vFl = vec4(part, position.x, position.y, sp);
  vFl2 = vec4(rnd, position.y, position.z, show);
  vGround = G;
  vGrassXZ = aRoot.xz;
  vFarmWither = farmSuccession.x;
`;
const FLOWER_VARYINGS_GLSL = `
varying vec4 vFl;
varying vec4 vFl2;
varying vec4 vGround;
varying vec2 vGrassXZ;
varying float vFarmWither;
`;
const FLOWER_COLOR_GLSL = `
  float part = vFl.x, sp = vFl.w, rnd = vFl2.x;
  vec3 col;
  float autumn = vegAutumn();
  vec3 green = mix(vec3(0.12, 0.26, 0.06), vec3(0.2, 0.34, 0.08), fract(rnd * 3.3));
  green = mix(green, vec3(0.3, 0.24, 0.1), autumn * 0.6);
  green = mix(green, vec3(0.36, 0.29, 0.15) * (0.85 + rnd * 0.25), vFarmWither * 0.85);
  if (part < 0.5 || part > 2.5) {
    col = green * (part > 2.5 ? 0.85 : mix(0.5, 1.0, vFl2.y));
    vegTransAmt = 0.6;
  } else if (part < 1.5) {
    float u = vFl.y, v = abs(vFl.z);
    // outline: slim ribbons (daisy, aster), cups (buttercup, violet, poppy), ragged (cornflower)
    float w;
    if (sp < 0.5 || sp > 4.5) w = 0.95 * pow(max(sin(3.14159 * min(u * 1.08, 1.0)), 0.0), 0.45);
    else if (sp > 1.5 && sp < 2.5) w = (0.55 + 0.45 * u) * (1.0 - smoothstep(0.8, 1.0, u) * (0.5 + 0.5 * sin(v * 18.0)));
    else w = sqrt(max(0.0, 1.0 - pow(u * 2.0 - 1.0, 2.0))) * mix(0.55, 1.0, smoothstep(0.0, 0.5, u));
    if (v > w) discard;
    vec3 pc;
    if (sp < 0.5) pc = mix(vec3(0.95, 0.94, 0.9), vec3(0.95, 0.62, 0.72), smoothstep(0.85, 1.0, u) * 0.6);
    else if (sp < 1.5) pc = vec3(1.0, 0.72, 0.02);
    else if (sp < 2.5) pc = vec3(0.1, 0.24, 0.9);
    else if (sp < 3.5) pc = vec3(0.4, 0.16, 0.72);
    else if (sp < 4.5) pc = mix(vec3(0.05, 0.03, 0.03), vec3(0.9, 0.06, 0.03), smoothstep(0.1, 0.28, u));
    else pc = vec3(0.66, 0.5, 0.9);
    pc *= 0.88 + 0.24 * fract(rnd * 9.7);
    col = pc * mix(0.75, 1.0, smoothstep(0.0, 0.4, u));
    vegTransAmt = 1.0;
  } else {
    vec3 cc = sp < 0.5 || sp > 4.5 ? vec3(0.95, 0.62, 0.04) : sp < 1.5 ? vec3(0.8, 0.7, 0.1) : sp > 3.5 ? vec3(0.04, 0.05, 0.03) : vec3(0.12, 0.08, 0.3);
    float dots = wgNoise(vec2(vFl.y, vFl.z) * 9.0 + rnd * 20.0);
    col = cc * (0.7 + 0.5 * dots);
    vegTransAmt = 0.3;
  }
  col *= 1.0 - vGround.y * 0.15;
  col = mix(col, vec3(0.75, 0.82, 0.9), vGround.w * 0.35);
  diffuseColor.rgb = col;
`;
const FLOWER_ROUGHNESS_GLSL = `
  float roughnessFactor = vFl.x > 0.5 && vFl.x < 1.5 && vFl.w > 0.5 && vFl.w < 1.5 ? 0.3 : mix(roughness, 0.35, vGround.y * 0.7);
`;
function createFlowerMesh(r, t) {
  const e = buildFlowerGeometry();
  const farmCoverage = new Float32Array(t.count);
  for (let index = 0; index < t.count; index++)
    farmCoverage[index] = farmCropCoverage(
      t.root[index * 4],
      t.root[index * 4 + 2],
    );
  e.setAttribute(
    "aFarmCoverage",
    new ThreeInstancedBufferAttribute(farmCoverage, 1),
  );
  (e.setAttribute(
    "aRoot",
    new ThreeInstancedBufferAttribute(t.root.subarray(0, t.count * 4), 4),
  ),
    e.setAttribute(
      "aShape",
      new ThreeInstancedBufferAttribute(t.shape.subarray(0, t.count * 4), 4),
    ),
    (e.instanceCount = t.count),
    (e.boundingSphere = new ThreeSphere(new ThreeVector3(0, 1, 0), 8)));
  const i = patchVegetationMaterial(
      new ThreeMeshStandardMaterial({
        roughness: 0.6,
        metalness: 0,
        side: ThreeDoubleSide,
        envMapIntensity: 0.5,
      }),
      r,
      {
        key: "veg-flowers-farm-season-v1",
        vertexHead: FLOWER_VERTEX_HEADER_GLSL,
        fragmentHead: FLOWER_VARYINGS_GLSL,
        vertex: {
          beginnormal_vertex: FLOWER_TRANSFORM_GLSL,
          begin_vertex: "vec3 transformed = vegPos;",
        },
        fragment: {
          color_fragment: FLOWER_COLOR_GLSL,
          roughnessmap_fragment: FLOWER_ROUGHNESS_GLSL,
        },
        light: !0,
        noFlip: !0,
      },
    ),
    s = new ThreeMesh(e, i);
  return (
    (s.name = "vegetation-flowers"),
    (s.receiveShadow = !0),
    (s.userData.noReflect = !0),
    s
  );
}
export { createFlowerMesh };
