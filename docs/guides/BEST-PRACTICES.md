# Best Practices - Pragmatic Rigor

**Philosophy**: Build systems that enforce strict governance while preserving operational flexibility.

**Core Principle**: **"Doors vs Walls"** - Use walls to prevent catastrophic errors, doors to guide recovery from acceptable risks.

---

## 🎯 Table of Contents

1. [The Pragmatic Rigor Framework](#the-pragmatic-rigor-framework)
2. [Case Study: Git Guardian](#case-study-git-guardian)
3. [Case Study: Emergency Hotfix Path](#case-study-emergency-hotfix-path)
4. [Error Messages as Documentation](#error-messages-as-documentation)
5. [Defensive Programming Patterns](#defensive-programming-patterns)
6. [When to Bend the Rules](#when-to-bend-the-rules)
7. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## The Pragmatic Rigor Framework

### What is Pragmatic Rigor?

**Pragmatic Rigor** is the practice of building systems that:
1. **Enforce strict rules** for high-risk operations (code changes, releases, destructive commands)
2. **Provide escape hatches** for emergencies (with audit trails)
3. **Guide users toward best practices** without blocking legitimate work

### The Spectrum: Walls vs Doors

| Concept | When to Use | Example | User Experience |
|---------|------------|---------|-----------------|
| **WALL** | Catastrophic errors | Code commits to `main` | Hard block + recovery instructions |
| **DOOR** | Acceptable risks | Doc commits to `main` | Warning + best practice guidance |
| **ESCAPE HATCH** | True emergencies | `BYPASS_GUARDIAN=true` | Allowed but logged for retrospectives |

### Key Insight

**Bad System**: Blocks everything OR allows everything
**Good System**: Blocks the dangerous, warns about the questionable, logs the exceptional

---

## Case Study: Git Guardian

**File**: `scripts/git-guardian.js`
**Purpose**: Enforce Git Protocol while allowing emergency flexibility
**Lines of Code**: 309

### The Problem

Teams need to enforce branching workflows (feature branches → main) but sometimes need to bypass for emergencies. Traditional solutions:

- ❌ **Naive Approach**: Block all commits to `main` → teams disable the hook
- ❌ **Permissive Approach**: Allow all commits → no governance

### The Solution: Tiered Enforcement

```javascript
if (hasCodeOrConfig) {
  // WALL: Block code/config changes to main
  this.blockCodeCommit();
} else if (hasDocsOnly) {
  // DOOR: Warn about doc changes to main
  this.warnDocCommit();
}
```

### Three-Tier System

#### Tier 1: WALL (Code/Config Changes to main)

**Behavior**: Hard block with clear recovery instructions

**Error Message**:
```
❌ ERROR: Direct Code Commits to main are PROHIBITED

Affected Files (3):
  • src/commands/validate.ts
  • package.json
  • tsconfig.json

💡 TO FIX:
1. Create a feature branch:
   git checkout -b feat/TMS-xxx-description

2. Commit your changes:
   git commit -m "feat(scope): [TMS-xxx] subject"

3. Merge when ready:
   git checkout main
   git merge feat/TMS-xxx-description --no-ff

⚠️  Emergency Bypass (use with caution):
   BYPASS_GUARDIAN=true git commit -m "your message"
   Note: Bypass will be logged to .guardian-bypass.log
```

**Why a WALL?**
- Code changes have cascading effects (bugs, breaking changes)
- Branching enables code review, testing, rollback
- Cost of bypass is LOW (30 seconds to create branch)
- Risk without branch is HIGH (no review, no rollback)

#### Tier 2: DOOR (Documentation Changes to main)

**Behavior**: Warn but allow

**Warning Message**:
```
⚠️  WARNING: Direct Documentation Commits to main

Affected Files (2):
  • README.md
  • CHANGELOG.md

💡 BEST PRACTICE:
For structured releases, use:
→ pnpm run release (automatic version bump + docs sync)

For quick hotfixes, create a branch:
→ git checkout -b docs/hotfix-description

✓ Allowing commit (docs-only)
```

**Why a DOOR?**
- Doc changes are low-risk (no runtime impact)
- Sometimes need quick fixes (typo in live docs)
- Cost of bypass is HIGH (multiple steps, friction)
- Risk without branch is LOW (easy to revert, no compilation)

#### Tier 3: ESCAPE HATCH (Bypass with Audit Trail)

**Behavior**: Allow but log to `.guardian-bypass.log`

**Log Entry**:
```json
{
  "timestamp": "2026-01-16T01:30:00.000Z",
  "user": "John Doe <john@example.com>",
  "branch": "main",
  "files": ["src/critical-fix.ts"],
  "categorization": {
    "code": ["src/critical-fix.ts"],
    "docs": [],
    "config": []
  }
}
```

**Why an ESCAPE HATCH?**
- True emergencies happen (production down, security patch)
- Blocking emergencies destroys trust → teams disable the hook
- Logging enables **retrospectives** ("Why did we bypass 5 times last month?")
- Accountability without bureaucracy

### Implementation Lessons

#### 1. Fail-Safe Design

```javascript
try {
  // Guardian logic
  this.applyGuardianRules();
  process.exit(0);
} catch (error) {
  // If guardian crashes, allow commit with warning
  this.warn('⚠️  Git Guardian encountered an error, allowing commit');
  process.exit(0); // NOT exit(1)
}
```

**Principle**: Better to allow a commit than to break the developer workflow. The hook should never be "that thing that breaks our builds."

#### 2. Clear Recovery Instructions

Every error includes:
1. **What went wrong** (current state)
2. **Why it matters** (rationale)
3. **How to fix it** (exact commands)
4. **Emergency option** (bypass instructions)

#### 3. Dynamic Error Messages

```javascript
this.detail(`   Current branch: ${this.currentBranch}`);
this.detail(`   Affected Files (${affectedFiles.length}):`);
```

Generic errors force users to debug. **Contextualized errors guide.**

---

## Case Study: Emergency Hotfix Path

**File**: `scripts/release-hotfix.js`
**Purpose**: Streamlined workflow for urgent documentation fixes
**Lines of Code**: 299

### The Problem

After a release, you notice a critical typo in the README on NPM. Options:

1. ❌ **Full Release Cycle**: Create branch → commit → merge → release (10 minutes, version bump)
2. ❌ **Bypass Guardian**: `BYPASS_GUARDIAN=true git commit` (bypasses validation)
3. ✅ **Hotfix Path**: `pnpm run release:hotfix` (streamlined, validated, logged)

### The Solution: A Validated Bypass

The Hotfix Path is a **"Hotfix Valve"** - a controlled bypass that:
- Validates it's safe (docs-only, on main)
- Uses `BYPASS_GUARDIAN` internally (so user doesn't need to know the escape hatch)
- Logs to audit trail (same as manual bypass)
- Provides excellent UX (single command)

### Five-Stage Validation

```javascript
this.validateMessage();     // Commit message required
this.validateBranch();       // Must be on main
this.validateStagedFiles();  // Changes must be staged
this.validateDocsOnly();     // CRITICAL: No code files
this.commitChanges();        // Execute with BYPASS_GUARDIAN=true
```

### Safety-First Architecture

#### Stage 1: Message Validation

```javascript
if (!this.message) {
  throw new Error('Commit message required. Use --message or -m flag');
}
```

**Why?** Even urgent fixes need descriptive messages for audit trail.

#### Stage 2: Branch Validation

```javascript
const branch = this.exec('git branch --show-current').trim();
if (branch !== 'main') {
  throw new Error(`Must be on main branch (currently on: ${branch})`);
}
```

**Why?** Hotfix path is for immediate production fixes, not feature work.

#### Stage 3: Staged Files Validation

```javascript
const staged = this.exec('git diff --cached --name-only').trim();
if (!staged) {
  throw new Error('No staged changes found. Stage files with: git add <files>');
}
```

**Why?** Prevents accidental empty commits or "oops, forgot to stage" commits.

#### Stage 4: Docs-Only Validation (The Safety Net)

```javascript
const codeFiles = nonDocFiles.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return codeExtensions.includes(ext);
});

if (codeFiles.length > 0) {
  log.warn('\n⚠️  WARNING: Non-documentation files detected:');
  codeFiles.slice(0, 5).forEach(file => log.detail(`  • ${file}`));

  throw new Error(
    'Hotfix path is for DOCS ONLY. For code changes, use feature branch workflow.'
  );
}
```

**Why?** This is the **WALL** that prevents misuse. Code changes go through branches, always.

#### Stage 5: Execute with Bypass

```javascript
const env = { ...process.env, BYPASS_GUARDIAN: 'true' };
execSync(`git commit -m "${this.message}"`, { env });
```

**Key Insight**: User doesn't see `BYPASS_GUARDIAN`. The hotfix script handles it internally, ensuring:
- Consistency (all bypasses logged the same way)
- Discoverability (users find `release:hotfix` in package.json, not a secret flag)
- Safety (validation happens before bypass)

### When to Use This Pattern

**Good Use Cases for "Hotfix Valves":**
- Urgent production fixes (docs, config)
- Time-sensitive operations (security patches)
- High-frequency, low-risk operations (feature flags, A/B tests)

**Bad Use Cases:**
- Skipping long tests (fix the tests)
- Avoiding code review (wrong problem)
- Routine work (not an emergency)

**Rule of Thumb**: If you use the hotfix path > 10% of the time, it's being abused. Review your processes.

---

## Error Messages as Documentation

**Principle**: Every error message should eliminate a support ticket.

### The Anatomy of a Great Error Message

#### 1. Context (What went wrong + current state)

```
❌ ERROR: Working directory must be clean (no uncommitted changes).

Current status:
 M package.json
 M src/commands/validate.ts
?? newfile.txt
  ... and 5 more files
```

**Why?** Users can verify the error without running separate commands.

#### 2. Recovery Options (Multiple paths when applicable)

```
💡 TO FIX:
  Option 1 (commit): git add -A && git commit -m "your message"
  Option 2 (stash):  git stash push -m "temp changes"
```

**Why?** Different users have different workflows. Offer choices.

#### 3. Rationale (Why the rule exists)

```
⚠️  Code changes to main bypass code review and testing.
    Use feature branches for safety and traceability.
```

**Why?** Users follow rules they understand. Explain the "why."

#### 4. Emergency Escape (When all else fails)

```
⚠️  Emergency Bypass (use with caution):
   BYPASS_GUARDIAN=true git commit -m "your message"
   Note: Bypass will be logged to .guardian-bypass.log
```

**Why?** Provides an escape hatch while discouraging casual use.

### Real-World Example: Rollback Failure

**Before (v2.5.0)**:
```
⚠️  Rollback failed - manual intervention required
Error: Command failed: git reset --hard HEAD
```

**Problems**:
- No guidance on what to do
- User doesn't know repository state
- Support ticket required

**After (v2.6.0)**:
```
⚠️  Rollback failed - manual intervention required
Error: Command failed: git tag -d v2.6.1

🔧 Manual Recovery Steps:

1. Restore files from backup:
   cp -r .cortex/backups/release-2026-01-16-01-30-00/* ./

2. Reset Git workspace:
   git reset --hard HEAD

3. Return to original branch:
   git checkout main

4. Delete release branch:
   git branch -D release/v2.6.1
   git push origin --delete release/v2.6.1 (if pushed)

5. Delete release tag:
   git tag -d v2.6.1
   git push origin :refs/tags/v2.6.1 (if pushed)

💡 After cleanup, check status:
   git status
   git branch -a
   git tag -l
```

**Improvements**:
- Step-by-step recovery instructions
- Commands use actual values (branch name, backup path)
- Verification commands at the end
- Shows conditional steps ("if pushed")

**Result**: User can recover without support. Error message IS the documentation.

---

## Defensive Programming Patterns

### Pattern 1: Rollback Tracking

**Problem**: When rollback fails, you don't know which steps succeeded.

**Solution**: Track completed steps

```javascript
const rollbackSteps = [];

try {
  // Step 1: Restore files
  if (this.backupPath && fs.existsSync(this.backupPath)) {
    // ... restore logic
    rollbackSteps.push('files_restored');
  }

  // Step 2: Reset Git
  this.exec('git reset --hard HEAD');
  rollbackSteps.push('git_reset');

  // Step 3: Return to branch
  this.exec(`git checkout ${this.originalBranch}`);
  rollbackSteps.push('branch_restored');

} catch (error) {
  // Show only the steps that DIDN'T complete
  if (!rollbackSteps.includes('files_restored')) {
    log.detail('1. Restore files from backup: ...');
  }
  if (!rollbackSteps.includes('git_reset')) {
    log.detail('2. Reset Git workspace: ...');
  }
  // etc.
}
```

**Benefit**: Error message shows only relevant recovery steps.

### Pattern 2: Backup Manifests

**Problem**: Backups without metadata are useless.

**Solution**: Store manifest with every backup

```javascript
const manifest = {
  timestamp: new Date().toISOString(),
  reason: 'Atomic release',
  files: ['package.json', 'README.md', 'CHANGELOG.md'],
  originalBranch: 'main',
  originalVersion: '2.5.0',
};

fs.writeFileSync(
  path.join(backupPath, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);
```

**Benefits**:
- Know what was backed up
- Know when it was backed up
- Know why it was backed up
- Can list backups without reading all files

### Pattern 3: Atomic Operations with Rollback

**Problem**: Multi-step operations can fail mid-flight.

**Solution**: All-or-nothing with automatic rollback

```javascript
class AtomicRelease {
  async execute() {
    try {
      await this.createBackup();      // Phase 0
      await this.createReleaseBranch(); // Phase 1
      await this.updateVersionFiles();  // Phase 2
      await this.commitChanges();       // Phase 3
      await this.pushToRemote();        // Phase 4
      await this.publishToNPM();        // Phase 5a
      await this.createGitHubRelease(); // Phase 5b
      await this.mergeToMain();         // Phase 6
      await this.cleanup();             // Phase 7

      log.success('✓ Release complete');
    } catch (error) {
      log.error(`Failed at Phase X: ${error.message}`);
      await this.rollback(); // Undo everything
      throw error;
    }
  }
}
```

**Key Principles**:
1. Backup BEFORE making changes
2. Track which phase failed
3. Rollback on ANY failure
4. Provide detailed error context

### Pattern 4: Fail-Safe Defaults

**Problem**: When in doubt, what should the system do?

**Solution**: Prefer safety over convenience

```javascript
// Bad: Defaults to destructive action
const cleanup = options.cleanup ?? true; // ❌ Deletes files by default

// Good: Defaults to safe action
const cleanup = options.cleanup ?? false; // ✅ Preserves files by default
```

**Examples**:
- Default to `--dry-run` for destructive operations
- Default to `exit(0)` on hook errors (don't block workflow)
- Default to preserving backups (storage is cheap, data loss is expensive)

---

## When to Bend the Rules

### The "2am Test"

**Question**: If a developer needs to do this at 2am to fix production, what would you want them to do?

**Example**:
```
Production is down. README has wrong database URL.
2am option: pnpm run release:hotfix -m "fix: correct DB URL" --push
vs.
"Proper" option: Create branch, commit, PR, review, merge, release (30+ minutes)
```

**Decision**: Hotfix path is the RIGHT choice here.

### Indicators You Need an Escape Hatch

1. **Rule is broken frequently** (>5% of the time)
   - Either relax the rule OR provide a validated bypass

2. **Rule has false positives** (blocks legitimate work)
   - Add exceptions OR improve detection

3. **Rule blocks emergencies** (production fixes)
   - Add escape hatch with logging

4. **Rule is slow** (waiting on CI for trivial changes)
   - Add fast path for specific cases

### Red Flags (When NOT to bypass)

1. **Convenience** ("It's faster to commit directly")
   - Fix: Make the right way faster

2. **Avoiding tests** ("Tests are flaky")
   - Fix: Fix the tests

3. **Skipping review** ("I know what I'm doing")
   - Fix: Improve review process

4. **Lack of understanding** ("I don't know how to create a branch")
   - Fix: Documentation and onboarding

**Rule**: Bypass is for EMERGENCIES, not CONVENIENCE.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: The Disabled Hook

**Symptom**: Teams disable pre-commit hooks because they're "annoying"

**Root Cause**:
- Hook blocks legitimate work
- Hook has too many false positives
- Hook is slow (>5 seconds)
- Hook provides no recovery guidance

**Solution**: Apply the "Doors vs Walls" framework
- Are you blocking low-risk operations? (Use a DOOR instead)
- Is your error message helpful? (Add recovery instructions)
- Is the hook slow? (Optimize or add `--no-verify` guidance)

### Anti-Pattern 2: The Opaque Error

**Bad**:
```
Error: Validation failed
```

**Why it's bad**:
- No context (what validation?)
- No recovery path
- User frustration → disable the check

**Good**:
```
❌ Validation failed: package.json version (2.5.0) doesn't match CHANGELOG (2.4.0)

To fix:
  Option 1: Update CHANGELOG: echo "## 2.5.0" >> CHANGELOG.md
  Option 2: Revert package.json: npm version 2.4.0 --no-git-tag-version

Why this matters: Version mismatches cause confusion for users and break automated releases.
```

### Anti-Pattern 3: The Support Nightmare

**Bad**:
```
Rollback failed - manual intervention required
```

**Why it's bad**:
- User opens support ticket
- Support investigates (30 minutes)
- Provides recovery steps
- User executes steps (10 minutes)

**Total Cost**: 40 minutes + support burden

**Good**:
```
Rollback failed - manual intervention required

🔧 Recovery Steps:
  1. Check backup: ls -la .cortex/backups/
  2. Restore files: cp .cortex/backups/latest/* ./
  3. Verify: git status
```

**Total Cost**: 2 minutes + zero support

**ROI**: 95% time savings + improved user trust

### Anti-Pattern 4: The Permission Prompt Hell

**Bad**: Ask for permission for every single step
```
Delete release branch? [y/N]
Delete local tag? [y/N]
Delete remote tag? [y/N]
Push to remote? [y/N]
... (20 prompts)
```

**Why it's bad**:
- Users spam "y" without reading
- Defeats the purpose of prompts
- Terrible UX

**Good**: Group related operations
```
Release will perform these actions:
  • Create release branch (release/v2.6.0)
  • Update version in 3 files
  • Push to remote
  • Publish to NPM
  • Create GitHub release
  • Merge to main

Proceed? [y/N]
```

**Principle**: One prompt for the entire operation, with clear consequences.

---

## Summary: Building Your Own "Hotfix Valve"

### Checklist for Pragmatic Rigor

- [ ] **Identify high-risk operations** (code changes, releases, destructive commands)
- [ ] **Apply tiered enforcement**:
  - [ ] WALL for catastrophic errors (hard block)
  - [ ] DOOR for acceptable risks (warn + guide)
  - [ ] ESCAPE HATCH for emergencies (log + allow)
- [ ] **Write helpful error messages**:
  - [ ] What went wrong (with context)
  - [ ] Why it matters (rationale)
  - [ ] How to fix it (exact commands)
  - [ ] Emergency option (bypass instructions)
- [ ] **Implement defensive programming**:
  - [ ] Backup before destructive operations
  - [ ] Track rollback progress
  - [ ] Fail-safe defaults
- [ ] **Review bypass logs**:
  - [ ] Are bypasses increasing? (rule is too strict)
  - [ ] Same person bypassing frequently? (training gap)
  - [ ] Bypasses for trivial reasons? (improve UX)

### The Golden Rule

**"Systems should prevent disasters, guide mistakes, and log exceptions."**

- **Prevent disasters**: Code to production without review
- **Guide mistakes**: Docs to production without branch
- **Log exceptions**: Emergency fixes during outages

Build systems humans trust, not systems humans disable.

---

## References

- `scripts/git-guardian.js` - Implementation of "Doors vs Walls"
- `scripts/release-hotfix.js` - Emergency Hotfix Path
- `scripts/release.js` - Atomic Release Engine with rollback
- `docs/error-audit-summary.md` - Error message improvements

---

**Last Updated**: 2026-01-16
**Version**: 2.6.0-beta.0
**Maintainer**: Cortex TMS Team
