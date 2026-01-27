# Cortex TMS: AI Prompt Library

This file contains project-aware prompt templates for streamlined AI collaboration. Use `cortex-tms prompt <name>` to quickly access these prompts.

---

## init-session

Review `NEXT-TASKS.md`, `docs/core/ARCHITECTURE.md`, and `CLAUDE.md`. Summarize current priorities and propose a step-by-step plan for the next task.

---

## feature

Implement `[FEATURE]`. First, check `ARCHITECTURE.md` for constraints, follow `PATTERNS.md` for style, and validate logic against `DOMAIN-LOGIC.md`.

---

## debug

I'm seeing `[ISSUE]`. Check `docs/core/TROUBLESHOOTING.md` for known issues, then trace the logic through `ARCHITECTURE.md` to find the failure point.

---

## review

Review the current changes against `PATTERNS.md`. Flag any violations of project conventions and suggest specific fixes.

---

## refactor

Refactor `[COMPONENT]`. Improve structure per `PATTERNS.md` while ensuring behavior remains strictly compliant with `DOMAIN-LOGIC.md`.

---

## decision

We need to decide on `[TOPIC]`. Draft a new Architecture Decision Record in `docs/core/DECISIONS.md` using the project's standard format.

---

## finish

Task complete. Execute the Maintenance Protocol:

1. Run `pnpm run docs:sync` to ensure version integrity across documentation
2. Update `NEXT-TASKS.md` with task status and next priorities
3. Run `node bin/cortex-tms.js validate --strict` to verify project health
4. Follow Git Protocol: commit with conventional format and co-authorship
5. Suggest next priority from backlog

---

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
- Do NOT open or send content from `.env*`, `*.pem`, `id_rsa*`, or similar secret files
- Skip `node_modules/`, `dist/`, `build/`, `coverage/`, `.git/`

---

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

## discover-patterns

Review this codebase and document patterns for `docs/core/PATTERNS.md`:

1. Scan representative files in `src/` for recurring conventions
2. Identify: naming conventions, error handling, component structure, testing patterns
3. For each pattern, find a canonical example (actual file path + code snippet)
4. Document as "Pattern N: Name" with Rule, Anti-Pattern, and Canonical Example

Extract ACTUAL patterns from code, not generic best practices.
Mark all entries with `<!-- AI-DRAFT -->`. Present draft for review before writing.

---

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

## Usage Tips

- Replace placeholders like `[FEATURE]`, `[ISSUE]`, `[COMPONENT]`, `[TOPIC]` with your specific context
- Customize these prompts to match your team's vocabulary and workflow
- Run `cortex-tms prompt --list` to see all available prompts

<!-- @cortex-tms-version 2.6.1 -->
