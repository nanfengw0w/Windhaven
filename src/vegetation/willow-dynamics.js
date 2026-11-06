import {
  ThreeDataTexture,
  ThreeFloatType,
  ThreeNearestFilter,
  ThreeRGBAFormat,
} from "../vendor/three-runtime.js";
import { clamp } from "../core/math.js";

const WILLOW_SEGMENTS = 8;
const WILLOW_NODES = WILLOW_SEGMENTS + 1;

function createMotionTexture(data, width, height) {
  const texture = new ThreeDataTexture(
    data,
    width,
    height,
    ThreeRGBAFormat,
    ThreeFloatType,
  );
  texture.minFilter = texture.magFilter = ThreeNearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

// 骨架枝使用小幅摆动；垂下的柳条则是八段互相牵引的柔性链。
// 保存各段切线的弯角，再按原段长重建中心线，避免拉长柳条和叶片。
class WillowDynamics {
  constructor(ctx, plants, branches, interaction) {
    this.ctx = ctx;
    this.plants = plants;
    this.branches = branches;
    this.interaction = interaction;
    this.time = 0;
    const rows = Math.max(1, branches.length);
    this.angles = new Float32Array(branches.length * 2);
    this.velocities = new Float32Array(branches.length * 2);
    this.frequencies = new Float32Array(branches.length);
    this.damping = new Float32Array(branches.length);
    this.previousTreeVelocity = new Float32Array(plants.length * 2);
    this.treeAcceleration = new Float32Array(plants.length * 2);
    this.data = new Float32Array(rows * 4);
    this.texture = createMotionTexture(this.data, rows, 1);
    this.segmentAngles = new Float32Array(rows * WILLOW_SEGMENTS * 2);
    this.segmentVelocities = new Float32Array(this.segmentAngles.length);
    this.segmentAcceleration = new Float32Array(this.segmentAngles.length);
    this.windForces = new Float32Array(this.segmentAngles.length);
    this.windSpeeds = new Float32Array(rows * WILLOW_SEGMENTS);
    this.nodePositions = new Float32Array(rows * WILLOW_NODES * 3);
    this.nodeVelocities = new Float32Array(this.nodePositions.length);
    this.curveData = new Float32Array(rows * WILLOW_NODES * 4);
    this.curveTexture = createMotionTexture(this.curveData, WILLOW_NODES, rows);
    this.windSample = { x: 0, z: 0 };
    for (const branch of branches) {
      this.frequencies[branch.id] =
        Math.sqrt(9.81 / Math.max(0.18, branch.length)) *
        1.65 *
        (0.8 + branch.phase * 0.4);
      this.damping[branch.id] = 0.28 + ((branch.phase * 7.13) % 1) * 0.08;
    }
    this.stats = {
      branches: branches.length,
      structural: branches.filter((branch) => branch.kind === "branch").length,
      hanging: branches.filter((branch) => branch.kind === "strand").length,
      nodesPerStrand: WILLOW_NODES,
      textureBytes: this.data.byteLength + this.curveData.byteLength,
    };
    this._disposed = false;
    this.reset();
  }

  update(dt) {
    if (this._disposed || !Number.isFinite(dt) || dt <= 0) return;
    // 恢复后台标签页时不积累巨大冲量；每个子步都更新相邻段的牵引。
    const elapsed = Math.min(dt, 0.15);
    const steps = Math.ceil(elapsed * 120);
    const step = elapsed / steps;
    const interaction = this.interaction;
    for (let index = 0; index < this.previousTreeVelocity.length; index++) {
      const velocity = interaction._vel[index];
      this.treeAcceleration[index] = clamp(
        (velocity - this.previousTreeVelocity[index]) / elapsed,
        -20,
        20,
      );
      this.previousTreeVelocity[index] = velocity;
    }
    this._sampleWind();
    for (let substep = 0; substep < steps; substep++) {
      this.time += step;
      for (const branch of this.branches) {
        if (branch.kind === "branch") this._stepScaffold(branch, step);
        else this._stepStrand(branch, step);
      }
    }
    for (const branch of this.branches) {
      if (branch.kind === "strand") this._writeCurve(branch, elapsed);
      const offset = branch.id * 2;
      this.data[branch.id * 4] = this.angles[offset];
      this.data[branch.id * 4 + 1] = this.angles[offset + 1];
      this.data[branch.id * 4 + 2] = this.velocities[offset];
      this.data[branch.id * 4 + 3] = this.velocities[offset + 1];
    }
    this.texture.needsUpdate = this.curveTexture.needsUpdate = true;
  }

  _sampleWind() {
    for (const branch of this.branches) {
      const plant = this.plants[branch.plantIndex];
      const treeOffset = branch.plantIndex * 2;
      const count = branch.kind === "strand" ? WILLOW_SEGMENTS : 1;
      for (let segment = 0; segment < count; segment++) {
        const node = (branch.id * WILLOW_NODES + segment + 1) * 3;
        const point = branch.anchor;
        const x = count === 1 ? point.x : this.nodePositions[node];
        const y = count === 1 ? point.y : this.nodePositions[node + 1];
        const z = count === 1 ? point.z : this.nodePositions[node + 2];
        const fraction = clamp((y - plant.y) / plant.height, 0, 1);
        const sampleX = x + this.interaction._bend[treeOffset] * fraction;
        const sampleZ = z + this.interaction._bend[treeOffset + 1] * fraction;
        this.windSample.x = this.windSample.z = 0;
        this.ctx.wind?.sample(sampleX, sampleZ, this.windSample);
        const offset = (branch.id * WILLOW_SEGMENTS + segment) * 2;
        this.windForces[offset] = clamp(this.windSample.x, -12, 12);
        this.windForces[offset + 1] = clamp(this.windSample.z, -12, 12);
        this.windSpeeds[offset / 2] = Math.min(
          3,
          Math.hypot(this.windSample.x, this.windSample.z),
        );
      }
    }
  }

  _stepScaffold(branch, dt) {
    const offset = branch.id * 2;
    const treeOffset = branch.plantIndex * 2;
    const windOffset = branch.id * WILLOW_SEGMENTS * 2;
    const omega = this.frequencies[branch.id];
    for (let axis = 0; axis < 2; axis++) {
      const wave = Math.sin(this.time * 1.7 + branch.phase * 6.28 + axis * 1.9);
      const target =
        0.25 *
        Math.tanh(
          (this.windForces[windOffset + axis] * 0.065 +
            wave * 0.009 -
            this.interaction._vel[treeOffset + axis] * 0.035 -
            this.treeAcceleration[treeOffset + axis] * 0.005) /
            0.25,
        );
      this.velocities[offset + axis] +=
        (omega * omega * (target - this.angles[offset + axis]) -
          2 *
            this.damping[branch.id] *
            omega *
            this.velocities[offset + axis]) *
        dt;
      this.angles[offset + axis] += this.velocities[offset + axis] * dt;
    }
  }

  _stepStrand(branch, dt) {
    const start = branch.id * WILLOW_SEGMENTS * 2;
    const treeOffset = branch.plantIndex * 2;
    const phase = branch.phase * Math.PI * 2;
    // 短柳条频率更高，邻条也有少量差异，不会同时整齐地摇摆。
    const rate = clamp(1.05 / Math.max(0.3, branch.length), 0.7, 1.8);
    const variation = 0.85 + branch.phase * 0.3;
    for (let segment = 0; segment < WILLOW_SEGMENTS; segment++) {
      const t = (segment + 1) / WILLOW_SEGMENTS;
      const index = start + segment * 2;
      const stiffness = (26 - t * 20) * rate * variation;
      const coupling = 32 * rate;
      const speed = this.windSpeeds[index / 2];
      for (let axis = 0; axis < 2; axis++) {
        const angle = this.segmentAngles[index + axis];
        const velocity = this.segmentVelocities[index + axis];
        const previous = segment ? this.segmentAngles[index - 2 + axis] : 0;
        const next =
          segment < WILLOW_SEGMENTS - 1
            ? this.segmentAngles[index + 2 + axis]
            : angle;
        const previousVelocity = segment
          ? this.segmentVelocities[index - 2 + axis]
          : 0;
        const nextVelocity =
          segment < WILLOW_SEGMENTS - 1
            ? this.segmentVelocities[index + 2 + axis]
            : velocity;
        const wave = Math.sin(
          this.time * (1.45 + branch.phase * 0.45) +
            phase +
            axis * 1.8 -
            t * 1.35,
        );
        const ripple = Math.sin(this.time * 4.1 + phase * 2.13 - t * 4 + axis);
        const air = wave * (0.9 + speed * 0.5) + ripple * 0.2 * t;
        const parentVelocity =
          branch.parentId >= 0
            ? this.velocities[branch.parentId * 2 + axis]
            : 0;
        const inertia =
          -this.treeAcceleration[treeOffset + axis] * 0.85 -
          this.interaction._vel[treeOffset + axis] * 1.4 -
          parentVelocity * 1.5;
        const force =
          (this.windForces[index + axis] * 11 + air + inertia) *
          (0.4 + t * 0.6);
        this.segmentAcceleration[index + axis] =
          force -
          stiffness * angle +
          coupling * (previous + next - 2 * angle) -
          (1.55 + (1 - t) * 0.8) * velocity +
          0.65 * (previousVelocity + nextVelocity - 2 * velocity);
      }
    }
    for (let segment = 0; segment < WILLOW_SEGMENTS; segment++) {
      const index = start + segment * 2;
      for (let axis = 0; axis < 2; axis++) {
        this.segmentVelocities[index + axis] +=
          this.segmentAcceleration[index + axis] * dt;
        this.segmentAngles[index + axis] +=
          this.segmentVelocities[index + axis] * dt;
      }
      // 极端风刷允许明显抬起柳条，但不让链翻转或形成数值爆炸。
      const length = Math.hypot(
        this.segmentAngles[index],
        this.segmentAngles[index + 1],
      );
      const maximum = 1.15;
      if (length > maximum) {
        this.segmentAngles[index] *= maximum / length;
        this.segmentAngles[index + 1] *= maximum / length;
        const outward = Math.max(
          0,
          (this.segmentVelocities[index] * this.segmentAngles[index] +
            this.segmentVelocities[index + 1] * this.segmentAngles[index + 1]) /
            (maximum * maximum),
        );
        this.segmentVelocities[index] -= outward * this.segmentAngles[index];
        this.segmentVelocities[index + 1] -=
          outward * this.segmentAngles[index + 1];
      }
    }
  }

  _writeCurve(branch, elapsed) {
    const points = branch.points;
    let x = points[0].x;
    let y = points[0].y;
    let z = points[0].z;
    for (let node = 1; node < WILLOW_NODES; node++) {
      const index = (branch.id * WILLOW_SEGMENTS + node - 1) * 2;
      const angleX = this.segmentAngles[index];
      const angleZ = this.segmentAngles[index + 1];
      const angle = Math.hypot(angleX, angleZ);
      const axisX = angle > 1e-8 ? -angleZ / angle : 0;
      const axisZ = angle > 1e-8 ? angleX / angle : 0;
      const dx = points[node].x - points[node - 1].x;
      const dy = points[node].y - points[node - 1].y;
      const dz = points[node].z - points[node - 1].z;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const along = (axisX * dx + axisZ * dz) * (1 - cosine);
      x += dx * cosine - axisZ * dy * sine + axisX * along;
      y += dy * cosine + (axisZ * dx - axisX * dz) * sine;
      z += dz * cosine + axisX * dy * sine + axisZ * along;
      const offset = (branch.id * WILLOW_NODES + node) * 3;
      this.nodeVelocities[offset] = (x - this.nodePositions[offset]) / elapsed;
      this.nodeVelocities[offset + 1] =
        (y - this.nodePositions[offset + 1]) / elapsed;
      this.nodeVelocities[offset + 2] =
        (z - this.nodePositions[offset + 2]) / elapsed;
      this.nodePositions[offset] = x;
      this.nodePositions[offset + 1] = y;
      this.nodePositions[offset + 2] = z;
      const texel = (branch.id * WILLOW_NODES + node) * 4;
      this.curveData[texel] = x - points[node].x;
      this.curveData[texel + 1] = y - points[node].y;
      this.curveData[texel + 2] = z - points[node].z;
    }
  }

  reset() {
    this.time = 0;
    for (const buffer of [
      this.angles,
      this.velocities,
      this.previousTreeVelocity,
      this.treeAcceleration,
      this.data,
      this.segmentAngles,
      this.segmentVelocities,
      this.segmentAcceleration,
      this.windForces,
      this.windSpeeds,
      this.nodeVelocities,
      this.curveData,
    ])
      buffer.fill(0);
    for (const branch of this.branches) {
      if (branch.kind !== "strand") continue;
      for (let node = 0; node < WILLOW_NODES; node++) {
        const offset = (branch.id * WILLOW_NODES + node) * 3;
        this.nodePositions[offset] = branch.points[node].x;
        this.nodePositions[offset + 1] = branch.points[node].y;
        this.nodePositions[offset + 2] = branch.points[node].z;
      }
    }
    this.texture.needsUpdate = this.curveTexture.needsUpdate = true;
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.texture.dispose();
    this.curveTexture.dispose();
  }
}

export { WillowDynamics };
