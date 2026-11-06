import { ThreeColor, ThreeVector3 } from "../vendor/three-runtime.js";

function createBackdropUniforms() {
  return {
    uBdRoom: { value: new ThreeColor(0.085, 0.075, 0.068) },
    uHaloDir: { value: new ThreeVector3(0, 0, -1) },
    uHalo: { value: 1 },
    uHaloTint: { value: new ThreeColor(1.12, 1, 0.84) },
  };
}

export { createBackdropUniforms };
