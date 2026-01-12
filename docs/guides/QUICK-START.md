# Quick Start Guide: Greenfield Projects

Welcome to the Cortex TMS ecosystem. This guide will get your new project AI-optimized in under 5 minutes.

## 1. Installation & Initialization

You don't need to install anything globally. Use `npx` to run the latest version:

```bash
mkdir my-new-project && cd my-new-project
npx cortex-tms init
```

## 2. Choosing Your Scope

The CLI will ask you to choose a **Project Scope**. This determines how much "documentation weight" your project starts with:

- **Nano**: 2 files (`NEXT-TASKS.md`, `CLAUDE.md`). Best for scripts or small utilities.
- **Standard**: 9 files. The recommended starting point for most products.
- **Enterprise**: 11 files. Adds advanced schemas and troubleshooting for complex repos.

## 3. The "Truth Sync" (First Pass)

Cortex uses `[Bracket Syntax]` for placeholders. Your first task is to fill these in:

1. Open `README.md` and define your project's purpose.
2. Open `docs/core/ARCHITECTURE.md` and fill out the **Quick Context** (the 3-bullet orientation for AI agents).
3. Open `NEXT-TASKS.md` and define your first sprint.

## 4. Verify Health

Run the validation tool to ensure you haven't missed any critical placeholders or violated line limits:

```bash
npx cortex-tms validate
```

## 5. Next Steps

- Read `docs/guides/BEST-PRACTICES.md` to learn how to keep your signal high.
- Check `docs/guides/CLI-USAGE.md` for advanced command flags.
