import { ThreeVector2 } from "../vendor/three-runtime.js";
import { clamp, damp } from "../core/math.js";
import { FARM } from "../layout/farm-layout.js";

const MAX_BEND = 0.2;
const REST_FLUTTER = 0.2;

class ScarecrowMotion {
  constructor(ctx = {}) {
    this.ctx = ctx;
    this.uniforms = {
      uScarecrowBend: { value: new ThreeVector2() },
      uScarecrowFlutter: { value: REST_FLUTTER },
      uScarecrowTime: { value: 0 },
    };
    this.velocity = new ThreeVector2();
    this.sample = { x: 0, z: 0 };
    this.elapsed = 0;
    this.disposed = false;
    this.offScenario = ctx.events?.on?.("scenario", () => this.reset());
  }

  reset() {
    this.elapsed = 0;
    this.velocity.set(0, 0);
    this.uniforms.uScarecrowBend.value.set(0, 0);
    this.uniforms.uScarecrowFlutter.value = REST_FLUTTER;
    this.uniforms.uScarecrowTime.value = 0;
  }

  update(dt) {
    if (this.disposed || !Number.isFinite(dt) || dt <= 0) return;
    const step = Math.min(dt, 0.25);
    const { x, z, yaw } = FARM.scarecrow;
    this.sample.x = this.sample.z = 0;
    this.ctx.wind?.sample?.(x, z, this.sample);
    const worldX = Number.isFinite(this.sample.x) ? this.sample.x : 0;
    const worldZ = Number.isFinite(this.sample.z) ? this.sample.z : 0;
    const speed = Math.hypot(worldX, worldZ);
    const turbulence = this.ctx.wind?.turbulenceAt?.(x, z) ?? 0;
    const gust = Number.isFinite(turbulence) ? clamp(turbulence, 0, 1) : 0;
    // Inverse of the model's Y rotation: the shader bends in local X/Z.
    const cos = Math.cos(yaw);
    const sin = Math.sin(yaw);
    const pressure = 0.145 * (1 - Math.exp(-speed * 0.45));
    const forceScale = speed > 0 ? pressure / speed : 0;
    const windX = (cos * worldX - sin * worldZ) * forceScale;
    const windZ = (sin * worldX + cos * worldZ) * forceScale;
    const bend = this.uniforms.uScarecrowBend.value;
    const count = Math.ceil(step / (1 / 120));
    const h = step / count;

    for (let i = 0; i < count; i++) {
      this.elapsed += h;
      const t = this.elapsed;
      const targetX =
        windX +
        0.02 * Math.sin(t * 0.95) +
        0.006 * Math.sin(t * 1.71) +
        gust * 0.0105 * Math.sin(t * 4.3);
      const targetZ =
        windZ +
        0.014 * Math.sin(t * 0.73) +
        0.006 * Math.sin(t * 1.37) +
        gust * 0.0075 * Math.sin(t * 3.7);
      // A damped spring gives gusts a short recoil without a persistent lean.
      this.velocity.x += ((targetX - bend.x) * 25 - this.velocity.x * 6.5) * h;
      this.velocity.y += ((targetZ - bend.y) * 25 - this.velocity.y * 6.5) * h;
      bend.addScaledVector(this.velocity, h);
      const length = bend.length();
      if (length > MAX_BEND) {
        bend.multiplyScalar(MAX_BEND / length);
        const outward = this.velocity.dot(bend) / (MAX_BEND * MAX_BEND);
        if (outward > 0) this.velocity.addScaledVector(bend, -outward);
      }
    }

    const flutter = clamp(
      REST_FLUTTER +
        (1 - Math.exp(-speed * 0.28)) * 0.55 +
        gust * 0.24 +
        this.velocity.length() * 1.2,
      0,
      1,
    );
    this.uniforms.uScarecrowFlutter.value = damp(
      this.uniforms.uScarecrowFlutter.value,
      flutter,
      4,
      step,
    );
    this.uniforms.uScarecrowTime.value = this.elapsed;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.offScenario?.();
    this.offScenario = null;
  }
}

export { ScarecrowMotion };
