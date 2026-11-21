---
name: accessibility-audit
description: "Audit a web UI for accessibility: 4.5:1 text contrast, 44px touch targets, 200% text zoom, keyboard and focus, labels, and the reduce motion, reduce transparency, and increase contrast settings (plus forced colors). Includes an automated Playwright + axe-core test recipe. Use before shipping any design and in every usability review."
---

# Accessibility audit

Sources: HIG Accessibility (https://developer.apple.com/design/human-interface-guidelines/accessibility), MDN prefers-reduced-motion / prefers-reduced-transparency / prefers-contrast, WCAG 2.2 AA.

## Pass criteria

| # | Check | Pass when |
|---|---|---|
| 1 | Text contrast | ≥ **4.5:1** for text under 18pt (24px) regular / 14pt (≈18.7px) bold; ≥ 3:1 for larger text (HIG cites WCAG AA). Check light, dark, and `prefers-contrast: more` |
| 2 | Non-text contrast | Icons, focus rings, control borders ≥ 3:1 against neighbors |
| 3 | Color not alone | Selection, errors, status also shown by shape, icon, weight, or text |
| 4 | Touch targets | Every interactive element ≥ **44×44 CSS px** (HIG iOS default 44×44pt) and spaced apart |
| 5 | Text zoom 200% | At 200% zoom (and with root font-size doubled) nothing is cut off, overlaps, or needs 2-D scrolling (except tables) — HIG: "at least 200 percent" |
| 6 | Reduce Motion | `@media (prefers-reduced-motion: reduce)` removes/replaces non-essential animation: no zoom/scale/parallax, no animating into/out of blur; fades instead of slides |
| 7 | Reduce Transparency | `@media (prefers-reduced-transparency: reduce)` makes glass solid, no `backdrop-filter` |
| 8 | Increase Contrast | `@media (prefers-contrast: more)` gives solid surfaces, stronger borders, darker secondary text |
| 9 | Forced colors | `@media (forced-colors: active)` keeps borders/focus visible using system colors |
| 10 | Keyboard | Everything reachable and operable by keyboard in a logical order; visible focus (`:focus-visible`) ≥ 3:1; no keyboard traps; Esc closes overlays |
| 11 | Names and roles | Landmarks (`header`, `nav`, `main`), one `h1`, buttons are `<button>`, icon-only controls have `aria-label`, current item has `aria-current` |
| 12 | Live updates | Streaming/status text in an `aria-live="polite"` region; errors announced |
| 13 | Language | `<html lang="en">`; Spanish passages get `lang="es"` |

Users turn these settings on in the OS: macOS System Settings › Accessibility › Display (Reduce transparency, Increase contrast) and › Motion (Reduce motion, macOS 26+); iOS Settings › Accessibility › Display & Text Size / Motion; Windows Settings › Accessibility (Transparency effects, Animation effects, Contrast themes).

## Automated recipe (Playwright + axe-core)

```js
// node audit.mjs http://localhost:4173/options/a-liquid-glass.html
import { chromium } from "playwright";
import fs from "node:fs";
import { createRequire } from "node:module";
const axe = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8"); // npm i axe-core
const page = await (await chromium.launch()).newPage({ viewport: { width: 1280, height: 860 } });
for (const media of [{}, { colorScheme: "dark" }, { contrast: "more" }, { reducedMotion: "reduce" }, { forcedColors: "active" }]) {
  await page.emulateMedia(media);
  await page.goto(process.argv[2]);
  await page.addScriptTag({ content: axe });
  const r = await page.evaluate(() => axe.run({ runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] }));
  console.log(JSON.stringify(media), r.violations.map((v) => `${v.id} (${v.nodes.length})`));
  // 44px targets
  const small = await page.$$eval("a, button, [role=button], input, textarea, select", (els) =>
    els.filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.width < 44 || b.height < 44); }).map((e) => e.outerHTML.slice(0, 80)));
  console.log("targets < 44px:", small);
}
// Reduce transparency: Playwright can't emulate it yet — check the CSS has the media query, then
// verify by temporarily applying the reduced styles (e.g. add a class that mirrors the media block).
// 200% text: page.setViewportSize({width: 640, ...}) at 2x zoom equivalent, or set html{font-size:200%} and screenshot.
```

Also test by hand: keyboard-only pass, VoiceOver (macOS ⌘F5) quick pass, real phone.

## Output

| # | Check | Result | Evidence | Fix |
|---|---|---|---|---|

A design **passes** only when 1–11 pass in all modes. List anything not testable automatically and how you checked it.
