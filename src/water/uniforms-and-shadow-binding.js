// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeDepthFormat,
  ThreeDepthTexture,
  ThreeGreaterEqualCompare,
  ThreeLessEqualCompare,
  ThreeLinearFilter,
  ThreeMatrix4,
  ThreeUnsignedIntType,
  ThreeVector2,
  ThreeVector4,
  ThreeWebGLRenderTarget,
} from "../vendor/three-runtime.js";
import { TERRARIUM_BOUNDS, WATER_LEVEL_CONFIG } from "../core/config.js";
const LAKE_SURFACE_BOUNDS = {
  minX: -0.55,
  maxX: 5.85,
  minZ: 0.3,
  // Continue the existing basin to its natural southern shore.
  maxZ: 5.15,
};
const LAKE_FRONT_Z = TERRARIUM_BOUNDS.halfD - 0.004;
const MAX_LAKE_SURFACE_Y =
  WATER_LEVEL_CONFIG.lakeLevel + WATER_LEVEL_CONFIG.maxRise;
const YE = 0.55;
const $E = 0.006;
function createWaterRandom(r) {
  let t = r >>> 0;
  return () => {
    t = (t + 1831565813) >>> 0;
    let e = t;
    return (
      (e = Math.imul(e ^ (e >>> 15), e | 1)),
      (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
function createWaterUniforms() {
  const r = [];
  for (let t = 0; t < 4; t++) r.push(new ThreeVector4(0, 0, -100, 0));
  return {
    uIce: {
      value: 0,
    },
    uIceTemp: {
      value: 10,
    },
    uFlow: {
      value: 1,
    },
    uFlowTime: {
      value: 0,
    },
    uFallClock: {
      value: 0,
    },
    uFallFrozen: {
      value: 0,
    },
    uTurbid: {
      value: 0,
    },
    uRippleTex: {
      value: null,
    },
    uRippleBox: {
      value: new ThreeVector4(
        LAKE_SURFACE_BOUNDS.minX,
        LAKE_SURFACE_BOUNDS.minZ,
        LAKE_SURFACE_BOUNDS.maxX - LAKE_SURFACE_BOUNDS.minX,
        LAKE_SURFACE_BOUNDS.maxZ - LAKE_SURFACE_BOUNDS.minZ,
      ),
    },
    uRippleTexel: {
      value: new ThreeVector2(1 / 256, 1 / 150),
    },
    uRippleAlpha: {
      value: 1,
    },
    uReflTex: {
      value: null,
    },
    uReflMatrix: {
      value: new ThreeMatrix4(),
    },
    uReflOn: {
      value: 0,
    },
    uReflClamp: {
      value: new ThreeVector4(0.001, 0.001, 0.999, 0.999),
    },
    uReflShift: {
      value: new ThreeVector2(1, 1),
    },
    uShadowMap: {
      value: null,
    },
    uShadowMatrix: {
      value: new ThreeMatrix4(),
    },
    uShadowParams: {
      value: new ThreeVector2(0.001, 0),
    },
    uImpacts: {
      value: r,
    },
  };
}
function waterShadowDefines(r) {
  return r.renderer.capabilities?.reversedDepthBuffer
    ? {
        W_SHADOW: 1,
        W_REVERSED_DEPTH: 1,
      }
    : {
        W_SHADOW: 1,
      };
}
function createWaterShadowBinding(r, t) {
  const { renderer: e } = r,
    i = !!e.capabilities?.reversedDepthBuffer,
    s = new ThreeWebGLRenderTarget(1, 1, {
      depthBuffer: !0,
      stencilBuffer: !1,
    }),
    n = new ThreeDepthTexture(1, 1, ThreeUnsignedIntType);
  ((n.format = ThreeDepthFormat),
    (n.compareFunction = i ? ThreeGreaterEqualCompare : ThreeLessEqualCompare),
    (n.minFilter = n.magFilter = ThreeLinearFilter),
    (n.name = "waterShadowStandIn"),
    (s.depthTexture = n));
  const o = e.getRenderTarget();
  (e.setRenderTarget(s),
    e.clear(!0, !0, !1),
    e.setRenderTarget(o),
    (t.uShadowMap.value = n));
  const a = t.uShadowParams.value;
  return function () {
    const c = r.lights?.key,
      h = c?.castShadow ? c.shadow.map?.depthTexture : null;
    h
      ? ((t.uShadowMap.value = h),
        (t.uShadowMatrix.value = c.shadow.matrix),
        a.set(Math.max(1.5, c.shadow.radius * 0.8) / c.shadow.mapSize.x, 1))
      : ((t.uShadowMap.value = n), (a.y = 0));
  };
}
export {
  $E,
  LAKE_FRONT_Z,
  LAKE_SURFACE_BOUNDS,
  MAX_LAKE_SURFACE_Y,
  YE,
  createWaterRandom,
  createWaterShadowBinding,
  createWaterUniforms,
  waterShadowDefines,
};
