---
name: apple-typography-web
description: "Apple-style typography for websites: the system font stack (-apple-system, BlinkMacSystemFont), never embedding SF Pro (its license forbids website use), a 17px body type scale in rem, weights, leading, and 200% text zoom. Use for any type decisions in web UI."
---

# Apple-style typography on the web

## Font: use the system stack — never embed SF Pro

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace; /* names the locally installed font only */
```

On Apple devices this renders the system font (San Francisco) **from the user's own device**; elsewhere it falls back to Segoe UI / Roboto.

**Never download, self-host, `@font-face`, or link SF Pro, SF Compact, SF Mono, or New York.** The license on https://developer.apple.com/fonts/ allows use "solely for creating mock-ups of user interfaces to be used in software products running on Apple's iOS, OS X or tvOS operating systems," and says: "You may not embed the Apple Font in any software programs or other products" and "you may not use the Apple Font to, create, develop, display or otherwise distribute any documentation, artwork, website content or any other work product." No Google Fonts look-alikes are needed either.

## Type scale (17px body, rem-based)

Based on Apple's iOS text styles at the default size (HIG Typography: iOS default 17pt, minimum 11pt; verify exact values in the HIG table). Use `rem` so browser text zoom scales everything.

| Token | Size | Weight | Line height | Use |
|---|---|---|---|---|
| `--text-large-title` | 2.125rem (34px) | 700 | 1.2 | Page title |
| `--text-title1` | 1.75rem (28px) | 700 | 1.2 | Screen title |
| `--text-title2` | 1.375rem (22px) | 700 | 1.25 | Section |
| `--text-title3` | 1.25rem (20px) | 600 | 1.25 | Card title |
| `--text-headline` | 1.0625rem (17px) | 600 | 1.3 | Row title, emphasized |
| `--text-body` | 1.0625rem (17px) | 400 | 1.45 | Body, chat text |
| `--text-callout` | 1rem (16px) | 400 | 1.4 | Secondary blocks |
| `--text-subhead` | 0.9375rem (15px) | 400 | 1.35 | Subtitles |
| `--text-footnote` | 0.8125rem (13px) | 400 | 1.35 | Metadata |
| `--text-caption` | 0.75rem (12px) | 400 | 1.3 | Badges, captions (min 11px) |

## Rules (HIG Typography)

- "In general, avoid light font weights" — use 400/500/600/700, not 100–300.
- "Minimize the number of typefaces" — one family (system), plus mono for code.
- "If you need to display three or more lines of text, avoid tight leading" — body line-height ≥ 1.4.
- "Make sure your app's layout adapts to all font sizes" — must work at **200% text size** (Apple Accessibility: "at least 200 percent"). No fixed heights on text containers; allow wrapping; stack instead of truncating; "Reduce the number of columns when the font size increases."
- Reading width 60–80 characters (`max-width: 70ch` for answers).
- Sentence case for labels and buttons; tabular numbers (`font-variant-numeric: tabular-nums`) in tables of figures.
