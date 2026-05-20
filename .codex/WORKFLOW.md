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

Step 2 is a 4-phase process. Phases scale with task tier — see the table at the end of this section.

#### Phase A — Paraphrase (all tiers)

Before writing anything, Claude states in chat what it understood in concrete behavioral terms:

> "What I understood: [who does what, under what conditions, with what result]."

This is 1 sentence for T1, 2-3 for T2. Its purpose is to surface misalignment immediately — before any TASK file is produced.

#### Phase B — Disambiguation (T2-medium and up)

Claude runs the disambiguation checklist (see "Disambiguation checklists" section at the end of this file) for the request type in its head. Only truly ambiguous dimensions surface as questions — each using the mandatory proposal format from `AGENTS.md` § "Decision protocol: ask with proposal":

```
❓ Question: [ambiguous dimension]
💡 Proposal: [recommended answer]
📎 Aligned with: [specific source]
```

If everything is unambiguous from the docs and project context: Phase B is skipped. No questions for the sake of asking.

#### Phase C — Test scenarios preview (T2-medium and up)

Before writing the full TASK, Claude proposes in chat the test scenarios list:

```
Proposed scenarios:
Happy path: [action] → [result]
Validation: [invalid input] → [error]
Edge case: [boundary] → [result]
Confirm, add, or remove?
```

The User confirms or adjusts. Claude writes the TASK only after scenarios are confirmed. For T2-small, Claude includes scenarios directly in the TASK without preview — they are visible at Gate 1 for correction.

#### Phase D — Write the TASK

Only after Phases A-C: Claude writes `TASK-NNN.md` using `templates/task-template.md`, incorporating the confirmed understanding, explicit assumptions (with sources), and approved test scenarios.

**Claude does NOT read the application codebase to write tasks.** TASK files contain behavioral requirements — not code. The Executor reads and verifies the code in Phase 0.5.

If the request is too large for one task, Claude proposes a decomposition before any other phase and asks the User which sub-task to start with.

#### Tier scaling

| Tier | Phase A | Phase B | Phase C | Assumptions in TASK |
|---|---|---|---|---|
| T1 | Internal — not shown in chat unless ambiguous | Skipped | Skipped | Optional |
| T2-small | In chat, 1-2 sentences | Only if explicit ambiguity | Skipped — scenarios in TASK | Mandatory |
| T2-medium | In chat, 2-3 sentences | Full checklist | Preview in chat | Mandatory |
| T2-large / T3 | In chat, 3-5 sentences | Full checklist | Preview + explicit confirmation | Mandatory |

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

**Lesson capture — immediate, while context is fresh:**
After reading the execution log, Claude checks for any of these signals:
- Phase 0 verdict is `FINE_TUNING` (a deviation was necessary)
- Fix attempts > 0 (Codex had to correct itself)
- `NEW CONSTRUCTS INTRODUCED` contains items not in the TASK `Create` list
- RED_FLAG was raised (even if resolved)

If any signal is present, Claude **immediately** appends a lesson to `.codex/knowledge/project/lessons-learned.md` before proceeding to Gate 2. The lesson is written while the execution context is still available — not reconstructed later at Gate 3.

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
| **T2 small/medium** | Claude reads: test report + **scope check** + diff | Approval in chat |
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
- **Framework-worthy filter (one question):** Claude reviews the lessons captured during this block and asks: *"Would any of these help on any project, or only on this one?"* If a candidate exists, Claude proposes a specific update to `codex-prelude.md`, `task-template.md`, or `AGENTS.md` and waits for explicit User approval before making the change. If no candidate exists, skip.
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

---

## Disambiguation checklists

*Reference for Phase B of Step 2. Claude runs the relevant checklist in its head and surfaces only the ambiguous dimensions as questions — each with a proposal and source, per the AGENTS.md protocol.*

*If a dimension is already answered by the User's request, the docs, or prior project decisions: skip it. No questions for the sake of asking.*

---

### UI / Screen task

| Dimension | Verify |
|---|---|
| Empty state | What is shown when there is no data? |
| Input validation | What is shown for empty / invalid input? After first submit or real-time? |
| Error messages | What is the exact text? Inline under field, toast, or modal? |
| Loading state | What is shown while async operation is in progress? |
| Auth / visibility | Who sees this page? What do unauthorized users see? |
| Layout | Mobile vs desktop: same layout or different? |
| Missing data | What if a referenced entity doesn't exist? |
| CTA presence | Is there an action button in the empty/error state? |

---

### API endpoint task

| Dimension | Verify |
|---|---|
| Authentication | Is auth required? Which role? |
| Ownership | Must the authenticated user own the resource? |
| Required inputs | Which request body fields are mandatory vs optional? |
| Validation errors | What is returned for invalid input (format, range, missing)? |
| Not found | What is returned if the resource doesn't exist? 404 or empty list? |
| Side effects | Does this endpoint send emails, trigger webhooks, charge payments? |
| Idempotency | Is it safe to call multiple times with the same input? |

---

### DB schema / migration task

| Dimension | Verify |
|---|---|
| Nullable fields | Which new fields are optional (nullable)? |
| Defaults | What are the default values for new fields? |
| Cascade on delete | What happens to related records when parent is deleted? |
| Backward compatibility | Can the old code read the new schema without breaking? |
| Data migration | Does existing data need to be backfilled? |

---

### Refactor task

| Dimension | Verify |
|---|---|
| Behavior preservation | Which exact behaviors must remain identical? |
| Existing tests | Are there tests that protect against regression? |
| Dependents | What other modules call this code? |
| Public API | Does this change the interface visible to other modules? |

---

### Bug fix task

| Dimension | Verify |
|---|---|
| Root cause | Is the cause confirmed or a hypothesis? |
| Reproduction | How to reproduce the bug reliably? |
| Related behavior | Could the fix break adjacent behavior? |
| Test | Does a test need to be added to prevent recurrence? |
