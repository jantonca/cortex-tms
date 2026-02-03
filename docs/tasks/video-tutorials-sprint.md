# AI Video Tutorials Sprint - Implementation Plan

**Total Scope**: Phased approach (Setup → MVP → Expansion)
**Start Date**: TBD (after v3.3.0 release)
**Status**: 📋 Planned
**Approach**: Validate workflow with test video, then build MVP series, expand based on engagement

---

## Overview

Create AI-generated video tutorials to:
1. **Reduce time-to-first-value** - Visual learning for quick starts
2. **Increase discoverability** - YouTube SEO for new users
3. **Lower barrier to entry** - Show, don't just tell

**Key Constraint**: Fully automated workflow (Motion Canvas + AI voice) to keep effort sustainable.

---

## Phase 1: Setup & Validation (1 week)

**Goal**: Prove the workflow works before committing to full series.

### Task 1.1: Tool Setup (2 hours)

#### Motion Canvas Installation
- [ ] Install Motion Canvas: `npm install -g @motion-canvas/cli`
- [ ] Create test project: `motion-canvas init test-video`
- [ ] Verify setup: Run sample animation
- [ ] Test export: `motion-canvas render` (should produce MP4)

#### AI Voice Setup (ElevenLabs)
- [ ] Create ElevenLabs account (free tier: 10k chars/month)
- [ ] Choose voice: Professional, neutral, mid-paced
- [ ] Test export: Generate 30-second narration
- [ ] Check quality: Listen for artifacts, pacing issues

#### Video Editor (Optional)
- [ ] Install DaVinci Resolve (free) or use FFmpeg
- [ ] Test audio sync: Motion Canvas video + ElevenLabs audio
- [ ] Export test: 1080p MP4, <5MB for 60 seconds

**Deliverable**: Working toolchain (Motion Canvas → Audio → Final video)

---

### Task 1.2: Test Video - "60-Second Demo" (4 hours)

**Goal**: Create hero video for homepage, validate workflow.

#### Script (30 min)
```markdown
[0:00-0:10] "Tired of AI agents hallucinating project conventions?"
[0:10-0:20] "Cortex TMS organizes your docs into tiers—HOT, WARM, COLD."
[0:20-0:35] "Your AI reads only what matters. Faster. Cheaper. No drift."
[0:35-0:50] Demo: `cortex-tms init` → `status` → token savings shown
[0:50-1:00] "Install now: npm install -g cortex-tms"
```

#### Animation (2 hours)
- [ ] Terminal mockup (green text on dark background)
- [ ] Animate `cortex-tms init` output (typewriter effect)
- [ ] Show `cortex-tms status` with token stats highlighted
- [ ] Visual: Tokens graph (100% → 30% reduction)
- [ ] End screen: Logo + "cortex-tms.org"

#### Production (1.5 hours)
- [ ] Generate voiceover (ElevenLabs)
- [ ] Sync audio to animations
- [ ] Add background music (royalty-free, subtle)
- [ ] Export: 1080p MP4, <10MB
- [ ] Review: Check pacing, audio levels, text clarity

#### Validation (30 min)
- [ ] User test: Show 3-5 people, ask "What is this tool?"
- [ ] Check: Do they understand in <60 seconds?
- [ ] Fix: Adjust script/visuals if confused
- [ ] Decide: Good enough to proceed with full series?

**Deliverable**: 60-second hero video, workflow validated

---

## Phase 2: MVP Video Series (2-3 weeks)

**Goal**: Create 3 core videos for website + YouTube launch.

### Video 2: "Quick Start Tutorial" (5 min)

**Target Audience**: New users who want to get productive fast.

#### Script Outline
1. **Install** (30 sec)
   - Show: `npm install -g cortex-tms`
   - Verify: `cortex-tms --version`

2. **Initialize** (1 min)
   - Run: `cortex-tms init --scope standard`
   - Show: Files created in `docs/` directory
   - Explain: "9 files created—these guide your AI"

3. **Validate** (30 sec)
   - Run: `cortex-tms validate`
   - Show: Warnings about placeholders (normal)

4. **Start AI Session** (1.5 min)
   - Run: `cortex-tms prompt init-session`
   - Copy output to Claude Code/Cursor
   - Show: AI now focused on HOT tier only

5. **Check Savings** (1 min)
   - Run: `cortex-tms status`
   - Highlight: Context reduction percentage
   - Explain: "Fewer tokens = faster responses, lower cost"

6. **Next Steps** (30 sec)
   - "Fill placeholders: `cortex-tms validate`"
   - "Read docs: cortex-tms.org"
   - "Questions? GitHub Discussions"

