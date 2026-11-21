---
name: apple-color-dark-mode
description: "Semantic color tokens in the Apple style for light, dark, and increased-contrast modes, tuned to pass WCAG contrast on the web. Use for any color, theme, dark mode, or contrast decision."
---

# Apple-style semantic color (light, dark, increased contrast)

Source: HIG Color (https://developer.apple.com/design/human-interface-guidelines/color) and Accessibility.

## Rules (HIG)

- Name colors by purpose: label, secondary label, background, separator, link, accent — "semantically defined by its purpose, rather than its appearance."
- "Make sure all your app's colors work well in light, dark, and increased contrast contexts," with "an increased contrast option for each variant."
- "Avoid using the same color to mean different things."
- "Avoid relying solely on color" — pair with shape, icon, or text.
- Glass "has no inherent color"; color it sparingly.

## Tokens

Apple's UIKit colors are the starting point, **adjusted where the web needs WCAG 4.5:1 for small text** (e.g. UIKit light `#007AFF` blue is only 4.0:1 on white and 60% secondary label is 3.4:1 — fine at iOS sizes with Apple's rendering, not enough for a web body text audit).

```css
:root {
  color-scheme: light dark;
  --bg: #ffffff;              --bg-grouped: #f2f2f7;      --bg-elevated: #ffffff;
  --label: #000000;           --label-secondary: #6c6c70; /* 5.2:1 on white, 4.7:1 on #f2f2f7 */
  --label-tertiary: #8e8e93;  /* 3.3:1 — large text/icons only */
  --separator: #c6c6c8;       --separator-strong: #8e8e93;
  --accent: #0066cc;          /* 5.6:1 on white (UIKit #007AFF is 4.0:1) */
  --accent-fill: #007aff;     /* button fill with white bold label ≥ 3:1 only if text is large/bold; prefer --accent */
  --on-accent: #ffffff;
  --accent-on-tint: #0066cc;  /* selected item text on an accent-tinted pill */
  --success: #248a3d; --warning: #b25000; --danger: #d70015;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;            --bg-grouped: #1c1c1e;      --bg-elevated: #1c1c1e;
    --label: #ffffff;         --label-secondary: #98989d; /* 5.9:1 on #1c1c1e */
    --label-tertiary: #6c6c70;
    --separator: #38383a;     --separator-strong: #636366;
    --accent: #0a84ff;        /* 4.7:1 on #1c1c1e, 5.8:1 on black */
    --success: #30d158; --warning: #ff9f0a; --danger: #ff453a;
    --accent-on-tint: #5eb1ff; /* #0a84ff on a 22% blue pill is only 3.8:1; this is ~6:1 */
  }
}
@media (prefers-contrast: more) {
  :root { --label-secondary: #3a3a3c; --separator: #000000; --accent: #0040dd; }   /* #0040DD = UIKit increased-contrast blue, 7.6:1 */
}
@media (prefers-contrast: more) and (prefers-color-scheme: dark) {
  :root { --label-secondary: #d1d1d6; --separator: #ffffff; --accent: #409cff; }
}
```

Use only tokens in components. Verify every text/background pair with a contrast checker in **all four** modes (light, dark, light+more, dark+more). Record results in a table: pair, ratio, pass/fail.

## Dark mode notes

- True black page (`#000`) with elevated surfaces (`#1c1c1e`, `#2c2c2e`) to show depth instead of shadows.
- Desaturate and lighten accents in dark mode (as the tokens do).
- Images/illustrations: check they don't glare in dark mode.
