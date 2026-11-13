# Windhaven Valley · 风栖谷

一个程序化的 Three.js 微缩山谷，也是一台可以“造物”的天气玻璃球：手抓云、下雨、吹风、放雾、拖太阳，或者用 **Aholo Lux3D** 从一张照片 / 一句话生成一个地标，把它放进山谷里，让它淋雨、积雪、被风吹、被雷劈。

## 快速开始

要求 Node.js 22.12+。

```bash
npm ci
cp .env.example .env.local   # Windows: copy .env.example .env.local
# 在 .env.local 里填 AHOLO_API_KEY（只在服务端使用，不要加 VITE_ 前缀）
```

开两个终端：

```bash
# 终端 A：Aholo API + 静态资源服务
npm run server

# 终端 B：Vite 开发服务器
npm run dev
```

打开 <http://127.0.0.1:4190>，点击右上角 **Aholo 造物 / Create**。

## 生产运行

```bash
npm run build
npm start
```

打开 <http://127.0.0.1:4192>。生产环境由同一个 Node 进程提供页面、API 和生成资产，不需要单独启动 Vite。

### 发光贴图涂抹工具

开发服务器启动后打开：

<http://127.0.0.1:4190/tooling/window-glow-painter.html?model=aholo-kongming>

左侧是基础贴图 / glow 图，右侧是 3D 模型。左键涂抹，Alt+左键擦除，右键拖拽旋转，滚轮缩放；`[` `]` 调笔刷，`Ctrl+Z` 撤销。

- 导出得到 `aholo-kongming.glow.webp`。
- 把它放到 `assets/sky-lantern/`，刷新页面即可；孔明灯运行时会优先加载这张单独绘制的 glow 图，找不到时回退到纸面纹理。
- 导入建筑的 `*.glow.webp` 仍然放在 `assets/imported-models/`。

## Aholo 造物流程

```text
照片 / 文字
  → POST /api/generate
  → Aholo Lux3D（G1-Turbo，异步任务）
  → 轮询 /api/jobs/:id
  → 下载 GLB / ZIP → 缓存
  → 浏览器 GLTFLoader 加载
  → 包围盒归一化、贴地、朝向、碰撞 footprint
  → 放进山谷
  → 共享积雪、挂霜和湿度场 + 阴影/倒影 + 角色行为（灯/风标/山庙）
```

- **照片模式**：上传一张物体照片，后端用 `imgTo3d.createFromFile` 创建任务。
- **文字模式**：输入提示词和风格，后端用 `textTo3d.create` 创建任务。
- **我的模型**列出当前服务已生成的模型，可以直接再次摆放。
- **山谷存档**在当前浏览器自动保存地标摆放，也可另存多个命名布局。恢复原始山谷会清空当前摆放，命名存档可随时载入。
- **缓存**：相同图片/提示词与参数会命中 `server/cache/`，不会重复消耗 Aholo 额度。
- **角色**：`guardian` 守山、`lantern` 夜间暖光、`wind` 随风旋转、`shrine` 雷暴优先落雷。
- **天气接入**：生成物的 `MeshStandardMaterial` 通过 `onBeforeCompile` 采样山谷共享的积雪、挂霜和湿度纹理。

## API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/health` | 服务与配置状态 |
| `POST` | `/api/generate` | multipart：`photo`、`role`、`faceCount`；或 JSON：`prompt`、`style`、`role`、`faceCount` |
| `GET` | `/api/jobs/:id` | 任务状态、模型 URL、面数/字节等元数据 |
| `GET` | `/api/models` | 已完成且仍有 GLB 文件的模型 |
| `GET` | `/api/assets/:jobId/*` | 生成的 GLB、输入图等缓存资产 |
| `GET` | `/api/examples` | 示例索引（也提供静态 `/generated/examples/index.json`） |

## 目录

- `server/`：Aholo Lux3D 代理、任务轮询、ZIP/GLB 缓存与静态服务。
- `src/generation/aholo-create.js`：造物台 UI、GLB 加载/归一化、放置、天气材质补丁、角色行为。
- `public/generated/examples/`：旧山谷存档可能引用的示例资产。
- `docs/AHOLO.md`：集成细节、设计取舍与已知限制。

## 安全

`AHOLO_API_KEY` 只放在 `.env.local`，该文件已被 git 忽略；不要写成 `VITE_AHOLO_API_KEY`，否则会被打包进浏览器。比赛/演示结束后建议在 Aholo 控制台轮换 Key。

## 检查

```bash
npm test          # 模块完整性、导入导出、无环、与冻结基线 AST 等价
npm run build     # 生产构建
```

有意修改 `src/` 后需要先 `npm run baseline:update`，再运行 `npm test` 与 `npm run build`，并把 `reference/` 一起提交。详见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## 开发备注

Vite 开发页在 4190，API 默认在 4192。浏览器同源请求 `/api`，开发和预览由 Vite 转发给 Node。更改后端端口时，将 `PORT` 写入 `.env.local` 并重启两个服务。Node 默认只监听本机。如果对外开放，请在反向代理处保护生成接口，因为它会使用配置账号的额度。
