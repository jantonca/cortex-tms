# Architecture Decisions (ADR)

This document records key architectural decisions made during Cortex TMS development.

---

## [2026-01-11] - Node.js CLI Tool (Not Shell Script)

**Context**: We needed a way to distribute and initialize Cortex TMS templates. Options were:
1. Simple shell script (`init-cortex.sh`)
2. Node.js CLI tool (`npx cortex-tms init`)
3. VS Code extension

**Decision**: Build a Node.js CLI tool as the primary distribution method.

**Reasoning**:
- **Universal**: Works on Windows, Mac, Linux (shell scripts are Unix-only)
- **Interactive**: Can use inquirer.js for rich prompts and customization
- **Logic**: Can detect existing project structure (package.json, git repo)
- **Familiar**: JavaScript/TypeScript developers are the primary audience
- **NPM ecosystem**: Publish to npm, users install with `npx` (no global install required)

**Trade-offs**:
- Requires Node.js runtime (acceptable for our audience)
- More complex than a shell script (but provides better UX)

---

## [2026-01-11] - Dual Distribution (NPM + GitHub Template)

**Context**: Users have two primary use cases:
1. **Greenfield**: Starting a new project from scratch
2. **Brownfield**: Adding TMS to an existing project

**Decision**: Support both via dual distribution:
- **GitHub Template Repository**: "Use this template" button for new projects
- **NPM Package**: `npx cortex-tms init` for existing projects

**Reasoning**:
- GitHub templates are ideal for greenfield (clone → start coding)
- NPM CLI is ideal for brownfield (detect existing structure → merge templates)
- Covering both scenarios maximizes adoption
- No single method handles both cases well

**Implementation**:
- Primary repo serves as GitHub template
- Same repo contains CLI tool in `bin/` directory
- CLI tool copies from `templates/` directory

---

## [2026-01-11] - pnpm as Standard Package Manager

**Context**: Project needs a package manager. Options: npm, yarn, pnpm, bun.

**Decision**: Use pnpm exclusively. Document it in all templates.

**Reasoning**:
- **Performance**: Faster installs than npm/yarn
- **Disk efficiency**: Symlinks to global store (saves disk space)
- **Strict**: Better dependency management than npm
- **Developer preference**: Project maintainer uses FN (Fast Node Manager) + pnpm

**User Impact**:
- Templates reference `pnpm` in commands
- CLI tool can detect user's package manager and adapt
- Not mandatory for end users (they can use npm if they want)

---

## [2026-01-11] - Framework-Agnostic Templates

**Context**: Users may build projects with:
- Next.js, React, Vue, Svelte (frontend)
- Express, Fastify, NestJS (backend)
- CLI tools (no framework)

**Decision**: Templates use placeholder syntax `[Description]` instead of hardcoding tech stacks.

**Reasoning**:
- TMS is a **structural pattern**, not a framework
- Hardcoding "Next.js" in templates limits adoption
- Placeholders make templates universally applicable
- Example projects can show specific implementations

**Exception**:
- `examples/` directory contains real implementations with specific tech stacks
- This provides both flexibility (templates) and guidance (examples)

---

## [2026-01-11] - Dogfooding Approach to Development

**Context**: We needed to validate that the TMS structure actually works.

**Decision**: Use Cortex TMS to build Cortex TMS itself.

**Reasoning**:
- **Real-world testing**: If the structure doesn't work for Cortex, it won't work for users
- **AI validation**: We test docs with Claude Code during development
- **Credibility**: "We use it ourselves" is more persuasive than "trust us"
- **Rapid iteration**: We discover issues immediately

**Impact**:
- Cortex's `NEXT-TASKS.md` tracks Cortex development
- Cortex's `docs/core/PATTERNS.md` documents template patterns
- Cortex's `.github/copilot-instructions.md` enforces TMS rules

**Validation Test**: "Can an AI agent working on Cortex find what it needs in < 3 file reads?"

---

## [2026-01-11] - Modular Template Selection

**Context**: Not all projects need all templates. For example:
- CLI tools don't need `SCHEMA.md` (no database)
- Simple libraries don't need `TROUBLESHOOTING.md`

**Decision**: CLI tool will prompt users to select which templates they need.

**Reasoning**:
- Flexibility over opinionation
- Reduces clutter in user projects
- Core templates (NEXT-TASKS, copilot-instructions) are mandatory
- Optional templates (SCHEMA, TROUBLESHOOTING) are selectable

**Future Implementation**:
```bash
? Which core docs do you need?
  ◉ ARCHITECTURE.md (Recommended)
  ◉ PATTERNS.md (Recommended)
  ◉ DOMAIN-LOGIC.md (Recommended)
  ◯ SCHEMA.md (For data-heavy apps)
  ◯ TROUBLESHOOTING.md (For framework gotchas)
```

---

## [2026-01-11] - Example Project: Next.js 15 + Shadcn

**Context**: We need a reference implementation to demonstrate TMS in action.

**Decision**: Build `examples/todo-app/` using:
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Shadcn UI components

