// Measured on the supplied meshes after Y-up, +Z doorway orientation.
// Door heights use the same human scale as the original cabin; roofs retain
// their native proportions. Source measurements are recorded in the manifest.
const IMPORTED_DOOR_HEIGHT = 0.21;
const BUILDING_MODEL_LAYOUTS = Object.freeze({
  cottage: Object.freeze({ sourceDoorHeight: 1.9 }),
  station: Object.freeze({ sourceDoorHeight: 2.35 }),
  clocktower: Object.freeze({ sourceDoorHeight: 2 }),
  "house-long": Object.freeze({
    sourceDoorHeight: 0.04235,
    sourceDoor: Object.freeze([-0.08824, 0.01048, 0.04257]),
    sourceSupport: Object.freeze([0.2914, 0.16]),
    sourceWalls: Object.freeze([0.28, 0.145]),
  }),
  "house-inn": Object.freeze({
    sourceDoorHeight: 0.06578,
    sourceDoor: Object.freeze([0.00564, 0.0173, -0.00988]),
    sourceSupport: Object.freeze([0.42, 0.3231]),
    sourceWalls: Object.freeze([0.405, 0.3]),
  }),
  "house-tall": Object.freeze({
    sourceDoorHeight: 0.07219,
    sourceDoor: Object.freeze([-0.04139, 0.02671, 0.08814]),
    sourceSupport: Object.freeze([0.2178, 0.2786]),
    sourceWalls: Object.freeze([0.2, 0.23]),
  }),
});

function buildingModelLayout(id) {
  const source = BUILDING_MODEL_LAYOUTS[id];
  if (!source) throw new Error(`Unknown building model: ${id}`);
  const scale = IMPORTED_DOOR_HEIGHT / source.sourceDoorHeight;
  return {
    ...source,
    scale,
    supportWidth: source.sourceSupport?.[0] * scale || 0,
    supportDepth: source.sourceSupport?.[1] * scale || 0,
    wallWidth: source.sourceWalls?.[0] * scale || 0,
    wallDepth: source.sourceWalls?.[1] * scale || 0,
    doorAcross: (source.sourceDoor?.[0] ?? 0) * scale,
    doorRise: (source.sourceDoor?.[1] ?? 0) * scale,
    doorAlong: source.sourceDoor ? source.sourceDoor[2] * scale : undefined,
  };
}

export { BUILDING_MODEL_LAYOUTS, IMPORTED_DOOR_HEIGHT, buildingModelLayout };
