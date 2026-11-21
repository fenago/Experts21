// POST /api/transcribe  (body: raw audio from the browser's MediaRecorder; Content-Type: its MIME type)
// Sends the audio to Deepgram pre-recorded transcription (model nova-3) and returns { transcript }.
// Docs: https://developers.deepgram.com/docs/pre-recorded-audio
import { DEEPGRAM_BASE, voiceConfigured, json, passwordError, notConfigured, deepgramHeaders, deepgramError } from "../lib/deepgram.mjs";

const MAX_BYTES = 5 * 1024 * 1024; // Netlify request bodies are limited; a 60 s voice note is far below this.

export default async (req) => {
  if (req.method !== "POST") return json(405, { error: "Use POST." });
  const locked = passwordError(req);
  if (locked) return locked;
  if (!voiceConfigured()) return notConfigured();

  const contentType = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!contentType.startsWith("audio/") && !contentType.startsWith("video/")) {
    return json(415, { error: "Send the recording as audio.", code: "bad_audio" });
  }
  const audio = await req.arrayBuffer();
  if (!audio.byteLength) return json(400, { error: "The recording was empty.", code: "no_speech" });
  if (audio.byteLength > MAX_BYTES) return json(413, { error: "That recording is too long. Keep voice questions under a minute.", code: "too_long" });

  let res;
  try {
    res = await fetch(`${DEEPGRAM_BASE()}/v1/listen?model=nova-3&smart_format=true`, {
      method: "POST",
      headers: deepgramHeaders(req.headers.get("content-type")),
      body: audio,
    });
  } catch {
    return json(502, { error: "Couldn't reach the voice service. Check your connection and try again.", code: "voice_unreachable" });
  }
  if (!res.ok) {
    const e = deepgramError(res.status);
    return json(e.status, { error: e.error, code: e.code });
  }
  const data = await res.json();
  const alt = data?.results?.channels?.[0]?.alternatives?.[0];
  const transcript = (alt?.transcript || "").trim();
  if (!transcript) {
    return json(422, { error: "I didn't catch any words. Try again a little closer to the mic, or type your question.", code: "no_speech" });
  }
  return json(200, { transcript, confidence: alt.confidence ?? null });
};

export const config = { path: "/api/transcribe" };
