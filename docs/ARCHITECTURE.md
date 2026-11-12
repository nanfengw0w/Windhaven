# 架构与维护地图

## 工程边界

Windhaven 是由 JavaScript ES 模块组成的 Three.js 场景，通过 Vite 开发和构建。Three.js 与后处理依赖保留在 `src/vendor/`，Three.js 许可证见 [LICENSES/THREE-LICENSE.txt](../LICENSES/THREE-LICENSE.txt)。

`index.html` 加载 `styles/app.css` 和 `src/main.js`。`main.js` 是按依赖顺序排列的导入清单，最后进入 `src/bootstrap.js`。`reports/module-order.json` 是静态检查使用的模块清单，新增或移动模块时需要同步维护。

## 启动与每帧更新

bootstrap 建立共享上下文 `ctx`，其中包括场景、相机、渲染器、事件总线、世界气候、风场、地表字段、地形、输入、灯光、后处理和各功能模块。

模块的构造与更新顺序由 `MODULE_REGISTRY` 决定：

```text
audio → sky → terrain → water → vegetation → landscapeVegetation
→ willows → alpineTown → farm → woodworkingYard → hikingTrail
→ life → treeFruit → clouds → precipitation → fog → backdrop
→ hud → aholo → mountainRuins → character
```

这是生命周期顺序，不是 ES 模块导入图。模块构造、`update` 和 `beforeRender` 的错误分别记录，出错模块被禁用，其他模块继续运行。初始天气、URL 气候参数和水位确定后，人物再初始化安全落脚点，随后创建探索、拍照及镜头协调器。

主要数据流：

```text
HUD / 指针 / 键盘
  → 输入控制器 / 事件总线 / 世界状态
  → 气候、太阳位置、风场和云
  → 降水源 → 地表积雪、湿润与霜场
  → 水位、植被、天空、建筑、道具和生态状态
  → 光照 / 共享着色器参数 → 后处理 → 画面

事件与世界状态 → 声音控制器 → Web Audio
```

普通模拟先推进天气、世界状态、风和相机，再按注册顺序更新模块。云填充当帧降水源，bootstrap 在降水模块更新前将这些源沉积到地表字段；循环末汇总降雨与降雪，更新灯光和共享参数。随后执行各模块的 `beforeRender`，最后绘制场景和后处理。模拟步长最多为 1/20 秒。

维护时需要保留以下依赖：

- `landscapeVegetation` 复用 `vegetation` 的叶图集和预算，应在其后初始化。
- 降水沉积必须在 clouds 之后、precipitation 之前执行。
- `WaterSystem` 管理结冰状态，并与 `ctx.fields.lakeFrozen` 同步。
- `layout/` 只生成共享空间数据。地形、导航和可见对象使用同一组布局，模拟层不应反向依赖建筑渲染系统。
- 小屋、庭院、码头和小船共用材质随机数流。移动代码时应保留对象创建与随机数调用顺序。
- 跟随镜头在人物移动后更新，保证镜头使用人物本帧的位置。

## 模块导航

| 目录                                            | 职责                                                     |
| ----------------------------------------------- | -------------------------------------------------------- |
| `src/core/`                                     | 配置、事件、输入、天气预设、画质、镜头、探索与拍照控制   |
| `src/layout/`                                   | 山体、村镇、建筑足迹、道路、铁路、局部整地及探索碰撞布局 |
| `src/simulation/`                               | 世界气候、风场、地表字段、统一地形、水面采样和人物导航   |
| `src/render/`                                   | 灯光、共享着色器、场景深度、后处理和字段纹理             |
| `src/terrain/`                                  | 地表、土壤剖面、岩石、道路与细节纹理                     |
| `src/landmarks/`                                | 村镇、铁路、列车、导入建筑模型及麦田系统入口             |
| `src/props/`                                    | 小屋、庭院、码头、小船、木工小院、步道、稻草人与遗迹     |
| `src/water/`                                    | 湖河、瀑布、结冰、倒影、涟漪、水花、鱼群和睡莲           |
| `src/vegetation/`                               | 树石布局、草地 LOD、花卉、作物、柳树与植被交互           |
| `src/life/`                                     | 鸟虫、萤火虫、落叶、烟雾、果实与生态协调                 |
| `src/character/`                                | 旅行者资源、动画、拖拽、自主活动和探索适配               |
| `src/sky/`、`clouds/`、`precipitation/`、`fog/` | 日月、天空、云与降水、雾场                               |
| `src/backdrop/`                                 | 随镜头和天气变化的背景球及光晕                           |
| `src/hud/`                                      | 工具栏、天气、季节、时间、设置、镜头及模式面板           |
| `src/generation/`                               | Aholo Lux3D 造物台、GLB 归一化、放置与天气材质补丁       |
| `server/`                                        | Aholo API 代理、任务轮询、生成资产缓存与生产静态服务     |
| `src/audio/`                                    | 程序合成的环境声音和交互音效                             |
| `src/dev/`                                      | 开发环境中的地形、模型和柳树检查入口                     |
| `src/geometry/`、`src/vendor/`                  | 几何辅助与冻结的第三方依赖                               |

布局维护见 [LANDSCAPE.md](LANDSCAPE.md)，运行资产说明见 [MODEL-ASSETS.md](MODEL-ASSETS.md)。

## 镜头与模式切换

`core/camera-presets.js` 保存七个风景机位和跟随旅人入口。风景机位使用目标点、球坐标距离及视角描述；`CameraRig` 以约三秒缓入缓出切换，连续切换从实际相机状态开始，角度走短路径。手动操作会接管风景镜头。左侧 `hud/camera-controls.js` 复用可折叠气候卡片，切换时同步 URL 的 `cam` 参数。

