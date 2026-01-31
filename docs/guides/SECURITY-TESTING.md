# Security Testing Guide

**Last Updated**: 2026-01-31 (v3.2.0 Security Hardening)

This guide explains how to run security tests and checks for Cortex TMS. Use this to verify security patterns are upheld during development and before releases.

---

## 🔍 Overview

Cortex TMS implements multiple security layers (see `docs/core/SECURITY.md`). This guide shows how to **test and verify** those security measures.

**Key Security Areas**:
- Centralized error handling (no `process.exit()` in commands)
- Zod-based input validation (runtime type safety)
- Path traversal protection (safe file operations)
- API key sanitization (Guardian credential safety)

---

## 🧪 What to Run

### CI Pipeline (Automated)

These run automatically on every PR:

```bash
# Full test suite (unit + integration + E2E)
pnpm test

# Dependency vulnerability scanning
pnpm run audit

# Build verification
pnpm run build
```

**CI Configuration**: `.github/workflows/ci.yml` (if present)

---

### Local Development (Manual)

Before committing code:

```bash
# 1. Run all tests
pnpm test

# 2. Run only E2E tests (full CLI workflow coverage)
pnpm test src/__tests__/*-e2e.test.ts

# 3. Run only unit tests (fast feedback)
pnpm test src/__tests__/unit/

# 4. Check for dependency vulnerabilities
pnpm run audit

# 5. Validate project structure
node bin/cortex-tms.js validate --strict

# 6. Build and verify no TypeScript errors
pnpm run build
```

**Recommended workflow**:
1. **During development**: Run unit tests (`pnpm test src/__tests__/unit/`)
2. **Before commit**: Run all tests (`pnpm test`)
3. **Before PR**: Run audit + validate + build

---

## 🧪 E2E Test Suite

### How E2E Tests Work

**Design principles**:
- ✅ **Isolated**: Each test uses temp directories (`/tmp/cortex-test-*`)
- ✅ **No network**: Tests don't make real API calls
- ✅ **Full CLI**: Tests invoke `bin/cortex-tms.js` like real users
- ✅ **Cleanup**: Temp directories removed after each test

**Coverage** (60+ E2E tests):
- `init` command: 8 tests (project initialization, scope selection)
- `validate` command: 13 tests (passing/failing projects, strict mode)
- `migrate` command: 10 tests (v2→v3 migration, dry-run, backups)
- `review` command: 14 tests (API keys, providers, safe mode)
- `auto-tier` command: 16 tests (git history, tier assignment)

---

### Running E2E Tests Safely

**Run all E2E tests**:
```bash
pnpm test src/__tests__/*-e2e.test.ts
```

**Run specific E2E suite**:
```bash
pnpm test src/__tests__/init-e2e.test.ts
pnpm test src/__tests__/validate-e2e.test.ts
pnpm test src/__tests__/migrate-e2e.test.ts
pnpm test src/__tests__/review-e2e.test.ts
```

**Run specific test**:
```bash
pnpm test src/__tests__/init-e2e.test.ts -t "should create nano scope"
```

**Run tests with coverage**:
```bash
pnpm test:coverage
```

---

### E2E Test Isolation

**Temp directory management**:
```typescript
// Each test creates isolated temp directory
beforeEach(async () => {
  tempDir = await createTempDir(); // /tmp/cortex-test-{random}
});

afterEach(async () => {
  await cleanupTempDir(tempDir); // Automatic cleanup
});
```

**Safety guarantees**:
- ✅ Tests **never** touch your real project files
- ✅ Tests **never** make real network calls
- ✅ Tests **never** require real API keys (Guardian tests skip if missing)
- ✅ Temp directories are **always** cleaned up (even on test failure)

---

### Skipped Tests

Some tests are skipped by default:

**Guardian tests without API key**:
```typescript
if (!process.env.ANTHROPIC_API_KEY) {
  it.skip('should call Guardian API', () => {
    // Skipped - requires ANTHROPIC_API_KEY
  });
}
```

