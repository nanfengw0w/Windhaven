import {
  ThreeDepthTexture,
  ThreeMatrix4,
  ThreeNearestFilter,
  ThreeUnsignedIntType,
  ThreeVector2,
  ThreeWebGLRenderTarget,
} from "../vendor/three-runtime.js";

// Shared by volume and sun-glare fragments. Disabled outside the main pass so
// reflection cameras and the depth capture never sample a stale main view.
const sceneDepthUniforms = {
  uSceneDepthMap: { value: null },
  uSceneDepthSize: { value: new ThreeVector2(1, 1) },
  uSceneDepthProjectionInverse: { value: new ThreeMatrix4() },
  uSceneDepthEnabled: { value: 0 },
};

const SCENE_DEPTH_GLSL = `
uniform sampler2D uSceneDepthMap;
uniform vec2 uSceneDepthSize;
uniform mat4 uSceneDepthProjectionInverse;
uniform float uSceneDepthEnabled;

// Perspective depth is nonlinear. Unproject the nearest opaque sample into
// view space to get a distance along the volume's normalized camera ray.
float opaqueSceneDistance(vec2 fragmentPosition) {
  if (uSceneDepthEnabled < 0.5) return 1e20;
  vec2 uv = fragmentPosition / uSceneDepthSize;
  float depth = texture2D(uSceneDepthMap, uv).r;
  if (depth >= 1.0) return 1e20;
  vec4 viewPosition = uSceneDepthProjectionInverse * vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
  return length(viewPosition.xyz / viewPosition.w);
}
`;

class SceneDepthPass {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.enabled = true;
    this.target = new ThreeWebGLRenderTarget(1, 1, {
      minFilter: ThreeNearestFilter,
      magFilter: ThreeNearestFilter,
      generateMipmaps: false,
      depthBuffer: true,
      stencilBuffer: false,
      samples: 0,
      depthTexture: new ThreeDepthTexture(1, 1, ThreeUnsignedIntType),
    });
    this.target.texture.name = "opaque-depth-unused-color";
    this.target.depthTexture.name = "opaque-scene-depth";
    this._materials = new Map();
    this._newShadows = new Map();
    this._collect = (object) => {
      if (object.castShadow && object.shadow && !object.shadow.map)
        this._newShadows.set(object.shadow, object.shadow.needsUpdate);
      if (!object.material) return;
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) {
        if (!material || this._materials.has(material)) continue;
        this._materials.set(material, {
          visible: material.visible,
          colorWrite: material.colorWrite,
        });
        // Original materials retain alpha cutouts, snow/grass displacement,
        // rock variants and tunnel clipping. A generic depth override would
        // create different silhouettes from the actual scene.
        if (material.transparent || !material.depthWrite || !material.depthTest)
          material.visible = false;
        else material.colorWrite = false;
      }
    };
  }
  setSize(width, height) {
    this.target.setSize(width, height);
  }
  render(renderer) {
    sceneDepthUniforms.uSceneDepthEnabled.value = 0;
    sceneDepthUniforms.uSceneDepthMap.value = null;
    if (!this.enabled) return;
    const { scene, camera } = this;
    const saved = {
      target: renderer.getRenderTarget(),
      face: renderer.getActiveCubeFace(),
      mip: renderer.getActiveMipmapLevel(),
      autoClear: renderer.autoClear,
      shadowAutoUpdate: renderer.shadowMap.autoUpdate,
      shadowNeedsUpdate: renderer.shadowMap.needsUpdate,
      background: scene.background,
      overrideMaterial: scene.overrideMaterial,
    };
    try {
      scene.traverseVisible(this._collect);
      scene.background = null;
      scene.overrideMaterial = null;
      renderer.shadowMap.autoUpdate = false;
      // Original lit materials still bind shadow samplers even with color
      // writes disabled. On a cold first frame those samplers need real depth
      // textures; otherwise WebGL rejects the draw (a null color texture cannot
      // satisfy sampler2DShadow). Initialize missing maps once, then skip all
      // subsequent prepass shadow updates.
      renderer.shadowMap.needsUpdate =
        renderer.shadowMap.enabled === true && this._newShadows.size > 0;
      if (renderer.shadowMap.needsUpdate)
        for (const shadow of this._newShadows.keys()) shadow.needsUpdate = true;
      renderer.autoClear = false;
      renderer.setRenderTarget(this.target);
      // A dedicated single-sample attachment avoids both MSAA depth resolve
      // ambiguity and sampling a texture that is being drawn into.
      renderer.state.buffers.depth.setMask(true);
      renderer.clear(false, true, false);
      renderer.render(scene, camera);
    } finally {
      for (const [material, state] of this._materials) {
        material.visible = state.visible;
        material.colorWrite = state.colorWrite;
      }
      this._materials.clear();
      for (const [shadow, needsUpdate] of this._newShadows)
        shadow.needsUpdate = needsUpdate;
      this._newShadows.clear();
      scene.background = saved.background;
      scene.overrideMaterial = saved.overrideMaterial;
      renderer.autoClear = saved.autoClear;
      renderer.shadowMap.autoUpdate = saved.shadowAutoUpdate;
      renderer.shadowMap.needsUpdate = saved.shadowNeedsUpdate;
      renderer.setRenderTarget(saved.target, saved.face, saved.mip);
    }
    sceneDepthUniforms.uSceneDepthMap.value = this.target.depthTexture;
    sceneDepthUniforms.uSceneDepthSize.value.set(
      this.target.width,
      this.target.height,
    );
    sceneDepthUniforms.uSceneDepthProjectionInverse.value.copy(
      camera.projectionMatrixInverse,
    );
    sceneDepthUniforms.uSceneDepthEnabled.value = 1;
  }
  dispose() {
    if (sceneDepthUniforms.uSceneDepthMap.value === this.target.depthTexture) {
      sceneDepthUniforms.uSceneDepthEnabled.value = 0;
      sceneDepthUniforms.uSceneDepthMap.value = null;
    }
    this.target.dispose();
  }
}

export { SCENE_DEPTH_GLSL, SceneDepthPass, sceneDepthUniforms };
