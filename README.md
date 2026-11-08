# Syllogism of the Damned

**A surreal, interactive browser game in which the words on a form control the laws of the room.**

Kiroween 2026 · Costume Contest · 04/12/2026 22:00 GMT submission deadline.

**Current status:** v0.3 source prototype on a separate branch. It is not deployed or submitted. The `main` branch and the v0.2 branch remain separate.

## The 30-second idea

1. Enter a fictional name and submit a perfectly ordinary form.
2. The actual document breaks into **32 visual pieces**. Those pieces travel into a chamber built from its own paper, borders and stamped rules.
3. The Bureau says **YOU ARE NOT AUTHORISED TO LEAVE**, and your declaration says **I DO [ ___ ] ACCEPT THE TERMS**.
4. Move the highlighted word **NOT** into the empty space, by dragging or selecting it and choosing the destination. Both statements change. The walls retreat, and a physical-feeling portal opens.
5. Enter the exit and see the ending.

No accounts, APIs, telemetry, AI runtime, database or server are needed. The name is not persisted or transmitted.

## Run

Use a modern Chromium, Firefox or Safari browser; Node.js >= 20 for the unit tests.

```bash
python3 -m http.server 4173
# browse http://localhost:4173
```

Windows PowerShell:

```powershell
py -m http.server 4173
```

```bash
npm test           # 31 pure Node tests
npm run check      # checks JavaScript syntax
python3 tests/browser_smoke.py        # optional Chromium+Playwright checks
python3 tests/browser_edge_cases.py   # optional negative/adversarial checks
python3 tests/demo_record.py          # optional 30s live browser recording via ffmpeg
```

Python browser tests require `playwright` and an installed Chromium. The test scripts use the system browser at `/usr/bin/chromium`; change that local executable path as appropriate. For this managed testing environment, `file://` and `localhost` browser navigation were blocked, so the harness injects the **same HTML/CSS/JS**, stripping only ES module import/export syntax to assemble the scripts. These tests **are not equivalent to testing a deployed site or a live hosted URL**.

## User experience

- One primary action at a time; the rule explains the next move. Clicking the destination without first selecting the word displays an explicit hint.
- Mouse dragging and pointer clicks; mobile tap-select/tap-destination; keyboard Enter/Space and Escape to cancel selection.
- Word movement is validated by a small, deterministic state machine. False or incomplete moves cannot unlock the exit.
- 32 **decorative** paper fragments and only **one** required word-placement interaction. The fragmentation is spectacle, not a 32-piece hidden-object task.
- Reduced-motion mode bypasses cinematic flights and preserves the full playable path.
- Initial input is kept in memory for the current page session only; inserted into UI through `textContent`.
- No fullscreen takeover, remote requests or external visual assets.

## Layout and visual structure

- `src/engine.mjs`: pure, testable state transitions.
- `src/architecture.mjs`: deterministic positions of 32 in-world panels.
- `src/metamorphosis.mjs`: 8×4 visual slices of the original DOM document that move to the 32 panel targets.
- `src/app.js`: pointer, keyboard, feedback, safety and navigation.
- `src/styles.css`: responsive 2.5D CSS chamber and transformation (no 3D libraries).
- `tests/`: unit, browser smoke, negative cases, real interaction capture.
- `.kiro/`: design/acceptance specifications and developer steering **prepared for use with Kiro**.

## Validation and known limitations

- Node unit tests: **31/31 pass** in the local run reported in `docs/QA_REPORT_v0.3.md`.
- Isolated Chromium browser: tested at 1366×768, 1024×768, 390×844 and reduced-motion. Desktop did not scroll; mobile document scrolled 41 pixels vertically. No console page errors observed.
- Negative cases: wrong drop, empty destination without a selected word, Escape cancellation, HTML-like name, replay, no external requests.
- The supplied 30s preview was captured from actual browser interactions with the project source, not simulated states or a storyboard. It is not the final Kiroween submission video.
- **Unverified:** public deployment, external user testing, real Kiro IDE/CLI execution evidence, cross-browser compatibility, final contest submission.

## Kiro evidence requirement

These `.kiro` files are instructions and specifications, **not proof that the game was built with Kiro**. The project owner must execute actual implementation or review tasks in Kiro and preserve authentic session evidence before submission; do not invent Kiro credit usage or agent activity.

## Licence

MIT. See [`LICENSE`](LICENSE). Original CSS/SVG and game logic. No third-party runtime dependencies.
