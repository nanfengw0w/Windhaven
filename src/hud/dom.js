// Reconstructed module: identifiers and file boundaries are refactor choices.
const clampHud = (r, t, e) => (r < t ? t : r > e ? e : r);
const positiveModuloHud = (r, t) => ((r % t) + t) % t;
const wrapSignedHud = (r, t) => (
  (r = positiveModuloHud(r, t)),
  r > t / 2 ? r - t : r
);
const hudNow = () => performance.now();
function createHudElement(r, t = null, e = null) {
  const i = document.createElement(r);
  if (t)
    for (const s in t) {
      const n = t[s];
      n === !1 ||
        n === null ||
        n === void 0 ||
        (s === "html"
          ? (i.innerHTML = n)
          : s === "text"
            ? (i.textContent = n)
            : s === "style" && typeof n == "object"
              ? Object.assign(i.style, n)
              : i.setAttribute(s, n === !0 ? "" : String(n)));
    }
  if (e) for (const s of [].concat(e)) s != null && s !== !1 && i.append(s);
  return i;
}
function parseHudMarkup(r) {
  const t = document.createElement("template");
  return ((t.innerHTML = r.trim()), t.content.firstElementChild);
}
class CachedText {
  constructor(t) {
    ((this.el = t), (this.v = void 0));
  }
  set(t) {
    t !== this.v && ((this.v = t), (this.el.textContent = t));
  }
}
class CachedDomProperty {
  constructor(t, e, i) {
    ((this.el = t), (this.kind = e), (this.name = i), (this.v = void 0));
  }
  set(t) {
    if (t === this.v) return;
    this.v = t;
    const { el: e, kind: i, name: s } = this;
    i === "var"
      ? e.style.setProperty(s, t)
      : i === "attr"
        ? e.setAttribute(s, t)
        : i === "style"
          ? (e.style[s] = t)
          : i === "class" && e.classList.toggle(s, !!t);
  }
}
const hudStorage = {
  get(r, t = null) {
    try {
      const e = window.localStorage.getItem(r);
      return e === null ? t : JSON.parse(e);
    } catch {
      return t;
    }
  },
  set(r, t) {
    try {
      window.localStorage.setItem(r, JSON.stringify(t));
    } catch {}
  },
};
function bindHudDrag(
  r,
  { onDown: t, onDrag: e, onUp: i, slop: s = 4, immediate: n = !1 } = {},
) {
  let o = null,
    a = 0,
    l = 0,
    c = !1,
    h = null;
  (r.addEventListener("pointerdown", (u) => {
    if (
      o === null &&
      !(u.pointerType === "mouse" && u.button !== 0) &&
      ((h = r.getBoundingClientRect()), !(t && t(u, h) === !1))
    ) {
      ((o = u.pointerId), (a = u.clientX), (l = u.clientY), (c = !1));
      try {
        r.setPointerCapture(o);
      } catch {}
      (u.preventDefault(), n && ((c = !0), e?.(u, h, !0)));
    }
  }),
    r.addEventListener("pointermove", (u) => {
      if (u.pointerId !== o) return;
      let d = !1;
      (!c &&
        Math.hypot(u.clientX - a, u.clientY - l) > s &&
        ((c = !0), (d = !0)),
        c && e?.(u, h, d));
    }));
  const f = (u, d) => {
    if (u.pointerId === o) {
      o = null;
      try {
        r.releasePointerCapture(u.pointerId);
      } catch {}
      (i?.(u, h, c, d), (c = !1));
    }
  };
  return (
    r.addEventListener("pointerup", (u) => f(u, !1)),
    r.addEventListener("pointercancel", (u) => f(u, !0)),
    r.addEventListener("lostpointercapture", (u) => {
      u.pointerId === o && f(u, !0);
    }),
    {
      get active() {
        return o !== null;
      },
    }
  );
}
function vibrateHud(r = 6) {
  try {
    navigator.vibrate?.(r);
  } catch {}
}
function playHudSound(r, t, e) {
  try {
    r.audio?.play?.(t, e);
  } catch {}
}
function linearColorToCssRgb(r, t = 0) {
  const e = (i) => {
    i = Math.max(0, i);
    const s = i <= 0.0031308 ? i * 12.92 : 1.055 * Math.pow(i, 1 / 2.4) - 0.055;
    return Math.round(clampHud(s + t, 0, 1) * 255);
  };
  return `${e(r.r)} ${e(r.g)} ${e(r.b)}`;
}
export {
  CachedDomProperty,
  CachedText,
  bindHudDrag,
  clampHud,
  createHudElement,
  hudNow,
  hudStorage,
  linearColorToCssRgb,
  parseHudMarkup,
  playHudSound,
  positiveModuloHud,
  vibrateHud,
  wrapSignedHud,
};
