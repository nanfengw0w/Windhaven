import { ThreeDataUtils, ThreeHalfFloatType } from "../vendor/three-runtime.js";
import { FIELD_BOUNDS } from "../core/config.js";
import { clamp, lerp } from "../core/math.js";

const fruitWind = { x: 0, z: 0, turbulence: 0 };

function shaderHash(x, z) {
  const f32 = Math.fround;
  x = f32(f32(x) * f32(123.34));
  z = f32(f32(z) * f32(456.21));
  x = f32(x - Math.floor(x));
  z = f32(z - Math.floor(z));
  const dot = f32(f32(x * f32(x + f32(45.32))) + f32(z * f32(z + f32(45.32))));
  const product = f32(f32(x + dot) * f32(z + dot));
  return f32(product - Math.floor(product));
}

function shaderNoise(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const u = fx * fx * (3 - 2 * fx);
  const v = fz * fz * (3 - 2 * fz);
  return lerp(
    lerp(shaderHash(ix, iz), shaderHash(ix + 1, iz), u),
    lerp(shaderHash(ix, iz + 1), shaderHash(ix + 1, iz + 1), u),
    v,
  );
}

// Match shared-shaders.js windAt(), including its texture interpolation and
// travelling gust. WindField.sample() uses a different gust for loose particles;
// using it for fruit still attached to a shader-animated branch causes drift.
function sampleFruitBranchWind(ctx, x, z, time, out = fruitWind) {
  const wind = ctx.wind;
  const nx = wind.nx;
  const nz = wind.nz;
  const gx = clamp(
    ((x - FIELD_BOUNDS.minX) / FIELD_BOUNDS.sizeX) * nx - 0.5,
    0,
    nx - 1,
  );
  const gz = clamp(
    ((z - FIELD_BOUNDS.minZ) / FIELD_BOUNDS.sizeZ) * nz - 0.5,
    0,
    nz - 1,
  );
  const ix = Math.floor(gx);
  const iz = Math.floor(gz);
  const x1 = Math.min(ix + 1, nx - 1);
  const z1 = Math.min(iz + 1, nz - 1);
  const fx = gx - ix;
  const fz = gz - iz;
  // Read the rendered texture, including the half-float fallback, so the first
  // airborne position follows the last rendered branch as closely as possible.
  const texture = wind.texture;
  const data = texture.image.data;
  const read =
    texture.type === ThreeHalfFloatType
      ? (index) => ThreeDataUtils.fromHalfFloat(data[index])
      : (index) => data[index];
  const sample = (channel) =>
    lerp(
      lerp(
        read((iz * nx + ix) * 4 + channel),
        read((iz * nx + x1) * 4 + channel),
        fx,
      ),
      lerp(
        read((z1 * nx + ix) * 4 + channel),
        read((z1 * nx + x1) * 4 + channel),
        fx,
      ),
      fz,
    );
  const dir = ctx.uniforms.uGustDir.value;
  const storm = ctx.uniforms.uStorm.value;
  const f32 = Math.fround;
  const noise = shaderNoise(
    f32(
      f32(f32(f32(x) * f32(0.35)) - f32(f32(dir.x * f32(time)) * 0.5)) +
        f32(f32(time) * f32(0.05)),
    ),
    f32(f32(f32(z) * f32(0.35)) - f32(f32(dir.y * f32(time)) * 0.5)),
  );
  const gust = (0.55 + 0.9 * noise - 1) * (0.6 + storm);
  out.x = sample(0) + dir.x * gust;
  out.z = sample(1) + dir.y * gust;
  out.turbulence = sample(3);
  return out;
}

// CPU counterpart of vegTreeDisplace() for an apple's branch attachment point.
// Leaf-card flutter is deliberately absent: fruit follows the woody branch.
function sampleFruitAttachment(ctx, entry, anchor, time, out) {
  const { plant, owner, index } = entry;
  const [x, y, z] = anchor.position;
  const height = plant.height;
  const phase = anchor.phase * 6.2831853;
  const wind = sampleFruitBranchWind(ctx, plant.x, plant.z, time);
  const speed = Math.hypot(wind.x, wind.z);
  const dx = speed > 1e-4 ? wind.x / speed : 1;
  const dz = speed > 1e-4 ? wind.z / speed : 0;
  const turbulence = wind.turbulence;
  const storm = ctx.uniforms.uStorm.value;
  const frequency = 0.95 / Math.sqrt(height);
  const lean = (1 - Math.exp(-speed * 0.3)) * 0.2;
  const oscillation =
    Math.sin(time * frequency * 6.2832 + phase) * 0.6 +
    Math.sin(time * frequency * 14.7 + phase * 1.7) * 0.22;
  const swirl =
    Math.sin(time * frequency * 8.3 + phase * 2.3) +
    0.4 * Math.sin(time * frequency * 19 + phase);
  const whip = 0.22 + turbulence * 0.8 + Math.min(speed, 5) * 0.1;
  const along = lean * (1 + oscillation * whip);
  const across = lean * swirl * (0.12 + turbulence * 0.6 + storm * 0.3);
  const topX = (dx * along - dz * across) * height + owner._bend[index * 2];
  const topZ = (dz * along + dx * across) * height + owner._bend[index * 2 + 1];
  const r = clamp((y - plant.y) / height, 0, 1.4);
  const r2 = r * r;
  const energy =
    (0.004 +
      0.006 * Math.min(speed, 6) +
      0.018 * turbulence +
      storm * 0.006 +
      owner._rustle[index] * 0.035) *
    height *
    anchor.flex *
    anchor.flex;
  return out.set(
    x + topX * r2 + Math.sin(time * 3.7 + x * 3.1 + y * 3.1 + phase) * energy,
    y -
      ((topX * topX + topZ * topZ) / height) * 0.55 * r2 * r +
      Math.sin(time * 4.3 + z * 3.1 * 1.3 + phase * 1.3) * 0.5 * energy,
    z +
      topZ * r2 +
      Math.sin(time * 3.1 + z * 3.1 + y * 3.1 * 0.7 + phase * 0.7) * energy,
  );
}

export { sampleFruitAttachment, sampleFruitBranchWind };
