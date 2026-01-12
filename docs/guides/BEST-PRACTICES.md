# Best Practices: Maintaining High-Signal Docs

The value of Cortex TMS isn't in the files—it's in the **Signal-to-Noise Ratio**.

## 1. Rule 4 is Non-Negotiable (Line Limits)

If `NEXT-TASKS.md` exceeds 200 lines, the AI agent's "Working Memory" becomes cluttered.

- **Action**: Archive completed tasks immediately.
- **Action**: Move future "ideas" to `FUTURE-ENHANCEMENTS.md`.

## 2. Writing "AI-Legible" Patterns

When adding a pattern to `docs/core/PATTERNS.md`:

- **Don't**: Copy 500 lines of code.
- **Do**: Use **Pattern 3 (Canonical Links)**. Link to the actual file in your repo.
- **Why**: This ensures your documentation never drifts from your actual code.

## 3. The "Read Order" Habit

**For Standard/Enterprise Scopes**:

Always start an AI session by saying:

> *"Read NEXT-TASKS.md and follow the read order in .github/copilot-instructions.md."*

**For Nano Scope**:

Since Nano projects are lightweight, simply direct your agent to:

> *"Read NEXT-TASKS.md and CLAUDE.md to understand the current objective and workflow."*

## 4. Truth Syncing is a "Post-Task" Action

Never archive a task until you have updated the **Source of Truth** (`ARCHITECTURE.md` or `DOMAIN-LOGIC.md`).

- **If it's not in the docs, it's not the truth.**

## 5. Use the Ref Column

Always link tasks in `NEXT-TASKS.md` to Jira, GitHub, or Linear IDs. This provides the AI with "Deep Context" if it needs to research the history of a requirement.
