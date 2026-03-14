# 🗺️ Scout Report: Unused Scripts Discovery

## 1. Landscape Overview

- **Tech Stack:** TypeScript (Node.js MCP Server), Bash Automation Scripts.
- **Relevant Files:** 47 scripts in `scripts/`, 10 scripts in `scripts/validators/`.
- **Project Name:** gemini-kit

## 2. Categorized Findings

### 🏗️ Core Automation (Used)
These scripts are actively integrated into the `pre-push-housekeeping.sh` or `compound-dashboard.sh` workflows.
- `archive-completed.sh`, `audit-solution-freshness.sh`, `audit-state-drift.sh`, `bootstrap-folder-docs.sh`, `check-deprecated-adrs.sh`, `cleanup-redundancy.sh`, `compound-dashboard.sh`, `compound-health.sh`, `compound-metrics.sh`, `compound-search.sh`, `discover-undocumented-folders.sh`, `git-hygiene.sh`, `log-skill.sh`, `next-todo-id.sh`, `pre-push-housekeeping.sh`, `rotate-logs.sh`, `score-todo.sh`, `suggest-skills.sh`, `sync-spec.sh`, `update-solution-ref.sh`, `update-spec-phase.sh`, `validate-changelog.sh`, `validate-codebase-map.sh`, `validate-compound.sh`, `validate-docs.sh`, `validate-folder-docs.sh`, `validate-patterns.sh`, `validate-prerequisites.sh`, `validate-spec-consistency.sh`, `validate-todo-consistency.sh`.

### 🗑️ Unused Scripts (No References Found)
These scripts are not called by any other script, command, or codebase logic.
- `backfill-solution-metrics.sh`: Historical data processing (documented but uncalled).
- `check-docs-freshness.sh`: Doc validation (documented but uncalled).
- `complete-plan.sh`: Atomic plan completion (documented but uncalled).
- `complete-todo.sh`: Atomic todo completion (documented but uncalled).
- `consolidate-imports.sh`: Leftover from another project (refers to non-existent `app` directory).
- `debug-scores.sh`: Debug utility (documented but uncalled).
- `done-todo.sh`: Alternative to `complete-todo.sh` (uncalled).
- `integrate-housekeeping-system.sh`: Setup utility (documented but uncalled).
- `log-workflow.sh`: Telemetry (documented but uncalled).
- `next-adr-id.sh`: ADR utility (uncalled).
- `normalize-todo-status.sh`: Maintenance utility (documented but uncalled).
- `push-env.sh`: Deployment utility (documented but uncalled).
- `score-solution.sh`: Scoring utility (documented but uncalled).
- `start-todo.sh`: Lifecycle utility (documented but uncalled).
- `status-dashboard.sh`: Metrics dashboard (documented but uncalled).
- `validate-architecture.sh`: Doc integrity (documented but uncalled).

### 🔄 Redundant Wrappers (scripts/validators/)
All scripts in this directory appear to be unused delegators/wrappers that are not integrated into the main workflows.
- `changelog.sh`, `codebase-map.sh`, `compound.sh`, `folder-docs.sh`, `freshness.sh`, `patterns.sh`, `specs.sh`, `todos.sh`, `undocumented.sh`.

## 3. Integration Points

- `pre-push-housekeeping.sh` --(calls)--> `validate-docs.sh`, `archive-completed.sh`, etc.
- `compound-dashboard.sh` --(calls)--> `audit-solution-freshness.sh`, `compound-metrics.sh`.
- `create-todo.sh` --(calls)--> `next-todo-id.sh`.
- `validate-compound.sh` --(calls)--> `validate-patterns.sh`.

## 4. Planner Context

To start planning based on this scout, run:
`/plan @tmp/scout/scout-unused-scripts-discovery.md`
