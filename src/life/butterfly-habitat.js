import { LANDSCAPE_BOUNDS } from "../core/config.js";
import { createSeededRandom } from "../core/math.js";
import { farmObjectClearance } from "../layout/farm-layout.js";
import { hikingObjectClearance } from "../layout/hiking-layout.js";
import { ruinObjectClearance } from "../layout/mountain-ruins-layout.js";
import { landmarkPlantClearance } from "../layout/world-layout.js";
import { woodlandYardObjectClearance } from "../layout/woodworking-layout.js";
import { CABIN_PLACEMENT, waterDistance } from "../simulation/terrain-shape.js";

const BUTTERFLY_FLIGHT_MARGIN = 0.2;
const BUTTERFLY_MAX_GROUND_HEIGHT = 2.2;
const habitatCache = new WeakMap();

function createButterflyHabitat(ctx) {
  if (habitatCache.has(ctx)) return habitatCache.get(ctx);
  const random = createSeededRandom(391729);
  const modules = ctx.modules ?? {};
  const rocks = [
    ...(modules.terrain?.rocks ?? []),
    ...(modules.landscapeVegetation?.rocks ?? []),
  ];
  const step = 0.16;
  const columns = Math.ceil((LANDSCAPE_BOUNDS.halfW * 2) / step);
  const rows = Math.ceil((LANDSCAPE_BOUNDS.halfD * 2) / step);
  const grid = new Uint8Array(columns * rows);
  const flowerHeights = new Float32Array(columns * rows);
  const margin = BUTTERFLY_FLIGHT_MARGIN + step / Math.SQRT2;
  const terrain = ctx.terrain;
  function suitable(x, z) {
    if (
      !terrain?.height ||
      Math.abs(x) > LANDSCAPE_BOUNDS.halfW - margin ||
      Math.abs(z) > LANDSCAPE_BOUNDS.halfD - margin ||
      waterDistance(x, z) < margin + 0.05 ||
      landmarkPlantClearance(x, z) < margin ||
      farmObjectClearance(x, z) < margin ||
      hikingObjectClearance(x, z) < margin ||
      ruinObjectClearance(x, z) < margin ||
      woodlandYardObjectClearance(x, z) < margin ||
      Math.hypot(x - CABIN_PLACEMENT.x, z - CABIN_PLACEMENT.z) < 1.25 + margin
    )
      return false;
    for (const rock of rocks) {
      const radius = rock.r ?? rock.radius ?? 0;
      if (Math.hypot(x - rock.x, z - rock.z) < radius * 1.15 + margin)
        return false;
    }
    for (const [dx, dz] of [
      [0, 0],
      [-margin, 0],
      [margin, 0],
      [0, -margin],
      [0, margin],
    ]) {
      const height = terrain.height(x + dx, z + dz);
      const slope = terrain.slope?.(x + dx, z + dz) ?? 0;
      if (
        !Number.isFinite(height) ||
        height > BUTTERFLY_MAX_GROUND_HEIGHT ||
        slope > 0.24
      )
        return false;
    }
    return true;
  }
  // 启动时预计算障碍，飞行更新只查网格，避免逐帧遍历建筑与岩石。
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = -LANDSCAPE_BOUNDS.halfW + (column + 0.5) * step;
      const z = -LANDSCAPE_BOUNDS.halfD + (row + 0.5) * step;
      grid[row * columns + column] = suitable(x, z) ? 1 : 0;
    }
  }
  function isClear(x, z) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) return false;
    const column = Math.floor((x + LANDSCAPE_BOUNDS.halfW) / step);
    const row = Math.floor((z + LANDSCAPE_BOUNDS.halfD) / step);
    return (
      column >= 0 &&
      column < columns &&
      row >= 0 &&
      row < rows &&
      grid[row * columns + column] === 1
    );
  }
  function flowerHeightAt(x, z) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) return 0;
    const column = Math.floor((x + LANDSCAPE_BOUNDS.halfW) / step);
    const row = Math.floor((z + LANDSCAPE_BOUNDS.halfD) / step);
    if (column < 0 || column >= columns || row < 0 || row >= rows) return 0;
    return flowerHeights[row * columns + column];
  }
  function recordFlowerHeight(x, z, top) {
    // 花冠覆盖附近约 0.3 米，另加半格对角线以覆盖网格边缘。
    const radius = 0.3 + step / Math.SQRT2;
    const firstColumn = Math.max(
      0,
      Math.floor((x - radius + LANDSCAPE_BOUNDS.halfW) / step),
    );
    const lastColumn = Math.min(
      columns - 1,
      Math.floor((x + radius + LANDSCAPE_BOUNDS.halfW) / step),
    );
    const firstRow = Math.max(
      0,
      Math.floor((z - radius + LANDSCAPE_BOUNDS.halfD) / step),
    );
    const lastRow = Math.min(
      rows - 1,
      Math.floor((z + radius + LANDSCAPE_BOUNDS.halfD) / step),
    );
    for (let row = firstRow; row <= lastRow; row++) {
      for (let column = firstColumn; column <= lastColumn; column++) {
        const px = -LANDSCAPE_BOUNDS.halfW + (column + 0.5) * step;
        const pz = -LANDSCAPE_BOUNDS.halfD + (row + 0.5) * step;
        if ((px - x) ** 2 + (pz - z) ** 2 > radius ** 2) continue;
        const ground = terrain?.height?.(px, pz);
        if (!Number.isFinite(ground)) continue;
        const offset = row * columns + column;
        flowerHeights[offset] = Math.max(flowerHeights[offset], top - ground);
      }
    }
  }
  const byCell = new Map();
  let flowerCount = 0;
  for (const [mesh, type] of [
    [modules.vegetation?.flowers, "flower"],
    [modules.landscapeVegetation?.flowers, "flower"],
    [modules.landscapeVegetation?.sunflowers, "sunflower"],
  ]) {
    const root =
      mesh?.geometry?.getAttribute?.("aRoot") ??
      mesh?.geometry?.attributes?.aRoot;
    const shape =
      mesh?.geometry?.getAttribute?.("aShape") ??
      mesh?.geometry?.attributes?.aShape;
    if (!root?.array) continue;
    const stride = root.itemSize ?? 4;
    const count = Math.min(
      root.count ?? root.array.length / stride,
      mesh.geometry.instanceCount ?? Infinity,
    );
    for (let index = 0; index < count; index++) {
      const x = root.array[index * stride];
      const z = root.array[index * stride + 2];
      const rootY = root.array[index * stride + 1];
      const height = shape?.array?.[index * (shape.itemSize ?? 4)] ?? 0.12;
      if (
        !Number.isFinite(x) ||
        !Number.isFinite(z) ||
        !Number.isFinite(rootY) ||
        !Number.isFinite(height)
      )
        continue;
      recordFlowerHeight(x, z, rootY + height);
      if (!isClear(x, z)) continue;
      const column = Math.floor((x + LANDSCAPE_BOUNDS.halfW) / 1.2);
      const row = Math.floor((z + LANDSCAPE_BOUNDS.halfD) / 1.2);
      const key = `${column}:${row}`;
      if (!byCell.has(key)) byCell.set(key, { x, z, spots: [] });
      byCell
        .get(key)
        .spots.push({ x, z, y: rootY + height, height, rootY, type });
      flowerCount++;
    }
  }
  function shuffle(values) {
    for (let index = values.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [values[index], values[other]] = [values[other], values[index]];
    }
  }
  const cells = [...byCell.values()];
  shuffle(cells);
  for (const cell of cells) shuffle(cell.spots);
  // 每块花地轮流取点，防止高密度向日葵带占用全部蝴蝶名额。
  const spots = [];
  const largest = cells.reduce(
    (size, cell) => Math.max(size, cell.spots.length),
    0,
  );
  for (let index = 0; index < largest; index++)
    for (const cell of cells)
      if (index < cell.spots.length) spots.push(cell.spots[index]);
  const habitat = {
    spots,
    cells,
    isClear,
    flowerHeightAt,
    stats: { flowers: flowerCount, cells: cells.length },
  };
  habitatCache.set(ctx, habitat);
  return habitat;
}

function butterflyHabitatClearance(ctx, x, z) {
  return createButterflyHabitat(ctx).isClear(x, z);
}

export {
  BUTTERFLY_FLIGHT_MARGIN,
  BUTTERFLY_MAX_GROUND_HEIGHT,
  createButterflyHabitat,
  butterflyHabitatClearance,
};
