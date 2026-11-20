#!/usr/bin/env python3
"""Package one project agent as a standalone Claude skill for upload to claude.ai.

Builds exports/<export-name>/ with:
  SKILL.md      - frontmatter (name, description only) + the agent's personality,
                  instructions, and a map of the bundled files
  skills/       - the agent's preloaded skills, as reference files
  knowledge/    - the agent's knowledge folder
  research/     - the research pack from docs/ that the agent relies on
and zips it to exports/<export-name>.zip (folder at the zip root).

Usage: python3 scripts/export_agent_skill.py real-estate-advisor victor-real-estate-advisor
"""
import os, re, shutil, sys, zipfile

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESEARCH_FILES = [
    "README.md", "01-market-overview.md", "02-target-customers.md", "03-competitors.md",
    "04-startup-costs.md", "05-operating-costs.md", "06-permits-and-licenses.md",
    "07-staffing.md", "08-marketing.md", "09-risks.md", "10-sources.md", "decision-log.md",
]
# How to refer to other team agents when this skill runs alone.
ROLES = {
    "orchestrator": "a multi-expert review", "engagement-lead": "the project lead",
    "coffee-business-strategist": "a business strategist", "market-research-analyst": "a market researcher",
    "latin-market-advisor": "a Miami Latin market and culture advisor", "competitive-intel-analyst": "a competitive analyst",
    "real-estate-advisor": "a commercial real estate advisor", "buildout-design-advisor": "an architect or general contractor",
    "permitting-specialist": "a permit expediter or the city/county permitting office",
    "food-safety-specialist": "a food safety specialist or Florida DBPR", "business-attorney": "a licensed Florida attorney",
    "financial-modeling-analyst": "a financial analyst (or rebuild the model yourself with the financial-modeling method)",
    "funding-advisor": "a lender or SBA advisor", "accounting-tax-advisor": "a licensed CPA",
    "insurance-risk-manager": "a licensed independent insurance broker", "head-of-coffee": "a coffee roaster or head of coffee",
    "menu-beverage-developer": "a menu developer", "operations-manager": "an experienced café operator",
    "hr-talent-advisor": "an HR advisor", "equipment-specialist": "an equipment dealer or technician",
    "restaurant-tech-specialist": "a restaurant technology advisor", "brand-creative-director": "a brand designer",
    "digital-marketer": "a digital marketer", "community-pr-manager": "a PR or community manager",
    "red-team-reviewer": "an independent reviewer", "agent-builder": "the team maintainer",
}


def split_frontmatter(text):
    assert text.startswith("---\n")
    end = text.index("\n---", 4)
    return yaml.safe_load(text[4:end]), text[end + 4:].lstrip("\n")


def section(body, heading):
    m = re.search(rf"^## {re.escape(heading)}\n(.*?)(?=^## |\Z)", body, re.S | re.M)
    return m.group(1).strip() if m else ""


def localize(text, agent):
    text = text.replace(f"knowledge/{agent}/", "knowledge/").replace("knowledge/<your-agent-name>/", "knowledge/")
    text = text.replace("`docs/", "`research/").replace("(docs/", "(research/").replace(" docs/", " research/")
    text = re.sub(r"\(see `?research/expert-roster\.md`?\)", "", text)
    return "\n".join(l for l in text.splitlines() if not any(x in l for x in ("expert-roster", "agent-brains", "how-to-talk-to-your-experts"))) + "\n"


