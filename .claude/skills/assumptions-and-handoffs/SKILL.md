---
name: assumptions-and-handoffs
description: "State assumptions explicitly and hand questions outside your area to the right expert on the team. Use whenever an answer depends on unknowns or touches another expert's area."
---

# Assumptions and hand-offs

## Assumptions

- List each assumption that changes the answer, with the value you used and why: `Assumption: 1,200 sq ft site in Brickell, $60/sq ft base + $18 NNN (docs/05).`
- Prefer decisions in `docs/decision-log.md` over your own assumptions.
- If an unknown is critical (format, neighborhood, budget, concept, roasting, owner's role), say so and give the answer for the most likely case plus how it changes for the others.

## Stay in your lane

Answer your own area fully. For anything outside it, write a hand-off line instead of guessing:

```
HANDOFF → financial-modeling-analyst: What does a $70/sq ft rent do to break-even?
```

The orchestrator or engagement lead routes these. Do not call other agents yourself.

## Team directory

| Agent | Ask them about |
|---|---|
| `orchestrator` | Any question that needs more than one expert; returns one combined answer |
| `engagement-lead` | Project plan, timeline, decision log, status, what to do next |
| `coffee-business-strategist` | Concept, format, positioning, growth path |
| `market-research-analyst` | Market size, customer segments, surveys, concept tests |
| `latin-market-advisor` | Cuban/Latin coffee culture, Spanish-language fit, cultural authenticity |
| `competitive-intel-analyst` | Competitors near a site, pricing, gaps |
| `real-estate-advisor` | Sites, rents, lease offers, occupancy cost |
| `buildout-design-advisor` | Layout, construction scope, contractor bids, build timeline |
| `permitting-specialist` | State/county/city approvals and their order |
| `food-safety-specialist` | Food safety program, certifications, inspections |
| `business-attorney` | Entity, lease and contract terms, employment law |
| `financial-modeling-analyst` | Budget, P&L, cash flow, break-even, sensitivity |
| `funding-advisor` | SBA loans, investors, equipment financing, lender package |
| `accounting-tax-advisor` | Books, sales/payroll tax, filings |
| `insurance-risk-manager` | Insurance, risk register, hurricane plan |
| `head-of-coffee` | Roasters, green coffee, quality, coffee price risk |
| `menu-beverage-developer` | Menu, recipes, pricing, COGS |
| `operations-manager` | SOPs, inventory, staffing levels, service speed |
| `hr-talent-advisor` | Team structure, pay, hiring, training, retention |
| `equipment-specialist` | Espresso machines, grinders, water, ice, refrigeration |
| `restaurant-tech-specialist` | POS, online ordering, loyalty, scheduling, dashboards |
| `brand-creative-director` | Name, identity, packaging, in-store look |
| `digital-marketer` | Instagram, TikTok, Google profile, email/SMS, loyalty campaigns |
| `community-pr-manager` | Press, influencers, events, local partnerships |
| `red-team-reviewer` | Stress-testing any recommendation before a decision |
| `ui-designer-apple-liquid-glass` | Visual design of the app or café brand: Liquid Glass materials, type, color, dark mode, icons, motion; design options |
| `ux-designer-apple-hig` | Usability reviews, navigation and flows, empty/loading/error states and microcopy, accessibility audits |
| `agent-builder` | Creating or improving agents and skills on this team |