**To enable Guardian tests**:
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
pnpm test src/__tests__/review-e2e.test.ts
```

**Tests with `.skip` or `.todo` markers**:
```typescript
it.skip('future test case', () => {
  // Not yet implemented
});
```

---

## 🔐 Guardian / API Key Safety

### Setting API Keys Locally

**Option 1: Environment variable**:
```bash
export ANTHROPIC_API_KEY="sk-ant-api03-..."
```

**Option 2: `.env` file** (recommended):
```bash
# Create .env file (already in .gitignore)
echo "ANTHROPIC_API_KEY=sk-ant-api03-..." > .env
```

**Important**: `.env` is in `.gitignore` - **never commit API keys to git**.

---

### API Key Sanitization

Cortex TMS sanitizes API keys in **all output paths**:

**Where keys are redacted**:
- Error messages
- Log statements
- Stack traces
- JSON output (`--output-json`)
- Console output

**Example**:
```typescript
// What the code sees:
Error: API call failed with key sk-ant-api03-abc123def456...

// What gets logged (sanitized):
Error: API call failed with key [REDACTED]
```

**Sanitization implementation**:
```typescript
// In src/utils/sanitize.ts
export function sanitizeApiKey(text: string): string {
  // Redacts OpenAI (sk-..., sk-proj-...), Anthropic (sk-ant-...),
  // Bearer tokens, Authorization headers, and x-api-key headers
  let sanitized = text;
  for (const pattern of API_KEY_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED_API_KEY]');
  }
  return sanitized;
}

export function sanitizeError(error: Error | string): string {
  const message = typeof error === 'string' ? error : error.message;
  return sanitizeApiKey(message);
}

export function sanitizeObject<T>(obj: T): T {
  // Recursively sanitizes all strings in objects/arrays
  // Also redacts keys named apiKey, api_key, token, secret, password
}
```

**Usage in commands**:
```typescript
// In src/utils/llm-client.ts
import { sanitizeError } from './sanitize.js';

if (!response.ok) {
  const error = await response.text();
  const sanitizedError = sanitizeError(error);
  throw new Error(`API error: ${response.status} ${sanitizedError}`);
}
```

**Testing sanitization**:
```typescript
// src/__tests__/sanitize.test.ts
it('should sanitize API keys in error messages', () => {
  const error = new Error('Failed with key sk-ant-abc123def456');
  const sanitized = sanitizeError(error);

  expect(sanitized).toContain('[REDACTED_API_KEY]');
  expect(sanitized).not.toContain('sk-ant-');
});
```

---

### Best Practices

✅ **DO**:
- Use `.env` files for API keys (in `.gitignore`)
- Rotate keys if accidentally committed
- Use environment variables in CI/CD
- Verify sanitization in tests

❌ **DON'T**:
- Commit `.env` files to git
- Hardcode keys in source files
- Share keys in public channels
- Disable sanitization (even for debugging)

---

## 🛡️ Security Patterns to Test

### 1. Error Handling

**What to test**:
- Commands throw `CLIError` (not `process.exit()`)
- Error messages are user-friendly
- Error details don't leak sensitive info
- Exit codes are correct

**Example test**:
```typescript
import { CLIError } from '../utils/errors.js';

it('should throw CLIError on validation failure', async () => {
  await expect(
    validate({ invalid: true })
  ).rejects.toThrow(CLIError);
});

it('should have correct exit code', async () => {
  try {
    await validate({ invalid: true });
  } catch (error) {
    expect(error).toBeInstanceOf(CLIError);
    expect(error.exitCode).toBe(1);
  }
});
```

**Testing `process.exit()` doesn't happen**:
```typescript
// In src/__tests__/commands/*.test.ts
it('should not call process.exit directly', async () => {
  const exitSpy = vi.spyOn(process, 'exit');

  await expect(
    runCommand('init', ['--invalid'])
  ).rejects.toThrow();

  expect(exitSpy).not.toHaveBeenCalled();
});
```

**See also**: `docs/core/PATTERNS.md#pattern-12-centralized-error-handling`

---

### 2. Input Validation

**What to test**:
- Zod schemas reject invalid inputs
- Safe paths prevent directory traversal
- Error messages are clear and actionable
- Type transformations work correctly

**Example tests**:
```typescript
import { validateOptions, validateSafePath, validateFilePath } from '../utils/validation.js';

it('should reject invalid options with clear message', () => {
  const schema = z.object({
    count: z.number().min(0),
  });

  expect(() =>
    validateOptions(schema, { count: -1 }, 'test')
  ).toThrow(ValidationError);
});

it('should reject path traversal attempts', () => {
  const result = validateSafePath('../../etc/passwd', '/tmp/test');

  expect(result.isValid).toBe(false);
  expect(result.error).toContain('Path traversal');
});

it('should allow safe paths', () => {
  const result = validateSafePath('docs/README.md', '/tmp/test');

  expect(result.isValid).toBe(true);
  expect(result.resolvedPath).toContain('/tmp/test/docs/README.md');
});

it('should throw on invalid paths when using validateFilePath', () => {
  expect(() =>
    validateFilePath('../../etc/passwd', '/tmp/test')
  ).toThrow(ValidationError);
});
```

