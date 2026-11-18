# Smart Campus Room Availability Checker — Assignment #04

Kerimzhanov Rassul · Software Engineering · AI-assisted evolution, refactoring and quality improvement.

A single-page React + TypeScript app that filters a fictional catalog of campus rooms by
attendees and equipment and checks whether a time slot is free in the selected room.
No login, payments, live APIs or database; data is fictional and "now" is fixed at 10:30.

## Repository layout

| Path | What it is |
|---|---|
| `initial/` | **Initial version**, untouched: `booking.py`, `booking_v1.py` (A3 Python core) and `bolt/project/` (Bolt export, Practice 06/07). |
| `app/` | **Final version** (React + TypeScript + Vite + Vitest). |
| `docs/architecture.md` | Before/after module diagram and design decisions (Task 3). |
| `evidence/` | Test outputs, grep counts, AI prompts/decisions (E9–E14) and screenshots. |
| `docs/` | Assignment brief and A3 report/evidence (source material). |

Git: initial version = commit `905d50f`, final version = latest commit on `main`.

## Requirements

- Node.js 20 or newer (`app/.nvmrc`; tested with Node 26.13.0, npm 11.20.0)
- Python 3 only if you want to look at the legacy `initial/booking.py` (not used by the app)

## Setup and run (final version)

```bash
cd app
npm ci            # install exact dependency versions from package-lock.json
npm run dev       # start dev server, open the printed URL (default http://localhost:5173)
```

Production build and preview:

```bash
npm run build
npm run preview
```

## Tests

```bash
cd app
npx vitest run                    # all tests (unit + UI), expected: 40 passed (40)
npx vitest run --reporter=verbose # same, one line per test
npm run typecheck                 # TypeScript, no errors expected
npm run lint                      # ESLint
```

| File | Covers |
|---|---|
| `src/lib/availability.test.ts` | AC1–AC5 regression: start = now, 120 vs 121 min, touching vs overlapping, blocked, no mutation; `durationOf`, `exceedsMaxDuration` |
| `src/lib/filtering.test.ts` | F1 (capacity 8 for 8 vs 9), F2 (all equipment), F3 (blocked not selectable), F4 (empty result), immutability |
| `src/lib/roomSelection.test.ts` | F5: same interval unavailable in one room, available in another |
| `src/App.test.tsx` | UI/integration (React Testing Library, jsdom): filter → select → Check → switch room → result clears → Check uses new room; empty state; filter hides selected room |

Initial version baseline (for comparison):

```bash
cd initial/bolt/project
npm ci
npx vitest run    # expected: 34 passed (34)
```

## Where the evidence is

| Task | Evidence |
|---|---|
| 1 Analysis | `evidence/E9_answer.md`, `evidence/E9_decision.md`, screenshots `E9_*`, `S1`–`S5` |
| 2 Feature | `evidence/T2_screens_notes.md`, screenshots `T2_*`, `S6`, `S8`, `E10`–`E12` decisions |
| 3 Refactoring | `docs/architecture.md`, `evidence/05_*`, `06_*`, `07_*`, `E13_decision.md` |
| 4 Tests | `evidence/08_E14_final_tests.txt`, `09_E14_mutation_check.txt`, `10_E14_original_tests_on_final.txt`, `E14_test_consolidation.md` |
| 5 Quality | report, section "Quality evaluation" |
