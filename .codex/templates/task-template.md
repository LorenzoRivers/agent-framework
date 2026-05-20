# TASK-NNN — [Title]

**Block:** BLOCK-N — [Block name]
**Tier:** T1 | T2-small | T2-medium | T2-large | T3
**Branch:** `task/TASK-NNN-[slug]` from `block/BLOCK-N-[slug]`
**Status:** DRAFT | APPROVED | IN PROGRESS | COMPLETE

---

## Context

[Why this task exists. What user problem or product goal it addresses. What the system state is before this task runs. Keep to 3-5 sentences.]

---

## Behavior

[What the system must do after this task is complete. Written as observable behaviors, not implementation steps. Use bullet points.]

- The system must...
- When a user does X, the system must respond with Y.
- If condition Z, the system must...

---

## Acceptance criteria

[Concrete, testable conditions. Each item must be independently verifiable.]

- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

---

## Test scenarios

[**MANDATORY for every task that touches UI, forms, navigation, or business logic.**
Write every scenario as `[exact input or action] → [exact expected output]`.
Cover: happy path, empty/invalid input, edge cases, boundary values.
If a scenario is missing here, the Executor must NOT assume the behavior — it must stop and report RED_FLAG.]

**Happy path:**
- [action] → [result]

**Validation / error states:**
- [invalid input] → [exact error message]

**Edge cases:**
- [boundary or unusual input] → [exact result]

---

## Files in scope

[List every file the Executor is expected to read or modify. Be explicit — this bounds the task.]

**Modify:**
- `path/to/file.ts`

**Create:**
<!-- MANDATORY: list every new file, class, or module the Executor is authorized to create.
     If this list is empty, the Executor must not create any new file, class, or module.
     Any new construct not listed here is a scope violation and must be flagged in the execution log. -->
- `path/to/new-file.ts`
(none — delete this line if no new files are needed)

**Read (for context only, do not modify):**
- `path/to/reference.ts`

---

## DO NOT BREAK

[Invariants that must hold after this task. Things that were working before and must still work after.]

- [Invariant 1]
- [Invariant 2]

---

## Constraints

[Project-specific rules that apply to this task. Copy the relevant subset from `{{PROJECT_CONSTRAINTS}}` in SETUP.md.]

<!-- {{PROJECT_CONSTRAINTS}}: fill in SETUP.md and paste the relevant subset here for each task.
     Examples:
     - No destructive DB operations without explicit authorization
     - Do not modify .env* files
     - Dependencies must be explicitly authorized in the task
     - Do not deploy to production without User trigger
     - Every form with user input must specify validation rules, error messages, and real-time error clearing
-->

- [Constraint 1]
- [Constraint 2]

---

## DO NOT TOUCH

[Files or systems explicitly out of scope for this task. Prevents scope creep.]

- `.codex/**` (except appending execution log)
- `.env*`
- [Any other file explicitly excluded]

---

## Notes for Executor

[Optional: any additional context, gotchas, or pointers that help the Executor but don't fit elsewhere. Remove section if empty.]

---
<!-- Executor appends execution log below after completing the task -->