**Testing cross-field validation**:
```typescript
it('should enforce hot <= warm <= cold', () => {
  const schema = autoTierOptionsSchema;

  expect(() =>
    validateOptions(schema, { hot: 10, warm: 5, cold: 20 }, 'auto-tier')
  ).toThrow('--hot threshold must be ≤ --warm threshold');
});
```

**See also**: `docs/core/PATTERNS.md#pattern-13-zod-input-validation`

---

### 3. Guardian Sanitization

**What to test**:
- API keys redacted in error messages
- API keys redacted in JSON output
- Logs don't contain sensitive data
- Sanitization works for all key formats

**Example tests**:
```typescript
import { sanitizeApiKey, sanitizeError, sanitizeObject } from '../utils/sanitize.js';

it('should sanitize Anthropic API keys', () => {
  const text = 'Error with key sk-ant-api03-abc123def456ghi789';
  const sanitized = sanitizeApiKey(text);

  expect(sanitized).toContain('[REDACTED_API_KEY]');
  expect(sanitized).not.toContain('sk-ant-');
  expect(sanitized).not.toContain('abc123');
});

it('should sanitize multiple keys in same message', () => {
  const text = 'Keys: sk-ant-key1, sk-ant-key2';
  const sanitized = sanitizeApiKey(text);

  expect(sanitized).toBe('Keys: [REDACTED_API_KEY], [REDACTED_API_KEY]');
});

it('should sanitize error objects', () => {
  const error = new Error('Failed: sk-proj-abc123');
  const sanitized = sanitizeError(error);

  expect(sanitized).toContain('[REDACTED_API_KEY]');
  expect(sanitized).not.toContain('sk-proj-');
});

it('should sanitize objects recursively', () => {
  const obj = {
    message: 'Error with sk-ant-key123',
    apiKey: 'sk-ant-secret',
    nested: { token: 'bearer-xyz' }
  };
  const sanitized = sanitizeObject(obj);

  expect(JSON.stringify(sanitized)).not.toContain('sk-ant-');
  expect(sanitized.apiKey).toBe('[REDACTED_API_KEY]');
});
```

---

### 4. Path Traversal Protection

**Attack vectors to test**:
```typescript
const attackVectors = [
  '../../etc/passwd',
  '../../../root/.ssh/id_rsa',
  '..\\..\\windows\\system32\\config\\sam',
  './../../etc/passwd',
  'docs/../../etc/passwd',
];

attackVectors.forEach(attack => {
  it(`should reject path traversal: ${attack}`, () => {
    const result = validateSafePath(attack, '/tmp/safe');
    expect(result.isValid).toBe(false);
  });
});
```

**Valid paths to allow**:
```typescript
const validPaths = [
  'README.md',
  'docs/core/PATTERNS.md',
  './src/utils/validation.ts',
  'templates/NEXT-TASKS.md',
];

validPaths.forEach(path => {
  it(`should allow safe path: ${path}`, () => {
    const result = validateSafePath(path, '/tmp/safe');
    expect(result.isValid).toBe(true);
  });
});
```

---

## 🚨 Troubleshooting

### `pnpm audit` Fails

**Symptoms**: CI shows "High severity vulnerabilities found"

**Debug steps**:
```bash
# 1. Run audit locally to see details
pnpm audit

# 2. Check severity levels
pnpm audit --audit-level=high

# 3. Try updating vulnerable packages
pnpm update

# 4. Check for available fixes
pnpm audit --fix
```

**If no fix available**:
1. Check `docs/core/SECURITY.md` for mitigation strategies
2. Evaluate if vulnerability affects production code (vs dev dependencies)
3. Create issue to track: `github.com/cortex-tms/cortex-tms/issues/new`
4. Consider manual update or alternative package

