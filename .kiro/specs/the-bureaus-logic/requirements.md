# The Bureau's Logic v0.4 — acceptance contract

Status: working local draft, not Kiro-executed or submitted. Branch target: `feature/syllogism-bureaus-logic-v0.4`. The prior v0.3 branch and `main` must remain unchanged.

## Gameplay
1. Two related cases; same fictional subject Avery; no external data, login, AI runtime, server, or tracking.
2. The three visible areas are person record, classification rules, and door, with a live deduction ledger below.
3. Players swap two word stamps by click/tap/keyboard activation, or native drag/drop where supported. Nothing opens solely because of visual effects.
4. Puzzle 1 swaps three unique tokens among R1 premise, R2 premise and in-tray. Rule chain: applicant fact, R1 -> detained, R2 -> escorted, escorted -> authorised.
5. Puzzle 1 procedural restriction is explicitly shown: R1 cannot target CLERK. This makes its invalid configuration unsupported. Treat as a DESIGN ASSUMPTION requiring reconciliation with the original full v0.4 permutation table, which is unavailable in this workspace.
6. Puzzle 2 permutes ESCAPEE, CLERK, WITNESS, VISITOR across O1 antecedent, O3 antecedent, O3 consequent, in-tray. Facts ESCAPEE and WITNESS. Rules O1 -> FUGITIVE, FUGITIVE -> DETAINED, O3 antecedent -> O3 consequent, CLERK -> AUTHORISED. Standing Order 7 blocks release if detained and authorised are simultaneously proven.
7. Contradiction blocks submit, NOT Undo/reset or further swaps.
8. A case can be submitted only if its deductive classification is GOAL; the second case is gated behind submitted success in the first case.
9. Reversible deterministic state: Undo, reset, replay and no hidden persisted profile.
10. Provide visible positive and negative feedback, focus indication, reduced-motion support; desktop 1366x768 and 1024x768 should not scroll; mobile may scroll vertically but not horizontally.
11. Initial instructions must not disclose the precise winning swaps.
12. Use `.kiro` spec-driven work and preserve genuine Kiro IDE/CLI execution evidence, including changes made inside Kiro. Prepared docs alone do not demonstrate Kiro use.

## Enumerated outcomes
- Puzzle 1: 6 permutations = DETAINED 2, UNSUPPORTED 3, CONTRADICTION 0, GOAL 1; minimum distance 1 swap. Its one-goal count depends on the visible R1 staff limitation.
- Puzzle 2: 24 permutations = DETAINED 10, UNSUPPORTED 10, CONTRADICTION 2, GOAL 2; minimum distance 2 swaps, an alternative solution exists.

## Blocking acceptance issues
- Reconcile Puzzle 1 restriction with the original full specification rather than misrepresenting it as proven historical scope.
- Test real URL and browser navigation, keyboard, drag, mobile and reduced motion in Kiro's actual implementation environment; this workspace browser harness uses DOM injection because local navigation is prohibited.
- Actual Kiro execution, release packaging, visually checked target fidelity and final submission evidence remain outstanding.
