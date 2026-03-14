# Compound System Architecture

> **Core Principle**: Each unit of engineering work should make subsequent units of work easier—not harder.

## Overview

The Compound System transforms Gemini-Kit from a session-to-session amnesiac into a learning partner that compounds its capabilities over time.

```
┌─────────────────────────────────────────────────────────────────────┐
│                      COMPOUND SYSTEM FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   🔍 SCOUT          📋 PLAN          ⚙️ CODE          🧪 TEST       │
│   Explore code    Create plan    Implement        Verify           │
│        │               │              │               │             │
│        └───────────────┴──────────────┴───────────────┘             │
│                                │                                    │
│                                ▼                                    │
│                        👀 REVIEW                                    │
│                    Validate & Document                              │
│                                │                                    │
│                                ▼                                    │
│                    ┌───────────────────┐                           │
│                    │  KNOWLEDGE BASE   │◄──────────────────┐       │
│                    │  docs/solutions/  │                   │       │
│                    └───────────────────┘                   │       │
│                                │                           │       │
│                                ▼                           │       │
│                        🧹 HOUSEKEEPING                     │       │
│                      Archive & cleanup                     │       │
│                                │                           │       │
│                                └───────────────────────────┘       │
│                                        (Next session)               │
└─────────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Knowledge Base (`docs/solutions/`)

Persistent storage for solved problems:

```
docs/solutions/
├── schema.yaml              # Validation schema
├── solution-template.md     # Template for new solutions
├── patterns/
│   └── critical-patterns.md # 23 anti-patterns
└── {category}/
    └── {solution}.md        # Individual solutions
```

**Key features:**
- YAML frontmatter for searchability
- Categories mapped to problem types
- Schema validation ensures consistency

### 2. Skills System (`skills/`)

Modular capabilities that agents can invoke:

| Skill | Purpose |
|-------|---------|
| `session-resume` | Restore context at session start |
| `code-review` | Systematic quality gates |
| `code-fix` | Targeted bug resolution |
| `unit-test` | Unified test patterns |
| `requirements-alignment` | Verify implementation vs AC |

### 3. Workflows

10 structured workflows for systematic development:

**Core Loop:**
- `/scout` → Deep investigation
- `/plan` → Create implementation plan
- `/code` → Execute plan
- `/test` → Validate changes
- `/housekeeping` → Archive and cleanup

### 4. Scripts (`scripts/`)

30+ automation scripts:

| Category | Examples |
|----------|----------|
| Search | `compound-search.sh` |
| Health | `compound-dashboard.sh`, `compound-health.sh` |
| Todos | `create-todo.sh`, `next-todo-id.sh` |
| Validation | `validate-*.sh` |
| Metrics | `log-skill.sh` |

### 5. Telemetry (`.agent/metrics/`, `.agent/logs/`)

Track system health and usage:

```
.agent/
├── metrics/
│   ├── compound_history.json  # Health snapshots
│   └── unused_workflows.txt   # Workflow coverage
└── logs/
    ├── compound_usage.log     # Search usage
    └── skill_usage.log        # Skill invocations
```

## The Compound Loop

```
/scout → /plan → /code → /test → /review-pr → /housekeeping → repeat
```

1. **Scout**: Research before deciding
2. **Plan**: Create detailed implementation plan
3. **Code**: Execute the plan systematically
4. **Test**: Verify changes meet criteria
5. **Review**: Final audit and documentation update
6. **Housekeeping**: Archive completed work, maintain clean state

## Integration with Gemini-Kit

### Learning System Bridge

Gemini-Kit's `kit_save_learning` + Compound's Knowledge Base:

| Gemini-Kit | Compound System |
|------------|-----------------|
| `kit_save_learning` | Quick preference capture |
| `docs/solutions/` | Detailed solution documentation |
| Session-scoped | Project-persistent |

### Agent Behaviors

Agents should:
1. **Search before solving**: `./scripts/compound-search.sh`
2. **Check health daily**: `./scripts/compound-dashboard.sh`
3. **Resume context**: Read `skills/session-resume/SKILL.md`

## Health Monitoring

```bash
# Daily quick check
./scripts/compound-dashboard.sh

# Weekly deep check
./scripts/compound-health.sh
```

**Target**: Grade B or higher

## References

- [Critical Patterns](../solutions/patterns/critical-patterns.md)
- [Schema](../solutions/schema.yaml)
- [Scripts README](../../scripts/README.md)
