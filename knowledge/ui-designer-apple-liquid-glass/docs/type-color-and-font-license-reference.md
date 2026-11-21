# Reference: typography, color, and the SF font license (summary with links)

Source: Apple HIG Typography (https://developer.apple.com/design/human-interface-guidelines/typography), Color (https://developer.apple.com/design/human-interface-guidelines/color), Accessibility (https://developer.apple.com/design/human-interface-guidelines/accessibility), and Apple Fonts (https://developer.apple.com/fonts/), read 2026-11-21.

## Fonts on websites

| Allowed | Not allowed |
|---|---|
| `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` (uses the font already on the visitor's device) | Downloading SF Pro / SF Compact / SF Mono / New York and serving them with `@font-face` |
| SF fonts in mock-ups of apps for Apple platforms (registered Apple Developers) | Using SF fonts for "website content or any other work product" (license) |

License quotes (https://developer.apple.com/fonts/): "You may not embed the Apple Font in any software programs or other products." / "you may not use the Apple Font to, create, develop, display or otherwise distribute any documentation, artwork, website content or any other work product."

## Type

- iOS default body **17pt** (minimum 11pt); macOS default 13pt. On the web use **17px body** (`1.0625rem`).
- Avoid light weights; one family; leading ≥ 1.4 for 3+ lines; must work at 200% text.
- Scale (17px body): 34 / 28 / 22 / 20 / 17 semibold / 17 / 16 / 15 / 13 / 12 px — see `.claude/skills/apple-typography-web/SKILL.md`.

## Color

- Semantic tokens by purpose (label, secondary label, background, separator, accent), each with light, dark, and increased-contrast values.
- Contrast: **4.5:1** text up to 17pt; **3:1** for 18pt+ or bold (HIG, citing WCAG AA).
- Don't rely on color alone. Use one meaning per color. Glass has no color of its own.

Web-tested values (computed contrast):

| Token | Light | Dark | Increased contrast (light / dark) |
|---|---|---|---|
| label | #000000 | #ffffff | same |
| label-secondary | #6c6c70 (5.2:1 on white) | #98989d (5.9:1 on #1c1c1e) | #3a3a3c / #d1d1d6 |
| accent / link | #0066cc (5.6:1) | #0a84ff (4.7:1 on #1c1c1e) | #0040dd (7.6:1) / #409cff |
| bg / grouped | #ffffff / #f2f2f7 | #000000 / #1c1c1e | — |

Apple's UIKit light blue `#007AFF` is only 4.0:1 on white and the 60% secondary label is 3.4:1, so the web tokens above are darker.
