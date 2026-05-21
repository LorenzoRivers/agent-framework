# init-project — Autonomous Project Setup

**Trigger:** User says "init project", "setup this project", "inizializza il progetto", or similar.

**What this skill does:** sets up a new project cloned from agent-framework in a single session — replaces all placeholders, creates CLAUDE.md, initializes docs, configures git. No manual `sed` commands, no file copying by hand.

**Prerequisite:** the project was cloned or created from the agent-framework template and has not yet been configured (placeholders still present).

---

## Phase 1 — Gather project information

Ask the User these questions (use AskUserQuestion where possible, otherwise ask in chat). Collect all answers before proceeding — do not start making changes mid-interview.

**Required:**

1. **Project name** — the canonical name used in docs and commit messages (e.g. `MyApp`)
2. **Tech stack** — primary language and framework (e.g. `Node.js + Express + Prisma`, `Python + FastAPI`, `Go`)
3. **App code paths** — directories that contain application code, comma-separated (e.g. `src/, server/, client/`)
4. **Lint command** — command to run linting/type-checking (e.g. `npm run check`, `ruff check . && mypy .`, `golangci-lint run`)
5. **Test command** — command to run tests (e.g. `npm test`, `pytest`, `go test ./...`)
6. **Runtime / deploy platform** — where the app runs (e.g. `Vercel`, `Fly.io`, `Railway`, `local Docker`, `Replit`)

**Optional (ask, accept "none" or blank):**

7. **Wiki command** — command to auto-generate a codebase wiki, if any (e.g. `npm run wiki`) — leave blank if not applicable
8. **Infrastructure hard rules** — any operations the Executor must never run (e.g. "never run DROP or TRUNCATE", "never deploy to production without explicit trigger") — leave blank if no constraints
9. **Sensitive paths** — directories that require special authorization (e.g. `prisma/migrations/, .github/workflows/`) — leave blank if not applicable
10. **Block 1 goal** — one sentence: what will Block 1 deliver? (e.g. "Auth system with login and signup")

After collecting all answers, confirm with the User in a single summary before making any changes:

```
Ready to initialize [PROJECT_NAME]:
- Stack: [stack]
- App paths: [paths]
- Lint: [lint command]
- Test: [test command]
- Platform: [platform]
- Block 1: [goal]
[Any optional items]

Proceed?
```

Wait for explicit confirmation before Phase 2.

---

## Phase 2 — Replace placeholders

Run find-and-replace across all `.codex/**` files for each placeholder. Use the `sed` command via Bash:

```bash
find .codex -type f -name "*.md" -exec sed -i '' 's/{{PROJECT_NAME}}/ACTUAL_VALUE/g' {} \;
```

Replace in this order:

| Placeholder | Value from Phase 1 |
|---|---|
| `{{PROJECT_NAME}}` | Project name |
| `{{RUNTIME_PLATFORM}}` | Runtime / deploy platform |
| `{{APP_CODE_PATHS}}` | App code paths |
| `{{LINT_COMMAND}}` | Lint command |
| `{{TEST_COMMAND}}` | Test command |
| `{{WIKI_COMMAND}}` | Wiki command (or remove the placeholder line if blank) |
| `{{WIKI_PATH}}` | `.codex/knowledge/project/codebase-wiki.md` (default) or remove if no wiki |
| `{{PLAYBOOK_ROOT}}` | `.codex` |
| `{{INFRA_HARD_RULES}}` | Infrastructure hard rules (or remove the placeholder line if blank) |
| `{{INFRA_SENSITIVE_PATHS}}` | Sensitive paths (or remove the placeholder line if blank) |
| `{{PROJECT_CONSTRAINTS}}` | Derived from infra hard rules + "no unauthorized dependencies" |
| `{{SELF_EVAL_MAX_RETRIES}}` | `2` (default) |

After all replacements, verify no placeholders remain:

```bash
grep -r "{{" .codex/
```

If any remain: fix them before continuing. Report any that cannot be auto-resolved.

---

## Phase 3 — Create CLAUDE.md

Create `CLAUDE.md` in the project root with this structure:

