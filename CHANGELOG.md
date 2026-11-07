# Release history

## v0.2 (07/11/2026) · Unmerged candidate
- Kept the four-act state-machine and all v0.1 behaviour.
- Controls now travel from their actual form positions into the three corresponding puzzle cards.
- Added CSS paper distortion, in-world reveal and reduced-motion bypass.
- Improved transition cleanup, focus handoff, resilience when animation fails and duplicate-submit prevention.
- Added three geometry-specific tests (18/18 in total). Chromium browser smoke test at desktop, small desktop, mobile and reduced-motion passed in a self-contained source harness. The harness is not a deployed-site test.
- No third-party runtime dependencies, cost, remote calls, deployment, or Kiro IDE usage claim.

## v0.1 (07/11/2026) · Baseline
- First playable four-act experience, 15 unit tests, stable source archived separately.
