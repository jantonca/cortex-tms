# FUTURE: Planned Enhancements

This is the **living backlog** for Cortex TMS. Tasks move from here to `NEXT-TASKS.md` when they become active.

**Last Updated**: 2026-01-24 (Post-Sprint v2.7)
**Source**: Sprint retrospectives + community feedback

---

## 🚨 CRITICAL BUGS (Moved to NEXT-TASKS.md v2.6.1)

The following critical issues have been **moved to active development** in `NEXT-TASKS.md`:

✅ **CRITICAL-1**: Nano scope validation mismatch (BLOCKER)
✅ **CRITICAL-2**: Migration path handling breaks nested files (BLOCKER)
✅ **CRITICAL-3**: Prerelease version parsing errors (BLOCKER)

**Status**: These are being addressed in v2.6.1 emergency patch (Jan 21-24, 2026)

---

## 🔥 Known Issues (Lower Priority)

### Release Script: Prerelease Version Support (TMS-272)
**Issue**: The Atomic Release Engine cannot promote prerelease versions (e.g., `2.6.0-beta.1` → `2.6.0`) automatically.

**Root Cause**:
```javascript
// scripts/release.js line 234
const [major, minor, patch] = currentVersion.split('.').map(Number);
// "2.6.0-beta.1".split('.') = ['2', '6', '0-beta', '1']
// Number('0-beta') = NaN ❌
```

**Current Workaround**: Manually update `package.json` version, then run sync script.

**Fix Required**:
- Add prerelease version parsing (strip `-beta.X`, `-alpha.X`, `-rc.X` suffixes)
- Add `--version X.Y.Z` flag to explicitly set version
- Support beta→stable promotion workflow
- Update tests to cover prerelease scenarios

**Priority**: 🟡 Medium (affects release workflow but has workaround)
**Effort**: 2-3 hours
**Discovered**: v2.6.0 stable release (2026-01-18)

---

## 🔴 High Priority (Audit-Driven - v2.9+)

### Benchmark Suite (Viability Report Recommendation)

- **AI Agent Performance Benchmarks**: Prove "3-5x faster collaboration" claim
  - **Why**: Current claim is "plausible but unverified" (all audits agree)
  - **Approach**:
    1. Create standardized tasks (e.g., "add new API endpoint")
    2. Measure with TMS: token count, agent turns, time to completion
    3. Measure without TMS: same metrics
    4. Repeat across 10-20 tasks, report statistical results
  - **Business Value**: Converts "plausible" to "proven" claims
  - **Effort**: 16-20h (research-heavy)
  - **Source**: Analysis Report + Viability Report

---

### GitHub Action (High ROI Feature)

- **Zero-Friction Enforcement**: Teams validate TMS without local install
  - **Why**: "Real opportunity" per Viability Report
  - **Implementation**:
    ```yaml
    - uses: cortex-tms/validate@v1
      with:
        strict: true
    ```
  - **Effort**: 12-16h
  - **Source**: Viability Report Section 7.1

---

### Migration Assistant (Biggest Adoption Barrier)

- **Automated Brownfield Migration**: Analyze existing repos and populate TMS templates
  - **Why**: "Biggest barrier to adoption" per Analysis Report
  - **Implementation**:
    ```bash
    cortex-tms migrate --from conventional-docs
    # Uses LLM to analyze README, extract patterns, populate templates
    ```
  - **Business Value**: Reduces migration from hours to minutes
  - **Effort**: 16-20h
  - **Trigger**: Validate demand first (wait for 10+ migration requests)
  - **Source**: Analysis Report Section 7.4

---

### Pattern Library Marketplace

- **Community Templates**: Share/import patterns for specific frameworks
  - **Why**: Reduces onboarding time, creates community engagement
  - **Implementation**:
    ```bash
    cortex-tms patterns add @cortex-tms/react-patterns
    cortex-tms patterns add @mycompany/internal-patterns
    ```
  - **Technical**: Requires pattern versioning and conflict resolution
  - **Effort**: 20-24h (platform development)
  - **Trigger**: Validate demand first (wait for 20+ custom patterns shared)
  - **Source**: Analysis Report Section 7.2

---

## 🟡 Medium Priority (Next 1-2 Months)

### CLI Tool Enhancements

- **Interactive Template Selection**: Prompt users to choose which `docs/core/*.md` files they need
  - **Why**: Not all projects need `SCHEMA.md` or `TROUBLESHOOTING.md`
  - **Effort**: 4h

- **Detect Existing Package Manager**: Auto-detect if user uses npm/yarn/pnpm/bun
  - **Why**: Respect user's existing tooling
  - **Effort**: 2h

