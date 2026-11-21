// Generator for web/public/options/* (design preview pages by Sable). Run: node scripts/options/build-options.mjs (after npm run build).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "public/options");
const TEAM = JSON.parse(fs.readFileSync(path.join(ROOT, "src/generated/team.json"), "utf8"));
const AUDIT = fs.existsSync(new URL("./audit-results.json", import.meta.url))
  ? JSON.parse(fs.readFileSync(new URL("./audit-results.json", import.meta.url), "utf8"))
  : {};
fs.mkdirSync(OUT, { recursive: true });

const BY = Object.fromEntries(TEAM.map((a) => [a.name, a]));
const ORCH = BY.orchestrator;
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
  ["Design", ["Design"]],
  ["Quality control & team", ["Quality control", "Team building"]],
];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- icons: Lucide (ISC), inline sprite ---------- */
const ICONS = {
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  contact: '<path d="M16 2v2"/><path d="M17.915 21a6 6 0 10-12 0"/><path d="M8 2v2"/><circle cx="12" cy="11" r="4"/><rect x="3" y="3" width="18" height="18" rx="2"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  up: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
};
const ico = (n, cls = "") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${n}"/></svg>`;
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("")}</svg>`;

/* ---------- shared markup builders ---------- */
const av = (a, cls = "") => `<span class="av c-${a.color} ${cls}" aria-hidden="true">${esc(a.persona[0])}</span>`;
const kw = (a) => esc(`${a.persona} ${a.title} ${a.domain} ${a.description}`.toLowerCase());
const expertGroups = GROUPS.map(([label, doms]) => [label, TEAM.filter((a) => doms.includes(a.domain) && a.name !== "orchestrator")]).filter(([, l]) => l.length);
const nExperts = expertGroups.reduce((n, [, l]) => n + l.length, 0);

const RECENT = [
  { id: "victor", label: "Victor", q: "Is $72/sq ft too much for the 1,150 sq ft Brickell space?", ico: BY["real-estate-advisor"] },
  { id: "team", label: "Whole team", q: "We've been offered a 1,150 sq ft Brickell space at $72/sq ft + $19 NNN. Should we sign?", ico: ORCH },
];

function expertRows(scope) {
  return expertGroups
    .map(
      ([label, list], gi) => `
      <div class="group" data-group>
        <p class="group-label" id="${scope}-g${gi}">${esc(label)}</p>
        <ul class="rows" aria-labelledby="${scope}-g${gi}">
          ${list
            .map(
              (a) => `<li data-kw="${kw(a)}"><button type="button" class="row" data-expert="${a.name}">${av(a)}<span class="wr"><span class="nm">${esc(a.persona)}</span><span class="tt">${esc(a.title)}</span></span></button></li>`
            )
            .join("\n          ")}
        </ul>
      </div>`
    )
    .join("");
}
const searchBox = (scope) => `
  <div class="search">
    <label class="sr-only" for="${scope}-q">Find an expert or topic</label>
    ${ico("search")}
    <input id="${scope}-q" type="search" placeholder="Find an expert or topic" autocomplete="off" data-search="${scope}" aria-controls="${scope}-list">
  </div>
  <p class="sr-only" role="status" id="${scope}-count"></p>`;
const noMatch = (scope) => `<div class="nomatch" id="${scope}-none" hidden><p>No expert matches “<span data-q></span>”. Try <b>Ask the whole team</b>. Elena will pick the right people.</p><button type="button" class="btn" data-go="team">Ask the whole team</button></div>`;
const recentRows = () =>
  RECENT.map(
    (r) => `<li><button type="button" class="row recent" data-go="${r.id}">${av(r.ico)}<span class="wr"><span class="nm">${esc(r.label)}</span><span class="tt">${esc(r.q)}</span></span></button></li>`
  ).join("");

/* ---------- chat content (real: landlord-offer-brickell.md and research pack) ---------- */
const victor = BY["real-estate-advisor"];
const daniel = BY["financial-modeling-analyst"];
const eleanor = BY["business-attorney"];
const frank = BY["red-team-reviewer"];

const modelText = { opus: "Claude Opus: deeper and slower, costs more", sonnet: "Claude Sonnet: balanced speed and depth", haiku: "Claude Haiku: fastest, lowest cost" };
const aboutPanel = (a) => `
  <div class="about card" id="about" hidden>
    <p><b>Voice:</b> ${esc(a.voice)}</p>
    <p><b>Working style:</b> ${esc(a.style)}</p>
    <p><b>Model:</b> ${esc(modelText[a.model])}</p>
    <p><b>Documents ${esc(a.persona)} reads first:</b> ${esc(a.knowledge.filter((k) => k !== "README.md").join(", ") || "none yet")}</p>
  </div>`;

const figures = `
  <dl class="figures">
    <dt>Base rent</dt><dd>$72 / sq ft / yr</dd>
    <dt>NNN charges</dt><dd>$19 / sq ft / yr</dd>
    <dt>All-in, 1,150 sq ft</dt><dd>$104,650 / yr</dd>
    <dt>Per month, year 1</dt><dd>about $8,721</dd>
    <dt>Share of base-case sales ($84K / mo)</dt><dd><b>10.4%</b></dd>
  </dl>`;

const victorChat = `
  <section id="chat-victor" class="chat" aria-label="Conversation with Victor" hidden>
    <p class="preview-note">Sample conversation for design preview. Figures come from the landlord offer file and the research pack, and the wording is illustrative.</p>
    <div class="msg user"><p class="who-u">You</p><div class="bubble">Is $72/sq ft too much for the 1,150 sq ft Brickell space? What should I ask the landlord for?</div></div>
    <article class="msg card answer" aria-labelledby="vic-a">
      <p class="who" id="vic-a">${av(victor)}<span>Victor</span></p>
      <div class="prose">
        <p><b>Don't sign it as written.</b> The rent is the main problem, and the guarantee makes it riskier.</p>
        ${figures}
        <p><b>Ask for:</b></p>
        <ol>
          <li><b>Limit the personal guarantee.</b> The offer requires it for the full 7-year term. Ask for a cap or one that ends after a set period.</li>
          <li><b>Add an exclusive-use clause.</b> None is offered, so another coffee tenant could open in the building.</li>
          <li><b>Lower the 4% yearly increases</b>, or fix them for the first years.</li>
          <li><b>Raise the tenant improvement allowance</b> ($25/sq ft now) and the free rent (3 months now).</li>
          <li><b>Ask for more time.</b> The offer expires December 15, 2026. Don't let the date set your pace.</li>
        </ol>
        <p class="small">Source: sample landlord offer, 801 Brickell Ave, unit 104 (knowledge/real-estate-advisor/landlord-offer-brickell.md). Lease terms: have a Florida attorney review them before you sign. This is general information.</p>
      </div>
      <div class="actions"><button type="button" class="btn" data-copy>${ico("copy")}<span>Copy answer</span></button></div>
    </article>
    <div class="msg user"><p class="who-u">You</p><div class="bubble">What would happen to the numbers if the landlord says no to the guarantee change?</div>
      <p class="notsent" role="group" aria-label="Message not sent">${ico("alert")}<span><b>Not sent.</b> Victor couldn't answer just now. The expert service is busy. Your question is still here.</span>
      <button type="button" class="btn" data-retry>${ico("refresh")}<span>Try again</span></button></p>
    </div>
  </section>`;

const chip = (kind) => `<span class="chip ${kind === "done" ? "done" : kind === "failed" ? "failed" : "work"}">${ico(kind === "done" ? "check" : "alert")}${kind === "done" ? "Done" : "Couldn't answer"}</span>`;

const teamChat = `
  <section id="chat-team" class="chat" aria-label="Whole-team conversation">
    <p class="preview-note">Sample run for design preview. Figures come from the landlord offer file and the research pack, and the wording is illustrative.</p>
    <div class="msg user"><p class="who-u">You</p><div class="bubble">We've been offered a 1,150 sq ft Brickell space at $72/sq ft + $19 NNN with a full personal guarantee. Should we sign? What should we negotiate?</div></div>

    <article class="msg card plan" aria-labelledby="plan-h">
      <h2 class="who" id="plan-h">${av(ORCH)}<span>Elena's plan</span></h2>
      <p>Elena chose Victor, Daniel, and Eleanor <span class="dot" aria-hidden="true">·</span> 2 of 3 done <span class="dot" aria-hidden="true">·</span> Frank reviewed the result</p>
    </article>

    <div class="msg">
      <details class="card ex" open>
        <summary><h3>${av(victor, "sm")}<span class="ex-name">Victor <span class="ex-role">Real estate</span></span></h3>${chip("done")}</summary>
        <p class="brief"><b>Elena asked Victor to:</b> work out what this rent does to occupancy cost and list what to ask the landlord for.</p>
        <div class="prose"><p>All-in cost is $91/sq ft a year, about $8,721 a month in year 1, or 10.4% of $84K base-case monthly sales. The offer has a full-term personal guarantee, no exclusive, and 4% yearly increases. Ask for a capped guarantee, an exclusive, and more TI and free rent before the December 15, 2026 deadline.</p></div>
      </details>
      <details class="card ex" open>
        <summary><h3>${av(daniel, "sm")}<span class="ex-name">Daniel <span class="ex-role">Finance</span></span></h3>${chip("done")}</summary>
        <p class="brief"><b>Elena asked Daniel to:</b> test the rent against break-even.</p>
        <div class="prose"><p>The research pack's illustrative break-even is about $84.6K a month, or roughly 340 transactions a day at $8.25 (docs/05-operating-costs.md). A base case of $84K sits right at that line. That figure was built on different rent assumptions, so treat this as a warning and re-run the model with this lease. The assumption that matters most is daily transactions.</p></div>
      </details>
      <details class="card ex failed-card" open>
        <summary><h3>${av(eleanor, "sm")}<span class="ex-name">Eleanor <span class="ex-role">Legal</span></span></h3>${chip("failed")}</summary>
        <p class="failmsg">${ico("alert")}<span><b>Eleanor couldn't answer. The other experts did.</b></span></p>
        <button type="button" class="btn" data-retry>${ico("refresh")}<span>Retry Eleanor</span></button>
      </details>
      <details class="card ex">
        <summary><h3>${av(frank, "sm")}<span class="ex-name">Frank <span class="ex-role">Red team</span></span></h3>${chip("done")}</summary>
        <p class="brief"><b>Elena asked Frank to:</b> stress-test the plan.</p>
        <div class="prose"><p><b>Verdict: don't sign as written.</b> The plan only works if sales reach $84K a month early, and three free months may not cover the ramp-up. A full-term personal guarantee turns a business loss into a personal one. Conditions to sign: a capped guarantee, an exclusive, and a lawyer's review.</p></div>
      </details>
    </div>

    <article class="msg card combined" aria-labelledby="comb-h">
      <h2 class="who" id="comb-h">${av(ORCH)}<span>Combined answer from Elena</span></h2>
      <p class="partial" role="note">${ico("alert")}<span>This answer doesn't include Eleanor (legal). Retry Eleanor to add her view.</span></p>
      <div class="prose">
        <p><b>Don't sign the Brickell offer as written. Negotiate first.</b></p>
        <ul>
          <li>Rent is 10.4% of base-case sales ($8,721 a month against $84K), and the base case sits near break-even.</li>
          <li>Ask for a capped personal guarantee, an exclusive-use clause, lower increases, and more TI and free rent.</li>
          <li>The offer expires December 15, 2026. Ask for more time rather than rushing.</li>
        </ul>
        <p><b>Next steps:</b> counter the offer (you) · re-run break-even with this lease (Daniel) · have a Florida attorney review the guarantee (Eleanor, after retry).</p>
        <p class="small">General information, not legal, tax, or financial advice.</p>
      </div>
      <div class="actions"><button type="button" class="btn" data-copy>${ico("copy")}<span>Copy answer</span></button></div>
    </article>
  </section>`;

const dynChat = `<section id="chat-dyn" class="chat" aria-label="Conversation" hidden></section>`;

const historyView = `
  <section id="view-history" class="chat" aria-label="History" hidden>
    <ul class="rows list-card card">${recentRows()}</ul>
    <p class="small pad">Conversations are saved in this browser only. Don't use this on a shared computer if the questions are private.</p>
  </section>`;

const expertsView = `
  <section id="view-experts" class="chat" aria-label="Experts" hidden>
    ${searchBox("m")}
    <div class="list-card card" id="m-list">${expertRows("m")}${noMatch("m")}</div>
  </section>`;

const composer = `
  <div class="composer" id="composer">
    <form id="form" autocomplete="off" aria-label="Ask a question">
      <label class="sr-only" for="q" id="q-label">Ask Elena</label>
      <textarea id="q" rows="1" placeholder="Ask the whole team…" aria-describedby="q-hint"></textarea>
      <button type="submit" class="send" aria-label="Send">${ico("up")}</button>
    </form>
    <p class="hint" id="q-hint">Enter to send · Shift+Enter for a new line · Preview only, nothing is sent</p>
  </div>`;

function page(opt) {
  const { id, letter, name, css, bodyClass, glass } = opt;
  return `<!doctype html>
