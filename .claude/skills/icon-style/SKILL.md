---
name: icon-style
description: "Choose and use open-source icons in a clean, Apple-like line style (e.g. Lucide, Heroicons, Phosphor) with correct sizing, labels, and licensing. Never use Apple logos, SF Symbols, or Apple product imagery. Use whenever a design needs icons."
---

# Icon style

## Never

- **No SF Symbols** in web apps or non-Apple-platform work: Apple licenses them for designing apps on Apple platforms, not for websites (verify current terms at https://developer.apple.com/sf-symbols/ before any other use).
- **No Apple logo, Apple product images, or Apple trademarks** ("Liquid Glass" is fine as a description of a design direction, not as branding).
- No icon fonts copied from other products; no unlicensed icon packs.

## Use instead (open source, similar thin rounded-line look)

| Set | License (verify before shipping) | Notes |
|---|---|---|
| Lucide (lucide.dev) | ISC | Closest to SF-style line icons; fork of Feather |
| Heroicons (heroicons.com) | MIT | Outline 24px and solid 20px styles |
| Phosphor (phosphoricons.com) | MIT | Several weights (thin → bold) |

Keep the license notice: add a comment with the set name and license in the file where icons are inlined.

## How to use

1. **Inline SVG** (no external requests), `stroke="currentColor"` so icons follow text color and dark mode.
2. **Sizes**: 20px in lists/sidebars, 24px in tab bars and toolbars, stroke width 1.75–2 to match text weight.
3. **Hit target ≥ 44×44px** even when the icon is 20–24px (padding, not a bigger icon).
4. **Labels**: decorative icons next to text get `aria-hidden="true"`; icon-only buttons need `aria-label` (Apple: "Provide an accessibility label for every icon"). Tab bars show icon + text label.
5. **One style per screen**: don't mix outline and filled except to show selection (filled = selected is a common pattern).
6. **Meaning first**: prefer universally understood glyphs (house, chat bubble, person, gear, magnifying glass). Avatars with initials work better than abstract icons for people/agents.
