# NEXT: Upcoming Tasks

**Current Sprint**: v3.1.1 Auto-Tier Hardening (Jan 30 - Feb 2)
**Previous Sprint**: [v3.1 Git-Based Auto-Tiering](docs/archive/sprint-v3.1-jan-2026.md) ✅ Complete
**Last Updated**: 2026-01-30 (Post v3.1.0 Release)

---

## 🎯 v3.1.1 Patch Release Status

**Timeline**: Jan 30, 2026 (1 day)
**Status**: ✅ COMPLETE - Ready for Release Decision
**Theme**: Auto-Tier Production Hardening + Critical Bug Fixes
**Completed**: 2026-01-30

### Critical Hardening Tasks (P0) ✅ COMPLETE

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **Git Repo Detection Fix** | Use `git rev-parse --is-inside-work-tree` for subdirectory support | 1h | 🔴 P0 | ✅ Done |
| **E2E Integration Tests** | Test full command flow with varied git histories | 2h | 🔴 P0 | ✅ Done |

**Total Effort**: 3h (actual)

### Bonus Work Completed ✅

| Task | Description | Effort | Status |
| :--- | :---------- | :----- | :----- |
| **Validation Display Bug Fix** | Fix placeholder errors not showing in output | 1h | ✅ Done |
| **Integration Test Updates** | Update 7 tests to expect correct placeholder behavior | 1h | ✅ Done |
| **GPT-5.1 Feedback** | CLI help text clarification + threshold test | 30m | ✅ Done |

**Total Session Effort**: ~5.5h

### Acceptance Criteria (All Met) ✅

- [x] Auto-tier works when run from any subdirectory within git repo
- [x] E2E tests cover complete command workflow (16 tests)
- [x] All existing tests continue to pass (174 tests passing)
- [x] Validation errors now properly displayed
- [x] Integration tests reflect correct product behavior
- [x] GPT-5.1 code review feedback addressed

### Files Changed

**Modified** (6 files):
- `src/utils/git-history.ts` - Git detection fix
- `src/commands/validate.ts` - Display bug + help text
- `src/commands/auto-tier.ts` - Help text clarification
- `src/__tests__/integration.test.ts` - 7 test updates
- `NEXT-TASKS.md` - This file
- `docs/archive/sprint-v3.1-jan-2026.md` - Sprint archive

**Added** (1 file):
- `src/__tests__/auto-tier-e2e.test.ts` - 16 E2E tests (475 lines)

### Test Results ✅

```
✓ 174 tests passing | 1 skipped
✓ Auto-tier: 30 tests (14 unit + 16 E2E)
✓ Integration: 15 tests (all passing)
✓ Build: successful
✓ Duration: ~9.8s
```

---

## 📋 Release Decision

**v3.1.1 is complete but NOT yet published to npm.**

**Options:**

1. **Publish v3.1.1 now** - Quick patch release
   - Just released v3.1.0 3 hours ago (might be too soon)
   - Changes are quality improvements, not urgent fixes
   - No user-reported issues requiring immediate patch

2. **Wait and bundle with more changes**
   - Complete P1 tasks below (~3h more work)
   - Or wait for user feedback/issues
   - Publish later as more substantial v3.1.1

3. **Skip v3.1.1, roll into v3.2**
   - Move to v3.2 planning immediately
   - Include these fixes in next feature release
   - Avoid version number churn

**Recommendation**: Option 2 or 3 (wait or skip)

---

## 🎯 Next Steps (If Continuing v3.1.1)

### Nice-to-Have Tasks (P1 - Optional Polish)

These tasks improve code quality but are not blocking for v3.1.1 release.

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **File Selection Alignment** | Align auto-tier file selection with token counter patterns | 2h | 🟡 P1 | ⏸️ v3.2 |
| **Centralize Tier Config** | Extract tier patterns/mandatory files to shared module | 1h | 🟡 P1 | ⏸️ v3.2 |

**Rationale for Deferral**: These are code quality improvements, not user-facing bugs. Ship P0 fixes quickly, then address P1 in v3.2.

---

## 📋 Deferred Items (v3.2+)

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

### v3.2 Planning Options

**Option A: Auto-Tier Polish & Performance** (9-12h)
- Batched git log for large repos
- Parallel file processing
- Respect .gitignore
- Better error messages
- File selection alignment (from v3.1.1 P1)
- Centralize tier config (from v3.1.1 P1)

**Option B: Code Quality & Security** (13-17h)
- Centralize error handling (remove `process.exit()` calls)
- Add Zod input validation
- Add integration/E2E tests
- File path traversal protection
- Guardian API key redaction
- npm audit CI integration

**Decision Point**: Choose after v3.1.1 ships.

### Feature Backlog
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

<!-- @cortex-tms-version 3.1.1 -->
