# Setup Guide — New Project from agent-framework

Complete this checklist when initializing a new project from this template. Every `{{PLACEHOLDER}}` in the framework must be resolved before use.

---

## 1. Replace global placeholders

Run a global find-and-replace across all `.codex/**` files:

| Placeholder | Replace with | Example |
|---|---|---|
| `{{PROJECT_NAME}}` | Your project name | `MyApp` |
| `{{RUNTIME_PLATFORM}}` | Your runtime/deploy platform | `Replit`, `Vercel`, `Fly.io`, `local Docker` |
| `{{APP_CODE_PATHS}}` | Your source directories (comma-separated) | `src/, server/, client/` |
| `{{LINT_COMMAND}}` | Your lint/check command | `npm run check`, `make lint`, `ruff check` |
| `{{TEST_COMMAND}}` | Your test command | `npm test`, `pytest`, `go test ./...` |
| `{{WIKI_COMMAND}}` | Your wiki generation command (or leave blank) | `npm run wiki`, or delete this placeholder |
| `{{WIKI_PATH}}` | Path to generated codebase wiki (if applicable) | `.codex/knowledge/project/codebase-wiki.md` |
| `{{PLAYBOOK_ROOT}}` | Root folder of this framework | `.codex` (default — change only if you rename the folder) |

Quick replace with `sed` (macOS / Linux):
```sh
# Example — run once per placeholder
find .codex -type f -name "*.md" -exec sed -i '' 's/{{PROJECT_NAME}}/MyApp/g' {} \;
```

---

## 2. Configure infrastructure constraints

In `.codex/AGENTS.md` and `.codex/templates/codex-prelude.md`, replace `{{INFRA_HARD_RULES}}` with the specific forbidden operations for your infrastructure. Examples:

**Shared database (no destructive ops):**
```
- Never run DROP, TRUNCATE, or mass DELETE without explicit task authorization
- Never run database migration reset commands
- Never run seed scripts that wipe tables
```

**Shared secrets / production environment:**
```
- Never deploy to production without explicit User trigger
- Never modify production environment variables
```

**No infra constraints:**
```
Delete the {{INFRA_HARD_RULES}} line entirely.
```

Also replace `{{INFRA_SENSITIVE_PATHS}}` in `.codex/settings/file_scopes.md` with any sensitive directories (e.g. `prisma/migrations/`, `.github/workflows/`, `terraform/`). Delete the line if not applicable.

---

## 3. Configure project constraints in task template

In `.codex/templates/task-template.md`, replace `{{PROJECT_CONSTRAINTS}}` with a bullet list of constraints the Executor must always respect. This gets copy-pasted into each task file's "Constraints" section as relevant.

Example:
```
- Do not add npm dependencies without explicit task authorization
- Do not modify the database schema without an accompanying migration file
- All new API endpoints must be authenticated
```

---

## 4. Set up /docs structure

Create your project documentation in `/docs/`. Recommended files:

| File | Content |
|---|---|
| `docs/prd.md` | Product requirements — what the product does and doesn't do |
| `docs/tech-spec.md` | Architecture, data model, API contracts |
| `docs/roadmap.md` | Block sequencing, scope per block |
| `docs/dev-handbook.md` | Invariants, naming conventions, "DO NOT BREAK" rules |
| `docs/design.md` | UX/UI contract (if applicable) |

These are the **sources of truth** Claude uses to write tasks. The better they are, the better the tasks.

---

## 5. Initialize knowledge files

Copy the session handoff template:
```sh
cp .codex/templates/session-handoff-template.md .codex/knowledge/project/session-handoff.md
```

Then fill in the initial state (Block 1, no tasks yet, fresh dev branch).

---

## 6. Initialize git

```sh
git init
git add .
git commit -m "chore: initialize project from agent-framework template"
git branch dev
git checkout dev
```

Create your first block branch:
```sh
git checkout -b block/BLOCK-1-[your-first-block-slug]
```

---

## 7. Set up Playwright E2E testing (recommended)

Playwright is the recommended testing approach for any project with a browser UI. Set it up at BLOCK-1, before the first task — Codex will write and run tests automatically from then on.

### Install

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

### Configure

```bash
mkdir tests
cp .codex/extensions/playwright/playwright.config.template.ts tests/playwright.config.ts
```

Edit `tests/playwright.config.ts` and fill in:
- `{{APP_BASE_URL}}` — e.g. `http://localhost:3000`
- `{{APP_PORT}}` — e.g. `3000`
- `{{DEV_SERVER_COMMAND}}` — e.g. `npm run dev`

### Set the test command in codex-prelude

In `.codex/templates/codex-prelude.md`, set:
```
{{TEST_COMMAND}}: cd tests && npx playwright test --config=playwright.config.ts 2>&1
```

### Activate in AGENTS.md

In the extensions table in `.codex/AGENTS.md`, mark Playwright as active:
```
| `playwright/` | Codex writes + runs E2E tests per task | ✅ ACTIVE |
```

From this point, every task that has a `## Test scenarios` section will produce a `.spec.ts` file written by Codex, run automatically, and reported separately in the execution log.

---

## 8. Choose additional extensions (optional)

Review `.codex/extensions/README.md` to decide which advanced agentic patterns to activate.

| Extension | Activate if... |
|---|---|
| `playwright/` | Project has a browser UI — **recommended for all web/mobile-web projects** |
| `parallel-agents/` | You have tasks with no inter-dependencies that you want to run simultaneously |
| `routing/` | Your project has clearly separate domains (DB, UI, API) with different agents |
| `self-eval-loop/` | You have tasks with fully objective, measurable acceptance criteria |

To activate an extension, add the relevant policy section to `.codex/AGENTS.md` (instructions in each extension's `README.md`).

---

## 9. Verify the setup

Before starting your first task, verify:

- [ ] All `{{PLACEHOLDER}}` strings are replaced (run: `grep -r "{{" .codex/`)
- [ ] `/docs/` has at least a `prd.md` and `tech-spec.md`
- [ ] `session-handoff.md` reflects the initial project state
- [ ] Git is initialized with `main`, `dev`, and `block/BLOCK-1-*` branches
- [ ] `.env.example` exists and lists all required variables

If `grep -r "{{" .codex/` returns results, you have unreplaced placeholders. Fix them before starting.

---

## Quick reference: placeholder locations

```
.codex/AGENTS.md               → PROJECT_NAME, RUNTIME_PLATFORM, APP_CODE_PATHS, LINT_COMMAND, TEST_COMMAND, INFRA_HARD_RULES
.codex/WORKFLOW.md             → PROJECT_NAME, LINT_COMMAND, WIKI_COMMAND
.codex/templates/codex-prelude.md → PLAYBOOK_ROOT, LINT_COMMAND, TEST_COMMAND, WIKI_COMMAND, WIKI_PATH, APP_CODE_PATHS, INFRA_HARD_RULES
.codex/templates/task-template.md → PROJECT_CONSTRAINTS
.codex/templates/inline-task-template.md → LINT_COMMAND
.codex/templates/session-handoff-template.md → PROJECT_NAME
.codex/settings/approval_rules.md → APP_CODE_PATHS, LINT_COMMAND, TEST_COMMAND, WIKI_COMMAND, INFRA_SENSITIVE_PATHS, INFRA_HARD_RULES
.codex/settings/file_scopes.md → APP_CODE_PATHS, PLAYBOOK_ROOT, INFRA_SENSITIVE_PATHS
```
