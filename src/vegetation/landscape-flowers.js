// Flower placement and bounds for the surrounding meadow.
import {
  ThreeBox3,
  ThreeSphere,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS, TERRARIUM_BOUNDS } from "../core/config.js";
import { createSeededRandom, lerp, smoothstep } from "../core/math.js";
import { landmarkPlantClearance } from "../layout/world-layout.js";
import { farmObjectClearance } from "../layout/farm-layout.js";
import {
  sampleWoodworkingGround,
  woodlandYardObjectClearance,
} from "../layout/woodworking-layout.js";
import {
  hikingObjectClearance,
  sampleHikingGround,
} from "../layout/hiking-layout.js";
import {
  ruinGroundcoverClearance,
  sampleRuinsGround,
} from "../layout/mountain-ruins-layout.js";
import {
  terrainHeight,
  terrainNormal,
  waterDistance,
} from "../simulation/terrain-shape.js";
import { vegetationPlacementNoise } from "./tree-placement.js";
function inExtension(x, z, margin = 0) {
  return (
    (Math.abs(x) > TERRARIUM_BOUNDS.halfW + margin ||
      Math.abs(z) > TERRARIUM_BOUNDS.halfD + margin) &&
    Math.abs(x) < LANDSCAPE_BOUNDS.halfW - margin - 0.08 &&
    Math.abs(z) < LANDSCAPE_BOUNDS.halfD - margin - 0.08
  );
}
function generateLandscapeFlowers(count, plants, rocks) {
  const random = createSeededRandom(6022104);
  const root = new Float32Array(count * 4);
  const shape = new Float32Array(count * 4);
  const tint = new Float32Array(count * 4);
  const normal = new ThreeVector3();
  // Match the original meadow's six species, rather than enlarging the flowers
  // to make them visible. Only the outer habitat and sparse budget differ.
  const headSizes = [0.024, 0.02, 0.022, 0.016, 0.026, 0.022];
  const heights = [0.07, 0.085, 0.1, 0.05, 0.11, 0.1];
  let accepted = 0;
  for (let attempt = 0; accepted < count && attempt < count * 25; attempt++) {
    const x = lerp(-LANDSCAPE_BOUNDS.halfW, LANDSCAPE_BOUNDS.halfW, random());
    const z = lerp(-LANDSCAPE_BOUNDS.halfD, LANDSCAPE_BOUNDS.halfD, random());
    if (!inExtension(x, z, 0.035) || landmarkPlantClearance(x, z) < 0.15)
      continue;
    const water = waterDistance(x, z);
    if (water < 0.08) continue;
    const y = terrainHeight(x, z);
    terrainNormal(x, z, normal);
    const patch = vegetationPlacementNoise.noise2(x * 0.7 + 1.3, z * 0.7 - 4.1);
    let density =
      smoothstep(0.8, 0.96, normal.y) *
      smoothstep(2.2, 1.05, y) *
      smoothstep(0.08, 0.3, water) *
      (0.55 + 0.45 * smoothstep(-0.35, 0.3, patch));
    density *= smoothstep(-0.05, 0.45, patch);
    if (random() > density) continue;
    if (
      rocks.some(
        (rock) =>
          Math.hypot(rock.x - x, rock.z - z) <
          (rock.radius ?? rock.r ?? 0) * 1.15 + 0.06,
      )
    )
      continue;
    let shade = 0;
    let touchesStem = false;
    for (const plant of plants) {
      const distance = Math.hypot(plant.x - x, plant.z - z);
      if (distance < plant.radius * 0.3 + 0.05) touchesStem = true;
      if (distance < plant.radius)
        shade = Math.max(shade, 1 - distance / plant.radius);
    }
    if (touchesStem || random() < shade * 0.95) continue;
    let species = Math.min(
      5,
      Math.max(
        0,
        Math.floor(
          (vegetationPlacementNoise.noise2(x * 0.55 + 9.1, z * 0.55 - 3.3) *
            0.5 +
            0.5) *
            6,
        ),
      ),
    );
    if (random() < 0.22) species = Math.floor(random() * 6);
    const offset = accepted * 4;
    root.set([x, y - 0.003, z, random()], offset);
    shape.set(
      [
        heights[species] * lerp(0.7, 1.25, random()),
        headSizes[species] * lerp(0.8, 1.2, random()),
        species,
        random() * Math.PI * 2,
      ],
      offset,
    );
    accepted++;
  }
  // Keep meadow flowers inside the field for its resting season. Only props
  // permanently clear plants; the shader handles their seasonal retreat.
  let retained = 0;
  const yardGround = {};
  const hikingGround = {};
  const ruinsGround = {};
  for (let index = 0; index < accepted; index++) {
    const source = index * 4;
    const x = root[source];
    const z = root[source + 2];
    const clearance = farmObjectClearance(x, z);
    if (root[source + 3] >= smoothstep(0.06, 0.22, clearance)) continue;
    if (woodlandYardObjectClearance(x, z) < 0.06) continue;
    sampleWoodworkingGround(x, z, yardGround);
    if (root[source + 3] < smoothstep(0.03, 0.55, yardGround.coverage))
      continue;
    if (hikingObjectClearance(x, z) < 0.04) continue;
    sampleHikingGround(x, z, hikingGround);
    if (root[source + 3] < smoothstep(0.06, 0.65, hikingGround.coverage))
      continue;
    if (ruinGroundcoverClearance(x, z) < 0.04) continue;
    sampleRuinsGround(x, z, ruinsGround);
    if (root[source + 3] < ruinsGround.pathCoverage * 0.8) continue;
    const target = retained * 4;
    root.copyWithin(target, source, source + 4);
    shape.copyWithin(target, source, source + 4);
    retained++;
  }
  return {
    root: root.subarray(0, retained * 4),
    shape: shape.subarray(0, retained * 4),
    tint: tint.subarray(0, retained * 4),
    count: retained,
  };
}

// Small batches let the renderer cull grass outside a close camera view.

function setLandscapeCulling(mesh) {
  const min = new ThreeVector3(
    -LANDSCAPE_BOUNDS.halfW,
    LANDSCAPE_BOUNDS.bottomY - 0.3,
    -LANDSCAPE_BOUNDS.halfD,
  );
  const max = new ThreeVector3(
    LANDSCAPE_BOUNDS.halfW,
    LANDSCAPE_BOUNDS.topY,
    LANDSCAPE_BOUNDS.halfD,
  );
  mesh.geometry.boundingBox = new ThreeBox3(min, max);
  mesh.geometry.boundingSphere = mesh.geometry.boundingBox.getBoundingSphere(
    new ThreeSphere(),
  );
}
export { inExtension, generateLandscapeFlowers, setLandscapeCulling };
