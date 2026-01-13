# Changelog

All notable changes to Cortex TMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[2.1.0]: https://github.com/cortex-tms/cortex-tms/releases/tag/v2.1.0
