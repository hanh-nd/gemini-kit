# 🗺️ Scout Report: Documentation Update Discovery

## 1. Landscape Overview

- **Tech Stack:** Markdown (Docs), TOML (Command Definitions).
- **Relevant Files:** `GEMINI.md`, `README.md`, `commands/README.md`, `agents/*.md`, `commands/*.toml`.

## 2. Categorized Findings

### 🏗️ Core Logic / Services (Documentation)

- `GEMINI.md`: Main persona and agent roster for Orchestrator routing. **STATUS: OUTDATED**. Missing 'Tester', 'Researcher'. Incorrect filename for 'Reviewer' (should be `agents/code-reviewer.md`).
- `README.md`: Project overview and high-level stats. **STATUS: OUTDATED**. Stats (8 agents, 15 commands) are incorrect (now 9 agents, 16 commands).
- `commands/README.md`: List of available slash commands. **STATUS: OUTDATED**. Missing `/unit-test`.

### 📂 Agent Definitions (In-sync with codebase)

- `agents/tester.md`: New agent found.
- `agents/researcher.md`: New agent found.
- `agents/code-reviewer.md`: Actual filename for Reviewer.
- `agents/debugger.md`, `agents/coder.md`, etc.: Existing agents.

### 🛠️ Command Configs (In-sync with codebase)

- `commands/unit-test.toml`: New command found.
- `commands/cook.toml`, `commands/do.toml`, etc.: Recently added or updated commands.

## 3. Integration Points

- **Orchestrator** reads `GEMINI.md` to route tasks to specialized agents.
- **User** reads `README.md` and `commands/README.md` for feature discovery.
- **Gemini CLI** loads all `.toml` files in `commands/`.

## 4. Planner Context

To start planning based on this scout, run:
`/plan @tmp/scout/scout-documentation-update.md`
