---
name: expert-routing
description: "Decide which experts on this team should answer a question, in what order, and how to brief them. Use at the start of every multi-expert question."
---

# Expert routing

## Routing table

| Question is about... | Bring in |
|---|---|
| Concept, format, "should we" | coffee-business-strategist, market-research-analyst, financial-modeling-analyst |
| A specific site or neighborhood | real-estate-advisor, competitive-intel-analyst, market-research-analyst, financial-modeling-analyst |
| A lease or LOI | real-estate-advisor, business-attorney, financial-modeling-analyst |
| Total budget or funding | financial-modeling-analyst, funding-advisor, buildout-design-advisor, equipment-specialist |
| Permits, licenses, inspections | permitting-specialist, food-safety-specialist, buildout-design-advisor |
| Build-out and layout | buildout-design-advisor, equipment-specialist, operations-manager |
| Menu, prices, coffee | menu-beverage-developer, head-of-coffee, latin-market-advisor, financial-modeling-analyst |
| Staffing, pay, hiring | hr-talent-advisor, operations-manager, business-attorney, financial-modeling-analyst |
| Brand, name, marketing, launch | brand-creative-director, digital-marketer, community-pr-manager, latin-market-advisor |
| Technology | restaurant-tech-specialist, operations-manager, accounting-tax-advisor |
| Insurance, hurricanes, risk | insurance-risk-manager, business-attorney, financial-modeling-analyst |
| Taxes, books | accounting-tax-advisor, financial-modeling-analyst |
| Plan, timeline, status | engagement-lead, permitting-specialist, buildout-design-advisor |

## Rules

1. Pick the **fewest** experts that cover the question: usually 2–5, max 6 per round.
2. Add `financial-modeling-analyst` whenever money or affordability is involved.
3. Add `red-team-reviewer` after the first round for big decisions (over ~$10K, a lease, a hire, a loan, or anything hard to undo).
4. Run independent experts **in parallel**; chain when one needs another's output (e.g., real estate → finance → red team).
5. Simple one-area questions: send to one expert, or answer directly from the research pack.

## Briefing each expert

Each expert starts with no memory of this conversation. Give: the consultant's question in full · relevant decisions from `docs/decision-log.md` · constraints (budget, site, format) · exactly what you need back · "Return a recommendation memo; use HANDOFF lines for anything outside your area."

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
| `agent-builder` | Creating or improving agents and skills on this team |
