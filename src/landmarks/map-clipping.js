import {
  ThreeMeshDepthMaterial,
  ThreeRGBADepthPacking,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";

const MAP_CLIP_FRAGMENT = `
varying vec3 vMapClipPosition;
void clipToLandscape() {
  if (abs(vMapClipPosition.x) > ${LANDSCAPE_BOUNDS.halfW.toFixed(4)} ||
      abs(vMapClipPosition.z) > ${LANDSCAPE_BOUNDS.halfD.toFixed(4)}) discard;
}
`;

function injectMapClipping(shader) {
  shader.vertexShader =
    "varying vec3 vMapClipPosition;\n" +
    shader.vertexShader.replace(
      "#include <project_vertex>",
      `vec4 mapClipWorld = vec4(transformed, 1.0);
     #ifdef USE_INSTANCING
       mapClipWorld = instanceMatrix * mapClipWorld;
     #endif
     vMapClipPosition = (modelMatrix * mapClipWorld).xyz;
     #include <project_vertex>`,
    );
  shader.fragmentShader =
    MAP_CLIP_FRAGMENT +
    shader.fragmentShader.replace(
      /void\s+main\s*\(\s*\)\s*\{/,
      "void main() {\n  clipToLandscape();",
    );
}

function bindMapClipping(material, ctx) {
  material.onBeforeCompile = (shader) => {
    if (ctx) {
      Object.assign(shader.uniforms, ctx.uniforms);
      const common = ctx.GLSL_COMMON ?? "";
      shader.vertexShader = common + shader.vertexShader;
      shader.fragmentShader = common + shader.fragmentShader;
    }
    injectMapClipping(shader);
  };
  material.customProgramCacheKey = () =>
    `wg-map-clipped-${ctx ? "weather" : "depth"}-${LANDSCAPE_BOUNDS.halfW}-${LANDSCAPE_BOUNDS.halfD}`;
  return material;
}

function createMapClippedDepthMaterial() {
  return bindMapClipping(
    new ThreeMeshDepthMaterial({ depthPacking: ThreeRGBADepthPacking }),
  );
}

export { MAP_CLIP_FRAGMENT, bindMapClipping, createMapClippedDepthMaterial };
