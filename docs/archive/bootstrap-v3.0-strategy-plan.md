# AI-Assisted Bootstrapping Strategy v2 (Revised)

**Date**: 2026-01-27
**Status**: Revised after GPT-5.1 feedback + AI-agent-native reframe
**Scope**: Prompt-first onboarding + optional CLI + article

---

## The Key Insight

Users install Cortex TMS **to work with an AI agent** (Claude Code, Copilot, Cursor, Codex). They are NOT going to manually fill templates. The AI agent the user already has IS the bootstrapping tool.

**Current broken flow**:
```
cortex-tms init → empty templates → user stares at placeholders → gives up
```

**Desired flow**:
```
cortex-tms init → AI agent reads CLAUDE.md → CLAUDE.md tells the AI how
to bootstrap → AI populates docs with user guidance → project is AI-ready
```

The primary mechanism is **prompts and templates**, not a CLI command.

---

## GPT-5.1 Feedback: Key Takeaways Applied

1. **Frame as "draft, not ground truth"** ✅ Applied
   - All AI-generated content marked as draft for human review
   - "AI suggests a draft, human refines into constitution"

2. **Narrow v1 scope** ✅ Applied
   - v1: ARCHITECTURE.md + CLAUDE.md + copilot-instructions.md only
   - v2: PATTERNS.md + DOMAIN-LOGIC.md

3. **Safety rules for file analysis** ✅ Applied
   - Exclude .env, secrets, node_modules
   - Respect .gitignore

4. **Lean on existing infra** ✅ Applied
   - Reuse llm-client.ts for optional CLI path
   - Primary path needs zero new infrastructure (just templates)

5. **28-36h is aggressive** ✅ Applied
   - Prompt-first approach is much cheaper to build (8-12h for v1)
   - CLI bootstrap becomes v2 scope

---

## Three-Layer Architecture

### Layer 1: Prompt-First Bootstrapping (PRIMARY - Zero Cost)
**Effort**: 8-10 hours | **Priority**: Ship First
**Works with**: Any AI agent (Claude Code, Copilot, Cursor, Codex, etc.)
**Cost to user**: $0 (uses their existing AI session)

The AI agent the user already has does the bootstrapping through guided prompts.

### Layer 2: Enhanced Templates (SUPPORTING)
**Effort**: 3-4 hours | **Priority**: Ship with Layer 1
**Works with**: Any AI agent
**Cost to user**: $0

Templates include inline AI instructions that guide population on first read.

### Layer 3: CLI Bootstrap Command (OPTIONAL - v2)
**Effort**: 16-20 hours | **Priority**: After Layer 1 proves value
**Works with**: OpenAI / Anthropic API
**Cost to user**: ~$0.15-0.25 per run

Automated CLI command for users who prefer one-command automation.

---

## Layer 1: Prompt-First Bootstrapping (Detailed)

### New Prompt: `bootstrap` (added to PROMPTS.md)

This is the "day 1" prompt a user pastes into their AI agent after running `cortex-tms init`:

