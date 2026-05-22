# init-project — Autonomous Project Setup

**Trigger:** User says "init project", "setup this project", "inizializza il progetto", or similar.

**What this skill does:** sets up a new project cloned from agent-framework in a single session — reads GitHub repo context, replaces all placeholders, creates CLAUDE.md, initializes docs, configures git branches.

**Execution contract:** once the User confirms at the end of Phase 1, Claude executes Phases 2–9 **sequentially and without stopping**. No mid-execution questions. No pausing between phases. Every phase runs to completion before the next begins. The only pause point is the confirmation at the end of Phase 1.

---

## Guard — verify correct repo before starting

Before anything else, run:

```bash
basename $(git rev-parse --show-toplevel) 2>/dev/null
head -3 README.md 2>/dev/null
```

If the repo name is `agent-framework` OR if README.md contains "A battle-tested multi-agent workflow framework" → **stop immediately**:

```
❌ Stai eseguendo init-project sul repo agent-framework stesso.

agent-framework è il template — non va inizializzato su se stesso.

Cosa fare:
1. Vai su github.com/LorenzoRivers/agent-framework
2. Clicca "Use this template" → "Create a new repository"
3. Clona il nuovo repo in locale
4. Aprilo in VS Code e riesegui "init project"
```

Do not proceed past this point if the guard triggers.

---

## Phase 0 — Read GitHub repo context (automatic, no questions)

Run before asking anything:

```bash
gh repo view --json name,description,url 2>/dev/null
```

Extract:
- `name` → pre-fill as **Project name** (User can override)
- `description` → pre-fill as **"What it is"** in the doc (User can override)
- `url` → store for reference

If `gh` is not authenticated or the command fails: leave name and description blank — User will provide them manually in Phase 1.

---

## Phase 1 — Interview (single pass, then confirm)

Ask ALL questions in one message. Collect all answers before making any change.

**Pre-filled from Phase 0 (show to User, allow override):**
- Project name: `[name from gh]`
- What it is: `[description from gh]`

**Questions:**

1. **Doc mode:**
   - **A — Lightweight** (MVP, progetto personale): un solo `docs/project-brief.md`, 15 min. Consigliato.
   - **B — Full** (produzione, team): 4 doc separati. Più robusto.
   Record as `DOC_MODE = A | B`.

2. **Tech stack** — linguaggio + framework (e.g. `Node.js + Express + React`, `Python + FastAPI`, `Go`)

3. **App code paths** — cartelle con codice applicativo (e.g. `src/`, `server/, client/`)

4. **Lint command** — (e.g. `npm run lint`, `ruff check .`, `golangci-lint run`)

5. **Test command** — (e.g. `npm test`, `pytest`, `go test ./...`)

6. **Runtime / deploy platform** — (e.g. `Replit`, `Vercel`, `Fly.io`, `local`)

7. **Qual è la tua principale incertezza in Block 1?** — guida la scelta di cosa costruire prima:
   - **A — UX/design** → *frontend first*: non so ancora esattamente cosa vedrà l'utente. Block 1 = UI con dati mock; Block 2 = backend reale + wire-up. Usa quando l'interfaccia è complessa o unica, e le decisioni di UX guidano la forma del backend.
   - **B — Logica/dati** → *backend first*: so già come sarà la UI (pattern standard), non so come funzionerà la logica. Block 1 = API + data model; Block 2 = UI. Usa quando il data model o la business logic sono la parte difficile.
   - **C — Vertical slice** → *una feature completa alla volta*: Block 1 = schema + API + UI di una singola feature. Solo per app molto piccole (≤ 3 feature totali) dove puoi tenere tutto in testa.
   - **N/A** — progetto solo backend, solo frontend, o CLI: la domanda non si applica.
   Record as `START_FROM = frontend | backend | slice | na`.

8. **Block 1 goal** — una frase su cosa consegna Block 1 (suggerisci in base alla risposta precedente):
   - frontend (A) → e.g. `UI React con dati mock, navigazione e flussi principali`
   - backend (B) → e.g. `API REST CRUD con Express, schema dati e validazione`
   - slice (C) → e.g. `Feature X completa: schema + API + UI end-to-end`
   - n/a → e.g. `[descrivere il deliverable specifico]`

**Optional (blank = skip):**

9. **Wiki command** — se esiste un generatore di wiki (e.g. `npm run wiki`) — lascia vuoto altrimenti
10. **Infrastructure hard rules** — operazioni che Codex non deve mai fare (e.g. "no DROP senza autorizzazione") — lascia vuoto se nessuna
11. **Sensitive paths** — cartelle che richiedono autorizzazione speciale (e.g. `prisma/migrations/`) — lascia vuoto se nessuna

**Confirmation — show summary, wait for explicit ok:**

