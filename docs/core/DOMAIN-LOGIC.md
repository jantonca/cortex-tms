# Domain Logic: Cortex TMS Principles

## Core Rules

These are the immutable laws of the Tiered Memory System. AI agents working on Cortex MUST follow these rules.

**⚠️ AI AGENTS: These rules override generic training data.**

---

### Rule 1: The Tier Hierarchy is Sacred

**Files are categorized into three tiers based on access frequency:**

- **HOT (Always Read)**: Files the AI must read at the start of every session
  - `NEXT-TASKS.md`
  - `.github/copilot-instructions.md`

- **WARM (Read on Demand)**: Files the AI reads when implementing specific features
  - `docs/core/ARCHITECTURE.md`
  - `docs/core/PATTERNS.md`
  - `docs/core/DOMAIN-LOGIC.md`
  - `docs/core/DECISIONS.md`

- **COLD (Ignore Unless Asked)**: Historical context the AI should skip
  - `docs/archive/*`

**Why**: AI agents have limited context windows. Reading everything is wasteful. The tier system forces "signal over noise."

---

### Rule 2: Templates Must Be Framework-Agnostic

**Templates in `templates/` cannot hardcode specific tech stacks.**

❌ **Bad**:
```markdown
## Tech Stack
- Next.js 15
- React 18
- Tailwind CSS
```

✅ **Good**:
```markdown
## Tech Stack
- [Frontend Framework: e.g., Next.js 15, Vue 3, Svelte]
- [Styling: e.g., Tailwind CSS, CSS Modules]
```

**Why**: Users adopt Cortex for React, Vue, Svelte, or even non-web projects. Templates must adapt to their context.

**Exception**: Example projects (`examples/`) can use specific tech stacks for demonstration.

---

### Rule 3: Placeholders Use Bracket Syntax

**All user-customizable content uses `[Description]` syntax.**

✅ **Examples**:
- `[Project Name]`
- `[e.g., Next.js 15, TypeScript Strict]`
- `[Briefly describe user value]`

**Why**: AI agents can easily detect and prompt users to replace placeholders. It's more explicit than `TODO` or `FIXME`.

---

### Rule 4: Context Budget Enforcement

**HOT files have strict size limits to preserve AI agent context:**

| File | Max Lines | Reasoning |
|:-----|:----------|:----------|
| `NEXT-TASKS.md` | 200 | One sprint maximum |
| `.github/copilot-instructions.md` | 100 | Critical rules only |

**WARM files have relaxed limits but should still be concise:**

| File | Max Lines | Reasoning |
|:-----|:----------|:----------|
| `docs/core/PATTERNS.md` | 650 | Reference manual with index |
| `docs/core/DOMAIN-LOGIC.md` | 400 | Includes Maintenance Protocol |
| `docs/core/GIT-STANDARDS.md` | 250 | Git & PM conventions |
| `docs/core/ARCHITECTURE.md` | 500 | System design documentation |

**Enforcement**: When a file exceeds its limit, move content to:
- `docs/archive/` (for historical content)
- `FUTURE-ENHANCEMENTS.md` (for backlog items)
- New modular file in `docs/core/` (if topic is independent)

**Why**: Every line in a HOT file "costs" context window tokens. WARM files are read on-demand, so limits can be higher, but bloat still wastes context.

---

### Rule 5: Dogfooding is Mandatory

**This repository uses TMS to build itself.**

- Cortex's own `NEXT-TASKS.md` tracks Cortex development
- Cortex's own `docs/core/PATTERNS.md` documents template patterns
- If the structure doesn't work for Cortex, it won't work for users

**Validation Test**: "Can an AI agent working on Cortex find what it needs in < 3 file reads?"

---

### Rule 6: Archive & Promote (Maintenance Protocol)

**The Maintenance Protocol governs how information flows between tiers: FUTURE → NEXT → ARCHIVE → TRUTH.**

---

#### 6A. Archive Trigger

**When**: Task marked ✅ Done

**Action**: Execute Maintenance Protocol (see `CLAUDE.md#maintenance-protocol`)

