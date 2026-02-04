# AI Video Tutorials Sprint - Implementation Plan

**Total Scope**: Phased approach (Setup → MVP → Expansion)
**Start Date**: 2026-02-03
**Status**: 🚧 Phase 1 - In Progress (95% complete)
**Branch**: `feat/video-tutorials-setup`
**Approach**: Validate workflow with test video, then build MVP series, expand based on engagement

---

## 🎯 Current Progress (Updated 2026-02-04)

**Phase 1: Setup & Validation** - 95% complete
- ✅ Motion Canvas toolchain setup
- ✅ Hero video animation built (all 5 scenes)
- ✅ Hero script documented with cross-channel variations
- ✅ Component library organized (reusable backgrounds, terminal)
- ⏳ **Remaining**: Export final video, run user validation tests

**Recent Work**:
- Reorganized component structure for reusability (`components/backgrounds/`, `components/terminal/`)
- Extracted `AmbientBackground` from hero-video for future videos
- Created comprehensive README for video project structure
- Refined terminal styling and ambient effects

**Recent Updates (2026-02-04)**:
- ✅ Quick fixes applied based on feedback:
  - Updated all CTAs to use `npx cortex-tms init` (instant try, no install)
  - Adjusted timing metadata to ~45-50s (better for homepage hero)
  - Added note that terminal output is stylized for clarity

**Next Steps**:
1. Export hero-video.tsx to MP4 (1080p, <8MB)
2. Run user validation tests (3-5 testers)
3. Make adjustments based on feedback
4. Decide: Proceed to Phase 2 or iterate?

---

## Overview

Create AI-generated video tutorials to:
1. **Reduce time-to-first-value** - Visual learning for quick starts
2. **Increase discoverability** - YouTube SEO for new users
3. **Lower barrier to entry** - Show, don't just tell

**Key Constraint**: Fully automated workflow (Motion Canvas + AI voice) to keep effort sustainable.

---

## ✅ Refinements Applied (2026-02-03)

Based on external feedback, the following improvements were incorporated:

1. **Added Phase 2 decision gate** - Evaluate engagement before committing to all 11 videos
2. **Enhanced Phase 1 validation** - Added CTA question: "What action would you take?"
3. **Hero script capture** - New Task 1.3 to document script for cross-channel reuse
4. **Show failure + fix** - Quick Start tutorial demonstrates fixing validation warnings (builds trust)
5. **Centralized video metadata** - JSON config file to avoid hardcoding across website
6. **YouTube comment monitoring** - Process to feed support questions → docs/roadmap
7. **Realistic success metrics** - Adjusted view counts for niche tool, prioritized retention over raw views
8. **Product correlation tracking** - Monitor GitHub stars, npm downloads during video releases
9. **Stable concepts focus** - Emphasize timeless concepts over volatile CLI flags

---

## Phase 1: Setup & Validation (1 week)

**Goal**: Prove the workflow works before committing to full series.

### Task 1.1: Tool Setup (2 hours) ✅ COMPLETE

#### Motion Canvas Installation
- [x] Install Motion Canvas: `npm install -g @motion-canvas/cli`
- [x] Create test project: `videos/test-video/`
- [x] Verify setup: Run sample animation
- [x] Test export capabilities

#### AI Voice Setup (ElevenLabs)
- [x] **SKIPPED** - Hero video uses text-only format (faster iteration, muted autoplay)
- Note: Phase 2 tutorials may still use AI voice if needed

#### Video Editor (Optional)
- [ ] Export test: 1080p MP4, <10MB for 60 seconds (pending)

**Deliverable**: ✅ Working Motion Canvas toolchain established

---

### Task 1.2: Test Video - "60-Second Demo" (4 hours) 🚧 IN PROGRESS (80% complete)

**Goal**: Create hero video for homepage, validate workflow.

**File**: `videos/test-video/src/scenes/hero-video.tsx`

#### Script (30 min) ✅
- [x] Script documented: `docs/content/hero-video-script.md`
- [x] 5 scenes defined with timestamps
- [x] Cross-channel variations created

