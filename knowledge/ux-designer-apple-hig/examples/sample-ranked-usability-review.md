# Worked example: a ranked usability review

Study this before writing any review. It shows the format, the level of evidence, and how specific fixes should be. The screen is **hypothetical** (a café loyalty sign-up page), so the problems here are illustrative, not about the Experts app.

---

## Usability review: "Join Rewards" sign-up (phone)

**Reviewer:** Wren · **Date:** 2026-11-21 · **Method:** walked 4 tasks on an iPhone-size viewport (390×844) and a desktop browser; keyboard-only and VoiceOver pass; accessibility audit (light, dark, increased contrast, reduce motion, reduce transparency).

**Tasks:** (1) join rewards, (2) recover from a wrong phone number, (3) find the rewards balance later, (4) do it all at 200% text size.

### Bottom line

People can't finish sign-up when anything goes wrong: the form clears itself on error and the error text is a code. Fix #1 and #2 first — together they're under a day of work and remove the biggest drop-off.

### Ranked problems

| # | Problem | Heuristic | Severity | Evidence | Fix | Effort |
|---|---|---|---|---|---|---|
| 1 | Form clears all fields when the phone number is invalid | User control; error recovery | 4 Critical | `signup.js:88` resets state on any 4xx; reproduced 3/3 | Keep all input; mark only the phone field; focus it | S |
| 2 | Error says "Error 422: invalid_msisdn" | Match real world; error recovery | 3 Major | Screenshot `err-1.png` | "That phone number looks too short. Use 10 digits, like 305 555 0134." + `aria-describedby` on the field | S |
| 3 | "Join" button is 32px tall | Accessibility (targets) | 3 Major | Measured 32×120px; HIG minimum 44×44pt | `min-height: 44px` | S |
| 4 | Gray hint text #8e8e93 on white | Accessibility (contrast) | 3 Major | 3.3:1 (needs 4.5:1) | Use `--label-secondary` #6c6c70 (5.2:1) | S |
| 5 | Rewards balance is under Account › Settings › Membership | Recognition over recall; navigation | 2 Minor | 3 taps; 2 of 3 testers looked in "Rewards" first | Show the balance on the Rewards tab; link from Account | M |
| 6 | Success screen auto-dismisses after 2 s with a zoom animation | Visibility; reduce motion | 2 Minor | No Reduce Motion handling in `success.css` | Stay until dismissed; fade instead of zoom under `prefers-reduced-motion` | S |
| 7 | At 200% text, the "Terms" checkbox label is cut off | Accessibility (text size) | 2 Minor | Fixed `height: 48px` on `.row` | Remove fixed height; let rows grow | S |
| 8 | Glass header sits over the form fields | Consistency (glass only on navigation) | 1 Cosmetic | Fields scroll under a clear-glass header with no dim | Use regular glass for the header and a scroll-edge fade | S |

Severity: 4 blocks a task or excludes users · 3 causes errors/abandonment · 2 slows or annoys · 1 polish. Ranked by severity × frequency × reach.

### Quick wins (this week)

1. Keep input on error (#1) · 2. Plain-language error with an example (#2) · 3. 44px button and 4.5:1 hint text (#3, #4).

### What's working — keep it

- One-screen form, three fields only.
- Clear primary action; the tab bar stays visible.

### Open questions for testing with real customers

- Do people expect to join with email or phone in Miami? (Ask 5 customers in English and Spanish.)
- Is "Rewards" or "Puntos" the clearer tab label for bilingual users?

— Wren, Apple-Style UX Designer (Human Interface Guidelines)
