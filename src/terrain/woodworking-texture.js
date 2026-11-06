import {
  ThreeDataTexture,
  ThreeLinearFilter,
  ThreeLinearMipmapLinearFilter,
  ThreeRGBAFormat,
  ThreeUnsignedByteType,
} from "../vendor/three-runtime.js";
import {
  WOODWORKING_GROUND_BOUNDS,
  sampleWoodworkingGround,
} from "../layout/woodworking-layout.js";

// Local ground use is baked onto the existing terrain. It inherits the same
// wet soil, snow and frost passes as the village paths without another mesh.
function createWoodworkingGroundTexture(width = 256, height = 296) {
  const data = new Uint8Array(width * height * 4);
  const sample = {};
  const { minX, minZ, sizeX, sizeZ } = WOODWORKING_GROUND_BOUNDS;
  for (let row = 0; row < height; row++) {
    const z = minZ + ((row + 0.5) / height) * sizeZ;
    for (let col = 0; col < width; col++) {
      const x = minX + ((col + 0.5) / width) * sizeX;
      sampleWoodworkingGround(x, z, sample);
      const offset = (row * width + col) * 4;
      data[offset] = Math.round(sample.coverage * 255);
      data[offset + 1] = Math.round(sample.wear * 255);
      data[offset + 2] = Math.round(sample.gravel * 255);
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
  texture.name = "woodworking-yard-and-track";
  texture.magFilter = ThreeLinearFilter;
  texture.minFilter = ThreeLinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

const WOODWORKING_GROUND_GLSL = `
uniform sampler2D uWoodworkingGround;
vec3 woodworkingGroundAt(vec2 xz) {
  vec2 uv = (xz - vec2(${WOODWORKING_GROUND_BOUNDS.minX.toFixed(3)}, ${WOODWORKING_GROUND_BOUNDS.minZ.toFixed(3)})) / vec2(${WOODWORKING_GROUND_BOUNDS.sizeX.toFixed(3)}, ${WOODWORKING_GROUND_BOUNDS.sizeZ.toFixed(3)});
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec3(0.0);
  return texture2D(uWoodworkingGround, uv).rgb;
}
`;

export { createWoodworkingGroundTexture, WOODWORKING_GROUND_GLSL };
