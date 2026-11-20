# Ask Victor from Node.js (Claude Agent SDK)

A small script that runs **Victor**, the `real-estate-advisor` agent, outside Claude Code using the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview).

It loads:

- Victor's definition from `../.claude/agents/real-estate-advisor.md`: personality, instructions, model (`sonnet`), and blocked tools.
- The 10 skills listed in his `skills:` field, from `../.claude/skills/`. Their text is added to his system prompt.
- Every document in `../knowledge/real-estate-advisor/`, included in the question.
- The project's `CLAUDE.md`, with read-only access to `docs/` so he can look up the research.

It then runs Victor as the main agent and prints his answer.

## Requirements

- Node.js 18 or newer (`node --version`)
- An Anthropic API key from https://console.anthropic.com. Each question is billed to that key.

## 1. Install

From the repository root:

```bash
cd sdk
```

```bash
npm install
```

## 2. Set your API key

macOS / Linux:

```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Windows PowerShell:

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-your-key-here"
```

Don't commit the key or put it in any file in this repository.

## 3. Check that Victor loads (no API call, free)

```bash
npm run check
```

Expected output ends with:

```
SDK:       registered 'real-estate-advisor' — Commercial real estate and site selection advisor. ...
CHECK OK: Victor loads correctly. Set ANTHROPIC_API_KEY and pass a question to run him.
```

## 4. Ask Victor a question

```bash
node ask-victor.mjs "Should we sign the Brickell lease as written? What are the top three things to negotiate?"
```

or

```bash
npm run ask -- "Is a 1,200 sq ft space in Coral Gables at \$58 plus \$20 NNN affordable for our base case?"
```

His answer goes to standard output. Loading details, the model used, cost, and turns go to standard error, so you can save just the answer:

```bash
node ask-victor.mjs "Score the Brickell offer against our site criteria" > answer.md
```

## How it works

| Step | Code in `ask-victor.mjs` |
|---|---|
| Parse the agent file (frontmatter + prompt) | `loadAgent()` with `gray-matter` |
| Add the listed skills to the system prompt | `loadAgent()` reads each `.claude/skills/<name>/SKILL.md` |
| Load the knowledge folder | `loadKnowledge()` puts text files in the prompt and lists other files by path |
| Register Victor with the SDK | `agents: { "real-estate-advisor": definition }` |
| Run Victor as the main agent | `agent: "real-estate-advisor"`, `model` from his file |
| Load the project's settings and `CLAUDE.md`, and run from the repo root | `settingSources: ["project"]`, `cwd: <repo root>` |
| Keep him read-only | `allowedTools: ["Read", "Glob", "Grep"]`, `permissionMode: "dontAsk"` |

Edits to Victor's agent file, his skills, or his knowledge folder are picked up on the next run. Nothing needs rebuilding.

**Calculations:** Victor's methods ask for calculations in code. This script gives him read-only tools, so he works the numbers out without running code. To let him run code, add `"Bash"` to `allowedTools`. Do this only on a machine where you're comfortable with that.

**Another agent:** change `const AGENT = "real-estate-advisor"` at the top of `ask-victor.mjs` to any agent name in `../.claude/agents/`.
