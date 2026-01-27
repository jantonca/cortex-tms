# NEXT: Upcoming Tasks

**Current Sprint**: v3.0 Development (Jan 26 - Feb 14, 2026)
**Previous Sprint**: [v2.9 Guardian Optimization](docs/archive/sprint-v2.9-jan-2026.md) ✅ Complete

---

## 🎯 v3.0 Development Focus

**Timeline**: 3 weeks
**Status**: 🚧 Planning

### Technical Improvements

| Task | Ref | Effort | Priority | Status |
| :--- | :--- | :----- | :------- | :----- |
| **AI-Assisted Bootstrap Onboarding** | [BOOT-1] | 14h | 🔴 HIGH | ✅ Complete |
| **Website Performance Optimization** | [TECH-1] | 4-6h | 🟡 MED | ⏸️ Planned |
| **Guardian Enhancements** | [TECH-2] | 3-4h | 🟡 MED | ⏸️ Planned |
| **Migration Experience Improvements** | [TMS-277-282] | 4-5h | 🟡 MED | ⏸️ Planned |
| **Version Release (v2.7.0)** | [REL-1] | 1-2h | 🟢 LOW | ⏸️ Deferred |

### Website Performance Optimization [TECH-1]

**Goal**: Reduce CSS bundle size, improve Lighthouse scores

**Tasks**:
- Remove unused CSS components (~2.1KB savings)
- Extract inline styles from homepage
- Clean up dead code in components
- Run performance benchmarks

**Status**: Documented in `tmp/WEBSITE-OPTIMIZATION-TASKS.md`

### AI-Assisted Bootstrap Onboarding [BOOT-1]

**Goal**: Enable AI agents to populate TMS documentation from codebase on first session

**Context**: After `cortex-tms init`, users face empty templates with `[placeholder]` syntax.
Users work with AI agents (Claude Code, Copilot, Cursor). The agent should do the bootstrapping.
See: `tmp/AI-BOOTSTRAP-STRATEGY-PLAN-v2.md` for full strategy.

**Architecture**: Prompt-first (Layer 1 + Layer 2). CLI bootstrap deferred to v2.

**Tasks**:

#### Templates & Prompts
- [x] Add `bootstrap` prompt to `templates/PROMPTS.md` [BOOT-1.1]
- [x] Add `populate-architecture` prompt to `templates/PROMPTS.md` [BOOT-1.2]
- [x] Add `discover-patterns` prompt to `templates/PROMPTS.md` [BOOT-1.3]
- [x] Add `extract-rules` prompt to `templates/PROMPTS.md` [BOOT-1.4]
- [x] Add "First Session Setup" section to `templates/CLAUDE.md` [BOOT-1.5]
- [x] Add setup detection note to `templates/.github/copilot-instructions.md` [BOOT-1.6]

#### CLI Changes
- [x] Update post-init message in `src/commands/init.ts` with AI-agent quick start [BOOT-1.7]
- [x] Add placeholder detection + AI-DRAFT detection to `src/utils/validator.ts` [BOOT-1.8]
  - `[placeholder]` → Incomplete (error)
  - `<!-- AI-DRAFT -->` → Draft (warning)
  - Contextual messages for each state
- [x] Add Lesson 6: AI-Powered Bootstrapping to `src/commands/tutorial.ts` [BOOT-1.9]

#### Testing & Validation
- [x] Write tests for placeholder/draft detection in `src/__tests__/validate.test.ts` [BOOT-1.10]
- [x] Verify existing prompt parser tests pass with new prompts [BOOT-1.11]
- [x] Dogfood: test bootstrap prompt on cortex-tms repo [BOOT-1.12]
- [x] Dogfood: test bootstrap prompt on examples/todo-app [BOOT-1.13]
  - Note: todo-app already has populated docs, tested on cortex-tms instead

#### Content
- [x] Write article: "From Zero Docs to AI-Ready in 10 Minutes" [BOOT-1.14]
  - Location: `website/src/content/blog/ai-powered-bootstrapping.md`
  - Note: Hero image (ai-powered-bootstrapping.webp) needs to be created

**Key Files**:
- `templates/PROMPTS.md` — Add 4 new prompts
- `templates/CLAUDE.md` — Add First Session Setup section
- `templates/.github/copilot-instructions.md` — Add setup detection note
- `src/commands/init.ts` — Update post-init message
- `src/utils/validator.ts` — Add placeholder + AI-DRAFT detection
- `src/commands/tutorial.ts` — Add Lesson 6
- `src/__tests__/validate.test.ts` — New tests

**Status**: ✅ Complete - Dogfooding validated. See: `docs/archive/dogfooding-bootstrap-v3.0.md`

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
