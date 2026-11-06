import { ThreeQuaternion, ThreeVector3 } from "../vendor/three-runtime.js";
import { createHudElement, parseHudMarkup } from "./dom.js";
import { HUD_ICONS } from "./icons.js";

const CAMERA_INSPECTOR_INTERVAL = 100;
const CAMERA_INSPECTOR_MODE_LABELS = {
  orbit: "自由观察",
  follow: "跟随旅人",
  exploration: "步行探索",
  photo: "拍照模式",
};

function roundCameraNumber(value) {
  const rounded = Number(value.toFixed(8));
  return Object.is(rounded, -0) ? 0 : rounded;
}

class CameraInspector {
  constructor(ctx) {
    this.ctx = ctx;
    this.visible = undefined;
    this._lastUpdate = -Infinity;
    this._position = new ThreeVector3();
    this._direction = new ThreeVector3();
    this._target = new ThreeVector3();
    this._quaternion = new ThreeQuaternion();
    this._copying = false;
    this._disposed = false;
    this.el = createHudElement("aside", {
      id: "wg-camera-inspector",
      class: "wg-panel wg-camera-inspector",
      "aria-labelledby": "wg-camera-inspector-title",
      hidden: true,
    });
    const close = createHudElement(
      "button",
      {
        class: "wg-camera-inspector-close",
        type: "button",
        "aria-label": "关闭镜头测试",
        title: "关闭镜头测试（F2）",
      },
      [parseHudMarkup(HUD_ICONS.close)],
    );
    close.addEventListener("click", () => this.setVisible(false));
    this.el.append(
      createHudElement("header", { class: "wg-camera-inspector-header" }, [
        createHudElement("h2", {
          id: "wg-camera-inspector-title",
          text: "镜头测试",
        }),
        createHudElement("kbd", { text: "F2" }),
        close,
      ]),
    );
    this.positionValues = this._vectorReadout("position", "位置");
    this.directionValues = this._vectorReadout("direction", "视线方向");
    this.modeValue = createHudElement("span", {
      "data-camera-value": "mode",
    });
    this.fovValue = createHudElement("span", { "data-camera-value": "fov" });
    this.el.append(
      createHudElement("div", { class: "wg-camera-inspector-meta" }, [
        this.modeValue,
        this.fovValue,
      ]),
    );
    this.copyButton = createHudElement("button", {
      class: "wg-camera-inspector-copy",
      type: "button",
      "data-action": "copy-camera",
      text: "复制镜头参数",
    });
    this.copyButton.addEventListener("click", () => this.copy());
    this.status = createHudElement("p", {
      class: "wg-camera-inspector-status",
      role: "status",
      "aria-live": "polite",
      hidden: true,
    });
    this.fallback = createHudElement("textarea", {
      id: "wg-camera-copy-fallback",
      class: "wg-camera-inspector-fallback",
      "aria-label": "镜头参数，已选中后可手动复制",
      readonly: true,
      spellcheck: "false",
      rows: 5,
      hidden: true,
    });
    this.hint = createHudElement("p", {
      class: "wg-camera-inspector-hint",
      text: "F2 显示 / 隐藏",
    });
    this.el.append(this.copyButton, this.status, this.fallback, this.hint);
    for (const name of [
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
      "wheel",
      "click",
      "dblclick",
      "touchstart",
      "touchmove",
    ])
      this.el.addEventListener(name, (event) => event.stopPropagation(), {
        passive: true,
      });
    this.el.addEventListener("contextmenu", (event) => {
      event.stopPropagation();
      // Keep the native copy menu available in the fallback text field.
      if (event.target !== this.fallback) event.preventDefault();
    });
    this._keyHandler = (event) => {
      if (
        event.code !== "F2" ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey ||
        event.repeat ||
        event.isComposing
      )
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.setVisible(!this.visible);
    };
    window.addEventListener("keydown", this._keyHandler, true);
    document.body.append(this.el);
    this.setVisible(ctx.params.get("debug") === "camera");
  }

  _vectorReadout(name, label) {
    const values = [];
    const group = createHudElement("div", {
      class: "wg-camera-inspector-vector",
      "data-camera-value": name,
      "aria-label": label + "坐标",
    });
    for (const axis of ["X", "Y", "Z"]) {
      const value = createHudElement("output", {
        "data-axis": axis,
        "aria-live": "off",
      });
      values.push(value);
      group.append(
        createHudElement("span", {}, [
          createHudElement("small", { text: axis }),
          value,
        ]),
      );
    }
    this.el.append(
      createHudElement("p", {
        class: "wg-camera-inspector-label",
        text: label,
      }),
      group,
    );
    return values;
  }

