# Task 4 — Read-only AI risk review (raw prompt and output)

- Tool: Claude Code (model Claude Opus 5.5), read-only "Explore" sub-agent (no Edit/Write tools available to it)
- Date: 2026-11-18, ~18:15–18:21 (+05)
- Context given: only the prompt below and read access to the repository. It did NOT receive my own
  findings, so its list is independent of my probes (it did find and quote my evidence files later).
- Files modified by the reviewer: none (`git status` after the run showed only my own changes).

## Prompt (verbatim)

> You are doing a READ-ONLY risk review of a small React + TypeScript + Vite + Vitest repository at
> .../software_e/assignment5 (app code in app/, ignore app/node_modules and app/dist). Do NOT modify,
> create or delete any files. Do NOT run npm install, builds or anything that writes to disk. You may
> read files and run read-only commands (cat, grep, ls, git log, git show, `npm ls`, `npm audit --json`
> inside app/ is fine).
>
> The app: a fictional "Smart Campus Room Availability Checker" single page. No backend, fictional
> data, "now" fixed at 10:30.
>
> Task: propose 8–10 candidate risks across these categories: correctness, maintainability, security,
> dependency, agent operations (things that would make an AI coding agent working in this repo do
> something wrong or unsafe, e.g. missing/conflicting instructions, missing gates). For each candidate
> give: id (R-AI-01...), category; one-sentence claim: cause → event → consequence; evidence: exact
> file path + line numbers + quoted code, or the exact command you ran and the relevant output lines;
> your own confidence: high / medium / low, and what would be needed to confirm it; suggested minimal
> mitigation (describe only, do not apply).
>
> Be concrete and skeptical; do not pad with generic advice. If you suspect something but could not
> verify it from files, say so explicitly. Return the list as markdown.

## Output (verbatim, line numbers refer to commit a817034)

Note from the reviewer: the tree changed under it during the review (I re-created `assignment5` as a
clone of the A4 repository at 18:16). Commit `c165709` it saw first no longer exists.

| ID | Category | Claim (short) | AI confidence |
|---|---|---|---|
| R-AI-01 | correctness | `TimeInput` receives `error` but only colours the border; the message is never rendered; Check shows generic "Please select a room and valid times." (`TimeInput.tsx:8-21`, `App.tsx:50-51`) | high |
| R-AI-02 | correctness | 24:00 is valid in `hhmmToMinutes` and tested (A3-1), UI says "Day window 00:00–24:00", but `<input type=time>` sanitizes 24:00 to "" → booking until midnight impossible in the UI (`time.ts:16-17`, `availability.test.ts:57`, `App.tsx:179`) | high (Firefox only) |
| R-AI-03 | correctness / a11y / test fragility | `<label>` without `htmlFor`, `<input>` without `id` → unnamed inputs for screen readers; tests must locate inputs by `getByDisplayValue`, which throws when start = end | high (a11y), medium (test) |
| R-AI-04 | maintainability | fixed "now" 630 is a magic number in `App.tsx:18` and copied in `roomSelection.test.ts:6`; no injection point | medium |
| R-AI-05 | maintainability | `Room.equipment` is `string[]` while the catalog is `as const` → a typo in `data.ts` type-checks and silently never matches; no test checks catalog membership | high (mechanism), no live defect |
| R-AI-06 | dependency | vitest 1.6.1 / tinypool critical advisories only fixable via major `vitest@5.1.1`; full `npm audit` is not a gate (`run-checks.sh:22-23`), an agent may run `npm audit fix --force`; `eslint-plugin-react-hooks` resolves to an RC pre-release | high (exists), low exploitability |
| R-AI-07 | security (local dev) | Vite 5.4.8 / esbuild 0.21.5 dev-server advisories (GHSA-vg6x-rcgg-rjx6 cross-origin read, GHSA-x574-m823-4x7w fs.deny bypass, GHSA-67mh-4wv8-2f99); AGENTS.md lists `npm run dev` as safe | medium |
| R-AI-08 | agent ops | `run-checks.sh` "uncommitted" flag uses `git diff --quiet HEAD`, which ignores untracked files → a new untracked test changes results while the header claims a clean commit | high |
| R-AI-09 | agent ops | AGENTS.md says editing `app/src/` is safe without asking but `lib/` rule changes need approval and non-tiny work goes on a branch; nothing enforces it — `a817034` (new `lib/selection.ts`) was committed straight to `main` 55 s after AGENTS.md; README says Node 18+, AGENTS/engines say 20; `.bolt/prompt` still ships | high |
| R-AI-10 | agent ops | several sessions in one working tree (re-clone, temporary probe test) → evidence cites commits that disappear, gate runs see others' half-finished state | high (observed) |

Set aside by the reviewer as low/no risk: no `dangerouslySetInnerHTML`/`eval`; `og:image` to bolt.new
is crawler-only; `/vite.svg` missing (preview returns `200 text/html`, cosmetic); jsdom pragma per
test file is documented; `typecheck` does not cover `vite.config.ts` (minor).

Full mitigation suggestions from the reviewer are summarised in the risk register (`a5/REPORT.md`, Task 5).
