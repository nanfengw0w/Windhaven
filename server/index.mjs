import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import {
  createImageTask,
  createTextTask,
  hasAholoKey,
  isTransientLux3dError,
  normalizeFaceCount,
  region,
  safeLux3dMessage,
  waitForTask,
} from "./lux3d.mjs";
import { inspectGlb } from "./inspect-glb.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cacheRoot = path.join(root, "server", "cache");
const jobsRoot = path.join(cacheRoot, "jobs");
const indexFile = path.join(cacheRoot, "index.json");
const examplesFile = path.join(
  root,
  "public",
  "generated",
  "examples",
  "index.json",
);
const port = Number(process.env.PORT || 4192);
const demoPassword = process.env.WINDHAVEN_DEMO_PASSWORD;
if (process.env.RENDER === "true" && (!hasAholoKey || !demoPassword)) {
  throw new Error(
    "Set AHOLO_API_KEY and WINDHAVEN_DEMO_PASSWORD before deploying Windhaven to Render.",
  );
}
fs.mkdirSync(jobsRoot, { recursive: true });

const jobs = new Map();
const hashToJob = new Map();
const imageExtensions = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);
const maxPhotos = 32;
const maxPhotoBytes = 12 * 1024 * 1024;
const uploadedPhotoBytes = new WeakMap();
const upload = multer({
  storage: {
    _handleFile(request, file, callback) {
      const chunks = [];
      file.stream.on("data", (chunk) => {
        // Bound the whole batch while reading it, including chunked uploads.
        const total = (uploadedPhotoBytes.get(request) ?? 0) + chunk.length;
        uploadedPhotoBytes.set(request, total);
        if (total <= maxPhotoBytes) chunks.push(chunk);
      });
      file.stream.on("end", () => {
        if (uploadedPhotoBytes.get(request) > maxPhotoBytes)
          return callback(
            new multer.MulterError("LIMIT_FILE_SIZE", file.fieldname),
          );
        callback(null, { buffer: Buffer.concat(chunks) });
      });
    },
    _removeFile(_request, file, callback) {
      delete file.buffer;
      callback(null);
    },
  },
  // Busboy signals a limit at equality. The storage checks the inclusive cap.
  limits: { fileSize: maxPhotoBytes + 1, files: maxPhotos },
  fileFilter(_request, file, callback) {
    if (!imageExtensions.has(file.mimetype))
      return callback(new Error("Upload a PNG, JPEG, or WebP image."));
    callback(null, true);
  },
});

function loadCache() {
  let entries = [];
  try {
    entries = fs.readdirSync(jobsRoot, { withFileTypes: true });
  } catch {}
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const file = path.join(jobsRoot, entry.name, "job.json");
    try {
      const job = JSON.parse(fs.readFileSync(file, "utf8"));
      if (job?.id) jobs.set(job.id, job);
    } catch {}
  }

  try {
    const index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
    for (const [hash, jobId] of Object.entries(index)) {
      if (jobs.get(jobId)?.hash === hash) hashToJob.set(hash, jobId);
    }
  } catch {}
  const newestFirst = [...jobs.values()].sort(
    (first, second) => (second.createdAt ?? 0) - (first.createdAt ?? 0),
  );
  for (const job of newestFirst) {
    if (typeof job.hash === "string" && job.hash && !hashToJob.has(job.hash))
      hashToJob.set(job.hash, job.id);
  }
}

function writeJob(job) {
  fs.mkdirSync(path.join(jobsRoot, job.id), { recursive: true });
  fs.writeFileSync(
    path.join(jobsRoot, job.id, "job.json"),
    JSON.stringify(job, null, 2),
  );
}

function saveIndex() {
  fs.writeFileSync(
    indexFile,
    JSON.stringify(Object.fromEntries(hashToJob), null, 2),
  );
}

function hashInput(parts) {
  const hash = crypto.createHash("sha256");
  for (const part of parts) {
    if (Buffer.isBuffer(part)) hash.update(part);
    else hash.update(String(part ?? ""));
    hash.update("\u0000");
  }
  return hash.digest("hex");
}

function publicJob(job) {
  return {
    id: job.id,
    mode: job.mode,
    status: job.status,
    progress: job.progress ?? 0,
    message: job.message || "",
    taskId: job.taskId ?? null,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    elapsedMs: job.elapsedMs ?? 0,
    prompt: job.prompt || "",
    role: job.role || "guardian",
    inputUrl: job.inputUrl || "",
    modelUrl: job.modelUrl || "",
    thumbUrl: job.thumbUrl || "",
    meta: job.meta || null,
    error: job.error || "",
  };
}

