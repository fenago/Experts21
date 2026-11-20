// POST /api/synthesize  { question, plan, answers: [{agent, text}], redTeam?: "..." }
// Elena (the orchestrator) combines the experts' memos into one answer (streamed NDJSON).
import { AGENTS, readRequest, streamAgent, json } from "../lib/claude.mjs";

const SYNTHESIS = `

## Web app: synthesis step

The experts have already answered; their memos are in the user message. Don't call anyone. Combine them with your synthesis-decision-tracking skill and answer in your output format: credit each expert by first name and agent, show where they disagreed and how you resolved it, keep the numbers consistent, and fold in the red-team review if there is one. Keep it under about 600 words.`;

const clip = (s, n) => (typeof s === "string" ? s.trim().slice(0, n) : "");

export default async (req) => {
  const { body, error } = await readRequest(req);
  if (error) return error;
  const question = clip(body.question, 20_000);
  const answers = Array.isArray(body.answers) ? body.answers.slice(0, 6) : [];
  if (!question || !answers.length) return json(400, { error: "question and answers are required." });

  const memos = answers
    .filter((a) => AGENTS[a?.agent])
    .map((a) => `<memo agent="${a.agent}" name="${AGENTS[a.agent].persona}">\n${clip(a.text, 15_000) || "(no answer: this expert's call failed)"}\n</memo>`)
    .join("\n\n");
  const red = clip(body.redTeam, 15_000);

  const content = `Consultant's question:\n${question}\n\nYour routing plan: ${clip(body.plan, 2_000)}\n\n${memos}${
    red ? `\n\n<red_team_review name="${AGENTS["red-team-reviewer"].persona}">\n${red}\n</red_team_review>` : ""
  }\n\nWrite the combined answer now.`;

  return streamAgent({ agent: "orchestrator", messages: [{ role: "user", content }], extraSystem: SYNTHESIS });
};

export const config = { path: "/api/synthesize" };
