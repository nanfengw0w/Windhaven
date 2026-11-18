# 运行模型资产

## 包含的资源

`assets/` 包含应用直接加载的 28 个文件：10 个静态网格、10 张基色贴图、7 张窗光贴图，以及 1 个带骨骼与动画的旅行者 GLB。开发和构建直接使用这些文件，不需要生成服务账户、API 密钥或额外下载。

导入模型由项目维护者提供，旅行者的模型、骨骼和动作来自 Aholo Lux3D。原始生成压缩包、参考图、重复导出、生成任务记录和高细节备选资源不随本发行版提供。

| 资产 ID         | 场景用途   | 运行文件                       |
| --------------- | ---------- | ------------------------------ |
| `cottage`       | 村镇原木屋 | `.mesh`、`.webp`、`.glow.webp` |
| `clocktower`    | 钟楼       | `.mesh`、`.webp`、`.glow.webp` |
| `station`       | 站房       | `.mesh`、`.webp`、`.glow.webp` |
| `house-long`    | 单层长屋   | `.mesh`、`.webp`、`.glow.webp` |
| `house-inn`     | L 形旅店   | `.mesh`、`.webp`、`.glow.webp` |
| `house-tall`    | 窄面高屋   | `.mesh`、`.webp`、`.glow.webp` |
| `coach`         | 客车厢     | `.mesh`、`.webp`、`.glow.webp` |
| `locomotive`    | 蒸汽机车   | `.mesh`、`.webp`               |
| `scarecrow`     | 麦田稻草人 | `.mesh`、`.webp`               |
| `mountain-ruin` | 后山遗迹   | `.mesh`、`.webp`               |
| `traveler`      | 常驻旅行者 | `characters/traveler.glb`      |

静态资源位于 `assets/imported-models/`。源代码使用显式 `new URL(..., import.meta.url)` 引用，Vite 在构建时收集资源并生成带内容指纹的文件名。中心小屋、轨道、植被和多数地表细节仍由程序生成。

## 静态模型加载

`src/landmarks/imported-models.js` 解析 WGMS 网格并加载 WebP 贴图。WGMS 使用带版本和顶点/索引数量的头部，后接位置、法线、UV 和索引数组；实际格式以加载器实现为准。基色图按 sRGB 读取，材质继续参与共享光照、阴影、雨湿、霜冻与积雪处理。

`town-model-replacement.js` 负责村镇与列车模型的批量加载、占位替换和失败回退；同类对象共享几何、材质与贴图。`props/scarecrow.js` 和 `props/mountain-ruins-model.js` 分别管理稻草人与遗迹的独立加载。模型布局、门口和支撑尺寸保存在 `src/layout/building-model-layout.js`，道路和地基使用这些共享数据。

启动页会等待村镇与列车、稻草人、山顶遗迹、旅行者、孔明灯及上次保存的地标布局。模型加载失败或超过 60 秒时，常驻模型使用程序化替代，过期的下载结果会被丢弃。用户主动打开造物台时才加载示例目录和新选中的模型。

模型使用 Y 向上的统一坐标约定，并由布局层调整比例、朝向和落地高度。更换房屋时需要同步门口位置、真实墙脚、碰撞足迹、入户道路及草木净空。不要把源模型尺寸直接当作场景中的米制单位，也不要通过拉伸模型来贴合坡面。

窗光贴图与基色图使用相同 UV，随昼夜逐渐点亮。列车沿铁路路线整体移动和俯仰；现有车体为静态网格，没有独立转动车轮或开合车门。

## 旅行者与动画

`assets/characters/traveler.glb` 已包含蒙皮、材质、22 骨骼及五个官方动作。运行时不依赖外置 manifest 或动画文件。

| 片段名称            | 用途                         |
| ------------------- | ---------------------------- |
| `Idle_Loop`         | 站立待机                     |
| `Idle_Crossed_Loop` | 抱臂待机                     |
| `Walk_Loop`         | 陆地行走                     |
| `Swim_Loop`         | 水中游泳                     |
| `Held_Loop`         | 上帝视角拖起人物时的悬空姿态 |

动作保留官方骨骼变换，水平世界位移由碰撞导航统一管理。空格使用物理跳跃，不播放拖拽悬空动作。

`src/character/model.js` 检查必要动画、蒙皮与 GLB 内嵌的 `windhavenCharacterProfile`。该配置包含归一化身高、各动作的脚底补偿和游泳水线；替换 GLB 时应保留或重新测量这些字段。显示模型通过外层统一为场景中的 0.20 身高，并校正朝向，不改写动画骨架本身。

`src/character/gltf-loader.js` 来自 Three.js r186 的加载器辅助代码，并与现有 `src/vendor/three-runtime.js` 共用运行时。保留其中的第三方许可，不额外打包另一套 Three.js。

## 维护与检查

更换运行资源后，先运行 `npm run build` 检查引用完整性，再在实际浏览器检查贴图方向、接地、光照、裁剪、动画和控制台错误。若同时修改源码，按 [架构文档](ARCHITECTURE.md) 更新基线并运行静态检查。

开发服务器的 [模型检查入口](http://127.0.0.1:4190/?inspection=models&quality=high&scenario=calm&season=1&time=0.55) 可近距离查看村镇、列车与稻草人。旅行者还应分别检查普通观察、拖拽、入水、第一人称和拍照状态。测试面板仅用于辅助检查，静态构建成功不等于模型视觉与动画已经验收。
