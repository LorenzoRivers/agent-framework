# Extension: Domain Routing

**Pattern:** Intent classification → domain-specific agent role → specialized knowledge

**Core idea:** instead of treating every task the same way, Claude classifies the request by domain (e.g., database, UI, API, infrastructure) and routes it to an Executor role that has domain-specific knowledge, constraints, and context. Each domain agent operates with a narrower, more precise brief.

---

## When to use

Use this extension when:

- The project has clearly separated domains with different concerns and rules (DB ≠ UI ≠ API).
- You've noticed that generic Executor tasks frequently include irrelevant constraints or miss domain-specific ones.
- You want different knowledge files and hard rules per domain without cluttering the global AGENTS.md.
- The team (or set of Executor instances) has specialization — one agent knows the DB schema well, another knows the UI component library.

**Do NOT use when:**
- The project is small enough that all domains fit comfortably in a single AGENTS.md.
- Tasks regularly span domains and cannot be cleanly isolated (use standard T3 tasks instead).
- You're early in the project and domains aren't stable yet.

---

## Trade-offs

| Pro | Con |
|---|---|
| Tighter task specs — no irrelevant constraints | More maintenance: one brief per domain |
| Domain agent can have deeper knowledge context | Cross-domain tasks need explicit handoff |
| Reduces cognitive load for the Executor | Routing decision adds overhead for Claude |

---

## Activation

1. Create a `routing-rules.md` in `.codex/knowledge/` using the template in this folder.
2. Create a brief file per domain: `.codex/knowledge/domain-[name]-brief.md`.
3. Add this section to `.codex/AGENTS.md`:

```markdown
## Domain routing policy

When writing a task, Claude first classifies the request using `.codex/knowledge/routing-rules.md`.
The task file includes a `Domain:` field that identifies which domain brief the Executor should read
in addition to the standard codex-prelude.

Claude includes the relevant section of the domain brief in the TASK file's "Notes for Executor" section,
so the Executor has all needed context without reading multiple files.
```

---

## Domain brief structure

Each domain has its own brief file: `.codex/knowledge/domain-[name]-brief.md`

```markdown
# Domain Brief — [Domain Name]

## Scope
[What files and systems this domain owns]

## Key interfaces
[Types, endpoints, schemas the Executor needs to know]

## Hard rules
[Domain-specific forbidden operations]

## Common patterns
[How this domain typically solves problems — examples]

## DO NOT TOUCH from this domain
[What belongs to other domains — cross-domain boundary]
```

---

## Routing decision process

Claude follows this process when routing:

1. Read the user's request.
2. Identify the primary domain using `routing-rules.md`.
3. If the task is clearly cross-domain (e.g., "add an API endpoint AND update the UI"), split it into two tasks — one per domain — with an explicit dependency.
4. Include the domain name in the TASK file header: `Domain: database | ui | api | infra | cross`.
5. Copy the relevant domain brief sections into "Notes for Executor."

---

## Example routing table

From `routing-rules.md`:

| User intent keywords | Domain | Agent reads | Hard rules source |
|---|---|---|---|
| "schema", "migration", "model", "relation" | `database` | `domain-database-brief.md` | DB constraints |
| "component", "page", "UI", "button", "form", "style" | `ui` | `domain-ui-brief.md` | UI constraints |
| "endpoint", "route", "API", "handler", "middleware" | `api` | `domain-api-brief.md` | API constraints |
| "deploy", "env", "CI", "workflow", "docker" | `infra` | `domain-infra-brief.md` | Infra constraints |
| touches ≥2 domains | `cross` | All relevant briefs | All constraints |
