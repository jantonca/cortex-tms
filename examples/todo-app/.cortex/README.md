# .cortex Directory

This directory contains Cortex TMS metadata and project-specific AI governance files.

## Purpose

The `.cortex/` directory is a v3.0 feature that provides:

1. **Project Metadata**: Structured information about the project's TMS configuration
2. **AI Context**: Machine-readable context for AI agents
3. **Validation State**: Project health and validation history
4. **Backup Storage**: (In production) Automatic backups before migrations

## Files in This Directory

### `project.json`

Core metadata about this Cortex TMS implementation:

- **Project Identity**: Name, type, version
- **Tech Stack**: Framework, language, dependencies
- **Metrics**: Token counts, cost savings, performance
- **Features**: What this project demonstrates
- **Learning Paths**: Guided onboarding for different skill levels

This file is used by:
- `cortex-tms status` - Display project dashboard
- `cortex-tms validate` - Verify project health
- AI agents - Understand project context quickly

## Why This Matters

Traditional projects scatter metadata across README.md, package.json, and comments. Cortex TMS centralizes AI-relevant metadata in a structured, machine-readable format.

**Benefits**:
- AI agents can read `project.json` in one shot instead of parsing multiple files
- Validation tools have a single source of truth
- Metrics are trackable and comparable across projects
- Learning paths guide developers of all skill levels

## Usage

```bash
# View project metadata
cat .cortex/project.json | jq

# Validate project health
npx cortex-tms validate --strict

# See token analysis
npx cortex-tms status --tokens
```

## Version

This `.cortex/` directory structure is part of **Cortex TMS v3.0.0**.

---

**Note**: This directory is committed to version control for this reference implementation. In production projects, you may choose to gitignore `.cortex/backups/` to avoid committing backup snapshots.

<!-- @cortex-tms-version 3.0.0 -->
