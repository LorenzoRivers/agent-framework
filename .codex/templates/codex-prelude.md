# Executor Prelude — Rules for every task

Read this file **before** reading the TASK file. These rules apply to every task you execute, regardless of tier or content.

> **Project-specific configuration:**
> - Playbook root: `{{PLAYBOOK_ROOT}}` (default: `.codex`)
> - Lint command: `{{LINT_COMMAND}}`
> - Test command: `{{TEST_COMMAND}}`
> - Wiki command: `{{WIKI_COMMAND}}` (optional — leave blank if not applicable)
> - App code paths: `{{APP_CODE_PATHS}}`

---

## Hard rules (non-negotiable)

1. **Branch discipline:** work only on `task/TASK-NNN-slug`. Never commit to `block/*`, `dev`, or `main`.
2. **Scope discipline:** implement exactly what the TASK specifies. No unrequested refactors, no scope creep, no "while I'm here" changes.
3. **No playbook edits:** do not modify `{{PLAYBOOK_ROOT}}/**` except to append the `## Executor execution log` section to the TASK file at the end of execution.
4. **No secrets:** never read, write, log, or commit `.env*` files. The runtime loads them automatically.
5. **No dependency additions** without explicit task authorization.
6. **No architectural decisions** — those belong to Claude Code.
7. **{{INFRA_HARD_RULES}}**
<!-- {{INFRA_HARD_RULES}}: project-specific forbidden operations (e.g. no destructive DB ops, no prod deploys without trigger).
     Remove this line if no infra-specific rules apply. -->

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
1. Run `{{LINT_COMMAND}}`.
2. Run `{{TEST_COMMAND}}`.
3. If either fails, fix the issue before reporting. If you cannot fix it, report it as a residual issue.
4. Review your own diff: confirm no files outside the task scope were modified.

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
- {{LINT_COMMAND}} → PASS / FAIL (details)
- {{TEST_COMMAND}} → PASS / FAIL (details)

RESIDUAL ISSUES:
- <issue> or none

ASSUMPTIONS:
- <assumption> or none

NEXT: <what the User should do — e.g. "review diff and approve Gate 2">
```