function hasCachedModel(job) {
  if (
    job.status !== "done" ||
    typeof job.id !== "string" ||
    typeof job.modelUrl !== "string"
  )
    return false;

  try {
    const prefix = "/api/assets/" + encodeURIComponent(job.id) + "/";
    if (!job.modelUrl.startsWith(prefix)) return false;
    const directory = path.resolve(jobsRoot, job.id);
    const file = path.resolve(
      directory,
      decodeURIComponent(job.modelUrl.slice(prefix.length)),
    );
    return (
      directory.startsWith(jobsRoot + path.sep) &&
      file.startsWith(directory + path.sep) &&
      path.extname(file).toLowerCase() === ".glb" &&
      fs.statSync(file, { throwIfNoEntry: false })?.isFile() === true
    );
  } catch {
    return false;
  }
}

function setStatus(job, status, message, progress) {
  job.status = status;
  job.updatedAt = Date.now();
  if (message !== undefined) job.message = message;
  if (progress !== undefined) job.progress = progress;
  writeJob(job);
}

function findGlb(directory) {
  let best = null;
  const queue = [directory];
  while (queue.length) {
    const current = queue.shift();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) queue.push(full);
      else if (/\.glb$/i.test(entry.name)) {
        const size = fs.statSync(full).size;
        if (!best || size > best.size) best = { path: full, size };
      }
    }
  }
  return best;
}

async function saveOutputs(job, result) {
  const urls = (result.outputs || [])
    .map((output) => output?.content)
    .filter(
      (content) => typeof content === "string" && /^https?:/i.test(content),
    );
  if (!urls.length) throw new Error("Aholo returned no downloadable outputs.");

  const jobPath = path.join(jobsRoot, job.id);
  let modelPath = null;
  for (const url of urls) {
    const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
    if (!response.ok)
      throw new Error("Could not download the generated asset.");
    const buffer = Buffer.from(await response.arrayBuffer());
    const magic = buffer.toString("latin1", 0, 4);
    if (magic === "glTF") {
      modelPath = path.join(jobPath, "model.glb");
      fs.writeFileSync(modelPath, buffer);
      break;
    }
    if (magic.startsWith("PK")) {
      const extractRoot = path.join(jobPath, "model");
      fs.rmSync(extractRoot, { recursive: true, force: true });
      fs.mkdirSync(extractRoot, { recursive: true });
      new AdmZip(buffer).extractAllTo(extractRoot, true);
      const glb = findGlb(extractRoot);
      if (glb) {
        modelPath = glb.path;
        break;
      }
    }
    const ext = path.extname(new URL(url).pathname) || ".bin";
    fs.writeFileSync(path.join(jobPath, "output" + ext), buffer);
  }
  if (!modelPath)
    throw new Error("The generated archive did not contain a GLB.");

  const relative = path.relative(jobPath, modelPath).split(path.sep).join("/");
  const encoded = relative.split("/").map(encodeURIComponent).join("/");
  job.modelUrl = "/api/assets/" + encodeURIComponent(job.id) + "/" + encoded;
  const modelBuffer = fs.readFileSync(modelPath);
  const inspected = inspectGlb(modelBuffer);
  job.meta = {
    ...(inspected || {}),
    bytes: modelBuffer.length,
    taskId: job.taskId,
    version: "G1-Turbo",
    mode: job.mode,
  };
}

async function runJob(job, imagePaths) {
  let upstreamFinished = false;
  let submitting = false;
  try {
    job.error = "";
    job.resumeTask = false;
    if (!job.taskId) {
      setStatus(job, "creating", "Aholo Lux3D is preparing your model…", 0.05);
      submitting = true;
      job.taskId =
        job.mode === "photo"
          ? await createImageTask(imagePaths, job.faceCount)
          : await createTextTask({
              prompt: job.prompt,
              style: job.style,
              faceCount: job.faceCount,
            });
    }
    setStatus(job, "running", "Aholo Lux3D is generating…", 0.2);
    const result = await waitForTask(job.taskId, (snapshot) => {
      job.elapsedMs = Date.now() - job.createdAt;
      const message = !snapshot
        ? "Connection interrupted. Retrying the same Aholo task…"
        : job.elapsedMs > 45_000
          ? "Still generating — detailed models can take a couple of minutes…"
          : "Aholo Lux3D is generating…";
      if (job.message !== message && (!snapshot || snapshot.status < 3))
        setStatus(job, "running", message, 0.2);
    });
    if (result.status !== 3) {
      upstreamFinished = true;
      throw new Error(
        result.status === 6
          ? "The Aholo task was canceled."
          : "The Aholo task failed.",
      );
    }
    setStatus(job, "downloading", "Downloading and preparing the asset…", 0.85);
    await saveOutputs(job, result);
    job.elapsedMs = Date.now() - job.createdAt;
    setStatus(job, "done", "Ready to place in the valley.", 1);
    console.log(
      "[aholo] job " +
        job.id +
        " done in " +
        Math.round(job.elapsedMs / 1000) +
        "s",
    );
  } catch (error) {
    job.resumeTask = Boolean(job.taskId) && !upstreamFinished;
    job.submissionUncertain =
      submitting &&
      !job.taskId &&
      ((error.name !== "RateLimitError" &&
        error.statusCode !== 429 &&
        isTransientLux3dError(error)) ||
        error.cmdCode === "0");
    const detail = safeLux3dMessage(error);
    job.error = job.submissionUncertain
      ? "Aholo submission could not be confirmed. Check the provider history before trying this request again."
      : job.resumeTask
        ? detail + " Retry with the same inputs to continue the existing task."
        : detail;
    job.elapsedMs = Date.now() - job.createdAt;
    setStatus(job, "error", job.error, 0);
    console.error("[aholo] job " + job.id + " failed:", job.error);
  }
}

