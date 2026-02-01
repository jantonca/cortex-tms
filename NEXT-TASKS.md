# NEXT: Upcoming Tasks

**Current Sprint**: v3.2.1 Claim Audit - UX Consolidation Phase (Feb 2-5, 2026)
**Previous Sprint**: [v3.2 Security & Code Quality](docs/archive/sprint-v3.2-jan-2026.md) ✅ Complete
**Last Updated**: 2026-02-02 (Starting Ultra-Conservative MVP - Claim Audit First)

---

## 🎯 v3.2.1 Sprint: Claim Audit (Ultra-Conservative MVP - Week 1)

**Timeline**: Feb 2-5, 2026 (4h total effort)
**Status**: 🔄 In Progress - Starting Claim Audit
**Theme**: Build Trust Through Honesty
**Driver**: GPT-5.1 audit feedback + consolidation phase after v3.2.0 security work
**Target**: Remove all unverified claims, establish honest baseline

### Sprint Overview

**Context**: After v3.2.0 security hardening, we're entering UX consolidation phase with Ultra-Conservative MVP approach (10h over 3 weeks). This sprint is Week 1: Claim Audit only.

**Why Claim Audit First**:
- Remove unverified quantitative claims from README (e.g., "10x cheaper", "3-5x faster", "94% reduction")
- Add transparent measurement note with proper caveats
- Build user trust before making UX improvements
- Separate model pricing claims from TMS benefit claims
- Set honest baseline for future benchmarking work

**Strategy**: REMOVE claims, don't REPLACE them. No new quantitative claims until Phase 3 benchmarks exist.

### Active Tasks (Week 1 - Claim Audit)

#### 🔄 CLAIM-AUDIT-1: Remove Unverified Quantitative Claims (4h)

**Status**: 🔄 In Progress
**Assignee**: Claude Sonnet 4.5
**Started**: 2026-02-02
**File**: README.md
**Branch**: `docs/claim-audit-v3.2.1`

**Tasks**:
- [ ] **Step 1**: Identify all quantitative claims in README.md (30 min)
  - List every claim with numbers ("X% reduction", "Xx faster", "saves $X")
  - Mark as VERIFIED (have data) or UNVERIFIED (no data yet)

- [ ] **Step 2**: Remove unverified claims (1.5h)
  - Remove: "10x cheaper" (model comparison, not TMS benefit)
  - Remove: "3-5x faster" (no benchmarks exist)
  - Remove: "94% reduction" (unrealistic scenario with archives)
  - Remove: "prevents hallucinations" (conflates pattern violations with hallucinations)
  - Soften: "eliminates drift" → "helps prevent drift"

- [ ] **Step 3**: Add transparent measurement note (1h)
  - Add section explaining early internal measurements (~47 sessions)
  - Add caveat: "Building public benchmark suite to validate rigorously"
  - Link to existing measurement blog post
  - Explain what we CAN claim vs what we're validating

- [ ] **Step 4**: Review & external validation (1h)
  - Read revised README start to finish
  - Check tone: Honest? Humble? Confident without overclaiming?
  - External review (2-3 people): "Does this feel trustworthy?"
  - Fix any remaining absolute claims

- [ ] **Step 5**: Commit & prepare for v3.2.1 release (15 min)
  - Git commit with conventional format
  - Co-authorship credit
  - Ready to merge after v3.2.0 ships

**Acceptance Criteria**:
- [ ] No unverified quantitative claims remain in README
- [ ] Qualitative value clearly stated (what TMS DOES, not what it SAVES)
- [ ] Transparent measurement note added with proper caveats
- [ ] External reviewer confirms: "Feels honest and trustworthy"
- [ ] Committed to branch, ready for v3.2.1

**Why This Matters**: GPT-5.1 audit identified future-as-current blurring (e.g., "427 projects verified" was mock data). This sprint removes all such claims and establishes honest baseline.

---

## 📋 Next Sprints (Tentative - Gated on Results)

### v3.3.0: Phase 1 MVP - Onboarding Fixes (Week 2-3)
**Timeline**: TBD (6h estimated)
**Status**: ⏸️ Planned - Starts after v3.2.1 complete
**Tasks**:
- Task 1.1: Next steps after init (2h)
- Task 1.2: START-HERE.md guide (2h)
- Task 1.5: Token savings in default status (2h)

**Gated On**: v3.2.1 completion + user feedback

### v3.3.1+: TBD Based on Week 4 Measurement
**Timeline**: TBD
**Status**: ⏸️ Backlog - Decide after measuring Phase 1 MVP impact
**Options**:
- More onboarding improvements (if users still confused)
- Migration tooling (if existing project users request it)
- Benchmarks (if trust/credibility is main concern)

---

## 🗂️ Sprint Archive

- **v3.2**: [Security & Code Quality](docs/archive/sprint-v3.2-jan-2026.md) ✅ Complete (Ready for v3.2.0 release)
- **v3.1**: [Git-Based Auto-Tiering](docs/archive/sprint-v3.1-jan-2026.md) ✅ Complete

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
**Status**: ✅ Ready for Release - All pre-release tasks complete (100% test pass rate)
**See**: [Detailed Plan](docs/tasks/v3.2-polish-docs.md) | [Sprint Archive](docs/archive/sprint-v3.2-jan-2026.md) | [CHANGELOG.md](CHANGELOG.md)

---

## ✅ Completed Pre-Release Tasks (v3.2.0)

### POLISH-1: Fix Remaining E2E Test Failures ✅ Complete

**Status**: ✅ **100% pass rate** (314/315 tests passing, 1 skipped)
**Completed**: 2026-02-01

**What Was Fixed**:
- Fixed 7 E2E test assertion failures (1 in integration.test.ts, 6 in review-e2e.test.ts)
- Root cause: Chained `expect()` assertions with `||` operator don't work as intended
- Solution: Convert to boolean checks before assertions, add fake API keys to reach validation

**Note**: The 4 migrate-e2e.test.ts failures mentioned in original plan were already fixed

**Commits**:
- `f06c4f1` - fix(tests): fix all 7 E2E test assertion failures (POLISH-1)
- `f612a54` - fix(blog): limit grid to 2 columns by removing glass-grid class

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