def main(agent, export_name, description=None):
    fm, body = split_frontmatter(open(os.path.join(ROOT, ".claude", "agents", agent + ".md")).read())
    title = re.search(r"^# (.+)$", body, re.M).group(1)
    intro = re.search(r"^# [^\n]+\n\n(.+?)\n\n", body, re.S | re.M).group(1)
    first = re.search(r"Your name is \*\*(.+?)\*\*", body).group(1)
    skills = fm.get("skills", [])

    out = os.path.join(ROOT, "exports", export_name)
    shutil.rmtree(out, ignore_errors=True)
    for d in ("skills", "knowledge", "research"):
        os.makedirs(os.path.join(out, d))

    # skills -> reference files (frontmatter removed so they aren't mistaken for separate skills)
    skill_rows = []
    for s in skills:
        sfm, sbody = split_frontmatter(open(os.path.join(ROOT, ".claude", "skills", s, "SKILL.md")).read())
        open(os.path.join(out, "skills", s + ".md"), "w").write(localize(sbody, agent))
        skill_rows.append(f"| [`skills/{s}.md`](skills/{s}.md) | {localize(sfm['description'], agent).strip()} |")

    kdir = os.path.join(ROOT, "knowledge", agent)
    kfiles = sorted(os.listdir(kdir))
    for f in kfiles:
        src = os.path.join(kdir, f)
        if f.endswith((".md", ".txt")):
            open(os.path.join(out, "knowledge", f), "w").write(localize(open(src).read(), agent))
        else:
            shutil.copy2(src, os.path.join(out, "knowledge", f))
    for f in RESEARCH_FILES:
        open(os.path.join(out, "research", f), "w").write(localize(open(os.path.join(ROOT, "docs", f)).read(), agent))

    desc = description or fm["description"]
    persona = localize(section(body, "Who you are"), agent)
    roles = "\n".join(f"| `{a}` | {r} |" for a, r in ROLES.items() if a != agent)
    skill_md = f"""---
name: {export_name}
description: {yaml.safe_dump(desc, width=10000).strip().removesuffix(chr(10) + '...')}
---

# {first} — {title}

When this skill is active, you are **{first}**, the {title}. {localize(intro.split('Miami, Florida. ', 1)[-1], agent).strip()} You advise a consultant (working for Dr. Lee) on opening a specialty coffee shop in Miami, Florida.

## Who you are

{persona.strip()}

## Focus areas

{localize(section(body, 'Focus areas'), agent).strip()}

## Questions you always ask

{section(body, 'Questions you always ask')}

## Deliverables

{section(body, 'Deliverables')}

## How you work

1. **Read `knowledge/` first — every time.** Open every file in this skill's `knowledge/` folder, plus any documents the user uploads in the conversation. They are newer and more specific than the research; when they conflict, prefer them and say so. Cite them like `(knowledge/file-name)`.
2. **Then the research pack** in `research/` (start with `research/README.md`; check `research/decision-log.md` for decisions already made). Follow [`skills/research-pack-lookup.md`](skills/research-pack-lookup.md). Research is dated November 2026.
3. **Use your methods.** Before answering, read the method files below that apply to the question, and follow them.
4. **Research only what's missing** (web search if available), and cite every number with source and date ([`skills/source-citation.md`](skills/source-citation.md)).
5. **Stay in your lane.** Answer your area fully. For anything outside it, end with "Get a second opinion from: …" naming the right professional (see the table below) and the exact question.
6. **Answer as a recommendation memo** ([`skills/recommendation-memo.md`](skills/recommendation-memo.md)): bottom line first, then reasons, numbers, risks, assumptions, next steps, and a "Documents used" list. Do calculations with code when available. Where a method says to save to `deliverables/…`, provide the file for download instead.

## Your methods (bundled skills)

| File | Use it for |
|---|---|
{chr(10).join(skill_rows)}

## Bundled documents

| Folder | Contents |
|---|---|
| `knowledge/` | {', '.join(f'`{f}`' for f in kfiles)} |
| `research/` | Miami coffee shop research pack: {', '.join(f'`{f}`' for f in RESEARCH_FILES)} |

## Other experts mentioned in these files

This skill was exported from a team of agents. When a file mentions another expert by agent name (for example in a HANDOFF line), recommend the matching professional instead:

| Agent name | Recommend |
|---|---|
{roles}

## Guardrails

{localize(section(body, 'Guardrails'), agent).strip()}
- This is general information, not legal, tax, insurance, or investment advice.
"""
    open(os.path.join(out, "SKILL.md"), "w").write(skill_md)

    # checks for claude.ai upload
    sfm, sbody = split_frontmatter(skill_md)
    assert set(sfm) == {"name", "description"}, sfm.keys()
    assert re.fullmatch(r"[a-z0-9-]{1,64}", sfm["name"]) and not re.search(r"claude|anthropic", sfm["name"])
    assert len(sfm["description"]) <= 1024 and "<" not in sfm["description"] and ">" not in sfm["description"]
    assert sbody.count("\n") < 500, "SKILL.md body too long"

    zpath = os.path.join(ROOT, "exports", export_name + ".zip")
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for dirpath, _, files in os.walk(out):
            for f in sorted(files):
                full = os.path.join(dirpath, f)
                z.write(full, os.path.relpath(full, os.path.join(ROOT, "exports")))
    print(f"Built {zpath} ({os.path.getsize(zpath)//1024} KB), {len(skills)} skills, {len(kfiles)} knowledge files, {len(RESEARCH_FILES)} research files")


if __name__ == "__main__":
    main(*sys.argv[1:4])
