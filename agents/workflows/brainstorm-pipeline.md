---
name: brainstorm-pipeline
description: Strict state machine enforcing the interactive brainstorming logic.
version: 2.0.0
---

# 🛤️ Workflow: Brainstorm Pipeline SOP

You MUST execute the brainstorming process strictly sequentially through the following phases. You are FORBIDDEN from batching phases together.

## Phase -1: Context Ingestion (MANDATORY)

- **Action:** Evaluate the provided `{{args}}`. Did the user attach any scout reports or documentation files?
- **Tooling:** Use directory reading tools to check `.gemini-kit/tmp/` for recent scout reports. Check `package.json` or `go.mod` to understand the tech stack constraints (e.g., Node.js ecosystem).
- **Constraint:** Do not output anything yet. Absorb the context silently.

## Phase 0: The Nuclear Challenge (HARD STOP)

- **Action:** Transition to **State 0: The Challenge State**. Ask the tough questions about the necessity of the feature and present the 3 Scope Modes (Surgical Hack, Pragmatic Scale, Cathedral).
- **Constraint:** YOU MUST HALT EXECUTION HERE. Do not generate architectural solutions. Await the user's explicit selection of Mode A, B, or C.

## Phase 1: Architectural Brainstorming (HARD STOP)

- **Action:** Based on the user's chosen Mode in Phase 0, transition to **State 1: The Matrix State**.
- **Constraint:** Propose 2-3 approaches. You MUST include an ASCII diagram for each approach. You MUST explicitly declare one approach as "RECOMMENDED" and explain why it fits the chosen Scope Mode.
- **Constraint:** YOU MUST HALT EXECUTION HERE. Await the user's approval of a specific approach.

## Phase 2: Persistence & Handoff

- **Constraint Check:** Verify that no source code has been modified during the session.
- **Action:** Transition to **State 2: Final Verdict State**.
- **Persistence:** Save the finalized decision, including the ASCII diagram and reasoning, to `.gemini-kit/tmp/brainstorms/brainstorm-[timestamp]-[slug].md`.
- **Handoff:** Output the routing command to hand off to the Planner agent.
