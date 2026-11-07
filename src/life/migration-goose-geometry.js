import {
  ThreeBufferGeometry,
  ThreeDoubleSide,
  ThreeFloat32BufferAttribute,
  ThreeMeshBasicMaterial,
} from "../vendor/three-runtime.js";
import { bindMapClipping } from "../landmarks/map-clipping.js";

const WING_ROOT_X = 0.009;
const WING_TIP_X = 0.125;
const BODY_SIDES = 6;

// Back to front along local +Z: tail, torso, long neck, head and beak.
// Each ring is [z, centerY, halfWidth, halfHeight].
const BODY_PROFILE = [
  [-0.069, 0.003, 0.004, 0.0015],
  [-0.05, 0.002, 0.012, 0.004],
  [-0.031, 0, 0.018, 0.012],
  [-0.005, 0, 0.021, 0.017],
  [0.02, 0.002, 0.015, 0.013],
  [0.034, 0.006, 0.008, 0.009],
  [0.048, 0.011, 0.005, 0.006],
  [0.072, 0.014, 0.0048, 0.005],
  [0.083, 0.016, 0.0068, 0.0064],
  [0.094, 0.015, 0.006, 0.005],
  [0.097, 0.014, 0.0035, 0.0028],
  [0.108, 0.013, 0.001, 0.001],
];

// The broad shoulder leads into a rounded, swept tip.
// Each station is [x, y, leadingEdgeZ, trailingEdgeZ].
const WING_PROFILE = [
  [WING_ROOT_X, 0.002, 0.017, -0.029],
  [0.033, 0.005, 0.023, -0.038],
  [0.059, 0.008, 0.019, -0.046],
  [0.085, 0.007, 0.007, -0.053],
  [0.106, 0.004, -0.007, -0.055],
  [0.119, 0.002, -0.02, -0.052],
  [WING_TIP_X, 0.001, -0.035, -0.044],
];

function createMigrationGooseGeometry() {
  const positions = [];
  const wingSides = [];
  const indices = [];
  const vertex = (x, y, z, wingSide = 0) => {
    positions.push(x, y, z);
    wingSides.push(wingSide);
  };
  const quad = (a, b, c, d) => indices.push(a, b, c, a, c, d);

  for (const [z, centerY, width, height] of BODY_PROFILE) {
    for (let side = 0; side < BODY_SIDES; side++) {
      const angle = (side / BODY_SIDES) * Math.PI * 2;
      vertex(Math.cos(angle) * width, centerY + Math.sin(angle) * height, z);
    }
  }
  for (let ring = 0; ring < BODY_PROFILE.length - 1; ring++) {
    const start = ring * BODY_SIDES;
    for (let side = 0; side < BODY_SIDES; side++) {
      const a = start + side;
      const b = start + ((side + 1) % BODY_SIDES);
      quad(a, b, b + BODY_SIDES, a + BODY_SIDES);
    }
  }
  const head = (BODY_PROFILE.length - 1) * BODY_SIDES;
  for (let side = 1; side < BODY_SIDES - 1; side++) {
    indices.push(0, side + 1, side, head, head + side, head + side + 1);
  }

  for (const side of [-1, 1]) {
    const start = wingSides.length;
    for (const [x, y, leading, trailing] of WING_PROFILE) {
      vertex(x * side, y, leading, side);
      vertex(x * side, y + 0.004, leading * 0.6 + trailing * 0.4, side);
      vertex(x * side, y - 0.002, trailing, side);
    }
    for (let station = 0; station < WING_PROFILE.length - 1; station++) {
      const a = start + station * 3;
      quad(a, a + 1, a + 4, a + 3);
      quad(a + 1, a + 2, a + 5, a + 4);
    }
  }

  const geometry = new ThreeBufferGeometry();
  geometry.setAttribute(
    "position",
    new ThreeFloat32BufferAttribute(positions, 3),
  );
  geometry.setAttribute(
    "aGooseWingSide",
    new ThreeFloat32BufferAttribute(wingSides, 1),
  );
  geometry.setIndex(indices);
  geometry.computeBoundingSphere();
  return geometry;
}

function createMigrationGooseMaterial() {
  const material = new ThreeMeshBasicMaterial({
    color: 0x2e2220,
    side: ThreeDoubleSide,
  });
  material.name = "migration-goose-silhouette";
  bindMapClipping(material);
  const clipShader = material.onBeforeCompile;
  const clipProgramKey = material.customProgramCacheKey();
  material.onBeforeCompile = (shader) => {
    clipShader(shader);
    shader.vertexShader =
      `attribute float aGooseWingSide;
attribute vec2 aGooseFlap; // phase, amplitude in radians
` +
      shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
if (abs(aGooseWingSide) > 0.5) {
  vec2 hinge = vec2(${WING_ROOT_X} * aGooseWingSide, 0.002);
  vec2 wing = transformed.xy - hinge;
  float span = abs(wing.x) / ${WING_TIP_X - WING_ROOT_X};
  float lag = 0.65 * smoothstep(0.35, 1.0, span);
  float angle = (0.10 + sin(aGooseFlap.x - lag) * aGooseFlap.y) * aGooseWingSide;
  float c = cos(angle);
  float s = sin(angle);
  transformed.xy = hinge + mat2(c, s, -s, c) * wing;
}`,
      );
  };
  material.customProgramCacheKey = () => `wg-migration-goose-${clipProgramKey}`;
  return material;
}

export { createMigrationGooseGeometry, createMigrationGooseMaterial };
