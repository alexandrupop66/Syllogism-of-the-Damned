# Syllogism of the Damned

A surreal browser experience where a routine application form transforms into an impossible bureaucratic puzzle.

**Status:** v0.2 metamorphosis prototype on a separate branch; not submitted, not deployed.

**Competition:** Kiroween 2026 · Costume Contest · Submission deadline 04 December 2026 22:00 GMT.

## Play

1. Open the form and enter a fictional name (2–32 characters).
2. Submit your application. Three actual form controls fly into the next scene: name → identity, footnote → consent, submit button → authority.
3. Recover the three pieces by clicking/tapping or dragging each fragment to its matching evidence socket.
4. Open the exit and see the ending. Replay is available.

The demo is deterministic: no AI backend, accounts, external API, telemetry, or user data transmission. The entered name remains in this browser session and is not stored.

## Run locally

Requires a modern browser and Node >= 20 for tests.

```bash
python3 -m http.server 4173
# open http://localhost:4173
node --test tests/*.test.mjs
```

Windows PowerShell:

```powershell
py -m http.server 4173
```

No install step or build pipeline is required. Optional browser smoke tests use the independent Python `playwright` package and Chromium (`python tests/browser_smoke.py`). The isolated harness reassembles the exact HTML, CSS and JavaScript source because local file/localhost navigation can be restricted in managed browsers. This is not equivalent to testing a deployed URL.

## Current scope

- Four act UI: form → physically animated fracture → verdict → escape.
- Three source controls are animated to their corresponding in-world puzzle pieces with a tested geometrical flight plan (no synthetic screen change).
- Reduced-motion users skip the flight and reach the playable puzzle immediately.
- Responsive full-viewport desktop presentation, visible interaction feedback, reduced-motion support, keyboard and pointer alternatives.
- Original CSS and SVG visuals; no external artwork or dependencies.
- Source in `src/`; deterministic state transitions are tested with Node's built-in test runner.

## Competition compliance and Kiro evidence

- Public GitHub repo, root `/.kiro` and OSI licence are part of the delivery plan.
- `/.kiro/specs/experience/` and `/.kiro/steering/` are draft instructions to run inside the user's Kiro environment.
- **Actual Kiro IDE/CLI execution has not been independently verified yet.** Preparing Kiro files alone must not be presented as evidence that Kiro built or tested this app. The owner must execute and retain authentic Kiro session evidence before submission.
- The project requires a public working URL, a video of the real application under 3 minutes and submission materials before the deadline. These are pending.

## Safety and limitations

- The experience deliberately distorts a fictional form. It never changes browser settings, uses fullscreen unexpectedly, or accesses local files.
- There are no purchases, remote services, or third-party trademarks in the game UI.
- This is a local prototype. 18 Node unit tests plus an optional Chromium smoke harness cover state, flight geometry, keyboard, reduced-motion and browser layout. These checks do not establish general usability or contest readiness.

## Licence

MIT. See [`LICENSE`](LICENSE).
