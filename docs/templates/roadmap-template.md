# Roadmap — [Product Name]

> **Instructions:** fill the phases and block sequencing before starting BLOCK-1.
> Block task lists are rough — precise task files are written by Claude during execution.
> The key information here is: order, dependencies, and what "done" means for each block.
> Claude uses this to sequence work and to push features to the right block when scope creep arises.

**Last updated:** YYYY-MM-DD

---

## Product phases

| Phase | Goal | Blocks |
|---|---|---|
| **MVP** | [e.g. Core loop working end-to-end for internal use] | BLOCK-1 → BLOCK-N |
| **Beta** | [e.g. Real users, feedback loop, payment] | BLOCK-N+1 → BLOCK-M |
| **V1** | [e.g. Production-ready, all core features stable] | BLOCK-M+1 → … |

---

## Block sequencing

### Current status

| Block | Name | Goal | Status | Notes |
|---|---|---|---|---|
| BLOCK-1 | [name] | [goal] | PLANNED / ACTIVE / COMPLETE | |
| BLOCK-2 | [name] | [goal] | PLANNED | Depends on BLOCK-1 |
| BLOCK-3 | [name] | [goal] | PLANNED | |

---

### BLOCK-1 — [Name]

**Goal:** [One sentence — what capability exists after this block that didn't before]

**Depends on:** nothing (first block)

**Rough task list:**
- [ ] [Task area 1 — e.g. "Auth: login + session management"]
- [ ] [Task area 2 — e.g. "Client CRUD: create, list, view"]
- [ ] [Task area 3]

**Block complete when:**
[Acceptance statement — e.g. "A coach can log in, create a client, and view their client list in the browser"]

**Explicitly NOT in this block:**
- [Feature deferred to BLOCK-2 — e.g. "Session recording and reports"]

---

### BLOCK-2 — [Name]

**Goal:** [One sentence]

**Depends on:** BLOCK-1 (auth, client model)

**Rough task list:**
- [ ] [Task area 1]
- [ ] [Task area 2]

**Block complete when:**
[Acceptance statement]

**Explicitly NOT in this block:**
- [Deferred feature]

---

### BLOCK-3 — [Name]

**Goal:** [One sentence]

**Depends on:** [BLOCK-N]

**Rough task list:**
- [ ] [Task area 1]

**Block complete when:**
[Acceptance statement]

---

*Add more blocks as needed. Keep task lists rough — precision comes when Claude writes the TASK files.*

---

## Deferred backlog

*Features that are planned but have no assigned block yet.*

| Feature | Why deferred | Earliest possible block |
|---|---|---|
| [Feature] | [Depends on X / not MVP / too risky now] | BLOCK-N or "post-MVP" |

---

## Roadmap decisions

*Sequencing choices and why — prevents re-debating the same questions.*

| Decision | Choice | Reason |
|---|---|---|
| [e.g. Auth before features] | [Build BLOCK-1 = auth only] | [Can't test any feature without auth] |
| [e.g. Schema first] | [DB model in BLOCK-1 before API] | [API depends on schema] |
