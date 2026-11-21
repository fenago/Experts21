# Experts Web App

A React chat app for talking to the expert team in this repository.

- **Sidebar:** every agent, with first name, title, model (opus / sonnet / haiku), and voice. Hover over an agent to see its working style.
- **Chat window:** a separate conversation with each expert. Each expert answers with its own personality, skills, knowledge folder, and the research pack.
- **Ask the whole team:** Elena, the orchestrator, picks the experts and writes each one a brief. The experts answer in parallel, and you can watch each answer stream in. For big decisions Frank (red team) stress-tests the advice. Elena then combines it all into one answer.

**Your API key stays on the server.** The browser talks only to three Netlify Functions (`/api/chat`, `/api/route`, `/api/synthesize`). Only those functions call the Claude API, using the `ANTHROPIC_API_KEY` environment variable you set in Netlify.

## Deploy to Netlify (step by step)

You need a Netlify account (free tier is fine), this repository on GitHub, and an Anthropic API key from https://console.anthropic.com (**Settings → API Keys → Create Key**).

1. **Import the site.** In Netlify, go to **Add new project → Import an existing project → GitHub**, authorize Netlify if asked, and pick the `Experts21` repository.
2. **Keep the build settings as they are.** Netlify reads `netlify.toml` from the repository root, which sets the base directory `web`, the build command `npm run build`, the publish directory `dist`, and the functions in `netlify/functions`. Leave the fields blank or as pre-filled. For the branch, choose `main`.
3. **Add your API key before the first deploy.** On the same page, open **Add environment variables** (or after creating the site: **Site configuration → Environment variables → Add a variable**):
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key (starts with `sk-ant-`)
   - Mark it as a **secret** if offered, and make sure the **Functions** scope is included.
4. **(Strongly recommended) Add a password.** Anyone with the site URL could otherwise spend your API credits. Add a second variable:
   - Key: `APP_PASSWORD`
   - Value: a password you choose

   The app will ask for it once per browser session.
5. **Deploy.** Click **Deploy**. The build takes about a minute. Then open the site URL Netlify gives you, such as `https://your-site.netlify.app`.
6. **If you added or changed variables after deploying**, go to **Deploys → Trigger deploy → Deploy site** so the functions pick them up.

**Updating the team:** every push to `main` redeploys automatically. The build re-reads `.claude/agents/`, `.claude/skills/`, `knowledge/`, and `docs/`, so a new knowledge document or an edited agent shows up after the next deploy.

## Design option previews

Static design previews by Sable (the UI designer) live in `public/options/` and are published with the site at **`/options/`** (for example `https://your-site.netlify.app/options/`). They don't call the API and don't change the live app.

## Optional environment variables

| Variable | Default | What it does |
|---|---|---|
| `APP_PASSWORD` | not set | Requires this password for every API call |
| `MODEL_OPUS` / `MODEL_SONNET` / `MODEL_HAIKU` | `claude-opus-5-5` / `claude-sonnet-5-5` / `claude-haiku-5-5` | Which model ID each tier uses |
| `EFFORT_OPUS` / `EFFORT_SONNET` / `EFFORT_HAIKU` | `medium` / `low` / `low` | Thinking depth per tier (`low`, `medium`, `high`, `xhigh`, `max`). Higher is slower and costs more |

## Run it on your computer

Requires Node.js 20.19 or newer.

```bash
cd web
```

```bash
npm install
```

To check the build and run the tests (no API key needed; a mock API stands in for Claude):

```bash
npm test
```

To use the real chat locally, the functions must run too, so use the Netlify CLI rather than plain `vite`:

```bash
npm install -g netlify-cli
```

```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

```bash
netlify dev
```

Then open the URL it prints (usually http://localhost:8888). Run `netlify dev` from the repository root or from `web/`; it reads the root `netlify.toml`.

## How it works

| Part | File |
|---|---|
| Reads agents, skills, knowledge folders, research, and roster domains at build time | `scripts/build-team.mjs` writes `src/generated/team.json` (browser: names, personalities, models) and `netlify/lib/generated/team-server.json` (functions only: full prompts) |
| One expert, streamed | `netlify/functions/chat.mjs` |
| Elena chooses experts (structured JSON output) | `netlify/functions/route.mjs` |
| Elena combines the memos, streamed | `netlify/functions/synthesize.mjs` |
| Shared server code: models, effort, prompt caching, errors, password | `netlify/lib/claude.mjs` |
| UI | `src/App.jsx`, `src/api.js`, `src/styles.css` |

Details:

- **Models:** each agent's `model:` line maps to a model ID (see the table above).
- **Refusal fallbacks:** Opus and Sonnet requests use Anthropic's server-side refusal fallback (`fallbacks: "default"`), so a declined request is retried on a recommended fallback model instead of failing. Haiku doesn't support it.
- **Prompt caching:** the research pack and each agent's prompt are cached, so follow-up questions cost less and start faster.
- **No tools:** experts in the web app can't search the web, run code, or edit files. Each expert is told that its knowledge folder, skills, and the research pack are already included in its prompt. To work with files and tools, use Claude Code in the repository.
- **Time limits:** Netlify stops each function call after a fixed time limit (Netlify's docs say up to 60 seconds for streamed responses). Each function call makes exactly one Claude request, and answers are kept to memo length, to fit inside that limit. If an answer is cut off, the app says so; ask for a shorter answer, or lower `EFFORT_OPUS` to `low`.
- **Costs:** a whole-team question makes about 4–8 Claude calls: routing, 2–5 experts, an optional red team, and synthesis. Single-expert chats make one call per message.
- **Privacy:** knowledge folders and the research pack are sent to the Claude API as part of each prompt. Keep sensitive personal data out of `knowledge/`.
