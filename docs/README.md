# /docs — Project Documentation

This folder contains the **sources of truth** that Claude and Codex use to write and implement tasks. The better these documents are, the better the tasks — and the better the implementation.

---

## What each document is for

| File | What goes here | Used by | When to update |
|---|---|---|---|
| `prd.md` | Product vision, goals, non-goals, key user flows, MVP scope | Claude (task writing, scope rejection) | When product scope changes |
| `tech-spec.md` | Tech stack, data model, API contracts, key technical decisions | Claude + Codex (code generation) | After every schema or API change |
| `roadmap.md` | Block sequencing, scope per block, dependencies | Claude (block planning, deferral decisions) | When block plan changes |
| `dev-handbook.md` | Naming conventions, DO NOT BREAK invariants, error handling, logging, test patterns | Claude + Codex (every task) | After every permanent technical decision |
| `design.md` | UX/UI flows, component behavior, microcopy (optional) | Claude + Codex (UI tasks) | When UX changes |

---

## Getting started — fill in this order

1. **`prd.md` first** — defines what you're building and what you're not. Copy from `docs/templates/prd-template.md`. A partial PRD (vision + non-goals + 2-3 flows) is enough to start.
2. **`tech-spec.md` second** — defines how you're building it. Tech stack and data model are the minimum. Copy from `docs/templates/tech-spec-template.md`.
3. **`roadmap.md` third** — defines the order of blocks. Rough task lists are fine. Copy from `docs/templates/roadmap-template.md`.
4. **`dev-handbook.md` last (but start early)** — 3-4 invariants and naming conventions are enough for BLOCK-1. Grows throughout the project. Copy from `docs/templates/dev-handbook-template.md`.
5. **`design.md` optional** — only needed if the project has significant UI work requiring precise behavior spec.

**Minimum to start BLOCK-1:** `prd.md` (partial) + `tech-spec.md` (stack + data model) + `roadmap.md` (BLOCK-1 scope).

---

## How Claude uses each document

| Document | Claude uses it to... |
|---|---|
| `prd.md` | Write task context, reject out-of-scope requests, verify acceptance criteria match product goals |
| `tech-spec.md` | Use correct field names, types, route paths, patterns — without reading application code |
| `roadmap.md` | Sequence tasks, defer features to the right block, write block briefs |
| `dev-handbook.md` | Fill "DO NOT BREAK" sections in task files, enforce naming in reviews, spot invariant violations in diffs |
| `design.md` | Write precise UI behavior in test scenarios and acceptance criteria |

---

## Templates

Copy these to create your project docs:

```bash
cp docs/templates/prd-template.md      docs/prd.md
cp docs/templates/tech-spec-template.md docs/tech-spec.md
cp docs/templates/roadmap-template.md  docs/roadmap.md
cp docs/templates/dev-handbook-template.md docs/dev-handbook.md
```

---

## Writing good docs for agentic use

**Be specific.** "The user can log in" is vague. "Authentication uses JWT tokens stored in httpOnly cookies with a 30-day expiry; login validates email + bcrypt password hash" gives Codex something to implement correctly.

**Define invariants explicitly.** List what must never change, not just what should work. The `dev-handbook.md` DO NOT BREAK section is read in every task.

**Name things canonically.** If you call it a `session` in the tech spec, use `session` everywhere — not `meeting`, `call`, or `appointment`. One name per concept.

**Separate concerns.** DB schema in tech-spec, not in prd. UI flows in design, not in tech-spec. Naming in dev-handbook, not scattered across files.

**Update docs as you build.** If the implementation diverges from the spec, update the spec immediately — don't let them drift. Claude reads docs as truth; stale docs produce wrong tasks.

---

## Conflict resolution

If two documents disagree, this priority order applies:

1. `dev-handbook.md` — always wins on invariants and naming
2. `roadmap.md` — wins on sequencing and block scope
3. `tech-spec.md` — wins on technical details
4. `design.md` — wins on UI behavior
5. `prd.md` — wins on product scope and non-goals

If still ambiguous → Claude asks the User (max 3 questions).
