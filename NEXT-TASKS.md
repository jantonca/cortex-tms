# NEXT: Upcoming Tasks

**Current Sprint**: v2.7 Guardian MVP Completion (Jan 22 - Feb 7, 2026)
**Next Sprint**: v2.8 Marketing Pivot & Community Launch (Feb 10-21, 2026)
**Previous Sprint**: [v2.6.1 Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅ Complete

---

## 🎯 v2.7 Guardian MVP Completion (Weeks 2-4)

**Context**: Strategic features identified via external audits (QCS Analysis + Viability Report)

**Timeline**: 2-3 weeks (21-30 hours total)
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

**Output**: Shows HOT/WARM/COLD token counts with % reduction and cost estimates

**Files**: `src/utils/token-counter.ts`, `src/commands/status.ts --tokens flag`

### HIGH-2: Guardian Accuracy Validation

**Why**: Move from "structural" to "semantic" quality enforcement

**Work**: Create test set (20-30 examples), measure accuracy, tune prompt if < 70%

**Files**: `src/__tests__/guardian-accuracy.test.ts`, `src/utils/llm-client.ts`

---

### Phase 5: Website Enhancement (Deferred)

**Decision**: Defer until after v2.7 strategic features are complete

| Task | Ref | Status |
| :--- | :--- | :------ |
| Social Preview Image | [TMS-285d] | ⏸️ Deferred |
| Blog Category Pages | [TMS-293] | ⏸️ Deferred |

**Rationale**: Strategic features take priority over cosmetic improvements

---

## 🎯 v2.8 Marketing Pivot & Community Launch (Weeks 5-6)

**Context**: "Green Governance" positioning based on QCS Analysis + token counter proof

**Timeline**: 2-3 weeks (18-25 hours total)
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

### v2.7 Guardian Completion

**Timeline**: Jan 22 - Feb 7, 2026 (2-3 weeks)
**Effort**: 21-30 hours
**Status**: ⬜ Not Started
**Blockers**: None - Ready to begin

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

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

- Guardian GitHub Action & PR Bot (TMS-287)
- Migration Experience Improvements (TMS-277-282)
- Custom Templates Architecture (TMS-241)
- MCP Server Integration

---

## 🗂️ Sprint Archive

- **v2.6.1**: [Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅
- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) (In Progress - 81% complete)
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) ✅
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) ✅
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) ✅
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) ✅
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) ✅

<!-- @cortex-tms-version 2.6.1 -->
