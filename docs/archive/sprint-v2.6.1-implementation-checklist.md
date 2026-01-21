# v2.6.1 Emergency Patch - Implementation Checklist

**Status**: ✅ COMPLETED (January 21, 2026)
**Actual Effort**: 12 hours (1 focused day)
**Target Release**: January 24, 2026 (Released 3 days early)

> **Note**: This was the planning checklist created before implementation.
> For actual outcomes and retrospective, see: [sprint-v2.6.1-emergency-patch.md](sprint-v2.6.1-emergency-patch.md)

---

## Pre-Implementation

- [ ] Read audit reports in `/tmp/` directory
- [ ] Review `docs/AUDIT-REMEDIATION-PLAN.md`
- [ ] Review this checklist
- [ ] Create branch: `git checkout -b fix/audit-critical-bugs`

---

## CRITICAL-1: Scope-Aware Validation (2-3h)

### Understand the Problem
- [ ] Read Viability Report section on nano scope mismatch
- [ ] Test current behavior: `init --scope nano` → `validate` → observe failure
- [ ] Review `src/utils/config.ts` for scope definitions
- [ ] Review `src/utils/validator.ts` for mandatory files logic

### Implement Solution
- [ ] Open `src/utils/validator.ts`
- [ ] Add function `getMandatoryFilesForScope(scope: string): string[]`
- [ ] Update validation logic to read scope from `.cortexrc`
- [ ] Ensure nano scope only requires 2 files (NEXT-TASKS.md, CLAUDE.md)
- [ ] Ensure standard scope requires 3 files (add copilot-instructions.md)

### Code Example
```typescript
// src/utils/validator.ts

const getMandatoryFilesForScope = (scope: string): string[] => {
  const base = ['NEXT-TASKS.md', 'CLAUDE.md'];

  // Nano scope is minimal
  if (scope === 'nano') {
    return base;
  }

  // Standard and enterprise scopes need copilot instructions
  return [...base, '.github/copilot-instructions.md'];
};

// In validateFiles function:
const config = await readConfig(cwd);
const mandatoryFiles = getMandatoryFilesForScope(config.scope || 'standard');
```

### Test
- [ ] Add test to `src/__tests__/validate.test.ts`
- [ ] Test nano scope: should PASS with only 2 files
- [ ] Test standard scope: should FAIL without copilot-instructions.md
- [ ] Run test suite: `npm test`

### Verify
- [ ] Manual test: `init --scope nano` → `validate` → should PASS
- [ ] Manual test: `init --scope standard` → `validate` → should PASS
- [ ] Check `.cortexrc` contains correct scope value

---

## CRITICAL-2: Migration Path Handling (4-6h)

### Understand the Problem
- [ ] Read Viability Report section on migration paths
- [ ] Review `src/commands/migrate.ts` current implementation
- [ ] Trace how `docs/core/PATTERNS.md` would be processed
- [ ] Identify where basename-only logic breaks

### Implement Solution (Part A: Path Preservation)
- [ ] Open `src/commands/migrate.ts`
- [ ] Find where `filePath.split('/').pop()` is used
- [ ] Replace with relative path preservation logic
- [ ] Create `getTemplatePath(projectFile, templatesDir, cwd)` helper

### Code Example
```typescript
// src/commands/migrate.ts

const getTemplatePath = (
  projectFilePath: string,
  templatesDir: string,
  cwd: string
): string => {
  // Get relative path from project root
  const relativePath = path.relative(cwd, projectFilePath);

  // Map to template location (preserves nested structure)
  return path.join(templatesDir, relativePath);
};

// In checkIfCustomized function:
const templatePath = getTemplatePath(projectFile, templatesDir, cwd);

if (!fs.existsSync(templatePath)) {
  // Template doesn't exist at expected location
  return true; // Assume customized
}

// Compare content...
```

### Implement Solution (Part B: Placeholder Substitution)
- [ ] Open `src/utils/templates.ts`
- [ ] Review `applyReplacements` function
- [ ] Ensure it's called during upgrade application
- [ ] Test with project-specific values

### Code Example
```typescript
// src/commands/migrate.ts

const applyUpgrade = async (
  templatePath: string,
  targetPath: string,
  config: Config
) => {
  // Read template content
  let content = fs.readFileSync(templatePath, 'utf-8');

  // Apply placeholder replacements
  const replacements = {
    '[Project Name]': config.projectName || 'Your Project',
    '[Description]': config.description || 'Your project description',
    '[Repository URL]': config.repository || 'https://github.com/user/repo',
    // ... other placeholders
  };

  // Replace placeholders
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(placeholder, 'g'), value);
  }

  // Write to target
  fs.writeFileSync(targetPath, content, 'utf-8');
};
```

