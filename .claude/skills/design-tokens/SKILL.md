---
name: design-tokens
description: "Define and use design tokens (CSS custom properties) for color, type, spacing, radius, elevation, materials, and motion, including light, dark, and increased-contrast values. Use when starting a design, restyling an app, or keeping several design options consistent."
---

# Design tokens

## Principles

1. **Name by role, not value**: `--label`, `--bg-elevated`, `--accent`, `--glass-bg` — never `--gray-300` in components.
2. **One source of truth**: tokens live in `:root`; components use only tokens.
3. **Every color token has light, dark, and increased-contrast values** (see `apple-color-dark-mode`).
4. **Accessibility preferences change tokens, not components**: `prefers-color-scheme`, `prefers-contrast: more`, `prefers-reduced-transparency: reduce`, `prefers-reduced-motion: reduce`.

## Token set (starter)

```css
:root {
  /* type — see apple-typography-web */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --text-body: 1.0625rem;      /* 17px */
  --leading-body: 1.4;
  /* spacing — 4px base, see apple-layout-spacing */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px; --space-8: 32px;
  /* radius */
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 20px; --radius-pill: 999px;
  /* hit targets */
  --target-min: 44px;
  /* motion */
  --dur-fast: 150ms; --dur-med: 250ms; --ease: cubic-bezier(.2, .8, .2, 1);
  /* materials — see liquid-glass-web */
  --glass-blur: 20px; --glass-saturate: 180%;
}
@media (prefers-reduced-motion: reduce) {
  :root { --dur-fast: 0ms; --dur-med: 0ms; }
}
```

Color tokens: see `apple-color-dark-mode`. Glass tokens: see `liquid-glass-web`.

## Deliverable

A `tokens.css` block (or a section at the top of each option page) plus a table: token, purpose, light, dark, increased contrast.
