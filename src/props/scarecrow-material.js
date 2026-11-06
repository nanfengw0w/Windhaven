import { ThreeVector3 } from "../vendor/three-runtime.js";

const SCARECROW_DEFORMATION = `
uniform vec3 uScarecrowOrigin;
uniform float uScarecrowHeight;
uniform vec2 uScarecrowBend;
uniform float uScarecrowFlutter;
uniform float uScarecrowTime;

vec3 scarecrowDeform(vec3 source) {
  vec3 p = (source - uScarecrowOrigin) / uScarecrowHeight;
  vec3 rest = p;
  float t = uScarecrowTime;
  float flutter = uScarecrowFlutter;
  float side = p.x < 0.0 ? -1.0 : 1.0;
  // These continuous masks follow the supplied model, in units of its height.
  float sleeve = smoothstep(0.17, 0.39, abs(p.x)) *
    smoothstep(0.40, 0.49, p.y) * (1.0 - smoothstep(0.67, 0.73, p.y));
  float cuff = sleeve * smoothstep(0.36, 0.48, abs(p.x));
  float hem = smoothstep(0.23, 0.28, p.y) *
    (1.0 - smoothstep(0.31, 0.43, p.y)) *
    smoothstep(0.06, 0.12, length(p.xz));
  float hatRadius = length(p.xz + vec2(0.035, 0.015));
  float hatPlane = abs(p.y - 0.203 * p.x - 0.384 * p.z - 0.815);
  float brim = smoothstep(0.17, 0.23, hatRadius) *
    (1.0 - smoothstep(0.035, 0.065, hatPlane)) * smoothstep(0.69, 0.72, p.y);

  float sleeveWave = sin(t * 3.4 + side * 1.3) + 0.32 * sin(t * 6.1 + side);
  p.z += sleeve * flutter * 0.032 * sleeveWave;
  p.y += sleeve * flutter * 0.016 * sin(t * 2.7 + side * 0.9);
  p.yz += cuff * flutter * 0.0065 * vec2(sin(t * 10.1 + side), sin(t * 8.3 + side));
  p.z += hem * flutter * 0.022 * sin(t * 4.2 + rest.x * 9.0);
  p.y += brim * flutter * 0.012 * sin(t * 4.7 + rest.x * 5.0 + rest.z * 4.0);

  // The exposed stake stays fixed; the head follows one rigid upper-body rotation.
  float body = smoothstep(0.25, 0.50, rest.y);
  vec2 angle = uScarecrowBend * body;
  vec3 pivot = vec3(0.0, 0.42, 0.0);
  p -= pivot;
  float cx = cos(angle.x), sx = sin(angle.x);
  p.xy = vec2(cx * p.x + sx * p.y, -sx * p.x + cx * p.y);
  float cz = cos(angle.y), sz = sin(angle.y);
  p.yz = vec2(cz * p.y - sz * p.z, sz * p.y + cz * p.z);
  return (p + pivot) * uScarecrowHeight + uScarecrowOrigin;
}

vec3 scarecrowDeformedNormal(vec3 source, vec3 sourceNormal) {
  vec3 n = normalize(sourceNormal);
  vec3 axis = abs(n.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(cross(n, axis));
  vec3 bitangent = cross(n, tangent);
  float epsilon = uScarecrowHeight * 0.001;
  vec3 center = scarecrowDeform(source);
  vec3 a = scarecrowDeform(source + tangent * epsilon) - center;
  vec3 b = scarecrowDeform(source + bitangent * epsilon) - center;
  return normalize(cross(a, b));
}
`;

function bindScarecrowMotion(material, asset, motionUniforms) {
  const center = asset.bounds.getCenter(new ThreeVector3());
  const uniforms = {
    ...motionUniforms,
    uScarecrowOrigin: {
      value: new ThreeVector3(center.x, asset.bounds.min.y, center.z),
    },
    uScarecrowHeight: { value: asset.size.y },
  };
  const previousCompile = material.onBeforeCompile;
  const previousKey = material.customProgramCacheKey();
  material.onBeforeCompile = (shader, renderer) => {
    previousCompile.call(material, shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      SCARECROW_DEFORMATION +
      shader.vertexShader
        .replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>
           objectNormal = scarecrowDeformedNormal(position, objectNormal);`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           transformed = scarecrowDeform(transformed);`,
        );
  };
  material.customProgramCacheKey = () => `${previousKey}-scarecrow-motion-v2`;
  material.needsUpdate = true;
  return material;
}

export { bindScarecrowMotion };
