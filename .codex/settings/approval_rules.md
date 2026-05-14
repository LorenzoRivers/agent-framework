# Approval Rules

Defines which operations Claude Code and the Executor can perform without explicit per-action User approval, and which require it.

---

## Claude Code — auto-approved (no confirmation needed)

- Read any file in the repository (any path)
- Read remote state (branch list, git log, diffs, PR status)
- Write to `.codex/**` (playbook, knowledge, tasks, reviews)
- Propose changes to `/docs/**` (but not write without approval)
- Run read-only git commands (`status`, `log`, `diff`, `branch -l`)

## Claude Code — requires explicit User approval

- Merge any branch
- Delete any branch (local or remote)
- Push to any branch
- Write to `/docs/**`
- Write to `{{APP_CODE_PATHS}}` (only if User explicitly asks Claude to touch app code)
- Any destructive git operation (`reset --hard`, `push --force`)

---

## Executor — auto-approved on active task branches

- Read any file in the repository
- Write to `{{APP_CODE_PATHS}}` on `task/TASK-NNN-slug` branches
- Run `{{LINT_COMMAND}}` and `{{TEST_COMMAND}}`
- Commit to the active `task/*` branch
- Append execution log to the active TASK file

## Executor — requires explicit task authorization

- Add or remove dependencies (package.json or equivalent)
- Run `{{WIKI_COMMAND}}` (if applicable)
- Any operation involving `.env*` files
- Any operation involving `{{INFRA_SENSITIVE_PATHS}}`
<!-- {{INFRA_SENSITIVE_PATHS}}: e.g. prisma/migrations/, infrastructure/, terraform/, .github/workflows/ -->
- Any destructive infrastructure operation

## Executor — never allowed (regardless of task)

- Commit to `block/*`, `dev`, or `main`
- Modify `.codex/**`
- Read or write `.env*` files
- Deploy to production without explicit User trigger

---

## User approval levels

| Level | Description |
|---|---|
| **Explicit** | User types a clear affirmative in chat ("approved", "yes, proceed", "go ahead") |
| **Inline** | User edits the TASK file directly and re-submits |
| **Implicit** | Auto-approved per the rules above — no confirmation needed |
