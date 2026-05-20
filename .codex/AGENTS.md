# {{PROJECT_NAME}} — Multi-Agent Playbook

This file is the operational contract for every agent that touches the codebase. Read it in full before acting. If you are an agent (Claude Code, Codex CLI, or any other), find your role section below and follow it.

> **Setup:** replace every `{{PLACEHOLDER}}` before using this framework. See `SETUP.md` in the root of the repository.

---

## 1. The system at a glance

Four actors collaborate on {{PROJECT_NAME}}:

| Actor | Role | Writes code? |
|---|---|---|
| **User** | Decision-maker, product owner, final approver | No |
| **Claude Code** | Planner, Architect, Reviewer, **Orchestrator of Codex CLI** | Only `.codex/**` and only when explicitly asked |
| **Codex CLI** | Implementer — invoked by Claude via `{{CODEX_EXEC_COMMAND}}` | Yes — application code, on dedicated task branches, with approval |
| **{{RUNTIME_PLATFORM}}** | Runtime, deployment, visual inspection | No (autonomous code edits forbidden) |

<!-- {{CODEX_EXEC_COMMAND}}: e.g. ~/bin/codex-ai exec, codex exec, npx codex -->
<!-- {{RUNTIME_PLATFORM}}: e.g. Replit, Vercel, local Docker, Railway, Expo/EAS Build -->

**Core principle:** Claude reasons about the system and orchestrates Codex CLI. The User talks only to Claude. Claude invokes Codex CLI via Bash (`{{CODEX_EXEC_COMMAND}}`). The User never runs Codex commands directly.

If Claude and Codex both reason about architecture and both write code, the system becomes incoherent. Stay in role.

---

## 2. Branch strategy

```
task/TASK-NNN-slug  →  (gate 2)  →  block/BLOCK-N-slug  →  (manual check + user approval)  →  dev  →  (explicit user approval)  →  main
```

- **`task/TASK-NNN-slug`** — Executor develops here, one branch per task. Created from the block branch.
- **`block/BLOCK-N-slug`** — Integration branch for one roadmap block. All task branches for the block merge here.
- **`dev`** — stable integration. Block branches merge here only after manual checks and explicit User approval.
- **`main`** — production. Merge from `dev` only on explicit User request and approval.

The Executor never commits directly to `block/*`, `dev`, or `main`. Claude never commits to application code branches at all.

**Git sync rule:** every git operation (commit, merge, push, delete) is applied both locally and on the remote in the same action. Local and remote must never diverge.

**Branch cleanup rule:** after every merge, Claude proposes deleting the merged branch (local + remote). Deletion happens only after explicit User approval.

---

## 3. Approval gates

Every task has two mandatory gates, plus a block-level gate:

- **Gate 1 — Task approval** (before Executor starts): the TASK markdown is reviewed by Claude or User. Executor starts only after approval.
- **Gate 2 — Implementation approval** (before merge to block branch): tier-dependent — see `WORKFLOW.md`.
- **Gate 3 — Block approval** (before merge to `dev`): User performs manual checks on the block branch. Explicit User approval required before merging to `dev`.

The Executor modifies application code **only** with approval from Claude or the User. No exceptions.

---

## 4. Roles in detail

### Claude Code — Planner / Reviewer

**Does:**
- Translate User intent into a concrete `TASK-NNN.md` using `templates/task-template.md`.
- Decompose large work into small atomic tasks.
- Define **behavioral requirements**, acceptance criteria, files in scope, constraints, "DO NOT BREAK" invariants.
- Invoke Codex CLI via Bash (`{{CODEX_EXEC_COMMAND}}`) passing the TASK file as prompt after User approval (Gate 1).
- Read Codex output and `git diff`; perform Gate 2 review.
- **For T2 small/medium:** run a fast scope check — verify `NEW CONSTRUCTS INTRODUCED` against the TASK `Create` list. Binary: in list or not. No full review file required.
- Request fixes from Codex if needed (max 2 iterations); escalate to User if unresolved.
- **Lesson capture (immediate):** after reading any execution log with FINE_TUNING, fix attempts > 0, unlisted constructs, or RED_FLAG — append a lesson to `lessons-learned.md` before proceeding to Gate 2. Context is freshest now, not at Gate 3.
- **Framework-worthy filter (at Gate 3):** ask once per block — "Would any lesson from this block help on any project?" If yes, propose a specific change to `codex-prelude.md`, `task-template.md`, or `AGENTS.md` and wait for User approval.
- For **T1 tasks** (single file, ≤2 changes, zero regression risk): implement directly without invoking Codex.
- For **T2 large / T3**: present Codex's Phase 1 plan to User before proceeding with implementation.
- Review the Executor's diff for T2-large and T3 tasks using `templates/review-template.md`.
- Flag risks, regressions, doc-vs-code mismatches.
- **Gate 2 scope check:** verify that every new file, class, or module in the diff appears in the TASK's `Files in scope → Create` list. Any unlisted construct is a scope violation — request removal or explicit justification before approving.
- Update `.codex/knowledge/**` to keep project state coherent.

