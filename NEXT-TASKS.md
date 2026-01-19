# NEXT: Upcoming Tasks (v2.7 AI Governance Platform)

**Current Sprint**: v2.7 (Jan 19 - Feb 15, 2026)
**Focus**: Guardian MVP, distribution, community validation
**Previous Sprint**: [v2.6 Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) ✅ Complete

---

## 🚀 Active Work: v2.7 Guardian MVP

### Phase 1: Foundation ✅ COMPLETE

**TMS-270f**: Professional Documentation (36 pages) → https://cortex-tms.org/

---

### Phase 2: Guardian MVP (Week 2) - IN PROGRESS

**Goal**: Validate AI governance hypothesis with working prototype

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Guardian CLI Core** - `cortex-tms review <file>` command | [TMS-283a] | 4h | 🔴 HIGH | ✅ Done |
| **Pattern Violation Detection** - LLM-based audit against PATTERNS.md | [TMS-283b] | 3h | 🔴 HIGH | ✅ Done |
| **Domain Logic Checker** - Audit against DOMAIN-LOGIC.md rules | [TMS-283c] | 2h | 🔴 HIGH | ✅ Done |
| **CLI Output Formatting** - Violation reports with line references | [TMS-283d] | 1h | 🟡 MED | ✅ Done |
| **BYOK (Bring Your Own Key)** - OpenAI/Anthropic API key support | [TMS-283e] | 2h | 🟡 MED | ✅ Done |
| **Guardian Documentation** - CLI reference and usage guide | [TMS-283f] | 2h | 🟡 MED | ⬜ Todo |

**Implementation Notes**:
- User provides their own API key (BYOK approach)
- Reuse prompt templates from `cortex-tms prompt` (TMS-240)
- Target: 70%+ accuracy on architectural violations
- Exit early if TMS files missing (PATTERNS.md, DOMAIN-LOGIC.md)

**Total Effort**: ~14 hours

---

### Phase 3: Distribution & Content (Week 2-3)

**Goal**: Launch Guardian with strategic content marketing

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Blog Infrastructure** - Add /blog route and RSS feed | [TMS-284a] | 2h | 🔴 HIGH | ⬜ Todo |
| **Blog Post: PR Tsunami** - "How Cortex TMS Prevents Maintainer Burnout" | [TMS-284c] | 4h | 🔴 HIGH | ⬜ Todo |
| **Blog Post: Tiered Memory** - "Why AI Agents Need More Than a README" | [TMS-284d] | 3h | 🟡 MED | ⬜ Todo |
| **Demo GIF** - Record cortex-tms status/migrate workflow | [TMS-284e] | 1h | 🔴 HIGH | ⬜ Todo |
| **AI Collaboration Policy** - Create docs/core/AI-COLLABORATION-POLICY.md | [TMS-289a] | 3h | 🔴 HIGH | ⬜ Todo |
| **Website About Page** - Add "How We Build" transparency section | [TMS-289b] | 2h | 🟡 MED | ⬜ Todo |
| **Homepage Hero Update** - Add "Built Using Our Own Standard" | [TMS-289c] | 1h | 🟡 MED | ⬜ Todo |
| **Global Alias Support** - Add bin/cortex.js entry point | [TMS-290a] | 30m | 🟡 MED | ⬜ Todo |
| **Quick Start Update** - Document global install benefits | [TMS-290b] | 30m | 🟡 MED | ⬜ Todo |

**Blog Post Requirements**:
- Reference tldraw issue #7695
- Preview Guardian MVP with CLI examples
- Real metrics: 66% time savings, 80% merge rate
- Link to use cases (open-source.mdx, enterprise.mdx)

**AI Transparency Notes**:
- Policy includes HITL workflow, authorship metadata, quality standards
- Position as "most transparent AI-assisted project"
- Dogfooding narrative: "Built using our own standard"

**Global Install Notes**:
- Enable `cortex` shorthand command via global install
- Gateway to Pro Workflow: Try with npx, upgrade to global
- Prepares for v2.8 cross-project features (`cortex list`)

**Total Effort**: ~17 hours

---

### Phase 4: GitHub Enhancement (Week 2-3)

**Goal**: Optimize repository discoverability

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Shields & Topics** - Add badges and topics to README | [TMS-285a-b] | 45m | 🔴 HIGH | ⬜ Todo |
| **Demo GIF in README** - Embed workflow recording | [TMS-285c] | 30m | 🔴 HIGH | ⬜ Todo |
| **Social Preview Image** - Custom OG image | [TMS-285d] | 2h | 🟡 MED | ⬜ Todo |

**Shields**: npm version, downloads, license, node version
**Topics**: ai, llm, claude-code, github-copilot, cursor, governance, architecture

**Total Effort**: ~3.5 hours

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

**Total Effort**: ~38.5 hours across 3 weeks
**Success Metrics**:
- 70%+ accuracy on pattern violations (Guardian)
- 100+ GitHub stars
- 5+ community beta testers
- 1,000+ blog post views
- Position as most transparent AI-assisted project

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

- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md)
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md)
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md)
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md)
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md)
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md)

<!-- @cortex-tms-version 2.6.0 -->