function startJob(job, imagePaths) {
  runJob(job, imagePaths).catch((error) => {
    console.error("[aholo] unexpected job error:", safeLux3dMessage(error));
  });
}

function recoverJobs() {
  for (const job of jobs.values()) {
    if (!["queued", "creating", "running", "downloading"].includes(job.status))
      continue;
    if (job.taskId) {
      startJob(job);
    } else {
      job.submissionUncertain = job.status !== "queued";
      job.error = job.submissionUncertain
        ? "The server restarted before the Aholo task ID was saved. Check the provider history before trying again."
        : "The server restarted before submission. Please try again.";
      setStatus(job, "error", job.error, 0);
    }
  }
}

loadCache();

const app = express();

// Lightweight request log: no bodies, keys, or headers beyond size/origin.
app.use((request, response, next) => {
  if (!request.path.startsWith("/api")) return next();
  const started = Date.now();
  console.log(
    "[req]",
    request.method,
    request.path,
    request.headers["content-length"] || "-",
    request.headers.origin || "-",
  );
  response.on("finish", () => {
    console.log(
      "[res]",
      request.method,
      request.path,
      response.statusCode,
      Date.now() - started + "ms",
    );
  });
  next();
});

if (demoPassword) {
  const expected = crypto
    .createHash("sha256")
    .update(`judge:${demoPassword}`)
    .digest();
  app.get("/healthz", (_request, response) => response.sendStatus(200));
  app.use((request, response, next) => {
    const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(
      request.get("authorization") || "",
    );
    if (match) {
      const credentials = Buffer.from(match[1], "base64");
      const received = crypto.createHash("sha256").update(credentials).digest();
      if (crypto.timingSafeEqual(received, expected)) return next();
    }
    response.set(
      "WWW-Authenticate",
      'Basic realm="Windhaven", charset="UTF-8"',
    );
    response.set("Cache-Control", "no-store");
    response.sendStatus(401);
  });
  app.use("/api/assets", (_request, response, next) => {
    response.set("Cache-Control", "private, no-store");
    next();
  });
}
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    provider: "Aholo Lux3D",
    configured: hasAholoKey,
    region,
    jobs: jobs.size,
  });
});

app.get("/api/examples", (_request, response) => {
  try {
    response.json(JSON.parse(fs.readFileSync(examplesFile, "utf8")));
  } catch {
    response.json([]);
  }
});

app.get("/api/models", (_request, response) => {
  const models = [...jobs.values()]
    .filter(hasCachedModel)
    .sort((first, second) => second.createdAt - first.createdAt)
    .map((job) => ({
      id: job.id,
      mode: job.mode,
      status: job.status,
      taskId: job.taskId ?? null,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      role: job.role || "guardian",
      modelUrl: job.modelUrl,
      thumbUrl: job.thumbUrl !== job.inputUrl ? job.thumbUrl || "" : "",
      meta: job.meta || null,
    }));
  response.json(models);
});

app.get("/api/jobs/:id", (request, response) => {
  const job = jobs.get(request.params.id);
  if (!job) return response.status(404).json({ error: "Job not found." });
  response.json(publicJob(job));
});

