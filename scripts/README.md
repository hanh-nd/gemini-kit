# Project Scripts

This directory contains automation scripts that power the agent workflows.

## Purpose

Automation scripts for telemetry, health checks, and repository maintenance.

## Components

| Category    | Count | Description                          |
| ----------- | ----- | ------------------------------------ |
| Metrics     | 2     | Instrumentation and health dashboard |
| Maintenance | 1     | Changelog generation                 |

## Metrics & Instrumentation

- **`log-skill.sh`**: Logs skill usage for telemetry. Used by agent skills.

## Maintenance

- **`generate-changelog.js`**: Automatically generates changelog entries from git commits.

## Usage

Most scripts are designed to be run via the agent workflows or automatically by the system.

## Changelog

### 2026-03-14

- Performed major cleanup of unused scripts based on strict usage criteria.
- Removed 41 unused scripts and sub-directories (`lib/`, `validators/`).
- Updated README to reflect the minimal necessary toolset.

### 2026-01-24

- Added Component Details section with tiered script documentation
- Added missing `generate-changelog.js` entry

### 2024-12-24

- Integrated from Antigravity Compound Engineering Plugin
- Added 50+ automation scripts for compound workflows
