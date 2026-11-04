# E11 — My decision and verification

**My decision:** F3 — a blocked room is shown greyed out instead of hidden, so the user can see why it is unavailable.

**Verified myself:** in `filtering.ts` — `>=` (not `>`) for F1 and `every` (not `some`) for F2. Tests on my machine: 47/47.

I accepted the change to the old tests (only `equipment: []` added to the fixtures): I checked in the diff that the test cases themselves were not touched.

Screenshots: `E11_prompt_diff.png`, `E11_answer.png`. Test output: `evidence/03_E11_vitest.txt`. Commit: `42fab21`.
