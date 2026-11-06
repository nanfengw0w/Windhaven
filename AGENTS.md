# Repository Guidelines

## Project Structure & Module Organization

Windhaven is a procedural Three.js landscape built with Vite. `index.html` loads `styles/app.css` and `src/main.js`, which imports modules in dependency order before `src/bootstrap.js` starts the scene. Put shared layout data in `src/layout/`, world state and navigation in `src/simulation/`, and rendering utilities in `src/render/`. Keep feature code with its subsystem, such as `src/water/`, `src/vegetation/`, or `src/hud/`. Runtime models and textures live in `assets/`, and `tooling/` contains the static checks. See `docs/ARCHITECTURE.md` for the full module map.

## Build, Test, and Development Commands

Use Node.js 22.12 or newer and install locked dependencies with `npm ci`.

- `npm run dev` starts Vite at `http://127.0.0.1:4190`.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves that bundle at `http://127.0.0.1:4191`.
- `npm test` checks module completeness, named imports and exports, dependency cycles, and syntax tree equivalence against the tracked baseline.

## Coding Style & Naming Conventions

Use JavaScript ES modules with two-space indentation, double quotes, and semicolons. Use kebab-case filenames (`water-system.js`), camelCase functions and variables, and PascalCase classes. In `src/`, import bindings by name from relative `.js` paths and export them in a list (`export { WaterSystem };`) so the static checker can resolve them. Keep `src/main.js` and `reports/module-order.json` in sync when adding or moving modules. Format changed files with Prettier (`npx prettier --write src/water/water-system.js`).

## Testing Guidelines

There is no unit test suite or coverage threshold. Smoke-test affected interactions, weather, and quality settings in a browser; check the console for runtime and shader errors. For terrain changes, use `?inspection=terrain` on the dev server. After reviewing intentional source changes that alter the baseline, run `npm run baseline:update`, then `npm test` and `npm run build`. Commit the regenerated files in `reference/` with the source changes.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects, following `Initialize Windhaven`. In pull requests, explain what changed and why, report the checks and browser scenarios you ran, link the related issue if available, and include screenshots or a clip for visible changes.
