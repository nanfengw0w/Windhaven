// Reconstructed module: identifiers and file boundaries are refactor choices.
import { BirdAmbience } from "./birds.js";
import { InsectAmbience } from "./insects.js";
import { FrogAmbience } from "./frogs.js";
import {
  RainAmbience,
  RoomAmbience,
  SnowAmbience,
  WaterAmbience,
  WindAmbience,
} from "./weather-beds.js";
class Soundscape {
  constructor(t, { tier: e = 1 } = {}) {
    ((this.eng = t),
      (this.ac = t.ac),
      (this.N = t.noise),
      (this.tier = e),
      (this.out = this.ac.createGain()),
      (this.out.gain.value = 0.7),
      this.out.connect(t.beds),
      (this.wind = new WindAmbience(this)),
      (this.rain = new RainAmbience(this)),
      (this.snow = new SnowAmbience(this)),
      (this.water = new WaterAmbience(this)),
      (this.room = new RoomAmbience(this)),
      (this.birds = new BirdAmbience(this)),
      (this.insects = new InsectAmbience(this)),
      (this.frogs = new FrogAmbience(this)),
      (this.beds = [
        this.wind,
        this.rain,
        this.snow,
        this.water,
        this.room,
        this.birds,
        this.insects,
        this.frogs,
      ]));
  }
  update(t, e, i) {
    for (const s of this.beds) s.update(t, e, i);
  }
  dispose() {
    for (const t of this.beds) t.dispose?.();
    try {
      this.out.disconnect();
    } catch {}
  }
}
export { Soundscape };
