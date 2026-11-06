// Reconstructed module: identifiers and file boundaries are refactor choices.
// Terrain mesh: surface + soil skirt + instanced rocks, plus the detail masks
// (footpaths, banks, bare earth) and the town-path texture baked from landmarks.
import {
  ThreeEuler,
  ThreeInstancedBufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeMesh,
  ThreeQuaternion,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { createSeededRandom, lerp } from "../core/math.js";
import { CORE_FIELD_BOUNDS } from "../core/config.js";
import { getTreeRegistry } from "../vegetation/tree-registry.js";
import { terrainHeight, terrainNormal } from "../simulation/terrain-shape.js";
import { sampleTerrainMeshGrid } from "./mesh-geometry.js";
import {
  createTerrainDepthMaterial,
  createTerrainSurfaceMaterial,
} from "./surface-material.js";
import { createTerrainSoilMaterial } from "./soil-material.js";
import { buildLandscapeGeometry } from "./landscape-geometry.js";
import { RIVER_CROSSING, TerrainDetailMasks } from "./footpaths-and-masks.js";
import { createTownPathTexture } from "./town-path-texture.js";
import { createFarmGroundTexture } from "./farm-texture.js";
import { createWoodworkingGroundTexture } from "./woodworking-texture.js";
import { createHikingGroundTexture } from "./hiking-texture.js";
import {
  ROCK_VARIANT_COUNT,
  buildRockVariantGeometry,
  placeTerrainRocks,
} from "./rock-geometry-and-placement.js";
import {
  createRockDepthMaterial,
  createRockSurfaceMaterial,
} from "./rock-materials.js";
function createTerrainRockInstances(r) {
  const { quality: t } = r,
    e = t.pick(110, 170, 210),
    { geo: i, variants: s } = buildRockVariantGeometry(t.pick(1, 2, 3)),
    n = placeTerrainRocks(e),
    o = new ThreeInstancedMesh(i, createRockSurfaceMaterial(r), n.length);
  ((o.customDepthMaterial = createRockDepthMaterial()),
    (o.castShadow = !0),
    (o.receiveShadow = !0),
    (o.name = "terrain-rocks"));
  const a = new Float32Array(n.length * 4),
    l = new Float32Array(n.length * 4),
    c = createSeededRandom(77),
    h = new ThreeMatrix4(),
    f = new ThreeQuaternion(),
    u = new ThreeQuaternion(),
    d = new ThreeEuler(),
    p = new ThreeVector3(0, 1, 0),
    v = new ThreeVector3(),
    g = new ThreeVector3(),
    x = new ThreeVector3(),
    m = [];
  return (
    n.forEach((w, y) => {
      const _ = w.variant ?? Math.floor(c() * ROCK_VARIANT_COUNT),
        M = [0, 0, 0, 0];
      for (let G = 0; G < ROCK_VARIANT_COUNT; G++)
        M[G] = G === _ ? 1 : c() * (w.variant === void 0 ? 0.35 : 0.12);
      const A = M[0] + M[1] + M[2] + M[3];
      for (let G = 0; G < ROCK_VARIANT_COUNT; G++) M[G] /= A;
      ((a[y * 4] = M[1]),
        (a[y * 4 + 1] = M[2]),
        (a[y * 4 + 2] = M[3]),
        (a[y * 4 + 3] = c()));
      let b = 0,
        S = 0,
        E = 0;
      for (let G = 0; G < ROCK_VARIANT_COUNT; G++)
        ((b += s[G].ymin * M[G]),
          (S += s[G].ymax * M[G]),
          (E += s[G].rh * M[G]));
      const T = w.r / E;
      let R = T * (w.squash ?? 1) * lerp(0.8, 1.15, c());
      (w.kind === "stepping" &&
        (R = (w.top - (terrainHeight(w.x, w.z) - 0.03)) / (S - b)),
        g.set(T * lerp(0.9, 1.1, c()), R, T * lerp(0.9, 1.1, c())),
        terrainNormal(w.x, w.z, v),
        v.lerp(p, 1 - w.align).normalize(),
        u.setFromUnitVectors(p, v),
        d.set((c() - 0.5) * 0.25, c() * Math.PI * 2, (c() - 0.5) * 0.25),
        f.setFromEuler(d).premultiply(u));
      const z = terrainHeight(w.x, w.z);
      let L = z;
      for (let G = 0; G < 6; G++) {
        const B = (G / 6) * Math.PI * 2;
        L = Math.min(
          L,
          terrainHeight(
            w.x + Math.cos(B) * w.r * 0.75,
            w.z + Math.sin(B) * w.r * 0.75,
          ),
        );
      }
      const k = lerp(z, L, 0.6),
        U = (S - b) * R;
      let F = k - 0.3 * U - b * R;
      (w.kind === "stepping" && (F = w.top - S * R),
        x.set(w.x, F, w.z),
        h.compose(x, f, g),
        o.setMatrixAt(y, h),
        (l[y * 4] = w.waterY),
        (l[y * 4 + 1] = 0),
        (l[y * 4 + 2] = w.moss),
        (l[y * 4 + 3] = 0),
        m.push({
          x: w.x,
          y: F,
          z: w.z,
          r: w.r,
          top: F + S * R,
          h: U,
          kind: w.kind,
        }));
    }),
    i.setAttribute("aRock", new ThreeInstancedBufferAttribute(a, 4)),
    i.setAttribute("aRock2", new ThreeInstancedBufferAttribute(l, 4)),
    (o.instanceMatrix.needsUpdate = !0),
    o.computeBoundingSphere(),
    {
      mesh: o,
      rocks: m,
    }
  );
}
class TerrainSystem {
  constructor(t) {
    this.ctx = t;
    const { quality: e, scene: i } = t,
      [s, n] = e.pick([160, 108], [288, 192], [384, 256]);
    this.grid = sampleTerrainMeshGrid(s, n);
    this.landscape = buildLandscapeGeometry(
      this.grid,
      e.pick(48, 72, 96),
      e.pick(32, 48, 64),
    );
    const { mesh: o, rocks: a } = createTerrainRockInstances(t);
    ((this.rockMesh = o),
      (this.rocks = a),
      (this.crossing = RIVER_CROSSING),
      (this.masks = new TerrainDetailMasks(t.terrain).preserveCore(
        new TerrainDetailMasks(t.terrain.coreBaked, CORE_FIELD_BOUNDS),
      )),
      this.masks.stampRocks(a),
      (this.detailTexture = this.masks.texture),
      (this.townPathTexture = createTownPathTexture()),
      (this.farmGroundTexture = createFarmGroundTexture()),
      (this.woodworkingGroundTexture = createWoodworkingGroundTexture()),
      (this.hikingGroundTexture = createHikingGroundTexture()),
      (this.uniforms = {
        uTownPaths: { value: this.townPathTexture },
        uFarmGround: { value: this.farmGroundTexture },
        uWoodworkingGround: { value: this.woodworkingGroundTexture },
        uHikingGround: { value: this.hikingGroundTexture },
        uTDetail: {
          value: this.detailTexture,
        },
        uTIce: {
          value: 0,
        },
      }),
      (this.mesh = new ThreeMesh(
        this.landscape.surface,
        createTerrainSurfaceMaterial(t, this.uniforms),
      )),
      (this.mesh.name = "terrain-surface"),
      (this.mesh.castShadow = !0),
      (this.mesh.receiveShadow = !0),
      (this.skirt = new ThreeMesh(
        this.landscape.skirt,
        createTerrainSoilMaterial(t, this.uniforms),
      )),
      (this.skirt.name = "terrain-soil"),
      (this.skirt.castShadow = !0),
      (this.skirt.receiveShadow = !0),
      (this.mesh.geometry.boundingSphere.radius += 0.1),
      (this.skirt.geometry.boundingSphere.radius += 0.1),
      i.add(this.mesh, this.skirt, this.rockMesh),
      (this._treeRevision = -1));
    // Colour and shadow passes must expose the same railway opening and
    // displace the same snowy surface; a solid depth pass would seal the portal.
    this.mesh.customDepthMaterial = createTerrainDepthMaterial(t);
  }
  bareAt(t, e) {
    return this.masks.bareAt(t, e);
  }
  rockAt(t, e) {
    for (const i of this.rocks)
      if ((i.x - t) ** 2 + (i.z - e) ** 2 < i.r * i.r) return i;
    return null;
  }
  update() {
    const { ctx: e } = this,
      i = e.modules.water,
      s = typeof i?.ice == "number" ? i.ice : e.fields.lakeFrozen || 0;
    this.uniforms.uTIce.value = s;
    const registry = getTreeRegistry(e);
    if (registry.revision !== this._treeRevision) {
      this._treeRevision = registry.revision;
      this.masks.stampTrees(registry.entries.map(({ plant }) => plant));
    }
  }
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    const geometries = new Set();
    const materials = new Set();
    for (const mesh of [this.mesh, this.skirt, this.rockMesh]) {
      mesh.removeFromParent();
      geometries.add(mesh.geometry);
      materials.add(mesh.material);
      if (mesh.customDepthMaterial) materials.add(mesh.customDepthMaterial);
    }
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of new Set([
      this.detailTexture,
      this.townPathTexture,
      this.farmGroundTexture,
      this.woodworkingGroundTexture,
      this.hikingGroundTexture,
      this.masks.core?.texture,
    ])) {
      texture?.dispose();
    }
  }
}
export { TerrainSystem };
