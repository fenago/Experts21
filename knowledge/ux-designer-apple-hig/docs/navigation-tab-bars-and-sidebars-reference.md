# Reference: navigation — tab bars and sidebars (summary with links)

Source: Apple HIG Tab bars (https://developer.apple.com/design/human-interface-guidelines/tab-bars), Sidebars (https://developer.apple.com/design/human-interface-guidelines/sidebars), Layout (https://developer.apple.com/design/human-interface-guidelines/layout), and Adopting Liquid Glass (https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass), read 2026-11-21.

## Which one?

| Situation | Use | Apple's words |
|---|---|---|
| Phone / narrow window | Tab bar at the bottom | "A tab bar floats above content at the bottom of the screen" |
| Wide window, many areas | Sidebar | "A sidebar requires a large amount of vertical and horizontal space" |
| Both | One IA, adapt by width | "Consider adapting your tab bar into a sidebar automatically"; "Determine layout based on size classes, not device type" |

## Tab bar rules

- Navigation only: "Use a tab bar to support navigation, not to provide actions."
- Always visible across sections; never disable or hide tabs — explain empty sections.
- Few tabs (aim ≤ 5); "Avoid overflow tabs."
- Icon + single-word label; filled icon for the selected tab; badges only for critical info.
- May minimize on scroll (don't animate this under Reduce Motion).

## Sidebar rules

- ≤ 2 levels of hierarchy; group titles are "succinct, descriptive labels."
- Don't hide it by default; let people show/hide it.
- Nothing critical at the bottom of the sidebar.
- Icons and their colors must serve a purpose.
- Can float on Liquid Glass; content extends beneath.

## Web checklist

- `<nav aria-label="…">` containing a list of links/buttons; current item has `aria-current="page"` and a non-color cue.
- Targets ≥ 44×44px; keyboard order matches visual order; overlay sidebars close with Esc and return focus.
- Same destinations, names, and order in the tab bar and sidebar.
