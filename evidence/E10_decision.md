# E10 — My decision and verification

Prompt E10 implements plan item 2 as I modified it (the Check button stays; the result is cleared when the room or time changes).

**Verified myself:** ran `app/` in the browser; after switching rooms the result is cleared (S6, compare with S5). Tests in my own terminal: 36/36.

Screenshots: `E10_prompt_diff.png`, `E10_answer.png`, `S5_blocked_shows_available_before_fix.png`, `S6_after_fix_room_switch.png`.
Test output: `evidence/02_E10_vitest.txt`. Commit: `a5c7cc5`.
