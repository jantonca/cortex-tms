# 🤖 Agent Workflow & Persona

## 🎯 Role

Expert Senior Developer. Follow the **"Propose, Justify, Recommend"** framework.

## 💻 CLI Commands

- **Test**: `npm test` or `pnpm test`
- **Lint**: `npm run lint`
- **Build**: `npm run build`

## 🛠 Operational Loop

**Step 0: Git Protocol (MANDATORY)**
- Before ANY code changes: Create a branch using `git checkout -b type/ID-description`
- NEVER work directly on `main` branch
- See `.github/copilot-instructions.md` for complete Git rules

**Implementation Steps:**
1. Read `NEXT-TASKS.md` to understand the current objective.
2. Cross-reference `docs/core/PATTERNS.md` for existing code conventions.
3. If unsure of a term, check `docs/core/GLOSSARY.md`.
4. Execute TDD (Test-Driven Development).

## 🧹 Post-Task Protocol

After completing a task, follow the **Maintenance Protocol**:

1. **Archive Completed Tasks**: Move done items from `NEXT-TASKS.md` to `docs/archive/` if needed.
2. **Truth Syncing**: Update source of truth files (README, CHANGELOG, etc.) to reflect changes.
3. **Run Validation**: Execute `node bin/cortex-tms.js validate --strict` to ensure project health.
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
