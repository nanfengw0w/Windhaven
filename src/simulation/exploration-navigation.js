import {
  FIELD_BOUNDS,
  LANDSCAPE_BOUNDS,
  TERRARIUM_BOUNDS,
  WATER_LEVEL_CONFIG,
} from "../core/config.js";
import { clamp, lerp, smoothstep } from "../core/math.js";
import {
  createExplorationObstacles,
  explorationObstacleDistance,
} from "../layout/exploration-layout.js";
import { railwayTunnelContains } from "../layout/railway-cut.js";
import {
  CABIN_PLACEMENT,
  queryRiver,
  riverHalfWidth,
  terrainHeight,
  terrainNormal,
  terrainShape,
} from "./terrain-shape.js";
import { sampleNavigableWater } from "./water-surface.js";

const EXPLORATION_FOOT_OFFSETS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [Math.SQRT1_2, Math.SQRT1_2],
  [-Math.SQRT1_2, Math.SQRT1_2],
  [Math.SQRT1_2, -Math.SQRT1_2],
  [-Math.SQRT1_2, -Math.SQRT1_2],
];
// The world uses a roughly 0.2-unit human height. These values give a
// 0.108-unit jump and 0.6 seconds of airtime on a level surface.
const EXPLORATION_GRAVITY = 2.4;
const EXPLORATION_JUMP_SPEED = 0.72;
const EXPLORATION_BANK_REACH = 0.3;
const EXPLORATION_BANK_SLOPE = Math.tan((65 * Math.PI) / 180);

// CPU counterpart of wgNoise, used only for the alpine snow displacement.
function explorationSnowNoise(x, z) {
  const fract = (value) => value - Math.floor(value);
  const hash = (px, pz) => {
    px = fract(px * 123.34);
    pz = fract(pz * 456.21);
    const dot = px * (px + 45.32) + pz * (pz + 45.32);
    return fract((px + dot) * (pz + dot));
  };
  const ix = Math.floor(x),
    iz = Math.floor(z);
  const fx = fract(x),
    fz = fract(z);
  const ux = fx * fx * (3 - 2 * fx),
    uz = fz * fz * (3 - 2 * fz);
  return lerp(
    lerp(hash(ix, iz), hash(ix + 1, iz), ux),
    lerp(hash(ix, iz + 1), hash(ix + 1, iz + 1), ux),
    uz,
  );
}

class ExplorationNavigation {
  constructor(ctx = {}) {
    this.ctx = ctx;
    this.radius = 0.035;
    this.eyeHeight = 0.18;
    this.height = 0.2;
    this.swimDraft = 0.12;
    this.swimming = false;
    this.grounded = true;
    this.verticalVelocity = 0;
    this.maxSlope = Math.tan((48 * Math.PI) / 180);
    this.position = { x: -2.4, y: terrainHeight(-2.4, 2.2), z: 2.2 };
    this.obstacles = createExplorationObstacles(CABIN_PLACEMENT);
    this._buildingFootprints = new WeakMap();
    this._grid = null;
    this._normal = { x: 0, y: 1, z: 0 };
    this.surface = {
      kind: "land",
      groundY: this.position.y,
      waterY: null,
      depth: 0,
      supportY: this.position.y,
      swimming: false,
      iceCoverage: 0,
    };
    // Read shared scalar state, never import or inspect water scene objects.
    this._waterState = {
      terrainHeight: (x, z) =>
        this.ctx.terrain?.height?.(x, z) ?? terrainHeight(x, z),
    };
  }

  get waterLevel() {
    return this.ctx.world?.lakeLevel ?? WATER_LEVEL_CONFIG.lakeLevel;
  }

  resetVertical() {
    this.verticalVelocity = 0;
    this.sampleSurface(this.position.x, this.position.z, this.surface);
    this.swimming = this.surface.swimming;
    this.grounded = !this.swimming;
    this.position.y = this.surface.supportY;
  }

