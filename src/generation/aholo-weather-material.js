import { COMMON_GLSL } from "../render/shared-shaders.js";

function patchAholoWeatherMaterial(material, uniforms) {
  if (material.userData.aholoWeather) return;
  material.userData.aholoWeather = true;
  const previous = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    if (typeof previous === "function")
      previous.call(material, shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader =
      COMMON_GLSL +
      shader.fragmentShader.replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        vec3 aholoWorldPos = cameraPosition - vViewPosition * mat3(viewMatrix);
        vec3 aholoWorldNormal = transformNormalByInverseViewMatrix(nonPerturbedNormal, viewMatrix);
        vec3 aholoFaceNormal = cross(dFdx(vViewPosition), dFdy(vViewPosition));
        float aholoFaceUp = transformNormalByInverseViewMatrix(aholoFaceNormal, viewMatrix).y;
        // Keep smoothed corners from carrying snow down the actual side faces.
        float aholoUp = min(aholoWorldNormal.y, aholoFaceUp + 0.12);
        float aholoGrain = wgNoise3(aholoWorldPos * 43.0);
        float aholoCatch = smoothstep(0.38, 0.86, aholoUp + (aholoGrain - 0.5) * 0.12);
        float aholoSnow = smoothstep(0.18, 0.8, snowCover(aholoWorldPos.xz, aholoWorldNormal) * aholoCatch);
        vec4 aholoGround = groundAt(aholoWorldPos.xz);
        float aholoFrost = aholoGround.w * smoothstep(-0.3, 0.7, aholoUp) * 0.4 * (1.0 - aholoSnow);
        vec3 aholoSnowColor = vec3(0.64, 0.68, 0.72) * mix(0.95, 1.05, aholoGrain);
        diffuseColor.rgb *= mix(1.0, 0.64, aholoGround.y * 0.72);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.78, 0.83, 0.9), aholoFrost);
        diffuseColor.rgb = mix(diffuseColor.rgb, aholoSnowColor, aholoSnow * 0.94);
        roughnessFactor = mix(roughnessFactor, max(roughnessFactor, 0.9), aholoFrost);
        roughnessFactor = mix(roughnessFactor, 0.84, aholoSnow);
        metalnessFactor *= 1.0 - aholoSnow;
        normal = normalize(mix(normal, nonPerturbedNormal, aholoSnow * 0.7));`,
      );
  };
  material.customProgramCacheKey = () => "aholo-weather-3";
  material.needsUpdate = true;
}

export { patchAholoWeatherMaterial };
