// Instanced rocks for the surrounding woodland.
import {
  ThreeEuler,
  ThreeInstancedBufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeQuaternion,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { WATER_LEVEL_CONFIG } from "../core/config.js";
import {
  lakeEllipse,
  terrainHeight,
  terrainNormal,
} from "../simulation/terrain-shape.js";
import { buildRockVariantGeometry } from "../terrain/rock-geometry-and-placement.js";
import {
  createRockDepthMaterial,
  createRockSurfaceMaterial,
} from "../terrain/rock-materials.js";

function seatRockOnSlope(rock, variant, matrix) {
  // Keep the established placement on gentle ground. On cliffs, the center
  // height alone leaves the downhill underside projecting into empty air.
  if (terrainNormal(rock.x, rock.z).y >= 0.8) return;

  const vertex = new ThreeVector3();
  let bottom = Infinity;
  let top = -Infinity;
  for (let offset = 0; offset < variant.pos.length; offset += 3) {
    vertex.fromArray(variant.pos, offset).applyMatrix4(matrix);
    bottom = Math.min(bottom, vertex.y);
    top = Math.max(top, vertex.y);
  }

  // Seat the bottom fifth of the actual rotated variant, not its bounding
  // sphere. The inset also covers the difference between the analytic height
  // and the triangulated terrain at the three supported mesh resolutions.
  const baseTop = bottom + (top - bottom) * 0.2;
  let drop = 0;
  for (let offset = 0; offset < variant.pos.length; offset += 3) {
    vertex.fromArray(variant.pos, offset).applyMatrix4(matrix);
    if (vertex.y > baseTop) continue;
    drop = Math.max(drop, vertex.y - terrainHeight(vertex.x, vertex.z) + 0.04);
  }
  matrix.elements[13] -= drop;
}

function createLandscapeRocks(ctx, rocks) {
  const { geo, variants } = buildRockVariantGeometry(ctx.quality.pick(0, 1, 1));
  const mesh = new ThreeInstancedMesh(
    geo,
    createRockSurfaceMaterial(ctx),
    rocks.length,
  );
  const blend = new Float32Array(rocks.length * 4);
  const surface = new Float32Array(rocks.length * 4);
  const matrix = new ThreeMatrix4();
  const quaternion = new ThreeQuaternion();
  const position = new ThreeVector3();
  const scale = new ThreeVector3();
  const euler = new ThreeEuler();
  rocks.forEach((rock, index) => {
    const variant = variants[rock.variant];
    const size = rock.radius / variant.rh;
    const height = (variant.ymax - variant.ymin) * size;
    position.set(rock.x, rock.y - height * 0.24 - variant.ymin * size, rock.z);
    quaternion.setFromEuler(euler.set((rock.seed - 0.5) * 0.2, rock.yaw, 0));
    scale.set(size, size, size);
    matrix.compose(position, quaternion, scale);
    seatRockOnSlope(rock, variant, matrix);
    mesh.setMatrixAt(index, matrix);
    const offset = index * 4;
    if (rock.variant > 0) blend[offset + rock.variant - 1] = 1;
    blend[offset + 3] = rock.seed;
    surface[offset] =
      lakeEllipse(rock.x, rock.z) < 1.5 ? WATER_LEVEL_CONFIG.lakeLevel : -10;
    surface[offset + 2] = 0.3 + rock.seed * 0.5;
  });
  geo.setAttribute("aRock", new ThreeInstancedBufferAttribute(blend, 4));
  geo.setAttribute("aRock2", new ThreeInstancedBufferAttribute(surface, 4));
  mesh.name = "landscape-rock-instances";
  mesh.userData.assetSlot = "landscape-rocks";
  mesh.userData.placeholder = true;
  mesh.userData.placements = rocks;
  mesh.customDepthMaterial = createRockDepthMaterial();
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
  // All four procedural variants share one instanced geometry; allow for their shapes.
  mesh.boundingSphere.radius += 0.6;
  return mesh;
}

export { createLandscapeRocks };
