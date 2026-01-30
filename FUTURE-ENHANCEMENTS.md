# FUTURE: Planned Enhancements

This is the **living backlog** for Cortex TMS. Tasks move from here to `NEXT-TASKS.md` when they become active.

**Last Updated**: 2026-01-30 (Post v3.1 Release Prep)
**Source**: Sprint retrospectives + audit findings + community feedback + code reviews

---

## 📣 v3.1 Post-Release Polish

**Homepage Auto-Tier Card** (P2, 30min): Add feature card to `website/src/pages/index.astro`

---

## 🎨 v3.2+: Auto-Tier Polish & Performance

**Theme**: Performance optimization and edge case handling for auto-tier
**Timeline**: TBD (after v3.1 complete + hardening tasks)
**Source**: GPT-5.1 code review feedback

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **Batched Git Log** [PERF-1] | Replace per-file `git log` with batched approach for large repos | 3-4h | 🟡 P1 | ⏸️ Future |
| **Parallel File Processing** [PERF-2] | Process file changes in parallel batches in `applyChanges()` | 2h | 🟢 P2 | ⏸️ Future |
| **Respect .gitignore** [FEAT-1] | Honor `.gitignore` to avoid tagging ignored files | 2-3h | 🟡 P1 | ⏸️ Future |
| **Error Differentiation** [DX-1] | Distinguish "file not in history" vs "git command failed" errors | 1-2h | 🟡 P1 | ⏸️ Future |
| **Recency Edge Semantics** [DOC-1] | Document that auto-tier commits update recency (by design) | 30m | 🟢 P2 | ⏸️ Future |

**Total Effort**: ~9-12h

**Context**:
- **PERF-1**: Current implementation runs `git log` once per file; batched approach would improve large repo performance
- **PERF-2**: Sequential file writes can be slow; parallel batches would speed up application
- **FEAT-1**: Currently processes all `.md` files; should respect `.gitignore` for cleaner behavior
- **DX-1**: All git errors treated as "untracked" → HOT; better error messages would help debugging
- **DOC-1**: Running auto-tier and committing updates file recency; this is acceptable but worth documenting

**Performance Targets**:
- Current: ~300ms for 110 files (cortex-tms repo)
- Target: <1s for 1000-file repositories (with batched git log)

**Not Blocking v3.1 Release**: These are polish improvements, not critical bugs

---

## 🔴 v3.2: Code Quality & Security (Deferred from Audit)

**Theme**: Security Hardening + Code Quality Improvements
**Timeline**: TBD (after v3.1 Auto-Tiering complete)
**Source**: Opus 4.5 Audit findings + earlier audit reports

These tasks were originally considered for v3.1 but deferred to focus on git-based auto-tiering feature.

| Task | Description | Effort | Priority | Status |
| :--- | :---------- | :----- | :------- | :----- |
| **Centralize Error Handling** [AUDIT-1] | Remove `process.exit()` calls, use consistent error patterns | 2-3h | 🔴 P0 | ⏸️ Deferred |
| **Add Zod Input Validation** [AUDIT-2] | Validate CLI inputs at command entry points | 2-3h | 🔴 P0 | ⏸️ Deferred |
| **Add Integration/E2E Tests** [AUDIT-3] | Test full CLI workflows (init, validate, migrate) | 6-8h | 🔴 P0 | ⏸️ Deferred |
| **Add npm audit to CI** [AUDIT-4] | Automated dependency vulnerability scanning | 30m | 🟡 P1 | ⏸️ Deferred |
| **File Path Traversal Protection** [AUDIT-5] | Validate template paths prevent directory traversal | 1-2h | 🔴 P0 | ⏸️ Deferred |
| **Guardian API Key Redaction** [AUDIT-6] | Ensure API keys never logged or exposed | 1-2h | 🔴 P0 | ⏸️ Deferred |

**Total Effort**: ~13-17h

**Acceptance Criteria**:
- [ ] All CLI commands use centralized error handling (no process.exit)
- [ ] Zod schemas validate all user inputs before processing
- [ ] E2E test coverage for init, validate, migrate, review commands
- [ ] CI pipeline fails on high/critical npm audit findings
- [ ] Template path validation prevents `../../etc/passwd` attacks
- [ ] Guardian logs sanitize API keys before output

**Rationale for v3.2 Placement**:
- v3.1 prioritizes user-facing auto-tiering feature
- Security issues are important but not blocking current usage
- Provides dedicated sprint for quality improvements

