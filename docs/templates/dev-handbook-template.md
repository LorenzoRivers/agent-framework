# Dev Handbook — [Product Name]

> **Instructions:** this is the #1 source of truth for Claude and Codex.
> Start with Naming conventions, DO NOT BREAK invariants, and Error handling.
> The other sections can be filled incrementally as decisions are made during execution.
> Every time Claude or Codex makes a technical decision that should become permanent, it belongs here.

**Last updated:** YYYY-MM-DD

---

## Naming conventions

*Exact names matter — Codex generates code using these. Be specific.*

### Files and directories

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `ClientCard.tsx`, `SessionList.tsx` |
| Utility files | camelCase | `formatDate.ts`, `apiClient.ts` |
| API route files | kebab-case | `client-routes.ts`, `auth-routes.ts` |
| Test files | `[name].spec.ts` | `ClientCard.spec.ts` |
| [Add your convention] | | |

### Variables and functions

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `function ClientCard()` |
| Functions | camelCase | `getUserById`, `formatDate` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `DEFAULT_LOCALE` |
| Boolean variables | `is/has/can` prefix | `isLoading`, `hasError`, `canEdit` |
| Event handlers | `handle` prefix | `handleSubmit`, `handleDelete` |

### Database (if applicable)

| Type | Convention | Example |
|---|---|---|
| Table names | PascalCase (Prisma) / snake_case (SQL) | `Coach`, `Session` / `coach`, `session` |
| Column names | camelCase (Prisma) / snake_case (SQL) | `createdAt` / `created_at` |
| Foreign keys | `[entity]Id` | `coachId`, `clientId` |

### ✅ / ❌ Examples

```
✅ components/ClientCard.tsx
✅ server/routes/client-routes.ts
✅ function handleSessionCreate()
✅ const isLoading = true

❌ components/clientCard.tsx
❌ server/routes/ClientRoutes.ts
❌ function createSessionHandler()
❌ const loading = true
```

---

## State model

*If the product has entities with states (orders, sessions, subscriptions), define the valid values and transitions here.*
*Codex uses this to avoid introducing invalid state transitions.*

### [Entity — e.g. Session]

**Valid states:** `[STATE_A]` | `[STATE_B]` | `[STATE_C]`

**Transitions allowed:**
```
[STATE_A] → [STATE_B]  (when: [condition])
[STATE_B] → [STATE_C]  (when: [condition])
```

**Transitions NOT allowed:**
```
[STATE_C] → [STATE_A]  — sessions cannot be re-opened once closed
```

*Remove this section if the product has no stateful entities.*

---

## DO NOT BREAK invariants

*Rules that must hold after every task. These go into every task's "DO NOT BREAK" section.*
*Start with 3-5 core invariants and add as the project grows.*

**Authentication:**
- [ ] Every API route that returns user data must call `requireAuth` middleware
- [ ] Auth tokens must never be returned in response bodies or logged

**Data integrity:**
- [ ] Every DB write that touches multiple tables must be wrapped in a transaction
- [ ] [Entity] can only be deleted if [condition] — never hard-delete without checking [condition]

**API contracts:**
- [ ] All API responses follow `{ data: ... }` for success and `{ error: string }` for errors — no exceptions
- [ ] HTTP status codes: 200 (ok), 201 (created), 400 (bad request), 401 (unauth), 403 (forbidden), 404 (not found), 500 (server error)

**Frontend:**
- [ ] [e.g. Loading states must be shown for all async operations > 300ms]
- [ ] [e.g. Forms must not submit twice — disable submit button on first click]

*Add invariants here as they are discovered during development.*

---

## Error handling standard

*How errors are handled at each layer. Codex uses this to generate consistent error handling.*

### Backend

```
Pattern: try/catch in every async route handler
On error: log to console.error with context, return { error: "user-facing message" }
Never: expose stack traces, internal paths, or DB error messages to the client
Never: log PII (email, name, phone) in error messages
```

Example:
```typescript
try {
  const result = await doSomething();
  return res.json(result);
} catch (error) {
  console.error("[FeatureName] Error:", error);
  return res.status(500).json({ error: "Something went wrong" });
}
```

### Frontend

```
Pattern: catch errors from API calls, show user-facing message
Never: show raw error.message to the user in production
Loading state: set to false in finally block, not in catch
```

---

## Logging conventions

```
Levels: console.error (errors), console.warn (unexpected but not fatal), console.log (dev only)
Format: "[FeatureName] <message>" — always prefix with the feature name
Never log: passwords, tokens, full request bodies containing PII, email addresses
Production: console.error only — remove console.log before merging to main
```

---

## API conventions

```
Base path: /api/[resource]
Auth: [e.g. httpOnly cookie named "auth_token"]
Request body: JSON (Content-Type: application/json)
Response success: { data: ... } or array directly (list endpoints)
Response error: { error: "human-readable message" }
Pagination: { data: [...], total: N, page: N, pageSize: N } — only for list endpoints that need it
```

---

## Test conventions

```
What to test: every user-visible behavior, every API endpoint, every form flow
What NOT to test: implementation details, internal functions, CSS
Test naming: "[scenario type]: [action] → [expected result]"
  ✅ "happy path: valid login → redirects to dashboard"
  ✅ "validation: empty email → shows error under email field"
  ❌ "test login"
  ❌ "should work"
Mocking: mock external services (OpenAI, Stripe) — never make real calls in tests
```

---

## Commit message format

```
Pattern: [type](scope): [short description]
Types: feat, fix, chore, docs, test, refactor
Scope: block-N or component name

Examples:
✅ feat(block-3): add session report generation
✅ fix(auth): handle expired token redirect
✅ chore: update dependencies
❌ "fixed stuff"
❌ "WIP"
```

---

## Branch naming

```
Feature blocks:  block/BLOCK-N-[slug]
Tasks:           task/TASK-NNN-[slug]
Hotfixes:        hotfix/[short-description]
```
