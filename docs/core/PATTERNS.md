# Implementation Patterns (Cortex TMS)

This document describes the patterns used when designing and maintaining Cortex TMS templates.

## 🔍 Quick Reference

| Need | Pattern | Line |
|:-----|:--------|:-----|
| Template placeholders | Pattern 1: Placeholder Syntax | 7 |
| Multi-framework support | Pattern 2: Framework-Agnostic | 44 |
| Reference real code | Pattern 3: Canonical Links | 78 |
| Template guidance | Pattern 4: Inline Documentation | 111 |
| File organization | Pattern 5: Tiered Organization | 144 |
| File size limits | Pattern 6: Size Limits on HOT Files | 186 |
| CLI customization | Pattern 7: Modular Selection | 221 |
| Clean templates | Pattern 8: No Meta-Documentation | 250 |
| When to archive | Pattern 9: Archive Trigger Events | 283 |
| Testing templates | Pattern 10: Validation with AI Agents | 313 |
| Git & commits | Pattern 11: Git & PM Standards | 353 |

---

## Pattern 1: Placeholder Syntax

**Rule**: All user-customizable content in templates uses `[Description]` syntax with optional examples.

### ✅ Canonical Examples

**Location**: `templates/NEXT-TASKS.md:3`

```markdown
## Active Sprint: [Feature Name]

**Why this matters**: [Briefly describe user value or technical necessity]
```

**Location**: `templates/.github/copilot-instructions.md:5`

```markdown
- **Tech Stack**: [e.g., Next.js 15, TypeScript Strict, Tailwind CSS]
```

### ❌ Anti-Pattern (What NOT to do)

```markdown
<!-- Bad: Using TODO or FIXME -->
## Active Sprint: TODO

<!-- Bad: Using <placeholder> XML tags -->
## Active Sprint: <insert feature name here>

<!-- Bad: Empty with no guidance -->
## Active Sprint:
```

**Why it fails**: AI agents don't reliably detect `TODO` as a placeholder. The `[Bracket Syntax]` is explicit and easily parseable.

---

## Pattern 2: Framework-Agnostic Templates

**Rule**: Templates in `templates/` must work for any tech stack. Provide examples, not requirements.

### ✅ Canonical Example

**Location**: `templates/docs/core/ARCHITECTURE.md` (when completed)

```markdown
## Tech Stack

- **Frontend**: [e.g., Next.js 15, Vue 3, Svelte]
- **Backend**: [e.g., Express, Fastify, NestJS]
- **Database**: [e.g., PostgreSQL, MongoDB, Redis]
```

### ❌ Anti-Pattern

```markdown
<!-- Bad: Hardcoding a tech stack -->
## Tech Stack

- Next.js 15
- React 18
- Tailwind CSS
- PostgreSQL
```

**Why it fails**: Users may use Vue, Svelte, or build a CLI tool with no frontend. Templates must be adaptable.

**Exception**: Example projects (`examples/todo-app/`) can use specific tech stacks.

---

## Pattern 3: Canonical Links Over Code Duplication

**Rule**: When documenting a pattern, reference the real implementation instead of duplicating code.

### ✅ Canonical Example

**Location**: `docs/core/PATTERNS.md` (this file, meta-example)

```markdown
## Pattern 1: Placeholder Syntax

**Location**: `templates/NEXT-TASKS.md:3`

[Brief code snippet showing the pattern in context]
```

### ❌ Anti-Pattern

```markdown
<!-- Bad: Copying entire files into docs -->
## NEXT-TASKS.md Structure

Here's the complete file:
[200 lines of duplicated content]
```

**Why it fails**: Duplication causes drift. When templates update, docs become stale.

**References**:
- **Domain Logic**: `DOMAIN-LOGIC.md#rule-8-canonical-links-over-duplication`

---

## Pattern 4: Inline Documentation in Templates

**Rule**: Templates should include brief inline comments explaining what users should customize.

### ✅ Canonical Example

**Location**: `templates/NEXT-TASKS.md`

```markdown
## 🎯 Definition of Done

<!-- Customize this checklist based on your project's quality standards -->
- [ ] Tests passing
- [ ] Documentation updated in `docs/core/`
- [ ] Code follows `docs/core/PATTERNS.md`
```

