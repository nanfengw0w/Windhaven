// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAddEquation,
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeCustomBlending,
  ThreeDoubleSide,
  ThreeMathUtils,
  ThreeMesh,
  ThreeOneFactor,
  ThreeOneMinusSrcAlphaFactor,
  ThreePoints,
  ThreeShaderMaterial,
  ThreeVector3,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
import { clamp, createSeededRandom, damp, smoothstep } from "../core/math.js";
const STARFIELD_HEIGHT_OFFSET = 0.6;
// Vertical gap between the world top and the top of the star band; stars and
// meteors share it so the whole starfield stays one coherent shell.
const STARFIELD_TOP_GAP = 1.7;
const STAR_VERTEX_GLSL = `
attribute vec3 aStar;      // seed, magnitude (0 faint … 1 bright), colour temperature
uniform float uTime;
uniform float uVis;
uniform float uScale;      // px per world unit at distance 1
varying vec3 vCol;
varying float vA;
varying float vSpike;
void main() {
  float seed = aStar.x, mag = aStar.y, temp = aStar.z;
  vec3 p = position;
  p.x += sin(uTime * 0.05 + seed * 40.0) * 0.05;
  p.y += sin(uTime * 0.07 + seed * 17.0) * 0.035;
  p.z += sin(uTime * 0.04 + seed * 29.0) * 0.05;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  // scintillation: two beating sines, faint stars twinkle harder
  float tw = sin(uTime * (1.6 + seed * 4.1) + seed * 61.0) * sin(uTime * (0.85 + seed * 2.3) + seed * 13.0);
  tw = 1.0 + tw * mix(0.55, 0.22, mag);
  float px = mix(0.016, 0.045, mag) * uScale / max(-mv.z, 0.1);
  gl_PointSize = clamp(px * 3.2, 2.0, 11.0);
  vA = uVis * mix(0.12, 1.0, mag * mag) * tw;
  vCol = mix(vec3(0.66, 0.78, 1.0), vec3(1.0, 0.84, 0.66), temp);
  vSpike = smoothstep(0.7, 1.0, mag);
  gl_Position = projectionMatrix * mv;
}
`;
const STAR_FRAGMENT_GLSL = `
uniform float uBright;
varying vec3 vCol;
varying float vA;
varying float vSpike;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(c, c);
  if (r2 > 1.0) discard;
  float core = exp(-r2 * 30.0);
  float glow = exp(-r2 * 7.0) * 0.12;
  float spike = (exp(-abs(c.x) * 30.0) + exp(-abs(c.y) * 30.0)) * (1.0 - r2) * vSpike * 0.4;
  float I = (core + glow + spike) * vA;
  gl_FragColor = vec4(vCol * I * uBright, clamp(I, 0.0, 1.0) * 0.6);
}
`;
const METEOR_VERTEX_GLSL = `
attribute float aT;       // 0 tail … 1 head
attribute float aSide;    // −1 / +1 across the streak
uniform vec3 uHead;
uniform vec3 uTail;
uniform float uWidth;
varying float vT;
varying float vSide;
void main() {
  vec3 p = mix(uTail, uHead, aT);
  vec3 dir = normalize(uHead - uTail);
  vec3 toCam = normalize(cameraPosition - p);
  vec3 side = normalize(cross(dir, toCam));
  p += side * aSide * uWidth * (0.3 + 0.7 * aT);
  vT = aT;
  vSide = aSide;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`;
