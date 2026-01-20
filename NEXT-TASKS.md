# NEXT: Upcoming Tasks (v2.7 AI Governance Platform)

**Current Sprint**: v2.7 (Jan 19 - Feb 15, 2026)
**Focus**: Guardian MVP, distribution, community validation
**Previous Sprint**: [v2.6 Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅ Complete

---

## 🚀 Active Work: v2.7 Guardian MVP

### Phase 1: Foundation ✅ COMPLETE

**TMS-270f**: Professional Documentation (36 pages) → https://cortex-tms.org/

---

### Phase 2: Guardian MVP ✅ COMPLETE

See [v2.7 Archive](docs/archive/sprint-v2.7-jan-2026.md) for completed tasks (TMS-283a through TMS-283f).

**All 6 core features delivered**: CLI core, pattern detection, domain logic checker, output formatting, BYOK, documentation.

---

### Phase 3: Distribution & Content 🟡 IN PROGRESS

See [v2.7 Archive](docs/archive/sprint-v2.7-jan-2026.md) for 8 completed tasks.

**Remaining**:

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Blog Post: Tiered Memory** - "Why AI Agents Need More Than a README" | [TMS-284d] | 3h | 🟡 MED | ⬜ Todo |

**Blog Post Requirements**:
- Explain multi-tier memory architecture (NEXT-TASKS.md, PATTERNS.md, ADRs)
- Why README-only approaches fail for complex projects
- Real examples from Cortex TMS development
- Link to use cases and Guardian integration

---

### Phase 4: GitHub Enhancement 🟡 IN PROGRESS

See [v2.7 Archive](docs/archive/sprint-v2.7-jan-2026.md) for 2 completed tasks.

**Remaining**:

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Social Preview Image** - Custom OG image | [TMS-285d] | 2h | 🟡 MED | ⬜ Todo |

---

### Phase 5: Community Launch (Week 3)

**Goal**: Validate Guardian with open source community

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Reddit Post** - r/opensource Guardian announcement | [TMS-286a] | 2h | 🔴 HIGH | ⬜ Todo |
| **X (Twitter) Thread** - Build-in-public launch | [TMS-286b] | 1h | 🟡 MED | ⬜ Todo |
| **CONTRIBUTING.md Update** - Add Guardian v2.8 roadmap | [TMS-286c] | 1h | 🟡 MED | ⬜ Todo |

**Reddit Strategy**: Link tldraw issue #7695, demo Guardian CLI, ask for feedback
**X Hook**: "Built a solution to the 'AI PR Tsunami' problem 🧵"

**Total Effort**: ~4 hours

---

## 📊 v2.7 Sprint Summary

**Completed**: ~39 hours (28h Guardian/Blog + 10h Design + 1h fixes)
**Remaining**: ~9 hours (Blog post, OG image, Community launch)
**Completion Rate**: 81% of sprint complete

**Success Metrics**:
- ✅ Guardian MVP functional with 70%+ accuracy
- ⬜ 100+ GitHub stars
- ⬜ 5+ community beta testers
- ⬜ 1,000+ blog post views
- ✅ Positioned as most transparent AI-assisted project

---

## 📋 Deferred Items (v2.8+)

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
