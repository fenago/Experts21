// Tests the voice Netlify Functions against a local mock of the Deepgram API.
// No real key or network needed. Run via `npm test` (after the build).
import http from "node:http";
import assert from "node:assert/strict";

const KEY = "dg-test-key-DO-NOT-LEAK-123";
const requests = [];
let listenReply = { status: 200, body: { results: { channels: [{ alternatives: [{ transcript: "Should we sign the Brickell lease?", confidence: 0.98 }] }] } } };
let speakStatus = 200;

const mock = http.createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks);
    requests.push({ url: req.url, headers: req.headers, body });
    if (req.url.startsWith("/v1/listen")) {
      res.writeHead(listenReply.status, { "content-type": "application/json" });
      return res.end(JSON.stringify(listenReply.body));
    }
    if (req.url.startsWith("/v1/speak")) {
      if (speakStatus !== 200) {
        res.writeHead(speakStatus, { "content-type": "application/json" });
        return res.end(JSON.stringify({ err_msg: "nope" }));
      }
      res.writeHead(200, { "content-type": "audio/mpeg", "dg-request-id": "abc", "dg-char-count": String(JSON.parse(body).text.length) });
      return res.end(Buffer.from("ID3-fake-mp3-bytes"));
    }
    res.writeHead(404).end();
  });
});
await new Promise((r) => mock.listen(0, "127.0.0.1", r));
process.env.DEEPGRAM_BASE_URL = `http://127.0.0.1:${mock.address().port}`;

// Capture everything the functions log, to prove the key never appears there.
const logged = [];
for (const m of ["log", "info", "warn", "error", "debug"]) {
  const orig = console[m];
  console[m] = (...a) => { logged.push(a.map(String).join(" ")); if (m === "error") orig(...a); };
}

const { default: transcribe } = await import("../netlify/functions/transcribe.mjs");
const { default: speak } = await import("../netlify/functions/speak.mjs");
const { default: voiceStatus } = await import("../netlify/functions/voice-status.mjs");

const audio = (headers = {}) =>
  new Request("http://localhost/api/transcribe", { method: "POST", headers: { "content-type": "audio/webm;codecs=opus", ...headers }, body: Buffer.alloc(4000, 7) });
