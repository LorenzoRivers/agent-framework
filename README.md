# agent-framework

A battle-tested multi-agent workflow framework for software product development. Extracted from a real production project and generalized for reuse.

**Core idea:** Claude Code plans and reviews. A code-execution agent (Codex CLI or similar) implements. A runtime (Replit, Vercel, etc.) runs the result. The User decides. Each actor has a strict role, a permissions boundary, and a structured contract.

**→ [QUICKSTART.md](QUICKSTART.md) — first task in 30 minutes**
**→ [SETUP.md](SETUP.md) — full configuration reference**

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

### Core workflow

| Pattern | Where |
|---|---|
| **Orchestrator → Subagent** | Claude writes TASK specs; invokes Codex CLI via bash; Executor implements |
| **Plan → Verify → Execute** | Gate 1 (task approval) + Phase 0.5 (state verification) before any code |
| **Requirements disambiguation** | Paraphrase + typed checklist + test scenarios preview before every TASK |
| **Ask with proposal** | Every clarification question comes with a recommended answer citing project source |
| **Reflection / Review loop** | Gate 2: scope check + quality check + Executor self-validates (T1/T2) or Claude reviews (T2-large/T3) |
| **Scope enforcement** | `Files in scope → Create` list gates every new file/class/module; violations flagged in execution log |
| **Quality dimensions** | 6 opt-in dimensions (security, error handling, accessibility, logging, naming, API conventions) applied per task |
| **Memory / Knowledge persistence** | `session-handoff.md`, block briefs, `lessons-learned.md`, `codebase-wiki.md` |
| **Event-driven self-improvement** | Lessons captured immediately on FINE_TUNING / fix attempts / RED_FLAG — not deferred to block end |
| **Framework-worthy filter** | At Gate 3: one question per block — "does any lesson apply to any project?" Propagates to framework on explicit approval |

### Optional extensions

| Extension | Pattern | When |
|---|---|---|
| **`playwright/`** | Codex writes + runs E2E browser tests per task | Any project with browser UI |
| **`parallel-agents/`** | Fan-out independent tasks, fan-in reviews | Tasks with no inter-dependencies |
| **`routing/`** | Domain-based agent routing (DB, UI, API) | Projects with clearly separated domains |
| **`self-eval-loop/`** | Executor self-retries against objective criteria | Tasks with fully measurable acceptance criteria |

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

Extracted from the **Coachable** project — a real production SaaS built entirely with a multi-agent workflow (Claude Code + Codex CLI + Replit). The project shipped 12 development blocks covering ~47 tasks, from auth and data model through AI features, security hardening, and production deployment, with zero unintended production incidents during the agentic phase.

The framework was then systematically improved through 5 refinement blocks based on a gap analysis against the goal of "building any web/mobile app via agents, without reading code, without copy-pasting between agents, with the highest possible code quality":

| Refinement block | What was added |
|---|---|
| **A — Project kickoff** | `docs/templates/` (PRD, tech-spec, roadmap, dev-handbook), block brief template |
| **B — Code quality** | 6 opt-in quality dimensions (security, accessibility, error handling, logging, naming, API) |
| **C — Decision protocol** | "Ask with proposal" pattern — no open questions, every clarification comes with a recommended answer cited from project sources |
| **D — Requirements gathering** | Paraphrase confirmation, disambiguation checklists by request type, test scenarios preview, assumptions log in TASK |
| **E — Onboarding polish** | QUICKSTART.md (30-min path), quality dimension activation guide, failure-paths reference, setup verification checklist |

The framework is continuously updated as new patterns emerge from real project use.
