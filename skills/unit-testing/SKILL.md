---
name: unit-testing
description: |
  Use this skill for: Writing unit tests, increasing test coverage, mocking external dependencies, following AAA patterns, or fixing failing test suites.
version: 1.0.0
---

# 🛡️ Skill: Robust Unit Testing

## 🎭 The Core Philosophy

Unit tests are the primary shield protecting the system's integrity. A bad test is worse than no test at all because it provides a false sense of security. Your mandate is to generate tests that **fail immediately when the underlying business logic is incorrectly altered**. Tests are not written to satisfy coverage metrics; they are written to guarantee system correctness.

## 🚦 Mandatory Bootstrapping

When this skill is activated, you are strictly FORBIDDEN from generating any test code immediately. You MUST use your file-reading tool to ingest the following three deep-dive directive files into your context:

1. `skills/unit-testing/docs/01-type-safety-anti-cheat.md` (Typing constraints)
2. `skills/unit-testing/docs/02-meaningful-assertions.md` (Assertion constraints)
3. `skills/unit-testing/docs/03-mocking-boundaries.md` (Isolation constraints)

Do NOT proceed with generating the test plan or the code until you have read, internalized, and applied the rules from these three files.
