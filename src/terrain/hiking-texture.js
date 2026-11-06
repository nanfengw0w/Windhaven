import {
  ThreeDataTexture,
  ThreeLinearFilter,
  ThreeLinearMipmapLinearFilter,
  ThreeRGBAFormat,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import {
  HIKING_GROUND_BOUNDS,
  sampleHikingGround,
} from "../layout/hiking-layout.js";
import { sampleRuinsGround } from "../layout/mountain-ruins-layout.js";

// A narrow path baked into the hillside itself, sharing the terrain's wetness,
// snow and frost. The long texture follows the rear meadow's proportions.
function createHikingGroundTexture(width = 640, height = 176) {
  const data = new Uint8Array(width * height * 4);
  const sample = {};
  const ruins = {};
  const { minX, minZ, sizeX, sizeZ } = HIKING_GROUND_BOUNDS;
  for (let row = 0; row < height; row++) {
    const z = minZ + ((row + 0.5) / height) * sizeZ;
    for (let col = 0; col < width; col++) {
      const x = minX + ((col + 0.5) / width) * sizeX;
      sampleHikingGround(x, z, sample);
      sampleRuinsGround(x, z, ruins);
      const offset = (row * width + col) * 4;
      data[offset] = Math.round(
        Math.max(sample.coverage, ruins.coverage) * 255,
      );
      data[offset + 1] = Math.round(Math.max(sample.wear, ruins.wear) * 255);
      data[offset + 2] = Math.round(
        Math.max(sample.gravel, ruins.gravel) * 255,
      );
      data[offset + 3] = 255;
    }
  }
  const texture = new ThreeDataTexture(
    data,
    width,
    height,
    ThreeRGBAFormat,
    ThreeUnsignedByteType,
  );
  texture.name = "rear-hillside-hiking-path";
  texture.magFilter = ThreeLinearFilter;
  texture.minFilter = ThreeLinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

const HIKING_GROUND_GLSL = `
uniform sampler2D uHikingGround;
vec3 hikingGroundAt(vec2 xz) {
  vec2 uv = (xz - vec2(${HIKING_GROUND_BOUNDS.minX.toFixed(3)}, ${HIKING_GROUND_BOUNDS.minZ.toFixed(3)})) / vec2(${HIKING_GROUND_BOUNDS.sizeX.toFixed(3)}, ${HIKING_GROUND_BOUNDS.sizeZ.toFixed(3)});
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec3(0.0);
  return texture2D(uHikingGround, uv).rgb;
}
`;

export { createHikingGroundTexture, HIKING_GROUND_GLSL };
