import { ThreeBoxGeometry } from "../vendor/three-runtime.js";

// A shared stone with softened arrises: a flat central tread and small worn
// corners. Instance scaling keeps the existing step heights and safe footing.
function createDressedStoneGeometry() {
  const geometry = new ThreeBoxGeometry(1, 1, 1, 3, 3, 3);
  const positions = geometry.getAttribute("position");
  const bevel = 0.055;
  const core = 0.5 - bevel;
  for (let index = 0; index < positions.count; index++) {
    const point = [
      positions.getX(index),
      positions.getY(index),
      positions.getZ(index),
    ];
    const inner = point.map((value) => Math.max(-core, Math.min(core, value)));
    const delta = point.map((value, axis) => value - inner[axis]);
    const length = Math.hypot(...delta);
    positions.setXYZ(
      index,
      inner[0] + (delta[0] / length) * bevel,
      inner[1] + (delta[1] / length) * bevel,
      inner[2] + (delta[2] / length) * bevel,
    );
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.name = "worn-stone-tread";
  return geometry;
}

export { createDressedStoneGeometry };