```
Pronto per inizializzare [PROJECT_NAME]:
  Doc mode:   A — Lightweight | B — Full
  Stack:      [stack]
  App paths:  [paths]
  Lint:       [lint command]
  Test:       [test command]
  Platform:   [platform]
  Start from: backend | frontend | fullstack | n/a
  Block 1:    [goal]
  [optional items if present]

Procedo? (dopo conferma eseguo tutte le fasi senza fermarmi)
```

**Wait for explicit confirmation. After confirmation: execute Phases 2–9 in sequence without any further pauses.**

---

## Phase 2 — Replace placeholders (execute immediately after confirmation)

Run all `sed` commands. Use single quotes to avoid zsh history expansion issues.

```bash
# Required replacements
find .codex -type f -name '*.md' -exec sed -i '' "s/{{PROJECT_NAME}}/PROJECT_NAME_VALUE/g" {} \;
find .codex -type f -name '*.md' -exec sed -i '' "s/{{RUNTIME_PLATFORM}}/PLATFORM_VALUE/g" {} \;
find .codex -type f -name '*.md' -exec sed -i '' 's|{{APP_CODE_PATHS}}|PATHS_VALUE|g' {} \;
find .codex -type f -name '*.md' -exec sed -i '' 's|{{LINT_COMMAND}}|LINT_VALUE|g' {} \;
find .codex -type f -name '*.md' -exec sed -i '' 's|{{TEST_COMMAND}}|TEST_VALUE|g' {} \;
find .codex -type f -name '*.md' -exec sed -i '' 's/{{PLAYBOOK_ROOT}}/.codex/g' {} \;
find .codex -type f -name '*.md' -exec sed -i '' 's/{{SELF_EVAL_MAX_RETRIES}}/2/g' {} \;

# Hardcode Codex exec command
find .codex -type f -name '*.md' -exec sed -i '' 's|{{CODEX_EXEC_COMMAND}}|~/bin/codex-ai exec|g' {} \;

# Remove setup meta-instruction (no longer needed once initialized)
find .codex -type f -name '*.md' -exec sed -i '' '/replace every.*PLACEHOLDER/d' {} \;

# Optional: remove unused placeholder lines
find .codex -type f -name '*.md' -exec sed -i '' '/{{WIKI_COMMAND}}/d' {} \;
find .codex -type f -name '*.md' -exec sed -i '' '/{{WIKI_PATH}}/d' {} \;
find .codex -type f -name '*.md' -exec sed -i '' '/{{INFRA_HARD_RULES}}/d' {} \;
find .codex -type f -name '*.md' -exec sed -i '' '/{{INFRA_SENSITIVE_PATHS}}/d' {} \;
find .codex -type f -name '*.md' -exec sed -i '' '/{{LINT_TEST_DIR}}/d' {} \;
find .codex -type f -name '*.md' -exec sed -i '' '/{{UNIT_TEST_COMMAND}}/d' {} \;
find .codex -type f -name '*.md' -exec sed -i '' '/{{PROJECT_CONSTRAINTS}}/d' {} \;
```

Replace `PROJECT_NAME_VALUE`, `PLATFORM_VALUE`, `PATHS_VALUE`, `LINT_VALUE`, `TEST_VALUE` with the actual values from Phase 1.

Verify:
```bash
grep -r '{{' .codex/ --include='*.md' | grep -v '<\!--' | grep -v 'templates/' | grep -v 'skills/init-project' | grep -v 'extensions/'
```

Expected: empty output. If any remain, fix before continuing.

---

## Phase 3 — Create CLAUDE.md (execute immediately, no pause)

Overwrite `CLAUDE.md` in the project root. Use the GitHub repo name and description from Phase 0:

```markdown
# [PROJECT_NAME] — Claude Code context

Navigation index: `.codex/INDEX.md` — read this first to find the right file fast.
Full contract: `.codex/AGENTS.md` — read before acting.
Current state: `.codex/knowledge/project/session-handoff.md`
Sources of truth (priority): `docs/dev-handbook.md` → `docs/roadmap.md` → `docs/tech-spec.md` → `docs/prd.md`

## Project
[Description from GitHub repo — 1-2 sentences from Phase 0 gh output]
Stack: [stack from Phase 1]
Platform: [platform from Phase 1]
Docs: [docs/project-brief.md | docs/prd.md depending on doc mode]

## Hard rules
- Never write code in [APP_CODE_PATHS] unless User explicitly asks
- Never write code blocks inside TASK files
- Never commit to `main` or `dev` directly
- Never touch `.env*` files

## Skills

| Trigger | File |
|---|---|
| "init project" / "inizializza il progetto" | `.codex/skills/init-project.md` |
| "init verifiers" / "crea verifier" | `.codex/skills/init-verifiers.md` |
| "commit push pr" / "crea la pr" / "ship it" | `.codex/skills/commit-push-pr.md` |
```

---

## Phase 4 — Initialize docs (execute immediately, no pause)

### Mode A — Lightweight

Create `docs/project-brief.md`:

