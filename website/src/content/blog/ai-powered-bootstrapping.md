---
title: 'From Zero Docs to AI-Ready in 10 Minutes'
description: 'After running cortex-tms init, users faced empty templates. We taught AI agents to bootstrap themselves.'
pubDate: 2026-01-27
author: 'Cortex TMS Team'
tags: ['ai', 'onboarding', 'bootstrapping', 'developer-experience']
heroImage: '/images/blog/ai-powered-bootstrapping.webp'
draft: false
---

When users install Cortex TMS and run `cortex-tms init`, they get a perfect documentation structure. Empty, but perfect.

And then they stare at it, wondering what to write.

This is the story of how we fixed that by making AI agents bootstrap themselves.

---

## The Problem: Empty Template Paralysis

**Context**: Cortex TMS v2.6 (January 2026). Users run `cortex-tms init`, get 5-7 documentation files with placeholder text like `[Project Name]` and `[System Description]`.

**The friction**:

```
$ cortex-tms init
✨ Success! Cortex TMS initialized.

Next Steps:
  1. Review NEXT-TASKS.md for active sprint tasks
  2. Update docs/core/ with your project details  ← User stops here
  3. Customize .github/copilot-instructions.md
```

**What actually happened** (based on support requests + analytics):

- 60% of users who ran `init` never filled in `ARCHITECTURE.md`
- Average time to first populated doc: 30-45 minutes (for those who completed it)
- Most common question: "What should I write in ARCHITECTURE.md?"
- Drop-off rate: ~40% of users abandoned after seeing empty templates

**The insight**: Users installed Cortex TMS specifically to work with AI agents. Why were we making them manually fill templates when they had Claude Code, Copilot, or Cursor already running?

---

## The Realization: The AI Is Already There

**Observation from user sessions**:

