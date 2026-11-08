# Syllogism of the Damned / v0.3 experience requirements

Status: user approved this scope on 08/11/2026. Real Kiro IDE/CLI execution evidence remains pending.

## Central user story
As a first-time visitor, I submit a fictional identity, watch the original document disintegrate into an impossible chamber, and escape by moving exactly one word between two written rules. I should never have to guess what control to use, and should never need to collect dozens of decorative objects.

## Acceptance criteria
1. One input on the original form. Invalid or short input cannot advance.
2. The submitted form itself breaks into 20–40 visible pieces, which reconstruct decorative elements in the chamber. v0.3 uses 32 (8×4).
3. Exactly one active puzzle: remove **NOT** from "YOU ARE NOT AUTHORISED TO LEAVE" and place it in "I DO [ ] ACCEPT THE TERMS".
4. The exit remains locked until valid user input moves the word. An invalid drop or unselected destination click must not change the rule.
5. Control affordances, a clear goal and local hints permit solving without guessing or narration. Mouse, keyboard and touch are supported.
6. A valid move changes both sentences visibly and triggers a room-scale transformation (walls, light and exit). An actionable door is revealed in the same scene.
7. Reset and replay restore the initial state without persisting user input. Names are text-only, not HTML.
8. No desktop page or nested scroll at 1366×768 or 1024×768. Small mobile scroll is acceptable if the primary puzzle and instructions stay visible and no horizontal scrolling occurs.
9. Reduced-motion users retain the full gameplay and do not see compulsory high-motion effects.
10. No external network connections, paid services, dependency upgrades, deployment or unapproved architecture additions.
11. Unit, positive, negative, keyboard, drag, mobile, reduced-motion and replay cases must be tested. Do not claim a deployed URL was validated from an isolated harness.
12. Actual Kiro usage must be evidenced separately; `.kiro` content alone does not satisfy it.
