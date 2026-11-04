# E12 — My decision and verification

**My decision:** accepted the UI.

**Verified myself in the browser:** filters, empty state, greyed-out blocked room, selection reset when filtering.

The AI found and fixed horizontal scrolling at 375 px by itself (the defect already existed in the initial version); I compared screenshots S8/T2_8. The UI screenshots were taken by the AI through browser automation; I reviewed them.

Screenshots: `E12_answer.png`, `T2_1` … `T2_8`, `S8_mobile_375_before_overflow.png` (described in `evidence/T2_screens_notes.md`).
Test/build output: `evidence/04_E12_vitest_build.txt`. Commits: `6959292` (UI), `86c6e3d` (375 px fix).
