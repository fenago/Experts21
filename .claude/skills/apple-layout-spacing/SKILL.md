---
name: apple-layout-spacing
description: "Apple-style layout and spacing for web apps: content-first hierarchy, a 4/8px spacing grid, margins, reading widths, safe areas, adaptive layouts by width (not device), and 44px touch targets. Use for page layout, spacing, responsive breakpoints, or density decisions."
---

# Apple-style layout and spacing

Source: HIG Layout (https://developer.apple.com/design/human-interface-guidelines/layout) and Accessibility.

## Rules (HIG)

- "Order content by relative importance" — most important "near the top and leading side."
- "Group related items"; "Use progressive disclosure" to keep layouts clean.
- "Use consistent spacing."
- "Determine layout based on size classes, not device type or orientation" → on the web: breakpoints by **container width**, not user agent.
- Controls float above content: "Instead of applying a solid or semi-opaque background color beneath controls, use a scroll edge effect"; extend backgrounds under sidebars, toolbars, and tab bars.
- "Be prepared for text-size changes" — layouts stack and grow; no fixed-height text boxes.
- macOS: "Avoid placing controls or critical information at the bottom of a window."

## Spacing scale

4px base: 4, 8, 12, 16, 20, 24, 32, 40, 48. Inside a component use 8–12; between components 16–24; between sections 32–48.

## Margins and widths

| Width | Layout | Side margin |
|---|---|---|
| < 700px (compact) | One column, bottom tab bar | 16px (20px on larger phones) |
| 700–1023px | Collapsible sidebar or tab bar | 24px |
| ≥ 1024px (regular) | Persistent sidebar (240–320px) + content | 32px |

- Reading width for chat/answers: `max-width: 70ch`.
- Respect safe areas: `padding-bottom: max(16px, env(safe-area-inset-bottom))` for bottom bars; add `viewport-fit=cover` to the viewport meta.

## Targets and spacing between controls (HIG Accessibility)

- Touch targets: default **44×44pt** on iOS/iPadOS (minimum 28×28) → on the web use **≥ 44×44 CSS px** for all tappable controls.
- "Consider spacing between controls as important as size": ~12pt padding around bezeled controls, ~24pt around unbezeled ones.

## Radii (concentric)

Apple asks to align control shapes with surrounding rounded elements (concentric corners): inner radius = outer radius − padding. E.g. a 20px-radius floating bar with 6px padding → 14px-radius selected pill.
