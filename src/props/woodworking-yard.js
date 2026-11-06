import { clamp, createSeededRandom, damp } from "../core/math.js";
import { WOODWORKING_YARD } from "../layout/woodworking-layout.js";
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
  createPropColor,
} from "./geometry.js";
import { createPropMaterial } from "./material.js";
import { PROP_COLORS, createPropSurface } from "./palette.js";

const YARD_WOOD = createPropColor("#8d7353");
const YARD_CUT_WOOD = createPropColor("#c3a16b");
const YARD_ROOF = createPropColor("#756b56");

// Geometry is baked in world space. Each support samples the existing ground;
// no flat platform or terrain flattening is needed for the work yard.
class WoodworkingYard {
  constructor(ctx, parent = ctx.scene) {
    this.ctx = ctx;
    this.random = createSeededRandom(726041);
    this.identity = new ThreeMatrix4();
    this.group = new ThreeGroup();
    this.group.name = "woodworking-yard";
    this.footings = [];
    this.stats = { shelters: 1, logs: 0, carts: 1, wheels: 2, stumps: 0 };
    this.uniforms = {
      uLifeGlow: { value: 0 },
      uLifeFlicker: { value: 0 },
      uLifeWet: { value: 0 },
      uRoofSnow: { value: 0 },
    };
    const builder = new PropGeometryBuilder();
    this._shelter(builder);
    this._logPile(builder);
    this._cart(builder);
    WOODWORKING_YARD.stumps.forEach((stump, index) =>
      this._stump(builder, stump, index === 0),
    );
    this.geometry = builder.toGeometry();
    this.material = createPropMaterial(
      ctx,
      this.uniforms,
      terrainHeight(WOODWORKING_YARD.center.x, WOODWORKING_YARD.center.z),
    );
    // The prop shader embeds a local base height, so it cannot share the
    // cabin/farm program even though the material implementation is reused.
    this.material.customProgramCacheKey = () => "wg-woodworking-yard-v1";
    this.depthMaterial = this._depthMaterial();
    this.mesh = new ThreeMesh(this.geometry, this.material);
    this.mesh.name = "woodworking-shelter-logs-cart-and-stumps";
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.customDepthMaterial = this.depthMaterial;
    this.geometry.boundingBox.max.y += 0.06;
    this.geometry.boundingSphere.radius += 0.06;
    this.group.add(this.mesh);
    parent.add(this.group);
    Object.assign(this.stats, {
      vertices: builder.vertexCount,
      triangles: builder.idx.length / 3,
      drawCalls: 1,
    });
    this.update(0);
  }

  _range(min, max) {
    return min + this.random() * (max - min);
  }

  _surface(color = YARD_WOOD, kind = "plank", options = {}) {
    return createPropSurface(
      color.clone().multiplyScalar(this._range(0.9, 1.1)),
      PROP_MATERIAL_KINDS[kind],
      { seed: this.random() * 10, ...options },
    );
  }

  _frame(x, z, yaw = 0, height = terrainHeight(x, z)) {
    return composeChildPropTransform(this.identity, x, height, z, yaw);
  }

  _box(builder, frame, point, size, surface, yaw = 0) {
    builder.box(
      composeChildPropTransform(frame, ...point, yaw),
      ...size,
      surface,
    );
  }

  _beam(builder, frame, a, b, radius = 0.012, surface = null) {
    builder.cylinder(
      frame,
      ...a,
      ...b,
      radius,
      8,
      surface ?? this._surface(PROP_COLORS.logC, "log"),
    );
  }

  _ground(frame, x, z) {
    const point = new ThreeVector3(x, 0, z).applyMatrix4(frame);
    return terrainHeight(point.x, point.z) - frame.elements[13];
  }

  _recordFooting(frame, x, y, z, kind) {
    const point = new ThreeVector3(x, y, z).applyMatrix4(frame);
    this.footings.push({
      kind,
      x: point.x,
      z: point.z,
      ground: terrainHeight(point.x, point.z),
      bottom: point.y,
    });
  }

