# Architecture: Cortex TMS

## System Overview

**Cortex TMS** is a meta-framework for organizing project documentation in a way that maximizes AI agent performance. It's not a runtime library—it's a **structural pattern** enforced through file organization and documentation conventions.

---

## Core Components

### 1. Template Library (`templates/`)

**Purpose**: Pre-built markdown files that users copy into their projects.

**Structure**:
```
templates/
├── NEXT-TASKS.md          # HOT: Sprint management
├── FUTURE-ENHANCEMENTS.md # PLANNING: Backlog
├── CLAUDE.md              # WORKFLOW: AI agent config
├── README.md              # INTRO: Project README
├── .github/
│   └── copilot-instructions.md  # CONTRACT: AI guardrails
└── docs/
    ├── core/              # WARM: Source of Truth
    │   ├── ARCHITECTURE.md
    │   ├── PATTERNS.md
    │   ├── DOMAIN-LOGIC.md
    │   ├── DECISIONS.md
    │   ├── GLOSSARY.md
    │   ├── SCHEMA.md
    │   └── TROUBLESHOOTING.md
    └── archive/           # COLD: History
        └── v1.0-CHANGELOG.md
```

**Design Principles**:
- Templates use bracket syntax for user customization (see DOMAIN-LOGIC.md Rule 3)
- No hardcoded tech stacks (framework-agnostic)
- Each file includes inline documentation

---

### 2. CLI Tool (`bin/`, `src/`)

**Purpose**: Automates template deployment via `npx cortex-tms init`.

**Features**:
- Detects existing project structure (package.json, git repo)
- Interactive prompts for customization (tech stack, which templates to include)
- Safe file operations (never overwrites without confirmation)
- Supports both greenfield (new project) and brownfield (existing project) scenarios

**Tech Stack**:
- Node.js (ES modules)
- TypeScript (strict mode)
- Commander.js (CLI framework)
- Inquirer.js (interactive prompts)
- pnpm (package manager)

**Entry Point**: `bin/cortex-tms.js`

---

### 3. Example Projects (`examples/`)

**Purpose**: Reference implementations showing TMS in action.

**Planned Examples**:
- `examples/todo-app/` - Next.js 15 + TypeScript + Tailwind + Shadcn
- `examples/cli-tool/` - Node.js CLI application
- `examples/api-service/` - Express + PostgreSQL API

**Validation**: Each example is built using AI agents (Claude Code, Copilot) to validate that the TMS structure actually improves agent performance.

---

### 4. Documentation (`docs/`)

**Purpose**: Documentation about Cortex TMS itself (meta-documentation).

**Structure**:
```
docs/
├── core/               # The "why" and "how" of TMS
│   ├── ARCHITECTURE.md (this file)
│   ├── PATTERNS.md    # Template design patterns
│   ├── DOMAIN-LOGIC.md # TMS principles
│   └── PHILOSOPHY.md  # Context window management
└── guides/            # User guides
    ├── QUICK-START.md
    ├── MIGRATION-GUIDE.md
    └── BEST-PRACTICES.md
```

---

## System Mental Model

### The Tiered Memory System

Cortex enforces a **three-tier hierarchy** of documentation:

1. **HOT (Always Read)**:
   - `NEXT-TASKS.md` - Current sprint
   - `.github/copilot-instructions.md` - Critical rules

2. **WARM (Read on Demand)**:
   - `docs/core/PATTERNS.md` - Coding standards
   - `docs/core/DOMAIN-LOGIC.md` - Business rules
   - `docs/core/ARCHITECTURE.md` - System design

3. **COLD (Ignore Unless Asked)**:
   - `docs/archive/` - Historical changelogs

**Why This Works**:
- AI agents have limited context windows
- Traditional repos bury critical info in thousands of lines of docs
- TMS forces "signal over noise" by separating active context from history

---

## Technology Decisions

### Node.js + TypeScript
- **Why**: Universal runtime, npm ecosystem, TypeScript for safety
- **Alternatives Considered**: Rust (too heavy), Go (unfamiliar to JS devs)

### pnpm (Not npm/yarn)
- **Why**: Faster, disk-efficient, better monorepo support
- **User Note**: Uses FN (Fast Node Manager) for Node.js version management

### Commander.js + Inquirer.js
- **Why**: Battle-tested CLI libraries with great UX
- **Alternatives**: yargs (too verbose), oclif (too enterprise)

### Framework-Agnostic Templates
- **Why**: Users may use React, Vue, Svelte, or no framework
- **Strategy**: Templates use placeholders; examples show specific implementations

---

## Deployment Model

### Distribution Channels

1. **GitHub Template Repository**:
   - Users click "Use this template"
   - Best for greenfield projects

2. **NPM Package**:
   - `npx cortex-tms init`
   - Best for adding TMS to existing projects

3. **Manual Copy**:
   - Clone repo, copy `templates/` folder
   - Fallback option

---

## Testing Strategy

### Template Validation
- Copy templates into sample projects
- Test with actual AI agents (Claude Code, Copilot, Cursor)
- Validate that AI follows the structure

### CLI Testing
- Unit tests for file operations
- Integration tests for full init flow
- Test on Windows/Mac/Linux

### Dogfooding
- **This repo uses TMS to build itself**
- If the structure doesn't work for Cortex, it won't work for users

---

## Performance Considerations

### Context Window Efficiency
- Keep HOT files under 300 lines
- Use internal links to WARM files (agent reads on demand)
- Archive aggressively (move completed tasks to COLD)

### File Size Targets
- `NEXT-TASKS.md`: < 200 lines (1 sprint max)
- `PATTERNS.md`: < 500 lines (10-15 patterns)
- `DOMAIN-LOGIC.md`: < 300 lines (core rules only)

---

## Security Considerations

- Never store secrets in templates
- CLI never transmits data (works offline)
- Templates include `.gitignore` patterns for sensitive files

---

## Future Architecture

### Potential Enhancements
- VS Code extension for TMS file management
- GitHub Action to validate TMS structure
- AI agent performance metrics (before/after TMS adoption)

See `FUTURE-ENHANCEMENTS.md` for full backlog.

<!-- @cortex-tms-version 2.6.1 -->