### Test
- [ ] Create test in `src/__tests__/migrate-nested-paths.test.ts`
- [ ] Test nested file migration: `docs/core/PATTERNS.md`
- [ ] Test placeholder substitution is applied
- [ ] Test customized files are detected correctly
- [ ] Run test suite: `npm test`

### Verify
- [ ] Manual test: Migrate from v2.5 → v2.6.1
- [ ] Check `docs/core/PATTERNS.md` upgrades correctly
- [ ] Check customizations are preserved
- [ ] Check placeholders are replaced

---

## CRITICAL-3: Prerelease Version Parsing (2-3h)

### Understand the Problem
- [ ] Read Viability Report section on version parsing
- [ ] Review `src/utils/templates.ts` for `extractVersion` function
- [ ] Test with prerelease version: `2.6.0-beta.1`
- [ ] Observe failure

### Implement Solution (Part A: extractVersion)
- [ ] Open `src/utils/templates.ts`
- [ ] Update `extractVersion` regex to support prerelease tags
- [ ] Test with multiple version formats

### Code Example
```typescript
// src/utils/templates.ts

export const extractVersion = (content: string): string | null => {
  // Support full semver including prerelease tags
  // Matches: 2.6.0, 2.6.0-beta.1, 2.6.0-alpha.3, 2.6.0-rc.2
  const versionMatch = content.match(/(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/);

  return versionMatch ? versionMatch[1] : null;
};
```

### Implement Solution (Part B: Release Script)
- [ ] Open `scripts/release.js`
- [ ] Find version parsing logic
- [ ] Add prerelease version support
- [ ] Add `--version X.Y.Z` flag for explicit version setting

### Code Example
```javascript
// scripts/release.js

const parseVersion = (versionString) => {
  // Match: major.minor.patch or major.minor.patch-prerelease
  const match = versionString.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);

  if (!match) {
    throw new Error(`Invalid version format: ${versionString}`);
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || null
  };
};

// When promoting from beta to stable:
const promoteToStable = (betaVersion) => {
  const parsed = parseVersion(betaVersion);
  // Remove prerelease tag
  return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
};
```

### Test
- [ ] Add tests to `src/__tests__/release.test.ts`
- [ ] Test extractVersion with `2.6.0` → should return `2.6.0`
- [ ] Test extractVersion with `2.6.0-beta.1` → should return `2.6.0-beta.1`
- [ ] Test extractVersion with `2.6.0-alpha.3` → should return `2.6.0-alpha.3`
- [ ] Test parseVersion function
- [ ] Run test suite: `npm test`

### Verify
- [ ] Manual test: Create file with `<!-- @cortex-tms-version 2.6.1 -->`
- [ ] Run migrate analysis → should parse version correctly
- [ ] Test release script with prerelease version

---

## Integration Tests (4-6h)

### Create Test Suite
- [ ] Create `src/__tests__/integration/` directory
- [ ] Create `nano-init-validate.test.ts`
- [ ] Create `migrate-workflow.test.ts`
- [ ] Create `full-lifecycle.test.ts`

### Test: Nano Init → Validate
```typescript
// src/__tests__/integration/nano-init-validate.test.ts

describe('Nano Scope Workflow', () => {
  it('should pass validation after nano init', async () => {
    // Init with nano scope
    await copyTemplates(templatesDir, tempDir, replacements, {
      scope: 'nano',
      overwrite: true,
    });

    // Write .cortexrc
    fs.writeFileSync(
      path.join(tempDir, '.cortexrc'),
      JSON.stringify({ scope: 'nano', projectName: 'Test' })
    );

    // Validate should PASS
    const checks = await runValidator(tempDir, { strict: false });
    const failedChecks = checks.filter(c => !c.passed && c.level === 'error');

    expect(failedChecks.length).toBe(0);
  });
});
```

### Test: Migrate Nested Paths
```typescript
// src/__tests__/integration/migrate-workflow.test.ts

describe('Migration Workflow', () => {
  it('should migrate nested docs/core files correctly', async () => {
    // Setup: Create project with old template version
    // ... setup code ...

    // Run migrate
    const analysis = await analyzeMigration(tempDir);

    // Should find docs/core/PATTERNS.md
    const patternsFile = analysis.files.find(f =>
      f.path.includes('docs/core/PATTERNS.md')
    );

    expect(patternsFile).toBeDefined();
    expect(patternsFile.needsUpgrade).toBe(true);
  });
});
```

