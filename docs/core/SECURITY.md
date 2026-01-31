# Security Practices

<!-- @cortex-tms-version 3.1.0 -->

This document outlines Cortex TMS's security practices and automated security checks.

## Automated Security Checks

### Dependency Vulnerability Scanning

**CI Integration**: All pull requests automatically run `pnpm audit` to check for known vulnerabilities in dependencies.

**Configuration**:
- **Audit Level**: `high` (fails on high/critical vulnerabilities)
- **Scope**: Production dependencies only (`--prod`)
- **Location**: `.github/workflows/pr-checks.yml`

**Local Usage**:
```bash
# Check for vulnerabilities
pnpm run audit

# View all vulnerabilities (including low/moderate)
pnpm audit --prod

# Attempt automatic fixes
pnpm run audit:fix
```

**How It Works**:
1. PR is opened or updated
2. CI runs `pnpm audit --audit-level=high --prod`
3. Build fails if high/critical vulnerabilities found
4. Developer fixes vulnerabilities locally
5. Push update to PR

**Fixing Vulnerabilities**:
```bash
# 1. View vulnerability details
pnpm audit --prod

# 2. Update affected packages
pnpm update <package-name>

# 3. If no fix available, evaluate risk
#    - Check if vulnerability affects your usage
#    - Consider alternative packages
#    - Document accepted risks in security review

# 4. Re-run audit to verify
pnpm run audit
```

## Security Features

### 1. API Key Redaction (AUDIT-6)

**Protection**: All API keys are automatically sanitized in error messages, logs, and CLI output.

**Implementation**: `src/utils/sanitize.ts`

**What's Protected**:
- OpenAI keys (`sk-...`, `sk-proj-...`)
- Anthropic keys (`sk-ant-...`)
- Bearer tokens
- Authorization headers
- Nested objects and arrays

**Example**:
```typescript
// Error contains: "Invalid key sk-ant-api03-xyz789"
// User sees: "Invalid key [REDACTED_API_KEY]"
```

### 2. Path Traversal Protection (AUDIT-5)

**Protection**: Template paths are validated to prevent directory traversal attacks.

**Implementation**: `src/utils/validation.ts` - `validateFilePath()`

**What's Blocked**:
- `../../etc/passwd`
- Absolute paths outside project
- Symlink attacks

### 3. Input Validation (AUDIT-2)

**Protection**: All CLI inputs validated using Zod schemas at command entry points.

**Implementation**: `src/utils/validation.ts`

**What's Validated**:
- File paths (existence, accessibility, no traversal)
- Command options (type, format, allowed values)
- API keys (format, required fields)
- Boolean flags (strict parsing)

### 4. Centralized Error Handling (AUDIT-1)

**Protection**: Consistent error handling prevents information leaks via stack traces.

**Implementation**: `src/utils/errors.ts`

**What's Prevented**:
- Unhandled exceptions with sensitive data
- Inconsistent error messages
- Stack traces in production output

## Security Best Practices

### For Developers

**When Adding Dependencies**:
1. Review package reputation and maintenance status
2. Check for known vulnerabilities: `pnpm audit`
3. Audit new dependencies in PR reviews
4. Prefer well-maintained packages with security track records

**When Handling User Input**:
1. Always validate input at command entry points
2. Use Zod schemas for type-safe validation
3. Sanitize file paths with `validateFilePath()`
4. Never trust user-provided paths

**When Displaying Errors**:
1. Use centralized error types (`CLIError`, `ValidationError`)
2. Never log sensitive data (API keys, tokens, passwords)
3. Sanitize error messages with `sanitizeApiKey()`
4. Provide helpful error context without exposing internals

### For Users

**API Key Security**:
- Store API keys in environment variables (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`)
- Never commit API keys to version control
- Use `.env` files (add to `.gitignore`)
- Rotate keys periodically

**Template Security**:
- Only use templates from trusted sources
- Review template contents before installation
- Be cautious with custom templates from unknown authors

## Security Audit History

### v3.2 Sprint: Security Hardening (Jan 2026)

**Completed**:
- ✅ AUDIT-1: Centralized Error Handling
- ✅ AUDIT-2: Zod Input Validation
- ✅ AUDIT-4: npm audit CI Integration
- ✅ AUDIT-5: Path Traversal Protection
- ✅ AUDIT-6: API Key Redaction

**Results**:
- Zero `process.exit()` calls in src/
- All CLI commands use Zod validation
- CI pipeline includes automated vulnerability scanning
- Template paths validated against traversal attacks
- API keys sanitized in all output paths
- 269 tests passing (including 36 new security tests)

## Reporting Security Issues

**For vulnerabilities in Cortex TMS**:
- Open a GitHub issue with `[SECURITY]` prefix
- Email: [security contact - to be added]
- Include: description, impact, reproduction steps

**For dependency vulnerabilities**:
1. Check if vulnerability affects Cortex TMS usage
2. Open issue with details and affected package
3. We'll evaluate and update dependencies as needed

## CI/CD Security

### GitHub Actions Workflows

**Security Checks in PRs**:
1. Dependency vulnerability scan (`pnpm audit`)
2. Test suite (including security tests)
3. Linter (code quality)
4. Build verification
5. Sensitive file change warnings

**Automated Protections**:
- Manual `dist/` edits blocked
- Sensitive config changes flagged
- Large PR warnings (review burden)

### Pre-commit Hooks

**Git Guardian Hook**:
- Validates branch naming conventions
- Prevents direct commits to main
- Enforces git workflow rules

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Anthropic API Security](https://docs.anthropic.com/claude/reference/security)
- [OpenAI API Security](https://platform.openai.com/docs/guides/safety-best-practices)

---

## Related Documentation

**Testing Security Features**:
- **Security Testing Guide**: `docs/guides/SECURITY-TESTING.md` (how to verify security measures)
- **Security Patterns**: `docs/core/PATTERNS.md#pattern-12` (error handling patterns)
- **Input Validation**: `docs/core/PATTERNS.md#pattern-13` (Zod validation patterns)

**Implementation Details**:
- **Error Classes**: `src/utils/errors.ts` (CLIError hierarchy)
- **Validation**: `src/utils/validation.ts` (Zod schemas, path validation)
- **Sanitization**: `src/utils/llm-client.ts` (API key redaction)

---

**Last Updated**: 2026-01-31 (v3.2 Security Hardening Complete)
**Next Review**: v3.3 (or when critical vulnerability reported)
