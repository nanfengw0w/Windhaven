import {
  Ry,
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeColor,
  ThreeMeshStandardMaterial,
  ThreeSRGBColorSpace,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { bindWindowGlow } from "../render/window-glow.js";
import { bindMapClipping } from "./map-clipping.js";

// Explicit URLs let Vite include and fingerprint every model in production.
// Lit models carry a hand-curated window-glow atlas (painted from the
// same layout as the color map) so windows can light up at night.
const MODEL_ASSETS = [
  {
    id: "house-long",
    mesh: new URL(
      "../../assets/imported-models/house-long.mesh",
      import.meta.url,
    ),
    texture: new URL(
      "../../assets/imported-models/house-long.webp",
      import.meta.url,
    ),
    glow: new URL(
      "../../assets/imported-models/house-long.glow.webp",
      import.meta.url,
    ),
  },
  {
    id: "house-inn",
    mesh: new URL(
      "../../assets/imported-models/house-inn.mesh",
      import.meta.url,
    ),
    texture: new URL(
      "../../assets/imported-models/house-inn.webp",
      import.meta.url,
    ),
    glow: new URL(
      "../../assets/imported-models/house-inn.glow.webp",
      import.meta.url,
    ),
  },
  {
    id: "house-tall",
    mesh: new URL(
      "../../assets/imported-models/house-tall.mesh",
      import.meta.url,
    ),
    texture: new URL(
      "../../assets/imported-models/house-tall.webp",
      import.meta.url,
    ),
    glow: new URL(
      "../../assets/imported-models/house-tall.glow.webp",
      import.meta.url,
    ),
  },
  {
    id: "cottage",
    mesh: new URL("../../assets/imported-models/cottage.mesh", import.meta.url),
    texture: new URL(
      "../../assets/imported-models/cottage.webp",
      import.meta.url,
    ),
    glow: new URL(
      "../../assets/imported-models/cottage.glow.webp",
      import.meta.url,
    ),
  },
  {
    id: "clocktower",
    mesh: new URL(
      "../../assets/imported-models/clocktower.mesh",
      import.meta.url,
    ),
    texture: new URL(
      "../../assets/imported-models/clocktower.webp",
      import.meta.url,
    ),
    glow: new URL(
      "../../assets/imported-models/clocktower.glow.webp",
      import.meta.url,
    ),
  },
  {
    id: "station",
    mesh: new URL("../../assets/imported-models/station.mesh", import.meta.url),
    texture: new URL(
      "../../assets/imported-models/station.webp",
      import.meta.url,
    ),
    glow: new URL(
      "../../assets/imported-models/station.glow.webp",
      import.meta.url,
    ),
  },
  {
    id: "coach",
    mesh: new URL("../../assets/imported-models/coach.mesh", import.meta.url),
    texture: new URL(
      "../../assets/imported-models/coach.webp",
      import.meta.url,
    ),
    glow: new URL(
      "../../assets/imported-models/coach.glow.webp",
      import.meta.url,
    ),
    glowIntensityScale: 0.8,
    vehicle: true,
  },
  {
    id: "locomotive",
    mesh: new URL(
      "../../assets/imported-models/locomotive.mesh",
      import.meta.url,
    ),
    texture: new URL(
      "../../assets/imported-models/locomotive.webp",
      import.meta.url,
    ),
    vehicle: true,
  },
];

function parseImportedMesh(buffer, id = "model") {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 16)
    throw new Error(`${id}: truncated WGMS header`);
  const header = new DataView(buffer);
  if (
    header.getUint32(0, false) !== 0x57474d53 ||
    header.getUint32(4, true) !== 1
  )
    throw new Error(`${id}: unsupported WGMS format`);
  const vertexCount = header.getUint32(8, true);
  const indexCount = header.getUint32(12, true);
  const expectedBytes = 16 + vertexCount * 32 + indexCount * 4;
  if (
    !vertexCount ||
    !indexCount ||
    indexCount % 3 !== 0 ||
    expectedBytes !== buffer.byteLength
  )
    throw new Error(`${id}: invalid WGMS buffer lengths`);

  // WGMS v1 stores contiguous position, normal and UV arrays, then indices.
  const positions = new Float32Array(buffer, 16, vertexCount * 3);
  const normals = new Float32Array(
    buffer,
    16 + vertexCount * 12,
    vertexCount * 3,
  );
  const uvs = new Float32Array(buffer, 16 + vertexCount * 24, vertexCount * 2);
  const indices = new Uint32Array(buffer, 16 + vertexCount * 32, indexCount);
  for (const values of [positions, normals, uvs])
    for (const value of values)
      if (!Number.isFinite(value))
        throw new Error(`${id}: non-finite WGMS vertex data`);
  for (const index of indices)
    if (index >= vertexCount) throw new Error(`${id}: WGMS index out of range`);

  const geometry = new ThreeBufferGeometry();
  geometry.name = `imported-${id}`;
  geometry.setAttribute("position", new ThreeBufferAttribute(positions, 3));
  geometry.setAttribute("normal", new ThreeBufferAttribute(normals, 3));
  geometry.setAttribute("uv", new ThreeBufferAttribute(uvs, 2));
  geometry.setIndex(new ThreeBufferAttribute(indices, 1));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function bindImportedWeather(material, ctx) {
  bindMapClipping(material, ctx);
  if (!ctx.GLSL_COMMON) return;
  const compileClipping = material.onBeforeCompile;
  const clippingKey = material.customProgramCacheKey();
  material.onBeforeCompile = (shader, renderer) => {
    compileClipping(shader, renderer);
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <normal_fragment_maps>",
      `#include <normal_fragment_maps>
      vec3 importedWorldNormal = normalize(inverseTransformDirection(normal, viewMatrix));
      vec4 importedGround = groundAt(vMapClipPosition.xz);
      float importedWet = clamp(importedGround.y * 0.7 + importedGround.z * 0.18, 0.0, 1.0);
      float importedSnow = snowCover(vMapClipPosition.xz, importedWorldNormal)
        * smoothstep(0.28, 0.82, importedWorldNormal.y);
      // Frost is driven by cold, even without snowfall. Match the procedural
      // props' pale coating, strongest on exposed hats, shoulders and roofs.
      float importedFrost = importedGround.w
        * smoothstep(-0.3, 0.7, importedWorldNormal.y) * 0.4
        * (1.0 - importedSnow);
      diffuseColor.rgb *= 1.0 - importedWet * 0.14 * (1.0 - importedSnow);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.78, 0.83, 0.9), importedFrost);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.64, 0.68, 0.72), importedSnow * 0.92);
      roughnessFactor = mix(roughnessFactor, max(0.38, roughnessFactor * 0.72), importedWet);
      roughnessFactor = mix(roughnessFactor, max(roughnessFactor, 0.9), importedFrost);
      roughnessFactor = mix(roughnessFactor, 0.84, importedSnow);`,
    );
  };
  material.customProgramCacheKey = () => `${clippingKey}-imported-weather-v2`;
}

