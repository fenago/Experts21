// Tests the Netlify Functions without a real API key: a local mock of the Anthropic
// Messages API stands in for api.anthropic.com. Run after `npm run build` (npm test does both).
import http from "node:http";
import assert from "node:assert/strict";

const requests = [];
const mock = http.createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    const body = JSON.parse(raw);
    requests.push({ headers: req.headers, body });
    const message = (content, stop = "end_turn") => ({
      id: "msg_test", type: "message", role: "assistant", model: body.model, content,
      stop_reason: stop, stop_sequence: null, usage: { input_tokens: 100, output_tokens: 20, cache_read_input_tokens: 0 },
    });
    if (!body.stream) {
      // Routing call (structured output): return a plan as JSON text.
      const plan = { plan: "Bringing in Victor and Daniel.", experts: [
        { agent: "real-estate-advisor", brief: "Check the rent." },
        { agent: "financial-modeling-analyst", brief: "Check break-even." },
      ], red_team: true };
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify(message([{ type: "text", text: JSON.stringify(plan) }])));
    }
    res.writeHead(200, { "content-type": "text/event-stream" });
    const send = (type, data) => res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
    send("message_start", { message: { ...message([], null), usage: { input_tokens: 100, output_tokens: 1 } } });
    send("content_block_start", { index: 0, content_block: { type: "text", text: "" } });
    for (const t of ["Bottom line: ", "don't sign ", "as written."]) send("content_block_delta", { index: 0, delta: { type: "text_delta", text: t } });
    send("content_block_stop", { index: 0 });
    send("message_delta", { delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 12 } });
    send("message_stop", {});
    res.end();
  });
});
await new Promise((r) => mock.listen(0, "127.0.0.1", r));
process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${mock.address().port}`;

const post = (path, body, headers = {}) =>
  new Request(`http://localhost${path}`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
const readNdjson = async (res) => (await res.text()).trim().split("\n").map((l) => JSON.parse(l));

const { default: chat } = await import("../netlify/functions/chat.mjs");
const { default: route } = await import("../netlify/functions/route.mjs");
const { default: synthesize } = await import("../netlify/functions/synthesize.mjs");
let passed = 0;
const ok = (name) => (passed++, console.log(`  ✓ ${name}`));

// 1. Without ANTHROPIC_API_KEY the functions refuse with a clear message.
delete process.env.ANTHROPIC_API_KEY;
let res = await chat(post("/api/chat", { agent: "real-estate-advisor", messages: [{ role: "user", content: "hi" }] }));
assert.equal(res.status, 500);
assert.match((await res.json()).error, /ANTHROPIC_API_KEY is not set/);
ok("missing API key → 500 with setup instructions");

process.env.ANTHROPIC_API_KEY = "sk-ant-test-not-real";

// 2. Input validation.
res = await chat(post("/api/chat", { agent: "not-an-agent", messages: [{ role: "user", content: "hi" }] }));
assert.equal(res.status, 400);
res = await chat(post("/api/chat", { agent: "real-estate-advisor", messages: [] }));
assert.equal(res.status, 400);
res = await chat(new Request("http://localhost/api/chat", { method: "GET" }));
assert.equal(res.status, 405);
ok("unknown agent, empty messages, and GET are rejected");

// 3. Optional password.
process.env.APP_PASSWORD = "letmein";
res = await chat(post("/api/chat", { agent: "real-estate-advisor", messages: [{ role: "user", content: "hi" }] }));
assert.equal(res.status, 401);
assert.equal((await res.json()).code, "password_required");
res = await chat(post("/api/chat", { agent: "real-estate-advisor", messages: [{ role: "user", content: "hi" }] }, { "x-app-password": "letmein" }));
assert.equal(res.status, 200);
await res.text();
delete process.env.APP_PASSWORD;
ok("APP_PASSWORD blocks requests without the right password");

// 4. Expert chat streams text; request uses Victor's model, prompt, knowledge, and caching.
requests.length = 0;
res = await chat(post("/api/chat", { agent: "real-estate-advisor", messages: [{ role: "user", content: "Should we sign?" }] }));
let events = await readNdjson(res);
assert.equal(events.filter((e) => e.type === "text").map((e) => e.text).join(""), "Bottom line: don't sign as written.");
assert.equal(events.at(-1).type, "done");
let sent = requests[0];
assert.equal(sent.body.model, "claude-sonnet-5-5");
assert.equal(sent.body.output_config.effort, "low");
assert.equal(sent.body.fallbacks, "default");
assert.match(sent.headers["anthropic-beta"], /server-side-fallback-2026-07-01/);
assert.match(sent.headers.authorization || sent.headers["x-api-key"], /sk-ant-test-not-real/); // key sent server-side only
const systemText = sent.body.system.map((b) => b.text).join("\n");
assert.match(systemText, /Your name is \*\*Victor\*\*/);
assert.match(systemText, /knowledge\/real-estate-advisor\/landlord-offer-brickell\.md/);
assert.match(systemText, /\$72 per sq ft/);
assert.match(systemText, /docs\/05-operating-costs\.md/);
assert.ok(sent.body.system.every((b) => b.cache_control?.type === "ephemeral"));
ok("Victor: streamed answer, sonnet + low effort + refusal fallback, persona/knowledge/research in cached system prompt");

// 5. Haiku agents skip the fallback (not supported on Haiku).
requests.length = 0;
res = await chat(post("/api/chat", { agent: "competitive-intel-analyst", messages: [{ role: "user", content: "Who competes in Brickell?" }] }));
await res.text();
assert.equal(requests[0].body.model, "claude-haiku-5-5");
assert.equal(requests[0].body.fallbacks, undefined);
ok("Dante: haiku model, no fallback");

// 6. Routing returns a validated plan from the orchestrator (Opus).
requests.length = 0;
res = await route(post("/api/route", { question: "Should we sign the Brickell lease?" }));
assert.equal(res.status, 200);
const plan = await res.json();
assert.deepEqual(plan.experts.map((e) => e.agent), ["real-estate-advisor", "financial-modeling-analyst"]);
assert.equal(plan.red_team, true);
assert.equal(requests[0].body.model, "claude-opus-5-5");
assert.equal(requests[0].body.output_config.format.type, "json_schema");
ok("route: orchestrator (opus) returns a structured expert plan");

// 7. Synthesis streams the orchestrator's combined answer, with memos and red team in the prompt.
requests.length = 0;
res = await synthesize(post("/api/synthesize", {
  question: "Should we sign?", plan: plan.plan,
  answers: [{ agent: "real-estate-advisor", text: "Victor's memo" }, { agent: "financial-modeling-analyst", text: "Daniel's memo" }],
  redTeam: "Frank's review",
}));
events = await readNdjson(res);
assert.equal(events.at(-1).type, "done");
const userMsg = requests[0].body.messages[0].content;
assert.match(userMsg, /Victor's memo/);
assert.match(userMsg, /Frank's review/);
assert.equal(requests[0].body.model, "claude-opus-5-5");
assert.equal(requests[0].body.output_config.effort, "medium");
ok("synthesize: orchestrator combines memos and red-team review (opus, medium effort)");

mock.close();
console.log(`\nAll ${passed} function tests passed.`);