<!--
  Option ${letter} of 3 — ${name}. Static design preview for the Experts web app (no API calls).
  Generated from web/src/generated/team.json and the Brickell landlord offer (knowledge/real-estate-advisor/landlord-offer-brickell.md).
  System font stack only (no SF Pro). Icons: Lucide (https://lucide.dev), ISC License, Copyright (c) 2026 Lucide Icons and Contributors.
  No SF Symbols, no Apple logos. Accessibility switches for testing: ?a11y=reduce-transparency, ?a11y=more-contrast, ?a11y=reduce-motion (comma-separated).
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="${opt.scheme}">
<title>Experts21, Option ${letter}: ${name}</title>
<script>
  (function () {
    try {
      var q = new URLSearchParams(location.search).get("a11y") || "";
      var c = document.documentElement.classList;
      if (q.indexOf("reduce-transparency") > -1) c.add("a11y-rt");
      if (q.indexOf("more-contrast") > -1) c.add("a11y-hc");
      if (q.indexOf("reduce-motion") > -1) c.add("a11y-rm");
    } catch (e) {}
  })();
</script>
<link rel="stylesheet" href="shared.css">
<style>
${css}
</style>
</head>
<body class="${bodyClass}">
${sprite}
<a class="skip" href="#q">Skip to question</a>
<nav class="optstrip" aria-label="Design options">
  <a href="index.html">Option ${letter} of 3 · All options</a>
  <span class="optnote">Static preview: buttons don't call the API</span>
</nav>

<div class="shell">
  <nav class="sidebar ${glass.sidebar ? "glass" : ""}" aria-label="Experts">
    <div class="brand"><strong>Experts21</strong><span>Miami specialty coffee shop team</span></div>
    ${searchBox("s")}
    <ul class="rows pin">
      <li><button type="button" class="row" data-go="team">${av(ORCH)}<span class="wr"><span class="nm">Ask the whole team</span><span class="tt">Elena picks the right experts</span></span></button></li>
    </ul>
    <div class="group"><p class="group-label" id="s-recent">Recent</p><ul class="rows" aria-labelledby="s-recent">${recentRows()}</ul></div>
    <div id="s-list">${expertRows("s")}${noMatch("s")}</div>
  </nav>

  <main class="main" id="main">
    <div class="toolbar ${glass.toolbar ? "glass" : ""}" id="toolbar">
      <button type="button" class="btn back" id="back" hidden>${ico("back")}<span>Experts</span></button>
      <span id="tb-av"></span>
      <div class="titles"><h1 id="h1">Ask the whole team</h1><p class="sub" id="sub">Elena picks the right experts, they answer side by side, Frank checks big decisions, and Elena combines it all.</p></div>
      <button type="button" class="btn about-btn" id="about-btn" aria-expanded="false" aria-controls="about" hidden>${ico("info")}<span id="about-label">About</span></button>
    </div>
    <p class="sr-only" role="status" id="status"></p>
    <div class="content" id="content">
      <div id="about-slot"></div>
      ${teamChat}
      ${victorChat}
      ${dynChat}
      ${expertsView}
      ${historyView}
    </div>
    <p class="foot">General information, not legal, tax, or financial advice. Research dated November 2026.</p>
    ${composer}
  </main>
</div>

<nav class="tabbar ${glass.tabbar ? "glass" : ""}" aria-label="Main">
  <ul>
    <li><button type="button" class="tab" data-tab="team" aria-current="page">${ico("users")}<span>Team</span></button></li>
    <li><button type="button" class="tab" data-tab="experts">${ico("contact")}<span>Experts</span></button></li>
    <li><button type="button" class="tab" data-tab="history">${ico("history")}<span>History</span></button></li>
  </ul>
</nav>

<script>window.EXPERTS = ${JSON.stringify(
    Object.fromEntries(TEAM.map((a) => [a.name, { persona: a.persona, title: a.title, color: a.color, voice: a.voice, style: a.style, model: a.model, knowledge: a.knowledge }]))
  )};
window.MODEL_TEXT = ${JSON.stringify(modelText)};</script>
<script src="shared.js"></script>
</body>
</html>
`;
}

/* ---------- CSS ---------- */
const sharedCss = fs.readFileSync(new URL("./shared.css", import.meta.url), "utf8");
const sharedJs = fs.readFileSync(new URL("./shared.js", import.meta.url), "utf8");
fs.writeFileSync(path.join(OUT, "shared.css"), sharedCss);
fs.writeFileSync(path.join(OUT, "shared.js"), sharedJs);

const rtBlock = `
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--glass-solid) !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }
}
html.a11y-rt .glass { background: var(--glass-solid) !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }`;

const hcRules = `.glass { background: var(--glass-solid) !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; border: 2px solid var(--label) !important; box-shadow: none !important; }`;
const hcBlock = (hcLight, hcDark, darkOnly) => `
${darkOnly ? "" : `@media (prefers-contrast: more) { :root { ${hcLight} } ${hcRules} }
html.a11y-hc { ${hcLight} }
html.a11y-hc ${hcRules}`}
${hcDark ? `@media (prefers-contrast: more) and (prefers-color-scheme: dark) { :root { ${hcDark} } }
@media (prefers-color-scheme: dark) { html.a11y-hc { ${hcDark} } }` : ""}
${darkOnly ? `@media (prefers-contrast: more) { ${hcRules} }
html.a11y-hc ${hcRules}` : ""}`;

const fixedBlocks = `
@media (forced-colors: active) {
  body, .optstrip, .card, .toolbar, .sidebar, .composer, .tabbar, .figures, .partial, .notsent { background: Canvas; }
  body *, .optstrip, .optstrip * { color: CanvasText !important; }
  a, .optstrip a, .skip { color: LinkText !important; }
  .btn, .btn *, .tab, .tab *, .send, .send * { color: ButtonText !important; }
  input, textarea { background: Field; color: FieldText !important; }
  .glass { background: Canvas !important; border: 1px solid CanvasText !important; box-shadow: none !important; }
  .row[aria-current="true"], .tab[aria-current="page"] { outline: 2px solid Highlight; outline-offset: -2px; }
  .row[aria-current="true"]::before { background: Highlight; }
  .btn, .send, textarea, .search input { border: 1px solid ButtonText; }
  .send { background: ButtonFace; color: ButtonText; }
  .av { border: 1px solid CanvasText; background: Canvas; color: CanvasText; forced-color-adjust: none; }
  .bubble { border: 1px solid CanvasText; background: Canvas; color: CanvasText; }
  .chip { border: 1px solid CanvasText; background: Canvas; color: CanvasText; }
  .card { border: 1px solid CanvasText; }
}
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
html.a11y-rm *, html.a11y-rm *::before, html.a11y-rm *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }`;

const status = (dark) => (dark
  ? `--ok-fg:#6be28a; --ok-bg:#12301b; --bad-fg:#ff8a80; --bad-bg:#3d1513; --warn-fg:#ffc266; --warn-bg:#3a2606;`
  : `--ok-fg:#1a6b2f; --ok-bg:#e3f5e8; --bad-fg:#b3001b; --bad-bg:#fde8ea; --warn-fg:#8a4600; --warn-bg:#fff1de;`);

