// Static regression gate. Parses (never executes) the application and checks:
//   1. every module in reports/module-order.json exists, every import resolves
//      to a listed module that actually exports the imported names;
//   2. the module import graph is acyclic;
//   3. the concatenation of all top-level statements is AST-identical to the
//      frozen baseline snapshot reference/bundle.baseline.js.
// The baseline is regenerated with `npm run baseline:update` after intentional
// changes. A failure here without a baseline refresh means accidental drift —
// investigate before re-freezing. This is not a runtime or visual test.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { parse } from "@babel/parser";
import {
  BASELINE_PATH,
  META_PATH,
  baselineStatements,
  clean,
  collectStatements,
  loadModuleOrder,
} from "./build-baseline.mjs";

const root = path.resolve(import.meta.dirname, "..");

// Import/export completeness: every import must target a listed module that
// exports the requested binding. Side-effect-only imports contribute nothing.
function checkCompleteness(order, modules) {
  let imports = 0;
  let exports = 0;
  const edges = new Map(order.map((f) => [f, []]));
  for (const [file, { ast, bindings }] of modules) {
    exports += bindings.size;
    for (const n of ast.program.body) {
      if (n.type !== "ImportDeclaration") continue;
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), n.source.value));
      assert(modules.has(target), file + " missing module " + target);
      edges.get(file).push(target);
      for (const s of n.specifiers) {
        assert(modules.get(target).bindings.has(s.imported.name), file + " missing export " + s.imported.name);
        imports++;
      }
    }
  }
  return { imports, exports, edges };
}

// Depth-first cycle detection over the module import graph.
function findCycle(edges) {
  const state = new Map(); // unvisited | open | closed
  const stack = [];
  function visit(node) {
    if (state.get(node) === "open") {
      return stack.slice(stack.indexOf(node));
    }
    if (state.get(node) === "closed") return null;
    state.set(node, "open");
    stack.push(node);
    for (const next of edges.get(node) || []) {
      const cycle = visit(next);
      if (cycle) return cycle;
    }
    stack.pop();
    state.set(node, "closed");
    return null;
  }
  for (const node of edges.keys()) {
    const cycle = visit(node);
    if (cycle) return cycle;
  }
  return null;
}

const order = loadModuleOrder();
const modules = new Map();
for (const file of order) {
  const source = fs.readFileSync(path.join(root, "src", file), "utf8");
  const ast = parse(source, { sourceType: "module" });
  const bindings = new Set();
  for (const n of ast.program.body) {
    if (n.type === "ExportNamedDeclaration") {
      for (const e of n.specifiers) bindings.add(e.exported.name);
    }
  }
  modules.set(file, { ast, bindings });
}

const { imports, exports, edges } = checkCompleteness(order, modules);
const cycle = findCycle(edges);
if (cycle) throw Error("module import cycle: " + cycle.join(" -> "));

const perModule = collectStatements(order);
const reconstructed = perModule.flatMap((m) => m.statements).map(clean);

// Baseline integrity: meta file must match the snapshot on disk, so a
// hand-edited baseline cannot silently become the reference.
const meta = JSON.parse(fs.readFileSync(path.join(root, META_PATH), "utf8"));
const baselineSource = fs.readFileSync(path.join(root, BASELINE_PATH), "utf8");
const sha256 = crypto.createHash("sha256").update(baselineSource).digest("hex");
assert.equal(sha256, meta.sha256, "baseline file does not match reference/baseline-meta.json (hand-edited? re-run npm run baseline:update)");
assert.equal(meta.moduleCount, order.length, "baseline module count out of date; re-run npm run baseline:update");

const baseline = baselineStatements(baselineSource).map(clean);
assert.equal(baseline.length, reconstructed.length, "statement count");
let matched = 0;
for (let i = 0; i < baseline.length; i++) {
  try {
    assert.deepEqual(reconstructed[i], baseline[i]);
    matched++;
  } catch {
    console.error("Mismatch at statement", i, baseline[i].type);
    fs.writeFileSync(
      path.join(root, "reports/ast-mismatch.json"),
      JSON.stringify({ index: i, expected: baseline[i], actual: reconstructed[i] }, null, 2),
    );
    throw Error("AST mismatch; see reports/ast-mismatch.json");
  }
}

const report = {
  status: "passed",
  modules: modules.size,
  statementsMatched: matched,
  importBindings: imports,
  exportBindings: exports,
  cycles: 0,
  baseline: BASELINE_PATH,
  baselineSha256: sha256,
  scope:
    "AST equivalence of src/ top-level statements against the frozen baseline snapshot (reference/bundle.baseline.js), plus import/export completeness and acyclicity. Re-freeze the baseline with `npm run baseline:update` after intentional changes. No application code executed; not a runtime or visual test.",
};
fs.writeFileSync(path.join(root, "reports/static-verification.json"), JSON.stringify(report, null, 2) + "\n");
console.log(report);
