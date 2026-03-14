# 📋 Programming Blueprint: Remove Unused Scripts

## 1. Technical Design

- **Data/Type Definitions:** N/A (Cleanup task).
- **State/Logic Flow:** The task involves deleting all script files identified as "Unused" in the scout report and updating `scripts/README.md` to reflect the reduced set of automation tools.
- **Component/Architecture Tree:** 
    - Delete files from `scripts/`
    - Delete sub-directories `scripts/lib/` and `scripts/validators/` (as all scripts inside them are unused by the definition)
    - Update `scripts/README.md`

## 2. Implementation Plan

### Phase 1: Script Removal

- [ ] **Task 1.1:** Delete all top-level unused scripts from `scripts/`:
    - `scripts/compound-search.sh`
    - `scripts/validate-spec-consistency.sh`
    - `scripts/update-solution-ref.sh`
    - `scripts/create-todo.sh`
    - `scripts/rotate-logs.sh`
    - `scripts/suggest-skills.sh`
    - `scripts/next-todo-id.sh`
    - `scripts/validate-compound.sh`
    - `scripts/compound-metrics.sh`
    - `scripts/validate-todo-consistency.sh`
    - `scripts/validate-codebase-map.sh`
    - `scripts/sync-spec.sh`
    - `scripts/discover-undocumented-folders.sh`
    - `scripts/validate-docs.sh`
    - `scripts/validate-folder-docs.sh`
    - `scripts/update-spec-phase.sh`
    - `scripts/validate-prerequisites.sh`
    - `scripts/validate-changelog.sh`
    - `scripts/audit-state-drift.sh`
    - `scripts/git-hygiene.sh`
    - `scripts/bootstrap-folder-docs.sh`
    - `scripts/audit-solution-freshness.sh`
    - `scripts/check-deprecated-adrs.sh`
    - `scripts/pre-push-housekeeping.sh`
    - `scripts/validate-patterns.sh`
    - `scripts/archive-completed.sh`
    - `scripts/score-todo.sh`
    - `scripts/compound-health.sh`
    - `scripts/cleanup-redundancy.sh`
- [ ] **Task 1.2:** Delete `scripts/lib/` directory.
- [ ] **Task 1.3:** Delete `scripts/validators/` directory.

### Phase 2: Documentation Update

- [ ] **Task 2.1:** Update `scripts/README.md` to remove all references to the deleted scripts and update the component counts.

## 3. Coder Instructions

- Use `rm` for file removal and `rm -rf` for directories.
- Ensure only `scripts/log-skill.sh` and `scripts/compound-dashboard.sh` remain in the `scripts/` directory (plus documentation/config files).
- Match the style of `scripts/README.md` when updating.

## 4. Review & Refine

**Wait for User Input:** _Please review the proposed plan. Note that following the strict definition, almost all scripts (including pre-push-housekeeping.sh) will be removed as they are not referenced in the specified folders. Proceed?_

## 5. Execution Handoff

Next step:
/cook @tmp/plans/plan-remove-unused-scripts.md
