// POST /api/speak  { text: "...", voice: "aura-2-athena-en" }  →  audio/mpeg
// Text to speech with Deepgram /v1/speak (Aura-2). Max 2000 characters per request, so the
// browser splits long answers into chunks and calls this once per chunk.
// Docs: https://developers.deepgram.com/docs/text-to-speech, https://developers.deepgram.com/docs/tts-models
import { VOICE_IDS, SPEAK_MAX_CHARS } from "../../shared/voices.mjs";
import { DEEPGRAM_BASE, voiceConfigured, json, passwordError, notConfigured, deepgramHeaders, deepgramError } from "../lib/deepgram.mjs";

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Use POST." });
  const locked = passwordError(req);
  if (locked) return locked;
  if (!voiceConfigured()) return notConfigured();

  let body;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Request body must be JSON." });
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const voice = body.voice;
  if (!text) return json(400, { error: "text is required." });
  if (text.length > SPEAK_MAX_CHARS) return json(413, { error: `Send at most ${SPEAK_MAX_CHARS} characters per request.`, code: "too_long" });
  if (!VOICE_IDS.has(voice)) return json(400, { error: "Unknown voice. Choose an Aura-2 English voice.", code: "bad_voice" });

  let res;
  try {
    res = await fetch(`${DEEPGRAM_BASE()}/v1/speak?model=${encodeURIComponent(voice)}`, {
      method: "POST",
      headers: deepgramHeaders("application/json"),
      body: JSON.stringify({ text }),
    });
  } catch {
    return json(502, { error: "Couldn't reach the voice service. Check your connection and try again.", code: "voice_unreachable" });
  }
  if (!res.ok) {
    const e = deepgramError(res.status);
    return json(e.status, { error: e.error, code: e.code });
  }
  // Stream the MP3 straight through; only the content type is passed on (no Deepgram headers).
  return new Response(res.body, { headers: { "content-type": res.headers.get("content-type") || "audio/mpeg", "cache-control": "no-store" } });
};

export const config = { path: "/api/speak" };
