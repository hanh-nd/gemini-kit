# Architecture Documentation

System architecture documentation for Gemini-Kit.

## Purpose

Document high-level system design, component interactions, and architectural decisions for the Gemini-Kit project. These documents serve as the authoritative source for understanding how the system works.

## Components

| Document | Description | Status |
|----------|-------------|--------|
| [compound-system.md](compound-system.md) | Knowledge compounding and learning system | ✅ Active |

## Component Details

### 🔴 Critical: `compound-system.md`
Documents the Compound Engineering system that enables knowledge persistence across sessions.
- **Purpose**: How learnings, solutions, and patterns are captured and reused
- **Key Concepts**: Solution documents, critical patterns, search-before-solve
- **Related ADRs**: Knowledge base structure decisions

## Adding New Architecture Docs

When documenting significant architectural decisions or systems:

1. Create a new `.md` file in this directory
2. Link to related ADRs in `docs/decisions/`
3. Include diagrams where helpful (Mermaid supported)
4. Update this README with a link

## Related

- **ADRs**: `docs/decisions/` - Architecture Decision Records
- **Patterns**: `docs/solutions/patterns/` - Critical patterns
- **Specs**: `docs/specs/` - Multi-session specifications

## Changelog

### 2026-03-14
- Updated compound system documentation to align with current script and workflow counts

### 2026-01-24
- Added Purpose, Component Details, and Changelog sections

### 2024-12-24
- Initial architecture documentation structure
