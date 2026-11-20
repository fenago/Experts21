---
name: agent-authoring
description: "Create or improve Claude Code project subagents for this team in .claude/agents/, following the official format and this project's conventions. Use when adding a new expert or fixing an existing one."
---

# Agent authoring

Official reference: https://code.claude.com/docs/en/sub-agents

## File format

`.claude/agents/<name>.md` — YAML frontmatter, then the system prompt in Markdown. The opening `---` must be the first line.

| Field | Use in this project |
|---|---|
| `name` (required) | kebab-case, unique, no `:` |
| `description` (required) | One or two sentences: what the expert does and when to use them. Keep short — all agent descriptions share a ~15,000-token budget |
| `skills` | YAML list of skills to preload (full content injected; max 32). Always include the 4 core skills |
| `disallowedTools` | Experts: `Agent` (only the orchestrator delegates). Read-only roles also `Write, Edit` |
| `tools` | Omit to inherit everything (preferred unless restricting) |
| `color` | One of red, blue, green, yellow, purple, orange, pink, cyan |
| `model` | Always set: `opus` (deep strategy, legal, finance, risk judgment), `sonnet` (most specialist work), or `haiku` (fast, simple lookups). See `docs/agent-brains.md` |
| `effort`, `maxTurns`, `memory` | Only when there is a clear reason |

Field names are case-sensitive camelCase; unknown fields are silently ignored. Files are picked up within seconds; no restart needed.

## Body template (match existing experts)

`# Title` · one-paragraph mission · **Who you are** (first name, voice, working style, sign-off) · **Focus areas** · **Questions you always ask** · **Deliverables** · **How you work** (step 1: read `knowledge/<name>/` every time; then docs, skills, hand-offs, memo) · **Guardrails**.

## After creating or changing an agent

1. Create `knowledge/<name>/README.md` listing what documents belong there, and add a row to `docs/agent-brains.md` (name, model, why, voice, style) and `knowledge/README.md`.
2. Add or update the row in `docs/expert-roster.md` (agents table and each skill's "used by").
3. Add the agent to the team table in `CLAUDE.md`, the routing table and directory in `.claude/skills/expert-routing/SKILL.md`, and the directory in `.claude/skills/assumptions-and-handoffs/SKILL.md`.
4. Run `python3 scripts/validate_team.py` and fix every error.
