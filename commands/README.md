# Commands

This directory contains all **custom slash commands** for the Gemini-Kit extension. Commands are defined as TOML files and automatically loaded by Gemini CLI.

## Overview

Commands extend Gemini CLI's capabilities by providing specialized prompts for specific tasks. Each command file follows the TOML format with `description` and `prompt` fields.

## Command Categories

## Command Categories

| Category | Commands | Purpose |
|----------|----------|---------|
| **Orchestration** | `cook`, `team`, `ticket`, `do` | Multi-agent workflows & entry points |
| **Planning** | `plan`, `brainstorm`, `orchestration` | Strategic implementation plans |
| **Coding** | `code`, `fix`, `debug`, `use` | Core development and bug fixing |
| **Review** | `review-pr` | PR analysis & quality assurance |
| **Exploration** | `scout`, `watzup`, `status` | Codebase & project state analysis |
| **Tools** | `mcp`, `skill`, `session` | Integrations & context management |
| **Media** | `screenshot`, `video` | Visual and video analysis |
| **Help** | `help`, `kit-setup`, `workflow` | Guidance and environment setup |

## Components

| Component | Purpose | Status |
|-----------|---------|--------|
| `brainstorm.toml` | High-level trade-off analysis | ✅ Active |
| `code.toml` | Execute coding tasks (Coder Agent) | ✅ Active |
| `cook.toml` | Full development workflow (Auto-Safe) | ✅ Active |
| `debug.toml` | Troubleshoot issues with Skill Routing | ✅ Active |
| `do.toml` | AI Router - Auto Agent Selection | ✅ Active |
| `fix.toml` | Targeted bug fixes | ✅ Active |
| `help.toml` | Help and usage information | ✅ Active |
| `kit-setup.toml` | Project setup wizard | ✅ Active |
| `mcp.toml` | MCP tools management (Browser/Docs) | ✅ Active |
| `orchestration.toml` | View orchestration protocols | ✅ Active |
| `plan.toml` | Create implementation plans | ✅ Active |
| `review-pr.toml` | Automated PR Review | ✅ Active |
| `scout.toml` | Map codebase structure | ✅ Active |
| `screenshot.toml` | Visual debugging via screenshot | ✅ Active |
| `session.toml` | Save and load work sessions | ✅ Active |
| `skill.toml` | Create new specialized AI skills | ✅ Active |
| `status.toml` | Project progress and health | ✅ Active |
| `team.toml` | AI Team Orchestration | ✅ Active |
| `ticket.toml` | Ticket-driven orchestration | ✅ Active |
| `use.toml` | Use specialized AI assistants | ✅ Active |
| `video.toml` | Video analysis to code | ✅ Active |
| `watzup.toml` | Recent activity status check | ✅ Active |
| `workflow.toml` | View primary workflow guide | ✅ Active |

## TOML Structure

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
/review @src/auth/login.ts
```

## Changelog

### 2026-03-13
- Updated command list to reflect current 23 active commands.
- Removed legacy and duplicate commands.
- Categorized commands for better discoverability.

### 2026-01-24
- Fixed TOML parsing failure in `docs.toml` by switching from basic strings (`"""`) to literal strings (`'''`) - Issue #9

---

## References

- [Gemini CLI Commands Documentation](https://ai.google.dev/gemini-api/docs/gemini-cli)
- [TOML Specification](https://toml.io/en/)
