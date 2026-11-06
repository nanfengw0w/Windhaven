// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeAddEquation,
  ThreeBox3,
  ThreeBufferGeometry,
  ThreeCamera,
  ThreeColor,
  ThreeCustomBlending,
  ThreeFloat32BufferAttribute,
  ThreeFrustum,
  ThreeGreaterDepth,
  ThreeHalfFloatType,
  ThreeLinearFilter,
  ThreeMatrix4,
  ThreeMesh,
  ThreeOneFactor,
  ThreePerspectiveCamera,
  ThreePlane,
  ThreeScene,
  ThreeShaderMaterial,
  ThreeVector2,
  ThreeVector3,
  ThreeVector4,
  ThreeWebGLRenderTarget,
  ThreeZeroFactor,
} from "../vendor/three-runtime.js";
const ol = new ThreePlane();
const Yn = new ThreeVector4();
const rl = new ThreeVector4();
const Df = new ThreeMatrix4();
const js = new ThreeVector3();
const Zg = new ThreeVector3();
const jg = new ThreeVector3();
const Kg = new ThreeVector3();
const ia = new ThreeVector3();
const xh = new ThreeVector3(0, 1, 0);
const Jg = new ThreeColor();
const wo = new ThreeVector2();
const yh = new ThreeMatrix4();
const Qg = new ThreeMatrix4();
const tv = new ThreeFrustum();
const Ff = new ThreeBox3();
const sa = new ThreeVector4();
const wh = new ThreeVector3();
const REFLECTION_MIN_MESH_RADIUS = 0.03;
class WaterPlanarReflection {
  constructor(t, e, i, s) {
    ((this.ctx = t), (this.wu = e), (this.own = i), (this.bounds = s));
    const n = t.quality;
    ((this.baseScale = n.pick(0.25, 0.34, 0.5)),
      (this.maxScale = n.pick(0.34, 0.5, 0.62)),
      (this.fastEvery = n.pick(2, 2, 1)),
      (this.slowEvery = n.pick(5, 4, 3)),
      (this.camera = new ThreePerspectiveCamera()),
      (this.camera.matrixAutoUpdate = !0),
      (this.rt = new ThreeWebGLRenderTarget(4, 4, {
        type: ThreeHalfFloatType,
        minFilter: ThreeLinearFilter,
        magFilter: ThreeLinearFilter,
        generateMipmaps: !1,
        depthBuffer: !0,
        stencilBuffer: !1,
      })),
      (this.rt.texture.name = "waterMirror"),
      (this.rt.scissorTest = !0),
      (this.hidden = []),
      (this.valid = !1),
      (this.since = 1e9),
      (this.lastPos = new ThreeVector3(1e9, 0, 0)),
      (this.lastFwd = new ThreeVector3()),
      (this.lastLight = new ThreeVector3()),
      (this.lastLevel = -1e9),
      (this.stats = {
        renders: 0,
        skipped: 0,
        pixels: 0,
        hidden: 0,
      }),
      (this._collect = this._collect.bind(this)));
    const o = new ThreeBufferGeometry();
    (o.setAttribute(
      "position",
      new ThreeFloat32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
    ),
      (this.fixMesh = new ThreeMesh(
        o,
        new ThreeShaderMaterial({
          vertexShader:
            "void main() { gl_Position = vec4(position.xy, 0.99995, 1.0); }",
          fragmentShader:
            "void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); }",
          depthTest: !0,
          depthWrite: !1,
          depthFunc: ThreeGreaterDepth,
          transparent: !0,
          blending: ThreeCustomBlending,
          blendEquation: ThreeAddEquation,
          blendSrc: ThreeZeroFactor,
          blendDst: ThreeOneFactor,
          blendSrcAlpha: ThreeOneFactor,
          blendDstAlpha: ThreeZeroFactor,
        }),
      )),
      (this.fixMesh.frustumCulled = !1),
      (this.fixScene = new ThreeScene()),
      this.fixScene.add(this.fixMesh),
      (this.fixCam = new ThreeCamera()),
      this.resize(),
      (e.uReflTex.value = this.rt.texture),
      (e.uReflOn.value = 0));
  }
  resize() {
    (this.ctx.renderer.getDrawingBufferSize(wo),
      (this.screenW = wo.x),
      (this.screenH = wo.y));
    const t = Math.max(64, Math.ceil(wo.x * this.maxScale)),
      e = Math.max(36, Math.ceil(wo.y * this.maxScale));
    (t !== this.rt.width || e !== this.rt.height) &&
      (this.rt.setSize(t, e), (this.valid = !1));
  }
  _motion(t, e) {
    const i = this.bounds;
    wh.set(0, 0, -1).transformDirection(t.matrixWorld);
    const s = Math.max(
        1,
        Math.hypot(
          js.x - (i.minX + i.maxX) * 0.5,
          js.y - e,
          js.z - (i.minZ + i.maxZ) * 0.5,
        ),
      ),
      n = js.distanceTo(this.lastPos) / s,
      o = 1 - Math.min(1, wh.dot(this.lastFwd)),
      a = this.ctx.world.lightDir.distanceTo(this.lastLight);
    return n + o * 4 + a * 0.5 + Math.abs(e - this.lastLevel) * 4;
  }
  render(t, e = 0) {
    const i = this.wu;
    this.since++;
    const { renderer: s, scene: n, camera: o, lights: a, world: l } = this.ctx;
    if (
      (s.getDrawingBufferSize(wo),
      (wo.x !== this.screenW || wo.y !== this.screenH) && this.resize(),
      a?.key?.castShadow && !a.key.shadow.map)
    )
      return;
    if (
      (o.updateMatrixWorld(),
      js.setFromMatrixPosition(o.matrixWorld),
      js.y <= t + 0.01 || e > 0.97)
    ) {
      ((i.uReflOn.value = 0), (this.valid = !1));
      return;
    }
    const c = this.bounds;
    if (
      (yh.multiplyMatrices(o.projectionMatrix, o.matrixWorldInverse),
      tv.setFromProjectionMatrix(yh),
      Ff.min.set(c.minX, t - 0.06, c.minZ),
      Ff.max.set(c.maxX, t + 0.06, c.maxZ),
      !tv.intersectsBox(Ff))
    ) {
      this.stats.skipped++;
      return;
    }
    // Photography must update immediately on camera/FOV changes and use a
    // stable crop. The normal moving/idle cache changes its sampling grid a
    // few frames after the camera stops, which would change a frozen photo.
    const photo = this.ctx.photo?.active;
    const f =
      !photo &&
      ((this.valid ? this._motion(o, t) : 1) > 0.0015 || l.flash > 0.02);
    if (
      !photo &&
      this.valid &&
      this.since < (f ? this.fastEvery : this.slowEvery)
    )
      return;
    ((this.since = 0),
      this.lastPos.copy(js),
      wh.set(0, 0, -1).transformDirection(o.matrixWorld),
      this.lastFwd.copy(wh),
      this.lastLight.copy(l.lightDir),
      (this.lastLevel = t),
      ia.set(js.x, t, js.z),
      Kg.subVectors(ia, js).reflect(xh).negate().add(ia),
      Df.extractRotation(o.matrixWorld),
      Zg.set(0, 0, -1).applyMatrix4(Df).add(js),
      jg.subVectors(ia, Zg).reflect(xh).negate().add(ia));
    const u = this.camera;
    (u.position.copy(Kg),
      u.up.set(0, 1, 0).applyMatrix4(Df).reflect(xh),
      u.lookAt(jg),
      (u.far = o.far),
      (u.near = o.near),
      u.updateMatrixWorld(),
      yh.multiplyMatrices(o.projectionMatrix, u.matrixWorldInverse));
    let d = 1,
      p = -1,
      v = 1,
      g = -1,
      x = !1;
    for (let gt = 0; gt < 4; gt++) {
      if (
        (sa
          .set(gt & 1 ? c.maxX : c.minX, t, gt & 2 ? c.maxZ : c.minZ, 1)
          .applyMatrix4(yh),
        sa.w < 0.001)
      ) {
        x = !0;
        break;
      }
      const Qt = sa.x / sa.w,
        te = sa.y / sa.w;
      (Qt < d && (d = Qt),
        Qt > p && (p = Qt),
        te < v && (v = te),
        te > g && (g = te));
    }
    const m = 0.04 + (f ? 0.05 : 0.02);
    if (
      (x && ((d = -1), (p = 1), (v = -1), (g = 1)),
      (d = Math.max(-1, d - m)),
      (p = Math.min(1, p + m)),
      (v = Math.max(-1, v - m)),
      (g = Math.min(1, g + m)),
      p - d < 0.001 || g - v < 0.001)
    ) {
      this.stats.skipped++;
      return;
    }
    this.stats.rect = [d, p, v, g];
    const w = (p - d) * 0.5 * this.screenW,
      y = (g - v) * 0.5 * this.screenH,
      _ = this.screenW * this.screenH * this.baseScale * this.baseScale,
      M = Math.min(this.maxScale, Math.sqrt(_ / Math.max(w * y, 1))),
      A = this.rt.width,
      b = this.rt.height,
      S = Math.max(8, Math.min(A, Math.ceil(w * M))),
      E = Math.max(8, Math.min(b, Math.ceil(y * M)));
    (this.rt.viewport.set(0, 0, S, E), this.rt.scissor.set(0, 0, S, E));
    const T = 2 / (p - d),
      R = 2 / (g - v);
    (Qg.set(
      T,
      0,
      0,
      -T * (d + p) * 0.5,
      0,
      R,
      0,
      -R * (v + g) * 0.5,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
    ),
      u.projectionMatrix.multiplyMatrices(Qg, o.projectionMatrix),
      ol
        .setFromNormalAndCoplanarPoint(xh, ia)
        .applyMatrix4(u.matrixWorldInverse),
      Yn.set(ol.normal.x, ol.normal.y, ol.normal.z, ol.constant));
    const z = u.projectionMatrix.elements;
    ((rl.x = (Math.sign(Yn.x) + z[8]) / z[0]),
      (rl.y = (Math.sign(Yn.y) + z[9]) / z[5]),
      (rl.z = -1),
      (rl.w = (1 + z[10]) / z[14]),
      Yn.multiplyScalar(2 / Yn.dot(rl)),
      (z[2] = Yn.x),
      (z[6] = Yn.y),
      (z[10] = Yn.z + 1 - 0.003),
      (z[14] = Yn.w),
      u.projectionMatrixInverse.copy(u.projectionMatrix).invert());
    const L = S / A,
      k = E / b,
      U = i.uReflMatrix.value;
    (U.set(
      0.5 * L,
      0,
      0,
      0.5 * L,
      0,
      0.5 * k,
      0,
      0.5 * k,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1,
    ),
      U.multiply(u.projectionMatrix).multiply(u.matrixWorldInverse),
      i.uReflClamp.value.set(0.5 / A, 0.5 / b, (S - 0.5) / A, (E - 0.5) / b),
      i.uReflShift.value.set(T * L, R * k));
    const F = this.hidden;
    F.length = 0;
    for (const gt of this.own()) gt.visible && F.push(gt);
    n.traverseVisible(this._collect);
    for (const gt of F) gt.visible = !1;
    this.stats.hidden = F.length;
    const G = s.getRenderTarget(),
      B = s.shadowMap.autoUpdate,
      q = s.autoClear,
      X = n.background;
    s.getClearColor(Jg);
    const vt = s.getClearAlpha();
    ((s.shadowMap.autoUpdate = !1),
      (s.autoClear = !0),
      (n.background = null),
      s.setClearColor(0, 0),
      s.setRenderTarget(this.rt),
      s.state.buffers.depth.setMask(!0),
      s.clear(),
      s.render(n, u),
      (s.autoClear = !1),
      s.render(this.fixScene, this.fixCam),
      s.setRenderTarget(G),
      s.setClearColor(Jg, vt),
      (s.autoClear = q),
      (s.shadowMap.autoUpdate = B),
      (n.background = X));
    for (const gt of F) gt.visible = !0;
    ((F.length = 0),
      (i.uReflOn.value = 1),
      (this.valid = !0),
      this.stats.renders++,
      (this.stats.pixels = S * E));
  }
  _collect(t) {
    if (!(t === this.ctx.scene || !t.visible)) {
      if (t.renderOrder >= 5 || t.userData.noReflect) {
        this.hidden.push(t);
        return;
      }
      if (t.isInstancedMesh) {
        t.count > 3e3 && this.hidden.push(t);
        return;
      }
      if (t.isMesh && t.frustumCulled !== !1) {
        const e = t.geometry;
        (e.boundingSphere || e.computeBoundingSphere(),
          e.boundingSphere.radius * t.matrixWorld.getMaxScaleOnAxis() <
            REFLECTION_MIN_MESH_RADIUS && this.hidden.push(t));
      }
    }
  }
  dispose() {
    (this.rt.dispose(),
      this.fixMesh.geometry.dispose(),
      this.fixMesh.material.dispose());
  }
}
export { WaterPlanarReflection };
