# 📋 Programming Blueprint: Documentation Update (Agents & Commands Expansion)

## 1. Technical Design

- **Data/Type Definitions:** N/A (Documentation update).
- **State/Logic Flow:** The Orchestrator's routing logic depends on the agent roster in `GEMINI.md`. Correcting this ensures proper task delegation to new agents (Tester, Researcher).
- **Component/Architecture Tree:** 
  - `GEMINI.md`: Update Agent Roster (9 agents) and Workflow.
  - `README.md`: Update Stats, Agent list, and Command list.
  - `commands/README.md`: Add `/unit-test` command.

## 2. Implementation Plan

### Phase 1: GEMINI.md Update (Core Agent Roster)

- [ ] **Task 1.1:** Add **Tester** and **Researcher** to the Agent Roster table.
- [ ] **Task 1.2:** Correct the file path for **Reviewer** to `agents/code-reviewer.md`.
- [ ] **Task 1.3:** Verify and update **Fixer** file path in roster.

### Phase 2: README.md Update (Public Stats & Feature Discovery)

- [ ] **Task 2.1:** Update badges and stats: Agents (8 -> 9), Commands (15 -> 16).
- [ ] **Task 2.2:** Add **Tester** and **Researcher** to the Agents table.
- [ ] **Task 2.3:** Add `/unit-test` to the Commands table.
- [ ] **Task 2.4:** Update total command count in text.

### Phase 3: commands/README.md Update (Command Reference)

- [ ] **Task 3.1:** Add `/unit-test` to the "Available Commands" table.
- [ ] **Task 3.2:** Update the total command count to (16).

### Phase 4: Validation & Consistency Check

- [ ] **Task 4.1:** Verify all agent filenames in `GEMINI.md` actually exist.
- [ ] **Task 4.2:** Ensure the "Agentic Workflow" in `GEMINI.md` reflects current best practices.

## 3. Coder Instructions

- Use surgical `replace` calls to preserve existing formatting and links.
- Maintain the professional tone and visual style (emojis, tables) of the current documentation.
- **Critical:** Check the exact filename for the "Fixer" agent in `agents/` before updating `GEMINI.md`.

## 4. Review & Refine

**Wait for User Input:** _Please review the proposed plan above. Are there any steps you would like to add, modify, or improve? Let me know, or type "Approve" to proceed with coding._

## 5. Execution Handoff

Next step:
/code @tmp/plans/plan-documentation-update.md
