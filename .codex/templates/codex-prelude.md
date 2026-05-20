# Executor Prelude — Rules for every task

## How you were invoked

You were launched by **Claude Code** via `{{CODEX_EXEC_COMMAND}}` in non-interactive mode. Do not interact with the User directly — all your output returns to Claude, who processes it and decides whether to present it to the User or request corrections.

- Follow the assigned TASK exactly.
- For T2 large / T3, if the TASK says "Phase 1 only": write the plan in `.codex/tasks/TASK-NNN-plan.md` and **stop without modifying any application file**. Wait for Claude to re-invoke with "Phase 1 approved, proceed."
- If asked to "proceed" or "fix": read the original TASK + Claude's feedback, implement only the requested correction.

---

Read this file **before** reading the TASK file. These rules apply to every task you execute, regardless of tier or content.

> **Project-specific configuration:**
> - Playbook root: `.codex`
> - Lint/test working directory: `{{LINT_TEST_DIR}}` (e.g. repo root, or a subdirectory if the project has nested packages)
> - Lint command: `{{LINT_COMMAND}}` (e.g. npm run check, npm run lint, make lint, ruff check)
> - Test command: `{{TEST_COMMAND}}` (e.g. npm test, pytest, go test ./..., npx playwright test)
> - Wiki command: `{{WIKI_COMMAND}}` (omit if no wiki generator exists)
> - App code paths: `{{APP_CODE_PATHS}}` (e.g. src/, app/, server/, client/)

<!-- Replace all {{PLACEHOLDERS}} in SETUP.md before using this template -->

---

## Standing rules

<!-- {{STANDING_UI_RULES}}: add project-specific standing rules here. Examples:
     - Date inputs must auto-format as the user types and validate format (not just non-empty)
     - Form validation must show inline errors per field after first submit attempt
     - All screens must use safe area insets and keyboard avoidance where appropriate
     - Font rendering must be verified on all target platforms
     Remove this comment block if no standing rules apply.
-->

---

## Hard rules (non-negotiable)

1. **Branch discipline:** work only on `task/TASK-NNN-slug`. Never commit to `block/*`, `dev`, or `main`.
2. **Scope discipline:** implement exactly what the TASK specifies. No unrequested refactors, no scope creep, no "while I'm here" changes.
3. **No playbook edits:** do not modify `.codex/**` except to append the `## Executor execution log` section to the TASK file at the end of execution.
4. **No secrets:** never read, write, log, or commit `.env*` files. The runtime loads them automatically.
5. **No dependency additions** without explicit task authorization.
6. **No architectural decisions** — those belong to Claude Code.
<!-- {{INFRA_HARD_RULES}}: add project-specific forbidden operations. Examples:
     - Never run destructive DB operations (DROP, TRUNCATE, migrate reset) without explicit task authorization
     - Never deploy to production without explicit User trigger
     - Never submit to App Store / TestFlight without explicit User approval
     - Never delete user data from persistent storage without explicit task authorization
     - Never add native platform modules without explicit task authorization
     Remove this comment block if no infra-specific rules apply.
-->

---

## Execution phases

### Phase 0 — Plan review

Before touching any file:
1. Read the TASK file completely.
2. Check that the task scope is clear and achievable.
3. Output one of these verdicts:
   - `OK` — proceed as written.
   - `FINE_TUNING` — proceed, but note minor deviations in the execution log.
   - `RED_FLAG` — stop immediately. Do not create the branch. Do not touch any file. Explain why and wait for User resolution.

`RED_FLAG` triggers: task references a non-existent file, conflicting constraints, missing prerequisite, ambiguous scope that would require guessing.

### Phase 0.5 — Current state verification

After `OK` or `FINE_TUNING`:
1. Read the files listed in "Files in scope" in the TASK.
2. Verify that the current state matches the TASK's description of the starting point.
3. Note any discrepancies in the execution log. If a discrepancy is a blocker, stop and declare it.

