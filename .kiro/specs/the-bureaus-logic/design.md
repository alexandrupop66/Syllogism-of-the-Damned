# Bureau's Logic — design contract

Visual reference: two user-supplied 1672x940 mock-ups of the Bureau room; they are concepts, not screenshots of an implemented game. Create original responsive HTML/CSS components, do not flatten the reference into a non-interactive background.

Composition: vintage case file at left, editable legal rules at centre, massive steel exit door at right, deduction ledger anchored below. Dark stone, distressed parchment, brass, deep red detention evidence and green only for a demonstrably authorised release. No unlicensed external assets.

Technical model: `src/bureau-engine.mjs` is the sole deductive and gate authority. It enumerates factual closure with source-labelled inferences. UI `src/bureau-app.js` derives all door visuals from the current conclusion. No CSS flag or animation grants release. Keyboard-accessible word buttons, two-click swap, drag/drop option, focus-visible, Escape cancellation. CSS must fit 1366x768 without document scroll; do not hide controls by scrolling the screen.

Proof-oriented demo: first 6 s show DETAINED and exact cause; click tokens to swap once; ledger changes and door indicates PROVEN; click Submit to open physically. Second scene begins DETAINED; swap ESCAPEE with VISITOR, then CLERK with WITNESS to reach AUTHORISED. Show a contradictory route separately only if helpful, with undo still available.

Known gap: source v0.3 is a different paper-shattering one-word game. This v0.4 is a substantial rework on a new branch. Original v0.3 files remain intact and are not overwritten in history.
