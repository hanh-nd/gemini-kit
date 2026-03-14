# 📋 Programming Blueprint: Remove Unused Documents

## 1. Technical Design

- **Data/Type Definitions:** N/A (Cleanup task).
- **State/Logic Flow:** The task involves deleting identified unused documents and removing dead references from remaining documents.
- **Component/Architecture Tree:**
    - Delete documents from `docs/` and its subdirectories.
    - Update `docs/solutions/README.md` to remove references to deleted templates.
    - Update root `README.md` to link to `docs/README.md` and update stats.
    - Update `docs/README.md` to properly link to sub-READMEs (making them "Used").

## 2. Implementation Plan

### Phase 1: Document Removal

- [ ] **Task 1.1:** Delete unused documents from `docs/`:
    - `docs/SAFE-MODE.md`
    - `docs/SECURITY-FEATURES.md`
- [ ] **Task 1.2:** Delete unused documents from `docs/explorations/`:
    - `docs/explorations/conductor-comparison-20241224.md`
    - `docs/explorations/compound-plugin-integration-20241224.md`
- [ ] **Task 1.3:** Delete unused documents from `docs/solutions/`:
    - `docs/solutions/exploration-template.md`
    - `docs/solutions/integrations/compound-plugin-integration-20241224.md`
- [ ] **Task 1.4:** Delete unused templates:
    - `docs/specs/templates/spec-template.md` (Scout says unused, double check if needed for `/specs` command)
    - `docs/solutions/templates/solution-template.md`
- [ ] **Task 1.5:** Delete `docs/decisions/README.md` (Scout says unused).

### Phase 2: Documentation Cleanup & Integration

- [ ] **Task 2.1:** Update `docs/solutions/README.md`:
    - Remove references to `exploration-template.md`.
    - Remove "integrations" category if empty.
- [ ] **Task 2.2:** Update `docs/README.md`:
    - Ensure it links to `docs/specs/README.md` and `docs/decisions/README.md` (Wait, if I delete `docs/decisions/README.md`, I should remove it here too).
- [ ] **Task 2.3:** Update root `README.md`:
    - Link to `docs/README.md` in the Header and Table of Contents.
    - Update stats section (Agents: 15, Workflows: 10, Skills: 8, Commands: 16, Scripts: 30+).

### Phase 3: Verification

- [ ] **Task 3.1:** Run `grep` to ensure no dead links exist.
- [ ] **Task 3.2:** Run `pre-push-housekeeping.sh` to ensure no regressions.

## 3. Coder Instructions

- Perform surgical edits to remove dead links.
- Maintain consistent Markdown formatting.
- Ensure root `README.md` stats are accurate based on recent script/workflow cleanup.

## 4. Review & Refine

**Wait for User Input:** _Please review the proposed plan above. I've decided to keep `docs/README.md` and `docs/specs/README.md` by linking them properly, as they serve as important entry points. Are there any steps you would like to add, modify, or improve? Let me know, or type "Approve" to proceed with coding._
