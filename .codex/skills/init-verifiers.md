# init-verifiers — Autonomous Verification Setup

**Trigger:** User says "init verifiers", "setup verifiers", "crea verifier", "aggiungi verifier di verifica", or similar.

**What this skill does:** detects the project type and stack, sets up the appropriate verification tool (Playwright, HTTP, CLI), and writes a ready-to-use verifier skill in `.claude/skills/`. No manual configuration required.

**Why verifiers:** verifiers are skills run by a dedicated Verify agent after each task. They test the running app functionally — not unit tests, not typechecking, but actual browser UI flows, API calls, or CLI output. They complement `{{TEST_COMMAND}}` (which runs unit/integration tests) with end-to-end behavioral verification.

---

## Phase 1 — Auto-detect project type

Scan the project to identify distinct areas that need verification:

1. **Read manifest files** — `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `pom.xml` in root and subdirectories
2. **Identify application type per area:**
   - Web app (React, Next.js, Vue, SvelteKit, etc.) → Playwright verifier
   - API service (Express, FastAPI, Django, Gin, etc.) → HTTP verifier
   - CLI tool → Tmux verifier
3. **Check existing browser automation tools:**
   - Playwright installed? (`package.json` devDependencies, `pytest-playwright` for Python)
   - MCP config (`.mcp.json`) — Playwright MCP server, Chrome DevTools MCP, Claude Chrome Extension
4. **Detect dev server config** — start command, URL, ready signal text
5. **Check if multiple areas exist** (e.g. monorepo with `frontend/` and `backend/`) — will need one verifier per area

---

## Phase 2 — Set up verification tool

**For web apps:**

If no browser automation tool is detected, ask the User which to install:
- **Playwright** (recommended) — headless, works in CI, no browser required
- **Chrome DevTools MCP** — uses Chrome via MCP server
- **Claude Chrome Extension** — uses the browser extension
- **None** — skip browser automation, use HTTP checks only

If user chooses Playwright, install it:
```bash
# npm
npm install -D @playwright/test && npx playwright install chromium

# yarn
yarn add -D @playwright/test && yarn playwright install chromium

# pnpm
pnpm add -D @playwright/test && pnpm exec playwright install chromium
```

If user chooses an MCP-based option, add the appropriate entry to `.mcp.json`.

**For API services:** `curl` is sufficient — no installation needed.

**For CLI tools:** verify `tmux` is available (`which tmux`).

---

## Phase 3 — Ask project-specific questions

For each project area, ask:

**Web app:**
- Dev server command (e.g. `npm run dev`)
- Dev server URL (e.g. `http://localhost:3000`)
- Ready signal — text that appears in stdout when the server is ready (e.g. `ready on`, `listening on port`)
- Does the app require login to verify? If yes: login URL, test credentials (suggest env vars like `TEST_USER`, `TEST_PASSWORD`), post-login indicator (URL redirect, element text)

**API service:**
- Server start command
- Base URL (e.g. `http://localhost:8000`)
- Auth method (none / API key / Bearer token)

**CLI tool:**
- Entry point command (e.g. `./bin/cli`, `python -m myapp`)

**Verifier name** — suggest based on type and area, allow override:
- Single area: `verifier-playwright`, `verifier-api`, `verifier-cli`
- Multiple areas: `verifier-frontend-playwright`, `verifier-backend-api`
- Rule: name must contain "verifier" — the Verify agent discovers skills by this pattern

---

## Phase 4 — Write the verifier skill

Create `.claude/skills/<verifier-name>/SKILL.md` with this structure:

```markdown
---
name: <verifier-name>
description: Functionally verify [project area] by [method]
allowed-tools:
  # Web (Playwright): Bash(npm *), Bash(npx playwright *), mcp__playwright__*, Read, Glob, Grep
  # API: Bash(curl *), Bash(http *), Bash(npm *), Read, Glob, Grep
  # CLI: Tmux, Bash(asciinema *), Read, Glob, Grep
---

# <Verifier Title>

You are a verification executor. You receive a verification plan and execute it EXACTLY as written.

## Project context

- Stack: [detected stack]
- Dev server command: [command]
- Dev server URL: [url]
- Ready signal: [text to wait for in stdout]

## Authentication
[If required:]
1. Navigate to [login URL]
2. Fill [username field] with $TEST_USER, [password field] with $TEST_PASSWORD
3. Submit and verify redirect to [post-login URL] or presence of [element]
[If not required: omit this section]

## Reporting

For each step in the verification plan, report:
- ✅ PASS — [step description]
- ❌ FAIL — [step description]: [what was expected] vs [what was found]

## Cleanup

After verification:
1. Stop any dev servers started during this session
2. Close any browser sessions
3. Report final summary: N passed, M failed

## Self-update

If verification fails because these instructions are outdated (changed dev server command, new port, changed ready signal) — not because the feature is broken — confirm with the User and edit this SKILL.md with a minimal targeted fix.
```

---

## Phase 5 — Confirm and report

After writing the skill file(s):

```
✅ Verifier created: .claude/skills/<verifier-name>/SKILL.md

Type: [Playwright / HTTP / CLI]
Discovered by: Verify agent (folder name contains "verifier")

To run: ask Claude "verify [feature name]" or "run verifier"
To customize: edit .claude/skills/<verifier-name>/SKILL.md directly

Run /init-verifiers again to add verifiers for other areas.
```