const METEOR_FRAGMENT_GLSL = `
uniform float uAlpha;
varying float vT;
varying float vSide;
void main() {
  float a = pow(vT, 2.2) * exp(-vSide * vSide * 3.0) * uAlpha;
  vec3 c = mix(vec3(0.6, 0.75, 1.0), vec3(1.0, 0.97, 0.9), vT);
  gl_FragColor = vec4(c * a * 5.0, 0.0);
}
`;
function configureStarAdditiveBlending(r, t) {
  return (
    (r.transparent = !0),
    (r.depthWrite = !1),
    (r.blending = ThreeCustomBlending),
    (r.blendEquation = ThreeAddEquation),
    (r.blendSrc = ThreeOneFactor),
    (r.blendDst = ThreeOneFactor),
    (r.blendSrcAlpha = t ? ThreeOneFactor : ThreeZeroFactor),
    (r.blendDstAlpha = t ? ThreeOneMinusSrcAlphaFactor : ThreeOneFactor),
    r
  );
}
class StarsAndMeteors {
  constructor(t, e) {
    this.ctx = t;
    const coreCount = t.quality.pick(300, 450, 600),
      a = 0.2,
      areaRatio =
        ((LANDSCAPE_BOUNDS.halfW - a) * (LANDSCAPE_BOUNDS.halfD - a)) /
        ((TERRARIUM_BOUNDS.halfW - a) * (TERRARIUM_BOUNDS.halfD - a)),
      i = Math.round(coreCount * areaRatio),
      s = createSeededRandom(358949),
      n = new Float32Array(i * 3),
      o = new Float32Array(i * 3);
    for (let p = 0; p < coreCount; p++)
      ((n[p * 3] = (s() * 2 - 1) * (TERRARIUM_BOUNDS.halfW - a)),
        // Same height span as the outer ring so the starfield reads as one sky.
        (n[p * 3 + 1] =
          5 + (LANDSCAPE_BOUNDS.topY - STARFIELD_TOP_GAP - 5) * Math.sqrt(s())),
        (n[p * 3 + 2] = (s() * 2 - 1) * (TERRARIUM_BOUNDS.halfD - a)),
        (o[p * 3] = s()),
        (o[p * 3 + 1] = Math.pow(s(), 3.2)),
        (o[p * 3 + 2] = Math.pow(s(), 1.6)));
    // Keep every original star and fill only the added sky at the same density.
    const outerRandom = createSeededRandom(358950);
    for (let p = coreCount; p < i; p++) {
      let x, z;
      do {
        x = (outerRandom() * 2 - 1) * (LANDSCAPE_BOUNDS.halfW - a);
        z = (outerRandom() * 2 - 1) * (LANDSCAPE_BOUNDS.halfD - a);
      } while (
        Math.abs(x) < TERRARIUM_BOUNDS.halfW - a &&
        Math.abs(z) < TERRARIUM_BOUNDS.halfD - a
      );
      n[p * 3] = x;
      n[p * 3 + 1] =
        5 +
        (LANDSCAPE_BOUNDS.topY - STARFIELD_TOP_GAP - 5) *
          Math.sqrt(outerRandom());
      n[p * 3 + 2] = z;
      o[p * 3] = outerRandom();
      o[p * 3 + 1] = Math.pow(outerRandom(), 3.2);
      o[p * 3 + 2] = Math.pow(outerRandom(), 1.6);
    }
    const l = new ThreeBufferGeometry();
    (l.setAttribute("position", new ThreeBufferAttribute(n, 3)),
      l.setAttribute("aStar", new ThreeBufferAttribute(o, 3)),
      (this.material = configureStarAdditiveBlending(
        new ThreeShaderMaterial({
          name: "sky-stars",
          uniforms: {
            uTime: t.uniforms.uTime,
            uVis: {
              value: 0,
            },
            uScale: {
              value: 400,
            },
            uBright: {
              value: 2.4,
            },
          },
          vertexShader: STAR_VERTEX_GLSL,
          fragmentShader: STAR_FRAGMENT_GLSL,
        }),
        !0,
      )),
      (this.points = new ThreePoints(l, this.material)),
      (this.points.position.y = STARFIELD_HEIGHT_OFFSET),
      (this.points.name = "sky-stars"),
      (this.points.renderOrder = 2.2),
      (this.points.frustumCulled = !1),
      e.add(this.points));
    const c = 12,
      h = new ThreeBufferGeometry(),
      f = new Float32Array((c + 1) * 2),
      u = new Float32Array((c + 1) * 2),
      d = [];
    for (let p = 0; p <= c; p++)
      if (
        ((f[p * 2] = f[p * 2 + 1] = p / c),
        (u[p * 2] = -1),
        (u[p * 2 + 1] = 1),
        p < c)
      ) {
        const v = p * 2;
        d.push(v, v + 1, v + 2, v + 1, v + 3, v + 2);
      }
    (h.setAttribute(
      "position",
      new ThreeBufferAttribute(new Float32Array((c + 1) * 2 * 3), 3),
    ),
      h.setAttribute("aT", new ThreeBufferAttribute(f, 1)),
      h.setAttribute("aSide", new ThreeBufferAttribute(u, 1)),
      h.setIndex(d),
      (this.meteorMat = configureStarAdditiveBlending(
        new ThreeShaderMaterial({
          name: "sky-meteor",
          uniforms: {
            uHead: {
              value: new ThreeVector3(),
            },
            uTail: {
              value: new ThreeVector3(),
            },
            uWidth: {
              value: 0.012,
            },
            uAlpha: {
              value: 0,
            },
          },
          vertexShader: METEOR_VERTEX_GLSL,
          fragmentShader: METEOR_FRAGMENT_GLSL,
          side: ThreeDoubleSide,
        }),
        !1,
      )),
      (this.meteor = new ThreeMesh(h, this.meteorMat)),
      (this.meteor.name = "sky-meteor"),
      (this.meteor.renderOrder = 2.25),
      (this.meteor.frustumCulled = !1),
      (this.meteor.visible = !1),
      (this.meteor.userData.noReflect = !0),
      e.add(this.meteor),
      (this._m = {
        t: -1,
        dur: 0.8,
        from: new ThreeVector3(),
        to: new ThreeVector3(),
        next: 9 + s() * 12,
      }),
      (this._rand = s),
      (this.visibility = 0));
    // 特制流星雨独立取随机数，普通夜空仍沿用原来的偶发流星序列。
    this._showerRand = createSeededRandom(358951);
    this._showerNext = 0;
    this._showerWarmStart = false;
    this._showerMeteors = [];
    this.meteorShowerActive = false;
    this.meteorShowerCount = 0;
    this.meteorShowerLaunches = 0;
    const showerCount = t.quality.pick(5, 7, 9);
    for (let index = 0; index < showerCount; index++) {
      // 所有槽共享同一份几何；材质与向量只在初始化时创建。
      const material = this.meteorMat.clone();
      material.name = "sky-meteor-shower";
      const mesh = new ThreeMesh(h, material);
      mesh.name = `sky-meteor-shower-${index}`;
      mesh.renderOrder = 2.25;
      mesh.frustumCulled = false;
      mesh.visible = false;
      mesh.userData.noReflect = true;
      e.add(mesh);
      this._showerMeteors.push({
        mesh,
        uniforms: material.uniforms,
        from: new ThreeVector3(),
        to: new ThreeVector3(),
        t: -1,
        duration: 1,
        tail: 0.3,
        brightness: 1,
      });
    }
  }
  update(t) {
    const { world: e, camera: i, renderer: s } = this.ctx,
      n =
        (1 - smoothstep(0.1, 0.75, e.cloudCover)) *
        (1 - e.storminess) *
        (1 - e.fogAmount * 0.8),
      o = smoothstep(0.35, 0.95, e.night) * clamp(0.25 + 0.75 * n, 0, 1);
    this.visibility = damp(this.visibility, o, 1.5, t);
    const a = this.material.uniforms;
    a.uVis.value = this.visibility;
    const l = s.getContext().drawingBufferHeight;
    ((a.uScale.value =
      l / (2 * Math.tan(ThreeMathUtils.degToRad(i.fov) * 0.5))),
      (this.points.visible = this.visibility > 0.004));
    const showerEnabled = e.meteorShower === true;
    if (showerEnabled || this.meteorShowerActive) {
      this._updateShower(t, showerEnabled);
      // 退场光尾结束前暂停普通流星，避免两个发射节奏重叠。
      if (this.meteorShowerActive) return;
    }
    const c = this._m;
    if (c.t < 0)
      ((c.next -= t * (this.visibility > 0.5 ? 1 : 0)),
        c.next <= 0 && n > 0.6 && this._launch());
    else {
      c.t += t / c.dur;
      const h = c.t,
        f = Math.min(1, h * 1.15),
        u = Math.max(0, h * 1.15 - 0.45),
        d = this.meteorMat.uniforms;
      (d.uHead.value.lerpVectors(c.from, c.to, f),
        d.uTail.value.lerpVectors(c.from, c.to, u),
        (d.uAlpha.value = Math.sin(Math.min(1, h) * Math.PI) * this.visibility),
        h >= 1.35 &&
          ((c.t = -1),
          (this.meteor.visible = !1),
          (c.next = 14 + this._rand() * 26)));
    }
  }
  syncPhotoCamera() {
    const { camera, renderer } = this.ctx;
    this.material.uniforms.uScale.value =
      renderer.getContext().drawingBufferHeight /
      (2 * Math.tan(ThreeMathUtils.degToRad(camera.fov) * 0.5));
  }
  _launch() {
    const t = this._rand,
      e = this._m,
      i =
        LANDSCAPE_BOUNDS.topY -
        STARFIELD_TOP_GAP +
        STARFIELD_HEIGHT_OFFSET -
        0.4 -
        t() * 1,
      s = t() < 0.5 ? -1 : 1;
    (e.from.set(
      -s * (2 + t() * (LANDSCAPE_BOUNDS.halfW - 2.3)),
      i,
      -LANDSCAPE_BOUNDS.halfD + 0.3 + t() * (LANDSCAPE_BOUNDS.halfD * 2 - 0.6),
    ),
      e.to.set(
        e.from.x + s * (3 + t() * 3),
        i - 0.6 - t() * 0.8,
        e.from.z + (t() - 0.5) * 2.5,
      ),
      (e.to.x = clamp(
        e.to.x,
        -LANDSCAPE_BOUNDS.halfW + 0.3,
        LANDSCAPE_BOUNDS.halfW - 0.3,
      )),
      (e.to.z = clamp(
        e.to.z,
        -LANDSCAPE_BOUNDS.halfD + 0.3,
        LANDSCAPE_BOUNDS.halfD - 0.3,
      )),
      (e.dur = 0.55 + t() * 0.5),
      (e.t = 0),
      (this.meteor.visible = !0));
  }
  _updateShower(dt, enabled) {
    if (enabled && !this.meteorShowerActive) {
      this.meteorShowerActive = true;
      this._showerNext = 0;
      this._showerWarmStart = true;
      this.meteor.visible = false;
      this.meteorMat.uniforms.uAlpha.value = 0;
      this._m.t = -1;
      this._m.next = Math.max(9, this._m.next);
    }
    // 关闭只停发新流星；保留光尾和发射间隔，快速重开时自然接续。
    if (enabled && this.visibility > 0.05) {
      if (this._showerWarmStart) {
        // 错开两条首发光尾，让夜色淡入后很快就能看见流星雨。
        this._launchShower(this._showerMeteors[0], 0.16);
        this._launchShower(this._showerMeteors[1], 0.38);
        this._showerWarmStart = false;
        this._showerNext = 0.3;
      } else {
        this._showerNext -= dt;
        if (this._showerNext <= 0) {
          for (const meteor of this._showerMeteors) {
            if (meteor.t < 0) {
              this._launchShower(meteor, 0.01);
              break;
            }
          }
          // 有疏有密的节奏，避免整齐排列成持续的平行光束。
          this._showerNext = 0.32 + this._showerRand() * 0.42;
        }
      }
    }
    this.meteorShowerCount = 0;
    let hasLiveMeteor = false;
    for (const meteor of this._showerMeteors) {
      if (meteor.t < 0) continue;
      meteor.t += dt / meteor.duration;
      if (meteor.t >= 1) {
        meteor.t = -1;
        meteor.mesh.visible = false;
        meteor.uniforms.uAlpha.value = 0;
        continue;
      }
      hasLiveMeteor = true;
      const progress = meteor.t,
        distance = progress * (1 + meteor.tail),
        uniforms = meteor.uniforms;
      uniforms.uHead.value.lerpVectors(
        meteor.from,
        meteor.to,
        Math.min(1, distance),
      );
      uniforms.uTail.value.lerpVectors(
        meteor.from,
        meteor.to,
        Math.max(0, distance - meteor.tail),
      );
      uniforms.uAlpha.value =
        smoothstep(0, 0.14, progress) *
        (1 - smoothstep(0.62, 1, progress)) *
        this.visibility *
        meteor.brightness;
      meteor.mesh.visible = uniforms.uAlpha.value > 0.004;
      if (meteor.mesh.visible) this.meteorShowerCount++;
    }
    this.meteorShowerActive = enabled || hasLiveMeteor;
  }
  _launchShower(meteor, phase) {
    const random = this._showerRand,
      skyTop =
        LANDSCAPE_BOUNDS.topY - STARFIELD_TOP_GAP + STARFIELD_HEIGHT_OFFSET;
    meteor.from.set(
      -LANDSCAPE_BOUNDS.halfW + 1.5 + random() * 15,
      skyTop - 0.2 - random() * 1.8,
      -LANDSCAPE_BOUNDS.halfD + 1.5 + random() * 10,
    );
    // 共享左上方辐射点，但保留深度、长度和少量方向差异。
    const travel = 4.2 + random() * 2.2,
      radiantScale = travel / (meteor.from.x + 20);
    meteor.to.set(
      meteor.from.x + travel,
      Math.max(
        6.5,
        meteor.from.y + (skyTop + 3.1 - meteor.from.y) * -radiantScale,
      ),
      clamp(
        meteor.from.z +
          (meteor.from.z + 4.5) * radiantScale +
          (random() - 0.5) * 0.4,
        -LANDSCAPE_BOUNDS.halfD + 0.5,
        LANDSCAPE_BOUNDS.halfD - 0.5,
      ),
    );
    meteor.duration = 1.15 + random() * 0.8;
    meteor.tail = 0.23 + random() * 0.16;
    meteor.brightness = 0.8 + random() * 0.5;
    meteor.uniforms.uWidth.value = 0.012 + random() * 0.012;
    meteor.t = phase;
    this.meteorShowerLaunches++;
  }
}
export { STARFIELD_HEIGHT_OFFSET, StarsAndMeteors };
