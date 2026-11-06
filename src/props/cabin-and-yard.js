// Coordinates procedural props and their shared placement/perch metadata in the original build order.
import { createSeededRandom } from "../core/math.js";
import {
  ThreeMatrix4,
  ThreeMatrix3,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { CABIN_PLACEMENT } from "../simulation/terrain-shape.js";
import { PropGeometryBuilder } from "./geometry.js";
import { buildCabin } from "./cabin.js";
import { buildYard } from "./yard.js";
import { buildJetty } from "./jetty.js";
class CabinAndYardProps {
  constructor(t, e, i) {
    ((this.ctx = t), (this.rand = createSeededRandom(5150)));
    const s = (o, a) => o + (a - o) * this.rand();
    ((this.R = s),
      (this.cabinFrame = new ThreeMatrix4()
        .makeRotationY(CABIN_PLACEMENT.rot)
        .setPosition(CABIN_PLACEMENT.x, CABIN_PLACEMENT.y, CABIN_PLACEMENT.z)),
      (this.cabinRot = new ThreeMatrix3().setFromMatrix4(this.cabinFrame)));
    const n = new PropGeometryBuilder();
    ((this.perches = []),
      buildCabin(this, n),
      buildYard(this, n),
      buildJetty(this, n),
      (this.geometry = n.toGeometry()),
      (this.lu = i));
  }
  cabinPoint(t, e, i, s = new ThreeVector3()) {
    return s.set(t, e, i).applyMatrix4(this.cabinFrame);
  }
  _wp(t, e, i, s) {
    const n = new ThreeVector3(e, i, s).applyMatrix4(t);
    return {
      x: n.x,
      y: n.y,
      z: n.z,
    };
  }
}
export { CabinAndYardProps };
