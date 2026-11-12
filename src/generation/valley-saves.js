const STORAGE_PREFIX = "windhaven.valley-saves.v1";
const CURRENT_KEY = `${STORAGE_PREFIX}.current`;
const SAVE_PREFIX = `${STORAGE_PREFIX}.save.`;
const SAVE_NAME_LIMIT = 60;
const ROLES = new Set(["guardian", "lantern", "wind", "shrine"]);

function browserStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function isModelUrl(url) {
  if (
    typeof url !== "string" ||
    !/^\/(api\/assets|generated\/examples)\/[^?#]+\.glb$/i.test(url)
  ) {
    return false;
  }
  try {
    return url
      .split("/")
      .slice(3)
      .every((part) => {
        const segment = decodeURIComponent(part);
        return (
          segment &&
          segment !== "." &&
          segment !== ".." &&
          !/[/\\\x00-\x1f\x7f]/.test(segment)
        );
      });
  } catch {
    return false;
  }
}

function copyPlacements(placements) {
  if (!Array.isArray(placements)) throw new Error("山谷布局无效。");
  return placements.map((value) => {
    const placement = value ?? {};
    const { url, x, y, z, yaw, role, height } = placement;
    const pitch = Object.hasOwn(placement, "pitch") ? placement.pitch : 0;
    const roll = Object.hasOwn(placement, "roll") ? placement.roll : 0;
    const windYawOffset = Object.hasOwn(placement, "windYawOffset")
      ? placement.windYawOffset
      : 0;
    if (
      !isModelUrl(url) ||
      ![x, y, z, yaw, pitch, roll, windYawOffset, height].every(
        Number.isFinite,
      ) ||
      height <= 0 ||
      !ROLES.has(role)
    ) {
      throw new Error("山谷布局包含无效的模型位置。");
    }
    return { url, x, y, z, yaw, pitch, roll, windYawOffset, role, height };
  });
}

function saveKey(id) {
  if (typeof id !== "string" || !/^[a-z\d-]+$/i.test(id)) {
    throw new Error("山谷存档编号无效。");
  }
  return `${SAVE_PREFIX}${id}`;
}

function saveName(name) {
  const trimmed = typeof name === "string" ? name.trim() : "";
  if (!trimmed || trimmed.length > SAVE_NAME_LIMIT) {
    throw new Error(`请输入 1–${SAVE_NAME_LIMIT} 个字符的存档名称。`);
  }
  return trimmed;
}

class ValleySaves {
  constructor(storage = browserStorage()) {
    this.storage = storage;
  }

  load() {
    const storage = this._requireStorage();
    const current = JSON.parse(storage.getItem(CURRENT_KEY)) ?? [];
    const saves = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key?.startsWith(SAVE_PREFIX)) continue;
      const save = JSON.parse(storage.getItem(key));
      if (!save) continue;
      const { id, name, placements, updatedAt } = save;
      if (saveKey(id) !== key || !Number.isFinite(updatedAt)) {
        throw new Error("山谷存档记录无效。");
      }
      saves.push({
        id,
        name: saveName(name),
        placements: copyPlacements(placements),
        updatedAt,
      });
    }
    saves.sort((a, b) => b.updatedAt - a.updatedAt || a.id.localeCompare(b.id));
    return { current: copyPlacements(current), saves };
  }

  setCurrent(placements) {
    const current = copyPlacements(placements);
    this._requireStorage().setItem(CURRENT_KEY, JSON.stringify(current));
    return current;
  }

  save(name, placements, id) {
    const storage = this._requireStorage();
    const saveId =
      id ?? globalThis.crypto.getRandomValues(new Uint32Array(4)).join("-");
    const key = saveKey(saveId);
    if (id != null && storage.getItem(key) === null) {
      throw new Error("找不到这个山谷存档。");
    }
    const save = {
      id: saveId,
      name: saveName(name),
      placements: copyPlacements(placements),
      updatedAt: Date.now(),
    };
    storage.setItem(key, JSON.stringify(save));
    return save;
  }

  remove(id) {
    const storage = this._requireStorage();
    const key = saveKey(id);
    if (storage.getItem(key) === null) return false;
    storage.removeItem(key);
    return true;
  }

  _requireStorage() {
    if (!this.storage) throw new Error("浏览器无法保存山谷存档。");
    return this.storage;
  }
}

export { ValleySaves };