**Reasoning**:
- **AI agent sweet spot**: Claude Code, Copilot, and Cursor are highly optimized for this stack
- **Modern**: Represents current best practices (2026)
- **Popular**: Large audience using this stack
- **Demonstrable**: UI components provide visual validation of patterns

**Alternative stacks considered**:
- Vue 3 + Nuxt (smaller audience)
- Svelte + SvelteKit (less AI training data)
- Express API (no visual component)

**Outcome**: We can build this app using Claude Code while documenting patterns in real-time.

---

## [2026-01-11] - TypeScript for CLI, Markdown for Templates

**Context**: We needed to choose languages for:
1. CLI tool
2. Template files

**Decision**:
- CLI tool: **TypeScript** (compiled to JavaScript)
- Templates: **Markdown** (with placeholders)

**Reasoning**:

**TypeScript for CLI**:
- Type safety for file operations (reduces bugs)
- Better IDE support
- Compiles to Node.js-compatible JavaScript

**Markdown for Templates**:
- Universal format (readable by humans and AI agents)
- No runtime dependencies
- Easy to version control
- AI agents are trained on markdown documentation

**Alternative considered**: JSON or YAML for templates (rejected: less human-readable)

---

## [2026-01-11] - Strict Line Limits on HOT Files

**Context**: AI agents have limited context windows. Reading 1000-line files wastes tokens.

**Decision**: Enforce strict line limits on HOT tier files:
- `NEXT-TASKS.md`: 200 lines max
- `.github/copilot-instructions.md`: 100 lines max
- `docs/core/PATTERNS.md`: 500 lines max

**Reasoning**:
- **Performance**: Smaller files = faster AI comprehension
- **Focus**: Forces teams to prioritize what matters NOW
- **Archival**: Encourages moving completed work to `docs/archive/`

**Enforcement**:
- Manual (for now): Reviewers check file sizes
- Future: CLI validation tool or GitHub Action

**Trade-offs**:
- Requires discipline to archive aggressively
- Teams may resist at first (feels like "losing history")

---

## [2026-01-11] - Architecture Decision Record Format

**Context**: We needed a standard format for documenting decisions.

**Decision**: Use the ADR format shown in this file:
- **Date**: When the decision was made
- **Context**: What problem we were solving
- **Decision**: What we chose
- **Reasoning**: Why we chose it
- **Trade-offs** (optional): What we gave up