- **Safe File Merging**: Don't overwrite existing files without confirmation
  - **Why**: Brownfield projects may have existing `README.md` or `.github/` files
  - **Effort**: 3h

- **GitHub Actions Detection**: If `.github/workflows/` exists, offer to add TMS validation workflow
  - **Why**: Automate enforcement of line limits and structure
  - **Effort**: 4h

---

### Documentation Guides

- **QUICK-START.md**: 5-minute setup guide
  - **Why**: New users need fast onboarding
  - **Effort**: 2h

- **MIGRATION-GUIDE.md**: How to add TMS to existing projects
  - **Why**: Most users have brownfield projects
  - **Effort**: 3h

- **BEST-PRACTICES.md**: How to write effective DOMAIN-LOGIC, PATTERNS, etc.
  - **Why**: Quality of docs determines AI agent success
  - **Effort**: 3h

---

## 🟡 Medium Priority: Community & Adoption (v3.0+)

### Lower Adoption Friction (GPT-5 Report Recommendations)

- **Minimalist Preset** [GPT5-REC-1]
  - **Feature**: New scope `cortex-tms init --scope minimal`
  - **Why**: Reduces cognitive load for first-time users (current HOT+WARM docs are overwhelming)
  - **Implementation**: Only sets up:
    - `NEXT-TASKS.md` (task management)
    - `.github/copilot-instructions.md` (AI collaboration)
    - `docs/core/ARCHITECTURE.md` (system overview)
  - **Effort**: 4-6h
  - **Priority**: 🟡 Medium
  - **Source**: External GPT-5 repository analysis (Jan 24, 2026)

- **One-Click Try Path** [GPT5-REC-2]
  - **Feature**: Screencast/GIF showing typical dev session with Claude/Copilot using TMS
  - **Why**: "Show, don't tell" - demonstrates value in 30 seconds
  - **Implementation**:
    - Record 2-3 minute demo of AI agent using TMS docs
    - Add to website landing page hero section
    - Include in README.md above fold
  - **Effort**: 2-3h
  - **Priority**: 🟡 Medium
  - **Source**: External GPT-5 repository analysis (Jan 24, 2026)

- **Reusable GitHub Action** [GPT5-REC-3]
  - **Feature**: Package existing workflow as reusable action
  - **Why**: High leverage - teams can validate TMS without local setup
  - **Implementation**:
    ```yaml
    - uses: cortex-tms/validate-action@v1
      with:
        strict: true
    ```
  - **Effort**: 3-4h (lower than GitHub Action feature below - just packaging)
  - **Priority**: 🟡 Medium (consider moving to v2.9)
  - **Source**: External GPT-5 repository analysis (Jan 24, 2026)

---

## 🟡 Medium Priority (2-4 Months)

### Example Projects

