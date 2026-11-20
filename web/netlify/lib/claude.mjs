// Shared server-side code for the Netlify Functions. Never imported by the browser.
import Anthropic from "@anthropic-ai/sdk";
import crypto from "node:crypto";
import team from "./generated/team-server.json" with { type: "json" };

export const AGENTS = team.agents;
const RESEARCH_BLOCK = `# Research pack (docs/, November 2026)\n\n${team.research}`;

// Agent files say opus / sonnet / haiku; map them to model IDs (override with env vars).
const MODEL_IDS = {
  opus: process.env.MODEL_OPUS || "claude-opus-5-5",
  sonnet: process.env.MODEL_SONNET || "claude-sonnet-5-5",
  haiku: process.env.MODEL_HAIKU || "claude-haiku-5-5",
};
// Effort controls thinking depth and latency. Opus keeps its default (medium) for judgment work;
// Sonnet and Haiku run at low effort for chat-speed answers.
const EFFORT = {
  opus: process.env.EFFORT_OPUS || "medium",
  sonnet: process.env.EFFORT_SONNET || "low",
  haiku: process.env.EFFORT_HAIKU || "low",
};
// Server-side refusal fallbacks are available on Opus 5.5 and Sonnet 5.5, not Haiku.
const SUPPORTS_FALLBACK = new Set(["opus", "sonnet"]);

export function modelFor(agentName) {
  const tier = AGENTS[agentName]?.model || "sonnet";
  return { tier, id: MODEL_IDS[tier] || tier, effort: EFFORT[tier] || "medium" };
}

let client;
function getClient() {
  // The key is read from the Netlify environment only; it never reaches the browser.
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

// System prompt: research pack first (identical for every agent, so it can be cached and
// shared across agents on the same model), then the agent's own prompt, skills, and knowledge.
export function systemFor(agentName, extra = "") {
  return [
    { type: "text", text: RESEARCH_BLOCK, cache_control: { type: "ephemeral" } },
    { type: "text", text: AGENTS[agentName].system + extra, cache_control: { type: "ephemeral" } },
  ];
}

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// Common request checks: method, API key configured, optional password, JSON body.
export async function readRequest(req) {
  if (req.method !== "POST") return { error: json(405, { error: "Use POST." }) };
  if (!process.env.ANTHROPIC_API_KEY) {
    return { error: json(500, { error: "ANTHROPIC_API_KEY is not set. Add it in Netlify: Site configuration > Environment variables, then redeploy." }) };
  }
  const password = process.env.APP_PASSWORD;
  if (password) {
    const given = req.headers.get("x-app-password") || "";
    const hash = (s) => crypto.createHash("sha256").update(s).digest();
    if (!crypto.timingSafeEqual(hash(given), hash(password))) {
      return { error: json(401, { error: "Password required.", code: "password_required" }) };
    }
  }
  try {
    return { body: await req.json() };
  } catch {
    return { error: json(400, { error: "Request body must be JSON." }) };
  }
}

const MAX_MESSAGES = 40;
const MAX_CHARS = 60_000;
export function cleanMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return null;
  const out = [];
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (!content) continue;
    out.push({ role: m.role, content });
  }
  if (!out.length || out[0].role !== "user" || out[out.length - 1].role !== "user") return null;
  return out;
}

function errorMessage(err) {
  if (err instanceof Anthropic.AuthenticationError) return "The Anthropic API key was rejected. Check ANTHROPIC_API_KEY in Netlify.";
  if (err instanceof Anthropic.PermissionDeniedError) return "This API key isn't allowed to use that model.";
  if (err instanceof Anthropic.NotFoundError) return "Model not found. Check the MODEL_* environment variables.";
  if (err instanceof Anthropic.RateLimitError) return "Rate limited by the Anthropic API. Wait a moment and try again.";
  if (err instanceof Anthropic.BadRequestError) return `The API rejected the request: ${err.message}`;
  if (err instanceof Anthropic.APIError) return `Anthropic API error ${err.status ?? ""}: ${err.message}`;
  return `Server error: ${err?.message || err}`;
}

// Stream one Claude call to the browser as newline-delimited JSON:
//   {"type":"text","text":"..."}  ...  {"type":"done","stop_reason":"end_turn","model":"..."}
//   {"type":"error","message":"..."} on failure
export function streamAgent({ agent, messages, extraSystem = "", maxTokens = 8000, modelOverride }) {
  const m = modelOverride || modelFor(agent);
  const params = {
    model: m.id,
    max_tokens: maxTokens,
    system: systemFor(agent, extraSystem),
    messages,
    output_config: { effort: m.effort },
  };
  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      const send = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        const api = getClient();
        const stream = SUPPORTS_FALLBACK.has(m.tier)
          ? api.beta.messages.stream({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" })
          : api.messages.stream(params);
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send({ type: "text", text: event.delta.text });
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          send({ type: "error", message: "The model declined to answer this request." });
        } else {
          send({
            type: "done",
            stop_reason: final.stop_reason,
            model: final.model,
            usage: final.usage && {
              input: final.usage.input_tokens,
              cache_read: final.usage.cache_read_input_tokens,
              output: final.usage.output_tokens,
            },
          });
        }
      } catch (err) {
        send({ type: "error", message: errorMessage(err) });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(body, {
    headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no" },
  });
}

export async function parseJson({ agent, messages, extraSystem, format, maxTokens = 4000, effort = "low" }) {
  const m = modelFor(agent);
  try {
    const response = await getClient().messages.parse({
      model: m.id,
      max_tokens: maxTokens,
      system: systemFor(agent, extraSystem),
      messages,
      output_config: { effort, format },
    });
    if (response.stop_reason === "refusal") return { error: "The model declined to route this request." };
    if (!response.parsed_output) return { error: "Could not read the routing plan." };
    return { data: response.parsed_output };
  } catch (err) {
    return { error: errorMessage(err) };
  }
}
