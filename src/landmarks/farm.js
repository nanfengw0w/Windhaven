import { ThreeGroup } from "../vendor/three-runtime.js";
import { FarmProps } from "../props/farm-props.js";
import { FarmCrops } from "../vegetation/farm-crops.js";
import { FarmScarecrow } from "../props/scarecrow.js";

class FarmSystem {
  constructor(ctx) {
    this.group = new ThreeGroup();
    this.group.name = "cabin-farm";
    this.props = new FarmProps(ctx, this.group);
    this.crops = new FarmCrops(ctx, this.group);
    this.scarecrow = new FarmScarecrow(ctx, this.group);
    this.stats = {
      scenery: this.props.stats,
      crops: this.crops.stats,
      scarecrow: this.scarecrow.stats,
    };
    ctx.scene.add(this.group);
  }

  update(dt) {
    if (this.disposed) return;
    this.props.update(dt);
    this.crops.update(dt);
    this.scarecrow.update(dt);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.scarecrow.dispose();
    this.crops.dispose();
    this.props.dispose();
    this.group.removeFromParent();
  }
}

export { FarmSystem };
