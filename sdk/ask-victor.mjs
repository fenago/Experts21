#!/usr/bin/env node
// Ask Victor (the real-estate-advisor agent) a question with the Claude Agent SDK.
//
//   node ask-victor.mjs "Should we sign the Brickell lease as written?"
//   node ask-victor.mjs --check          # load and verify everything, no API call
//
// Loads Victor's definition from ../.claude/agents/real-estate-advisor.md, the
// skills it lists from ../.claude/skills/, and every document in
// ../knowledge/real-estate-advisor/, then runs Victor as the main agent.

import { query } from "@anthropic-ai/claude-agent-sdk";
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AGENT = "real-estate-advisor";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEXT_EXT = new Set([".md", ".txt", ".csv", ".json"]);

function loadAgent() {
  const file = path.join(ROOT, ".claude", "agents", `${AGENT}.md`);
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  if (!data.name || !data.description) throw new Error(`${file}: missing name or description`);

  // Inline each listed skill so the methods are always in Victor's system prompt.
  const skills = (data.skills || []).map((name) => {
    const skillFile = path.join(ROOT, ".claude", "skills", name, "SKILL.md");
    if (!fs.existsSync(skillFile)) throw new Error(`Skill not found: ${skillFile}`);
    return { name, body: matter(fs.readFileSync(skillFile, "utf8")).content.trim() };
  });
  const toList = (v) => (Array.isArray(v) ? v : String(v || "").split(",")).map((s) => s.trim()).filter(Boolean);

  const prompt = [
    content.trim(),
    "## Your methods (preloaded skills)",
    ...skills.map((s) => `<skill name="${s.name}">\n${s.body}\n</skill>`),
  ].join("\n\n");

  return {
    file,
    name: data.name,
    persona: (content.match(/Your name is \*\*(.+?)\*\*/) || [])[1] || data.name,
    model: data.model || "sonnet",
    skills,
    definition: {
      description: data.description,
      prompt,
      model: data.model || "sonnet",
      disallowedTools: toList(data.disallowedTools),
    },
  };
}

function loadKnowledge() {
  const dir = path.join(ROOT, "knowledge", AGENT);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).sort() : [];
  return files.map((f) => {
    const rel = path.posix.join("knowledge", AGENT, f);
    const text = TEXT_EXT.has(path.extname(f).toLowerCase()) ? fs.readFileSync(path.join(dir, f), "utf8") : null;
    return { rel, text };
  });
}

function buildPrompt(question, knowledge) {
  const docs = knowledge
    .map((k) =>
      k.text !== null
        ? `<document path="${k.rel}">\n${k.text.trim()}\n</document>`
        : `<document path="${k.rel}">(binary file — open it with the Read tool)</document>`
    )
    .join("\n\n");
  return `Your knowledge folder (knowledge/${AGENT}/) is loaded below — treat it as already read.

${docs}

Question from the consultant:
${question}

Answer as a recommendation memo, end with a "Documents used" list, and sign it as yourself.`;
}

const args = process.argv.slice(2);
const check = args.includes("--check");
const question = args.filter((a) => a !== "--check").join(" ").trim();

const agent = loadAgent();
const knowledge = loadKnowledge();

console.error(`Agent:     ${agent.name} (${agent.persona}) from ${path.relative(ROOT, agent.file)}`);
console.error(`Model:     ${agent.model}`);
console.error(`Skills:    ${agent.skills.length} loaded (${agent.skills.map((s) => s.name).join(", ")})`);
console.error(`Knowledge: ${knowledge.length} file(s): ${knowledge.map((k) => k.rel).join(", ") || "none"}`);
console.error(`Prompt:    ${agent.definition.prompt.length.toLocaleString()} characters of system prompt`);

const options = {
  cwd: ROOT, // so Victor can read docs/ and knowledge/ with the Read tool
  settingSources: ["project"], // loads the project's CLAUDE.md and .claude/ settings
  agents: { [AGENT]: agent.definition }, // definition parsed from .claude/agents/
  agent: AGENT, // run Victor as the main agent
  model: agent.model,
  allowedTools: ["Read", "Glob", "Grep"], // read-only; auto-approved
  permissionMode: "dontAsk", // deny anything not allowed instead of prompting
};

if (check) {
  // Start the SDK with an empty input stream (no message is ever sent, so no model
  // call), confirm it registered Victor from the definition, then shut down.
  let release;
  const idle = new Promise((r) => (release = r));
  const noMessages = (async function* () { await idle; })();
  const q = query({ prompt: noMessages, options });
  try {
    const agents = await q.supportedAgents();
    const found = agents.find((a) => a.name === AGENT);
    if (!found) throw new Error(`SDK did not register '${AGENT}'. Saw: ${agents.map((a) => a.name).join(", ")}`);
    console.error(`SDK:       registered '${found.name}' — ${found.description}`);
    console.log("CHECK OK: Victor loads correctly. Set ANTHROPIC_API_KEY and pass a question to run him.");
  } finally {
    release();
    q.close?.();
  }
  process.exit(0);
}

if (!question) {
  console.error('\nUsage: node ask-victor.mjs "your question"   (or --check to test loading only)');
  process.exit(1);
}
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("\nANTHROPIC_API_KEY is not set. See sdk/README.md.");
  process.exit(1);
}

for await (const message of query({ prompt: buildPrompt(question, knowledge), options })) {
  if (message.type === "result") {
    if (message.subtype === "success") {
      console.log(message.result);
      const models = Object.keys(message.modelUsage || {}).join(", ");
      console.error(`\n[model: ${models || agent.model} | cost: $${(message.total_cost_usd ?? 0).toFixed(4)} | turns: ${message.num_turns}]`);
    } else {
      console.error(`Run ended without an answer: ${message.subtype}`);
      process.exit(1);
    }
  }
}