  _post(builder, frame, x, z, top, radius = 0.023, kind = "shelter") {
    const bottom = this._ground(frame, x, z) - 0.018;
    this._beam(builder, frame, [x, bottom, z], [x, top, z], radius);
    this._recordFooting(frame, x, bottom, z, kind);
  }

  _log(builder, frame, a, b, radius, exposure = 1) {
    const cut = this._surface(YARD_CUT_WOOD, "log", { expo: exposure });
    builder.cylinder(
      frame,
      ...a,
      ...b,
      [radius, radius * this._range(0.92, 0.99)],
      10,
      this._surface(PROP_COLORS.barkL, "bark", {
        expo: exposure,
        capMat: cut,
        twist: this._range(-0.1, 0.1),
      }),
    );
    this.stats.logs++;
  }

  _shelter(builder) {
    const { x, z, width, depth, yaw, eaves, ridge } = WOODWORKING_YARD.shelter;
    const frame = this._frame(x, z, yaw);
    const w = width / 2;
    const d = depth / 2;
    for (const px of [-w, w]) {
      for (const pz of [-d, d]) this._post(builder, frame, px, pz, eaves);
      this._beam(builder, frame, [px, eaves, -d], [px, eaves, d], 0.022);
      this._beam(builder, frame, [px, eaves, -d], [px, ridge, 0], 0.018);
      this._beam(builder, frame, [px, ridge, 0], [px, eaves, d], 0.018);
      this._beam(builder, frame, [px, eaves - 0.17, d], [px * 0.65, eaves, d]);
    }
    for (const pz of [-d, d])
      this._beam(builder, frame, [-w, eaves, pz], [w, eaves, pz], 0.025);
    this._beam(
      builder,
      frame,
      [-w - 0.06, ridge, 0],
      [w + 0.06, ridge, 0],
      0.022,
    );
    this._beam(builder, frame, [-w, eaves - 0.18, -d], [-w, eaves, -d + 0.2]);
    this._beam(builder, frame, [w, eaves - 0.18, -d], [w, eaves, -d + 0.2]);

    // Weathered back boards and a short left wall leave the front and right
    // open, with the stored lumber visible through the roof frame.
    const boardCount = 17;
    for (let index = 0; index < boardCount; index++) {
      const px = -w + ((index + 0.5) / boardCount) * width;
      const bottom = this._ground(frame, px, -d) - 0.014;
      this._box(
        builder,
        frame,
        [px, (bottom + eaves) / 2, -d],
        [width / boardCount - 0.005, eaves - bottom, 0.019],
        this._surface(PROP_COLORS.grey, "grey", { grain: "y", expo: 0.5 }),
      );
    }
    for (const y of [0.16, 0.25, 0.34])
      this._box(
        builder,
        frame,
        [-w, y, -d * 0.25],
        [0.018, 0.075, depth * 0.75],
        this._surface(YARD_WOOD, "plank", { grain: "z", expo: 0.6 }),
      );
    this._roof(builder, frame, w + 0.075, d + 0.07, eaves - 0.025, ridge);

    const lumberBottom = Math.max(
      this._ground(frame, -0.42, -0.13),
      this._ground(frame, 0.35, -0.13),
      this._ground(frame, -0.42, 0.16),
      this._ground(frame, 0.35, 0.16),
    );
    for (const px of [-0.36, 0.3]) {
      for (const pz of [-0.12, 0.15])
        this._post(
          builder,
          frame,
          px,
          pz,
          lumberBottom + 0.045,
          0.016,
          "lumber-rack",
        );
      this._beam(
        builder,
        frame,
        [px, lumberBottom + 0.035, -0.19],
        [px, lumberBottom + 0.035, 0.2],
        0.02,
      );
    }
    for (let layer = 0; layer < 4; layer++)
      for (let board = 0; board < 3; board++) {
        const length = 0.82 + this._range(-0.05, 0.04);
        this._box(
          builder,
          frame,
          [
            -0.025 + this._range(-0.02, 0.02),
            lumberBottom + 0.061 + layer * 0.021,
            -0.12 + board * 0.1,
          ],
          [length, 0.015, 0.087],
          this._surface(YARD_CUT_WOOD, "plank", { expo: 0.16 }),
        );
      }
    // A couple of unfinished trunks sit in the open right bay.
    for (let row = 0; row < 2; row++)
      this._log(
        builder,
        frame,
        [0.39, lumberBottom + 0.045 + row * 0.068, -0.23],
        [0.39, lumberBottom + 0.045 + row * 0.068, 0.27],
        0.035,
        0.25,
      );
  }

