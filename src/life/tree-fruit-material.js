import {
  ThreeMeshDepthMaterial,
  ThreeMeshStandardMaterial,
} from "../vendor/three-runtime.js";
import {
  TREE_BENDING_GLSL,
  patchVegetationMaterial,
} from "../vegetation/material-patching.js";

// Attached fruit shares the branch shader exactly; CPU wind approximations are
// only needed once, when an apple detaches and enters the falling simulation.
const FRUIT_PROJECT_GLSL = `
  vec4 fruitWorld = instanceMatrix * vec4(transformed, 1.0);
  if (aAttachment.w > 0.5) {
    fruitWorld.xyz += vegTreeDisplace(aAttachment.xyz, vegShake(), vec3(0.0), 0.0, 0.0);
  }
  vec4 mvPosition = modelViewMatrix * fruitWorld;
  gl_Position = projectionMatrix * mvPosition;
`;

function createTreeFruitMaterials(ctx, uniforms) {
  const patch = {
    uniforms,
    vertexHead: TREE_BENDING_GLSL + "\nattribute vec4 aAttachment;\n",
    vertex: {
      project_vertex: FRUIT_PROJECT_GLSL,
      worldpos_vertex: "vec4 worldPosition = modelMatrix * fruitWorld;",
    },
  };
  const material = patchVegetationMaterial(
    new ThreeMeshStandardMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.57,
      metalness: 0,
    }),
    ctx,
    { ...patch, key: "tree-fruit" },
  );
  const depthMaterial = patchVegetationMaterial(
    new ThreeMeshDepthMaterial(),
    ctx,
    { ...patch, key: "tree-fruit-depth" },
  );
  return { material, depthMaterial };
}

export { createTreeFruitMaterials };
