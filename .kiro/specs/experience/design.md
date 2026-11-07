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
