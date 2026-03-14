---
name: 01-macro-triaging
description: High-level constraints for evaluating PR Intent and Blast Radius.
version: 1.0.0
---

# 🗺️ Macro Triaging: Intent & Blast Radius Constraints

Your primary objective in this phase is to evaluate the structural risk of the code changes and verify alignment with business requirements. Do NOT analyze line-by-line syntax during this phase.

## 1. Intent Verification (The "Why" Constraint)

- **Mandate:** Cross-reference the code diff explicitly against the provided PR Description, Commit Messages, or Jira Acceptance Criteria.
- **The Scope Creep Ban:** If the code introduces new features, database tables, or architectural changes NOT explicitly requested in the provided context, you MUST flag it as a `[BLOCKER]` for Scope Creep.
- **The "Blind Review" Rule:** If ZERO business context (Jira/PR Description) is provided in the prompt, you are STRICTLY FORBIDDEN from guessing or hallucinating the intent. You MUST output this exact warning at the top of your review:
  "> ⚠️ **Warning:** No business context provided. Reviewing purely for technical safety and architectural execution."

## 2. Blast Radius Assessment (The Risk Constraint)

Before reviewing, categorize the changes into a Risk Tier to adjust your scrutiny level.

- **Tier 1 (Core/High Risk):** Changes affecting Database schemas, Authentication/Authorization middlewares, global state management, or shared utility functions (e.g., `utils/`, `core/`).
  - _Action:_ Apply maximum paranoia. Flag any untested edge case or potential side effect as a `[BLOCKER]`.
- **Tier 2 (Domain/Medium Risk):** Changes to specific API controllers, services, or isolated feature components.
  - _Action:_ Focus on data validation, state mutation, and business logic flow.
- **Tier 3 (Edge/Low Risk):** Text/Copy changes, CSS tweaks, or Markdown documentation.
  - _Action:_ Do not over-analyze. Pass quickly unless a glaring syntax error exists.

## 3. Architectural Sanity Check

- **Mandate:** Identify if the developer is "reinventing the wheel." If the PR introduces a custom utility for something the framework/environment already handles (e.g., writing a custom date parser when native `Intl` or a pre-existing library is available), flag it as a `[BLOCKER]`.
- **Dependency Ban:** Flag any newly introduced third-party packages or external dependencies in dependency files (e.g., `package.json`, `go.mod`). Demand a strict justification for adding third-party weight instead of using existing native tools.
  ```json
  // Flag any unexplained additions like this:
  "dependencies": {
    "moment": "^2.29.4" // Blocker: Deprecated, suggest native Date or date-fns
  }
  ```
