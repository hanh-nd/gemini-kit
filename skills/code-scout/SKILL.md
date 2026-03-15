---
name: code-scout
description: |
  Use this skill to analyze codebase overview, module deepdive, data flow, and generate a report.
version: 1.0.0
---

# 🚁 Skill: Codebase Scouting & Synthesis

## 🚦 Mandatory Bootstrapping

You have ingested the raw code files. Before writing the report, you MUST load the specific evaluation constraints based on the user's intent.

Use your file-reading tool to ingest EXACTLY ONE of the following deep-dive directive files:

- **Condition A (Intent is OVERVIEW):**
  Read `skills/code-scout/references/01-overview-strategy.md`
  _(Focuses on tech stack extraction, folder boundaries, and global configs)_

- **Condition B (Intent is MODULE_DEEPDIVE):**
  Read `skills/code-scout/references/02-module-deepdive.md`
  _(Focuses on identifying domain logic, data models, and module-specific services)_

- **Condition C (Intent is DATA_FLOW):**
  Read `skills/code-scout/references/03-dataflow-tracing.md`
  _(Focuses on tracing execution paths from Entry Point -> Controller -> Service -> State/DB, including Alias resolutions)_

Do NOT proceed with the synthesis until you have read the applicable constraint file.
