# Experience requirements (Kiroween 2026)

Status: approved scope for initial prototype; Kiro execution evidence pending.

## User story
As a first-time visitor, I enter a name into an apparently bureaucratic form. After submission, the form itself mutates into a surreal, physical-feeling puzzle. I can recover its fragments and escape, without instructions, accounts, or scrolling on a standard desktop screen.

## Acceptance criteria
1. Form state is immediately comprehensible and has a single name field.
2. Names shorter than 2 characters cannot enter the puzzle. Input is rendered as text, never raw HTML.
3. On accepted input, the interface transforms and the objective appears in the same viewport.
4. The three distinct puzzle pieces can be placed by pointer, click, keyboard, or touch, with visible progress and individual feedback.
5. A piece cannot be counted more than once; an unknown piece has no effect.
6. Final door is actionable only after all pieces are recovered.
7. Restart restores initial state without storing user data.
8. Desktop 1366x768 has no nested scroll; small viewports remain usable.
9. Reduced-motion preference is respected; no flashing seizure-like effects.
10. No network calls, paid APIs, telemetry, or automatic deployment.
11. Test positive, negative, duplicate and invalid state transitions. Verify the final shipped version.
12. Genuine Kiro usage must be separately established before claiming compliance.
