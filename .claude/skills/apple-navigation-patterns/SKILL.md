---
name: apple-navigation-patterns
description: "Apple HIG navigation patterns for web apps: a tab bar on phones, a sidebar on desktop and tablets, how to adapt one into the other, labels, icons, selection, and what never to do (actions in tab bars, hidden sidebars, deep hierarchies). Use when designing or reviewing app navigation."
---

# Apple navigation patterns (web)

Sources: HIG Tab bars (https://developer.apple.com/design/human-interface-guidelines/tab-bars), Sidebars (https://developer.apple.com/design/human-interface-guidelines/sidebars), Adopting Liquid Glass.

## Phones: tab bar

- "Use a tab bar to support navigation, not to provide actions." Actions belong in a toolbar or on the screen.
- Bottom of the screen; with Liquid Glass it "floats above content at the bottom of the screen" on a glass background.
- **3–5 tabs**; "It's generally easier to navigate among fewer tabs"; "Avoid overflow tabs."
- "Include tab labels" — "Use single words whenever possible" — icon + label, always.
- "Make sure the tab bar is visible when people navigate to different sections."
- "Don't disable or hide tab bar buttons, even when their content is unavailable" — explain the empty section instead.
- Badges only for critical info. Selected tab: filled icon + accent color + `aria-current="page"` (not color alone).
- Optional: minimize the bar on scroll down, restore on scroll up (skip when `prefers-reduced-motion: reduce`).

## Desktop/tablet: sidebar

- A sidebar needs space; "Consider using a tab bar first" and adapt it into a sidebar at wide widths ("Consider adapting your tab bar into a sidebar automatically").
- Can "float above content in the Liquid Glass layer"; extend the content background beneath it.
- "Show no more than two levels of hierarchy"; title groups with "succinct, descriptive labels."
- "Avoid hiding the sidebar by default"; let people show/hide it.
- "Avoid putting critical information or actions at the bottom of a sidebar."
- Icons: familiar glyphs with a purpose; for people/agents, initials avatars work better.

## Adaptive pattern (one information architecture, two presentations)

```
< 700px   bottom tab bar (3–5 top-level destinations) + full-screen lists/detail
≥ 1024px  sidebar (same destinations as groups) + detail pane
between   sidebar as overlay, opened by a toolbar button; Esc closes; focus trapped while open
```

Keep the same destinations, order, and names in both. Mark the current destination with `aria-current`. Use `<nav aria-label="…">`. The tab bar is a list of links/buttons, each ≥ 44×44px.

## For the Experts app (example IA)

Tabs on phones: **Team** (ask the whole team) · **Experts** (list of 25, searchable) · **History** · **About**. Desktop sidebar: "Ask the whole team" at top, then expert groups (one level of grouping, two levels max).
