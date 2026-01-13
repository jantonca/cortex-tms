# CLI Usage Guide

**Version**: 2.2.0
**Last Updated**: January 2026

The Cortex TMS CLI is a command-line tool for initializing and validating AI-optimized project documentation. This guide covers installation, commands, and configuration.

---

## Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Commands](#commands)
   - [init](#init-command)
   - [validate](#validate-command)
4. [Project Scopes](#project-scopes)
5. [Configuration (.cortexrc)](#configuration)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

---

## Installation

### Using npx (Recommended)

No installation required. Run directly:

```bash
npx cortex-tms init
```

### Global Installation

```bash
npm install -g cortex-tms
# or
pnpm add -g cortex-tms
```

Then use:

```bash
cortex-tms init
```

---

## Quick Start

Initialize TMS in your project:

```bash
cd your-project/
npx cortex-tms init
```

Follow the interactive prompts to:
1. Choose your project scope (Nano/Standard/Enterprise)
2. Set your project name
3. Confirm file copying

Validate your TMS setup:

```bash
npx cortex-tms validate
```

---

## Commands

### `init` Command

Initialize Cortex TMS documentation structure in your project.

#### Usage

```bash
cortex-tms init [options]
```

#### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--force` | `-f` | Skip confirmation prompts and overwrite existing files |
| `--minimal` | `-m` | Install minimal template set only (equivalent to Nano scope) |
| `--verbose` | `-v` | Show detailed output during initialization |
| `--dry-run` | | Preview changes without writing files (safe mode) |
| `--scope <type>` | | Set project scope non-interactively: `nano`, `standard`, or `enterprise` |

#### Interactive Prompts

When run without `--force`, the CLI will ask:

1. **Project Name**: Used for placeholder replacement
   - Example: "My Awesome Project" → `my-awesome-project` in files

2. **Project Scope**: Determines which templates are copied
   - **Nano**: 2 files (scripts, small tools)
   - **Standard**: 9 files (most products) - Recommended
   - **Enterprise**: 11 files (large repositories)

3. **Overwrite Confirmation**: If existing TMS files are detected

#### What Gets Created

All scopes create:
- `NEXT-TASKS.md` - Active sprint tracker
- `CLAUDE.md` - Agent workflow rules
- `.cortexrc` - Project configuration

Standard/Enterprise add:
- `.github/copilot-instructions.md` - GitHub Copilot rules
- `FUTURE-ENHANCEMENTS.md` - Backlog
- `docs/core/ARCHITECTURE.md` - System design
- `docs/core/PATTERNS.md` - Code patterns
- `docs/core/DOMAIN-LOGIC.md` - Business rules
- `docs/core/DECISIONS.md` - Architecture decisions
- `docs/core/TROUBLESHOOTING.md` - Common issues

Enterprise additionally adds:
- `docs/core/GLOSSARY.md` - Project terminology
- `docs/core/SCHEMA.md` - Data models

#### Examples

**Greenfield Project (Interactive)**
```bash
cd my-new-app/
npx cortex-tms init
# Select "Standard" scope
# Enter project name
# Confirm
```

**Brownfield Project (Force Mode)**
```bash
cd existing-project/
npx cortex-tms init --force --verbose
# Automatically overwrites existing files
# Uses directory name as project name
```

**Script/Tool Project (Minimal)**
```bash
cd my-script/
npx cortex-tms init --minimal
# Only creates NEXT-TASKS.md and CLAUDE.md
```

---

### `validate` Command

Perform health checks on your TMS project to ensure compliance with documentation standards.

#### Usage

```bash
cortex-tms validate [options]
```

#### Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--strict` | `-s` | Treat warnings as errors (fails CI/CD on any issue) |
| `--verbose` | `-v` | Show detailed check information |
| `--fix` | `-f` | Auto-fix issues where possible |

#### What Gets Checked

**1. Mandatory Files** (Error if missing)
- `NEXT-TASKS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`

**2. File Size Limits** (Warning if exceeded)
- Ensures documentation stays AI-readable (Rule 4)
- Limits vary by scope:
  - **Nano**: NEXT-TASKS.md ≤ 100 lines
  - **Standard**: NEXT-TASKS.md ≤ 200 lines, others ≤ 500 lines
  - **Enterprise**: NEXT-TASKS.md ≤ 300 lines, others ≤ 800 lines

**3. Placeholder Completion** (Warning if found)
- Detects unreplaced `[Project Name]`, `[Description]`, etc.
- Can be silenced using `.cortexrc` ignore list

**4. Archive Status** (Warning if stale)
- Alerts when >10 completed tasks remain in NEXT-TASKS.md
- Suggests moving to `docs/archive/`

#### Exit Codes

- `0` - Validation passed
- `1` - Validation failed (errors found, or warnings in `--strict` mode)

#### Examples

**Basic Validation**
```bash
npx cortex-tms validate
# Shows errors and warnings
# Exits 0 if no errors
```

**CI/CD Integration (Strict Mode)**
```bash
npx cortex-tms validate --strict
# Fails on any warnings or errors
# Use in GitHub Actions / GitLab CI
```

**Detailed Output**
```bash
npx cortex-tms validate --verbose
# Shows all checks, even passing ones
# Includes line counts and file details
```

---

## Project Scopes

Scopes determine which templates are installed and what line limits apply.

### Nano Scope

**Best for**: Scripts, CLIs, small utilities

**Files**: 2
- `NEXT-TASKS.md`
- `CLAUDE.md`

**Line Limits**:
- `NEXT-TASKS.md`: 100 lines

**Use Case**: Single-file projects, automation scripts, small tools that don't need complex documentation.

---

### Standard Scope (Recommended)

**Best for**: Web apps, APIs, libraries, most products

**Files**: 9 (3 mandatory + 6 optional)

**Line Limits**:
- `NEXT-TASKS.md`: 200 lines
- `FUTURE-ENHANCEMENTS.md`: 500 lines
- Core docs: 300-500 lines each

**Use Case**: 90% of projects. Provides full TMS structure without overwhelming complexity.

---

### Enterprise Scope

**Best for**: Monorepos, microservices, complex domains

**Files**: 11 (3 mandatory + 8 optional)

**Line Limits**:
- `NEXT-TASKS.md`: 300 lines
- `FUTURE-ENHANCEMENTS.md`: 800 lines
- Core docs: 500-1000 lines each

**Use Case**: Large teams, complex business logic, projects requiring extensive domain modeling (GLOSSARY.md, SCHEMA.md).

---

## Configuration

### `.cortexrc` File

The `.cortexrc` file is automatically created during `init` and controls validation behavior.

#### Schema

```json
{
  "version": "1.0.0",
  "scope": "standard",
  "paths": {
    "docs": "docs/core",
    "tasks": "NEXT-TASKS.md",
    "archive": "docs/archive"
  },
  "limits": {
    "NEXT-TASKS.md": 200
  },
  "validation": {
    "ignorePatterns": [],
    "ignoreFiles": []
  },
  "metadata": {
    "created": "2026-01-12T12:00:00.000Z",
    "projectName": "my-project"
  }
}
```

#### Fields

**`version`** (string, required)
- Config schema version
- Current: `"1.0.0"`

**`scope`** (string, required)
- Project scope: `"nano"` | `"standard"` | `"enterprise"`
- Determines default line limits

**`paths`** (object, optional)
- `docs`: Path to core documentation (default: `"docs/core"`)
- `tasks`: Path to task file (default: `"NEXT-TASKS.md"`)
- `archive`: Path to archive directory (default: `"docs/archive"`)

**`limits`** (object, optional)
- Custom line limit overrides
- Keys: filename, Values: max lines
- Example: `{ "NEXT-TASKS.md": 500 }`

**`validation.ignoreFiles`** (array, optional)
- Files to skip during placeholder validation
- Example: `["NEXT-TASKS.md", "README.md"]`

**`validation.ignorePatterns`** (array, optional)
- Glob patterns to ignore (future feature)
- Example: `["docs/archive/**"]`

**`metadata`** (object, optional)
- Informational metadata
- `created`: ISO timestamp
- `projectName`: Project name

---

### Common Configurations

#### 1. Silence Placeholder Warnings

If you intentionally keep placeholders (e.g., template repo):

```json
{
  "validation": {
    "ignoreFiles": ["NEXT-TASKS.md", "README.md"]
  }
}
```

#### 2. Increase Line Limits

For projects with complex task tracking:

```json
{
  "limits": {
    "NEXT-TASKS.md": 400,
    "ARCHITECTURE.md": 800
  }
}
```

#### 3. Custom Paths

For non-standard project structures:

```json
{
  "paths": {
    "docs": "documentation",
    "tasks": "TODO.md",
    "archive": "history"
  }
}
```

---

## Examples

### Example 1: New React App

```bash
$ npx create-react-app my-app
$ cd my-app
$ npx cortex-tms init

🧠 Cortex TMS Initialization

✔ Project context detected
? Project name: My App
? Description: A React application
? Project scope: Standard (recommended)

📋 Summary
  Files to copy: 9
  Scope: Standard
  Overwrites: 0

? Proceed with initialization? Yes

✔ Templates copied: 9 files
✔ Configuration saved

✨ Success! Cortex TMS initialized.

Next Steps:
  1. Review NEXT-TASKS.md for active sprint tasks
  2. Update docs/core/ with your project details
  3. Customize .github/copilot-instructions.md for AI rules

📚 Learn more: https://github.com/yourusername/cortex-tms
```

### Example 2: Validating Before PR

```bash
$ npx cortex-tms validate --strict

🔍 Cortex TMS Validation

📋 Mandatory Files
  ✓ NEXT-TASKS.md exists
  ✓ CLAUDE.md exists
  ✓ .github/copilot-instructions.md exists

📏 File Size Limits (Rule 4)
  ⚠ NEXT-TASKS.md exceeds recommended line limit
    Current: 250 lines | Limit: 200 lines | Overage: 50 lines

📊 Summary

  Total Checks: 12
  ✓ Passed: 11
  ⚠ Warnings: 1
  ✗ Errors: 0

❌ Validation failed! (Strict mode: warnings treated as errors)

💡 Tips:
  • Archive completed tasks to reduce file size
  • Move to docs/archive/ for historical reference
```

### Example 3: CI/CD Integration

**GitHub Actions** (`.github/workflows/validate-tms.yml`):

```yaml
name: Validate TMS

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Validate Cortex TMS
        run: npx cortex-tms validate --strict
```

---

## Troubleshooting

### Issue: "File already exists" Error

**Symptom**: Init fails with overwrite warning

**Solution**:
```bash
# Option 1: Use force mode
npx cortex-tms init --force

# Option 2: Remove existing files first
rm NEXT-TASKS.md CLAUDE.md
npx cortex-tms init
```

---

### Issue: Validation Fails on Template Placeholders

**Symptom**: Placeholder warnings for files you haven't edited yet

**Solution**: Add files to ignore list in `.cortexrc`:

```json
{
  "validation": {
    "ignoreFiles": ["NEXT-TASKS.md"]
  }
}
```

---

### Issue: "Exceeded line limit" Warning

**Symptom**: Validation warns about file size

**Solutions**:

1. **Archive completed tasks** (recommended):
   ```bash
   mkdir -p docs/archive
   # Move completed tasks to docs/archive/sprint-2026-01.md
   ```

2. **Increase limit** (if justified):
   ```json
   {
     "limits": {
       "NEXT-TASKS.md": 300
     }
   }
   ```

---

### Issue: Missing `.cortexrc`

**Symptom**: Validation uses default limits instead of scope-specific ones

**Solution**: Re-run init or manually create `.cortexrc`:

```bash
npx cortex-tms init --force
# or manually create based on schema above
```

---

### Issue: CLI Not Found

**Symptom**: `command not found: cortex-tms`

**Solution**:
```bash
# Verify Node.js version (requires >=18)
node --version

# Use npx instead of direct command
npx cortex-tms --version

# Or install globally
npm install -g cortex-tms
```

---

## Best Practices

1. **Run `validate` before every commit**
   - Add to pre-commit hook or CI/CD

2. **Choose the right scope**
   - Start with Standard, upgrade to Enterprise only if needed

3. **Keep NEXT-TASKS.md under 200 lines**
   - Archive completed tasks monthly

4. **Customize `.cortexrc` for your workflow**
   - Don't ignore warnings unless intentional

5. **Update templates as project evolves**
   - Add new patterns to PATTERNS.md
   - Document decisions in DECISIONS.md

---

## Support

- **Issues**: https://github.com/yourusername/cortex-tms/issues
- **Documentation**: https://github.com/yourusername/cortex-tms
- **Version**: Run `cortex-tms --version`

---

**Happy Coding!** 🧠✨
