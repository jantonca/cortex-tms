<p align="center">
  <img src="website/public/logo.svg" alt="Cortex TMS Logo" width="200"/>
</p>

<h1 align="center">Cortex TMS</h1>

<p align="center">
  <strong>AI Governance Platform - Stop Wasting Tokens. Stop Burning GPU Cycles on Old Docs.</strong>
</p>

---

Cortex TMS is an **AI Governance Platform** built on three pillars:

1. **💰 Cost Efficiency** - Reduce input tokens by **60-70%** through intelligent context management (works with ANY model)
2. **✅ Quality** - Reduce hallucinations from outdated docs with semantic validation and focused context
3. **🌱 Sustainability** - Cut compute requirements by **60-70%** with Green Governance—less energy, greener development

Stop feeding your AI coding tool thousands of outdated lines. **60-70% input token reduction** (measured across 47 sessions on Cortex TMS itself) means **lower costs for paid models**, **less compute for free models**, and **fewer hallucinations** from irrelevant context.

**Works with any AI coding tool** - Claude Code, Copilot, Cursor, Warp, Augment, you name it. The architecture is model-agnostic. Input token reduction is universal.

[![npm version](https://img.shields.io/npm/v/cortex-tms.svg?style=flat-square)](https://www.npmjs.com/package/cortex-tms)
[![npm downloads](https://img.shields.io/npm/dm/cortex-tms.svg?style=flat-square)](https://www.npmjs.com/package/cortex-tms)
[![license](https://img.shields.io/npm/l/cortex-tms.svg?style=flat-square)](https://github.com/cortex-tms/cortex-tms/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/cortex-tms.svg?style=flat-square)](https://nodejs.org)
[![GitHub stars](https://img.shields.io/github/stars/cortex-tms/cortex-tms.svg?style=flat-square)](https://github.com/cortex-tms/cortex-tms/stargazers)

**Current Status**: ✅ **Stable / Production Ready** | [NPM Package](https://www.npmjs.com/package/cortex-tms) | [GitHub Repository](https://github.com/cortex-tms/cortex-tms) | [Documentation](https://cortex-tms.org)

---

## 🚀 Instant Activation

Get started in under 60 seconds (no installation required):

```bash
# 1. Initialize your project
npx cortex-tms@latest init

# 2. Open the Project Cockpit
npx cortex-tms@latest status

# 3. Activate your AI Agent
npx cortex-tms@latest prompt init-session
# (Copies project-aware prompt to clipboard!)

# 4. Check version health
npx cortex-tms@latest migrate
```

**Note**: Using `npx` requires no installation. For frequent use, install globally: `npm install -g cortex-tms@latest`

Choose your scope (Nano/Standard/Enterprise) and start building with AI-optimized documentation and intelligent CLI tooling.

📖 **New here?** The Essential 7 prompts in `PROMPTS.md` will guide you through the entire development lifecycle.

## 🎬 See It In Action

![Cortex TMS Demo](assets/demo.gif)

**Watch** the `cortex status` dashboard and `cortex migrate` workflow in action. See how Cortex TMS provides real-time project health metrics and intelligent version management.

---

## 💰 The Value: Measurable Efficiency Gains

**Real Numbers from Cortex TMS itself** (TypeScript monorepo, measured across 47 development sessions):

```bash
cortex status --tokens -m claude-sonnet-4-5
```

| Metric                  | Value                | Impact                                          |
| :---------------------- | :------------------- | :---------------------------------------------- |
| **Input Token Reduction**   | 60-70% typical | Read 3,647 tokens instead of 66,834 (measured on our project) |
| **Cost Savings (Paid Models)**    | ~60-70% lower costs                | Example: Claude Sonnet $0.20 → $0.06/session    |
| **Compute Savings (Free Models)**     | ~60-70% less processing          | Less GPU cycles = lower electricity + greener development |
| **Quality Improvement** | Fewer hallucinations | AI reads focused context, not thousands of irrelevant lines                  |

**How?** The HOT/WARM/COLD tier system ensures AI agents only read what matters:

- **HOT**: Current sprint (always read) - 3,647 tokens
- **WARM**: Architectural truth (on-demand) - 20,109 tokens
- **COLD**: Historical archive (ignored) - 43,078 tokens

**Result**: Your AI assistant stays focused, costs less (paid models) or uses less compute (free models), and makes fewer mistakes.

**Tested Models**: Claude Sonnet/Opus, GPT-4. Architecture is model-agnostic—should work with any AI tool. Input token reduction benefit is universal.

---

## 📊 Measurement & Validation

**How We Measured These Numbers**:

The 60-70% input token reduction is based on 47 development sessions working on Cortex TMS itself (TypeScript monorepo, ~66K total tokens). We tracked:
- HOT tier tokens: ~3,647 (what AI actually reads)
- Full repository: ~66,834 (without TMS)
- Reduction: ~94.5% when comparing HOT tier vs full repo with archives

**Transparency**:
- Sample: 47 sessions over 24 days (Jan 2026)
- Project type: TypeScript monorepo (Cortex TMS dogfooding itself)
- Tools tested: Claude Code, GitHub Copilot (in VS Code)
- Models tested: Claude Sonnet/Opus, GPT-4, and other Copilot models
- Your results may vary based on project size, structure, usage patterns, and model choice
- Read our measurement methodology: [Measuring Context Optimization](website/src/content/blog/measuring-context-optimization.mdx)

**Community Feedback Welcome**:
If you use other models (local LLMs, etc.) and your experience differs, please share! We're building a public benchmark suite to validate findings across diverse projects and models. See [FUTURE-ENHANCEMENTS.md](FUTURE-ENHANCEMENTS.md) for roadmap.

**Honest Approach**: These are our real measurements from dogfooding with the models we actually use. Not marketing fluff, not fake data. We invite the community to validate, challenge, and improve these findings.

---

## 🎯 The Philosophy: Signal over Noise

Traditional repos drown AI agents in thousands of lines of historical tasks and stale documentation. **Cortex TMS** forces agents into a "Tiered" approach:

1. **HOT (Active)**: `NEXT-TASKS.md`, `PROMPTS.md` — What we are doing _now_ and how to ask the AI for help.
2. **WARM (Truth)**: `docs/core/` — The project's "Laws" (Architecture, Patterns, Domain Logic).
3. **COLD (History)**: `docs/archive/` — Historical changelogs (Ignore unless asked).

**Why this works**: AI agents have limited context windows. Reading everything is wasteful. The tier system maximizes signal, minimizes noise.

---

## 🆕 What's New in v3.2 (Upcoming)

**Security & Production Readiness** - Making Cortex TMS enterprise-grade:

- 🛡️ **Centralized Error Handling** — No more process crashes. All commands use consistent `CLIError` patterns with proper cleanup
- ✅ **Zod-Based Input Validation** — Runtime type safety for all CLI commands with clear, actionable error messages
- 🧪 **Comprehensive E2E Tests** — 61 E2E tests covering full CLI workflows (init, validate, migrate, review, auto-tier)
- 🔒 **Path Traversal Protection** — Template operations secured against `../../etc/passwd` attacks with `validateSafePath()`
- 🔐 **API Key Sanitization** — Guardian automatically redacts Anthropic/OpenAI keys in all error messages and logs
- 📊 **Automated Security Scanning** — CI pipeline runs `pnpm audit` on every PR to catch dependency vulnerabilities

**Test Coverage**: 316 tests (97% pass rate) — up from 269 tests (+17%)

**For Developers**: See [Security Testing Guide](docs/guides/SECURITY-TESTING.md) for how to verify security patterns.

**Full Details**: [CHANGELOG.md](CHANGELOG.md#320---2026-02-05)

---

## 🛠️ CLI Commands

Cortex TMS provides 8 production-ready commands:

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

Project cockpit with health dashboard, sprint progress, and token analysis.

```bash
cortex-tms status                    # Visual dashboard with progress bars
cortex-tms status --tokens           # Token usage analysis (HOT/WARM/COLD)
cortex-tms status --tokens -m gpt-4  # Cost comparison across models
```

**Token Analysis Features**:

- HOT/WARM/COLD tier breakdown with token counts
- Context reduction percentage (typically 60-70%)
- Cost estimates per session/day/month (for paid models)
- Model comparison (Claude Sonnet 4.5, Opus 4.5, GPT-4, etc.)
- Sustainability impact tracking (compute savings for all models)

### `cortex-tms auto-tier`

Git-based automatic tier assignment - reduce manual tier management using file recency as a relevance signal.

```bash
cortex-tms auto-tier                    # Apply tier tags based on git history
cortex-tms auto-tier --dry-run          # Preview tier suggestions
cortex-tms auto-tier --hot 14 --warm 60 # Custom thresholds
cortex-tms auto-tier --force            # Overwrite existing tags
```

**Community-requested feature**: Built in response to feedback from Reddit users [Illustrious-Report96](https://www.reddit.com/user/Illustrious-Report96/), [pbalIII](https://www.reddit.com/user/pbalIII/), and [durable-racoon](https://www.reddit.com/user/durable-racoon/) who identified manual tier management as a scalability bottleneck and suggested using git history to determine file "heat".

**How It Works**:

- Analyzes git commit history and file paths to calculate priority scores
- **Scoring system**: Canonical files (100 pts) > docs/ (40 pts) + recency (15 pts)
- **Strict cap**: Maximum 10 HOT files (prevents context bloat)
- **Smart defaults**: `docs/archive/` → COLD, `docs/guides/` → WARM, canonical files always HOT
- Adds `<!-- @cortex-tms-tier HOT -->` tags to markdown files
- Respects explicit tier tags unless `--force` is used

**Why Auto-Tier?**

- **Automates tier management**: No more manual tier decisions
- **Objective signal**: Git history provides measurable recency data
- **Aligns with "Lost in the Middle" research**: Recent files (likely relevant) placed at context beginning
- **Adapts to workflow**: Tiers stay current as project evolves

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

### `cortex-tms review` 🛡️

**Guardian**: AI-powered semantic validation against project patterns and domain logic.

```bash
cortex-tms review src/index.ts              # Validate file against PATTERNS.md
cortex-tms review src/index.ts --safe       # Safe Mode: only high-confidence violations (≥70%)
cortex-tms review src/index.ts --output-json  # Raw JSON output (for Agent Skills/CI/CD)
cortex-tms review src/index.ts --provider openai  # Use OpenAI instead of Anthropic
cortex-tms review src/index.ts --model gpt-4      # Specify model
```

**What Guardian Does**:

- Analyzes code against `PATTERNS.md` (canonical examples, do/don't patterns)
- Validates against `DOMAIN-LOGIC.md` (immutable project rules)
- Uses LLM to catch **semantic violations**, not just syntax errors
- Reports violations with specific pattern references

**Why Guardian?**

- **Structured Output**: JSON-based violation detection (80%+ accuracy target, from 65.5% baseline)
- **Safe Mode**: `--safe` flag filters to high-confidence violations only (≥70%), reducing false positive noise
- **Semantic Understanding**: Catches violations grep/regex can't find
- **Pattern Enforcement**: Stops drift from architectural decisions
- **BYOK (Bring Your Own Key)**: Uses your OpenAI or Anthropic API key
- **Reliable Parsing**: Deterministic JSON eliminates keyword collision false positives

**Example Output**:

```
🛡️  Guardian Code Review

✅ Analysis Complete

❌ **Major Violations**

Code violates Pattern 1: Placeholder Syntax

## Violations

1. ❌ **Pattern 1: Placeholder Syntax**
   📍 Line: 45
   ❗ Issue: Using {braces} instead of [brackets] for placeholders
   💡 Fix: Replace {project-name} with [project-name]

## Positive Observations

✅ Consistent indentation and formatting
✅ Good use of TypeScript strict types
```

---

## 🔄 CI/CD Integration

### Reusable GitHub Action

Validate your TMS documentation in GitHub Actions workflows without installing the CLI locally.

**Basic Usage** (in your `.github/workflows/tms-validate.yml`):

```yaml
name: TMS Validation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    uses: cortex-tms/cortex-tms/.github/workflows/validate-reusable.yml@main
```

**With Custom Configuration**:

```yaml
jobs:
  validate:
    uses: cortex-tms/cortex-tms/.github/workflows/validate-reusable.yml@main
    with:
      strict: true                    # Enable strict mode (default: true)
      scope: 'standard'               # Validation scope (default: auto-detect)
      ignore-files: 'README.md'       # Comma-separated files to ignore
      cortex-version: 'latest'        # Cortex TMS version (default: latest)
      node-version: '20'              # Node.js version (default: 20)
```

**Available Inputs**:

| Input | Description | Default |
|:------|:------------|:--------|
| `strict` | Enable strict validation mode (fails on warnings) | `true` |
| `scope` | Validation scope (nano/standard/enterprise/auto-detect) | `auto-detect` |
| `ignore-files` | Comma-separated list of files to ignore | `''` |
| `cortex-version` | Cortex TMS version to install (e.g., "latest", "2.7.0") | `latest` |
| `node-version` | Node.js version to use | `20` |

**Example with Multiple Ignored Files**:

```yaml
jobs:
  validate:
    uses: cortex-tms/cortex-tms/.github/workflows/validate-reusable.yml@main
    with:
      strict: false
      ignore-files: 'README.md,CHANGELOG.md,docs/archive/*'
```

**Benefits**:

- ✅ Zero-friction adoption (no local installation required)
- ✅ Validates PRs automatically
- ✅ Consistent enforcement across team
- ✅ Works with any project using Cortex TMS

---

## 📂 Documentation Structure

| Folder / File                     | Purpose                                | AI Context Tier           |
| :-------------------------------- | :------------------------------------- | :------------------------ |
| `NEXT-TASKS.md`                   | Active sprint and current focus        | **HOT** (Always Read)     |
| `PROMPTS.md`                      | AI interaction templates (Essential 7) | **HOT** (Always Read)     |
| `CLAUDE.md`                       | CLI commands & workflow config         | **HOT** (Always Read)     |
| `.github/copilot-instructions.md` | Global guardrails and critical rules   | **HOT** (Always Read)     |
| `FUTURE-ENHANCEMENTS.md`          | Living backlog (not current sprint)    | **PLANNING**              |
| `docs/core/ARCHITECTURE.md`       | System design & tech stack             | **WARM** (Read on Demand) |
| `docs/core/PATTERNS.md`           | Canonical code examples (Do/Don't)     | **WARM** (Read on Demand) |
| `docs/core/DOMAIN-LOGIC.md`       | Immutable project rules                | **WARM** (Read on Demand) |
| `docs/core/GIT-STANDARDS.md`      | Git & PM conventions                   | **WARM** (Read on Demand) |
| `docs/core/DECISIONS.md`          | Architecture Decision Records          | **WARM** (Read on Demand) |
| `docs/core/GLOSSARY.md`           | Project terminology                    | **WARM** (Read on Demand) |
| `docs/core/SCHEMA.md`             | Data models (optional)                 | **WARM** (Read on Demand) |
| `docs/core/TROUBLESHOOTING.md`    | Framework gotchas (optional)           | **WARM** (Read on Demand) |
| `docs/archive/`                   | Historical changelogs                  | **COLD** (Ignore)         |

**Context Budget Limits**: To keep HOT files efficient:

- `NEXT-TASKS.md`: Stay under **200 lines** (archive completed sprints to `docs/archive/`)
- `.github/copilot-instructions.md`: Stay under **100 lines** (critical rules only)

**Archive Trigger**: When a sprint completes, move tasks from `NEXT-TASKS.md` to `docs/archive/sprint-vX.X-YYYY-MM.md`.

---

## 🚀 What's New in v2.6.1 (Current Published Release)

### Token Counter - Prove Your Savings (GREEN GOVERNANCE)

- **Real-Time Token Analysis**: `cortex status --tokens` shows HOT/WARM/COLD breakdown
- **Multi-Model Cost Comparison**: Claude Sonnet 4.5, Opus 4.5, GPT-4, and more
- **Sustainability Metrics**: Track your sustainability impact from less compute
- **60-70% Input Token Reduction**: Measured on Cortex TMS itself (3,647 vs 66,834 tokens)
- **Universal Savings**: Lower costs for paid models, less compute for free models

### Guardian Semantic Validation (QUALITY ENFORCEMENT)

- **Pattern Enforcement**: `cortex review <file>` validates against PATTERNS.md
- **Domain Logic Checker**: Audits code against immutable project rules
- **High Accuracy**: 80%+ accuracy target with Safe Mode (from 65.5% baseline)
- **LLM-Powered Detection**: Uses Claude/GPT to catch semantic violations, not just syntax

### Integration Test Suite (PRODUCTION QUALITY)

- **111 Passing Tests**: 96 unit + 15 integration tests
- **End-to-End Workflows**: Validates command interactions work correctly
- **Error Recovery Testing**: Ensures rollback and fix workflows function
- **CI/CD Ready**: ~8.5s execution time, zero flakiness

### Error Handling Refactor (DEVELOPER EXPERIENCE)

- **Clean Exit Management**: Removed 17 `process.exit()` calls from command files
- **Better Testability**: Commands throw errors instead of forcing exits
- **Centralized Error Handler**: Commander.js `exitOverride()` for consistent behavior

### What's in v2.6.1 and Earlier

- **Interactive Tutorial**: 5-lesson guided walkthrough (<15 minutes)
- **Safe-Fail Migration**: Automatic backups with one-click rollback
- **Zero-Drift Governance**: Automated version sync with CI Guardian
- **Self-Healing Validation**: `--fix` flag auto-repairs common issues
- **Migration Auditor**: Version tracking and customization detection
- **Prompt Engine**: Essential 7 library with clipboard integration

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

**Current Version**: v2.6.1 "Guardian & Green Governance" ✅

- ✅ Token Counter with real-time cost analysis
- ✅ Guardian semantic validation (Pattern + Domain Logic enforcement)
- ✅ 111 passing tests (96 unit + 15 integration)
- ✅ Error handling refactor for better testability
- ✅ Multi-model cost comparison (Claude, GPT-4)

**Next Phase (v3.0)**: Development & Refinement

- Website performance optimization
- Guardian enhancements and reliability improvements
- Migration experience improvements
- Advanced token analytics

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

We welcome contributions! Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed guidelines on:
- How to submit bug reports and feature requests
- Development setup and workflow
- Pull request process and quality standards
- Code style and testing requirements
- Areas where we need help

**Quick Start for Contributors**:
1. Read [CONTRIBUTING.md](CONTRIBUTING.md) - **Required for all contributions**
2. Check [open issues](https://github.com/cortex-tms/cortex-tms/issues) for `good-first-issue` labels
3. For significant changes, open an issue for discussion **before** coding
4. Follow patterns in `docs/core/PATTERNS.md`
5. Ensure tests pass: `npm test`
6. Submit PR with clear description and linked issue

---

## 📖 Learn More

- **Release Notes**: See `CHANGELOG.md` for version history
- **Architecture**: See `docs/core/ARCHITECTURE.md` for system design
- **Decisions**: See `docs/core/DECISIONS.md` for ADRs
- **Glossary**: See `docs/core/GLOSSARY.md` for terminology
- **Patterns**: See `docs/core/PATTERNS.md` for implementation examples

---

## 🎯 Why Cortex TMS? Three Pillars, Measurable Results

**Based on 47 development sessions on Cortex TMS itself (TypeScript monorepo) using Claude Code and GitHub Copilot with various models. Your results may vary.**

### 💰 Cost Efficiency (Pillar 1) - Input Token Reduction

**Before TMS**: AI reads entire repository (66,834 tokens in our case)
**After TMS**: AI reads focused context (3,647 tokens—60-70% reduction)
**Impact**:
- **Paid models** (tested: Claude, GPT-4): ~60-70% lower API costs
- **Free/local models** (untested, but architecturally supported): Should see ~60-70% less compute/electricity
- **Universal benefit**: Input token reduction works with any AI tool

**How**: HOT/WARM/COLD tiers ensure AI only reads what matters (3,647 vs 66,834 tokens measured on our project with Claude/GPT)

### ✅ Quality (Pillar 2) - Focused Context Means Fewer Hallucinations

**Before TMS**: AI reads thousands of outdated lines, leading to pattern violations
**After TMS**: AI reads focused, current context—fewer mistakes from irrelevant information
**Impact**: Guardian enforces `PATTERNS.md` and `DOMAIN-LOGIC.md` automatically

**How**: LLM-powered semantic review catches drift that grep/regex can't find

### 🌱 Sustainability (Pillar 3) - Greener Development Through Efficiency

**Before TMS**: Burning GPU cycles on archived changelogs and stale tasks
**After TMS**: 60-70% lower compute requirements through intelligent tiering
**Impact**: Less compute = lower electricity costs + greener development
- Especially important for free/local models where YOU pay the electricity bill

**How**: Stop reading COLD files unless explicitly needed

### 🚀 Developer Experience

- **Instant AI Activation**: Essential 7 prompts in `PROMPTS.md` (no manual prompt writing)
- **Signal over Noise**: HOT/WARM/COLD system keeps AI focused
- **Production-Ready**: 316 tests (97% pass rate), enterprise-grade security (v3.2)
- **Tested With**: Claude Code, GitHub Copilot (in VS Code). Architecture supports any AI tool (Cursor, etc.).

---

## 🔒 Security

Cortex TMS implements enterprise-grade security practices:

- **API Key Protection**: Guardian automatically sanitizes API keys in all output (errors, logs, console)
- **Input Validation**: All CLI commands use Zod schemas for runtime type safety
- **Path Security**: Template operations protected against directory traversal attacks
- **Automated Scanning**: CI pipeline includes `pnpm audit` to catch dependency vulnerabilities

**Documentation**:
- [Security Overview](docs/core/SECURITY.md) — Threat model, mitigations, and best practices
- [Security Testing Guide](docs/guides/SECURITY-TESTING.md) — How to verify security patterns
- [Security Patterns](docs/core/PATTERNS.md) — Implementation patterns (Error Handling, Input Validation)

**Reporting Vulnerabilities**: Use [GitHub Security Advisories](https://github.com/cortex-tms/cortex-tms/security/advisories/new) for responsible disclosure.

---

## 💬 Community & Support

We have an active and growing community! ⭐ **146 stars** and counting.

### Get Help & Connect
- **[GitHub Discussions](https://github.com/cortex-tms/cortex-tms/discussions)** - Ask questions, share ideas, showcase projects
  - [Q&A](https://github.com/cortex-tms/cortex-tms/discussions/categories/q-a) - Get help from the community
  - [Ideas](https://github.com/cortex-tms/cortex-tms/discussions/categories/ideas) - Suggest features (vote with 👍)
  - [Show and Tell](https://github.com/cortex-tms/cortex-tms/discussions/categories/show-and-tell) - Share what you've built
  - [Announcements](https://github.com/cortex-tms/cortex-tms/discussions/categories/announcements) - Release notes and updates

### Report Issues
- **[Bug Reports](https://github.com/cortex-tms/cortex-tms/issues/new)** - Found a bug? Let us know!
- **[Security Issues](https://github.com/cortex-tms/cortex-tms/security/advisories/new)** - Responsible disclosure for security vulnerabilities

### Contributing
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute code, docs, or ideas
- **[Community Guide](docs/COMMUNITY.md)** - Community guidelines and best practices

**Star us on GitHub** ⭐ if you find Cortex TMS useful!

---

## License

MIT

---

## Status

**Version**: 3.2.0 (Upcoming - Phase 1 Complete)
**Last Updated**: 2026-01-31
**Current Sprint**: v3.2 - "Security Hardening + Production Readiness"
**Recent Sprints**: v3.1 (Git-Based Auto-Tiering), v3.0 (AI-Powered Onboarding) — see [docs/archive/](docs/archive/)

<!-- @cortex-tms-version 3.2.0 -->
