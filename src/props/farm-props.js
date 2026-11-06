import { clamp, createSeededRandom, damp } from "../core/math.js";
import { FARM } from "../layout/farm-layout.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import {
  ThreeGroup,
  ThreeMatrix4,
  ThreeMesh,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import {
  PROP_MATERIAL_KINDS,
  PropGeometryBuilder,
  composeChildPropTransform,
  createPropColor,
} from "./geometry.js";
import { createPropMaterial } from "./material.js";
import { PROP_COLORS, createPropSurface } from "./palette.js";

const FARM_WOOD = createPropColor("#8c8270");
const FARM_HAY = createPropColor("#b5a166");
const FARM_ROOF = createPropColor("#706b50");

// Each prop uses its own material seed; building this farm never advances
// the original cabin/yard/jetty palette's shared random stream.
class FarmProps {
  constructor(ctx, parent = ctx.scene) {
    this.ctx = ctx;
    this.random = createSeededRandom(504817);
    this.group = new ThreeGroup();
    this.group.name = "farm-props";
    this.frame = new ThreeMatrix4();
    this.shelterFootings = [];
    this.stats = { hayBales: 0, crates: 1, tools: 1 };
    this.uniforms = {
      uLifeGlow: { value: 0 },
      uLifeFlicker: { value: 0 },
      uLifeWet: { value: 0 },
      uRoofSnow: { value: 0 },
    };

    const builder = new PropGeometryBuilder();
    this._buildShelter(builder);
    for (const bale of FARM.hay) this._buildHayBale(builder, bale);
    this.geometry = builder.toGeometry();
    this.material = createPropMaterial(
      ctx,
      this.uniforms,
      terrainHeight(FARM.shelter.x, FARM.shelter.z),
    );
    this.mesh = new ThreeMesh(this.geometry, this.material);
    this.mesh.name = "farm-shed-and-tools";
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.matrixAutoUpdate = false;
    this.group.add(this.mesh);
    parent.add(this.group);
    Object.assign(this.stats, {
      shelterPosts: this.shelterFootings.length,
      vertices: builder.vertexCount,
      triangles: builder.idx.length / 3,
      drawCalls: 1,
    });
    this.update(0);
  }

  _range(min, max) {
    return min + this.random() * (max - min);
  }

  _surface(color = FARM_WOOD, kind = "grey", options = {}) {
    return createPropSurface(
      color.clone().multiplyScalar(this._range(0.88, 1.08)),
      typeof kind === "number" ? kind : PROP_MATERIAL_KINDS[kind],
      { seed: this.random() * 10, ...options },
    );
  }

  _beam(builder, frame, a, b, radius = 0.009, surface = null) {
    builder.cylinder(
      frame,
      ...a,
      ...b,
      [radius * 1.04, radius * 0.96],
      6,
      surface ?? this._surface(),
    );
  }

  _buildShelter(builder) {
    const { x, z, width, depth, yaw = 0 } = FARM.shelter;
    const baseY = terrainHeight(x, z);
    const frame = composeChildPropTransform(this.frame, x, baseY, z, yaw);
    const halfWidth = width / 2;
    const halfDepth = depth / 2;
    const eaves = 0.36;
    const ridge = 0.51;
    const point = new ThreeVector3();
    for (const px of [-halfWidth, halfWidth]) {
      for (const pz of [-halfDepth, halfDepth]) {
        point.set(px, 0, pz).applyMatrix4(frame);
        const ground = terrainHeight(point.x, point.z);
        this.shelterFootings.push({
          x: point.x,
          z: point.z,
          ground,
          top: baseY + eaves,
        });
        this._beam(
          builder,
          frame,
          [px, ground - baseY - 0.025, pz],
          [px, eaves, pz],
          0.021,
          this._surface(PROP_COLORS.logC, "log"),
        );
        builder.blob(
          frame,
          px,
          ground - baseY + 0.008,
          pz,
          0.034,
          this._surface(PROP_COLORS.stoneW, "stone"),
          0,
          0.45,
        );
      }
    }
    for (const side of [-1, 1]) {
      this._beam(
        builder,
        frame,
        [-halfWidth - 0.02, eaves, side * halfDepth],
        [halfWidth + 0.02, eaves, side * halfDepth],
        0.019,
      );
      this._beam(
        builder,
        frame,
        [side * halfWidth, eaves, -halfDepth],
        [side * halfWidth, eaves, halfDepth],
        0.016,
      );
      this._beam(
        builder,
        frame,
        [side * halfWidth, eaves, -halfDepth],
        [side * halfWidth, ridge, 0],
        0.014,
      );
      this._beam(
        builder,
        frame,
        [side * halfWidth, ridge, 0],
        [side * halfWidth, eaves, halfDepth],
        0.014,
      );
      this._beam(
        builder,
        frame,
        [side * halfWidth, eaves - 0.12, halfDepth],
        [side * (halfWidth - 0.12), eaves, halfDepth],
        0.011,
      );
    }
    this._beam(
      builder,
      frame,
      [-halfWidth - 0.04, ridge, 0],
      [halfWidth + 0.04, ridge, 0],
      0.017,
    );

    // A boarded back and a short side screen leave the front visibly open.
    const boards = Math.ceil(width / 0.055);
    for (let i = 0; i < boards; i++) {
      const px = -halfWidth + width * ((i + 0.5) / boards);
      point.set(px, 0, -halfDepth).applyMatrix4(frame);
      const bottom = terrainHeight(point.x, point.z) - baseY - 0.01;
      const top = eaves + this._range(-0.008, 0.004);
      builder.box(
        composeChildPropTransform(frame, px, (bottom + top) / 2, -halfDepth),
        width / boards - 0.004,
        top - bottom,
        0.014,
        this._surface(PROP_COLORS.plank, "plank", { grain: "y", expo: 0.65 }),
      );
    }
    for (const h of [0.1, 0.185, 0.27]) {
      builder.box(
        composeChildPropTransform(frame, -halfWidth, h, 0),
        0.014,
        0.065,
        depth,
        this._surface(PROP_COLORS.plank, "plank", { grain: "z", expo: 0.65 }),
      );
    }
    this._buildShelterRoof(
      builder,
      frame,
      halfWidth + 0.055,
      halfDepth + 0.055,
      ridge,
      eaves - 0.025,
    );
    this._buildTools(builder, frame, width, depth);
  }