  jump() {
    if (
      this.swimming ||
      !this.grounded ||
      this.sampleSurface(this.position.x, this.position.z).kind === "water" ||
      !this.isTraversable(this.position.x, this.position.z)
    )
      return false;
    this.position.y = this.supportHeight(this.position.x, this.position.z);
    this.verticalVelocity = EXPLORATION_JUMP_SPEED;
    this.grounded = false;
    return true;
  }

  _refreshObstacles() {
    const buildings = this.ctx.modules?.alpineTown?.buildings;
    if (!buildings) return;
    for (const building of buildings) {
      const imported = building.imported ?? building;
      if (this._buildingFootprints.get(building) === imported) continue;
      this._buildingFootprints.set(building, imported);
      const obstacle = this.obstacles.find(
        (item) =>
          item.kind === "rectangle" &&
          Math.abs(item.x - building.x) < 0.0001 &&
          Math.abs(item.z - building.z) < 0.0001,
      );
      if (!obstacle) continue;
      obstacle.width = Math.max(
        obstacle.width,
        (building.foundationWidth ?? 0) + 0.02,
        (imported.size?.[0] ?? imported.wallWidth ?? building.width) + 0.02,
      );
      obstacle.depth = Math.max(
        obstacle.depth,
        (building.foundationDepth ?? 0) + 0.02,
        (imported.size?.[2] ?? imported.wallDepth ?? building.depth) + 0.02,
      );
    }
  }

  _snowAt(x, z) {
    const fields = this.ctx.fields;
    // Match the uploaded RGBA texture, including its half-texel UV convention.
    if (fields?.data && fields.rx > 1 && fields.rz > 1) {
      const u = clamp(
        ((x - FIELD_BOUNDS.minX) / FIELD_BOUNDS.sizeX) * fields.rx - 0.5,
        0,
        fields.rx - 1,
      );
      const v = clamp(
        ((z - FIELD_BOUNDS.minZ) / FIELD_BOUNDS.sizeZ) * fields.rz - 0.5,
        0,
        fields.rz - 1,
      );
      const ix = Math.floor(u),
        iz = Math.floor(v);
      const jx = Math.min(ix + 1, fields.rx - 1),
        jz = Math.min(iz + 1, fields.rz - 1);
      const data = fields.data,
        row = fields.rx;
      return lerp(
        lerp(data[(iz * row + ix) * 4], data[(iz * row + jx) * 4], u - ix),
        lerp(data[(jz * row + ix) * 4], data[(jz * row + jx) * 4], u - ix),
        v - iz,
      );
    }
    return fields?.snowAt?.(x, z) ?? 0;
  }

  _snowLift(x, y, z, ny) {
    const outside = Math.max(
      Math.abs(x) - TERRARIUM_BOUNDS.halfW,
      Math.abs(z) - TERRARIUM_BOUNDS.halfD,
    );
    let alpine = 0;
    if (outside > 0.55 && y > 4.25) {
      const line =
        4.25 + explorationSnowNoise(x * 1.35 + 23, z * 1.35 + 23) * 0.55;
      alpine =
        smoothstep(0.55, 1.4, outside) * smoothstep(line, line + 0.85, y);
    }
    const depth = Math.max(this._snowAt(x, z), alpine * 0.65);
    if (depth <= 0) return 0;
    const river =
      this.ctx.terrain?.riverMask?.(x, z) ?? terrainShape.riverMask(x, z);
    const dry =
      smoothstep(this.waterLevel - 0.01, this.waterLevel + 0.04, y) *
      (1 - river);
    return (
      Math.min(depth, 1.2) *
      0.05 *
      (0.3 + 0.7 * smoothstep(0.45, 0.9, ny)) *
      dry
    );
  }

  _refreshGrid() {
    const grid = this.ctx.modules?.terrain?.landscape?.grid;
    if (grid === this._grid) return;
    this._grid = grid ?? null;
    if (!grid) return;
    this._xs = new Float32Array(grid.nx);
    this._zs = new Float32Array(grid.nz);
    for (let x = 0; x < grid.nx; x++) this._xs[x] = grid.pos[x * 3];
    for (let z = 0; z < grid.nz; z++)
      this._zs[z] = grid.pos[z * grid.nx * 3 + 2];
  }

