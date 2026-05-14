# Model & Effort Guide

Reference for choosing task tier and level of review effort.

---

## Task tier decision tree

```
Is the change limited to exactly 1 file?
├── YES → Are there ≤2 behavioral changes AND zero regression risk AND no DB/auth?
│         ├── YES → T1 (inline)
│         └── NO  → T2-small
└── NO  → Does the change touch ≥3 modules OR involve auth/billing/schema?
          ├── YES → T3 (full review mandatory)
          └── NO  → Does it span multiple files with logic changes?
                    ├── YES (complex) → T2-large (Claude review)
                    └── YES (simple)  → T2-small or T2-medium
```

**When in doubt, use T2-small.** The overhead of a TASK file is low. The cost of an unreviewed regression is high.

---

## Review effort by tier

| Tier | Executor effort | Claude effort | User gate |
|---|---|---|---|
| T1 | Low — single file, paste inline | None | Gate 1 (verbal approval) |
| T2-small | Low-medium | None (Executor self-validates) | Gate 1 (TASK file) |
| T2-medium | Medium | None (Executor self-validates) | Gate 1 (TASK file) |
| T2-large | High | Medium (REVIEW-NNN.md) | Gate 1 + Gate 2 |
| T3 | High | High (REVIEW-NNN.md mandatory) | Gate 1 + Phase 1 plan + Gate 2 |

---

## Block sizing guide

A block is a coherent unit of roadmap progress — typically 3-8 tasks that together deliver one shippable increment.

| Block size | Tasks | Duration |
|---|---|---|
| Small | 2-4 tasks | 1-2 sessions |
| Medium | 4-8 tasks | 2-4 sessions |
| Large | 8-12 tasks | 4+ sessions |

Avoid blocks larger than 12 tasks. If the scope is that large, split it into two blocks with a Gate 3 between them.

---

## Decomposition principles

- **One task = one atomic outcome.** If removing the task leaves the system in a valid (if incomplete) state, the task is well-scoped.
- **Schema changes are their own task.** Never combine a DB migration with feature logic in the same task.
- **UI and backend are separate tasks** until the wiring task explicitly connects them.
- **Never give the Executor a "do the whole feature" task.** The Executor is good at executing clear specs, not at making product decisions.
