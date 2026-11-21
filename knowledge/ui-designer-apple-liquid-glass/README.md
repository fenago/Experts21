# Knowledge folder — Sable, Apple-Style UI Designer (Liquid Glass)

`ui-designer-apple-liquid-glass` reads **every file in this folder, including `docs/` and `examples/`, before answering any question**, and studies the `examples/` before any design work. Put documents here that only this expert needs, or that it needs more than the rest of the team.

## What's here

| File | What it is |
|---|---|
| `notes-official-sources.md` | Notes and verbatim quotes from Apple's HIG (Materials, Color, Typography, Layout, Accessibility, Tab bars, Sidebars), Adopting Liquid Glass, Apple's fonts license, and MDN, with links and coverage notes |
| `docs/liquid-glass-materials-reference.md` | One-page reference: content vs. navigation layer, regular vs. clear, do/don't, web implementation notes |
| `docs/type-color-and-font-license-reference.md` | One-page reference: system font stack and the SF font license, type scale, semantic colors with computed contrast |
| `examples/liquid-glass-tab-bar-and-sidebar.html` | **What good looks like:** annotated, working Liquid Glass tab bar (phones) and sidebar (wide screens) with reduce transparency, increase contrast, forced colors, and reduce motion fallbacks. Passes axe (WCAG AA) in light, dark, and increased contrast, with 44px targets |
| `examples/glass-legibility-good-vs-bad.html` | **Good vs. bad glass legibility**, with a live legibility check (glass composited over white and black) |

Open the HTML examples in a browser to see them; read the source for the numbered notes.

## What belongs here

- Brand assets and mood boards Dr. Lee approves (no Apple logos or SF fonts)
- Screenshots of designs to restyle, with notes
- Design feedback from Dr. Lee or the consultant
- Updated notes when Apple changes the HIG (with links and dates)

## What doesn't belong here

- Research for the whole team → `docs/`
- Outputs the agents produce → `deliverables/` (or `web/public/options/` for design previews)
- Passwords, account numbers, or sensitive personal data — this folder is pushed to GitHub
- Apple font files (SF Pro etc.) — their license forbids this use

## How to add a document

Drop the file in this folder (or `docs/` / `examples/`), name it `YYYY-MM-DD-short-topic.ext`, and add a line at the top saying where it came from and when.
