# Content Standards for Marketing & Announcements

**Purpose**: Define standards for blog posts, social media, and public announcements to ensure honesty, clarity, and trust.

**Guiding Sentence**: _"Write like you're leaving a note for the next maintainer—not pitching a solution."_

**Core Philosophy**: We document what we learned, not what we sell. If a Cortex TMS tool appears in our content, it should feel like a natural outcome of the story, not the starting point.

**Last Updated**: 2026-01-20

---

## Voice & Audience

### Voice

Think: _"Senior engineer explaining a trade-off over coffee."_

- Calm
- Experienced
- Pragmatic
- Curious

### Audience

Primary readers:
- Open-source maintainers
- Senior and staff engineers
- Technical leads
- Developers already using AI tools

They are smart, skeptical, and have limited time. They dislike hype.

**Write WITH them, not AT them.**

---

## Core Principles

### 1. **Honesty Over Hype**

**Rule**: Never exaggerate claims or present speculation as fact.

✅ **DO**:
- Share what we've actually observed
- Be clear about limitations
- Admit when something is experimental
- Cite sources accurately

❌ **DON'T**:
- Make universal claims from limited data
- Imply causation from correlation
- Hide limitations or caveats
- Use absolute language without evidence

**Examples**:

```markdown
❌ Bad: "Guardian prevents the AI PR tsunami drowning all maintainers"
✅ Good: "Our approach to challenges we've seen with AI-generated PRs"

❌ Bad: "Proven 66% reduction in review time"
✅ Good: "In our internal testing (~20 PRs), we observed ~66% faster reviews"

❌ Bad: "THE solution to AI code review"
✅ Good: "An experimental approach to pattern-based code review"
```

---

### 2. **Own Experience Only**

**Rule**: Only make claims based on our direct experience or properly cited sources.

✅ **DO**:
- Share metrics from our own dogfooding
- Cite third-party sources properly
- Use "in our experience" qualifiers
- Provide sample sizes and context

❌ **DON'T**:
- Generalize from our experience to all users
- Claim industry-wide trends without data
- Imply independent verification we don't have
- Make predictions as if they're guaranteed

**Examples**:

```markdown
❌ Bad: "Teams using Guardian see 80% cleaner PRs"
✅ Good: "In Cortex TMS development, ~80% of our PRs now pass first review"

❌ Bad: "The AI PR problem is affecting every open source project"
✅ Good: "tldraw reported this issue, and we've experienced similar challenges"

❌ Bad: "Guardian works for all team sizes"
✅ Good: "We've tested Guardian on our small team (1-2 developers). Larger team feedback needed."
```

---

### 3. **Clear Limitations**

**Rule**: Explicitly state what we don't know and what limitations exist.

✅ **DO**:
- Mention sample sizes
- Acknowledge experimental status
- List known limitations
- Invite feedback and testing

❌ **DON'T**:
- Hide weaknesses
- Downplay early-stage status
- Skip caveats to sound more confident
- Pretend we have all the answers

**Examples**:

```markdown
❌ Bad: "Guardian accurately catches architectural violations"
✅ Good: "Guardian targets 70%+ accuracy (unverified). Expect false positives and false negatives."

❌ Bad: "Ready for production use"
✅ Good: "Early stage experimental tool. We'd love your feedback on whether it's useful."

❌ Bad: [No mention of costs]
✅ Good: "LLM API costs apply—you provide your own API key (BYOK approach)"
```

---

### 4. **Simple, Clear Language**

**Rule**: Write for clarity, not to impress. Avoid jargon and marketing speak.

✅ **DO**:
- Use plain language
- Explain technical terms
- Keep sentences short
- Focus on reader understanding

❌ **DON'T**:
- Use buzzwords without definition
- Write overly complex sentences
- Use industry jargon unnecessarily
- Prioritize sounding smart over being clear

**Examples**:

```markdown
❌ Bad: "Leverage synergistic pattern-enforcement paradigms to optimize governance throughput"
✅ Good: "Check code against your documented patterns before submitting"

❌ Bad: "Revolutionary AI-powered architectural compliance validation framework"
✅ Good: "A CLI tool that reviews code against your project's patterns"

❌ Bad: "Utilizing cutting-edge LLM orchestration for holistic codebase analysis"
✅ Good: "Uses OpenAI or Anthropic APIs to check code against your docs"
```

**Language Substitution Table**:

| Instead of    | Use             |
|:------------- |:--------------- |
| Solves        | Helps with      |
| Revolutionary | Useful          |
| The future of | One approach to |
| Industry-wide | In our case     |
| AI will       | AI can          |
| Proven to     | We observed     |
| Always/Never  | Often/Rarely    |

---

### 5. **Observation vs Interpretation**

**Rule**: Explicitly separate facts from conclusions.

✅ **DO**:
- State what you observed (facts)
- State what you think caused it (interpretation)
- Label opinions clearly

❌ **DON'T**:
- Present interpretations as facts
- Claim causation you can't verify
- Mix observations with conclusions

**Examples**:

