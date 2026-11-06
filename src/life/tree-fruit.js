import {
  ThreeBufferGeometry,
  ThreeColor,
  ThreeConeGeometry,
  ThreeDataTexture,
  ThreeDynamicDrawUsage,
  ThreeEuler,
  ThreeFloat32BufferAttribute,
  ThreeFloatType,
  ThreeGroup,
  ThreeInstancedBufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeNearestFilter,
  ThreeQuaternion,
  ThreeRGBAFormat,
  ThreeSphereGeometry,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { clamp, createSeededRandom } from "../core/math.js";
import {
  PLANT_SPECIES_CODES,
  appleFruitSeason,
} from "../vegetation/tree-species.js";
import { getTreeRegistry } from "../vegetation/tree-registry.js";
import { createTreeFruitMaterials } from "./tree-fruit-material.js";
import {
  sampleFruitAttachment,
  sampleFruitBranchWind,
} from "./tree-fruit-motion.js";

const FRUIT_ATTACHED = 0;
const FRUIT_FALLING = 1;
const FRUIT_SETTLED = 2;
const FRUIT_GONE = 3;
const STEM_TIP_HEIGHT = 1.27;
const greenApple = new ThreeColor(0.34, 0.48, 0.055);
const ripeApple = new ThreeColor(0.68, 0.065, 0.025);

function createAppleGeometry() {
  const body = new ThreeSphereGeometry(1, 12, 8).toNonIndexed();
  const positions = body.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const angle = Math.atan2(z, x);
    const lobes = 1 + 0.04 * Math.cos(angle * 5) * Math.abs(y);
    const dimple = 0.13 * Math.pow(Math.abs(y), 8);
    positions.setXYZ(i, x * lobes, y * 0.94 - Math.sign(y) * dimple, z * lobes);
  }
  body.computeVertexNormals();
  const stem = new ThreeConeGeometry(0.065, 0.48, 5).toNonIndexed();
  stem.rotateZ(-0.13);
  stem.translate(0.025, 1.03, 0);
  const geometry = new ThreeBufferGeometry();
  const position = [];
  const normal = [];
  const color = [];
  for (const part of [body, stem]) {
    const p = part.getAttribute("position");
    const n = part.getAttribute("normal");
    for (let i = 0; i < p.count; i++) {
      position.push(p.getX(i), p.getY(i), p.getZ(i));
      normal.push(n.getX(i), n.getY(i), n.getZ(i));
      if (part === stem) color.push(0.28, 0.22, 0.1);
      else {
        const shade =
          0.9 + Math.sin(Math.atan2(p.getZ(i), p.getX(i)) * 7) * 0.05;
        color.push(shade, shade, shade);
      }
    }
    part.dispose();
  }
  geometry.setAttribute(
    "position",
    new ThreeFloat32BufferAttribute(position, 3),
  );
  geometry.setAttribute("normal", new ThreeFloat32BufferAttribute(normal, 3));
  geometry.setAttribute("color", new ThreeFloat32BufferAttribute(color, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

class TreeFruitSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.registry = getTreeRegistry(ctx);
    this.group = new ThreeGroup();
    this.group.name = "tree-fruit";
    ctx.scene.add(this.group);
    this.geometry = createAppleGeometry();
    this.uniforms = { uVegShake: { value: null } };
    const materials = createTreeFruitMaterials(ctx, this.uniforms);
    this.material = materials.material;
    this.depthMaterial = materials.depthMaterial;
    this.trees = [];
    this.fruits = [];
    this._byPlant = new Map();
    this._revision = -1;
    this._matrix = new ThreeMatrix4();
    this._quaternion = new ThreeQuaternion();
    this._euler = new ThreeEuler();
    this._scale = new ThreeVector3();
    this._renderPosition = new ThreeVector3();
    this._color = new ThreeColor();
    this._wind = { x: 0, z: 0, turbulence: 0 };
    this._season = ctx.world.season;
    this._seasonState = appleFruitSeason(this._season);
    this._offShake = ctx.events.on("tree:shake", (event) => this.shake(event));
    this._offScenario = ctx.events.on("scenario", () => this.reset());
    this._refreshTrees();
    this.update(0, ctx.time);
  }

  _refreshTrees() {
    if (this._revision === this.registry.revision) return;
    this._revision = this.registry.revision;
    this.trees = [];
    this.fruits = [];
    this._byPlant.clear();
    for (const entry of this.registry.entries) {
      if (entry.plant.code !== PLANT_SPECIES_CODES.apple || !entry.owner)
        continue;
      const random = createSeededRandom(entry.plant.seed ^ 0x4150504c);
      const tree = {
        entry,
        batchIndex: this.trees.length,
        random,
        fruits: [],
        cooldown: 0,
        naturalDrop: 20 + random() * 30,
      };
      for (const anchor of entry.plant.fruitAnchors || []) {
        const fruit = {
          tree,
          anchor,
          radius: 0.018 + random() * 0.006,
          variation: random(),
          state: FRUIT_ATTACHED,
          position: new ThreeVector3(),
          velocity: new ThreeVector3(),
          rotation: new ThreeVector3(0, random() * Math.PI * 2, 0),
          spin: new ThreeVector3(),
          age: 0,
          groundAge: 0,
          scale: 0,
          ripeness: 0,
        };
        tree.fruits.push(fruit);
        this.fruits.push(fruit);
      }
      this.trees.push(tree);
      this._byPlant.set(entry.plant, tree);
    }
    if (this.mesh) {
      this.group.remove(this.mesh);
      this.mesh.dispose();
      // Release the previous instance-attribute buffers before resizing them.
      this.geometry.dispose();
    }
    this.shakeTexture?.dispose();
    this._shakeData = new Float32Array(Math.max(1, this.trees.length) * 4);
    this.shakeTexture = new ThreeDataTexture(
      this._shakeData,
      Math.max(1, this.trees.length),
      1,
      ThreeRGBAFormat,
      ThreeFloatType,
    );
    this.shakeTexture.minFilter = this.shakeTexture.magFilter =
      ThreeNearestFilter;
    this.uniforms.uVegShake.value = this.shakeTexture;
    for (const name of ["aTree", "aInfo", "aAttachment"]) {
      this.geometry.setAttribute(
        name,
        new ThreeInstancedBufferAttribute(
          new Float32Array(Math.max(1, this.fruits.length) * 4),
          4,
        ).setUsage(ThreeDynamicDrawUsage),
      );
    }
    this.mesh = new ThreeInstancedMesh(
      this.geometry,
      this.material,
      Math.max(1, this.fruits.length),
    );
    this.mesh.name = "orchard-apples";
    this.mesh.customDepthMaterial = this.depthMaterial;
    this.mesh.instanceMatrix.setUsage(ThreeDynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.castShadow = this.mesh.receiveShadow = true;
    this.mesh.count = 0;
    this.group.add(this.mesh);
  }

  reset() {
    this._refreshTrees();
    this._season = this.ctx.world.season;
    this._seasonState = appleFruitSeason(this._season);
    for (const tree of this.trees) {
      tree.cooldown = 0;
      tree.naturalDrop = 20 + tree.random() * 30;
    }
    for (const fruit of this.fruits) {
      fruit.state = FRUIT_ATTACHED;
      fruit.age = fruit.groundAge = 0;
      fruit.velocity.set(0, 0, 0);
      fruit.rotation.x = fruit.rotation.z = 0;
    }
    this._write(this.ctx.uniforms.uTime.value);
  }

  shake(event) {
    const tree = this._byPlant.get(event.plant);
    if (!tree || event.strength < 0.28) return;
    this._drop(tree, event.strength);
  }

  _drop(tree, strength) {
    const season = this._seasonState;
    if (tree.cooldown > 0 || season.growth < 0.55 || season.ripeness < 0.25)
      return;
    const candidates = tree.fruits.filter(
      (fruit) => fruit.state === FRUIT_ATTACHED,
    );
    if (!candidates.length) return;
    const count = Math.min(candidates.length, strength > 0.9 ? 2 : 1);
    const time = this.ctx.uniforms.uTime.value;
    const { owner, index, plant } = tree.entry;
    const wind = sampleFruitBranchWind(
      this.ctx,
      plant.x,
      plant.z,
      time,
      this._wind,
    );
    for (let i = 0; i < count; i++) {
      const pick = Math.floor(tree.random() * candidates.length);
      const fruit = candidates.splice(pick, 1)[0];
      this._attach(fruit, time);
      fruit.state = FRUIT_FALLING;
      fruit.age = fruit.groundAge = 0;
      const heightShare = clamp(
        (fruit.position.y - plant.y) / plant.height,
        0,
        1,
      );
      fruit.velocity.set(
        clamp(owner._vel[index * 2] * heightShare * heightShare, -0.65, 0.65) +
          wind.x * 0.06,
        0.025 + tree.random() * 0.045,
        clamp(
          owner._vel[index * 2 + 1] * heightShare * heightShare,
          -0.65,
          0.65,
        ) +
          wind.z * 0.06,
      );
      fruit.spin.set(
        (tree.random() - 0.5) * 4,
        (tree.random() - 0.5) * 3,
        (tree.random() - 0.5) * 4,
      );
    }
    tree.cooldown = 0.75 + tree.random() * 0.5;
  }

  _attach(fruit, time) {
    fruit.scale = fruit.radius * this._seasonState.growth;
    fruit.ripeness = clamp(
      this._seasonState.ripeness + (fruit.variation - 0.5) * 0.12,
      0,
      1,
    );
    sampleFruitAttachment(
      this.ctx,
      fruit.tree.entry,
      fruit.anchor,
      time,
      fruit.position,
    );
    fruit.position.y -= fruit.scale * STEM_TIP_HEIGHT;
  }

  _stepFruit(fruit, dt) {
    const terrain = this.ctx.terrain;
    const p = fruit.position;
    const v = fruit.velocity;
    fruit.age += dt;
    if (fruit.age > 18) {
      fruit.state = FRUIT_GONE;
      return;
    }
    if (fruit.state === FRUIT_SETTLED) {
      fruit.groundAge += dt;
      if (fruit.groundAge > 8) {
        fruit.state = FRUIT_GONE;
        return;
      }
      // A slight downhill roll, with enough friction to rest on the meadow.
      const slopeX =
        (terrain.height(p.x + 0.025, p.z) - terrain.height(p.x - 0.025, p.z)) /
        0.05;
      const slopeZ =
        (terrain.height(p.x, p.z + 0.025) - terrain.height(p.x, p.z - 0.025)) /
        0.05;
      v.x = (v.x - clamp(slopeX, -0.7, 0.7) * 0.3 * dt) * Math.exp(-dt * 7);
      v.z = (v.z - clamp(slopeZ, -0.7, 0.7) * 0.3 * dt) * Math.exp(-dt * 7);
    } else {
      v.y -= 1.7 * dt;
      v.x *= Math.exp(-dt * 0.18);
      v.z *= Math.exp(-dt * 0.18);
    }
    p.addScaledVector(v, dt);
    const floor = terrain.height(p.x, p.z) + fruit.scale * 0.92;
    if (p.y <= floor || fruit.state === FRUIT_SETTLED) {
      p.y = floor;
      if (fruit.state === FRUIT_FALLING && v.y < -0.22) {
        v.y *= -0.22;
        v.x *= 0.6;
        v.z *= 0.6;
        fruit.spin.multiplyScalar(0.4);
      } else {
        fruit.state = FRUIT_SETTLED;
        v.y = 0;
      }
    }
    if (
      Math.abs(p.x) > LANDSCAPE_BOUNDS.halfW - 0.04 ||
      Math.abs(p.z) > LANDSCAPE_BOUNDS.halfD - 0.04
    ) {
      fruit.state = FRUIT_GONE;
      return;
    }
    if (fruit.state === FRUIT_FALLING)
      fruit.rotation.addScaledVector(fruit.spin, dt);
    else {
      fruit.rotation.x += (v.z * dt) / fruit.scale;
      fruit.rotation.z -= (v.x * dt) / fruit.scale;
    }
  }

  _write(time) {
    for (const tree of this.trees) {
      const { owner, index } = tree.entry;
      const offset = tree.batchIndex * 4;
      this._shakeData[offset] = owner._bend[index * 2];
      this._shakeData[offset + 1] = owner._bend[index * 2 + 1];
      this._shakeData[offset + 2] = owner._rustle[index];
      this._shakeData[offset + 3] = 1;
    }
    this.shakeTexture.needsUpdate = true;
    const roots = this.geometry.getAttribute("aTree");
    const info = this.geometry.getAttribute("aInfo");
    const anchors = this.geometry.getAttribute("aAttachment");
    let count = 0;
    for (const fruit of this.fruits) {
      if (fruit.state === FRUIT_GONE) continue;
      if (fruit.state === FRUIT_ATTACHED) this._attach(fruit, time);
      const fade =
        fruit.state === FRUIT_SETTLED
          ? clamp((8 - fruit.groundAge) / 1.4, 0, 1)
          : 1;
      const size = fruit.scale * fade;
      if (size < 0.001) continue;
      this._euler.set(fruit.rotation.x, fruit.rotation.y, fruit.rotation.z);
      this._quaternion.setFromEuler(this._euler);
      this._scale.setScalar(size);
      const { plant } = fruit.tree.entry;
      const attached = fruit.state === FRUIT_ATTACHED;
      this._renderPosition.copy(fruit.position);
      if (attached) {
        this._renderPosition.fromArray(fruit.anchor.position);
        this._renderPosition.y -= size * STEM_TIP_HEIGHT;
      }
      this._matrix.compose(this._renderPosition, this._quaternion, this._scale);
      this.mesh.setMatrixAt(count, this._matrix);
      roots.setXYZW(count, plant.x, plant.y, plant.z, plant.height);
      info.setXYZW(
        count,
        fruit.tree.batchIndex,
        fruit.anchor.flex,
        fruit.anchor.phase,
        plant.code,
      );
      anchors.setXYZW(count, ...fruit.anchor.position, attached ? 1 : 0);
      this._color
        .copy(greenApple)
        .lerp(ripeApple, fruit.ripeness)
        .multiplyScalar(0.9 + fruit.variation * 0.2);
      this.mesh.setColorAt(count, this._color);
      count++;
    }
    this.mesh.count = count;
    this.mesh.visible = count > 0;
    if (count) {
      this.mesh.instanceMatrix.needsUpdate = true;
      this.mesh.instanceColor.needsUpdate = true;
      roots.needsUpdate = info.needsUpdate = anchors.needsUpdate = true;
    }
  }

  update(dt, time) {
    if (this._disposed) return;
    this._refreshTrees();
    const season = this.ctx.world.season;
    const previousGrowth = this._seasonState.growth;
    const next = appleFruitSeason(season);
    const delta = ((season - this._season + 6) % 4) - 2;
    // A new growing season refills the finite crop; a dial jump cannot leave
    // last season's detached apples hovering among spring flowers or snow.
    if (
      Math.abs(delta) > 0.25 ||
      (previousGrowth > 0.005 && next.growth <= 0.005)
    )
      this.reset();
    this._season = season;
    this._seasonState = next;
    const step = Math.min(Math.max(dt, 0), 0.25);
    const shaderTime = this.ctx.uniforms.uTime.value ?? time;
    for (const tree of this.trees) {
      tree.cooldown = Math.max(0, tree.cooldown - step);
      if (next.growth < 0.55 || next.ripeness < 0.25) continue;
      const { plant } = tree.entry;
      const wind = sampleFruitBranchWind(
        this.ctx,
        plant.x,
        plant.z,
        shaderTime,
        this._wind,
      );
      const gust = Math.hypot(wind.x, wind.z) + wind.turbulence * 2;
      tree.naturalDrop -= step * (next.drop + Math.max(0, gust - 2.8) * 0.2);
      if (tree.naturalDrop <= 0) {
        this._drop(tree, 0.45);
        tree.naturalDrop = 10 + tree.random() * 20;
      }
    }
    const substeps = Math.max(1, Math.ceil(step / 0.025));
    for (const fruit of this.fruits) {
      for (
        let i = 0;
        i < substeps &&
        (fruit.state === FRUIT_FALLING || fruit.state === FRUIT_SETTLED);
        i++
      ) {
        this._stepFruit(fruit, step / substeps);
      }
    }
    this._write(shaderTime);
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._offShake();
    this._offScenario();
    this.mesh.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.depthMaterial.dispose();
    this.shakeTexture.dispose();
    this.group.removeFromParent();
    this._byPlant.clear();
    this.trees.length = this.fruits.length = 0;
  }
}

export { TreeFruitSystem };
