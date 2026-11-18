const MODEL_LOAD_TIMEOUT_MS = 60_000;

async function loadWithModelTimeout(load, dispose) {
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error("Model loading timed out.");
      controller.abort(error);
      reject(error);
    }, MODEL_LOAD_TIMEOUT_MS);
  });
  const pending = (async () => {
    const asset = await load(controller.signal);
    // Decoders may still finish after a network abort. Never attach a late model.
    if (controller.signal.aborted) {
      dispose?.(asset);
      throw controller.signal.reason;
    }
    return asset;
  })();
  try {
    return await Promise.race([pending, deadline]);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchModelResponse(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok)
    throw new Error(`Asset request failed (${response.status}): ${url}`);
  return response;
}

async function loadModelGlb(loader, url, signal) {
  const source = new URL(url, document.baseURI);
  const response = await fetchModelResponse(source.href, signal);
  const data = await response.arrayBuffer();
  const resourcePath =
    source.protocol === "data:" ? "" : new URL(".", source).href;
  return loader.parseAsync(data, resourcePath);
}

async function loadModelTexture(loader, url, signal) {
  const response = await fetchModelResponse(url, signal);
  const objectUrl = URL.createObjectURL(await response.blob());
  try {
    return await loader.loadAsync(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function disposeModel(...models) {
  const resources = new Set();
  const images = new Set();
  for (const model of models) {
    model.traverse((object) => {
      if (object.geometry) resources.add(object.geometry);
      if (object.skeleton) resources.add(object.skeleton);
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of materials) {
        if (!material || resources.has(material)) continue;
        resources.add(material);
        for (const value of Object.values(material)) {
          if (!value?.isTexture) continue;
          resources.add(value);
          if (value.image?.close) images.add(value.image);
        }
      }
    });
  }
  for (const resource of resources) resource.dispose();
  for (const image of images) image.close();
}

export { loadWithModelTimeout, loadModelGlb, loadModelTexture, disposeModel };
