// Procedural train assembly, carriage batching and per-frame train motion.
// Keep car, wheel and coupling updates in their original order.
import {
  ThreeGroup,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeMesh,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { SCENE_SCALE } from "../layout/world-layout.js";
import { updateWindowGlow } from "../render/window-glow.js";

function addTrainPiece(
  town,
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
  const mesh = new ThreeMesh(town.geometries[kind], town.materials[material]);
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  mesh.rotation.set(rx, ry, rz);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.customDepthMaterial = town.depthMaterial;
  parent.add(mesh);
  return mesh;
}

function buildTownTrain(town) {
  for (let index = 0; index < 3; index++) {
    const car = new ThreeGroup();
    car.name = index ? "alpine-coach-" + index : "alpine-locomotive";
    car.userData.assetSlot = index ? "train-coach" : "train-engine";
    town.train.add(car);
    town.cars.push({
      group: car,
      sample: {},
      front: {},
      rear: {},
      wheelbase: index ? 0.8 : 0.64,
      offset: index * SCENE_SCALE.carSpacing,
      length: index ? SCENE_SCALE.coachLength : SCENE_SCALE.engineLength,
      smokeAnchor: index ? null : new ThreeVector3(0, 0.405, 0.3),
    });
    const add = (kind, mat, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0) =>
      town._movingPiece(car, kind, mat, x, y, z, sx, sy, sz, rx, ry, rz);
    const length = index ? SCENE_SCALE.coachLength : SCENE_SCALE.engineLength;
    add("box", "iron", 0, 0.075, 0, 0.24, 0.05, length - 0.1);
    if (index === 0) {
      add("cylinder", "green", 0, 0.21, 0.115, 0.205, 0.59, 0.205, Math.PI / 2);
      add("box", "red", 0, 0.22, -0.29, 0.24, 0.25, 0.32);
      add("box", "iron", 0, 0.365, -0.29, SCENE_SCALE.trainWidth, 0.035, 0.37);
      add("cylinder", "iron", 0, 0.32, 0.3, 0.06, 0.14, 0.06);
      add("cone", "iron", 0, 0.392, 0.3, 0.09, 0.016, 0.09);
      add("box", "warm", 0, 0.225, 0.42, 0.055, 0.055, 0.02);
      for (const side of [-1, 1])
        add("box", "glass", side * 0.123, 0.265, -0.29, 0.009, 0.1, 0.17);
    } else {
      add("box", index === 1 ? "red" : "green", 0, 0.22, 0, 0.245, 0.25, 1.1);
      add("box", "cream", 0, 0.265, 0, 0.25, 0.13, 1.09);
      add("roof", "slate", 0, 0.345, 0, SCENE_SCALE.trainWidth, 0.055, 1.18);
      for (const side of [-1, 1]) {
        for (const z of [-0.32, -0.11, 0.11, 0.32])
          add(
            "box",
            "glass",
            side * 0.13,
            0.27,
            z,
            0.01,
            SCENE_SCALE.windowHeight,
            0.155,
          );
        for (const z of [-0.48, 0.48])
          add("box", "wood", side * 0.13, 0.21, z, 0.012, 0.22, 0.095);
      }
    }
    for (const z of index ? [-0.4, 0.4] : [-0.32, 0, 0.32])
      for (const side of [-1, 1])
        town.wheels.push({
          car: town.cars[index],
          x: (side * SCENE_SCALE.trackGauge) / 2,
          z,
          sample: {},
          frame: new ThreeMatrix4(),
          tilt: new ThreeMatrix4(),
        });
    add("box", "iron", 0, 0.075, -length / 2 + 0.018, 0.045, 0.025, 0.036);
    add("box", "iron", 0, 0.075, length / 2 - 0.018, 0.045, 0.025, 0.036);
    town._batchCar(car);
  }
  town.wheelMesh = new ThreeInstancedMesh(
    town.geometries.cylinder,
    town.materials.iron,
    town.wheels.length,
  );
  town.wheelMesh.name = "train-wheels";
  town.wheelMesh.castShadow = true;
  town.wheelMesh.receiveShadow = true;
  town.wheelMesh.customDepthMaterial = town.depthMaterial;
  town.wheelMesh.frustumCulled = false;
  town.train.add(town.wheelMesh);
  town.couplerMesh = new ThreeInstancedMesh(
    town.geometries.box,
    town.materials.iron,
    town.cars.length - 1,
  );
  town.couplerMesh.name = "train-coupling-links";
  town.couplerMesh.castShadow = true;
  town.couplerMesh.receiveShadow = true;
  town.couplerMesh.customDepthMaterial = town.depthMaterial;
  town.couplerMesh.frustumCulled = false;
  town.train.add(town.couplerMesh);
  town._couplerFrame = new ThreeMatrix4();
  town._couplerTilt = new ThreeMatrix4();
}

function batchTrainCar(town, car) {
  const batches = new Map();
  for (const mesh of [...car.children]) {
    if (!mesh.isMesh) continue;
    const key = `${mesh.geometry.id}:${mesh.material.id}`;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(mesh);
  }
  for (const pieces of batches.values()) {
    if (pieces.length < 2) continue;
    const mesh = new ThreeInstancedMesh(
      pieces[0].geometry,
      pieces[0].material,
      pieces.length,
    );
    pieces.forEach((piece, index) => {
      piece.updateMatrix();
      mesh.setMatrixAt(index, piece.matrix);
      car.remove(piece);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.customDepthMaterial = town.depthMaterial;
    mesh.computeBoundingSphere();
    car.add(mesh);
  }
}

function updateTownTrain(town, dt) {
  if (town.disposed) return;
  let remaining = Math.max(0, dt);
  while (remaining > 0) {
    const step = Math.min(0.05, remaining);
    const transit = town.hiddenTransit;
    let speed = town.speed;
    let boundary = Infinity;
    if (
      transit &&
      town.distance >= transit.start &&
      town.distance < transit.end
    ) {
      const progress =
        (town.distance - transit.start) / (transit.end - transit.start);
      speed +=
        (transit.maxSpeed - town.speed) * Math.sin(Math.PI * progress) ** 2;
      boundary = transit.end;
    } else if (transit && town.distance < transit.start)
      boundary = transit.start;
    town.distance = Math.min(boundary, town.distance + step * speed);
    remaining -= step;
  }
  if (town.distance >= town.pathLength) {
    let allOutside = true;
    let rightmost = -Infinity;
    for (const car of town.cars) {
      const point = town.sampleTrack(
        town.distance - car.offset,
        town._resetSample,
      );
      const extent =
        Math.abs(Math.sin(point.yaw)) * (car.length / 2 + 0.015) +
        Math.abs(Math.cos(point.yaw)) * (SCENE_SCALE.trainWidth / 2 + 0.015);
      rightmost = Math.max(rightmost, point.x + extent);
      if (point.x + extent >= -LANDSCAPE_BOUNDS.halfW - 0.02)
        allOutside = false;
    }
    if (allOutside) {
      town.lastReset = { fromDistance: town.distance, rightmostX: rightmost };
      town.distance = town.startDistance;
      town.resetCount++;
    }
  }
  for (const car of town.cars) {
    const distance = town.distance - car.offset;
    town.sampleTrack(distance, car.sample);
    town.sampleTrack(distance + car.wheelbase / 2, car.front);
    town.sampleTrack(distance - car.wheelbase / 2, car.rear);
    car.sample.x = (car.front.x + car.rear.x) / 2;
    car.sample.y = (car.front.y + car.rear.y) / 2;
    car.sample.z = (car.front.z + car.rear.z) / 2;
    car.sample.yaw = Math.atan2(
      car.front.x - car.rear.x,
      car.front.z - car.rear.z,
    );
    car.sample.pitch = Math.atan2(
      car.front.y - car.rear.y,
      Math.hypot(car.front.x - car.rear.x, car.front.z - car.rear.z),
    );
    const normalX = -Math.sin(car.sample.yaw) * Math.sin(car.sample.pitch);
    const normalZ = -Math.cos(car.sample.yaw) * Math.sin(car.sample.pitch);
    car.group.position.set(
      car.sample.x + normalX * 0.0125,
      car.sample.y + Math.cos(car.sample.pitch) * 0.0125,
      car.sample.z + normalZ * 0.0125,
    );
    car.group.rotation.set(-car.sample.pitch, car.sample.yaw, 0, "YXZ");
    car.group.updateMatrix();
  }
  const wheelAngle = -town.distance / 0.05;
  town.wheels.forEach((wheel, index) => {
    town.sampleTrack(town.distance - wheel.car.offset + wheel.z, wheel.sample);
    wheel.frame
      .makeRotationY(wheel.sample.yaw)
      .multiply(wheel.tilt.makeRotationX(-wheel.sample.pitch));
    const normal = wheel.frame.elements;
    wheel.frame.setPosition(
      wheel.sample.x + normal[4] * 0.0125,
      wheel.sample.y + normal[5] * 0.0125,
      wheel.sample.z + normal[6] * 0.0125,
    );
    town.wheelMesh.setMatrixAt(
      index,
      town._transform(
        wheel.x,
        0.05,
        0,
        0.1,
        0.026,
        0.1,
        wheelAngle,
        0,
        Math.PI / 2,
        wheel.frame,
      ),
    );
  });
  town.wheelMesh.instanceMatrix.needsUpdate = true;
  town.wheelMesh.boundingBox = null;
  town.wheelMesh.boundingSphere = null;
  for (let index = 0; index < town.cars.length - 1; index++) {
    const leading = town.cars[index],
      trailing = town.cars[index + 1];
    const a = leading.group.matrix.elements,
      b = trailing.group.matrix.elements;
    const endA = leading.length / 2 - 0.015,
      endB = trailing.length / 2 - 0.015;
    const ax = a[12] + a[4] * 0.075 - a[8] * endA;
    const ay = a[13] + a[5] * 0.075 - a[9] * endA;
    const az = a[14] + a[6] * 0.075 - a[10] * endA;
    const bx = b[12] + b[4] * 0.075 + b[8] * endB;
    const by = b[13] + b[5] * 0.075 + b[9] * endB;
    const bz = b[14] + b[6] * 0.075 + b[10] * endB;
    const pitch = Math.atan2(ay - by, Math.hypot(ax - bx, az - bz));
    town._couplerFrame
      .makeRotationY(Math.atan2(ax - bx, az - bz))
      .multiply(town._couplerTilt.makeRotationX(-pitch));
    town._couplerFrame.scale(
      town._scale.set(
        0.025,
        0.022,
        Math.hypot(ax - bx, ay - by, az - bz) + 0.02,
      ),
    );
    town._couplerFrame.setPosition((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2);
    town.couplerMesh.setMatrixAt(index, town._couplerFrame);
  }
  town.couplerMesh.instanceMatrix.needsUpdate = true;
  town.couplerMesh.boundingBox = null;
  town.couplerMesh.boundingSphere = null;
  town.materials.warm.emissiveIntensity =
    0.15 + 1.1 * (town.ctx.world?.night ?? 0);
  const night = town.ctx.world?.night ?? 0;
  for (const material of town.windowGlowMaterials)
    updateWindowGlow(material, night);
}

export { addTrainPiece, buildTownTrain, batchTrainCar, updateTownTrain };
