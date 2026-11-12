# Aholo Lux3D 集成说明

## 目标

让 Aholo Lux3D 不只是“离线资产来源”，而是运行时内容引擎：用户用一张照片或一句话生成一个地标，放进风栖谷，参与天气、季节、光照和生态。

## 数据流

```text
Browser
  ├─ AholoCreate UI (src/generation/aholo-create.js)
  ├─ POST /api/generate       (photo or prompt, role, faceCount)
  └─ GET  /api/jobs/:id       (2s poll)
        │
Node server (server/index.mjs)
  ├─ server/lux3d.mjs         @manycore/aholo-sdk-lux3d
  ├─ createImageTask / createTextTask
  ├─ waitForTask              status 0/1/3/4/6
  ├─ download outputs         GLB or ZIP
  ├─ server/inspect-glb.mjs   triangles / materials / bytes
  └─ server/cache/jobs/<id>/  input, model.glb, job.json
        │
Browser
  ├─ CharacterGLTFLoader (Three.js r186)
  ├─ 归一化：包围盒 → 目标高度 → XZ 居中 → 底部贴地
  ├─ 放置：地形 raycast、水面/坡度/边缘/间距校验、ghost
  ├─ 场景：阴影、雾、倒影、scene depth
  └─ 天气补丁：onBeforeCompile 采样 uGroundTex 的积雪、挂霜和湿度
```

## 关键实现

### 1. 生成与缓存

- 使用 `G1-Turbo` + `outputFormat: ["glb"]` + 可调 `faceCount`（10k–300k），默认 30k。
- 图片上传用 multer 内存存储，先落到任务目录；相同图片 + 参数用 SHA-256 做缓存键。
- 结果 URL 有效期约 2 小时，服务端下载后立即落盘，前端只访问自己的 `/api/assets/`。
- 任务写入 `job.json`。服务重启时，有 Aholo 任务 ID 的进行中任务会继续查询。查询和下载中断后，用相同参数重试会续接原任务。若提交结果不明，先到官方任务历史核对。
- 服务端每 12 秒查询 Aholo，浏览器每 2 秒读取本地状态。浏览器连接中断时，可用“继续查询”续接。

### 2. 归一化

- GLB 尺寸不可信（测试陶猫源模型约 0.15m），统一缩放到目标高度（约 0.82 场景单位）。
- 以包围盒底部作为地面，XZ 居中；朝向在放置时朝向相机。
- 所有 mesh 开启阴影/接收阴影；透明材质改成 `alphaTest` + 不透明，避免场景深度/倒影通道出问题；关闭 `transmission` 成本。

### 3. 天气材质

- 复用 `sharedUniforms` 的 `uGroundTex`、`uFieldMin`、`uFieldSize`。
- `onBeforeCompile` 在 `normal_fragment_maps` 后以世界坐标采样地表场。朝上的面按雪深积雪，低温时随地表霜量泛白，湿润时颜色变暗。
- 和地形使用同一张 RGBA 地表场，而不是独立的“假雪”。

### 4. 角色行为

| role | 行为 |
| --- | --- |
| `guardian` | 静态守护，保留天气反应 |
| `lantern` | 夜间点光源 + 呼吸式亮度 |
| `wind` | 每帧采样风场，向风向旋转 |
| `shrine` | 注册到 `ctx.aholoLandmarks`，雷暴时成为落雷候选 |

### 5. 放置

- `InputController` 注册高优先级 `aholo-placement` handler（仅 hand 工具、仅放置模式）。
- 地形 raycast；拒绝水面、地图边缘、陡坡、过近的已有地标。
- Ghost 使用克隆材质半透明；确认后把模型加入场景，并向 `ExplorationNavigation.obstacles` 推入圆形 footprint。

## 已知限制

- G1-Turbo 的纹理质量取决于输入照片；复杂背景/低对比物体容易生成“木纹感”表面。
- 生成任务是异步的，首次通常 1–3 分钟；示例和缓存是演示的稳定路径。
- UI 主要面向桌面；移动端只做了布局收缩。
- 生产需要常驻 Node 服务（Render/Railway/Fly.io 等），因为任务轮询与缓存需要持久磁盘。

## 后续

1. 更细的天气材质（雨痕、风摆）。
2. 生成物命名/铭牌/明信片导出。
3. 角色行为扩展（鸟栖、萤火虫、钟声）。
4. 生成资产 LOD/纹理压缩，降低 8MB 级 GLB 的加载成本。