  _axisCell(axis, value) {
    let low = 0,
      high = axis.length - 1;
    while (high - low > 1) {
      const mid = (low + high) >> 1;
      if (axis[mid] <= value) low = mid;
      else high = mid;
    }
    return low;
  }

  _vertexHeight(index) {
    const offset = index * 3;
    const p = this._grid.pos;
    return (
      p[offset + 1] +
      this._snowLift(
        p[offset],
        p[offset + 1],
        p[offset + 2],
        this._grid.nrm[offset + 1],
      )
    );
  }

  groundHeight(x, z) {
    this._refreshGrid();
    const grid = this._grid;
    if (!grid) {
      const y = terrainHeight(x, z);
      return y + this._snowLift(x, y, z, terrainNormal(x, z, this._normal).y);
    }
    const ix = this._axisCell(this._xs, x),
      iz = this._axisCell(this._zs, z);
    const u = clamp(
      (x - this._xs[ix]) / (this._xs[ix + 1] - this._xs[ix]),
      0,
      1,
    );
    const v = clamp(
      (z - this._zs[iz]) / (this._zs[iz + 1] - this._zs[iz]),
      0,
      1,
    );
    const a = iz * grid.nx + ix,
      b = a + 1,
      c = a + grid.nx,
      d = c + 1;
    const pos = grid.pos;
    // Match buildTerrainSurfaceGeometry's diagonal choice before snow moves
    // vertices. Snow is applied per vertex, not at the interpolated point.
    if (
      Math.abs(pos[a * 3 + 1] - pos[d * 3 + 1]) <
      Math.abs(pos[c * 3 + 1] - pos[b * 3 + 1])
    ) {
      return v >= u
        ? this._vertexHeight(a) * (1 - v) +
            this._vertexHeight(c) * (v - u) +
            this._vertexHeight(d) * u
        : this._vertexHeight(a) * (1 - u) +
            this._vertexHeight(d) * v +
            this._vertexHeight(b) * (u - v);
    }
    return u + v <= 1
      ? this._vertexHeight(a) * (1 - u - v) +
          this._vertexHeight(c) * v +
          this._vertexHeight(b) * u
      : this._vertexHeight(c) * (1 - u) +
          this._vertexHeight(d) * (u + v - 1) +
          this._vertexHeight(b) * (1 - v);
  }

  sampleSurface(x, z, out = {}) {
    const groundY = this.groundHeight(x, z);
    const water = this.ctx.modules?.water;
    const world = this.ctx.world;
    const state = this._waterState;
    state.level = this.waterLevel;
    state.flow = water?.flow ?? 1;
    state.ice = water?.ice ?? this.ctx.fields?.lakeFrozen ?? 0;
    state.iceTemp = water?.iceTemp ?? world?.seaLevelTemp ?? 10;
    state.lapse = world?.temperatureAt
      ? world.seaLevelTemp - world.temperatureAt(1)
      : 5;
    const wet = Number.isFinite(groundY)
      ? sampleNavigableWater(x, z, groundY, state)
      : null;
    const iceCoverage = wet?.iceCoverage ?? 0;
    const ice = !!wet && iceCoverage >= 0.8;
    // Thin ice gradually supports more of the body before it becomes a
    // standing surface. This avoids a full body-draft step at the ice edge.
    const draft = this.swimDraft * (1 - smoothstep(0.1, 0.8, iceCoverage));
    const supportY = wet ? Math.max(groundY, wet.waterY - draft) : groundY;
    Object.assign(out, {
      kind: wet ? (ice ? "ice" : "water") : "land",
      groundY,
      waterY: wet?.waterY ?? null,
      depth: wet?.depth ?? 0,
      supportY,
      swimming: !!wet && !ice && wet.depth > draft + 1e-6,
      iceCoverage,
    });
    return out;
  }

