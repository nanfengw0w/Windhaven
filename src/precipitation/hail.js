// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeIcosahedronGeometry,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreeMeshStandardMaterial,
  ThreeVector4,
} from "../vendor/three-runtime.js";
import { PRECIPITATION_EDGE_GLSL, PRECIPITATION_SLOT_COUNT } from "./column.js";
import { smoothstepLightning } from "./lightning.js";
import { LANDSCAPE_AREA_SCALE } from "../core/weather-extent.js";
const sd = 2.6;
const m1 = 7.5;
const HAIL_VERTEX_SHADER = `
attribute vec4 aSeed;
attribute vec2 aSlot;
uniform vec4 uHaSrc[${PRECIPITATION_SLOT_COUNT}];   // x, z, radius, visible fraction
uniform vec4 uHaCol[${PRECIPITATION_SLOT_COUNT}];   // cloud base y, source vel x, vel z, ice (lake frozen)

${PRECIPITATION_EDGE_GLSL}

// Position of a pellet (xyz) and its scale (w, 0 = hidden).
vec4 hailPellet() {
  int si = int(aSlot.x + 0.5);
  vec4 src = uHaSrc[si];
  if (aSlot.y >= src.w) return vec4(0.0);
  vec4 col = uHaCol[si];
  float cyc = uTime / ${sd.toFixed(2)} + aSeed.x * 13.0;
  float ci = floor(cyc);
  float t = fract(cyc) * ${sd.toFixed(2)};
  vec2 rnd = vec2(wgHash(vec2(ci, aSeed.y * 71.3)), wgHash(vec2(aSeed.z * 43.1, ci * 1.7)));
  float r = src.z * 0.8 * sqrt(rnd.x);
  float a = rnd.y * 6.2831853;
  vec2 xz = src.xy + vec2(cos(a), sin(a)) * r;
  vec4 ter0 = terrainAt(xz);
  float g = ter0.z > 0.5 ? max(ter0.x, uWaterLevel) : ter0.x; // open water stops them at the surface
  float tLand = max(0.05, (col.x - g) / ${m1.toFixed(2)});
  xz += windAt(xz) * min(t, tLand) * 0.35 - col.yz * min(t, tLand) * 0.5;
  if (any(lessThan(precipEdgeDistance(xz), vec2(0.08)))) return vec4(0.0);
  vec4 ter = terrainAt(xz);
  g = ter.x;
  float size = mix(0.02, 0.038, aSeed.w * aSeed.w);
  float y;
  float scale = size;
  if (t < tLand) {
    y = col.x - ${m1.toFixed(2)} * t;
    scale *= smoothstep(0.0, 0.08, t);               // emerge from the cloud base
  } else {
    float lake = step(0.5, ter.z) * (1.0 - col.w);
    if (lake > 0.5 || ter.y > 0.55) return vec4(0.0); // plop – gone into the water
    float tb = t - tLand;
    // two hops with restitution, sliding outward, then rest and melt
    float soft = groundAt(xz).x > 0.25 ? 0.35 : 1.0; // snow swallows the bounce
    float v1 = (1.0 + 0.6 * aSeed.z) * soft, v2 = v1 * 0.38;
    float d1 = v1 / 4.9, d2 = v2 / 4.9;
    float h = 0.0, slide = 0.0;
    if (tb < d1) { h = v1 * tb - 4.9 * tb * tb; slide = tb / d1; }
    else if (tb < d1 + d2) { float u = tb - d1; h = v2 * u - 4.9 * u * u; slide = 1.0 + 0.4 * u / d2; }
    else slide = 1.4;
    float sa = aSeed.y * 6.2831853 + ci;
    xz += vec2(cos(sa), sin(sa)) * slide * 0.09 * soft;
    g = groundHeightAt(xz);
    y = g + size * 0.7 + h;
    float left = ${sd.toFixed(2)} - t;
    scale *= smoothstep(0.0, 0.7, left);              // melt
  }
  return vec4(xz.x, y, xz.y, scale);
}
`;
class HailParticles {
  constructor(t, e) {
    if (
      ((this.ctx = t),
      (this.slots = e),
      (this.perSlot = t.quality.pick(0, 120, 200)),
      (this.amount = 0),
      !this.perSlot)
    )
      return;
    const i = this.perSlot * PRECIPITATION_SLOT_COUNT,
      s = new ThreeIcosahedronGeometry(1, t.quality.pick(0, 0, 1)),
      n = new ThreeInstancedBufferGeometry();
    (n.setAttribute("position", s.getAttribute("position")),
      n.setAttribute("normal", s.getAttribute("position").clone()));
    const o = new Float32Array(i * 4),
      a = new Float32Array(i * 2);
    for (let h = 0; h < i; h++) {
      for (let f = 0; f < 4; f++) o[h * 4 + f] = Math.random();
      ((a[h * 2] = h % PRECIPITATION_SLOT_COUNT),
        (a[h * 2 + 1] =
          (Math.floor(h / PRECIPITATION_SLOT_COUNT) + 0.5) / this.perSlot));
    }
    (n.setAttribute("aSeed", new ThreeInstancedBufferAttribute(o, 4)),
      n.setAttribute("aSlot", new ThreeInstancedBufferAttribute(a, 2)),
      (n.instanceCount = i));
    const l = () =>
      Array.from(
        {
          length: PRECIPITATION_SLOT_COUNT,
        },
        () => new ThreeVector4(),
      );
    this.uniforms = {
      uHaSrc: {
        value: l(),
      },
      uHaCol: {
        value: l(),
      },
    };
    const c = new ThreeMeshStandardMaterial({
      color: 15922940,
      roughness: 0.18,
      metalness: 0,
      emissive: 1843756,
    });
    ((c.onBeforeCompile = (h) => {
      (Object.assign(h.uniforms, t.uniforms, this.uniforms),
        (h.vertexShader =
          t.GLSL_COMMON +
          HAIL_VERTEX_SHADER +
          h.vertexShader.replace(
            "#include <begin_vertex>",
            `vec4 hp = hailPellet();
         vec3 transformed = position * hp.w + hp.xyz;`,
          )));
    }),
      (c.customProgramCacheKey = () => "wg-precip-hail"),
      (this.mesh = new ThreeMesh(n, c)),
      (this.mesh.name = "precip-hail"),
      (this.mesh.frustumCulled = !1),
      (this.mesh.visible = !1),
      t.scene.add(this.mesh));
  }
  update() {
    if (!this.perSlot) return 0;
    const { slots: t, uniforms: e } = this,
      i = this.ctx.world,
      s = this.ctx.modules.water?.ice ?? this.ctx.fields.lakeFrozen ?? 0;
    let n = 0;
    for (let o = 0; o < PRECIPITATION_SLOT_COUNT; o++) {
      const a = t[o];
      let l = 0;
      if (a.visible && a.arrival > 0.01 && a.snowGround < 0.1) {
        const c = smoothstepLightning(0.6, 0.95, a.storm),
          h = smoothstepLightning(1.05, 1.6, a.rate),
          f = smoothstepLightning(12, 18, i.temperatureAt(a.groundY));
        l = c * h * f * a.arrival;
      }
      (e.uHaSrc.value[o].set(a.x, a.z, a.radius, l),
        e.uHaCol.value[o].set(a.y, a.vx, a.vz, s),
        (n += l * a.rate));
    }
    return (
      (this.mesh.visible = n > 0.005),
      (this.amount = n / LANDSCAPE_AREA_SCALE),
      this.amount
    );
  }
}
export { HailParticles };
