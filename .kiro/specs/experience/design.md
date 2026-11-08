# Syllogism v0.3 / design contract

## Hook (first 30 seconds)
0–5s: quiet, high-quality paper form. 5–8s: the actual document shatters into 32 moving visual pieces. 8–17s: the two laws are visible; visitor selects the word NOT and places it into the empty declaration. 17–24s: the room reconfigures, the portal opens. 24–30s: visitor enters the exit and sees the ending.

## Single mechanic
Text is physical law. There is exactly one puzzle. Its input is the word NOT, moved from "YOU ARE NOT AUTHORISED TO LEAVE" to "I DO [ ] ACCEPT THE TERMS". There are 32 decorative panels, but zero obligation to chase those pieces.

## Architecture
- Pure state machine in `src/engine.mjs` is the source of truth for whether a rule has been rewritten and the exit is unlocked.
- `src/architecture.mjs`: pure geometry for 32 pieces; visual objects are inert and aria-hidden.
- `src/metamorphosis.mjs`: clone and slice the real document, with duplicate IDs removed and inputs disabled. Capture destination boxes **after** making the chamber measurable. Clean up all flights after completion or failure. Reduced motion immediately reveals the puzzle.
- `src/app.js`: keyboard, mouse, pointer, focus transfer, hints, reset. Must never write name data into innerHTML.
- CSS 2.5D world and transitions are presentational only. They cannot grant gameplay state.

## Safety, UX and testability
Focus visibility, target highlights, clear feedback after invalid actions, Enter/Space/escape keys and mobile tap fallback. Keep desktop scroll-free. All source and assets must be local. Do not invent AI runtime, cloud, or Kiro hooks controlling user keystrokes.

## Release control
v0.1 on `main`; v0.2 on `feature/syllogism-metamorphosis-v0.2`; v0.3 on new feature branch. Never merge/deploy without separate approval. Use genuine Kiro IDE/CLI before claiming actual Kiro usage.
