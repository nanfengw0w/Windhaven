// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  Ry,
  ThreeBox3,
  ThreeColor,
  ThreeMathUtils,
  ThreeRay,
  ThreeVector2,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { clamp, damp, lerp, smoothstep } from "../core/math.js";
import { sceneDepthUniforms } from "../render/scene-depth.js";
import {
  CELESTIAL_BILLBOARD_VERTEX_GLSL,
  MOON_DISC_FRAGMENT_GLSL,
  MOON_DISC_RADIUS,
  SUN_DISC_FRAGMENT_GLSL,
  SUN_DISC_RADIUS,
  SUN_GLARE_FRAGMENT_GLSL,
  SUN_GLARE_VERTEX_GLSL,
  configureCelestialAdditiveBlending,
} from "./celestial-shaders.js";
const Ss = new ThreeVector3();
const g4 = new ThreeVector3();
const Lv = new ThreeVector3();
const Yf = new ThreeVector3();
const Js = new ThreeRay();
const Iv = new ThreeVector3();
const skyOcclusionBoxMin = new ThreeVector3(
  -LANDSCAPE_BOUNDS.halfW,
  LANDSCAPE_BOUNDS.bottomY,
  -LANDSCAPE_BOUNDS.halfD,
);
const skyOcclusionBoxMax = new ThreeVector3(
  LANDSCAPE_BOUNDS.halfW,
  LANDSCAPE_BOUNDS.topY,
  LANDSCAPE_BOUNDS.halfD,
);
const skyOcclusionBox = new ThreeBox3(skyOcclusionBoxMin, skyOcclusionBoxMax);
class CelestialBodyState {
  constructor(t, e) {
    ((this.name = t),
      (this.radius = e),
      (this.position = new ThreeVector3()),
      (this.fade = 0),
      (this.visibility = 1),
      (this.hover = 0),
      (this.hovered = !1),
      (this.grabbed = !1),
      (this.pulse = 0),
      (this.screen = new ThreeVector2()),
      (this.screenR = 0),
      (this.onScreen = !1),
      (this._occ = [1, 1, 1]),
      (this._cloudOcc = 0));
  }
}
class SunAndMoon {
  constructor(t, e) {
    this.ctx = t;
    const i = Ry;
    ((this.sun = new CelestialBodyState("sun", SUN_DISC_RADIUS)),
      (this.moon = new CelestialBodyState("moon", MOON_DISC_RADIUS)),
      (this._frame = 0));
    const s = new i.PlaneGeometry(1, 1),
      n = () => ({
        ...t.uniforms,
        uHalf: {
          value: new i.Vector2(1, 1),
        },
        uFade: {
          value: 0,
        },
        uPulse: {
          value: 0,
        },
      });
    ((this.sunMat = configureCelestialAdditiveBlending(
      new i.ShaderMaterial({
        name: "sky-sun",
        uniforms: {
          ...n(),
          uCore: {
            value: new i.Color(),
          },
          uLimb: {
            value: new i.Color(0.62, 0.34, 0.16),
          },
          uGlow: {
            value: new i.Color(),
          },
          uDiscR: {
            value: 0.1,
          },
          uCorona: {
            value: 1,
          },
          uSquash: {
            value: 1,
          },
        },
        vertexShader: CELESTIAL_BILLBOARD_VERTEX_GLSL,
        fragmentShader: t.GLSL_COMMON + SUN_DISC_FRAGMENT_GLSL,
      }),
    )),
      (this.sunMesh = new i.Mesh(s, this.sunMat)),
      (this.sunMesh.name = "sky-sun"),
      (this.glareMat = configureCelestialAdditiveBlending(
        new i.ShaderMaterial({
          name: "sky-sun-glare",
          uniforms: {
            ...sceneDepthUniforms,
            uHalf: {
              value: new i.Vector2(1, 1),
            },
            uSourceRadius: {
              value: new i.Vector2(SUN_DISC_RADIUS, SUN_DISC_RADIUS),
            },
            uColor: {
              value: new i.Color(),
            },
            uIntensity: {
              value: 0,
            },
            uRot: {
              value: 0,
            },
            uAspect: {
              value: 2.2,
            },
          },
          vertexShader: SUN_GLARE_VERTEX_GLSL,
          fragmentShader: SUN_GLARE_FRAGMENT_GLSL,
        }),
      )),
      (this.glareMat.depthTest = !0),
      (this.glareMesh = new i.Mesh(s, this.glareMat)),
      (this.glareMesh.name = "sky-sun-glare"),
      (this.glareMesh.renderOrder = 30),
      (this.moonMat = configureCelestialAdditiveBlending(
        new i.ShaderMaterial({
          name: "sky-moon",
          uniforms: {
            ...n(),
            uSunV: {
              value: new i.Vector3(0, 0, 1),
            },
            uTint: {
              value: new i.Color(),
            },
            uHaloCol: {
              value: new i.Color(),
            },
            uDiscR: {
              value: 0.2,
            },
            uHalo: {
              value: 1,
            },
            uCoronaRing: {
              value: 0,
            },
          },
          vertexShader: CELESTIAL_BILLBOARD_VERTEX_GLSL,
          fragmentShader: t.GLSL_COMMON + MOON_DISC_FRAGMENT_GLSL,
        }),
      )),
      (this.moonMesh = new i.Mesh(s, this.moonMat)),
      (this.moonMesh.name = "sky-moon"));
    for (const o of [this.sunMesh, this.glareMesh, this.moonMesh])
      ((o.frustumCulled = !1),
        (o.userData.noReflect = !0),
        (o.matrixAutoUpdate = !0),
        e.add(o));
    ((this.sunCore = new i.Color()), (this.sunGlow = new i.Color()));
  }
  _project(t) {
    const { camera: e, renderer: i } = this.ctx,
      s = i.domElement,
      n = s.clientWidth || window.innerWidth,
      o = s.clientHeight || window.innerHeight;
    if ((Ss.copy(t.position).project(e), Ss.z > 1))
      return ((t.onScreen = !1), !1);
    t.screen.set((Ss.x * 0.5 + 0.5) * n, (-Ss.y * 0.5 + 0.5) * o);
    const a = e.position.distanceTo(t.position),
      l = ThreeMathUtils.degToRad(e.fov);
    return (
      (t.screenR = (t.radius / (a * Math.tan(l * 0.5))) * o * 0.5),
      (t.onScreen = Math.abs(Ss.x) < 1.2 && Math.abs(Ss.y) < 1.2),
      !0
    );
  }
  _occlusion(t, e) {
    const { camera: i, terrain: s } = this.ctx,
      n = this._frame % 3;
    (Ss.copy(t.position),
      n > 0 &&
        (Iv.setFromMatrixColumn(i.matrixWorld, 0),
        Ss.addScaledVector(Iv, (n === 1 ? -0.7 : 0.7) * t.radius)),
      Js.origin.copy(i.position));
    const o = Lv.subVectors(Ss, i.position).length();
    Js.direction.copy(Lv).divideScalar(o);
    let a = 1;
    if (Js.intersectsBox(skyOcclusionBox)) {
      const f = s.raycast(Js, Yf, o);
      f && f.distanceTo(i.position) < o && (a = 0);
    }
    t._occ[n] = a;
    let l = 0;
    const c = this.ctx.modules.clouds?.list;
    if (c) {
      Js.direction.subVectors(t.position, i.position).normalize();
      for (let f = 0; f < c.length; f++) {
        const u = c[f];
        if (!u?.position) continue;
        const d = (u.radius ?? u.size ?? 1) * 0.85,
          p = Js.distanceSqToPoint(u.position);
        p < d * d && (l = Math.max(l, (1 - Math.sqrt(p) / d) * 1.4));
      }
    }
    t._cloudOcc = damp(t._cloudOcc, clamp(l, 0, 1), 6, e);
    const h = t._occ[0] * 0.5 + t._occ[1] * 0.25 + t._occ[2] * 0.25;
    t.visibility = damp(t.visibility, h, 10, e);
  }
  _sortOrder(t, e) {
    const i = this.ctx.camera.position;
    (Js.origin.copy(i), Js.direction.subVectors(t.position, i));
    const s = Js.direction.length();
    Js.direction.divideScalar(s);
    const n = Js.intersectBox(skyOcclusionBox, Yf) ? Yf.distanceTo(i) : 1 / 0;
    e.renderOrder = n < s ? 1.9 : 30;
  }
  update(t, e, i) {
    const { world: s, camera: n } = this.ctx;
    this._frame++;
    const o = this.sun,
      a = this.moon;
    (o.position.copy(s.sunPosition), a.position.copy(s.moonPosition));
    const l = clamp(s.cloudCover * 0.55 + s.storminess * 0.75, 0, 1),
      c = smoothstep(0.1, 0.55, l);
    {
      const z = Ss.set(0, 1.6, 0).sub(n.position),
        L = z.length(),
        k = g4.copy(o.position).sub(n.position),
        U = k.length(),
        F = Math.acos(clamp(z.dot(k) / (L * U + 1e-6), -1, 1)),
        G = smoothstep(Math.atan(8.5 / L) * 1.15, Math.atan(5 / L), F),
        B = smoothstep(L - 2, L - 6, U);
      this.inFront = damp(this.inFront || 0, G * B, 6, t);
    }
    const h = lerp(1, 0.22, this.inFront),
      f = s.sunElevation;
    o.fade = smoothstep(-0.17, 0.03, f);
    const u = smoothstep(0.5, -0.02, f),
      d = smoothstep(0.06, -0.08, f);
    (this.sunCore
      .setRGB(1, lerp(0.95, 0.5, u), lerp(0.86, 0.16, u))
      .lerp(setSkyScratchColor(1, 0.32, 0.07), d),
      this.sunCore.multiplyScalar(
        lerp(10, 4.2, u) *
          lerp(1, 0.75, d) *
          lerp(1, 0.04, c) *
          lerp(1, 0.45, this.inFront),
      ),
      this.sunGlow
        .setRGB(1, lerp(0.74, 0.42, u), lerp(0.42, 0.12, u))
        .lerp(setSkyScratchColor(1, 0.28, 0.08), d),
      (o.hover = damp(o.hover, o.hovered || o.grabbed ? 1 : 0, 9, t)),
      (o.pulse = Math.max(0, o.pulse - t * 1.6)));
    const p = 1 + Math.sin(e * 1.3) * 0.03,
      v = 1 + o.hover * 0.2 + (o.grabbed ? 0.08 : 0),
      g = SUN_DISC_RADIUS * (1 + 0.35 * u) * v,
      x = 0.1,
      m = this.sunMat.uniforms;
    (m.uHalf.value.set(g / x, g / x),
      (m.uDiscR.value = x),
      m.uCore.value.copy(this.sunCore).multiplyScalar(1 + o.hover * 0.3),
      m.uLimb.value.setRGB(0.66, lerp(0.36, 0.22, u), lerp(0.16, 0.06, u)),
      m.uGlow.value
        .copy(this.sunGlow)
        .multiplyScalar(lerp(1.7, 1.9, u) * p * lerp(1, 0.1, c) * h),
      (m.uCorona.value =
        (1 + s.humidity * 0.3 + o.hover * 0.9) * lerp(1, 1.6, s.golden)),
      (m.uSquash.value = 1 - 0.14 * smoothstep(0.1, -0.06, f)),
      (m.uFade.value = o.fade),
      (m.uPulse.value = o.pulse),
      this.sunMesh.position.copy(o.position),
      (this.sunMesh.visible = o.fade > 0.001),
      this._sortOrder(o, this.sunMesh),
      this.sunMesh.visible && this._occlusion(o, t),
      this._project(o));
    const w = o.fade * o.visibility * (1 - o._cloudOcc) * (1 - c),
      y = this.glareMat.uniforms,
      _ = SUN_DISC_RADIUS * 7 * (1 + 0.25 * u + o.hover * 0.2);
    (y.uHalf.value.set(_ * 2.2, _),
      y.uSourceRadius.value.set(g, g * m.uSquash.value),
      (y.uAspect.value = 2.2),
      y.uColor.value.copy(this.sunGlow),
      (y.uIntensity.value =
        w * (0.9 + 0.4 * u + o.hover * 0.5 + o.pulse * 0.8) * h),
      (y.uRot.value =
        Math.atan2(o.position.x - n.position.x, o.position.z - n.position.z) *
        0.6),
      this.glareMesh.position.copy(o.position),
      (this.glareMesh.visible = w > 0.003));
    const M = s.moonDir.y;
    ((a.fade = smoothstep(-0.14, 0.04, M) * (0.35 + 0.65 * s.night)),
      (a.hover = damp(a.hover, a.hovered || a.grabbed ? 1 : 0, 9, t)),
      (a.pulse = Math.max(0, a.pulse - t * 1.6)));
    const A = 1 + a.hover * 0.2 + (a.grabbed ? 0.08 : 0),
      b = 0.2,
      S = this.moonMat.uniforms,
      E = MOON_DISC_RADIUS * A;
    (S.uHalf.value.set(E / b, E / b),
      (S.uDiscR.value = b),
      Ss.copy(s.sunDir).transformDirection(n.matrixWorldInverse),
      (Ss.z += 1.25),
      S.uSunV.value.copy(Ss.normalize()));
    const T = smoothstep(0.35, 0, M),
      R =
        lerp(1.05, 0.8, 1 - s.night) * (1 + a.hover * 0.25) * lerp(1, 0.08, c);
    (S.uTint.value
      .setRGB(0.93, lerp(0.95, 0.84, T), lerp(1, 0.7, T))
      .multiplyScalar(R),
      S.uHaloCol.value
        .setRGB(0.55, 0.64, 0.9)
        .multiplyScalar(0.9 + a.hover * 0.5),
      (S.uHalo.value = 1 + s.humidity * 0.6),
      (S.uCoronaRing.value =
        smoothstep(0.45, 0.85, s.humidity) * (1 - s.storminess)),
      (S.uFade.value = a.fade),
      (S.uPulse.value = a.pulse),
      this.moonMesh.position.copy(a.position),
      (this.moonMesh.visible = a.fade > 0.001),
      this._sortOrder(a, this.moonMesh),
      this.moonMesh.visible && this._occlusion(a, t),
      this._project(a),
      (i.sunVisibility = w));
  }
  syncPhotoCamera(time, sky) {
    const { camera } = this.ctx;
    // Occlusion and glare depend on the viewpoint, not on simulation time.
    // Re-evaluate all three terrain probes without advancing orbital/hover
    // clocks or the normal mode's interleaved sample counter.
    const frame = this._frame;
    for (let sample = 0; sample < 3; sample++) {
      this._frame = sample;
      if (this.sunMesh.visible) this._occlusion(this.sun, 10);
      if (this.moonMesh.visible) this._occlusion(this.moon, 10);
    }
    const center = Ss.set(0, 1.6, 0).sub(camera.position);
    const centerDistance = center.length();
    const sun = g4.copy(this.sun.position).sub(camera.position);
    const sunDistance = sun.length();
    const angle = Math.acos(
      clamp(center.dot(sun) / (centerDistance * sunDistance + 1e-6), -1, 1),
    );
    this.inFront =
      smoothstep(
        Math.atan(8.5 / centerDistance) * 1.15,
        Math.atan(5 / centerDistance),
        angle,
      ) * smoothstep(centerDistance - 2, centerDistance - 6, sunDistance);
    this.update(0, time, sky);
    this._frame = frame;
  }
  hitTest(t) {
    let e = null;
    for (const i of [this.sun, this.moon]) {
      if (
        i.fade < 0.2 ||
        !i.onScreen ||
        (i.visibility < 0.3 && !i.grabbed) ||
        ((i._cloudOcc || 0) > 0.3 && !i.grabbed)
      )
        continue;
      const s = Math.hypot(t.x - i.screen.x, t.y - i.screen.y),
        n = Math.max(18, i.screenR * 1.4);
      s > n ||
        ((!e || s < e.screenD) &&
          (e = {
            body: i.name,
            screenD: s,
            distance: this.ctx.camera.position.distanceTo(i.position),
          }));
    }
    return e;
  }
  orb(t) {
    return t === "moon" ? this.moon : this.sun;
  }
}
const skyScratchColor = new ThreeColor();
function setSkyScratchColor(r, t, e) {
  return skyScratchColor.setRGB(r, t, e);
}
export { SunAndMoon };
