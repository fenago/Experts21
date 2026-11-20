// POST /api/route  { question: "..." }
// Elena (the orchestrator) decides which experts to bring in and writes each one a brief.
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { AGENTS, readRequest, parseJson, json } from "../lib/claude.mjs";

const EXPERTS = Object.keys(AGENTS).filter((n) => !["orchestrator", "red-team-reviewer", "agent-builder"].includes(n));

const Plan = z.object({
  plan: z.string().describe("One or two sentences for the consultant: who you're bringing in and why"),
  experts: z
    .array(
      z.object({
        agent: z.enum(EXPERTS),
        brief: z.string().describe("What this expert should answer, with the constraints and assumptions they need"),
      })
    )
    .describe("Two to five experts; one only if the question is clearly single-area"),
  red_team: z.boolean().describe("True for leases, loans, hires, spending over about $10K, or anything hard to undo"),
});

const ROUTING = `

## Web app: routing step

In this step you only plan. Use your expert-routing skill to choose the fewest experts that cover the consultant's question (normally 2 to 5; never more than 5). Write each expert a self-contained brief: they can't see this conversation. Don't choose red-team-reviewer as an expert; set red_team instead. Don't answer the question yourself.`;

export default async (req) => {
  const { body, error } = await readRequest(req);
  if (error) return error;
  const question = typeof body.question === "string" ? body.question.trim().slice(0, 20_000) : "";
  if (!question) return json(400, { error: "question is required." });

  const result = await parseJson({
    agent: "orchestrator",
    extraSystem: ROUTING,
    messages: [{ role: "user", content: question }],
    format: zodOutputFormat(Plan),
  });
  if (result.error) return json(502, { error: result.error });

  const seen = new Set();
  const experts = result.data.experts.filter((e) => AGENTS[e.agent] && !seen.has(e.agent) && seen.add(e.agent)).slice(0, 5);
  if (!experts.length) return json(502, { error: "The orchestrator didn't pick any experts. Try rephrasing." });
  return json(200, { plan: result.data.plan, experts, red_team: result.data.red_team });
};

export const config = { path: "/api/route" };