  _roof(builder, frame, w, d, eave, ridge) {
    const rise = ridge - eave;
    const length = Math.hypot(d, rise);
    const pitch = Math.atan2(rise, d);
    const rows = 8;
    for (const side of [-1, 1]) {
      const normal = new ThreeVector3(0, d, side * rise).normalize();
      const worldNormal = normal.clone().transformDirection(frame);
      builder.box(
        composeChildPropTransform(
          frame,
          0,
          (ridge + eave) / 2 - 0.009,
          (side * d) / 2,
          0,
          side * pitch,
        ),
        w * 2,
        0.016,
        length,
        this._surface(PROP_COLORS.plank, "plank", {
          grain: "z",
          expo: 0.2,
          skip: "py",
        }),
      );
      for (let row = 0; row < rows; row++) {
        const outer = 1 - row / rows;
        const inner = 1 - (row + 1) / rows;
        const columns = 16;
        for (let column = 0; column < columns; column++) {
          const left = -w + (column / columns) * w * 2 + 0.001;
          const right = -w + ((column + 1) / columns) * w * 2 - 0.001;
          const lift = this._range(0.003, 0.006);
          const at = (px, t, offset) => [
            px,
            ridge - rise * t + normal.y * offset,
            side * d * t + normal.z * offset,
          ];
          let points = [
            at(left, outer, lift),
            at(right, outer, lift),
            at(right, inner, 0),
            at(left, inner, 0),
          ];
          let grain = [
            [left, length * outer, row],
            [right, length * outer, row],
            [right, length * inner, row],
            [left, length * inner, row],
          ];
          let roof = [lift, lift, 0, 0].map((step) => [
            worldNormal.x,
            worldNormal.y,
            worldNormal.z,
            step,
          ]);
          if (side < 0) {
            points.reverse();
            grain.reverse();
            roof.reverse();
          }
          builder.quad(
            frame,
            points,
            grain,
            this._surface(YARD_ROOF, "roof"),
            roof,
          );
        }
      }
      this._beam(
        builder,
        frame,
        [-w, eave, side * d],
        [w, eave, side * d],
        0.015,
      );
    }
  }

  _logPile(builder) {
    const { x, z, yaw, length, radius } = WOODWORKING_YARD.logPile;
    const frame = this._frame(x, z, yaw);
    const width = radius * 8;
    const top =
      Math.max(
        ...[-width / 2, width / 2].flatMap((px) =>
          [-length * 0.38, length * 0.38].map((pz) =>
            this._ground(frame, px, pz),
          ),
        ),
      ) + 0.025;
    for (const pz of [-length * 0.34, length * 0.34]) {
      this._beam(
        builder,
        frame,
        [-width / 2 - 0.03, top, pz],
        [width / 2 + 0.03, top, pz],
        0.023,
      );
      for (const px of [-width / 2, width / 2])
        this._post(builder, frame, px, pz, top, 0.02, "log-rack");
    }
    for (let row = 0; row < 3; row++)
      for (let index = 0; index < 4 - row; index++) {
        const px = (index - (3 - row) / 2) * radius * 2.05;
        const y = top + radius + row * radius * 1.78;
        const stagger = this._range(-0.045, 0.045);
        this._log(
          builder,
          frame,
          [px, y, -length / 2 + stagger],
          [px, y, length / 2 + stagger],
          radius * this._range(0.94, 1.03),
        );
      }
    // Low stakes stop the bottom row rolling into the cart route.
    for (const px of [-width * 0.53, width * 0.53])
      this._post(
        builder,
        frame,
        px,
        length * 0.26,
        top + radius * 1.8,
        0.013,
        "log-stop",
      );
  }