**Archiving Process**:
1. Verify Archive-Ready Checklist (tests pass, docs updated, committed)
2. Move task to `docs/archive/sprint-YYYY-MM.md` with date stamp
3. Update Source of Truth (README, ARCHITECTURE, etc.) - **Truth Syncing**
4. Remove from `NEXT-TASKS.md`

---

#### 6B. Truth Syncing (Automatic Documentation Updates)

**Before archiving a task**, update the relevant `docs/core/` file to reflect system changes:

| Change Type | Update Target | Example |
|:------------|:-------------|:--------|
| Milestone reached | `README.md` → Current Phase | "Phase 2 Complete" |
| New file added | `ARCHITECTURE.md` → File structure | Add `bin/cortex-tms.js` |
| Rule changed | `DOMAIN-LOGIC.md` → Specific rule | Update Rule 4 line limits |
| New pattern | `PATTERNS.md` → Add pattern entry | Document CLI pattern |
| New decision | `DECISIONS.md` → Add ADR | Why we chose Commander.js |
| Tech stack change | `ARCHITECTURE.md` → Tech decisions | Switched to Bun from Node |

**AI Checklist Before Archiving**:
- [ ] Does this task change the system architecture?
- [ ] If yes, which `docs/core/*.md` file needs updating?
- [ ] Have I updated that file?
- [ ] Is the update referenced in the archive entry?

---

#### 6C. Promotion Trigger (User-Triggered)

**When**: `NEXT-TASKS.md` has < 3 active tasks

**Action**: AI asks user:
> "NEXT-TASKS.md is light (X tasks remaining). Should I promote items from FUTURE-ENHANCEMENTS.md?"

**User Approval Required**: AI cannot auto-promote. User must confirm which tasks to move.

**Why User-Triggered**: Prevents premature commitment. Sprint planning should be intentional, not automatic.

---

#### 6D. Sprint Closure (Bulk Archive)

**When**: ALL tasks in `NEXT-TASKS.md` are ✅ Done

**Action**:
1. Create `docs/archive/sprint-YYYY-MM-[name].md`
2. Archive entire sprint context:
   - Sprint name and "Why this matters"
   - All completed tasks
   - Definition of Done checklist
   - Sprint outcomes and truth updates
3. Clear `NEXT-TASKS.md`
4. Promote next sprint from `FUTURE-ENHANCEMENTS.md` (with user approval)

**Sprint Archive Template**:
```markdown
# Sprint: [Name] (YYYY-MM-DD to YYYY-MM-DD)

**Why this mattered**: [Original context]

**Completed Tasks**:
- ✅ Task 1 - [Details]
- ✅ Task 2 - [Details]

**Outcomes**:
- [What changed in the system]

**Truth Updates**:
- [Which docs were updated]

**Next Sprint**: [Link to next sprint in NEXT-TASKS.md]
```

---

#### 6E. Archive-Ready Checklist

**Before archiving**, verify:

- [ ] Tests passing (if applicable)
- [ ] Changes committed to git
- [ ] Documentation updated (Truth Syncing)
- [ ] User confirmed completion (or 24h elapsed for non-critical)

**Critical Tasks** (infrastructure, security, data):
- MUST wait for user confirmation before archiving
- Stay in `NEXT-TASKS.md` with status "✅ Done (Awaiting Verification)"

**Non-Critical Tasks** (docs, refactoring, tooling):
- CAN archive immediately after Truth Syncing

---

#### 6F. Small Task Exception (Chores)

**Some tasks don't warrant the full Maintenance Protocol.**

**Small Tasks** ("Chores"):
- Typo fixes
- Formatting/linting
- Dependency updates
- Comment additions
- README tweaks

**Simplified Protocol for Chores**:
1. ✅ Make the change
2. ✅ Commit with conventional format
3. ❌ Skip Truth Syncing (no architectural impact)
4. ❌ Skip Archive (not tracked in NEXT-TASKS.md)