  _buildShelterRoof(builder, frame, halfWidth, halfDepth, ridge, eave) {
    const rise = ridge - eave;
    const slopeLength = Math.hypot(halfDepth, rise);
    const pitch = Math.atan2(rise, halfDepth);
    const rows = Math.ceil(slopeLength / 0.045);
    for (const side of [-1, 1]) {
      const normal = new ThreeVector3(0, halfDepth, side * rise).normalize();
      const roofNormal = normal.clone().transformDirection(frame);
      const surface = this._surface(FARM_ROOF, "roof");
      builder.box(
        composeChildPropTransform(
          frame,
          0,
          (ridge + eave) / 2 - 0.009,
          (side * halfDepth) / 2,
          0,
          side * pitch,
        ),
        halfWidth * 2,
        0.014,
        slopeLength,
        this._surface(PROP_COLORS.plank, "plank", {
          grain: "z",
          expo: 0.15,
          skip: "py",
        }),
      );
      const at = (px, t, lift = 0) => [
        px,
        ridge - rise * t + normal.y * lift,
        side * halfDepth * t + normal.z * lift,
      ];
      for (let row = 0; row < rows; row++) {
        const outer = 1 - row / rows;
        const inner = 1 - (row + 1) / rows;
        const lift = 0.004;
        let points = [
          at(-halfWidth, outer, lift),
          at(halfWidth, outer, lift),
          at(halfWidth, inner),
          at(-halfWidth, inner),
        ];
        let grains = [
          [-halfWidth, slopeLength * outer, row],
          [halfWidth, slopeLength * outer, row],
          [halfWidth, slopeLength * inner, row],
          [-halfWidth, slopeLength * inner, row],
        ];
        let roof = [lift, lift, 0, 0].map((step) => [
          roofNormal.x,
          roofNormal.y,
          roofNormal.z,
          step,
        ]);
        if (side < 0) {
          points = points.reverse();
          grains = grains.reverse();
          roof = roof.reverse();
        }
        builder.quad(frame, points, grains, surface, roof);
      }
      this._beam(
        builder,
        frame,
        [-halfWidth, eave, side * halfDepth],
        [halfWidth, eave, side * halfDepth],
        0.011,
      );
    }
  }

