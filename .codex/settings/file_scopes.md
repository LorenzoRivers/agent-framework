# File Scopes

Defines which paths each actor owns. Customize `{{APP_CODE_PATHS}}` and `{{PLAYBOOK_ROOT}}` for your project.

---

## Playbook (`.codex/**` or `{{PLAYBOOK_ROOT}}/**`)

| Actor | Permission |
|---|---|
| Claude Code | Read + Write |
| Executor | Read only (append to TASK execution log is the sole write exception) |
| User | Read + Write |

## Documentation (`/docs/**`)

| Actor | Permission |
|---|---|
| Claude Code | Read + propose patches; write only with explicit User approval |
| Executor | Read only |
| User | Read + Write |

## Application code (`{{APP_CODE_PATHS}}`)

<!-- {{APP_CODE_PATHS}}: replace with your project's source directories.
     Examples:
     - Node.js full-stack: src/, server/, client/, shared/, scripts/
     - Python: src/, app/, scripts/
     - Go: cmd/, internal/, pkg/
     - Monorepo: packages/*/src/
-->

| Actor | Permission |
|---|---|
| Claude Code | Read only (interfaces, types, route signatures only — see AGENTS.md code reading policy) |
| Executor | Read + Write on `task/*` branches with task approval |
| User | Read + Write |

## Environment files (`.env*`)

| Actor | Permission |
|---|---|
| Claude Code | No access |
| Executor | No access |
| User | Read + Write (never committed) |

## Dependency manifests (`package.json`, `pyproject.toml`, `go.mod`, etc.)

| Actor | Permission |
|---|---|
| Claude Code | Read only; propose changes in chat |
| Executor | Write only if task explicitly authorizes it |
| User | Read + Write |

## Infrastructure / sensitive paths (`{{INFRA_SENSITIVE_PATHS}}`)

<!-- {{INFRA_SENSITIVE_PATHS}}: e.g. prisma/migrations/, .github/workflows/, terraform/, infrastructure/ -->

| Actor | Permission |
|---|---|
| Claude Code | Read only |
| Executor | Write only if task explicitly authorizes + User approves at Gate 1 |
| User | Read + Write |

---

## Branch permissions

| Branch | Claude Code | Executor |
|---|---|---|
| `task/TASK-NNN-*` | No commits | Read + Write (with task approval) |
| `block/BLOCK-N-*` | No commits (merge operations only, with User approval) | No direct commits |
| `dev` | No commits | No commits |
| `main` | No commits | No commits |