const HC_L = `--label-2:#3a3a3c; --sep:#000; --control-border:#000; --accent-text:#0040dd; --sel-fg:#0040dd; --bar-label-2:#2c2c2e; --bar-sel-fg:#0040dd; --focus:#0040dd; --ok-fg:#0b5a1f; --bad-fg:#8a0014; --warn-fg:#6b3500;`;
const HC_D = `--label-2:#e5e5ea; --sep:#fff; --control-border:#fff; --accent-text:#8cc4ff; --sel-fg:#cfe6ff; --bar-label-2:#e5e5ea; --bar-sel-fg:#cfe6ff; --focus:#8cc4ff; --ok-fg:#9cf0b3; --bad-fg:#ffb3ad; --warn-fg:#ffd699;`;

const FONT = `--font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;`;

const cssA = `
/* Option A: Liquid Glass. Glass = sidebar, toolbar, tab bar (navigation/controls). Cards and messages stay solid. */
:root { color-scheme: light dark; ${FONT}
  --bg:#f2f2f7;
  --wash: radial-gradient(60% 45% at 12% 8%, #ffdcbf 0, transparent 70%), radial-gradient(50% 40% at 92% 18%, #ffd0e2 0, transparent 70%), radial-gradient(60% 50% at 70% 100%, #c9e3ff 0, transparent 70%);
  --surface:#ffffff; --surface-2:#f2f2f7; --field:#ffffff; --strip-bg:#ffffff;
  --label:#000000; --label-2:#58585d; --sep:#d1d1d6; --control-border:#8a8a8f;
  --accent:#0066cc; --accent-text:#0059b3; --accent-fill:#0066cc; --on-accent:#ffffff; --focus:#0066cc;
  --sel-bg:rgb(0 102 204 / .12); --sel-fg:#004a99; --hover:rgb(0 0 0 / .05);
  --user-bg:#0066cc; --user-fg:#ffffff;
  ${status(false)}
  --glass-bg:rgb(255 255 255 / .86); --glass-border:rgb(255 255 255 / .7); --glass-solid:#f9f9fb;
  --glass-shadow:0 10px 30px rgb(0 0 0 / .12), inset 0 1px 0 rgb(255 255 255 / .6);
  --bar-label:#000000; --bar-label-2:#48484a; --bar-sel-bg:rgb(0 102 204 / .14); --bar-sel-fg:#00468f; --bar-hover:rgb(0 0 0 / .06);
  --r-bar:26px; --r-card:20px; --r-inner:14px; --r-row:18px; --side-w:304px;
}
@media (prefers-color-scheme: dark) { :root {
  --bg:#000000;
  --wash: radial-gradient(60% 45% at 12% 8%, #3b2415 0, transparent 70%), radial-gradient(50% 40% at 92% 18%, #2b1636 0, transparent 70%), radial-gradient(60% 50% at 70% 100%, #10263f 0, transparent 70%);
  --surface:#1c1c1e; --surface-2:#2c2c2e; --field:#2c2c2e; --strip-bg:#1c1c1e;
  --label:#ffffff; --label-2:#aeaeb2; --sep:#38383a; --control-border:#8e8e93;
  --accent:#0a84ff; --accent-text:#64b0ff; --accent-fill:#0060d0; --focus:#64b0ff;
  --sel-bg:rgb(10 132 255 / .24); --sel-fg:#b3d7ff; --hover:rgb(255 255 255 / .07);
  --user-bg:#0060d0;
  ${status(true)}
  --glass-bg:rgb(28 28 30 / .82); --glass-border:rgb(255 255 255 / .14); --glass-solid:#1c1c1e;
  --glass-shadow:0 10px 30px rgb(0 0 0 / .5), inset 0 1px 0 rgb(255 255 255 / .09);
  --bar-label:#ffffff; --bar-label-2:#d1d1d6; --bar-sel-bg:rgb(10 132 255 / .3); --bar-sel-fg:#c4e0ff; --bar-hover:rgb(255 255 255 / .09);
} }
body { background: var(--bg); }
.glass { background: var(--glass-bg); -webkit-backdrop-filter: blur(22px) saturate(180%); backdrop-filter: blur(22px) saturate(180%); border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); }
.sidebar { margin: 12px; border-radius: var(--r-bar); padding: 12px 8px; top: calc(var(--strip-h, 44px) + 12px) !important; height: calc(100dvh - var(--strip-h, 44px) - 24px) !important; }
.toolbar { margin: 8px 12px 0; border-radius: var(--r-bar); top: calc(var(--strip-h, 44px) + 8px) !important; }
.tabbar { border-radius: var(--r-bar); }
.card { box-shadow: 0 1px 2px rgb(0 0 0 / .04); }
.composer { background: linear-gradient(to top, var(--bg) 72%, transparent); }
.content { padding-top: 20px; }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .glass { background: var(--glass-solid); } }
${rtBlock}
${hcBlock(HC_L, HC_D, false)}
${fixedBlocks}`;

