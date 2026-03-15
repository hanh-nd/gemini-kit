---
name: planning-pipeline
description: Strict state machine enforcing the multi-phase planning logic with Context Ingestion.
version: 1.1.0
---

# 🛤️ Workflow: Planning Pipeline SOP

You MUST execute the planning process strictly sequentially.

## Phase 1: Context Ingestion (MANDATORY)

- **Mandate:** You are FORBIDDEN from automatically invoking workspace scanning tools immediately. You must first evaluate existing data sources:
  1. **User Provided Context:** Analyze `{{args}}`. Has the user attached any context files (Markdown, Text, JSON) or code snippets?
  2. **Previous Agent Artifacts:** Use the directory-reading tool to check `.gemini-kit/tmp/` for files prefixed with `scout` or `context`. If present, read them.
- **Action:** - If sufficient context is gathered from the two sources above: Bypass OS workspace scanning commands entirely and proceed directly to Phase 2.
  - ONLY WHEN context is insufficient (e.g., the user only inputted `/plan build feature X` without attachments): you are permitted to use system tools to read `package.json` or the directory structure.

## Phase 2: Triaging & Gap Analysis

- **Action:** Cross-reference the user's requested feature with the context ingested in Phase 1.
- **Decision Gate:**
  - If core requirements (Data Models, API Contracts, UI/UX states for Loading/Error) are missing or ambiguous -> **HALT PIPELINE**. Transition immediately to **State 1: Discovery State** and request explicit clarification from the user.
  - If all requirements are logically and architecturally sound -> Proceed to Phase 3.

## Phase 3: Domain Skill Routing (MANDATORY)

- **Action:** Activate specific domain skills (e.g., `frontend-arch`, `system-design`, `refactoring`) based on the feature scope using your available tools.

## Phase 4: Blueprint Generation

- **Action:** Transition to **State 2: Blueprint State**.
- **Constraint:** Draft the Work Breakdown Structure (WBS) strictly from the bottom up: Data Layer -> Logic Layer -> Presentation Layer. Ensure every edge case identified in Phase 2 has a corresponding actionable task.

## Phase 5: Persistence & Handoff

- **Constraint Check:** Verify that no source code has been modified during the session.
- **Action:** Save the final Blueprint to `.gemini-kit/tmp/plans/plan-[timestamp]-[feature].md`.
- **Constraint:** This plan file acts as the Explicit Context for the `/code` Agent in the subsequent step. You must await explicit user approval (e.g., "Approve") before generating the handoff command: `/code @.gemini-kit/tmp/plans/...`.
