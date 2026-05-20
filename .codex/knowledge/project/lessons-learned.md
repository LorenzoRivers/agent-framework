# Lessons Learned — {{PROJECT_NAME}}

> Update after every completed block or significant error.
> Last updated: [date]

---

## Workflow Claude ↔ Codex

**L1 — The flow is unidirectional: User → Claude → Codex**
The User talks only to Claude. Claude orchestrates Codex via `{{CODEX_EXEC_COMMAND}}`. There is no direct User↔Codex communication. Clarify this at the start of every new project.

**L2 — Pre-create the branch before invoking Codex**
If the branch doesn't exist or the worktree is dirty, Codex goes RED_FLAG. Fixed pattern:
`git checkout -b task/...` → `git add + commit TASK file` → invoke Codex.

**L3 — Use `-s danger-full-access`, not `workspace-write`**
`workspace-write` blocks writes to `.codex/tasks/`, git, and npm. `danger-full-access` is required for any task that touches the repo.

**L4 — Codex does not commit without an explicit instruction**
Without the rule "commit all files before reporting" in codex-prelude, files remain untracked. Rule already added to the prelude template.

**L5 — A task template without test scenarios produces cascading patch tasks**
Vague acceptance criteria ("field X renders correctly") generate sequences of fix tasks. Solution: mandatory "Test scenarios" section with `[input] → [expected output]` format. Already in the task template.

**L6 — A domain-specific AGENTS.md or codex-prelude is worth more than 10 per-task constraints**
Project-specific rules read automatically by Codex at every run eliminate dependence on the quality of individual TASKs. Add domain rules to codex-prelude at the start of BLOCK-1.

---

## Meta

**L7 — Write lessons learned in real time**
Writing them only in chat means losing them at the next session. This file is the correct destination. Update here after every completed block or significant error.

---

<!-- Add project-specific lessons below this line as the project progresses -->
