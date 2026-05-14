# T1 Inline Task — Format

Use this format for T1 tasks (single file, ≤2 behavioral changes, zero regression risk, no DB/auth changes). Claude writes this directly in chat; User pastes it to the Executor.

---

## Template

```
TASK: TASK-NNN — [Short title]
TIER: T1 (inline)
BRANCH: task/TASK-NNN-[slug] from block/BLOCK-N-[slug]
FILE IN SCOPE: path/to/single-file.ts

CONTEXT:
[1-2 sentences on why this change is needed.]

BEHAVIOR:
- [Behavioral change 1]
- [Behavioral change 2 — max 2]

ACCEPTANCE:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

DO NOT TOUCH: .codex/**, .env*, any file not listed above.
LINT: run {{LINT_COMMAND}} — must pass.

SELF-VALIDATION:
✅ Scope: only <file> modified
✅ Diff correct: matches expected behavior
✅ No forbidden touches (.env*, .codex)
✅ {{LINT_COMMAND}} green
Verdict: Approved / Fix: <what>
```

---

## When NOT to use T1

Escalate to T2 if any of the following are true:
- More than 1 file needs to change.
- The change touches auth, DB schema, or external API contracts.
- The change could affect behavior in a different module.
- You are not confident the scope is truly isolated.

When in doubt, use T2-small.
