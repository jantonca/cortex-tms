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

Most developers adopt Cortex TMS "mid-flight." This section ensures a safe integration without clobbering your existing work.

### 1. Safe Initialization

When running `init` in an existing repo, Cortex will detect your files:

```bash
npx cortex-tms init
```

**⚠️ Safety Rule**: If you have existing `README.md` or `.gitignore` files, the CLI will detect these conflicts. When prompted: **"Warning: N TMS file(s) already exist. Overwrite them?"**, choose **No**.

This preserves your work. You can then manually copy individual templates from the `templates/` directory in the [Cortex TMS GitHub repository](https://github.com/cortex-tms/cortex-tms) as needed.

### 2. The "Nano-First" Strategy (Recommended)

Don't try to fill out 10 core docs on day one.

1. Run `init` with the **Nano** scope.
2. This adds `NEXT-TASKS.md` and `CLAUDE.md`.
3. Move your existing "TODOs" or "Issues" into the `NEXT-TASKS.md` table.
4. Point your AI agent to `CLAUDE.md` to begin the new workflow.

### 3. Incremental Core Docs

Once the "HOT" tier is working, add "WARM" tier files as you need them:

- Creating a new feature? Add `docs/core/PATTERNS.md`.
- Debugging a complex error? Add `docs/core/TROUBLESHOOTING.md`.

### 4. Handling File Collisions

- **README.md**: Cortex's template is AI-optimized. We recommend moving your current content to an `INTRODUCTION.md` and using the Cortex template as your new root `README.md`.
- **docs/**: If you already have a `docs/` folder, Cortex will place its core files in `docs/core/` to keep your project structure organized.

### 5. The First Maintenance Cycle

Once you complete your first task using TMS, execute the **Maintenance Protocol** (Archive and Truth Sync) to "set the habit" for the team.
