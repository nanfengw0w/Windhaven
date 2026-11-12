function sampleLanternFlame(time, phase) {
  const rate = 1.55 + 0.23 * Math.sin(phase);
  const breath = 0.5 + 0.5 * Math.sin(time * rate + phase);
  const flicker =
    0.08 * Math.sin(time * 8.6 + phase * 3.1) +
    0.045 * Math.sin(time * 15.1 + phase * 5.3);
  return 0.3 + 0.7 * breath + flicker;
}

export { sampleLanternFlame };
