# Changelog

All notable changes to Cortex TMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2026-01-14

### 🎉 "Scaling Intelligence" Release

This release transforms Cortex TMS from a static boilerplate into an interactive operating system for AI-assisted development. By introducing version tracking infrastructure and an intelligent prompt engine, v2.4 enables both **Repository Scaling** (safe template evolution) and **Interaction Scaling** (frictionless AI collaboration).

### Added

#### Prompt Engine (TMS-240) - The Activation Layer
- **`cortex-tms prompt` command**: Access project-aware AI prompt templates
  - **Essential 7 Library**: Curated prompts covering the entire development lifecycle
    - `init-session`: Session initialization and planning
    - `feature`: New feature implementation with architectural anchors
    - `debug`: Troubleshooting guidance with known issues lookup
    - `review`: Code review against project patterns
    - `refactor`: Structural improvement while maintaining domain logic
    - `decision`: Architecture decision record creation
    - `finish`: Maintenance protocol execution
  - **Interactive Selection**: Fuzzy-search interface powered by inquirer
  - **Direct Access**: `cortex-tms prompt init-session` for instant retrieval
  - **Automatic Clipboard**: Selected prompts copied automatically for instant paste
  - **List Mode**: `--list` flag to browse all available prompts
  - **Project Customization**: Prompts stored in `PROMPTS.md` for team-specific vocabulary
- **`PROMPTS.md`**: New HOT-tier file included in Standard & Enterprise scopes
  - Markdown-based format for human and AI readability
  - Version-tagged for migration detection
  - Customizable per-project without CLI changes

#### Migration Auditor (TMS-236/TMS-237) - Repository Intelligence
- **`cortex-tms migrate` command**: Intelligent template version management
  - **Status Detection**: Categorizes files into 4 states
    - `LATEST`: Already on target version
    - `OUTDATED`: Old version matching template (safe to upgrade)
    - `CUSTOMIZED`: Old version with user modifications (manual review needed)
    - `MISSING`: Optional file not installed
  - **Customization Analysis**: Compares user files against templates
  - **Dry-Run Mode**: Preview migration plan without modifications
  - **User Guidance**: Clear next steps with template comparison links
- **Version Metadata Infrastructure**: All generated markdown files now include `@cortex-tms-version` tags
  - Hidden comments for lifecycle tracking
  - Retroactively applied to all 26 template files (v2.3.0 baseline)
  - Enables safe future upgrades and conflict detection
- **Version Utilities**: Parser functions for extracting and injecting version metadata

### Improved
- **Scope Integration**: `PROMPTS.md` automatically included when using Standard or Enterprise scopes
- **Test Coverage**: Updated integration tests to reflect new file counts (10 for Standard, 12 for Enterprise)
- **Template System**: Enhanced with version injection during `init` command

### Dependencies
- **Added**: `clipboardy` (v4.0.0) - Clipboard integration for prompt engine

### Documentation
- Updated NEXT-TASKS.md with v2.5 roadmap (Interactive Tutorial, Auto-Upgrade Logic)
- Added prompt usage examples and customization guide in PROMPTS.md

### Technical Details
- Migration Auditor ships as "report-only" in v2.4 (safe foundation)
- Automatic upgrade logic with backup/rollback deferred to v2.5 based on user feedback strategy
- Prompt parser handles markdown sections with graceful error handling
- Clipboard operations include fallback for SSH/headless environments

---

## [2.3.0] - 2026-01-13

### 🎉 "Confidence & Comfort" Release

This release transforms Cortex TMS from a documentation utility into a **Project Cockpit**, focusing on user trust, developer experience, and daily workflow integration.

### Added

#### Status Dashboard (TMS-235)
- **`cortex-tms status` command**: Visual project health dashboard
  - Project identity display (name, scope, TMS version)
  - Health status with validation summary
  - Current sprint progress with visual bar (ASCII art)
  - Task breakdown (done/in progress/todo)
  - Backlog size from FUTURE-ENHANCEMENTS.md
  - Contextual quick actions based on project state
  - Fast execution (< 1 second) for daily standups and context switching

#### VS Code Snippet Library (TMS-234)
- **12 productivity-boosting snippets** for TMS documentation patterns
  - `tms-adr`: Complete Architecture Decision Record scaffold
  - `tms-pattern`: Implementation pattern entry
  - `tms-term`, `tms-acronym`: Glossary definitions
  - `tms-task`, `tms-sprint`: Task and sprint scaffolding
  - `tms-domain`, `tms-trouble`, `tms-arch`: Structured documentation
  - `tms-code`, `tms-xref`, `tms-dod`: Utility snippets
- Auto-installed during `init` for Standard/Enterprise scopes
- Installed to `.vscode/tms.code-snippets`
- Eliminates "blank page" friction for documentation maintenance

#### Self-Healing Validation (TMS-233)
- **`--fix` flag for `validate` command**: Automatically repairs common issues
  - Creates missing mandatory files (NEXT-TASKS.md, CLAUDE.md, etc.)
  - Generates missing .cortexrc configuration
  - Copies templates with proper placeholder replacement
  - Ensures `.github/copilot-instructions.md` exists
- Non-destructive: Only fixes missing files, never overwrites existing ones

