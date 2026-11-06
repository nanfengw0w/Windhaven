import { TERRARIUM_BOUNDS } from "../core/config.js";
import { RAILWAY, RAILWAY_TUNNEL_SEGMENT } from "./world-layout.js";

// Match the small single portal in AlpineTownLandmark. The finite straight
// approach is the only bore; the bend and front cross-map railway stay intact.
const RAILWAY_TUNNEL = Object.freeze({
  floorY: RAILWAY.y - 0.07,
  springY: RAILWAY.y + 0.32,
  radius: 0.23,
  minX: TERRARIUM_BOUNDS.halfW + 0.55,
  start: RAILWAY_TUNNEL_SEGMENT.start,
  end: RAILWAY_TUNNEL_SEGMENT.end,
});
const dx = RAILWAY_TUNNEL.end.x - RAILWAY_TUNNEL.start.x;
const dz = RAILWAY_TUNNEL.end.z - RAILWAY_TUNNEL.start.z;
const length = Math.hypot(dx, dz);
const axisX = dx / length;
const axisZ = dz / length;

function railwayDistance(x, z) {
  const qx = x - RAILWAY_TUNNEL.start.x;
  const qz = z - RAILWAY_TUNNEL.start.z;
  const along = Math.max(0, Math.min(length, qx * axisX + qz * axisZ));
  return Math.hypot(qx - axisX * along, qz - axisZ * along);
}

function railwayTunnelContains(x, y, z) {
  const cut = RAILWAY_TUNNEL;
  if (x <= cut.minX || y <= cut.floorY || y >= cut.springY + cut.radius)
    return false;
  const qx = x - cut.start.x;
  const qz = z - cut.start.z;
  const along = qx * axisX + qz * axisZ;
  if (along < 0 || along > length) return false;
  const side = qx * -axisZ + qz * axisX;
  const aboveSpring = Math.max(0, y - cut.springY);
  return side * side + aboveSpring * aboveSpring < cut.radius * cut.radius;
}

const f = (value) => value.toFixed(8);
const RAILWAY_TUNNEL_GLSL = `
bool railwayTunnelCut(vec3 p) {
  if (p.x <= ${f(RAILWAY_TUNNEL.minX)} ||
      p.y <= ${f(RAILWAY_TUNNEL.floorY)} || p.y >= ${f(RAILWAY_TUNNEL.springY + RAILWAY_TUNNEL.radius)}) return false;
  vec2 q = p.xz - vec2(${f(RAILWAY_TUNNEL.start.x)}, ${f(RAILWAY_TUNNEL.start.z)});
  vec2 axis = vec2(${f(axisX)}, ${f(axisZ)});
  float along = dot(q, axis);
  if (along < 0.0 || along > ${f(length)}) return false;
  float side = dot(q, vec2(-axis.y, axis.x));
  float aboveSpring = max(0.0, p.y - ${f(RAILWAY_TUNNEL.springY)});
  return side * side + aboveSpring * aboveSpring < ${f(RAILWAY_TUNNEL.radius * RAILWAY_TUNNEL.radius)};
}
`;

export {
  RAILWAY_TUNNEL,
  RAILWAY_TUNNEL_GLSL,
  railwayDistance,
  railwayTunnelContains,
};
