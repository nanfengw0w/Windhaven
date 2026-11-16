import { Ry } from "../src/vendor/three-runtime.js";
import { CharacterGLTFLoader } from "../src/character/gltf-loader.js";
import { patchAholoWeatherMaterial } from "../src/generation/aholo-weather-material.js";
import {
  MODEL_ASSETS,
  bindImportedWeather,
  parseImportedMesh,
} from "../src/landmarks/imported-models.js";
import { COMMON_GLSL } from "../src/render/shared-shaders.js";

const PROJECT_LABELS = {
  "house-long": "长屋",
  "house-inn": "旅店",
  "house-tall": "高屋",
  cottage: "木屋",
  clocktower: "钟楼",
  station: "站房",
  coach: "火车车厢",
  locomotive: "火车车头",
};
const PROJECT_MODELS = [
  ...MODEL_ASSETS.map((asset) => ({
    id: asset.id,
    label: PROJECT_LABELS[asset.id] || asset.id,
    kind: "mesh",
    group: "project",
    meshUrl: asset.mesh.href,
    textureUrl: asset.texture.href,
    glowUrl: asset.glow?.href,
    vehicle: asset.vehicle,
  })),
  ...[
    ["scarecrow", "稻草人"],
    ["mountain-ruin", "山间遗迹"],
  ].map(([id, label]) => ({
    id,
    label,
    kind: "mesh",
    group: "project",
    meshUrl: `/assets/imported-models/${id}.mesh`,
    textureUrl: `/assets/imported-models/${id}.webp`,
  })),
];
const BUNDLED_GENERATED = [
  {
    id: "aholo-kongming",
    label: "孔明灯",
    kind: "glb",
    group: "generated",
    url: "/assets/sky-lantern/aholo-kongming.glb",
    glowUrl: "/assets/sky-lantern/aholo-kongming.glow.webp",
  },
  {
    id: "ceramic-cat",
    label: "守山灵猫 · 内置示例",
    kind: "glb",
    group: "generated",
    url: "/generated/examples/ceramic-cat/model.glb",
    height: 0.9,
  },
];
const CACHED_LABELS = {
  5031025: "太阳",
  5030710: "人物头像",
  4889009: "石灯",
  4883683: "引雷地标",
  4881394: "猫",
};
const ROLE_LABELS = {
  guardian: "静态摆件",
  lantern: "夜间照明",
  wind: "随风转向",
  shrine: "引雷地标",
};
const gltfLoader = new CharacterGLTFLoader();
const textureLoader = new Ry.TextureLoader();

async function loadToolModels() {
  let cached = [];
  try {
    const response = await fetch("/api/models", {
      signal: AbortSignal.timeout(4000),
    });
    if (response.ok) {
      const result = await response.json();
      if (Array.isArray(result)) cached = result;
    }
  } catch {
    // Standalone tools still open their packaged assets if the API is offline.
  }
  const generated = cached
    .filter((model) => /^\/api\/assets\/[^?#]+\.glb$/i.test(model?.modelUrl))
    .map(({ id, taskId, role, modelUrl, meta }) => {
      const name = CACHED_LABELS[taskId] || ROLE_LABELS[role] || "生成模型";
      return {
        id: String(taskId ?? id),
        label: taskId ? `${name} #${taskId}` : name,
        kind: "glb",
        group: "generated",
        url: modelUrl,
        height: meta?.height,
      };
    });
  return [...PROJECT_MODELS, ...generated, ...BUNDLED_GENERATED];
}

async function loadToolModel(model) {
  if (model.kind === "glb") {
    const { scene } = await gltfLoader.loadAsync(model.url);
    if (!scene) throw new Error("模型没有可显示的场景。");
    return scene;
  }

  const response = await fetch(model.meshUrl);
  if (!response.ok) throw new Error(`网格加载失败（${response.status}）`);
  const geometry = parseImportedMesh(await response.arrayBuffer(), model.id);
  try {
    const texture = await textureLoader.loadAsync(model.textureUrl);
    texture.colorSpace = Ry.SRGBColorSpace;
    texture.flipY = false;
    texture.needsUpdate = true;
    return new Ry.Mesh(
      geometry,
      new Ry.MeshStandardMaterial({
        map: texture,
        roughness: model.vehicle ? 0.68 : 0.86,
        metalness: model.vehicle ? 0.1 : 0,
      }),
    );
  } catch (error) {
    geometry.dispose();
    throw error;
  }
}

function patchToolSnowMaterial(material, model, uniforms) {
  if (model.kind === "mesh") {
    bindImportedWeather(material, { GLSL_COMMON: COMMON_GLSL, uniforms });
  } else {
    patchAholoWeatherMaterial(material, uniforms);
  }
}

export { loadToolModel, loadToolModels, patchToolSnowMaterial };