const say = (body, headers = {}) =>
  new Request("http://localhost/api/speak", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
const bodies = [];
const read = async (res) => { const t = await res.clone().text(); bodies.push(t + JSON.stringify([...res.headers])); return res; };
let passed = 0;
const ok = (name) => (passed++, process.stdout.write(`  ✓ ${name}\n`));

// 1. No key: friendly "not set up" from every voice function; text chat is unaffected.
delete process.env.DEEPGRAM_API_KEY;
let res = await read(await voiceStatus(new Request("http://localhost/api/voice")));
assert.deepEqual(await res.json(), { enabled: false });
res = await read(await transcribe(audio()));
assert.equal(res.status, 503);
let data = await res.json();
assert.equal(data.code, "voice_not_configured");
assert.match(data.error, /Voice isn't set up yet/);
res = await read(await speak(say({ text: "Hi", voice: "aura-2-athena-en" })));
assert.equal(res.status, 503);
assert.equal(requests.length, 0);
ok("DEEPGRAM_API_KEY missing → /api/voice says disabled; transcribe and speak return a friendly 'not set up' (no Deepgram call)");

process.env.DEEPGRAM_API_KEY = KEY;

// 2. APP_PASSWORD protects all three voice functions.
process.env.APP_PASSWORD = "letmein";
for (const r of [await voiceStatus(new Request("http://localhost/api/voice")), await transcribe(audio()), await speak(say({ text: "Hi", voice: "aura-2-athena-en" }))]) {
  assert.equal(r.status, 401);
  assert.equal((await r.json()).code, "password_required");
}
res = await voiceStatus(new Request("http://localhost/api/voice", { headers: { "x-app-password": "letmein" } }));
assert.deepEqual(await res.json(), { enabled: true });
delete process.env.APP_PASSWORD;
ok("APP_PASSWORD required on /api/voice, /api/transcribe and /api/speak");

// 3. Transcription: nova-3 + smart_format, Token auth, audio passed through, transcript returned.
requests.length = 0;
res = await read(await transcribe(audio()));
assert.equal(res.status, 200);
assert.deepEqual(await res.json(), { transcript: "Should we sign the Brickell lease?", confidence: 0.98 });
let sent = requests[0];
const q = new URL(sent.url, "http://x").searchParams;
assert.equal(q.get("model"), "nova-3");
assert.equal(q.get("smart_format"), "true");
assert.equal(sent.headers.authorization, `Token ${KEY}`);
assert.equal(sent.headers["content-type"], "audio/webm;codecs=opus");
assert.equal(sent.body.length, 4000);
ok("transcribe → Deepgram /v1/listen?model=nova-3&smart_format=true with 'Token' auth; returns the transcript");

// 4. No speech detected → clear 422 message.
listenReply = { status: 200, body: { results: { channels: [{ alternatives: [{ transcript: "", confidence: 0 }] }] } } };
res = await read(await transcribe(audio()));
assert.equal(res.status, 422);
data = await res.json();
assert.equal(data.code, "no_speech");
assert.match(data.error, /didn't catch any words/);
ok("empty transcript → 422 'I didn't catch any words…'");

// 5. Deepgram errors are mapped to friendly messages; bad input rejected.
listenReply = { status: 401, body: { err_msg: "Invalid credentials." } };
res = await read(await transcribe(audio()));
assert.equal(res.status, 502);
assert.equal((await res.json()).code, "voice_auth");
listenReply = { status: 429, body: {} };
res = await read(await transcribe(audio()));
assert.equal((await res.json()).code, "voice_busy");
res = await transcribe(new Request("http://localhost/api/transcribe", { method: "POST", headers: { "content-type": "text/plain" }, body: "hello" }));
assert.equal(res.status, 415);
res = await transcribe(new Request("http://localhost/api/transcribe", { method: "POST", headers: { "content-type": "audio/webm" }, body: Buffer.alloc(0) }));
assert.equal(res.status, 400);
ok("Deepgram 401/429 → friendly errors; non-audio and empty uploads rejected");

// 6. Text to speech: Aura-2 voice as model, JSON {text}, MP3 streamed back without Deepgram headers.
requests.length = 0;
res = await read(await speak(say({ text: "Bottom line: don't sign as written.", voice: "aura-2-saturn-en" })));
assert.equal(res.status, 200);
assert.equal(res.headers.get("content-type"), "audio/mpeg");
assert.equal(res.headers.get("dg-request-id"), null);
assert.equal(Buffer.from(await res.arrayBuffer()).toString(), "ID3-fake-mp3-bytes");
sent = requests[0];
assert.equal(new URL(sent.url, "http://x").pathname, "/v1/speak");
assert.equal(new URL(sent.url, "http://x").searchParams.get("model"), "aura-2-saturn-en");
assert.equal(sent.headers.authorization, `Token ${KEY}`);
assert.deepEqual(JSON.parse(sent.body), { text: "Bottom line: don't sign as written." });
ok("speak → Deepgram /v1/speak?model=aura-2-saturn-en with JSON {text}; MP3 streamed back");

// 7. Speak validation: only Aura-2 English voices, max 2000 characters, Deepgram errors mapped.
requests.length = 0;
res = await speak(say({ text: "Hi", voice: "aura-2-sirio-es" }));
assert.equal(res.status, 400);
res = await speak(say({ text: "Hi", voice: "aura-asteria-en" }));
assert.equal(res.status, 400);
res = await speak(say({ text: "x".repeat(2001), voice: "aura-2-athena-en" }));
assert.equal(res.status, 413);
res = await speak(say({ text: "", voice: "aura-2-athena-en" }));
assert.equal(res.status, 400);
assert.equal(requests.length, 0);
speakStatus = 402;
res = await read(await speak(say({ text: "Hi", voice: "aura-2-athena-en" })));
assert.equal((await res.json()).code, "voice_billing");
speakStatus = 200;
ok("speak rejects non-Aura-2-English voices, >2000 characters, empty text; maps Deepgram 402");

// 8. The browser-side chunker keeps every chunk under Deepgram's 2000-character limit.
const { chunkText, speakableText } = await import("../src/voice.js").catch(() => ({}));
if (chunkText) {
  const long = Array.from({ length: 80 }, (_, i) => `Sentence number ${i} explains the lease terms in plain language.`).join(" ");
  const chunks = chunkText(speakableText(`**Bottom line:** test\n\n| Item | Value |\n|---|---|\n| Rent | $8,721 |\n\n${long}`));
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((c) => c.length <= 2000));
  assert.equal(chunks.join(" ").includes("**"), false);
  assert.match(chunks[0], /Item, Value\.\s+Rent, \$8,721\./);
  ok(`long answers split into ${chunks.length} chunks, all ≤ 2000 characters, Markdown removed`);
}

// 9. The key never appears in any response body/header or in logs.
assert.ok(bodies.every((b) => !b.includes(KEY)), "key leaked in a response");
assert.ok(logged.every((l) => !l.includes(KEY)), "key leaked in logs");
ok("DEEPGRAM_API_KEY never appears in responses or logs");

mock.close();
process.stdout.write(`\nAll ${passed} voice function tests passed.\n`);
