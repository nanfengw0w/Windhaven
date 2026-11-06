// Shared scalar operations used by cloud simulation, input and rendering.
const clampCloudSystem = (r, t, e) => (r < t ? t : r > e ? e : r);
const saturateCloudSystem = (r) => (r < 0 ? 0 : r > 1 ? 1 : r);
const smoothstepCloudSystem = (r, t, e) => {
  const i = saturateCloudSystem((e - r) / (t - r));
  return i * i * (3 - 2 * i);
};
const dampCloudSystem = (r, t, e, i) => r + (t - r) * (1 - Math.exp(-e * i));
export {
  clampCloudSystem,
  saturateCloudSystem,
  smoothstepCloudSystem,
  dampCloudSystem,
};
