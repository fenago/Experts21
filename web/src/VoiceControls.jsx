import { useEffect, useId, useRef, useState } from "react";
import { VOICES, voiceById, DEFAULT_VOICES } from "../shared/voices.mjs";
import {
  usePrefs, setVoiceFor, setAutoRead, voiceFor, useVoiceStatus, usePlayback, speak, stopSpeaking,
  clearPlaybackError, recordingSupported, startRecording, transcribe, micErrorMessage,
} from "./voice.js";

// Icons: Lucide (https://lucide.dev), ISC License, Copyright (c) 2026 Lucide Icons and Contributors.
const Icon = ({ children }) => (
  <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{children}</svg>
);
export const MicIcon = () => (
  <Icon><path d="M12 19v3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><rect x="9" y="2" width="6" height="13" rx="3" /></Icon>
);
const StopIcon = () => <Icon><rect width="18" height="18" x="3" y="3" rx="2" /></Icon>;
const SpeakerIcon = () => (
  <Icon><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></Icon>
);
const WaveIcon = () => (
  <Icon><path d="M2 10v3" /><path d="M6 6v11" /><path d="M10 3v18" /><path d="M14 8v7" /><path d="M18 5v13" /><path d="M22 10v3" /></Icon>
);
const PlayIcon = () => <Icon><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></Icon>;

const NOT_SET_UP = "Voice isn't set up yet. You can keep typing your questions.";

// ---------- microphone: press to talk, press again (or pause) to send ----------
export function MicButton({ onTranscript, disabled, persona, onMessage }) {
  const status = useVoiceStatus();
  const [state, setState] = useState("idle"); // idle | starting | recording | transcribing
  const rec = useRef(null);
  const aborter = useRef(null);

  useEffect(() => () => { rec.current?.stop(); aborter.current?.abort(); }, []);

  async function finish() {
    const r = rec.current;
    if (!r) return;
    rec.current = null;
    r.stop();
    const { blob, heardSpeech } = await r.done;
    if (!heardSpeech || blob.size < 1000) {
      setState("idle");
      return onMessage("I didn't hear anything. Press the mic and start talking, or type your question.", true);
    }
    setState("transcribing");
    onMessage("Turning your words into text…");
    aborter.current = new AbortController();
    try {
      const text = await transcribe(blob, aborter.current.signal);
      onMessage("");
      onTranscript(text);
    } catch (err) {
      if (err.name !== "AbortError") onMessage(err.code === "voice_not_configured" ? NOT_SET_UP : err.message, true);
    } finally {
      setState("idle");
    }
  }

  async function toggle() {
    if (status === "disabled") return onMessage(NOT_SET_UP, true);
    if (!recordingSupported()) return onMessage("This browser can't record audio. Type your question instead.", true);
    if (state === "recording") return finish();
    if (state !== "idle") return;
    stopSpeaking();
    setState("starting");
    try {
      rec.current = await startRecording({ onAutoStop: () => finish() });
      setState("recording");
      onMessage(`Listening… Ask ${persona} your question. Press the mic again, or pause, to send.`);
    } catch (err) {
      rec.current = null;
      setState("idle");
      onMessage(micErrorMessage(err), true);
    }
  }

  const recording = state === "recording";
  const busy = state === "starting" || state === "transcribing";
  const label = recording ? "Stop recording and send" : state === "transcribing" ? "Transcribing your question" : "Ask by voice";
  return (
    <button
      type="button"
      className={`mic ${recording ? "recording" : ""} ${status === "disabled" ? "voice-off" : ""}`}
      onClick={toggle}
      aria-pressed={recording}
      aria-label={label}
      title={status === "disabled" ? NOT_SET_UP : label}
      aria-disabled={disabled || busy || undefined}
      disabled={disabled && !recording}
    >
      {recording ? <StopIcon /> : state === "transcribing" ? <WaveIcon /> : <MicIcon />}
    </button>
  );
}

