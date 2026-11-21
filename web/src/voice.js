// Browser voice features: record a question (MediaRecorder → /api/transcribe → Deepgram nova-3)
// and read answers aloud (/api/speak → Deepgram Aura-2). No keys live here; the Netlify
// Functions hold DEEPGRAM_API_KEY.
import { useSyncExternalStore } from "react";
import { getPassword, ApiError } from "./api.js";
import { DEFAULT_VOICES, FALLBACK_VOICE, VOICE_IDS, SPEAK_MAX_CHARS } from "../shared/voices.mjs";

// ---------- small helpers ----------
const store = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
};

async function errorFrom(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* not JSON */
  }
  if (res.status === 404) return new ApiError("Voice isn't available here. Run the app with `netlify dev` or deploy it to Netlify.", "voice_not_configured");
  return new ApiError(data.error || `Voice request failed (${res.status}).`, data.code);
}

// ---------- preferences (remembered in this browser) ----------
const VOICE_KEY = "experts-voices";
const AUTO_KEY = "experts-read-aloud";
let prefs = { voices: store(VOICE_KEY, {}), autoRead: store(AUTO_KEY, false) };
const prefListeners = new Set();
const emitPrefs = () => prefListeners.forEach((l) => l());

export function voiceFor(agent) {
  const chosen = prefs.voices[agent];
  return VOICE_IDS.has(chosen) ? chosen : DEFAULT_VOICES[agent] || FALLBACK_VOICE;
}
export function setVoiceFor(agent, voiceId) {
  const voices = { ...prefs.voices };
  if (!voiceId || voiceId === DEFAULT_VOICES[agent]) delete voices[agent];
  else voices[agent] = voiceId;
  prefs = { ...prefs, voices };
  save(VOICE_KEY, voices);
  emitPrefs();
}
export function setAutoRead(on) {
  prefs = { ...prefs, autoRead: on };
  save(AUTO_KEY, on);
  emitPrefs();
}
export function usePrefs() {
  return useSyncExternalStore(
    (l) => (prefListeners.add(l), () => prefListeners.delete(l)),
    () => prefs
  );
}

// ---------- voice status (is DEEPGRAM_API_KEY set on the server?) ----------
let status = "unknown"; // "unknown" | "enabled" | "disabled"
const statusListeners = new Set();
const setStatus = (s) => {
  status = s;
  statusListeners.forEach((l) => l());
};
export function useVoiceStatus() {
  return useSyncExternalStore((l) => (statusListeners.add(l), () => statusListeners.delete(l)), () => status);
}
export async function checkVoiceStatus() {
  try {
    const res = await fetch("/api/voice", { headers: { "x-app-password": getPassword() } });
    if (res.ok) setStatus((await res.json()).enabled ? "enabled" : "disabled");
    else if (res.status === 404) setStatus("disabled");
    // 401 (password) or other: leave "unknown"; the first voice action will explain.
  } catch {
    /* offline: leave unknown */
  }
}
export function markVoiceDisabled() {
  setStatus("disabled");
}

// ---------- text → speakable chunks ----------
// Turns Markdown into plain sentences and splits it into chunks under Deepgram's 2000-character limit.
export function speakableText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^[ \t]*\|?[ \t]*:?-{3,}.*$/gm, "") // table separator rows
    .replace(/^[ \t]*\|(.+)\|[ \t]*$/gm, (_, row) => row.split("|").map((c) => c.trim()).filter(Boolean).join(", ") + ".")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*|__|\*|_|~~/g, "")
    .replace(/HANDOFF\s*→/g, "Handoff to")
    .replace(/→/g, " to ")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}
export function chunkText(text, max = Math.min(1500, SPEAK_MAX_CHARS)) {
  const sentences = text.match(/[^.!?\n]+[.!?]*[\s\n]*|[\n]+/g) || [text];
  const chunks = [];
  let cur = "";
  const push = () => cur.trim() && chunks.push(cur.trim());
  for (let s of sentences) {
    if ((cur + s).length <= max) {
      cur += s;
      continue;
    }
    push();
    cur = "";
    while (s.length > max) {
      // a single very long sentence: split on the last space before the limit
      const cut = s.lastIndexOf(" ", max) > max / 2 ? s.lastIndexOf(" ", max) : max;
      chunks.push(s.slice(0, cut).trim());
      s = s.slice(cut);
    }
    cur = s;
  }
  push();
  return chunks;
}

// ---------- playback queue ----------
// One answer plays at a time. Chunks are fetched one ahead so speech flows without long gaps.
let playback = { id: null, state: "idle", error: "" }; // state: idle | loading | playing
const playListeners = new Set();
const setPlayback = (p) => {
  playback = { ...playback, ...p };
  playListeners.forEach((l) => l());
};
export function usePlayback() {
  return useSyncExternalStore((l) => (playListeners.add(l), () => playListeners.delete(l)), () => playback);
}

let session = 0;
let audio = null;
let aborter = null;

