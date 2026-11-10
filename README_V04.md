# Syllogism of the Damned v0.4 — Bureau's Logic

This is a local implementation candidate intended for `feature/syllogism-bureaus-logic-v0.4`, originating from the v0.3 branch. The original v0.3 files, tests and architecture remain separate; this version introduces a new engine and UI modules.

Run `python -m http.server 4173` from project root, open `http://localhost:4173` (browser module imports require HTTP), then `npm test` and `npm run check`.

Gameplay: swap word stamps in two levels, inspect source-labelled logical deductions, submit only a proven authorised result. First puzzle 6 combinations; second puzzle 24. Door responds to truth, not arbitrary clicks. Undo/reset, keyboard selection, drag/drop, mobile and reduced motion supported.

**Provenance:** code for this draft was created outside the Kiro IDE because no Kiro execution tool is available in the chat. The `.kiro` specs are preparation, not proof of Kiro execution. Substantial real Kiro work with authentic evidence is required before Kiroween submission. A UI interaction tested in an isolated Chromium injection harness does not prove a deployed site works.

**Open design assumption:** Puzzle 1's single GOAL is enforced by a printed staff-limitation rule (R1 cannot target CLERK). The entire original full v0.4 premise table was not available in the transferred conversation; reconcile this limitation against it in Kiro before calling the puzzle spec final.

**Release status:** development draft, not deployed, not submitted, not final Kiro-compliant build.
