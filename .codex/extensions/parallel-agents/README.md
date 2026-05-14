# Extension: Parallel Agents

**Pattern:** Fan-out → parallel execution → fan-in review

**Core idea:** instead of executing tasks one at a time, Claude identifies a set of independent tasks and dispatches them to multiple Executor instances simultaneously. Claude then performs a fan-in review of all outputs before any task is merged.

---

## When to use

Use this extension when **all** of the following are true:

- You have 2+ tasks in the current block that have **no dependency on each other's output**.
- Each task has its own isolated file scope (no shared files being modified).
- You have the capacity to run multiple Executor instances simultaneously.
- The tasks do not touch shared infrastructure (DB schema, auth, shared API contracts).

**Do NOT use when:**
- Task B reads output from Task A (sequential dependency).
- Tasks modify the same file.
- You have only one Executor instance available.
- The tasks involve high-risk changes (T3, auth, billing) — run those sequentially with full reviews.

---

## Trade-offs

| Pro | Con |
|---|---|
| Faster delivery of a block | Claude must review N diffs, not 1 |
| Natural for independent UI/backend/test tasks | Merge conflicts more likely if scope bleeds |
| Exposes parallelism in the roadmap | Harder to debug if two tasks interact unexpectedly |

---

## Activation

Add this section to `.codex/AGENTS.md`:

```markdown
## Parallel execution policy

When Claude identifies a set of tasks as parallelizable (no inter-dependencies, isolated file scopes), it may dispatch them as a parallel group using `.codex/extensions/parallel-agents/parallel-task-template.md`.

Parallel groups are labeled `GROUP-N`. All tasks in a group must complete before any is merged. Claude performs a combined fan-in review.

Gate 2 for a parallel group: Claude reviews all diffs together (one REVIEW-NNN.md per task, plus a GROUP-REVIEW-N.md summary). All tasks in the group must pass before any is merged to the block branch.
```

---

## Workflow with parallel agents

```
Claude identifies GROUP-1 = {TASK-010A, TASK-010B, TASK-010C} (independent)
│
├── Dispatch TASK-010A to Executor instance 1
├── Dispatch TASK-010B to Executor instance 2
└── Dispatch TASK-010C to Executor instance 3
        (all run simultaneously on separate task/* branches)
│
All three return output
│
Claude fan-in review:
├── REVIEW-010A.md
├── REVIEW-010B.md
├── REVIEW-010C.md
└── GROUP-REVIEW-1.md (cross-task consistency check)
│
User approves all → merge all task/* into block/* sequentially
```

---

## Naming convention

- Tasks in a parallel group use a letter suffix: `TASK-010A`, `TASK-010B`, `TASK-010C`.
- Branches: `task/TASK-010A-[slug]`, `task/TASK-010B-[slug]`, etc.
- Group review: `GROUP-REVIEW-N.md` in `.codex/reviews/`.

---

## GROUP-REVIEW template

After individual reviews, Claude writes a brief group review:

```markdown
# GROUP-REVIEW-N — Parallel group [TASK-NNNA, TASK-NNNB, ...]

**Group verdict:** ALL APPROVED | PARTIAL (list which tasks need rework)

## Cross-task consistency check
- [ ] No two tasks modify the same file
- [ ] Interfaces introduced by Task A are compatible with what Task B expects
- [ ] No conflicting assumptions between tasks

## Merge order
Merge in this order to minimize conflicts:
1. TASK-NNNA (no dependencies)
2. TASK-NNNB (no dependencies)
3. TASK-NNNC (no dependencies)

## Notes
[Any cross-task observations]
```
