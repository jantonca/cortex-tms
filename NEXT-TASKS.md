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

## 🚀 v2.7 Sprint: Platform Foundation

**Theme**: "From Tool to Platform"
**Timeline**: 4 weeks (Jan 19 - Feb 15, 2026)
**Focus**: Distribution, documentation, monetization validation

### Phase 1: Foundation (Week 1-2)

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Domain Registration** - cortex-tms.dev | [TMS-270a] | 30m | 🔴 HIGH | ⬜ Todo |
| **GitHub Organization** - Create cortex-tms org | [TMS-270b] | 1h | 🔴 HIGH | ⬜ Todo |
| **Repository Decision** - Monorepo vs split strategy | [TMS-270c] | 2h | 🔴 HIGH | ⬜ Todo |
| **Starlight Setup** - Initialize docs site project | [TMS-270d] | 4h | 🔴 HIGH | ⬜ Todo |
| **Home Page** - Hero, value props, quick start | [TMS-270e] | 6h | 🔴 HIGH | ⬜ Todo |
| **Docs Migration** - Port /docs/core to Starlight | [TMS-270f] | 6h | 🔴 HIGH | ⬜ Todo |

### Phase 2: Distribution (Week 3-4)

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Launch Content** - Blog posts, HN, Reddit | [TMS-271a] | 10h | 🔴 HIGH | ⬜ Todo |
| **Video Tutorial** - Quick start walkthrough | [TMS-271b] | 4h | 🟡 MED | ⬜ Todo |
| **SEO Foundation** - Meta tags, schema, sitemap | [TMS-271c] | 4h | 🟡 MED | ⬜ Todo |
| **Email Capture** - ConvertKit integration | [TMS-271d] | 2h | 🟡 MED | ⬜ Todo |

**Total Effort**: ~40 hours (20h/week pace)

---

## 🔒 Infrastructure & Security (Post-v2.6.0)

**Context**: Project transitioning from "Project" to "Venture" - need to protect commercial strategy before public launch.

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **Private Repo Migration** - Create cortex-tms-internal, migrate /temp/ contents | [TMS-276] | 2-3h | 🔴 HIGH | ⬜ Todo |

**TMS-276 Details** (Private Repo Migration):

**Rationale**:
- **Security Risk**: Business strategy in gitignored /temp/ is one `git add -f` away from leaking
- **Professional Practice**: Separate business strategy (private repo) from technical work (public repo)
- **Context Separation**: Opening Claude Code in different repos prevents accidental strategy leaks

**Implementation (Phase 1 - Before v2.7 launch)**:
1. Create private repo: `cortex-tms-internal` (under personal account)
2. Copy /temp/ contents to new private repo with organized structure
3. Delete /temp/ from public repo, remove from .gitignore
4. Update CLAUDE.md with confidentiality rule
5. Test workflow: Two VS Code windows (public + private repos)

**Phase 2 (Later - When ready for GitHub org)**:
- Create GitHub Organization `cortex-tms`
- Transfer repos to org: `cortex-tms/core`, `cortex-tms/internal`
- Only when team collaboration needed

**Evidence**: Business plan (COMPREHENSIVE-BUSINESS-MODEL-v3.md) already defines this architecture.

---

## 📋 Deferred Items (v2.8+)

### CLI Enhancements
- Custom Templates architecture (TMS-241) - Deferred pending user demand
- Pro tier implementation - Pending validation signals
- MCP server - Pending Anthropic API stability

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
