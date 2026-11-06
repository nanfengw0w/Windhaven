// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeClampToEdgeWrapping,
  ThreeDataTexture,
  ThreeDataUtils,
  ThreeFloatType,
  ThreeHalfFloatType,
  ThreeLinearFilter,
  ThreeRGBAFormat,
} from "../vendor/three-runtime.js";
let supportsFloatLinearFiltering = !0;
function detectFloatLinearFiltering(r) {
  return (
    (supportsFloatLinearFiltering = !!r.extensions.has(
      "OES_texture_float_linear",
    )),
    supportsFloatLinearFiltering
  );
}
function createFieldTexture(r, t, e, i = ThreeRGBAFormat) {
  let s;
  return (
    supportsFloatLinearFiltering
      ? (s = new ThreeDataTexture(r, t, e, i, ThreeFloatType))
      : ((s = new ThreeDataTexture(
          new Uint16Array(r.length),
          t,
          e,
          i,
          ThreeHalfFloatType,
        )),
        (s.userData.src = r)),
    (s.magFilter = ThreeLinearFilter),
    (s.minFilter = ThreeLinearFilter),
    (s.wrapS = s.wrapT = ThreeClampToEdgeWrapping),
    updateFieldTexture(s),
    s
  );
}
function updateFieldTexture(r) {
  const t = r.userData.src;
  if (t) {
    const e = r.image.data,
      i = ThreeDataUtils.toHalfFloat;
    for (let s = 0; s < t.length; s++) e[s] = i(t[s]);
  }
  r.needsUpdate = !0;
}
export { createFieldTexture, detectFloatLinearFiltering, updateFieldTexture };