#### Animation (2 hours) ✅
- [x] Scene 1: Problem statement with warning icon
- [x] Scene 2: Tiered memory pyramid (HOT/WARM/COLD)
- [x] Scene 3: Value props (Faster, Cheaper, No drift)
- [x] Scene 4: Terminal demo (`init` + `status` with token savings)
- [x] Scene 5: CTA with install command
- [x] Ambient background with animated glows
- [x] Terminal component with macOS styling
- [x] Typewriter effects and smooth transitions

**Bonus**: Component organization completed
- [x] Extracted `AmbientBackground` component (reusable)
- [x] Organized `Terminal` components into subfolder
- [x] Created index files for clean imports
- [x] Documented component usage in README

#### Production (1.5 hours) ⏳ PENDING
- [ ] Export: 1080p MP4, <10MB
- [ ] Review: Check pacing, text clarity, timing
- [x] **SKIPPED**: Voiceover/music (text-only format)

#### Validation (30 min) ⏳ PENDING
- [ ] User test: Show 3-5 people, ask:
  - "What is this tool?"
  - "What action would you take after this video?" (validates CTA strength)
- [ ] Check: Do they understand in <60 seconds?
- [ ] Fix: Adjust script/visuals if confused
- [ ] Decide: Good enough to proceed with full series?

**Deliverable**: 60-second hero video animation built, export + validation pending

---

### Task 1.3: Capture Hero Script for Reuse (30 min) ✅ COMPLETE

**Goal**: Document the hero video script for multi-channel reuse.

**File**: `docs/content/hero-video-script.md` ✅

#### Create Script File ✅
- [x] Script file created with full scene breakdown
- [x] Metadata included: Duration, format, target CTA
- [x] Design rationale documented (text-only choice)
- [x] Cross-channel variations created:
  - [x] Homepage hero text
  - [x] Twitter/X post (280 chars)
  - [x] LinkedIn post
  - [x] GitHub README intro

#### Reuse Checklist ✅
- [x] Key messages extracted (hook, value prop, CTA)
- [x] Typography and color palette documented
- [x] Animation style guide included
- [x] User testing questions prepared

**Deliverable**: ✅ Comprehensive script documentation ready for reuse

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

3. **Validate** (1 min)
   - Run: `cortex-tms validate`
   - Show: Warnings about placeholders (normal)
   - **Show failure + fix** (builds trust):
     - Pick 1-2 placeholders to fix
     - Edit file, replace placeholder text
     - Run `validate` again, show warnings cleared

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

### Task 2.4: Website Integration Components (5 hours)

#### Video Metadata Config (30 min)
**File**: `website/src/content/videos.json`

```json
{
  "videos": [
    {
      "id": "hero-demo",
      "youtubeId": "...",
      "title": "60-Second Demo",
      "description": "See Cortex TMS in action",
      "duration": "1:00",
      "category": "getting-started",
      "thumbnail": "/images/thumbnails/hero-demo.jpg"
    }
  ]
}
```

**Purpose**: Centralized metadata to avoid hardcoding video IDs across multiple files.

