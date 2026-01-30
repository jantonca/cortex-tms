# NEXT: Upcoming Tasks

**Current Sprint**: v3.1 Git-Based Auto-Tiering (Jan 30 - Feb 16)
**Previous Sprint**: [v3.0 AI-Powered Onboarding](docs/archive/sprint-v3.0-jan-2026.md) ✅ Complete
**Last Updated**: 2026-01-30 (Post-GPT-5.1 Code Review)

---

## 🎯 v3.1 Development Focus

**Timeline**: 2-3 weeks
**Status**: 🚧 Active Development
**Theme**: Intelligent Auto-Tiering + Configuration
**Goal**: Reduce manual tier management through git-based automation

### Feature 1: Git-Based Auto-Tiering (P0 - Must Have) ✅ COMPLETE

Automatically suggest HOT/WARM/COLD tier assignments based on git commit history.

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **Design CLI Interface** | Define `cortex auto-tier` command with dry-run support | 2h | 🔴 P0 | ✅ Done |
| **Implement Git History Analysis** | Parse git log to calculate file recency and activity | 4h | 🔴 P0 | ✅ Done |
| **Build Tier Suggestion Engine** | Algorithm to suggest tiers based on thresholds | 3h | 🔴 P0 | ✅ Done |
| **Apply Tier Tags** | Add/update `<!-- @cortex-tms-tier -->` comments in files | 3h | 🔴 P0 | ✅ Done |
| **Edge Case Handling** | Non-git repos, untracked files, submodules | 2h | 🔴 P0 | ✅ Done |
| **Integration Testing** | Test on cortex-tms repo (dogfooding) | 2h | 🔴 P0 | ✅ Done |
| **Documentation** | CLI reference + user guide with examples | 3h | 🔴 P0 | ✅ Done |

**Total Effort**: ~19h (19h complete) ✅ FEATURE COMPLETE

**Completed**: 2026-01-30
**Files Changed**: 9 files, +560 lines
**Tests**: 14/14 passing
**Code Review**: GPT-5.1 feedback incorporated

**Command Signature**:
```bash
cortex auto-tier [options]

Options:
  --hot <days>      Files modified in last N days → HOT (default: 7)
  --warm <days>     Files modified in last N days → WARM (default: 30)
  --cold <days>     Files untouched for N+ days → COLD (default: 90)
  --dry-run         Show what would change without applying
  --force           Overwrite existing tier tags
```

**Acceptance Criteria**:
- [x] `cortex auto-tier --dry-run` shows tier suggestions with reasons
- [x] `cortex auto-tier` applies tier tags to files
- [x] Works on cortex-tms repo itself (dogfooding validation)
- [x] Handles non-git repos gracefully (clear error message)
- [x] Performance: < 2 seconds for 500-file repository
- [x] Respects existing mandatory HOT files (NEXT-TASKS.md, CLAUDE.md)
- [x] Documentation includes usage examples and best practices

**GPT-5.1 Code Review Feedback** (Applied):
- [x] Fixed: `--cold` option now functional (was unused)
- [x] Fixed: Numeric threshold validation (prevents NaN/negative/misordered values)
- [ ] Improve git repo detection for subdirectories (use `git rev-parse --is-inside-work-tree`)
- [ ] Add end-to-end integration test for full command flow
- [ ] Align file selection with token counter patterns / respect .gitignore
- [ ] Centralize tier configuration to avoid duplication

**Algorithm Overview**:
```typescript
// Pseudocode for tier suggestion
for each file in repository:
  days_since_change = (now - git_last_commit_date) / (24 * 60 * 60)

  if days_since_change <= hot_threshold (7 days):
    suggested_tier = 'HOT'
  else if days_since_change <= warm_threshold (30 days):
    suggested_tier = 'WARM'
  else:
    suggested_tier = 'COLD'
```

**Edge Cases**:
- File not in git history (new, untracked) → Suggest HOT (active work)
- Git repo not initialized → Show error with git setup instructions
- Binary files (images, etc.) → Skip (only tier documentation files)
- Submodules → Analyze within submodule context
- Renamed files → Use `git log --follow` to track across renames

