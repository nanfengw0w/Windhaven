// Scene-wide tree references. Rendering batches retain their own arrays and
// indices; ecological consumers share this snapshot without copying plants.
class TreeRegistry {
  constructor() {
    this.entries = Object.freeze([]);
    this.revision = 0;
    this._sources = new Map();
  }
  register(
    owner,
    plants,
    { name = "vegetation", leafEffect = "standard" } = {},
  ) {
    if (!owner || typeof owner.shake !== "function")
      throw new TypeError("A tree source must provide a shake controller");
    if (!Array.isArray(plants))
      throw new TypeError("A tree source must provide a plant array");
    if (leafEffect !== "standard" && leafEffect !== "dedicated")
      throw new TypeError(`Unknown tree leaf effect: ${leafEffect}`);
    const source = { owner, plants, name, leafEffect };
    this._sources.set(owner, source);
    this._refresh();
    return () => {
      // A stale disposer must not remove a newer registration of this owner.
      if (this._sources.get(owner) !== source) return;
      this._sources.delete(owner);
      this._refresh();
    };
  }
  _refresh() {
    const entries = [];
    for (const source of this._sources.values()) {
      source.plants.forEach((plant, index) => {
        entries.push(
          Object.freeze({
            plant,
            owner: source.owner,
            source: source.name,
            index,
            leafEffect: source.leafEffect,
          }),
        );
      });
    }
    this.entries = Object.freeze(entries);
    this.revision++;
  }
  shake(x, z, radius = 1, strength = 1) {
    for (const owner of this._sources.keys())
      owner.shake(x, z, radius, strength);
  }
}

function getTreeRegistry(ctx) {
  return (ctx.trees ??= new TreeRegistry());
}

export { TreeRegistry, getTreeRegistry };
