# Architecture — before / after (Task 3)

## Before (initial/bolt/project, Practice 06/07 export)

```
                 +------------------------------------------------------+
                 | App.tsx  (data + state + validation + layout)        |
                 |  - renders SAMPLE_ROOMS directly (no filtering)      |
                 |  - own duration math  (endMin - startMin)            |
                 |  - own 120-min check  (duration > MAX_BOOKING)       |
                 |  - result kept in state, never cleared (stale)       |
                 +----+-----------+-----------+-------------+-----------+
                      |           |           |             |
                      v           v           v             v
               data.ts      lib/availability.ts   lib/time.ts   components/
               4 rooms,     checkAvailability:    HH:MM utils   RoomCard (disabled=false)
               no equipment AC1-AC4 + own          MAX_*        ResultBanner (own duration prop)
                            duration, 120 check,                Timeline ("Candidate (blocked)")
                            split() hack for "now"              TimeInput

  initial/booking.py  can_book(start, end, now, blocked, existing)
  -> second copy of AC1-AC4 in Python, different check order (blocked first)

  package.json: @supabase/supabase-js (unused, contradicts "no DB")
  tests: availability.test.ts + availability.ai.test.ts (mostly duplicate cases)
```

## After (app/)

```
  +-------------------- UI presentation (components/, App.tsx) --------------------+
  | App.tsx: wires state -> pure functions; clears result on room/time/filter change |
  | RoomFilters  EmptyState  RoomCard(selectable)  ResultBanner(result.duration)     |
  | TimeInput    Timeline("Candidate (unavailable)")                                  |
  +-----------+-----------------------------+-----------------------------+----------+
              |                             |                             |
              v                             v                             v
  +-----------------------+   +------------------------------+   +--------------------+
  | Filtering             |   | Booking / availability rules |   | Room data          |
  | lib/filtering.ts      |   | lib/availability.ts          |   | data.ts            |
  | filterRooms (F1-F3)   |   | checkAvailability (AC1-AC4)  |   | SAMPLE_ROOMS (5)   |
  | hasSelectableRoom(F4) |   | exceedsMaxDuration (AC2,     |   | EQUIPMENT_OPTIONS  |
  | parseAttendees        |   |   only 120-min decision)     |   | types.ts: Room     |
  +-----------+-----------+   +---------------+--------------+   +--------------------+
              |                               |
              +---------------+---------------+
                              v
                    +--------------------+
                    | lib/time.ts        |
                    | durationOf (only   |
                    |  duration formula) |
                    | minutesToHHMM ...  |
                    +--------------------+

  initial/booking.py: legacy reference from A3, not used by the app (kept for comparison only)
```

Dependency direction: UI -> filtering / rules -> time utilities; data is read-only input.
No module below the UI imports React; all of them are pure and unit-tested.

## Design decisions

1. **One source of truth for the duration rule.** `time.ts: durationOf` is the only duration
   formula and `availability.ts: exceedsMaxDuration` is the only 120-minute decision. The UI
   label (red "Your duration") and the check both call them, and `ResultBanner` shows
   `result.duration` — the duration the decision was made for — instead of a separately
   computed prop. A rule change (e.g. 90 minutes) is now a one-line edit, and the banner can no
   longer disagree with the verdict.
2. **Filtering returns `{ room, selectable }` instead of hiding blocked rooms.** A blocked room that
   satisfies F1/F2 stays visible but disabled (F3), so the user sees why it cannot be booked,
   and the empty state (F4) is defined as "no selectable room". Keeping this in a pure module
   makes F1–F4 testable without rendering React.
3. **The checked room is derived, not stored.** `App.tsx` computes `room` from the current
   filter result and selected id, and every change of room, time or filter clears the stored
   result. A result therefore always belongs to the current inputs (fixes R1 / F5).
4. **Python `booking.py` is kept only as a legacy reference** (not deleted, not ported): the web
   app has a single TypeScript rule set; the Python copy is out of the runtime path.
