# /docs — Project Documentation

This folder contains the **sources of truth** that Claude uses to write tasks. The better these documents are, the better the tasks — and the better the implementation.

## Recommended structure

| File | What goes here | Priority |
|---|---|---|
| `prd.md` | Product requirements: what the product does, for whom, what's out of scope | Highest |
| `tech-spec.md` | Architecture, data model, API contracts, technical decisions | High |
| `roadmap.md` | Block sequencing, scope per block, dependencies between blocks | High |
| `dev-handbook.md` | Invariants, naming conventions, "DO NOT BREAK" rules, coding standards | High |
| `design.md` | UX/UI contract, flows, components, microcopy (if applicable) | Medium |

## Conflict resolution

If two documents disagree, this priority order applies:

1. `dev-handbook.md` — always wins on invariants and naming
2. `roadmap.md` — wins on sequencing and block scope
3. `tech-spec.md` — wins on technical details
4. `design.md` — wins on UI behavior
5. `prd.md` — wins on product scope and non-goals

If still ambiguous → Claude asks the User (max 3 questions).

## Writing good docs for agentic use

- **Be specific.** "The user can log in" is vague. "Authentication uses JWT tokens stored in httpOnly cookies with a 7-day expiry" gives the Executor something to work with.
- **Define invariants explicitly.** List what must never change, not just what should work.
- **Name things canonically.** If you call it a "session" in the tech spec, use "session" everywhere — not "meeting", "call", or "appointment".
- **Separate concerns.** DB schema in tech-spec, not in prd. UI flows in design, not in tech-spec.
- **Update docs as you build.** If the implementation diverges from the spec, update the spec — don't let them drift.
