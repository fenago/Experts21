---
name: states-and-microcopy
description: "Design empty, loading, error, partial, success, and offline states and write the microcopy for them in plain, friendly language (English and Spanish where needed). Use when designing or reviewing any screen state, error message, button label, or placeholder."
---

# States and microcopy

## Every screen needs these states

| State | Must answer | Good pattern |
|---|---|---|
| **Empty (first use)** | What is this? What can I do? | One sentence + 2–3 example prompts the user can tap |
| **Loading / working** | Is it working? How long? Who's working? | Named progress ("Victor is reading your lease offer…"), skeletons, never a bare spinner for more than ~1 s |
| **Streaming / partial** | Can I read it yet? Can I stop it? | Show text as it arrives; a clear Stop button |
| **Error** | What happened? Is my work lost? What do I do now? | Plain words, no codes first, a Retry action, keep the user's input |
| **Partial failure** | Which part failed? | Mark the failed piece only ("Daniel couldn't answer — the others did"), offer retry for that piece |
| **Success / done** | Is it finished? What next? | Clear end state, next-step suggestions |
| **Offline / not configured** | Is it me or the app? | Say which, and how to fix it |
| **Locked / needs password** | Why can't I use it? | Explain once, one field, no blame |

## Microcopy rules

1. **Plain language**, sentence case, short. Write for a busy consultant, not a developer.
2. **Say what happened, then what to do.** "Couldn't reach the experts. Check your connection and try again." — not "Error 502".
3. **No blame**, no jokes in errors, no exclamation marks in errors.
4. **Buttons are verbs that say the outcome**: "Ask the team", "Try again", "Stop answer" — not "OK", "Submit".
5. **Name the people**: the team has personas (Elena, Victor, Daniel…) — use them in status text.
6. **Keep the user's input** on failure; never clear the text box when sending failed.
7. **Accessibility**: status changes announced (`aria-live="polite"`), errors linked to the control (`aria-describedby`), don't rely on color alone.
8. **Spanish**: for customer-facing café copy, use `bilingual-copywriting`. The consultant app is English-first.

## Output

For each state: trigger, layout sketch (or HTML), exact copy, accessibility notes. Show good vs. bad examples side by side when reviewing.