  _buildHayBale(builder, { x, z, yaw = 0, scale = 1 }) {
    const radius = 0.095;
    const length = 0.26;
    const dx = Math.cos(yaw) * length * scale * 0.45;
    const dz = -Math.sin(yaw) * length * scale * 0.45;
    const ground = Math.max(
      terrainHeight(x, z),
      terrainHeight(x - dx, z - dz),
      terrainHeight(x + dx, z + dz),
    );
    const frame = composeChildPropTransform(
      this.frame,
      x,
      ground + radius * scale * 0.97,
      z,
      yaw,
    );
    frame.scale(new ThreeVector3(scale, scale, scale));
    const hay = this._surface(FARM_HAY, "rope", { expo: 0.9 });
    builder.cylinder(
      frame,
      -length / 2,
      0,
      0,
      length / 2,
      0,
      0,
      [radius, radius * 0.95],
      14,
      hay,
    );
    // Visible cut straw, irregular perimeter strands and two twine bindings.
    for (const px of [-length / 2 - 0.001, length / 2 + 0.001]) {
      for (let i = 0; i < 12; i++) {
        const angle = this.random() * Math.PI * 2;
        const r = Math.sqrt(this.random()) * radius * 0.86;
        const y = Math.cos(angle) * r;
        const pz = Math.sin(angle) * r;
        this._beam(
          builder,
          frame,
          [px, y - 0.009, pz - 0.004],
          [px, y + 0.012, pz + 0.004],
          0.0014,
          this._surface(FARM_HAY, "rope"),
        );
      }
    }
    for (const px of [-0.075, 0.075]) {
      const twine = this._surface(
        PROP_COLORS.rope.clone().multiplyScalar(0.62),
        "rope",
      );
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        const b = ((i + 1) / 14) * Math.PI * 2;
        this._beam(
          builder,
          frame,
          [px, Math.cos(a) * radius * 1.01, Math.sin(a) * radius * 1.01],
          [px, Math.cos(b) * radius * 1.01, Math.sin(b) * radius * 1.01],
          0.0024,
          twine,
        );
      }
    }
    for (let i = 0; i < 10; i++) {
      const angle = this._range(-Math.PI * 0.48, Math.PI * 0.48);
      const px = this._range(-0.12, 0.12);
      const y = Math.cos(angle) * radius;
      const pz = Math.sin(angle) * radius;
      this._beam(
        builder,
        frame,
        [px - 0.025, y, pz],
        [
          px + 0.03,
          y + this._range(0.001, 0.008),
          pz + this._range(-0.006, 0.006),
        ],
        0.0012,
        hay,
      );
    }
    this.stats.hayBales++;
  }

  _buildTools(builder, frame, width, depth) {
    const localX = -width * 0.2;
    const localZ = -depth * 0.15;
    const point = new ThreeVector3(localX, 0, localZ).applyMatrix4(frame);
    const ground = terrainHeight(point.x, point.z) - frame.elements[13];
    const crate = composeChildPropTransform(
      frame,
      localX,
      ground,
      localZ,
      -0.13,
    );
    const boards = this._surface(PROP_COLORS.plankL, "plank", {
      grain: "x",
      expo: 0.35,
    });
    builder.box(
      composeChildPropTransform(crate, 0, 0.006, 0),
      0.18,
      0.016,
      0.135,
      boards,
    );
    for (const height of [0.032, 0.075]) {
      for (const side of [-1, 1]) {
        builder.box(
          composeChildPropTransform(crate, 0, height, side * 0.063),
          0.19,
          0.033,
          0.012,
          boards,
        );
        builder.box(
          composeChildPropTransform(crate, side * 0.087, height, 0),
          0.012,
          0.033,
          0.135,
          boards,
        );
      }
    }
    for (const x of [-0.077, 0.077])
      for (const z of [-0.052, 0.052])
        builder.box(
          composeChildPropTransform(crate, x, 0.05, z),
          0.014,
          0.11,
          0.014,
          this._surface(FARM_WOOD, "grey", { grain: "y", expo: 0.35 }),
        );

    // A rake leans into the back of the open shed, with its teeth on the soil.
    const toolX = width * 0.27;
    point.set(toolX, 0, depth * 0.15).applyMatrix4(frame);
    const toolGround = terrainHeight(point.x, point.z) - frame.elements[13];
    const tool = composeChildPropTransform(
      frame,
      toolX,
      toolGround,
      depth * 0.15,
    );
    this._beam(
      builder,
      tool,
      [0, 0.027, 0],
      [0, 0.325, -0.17],
      0.0045,
      this._surface(PROP_COLORS.plankL, "log"),
    );
    const iron = this._surface(PROP_COLORS.iron, "metal", { expo: 0.45 });
    this._beam(
      builder,
      tool,
      [-0.065, 0.026, 0],
      [0.065, 0.026, 0],
      0.004,
      iron,
    );
    for (let i = 0; i < 7; i++) {
      const x = -0.06 + i * 0.02;
      this._beam(builder, tool, [x, 0.026, 0], [x, 0.001, 0.013], 0.0022, iron);
    }
  }

  update(dt) {
    if (this.disposed) return;
    const { world, fields } = this.ctx;
    const { x, z } = FARM.shelter;
    const snow = clamp(fields?.snowAt?.(x, z) ?? 0, 0, 1.4) * 0.024;
    this.uniforms.uRoofSnow.value =
      dt > 0 ? damp(this.uniforms.uRoofSnow.value, snow, 0.8, dt) : snow;
    this.uniforms.uLifeWet.value =
      clamp((world?.rainfall ?? 0) * 1.2, 0, 1) * 0.5;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.group.removeFromParent();
    this.geometry.dispose();
    this.material.dispose();
  }
}

export { FarmProps };
