# agent-framework

A battle-tested multi-agent workflow framework for software product development. Extracted from a real production project and generalized for reuse.

**Core idea:** Claude Code plans and reviews. A code-execution agent (Codex CLI or similar) implements. A runtime (Replit, Vercel, etc.) runs the result. The User decides. Each actor has a strict role, a permissions boundary, and a structured contract.

---

## What's included

```
.codex/
├── AGENTS.md              Roles, permissions, operating rules for every agent
├── WORKFLOW.md            The 7-step loop: task → gate 1 → implement → gate 2 → merge → gate 3 → dev
├── templates/
│   ├── task-template.md          TASK-NNN.md — behavioral spec for the Executor
│   ├── inline-task-template.md   T1 compact format for trivial single-file changes
│   ├── review-template.md        REVIEW-NNN.md — Claude's post-implementation review
│   ├── codex-prelude.md          Executor rules: phases, hard rules, output format
│   └── session-handoff-template.md  State persisted between Claude sessions
├── checklists/
│   └── gate3-block-approval.md   Manual checklist before merging a block to dev
├── settings/
│   ├── approval_rules.md         What each actor can do without asking
│   └── file_scopes.md            Who owns which paths
├── knowledge/
│   └── project/
│       ├── session-handoff.md    Live project state (updated each session)
│       ├── deferred-issues.md    Known bugs deferred to future blocks
│       └── open-technical-risks.md
├── tasks/                 TASK-NNN.md files (one per task)
├── reviews/               REVIEW-NNN.md files (T2-large and T3 tasks)
└── extensions/            Optional advanced agentic patterns
    ├── parallel-agents/   Fan-out independent tasks, fan-in reviews
    ├── routing/           Domain-based agent routing (DB, UI, API agents)
    └── self-eval-loop/    Executor self-retries against objective criteria
```

---

## Agentic patterns implemented

| Pattern | Where |
|---|---|
| **Orchestrator → Subagent** | Claude writes TASK specs; Executor implements |
| **Plan → Verify → Execute** | Gate 1 (task approval) + Phase 0.5 (state verification) before any code |
| **Reflection / Review loop** | Gate 2: Executor self-reviews (T1/T2) or Claude reviews (T2-large/T3) |
| **Memory / Knowledge persistence** | `session-handoff.md`, block briefs, `codebase-wiki.md` |
| **Parallel agents** *(optional)* | `.codex/extensions/parallel-agents/` |
| **Domain routing** *(optional)* | `.codex/extensions/routing/` |
| **Self-eval loop** *(optional)* | `.codex/extensions/self-eval-loop/` |

---

## Quickstart

1. **Use this template** (GitHub button) or clone it.
2. Follow `SETUP.md` — replace placeholders, configure your stack, init git.
3. Write your first `/docs/prd.md` and `/docs/tech-spec.md`.
4. Start a Claude Code session. Claude reads `session-handoff.md`, you describe what you want, Claude writes `TASK-001.md`.
5. Approve the task (Gate 1). Pass it to your Executor (Codex CLI).
6. Executor implements, returns output. Claude reviews (if T2-large/T3). You approve (Gate 2).
7. Repeat for each task in the block. When the block is done, run the Gate 3 checklist and merge to `dev`.

---

## Task tiers

| Tier | When | Gate 2 |
|---|---|---|
| **T1 inline** | 1 file, ≤2 changes, zero regression risk | Executor self-validates |
| **T2 small/medium** | Multiple files, isolated feature | Executor self-validates |
| **T2 large** | Multi-module, schema + API + UI together | Claude review → REVIEW-NNN.md |
| **T3** | Architectural change, auth, billing, ≥3 modules | Claude review mandatory |

---

## Configuration examples

### Node.js + Prisma
```
LINT_COMMAND:   npm run check
TEST_COMMAND:   npm test
WIKI_COMMAND:   npm run wiki
APP_CODE_PATHS: server/, client/, shared/, prisma/, scripts/
INFRA_HARD_RULES:
  - Never run prisma migrate reset or db push --force-reset
  - Never run DROP, TRUNCATE, or mass DELETE without explicit task authorization
```

### Python FastAPI
```
LINT_COMMAND:   ruff check . && mypy .
TEST_COMMAND:   pytest
WIKI_COMMAND:   (leave blank)
APP_CODE_PATHS: app/, scripts/, tests/
INFRA_HARD_RULES:
  - Never run alembic downgrade without explicit task authorization
```

### Go
```
LINT_COMMAND:   golangci-lint run
TEST_COMMAND:   go test ./...
WIKI_COMMAND:   (leave blank)
APP_CODE_PATHS: cmd/, internal/, pkg/
INFRA_HARD_RULES:
  - (none — add if applicable)
```

---

## Design principles

- **Roles are strict.** An agent that does its own job well is more valuable than one that tries to do everything.
- **Gates are mandatory.** The cost of pausing to approve is always lower than the cost of reversing an unwanted change.
- **Tasks are atomic.** "Implement the whole feature" is not a task. Each task has one clear outcome, one set of files, one set of acceptance criteria.
- **Knowledge persists.** The `session-handoff.md` and block briefs mean agents never start from zero.
- **Extensions are opt-in.** The core workflow is simple. Advanced patterns are added only when the project needs them.

---

## Origin

Extracted from the Coachable project (a real production multi-agent codebase built with Claude Code + Codex CLI + Replit). The workflow ran through 11 development blocks covering ~46 tasks, with zero unintended production incidents during the agentic phase.