A user (let's call them Alex) installed Cortex TMS:

1. Ran `cortex-tms init` → got empty templates
2. Asked Claude Code: "Can you help me fill out ARCHITECTURE.md?"
3. Claude Code read the template, analyzed the codebase, wrote content
4. Alex copied it into the file

**What we noticed**: The AI agent was already doing the work. We just weren't making it easy.

**Key realization**: Users don't install Cortex TMS to get templates. They install it to give their AI agent a structured memory system. The AI agent IS the bootstrapping tool.

---

## The Broken Flow vs The Desired Flow

**Before (v2.6)**:

```
cortex-tms init
  ↓
Empty templates with placeholders
  ↓
User stares at [Project Name], [System Description]
  ↓
User manually researches what to write OR gives up
```

**After (v3.0)**:

```
cortex-tms init
  ↓
cortex-tms prompt bootstrap  (auto-copies to clipboard)
  ↓
User pastes into their AI agent
  ↓
AI analyzes codebase + populates docs as drafts
  ↓
User reviews + refines AI-generated content
  ↓
Project is AI-ready
```

---

## The Solution: Prompt-First Bootstrapping

We built a three-layer system. Layer 1 shipped first because it required zero infrastructure.

### Layer 1: The Bootstrap Prompt

A specialized prompt that guides any AI agent through the bootstrapping process:

```markdown
## bootstrap

You have just been added to a project that uses Cortex TMS for AI governance.
The documentation files exist but contain placeholder content.

**Your task**: Analyze this codebase and populate the TMS documentation files
as DRAFTS for human review.

**Step 1 - Understand the project**:
- Read package.json for tech stack
- Scan directory structure
- Read entry points (src/index.*, bin/*)

**Step 2 - Populate ARCHITECTURE.md**:
- Fill "Quick Context" with what the project does
- Fill "Component Map" with real components from the codebase
- Mark sections with: <!-- AI-DRAFT: Review before treating as canonical -->

[... steps 3-5 omitted for brevity ...]
```

**What makes it work**:

- **Specificity**: Not "document the project," but "fill these exact sections in this file"
- **Safety rules**: Skip `.env`, `node_modules/`, secret files
- **Draft markers**: All generated content marked `<!-- AI-DRAFT -->` for human review
- **File-by-file**: AI asks for confirmation before writing each file

### Layer 2: Smart Templates

We modified templates to include first-session awareness:

```markdown
# CLAUDE.md

## 🚀 First Session Setup
<!-- Remove this section after completing setup -->

If this is your first session with this project, run:
  cortex-tms prompt bootstrap

[... instructions ...]
```

**Result**: When an AI agent reads `CLAUDE.md` for the first time, it sees the setup instructions and can proactively suggest running bootstrap.

### Layer 3: Validation Intelligence

We enhanced `cortex-tms validate` to distinguish three completion states:

```typescript
// Before: Binary (placeholder exists = fail)
if (hasPlaceholder(file)) {
  return { status: 'error', message: 'Contains placeholders' };
}

// After: Three-tier detection
if (hasPlaceholder(file)) {
  return {
    status: 'error',
    message: 'Incomplete',
    hint: 'Run: cortex-tms prompt bootstrap'
  };
} else if (hasAIDraft(file)) {
  return {
    status: 'warning',
    message: 'AI-generated draft (needs review)',
    hint: 'Review and remove <!-- AI-DRAFT --> markers'
  };
} else {
  return {
    status: 'success',
    message: 'Complete and reviewed'
  };
}
```

**Validation output after bootstrap**:

```
$ cortex-tms validate --verbose

📋 Documentation Status:
  ⚠️  ARCHITECTURE.md: AI-DRAFT (3 sections need human review)
  ⚠️  PATTERNS.md: AI-DRAFT (5 sections need human review)
  ✅ CLAUDE.md: Reviewed

💡 ARCHITECTURE.md: Review drafts and remove <!-- AI-DRAFT --> markers once accepted.
```

---

## Real-World Example: Bootstrapping cortex-tms

We dogfooded this on our own codebase. Here's what happened:

**Starting state** (simulated fresh init):
- Empty `ARCHITECTURE.md` with placeholders
- Empty `PATTERNS.md`
- Default `CLAUDE.md`

**Bootstrap process** (measured):

1. Run `cortex-tms prompt bootstrap` → copied to clipboard (0:05)
2. Paste into Claude Code → AI reads the prompt (0:10)
3. Claude Code analyzes codebase:
   - Reads `package.json` → identifies TypeScript CLI project
   - Scans `src/` → finds command pattern, utility modules
   - Reads `bin/cortex-tms.js` → identifies entry point
   - Reads existing README → extracts project purpose
   - Time: ~2 minutes

4. Claude Code populates `ARCHITECTURE.md`:
   ```markdown
   ## 🎯 Quick Context
   <!-- AI-DRAFT: Review before treating as canonical -->
   - **What it does**: A CLI tool for managing AI-optimized documentation
   - **Who it's for**: Developers working with AI coding assistants
   - **Key constraint**: Must run offline, zero external dependencies

   ## 🗂️ Component Map
   <!-- AI-DRAFT -->
   | Component | Responsibility | Tech Stack |
   |:----------|:--------------|:-----------|
   | `src/commands/` | CLI command implementations | Commander.js |
   | `src/utils/validator.ts` | TMS health checks | TypeScript |
   | `src/utils/templates.ts` | Template copying engine | fs-extra |
   ...
   ```
   - Time: ~3 minutes

5. Claude Code customizes `CLAUDE.md`:
   - Updates CLI commands with real `package.json` scripts
   - Adds project-specific rules
   - Time: ~1 minute

6. Claude Code suggests initial tasks for `NEXT-TASKS.md`
   - Time: ~30 seconds

**Total time**: 7 minutes from init to populated drafts.

**Quality check**: We compared AI-generated content to our manually written docs. Accuracy: ~85% correct, 10% needed refinement, 5% was incorrect and needed rewriting.

**Key point**: 85% is good enough for a first draft. Manual writing from scratch would have taken 30-45 minutes.

---

## Agent Compatibility: Who This Works For

We tested the bootstrap prompt across different AI environments:

**Best experience** (full file read/write):
- ✅ Claude Code (CLI)
- ✅ Cursor
- ✅ Windsurf
- ✅ Codex CLI

**Good experience** (may need manual paste):
- ✅ GitHub Copilot Chat (VS Code extension)
- ✅ JetBrains AI Assistant

**Fallback** (AI composes content, user pastes manually):
- ⚠️ Claude.ai (web)
- ⚠️ ChatGPT (web)

**Why it works across agents**: The bootstrap prompt uses only standard capabilities (read files, analyze code, write markdown). No API-specific features required.

---

## What We Learned

### 1. Draft vs Ground Truth Framing Matters

We originally had AI-generated content without markers. Users didn't know what was AI-written vs human-reviewed.

**Before** (unmarked AI content):
- Users assumed AI content was canonical
- Errors in AI-generated docs propagated to code
- No clear signal for "needs human review"

**After** (with `<!-- AI-DRAFT -->` markers):
- Clear separation: draft vs reviewed
- Validator detects draft status
- Users know what to review

**Lesson**: AI-generated content should be clearly labeled until a human approves it.

### 2. Zero-Cost Beats Automated

We initially planned to build `cortex-tms bootstrap` as a CLI command that would use the Anthropic/OpenAI API to auto-generate docs.

**Why we didn't ship it**:
- Cost: $0.15-0.25 per run (user pays)
- Requires API key setup (friction)
- Doesn't work offline
- Limited to specific LLM providers

**Why prompt-first won**:
- Cost: $0 (uses user's existing AI session)
- Zero setup (works with any AI agent)
- Works offline (if agent runs locally)
- Universal compatibility

**Lesson**: When users already have the tool (AI agent), give them a workflow, not a new service.

### 3. Placeholders → Drafts → Reviewed (State Machine)

We used to treat documentation as binary (complete or incomplete). The AI-DRAFT state creates a helpful middle ground:

```
[Placeholder Text] → Error (file is incomplete)
    ↓
  Bootstrap runs
    ↓
<!-- AI-DRAFT --> → Warning (file needs review)
    ↓
  Human reviews & removes markers
    ↓
No markers → Success (file is canonical)
```

This state machine maps to the natural workflow:
1. AI generates → draft state
2. Human reviews → reviewed state

**Lesson**: Documentation has natural lifecycle stages. Honor them in tooling.

---

## Metrics: Did It Work?

We're measuring success across three metrics:

### 1. Time to First Populated Draft
- **Target**: < 10 minutes
- **Early results**: 7-12 minutes (sample size: internal testing + 3 beta users)
- **Baseline**: 30-45 minutes (manual writing, from pre-v3.0 data)

### 2. Completion Rate (% of inits that result in populated docs)
- **Target**: 60%+ (up from ~40%)
- **Early results**: Too early to measure (feature shipping in v3.0)
- **Will track**: 30 days post-launch

### 3. Bootstrap Adoption (% of users who try the prompt)
- **Target**: 40%+ of users who run `cortex-tms init`
- **Tracking method**: Post-init message includes bootstrap quick start, analytics will track prompt command usage

**Note**: These are early metrics. Will update this article with real data after 30-60 days in production.

---

## Implementation Details (For the Curious)

If you want to build something similar, here's what actually changed in the codebase:

### 1. Prompt Library (`templates/PROMPTS.md`)

Added 4 new prompts:
- `bootstrap` - Full onboarding workflow
- `populate-architecture` - Just ARCHITECTURE.md
- `discover-patterns` - Extract coding patterns
- `extract-rules` - Extract domain logic rules

**How it works**:
```bash
$ cortex-tms prompt bootstrap
# Displays prompt + auto-copies to clipboard
# User pastes into AI agent
```

### 2. Template Modifications

Added first-session awareness to `CLAUDE.md`:

```markdown
## 🚀 First Session Setup
<!-- Remove this section after completing setup -->

If this is your first session with this project, run:
  cortex-tms prompt bootstrap
```

Added setup detection to `copilot-instructions.md`:

```markdown
<!-- SETUP NOTE: If you see [placeholder] text above,
     run: cortex-tms prompt bootstrap -->
```

### 3. Validator Enhancement (`src/utils/validator.ts`)

New function `scanForAIDrafts()`:

```typescript
async function scanForAIDrafts(filePath: string):
  Promise<{ found: boolean; count: number }> {
  const content = await readFile(filePath, 'utf-8');
  const matches = content.match(/<!--\s*AI-DRAFT.*?-->/gi);
  return { found: !!matches, count: matches?.length ?? 0 };
}
```

Modified `validatePlaceholders()` to check both placeholders and AI-DRAFT markers with priority:
1. Placeholders → Error (incomplete)
2. AI-DRAFT markers → Warning (needs review)
3. Neither → Success (complete)

### 4. Post-Init Message

Changed from:
```
Next Steps:
  1. Review NEXT-TASKS.md
  2. Update docs/core/ with your project details
```

To:
```
🚀 Quick Start (choose one):

  Option A - With your AI agent (recommended):
    1. Open your AI tool (Claude Code, Copilot, Cursor, etc.)
    2. Run: cortex-tms prompt bootstrap
    3. Paste the prompt - your AI will populate docs as drafts

  Option B - Manual setup:
    1. Review NEXT-TASKS.md
    2. Update docs/core/ with your project details
```

### 5. Tutorial Addition

Added Lesson 6: "AI-Powered Bootstrapping" to `cortex-tms tutorial` command.

**Total implementation effort**: ~14 hours (including tests + article)

---

## What's Next: CLI Bootstrap (v2)

The prompt-first approach ships in v3.0. Once we validate it with real users, we may build the automated version:

**Potential v3.1 feature**: `cortex-tms bootstrap --auto`

```bash
$ cortex-tms bootstrap --auto
🔍 Analyzing codebase...
📝 Populating ARCHITECTURE.md... ✓
📝 Customizing CLAUDE.md... ✓
📝 Generating PATTERNS.md... ✓

✨ Bootstrap complete! Run 'cortex-tms validate' to review.

💡 AI-generated content marked with <!-- AI-DRAFT -->
   Review and remove markers once accepted.

Cost: $0.18 (using Anthropic API)
```

**Why we're waiting**:
- Want to validate prompt-first approach works first
- Need user feedback on quality/accuracy
- Will only build if there's demand for automation

**Decision point**: If 60%+ of users successfully use the prompt, we may not need the CLI version at all.

---

## Try It Yourself

**If you have Cortex TMS installed**:

```bash
# 1. Initialize a project (or use an existing one)
cortex-tms init --scope standard

# 2. Get the bootstrap prompt
cortex-tms prompt bootstrap

# 3. Paste into your AI agent (Claude Code, Copilot, Cursor, etc.)
# Your AI will analyze the codebase and populate documentation

# 4. Review the generated content
cortex-tms validate --verbose

# 5. Remove <!-- AI-DRAFT --> markers once you've reviewed
```

**If you don't have Cortex TMS yet**:

```bash
npm install -g cortex-tms
# or
pnpm add -g cortex-tms
```

---

## Key Takeaways

1. **Users already have the tool** → We made it easier to use their AI agent, not replace it

2. **Prompt-first beats API-first** → Zero cost, universal compatibility, works offline

3. **Draft markers matter** → AI content needs clear labels until human-reviewed

4. **State machines > binary checks** → Placeholder → Draft → Reviewed maps to reality

5. **Dogfood relentlessly** → We used the bootstrap prompt on cortex-tms itself to validate UX

---

## Feedback Welcome

This feature ships in Cortex TMS v3.0 (February 2026). We'd love to hear:

- Does the bootstrap prompt work with your AI agent?
- What accuracy do you see in AI-generated content?
- Would you pay $0.15-0.25 for a fully automated version?

Find us on [GitHub](https://github.com/cortex-tms/cortex-tms) or reach out via issues.

---

**Update Log**:
- 2026-01-27: Initial release (v3.0 feature announcement)
- TBD: Will add real metrics after 30 days in production
