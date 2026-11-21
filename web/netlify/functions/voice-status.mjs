// GET /api/voice  →  { enabled: true|false }
// Lets the app show "voice isn't set up yet" up front instead of failing on first use.
// Returns only whether DEEPGRAM_API_KEY is set — never the key itself.
import { voiceConfigured, json, passwordError } from "../lib/deepgram.mjs";

export default async (req) => {
  const locked = passwordError(req);
  if (locked) return locked;
  return json(200, { enabled: voiceConfigured() });
};

export const config = { path: "/api/voice" };