app.post("/api/generate", (request, response, next) => {
  const origin = request.get("origin");
  // Multipart POSTs can reach the server cross-site without a CORS preflight.
  // Vite proxies the same-origin request and preserves the browser-facing Host.
  if (
    origin &&
    (!/^https?:\/\//i.test(origin) ||
      !URL.canParse(origin) ||
      new URL(origin).host !== request.get("host")?.toLowerCase())
  )
    return response
      .status(403)
      .json({ error: "Generate from the Windhaven page." });
  upload.array("photo", maxPhotos)(request, response, (error) => {
    if (error) return next(error);
    handleGenerate(request, response).catch(next);
  });
});

async function handleGenerate(request, response) {
  if (!hasAholoKey)
    return response.status(503).json({
      error:
        "Aholo Lux3D is not configured on this server. Add AHOLO_API_KEY to .env.local and restart the server.",
    });
  const prompt = String(request.body?.prompt || "")
    .trim()
    .slice(0, 1200);
  const style = String(request.body?.style || "photorealistic").trim();
  const role = ["guardian", "lantern", "wind", "shrine"].includes(
    request.body?.role,
  )
    ? request.body.role
    : "guardian";
  const faceCount = normalizeFaceCount(request.body?.faceCount);
  const files = request.files ?? [];
  const [firstPhoto] = files;
  if (!firstPhoto && !prompt)
    return response
      .status(400)
      .json({ error: "Upload a photo or enter a prompt." });

  const mode = firstPhoto ? "photo" : "text";
  let hash;
  if (files.length > 1) {
    const viewHashes = files.map((file) =>
      crypto.createHash("sha256").update(file.buffer).digest("hex"),
    );
    hash = "multi-photo:" + hashInput([...viewHashes, mode, faceCount, role]);
  } else {
    hash = hashInput(
      firstPhoto
        ? [firstPhoto.buffer, mode, faceCount, role]
        : [prompt, mode, style, faceCount, role],
    );
  }
  const existingId = hashToJob.get(hash);
  const existing = existingId ? jobs.get(existingId) : null;
  if (existing) {
    if (existing.status !== "error" || existing.submissionUncertain)
      return response.json({ jobId: existing.id, cached: true });
    if (existing.resumeTask) {
      startJob(existing);
      return response.status(202).json({ jobId: existing.id, cached: true });
    }
  }

  const id = crypto.randomUUID();
  const job = {
    id,
    hash,
    mode,
    status: "queued",
    progress: 0,
    message: "Queued.",
    role,
    prompt: mode === "text" ? prompt : "",
    style,
    faceCount,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    elapsedMs: 0,
  };
  const jobPath = path.join(jobsRoot, id);
  fs.mkdirSync(jobPath, { recursive: true });
  const imagePaths = files.map((file, index) => {
    const extension = imageExtensions.get(file.mimetype);
    const filename =
      "input" + (index === 0 ? "" : "-" + (index + 1)) + extension;
    const imagePath = path.join(jobPath, filename);
    fs.writeFileSync(imagePath, file.buffer);
    return imagePath;
  });
  if (firstPhoto) {
    job.inputUrl =
      "/api/assets/" +
      encodeURIComponent(id) +
      "/" +
      path.basename(imagePaths[0]);
    job.thumbUrl = job.inputUrl;
  }
  jobs.set(id, job);
  hashToJob.set(hash, id);
  writeJob(job);
  saveIndex();
  response.status(202).json({ jobId: id, cached: false });
  startJob(job, imagePaths);
}

app.use(
  "/api/assets",
  express.static(jobsRoot, {
    fallthrough: false,
    setHeaders(response, file) {
      if (/\.glb$/i.test(file))
        response.setHeader("Content-Type", "model/gltf-binary");
      if (!demoPassword && /\.(png|jpg|jpeg|webp)$/i.test(file))
        response.setHeader("Cache-Control", "public, max-age=3600");
    },
  }),
);

const dist = path.join(root, "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.use((request, response, next) => {
    if (request.method !== "GET" || request.path.startsWith("/api"))
      return next();
    response.sendFile(path.join(dist, "index.html"));
  });
}

app.use((error, _request, response, _next) => {
  console.error("[aholo] request error:", error?.message || error);
  if (error?.code === "LIMIT_FILE_SIZE")
    return response
      .status(413)
      .json({ error: "Images must total 12 MB or less." });
  if (error?.code === "LIMIT_FILE_COUNT")
    return response
      .status(400)
      .json({ error: "Upload no more than 32 images." });
  response.status(400).json({ error: error?.message || "Request failed." });
});

const host = process.env.HOST || "127.0.0.1";
app.listen(port, host, () => {
  console.log("[aholo] server http://" + host + ":" + port);
  console.log("[aholo] key configured:", hasAholoKey ? "yes" : "no");
  recoverJobs();
});
