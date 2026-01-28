# NEXT: Upcoming Tasks

**Current Sprint**: v3.1 Planning (Jan 28 - TBD)
**Previous Sprint**: [v3.0 AI-Powered Onboarding](docs/archive/sprint-v3.0-jan-2026.md) ✅ Complete
**Last Updated**: 2026-01-27 (v3.0 Release Preparation)

---

## 🎯 v3.0 Development Focus

**Timeline**: 3 weeks
**Status**: 🚧 Planning

### Technical Improvements

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Website Performance Optimization** | [TECH-1] | 4-6h | 🔴 HIGH | ✅ Complete |
| **Guardian Enhancements** | [TECH-2] | 3-4h | 🔴 HIGH | ⏸️ Planned |
| **Migration Experience Improvements** | [TMS-277-282] | 4-5h | 🔴 HIGH | ⏸️ Planned |
| **Reusable GitHub Action** | [GPT5-REC-3] | 3-4h | 🔴 HIGH | ✅ Complete |
| **Prerelease Version Fix** | [TMS-272] | 2-3h | 🟡 MED | ✅ Complete |
| **Bootstrap Blog Examples** | [BOOT-EXP] | 45m | 🔴 HIGH | ✅ Complete |
| **AI-Assisted Bootstrap Onboarding** | [BOOT-1] | 14h | 🔴 HIGH | ✅ Complete |
| **Version Release (v3.0.0)** | [REL-1] | 1-2h | 🟢 LOW | ⏸️ Deferred |

### Website Performance Optimization [TECH-1]

**Status**: ✅ Complete (2026-01-27)
**Merged**: Branch `perf/TECH-1-website-optimization`
**Effort**: 4h (actual)

**What Shipped**:
- Removed unused CSS components (profile-card, news-card → _future-components.css)
- Extracted 20+ inline styles from homepage → homepage.css
- Removed dead code (Font Awesome CDN, GlassQuote.astro)
- All builds passing, no visual regressions

**Impact**:
- -2KB CSS bundle size (news/profile cards removed from main bundle)
- -26 lines net reduction (234 deletions, 208 additions)
- Better maintainability (semantic class names)
- Cleaner HTML structure

**See**: `tmp/WEBSITE-OPTIMIZATION-TASKS.md` for original plan

### AI-Assisted Bootstrap Onboarding [BOOT-1]

**Status**: ✅ Complete (13/13 tasks, 14h actual)
**Merged**: 2026-01-27 (commit 10674f4)
**Result**: ⭐⭐⭐⭐⭐ Zero-cost onboarding, 3-4x faster than manual

**What shipped**:
- 4 new bootstrap prompts (bootstrap, populate-architecture, discover-patterns, extract-rules)
- Three-tier validation (Incomplete → Draft → Reviewed)
- Enhanced templates with first-session awareness
- Blog article: "From Zero Docs to AI-Ready in 10 Minutes"
- Comprehensive tests (141/141 passing)

**See**: `docs/archive/sprint-v3.0-boot-1.md` for full details

### Bootstrap Blog Examples [BOOT-EXP]

**Goal**: Add real AI-generated content examples to bootstrap blog article

**Status**: ✅ Complete

**What shipped**:
- Added full AI-generated ARCHITECTURE.md example (Component Map, Data Flow, Quick Context)
- Updated accuracy breakdown (90% correct, 10% needs refinement)
- Added concrete "Before/After" refinement example
- Demonstrated what "good enough to keep" means with real code snippets

**Effort**: 45 min (actual)
**Source**: Implementation feedback 4.3

### Reusable GitHub Action [GPT5-REC-3]

**Status**: ✅ Complete (2026-01-27)
**Merged**: Branch `feat/GPT5-REC-3-reusable-action`
**Effort**: 3h (actual)

**What Shipped**:
- Created `.github/workflows/validate-reusable.yml` with `workflow_call` trigger
- 5 customizable inputs (strict, scope, ignore-files, cortex-version, node-version)
- Automatic Cortex TMS installation (no local dependencies needed)
- Validation summary in GitHub Actions UI
- Comprehensive documentation in README and website

**Impact**:
- Zero-friction adoption (teams can validate without installing CLI)
- Enables CI validation for external projects
- High leverage feature (GPT5 recommendation)

**Usage**:
```yaml
jobs:
  validate:
    uses: cortex-tms/cortex-tms/.github/workflows/validate-reusable.yml@main
```

**Implementation**:
```yaml
- uses: cortex-tms/validate-action@v1
  with:
    strict: true
```

**Effort**: 3-4h
**Priority**: 🔴 HIGH (easy packaging, high value)
**Source**: External GPT-5 repository analysis (Jan 24, 2026)

### Prerelease Version Fix [TMS-272]

**Status**: ✅ Complete (2026-01-27)
**Merged**: Branch `fix/TMS-272-prerelease-version`
**Effort**: 2h (actual)

**What Shipped**:
- Added `stable` bump type to promote prerelease → stable (e.g., `2.6.0-beta.1` → `2.6.0`)
- Added `--version X.Y.Z` flag to explicitly set release version
- Updated help documentation with new options
- Added 11 new tests (28 total passing)
- Note: `parseVersion()` method already handled prerelease parsing correctly

**Impact**:
- Eliminates manual workaround for prerelease releases
- Professional release workflow for all version types
- Flexible version management with explicit version flag

**Usage**:
```bash
# Promote prerelease to stable
node scripts/release.js stable  # 2.6.0-beta.1 → 2.6.0

# Explicitly set version
node scripts/release.js --version 2.7.0

# Preview changes
node scripts/release.js stable --dry-run
```

**See**: FUTURE-ENHANCEMENTS.md (marked as resolved)

### Guardian Enhancements [TECH-2]

**Goal**: Improve Guardian reliability and usability

**Ideas**:
- Add `--watch` mode for continuous validation
- Improve confidence score accuracy
- Add custom confidence threshold flag
- Better error messages for common violations

**Status**: To be planned

### Migration Experience [TMS-277-282]

**Goal**: Smoother migration process for new users

**Tasks**:
- Improve error messages in `cortex migrate`
- Add dry-run mode
- Better progress indicators
- Migration validation checks

**Status**: To be planned

---

## 📋 Deferred Items (v3.1+)

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

- Guardian GitHub Action & PR Bot (TMS-287)
- Custom Templates Architecture (TMS-241)
- MCP Server Integration
- Advanced token analytics

---

## 🗂️ Sprint Archive

- **v2.9**: [Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅ Complete (Jan 25-26, 2026)
- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) ✅ Complete (Jan 19-23, 2026)
- **v2.6.1**: [Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) ✅
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) ✅
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) ✅
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) ✅
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) ✅

<!-- @cortex-tms-version 2.6.1 -->
