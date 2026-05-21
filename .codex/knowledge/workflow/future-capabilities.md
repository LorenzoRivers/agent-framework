# Future Capabilities

Skills and patterns identified as potentially useful but not yet integrated into the framework. Review periodically — add when a project genuinely needs them.

---

## Deferred — require Max plan or remote sessions

These require a Claude Max account or remote session infrastructure. Not portable to the base framework.

| Capability | What it does | Why deferred |
|---|---|---|
| `/ultraplan` | Cloud-based planning on claude.ai — drafts a plan you can edit and approve before execution | Requires Max account, web-based |
| `/ultrareview` | Cloud-based bug review of the current branch with cost estimate | Requires Max account, web-based |
| `/autofix-pr` | Spawns a remote Claude Code session that monitors and autofixes the current PR | Requires Max + remote sessions |

---

## Deferred — utility / analytics, low priority

Useful in isolation but not worth adding workflow overhead for. Use the native Claude Code commands directly.

| Capability | What it does | Why deferred |
|---|---|---|
| `/advisor` | Consults a stronger model at key moments during a task for guidance | Nice-to-have; overlap with Claude's existing reasoning |
| `/btw` | Asks a quick side question without interrupting the main conversation | Already handled naturally in chat |
| `/recap` | Generates a one-line session recap | Already covered by `session-handoff.md` |
| `/insights` | Generates a report analyzing Claude Code sessions | Analytics — useful personally, not part of workflow |
| `/stats` | Shows Claude Code usage statistics | Same |

---

## Deferred by design — /batch

`/batch` researches and plans a large-scale change, then executes it in parallel across 5–30 isolated worktree agents, each opening a PR.

**Why not added:** large-scale refactors across many files are often a symptom of code written poorly in the first place. Automating the refactor removes the signal. When the impulse to batch-refactor appears, the right question is: *why does this pattern exist in 40 files?* The answer usually points to a task that should have been done differently earlier.

If a batch refactor is genuinely mechanical and safe (e.g., a package rename forced by a breaking upstream change), it can be executed ad-hoc without a framework step. It doesn't need to be a default capability.

**Revisit if:** a project consistently produces the same mechanical refactor need across multiple blocks, suggesting a structural pattern worth automating.
