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

## 5. Known issues

- [ ] All known issues from this block are either fixed or explicitly deferred to a future block (documented in `knowledge/project/deferred-issues.md`)

---

## 6. Branch state

- [ ] All task branches for this block are merged into `block/BLOCK-N-[slug]`
- [ ] All task branches are deleted (local + remote) after User approval
- [ ] `block/BLOCK-N-[slug]` is pushed to remote and up to date

---

## Verdict

- [ ] **APPROVED** — merge `block/BLOCK-N-[slug]` → `dev` and push

**Notes:**
[Any observations, deferred issues, or things to watch in the next block]
