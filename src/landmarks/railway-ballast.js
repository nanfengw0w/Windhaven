import {
  ThreeBufferGeometry,
  ThreeFloat32BufferAttribute,
} from "../vendor/three-runtime.js";

// Track-relative dimensions: the crown meets the sleeper bottoms and the toe
// meets the existing viaduct deck. Rails and rolling-stock heights stay intact.
const BALLAST_PROFILE = Object.freeze({
  width: 0.5,
  height: 0.11,
  centerY: -0.105,
  topY: -0.05,
  bottomY: -0.16,
  topWidthRatio: 0.686,
});

const CROSS_SECTION = [
  [-0.5, -0.5],
  [-0.343, 0.445],
  [-0.16, 0.485],
  [0, 0.5],
  [0.16, 0.48],
  [0.343, 0.445],
  [0.5, -0.5],
];

function appendTriangle(positions, a, b, c, outward) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const nx = ab[1] * ac[2] - ab[2] * ac[1];
  const ny = ab[2] * ac[0] - ab[0] * ac[2];
  const nz = ab[0] * ac[1] - ab[1] * ac[0];
  if (nx * outward[0] + ny * outward[1] + nz * outward[2] < 0) {
    positions.push(...a, ...c, ...b);
  } else {
    positions.push(...a, ...b, ...c);
  }
}

function finishGeometry(name, positions) {
  const geometry = new ThreeBufferGeometry();
  geometry.name = name;
  geometry.setAttribute(
    "position",
    new ThreeFloat32BufferAttribute(positions, 3),
  );
  // Local UVs are available for compatible materials; the shared weather and
  // gravel shaders can continue using world-space coordinates without seams.
  const uvs = [];
  for (let index = 0; index < positions.length; index += 3) {
    uvs.push(positions[index] + 0.5, positions[index + 2] + 0.5);
  }
  geometry.setAttribute("uv", new ThreeFloat32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

// One reusable, unit-length section for the existing instanced batch. The
// crown and sloped shoulders replace the old rectangular ballast box.
function createRailwayBallastGeometry() {
  const sections = [];
  for (let index = 0; index < 5; index++) {
    const t = index / 4;
    const taper = Math.sin(t * Math.PI);
    sections.push(
      CROSS_SECTION.map(([x, y], corner) => {
        const toe = corner === 0 || corner === CROSS_SECTION.length - 1;
        const side = Math.sign(x);
        const lateral =
          side * taper * 0.012 * Math.sin(index * 2.17 + corner * 1.31);
        const relief = toe
          ? 0
          : taper * 0.026 * Math.sin(index * 1.73 + corner * 2.21);
        return [
          Math.max(-0.5, Math.min(0.5, x + lateral)),
          Math.min(0.5, y + relief),
          t - 0.5,
        ];
      }),
    );
  }
  const positions = [];
  for (let index = 1; index < sections.length; index++) {
    const previous = sections[index - 1];
    const current = sections[index];
    for (let corner = 0; corner < CROSS_SECTION.length; corner++) {
      const next = (corner + 1) % CROSS_SECTION.length;
      const a = previous[corner];
      const b = previous[next];
      const c = current[next];
      const d = current[corner];
      const outward = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0];
      appendTriangle(positions, a, b, c, outward);
      appendTriangle(positions, a, c, d, outward);
    }
  }
  for (const index of [0, sections.length - 1]) {
    const ring = sections[index];
    const z = ring[0][2];
    const center = [0, -0.1, z];
    const outward = [0, 0, Math.sign(z)];
    for (let corner = 0; corner < ring.length; corner++) {
      appendTriangle(
        positions,
        center,
        ring[corner],
        ring[(corner + 1) % ring.length],
        outward,
      );
    }
  }
  const geometry = finishGeometry("railway-ballast-sloped-section", positions);
  geometry.userData.ballastProfile = BALLAST_PROFILE;
  geometry.userData.triangles = positions.length / 9;
  return geometry;
}

// Ten faces keep a few visible shoulder stones inexpensive. Different scales
// and rotations produce angular chips rather than identical rounded pebbles.
function createRailwayBallastStoneGeometry() {
  const ring = [
    [0.5, 0.08, 0],
    [0.2, -0.04, 0.48],
    [-0.4, 0.03, 0.31],
    [-0.46, -0.07, -0.25],
    [0.15, 0.05, -0.5],
  ];
  const top = [0.08, 0.5, 0.03];
  const bottom = [-0.05, -0.5, -0.06];
  const positions = [];
  for (let index = 0; index < ring.length; index++) {
    const next = (index + 1) % ring.length;
    appendTriangle(positions, top, ring[index], ring[next], [0, 1, 0]);
    appendTriangle(positions, bottom, ring[next], ring[index], [0, -1, 0]);
  }
  return finishGeometry("railway-ballast-angular-chip", positions);
}

function profileSurfaceHeight(x) {
  const across = Math.abs(x) / BALLAST_PROFILE.width;
  const shoulder = Math.max(0, Math.min(1, (across - 0.343) / 0.157));
  return (
    BALLAST_PROFILE.centerY +
    BALLAST_PROFILE.height * (0.445 - 0.945 * shoulder)
  );
}

// Call once per visible track section while building the existing batches.
// The callback receives a reused object; consume its transform immediately.
// All coordinates are relative to the original rail frame, not the bed center.
function forEachRailwayBallastStone(
  sectionIndex,
  sectionLength,
  callback,
  count = 6,
) {
  let state = (Math.imul(sectionIndex + 1, 747796405) + 2891336453) >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const sample = {};
  for (let index = 0; index < count; index++) {
    const shoulder = index % 3 !== 2;
    const side = index % 2 ? -1 : 1;
    sample.x = shoulder
      ? side * (0.183 + random() * 0.053)
      : (random() - 0.5) * 0.12;
    sample.z = shoulder
      ? (random() - 0.5) * sectionLength * 0.9
      : side * Math.min(sectionLength * 0.43, 0.043 + random() * 0.009);
    sample.sx = 0.009 + random() * 0.008;
    sample.sy = 0.007 + random() * 0.006;
    sample.sz = 0.008 + random() * 0.009;
    // Mostly embedded: these add a broken shoulder silhouette and scattered
    // chips, while the material supplies the much denser fine gravel grain.
    sample.y = profileSurfaceHeight(sample.x) + sample.sy * 0.08;
    sample.rx = (random() - 0.5) * 0.7;
    sample.ry = random() * Math.PI * 2;
    sample.rz = (random() - 0.5) * 0.7;
    callback(sample);
  }
  return count;
}

export {
  BALLAST_PROFILE,
  createRailwayBallastGeometry,
  createRailwayBallastStoneGeometry,
  forEachRailwayBallastStone,
};