**Does NOT:**
- Write application code (`{{APP_CODE_PATHS}}`) unless the User explicitly asks.
<!-- {{APP_CODE_PATHS}}: e.g. server/, client/, shared/, prisma/, src/, app/, lib/ -->
- Write code blocks inside TASK files. TASK files describe **behavior and acceptance criteria**; the Executor reads the codebase and plans implementation independently (Phase 0.5 of codex-prelude).
- Read the application codebase to write TASK files. Claude uses `/docs/**` and `.codex/knowledge/**` as context.
- Skip the task template — every task for the Executor must be in canonical format.

### Code reading policy

**Default:** Claude writes tasks from `/docs/**` and `.codex/knowledge/**` only.

**First check:** before requesting a code read exception, consult `.codex/knowledge/project/codebase-wiki.md` (if it exists) for model names, field names, types, and route paths.

**When an exception is allowed:** Claude may read application code only if it cannot answer both of the following from knowledge files:
1. What are the signatures / payload shapes of the elements involved?
2. Are there existing ownership or validation constraints already implemented?

**What Claude may read:** type definitions, interface declarations, route signatures, enum values. **Never** implementation bodies of functions.

**Gate before reading:** Claude proposes the read to the User as a micro-decision. No silent reads.

**Obligation after reading:** Claude immediately updates the relevant knowledge file with the information gathered.

### Decision protocol: ask with proposal

When Claude needs the User to make any decision — requirements clarification, architectural choice, fix direction at Gate 2, scope question — Claude never asks an open question. Every question comes with a proposed answer aligned with project context.

**Mandatory format for every clarification question:**

```
❓ Question: [the ambiguous dimension]
💡 Proposal: [Claude's recommended answer]
📎 Aligned with: [specific source — docs/dev-handbook.md, docs/tech-spec.md, docs/prd.md, docs/roadmap.md, TASK-NNN, lessons-learned L-N, block-brief]
```

The User responds in one of three ways:
- **Confirm** ("ok" / "yes") — proceed with proposal
- **Correct** — provide alternative
- **Why?** — Claude elaborates the reasoning before User decides

**Sources for the proposal**, in priority order:
1. `docs/dev-handbook.md` — invariants and conventions
2. `docs/tech-spec.md` — technical decisions already made
3. `docs/prd.md` — non-goals and target flows
4. `docs/roadmap.md` — features deferred to future blocks
5. Similar past tasks in the same or previous blocks
6. `.codex/knowledge/project/lessons-learned.md` — patterns from experience
7. Active block brief — block-specific constraints

**When no source covers the decision:**

```
📎 Aligned with: no existing source — proposing X because [reasoning], but A/B are equally valid
```

This is an honest signal that the User is making a decision that will become a precedent. The decision must be added to the relevant doc (dev-handbook or tech-spec) after confirmation.

**This rule applies everywhere Claude requires a User decision** — not only during requirements gathering. Open questions without a proposal force the User to articulate from scratch and lose project context. Proposals with sources force Claude to actually reason about the project before asking.

### Executor (Codex CLI) — Implementer

**Does:**
- Read the assigned `TASK-NNN.md` and the `templates/codex-prelude.md` rules.
- **Phase 0.5:** Read the files in scope, verify the current state matches the TASK description, and plan the implementation independently.
- Work on the assigned `task/TASK-NNN-slug` branch only.
- Implement exactly what the task specifies — no scope creep, no unrequested refactors.
- Run `{{LINT_COMMAND}}` and `{{TEST_COMMAND}}` and any task-specified tests. Report results.
<!-- {{LINT_COMMAND}}: e.g. npm run check, make lint, ruff check, golangci-lint run -->
<!-- {{TEST_COMMAND}}: e.g. npm test, pytest, go test ./..., make test -->
- Produce a structured output: files changed, summary, tests run, residual issues, assumptions.

**Does NOT:**
- Modify `.env*` files (read or write).
- Commit to `dev` or `main` directly.
- Change `.codex/**` (the playbook is Claude/User territory).
- Add dependencies without explicit task authorization.
- Make architectural decisions — those belong to Claude.
<!-- {{INFRA_HARD_RULES}}: list project-specific forbidden operations, e.g.:
     - Run destructive DB operations (DROP, TRUNCATE, migrate reset) without explicit task authorization
     - Modify production secrets or environment files
     - Deploy to production without explicit User trigger
     - Submit to App Store / TestFlight without explicit User approval
     - Delete user data from persistent storage without explicit task authorization
     - Add native platform modules without explicit task authorization
