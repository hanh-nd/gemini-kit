---
name: 05-test-parity
description: Conditional constraints for enforcing unit/integration test updates alongside business logic changes.
version: 1.0.0
---

# ⚖️ Test Parity & Coverage Constraints

Your objective in this phase is to prevent regressions by ensuring that test coverage does not degrade. You MUST conditionally execute these rules based on the project's testing culture.

## 1. Discovery Phase (The "Test Base" Check)

Before demanding any tests, scan the provided workspace context, file paths, or diff for evidence of a testing framework.

- **Testing Evidence Signatures:** Presence of directories named `tests/`, `specs/`, `__tests__/`, `e2e/`, or files matching `*.test.*` or `*.spec.*`.
- **The "No-Test Base" Rule:** If ZERO testing evidence is found, you are STRICTLY FORBIDDEN from demanding tests. Silently skip the rest of this file. Do NOT mention the lack of tests in your review.

## 2. The Parity Mandate (Active Test Base Only)

If Testing Evidence is found, you MUST enforce the following constraints:

- **Mandate:** Any PR that introduces new business logic, adds a new API endpoint, or fixes a bug MUST include corresponding modifications or additions to the test files.
- **The "Uncovered Logic" Ban:** If the diff shows new exported functions, new `if/else` branches, or modified state logic, but ZERO test files are touched, you MUST flag this immediately as a `[BLOCKER]`.
  - _Action:_ Demand a test case that covers the specific new branch or bug fix.

## 3. Test Quality Constraints

If the PR _does_ include test changes, review the tests themselves using these strict criteria:

- **The "Tautology" Ban:** Flag tests that do not assert meaningful business logic.

  ```typescript
  // Flag this as a [BLOCKER] for meaningless assertion:
  expect(result).toBeDefined(); // Proves nothing about the actual data
  ```

  - _Mandatory Fix:_ Demand exact payload verification (e.g., `expect(result.status).toBe(200)`).

- **The "Flaky Test" Ban:** Flag any test that introduces real network calls, relies on `Date.now()` without mocking the timer, or generates random data without a fixed seed. Tests must be 100% deterministic.
- **The "Ignored Error" Ban:** Flag tests for error scenarios (Negative Paths) that only check if an error was thrown, without verifying the specific Error Code or Message.