### ❌ Anti-Pattern

```markdown
<!-- Bad: No guidance -->
## 🎯 Definition of Done

- [ ] Tests passing
- [ ] Documentation updated
```

**Why it fails**: Users don't know what to customize or why. Inline comments provide just-in-time guidance.

**Balance**: Don't over-comment. Keep it concise (1 line per section max).

---

## Pattern 5: Tiered File Organization

**Rule**: Files are organized by access frequency (HOT/WARM/COLD), not by content type.

### ✅ Canonical Example

**Location**: Root directory structure

```
.
├── NEXT-TASKS.md          # HOT
├── CLAUDE.md              # HOT
├── .github/
│   └── copilot-instructions.md  # HOT
├── docs/
│   ├── core/              # WARM
│   │   ├── ARCHITECTURE.md
│   │   └── PATTERNS.md
│   └── archive/           # COLD
│       └── v1.0-CHANGELOG.md
```

### ❌ Anti-Pattern

```
<!-- Bad: Organizing by content type -->
.
├── docs/
│   ├── architecture/
│   ├── tasks/
│   ├── decisions/
│   └── changelog/
```

**Why it fails**: AI agents don't know which docs to prioritize. The tier structure makes it explicit.

**References**:
- **Domain Logic**: `DOMAIN-LOGIC.md#rule-1-the-tier-hierarchy-is-sacred`
- **Architecture**: `ARCHITECTURE.md#the-tiered-memory-system`

---

## Pattern 6: Size Limits on HOT Files

**Rule**: HOT files have strict line limits to preserve AI agent context budget.

### ✅ Canonical Example

**Enforcement**: See `DOMAIN-LOGIC.md#rule-4-context-budget-enforcement`

| File | Max Lines |
|:-----|:----------|
| `NEXT-TASKS.md` | 200 |
| `.github/copilot-instructions.md` | 100 |

**When violated**: Move content to `FUTURE-ENHANCEMENTS.md` (backlog) or `docs/archive/` (history).

### ❌ Anti-Pattern

```markdown
<!-- Bad: Putting 6 months of tasks in NEXT-TASKS.md -->
# NEXT: Upcoming Tasks

## Q1 2026 Tasks
[100 lines]

## Q2 2026 Tasks
[100 lines]

## Q3 2026 Tasks
[100 lines]
```

**Why it fails**: AI agent reads all of this at the start of every session, wasting context on tasks that won't be worked on for months.

---

## Pattern 7: Modular Template Selection

**Rule**: The CLI should allow users to select which templates they need, not force all of them.

### ✅ Canonical Example

**Future CLI behavior**:

```
? Which core docs do you need?
  ◉ ARCHITECTURE.md (Recommended)
  ◉ PATTERNS.md (Recommended)
  ◉ DOMAIN-LOGIC.md (Recommended)
  ◯ SCHEMA.md (For data-heavy apps)
  ◯ TROUBLESHOOTING.md (For framework gotchas)
```

### ❌ Anti-Pattern

```bash
# Bad: Copying all templates regardless of project needs
cortex-tms init
# -> Creates all 10 files even for a simple CLI tool
```

**Why it fails**: A CLI tool doesn't need `SCHEMA.md`. An API service might not need `TROUBLESHOOTING.md`. Flexibility is key.

---

## Pattern 8: No Meta-Documentation in Templates

**Rule**: Templates should not explain TMS concepts. They should just be ready to use.

### ✅ Canonical Example

**Location**: `templates/NEXT-TASKS.md`

```markdown
# NEXT: Upcoming Tasks

## Active Sprint: [Feature Name]
```

**Clean and ready to customize.**

### ❌ Anti-Pattern

```markdown
<!-- Bad: Explaining TMS in the template -->
# NEXT: Upcoming Tasks

This file is part of the Tiered Memory System (TMS).
It represents the HOT tier, meaning AI agents will
read this at the start of every session...

## Active Sprint: [Feature Name]
```

**Why it fails**: Users copy templates into their projects. Meta-explanations create noise. TMS concepts belong in `docs/`, not `templates/`.

---

