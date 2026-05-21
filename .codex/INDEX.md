# .codex — Navigation Index

Read this file first. It tells you exactly which files to read for your current situation — nothing more.

---

## Session start (Claude)

```
1. .codex/knowledge/project/session-handoff.md          ← current state, open decisions
2. .codex/knowledge/BLOCK-N-[slug]-brief.md             ← active block context
```

If either is missing or stale → declare the gap before writing any task.

---

## Writing a task

```
1. WORKFLOW.md §Step 2 (Phase A–D)                      ← how to write the task
2. templates/task-template.md                           ← the format
3. knowledge/workflow/model-effort-guide.md             ← which tier (T1/T2/T3)?
```

Reference docs (read only what the task touches):
- `docs/tech-spec.md` — field names, types, routes, data model
- `docs/dev-handbook.md` — invariants, naming, DO NOT BREAK rules
- `docs/prd.md` — scope, non-goals
- `docs/roadmap.md` — block sequencing

---

## Reviewing a diff (Gate 2)

```
1. WORKFLOW.md §Gate 2                                  ← validation rules by tier
2. templates/review-template.md                        ← review format (T2-large / T3)
```

---

## Merging a task (after Gate 2)

```
1. WORKFLOW.md §After Gate 2                            ← simplify review + merge steps
```

---

## Gate 3 — block complete

```
1. checklists/gate3-block-approval.md                   ← full checklist (security review included)
```

---

## Executing a task (Codex CLI)

```
1. templates/codex-prelude.md                          ← all rules (read in full)
```

---

## Roles, permissions, hard rules

```
1. AGENTS.md                                           ← who can do what, permissions matrix
```

---

## Skills (autonomous workflows)

| Say this | Claude runs |
|---|---|
| "init project" / "inizializza il progetto" | `skills/init-project.md` |
| "init verifiers" / "crea verifier" | `skills/init-verifiers.md` |
| "commit push pr" / "crea la pr" / "ship it" | `skills/commit-push-pr.md` |

---

## Reference — rarely needed

```
settings/approval_rules.md          ← what needs explicit approval vs auto-approved
settings/file_scopes.md             ← who owns which paths
knowledge/workflow/failure-paths.md ← what to do when things go wrong
knowledge/workflow/future-capabilities.md ← deferred capabilities (not yet in framework)
extensions/*/README.md              ← optional patterns (parallel, routing, self-eval, playwright)
```
