# 🗺️ Scout Report: Documentation Update After Massive Removal

## 1. Landscape Overview

- **Tech Stack:** TypeScript (MCP), Markdown.
- **Relevant Files:** `README.md`, `QUICKSTART.md`, `GEMINI.md`, `SECURITY.md`, `src/README.md`, `commands/README.md`, `skills/brainstorming/SKILL.md`.

## 2. Categorized Findings

### 🏗️ Broken Documentation (Entry Points)

These files contain dead links to deleted `docs/` and `scripts/` directories, or refer to removed agents/commands/workflows.

- `README.md`:
    - Links to `docs/API.md`, `docs/README.md`, `docs/HANDBOOK.md`, `docs/FEATURES.md`, `docs/BEST-PRACTICES.md` (all deleted).
    - Outdated stats: "10 workflows" (0 left), "Skills: 8" (actually 7 left as `session-resume` is gone).
    - Mentions "Compound System" which heavily relied on deleted scripts.
    - Command table includes `/status` (not in `commands/`), `/ticket` (not in `commands/`? wait, let me double check).
- `QUICKSTART.md`:
    - Heavily outdated: mentions 19 agents, 33+ commands, 15 skills.
    - Describes "Compound Loop" which is broken (scripts gone).
    - Mentions `/status`, `/explore`, `/work`, `/review`, `/compound`, `/housekeeping` (all gone).
- `GEMINI.md`:
    - Mentions `session-resume` skill (deleted).
    - Mentions `scripts/compound-search.sh` (deleted).
- `src/README.md`:
    - Mentions `checkpoint.ts`, `learning.ts` (deleted/renamed).
    - Mentions `kit_get_learnings` (deleted).
- `SECURITY.md`:
    - Mentions `/code-preview` command (deleted).

### 🏗️ Code/Skill References

- `skills/brainstorming/SKILL.md`: Mentions `docs/` (deleted).
- `eslint.config.js`: Ignores `scripts/` (deleted).

## 3. Integration Points

- Root `README.md` is the primary entry point and is most severely broken.
- `GEMINI.md` is the agent instruction hub and contains broken workflow/skill references.

## 4. Planner Context

To start planning based on this scout, run:
`/plan @tmp/scout/scout-documentation-update.md`
