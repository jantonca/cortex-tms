# AI Collaboration Policy

**Purpose**: Define standards for AI-assisted development in Cortex TMS to ensure quality, transparency, and accountability.

**Scope**: This policy applies to all code, documentation, and infrastructure changes in the Cortex TMS project.

**Last Updated**: 2026-01-20

---

## 🎯 Core Principles

1. **Human-in-the-Loop (HITL)**: AI assists, humans decide and approve
2. **Transparency**: All AI involvement explicitly documented
3. **Accountability**: Humans remain responsible for all merged code
4. **Quality**: Professional standards maintained despite AI acceleration
5. **Learning**: AI limitations documented and learned from

---

## 🔄 Human-in-the-Loop (HITL) Workflow

**Rule**: Every code change must pass through this 5-step workflow.

### Step 1: Human Direction (REQUIRED)

**Who**: Human maintainer
**What**: Provide clear direction on what to build and why

**Must Include**:
- Feature requirements or bug description
- Business context and user value
- Priority and scope boundaries
- Success criteria

**AI Cannot**:
- Decide product direction
- Prioritize features independently
- Make architectural decisions without human approval
- Determine business requirements

**Example**:
```markdown
✅ Good: "Add Guardian CLI review command that audits code against
PATTERNS.md using OpenAI/Anthropic APIs. User provides their own API
key (BYOK). Target 70%+ accuracy on architectural violations."

❌ Bad: "Make the code better" (too vague)
❌ Bad: "Add features you think would be good" (AI deciding direction)
```

---

### Step 2: AI Implementation (AI EXECUTES)

**Who**: AI agent (Claude Code, GitHub Copilot, etc.)
**What**: Write code following documented patterns

**AI Must**:
- Follow patterns in `docs/core/PATTERNS.md`
- Adhere to domain logic in `docs/core/DOMAIN-LOGIC.md`
- Follow Git standards in `docs/core/GIT-STANDARDS.md`
- Write tests for new functionality
- Update documentation alongside code

**AI Tools Used**:
- **Claude Code**: Primary implementation tool
- **GitHub Copilot**: Code completion and suggestions
- **Guardian CLI**: Self-review (dogfooding)

**Quality Checks (AI Self-Review)**:
1. Code follows documented patterns
2. Tests written and passing
3. Documentation updated
4. No security vulnerabilities introduced
5. Performance considerations addressed

---

### Step 3: Human Review (REQUIRED)

**Who**: Human maintainer
**What**: Review all code before merge

**Review Checklist**:
- [ ] Code solves the stated problem
- [ ] Implementation follows architectural patterns
- [ ] Tests are comprehensive and meaningful
- [ ] Documentation is accurate and complete
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] Code is maintainable

**Reject Criteria**:
- Doesn't meet requirements
- Violates architectural patterns
- Missing or inadequate tests
- Security concerns
- Performance regressions
- Poor maintainability

**Process**:
```bash
# Human reviews code in IDE or GitHub PR
# If changes needed:
→ Provide feedback to AI agent
→ AI implements changes
→ Loop back to Step 3

# If approved:
→ Proceed to Step 4
```

---

### Step 4: AI-Assisted Audit (OPTIONAL)

**Who**: Guardian CLI (AI-powered review tool)
**What**: Automated pattern compliance check

**Command**:
```bash
cortex-tms review src/commands/new-feature.ts
```

**What Guardian Checks**:
- Pattern violations against `PATTERNS.md`
- Domain logic violations against `DOMAIN-LOGIC.md`
- Architectural consistency
- Code structure and organization

**Human Decision Required**:
- Guardian findings are suggestions, not blockers
- Human decides whether to address findings
- Known false positives can be ignored
- Target: 70%+ accuracy (measured and improved over time)

---

### Step 5: Automated Testing (REQUIRED)

**Who**: CI/CD system
**What**: All tests must pass before merge

**Test Requirements**:
- Unit tests for new functions/classes
- Integration tests for CLI commands
- End-to-end tests for user workflows
- All existing tests continue passing

**Current Test Suite**:
- 74 tests across 5 test suites
- 100% pass rate required for merge
- No skipped or disabled tests without documentation

**Test Execution**:
```bash
# Run full test suite
npm test

# Run specific suite
npm test -- llm-client.test.ts
```

**Failure Protocol**:
1. Tests fail → Merge blocked
2. Investigate failure (human + AI)
3. Fix code or fix test (whichever is wrong)
4. Re-run full suite
5. Repeat until all pass

---

## 📝 Authorship Metadata Standards

**Rule**: All AI-assisted commits MUST include co-authorship metadata.

### Commit Message Format

**Template**:
```bash
git commit -m "$(cat <<'EOF'
[type]([scope]): [subject]

[Body - explain WHAT changed and WHY]

[Footer - breaking changes, issue references]

Co-Authored-By: [AI Model Name] <[AI Email]>
EOF
)"
```

### Co-Author Tags