#### Production Checklist
- [ ] Write full script (verbatim)
- [ ] Create animations (terminal + screen recordings)
- [ ] Generate voiceover
- [ ] Sync audio/video
- [ ] Add chapter markers (YouTube timestamps)
- [ ] Export + upload

**Deliverable**: 5-minute quick start tutorial

---

### Video 3: "What is Tiered Memory?" (3 min)

**Target Audience**: Users who want to understand the concept.

#### Script Outline
1. **The Problem** (45 sec)
   - "AI agents read your entire codebase every session"
   - "This wastes tokens, slows down responses, causes drift"
   - Visual: Token meter filling to 100%, $ signs flying away

2. **The Solution: Tiered Memory** (1 min)
   - "HOT tier: Active sprint, patterns, current work"
   - "WARM tier: Recent decisions, reference docs"
   - "COLD tier: Archives, completed work, history"
   - Visual: 3-tier pyramid, highlight HOT tier

3. **How It Works** (1 min)
   - "AI reads only HOT tier by default"
   - "You control what's hot with NEXT-TASKS.md"
   - "Old work automatically moves to COLD tier"
   - Visual: Files moving between tiers

4. **Results** (15 sec)
   - "60-70% context reduction (typical)"
   - "Faster responses, lower cost, no drift"
   - "Your AI stays focused on what matters"

**Deliverable**: 3-minute concept explainer

---

### Video 4: "Integration with Claude Code" (4 min)

**Target Audience**: Claude Code users specifically.

#### Script Outline
1. **Setup** (1 min)
   - Initialize Cortex TMS in project
   - Run `cortex-tms prompt init-session`

2. **Claude Code Workflow** (2 min)
   - Paste prompt into Claude Code
   - Show: Claude reads only HOT tier docs
   - Demo: Ask Claude to implement feature from NEXT-TASKS.md
   - Show: Claude follows patterns from PATTERNS.md

3. **Iteration** (1 min)
   - Update NEXT-TASKS.md with new task
   - Run `cortex-tms prompt init-session` again
   - Claude picks up new context automatically

**Deliverable**: Claude Code integration demo

---

### Task 2.4: Website Integration Components (4 hours)

#### VideoPlayer Component
**File**: `website/src/components/VideoPlayer.tsx`

```tsx
interface VideoPlayerProps {
  videoId: string;        // YouTube video ID
  title: string;
  description?: string;
  thumbnail?: string;
}

export function VideoPlayer({ videoId, title, description, thumbnail }: VideoPlayerProps) {
  // Lazy-load iframe on click (performance)
  // Show custom thumbnail with play button overlay
  // Full YouTube embed on play
}
```

#### Homepage Hero Video Section
**File**: `website/src/pages/index.astro`

- [ ] Add video section above "Features"
- [ ] Embed 60-second demo video
- [ ] CTA: "Watch Quick Start Tutorial →"
- [ ] Analytics: Track play rate

#### Tutorial Gallery Page
**File**: `website/src/pages/tutorials.astro`

- [ ] Create `/tutorials` page
- [ ] Grid layout: Video cards with thumbnails
- [ ] Filter by topic (Getting Started, Concepts, Integrations)
- [ ] Link to YouTube channel for full playlist

**Deliverable**: Website components for video hosting

---

### Task 2.5: YouTube Channel Setup (2 hours)

#### Channel Creation
- [ ] Create YouTube channel: "Cortex TMS"
- [ ] Channel art: Banner (2560×1440), icon (logo)
- [ ] Channel description: "Tiered Memory System for AI agents"
- [ ] Links: Website, GitHub, Discussions

#### Playlist Organization
- [ ] "Getting Started" playlist (Videos 1-2)
- [ ] "Concepts" playlist (Video 3)
- [ ] "Integrations" playlist (Video 4)
- [ ] "Advanced Topics" (future)

#### Video Metadata Template
```yaml
Title: "[Cortex TMS] {Video Title}"
Description: |
  {Video description}

  🔗 Links:
  - Install: npm install -g cortex-tms
  - Docs: https://cortex-tms.org
  - GitHub: https://github.com/cortex-tms/cortex-tms
  - Discussions: https://github.com/cortex-tms/cortex-tms/discussions

  📖 Chapters:
  0:00 - Intro
  {chapter timestamps}

Tags: [cortex-tms, ai, llm, context-management, tiered-memory, claude, cursor, copilot]
```

**Deliverable**: YouTube channel ready for uploads

---

## Phase 3: Full Series Expansion (4-6 weeks)

**Goal**: Comprehensive tutorial library based on Phase 2 engagement.

### Additional Videos (Planned)