  supportHeight(x, z) {
    return this.sampleSurface(x, z).supportY;
  }

  _hasClearance(x, z) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
    this._refreshObstacles();
    const edge = this.radius + 0.012;
    if (
      Math.abs(x) > LANDSCAPE_BOUNDS.halfW - edge ||
      Math.abs(z) > LANDSCAPE_BOUNDS.halfD - edge
    )
      return false;
    for (const obstacle of this.obstacles) {
      if (explorationObstacleDistance(x, z, obstacle) < this.radius + 0.002)
        return false;
    }
    return true;
  }

  isWalkable(x, z) {
    return this._canTraverse(x, z, false);
  }

  isTraversable(x, z) {
    return this._canTraverse(x, z, true);
  }

  _isRiverBank(x, z, surface) {
    const river = queryRiver(x, z);
    if (
      !river ||
      (river.seg > 1.04 && river.seg < 1.93) ||
      river.dist > riverHalfWidth(river.t) * 1.9 + 0.05 + EXPLORATION_BANK_REACH
    )
      return false;
    // The river's broad terrain-carving mask includes cliffs and the waterfall.
    // Grant a bank allowance only beside actual visible water. High lake levels
    // can own the river-mouth pixels, so either rendered water surface counts.
    for (let step = 1; step <= 15; step++) {
      const distance = (EXPLORATION_BANK_REACH * step) / 15;
      const px = x - river.dirZ * river.side * distance;
      const pz = z + river.dirX * river.side * distance;
      const water = sampleNavigableWater(
        px,
        pz,
        this.groundHeight(px, pz),
        this._waterState,
      );
      if (water && surface.groundY <= water.waterY + this.height) return true;
    }
    return false;
  }

  _canTraverse(x, z, allowWater) {
    if (!this._hasClearance(x, z)) return false;
    const surface = this.sampleSurface(x, z);
    if (!Number.isFinite(surface.supportY)) return false;
    if (surface.kind === "water") return allowWater;
    if (surface.kind === "ice") return true;
    const y = surface.groundY;
    // A terrain fragment removed by the railway bore is not a walking floor.
    if (railwayTunnelContains(x, y + 0.001, z)) return false;
    let bank;
    for (const [ox, oz] of EXPLORATION_FOOT_OFFSETS) {
      const px = x + ox * this.radius,
        pz = z + oz * this.radius;
      const next = this.sampleSurface(px, pz);
      // Water is a supported destination; the submerged bank's slope must
      // not create an invisible barrier around otherwise reachable shores.
      if (allowWater && next.kind !== "land") continue;
      if (!allowWater && next.kind === "water") return false;
      const difference = Math.abs(next.supportY - y);
      if (difference <= this.radius * this.maxSlope) continue;
      bank ??= allowWater && this._isRiverBank(x, z, surface);
      if (!bank || difference > this.radius * EXPLORATION_BANK_SLOPE)
        return false;
    }
    return true;
  }

  findSpawn(preferred, { allowWater = true } = {}) {
    const candidates = [];
    if (Number.isFinite(preferred?.x) && Number.isFinite(preferred?.z))
      candidates.push(preferred);
    candidates.push(
      { x: -2.4, z: 2.2 },
      { x: -3.7, z: 2.2 },
      { x: -6.5, z: 4.8 },
      { x: 8.7, z: 0.8 },
    );
    for (const candidate of candidates) {
      if (this._canTraverse(candidate.x, candidate.z, allowWater))
        return {
          x: candidate.x,
          y: this.supportHeight(candidate.x, candidate.z),
          z: candidate.z,
        };
      for (let ring = 1; ring <= 12; ring++) {
        const radius = ring * 0.12;
        for (let direction = 0; direction < 16; direction++) {
          const angle = (direction * Math.PI) / 8;
          const x = candidate.x + Math.cos(angle) * radius;
          const z = candidate.z + Math.sin(angle) * radius;
          if (this._canTraverse(x, z, allowWater))
            return { x, y: this.supportHeight(x, z), z };
        }
      }
    }
    return null;
  }

  // Validate one collision substep; path planning uses the same short segments
  // as move(), so bank rules cannot diverge between wandering and player input.
  canStep(x, z, nextX, nextZ) {
    if (!this.isTraversable(nextX, nextZ)) return false;
    const previous = this.sampleSurface(x, z);
    const next = this.sampleSurface(nextX, nextZ);
    if (previous.kind !== "land" && next.kind !== "land") return true;
    const distance = Math.hypot(nextX - x, nextZ - z);
    const difference = Math.abs(next.supportY - previous.supportY);
    if (difference <= distance * this.maxSlope + 0.001) return true;
    return (
      difference <= distance * EXPLORATION_BANK_SLOPE + 0.001 &&
      (previous.kind !== "land" || this._isRiverBank(x, z, previous)) &&
      (next.kind !== "land" || this._isRiverBank(nextX, nextZ, next))
    );
  }

  _tryStep(dx, dz) {
    const { x, z } = this.position;
    const nextX = x + dx,
      nextZ = z + dz;
    if (!this.canStep(x, z, nextX, nextZ)) return false;
    const next = this.sampleSurface(nextX, nextZ);
    this.position.x = nextX;
    this.position.z = nextZ;
    if (this.grounded || this.swimming) this.position.y = next.supportY;
    return true;
  }

  _advanceVertical(dt) {
    this.sampleSurface(this.position.x, this.position.z, this.surface);
    const support = this.surface.supportY;
    if (this.grounded || this.swimming) {
      this.position.y = support;
      this.verticalVelocity = 0;
      this.swimming = this.surface.swimming;
      this.grounded = !this.swimming;
      return;
    }
    // Exact constant-acceleration integration keeps the arc stable across
    // frame rates. UI mode still runs this step with no horizontal movement.
    const step = Number.isFinite(dt) ? clamp(dt, 0, 0.05) : 0;
    this.position.y +=
      this.verticalVelocity * step - 0.5 * EXPLORATION_GRAVITY * step * step;
    this.verticalVelocity -= EXPLORATION_GRAVITY * step;
    if (
      this.position.y <= support &&
      (this.verticalVelocity <= 0 || this.position.y < support - 1e-9)
    ) {
      this.position.y = support;
      this.verticalVelocity = 0;
      this.swimming = this.surface.swimming;
      this.grounded = !this.swimming;
    } else {
      this.position.y = Math.max(this.position.y, support);
    }
  }

  move(dx, dz, dt = 0) {
    if (!Number.isFinite(dx) || !Number.isFinite(dz)) return this.position;
    if (!this.isTraversable(this.position.x, this.position.z)) {
      const safe = this.findSpawn(this.position);
      if (!safe) return this.position;
      Object.assign(this.position, safe);
      this.resetVertical();
    }
    if (this.grounded || this.swimming)
      this.position.y = this.supportHeight(this.position.x, this.position.z);
    const distance = Math.hypot(dx, dz);
    // Bound work after tab suspension while keeping every collision substep
    // smaller than half the body radius, including large direct move requests.
    const travel = Math.min(distance, 32);
    const steps = Math.max(1, Math.ceil(travel / (this.radius * 0.45)));
    const scale = distance > 0 ? travel / distance / steps : 0;
    const sx = dx * scale,
      sz = dz * scale;
    for (let step = 0; step < steps; step++) {
      if (this._tryStep(sx, sz)) continue;
      // Resolve the longer axis first so diagonal contact slides along walls.
      if (Math.abs(sx) >= Math.abs(sz)) {
        if (sx) this._tryStep(sx, 0);
        if (sz) this._tryStep(0, sz);
      } else {
        if (sz) this._tryStep(0, sz);
        if (sx) this._tryStep(sx, 0);
      }
    }
    this._advanceVertical(dt);
    return this.position;
  }
}

export { ExplorationNavigation };
