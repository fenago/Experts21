---
name: skill-authoring
description: "Create or improve Claude Code project skills in .claude/skills/, following the official format, and wire them to the agents that use them. Use when adding a capability or fixing a skill that gives poor results."
---

# Skill authoring

Official reference: https://code.claude.com/docs/en/skills

## File format

`.claude/skills/<skill-name>/SKILL.md` — YAML frontmatter, then instructions in Markdown. The directory name becomes `/skill-name`.

| Field | Use in this project |
|---|---|
| `name` | Same as the directory name (kebab-case) |
| `description` | Key use case first, then "Use when…". Combined with `when_to_use`, truncated at 1,536 characters. No angle brackets |
| `when_to_use` | Optional trigger phrases |
| `disable-model-invocation` | **Never set** on team skills — it blocks preloading into agents |
| `user-invocable: false` | Optional, for background-knowledge skills |
| `allowed-tools`, `context: fork`, `agent`, `paths` | Only with a clear reason |

## Writing rules

- Concise: preloaded skills are injected in full into every agent that lists them, so every line costs tokens. Keep `SKILL.md` well under 500 lines; move long reference material to a supporting file in the same folder and link it.
- State what to do (steps, checklists, formats, targets), not background essays.
- Tie numbers to `docs/` files; mark estimates.
- Put the most important instructions near the top.

## Wiring

1. Add the skill name to the `skills:` list of each agent that needs it (max 32 per agent).
2. Update the skill table in `docs/expert-roster.md` with its "used by" list.
3. Run `python3 scripts/validate_team.py`.

## Improving a skill

Look at a real output that went wrong → find the missing or unclear instruction → make the smallest change that fixes it → test by asking the agent a question that exercises it.
