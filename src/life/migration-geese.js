import {
  Ry,
  ThreeDynamicDrawUsage,
  ThreeEuler,
  ThreeInstancedBufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeQuaternion,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import {
  createSeededRandom,
  createSimplexNoise,
  lerp,
  smoothstep,
} from "../core/math.js";
import {
  createMigrationGooseGeometry,
  createMigrationGooseMaterial,
} from "./migration-goose-geometry.js";

// Each chain gives its population, start/end distance behind the lead goose,
// start/end sideways offset, sideways bend, and lift along the chain. World
// distances keep every quality tier's formations longer than the valley.
const MIGRATION_LANES = [
  {
    phase: 24.5,
    duration: 36,
    period: 44,
    scale: 1,
    // A broad, uneven chevron with a long arm and a separated tail.
    chains: [
      [39, 0, 40, 0, -1.8, -0.85, 0.5],
      [24, 0.85, 23, 0.32, 1.95, 0.64, -0.42],
      [9, 27, 36, 0.95, 2.05, 0.36, 0.48],
    ],
    waypoints: [
      [31, 5.1, 2.2],
      [12, 4.6, 0.9],
      [8, 5.35, -1.35],
      [4.2, 5.72, -3],
      [0, 5.48, -1.9],
      [-4, 5.22, 1],
      [-7.5, 5, 2],
      [-12, 4.9, 0.45],
      [-35, 4.65, -5],
    ],
  },
  {
    phase: 13,
    duration: 38,
    period: 47,
    scale: 1.14,
    // Loose oblique strings over the lake, with room between subgroups.
    chains: [
      [13, 0, 11.5, 0.25, -1.6, 0.6, 0.42],
      [15, 14.5, 27, -0.85, 1.6, -0.25, -0.35],
      [11, 30, 40.5, 0.9, -0.45, -0.44, 0.58],
    ],
    waypoints: [
      [32, 4.3, 19],
      [13, 4.05, 11],
      [8, 3.75, 6.1],
      [4, 3.7, 2.9],
      [-0.5, 4, 1.6],
      [-4, 4.4, 0.7],
      [-8, 4.4, -0.25],
      [-12, 4.25, -0.5],
      [-36, 4, -3],
    ],
  },
  {
    phase: 30,
    duration: 35,
    period: 41,
    scale: 0.72,
    // Smaller broken chevrons trail each other above the ridge.
    chains: [
      [14, 0, 12, 0, 1.42, -0.25, 0.3],
      [7, 0.7, 7.3, -0.24, -1.28, 0.08, -0.18],
      [13, 15.5, 27.5, -0.5, -1.5, -0.38, 0.52],
      [6, 16.4, 22.5, -0.2, 0.85, 0.3, 0.1],
      [13, 31, 43, 0.9, -0.85, 0.52, 0.34],
    ],
    waypoints: [
      [33, 6.4, -18],
      [13, 7, -10],
      [8, 8.55, -6.2],
      [4, 7.65, -4.6],
      [-1, 6.55, -4.9],
      [-6, 6.05, -5.6],
      [-11, 5.6, -4.8],
      [-39, 5.5, 4.7],
    ],
  },
];

function createMigrationFormation(
  chains,
  density,
  unitsPerSecond,
  scale,
  random,
) {
  const birds = [];
  for (const [count, start, end, startSide, endSide, bend, lift] of chains) {
    const groupSeed = random() * 100;
    const gaps = Array.from({ length: count - 1 }, () => 0.45 + random() * 1.1);
    const totalGap = gaps.reduce((total, gap) => total + gap, 0);
    const retained = Math.max(2, Math.round(count * density));
    let next = 0;
    let gap = 0;
    for (let index = 0; index < count; index++) {
      const progress = index === count - 1 ? 1 : gap / totalGap;
      const distance = lerp(start, end, progress);
      if (index < gaps.length) gap += gaps[index];
      const arc = Math.sin(progress * Math.PI);
      const bird = {
        delay: distance / unitsPerSecond,
        lateral:
          lerp(startSide, endSide, progress) +
          arc * bend +
          (random() - 0.5) * 0.26,
        lift: lift * arc + (random() - 0.5) * 0.33,
        groupSeed,
        size: scale * (0.88 + random() * 0.24),
        phase: random() * Math.PI * 2,
        wingRate: 10 + random() * 6,
      };
      // Thin the existing chain evenly and retain both endpoints on every tier.
      if (index === Math.round((next * (count - 1)) / (retained - 1))) {
        birds.push(bird);
        next++;
      }
    }
  }
  return birds;
}

class MigrationGeese {
  constructor(ctx, group) {
    this.world = ctx.world;
    this.flow = createSimplexNoise(27631);
    const random = createSeededRandom(55129);
    const density = ctx.quality.pick(0.56, 0.77, 1);
    this.lanes = MIGRATION_LANES.map((lane) => {
      const curve = new Ry.CatmullRomCurve3(
        lane.waypoints.map((point) => new ThreeVector3(...point)),
      );
      const unitsPerSecond = curve.getLength() / lane.duration;
      return {
        phase: lane.phase,
        duration: lane.duration,
        period: lane.period,
        curve,
        birds: createMigrationFormation(
          lane.chains,
          density,
          unitsPerSecond,
          lane.scale,
          random,
        ),
      };
    });

    const capacity = this.lanes.reduce(
      (total, lane) => total + lane.birds.length,
      0,
    );
    this.flap = new ThreeInstancedBufferAttribute(
      new Float32Array(capacity * 2),
      2,
    );
    this.flap.setUsage(ThreeDynamicDrawUsage);
    const geometry = createMigrationGooseGeometry();
    geometry.setAttribute("aGooseFlap", this.flap);
    this.mesh = new ThreeInstancedMesh(
      geometry,
      createMigrationGooseMaterial(),
      capacity,
    );
    this.mesh.name = "life-migration-geese";
    this.mesh.instanceMatrix.setUsage(ThreeDynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.userData.noReflect = true;
    group.add(this.mesh);

    this.position = new ThreeVector3();
    this.tangent = new ThreeVector3();
    this.scale = new ThreeVector3();
    this.rotation = new ThreeEuler(0, 0, 0, "YXZ");
    this.quaternion = new ThreeQuaternion();
    this.matrix = new ThreeMatrix4();
    this.reset();
  }

  hide() {
    this.mesh.visible = false;
    this.mesh.count = 0;
  }

  reset() {
    // Enter the scene mid-migration, with the streams already crossing.
    this.elapsed = 0;
    this.hide();
  }

  update(dt, _time, env) {
    const { sunElevation } = this.world;
    if (
      env.autumn < 0.5 ||
      env.time < 0.5 ||
      sunElevation < -0.18 ||
      sunElevation > 0.32
    ) {
      this.reset();
      return;
    }

    this.elapsed += dt;
    let visible = 0;
    for (const lane of this.lanes) {
      const laneTime = this.elapsed + lane.phase;
      for (const bird of lane.birds) {
        // Wrap after applying the delay so the tail can finish while the next
        // lead has already started on the other side of the valley.
        const flightTime = laneTime - bird.delay;
        const wave = Math.floor(flightTime / lane.period);
        const age = flightTime - wave * lane.period;
        const progress = age / lane.duration;
        if (progress <= 0 || progress >= 1) continue;

        const point = lane.curve.getPointAt(progress, this.position);
        const tangent = lane.curve.getTangentAt(progress, this.tangent);
        const bob = this.elapsed * 1.7 + bird.phase;
        const groupSeed = bird.groupSeed + wave * 6.3;
        const sway = this.flow.noise2((age + bird.delay) * 0.16, groupSeed);
        const lift = this.flow.noise2(age * 0.14, groupSeed + 101);
        const spacing =
          bird.lateral * (1 + 0.17 * sway) +
          0.52 * sway +
          Math.sin(bob * 0.53) * 0.14;
        point.x -= tangent.z * spacing;
        point.z += tangent.x * spacing;
        point.y += bird.lift + 0.43 * lift + Math.sin(bob) * 0.105;

        // Skip birds entirely outside the map. The material cuts any wing or
        // tail that still straddles the exact edge, without a fade or resize.
        if (
          Math.abs(point.x) > LANDSCAPE_BOUNDS.halfW + 0.2 ||
          Math.abs(point.z) > LANDSCAPE_BOUNDS.halfD + 0.2
        )
          continue;

        this.scale.setScalar(bird.size);
        this.rotation.set(
          -Math.asin(tangent.y) + Math.sin(bob) * 0.045,
          Math.atan2(tangent.x, tangent.z) + 0.06 * sway,
          Math.sin(bob * 0.7) * 0.13 + 0.12 * sway,
        );
        this.quaternion.setFromEuler(this.rotation);
        this.matrix.compose(point, this.quaternion, this.scale);
        this.mesh.setMatrixAt(visible, this.matrix);

        const beat = Math.sin(this.elapsed * 2.35 + bird.phase);
        this.flap.setXY(
          visible,
          this.elapsed * bird.wingRate + bird.phase,
          0.62 * smoothstep(-0.4, 0.65, beat),
        );
        visible++;
      }
    }
    this.mesh.count = visible;
    this.mesh.visible = visible > 0;
    if (visible > 0) {
      this.mesh.instanceMatrix.needsUpdate = true;
      this.flap.needsUpdate = true;
    }
  }
}

export { MigrationGeese };
