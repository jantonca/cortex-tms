# NEXT: Upcoming Tasks (v2.7 Platform Evolution)

## 🎉 v2.6.0 "Integrity & Atomicity" Complete!

**Released**: 2026-01-18
**NPM**: [v2.6.0](https://www.npmjs.com/package/cortex-tms) (stable)
**Archive**: See [sprint-v2.6-integrity-atomicity.md](docs/archive/sprint-v2.6-integrity-atomicity.md)

**Achievements**:
- ✅ Atomic Release Engine with rollback safety
- ✅ Git Guardian preventing unsafe operations
- ✅ Emergency Hotfix Path for production incidents
- ✅ 23 integration tests ensuring Safe-Fail guarantees
- ✅ Best Practices Guide (733 lines, Pragmatic Rigor framework)
- ✅ NPM visibility optimization (15 search-optimized keywords)

---

## 🚀 v2.7 Sprint: AI Governance Platform

**Theme**: "From Documentation Tool to AI Governance Platform"
**Timeline**: 4 weeks (Jan 19 - Feb 15, 2026)
**Focus**: Guardian MVP, distribution, community validation

### Phase 1: Foundation (Week 1) ✅ COMPLETE

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Domain Registration** - cortex-tms.org (primary), .dev, cortextms.dev | [TMS-270a] | 30m | 🔴 HIGH | ✅ Done |
| **GitHub Organization** - Create cortex-tms org, transfer repo | [TMS-270b] | 1h | 🔴 HIGH | ✅ Done |
| **Repository Decision** - Monorepo vs split strategy | [TMS-270c] | 2h | 🔴 HIGH | ✅ Done |
| **Starlight Setup** - Initialize docs site project | [TMS-270d] | 4h | 🔴 HIGH | ✅ Done |
| **Home Page** - Hero, value props, quick start | [TMS-270e] | 6h | 🔴 HIGH | ✅ Done |
| **Professional Documentation** - 36 pages with governance positioning | [TMS-270f] | 40h | 🔴 HIGH | ✅ Done |

**Phase 1 Complete**: Website deployed at https://cortex-tms.org/ with 36 pages

---

### Phase 2: Guardian MVP (Week 2) - IN PROGRESS

**Goal**: Validate AI governance hypothesis with working prototype

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Guardian CLI Core** - `cortex-tms review <file>` command | [TMS-283a] | 4h | 🔴 HIGH | ⬜ Todo |
| **Pattern Violation Detection** - LLM-based audit against PATTERNS.md | [TMS-283b] | 3h | 🔴 HIGH | ⬜ Todo |
| **Domain Logic Checker** - Audit against DOMAIN-LOGIC.md rules | [TMS-283c] | 2h | 🔴 HIGH | ⬜ Todo |
| **CLI Output Formatting** - Violation reports with line references | [TMS-283d] | 1h | 🟡 MED | ⬜ Todo |
| **BYOK (Bring Your Own Key)** - OpenAI/Anthropic API key support | [TMS-283e] | 2h | 🟡 MED | ⬜ Todo |
| **Guardian Documentation** - CLI reference and usage guide | [TMS-283f] | 2h | 🟡 MED | ⬜ Todo |

**Guardian Implementation Notes**:
- User provides their own API key (OpenAI/Anthropic)
- Reuse prompt templates from `cortex-tms prompt` (TMS-240)
- Target: 70%+ accuracy on architectural violations
- Exit early if TMS files missing (PATTERNS.md, DOMAIN-LOGIC.md)

**Total Effort**: ~14 hours

---

### Phase 3: Distribution & Content (Week 2-3)

**Goal**: Launch Guardian with strategic content marketing

#### Blog Infrastructure

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Starlight Blog Setup** - Add /blog route and RSS feed | [TMS-284a] | 2h | 🔴 HIGH | ⬜ Todo |
| **Blog Template** - Create reusable post template with frontmatter | [TMS-284b] | 1h | 🟡 MED | ⬜ Todo |

#### Launch Content

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Blog Post 1** - "How Cortex TMS Prevents Maintainer Burnout in the AI Era" | [TMS-284c] | 4h | 🔴 HIGH | ⬜ Todo |
| **Blog Post 2** - "The Tiered Memory System: Why AI Agents Need More Than a README" | [TMS-284d] | 3h | 🟡 MED | ⬜ Todo |
| **README Demo GIF** - Record cortex-tms status/migrate workflow | [TMS-284e] | 1h | 🔴 HIGH | ⬜ Todo |

**Blog Post 1 Requirements** (PR Tsunami):
- Reference tldraw GitHub issue #7695 directly
- Preview Guardian MVP with CLI examples
- Include real metrics: 66% time savings, 80% merge rate
- Link to open-source.mdx use case
- Call-to-action: Try Guardian beta

**Total Effort**: ~11 hours

---

### Phase 4: GitHub Enhancement (Week 2-3)

**Goal**: Optimize repository discoverability and professionalism

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Repository Shields** - Add version, downloads, license badges | [TMS-285a] | 30m | 🔴 HIGH | ⬜ Todo |
| **GitHub Topics** - Add ai, llm, claude-code, documentation, governance | [TMS-285b] | 15m | 🔴 HIGH | ⬜ Todo |
| **Demo GIF in README** - Embed workflow recording | [TMS-285c] | 30m | 🔴 HIGH | ⬜ Todo |
| **Social Preview Image** - Custom OG image for GitHub | [TMS-285d] | 2h | 🟡 MED | ⬜ Todo |

**Shields to Add**:
```markdown
![npm version](https://img.shields.io/npm/v/cortex-tms)
![npm downloads](https://img.shields.io/npm/dm/cortex-tms)
![license](https://img.shields.io/npm/l/cortex-tms)
![node version](https://img.shields.io/node/v/cortex-tms)
```

**Topics to Add**:
`ai`, `llm`, `claude-code`, `github-copilot`, `cursor`, `documentation`, `governance`, `architecture`, `ai-agents`, `context-optimization`

**Total Effort**: ~3.5 hours

---

### Phase 5: Community Launch (Week 3)

**Goal**: Validate Guardian with open source community

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Reddit Post** - r/opensource Guardian announcement | [TMS-286a] | 2h | 🔴 HIGH | ⬜ Todo |
| **X (Twitter) Thread** - Build-in-public Guardian launch | [TMS-286b] | 1h | 🟡 MED | ⬜ Todo |
| **CONTRIBUTING.md Update** - Add Guardian v2.8 roadmap mention | [TMS-286c] | 1h | 🟡 MED | ⬜ Todo |

**Reddit Post Strategy** (r/opensource):
- Title: "Built a CLI to audit AI-generated PRs against project architecture (solving the tldraw problem)"
- Link to tldraw issue #7695 as context
- Demo Guardian CLI with real violation detection
- Ask for feedback on accuracy and use cases
- Link to blog post and Guardian docs

**X Thread Hook**:
"Spent the last month building a solution to the 'AI PR Tsunami' problem.

Cortex Guardian audits PRs against your project's architectural rules (PATTERNS.md, DOMAIN-LOGIC.md) using LLMs.

Here's how it works 🧵"

**Total Effort**: ~4 hours

---

## 📊 v2.7 Sprint Summary

**Total Effort**: ~32.5 hours across 3 weeks
**Primary Deliverable**: Guardian MVP + Launch Campaign
**Success Metrics**:
- 70%+ accuracy on pattern violations (Guardian)
- 100+ GitHub stars (community validation)
- 5+ community members trying Guardian beta
- 1,000+ blog post views

---

## 🔒 Infrastructure & Security

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Repository Infrastructure** - Internal repository setup | [TMS-276] | 2-3h | 🔴 HIGH | ✅ Done |

**Details**: See internal planning documentation.

---

## 📋 Deferred Items (v2.8+)

### Guardian v2.8: GitHub Action

**Goal**: Automated PR review in CI/CD

| Task | Ref | Effort | Priority | Notes |
| :--- | :--- | :----- | :------- | :----- |
| **GitHub Action Wrapper** - cortex-tms/review-action | [TMS-287a] | 4h | 🔴 HIGH | Depends on v2.7 CLI validation |
| **PR Comment Bot** - Automated violation comments | [TMS-287b] | 3h | 🔴 HIGH | Uses GitHub API |
| **Hosted Service** - Cortex-funded LLM calls | [TMS-287c] | 8h | 🟡 MED | Freemium model ($0 → $29/mo) |
| **Governance Dashboard** - Track PR alignment metrics | [TMS-287d] | 8h | 🟡 MED | Pro feature |

**Total Effort**: ~23 hours
**Monetization**: Hosted service enables Pro/Enterprise tiers

---

### File Reference Documentation

**Goal**: Dedicated reference for core TMS files

| Task | Ref | Effort | Priority | Notes |
| :--- | :--- | :----- | :------- | :----- |
| **Consolidated Reference Page** - Single page covering all files | [TMS-288] | 3h | 🟢 LOW | Can backfill anytime |

**Alternative**: Create 5 separate pages (CLAUDE.md, NEXT-TASKS.md, PATTERNS.md, .cortexrc, ARCHITECTURE.md)
**Effort**: 6 hours if split

**Recommendation**: Defer until user requests come in

---

### CLI Enhancements

- Custom Templates architecture (TMS-241) - Deferred pending user demand
- MCP server integration - Pending Anthropic API stability

---

### Migration Experience Improvements

**Source**: Synthesis of learnings from 7 completed migrations

| Task | Ref | Effort | Priority | Notes |
| :--- | :--- | :----- | :------- | :----- |
| **Architecture Templates** - Preset governance for SSG/SSR/Monorepo/Email/Privacy | [TMS-277] | 8-12h | 🔴 HIGH | Would save ~1h per migration (35% of Phase 3) |
| **Config Version Fix** - Suppress or auto-upgrade version mismatch warning | [TMS-278] | 2-3h | 🟡 MED | Quality of life, appears in all migrations |
| **Validation Packages** - Reusable rule packs (privacy, R2, email-safe, print) | [TMS-279] | 6-8h | 🟡 MED | Save 20-30 min per migration |
| **Glossary Auto-Suggest** - CLI tool to extract terms from README/docs | [TMS-280] | 10-15h | 🟢 LOW | Complex NLP, significant effort for moderate gain |
| **Branch Auto-Detection** - Auto-detect main/master from git config | [TMS-281] | 1-2h | 🟢 LOW | Small pain point, low effort |
| **Greenfield Template** - Simplified template for projects with no governance | [TMS-282] | 3-4h | 🟡 MED | 30-40% faster for new projects |

**Total Effort**: 30.5-44 hours

**Impact**: These enhancements would save 35-50% of migration time based on evidence from 7 migrations.

---

## 🗂️ Sprint Archive Links

- **v2.6**: [Integrity & Atomicity](docs/archive/sprint-v2.6-integrity-atomicity.md) - Atomic Release Engine, Git Guardian, Emergency Hotfix Path
- **v2.5**: [Guidance & Growth](docs/archive/sprint-v2.5-guidance-growth.md) - Zero-Drift Governance, Safe-Fail Migration Engine
- **v2.4**: [Scaling Intelligence](docs/archive/sprint-v2.4-scaling-intelligence.md) - Migration Auditor, Prompt Engine, Version Infrastructure
- **v2.3**: [Confidence & Comfort](docs/archive/sprint-v2.3-confidence-comfort.md) - Status Dashboard, Snippets, Self-Healing
- **v2.2**: [Automation & Precision](docs/archive/sprint-2026-01.md) - CI/CD, Custom Init, Branch Hygiene
- **v2.1**: [Foundation](docs/archive/sprint-2026-01-dogfooding.md) - CLI Launch, Validation Engine, Template System

<!-- @cortex-tms-version 2.6.0 -->