跟随机位读取人物的位置和朝向。右键环绕和滚轮缩放保持跟随，中键平移回到自由构图。`core/camera-views.js` 沿相机与人物之间的距离检查地形和建筑足迹，并限制镜头进入水下或地图外。这里使用保守碰撞体，不对植被与列车逐三角形检测。

`captureState/restoreState` 保存机位、过渡进度、跟随角度、视角和画幅适配状态。进入探索或拍照时保存这些状态，退出后恢复；探索中释放光标再选择预设，则从眼部机位平滑过渡回普通观察。

`hud/camera-inspector.js` 提供 F2、设置开关和 `?debug=camera` 测试面板。它独立于模拟时间刷新，直接读取实际相机的位置、朝向和投影参数；复制内容中的目标点沿真实视线计算，不使用自由拍照或步行时可能过期的轨道目标。`window.__wg.cameraSnapshot()` 提供相同快照。

## 人物与第一人称探索

`character/system.js` 持有旅行者的 `navigation` 和 `actor`。探索控制器共享这两份状态；进入第一人称从人物当前位置和朝向接管，模型隐藏，退出时重新显示并更新自主活动锚点。非探索时，人物在最后放置点或退出探索点附近走走停停；拖拽支持安全陆地、湖河水面与冰面。

`core/exploration.js` 管理鼠标锁定与输入。WASD 移动，任一侧 Shift 使移动速度翻倍，空格在陆地跳跃。右键释放光标以操作 UI，点击场景重新锁定；退出、失焦和模式切换清除按键状态，避免遗留移动。

`simulation/exploration-navigation.js` 负责沿地形行走、落地、游泳、建筑与地图边界约束。地形和碰撞足迹来自共享布局，水面由 `simulation/water-surface.js` 采样。人物自主移动与玩家移动共用步进检查；浅岸允许连续进出水域，厚冰可提供支撑，瀑布竖直水帘不作为游泳平面。

`character/animation.js` 在人物系统中统一推进动作，颜色、阴影、场景深度和倒影使用同一帧骨骼姿态。动作优先级为悬空拖拽、游泳、行走和待机；空格跳跃不复用拖拽悬空动作。模型通过父层统一脚底高度和朝向，动画显示补偿不修改导航坐标。GLB 及动作说明见 [MODEL-ASSETS.md](MODEL-ASSETS.md)。

## 拍照与界面

`core/photo-mode.js` 提供自由取景相机。进入时保存相机和原模式状态；WASD/Q/E 移动、Shift 加速、右键环顾、滚轮变焦。拍照可以保持时间暂停，也可以继续天气和世界时间。模式入口等待异步模型加载完成或失败，避免冻结后再替换模型。

暂停拍照完全跳过模拟更新，包括 `__wg.simulate`，只推进独立镜头。不能用零步长模拟代替暂停，因为某些更新会吸附目标或消耗随机数。恢复时间时按原序推进世界系统；从步行进入拍照的人物仍保留进入时的控制状态。

冻结期间仍同步视角相关的透明排序、云雾内外面、彩虹、粒子尺寸与倒影。水面反射在其他视角状态就绪后绘制。保存照片在最终后处理之后读取画布，导出的 PNG 不包含 DOM 界面。

季节、时间、镜头和天气预设在拍照中可操作；暂停时天气与时间控件修改目标，点击“继续时间”后推进变化。`U` 隐藏所有界面但保留操作，F2 面板也遵循此状态。探索锁定鼠标时保留的控件处于 `inert`，释放光标后恢复交互。折叠偏好和引导状态使用 localStorage。

## 渲染与遮挡

后处理链为不透明场景深度 → MSAA 场景 → bloom → OutputPass → FilmGrade。移轴通道保留但关闭；调色、暗角和颗粒作用于 OutputPass 之后的图像。

`render/scene-depth.js` 提供当前相机的不透明深度纹理，大气、雾和彩虹按实际遮挡距离截断体积采样。太阳星芒在盘面中心和周边采样可见比例，避免光芒穿过建筑。深度预处理保留原材质的透明裁剪、风摆、积雪和隧道裁剪，结束后恢复绘制状态；水面反射不读取主镜头的深度。

这条路径增加一次不透明场景绘制。修改着色器时，应在实际浏览器检查近距离树叶、建筑、山体与各档画质，而不是只依赖静态校验。

## 调试与验证

常用 URL 参数包括 `scenario`、`season`、`time`、`temp`、`tool`、`cam`、`ui`、`quality`、`paused` 和 `warm`。`?stats` 显示帧间隔、CPU 提交时间与绘制信息，这些不是 GPU 定时查询。开发服务器还提供 `?inspection=terrain`、`?inspection=models` 和 `?inspection=willows`；生产构建不启用这些检查入口。

`window.__wg` 可切换场景、按固定步长模拟、设置相机预设、查看镜头快照、切换模块显隐和读取性能信息。

本仓库保留两个基线工具：

- `tooling/build-baseline.mjs`：按模块清单生成 `reference/bundle.baseline.js` 与元数据，使用 `npm run baseline:update` 调用。
- `tooling/verify-static.mjs`：校验模块完整性、导入导出、依赖无环及与基线的 AST 等价性，使用 `npm test` 调用。生成结果写入本地 `reports/static-verification.json`。

有意修改代码后，先核对实际变更与受影响场景，再更新基线，执行 `npm test` 和 `npm run build`，将代码与基线放在同一次提交中。结构整理还应保持随机数消耗、几何和材质创建、场景子对象及模拟更新顺序。重新冻结本身不证明视觉不变。

本发行版不包含开发期间的临时快照、截图报告或一次性检查脚本。运行验收应覆盖受影响的天气与画质、控制台与着色器错误、交互、音频及窗口缩放，并记录实际验证范围。