const cssB = `
/* Option B: Clean Apple Light. Solid white surfaces and grouped lists. Glass ONLY on the phone tab bar. */
:root { color-scheme: light dark; ${FONT}
  --bg:#f2f2f7; --wash:none; --surface:#ffffff; --surface-2:#f2f2f7; --field:#ffffff; --strip-bg:#ffffff;
  --label:#000000; --label-2:#58585d; --sep:#d1d1d6; --control-border:#8a8a8f;
  --accent:#0066cc; --accent-text:#0059b3; --accent-fill:#0066cc; --on-accent:#ffffff; --focus:#0066cc;
  --sel-bg:rgb(0 102 204 / .1); --sel-fg:#004a99; --hover:rgb(0 0 0 / .045);
  --user-bg:#0066cc; --user-fg:#ffffff;
  ${status(false)}
  --glass-bg:rgb(255 255 255 / .86); --glass-border:rgb(255 255 255 / .7); --glass-solid:#f9f9fb;
  --glass-shadow:0 8px 24px rgb(0 0 0 / .12), inset 0 1px 0 rgb(255 255 255 / .6);
  --bar-label:#000000; --bar-label-2:#48484a; --bar-sel-bg:rgb(0 102 204 / .14); --bar-sel-fg:#00468f; --bar-hover:rgb(0 0 0 / .06);
  --r-bar:24px; --r-card:12px; --r-inner:10px; --r-row:10px; --side-w:300px;
}
@media (prefers-color-scheme: dark) { :root {
  --bg:#000000; --surface:#1c1c1e; --surface-2:#2c2c2e; --field:#2c2c2e; --strip-bg:#1c1c1e;
  --label:#ffffff; --label-2:#aeaeb2; --sep:#38383a; --control-border:#8e8e93;
  --accent:#0a84ff; --accent-text:#64b0ff; --accent-fill:#0060d0; --focus:#64b0ff;
  --sel-bg:rgb(10 132 255 / .24); --sel-fg:#b3d7ff; --hover:rgb(255 255 255 / .07);
  --user-bg:#0060d0;
  ${status(true)}
  --glass-bg:rgb(28 28 30 / .82); --glass-border:rgb(255 255 255 / .14); --glass-solid:#1c1c1e;
  --glass-shadow:0 8px 24px rgb(0 0 0 / .5), inset 0 1px 0 rgb(255 255 255 / .09);
  --bar-label:#ffffff; --bar-label-2:#d1d1d6; --bar-sel-bg:rgb(10 132 255 / .3); --bar-sel-fg:#c4e0ff; --bar-hover:rgb(255 255 255 / .09);
} }
body { background: var(--bg); }
.glass { background: var(--glass-bg); -webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%); border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); }
/* Solid sidebar and toolbar: not glass in this option */
.sidebar { background: var(--surface); border-right: 1px solid var(--sep); padding: 16px 10px; }
.toolbar { background: var(--surface); border-bottom: 1px solid var(--sep); min-height: 68px; }
.toolbar, .sidebar { --bar-label: var(--label); }
.card { border-radius: var(--r-card); }
.bubble { border-radius: 18px; }
.row[aria-current="true"] { font-weight: 600; }
.composer { background: linear-gradient(to top, var(--bg) 78%, transparent); }
.group-label { letter-spacing: .04em; }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .glass { background: var(--glass-solid); } }
${rtBlock}
${hcBlock(HC_L, HC_D, false)}
${fixedBlocks}`;

