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

## 🔒 Confidentiality & Repository Strategy

**Two-Tier Repository System**:

### Public Repository (cortex-tms/cortex-tms)
**What Goes Here**: ✅
- Open source code (CLI, templates, examples)
- Technical documentation (non-sensitive)
- Public task lists (sanitized, no business strategy)
- Community-facing content

### Private Repository (cortex-tms/internal)
**What Goes Here**: ✅
- Business strategy and monetization plans
- Pricing strategies and financial projections
- Commercial roadmap and feature priorities
- Internal decision-making documents (ADRs with commercial context)
- Sensitive client work (migration retrospectives, custom implementations)
- Full task details with business rationale

**CRITICAL RULES**: ❌
- **NEVER** reference `cortex-tms/internal` in public commits, issues, or PRs
- **NEVER** copy content from private repo to public without sanitization
- **NEVER** discuss pricing, monetization, or commercial strategy in public files
- **NEVER** commit business strategy documents to public repository

**Workflow Guidance**:
- Public implementation tasks → Work in `cortex-tms/cortex-tms`
- Strategic planning, commercial features → Work in `cortex-tms/internal`
- Hybrid tasks → Implementation public, rationale private
- When in doubt → Keep it private (better safe than leaked)

<!-- @cortex-tms-version 2.6.0 -->
