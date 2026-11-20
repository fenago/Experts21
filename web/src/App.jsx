import { useMemo, useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TEAM from "./generated/team.json";
import { streamNdjson, postJson, setPassword, ApiError } from "./api.js";

const BY_NAME = Object.fromEntries(TEAM.map((a) => [a.name, a]));
const ORCH = BY_NAME.orchestrator;
const GROUPS = [
  ["Coordination", ["Leadership"]],
  ["Strategy & market", ["Business strategy", "Market"]],
  ["Real estate & build-out", ["Real estate", "Technical / construction"]],
  ["Legal & compliance", ["Legal & compliance"]],
  ["Finance & risk", ["Finance", "Risk"]],
  ["Coffee & product", ["Coffee / product"]],
  ["Operations & people", ["Operations", "Operations / people"]],
  ["Technical", ["Technical"]],
  ["Marketing", ["Marketing"]],
  ["Quality control & team", ["Quality control", "Team building"]],
];
const TEAM_ID = "__team__";

function Markdown({ text }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
}

function Avatar({ agent, size = 36 }) {
  return (
    <span className={`avatar c-${agent.color}`} style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden>
      {agent.persona[0]}
    </span>
  );
}

function ModelBadge({ model }) {
  return <span className={`badge m-${model}`}>{model}</span>;
}

function Sidebar({ selected, onSelect, open }) {
  const groups = GROUPS.map(([label, domains]) => [
    label,
    TEAM.filter((a) => domains.includes(a.domain) && a.name !== "orchestrator"),
  ]).filter(([, list]) => list.length);
  return (
    <nav className={`sidebar ${open ? "open" : ""}`} aria-label="Experts">
      <div className="brand">
        <strong>Experts21</strong>
        <span>Miami specialty coffee shop team</span>
      </div>
      <button className={`team-btn ${selected === TEAM_ID ? "active" : ""}`} onClick={() => onSelect(TEAM_ID)}>
        <Avatar agent={ORCH} />
        <span className="who">
          <span className="line1">
            Ask the whole team <ModelBadge model={ORCH.model} />
          </span>
          <span className="line2">{ORCH.persona} routes your question to the right experts</span>
        </span>
      </button>
      {groups.map(([label, list]) => (
        <div key={label} className="group">
          <div className="group-label">{label}</div>
          {list.map((a) => (
            <button key={a.name} className={`agent ${selected === a.name ? "active" : ""}`} onClick={() => onSelect(a.name)} title={`${a.voice}\n\n${a.style}`}>
              <Avatar agent={a} />
              <span className="who">
                <span className="line1">
                  {a.persona} <ModelBadge model={a.model} />
                </span>
                <span className="line2">{a.title}</span>
                <span className="line3">{a.voice}</span>
              </span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

function AgentHeader({ agent, team }) {
  return (
    <header className="chat-head">
      <Avatar agent={agent} size={44} />
      <div>
        <h1>
          {team ? "Ask the whole team" : `${agent.persona}, ${agent.title}`} <ModelBadge model={agent.model} />
        </h1>
        {team ? (
          <p>
            {agent.persona} (the orchestrator) picks the right experts, they answer in parallel, Frank stress-tests big decisions, and {agent.persona} combines it all into one answer.
          </p>
        ) : (
          <>
            <p><b>Voice:</b> {agent.voice}</p>
            <p><b>Working style:</b> {agent.style}</p>
            <p className="muted">
              Knowledge folder: {agent.knowledge.filter((k) => k !== "README.md").join(", ") || "no documents yet"}
            </p>
          </>
        )}
      </div>
    </header>
  );
}

function Composer({ onSend, busy, onStop, placeholder }) {
  const [text, setText] = useState("");
  const send = () => {
    const t = text.trim();
    if (!t || busy) return;
    onSend(t);
    setText("");
  };
  return (
    <form className="composer" onSubmit={(e) => (e.preventDefault(), send())}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder={placeholder}
        rows={3}
        aria-label="Your question"
      />
      {busy ? (
        <button type="button" className="stop" onClick={onStop}>Stop</button>
      ) : (
        <button type="submit" disabled={!text.trim()}>Send</button>
      )}
    </form>
  );
}

function PasswordPrompt({ onDone }) {
  const [value, setValue] = useState("");
  return (
    <form className="password" onSubmit={(e) => (e.preventDefault(), setPassword(value), onDone())}>
      <p>This app is password-protected. Enter the password set in Netlify (APP_PASSWORD).</p>
      <input type="password" value={value} onChange={(e) => setValue(e.target.value)} autoFocus aria-label="Password" />
      <button type="submit">Unlock</button>
    </form>
  );
}

function useAutoScroll(dep) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 200) el.scrollTop = el.scrollHeight;
  }, [dep]);
  return ref;
}

function ExpertChat({ agent, messages, setMessages, onAuth }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const abort = useRef(null);
  const scrollRef = useAutoScroll(messages);

  async function ask(text) {
    setError("");
    const history = [...messages, { role: "user", content: text }];
    setMessages([...history, { role: "assistant", content: "", pending: true }]);
    setBusy(true);
    abort.current = new AbortController();
    let answer = "";
    try {
      const done = await streamNdjson(
        "/api/chat",
        { agent: agent.name, messages: history.map(({ role, content }) => ({ role, content })) },
        (t) => {
          answer += t;
          setMessages([...history, { role: "assistant", content: answer, pending: true }]);
        },
        abort.current.signal
      );
      const note = done.stop_reason === "max_tokens" ? "\n\n*(Answer reached the length limit.)*" : "";
      setMessages([...history, { role: "assistant", content: answer + note }]);
    } catch (err) {
      if (err instanceof ApiError && err.code === "password_required") onAuth();
      if (err.name !== "AbortError") setError(err.message);
      setMessages(answer ? [...history, { role: "assistant", content: answer + "\n\n*(Incomplete.)*" }] : messages);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="empty">
            <p>Ask {agent.persona} anything in their area.</p>
            <p className="muted">{agent.description}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === "assistant" && <Avatar agent={agent} size={28} />}
            <div className="bubble">
              {m.role === "assistant" ? (m.content ? <Markdown text={m.content} /> : <span className="thinking">{agent.persona} is thinking…</span>) : <p>{m.content}</p>}
            </div>
          </div>
        ))}
        {error && <div className="error">{error}</div>}
      </div>
      <Composer onSend={ask} busy={busy} onStop={() => abort.current?.abort()} placeholder={`Ask ${agent.persona}…  (Enter to send, Shift+Enter for a new line)`} />
    </>
  );
}

function TeamRun({ run }) {
  return (
    <div className="run">
      <div className="msg user">
        <div className="bubble"><p>{run.question}</p></div>
      </div>
      {run.plan && (
        <div className="card plan">
          <Avatar agent={ORCH} size={28} />
          <div>
            <b>{ORCH.persona}'s plan:</b> {run.plan}
          </div>
        </div>
      )}
      {run.experts.map((e) => (
        <details key={e.agent} className="card expert" open={e.status === "working"}>
          <summary>
            <Avatar agent={BY_NAME[e.agent]} size={24} />
            <b>{BY_NAME[e.agent].persona}</b> <span className="muted">{BY_NAME[e.agent].title}</span> <ModelBadge model={BY_NAME[e.agent].model} />
            <span className={`status s-${e.status}`}>{e.status}</span>
          </summary>
          {e.brief && <p className="brief"><b>Brief:</b> {e.brief}</p>}
          {e.text ? <Markdown text={e.text} /> : e.status === "working" && <span className="thinking">thinking…</span>}
          {e.error && <div className="error">{e.error}</div>}
        </details>
      ))}
      {run.final !== null && (
        <div className="final">
          <div className="final-head">
            <Avatar agent={ORCH} size={28} /> <b>Combined answer from {ORCH.persona}</b>
          </div>
          {run.final ? <Markdown text={run.final} /> : <span className="thinking">{ORCH.persona} is combining the answers…</span>}
        </div>
      )}
      {run.stage && <div className="stage">{run.stage}</div>}
      {run.error && <div className="error">{run.error}</div>}
    </div>
  );
}

function TeamChat({ runs, setRuns, onAuth }) {
  const [busy, setBusy] = useState(false);
  const abort = useRef(null);
  const scrollRef = useAutoScroll(runs);

  async function ask(question) {
    const id = Date.now();
    let run = { id, question, plan: "", experts: [], final: null, stage: `${ORCH.persona} is choosing the experts…`, error: "" };
    const update = (patch) => {
      run = { ...run, ...(typeof patch === "function" ? patch(run) : patch) };
      setRuns((rs) => [...rs.filter((r) => r.id !== id), run]);
    };
    const updateExpert = (agent, patch) =>
      update((r) => ({ experts: r.experts.map((e) => (e.agent === agent ? { ...e, ...patch(e) } : e)) }));
    update({});
    setBusy(true);
    abort.current = new AbortController();
    const signal = abort.current.signal;
    try {
      // 1. Elena routes the question.
      const route = await postJson("/api/route", { question }, signal);
      const roster = route.experts.map((e) => ({ ...e, text: "", status: "working", error: "" }));
      if (route.red_team) roster.push({ agent: "red-team-reviewer", brief: "", text: "", status: "waiting", error: "" });
      update({ plan: route.plan, experts: roster, stage: "The experts are working in parallel…" });

      // 2. Experts answer in parallel.
      const answerOf = async (e, content) => {
        let text = "";
        try {
          await streamNdjson("/api/chat", { agent: e.agent, messages: [{ role: "user", content }] }, (t) => {
            text += t;
            updateExpert(e.agent, () => ({ text }));
          }, signal);
          updateExpert(e.agent, () => ({ status: "done" }));
        } catch (err) {
          if (err.code === "password_required") throw err;
          updateExpert(e.agent, () => ({ status: "failed", error: err.name === "AbortError" ? "Stopped." : err.message }));
          if (err.name === "AbortError") throw err;
        }
        return { agent: e.agent, text };
      };
      const answers = await Promise.all(
        route.experts.map((e) =>
          answerOf(
            e,
            `${ORCH.persona} (the orchestrator) brought you in on this question from the consultant:\n\n${question}\n\nYour brief from ${ORCH.persona}: ${e.brief}\n\nReturn a recommendation memo of about 300 words, with HANDOFF lines for anything outside your area.`
          )
        )
      );

      // 3. Red team for big decisions.
      let redTeam = "";
      if (route.red_team) {
        update({ stage: `${BY_NAME["red-team-reviewer"].persona} is stress-testing the advice…` });
        updateExpert("red-team-reviewer", () => ({ status: "working" }));
        const memos = answers.map((a) => `### ${BY_NAME[a.agent].persona} (${a.agent})\n${a.text || "(no answer)"}`).join("\n\n");
        redTeam = (
          await answerOf(
            { agent: "red-team-reviewer" },
            `The consultant asked:\n\n${question}\n\nThe experts answered:\n\n${memos}\n\nStress-test their combined advice before a decision is made. About 250 words, in your verdict format.`
          )
        ).text;
      }

      // 4. Elena combines everything.
      update({ final: "", stage: "" });
      let final = "";
      await streamNdjson("/api/synthesize", { question, plan: route.plan, answers, redTeam }, (t) => {
        final += t;
        update({ final });
      }, signal);
      update({ stage: "" });
    } catch (err) {
      if (err instanceof ApiError && err.code === "password_required") onAuth();
      update({ stage: "", error: err.name === "AbortError" ? "Stopped." : err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="messages" ref={scrollRef}>
        {runs.length === 0 && (
          <div className="empty">
            <p>Ask a question that spans several areas. {ORCH.persona} will bring in the right experts and give you one answer. For example:</p>
            <p className="muted">"We've been offered a 1,150 sq ft Brickell space at $72/sq ft + $19 NNN with a full personal guarantee. Should we sign? What should we negotiate?"</p>
            <p className="muted">"We have $350,000. Compare a seated café in Brickell, a ventanita in Little Havana, and a coffee trailer. Which should we do and how do we fund it?"</p>
          </div>
        )}
        {runs.map((r) => (
          <TeamRun key={r.id} run={r} />
        ))}
      </div>
      <Composer onSend={ask} busy={busy} onStop={() => abort.current?.abort()} placeholder="Ask the whole team…  (Enter to send, Shift+Enter for a new line)" />
    </>
  );
}

export default function App() {
  const [selected, setSelected] = useState(TEAM_ID);
  const [conversations, setConversations] = useState({});
  const [runs, setRuns] = useState([]);
  const [needPassword, setNeedPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const agent = selected === TEAM_ID ? ORCH : BY_NAME[selected];
  const messages = conversations[selected] || [];
  const setMessages = useMemo(() => (m) => setConversations((c) => ({ ...c, [selected]: m })), [selected]);

  return (
    <div className="app">
      <button className="menu" onClick={() => setMenuOpen((o) => !o)} aria-label="Show experts">☰ Experts</button>
      <Sidebar selected={selected} onSelect={(s) => (setSelected(s), setMenuOpen(false))} open={menuOpen} />
      <main className="chat">
        <AgentHeader agent={agent} team={selected === TEAM_ID} />
        {needPassword && <PasswordPrompt onDone={() => setNeedPassword(false)} />}
        {selected === TEAM_ID ? (
          <TeamChat runs={runs} setRuns={setRuns} onAuth={() => setNeedPassword(true)} />
        ) : (
          <ExpertChat key={selected} agent={agent} messages={messages} setMessages={setMessages} onAuth={() => setNeedPassword(true)} />
        )}
        <footer className="foot">General information, not legal, tax, or financial advice. Research dated November 2026.</footer>
      </main>
    </div>
  );
}
