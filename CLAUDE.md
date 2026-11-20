# Experts21 — Miami Specialty Coffee Shop Expert Team

This project is a team of AI expert agents advising a consultant, working for Dr. Lee, on opening a specialty coffee shop in Miami, Florida. There is no application code: the work is research, analysis, and recommendations.

## Layout

| Path | What it is |
|---|---|
| `docs/` | Research pack (Nov 2026): market, customers, competitors, costs, permits, staffing, marketing, risks, sources. Start at `docs/README.md` |
| `docs/expert-roster.md` | Every agent, its job, and which skills it uses |
| `docs/how-to-talk-to-your-experts.md` | Example prompts for one expert or the whole team |
| `docs/agent-brains.md` | Each agent's model (opus/sonnet/haiku), first name, voice, and working style |
| `knowledge/<agent-name>/` | Each agent's own documents; the agent reads its folder before every answer |
| `docs/decision-log.md` | Decisions made and pending. Check before advising; don't reopen settled decisions without new evidence |
| `.claude/agents/` | 26 project subagents (24 experts + orchestrator + agent builder) |
| `.claude/skills/` | 42 project skills (4 core + 38 specialist), preloaded into agents via each agent's `skills:` list |
| `deliverables/` | Agent outputs (models, plans, checklists) saved by topic |
| `scripts/validate_team.py` | Checks agents and skills are valid and wired correctly |
| `sdk/` | Node.js script that runs Victor (real-estate-advisor) with the Claude Agent SDK; see `sdk/README.md` |
| `scripts/export_agent_skill.py`, `exports/` | Package an agent as a standalone Claude skill (.zip) for upload to a Claude account |

## The team

| Area | Agents |
|---|---|
| Coordination | `orchestrator` (combines experts into one answer), `engagement-lead` (plan, timeline, decision log) |
| Strategy & market | `coffee-business-strategist`, `market-research-analyst`, `latin-market-advisor`, `competitive-intel-analyst` |
| Real estate & build-out | `real-estate-advisor`, `buildout-design-advisor` |
| Legal & compliance | `permitting-specialist`, `food-safety-specialist`, `business-attorney` |
| Finance & risk | `financial-modeling-analyst`, `funding-advisor`, `accounting-tax-advisor`, `insurance-risk-manager` |
| Coffee & product | `head-of-coffee`, `menu-beverage-developer` |
| Operations & people | `operations-manager`, `hr-talent-advisor` |
| Technical | `equipment-specialist`, `restaurant-tech-specialist` |
| Marketing | `brand-creative-director`, `digital-marketer`, `community-pr-manager` |
| Quality control | `red-team-reviewer` (stress-tests big decisions; read-only) |
| Team building | `agent-builder` (creates and improves agents and skills) |

Every agent has a first name and personality (Elena the orchestrator, Victor in real estate, Eleanor the attorney, Daniel in finance, Frank the red team…) and a model chosen for its work — see `docs/agent-brains.md`.

Only the `orchestrator` can call other agents; experts return `HANDOFF → agent-name: question` lines instead.

## How to use it

- **Questions that span several areas** (a site, a lease, the budget, the launch): delegate to the `orchestrator` subagent. It picks the experts, runs them in parallel, has them build on each other, sends big decisions to the red team, and returns one combined answer.
- **Single-area questions:** delegate to that expert directly, e.g. "Ask the permitting-specialist what a café in Coral Gables needs."
- **@-mention:** `@agent-orchestrator Should we take the Brickell space at $72/sq ft?`
- **Whole session as the orchestrator:** `claude --agent orchestrator`
- **Run a skill yourself:** `/site-scoring`, `/financial-modeling`, `/lease-analysis`, etc.
- **Give an expert documents:** drop files (quotes, contracts, notes) into `knowledge/<agent-name>/`; that agent reads them before every answer.
- **Grow or fix the team:** ask the `agent-builder` ("add a catering and wholesale expert", "the menu agent ignores allergens — fix it"). Then run `python3 scripts/validate_team.py`.

## Working rules (all agents)

1. Read your own `knowledge/<agent-name>/` folder first, then `docs/` and `docs/decision-log.md`, before researching elsewhere.
2. Cite every number with source and date; label estimates; never invent facts, prices, laws, or sources.
3. Lead with a recommendation in plain language (see the `recommendation-memo` skill).
4. Legal, tax, insurance, and permit answers are general information — say so and point to the licensed professional or agency.
5. Research is dated November 2026; flag anything that may have changed.
6. Keep Dr. Lee's and the consultant's personal details out of web searches and outside services.
7. After adding or editing agents or skills, update `docs/expert-roster.md`, `docs/agent-brains.md`, and `knowledge/`, and run `python3 scripts/validate_team.py`.
