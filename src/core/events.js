// Reconstructed module: identifiers and file boundaries are refactor choices.
class EventBus {
  constructor() {
    this.map = new Map();
  }
  on(t, e) {
    return (
      this.map.has(t) || this.map.set(t, new Set()),
      this.map.get(t).add(e),
      () => this.off(t, e)
    );
  }
  off(t, e) {
    this.map.get(t)?.delete(e);
  }
  emit(t, e) {
    const i = this.map.get(t);
    if (i)
      for (const s of i)
        try {
          s(e);
        } catch (n) {
          console.error(`[events] ${t} handler failed`, n);
        }
  }
}
export { EventBus };
