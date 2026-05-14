# Tasks

This folder contains all TASK-NNN.md files — one per task dispatched to the Executor.

## Naming convention

```
TASK-001-[slug].md
TASK-002-[slug].md
...
TASK-010A-[slug].md   ← parallel group suffix
TASK-010B-[slug].md
```

- Numbers are sequential and never reused.
- Slugs are kebab-case, 3-5 words describing the task outcome.
- Tasks in a parallel group use a letter suffix (A, B, C).

## Task lifecycle

| Status | Meaning |
|---|---|
| `DRAFT` | Claude wrote it, waiting for User Gate 1 approval |
| `APPROVED` | User approved at Gate 1, ready for Executor |
| `IN PROGRESS` | Executor is implementing |
| `COMPLETE` | Executor finished, Gate 2 passed, merged to block branch |
| `DEFERRED` | Approved but not yet started — waiting for a prior task to complete |
| `CANCELLED` | Decided not to implement |

## Files stay forever

Completed and cancelled tasks are **not deleted**. They remain as a historical record of what was built and why. The Executor's execution log (appended at the end of each file) is part of this record.
