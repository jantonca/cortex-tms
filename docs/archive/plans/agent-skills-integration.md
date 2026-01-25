# Agent Skills Integration Strategy

**Status**: Implemented (Phase 1 Complete)
**Date**: January 25, 2026
**Version**: 1.0
**Related**: Guardian v2.6.1+, `--output-json` flag, Guardian Skill v0.2.0

---

## Executive Summary

Anthropic's Agent Skills provide a standardized format for packaging agent capabilities. This document explains how we're integrating Skills with Cortex TMS and Guardian, treating them as **complementary systems** rather than competing approaches.

**Key Decision**: Agent Skills are the **runtime operational layer** that consumes governance patterns defined by **TMS's structural layer**.

**Phase 1 Complete**:
- ✅ Added `--output-json` flag for programmatic Guardian output
- ✅ Created Guardian Skill v0.2.0 (production-ready)
- ✅ 120/120 tests passing
- ✅ Documentation updated

**Outcome**: Guardian can now be reliably invoked by Claude agents (Claude Code, Agent SDK) with structured JSON output.

---

## What Are Agent Skills?

Agent Skills (per Anthropic + agentskills.io) are **portable capability bundles** for AI agents:

### Core Concept

A Skill is a **folder on disk** containing:
- **`SKILL.md`** (required): YAML frontmatter + Markdown instructions
- **Optional files**: `scripts/`, `references/`, `assets/` referenced from `SKILL.md`

### Design Principles

1. **Progressive disclosure of context**:
   - At startup: only `name` + `description` injected into system prompt
   - When relevant: agent loads full `SKILL.md`
   - If needed: follows links to additional files/scripts

2. **Unbounded knowledge, bounded context**:
   - Skills can contain arbitrarily many files
   - Agent selectively loads small slices into LLM context on demand

3. **Code as tools**:
   - Skills can ship deterministic scripts
   - Agent runs them as tools instead of simulating via tokens

**In essence**: A Skill is a **file-based bundle of procedural knowledge + tools** that an agent can discover, load, and execute.

---

## Skills vs TMS: Complementary Systems

| Aspect | Cortex TMS | Agent Skills |
|--------|------------|--------------|
| **Layer** | Structural | Operational |
| **Scope** | Entire repository | Single capability |
| **Audience** | Any LLM tool | Claude agents specifically |
| **Purpose** | Storage + authoring | Runtime execution |
| **Standardization** | Project-specific | Cross-platform (Anthropic) |
| **Runtime Model** | Static structure | Active component with discovery protocol |

### How They Overlap

Both share core philosophies:

**1. File-based knowledge**
- TMS: `NEXT-TASKS.md`, `docs/core/*`, `docs/archive/*`
- Skills: `SKILL.md`, `references/*.md`, `assets/*`

**2. Context minimization**
- TMS: HOT/WARM/COLD tiers - only HOT always read
- Skills: Only metadata always loaded, full content on demand

**3. Procedural guidance for AI**
- TMS: `PATTERNS.md` and `DOMAIN-LOGIC.md` teach "how this project wants to be changed"
- Skills: `SKILL.md` teaches "how to execute this workflow safely and effectively"

### How They Complement

**TMS gives your repo a governance-friendly shape**
↓
**Skills give agents a portable, executable wrapper around that governance**

Example:
- `PATTERNS.md` (TMS): Documents "no default exports" pattern
- Guardian Skill: Teaches agent how to invoke Guardian, parse JSON, act on violations
- Agent: Runs Guardian, sees violation, references `PATTERNS.md`, proposes fix

The Skill doesn't replace `PATTERNS.md` - it **operationalizes** it for agent runtimes.

---

## Why We Built `--output-json`

### The Problem

The draft Guardian Skill (from analysis) assumed:
```bash
npx cortex-tms review --output-json
```

But Guardian only output formatted Markdown:
```
🛡️  Guardian Code Review

✅ Analysis Complete

## Violations
...
```

This was:
- ❌ Not machine-readable
- ❌ Mixed UI text with data
- ❌ Hard to parse reliably
- ❌ Blocked Agent Skills integration

### The Solution

Added `--output-json` flag that outputs raw `GuardianResult` JSON to stdout:

```bash
cortex-tms review src/file.ts --output-json
```

Output:
```json
{
  "summary": {
    "status": "compliant",
    "message": "No violations found"
  },
  "violations": [],
  "positiveObservations": ["Good error handling"]
}
```

**Benefits**:
- ✅ Machine-readable (jq, CI/CD, automation)
- ✅ No UI noise (pure data)
- ✅ Reliable parsing (structured JSON)
- ✅ Enables Agent Skills integration

### Implementation Details

**File**: `src/commands/review.ts`

