# E9 — Task 1 analysis (Claude Code, Opus 5.5, 2026-11-04)

## Maintainability risks

R1. Stale result: UI state not derived from inputs (F5, F3, AC6) — HIGH
- `App.tsx:18` keeps `result` in `useState`; it is set only in `handleCheck` (`App.tsx:30`).
- `setRoomId` (`App.tsx:78`), `setStartTime`, `setEndTime` never clear or recompute it.
- Effect: verdict of room A / interval X is shown for room B / interval Y (screenshot S4: 11:00–12:11 overlaps 12:00–14:00 but shows "Available").
- A blocked room can appear "Available" after switching to it — violates F3.

R2. Same rule computed in several places — HIGH
- Duration / 120-min rule: `availability.ts:28` (decision), `App.tsx:28` (own `duration`), `App.tsx:117` (own `> MAX_BOOKING_MINUTES` styling), `ResultBanner.tsx:29` (appends duration from props, not from the result).
- Whole rule set duplicated in `initial/booking.py:can_book` with a different check order (blocked first, `booking.py:22`) vs TS (blocked after duration, `availability.ts:35`). Changing one copy silently diverges the other; the reason shown for multi-violation input differs.

R3. Room model cannot express new requirements; filtering has no home — HIGH
- `types.ts: Room` has no `equipment`; no attendees input exists.
- `App.tsx` renders `SAMPLE_ROOMS` directly (`App.tsx:72`), `RoomCard` gets `disabled={false}` hard-coded (`App.tsx:77`).
- Adding F1–F4 inline in `App.tsx` would grow a component that already owns data, state, validation and layout.

R4. Duplicated, overlapping tests — MEDIUM
- `availability.ai.test.ts` repeats most cases of `availability.test.ts`; T01 appears twice in the same file (`availability.ai.test.ts:31` and `:92`).
- 34 tests ≠ 34 distinct behaviours; future rule changes need double edits.

R5. Small presentation defects — LOW
- `availability.ts:23` formats `now` via `formatRange(t, t).split(' – ')[0]` instead of `minutesToHHMM` (fragile string hack).
- `Timeline.tsx:110` legend says "Candidate (blocked)" for any unavailable result.
- Unused `@supabase/supabase-js` in `package.json` contradicts the no-DB constraint.

## Prioritized plan (one change at a time, tests after each)

1. Baseline recorded (vitest 34/34). Keep it as regression net.
2. Fix R1: derive availability from (selected room, start, end) instead of storing it; at minimum reset result on room/time change. Add a test proving room switch uses the new room's bookings.
3. Extend model (R3): add `equipment: string[]` to `Room`; update `data.ts` (≥4 rooms, varied capacity/equipment, one blocked).
4. Add pure `filterRooms(rooms, attendees, equipment)` in its own module: F1 `capacity >= attendees`, F2 every selected item present, F3 blocked room never marked available. Unit tests incl. capacity 8 vs 9.
5. UI: attendees + equipment inputs, render filtered list, empty state (F4); clear selection if the selected room is filtered out.
6. Refactor R2: single source for duration and the 120-min rule (return duration in the result or one helper); remove duration math from `App.tsx` / `ResultBanner`. Mark `booking.py` as legacy reference, not a second implementation.
7. Clean tests (R4): merge into one AC suite, keep every distinct boundary case.
8. Fix R5 items; remove unused supabase dependency.
9. One integration/UI test: filter → select room → check → switch room → result refreshes.
