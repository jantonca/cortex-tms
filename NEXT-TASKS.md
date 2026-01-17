# NEXT: Upcoming Tasks (v2.5 cycle)

## 🎉 v2.4 "Scaling Intelligence" Sprint Complete!

**Achievements**:
- ✅ Migration Auditor with version tracking and customization detection
- ✅ Prompt Engine with Essential 7 library
- ✅ Version metadata infrastructure across all templates
- ✅ Automatic clipboard integration for frictionless AI workflows
- ✅ Project-local prompt customization via PROMPTS.md

**Sprint Closed**: 2026-01-14
**Release**: [v2.4.0](https://github.com/jantonca/cortex-tms/releases/tag/v2.4.0)

---

## ✅ v2.6 Sprint Complete - Integrity & Atomicity

**Archive**: See [sprint-v2.6-integrity-atomicity.md](docs/archive/sprint-v2.6-integrity-atomicity.md) for detailed retrospective (8.5h sprint, 100% completion, 6 major deliverables).

### 🚀 v2.6.0-beta.1 Published (2026-01-16)

**NPM Status**: `latest: 2.5.0` | `beta: 2.6.0-beta.1`
**GitHub**: Pre-releases created for beta.0 and beta.1
**Documentation**: Zero drift, all references verified

---

## 🔄 Active: v2.6.0 Beta Testing & Monitoring

**Status**: 🔄 **IN PROGRESS** (48-hour stability period)

**Theme**: "Stability Sprint" - Transform Cortex TMS from a tool that works into a tool that is resilient.

**Sprint Started**: 2026-01-16 | **Estimated Completion**: 2026-01-18

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Integration Tests** - 23 tests for Atomic Release Engine | [TMS-268a] | 3h | 🔴 HIGH | ✅ Done |
| **Error Message Audit** - Step-by-step recovery instructions | [TMS-268b] | 2h | 🔴 HIGH | ✅ Done |
| **Best Practices Guide** - Pragmatic Rigor documentation | [TMS-268c] | 4h | 🔴 HIGH | ✅ Done |
| **Prerelease Support** - Enhance sync script for beta versions | [TMS-268d] | 1h | 🔴 HIGH | ✅ Done |
| **Beta Publication** - Publish v2.6.0-beta.0 to NPM | [TMS-268e] | 30min | 🔴 HIGH | ✅ Done |
| **Repository URL Fix** - Correct package.json metadata | [TMS-268f] | 30min | 🔴 HIGH | ✅ Done |
| **Documentation Audit** - Verify BEST-PRACTICES.md links | [TMS-268g] | 30min | 🟡 MED | ✅ Done |
| **48-Hour Monitoring** - NPM downloads, GitHub issues, tests | [TMS-268h] | 48h | 🔴 HIGH | 🔄 In Progress |

**Total Effort**: 11.5 hours + 48h monitoring | **Completed**: 11.5h (100% implementation)

### 🎯 Stability Sprint Achievements

**TMS-268a (Integration Tests)** - ✅ Complete (3h)
- 23 integration tests for Atomic Release Engine
- Test coverage: happy path, pre-flight validation, rollback, failure scenarios
- All 53 tests passing (0 regressions)
- Validates Safe-Fail Promise guarantees

**TMS-268b (Error Message Audit)** - ✅ Complete (2h)
- Improved 15+ error messages with recovery instructions
- Rollback tracking shows only relevant recovery steps
- Dynamic error context (branch names, file paths, backup locations)
- Eliminated support ticket scenarios

**TMS-268c (Best Practices Guide)** - ✅ Complete (4h)
- 733-line comprehensive guide (`docs/guides/BEST-PRACTICES.md`)
- Documented "Pragmatic Rigor" framework
- Case studies: Git Guardian, Emergency Hotfix Path
- Defensive programming patterns and anti-patterns

**TMS-268d (Prerelease Support)** - ✅ Complete (1h)
- Enhanced sync-project.js with prerelease regex support
- Supports `-beta.X`, `-alpha.X`, `-rc.X` formats
- Updated 6 regex patterns for version matching
- Validated with dry-run (32 files synced correctly)

**TMS-268e (Beta Publication)** - ✅ Complete (30min)
- Published v2.6.0-beta.0 to NPM with `beta` dist-tag
- Tested Todo App migration (12/12 files preserved - defensive governance works!)
- Created GitHub Pre-release for discoverability
- Verified platform alignment (NPM, Git, GitHub)

**TMS-268f (Repository URL Fix)** - ✅ Complete (30min)
- Corrected package.json URLs: `cortex-tms/cortex-tms` → `jantonca/cortex-tms`
- Fixed NPM package page 404 errors
- Bumped to v2.6.0-beta.1 (patch release)
- Published with updated metadata

**TMS-268g (Documentation Audit)** - ✅ Complete (30min)
- Verified all file references in BEST-PRACTICES.md
- Corrected line counts: git-guardian.js (309→308), release-hotfix.js (299→298)
- Updated version footer to 2.6.0-beta.1
- All internal anchor links validated

**TMS-268h (48-Hour Monitoring)** - 🔄 In Progress
- Monitor NPM download metrics for beta adoption
- Watch GitHub issues for bug reports
- Verify 53/53 tests remain passing
- Gather community feedback

### 📋 Next Steps: v2.6.0 Stable Release (After Monitoring Completes)

**Target Date**: 2026-01-18 (after 48-hour monitoring period)
**Detailed Plan**: See `/temp/technical/planning/PLAN-v2.6-stable-release.md` for step-by-step execution

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Pre-flight Validation** - Verify tests + validation passing | [TMS-269a] | 30min | 🔴 HIGH | ⬜ Todo |
| **Archive v2.6 Sprint** - Add final retrospective to archive | [TMS-269b] | 1h | 🔴 HIGH | ⬜ Todo |
| **Update NEXT-TASKS** - Prepare v2.7 planning slate | [TMS-269c] | 30min | 🔴 HIGH | ⬜ Todo |
| **Run Release Engine** - Execute v2.6.0 stable via Atomic Engine | [TMS-269d] | 1h | 🔴 HIGH | ⬜ Todo |
| **Post-release Verification** - Verify NPM, GitHub, tests | [TMS-269e] | 30min | 🔴 HIGH | ⬜ Todo |
| **Announcement** - Update README badge, post release notes | [TMS-269f] | 30min | 🟡 MED | ⬜ Todo |

**Total Effort**: 4 hours

**Release Strategy** (Recommended):
- **Option B**: Fresh v2.6.0 release via `pnpm run release --version 2.6.0`
- **Why**: Exercises Atomic Release Engine (dogfooding), clean version number, proper GitHub release

**Go/No-Go Criteria**:
- ✅ 48-hour monitoring complete (Jan 18)
- ✅ All 53 tests passing
- ✅ No critical bugs reported
- ✅ Strict validation passing
- ✅ Clean git working tree

**Future** (v2.7 Planning):
- Custom Templates architecture (TMS-241) - deferred from v2.6
- Design migration logic for custom template sources
- Additional enhancements in `FUTURE-ENHANCEMENTS.md`

---

## ✅ v2.5 Sprint Complete (2026-01-15)

**Major Achievements**:
- ✅ Zero-Drift Governance Suite (automated version management)
- ✅ Safe-Fail Migration Engine (backup → apply → rollback)
- ✅ Interactive Tutorial (onboarding walkthrough)
- ✅ 7 high-priority tasks completed across 2 days

**Theme Complete**: "Guidance & Growth" - Both guidance (tutorial) and growth (migration) infrastructure delivered.

**Archive**: See `docs/archive/sprint-v2.5-guidance-growth.md` for detailed retrospective (will be updated with tutorial milestone).

---

## 🗂️ Sprint Archive Links

- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) - Atomic Release Engine, Git Guardian, Emergency Hotfix Path
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) - Zero-Drift Governance, Safe-Fail Migration Engine
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) - Migration Auditor, Prompt Engine, Version Infrastructure
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) - Status Dashboard, Snippets, Self-Healing
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) - CI/CD, Custom Init, Branch Hygiene
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) - CLI Launch, Validation Engine, Template System

<!-- @cortex-tms-version 2.6.0-beta.1 -->