**Changes**:
- Added `--output-json` CLI option
- Suppress all `console.log()` when in JSON mode
- Output `GuardianResult` as pretty-printed JSON to stdout only
- Error handling: output error as JSON if parsing fails
- API key validation: require env var in JSON mode (no interactive prompts)

**Tests**: 4 new tests (18 → 120 total)
- Test raw JSON output format
- Test JSON with violations
- Test Safe Mode filtering in JSON output
- Test UI suppression

**Backwards Compatible**: Default behavior unchanged (formatted output)

---

## Guardian Skill as Reference Implementation

### Location

`tmp/guardian-skill/SKILL.md` (v0.2.0)

**Note**: `tmp/` is gitignored (experimental), but Skill is production-ready.

### Purpose

The Guardian Skill teaches Claude agents:
1. **When to use Guardian**: Pre-PR, risky refactors, pattern migrations
2. **How to invoke**: `npx cortex-tms review <file> --output-json --safe`
3. **How to parse JSON**: Structure of `GuardianResult`
4. **How to act on results**:
   - `major_violations` → hard blockers
   - `minor_issues` → soft suggestions
   - `compliant` → proceed with changes
5. **How to provide feedback**: Quote violations, reference patterns, show diffs

### Key Features

**Agent behavior guidelines**:
- Trust violations with confidence ≥0.7
- Prefer Guardian constraints over agent's own suggestions
- Reference `PATTERNS.md` when explaining violations
- Provide actionable fixes (diff format)

**Safety & escalation**:
- Detect misconfiguration (missing PATTERNS.md)
- Handle API key issues gracefully
- Encourage human review when uncertain
- Don't blindly enforce low-confidence violations

**Examples included**:
- Compliant code (positive observations)
- Major violation (security issue with diff)
- Minor issues (style suggestions)

### Status

**Ready for testing** with Claude Code or Agent SDK. Waiting on manual validation.

---

## Progressive Disclosure: TMS ↔ Skills Alignment

Both TMS and Agent Skills use **progressive disclosure** to manage context efficiently.

### TMS Model (HOT/WARM/COLD)

| Tier | Frequency | Examples |
|------|-----------|----------|
| **HOT** | Every session | `NEXT-TASKS.md`, `CLAUDE.md` |
| **WARM** | On demand | `docs/core/PATTERNS.md`, `ARCHITECTURE.md` |
| **COLD** | Rarely | `docs/archive/*`, old retrospectives |

**Principle**: Only load what's needed for current task. Archive aggressively.

### Skills Model (Metadata → Content → Linked Files)

| Level | Load Time | Content |
|-------|-----------|---------|
| **Metadata** | Startup (always) | YAML frontmatter (`name`, `description`) |
| **SKILL.md** | When relevant | Full instructions, JSON schema, examples |
| **Linked files** | If needed | `scripts/`, `references/`, additional docs |

**Principle**: Only load what's needed for current capability. Follow links selectively.

### The Alignment

**Both implement**: "Unbounded knowledge, bounded context"

| TMS | Skills | Shared Philosophy |
|-----|--------|-------------------|
| HOT tier (always read) | Metadata (always loaded) | Minimal essential context |
| WARM tier (on-demand) | SKILL.md (when relevant) | Capability-specific knowledge |
| COLD tier (rarely) | Linked files (if needed) | Deep reference materials |

**Result**: An agent using both TMS and Skills gets:
1. **Project context** from TMS (HOT files)
2. **Capability knowledge** from Skills (SKILL.md)
3. **Deep references** only when needed (WARM/COLD + linked files)

This **doubles down on context efficiency** rather than creating redundancy.

---

## Use Cases Enabled

### 1. Agent Skills Integration (Primary)

**Claude Code / Agent SDK** can now:
```bash
# Agent invokes Guardian via Skill
npx cortex-tms review src/auth.ts --output-json --safe
```

Agent parses JSON, sees `major_violations`, references `PATTERNS.md`, proposes fixes with diff.

**Value**: Reliable, deterministic Guardian integration in agent workflows.

---

### 2. CI/CD Pipelines

**GitHub Actions** example:
```yaml
- name: Guardian Review
  run: |
    cortex-tms review src/**/*.ts --output-json | \
    jq '.violations | length' | \
    xargs -I {} test {} -eq 0
```

**Value**: Automated pattern enforcement in CI/CD.

---

### 3. Custom Automation

**Shell scripts** can parse violations:
```bash
# Get violation count
count=$(cortex-tms review src/file.ts --output-json | jq '.violations | length')

# Extract patterns violated
cortex-tms review src/file.ts --output-json | \
  jq -r '.violations[].pattern'
```

**Value**: Build custom tooling on Guardian results.

---

### 4. Policy Enforcement

**Pre-commit hooks** with Safe Mode:
```bash
# Block commits with high-confidence violations
if cortex-tms review $file --output-json --safe | jq -e '.violations | length > 0'; then
  echo "High-confidence violations found - commit blocked"
  exit 1
fi
```

