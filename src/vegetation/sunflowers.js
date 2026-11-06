import {
  ThreeBox3,
  ThreeDoubleSide,
  ThreeFloat32BufferAttribute,
  ThreeInstancedBufferAttribute,
  ThreeInstancedBufferGeometry,
  ThreeMesh,
  ThreeMeshDepthMaterial,
  ThreeMeshStandardMaterial,
  ThreeRGBADepthPacking,
  ThreeSphere,
  ThreeVector3,
  ThreeVector4,
} from "../vendor/three-runtime.js";
import { smoothstep } from "../core/math.js";
import { patchVegetationMaterial } from "./material-patching.js";

// Annual growth, independent of the wildflowers' spring-heavy bloom palette.
// The same state drives both the visible plant and its moving shadow.
function sunflowerSeasonState(season) {
  const s = ((season % 4) + 4) % 4;
  const growth = smoothstep(0.05, 0.85, s) * (1 - smoothstep(2.35, 3, s));
  const bloom = smoothstep(0.55, 0.95, s) * (1 - smoothstep(1.5, 1.95, s));
  const dry = smoothstep(1.45, 2.1, s) * (1 - smoothstep(3.45, 3.95, s));
  const winter = smoothstep(2.5, 3, s) * (1 - smoothstep(3.65, 4, s));
  return { growth, bloom, dry, winter };
}

function buildSunflowerGeometry() {
  const positions = [],
    parts = [],
    indices = [];
  const vertex = (x, y, z, part) => {
    positions.push(x, y, z);
    parts.push(part);
    return parts.length - 1;
  };
  // A tapered hexagonal stem; real geometry keeps its silhouette in side views.
  for (let row = 0; row <= 3; row++) {
    for (let side = 0; side < 6; side++) {
      const a = (side / 6) * Math.PI * 2;
      vertex(Math.cos(a), row / 3, Math.sin(a), 0);
    }
  }
  for (let row = 0; row < 3; row++) {
    for (let side = 0; side < 6; side++) {
      const a = row * 6 + side,
        b = row * 6 + ((side + 1) % 6);
      indices.push(a, a + 6, b, b, a + 6, b + 6);
    }
  }
  // Four broad, creased leaves, with pointed tips and heart-shaped shoulders.
  const outline = [
    [0, 0],
    [-0.72, 0.2],
    [-1, 0.43],
    [-0.65, 0.72],
    [0, 1],
    [0.65, 0.72],
    [1, 0.43],
    [0.72, 0.2],
  ];
  for (let leaf = 0; leaf < 4; leaf++) {
    const center = vertex(0, 0.43, leaf, 3);
    for (const [x, y] of outline) vertex(x, y, leaf, 3);
    for (let i = 0; i < outline.length; i++) {
      indices.push(
        center,
        center + 1 + i,
        center + 1 + ((i + 1) % outline.length),
      );
    }
  }
  // Petal silhouettes are geometry, so there are no alpha-card fringes at distance.
  for (let petal = 0; petal < 16; petal++) {
    const center = vertex(0.48, 0, petal, 1);
    vertex(0, 0, petal, 1);
    vertex(0.48, -1, petal, 1);
    vertex(1, 0, petal, 1);
    vertex(0.48, 1, petal, 1);
    for (let i = 0; i < 4; i++)
      indices.push(center, center + 1 + i, center + 1 + ((i + 1) % 4));
  }
  const center = vertex(0, 0, 0.16, 2);
  for (let side = 0; side < 16; side++) {
    const a = (side / 16) * Math.PI * 2;
    vertex(Math.cos(a), Math.sin(a), 0, 2);
  }
  for (let side = 0; side < 16; side++)
    indices.push(center, center + 1 + side, center + 1 + ((side + 1) % 16));
  const geometry = new ThreeInstancedBufferGeometry();
  geometry.setAttribute(
    "position",
    new ThreeFloat32BufferAttribute(positions, 3),
  );
  geometry.setAttribute(
    "normal",
    new ThreeFloat32BufferAttribute(new Float32Array(positions.length), 3),
  );
  geometry.setAttribute("aPart", new ThreeFloat32BufferAttribute(parts, 1));
  geometry.setIndex(indices);
  return geometry;
}

