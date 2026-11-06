import {
  ThreeBufferGeometry,
  ThreeFloat32BufferAttribute,
} from "../vendor/three-runtime.js";

// A wheat clump uses folded leaves and a faceted ear, rather than a mesh for
// every grain. Density makes the field readable without expensive kernels.
function createCropGeometry() {
  const positions = [],
    colors = [],
    parts = [],
    anchors = [];
  const stemColor = [0.16, 0.26, 0.055];
  const leafColor = [0.085, 0.22, 0.035];
  const grainColor = [0.37, 0.39, 0.105];
  function triangle(a, b, c, color, part, anchor) {
    positions.push(...a, ...b, ...c);
    for (let vertex = 0; vertex < 3; vertex++) {
      colors.push(...color);
      parts.push(part);
      anchors.push(...anchor);
    }
  }
  for (let stalk = 0; stalk < 3; stalk++) {
    const angle = stalk * 2.4;
    const x = Math.cos(angle) * 0.026;
    const z = Math.sin(angle) * 0.026;
    const height = 0.27 + stalk * 0.022;
    const anchor = [x, height, z];
    for (let plane = 0; plane < 2; plane++) {
      const dx = plane === 0 ? 0.0022 : 0;
      const dz = plane === 1 ? 0.0022 : 0;
      for (let segment = 0; segment < 3; segment++) {
        const y0 = (height * segment) / 3;
        const y1 = (height * (segment + 1)) / 3;
        const a = [x - dx, y0, z - dz],
          b = [x + dx, y0, z + dz];
        const c = [x + dx, y1, z + dz],
          d = [x - dx, y1, z - dz];
        triangle(a, b, c, stemColor, 0, anchor);
        triangle(a, c, d, stemColor, 0, anchor);
      }
    }
    for (let blade = 0; blade < 3; blade++) {
      const yaw = angle + blade * 2.4;
      const cos = Math.cos(yaw),
        sin = Math.sin(yaw);
      const baseY = height * (0.17 + blade * 0.2);
      const point = (t, side) => {
        const width = Math.sin(Math.PI * t) * 0.0085 * side;
        return [
          x + cos * t * 0.095 - sin * width,
          baseY + t * 0.066 - t * t * 0.083 + Math.abs(width) * 0.35,
          z + sin * t * 0.095 + cos * width,
        ];
      };
      for (let segment = 0; segment < 3; segment++) {
        const t = segment / 3,
          next = (segment + 1) / 3;
        for (const side of [-1, 1]) {
          triangle(
            point(t, 0),
            point(next, 0),
            point(t, side),
            leafColor,
            1,
            anchor,
          );
          triangle(
            point(t, side),
            point(next, 0),
            point(next, side),
            leafColor,
            1,
            anchor,
          );
        }
      }
    }
    const rings = [
      [-0.009, 0.003],
      [0.007, 0.012],
      [0.037, 0.008],
      [0.059, 0],
    ];
    for (let ring = 0; ring < rings.length - 1; ring++) {
      const point = (index, side) => {
        const [y, radius] = rings[index];
        const yaw = (side * Math.PI) / 2 + angle;
        return [
          x + Math.cos(yaw) * radius,
          height + y,
          z + Math.sin(yaw) * radius * 0.7,
        ];
      };
      for (let side = 0; side < 4; side++) {
        const tint = grainColor.map((value) => value * (side % 2 ? 0.9 : 1.06));
        triangle(
          point(ring, side),
          point(ring + 1, side),
          point(ring, side + 1),
          tint,
          2,
          anchor,
        );
        triangle(
          point(ring, side + 1),
          point(ring + 1, side),
          point(ring + 1, side + 1),
          tint,
          2,
          anchor,
        );
      }
    }
    for (const side of [-1, 0, 1]) {
      const yaw = angle + side * 0.55;
      const dx = Math.cos(yaw),
        dz = Math.sin(yaw);
      const a = [x + dx * side * 0.007, height + 0.025, z + dz * side * 0.007];
      const b = [
        a[0] + dx * side * 0.015,
        height + 0.078 - Math.abs(side) * 0.007,
        a[2] + dz * side * 0.015,
      ];
      triangle(
        a,
        b,
        [a[0] - dz * 0.0012, a[1], a[2] + dx * 0.0012],
        grainColor,
        2,
        anchor,
      );
    }
  }
  const geometry = new ThreeBufferGeometry();
  geometry.setAttribute(
    "position",
    new ThreeFloat32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new ThreeFloat32BufferAttribute(colors, 3));
  geometry.setAttribute("aCropPart", new ThreeFloat32BufferAttribute(parts, 1));
  geometry.setAttribute(
    "aCropAnchor",
    new ThreeFloat32BufferAttribute(anchors, 3),
  );
  geometry.computeVertexNormals();
  return geometry;
}

export { createCropGeometry };
