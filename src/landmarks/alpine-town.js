// Alpine town lifecycle and shared geometry/material batches.
// Building, railway, train and model-replacement details live in focused modules.
import {
  Ry,
  ThreeBoxGeometry,
  ThreeBufferGeometry,
  ThreeCircleGeometry,
  ThreeColor,
  ThreeConeGeometry,
  ThreeEuler,
  ThreeFloat32BufferAttribute,
  ThreeGroup,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeMeshStandardMaterial,
  ThreeQuaternion,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { bindLandmarkSurface } from "./landmark-surfaces.js";
import { TrainSmoke } from "./train-smoke.js";
import { createDressedStoneGeometry } from "./dressed-stone.js";
import {
  createRailwayBallastGeometry,
  createRailwayBallastStoneGeometry,
} from "./railway-ballast.js";
import {
  bindMapClipping,
  createMapClippedDepthMaterial,
} from "./map-clipping.js";
import {
  loadImportedModels,
  disposeImportedModels,
} from "./imported-models.js";
import {
  buildTownHouse,
  buildTownBuildings,
  buildTownClockTower,
} from "./town-buildings.js";
import { buildRailwayRoute, sampleRailwayTrack } from "./railway-route.js";
import {
  buildRailwayStructures,
  buildRailwayTunnels,
} from "./railway-structures.js";
import {
  addTrainPiece,
  buildTownTrain,
  batchTrainCar,
  updateTownTrain,
} from "./town-train.js";
import {
  loadTownModels,
  applyTownImportedModels,
} from "./town-model-replacement.js";

function gableGeometry() {
  const geometry = new ThreeBufferGeometry();
  const vertices = [
    [-0.5, 0, -0.5],
    [0.5, 0, -0.5],
    [0, 1, -0.5],
    [-0.5, 0, 0.5],
    [0.5, 0, 0.5],
    [0, 1, 0.5],
  ];
  const faces = [
    [0, 2, 1],
    [3, 4, 5],
    [0, 3, 5],
    [0, 5, 2],
    [1, 2, 5],
    [1, 5, 4],
    [0, 1, 4],
    [0, 4, 3],
  ];
  geometry.setAttribute(
    "position",
    new ThreeFloat32BufferAttribute(
      faces.flatMap((face) => face.flatMap((index) => vertices[index])),
      3,
    ),
  );
  geometry.computeVertexNormals();
  return geometry;
}

// Geometry and materials are shared across the entire miniature. Each static
// material/primitive pair is one instanced draw, including windows and fences.
class AlpineTownLandmark {
  constructor(ctx) {
    this.ctx = ctx;
    this.group = new ThreeGroup();
    this.group.name = "alpine-town-landmark";
    this.group.userData.assetSlot = "alpine-town";
    this.railway = new ThreeGroup();
    this.railway.name = "alpine-railway";
    this.railway.userData.assetSlot = "railway";
    this.train = new ThreeGroup();
    this.train.name = "alpine-local-train";
    this.train.userData.assetSlot = "train";
    this.group.add(this.railway, this.train);
    this.geometries = {
      box: new ThreeBoxGeometry(1, 1, 1),
      dressedStone: createDressedStoneGeometry(),
      roof: gableGeometry(),
      ballast: createRailwayBallastGeometry(),
      gravel: createRailwayBallastStoneGeometry(),
      cylinder: new Ry.CylinderGeometry(0.5, 0.5, 1, 12),
      cone: new ThreeConeGeometry(0.5, 1, 6),
      disk: new ThreeCircleGeometry(0.5, 16),
    };
    this.materials = {};
    const palette = {
      stone: 0x8e8875,
      plaster: 0xdfcca2,
      ochre: 0xc6a278,
      wood: 0x634634,
      roof: 0x844c3c,
      slate: 0x677062,
      glass: 0x354e4b,
      iron: 0x394541,
      rail: 0x7b8580,
      ballast: 0x797366,
      paving: 0x918b7d,
      dark: 0x272e2a,
      warm: 0xf5ce82,
      cream: 0xe4d5ad,
      red: 0xa24937,
      green: 0x3d6454,
      foliage: 0x66764b,
    };
    for (const [name, color] of Object.entries(palette)) {
      this.materials[name] = new ThreeMeshStandardMaterial({
        color,
        roughness: name === "rail" ? 0.38 : 0.88,
        metalness: name === "rail" ? 0.6 : name === "iron" ? 0.2 : 0,
        flatShading: true,
        emissive: name === "warm" ? new ThreeColor(0xf7bb61) : 0,
        emissiveIntensity: name === "warm" ? 0.15 : 0,
      });
      bindMapClipping(this.materials[name], ctx);
      const surface = {
        stone: "masonry",
        paving: "stone",
        ballast: "ballast",
        wood: "timber",
        slate: "slate",
        dark: "masonry",
      }[name];
      if (surface) bindLandmarkSurface(this.materials[name], ctx, surface);
    }
    this.depthMaterial = createMapClippedDepthMaterial();
    this.batches = new Map();
    this._matrix = new ThreeMatrix4();
    this._position = new ThreeVector3();
    this._scale = new ThreeVector3();
    this._rotation = new ThreeEuler();
    this._quaternion = new ThreeQuaternion();
    this.cars = [];
    this.wheels = [];
    this.portals = [];
    this.buildings = [];
    this.windowGlowMaterials = [];
    this._buildPath();
    this._buildRailway();
    this._buildTown();
    this._buildTunnels();
    this._flushBatches();
    this._buildTrain();
    this.startDistance = 0.6;
    this.distance = this.startDistance;
    this.speed = 0.42;
    this.resetCount = 0;
    this.lastReset = null;
    this._resetSample = {};
    this.disposed = false;
    this.trainSmoke = new TrainSmoke(this);
    this.update(0, 0);
    ctx.scene.add(this.group);
    this.stats = {
      buildings: this.buildings.length,
      tunnelPortals: this.portals.length,
      trainCars: this.cars.length,
      sleepers: this.sleeperCount,
      trackLength: this.pathLength,
      staticDrawCalls: this.batches.size,
      trainDrawCalls: 0,
    };
    this.train.traverse((object) => {
      if (object.isMesh) this.stats.trainDrawCalls++;
    });
    this.stats.models = "placeholder";
    if (typeof window !== "undefined" && ctx.renderer)
      this.modelsReady = this.loadModels();
  }

  _transform(x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0, parent = null) {
    this._position.set(x, y, z);
    this._scale.set(sx, sy, sz);
    this._quaternion.setFromEuler(this._rotation.set(rx, ry, rz));
    this._matrix.compose(this._position, this._quaternion, this._scale);
    if (parent) this._matrix.premultiply(parent);
    return this._matrix;
  }

  _piece(
    kind,
    material,
    x,
    y,
    z,
    sx,
    sy,
    sz,
    rx = 0,
    ry = 0,
    rz = 0,
    parent = null,
    railway = false,
  ) {
    const key = `${railway ? "railway" : "town"}:${kind}:${material}`;
    if (!this.batches.has(key))
      this.batches.set(key, {
        kind,
        material,
        railway,
        transforms: [],
        slots: [],
      });
    this.batches.get(key).slots.push(this._modelSlot ?? null);
    this.batches
      .get(key)
      .transforms.push(
        this._transform(x, y, z, sx, sy, sz, rx, ry, rz, parent).clone(),
      );
  }

  _frame(x, y, z, yaw = 0, pitch = 0) {
    const frame = this._transform(x, y, z, 1, 1, 1, 0, yaw, 0).clone();
    if (pitch) frame.multiply(new ThreeMatrix4().makeRotationX(-pitch));
    return frame;
  }

  _flushBatches() {
    for (const [name, batch] of this.batches) {
      const mesh = new ThreeInstancedMesh(
        batch.kind === "box" && batch.material === "paving"
          ? this.geometries.dressedStone
          : this.geometries[batch.kind],
        this.materials[batch.material],
        batch.transforms.length,
      );
      mesh.name = name;
      batch.transforms.forEach((matrix, index) =>
        mesh.setMatrixAt(index, matrix),
      );
      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = ![
        "glass",
        "warm",
        "rail",
        "ballast",
        "paving",
      ].includes(batch.material);
      mesh.receiveShadow = true;
      mesh.customDepthMaterial = this.depthMaterial;
      mesh.computeBoundingBox();
      mesh.computeBoundingSphere();
      batch.mesh = mesh;
      (batch.railway ? this.railway : this.group).add(mesh);
    }
  }

  _buildPath() {
    return buildRailwayRoute(this);
  }

  loadModels(loader = loadImportedModels) {
    return loadTownModels(this, loader);
  }

  _applyImportedModels(models) {
    return applyTownImportedModels(this, models);
  }

  sampleTrack(distance, out) {
    return sampleRailwayTrack(this, distance, out);
  }

  _buildRailway() {
    return buildRailwayStructures(this);
  }

  _house(x, z, width, height, depth, yaw, index, station = false) {
    return buildTownHouse(
      this,
      x,
      z,
      width,
      height,
      depth,
      yaw,
      index,
      station,
    );
  }

  _buildTown() {
    return buildTownBuildings(this);
  }

  _clockTower(x, z) {
    return buildTownClockTower(this, x, z);
  }

  _buildTunnels() {
    return buildRailwayTunnels(this);
  }

  _movingPiece(
    parent,
    kind,
    material,
    x,
    y,
    z,
    sx,
    sy,
    sz,
    rx = 0,
    ry = 0,
    rz = 0,
  ) {
    return addTrainPiece(
      this,
      parent,
      kind,
      material,
      x,
      y,
      z,
      sx,
      sy,
      sz,
      rx,
      ry,
      rz,
    );
  }

  _buildTrain() {
    return buildTownTrain(this);
  }

  _batchCar(car) {
    return batchTrainCar(this, car);
  }

  update(dt) {
    updateTownTrain(this, dt);
    this.trainSmoke?.update(dt);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.trainSmoke?.dispose();
    this.group.removeFromParent();
    this.group.traverse((object) => {
      if (object.isInstancedMesh) object.dispose();
    });
    if (this.importedModels) disposeImportedModels(this.importedModels);
    for (const geometry of Object.values(this.geometries)) geometry.dispose();
    for (const material of Object.values(this.materials)) material.dispose();
    this.depthMaterial.dispose();
    this.railway.clear();
    this.train.clear();
    this.group.clear();
    this.batches.clear();
    this.cars.length = 0;
    this.wheels.length = 0;
  }
}

export { AlpineTownLandmark };
