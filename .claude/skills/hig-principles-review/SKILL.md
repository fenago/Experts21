---
name: hig-principles-review
description: "Review a design against Apple Human Interface Guidelines principles: content first, clear hierarchy, consistency with platform conventions, restraint with materials and color, legibility, and accessibility. Use for design reviews, before shipping a redesign, or to check 'does this feel like Apple'."
---

# HIG principles review

Sources: HIG pages on Materials, Color, Typography, Layout, Accessibility, Tab bars, Sidebars, and Adopting Liquid Glass (links and notes in the designers' knowledge folders). Apple's classic themes — clarity, deference (content first), depth — and the Liquid Glass era's hierarchy, harmony, and consistency are good lenses; verify current wording on the HIG home page before quoting.

## Checklist (score each ✅ / ⚠️ / ❌ with evidence)

**Hierarchy and content first**
- The most important thing is "near the top and leading side"; one clear primary action per screen.
- Navigation and controls are a distinct layer *above* content; content is never on glass.
- Progressive disclosure hides secondary detail.

**Consistency (platform conventions)**
- Tab bar on phones for navigation only; sidebar on wide screens; ≤ 2 levels of hierarchy.
- Standard control shapes and spacing; concentric radii.
- Same thing looks and behaves the same everywhere.

**Restraint (harmony)**
- Glass used sparingly, never stacked; color used sparingly and with one meaning per color.
- One typeface family; no light weights.

**Legibility**
- Body 17px; line-height ≥ 1.4; reading width ≤ ~70ch.
- Contrast passes in light, dark, and increased contrast (run `accessibility-audit`).

**Accessibility built in**
- 44px targets, 200% text, Reduce Motion, Reduce Transparency, Increase Contrast, keyboard, labels.

**Feedback and states**
- Every action has visible feedback; loading/empty/error states exist (see `states-and-microcopy`).

## Output

| Principle | Score | Evidence (file:line / screenshot) | Fix |
|---|---|---|---|

Finish with the 3 changes that would most improve the "Apple feel" without hurting usability.
