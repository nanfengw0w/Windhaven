import {
  ThreeDataTexture,
  ThreeLinearFilter,
  ThreeLinearMipmapLinearFilter,
  ThreeRGBAFormat,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import { createSeededRandom } from "../core/math.js";

// Single slender shoot. R luminance, G shedding threshold, B wood, A silhouette.
function createWillowAtlas(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const random = createSeededRandom(882014);
  const cell = size / 2;
  ctx.clearRect(0, 0, size, size);
  for (let bare = 0; bare <= 1; bare++) {
    const X = (v) => (bare + v) * cell,
      Y = (v) => v * cell;
    ctx.strokeStyle = "rgb(130,128,255)";
    ctx.lineWidth = Math.max(0.65, cell / 340);
    ctx.beginPath();
    ctx.moveTo(X(0.5), Y(0));
    ctx.bezierCurveTo(X(0.46), Y(0.34), X(0.54), Y(0.66), X(0.5), Y(1));
    ctx.stroke();
    if (bare) continue;
    for (let leaf = 0; leaf < 28; leaf++) {
      const t = 0.02 + leaf * 0.0325 + (random() - 0.5) * 0.008;
      const sign = leaf % 2 ? -1 : 1;
      const x = 0.5 + Math.sin(t * Math.PI * 2) * 0.014;
      const endX = x + sign * (0.2 + random() * 0.16);
      const endY = Math.min(0.995, t + 0.05 + random() * 0.025);
      const width = 0.065 + random() * 0.025;
      const light = Math.floor(160 + random() * 75);
      const shedding = Math.floor(random() * 250);
      ctx.fillStyle = "rgb(" + light + "," + shedding + ",0)";
      ctx.beginPath();
      ctx.moveTo(X(x), Y(t));
      ctx.bezierCurveTo(
        X(endX + sign * width),
        Y(t + 0.018),
        X(endX + sign * width * 0.45),
        Y(endY - 0.014),
        X(endX),
        Y(endY),
      );
      ctx.bezierCurveTo(
        X(endX - sign * width * 0.45),
        Y(endY - 0.018),
        X(x + sign * width),
        Y(t + 0.022),
        X(x),
        Y(t),
      );
      ctx.fill();
    }
  }
  const data = ctx.getImageData(0, 0, size, size).data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 8) {
      data[i] = 175;
      data[i + 1] = 128;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
  const texture = new ThreeDataTexture(
    new Uint8Array(data),
    size,
    size,
    ThreeRGBAFormat,
    ThreeUnsignedByteType,
  );
  texture.generateMipmaps = true;
  texture.minFilter = ThreeLinearMipmapLinearFilter;
  texture.magFilter = ThreeLinearFilter;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export { createWillowAtlas };
