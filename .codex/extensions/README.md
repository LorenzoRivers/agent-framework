# Extensions — Advanced Agentic Patterns

Extensions are **opt-in** additions to the core workflow. They implement advanced multi-agent patterns that go beyond the base orchestrator→subagent loop.

Do not activate extensions by default. Add them only when the project genuinely needs them.

---

## Available extensions

| Extension | Pattern | When to use |
|---|---|---|
| [`parallel-agents/`](parallel-agents/README.md) | Fan-out / fan-in | Tasks with no inter-dependencies; want to run multiple Executors simultaneously |
| [`routing/`](routing/README.md) | Domain-based routing | Project has clearly separated domains; want specialized agents per domain |
| [`self-eval-loop/`](self-eval-loop/README.md) | Executor self-retry | Tasks with fully objective, measurable acceptance criteria; want to reduce human review cycles |

---

## How to activate an extension

Each extension has its own `README.md` with specific activation instructions. The general pattern is:

1. Read the extension's `README.md` — understand the pattern and its trade-offs.
2. Add the specified policy section to `.codex/AGENTS.md`.
3. Use the extension's template(s) when writing tasks that should use the pattern.

Extensions are additive — they do not replace core workflow steps. Gate 1, Gate 2, and Gate 3 still apply.

---

## Extension design principles

- **Core workflow is always the baseline.** Extensions modify *how* a step is executed, not *whether* it happens.
- **Activation is explicit.** An extension only applies to tasks that opt into it. Other tasks run the standard loop.
- **Safety first.** If an extension increases autonomy (e.g., self-eval loop), it must also define clear escalation conditions.
- **One extension at a time.** Don't combine parallel-agents + self-eval-loop on the same task until you've used each separately and understand the interactions.

---

## Building custom extensions

If you need a pattern not covered here, create a new folder in `.codex/extensions/` with:
- `README.md` — when to use, trade-offs, activation instructions, worked example
- Template file(s) — if the extension requires a modified task or output format

Follow the same design principles: additive, opt-in, safe escalation.
