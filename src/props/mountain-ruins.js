import { clamp, createSeededRandom } from "../core/math.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import {
  MOUNTAIN_RUINS,
  ruinWorldPoint,
} from "../layout/mountain-ruins-layout.js";
import { createDressedStoneGeometry } from "../landmarks/dressed-stone.js";
import {
  ThreeGroup,
  ThreeMatrix4,
  ThreeMesh,
} from "../vendor/three-runtime.js";
import {
  PropGeometryBuilder,
  composeChildPropTransform,
  createPropColor,
} from "./geometry.js";
import { createPropMaterial } from "./material.js";
import {
  attachMountainRuinModel,
  disposeMountainRuinModel,
} from "./mountain-ruins-model.js";

// 局部 +Z 为门前。每块石头共享同一材质，苔藓与天气直接落在石面上。
class MountainRuins {
  constructor(ctx, parent = ctx.scene) {
    const layout = MOUNTAIN_RUINS;
    this.ctx = ctx;
    this.layout = layout;
    this.random = createSeededRandom(260731);
    this.group = new ThreeGroup();
    this.group.name = "mountain-stone-ruins";
    this.frame = composeChildPropTransform(
      new ThreeMatrix4(),
      layout.x,
      0,
      layout.z,
      layout.yaw ?? 0,
    );
    const entry = ruinWorldPoint(0, layout.depth / 2);
    this.baseY =
      Math.max(
        terrainHeight(entry.x, entry.z),
        ...[-1, 1].flatMap((sideX) =>
          [-1, 1].map((sideZ) => {
            const corner = ruinWorldPoint(
              (sideX * layout.width) / 2,
              (sideZ * layout.depth) / 2,
            );
            return terrainHeight(corner.x, corner.z);
          }),
        ),
      ) + 0.012;
    this.width = layout.width;
    this.depth = layout.depth;
    this.parts = [];
    this.footings = [];
    this.template = createDressedStoneGeometry();
    this.stoneCount = 0;
    this.uniforms = {
      uLifeGlow: { value: 0 },
      uLifeFlicker: { value: 0 },
      uLifeWet: { value: 0 },
      uRoofSnow: { value: 0 },
    };
    const builder = new PropGeometryBuilder();
    this._part(builder, "ruin-walls", () => this._walls(builder));
    this._part(builder, "ruin-steps-and-rubble", () =>
      this._stepsAndRubble(builder),
    );
    this.geometry = builder.toGeometry();
    this.template.dispose();
    this.template = null;
    this.material = createPropMaterial(ctx, this.uniforms, this.baseY);
    const compile = this.material.onBeforeCompile;
    this.material.onBeforeCompile = (shader, renderer) => {
      compile(shader, renderer);
      // 背阴旧石墙比常用踏石保留更多苔藓，仍由石面噪声和季节控制。
      shader.fragmentShader = shader.fragmentShader.replace(
        "smoothstep(0.55, 0.75, wgNoise3(vLWPos * 38.0 + 4.0)",
        "smoothstep(0.46, 0.68, wgNoise3(vLWPos * 38.0 + 4.0)",
      );
    };
    this.material.customProgramCacheKey = () => "wg-mountain-ruins-v1";
    this.mesh = new ThreeMesh(this.geometry, this.material);
    this.mesh.name = "broken-fieldstone-walls-steps-and-rubble";
    this.mesh.castShadow = this.mesh.receiveShadow = true;
    this.group.add(this.mesh);
    parent.add(this.group);
    this.stats = {
      ruins: 1,
      walls: 4,
      steps: 4,
      stones: this.stoneCount,
      vertices: builder.vertexCount,
      triangles: builder.idx.length / 3,
      drawCalls: 1,
    };
    this.update();
    if (typeof window !== "undefined" && ctx.renderer)
      this.modelsReady = attachMountainRuinModel(this);
  }

  _ground(x, z) {
    const point = ruinWorldPoint(x, z);
    return terrainHeight(point.x, point.z);
  }

  _part(builder, kind, build) {
    const start = builder.vertexCount;
    build();
    this.parts.push({ kind, start, count: builder.vertexCount - start });
  }

