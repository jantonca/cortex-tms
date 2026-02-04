<!-- @cortex-tms-tier WARM -->
# Creating Videos for Cortex TMS

This guide covers the technical workflow for creating and maintaining video content using Motion Canvas.

## Overview

Video content is created using [Motion Canvas](https://motioncanvas.io/), a TypeScript-based animation library that allows programmatic video creation with code.

**Project Location**: `videos/test-video/`

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm package manager
- ffmpeg (for video conversion)

### Setup

```bash
cd videos/test-video
pnpm install
pnpm run serve
```

This starts the Motion Canvas editor at `http://localhost:9000`.

---

## Project Structure

```
videos/test-video/
├── src/
│   ├── components/      # Reusable components
│   │   ├── backgrounds/ # AmbientBackground, etc.
│   │   ├── terminal/    # Terminal UI components
│   │   └── ui/          # BenefitCard, TierBox, etc.
│   ├── scenes/          # Video scenes
│   │   ├── hero-video.tsx         # Main scene
│   │   └── hero-video-scenes.ts   # Scene helpers
│   ├── assets/          # Images, logos
│   └── brand.ts         # Brand colors & fonts
├── export-video.sh      # Export script
├── README.md            # Technical documentation
└── DEPLOY.md            # Deployment guide
```

---

## Brand Consistency

All videos use the official brand system:

**Colors** (from `src/brand.ts`):
- Primary: Pumpkin Spice `#f97316`
- Accent: Bright Amber `#facc15`
- Accent: Light Sea Green `#0ea5a4`
- Base: Onyx `#111111`

**Fonts**:
- Body: Noto Sans Variable
- Headings: Noto Serif Variable
- Code: Noto Sans Mono

**Source**: Brand palette is maintained in `cortex-tms-internal` repository (private).

---

## Creating a New Video

### 1. Create Scene File

```bash
cd videos/test-video/src/scenes
# Create new scene (e.g., tutorial-quick-start.tsx)
```

### 2. Use Reusable Components

```typescript
import {AmbientBackground, Terminal, BenefitCard} from '../components';
import {BRAND_COLORS, BRAND_FONTS} from '../brand';

export default makeScene2D(function* (view) {
  // Setup background
  const bgContainer = createRef<Layout>();
  yield* AmbientBackground({view, startHidden: true, containerRef: bgContainer});

  // Use brand colors
  <Txt fill={BRAND_COLORS.pumpkinSpice} fontFamily={BRAND_FONTS.mono} />
});
```

### 3. Register Scene

Update `src/project.ts`:
```typescript
import newScene from './scenes/new-scene?scene';

export default makeProject({
  scenes: [newScene],
});
```

---

## Export Workflow

### 1. Render in Motion Canvas

1. Open editor: `pnpm run serve`
2. Preview scene
3. Click **"Render"** button
4. Wait for frame export to complete

### 2. Convert to Video

```bash
./export-video.sh output-name
```

This automatically:
- Converts PNG sequence to MP4
- Uses optimized settings (ultrafast preset)
- Cleans up PNG files to save space (~1GB)

### 3. Trim if Needed

```bash
ffmpeg -i video.mp4 -t 50 -c copy video-50s.mp4 -y
```

---

## Component Library

### AmbientBackground

Animated background with glowing circles:

```typescript
yield* AmbientBackground({
  view,
  startHidden: true,      // Optional: fade in later
  containerRef: bgRef,    // Optional: control visibility
});
```

### Terminal

CLI demonstration component:

```typescript
<Terminal width={1600} height={800}>
  <CommandLine command={cmdRef} prompt="$" />
  <OutputLine text={outRef} color="#20b2aa" icon="✓" />
</Terminal>
```

### UI Components

- **BenefitCard**: Icon + label + checkmark cards
- **TierBox**: HOT/WARM/COLD tier visualization

See `videos/test-video/README.md` for full component documentation.

---

## Deployment

Video files are **NOT committed to Git** (tracked in `.gitignore`).

**Deployment process**:
1. Export final video locally
2. Upload to YouTube or video hosting
3. Embed on website using video ID
4. Delete local MP4 after upload

See `videos/test-video/DEPLOY.md` for detailed deployment instructions.

---

## File Size Guidelines

- **Target**: <8MB for 50-second video
- **Resolution**: 1920x1080 (1080p)
- **Format**: MP4 (H.264)
- **Frame rate**: 30fps

---

## Troubleshooting

### "Layout is not defined" error
- Make sure imports include all components used in JSX

### Video too long
- Check scene timing in Motion Canvas editor timeline
- Trim with ffmpeg after export

### Large file size
- Use faster preset (already in export script)
- Reduce video length
- Lower quality (increase crf value in script)

### PNGs taking up space
- Run `./export-video.sh` - auto-cleans after conversion
- Or manually: `rm -rf output/project/*.png`

---

## References

- **Motion Canvas Docs**: https://motioncanvas.io/docs
- **Video Project README**: `videos/test-video/README.md`
- **Deployment Guide**: `videos/test-video/DEPLOY.md`
- **Brand System**: `videos/test-video/src/brand.ts`

---

## Contributing

When creating new videos:
1. Follow brand guidelines (colors, fonts)
2. Use reusable components where possible
3. Test export workflow before final render
4. Document new components in README
5. Keep videos under 8MB when possible

<!-- @cortex-tms-version 3.1.0 -->
