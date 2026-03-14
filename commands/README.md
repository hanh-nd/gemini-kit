# Slash Commands

This directory contains all **custom slash commands** for the Gemini-Kit extension. Commands are defined as TOML files and automatically loaded by Gemini CLI.

## Available Commands (16)

| Command | File | Description | Status |
|---------|------|-------------|--------|
| `/brainstorm` | `brainstorm.toml` | Strategic design trade-offs | ✅ Active |
| `/code` | `code.toml` | Implement features based on a plan | ✅ Active |
| `/cook` | `cook.toml` | Full development cycle (plan→scout→code→test→review) | ✅ Active |
| `/debug` | `debug.toml` | Analyze and diagnose errors | ✅ Active |
| `/do` | `do.toml` | Unified task router (auto-selects agents) | ✅ Active |
| `/fix` | `fix.toml` | Execute targeted bug fixes | ✅ Active |
| `/help` | `help.toml` | Show all available commands | ✅ Active |
| `/kit-setup` | `kit-setup.toml` | Initialize project context | ✅ Active |
| `/mcp` | `mcp.toml` | MCP tool inspection and help | ✅ Active |
| `/plan` | `plan.toml` | Create detailed implementation blueprints | ✅ Active |
| `/review-pr` | `review-pr.toml` | Review a Pull Request (GitHub/Bitbucket) | ✅ Active |
| `/scout` | `scout.toml` | Explore and map codebase structure | ✅ Active |
| `/session` | `session.toml` | Manage session context | ✅ Active |
| `/skill` | `skill.toml` | Create and manage agent skills | ✅ Active |
| `/ticket` | `ticket.toml` | Orchestrate workflow from a Jira ticket | ✅ Active |
| `/unit-test` | `unit-test.toml` | Generate unit tests for a file | ✅ Active |

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