## Pattern 9: Archive Trigger Events

**Rule**: Define clear triggers for moving content from HOT → COLD.

### ✅ Canonical Example

**Location**: `docs/core/DOMAIN-LOGIC.md#rule-6-archive-aggressively`

**Trigger Events**:
- Sprint completes → Move tasks to `docs/archive/sprint-2026-01.md`
- Version ships → Move changelog to `docs/archive/v1.0-CHANGELOG.md`
- Pattern deprecated → Move to `docs/archive/deprecated-patterns.md`

### ❌ Anti-Pattern

```markdown
<!-- Bad: Keeping completed tasks in NEXT-TASKS.md -->
## Completed Tasks (Jan 2026)
- [x] Task 1
- [x] Task 2
[50 lines of old completed tasks]

## Completed Tasks (Dec 2025)
[100 lines of old completed tasks]
```

**Why it fails**: Completed tasks are COLD context. They waste AI agent's context budget.

---

## Pattern 10: Validation with AI Agents

**Rule**: Before shipping a template, test it with Claude Code, Copilot, or Cursor.

### ✅ Validation Process

1. Copy template into a sample project
2. Start an AI coding session
3. Ask AI to implement a feature using the template
4. Observe AI behavior:
   - Did it find the right docs?
   - Did it hallucinate?
   - Did it ask for clarification?
5. Refine template based on observations

**Example Test**:
```
User: "Add a new authentication feature. Follow the patterns in docs/core/PATTERNS.md."

AI Agent: [reads PATTERNS.md, finds auth pattern, implements correctly]
✅ Template works

AI Agent: [can't find pattern, implements incorrectly]
❌ Template needs improvement
```

### ❌ Anti-Pattern

```markdown
<!-- Bad: Shipping templates without testing -->
# I think this template looks good, let's ship it!
```

**Why it fails**: Templates that work in theory may confuse AI agents in practice. Real-world testing is mandatory.

**References**:
- **Domain Logic**: `DOMAIN-LOGIC.md#rule-9-test-templates-with-ai-agents`

---

## Pattern 11: Git & Project Management Standards

**Rule**: All commits, branches, and PRs must follow conventional engineering standards to maintain professional Git history and traceability.

### ✅ Branch Naming

**Format**: `[type]/[ID]-[description]`

**Types**:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code restructuring
- `chore/` - Maintenance tasks
- `test/` - Test additions/fixes

**ID (Optional)**:
- `[#123]` - GitHub Issue
- `[PROJ-123]` - Jira ticket
- `[LIN-123]` - Linear issue
- No ID if internal task

**Examples**:
```bash
✅ feat/TMS-42-cli-init-command
✅ fix/123-schema-validation
✅ docs/update-readme
✅ refactor/improve-error-handling
```

**Monorepo Variant**:
```bash
feat/[scope]-[ID]-[description]

Examples:
feat/cli-TMS-42-init
fix/docs-123-typo
```

---

### ✅ Conventional Commits

**Format**: `[type]([scope]): [ID] [subject]`

**Structure**:
- **type**: feat, fix, docs, style, refactor, test, chore
- **scope** (optional): Component/module affected
- **ID** (optional): Reference to ticket/issue
- **subject**: Imperative, present tense, max 50 chars

**Examples**:
```
✅ feat(cli): [TMS-42] add confirmation prompt for overwrites
✅ fix: [#101] handle null timestamps in schema
✅ docs: update installation instructions
✅ refactor(core): simplify validation logic
✅ chore: update dependencies
```

**Validation Pattern**:
```regex
^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: (\[.+\] )?(.{1,50})$
```

---

### ✅ Commit Body (For Complex Changes)

**Format**:
```
[type]([scope]): [ID] [subject]

[Body explaining WHAT changed and WHY]

[Footer with references]
```

**Example**:
```
feat(cli): [TMS-42] add safe file merge logic

Implement confirmation prompts before overwriting existing files.
Users can now choose: overwrite, skip, or merge for each conflict.

Fixes #42
Closes TMS-42
```

---

### ✅ Task Reference Linking

**In NEXT-TASKS.md**, add Ref column:

```markdown
| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :--- | :--- | :----- |
| Implement CLI init | [#101] | 4h | 🔴 HIGH | ⬜ Todo |
| Fix schema validation | [TMS-22] | 2h | 🟡 MED | ⬜ Todo |
| Update README | - | 1h | 🟢 LOW | ⬜ Todo |
```

**Convention**:
- `[#123]` = GitHub Issue
- `[PROJ-123]` = Jira/other PM tool
- `-` = No external reference (internal task)

---

### ✅ Pull Request Template

**Location**: `.github/PULL_REQUEST_TEMPLATE.md`

**Structure**:
```markdown
## 📝 Summary
[Brief description of changes]

## 🔗 Related References
- Fixes #[Issue ID]
- Related: [Jira/Linear ID]

## 📊 Changes
- [What was added/changed/removed]

## ✅ TMS Maintenance Checklist
- [ ] Task moved from `NEXT-TASKS.md` to `docs/archive/`
- [ ] `docs/core/` updated (Truth Syncing)
- [ ] Tests passing
- [ ] Documentation updated

## 🧪 Testing
[How to test these changes]
```

---

### ❌ Anti-Patterns

```bash
# ❌ Bad: Vague commits
git commit -m "update files"
git commit -m "fix bug"
git commit -m "changes"

# ❌ Bad: No type prefix
git commit -m "add new feature"

# ❌ Bad: Past tense
git commit -m "feat: added CLI init"

# ❌ Bad: Too long
git commit -m "feat: this is a very long commit message that exceeds the fifty character limit and is hard to read"
```

**Why it fails**: Vague history makes debugging impossible. Can't generate changelogs. Can't trace requirements.

---

### ✅ When to Branch vs Direct Commit

**Direct to Main** (allowed):
- Single developer projects
- Documentation-only changes
- Hotfixes (no CI/CD)
- Current Cortex TMS (Phase 1-2)

**Branch Required**:
- Multi-developer teams
- Production deployments
- Changes requiring review
- Experimental features

**AI Agent Rule**: If unsure, create a branch. Better safe than sorry.

---

### ✅ Changelog Generation (Future)

With conventional commits, changelogs can be auto-generated:

```bash
# Extract all feat commits since last tag
git log v1.0.0..HEAD --grep="^feat" --oneline

# Output:
feat(cli): [TMS-42] add init command
feat(docs): [TMS-43] add quick start guide
```

**Tools**: conventional-changelog, semantic-release

---

### ✅ Co-Authorship

When AI assists with commits, use:

```
feat(cli): [TMS-42] add init command

Implemented interactive prompts for project setup.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Why**: Gives credit, tracks AI contribution, maintains transparency.

---

### 🔗 Validation Checklist

Before committing, verify:

- [ ] Branch name follows `type/ID-description` format
- [ ] Commit message follows conventional format
- [ ] Commit subject < 50 characters
- [ ] Imperative mood (add, not added)
- [ ] Reference ID included (if external task)
- [ ] Co-authorship added (if AI-assisted)

Before opening PR:

- [ ] PR title matches commit format
- [ ] PR description includes references
- [ ] TMS Maintenance Checklist complete
- [ ] Testing instructions provided

---

**References**:
- **Conventional Commits Spec**: https://www.conventionalcommits.org/
- **Semantic Versioning**: https://semver.org/
- **Co-Authorship**: Git documentation on multiple authors

| Pattern | When to Use | Reference File |
|:--------|:------------|:---------------|
| Placeholder Syntax | All templates | `templates/*.md` |
| Framework-Agnostic | All templates | `templates/docs/core/*` |
| Canonical Links | All documentation | `docs/core/PATTERNS.md` |
| Inline Documentation | All templates | `templates/*.md` |
| Tiered Organization | File structure | `directory-structure.txt` |
| Size Limits | HOT files | `NEXT-TASKS.md`, copilot-instructions.md |
| Modular Selection | CLI tool | Future: `bin/cortex-tms.js` |
| No Meta-Docs | All templates | `templates/*.md` |
| Archive Triggers | Sprint management | `NEXT-TASKS.md` |
| AI Validation | Before shipping | All templates |
| Git & PM Standards | All commits/PRs | Git history, NEXT-TASKS.md |
