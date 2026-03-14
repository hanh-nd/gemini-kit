# 📋 Programming Blueprint: Documentation Update After Massive Removal

## 1. Technical Design

- **Data/Type Definitions:** N/A (Documentation task).
- **State/Logic Flow:** The task involves updating multiple Markdown files and one JavaScript config file to remove dead links and outdated information.
- **Component/Architecture Tree:** 
    - Root: `README.md`, `QUICKSTART.md`, `GEMINI.md`, `SECURITY.md`, `eslint.config.js`
    - src: `src/README.md`
    - commands: `commands/README.md`
    - skills: `skills/brainstorming/SKILL.md`

## 2. Implementation Plan

### Phase 1: Entry Point Cleanup (Foundation)

- [ ] **Task 1.1:** Update root `README.md`:
    - Remove dead links to `docs/*.md` (API.md, README.md, etc.).
    - Update stats: Agents (8), Commands (15), Workflows (0), Skills (7), Scripts (3).
    - Remove "Compound System" section as it relied on deleted scripts.
- [ ] **Task 1.2:** Update `GEMINI.md`:
    - Remove reference to `session-resume` skill.
    - Remove "Search Before Solving" section referencing `compound-search.sh`.

### Phase 2: Guide & Security Updates

- [ ] **Task 2.1:** Rewrite `QUICKSTART.md`:
    - Update stats to match Task 1.1.
    - Remove "The Compound Loop" and "Essential Commands" that are now broken.
    - Simplified "Available Skills" list.
- [ ] **Task 2.2:** Update `SECURITY.md`:
    - Remove reference to `/code-preview` command.

### Phase 3: Sub-directory & Config Cleanup

- [ ] **Task 3.1:** Update `src/README.md`:
    - Update `tools/` details to reflect actual file names and remove deleted tools (`kit_get_learnings`).
- [ ] **Task 3.2:** Update `commands/README.md`:
    - Remove references to deleted/non-existent commands (`/status`, `/screenshot`).
- [ ] **Task 3.3:** Update `skills/brainstorming/SKILL.md`:
    - Remove reference to `docs/` directory.
- [ ] **Task 3.4:** Update `eslint.config.js`:
    - Remove `scripts/**` from `ignores` list.

### Phase 4: Final Validation

- [ ] **Task 4.1:** Verify all internal Markdown links in modified files.
- [ ] **Task 4.2:** Run a final `grep` for any remaining "scripts/" or "docs/" references.

## 3. Coder Instructions

- Perform surgical edits to avoid breaking existing formatting.
- Ensure all numbers (Agents, Skills, etc.) are strictly consistent across all files.
- Use literal strings (`'''`) in TOML files if any prompt updates are needed (though not expected here).

## 4. Review & Refine

**Wait for User Input:** _Please review the proposed plan above. I've updated the stats based on the current directory contents (8 agents, 15 commands, 7 skills, 3 scripts). Does this look correct?_

## 5. Execution Handoff

Next step:
/cook @tmp/plans/plan-documentation-update.md
