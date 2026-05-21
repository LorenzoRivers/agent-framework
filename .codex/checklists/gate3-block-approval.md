# Gate 3 — Block Approval Checklist

Run this checklist before merging `block/BLOCK-N-[slug]` → `dev`.

**Block:** BLOCK-N — [block name]
**Date:** YYYY-MM-DD
**Checked by:** User

---

## 1. CI / automated checks

- [ ] `{{LINT_COMMAND}}` passes on the block branch
- [ ] `{{TEST_COMMAND}}` passes on the block branch
- [ ] No merge conflicts with `dev`
- [ ] No uncommitted changes on the block branch

---

## 2. Runtime smoke test

Start the application on the block branch and verify:

- [ ] Application starts without errors
- [ ] Authentication / login flow works
- [ ] No 500 errors in the main user flows

---

## 3. Feature-specific checks

[Add a row per feature delivered in this block. Replace the examples with your actual features.]

| Feature | Check | Pass? |
|---|---|---|
| [Feature A] | [What to verify — golden path] | ✅ / ❌ |
| [Feature B] | [What to verify] | ✅ / ❌ |
| [Feature C — edge case] | [What to verify] | ✅ / ❌ |

---

## 4. Regression checks

Verify that features from prior blocks still work:

- [ ] [Prior feature 1] — still works as expected
- [ ] [Prior feature 2] — still works as expected
- [ ] [Add more as the project grows]

---

## 5. Security review

Claude runs a security review on the block branch diff before merging to `dev`. This step does **not** require any external plugin — Claude executes it autonomously.

**How Claude executes it:**

1. Run `git diff dev..block/BLOCK-N-[slug]` to get the full block diff.
2. Launch a **vulnerability identification subagent** with the full diff and these instructions:
   - Analyze the changes for concrete, exploitable security vulnerabilities with a clear attack path
   - Focus on: injection (SQL, command, path traversal), authentication/authorization bypass, sensitive data exposure (PII in logs, secrets in code), insecure direct object references, missing ownership checks, unsafe deserialization
   - For each candidate finding: assess whether it is a real vulnerability vs. a theoretical best practice concern

3. For each vulnerability identified, launch a **false-positive filter subagent** (in parallel). Each subagent applies these automatic exclusions:
   - DOS / resource exhaustion, rate limiting concerns
   - Secrets on disk if otherwise secured
   - Outdated third-party libraries
   - Memory safety issues in memory-safe languages (Rust, Go, etc.)
   - Vulnerabilities only in test files
   - Log spoofing, regex injection, regex DOS
   - SSRF that only controls the path (not host or protocol)
   - React/Angular components not using `dangerouslySetInnerHTML` or equivalent — XSS-safe by default
   - Client-side JS/TS lacking auth checks — auth is the server's responsibility
   - Lack of audit logs, hardening measures, or input validation on non-security-critical fields
   - Theoretical race conditions without a concrete attack path
   - Generic GitHub Actions vulnerabilities without a specific untrusted input path

4. Each false-positive subagent assigns a **confidence score 1–10**. Only findings with confidence ≥ 8 are included in the final report.

5. Claude produces a markdown report. For each HIGH or MEDIUM finding: file path, line, vulnerability type, attack path, recommended fix.

**Output format:**
```
## Security Review — block/BLOCK-N-[slug]

### HIGH findings
- [ ] [File:line] [Type] — [description] — [fix]

### MEDIUM findings
- [ ] [File:line] [Type] — [description] — [fix]

### Result
CLEAN / FINDINGS (N high, M medium)
```

- [ ] Security review completed — no HIGH findings outstanding
- [ ] MEDIUM findings either fixed or explicitly accepted with rationale below

**Security review findings / acceptance notes:**
[Document any findings and their resolution, or write "none — review was clean"]

---

## 6. Known issues

- [ ] All known issues from this block are either fixed or explicitly deferred to a future block (documented in `knowledge/project/deferred-issues.md`)

---

## 7. Branch state

- [ ] All task branches for this block are merged into `block/BLOCK-N-[slug]`
- [ ] All task branches are deleted (local + remote) after User approval
- [ ] `block/BLOCK-N-[slug]` is pushed to remote and up to date

---

## Verdict

- [ ] **APPROVED** — merge `block/BLOCK-N-[slug]` → `dev` and push

**Notes:**
[Any observations, deferred issues, or things to watch in the next block]
