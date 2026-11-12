const LANTERN_PAPER_LIGHT = `
  float paper = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
  float wick = exp(-4.0 * abs(vPaperHeight - 0.24));
  vec3 amber = paper * vec3(1.0, 0.57, 0.24);
  float paperTransmission = 0.22 + (0.47 + 0.16 * wick) * vLanternFlame;
  outgoingLight = mix(outgoingLight, amber, 0.62) * paperTransmission;
  outgoingLight += vec3(0.39, 0.133, 0.031) * wick * vLanternFlame
    * smoothstep(0.08, 0.6, paper);
`;

function sampleLanternFlame(time, phase) {
  const rate = 1.55 + 0.23 * Math.sin(phase);
  const breath = 0.5 + 0.5 * Math.sin(time * rate + phase);
  const flicker =
    0.08 * Math.sin(time * 8.6 + phase * 3.1) +
    0.045 * Math.sin(time * 15.1 + phase * 5.3);
  return 0.3 + 0.7 * breath + flicker;
}

export { LANTERN_PAPER_LIGHT, sampleLanternFlame };
