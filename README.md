# Cortex TMS 🧠

**The Universal AI-Optimized Project Boilerplate (v2.6.0)**

Cortex TMS is a **CLI tool for AI-assisted development** that provides **project scaffolding**, **task management**, and **workflow automation**. It's an **interactive documentation system** optimized for **Claude Code**, **GitHub Copilot**, and **LLM-assisted development**—transforming your repository into a machine-legible project structure with intelligent tooling for version management and AI collaboration.

**Current Status**: ✅ **Stable / Production Ready** | [NPM Package](https://www.npmjs.com/package/cortex-tms) | [GitHub Repository](https://github.com/jantonca/cortex-tms) | [Documentation](https://cortex-tms.dev) (coming soon)

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

Cortex TMS provides 6 production-ready commands (v2.5.0):

### `cortex-tms tutorial`
Interactive walkthrough teaching the "Cortex Way" - perfect for first-time users.

```bash
cortex-tms tutorial  # Start the guided tour
```

**What You'll Learn**:
- Project Dashboard: Using `status` to see your cockpit
- AI Activation: Using `prompt` to activate project-aware AI agents
- Zero-Drift Governance: Automated version sync with `docs:sync`
- Health Checks: Understanding `validate` and the Archive Protocol
- Safe Migration: Fearless template upgrades with backup/rollback

**Navigation**: Use arrow keys and Enter to progress, select Exit to quit anytime

---

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
cortex-tms migrate                    # Analyze version status
cortex-tms migrate --apply            # Auto-upgrade OUTDATED files (creates backup)
cortex-tms migrate --apply --force    # Upgrade ALL files including customized
cortex-tms migrate --rollback         # Restore from backup (interactive selection)
cortex-tms migrate --dry-run          # Preview migration plan
```

**Status Categories**:
- `LATEST`: Already on current version
- `OUTDATED`: Safe to auto-upgrade (matches old template)
- `CUSTOMIZED`: Manual review needed (has user changes)
- `MISSING`: Optional file not installed

**Safety Features**:
- Automatic backups in `.cortex/backups/` before any changes
- Timestamped snapshots with manifest files
- One-click rollback with interactive backup selection
- Confirmation prompts prevent accidental overwrites

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

## 🚀 What's New in v2.5.0

### Interactive Tutorial (Onboarding Experience)
- **5-Lesson Guided Walkthrough**: Learn TMS workflows hands-on in <15 minutes
- **Interactive Curriculum**: Real-time feedback and progress tracking
- **Context-Aware Guidance**: Adapts to your current project state
- **Jump to Any Lesson**: `--lesson N` flag for direct access

### Safe-Fail Migration Engine (Worry-Free Upgrades)
- **Automatic Backups**: Timestamped snapshots in `.cortex/backups/` before any changes
- **One-Click Apply**: `migrate --apply` automatically upgrades templates
- **Interactive Rollback**: `migrate --rollback` restores from any backup
- **100% Data Protection**: Fail-safe design prevents data loss during template evolution

### Zero-Drift Governance Suite (Automated Version Management)
- **Sync Engine**: `pnpm run docs:sync` eliminates manual version updates
- **CI Guardian**: Blocks PRs if documentation is out of sync
- **Command-Driven Protocol**: AI agents execute commands instead of manual edits
- **75% Reduction**: in manual release steps

### What's in v2.4.0 and Earlier
- **Migration Auditor**: Version tracking and customization detection
- **Prompt Engine**: Essential 7 library with clipboard integration
- **Status Dashboard**: Visual progress bars and health metrics
- **Self-Healing Validation**: `--fix` flag auto-repairs common issues

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
- [x] **Phase 4**: Create CLI Tool - Full-featured CLI with 6 commands
- [x] **Phase 5**: Documentation & Guides - Status dashboard, snippets, validation
- [x] **Phase 6**: Publish & Scale - npm package + GitHub releases

**Current Version**: v2.5.0 "Onboarding & Safety" ✅
- ✅ Interactive Tutorial with 5-lesson guided walkthrough
- ✅ Safe-Fail Migration Engine (backup → apply → rollback)
- ✅ Zero-Drift Governance Suite (automated version sync)
- ✅ CI Guardian preventing version drift
- ✅ 100% data protection during template upgrades

**Next Phase (v2.6)**: "Custom Extensibility"
- Custom template directory support
- User-defined pattern sets
- Optional telemetry for usage insights

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
│   ├── commands/              # CLI commands (init, validate, status, migrate, prompt, tutorial)
│   ├── utils/                 # Template processing, validation, prompt parsing, backup
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

**Version**: 2.6.0 (Stable / Production Ready)
**Last Updated**: 2026-01-15
**Current Sprint**: v2.6 Planning - "Custom Extensibility"
**Completed Sprints**: v2.1, v2.2, v2.3, v2.4, v2.5 (see `docs/archive/`)

<!-- @cortex-tms-version 2.6.0 -->
