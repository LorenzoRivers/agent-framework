# TASK-NNNA — [Title]

**Block:** BLOCK-N — [Block name]
**Tier:** T2-small | T2-medium | T2-large
**Branch:** `task/TASK-NNNA-[slug]` from `block/BLOCK-N-[slug]`
**Status:** DRAFT | APPROVED | IN PROGRESS | COMPLETE

**Parallel group:** GROUP-N
**Dependencies:** none | TASK-NNN (must complete first)
<!-- List any tasks that must complete before this one starts. If none, write "none". -->
**Independent of:** TASK-NNNB, TASK-NNNC
<!-- List the other tasks in this parallel group — confirms they don't share files. -->

---

## Context

[Why this task exists within the parallel group. What it delivers independently of the other tasks in the group.]

---

## Behavior

[Observable behaviors after this task completes. Do not assume the other parallel tasks have run.]

- The system must...

---

## Acceptance criteria

- [ ] [Criterion 1]
- [ ] [Criterion 2]

---

## Files in scope

**This task only — confirm no overlap with parallel tasks in GROUP-N.**

**Modify:**
- `path/to/file.ts`

**Create:**
- `path/to/new-file.ts`

**Read (context only):**
- `path/to/reference.ts`

---

## DO NOT BREAK

- [Invariant 1]

---

## Constraints

- No overlap with files in TASK-NNNB or TASK-NNNC (parallel group members)
- [Standard project constraints]

---

## DO NOT TOUCH

- `.codex/**` (except appending execution log)
- `.env*`
- Files owned by TASK-NNNB: [list]
- Files owned by TASK-NNNC: [list]

---
<!-- Executor appends execution log below -->
