import {
  ThreeBackSide,
  ThreeMesh,
  ThreeShaderMaterial,
  ThreeSphereGeometry,
} from "../vendor/three-runtime.js";
import {
  BACKDROP_COMMON_GLSL,
  BACKDROP_FRAGMENT_GLSL,
  BACKDROP_VERTEX_GLSL,
} from "./backdrop-shaders.js";

/** Camera-following sphere for the studio background and warm halo. */
function createBackdropMesh(r, t) {
  const e = new ThreeShaderMaterial({
      uniforms: {
        ...r.uniforms,
        ...t,
      },
      vertexShader: r.GLSL_COMMON + BACKDROP_VERTEX_GLSL,
      fragmentShader:
        r.GLSL_COMMON + BACKDROP_COMMON_GLSL + BACKDROP_FRAGMENT_GLSL,
      side: ThreeBackSide,
      depthWrite: !1,
    }),
    i = new ThreeMesh(new ThreeSphereGeometry(95, 40, 20), e);
  return (
    (i.frustumCulled = !1),
    (i.renderOrder = 1),
    (i.name = "studio-backdrop"),
    i
  );
}
export { createBackdropMesh };
