# 📋 Programming Blueprint: Remove Unused Scripts and Documentation

## 1. Technical Design

- **Data/Type Definitions:** N/A (Cleanup task).
- **State/Logic Flow:** The task involves deleting identified unused scripts and removing all their references from the documentation.
- **Component/Architecture Tree:** 
    - Delete scripts from `scripts/`.
    - Delete redundant wrappers from `scripts/validators/`.
    - Update `scripts/README.md`, `docs/FEATURES.md`, `docs/HANDBOOK.md`, `docs/architecture/compound-system.md`, and `docs/solutions/patterns/critical-patterns.md`.

## 2. Implementation Plan

### Phase 1: Script Removal (Scripts & Validators)

- [ ] **Task 1.1:** Delete top-level unused scripts from `scripts/`:
    - `backfill-solution-metrics.sh`
    - `check-docs-freshness.sh`
    - `complete-plan.sh`
    - `complete-todo.sh`
    - `consolidate-imports.sh`
    - `debug-scores.sh`
    - `done-todo.sh`
    - `integrate-housekeeping-system.sh`
    - `log-workflow.sh`
    - `next-adr-id.sh`
    - `normalize-todo-status.sh`
    - `push-env.sh`
    - `score-solution.sh`
    - `start-todo.sh`
    - `status-dashboard.sh`
    - `validate-architecture.sh`
- [ ] **Task 1.2:** Delete redundant wrappers and directory `scripts/validators/`:
    - `changelog.sh`
    - `codebase-map.sh`
    - `compound.sh`
    - `folder-docs.sh`
    - `freshness.sh`
    - `patterns.sh`
    - `specs.sh`
    - `todos.sh`
    - `undocumented.sh`
    - `README.md`
    - Remove directory `scripts/validators/`.

### Phase 2: Documentation Cleanup (References)

- [ ] **Task 2.1:** Remove references from `scripts/README.md`. Update counts and categories.
- [ ] **Task 2.2:** Remove references from `docs/FEATURES.md`. Update script section.
- [ ] **Task 2.3:** Remove references from `docs/HANDBOOK.md`.
- [ ] **Task 2.4:** Remove references from `docs/architecture/compound-system.md`.
- [ ] **Task 2.5:** Remove references from `docs/solutions/patterns/critical-patterns.md`.

### Phase 3: Verification & Validation

- [ ] **Task 3.1:** Run a codebase-wide grep for any remaining references to the deleted scripts.
- [ ] **Task 3.2:** Run `pre-push-housekeeping.sh` to ensure no regressions.

## 3. Coder Instructions

- Match existing file modification patterns (surgical edits).
- Ensure no broken links remain in documentation.
- Verify that `scripts/README.md` still correctly reflects the "Used" scripts.

## 4. Review & Refine

**Wait for User Input:** _Please review the proposed plan above. Are there any steps you would like to add, modify, or improve? Let me know, or type "Approve" to proceed with coding._
