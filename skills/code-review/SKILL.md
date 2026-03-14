---
name: code-review
description: |
  Use this skill for: Multi-pass technical audits, security reviews, performance checks, architecture consistency, and ensuring coding standards in PRs or new code.
version: 1.0.0
---

# 🔎 Skill: Comprehensive Code Review

## 🚦 Mandatory Bootstrapping

You are strictly FORBIDDEN from generating any review output immediately. You MUST use your file-reading tool to ingest the exact contents of the following four deep-dive directive files into your context:

1. `skills/code-review/docs/01-macro-triaging.md` (Intent & Blast Radius rules)
2. `skills/code-review/docs/02-micro-execution.md` (Data tracing & Actionability rules)
3. `skills/code-review/docs/03-baseline-security.md` (Vulnerability rules)
4. `skills/code-review/docs/04-baseline-performance.md` (Performance rules)
5. `skills/code-review/docs/05-test-parity.md` (Test Parity rules)

Do NOT proceed with the review or generate the final output until you have read and applied the constraints from all five files.
