// Reconstructed module: identifiers and file boundaries are refactor choices.
import { createHudElement, parseHudMarkup } from "./dom.js";
import { HUD_ICONS, TOOL_DEFINITIONS } from "./icons.js";
class ToolBar {
  constructor(t, e, i) {
    ((this.ctx = t),
      (this.hud = e),
      (this.buttons = new Map()),
      (this.el = createHudElement("div", {
        class: "wg-panel wg-toolbar",
        role: "toolbar",
        "aria-label": "Tools",
      })),
      (this.puck = createHudElement("span", {
        class: "wg-puck",
        "aria-hidden": "true",
      })),
      this.el.append(this.puck));
    let s = "mouse";
    (this.el.addEventListener("pointerdown", (n) => {
      s = n.pointerType;
    }),
      TOOL_DEFINITIONS.forEach((n, o) => {
        const a = createHudElement(
            "span",
            {
              class: "wg-tip",
              role: "tooltip",
            },
            [
              createHudElement(
                "span",
                {
                  class: "wg-tip-head",
                },
                [
                  createHudElement("b", {
                    text: n.label,
                  }),
                  createHudElement("kbd", {
                    text: n.key,
                  }),
                ],
              ),
              createHudElement("span", {
                class: "wg-tip-body",
                text: n.desc,
              }),
            ],
          ),
          l = createHudElement(
            "button",
            {
              class: "wg-tool",
              type: "button",
              "data-tool": n.id,
              "aria-label": `${n.label} tool (${n.key}) — ${n.desc}`,
              "aria-pressed": "false",
            },
            [
              parseHudMarkup(HUD_ICONS[n.id]),
              createHudElement("span", {
                class: "wg-tool-label",
                text: n.label,
              }),
              a,
            ],
          );
        (l.style.setProperty("--n", o),
          l.addEventListener("click", () => {
            const c = this.ctx.input;
            if (c?.tool === n.id) {
              s !== "mouse" &&
                this.hud.toast(n.desc, 3200, {
                  icon: n.id,
                });
              return;
            }
            (c?.setTool?.(n.id),
              s !== "mouse" &&
                !this._explained?.has(n.id) &&
                ((this._explained ?? (this._explained = new Set())).add(n.id),
                this.hud.toast(n.desc, 3200, {
                  icon: n.id,
                })));
          }),
          this.buttons.set(n.id, l),
          this.el.append(l));
      }),
      i.append(this.el),
      (this.active = null),
      this.setActive(t.input?.tool || "hand"),
      t.events.on("tool", ({ tool: n } = {}) => this.setActive(n)));
  }
  setActive(t) {
    if (!this.buttons.has(t) || t === this.active) return;
    const e = this.buttons.get(this.active);
    e &&
      (e.classList.remove("is-active"),
      e.setAttribute("aria-pressed", "false"));
    const i = this.buttons.get(t);
    (i.classList.add("is-active"), i.setAttribute("aria-pressed", "true"));
    const s = TOOL_DEFINITIONS.findIndex((n) => n.id === t);
    (this.el.style.setProperty("--i", s),
      this.active !== null &&
        (i.classList.remove("is-popping"),
        this.puck.classList.remove("is-moving"),
        i.offsetWidth,
        i.classList.add("is-popping"),
        this.puck.classList.add("is-moving")),
      (this.active = t));
  }
  button(t) {
    return this.buttons.get(t);
  }
}
export { ToolBar };
