import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { createLux3dClient } from "@manycore/aholo-sdk-lux3d";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(root, ".env.local") });
dotenv.config({ path: path.join(root, ".env") });

const apiKey = process.env.AHOLO_API_KEY || "";
const hasAholoKey = Boolean(apiKey);
const region = process.env.AHOLO_REGION === "com" ? "com" : "cn";
const baseUrl = process.env.AHOLO_BASE_URL || undefined;
const client = apiKey
  ? createLux3dClient({ apiKey, region, baseUrl, timeoutMs: 120_000 })
  : null;

function requireClient() {
  if (!client)
    throw new Error(
      "Aholo Lux3D is not configured. Set AHOLO_API_KEY in .env.local.",
    );
  return client;
}

function normalizeFaceCount(value) {
  if (value == null || String(value).trim() === "") return 30_000;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 30_000;
  return Math.max(10_000, Math.min(300_000, Math.round(parsed)));
}

function generationOptions(faceCount) {
  return {
    version: "G1-Turbo",
    faceCount: normalizeFaceCount(faceCount),
    outputFormat: ["glb"],
    enablePbr: true,
    aiPredictSize: true,
  };
}

async function createImageTask(filePaths, faceCount) {
  const imageTo3d = requireClient().imgTo3d;
  const options = generationOptions(faceCount);
  return filePaths.length === 1
    ? imageTo3d.createFromFile(filePaths[0], options)
    : imageTo3d.createFromFiles(filePaths, options);
}

async function createTextTask({ prompt, style, faceCount }) {
  return requireClient().textTo3d.create({
    prompt,
    ...(style ? { style } : {}),
    ...generationOptions(faceCount),
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const POLL_INTERVAL_MS = 12_000;

function isTransientLux3dError(error) {
  return (
    error.statusCode === 429 ||
    error.statusCode >= 500 ||
    error.name === "RateLimitError" ||
    error.name === "AbortError" ||
    error instanceof TypeError ||
    error instanceof SyntaxError ||
    error.message?.startsWith("Request timed out")
  );
}

function safeLux3dMessage(error) {
  const message = String(error?.message || "Generation failed.");
  return (
    apiKey ? message.replaceAll(apiKey, "[redacted]") : message
  ).replaceAll(/https?:\/\/[^\s]+/gi, "[URL]");
}

async function waitForTask(
  taskId,
  onProgress,
  { timeoutMs = 12 * 60_000 } = {},
) {
  const started = Date.now();
  const deadline = started + timeoutMs;
  while (Date.now() < deadline) {
    let result;
    try {
      result = await requireClient().tasks.retrieve(taskId, {
        signal: AbortSignal.timeout(Math.max(1, deadline - Date.now())),
      });
    } catch (error) {
      if (!isTransientLux3dError(error)) throw error;
    }
    onProgress?.(result, Date.now() - started);
    if (result && [3, 4, 6].includes(result.status)) return result;
    const remaining = deadline - Date.now();
    if (remaining > 0) await sleep(Math.min(POLL_INTERVAL_MS, remaining));
  }
  throw new Error(
    "Aholo task status could not be confirmed within 12 minutes.",
  );
}

export {
  createImageTask,
  createTextTask,
  hasAholoKey,
  isTransientLux3dError,
  normalizeFaceCount,
  region,
  safeLux3dMessage,
  waitForTask,
};