**Current AI Agents**:
```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
Co-Authored-By: GitHub Copilot <noreply@github.com>
```

**Usage Rules**:
- Use Claude Sonnet 4.5 tag for Claude Code implementations
- Use GitHub Copilot tag for Copilot-assisted code
- If both used substantially, include both tags
- If AI only provided minor suggestions (<10% of change), tag is optional

### Example Commits

**✅ Full Feature Implementation**:
```bash
git commit -m "$(cat <<'EOF'
feat(cli): add Guardian review command (TMS-283a)

Implement cortex-tms review <file> command for AI-powered code review.
Features:
- BYOK support (OpenAI/Anthropic)
- Pattern violation detection
- Domain logic checking
- Structured violation reports

Includes 21 new tests (9 command tests, 12 LLM client tests).

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

**✅ Bug Fix**:
```bash
git commit -m "$(cat <<'EOF'
fix(validation): handle missing PATTERNS.md gracefully

Prevent crash when PATTERNS.md doesn't exist. Now shows helpful
error message directing user to run 'cortex-tms init'.

Closes #42

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

**✅ Documentation Only**:
```bash
git commit -m "$(cat <<'EOF'
docs: add Guardian CLI usage guide

Create comprehensive reference documentation for cortex-tms review
command covering setup, usage, CI/CD integration, and troubleshooting.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

**❌ Missing Co-Author (Policy Violation)**:
```bash
# This violates policy if AI significantly contributed
git commit -m "feat: add new feature"
# Missing Co-Authored-By tag!
```

---

## ✅ Quality Standards

**Rule**: AI acceleration does not reduce quality expectations.

### Test Coverage Requirements

**Critical Paths** (100% coverage required):
- All CLI commands
- Validation logic
- Migration systems
- Schema parsing
- File operations

**Non-Critical Paths** (Best effort):
- Error message formatting
- Logging output
- CLI help text generation

**Current Metrics** (as of v2.7.0):
- 74 tests across 5 suites
- 100% pass rate
- 0 skipped tests
- 0 critical bugs in production

### Code Quality Standards

**All code must**:
- Follow TypeScript strict mode
- Use consistent formatting (Prettier)
- Pass linting (ESLint)
- Include JSDoc comments for public APIs
- Handle errors gracefully
- Validate inputs at boundaries

**Security Requirements**:
- No hardcoded secrets
- All API keys via environment variables
- Input validation on all user data
- No command injection vulnerabilities
- Dependencies kept up-to-date

### Performance Standards

**CLI Commands**:
- `cortex-tms status`: <500ms
- `cortex-tms validate`: <2s for standard project
- `cortex-tms migrate`: <5s for standard migration
- `cortex-tms review`: <30s per file (dependent on LLM API)

**Context Budget**:
- `NEXT-TASKS.md`: Max 200 lines (strictly enforced)
- `PATTERNS.md`: Max 500 lines
- `DOMAIN-LOGIC.md`: Max 400 lines

### Documentation Standards

**All features must include**:
- CLI reference documentation (website/src/content/docs/reference/cli/)
- Usage examples
- Troubleshooting section
- Integration guide (if applicable)

**Documentation-First Workflow**:
1. Document feature requirements in `NEXT-TASKS.md`
2. Document patterns in `docs/core/PATTERNS.md`
3. Implement feature following documented patterns
4. Update website documentation
5. Archive completed tasks

---

## 🔍 Transparency Commitments

**Rule**: AI involvement is never hidden from users or community.

### Public Transparency

**GitHub Repository**:
- All code open source (MIT license)
- Commit history shows AI co-authorship
- Issues and PRs are public
- Roadmap visible in `NEXT-TASKS.md`

**Documentation**:
- AI collaboration documented in About page
- Known limitations in Known Issues
- This policy publicly available
- Real metrics shared (not inflated)

**Community Communication**:
- Blog posts explain AI workflow
- ADRs document architectural decisions
- Sprint retrospectives archived
- Mistakes documented and learned from

### Statistics Tracking

**Measured Metrics** (updated quarterly):
- Percentage of commits with AI co-authorship (~80%)
- Percentage of commits with human review (100%)
- Test pass rate (100%)
- Critical bugs in production (0 target)
- Guardian accuracy rate (target 70%+)

**Reporting**:
- Metrics published in About page
- Updated with each minor version release
- No cherry-picking or selective reporting
- Honest about limitations and failures

---

## 🚫 What AI Cannot Do

**Explicitly Prohibited Actions**:

### Product & Business
- ❌ Decide product roadmap
- ❌ Prioritize features independently
- ❌ Make monetization decisions
- ❌ Determine pricing strategy
- ❌ Choose target markets or users

### Technical Architecture
- ❌ Make breaking changes without human approval
- ❌ Change core architecture patterns
- ❌ Select new dependencies/frameworks independently
- ❌ Modify security policies
- ❌ Change deployment infrastructure

### Community & Legal
- ❌ Respond to security vulnerabilities
- ❌ Make legal commitments
- ❌ Represent project in official capacity
- ❌ Merge code without human review
- ❌ Publish releases independently

### Code Quality Compromises
- ❌ Skip tests because "AI wrote it"
- ❌ Disable linting rules
- ❌ Commit code that doesn't build
- ❌ Merge failing tests
- ❌ Hide errors or warnings

---

## ✅ What AI Can Do

**Approved AI Activities**:

### Implementation
- ✅ Write code following documented patterns
- ✅ Implement features per human specification
- ✅ Write tests for new functionality
- ✅ Update documentation alongside code
- ✅ Refactor code for readability
- ✅ Fix bugs based on human diagnosis

### Analysis & Review
- ✅ Audit code against documented patterns
- ✅ Suggest performance improvements
- ✅ Identify potential bugs
- ✅ Check for security vulnerabilities
- ✅ Review test coverage

### Documentation
- ✅ Write technical documentation
- ✅ Create usage examples
- ✅ Generate API reference docs
- ✅ Draft blog posts (with human editing)
- ✅ Update changelog entries

### Automation
- ✅ Generate boilerplate code
- ✅ Create test fixtures
- ✅ Format code consistently
- ✅ Update version numbers
- ✅ Sync truth files (README, CHANGELOG, etc.)

---

## 🔄 Review & Approval Process

### For Standard Changes

**Process**:
1. AI implements on feature branch
2. Human reviews code
3. Guardian audits (optional)
4. Tests run automatically
5. Human approves and merges
6. Branch cleanup (mandatory)

**Timeline**:
- Small changes (<100 lines): Same day review
- Medium changes (100-500 lines): Within 1-2 days
- Large changes (>500 lines): Within 1 week

### For Breaking Changes

**Additional Requirements**:
- Document in ADR (Architecture Decision Record)
- Migration guide provided
- Deprecation warnings (if applicable)
- Community notification (if public API)
- Version bump follows semver

**Example**:
```markdown
# ADR-023: Change validation CLI to use strict mode by default

