# v0.3 real-demo storyboard — 30 seconds

This is a **preview** showing the browser doing real work, not a final Devpost submission video.

| Approximate time | What the viewer actually sees |
| --- | --- |
| 0–4s | Plain application form; a fictional name entered |
| 4–6s | Submit; original document breaks into 32 slices |
| 6–12s | Two laws and the word NOT appear in the rebuilt chamber |
| 12–14s | Move NOT into the declaration slot |
| 14–20s | Chamber walls retreat; glowing exit opens |
| 20–25s | Enter exit; the page dissolves into the ending |
| 25–30s | Hold final message, with restart visible |

The actual automation captures Chromium screen pixels and uses only user-equivalent browser mouse/keyboard events; no state injection, synthetic storyboard screens or nonfunctional video-only effects. The capture tool streams screenshot frames into ffmpeg because Playwright's video plugin binary is unavailable in this environment. Recording is silent; voiceover and sound design, if any, are future submission tasks.