```markdown
## bootstrap

You have just been added to a project that uses Cortex TMS for AI governance.
The documentation files exist but contain placeholder content that needs to be
populated with real project information.

**Your task**: Analyze this codebase and populate the TMS documentation files
as DRAFTS for human review.

**Step 1 - Understand the project**:
- Read `package.json` (or equivalent) for tech stack and dependencies
- Scan the directory structure to understand components
- Read entry points (`src/index.*`, `src/app.*`, `bin/*`)
- Read any existing README.md for project context

**Step 2 - Populate ARCHITECTURE.md** (`docs/core/ARCHITECTURE.md`):
- Fill "Quick Context" with what the project does, who it's for, key constraint
- Fill "System Overview" with 2-3 sentences about the system
- Fill "Component Map" table with real components from the codebase
- Fill "Core Data Flow" with the actual happy path
- Mark all populated sections with: `<!-- AI-DRAFT: Review before treating as canonical -->`

**Step 3 - Customize CLAUDE.md**:
- Update CLI commands with the project's actual commands (from package.json scripts)
- Add project-specific operational loop steps
- Add any project-specific rules or conventions you observed

**Step 4 - Customize copilot-instructions.md** (`.github/copilot-instructions.md`):
- Fill in the actual tech stack
- Add real conventions observed in the code
- Add project-specific prohibitions

**Step 5 - Populate NEXT-TASKS.md**:
- If there are open TODOs, issues, or incomplete features, suggest initial tasks
- Otherwise, suggest "Review AI-generated documentation" as first task

**Rules**:
- Be SPECIFIC to this project - no generic advice
- Reference actual file paths from the codebase
- Mark every generated section with `<!-- AI-DRAFT -->` comment
- Ask the user to confirm before writing each file
- If unsure about something, ASK rather than guess

---
```

### New Prompt: `populate-architecture`

For users who want to bootstrap just ARCHITECTURE.md:

```markdown
## populate-architecture

Analyze this codebase and populate `docs/core/ARCHITECTURE.md`:

1. Read `package.json` for tech stack, then scan `src/` directory structure
2. Fill "Quick Context": what it does, who it's for, key constraint
3. Fill "Component Map": real components with responsibilities and tech stack
4. Fill "Core Data Flow": trace the main happy path from entry point to output
5. Fill "Deployment & Infrastructure" from config files and CI workflows

Be specific to THIS project. Reference actual file paths. Mark sections with
`<!-- AI-DRAFT: Review before treating as canonical -->`.
Present the draft and ask for confirmation before writing.

---
```

### New Prompt: `discover-patterns`

```markdown
## discover-patterns

Review this codebase and document patterns for `docs/core/PATTERNS.md`:

1. Scan representative files in `src/` for recurring conventions
2. Identify: naming conventions, error handling, component structure, testing patterns
3. For each pattern, find a canonical example (actual file path + code snippet)
4. Document as "Pattern N: Name" with Rule, Anti-Pattern, and Canonical Example

Extract ACTUAL patterns from code, not generic best practices.
Mark all entries with `<!-- AI-DRAFT -->`. Present draft for review before writing.

---
```

### New Prompt: `extract-rules`

```markdown
## extract-rules

Extract domain-specific rules for `docs/core/DOMAIN-LOGIC.md`:

1. Look for validation logic (schemas, validators, form rules)
2. Look for business rules (calculations, state machines, conditionals)
3. Look for integration constraints (API limits, timeouts, rate limits)
4. Look for security rules (auth checks, input sanitization)

For each rule: write a clear imperative statement, cite the source file,
and mark severity (critical/important/guideline).
Mark all entries with `<!-- AI-DRAFT -->`. Present draft for review before writing.

---
```

---

## Layer 2: Enhanced Templates (Detailed)

### Modified: `templates/CLAUDE.md`

Add a "First Session" section that fires when an AI agent first reads it:

```markdown
# 🤖 Agent Workflow & Persona

## 🎯 Role

Expert Senior Developer. Follow the **"Propose, Justify, Recommend"** framework.

## 💻 CLI Commands

- **Dev**: [e.g., npm run dev]
- **Test**: [e.g., npm test]
- **Lint**: [e.g., npm run lint]
- **Build**: [e.g., npm run build]

## 🛠 Operational Loop

1. Read `NEXT-TASKS.md` to understand the current objective.
2. Cross-reference `docs/core/PATTERNS.md` for existing code conventions.
3. If unsure of a term, check `docs/core/GLOSSARY.md`.
4. Execute TDD (Test-Driven Development).

## 🚀 First Session Setup
<!-- Remove this section after completing setup -->

If this is your first session with this project, the documentation files
contain placeholder content. Help the user populate them:

1. Run `cortex-tms prompt bootstrap` (or paste the bootstrap prompt)
2. Analyze the codebase and populate docs/core/ARCHITECTURE.md
3. Customize this file (CLAUDE.md) with real CLI commands
4. Update .github/copilot-instructions.md with real tech stack
5. Suggest initial tasks for NEXT-TASKS.md

After setup, remove this "First Session Setup" section.

<!-- @cortex-tms-version 3.0.0 -->
```

### Modified: `templates/.github/copilot-instructions.md`

Add first-session awareness:

```markdown
# AI Pair Programmer: Collaboration Protocol (TMS v2.0)

## ⚡ Critical Rules (Always Apply)

- **Tech Stack**: [e.g., Next.js 15, TypeScript Strict, Tailwind CSS]
- **Conventions**: [e.g., Favor functional programming and composition]
- **Types**: ALWAYS use strict TypeScript. No `any`. No `@ts-ignore`.
- **Logic**: Before implementing business logic, check `docs/core/DOMAIN-LOGIC.md`.

<!-- SETUP NOTE: If you see [placeholder] text above, this project needs
     bootstrapping. Run: cortex-tms prompt bootstrap -->

## 🏗️ Technical Map (Read Order)

AI agents MUST follow this order before proposing code:

1. `NEXT-TASKS.md` (Current context)
2. `docs/core/DOMAIN-LOGIC.md` (Project rules)
3. `docs/core/PATTERNS.md` (Coding standards)

## 🚫 Prohibitions

- Never store secrets or API keys in code.
- Never bypass linting or type-checking.
- Never implement features not listed in `NEXT-TASKS.md` without asking.

<!-- @cortex-tms-version 2.3.0 -->
```

### Modified: Post-init message in `src/commands/init.ts`

```
✨ Success! Cortex TMS initialized.

🚀 Quick Start (choose one):

  Option A - With your AI agent (recommended):
    1. Open your AI tool (Claude Code, Copilot, Cursor, etc.)
    2. Run: cortex-tms prompt bootstrap
    3. Paste the prompt - your AI will analyze the codebase and
       populate your documentation files as drafts for you to review

  Option B - Manual setup:
    1. Review NEXT-TASKS.md for active sprint tasks
    2. Update docs/core/ with your project details
    3. Customize .github/copilot-instructions.md

📚 Learn more: https://cortex-tms.org
```

---

## Layer 3: CLI Bootstrap Command (v2 - Optional)

Deferred to v2 based on GPT-5.1 feedback. Same design as original plan but:
- Scope narrowed to ARCHITECTURE.md only for v1
- Marked as "draft" output
- Safety exclusions for .env, secrets, node_modules
- Reuses existing llm-client.ts infrastructure

---

## Implementation Plan

### v1: Prompt-First Bootstrapping (8-12 hours)

| # | Task | File | Effort |
|:--|:-----|:-----|:-------|
| 1 | Add `bootstrap` prompt to PROMPTS.md template | `templates/PROMPTS.md` | 1h |
| 2 | Add `populate-architecture` prompt | `templates/PROMPTS.md` | 0.5h |
| 3 | Add `discover-patterns` prompt | `templates/PROMPTS.md` | 0.5h |
| 4 | Add `extract-rules` prompt | `templates/PROMPTS.md` | 0.5h |
| 5 | Add "First Session Setup" section to CLAUDE.md template | `templates/CLAUDE.md` | 1h |
| 6 | Add setup note to copilot-instructions.md template | `templates/.github/copilot-instructions.md` | 0.5h |
| 7 | Update post-init message with AI-agent flow | `src/commands/init.ts` | 1h |
| 8 | Add placeholder detection to validator | `src/utils/validator.ts` | 2h |
| 9 | Update tutorial with bootstrap lesson | `src/commands/tutorial.ts` | 1h |
| 10 | Write tests for new prompt parsing | `src/__tests__/` | 1.5h |
| 11 | Write article draft (parallel) | `website/src/content/blog/` | 3h |
| 12 | Dogfood: test bootstrap on cortex-tms + todo-app | Manual testing | 1.5h |

**Total v1**: ~14 hours (including article)

### v2: CLI Bootstrap Command (16-20 hours, deferred)

Only build after v1 is validated with real users:
- `src/commands/bootstrap.ts` - Command skeleton
- `src/utils/codebase-analyzer.ts` - Smart file sampling
- `src/utils/bootstrap-prompts.ts` - LLM system prompts
- Safety exclusions (.env, secrets, node_modules, .gitignore)
- Interactive mode + dry-run
- Tests

---

## Critical Files to Modify (v1 only)

| File | Action | What Changes |
|:-----|:-------|:-------------|
| `templates/PROMPTS.md` | **MODIFY** | Add 4 new prompts (bootstrap, populate-architecture, discover-patterns, extract-rules) |
| `templates/CLAUDE.md` | **MODIFY** | Add "First Session Setup" section |
| `templates/.github/copilot-instructions.md` | **MODIFY** | Add setup detection note |
| `src/commands/init.ts` | **MODIFY** | Update post-init message with AI-agent quick start |
| `src/utils/validator.ts` | **MODIFY** | Add placeholder detection + completion % |
| `src/commands/tutorial.ts` | **MODIFY** | Add Lesson 6: AI-Powered Bootstrapping |
| `src/__tests__/validate.test.ts` | **MODIFY** | Tests for placeholder detection |
| `website/src/content/blog/` | **CREATE** | Article: "From Zero Docs to AI-Ready in 10 Minutes" |

---

## Draft vs Ground Truth Framing

All AI-generated content uses the `<!-- AI-DRAFT -->` marker:

```markdown
## 🎯 Quick Context
<!-- AI-DRAFT: Review before treating as canonical -->
- **What it does**: A CLI tool for scaffolding AI-optimized documentation
- **Who it's for**: Developers using AI coding assistants
- **Key constraint**: Must run offline, zero external dependencies
```

The `validate` command will detect these markers:
```
$ cortex-tms validate --verbose

📋 Documentation Status:
  ⚠  ARCHITECTURE.md: AI-DRAFT (needs human review)
     3 sections marked as AI-generated drafts
  ✅ PATTERNS.md: Human-reviewed
  ⚠  DOMAIN-LOGIC.md: Contains [placeholder] text

💡 Run 'cortex-tms prompt bootstrap' with your AI agent to populate drafts.
```

---

## Article Strategy (Parallel Development)

**Title**: "From Zero Docs to AI-Ready in 10 Minutes"

**Narrative**:
1. **Problem**: After init, users face blank templates. Manual filling takes 30-45 min.
2. **Insight**: Users already have an AI agent. The agent should do the bootstrapping.
3. **Solution**: New bootstrap prompt + AI-aware templates. Zero cost, any AI tool.
4. **Demo**: Before/after with real project
5. **Vision**: "Self-bootstrapping governance" - the AI writes its own constitution draft

**Key Screenshots**:
- Post-init message showing AI-agent quick start
- AI agent populating ARCHITECTURE.md from codebase
- `cortex-tms validate` showing draft status
- Before (placeholders) vs After (populated)

---

## Verification Plan

### Manual Testing

1. **Fresh project test**:
   ```bash
   mkdir test-project && cd test-project
   npm init -y && npm install express typescript
   # Create sample src/ files
   npx cortex-tms init --scope standard
   # Open Claude Code / Copilot
   npx cortex-tms prompt bootstrap
   # Paste prompt → AI populates docs
   npx cortex-tms validate --verbose  # Check draft markers
   ```

2. **Dogfooding test**:
   ```bash
   cd examples/todo-app
   # Reset docs to templates
   npx cortex-tms prompt bootstrap
   # Verify AI generates accurate content for Next.js app
   ```

3. **Multi-agent test**:
   - Test bootstrap prompt with Claude Code
   - Test bootstrap prompt with GitHub Copilot Chat
   - Test bootstrap prompt with Cursor
   - Verify prompt works across agents

### Automated Tests

- `src/__tests__/validate.test.ts`: Placeholder detection + AI-DRAFT markers
- `src/__tests__/init.test.ts`: Post-init message includes AI quick start
- Existing prompt parser tests still pass with new prompts

---

## Success Metrics

| Metric | Target |
|:-------|:-------|
| Time to first populated draft | < 10 minutes |
| Works with any AI agent | Claude, Copilot, Cursor, Codex |
| Cost to user | $0 (uses existing AI session) |
| Placeholder completion after bootstrap | 80%+ critical sections |
| User adoption | 40%+ of init users try bootstrap prompt |

---

## User Decisions (Confirmed)

1. **Scope**: ✅ Full Feature (prompts + templates + article)
2. **Target Users**: ✅ All cases (brownfield, greenfield, migration)
3. **Article**: ✅ Parallel development
4. **Primary mechanism**: ✅ Prompt-first (AI agent does the work)
5. **CLI bootstrap**: Deferred to v2 (validate prompt approach first)

---

## Next Steps After Approval

1. Create feature branch: `git checkout -b feat/bootstrap-onboarding`
2. Modify templates (PROMPTS.md, CLAUDE.md, copilot-instructions.md)
3. Update init.ts post-init message
4. Add placeholder detection to validator.ts
5. Update tutorial.ts with bootstrap lesson
6. Dogfood on cortex-tms and todo-app
7. Write article draft
8. Run tests: `pnpm test`
9. Ship as part of v3.0
