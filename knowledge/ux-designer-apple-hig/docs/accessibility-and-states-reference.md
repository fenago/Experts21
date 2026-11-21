# Reference: accessibility settings, targets, and states (summary with links)

Source: Apple HIG Accessibility (https://developer.apple.com/design/human-interface-guidelines/accessibility), Typography (https://developer.apple.com/design/human-interface-guidelines/typography), and MDN prefers-reduced-motion / prefers-reduced-transparency / prefers-contrast (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion and siblings), read 2026-11-21.

## Numbers to check

| Requirement | Value | Source |
|---|---|---|
| Text contrast | 4.5:1 up to 17pt; 3:1 at 18pt+ or bold | HIG Accessibility (WCAG AA) |
| Touch target | 44×44pt default on iOS (min 28×28) → 44×44 CSS px on the web | HIG Accessibility |
| Spacing around controls | ~12pt (bezeled) / ~24pt (unbezeled) | HIG Accessibility |
| Text enlargement | "at least 200 percent" | HIG Accessibility |
| Body text | 17pt default, 11pt minimum (iOS) | HIG Typography |

## System settings → CSS

| User setting | CSS | What the design must do |
|---|---|---|
| Reduce Motion | `@media (prefers-reduced-motion: reduce)` | Remove zoom/scale/parallax; fades instead of slides; no animating blur (HIG) |
| Reduce Transparency | `@media (prefers-reduced-transparency: reduce)` (experimental: Chrome/Edge 118+) | Solid surfaces instead of glass |
| Increase Contrast | `@media (prefers-contrast: more)` | Solid surfaces, stronger borders and secondary text |
| Windows contrast themes | `@media (forced-colors: active)` | Keep borders and focus visible with system colors |
| Dark Mode | `@media (prefers-color-scheme: dark)` | Dark tokens, all pairs still pass contrast |

## States every screen needs

Empty (teach with examples) · loading (named, specific progress) · streaming (readable while arriving, Stop button) · error (what happened, what to do, Retry, input kept) · partial failure (only the failed part marked) · success · offline/not configured · locked.

Status changes go in an `aria-live="polite"` region; errors are tied to the control with `aria-describedby`; never color alone.

See `../examples/states-good-vs-bad.md` for worked copy.
