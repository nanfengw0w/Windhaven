import { LANDSCAPE_BOUNDS } from "../core/config.js";

// Use the same triangle/snow height as navigation rather than the older baked
// terrain picking field. The search stays inside the landscape's finite box.
function rayToCharacterGround(ray, navigation, target, includeWater = true) {
  let start = 0;
  let end = 250;
  for (const [axis, min, max] of [
    ["x", -LANDSCAPE_BOUNDS.halfW, LANDSCAPE_BOUNDS.halfW],
    ["y", LANDSCAPE_BOUNDS.bottomY, LANDSCAPE_BOUNDS.topY],
    ["z", -LANDSCAPE_BOUNDS.halfD, LANDSCAPE_BOUNDS.halfD],
  ]) {
    const origin = ray.origin[axis];
    const direction = ray.direction[axis];
    if (Math.abs(direction) < 1e-9) {
      if (origin < min || origin > max) return null;
    } else {
      const a = (min - origin) / direction;
      const b = (max - origin) / direction;
      start = Math.max(start, Math.min(a, b));
      end = Math.min(end, Math.max(a, b));
    }
  }
  if (end < start) return null;
  const surfaceY = (x, z) => {
    if (!includeWater) return navigation.groundHeight(x, z);
    const surface = navigation.sampleSurface(x, z);
    return Math.max(surface.groundY, surface.waterY ?? -Infinity);
  };
  const aboveGround = (distance) => {
    const x = ray.origin.x + ray.direction.x * distance;
    const z = ray.origin.z + ray.direction.z * distance;
    return ray.origin.y + ray.direction.y * distance - surfaceY(x, z);
  };
  let previous = start;
  for (let distance = start; distance <= end + 0.04; distance += 0.04) {
    const current = Math.min(distance, end);
    if (aboveGround(current) <= 0) {
      let low = previous;
      let high = current;
      for (let iteration = 0; iteration < 12; iteration++) {
        const middle = (low + high) * 0.5;
        if (aboveGround(middle) > 0) low = middle;
        else high = middle;
      }
      ray.at(high, target);
      target.y = surfaceY(target.x, target.z);
      return target;
    }
    if (current === end) break;
    previous = current;
  }
  return null;
}