```markdown
❌ Bad: "AI-generated PRs cause maintainer burnout"
✅ Good:
"What we observed: Review time increased 3x with AI-generated PRs
What we think caused it: Pattern violations requiring multiple review rounds"

❌ Bad: "Guardian solves the AI PR problem"
✅ Good:
"What we observed: Review time decreased ~66% in our workflow
Our interpretation: Pre-checking patterns catches issues earlier"
```

---

## Content Checklist

Before publishing any blog post, announcement, or social media post, verify:

### Accuracy Checklist

- [ ] All factual claims have sources or are from our direct experience
- [ ] Metrics include sample size and context
- [ ] Third-party claims are accurately cited (not misrepresented)
- [ ] We distinguish between proven facts and our opinions/hypotheses

### Honesty Checklist

- [ ] Experimental features are labeled as experimental
- [ ] Limitations are explicitly stated
- [ ] We don't make universal claims from limited data
- [ ] We don't imply independent verification we don't have

### Clarity Checklist

- [ ] Technical terms are explained
- [ ] Sentences are concise and clear
- [ ] Jargon is minimized
- [ ] A non-expert could understand the main points

### Tone Checklist

- [ ] Sounds like a senior engineer over coffee (calm, experienced, pragmatic)
- [ ] Written WITH readers, not AT them
- [ ] Helpful, not salesy
- [ ] Honest about what we don't know
- [ ] Invites feedback and collaboration
- [ ] Could a skeptical maintainer respect this?

---

## Blog Post Structure

Use this 8-part structure for honest, clear blog posts:

```markdown
---
title: "[Clear, Descriptive Title - Not Clickbait]"
description: "[Honest summary - no overstatements]"
pubDate: YYYY-MM-DD
author: "Cortex TMS Team"
tags: [relevant, tags]
draft: false
---

## 1. Context: Where We Were
[Start with your situation]
- What were we building?
- What stage was the project in?
- What constraints mattered?

Example: "While building Cortex TMS, we started relying more on AI tools during day-to-day development."

---

## 2. Friction: What Went Wrong
[Describe the problem as observed behavior, not theory]
- What specifically happened?
- How did it affect time, quality, or people?
- How often did it occur?

Avoid emotional language unless you clearly own it.

---

## 3. Observation vs Interpretation
[Explicitly separate facts from conclusions]

**What we observed**: [Specific facts, metrics, behaviors]

**What we think caused it**: [Your interpretation/hypothesis]

This signals intellectual honesty and builds trust.

---

## 4. External Signals (Optional)
[When referencing other projects or industry events]
- Use them as signals, not proof
- Say why they resonated with our experience
- Link to original sources

Never claim causation you can't verify.

---

## 5. Experiment: What We Tried
[Frame solutions as experiments]

Include:
- The goal
- The constraints
- What we intentionally did NOT try to solve

Avoid presenting tools as inevitable or obvious.

---

## 6. Outcome: What Changed
[Share results with context]

Scope: [Team size, repo type]
Timeframe: [Duration of testing]
Impact: [Directional, not inflated precision]

Always include:
- What improved
- What stayed the same
- What still hurts

---

## 7. Limits & Trade-offs (MANDATORY)
[Every article must include this section]

Answer:
- When does this not work?
- Who shouldn't use this?
- What prerequisites exist?

This is mandatory, not optional.

---

## 8. Invitation, Not CTA
[End with an open door]

Preferred endings:
- "If this sounds familiar..."
- "This might be useful if..."
- "We're still iterating on this."

Avoid aggressive calls-to-action.

---

## Sources
[All citations properly linked]
```

**Pre-Publish Test**:
- [ ] Could a skeptical maintainer respect this article?
- [ ] Would this still be valuable without the product?
- [ ] Does the product appear naturally from the story?

---

## Social Media Guidelines

### Twitter/X Posts

✅ **DO**:
- Share genuine learnings
- Link to detailed blog posts
- Use first-person ("We're trying...", "We observed...")
- Invite discussion (not aggressive CTAs)
- Frame tools as natural outcomes, not the starting point

❌ **DON'T**:
- Make absolute claims
- Use engagement bait
- Oversimplify to the point of misleading
- Sound overconfident
- Use aggressive calls-to-action ("Download now!", "Sign up today!")

**Examples**:

```markdown
❌ Bad Tweet:
"🚨 Guardian SOLVES the AI PR tsunami! 66% faster reviews PROVEN!
Download now 👇"

✅ Good Tweet:
"We've been testing pattern-based code review (Guardian) on Cortex TMS.
Early results (~20 PRs): ~66% faster reviews in our workflow.

Still experimental, but wanted to share our approach 🧵

[link to blog post]"
```

### Reddit Posts

✅ **DO**:
- Provide full context upfront
- Be transparent about our connection to the project
- Invite criticism and feedback
- Be humble about what we know

❌ **DON'T**:
- Hide that we built the tool
- Make promotional claims
- Dismiss critical feedback
- Oversell experimental features

**Template**:

