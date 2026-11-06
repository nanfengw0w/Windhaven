import { smoothstep } from "../core/math.js";

const PLANT_SPECIES_CODES = Object.freeze({
  pine: 0,
  oak: 1,
  birch: 2,
  cherry: 3,
  bush: 4,
  evergreen: 5,
  plum: 6,
  apple: 7,
});

function isShrubSpecies(code) {
  return (
    code === PLANT_SPECIES_CODES.bush || code === PLANT_SPECIES_CODES.evergreen
  );
}

function isDeciduousSpecies(code) {
  return (
    code === PLANT_SPECIES_CODES.oak ||
    code === PLANT_SPECIES_CODES.birch ||
    code === PLANT_SPECIES_CODES.cherry ||
    code === PLANT_SPECIES_CODES.bush ||
    code === PLANT_SPECIES_CODES.plum ||
    code === PLANT_SPECIES_CODES.apple
  );
}

// The annual dial is cyclic: 0 spring, 1 summer, 2 autumn, 3 winter.
// Keep these windows identical to vegBlossomAmount below: visible flowers and
// detached petals must agree, including the late-winter to spring wrap.
function treeBlossomAmount(code, season, cherryBlossom = 0) {
  const s = ((season % 4) + 4) % 4;
  if (code === PLANT_SPECIES_CODES.plum) {
    const spring = s > 3 ? s - 4 : s;
    return (
      smoothstep(-0.38, -0.02, spring) * (1 - smoothstep(0.18, 0.5, spring))
    );
  }
  if (code === PLANT_SPECIES_CODES.apple)
    return smoothstep(0.12, 0.32, s) * (1 - smoothstep(0.58, 0.82, s));
  return code === PLANT_SPECIES_CODES.cherry ? cherryBlossom : 0;
}

function appleFruitSeason(season) {
  const s = ((season % 4) + 4) % 4;
  return {
    growth: smoothstep(0.7, 1.35, s) * (1 - smoothstep(2.48, 2.78, s)),
    ripeness: smoothstep(1.25, 1.95, s),
    drop: smoothstep(1.95, 2.5, s) * (1 - smoothstep(2.65, 2.85, s)),
  };
}

const TREE_SPECIES_GLSL = `
#ifndef WG_TREE_SPECIES
#define WG_TREE_SPECIES
bool vegIsEvergreen(float kind) {
  return kind < 0.5 || (kind > 4.5 && kind < 5.5);
}
bool vegIsShrub(float kind) {
  return kind > 3.5 && kind < 5.5;
}
float vegBlossomAmount(float kind) {
  float s = mod(mod(uSeason, 4.0) + 4.0, 4.0);
  if (kind > 5.5 && kind < 6.5) {
    float spring = s > 3.0 ? s - 4.0 : s;
    return smoothstep(-0.38, -0.02, spring) * (1.0 - smoothstep(0.18, 0.5, spring));
  }
  if (kind > 6.5 && kind < 7.5)
    return smoothstep(0.12, 0.32, s) * (1.0 - smoothstep(0.58, 0.82, s));
  return kind > 2.5 && kind < 3.5 ? uBlossom : 0.0;
}
#endif
`;

export {
  PLANT_SPECIES_CODES,
  isShrubSpecies,
  isDeciduousSpecies,
  treeBlossomAmount,
  appleFruitSeason,
  TREE_SPECIES_GLSL,
};
