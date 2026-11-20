# How to Talk to Your Experts

A quick guide to using the 26-agent team in this project. For the full team list, see [expert-roster.md](expert-roster.md); for how the team works, see [CLAUDE.md](../CLAUDE.md).

Start Claude Code in this project folder (`claude`), then type any of the prompts below.

---

## 1. Ask the whole team (through the orchestrator)

The `orchestrator` reads your question, picks the right experts, runs them in parallel, has them build on each other's work, sends big decisions to the red team, and gives you **one combined answer**.

Three ways to reach it:

**a) @-mention it** (most reliable for one question):

```
@agent-orchestrator Should we open a seated café or start with a walk-up window?
```

**b) Ask by name in plain English:**

```
Use the orchestrator to answer this: what's the smartest first step for us this month?
```

**c) Make the whole session the orchestrator** (every question goes to it):

```bash
claude --agent orchestrator
```

**Tip:** for simple questions the orchestrator may answer straight from the research instead of calling experts. If you want experts consulted, say so: *"Bring in the experts on this."*

---

## 2. Example prompts that make several experts work together

Each of these is written to pull in several experts and get back one coordinated answer.

### Example 1 — Evaluate a real space before signing

```
@agent-orchestrator We've been offered a 1,100 sq ft second-generation café space
in Coral Gables near the University of Miami: $58/sq ft base plus $20 NNN, 5-year
lease, 3% annual increases, 2 months free rent, no TI allowance, personal guarantee
required. Should we sign? Bring in the experts and tell me what to negotiate.
```

**Likely experts:** real-estate-advisor, market-research-analyst, competitive-intel-analyst, financial-modeling-analyst, business-attorney, permitting-specialist, then red-team-reviewer.
**You get:** go / no-go, what the rent does to break-even, competition nearby, lease terms to push back on, permit red flags, and the worst case.

### Example 2 — Choose the format and budget

```
@agent-orchestrator We have about $350,000 of our own money and could borrow
more. Compare three options: (1) a seated café in Brickell, (2) a walk-up
ventanita-style window in Little Havana or Allapattah, (3) a coffee trailer to
test the concept first. Which should we do, how much will it really cost, and
how would we fund it?
```

**Likely experts:** coffee-business-strategist, financial-modeling-analyst, funding-advisor, real-estate-advisor, latin-market-advisor, then red-team-reviewer.
**You get:** a side-by-side comparison, total cost and break-even for each, funding mix (owner cash vs. SBA loan), and one recommendation.

### Example 3 — Design the concept, menu, and brand

```
@agent-orchestrator Develop our concept: specialty coffee with Miami/Cuban roots.
I want a draft menu with prices that hit our cost targets, three name ideas that
work in English and Spanish, and a roaster recommendation. Make sure it feels
authentic to Miami, not a cliché.
```

**Likely experts:** coffee-business-strategist, latin-market-advisor, menu-beverage-developer, head-of-coffee, brand-creative-director, financial-modeling-analyst.
**You get:** concept statement, priced menu with cost-of-goods check, name options with availability checks to run, roaster shortlist, and cultural-fit notes.

### Example 4 — Build the opening plan

```
@agent-orchestrator Assume we sign a lease on January 15, 2027 for a
second-generation café space in the City of Miami. Build the full plan to
opening day: permits in the right order, build-out, equipment, hiring and
training, tech setup, hurricane-season readiness, and the launch marketing
calendar. Who does what, by when, and what's the earliest realistic opening date?
```

**Likely experts:** engagement-lead, permitting-specialist, buildout-design-advisor, equipment-specialist, hr-talent-advisor, restaurant-tech-specialist, insurance-risk-manager, digital-marketer, community-pr-manager.
**You get:** a week-by-week timeline with the critical path, owners, the rent-vs-opening gap, and a launch calendar. Long plans are saved under `deliverables/plan/`.

---

## 3. Ask one specific expert

Use this when the question sits in one area. It's faster and cheaper than the whole team.

**@-mention the expert** (type `@` and pick from the list, or type it out):

```
@agent-permitting-specialist What licenses and permits does a café with 20 seats
need in Coral Gables, and in what order?
```

```
@agent-financial-modeling-analyst Rebuild the break-even if the average ticket is
$9.50 instead of $8.25 and rent is $9,500 a month.
```

```
@agent-head-of-coffee Compare buying from a local Miami roaster versus roasting
in-house in year one.
```

**Or ask by name in plain English:**

```
Ask the business-attorney to review the lease terms I'm pasting below and flag the risky ones.
```

**Or start a whole session with one expert:**

```bash
claude --agent real-estate-advisor
```

Experts stay in their own area. If your question touches another area, they add a line like `HANDOFF → financial-modeling-analyst: ...`. Send that question to the named expert, or ask the orchestrator to handle it.

---

## 4. Give an expert your documents

Each agent has a folder, `knowledge/<agent-name>/`, that it reads before every answer. Drop in quotes, contracts, notes, or data exports, then ask as usual:

```
I put the landlord's LOI in knowledge/real-estate-advisor/. @agent-real-estate-advisor
Review it and tell me what to push back on.
```

Every agent also has a first name (Victor in real estate, Eleanor the attorney, Daniel in finance, Elena the orchestrator…). Names are listed in [agent-brains.md](agent-brains.md); to call an agent, still use its agent name, e.g. `@agent-real-estate-advisor`.

## 5. Other useful commands

| What you want | Type |
|---|---|
| Project status and next steps | `@agent-engagement-lead What should we focus on this week?` |
| Stress-test a decision | `@agent-red-team-reviewer Here's our plan: ... What could go wrong?` |
| Use a skill directly (no agent) | `/site-scoring`, `/lease-analysis`, `/financial-modeling`, `/menu-development` |
| Record a decision | `@agent-engagement-lead Log this decision: we're going with a walk-up window format.` |
| Add a new expert | `@agent-agent-builder Add a catering and wholesale expert to the team.` |
| Fix an expert | `@agent-agent-builder The menu developer keeps forgetting allergens. Fix it.` |
| Check the team is valid | `python3 scripts/validate_team.py` (run in the terminal) |

## Tips for good answers

1. **Give real numbers** (rent, square feet, budget, address or neighborhood) when you have them. The experts fall back on the November 2026 research when you don't.
2. **Say what you want back:** "a yes/no," "a comparison table," "a one-page plan."
3. **Record decisions** with the engagement lead so the team stops re-debating them.
4. **Check before acting:** legal, tax, insurance, and permit answers are general information. Confirm with a licensed professional or the agency.
