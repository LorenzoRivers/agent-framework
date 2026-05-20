# REVIEW-NNN — TASK-NNN: [Title]

**Reviewer:** Claude Code
**Date:** YYYY-MM-DD
**Branch reviewed:** `task/TASK-NNN-[slug]`
**Commit(s):** [hash]

---

## Verdict

> **APPROVED** | **APPROVED WITH FIXES** | **REWORK**

[One sentence explaining the verdict.]

---

## Execution log check

- [ ] Executor appended `## Executor execution log` to the TASK file
- [ ] Phase 0 verdict is documented
- [ ] Commands run and results are documented
- [ ] Residual issues are documented (or "none")
- [ ] Lesson candidates field is present (even if "none")

## Scope check

- [ ] Every new file in the diff appears in the TASK's `Files in scope → Create` list
- [ ] Every new class or module not in the `Create` list has an explicit justification in `NEW CONSTRUCTS INTRODUCED`
- [ ] No files outside `Files in scope` were modified

**Unlisted constructs found:** [list any, or "none"]

---

## Summary

[2-3 sentences: what the Executor did, does the implementation match the intent of the task.]

---

## Acceptance criteria verification

| Criterion | Status | Notes |
|---|---|---|
| [Criterion 1 from TASK] | ✅ PASS / ❌ FAIL / ⚠️ PARTIAL | |
| [Criterion 2 from TASK] | ✅ PASS / ❌ FAIL / ⚠️ PARTIAL | |
| [Criterion 3 from TASK] | ✅ PASS / ❌ FAIL / ⚠️ PARTIAL | |

---

## Critical issues

[Issues that must be fixed before this can be approved. If none, write "None."]

- [Issue 1]

## Important issues

[Issues that should be fixed but don't block approval if minor. If none, write "None."]

- [Issue 1]

## Suggestions

[Non-blocking observations, style notes, or future improvements. Not required to act on.]

- [Suggestion 1]

---

## Architectural concerns

[Does the implementation introduce patterns that conflict with the architecture defined in `/docs/tech-spec.md`? If none, write "None."]

---

## Risks / regressions

[What could break in other parts of the system as a result of this change? What to watch for in Gate 3 manual testing.]

---

## Notes for future tasks

[Any information the Executor or Claude will need in subsequent tasks in this block. Update the block brief after this review.]

## Lesson candidates

[Any pattern from this task worth capturing in lessons-learned.md — FINE_TUNING deviations, unexpected scope issues, test failures that revealed a recurring problem. Write "none" if execution was clean. Claude captures these immediately before proceeding.]
