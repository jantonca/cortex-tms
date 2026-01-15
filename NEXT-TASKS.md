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

## Active Sprint: v2.6 - Integrity & Atomicity

**Status**: In Progress (2/6 tasks complete)

**Theme**: "Workflow Hardening" - Moving from manual discipline to automated integrity through atomic operations and intelligent guardrails.

**Sprint Started**: 2026-01-16

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Sync Engine Expansion** - Glob-based scanner for all tagged files | [TMS-265a] | 1h | 🔴 HIGH | ✅ Done |
| **Integrity Verification** - Comprehensive validation and documentation | [TMS-265b] | 30min | 🔴 HIGH | 🔵 Active |
| **Example App Integrity** - Add version tags & update stale content | [TMS-267] | 30min | 🔴 HIGH | ⬜ Todo |
| **Atomic Release Engine** - Single-command release with rollback | [TMS-264] | 4h | 🔴 HIGH | ⬜ Todo |
| **Git Guardian + Husky** - Pre-commit hooks with safety valve | [TMS-260] | 1.5h | 🔴 HIGH | ⬜ Todo |
| **Emergency Hotfix Path** - `pnpm run release:hotfix` command | [TMS-266] | 1h | 🟡 MED | ⬜ Todo |

**Total Effort**: 8.5 hours | **Completed**: 1.5h | **Remaining**: 7h

### 🎯 Achievements So Far

**TMS-265a (Sync Engine Expansion)** - ✅ Complete
- Implemented glob-based file discovery system
- Expanded coverage from 3 to 29 files (860% increase)
- Synchronized 26 files from v2.3.0/v2.4.1 → v2.5.0
- Added `glob@11.0.0` dependency
- All validation passing: `docs:check`, `migrate`, `validate --strict`

**TMS-265b (Integrity Verification)** - 🔵 In Progress
- Comprehensive validation suite complete
- Documentation of v2.6 roadmap in progress

### 📋 Next Steps

1. Complete TMS-265b documentation
2. Address Example App version tags (TMS-267)
3. Build Atomic Release Engine with backup/rollback (TMS-264)
4. Implement Git Guardian with emergency path (TMS-260, TMS-266)

### ✅ Validation Results (TMS-265b)

**Comprehensive Health Check** - All systems passing

```bash
# 1. Version Sync Check
$ pnpm run docs:check
✅ All 29 files synchronized with v2.5.0

# 2. Migration Health
$ cortex-tms migrate
✅ 9 files up-to-date
✅ 0 files outdated
⚠️  1 file customized (copilot-instructions.md - expected)

# 3. Project Validation
$ cortex-tms validate --strict
✅ All 11 checks passed
✅ Mandatory files present
✅ Configuration valid
✅ Archive status healthy

# 4. Example App Status
✅ 4 markdown files detected
⚠️  0 version tags (TMS-267 pending)
```

**Integrity Status**: 100% synchronized | 0 drift detected | Production ready

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

- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) - Zero-Drift Governance, Safe-Fail Migration Engine
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) - Migration Auditor, Prompt Engine, Version Infrastructure
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) - Status Dashboard, Snippets, Self-Healing
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) - CI/CD, Custom Init, Branch Hygiene
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) - CLI Launch, Validation Engine, Template System

<!-- @cortex-tms-version 2.5.0 -->
