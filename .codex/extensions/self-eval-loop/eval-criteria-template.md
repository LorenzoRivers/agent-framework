# Self-Eval Criteria — TASK-NNN

Add this section to a TASK file to opt into the self-evaluation loop.
All criteria must be objective and mechanically verifiable.

---

## Self-eval criteria

**Max retries:** 2
<!-- Set to 2 or 3. Must not exceed {{SELF_EVAL_MAX_RETRIES}} from AGENTS.md. -->

**Side-effect check (must confirm before using self-eval):**
- [ ] This task does NOT write to a shared database
- [ ] This task does NOT deploy to any environment
- [ ] This task does NOT call external APIs with side effects (payments, emails, SMS)

If any box above is unchecked, **do not use the self-eval loop** — escalate to Claude/User after first attempt.

---

**Objective criteria (all must pass):**

| # | Criterion | How to verify |
|---|---|---|
| 1 | `{{LINT_COMMAND}}` exits 0 | Run command, check exit code |
| 2 | `{{TEST_COMMAND}}` exits 0 | Run command, check exit code |
| 3 | [Specific test name] passes | Run `{{TEST_COMMAND}} -k "test_name"` or equivalent |
| 4 | File `[path]` exists | `ls path/to/file` |
| 5 | [Other objective criterion] | [How to verify mechanically] |

<!-- Add or remove rows. Every criterion must be verifiable without human judgment. -->

---

**Escalation condition:**

If all criteria are not met after {{SELF_EVAL_MAX_RETRIES}} retries:
1. Stop immediately. Do not attempt a third fix.
2. Report: each attempt, what failed, what was tried, current diagnosis.
3. Mark task as BLOCKED.
4. The User will decide whether to escalate to Claude for review or to retry with a modified approach.