async function fetchAudio(text, voice, signal) {
  const res = await fetch("/api/speak", {
    method: "POST",
    headers: { "content-type": "application/json", "x-app-password": getPassword() },
    body: JSON.stringify({ text, voice }),
    signal,
  });
  if (!res.ok) throw await errorFrom(res);
  return URL.createObjectURL(await res.blob());
}

export function stopSpeaking() {
  session++;
  aborter?.abort();
  aborter = null;
  if (audio) {
    audio.pause();
    audio.src = "";
    audio = null;
  }
  setPlayback({ id: null, state: "idle" });
}

// Speak `markdown` with `voice`. `id` identifies the message (so its button can show "Stop").
export async function speak(id, markdown, voice) {
  stopSpeaking();
  const mine = ++session;
  const chunks = chunkText(speakableText(markdown));
  if (!chunks.length) return;
  aborter = new AbortController();
  const signal = aborter.signal;
  setPlayback({ id, state: "loading", error: "" });
  try {
    let next = fetchAudio(chunks[0], voice, signal);
    for (let i = 0; i < chunks.length; i++) {
      const url = await next;
      if (mine !== session) return URL.revokeObjectURL(url);
      next = i + 1 < chunks.length ? fetchAudio(chunks[i + 1], voice, signal) : null;
      next?.catch(() => {}); // surfaced when awaited
      audio = new Audio(url);
      setPlayback({ id, state: "playing" });
      await new Promise((resolve, reject) => {
        audio.onended = resolve;
        audio.onerror = () => reject(new ApiError("This browser couldn't play the audio."));
        audio.play().catch(reject);
      });
      URL.revokeObjectURL(url);
      if (mine !== session) return;
    }
    if (mine === session) setPlayback({ id: null, state: "idle" });
  } catch (err) {
    if (mine !== session || err.name === "AbortError") return;
    if (err.code === "voice_not_configured") markVoiceDisabled();
    const message = err.name === "NotAllowedError" ? "Your browser blocked audio playback. Press the speaker button to play the answer." : err.message;
    setPlayback({ id: null, state: "idle", error: message });
  }
}

export function clearPlaybackError() {
  setPlayback({ error: "" });
}

// ---------- recording ----------
export const recordingSupported = () =>
  typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof window.MediaRecorder !== "undefined";

function pickMimeType() {
  for (const t of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]) {
    if (window.MediaRecorder.isTypeSupported?.(t)) return t;
  }
  return "";
}

export function micErrorMessage(err) {
  switch (err?.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "Microphone access is blocked. Allow the microphone for this site in your browser settings, or type your question.";
    case "NotFoundError":
    case "OverconstrainedError":
      return "No microphone was found. Connect one, or type your question.";
    case "NotReadableError":
      return "Your microphone is being used by another app. Close it and try again, or type your question.";
    default:
      return err?.message || "The microphone couldn't start. Type your question instead.";
  }
}

// Starts recording. Stops automatically after ~1.5 s of silence once speech has started,
// after 8 s with no speech, or after 60 s. Returns { stop(), done } where `done` resolves
// to { blob, heardSpeech }.
export async function startRecording({ onAutoStop } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const parts = [];
  recorder.ondataavailable = (e) => e.data.size && parts.push(e.data);

  let heardSpeech = false;
  let ctx = null;
  let timer = null;
  const started = Date.now();
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Float32Array(analyser.fftSize);
    let quietSince = Date.now();
    timer = setInterval(() => {
      analyser.getFloatTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) sum += v * v;
      const rms = Math.sqrt(sum / buf.length);
      const now = Date.now();
      if (rms > 0.02) {
        heardSpeech = true;
        quietSince = now;
      }
      const silentFor = now - quietSince;
      if ((heardSpeech && silentFor > 1500) || (!heardSpeech && now - started > 8000) || now - started > 60000) {
        stop();
        onAutoStop?.();
      }
    }, 100);
  } catch {
    heardSpeech = true; // no Web Audio: rely on the user pressing stop; let the server judge
  }

  const done = new Promise((resolve) => {
    recorder.onstop = () => {
      clearInterval(timer);
      stream.getTracks().forEach((t) => t.stop());
      ctx?.close().catch(() => {});
      resolve({ blob: new Blob(parts, { type: recorder.mimeType || mimeType || "audio/webm" }), heardSpeech });
    };
  });
  function stop() {
    if (recorder.state !== "inactive") recorder.stop();
  }
  recorder.start(250);
  return { stop, done };
}

export async function transcribe(blob, signal) {
  const res = await fetch("/api/transcribe", {
    method: "POST",
    headers: { "content-type": blob.type || "audio/webm", "x-app-password": getPassword() },
    body: blob,
    signal,
  });
  if (!res.ok) {
    const err = await errorFrom(res);
    if (err.code === "voice_not_configured") markVoiceDisabled();
    throw err;
  }
  return (await res.json()).transcript;
}
