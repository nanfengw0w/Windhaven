// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeBufferGeometry,
  ThreeColor,
  ThreeDoubleSide,
  ThreeDynamicDrawUsage,
  ThreeEuler,
  ThreeFloat32BufferAttribute,
  ThreeInstancedBufferAttribute,
  ThreeInstancedMesh,
  ThreeMatrix4,
  ThreeMeshDepthMaterial,
  ThreeMeshStandardMaterial,
  ThreeQuaternion,
  ThreeRGBADepthPacking,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { clamp, createSeededRandom, damp } from "../core/math.js";
import { getTreeRegistry } from "../vegetation/tree-registry.js";
const BIRD_FLYING = 0;
const BIRD_LANDING = 1;
const BIRD_PERCHED = 2;
const birdMatrixScratch = new ThreeMatrix4();
const birdQuaternionScratch = new ThreeQuaternion();
const birdEulerScratch = new ThreeEuler(0, 0, 0, "YXZ");
const birdPositionScratch = new ThreeVector3();
const birdScaleScratch = new ThreeVector3();
const birdColorScratch = new ThreeColor();
const BIRD_VERTEX_DECLARATIONS = `
attribute vec2 aWing;   // side (-1 left, 0 body, +1 right), span 0..1
attribute vec4 iFlap;   // phase, amplitude, fold, head tilt
`;
const BIRD_WING_TRANSFORM = `
{
  float side = aWing.x;
  if (abs(side) > 0.5) {
    float span = aWing.y;
    float x0 = side * 0.004;
    float lx = transformed.x - x0;
    float a = (sin(iFlap.x) * iFlap.y + sin(iFlap.x - 1.1) * iFlap.y * 0.55 * smoothstep(0.35, 1.0, span)) * side;
    a += 0.12 * side * (1.0 - iFlap.z);     // slight dihedral
    float ca = cos(a), sa = sin(a);
    vec3 open = vec3(x0 + lx * ca - transformed.y * sa, lx * sa + transformed.y * ca, transformed.z);
    vec3 folded = vec3(side * (0.0068 - span * 0.0012), 0.0036 + span * 0.0012, transformed.z * 0.45 - span * 0.03);
    transformed = mix(open, folded, iFlap.z);
    #ifdef BIRD_NORMALS
    vec3 nOpen = vec3(-sa * side, ca, 0.0) * sign(objectNormal.y + 1e-4);
    objectNormal = normalize(mix(nOpen, vec3(side * 0.8, 0.6, 0.0), iFlap.z));
    #endif
  } else if (transformed.z > 0.016) {
    // head: look around / peck when perched
    float k = smoothstep(0.016, 0.03, transformed.z);
    transformed.y -= iFlap.w * k * 0.012;
    transformed.x += sin(iFlap.x * 0.31) * iFlap.z * k * 0.004;
  }
}
`;
function createBirdGeometry() {
  const r = [],
    t = [],
    e = [],
    i = [],
    s = [0.24, 0.24, 0.27],
    n = [0.86, 0.8, 0.7],
    o = [0.13, 0.13, 0.15],
    a = [0.25, 0.2, 0.12],
    l = (y, _, M, A) => {
      (r.push(...y), t.push(..._), e.push(...M), i.push(...A));
    },
    c = (y, _, M, A, b = [0, 0], S = null, E = null, T = null) => {
      const R = [_[0] - y[0], _[1] - y[1], _[2] - y[2]],
        z = [M[0] - y[0], M[1] - y[1], M[2] - y[2]],
        L = [
          R[1] * z[2] - R[2] * z[1],
          R[2] * z[0] - R[0] * z[2],
          R[0] * z[1] - R[1] * z[0],
        ],
        k = Math.hypot(...L) || 1;
      ((L[0] /= k),
        (L[1] /= k),
        (L[2] /= k),
        l(y, L, A, S || b),
        l(_, L, A, E || b),
        l(M, L, A, T || b));
    },
    h = [
      [-0.026, 0.0035],
      [-0.014, 0.0072],
      [0.002, 0.0086],
      [0.016, 0.0066],
      [0.023, 0.0064],
      [0.03, 0.0042],
      [0.038, 0],
    ],
    f = 6,
    u = (y, _, M) => {
      const A = (M / f) * Math.PI * 2;
      return [
        Math.cos(A) * _,
        Math.sin(A) * _ * 1.05 + (y > 0.012 ? 0.0012 : 0),
        y,
      ];
    };
  for (let y = 0; y < h.length - 1; y++) {
    const [_, M] = h[y],
      [A, b] = h[y + 1];
    for (let S = 0; S < f; S++) {
      const E = u(_, M, S),
        T = u(_, M, S + 1),
        R = u(A, b, S + 1),
        z = u(A, b, S),
        L = Math.sin(((S + 0.5) / f) * Math.PI * 2) < -0.2,
        k = y >= 5 ? a : L ? n : y >= 3 ? o : s,
        U = [
          Math.cos((S / f) * Math.PI * 2),
          Math.sin((S / f) * Math.PI * 2),
          0,
        ],
        F = [
          Math.cos(((S + 1) / f) * Math.PI * 2),
          Math.sin(((S + 1) / f) * Math.PI * 2),
          0,
        ];
      (l(E, U, k, [0, 0]),
        l(R, F, k, [0, 0]),
        l(T, F, k, [0, 0]),
        l(E, U, k, [0, 0]),
        l(z, U, k, [0, 0]),
        l(R, F, k, [0, 0]));
    }
  }
  const d = 0.0012,
    p = [-0.0035, d, -0.022],
    v = [0.0035, d, -0.022],
    g = [-0.013, d, -0.054],
    x = [0.013, d, -0.054],
    m = [0, d, -0.042];
  (c(p, m, g, o), c(p, v, m, o), c(v, x, m, o));
  for (const y of [-1, 1]) {
    const _ = [y * 0.004, 0.002, 0.012],
      M = [y * 0.004, 0.002, -0.007],
      A = [y * 0.03, 0.002, 0.009],
      b = [y * 0.03, 0.002, -0.012],
      S = [y * 0.062, 0.002, -0.016],
      E = (R) => [y, Math.abs(R[0]) / 0.062],
      T =
        y > 0
          ? [
              [_, A, b],
              [_, b, M],
              [A, S, b],
            ]
          : [
              [_, b, A],
              [_, M, b],
              [A, b, S],
            ];
    for (const [R, z, L] of T) c(R, z, L, s, null, E(R), E(z), E(L));
  }
  const w = new ThreeBufferGeometry();
  return (
    w.setAttribute("position", new ThreeFloat32BufferAttribute(r, 3)),
    w.setAttribute("normal", new ThreeFloat32BufferAttribute(t, 3)),
    w.setAttribute("color", new ThreeFloat32BufferAttribute(e, 3)),
    w.setAttribute("aWing", new ThreeFloat32BufferAttribute(i, 2)),
    w.computeBoundingSphere(),
    (w.boundingSphere.radius = 0.08),
    w
  );
}
let BirdFlock = class {
  constructor(t, e, i, { side, count, seed, roamDelay = 0 }) {
    ((this.ctx = t), (this.life = i));
    this.random = createSeededRandom(seed);
    this.homeX = side * 4;
    this.homeZ = 1.5;
    this.roamDelay = roamDelay;
    const edge = LANDSCAPE_BOUNDS.halfW - 0.15;
    this.minX = side < 0 ? -edge : 0;
    this.maxX = side < 0 ? 0 : edge;
    const s = (this.N = t.quality.pick(...count)),
      n = createBirdGeometry();
    ((this.flap = new ThreeInstancedBufferAttribute(
      new Float32Array(s * 4),
      4,
    ).setUsage(ThreeDynamicDrawUsage)),
      n.setAttribute("iFlap", this.flap));
    const o = new ThreeMeshStandardMaterial({
      vertexColors: !0,
      roughness: 0.7,
      metalness: 0,
      side: ThreeDoubleSide,
    });
    ((o.onBeforeCompile = (l) => {
      Object.assign(l.uniforms, t.uniforms);
      let c = l.vertexShader;
      ((c = c.replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>
        {
          float side = aWing.x;
          if (abs(side) > 0.5) {
            float span = aWing.y;
            float a = (sin(iFlap.x) * iFlap.y + sin(iFlap.x - 1.1) * iFlap.y * 0.55 * smoothstep(0.35, 1.0, span)) * side + 0.12 * side * (1.0 - iFlap.z);
            vec3 nOpen = vec3(-sin(a), cos(a), 0.0) * sign(objectNormal.y + 1e-4);
            objectNormal = normalize(mix(nOpen, vec3(side * 0.8, 0.6, 0.0), iFlap.z));
          }
        }`,
      )),
        (c = c.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
` + BIRD_WING_TRANSFORM.replace("#ifdef BIRD_NORMALS", "#if 0"),
        )),
        (l.vertexShader = t.GLSL_COMMON + BIRD_VERTEX_DECLARATIONS + c),
        (l.fragmentShader = t.GLSL_COMMON + l.fragmentShader));
    }),
      (o.customProgramCacheKey = () => "wg-life-birds"));
    const a = new ThreeMeshDepthMaterial({
      depthPacking: ThreeRGBADepthPacking,
      side: ThreeDoubleSide,
    });
    ((a.onBeforeCompile = (l) => {
      l.vertexShader =
        BIRD_VERTEX_DECLARATIONS +
        l.vertexShader.replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
` + BIRD_WING_TRANSFORM.replace("#ifdef BIRD_NORMALS", "#if 0"),
        );
    }),
      (a.customProgramCacheKey = () => "wg-life-birds-depth"),
      (this.mesh = new ThreeInstancedMesh(n, o, s)),
      (this.mesh.name = side < 0 ? "life-birds" : "life-birds-east"),
      (this.mesh.castShadow = !0),
      (this.mesh.receiveShadow = !1),
      (this.mesh.customDepthMaterial = a),
      (this.mesh.frustumCulled = !1),
      this.mesh.instanceMatrix.setUsage(ThreeDynamicDrawUsage));
    for (let l = 0; l < s; l++)
      (l % 3 === 2
        ? birdColorScratch.setRGB(1.35, 1, 0.7)
        : birdColorScratch.setRGB(0.75, 0.82, 1.08),
        birdColorScratch.multiplyScalar(0.9 + this.random() * 0.2),
        this.mesh.setColorAt(l, birdColorScratch));
    (e.add(this.mesh),
      (this.px = new Float32Array(s)),
      (this.py = new Float32Array(s)),
      (this.pz = new Float32Array(s)),
      (this.vx = new Float32Array(s)),
      (this.vy = new Float32Array(s)),
      (this.vz = new Float32Array(s)),
      (this.state = new Uint8Array(s)),
      (this.timer = new Float32Array(s)),
      (this.perch = new Int16Array(s).fill(-1)),
      (this.phase = new Float32Array(s)),
      (this.amp = new Float32Array(s)),
      (this.fold = new Float32Array(s)),
      (this.tilt = new Float32Array(s)),
      (this.yaw = new Float32Array(s)),
      (this.pitch = new Float32Array(s)),
      (this.roll = new Float32Array(s)),
      (this.burst = new Float32Array(s)),
      (this.hop = new Float32Array(s)),
      (this.look = new Float32Array(s)),
      (this.speed = new Float32Array(s)));
    for (let l = 0; l < s; l++) this.speed[l] = 1.15 + this.random() * 0.35;
    ((this.goal = new ThreeVector3(0, 2.2, 0.5)),
      (this.goalT = 0),
      (this.mode = "roam"),
      (this.modeT = 14),
      (this.panic = 0),
      (this.perches = []),
      (this.occupied = []),
      (this._stay = null),
      (this._treeRegistry = getTreeRegistry(t)),
      (this._treeRevision = -1),
      this._buildPerches());
  }
  hide() {
    this.mesh.visible = !1;
  }
  findCameraBird(from, airborneOnly, maxDistance) {
    if (!this.mesh.visible) return null;
    let nearest = null;
    for (let index = 0; index < this.N; index++) {
      if (airborneOnly && this.state[index] !== BIRD_FLYING) continue;
      const distance = Math.hypot(
        this.px[index] - from.x,
        this.py[index] - from.y,
        this.pz[index] - from.z,
      );
      if (distance <= maxDistance && (!nearest || distance < nearest.distance))
        nearest = { flock: this, index, distance };
    }
    return nearest;
  }
  findCameraBirdAfter(index, from, airborneOnly = false) {
    if (!this.mesh.visible) return null;
    const start = Number.isInteger(index) ? index : -1;
    for (let step = 1; step <= this.N; step++) {
      const candidate = (((start + step) % this.N) + this.N) % this.N;
      if (airborneOnly && this.state[candidate] !== BIRD_FLYING) continue;
      return {
        flock: this,
        index: candidate,
        distance: Math.hypot(
          this.px[candidate] - from.x,
          this.py[candidate] - from.y,
          this.pz[candidate] - from.z,
        ),
      };
    }
    return null;
  }

  readCameraPose(index, pose) {
    if (!this.mesh.visible) return false;
    pose.position.set(this.px[index], this.py[index], this.pz[index]);
    pose.yaw = this.yaw[index];
    pose.pitch = this.pitch[index];
    pose.roll = this.roll[index];
    pose.perched = this.state[index] === BIRD_PERCHED;
    return true;
  }
  _buildPerches() {
    const previous = this.perches;
    const perches = [];
    const add = (perch, anchor, slot, source) => {
      // Assign each perch to one territory, including at the center line.
      if (
        perch.x < this.minX ||
        perch.x >= this.maxX ||
        Math.abs(perch.z) > LANDSCAPE_BOUNDS.halfD - 0.15
      )
        return;
      perches.push({ ...perch, anchor, slot, source });
    };
    for (const perch of this.life.perches) {
      add(
        {
          x: perch.x,
          y: perch.y,
          z: perch.z,
          shelter: !!perch.shelter,
          roost: false,
          tree: -1,
        },
        perch,
        0,
        "props",
      );
    }
    for (const { plant, source, index } of this._treeRegistry.entries) {
      if (!(plant.height > 0)) continue;
      const addTree = (slot, x, y, z, shelter = false) =>
        add(
          { x, y, z, shelter, roost: shelter, tree: index },
          plant,
          slot,
          source,
        );
      if (plant.kind === "pine") {
        addTree(0, plant.x, plant.y + plant.height * 0.985, plant.z);
        addTree(
          1,
          plant.x + plant.radius * 0.3,
          plant.y + plant.height * 0.42,
          plant.z + plant.radius * 0.15,
          true,
        );
      } else if (plant.kind === "bush") {
        addTree(0, plant.x, plant.y + plant.height * 0.95, plant.z);
      } else {
        for (let slot = 0; slot < 2; slot++) {
          // Keep each source's original plant index for the branch angle.
          const angle = (index * 2.4 + slot * 2.1) % (Math.PI * 2);
          addTree(
            slot,
            plant.x + Math.cos(angle) * plant.radius * 0.35,
            plant.y + plant.height * (0.9 - slot * 0.04),
            plant.z + Math.sin(angle) * plant.radius * 0.35,
          );
        }
        addTree(
          2,
          plant.x + plant.radius * 0.25,
          plant.y + plant.height * 0.6,
          plant.z - plant.radius * 0.2,
          true,
        );
      }
    }
    const rocks = this.ctx.modules.terrain?.rocks;
    if (perches.length < 12 && Array.isArray(rocks)) {
      for (
        let index = 0;
        index < rocks.length && perches.length < 24;
        index += 5
      ) {
        const rock = rocks[index];
        if (typeof rock.top === "number")
          add(
            {
              x: rock.x,
              y: rock.top + 0.005,
              z: rock.z,
              shelter: false,
              roost: false,
              tree: -1,
            },
            rock,
            0,
            "rocks",
          );
      }
    }
    this.perches = perches;
    this.occupied = new Int16Array(perches.length).fill(-1);
    this._treeRevision = this._treeRegistry.revision;
    // A source can be added, reordered or removed while birds are landing.
    // Stable plant/prop identity keeps survivors attached to the same branch.
    for (let bird = 0; bird < this.N; bird++) {
      const old = previous[this.perch[bird]];
      const next = old
        ? perches.findIndex(
            (perch) => perch.anchor === old.anchor && perch.slot === old.slot,
          )
        : -1;
      this.perch[bird] = -1;
      if (next >= 0 && this.occupied[next] < 0) {
        this.perch[bird] = next;
        this.occupied[next] = bird;
        if (this.state[bird] === BIRD_PERCHED) {
          const perch = perches[next];
          this.px[bird] = perch.x;
          this.py[bird] = perch.y;
          this.pz[bird] = perch.z;
        }
      } else if (
        this.state[bird] === BIRD_PERCHED ||
        this.state[bird] === BIRD_LANDING
      ) {
        this._takeoff(bird);
      }
    }
  }
  _freePerch(t) {
    const e = this.perch[t];
    (e >= 0 && this.occupied[e] === t && (this.occupied[e] = -1),
      (this.perch[t] = -1));
  }
  _pickPerch(t, e, i, s, n = 99) {
    let o = -1,
      a = 1 / 0;
    const l = this.perches;
    for (let c = 0; c < l.length; c++) {
      if (this.occupied[c] >= 0) continue;
      const h = l[c];
      if (
        (s === "shelter" && !h.shelter) ||
        (s === "roost" && !h.roost && !h.shelter) ||
        (s === "open" && h.shelter)
      )
        continue;
      const f =
        Math.hypot(h.x - t, h.z - i) +
        Math.abs(h.y - e) * 0.3 +
        this.random() * 0.25;
      f < a && f < n && ((a = f), (o = c));
    }
    return o;
  }
  reset(t) {
    (this._treeRegistry.revision !== this._treeRevision && this._buildPerches(),
      this.occupied.fill(-1));
    const e = this._wantStay(t);
    this._stay = e;
    const i = this._activeCount(t);
    ((this.panic = 0),
      (this.mode = "roam"),
      (this.modeT = 10 + this.roamDelay + this.random() * 5),
      this._newGoal(true));
    for (let s = 0; s < this.N; s++) {
      if (((this.perch[s] = -1), e || s >= i)) {
        const o = this._pickPerch(
          this.homeX + (this.random() - 0.5) * 6,
          1,
          this.homeZ + (this.random() - 0.5) * 4,
          e === "shelter" ? "shelter" : "roost",
        );
        if (o >= 0) {
          this._settle(s, o);
          continue;
        }
      }
      const n = (s / this.N) * Math.PI * 2;
      ((this.px[s] = this.goal.x + Math.cos(n) * 0.35),
        (this.py[s] = this.goal.y + (this.random() - 0.5) * 0.2),
        (this.pz[s] = this.goal.z + Math.sin(n) * 0.3),
        (this.vx[s] = Math.sign(this.homeX) * 1.1),
        (this.vy[s] = 0),
        (this.vz[s] = 0.3),
        (this.state[s] = BIRD_FLYING),
        (this.fold[s] = 0),
        (this.amp[s] = 0.8),
        (this.phase[s] = this.random() * 6.28));
    }
    this._write(0);
  }
  _settle(t, e) {
    const i = this.perches[e];
    ((this.perch[t] = e),
      (this.occupied[e] = t),
      (this.state[t] = BIRD_PERCHED),
      (this.px[t] = i.x),
      (this.py[t] = i.y),
      (this.pz[t] = i.z),
      (this.vx[t] = this.vy[t] = this.vz[t] = 0),
      (this.fold[t] = 1),
      (this.amp[t] = 0),
      (this.yaw[t] = this.random() * 6.28),
      (this.pitch[t] = 0),
      (this.roll[t] = 0),
      (this.timer[t] = 5 + this.random() * 10));
  }
  _wantStay(t) {
    return t.rain > 0.2 || t.storm > 0.45 || t.snow > 0.5
      ? "shelter"
      : t.night > 0.6
        ? "roost"
        : null;
  }
  _activeCount(t) {
    return Math.max(1, Math.round(this.N * clamp(t.activity * 1.1, 0.2, 1)));
  }
  _newGoal(startAtHome = false) {
    const { terrain } = this.ctx;
    let x = this.homeX;
    let z = this.homeZ;
    if (!startAtHome) {
      // Leave room to turn before reaching the territory's soft boundary.
      const minX = this.minX + 1.4;
      const maxX = this.maxX - 1.4;
      for (let attempt = 0; attempt < 8; attempt++) {
        const sampleX = minX + this.random() * (maxX - minX);
        const sampleZ =
          (this.random() - 0.5) * 2 * (LANDSCAPE_BOUNDS.halfD - 1.1) + 0.3;
        if (terrain.height(sampleX, sampleZ) > 2.6) continue;
        x = sampleX;
        z = sampleZ;
        break;
      }
    }
    const height = terrain.height(x, z);
    this.goal.set(
      x,
      Math.min(height + 0.9 + this.random(), this._ceiling(x, z) - 0.2),
      z,
    );
    this.goalT = 4 + this.random() * 5;
  }
  _ceiling(t, e) {
    let i = LANDSCAPE_BOUNDS.topY - 0.7;
    const s = this.ctx.modules.clouds?.list;
    if (Array.isArray(s))
      for (const n of s) {
        const o = n.position;
        if (!o) continue;
        const a = (n.radius ?? n.size ?? 1) * 1.1 + 0.3;
        (o.x - t) ** 2 + (o.z - e) ** 2 < a * a &&
          (i = Math.min(i, o.y - (n.extent?.y ?? 0.6) - 0.35));
      }
    return i;
  }
  scatter(t, e, i = 1) {
    const s = this._stay;
    const n = s && t !== void 0 ? 1.6 : 4 + i * 2;
    if (
      t !== void 0 &&
      !this.px.some((x, bird) => Math.hypot(x - t, this.pz[bird] - e) <= n)
    )
      return;
    this.panic = Math.max(this.panic, s ? 1.1 : 2.2 + i * 0.6);
    for (let o = 0; o < this.N; o++) {
      if (t !== void 0 && Math.hypot(this.px[o] - t, this.pz[o] - e) > n) {
        this.state[o] === BIRD_PERCHED && (this.hop[o] = 0.18);
        continue;
      }
      if (this.state[o] === BIRD_PERCHED || this.state[o] === BIRD_LANDING) {
        (this._freePerch(o), (this.state[o] = BIRD_FLYING));
        const a = this.random() * Math.PI * 2;
        ((this.vx[o] = Math.cos(a) * 0.9),
          (this.vz[o] = Math.sin(a) * 0.9),
          (this.vy[o] = 1.2 + this.random() * 0.6),
          (this.amp[o] = 1.1),
          (this.burst[o] = 1.2),
          (this.timer[o] = 0.25 * o));
      } else
        ((this.vx[o] += (this.random() - 0.5) * 1.6),
          (this.vy[o] += 0.5 + this.random() * 0.5),
          (this.vz[o] += (this.random() - 0.5) * 1.6),
          (this.burst[o] = 1));
    }
    ((this.mode = "roam"),
      (this.modeT = Math.max(this.modeT, 6 + this.random() * 6)),
      this._newGoal());
  }
  update(t, e, i) {
    this._treeRegistry.revision !== this._treeRevision && this._buildPerches();
    if (t <= 0) {
      this._write(e);
      return;
    }
    const s = this.N,
      n = this._wantStay(i);
    this._stay = n;
    const o = this._activeCount(i);
    this.panic = Math.max(0, this.panic - t);
    const a = this.panic > 0;
    if (
      ((this.goalT -= t),
      this.goalT <= 0 && this._newGoal(),
      (this.modeT -= t),
      !a)
    )
      if (
        (n
          ? (this.mode = "stay")
          : this.mode === "stay" &&
            ((this.mode = "roam"),
            (this.modeT = 8 + this.random() * 8),
            this._releaseAll(0.4, 3)),
        n)
      )
        for (let m = 0; m < s; m++) {
          if (this.state[m] === BIRD_PERCHED) continue;
          if (this.state[m] === BIRD_LANDING) {
            const y = this.perches[this.perch[m]];
            if (y && (y.shelter || (n === "roost" && y.roost))) continue;
          }
          const w = this._pickPerch(this.px[m], this.py[m], this.pz[m], n);
          w >= 0 && this._approach(m, w);
        }
      else if (this.mode === "roam" && this.modeT <= 0) {
        ((this.mode = "rest"), (this.modeT = 9 + this.random() * 9));
        const m = this.perches,
          w = m.length ? m[Math.floor(this.random() * m.length)] : null;
        for (let y = 0; y < s; y++) {
          if (this.state[y] !== BIRD_FLYING) continue;
          const _ = w ? this._pickPerch(w.x, w.y, w.z, "open", 2.5) : -1;
          _ >= 0 && this._approach(y, _);
        }
      } else
        this.mode === "rest" &&
          this.modeT <= 0 &&
          ((this.mode = "roam"),
          (this.modeT = 12 + this.random() * 14),
          this._newGoal(),
          this._releaseAll(0.35, o));
    let l = 0,
      c = 0,
      h = 0,
      f = 0,
      u = 0,
      d = 0,
      p = 0;
    for (let m = 0; m < s; m++)
      this.state[m] === BIRD_FLYING &&
        ((l += this.px[m]),
        (c += this.py[m]),
        (h += this.pz[m]),
        (f += this.vx[m]),
        (u += this.vy[m]),
        (d += this.vz[m]),
        p++);
    p && ((l /= p), (c /= p), (h /= p), (f /= p), (u /= p), (d /= p));
    const { minX, maxX } = this;
    const v = this.ctx.terrain,
      x = LANDSCAPE_BOUNDS.halfD - 0.15;
    for (let m = 0; m < s; m++) {
      const w = this.state[m];
      if (w === BIRD_PERCHED) {
        this._perched(m, t, e, i, n, o, a);
        continue;
      }
      let y = 0,
        _ = 0,
        M = 0;
      const A = this.px[m],
        b = this.py[m],
        S = this.pz[m];
      if (w === BIRD_FLYING) {
        if ((this.timer[m] > 0 && (this.timer[m] -= t), p > 1)) {
          ((y += (l - A) * 0.45),
            (_ += (c - b) * 0.35),
            (M += (h - S) * 0.45),
            (y += (f - this.vx[m]) * 0.7),
            (_ += (u - this.vy[m]) * 0.5),
            (M += (d - this.vz[m]) * 0.7));
          const Zt = a ? 0.32 : 0.16;
          for (let J = 0; J < s; J++) {
            if (J === m || this.state[J] !== BIRD_FLYING) continue;
            const nt = A - this.px[J],
              mt = b - this.py[J],
              Y = S - this.pz[J],
              xt = nt * nt + mt * mt + Y * Y;
            if (xt < Zt * Zt && xt > 1e-6) {
              const yt = (((Zt * Zt - xt) / (Zt * Zt)) * 4.5) / Math.sqrt(xt);
              ((y += nt * yt), (_ += mt * yt), (M += Y * yt));
            }
          }
        }
        const X = this.goal.x - A,
          vt = this.goal.y - b,
          gt = this.goal.z - S,
          Qt = Math.hypot(X, vt, gt) || 1,
          te = a ? 0.4 : 1.25;
        ((y += (X / Qt) * te),
          (_ += (vt / Qt) * te * 0.8),
          (M += (gt / Qt) * te),
          (y += Math.sin(e * 0.9 + m * 1.7) * 0.4),
          (M += Math.cos(e * 0.8 + m * 2.3) * 0.4),
          (_ += Math.sin(e * 1.3 + m) * 0.25));
      } else {
        const X = this.perches[this.perch[m]];
        if (!X) {
          this.state[m] = BIRD_FLYING;
          continue;
        }
        const vt = X.x - A,
          gt = X.z - S,
          Qt = Math.hypot(vt, gt),
          Zt = X.y + Math.min(0.35, Qt * 0.45) - b,
          J = Math.hypot(vt, Zt, gt);
        if (Math.hypot(vt, X.y - b, gt) < 0.03) {
          (this._settle(m, this.perch[m]),
            (this.timer[m] = 4 + this.random() * 10));
          continue;
        }
        const nt = Math.min(this.speed[m] * 1.1, J * 2.4 + 0.12);
        ((y += ((vt / (J || 1)) * nt - this.vx[m]) * 4.5),
          (_ += ((Zt / (J || 1)) * nt - this.vy[m]) * 4.5),
          (M += ((gt / (J || 1)) * nt - this.vz[m]) * 4.5),
          (this.timer[m] -= t),
          this.timer[m] < -12 &&
            (this._freePerch(m), (this.state[m] = BIRD_FLYING)));
      }
      if (
        (A > maxX ? (y -= (A - maxX) * 9) : A < minX && (y -= (A - minX) * 9),
        S > x ? (M -= (S - x) * 9) : S < -x && (M -= (S + x) * 9),
        w === BIRD_FLYING)
      ) {
        const vt =
          Math.max(
            v.height(A, S),
            v.height(A + this.vx[m] * 0.6, S + this.vz[m] * 0.6),
          ) + 0.38;
        b < vt && (_ += (vt - b) * 14);
        const gt = this._ceiling(A, S);
        b > gt && (_ -= (b - gt) * 9);
        const Qt = Math.hypot(this.vx[m], this.vy[m], this.vz[m]) || 1,
          Zt = (this.speed[m] * (a ? 1.7 : 1) + this.burst[m] * 0.5 - Qt) * 1.8;
        ((y += (this.vx[m] / Qt) * Zt),
          (_ += (this.vy[m] / Qt) * Zt * 0.5),
          (M += (this.vz[m] / Qt) * Zt));
      }
      const E = Math.hypot(y, _, M),
        T = w === BIRD_LANDING ? 7 : 6;
      E > T && ((y *= T / E), (_ *= T / E), (M *= T / E));
      const R = this.vx[m],
        z = this.vz[m];
      ((this.vx[m] += y * t), (this.vy[m] += _ * t), (this.vz[m] += M * t));
      const L = Math.hypot(this.vx[m], this.vy[m], this.vz[m]),
        k = 2.8,
        U = w === BIRD_LANDING ? 0.05 : 0.55;
      if (L > k) {
        const X = k / L;
        ((this.vx[m] *= X), (this.vy[m] *= X), (this.vz[m] *= X));
      } else if (L < U && L > 1e-5) {
        const X = U / L;
        ((this.vx[m] *= X), (this.vy[m] *= X), (this.vz[m] *= X));
      }
      ((this.px[m] += this.vx[m] * t),
        (this.py[m] += this.vy[m] * t),
        (this.pz[m] += this.vz[m] * t),
        (this.burst[m] = Math.max(0, this.burst[m] - t)));
      const F = Math.hypot(this.vx[m], this.vz[m]);
      if (F > 0.05) {
        let vt = Math.atan2(this.vx[m], this.vz[m]) - this.yaw[m];
        vt = Math.atan2(Math.sin(vt), Math.cos(vt));
        // Cap heading changes so a new goal or a scatter cannot snap a bird
        // (and therefore the follow camera) through a large angle in one step.
        const maxTurnRate = w === BIRD_LANDING ? 5 : 3.2;
        const turn = vt * Math.min(1, t * 10);
        this.yaw[m] += clamp(turn, -maxTurnRate * t, maxTurnRate * t);
        const gt =
          (R * this.vz[m] - z * this.vx[m]) /
          Math.max(t, 0.001) /
          (F * F + 0.1);
        this.roll[m] = damp(this.roll[m], clamp(-gt * 0.35, -1, 1), 6, t);
      }
      this.pitch[m] = damp(
        this.pitch[m],
        clamp(-Math.atan2(this.vy[m], F + 0.2) * 0.8, -0.9, 0.9),
        6,
        t,
      );
      const G = this.vy[m] > 0.15;
      let B;
      (w === BIRD_LANDING
        ? (B = 1.05)
        : G || a || this.burst[m] > 0
          ? (B = 0.95)
          : (B = Math.sin(e * 0.7 + m * 2.1) > 0.15 ? 0.75 : 0.06),
        (this.amp[m] = damp(this.amp[m], B, 7, t)));
      const q = B > 0.5 ? (w === BIRD_LANDING ? 19 : 14) : 3;
      ((this.phase[m] += t * q * (0.9 + (m % 3) * 0.06)),
        B < 0.1 &&
          (this.phase[m] = damp(
            this.phase[m],
            Math.round(this.phase[m] / 6.2832) * 6.2832 + 0.2,
            4,
            t,
          )),
        (this.fold[m] = damp(this.fold[m], 0, 10, t)),
        (this.tilt[m] = 0));
    }
    this._write(e);
  }
  _approach(t, e) {
    (this._freePerch(t),
      (this.perch[t] = e),
      (this.occupied[e] = t),
      (this.state[t] = BIRD_LANDING),
      (this.timer[t] = 0));
  }
  _releaseAll(t, e) {
    let i = 0;
    for (let s = 0; s < this.N; s++)
      if (this.state[s] === BIRD_PERCHED) {
        if (i >= e) break;
        ((this.timer[s] = Math.min(this.timer[s], i * t + this.random() * 0.3)),
          i++);
      }
  }
  _takeoff(t) {
    (this._freePerch(t), (this.state[t] = BIRD_FLYING));
    const e = this.yaw[t];
    ((this.vx[t] = Math.sin(e) * 0.7),
      (this.vz[t] = Math.cos(e) * 0.7),
      (this.vy[t] = 0.9 + this.random() * 0.3),
      (this.amp[t] = 1),
      (this.burst[t] = 0.8),
      (this.fold[t] = 0.3));
  }
  _perched(t, e, i, s, n, o, a) {
    const l = this.perches[this.perch[t]];
    if (!l) {
      this.state[t] = BIRD_FLYING;
      return;
    }
    ((this.look[t] -= e),
      this.look[t] <= 0 &&
        ((this.look[t] = 0.6 + this.random() * 2.2),
        (this.yaw[t] += (this.random() - 0.5) * 2.2),
        this.random() < 0.25 && (this.hop[t] = 0.18)),
      (this.hop[t] = Math.max(0, this.hop[t] - e)));
    const c =
      this.hop[t] > 0 ? Math.sin((this.hop[t] / 0.18) * Math.PI) * 0.012 : 0;
    ((this.px[t] = l.x),
      (this.py[t] = l.y + c),
      (this.pz[t] = l.z),
      (this.fold[t] = damp(this.fold[t], this.hop[t] > 0 ? 0.6 : 1, 8, e)),
      (this.amp[t] = damp(this.amp[t], this.hop[t] > 0 ? 0.5 : 0, 8, e)),
      (this.phase[t] += e * 9),
      (this.pitch[t] = damp(
        this.pitch[t],
        0.15 + (Math.sin(i * 0.7 + t) > 0.85 ? 0.5 : 0),
        6,
        e,
      )),
      (this.roll[t] = damp(this.roll[t], 0, 6, e)),
      (this.tilt[t] = Math.sin(i * 0.9 + t * 3.1) > 0.8 ? 1 : 0),
      !(a || n) &&
        (t >= o ||
          ((this.timer[t] -= e),
          this.timer[t] <= 0 && this.mode !== "rest"
            ? this._takeoff(t)
            : this.timer[t] <= -4 && this._takeoff(t))));
  }
  _write(t) {
    const e = this.N,
      i = this.flap.array;
    for (let s = 0; s < e; s++)
      (birdEulerScratch.set(this.pitch[s], this.yaw[s], this.roll[s], "YXZ"),
        birdQuaternionScratch.setFromEuler(birdEulerScratch),
        birdPositionScratch.set(this.px[s], this.py[s], this.pz[s]),
        birdScaleScratch.set(1.2, 1.2, 1.2),
        birdMatrixScratch.compose(
          birdPositionScratch,
          birdQuaternionScratch,
          birdScaleScratch,
        ),
        this.mesh.setMatrixAt(s, birdMatrixScratch),
        (i[s * 4] = this.phase[s]),
        (i[s * 4 + 1] = this.amp[s]),
        (i[s * 4 + 2] = this.fold[s]),
        (i[s * 4 + 3] = this.tilt[s]));
    ((this.mesh.instanceMatrix.needsUpdate = !0), (this.flap.needsUpdate = !0));
  }
};
export { BirdFlock };
