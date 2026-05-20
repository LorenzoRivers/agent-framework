# BLOCK-N — [Block name] — Brief

> **Usage:** copy to `.codex/knowledge/BLOCK-N-[slug]-brief.md` at the start of each block.
> Claude reads this file at every session start to resume block context without re-reading all TASK files.
> Update after every task merge.

**Block:** BLOCK-N — [Block name]
**Branch:** `block/BLOCK-N-[slug]`
**Goal:** [One sentence: what capability exists after this block that didn't before]
**Started:** YYYY-MM-DD
**Target completion:** YYYY-MM-DD (or "open")

---

## Task status

| Task | Title | Status | Branch |
|---|---|---|---|
| TASK-NNN | [title] | PENDING / IN PROGRESS / COMPLETE / MERGED | `task/TASK-NNN-[slug]` |
| TASK-NNN | [title] | PENDING | — |

---

## Interfaces introduced this block

*Cumulative list of new types, endpoints, components, and DB entities added during this block. Update after each task merge. Claude uses this to avoid re-reading all TASK files.*

**New API endpoints:**
- `POST /api/[route]` — [what it does, request/response shape in brief]

**New types / schemas:**
- `[TypeName]` in `path/to/file.ts` — [fields and purpose]

**New components / screens:**
- `[ComponentName]` in `path/to/file.tsx` — [what it renders]

**DB changes:**
- [Table/model name]: [new fields or relations added]

*(none yet — update as tasks are merged)*

---

## Files modified in this block

*Cumulative list of all files touched by merged tasks in this block.*

- `path/to/file.ts` — [TASK-NNN: what changed]
- `path/to/file.tsx` — [TASK-NNN, TASK-NNN: what changed]

*(none yet)*

---

## Decisions made in this block

*Technical decisions made during execution — not in the roadmap or tech-spec, but relevant for upcoming tasks in this block.*

| Decision | Choice | Why |
|---|---|---|
| [Topic] | [What was decided] | [Rationale / tradeoff] |

*(none yet)*

---

## Block constraints

*Rules specific to this block. Executor reads these as additional constraints beyond the global codex-prelude.*

- [Example: do not modify the DB schema in this block — schema changes are in BLOCK-N+1]
- [Example: use only existing UI components — no new component library additions]
- [Example: all new endpoints must be authenticated]

---

## Carried-over issues

*Bugs or deferred items from previous blocks that may affect work in this block.*

| ID | Description | Impact on this block |
|---|---|---|
| BUG-N | [description] | [how it affects current tasks] |

*(none)*
