# 📋 Programming Blueprint: Migrate to Native Skill Activation

## 1. Technical Design

- **Data/Type Definitions:** 
    - No new types. 
    - Remove `kit_get_skill_list` tool definition and its internal `skills` collection logic in `src/tools/core.ts`.
- **State/Logic Flow:**
    - **Current Flow:** Commands manually call `kit_get_skill_list` -> Inject full skill list into prompt -> Agent evaluates intent -> Agent activates skill.
    - **New Flow:** Gemini CLI automatically scans `skills/` directories of linked extensions -> CLI injects skill metadata (name/desc) into system prompt -> Agent natively identifies intent -> Agent calls built-in `activate_skill` tool.
- **Component/Architecture Tree:**
    - `src/tools/core.ts`: Remove dead `kit_get_skill_list` tool.
    - `commands/*.toml`: Update prompts to remove the redundant `SKILL ACTIVATION (CRITICAL)` section.
    - `agents/*.md`: Update protocols to reflect native skill activation.
    - `skills/*/SKILL.md`: Refine descriptions for better LLM trigger performance.

## 2. Implementation Plan

### Phase 1: Tool Cleanup (Infrastructure)

- [ ] **Task 1.1:** Remove `kit_get_skill_list` implementation and registration from `src/tools/core.ts`.
- [ ] **Task 1.2:** Re-run build (`npm run build`) to ensure server remains functional.

### Phase 2: Command Template Refactoring

- [ ] **Task 2.1:** Update all 6 commands that used `kit_get_skill_list`:
    - `commands/brainstorm.toml`
    - `commands/code.toml`
    - `commands/debug.toml`
    - `commands/fix.toml`
    - `commands/plan.toml`
    - `commands/scout.toml`
- [ ] **Task 2.2:** Replace the explicit 4-step skill discovery process with a concise instruction: "Use the standard `activate_skill` tool if specialized instructions (e.g., Security, Testing) are needed for this task."

### Phase 3: Agent Protocol Alignment

- [ ] **Task 3.1:** Update `agents/orchestrator.md` to remove manual skill mapping logic.
- [ ] **Task 3.2:** Update `agents/planner.md` and `agents/scout.md` to prioritize native tool use.

### Phase 4: Skill Metadata Optimization

- [ ] **Task 4.1:** Review and refine the `description` field in all 7 `skills/*/SKILL.md` files to ensure they serve as clear "semantic triggers" for the native mechanism.

## 3. Coder Instructions

- **Surgical Edits:** Use `replace` for `commands/*.toml` to remove exactly the `SKILL ACTIVATION` block.
- **Consistency:** Ensure the "New Flow" instructions are identical across all command files.
- **Testing:** Since `activate_skill` is a built-in platform tool, verification should focus on ensuring the extension doesn't crash after tool removal and that command prompts are valid.

## 4. Review & Refine

### 🧩 Skill Insights

#### 🎟️ Requirement Alignment Report
1. **AC Checklist**:
    - [x] Leverage Gemini CLI native mechanism (Met)
    - [x] Remove custom `kit_get_skill_list` (Met)
    - [x] Reduce token expansion/conflictness (Met)
2. **Logic Audit**: The plan correctly identifies the redundancy between the custom implementation and the platform's native features. By removing the custom layer, we reduce context overhead and align with project standards.
3. **Verdict**: Proceed.

**Wait for User Input:** _Please review the proposed plan above. It will simplify the agent loop significantly. Are there any steps you would like to add, modify, or improve? Let me know, or type "Approve" to proceed with implementation._
