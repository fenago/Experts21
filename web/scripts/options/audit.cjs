const { chromium, devices } = require("playwright");
const fs = require("fs");
const S = process.env.AUDIT_OUT || require("node:os").tmpdir(); // where screenshots/raw results go
// Needs axe-core: npm i --no-save axe-core, and a preview server on :4175 (npx vite preview --port 4175)
const axeSrc = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const BASE = "http://localhost:4175/options/";
const PAGES = { A: "a-liquid-glass.html", B: "b-clean-apple-light.html", C: "c-dark-pro.html" };
const only = process.argv[2];
const shots = process.argv.includes("--shots");

const MODES = [
  ["light", { colorScheme: "light" }, ""],
  ["dark", { colorScheme: "dark" }, ""],
  ["light+more (media)", { colorScheme: "light", contrast: "more" }, ""],
  ["dark+more (media)", { colorScheme: "dark", contrast: "more" }, ""],
  ["reduced motion", { colorScheme: "light", reducedMotion: "reduce" }, ""],
  ["forced colors", { forcedColors: "active" }, ""],
  ["light, reduce-transparency switch", { colorScheme: "light" }, "?a11y=reduce-transparency"],
  ["dark, reduce-transparency switch", { colorScheme: "dark" }, "?a11y=reduce-transparency"],
  ["light, more-contrast switch", { colorScheme: "light" }, "?a11y=more-contrast"],
  ["dark, more-contrast switch", { colorScheme: "dark" }, "?a11y=more-contrast"],
];
const SCREENS = {
  desktop: { viewport: { width: 1280, height: 860 } },
  phone: { ...devices["iPhone 13"] },
};
// view steps run after load
const VIEWS = {
  desktop: [
    ["team", async (p) => {}],
    ["victor", async (p) => { await p.click('#s-list [data-expert="real-estate-advisor"]'); }],
    ["victor+about", async (p) => { await p.click('#s-list [data-expert="real-estate-advisor"]'); await p.click("#about-btn"); }],
    ["other expert (Gloria)", async (p) => { await p.click('#s-list [data-expert="permitting-specialist"]'); }],
    ["search no match", async (p) => { await p.fill("#s-q", "zzz"); }],
  ],
  phone: [
    ["team", async (p) => {}],
    ["experts list", async (p) => { await p.click('.tab[data-tab="experts"]'); }],
    ["history", async (p) => { await p.click('.tab[data-tab="history"]'); }],
    ["victor", async (p) => { await p.click('.tab[data-tab="experts"]'); await p.click('#m-list [data-expert="real-estate-advisor"]'); }],
    ["search no match", async (p) => { await p.click('.tab[data-tab="experts"]'); await p.fill("#m-q", "zzz"); }],
  ],
};

(async () => {
  const b = await chromium.launch();
  const out = {};
  for (const [L, file] of Object.entries(PAGES)) {
    if (only && only !== L) continue;
    out[L] = { axe: {}, targets: {}, errors: [] };
    for (const [sname, sconf] of Object.entries(SCREENS)) {
      const ctx = await b.newContext(sconf);
      const page = await ctx.newPage();
      page.on("pageerror", (e) => out[L].errors.push(String(e)));
      for (const [mname, media, qs] of MODES) {
        if (L === "C" && /^light/.test(mname)) { /* dark-only option: light prefs still tested to prove it stays dark */ }
        await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference", forcedColors: "none", contrast: "no-preference", ...media });
        for (const [vname, step] of VIEWS[sname]) {
          await page.goto(BASE + file + qs);
          await step(page);
          await page.waitForTimeout(250);
          await page.addScriptTag({ content: axeSrc });
          const r = await page.evaluate(() => axe.run({ runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }));
          const key = `${sname} | ${mname} | ${vname}`;
          const viol = r.violations.map((v) => `${v.id}(${v.nodes.length}): ${v.nodes.slice(0, 2).map((n) => n.target.join(" ") + " " + (n.any[0] ? n.any[0].message : "")).join(" ; ")}`);
          out[L].axe[key] = viol;
          // targets
          const small = await page.$$eval("a, button, input, textarea, select, summary, [role=button]", (els) =>
            els.filter((e) => {
              const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return false;
              const r = e.getBoundingClientRect();
              if (!r.width || !r.height) return false;
              if (e.classList.contains("sr-only") || e.classList.contains("skip")) return false;
              return r.width < 43.5 || r.height < 43.5;
            }).map((e) => e.outerHTML.slice(0, 90) + " " + Math.round(e.getBoundingClientRect().width) + "x" + Math.round(e.getBoundingClientRect().height))
          );
          out[L].targets[key] = small;
          if (shots && vname === "team" && ["light", "dark"].includes(mname)) await page.screenshot({ path: `${S}/sable/shots/${L}-${sname}-${mname}-team.png` });
        }
      }
      await ctx.close();
    }
  }
  fs.writeFileSync(S + "/sable/audit-raw.json", JSON.stringify(out, null, 1));
  for (const L of Object.keys(out)) {
    const bad = Object.entries(out[L].axe).filter(([, v]) => v.length);
    const badT = Object.entries(out[L].targets).filter(([, v]) => v.length);
    console.log(`== ${L}: axe runs ${Object.keys(out[L].axe).length}, with violations ${bad.length}; target failures ${badT.length}; page errors ${out[L].errors.length}`);
    bad.slice(0, 12).forEach(([k, v]) => console.log("  AXE", k, "\n     ", v.join("\n      ")));
    badT.slice(0, 8).forEach(([k, v]) => console.log("  TARGET", k, v.slice(0, 3)));
    out[L].errors.slice(0, 3).forEach((e) => console.log("  ERR", e));
  }
  await b.close();
})();
