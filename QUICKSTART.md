# 🚀 Quick Start Guide

Get started with Gemini-Kit in 5 minutes!

---

## Prerequisites

- [Gemini CLI](https://github.com/google-gemini/gemini-cli) installed and configured
- Node.js 18+

---

## Installation

### Step 1: Clone & Build (2 min)

```bash
# 1. Clone repository
git clone https://github.com/hanh-nd/gemini-kit.git

# 2. Install & build
cd gemini-kit
npm install && npm run build

# 3. Link extension
gemini extensions link $(pwd)
```

### Step 2: Verify Installation

```bash
# Go to your project
cd /your/project

# Start Gemini CLI
gemini

# Check status
> /help
```

---

## Essential Commands

### Top 10 Commands

| Command               | What it does                       | When to use              |
| --------------------- | ---------------------------------- | ------------------------ |
| `/scout [path]`       | Explore codebase structure         | New projects or features |
| `/plan [description]` | Create implementation plan         | Before coding            |
| `/code [task]`        | Implement features based on a plan | During execution         |
| `/cook [task]`        | Full cycle (plan→code→test→review) | Quick tasks              |
| `/debug [issue]`      | Debug with root cause analysis     | Runtime errors           |
| `/fix [error]`        | Quick fix for specific issues      | Simple bug fixes         |
| `/review-pr [number]` | Review a Pull Request              | Before merging           |
| `/ticket [id]`        | Start workflow from a Jira ticket  | Task-driven work         |
| `/brainstorm [topic]` | Explore design trade-offs          | Strategy phase           |
| `/help`               | Show all available commands        | Anytime                  |

---

## Using Agents

### 8 Specialized Agents

Mention an agent by name to get specialized help:

| Agent            | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| **Orchestrator** | Master router. Analyzes tickets to select the next agent.  |
| **Scout**        | Terrain mapper. Explores codebase structure and context.   |
| **Planner**      | Architect. Creates detailed implementation blueprints.     |
| **Coder**        | Builder. Writes clean, production-ready code.              |
| **Reviewer**     | Quality gate. Performs deep-dive technical audits.         |
| **Debugger**     | Problem solver. Analyzes errors and produces RCA runbooks. |
| **Researcher**   | Information gatherer. Finds technical documentation.       |
| **Brainstormer** | Strategic thinker. Explores design trade-offs.             |

---

## Using Skills

Skills are **loaded automatically** based on your task. No configuration needed.

### Available Skills (7 categories)

- **backend-architect**: Scalable API and DB design
- **brainstorming**: Requirement validation and strategic design
- **code-fix**: Minimal-scope bug fixing
- **code-review**: Technical audit checklists
- **requirements-alignment**: Acceptance Criteria verification
- **security**: Secure coding and secret auditing
- **unit-testing**: Test generation and verification

---

## Need Help?

- Type `/help` in Gemini CLI
- View [README.md](README.md) for full documentation
- View [CHANGELOG.md](CHANGELOG.md) for version history

---

## Stats (v4.0.0)

| Metric   | Value        |
| -------- | ------------ |
| Agents   | 8            |
| Skills   | 7 categories |
| Commands | 15           |
| Tests    | 291 passing  |
