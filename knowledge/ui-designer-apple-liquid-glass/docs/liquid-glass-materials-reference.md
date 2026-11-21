# Reference: Liquid Glass and materials (summary with links)

Source: Apple HIG Materials (https://developer.apple.com/design/human-interface-guidelines/materials) and Adopting Liquid Glass (https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass), read 2026-11-21; MDN backdrop-filter (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter). Full quotes in `../notes-official-sources.md`.

## The model: two layers

```
┌──────────── navigation & controls layer (Liquid Glass) ────────────┐
│  tab bar · sidebar · toolbar · popover · alert                      │
└─────────────────────────────────────────────────────────────────────┘
┌──────────── content layer (solid, standard materials) ──────────────┐
│  messages · answers · cards · lists · photos                        │
└─────────────────────────────────────────────────────────────────────┘
```

Glass floats above content "to help people focus on the underlying content." Content never becomes glass ("Don't use Liquid Glass in the content layer").

## Variants

| | Regular | Clear |
|---|---|---|
| Apple's words | "blurs and adjusts the luminosity of background content to maintain legibility" | "highly translucent" |
| Use for | Text-heavy controls: sidebars, popovers, alerts, tab bars | Controls over "visually rich backgrounds" (photos, video) |
| Bright background | — | "consider adding a dark dimming layer of 35% opacity" |
| Web recipe | `rgb(255 255 255 / .72)` + `blur(20px) saturate(180%)` | `rgb(255 255 255 / .12)` + `blur(8px)`, white text, dim layer |

## Do / don't

| Do | Don't |
|---|---|
| Glass for tab bars, sidebars, toolbars, popovers | Glass on chat bubbles, cards, answers, lists |
| One glass layer per region | Glass on glass |
| Color the control *background* for the primary action | Colorful labels on colorful backgrounds |
| Fade content under bars (scroll edge effect) | A solid stripe under every bar by default |
| Provide light, dark, and increased-contrast values | Hard-coded single-mode colors |
| Fallbacks: reduce transparency, increase contrast, forced colors, no backdrop-filter | Relying on glass alone for legibility |

## Web implementation notes

- `backdrop-filter` only shows through a transparent or partly transparent background (MDN). Add `-webkit-backdrop-filter` for older Safari.
- `prefers-reduced-transparency` is experimental (Chrome/Edge 118+) — keep `prefers-contrast: more` and `@supports` fallbacks too, and make the default pass contrast on its own.
- Blur is GPU work: keep glass to a few fixed elements; don't blur large scrolling areas.
- Under Reduce Motion, don't animate blur in or out.

Recipes and the legibility check: `.claude/skills/liquid-glass-web/SKILL.md`. Working example: `../examples/liquid-glass-tab-bar-and-sidebar.html`.
