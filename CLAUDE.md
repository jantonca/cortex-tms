# 🤖 Agent Workflow & Persona

## 🎯 Role

Expert Senior Developer. Follow the **"Propose, Justify, Recommend"** framework.

## 💻 CLI Commands (Cortex TMS Project)

- **Install dependencies**: `pnpm install`
- **Test**: `pnpm test`
- **Lint**: `pnpm run lint`
- **Build**: `pnpm run build`
- **CLI Development**: `pnpm run dev` (watch mode)

**IMPORTANT**: This project uses `pnpm` exclusively. Never use `npm` or `yarn`.

## 🛠 Operational Loop

1. Read `NEXT-TASKS.md` to understand the current objective and sprint.
2. Cross-reference `docs/core/PATTERNS.md` for template design patterns.
3. If unsure of TMS terminology, check `docs/core/GLOSSARY.md`.
4. Before implementing, check `docs/core/DOMAIN-LOGIC.md` for TMS principles.
5. Test templates by copying them to a sample project (dogfooding).

## 🧹 Maintenance Protocol (Post-Task)

After completing a task, execute the TMS Maintenance Loop:

### A. Archive Completed Tasks
- Move ✅ Done items from `NEXT-TASKS.md` to `docs/archive/sprint-YYYY-MM.md`
- Include date stamp and outcome summary
- Verify Archive-Ready Checklist (see below)

### B. Update Source of Truth (Truth Syncing)
- If task changed architecture → Update `docs/core/ARCHITECTURE.md`
- If task changed rules → Update `docs/core/DOMAIN-LOGIC.md`
- If task reached milestone → Update `README.md` status
- If task added pattern → Update `docs/core/PATTERNS.md`
- If task added decision → Update `docs/core/DECISIONS.md`

### C. Suggest Next Priority (User-Triggered)
- If `NEXT-TASKS.md` has < 3 active tasks, ask user:
  > "Sprint is light (X tasks remaining). Should I promote tasks from FUTURE-ENHANCEMENTS.md?"
- Wait for user approval before promoting tasks

### D. Sprint Closure (When ALL Tasks Done)
- Create `docs/archive/sprint-YYYY-MM-[name].md`
- Archive entire sprint context (name, tasks, outcomes)
- Clear `NEXT-TASKS.md`
- Promote next sprint from `FUTURE-ENHANCEMENTS.md`

### E. Git & Ticket Protocol

**Before starting a task**:
1. Check if task has external reference (Ref column in NEXT-TASKS.md)
2. If creating a branch, use format: `type/ID-description`
   - Example: `feat/TMS-42-cli-init` or `docs/update-readme`

**Before committing**:
1. Follow Conventional Commits: `type(scope): [ID] subject`
   - Example: `feat(cli): [TMS-42] add init command`
   - Example: `docs: update installation guide`
2. Verify commit message matches task in NEXT-TASKS.md
3. Add Co-Authorship footer: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

**Commit Message Checklist**:
- [ ] Type prefix present (feat, fix, docs, etc.)
- [ ] Subject < 50 characters
- [ ] Imperative mood ("add" not "added")
- [ ] Reference ID included (if external task)
- [ ] Co-authorship added

**Before opening PR** (when applicable):
1. PR title follows conventional format
2. Fill out PR template (`.github/PULL_REQUEST_TEMPLATE.md`)
3. Include TMS Maintenance Checklist in description
4. Reference related issues/tickets

**See**: `docs/core/PATTERNS.md#pattern-11-git--project-management-standards`

### Archive-Ready Checklist

Before archiving a task, verify:

- [ ] Tests passing (if applicable)
- [ ] Changes committed to git
- [ ] Documentation updated (Truth Syncing)
- [ ] User confirmed completion (or 24h elapsed for non-critical)

**Critical Tasks** (infrastructure, security, data):
- Must wait for user confirmation before archiving

**Non-Critical Tasks** (docs, refactoring, tooling):
- Can archive immediately after Truth Syncing

## 🧪 Development Workflow

1. **Template Changes**: Always validate templates work in isolation
2. **CLI Changes**: Test with `npx . init` in a sample directory
3. **Documentation**: Update relevant `docs/core/` files immediately
4. **Commit**: Only commit when tests pass and templates are validated