---

## 🔥 Completed Items

✅ TMS-272, CRITICAL bugs (v2.6.1), GitHub Action (v3.0) - See git history for details

---

## 🔴 High Priority (Audit-Driven - v3.2+)

### Benchmark Suite (Top Priority - All Audits Agree)

- **AI Agent Performance Benchmarks**: Prove "3-5x faster collaboration" claim
  - **Why**: **#1 credibility gap** - Current claim is "plausible but unverified" (all audits agree, including Opus 4.5)
  - **Status**: Remains the highest-priority missing piece after v3.0 release
  - **Approach**:
    1. Create standardized tasks (e.g., "add new API endpoint")
    2. Measure with TMS: token count, agent turns, time to completion
    3. Measure without TMS: same metrics
    4. Repeat across 10-20 tasks, report statistical results
  - **Business Value**: Converts "plausible" to "proven" claims, essential for credibility
  - **Effort**: 16-20h (research-heavy)
  - **Source**: All audit reports (QCS, Viability, Analysis, Opus 4.5)

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

## 🟢 Bootstrap Enhancements (v3.1+)

**Context**: Bootstrap onboarding feature shipped in v3.0. See implementation feedback: `docs/archive/bootstrap-v3.0-implementation-feedback.md`

### Blog Article Examples
- **Feature**: Add real AI-generated ARCHITECTURE.md excerpt to blog article
- **Why**: Makes "90% accurate first draft" claim concrete and helps readers calibrate expectations
- **Implementation**:
  - Take actual AI-generated content from dogfooding
  - Show before/after with refinements
  - Add to `website/src/content/blog/ai-powered-bootstrapping.md`
- **Effort**: 30 min - 1h
- **Priority**: 🟢 Low (nice-to-have)
- **Source**: Implementation feedback 4.3

### Barebones Sample Repo for Bootstrap Testing
- **Feature**: Create minimal Node/TS project with unfilled docs for bootstrap testing
- **Why**: todo-app already populated, need clean slate for realistic testing
- **Implementation**:
  - Create `examples/fresh-start/` (basic Express + TypeScript)
  - Add to CI/CD for automated bootstrap testing
  - Document in examples README
- **Effort**: 2-3h
- **Priority**: 🟢 Low (validation tool, not user-facing)
- **Source**: Implementation feedback 4.4, dogfooding report

### CLI Bootstrap Command (Layer 3 - Automation)
- **Feature**: `cortex-tms bootstrap --auto` for fully automated doc generation
- **Why**: Users who prefer one-command automation vs prompt-first approach
- **Implementation**:
  - Reuse `src/utils/llm-client.ts` for LLM calls
  - Add codebase analyzer with safety exclusions (.env, secrets, node_modules)
  - Interactive mode + dry-run
  - Cost estimation (~$0.15-0.25 per run)
- **Decision gate**: Only build if 60%+ of users successfully use prompt-first approach
- **Effort**: 16-20h
- **Priority**: ⏸️ Deferred (validate prompt-first approach first)
- **Source**: Original v2 strategy, deferred to v3.1+

### Safety Framing for User Communication
- **Context**: Safety rules are prompt-level (not code-enforced) in v3.0
- **Remember**: Frame as "high-confidence compliance" not "guaranteed safety"
- **Rationale**:
  - AI agents have built-in safety training
  - Prompt explicitly lists exclusions
  - But it's best-effort, not cryptographic guarantee
- **Action**: When discussing with users, emphasize:
  - "Likely to comply + we reinforce in prompt"
  - Not "guaranteed" (guarantees require Layer 3 CLI with hardcoded exclusions)
- **Source**: Implementation feedback 4.1

### Metrics Measurement Strategy
- **Context**: No telemetry layer in OSS CLI (by design)
- **Approach**: Measure indirectly via:
  - User anecdotes and community feedback
  - Self-reported usage surveys
  - GitHub discussions and issues
- **If adding opt-in telemetry later**: Track:
  - `cortex-tms prompt bootstrap` usage
  - Validator AI-DRAFT vs clean file counts
  - Time to remove AI-DRAFT markers (user self-report)
- **Source**: Implementation feedback 4.2

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

## 📊 Audit Findings Summary

### Audit History

Five comprehensive audits conducted during v2.6-v3.0 development:

