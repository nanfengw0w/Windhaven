// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferGeometry,
  ThreeDoubleSide,
  ThreeFloat32BufferAttribute,
  ThreeMesh,
  ThreeShaderMaterial,
  ThreeVector4,
} from "../vendor/three-runtime.js";
import { PRECIPITATION_FALL_GLSL, PRECIPITATION_SLOT_COUNT } from "./column.js";
const RAIN_CURTAIN_SEGMENTS = 14;
const RAIN_CURTAIN_VERTEX_SHADER = `
attribute vec4 aSheet;       // slot, lateral, depth, width randoms
uniform vec4 uCuSrc[${PRECIPITATION_SLOT_COUNT}];   // x, z, radius, amount
uniform vec4 uCuCol[${PRECIPITATION_SLOT_COUNT}];   // yTop, y1, y2, yBot
uniform vec4 uCuProf[${PRECIPITATION_SLOT_COUNT}];  // vs, vr, tA, tB
uniform vec4 uCuClimate[${PRECIPITATION_SLOT_COUNT}]; // altitude scale/bias
uniform vec4 uCuRun[${PRECIPITATION_SLOT_COUNT}];   // vel x, vel z, visible distance top, bottom
varying vec3 vWorld;
varying vec2 vLocal;        // across (-1..1), distance below the cloud base
varying float vAmt;
varying vec2 vBand;
varying float vSeed;
varying float vHalfW;
varying float vSnowVis;
varying vec2 vClimate;

${PRECIPITATION_FALL_GLSL}

void main() {
  int si = int(aSheet.x + 0.5);
  vec4 src = uCuSrc[si];
  if (src.w < 0.004) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); vAmt = 0.0; return; }
  vec4 col = uCuCol[si];
  vec4 prof = uCuProf[si];
  vec4 run = uCuRun[si];
  vec3 fwd = vec3(cameraPosition.x - src.x, 0.0, cameraPosition.z - src.y);
  fwd = normalize(fwd + vec3(1e-4, 0.0, 0.0));
  vec3 right = vec3(fwd.z, 0.0, -fwd.x);
  float halfW = src.z * (0.5 + 0.3 * aSheet.w);
  vec2 base = src.xy + right.xz * (aSheet.y - 0.5) * 0.9 * src.z - fwd.xz * (aSheet.z - 0.5) * 1.1 * src.z;
  float y = mix(col.x, col.w, position.y);
  float d = col.x - y;
  float tf = precipFallTime(d, col, prof);
  vec2 xz = base + right.xz * position.x * halfW;
  xz += windAt(base) * precipDrift(tf) - run.xy * min(tf, 1.2);
  vWorld = vec3(xz.x, y, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  vLocal = vec2(position.x, d);
  vAmt = src.w;
  vBand = run.zw;
  vSeed = aSheet.y * 17.0 + aSheet.z * 5.0 + float(si) * 3.1;
  vHalfW = halfW;
  vClimate = uCuClimate[si].xy;
  vSnowVis = precipSnowVis(col, vClimate);
}
`;
const RAIN_CURTAIN_FRAGMENT_SHADER = `
varying vec3 vWorld;
varying vec2 vLocal;
varying float vAmt;
varying vec2 vBand;
varying float vSeed;
varying float vHalfW;
varying float vSnowVis;
varying vec2 vClimate;

${PRECIPITATION_FALL_GLSL}

void main() {
  if (vAmt <= 0.0) discard;
  float ground = precipFloorAt(vWorld.xz);
  float above = vWorld.y - ground;
  if (above < 0.0) discard;
  vec2 edgeFade = smoothstep(vec2(0.05), vec2(0.4), precipEdgeDistance(vWorld.xz));
  float box = edgeFade.x * edgeFade.y;
  float d = vLocal.y;
  float band = smoothstep(vBand.x - 0.2, vBand.x + 0.4, d) * (1.0 - smoothstep(vBand.y - 0.5, vBand.y, d));
  float u = vLocal.x;
  float across = exp(-u * u * 2.8);
  float fades = smoothstep(0.0, 0.55, above) * smoothstep(0.1, 0.9, d) * across * band * box;
  if (fades < 0.003) discard;

  float snow = precipAirSnowAt(vWorld.y, vClimate) * vSnowVis;
  float x = u * vHalfW;
  // rain: fine vertical streaks racing down; snow: soft slow blotches
  float r1 = wgNoise(vec2(x * 13.0 + vSeed, (vWorld.y + uTime * 3.4) * 0.8));
  float r2 = wgNoise(vec2(x * 29.0 - vSeed, (vWorld.y + uTime * 4.6) * 1.6));
  float s1 = wgNoise(vec2(x * 4.0 + vSeed, (vWorld.y + uTime * 0.55) * 3.0));
  float s2 = wgNoise(vec2(x * 9.0 - vSeed, (vWorld.y + uTime * 0.8) * 6.0));
  float n = mix(r1 * 0.6 + r2 * 0.4, s1 * 0.65 + s2 * 0.35, snow);
  float streak = smoothstep(0.32, 0.85, n);
  // big gusty clumps drifting through the shaft
  float clump = wgNoise(vec2(x * 1.3 + vSeed * 0.3 + uTime * 0.25, vWorld.y * 0.4 + uTime * 0.7));
  float a = vAmt * fades * (0.3 + 0.7 * streak) * (0.55 + 0.9 * clump) * mix(0.17, 0.06, snow);

  vec3 viewDir = normalize(vWorld - cameraPosition);
  float sunUp = smoothstep(-0.04, 0.12, uSunDir.y);
  float back = pow(max(dot(viewDir, uSunDir), 0.0), 4.0) * sunUp;
  vec3 amb = uSkyColor * 0.45 + uGroundColor * 0.15 + uHazeColor * 0.4;
  vec3 flash = vec3(0.8, 0.86, 1.0) * uFlash * 0.7;
  vec3 rainC = amb * 0.8 + uLightColor * (0.1 + back * 0.55) + flash;
  vec3 snowC = amb * 0.85 + uLightColor * (0.16 + back * 0.08) + flash;
  vec3 col = applyHaze(mix(rainC, snowC, snow), length(vWorld - cameraPosition), vWorld.y);
  gl_FragColor = vec4(col, a);
}
`;
class RainCurtains {
  constructor(t, e) {
    ((this.ctx = t), (this.slots = e));
    const i = t.quality.pick(2, 3, 4);
    this.sheets = i;
    const s = [],
      n = [],
      o = [];
    let a = 0;
    for (let f = 0; f < PRECIPITATION_SLOT_COUNT; f++)
      for (let u = 0; u < i; u++) {
        const d =
            i > 1
              ? ((u + 0.5) / i) * 0.8 + 0.1 + (Math.random() - 0.5) * 0.15
              : 0.5,
          p = Math.random(),
          v = Math.random();
        for (let g = 0; g <= RAIN_CURTAIN_SEGMENTS; g++) {
          const x = g / RAIN_CURTAIN_SEGMENTS;
          if (
            (s.push(-1, x, 0, 1, x, 0),
            n.push(f, d, p, v, f, d, p, v),
            g < RAIN_CURTAIN_SEGMENTS)
          ) {
            const m = a + g * 2;
            o.push(m, m + 1, m + 2, m + 1, m + 3, m + 2);
          }
        }
        a += (RAIN_CURTAIN_SEGMENTS + 1) * 2;
      }
    const l = new ThreeBufferGeometry();
    (l.setAttribute("position", new ThreeFloat32BufferAttribute(s, 3)),
      l.setAttribute("aSheet", new ThreeFloat32BufferAttribute(n, 4)),
      l.setIndex(o));
    const c = () =>
      Array.from(
        {
          length: PRECIPITATION_SLOT_COUNT,
        },
        () => new ThreeVector4(),
      );
    this.uniforms = {
      uCuSrc: {
        value: c(),
      },
      uCuCol: {
        value: c(),
      },
      uCuProf: {
        value: c(),
      },
      uCuClimate: {
        value: c(),
      },
      uCuRun: {
        value: c(),
      },
    };
    const h = new ThreeShaderMaterial({
      uniforms: {
        ...t.uniforms,
        ...this.uniforms,
      },
      vertexShader: t.GLSL_COMMON + RAIN_CURTAIN_VERTEX_SHADER,
      fragmentShader: t.GLSL_COMMON + RAIN_CURTAIN_FRAGMENT_SHADER,
      transparent: !0,
      depthWrite: !1,
      side: ThreeDoubleSide,
    });
    ((this.mesh = new ThreeMesh(l, h)),
      (this.mesh.name = "precip-curtains"),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 7.9),
      (this.mesh.visible = !1),
      t.scene.add(this.mesh));
  }
  update(t, e, i) {
    const { slots: s, uniforms: n } = this;
    let o = !1;
    for (let a = 0; a < PRECIPITATION_SLOT_COUNT; a++) {
      const l = s[a];
      let c = 0;
      if (l.visible) {
        const h = (l.rate - 0.45) / 0.9;
        ((c = h <= 0 ? 0 : h >= 1 ? 1 : h * h * (3 - 2 * h)),
          (c *= Math.min(1, l.radius / 0.7)));
      }
      (n.uCuSrc.value[a].set(l.x, l.z, l.radius, c),
        c > 0.004 &&
          ((o = !0),
          l.writeCol(n.uCuCol.value[a]),
          l.writeProf(n.uCuProf.value[a]),
          l.writeClimate(n.uCuClimate.value[a]),
          n.uCuRun.value[a].set(
            l.vx,
            l.vz,
            l.fallDist(l.lo),
            l.fallDist(Math.min(l.hi, 60)),
          )));
    }
    this.mesh.visible = o;
  }
}
export { RainCurtains };
