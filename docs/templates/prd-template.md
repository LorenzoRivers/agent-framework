# Product Requirements Document — [Product Name]

> **Instructions:** fill this document before starting BLOCK-1.
> A partial PRD is better than no PRD. Start with Vision, Problem, Non-goals, and Key flows.
> Claude reads this to write tasks and to reject scope creep. The Non-goals section is as important as the Goals section.

**Version:** 0.1
**Last updated:** YYYY-MM-DD
**Author:** [name]

---

## Vision

*One or two sentences. What does this product do, and for whom?*

> Example: "Coachable is a session management tool for professional coaches. It helps coaches track client progress, generate AI-powered session reports, and manage their client pipeline — all from a single web interface."

[Your vision here]

---

## Problem statement

*What problem does this product solve? Why does it need to exist?*

> Example: "Coaches currently manage notes in scattered tools (Notion, Google Docs, WhatsApp). There is no tool that connects session transcripts, client history, and AI-assisted reporting in one place designed for coaching workflows."

[Your problem statement here]

---

## Target users

*Who uses this product? Describe their context, technical level, and goals.*

| User type | Description | Key goal |
|---|---|---|
| [Primary user] | [who they are, context] | [what they want to achieve] |
| [Secondary user] | [if applicable] | [their goal] |

> Example:
> | User type | Description | Key goal |
> | Coach | Independent professional, 5-20 clients, non-technical | Track sessions and clients without admin overhead |
> | Client | Receives reports, no direct product access | N/A (indirect user) |

---

## Goals

*What must be true when this product is "done"? Measurable where possible.*

- [ ] [Goal 1 — e.g. "A coach can log in, create a client, record a session, and generate a report in under 10 minutes"]
- [ ] [Goal 2]
- [ ] [Goal 3]

---

## Non-goals

*Explicit list of things this product will NEVER do. This section is critical — Claude uses it to reject out-of-scope requests.*

**This product does NOT:**
- [Non-goal 1 — e.g. "Handle billing or subscription management (delegated to Stripe dashboard)"]
- [Non-goal 2 — e.g. "Provide a client-facing portal — coaches manage everything"]
- [Non-goal 3 — e.g. "Replace a full CRM — contact management is limited to coaching context"]
- [Non-goal 4]

---

## Key user flows

*3-5 narrative flows describing what a user does from start to finish. These become the basis for acceptance criteria in tasks.*

### Flow 1 — [Name, e.g. "New client onboarding"]

1. Coach logs in
2. Coach creates a new client (name, email, notes)
3. [next step]
4. [next step]
5. [end state — what the user sees]

### Flow 2 — [Name]

1. [step]
2. [step]

### Flow 3 — [Name]

1. [step]
2. [step]

---

## MVP scope

*What is included in the first shippable version? Be specific — this defines BLOCK-1 through BLOCK-N.*

**Included in MVP:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Explicitly deferred from MVP:**
- [Feature X — reason it's not MVP]
- [Feature Y — reason]

---

## Deferred features (post-MVP)

*Features that are planned but not in MVP. Prevents "why isn't this done yet?" questions.*

| Feature | Why deferred | Target phase |
|---|---|---|
| [Feature] | [reason] | V1.1 / Beta / "someday" |

---

## Success metrics

*How do you know the product is working? Measured how and by whom?*

- [Metric 1 — e.g. "Coach can complete a full session → report flow in < 10 min (manual timer test)"]
- [Metric 2 — e.g. "Zero data loss: session data persists across browser refresh"]
- [Metric 3]
