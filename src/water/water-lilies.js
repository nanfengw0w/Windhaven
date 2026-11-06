// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferGeometry,
  ThreeCircleGeometry,
  ThreeColor,
  ThreeDoubleSide,
  ThreeFloat32BufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeMeshStandardMaterial,
  ThreeQuaternion,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { WATER_LEVEL_CONFIG } from "../core/config.js";
import {
  LAKE_SHAPE,
  RIVER_CONTROL_POINTS,
  terrainHeight,
} from "../simulation/terrain-shape.js";
import {
  LAKE_FRONT_Z,
  createWaterRandom,
} from "./uniforms-and-shadow-binding.js";
import { WATER_COMMON_GLSL } from "./common-shader.js";
const LILY_PAD_TRANSFORM_GLSL = `
  // float at the lake surface, bob on the ripples, grow with the season, shrink under ice
  vec3 wBase = vec3(instanceMatrix[3].x, 0.0, instanceMatrix[3].z);
  float wS = length(instanceMatrix[0].xyz);
  float wDepth = uWaterLevel - groundHeightAt(wBase.xz);
  float wIce = wIceMask(wBase.xz, max(wDepth, 0.0));
  float wGrow = uGrow * (1.0 - wIce) * smoothstep(0.0, 0.03, wDepth);
  transformed *= wGrow;
  float wH = wRippleH(wBase.xz) * W_RIPPLE_H;
  vec2 wG = wRippleGrad(wBase.xz);
  // tilt with the local ripple slope
  transformed.y += dot(transformed.xz * wS, -wG) / wS;
  transformed.y += (uWaterLevel + wH + 0.004 + uLift) / wS;
  vPadUv = position.xz;
`;
class WaterLilies {
  constructor(t, e, i) {
    this.ctx = t;
    const s = createWaterRandom(2718),
      n = this._place(s);
    ((this.grow = {
      value: 0,
    }),
      (this.autumn = {
        value: 0,
      }));
    const o = new ThreeCircleGeometry(1, 22, 0.22, Math.PI * 2 - 0.44);
    o.rotateX(-Math.PI / 2);
    const a = o.attributes.position;
    for (let m = 0; m < a.count; m++) {
      const w = Math.hypot(a.getX(m), a.getZ(m));
      a.setY(m, 0.06 * (1 - w * w) - 0.02 * w);
    }
    o.computeVertexNormals();
    const l = new ThreeMeshStandardMaterial({
      color: 16777215,
      roughness: 0.38,
      metalness: 0,
    });
    ((l.onBeforeCompile = (m) => {
      (Object.assign(m.uniforms, t.uniforms, e, {
        uGrow: this.grow,
        uAutumn: this.autumn,
        uLift: {
          value: 0,
        },
      }),
        (m.vertexShader =
          t.GLSL_COMMON +
          WATER_COMMON_GLSL +
          `uniform float uGrow;
uniform float uAutumn;
uniform float uLift;
varying vec2 vPadUv;
` +
          m.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
` + LILY_PAD_TRANSFORM_GLSL,
          )),
        (m.fragmentShader =
          t.GLSL_COMMON +
          `uniform float uAutumn;
varying vec2 vPadUv;
` +
          m.fragmentShader.replace(
            "#include <color_fragment>",
            `#include <color_fragment>
        {
          float r = length(vPadUv);
          float a = atan(vPadUv.y, vPadUv.x);
          float veins = smoothstep(0.08, 0.0, abs(fract(a * 3.1831 * 2.2) - 0.5) * r * 2.0) * smoothstep(0.1, 0.5, r);
          vec3 leaf = diffuseColor.rgb * (0.85 + 0.25 * wgNoise(vPadUv * 9.0));
          leaf = mix(leaf, leaf * 1.35 + vec3(0.03, 0.04, 0.0), veins * 0.5);
          leaf = mix(leaf, leaf * 0.7, smoothstep(0.8, 1.0, r));             // darker rim
          vec3 dry = mix(vec3(0.5, 0.38, 0.1), vec3(0.34, 0.2, 0.08), wgNoise(vPadUv * 4.0 + diffuseColor.rg * 20.0));
          leaf = mix(leaf, dry, uAutumn * smoothstep(0.2, 0.9, wgNoise(vPadUv * 2.0 + diffuseColor.gb * 11.0) + uAutumn * 0.5));
          diffuseColor.rgb = leaf;
        }`,
          )));
    }),
      (l.customProgramCacheKey = () => "wg-water-lilypad"),
      (this.pads = new ThreeInstancedMesh(o, l, n.length)));
    const c = new ThreeMatrix4(),
      h = new ThreeQuaternion(),
      f = new ThreeVector3(),
      u = new ThreeVector3(),
      d = new ThreeVector3(0, 1, 0),
      p = new ThreeColor();
    (n.forEach((m, w) => {
      (h.setFromAxisAngle(d, s() * Math.PI * 2),
        u.set(m.x, 0, m.z),
        f.setScalar(m.r),
        c.compose(u, h, f),
        this.pads.setMatrixAt(w, c),
        p.setRGB(0.07 + s() * 0.06, 0.2 + s() * 0.09, 0.04 + s() * 0.04),
        this.pads.setColorAt(w, p));
    }),
      (this.pads.receiveShadow = !0),
      (this.pads.castShadow = !1),
      (this.pads.name = "water:lilypads"));
    const v = n.filter((m) => m.flower),
      g = buildLilyFlowerGeometry();
    this.flowerGrow = {
      value: 0,
    };
    const x = new ThreeMeshStandardMaterial({
      vertexColors: !0,
      roughness: 0.55,
      metalness: 0,
      emissive: 2103320,
      side: ThreeDoubleSide,
    });
    ((x.onBeforeCompile = (m) => {
      (Object.assign(m.uniforms, t.uniforms, e, {
        uGrow: this.flowerGrow,
        uAutumn: this.autumn,
        uLift: {
          value: 0.012,
        },
      }),
        (m.vertexShader =
          t.GLSL_COMMON +
          WATER_COMMON_GLSL +
          `uniform float uGrow;
uniform float uAutumn;
uniform float uLift;
varying vec2 vPadUv;
` +
          m.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
` + LILY_PAD_TRANSFORM_GLSL,
          )));
    }),
      (x.customProgramCacheKey = () => "wg-water-lilyflower"),
      (this.flowers = new ThreeInstancedMesh(g, x, Math.max(1, v.length))),
      v.forEach((m, w) => {
        (h.setFromAxisAngle(d, s() * Math.PI * 2),
          u.set(m.x + m.r * 0.15, 0, m.z - m.r * 0.1),
          f.setScalar(0.028 + s() * 0.012),
          c.compose(u, h, f),
          this.flowers.setMatrixAt(w, c));
      }),
      (this.flowers.count = v.length),
      (this.flowers.name = "water:lilyflowers"));
    for (const m of [this.pads, this.flowers])
      ((m.frustumCulled = !1), i.add(m));
  }
  _place(t) {
    const e = RIVER_CONTROL_POINTS[RIVER_CONTROL_POINTS.length - 2],
      i = [],
      s = [];
    let n = 0;
    for (; s.length < 5 && n++ < 400;) {
      const o = t() * Math.PI * 2,
        a = 0.7 + t() * 0.35,
        l = LAKE_SHAPE.cx + Math.cos(o) * LAKE_SHAPE.rx * a,
        c = LAKE_SHAPE.cz + Math.sin(o) * LAKE_SHAPE.rz * a,
        h = WATER_LEVEL_CONFIG.lakeLevel - terrainHeight(l, c);
      h < 0.06 ||
        h > 0.28 ||
        c > LAKE_FRONT_Z - 0.25 ||
        Math.hypot(l - e.x, c - e.z) < 0.9 ||
        s.some((f) => Math.hypot(f.x - l, f.z - c) < 0.8) ||
        s.push({
          x: l,
          z: c,
        });
    }
    for (const o of s) {
      const a = 4 + Math.floor(t() * 5);
      for (let l = 0; l < a * 3 && i.length < 40; l++) {
        const c = t() * Math.PI * 2,
          h = Math.sqrt(t()) * 0.32,
          f = o.x + Math.cos(c) * h,
          u = o.z + Math.sin(c) * h,
          d = 0.04 + t() * 0.045;
        WATER_LEVEL_CONFIG.lakeLevel - terrainHeight(f, u) < 0.03 ||
          u > LAKE_FRONT_Z - 0.12 ||
          i.some((v) => Math.hypot(v.x - f, v.z - u) < (v.r + d) * 0.95) ||
          i.push({
            x: f,
            z: u,
            r: d,
            flower: t() < 0.22,
          });
      }
    }
    return i;
  }
  update(t) {
    const e = t.season,
      i =
        waterSeasonSmoothstep(0.3, 0.85, e) *
        (1 - waterSeasonSmoothstep(2.35, 2.85, e));
    ((this.grow.value = i),
      (this.autumn.value = waterSeasonSmoothstep(1.7, 2.4, e)),
      (this.flowerGrow.value =
        i *
        waterSeasonSmoothstep(0.55, 0.9, e) *
        (1 - waterSeasonSmoothstep(1.65, 2, e))),
      (this.pads.visible = i > 0.01),
      (this.flowers.visible = this.flowerGrow.value > 0.01));
  }
}
function waterSeasonSmoothstep(r, t, e) {
  const i = Math.max(0, Math.min(1, (e - r) / (t - r)));
  return i * i * (3 - 2 * i);
}
function buildLilyFlowerGeometry() {
  const r = [],
    t = [],
    e = [],
    i = [0.96, 0.93, 0.95],
    s = [0.95, 0.6, 0.74],
    n = [1, 0.78, 0.25],
    o = (c, h, f, u, d, p) => {
      const v = r.length / 3,
        g = Math.cos(c),
        x = Math.sin(c),
        m = h,
        w = p + u;
      (r.push(0, p, 0),
        r.push(
          Math.cos(c - f) * h * 0.5,
          p + u * 0.4,
          Math.sin(c - f) * h * 0.5,
        ),
        r.push(
          Math.cos(c + f) * h * 0.5,
          p + u * 0.4,
          Math.sin(c + f) * h * 0.5,
        ),
        r.push(g * m, w, x * m),
        t.push(...i, ...i, ...i, ...d),
        e.push(v, v + 1, v + 3, v, v + 3, v + 2));
    };
  for (let c = 0; c < 8; c++) o((c / 8) * Math.PI * 2, 1, 0.32, 0.35, s, 0);
  for (let c = 0; c < 6; c++)
    o((c / 6 + 0.08) * Math.PI * 2, 0.7, 0.34, 0.6, i, 0.05);
  const a = r.length / 3;
  (r.push(0, 0.28, 0), t.push(...n));
  for (let c = 0; c < 6; c++) {
    const h = (c / 6) * Math.PI * 2;
    (r.push(Math.cos(h) * 0.18, 0.12, Math.sin(h) * 0.18), t.push(...n));
  }
  for (let c = 0; c < 6; c++) e.push(a, a + 1 + ((c + 1) % 6), a + 1 + c);
  const l = new ThreeBufferGeometry();
  return (
    l.setAttribute("position", new ThreeFloat32BufferAttribute(r, 3)),
    l.setAttribute("color", new ThreeFloat32BufferAttribute(t, 3)),
    l.setIndex(e),
    l.computeVertexNormals(),
    l
  );
}
export { WaterLilies };
