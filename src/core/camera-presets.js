// Each view frames a distinct part of the valley; legacy links resolve below.
const CAMERA_PRESETS = {
  overview: {
    label: "山谷全景",
    description: "远景 · 一览山谷",
    theta: 0.449260113,
    phi: 1.090365139,
    radius: 35.052674648,
    target: [0, 1.3, 0],
    fov: 40,
  },
  valley: {
    label: "山水之间",
    description: "远景 · 湖泊与群峰",
    theta: 0.596423457,
    phi: 1.262186529,
    radius: 13.827870407,
    target: [1, 1.2, -0.1],
    fov: 48,
  },
  town: {
    label: "小镇屋檐",
    description: "中景 · 越过屋顶看山湖",
    theta: 1.559722206267,
    phi: 1.401073342813,
    radius: 1.000000001115,
    target: [9.55527805, 2.1199775, 1.20394282],
    fov: 42,
  },
  lake: {
    label: "柳岸湖光",
    description: "近景 · 垂柳与倒影",
    theta: 1.115277614673,
    phi: 1.648457108435,
    radius: 0.999999992285,
    target: [6.22423239, 0.96797439, 3.11602838],
    fov: 60,
  },
  cabin: {
    label: "林间小屋",
    description: "近景 · 草木与炊烟",
    theta: 0.390607044,
    phi: 1.689894231,
    radius: 1.851593908,
    target: [-2.5, 1, 0.8],
    fov: 65,
  },
  waterfall: {
    label: "循溪望瀑",
    description: "近景 · 溪流与山瀑",
    theta: 0.906021832,
    phi: 1.570796327,
    radius: 4.701063709,
    target: [-2, 1.7, -1.45],
    fov: 55,
  },
  summit: {
    label: "山巅回望",
    description: "远景 · 从山脊看湖畔小镇",
    theta: -2.363601762,
    phi: 1.009668261,
    radius: 11.275194012,
    target: [4.4, 1.1, 2],
    fov: 56,
  },
  follow: {
    label: "跟随旅人",
    description: "跟随 · 陪旅人漫步",
    follow: true,
    fov: 50,
  },
};

const CAMERA_PRESET_ALIASES = {
  front: "valley",
  hero: "valley",
  side: "town",
  top: "overview",
  low: "cabin",
  close: "lake",
  mountains: "waterfall",
};

export { CAMERA_PRESETS, CAMERA_PRESET_ALIASES };
