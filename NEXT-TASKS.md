# NEXT: Upcoming Tasks

**URGENT**: Critical bug fixes identified via external audits (4 reports analyzed 2026-01-21)
**Current Sprint**: v2.6.1 Emergency Patch (Jan 21-24, 2026)
**Next Sprint**: v2.7 Guardian MVP Completion (Jan 27 - Feb 15, 2026)
**Previous Sprint**: [v2.6 Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅ Complete

**📋 Full Plan**: See [Audit Remediation Plan](docs/AUDIT-REMEDIATION-PLAN.md) for complete strategy

---

## 🚨 CRITICAL: v2.6.1 Emergency Patch (Week 1-2)

**Context**: Four independent audits found trust-breaking bugs that prevent safe public adoption. These must be fixed ASAP before any marketing or community launch.

**Timeline**: 1-2 days focused work (8-12 hours total)
**Release Target**: January 24, 2026

### Critical Bug Fixes

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Scope-Aware Validation** - Nano init fails validate | [CRITICAL-1] | 2-3h | 🔴 BLOCKER | ⬜ Todo |
| **Migration Path Handling** - Nested files break | [CRITICAL-2] | 4-6h | 🔴 BLOCKER | ⬜ Todo |
| **Prerelease Version Parsing** - Beta versions break migrate | [CRITICAL-3] | 2-3h | 🔴 BLOCKER | ⬜ Todo |
| **Integration Test Suite** - Test scope/validate/migrate flows | [TEST-1] | 4-6h | 🔴 HIGH | ⬜ Todo |

**Total Effort**: 12-18 hours

### CRITICAL-1: Scope-Aware Validation

**Problem**: `npx cortex-tms init --scope nano` → `cortex-tms validate` → **FAILS**

**Root Cause**:
```typescript
// Nano scope copies 2 files:
SCOPE_FILES.nano = ['NEXT-TASKS.md', 'CLAUDE.md']

// Validation requires 3 files:
MANDATORY_FILES = ['NEXT-TASKS.md', '.github/copilot-instructions.md', 'CLAUDE.md']
```

**Solution**: Make validation scope-aware
```typescript
// src/utils/validator.ts
const getMandatoryFilesForScope = (scope: string): string[] => {
  const base = ['NEXT-TASKS.md', 'CLAUDE.md'];
  if (scope === 'nano') return base;
  return [...base, '.github/copilot-instructions.md'];
};
```

**Files to modify**:
- `src/utils/validator.ts` - Add scope-aware mandatory files logic
- `src/utils/config.ts` - Ensure scope is persisted in .cortexrc
- `src/__tests__/validate.test.ts` - Add nano scope test

### CRITICAL-2: Migration Path Handling

**Problem**: `docs/core/PATTERNS.md` migration breaks due to basename-only matching

**Root Cause**:
```typescript
// src/commands/migrate.ts
const fileName = filePath.split('/').pop(); // ❌ Loses path info
// Looks for templates/<basename> instead of templates/<relative-path>
```

**Solution**: Preserve relative paths
```typescript
const getTemplatePath = (projectFilePath: string, templatesDir: string): string => {
  const relativePath = path.relative(cwd, projectFilePath);
  return path.join(templatesDir, relativePath);
};
```

**Additional**: Apply placeholder substitution during upgrades

**Files to modify**:
- `src/commands/migrate.ts` - Fix path resolution logic
- `src/utils/templates.ts` - Add placeholder substitution to applyUpgrade
- `src/__tests__/migrate.test.ts` - Add nested path tests

### CRITICAL-3: Prerelease Version Parsing

**Problem**: `2.6.0-beta.1` versions break extractVersion regex

**Root Cause**:
```typescript
// Only matches digits and dots
const versionMatch = content.match(/[\d.]+/);
```

**Solution**: Support semver prerelease tags
```typescript
const versionMatch = content.match(/(\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?)/);
```

**Files to modify**:
- `src/utils/templates.ts` - Update extractVersion regex
- `scripts/release.js` - Add prerelease parsing support
- `src/__tests__/release.test.ts` - Add prerelease version tests

### v2.6.1 Release Checklist

- [ ] Create branch `fix/audit-critical-bugs`
- [ ] Fix CRITICAL-1 (scope-aware validation)
- [ ] Fix CRITICAL-2 (migration paths)
- [ ] Fix CRITICAL-3 (version parsing)
- [ ] Add integration tests
- [ ] Run full test suite: `npm test`
- [ ] Self-validation: `node bin/cortex-tms.js validate --strict`
- [ ] Smoke test: `init --scope nano` → `validate` → PASS
- [ ] Smoke test: Migrate from v2.5 → v2.6.1
- [ ] Update CHANGELOG.md
- [ ] Bump version to 2.6.1
- [ ] Sync version tags: `node scripts/sync-project.js`
- [ ] Create git tag: `git tag v2.6.1`
- [ ] Publish to NPM: `npm publish`
- [ ] Create GitHub release
- [ ] Merge to main
- [ ] Delete feature branch

---

## 🚀 v2.7 Guardian MVP Completion (Week 3-4)

**Context**: After v2.6.1 bugs are fixed, complete Guardian MVP with strategic features from audit recommendations.

**Timeline**: 2-3 weeks (25-36 hours total)
**Release Target**: February 7, 2026

### Previous Phases ✅ COMPLETE

- **Phase 1**: Professional Documentation → https://cortex-tms.org/
- **Phase 2**: Guardian MVP Core (6 features delivered)
- **Phase 3**: Distribution & Content

See [v2.7 Archive](docs/archive/sprint-v2.7-jan-2026.md) for completed tasks.

---

### Phase 4: Strategic Features (Audit-Driven)

**Source**: QCS Analysis + Viability Report recommendations

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Token Counter CLI** - `cortex status --tokens` | [HIGH-1] | 4-6h | 🔴 HIGH | ⬜ Todo |
| **Guardian Accuracy Validation** - 70%+ on test set | [HIGH-2] | 6-8h | 🔴 HIGH | ⬜ Todo |
| **Integration Test Suite** - Command interaction tests | [MED-1] | 8-12h | 🟡 MED | ⬜ Todo |
| **Error Handling Refactor** - Remove process.exit() calls | [MED-3] | 3-4h | 🟡 MED | ⬜ Todo |

**Total Effort**: 21-30 hours

### HIGH-1: Token Counter Feature

**Why**: Makes cost/sustainability value visible (QCS Analysis strongest recommendation)

**Implementation**:
```bash
cortex-tms status --tokens

# Output shows:
# - HOT Context: 2,847 tokens
# - WARM Context: 8,234 tokens
# - COLD Archive: 52,103 tokens
# - Savings: 95.5% context reduction
# - Est. Cost: $0.008/session
```

**Technical Approach**:
1. Use `tiktoken` library (GPT) + `@anthropic-ai/tokenizer` (Claude)
2. Calculate tokens for HOT files
3. Calculate tokens for WARM files
4. Calculate tokens for entire repo
5. Show percentage reduction

**Files to create/modify**:
- `src/utils/token-counter.ts` - Core token counting logic
- `src/commands/status.ts` - Add `--tokens` flag
- `package.json` - Add tokenizer dependencies
- `src/__tests__/token-counter.test.ts` - Unit tests

**Business Value**: Proves ROI, enables marketing claims

### HIGH-2: Guardian Accuracy Validation

**Why**: Move from "structural" to "semantic" quality enforcement (Viability Report requirement)

**Current State**: Guardian CLI exists but needs accuracy validation

**Required Work**:
1. Create labeled violation test set (20-30 examples)
2. Measure Guardian accuracy/precision
3. Tune system prompt if accuracy < 70%
4. Add confidence scores to output
5. Document BYOK privacy model

**Files to create/modify**:
- `src/__tests__/guardian-accuracy.test.ts` - Labeled test set
- `src/utils/llm-client.ts` - Add confidence scoring
- `docs/core/PATTERNS.md` - Document accuracy benchmarks

**Success Criteria**: 70%+ accuracy on test set

---

### Phase 5: Website Enhancement (Deferred)

**Decision**: Defer until after v2.6.1 + strategic features are complete

| Task | Ref | Status |
| :--- | :--- | :------ |
| Social Preview Image | [TMS-285d] | ⏸️ Deferred |
| Blog Category Pages | [TMS-293] | ⏸️ Deferred |

**Rationale**: Critical bugs and strategic features take priority over cosmetic improvements

---

### Phase 6: Community Launch (Deferred to v2.8)

**Decision**: Do NOT launch community campaign until bugs are fixed + token counter is live

| Task | Ref | Status |
| :--- | :--- | :------ |
| Reddit Post | [TMS-286a] | ⏸️ Deferred to v2.8 |
| X (Twitter) Thread | [TMS-286b] | ⏸️ Deferred to v2.8 |
| CONTRIBUTING.md Update | [TMS-286c] | ⏸️ Deferred to v2.8 |

**Rationale**: Don't market until the full story (bugs fixed + features + new positioning) is ready

---

## 🎯 v2.8 Marketing Pivot & Community Launch (Week 5-6)

**Context**: "Green Governance" positioning based on QCS Analysis + token counter proof

**Timeline**: 2-3 weeks (15-22 hours total)
**Release Target**: February 21, 2026

### Marketing Positioning Update

**OLD Positioning**: "Interactive documentation system and CLI tool"
**NEW Positioning**: "AI Governance Platform - Stop wasting tokens. Stop burning GPU cycles on old docs."

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Landing Page Redesign** - "Green Governance" hero | [HIGH-3a] | 4-6h | 🔴 HIGH | ⬜ Todo |
| **Cost Calculator Widget** - Estimate token savings | [HIGH-3b] | 4-6h | 🟡 MED | ⬜ Todo |
| **Sustainability Badge** - "Green AI Development" claims | [HIGH-3c] | 2-3h | 🟡 MED | ⬜ Todo |
| **README.md Update** - New value propositions | [HIGH-3d] | 1-2h | 🔴 HIGH | ⬜ Todo |

**Total Effort**: 11-17 hours

### New Messaging Pillars

1. **Cost Efficiency** (strongest pillar per QCS)
   - "Reduce AI API costs by 40-60%"
   - "Pay less, get more from Claude/Copilot/Cursor"

2. **Quality** (second pillar)
   - "Prevent hallucinations from outdated docs"
   - "Enforce patterns with semantic validation"

3. **Sustainability** (unique differentiator)
   - "Green Governance for AI development"
   - "Less compute = lower carbon footprint"

### Community Launch (After Positioning Update)

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Blog Post: Green AI Development** | [TMS-294] | 3-4h | 🔴 HIGH | ⬜ Todo |
| **Reddit Post** - r/opensource + r/MachineLearning | [TMS-286a] | 2h | 🔴 HIGH | ⬜ Todo |
| **X (Twitter) Thread** - Build-in-public with metrics | [TMS-286b] | 1h | 🟡 MED | ⬜ Todo |
| **HN Launch** - "Show HN: Green Governance for AI Dev" | [TMS-295] | 1h | 🟡 MED | ⬜ Todo |

**Total Effort**: 7-8 hours

**Success Metrics**:
- 100+ GitHub stars (from 50 current)
- 5+ community beta testers
- 1,000+ blog post views
- 3+ external mentions (Reddit, X, HN)

---

## 📊 Sprint Summary & Progress

### v2.6.1 Emergency Patch

**Timeline**: Jan 21-24, 2026 (1-2 days)
**Effort**: 12-18 hours
**Status**: ⬜ Not Started
**Blockers**: None - Ready to begin

### v2.7 Guardian Completion

**Timeline**: Jan 27 - Feb 7, 2026 (2-3 weeks)
**Effort**: 21-30 hours
**Status**: ⏸️ Blocked by v2.6.1
**Dependencies**: Critical bugs must be fixed first

**Previous Completion**:
- ✅ Phase 1: Professional Documentation
- ✅ Phase 2: Guardian MVP Core (6 features)
- ✅ Phase 3: Distribution & Content
- ⬜ Phase 4: Strategic Features (NEW - audit-driven)

### v2.8 Marketing Pivot

**Timeline**: Feb 10-21, 2026 (2-3 weeks)
**Effort**: 18-25 hours
**Status**: ⏸️ Blocked by v2.7
**Dependencies**: Token counter must be live for proof

---

## 📋 Deferred Items (v2.9+)

### Guardian v2.8: GitHub Action

| Task | Ref | Effort | Notes |
| :--- | :--- | :----- | :----- |
| **GitHub Action Wrapper** | [TMS-287a] | 4h | Depends on CLI validation |
| **PR Comment Bot** | [TMS-287b] | 3h | Automated violation comments |
| **Hosted Service** | [TMS-287c] | 8h | Freemium ($0 → $29/mo) |
| **Governance Dashboard** | [TMS-287d] | 8h | Pro feature |

**Total**: ~23 hours | **Monetization**: Enables Pro/Enterprise tiers

---

### Global Install v2.8: Cross-Project Governance

| Task | Ref | Effort | Notes |
| :--- | :--- | :----- | :----- |
| **`cortex list` Command** | [TMS-290c] | 2h | Scan directories for TMS projects |
| **Health Status Integration** | [TMS-290d] | 1h | Show validation status per project |

**Total**: ~3 hours | **Business Value**: Enables Developer License model, enterprise compliance

---

### File Reference Documentation

| Task | Ref | Effort | Notes |
| :--- | :--- | :----- | :----- |
| **Consolidated Reference Page** | [TMS-288] | 3h | CLAUDE.md, NEXT-TASKS.md, PATTERNS.md, .cortexrc |

**Recommendation**: Defer until user requests

---

### Migration Experience Improvements

**Source**: 7 completed migrations analysis

| Task | Ref | Effort | Priority |
| :--- | :--- | :----- | :------- |
| **Architecture Templates** - SSG/SSR/Monorepo presets | [TMS-277] | 8-12h | 🔴 HIGH |
| **Config Version Fix** - Auto-upgrade version mismatch | [TMS-278] | 2-3h | 🟡 MED |
| **Validation Packages** - Reusable rule packs | [TMS-279] | 6-8h | 🟡 MED |
| **Branch Auto-Detection** - main/master from git config | [TMS-281] | 1-2h | 🟢 LOW |
| **Greenfield Template** - Simplified for new projects | [TMS-282] | 3-4h | 🟡 MED |

**Total**: 20-29 hours | **Impact**: 35-50% migration time savings

---

### Development Workflow Improvements

**Source**: Learning from Guardian MVP development (MDX syntax error caught post-commit)

| Task | Ref | Effort | Priority | Trigger Condition |
| :--- | :--- | :----- | :------- | :---------------- |
| **Pre-Commit MDX Build Validation** | [TMS-291] | 1h | 🟢 LOW | Implement if 3+ MDX errors occur in single sprint |
| **Automated Test Runs on Code Changes** | [TMS-292] | 30m | 🟢 LOW | Implement if test failures reach production |

**Deferred Rationale**:
- MDX errors are rare (1 occurrence in 10 commits to date)
- Fast feedback from browser preview works well
- Pre-commit overhead not justified for current frequency

**Review Date**: After v2.7 completion (Feb 2026)

---

### CLI Enhancements (Low Priority)

- Custom Templates architecture (TMS-241) - Pending user demand
- MCP server integration - Pending Anthropic API stability

---

## 🔒 Infrastructure & Security

| Task | Ref | Status |
| :--- | :--- | :------ |
| **Internal Repository Setup** | [TMS-276] | ✅ Done |

**Details**: See internal planning documentation.

---

## 🗂️ Sprint Archive

- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) (In Progress - 81% complete)
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md)
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md)
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md)
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md)
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md)
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md)

<!-- @cortex-tms-version 2.6.0 -->
