# v0.3 QA report — 08/11/2026

## Execution level
Local source and a self-contained **isolated Chromium** harness. Browser navigation to local files/localhost is blocked by the managed environment. This is not a deployed/hosted URL test.

## Test evidence

| Suite | Result |
| --- | --- |
| `npm test` | 31/31 PASS (pure state, geometry, invalid input, replay) |
| `npm run check` | PASS, four main JavaScript files |
| `python3 tests/browser_smoke.py` | PASS at 1366×768, 1024×768, 390×844, and 1366×768 reduced motion |
| `python3 tests/browser_edge_cases.py` | PASS: HTML-like name text-only, invalid drop, Escape, selecting before slot, reset, no network requests |
| Screenshot inspection | Completed at locked and rewritten scenes, including mobile |
| Real demo capture | 600 real Chromium frames at 20 fps, encoded into a 30.000-second MP4; no simulated state changes |

## Geometry and limitations
- 32 visible DOM slices in transition; all removed after animation, 32 decorative panels remain in the room.
- Desktop document height matches viewport at 1366×768 and 1024×768 (no vertical scroll). Mobile 390×844: 885 px document, 41 px vertical scroll; no horizontal scroll.
- No JavaScript page errors in the four smoke scenarios or the adversarial scenario.
- Test harness assembles the exact source modules into a classic script after stripping ES `import`/`export` for isolated browser injection. This is a tool/environment accommodation, not a production build.
- The system Chromium engine used for tests is not evidence of Safari/Firefox compatibility.
- No independent new-user test, hosted deployment, or authentic Kiro IDE/CLI usage has been performed. Those checks remain open.

## Stop conditions
Any regression in the NOT movement, unsafe HTML handling, disabled exit gating, desktop viewport fit, or reduced-motion route blocks the next milestone. The v0.2 branch and v0.1 main are recovery points.
