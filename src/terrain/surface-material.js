// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreeMeshDepthMaterial,
  ThreeMeshStandardMaterial,
  ThreeRGBADepthPacking,
} from "../vendor/three-runtime.js";
import { RAILWAY_TUNNEL_GLSL } from "../layout/railway-cut.js";
import {
  TERRAIN_DETAIL_COMMON_GLSL,
  TERRAIN_SNOW_LIFT_GLSL,
  TERRAIN_SURFACE_GLSL,
  TERRAIN_SURFACE_VARYINGS_GLSL,
} from "./surface-shaders.js";
function createTerrainSurfaceMaterial(r, t) {
  const e = new ThreeMeshStandardMaterial({
    color: 16777215,
    roughness: 0.9,
    metalness: 0,
  });
  return (
    (e.onBeforeCompile = (i) => {
      (Object.assign(i.uniforms, r.uniforms, t),
        (i.vertexShader =
          r.GLSL_COMMON +
          TERRAIN_SNOW_LIFT_GLSL +
          i.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
` + TERRAIN_SURFACE_VARYINGS_GLSL,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
        float tLift = tSnowLift(transformed, normal.y);
        transformed.y += tLift;
        vTPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vTNrm = normal;
        vTLift = tLift;`,
            )),
        (i.fragmentShader =
          r.GLSL_COMMON +
          TERRAIN_SNOW_LIFT_GLSL +
          TERRAIN_DETAIL_COMMON_GLSL +
          TERRAIN_SURFACE_GLSL +
          RAILWAY_TUNNEL_GLSL +
          i.fragmentShader
            .replace(
              "#include <clipping_planes_fragment>",
              `#include <clipping_planes_fragment>
        if (railwayTunnelCut(vTPos)) discard;`,
            )
            .replace(
              "#include <common>",
              `#include <common>
` + TERRAIN_SURFACE_VARYINGS_GLSL,
            )
            .replace(
              "#include <map_fragment>",
              `#include <map_fragment>
        TSurf tS = terrainSurface(vTPos, normalize(vTNrm), vTLift);
        diffuseColor.rgb = tS.albedo;`,
            )
            .replace(
              "#include <roughnessmap_fragment>",
              "float roughnessFactor = tS.rough;",
            )
            .replace(
              "#include <normal_fragment_maps>",
              `#include <normal_fragment_maps>
        normal = normalize((viewMatrix * vec4(tS.n, 0.0)).xyz);`,
            )
            .replace(
              "#include <lights_fragment_end>",
              `#include <lights_fragment_end>
        vec3 tLit = reflectedLight.directDiffuse / max(diffuseColor.rgb, vec3(0.02));
        reflectedLight.directDiffuse += tLit * tS.caustic * vec3(0.75, 0.9, 0.82);   // focused sun on the bed
        reflectedLight.directSpecular += tLit * tS.sparkle * 1.6;
        reflectedLight.indirectDiffuse *= tS.ao;
        reflectedLight.indirectSpecular *= tS.ao;
        // puddles mirror a hint of sky; rain rings catch it on their crests
        float tF = 0.02 + 0.98 * pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 5.0);
        reflectedLight.indirectSpecular += tS.puddle * (tF + tS.ripple * 0.35) * uSkyColor * (1.0 - uNight * 0.8);`,
            )));
    }),
    (e.customProgramCacheKey = () => "wg-terrain-surface-hiking-v1"),
    e
  );
}

function createTerrainDepthMaterial(ctx) {
  const material = new ThreeMeshDepthMaterial({
    depthPacking: ThreeRGBADepthPacking,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, ctx.uniforms);
    shader.vertexShader =
      ctx.GLSL_COMMON +
      TERRAIN_SNOW_LIFT_GLSL +
      shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vTunnelWorld;",
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
        transformed.y += tSnowLift(transformed, normal.y);
        vTunnelWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
        );
    shader.fragmentShader =
      RAILWAY_TUNNEL_GLSL +
      shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vTunnelWorld;",
        )
        .replace(
          "#include <clipping_planes_fragment>",
          `#include <clipping_planes_fragment>
        if (railwayTunnelCut(vTunnelWorld)) discard;`,
        );
  };
  material.customProgramCacheKey = () => "wg-terrain-depth-tunnel";
  return material;
}

export { createTerrainSurfaceMaterial, createTerrainDepthMaterial };
