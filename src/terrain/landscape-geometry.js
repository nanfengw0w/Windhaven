import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import {
  buildTerrainSurfaceGeometry,
  buildTerrainSoilSkirtGeometry,
} from "./mesh-geometry.js";

// One indexed surface spans the whole map. Original vertices, normals and
// triangulation remain embedded in its center instead of forming another mesh.
function buildLandscapeGeometry(core, sideSegmentsX, sideSegmentsZ) {
  const nz = core.nz + 2 * sideSegmentsZ;
  const inset = 0.004;
  const x0 = -LANDSCAPE_BOUNDS.halfW + inset;
  const x1 = LANDSCAPE_BOUNDS.halfW - inset;
  const z0 = -LANDSCAPE_BOUNDS.halfD + inset;
  const z1 = LANDSCAPE_BOUNDS.halfD - inset;
  const axis = (count, extra, low, high, coreStep, getCore) => {
    const values = new Float32Array(count + 2 * extra);
    const start = getCore(0);
    const end = getCore(count - 1);
    // Three adjacent cells retain the core spacing. Ease toward a constant
    // outer spacing without adding vertices or stretching the distant rim.
    const weights = Array.from({ length: extra }, (_, i) => {
      const t = Math.min(1, Math.max(0, (i - 2) / Math.ceil(extra * 0.6)));
      return t * t * (3 - 2 * t);
    });
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    const extend = (distance, put) => {
      const outerStep =
        (distance - coreStep * (extra - totalWeight)) / totalWeight;
      let offset = 0;
      for (let i = 0; i < extra; i++) {
        offset += coreStep + (outerStep - coreStep) * weights[i];
        put(i, i === extra - 1 ? distance : offset);
      }
    };
    extend(start - low, (i, distance) => {
      values[extra - 1 - i] = start - distance;
    });
    extend(high - end, (i, distance) => {
      values[extra + count + i] = end + distance;
    });
    for (let i = 0; i < count; i++) values[extra + i] = getCore(i);
    return values;
  };
  let xs = axis(
    core.nx,
    sideSegmentsX,
    x0,
    x1,
    core.dx,
    (i) => core.pos[i * 3],
  );
  const zs = axis(
    core.nz,
    sideSegmentsZ,
    z0,
    z1,
    core.dz,
    (i) => core.pos[i * core.nx * 3 + 2],
  );
  // Low detail's distant X cells used to bridge over small house clearings,
  // leaving the rendered hillside above otherwise correctly seated walls.
  // Refine only the village's outer X interval; every core coordinate and
  // triangle stays at its original index offset, and higher tiers are intact.
  if (core.dx > 0.06) {
    const refined = [xs[0]];
    for (let index = 1; index < xs.length; index++) {
      const a = xs[index - 1],
        b = xs[index];
      const divisions = a < 10.5 && b > 7 ? Math.ceil((b - a) / 0.05) : 1;
      for (let part = 1; part <= divisions; part++)
        refined.push(part === divisions ? b : a + ((b - a) * part) / divisions);
    }
    xs = new Float32Array(refined);
  }
  const nx = xs.length;
  const pos = new Float32Array(nx * nz * 3);
  const nrm = new Float32Array(pos.length);
  for (let z = 0; z < nz; z++) {
    for (let x = 0; x < nx; x++) {
      const offset = (z * nx + x) * 3;
      const cx = x - sideSegmentsX;
      const cz = z - sideSegmentsZ;
      if (cx >= 0 && cx < core.nx && cz >= 0 && cz < core.nz) {
        const original = (cz * core.nx + cx) * 3;
        pos.set(core.pos.subarray(original, original + 3), offset);
        nrm.set(core.nrm.subarray(original, original + 3), offset);
        continue;
      }
      const wx = xs[x];
      const wz = zs[z];
      const dx =
        (terrainHeight(wx + core.dx, wz) - terrainHeight(wx - core.dx, wz)) /
        (2 * core.dx);
      const dz =
        (terrainHeight(wx, wz + core.dz) - terrainHeight(wx, wz - core.dz)) /
        (2 * core.dz);
      const length = Math.hypot(dx, 1, dz);
      pos.set([wx, terrainHeight(wx, wz), wz], offset);
      nrm.set([-dx / length, 1 / length, -dz / length], offset);
    }
  }
  const grid = { nx, nz, segX: nx - 1, segZ: nz - 1, x0, x1, z0, z1, pos, nrm };
  return {
    grid,
    surface: buildTerrainSurfaceGeometry(grid),
    skirt: buildTerrainSoilSkirtGeometry(grid),
    coreOffsetX: sideSegmentsX,
    coreOffsetZ: sideSegmentsZ,
  };
}

export { buildLandscapeGeometry };
