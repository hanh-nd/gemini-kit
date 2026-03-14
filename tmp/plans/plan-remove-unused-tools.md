# 📋 Programming Blueprint: Remove Unused Tools

## 1. Technical Design

- **Data/Type Definitions:** 
  - No new types.
  - Remove `AgentResult`, `Workflow`, `WorkflowStep` from `src/tools/orchestrator.ts` exports if they become entirely unused (they might be needed for tests).
- **State/Logic Flow:** 
  - Remove tool registrations in `src/kit-server.ts`, `src/tools/core.ts`, `src/tools/git.ts`, `src/tools/integration.ts`, and `src/tools/knowledge.ts`.
  - Delete unused exported functions in `src/tools/orchestrator.ts`, `src/tools/security.ts`, `src/tools/team-state.ts`.
- **Component/Architecture Tree:** 
  - No new components.
  - Simplify `src/tools/` modules by removing dead code.

## 2. Implementation Plan

### Phase 1: Cleanup Core & Git Tools (Foundation)

- [ ] **Task 1.1:** Remove `kit_list_checkpoints` and `kit_auto_rollback` from `src/tools/git.ts`.
- [ ] **Task 1.2:** Remove `kit_get_project_context`, `kit_handoff_agent`, `kit_save_artifact`, and `kit_list_commands` from `src/tools/core.ts`.
- [ ] **Task 1.3:** Remove `findFiles` (synchronous), `detectGitProvider`, and `parseBitbucketRemote` from `src/tools/security.ts`.
- [ ] **Task 1.4:** Remove `flushSession`, `loadSession`, and `getContext` from `src/tools/team-state.ts`.

### Phase 2: Cleanup Orchestration Layer

- [ ] **Task 2.1:** Remove orchestration tools from `src/kit-server.ts`:
  - `kit_team_start`, `kit_team_status`, `kit_team_end`, `kit_run_workflow`, `kit_smart_route`, `kit_list_workflows`, `kit_session_history`, `kit_get_next_step`, `kit_complete_step`.
- [ ] **Task 2.2:** Remove associated logic from `src/tools/orchestrator.ts`:
  - `teamStart`, `teamStatus`, `teamEnd`, `runWorkflow`, `smartRoute`, `listWorkflows`, `listSessions`, `getNextStep`, `advanceStep`, `executeStep`, `getCollaborationPrompt`.
- [ ] **Task 2.3:** Remove `listWorkflows` and `autoSelectWorkflow` from `src/tools/workflows.ts`.

### Phase 3: Cleanup Integration & Knowledge Tools

- [ ] **Task 3.1:** Remove `kit_github_create_pr`, `kit_github_get_issue`, and `kit_bitbucket_create_pr` from `src/tools/integration.ts`.
- [ ] **Task 3.2:** Remove `kit_get_learnings`, `kit_store_diff`, `kit_apply_stored_diff`, `kit_index_codebase`, and `kit_keyword_search` from `src/tools/knowledge.ts`.

### Phase 4: Testing & Verification (Testing Layer)

- [ ] **Task 4.1:** Clean up `src/__tests__/kit-server.test.ts` and `src/__tests__/kit-server-registration.test.ts` by removing tests for deleted tools.
- [ ] **Task 4.2:** Clean up `src/tools/__tests__/` directory.
  - Remove/Update `core.test.ts`, `git.test.ts`, `integration.test.ts`, `knowledge.test.ts`, `orchestrator.test.ts`, `security.test.ts`, `team-state.test.ts`, `workflows.test.ts`.
- [ ] **Task 4.3:** Run `npm run build` to ensure no broken references.
- [ ] **Task 4.4:** Run `npm run test` to ensure remaining tests pass.
- [ ] **Task 4.5:** Run `npm run lint` to cleanup unused imports.

## 3. Coder Instructions

- Match the existing file's indentation and coding style.
- Be thorough with test cleanup; orphaned mocks and variables in test files can cause noise.
- Use `npm run build` frequently to catch broken imports or exports.

## 4. Review & Refine

**Wait for User Input:** _Please review the proposed plan above. Are there any steps you would like to add, modify, or improve? Let me know, or type "Approve" to proceed with coding._

## 5. Execution Handoff

_(Output this command ONLY AFTER the user explicitly approves the plan)_
Next step:
/cook @tmp/plans/plan-remove-unused-tools.md