### Phase 1 — Implementation plan (T2 large / T3 only)

For T2 large and T3 tasks:
1. Write a concrete plan: which files to modify, which to create, execution order, risks.
2. **Stop here.** Do not create the branch. Do not touch any file.
3. Present the plan. Wait for explicit `APPROVED` from the User before proceeding.

For T1 / T2 small / T2 medium: skip this phase.

### Pre-flight

Before writing any code:
1. Verify you are on the correct branch (`task/TASK-NNN-slug`). If the branch doesn't exist, create it from `block/BLOCK-N-slug`.
2. Run `{{LINT_COMMAND}}` to confirm the baseline is clean. If it fails, stop and report — do not proceed over a broken baseline.
3. Confirm git status is clean (no uncommitted changes from prior work).

### Implementation

Implement what the TASK specifies. Follow the acceptance criteria exactly. Refer to `/docs/**` and `.codex/knowledge/**` for context — do not invent behavior.

### Post-implementation checks

After implementation:
1. Run `{{LINT_COMMAND}}`. If it fails, fix before continuing.
2. Review your own diff: confirm no files outside the task scope were modified.

### Automated test loop

After lint passes, run the tests:

```
{{TEST_COMMAND}}
```

**If all tests pass** → proceed to Commit.

**If one or more tests fail**, follow this diagnosis protocol before touching any code:

1. **Classify each failure:**
   - Type A — selector/assertion wrong in the test itself (test is the bug, not the code)
   - Type B — behavior wrong (code does not match what the test expects)
   - Type C — timing/async issue (timeout, "element not found" on elements that exist)
   - Type D — regression from this task (test that previously passed now fails)

2. **Identify the exact cause** in the code you just wrote. Read the error message, the failing assertion, and your diff.

3. **Apply a surgical fix** — change only the specific line(s) causing the failure. Do not refactor unrelated code.

4. **Re-run the tests** after fixing.

5. **If tests still fail after one fix attempt** → stop. Report in RESIDUAL ISSUES:
   - Which test(s) failed
   - Failure type (A/B/C/D)
   - Exact cause identified
   - What you tried
   - What is still blocking

**Tests are ground truth.** Never modify test files to make them pass — fix the application code instead. The only exception: if the TASK explicitly says to update tests.

### Commit

After lint AND tests pass, **commit all created and modified files** to the current branch before reporting. Use a single commit with message format:
```
feat(block-N): TASK-NNN <short description>
```
Do not skip the commit — the task is not complete until the work is committed.

### Execution log

As the **final step**, append the following section to the TASK file (`.codex/tasks/TASK-NNN-*.md`):

```markdown
## Executor execution log

**Phase 0 verdict:** OK | FINE_TUNING | RED_FLAG
**Phase 0.5 findings:** <discrepancies or "none">
**Files changed:**
- `path/to/file.ts` — <what changed>

**Commands run:**
- `{{LINT_COMMAND}}` → <result>
- `{{TEST_COMMAND}}` → <result>

**Residual issues:** <list or "none">
**Assumptions made:** <list or "none">
```

---

## Output format

Return a structured summary in this format:

```
TASK: TASK-NNN — <title>
STATUS: COMPLETE | PARTIAL | BLOCKED

FILES CHANGED:
- path/to/file — description of change

COMMANDS RUN:
- {{LINT_COMMAND}} → PASS / FAIL
- {{TEST_COMMAND}} → N passed, M failed | (list failed tests if any)
- Fix attempts: <number> | <what was fixed, or "none needed">

RESIDUAL ISSUES:
- <issue with failure type A/B/C/D, cause, what was tried> or none

ASSUMPTIONS:
- <assumption> or none

NEXT: <what Claude should do — e.g. "all tests green, review diff and approve Gate 2" | "2 tests still failing after fix, see RESIDUAL ISSUES">
```
