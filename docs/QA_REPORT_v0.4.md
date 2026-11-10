# Syllogism of the Damned — v0.4 local QA report

Date: 10/11/2026. Build: branch `feature/syllogism-bureaus-logic-v0.4` (source candidate, **not** Kiro-executed and **not** deployed).

## Reproducible checks

| Test | Observed |
| --- | --- |
| `npm test` in standalone v0.4 source | 23/23 PASS (new engine tests only) |
| `npm run check` | PASS (active v0.4 modules) |
| `python tests/browser_v04.py` | PASS at 1366×768, 1024×768, 390×844 |
| Desktop document scroll 1366×768 | None; `scrollWidth=1366`, `scrollHeight=768` |
| Desktop document scroll 1024×768 | None; `scrollWidth=1024`, `scrollHeight=768` |
| Mobile 390×844 | Width 390 (no horizontal overflow); height 1560 (vertical scrolling required) |

The browser harness starts Chromium via Playwright but **does not navigate to file:// or localhost**: those were blocked by the execution environment. It injects the exact HTML, CSS and JavaScript into an isolated page, removing only ES-module syntax to assemble the script. These are genuine DOM interactions and rendered screenshots, but not a deployed-browser validation.

## Browser flow covered
1. Initial DETAINED state visible.
2. Keyboard Enter selection and Escape cancellation.
3. Puzzle 1 valid one-swap change to PROVEN, Undo back to REFUSED, then submit to RELEASED.
4. Case 2 stays gated until Case 1 submitted successfully.
5. Case 2 contradiction: select CLERK/WITNESS swap, see CONTRADICTION, submit is rejected, Undo restores DETAINED.
6. Puzzle 2 solution: swap ESCAPEE/VISITOR, then CLERK/WITNESS; authorised proof and successful release.
7. Desktop native drag/drop; on mobile click/tap selection. Replay returns to Case 1.
8. No uncaught browser page errors observed in these scenarios.

## Limits / blockers
- Old v0.3 regression suite on combined GitHub branch is not re-executed in this workspace; its source was not modified.
- Responsive mobile experience requires vertical scrolling. New-user testing and screen-reader evaluation outstanding.
- The design uses original CSS illustration, not photorealistic artwork. It should not be confused with the two conceptual reference images.
- Puzzle 1's procedural staff limitation is documented as a provisional assumption to meet the approved outcome distribution; reconcile against the original full v0.4 rule table before final validation.
- No Kiro IDE/CLI activity was performed in this chat. `.kiro` files do **not** constitute evidence of Kiro use. Actual Kiro development and authentic logs remain required for eligibility.
- Public working URL, external device test, real GitHub branch checkout, full old-and-new test suite, final video and Devpost submission are all pending.
