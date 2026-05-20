# Failure Paths

*Reference for when things go wrong. The main workflow documents the happy path — this file covers the recoveries.*

---

## Codex / Executor failures

### Codex goes RED_FLAG

**What happened:** Codex stopped without touching any file because the task is ambiguous, references a non-existent file, or has conflicting constraints.

**What to do:**
1. Read the RED_FLAG explanation carefully
2. Identify the specific blocker (missing prerequisite? conflicting constraints? ambiguous scope?)
3. Fix the TASK file — clarify the ambiguity, add missing context, or split the task
4. Re-invoke Codex with the corrected TASK

**Do NOT:** ask Codex to "just try anyway" — RED_FLAG exists to prevent bad implementations.

---

### Gate 2 verdict: REWORK

**What happened:** Claude reviewed the diff and the implementation is wrong enough that fixing it would cost more than redoing it.

**What to do:**
1. Delete the task branch: `git push origin --delete task/TASK-NNN-slug && git branch -D task/TASK-NNN-slug`
2. Rewrite the TASK file with clearer requirements and more specific test scenarios
3. Re-run Steps 2-4 of the workflow from the start

**Do NOT:** try to patch a fundamentally wrong implementation — it creates compounding debt.

---

### Tests fail after 2 "Try to Fix" iterations

**What happened:** Claude attempted 2 targeted fixes, tests still fail.

**What to do:**
1. This becomes a User decision — Claude presents diagnosis + options
2. Options: (a) accept partial implementation + deferred fix task, (b) REWORK, (c) User debugs manually on Runtime and provides fix
3. Document the failure in `lessons-learned.md` — this is exactly the kind of event that produces useful lessons

---

## Git / merge failures

### Merge conflict

**What happened:** `git merge` reports conflicts between two branches.

**What to do:**
1. Open each conflicting file — read both versions before choosing
2. Never use `git checkout --theirs` blindly — understand which version is correct
3. For application code: accept the version from the task branch (newer, more specific)
4. For `.codex/knowledge/` files: merge manually — both versions likely have relevant content
5. After resolving: `git add <file>` + `git commit`

**Common conflict sites:**
- `session-handoff.md` — merge both update paragraphs, keep the newer state table
- `package-lock.json` — accept either version then run `npm install` to regenerate

---

### Build broken after merge to block branch

**What happened:** the merge was clean but CI/lint/tests fail on the block branch.

**What to do:**
1. Do NOT merge to `dev` until the build is green
2. Open a targeted fix: identify the breaking file from the error, write a T1 inline task
3. If complex: open a new `task/TASK-NNN-hotfix` branch from the block branch, fix, merge back

---

### `.codex` submodule diverged

**What happened:** `.codex` submodule is out of sync with the parent repo.

**What to do:**
```bash
cd .codex
git fetch origin
git checkout main
git pull origin main
cd ..
git add .codex
git commit -m "chore: update .codex submodule pointer"
git push origin <current-branch>
```

---

## Session / knowledge failures

### Session handoff is stale or missing

**What happened:** starting a new session and `session-handoff.md` doesn't reflect current state.

**What to do:**
1. Run `git log --oneline -10` to see recent activity
2. Check `git branch` for open task and block branches
3. Read the last few TASK files in `.codex/tasks/` for context
4. Reconstruct session-handoff before starting any new task — a wrong handoff produces wrong tasks

---

### Block brief is missing for the current block

**What happened:** WORKFLOW.md requires reading `BLOCK-N-brief.md` at session start but the file doesn't exist.

**What to do:**
1. Copy the template: `cp .codex/templates/block-brief-template.md .codex/knowledge/BLOCK-N-slug-brief.md`
2. Fill in: block goal, task status from existing TASK files, any interfaces introduced by merged tasks
3. Commit the brief before starting the next task

---

## Runtime failures

### Runtime (Replit/Vercel/etc.) is unavailable

**What happened:** Gate 3 manual testing is blocked because the runtime is down.

**What to do:**
1. Continue working on tasks for the current block locally — don't block the workflow
2. Defer Gate 3 until the runtime is restored
3. Note in `session-handoff.md`: "Gate 3 pending — runtime outage [date]"
4. Do NOT merge to `dev` without completing Gate 3

---

### Claude hits rate limit mid-session

**What happened:** Claude stops responding or returns errors mid-task.

**What to do:**
1. Update `session-handoff.md` with current state before closing the session
2. Note any pending actions: "was mid-review of TASK-NNN diff, Gate 2 not yet approved"
3. Restart session — Claude reads session-handoff and resumes from context
4. If mid-Codex invocation: check `/tmp/codex_out.md` for partial output before re-invoking

---

## Prevention

Most failures are preventable:
- **RED_FLAG**: write precise test scenarios and explicit file scopes in every TASK
- **REWORK**: use Phase B disambiguation and Phase C scenario preview (WORKFLOW.md Step 2)
- **Merge conflicts**: push task branches immediately after every commit — don't let branches drift
- **Stale session-handoff**: update it at the end of every session, not just when something breaks
