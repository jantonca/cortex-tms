---
title: "Our Approach to the AI PR Problem: Learning from tldraw's Experience"
description: "tldraw paused external contributions due to AI-generated PRs. Here's our early experiment with pattern-based code review to address this challenge."
pubDate: 2026-01-20
author: "Cortex TMS Team"
tags: ["ai", "open-source", "guardian", "code-review"]
draft: false
---

**tldraw**, a popular React drawing library, recently announced they're [pausing external contributions](https://github.com/tldraw/tldraw/issues/7695) due to challenges with AI-generated pull requests.

> "Like many other open-source projects on GitHub, tldraw has recently seen a significant increase in contributions generated entirely by AI tools. While some of these pull requests are formally correct, most suffer from incomplete or misleading context, misunderstanding of the codebase, and little to no follow-up engagement from their authors."
>
> — [tldraw Issue #7695](https://github.com/tldraw/tldraw/issues/7695)

While we don't have comprehensive data on how widespread this issue is, tldraw's experience resonates with challenges we've observed in our own project and heard about anecdotally from other maintainers.

---

## The "AI PR Tsunami" Problem

Here's what's happening:

1. **Developer uses Claude Code or GitHub Copilot** to implement a feature
2. **AI writes code that compiles and passes basic tests**
3. **PR gets submitted** with confidence ("AI said it's good!")
4. **Maintainer reviews and finds**:
   - Pattern violations (doesn't match existing conventions)
   - Architectural drift (solves problem incorrectly for this codebase)
   - Missing context (no ADR, no documentation update)
   - Incomplete implementation (edge cases ignored)

Sound familiar?

The problem isn't AI. **The problem is AI doesn't know YOUR architectural decisions.**

---

## Why This Happens: The Context Gap

AI coding assistants are phenomenal at:
- ✅ Writing syntactically correct code
- ✅ Implementing well-known algorithms
- ✅ Generating boilerplate
- ✅ Suggesting completions based on immediate context

But they're terrible at:
- ❌ Understanding your project's architectural philosophy
- ❌ Following established patterns you've codified
- ❌ Remembering decisions from ADRs written 6 months ago
- ❌ Knowing when to break rules (and when not to)

**Example**: Your team decided to use React Query for data fetching (documented in `docs/decisions/003-use-react-query.md`). AI suggests a custom `useEffect` hook because it doesn't know about that decision.

Result? **Architectural drift.**

Multiply this by 10 contributors using AI tools, and you get the "tsunami."

---

## Common Approaches (And Their Challenges)

Teams are trying different approaches:
1. **More human code review** → Can lead to maintainer burnout
2. **Stricter PR templates** → Mixed results with compliance
3. **Lengthy contribution guides** → AI tools may not reference them
4. **Closing external contributions** → Reduces community involvement (tldraw's choice)

**The challenge**: Current AI coding tools don't automatically incorporate project-specific architectural context.

---

## Our Experiment: Pattern-Based Review

We're testing an idea: what if there was a tool that could:
- Read your documented architectural decisions
- Check code against your documented patterns
- Flag potential violations before submitting PRs
- Reference your project's unique conventions

That's what we're building with **Guardian**. It's early, and we're learning as we go.

---

## Meet Guardian: AI-Powered Code Review

Guardian is Cortex TMS's new CLI tool that audits code against your project's documented patterns and architectural decisions.

### How It Works

**Step 1**: Document your patterns (you should already be doing this)

```markdown
# docs/core/PATTERNS.md

## Data Fetching Pattern

❌ Don't: Custom useEffect hooks for API calls
✅ Do: Use React Query for all server state

**Why**: Prevents stale data, reduces boilerplate, standardizes error handling

## Example
\`\`\`typescript
// ❌ Violates pattern
const [data, setData] = useState(null);
useEffect(() => { fetch('/api/users').then(setData) }, []);

// ✅ Follows pattern
const { data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
\`\`\`
```

**Step 2**: Run Guardian on AI-generated code

```bash
cortex review src/components/UserList.tsx
```

**Step 3**: Guardian catches violations

```
🔍 Reviewing src/components/UserList.tsx

❌ Pattern Violation (Line 12-18)
Pattern: Data Fetching
Severity: HIGH

Found: Custom useEffect hook for API call
Expected: React Query (see docs/decisions/003-use-react-query.md)

Suggestion: Replace useEffect with useQuery hook

---

✅ Architecture: Follows component structure pattern
✅ Domain Logic: Proper error boundary usage
❌ Pattern Compliance: 1 violation found

Review complete. Fix violations before committing.
```

**Step 4**: Fix before committing

No more "oops, I'll fix that in the next PR."

---

## Our Early Experience: Dogfooding Guardian

We've been testing Guardian on Cortex TMS itself. Here's what we've observed so far:

> **Important Context**: These are preliminary results from our own small project (~20 PRs over 2 weeks, single maintainer). This is not independent verification or proof of effectiveness at scale.

### Before Guardian (AI-assisted development, manual review)
- ⏱️ **Review time**: 20-30 min per PR (our experience)
- 🔄 **Back-and-forth cycles**: 3-4 rounds (typical for us)
- 🐛 **Pattern violations reaching main**: ~15% (in our commits)
- 😓 **Maintainer frustration**: High (subjective)

### After Guardian (AI + Guardian pre-review)
- ⏱️ **Review time**: 7-10 min per PR (our experience, ~66% reduction)
- 🔄 **Back-and-forth cycles**: 1-2 rounds (our experience)
- 🐛 **Pattern violations reaching main**: ~3% (in our commits)
- ✅ **Clean PRs**: ~80% pass first review (our experience)

**Our takeaway**: In our limited testing, Guardian has helped us catch issues earlier. We can't yet claim this will work for every project or team.

---

## Our Hypothesis: Pattern-Based Pre-Review

Guardian is our experiment to address these challenges. The approach:

1. **Enforcing Documented Patterns**
   - AI-generated code must match YOUR conventions
   - Violations flagged immediately with references to docs

2. **Preventing Architectural Drift**
   - Code audited against ADRs and domain logic
   - Ensures consistency across AI-assisted contributions

3. **Reducing Review Burden**
   - Maintainers focus on logic, not style/pattern violations
   - 66% faster review cycles

4. **Educating Contributors**
   - Guardian explains WHY code violates patterns
   - Links to relevant documentation for context

5. **Scaling Code Review**
   - Same quality bar whether you have 5 or 50 contributors
   - AI-assisted contributions become **assets, not liabilities**

---

## Real Example: Guardian in Action

Here's a real commit from Cortex TMS development where Guardian caught an issue:

**PR**: Add blog infrastructure (TMS-284a)

**Guardian Review**:
```bash
$ cortex review website/src/pages/blog/index.astro

❌ Pattern Violation (Line 8)
Pattern: Component Imports
Expected: Import CardGrid from '@astrojs/starlight/components'
Found: Manual grid implementation

Reference: docs/core/PATTERNS.md#starlight-components

✅ Fixed before commit
```

**Result**: Clean PR, no maintainer back-and-forth, pattern consistency maintained.

---

## Get Started: Three Ways to Use Guardian

### 1. Pre-Commit Hook (Recommended)
```bash
# .husky/pre-commit
cortex review $(git diff --staged --name-only --diff-filter=d | grep -E '\.(ts|tsx|js|jsx)$')
```

### 2. Manual Review Before PR
```bash
# Review your changes before committing
cortex review src/
```

### 3. CI/CD Integration
```yaml
# .github/workflows/guardian.yml
- name: Guardian Review
  run: cortex review --strict src/
```

---

## Guardian vs. Traditional Linting

**ESLint/Prettier**: Syntax and formatting (necessary but not sufficient)

**Guardian**: Architectural patterns and domain logic

| Tool | Scope | Example Check |
|:-----|:------|:--------------|
| **ESLint** | Syntax | "Missing semicolon" |
| **Prettier** | Formatting | "Inconsistent indentation" |
| **Guardian** | Architecture | "Should use React Query, not useEffect (ADR-003)" |

Guardian complements linting—it doesn't replace it.

---

## What We're Learning

AI-assisted development is here to stay. The challenge is finding ways to maintain code quality and architectural consistency.

**Our approach** with Guardian is experimental. We're testing whether pattern-based pre-review can help:

- Keep AI-accelerated development productive
- Maintain architectural consistency
- Reduce review burden on maintainers
- Scale community contributions effectively

**Is it working?** Too early to say definitively. Our early internal results are promising, but we need more real-world testing and feedback.

---

## Try Guardian (Experimental)

Guardian is part of Cortex TMS v2.7 (released January 2026). **It's new and experimental**—we're still learning what works.

```bash
# Install globally
npm install -g cortex-tms

# Initialize in your project
cortex init

# Review code against your patterns
cortex review src/
```

**Requirements**:
- `docs/core/PATTERNS.md` (document your conventions)
- OpenAI or Anthropic API key (BYOK - bring your own key)

**Current limitations**:
- Early stage tool - expect false positives and false negatives
- Target accuracy: 70%+ on architectural violations (unverified)
- Works best when patterns are clearly documented
- LLM API costs apply (you provide your own key)

**We'd love your feedback** on whether this approach is useful for your project.

---

## Learn More

- 📖 [Guardian CLI Reference](/reference/cli/review/) - Full command documentation
- 🎯 [Use Case: Open Source Maintainers](/use-cases/open-source/) - How Guardian scales OSS
- 🏢 [Use Case: Enterprise Teams](/use-cases/enterprise/) - Team governance at scale
- 🤝 [AI Collaboration Policy](/community/about/) - How we build with AI

---

## Join the Conversation

Have you experienced the "AI PR Tsunami" in your projects? How are you handling it?

- 💬 [Discuss on GitHub](https://github.com/cortex-tms/cortex-tms/discussions)
- 🐛 [Report Issues](https://github.com/cortex-tms/cortex-tms/issues)
- ⭐ [Star on GitHub](https://github.com/cortex-tms/cortex-tms)

---

**Built using our own standard.** Every feature in Cortex TMS, including Guardian, is dogfooded during development. We experience the problems before you do. [See how we build →](/community/about/)

---

## Sources

- [tldraw Contributions Policy Issue #7695](https://github.com/tldraw/tldraw/issues/7695)
- [tldraw: "Stay away from my trash" blog post](https://tldraw.dev/blog/stay-away-from-my-trash)
- [Hacker News discussion on tldraw pausing contributions](https://news.ycombinator.com/item?id=46641042)
