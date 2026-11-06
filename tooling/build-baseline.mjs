// Regenerate the frozen regression baseline from the current src/.
//
// The baseline (reference/bundle.baseline.js) is a comment-free concatenation of
// every module's top-level statements, in reports/module-order.json order, with
// import/export bookkeeping removed. tooling/verify-static.mjs compares src/
// against this snapshot, so intentional changes must be re-frozen with
// `npm run baseline:update` and committed together with the code change.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { parse } from "@babel/parser";
import generateImport from "@babel/generator";
import * as t from "@babel/types";
const generate = generateImport.default ?? generateImport;

const root = path.resolve(import.meta.dirname, "..");
export const BASELINE_PATH = "reference/bundle.baseline.js";
export const META_PATH = "reference/baseline-meta.json";

// Top-level statements that participate in the baseline comparison. Imports and
// bare `export {}` lists are bookkeeping (completeness is checked separately);
// an inline `export const x` would unwrap to its declaration. Current src only
// uses the separated `const` + `export {}` style; the unwrap stays as a guard.
function comparableStatements(programBody, file) {
  const statements = [];
  for (const node of programBody) {
    if (node.type === "ImportDeclaration") continue;
    if (node.type === "ExportNamedDeclaration") {
      if (node.declaration) statements.push(node.declaration);
      continue;
    }
    if (node.type === "ExportDefaultDeclaration" || node.type === "ExportAllDeclaration") {
      throw Error(`${file}: unsupported export style ${node.type}`);
    }
    statements.push(node);
  }
  return statements;
}

// Strip location, comments and literal `extra` data so that deepStrictEqual
// compares code structure only. (Same normalization the original checker used.)
export function clean(node) {
  if (node === null || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map((x) => clean(x));
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (
      [
        "start",
        "end",
        "loc",
        "extra",
        "leadingComments",
        "trailingComments",
        "innerComments",
        "comments",
        "tokens",
      ].includes(k)
    ) {
      continue;
    }
    if (k === "shorthand") {
      out[k] = false;
      continue;
    }
    out[k] = clean(v);
  }
  return out;
}

function parseSource(source) {
  return parse(source, { sourceType: "module", errorRecovery: false });
}

// The module list is the comparison contract: every src file except main.js
// must be listed, and every listed file must exist. A new module therefore has
// to be registered here or the checks below will fail with "missing module".
export function loadModuleOrder() {
  const order = JSON.parse(fs.readFileSync(path.join(root, "reports/module-order.json"), "utf8"));
  const onDisk = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".js")) onDisk.push(path.relative(root, p).replaceAll("\\", "/"));
    }
  })(path.join(root, "src"));
  const listed = new Set(order);
  const missingFromList = onDisk.filter((f) => f !== "src/main.js" && !listed.has(f.slice(4)));
  const notOnDisk = order.filter((f) => !fs.existsSync(path.join(root, "src", f)));
  if (missingFromList.length || notOnDisk.length) {
    throw Error(
      "module-order.json out of sync with src/ — " +
        [
          missingFromList.length ? `not listed: ${missingFromList.join(", ")}` : "",
          notOnDisk.length ? `listed but absent: ${notOnDisk.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join("; "),
    );
  }
  return order;
}

// Parse every module and collect its comparable top-level statements.
export function collectStatements(order) {
  return order.map((file) => {
    const ast = parseSource(fs.readFileSync(path.join(root, "src", file), "utf8"));
    return { file, statements: comparableStatements(ast.program.body, file) };
  });
}

// Serialize the per-module statements into the single baseline file. Each
// module's statements are wrapped in a bare block so that top-level names
// reused across modules (several files declare their own `smoothstep`) remain
// legal in one parseable file; baselineStatements() flattens the blocks again
// before comparison. Generation is compact for vendor files (they are minified
// upstream) to keep file size and diffs sane.
export function buildBaselineSource(perModule) {
  const chunks = [];
  for (const { file, statements } of perModule) {
    if (!statements.length) continue;
    const code = generate(t.program([t.blockStatement(statements)]), {
      comments: false,
      compact: file.startsWith("vendor/"),
    }).code;
    chunks.push(code);
  }
  return (
    "// Regression baseline snapshot generated by tooling/build-baseline.mjs.\n" +
    "// One bare block per module (reports/module-order.json order); do not edit\n" +
    "// by hand — run `npm run baseline:update` to re-freeze after intentional\n" +
    "// changes. tooling/verify-static.mjs compares src/ against this.\n" +
    chunks.join("\n") +
    "\n"
  );
}

// Parse the baseline file back into the flat, order-aligned statement list.
export function baselineStatements(source) {
  return parseSource(source).program.body.flatMap((node) => {
    if (node.type !== "BlockStatement") {
      throw Error(`baseline corruption: expected a per-module block, got ${node.type}`);
    }
    return node.body;
  });
}

function main() {
  const order = loadModuleOrder();
  const perModule = collectStatements(order);
  const source = buildBaselineSource(perModule);

  // Self-check: the file we are about to freeze must reproduce the exact
  // statement sequence verify-static will compare against.
  const frozen = baselineStatements(source);
  const flat = perModule.flatMap((m) => m.statements);
  if (frozen.length !== flat.length) throw Error("self-check failed: statement count drift");
  for (let i = 0; i < flat.length; i++) {
    if (JSON.stringify(clean(frozen[i])) !== JSON.stringify(clean(flat[i]))) {
      throw Error(`self-check failed: statement ${i} differs after serialization`);
    }
  }

  fs.writeFileSync(path.join(root, BASELINE_PATH), source);
  const meta = {
    generatedAt: new Date().toISOString(),
    generator: "tooling/build-baseline.mjs",
    moduleCount: order.length,
    statementCount: flat.length,
    sha256: crypto.createHash("sha256").update(source).digest("hex"),
  };
  fs.writeFileSync(path.join(root, META_PATH), JSON.stringify(meta, null, 2) + "\n");
  console.log(
    `baseline frozen: ${meta.moduleCount} modules, ${meta.statementCount} statements -> ${BASELINE_PATH}`,
  );
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main();
}
