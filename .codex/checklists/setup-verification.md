# Setup Verification Checklist

Run this before starting BLOCK-1. A failed item means the framework will not work correctly.

---

## 1. Placeholders replaced

```bash
# Should return no output — if it does, fix the listed files before continuing
grep -r "{{" .codex/ --include="*.md" | grep -v "templates/" | grep -v "codex-prelude.md"
```

- [ ] Command above returns no output (all placeholders replaced in active files)
- [ ] `{{PROJECT_NAME}}` replaced in `AGENTS.md`, `WORKFLOW.md`, `CLAUDE.md`
- [ ] `{{LINT_COMMAND}}` and `{{TEST_COMMAND}}` replaced in `codex-prelude.md`
- [ ] `{{APP_CODE_PATHS}}` replaced in `AGENTS.md` and `settings/file_scopes.md`
- [ ] `{{CODEX_EXEC_COMMAND}}` replaced in `AGENTS.md` and `WORKFLOW.md`
- [ ] `{{RUNTIME_PLATFORM}}` replaced in `AGENTS.md`

---

## 2. Docs exist and are non-empty

- [ ] `docs/prd.md` exists and has Vision + Non-goals + at least 1 user flow filled in
- [ ] `docs/tech-spec.md` exists and has tech stack + data model filled in
- [ ] `docs/roadmap.md` exists and has BLOCK-1 goal + rough task list
- [ ] `docs/dev-handbook.md` exists and has at least naming conventions + 3 DO NOT BREAK invariants

---

## 3. Knowledge files initialized

- [ ] `.codex/knowledge/project/session-handoff.md` exists and reflects initial state (no tasks yet)
- [ ] `.codex/knowledge/BLOCK-1-[slug]-brief.md` exists and has block goal + task list

---

## 4. Git state correct

```bash
git branch    # should show main and dev at minimum
git status    # should be clean
```

- [ ] `main` branch exists
- [ ] `dev` branch exists (created from main)
- [ ] Working tree is clean (no uncommitted changes)
- [ ] First block branch `block/BLOCK-1-*` ready to create (or already created)

---

## 5. Quality dimensions activated

- [ ] Opened `.codex/templates/codex-prelude.md` § Quality dimensions
- [ ] **Security baseline** uncommented (recommended for all projects)
- [ ] **Error handling** uncommented (recommended for all projects)
- [ ] Accessibility uncommented (if project has public-facing UI)
- [ ] API conventions uncommented (if project has a REST API)
- [ ] Corresponding rules are filled in `docs/dev-handbook.md`

---

## 6. Tooling works

```bash
# Replace with your actual lint command
{{LINT_COMMAND}}   # should exit 0 even on empty project
```

- [ ] Lint command runs without error on the empty project
- [ ] If Playwright is configured: `npx playwright test --list` shows no errors (0 tests is ok)

---

## 7. Ready to start

- [ ] `.env.example` exists and lists all required variable names (no values)
- [ ] `CLAUDE.md` is readable and points to the correct docs
- [ ] You have read `docs/README.md` and understand how Claude uses each doc

**If all items above are checked: you are ready to start BLOCK-1.**

If any item fails: fix it before starting — a misconfigured framework produces wrong tasks and wrong code.