5. **"Migration from Existing Projects"** (6 min)
   - Target: Users with existing codebases
   - Demo: Migrate real project step-by-step
   - Status: Depends on migration tooling (v3.4+)

6. **"Team Setup & Best Practices"** (5 min)
   - Multi-user workflows
   - Git strategies for TMS files
   - Review process for PATTERNS.md updates

7. **"Advanced: Custom Tiers"** (4 min)
   - When to create custom tiers
   - Tier transition strategies
   - Token optimization techniques

8. **"Integration: Cursor AI"** (4 min)
   - Cursor-specific workflow
   - `.cursorrules` + Cortex TMS
   - Common pitfalls

9. **"Integration: GitHub Copilot"** (4 min)
   - Copilot Chat + TMS prompts
   - Workspace context management

10. **"Troubleshooting Guide"** (5 min)
    - Common validation errors
    - Token count discrepancies
    - AI not respecting tiers (debugging)

11. **"Case Study: Real Project"** (8 min)
    - Before/after comparison
    - Token savings over time
    - Developer experience improvements

**Total**: 11 videos, ~50 minutes total content

---

## Success Metrics

### Phase 1 Success (Test Video)
- [ ] Workflow takes <4 hours to produce 60-second video
- [ ] 3/5 user testers understand tool in <60 seconds
- [ ] Video quality acceptable for public release

### Phase 2 Success (MVP Series)
- [ ] 3 videos published to YouTube
- [ ] Website `/tutorials` page live
- [ ] >100 views/video in first week
- [ ] >70% watch time retention (YouTube Analytics)

### Phase 3 Success (Full Series)
- [ ] 11 videos total published
- [ ] >1000 subscribers on YouTube channel
- [ ] >50% of new users mention "saw video" in surveys
- [ ] Video traffic drives >20% of website visits

---

## Git Protocol

### Branch Strategy
- `feat/video-tutorials-setup` → Phase 1 (tooling + test video)
- `feat/video-tutorials-mvp` → Phase 2 (3 videos + website components)
- `feat/video-tutorials-expansion` → Phase 3 (remaining videos)

### Commit Messages
```bash
# Phase 1
git commit -m "feat(videos): set up Motion Canvas + ElevenLabs toolchain

- Install Motion Canvas CLI
- Configure ElevenLabs API
- Create test video: 60-second demo
- Validate workflow (4 hours to produce)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Phase 2
git commit -m "feat(videos): publish MVP tutorial series + website integration

Videos:
- Quick Start Tutorial (5 min)
- What is Tiered Memory? (3 min)
- Claude Code Integration (4 min)

Website:
- VideoPlayer component
- /tutorials gallery page
- Homepage hero video section

YouTube:
- Channel created + branded
- 3 videos published
- Playlists organized

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Risk Mitigation

### Risk: Video production takes too long per video
**Mitigation**: Validate with Phase 1 test video. If >4 hours, simplify animations or use screencasts instead.

### Risk: AI voice quality not professional enough
**Mitigation**: Test multiple ElevenLabs voices, consider human voiceover for critical videos.

### Risk: Low engagement on YouTube
**Mitigation**:
- Optimize titles/thumbnails (A/B test)
- Post to Reddit (r/programming, r/ClaudeAI)
- Cross-promote on Twitter/LinkedIn

### Risk: Videos become outdated as tool evolves
**Mitigation**:
- Focus on concepts (timeless) over specific commands (changes)
- Add pinned comment with updates
- Plan refresh schedule (every 6 months)

---

## Budget & Resources

### Free Tools
- Motion Canvas: Open source, free
- ElevenLabs: Free tier (10k chars/month ≈ 3-4 videos)
- DaVinci Resolve: Free version sufficient
- YouTube: Free hosting + analytics

### Paid Options (If Needed)
- ElevenLabs Pro: $22/month (unlimited voices)
- Epidemic Sound: $15/month (royalty-free music)
- Canva Pro: $13/month (thumbnails/channel art)

**Estimated Cost**: $0-50/month depending on volume

---

## Next Immediate Action

**START HERE**:
1. [ ] Read this plan completely
2. [ ] Decide: Commit to Phase 1 now or defer?
3. [ ] If proceeding:
   - Create `feat/video-tutorials-setup` branch
   - Install Motion Canvas
   - Start Task 1.1: Tool Setup

**Estimated Timeline**:
- Phase 1: 1 week (6 hours focused work)
- Phase 2: 2-3 weeks (20 hours focused work)
- Phase 3: 4-6 weeks (40 hours focused work)

**Total**: 2-3 months for full series (11 videos)

---

**Decision Point**: After Phase 1 test video, evaluate if this approach is sustainable before committing to full series.

<!-- @cortex-tms-version 3.1.0 -->