### Test: Full Lifecycle
```typescript
// src/__tests__/integration/full-lifecycle.test.ts

describe('Full Lifecycle', () => {
  it('should complete init → validate → migrate → validate', async () => {
    // 1. Init standard scope
    await init({ scope: 'standard' });

    // 2. Validate should pass
    let checks = await validate({ strict: false });
    expect(checks.every(c => c.passed || c.level !== 'error')).toBe(true);

    // 3. Modify a file (simulate version change)
    // ... modify code ...

    // 4. Migrate should work
    await migrate({ dryRun: false });

    // 5. Validate should still pass
    checks = await validate({ strict: false });
    expect(checks.every(c => c.passed || c.level !== 'error')).toBe(true);
  });
});
```

### Run Tests
- [ ] Run unit tests: `npm test`
- [ ] Run integration tests: `npm test integration`
- [ ] Check coverage: `npm run test:coverage`
- [ ] All tests should pass

---

## Self-Validation & Manual Testing

### Dogfooding Test
- [ ] Run on Cortex repo itself: `node bin/cortex-tms.js validate --strict`
- [ ] Should pass with zero errors
- [ ] Check all files are correctly validated

### Smoke Tests
- [ ] Test 1: Fresh nano init
  ```bash
  cd /tmp/test-nano
  npx cortex-tms@latest init --scope nano
  npx cortex-tms@latest validate
  # Should PASS
  ```

- [ ] Test 2: Fresh standard init
  ```bash
  cd /tmp/test-standard
  npx cortex-tms@latest init --scope standard
  npx cortex-tms@latest validate
  # Should PASS
  ```

- [ ] Test 3: Migration from v2.5
  ```bash
  cd /tmp/test-migrate
  # Setup old version first
  npx cortex-tms@2.5.0 init
  # Now upgrade
  npx cortex-tms@2.6.1 migrate
  # Should work without errors
  ```

### Edge Cases
- [ ] Test with prerelease version in template
- [ ] Test with deeply nested paths (3+ levels)
- [ ] Test with customized files (should preserve changes)
- [ ] Test with missing `.cortexrc` (should use defaults)

---

## Documentation Updates

### Update CHANGELOG.md
- [ ] Open `CHANGELOG.md`
- [ ] Add v2.6.1 section at top
- [ ] Document all 3 bug fixes
- [ ] Credit external audits

### Example
```markdown
## [2.6.1] - 2026-01-24

### 🐛 Critical Bug Fixes

**Context**: Four comprehensive external audits identified trust-breaking bugs that prevented safe public adoption. This emergency patch addresses all critical issues.

#### CRITICAL-1: Scope-Aware Validation
- **Fixed**: Nano scope projects now pass validation correctly
- **Issue**: Fresh nano init would fail validation immediately
- **Solution**: Made validation mandatory files scope-aware
- **Files**: `src/utils/validator.ts`, `src/utils/config.ts`

#### CRITICAL-2: Migration Path Handling
- **Fixed**: Nested file migrations now work correctly
- **Issue**: `docs/core/PATTERNS.md` migration would break
- **Solution**: Preserve relative paths, apply placeholder substitution
- **Files**: `src/commands/migrate.ts`, `src/utils/templates.ts`

#### CRITICAL-3: Prerelease Version Parsing
- **Fixed**: Beta/alpha versions now parse correctly
- **Issue**: `2.6.0-beta.1` would break migrate analysis
- **Solution**: Updated regex to support semver prerelease tags
- **Files**: `src/utils/templates.ts`, `scripts/release.js`

### 🧪 Testing
- Added integration test suite for command workflows
- Added tests for nano scope validation
- Added tests for nested path migration
- Added tests for prerelease version parsing

### 📚 Documentation
- Added `docs/AUDIT-REMEDIATION-PLAN.md` (comprehensive analysis)
- Added `docs/ROADMAP-2026-Q1.md` (strategic roadmap)
- Updated `NEXT-TASKS.md` with v2.6.1 critical fixes
- Updated `FUTURE-ENHANCEMENTS.md` with audit insights

### 🙏 Credits
- External audits by independent reviewers
- QCS Analysis (Quality, Cost, Sustainability framework)
- Viability Report (evidence-based code audit)
- Analysis Report (architecture assessment)
```

---

## Release Process

### Pre-Release Checks
- [ ] All tests passing: `npm test`
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Self-validation passes: `node bin/cortex-tms.js validate --strict`
- [ ] No uncommitted changes: `git status`

### Version Bump
- [ ] Open `package.json`
- [ ] Change version from `2.6.0` to `2.6.1`
- [ ] Save file

