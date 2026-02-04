# Hero Video Script - Hero Demo

**Duration**: ~45-50 seconds (optimized for homepage hero)
**Format**: Text-only animation (no voiceover)
**Target**: Homepage hero section, YouTube intro
**CTA**: Try instantly via npx

**Design Choice**: Text-only format chosen deliberately for:
- Faster production and iteration
- Muted autoplay on homepage (no audio needed)
- Viewers can read at their own pace
- Easier to update (no voice re-recording)
- Phase 2 tutorials will still exercise AI voice pipeline if needed

---

## Full Script with Timestamps

### Scene 1: The Problem (0:00-0:08)
**Text**: "Tired of AI agents hallucinating project conventions?"

**Visual Direction**:
- Ambient animated background (orange/amber glows)
- Logo appears at top
- Red warning icon (⚠️) with pulse effect
- Text fades in, center-aligned
- Orange tagline: "There's a better way."

**Timing**:
- Logo + warning: ~2s
- Problem text types in: ~2s
- Tagline appears: ~2s
- Fade out: ~2s

---

### Scene 2: The Solution (0:08-0:17)
**Text**: "Cortex TMS organizes your docs into tiers—HOT, WARM, COLD."

**Visual Direction**:
- Title: "Cortex TMS"
- Subtitle: "Tiered Memory System" (orange)
- 3-tier pyramid builds bottom-to-top:
  - COLD: Teal (#0ea5a4) - "Archives, history"
  - WARM: Yellow (#facc15) - "Recent decisions"
  - HOT: Orange (#f97316) - "Active sprint, patterns"
- HOT tier emphasizes with scale/glow

**Timing**:
- Title appears: ~1s
- Pyramid builds: ~5s
- HOT emphasis: ~2s
- Fade out: ~1s

---

### Scene 3: The Value (0:17-0:25)
**Text**: "Your AI reads only what matters. Faster. Cheaper. No drift."

**Visual Direction**:
- Title: "Your AI reads only what matters."
- 3 benefit cards appear sequentially:
  - ⚡ Faster (orange)
  - 💰 Cheaper (yellow)
  - 🎯 No drift (teal)
- Each with checkmark

**Timing**:
- Title: ~1s
- Cards cascade: ~5s
- Hold: ~2s

---

### Scene 4: Demo - Terminal Commands (0:25-0:42)
**Text**: Terminal mockup showing (stylized view):
```
$ npx cortex-tms init
✓ Created 9 documentation files

$ npx cortex-tms status --tokens
📊 Token Analysis
  HOT (Active): 32,450 tokens
  WARM (Truth): 18,230 tokens
  COLD (Archive): 50,554 tokens
  Full repository: 101,234 tokens
  💰 68% reduction
```

**Note**: Terminal output is **stylized for clarity** (conceptual dashboard view). Actual CLI output may vary slightly. The 68% reduction is based on real project examples.

**Visual Direction**:
- Terminal window (dark theme, green text)
- Typewriter effect for commands
- Output appears line by line
- Token savings highlighted in bright green
- Percentage emphasized (larger font)

**Timing**:
- Terminal appears: ~1s
- Command 1 types: ~2s
- Output appears: ~1s
- Command 2 types: ~2s
- Stats cascade: ~5s
- Emphasize 68%: ~2s
- Fade out: ~1s

---

### Scene 5: Call to Action (0:42-0:50)
**Text**:
```
Try it now:
npx cortex-tms init

cortex-tms.org
```

**Visual Direction**:
- Clean, centered layout
- Command in highlighted box (orange glow, easy to read)
- Website URL below (orange)
- Tagline: "Tiered Memory for AI Agents"
- Fade to black

**Timing**:
- Title appears: ~1s
- Command box with pulse: ~2s
- Website + tagline: ~2s
- Hold for copying: ~2s
- Fade out: ~1s

---

## Key Messages (Extracted for Reuse)

### One-Line Hook
"Tired of AI agents hallucinating project conventions?"

### Value Proposition (3 words)
"Faster. Cheaper. No drift."

### Core Concept
"Cortex TMS organizes your docs into tiers—HOT, WARM, COLD. Your AI reads only what matters."

### Quantified Benefit
"~60-70% context reduction in real projects" (or use specific example: "68% reduction")

### CTA
"npx cortex-tms init" (instant try, no install needed)

---

## Channel Variations

### Homepage Hero Text
```markdown
# Stop AI Hallucinations. Start with Structure.

Cortex TMS organizes your docs into HOT, WARM, and COLD tiers.
Your AI reads only what matters—faster, cheaper, with no drift.

[Try Now: npx cortex-tms init] [Watch Demo]
```

### Twitter/X Post (280 chars)
```
Tired of AI agents hallucinating your project conventions?

Cortex TMS uses tiered docs (HOT/WARM/COLD) so your AI reads only what matters.

⚡ 60-70% context reduction
💰 Lower costs
🎯 No drift

Try it: npx cortex-tms init
```

### LinkedIn Post
```
Are your AI coding agents hallucinating project conventions?

Cortex TMS solves this with a simple concept: Tiered Memory.

HOT tier: Active sprint + patterns (what AI needs now)
WARM tier: Recent decisions (context when needed)
COLD tier: Archives (out of the way)

Result: Your AI stays focused. Often 60-70% context reduction in real projects, lower costs, zero drift.

Try it instantly: npx cortex-tms init
Docs: cortex-tms.org
```

### GitHub README Intro
```markdown
# Cortex TMS - Tiered Memory System for AI Agents

Stop wasting tokens. Stop hallucinating conventions. Start with structure.

Cortex TMS organizes your documentation into HOT, WARM, and COLD tiers,
so your AI reads only what matters for the current task.

**Result**: Often 60-70% context reduction in real projects, faster responses, lower costs, no drift.
```

---

## Production Notes

### Typography
- **Main text**: Sans-serif, bold, 60-80px
- **Terminal text**: Monospace, 40-50px
- **Subtext/CTA**: Sans-serif, 50-60px

### Color Palette
- **Background**: Dark (#0a0a0a to #1a1a1a gradient)
- **Primary text**: White (#ffffff)
- **Accent (HOT tier)**: Bright green (#4CAF50)
- **Accent (success)**: Green (#4CAF50)
- **Accent (warning)**: Red/Orange for "problem" scene
- **Terminal**: Dark gray bg (#212121), green text (#4CAF50)

### Animation Style
- **Smooth transitions**: 0.3-0.5s easing
- **Text animations**: Fade in, typewriter effect for terminal
- **Emphasis**: Scale up, color shift, glow
- **Keep it simple**: No distracting effects

### Accessibility
- **High contrast**: White on dark, 4.5:1 minimum
- **Large text**: Readable at 1080p
- **Clear timing**: 2-3 seconds per message minimum
- **Text remains on screen**: Long enough to read twice

---

## User Testing Questions

After showing test viewers (3-5 people):

1. **"What is this tool?"** (validates understanding)
2. **"What action would you take after this video?"** (validates CTA)
3. **"What's the main benefit you remember?"** (validates messaging)

**Target answers**:
1. "It organizes docs so AI doesn't read everything"
2. "Install it / try it / visit the website"
3. "Saves tokens / faster / prevents hallucinations"

---

## Export Settings

- **Resolution**: 1920x1080 (1080p)
- **Frame rate**: 30fps (sufficient for text animations)
- **Format**: MP4 (H.264)
- **File size target**: <8MB for ~45-50 seconds
- **Aspect ratio**: 16:9 (YouTube standard)
- **Homepage use**: Autoplay with mute, loop recommended

---

## Success Criteria

- [x] Script timing optimized for homepage (~45-50s, not 60s - shorter is better for hero)
- [x] All key messages present
- [x] CTA clear and actionable (npx for instant try)
- [x] Terminal demo shows stylized but authentic output
- [ ] 3/5 testers understand the tool in under 50 seconds
- [ ] 3/5 testers can state next action ("try npx command" or "visit website")

---

**Next Step**: Build this animation in Motion Canvas (`videos/test-video/`)

<!-- @cortex-tms-version 3.1.0 -->
