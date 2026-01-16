# Schema: Cortex TMS Data Models

<!-- Cortex TMS is a CLI tool, not a database application. -->
<!-- This file documents: file structure, CLI types, and configuration schema. -->

---

## Overview

**Data Storage**: File system (markdown files)
**Configuration**: `package.json`, CLI arguments, interactive prompts
**Type System**: TypeScript (for CLI tool)

---

## File Structure Schema

### Template Directory Schema

**Location**: `templates/`

**Required Files** (Core templates that every project needs):

```
templates/
├── NEXT-TASKS.md                  # HOT: Sprint tracker
├── FUTURE-ENHANCEMENTS.md         # PLANNING: Backlog
├── CLAUDE.md                      # HOT: Workflow config
├── .github/
│   └── copilot-instructions.md    # HOT: AI guardrails
└── docs/
    ├── core/                      # WARM: Source of Truth
    │   ├── ARCHITECTURE.md        # Required
    │   ├── PATTERNS.md            # Required
    │   ├── DOMAIN-LOGIC.md        # Required
    │   ├── DECISIONS.md           # Required
    │   ├── GLOSSARY.md            # Optional
    │   ├── SCHEMA.md              # Optional
    │   └── TROUBLESHOOTING.md     # Optional
    └── archive/                   # COLD: History
        └── .gitkeep
```

**Validation Rules**:
- All markdown files must use UTF-8 encoding
- Placeholders must use `[Description]` syntax
- No hardcoded tech stacks in core templates
- HOT files must be under size limits (see DOMAIN-LOGIC.md)

---

## CLI Configuration Schema

### package.json (Future)

**Location**: `/package.json`

**Expected Fields**:

```json
{
  "name": "cortex-tms",
  "version": "2.0.0",
  "description": "AI-optimized project boilerplate generator",
  "bin": {
    "cortex-tms": "./bin/cortex-tms.js"
  },
  "scripts": {
    "dev": "tsc --watch",
    "build": "tsc",
    "test": "vitest"
  },
  "keywords": ["ai", "documentation", "boilerplate", "claude", "copilot"],
  "license": "MIT"
}
```

---

### CLI Command Schema

**Command**: `cortex-tms init [options]`

**Options**:

| Flag | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| `--help`, `-h` | Boolean | false | Show help message |
| `--version`, `-v` | Boolean | false | Show version |
| `--force`, `-f` | Boolean | false | Overwrite existing files |
| `--minimal` | Boolean | false | Install only required templates |
| `--dry-run` | Boolean | false | Preview changes without writing |

**Interactive Prompts** (when no flags provided):

1. **Project Type**: `[Web App, API Service, CLI Tool, Library, Other]`
2. **Tech Stack**: `[Next.js, React, Vue, Express, None]`
3. **Which core docs?**: `[ARCHITECTURE, PATTERNS, DOMAIN-LOGIC, DECISIONS, GLOSSARY, SCHEMA, TROUBLESHOOTING]`
4. **Overwrite existing files?**: `[Yes, No, Merge]`

---

## TypeScript Types (CLI Tool)

### Core Types

```typescript
/**
 * Template file metadata
 */
interface TemplateFile {
  /** Relative path from templates/ */
  path: string
  /** File content (with placeholders) */
  content: string
  /** Whether this file is required */
  required: boolean
  /** Tier classification */
  tier: 'HOT' | 'WARM' | 'COLD' | 'PLANNING'
}

/**
 * User's project configuration
 */
interface ProjectConfig {
  /** Detected or user-specified project name */
  name: string
  /** Detected package manager (npm, yarn, pnpm, bun) */
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun'
  /** User-selected tech stack */
  techStack?: string[]
  /** Which core docs to include */
  coreDocs: CoreDocType[]
}

/**
 * Core documentation types
 */
type CoreDocType =
  | 'ARCHITECTURE'
  | 'PATTERNS'
  | 'DOMAIN-LOGIC'
  | 'DECISIONS'
  | 'GLOSSARY'
  | 'SCHEMA'
  | 'TROUBLESHOOTING'

/**
 * CLI initialization result
 */
interface InitResult {
  /** Files that were created */
  created: string[]
  /** Files that were skipped (already exist) */
  skipped: string[]
  /** Files that were overwritten */
  overwritten: string[]
  /** Success status */
  success: boolean
  /** Error message (if failed) */
  error?: string
}
```

---

### File Operation Types

