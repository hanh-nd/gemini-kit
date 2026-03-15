# Slash Commands

This directory contains all **custom slash commands** for the Gemini-Kit extension. Commands are defined as TOML files and automatically loaded by Gemini CLI.

## Available Commands (14)

| Command | File | Description | Status |
|---------|------|-------------|--------|
| `/scout` | `scout.toml` | Explore and map codebase structure | ✅ Active |
| `/plan` | `plan.toml` | Create detailed implementation plans | ✅ Active |
| `/code` | `code.toml` | Implement features based on a plan | ✅ Active |
| `/review-pr` | `review-pr.toml` | Review a Pull Request in detail | ✅ Active |
| `/review-changes` | `review-changes.toml` | Review local working tree changes | ✅ Active |
| `/git` | `git.toml` | Context-aware Git wrapper & orchestrator | ✅ Active |
| `/brainstorm` | `brainstorm.toml` | Strategic design trade-offs | ✅ Active |
| `/do` | `do.toml` | Auto-orchestrate complex tasks | ✅ Active |
| `/ticket` | `ticket.toml` | Orchestrate workflow from a Jira ticket | ✅ Active |
| `/kit-setup` | `kit-setup.toml` | Initialize Gemini-Kit in a new repo | ✅ Active |
| `/skill` | `skill.toml` | Load specialized expertise | ✅ Active |
| `/session` | `session.toml` | Manage team sessions | ✅ Active |
| `/mcp` | `mcp.toml` | Manage MCP tool configuration | ✅ Active |
| `/help` | `help.toml` | Show help information | ✅ Active |

## Structure

Each command file follows this structure:

```toml
description = "Brief description shown in command list"

prompt = '''
# Command Name

{{args}} - User input passed to the command

## Instructions
...
'''
```

### String Types

- **Basic string** (`"""..."""`): Processes escape sequences
- **Literal string** (`'''...'''`): Raw content, no escape processing (preferred for complex prompts with code blocks)

> [!NOTE]
> Use literal strings (`'''`) when your prompt contains nested markdown code blocks to avoid TOML parsing issues.

## Usage

```bash
# In Gemini CLI
/command-name [arguments]

# Examples
/plan Add user authentication
/code Implement login form
/review-pr 123
```

## Changelog

### 2026-03-14
- Updated command list to reflect current 15 active commands.
- Removed references to deleted and non-existent commands.

### 2026-01-24
- Fixed TOML parsing failure in `docs.toml` by switching from basic strings (`"""`) to literal strings (`'''`) - Issue #9

---

## References

- [Gemini CLI Commands Documentation](https://ai.google.dev/gemini-api/docs/gemini-cli)
- [TOML Specification](https://toml.io/en/)
