# NEXT: Upcoming Tasks

**Current Sprint**: v3.2 Security & Code Quality (Jan 30 - TBD)
**Previous Sprint**: [v3.1 Git-Based Auto-Tiering](docs/archive/sprint-v3.1-jan-2026.md) ✅ Complete
**Last Updated**: 2026-01-30 (Post v3.1.0 Release)

---

## 🎯 v3.2 Sprint: Security & Code Quality

**Timeline**: TBD (13-17h total effort)
**Status**: 🚧 Planning Complete - Ready to Start
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

---

## 📋 Core Security Tasks (All P0)

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **[AUDIT-1] Centralize Error Handling** | Remove `process.exit()` calls, use consistent error patterns | 2-3h | 🔴 P0 | ✅ Complete |
| **[AUDIT-2] Zod Input Validation** | Validate CLI inputs at command entry points | 2-3h | 🔴 P0 | ✅ Complete |
| **[AUDIT-3] E2E Test Suite** | Test full CLI workflows (init, validate, migrate, review) | 6-8h | 🔴 P0 | ⏸️ Pending |
| **[AUDIT-4] npm audit CI** | Automated dependency vulnerability scanning | 30m | 🟡 P1 | ✅ Complete |
| **[AUDIT-5] Path Traversal Protection** | Validate template paths prevent `../../etc/passwd` attacks | 1-2h | 🔴 P0 | ✅ Complete |
| **[AUDIT-6] API Key Redaction** | Ensure Guardian API keys never logged or exposed | 1-2h | 🔴 P0 | ✅ Complete |

**Total Core Effort**: 13-17h

---

## ✅ Sprint Success Criteria

### Security & Code Quality
- [x] Zero `process.exit()` calls in src/ (except bin entry point)
- [x] All CLI commands use Zod for input validation
- [ ] E2E test coverage ≥ 80% for core workflows
- [x] CI pipeline includes `npm audit` check
- [x] Template path validation prevents directory traversal
- [x] Guardian sanitizes API keys in all output paths

### Testing & Validation
- [x] All 269 tests continue to pass (was 174, now 269 with new tests)
- [ ] New E2E tests cover: `init`, `validate`, `migrate`, `review` commands
- [ ] `cortex-tms validate --strict` passes
- [ ] Build successful with no warnings

### Documentation
- [ ] Update CHANGELOG.md with security improvements
- [ ] Document error handling patterns in `docs/core/PATTERNS.md`
- [ ] Add security testing guide

---

## 🔀 Git Workflow

**Branch Strategy**: Create feature branches for each major task
- `feat/centralized-error-handling` (AUDIT-1)
- `feat/zod-validation` (AUDIT-2)
- `feat/e2e-test-suite` (AUDIT-3)
- `feat/security-hardening` (AUDIT-4, 5, 6 bundled)

**Merge Strategy**: Merge to `main` as tasks complete, or bundle for single v3.2.0 release

**Recommended Starting Point**: AUDIT-1 (Centralized Error Handling) - provides foundation for other security work

---

## 📦 Release Strategy

**Approach**: Single v3.2.0 release bundle (recommended)

**Why Bundle**:
- Avoid version churn (just released v3.1.0 today)
- Comprehensive testing of all security changes together
- Single cohesive release narrative
- Allows v3.1.1 improvements to ship with security fixes

**Alternative**: Incremental releases (v3.1.2, v3.1.3, etc.) - only if critical issues found

---

## 🗂️ v3.1.1 Work (Rolled into v3.2)

The following improvements were completed on Jan 30, 2026 but not released as v3.1.1. They remain on `main` and will ship with v3.2.0:

### Completed Improvements ✅
- Git repo detection fix (subdirectory support)
- E2E integration tests for auto-tier (16 tests)
- Validation display bug fix (placeholder errors)
- Integration test updates (7 tests)
- GPT-5.1 code review feedback

**Files Changed**:
- `src/utils/git-history.ts`
- `src/commands/validate.ts`
- `src/commands/auto-tier.ts`
- `src/__tests__/integration.test.ts`
- `src/__tests__/auto-tier-e2e.test.ts` (new)

**Test Status**: 174 tests passing, 1 skipped

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

- **v3.1**: [Git-Based Auto-Tiering](docs/archive/sprint-v3.1-jan-2026.md) ✅ Complete (Jan 30, 2026)
- **v3.0**: [AI-Powered Onboarding](docs/archive/sprint-v3.0-boot-1.md) ✅ Complete (Jan 26-27, 2026)
- **v2.9**: [Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅ Complete (Jan 25-26, 2026)
- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) ✅ Complete (Jan 19-23, 2026)
- **v2.6.1**: [Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) ✅
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) ✅
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) ✅
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) ✅
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) ✅

<!-- @cortex-tms-version 3.1.0 -->