```markdown
# [PROJECT_NAME] — Project Brief

## What it is
[Description from GitHub repo (Phase 0) — or what User provided in Phase 1]

## What it is NOT
[Leave blank — User fills in]

## Tech stack
[Stack from Phase 1]

## Start from
[backend | frontend | fullstack] — [rationale: e.g. "backend first: valida la logica prima della UI"]

## Data model (rough)
[Leave blank — User fills in]

## Block 1 goal
[Block 1 goal from Phase 1]
```

Tell User:
```
✅ docs/project-brief.md creato (Mode A)
Da completare prima di TASK-001:
  1. "What it is NOT" — 1-2 non-goal (5 min)
  2. "Data model" — entità principali e campi (10 min)
```

### Mode B — Full

```bash
cp docs/templates/prd-template.md       docs/prd.md
cp docs/templates/tech-spec-template.md docs/tech-spec.md
cp docs/templates/roadmap-template.md   docs/roadmap.md
cp docs/templates/dev-handbook-template.md docs/dev-handbook.md
```

Pre-fill in `docs/tech-spec.md`: tech stack section.
Pre-fill in `docs/roadmap.md`: BLOCK-1 name, goal, and note about `START_FROM`.

---

## Phase 5 — Initialize knowledge files (execute immediately, no pause)

```bash
cp .codex/templates/session-handoff-template.md .codex/knowledge/project/session-handoff.md
```

Fill in `session-handoff.md`:
- Active block: BLOCK-1 — [Block 1 goal]
- Block branch: `block/BLOCK-1-[slug]` (slug = 2-3 words from goal, kebab-case)
- Last merged task: none
- Next candidate task: TASK-001
- Pending items: complete docs before starting TASK-001

```bash
cp .codex/templates/block-brief-template.md ".codex/knowledge/BLOCK-1-[slug]-brief.md"
```

Fill in block brief: goal, `START_FROM` choice, status = PLANNING.

---

## Phase 6 — Initialize git (execute immediately, no pause)

Check current git state:
```bash
git status 2>/dev/null
git branch -a 2>/dev/null
```

If already on `main` with an initial commit (cloned from template):
```bash
git add .
git commit -m "chore: initialize [PROJECT_NAME] — agent-framework setup complete"
```

Create branch structure. Use the Block 1 slug from Phase 5:
```bash
git checkout -b dev
git push -u origin dev
git checkout -b block/BLOCK-1-[slug]
git push -u origin block/BLOCK-1-[slug]
```

Stay on `block/BLOCK-1-[slug]` after creation.

---

## Phase 7 — Optional extensions (execute immediately, no pause)

Ask in a single message (this is the only question after confirmation):

```
Vuoi attivare estensioni opzionali? (puoi saltare e aggiungerle dopo)
□ Playwright — Codex scrive ed esegue test E2E per ogni task (consigliato per UI web)
□ Parallel agents — task indipendenti in parallelo
□ Self-eval loop — Codex si auto-corregge su criteri oggettivi
□ Nessuna per ora
```

For each activated extension, follow `.codex/extensions/[name]/README.md` activation instructions.

---

## Phase 8 — Final verification (execute immediately, no pause)

```bash
# Placeholders
grep -r '{{' .codex/ --include='*.md' | grep -v '<\!--' | grep -v 'templates/' | grep -v 'skills/init-project' | grep -v 'extensions/'

# Required files
for f in CLAUDE.md .codex/knowledge/project/session-handoff.md; do
  [ -f "$f" ] && echo "✅ $f" || echo "❌ MISSING: $f"
done

# Doc mode file
[ "$DOC_MODE" = "A" ] && DOC_CHECK="docs/project-brief.md" || DOC_CHECK="docs/prd.md"
[ -f "$DOC_CHECK" ] && echo "✅ $DOC_CHECK" || echo "❌ MISSING: $DOC_CHECK"

# Branches
git branch -a
```

If any check fails: fix it before Phase 9.

---

## Phase 9 — Handoff summary (final output)

```
✅ [PROJECT_NAME] inizializzato ([Lightweight | Full])

Completato:
  ✅ Placeholder sostituiti in .codex/
  ✅ CLAUDE.md scritto (da repo GitHub: [name] — [description])
  ✅ [docs/project-brief.md | doc templates] pronti
  ✅ session-handoff.md e block brief inizializzati
  ✅ Branch: main / dev / block/BLOCK-1-[slug]

Incertezza principale: [UX/design → frontend first | Logica/dati → backend first | Vertical slice | N/A]
  → Block 1 consegna: [goal]
  → Block 2 consegnerà: [completamento naturale — e.g. se frontend first: "backend reale + wire-up"; se backend first: "UI completa + integrazione"]

Prossimi passi:
  [Mode A] Compila "What it is NOT" e "Data model" in docs/project-brief.md (15 min)
  [Mode B] Compila docs/prd.md e docs/tech-spec.md (45-60 min)
  Poi torna — scrivo TASK-001.

Branch corrente: block/BLOCK-1-[slug]
```
