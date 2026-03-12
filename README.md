# 🚀 Gemini-Kit

<div align="center">

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/nth5693/gemini-kit/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-291%20passed-brightgreen.svg)]()
[![Agents](https://img.shields.io/badge/AI%20Agents-8-purple.svg)]()
[![Skills](https://img.shields.io/badge/Skills-9-orange.svg)]()
[![Commands](https://img.shields.io/badge/Commands-23-yellow.svg)]()
[![Workflows](https://img.shields.io/badge/Workflows-33-cyan.svg)]()

### 🎯 Transform Your Terminal into an AI Engineering Team

**Gemini-Kit** is an extension for [Gemini CLI](https://github.com/google-gemini/gemini-cli) that brings **8 specialized AI agents**, **23 commands**, and **33 workflows** to help you code 10x faster.

[🚀 Quick Start](#-quick-start) • [🤖 Agents](#-agents) • [🛠️ Skills](#️-skills) • [⌨️ Commands](#️-commands) • [📚 API](docs/API.md)

</div>

---

## 📋 Table of Contents

- [What is Gemini-Kit?](#-what-is-gemini-kit)
- [Quick Start](#-quick-start)
- [Agents](#-agents)
- [Skills](#️-skills)
- [Commands](#️-commands)
- [MCP Tools](#-mcp-tools)
- [Security](#-security)
- [FAQ](#-faq)

---

## 🤔 What is Gemini-Kit?

**Gemini-Kit** transforms Gemini CLI into a **virtual engineering team** with:

| Feature          | Count | Description                                                |
| ---------------- | ----- | ---------------------------------------------------------- |
| 🤖 **AI Agents** | 8     | Specialized roles (Scout, Planner, Coder, Reviewer...)     |
| 🛠️ **Skills**    | 9     | Knowledge modules (React, Security, Testing...)            |
| ⌨️ **Commands**  | 23    | Slash commands for every workflow                          |
| 🔄 **Workflows** | 33    | Structured development workflows                           |
| 🔒 **Security**  | 30+   | Secret detection patterns                                  |
| 📜 **Scripts**   | 50+   | Automation scripts                                         |

### Key Features

- **🔄 Compound System**: `/explore → /plan → /work → /review → /compound` - Each iteration builds a Knowledge Base. Solutions are saved and reused!
- **🧠 Learning System**: AI learns from your feedback. Correct once, it remembers forever
- **📚 23 Critical Patterns**: Common mistakes documented as patterns - AI reads them before coding
- **🎯 Multi-agent Orchestration**: Orchestrator coordinates multiple agents for complex tasks
- **💾 Auto-checkpoint**: Automatic Git backup before changes
- **🔒 Security Hooks**: Real-time blocking of secrets (30+ patterns)
- **📢 Notifications**: Discord & Telegram integration

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Check              |
| ----------- | ------- | ------------------ |
| Node.js     | ≥ 18.0  | `node --version`   |
| Git         | ≥ 2.0   | `git --version`    |
| Gemini CLI  | Latest  | `gemini --version` |

### Installation (2 minutes)

```bash
# 1. Clone repository
git clone https://github.com/hanh-nd/gemini-kit.git

# 2. Install & build
cd /path/to/gemini-kit
npm install && npm run build

# 3. Link extension
gemini extensions link $(pwd)
```

### First Run

```bash
# Go to your project
cd /path/to/your/project

# Start Gemini CLI
gemini

# Try these commands:
> /status           # Check project status
> /explore React    # Research a topic
> /plan Add auth    # Create implementation plan
```

### Update

```bash
cd ~/.gemini/extensions/gemini-kit
git pull && npm install && npm run build
```

---

## 🤖 Agents

### 27 Specialized AI Agents

| Agent           | Role                  | When to Use              |
| --------------- | --------------------- | ------------------------ |
| 📋 **Planner**  | Create detailed plans | Starting new features    |
| 🔍 **Scout**    | Explore codebase      | New projects, onboarding |
| 💻 **Coder**    | Write clean code      | Implementing features    |
| 👀 **Reviewer** | Code review           | Before merging PRs       |
| 🧠 **Orchestrator** | Multi-agent coordination | Complex multi-step tasks |
| 🐛 **Debugger** | Root cause analysis   | Runtime errors and bugs |
| 🔬 **Researcher** | Deep search & research | Technology decisions    |
| 💡 **Brainstormer** | Strategic ideation  | Problem solving & design |

### How to Use Agents

```bash
# Mention agent in your request
> Use the security-auditor agent to review authentication
> Use the frontend-specialist to optimize React components
> Use the backend-specialist to design API architecture
```

---

## 🛠️ Skills

### 9 Specialized Skills

| Skill | Description |
|-------|-------------|
| **Backend Architecture** | System design and API patterns |
| **Brainstorming** | Strategic ideation and trade-off analysis |
| **Code Fixing** | Targeted bug resolution and debugging |
| **Code Review** | Quality assurance and security audits |
| **Requirement Alignment** | Ensuring code matches business specs |
| **Agent Routing** | Logic for selecting the best agent for a task |
| **Security** | OWASP principles and secret detection |
| **Session Resume** | Context recovery and state management |
| **Unit Testing** | Test generation and verification |

---

## ⌨️ Commands

### 🔄 Orchestration & Workflow

| Command | Description | Example |
|---------|-------------|---------|
| `/cook` | Full dev cycle (plan→code→test→review) | `/cook Add login feature` |
| `/team` | AI Team Orchestration | `/team start "Add auth"` |
| `/ticket`| Ticket-driven orchestration | `/ticket ABC-123` |
| `/do` | Quick task execution | `/do Fix UI bug` |

### 🛠️ Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/plan` | Create implementation plan | `/plan Add user authentication` |
| `/code` | Write code for a task | `/code Create UserService class` |
| `/fix` | Quick fix for errors | `/fix ESLint errors` |
| `/debug`| Diagnose and fix bugs | `/debug Why API returns 500?` |
| `/review-pr` | Automated PR Review | `/review-pr 123` |
| `/scout` | Explore codebase structure | `/scout src/services` |
| `/status` | Project status & health | `/status` |

### 🔍 Discovery & Tools

| Command | Description | Example |
|---------|-------------|---------|
| `/brainstorm` | Strategic ideation | `/brainstorm Auth patterns` |
| `/watzup` | Quick status check | `/watzup` |
| `/session`| Save and load work sessions | `/session save` |
| `/skill` | Create/manage specialized skills | `/skill create MongoDB` |
| `/mcp` | MCP tool operations | `/mcp screenshot` |
| `/screenshot` | Visual debugging | `/screenshot` |
| `/video` | Video analysis to code | `/video` |

### ⚙️ Setup & Help

| Command | Description | Example |
|---------|-------------|---------|
| `/kit-setup` | Initialize project context | `/kit-setup` |
| `/workflow` | View workflow guides | `/workflow cook` |
| `/orchestration` | View protocols | `/orchestration` |
| `/help` | Show help information | `/help` |

### ⚡ Workflows (via `/workflow` command)

> **Note**: These are workflow guides in `.agent/workflows/`. Run them using `/workflow [name]` or just type the workflow name as a prompt.

| Workflow          | Description                         |
| ----------------- | ----------------------------------- |
| `explore`         | Deep research before planning       |
| `plan-compound`   | Create plan with solution search    |
| `work`            | Execute plan step by step           |
| `review-compound` | Multi-pass code review              |
| `compound`        | Document solution for reuse         |
| `housekeeping`    | Cleanup before git push             |
| `specs`           | Create multi-session specifications |
| `triage`          | Triage review findings              |
| `report-bug`      | Report bugs with reproduction steps |
| `adr`             | Create Architecture Decision Record |
| `changelog`       | Generate changelog from commits     |
| `kit-setup`       | Initialize project context          |


---

## 🔧 MCP Tools

### Core Tools

| Tool                      | Function                        |
| ------------------------- | ------------------------------- |
| `kit_create_checkpoint`   | Git checkpoint before changes   |
| `kit_restore_checkpoint`  | Rollback to checkpoint          |
| `kit_get_project_context` | Get project information         |
| `kit_handoff_agent`       | Transfer context between agents |

### Knowledge Tools

| Tool                 | Function                      |
| -------------------- | ----------------------------- |
| `kit_save_learning`  | Save feedback for AI learning |
| `kit_get_learnings`  | Get saved learnings           |
| `kit_index_codebase` | Index codebase for search     |
| `kit_keyword_search` | Search in codebase            |

### Integration Tools

| Tool                      | Function                 |
| ------------------------- | ------------------------ |
| `kit_github_create_pr`    | Create GitHub PR         |
| `kit_github_get_pr`       | Get GitHub PR details    |
| `kit_github_get_issue`    | Get GitHub issue details |
| `kit_bitbucket_get_pr`    | Get Bitbucket PR details |
| `kit_bitbucket_create_pr` | Create Bitbucket PR      |
| `kit_jira_get_ticket`     | Get Jira ticket info     |

> **Note**: PR and Ticket commands require corresponding CLI tools:
> - **GitHub**: Install `gh` (`brew install gh`) and run `gh auth login`.
> - **Bitbucket**: Install `bkt` (`brew install avivsinai/tap/bitbucket-cli`) and run `bkt auth login`.
> - **Jira**: Install `acli` ([Instructions](https://developer.atlassian.com/cloud/acli/guides/how-to-get-started/)) and run `acli jira auth login --web`.

---

## 🔒 Security

### Secret Detection (30+ patterns)

Real-time blocking BEFORE AI writes code:

| Category      | Patterns                                      |
| ------------- | --------------------------------------------- |
| Cloud         | AWS Access Keys, AWS Secrets                  |
| Code Hosting  | GitHub PAT, GitLab Tokens, npm tokens         |
| AI Providers  | OpenAI, Anthropic, Google API Keys            |
| Auth          | Bearer tokens, JWT secrets                    |
| Keys          | RSA, SSH, EC Private Keys                     |
| Database      | MongoDB, PostgreSQL, MySQL connection strings |
| Communication | Slack tokens, webhooks                        |

### Command Blocking

- 🚫 `rm -rf /`, `rm -rf ~`, `rm -rf *`
- 🚫 Fork bombs (`:(){:|:&};:`)
- 🚫 Pipe to shell (`curl | sh`, `wget | bash`)
- 🚫 Dangerous disk operations (`dd if=`, `mkfs.`)

### Path Traversal Protection

- 🚫 `../` path traversal
- 🚫 `/etc/passwd`, `/etc/shadow`
- 🚫 `~/.ssh/` files
- 🚫 `.env`, `.pem`, `.key` files

---

## 📢 Notifications

| Integration          | Description                |
| -------------------- | -------------------------- |
| 💬 **Discord**       | Webhook notifications      |
| ✉️ **Telegram**      | Bot notifications          |
| 🔔 **Session Hooks** | Before/After agent actions |

---

## ❓ FAQ

### Is Gemini-Kit free?

✅ **Yes**, completely free and open source (MIT License).

### Do I need an API key?

Configure **Gemini CLI** with your Google account. No separate API key needed.

### Which languages are supported?

✅ TypeScript, JavaScript, Python, Go, Rust, Java, C++, and more.

### Which OS is supported?

✅ macOS, Linux, Windows (WSL recommended)

---

## 📊 Stats (v4.0.0)

| Metric    | Value         |
| --------- | ------------- |
| Tests     | 291 passing   |
| Lint      | 0 errors      |
| Agents    | 8             |
| Skills    | 9 categories  |
| Commands  | 23            |
| Workflows | 33            |
| Scripts   | 50+           |
| Coverage  | ~81%          |

---

## 🤝 Contributing

Contributions welcome!

1. Fork the repo
2. Create branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Create Pull Request

---

## 📄 License

MIT © 2024-2026

---

<p align="center">
  Made with ❤️ by the Gemini-Kit Team<br>
  <a href="https://github.com/nth5693/gemini-kit">GitHub</a> •
  <a href="https://github.com/nth5693/gemini-kit/releases">Releases</a> •
  <a href="https://github.com/nth5693/gemini-kit/issues">Issues</a>
</p>
