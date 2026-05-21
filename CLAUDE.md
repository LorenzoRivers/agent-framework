# {{PROJECT_NAME}} — Claude Code context

Full contract: `.codex/AGENTS.md` — read before acting.
Current state: `.codex/knowledge/project/session-handoff.md`
Sources of truth (priority): `docs/dev-handbook.md` → `docs/roadmap.md` → `docs/tech-spec.md` → `docs/design.md` → `docs/prd.md`

## Skills

| Trigger | File | What it does |
|---|---|---|
| "init project" / "inizializza il progetto" / "setup this project" | `.codex/skills/init-project.md` | Autonomous project setup — replaces placeholders, creates CLAUDE.md, initializes docs and git |
| "init verifiers" / "setup verifiers" / "crea verifier" | `.codex/skills/init-verifiers.md` | Detects project type and creates functional verifier skills (Playwright / HTTP / CLI) |
| "commit push pr" / "crea la pr" / "fai il commit e apri la PR" / "ship it" | `.codex/skills/commit-push-pr.md` | Stage + commit + push + open/update GitHub PR in one operation |
