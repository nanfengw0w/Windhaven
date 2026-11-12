function inspectGlb(buffer) {
  try {
    if (buffer.length < 20) return null;
    if (buffer.toString("latin1", 0, 4) !== "glTF") return null;
    const jsonLength = buffer.readUInt32LE(12);
    const jsonType = buffer.toString("latin1", 16, 20);
    if (jsonType !== "JSON" || jsonLength <= 0) return null;
    const json = JSON.parse(buffer.toString("utf8", 20, 20 + jsonLength));
    const accessors = json.accessors || [];
    let triangles = 0;
    let primitives = 0;
    for (const mesh of json.meshes || []) {
      for (const primitive of mesh.primitives || []) {
        primitives += 1;
        const accessor =
          primitive.indices != null
            ? accessors[primitive.indices]
            : accessors[primitive.attributes?.POSITION];
        if (accessor?.count) triangles += Math.floor(accessor.count / 3);
      }
    }
    return {
      triangles,
      primitives,
      meshes: json.meshes?.length || 0,
      materials: json.materials?.length || 0,
      nodes: json.nodes?.length || 0,
      generator: json.asset?.generator || "",
    };
  } catch {
    return null;
  }
}

export { inspectGlb };
