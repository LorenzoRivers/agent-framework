# Quickstart — agent-framework

Get from zero to your first approved task in 30 minutes.

For full configuration: see `SETUP.md`.

---

## Prerequisites

- [Claude Code](https://claude.ai/code) desktop app or VS Code extension
- [Codex CLI](https://github.com/openai/codex) installed and authenticated
- Git

---

## 5 steps

### Step 1 — Use this template

Click "Use this template" on GitHub, or clone:

```bash
git clone https://github.com/LorenzoRivers/agent-framework my-project
cd my-project
git remote set-url origin https://github.com/YOUR_USERNAME/my-project
```

---

### Step 2 — Copy the two minimum docs

```bash
cp docs/templates/prd-template.md docs/prd.md
cp docs/templates/tech-spec-template.md docs/tech-spec.md
```

---

### Step 3 — Fill in the minimum

**`docs/prd.md` — 15 minutes, fill only:**
- Vision (1 sentence: what this product does and for whom)
- Non-goals (what this product will never do — 3-5 bullets)
- Key user flows (2-3 flows: step-by-step from user's perspective)

**`docs/tech-spec.md` — 15 minutes, fill only:**
- Tech stack table (frontend, backend, DB, auth, hosting)
- Data model (main entities with their fields and types)

Leave everything else for later. Partial docs are better than no docs.

---

### Step 4 — Initialize

```bash
# Replace placeholders in .codex files
# (or run: grep -r "{{" .codex/ to find them all)

# Copy knowledge templates
cp .codex/templates/session-handoff-template.md .codex/knowledge/project/session-handoff.md
cp .codex/templates/block-brief-template.md .codex/knowledge/BLOCK-1-foundation-brief.md

# Initialize git
git add .
git commit -m "chore: initialize project from agent-framework"
git checkout -b dev
git checkout -b block/BLOCK-1-foundation
```

---

### Step 5 — Start your first Claude session

Open Claude Code in your project directory. Claude reads `CLAUDE.md` automatically.

Tell Claude what you want to build. For example:

> "I want to start BLOCK-1. The goal is to have auth working — login with email/password, session managed via JWT cookie. Write TASK-001."

Claude will:
1. Paraphrase what it understood
2. Ask clarification questions with proposals (confirm or correct)
3. Propose test scenarios (confirm or adjust)
4. Write `TASK-001.md`

You approve the task (Gate 1), pass it to Codex, Codex implements.

---

## What you have after 30 minutes

- Project initialized with docs scaffolding
- First TASK written and ready for Gate 1 approval
- Codex ready to implement on `task/TASK-001-*` branch

---

## Next

- Full configuration: `SETUP.md`
- Activate quality dimensions: `.codex/templates/codex-prelude.md` § Quality dimensions
- Set up Playwright E2E tests: `.codex/extensions/playwright/README.md`
- Understand the full workflow: `.codex/WORKFLOW.md`
