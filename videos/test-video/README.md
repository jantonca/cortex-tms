# Cortex TMS Video Projects

Motion Canvas video production for Cortex TMS marketing and tutorials.

**Hero Video Status**: ✅ Complete (~50s, ready for YouTube/website)

**Deployment**: See [DEPLOY.md](./DEPLOY.md) for upload instructions

## Project Structure

```
src/
├── components/              # Reusable components
│   ├── backgrounds/         # Background effects
│   │   ├── AmbientBackground.tsx
│   │   └── index.ts
│   ├── terminal/            # Terminal UI components
│   │   ├── Terminal.tsx
│   │   └── index.ts
│   ├── ui/                  # UI components
│   │   ├── BenefitCard.tsx  # Reusable benefit cards
│   │   ├── TierBox.tsx      # HOT/WARM/COLD tier boxes
│   │   └── index.ts
│   └── index.ts             # Main export (use this!)
├── scenes/                  # Video scenes
│   ├── hero-video.tsx       # Main hero video (refactored)
│   └── hero-video-scenes.ts # Scene helper functions
├── assets/                  # Images, SVGs, fonts
├── brand.ts                 # Brand colors, fonts, timing
└── project.ts               # Project configuration
```

## Running the Server

```bash
# From project root
cd videos/test-video

# Start Motion Canvas editor
pnpm run serve

# Export to video (after rendering in editor)
./export-video.sh [output-name]
```

**Note**: Motion Canvas exports image sequences (~1GB of PNGs). The export script automatically converts to MP4 and cleans up the images to save space.

## Code Organization

The hero video is **refactored for maintainability**:

- **hero-video.tsx** (~500 lines) - Main scene composition, uses helper functions
- **hero-video-scenes.ts** - Individual scene generator functions (`playProblemScene`, `playSolutionScene`, etc.)
- **components/ui/** - Reusable UI components (`BenefitCard`, `TierBox`)

This structure makes it easy to:
- Tweak individual scene timing without scrolling
- Reuse components across multiple videos
- Test scenes in isolation

---

## Using Reusable Components

### Ambient Background

Creates an animated liquid background with glowing circles:

```tsx
import {makeScene2D} from '@motion-canvas/2d';
import {AmbientBackground} from '../components';

export default makeScene2D(function* (view) {
  // Setup animated background (runs infinitely)
  yield* AmbientBackground({view});

  // Your scene content here...
});
```

**Props:**
- `view` - Required: The Motion Canvas view
- `bgColor` - Optional: Background color (default: `#111111`)
- `glow1Color` - Optional: Pumpkin spice glow (default: `#f97316`)
- `glow2Color` - Optional: Amber glow (default: `#ffa500`)
- `glow3Color` - Optional: White glow (default: `#ffffff`)

### UI Components

**BenefitCard** - Icon + label + checkmark cards:

```tsx
import {BenefitCard} from '../components';
import {createRef} from '@motion-canvas/core';

const card = createRef<Rect>();

view.add(
  <BenefitCard
    cardRef={card}
    icon="⚡"
    iconColor="#f97316"
    label="Faster"
    labelColor="#f97316"
    y={100}
  />
);

// Animate
card().scale(0.9);
yield* all(card().opacity(1, 0.4), card().scale(1, 0.4));
```

**TierBox** - HOT/WARM/COLD tier boxes:

```tsx
import {TierBox} from '../components';
import {BRAND_COLORS} from '../brand';

view.add(
  <TierBox
    tierRef={hot}
    tierName="HOT"
    description="Active sprint, patterns"
    color={BRAND_COLORS.orange}
    width={550}
    y={-150}
  />
);
```

### Terminal Components

Terminal UI components for CLI demonstrations:

```tsx
import {Terminal, CommandLine, OutputLine} from '../components';
import {makeRef} from '@motion-canvas/core';

// In your scene:
const commandRef = makeRef<Txt>();
const outputRef = makeRef<Txt>();

view.add(
  <Terminal width={1600} height={800}>
    <CommandLine command={commandRef} prompt="$" />
    <OutputLine text={outputRef} color="#20b2aa" icon="✓" />
  </Terminal>
);

// Animate
yield* commandRef().text('npx cortex-tms init', 1.0);
yield* outputRef().text('Created 9 documentation files', 0.5);
```

**Terminal Props:**
- `width` - Optional: Terminal width (default: 1600)
- `height` - Optional: Terminal height (default: 800)
- `padding` - Optional: Internal padding (default: 40)

## Brand System

All brand colors, fonts, and timing are centralized in `brand.ts`:

```tsx
import {BRAND_COLORS, BRAND_FONTS, BRAND_TIMING, BRAND_EFFECTS} from '../brand';

// Use in your scenes
<Txt fill={BRAND_COLORS.pumpkinSpice} fontFamily={BRAND_FONTS.mono} />
```

**Official Brand:**
- **Colors**: From `cortex-tms-internal/branding/colors/palette.scss`
  - Onyx (`#111111`), Pumpkin Spice (`#f97316`), Bright Amber (`#facc15`), Light Sea Green (`#0ea5a4`)
- **Fonts**: From `website/src/styles/custom.css`
  - Noto Sans Variable (body), Noto Serif Variable (headings), Noto Sans Mono (code)

**Note**: Noto fonts must be installed on your system for Motion Canvas to render them correctly. Fallback fonts (system-ui, Georgia, Consolas) will be used if Noto fonts are unavailable.

## Creating New Videos

1. Create a new scene file in `src/scenes/`
2. Import reusable components: `import {AmbientBackground, Terminal} from '../components'`
3. Use brand constants from `brand.ts`
4. Register scene in `project.ts`

## Tips

- **Keep scenes focused**: One scene = one concept (8-15s)
- **Reuse components**: Don't recreate Terminal or Background inline
- **Use brand constants**: Never hardcode colors or fonts
- **Export clean**: Use component index files for cleaner imports
- **Terminal output**: Stylize for clarity - exact CLI output isn't required
- **Timing**: Shorter is often better for homepage heroes (45-50s vs 60s)
