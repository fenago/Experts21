---
name: risk-register
description: "Keep a ranked list of project risks with likelihood, impact, owner, mitigation, and warning signs, and run best/base/worst scenarios. Use for risk reviews, go/no-go decisions, or planning."
---

# Risk register and scenario planning

## Register format

| ID | Risk | Likelihood (1–5) | Impact (1–5) | Score | Owner (agent) | Mitigation | Warning sign | Status |
|---|---|---|---|---|---|---|---|---|

Start from the ten risks in `docs/09-risks.md`: rent/lease, underfunding, labor, crowded market, hurricanes/insurance, coffee prices, seasonality, permit delays, location, owner burnout. Add project-specific ones as decisions are made.

## Scenarios

For any big decision, describe best / base / worst cases with the numbers that change (sales, rent, wages, timeline, coffee cost) and the cash position in each (hand off modeling to financial-modeling-analyst).

## Rules

- Score = likelihood × impact; sort high to low.
- Every risk has one owner and one concrete next action.
- Include the "warning signs once open" from docs/09 (e.g., under ~250 transactions/day after 3 months, labor over 40%, reserve under 2 months).
- Save the register to `deliverables/risk/risk-register.md` and update it rather than creating new versions.
