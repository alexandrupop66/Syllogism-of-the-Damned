# Syllogism of the Damned

A surreal browser experience where a routine application form transforms into an impossible bureaucratic puzzle.

**Status:** v0.1 local prototype; not submitted, not deployed.

**Competition:** Kiroween 2026 · Costume Contest · Submission deadline 04 December 2026 22:00 GMT.

## Play

1. Open the form and enter a fictional name (2–32 characters).
2. Submit your application. The interface fractures into interactive pieces.
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

No install step or build pipeline is required.

## Current scope

- Four act UI: form → fracture → verdict → escape.
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
- This is a local prototype. Automated unit tests do not establish general usability or contest readiness.

## Licence

MIT. See [`LICENSE`](LICENSE).
