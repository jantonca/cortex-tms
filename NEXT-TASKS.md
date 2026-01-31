# NEXT: Upcoming Tasks

**Current Sprint**: v3.2 Security & Code Quality (Jan 30 - Feb 1, 2026)
**Previous Sprint**: [v3.1 Git-Based Auto-Tiering](docs/archive/sprint-v3.1-jan-2026.md) ✅ Complete
**Last Updated**: 2026-01-31 (Phase 1 & 2 Complete ✅ - Ready for Release Preparation)

---

## 🎯 v3.2 Sprint: Security & Code Quality

**Timeline**: Jan 30 - Feb 1, 2026 (22-29h total effort)
**Status**: ✅ Phase 1 & 2 Complete - Ready for v3.2.0 Release
**Theme**: Security Hardening + Production Readiness
**Driver**: Address deferred Opus 4.5 audit findings
**Target**: Viability Score 8.5 → 9.0/10

### Sprint Overview

**Decision**: Skipped v3.1.1 patch release to focus on security hardening. v3.1.1 improvements (git detection fix, E2E tests, validation display fix) remain on `main` branch and will be included in v3.2.0.

**Why Security First**:

- Address critical P0 audit findings from Opus 4.5 review
- Build production-ready foundation before feature expansion
- Improve code quality and maintainability
- Reduce technical debt accumulated during rapid v3.0-v3.1 development

**Completed Work**: See [Sprint Archive](docs/archive/sprint-v3.2-jan-2026.md) for detailed task breakdown

- ✅ Phase 1 (P0): 6 security audits + 5 documentation tasks complete
- ✅ Phase 2 (P1): 5 quality documentation tasks complete
- ✅ 316 tests (97% pass rate), security hardened, production-ready foundation

---

## 📦 v3.2.0 Release Notes

**Strategy**: Single bundled release including AUDIT-1 to AUDIT-6 + v3.1.1 improvements
**Status**: ✅ Phase 1 & 2 Complete - 10 test failures remain before release
**See**: [Detailed Plan](docs/tasks/v3.2-polish-docs.md) | [Sprint Archive](docs/archive/sprint-v3.2-jan-2026.md) | [CHANGELOG.md](CHANGELOG.md)

---

## ⚠️ Pre-Release Tasks (v3.2.0)

**IMPORTANT**: Fix before v3.2.0 release (when ready - v3.1.0 released 24h ago)

### POLISH-1: Fix Remaining E2E Test Failures (1-2h)

**Status**: 97% pass rate (306/316 tests passing)
**Issue**: 10 cosmetic test assertion failures (not functional bugs)

**Failures**:
- 4 failures in `src/__tests__/migrate-e2e.test.ts` (dry-run, backup, version tags)
- 6 failures in `src/__tests__/review-e2e.test.ts` (timeouts, assertion patterns)

**Root Cause**: Systemic assertion pattern issues (either/or logic)

**Action Required**: Fix assertion patterns before v3.2.0 release

---

## 📋 Deferred Items (v3.3+)

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

### Optional P1 Tasks (Deferred from v3.1.1)

- **File Selection Alignment**: Align auto-tier file selection with token counter patterns (2h)
- **Centralize Tier Config**: Extract tier patterns/mandatory files to shared module (1h)

**Rationale**: Focus v3.2 on security. These code quality improvements can wait for v3.3.

### v3.3+ Planning Options

**Auto-Tier Polish & Performance** (9-12h)

- Batched git log for large repos
- Parallel file processing
- Respect .gitignore
- Better error messages
- File selection alignment
- Centralize tier config

### Feature Backlog (Post-Security)

- Configuration file support (`.cortexrc.json` for auto-tier)
- Guardian GitHub Action & PR Bot (TMS-287)
- Guardian Enhancements (TECH-2) - watch mode, better errors
- Migration Experience (TMS-277-282) - dry-run, better progress
- Custom Templates Architecture (TMS-241)
- MCP Server Integration
- Advanced token analytics
- Benchmark Suite (prove "3-5x faster" claim)

---

## 🗂️ Sprint Archive

- **v3.2**: [Security Hardening + Production Readiness](docs/archive/sprint-v3.2-jan-2026.md) ✅ Phase 1 & 2 Complete
- **v3.1**: [Git-Based Auto-Tiering](docs/archive/sprint-v3.1-jan-2026.md) ✅
- **v3.0**: [AI-Powered Onboarding](docs/archive/sprint-v3.0-boot-1.md) ✅
- **v2.9**: [Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅
- **Earlier sprints**: See [docs/archive/](docs/archive/) for v2.1-v2.7

<!-- @cortex-tms-version 3.1.0 -->
