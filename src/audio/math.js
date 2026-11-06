// Reconstructed module: identifiers and file boundaries are refactor choices.
const audioClamp = (r, t, e) => (r < t ? t : r > e ? e : r);
const audioLerp = (r, t, e) => r + (t - r) * e;
function audioSmoothstep(r, t, e) {
  const i = audioClamp((e - r) / (t - r), 0, 1);
  return i * i * (3 - 2 * i);
}
function createAudioRandom(r = 1) {
  let t = r >>> 0;
  return function () {
    t = (t + 1831565813) >>> 0;
    let i = t;
    return (
      (i = Math.imul(i ^ (i >>> 15), i | 1)),
      (i ^= i + Math.imul(i ^ (i >>> 7), i | 61)),
      ((i ^ (i >>> 14)) >>> 0) / 4294967296
    );
  };
}
function audioHash(r) {
  let t = Math.imul(r | 0, 668265261) ^ 374761393;
  return (
    (t = Math.imul(t ^ (t >>> 15), 2246822507)),
    (t ^= t >>> 13),
    (t = Math.imul(t, 3266489909)),
    (t ^= t >>> 16),
    (t >>> 0) / 4294967296
  );
}
function audioValueNoise(r, t = 0) {
  const e = Math.floor(r),
    i = r - e,
    s = i * i * (3 - 2 * i),
    n = (t | 0) * 7919;
  return audioLerp(audioHash(e + n), audioHash(e + 1 + n), s);
}
function seasonDistance(r, t) {
  let e = Math.abs((((r - t) % 4) + 4) % 4);
  return (e > 2 && (e = 4 - e), e);
}
export {
  audioClamp,
  audioSmoothstep,
  audioValueNoise,
  createAudioRandom,
  seasonDistance,
};
