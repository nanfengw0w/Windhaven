import {
  ThreeDataTexture,
  ThreeLinearFilter,
  ThreeLinearMipmapLinearFilter,
  ThreeRGBAFormat,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import { TOWN_PATHS } from "../layout/world-layout.js";
import { sampleTownPaths } from "../layout/town-paths.js";

const TOWN_PATH_BOUNDS = Object.freeze({
  minX: 6.6,
  minZ: -3.2,
  sizeX: 5.2,
  sizeZ: 7.8,
});
function createTownPathTexture(width = 384, height = 576) {
  const data = new Uint8Array(width * height * 4);
  const sample = {};
  for (let row = 0; row < height; row++) {
    const z =
      TOWN_PATH_BOUNDS.minZ + ((row + 0.5) / height) * TOWN_PATH_BOUNDS.sizeZ;
    for (let col = 0; col < width; col++) {
      const x =
        TOWN_PATH_BOUNDS.minX + ((col + 0.5) / width) * TOWN_PATH_BOUNDS.sizeX;
      sampleTownPaths(TOWN_PATHS, x, z, sample);
      const i = (row * width + col) * 4;
      data[i] = Math.round(sample.coverage * 255);
      data[i + 1] = Math.round(sample.wear * 255);
      data[i + 2] = Math.round(sample.gravel * 255);
      data[i + 3] = 255;
    }
  }
  const texture = new ThreeDataTexture(
    data,
    width,
    height,
    ThreeRGBAFormat,
    ThreeUnsignedByteType,
  );
  texture.name = "village-earth-path-field";
  texture.magFilter = ThreeLinearFilter;
  texture.minFilter = ThreeLinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

const TOWN_PATH_GLSL = `
uniform sampler2D uTownPaths;
vec3 townPathAt(vec2 xz) {
  vec2 uv = (xz - vec2(${TOWN_PATH_BOUNDS.minX.toFixed(3)}, ${TOWN_PATH_BOUNDS.minZ.toFixed(3)})) / vec2(${TOWN_PATH_BOUNDS.sizeX.toFixed(3)}, ${TOWN_PATH_BOUNDS.sizeZ.toFixed(3)});
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec3(0.0);
  return texture2D(uTownPaths, uv).rgb;
}
`;

export { TOWN_PATH_BOUNDS, TOWN_PATH_GLSL, createTownPathTexture };