**Reasoning**:
- Lightweight (doesn't require special tools)
- Chronological (easy to see evolution of decisions)
- Justification-focused (helps future contributors understand "why")

**Reference**: Inspired by Michael Nygard's ADR format (https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

---

## [2026-01-11] - Maintenance Protocol & Truth Syncing

**Context**: We needed explicit workflows to prevent TMS from degrading over time. Without governance, even well-designed documentation systems bloat and become stale.

**Problem**:
- Completed tasks accumulate in `NEXT-TASKS.md` → File exceeds 200-line limit
- Documentation becomes outdated (README shows "Phase 1" when we're on "Phase 3")
- No clear process for moving tasks between tiers (FUTURE → NEXT → ARCHIVE)
- AI agents don't know when to update docs vs when to archive tasks

**Decision**: Implement a formal **Maintenance Protocol** with four workflows:

1. **Archive**: Move ✅ Done tasks from NEXT to COLD tier
2. **Truth Syncing**: Update `docs/core/` when tasks change the system
3. **Promotion**: Move high-priority tasks from FUTURE to NEXT (user-triggered)
4. **Sprint Closure**: Archive entire sprints as cohesive units

**Reasoning**:

**Why "Maintenance Protocol" (not "Janitor Mode")**:
- Professional terminology that matches TMS tone
- Frames AI as system maintainer, not just cleanup crew
- "Protocol" implies rigor and repeatability

**Why User-Triggered Promotion**:
- Sprint planning should be intentional, not automatic
- Prevents AI from overloading NEXT-TASKS.md with noise
- < 3 active tasks triggers suggestion, but user approves

**Why Truth Syncing Table**:
- Provides explicit mapping: task type → doc file
- Prevents "orphaned changes" (code changes without doc updates)
- Makes archiving checklist concrete (not vague "update docs")

**Why Sprint Closure Workflow**:
- Preserves sprint context (tasks are related)
- Maintains narrative arc of development
- Creates natural breakpoints for reflection

**Implementation**:
- `CLAUDE.md` → Added Maintenance Protocol section
- `DOMAIN-LOGIC.md` → Expanded Rule 6 to include all workflows
- `.github/copilot-instructions.md` → Added Post-Task Protocol
- This ADR → Documents rationale

**Trade-offs**:
- **More Process**: AI must execute 4-step protocol after each task (adds overhead)
- **User Interaction Required**: Promotion needs approval (slower than auto-promotion)
- **Discipline Required**: System only works if AI actually follows the protocol

**Mitigation**:
- Make protocol explicit in HOT files (CLAUDE.md, copilot-instructions.md)
- Archive-Ready Checklist provides clear success criteria
- Truth Syncing table removes ambiguity ("which doc do I update?")

**Validation**:
- Protocol will be tested during Phase 1 Closure
- Success metric: `NEXT-TASKS.md` stays under 200 lines across multiple sprints
- Failure mode: If docs drift from reality, protocol failed

**Alternative Considered**: Automatic archiving with cron job or GitHub Action

**Rejected Because**:
- AI context is richer than automation (knows WHAT changed, not just that file changed)
- Truth Syncing requires semantic understanding (which doc section to update)
- User approval for promotion ensures sprint planning remains intentional

---

## [2026-01-11] - Engineering Standards Integration (Git & PM)

**Context**: We needed to ensure AI agents commit code professionally, indistinguishable from (or superior to) human developers.

**Problem**:
- AI agents produce vague commits ("update files", "fix bug")
- No traceability to requirements (Jira/GitHub Issues)
- Git history becomes useless for debugging, auditing, or changelog generation
- No standard for branch naming or PR descriptions

**Decision**: Integrate engineering standards directly into TMS by creating **Pattern 11: Git & Project Management Standards**.

**Implementation**:

1. **Conventional Commits**: Enforce `type(scope): [ID] subject` format
   - Example: `feat(cli): [TMS-42] add init command`
   - Validation: Regex pattern for commit message structure
   - Tooling: Can use conventional-changelog for automated changelogs

2. **Branch Naming**: Format `type/ID-description`
   - Example: `feat/TMS-42-cli-init`
   - Monorepo variant: `feat/scope-ID-description`

3. **Task Reference Linking**: Add Ref column to NEXT-TASKS.md
   - `[#123]` = GitHub Issue
   - `[PROJ-123]` = Jira ticket
   - `-` = No external reference (internal task)

4. **PR Template**: `.github/PULL_REQUEST_TEMPLATE.md`
   - Includes TMS Maintenance Checklist
   - Forces documentation updates
   - Links to related issues/tickets

5. **Co-Authorship**: Always credit AI assistance
   - `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
   - Transparency and tracking

**Reasoning**:

**Why Conventional Commits**:
- Machine-readable history (changelog automation)
- Semantic versioning integration
- Industry standard (widely understood)
- Enables tooling (commitlint, semantic-release)

**Why External References (Optional)**:
- Traceability to requirements
- Context preservation ("why was this changed?")
- Compliance/auditing support
- Optional to support teams without PM tools

**Why PR Template**:
- Forces TMS compliance (Truth Syncing, archiving)
- Standardizes review process
- Ensures AI-generated PRs are professional

**Why Co-Authorship**:
- Transparency (users know AI was involved)
- Credit (AI contribution is real work)
- Tracking (understand AI's impact on codebase)

**Trade-offs**:
- **More Process**: Every commit requires format checking (adds overhead)
- **Learning Curve**: Teams must learn conventional commit format
- **Optional Refs**: Some projects don't use external PM tools (must support `-`)

**Mitigation**:
- Make Ref column optional (use `-` for internal tasks)
- Provide validation regex for commit messages
- Add examples in PATTERNS.md for quick reference
- Include commit checklist in CLAUDE.md and copilot-instructions.md

**Validation**:
- Pattern 11 added to `docs/core/PATTERNS.md`
- Git Protocol added to `CLAUDE.md` Maintenance Protocol
- Git rules added to `.github/copilot-instructions.md`
- PR template created at `.github/PULL_REQUEST_TEMPLATE.md`
- NEXT-TASKS.md template updated with Ref column

**Alternative Considered**: No standards, let AI/humans commit freely

**Rejected Because**:
- Vague history makes debugging impossible
- Can't trace changes to requirements
- Can't auto-generate changelogs
- Professional engineering requires standards

**Impact**:
- Git history becomes valuable asset (not noise)
- Changelogs can be auto-generated from commits
- Requirements traceability built-in
- AI agents function as professional contributors

**Reference**: Conventional Commits Specification (https://www.conventionalcommits.org/)

---

## Decision Log Summary

| Date | Decision | Status |
|:-----|:---------|:-------|
| 2026-01-11 | Node.js CLI Tool | ✅ Active |
| 2026-01-11 | Dual Distribution (NPM + GitHub) | ✅ Active |
| 2026-01-11 | pnpm as Standard | ✅ Active |
| 2026-01-11 | Framework-Agnostic Templates | ✅ Active |
| 2026-01-11 | Dogfooding Approach | ✅ Active |
| 2026-01-11 | Modular Template Selection | 🔜 Planned |
| 2026-01-11 | Next.js 15 + Shadcn Example | 🔜 Planned |
| 2026-01-11 | TypeScript for CLI | ✅ Active |
| 2026-01-11 | Strict Line Limits | ✅ Active |
| 2026-01-11 | ADR Format | ✅ Active |
| 2026-01-11 | Maintenance Protocol & Truth Syncing | ✅ Active |
| 2026-01-11 | Engineering Standards Integration (Git & PM) | ✅ Active |

<!-- @cortex-tms-version 2.6.0-beta.1 -->
