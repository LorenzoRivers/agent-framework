# Session Handoff — {{PROJECT_NAME}}

> Update this file at the end of every Claude session. It is the first file Claude reads at the start of the next session.

**Last updated:** YYYY-MM-DD
**Updated by:** Claude Code

---

## Current state

| Item | Value |
|---|---|
| Active block | BLOCK-N — [block name] |
| Block branch | `block/BLOCK-N-[slug]` |
| Dev branch | `dev` |
| Last merged task | TASK-NNN — [title] |
| Next candidate task | TASK-NNN — [title] |

---

## Branch state

| Branch | State | Notes |
|---|---|---|
| `block/BLOCK-N-[slug]` | ACTIVE | [tasks merged so far] |
| `task/TASK-NNN-[slug]` | OPEN / MERGED / DELETED | |
| `dev` | [N commits behind/ahead of block] | |

---

## Tasks completed this session

- TASK-NNN — [title]: [one-line outcome]
- TASK-NNN — [title]: [one-line outcome]

---

## Decisions made

| Decision | Outcome | Context |
|---|---|---|
| [Decision topic] | [What was decided] | [Why / tradeoff] |

---

## Pending items

- [ ] [Item 1 — what needs to happen, who owns it]
- [ ] [Item 2]

---

## Known issues / deferred

| ID | Description | Severity | Deferred to |
|---|---|---|---|
| BUG-N | [description] | high / medium / low | BLOCK-N or "backlog" |

---

## Next session setup

**Start with:** [what Claude should do first in the next session]
**Context needed:** [any specific docs or files to read before starting]
**Open decision for User:** [any question the User needs to answer before work can proceed]

---

## Environment notes

[Project-specific runtime notes — e.g. local dev port, test accounts, known env quirks. Update as needed.]
