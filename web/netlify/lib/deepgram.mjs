// Server-side Deepgram helpers for the voice functions. Never imported by the browser.
// The key is read only from the DEEPGRAM_API_KEY environment variable and is never
// logged or returned to the client.
import crypto from "node:crypto";

export const DEEPGRAM_BASE = () => (process.env.DEEPGRAM_BASE_URL || "https://api.deepgram.com").replace(/\/$/, "");
export const voiceConfigured = () => Boolean(process.env.DEEPGRAM_API_KEY);

export function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// Same APP_PASSWORD protection as the chat functions.
export function passwordError(req) {
  const password = process.env.APP_PASSWORD;
  if (!password) return null;
  const given = req.headers.get("x-app-password") || "";
  const hash = (s) => crypto.createHash("sha256").update(s).digest();
  if (crypto.timingSafeEqual(hash(given), hash(password))) return null;
  return json(401, { error: "Password required.", code: "password_required" });
}

export const notConfigured = () =>
  json(503, { error: "Voice isn't set up yet. You can keep typing your questions.", code: "voice_not_configured" });

export function deepgramHeaders(contentType) {
  return { Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`, "Content-Type": contentType };
}

// Map a Deepgram HTTP error to a friendly message (never echoes the key or raw headers).
export function deepgramError(status) {
  if (status === 401 || status === 403) return { status: 502, error: "The voice service rejected its key. Voice is unavailable until the key is fixed.", code: "voice_auth" };
  if (status === 402) return { status: 502, error: "The voice service account is out of credit.", code: "voice_billing" };
  if (status === 413) return { status: 413, error: "That's too long to process in one go.", code: "too_long" };
  if (status === 429) return { status: 503, error: "The voice service is busy. Try again in a moment.", code: "voice_busy" };
  if (status === 400) return { status: 400, error: "The voice service couldn't read that audio.", code: "bad_audio" };
  return { status: 502, error: "The voice service had a problem. Try again in a moment.", code: "voice_error" };
}
