// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeDoubleSide,
  ThreeFloat32BufferAttribute,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreeShaderMaterial,
  ThreeVector4,
} from "../vendor/three-runtime.js";
import {
  PRECIPITATION_FALL_GLSL,
  PRECIPITATION_SLOT_COUNT,
  RAIN_FALL_SPEED,
} from "./column.js";
const SPLASH_VERTEX_SHADER = `
attribute vec4 aSeed;
attribute vec2 aSlot;        // slot index, rank within the slot (0..1)
uniform vec4 uSpSrc[${PRECIPITATION_SLOT_COUNT}];   // x, z, radius, visible fraction
uniform vec4 uSpCol[${PRECIPITATION_SLOT_COUNT}];   // cloud base y, intensity, source vel x, vel z
uniform float uPixel;
uniform float uIce;
varying vec2 vUv;             // offset from the impact point in billboard space (world units)
varying float vT;             // seconds since impact
varying float vKind;          // 0 land crown, 1 water hop
varying vec3 vCol;
varying float vPx;
varying float vA;
varying vec4 vRnd;
varying vec3 vRight;
varying vec3 vUp;

${PRECIPITATION_FALL_GLSL}

void cull() { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); vA = 0.0; }

void main() {
  int si = int(aSlot.x + 0.5);
  vec4 src = uSpSrc[si];
  if (aSlot.y >= src.w) { cull(); return; }
  vec4 col = uSpCol[si];
  float period = mix(0.32, 0.6, aSeed.x);
  float cyc = uTime / period + aSeed.y * 17.0;
  float ci = floor(cyc);
  float t = fract(cyc) * period;
  vec4 rnd = vec4(wgHash(vec2(ci, aSeed.z * 91.7)), wgHash(vec2(aSeed.w * 53.3, ci * 1.31)),
                  wgHash(vec2(ci * 0.71, aSeed.x * 37.1)), wgHash(vec2(aSeed.y * 13.9, ci * 2.17)));
  vec2 xz = src.xy + precipDisk(rnd.xy, src.z);
  // land where the (wind-slanted, cloud-lagged) drops land
  float tf = max(0.0, col.x - groundHeightAt(xz)) / ${RAIN_FALL_SPEED.toFixed(2)};
  xz += windAt(xz) * precipDrift(tf) - col.zw * min(tf, 1.2);
  if (any(lessThan(precipEdgeDistance(xz), vec2(0.1)))) { cull(); return; }
  vec4 ter = terrainAt(xz);
  float lake = step(0.5, ter.z) * (1.0 - uIce);
  float water = max(lake, step(0.55, ter.y));
  float y = lake > 0.5 ? max(ter.x, uWaterLevel) : ter.x + ter.y * 0.07;
  if (precipSnowAt(y + 0.15) > 0.45 || (water < 0.5 && groundAt(xz).x > 0.22)) { cull(); return; }

  vec3 c = vec3(xz.x, y, xz.y);
  vec3 d = cameraPosition - c;
  float dist = length(d);
  vec3 toCam = d / dist;
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toCam) + vec3(1e-5, 0.0, 0.0));
  vec3 up = cross(toCam, right);
  float px = dist * uPixel;
  float hs = (water > 0.5 ? 0.075 : 0.1) * (0.8 + 0.35 * col.y);
  hs = max(hs, px * 6.0);
  float lift = hs * 0.55;
  vec3 wp = c + vec3(0.0, lift, 0.0) + (right * position.x + up * position.y) * hs;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);

  vUv = vec2(position.x * hs, position.y * hs + lift * up.y);
  vT = t;
  vKind = water;
  vPx = px;
  vRnd = rnd;
  vRight = right;
  vUp = up;
  vec3 viewDir = -toCam;
  float sunUp = smoothstep(-0.04, 0.12, uSunDir.y);
  float back = pow(max(dot(viewDir, uSunDir), 0.0), 5.0) * 1.5 * sunUp;
  vec3 amb = uSkyColor * 0.6 + uGroundColor * 0.2;
  vCol = applyHaze(amb * 0.85 + uLightColor * (0.32 + back) + vec3(0.8, 0.86, 1.0) * uFlash * 1.2, dist, y);
  vA = (0.55 + 0.45 * col.y) * min(1.0, 0.006 / px + 0.4);
}
`;
const SPLASH_FRAGMENT_SHADER = `
varying vec2 vUv;
varying float vT;
varying float vKind;
varying vec3 vCol;
varying float vPx;
varying float vA;
varying vec4 vRnd;
varying vec3 vRight;
varying vec3 vUp;

// a small glowing dot at p (billboard space), radius r
float dotAt(vec2 uv, vec2 p, float r) { vec2 q = uv - p; return exp(-dot(q, q) / (r * r)); }
// gaussian line profile: 1 on the curve, falling off with the (signed) distance x / width w
float line(float x, float w) { float k = x / w; return exp(-k * k); }
// project a world-space offset from the impact into billboard space
vec2 proj(vec3 o) { return vec2(dot(o, vRight), dot(o, vUp)); }

void main() {
  if (vA <= 0.0) discard;
  float t = vT;
  float r = max(0.0035, vPx * 0.75);
  float thick = max(0.003, vPx * 0.7);
  float e = max(0.12, length(vUp.xz)); // how open a horizontal ring looks from here
  float a = 0.0;
  if (vKind < 0.5) {
    // crown: an expanding rim that rises and collapses, then droplets fly out and fall
    float R = 0.07 * (1.0 - exp(-t * 16.0)) + 0.008;
    float H = 0.035 * sin(clamp(t / 0.16, 0.0, 1.0) * 3.14159) * (0.7 + 0.6 * vRnd.z);
    float fade = 1.0 - smoothstep(0.05, 0.16, t);
    vec2 q0 = vUv / vec2(R, R * e);
    vec2 q1 = (vUv - vec2(0.0, H)) / vec2(R * 0.85, R * 0.85 * e);
    float ring = line((length(q0) - 1.0) * R, thick * 1.4);
    // the rim breaks up into little points (the crown's fingers)
    float ang = atan(q1.y, q1.x + 1e-5);
    float fingers = pow(0.5 + 0.5 * sin(ang * 9.0 + vRnd.z * 40.0), 3.0);
    float rim = line((length(q1) - 1.0) * R * 0.85, thick * 1.3) * (0.25 + 0.75 * fingers);
    // a faint sheet between base and rim, visible mostly at the silhouette edges
    float side = smoothstep(0.6, 1.0, abs(vUv.x) / R) * (1.0 - smoothstep(1.0, 1.08, abs(vUv.x) / R));
    float wall = side * smoothstep(-R * e * 0.4, 0.0, vUv.y) * (1.0 - smoothstep(H * 0.7, H + R * e * 0.2, vUv.y));
    a += (ring * 0.18 * (1.0 - smoothstep(0.02, 0.07, t)) + rim * 0.45 + wall * 0.18) * fade;
    for (int k = 0; k < 6; k++) {
      float fk = float(k);
      float th = vRnd.w * 6.2831 + fk * 1.0472 + sin(fk * 7.3 + vRnd.z * 20.0) * 0.4;
      float h = 0.12 + 0.14 * fract(vRnd.z * 7.0 + fk * 0.37);
      float v0 = 0.45 + 0.45 * fract(vRnd.w * 5.0 + fk * 0.61);
      float tt = t - 0.02;
      float yv = v0 * tt - 2.8 * tt * tt;
      if (tt > 0.0 && yv > -0.004) a += dotAt(vUv, proj(vec3(cos(th) * h * tt, yv, sin(th) * h * tt)), r) * 0.9;
    }
  } else {
    // water: a quick ring and a single droplet jumping up out of the collapsing cavity
    float R = 0.045 * (1.0 - exp(-t * 12.0)) + 0.005;
    vec2 q0 = vUv / vec2(R, R * e);
    a += line((length(q0) - 1.0) * R, thick) * 0.16 * (1.0 - smoothstep(0.04, 0.14, t));
    a += dotAt(vUv, vec2(0.0, 0.004), r * 1.4) * (1.0 - smoothstep(0.0, 0.04, t)) * 0.8; // the impact glint
    float jet = smoothstep(0.03, 0.06, t) * (1.0 - smoothstep(0.1, 0.15, t));
    float jh = 0.028 * jet;
    a += jet * exp(-vUv.x * vUv.x / (r * r * 0.6)) * step(0.0, vUv.y) * step(vUv.y, jh) * 0.8;
    float tt = t - 0.09;
    float yv = (0.55 + 0.25 * vRnd.z) * tt - 3.0 * tt * tt + 0.02;
    if (tt > 0.0 && yv > 0.0) a += dotAt(vUv, vec2(0.0, yv), r * 1.1);
  }
  a = clamp(a, 0.0, 1.0) * vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vCol * (1.0 + a * 0.4), a);
}
`;
class RainSplashes {
  constructor(t, e) {
    ((this.ctx = t),
      (this.slots = e),
      (this.perSlot = t.quality.pick(24, 60, 110)));
    const i = this.perSlot * PRECIPITATION_SLOT_COUNT,
      s = new Float32Array(i * 4),
      n = new Float32Array(i * 2);
    for (let c = 0; c < i; c++) {
      for (let h = 0; h < 4; h++) s[c * 4 + h] = Math.random();
      ((n[c * 2] = c % PRECIPITATION_SLOT_COUNT),
        (n[c * 2 + 1] =
          (Math.floor(c / PRECIPITATION_SLOT_COUNT) + 0.5) / this.perSlot));
    }
    const o = new ThreeInstancedBufferGeometry();
    (o.setIndex([0, 1, 2, 0, 2, 3]),
      o.setAttribute(
        "position",
        new ThreeFloat32BufferAttribute(
          [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0],
          3,
        ),
      ),
      o.setAttribute("aSeed", new ThreeInstancedBufferAttribute(s, 4)),
      o.setAttribute("aSlot", new ThreeInstancedBufferAttribute(n, 2)),
      (o.instanceCount = i));
    const a = () =>
      Array.from(
        {
          length: PRECIPITATION_SLOT_COUNT,
        },
        () => new ThreeVector4(),
      );
    this.uniforms = {
      uSpSrc: {
        value: a(),
      },
      uSpCol: {
        value: a(),
      },
      uPixel: {
        value: 0.001,
      },
      uIce: {
        value: 0,
      },
    };
    const l = new ThreeShaderMaterial({
      uniforms: {
        ...t.uniforms,
        ...this.uniforms,
      },
      vertexShader: t.GLSL_COMMON + SPLASH_VERTEX_SHADER,
      fragmentShader: t.GLSL_COMMON + SPLASH_FRAGMENT_SHADER,
      transparent: !0,
      depthWrite: !1,
      side: ThreeDoubleSide,
    });
    ((this.mesh = new ThreeMesh(o, l)),
      (this.mesh.name = "precip-splashes"),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 8.1),
      (this.mesh.visible = !1),
      t.scene.add(this.mesh));
  }
  update(t, e, i) {
    const { slots: s, uniforms: n } = this;
    let o = !1;
    for (let a = 0; a < PRECIPITATION_SLOT_COUNT; a++) {
      const l = s[a],
        c = n.uSpSrc.value[a];
      let h = 0;
      if (l.visible && l.arrival > 0.01 && l.snowGround < 0.6) {
        const f = l.rate * Math.PI * l.radius * l.radius * 16;
        h = Math.min(1, f / this.perSlot) * l.arrival * (1 - l.snowGround);
      }
      (c.set(l.x, l.z, l.radius * 0.95, h),
        n.uSpCol.value[a].set(l.y, Math.min(1.5, l.rate), l.vx, l.vz),
        h > 0.005 && (o = !0));
    }
    ((n.uPixel.value = i),
      (n.uIce.value =
        this.ctx.modules.water?.ice ?? this.ctx.fields.lakeFrozen ?? 0),
      (this.mesh.visible = o));
  }
}
export { RainSplashes };