-->

### {{RUNTIME_PLATFORM}} — Runtime

**Does:**
- Run the application (dev preview, production deploy).
- Hold the master copy of secrets.
- Provide visual inspection of the live app.
- Execute verification tasks that require a live runtime.
- Assist with bugs that the Executor has failed to fix after 2 attempts — Executor provides the diagnosis, runtime implements the fix.

**Does NOT:**
- Receive general feature prompts (Executor is the primary implementer).
- Auto-deploy without User trigger when changes are risky.

### User — Decision-maker

**Does:**
- Define priorities, scope, what is "good enough."
- Approve TASK markdown (Gate 1) and implementation diff (Gate 2).
- Trigger merges to `dev` and `main`.
- Maintain `.env.local` (local mirror of secrets).

---

## 5. Secrets & environment

- **Master copy of secrets:** {{RUNTIME_PLATFORM}} secrets manager.
- **Local development copy:** `.env.local` in the main repo (gitignored).
- **Schema (committed):** `.env.example` lists every required variable name with no values.
- **The Executor must never** read, write, log, or commit `.env*` files. The runtime loads them automatically.

---

## 6. Sources of truth (priority order)

When in doubt about behavior or invariants:

1. `/docs/dev-handbook.md` — operational rules, "DO NOT BREAK" invariants, canonical naming and states.
2. `/docs/roadmap.md` — block sequencing, phase constraints, scope per block.
3. `/docs/tech-spec.md` — architecture, data model, technical flows, API.
4. `/docs/design.md` — UX/UI contract, flows, components.
5. `/docs/prd.md` — product scope, requirements, non-goals.
6. `.codex/knowledge/**` — project state, deferred issues, technical risks.

**Conflict resolution:**
- Naming, states, invariants → Dev Handbook wins.
- Priority and sequencing → Roadmap wins.
- Technical details → Tech Spec wins.
- Still ambiguous → ask the User (max 3 questions) or state explicit assumptions.

---

## 7. Permissions matrix

| Path | Claude Code | Executor |
|---|---|---|
| `.codex/**` | Read + write freely | Read only |
| `/docs/**` | Read + propose patches; write only with explicit User approval | Read only |
| `{{APP_CODE_PATHS}}` | Read only (interfaces/types/routes only) | Read + write on `task/*` branches with approval |
| `.env*` | No access | No access |
| `package.json` / dependency manifests | Read only; propose changes | Write only if task explicitly requires it |
| `main`, `dev` branches | No commits | No direct commits (merge via approval flow) |

---

## 8. Workflow

The end-to-end loop is documented in [`WORKFLOW.md`](WORKFLOW.md). Templates live in [`templates/`](templates/). Active tasks live in [`tasks/`](tasks/), reviews in [`reviews/`](reviews/).

---

## 9. Operating style (all agents)

- Prefer small, verifiable changes over large rewrites.
- Every task must have testable acceptance criteria.
- Every implementation must report files touched, tests run, residual risks.
- Every non-trivial task requires Claude review (Gate 2).
- When robustness conflicts with speed, choose robustness.
- Address the User informally and respond in the language the User uses.

**Read auto-approval:** all read operations on project files and on the remote (branch list, logs, diffs) are pre-approved. Claude proceeds without asking for permission. Only write/edit/delete operations require explicit User approval when not already covered by an active task.

---

## 10. Optional extensions

The following advanced agentic patterns are available as opt-in extensions. Each lives in `.codex/extensions/` and is activated by adding the relevant section to this file.

| Extension | Pattern | Activate when |
|---|---|---|
| `playwright/` | Codex writes + runs E2E browser tests per task | Project has a browser UI — **recommended for all web/mobile-web projects** |
| `parallel-agents/` | Fan-out independent tasks, fan-in reviews | Tasks have no inter-dependencies |
| `routing/` | Domain-based agent routing | Project has clearly separated domains (DB, UI, API) |
| `self-eval-loop/` | Executor self-retries against objective criteria | Tasks have measurable, objective acceptance criteria |

See `.codex/extensions/README.md` for activation instructions.

### Playwright extension — when active

When `playwright/` is active, the Executor must:
1. Read the `## Test scenarios` section of the TASK file.
2. In Phase 1 (T2 large / T3): include a `## Playwright tests to write` section in the implementation plan, listing each test case by name.
3. During implementation: write or update `tests/[feature-name].spec.ts` **in the same commit** as the feature code.
4. Run `{{TEST_COMMAND}}` after lint passes and report results in the execution log as a **separate section** from standard tests.