class CharacterDrag {
  constructor(ctx, character) {
    this.ctx = ctx;
    this.character = character;
    this.active = null;
    const THREE = ctx.THREE;
    this._box = new THREE.Box3();
    this._hit = new THREE.Vector3();
    this._ground = new THREE.Vector3();
    this._raycaster = new THREE.Raycaster();
    this._hits = [];
    this._occluders = [];
    this.marker = new THREE.Mesh(
      new THREE.RingGeometry(0.045, 0.058, 32),
      new THREE.MeshBasicMaterial({
        color: 0x91d9ac,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    this.marker.name = "character-placement";
    this.marker.rotation.x = -Math.PI / 2;
    this.marker.visible = false;
    this.marker.userData.noReflect = true;
    ctx.scene.add(this.marker);
    this._unregister = ctx.input.addHandler({
      name: "character",
      priority: 45,
      tools: ["hand"],
      cursor: "grab",
      activeCursor: "grabbing",
      hitTest: (pointer) => this.hitTest(pointer.ray),
      onDown: (hit, pointer) => this.begin(hit, pointer),
      onMove: (pointer) => this.move(pointer),
      onUp: (pointer) => this.finish(pointer),
      onCancel: () => this.cancel(),
    });
  }

  get enabled() {
    return (
      !this.character.disposed &&
      this.character.initialized &&
      !!this.character.model &&
      !this.ctx.exploration?.active &&
      !this.ctx.exploration?.pending &&
      (!this.ctx.photo?.active || this.ctx.input.enabled)
    );
  }

  _occluded(ray, distance) {
    const ground = rayToCharacterGround(
      ray,
      this.character.navigation,
      this._ground,
      false,
    );
    if (ground && ray.origin.distanceTo(ground) < distance - 0.005) return true;
    this._occluders.length = 0;
    const modules = this.ctx.modules;
    const roots = [
      modules.life?.propMesh,
      ...[
        "alpineTown",
        "farm",
        "woodworkingYard",
        "hikingTrail",
        "mountainRuins",
      ].map((name) => modules[name]?.group),
    ];
    for (const root of roots) {
      root?.updateWorldMatrix(true, true);
      root?.traverseVisible((object) => {
        if (object.isMesh) this._occluders.push(object);
      });
    }
    this._raycaster.ray.copy(ray);
    this._raycaster.near = 0;
    this._raycaster.far = Math.max(0, distance - 0.001);
    this._hits.length = 0;
    this._raycaster.intersectObjects(this._occluders, false, this._hits);
    return this._hits.some((hit) => {
      const material = Array.isArray(hit.object.material)
        ? hit.object.material[hit.face?.materialIndex ?? 0]
        : hit.object.material;
      return material?.visible && !material.transparent && material.depthTest;
    });
  }

  hitTest(ray) {
    if (!this.enabled || this.active || !this.character.group.visible)
      return null;
    const { position } = this.character.actor;
    const navigation = this.character.navigation;
    const swimming = this.character.actor.swimming;
    const radius = swimming ? navigation.height * 0.6 : navigation.radius * 1.5;
    const baseY = swimming ? this.character.actor.waterY - 0.01 : position.y;
    this._box.min.set(position.x - radius, baseY, position.z - radius);
    this._box.max.set(
      position.x + radius,
      baseY + (swimming ? 0.065 : navigation.height + 0.015),
      position.z + radius,
    );
    if (!ray.intersectBox(this._box, this._hit)) return null;
    const distance = ray.origin.distanceTo(this._hit);
    if (this._occluded(ray, distance)) return null;
    return { point: this._hit.clone(), distance };
  }

  begin(hit, pointer) {
    if (!this.enabled) return false;
    const { actor } = this.character;
    const ground = rayToCharacterGround(
      pointer.ray,
      this.character.navigation,
      this._ground,
    );
    this.active = {
      origin: { ...actor.position },
      anchor: { ...this.character.anchor },
      candidate: { ...actor.position },
      displayPosition: {
        ...actor.position,
        y: Math.max(actor.position.y, actor.waterY ?? -Infinity),
      },
      valid: true,
      moved: false,
      startX: pointer.x,
      startY: pointer.y,
      offsetX: ground ? actor.position.x - ground.x : 0,
      offsetZ: ground ? actor.position.z - ground.z : 0,
    };
    this.character.actor.moving = false;
    this.character.actor.held = true;
    this.character.syncVisual();
    return true;
  }

  move(pointer) {
    const drag = this.active;
    if (!drag) return;
    if (!this.enabled) {
      this.cancel();
      return;
    }
    if (Math.hypot(pointer.x - drag.startX, pointer.y - drag.startY) > 4)
      drag.moved = true;
    if (!drag.moved) return;
    const navigation = this.character.navigation;
    const point = rayToCharacterGround(pointer.ray, navigation, this._ground);
    if (point) {
      point.x += drag.offsetX;
      point.z += drag.offsetZ;
      const surface = navigation.sampleSurface(point.x, point.z);
      point.y = Math.max(surface.groundY, surface.waterY ?? -Infinity);
    }
    drag.valid = !!point && navigation.isTraversable(point.x, point.z);
    drag.candidate = point
      ? {
          x: point.x,
          y: navigation.supportHeight(point.x, point.z),
          z: point.z,
        }
      : null;
    if (point) drag.displayPosition = { x: point.x, y: point.y, z: point.z };
    this.marker.visible = !!point && !this.ctx.video?.recording;
    if (point) {
      this.marker.position.copy(point);
      this.marker.position.y += 0.003;
      this.marker.material.color.setHex(drag.valid ? 0x91d9ac : 0xe38f88);
    }
    this.character.syncVisual();
  }

  finish(pointer) {
    if (this.active && pointer && this.enabled) this.move(pointer);
    const drag = this.active;
    if (!drag) return;
    this.active = null;
    this.character.actor.held = false;
    this.marker.visible = false;
    const placed =
      drag.moved &&
      drag.valid &&
      this.enabled &&
      drag.candidate &&
      this.character.place(drag.candidate);
    if (!placed) this.character.refreshSupport();
    this.character.syncVisual();
  }

  cancel() {
    const drag = this.active;
    if (!drag) return;
    // InputController calls onUp after onCancel. Clear first so it cannot
    // commit a placement after a mode switch, pointer cancellation or pinch.
    this.active = null;
    this.character.actor.held = false;
    this.marker.visible = false;
    Object.assign(this.character.anchor, drag.anchor);
    this.character.refreshSupport();
    this.character.syncVisual();
  }

  dispose() {
    this.cancel();
    this._unregister?.();
    this.marker.removeFromParent();
    this.marker.geometry.dispose();
    this.marker.material.dispose();
  }
}

export { CharacterDrag, rayToCharacterGround };
