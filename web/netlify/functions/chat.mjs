// POST /api/chat  { agent: "real-estate-advisor", messages: [{role, content}, ...] }
// Streams one expert's answer (NDJSON). Also used for experts and the red team in "whole team" mode.
import { AGENTS, readRequest, cleanMessages, streamAgent, json } from "../lib/claude.mjs";

export default async (req) => {
  const { body, error } = await readRequest(req);
  if (error) return error;
  const agent = body.agent;
  if (typeof agent !== "string" || !AGENTS[agent] || agent === "orchestrator") {
    return json(400, { error: "Unknown agent. Use /api/route and /api/synthesize for the whole team." });
  }
  const messages = cleanMessages(body.messages);
  if (!messages) return json(400, { error: "messages must be a non-empty list that starts and ends with a user message." });
  return streamAgent({ agent, messages });
};

export const config = { path: "/api/chat" };