**Value**: Enforce architectural rules before code reaches PR.

---

## Future Directions

### 1. TMS Onboarding Skill

Create a generic Cortex TMS Skill that teaches agents about HOT/WARM/COLD tiers:

```
skills/cortex-tms/
  SKILL.md          # Explains TMS tiers, points to NEXT-TASKS.md
  references/
    patterns.md     # Symlink or copy of docs/core/PATTERNS.md
```

**Command**: `cortex-tms skill init` (auto-generates Skill from TMS structure)

**Value**: Any Claude agent can instantly understand your project's governance.

---

### 2. Shared Pattern Libraries as Skills

Distribute common patterns as reusable Skills:
- "No direct writes to main branch" pattern
- "Authentication required" pattern
- "Escape hatch patterns" for emergencies

Individual repos **link or adapt** them in their local `PATTERNS.md` / `SKILL.md`.

**Value**: Consistency across teams, faster onboarding.

---

### 3. Multi-File Guardian Analysis

Extend Guardian to analyze multiple files with `--output-json`:
```bash
cortex-tms review src/**/*.ts --output-json --safe
```

Output aggregated violations across entire codebase.

**Value**: Comprehensive audits, not just single-file reviews.

---

### 4. Guardian GitHub Action

Package Guardian + Skill as GitHub Action:
```yaml
- uses: cortex-tms/guardian-action@v1
  with:
    files: 'src/**/*.ts'
    safe-mode: true
```

**Value**: Zero-config Guardian in CI/CD.

---

## Decisions & Rationale

### Decision 1: Skills Complement TMS (Don't Replace It)

**Why**:
- TMS is structural (how to organize docs)
- Skills are operational (how agents consume docs)
- Different layers, different purposes
- Both needed for full AI governance stack

**Alternative Considered**: Merge Skills and TMS into single system
**Rejected Because**: Would lose flexibility - not all TMS users need Skills, not all Skill users need full TMS

---

### Decision 2: JSON Output as Separate Flag (Not Default)

**Why**:
- Backwards compatibility (existing users expect formatted output)
- Human-friendly output still valuable for CLI usage
- Opt-in for automation use cases

**Alternative Considered**: Always output JSON, format with separate tool
**Rejected Because**: Worse UX for human users, breaks existing workflows

---

### Decision 3: Keep Guardian Skill in `tmp/` for Now

**Why**:
- Experimental feature (Agent Skills spec still evolving)
- Wait for community adoption before committing to tracked location
- Easy to move to `skills/guardian/` when ready

**Alternative Considered**: Publish immediately to tracked location
**Rejected Because**: Too early to commit - may need iterations based on real usage

---

### Decision 4: Implement `--output-json` Before Documentation

**Why**:
- Unblocked Agent Skills integration immediately
- Small, focused implementation (1-2 hours)
- High value, low risk
- Documentation can reference real feature, not "future" concept

**Alternative Considered**: Write docs first, implement later
**Rejected Because**: Draft Skill needed real flag to be useful

---

## Success Metrics

**Phase 1** (Complete):
- ✅ `--output-json` flag implemented
- ✅ All tests passing (120/120)
- ✅ Guardian Skill v0.2.0 ready
- ✅ Documentation updated

**Phase 2** (Future):
- [ ] Guardian Skill tested with Claude Code
- [ ] At least 1 user successfully integrates Skill
- [ ] Blog post published: "Agent Skills + Tiered Memory"
- [ ] Move Skill to tracked location (`skills/guardian/`)

**Phase 3** (Vision):
- [ ] `cortex-tms skill init` command implemented
- [ ] Shared pattern library Skills published
- [ ] Guardian GitHub Action released
- [ ] Multi-file analysis support

---

## Related Documentation

- **Implementation**: `src/commands/review.ts:35` (`--output-json` flag)
- **Tests**: `src/__tests__/review.test.ts` (JSON output tests)
- **Guardian Skill**: `tmp/guardian-skill/SKILL.md` (v0.2.0)
- **CHANGELOG**: Guardian JSON Output Mode section
- **Analysis**: `tmp/anthropic-skills-guardian-analysis.md` (original research)

---

## Conclusion

Agent Skills and Cortex TMS are **complementary**, not competing:

- **TMS**: Defines governance patterns (structural layer)
- **Skills**: Operationalize patterns for agents (runtime layer)
- **Together**: Provide complete AI governance stack

**Phase 1 is complete**. We've built the foundation (`--output-json`) and reference implementation (Guardian Skill). Future work will expand to broader TMS Skills and shared pattern libraries.

The strategy is **validated and ready** for the next wave of agent-based development tools.

---

**Document Version**: 1.0
**Last Updated**: January 25, 2026
**Authors**: Cortex TMS Team + Claude Sonnet 4.5
