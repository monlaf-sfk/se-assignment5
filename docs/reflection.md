# AI reflection (Task 6)

I worked with Claude Code (Opus 5.5) in the repository. In the first prompt I gave it a file map, the criteria AC1–AC6 and F1–F5, the constraints (no login, database or APIs) and screenshot S4 showing a stale result. I asked for analysis and a plan only, then sent every change as a separate prompt.

The analysis was the most useful part: the AI found five risks with line references, including the stale result after switching rooms and the duration computed in three places. While checking the page at 375 px it noticed horizontal scrolling that already existed in the initial version and that I never verified in A3. I did not accept everything. The AI suggested computing the result live without the Check button; I kept the button and only clear the result, because that is a smaller change. Once a screenshot showed two highlighted room cards. It was a CSS transition, and the AI confirmed this from the DOM, otherwise it would have looked like a bug.

I personally checked the filters, the empty state and the selection reset in the browser, ran the tests in my terminal, confirmed from the diff that old test expectations did not change, and read `>=` for capacity and `every` for equipment.

Tests drove my decisions. I ran the 34 original tests on the final code as a safety net for refactoring. A mutation check showed that the tests catch replacing `>=` with `>` and removing the result reset. I removed duplicate tests: 40 instead of 47, with no distinct case lost.

Next I would move the state out of App.tsx into a custom hook, add an end-to-end test in a real browser and remove the Python copy of the rules.
