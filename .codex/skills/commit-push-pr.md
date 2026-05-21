# commit-push-pr — Commit, Push, and Open PR

**Trigger:** User says "commit push pr", "crea la pr", "fai il commit e apri la PR", "ship it", or similar at the end of a task or block.

**What this skill does:** in a single operation — stages changes, creates a meaningful commit, pushes the branch, and opens (or updates) a GitHub PR with a structured description. No manual git commands required.

**When to use:** after Gate 2 approval, when the task branch is ready to merge. Not a replacement for the merge step — the PR is the artifact for review and merge, consistent with the framework's gate flow.

---

## Pre-flight checks

Before doing anything:

1. Run `git status` — confirm there are changes to commit or push
2. Run `git branch --show-current` — confirm you are on a `task/*` or `block/*` branch, **never** on `main` or `dev`
3. Run `git diff HEAD` — read the full diff to understand what changed
4. Run `gh pr view --json number 2>/dev/null || true` — check if a PR already exists for this branch

If on `main` or `dev`: **stop immediately**, report the branch error to the User.

---

## Safety rules (non-negotiable)

- Never run `git push --force`
- Never run `git reset --hard` or other destructive commands
- Never skip hooks (`--no-verify`, `--no-gpg-sign`)
- Never commit files that likely contain secrets (`.env`, `credentials.json`, etc.)
- Never use `git rebase -i` or `git add -i` (interactive commands not supported)
- If the User requests `push --force` to `main` or `master`: warn and stop

---

## Execution (single message, all steps)

Run all steps in one message without waiting between them:

**Step 1 — Stage changes**
```bash
git add -A
# Exception: never stage .env*, credentials, or secret files — inspect git status first
```

**Step 2 — Commit**

Analyze the full diff (`git diff HEAD` and all commits since the base branch). Write a commit message that explains *why*, not just *what*:

```bash
git commit -m "$(cat <<'EOF'
[type]: [short description under 72 chars]

[Optional: 1-2 sentences on why this change was made, if not obvious]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

Commit types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`

**Step 3 — Push**
```bash
git push origin [current-branch]
# If branch doesn't exist on remote yet: git push -u origin [current-branch]
```

**Step 4 — Create or update PR**

If no PR exists yet:
```bash
gh pr create --title "[Short title under 70 chars]" --body "$(cat <<'EOF'
## Summary
- [bullet 1]
- [bullet 2]

## Test plan
- [ ] [what to verify manually]
- [ ] [regression check]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

If a PR already exists for this branch, update it:
```bash
gh pr edit [number] --title "[updated title]" --body "[updated body]"
```

---

## Output

Return the PR URL at the end so the User can open it directly.

```
✅ Done
Branch: [branch name]
PR: [URL]
```