**Status**: Proposed
**Deciders**: Human maintainer
**Date**: 2026-01-20

## Context
Current validation is permissive by default...

## Decision
Make --strict the default, add --lenient flag...

## Consequences
Breaking change for users expecting permissive validation...
```

---

## 📊 Metrics & Monitoring

### Tracked Metrics

**Code Quality**:
- Test pass rate (target: 100%)
- Test coverage on critical paths (target: 100%)
- Linting pass rate (target: 100%)
- Build success rate (target: 100%)

**AI Collaboration**:
- Commits with AI co-authorship (~80%)
- Commits with human review (100%)
- Guardian accuracy rate (target: 70%+)
- False positive rate for Guardian (<30%)

**Performance**:
- CLI command response times
- Context budget compliance
- Build times
- Test suite execution time

**Community**:
- GitHub stars
- NPM downloads
- Issue response time
- PR merge time

### Review Cadence

**Weekly**:
- Review test pass rates
- Check build status
- Monitor issue queue

**Monthly** (Sprint Retrospective):
- Review AI collaboration metrics
- Analyze Guardian accuracy
- Document learnings in archive

**Quarterly**:
- Update statistics in About page
- Review and update this policy
- Publish blog post with metrics

---

## 🎓 Learning & Iteration

### Documenting Learnings

**When Things Go Wrong**:
1. Document in Known Issues immediately
2. Add to `NEXT-TASKS.md` if fix needed
3. Capture learning in sprint retrospective
4. Update this policy if systemic issue

**Example Learning**:
```markdown
## Known Issue: MDX Validation Workflow

**Problem**: MDX syntax errors pass through pre-commit validation

**Why**: Pre-commit validates Git protocol, not builds (by design)

**Impact**: Errors caught during preview (~2 min delay)

**Decision**: Document, don't over-engineer. Fast iteration > perfect automation

**Review Date**: After v2.7 (Feb 2026)
```

### Policy Updates

**This policy is living documentation**:
- Updated as we learn
- Version controlled in Git
- Changes require human approval
- Community can suggest improvements

**Update Triggers**:
- New AI tools adopted
- Quality issues discovered
- Community feedback received
- Industry best practices evolve

---

## 📚 Related Documentation

- `docs/core/PATTERNS.md` - Implementation patterns AI must follow
- `docs/core/DOMAIN-LOGIC.md` - Business rules AI must enforce
- `docs/core/GIT-STANDARDS.md` - Git workflow standards
- `website/src/content/docs/community/about.mdx` - Public transparency page
- `website/src/content/docs/community/known-issues.mdx` - Known limitations

---

## 📞 Questions & Feedback

**Have questions about this policy?**
- Open an issue: [GitHub Issues](https://github.com/cortex-tms/cortex-tms/issues)
- Start a discussion: [GitHub Discussions](https://github.com/cortex-tms/cortex-tms/discussions)

**Want to suggest improvements?**
- This policy is open source - submit a PR
- All policy changes require human maintainer approval

---

<!-- @cortex-tms-version 2.7.0 -->
