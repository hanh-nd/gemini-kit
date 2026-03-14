# 🗺️ Scout Report: Unused Scripts Discovery

## 1. Landscape Overview

- **Tech Stack:** TypeScript (MCP SDK), Bash Automation Scripts.
- **Relevant Files:** 43 `.sh` files found in `scripts/` directory.

## 2. Categorized Findings

### 🏗️ Core Logic / Services (Used Scripts)

These scripts are explicitly mentioned in `@agents/`, `@skills/`, `@commands/`, or `@src/`.

- `scripts/log-skill.sh`: Used in `skills/session-resume/SKILL.md` and `skills/code-review/SKILL.md` for telemetry.
- `scripts/compound-dashboard.sh`: Used in `skills/session-resume/SKILL.md` for health checks.

### 🗑️ Unused Scripts (No References Found)

The following scripts were not found mentioned in any of the specified folders (`agents/`, `skills/`, `commands/`, `src/`) and are thus considered unused by the current definition:

- `scripts/compound-search.sh`: (Note: Mentioned in root `GEMINI.md`, but not in target folders)
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
- `scripts/lib/error_handling.sh`
- `scripts/lib/prerequisite_validation.sh`
- `scripts/lib/integration_wiring.sh`
- `scripts/bootstrap-folder-docs.sh`
- `scripts/validators/changelog.sh`
- `scripts/validators/compound.sh`
- `scripts/validators/folder-docs.sh`
- `scripts/validators/codebase-map.sh`
- `scripts/validators/freshness.sh`
- `scripts/validators/specs.sh`
- `scripts/validators/todos.sh`
- `scripts/validators/patterns.sh`
- `scripts/validators/undocumented.sh`
- `scripts/audit-solution-freshness.sh`
- `scripts/check-deprecated-adrs.sh`
- `scripts/pre-push-housekeeping.sh`
- `scripts/validate-patterns.sh`
- `scripts/archive-completed.sh`
- `scripts/score-todo.sh`
- `scripts/compound-health.sh`
- `scripts/cleanup-redundancy.sh`

## 3. Integration Points

- `skills/session-resume/SKILL.md` --(calls)--> `scripts/log-skill.sh`
- `skills/session-resume/SKILL.md` --(calls)--> `scripts/compound-dashboard.sh`
- `skills/code-review/SKILL.md` --(calls)--> `scripts/log-skill.sh`
- `commands/skill.toml` --(references)--> `validate-webhook.sh` (File does not exist)

## 4. Planner Context

To start planning based on this scout, run:
`/plan @tmp/scout/scout-unused-scripts-discovery.md`
