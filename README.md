# 🚀 Gemini-Kit

<div align="center">

[![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)](https://github.com/nth5693/gemini-kit/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-291%20passed-brightgreen.svg)]()
[![Agents](https://img.shields.io/badge/AI%20Agents-8-purple.svg)]()
[![Skills](https://img.shields.io/badge/Skills-7-orange.svg)]()
[![Commands](https://img.shields.io/badge/Commands-15-yellow.svg)]()

### 🎯 Transform Your Terminal into an AI Engineering Team

**Gemini-Kit** is an extension for [Gemini CLI](https://github.com/google-gemini/gemini-cli) that brings **8 specialized AI agents** and **15 commands** to help you code 10x faster.

[🚀 Quick Start](#-quick-start) • [🤖 Agents](#-agents) • [🛠️ Skills](#️-skills) • [⌨️ Commands](#️-commands)

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
| 🛠️ **Skills**    | 7     | Knowledge modules (React, Security, Testing...)            |
| ⌨️ **Commands**  | 15    | Slash commands for every task                              |
| 🔒 **Security**  | 30+   | Secret detection patterns                                  |
| 📜 **Scripts**   | 3     | Core automation scripts                                    |

### Key Features

- **🧠 Learning System**: AI learns from your feedback. Correct once, it remembers forever
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
> /scout src        # Map the terrain
> /plan Add auth    # Create implementation plan
```

---

## 🤖 Agents

Gemini-Kit includes 8 specialized agents. Use `/help` to see full details for each.

| Agent | Purpose |
|-------|---------|
| **Orchestrator** | Master router. Analyzes tickets to select the next agent. |
| **Scout** | Terrain mapper. Explores codebase structure and context. |
| **Planner** | Architect. Creates detailed implementation blueprints. |
| **Coder** | Builder. Writes clean, production-ready code. |
| **Reviewer** | Quality gate. Performs deep-dive technical audits. |
| **Debugger** | Problem solver. Analyzes errors and produces RCA runbooks. |
| **Researcher** | Information gatherer. Finds technical documentation. |
| **Brainstormer** | Strategic thinker. Explores design trade-offs. |

---

## 🛠️ Skills

Modular capabilities that can be activated on-demand:

- `code-review`: Technical audit checklists
- `code-fix`: Minimal-scope bug fixing
- `unit-test`: Test generation and verification
- `backend-architect`: Scalable API and DB design
- `brainstorming`: Requirement validation and strategic design
- `requirements-alignment`: Acceptance Criteria verification
- `security`: Secure coding and secret auditing

---

## ⌨️ Commands

| Command | Purpose |
|---------|---------|
| `/scout` | Explore and map codebase structure |
| `/plan` | Create detailed implementation plans |
| `/code` | Implement features based on a plan |
| `/review-pr` | Review a Pull Request |
| `/debug` | Analyze and diagnose errors |
| `/fix` | Execute targeted bug fixes |
| `/ticket` | Start workflow from a Jira ticket |
| `/brainstorm` | Strategic design trade-offs |

---

## 📊 Stats (v4.0.0)

| Metric    | Value         |
| --------- | ------------- |
| Tests     | 291 passing   |
| Lint      | 0 errors      |
| Agents    | 8             |
| Skills    | 7 categories  |
| Commands  | 15            |
| Scripts   | 3             |
| Coverage  | ~81%          |

---

## 🤝 Contributing

Contributions welcome!

1. Fork the repo
2. Create branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Create Pull Request

---

## 📄 License

MIT © 2024-2026

---

<p align="center">
  Made with ❤️ by the Gemini-Kit Team<br>
  <a href="https://github.com/hanh-nd/gemini-kit">GitHub</a> •
  <a href="https://github.com/hanh-nd/gemini-kit/releases">Releases</a> •
  <a href="https://github.com/hanh-nd/gemini-kit/issues">Issues</a>
</p>