- **examples/todo-app/**: Next.js 15 + Shadcn todo app with full TMS
  - **Why**: Reference implementation validates the structure
  - **Effort**: 8h

- **examples/cli-tool/**: Node.js CLI application with TMS
  - **Why**: Shows TMS works for non-web projects
  - **Effort**: 4h

- **examples/api-service/**: Express + PostgreSQL API with TMS
  - **Why**: Demonstrates `SCHEMA.md` and `TROUBLESHOOTING.md` usage
  - **Effort**: 6h

---

### Template Enhancements

- **Complete ARCHITECTURE.md template**: Add sections for deployment, security, scalability
  - **Effort**: 2h

- **Complete TROUBLESHOOTING.md template**: Add common framework gotchas
  - **Effort**: 2h

- **Complete SCHEMA.md template**: Add examples for SQL, NoSQL, GraphQL schemas
  - **Effort**: 3h

- **Add README.md template**: Project-specific README that references TMS
  - **Effort**: 1h

---

### Automation & Validation

- **TMS Validation CLI Command**: `cortex-tms validate`
  - Checks file sizes (HOT files under limits)
  - Detects placeholders that weren't replaced
  - Verifies file structure
  - **Effort**: 6h

- **GitHub Action for TMS Validation**: Auto-check PRs
  - **Effort**: 3h

- **Pre-commit Hook**: Warn if `NEXT-TASKS.md` exceeds 200 lines
  - **Effort**: 2h

---

## 🟢 Low Priority (Nice to Have)

### VS Code Extension

- **TMS File Navigator**: Sidebar showing HOT/WARM/COLD tiers
  - **Effort**: 12h

- **Snippet Library**: Quick insert for patterns, ADRs, tasks
  - **Effort**: 4h

- **Placeholder Detection**: Highlight bracket-syntax placeholders in templates
  - **Effort**: 3h

---

### Advanced Features

- **AI Agent Performance Metrics**: Track before/after TMS adoption
  - Measure: hallucination rate, task completion time, file reads
  - **Effort**: 16h (research-heavy)

- **Multi-Language Support**: Templates in Spanish, French, Mandarin
  - **Effort**: 8h per language

- **TMS for Non-Code Projects**: Adapt for marketing, design, operations teams
  - **Effort**: 12h (requires research)

---

### Distribution Enhancements

- **NPM Package Publishing**: Publish `cortex-tms` to npm
  - **Effort**: 4h (includes CI/CD setup)

- **GitHub Template Repository**: Configure repo as template
  - **Effort**: 1h

- **Homebrew Formula**: `brew install cortex-tms`
  - **Effort**: 4h

- **Docker Image**: Containerized CLI tool
  - **Effort**: 3h

---

## 🔬 Experimental Ideas

### AI Agent Integration

- **Claude Code Integration**: Native support for TMS structure
  - **Effort**: Unknown (requires Anthropic partnership)

- **Cursor Rules Generator**: Auto-generate `.cursorrules` from `copilot-instructions.md`
  - **Effort**: 4h

- **Copilot Chat Slash Commands**: `/tms-sprint`, `/tms-pattern`, `/tms-decision`
  - **Effort**: Unknown (requires GitHub partnership)

---

### Community Features

- **Template Marketplace**: User-submitted templates for specific frameworks
  - Example: "TMS for Django", "TMS for Rails"
  - **Effort**: 20h (platform development)

- **TMS Showcase**: Gallery of projects using TMS
  - **Effort**: 8h

---

## 🗑️ Rejected Ideas

### Why We're NOT Doing These

- **YAML/JSON Templates**: Markdown is more human-readable
- **GUI Tool**: CLI-first philosophy; GUI adds complexity
- **Automatic Archiving**: Too risky; requires manual review
- **AI-Generated Docs**: Quality control is too difficult

---

## 📊 Audit Findings Summary (2026-01-21)

Four comprehensive audits provided the following strategic insights:

### Consensus Findings (All Audits Agree)

✅ **Core Concept is Sound**: Tiered Memory System solves a real problem in AI development
✅ **Token/Cost Savings**: 40-60% context reduction is achievable and valuable
✅ **Sustainability Angle**: "Green Governance" positioning is unique and defensible
✅ **Continue Development**: All audits recommend continuing with strategic focus
✅ **Marketing Needs Refinement**: Shift from "boilerplate" to "AI governance platform"

### Critical Gaps Identified

❌ **Trust-Breaking Bugs**: 3 critical bugs undermine reliability (moved to v2.6.1)
❌ **Unverified Claims**: "3-5x faster" needs benchmarks to prove
❌ **Missing Proof**: Token counter feature needed to show ROI
⚠️ **Testing Gap**: Need integration tests for command interactions
⚠️ **Error Handling**: process.exit() calls prevent proper cleanup

### Strategic Opportunities

🎯 **"Green Governance" Positioning**: Market as cost + quality + sustainability platform
🎯 **Token Counter**: Makes value visible and measurable (QCS strongest recommendation)
🎯 **Guardian Semantic Validation**: Move from structural to semantic quality checks
🎯 **GitHub Action**: Zero-friction adoption for teams
🎯 **Benchmark Suite**: Convert "plausible" claims to "proven" claims

### Revised Viability Score

**Before Audits**: 8.2/10 (internal assessment)
**After Audits**: 7.2/10 (accounting for critical bugs)
**After v2.6.1 Fix**: Expected 8.5/10 (bugs fixed + strategic features)

### Source Documents

- **QCS Analysis**: Quality, Cost, Sustainability framework
- **Viability Report**: Evidence-based code audit (found critical bugs)
- **Analysis Report**: Architecture and market assessment
- **Comparison Report**: Synthesis of all findings
- **GPT-5 Repository Analysis** (Jan 24, 2026): External review of concept, implementation, plans, and viability

All audit documents available in `/tmp/` directory.

---

## Migration Checklist

**When a task becomes active**:
1. Move it to `NEXT-TASKS.md`
2. Add to current sprint table
3. Break into smaller tasks if needed
4. Assign effort estimate
5. Mark status as "Todo"

**Archive Trigger**: When this file exceeds 400 lines, move completed sections to `docs/archive/backlog-YYYY-MM.md`.

<!-- @cortex-tms-version 2.6.1 -->
