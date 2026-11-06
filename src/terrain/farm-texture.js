import {
  ThreeDataTexture,
  ThreeLinearFilter,
  ThreeLinearMipmapLinearFilter,
  ThreeRGBAFormat,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import { sampleFarmGround } from "../layout/farm-layout.js";

const FARM_GROUND_BOUNDS = Object.freeze({
  minX: -6.2,
  minZ: 4.65,
  sizeX: 6.65,
  sizeZ: 2.85,
});

function createFarmGroundTexture(width = 399, height = 171) {
  const data = new Uint8Array(width * height * 4);
  const sample = {};
  const { minX, minZ, sizeX, sizeZ } = FARM_GROUND_BOUNDS;
  for (let row = 0; row < height; row++) {
    const z = minZ + ((row + 0.5) / height) * sizeZ;
    for (let col = 0; col < width; col++) {
      const x = minX + ((col + 0.5) / width) * sizeX;
      sampleFarmGround(x, z, sample);
      const offset = (row * width + col) * 4;
      data[offset] = Math.round(sample.coverage * 255);
      data[offset + 1] = 0;
      data[offset + 2] = 0;
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
  texture.name = "farm-shelter-ground";
  texture.magFilter = ThreeLinearFilter;
  texture.minFilter = ThreeLinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

const FARM_GROUND_GLSL = `
uniform sampler2D uFarmGround;
float farmGroundAt(vec2 xz) {
  vec2 uv = (xz - vec2(${FARM_GROUND_BOUNDS.minX.toFixed(3)}, ${FARM_GROUND_BOUNDS.minZ.toFixed(3)})) / vec2(${FARM_GROUND_BOUNDS.sizeX.toFixed(3)}, ${FARM_GROUND_BOUNDS.sizeZ.toFixed(3)});
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return 0.0;
  return texture2D(uFarmGround, uv).r;
}
`;

export { FARM_GROUND_BOUNDS, FARM_GROUND_GLSL, createFarmGroundTexture };
