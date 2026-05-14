# Routing Rules — {{PROJECT_NAME}}

Used by Claude to classify tasks by domain before writing TASK files. Copy this template to `.codex/knowledge/routing-rules.md` and customize for your project.

---

## Domain definitions

| Domain | What it covers | Brief file |
|---|---|---|
| `database` | [e.g. DB schema, migrations, ORM models, seed data] | `knowledge/domain-database-brief.md` |
| `api` | [e.g. REST/GraphQL endpoints, middleware, auth handlers] | `knowledge/domain-api-brief.md` |
| `ui` | [e.g. React components, pages, styles, client-side state] | `knowledge/domain-ui-brief.md` |
| `infra` | [e.g. CI/CD, Docker, env config, deployment] | `knowledge/domain-infra-brief.md` |
| `cross` | Task spans ≥2 domains — requires splitting or T3 treatment | All relevant briefs |

<!-- Customize domains for your project. Remove or add domains as needed.
     Examples of other domains: "auth", "payments", "notifications", "ml-pipeline", "search" -->

---

## Routing signal keywords

| Keywords in user request | → Domain |
|---|---|
| schema, migration, model, relation, table, index, seed | `database` |
| endpoint, route, handler, middleware, API, controller, service | `api` |
| component, page, UI, button, form, style, layout, modal | `ui` |
| deploy, CI, workflow, Docker, env, config, infra, pipeline | `infra` |
| *(spans multiple rows above)* | `cross` |

---

## Cross-domain task policy

When a request touches ≥2 domains:

1. **Preferred:** split into separate tasks (one per domain), with explicit `depends_on` if needed.
2. **If inseparable:** classify as `cross`, use T3 tier, Claude review mandatory.
3. **Never:** bundle a DB schema change with UI changes in a single T1 or T2-small task.

---

## Domain brief template

Create one file per domain in `.codex/knowledge/`:

```markdown
# Domain Brief — [Domain Name]

## Scope
[Files and systems this domain owns: list specific directories or patterns]

## Key interfaces
[Types, endpoints, or schemas the Executor needs to know for this domain]
[Update after each task that introduces new interfaces]

## Hard rules
[Domain-specific constraints, e.g.:]
- [Never modify X without Y]
- [Always validate Z before saving to DB]

## Common patterns
[How this domain typically solves problems — 2-3 examples]

## Boundary — do NOT touch from this domain
[Files/systems owned by other domains — cross-domain boundary guard]
```
