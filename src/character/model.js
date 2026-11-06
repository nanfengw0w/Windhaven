import { Ry } from "../vendor/three-runtime.js";
import { CharacterGLTFLoader } from "./gltf-loader.js";

const CHARACTER_MODEL_HEIGHT = 0.2;
// The inspected Lux3D rig faces +Z; the exploration actor faces -Z at yaw 0.
// Keep this correction on a wrapper, outside the animated source transforms.
const CHARACTER_MODEL_YAW = Math.PI;
const CHARACTER_ANIMATION_NAMES = [
  "Idle_Loop",
  "Idle_Crossed_Loop",
  "Swim_Loop",
  "Walk_Loop",
  "Held_Loop",
];
const CHARACTER_MODEL_URL = new URL(
  "../../assets/characters/traveler.glb",
  import.meta.url,
);

function prepareCharacterModel(gltf, yaw = CHARACTER_MODEL_YAW) {
  if (!gltf.scene?.isObject3D) {
    throw new Error("人物 GLB 中没有可用场景。");
  }
  const animations = gltf.animations ?? [];
  const missing = CHARACTER_ANIMATION_NAMES.filter(
    (name) =>
      !animations.some((clip) => clip.name === name && clip.tracks.length),
  );
  if (missing.length) {
    throw new Error(`人物 GLB 缺少有效动作：${missing.join("、")}。`);
  }
  const profile = gltf.asset?.extras?.windhavenCharacterProfile;
  if (
    !profile ||
    profile.normalizedHeight !== CHARACTER_MODEL_HEIGHT ||
    !Number.isFinite(profile.swimWaterlineY) ||
    CHARACTER_ANIMATION_NAMES.some(
      (name) => !Number.isFinite(profile.clipGroundOffsets?.[name]),
    )
  ) {
    throw new Error("人物 GLB 缺少有效的动作脚底和游泳水线配置。");
  }

  let skinnedMeshes = 0;
  gltf.scene.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
    object.frustumCulled = false;
    if (
      object.isSkinnedMesh &&
      object.skeleton?.bones.length &&
      object.geometry.getAttribute("skinIndex") &&
      object.geometry.getAttribute("skinWeight")
    ) {
      skinnedMeshes += 1;
    }
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    for (const material of materials) {
      // Use cutouts for alpha-blended source materials so the character also
      // participates in the opaque scene-depth and reflection passes.
      if (material.transparent) {
        material.alphaTest = Math.max(material.alphaTest, 0.5);
      }
      material.transparent = false;
      material.opacity = 1;
      material.depthWrite = true;
      material.depthTest = true;
      material.alphaToCoverage = false;
      if ("transmission" in material) material.transmission = 0;
      material.needsUpdate = true;
    }
  });
  if (!skinnedMeshes) {
    throw new Error("人物 GLB 没有有效的骨架和蒙皮网格。");
  }

  const root = new Ry.Group();
  root.name = "Traveler";
  // Animation-dependent sole/waterline correction belongs to the visual model,
  // independently of the navigation actor and the source animation channels.
  const visualRoot = new Ry.Group();
  visualRoot.name = "TravelerVisualOffset";
  root.add(visualRoot);
  const normalized = new Ry.Group();
  normalized.name = "TravelerModelTransform";
  normalized.rotation.y = yaw;
  normalized.add(gltf.scene);
  visualRoot.add(normalized);
  root.updateMatrixWorld(true);

  const bounds = new Ry.Box3().setFromObject(normalized, true);
  const height = bounds.max.y - bounds.min.y;
  if (
    bounds.isEmpty() ||
    !Number.isFinite(height) ||
    height <= 0 ||
    !bounds.min.toArray().every(Number.isFinite) ||
    !bounds.max.toArray().every(Number.isFinite)
  ) {
    throw new Error("人物 GLB 的模型尺寸无效。");
  }
  const scale = CHARACTER_MODEL_HEIGHT / height;
  const center = bounds.getCenter(new Ry.Vector3());
  normalized.scale.setScalar(scale);
  normalized.position.set(
    -center.x * scale,
    -bounds.min.y * scale,
    -center.z * scale,
  );
  root.updateMatrixWorld(true);
  return { root, animations, visualRoot, profile };
}

async function loadCharacterModel() {
  try {
    const gltf = await new CharacterGLTFLoader().loadAsync(
      CHARACTER_MODEL_URL.href,
    );
    return prepareCharacterModel(gltf);
  } catch (error) {
    throw new Error(
      `无法加载旅行者骨骼模型：${error.message || String(error)}`,
      { cause: error },
    );
  }
}

export {
  CHARACTER_MODEL_HEIGHT,
  CHARACTER_MODEL_YAW,
  loadCharacterModel,
  prepareCharacterModel,
};
