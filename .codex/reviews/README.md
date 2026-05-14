# Reviews

This folder contains REVIEW-NNN.md files — Claude's formal review of Executor output for T2-large and T3 tasks.

## When a review is required

| Tier | Review required? |
|---|---|
| T1 | No — Executor self-validates |
| T2-small | No — Executor self-validates |
| T2-medium | No — Executor self-validates (Claude reviews only if Executor flags issues) |
| T2-large | Yes — `REVIEW-NNN.md` required before merge |
| T3 | Yes — `REVIEW-NNN.md` required; Claude review is mandatory |

## Naming convention

```
REVIEW-001.md    ← corresponds to TASK-001
REVIEW-010A.md   ← corresponds to TASK-010A (parallel group)
GROUP-REVIEW-1.md ← parallel group summary (if using parallel-agents extension)
```

## Verdict options

| Verdict | Meaning |
|---|---|
| `APPROVED` | Merge task branch to block branch |
| `APPROVED WITH FIXES` | Minor fixes required — Executor applies them in the same branch, then re-merges |
| `REWORK` | Task must be re-done — discard or rewrite |

## Files stay forever

Reviews are not deleted. They are a record of what was reviewed, what was found, and what was approved.
