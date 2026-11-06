// Studio background gradient and halo. Shader bodies are preserved verbatim.
const BACKDROP_COMMON_GLSL = `
uniform vec3 uBdRoom;        // room colour (linear)
uniform vec3 uHaloDir;       // camera → case centre (unit)
uniform float uHalo;         // halo strength (dims at night)
uniform vec3 uHaloTint;      // follows the world light a little
vec3 gBackdrop(vec3 d) {
  float g = max(dot(d, uHaloDir), 0.0);
  float halo = pow(g, 10.0) * 0.6 + pow(g, 3.0) * 0.3 + g * g * 0.06;
  vec3 c = uBdRoom * (0.26 + uHalo * halo * 1.25);
  c *= 1.0 - 0.55 * smoothstep(0.0, 0.75, d.y);                 // ceiling falls into darkness
  c *= mix(vec3(1.0), uHaloTint, clamp(halo * uHalo, 0.0, 1.0)); // warm halo behind the case
  return c;
}
`;

const BACKDROP_VERTEX_GLSL = `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const BACKDROP_FRAGMENT_GLSL = `
varying vec3 vWorld;
void main() {
  vec3 d = normalize(vWorld - cameraPosition);
  vec3 c = gBackdrop(d);
  // cloth-like large-scale mottling so the gradient never looks digital
  c *= 0.92 + 0.16 * wgNoise(d.xz * 5.0 / max(0.25, 1.0 + d.y) + d.y * 3.0);
  gl_FragColor = vec4(c, 1.0);
}
`;
export { BACKDROP_COMMON_GLSL, BACKDROP_VERTEX_GLSL, BACKDROP_FRAGMENT_GLSL };
