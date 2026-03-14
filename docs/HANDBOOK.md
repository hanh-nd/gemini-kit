# 📚 Gemini-Kit Handbook

> **Sổ tay tham chiếu nhanh** cho Gemini-Kit v4.0  
> 15 Agents | 10 Core Workflows | 8 Skills | 16 Commands

---

## 🚀 Quick Start (30 giây)

```bash
# 5 lệnh dùng nhiều nhất
/status           # Kiểm tra project
/scout [topic]    # Nghiên cứu codebase
/plan [task]      # Lập kế hoạch chi tiết
/code [task]      # Thực thi code
/review-pr [id]   # Review pull request
```

### Workflow cơ bản

```
/scout → /plan → /code → /test → /review → /housekeeping
   ↓        ↓        ↓        ↓         ↓            ↓
Explore  Planning  Execute   Verify   Audit       Cleanup
```

---

## 📋 Command Cheatsheet

### Development

| Command | Mô tả | Ví dụ |
|---------|-------|-------|
| `/code` | Viết code | `/code Create UserService` |
| `/cook` | Full cycle (plan→scout→code→test→review) | `/cook Add login` |
| `/debug` | Debug issues | `/debug API returns 500` |
| `/fix` | Quick fix | `/fix ESLint errors` |
| `/plan` | Lập kế hoạch | `/plan Auth module` |

### Documentation

| Command | Mô tả | Ví dụ |
|---------|-------|-------|
| `/scout` | Explore codebase | `/scout src/` |
| `/brainstorm` | Brainstorm ideas | `/brainstorm Auth approaches` |
| `/help` | Trợ giúp lệnh | `/help plan` |

### Session & Status

| Command | Mô tả | Ví dụ |
|---------|-------|-------|
| `/status` | Project status | `/status` |
| `/session` | Quản lý session | `/session save` |
| `/ticket` | Xử lý Jira ticket | `/ticket PROJ-123` |
| `/kit-setup` | Setup project | `/kit-setup` |

---

## 🤖 Agent Menu (15 Agents)

### Core Development

| Agent | Chuyên môn | Khi nào dùng |
|-------|------------|--------------|
| 📋 `planner` | Lập kế hoạch | Bắt đầu feature mới |
| 🔍 `scout` | Khám phá codebase | Tìm hiểu code existing |
| 💻 `coder` | Viết code | Implement features |
| 🧪 `tester` | Testing | Viết unit/integration tests |
| 👀 `reviewer` | Code review | Review trước merge |
| 🐛 `debugger` | Root cause analysis | Debug lỗi phức tạp |
| 🛠️ `fixer` | Code fixing | Thực thi bug fixes |

### Strategy & Architecture

| Agent | Chuyên môn | Khi nào dùng |
|-------|------------|--------------|
| 🎯 `orchestrator` | Điều phối agents | Phân tích ticket phức tạp |
| 💡 `brainstormer` | Ý tưởng & thiết kế | Giai đoạn ideation |
| 🔬 `researcher` | Nghiên cứu tech | Tìm giải pháp mới |
| 🏗️ `architect` | System design | Thiết kế hệ thống |

---

## 🔄 Workflow Decision Tree

```
Bạn muốn làm gì?
│
├── 🆕 Bắt đầu feature mới
│   └── /scout → /plan → /code → /review
│
├── 🐛 Fix bug
│   └── /debug → /fix → /test
│
├── 📦 Commit & Push
│   └── /housekeeping → git push
│
└── 🔍 Research trước khi decide
    └── /brainstorm
```

### Workflow chi tiết

| Workflow | Mục đích |
|----------|----------|
| `cook` | Full development cycle: Plan → Scout → Code → Test → Review |
| `quickfix` | Quick bug fix: Debug → Code → Test |
| `feature` | New feature: Design → Plan → Code → Test → Docs |
| `review` | Code review: Scout → Review → Security |
| `refactor` | Refactoring: Scout → Plan → Code → Test → Review |
| `tdd` | TDD: Write tests first, then implement |
| `docs` | Documentation: Scout → Analyze → Write → Review |

---

## 🛠️ Skills Reference (8 Skills)

| Skill | Nội dung |
|-------|----------|
| `session-resume` | Khôi phục context session cũ |
| `code-review` | Review checklist, patterns |
| `code-fix` | 4-phase debugging methodology |
| `unit-test` | Vitest, MSW, snapshot |
| `backend-architect` | API design, DB schema |
| `brainstorming` | Strategic ideation |
| `requirements-alignment` | Audit implementation vs AC |
| `security` | OWASP Top 10, auditing |

---

## 📜 Scripts Quick Reference

### Health & Metrics

| Script | Mục đích | Cách dùng |
|--------|----------|-----------|
| `compound-dashboard.sh` | System health check | `./scripts/compound-dashboard.sh` |
| `compound-metrics.sh` | Metrics report | `./scripts/compound-metrics.sh` |
| `compound-search.sh` | Search solutions | `./scripts/compound-search.sh "keyword"` |

### Maintenance

| Script | Mục đích | Cách dùng |
|--------|----------|-----------|
| `validate-folder-docs.sh` | Validate docs | `./scripts/validate-folder-docs.sh` |
| `audit-solution-freshness.sh` | Check stale solutions | `./scripts/audit-solution-freshness.sh` |
| `update-solution-ref.sh` | Update solution refs | `./scripts/update-solution-ref.sh <path>` |

### Utilities

| Script | Mục đích | Cách dùng |
|--------|----------|-----------|
| `create-todo.sh` | Create todo file | `./scripts/create-todo.sh p2 "desc"` |
| `generate-changelog.js` | Generate changelog | `node scripts/generate-changelog.js` |
| `next-todo-id.sh` | Generate ID cho todo | `./scripts/next-todo-id.sh` |

---

## 🔧 MCP Tools

### Core

| Tool | Function |
|------|----------|
| `kit_create_checkpoint` | Tạo checkpoint trước khi sửa |
| `kit_restore_checkpoint` | Rollback về checkpoint |
| `kit_get_project_context` | Lấy thông tin project |
| `kit_handoff_agent` | Chuyển context giữa agents |

### Knowledge

| Tool | Function |
|------|----------|
| `kit_save_learning` | Lưu feedback để AI học |
| `kit_get_learnings` | Đọc learnings đã lưu |
| `kit_index_codebase` | Index codebase cho search |
| `kit_keyword_search` | Search trong codebase |

---

## 📊 Stats (v4.0.0)

| Metric | Value |
|--------|-------|
| Agents | 15 |
| Workflows | 10 |
| Skills | 8 |
| Commands | 16 |
| Scripts | 30+ |

---

> **Tip**: Dùng `Ctrl+F` để search nhanh trong file này!
