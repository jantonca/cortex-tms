# Migration Guide

This guide covers two scenarios:
1. **Upgrading** from an earlier version of Cortex TMS
2. **Adopting** Cortex TMS in an existing project for the first time

---

## Upgrading to v3.2.0

### Overview

v3.2.0 is a **security and testing** release. No breaking changes to CLI usage, but improved validation may catch issues that previously passed silently.

### What Changed

**Security Improvements**:
- All commands now use centralized error handling
- Input validation is stricter (Zod schemas)
- Path operations validated to prevent directory traversal
- Guardian API keys sanitized in all output

**Testing**:
- 47 new E2E tests (61 total)
- CI includes automated vulnerability scanning

### Migration Steps

1. **Update package**:
   ```bash
   npm install -g cortex-tms@3.2.0
   # or
   pnpm add -D cortex-tms@3.2.0
   ```

2. **Run validation**:
   ```bash
   cortex-tms validate --strict
   ```
   This will catch any project structure issues that now fail validation.

3. **Update templates** (if needed):
   ```bash
   cortex-tms migrate
   ```
   Follow prompts to update to latest template versions.

4. **Check for stricter validation**:
   If you were passing invalid options to commands (e.g., wrong types, missing required fields), v3.2.0 will now catch these at runtime.

### Breaking Changes

**None**. v3.2.0 is backward-compatible with v3.1.x.

**Behavioral Changes**:
- Commands now exit cleanly with error messages instead of process crashes
- Invalid CLI options now fail fast with clear Zod validation errors
- Path operations outside project directory are rejected

### If You Encounter Issues

1. Check error message (now more descriptive with Zod validation)
2. Run `cortex-tms validate --strict` to check project health
3. See `docs/guides/SECURITY-TESTING.md` for troubleshooting
4. Open issue: https://github.com/cortex-tms/cortex-tms/issues

### Recommended Follow-Up

After upgrading:
- Review `docs/core/PATTERNS.md` for new error handling patterns (Patterns 12 & 13)
- Read `docs/guides/SECURITY-TESTING.md` if contributing
- Update your CI to include `pnpm audit` checks

---

## Adopting TMS in Existing Projects

Many developers adopt Cortex TMS "mid-flight." This section is designed to help you integrate TMS safely without clobbering your existing work.

### Overview

This comprehensive guide walks you through migrating an existing project to Cortex TMS structure. Estimated time: **15 minutes to 4 hours** depending on existing documentation.

