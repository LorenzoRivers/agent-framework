# {{PROJECT_NAME}} — Workflow

This is the canonical loop for every task. Roles and rules are defined in [`AGENTS.md`](AGENTS.md). This file describes **how** the actors interact step by step.

---

## The 7-step loop

```
User                 Claude              Codex CLI           Runtime
 │                     │                   │                    │
 │  0. session start   │                   │                    │
 │  (reads handoff +   │                   │                    │
 │   block brief)      │                   │                    │
 │                     │                   │                    │
 │  1. request         │                   │                    │
 ├────────────────────>│                   │                    │
 │                     │  2. produce TASK  │                    │
 │<────────────────────┤                   │                    │
 │  3. Gate 1: approve │                   │                    │
 ├────────────────────>│                   │                    │
 │                     │  4. codex exec    │                    │
 │                     ├──────────────────>│                    │
 │                     │                   │  implement on      │
 │                     │                   │  task/TASK-NNN-... │
 │                     │  5. output + diff │                    │
 │                     │<──────────────────┤                    │
 │                     │  6. Gate 2        │                    │
 │<────────────────────┤  (review/fix)     │                    │
 │  on approve: merge task/* → block/BLOCK-N                    │
 │  (repeat steps 1-6 for each task in the block)               │
 │                                                              │
 │  7. Gate 3: block complete — manual checks                   │
 ├──────────────────────────────────────────────────────────────>│
 │  (Runtime: visual inspection + runtime verification)         │
 │<──────────────────────────────────────────────────────────────┤
 │  on User approval: merge block/BLOCK-N → dev                 │
 │  (merge dev → main on explicit User decision later)          │
```

> **Core principle:** the User talks only to Claude. Claude is the sole intermediary between the User and Codex CLI. The User never runs Codex commands directly.

---

## Step-by-step

### Step 0 — Session start (Claude only)

At the start of every session, before accepting any task:

1. Read `session-handoff.md` — current block, pending tasks, branch state, open decisions.
2. Read the active block brief: `.codex/knowledge/BLOCK-N-codex-brief.md`.
3. If either is missing or stale: declare the gap explicitly before writing any task, and propose an update.
4. If the block brief does not exist yet for the current block: create it immediately.

### Step 1 — User request

The User describes intent in natural language.

### Step 2 — Claude produces the TASK

Claude:
1. Reads relevant `.codex/knowledge/**` and `/docs/**` per the priority order in `AGENTS.md`.
2. Produces a `TASK-NNN.md` file in `.codex/tasks/` using `templates/task-template.md`.
3. Outputs a brief summary in chat: what the task does, why, what's at risk.

**Claude does NOT read the application codebase to write tasks.** TASK files contain behavioral requirements and acceptance criteria — not code. The Executor reads and verifies the code in Phase 0.5.

If the request is too large for one task, Claude proposes a decomposition and asks the User which sub-task to start with.

### Step 3 — Gate 1: Task approval

The User reviews the TASK markdown. Possible outcomes:
- **Approved** → go to Step 4.
- **Approved with changes** → User asks Claude to revise the TASK.
- **Rejected** → discard or rescope.

For trivial tasks (T1), the User can approve a short inline prompt directly in chat. The principle is: explicit approval before Codex CLI touches anything.

### Step 4 — Claude invokes Codex CLI

After Gate 1 approval, Claude invokes Codex CLI non-interactively via Bash:

```bash
{{CODEX_EXEC_COMMAND}} \
  -C "<project_root>" \
  -s danger-full-access \
  --output-last-message /tmp/codex_out.md \
  "$(cat .codex/tasks/TASK-NNN-slug.md)"
```

<!-- {{CODEX_EXEC_COMMAND}}: e.g. ~/bin/codex-ai exec, codex exec -->
<!-- Note: use -s danger-full-access (not workspace-write) — workspace-write blocks writes to .codex/tasks/, git, and npm -->
<!-- Note: pre-create the branch before invoking: git checkout -b task/TASK-NNN-slug block/BLOCK-N-slug -->

Codex CLI executes these phases autonomously:
1. Reads `.codex/AGENTS.md`, `.codex/templates/codex-prelude.md`, and the TASK file.
2. **Phase 0 — Plan review.** Verdict: `OK`, `FINE_TUNING`, or `RED_FLAG`.
   - `RED_FLAG` → Codex stops without touching anything. Claude reports the issue to the User.
   - `OK` / `FINE_TUNING` → proceeds.
3. **Phase 0.5 — Current state verification.** Verifies the current code state matches the TASK description.
4. **T2 large / T3 only — Phase 1: Implementation plan.**
   Codex writes the plan in `.codex/tasks/TASK-NNN-plan.md` and **stops** without creating the branch or touching application files.
   Claude reads the plan and presents it to the User. If approved, Claude re-invokes `codex exec` with explicit instruction "Phase 1 approved, proceed with implementation."
   - T1 / T2 small / T2 medium: no Phase 1 — Codex creates the branch and proceeds directly.
5. Creates branch `task/TASK-NNN-slug` from **`block/BLOCK-N-slug`**.
6. Implements exactly what the task specifies.
7. Appends `## Executor execution log` to the TASK file as the final step.

### Step 5 — Codex CLI returns output to Claude

Codex CLI runs the internal loop (lint + tests + fix if needed) before committing. It writes structured output to `/tmp/codex_out.md`. Claude reads the file and the `git diff` of the branch.

**If Codex auto-corrected failures during the loop:** Claude reads the test report, verifies all pass, then examines the cumulative diff (implementation + fixes).

