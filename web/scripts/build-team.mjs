// Build-time step: read the team from this repository and write two generated files.
//
//   src/generated/team.json              -> browser: names, personalities, models (no prompts)
//   netlify/lib/generated/team-server.json -> Netlify Functions only: full system prompts
//
// Sources: ../.claude/agents/*.md, ../.claude/skills/*/SKILL.md, ../knowledge/<agent>/,
// ../docs/ (research pack), ../docs/expert-roster.md (domains).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(WEB, "..");
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");
const TEXT_EXT = new Set([".md", ".txt", ".csv", ".json"]);
const RESEARCH = [
  "README.md", "01-market-overview.md", "02-target-customers.md", "03-competitors.md",
  "04-startup-costs.md", "05-operating-costs.md", "06-permits-and-licenses.md", "07-staffing.md",
  "08-marketing.md", "09-risks.md", "10-sources.md", "decision-log.md",
];

const WEB_NOTE = `## Running in the Experts web app

You are answering inside a web chat app, not Claude Code. You have **no tools**: you can't read or write files, run code, call other agents, or search the web. Everything you would normally read is already included below in full: your preloaded skills, every document in your knowledge folder, and the research pack from docs/. Treat them as already read and cite them by path (for example \`knowledge/<agent>/file.md\` or \`docs/05-operating-costs.md\`). Work numbers out step by step in the answer. Where a fact needs checking online, say "not verified" and how to verify it. Where a method says to save a file to \`deliverables/\`, put the content in your answer instead. Use HANDOFF lines for other experts as usual; the consultant can ask them in the app. Keep answers focused: a memo of about 400 words unless the user asks for more.`;

// Domains from the roster table: | A06 | `real-estate-advisor` | **Title** | Domain | ...
const domains = {};
for (const line of read("docs", "expert-roster.md").split("\n")) {
  const m = line.match(/^\| A\d+ \| `([a-z0-9-]+)` \| \*\*.+?\*\* \| ([^|]+) \|/);
  if (m) domains[m[1]] = m[2].trim();
}

const research = RESEARCH.map((f) => `<document path="docs/${f}">\n${read("docs", f).trim()}\n</document>`).join("\n\n");

const agentFiles = fs.readdirSync(path.join(ROOT, ".claude", "agents")).filter((f) => f.endsWith(".md")).sort();
const publicTeam = [];
const serverTeam = {};

for (const file of agentFiles) {
  const { data, content } = matter(read(".claude", "agents", file));
  const name = data.name;
  const title = (content.match(/^# (.+)$/m) || [])[1] || name;
  const persona = (content.match(/Your name is \*\*(.+?)\*\*/) || [])[1] || title;
  const voice = (content.match(/- \*\*Voice:\*\* (.+)/) || [])[1] || "";
  const style = (content.match(/- \*\*Working style:\*\* (.+)/) || [])[1] || "";

  const skills = (data.skills || []).map((s) => {
    const body = matter(read(".claude", "skills", s, "SKILL.md")).content.trim();
    return `<skill name="${s}">\n${body}\n</skill>`;
  });

  const kdir = path.join(ROOT, "knowledge", name);
  const kfiles = fs.existsSync(kdir) ? fs.readdirSync(kdir).sort() : [];
  const knowledge = kfiles.map((f) => {
    const rel = `knowledge/${name}/${f}`;
    return TEXT_EXT.has(path.extname(f).toLowerCase())
      ? `<document path="${rel}">\n${fs.readFileSync(path.join(kdir, f), "utf8").trim()}\n</document>`
      : `<document path="${rel}">(binary file, not available in the web app)</document>`;
  });

  serverTeam[name] = {
    persona,
    title,
    model: data.model || "sonnet",
    system: [
      content.trim(),
      WEB_NOTE,
      "## Your preloaded skills",
      ...skills,
      `## Your knowledge folder (knowledge/${name}/)`,
      ...(knowledge.length ? knowledge : ["(empty)"]),
    ].join("\n\n"),
  };
  publicTeam.push({
    name,
    persona,
    title,
    domain: domains[name] || "Other",
    model: data.model || "sonnet",
    color: data.color || "blue",
    description: data.description,
    voice,
    style,
    knowledge: kfiles,
  });
}

if (!serverTeam.orchestrator) throw new Error("orchestrator agent not found in .claude/agents/");

const write = (rel, obj) => {
  const out = path.join(WEB, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(obj, null, 1) + "\n");
  return `${rel} (${Math.round(fs.statSync(out).size / 1024)} KB)`;
};
console.log(
  `Team: ${publicTeam.length} agents\n  ` +
    write("src/generated/team.json", publicTeam) + "\n  " +
    write("netlify/lib/generated/team-server.json", { research, agents: serverTeam })
);