  _stone(builder, x, y, z, width, height, depth, yaw = 0, tilt = 0) {
    const random = this.random;
    const geometry = this.template.clone();
    const positions = geometry.attributes.position;
    const seed = random() * 10;
    const grain = [];
    // 连续坐标扰动让共享边保持闭合，避免独立三角形产生裂缝。
    for (let index = 0; index < positions.count; index++) {
      const px = positions.getX(index);
      const py = positions.getY(index);
      const pz = positions.getZ(index);
      const wear = 1 + 0.035 * Math.sin(px * 11 + py * 7 + pz * 13 + seed);
      grain.push(px * 2, py * 2, pz * 2);
      positions.setXYZ(
        index,
        px * width * wear,
        py * height * wear,
        pz * depth * wear,
      );
    }
    geometry.computeVertexNormals();
    const transform = composeChildPropTransform(
      this.frame,
      x,
      y,
      z,
      yaw,
      tilt,
      tilt * 0.5,
    );
    const tint = 0.8 + random() * 0.34;
    const color = createPropColor("#77796b").multiplyScalar(tint);
    builder.raw(
      transform,
      Array.from(positions.array),
      Array.from(geometry.attributes.normal.array),
      grain,
      { col: color, kind: 6, seed, expo: 1, param: 0 },
      Array.from(geometry.index.array),
    );
    geometry.dispose();
    this.stoneCount++;
  }

  _walls(builder) {
    const halfW = this.width / 2;
    const halfD = this.depth / 2;
    const course = this.layout.maxWallHeight / 9;
    const thickness = this.layout.wallThickness;
    const door = this.layout.doorWidth / 2;
    // 连续倒塌轮廓而非逐排抽签；低凹处一直敞到天，绝无悬空窗顶。
    const walls = [
      {
        length: this.width,
        x: 0,
        z: -halfD,
        yaw: 0,
        profile: [
          [0, 0.43],
          [0.2, 0.36],
          [0.33, 0.22],
          [0.52, 0.19],
          [0.68, 0.38],
          [1, 0.55],
        ],
      },
      {
        length: this.depth,
        x: -halfW,
        z: 0,
        yaw: Math.PI / 2,
        profile: [
          [0, 0.28],
          [0.22, 0.23],
          [0.4, 0.08],
          [0.63, 0.055],
          [0.83, 0.24],
          [1, 0.4],
        ],
      },
      {
        length: this.depth,
        x: halfW,
        z: 0,
        yaw: Math.PI / 2,
        profile: [
          [0, 0.18],
          [0.3, 0.12],
          [0.6, 0.19],
          [1, 0.29],
        ],
      },
      {
        length: this.width,
        x: 0,
        z: halfD,
        yaw: 0,
        door: true,
        profile: [
          [0, 0.22],
          [0.35, 0.37],
          [0.5, 0.34],
          [0.66, 0.32],
          [0.83, 0.22],
          [1, 0.16],
        ],
      },
    ];
    for (const wall of walls) {
      const heightAt = (along) => {
        const t = clamp((along + wall.length / 2) / wall.length, 0, 1);
        let section = 1;
        while (
          section < wall.profile.length - 1 &&
          t > wall.profile[section][0]
        )
          section++;
        const a = wall.profile[section - 1],
          b = wall.profile[section];
        return a[1] + ((b[1] - a[1]) * (t - a[0])) / (b[0] - a[0]);
      };
      const pointAt = (along) => ({
        x: wall.x + Math.cos(wall.yaw) * along,
        z: wall.z - Math.sin(wall.yaw) * along,
      });
      let lowest = this.baseY;
      for (let sample = 0; sample <= 20; sample++) {
        const point = pointAt(-wall.length / 2 + (wall.length * sample) / 20);
        lowest = Math.min(lowest, this._ground(point.x, point.z) - 0.008);
      }
      const firstRow = -Math.ceil((this.baseY - lowest) / course) - 1;
      let supported = [];
      for (let row = firstRow; row < 9; row++) {
        const nextSupport = [];
        const rowBottom = this.baseY + row * course;
        const rowTop = rowBottom + course;
        let edge = -wall.length / 2;
        let first = true;
        while (edge < wall.length / 2 - 0.006) {
          // 半块起步使相邻排错缝；每排单独切分，水平层高统一。
          let span = Math.min(
            (first && Math.abs(row % 2) === 1 ? 0.052 : 0.098) +
              this.random() * 0.018,
            wall.length / 2 - edge,
          );
          first = false;
          if (wall.door && edge < -door && edge + span > -door)
            span = -door - edge;
          if (wall.door && edge >= -door - 1e-6 && edge < door) {
            edge = door;
            continue;
          }
          const start = edge;
          const end = edge + span;
          edge = end;
          const along = (start + end) / 2;
          const point = pointAt(along);
          const ground = this._ground(point.x, point.z);
          const bed = Math.min(this.baseY - 0.006, ground - 0.008);
          const bottom = Math.max(rowBottom, bed);
          const profileTop = Math.min(
            heightAt(start),
            heightAt(along),
            heightAt(end),
          );
          const top =
            row < 0 ? rowTop : Math.min(rowTop, this.baseY + profileTop);
          if (top - bottom < 0.008) continue;
          if (row >= 0) {
            const bearing = supported.reduce(
              (sum, interval) =>
                sum +
                Math.max(
                  0,
                  Math.min(end, interval[1]) - Math.max(start, interval[0]),
                ),
              0,
            );
            // 至少七成跨度由上一排真实砌块承托，断口处不生成漂浮石。
            if (bearing / span < 0.7) continue;
          }
          this._stone(
            builder,
            point.x,
            (bottom + top) / 2,
            point.z,
            Math.max(0.007, span - 0.001),
            top - bottom + 0.001,
            thickness * (row < 0 ? 1.04 : 0.97 + this.random() * 0.06),
            wall.yaw + (this.random() - 0.5) * 0.012,
          );
          if (top >= rowTop - 0.001) nextSupport.push([start, end]);
          if (row < 0 && bed >= rowBottom && bed < rowTop) {
            const world = ruinWorldPoint(point.x, point.z);
            this.footings.push({
              kind: "ruin-wall",
              ...world,
              bottom: bed,
              ground,
            });
          }
        }
        supported = nextSupport;
      }
    }
    // 低窗台残迹上方开放；两侧断墙的砌块都从基础连续叠起。
    this._stone(
      builder,
      -0.1,
      this.baseY + 0.19,
      -halfD,
      0.25,
      0.028,
      thickness * 1.1,
    );
  }

