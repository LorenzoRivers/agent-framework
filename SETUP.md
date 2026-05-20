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

Copy the templates and fill them in — this is the most important setup step:

```sh
cp docs/templates/prd-template.md       docs/prd.md
cp docs/templates/tech-spec-template.md docs/tech-spec.md
cp docs/templates/roadmap-template.md   docs/roadmap.md
cp docs/templates/dev-handbook-template.md docs/dev-handbook.md
```

**Fill in this order:**
1. `docs/prd.md` — vision, non-goals, 2-3 key flows (30 min)
2. `docs/tech-spec.md` — tech stack + data model (45 min)
3. `docs/roadmap.md` — BLOCK-1 scope and rough task list (15 min)
4. `docs/dev-handbook.md` — 3-4 invariants + naming conventions (20 min)

**Minimum to start BLOCK-1:** `prd.md` (partial) + `tech-spec.md` (stack + data model) + `roadmap.md` (BLOCK-1 scope).

`docs/design.md` is optional — add it only if the project has significant UI work requiring precise behavior spec.

See `docs/README.md` for guidance on how Claude uses each document and what to write in each section.

---

## 5. Initialize knowledge files

Copy the session handoff template and the first block brief:
```sh
cp .codex/templates/session-handoff-template.md .codex/knowledge/project/session-handoff.md
cp .codex/templates/block-brief-template.md .codex/knowledge/BLOCK-1-[slug]-brief.md
```

Fill in `session-handoff.md` with the initial state (Block 1, no tasks yet, fresh dev branch).
Fill in `BLOCK-1-[slug]-brief.md` with the block goal and rough task list from your roadmap.

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

## 8. Activate quality dimensions

Open `.codex/templates/codex-prelude.md` and find the `## Quality dimensions` section. Each dimension is a commented block — uncomment the ones relevant to your project.

**Minimum for any web project — uncomment both:**
- `Security baseline` — no hardcoded secrets, no PII in logs, input validation, ownership checks
- `Error handling` — try/catch in handlers, generic error messages to client, finally for cleanup

**Add for public-facing UI:**
- `Accessibility baseline` — ARIA labels, alt text, keyboard nav, no color-only information

**Add for projects with a REST API:**
- `API conventions` — response format, correct HTTP status codes

**Add if naming consistency matters (recommended):**
- `Naming conventions` — references `docs/dev-handbook.md` naming rules

**Add if operational logs are important:**
- `Logging` — correct levels, feature prefix, no PII, no console.log in production

After uncommenting, verify `docs/dev-handbook.md` has the corresponding rules filled in — the dimensions reference it as the authoritative source.

---

## 9. Choose additional extensions (optional)

Review `.codex/extensions/README.md` to decide which advanced agentic patterns to activate.

| Extension | Activate if... |
|---|---|
| `playwright/` | Project has a browser UI — **recommended for all web/mobile-web projects** |
| `parallel-agents/` | You have tasks with no inter-dependencies that you want to run simultaneously |
| `routing/` | Your project has clearly separate domains (DB, UI, API) with different agents |
| `self-eval-loop/` | You have tasks with fully objective, measurable acceptance criteria |

To activate an extension, add the relevant policy section to `.codex/AGENTS.md` (instructions in each extension's `README.md`).

---

## 10. Verify the setup

Before starting your first task, verify:

- [ ] All `{{PLACEHOLDER}}` strings are replaced (run: `grep -r "{{" .codex/`)
- [ ] `/docs/` has at least a `prd.md` and `tech-spec.md`
- [ ] `session-handoff.md` reflects the initial project state
- [ ] Git is initialized with `main`, `dev`, and `block/BLOCK-1-*` branches
- [ ] `.env.example` exists and lists all required variables
- [ ] Quality dimensions activated in `codex-prelude.md` (at minimum: Security + Error handling)

If `grep -r "{{" .codex/` returns results, you have unreplaced placeholders. Fix them before starting.

For a more thorough verification: `.codex/checklists/setup-verification.md`.

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