**Quick Navigation**:
- [Pre-Migration Checklist](#pre-migration-checklist) - Prepare for migration
- [Analyze Your Project](#analyze-your-project) - Automated recommendations
- [Step-by-Step Migration](#step-by-step-migration) - Complete process
- [Common Patterns](#common-patterns) - Doc mapping reference
- [Post-Migration](#post-migration) - Validation and testing

---

### Pre-Migration Checklist

Before starting, complete these preparation steps:

- [ ] **Backup existing docs**: Commit all changes, tag current state
  ```bash
  git add -A
  git commit -m "chore: backup before TMS migration"
  git tag pre-tms-migration
  ```

- [ ] **Analyze project structure**: Run automated analysis
  ```bash
  npx cortex-tms analyze
  ```
  This shows your current docs, recommended TMS scope, and (when available) potential token/cost savings.

- [ ] **Review migration strategy**: The analyze output suggests which files to keep, migrate, or archive

- [ ] **Choose scope**: Based on project size
  - **Nano** (2 files): Small projects, quick start
  - **Standard** (9 files): Most projects
  - **Enterprise** (15 files): Large teams, complex projects

- [ ] **Plan downtime**: While migration is safe, plan for ~30 min without active AI sessions

---

### Analyze Your Project

**First, run the analyzer** to get automated recommendations:

```bash
npx cortex-tms analyze
```

**Output includes**:
- Project type and size
- Existing documentation quality assessment
- Recommended TMS scope
- Migration strategy steps
- Potential token/cost savings

**Example output** (illustrative only; your numbers will be different):
```
📊 Project Overview
  Name: my-app
  Type: Next.js Web App
  Size: 42 files, ~8,300 LOC
  Documentation: 12 files found

💡 Recommended TMS Structure
  Scope: standard (9 files)

  Migration Strategy:
  1. Keep README.md as project overview (no change)
  2. Migrate CONTRIBUTING.md → docs/core/PATTERNS.md
  3. Migrate docs/architecture.md → docs/core/ARCHITECTURE.md
  4. Create new: NEXT-TASKS.md, CLAUDE.md

  Estimated effort: ~1-2 hours

💰 Potential Savings with TMS
  Context reduction: 45,231 tokens (72.3%)
  Savings per month: ~$8.15
```

Use this output to plan your migration approach.

---

### Step-by-Step Migration

#### Step 1: Safe Initialization

Initialize TMS structure **without overwriting** existing files:

```bash
npx cortex-tms init --scope standard
```

**When prompted**: *"Warning: N TMS file(s) already exist. Overwrite them?"*
→ Choose **No** to preserve your existing work

This creates TMS files that don't conflict with your existing docs.

#### Step 2: Map Existing Docs to TMS Structure

Use the [Common Patterns](#common-patterns) table below to map your existing documentation to TMS files.

**Recommended approach**:
1. Start with HOT tier (NEXT-TASKS.md, CLAUDE.md)
2. Migrate WARM tier incrementally (PATTERNS.md, ARCHITECTURE.md, etc.)
3. Archive old docs to docs/archive/ (preserve history)

#### Step 3: Migrate Content

For each file mapping:

**Example: CONTRIBUTING.md → docs/core/PATTERNS.md**

1. Open both files side-by-side
2. Copy relevant sections from CONTRIBUTING.md
3. Paste into appropriate sections in PATTERNS.md
4. Preserve your team's specific patterns and conventions
5. Move original to `docs/archive/legacy-contributing.md`

**Keep your voice**: TMS templates are starting points. Customize with your team's language and examples.

#### Step 4: Update Cross-References

After migrating content, update links:

```bash
# Find all markdown links to old docs
grep -r "CONTRIBUTING.md" docs/
grep -r "docs/arch" docs/

# Update to new paths
# CONTRIBUTING.md → docs/core/PATTERNS.md
# docs/arch.md → docs/core/ARCHITECTURE.md
```

#### Step 5: Archive Legacy Docs

Don't delete! Archive for reference:

```bash
mkdir -p docs/archive/pre-tms
mv CONTRIBUTING.md docs/archive/pre-tms/
mv docs/arch.md docs/archive/pre-tms/
# etc.
```

---

### Common Patterns

**Standard Documentation Mappings**:

| Your Existing Doc | TMS Destination | Action | Notes |
|-------------------|-----------------|--------|-------|
| `README.md` | `README.md` | **Keep as-is** | TMS-compatible already |
| `CONTRIBUTING.md` | `docs/core/PATTERNS.md` | **Migrate** | Code conventions, style guides |
| `ARCHITECTURE.md` | `docs/core/ARCHITECTURE.md` | **Migrate** | System design, diagrams |
| `docs/design/*` | `docs/core/ARCHITECTURE.md` | **Consolidate** | Merge architecture docs |
| `TODO.md` | `NEXT-TASKS.md` | **Migrate** | Active tasks, sprint work |
| `ROADMAP.md` | `FUTURE-ENHANCEMENTS.md` | **Migrate** | Long-term plans |
| `CHANGELOG.md` | `CHANGELOG.md` | **Keep** | No change needed |
| `docs/api/*` | `docs/core/SCHEMA.md` | **Migrate** | API schemas, contracts |
| `docs/troubleshooting/*` | `docs/core/TROUBLESHOOTING.md` | **Consolidate** | Known issues, fixes |
| `docs/decisions/*` | `docs/core/DECISIONS.md` | **Migrate** | ADRs, technical decisions |
| `.github/CODEOWNERS` | `.github/CODEOWNERS` | **Keep** | No change needed |
| Old sprint docs | `docs/archive/` | **Archive** | Preserve history |

**AI Collaboration Files** (new with TMS):

| TMS File | Purpose | Create From |
|----------|---------|-------------|
| `CLAUDE.md` | AI agent instructions | New (use template) |
| `.github/copilot-instructions.md` | GitHub Copilot settings | New (use template) |

**Tier Classification**:

- **HOT tier** (always loaded): `NEXT-TASKS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`
- **WARM tier** (on-demand): `docs/core/*.md` files
- **COLD tier** (archived): `docs/archive/**/*.md`

---

### Post-Migration

#### 1. Run Validation

Ensure TMS structure is correct:

```bash
npx cortex-tms validate --strict
```

**Fix any warnings**:
- Missing mandatory files
- Placeholder content not filled
- Broken cross-references

#### 2. Update Team Documentation

Inform your team about the new structure:

- Update contributing guide with TMS workflow
- Share CLAUDE.md location for AI sessions
- Document how to update NEXT-TASKS.md

**Quick team message template**:
```
We've migrated to Cortex TMS! 🧠

New workflow:
1. Check NEXT-TASKS.md for current sprint
2. Start AI sessions with: cortex-tms prompt init-session
3. Update docs in docs/core/ as needed

Questions? See docs/guides/MIGRATION-GUIDE.md
```

#### 3. Test AI Session Flow

Verify the migration works:

```bash
# 1. Generate AI session prompt
npx cortex-tms prompt init-session

# 2. Copy output to your AI tool (Claude Code, Cursor, Copilot)

# 3. Test basic AI tasks:
#    - Ask AI to read NEXT-TASKS.md
#    - Ask AI to explain a code pattern
#    - Verify AI references docs/core/ files correctly
```

#### 4. Measure Context Savings

Check actual token reduction:

```bash
npx cortex-tms status --tokens
```

**What we typically see in our own projects**:
- ~60-70% context reduction when using HOT/WARM/COLD tiering
- Faster AI responses (less context to process)
- Lower API costs per session

Your results will vary based on project size, structure, and how often you use AI.

#### 5. First Maintenance Cycle

After completing your first task with TMS:

1. **Archive completed work**: Move done tasks from NEXT-TASKS.md to docs/archive/
2. **Truth sync**: Update README, CHANGELOG if needed
3. **Validate**: Run `cortex-tms validate` to ensure health

This establishes the TMS workflow habit for your team.

---

### Troubleshooting

**"Init command overwrote my files!"**
- Restore from git: `git checkout HEAD -- README.md CONTRIBUTING.md`
- Next time, choose **No** when prompted about overwriting
- Or use `--dry-run` first: `npx cortex-tms init --dry-run`

**"Too many placeholders after init"**
- Normal! Fill them incrementally
- Use `cortex-tms validate` to see which are critical
- Focus on HOT tier first (NEXT-TASKS.md, CLAUDE.md)

**"My team doesn't know where docs are now"**
- Add to README: "See docs/core/ for architecture and patterns"
- Pin message in Slack/Discord with new structure
- Update contributing guide with TMS workflow

**"AI still loads too many files"**
- Check tier tags: Run `grep -r "@cortex-tms-tier" docs/`
- Verify COLD tier files in docs/archive/
- Use `status --tokens` to see actual breakdown

---

### Quick Start (TL;DR)

For experienced developers who want the fastest path:

```bash
# 1. Analyze project
npx cortex-tms analyze

# 2. Initialize (don't overwrite)
npx cortex-tms init --scope standard
# Choose "No" when prompted about existing files

# 3. Migrate key docs
# - TODO/issues → NEXT-TASKS.md
# - Patterns/style → docs/core/PATTERNS.md
# - Architecture → docs/core/ARCHITECTURE.md

# 4. Validate
npx cortex-tms validate --strict

# 5. Test AI session
npx cortex-tms prompt init-session
```

Done! Your project now has TMS structure.
