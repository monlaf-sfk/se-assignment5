# Task 2 — UI evidence (captured by Claude Code via Firefox automation, 2026-11-04)

| File | Scenario | Result |
|---|---|---|
| T2_1_filter_success_10_projector.png | attendees 10 + projector | 3 of 5 match: Engineering 110, Arts 05, Science 340 greyed (Blocked). Library 201 (8 seats, no projector) hidden; its selection was cleared. |
| T2_2_filter_empty_50.png | attendees 50 + projector | 0 of 5 match, empty state "No rooms match your requirements" (F4). |
| T2_3_lib201_1300_unavailable_overlap.png | Library 201, 13:00–14:00 | Unavailable: overlaps Faculty Meeting 13:00–14:00 (AC4). |
| T2_4_switch_to_arts05_result_cleared.png | then select Arts 05 | Previous result cleared, placeholder shown (F5). |
| T2_5_arts05_1300_available.png | Arts 05, 13:00–14:00, Check | Available — same interval, other room's bookings (F5). |
| T2_6_121min_unavailable.png | Arts 05, 11:00–13:01 | Unavailable: 121 minutes > 120 (AC2). |
| T2_7_filter_hides_selected_room.png | Arts 05 selected, tick whiteboard | Arts 05 disappears (no whiteboard), selection and result cleared (F2, F5). |
| S8_mobile_375_before_overflow.png | initial version at 375px | Page scrollWidth 1102px > 375px: cards and Check button cut off (AC6 defect, pre-existing). |
| T2_8_mobile_375_after_fix.png | app/ at 375px after fix | scrollWidth 375px = viewport, no horizontal scroll. |

Measured with `document.documentElement.scrollWidth` vs `window.innerWidth`:
- initial/bolt/project: 1102 vs 375 (overflow)
- app/ before fix: 1102 vs 375 (overflow)
- app/ after fix: 375 vs 375

Cause: grid items (`<section>`) default to `min-width: auto`, so the 1056px-wide Timeline track
stretched the single mobile column. Fix: `min-w-0` on both sections in `App.tsx`.
