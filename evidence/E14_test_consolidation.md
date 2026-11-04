# E14 — test consolidation (availability.ai.test.ts → availability.test.ts)

Former `availability.ai.test.ts` had 15 tests. Each was compared by input interval and fixture:

| ai test | Same case in availability.test.ts | Action |
|---|---|---|
| T01 660–720 touching after | T01 | duplicate removed; its extra assertion `conflict === undefined` merged into T01 |
| T01/T09 family 660–720 | T01 (also duplicated T01 inside the ai file) | duplicate removed |
| T02 540–570 start == now | T02 | duplicate removed |
| T03 720–720 | T03 | duplicate removed |
| T04 750–720 | T04 | duplicate removed |
| T05 1380–1441 | T05 | duplicate removed |
| T06 720–840 (120 min) | T06 | duplicate removed |
| T07 720–841 (121 min) | T07 | duplicate removed |
| T08 570–600 touching before | T08 | duplicate removed |
| T10 570–690 contains | T10 (test.each) | duplicate removed |
| T11 615–645 inside | T11 (test.each) | duplicate removed |
| T12 600–660 identical | T12 (test.each) | duplicate removed |
| T14 empty bookings | T14 | duplicate removed |
| AC5 single call, no mutation | AC5 repeated checks (stronger) | duplicate removed |
| T13 blocked **with blockReason** | T13 blocks without reason | **kept as T13b** (distinct branch: reason text) |

Result: 14 duplicates removed, 1 distinct case kept. Added: A3-1 (end == 1440), A3-2 (negative start),
`exceedsMaxDuration` (120 vs 121), `durationOf` (5 inputs), T06 also asserts `result.duration`.

Evidence that nothing was lost: the 34 original tests copied unchanged from `initial/` pass on the final
code (`evidence/10_E14_original_tests_on_final.txt`). Evidence that tests catch regressions:
`evidence/09_E14_mutation_check.txt`.
