# Extension: Playwright E2E Testing

**Pattern:** Codex writes Playwright tests as part of every task implementation, then runs them automatically. The execution log reports standard tests and Playwright tests separately.

---

## When to use

Use this extension when:
- The project has a web or mobile-web UI
- Acceptance criteria can be verified by simulating user interactions in a browser
- The app can be started on a known local port during CI/test runs

**Do NOT use when:**
- The project is a pure backend/CLI with no browser UI
- The app cannot be started headlessly in the test environment

---

## One-time setup (do this at BLOCK-1, before the first task)

### 1. Install Playwright

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

For Expo/React Native web:
```bash
npm install --save-dev @playwright/test
npx @playwright/mcp install-browser chrome-for-testing
```

### 2. Create the `tests/` directory

```bash
mkdir tests
```

Copy `playwright.config.template.ts` from this directory to `tests/playwright.config.ts` and fill in the placeholders:

```bash
cp .codex/extensions/playwright/playwright.config.template.ts tests/playwright.config.ts
```

### 3. Set `{{TEST_COMMAND}}` in `codex-prelude.md`

```
{{TEST_COMMAND}}: cd tests && npx playwright test --config=playwright.config.ts 2>&1
```

Adjust the path if your `tests/` directory is elsewhere.

### 4. Add to `SETUP.md`

Document the dev server start command and port so Codex knows how to start the app:

```
Dev server: {{DEV_SERVER_COMMAND}} (starts app on port {{APP_PORT}})
```

### 5. Activate in `AGENTS.md`

Add the following to the Playwright row in the extensions table:

```
| `playwright/` | Codex writes + runs E2E tests per task | ✅ ACTIVE |
```

---

## How it works per task

### In the TASK file

The `## Test scenarios` section drives what Playwright tests Codex writes:

```markdown
## Test scenarios

**Happy path:**
- User fills form with valid data and submits → success message appears

**Validation:**
- User submits empty form → error "Field required" appears under each empty field

**Edge cases:**
- User types 200 characters in a 100-char field → input is truncated at 100
```

Codex reads these scenarios and writes a `.spec.ts` file that covers each one.

### In Phase 1 (implementation plan)

For T2 and T3 tasks, the implementation plan must include:

```markdown
## Playwright tests to write

File: `tests/feature-name.spec.ts`
- test("happy path: valid form submission → success message")
- test("validation: empty form → field errors")
- test("edge case: 200-char input → truncated at 100")
```

### In the implementation

Codex writes or updates `tests/[feature-name].spec.ts` **in the same commit** as the feature code.

### In the execution log

The execution log reports three sections (see codex-prelude.md):

```
STANDARD TESTS:
- {{LINT_COMMAND}} → PASS
- {{UNIT_TEST_COMMAND}} → N passed

PLAYWRIGHT TESTS:
- tests/feature-name.spec.ts → 3 passed
- [test name] → PASS / FAIL
Fix attempts: 0
```

---

## Test file conventions

- One `.spec.ts` file per feature/screen (not per task — update the existing file if the feature already has one)
- Test names follow the format: `"[scenario type]: [action] → [expected result]"`
- Use `page.waitForSelector` / `page.waitForResponse` for async operations — never fixed `sleep()`
- Never modify a `.spec.ts` to make it pass — fix the application code

---

## Troubleshooting

**App not started / connection refused:**
Codex must start the dev server before running tests. If the test environment cannot start the server, stop and declare RED_FLAG.

**Shadow DOM (Salesforce LWC, Web Components):**
`document.querySelector()` returns null on shadow DOM elements. Use recursive `shadowRoot` traversal. Document the selector strategy in the test file header.

**Flaky timing failures (Type C):**
Replace `sleep()` with `page.waitForSelector()` or `page.waitForResponse()`. If the element exists but times out, increase the default timeout in `playwright.config.ts`.
