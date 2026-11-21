/* Preview behavior only: switch views, filter experts, show states. Nothing is sent anywhere. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var EX = window.EXPERTS;
  var TEAM_SUB = "Elena picks the right experts, they answer side by side, Frank checks big decisions, and Elena combines it all.";
  var state = { tab: "team", expert: null, fromList: false };
  var desktop = window.matchMedia("(min-width: 900px)");

  // Measure the sticky preview strip so the toolbar and sidebar sit under it, even at large text.
  var strip = $(".optstrip");
  function measure() { document.documentElement.style.setProperty("--strip-h", strip.offsetHeight + "px"); }
  measure();
  if (window.ResizeObserver) new ResizeObserver(measure).observe(strip);
  window.addEventListener("resize", measure);

  function say(msg) { var s = $("#status"); s.textContent = ""; setTimeout(function () { s.textContent = msg; }, 30); }
  function avatar(a) { return '<span class="av c-' + a.color + '" aria-hidden="true">' + a.persona[0] + "</span>"; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function dynChat(name) {
    var a = EX[name];
    var sug = ["What do you need from me to get started?", "What are the most common mistakes in this area?"];
    $("#chat-dyn").innerHTML =
      '<div class="empty card"><h2>Ask ' + esc(a.persona) + " a question</h2>" +
      "<p><b>Voice:</b> " + esc(a.voice) + "</p>" +
      '<p class="small" style="margin-top:8px">Tap a suggestion to fill the box, then edit it. Nothing is sent until you press Send.</p>' +
      '<div class="suggest">' + sug.map(function (s) { return '<button type="button" class="btn" data-fill="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") + "</div></div>";
  }

  function render(announce) {
    var isExpert = state.expert !== null;
    var view = isExpert ? "expert" : state.tab; // team | experts | history | expert
    var a = isExpert ? EX[state.expert] : null;

    $("#chat-team").hidden = view !== "team";
    $("#chat-victor").hidden = !(isExpert && state.expert === "real-estate-advisor");
    $("#chat-dyn").hidden = !(isExpert && state.expert !== "real-estate-advisor");
    $("#view-experts").hidden = view !== "experts";
    $("#view-history").hidden = view !== "history";
    if (isExpert && state.expert !== "real-estate-advisor") dynChat(state.expert);

    var h1 = $("#h1"), sub = $("#sub"), tbav = $("#tb-av");
    var aboutBtn = $("#about-btn"), aboutSlot = $("#about-slot");
    aboutSlot.innerHTML = ""; aboutBtn.hidden = true; aboutBtn.setAttribute("aria-expanded", "false");
    if (view === "team") { h1.textContent = "Ask the whole team"; sub.textContent = TEAM_SUB; tbav.innerHTML = avatar(EX.orchestrator); }
    else if (view === "experts") { h1.textContent = "Experts"; sub.textContent = $$("#m-list [data-expert]").length + " experts, grouped by area."; tbav.innerHTML = ""; }
    else if (view === "history") { h1.textContent = "History"; sub.textContent = "Your recent conversations."; tbav.innerHTML = ""; }
    else {
      h1.textContent = a.persona; sub.textContent = a.title; tbav.innerHTML = avatar(a);
      aboutBtn.hidden = false; $("#about-label").textContent = "About " + a.persona;
      aboutSlot.innerHTML = '<div class="about card" id="about" hidden><p><b>Voice:</b> ' + esc(a.voice) + "</p><p><b>Working style:</b> " + esc(a.style) +
        "</p><p><b>Model:</b> " + esc(window.MODEL_TEXT[a.model]) + "</p><p><b>Documents " + esc(a.persona) + " reads first:</b> " +
        esc(a.knowledge.filter(function (k) { return k !== "README.md"; }).join(", ") || "none yet") + "</p></div>";
    }
    $("#back").hidden = !(isExpert && state.fromList && !desktop.matches);

    // Composer shows in chat views only
    $("#composer").hidden = view === "experts" || view === "history";
    var who = view === "team" ? "Elena" : a ? a.persona : "Elena";
    $("#q-label").textContent = view === "team" ? "Ask Elena" : "Ask " + who;
    $("#q").placeholder = view === "team" ? "Ask the whole team…" : "Ask " + who + "…";

    // Selection (aria-current + non-color cues in CSS)
    $$(".row").forEach(function (r) {
      var on = false;
      if (r.dataset.expert) on = isExpert && r.dataset.expert === state.expert;
      else if (r.dataset.go === "team") on = view === "team" && !r.classList.contains("recent");
      r.removeAttribute("aria-current");
      if (on) r.setAttribute("aria-current", "true");
    });
    $$(".tab").forEach(function (t) {
      var on = isExpert ? t.dataset.tab === "experts" : t.dataset.tab === state.tab;
      if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
    if (announce) say(h1.textContent + (view === "experts" || view === "history" ? "" : ". " + sub.textContent));
  }

  function go(target, opts) {
    opts = opts || {};
    if (target === "team") { state.tab = "team"; state.expert = null; }
    else if (target === "victor") { state.expert = "real-estate-advisor"; state.tab = "experts"; state.fromList = !!opts.fromList; }
    else if (target === "experts" || target === "history") { state.tab = target; state.expert = null; }
    else { state.expert = target; state.tab = "experts"; state.fromList = !!opts.fromList; }
    render(true);
    if (opts.focus === "q") $("#q").focus();
    if (opts.focus === "search") { var m = $("#m-q"); if (m) m.focus(); }
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.expert) { var inList = !!t.closest("#m-list"); go(t.dataset.expert, { fromList: inList, focus: "q" }); }
    else if (t.dataset.go) { go(t.dataset.go, { fromList: !!t.closest("#view-history"), focus: t.dataset.go === "team" || t.dataset.go === "victor" ? "q" : null }); }
    else if (t.dataset.tab) { go(t.dataset.tab, { focus: t.dataset.tab === "experts" ? "search" : null }); }
    else if (t.id === "back") go("experts", { focus: "search" });
    else if (t.id === "about-btn") {
      var p = $("#about"), open = p.hidden;
      p.hidden = !open; t.setAttribute("aria-expanded", String(open));
    }
    else if (t.hasAttribute("data-fill")) { var q = $("#q"); q.value = t.getAttribute("data-fill"); q.focus(); }
    else if (t.hasAttribute("data-copy")) {
      var card = t.closest(".card"), label = $("span", t), old = label.textContent;
      try { navigator.clipboard && navigator.clipboard.writeText($(".prose", card).innerText); } catch (err) {}
      label.textContent = "Copied"; say("Answer copied.");
      setTimeout(function () { label.textContent = old; }, 1800);
    }
    else if (t.hasAttribute("data-retry")) say("This is a static preview, so nothing was retried.");
  });

  // Composer: preview only
  $("#form").addEventListener("submit", function (e) { e.preventDefault(); say("Preview only: nothing was sent. Your text is still in the box."); });
  $("#q").addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#form").requestSubmit(); } });

  // Search: filter by name, title, and topic words
  function filter(scope, q) {
    q = q.trim().toLowerCase();
    var shown = 0;
    $$("#" + scope + "-list li[data-kw]").forEach(function (li) {
      var ok = !q || li.dataset.kw.indexOf(q) > -1;
      li.hidden = !ok; if (ok) shown++;
    });
    $$("#" + scope + "-list [data-group]").forEach(function (g) { g.hidden = !$$("li[data-kw]:not([hidden])", g).length; });
    var none = $("#" + scope + "-none"); none.hidden = shown > 0; $("[data-q]", none).textContent = q;
    $("#" + scope + "-count").textContent = shown === 1 ? "1 expert" : shown + " experts";
  }
  $$("[data-search]").forEach(function (inp) { inp.addEventListener("input", function () { filter(inp.dataset.search, inp.value); }); });
  $$("[data-search]").forEach(function (inp) { inp.addEventListener("keydown", function (e) { if (e.key === "Escape") { inp.value = ""; filter(inp.dataset.search, ""); } }); });

  // Switching to desktop from a list-only phone view: show the team
  desktop.addEventListener && desktop.addEventListener("change", function () {
    if (desktop.matches && !state.expert && state.tab !== "team") { state.tab = "team"; }
    render(false);
  });

  render(false);
  // Initial deep link for review: #victor or #team
  if (location.hash === "#victor") go("victor");
})();
