---
name: design-options-board
description: "Build 2 or 3 genuinely different design options side by side, with the same real content, so the consultant can compare and choose. Use whenever a visual or UX direction is being decided, or the user asks for options, variations, or mockups."
---

# Design options board

## Rules

1. **2–3 options, never more.** Each option is a real direction (different material, density, or mood), not a color swap.
2. **Same real content in every option.** Use the actual app content (agent names, personas, models, the "Ask the whole team" entry, a real question and answer). No lorem ipsum, no fake names.
3. **Each option is a working page**, not a picture: semantic HTML + CSS, responsive (phone and desktop), keyboard usable.
4. **Every option passes the `accessibility-audit` skill** — including reduce transparency, increase contrast, and reduce motion — before you show it.
5. **One index page** links to all options with a one-line pitch, who it suits, and trade-offs.
6. **Recommend one** and say why; the user decides.

## Layout of a board

```
/options/index.html        ← overview: cards for A, B, C (name, pitch, best for, trade-offs, link)
/options/a-<slug>.html      ← Option A, full page
/options/b-<slug>.html      ← Option B
/options/c-<slug>.html      ← Option C
/options/shared.css         ← optional shared tokens/reset (each option may override)
```

Each option page carries a small, fixed "Option X of 3 · back to all options" link so reviewers can move between them, and a note that it is a static preview (buttons don't call the API).

## Per-option write-up (in the index and the memo)

| Field | Example |
|---|---|
| Name | Option A — Liquid Glass |
| Idea | Frosted floating tab bar and sidebar over content |
| Best for | Brand feel, modern Apple look |
| Trade-offs | Needs strong fallbacks; more GPU work |
| Accessibility | Passed: contrast, targets, zoom, reduce transparency/contrast/motion |

## Before you present

- Screenshot each option light and dark, phone and desktop, and look at them yourself.
- Check every option with the same content state (sidebar + an expert chat + a whole-team answer).
- Don't change the live app; options are separate static files.