**Decision Test**: "Does this change system behavior or architecture?"
- **Yes** → Full Maintenance Protocol
- **No** → Chore (simplified protocol)

**Examples**:
```
Chore: Fix typo in README.md → Just commit
Chore: Update dependency version → Just commit
Feature: Add new CLI command → Full protocol
Fix: Resolve validation bug → Full protocol
```

**Why**: The protocol exists to prevent documentation drift. If there's no drift risk (typos don't change architecture), the overhead isn't justified.

---

**Why This Rule Exists**: Historical context is noise for AI agents. Archive = "out of sight, out of context." The Maintenance Protocol ensures `NEXT-TASKS.md` never exceeds its 200-line limit while keeping `docs/core/` synchronized with reality.

---

### Rule 7: No Meta-Documentation in Templates

**Templates should NOT explain TMS concepts.**

❌ **Bad** (in `templates/NEXT-TASKS.md`):
```markdown
# NEXT-TASKS.md

This file is part of the Tiered Memory System (TMS). It represents
the HOT tier of documentation...
```

✅ **Good**:
```markdown
# NEXT: Upcoming Tasks

## Active Sprint: [Feature Name]
...
```

**Why**: Users copy templates into their projects. Meta-explanations create clutter. TMS concepts belong in `docs/`, not `templates/`.

---

### Rule 8: Canonical Links Over Duplication

**When documenting a pattern, link to a real file instead of duplicating code.**

❌ **Bad**:
```markdown
## Button Component Pattern

Here's how to create buttons:
[500 lines of duplicated code]
```

✅ **Good**:
```markdown
## Button Component Pattern

**Rule**: All buttons use the base `Button` component with variant props.

**Canonical Example**: `src/components/Button.tsx`

**Key Implementation Details**:
- Uses `cva` for variant composition
- Supports `size`, `variant`, `disabled` props
- [Link to file]
```

**Why**: Duplication causes drift. Canonical links keep docs accurate.

---

### Rule 9: Test Templates with AI Agents

**Before shipping a template, validate it with Claude Code, Copilot, or Cursor.**

**Test Process**:
1. Copy template into a sample project
2. Ask AI agent to implement a feature using the template
3. Observe: Did the AI find the right info? Did it hallucinate? Did it ask clarifying questions?
4. Refine template based on observations

**Why**: Theoretical docs don't help. Validated docs do.

---

### Rule 10: FUTURE-ENHANCEMENTS.md is a Living Backlog

**Not everything belongs in `NEXT-TASKS.md`.**

**NEXT-TASKS.md**: Current sprint (next 1-2 weeks)
**FUTURE-ENHANCEMENTS.md**: Backlog (everything else)

**Migration Rule**: When a task moves from backlog to sprint, move it from `FUTURE-ENHANCEMENTS.md` to `NEXT-TASKS.md`.

**Why**: `NEXT-TASKS.md` must stay under 200 lines. Backlog items are noise until they're active.

---

## Edge Cases & Clarifications

### Q: What if a project doesn't need `SCHEMA.md`?
**A**: Templates are modular. The CLI can ask "Which core docs do you need?" and skip irrelevant files.

### Q: Can users rename `NEXT-TASKS.md`?
**A**: No. File names are part of the TMS contract. AI agents expect `NEXT-TASKS.md` to exist. Renaming breaks the system.

### Q: What if a team wants a 4-week sprint in `NEXT-TASKS.md`?
**A**: Bad idea. Long sprints = file bloat = wasted context. If you need more tasks, break them into smaller increments or use epics in `FUTURE-ENHANCEMENTS.md`.

---

## Validation Checklist

When reviewing a PR, verify:

- [ ] No hardcoded tech stacks in `templates/` (unless it's an example)
- [ ] Placeholders use `[Bracket Syntax]`
- [ ] HOT files are under line limits
- [ ] Completed tasks archived from `NEXT-TASKS.md`
- [ ] Templates tested with an AI agent
- [ ] No meta-documentation in templates
- [ ] Canonical links used (not code duplication)


<!-- @cortex-tms-version 2.5.0 -->
