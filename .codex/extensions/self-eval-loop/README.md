# Extension: Self-Evaluation Loop

**Pattern:** Execute → self-evaluate against objective criteria → retry (up to N) → escalate

**Core idea:** instead of always requiring a human gate after execution, the Executor evaluates its own output against a predefined checklist of **objective, measurable criteria**. If the criteria are not met, the Executor retries autonomously — up to a configurable maximum — before escalating to Claude or the User.

---

## When to use

Use this extension when **all** of the following are true:

- The task has **fully objective** acceptance criteria that can be mechanically verified (build passes, test passes, lint passes, specific output string present, HTTP status code is 200).
- The criteria do not require human judgment (no "looks good", "seems correct", "user-friendly").
- The task has **no side effects on shared systems** (no writes to a shared DB, no deployment, no emails sent, no payments charged).
- The maximum retry count is defined and bounded.

**Do NOT use when:**
- Any acceptance criterion requires subjective judgment.
- The task writes to a shared or production database.
- The task deploys to production.
- The task modifies infrastructure (CI, Docker, env vars).
- The task is T3 (architectural) — those always require Claude review.

---

## Trade-offs

| Pro | Con |
|---|---|
| Reduces human review cycles for mechanical tasks | Risk of the Executor "fixing" in the wrong direction if criteria are ambiguous |
| Faster iteration on lint/test failures | Harder to debug if max retries hit without success |
| Good for high-confidence mechanical tasks | Self-evaluation is only as good as the criteria definition |

---

## Activation

Add this section to `.codex/AGENTS.md`:

```markdown
## Self-evaluation loop policy

Tasks that include a `## Self-eval criteria` section (using `.codex/extensions/self-eval-loop/eval-criteria-template.md`)
may use the self-evaluation loop. The Executor evaluates its output against the criteria after each implementation attempt.

Rules:
- Maximum retries: {{SELF_EVAL_MAX_RETRIES}} (default: 2)
<!-- {{SELF_EVAL_MAX_RETRIES}}: set to 2 or 3. Higher values reduce oversight; lower values limit the benefit. -->
- Each retry must be documented in the execution log with: what failed, what was changed, new result.
- If max retries are exhausted without meeting all criteria: stop, mark as BLOCKED, escalate to Claude/User.
- Self-eval loop is NEVER used for tasks with side effects on shared systems (DB writes, deploys, external APIs).
```

---

## Self-eval loop execution flow

```
Executor implements task
        │
        ▼
Run self-eval criteria checklist
        │
All pass? ──── YES ──→ Report success. Gate 2 = self-validated. Done.
        │
       NO
        │
Retry count < max?
        │
       YES ──→ Diagnose failure. Adjust implementation. Re-run.
        │              (document in execution log: what failed, what changed)
       NO
        │
        ▼
BLOCKED. Stop. Do not retry further.
Report: all attempts, all failures, diagnosis, recommended next step.
Escalate to Claude/User.
```

---

## What counts as an objective criterion

**Use in self-eval:**
- `{{LINT_COMMAND}}` exits 0
- `{{TEST_COMMAND}}` exits 0
- Specific test `test_name` passes
- File `path/to/file` exists
- File `path/to/file` contains string `"expected_string"`
- HTTP GET `/health` returns 200
- Build artifact `dist/bundle.js` exists and is non-empty

**Do NOT use in self-eval:**
- "The UI looks correct"
- "The user experience is smooth"
- "The code is clean"
- "The feature works as expected"
- "No regressions" (requires human judgment across the system)

---

## Retry documentation format

Each retry is logged in the execution log:

```markdown
## Executor execution log

**Attempt 1:**
- Ran self-eval criteria: 3/5 passed
- Failed: `{{TEST_COMMAND}}` → TestFoo failed: expected X, got Y
- Change made: fixed edge case in function foo()
- Result: re-running...

**Attempt 2:**
- Ran self-eval criteria: 5/5 passed
- STATUS: SELF-VALIDATED ✅

**Final status:** COMPLETE (self-validated after 2 attempts)
```
