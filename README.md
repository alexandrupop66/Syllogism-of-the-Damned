# Syllogism of the Damned — The Bureau's Logic (v0.4)

A browser puzzle where changing the words in bureaucratic rules changes what the Bureau can logically prove, and therefore whether a physical-looking exit will open.

**Competition:** Kiroween 2026 · Costume Contest · deadline 04/12/2026 22:00 GMT.

**Release status:** Development candidate on `feature/syllogism-bureaus-logic-v0.4`. Not deployed or submitted. This version was implemented locally outside Kiro, and **real Kiro IDE/CLI execution is still required**. The GitHub `.kiro` files are specifications, not proof of Kiro use. Do not assert Kiro authorship of the current code.

## Open and play

Install nothing. Start a static HTTP server from the repository root:

```bash
python3 -m http.server 4173
# open http://localhost:4173/
```

Windows PowerShell:

```powershell
py -m http.server 4173
```

The game uses native browser ES modules. Opening `index.html` directly as `file://` may fail because module imports are restricted by the browser.

- Case 1: Avery is initially DETAINED. Swap two visible class stamps to change which premises can be proven. A completed proof changes the door to PROVEN; select Submit to enter Case 2.
- Case 2: Two initial declarations, several implications, and Standing Order 7. A contradiction is recoverable, but blocks release. Discover a proof of AUTHORISED without proving DETAINED, then submit.
- Click/tap one word and then another to swap. Keyboard Enter or Space works on focused words. On desktop, drag one word onto another. Escape cancels selection. Undo and Reset Case are always available unless the case is already submitted successfully; Replay becomes available at the end.

## Active files

- `index.html`: real UI and interactive HTML document.
- `src/bureau.css`: original CSS Bureau room, responsive parchment/rules/door/ledger presentation.
- `src/bureau-engine.mjs`: deterministic deduction, outcomes, state transitions, swap validation, Undo and submit gating.
- `src/bureau-app.js`: DOM interaction, drag/drop, keyboard feedback and state-dependent room rendering.
- `tests/bureau-engine.test.mjs`: exhaustive deterministic outcome distributions and unit tests.
- `tests/browser_v04.py`: isolated Chromium interaction harness for desktop, mobile, keyboard, drag, Undo, contradiction, replay.
- `.kiro/specs/the-bureaus-logic/`: v0.4 design requirements, architecture and Kiro work tasks.
- `docs/QA_REPORT_v0.4.md`: verification results and limitations.

v0.3 historical modules (`src/engine.mjs`, `src/app.js`, `src/metamorphosis.mjs`, `src/architecture.mjs`) remain present on this branch for comparison. They are **not used** by the v0.4 browser entry point. The independent v0.3 branch is unchanged.

## Test

Requires Node.js >=20. No npm dependencies are needed.

```bash
npm test
npm run check
python3 tests/browser_v04.py   # optional: requires Playwright and Chromium at /usr/bin/chromium
```

The 23 new v0.4 engine tests passed. The browser harness passed at 1366×768, 1024×768 and 390×844, using an injected-document environment because navigation to localhost and file URLs was blocked by the test runner. Desktop pages had no scroll; mobile does scroll vertically. See QA report for the difference between local simulation and hosted validation. The inherited v0.3 tests were not re-run as part of the final combined branch.

## Logic contract and one open assumption

Puzzle 1: 6 permutations; DETAINED 2, UNSUPPORTED 3, CONTRADICTION 0, GOAL 1; minimum 1 swap. The documented and visible staff limitation voids Form L-12 if R1 targets CLERK. This is a provisional design choice, because the complete original v0.4 permutation table was unavailable when this branch was built. Reconcile against that table before claiming the original spec is matched.

Puzzle 2: 24 permutations; DETAINED 10, UNSUPPORTED 10, CONTRADICTION 2, GOAL 2; minimum 2 swaps. Both solutions remain valid. Contradiction never disables Undo or further swaps.

## Kiro compliance and release

Kiro 2026 explicitly requires a working software application created using Kiro. Prepared spec, steering and task files do not show actual use. Substantial edits/review/testing must take place in the genuine Kiro IDE or CLI and be recorded truthfully. Do not fabricate Kiro logs, screenshots or development history.

Before submission: reconcile the Puzzle 1 assumption, do genuine Kiro work, validate a live URL and browser UX (including a real new user), confirm licence and assets, record the exact delivered version and create a public YouTube demo under 3 minutes. Deployment and submission need separate approval.

## Licence

MIT; see LICENSE. No third-party runtime dependencies or external assets.
