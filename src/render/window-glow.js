import { ThreeColor, ThreeSRGBColorSpace } from "../vendor/three-runtime.js";

const WINDOW_GLOW_INTENSITY = 2.1;

function bindWindowGlow(material, texture, scale = 1) {
  texture.colorSpace = ThreeSRGBColorSpace;
  texture.flipY = false;
  texture.needsUpdate = true;
  material.emissiveMap = texture;
  material.emissive = new ThreeColor(0xffffff);
  material.emissiveIntensity = 0;
  material.userData.windowGlow = true;
  material.userData.windowGlowScale = scale;
}

function updateWindowGlow(material, night) {
  material.emissiveIntensity =
    WINDOW_GLOW_INTENSITY * night * (material.userData.windowGlowScale ?? 1);
}

export { bindWindowGlow, updateWindowGlow };
