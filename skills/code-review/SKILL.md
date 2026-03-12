---
name: code-review
description: |
  ACTIVATE THIS SKILL WHEN: The user provides a Pull Request (PR) ID, a code diff, or explicitly asks to review newly written code.
  DO NOT ACTIVATE WHEN: The user asks to fix a bug directly or write new implementation code.
  PURPOSE: Performs a rigorous, multi-pass technical audit focusing on logic flaws, performance bottlenecks, and coding standards.
version: 1.0.0
---

# Code Review Skill

## Overview

A systematic approach to code review that moves beyond "it looks good" to rigorous quality verification. This skill provides specific checklists and procedures for different review types. It uses the Code Review Architect persona to ensure high-quality, substantive feedback.

## Foundation

Before performing any specific review pass, you **MUST** read and understand the core constraints and objectives in:
→ `workflows/code-review-commons.md`

## Instrumentation

```bash
# Log usage when using this skill
./scripts/log-skill.sh "code-review" "manual" "$$"
```

## What do you want to do?

0. **Understand the Persona & Constraints** (MANDATORY first step) → `workflows/code-review-commons.md`
1. **Security Review** (Auth, RLS, Input) → `workflows/security-pass.md`
2. **Performance Review** (Database, Re-renders) → `workflows/performance-pass.md`
3. **Architecture Review** (State, Data Flow) → `workflows/architecture-pass.md`
4. **General Quality Check** → `checklists/pre-merge.md`

## Key Principles

- **Review in Passes**: Don't check everything at once. Do a security pass, then a performance pass, etc.
- **Reference Patterns**: Always check against `docs/solutions/patterns/critical-patterns.md`.
- **Verify, Don't Guess**: If you see a potential issue, verify it with a quick test or script.
