# Financial modeling

Start from the illustrative model in `research/05-operating-costs.md` and replace assumptions with real quotes as they arrive.

## Core formulas

- Monthly sales = transactions/day × average ticket × days open
- Contribution margin = 1 − COGS % − card fees % (base: 1 − 0.30 − 0.03 = 67%)
- Break-even sales = fixed monthly costs ÷ contribution margin
- Loan payment = P × r ÷ (1 − (1 + r)^−n), r = annual rate ÷ 12, n = months
- Cash after debt = operating profit − loan payment
- DSCR = (operating profit + owner add-backs) ÷ annual debt service (lenders want ≥ 1.25)

## Base assumptions (research/05)

340 transactions/day, $8.25 ticket, COGS 30%, card 3%, hourly labor ~50 hrs/day × $17, manager $5,500/mo, payroll burden ~12%, rent + NNN $7,800, utilities $2,500, insurance $1,200, marketing $2,500, repairs $1,200, misc $1,500, loan $400K/10 yr/~10%.

## Always include

1. **Ramp-up:** months 1–6 at ~50/65/75/85/90/100% of steady-state sales (Estimate).
2. **Seasonality:** summer (Jun–Oct) ~15–25% below winter peak (Estimate; Miami tourist season Nov–Apr).
3. **Sensitivity table:** transactions ±20%, ticket ±$1, rent ±$2,000/mo, wage +$1/hr, COGS +3 pts.
4. **Scenarios:** best / base / worst, with the cash low point and months of runway.
5. **Sanity checks:** rent ≤ 10% of sales, labor 30–35%, COGS 25–32%, prime cost (COGS + labor) ≤ 65%.

Compute with code (Python) or a spreadsheet, never by hand. Show inputs and results in tables; save files to `deliverables/finance/`.
