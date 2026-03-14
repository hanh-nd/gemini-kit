# Project Scripts

This directory contains automation scripts that power the agent workflows.

## Purpose

Automation scripts for compound engineering workflows, knowledge management, and repository maintenance.

## Components

| Category | Count | Description |
|----------|-------|-------------|
| Workflow Core | 1 | Pre-push checks |
| Compound System | 5 | Knowledge search, metrics, validation |
| Todo Management | 2 | Create and audit todos |
| Maintenance | 3 | Archive, rotate, and hygiene |
| Metrics | 3 | Instrumentation and scoring |
| Utilities | 5 | Specification and lifecycle |

## Workflow Core

- **`pre-push-housekeeping.sh`**: Master script run before pushes to ensure repo health.

## Knowledge & Compound System

- **`compound-search.sh`**: Context-aware search for existing solutions.
- **`compound-metrics.sh`**: Collects usage metrics for the compound system.
- **`compound-dashboard.sh`**: Displays daily health metrics of the agent system.
- **`validate-compound.sh`**: Validates YAML frontmatter of solution documents.
- **`validate-patterns.sh`**: 🔍 Validates integrity of the critical patterns registry (numerical continuity & links).

## Todo Management

- **`create-todo.sh`**: Standardized creation of todo files.
- **`audit-state-drift.sh`**: Syncs file metadata with content state.

## Maintenance

- **`archive-completed.sh`**: Moves finished work to archive directories.
- **`rotate-logs.sh`**: Manages log file sizes.
- **`git-hygiene.sh`**: Standardizes git history and repository cleanliness.

## Metrics & Instrumentation

- **`log-skill.sh`**: Logs skill usage for telemetry.
- **`score-todo.sh`**: Heuristic scoring for todo verification.
- **`compound-health.sh`**: Weekly deep health validation.
- **`suggest-skills.sh`**: Analyzes usage to suggest new skills.

## Utilities

- **`update-solution-ref.sh`**: Updates solution reference counts.
- **`update-spec-phase.sh`**: Manages specification lifecycles.
- **`sync-spec.sh`**: Synchronizes specification documents.
- **`next-todo-id.sh`**: Generates unique IDs for todos.
- **`bootstrap-folder-docs.sh`**: Scaffolds README documentation for folders.

## Component Details

### 🔴 Critical Scripts

| Script | Purpose | Error Handling |
|--------|---------|----------------|
| `compound-search.sh` | Context-aware solution search | Returns empty if no matches |
| `pre-push-housekeeping.sh` | Pre-push validation | Blocks push on critical errors |
| `create-todo.sh` | Standardized todo creation | Validates priority levels |

### 🟡 Supporting Scripts

| Script | Purpose |
|--------|---------|
| `log-skill.sh` | Skill usage tracking |
| `generate-changelog.js` | Changelog generation from commits |
| `bootstrap-folder-docs.sh` | README scaffolding |
| `discover-undocumented-folders.sh` | Find folders missing docs |
| `validate-folder-docs.sh` | Validate README structure |

### 🟢 Generated/Automated

| Script | Purpose |
|--------|---------|
| `rotate-logs.sh` | Log file management |
| `archive-completed.sh` | Move completed work to archives |

## Usage

Most scripts are designed to be run via the agent workflows (e.g. `/work`, `/housekeeping`), but can be run manually for debugging.

```bash
./scripts/pre-push-housekeeping.sh
```

## Changelog

### 2026-03-14
- Removed 16 unused top-level scripts and `scripts/validators/` directory
- Updated README to reflect current automation suite

### 2026-01-24
- Added Component Details section with tiered script documentation
- Added missing `generate-changelog.js` entry

### 2024-12-24
- Integrated from Antigravity Compound Engineering Plugin
- Added 50+ automation scripts for compound workflows
