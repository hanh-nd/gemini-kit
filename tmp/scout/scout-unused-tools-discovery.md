# 🗺️ Scout Report: Unused Tools Discovery in src/tools/ (Updated)

## 1. Landscape Overview

- **Tech Stack:** Node.js (v20+), TypeScript, Zod, MCP SDK
- **Relevant Files:** 9 files in `src/tools/`

## 2. Categorized Findings

### 🏗️ Unused Kit Commands (Registered Tools)
These are tools registered with the MCP server but not used by any agents, slash commands, or instruction files (excluding documentation like README/CHANGELOG).

- `kit_list_checkpoints` (`src/tools/git.ts`): Lists git checkpoints.
- `kit_auto_rollback` (`src/tools/git.ts`): Automatically rolls back to the last checkpoint.
- `kit_get_project_context` (`src/tools/core.ts`): Gathers project structure and dependencies.
- `kit_handoff_agent` (`src/tools/core.ts`): Passes context between agents.
- `kit_save_artifact` (`src/tools/core.ts`): Saves agent outputs as artifacts.
- `kit_list_commands` (`src/tools/core.ts`): Lists all available slash commands.
- `kit_list_workflows` (`src/kit-server.ts`): Lists predefined workflows.
- `kit_session_history` (`src/kit-server.ts`): Lists past team sessions.
- `kit_smart_route` (`src/kit-server.ts`): Auto-selects workflow based on task.
- `kit_team_end` (`src/kit-server.ts`): Ends current team session.
- `kit_team_start` (`src/kit-server.ts`): Starts a new team session.
- `kit_team_status` (`src/kit-server.ts`): Checks session progress.
- `kit_run_workflow` (`src/kit-server.ts`): Starts a predefined workflow.
- `kit_get_next_step` (`src/kit-server.ts`): Gets next workflow step.
- `kit_complete_step` (`src/kit-server.ts`): Marks step as complete.
- `kit_github_create_pr` (`src/tools/integration.ts`): Creates GitHub PR.
- `kit_github_get_issue` (`src/tools/integration.ts`): Fetches GitHub issue details.
- `kit_get_learnings` (`src/tools/knowledge.ts`): Searches saved learnings.
- `kit_store_diff` (`src/tools/knowledge.ts`): Stores a proposed diff.
- `kit_apply_stored_diff` (`src/tools/knowledge.ts`): Applies a stored diff.
- `kit_index_codebase` (`src/tools/knowledge.ts`): Indexes codebase.
- `kit_keyword_search` (`src/tools/knowledge.ts`): Searches index.

### 🏗️ Unused Exported Functions
These functions are exported from their modules but have no internal or external usage in production code.

- `executeStep` (`src/tools/orchestrator.ts`): Intended for executing a single workflow step.
- `getCollaborationPrompt` (`src/tools/orchestrator.ts`): Generates a prompt for agent collaboration.
- `findFiles` (synchronous) (`src/tools/security.ts`): Synchronous file scanner. Project has migrated to `findFilesAsync`.
- `detectGitProvider` (`src/tools/security.ts`): Detects if the repo is GitHub or Bitbucket.
- `parseBitbucketRemote` (`src/tools/security.ts`): Parses Bitbucket workspace/slug from remote URL.
- `flushSession` (`src/tools/team-state.ts`): Forces immediate save of session state.
- `loadSession` (`src/tools/team-state.ts`): Loads a specific session by ID.
- `getContext` (`src/tools/team-state.ts`): Retrieves a single context value.

## 3. Integration Points

- `GEMINI.md` --(instructs)--> `kit_get_extension_info`, `kit_save_learning`
- `commands/cook.toml` --(uses)--> `kit_create_checkpoint`, `kit_restore_checkpoint`
- `commands/do.toml` --(uses)--> `kit_get_command_prompt`
- `commands/*.toml` --(use)--> `kit_get_skill_list`
- `skills/requirements-alignment/SKILL.md` --(uses)--> `kit_jira_get_ticket`

## 4. Planner Context

To start planning based on this scout, run:
`/plan @tmp/scout/scout-unused-tools-discovery.md`
