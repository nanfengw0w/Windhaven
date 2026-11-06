import {
  ThreeBufferAttribute,
  ThreeBufferGeometry,
  ThreeDynamicDrawUsage,
  ThreePoints,
  ThreeShaderMaterial,
} from "../vendor/three-runtime.js";
import { clamp, createSeededRandom, smoothstep } from "../core/math.js";

function willowCatkinAmount(season, rain = 0, snow = 0) {
  const wrapped = ((season % 4) + 4) % 4;
  const delta = Math.abs(wrapped - 0.2);
  const distance = Math.min(delta, 4 - delta);
  return (
    (1 - smoothstep(0.25, 0.7, distance)) *
    (1 - smoothstep(0.05, 0.5, rain)) *
    (1 - smoothstep(0, 0.08, snow))
  );
}

class WillowCatkins {
  constructor(ctx, plants, group) {
    this.ctx = ctx;
    this.plants = plants;
    this.capacity = ctx.quality.pick(48, 80, 112);
    this.positions = new Float32Array(this.capacity * 3);
    this.life = new Float32Array(this.capacity * 4);
    this.particles = Array.from({ length: this.capacity }, () => ({
      age: 0,
      lifetime: 0,
      vx: 0,
      vz: 0,
      phase: 0,
      kind: 0,
    }));
    this.random = createSeededRandom(883440);
    this.wind = { x: 0, z: 0 };
    this.cursor = 0;
    this.timer = 0;
    this.stats = { capacity: this.capacity, active: 0, catkins: 0, leaves: 0 };
    this.geometry = new ThreeBufferGeometry();
    this.positionAttribute = new ThreeBufferAttribute(
      this.positions,
      3,
    ).setUsage(ThreeDynamicDrawUsage);
    this.lifeAttribute = new ThreeBufferAttribute(this.life, 4).setUsage(
      ThreeDynamicDrawUsage,
    );
    this.geometry.setAttribute("position", this.positionAttribute);
    this.geometry.setAttribute("aLife", this.lifeAttribute);
    this.material = new ThreeShaderMaterial({
      uniforms: { ...ctx.uniforms, uWillowPixels: { value: 700 } },
      transparent: true,
      depthWrite: false,
      vertexShader: `
        attribute vec4 aLife;
        uniform float uWillowPixels;
        varying vec4 vLife;
        void main() {
          vLife = aLife;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aLife.z > 0.001 ? clamp(aLife.x * uWillowPixels * projectionMatrix[1][1] / max(0.1, -mv.z), 0.7, 18.0) : 0.0;
        }`,
      fragmentShader: `
        uniform float uNight;
        uniform float uSeason;
        uniform vec3 uFoliageColor;
        varying vec4 vLife;
        void main() {
          vec2 p = gl_PointCoord * 2.0 - 1.0;
          float ca = cos(vLife.y), sa = sin(vLife.y);
          p = mat2(ca, -sa, sa, ca) * p;
          float alpha;
          vec3 color;
          if (vLife.w < 0.5) {
            float radius = length(p);
            float tuft = pow(abs(cos(atan(p.y, p.x) * 4.0)), 5.0);
            alpha = (1.0 - smoothstep(0.25, 0.95, radius)) * (0.32 + tuft * 0.5);
            color = mix(vec3(0.96, 0.96, 0.88), vec3(0.25, 0.32, 0.4), uNight * 0.85);
          } else {
            float shape = length(vec2(p.x * 3.8, p.y));
            alpha = 1.0 - smoothstep(0.72, 1.0, shape);
            float autumn = smoothstep(1.35, 2.0, uSeason) * (1.0 - smoothstep(2.6, 3.2, uSeason));
            vec3 leafColor = mix(uFoliageColor, vec3(0.78, 0.57, 0.13), autumn * 0.85);
            color = leafColor * (0.65 + 0.2 * p.x) * (1.0 - uNight * 0.7);
          }
          alpha *= vLife.z;
          if (alpha < 0.015) discard;
          gl_FragColor = vec4(color, alpha);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    this.mesh = new ThreePoints(this.geometry, this.material);
    this.mesh.name = "willow-catkins-and-leaves";
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 3;
    group.add(this.mesh);
  }
  _amount() {
    const w = this.ctx.world;
    return willowCatkinAmount(w.season, w.rainfall, w.snowfall);
  }
  _spawn(plant, kind, count = 1) {
    const random = this.random;
    for (let n = 0; n < count; n++) {
      let found = -1;
      for (let j = 0; j < this.capacity; j++) {
        const index = (this.cursor + j) % this.capacity;
        if (this.particles[index].age >= this.particles[index].lifetime) {
          found = index;
          break;
        }
      }
      if (found < 0) return;
      this.cursor = (found + 1) % this.capacity;
      const particle = this.particles[found];
      const angle = random() * Math.PI * 2;
      const radius = plant.radius * (0.25 + random() * 0.85);
      this.positions[found * 3] = plant.x + Math.cos(angle) * radius;
      this.positions[found * 3 + 1] =
        plant.y + plant.height * (0.42 + random() * 0.38);
      this.positions[found * 3 + 2] = plant.z + Math.sin(angle) * radius;
      particle.age = 0;
      particle.lifetime = kind === 0 ? 5 + random() * 4 : 2.4 + random() * 1.8;
      particle.vx = Math.cos(angle) * 0.04;
      particle.vz = Math.sin(angle) * 0.04;
      particle.phase = random() * Math.PI * 2;
      particle.kind = kind;
      this.life[found * 4] =
        kind === 0 ? 0.014 + random() * 0.008 : 0.042 + random() * 0.018;
      this.life[found * 4 + 1] = angle;
      this.life[found * 4 + 2] = 0;
      this.life[found * 4 + 3] = kind;
    }
  }
  shake(payload, index) {
    if (this._disposed) return;
    const strength = clamp(payload.strength || 0.2, 0, 1.5);
    const spring = this._amount();
    if (spring > 0.05)
      this._spawn(
        this.plants[index],
        0,
        Math.ceil((3 + strength * 7) * spring),
      );
    else if (this.ctx.world.seasonal.leafAmount > 0.15)
      this._spawn(this.plants[index], 1, Math.ceil(1 + strength * 3));
  }
  update(dt) {
    if (this._disposed || dt <= 0) return;
    const world = this.ctx.world;
    const spring = this._amount();
    const autumn = world.seasonal.fallingLeaves || 0;
    const wetSuppression = 1 - clamp(world.rainfall + world.snowfall, 0, 1);
    const rate =
      (spring * 2.1 + autumn * 0.65 * wetSuppression) * this.plants.length;
    this.timer += dt * rate;
    while (this.timer >= 1) {
      const plant = this.plants[Math.floor(this.random() * this.plants.length)];
      this.ctx.wind?.sample(plant.x, plant.z, this.wind);
      this._spawn(plant, spring > 0.05 ? 0 : 1);
      this.timer -= 1;
    }
    const stats = this.stats;
    stats.active = stats.catkins = stats.leaves = 0;
    const influence = 1 - Math.exp(-dt * 2.2);
    for (let i = 0; i < this.capacity; i++) {
      const particle = this.particles[i];
      if (particle.age >= particle.lifetime) {
        this.life[i * 4 + 2] = 0;
        continue;
      }
      particle.age += dt;
      const p = i * 3;
      this.ctx.wind?.sample(
        this.positions[p],
        this.positions[p + 2],
        this.wind,
      );
      particle.vx += (this.wind.x * 0.2 - particle.vx) * influence;
      particle.vz += (this.wind.z * 0.2 - particle.vz) * influence;
      const flutter = particle.age * 2.3 + particle.phase;
      this.positions[p] += (particle.vx + Math.sin(flutter) * 0.035) * dt;
      this.positions[p + 2] +=
        (particle.vz + Math.cos(flutter * 0.8) * 0.035) * dt;
      this.positions[p + 1] +=
        ((particle.kind === 0 ? -0.018 : -0.24) +
          Math.sin(flutter * 1.4) * 0.035) *
        dt;
      this.life[i * 4 + 1] += dt * (particle.kind === 0 ? 0.7 : 2.2);
      let alpha =
        smoothstep(0, 0.4, particle.age) *
        smoothstep(0, 0.8, particle.lifetime - particle.age);
      if (particle.kind === 0) alpha *= spring;
      else alpha *= smoothstep(0, 0.1, world.seasonal.leafAmount);
      const ground = this.ctx.terrain.height(
        this.positions[p],
        this.positions[p + 2],
      );
      if (
        this.positions[p + 1] <= Math.max(ground, world.lakeLevel) + 0.025 ||
        Math.abs(this.positions[p]) > this.ctx.box.halfW ||
        Math.abs(this.positions[p + 2]) > this.ctx.box.halfD
      ) {
        particle.age = particle.lifetime;
        alpha = 0;
      }
      this.life[i * 4 + 2] = alpha;
      if (alpha > 0.001) {
        stats.active++;
        if (particle.kind === 0) stats.catkins++;
        else stats.leaves++;
      }
    }
    this.positionAttribute.needsUpdate = true;
    this.lifeAttribute.needsUpdate = true;
    this.material.uniforms.uWillowPixels.value =
      this.ctx.renderer?.domElement?.height || 700;
  }
  reset() {
    this.timer = 0;
    for (const particle of this.particles) particle.age = particle.lifetime;
    this.life.fill(0);
    this.lifeAttribute.needsUpdate = true;
    this.stats.active = this.stats.catkins = this.stats.leaves = 0;
  }
  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this.mesh.removeFromParent();
    this.geometry.dispose();
    this.material.dispose();
  }
}

export { WillowCatkins, willowCatkinAmount };