#### Dry Run Mode (TMS-231)
- **`--dry-run` flag for `init` command**: Preview changes before execution
  - Shows which files would be created, updated, or skipped
  - Impact analysis with file counts
  - Safe exploration of TMS setup without side effects
  - Ideal for understanding scope differences

#### Non-Interactive Mode (TMS-231)
- **`--scope` flag for `init` command**: CI/CD-friendly initialization
  - No TTY required (works in automated environments)
  - Auto-installs snippets for Standard/Enterprise scopes
  - Uses sensible defaults (project name from directory)
  - Enables scripted TMS deployment

### Improved
- **Init Workflow**: Added interactive prompt for VS Code snippet installation
- **CLI Documentation**: Comprehensive sections for all new features with examples and usage tips
- **Error Handling**: Better error messages for non-TTY environments
- **Validation Logic**: Improved placeholder detection and scope-aware line limits
- **UX Polish**: Visual progress indicators and contextual command suggestions

### Changed
- **CLI-USAGE.md**: Updated to version 2.3.0 with new command documentation

### Fixed
- Fixed TTY detection crashes in CI/CD environments
- Improved TypeScript strict mode compliance for status parsing

## [2.2.0] - 2026-01-13

### Added
- **Custom File Selection**: Users can now cherry-pick specific files during `init` using the "Custom" scope with interactive checkbox interface
- **Enterprise Architecture Template**: Updated `ARCHITECTURE.md` template with professional Observability & Monitoring, Scalability & Performance, and Infrastructure as Code sections
- **Branch Cleanup Policy**: Codified the "Clean Trunk" policy in `GIT-STANDARDS.md` and `CLAUDE.md` to prevent branch rot
- **Post-Task Protocol**: Added comprehensive 7-step maintenance workflow in `CLAUDE.md` for systematic task completion

### Improved
- **CI/CD Governance**: Added GitHub Action that automatically runs `cortex-tms validate --strict` on all PRs and pushes to main
- **AI Agent Attention**: Moved Git Protocol to CRITICAL RULES section at top of `copilot-instructions.md` for better agent compliance
- **Validation Engine**: Enhanced scope-aware line limits and improved placeholder detection logic
- **Git Standards**: Elevated Git Protocol to "ZERO TOLERANCE" status with mandatory branch-first workflow

### Changed
- **NEXT-TASKS.md**: Transitioned from v2.2 to v2.3 cycle planning
- **Custom Scope**: Added fourth scope option to init flow (Nano/Standard/Enterprise/Custom)

## [2.1.1] - 2026-01-13

### Fixed
- **CLI Runtime Error**: Fixed "Cannot find package 'tsx'" error during `npx cortex-tms init`.
- **Binary Optimization**: Simplified entry point to use standard Node.js without `tsx` wrapper.

## [2.1.0] - 2026-01-13

### 🎉 Initial Stable Release

**Cortex TMS v2.1.0** represents the first production-ready release of the Universal AI-Optimized Project Boilerplate system.

### Added

#### Phase 1-2: Foundation & Templates
- Complete Tiered Memory System (TMS) architecture
- 11 production-ready template files with placeholder syntax
- Framework-agnostic design patterns
- Comprehensive domain logic documentation

#### Phase 3: Gold Standard Example
- Next.js 15 Todo App with full CRUD operations
- TypeScript strict mode implementation
- Accessibility-compliant UI (ARIA, semantic HTML, keyboard navigation)
- 10 documented implementation patterns with canonical examples

#### Phase 4: CLI Tool
- `cortex-tms init` command with interactive prompts
- Scope-based initialization (Nano/Standard/Enterprise)
- `.cortexrc` configuration system
- `cortex-tms validate` command with health checks
- Rule 4 enforcement (file size limits)
- Placeholder detection
- 30-test Vitest suite (100% passing)
- CLI-USAGE.md comprehensive guide

#### Phase 5: User Documentation
- QUICK-START.md for greenfield projects
- MIGRATION-GUIDE.md for brownfield integration
- BEST-PRACTICES.md for TMS maintenance patterns
- Scope-aware guidance validated against implementation

### Features

#### Template System
- **Nano Scope**: 2 files (NEXT-TASKS.md, CLAUDE.md) for scripts and small tools
- **Standard Scope**: 9 files for most products (recommended)
- **Enterprise Scope**: 11 files with advanced schemas and troubleshooting

#### Validation Engine
- Mandatory file checks
- Line limit enforcement (Rule 4)
- Placeholder detection
- Archive status monitoring
- `--strict` mode for CI/CD pipelines
- `--verbose` mode for debugging

#### Configuration
- `.cortexrc` file support
- Custom line limits per file
- Ignore patterns for validation
- Project scope presets

### Technical Details

- **Node.js**: >=18.0.0
- **Package Manager**: pnpm, npm, or yarn
- **Bundle Size**: 40.8 KB (minified)
- **License**: MIT

### Acknowledgments

Built with contributions from:
- Claude Sonnet 4.5 (AI Pair Programming)
- Cortex TMS Contributors

---

## Future Releases

See `FUTURE-ENHANCEMENTS.md` for planned features in upcoming versions.

[2.1.1]: https://github.com/cortex-tms/cortex-tms/releases/tag/v2.1.1
[2.1.0]: https://github.com/cortex-tms/cortex-tms/releases/tag/v2.1.0

<!-- @cortex-tms-version 2.3.0 -->
