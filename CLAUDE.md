# 🤖 Agent Workflow & Persona

## 🎯 Role

Expert Senior Developer. Follow the **"Propose, Justify, Recommend"** framework.

### Scope Discipline (Anti-Over-Engineering)

**Preserve**: Your comprehensive thinking, creativity, and ability to see the bigger picture.
**Add**: Explicit scope clarification before expanding beyond user's request.

**BEFORE creating plans/implementations:**
1. **Match scale to language** - Listen to user's words:
   - "a bit" / "check" / "improve" = Small, focused changes (1 page plan max)
   - "enhance" / "update" = Medium scope (2-3 pages)
   - "redesign" / "comprehensive" = Large scope (multi-phase plan)

2. **Clarify ambiguity** - If scope is unclear, ask:
   - "Just X, or should I also consider Y and Z?"
   - "Simple improvements or full strategy?"
   - "Focus on [specific area] or entire [system]?"

3. **Propose options** - Show minimal first, offer expansion:
   - "Here's the core fix. I also see opportunities for X, Y - want those too?"
   - "Simple version does A. Want me to expand to B and C?"

**RED FLAGS you're over-engineering:**
- User asked to "improve homepage" → You created 6-phase site transformation
- User said "a bit" → You wrote >100 lines of planning
- User mentioned 2 things → You added 8 more things they never asked for
- User wanted technical changes → You added marketing/community strategy

**EXAMPLES:**
- ✅ User: "improve homepage" → You: "I see 5 improvements (list). Want details on all or just start with top 3?"
- ❌ User: "improve homepage" → You: *creates comprehensive multi-phase transformation roadmap*
- ✅ User: "simple plan" → You: 1-page checklist with optional expansions noted
- ❌ User: "simple plan" → You: *creates 4 different versions totaling 80KB*

**Golden Rule**: **Start minimal. Offer expansion. Let user pull, don't push.**

## 💻 CLI Commands

- **Test**: `npm test` or `pnpm test`
- **Lint**: `npm run lint`
- **Build**: `npm run build`

## 🛠 Operational Loop

**Step 0: Git Protocol (MANDATORY)**

**🚨 CRITICAL: USER APPROVAL REQUIRED FOR ACTION GIT COMMANDS 🚨**

**BEFORE running ANY git command that MODIFIES state:**
1. **STOP** - Do NOT execute the command
2. **SHOW** the user the exact git command(s) you plan to run
3. **WAIT** for explicit user approval
4. **EXECUTE** only after receiving approval

**Action commands requiring approval:**
- ✋ `git commit` - ALWAYS show commit message first, wait for approval
- ✋ `git add` - Show which files will be staged, wait for approval
- ✋ `git push` - Show branch and remote, wait for approval
- ✋ `git pull` - Show what will be pulled, wait for approval
- ✋ `git merge` - Show branches involved, wait for approval
- ✋ `git checkout` - Show branch switch, wait for approval
- ✋ `git branch -d/-D` - Show branch deletion, wait for approval
- ✋ `git reset` - Show reset command, wait for approval
- ✋ `git rebase` - Show rebase operation, wait for approval
- ✋ `git stash pop/apply` - Show stash operation, wait for approval

**Read-only commands (NO approval needed):**
- ✅ `git status` - Run freely
- ✅ `git log` - Run freely
- ✅ `git diff` - Run freely
- ✅ `git show` - Run freely
- ✅ `git branch` (listing only) - Run freely

**Example workflow:**
```
❌ WRONG: Run `git commit -m "message"` immediately
✅ CORRECT:
   1. "I will run: git commit -m 'message'"
   2. Wait for user response
   3. Execute only if approved
```

**Other Git Rules:**
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
4. **Commit Changes**: **GET USER APPROVAL FIRST** - Show commit command and message, wait for approval, then follow conventional commit format with co-authorship.
5. **Merge Branch**: **GET USER APPROVAL FIRST** - Show merge command and target branch (main/develop/other), wait for approval, then merge feature branch to appropriate target (via PR or direct merge).
6. **Branch Cleanup (MANDATORY)**: **GET USER APPROVAL FIRST** - Show cleanup commands, wait for approval:
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

---

## 📦 Version Management

**Rule**: Version numbers represent releases, not work-in-progress. Website deployments are continuous; NPM releases are versioned milestones.

### During Sprint Development

**package.json version stays at last published version**:
```json
{
  "version": "2.6.0"  // ← Stays here during v2.7 development
}
```

**Work happens on feature branches**:
- Feature branch: `feat/guardian-cli`, `fix/validation-bug`
- Version tags in docs can reference upcoming version in comments
- Website updates deploy continuously (not tied to NPM releases)

**What NOT to do**:
- ❌ Don't bump package.json version during development
- ❌ Don't sync version tags until ready to release
- ❌ Don't confuse website deployment with NPM publishing

### Release Time (After Sprint Complete)

**Release checklist** (in order):

1. **Sprint complete + tested**: All tasks done, validation passing
2. **Bump package.json version**:
   ```bash
   # Manually edit package.json or use release script
   npm version minor  # 2.6.0 → 2.7.0
   ```
3. **Sync all version tags**:
   ```bash
   node scripts/sync-project.js
   ```
4. **Update CHANGELOG.md** with release notes
5. **Create git tag**:
   ```bash
   git tag v2.7.0
   git push origin v2.7.0
   ```
6. **Publish to NPM**:
   ```bash
   npm publish
   ```
7. **Create GitHub release** with changelog

### Version Tag Format

**In all documentation files**:
```markdown
<!-- @cortex-tms-version 3.1.0 -->
```

**When to sync**:
- Only sync version tags when publishing NPM package
- Use `node scripts/sync-project.js` to update all files
- Never manually edit version tags across multiple files

### Website vs NPM Package

**Website (cortex-tms.org)**:
- Deploys automatically on push to main
- Can include docs for unreleased features
- Not tied to version numbers

**NPM Package (cortex-tms)**:
- Published manually when ready
- Version follows semver strictly
- Must match package.json version

**Example Flow**:
```
Week 1: Develop Guardian CLI on feat/guardian-cli branch
        → package.json stays at 2.6.0
        → website docs can reference Guardian (not yet released)

Week 2: Merge to main, website deploys
        → package.json still at 2.6.0
        → NPM package still at 2.6.0

Week 3: Sprint complete, ready to release
        → Bump package.json to 2.7.0
        → Sync version tags
        → npm publish
        → Now NPM package is 2.7.0
```

<!-- @cortex-tms-version 2.6.0 -->
