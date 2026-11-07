# Design contract

## Core hook (first 30 seconds)
0–6 s: apparently innocent application form. 6–10 s: form submits, loses coherence and cracks into a haunted scene. 10–22 s: visitor moves the three former controls into evidence sockets; each action transforms the room. 22–30 s: verdict is issued and an impossible door opens.

## Four acts
- FORM: warm paper / clean typography / one input / one CTA.
- FRACTURE: the document turns into a dark, dimensional evidence room. Form controls become the puzzle pieces.
- VERDICT: all three fragments acknowledged; oversized official stamp and a glowing doorway.
- ESCAPED: short punchline, restart.

## Visual rules
A single stage without nested scrolling on desktop. Strong headline hierarchy and 16px+ main text. Restrained crimson accents; green only for successful progress. No arbitrary jump scares. Use original CSS/SVG visuals and small deterministic motion, not ornamental AI.

## Constraints
A static app with a pure state-machine module; no frameworks, no external requests, no secret material. User input must never be injected into innerHTML. Avoid untestable claims of Kiro runtime orchestration: hooks apply to development sessions, not directly to runtime keystrokes.

## v0.2: material continuity (one trick, not another screen)
- Source mapping: name input → IDENTITY; form footnote → CONSENT; submit button → AUTHORITY.
- Snapshot source bounding boxes before revealing the dark scene; reveal the target scene without affecting the form layout. Use a single inert, aria-hidden ghost layer to move a visual clone of each control to its existing target fragment.
- The pure `planFlight()` helper calculates destination delta and scale from real DOM rectangles. Test failure conditions separately.
- No ghost is focusable, and user text stays in `textContent` or a disabled clone input, never interpolated into HTML.
- On animation failure, switch to the real playable puzzle rather than trapping the user. Reduced-motion users transition instantly.
- v0.1 remains stable; no additional external packages, calls or services.
