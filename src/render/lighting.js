// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBackSide,
  ThreeBufferAttribute,
  ThreeColor,
  ThreeDirectionalLight,
  ThreeDoubleSide,
  ThreeHemisphereLight,
  ThreeMatrix4,
  ThreeMesh,
  ThreeMeshBasicMaterial,
  ThreePMREMGenerator,
  ThreePlaneGeometry,
  ThreePointLight,
  ThreeScene,
  ThreeShaderChunk,
  ThreeSphereGeometry,
  ThreeVector2,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
const lightingClamp = (r, t, e) => (r < t ? t : r > e ? e : r);
const lightingLerp = (r, t, e) => r + (t - r) * e;
const lightingSmoothstep = (r, t, e) => {
  const i = lightingClamp((e - r) / (t - r), 0, 1);
  return i * i * (3 - 2 * i);
};
const dampExposure = (r, t, e, i) => t + (r - t) * Math.exp(-2.5 * i);
const colorLuminance = (r) => r.r * 0.2126 + r.g * 0.7152 + r.b * 0.0722;
const SHADOW_DEPTH_RANGE = Math.ceil(
  Math.max(
    30,
    2 * Math.hypot(LANDSCAPE_BOUNDS.halfW, LANDSCAPE_BOUNDS.halfD) + 12,
  ),
);
const SHADOW_BLOCKER_PROBE_DEPTH = 2;
const SHADOW_SOFTNESS_WORLD = 0.075;
const SHADOW_CONTACT_RADIUS = 1;
const KEY_LIGHT_DISTANCE = 30;
const SHADOW_GROUND_Y = TERRARIUM_BOUNDS.bottomY - 0.25 - 1.22;
const SHADOW_BOUNDS_MIN = new ThreeVector3(
  -LANDSCAPE_BOUNDS.halfW - 0.6,
  SHADOW_GROUND_Y,
  -LANDSCAPE_BOUNDS.halfD - 0.6,
);
const SHADOW_BOUNDS_MAX = new ThreeVector3(
  LANDSCAPE_BOUNDS.halfW + 0.6,
  LANDSCAPE_BOUNDS.topY + 0.35,
  LANDSCAPE_BOUNDS.halfD + 0.6,
);
const SHADOW_FOOTPRINT_LIMITS = {
  x: LANDSCAPE_BOUNDS.halfW + 4.5,
  z: LANDSCAPE_BOUNDS.halfD + 3.5,
};
const ENVIRONMENT_LUMINANCE = 0.3;
function createStudioEnvironment() {
  const r = new ThreeScene(),
    t = 20,
    e = new ThreeSphereGeometry(t, 48, 24),
    i = e.attributes.position,
    s = new Float32Array(i.count * 3),
    n = new ThreeColor(0.034, 0.03, 0.027),
    o = new ThreeColor(0.06, 0.06, 0.066),
    a = new ThreeColor(0.05, 0.033, 0.02),
    l = new ThreeColor();
  for (let h = 0; h < i.count; h++) {
    const f = i.getY(h) / t;
    (f < -0.06
      ? l.copy(a).multiplyScalar(0.6 + 0.4 * Math.min(1, -f * 3))
      : l.copy(n).lerp(o, lightingSmoothstep(0, 0.9, f)),
      (s[h * 3] = l.r),
      (s[h * 3 + 1] = l.g),
      (s[h * 3 + 2] = l.b));
  }
  (e.setAttribute("color", new ThreeBufferAttribute(s, 3)),
    r.add(
      new ThreeMesh(
        e,
        new ThreeMeshBasicMaterial({
          vertexColors: !0,
          side: ThreeBackSide,
        }),
      ),
    ));
  const c = (h, f, u, d, p, v, g, x, m) => {
    const w = new ThreeMesh(
      new ThreePlaneGeometry(h, f),
      new ThreeMeshBasicMaterial({
        color: new ThreeColor(v, g, x).multiplyScalar(m),
        side: ThreeDoubleSide,
      }),
    );
    (w.position.set(u, d, p), w.lookAt(0, 0, 0), r.add(w));
  };
  return (
    c(9, 6, -6, 14, 8, 1, 0.96, 0.9, 5.5),
    c(4, 4, 2, 18.5, -2, 1, 0.98, 0.95, 3),
    c(3, 10, -17.5, 6, -2, 0.85, 0.92, 1, 2.2),
    c(1.2, 8, 15, 7, -9, 1, 0.78, 0.55, 3),
    r
  );
}
let softShadowsPatched = !1;
function installSoftShadowPatch(r = 8) {
  if (softShadowsPatched) return;
  softShadowsPatched = !0;
  const t = ThreeShaderChunk.shadowmap_pars_fragment,
    e = t.indexOf("float getShadow( sampler2DShadow shadowMap"),
    i = t.indexOf("#elif defined( SHADOWMAP_TYPE_VSM )");
  if (e < 0 || i < e) return;
  const s = (SHADOW_BLOCKER_PROBE_DEPTH / SHADOW_DEPTH_RANGE).toFixed(5),
    n = `float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			if ( shadowCoord.x < 0.0 || shadowCoord.x > 1.0 || shadowCoord.y < 0.0 || shadowCoord.y > 1.0 || shadowCoord.z > 1.0 ) return 1.0;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				const float wgProbeSign = 1.0;
			#else
				const float wgProbeSign = -1.0;
			#endif
			float texel = 1.0 / shadowMapSize.x;
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			float rWide = max( shadowRadius, ${SHADOW_CONTACT_RADIUS.toFixed(2)} ) * texel;
			// 1) wide neighbourhood: fully lit or fully shadowed → done
			vec2 o0 = vogelDiskSample( 0, 4, phi ) * rWide, o1 = vogelDiskSample( 1, 4, phi ) * rWide;
			vec2 o2 = vogelDiskSample( 2, 4, phi ) * rWide, o3 = vogelDiskSample( 3, 4, phi ) * rWide;
			float lit = texture( shadowMap, vec3( shadowCoord.xy + o0, shadowCoord.z ) )
				+ texture( shadowMap, vec3( shadowCoord.xy + o1, shadowCoord.z ) )
				+ texture( shadowMap, vec3( shadowCoord.xy + o2, shadowCoord.z ) )
				+ texture( shadowMap, vec3( shadowCoord.xy + o3, shadowCoord.z ) );
			if ( lit > 3.995 ) return 1.0;
			if ( lit < 0.005 ) return 1.0 - shadowIntensity;
			// 2) blocker height probe: still occluded when the reference depth is pulled toward the light?
			float pz = ${s} * wgProbeSign;
			float far = 4.0
				- texture( shadowMap, vec3( shadowCoord.xy + o0, shadowCoord.z + pz * 0.1 ) )
				- texture( shadowMap, vec3( shadowCoord.xy + o1, shadowCoord.z + pz * 0.28 ) )
				- texture( shadowMap, vec3( shadowCoord.xy + o2, shadowCoord.z + pz * 0.55 ) )
				- texture( shadowMap, vec3( shadowCoord.xy + o3, shadowCoord.z + pz ) );
			float soft = clamp( far / max( 4.0 - lit, 0.25 ), 0.0, 1.0 );
			// 3) filter: crisp at contact, soft under distant occluders
			float r = mix( ${SHADOW_CONTACT_RADIUS.toFixed(2)}, max( shadowRadius, ${SHADOW_CONTACT_RADIUS.toFixed(2)} ), soft * soft * ( 3.0 - 2.0 * soft ) ) * texel;
			float phi2 = phi + 0.7;
			float s = 0.0;
			for ( int i = 0; i < ${r}; i ++ ) s += texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( i, ${r}, phi2 ) * r, shadowCoord.z ) );
			return mix( 1.0, s * ${(1 / r).toFixed(5)}, shadowIntensity );
		}

	`;
  ThreeShaderChunk.shadowmap_pars_fragment = t.slice(0, e) + n + t.slice(i);
}
const shadowLightPosition = new ThreeVector3();
const shadowViewBasis = new ThreeMatrix4();
const shadowRight = new ThreeVector3();
const shadowUp = new ThreeVector3();
const shadowBackward = new ThreeVector3();
const shadowRelativePoint = new ThreeVector3();
const roomClearColor = new ThreeColor();
const shadowFitPoints = Array.from(
  {
    length: 12,
  },
  () => new ThreeVector3(),
);
class LightingController {
  constructor(t) {
    const { scene: e, renderer: i, quality: s } = t;
    ((this.ctx = t),
      installSoftShadowPatch(s.pick(5, 8, 10)),
      (this.key = new ThreeDirectionalLight(16777215, 3)),
      (this.key.name = "key"),
      (this.key.castShadow = !0));
    const n = s.pick(1024, 2048, 4096);
    ((this.mapSize = n),
      this.key.shadow.mapSize.set(n, n),
      (this.key.shadow.bias = -12e-5),
      (this.key.shadow.normalBias = 0.012),
      (this.key.shadow.radius = 4),
      this.key.target.position.set(0, 0.8, 0),
      e.add(this.key, this.key.target),
      (this.shadowTexel = 0.01),
      (this._fitSize = new ThreeVector2()),
      (this.hemi = new ThreeHemisphereLight(10404863, 4864810, 0.6)),
      (this.hemi.name = "fill"),
      e.add(this.hemi),
      (this.flash = new ThreePointLight(13621503, 0, 18, 1.6)),
      this.flash.position.set(0, 6, 0),
      e.add(this.flash));
    const o = new ThreePMREMGenerator(i),
      a = createStudioEnvironment();
    ((this.envTexture = o.fromScene(a, 0.03).texture),
      a.traverse((l) => {
        l.isMesh && (l.geometry.dispose(), l.material.dispose());
      }),
      (e.environment = this.envTexture),
      (e.environmentIntensity = 0.17),
      o.dispose(),
      (this.exposure = 1),
      (this.exposureBias = 0),
      (this.keyFill = 0),
      t.events.on("lightning", ({ end: l }) => {
        l &&
          this.flash.position.set(
            l.x,
            Math.min(TERRARIUM_BOUNDS.topY - 0.5, l.y + 3),
            l.z,
          );
      }),
      this.update(0));
  }
  setExposureBias(t) {
    this.exposureBias = t || 0;
  }
  update(t) {
    const { world: e, scene: i, renderer: s } = this.ctx,
      n = t > 0 ? t : 10;
    (this.key.color.copy(e.lightColor),
      (this.key.intensity = e.lightIntensity));
    const o = e.lightIntensity > 0.02;
    ((this.key.shadow.autoUpdate = o),
      o && (this.key.shadow.needsUpdate = !0),
      this.key.position
        .copy(this.key.target.position)
        .addScaledVector(e.lightDir, KEY_LIGHT_DISTANCE),
      o && this._fitShadow(e.lightDir),
      this.hemi.color.copy(e.skyColor),
      this.hemi.groundColor.copy(e.groundColor),
      (this.hemi.intensity = e.ambientIntensity),
      (this.flash.intensity = e.flash * 60),
      roomClearColor.copy(e.roomColor),
      s.getRenderTarget() === null && roomClearColor.convertSRGBToLinear(),
      s.setClearColor(roomClearColor, 1));
    const a =
        (colorLuminance(e.lightColor) *
          e.lightIntensity *
          Math.max(e.lightDir.y, 0)) /
        Math.PI,
      l =
        (colorLuminance(e.skyColor) * e.ambientIntensity) / Math.PI +
        ENVIRONMENT_LUMINANCE * i.environmentIntensity;
    this.keyFill = (a + l) / Math.max(l, 1e-4);
    const c = lightingClamp(e.cloudCover * 0.55 + e.storminess * 0.75, 0, 1);
    i.environmentIntensity =
      lightingLerp(0.17, 0.05, e.night) * (1 - c * 0.2) + e.flash * 0.3;
    const h = e.golden,
      f =
        lightingLerp(1, 1.65, e.night) *
        (1 + h * 0.22) *
        lightingLerp(1, 0.9, c * (1 - e.night)) *
        Math.pow(2, this.exposureBias);
    ((this.exposure = dampExposure(this.exposure, f, 2.5, n)),
      (s.toneMappingExposure = this.exposure));
    const u = this.ctx.post;
    if (
      (u?.bloom &&
        ((u.bloom.threshold = lightingLerp(1.45, 1, e.night) * (1 - h * 0.1)),
        (u.bloom.radius = lightingLerp(
          0.42,
          0.62,
          Math.max(h, e.night * 0.7),
        ))),
      u?.setTiltShift)
    )
      u.setTiltShift(0.47, 0.24, 0);
  }
  _fitShadow(t) {
    const e = this.key,
      i = e.shadow.camera,
      s = e.target.position;
    (shadowLightPosition.copy(e.position),
      shadowViewBasis.lookAt(shadowLightPosition, s, i.up),
      shadowRight.setFromMatrixColumn(shadowViewBasis, 0),
      shadowUp.setFromMatrixColumn(shadowViewBasis, 1),
      shadowBackward.setFromMatrixColumn(shadowViewBasis, 2));
    let n = 0;
    for (let S = 0; S < 8; S++)
      shadowFitPoints[n++].set(
        S & 1 ? SHADOW_BOUNDS_MAX.x : SHADOW_BOUNDS_MIN.x,
        S & 2 ? SHADOW_BOUNDS_MAX.y : SHADOW_BOUNDS_MIN.y,
        S & 4 ? SHADOW_BOUNDS_MAX.z : SHADOW_BOUNDS_MIN.z,
      );
    const o = Math.max(t.y, 0.05),
      a = (SHADOW_BOUNDS_MAX.y - SHADOW_GROUND_Y) / o;
    for (let S = 0; S < 4; S++) {
      const E = S & 1 ? SHADOW_BOUNDS_MAX.x : SHADOW_BOUNDS_MIN.x,
        T = S & 2 ? SHADOW_BOUNDS_MAX.z : SHADOW_BOUNDS_MIN.z;
      shadowFitPoints[n++].set(
        lightingClamp(
          E - t.x * a,
          -SHADOW_FOOTPRINT_LIMITS.x,
          SHADOW_FOOTPRINT_LIMITS.x,
        ),
        SHADOW_GROUND_Y,
        lightingClamp(
          T - t.z * a,
          -SHADOW_FOOTPRINT_LIMITS.z,
          SHADOW_FOOTPRINT_LIMITS.z,
        ),
      );
    }
    let l = 1 / 0,
      c = -1 / 0,
      h = 1 / 0,
      f = -1 / 0,
      u = 1 / 0;
    for (let S = 0; S < n; S++) {
      shadowRelativePoint.subVectors(shadowFitPoints[S], shadowLightPosition);
      const E = shadowRelativePoint.dot(shadowRight),
        T = shadowRelativePoint.dot(shadowUp),
        R = -shadowRelativePoint.dot(shadowBackward);
      (E < l && (l = E),
        E > c && (c = E),
        T < h && (h = T),
        T > f && (f = T),
        R < u && (u = R));
    }
    const d = 0.5,
      p = this._fitSize,
      v = Math.ceil((c - l + 0.1) / d) * d,
      g = Math.ceil((f - h + 0.1) / d) * d;
    ((v > p.x || v < p.x - 2 * d) && (p.x = v),
      (g > p.y || g < p.y - 2 * d) && (p.y = g));
    const x = this.mapSize,
      m = p.x / x,
      w = p.y / x,
      y = (l + c) * 0.5,
      _ = (h + f) * 0.5,
      M = Math.floor((y - p.x * 0.5) / m) * m,
      A = Math.floor((_ - p.y * 0.5) / w) * w;
    ((i.left = M),
      (i.right = M + p.x),
      (i.bottom = A),
      (i.top = A + p.y),
      (i.near = Math.max(0.1, u - 0.5)),
      (i.far = i.near + SHADOW_DEPTH_RANGE),
      i.updateProjectionMatrix());
    const b = Math.max(m, w);
    ((this.shadowTexel = b),
      (e.shadow.radius = lightingClamp(SHADOW_SOFTNESS_WORLD / b, 1.5, 16)),
      (e.shadow.normalBias =
        b * lightingLerp(2.2, 1.3, lightingClamp(t.y * 1.6, 0, 1))),
      (e.shadow.bias = -8e-5 - 25e-5 * (1 - lightingClamp(t.y * 2, 0, 1))));
  }
}
export { LightingController };
