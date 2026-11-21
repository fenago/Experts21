---
name: usability-heuristic-review
description: "Review a screen or flow against usability heuristics and produce a ranked list of problems with severity, evidence, and concrete fixes. Use for usability reviews, UX audits, or 'what's wrong with this screen'."
---

# Usability heuristic review

## Heuristics to check (Nielsen's 10, adapted)

1. **Visibility of system status** — does the user always know what's happening (loading, streaming, which expert is working, errors)?
2. **Match with the real world** — the user's words (consultant, lease, rent), not internal ones (orchestrator, NDJSON, agent IDs).
3. **User control and freedom** — stop, undo, start over, go back; nothing traps the user.
4. **Consistency and standards** — platform conventions (Apple HIG navigation, controls, wording); same thing looks and works the same everywhere.
5. **Error prevention** — confirm costly actions, disable impossible ones, sensible defaults.
6. **Recognition over recall** — show options and examples instead of making people remember.
7. **Flexibility and efficiency** — shortcuts for repeat users (Enter to send, keyboard navigation) without hurting beginners.
8. **Aesthetic and minimalist design** — every element earns its place; content first.
9. **Help users recover from errors** — plain-language error messages that say what happened and what to do next.
10. **Help and documentation** — just-in-time hints, examples, empty states that teach.

Add for this team: **trust and safety** (it's clear answers are general information, costs are visible, sources are cited).

## Severity scale

| Rating | Meaning |
|---|---|
| 4 Critical | Blocks a task or excludes a group of users (e.g. accessibility failure) |
| 3 Major | Causes errors, confusion, or abandonment for many users |
| 2 Minor | Slows people down or annoys them |
| 1 Cosmetic | Polish |

Rank by severity × how often it happens × how many users it affects.

## Method

1. Define 3–5 key tasks (e.g. "ask one expert a question", "ask the whole team", "find an expert", "recover from an error", "use it on a phone").
2. Walk each task screen by screen; note every problem with evidence (file:line, screenshot, exact text).
3. Check accessibility separately with `accessibility-audit`; carry the failures into the ranking.
4. Write fixes that are specific and buildable ("Replace 'Request failed (502)' with 'Elena couldn't reach the experts. Try again.' and a Retry button") — not "improve errors".

## Output

| # | Problem | Heuristic | Severity | Evidence | Fix | Effort (S/M/L) |
|---|---|---|---|---|---|---|

Then: top 3 quick wins, what's working well (keep it), and open questions for usability testing with real users.