  _wheel(builder, frame, x, radius) {
    const spokes = 10;
    const wood = this._surface(YARD_CUT_WOOD, "plank");
    const iron = this._surface(PROP_COLORS.iron, "metal", { expo: 0.75 });
    this._beam(
      builder,
      frame,
      [x - 0.034, 0, 0],
      [x + 0.034, 0, 0],
      0.032,
      wood,
    );
    for (let index = 0; index < spokes; index++) {
      const a = (index / spokes) * Math.PI * 2;
      this._beam(
        builder,
        frame,
        [x, Math.cos(a) * 0.022, Math.sin(a) * 0.022],
        [x, Math.cos(a) * (radius - 0.01), Math.sin(a) * (radius - 0.01)],
        0.006,
        wood,
      );
    }
    for (let index = 0; index < 24; index++) {
      const a = (index / 24) * Math.PI * 2;
      const b = ((index + 1) / 24) * Math.PI * 2;
      const point = (angle, r) => [x, Math.cos(angle) * r, Math.sin(angle) * r];
      this._beam(
        builder,
        frame,
        point(a, radius - 0.012),
        point(b, radius - 0.012),
        0.013,
        wood,
      );
      this._beam(
        builder,
        frame,
        point(a, radius - 0.003),
        point(b, radius - 0.003),
        0.004,
        iron,
      );
    }
  }

  _cart(builder) {
    const { x, z, yaw } = WOODWORKING_YARD.cart;
    const radius = 0.125;
    const halfAxle = 0.245;
    let roll = 0;
    let height = terrainHeight(x, z) + radius;
    let frame;
    // Fit the axle roll to both contact points. Re-sampling accounts for the
    // small horizontal shift of the tyre bottoms on the slope.
    for (let pass = 0; pass < 4; pass++) {
      frame = composeChildPropTransform(
        this.identity,
        x,
        height,
        z,
        yaw,
        0,
        roll,
      );
      const contacts = [-halfAxle, halfAxle].map((px) =>
        new ThreeVector3(px, -radius, 0).applyMatrix4(frame),
      );
      const left = terrainHeight(contacts[0].x, contacts[0].z);
      const right = terrainHeight(contacts[1].x, contacts[1].z);
      roll = Math.asin(clamp((right - left) / (halfAxle * 2), -0.45, 0.45));
      height = (left + right) / 2 + radius * Math.cos(roll) - 0.005;
    }
    frame = composeChildPropTransform(
      this.identity,
      x,
      height,
      z,
      yaw,
      0,
      roll,
    );
    const wood = this._surface(YARD_WOOD, "plank", { grain: "z" });
    const iron = this._surface(PROP_COLORS.iron, "metal");
    this._beam(builder, frame, [-0.29, 0, 0], [0.29, 0, 0], 0.014, iron);
    for (const px of [-halfAxle, halfAxle]) {
      this._wheel(builder, frame, px, radius);
      this._recordFooting(frame, px, -radius, 0, "cart-wheel");
    }
    for (let index = 0; index < 6; index++)
      this._box(
        builder,
        frame,
        [-0.155 + index * 0.062, 0.041, 0.04],
        [0.057, 0.025, 0.53],
        wood,
      );
    for (const px of [-0.19, 0.19]) {
      for (const pz of [-0.22, 0.3])
        this._beam(builder, frame, [px, 0.02, pz], [px, 0.23, pz], 0.011);
      for (const y of [0.105, 0.18])
        this._box(builder, frame, [px, y, 0.04], [0.019, 0.054, 0.55], wood);
      this._beam(
        builder,
        frame,
        [px * 0.75, 0.021, 0.19],
        [px * 0.9, -0.035, 0.87],
        0.013,
      );
    }
    for (const y of [0.105, 0.18])
      this._box(
        builder,
        frame,
        [0, y, -0.225],
        [0.39, 0.054, 0.018],
        this._surface(YARD_WOOD, "plank"),
      );
    for (let index = 0; index < 3; index++)
      this._log(
        builder,
        frame,
        [-0.12 + index * 0.12, 0.098, -0.19],
        [-0.12 + index * 0.12, 0.098, 0.28],
        0.042,
      );
    // The parked cart rests on a short prop beneath its shafts.
    const stand = new ThreeVector3(0, 0, 0.42).applyMatrix4(frame);
    const ground = terrainHeight(stand.x, stand.z);
    this._beam(
      builder,
      this.identity,
      [stand.x, ground - 0.01, stand.z],
      [stand.x, stand.y + 0.015, stand.z],
      0.015,
    );
    this.footings.push({
      kind: "cart-stand",
      x: stand.x,
      z: stand.z,
      ground,
      bottom: ground - 0.01,
    });
  }

