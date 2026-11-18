# Acceptance criteria — Assignment #05

These criteria were true at the baseline (`a5-baseline` = commit `cb0762a`) and must stay true
after every Assignment 5 change. Each one has an automated check.

| ID | Criterion | How it is checked |
|---|---|---|
| AC-A5-1 | Availability rules hold: start must be after "now" (10:30); exactly 120 min is allowed and 121 min is rejected; touching an existing booking is allowed, overlapping is rejected; a blocked room is never available; inputs are not mutated. | `npx vitest run src/lib/availability.test.ts` (24 tests at baseline) |
| AC-A5-2 | Room filter: capacity >= attendees; a room must have ALL selected equipment; blocked rooms are listed but cannot be selected; an impossible filter shows the empty state. | `npx vitest run src/lib/filtering.test.ts` + `src/App.test.tsx` (F4 test) |
| AC-A5-3 | A shown result always belongs to the current inputs: changing room or time clears it, and a filter that hides the selected room clears the selection and the result. | `src/App.test.tsx` (F5 tests), `src/lib/roomSelection.test.ts` |
| AC-A5-4 | Quality gates pass from a clean install: `npm ci`, `npm run typecheck`, `npm run lint`, `npx vitest run`, `npm run build` all exit 0, and the number of passing tests is not lower than the baseline (40). | `scripts/run-checks.sh` (exit 0, `gates ... PASS`) |
| AC-A5-5 | The shipped app has no runtime dependency vulnerabilities and makes no network requests at runtime; all data stays fictional. | `npm audit --omit=dev` → `found 0 vulnerabilities`; `grep -rnE "fetch\(|XMLHttpRequest|axios" app/src` → no matches |