```markdown
# [Descriptive Title - Clear About Our Involvement]

**Context**: [We built this / We're experimenting with this]

**Problem we observed**: [Honest problem description with sources]

**Our approach**: [What we're trying]

**Early results** (from our own small-scale testing): [Metrics with caveats]

**Limitations**: [What we don't know, what doesn't work yet]

**Looking for feedback**: [Specific questions for the community]

**Repo**: [Link]
```

---

## Red Flags to Avoid

If you see these patterns in draft content, revise:

### Marketing Red Flags

- ❌ "THE solution to..."
- ❌ "Proven to..." (without independent study)
- ❌ "Revolutionary" / "Game-changing" / "Groundbreaking"
- ❌ Universal claims ("All teams...", "Every maintainer...")
- ❌ Guarantees about results
- ❌ Hiding costs or limitations
- ❌ Comparisons without evidence

### Tone Red Flags

- ❌ Overconfident about experimental features
- ❌ Dismissive of other approaches
- ❌ Defensive about limitations
- ❌ Sales-y language over helpful language
- ❌ Hype over substance
- ❌ Vague metrics without context

---

## Examples: Before & After

### Example 1: Product Announcement

**❌ Before (Too promotional)**:
```markdown
🚀 Announcing Guardian - THE solution to the AI PR crisis!

Proven to reduce review time by 66% and catch 97% of violations.
Join 1000s of developers already using Guardian to revolutionize
their workflow!

Download now 👇
```

**✅ After (Honest)**:
```markdown
Announcing Guardian: Our experiment in pattern-based code review

We've been testing Guardian on Cortex TMS (small sample: ~20 PRs
over 2 weeks). Early results show ~66% faster reviews in our
workflow.

It's experimental and has limitations. We'd love your feedback
on whether this approach is useful.

Details: [link]
```

---

### Example 2: Feature Description

**❌ Before (Overstated)**:
```markdown
Guardian automatically ensures your code perfectly matches your
architectural patterns with 100% accuracy!
```

**✅ After (Accurate)**:
```markdown
Guardian reviews code against your documented patterns. Target
accuracy: 70%+ (unverified). Expect some false positives and
false negatives.
```

---

### Example 3: Metric Sharing

**❌ Before (Misleading)**:
```markdown
Teams using Cortex TMS see 80% cleaner PRs!
```

**✅ After (Contextual)**:
```markdown
In Cortex TMS development (our own project, ~20 PRs), we've
seen ~80% of PRs pass first review after adding Guardian.

Sample size is small. We can't claim this will work for all projects.
```

---

## Why This Matters

**Trust is our most valuable asset.**

Our audience—maintainers and senior engineers—are smart, skeptical, and experienced. They can spot hype immediately.

If we:
- Overpromise and underdeliver
- Make claims we can't back up
- Hide limitations
- Use marketing speak instead of plain language

We lose trust. And once lost, trust is nearly impossible to rebuild.

**Our commitment**: We'd rather have 100 users who trust us completely than 10,000 users who feel misled.

**Remember**: If an article could be written without Cortex TMS and still be useful, it's probably good. The tool should emerge naturally from solving real problems, not be forced into every narrative.

---

## Relationship to Marketing

**Editorial content is NOT marketing copy.**

Rules:
- No feature lists disguised as prose
- No competitive comparisons unless factual
- No exaggerated benefit claims
- No hiding costs or prerequisites

If marketing language sneaks in, rewrite the paragraph.

Our writing exists to:
- Share real problems we encountered
- Explain how we reasoned about them
- Describe experiments we ran
- Show what helped, what didn't, and why

---

## Enforcement

**Who reviews content**:
- All blog posts reviewed by human maintainer before publishing
- Social posts reviewed if >280 characters or making product claims
- Community announcements reviewed before posting

**Review checklist**:
1. Run content through the checklists above (Accuracy, Honesty, Clarity, Tone)
2. Ask: "Could a skeptical maintainer respect this article?"
3. Ask: "Would this still be valuable without the product?"
4. Ask: "Does the product appear naturally from the story?"
5. Ask: "Are all claims properly qualified and contextualized?"
6. Ask: "Would I feel misled if I were a new user reading this?"
7. Ask: "Are opinions clearly marked as opinions?"
8. Ask: "Are limitations stated explicitly?"

**If in doubt**: Tone it down. Be more honest. Add caveats.

---

## Scope of Application

This guide applies to:
- Blog posts
- Social media announcements (Twitter/X, Reddit, LinkedIn)
- Documentation narratives
- Long-form essays
- Community announcements
- Press releases

This does NOT apply to:
- Technical documentation (reference material)
- API documentation
- Internal planning documents

---

## Updates to This Document

This is a living document. As we learn what works, we'll update these guidelines.

**Last major update**: 2026-01-20
- Merged EDITORIAL-cortex-tms-style-guide.md principles
- Added "Observation vs Interpretation" principle
- Updated blog post structure to 8-part format
- Added language substitution table
- Strengthened pre-publish tests

**Next review**: After community launch feedback (Feb 2026)

---

<!-- @cortex-tms-version 2.6.0 -->
