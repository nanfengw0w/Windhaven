import {
  ThreeFloat32BufferAttribute,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { lerp } from "../core/math.js";
import { appendBranchTube } from "./branch-geometry.js";

// Shared by bark, crossed leaf ribbons and their depth passes.
const WILLOW_BENDING_GLSL = `
uniform sampler2D uVegShake;
uniform sampler2D uWillowMotion;
uniform sampler2D uWillowCurve;
attribute vec4 aTree;
attribute vec4 aInfo;
attribute vec4 aWillowBranch; // scaffold id, local t, attachment t, strand id
attribute vec4 aWillowAnchor; // strand anchor xyz, local t
attribute vec4 aWillowBase;   // scaffold anchor xyz, reserved
attribute vec4 aWillowCenter; // original ring center xyz, curve parameter
attribute vec4 aWillowTangent; // original neighbor-center difference xyz
vec4 vegShake() { return texelFetch(uVegShake, ivec2(int(aInfo.x + 0.5), 0), 0); }
vec2 willowMotion(float id) {
  if (id < -0.5) return vec2(0.0);
  return texelFetch(uWillowMotion, ivec2(int(id + 0.5), 0), 0).xy;
}
vec3 willowRotate(vec3 v, vec2 bend) {
  float angle = min(length(bend), 0.85);
  if (angle < 0.00001) return v;
  vec3 axis = normalize(vec3(-bend.y, 0.0, bend.x));
  return v * cos(angle) + cross(axis, v) * sin(angle)
    + axis * dot(axis, v) * (1.0 - cos(angle));
}
vec3 willowCurveOffset(int node) {
  return texelFetch(uWillowCurve, ivec2(node, int(aWillowBranch.w + 0.5)), 0).xyz;
}
vec3 willowCurveFrame(vec3 v) {
  int node = int(aWillowCenter.w * 8.0 + 0.5);
  vec3 before = normalize(aWillowTangent.xyz);
  vec3 delta = aWillowTangent.xyz
    + willowCurveOffset(min(8, node + 1)) - willowCurveOffset(max(0, node - 1));
  vec3 after = length(delta) > 0.00001 ? normalize(delta) : before;
  vec3 axis = cross(before, after);
  float cosine = clamp(dot(before, after), -1.0, 1.0);
  // The chain cannot fold through itself; guard an extreme reversal as well.
  if (cosine < -0.9999) {
    vec3 perpendicular = abs(before.x) < 0.8 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0);
    axis = normalize(cross(before, perpendicular));
    return 2.0 * axis * dot(axis, v) - v;
  }
  return v + cross(axis, v) + cross(axis, cross(axis, v)) / max(1.0 + cosine, 0.0001);
}
vec3 willowTreeBend() {
  float H = max(aTree.w, 0.01);
  vec2 treeBend = vegShake().xy / H + windAt(aTree.xz) * 0.006;
  return vec3(treeBend.x, 0.0, treeBend.y);
}
vec3 willowNormal(vec3 n) {
  if (aWillowBranch.w > -0.5) n = willowCurveFrame(n);
  if (aWillowBranch.x > -0.5) n = willowRotate(n, -willowMotion(aWillowBranch.x));
  return willowRotate(n, -willowTreeBend().xz);
}
vec3 vegTreeDisplace(vec3 p, vec4 sh, vec3 flutterDir, float cardV, float cardRnd) {
  vec3 q = p;
  if (aWillowBranch.w > -0.5) {
    int node = int(aWillowCenter.w * 8.0 + 0.5);
    q = aWillowCenter.xyz + willowCurveOffset(node)
      + willowCurveFrame(p - aWillowCenter.xyz);
  }
  if (aWillowBranch.x > -0.5) {
    q = aWillowBase.xyz + willowRotate(q - aWillowBase.xyz,
      -willowMotion(aWillowBranch.x));
  }
  // A modest shared trunk rotation carries every attachment with its parent.
  // Independent branch springs provide the visible wind response.
  float H = max(aTree.w, 0.01);
  vec2 W = windAt(aTree.xz);
  vec2 treeBend = sh.xy / H + W * 0.006;
  q = aTree.xyz + willowRotate(q - aTree.xyz, -treeBend);
  return q - p;
}
`;

function appendMotionAttributes(
  builder,
  first,
  rings,
  ringSize,
  branchId,
  strandId,
  anchor,
  base,
  attachmentT,
  points = null,
) {
  builder.willowBranch ||= [];
  builder.willowAnchor ||= [];
  builder.willowBase ||= [];
  builder.willowCenter ||= [];
  builder.willowTangent ||= [];
  for (let vertex = first; vertex < builder.count; vertex++) {
    const t = (Math.floor((vertex - first) / ringSize) % rings) / (rings - 1);
    builder.willowBranch.push(
      branchId,
      strandId < 0 ? t : attachmentT,
      attachmentT,
      strandId,
    );
    builder.willowAnchor.push(
      anchor.x,
      anchor.y,
      anchor.z,
      strandId < 0 ? 0 : t,
    );
    builder.willowBase.push(base.x, base.y, base.z, 0);
    const node = Math.round(t * (rings - 1));
    const center = points ? points[node] : anchor;
    const tangent = points
      ? points[Math.min(rings - 1, node + 1)]
          .clone()
          .sub(points[Math.max(0, node - 1)])
      : new ThreeVector3(0, 1, 0);
    builder.willowCenter.push(center.x, center.y, center.z, t);
    builder.willowTangent.push(tangent.x, tangent.y, tangent.z, 0);
  }
}

function finishWillowGeometry(geometry, builder) {
  if (!builder.foliage) {
    // The shared branch builder winds tubes inward despite outward normals.
    // Correct willow bark here so its front-sided color and shadow passes use
    // the outer surface, without changing the other forest meshes.
    const indices = geometry.index.array;
    for (let i = 0; i < indices.length; i += 3) {
      const second = indices[i + 1];
      indices[i + 1] = indices[i + 2];
      indices[i + 2] = second;
    }
  }
  for (const [name, data] of [
    ["aWillowBranch", builder.willowBranch],
    ["aWillowAnchor", builder.willowAnchor],
    ["aWillowBase", builder.willowBase],
    ["aWillowCenter", builder.willowCenter],
    ["aWillowTangent", builder.willowTangent],
  ])
    geometry.setAttribute(name, new ThreeFloat32BufferAttribute(data, 4));
  // Strong gestures can swing a long shoot beyond its static canopy bounds.
  geometry.boundingSphere.radius += 1.5;
}

function describeBranch(branches, plantIndex, parentId, kind, points, phase) {
  let length = 0;
  for (let i = 1; i < points.length; i++)
    length += points[i].distanceTo(points[i - 1]);
  const id = branches.length;
  const anchor = points[0];
  branches.push({
    id,
    plantIndex,
    parentId,
    kind,
    anchor: { x: anchor.x, y: anchor.y, z: anchor.z },
    length,
    phase: (((phase + Math.sin((id + 1) * 127.1) * 43758.5453) % 1) + 1) % 1,
    ...(kind === "strand"
      ? { points: points.map(({ x, y, z }) => ({ x, y, z })) }
      : {}),
  });
  return id;
}

function bezier(a, b, c, d, t) {
  const u = 1 - t;
  return new ThreeVector3()
    .addScaledVector(a, u * u * u)
    .addScaledVector(b, 3 * u * u * t)
    .addScaledVector(c, 3 * u * t * t)
    .addScaledVector(d, t * t * t);
}

// One atlas shoot covers the entire curve: no repeated bush/fern segments.
function appendWillowStrand(
  foliage,
  points,
  width,
  angle,
  root,
  index,
  phase,
  kind,
  random,
) {
  const shedding = random();
  const segments = points.length - 1;
  const arc = [0];
  for (let i = 1; i <= segments; i++)
    arc.push(arc[i - 1] + points[i].distanceTo(points[i - 1]));
  for (let plane = 0; plane < 2; plane++) {
    const first = foliage.count;
    const orientation = angle + plane * Math.PI * 0.5;
    const side = new ThreeVector3(
      Math.cos(orientation),
      0,
      Math.sin(orientation),
    );
    for (let i = 0; i <= segments; i++) {
      const t = i / segments,
        v = arc[i] / arc[segments];
      const tangent = points[Math.min(segments, i + 1)]
        .clone()
        .sub(points[Math.max(0, i - 1)])
        .normalize();
      const normal = side.clone().cross(tangent).normalize();
      const taper = lerp(0.94, 0.42, t * t * t);
      foliage.curAO = lerp(0.76, 0.96, t);
      for (const sign of [-1, 1]) {
        const point = points[i]
          .clone()
          .addScaledVector(side, sign * width * taper * 0.5);
        foliage.vert(
          point,
          normal,
          sign < 0 ? 0 : 1,
          v,
          root,
          [index, lerp(0.32, 1, t), phase, kind],
          [0, shedding, t, 0],
          point.clone().sub(points[0]),
        );
      }
    }
    for (let i = 0; i < segments; i++) {
      const a = first + i * 2;
      foliage.idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
}

function appendWillowTree(bark, foliage, plant, index, random, branches = []) {
  const { x, y, z, height: h, radius } = plant;
  const root = [x, y, z, h],
    phase = random(),
    kind = plant.code;
  const trunk = [],
    trunkRadii = [];
  const leanX = Math.cos(plant.lean) * h * 0.055;
  const leanZ = Math.sin(plant.lean) * h * 0.055;
  for (let i = 0; i <= 7; i++) {
    const t = i / 7;
    trunk.push(
      new ThreeVector3(x + leanX * t * t, y + h * 0.59 * t, z + leanZ * t * t),
    );
    trunkRadii.push(h * lerp(0.035, 0.003, t));
  }
  const trunkFirst = bark.count;
  appendBranchTube(
    bark,
    trunk,
    trunkRadii,
    7,
    root,
    index,
    0,
    0.3,
    phase,
    kind,
  );

  appendMotionAttributes(bark, trunkFirst, 8, 8, -1, -1, trunk[0], trunk[0], 0);

  // Structural limbs support a soft crown. All foliage is carried by downward
  // threads, including the crown top: there are no outward/upward leaf fans.
  const scaffoldCount = 7;
  const strandsPerBranch = Math.round((plant.strandsPerBranch || 10) * 1.6);
  for (let branch = 0; branch < scaffoldCount; branch++) {
    const angle = branch * 2.399963 + phase * Math.PI * 2 + random() * 0.3;
    const dx = Math.cos(angle),
      dz = Math.sin(angle);
    const spread = radius * lerp(0.8, 1.03, random());
    const base = trunk[4 + (branch % 3)].clone();
    const top = y + h * lerp(0.88, 1.02, random());
    const c1 = new ThreeVector3(
      base.x + dx * spread * 0.12,
      top,
      base.z + dz * spread * 0.12,
    );
    const c2 = new ThreeVector3(
      base.x + dx * spread * 0.62,
      top,
      base.z + dz * spread * 0.62,
    );
    const end = new ThreeVector3(
      base.x + dx * spread,
      top - h * 0.21,
      base.z + dz * spread,
    );
    const arch = [],
      archRadii = [];
    for (let i = 0; i <= 9; i++) {
      const t = i / 9;
      arch.push(bezier(base, c1, c2, end, t));
      archRadii.push(h * (0.011 * Math.pow(1 - t, 1.8) + 0.00065));
    }
    const branchId = describeBranch(branches, index, -1, "branch", arch, phase);
    const branchFirst = bark.count;
    appendBranchTube(
      bark,
      arch,
      archRadii,
      5,
      root,
      index,
      0.15,
      0.32,
      phase,
      kind,
    );

    appendMotionAttributes(
      bark,
      branchFirst,
      10,
      6,
      branchId,
      -1,
      base,
      base,
      0,
    );

    for (let strand = 0; strand < strandsPerBranch; strand++) {
      const along = lerp(
        0.32,
        1,
        (strand + 0.15 + random() * 0.7) / strandsPerBranch,
      );
      const anchor = bezier(base, c1, c2, end, along);
      const turn = angle + (random() - 0.5) * 1.5;
      const sx = Math.cos(turn),
        sz = Math.sin(turn);
      const lateral = (random() - 0.5) * radius * 0.48;
      const reach = h * lerp(0.025, 0.07, random());
      const short = strand % 5 === 0;
      const drop =
        h * (short ? lerp(0.2, 0.34, random()) : lerp(0.48, 0.7, random()));
      const tipY = Math.max(
        y + h * lerp(0.12, 0.25, random()),
        anchor.y - drop,
      );
      const p1 = new ThreeVector3(
        anchor.x + sx * reach * 0.9 - sz * lateral * 0.5,
        anchor.y - h * 0.035,
        anchor.z + sz * reach * 0.9 + sx * lateral * 0.5,
      );
      const p2 = new ThreeVector3(
        anchor.x + sx * reach - sz * lateral,
        lerp(anchor.y, tipY, 0.55),
        anchor.z + sz * reach + sx * lateral,
      );
      const tip = new ThreeVector3(
        p2.x + sx * h * 0.008,
        tipY,
        p2.z + sz * h * 0.008,
      );
      const points = [],
        radii = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        points.push(bezier(anchor, p1, p2, tip, t));
        radii.push(h * lerp(0.0011, 0.0002, t));
      }
      const strandId = describeBranch(
        branches,
        index,
        branchId,
        "strand",
        points,
        phase,
      );
      const strandFirst = bark.count;
      appendBranchTube(
        bark,
        points,
        radii,
        3,
        root,
        index,
        0.32,
        1,
        phase,
        kind,
      );
      appendMotionAttributes(
        bark,
        strandFirst,
        9,
        4,
        branchId,
        strandId,
        anchor,
        base,
        along,
        points,
      );
      const foliageFirst = foliage.count;
      appendWillowStrand(
        foliage,
        points,
        h * lerp(0.025, 0.039, random()),
        turn,
        root,
        index,
        phase,
        kind,
        random,
      );
      appendMotionAttributes(
        foliage,
        foliageFirst,
        9,
        2,
        branchId,
        strandId,
        anchor,
        base,
        along,
        points,
      );
    }
  }
}

export { appendWillowTree, finishWillowGeometry, WILLOW_BENDING_GLSL };