**Common causes**:
- Transitive dependencies (you don't directly use the vulnerable package)
- Dev-only vulnerabilities (not in production bundle)
- False positives (vulnerability doesn't affect your usage)

---

### E2E Tests Fail

**Symptoms**: CLI commands don't behave as expected in tests

**Debug steps**:

**1. Check test output for details**:
```bash
# Run specific failing test with verbose output
pnpm test src/__tests__/init-e2e.test.ts -t "failing test name"
```

**2. Inspect temp directory**:
```typescript
// Add this to test for debugging:
beforeEach(async () => {
  tempDir = await createTempDir();
  console.log('Temp dir:', tempDir); // See where files are created
});

afterEach(async () => {
  // Comment this out temporarily to inspect files
  // await cleanupTempDir(tempDir);
});
```

**3. Run command manually**:
```bash
# Copy the exact command from test output
cd /tmp/cortex-test-xyz
node /path/to/bin/cortex-tms.js init --scope standard
```

**4. Check assertion patterns**:
```typescript
// ❌ Wrong: Doesn't work as either/or
expect(stdout).toContain('A') || expect(stdout).toContain('B')

// ✅ Right: Proper either/or check
expect(
  stdout.includes('A') || stdout.includes('B')
).toBe(true)
```

**Common issues**:
- Test expectations don't match actual CLI output (regex too strict)
- Fixture setup incomplete (missing files or configuration)
- Placeholder text not populated (use `populatePlaceholders` helper)
- Real vs test behavior mismatch (environment differences)

---

### `validate --strict` Fails

**Symptoms**: "Validation failed" with error count

**Debug steps**:
```bash
# 1. Run validate to see details
node bin/cortex-tms.js validate --strict

# 2. Check which files have issues
node bin/cortex-tms.js validate --verbose

# 3. Check mandatory files exist
ls -la NEXT-TASKS.md CLAUDE.md .cortexrc .github/copilot-instructions.md
```

**Common issues**:

**1. Placeholder text in files**:
```bash
# Check for placeholders
grep -r "\[Project Name\]" NEXT-TASKS.md docs/core/
grep -r "\[Feature Name\]" NEXT-TASKS.md

# Solution: Populate placeholders
# Replace [Project Name] with actual project name
```

**2. Missing mandatory files**:
```bash
# Create missing files
touch NEXT-TASKS.md
touch CLAUDE.md
mkdir -p .github && touch .github/copilot-instructions.md
```

**3. Invalid .cortexrc format**:
```bash
# Check JSON is valid
cat .cortexrc | jq .

# Fix common issues:
# - Missing commas
# - Trailing commas (not valid in JSON)
# - Unquoted keys or values
```

**See also**: `docs/core/ARCHITECTURE.md` for project structure requirements

---

### Build Fails

**Symptoms**: `pnpm run build` fails with TypeScript errors

**Debug steps**:
```bash
# 1. Clean and rebuild
rm -rf dist/
pnpm run build

# 2. Check TypeScript errors
npx tsc --noEmit

# 3. Check specific file
npx tsc --noEmit src/path/to/file.ts
```

**Common issues**:
- Type mismatches (wrong types after refactoring)
- Missing imports (forgot to import type)
- Zod schema issues (schema type doesn't match usage)

---

## ✅ Pre-Release Checklist

Before releasing a new version, verify:

### Code Quality
- [ ] All tests pass (`pnpm test`)
  - [ ] Unit tests: ~200+ passing
  - [ ] Integration tests: ~50+ passing
  - [ ] E2E tests: ~60+ passing
  - [ ] **Total: 300+ tests passing, 0 failures**

### Security
- [ ] No high-severity vulnerabilities (`pnpm run audit`)
- [ ] No `process.exit()` calls in `src/` (except `bin/cortex-tms.js`)
- [ ] All commands use Zod validation
- [ ] Path operations use `validateSafePath()` / `validateFilePath()` helpers
- [ ] Guardian sanitizes API keys in all output

### Build & Validation
- [ ] Build succeeds (`pnpm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Validation passes (`node bin/cortex-tms.js validate --strict`)
- [ ] CLI commands work (`node bin/cortex-tms.js --help`)

### Documentation
- [ ] CHANGELOG.md updated with release changes
- [ ] Security patterns documented (if new patterns added)
- [ ] Migration guide updated (if breaking changes)
- [ ] README.md reflects current version
- [ ] All cross-links valid (no 404s in docs)

### Version Management
- [ ] `package.json` version bumped
- [ ] Version tags synced (`node scripts/sync-project.js`)
- [ ] Git tag created (`git tag v3.x.x`)
- [ ] CHANGELOG section dated (change "Unreleased" to date)

---

## 🔄 When Adding a New Command

**Recipe for secure command implementation** (combines Patterns 12 & 13):

### 1. Define Zod Schema
```typescript
// src/utils/validation.ts
export const myCommandOptionsSchema = z.object({
  required: z.string().min(1),
  optional: z.boolean().optional().default(false),
  count: z.number().min(0).optional(),
});

export type MyCommandOptions = z.infer<typeof myCommandOptionsSchema>;
```

### 2. Validate at Command Entry
```typescript
// src/commands/my-command.ts
import { validateOptions } from '../utils/validation.js';
import { ValidationError, CLIError } from '../utils/errors.js';

export async function runMyCommand(rawOptions: unknown): Promise<void> {
  // Validate input (throws ValidationError on failure)
  const options = validateOptions(
    myCommandOptionsSchema,
    rawOptions,
    'my-command'
  );

  // Use validated options (type-safe)
  const value = options.required;
  const count = options.count ?? 10;

  // Command logic...
}
```

### 3. Throw Errors (Don't Exit)
```typescript
// ✅ DO: Throw errors from commands
if (!isValid(data)) {
  throw new ValidationError('Invalid data format', { data });
}

if (!fileExists(path)) {
  throw new FileNotFoundError(`File not found: ${path}`);
}

// ❌ DON'T: Call process.exit() in commands
// process.exit(1); // Never do this in src/commands/
```

### 4. Validate Paths
```typescript
// If command accepts file paths
import { validateSafePath, validateFilePath } from '../utils/validation.js';

// Option A: validateSafePath - returns {isValid, error, resolvedPath}
// Use when you want to handle validation errors yourself
const result = validateSafePath(userProvidedPath, baseDir);
if (!result.isValid) {
  throw new ValidationError(result.error);
}
const safePath = result.resolvedPath;

// Option B: validateFilePath - throws ValidationError automatically
// Also checks file existence. Use for simpler validation flows.
const safePath = validateFilePath(userProvidedPath, baseDir);
// If we get here, path is safe and file exists
```

### 5. Write Tests
```typescript
// src/__tests__/my-command.test.ts
describe('myCommand', () => {
  it('should validate options with Zod', async () => {
    await expect(
      runMyCommand({ invalid: true })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw CLIError, not call process.exit', async () => {
    const exitSpy = vi.spyOn(process, 'exit');

    await expect(
      runMyCommand({ invalid: true })
    ).rejects.toThrow(CLIError);

    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('should reject path traversal', async () => {
    await expect(
      runMyCommand({ path: '../../etc/passwd' })
    ).rejects.toThrow('Path traversal detected');
  });
});
```

### 6. Add E2E Tests
```typescript
// src/__tests__/my-command-e2e.test.ts
describe('MyCommand E2E', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  it('should work end-to-end', async () => {
    const result = await runCommand('my-command', ['--required', 'value'], tempDir);

    expectSuccess(result);
    expect(result.stdout).toContain('Success');
  });
});
```

**See also**:
- `docs/core/PATTERNS.md#pattern-12` - Error handling
- `docs/core/PATTERNS.md#pattern-13` - Input validation
- `src/commands/` - Example command implementations

---

## 📚 Related Documentation

**Security**:
- **Security Overview**: `docs/core/SECURITY.md` (threat model, mitigations)
- **Security Patterns**: `docs/core/PATTERNS.md` (error handling, validation)
- **Security Audit**: `CHANGELOG.md#v3.2.0` (AUDIT-1 to AUDIT-6)

**Testing**:
- **Test Structure**: `src/__tests__/` (unit, integration, E2E tests)
- **Test Utilities**: `src/__tests__/utils/` (helpers for E2E tests)

**Contributing**:
- **Contributing Guide**: `CONTRIBUTING.md` (if exists)
- **Git Standards**: `docs/core/GIT-STANDARDS.md` (commit conventions)
- **Code Patterns**: `docs/core/PATTERNS.md` (implementation patterns)

---

## 🆘 Getting Help

**If you encounter security issues**:
1. Check `docs/core/SECURITY.md` for overview
2. Read this guide for testing procedures
3. Check `docs/core/PATTERNS.md` for implementation patterns
4. Open issue: `github.com/cortex-tms/cortex-tms/issues/new`

**For security vulnerabilities**:
- **DO NOT** open public issues for security vulnerabilities
- Email: maintainers@cortex-tms.org (if configured)
- Follow responsible disclosure practices

---

**Version**: 3.2.0
**Last Updated**: 2026-01-31
**Maintained By**: Cortex TMS Contributors

<!-- @cortex-tms-version 3.1.0 -->
