# Video Deployment Guide

## 📹 Final Video

**File**: `hero-video-final-50s.mp4`
- Duration: 50 seconds
- Size: 3.6MB
- Resolution: 1920x1080 (1080p)
- Format: MP4 (H.264)

---

## 🚀 Deployment Steps

### 1. Upload to YouTube

1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click **"Create"** → **"Upload videos"**
3. Upload `hero-video-final-50s.mp4`

**Video Details:**
```
Title: Cortex TMS - Stop AI Hallucinations with Tiered Memory
Description:
Tired of AI agents hallucinating project conventions?

Cortex TMS organizes your docs into HOT, WARM, and COLD tiers.
Your AI reads only what matters—faster, cheaper, with no drift.

⚡ 60-70% context reduction
💰 Lower costs
🎯 No drift

Try it instantly:
npx cortex-tms init

🔗 Links:
- Docs: https://cortex-tms.org
- GitHub: https://github.com/cortex-tms/cortex-tms
- Discussions: https://github.com/cortex-tms/cortex-tms/discussions

📖 Chapters:
0:00 - Problem: AI hallucinations
0:08 - Solution: Tiered Memory System
0:17 - Value: Faster, Cheaper, No drift
0:25 - Demo: CLI commands
0:42 - Call to Action

#cortex-tms #ai #llm #context-management #tiered-memory #claude #cursor #copilot

Tags: cortex-tms, ai, llm, context management, tiered memory, claude, cursor, github copilot, ai coding, developer tools
```

**Thumbnail**: Create custom thumbnail with logo + "Stop AI Hallucinations" text

**Visibility**:
- Start with **Unlisted** for testing
- Change to **Public** after validation

---

### 2. Embed on Website

Once uploaded to YouTube, get the video ID and embed:

**File**: `website/src/pages/index.astro` (or relevant page)

```astro
---
const heroVideoId = "YOUR_YOUTUBE_VIDEO_ID";
---

<section class="hero-video">
  <h2>See Cortex TMS in Action</h2>
  <div class="video-container">
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${heroVideoId}`}
      title="Cortex TMS Hero Video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</section>
```

**Or use lazy-loading component** (better performance):
- Create `VideoPlayer.tsx` component (as planned in Phase 2)
- Load iframe only when user clicks play

---

### 3. Clean Up Local Files

After successful upload:
```bash
# Optional: Delete local MP4 (can always re-export from source)
rm hero-video-final-50s.mp4

# Source code remains in Git for future updates
```

---

## 🔄 Re-exporting Video (if needed)

If you need to update the video:

1. **Make changes** in Motion Canvas editor
2. **Render** new frame sequence
3. **Export**:
   ```bash
   ./export-video.sh hero-video-v2
   ```
4. **Trim** (if needed):
   ```bash
   ffmpeg -i hero-video-v2.mp4 -t 50 -c copy hero-video-v2-50s.mp4 -y
   ```
5. **Upload** new version to YouTube (or create new video)

---

## 📊 Post-Deployment Tracking

After deploying:
- [ ] Update `docs/tasks/video-tutorials-sprint.md` - Mark Phase 1 complete
- [ ] Track YouTube analytics (views, retention, engagement)
- [ ] Monitor website traffic from video
- [ ] Collect user feedback (3-5 testers)
- [ ] Decide: Proceed to Phase 2 or iterate?

---

## 🎯 Success Metrics (Phase 1)

- [ ] 3/5 testers understand the tool in <50 seconds
- [ ] 3/5 testers can state next action ("try npx" or "visit site")
- [ ] Video quality acceptable for public release
- [ ] YouTube retention >60% average
- [ ] Positive sentiment in comments/feedback

See: `docs/tasks/video-tutorials-sprint.md` for full metrics