1. **QCS Analysis** (Jan 21, 2026): Quality, Cost, Sustainability framework
2. **Viability Report** (Jan 21, 2026): Evidence-based code audit (found critical bugs)
3. **Analysis Report** (Jan 21, 2026): Architecture and market assessment
4. **Comparison Report** (Jan 21, 2026): Synthesis of all findings
5. **GPT-5 Repository Analysis** (Jan 24, 2026): External review
6. **Opus 4.5 Deep Analysis** (Jan 21, 2026): Comprehensive technical audit (analyzed v2.6.0)

### Progress Since Initial Audits (v2.6.0 → v3.0.0)

**What's Been Addressed**:
- ✅ Critical Bugs: All 3 BLOCKER bugs fixed in v2.6.1
- ✅ GitHub Action: Reusable workflow shipped in v3.0 (GPT5-REC-3)
- ✅ Prerelease Version Support: Fixed in v3.0 (TMS-272)
- ✅ 15-minute Onboarding: Improved to 10 minutes with Bootstrap feature (v3.0)
- ✅ Zero-drift Governance: `cortex-tms validate` exists and working
- ✅ Website Optimization: Performance improvements in v3.0 (TECH-1)

**Status**: ~50% of audit high-priority items completed. v3.0 release represents major maturity milestone.

### Remaining High-Value Opportunities

#### Category A: Technical Debt (Deferred to v3.2)
- **Error Handling**: Centralize error handling, remove `process.exit()` [AUDIT-1] → v3.2
- **Input Validation**: Add Zod validation for CLI inputs [AUDIT-2] → v3.2
- **Integration Tests**: E2E CLI workflow tests [AUDIT-3] → v3.2
- **Dependency Scanning**: Add `npm audit` to CI [AUDIT-4] → v3.2
- **Path Traversal Protection**: Validate template paths [AUDIT-5] → v3.2
- **Guardian Key Redaction**: Ensure API keys never exposed [AUDIT-6] → v3.2

**Status**: These items moved to dedicated v3.2 sprint (see v3.2 section above for details)

#### Category B: Strategic Features (High Priority Backlog)
- **Benchmark Suite**: **#1 credibility gap** - prove "3-5x faster" claim (all audits agree)
- **Pattern Library Marketplace**: Community templates for frameworks
- **Migration Assistant**: Automate brownfield project migration
- **Compliance Packages**: Pre-built validation rule sets (SOC2, GDPR)

### Consensus Findings (All Audits Agree)

✅ **Core Concept is Sound**: Tiered Memory System solves a real problem in AI development
✅ **Token/Cost Savings**: 40-60% context reduction is achievable and valuable
✅ **Sustainability Angle**: "Green Governance" positioning is unique and defensible
✅ **Continue Development**: All audits recommend continuing with strategic focus
✅ **Architecture is Strong**: Clean separation, good TypeScript practices
⚠️ **Benchmark Suite**: Remains #1 missing piece for credibility (unchanged since v2.6.0)

### Rejected/Deprioritized Audit Recommendations

**Low-value or premature items**:
- ❌ Hardcoded Strings / Localization: No i18n demand (Audit Section 3.6)
- ❌ Snapshot Tests: Brittle during active development (Audit Section 4.4)
- ❌ Monorepo Separation: Working fine at current scale (Audit Section 2.4)
- ❌ Core Package Extraction: Wait for second consumer (Audit Section 8)
- ❌ Cursor-Specific Optimizations: Low priority, IDE-agnostic by design (Audit Section 5)

**Rationale**: Focus on high-impact security/quality improvements first. These can be revisited if demand emerges.

### Revised Viability Score

**Before Audits** (Jan 21, 2026): 8.2/10 (internal assessment)
**After Initial Audits**: 7.2/10 (accounting for critical bugs)
**After v2.6.1 Fix**: 8.0/10 (bugs fixed)
**After v3.0 Release** (Jan 28, 2026): 8.5/10 (major features shipped, bootstrap onboarding, GitHub Action)
**Target After v3.1** (security hardening): 9.0/10
**Target After Benchmark Suite**: 9.5/10 (claims proven)

### Source Documents

All audit documents available in `/tmp/` directory:
- `tmp/cortex-tms-analysis-report-opus-28-01-2026.md` (Opus 4.5 Deep Analysis)
- Earlier audit reports from Jan 21-24, 2026

<!-- @cortex-tms-version 3.1.0 -->
