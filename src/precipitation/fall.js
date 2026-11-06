// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferAttribute,
  ThreeDoubleSide,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreeShaderMaterial,
  ThreeVector4,
} from "../vendor/three-runtime.js";
import {
  PRECIPITATION_FALL_GLSL,
  PRECIPITATION_SLOT_COUNT,
  ec,
} from "./column.js";
import { LANDSCAPE_AREA_SCALE } from "../core/weather-extent.js";
const PRECIPITATION_VERTEX_SHADER = `
attribute vec4 aSeed;
attribute float aRank;
uniform vec4 uSrc;    // x, z, radius, slot seed
uniform vec4 uCol;    // yTop, y1, y2, yBot
uniform vec4 uProf;   // vs, vr, tA, tB
uniform vec4 uClimate; // local altitude scale/bias; does not affect terrain climate
uniform vec4 uRun;    // phase, column time, band lo, band hi
uniform vec4 uMisc;   // visible rank, intensity, source vel x, vel z
uniform float uPixel; // world size of one pixel at unit distance
varying vec2 vUv;
varying float vSnow;
varying float vAlpha;
varying vec3 vCol;
varying float vFloor;
varying float vY;
varying float vGlint;
varying float vSeed;

${PRECIPITATION_FALL_GLSL}

void cull() { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); vAlpha = 0.0; }

void main() {
  float rankFade = 1.0 - smoothstep(uMisc.x * 0.88, uMisc.x, aRank);
  if (rankFade <= 0.0) { cull(); return; }
  vec4 sd = fract(aSeed + uSrc.w * vec4(1.0, 0.7548, 0.5698, 0.3141));
  // speed factor quantised to k/64 so the slot phase can wrap at 64 without a jump
  float spd = (54.0 + floor(sd.w * 21.0)) / 64.0;
  float s = fract(uRun.x * spd + sd.z);
  float tau = s * uRun.y;
  float tPhys = tau / spd;
  if (tPhys < uRun.z || tPhys > uRun.w) { cull(); return; }

  float v;
  float d = precipFallDist(tau, uCol, uProf, v);
  v *= spd;
  float y = uCol.x - d;
  float snow = precipAirSnowAt(y, uClimate.xy) * precipSnowVis(uCol, uClimate.xy);

  // horizontal: disk offset + wind drift (sampled near where the particle is now)
  // − the lag of a moving cloud (drops falling now were released where the cloud was)
  vec2 xz = uSrc.xy + precipDisk(sd.xy, uSrc.z);
  float drift = precipDrift(tPhys);
  vec2 w = windAt(xz + windAt(xz) * drift);
  xz += w * drift - uMisc.zw * min(tPhys, 1.2);
  // flakes flutter on little sinusoidal paths
  float fl = snow * (0.045 + 0.075 * sd.x);
  float f1 = 1.1 + 0.9 * sd.z, f2 = 0.9 + 1.1 * sd.w, ph = sd.y * 40.0;
  xz += fl * vec2(sin(tPhys * f1 + ph), cos(tPhys * f2 + ph * 1.3));
  vec3 vel = vec3(w.x, 0.0, w.y) * exp(-tPhys / ${ec.toFixed(1)});
  vel.y = -v;
  vel.xz += fl * vec2(f1 * cos(tPhys * f1 + ph), -f2 * sin(tPhys * f2 + ph * 1.3));

  // Stop at the ground / lake surface and fade only at the landscape edge.
  float floorY = precipFloorAt(xz);
  float along = mix(0.4, 0.06, snow);
  if (y < floorY - along) { cull(); return; }
  vec2 edgeFade = smoothstep(vec2(0.04), vec2(0.2), precipEdgeDistance(xz));
  float boxFade = edgeFade.x * edgeFade.y;
  float topFade = smoothstep(0.0, 0.5, d);

  vec3 head = vec3(xz.x, y, xz.y);
  vec3 toCam = cameraPosition - head;
  float dist = length(toCam);
  toCam /= dist;
  float px = dist * uPixel;

  // rain: thin streak stretched along the velocity (motion blur), head at the drop
  float speed = length(vel);
  vec3 axis = vel / max(speed, 1e-3);
  float len = clamp(speed * 0.034, 0.05, 0.42) * (0.8 + 0.4 * sd.x);
  float wid = mix(0.004, 0.0075, sd.y);
  float widPx = max(wid, px * 0.85);
  vec3 side = normalize(cross(axis, toCam) + 1e-5);
  vec3 rainOff = side * widPx * position.x - axis * len * (position.y * 0.5 + 0.5);
  float rainA = 0.62 * sqrt(wid / widPx);

  // snow: camera-facing soft flake that tumbles (rotates and foreshortens)
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), toCam) + vec3(1e-5, 0.0, 0.0));
  vec3 up = cross(toCam, right);
  float size = mix(0.02, 0.05, sd.w * sd.w) * (0.85 + 0.3 * sd.x);
  float sizePx = max(size, px * 0.9);
  float ang = tPhys * (0.6 + 1.8 * sd.x) + sd.y * 6.2831;
  float squash = 0.55 + 0.45 * abs(cos(tPhys * (1.2 + 1.6 * sd.z) + sd.w * 9.0));
  vec2 c = vec2(position.x, position.y * squash);
  c = mat2(cos(ang), sin(ang), -sin(ang), cos(ang)) * c;
  vec3 snowOff = (right * c.x + up * c.y) * sizePx;
  float snowA = 0.95 * min(1.0, size / sizePx * 1.3);

  vec3 wp = head + mix(rainOff, snowOff, snow);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);

  // lighting: drops are clear – they catch light mostly when backlit (forward scattering),
  // flakes are diffuse white; both strobe with lightning
  vec3 viewDir = -toCam;
  float sunUp = smoothstep(-0.04, 0.12, uSunDir.y);
  float fwd = max(dot(viewDir, uSunDir), 0.0);
  float back = (pow(fwd, 5.0) * 1.6 + pow(fwd, 40.0) * 3.0) * sunUp;
  vec3 amb = (uSkyColor * 0.55 + uGroundColor * 0.25) * min(uAmbientIntensity, 1.2);
  vec3 flash = vec3(0.8, 0.86, 1.0) * uFlash * 1.2;
  vec3 rainC = (amb * 0.75 + uLightColor * (0.2 + back)) * (0.7 + 0.6 * sd.x) + flash;
  vec3 snowC = amb * 0.62 + uLightColor * (0.2 + pow(fwd, 4.0) * 0.1 * sunUp) + flash * 0.7;
  vCol = applyHaze(mix(rainC, snowC, snow), dist, y);
  float tw = sin(tPhys * (4.0 + 6.0 * sd.z) + sd.x * 60.0);
  vGlint = pow(max(tw, 0.0), 40.0) * sunUp * snow;

  vUv = position.xy;
  vSeed = sd.y;
  vSnow = snow;
  vAlpha = mix(rainA, snowA, snow) * rankFade * boxFade * topFade * uMisc.y;
  vFloor = floorY;
  vY = wp.y;
}
`;
const PRECIPITATION_FRAGMENT_SHADER = `
varying vec2 vUv;
varying float vSnow;
varying float vAlpha;
varying vec3 vCol;
varying float vFloor;
varying float vY;
varying float vGlint;
varying float vSeed;

void main() {
  if (vAlpha <= 0.002 || vY < vFloor) discard;
  // rain: gaussian across, soft rounded head, tail fading out
  float along = vUv.y * 0.5 + 0.5; // 0 head … 1 tail
  float rain = exp(-vUv.x * vUv.x * 2.6) * smoothstep(0.0, 0.14, along) * (1.0 - along) * 1.35;
  // snow: soft fluffy disc (a hint of six-fold structure) with a brighter core
  float r = length(vUv);
  float ang = atan(vUv.y, vUv.x + 1e-5);
  float fluff = 1.0 + 0.1 * sin(ang * 6.0 + vSeed * 6.28) + 0.07 * sin(ang * 3.0 + vSeed * 17.0);
  float disc = 1.0 - smoothstep(0.3, 1.0, r * fluff);
  float core = exp(-r * r * 6.0);
  float a = mix(rain, disc, vSnow) * vAlpha;
  if (a < 0.003) discard;
  vec3 col = vCol * (1.0 + mix(0.35 * rain, 0.25 * core, vSnow)) + uLightColor * (vGlint * core * 1.2);
  gl_FragColor = vec4(col, a);
}
`;
class FallingPrecipitation {
  constructor(t, e) {
    const { quality: i, scene: s } = t;
    ((this.ctx = t),
      (this.slots = e),
      (this.budget = i.pick(2500, 6e3, 12e3) * LANDSCAPE_AREA_SCALE),
      (this.maxPerSlot = i.pick(1200, 2600, 4200)),
      (this.density = i.pick(150, 260, 340)),
      (this.alphaScale = Math.min(1.2, Math.sqrt(260 / this.density))));
    const n = new ThreeBufferAttribute(
        new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]),
        3,
      ),
      o = new ThreeBufferAttribute(new Uint16Array([0, 1, 2, 0, 2, 3]), 1),
      a = this.maxPerSlot,
      l = new Float32Array(a * 4),
      c = new Float32Array(a);
    for (let u = 0; u < a; u++)
      ((l[u * 4] = Math.random()),
        (l[u * 4 + 1] = Math.random()),
        (l[u * 4 + 2] = Math.random()),
        (l[u * 4 + 3] = Math.random()),
        (c[u] = (u + 0.5) / a));
    const h = new ThreeInstancedBufferAttribute(l, 4),
      f = new ThreeInstancedBufferAttribute(c, 1);
    this.meshes = [];
    for (let u = 0; u < PRECIPITATION_SLOT_COUNT; u++) {
      const d = new ThreeInstancedBufferGeometry();
      (d.setIndex(o),
        d.setAttribute("position", n),
        d.setAttribute("aSeed", h),
        d.setAttribute("aRank", f),
        (d.instanceCount = 0));
      const p = new ThreeShaderMaterial({
          uniforms: {
            ...t.uniforms,
            uSrc: {
              value: new ThreeVector4(),
            },
            uCol: {
              value: new ThreeVector4(),
            },
            uProf: {
              value: new ThreeVector4(),
            },
            uClimate: {
              value: new ThreeVector4(1, 0, 0, 0),
            },
            uRun: {
              value: new ThreeVector4(),
            },
            uMisc: {
              value: new ThreeVector4(),
            },
            uPixel: {
              value: 0.001,
            },
          },
          vertexShader: t.GLSL_COMMON + PRECIPITATION_VERTEX_SHADER,
          fragmentShader: t.GLSL_COMMON + PRECIPITATION_FRAGMENT_SHADER,
          transparent: !0,
          depthWrite: !1,
          side: ThreeDoubleSide,
        }),
        v = new ThreeMesh(d, p);
      ((v.name = `precip-fall-${u}`),
        (v.frustumCulled = !1),
        (v.renderOrder = 8),
        (v.visible = !1),
        s.add(v),
        this.meshes.push(v));
    }
    this.targets = new Float32Array(PRECIPITATION_SLOT_COUNT);
  }
  update(t, e) {
    const { slots: i, meshes: s, targets: n } = this;
    let o = 0;
    for (let l = 0; l < PRECIPITATION_SLOT_COUNT; l++) {
      const c = i[l];
      let h = 0;
      if (c.visible) {
        const f = Math.max(0.3, c.radius);
        ((h = Math.min(
          this.maxPerSlot,
          this.density * Math.pow(Math.max(0, c.rate), 0.8) * Math.PI * f * f,
        )),
          (h *= 1 + 0.5 * c.snowTop));
      }
      ((n[l] = h), (o += h));
    }
    const a = o > this.budget ? this.budget / o : 1;
    for (let l = 0; l < PRECIPITATION_SLOT_COUNT; l++) {
      const c = i[l],
        h = s[l];
      if (!c.visible) {
        h.visible = !1;
        continue;
      }
      const f = n[l] * a;
      c.count < 0
        ? (c.count = f)
        : (c.live || f > c.count) &&
          (c.count += (f - c.count) * (1 - Math.exp(-t * 3)));
      const u = c.count;
      if (u < 1) {
        h.visible = !1;
        continue;
      }
      ((h.visible = !0),
        (h.geometry.instanceCount = Math.min(
          this.maxPerSlot,
          Math.ceil(u * 1.06) + 1,
        )));
      const d = h.material.uniforms;
      (d.uSrc.value.set(c.x, c.z, c.radius, c.seed),
        c.writeCol(d.uCol.value),
        c.writeProf(d.uProf.value),
        c.writeClimate(d.uClimate.value),
        d.uRun.value.set(c.phase, c.total, c.lo, c.hi),
        d.uMisc.value.set(
          u / this.maxPerSlot,
          (0.72 + 0.28 * Math.min(1, c.rate)) * this.alphaScale,
          c.vx,
          c.vz,
        ),
        (d.uPixel.value = e));
    }
  }
}
export { FallingPrecipitation };
