# Worked example: empty, loading, and error states — good vs. bad

Study this before designing any state. Context: a chat screen where a user asks an expert (e.g. Victor, the real-estate advisor) a question. Rules come from `.claude/skills/states-and-microcopy/SKILL.md` and HIG Accessibility.

---

## 1. Empty state (first visit)

| ❌ Bad | ✅ Good |
|---|---|
| *(blank white area)* or "No messages." | **Ask Victor about sites and leases.** Try one of these: · "Is $72/sq ft too much for a 1,150 sq ft Brickell space?" · "What should I ask the landlord for?" · "Score this site for me" |
| Why bad: says what's missing, not what to do. | Why good: says who this is and what they're good at, and gives tappable examples (recognition over recall). |

```html
<section class="empty" aria-labelledby="empty-title">
  <h2 id="empty-title">Ask Victor about sites and leases</h2>
  <p>Try one of these:</p>
  <ul class="suggestions">
    <li><button type="button">Is $72/sq ft too much for a 1,150 sq ft Brickell space?</button></li>
    <li><button type="button">What should I ask the landlord for?</button></li>
  </ul>
</section>
```

## 2. Loading / working state

| ❌ Bad | ✅ Good |
|---|---|
| A spinner with no text for 20 seconds | "**Victor is reading your lease offer…**" then the answer streams in as it's written; a **Stop** button is always visible |
| "Loading…" | For the whole team: "Elena chose Victor and Daniel · Victor ✓ done · Daniel writing…" |
| Why bad: no idea who's working, how long, or whether it froze. | Why good: named, specific progress; partial text is readable; the user can stop. |

```html
<p class="status" role="status" aria-live="polite">Victor is reading your lease offer…</p>
<button type="button" class="stop">Stop answer</button>
```

Under `prefers-reduced-motion: reduce`, replace pulsing/shimmer with static text.

## 3. Error state

| ❌ Bad | ✅ Good |
|---|---|
| "Error: Request failed (502)" | "**Victor couldn't answer just now.** The connection to the expert service dropped. Your question is still here — **Try again**." |
| "Something went wrong!" | Whole team, partial failure: "Daniel couldn't answer — the other experts did. **Retry Daniel** or continue without him." |
| Text box cleared after failure | Text box keeps the question |
| Error shown only in red | Icon + text + color; announced to screen readers |
| Why bad: a code, no cause, no next step, work lost. | Why good: what happened, that nothing is lost, and one clear action. |

```html
<div class="error" role="alert">
  <svg aria-hidden="true">…</svg>
  <p><strong>Victor couldn't answer just now.</strong> The connection dropped. Your question is still here.</p>
  <button type="button">Try again</button>
</div>
```

## 4. Not configured / locked (setup errors)

| ❌ Bad | ✅ Good |
|---|---|
| "ANTHROPIC_API_KEY is not set." shown to every visitor | Visitor: "The experts aren't available right now. Please try again later." · Admin (in logs/README): "Add ANTHROPIC_API_KEY in Netlify → Environment variables, then redeploy." |
| "401" | "This app is password-protected. Enter the team password to continue." |

## Microcopy checklist

- Plain words, sentence case, no codes up front, no blame, no exclamation marks in errors.
- Say what happened → what it means → what to do.
- Buttons say the outcome: "Try again", "Stop answer", "Ask the team".
- Use the personas' names in status text.
- Keep the user's input on every failure.
