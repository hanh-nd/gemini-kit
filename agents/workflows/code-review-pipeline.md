---
name: code-review-pipeline
description: Standard Operating Procedure for executing a multi-pass, high-rigor Code Review.
version: 1.0.0
---

# 🔄 Workflow: Multi-Pass Code Review Pipeline

You are executing the Code Review Pipeline. You MUST process the code diff through the following phases in exact sequential order. Do not skip any phases.

## Phase 1: Context Triaging & Blast Radius (The Macro Pass)

Before analyzing individual lines of code, establish the big picture:

1. **Intent Verification:** Read the fetched PR Description and Jira Acceptance Criteria. What is the business goal? If this context is missing, output a warning and proceed with technical semantics only.
2. **Blast Radius Assessment:** Scan the list of changed files.
   - _High Risk:_ Changes to core utilities, database schemas, authentication middlewares, or shared state.
   - _Low Risk:_ Changes to isolated UI components or text copies.
3. **Architectural Alignment:** Does the overall design of the changes make sense for the stated intent? Is the developer reinventing the wheel instead of using existing system utilities?

## Phase 2: Execution Tracing (The Micro Pass)

Do NOT read the code strictly top-to-bottom. Read it by tracing the data flow:

1. **Trace the Input:** Where does the data enter the new code? Is it validated?
2. **Trace the Logic:** Follow the variables. Look for Unhandled Exceptions, Race Conditions, and State Mutations.
3. **Trace the Output:** Does the function return what is expected?
4. **Code Quality:** Identify DRY (Don't Repeat Yourself) violations, deep nesting, and overly complex functions that need refactoring.

## Phase 3: Baseline & Security Check (The Fact-Check Pass)

Perform a strict sweep for common critical violations regardless of the PR's intent:

1. **Security:** Look for hardcoded credentials/tokens, SQL injection vulnerabilities, and missing authorization checks.
2. **Performance:** Identify N+1 query problems in loops, memory leaks, and unoptimized array manipulations.
3. **Maintainability:** Flag any "Magic Numbers" or "Magic Strings". Require them to be extracted to constants.

## Phase 4: Test Parity Check (Conditional)

Evaluate the project's testing culture:

1. Search the diff or the workspace for a `tests/`, `specs/` directory, or files matching `*.test.*` / `*.spec.*`.
2. **If a test base exists:** Verify if the PR includes corresponding test updates for the new logic or bug fixes. If it doesn't, flag it as a BLOCKER.
3. **If no test base exists:** Skip this phase. Do not force the creation of tests in a project that currently has none.

## Phase 5: Actionable Feedback Generation

Translate your findings into the final output format.

1. **Categorization:** Every piece of feedback MUST be categorized as either:
   - `[BLOCKER]`: Critical bugs, security flaws, missing tests (if applicable), or severe architectural violations. The PR cannot be merged.
   - `[NITPICK]`: Minor styling, naming conventions, or small optimizations. The PR can be merged, but improvements are suggested.
2. **Actionability Rule:** You are FORBIDDEN from leaving vague comments (e.g., "Refactor this to be cleaner"). Every piece of feedback MUST include a clear explanation of the _Why_ and a code snippet showing the _How_ (the exact fix).
