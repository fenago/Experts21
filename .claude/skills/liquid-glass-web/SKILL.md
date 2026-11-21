---
name: liquid-glass-web
description: "CSS recipes for Apple-style Liquid Glass (glassmorphism) on the web: regular and clear variants, glass only on the navigation/controls layer and never on content, a 35% dim layer under clear glass over bright backgrounds, a legibility check, and fallbacks for reduce transparency, increase contrast, forced colors, and browsers without backdrop-filter. Use for any glass, frosted, or translucent UI."
---

# Liquid Glass on the web

Sources: Apple HIG Materials (https://developer.apple.com/design/human-interface-guidelines/materials), Adopting Liquid Glass (https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass), MDN backdrop-filter / prefers-reduced-transparency / prefers-contrast. Notes in `knowledge/ui-designer-apple-liquid-glass/`.

## The rules (from Apple)

1. **Glass is the navigation/controls layer only.** Liquid Glass "forms a distinct functional layer for controls and navigation elements — like tab bars and sidebars — that floats above the content layer." **"Don't use Liquid Glass in the content layer."** Chat messages, cards, answers, and lists are content: they stay solid.
2. **Sparingly.** "Use Liquid Glass effects sparingly"; "avoid overcrowding or layering Liquid Glass elements on top of each other." Never glass on glass.
3. **Regular variant** (default): "blurs and adjusts the luminosity of background content to maintain legibility." Use it for anything with a lot of text: sidebars, popovers, alerts, tab bars.
4. **Clear variant**: "highly translucent"; "Only use clear Liquid Glass for components that appear over visually rich backgrounds" (photos, video, art). Over bright content, "consider adding a dark dimming layer of 35% opacity."
5. **Color**: glass "has no inherent color"; "Apply color sparingly." Emphasize the primary action by tinting the control background, not its label.
6. **Legibility over scrolling content**: Apple uses a scroll-edge effect that blurs/fades content under bars. On the web, fade content under the bar with a gradient mask or a slightly thicker glass at the edge.

## Recipes

```css
:root {
  --glass-blur: 20px;
  --glass-sat: 180%;
  --glass-regular-bg: rgb(255 255 255 / 0.72);   /* light */
  --glass-regular-border: rgb(255 255 255 / 0.6);
  --glass-regular-edge: rgb(0 0 0 / 0.08);
  --glass-clear-bg: rgb(255 255 255 / 0.12);
  --glass-dim: rgb(0 0 0 / 0.35);                /* Apple: 35% dim under clear glass over bright content */
  --glass-solid: #f2f2f7;                         /* fallback when transparency is reduced */
  --glass-shadow: 0 8px 32px rgb(0 0 0 / 0.12), inset 0 1px 0 rgb(255 255 255 / 0.5);
}
@media (prefers-color-scheme: dark) {
  :root {
    --glass-regular-bg: rgb(28 28 30 / 0.72);
    --glass-regular-border: rgb(255 255 255 / 0.12);
    --glass-regular-edge: rgb(0 0 0 / 0.4);
    --glass-clear-bg: rgb(255 255 255 / 0.08);
    --glass-solid: #1c1c1e;
    --glass-shadow: 0 8px 32px rgb(0 0 0 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.08);
  }
}

/* Regular glass: tab bars, sidebars, toolbars, popovers */
.glass {
  background: var(--glass-regular-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat)); /* older Safari */
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  border: 1px solid var(--glass-regular-border);
  box-shadow: var(--glass-shadow);
}

/* Clear glass: only over visually rich media. Text on it is white. */
.glass-clear {
  position: relative;
  color: #fff;
  background: var(--glass-clear-bg);
  -webkit-backdrop-filter: blur(8px) saturate(160%);
  backdrop-filter: blur(8px) saturate(160%);
  isolation: isolate;
}
.glass-clear.over-bright::before {      /* the 35% dim layer, under the label */
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: var(--glass-dim); z-index: -1;
}

/* No backdrop-filter support: go solid */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass, .glass-clear { background: var(--glass-solid); color: inherit; }
}
/* Reduce Transparency (macOS/iOS/Windows setting): solid, no blur */
@media (prefers-reduced-transparency: reduce) {
  .glass, .glass-clear { background: var(--glass-solid); -webkit-backdrop-filter: none; backdrop-filter: none; color: inherit; }
  .glass-clear.over-bright::before { display: none; }
}
/* Increase Contrast: solid plus a strong edge */
@media (prefers-contrast: more) {
  .glass, .glass-clear { background: var(--glass-solid); -webkit-backdrop-filter: none; backdrop-filter: none; border: 2px solid currentColor; box-shadow: none; color: inherit; }
}
/* Windows High Contrast / forced colors */
@media (forced-colors: active) {
  .glass, .glass-clear { background: Canvas; color: CanvasText; border: 1px solid CanvasText; }
}
```

`prefers-reduced-transparency` is experimental with limited support (MDN: Chrome/Edge 118+; not Baseline), so **also** make sure the default glass passes the legibility check on its own, and keep the `prefers-contrast` and `@supports` fallbacks.

## Legibility check (do this for every glass surface)

1. Find the worst-case backgrounds that can sit under the glass: the brightest (often white) and darkest content that can scroll beneath it.
2. Treat the glass tint as alpha-composited over each worst case, **ignoring blur** (blur doesn't add contrast you can count on).
3. Text and icons on the glass must reach **4.5:1** (text under 18pt/24px regular) or **3:1** (large/bold text, icons, UI component edges) against **both**.
4. If it fails: increase the tint alpha (regular), raise the dim layer above 35% (clear), switch from clear to regular, or move the text off the glass.

Worked numbers (computed):

| Surface | Over white | Over black |
|---|---|---|
| Black text on white glass 72% | 21:1 | 10.6:1 ✅ |
| White text on dark glass `#1c1c1e` 72% | 6.7:1 ✅ | 18:1 |
| White text on dark glass 60% | **4.5:1 ⚠️ borderline fail** | — |
| White text on clear glass + 35% dim | **2.4:1 ❌** — 35% alone is not enough over white; use ≥ 55% dim or regular glass for text | — |

## Don'ts

- Don't put body text, chat answers, or cards on glass.
- Don't animate into or out of blur when `prefers-reduced-motion: reduce` (Apple: "Avoiding animating into and out of blurs").
- Don't stack glass on glass; don't use more than one glass layer per screen region.
- Don't rely on glass for meaning — selection and focus also need shape/weight changes.
