# Sprint Archive: v2.7 Guardian MVP (Jan 19 - Feb 15, 2026)

**Status**: ✅ In Progress (Phase 2 & 3 Complete, Phase 4-5 In Progress)
**Focus**: Guardian MVP, Blog Infrastructure, Community Launch

---

## Phase 2: Guardian MVP ✅ COMPLETE

**Goal**: Validate AI governance hypothesis with working prototype

### Completed Tasks

| Task | Ref | Effort | Status | Completion Date |
| :--- | :--- | :----- | :----- | :-------------- |
| Guardian CLI Core - `cortex-tms review <file>` command | TMS-283a | 4h | ✅ Done | Jan 19, 2026 |
| Pattern Violation Detection - LLM-based audit against PATTERNS.md | TMS-283b | 3h | ✅ Done | Jan 19, 2026 |
| Domain Logic Checker - Audit against DOMAIN-LOGIC.md rules | TMS-283c | 2h | ✅ Done | Jan 19, 2026 |
| CLI Output Formatting - Violation reports with line references | TMS-283d | 1h | ✅ Done | Jan 19, 2026 |
| BYOK (Bring Your Own Key) - OpenAI/Anthropic API key support | TMS-283e | 2h | ✅ Done | Jan 19, 2026 |
| Guardian Documentation - CLI reference and usage guide | TMS-283f | 2h | ✅ Done | Jan 19, 2026 |

**Total Effort**: 14 hours

**Implementation Notes**:
- User provides their own API key (BYOK approach)
- Reused prompt templates from `cortex-tms prompt` (TMS-240)
- Target: 70%+ accuracy on architectural violations
- Exit early if TMS files missing (PATTERNS.md, DOMAIN-LOGIC.md)

---

## Phase 3: Distribution & Content ✅ MOSTLY COMPLETE

**Goal**: Launch Guardian with strategic content marketing

### Completed Tasks

| Task | Ref | Effort | Status | Completion Date |
| :--- | :--- | :----- | :----- | :-------------- |
| Blog Infrastructure - Add /blog route and RSS feed | TMS-284a | 2h | ✅ Done | Jan 20, 2026 |
| Blog Post: PR Tsunami - "Our Approach to the AI PR Problem" | TMS-284c | 4h | ✅ Done | Jan 20, 2026 |
| Demo GIF - Record cortex-tms status/migrate workflow | TMS-284e | 1h | ✅ Done | Jan 20, 2026 |
| AI Collaboration Policy - Create docs/core/AI-COLLABORATION-POLICY.md | TMS-289a | 3h | ✅ Done | Jan 20, 2026 |
| Website About Page - Add "How We Build" transparency section | TMS-289b | 2h | ✅ Done | Jan 20, 2026 |
| Homepage Hero Update - Add "Built Using Our Own Standard" | TMS-289c | 1h | ✅ Done | Jan 20, 2026 |
| Global Alias Support - Add bin/cortex.js entry point | TMS-290a | 30m | ✅ Done | Jan 20, 2026 |
| Quick Start Update - Document global install benefits | TMS-290b | 30m | ✅ Done | Jan 20, 2026 |

**Total Effort**: 14 hours

**Remaining Tasks**:
- TMS-284d: Blog Post: Tiered Memory - "Why AI Agents Need More Than a README" (3h, 🟡 MED)

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

---

## Phase 4: GitHub Enhancement ✅ MOSTLY COMPLETE

**Goal**: Optimize repository discoverability

### Completed Tasks

| Task | Ref | Effort | Status | Completion Date |
| :--- | :--- | :----- | :----- | :-------------- |
| Shields & Topics - Add badges and topics to README | TMS-285a-b | 45m | ✅ Done | Jan 20, 2026 |
| Demo GIF in README - Embed workflow recording | TMS-285c | 30m | ✅ Done | Jan 20, 2026 |

**Remaining Tasks**:
- TMS-285d: Social Preview Image - Custom OG image (2h, 🟡 MED)

**Total Completed Effort**: 1.25 hours

**Shields**: npm version, downloads, license, node version
**Topics**: ai, llm, claude-code, github-copilot, cursor, governance, architecture

---

## Additional Work: Liquid Glass Design System

**Tasks Not in Original Sprint Plan**:

### Website Design Enhancement (Jan 20-21, 2026)

**Completed**:
- TMS-291a: Blog link in header navigation
- TMS-292a: Glass system extraction (glass-system.css, glass-components.css, glass-effects.js)
- TMS-292b: Homepage transformation with glass panels
- TMS-292c: Blog redesign with glass cards
- TMS-292d: Interactive effects (3D tilt, sheen)
- TMS-292e: Typography refinement with Noto Sans hierarchy
- TMS-292f: Open Graph meta tags for blog posts
- Layout restructuring: Separate SimpleLayout for homepage/blog vs Starlight for docs
- SimpleHeader component with logo, search, theme switcher
- SimpleThemeSelect component with icon buttons
- Full light/dark mode support

**Effort**: ~10 hours (unplanned improvement)

**Impact**:
- Website now showcases liquid glass aesthetic as brand differentiator
- Improved social sharing with OG meta tags
- Better UX with separate layouts for different page types

---

## Sprint Summary

---

## Phase 3: Distribution & Content (Complete)

**TMS-284d: Blog Post - Tiered Memory System** ✅

**Completed**: January 21, 2026
**Effort**: 3 hours

**Delivered**:
- Comprehensive blog post: "Why AI Agents Need More Than a README"
- 418 lines covering 6-month evolution from README to tiered memory
- Custom hero image (why-ai-agents-need-more-than-readme.webp)
- 8-part structure following CONTENT-STANDARDS.md

**Content Highlights**:
- Context: README approach and its limitations
- Problem: AI forgetting architectural decisions (40% pattern violations)
- Solution: HOT/WARM/COLD tier organization
- Results: 80% reduction in pattern violations after tiered system
- Limitations: When tiered memory doesn't help (5 scenarios)
- Real examples from 380 commits over 6 months

**Quality Compliance**:
- ✅ Observation vs interpretation separated
- ✅ Own experience only (no exaggerated claims)
- ✅ Clear limitations and prerequisites
- ✅ Honest about unknowns
- ✅ Invitation ending (not sales pitch)

---

**Total Completed Effort**: ~42 hours (28h planned + 10h design + 3h tiered memory + 1h fixes)
**Completion Rate**: 84% of planned tasks complete

**Key Achievements**:
- ✅ Guardian MVP fully functional with all 6 core features
- ✅ Blog infrastructure with RSS feed and 2 posts published
- ✅ AI transparency policy established
- ✅ Global alias support implemented
- ✅ Website redesigned with liquid glass system
- ✅ Demo GIF created and embedded in README
- ✅ Tiered memory blog post documenting 6-month journey

**Remaining Work** (Phases 4-5):
- TMS-293: Blog Category Pages (2h)
- TMS-285d: Social Preview Image (2h)
- TMS-286a: Reddit Post (2h)
- TMS-286b: X (Twitter) Thread (1h)
- TMS-286c: CONTRIBUTING.md Update (1h)

**Total Remaining**: ~8 hours
