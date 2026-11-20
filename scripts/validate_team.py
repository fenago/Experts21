#!/usr/bin/env python3
"""Validate the expert team: agents in .claude/agents/, skills in .claude/skills/.

Checks frontmatter format, required fields, naming, skill wiring, and limits
from the Claude Code docs (sub-agents and skills). Exit code 1 on any error.
Usage: python3 scripts/validate_team.py
"""
import os, re, sys

try:
    import yaml
except ImportError:  # minimal fallback for this project's simple frontmatter
    yaml = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENTS_DIR = os.path.join(ROOT, ".claude", "agents")
SKILLS_DIR = os.path.join(ROOT, ".claude", "skills")
ROSTER = os.path.join(ROOT, "docs", "expert-roster.md")
CORE = ["research-pack-lookup", "source-citation", "recommendation-memo", "assumptions-and-handoffs"]
NAME_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
errors, warnings = [], []


def simple_yaml(text):
    data, key = {}, None
    for line in text.splitlines():
        if not line.strip():
            continue
        if line.startswith("  - ") and key:
            data.setdefault(key, []).append(line[4:].strip())
        elif ":" in line:
            key, val = line.split(":", 1)
            key, val = key.strip(), val.strip()
            if val.startswith('"') and val.endswith('"'):
                val = val[1:-1].replace('\\"', '"')
            data[key] = val if val else []
    return data


def frontmatter(path):
    text = open(path, encoding="utf-8").read()
    if not text.startswith("---\n"):
        errors.append(f"{path}: opening --- must be the first line")
        return None, text
    end = text.find("\n---", 4)
    if end == -1:
        errors.append(f"{path}: no closing ---")
        return None, text
    raw = text[4:end]
    try:
        data = yaml.safe_load(raw) if yaml else simple_yaml(raw)
    except Exception as e:  # noqa: BLE001
        errors.append(f"{path}: YAML does not parse: {e}")
        return None, text
    return data or {}, text[end + 4:]


# ---- skills ----
skills = {}
for d in sorted(os.listdir(SKILLS_DIR)):
    path = os.path.join(SKILLS_DIR, d, "SKILL.md")
    if not os.path.isfile(path):
        errors.append(f"{SKILLS_DIR}/{d}: missing SKILL.md")
        continue
    fm, body = frontmatter(path)
    if fm is None:
        continue
    skills[d] = fm
    if not NAME_RE.match(d):
        errors.append(f"skill {d}: directory name must be kebab-case")
    if fm.get("name") and fm["name"] != d:
        errors.append(f"skill {d}: name '{fm['name']}' differs from directory name")
    desc = str(fm.get("description", "")) + " " + str(fm.get("when_to_use", ""))
    if not fm.get("description"):
        errors.append(f"skill {d}: missing description")
    if len(desc.strip()) > 1536:
        errors.append(f"skill {d}: description + when_to_use over 1,536 characters")
    if "<" in desc or ">" in desc:
        warnings.append(f"skill {d}: angle brackets in description display as &lt; &gt;")
    if str(fm.get("disable-model-invocation", "")).lower() in ("true", "yes", "on", "1"):
        warnings.append(f"skill {d}: disable-model-invocation blocks preloading into agents")
    lines = body.count("\n")
    if lines > 500:
        errors.append(f"skill {d}: SKILL.md over 500 lines ({lines})")

# ---- agents ----
agents, used = {}, {s: [] for s in skills}
desc_chars = 0
for f in sorted(os.listdir(AGENTS_DIR)):
    if not f.endswith(".md"):
        continue
    path = os.path.join(AGENTS_DIR, f)
    fm, body = frontmatter(path)
    if fm is None:
        continue
    name = fm.get("name")
    if not name:
        errors.append(f"agent {f}: missing name (Claude Code treats it as documentation)")
        continue
    if not NAME_RE.match(str(name)) or ":" in str(name):
        errors.append(f"agent {f}: name '{name}' must be kebab-case with no ':'")
    if name in agents:
        errors.append(f"agent {f}: duplicate name '{name}'")
    if f[:-3] != name:
        warnings.append(f"agent {f}: file name differs from name '{name}'")
    if not fm.get("description"):
        errors.append(f"agent {name}: missing description (Claude Code skips the file)")
    desc_chars += len(str(fm.get("description", "")))
    agents[name] = fm
    sk = fm.get("skills") or []
    if isinstance(sk, str):
        sk = [s.strip() for s in sk.split(",") if s.strip()]
    if len(sk) > 32:
        errors.append(f"agent {name}: more than 32 preloaded skills")
    for s in sk:
        if s not in skills:
            errors.append(f"agent {name}: skill '{s}' not found in .claude/skills/")
        else:
            used[s].append(name)
    if not body.strip():
        warnings.append(f"agent {name}: empty system prompt")

experts = [n for n in agents if n not in ("orchestrator", "agent-builder")]
for n in experts:
    sk = agents[n].get("skills") or []
    missing = [c for c in CORE if c not in sk]
    if missing:
        warnings.append(f"agent {n}: missing core skills {missing}")
    dis = str(agents[n].get("disallowedTools", ""))
    if "Agent" not in dis:
        warnings.append(f"agent {n}: experts should disallow Agent (only the orchestrator delegates)")

for s, who in used.items():
    if not who:
        warnings.append(f"skill {s}: not used by any agent")

if not 10 <= len(agents) <= 50:
    errors.append(f"team has {len(agents)} agents; target is 10–50")
if desc_chars > 40000:  # rough proxy for the ~15,000-token description budget
    warnings.append(f"agent descriptions total {desc_chars} characters; approaching the 15,000-token limit")

if os.path.isfile(ROSTER):
    roster = open(ROSTER, encoding="utf-8").read()
    for n in agents:
        if f"`{n}`" not in roster:
            warnings.append(f"agent {n}: not listed in docs/expert-roster.md")
    for s in skills:
        if f"`{s}`" not in roster:
            warnings.append(f"skill {s}: not listed in docs/expert-roster.md")

print(f"Agents: {len(agents)}  Skills: {len(skills)}  Agent description chars: {desc_chars}")
for w in warnings:
    print("WARNING:", w)
for e in errors:
    print("ERROR:", e)
print("OK" if not errors else f"{len(errors)} error(s)")
sys.exit(1 if errors else 0)
