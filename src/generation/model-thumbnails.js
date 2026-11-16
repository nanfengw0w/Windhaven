import { CharacterGLTFLoader } from "../character/gltf-loader.js";
import { Ry } from "../vendor/three-runtime.js";

const THUMBNAIL_SIZE = 192;
const CACHE_LIMIT = 64;

function disposeModel(...models) {
  const resources = new Set();
  const images = new Set();
  for (const model of models) {
    model.traverse((object) => {
      if (object.geometry) resources.add(object.geometry);
      if (object.skeleton) resources.add(object.skeleton);
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) {
        if (!material || resources.has(material)) continue;
        resources.add(material);
        for (const value of Object.values(material)) {
          if (!value?.isTexture) continue;
          resources.add(value);
          if (value.image?.close) images.add(value.image);
        }
      }
    });
  }
  for (const resource of resources) resource.dispose();
  for (const image of images) image.close();
}

class ModelThumbnails {
  constructor() {
    this.loader = new CharacterGLTFLoader();
    this.cache = new Map();
    this.queue = Promise.resolve();
    this.renderer = null;
  }

  get(url) {
    const cached = this.cache.get(url);
    if (cached) return cached;
    const result = this.queue.then(() => this._render(url));
    this.queue = result.catch(() => {
      if (this.cache.get(url) === result) this.cache.delete(url);
    });
    this.cache.set(url, result);
    if (this.cache.size > CACHE_LIMIT) {
      this.cache.delete(this.cache.keys().next().value);
    }
    return result;
  }

  _setup() {
    this.renderer = new Ry.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    this.renderer.setSize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, false);
    this.renderer.setClearColor(0, 0);
    this.renderer.outputColorSpace = Ry.SRGBColorSpace;
    this.renderer.toneMapping = Ry.ACESFilmicToneMapping;

    this.scene = new Ry.Scene();
    this.scene.add(new Ry.HemisphereLight(0xfff4de, 0x9793a0, 2));
    const key = new Ry.DirectionalLight(0xffead3, 3.2);
    key.position.set(-2, 4, 4);
    const rim = new Ry.DirectionalLight(0xe3eaff, 1.6);
    rim.position.set(3, 2, -3);
    this.scene.add(key, rim);

    this.camera = new Ry.OrthographicCamera(-1, 1, 1, -1, 0.1, 20);
    this.camera.position.set(3, 1.8, 4.5);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateMatrixWorld();
  }

  async _render(url) {
    if (!this.renderer) this._setup();
    if (this.renderer.getContext().isContextLost()) {
      throw new Error("The thumbnail renderer is unavailable.");
    }
    const { scene: model } = await this.loader.loadAsync(url);
    if (!model) throw new Error("The GLB has no preview scene.");
    const pivot = new Ry.Group();
    pivot.add(model);
    try {
      const bounds = new Ry.Box3().setFromObject(model);
      const size = bounds.getSize(new Ry.Vector3());
      const largestSide = Math.max(size.x, size.y, size.z);
      if (!Number.isFinite(largestSide) || largestSide <= 0) {
        throw new Error("The GLB has no measurable bounds.");
      }
      const scale = 2 / largestSide;
      pivot.position
        .copy(bounds.getCenter(new Ry.Vector3()))
        .multiplyScalar(-scale);
      pivot.scale.setScalar(scale);

      const half = size.multiplyScalar(scale / 2);
      const view = this.camera.matrixWorldInverse.elements;
      const width =
        Math.abs(view[0]) * half.x +
        Math.abs(view[4]) * half.y +
        Math.abs(view[8]) * half.z;
      const height =
        Math.abs(view[1]) * half.x +
        Math.abs(view[5]) * half.y +
        Math.abs(view[9]) * half.z;
      const frame = Math.max(width, height) * 1.16;
      Object.assign(this.camera, {
        left: -frame,
        right: frame,
        top: frame,
        bottom: -frame,
      });
      this.camera.updateProjectionMatrix();
      this.scene.add(pivot);
      this.renderer.render(this.scene, this.camera);
      const image = this.renderer.domElement.toDataURL("image/png");
      if (!image.startsWith("data:image/png"))
        throw new Error("No thumbnail was rendered.");
      return image;
    } finally {
      pivot.removeFromParent();
      disposeModel(model);
    }
  }
}

export { disposeModel, ModelThumbnails };