const cssC = `
/* Option C: Dark Pro. Dark-only, macOS-style: flush dark-glass sidebar and toolbar, dense rows, amber accent. */
:root { color-scheme: dark; ${FONT}
  --bg:#0b0b0d;
  --wash: radial-gradient(55% 40% at 8% 0%, #3a2312 0, transparent 70%), radial-gradient(55% 45% at 100% 100%, #13233a 0, transparent 70%);
  --surface:#1c1c1e; --surface-2:#2c2c2e; --field:#2c2c2e; --strip-bg:#1c1c1e;
  --label:#ffffff; --label-2:#aeaeb2; --sep:#3a3a3c; --control-border:#8e8e93;
  --accent:#ff9f0a; --accent-text:#ffb340; --accent-fill:#ff9f0a; --on-accent:#000000; --focus:#ffb340;
  --sel-bg:rgb(255 159 10 / .2); --sel-fg:#ffd699; --hover:rgb(255 255 255 / .07);
  --user-bg:#2c2c2e; --user-fg:#ffffff;
  ${status(true)}
  --glass-bg:rgb(30 30 32 / .8); --glass-border:rgb(255 255 255 / .1); --glass-solid:#1c1c1e;
  --glass-shadow:inset 0 1px 0 rgb(255 255 255 / .08);
  --bar-label:#ffffff; --bar-label-2:#d1d1d6; --bar-sel-bg:rgb(255 159 10 / .28); --bar-sel-fg:#fff1dc; --bar-hover:rgb(255 255 255 / .09);
  --r-bar:22px; --r-card:12px; --r-inner:8px; --r-row:8px; --side-w:288px;
}
body { background: var(--bg); font-size: 1rem; }
.glass { background: var(--glass-bg); -webkit-backdrop-filter: blur(28px) saturate(160%); backdrop-filter: blur(28px) saturate(160%); border: 1px solid var(--glass-border); box-shadow: var(--glass-shadow); }
.sidebar { border-radius: 0; border-width: 0 1px 0 0; padding: 14px 8px; }
.toolbar { border-radius: 0; border-width: 0 0 1px 0; }
/* Dense, flat conversation: messages as rows, no bubbles */
.bubble { background: transparent; color: var(--user-fg); border-left: 3px solid var(--accent); border-radius: 0; padding: 2px 0 2px 12px; max-width: 70ch; }
.msg.user { align-items: flex-start; }
.who-u { text-align: left; }
.card { border-radius: var(--r-card); }
.row { min-height: 48px; padding: 4px 10px; }
.row .nm { font-size: .9375rem; }
.row[aria-current="true"] { background: var(--sel-bg); }
.send { border-radius: 12px; }
textarea { border-radius: 12px; }
.composer { background: linear-gradient(to top, var(--bg) 75%, transparent); }
.tabbar { border-radius: 22px; }
.btn.primary { background: var(--accent-fill); color: var(--on-accent); }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .glass { background: var(--glass-solid); } }
${rtBlock}
${hcBlock("", HC_D.replace(/--sel-fg:[^;]+;/, "--sel-fg:#fff1dc;").replace(/--bar-sel-fg:[^;]+;/, "--bar-sel-fg:#fff1dc;").replace(/--accent-text:[^;]+;/, "--accent-text:#ffd699;").replace(/--focus:[^;]+;/, "--focus:#ffd699;"), true)}
${fixedBlocks}`;

