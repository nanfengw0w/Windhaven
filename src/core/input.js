// Reconstructed module: identifiers and file boundaries are refactor choices.
import {
  ThreePlane,
  ThreeRaycaster,
  ThreeVector2,
  ThreeVector3,
} from "../vendor/three-runtime.js";
import { TOOL_NAMES } from "./config.js";
const inputCameraDirection = new ThreeVector3();
const inputCameraPlane = new ThreePlane();
class InputController {
  constructor(t) {
    ((this.ctx = t),
      (this.el = t.renderer.domElement),
      (this.camera = t.camera),
      (this.tool = "hand"),
      (this.handlers = []),
      (this.raycaster = new ThreeRaycaster()),
      (this.enabled = !0),
      (this.pointer = {
        x: 0,
        y: 0,
        ndc: new ThreeVector2(),
        ray: this.raycaster.ray,
        down: !1,
        button: 0,
        startX: 0,
        startY: 0,
        dx: 0,
        dy: 0,
        vx: 0,
        vy: 0,
        downTime: 0,
        holdTime: 0,
        stillTime: 0,
        moved: !1,
        pointerType: "mouse",
        pressure: 0.5,
        shift: !1,
        alt: !1,
        ctrl: !1,
        time: 0,
      }),
      (this.active = null),
      (this.hover = null),
      (this.orbiting = null),
      (this.touches = new Map()),
      (this.pinch = null),
      (this._lastMoveT = 0),
      (this._hoverDirty = !0));
    const e = this.el;
    ((e.style.touchAction = "none"),
      e.addEventListener("pointerdown", (i) => this._down(i)),
      window.addEventListener("pointermove", (i) => this._move(i)),
      window.addEventListener("pointerup", (i) => this._up(i)),
      window.addEventListener("pointercancel", (i) => this._up(i, !0)),
      e.addEventListener("wheel", (i) => this._wheel(i), {
        passive: !1,
      }),
      e.addEventListener("contextmenu", (i) => i.preventDefault()),
      (this.inside = !1),
      e.addEventListener("pointerenter", () => {
        this.inside = !0;
      }),
      e.addEventListener("pointerleave", () => {
        ((this.inside = !1), this.pointer.down || this._setHover(null));
      }),
      window.addEventListener("keydown", (i) => this._key(i)));
  }
  addHandler(t) {
    return (
      t.priority ?? (t.priority = 0),
      t.tools ?? (t.tools = ["hand"]),
      this.handlers.push(t),
      this.handlers.sort((e, i) => i.priority - e.priority),
      () => {
        this.handlers = this.handlers.filter((e) => e !== t);
      }
    );
  }
  setEnabled(enabled) {
    if (this.enabled === enabled) return;
    if (!enabled) {
      this._cancelActive();
      this._setHover(null);
      for (const pointerId of this.touches.keys())
        if (this.el.hasPointerCapture?.(pointerId))
          this.el.releasePointerCapture(pointerId);
      this.touches.clear();
      this.pinch = null;
      this.orbiting = null;
      this.pointer.down = false;
    }
    this.enabled = enabled;
    this.invalidateHover();
    this._updateCursor();
  }
  setTool(t) {
    !TOOL_NAMES.includes(t) ||
      t === this.tool ||
      (this._cancelActive(),
      (this.tool = t),
      (this._hoverDirty = !0),
      this.ctx.events.emit("tool", {
        tool: t,
      }),
      this._updateCursor());
  }
  rayToPlaneY(t, e = new ThreeVector3()) {
    const i = this.pointer.ray;
    if (Math.abs(i.direction.y) < 1e-5) return null;
    const s = (t - i.origin.y) / i.direction.y;
    return s < 0 ? null : e.copy(i.origin).addScaledVector(i.direction, s);
  }
  rayToTerrain(t = new ThreeVector3()) {
    return this.ctx.terrain.raycast(this.pointer.ray, t);
  }
  rayToCameraPlane(t, e = new ThreeVector3()) {
    return (
      this.camera.getWorldDirection(inputCameraDirection),
      inputCameraPlane.setFromNormalAndCoplanarPoint(inputCameraDirection, t),
      this.pointer.ray.intersectPlane(inputCameraPlane, e)
    );
  }
  _updatePointer(t) {
    const e = this.el.getBoundingClientRect(),
      i = this.pointer,
      s = t.clientX - e.left,
      n = t.clientY - e.top;
    ((i.dx = s - i.x),
      (i.dy = n - i.y),
      (i.x = s),
      (i.y = n),
      i.ndc.set((s / e.width) * 2 - 1, -(n / e.height) * 2 + 1),
      (i.pointerType = t.pointerType || "mouse"),
      (i.pressure = t.pressure || (i.down ? 0.5 : 0)),
      (i.shift = t.shiftKey),
      (i.alt = t.altKey),
      (i.ctrl = t.ctrlKey || t.metaKey),
      this.camera.updateMatrixWorld(),
      this.raycaster.setFromCamera(i.ndc, this.camera));
  }
  _pick() {
    let t = null;
    for (const e of this.handlers) {
      if ((e.tools !== "*" && !e.tools.includes(this.tool)) || e.enabled === !1)
        continue;
      let i = null;
      try {
        i = e.hitTest ? e.hitTest(this.pointer) : null;
      } catch (s) {
        console.error(`[input] ${e.name}.hitTest`, s);
      }
      i &&
        (!t ||
          e.priority > t.handler.priority ||
          (e.priority === t.handler.priority &&
            (i.distance ?? 1e9) < (t.hit.distance ?? 1e9))) &&
        (t = {
          handler: e,
          hit: i,
        });
    }
    return t;
  }
  _setHover(t) {
    const e = this.hover;
    if (e && (!t || e.handler !== t.handler))
      try {
        e.handler.onHover?.(null, this.pointer);
      } catch (i) {
        console.error(i);
      }
    if (((this.hover = t), t))
      try {
        t.handler.onHover?.(t.hit, this.pointer);
      } catch (i) {
        console.error(i);
      }
    this._updateCursor();
  }
  _updateCursor() {
    let t = this.tool === "hand" ? "default" : "crosshair";
    (this.orbiting
      ? (t = "grabbing")
      : this.active
        ? (t =
            this.active.handler.activeCursor || this.active.handler.cursor || t)
        : this.hover && (t = this.hover.handler.cursor || t),
      this.el.style.cursor !== t && (this.el.style.cursor = t));
  }
  _down(t) {
    if (!this.enabled) return;
    if (
      (this.el.setPointerCapture?.(t.pointerId),
      this.touches.set(t.pointerId, {
        x: t.clientX,
        y: t.clientY,
      }),
      this.ctx.audio?.resume?.(),
      this.ctx.cameraRig.poke(),
      this.touches.size === 2)
    ) {
      this._cancelActive();
      const [s, n] = [...this.touches.values()];
      ((this.pinch = {
        dist: Math.hypot(s.x - n.x, s.y - n.y),
        cx: (s.x + n.x) / 2,
        cy: (s.y + n.y) / 2,
      }),
        (this.orbiting = null),
        (this.pointer.moved = !0));
      return;
    }
    if (this.touches.size > 2) return;
    this._updatePointer(t);
    const e = this.pointer;
    if (
      ((e.down = !0),
      (e.button = t.button),
      (e.startX = e.x),
      (e.startY = e.y),
      (e.downTime = performance.now() / 1e3),
      (e.holdTime = 0),
      (e.stillTime = 0),
      (e.moved = !1),
      (e.vx = e.vy = 0),
      (this._lastMoveT = performance.now()),
      t.button === 2 || t.button === 1)
    ) {
      ((this.orbiting = t.button === 2 && !t.shiftKey ? "orbit" : "pan"),
        this._updateCursor());
      return;
    }
    const i = this._pick();
    if (i) {
      let s = !1;
      try {
        s = i.handler.onDown?.(i.hit, e) !== !1;
      } catch (n) {
        console.error(`[input] ${i.handler.name}.onDown`, n);
      }
      if (s) {
        ((this.active = i), this._updateCursor());
        return;
      }
    }
    ((this.orbiting = "orbit"), this._updateCursor());
  }
  _move(t) {
    if (!this.enabled) return;
    if (
      (this.touches.has(t.pointerId) &&
        this.touches.set(t.pointerId, {
          x: t.clientX,
          y: t.clientY,
        }),
      this.pinch && this.touches.size >= 2)
    ) {
      const [o, a] = [...this.touches.values()],
        l = Math.hypot(o.x - a.x, o.y - a.y),
        c = (o.x + a.x) / 2,
        h = (o.y + a.y) / 2;
      (this.pinch.dist > 0 &&
        this.ctx.cameraRig.zoom(this.pinch.dist / Math.max(1, l)),
        this.ctx.cameraRig.rotate(c - this.pinch.cx, h - this.pinch.cy),
        (this.pinch = {
          dist: l,
          cx: c,
          cy: h,
        }));
      return;
    }
    if (this.touches.size > 0 && !this.touches.has(t.pointerId)) return;
    this._updatePointer(t);
    const e = this.pointer,
      i = performance.now(),
      s = Math.max(1, i - this._lastMoveT) / 1e3;
    this._lastMoveT = i;
    const n = Math.min(1, s * 18);
    if (
      ((e.vx += (e.dx / s - e.vx) * n),
      (e.vy += (e.dy / s - e.vy) * n),
      e.down &&
        Math.hypot(e.x - e.startX, e.y - e.startY) > 6 &&
        (e.moved = !0),
      Math.hypot(e.dx, e.dy) > 1.5 && (e.stillTime = 0),
      this.orbiting === "orbit")
    ) {
      this.ctx.cameraRig.rotate(e.dx, e.dy);
      return;
    }
    if (this.orbiting === "pan") {
      this.ctx.cameraRig.pan(e.dx, e.dy);
      return;
    }
    if (this.active) {
      try {
        this.active.handler.onMove?.(e, this.active.hit);
      } catch (o) {
        console.error(`[input] ${this.active.handler.name}.onMove`, o);
      }
      return;
    }
    e.pointerType === "mouse" && (this._hoverDirty = !0);
  }
  _up(t, e = !1) {
    if (!this.enabled) return;
    if ((this.touches.delete(t.pointerId), this.pinch)) {
      if (
        this.touches.size < 2 &&
        ((this.pinch = null), this.touches.size === 1)
      ) {
        const [s] = [...this.touches.values()],
          n = this.el.getBoundingClientRect();
        ((this.pointer.x = s.x - n.left),
          (this.pointer.y = s.y - n.top),
          (this.orbiting = "orbit"));
      }
      this.touches.size === 0 &&
        ((this.pointer.down = !1),
        (this.orbiting = null),
        this._updateCursor());
      return;
    }
    const i = this.pointer;
    if (i.down) {
      if ((this._updatePointer(t), (i.down = !1), this.active)) {
        try {
          (e && this.active.handler.onCancel?.(i, this.active.hit),
            this.active.handler.onUp?.(i, this.active.hit));
        } catch (s) {
          console.error(`[input] ${this.active.handler.name}.onUp`, s);
        }
        this.active = null;
      } else
        !i.moved &&
          !e &&
          t.button === 0 &&
          this.ctx.events.emit("tap", {
            ray: i.ray.clone(),
            pointer: {
              ...i,
              ndc: i.ndc.clone(),
            },
          });
      ((this.orbiting = null), (this._hoverDirty = !0), this._updateCursor());
    }
  }
  _cancelActive() {
    if (this.active) {
      try {
        (this.active.handler.onCancel?.(this.pointer, this.active.hit),
          this.active.handler.onUp?.(this.pointer, this.active.hit));
      } catch (t) {
        console.error(t);
      }
      this.active = null;
    }
  }
  _wheel(t) {
    if ((t.preventDefault(), !this.enabled)) return;
    this._updatePointer(t);
    const e = this.active || this._pick();
    if (e?.handler.onWheel) {
      let s = !1;
      try {
        s =
          e.handler.onWheel(
            e.hit,
            this.pointer,
            t.deltaY * (t.deltaMode === 1 ? 16 : 1),
          ) === !0;
      } catch (n) {
        console.error(n);
      }
      if (s) return;
    }
    const i = t.deltaY * (t.deltaMode === 1 ? 16 : 1);
    this.ctx.cameraRig.zoom(Math.exp(i * 0.0011));
  }
  _key(t) {
    if (!this.enabled) return;
    const e = t.target;
    if (
      (e &&
        (e.tagName === "INPUT" ||
          e.tagName === "TEXTAREA" ||
          e.tagName === "SELECT" ||
          e.isContentEditable)) ||
      t.ctrlKey ||
      t.metaKey ||
      t.altKey ||
      t.repeat
    )
      return;
    const i = t.key;
    (i >= "1" && i <= String(TOOL_NAMES.length)
      ? this.setTool(TOOL_NAMES[Number(i) - 1])
      : i === "h" || i === "H"
        ? this.setTool("hand")
        : i === "w" || i === "W"
          ? this.setTool("wind")
          : i === "c" || i === "C"
            ? this.setTool("cloud")
            : (i === "f" || i === "F") && this.setTool("fog"),
      this.ctx.events.emit("key", {
        key: i,
        event: t,
      }));
  }
  update(t) {
    if (!this.enabled) return;
    const e = this.pointer;
    if (
      ((e.time += t),
      e.down &&
        ((e.holdTime += t),
        (e.stillTime += t),
        (e.vx *= Math.exp(-t * 8)),
        (e.vy *= Math.exp(-t * 8))),
      this.active)
    )
      try {
        this.active.handler.onFrame?.(e, t, this.active.hit);
      } catch (i) {
        console.error(`[input] ${this.active.handler.name}.onFrame`, i);
      }
    else
      !e.down &&
        e.pointerType === "mouse" &&
        this.inside &&
        (this._hoverDirty ||
          (this._hoverTimer = (this._hoverTimer || 0) + t) > 0.15) &&
        ((this._hoverTimer = 0),
        (this._hoverDirty = !1),
        this.camera.updateMatrixWorld(),
        this.raycaster.setFromCamera(e.ndc, this.camera),
        this._setHover(this._pick()));
  }
  invalidateHover() {
    this._hoverDirty = !0;
  }
}
export { InputController };