```markdown
# [PROJECT_NAME] — Claude Code context

## Role
Claude Code is Planner and Reviewer only. Full contract: `.codex/AGENTS.md`.

## Session start
Read `.codex/knowledge/project/session-handoff.md` before accepting any task.

## Sources of truth (priority order)
1. `docs/dev-handbook.md` — invariants, naming, DO NOT BREAK rules
2. `docs/roadmap.md` — block sequencing, scope per block
3. `docs/tech-spec.md` — architecture, data model, API
4. `docs/design.md` — UX/UI contract (if applicable)
5. `docs/prd.md` — product scope, non-goals
6. `.codex/knowledge/**` — live project state

## Hard rules
- Never write code in `[APP_CODE_PATHS]` unless User explicitly asks
- Never write code blocks inside TASK files
- Never commit to `main` or `dev` directly
- Never run: [INFRA_HARD_RULES — or "none specified"]
- Never touch `.env*` files
```

---

## Phase 4 — Initialize docs

Copy the doc templates:

```bash
cp docs/templates/prd-template.md      docs/prd.md
cp docs/templates/tech-spec-template.md docs/tech-spec.md
cp docs/templates/roadmap-template.md  docs/roadmap.md
cp docs/templates/dev-handbook-template.md docs/dev-handbook.md
```

Then open each file and fill in the top section with what is already known from Phase 1:

- `docs/tech-spec.md` → fill in the tech stack section with the stack from Phase 1
- `docs/roadmap.md` → fill in BLOCK-1 name and goal from Phase 1 (question 10)
- `docs/prd.md` → leave mostly blank — the User fills this in
- `docs/dev-handbook.md` → leave mostly blank — the User fills this in

Report to the User which sections need their input, with a priority order:
```
Minimum to start BLOCK-1 (fill these first):
1. docs/prd.md — product vision and non-goals (15-30 min)
2. docs/tech-spec.md — data model and API contracts (partially pre-filled)
3. docs/roadmap.md — BLOCK-1 task list (partially pre-filled)
Optional before BLOCK-2:
4. docs/dev-handbook.md — invariants and naming conventions
```

---

## Phase 5 — Initialize knowledge files

```bash
cp .codex/templates/session-handoff-template.md .codex/knowledge/project/session-handoff.md
```

Fill in `session-handoff.md` with the initial state:
- Active block: BLOCK-1 — [block 1 goal from Phase 1]
- Block branch: `block/BLOCK-1-setup` (to be created in Phase 6)
- Last merged task: none
- Next candidate task: TASK-001 (to be defined after docs are filled)
- Pending items: fill docs before starting TASK-001

Create the first block brief:

```bash
cp .codex/templates/block-brief-template.md ".codex/knowledge/BLOCK-1-setup-brief.md"
```

Fill in the block brief with:
- Block goal from Phase 1
- Status: PLANNING
- Note: "Task list to be defined after docs/prd.md and docs/tech-spec.md are filled in"

---

## Phase 6 — Initialize git

Check if git is already initialized:

```bash
git status 2>/dev/null
```

If not initialized:
```bash
git init
git add .
git commit -m "chore: initialize [PROJECT_NAME] from agent-framework template"
git branch -M main
```

If already initialized (e.g. cloned from template): check current state, commit any changes from Phases 2-5:
```bash
git add .
git commit -m "chore: initialize [PROJECT_NAME] — apply agent-framework setup"
```

Create the branch structure:
```bash
git checkout -b dev
git checkout -b block/BLOCK-1-setup
git checkout dev
git checkout block/BLOCK-1-setup
```

Report the final branch state:
```
Branches created:
  main      ← production (merge from dev only on explicit User request)
  dev       ← stable integration
  block/BLOCK-1-setup  ← current working branch ← YOU ARE HERE
```

---

## Phase 7 — Optional extensions

Ask the User (single question, multi-select):

```
Which optional extensions do you want to activate?
□ Playwright E2E tests — Codex writes and runs browser tests per task (recommended for web UI)
□ Parallel agents — run independent tasks simultaneously
□ Domain routing — specialized agents per domain (DB, UI, API)
□ Self-eval loop — Codex self-retries against objective criteria
□ None for now
```

For each selected extension, follow the activation instructions in `.codex/extensions/[name]/README.md`.

---

## Phase 8 — Final verification

Run the setup verification checklist:

```bash
# 1. No placeholders remaining
grep -r "{{" .codex/ && echo "PLACEHOLDERS FOUND" || echo "✅ No placeholders"

# 2. Required files exist
for f in CLAUDE.md docs/prd.md docs/tech-spec.md docs/roadmap.md .codex/knowledge/project/session-handoff.md; do
  [ -f "$f" ] && echo "✅ $f" || echo "❌ MISSING: $f"
done

# 3. Git branches
git branch -a
```

---

## Phase 9 — Handoff summary

Report to the User:

```
✅ [PROJECT_NAME] initialized

Setup complete:
  ✅ Placeholders replaced in .codex/
  ✅ CLAUDE.md created
  ✅ Doc templates copied to docs/
  ✅ session-handoff.md initialized
  ✅ Git: main / dev / block/BLOCK-1-setup branches created

Next steps (in order):
  1. Fill docs/prd.md — product vision, non-goals, 2-3 key flows
  2. Fill docs/tech-spec.md — data model and API contracts
  3. Fill docs/roadmap.md — BLOCK-1 task list
  Come back when done — I'll write TASK-001.

Current branch: block/BLOCK-1-setup
```