// ---------- speaker button on each reply ----------
export function SpeakButton({ id, text, agent, persona }) {
  const status = useVoiceStatus();
  const playback = usePlayback();
  usePrefs(); // re-render when the voice choice changes
  if (!text) return null;
  const mine = playback.id === id;
  const label = mine ? `Stop reading ${persona}'s answer` : `Read ${persona}'s answer aloud`;
  return (
    <button
      type="button"
      className={`speak ${mine ? "active" : ""}`}
      onClick={() => (mine ? stopSpeaking() : speak(id, text, voiceFor(agent)))}
      aria-label={label}
      title={status === "disabled" ? NOT_SET_UP : label}
      aria-pressed={mine}
    >
      {mine ? <StopIcon /> : <SpeakerIcon />}
      <span>{mine ? (playback.state === "loading" ? "Loading…" : "Stop") : "Listen"}</span>
    </button>
  );
}

// ---------- header controls: read-aloud toggle + global stop + playback errors ----------
export function VoiceBar() {
  const prefs = usePrefs();
  const status = useVoiceStatus();
  const playback = usePlayback();
  const id = useId();
  return (
    <div className="voice-bar">
      <label className="switch" htmlFor={id}>
        <input id={id} type="checkbox" role="switch" checked={prefs.autoRead} onChange={(e) => setAutoRead(e.target.checked)} />
        <span className="track" aria-hidden="true"><span className="thumb" /></span>
        <span>Read answers aloud</span>
      </label>
      {playback.state !== "idle" && (
        <button type="button" className="stop-speaking" onClick={stopSpeaking}>
          <StopIcon /> <span>{playback.state === "loading" ? "Preparing audio…" : "Stop speaking"}</span>
        </button>
      )}
      {status === "disabled" && <span className="voice-note">{NOT_SET_UP}</span>}
      {playback.error && (
        <span className="voice-error" role="alert">
          {playback.error === NOT_SET_UP || /isn't set up/.test(playback.error) ? NOT_SET_UP : playback.error}{" "}
          <button type="button" className="link" onClick={clearPlaybackError}>Dismiss</button>
        </span>
      )}
    </div>
  );
}

// ---------- voice persona: shown in the expert card, with a picker and preview ----------
export function VoicePicker({ agent }) {
  const prefs = usePrefs();
  const playback = usePlayback();
  const [open, setOpen] = useState(false);
  const selectId = useId();
  const current = voiceFor(agent.name);
  const v = voiceById(current);
  const isDefault = current === DEFAULT_VOICES[agent.name] || !prefs.voices[agent.name];
  const previewId = `preview-${agent.name}`;
  const previewing = playback.id === previewId;
  const sample = `Hi, I'm ${agent.persona}, your ${agent.title}. This is how I'll sound when I read my answers to you.`;
  return (
    <div className="voice-persona">
      <p>
        <b>Voice:</b> {v.name} <span className="muted">· {v.traits} · {v.accent}{isDefault ? " · default" : ""}</span>{" "}
        <button type="button" className="link" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Done" : "Change voice"}
        </button>
      </p>
      {open && (
        <div className="voice-picker">
          <label htmlFor={selectId}>Voice for {agent.persona}</label>
          <select id={selectId} value={current} onChange={(e) => { stopSpeaking(); setVoiceFor(agent.name, e.target.value); }}>
            {VOICES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} — {o.traits} ({o.accent}){o.id === DEFAULT_VOICES[agent.name] ? " · default" : ""}
              </option>
            ))}
          </select>
          <button type="button" className="pill" onClick={() => (previewing ? stopSpeaking() : speak(previewId, sample, current))} aria-pressed={previewing}>
            {previewing ? <StopIcon /> : <PlayIcon />} <span>{previewing ? "Stop preview" : "Preview"}</span>
          </button>
          {!isDefault && (
            <button type="button" className="link" onClick={() => setVoiceFor(agent.name, null)}>Reset to default</button>
          )}
        </div>
      )}
    </div>
  );
}
