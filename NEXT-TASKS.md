# NEXT: Upcoming Tasks

**Current Sprint**: v2.8 Marketing Pivot & Community Launch (Jan 24 - Feb 7, 2026)
**Next Sprint**: v2.9 Guardian Optimization (Feb 10-21, 2026)
**Previous Sprint**: [v2.7 Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) ✅ Complete

---

## 🎯 v2.8 Marketing Pivot & Community Launch

**Context**: "Green Governance" positioning based on QCS Analysis + token counter proof

**Timeline**: 2-3 weeks (18-25 hours total)
**Release Target**: February 7, 2026
**Status**: 🚀 In Progress (Jan 24+)

### Marketing Positioning Update

**OLD Positioning**: "Interactive documentation system and CLI tool"
**NEW Positioning**: "AI Governance Platform - Stop wasting tokens. Stop burning GPU cycles on old docs."

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Landing Page Redesign** - "Green Governance" hero | [HIGH-3a] | 4-6h | 🔴 HIGH | ✅ Done |
| **Cost Calculator Widget** - Estimate token savings | [HIGH-3b] | 4-6h | 🟡 MED | ⏸️ Deferred |
| **Sustainability Badge** - "Green AI Development" claims | [HIGH-3c] | 2-3h | 🟡 MED | ✅ Done |
| **README.md Update** - New value propositions | [HIGH-3d] | 1-2h | 🔴 HIGH | ✅ Done |
| **Measurement Methodology Doc** - Defensible 40-60% claims | [HIGH-3e] | 2-3h | 🔴 HIGH | ✅ Done |
| **Cortex Dogfooding Case Study** - "How Cortex Uses TMS" | [HIGH-3f] | 3-4h | 🔴 HIGH | ✅ Done |

**Note**: Cost Calculator deferred until after Reddit/X feedback - will inform which metrics to display (tokens, cost, compute % only - no carbon claims).
**External Review**: GPT-5 analysis recommends proof artifacts before social launch to avoid "vaporware" perception.

**Total Effort**: 16-24 hours (updated to include proof tasks)

### New Messaging Pillars

1. **Cost Efficiency** (strongest pillar per QCS)
   - "Reduce AI API costs by up to 10x"
   - "Pay less, get more from Claude/Copilot/Cursor"

2. **Quality** (second pillar)
   - "Prevent hallucinations from outdated docs"
   - "Enforce patterns with semantic validation"

3. **Sustainability** (unique differentiator)
   - "Green Governance for AI development"
   - "Less compute = lower carbon footprint"

### Community Launch (In Progress)

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **HN Launch** - "Why AI Agents Need More Than a README" | [TMS-295] | 1h | 🟡 MED | ✅ Done |
| **Reddit Post** - r/ClaudeAI + r/programming (link to blog) | [TMS-286a] | 2h | 🔴 HIGH | ⏸️ Deferred (Monday Jan 27) |
| **X (Twitter) Thread** - Build-in-public with metrics | [TMS-286b] | 1h | 🔴 HIGH | ⏸️ Deferred (Monday Jan 27) |
| **Blog Post: Green AI Development** | [TMS-294] | 3-4h | 🟡 MED | ⏸️ Deferred |

**Total Effort**: 7-8 hours

**Learnings from HN Launch (Jan 24)**:
- Posted: "Why AI Agents Need More Than a README" (existing blog post)
- Strategy: Data-first title, Sydney → US evening timing
- Result: Limited initial traction (new account visibility issue)
- Next: Focus Reddit/X, let HN post sit for organic discovery
- Decision: Build Cost Calculator AFTER Reddit/X feedback on metrics

**Strategic Adjustment (Jan 24 - GPT-5 Report Analysis)**:
- Reddit/X posts now blocked until proof artifacts published ✅ COMPLETE
- Rationale: Claims of "40-60% cost reduction" need defensible methodology
- Risk: Without proof, community may dismiss as vaporware
- Approach: Publish measurement methodology + Cortex dogfooding case study FIRST
- Timeline: +1 day of work for 10x stronger credibility
- **Result**: Proof artifacts published, posts ready to go

**Deferral to Monday (Jan 25 Decision)**:
- **Reason**: New Reddit account will be auto-moderated/rejected
- **Strategy**: Post Monday Jan 27, 8-10am EST for maximum visibility
- **Prep Work**: Comment on 2-3 relevant posts beforehand (build karma)
- **Drafts Ready**:
  - `tmp/reddit-post-draft.md` (ready for Monday)
  - `tmp/twitter-thread-draft.md` (can post THIS WEEKEND)
- **Recommended Flow**:
  1. X thread Sunday 6-8pm EST (no account restrictions)
  2. Reddit post Monday 8-10am EST (after karma building)
  3. X thread validates messaging, Reddit drives GitHub conversions

**Success Metrics**:
- 100+ GitHub stars (from 50 current)
- 5+ community beta testers
- 1,000+ blog post views
- 3+ external mentions (Reddit, X, HN)

---

## 🎯 v2.9 Guardian Optimization (In Progress)

**Context**: Improve Guardian accuracy from 65.5% baseline

**Timeline**: 2-3 weeks (15-20 hours total)
**Status**: 🚀 In Progress (Jan 25+)

### Accuracy Improvements

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Structured JSON Output** - Replace string matching | [OPT-1] | 6-8h | 🔴 HIGH | ✅ Done |
| **Guardian Safe Mode** - High-confidence violations only | [OPT-1b] | 3-4h | 🟡 MED | ✅ Done |
| **Detection Logic Refactor** - Regex with word boundaries | [OPT-2] | 4-6h | 🟡 MED | ✅ Done |
| **Retry Logic** - Exponential backoff for API failures | [OPT-3] | 3-4h | 🟡 MED | ✅ Done |
| **Shared Guardian Prompt** - Extract to utility | [OPT-4] | 2-3h | 🟢 LOW | ⬜ Todo |

**Goal**: Achieve 80%+ accuracy on test dataset
**Note**: Safe Mode reduces false positive noise and builds trust in Guardian accuracy (GPT-5 recommendation)

**Progress Update (Jan 25)**:
- ✅ Structured JSON Output complete
- Implementation: Native JSON mode (OpenAI), prompt engineering (Anthropic)
- New types: `GuardianResult`, `Violation` interfaces
- Graceful fallback to text parsing if JSON fails
- Tests passing, validation clean
- Next: Guardian Safe Mode for high-confidence filtering

---

## 📋 Deferred Items (v3.0+)

**See**: [Future Enhancements](FUTURE-ENHANCEMENTS.md) for complete backlog

- Guardian GitHub Action & PR Bot (TMS-287)
- Migration Experience Improvements (TMS-277-282)
- Custom Templates Architecture (TMS-241)
- MCP Server Integration
- Blog Category Pages (TMS-293)
- Social Preview Image (TMS-285d)

---

## 🗂️ Sprint Archive

- **v2.7**: [Guardian MVP](docs/archive/sprint-v2.7-jan-2026.md) ✅ Complete (Jan 19-23, 2026)
- **v2.6.1**: [Emergency Patch](docs/archive/sprint-v2.6.1-emergency-patch.md) ✅
- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) ✅
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) ✅
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) ✅
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) ✅
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) ✅

<!-- @cortex-tms-version 2.6.1 -->