const OPTIONS = [
  { id: "a-liquid-glass", letter: "A", name: "Liquid Glass", css: cssA, bodyClass: "opt-a", scheme: "light dark", glass: { sidebar: true, toolbar: true, tabbar: true } },
  { id: "b-clean-apple-light", letter: "B", name: "Clean Apple Light", css: cssB, bodyClass: "opt-b", scheme: "light dark", glass: { sidebar: false, toolbar: false, tabbar: true } },
  { id: "c-dark-pro", letter: "C", name: "Dark Pro", css: cssC, bodyClass: "opt-c", scheme: "dark", glass: { sidebar: true, toolbar: true, tabbar: true } },
];
for (const o of OPTIONS) fs.writeFileSync(path.join(OUT, `${o.id}.html`), page(o));

/* ---------- index ---------- */
const meta = [
  {
    o: OPTIONS[0],
    pitch: "A frosted, floating glass sidebar, toolbar, and tab bar over a soft warm wash. Cards and answers stay solid.",
    best: "A brand feel that looks like the newest Apple apps.",
    trade: "Most glass to get right: needs the solid fallbacks, and more GPU work than B.",
  },
  {
    o: OPTIONS[1],
    pitch: "Solid white surfaces, grouped lists, and hairlines. Glass appears only on the phone tab bar.",
    best: "Reading long answers, older devices, and the lowest risk of legibility trouble.",
    trade: "Calmer and less distinctive. Looks like a standard iOS settings app.",
  },
  {
    o: OPTIONS[2],
    pitch: "Dark-only, macOS-style: flush dark-glass sidebar and toolbar, dense rows, amber accent, flat conversation.",
    best: "Power use at a desk, long sessions, and a pro-tool feel.",
    trade: "No light theme. Denser rows, and amber on black is a different look from Apple's blue.",
  },
];
const auditRows = (letter) => (AUDIT[letter] ? AUDIT[letter].summary : "Run pending");
fs.writeFileSync(
  path.join(OUT, "index.html"),
  `<!doctype html>
<!--
  Design options for the Experts21 web app (static previews). System font stack only; icons are inline Lucide (ISC License,
  Copyright (c) 2026 Lucide Icons and Contributors). No SF Symbols, no Apple logos.
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<title>Experts21 design options</title>
<style>
  :root { color-scheme: light dark; ${FONT}
    --bg:#f2f2f7; --surface:#fff; --label:#000; --label-2:#58585d; --sep:#d1d1d6; --accent:#0059b3; --control-border:#8a8a8f; --rec:#e3f5e8; --rec-fg:#1a6b2f; }
  @media (prefers-color-scheme: dark) { :root { --bg:#000; --surface:#1c1c1e; --label:#fff; --label-2:#aeaeb2; --sep:#38383a; --accent:#64b0ff; --control-border:#8e8e93; --rec:#12301b; --rec-fg:#6be28a; } }
  @media (prefers-contrast: more) { :root { --label-2:#3a3a3c; --sep:#000; --accent:#0040dd; } }
  @media (prefers-contrast: more) and (prefers-color-scheme: dark) { :root { --label-2:#e5e5ea; --sep:#fff; --accent:#8cc4ff; } }
  * { box-sizing: border-box; }
  body { margin: 0; font: 400 1.0625rem/1.45 var(--font); background: var(--bg); color: var(--label); }
  main { max-width: 980px; margin: 0 auto; padding: 24px 16px 48px; }
  h1 { font-size: 2.125rem; line-height: 1.2; margin: 0 0 8px; }
  h2 { font-size: 1.375rem; margin: 0 0 4px; }
  p { margin: 0 0 12px; max-width: 70ch; }
  .lead { color: var(--label-2); }
  .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 290px), 1fr)); margin: 24px 0; }
  .card { background: var(--surface); border: 1px solid var(--sep); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; }
  .card dl { margin: 0 0 16px; } .card dt { font-weight: 600; font-size: .8125rem; color: var(--label-2); text-transform: uppercase; letter-spacing: .04em; margin-top: 10px; }
  .card dd { margin: 2px 0 0; }
  .go { margin-top: auto; display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 18px; border-radius: 22px; background: var(--accent); color: #fff; font-weight: 600; text-decoration: none; }
  @media (prefers-color-scheme: dark) { .go { background: #0060d0; } }
  .go:focus-visible, a:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
  .tag { display: inline-block; align-self: flex-start; background: var(--rec); color: var(--rec-fg); font-weight: 700; font-size: .8125rem; padding: 2px 10px; border-radius: 999px; margin-bottom: 8px; }
  .tag.none { visibility: hidden; height: 0; margin: 0; padding: 0; }
  .tablewrap { overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; font-size: .9375rem; background: var(--surface); border: 1px solid var(--sep); }
  th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--sep); vertical-align: top; }
  th { font-weight: 600; }
  a { color: var(--accent); }
  .note { color: var(--label-2); font-size: .9375rem; }
  @media (prefers-contrast: more) { .card, table { border: 2px solid var(--label); } }
  @media (forced-colors: active) { .card, table, .go { border: 1px solid CanvasText; } }
</style>
</head>
<body>
<main>
  <h1>Experts21 design options</h1>
  <p class="lead">Three static previews of the app's main screen, built from the real team list (27 experts plus Elena), a real Brickell lease question, and Wren's top usability fixes. Each page works on a phone (tab bar) and on a desktop (sidebar). Buttons don't call the API.</p>
  <p><b>Recommendation: Option A, Liquid Glass.</b> It gives the Apple feel the project asked for, and it passes every check in this audit. Option B is the safe fallback if glass feels like too much.</p>
  <div class="grid">
    ${meta
      .map(
        ({ o, pitch, best, trade }) => `<section class="card" aria-labelledby="h-${o.letter}">
      ${o.letter === "A" ? '<span class="tag">Recommended</span>' : ""}
      <h2 id="h-${o.letter}">Option ${o.letter}: ${o.name}</h2>
      <p>${pitch}</p>
      <dl>
        <dt>Best for</dt><dd>${best}</dd>
        <dt>Trade-offs</dt><dd>${trade}</dd>
        <dt>Accessibility audit</dt><dd>${auditRows(o.letter)}</dd>
      </dl>
      <a class="go" href="${o.id}.html">Open Option ${o.letter}<span class="sr-only"> (${o.name})</span></a>
    </section>`
      )
      .join("\n    ")}
  </div>
  <h2>What changed from the live app (all options)</h2>
  <ul>
    <li><b>Navigation:</b> bottom tab bar on phones (Team, Experts, History); persistent sidebar on wide screens with search, Ask the whole team pinned, Recent, then the expert groups.</li>
    <li><b>Failure states:</b> a failed question stays in the thread with “Not sent.” and Try again. A failed expert in a team run stays open with Retry, and Elena's answer says who is missing. Status uses an icon and words, not red alone.</li>
    <li><b>Header:</b> one line (name and title) with an About button for voice, working style, and model, written in plain words.</li>
    <li><b>Type:</b> everything is in rem, with a 17px body and a 16px minimum for the text box, so it follows text-size settings.</li>
    <li><b>Selection:</b> a leading bar, tint, and weight, plus <code>aria-current</code>, so it survives forced colors.</li>
  </ul>
  <h2>How to test accessibility switches</h2>
  <p class="note">Browsers can't always emulate Reduce Transparency, so each option accepts a query string: <code>?a11y=reduce-transparency</code>, <code>?a11y=more-contrast</code>, <code>?a11y=reduce-motion</code> (combine with commas). The real OS settings are also honored.</p>
  <p class="note">Sample content is illustrative, not live model output. Figures come from the landlord offer file and the research pack (docs/05-operating-costs.md). Not tested: real VoiceOver, a real phone.</p>
</main>
<style>.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}</style>
</body>
</html>
`
);
console.log("written", fs.readdirSync(OUT));