const SUNFLOWER_VARYINGS = `
varying vec4 vSunflower; // part, local x/y, seed
varying vec4 vSunflowerGround;
varying vec3 vSunflowerNormal;
varying vec2 vSunflowerLife; // dry, bloom
`;
const SUNFLOWER_VERTEX =
  SUNFLOWER_VARYINGS +
  `
attribute vec4 aRoot;
attribute vec4 aShape; // height, flower radius, phase, heading
attribute float aPart;
uniform vec4 uSunflowerSeason; // growth, bloom, dry, winter
uniform vec3 uSunflowerSunPosition; // smoothed position of the visible sun, not the moon

void sunflowerVertex(out vec3 p, out vec3 n) {
  vec4 G = groundAt(aRoot.xz);
  float snow = smoothstep(0.035, 0.25, G.x);
  float growth = uSunflowerSeason.x;
  float bloom = uSunflowerSeason.y * (1.0 - snow);
  float dry = uSunflowerSeason.z;
  float winter = uSunflowerSeason.w;
  float leaf = (0.22 + 0.78 * growth) * (1.0 - 0.94 * dry) * (1.0 - winter) * (1.0 - snow);
  float H = aShape.x * (0.13 + 0.87 * growth) * (1.0 - 0.75 * snow);
  float size = aShape.y * smoothstep(0.3, 0.95, growth) * (1.0 - winter) * (1.0 - 0.65 * snow);
  float gust;
  vec2 B = vegWindBend(aRoot.xz, aRoot.w, 1.65, gust);
  // Sturdy stems bend in the same simulated wind as nearby grass, never uproot.
  B *= min(1.0, 0.9 / max(length(B), 0.001));
  vec2 facing = vec2(sin(aShape.w), cos(aShape.w));
  B += facing * (0.06 + 0.3 * dry + 0.025 * uNight);
  vec3 tangent;
  vec3 tip = aRoot.xyz + vegArc(B, H, 1.0, tangent);
  if (aPart < 0.5) {
    vec3 T;
    p = aRoot.xyz + vegArc(B, H, position.y, T);
    vec3 across = normalize(cross(T, vec3(0.0, 0.0, 1.0)));
    vec3 forward = cross(across, T);
    n = normalize(across * position.x + forward * position.z);
    p += n * 0.00288 * (0.45 + 0.55 * growth) * (1.0 - 0.45 * position.y);
  } else if (aPart > 2.5) {
    float attach = 0.22 + position.z * 0.155;
    float yaw = aShape.w + position.z * 2.39996;
    vec3 radial = vec3(sin(yaw), 0.0, cos(yaw));
    vec3 across = vec3(cos(yaw), 0.0, -sin(yaw));
    vec3 T;
    p = aRoot.xyz + vegArc(B, H, attach, T);
    float len = aShape.x * (0.29 - 0.025 * position.z) * leaf;
    float flutter = sin(uTime * 8.0 + aShape.z + position.z * 1.9) * gust * 0.13;
    p += radial * position.y * len + across * position.x * len * 0.43;
    p += T * len * (sin(position.y * 3.14159) * 0.22 - position.y * (0.24 + dry * 0.8));
    p.y += len * (flutter * position.y - abs(position.x) * 0.1);
    n = normalize(T * 0.9 + radial * 0.32 + across * position.x * 0.24);
  } else {
    // Follow the displayed sun from each root, with a small natural heading spread.
    // Dry autumn seed heads keep their downward pose instead of following the sky.
    vec3 toSun = uSunflowerSunPosition - aRoot.xyz;
    float horizontal = length(toSun.xz);
    vec2 sunHeading = horizontal > 0.001 ? toSun.xz / horizontal : facing;
    float variation = (aShape.w - 0.25) * 0.14;
    sunHeading = mat2(cos(variation), -sin(variation), sin(variation), cos(variation)) * sunHeading;
    float pitch = clamp(toSun.y / max(horizontal, 0.001), 0.4, 1.7);
    vec3 sunAim = normalize(vec3(sunHeading.x, pitch, sunHeading.y));
    vec3 restAim = normalize(vec3(facing.x, 0.8 - dry * 1.5 - uNight * 0.08, facing.y));
    float follow = smoothstep(0.2, 0.85, growth) * (1.0 - dry);
    vec3 headAim = mix(restAim, sunAim, follow) + (tangent - vec3(0.0, 1.0, 0.0)) * 0.45;
    vec3 normalHead = dot(headAim, headAim) > 0.000001 ? normalize(headAim) : sunAim;
    // Rotate a horizontal frame from +Y to the head normal. This stays smooth
    // through vertical and sideways poses during wind/season transitions.
    vec3 referenceRight = vec3(sunHeading.y, 0.0, -sunHeading.x);
    vec3 turnAxis = cross(vec3(0.0, 1.0, 0.0), normalHead);
    vec3 headRight = referenceRight + cross(turnAxis, referenceRight)
      + cross(turnAxis, cross(turnAxis, referenceRight)) / max(1.0 + normalHead.y, 0.0001);
    vec3 right = normalHead.y > -0.999 ? normalize(headRight) : normalize(cross(vec3(0.0, 0.0, 1.0), normalHead));
    vec3 up = normalize(cross(normalHead, right));
    if (aPart < 1.5) {
      float angle = position.z * 6.2831853 / 16.0 + aRoot.w * 1.2;
      vec3 radial = right * cos(angle) + up * sin(angle);
      vec3 across = -right * sin(angle) + up * cos(angle);
      float petalSize = size * bloom;
      float curl = 0.1 * sin(position.x * 3.14159) - 0.12 * position.x * position.x;
      p = tip + (radial * (0.44 + position.x * 0.65) + across * position.y * 0.14 + normalHead * curl) * petalSize;
      n = normalize(normalHead + radial * position.x * 0.22 + across * position.y * 0.16);
    } else {
      p = tip + (right * position.x + up * position.y) * size * 0.51 + normalHead * (0.04 + position.z) * size;
      n = normalize(normalHead + (right * position.x + up * position.y) * 0.25);
    }
  }
  vSunflower = vec4(aPart, position.xy, aRoot.w);
  vSunflowerGround = G;
  vSunflowerNormal = n;
  vSunflowerLife = vec2(dry, bloom);
}
`;
const SUNFLOWER_COLOR = `
  float part = vSunflower.x;
  float seed = vSunflower.w;
  float dry = vSunflowerLife.x;
  vec3 green = mix(vec3(0.12, 0.25, 0.055), vec3(0.20, 0.33, 0.075), fract(seed * 7.3));
  green = mix(green, vec3(0.32, 0.24, 0.10), dry);
  vec3 col = green;
  if (part > 0.5 && part < 1.5) {
    col = mix(vec3(0.82, 0.32, 0.012), vec3(1.0, 0.66, 0.025), smoothstep(0.05, 0.65, vSunflower.y));
    col *= 0.9 + 0.12 * fract(seed * 13.9);
    vegTransAmt = 0.85;
  } else if (part > 1.5 && part < 2.5) {
    float dots = wgNoise(vSunflower.yz * 21.0 + seed * 17.0);
    float detail = 1.0 - smoothstep(0.05, 0.25, max(fwidth(vSunflower.y), fwidth(vSunflower.z)));
    vec3 seedColor = mix(vec3(0.105, 0.054, 0.022), vec3(0.25, 0.14, 0.035), dot(vSunflower.yz, vSunflower.yz));
    // Dry husks soften to straw-brown, avoiding a field of black dots at distance.
    seedColor = mix(seedColor, vec3(0.34, 0.23, 0.12), dry * 0.85);
    col = mix(green, seedColor * (0.9 + detail * (dots - 0.5) * 0.45), max(vSunflowerLife.y, dry));
    if (!gl_FrontFacing) col = green * 0.8;
    vegTransAmt = 0.08;
  } else {
    float vein = 1.0 - smoothstep(0.02, 0.09, abs(vSunflower.y));
    col *= part > 2.5 ? 0.86 + 0.17 * vein : 0.78;
    vegTransAmt = 0.5 * (1.0 - dry);
  }
  col *= 1.0 - vSunflowerGround.y * 0.15;
  float sc = smoothstep(0.01, 0.12, vSunflowerGround.x) * smoothstep(0.05, 0.65, vSunflowerNormal.y);
  col = mix(col, vec3(0.84, 0.89, 0.94), max(sc, vSunflowerGround.w * 0.3));
  diffuseColor.rgb = col;
`;