**If Codex reports tests still failing (RESIDUAL ISSUES):** Claude applies the "Try to Fix" diagnosis:

1. **Classify each failure** (Type A/B/C/D — see codex-prelude.md)
2. **Build a surgical prompt** for Codex that specifies: exact file, line, cause, fix to apply
3. **Re-invoke Codex** with "Fix: [precise description]" — not "retry"
4. If tests pass after the fix → normal Gate 2
5. If tests still fail → Claude reports to the User with full diagnosis + options

Max 2 "Try to Fix" iterations from Claude. On the third failure, it is the User's decision.

### Step 6 — Gate 2: validation (test-first)

**Mandatory prerequisite:** all tests must be green before Claude approves the diff.

| Task tier | Who validates | Format |
|---|---|---|
| **T1 inline** | Claude checks: lint + tests + diff | Approval in chat |
| **T2 small/medium** | Claude reads: test report + diff from Codex | Approval in chat |
| **T2 large / T3** | Claude: test report + diff + formal review | `REVIEW-NNN.md` |
| **Tests failed after internal loop** | Claude → targeted "Try to Fix" (max 2×) | Surgical fix in prompt |
| **Still failing after 2 Try to Fix** | Claude reports to User | Full diagnosis + options |

### Step 7 — Merge

The User decides:
- **Approved** → merge `task/TASK-NNN-slug` into `block/BLOCK-N-slug`.
- **Approved with fixes** → pass the fix list back to the Executor (mini-loop: Step 4 → 5 → 6 → 7 again).
- **Rework** → discard or rewrite the TASK.

After every merge, Claude **proposes deleting the merged branch** (both local and remote) and waits for explicit User approval.

### After Gate 2 (task merged to block branch)

- Branch `task/TASK-NNN-slug` is merged to `block/BLOCK-N-slug`.
- **Optional wiki refresh:** if the project has a wiki generator, run `{{WIKI_COMMAND}}` to regenerate the codebase wiki before pushing.
<!-- {{WIKI_COMMAND}}: e.g. npm run wiki, make wiki, python scripts/gen-wiki.py — omit this step if no wiki generator exists -->
- **Git sync:** immediately push `block/BLOCK-N-slug` — local and remote must never diverge.
- Claude proposes deleting `task/TASK-NNN-slug` locally and on the remote — deletion only after User approval.
- The TASK markdown stays in `.codex/tasks/` as historical record.
- The REVIEW markdown stays in `.codex/reviews/` (T2 large / T3 only).
- **Post-merge knowledge update (mandatory):** Claude updates `.codex/knowledge/BLOCK-N-codex-brief.md` with any new interfaces, endpoints, or constraints introduced by the task.

### After Gate 3 (block merged to dev)

- User runs the **Gate 3 checklist**: `.codex/checklists/gate3-block-approval.md`.
- On explicit User approval: merge `block/BLOCK-N-slug` → `dev`, then push immediately.
- `dev → main` merge happens later, only on explicit User request.
- **Session handoff:** at the end of each Claude session, Claude updates `.codex/knowledge/project/session-handoff.md` with decisions taken, pending items, and next candidate task.

---

## Task sizing — three tiers

Use the smallest tier that covers the risk. Default: T2 small.

### T1 — Inline task (fast path)

**When to use:** all of the following are true:
- Exactly 1 file in scope
- ≤ 2 behavioral changes
- Zero risk of regression to other modules
- No DB or auth changes

**Format:** Claude writes a compact prompt block (~20 lines) directly in chat. No markdown file created. User pastes to Executor.

**Template:** `.codex/templates/inline-task-template.md`

**Gate 2:** Executor self-validates. 5-field checklist in output. No REVIEW file.

```
✅ Scope: only <file> modified
✅ Diff correct: matches expected behavior
✅ No forbidden touches (.env*, .codex)
✅ {{LINT_COMMAND}} green
Verdict: Approved / Fix: <what>
```

### T2 — Full task (standard path)

**When to use:** multiple files, logic changes, DB migrations, new API endpoints, refactors, any feature.

**Format:** `TASK-NNN.md` in `.codex/tasks/` using `templates/task-template.md`.
**Content:** behavioral requirements + acceptance criteria. No code blocks.

| Size | Examples | Gate 2 |
|---|---|---|
| **Small** | UI fix, bug fix, config tweak | Executor self-validates |
| **Medium** | new isolated feature, API endpoint, service refactor | Executor self-validates |
| **Large** | multi-module feature, schema change + API + UI together | Claude review → `REVIEW-NNN.md` |

**Rule:** never give the Executor a "do the whole feature end-to-end" task. Always slice into atomic units.

### T3 — Complex task (full review path)

**When to use:** architectural changes, auth flows, billing, any change that touches ≥ 3 modules or has non-trivial rollback risk.

**Format:** `TASK-NNN.md` with behavioral requirements + explicit risk matrix section.
**Gate 2:** Claude review mandatory → `REVIEW-NNN.md`.

---

## Good examples

- ✅ TASK-014A: "Create DB schema for feature X (1 migration, no behavior change)."
- ✅ TASK-014B: "Add backend API for feature X step 1."
- ✅ TASK-014C: "Build UI for feature X step 1 (no backend wiring)."
- ✅ TASK-014D: "Wire UI step 1 to backend API."

## Bad examples

- ❌ "Implement the entire onboarding system" — too large.
- ❌ "Fix this part" — too vague.
- ❌ Executor commits to `main` — bypasses both gates.
- ❌ Claude rewrites application code without User asking — out of role.
