# Migration Guide: Adopting TMS in Existing Projects

Most developers adopt Cortex TMS "mid-flight." This guide ensures a safe integration without clobbering your existing work.

## 1. Safe Initialization

When running `init` in an existing repo, Cortex will detect your files:

```bash
npx cortex-tms init
```

**⚠️ Safety Rule**: If you have existing `README.md` or `.gitignore` files, the CLI will detect these conflicts. When prompted: **"Warning: N TMS file(s) already exist. Overwrite them?"**, choose **No**.

This preserves your work. You can then manually copy individual templates from the `templates/` directory in the [Cortex TMS GitHub repository](https://github.com/cortex-tms/cortex-tms) as needed.

## 2. The "Nano-First" Strategy (Recommended)

Don't try to fill out 10 core docs on day one.

1. Run `init` with the **Nano** scope.
2. This adds `NEXT-TASKS.md` and `CLAUDE.md`.
3. Move your existing "TODOs" or "Issues" into the `NEXT-TASKS.md` table.
4. Point your AI agent to `CLAUDE.md` to begin the new workflow.

## 3. Incremental Core Docs

Once the "HOT" tier is working, add "WARM" tier files as you need them:

- Creating a new feature? Add `docs/core/PATTERNS.md`.
- Debugging a complex error? Add `docs/core/TROUBLESHOOTING.md`.

## 4. Handling File Collisions

- **README.md**: Cortex's template is AI-optimized. We recommend moving your current content to an `INTRODUCTION.md` and using the Cortex template as your new root `README.md`.
- **docs/**: If you already have a `docs/` folder, Cortex will place its core files in `docs/core/` to keep your project structure organized.

## 5. The First Maintenance Cycle

Once you complete your first task using TMS, execute the **Maintenance Protocol** (Archive and Truth Sync) to "set the habit" for the team.