function disposeResources(geometries, materials, textures) {
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  const images = new Set();
  for (const texture of textures) {
    texture.dispose();
    if (texture.image) images.add(texture.image);
  }
  // TextureLoader normally uses HTMLImageElement; injected loaders may use bitmaps.
  for (const image of images) image.close?.();
}

/** Load shared resources only on explicit invocation; no scene mutations. */
async function loadImportedModels(ctx, options = {}) {
  const fetchAsset = options.fetch ?? globalThis.fetch;
  if (typeof fetchAsset !== "function")
    throw new Error("Model loading requires fetch");
  const textureLoader = options.textureLoader ?? new Ry.TextureLoader();
  const loadTexture =
    options.loadTexture ?? ((url) => textureLoader.loadAsync(url));
  const maxAnisotropy = ctx.renderer?.capabilities?.getMaxAnisotropy?.() ?? 1;
  const anisotropy = Math.max(1, Math.min(8, maxAnisotropy));
  const models = new Map();
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const results = await Promise.allSettled(
    (options.assets ?? MODEL_ASSETS).map(async (asset) => {
      const response = await fetchAsset(asset.mesh.href);
      if (!response.ok)
        throw new Error(
          `${asset.id}: model request failed (${response.status})`,
        );
      const geometry = parseImportedMesh(
        await response.arrayBuffer(),
        asset.id,
      );
      geometries.add(geometry);
      const texture = await loadTexture(asset.texture.href);
      if (!texture?.isTexture)
        throw new Error(
          `${asset.id}: texture loader returned no Three texture`,
        );
      textures.add(texture);
      texture.name = `imported-${asset.id}-color`;
      texture.colorSpace = ThreeSRGBColorSpace;
      texture.flipY = false;
      texture.anisotropy = anisotropy;
      texture.needsUpdate = true;
      const material = new ThreeMeshStandardMaterial({
        name: `imported-${asset.id}`,
        color: 0xffffff,
        map: texture,
        roughness: asset.vehicle ? 0.68 : 0.86,
        metalness: asset.vehicle ? 0.1 : 0,
      });
      if (asset.glow) {
        // A glow atlas may not exist yet (painted by hand, one model at a
        // time); a missing file simply leaves the model unlit.
        try {
          const glowTexture = await loadTexture(asset.glow.href);
          if (!glowTexture?.isTexture)
            throw new Error("texture loader returned no Three texture");
          textures.add(glowTexture);
          glowTexture.name = `imported-${asset.id}-glow`;
          bindWindowGlow(material, glowTexture, asset.glowIntensityScale);
        } catch {
          textures.delete(material.emissiveMap);
          material.emissiveMap = null;
          material.emissive = new ThreeColor(0x000000);
        }
      }
      materials.add(material);
      bindImportedWeather(material, ctx);
      models.set(asset.id, {
        geometry,
        material,
        bounds: geometry.boundingBox.clone(),
        size: geometry.boundingBox.getSize(new ThreeVector3()),
      });
    }),
  );
  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length) {
    // Wait for every in-flight asset before disposal, including late textures.
    disposeResources(geometries, materials, textures);
    models.clear();
    throw new AggregateError(
      failures.map((result) => result.reason),
      "Could not load the complete imported model set",
    );
  }
  return models;
}

/** Call after all clones/instances using this map have been removed. */
function disposeImportedModels(models) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  for (const { geometry, material } of models.values()) {
    geometries.add(geometry);
    materials.add(material);
    if (material.map) textures.add(material.map);
    if (material.emissiveMap) textures.add(material.emissiveMap);
  }
  disposeResources(geometries, materials, textures);
  models.clear();
}

export { loadImportedModels, disposeImportedModels, parseImportedMesh };