function createSunflowerMesh(ctx, data) {
  const geometry = buildSunflowerGeometry();
  geometry.setAttribute(
    "aRoot",
    new ThreeInstancedBufferAttribute(data.root, 4),
  );
  geometry.setAttribute(
    "aShape",
    new ThreeInstancedBufferAttribute(data.shape, 4),
  );
  geometry.instanceCount = data.count;
  const box = new ThreeBox3(),
    point = new ThreeVector3();
  for (let i = 0; i < data.count; i++)
    box.expandByPoint(point.fromArray(data.root, i * 4));
  box.expandByScalar(0.5); // Complete wind envelope, leaf/head radius and height.
  geometry.boundingBox = box;
  geometry.boundingSphere = box.getBoundingSphere(new ThreeSphere());
  const uniforms = {
    uSunflowerSeason: { value: new ThreeVector4() },
    uSunflowerSunPosition: { value: new ThreeVector3(7, 7, -6) },
  };
  const material = patchVegetationMaterial(
    new ThreeMeshStandardMaterial({
      roughness: 0.74,
      metalness: 0,
      side: ThreeDoubleSide,
      envMapIntensity: 0.5,
    }),
    ctx,
    {
      key: "veg-sunflowers",
      uniforms,
      vertexHead: SUNFLOWER_VERTEX,
      fragmentHead: SUNFLOWER_VARYINGS,
      vertex: {
        beginnormal_vertex:
          "vec3 vegPos; vec3 objectNormal; sunflowerVertex(vegPos, objectNormal);",
        begin_vertex: "vec3 transformed = vegPos;",
      },
      fragment: {
        color_fragment: SUNFLOWER_COLOR,
        roughnessmap_fragment:
          "float roughnessFactor = mix(roughness, 0.5, vSunflowerGround.y * 0.5);",
      },
      light: true,
      noFlip: true,
    },
  );
  const mesh = new ThreeMesh(geometry, material);
  mesh.name = "landscape-sunflowers";
  mesh.receiveShadow = true;
  mesh.castShadow = ctx.quality.tier > 0;
  mesh.customDepthMaterial = patchVegetationMaterial(
    new ThreeMeshDepthMaterial({
      side: ThreeDoubleSide,
      depthPacking: ThreeRGBADepthPacking,
    }),
    ctx,
    {
      key: "veg-sunflowers-depth",
      uniforms,
      vertexHead: SUNFLOWER_VERTEX,
      // Depth's normal chunk is conditional; deformation belongs in begin_vertex.
      vertex: {
        begin_vertex:
          "vec3 transformed; vec3 sunflowerNormal; sunflowerVertex(transformed, sunflowerNormal);",
      },
    },
  );
  mesh.userData = {
    assetSlot: "landscape-sunflowers",
    noReflect: true,
    placeholder: true,
    seasonUniform: uniforms.uSunflowerSeason,
    sunPositionUniform: uniforms.uSunflowerSunPosition,
    sunTrackingInitialized: false,
  };
  updateSunflowerSeason(mesh, ctx.world?.season ?? 0.25, ctx.world);
  return mesh;
}

function updateSunflowerSeason(mesh, season, world = null, dt = 0) {
  const state = sunflowerSeasonState(season);
  mesh.userData.seasonUniform.value.set(
    state.growth,
    state.bloom,
    state.dry,
    state.winter,
  );
  const sun = world?.sunPosition;
  if (
    sun &&
    world.sunElevation > 0 &&
    [sun.x, sun.y, sun.z].every(Number.isFinite)
  ) {
    const tracked = mesh.userData.sunPositionUniform.value;
    if (!mesh.userData.sunTrackingInitialized) {
      tracked.copy(sun);
      mesh.userData.sunTrackingInitialized = true;
    } else if (Number.isFinite(dt) && dt > 0) {
      tracked.lerp(sun, 1 - Math.exp(-Math.min(dt, 0.1) / 0.7));
    }
  }
  return state;
}

export { createSunflowerMesh, sunflowerSeasonState, updateSunflowerSeason };