  snapshot() {
    const { camera, cameraRig, exploration, photo } = this.ctx;
    camera.getWorldPosition(this._position);
    camera.getWorldDirection(this._direction);
    camera.getWorldQuaternion(this._quaternion);
    // A point one world unit along the actual view ray reproduces this view
    // without borrowing an orbit target that is stale in exploration/photo.
    this._target.copy(this._position).add(this._direction);
    const mode = photo?.active
      ? "photo"
      : exploration?.active
        ? "exploration"
        : cameraRig.following
          ? "follow"
          : "orbit";
    const preset =
      mode === "exploration" || (mode === "photo" && !photo._presetCamera)
        ? null
        : cameraRig.activePreset || null;
    const canvas = this.ctx.renderer.domElement;
    const viewport = canvas.getBoundingClientRect();
    return {
      position: this._position.toArray().map(roundCameraNumber),
      target: this._target.toArray().map(roundCameraNumber),
      direction: this._direction.toArray().map(roundCameraNumber),
      quaternion: this._quaternion.toArray().map(roundCameraNumber),
      fov: roundCameraNumber(camera.fov),
      zoom: roundCameraNumber(camera.zoom),
      aspect: roundCameraNumber(camera.aspect),
      viewport: {
        width: roundCameraNumber(viewport.width),
        height: roundCameraNumber(viewport.height),
      },
      mode,
      preset,
    };
  }

  setVisible(visible) {
    if (this._disposed) return;
    const changed = this.visible !== !!visible;
    this.visible = !!visible;
    this.el.hidden = !this.visible;
    if (!this.visible) {
      if (this.el.contains(document.activeElement))
        document.activeElement.blur();
      this.fallback.hidden = true;
      this.status.hidden = true;
    }
    this._lastUpdate = -Infinity;
    this.update(performance.now());
    if (changed)
      this.ctx.events.emit("camera-inspector:change", {
        visible: this.visible,
      });
  }

  update(nowMs = performance.now()) {
    if (this._disposed) return;
    const pointerLocked = !!document.pointerLockElement;
    this.el.inert =
      !this.visible ||
      pointerLocked ||
      document.body.classList.contains("no-ui");
    if (!this.visible || nowMs - this._lastUpdate < CAMERA_INSPECTOR_INTERVAL)
      return;
    this._lastUpdate = nowMs;
    const snapshot = this.snapshot();
    for (let axis = 0; axis < 3; axis++) {
      this.positionValues[axis].textContent =
        snapshot.position[axis].toFixed(6);
      this.directionValues[axis].textContent =
        snapshot.direction[axis].toFixed(6);
    }
    this.modeValue.textContent = CAMERA_INSPECTOR_MODE_LABELS[snapshot.mode];
    this.fovValue.textContent = `FOV ${snapshot.fov.toFixed(2)}°`;
    this.hint.textContent = pointerLocked
      ? "右键释放鼠标后可复制 · F2 隐藏"
      : "F2 显示 / 隐藏";
  }

  async copy() {
    if (this._copying || !this.visible || this.el.inert) return;
    // This text belongs to the click, not the later clipboard resolution or
    // the next live readout update. The manual fallback must stay unchanged.
    const text = JSON.stringify(this.snapshot(), null, 2);
    this._copying = true;
    this.copyButton.disabled = true;
    this.copyButton.setAttribute("aria-busy", "true");
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      if (this._disposed) return;
      this.fallback.hidden = true;
      this.status.textContent = "已复制，可直接粘贴发送。";
      this.status.hidden = false;
    } catch {
      if (this._disposed) return;
      this.fallback.value = text;
      this.fallback.hidden = false;
      this.status.textContent = "请在下方复制参数（Ctrl+C / ⌘C）。";
      this.status.hidden = false;
      if (this.visible && !this.el.inert) {
        this.fallback.focus({ preventScroll: true });
        this.fallback.select();
      }
    } finally {
      this._copying = false;
      this.copyButton.disabled = false;
      this.copyButton.setAttribute("aria-busy", "false");
    }
  }

  dispose() {
    this._disposed = true;
    window.removeEventListener("keydown", this._keyHandler, true);
    this.el.remove();
  }
}

export { CameraInspector };
