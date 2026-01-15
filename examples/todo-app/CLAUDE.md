# 🤖 Agent Workflow & Persona

## 🎯 Role

Expert Senior Developer. Follow the **"Propose, Justify, Recommend"** framework.

## 💻 CLI Commands (Todo App)

- **Development server**: `pnpm dev`
- **Build production**: `pnpm build`
- **Start production**: `pnpm start`
- **Lint**: `pnpm lint`
- **Type check**: `pnpm tsc --noEmit`

**IMPORTANT**: This project uses `pnpm` exclusively. Never use `npm` or `yarn`.

## 🛠 Operational Loop

**Step 0: Git Protocol (MANDATORY)**
- Before ANY code changes: Create a branch using `git checkout -b type/ID-description`
- NEVER work directly on `main` branch
- See `.github/copilot-instructions.md` for complete Git rules

**Implementation Steps:**
1. Read `NEXT-TASKS.md` to understand the current objective and sprint.
2. Cross-reference `docs/core/PATTERNS.md` for React/Next.js component patterns.
3. If unsure of terminology, check `docs/core/GLOSSARY.md`.
4. Before implementing, check `docs/core/DOMAIN-LOGIC.md` for todo business rules.
5. Follow `docs/core/ARCHITECTURE.md` for localStorage strategy and component structure.

## 🧹 Post-Task Protocol

After completing a task, follow the **Maintenance Protocol**:

1. **Archive Completed Tasks**: Move done items from `NEXT-TASKS.md` to `docs/archive/` if needed.
2. **Truth Syncing**: Update source of truth files (README, CHANGELOG, etc.) to reflect changes.
3. **Run Validation**: Execute `pnpm tsc --noEmit && pnpm lint` to ensure project health.
4. **Commit Changes**: Follow conventional commit format with co-authorship.
5. **Merge to Main**: Merge feature branch to `main` (via PR or direct merge).
6. **Branch Cleanup (MANDATORY)**:
   ```bash
   git checkout main
   git pull origin main
   git branch -d <feature-branch-name>
   ```
7. **Suggest Next Priority**: If `NEXT-TASKS.md` has < 3 tasks, propose new ones.

**Exception**: Small tasks (typos, formatting) only require git commit and branch cleanup.

<!-- @cortex-tms-version 2.5.0 -->