  _stump(builder, { x, z, radius, height }, hasAxe) {
    const frame = this._frame(x, z, this._range(-0.3, 0.3));
    this._log(builder, frame, [0, -0.025, 0], [0, height, 0], radius);
    this._recordFooting(frame, 0, -0.025, 0, "stump");
    // Roots follow the existing grade instead of hovering around a flat disc.
    for (let index = 0; index < 5; index++) {
      const angle = (index / 5) * Math.PI * 2;
      const px = Math.cos(angle) * radius * 1.4;
      const pz = Math.sin(angle) * radius * 1.4;
      const ground = this._ground(frame, px, pz);
      builder.cylinder(
        frame,
        Math.cos(angle) * radius * 0.55,
        0.035,
        Math.sin(angle) * radius * 0.55,
        px,
        ground - 0.008,
        pz,
        [0.027, 0.007],
        6,
        this._surface(PROP_COLORS.bark, "bark"),
      );
    }
    if (hasAxe) {
      const axe = composeChildPropTransform(
        frame,
        0.015,
        height - 0.005,
        0,
        -0.25,
        0,
        -0.25,
      );
      this._beam(
        builder,
        axe,
        [0, 0, 0],
        [0.035, 0.22, 0.02],
        0.006,
        this._surface(YARD_CUT_WOOD, "log"),
      );
      this._box(
        builder,
        axe,
        [0.027, 0.027, 0],
        [0.08, 0.045, 0.018],
        this._surface(PROP_COLORS.iron, "metal"),
      );
      this._box(
        builder,
        axe,
        [0.069, 0.025, 0],
        [0.009, 0.051, 0.019],
        this._surface(createPropColor("#94958e"), "metal"),
      );
      for (let index = 0; index < 9; index++) {
        const angle = this._range(0, Math.PI * 2);
        const distance = this._range(radius * 1.6, radius * 3.4);
        const px = x + Math.cos(angle) * distance;
        const pz = z + Math.sin(angle) * distance;
        const piece = this._frame(px, pz, angle);
        this._box(
          builder,
          piece,
          [0, 0.009, 0],
          [this._range(0.018, 0.055), 0.013, this._range(0.009, 0.026)],
          this._surface(YARD_CUT_WOOD, "plank"),
        );
      }
    }
    this.stats.stumps++;
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
    material.customProgramCacheKey = () => "wg-woodworking-roof-depth-v1";
    return material;
  }

  update(dt) {
    if (this.disposed) return;
    const { x, z } = WOODWORKING_YARD.shelter;
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

export { WoodworkingYard };