  _stepsAndRubble(builder) {
    const front = this.depth / 2;
    for (let index = 0; index < 4; index++) {
      const z = front + 0.047 + index * 0.066;
      const ground = this._ground(0, z);
      const top = Math.max(ground + 0.007, this.baseY + 0.014 - index * 0.019);
      const bottom = Math.min(ground - 0.012, top - 0.026);
      this._stone(
        builder,
        (index % 2) * 0.004,
        (top + bottom) / 2,
        z,
        0.3 + index * 0.008,
        top - bottom,
        0.075,
        (index - 1) * 0.012,
      );
      const point = ruinWorldPoint(0, z);
      this.footings.push({ kind: "ruin-step", ...point, bottom, ground });
    }
    for (let index = 0; index < 19; index++) {
      // 避开门前正中，倒石主要散在断墙脚与室内角落。
      const side = index % 2 ? -1 : 1;
      const x = side * this.width * (0.32 + this.random() * 0.3);
      const z = Math.max(
        -this.depth / 2 - 0.045,
        (this.random() - 0.64) * this.depth * 1.25,
      );
      const height = 0.025 + this.random() * 0.035;
      const ground = this._ground(x, z);
      this._stone(
        builder,
        x,
        ground + height * 0.35,
        z,
        0.052 + this.random() * 0.06,
        height,
        0.045 + this.random() * 0.04,
        this.random() * Math.PI,
        (this.random() - 0.5) * 0.35,
      );
    }
  }

  update() {
    if (this.disposed) return;
    this.uniforms.uLifeWet.value =
      clamp((this.ctx.world?.rainfall ?? 0) * 1.2, 0, 1) * 0.5;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    disposeMountainRuinModel(this);
    this.group.removeFromParent();
    this.geometry.dispose();
    this.material.dispose();
  }
}

export { MountainRuins };