- [ ] Create config file with video metadata schema
- [ ] Add type definitions for video objects
- [ ] Document how to add new videos

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
  // Ensure no layout shift (CLS) when iframe loads
}
```

- [ ] Implement lazy-load behavior
- [ ] Test Lighthouse performance (watch CLS score)
- [ ] Ensure compatible with Astro/Starlight setup

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

#### Ongoing Comment Monitoring
- [ ] Set up weekly review of YouTube comments
- [ ] Identify support questions → add to GitHub Discussions or docs
- [ ] Identify feature requests → feed to roadmap (keep rationale in private repo)
- [ ] Respond to comments to build community engagement

**Deliverable**: YouTube channel ready for uploads + monitoring process established

---

## 🚦 Phase 2 Decision Gate: Evaluate Before Phase 3

**Goal**: Decide if full 11-video series is worth the investment.

### Evaluation Criteria (After Phase 2 Complete)

#### Production Efficiency
- [ ] **Time per video**: Did Phase 2 videos stay within estimates?
  - If >50% overrun: Trim Phase 3 to highest-impact videos only
  - If on-time: Proceed with full Phase 3

#### Engagement Metrics
- [ ] **YouTube Analytics** (2 weeks after MVP launch):
  - Views per video: Trending up or flat?
  - Watch time retention: >60%? (slightly lower bar than initial 70%)
  - Comments/questions: Are people engaging?
- [ ] **Website traffic**: Did videos drive measurable traffic to cortex-tms.org?
- [ ] **Product metrics**: Any correlation with:
  - GitHub stars increase?
  - npm download bump?
  - New GitHub Discussions posts?

#### Qualitative Feedback
- [ ] **User surveys**: Are new users mentioning videos as helpful?
- [ ] **Community sentiment**: Positive feedback on YouTube/Reddit/Twitter?
- [ ] **Support burden**: Did videos reduce repetitive support questions?

### Decision Framework

**Proceed with full Phase 3** if:
- ✅ Production time manageable (≤50% overrun)
- ✅ Retention >60% on MVP videos
- ✅ Positive qualitative feedback
- ✅ Some measurable product metric improvement

**Trim Phase 3 to priority videos** if:
- ⚠️ Production time overrun >50%
- ⚠️ Engagement lower than expected but not zero
- → Focus on: Migration, Team Setup, Troubleshooting, 1 Case Study

**Pause or pivot** if:
- ❌ Very low engagement (<50 views/video after 2 weeks)
- ❌ Poor retention (<40%)
- ❌ Negative feedback (confusing, unhelpful)
- → Consider screencast format or written tutorials instead

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
- [x] Workflow efficient (Motion Canvas setup complete)
- [x] Hero video animation built (~45-50s, optimized for homepage)
- [ ] 3/5 user testers understand tool in under 50 seconds
- [ ] 3/5 user testers can articulate clear next action ("try npx" or "visit site")
- [ ] Video quality acceptable for public release (pending export)

### Phase 2 Success (MVP Series)

#### Content Delivery
- [ ] 3 videos published to YouTube
- [ ] Website `/tutorials` page live with video gallery
- [ ] Video metadata centralized (not hardcoded)

#### Engagement Metrics (Primary)
- [ ] **Watch time retention**: >60% average across 3 videos
  - *Note*: Retention matters more than raw view counts for a niche tool
- [ ] **Viewer feedback**: >70% positive sentiment in comments/surveys

#### Reach Metrics (Secondary)
- [ ] Views per video in first 2 weeks:
  - Realistic for niche dev tool: 50-100+ views
  - Stretch goal: 100-200+ views
  - *Note*: Early view counts may be modest; focus on retention + feedback

#### Product Correlation Metrics (Track, Don't Optimize For)
- [ ] GitHub stars: Track weekly trend during video releases
- [ ] npm downloads: Track weekly trend during video releases
- [ ] Website traffic: Measure % from YouTube referrals
- [ ] GitHub Discussions: Note any uptick in new user questions

### Phase 3 Success (Full Series)

#### Content Complete
- [ ] 11 videos total published (or 7-8 if Phase 2 gate trims scope)
- [ ] Regular upload schedule maintained

#### Channel Growth
- [ ] YouTube subscribers: 200-500+ (realistic for niche tool)
- [ ] Total channel views: 2000-5000+

#### User Adoption Signal
- [ ] >30% of new users mention "saw video" in surveys/discussions
- [ ] Video traffic drives 10-20% of website visits
- [ ] Reduced repetitive "how do I start?" support questions

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
- **Emphasize stable concepts and commands**:
  - Core concepts: Tiered memory (HOT/WARM/COLD), token optimization
  - Stable commands: `init`, `validate`, `status`, `prompt init-session`
  - Avoid deep-diving into volatile flags/options that may change
- **Template reuse**: Create reusable intro/outro segments, terminal animations
- **Version pinning**: Note Cortex TMS version in video description
- **Update strategy**:
  - Add pinned comment with updates for breaking changes
  - Refresh videos every 6-12 months if major CLI changes
  - For minor changes, update docs and link in comments

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
- Phase 1: 1 week (6.5 hours focused work)
- Phase 2: 2-3 weeks (25 hours focused work)
- **GATE**: Evaluate Phase 2 results before Phase 3
- Phase 3: 4-6 weeks (40 hours focused work) *if Phase 2 succeeds*

**Total**: 2-3 months for full series (11 videos) *if both gates pass*

---

**Decision Points**:
1. **After Phase 1**: Evaluate if workflow is sustainable (<4 hours per video)
2. **After Phase 2**: Evaluate engagement, retention, product metrics before committing to Phase 3

<!-- @cortex-tms-version 3.1.0 -->
