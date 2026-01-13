# Cortex TMS 🧠

**The Universal AI-Optimized Project Boilerplate (v2.1.1)**

Cortex TMS is a **meta-framework** for organizing project documentation to maximize AI agent performance. It's not a runtime library—it's a **structural pattern** that separates high-signal "Source of Truth" from noisy "Historical Context."

**Current Status**: ✅ **Production Ready** | [NPM Package](https://www.npmjs.com/package/cortex-tms) | [GitHub Template](https://github.com/cortex-tms/cortex-tms)

---

## 🚀 Quick Start

### Option 1: CLI Tool (Recommended)

Get started in under 60 seconds:

```bash
mkdir my-project && cd my-project
npx cortex-tms init
```

Choose your scope (Nano/Standard/Enterprise) and start building with AI-optimized documentation.

### Option 2: GitHub Template

Click "Use this template" on the repository homepage to create a new project with all TMS files pre-configured.

### Option 3: Manual Installation

```bash
npm install -g cortex-tms
cortex-tms init --scope standard
```

📖 **New here?** Read the [Quick Start Guide](docs/guides/QUICK-START.md) or [Migration Guide](docs/guides/MIGRATION-GUIDE.md) for existing projects.

---

## 🚀 The Philosophy: Signal over Noise

Traditional repos drown AI agents in thousands of lines of historical tasks and stale documentation. **Cortex TMS** forces the agent into a "Tiered" approach:

1. **HOT (Active)**: `NEXT-TASKS.md` — What we are doing _now_.
2. **WARM (Truth)**: `docs/core/` — The project's "Laws" (Architecture, Patterns, Domain Logic).
3. **COLD (History)**: `docs/archive/` — Historical changelogs (Ignore unless asked).

**Why this works**: AI agents have limited context windows. Reading everything is wasteful. The tier system maximizes signal, minimizes noise.

---

## 📂 Documentation Structure

| Folder / File | Purpose | AI Context Tier |
|:-------------|:--------|:---------------|
| `NEXT-TASKS.md` | Active sprint and current focus | **HOT** (Always Read) |
| `FUTURE-ENHANCEMENTS.md` | Living backlog (not current sprint) | **PLANNING** |
| `CLAUDE.md` | CLI commands & workflow config | **HOT** (Always Read) |
| `.github/copilot-instructions.md` | Global guardrails and critical rules | **HOT** (Always Read) |
| `docs/core/ARCHITECTURE.md` | System design & tech stack | **WARM** (Read on Demand) |
| `docs/core/PATTERNS.md` | Canonical code examples (Do/Don't) | **WARM** (Read on Demand) |
| `docs/core/DOMAIN-LOGIC.md` | Immutable project rules | **WARM** (Read on Demand) |
| `docs/core/GIT-STANDARDS.md` | Git & PM conventions | **WARM** (Read on Demand) |
| `docs/core/DECISIONS.md` | Architecture Decision Records | **WARM** (Read on Demand) |
| `docs/core/GLOSSARY.md` | Project terminology | **WARM** (Read on Demand) |
| `docs/core/SCHEMA.md` | Data models (optional) | **WARM** (Read on Demand) |
| `docs/core/TROUBLESHOOTING.md` | Framework gotchas (optional) | **WARM** (Read on Demand) |
| `docs/archive/` | Historical changelogs | **COLD** (Ignore) |
| `templates/` | Boilerplate files for user projects | N/A (Toolkit) |

---

## 🎯 What Cortex TMS Provides

### For New Projects (Greenfield)
- **GitHub Template Repository**: Click "Use this template" to start a new AI-optimized project
- Pre-configured TMS structure
- Ready-to-customize templates

### For Existing Projects (Brownfield)
- **NPM CLI Tool**: `npx cortex-tms init` (Coming in Phase 4)
- Detects existing structure
- Merges TMS templates safely

### For Developers
- **Example Projects**: Reference implementations (Next.js, CLI tools, APIs)
- **Best Practices Guide**: How to write effective patterns and domain logic
- **Migration Guide**: How to adopt TMS incrementally

---

## 🤖 How to Work with AI Agents in this Repo

This repo is a **"Machine-Legible Project Constitution."** To get the best results from your AI pair programmer:

1. **The Context Trigger**: Start a session by saying:
   > _"Review NEXT-TASKS.md and docs/core. Suggest a plan for Task 1 using the Propose, Justify, Recommend framework."_

2. **Pattern Enforcement**: When implementing a new component, say:
   > _"Follow the patterns in docs/core/PATTERNS.md."_

3. **Truth Anchoring**: If the AI hallucinates logic, point it to `DOMAIN-LOGIC.md`:
   > _"Your calculation is wrong. Refer to the rules in docs/core/DOMAIN-LOGIC.md."_

4. **Check Current Sprint**: Always ask:
   > _"What's in NEXT-TASKS.md? What should I work on?"_

---

## 🛠 Setup (For Cortex TMS Development)

**Prerequisites**:
- Node.js (managed via FN - Fast Node Manager)
- pnpm (package manager)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/cortex-tms.git
cd cortex-tms

# 2. Install dependencies
pnpm install

# 3. Review current tasks
cat NEXT-TASKS.md

# 4. Read the core documentation
# - docs/core/ARCHITECTURE.md - System design
# - docs/core/DOMAIN-LOGIC.md - TMS principles
# - docs/core/PATTERNS.md - Template patterns
```

---

## 📋 Development Roadmap

See `NEXT-TASKS.md` for current sprint and `FUTURE-ENHANCEMENTS.md` for backlog.

**Completed Phases**:
- [x] **Phase 1**: Dogfood the System - Apply TMS to Cortex itself
- [x] **Phase 1.5**: Resolve Rule 4 Violation - Modularize Git standards
- [x] **Phase 2**: Complete Template Library - All 15 templates built and validated
- [x] **Phase 3**: Build Example App - Gold Standard Next.js 15 Todo App ✨
  - ✅ Full CRUD operations (create, read, update, delete, clear completed)
  - ✅ Polished UX with empty states, bulk actions, and accessibility features
  - ✅ Complete TMS documentation (ARCHITECTURE, PATTERNS, DOMAIN-LOGIC, SCHEMA)
  - ✅ 10 documented implementation patterns with canonical examples
  - ✅ Production build verified, TypeScript strict mode, lint passing
  - 📍 **Location**: [`examples/todo-app/`](./examples/todo-app/)

**Current Phase**: Phase 4 - Create CLI Tool (🔄 In Progress)
- [ ] Design CLI architecture with Commander.js
- [ ] Implement interactive prompts with Inquirer.js
- [ ] Add template copy with placeholder replacement
- [ ] Support greenfield and brownfield scenarios
- [ ] Test `npx cortex-tms init` workflow

**Future Phases**:
- Phase 5: Write documentation guides (Quick Start, Migration, Best Practices)
- Phase 6: Publish to npm + GitHub Template

---

## 🏗️ Project Structure

```
cortex-tms/
├── NEXT-TASKS.md              # HOT: Current sprint
├── FUTURE-ENHANCEMENTS.md     # PLANNING: Backlog
├── CLAUDE.md                  # HOT: Workflow config
├── README.md                  # This file
├── .github/
│   └── copilot-instructions.md # HOT: AI guardrails
├── templates/                 # User-facing boilerplate
│   ├── NEXT-TASKS.md
│   ├── CLAUDE.md
│   ├── .github/
│   │   └── copilot-instructions.md
│   └── docs/
│       ├── core/
│       │   ├── ARCHITECTURE.md
│       │   ├── PATTERNS.md
│       │   ├── DOMAIN-LOGIC.md
│       │   ├── DECISIONS.md
│       │   ├── GLOSSARY.md
│       │   ├── SCHEMA.md
│       │   └── TROUBLESHOOTING.md
│       └── archive/
│           └── v1.0-CHANGELOG.md
├── docs/                      # Cortex TMS documentation
│   ├── core/
│   │   ├── ARCHITECTURE.md
│   │   ├── PATTERNS.md
│   │   ├── DOMAIN-LOGIC.md
│   │   ├── DECISIONS.md
│   │   ├── GLOSSARY.md
│   │   └── PHILOSOPHY.md
│   └── archive/
│       └── v1.0-CHANGELOG.md
├── examples/                  # Reference implementations
│   └── todo-app/             # ✅ Gold Standard Next.js 15 Todo App
├── bin/                       # CLI tool entry point
└── src/                       # CLI tool source code
```

---

## 🧪 Validation: Dogfooding

**This repository uses TMS to build itself.**

- Cortex's own `NEXT-TASKS.md` tracks Cortex development
- Cortex's own `docs/core/PATTERNS.md` documents template patterns
- If the structure doesn't work for Cortex, it won't work for users

**Validation Test**: "Can an AI agent working on Cortex find what it needs in < 3 file reads?"

---

## 📚 Key Documentation

- **For AI Agents**: Read `.github/copilot-instructions.md` first
- **For Developers**: Read `docs/core/ARCHITECTURE.md` for system design
- **For Contributors**: Read `docs/core/PATTERNS.md` for template patterns
- **For Understanding**: Read `docs/core/DOMAIN-LOGIC.md` for TMS principles

---

## 🤝 Contributing

1. Read `NEXT-TASKS.md` to see what's being worked on
2. Check `FUTURE-ENHANCEMENTS.md` for backlog items
3. Follow patterns in `docs/core/PATTERNS.md`
4. Verify changes against `docs/core/DOMAIN-LOGIC.md`
5. Test templates with AI agents before submitting

---

## 📖 Learn More

- **Philosophy**: See `docs/core/PHILOSOPHY.md` (coming soon)
- **Architecture**: See `docs/core/ARCHITECTURE.md`
- **Decisions**: See `docs/core/DECISIONS.md` for ADRs
- **Glossary**: See `docs/core/GLOSSARY.md` for terminology

---

## License

MIT

---

## Status

**Version**: 2.1 (In Development)
**Last Updated**: 2026-01-12
**Current Sprint**: Phase 4 - CLI Tool 🔄 In Progress
**Completed Sprints**: Phase 1, 1.5, 2, 3 (see `docs/archive/sprint-2026-01.md`)
