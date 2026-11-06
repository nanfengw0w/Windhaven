import { clamp, createSeededRandom, damp } from "../core/math.js";
import { HIKING_TRAIL } from "../layout/hiking-layout.js";
import { terrainHeight } from "../simulation/terrain-shape.js";
import {
  ThreeGroup,
  ThreeMatrix4,
  ThreeMesh,
  ThreeMeshDepthMaterial,
  ThreeRGBADepthPacking,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import {
  PROP_MATERIAL_KINDS,
  PropGeometryBuilder,
  composeChildPropTransform,
} from "./geometry.js";
import { createPropMaterial } from "./material.js";
import { PROP_COLORS, createPropSurface } from "./palette.js";

// Match the cabin's timber and shingle construction at the same human scale.
class HikingTrail {
  constructor(ctx, parent = ctx.scene) {
    this.ctx = ctx;
    this.random = createSeededRandom(142603);
    this.identity = new ThreeMatrix4();
    this.group = new ThreeGroup();
    this.group.name = "hiking-trail";
    this.footings = [];
    this.parts = [];
    this.uniforms = {
      uLifeGlow: { value: 0 },
      uLifeFlicker: { value: 0 },
      uLifeWet: { value: 0 },
      uRoofSnow: { value: 0 },
    };
    const builder = new PropGeometryBuilder();
    this._part(builder, "shelter", () => this._shelter(builder));
    for (const bench of HIKING_TRAIL.benches)
      this._part(builder, "bench", () => this._bench(builder, bench));
    for (const sign of HIKING_TRAIL.signs)
      this._part(builder, "sign", () => this._sign(builder, sign));
    this.geometry = builder.toGeometry();
    const { x, z } = HIKING_TRAIL.shelter;
    this.material = createPropMaterial(ctx, this.uniforms, terrainHeight(x, z));
    this.material.customProgramCacheKey = () => "wg-hiking-trail-v1";
    this.depthMaterial = this._depthMaterial();
    this.mesh = new ThreeMesh(this.geometry, this.material);
    this.mesh.name = "hiking-shelter-benches-and-signs";
    this.mesh.castShadow = this.mesh.receiveShadow = true;
    this.mesh.customDepthMaterial = this.depthMaterial;
    this.geometry.boundingBox.max.y += 0.06;
    this.geometry.boundingSphere.radius += 0.06;
    this.group.add(this.mesh);
    parent.add(this.group);
    this.stats = {
      shelters: 1,
      benches: HIKING_TRAIL.benches.length,
      signs: HIKING_TRAIL.signs.length,
      vertices: builder.vertexCount,
      triangles: builder.idx.length / 3,
      drawCalls: 1,
    };
    this.update(0);
  }

  _part(builder, kind, build) {
    const start = builder.vertexCount;
    build();
    // Keep ranges in the merged mesh so clearance checks include roof edges,
    // chair backs and sign arrows, rather than checking placement centres.
    this.parts.push({ kind, start, count: builder.vertexCount - start });
  }

  _surface(color = PROP_COLORS.plank, kind = "plank", options = {}) {
    return createPropSurface(
      color.clone().multiplyScalar(0.92 + this.random() * 0.16),
      PROP_MATERIAL_KINDS[kind],
      { seed: this.random() * 10, ...options },
    );
  }

  _frame({ x, z, yaw = 0 }) {
    return composeChildPropTransform(
      this.identity,
      x,
      terrainHeight(x, z),
      z,
      yaw,
    );
  }

  _ground(frame, x, z) {
    const point = new ThreeVector3(x, 0, z).applyMatrix4(frame);
    return terrainHeight(point.x, point.z) - frame.elements[13];
  }

  _footing(frame, x, y, z, kind) {
    const point = new ThreeVector3(x, y, z).applyMatrix4(frame);
    this.footings.push({
      kind,
      x: point.x,
      z: point.z,
      bottom: point.y,
      ground: terrainHeight(point.x, point.z),
    });
  }

  _box(builder, frame, center, size, surface) {
    builder.box(composeChildPropTransform(frame, ...center), ...size, surface);
  }

  _beam(builder, frame, a, b, radius = 0.01, surface = null) {
    builder.cylinder(
      frame,
      ...a,
      ...b,
      radius,
      6,
      surface ?? this._surface(PROP_COLORS.logC, "log"),
    );
  }

  _post(builder, frame, x, z, top, kind, radius = 0.02) {
    const bottom = this._ground(frame, x, z) - 0.018;
    this._beam(builder, frame, [x, bottom, z], [x, top, z], radius);
    this._footing(frame, x, bottom, z, kind);
  }

  _shelter(builder) {
    const shelter = HIKING_TRAIL.shelter;
    const frame = this._frame(shelter);
    const { eaves, ridge } = shelter;
    const w = shelter.width / 2,
      d = shelter.depth / 2;
    for (const x of [-w, w]) {
      for (const z of [-d, d])
        this._post(builder, frame, x, z, eaves, "shelter-post", 0.014);
      this._beam(builder, frame, [x, eaves, -d], [x, eaves, d], 0.013);
      this._beam(builder, frame, [x, eaves, -d], [x, ridge, 0]);
      this._beam(builder, frame, [x, ridge, 0], [x, eaves, d]);
      this._beam(
        builder,
        frame,
        [x, eaves - 0.09, d],
        [x - Math.sign(x) * 0.09, eaves, d],
        0.008,
      );
      this._beam(
        builder,
        frame,
        [x, eaves - 0.09, -d],
        [x, eaves, -d + 0.09],
        0.008,
      );
    }
    for (const z of [-d, d])
      this._box(
        builder,
        frame,
        [0, eaves, z],
        [shelter.width + 0.035, 0.024, 0.025],
        this._surface(PROP_COLORS.logC),
      );
    this._beam(
      builder,
      frame,
      [-w - 0.055, ridge, 0],
      [w + 0.055, ridge, 0],
      0.012,
    );
    // The lower back wall shelters seated walkers while the front stays open.
    for (let index = 0; index < 20; index++) {
      const x = -w + ((index + 0.5) * shelter.width) / 20;
      const bottom = this._ground(frame, x, -d) - 0.012;
      const top = 0.19;
      this._box(
        builder,
        frame,
        [x, (bottom + top) / 2, -d],
        [shelter.width / 20 - 0.002, top - bottom, 0.009],
        this._surface(
          PROP_COLORS.grey.clone().lerp(PROP_COLORS.plank, 0.4),
          "grey",
          { grain: "y", expo: 0.5 },
        ),
      );
    }
    this._box(
      builder,
      frame,
      [0, 0.195, -d],
      [shelter.width + 0.015, 0.012, 0.021],
      this._surface(PROP_COLORS.plankL),
    );
    // The roof underside sits above the beam corners, including their depth.
    this._roof(
      builder,
      frame,
      w + 0.055,
      d + 0.06,
      eaves - 0.012,
      ridge + 0.018,
    );
  }

  _roof(builder, frame, w, d, eave, ridge) {
    const rise = ridge - eave,
      length = Math.hypot(d, rise),
      pitch = Math.atan2(rise, d),
      rows = Math.ceil(length / 0.034),
      columns = 12;
    for (const side of [-1, 1]) {
      const normal = new ThreeVector3(0, d, side * rise).normalize();
      const worldNormal = normal.clone().transformDirection(frame);
      builder.box(
        composeChildPropTransform(
          frame,
          0,
          (ridge + eave) / 2 - 0.01,
          (side * d) / 2,
          0,
          side * pitch,
        ),
        w * 2,
        0.012,
        length,
        this._surface(PROP_COLORS.grey, "grey", {
          grain: "z",
          expo: 0.25,
          skip: "py",
        }),
      );
      // The same narrow overlapping courses and exposed edges as the cabin.
      const roofSurface = this._surface(PROP_COLORS.shingle, "roof", {
        expo: 1,
      });
      for (let row = 0; row < rows; row++) {
        const outer = 1 - row / rows,
          inner = 1 - (row + 1) / rows;
        const at = (x, t, lift) => [
          x,
          ridge - rise * t + normal.y * lift,
          side * d * t + normal.z * lift,
        ];
        for (let column = 0; column < columns; column++) {
          const left = -w + (column * w * 2) / columns,
            right = -w + ((column + 1) * w * 2) / columns;
          for (const lip of [false, true]) {
            const xs = [left, right, right, left];
            const ts = lip
              ? [outer, outer, outer, outer]
              : [outer, outer, inner, inner];
            const lifts = lip ? [0, 0, 0.0045, 0.0045] : [0.0045, 0.0045, 0, 0];
            const points = xs.map((x, i) => at(x, ts[i], lifts[i]));
            const grain = xs.map((x, i) => [
              x,
              length * ts[i] + (lip ? 0.001 : 0),
              row,
            ]);
            const roof = lifts.map((lift) => [
              worldNormal.x,
              worldNormal.y,
              worldNormal.z,
              lift,
            ]);
            if (side < 0) {
              points.reverse();
              grain.reverse();
              roof.reverse();
            }
            builder.quad(frame, points, grain, roofSurface, roof);
          }
        }
      }
      this._box(
        builder,
        frame,
        [0, eave - 0.003, side * (d + 0.003)],
        [w * 2 + 0.018, 0.024, 0.008],
        this._surface(PROP_COLORS.plankL),
      );
      for (const x of [-w, w])
        builder.box(
          composeChildPropTransform(
            frame,
            x,
            (ridge + eave) / 2 - 0.004,
            (side * d) / 2,
            0,
            side * pitch,
          ),
          0.01,
          0.027,
          length + 0.012,
          this._surface(PROP_COLORS.plankL, "plank", { grain: "z", expo: 0.7 }),
        );
      builder.box(
        composeChildPropTransform(
          frame,
          0,
          ridge + 0.002,
          side * 0.009,
          0,
          side * pitch,
        ),
        w * 2 + 0.01,
        0.006,
        0.027,
        this._surface(PROP_COLORS.grey, "grey", { expo: 1 }),
      );
    }
  }

  _bench(builder, bench) {
    const frame = this._frame(bench);
    const w = bench.width / 2;
    const feet = [-w * 0.72, w * 0.72].flatMap((x) =>
      [-0.025, 0.025].map((z) => [x, z]),
    );
    const seat =
      Math.max(...feet.map(([x, z]) => this._ground(frame, x, z))) + 0.062;
    for (const [x, z] of feet)
      this._post(builder, frame, x, z, seat, "bench-leg", 0.006);
    for (const z of [-0.026, 0, 0.026])
      this._box(
        builder,
        frame,
        [0, seat, z],
        [bench.width, 0.008, 0.023],
        this._surface(PROP_COLORS.grey, "grey", { expo: 1 }),
      );
    for (const x of [-w * 0.72, w * 0.72]) {
      this._box(
        builder,
        frame,
        [x, seat - 0.01, 0],
        [0.012, 0.013, 0.078],
        this._surface(PROP_COLORS.logC, "plank", { grain: "z" }),
      );
      this._beam(
        builder,
        frame,
        [x, seat - 0.025, -0.028],
        [x, seat + 0.07, -0.044],
        0.005,
      );
    }
    this._beam(
      builder,
      frame,
      [-w * 0.72, seat - 0.032, 0],
      [w * 0.72, seat - 0.032, 0],
      0.005,
    );
    for (const height of [0.032, 0.059])
      builder.box(
        composeChildPropTransform(
          frame,
          0,
          seat + height,
          -0.028 - height * 0.17,
          0,
          -0.17,
        ),
        bench.width,
        0.021,
        0.007,
        this._surface(PROP_COLORS.grey, "grey", { expo: 1 }),
      );
  }

  _sign(builder, sign) {
    const frame = this._frame(sign);
    this._post(builder, frame, 0, 0, 0.225, "sign-post", 0.007);
    // Two opposing silhouettes remain legible without tiny text or symbols.
    for (const [side, y] of [
      [1, 0.19],
      [-1, 0.145],
    ]) {
      const surface = this._surface(PROP_COLORS.plankL, "plank", { expo: 0.7 });
      this._box(
        builder,
        frame,
        [side * 0.02, y, 0.002],
        [0.105, 0.026, 0.011],
        surface,
      );
      const baseX = side * 0.0725,
        tipX = side * 0.0975;
      const a = [baseX, y - 0.013, -0.0035],
        b = [tipX, y, -0.0035],
        c = [baseX, y + 0.013, -0.0035];
      const d = a.map((v, i) => (i === 2 ? 0.0075 : v)),
        e = b.map((v, i) => (i === 2 ? 0.0075 : v)),
        f = c.map((v, i) => (i === 2 ? 0.0075 : v));
      const back = side > 0 ? [c, b, a] : [a, b, c];
      const front = side > 0 ? [d, e, f] : [f, e, d];
      const grain = [
        [0, 0, 0],
        [0.025, 0.013, 0],
        [0, 0.026, 0],
      ];
      builder.tri(frame, back, grain, surface);
      builder.tri(frame, front, grain, surface);
      builder.quad(
        frame,
        side > 0 ? [a, b, e, d] : [d, e, b, a],
        [
          [0, 0, 0],
          [0.025, 0, 0],
          [0.025, 0.011, 0],
          [0, 0.011, 0],
        ],
        surface,
      );
      builder.quad(
        frame,
        side > 0 ? [b, c, f, e] : [e, f, c, b],
        [
          [0, 0, 0],
          [0.025, 0, 0],
          [0.025, 0.011, 0],
          [0, 0.011, 0],
        ],
        surface,
      );
    }
  }

  _depthMaterial() {
    const material = new ThreeMeshDepthMaterial({
      depthPacking: ThreeRGBADepthPacking,
    });
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.ctx.uniforms, this.uniforms);
      shader.vertexShader =
        this.ctx.GLSL_COMMON +
        `
attribute vec4 aRoof;
uniform float uRoofSnow;
` +
        shader.vertexShader.replace(
          "#include <begin_vertex>",
          `
#include <begin_vertex>
if (dot(aRoof.xyz, aRoof.xyz) > 0.25) {
  vec3 wpR = (modelMatrix * vec4(transformed, 1.0)).xyz;
  float lump = 0.75 + 0.5 * wgNoise(wpR.xz * 23.0) + 0.25 * wgNoise(wpR.xz * 61.0 + 3.0);
  transformed += aRoof.xyz * max(0.0, uRoofSnow * lump - aRoof.w);
}
`,
        );
    };
    material.customProgramCacheKey = () => "wg-hiking-trail-depth-v1";
    return material;
  }

  update(dt) {
    if (this.disposed) return;
    const { x, z } = HIKING_TRAIL.shelter;
    const snow = clamp(this.ctx.fields?.snowAt?.(x, z) ?? 0, 0, 1.4) * 0.024;
    this.uniforms.uRoofSnow.value =
      dt > 0 ? damp(this.uniforms.uRoofSnow.value, snow, 0.8, dt) : snow;
    this.uniforms.uLifeWet.value =
      clamp((this.ctx.world?.rainfall ?? 0) * 1.2, 0, 1) * 0.5;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.group.removeFromParent();
    this.geometry.dispose();
    this.material.dispose();
    this.depthMaterial.dispose();
  }
}

export { HikingTrail };