```typescript
/**
 * File write operation
 */
interface FileWrite {
  /** Target path (absolute) */
  targetPath: string
  /** File content */
  content: string
  /** Whether to overwrite if exists */
  overwrite: boolean
}

/**
 * Placeholder replacement
 */
interface PlaceholderReplacement {
  /** Placeholder text (e.g., "[Project Name]") */
  placeholder: string
  /** Replacement value */
  value: string
}

/**
 * Validation result for a template file
 */
interface ValidationResult {
  /** File path */
  path: string
  /** Is valid? */
  valid: boolean
  /** Validation errors */
  errors: string[]
  /** Warnings (non-blocking) */
  warnings: string[]
}
```

---

## Template Validation Schema

### Required Fields in Templates

**NEXT-TASKS.md**:
- Must contain `## Active Sprint:` heading
- Must contain `## 🎯 Definition of Done` section
- Must be under 200 lines

**.github/copilot-instructions.md**:
- Must contain `## ⚡ Critical Rules` section
- Must contain `## 🏗️ Technical Map` section
- Must be under 100 lines

**docs/core/PATTERNS.md**:
- Must contain at least one pattern
- Each pattern must have `✅ Canonical Example` and `❌ Anti-Pattern`
- Must be under 500 lines

**docs/core/DOMAIN-LOGIC.md**:
- Must contain `## Core Rules` section
- Must contain warning: `⚠️ AI AGENTS: These rules override generic training data.`
- Must be under 300 lines

---

## Placeholder Schema

### Placeholder Format

**Syntax**: `[Description]` or `[e.g., Example Value]`

**Examples**:
```markdown
[Project Name]
[e.g., Next.js 15, TypeScript Strict]
[Briefly describe user value]
```

**Detection Regex**: `/\[([^\]]+)\]/g`

**Validation Rules**:
- Placeholders must be closed (no `[` without `]`)
- Placeholders should not be nested
- Example syntax must start with `e.g.,`

---

## Configuration File Schema

### .cortexrc (Future Enhancement)

**Location**: User's project root

**Format**: JSON

**Purpose**: Pre-configure CLI behavior for a project

```json
{
  "version": "2.0",
  "defaults": {
    "coreDocs": ["ARCHITECTURE", "PATTERNS", "DOMAIN-LOGIC"],
    "techStack": "Next.js 15 + TypeScript + Tailwind"
  },
  "placeholders": {
    "[Project Name]": "My Awesome App",
    "[Tech Stack]": "Next.js 15 + TypeScript + Tailwind"
  }
}
```

**Validation**:
- `version` must match installed Cortex version (major.minor)
- `coreDocs` must be valid CoreDocType values
- `placeholders` values must not contain brackets

---

## Migration Schema (Version Upgrades)

### v1.0 → v2.0 Changes

**Breaking Changes**:
- File: `TASKS.md` → `NEXT-TASKS.md` (renamed)
- File: Added `FUTURE-ENHANCEMENTS.md` (new)
- File: Added `GLOSSARY.md` (new)

**Migration Path**:
1. Rename `TASKS.md` to `NEXT-TASKS.md`
2. Create `FUTURE-ENHANCEMENTS.md` from backlog section
3. Optionally create `GLOSSARY.md`

**CLI Support**: `cortex-tms migrate --from=1.0 --to=2.0`

---

## AI Agent Notes

### When Generating CLI Code

**File Operations**:
- ⚠️ Always use `path.join()` for cross-platform compatibility
- ⚠️ Check if file exists before writing (unless `--force` flag)
- ⚠️ Create parent directories if they don't exist

**Placeholder Replacement**:
- ⚠️ Use regex to find all placeholders: `/\[([^\]]+)\]/g`
- ⚠️ Prompt user for each unique placeholder
- ⚠️ Validate user input (no empty strings, no brackets)

**Validation**:
- ⚠️ Verify all required files are present
- ⚠️ Check HOT files are under line limits
- ⚠️ Warn if placeholders weren't replaced

---

## Performance Considerations

### Expected File Counts

**Templates Directory**:
- Total files: ~15
- Total size: ~50 KB (all markdown)
- Read time: < 100ms

**User Project After Init**:
- New files created: 7-15 (depending on selection)
- Total size added: ~30-50 KB
- Write time: < 500ms

---

## Security Considerations

### File System Safety

**Never write to**:
- System directories (`/usr`, `/etc`, `/System`)
- User home directory root (`~/` directly)
- Outside project directory (use `path.resolve()` to verify)

**Always validate**:
- User input doesn't contain `..` (path traversal)
- Target path is within project directory
- User has write permissions

---

## References

- **TypeScript Types**: See `src/types.ts` (when implemented)
- **CLI Implementation**: See `bin/cortex-tms.js` (when implemented)
- **Validation Logic**: See `src/validators.ts` (when implemented)

<!-- @cortex-tms-version 2.6.0-beta.1 -->