---

### Post-Review Hardening Tasks (P0 - Critical for Production)

Address GPT-5.1 code review feedback before v3.1 release.

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **Git Repo Detection Fix** | Use `git rev-parse --is-inside-work-tree` for subdirectory support | 1h | 🔴 P0 | ⏸️ Next |
| **E2E Integration Tests** | Test full command flow with varied git histories | 2h | 🔴 P0 | ⏸️ Next |
| **File Selection Alignment** | Align auto-tier file selection with token counter patterns | 2h | 🟡 P1 | ⏸️ Next |
| **Centralize Tier Config** | Extract tier patterns/mandatory files to shared module | 1h | 🟡 P1 | ⏸️ Next |

**Total Effort**: ~6h (4h critical, 2h nice-to-have)

**Details**:
- **Git detection**: Currently fails from subdirectories; should match git's behavior
- **E2E tests**: Add tests that invoke command with faked commit dates (`GIT_AUTHOR_DATE`)
- **File alignment**: Ensure auto-tier only processes files that token counter uses
- **Config centralization**: Create `src/config/tiers.ts` for shared tier configuration

---

### Feature 2: Configuration File Support (P1 - Nice to Have)

**Deferred to v3.2 if time constrained**

Add `.cortexrc.json` for project-level configuration of auto-tiering thresholds.

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **Define Config Schema** | Structure for `.cortexrc.json` with auto-tier settings | 2h | 🟡 P1 | ⏸️ Deferred |
| **Config Loading** | Merge user config with defaults | 2h | 🟡 P1 | ⏸️ Deferred |
| **Config Validation** | Validate thresholds and patterns | 1h | 🟡 P1 | ⏸️ Deferred |
| **Documentation** | Config reference guide | 1h | 🟡 P1 | ⏸️ Deferred |

**Total Effort**: ~6h (P1 - Ship if time permits)

**Example Config**:
```json
{
  "version": "1.0.0",
  "autoTiering": {
    "thresholds": {
      "hotDays": 14,
      "warmDays": 45,
      "coldDays": 120
    },
    "exclusions": {
      "files": ["CLAUDE.md", "NEXT-TASKS.md"],
      "patterns": ["docs/archive/**"]
    }
  }
}
```

---

## v3.0 Completed Items Reference

All v3.0 sprint details moved to archive. See `docs/archive/sprint-v3.0-jan-2026.md` for:
- Website Performance Optimization [TECH-1]
- AI-Assisted Bootstrap Onboarding [BOOT-1]
- Reusable GitHub Action [GPT5-REC-3]
- Prerelease Version Fix [TMS-272]
- Bootstrap Blog Examples [BOOT-EXP]

---

## 📋 Deferred Items (v3.2+)

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

### Moved to v3.2: Code Quality & Security
- Security hardening tasks (audit findings) deferred to v3.2
- See FUTURE-ENHANCEMENTS.md for full list

### Lower Priority Technical Debt
- Hardcoded Strings / Localization - Premature (no i18n demand)
- Snapshot Tests for CLI Output - Brittle during active development
- Monorepo Separation - Working fine at current scale
- Core Package Extraction - Wait for second consumer
- Cursor-Specific Optimizations - Low priority, IDE-agnostic by design

### Feature Backlog
- Config file support (if not completed in v3.1)
- Guardian GitHub Action & PR Bot (TMS-287)
- Guardian Enhancements (TECH-2) - watch mode, better errors
- Migration Experience (TMS-277-282) - dry-run, better progress
- Custom Templates Architecture (TMS-241)
- MCP Server Integration
- Advanced token analytics

---

## 🗂️ Sprint Archive

- **v3.0**: [AI-Powered Onboarding](docs/archive/sprint-v3.0-jan-2026.md) ✅ Complete (Jan 26-27, 2026)
- **v2.9**: [Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅ Complete (Jan 25-26, 2026)
- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) ✅ Complete (Jan 19-23, 2026)
- **v2.6.1**: [Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) ✅
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) ✅
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) ✅
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) ✅
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) ✅

<!-- @cortex-tms-version 3.0.0 -->
