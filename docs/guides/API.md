# Cortex TMS API Documentation

**Version**: 3.2.0
**Last Updated**: 2026-01-31

This document covers both the **CLI API** (for users and automation) and **Developer API** (for embedding Cortex TMS in tools and Skills).

---

## 📋 Table of Contents

- [CLI API](#cli-api)
  - [init](#cortex-tms-init)
  - [validate](#cortex-tms-validate)
  - [status](#cortex-tms-status)
  - [migrate](#cortex-tms-migrate)
  - [review (Guardian)](#cortex-tms-review-guardian)
  - [prompt](#cortex-tms-prompt)
  - [auto-tier](#cortex-tms-auto-tier)
  - [tutorial](#cortex-tms-tutorial)
- [Developer API](#developer-api)
  - [Error Handling](#error-handling)
  - [Input Validation (Zod)](#input-validation-zod)
  - [Path Safety](#path-safety)
  - [API Key Sanitization](#api-key-sanitization)
- [Embedding Cortex TMS](#embedding-cortex-tms)
- [Type Definitions](#type-definitions)
- [Error Reference](#error-reference)

---

## CLI API

### `cortex-tms init`

Initializes a new Cortex TMS project with interactive or automated setup.

**Usage**:
```bash
cortex-tms init [options]
```

**Options**:
- `--scope <scope>` - Project scope: `nano`, `standard`, `enterprise`, or `custom` (default: interactive)
- `--force` - Overwrite existing files without prompting
- `--dry-run` - Preview what would be created without actually creating files

**Exit Codes**:
- `0` - Success
- `1` - Validation error or user cancellation

**Examples**:
```bash
# Interactive mode (recommended for first-time users)
cortex-tms init

# Non-interactive with specific scope
cortex-tms init --scope nano

# Preview changes without creating files
cortex-tms init --scope standard --dry-run

# Force overwrite existing files
cortex-tms init --scope enterprise --force
```

---

### `cortex-tms validate`

Validates project structure, configuration, and TMS health.

**Usage**:
```bash
cortex-tms validate [options]
```

**Options**:
- `--strict` - Fail on warnings (default: false, only fails on errors)
- `--fix` - Attempt to auto-fix common issues (placeholder text, missing files)

**Exit Codes**:
- `0` - Validation passed
- `1` - Validation failed

**What It Checks**:
- Mandatory files exist (`NEXT-TASKS.md`, `CLAUDE.md`, `.cortexrc`, `.github/copilot-instructions.md`)
- No placeholder text (e.g., `[Project Name]`, `[Feature Description]`)
- Valid `.cortexrc` JSON format
- Archive protocol compliance (< 10 completed tasks in NEXT-TASKS.md)
- Version tag consistency across documentation files

**Examples**:
```bash
# Standard validation (warnings allowed)
cortex-tms validate

# Strict mode (fail on warnings)
cortex-tms validate --strict

# Auto-fix issues
cortex-tms validate --fix
```

---

### `cortex-tms status`

Project dashboard with health metrics, sprint progress, and token analysis.

**Usage**:
```bash
cortex-tms status [options]
```

**Options**:
- `--tokens` - Show HOT/WARM/COLD token breakdown
- `-m, --model <model>` - Model for cost calculation (default: `claude-sonnet-4.5`)
  - Allowed values: `claude-sonnet-4.5`, `claude-opus-4.5`, `gpt-4-turbo`, `gpt-4`, `gpt-4o`

**Exit Codes**:
- `0` - Always succeeds (status is informational)

**Output**:
- Scope and health status
- Active tasks from NEXT-TASKS.md
- Validation status
- Token analysis (with `--tokens` flag)

**Examples**:
```bash
# Basic dashboard
cortex-tms status

# Token analysis with cost breakdown
cortex-tms status --tokens

# Cost comparison across models
cortex-tms status --tokens -m claude-sonnet-4.5
cortex-tms status --tokens -m gpt-4-turbo
```

---

### `cortex-tms migrate`

Safe template migration with backup and rollback support.

**Usage**:
```bash
cortex-tms migrate [options]
```

**Options**:
- `-a, --apply` - Apply automatic upgrades (creates backup first)
- `-r, --rollback` - Interactively restore from a previous backup
- `-f, --force` - Force upgrade even for customized files (requires `--apply`)
- `-v, --verbose` - Show detailed output
- `-d, --dry-run` - Preview changes without applying them

**Exit Codes**:
- `0` - Migration completed or previewed successfully
- `1` - Error during migration

**Safety Features**:
- Automatic backups before changes (stored in `.cortex/backups/`)
- Skips customized files unless `--force` is used
- Rollback support via `--rollback` with interactive backup selection
- Manifest tracking for what/when/why

**Examples**:
```bash
# Preview what needs updating
cortex-tms migrate --dry-run

# Analyze and show report only
cortex-tms migrate

# Apply safe upgrades (OUTDATED files only)
cortex-tms migrate --apply

# Force upgrade all files including CUSTOMIZED (with backup)
cortex-tms migrate --apply --force

# Interactive rollback to a previous backup
cortex-tms migrate --rollback
```

---

### `cortex-tms review` (Guardian)

AI-powered code review using Claude to enforce patterns and domain logic.

**Usage**:
```bash
cortex-tms review <file> [options]
```

**Arguments**:
- `<file>` - Path to file to review (required)

**Options**:
- `--provider <provider>` - LLM provider: `anthropic` or `openai` (default: `anthropic`)
- `--model <string>` - Model name (optional; uses provider-specific default if omitted)
- `--api-key <key>` - API key (alternative to environment variable)
- `--safe` - Safe mode: only show high-confidence violations (≥ 70%)
- `--output-json` - Output raw JSON for automation

**Exit Codes**:
- `0` - Review completed (violations may exist)
- `1` - Error (missing API key, file not found, invalid options)

**Environment Variables**:
- `ANTHROPIC_API_KEY` - Required when using Anthropic provider (default)
- `OPENAI_API_KEY` - Required when using OpenAI provider

**What Guardian Checks**:
- Pattern compliance (from `PATTERNS.md`)
- Domain logic consistency (from `DOMAIN-LOGIC.md`)
- Semantic violations (not just syntax errors)
- Project-specific rules

**Examples**:
```bash
# Human-readable output
cortex-tms review src/commands/init.ts

# JSON output for automation
cortex-tms review src/file.ts --output-json

# Safe mode (high-confidence only, recommended for CI/CD)
cortex-tms review src/file.ts --safe

# Use OpenAI instead of Anthropic
cortex-tms review src/file.ts --provider openai

# Combine flags
cortex-tms review src/file.ts --safe --output-json | jq '.violations | length'
```

**JSON Output Format**:
```json
{
  "summary": {
    "status": "minor_issues",
    "message": "Found 1 pattern violation"
  },
  "violations": [
    {
      "pattern": "Pattern 12: Centralized Error Handling",
      "line": 42,
      "issue": "Command uses process.exit(1) directly",
      "recommendation": "Throw CLIError and let the entry point handle exit codes",
      "severity": "major",
      "confidence": 0.92
    }
  ],
  "positiveObservations": [
    "Uses validateOptions with Zod schema for CLI arguments"
  ]
}
```

---

### `cortex-tms prompt`

Copy project-aware prompts to clipboard for AI agents.

**Usage**:
```bash
cortex-tms prompt <name>
```

**Available Prompts**:
- `init-session` - Start AI session with project context
- `feature` - Implement feature with architectural anchors
- `debug` - Systematic troubleshooting
- `review` - Code review against patterns
- `refactor` - Structural improvements
- `decision` - Architecture decision records
- `finish` - Maintenance protocol
- `bootstrap` - AI-powered doc population

**Exit Codes**:
- `0` - Prompt copied to clipboard
- `1` - Invalid prompt name

**Examples**:
```bash
# Start session (most common)
cortex-tms prompt init-session

# Bootstrap documentation with AI
cortex-tms prompt bootstrap
```

---

### `cortex-tms auto-tier`

Automatically assign HOT/WARM/COLD tier tags based on git commit history.

**Usage**:
```bash
cortex-tms auto-tier [options]
```

**Options**:
- `--hot <days>` - Files modified in last N days → HOT (default: 7)
- `--warm <days>` - Files modified in last N days → WARM (default: 30)
- `--cold <days>` - Files untouched for N+ days → COLD (default: 90)
- `--dry-run` - Preview tier assignments without applying
- `--force` - Overwrite existing tier tags
- `--verbose` - Show detailed git analysis

**Exit Codes**:
- `0` - Success
- `1` - Not a git repository or other error

**Examples**:
```bash
# Preview tier assignments
cortex-tms auto-tier --dry-run

# Apply with default thresholds (7/30/90 days)
cortex-tms auto-tier

# Custom thresholds
cortex-tms auto-tier --hot 3 --warm 14 --cold 60

# Force update existing tags
cortex-tms auto-tier --force
```

---

### `cortex-tms tutorial`

Interactive walkthrough of Cortex TMS features.

**Usage**:
```bash
cortex-tms tutorial
```

**Exit Codes**:
- `0` - Tutorial completed or exited

**Features**:
- 8 interactive lessons
- Navigation (next, previous, exit)
- Command examples
- Pro tips for each lesson

---

## Developer API

### Error Handling

**New in v3.2**: Centralized error handling with consistent CLIError hierarchy.

**CLIError Hierarchy**:
```typescript
// Base class for all CLI errors
class CLIError extends Error {
  exitCode: number;        // Exit code for process.exit()
  context?: ErrorContext;  // Additional error context
}

// Validation errors (invalid input, schema violations)
class ValidationError extends CLIError {
  exitCode = 1;
}

// Git operation errors
class GitError extends CLIError {
  exitCode = 1;
}

// Configuration errors
class ConfigError extends CLIError {
  exitCode = 1;
}

// File system errors
class FileSystemError extends CLIError {
  exitCode = 1;
}
```

**Usage in Commands**:
```typescript
import { CLIError, ValidationError, FileSystemError } from './utils/errors.js';

export async function myCommand(options: Options): Promise<void> {
  // Validate input
  if (!isValid(options)) {
    throw new ValidationError('Invalid options provided', { options });
  }

  // Check file existence
  if (!fileExists(path)) {
    throw new FileSystemError(`File not found: ${path}`, { filePath: path });
  }

  // General errors
  if (somethingBad()) {
    throw new CLIError('Something went wrong', 1, { additionalContext: 'details' });
  }

  // Never call process.exit() directly in commands!
  // ❌ process.exit(1);  // Wrong!
  // ✅ throw new CLIError('Error message', 1);  // Correct!
}
```

**Error Handling in CLI Entry Point** (`bin/cortex-tms.js`):
```typescript
try {
  await program.parseAsync(process.argv);
  process.exit(0);
} catch (error) {
  if (error instanceof CLIError) {
    console.error(chalk.red(`✗ ${error.message}`));
    if (error.context) {
      console.error(chalk.gray(JSON.stringify(error.context, null, 2)));
    }
    process.exit(error.exitCode);
  }
  // Unexpected error (bug)
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
}
```

**Benefits**:
- ✅ Testable (can catch errors in tests)
- ✅ Consistent error messages
- ✅ Proper cleanup (no abrupt process kills)
- ✅ Type-safe error details

---

### Input Validation (Zod)

**New in v3.2**: Type-safe runtime validation using Zod schemas.

**Defining Schemas**:
```typescript
import { z } from 'zod';
import { validateOptions } from './utils/validation.js';

// Define schema
const InitOptionsSchema = z.object({
  scope: z.enum(['nano', 'standard', 'enterprise', 'custom']).optional(),
  force: z.boolean().optional().default(false),
  dryRun: z.boolean().optional().default(false),
});

// Infer TypeScript type from schema
type InitOptions = z.infer<typeof InitOptionsSchema>;
```

**Validating at Command Entry**:
```typescript
export async function init(rawOptions: unknown): Promise<void> {
  // validateOptions throws ValidationError if invalid
  const options = validateOptions(InitOptionsSchema, rawOptions, 'init');

  // options is now type-safe and validated
  if (options.dryRun) {
    console.log('Dry run mode...');
  }
}
```

**Custom Validation Rules**:
```typescript
const AutoTierOptionsSchema = z.object({
  hot: z.number().min(0).optional().default(7),
  warm: z.number().min(0).optional().default(30),
  cold: z.number().min(0).optional().default(90),
}).refine(
  (data) => data.hot <= data.warm && data.warm <= data.cold,
  {
    message: '--hot threshold must be ≤ --warm threshold must be ≤ --cold threshold',
  }
);
```

**Error Messages**:
Zod provides clear, actionable error messages:
```
❌ Invalid scope: "invalid"
   Expected one of: nano, standard, enterprise, custom

❌ --hot threshold must be ≤ --warm threshold must be ≤ --cold threshold
```

---

### Path Safety

**New in v3.2**: Protection against directory traversal attacks.

**Validating Safe Paths**:
```typescript
import { validateSafePath, validateFilePath } from './utils/validation.js';

// Option 1: validateSafePath (returns result object)
const userPath = options.file; // Could be "../../etc/passwd"
const result = validateSafePath(userPath, process.cwd());

if (!result.isValid) {
  throw new ValidationError(result.error || 'Invalid path');
}

const safePath = result.resolvedPath;
await fs.readFile(safePath, 'utf-8');

// Option 2: validateFilePath (throws automatically, checks existence)
const safePath = validateFilePath(userPath, process.cwd());
// If we get here, path is safe and file exists
await fs.readFile(safePath, 'utf-8');
```

**What It Blocks**:
- `../../etc/passwd` - Directory traversal via relative paths
- `/etc/passwd` - Absolute paths outside project
- Path-based traversal attempts

**Implementation** (simplified):
```typescript
export function validateSafePath(
  inputPath: string,
  baseDir: string
): { isValid: boolean; error?: string; resolvedPath?: string } {
  const normalizedBase = path.resolve(baseDir);
  const resolvedPath = path.resolve(baseDir, inputPath);

  if (!resolvedPath.startsWith(normalizedBase)) {
    return {
      isValid: false,
      error: `Path traversal detected: ${inputPath}`,
    };
  }

  return {
    isValid: true,
    resolvedPath,
  };
}
```

---

### API Key Sanitization

**New in v3.2**: Automatic redaction of API keys in all output.

**Sanitization Functions** (`src/utils/sanitize.ts`):
```typescript
import { sanitizeApiKey, sanitizeError, sanitizeObject } from './utils/sanitize.js';

// Sanitize plain text
const text = 'Error with key sk-ant-api03-abc123';
const safe = sanitizeApiKey(text);
// → 'Error with key [REDACTED_API_KEY]'

// Sanitize error messages
try {
  await callAPI(apiKey);
} catch (error) {
  const safeMessage = sanitizeError(error);
  console.error(safeMessage); // API key redacted
}

// Sanitize objects (recursively)
const obj = {
  message: 'Failed with sk-proj-xyz',
  apiKey: 'sk-ant-secret',
  nested: { token: 'bearer-abc' }
};
const safeObj = sanitizeObject(obj);
// All API keys → '[REDACTED_API_KEY]'
```

**What Gets Redacted**:
- OpenAI keys: `sk-...`, `sk-proj-...`
- Anthropic keys: `sk-ant-...`
- Bearer tokens: `Bearer ...`
- Authorization headers
- Object keys named: `apiKey`, `api_key`, `token`, `secret`, `password`

**Patterns Matched**:
```typescript
const API_KEY_PATTERNS = [
  /sk-(?:proj-)?[a-zA-Z0-9_-]{10,}/g,      // OpenAI
  /sk-ant-[a-zA-Z0-9_-]{10,}/g,             // Anthropic
  /Bearer\s+[a-zA-Z0-9_-]{20,}/gi,          // Bearer tokens
  /Authorization:\s*["']?[a-zA-Z0-9_-]{20,}["']?/gi,
  /x-api-key:\s*["']?[a-zA-Z0-9_-]{10,}["']?/gi,
];
```

**Usage in Guardian**:
```typescript
// Guardian automatically sanitizes all output
const result = await runGuardian(file, options);

if (options.outputJson) {
  // JSON output is sanitized
  console.log(JSON.stringify(sanitizeObject(result), null, 2));
} else {
  // Human-readable output is sanitized
  console.log(sanitizeError(result.summary));
}
```

---

## Embedding Cortex TMS

### Use Case: CI/CD Pipeline

**GitHub Actions Example**:
```yaml
# .github/workflows/cortex-validate.yml
name: Cortex TMS Validation

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install Cortex TMS
        run: npm install -g cortex-tms

      - name: Validate Project
        run: cortex-tms validate --strict

      - name: Run Guardian on Changed Files
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          for file in $(git diff --name-only origin/main...HEAD | grep '\.ts$'); do
            if [ -f "$file" ]; then
              echo "Reviewing $file..."
              cortex-tms review "$file" --safe --output-json | jq '.violations | length'
            fi
          done
```

**Shell Script Example**:
```bash
#!/bin/bash
# scripts/pre-commit-validation.sh

set -e

echo "Running Cortex TMS validation..."

# Validate project structure
if ! cortex-tms validate --strict; then
  echo "❌ Validation failed"
  exit 1
fi

echo "✓ Validation passed"

# Run Guardian on staged files (optional)
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "Running Guardian on staged files..."

  for file in $(git diff --cached --name-only --diff-filter=ACM | grep '\.ts$'); do
    if [ -f "$file" ]; then
      violations=$(cortex-tms review "$file" --safe --output-json | jq '.violations | length')

      if [ "$violations" -gt 0 ]; then
        echo "⚠️  Found $violations violation(s) in $file"
      fi
    fi
  done
fi

echo "✓ Pre-commit checks complete"
```

---

### Use Case: Claude Code Skill Integration

**Skill Definition** (for Anthropic Agent SDK):
```typescript
// skills/cortex-guardian.ts
export const cortexGuardianSkill = {
  name: 'cortex-guardian',
  description: 'Review code files against project patterns using Guardian',
  parameters: {
    file: {
      type: 'string',
      description: 'Path to file to review',
      required: true,
    },
    safe: {
      type: 'boolean',
      description: 'Use safe mode (high-confidence only)',
      default: true,
    },
  },
  execute: async ({ file, safe }) => {
    const { execSync } = await import('child_process');

    const flags = safe ? '--safe --output-json' : '--output-json';
    const command = `cortex-tms review "${file}" ${flags}`;

    try {
      const output = execSync(command, { encoding: 'utf-8' });
      return JSON.parse(output);
    } catch (error) {
      return {
        error: error.message,
        violations: [],
      };
    }
  },
};
```

**Using in Agent**:
```typescript
// Agent usage
const result = await agent.executeSkill('cortex-guardian', {
  file: 'src/commands/init.ts',
  safe: true,
});

if (result.violations.length > 0) {
  console.log(`Found ${result.violations.length} violations`);
  result.violations.forEach(v => {
    console.log(`  - ${v.message} (line ${v.line})`);
  });
}
```

---

## Type Definitions

**CLI Options**:
```typescript
// Init Options
interface InitOptions {
  scope?: 'nano' | 'standard' | 'enterprise' | 'custom';
  force?: boolean;
  dryRun?: boolean;
}

// Validate Options
interface ValidateOptions {
  strict?: boolean;
  fix?: boolean;
}

// Review Options
interface ReviewOptions {
  provider?: 'anthropic' | 'openai';
  model?: string;
  apiKey?: string;
  safe?: boolean;
  outputJson?: boolean;
}

// Auto-Tier Options
interface AutoTierOptions {
  hot?: number;    // days
  warm?: number;   // days
  cold?: number;   // days
  dryRun?: boolean;
  force?: boolean;
  verbose?: boolean;
}
```

**Guardian Types**:
```typescript
interface Violation {
  pattern: string;                       // Pattern name (e.g., 'Pattern 12: Centralized Error Handling')
  line?: number;                         // Line number (if applicable)
  issue: string;                         // Description of the violation
  recommendation: string;                // How to fix the issue
  severity: 'minor' | 'major';          // Violation severity
  confidence?: number;                   // 0-1 scale (optional)
}

interface GuardianResult {
  summary: {
    status: 'compliant' | 'minor_issues' | 'major_violations';
    message: string;
  };
  violations: Violation[];
  positiveObservations: string[];
}
```

**Error Types**:
```typescript
class CLIError extends Error {
  exitCode: number;
  context?: ErrorContext;

  constructor(message: string, exitCode: number, context?: ErrorContext) {
    super(message);
    this.exitCode = exitCode;
    this.context = context;
  }
}

class ValidationError extends CLIError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 1, context);
  }
}

class GitError extends CLIError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 1, context);
  }
}

class ConfigError extends CLIError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 1, context);
  }
}

class FileSystemError extends CLIError {
  constructor(message: string, context?: ErrorContext) {
    super(message, 1, context);
  }
}
```

---

## Error Reference

| Error Type | Exit Code | Typical Cause | Solution |
|------------|-----------|---------------|----------|
| `ValidationError` | 1 | Invalid CLI options or failed Zod validation | Check command syntax and option values |
| `FileSystemError` | 1 | Missing required file or file operation failure | Ensure file exists or run `cortex-tms init` |
| `GitError` | 1 | Git operation failure | Check git repository status and permissions |
| `ConfigError` | 1 | Invalid or missing configuration | Verify `.cortexrc` format and contents |
| `CLIError` | 1 | General command failure | Check error message for specific guidance |
| Uncaught exception | 1 | Unexpected error (bug) | Report issue with stack trace |

**Common Validation Errors**:

```bash
# Invalid scope
❌ Invalid scope: "invalid"
   Expected one of: nano, standard, enterprise, custom

# Path traversal attempt
❌ Path traversal detected: ../../etc/passwd

# Missing API key
❌ ANTHROPIC_API_KEY environment variable is required for Guardian

# Invalid threshold values
❌ --hot threshold must be ≤ --warm threshold must be ≤ --cold threshold
```

---

## Related Documentation

- **Security Overview**: [`docs/core/SECURITY.md`](../core/SECURITY.md) - Threat model, mitigations, best practices
- **Security Testing**: [`docs/guides/SECURITY-TESTING.md`](SECURITY-TESTING.md) - How to verify security patterns
- **Security Patterns**: [`docs/core/PATTERNS.md`](../core/PATTERNS.md) - Pattern 12 (Error Handling), Pattern 13 (Input Validation)
- **Migration Guide**: [`docs/guides/MIGRATION-GUIDE.md`](MIGRATION-GUIDE.md) - Upgrading to v3.2.0
- **Contributing**: [`CONTRIBUTING.md`](../../CONTRIBUTING.md) - Development workflow and testing

---

## Version History

**v3.2.0** (2026-01-31)
- Added comprehensive CLI API documentation
- Documented new error handling patterns (CLIError hierarchy)
- Documented Zod validation patterns
- Added path safety documentation
- Added API key sanitization documentation
- Added Guardian JSON output format
- Added CI/CD and Skills embedding examples

---

**Questions or Issues?**

- **GitHub Issues**: [Report bugs or request features](https://github.com/cortex-tms/cortex-tms/issues)
- **Documentation**: [cortex-tms.org](https://cortex-tms.org/)
- **Security**: See [SECURITY.md](../core/SECURITY.md) for vulnerability reporting

<!-- @cortex-tms-version 3.1.0 -->