### Sync Version Tags
- [ ] Run: `node scripts/sync-project.js`
- [ ] Verify all version tags updated
- [ ] Check: `grep -r "@cortex-tms-version" .`
- [ ] All should show `2.6.1`

### Git Workflow
- [ ] Stage all changes: `git add .`
- [ ] Commit with message:
  ```bash
  git commit -m "$(cat <<'EOF'
  fix: emergency patch for critical trust-breaking bugs (v2.6.1)

  Addresses 3 critical bugs identified via external audits:
  - CRITICAL-1: Scope-aware validation (nano init now passes validate)
  - CRITICAL-2: Migration path handling (nested files migrate correctly)
  - CRITICAL-3: Prerelease version parsing (beta versions work)

  Added comprehensive integration test suite.
  All tests passing.

  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
  EOF
  )"
  ```

- [ ] Create git tag: `git tag v2.6.1`
- [ ] Push to remote: `git push origin fix/audit-critical-bugs`
- [ ] Push tag: `git push origin v2.6.1`

### NPM Publish
- [ ] Ensure logged in: `npm whoami`
- [ ] Dry run: `npm publish --dry-run`
- [ ] Review output for issues
- [ ] Publish: `npm publish`
- [ ] Verify: `npm view cortex-tms version` should show `2.6.1`

### GitHub Release
- [ ] Go to: https://github.com/cortex-tms/cortex-tms/releases/new
- [ ] Tag: `v2.6.1`
- [ ] Title: `v2.6.1 - Emergency Patch (Critical Bug Fixes)`
- [ ] Description: Copy from CHANGELOG.md
- [ ] Check "This is a pre-release" if needed
- [ ] Click "Publish release"

### Merge to Main
- [ ] Create PR from `fix/audit-critical-bugs` to `main`
- [ ] Add description: Link to audit docs, summarize fixes
- [ ] Review changes one final time
- [ ] Merge PR (squash or merge commit based on preference)
- [ ] Delete feature branch

### Branch Cleanup
- [ ] Checkout main: `git checkout main`
- [ ] Pull latest: `git pull origin main`
- [ ] Delete local branch: `git branch -d fix/audit-critical-bugs`
- [ ] Verify branch is gone: `git branch -a`

---

## Post-Release

### Announce (Low-Key, Transparency)
- [ ] Update README.md badge if needed
- [ ] Tweet (optional): "Fixed 3 critical bugs found in external audits. v2.6.1 is now safe for public use. Thanks to the audit team for catching these early."
- [ ] Discord/Slack (if applicable): Brief announcement

### Monitor
- [ ] Watch for npm download stats (next 24h)
- [ ] Watch for GitHub issues (next 48h)
- [ ] Check for regression reports
- [ ] Be ready to hotfix if needed

### Document Lessons Learned
- [ ] Update `docs/PATTERNS.md` if needed
- [ ] Note: "Always test command interactions, not just functions"
- [ ] Note: "Integration tests catch bugs unit tests miss"

---

## Success Criteria

✅ **v2.6.1 is successful if:**

1. All 3 critical bugs are fixed
2. `init --scope nano` → `validate` → PASS
3. Nested path migration works
4. Prerelease versions parse correctly
5. All tests pass
6. Zero regression reports in first week
7. Ready to begin v2.7 work

---

## If Something Goes Wrong

### Rollback Plan
- [ ] NPM: `npm unpublish cortex-tms@2.6.1` (within 24h of publish)
- [ ] GitHub: Mark release as "Pre-release" or delete
- [ ] Git: Revert commit on main
- [ ] Communicate: "We found an issue in v2.6.1, please use v2.6.0 while we fix it"

### Debug Checklist
- [ ] Check error logs
- [ ] Reproduce issue locally
- [ ] Check if tests cover the case
- [ ] Add test for regression
- [ ] Fix and re-release as v2.6.2

---

## Time Tracking

Track actual vs estimated time to improve future estimates:

| Task | Estimated | Actual | Notes |
|------|-----------|--------|-------|
| CRITICAL-1 | 2-3h | ___ | |
| CRITICAL-2 | 4-6h | ___ | |
| CRITICAL-3 | 2-3h | ___ | |
| Integration Tests | 4-6h | ___ | |
| Release Process | 1-2h | ___ | |
| **Total** | **8-12h** | ___ | |

---

## Notes & Observations

Use this space to document anything unexpected:

```
-
-
-
```

---

**Ready to begin? Start with the pre-implementation checklist above!**

<!-- @cortex-tms-version 2.6.0 -->
