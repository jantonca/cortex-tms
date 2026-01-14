# Cortex TMS 🧠

**The Universal AI-Optimized Project Boilerplate (v2.4.1)**

Cortex TMS is an **interactive operating system for AI-assisted development**. It's not just documentation—it's an **activation layer** that turns your repository into a machine-legible project constitution with intelligent tooling for version management and AI collaboration.

**Current Status**: ✅ **Stable / Production Ready** | [NPM Package](https://www.npmjs.com/package/cortex-tms) | [GitHub Repository](https://github.com/jantonca/cortex-tms)

---

## 🚀 Instant Activation

Get started in under 60 seconds:

```bash
# 1. Initialize your project
npx cortex-tms init

# 2. Open the Project Cockpit
npx cortex-tms status

# 3. Activate your AI Agent
npx cortex-tms prompt init-session
# (Copies project-aware prompt to clipboard!)

# 4. Check version health
npx cortex-tms migrate
```

Choose your scope (Nano/Standard/Enterprise) and start building with AI-optimized documentation and intelligent CLI tooling.

📖 **New here?** The Essential 7 prompts in `PROMPTS.md` will guide you through the entire development lifecycle.

---

## 🎯 The Philosophy: Signal over Noise

Traditional repos drown AI agents in thousands of lines of historical tasks and stale documentation. **Cortex TMS** forces agents into a "Tiered" approach:

1. **HOT (Active)**: `NEXT-TASKS.md`, `PROMPTS.md` — What we are doing _now_ and how to ask the AI for help.
2. **WARM (Truth)**: `docs/core/` — The project's "Laws" (Architecture, Patterns, Domain Logic).
3. **COLD (History)**: `docs/archive/` — Historical changelogs (Ignore unless asked).

**Why this works**: AI agents have limited context windows. Reading everything is wasteful. The tier system maximizes signal, minimizes noise.

---

## 🛠️ CLI Commands

Cortex TMS provides 5 production-ready commands:

### `cortex-tms init`
Initialize TMS structure in your project with interactive scope selection.

```bash
cortex-tms init                    # Interactive mode
cortex-tms init --scope standard   # Non-interactive
cortex-tms init --dry-run          # Preview changes
```

### `cortex-tms validate`
Verify your project's TMS health and auto-fix common issues.

```bash
cortex-tms validate         # Check project health
cortex-tms validate --fix   # Auto-repair missing files
cortex-tms validate --strict # Strict mode with no warnings
```

### `cortex-tms status`
Project cockpit with health dashboard, sprint progress, and quick actions.

```bash
cortex-tms status  # Visual dashboard with progress bars
```

### `cortex-tms migrate`
Intelligent version management—detect outdated templates and automatically upgrade with safety backups.

```bash
cortex-tms migrate              # Analyze version status
cortex-tms migrate --apply      # Auto-upgrade OUTDATED files (creates backup)
cortex-tms migrate --apply --force # Upgrade ALL files including customized
cortex-tms migrate --dry-run    # Preview migration plan
```

**Status Categories**:
- `LATEST`: Already on current version
- `OUTDATED`: Safe to auto-upgrade (matches old template)
- `CUSTOMIZED`: Manual review needed (has user changes)
- `MISSING`: Optional file not installed

**Safety Features**:
- Automatic backups in `.cortex/backups/` before any changes
- Timestamped snapshots with manifest files
- Rollback-ready restoration points

### `cortex-tms prompt`
Access project-aware AI prompts from the Essential 7 library.

```bash
cortex-tms prompt              # Interactive selection
cortex-tms prompt init-session # Direct access (auto-copies to clipboard!)
cortex-tms prompt --list       # Browse all prompts
```

**The Essential 7**:
- `init-session` - Start your AI session with context
- `feature` - Implement new features with architectural anchors
- `debug` - Troubleshoot with known issues lookup
- `review` - Code review against project patterns
- `refactor` - Structural improvements
- `decision` - Create Architecture Decision Records
- `finish` - Execute maintenance protocol

---

## 📂 Documentation Structure

| Folder / File | Purpose | AI Context Tier |
|:-------------|:--------|:---------------|
| `NEXT-TASKS.md` | Active sprint and current focus | **HOT** (Always Read) |
| `PROMPTS.md` | AI interaction templates (Essential 7) | **HOT** (Always Read) |
| `CLAUDE.md` | CLI commands & workflow config | **HOT** (Always Read) |
| `.github/copilot-instructions.md` | Global guardrails and critical rules | **HOT** (Always Read) |
| `FUTURE-ENHANCEMENTS.md` | Living backlog (not current sprint) | **PLANNING** |
| `docs/core/ARCHITECTURE.md` | System design & tech stack | **WARM** (Read on Demand) |
| `docs/core/PATTERNS.md` | Canonical code examples (Do/Don't) | **WARM** (Read on Demand) |
| `docs/core/DOMAIN-LOGIC.md` | Immutable project rules | **WARM** (Read on Demand) |
| `docs/core/GIT-STANDARDS.md` | Git & PM conventions | **WARM** (Read on Demand) |
| `docs/core/DECISIONS.md` | Architecture Decision Records | **WARM** (Read on Demand) |
| `docs/core/GLOSSARY.md` | Project terminology | **WARM** (Read on Demand) |
| `docs/core/SCHEMA.md` | Data models (optional) | **WARM** (Read on Demand) |
| `docs/core/TROUBLESHOOTING.md` | Framework gotchas (optional) | **WARM** (Read on Demand) |
| `docs/archive/` | Historical changelogs | **COLD** (Ignore) |

---

## 🚀 What's New in v2.4.0

### Migration Auditor (Repository Scaling)
- **Version Tracking**: All templates include `@cortex-tms-version` metadata
- **Customization Detection**: Compares your files against original templates
- **Safe Upgrades**: Never lose custom changes during template evolution
- **Status Reports**: Clear categorization of file states (LATEST, OUTDATED, CUSTOMIZED)

### Prompt Engine (Interaction Scaling)
- **Essential 7 Library**: Curated prompts for the entire development lifecycle
- **Clipboard Integration**: One command, instant activation
- **Project-Aware**: Prompts reference YOUR architecture, patterns, and domain logic
- **Customizable**: Edit `PROMPTS.md` to match team vocabulary

### Enhanced Developer Experience
- **Status Dashboard**: Visual progress bars and health metrics
- **Self-Healing Validation**: `--fix` flag auto-repairs common issues
- **Dry-Run Mode**: Preview all changes before applying
- **VS Code Snippets**: 12 productivity snippets for rapid documentation

---

## 🤖 How to Work with AI Agents

This repo is a **"Machine-Legible Project Constitution."** To get the best results:

### 1. The Context Trigger
```bash
cortex-tms prompt init-session
# Copies: "Review NEXT-TASKS.md, docs/core/ARCHITECTURE.md, and CLAUDE.md.
#          Summarize current priorities and propose a step-by-step plan..."
```

### 2. Pattern Enforcement
```bash
cortex-tms prompt review
# Copies: "Review the current changes against PATTERNS.md.
#          Flag any violations and suggest specific fixes."
```

### 3. Truth Anchoring
If the AI hallucinates logic:
> _"Your calculation is wrong. Refer to the rules in docs/core/DOMAIN-LOGIC.md."_

### 4. Check Current Sprint
```bash
cortex-tms status  # Visual dashboard with current tasks
```

---

## 📋 Development Roadmap

**Completed Phases** (All ✅):
- [x] **Phase 1**: Dogfood the System - Applied TMS to Cortex itself
- [x] **Phase 2**: Complete Template Library - All templates built and validated
- [x] **Phase 3**: Build Example App - Gold Standard Next.js 15 Todo App
- [x] **Phase 4**: Create CLI Tool - Full-featured CLI with 5 commands
- [x] **Phase 5**: Documentation & Guides - Status dashboard, snippets, validation
- [x] **Phase 6**: Publish & Scale - npm package + GitHub releases

**Current Version**: v2.4.0 "Scaling Intelligence"
- ✅ Migration Auditor with version tracking
- ✅ Prompt Engine with Essential 7 library
- ✅ Clipboard integration for frictionless workflows
- ✅ Project-local prompt customization

**Next Phase (v2.5)**: "Guidance & Growth"
- Auto-upgrade logic with `migrate --apply`
- Interactive CLI tutorial for onboarding
- Custom template directory support

See `NEXT-TASKS.md` for current sprint details and `CHANGELOG.md` for full version history.

---

## 🏗️ Project Structure

```
cortex-tms/
├── NEXT-TASKS.md              # HOT: Current sprint
├── PROMPTS.md                 # HOT: AI interaction templates
├── FUTURE-ENHANCEMENTS.md     # PLANNING: Backlog
├── CLAUDE.md                  # HOT: Workflow config
├── README.md                  # This file
├── .github/
│   └── copilot-instructions.md # HOT: AI guardrails
├── bin/                       # CLI executable
├── src/                       # CLI source code
│   ├── commands/              # CLI commands (init, validate, status, migrate, prompt)
│   ├── utils/                 # Template processing, validation, prompt parsing
│   └── types/                 # TypeScript definitions
├── templates/                 # User-facing boilerplate
│   ├── NEXT-TASKS.md
│   ├── PROMPTS.md            # Essential 7 prompt library
│   ├── CLAUDE.md
│   ├── .github/
│   │   └── copilot-instructions.md
│   ├── vscode/
│   │   └── tms.code-snippets # VS Code productivity snippets
│   └── docs/
│       ├── core/
│       │   ├── ARCHITECTURE.md
│       │   ├── PATTERNS.md
│       │   ├── DOMAIN-LOGIC.md
│       │   ├── GIT-STANDARDS.md
│       │   ├── DECISIONS.md
│       │   ├── GLOSSARY.md
│       │   ├── SCHEMA.md
│       │   └── TROUBLESHOOTING.md
│       └── archive/
│           └── v1.0-CHANGELOG.md
├── docs/                      # Cortex TMS project documentation
│   ├── core/
│   └── archive/
└── examples/                  # Reference implementations
    └── todo-app/             # ✅ Gold Standard Next.js 15 App
```

---

## 🧪 Validation: Dogfooding

**This repository uses TMS to build itself.**

- Cortex's own `NEXT-TASKS.md` tracks Cortex development
- Cortex's own `docs/core/PATTERNS.md` documents template patterns
- Cortex's own `PROMPTS.md` guides AI collaboration on Cortex

**Validation Test**: "Can an AI agent working on Cortex find what it needs in < 3 file reads?" ✅

---

## 📚 Key Documentation

- **For AI Agents**: Read `.github/copilot-instructions.md` and `PROMPTS.md` first
- **For Developers**: Read `docs/core/ARCHITECTURE.md` for system design
- **For Contributors**: Read `docs/core/PATTERNS.md` for template patterns
- **For Understanding**: Read `docs/core/DOMAIN-LOGIC.md` for TMS principles

---

## 🤝 Contributing

1. Read `NEXT-TASKS.md` to see what's being worked on
2. Check `FUTURE-ENHANCEMENTS.md` for backlog items
3. Use `cortex-tms prompt` to get project-aware guidance
4. Follow patterns in `docs/core/PATTERNS.md`
5. Verify changes against `docs/core/DOMAIN-LOGIC.md`
6. Test templates with AI agents before submitting

---

## 📖 Learn More

- **Release Notes**: See `CHANGELOG.md` for version history
- **Architecture**: See `docs/core/ARCHITECTURE.md` for system design
- **Decisions**: See `docs/core/DECISIONS.md` for ADRs
- **Glossary**: See `docs/core/GLOSSARY.md` for terminology
- **Patterns**: See `docs/core/PATTERNS.md` for implementation examples

---

## 🎯 Why Cortex TMS?

**Before TMS**:
- AI agents waste time reading historical noise
- Documentation drifts from reality
- No standard way to constrain AI attention
- Manual prompt writing for every interaction

**After TMS**:
- Tiered structure (HOT/WARM/COLD) maximizes signal
- Version metadata keeps templates synchronized
- Essential 7 prompts provide instant AI activation
- Project-aware guidance scales across team size

**Result**: 3-5x faster AI collaboration with fewer hallucinations.

---

## License

MIT

---

## Status

**Version**: 2.4.1 (Stable / Production Ready)
**Last Updated**: 2026-01-14
**Current Sprint**: v2.5 Planning - "Guidance & Growth"
**Completed Sprints**: v2.1, v2.2, v2.3, v2.4 (see `docs/archive/`)

<!-- @cortex-tms-version 2.4.1 -->
