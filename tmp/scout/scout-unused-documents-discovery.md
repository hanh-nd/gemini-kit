# 🗺️ Scout Report: Unused Documents Discovery

## 1. Landscape Overview

- **Tech Stack:** Node.js (TypeScript), MCP, Bash Automation.
- **Relevant Files:** 28 documents in `docs/`.

## 2. Categorized Findings

### 🏗️ Core Logic / Services (Used Documents)

These documents are actively referenced in the codebase, other used docs, or required by validation scripts.

- `docs/API.md`: Referenced in root `README.md` and `QUICKSTART.md`.
- `docs/BEST-PRACTICES.md`: Referenced in `docs/specs/user-documentation/00-START-HERE.md`.
- `docs/FEATURES.md`: Referenced in `docs/specs/user-documentation/00-START-HERE.md` and `plan-remove-unused-scripts.md`.
- `docs/WORKFLOWS.md`: Referenced in `docs/BEST-PRACTICES.md` and `docs/specs/user-documentation/00-START-HERE.md`.
- `docs/HANDBOOK.md`: Referenced in `tmp/plans/plan-remove-unused-scripts.md`.
- `docs/architecture/codebase-map.md`: Referenced in `scripts/validators/README.md`.
- `docs/architecture/compound-system.md`: Referenced in `docs/architecture/codebase-map.md` and `docs/README.md`.
- `docs/architecture/README.md`: Required by `scripts/validate-folder-docs.sh`.
- `docs/solutions/patterns/critical-patterns.md`: Extensively referenced in scripts and skills.
- `docs/solutions/schema.yaml`: Referenced in `scripts/audit-solution-freshness.sh` and `docs/FEATURES.md`.
- `docs/solutions/solution-template.md`: Referenced in `docs/FEATURES.md` and `docs/architecture/compound-system.md`.
- `docs/solutions/README.md`: Required by `scripts/validate-folder-docs.sh`.
- `docs/decisions/adr-template.md`: Referenced in `scripts/check-deprecated-adrs.sh`.
- `docs/specs/user-documentation/00-START-HERE.md`: Required for session resume in active spec.
- `docs/specs/user-documentation/01-requirements.md`: Referenced in `docs/specs/user-documentation/README.md`.
- `docs/specs/user-documentation/03-tasks.md`: Extensively referenced in spec automation scripts.
- `docs/specs/user-documentation/README.md`: Required by `scripts/pre-push-housekeeping.sh`.

### 🗑️ Unused Documents (No Active References)

These documents are not mentioned in any active part of the codebase or are only mentioned in other unused documents.

- `docs/README.md`: The central hub is currently not linked from the root `README.md` or any other file.
- `docs/SAFE-MODE.md`: No references found.
- `docs/SECURITY-FEATURES.md`: Only referenced in `docs/SAFE-MODE.md`.
- `docs/explorations/conductor-comparison-20241224.md`: No references found.
- `docs/decisions/README.md`: No references found.
- `docs/specs/README.md`: Only referenced in unused/dead integration documents.
- `docs/solutions/integrations/compound-plugin-integration-20241224.md`: No external references found.
- `docs/explorations/compound-plugin-integration-20241224.md`: Only referenced in `docs/solutions/integrations/compound-plugin-integration-20241224.md`.
- `docs/solutions/exploration-template.md`: Only referenced in unused `docs/solutions/README.md`.
- `docs/specs/templates/spec-template.md`: Only referenced in unused `docs/specs/README.md`.
- `docs/solutions/templates/solution-template.md`: Only referenced in unused `docs/explorations/compound-plugin-integration-20241224.md`.

## 3. Integration Points

- `scripts/validate-folder-docs.sh` --(checks)--> `README.md` in `docs/architecture/` and `docs/solutions/`.
- `scripts/pre-push-housekeeping.sh` --(scans)--> `docs/specs/*/README.md`.
- `docs/SAFE-MODE.md` --(links)--> `docs/SECURITY-FEATURES.md`.

## 4. Planner Context

To start planning based on this scout, run:
`/plan @tmp/scout/scout-unused-documents-discovery.md`
