# Demo Assets

This directory contains demo recordings and promotional assets for Cortex TMS.

## Generating the Demo GIF

### Option 1: VHS (Recommended - Scriptable & Reproducible)

[VHS](https://github.com/charmbracelet/vhs) generates terminal GIFs from tape files.

**Install VHS**:
```bash
# macOS / Linux (Homebrew)
brew install vhs

# Or via Go
go install github.com/charmbracelet/vhs@latest
```

**Generate demo.gif**:
```bash
# From project root
cd /home/jma/repos-ubuntu/github/cortex-tms
vhs assets/demo.tape
```

This creates `assets/demo.gif` (~800KB) showing:
- `cortex status` - Project dashboard with health metrics
- `cortex migrate` - Version detection and upgrade workflow

### Option 2: Asciinema + agg (Alternative)

```bash
# Install asciinema
sudo apt install asciinema  # or brew install asciinema

# Record session
asciinema rec assets/demo.cast

# Run commands during recording:
# - cortex status
# - cortex migrate

# Convert to GIF using agg
cargo install --git https://github.com/asciinema/agg
agg assets/demo.cast assets/demo.gif
```

### Option 3: Manual Screen Recording

Use any screen recorder:
- **macOS**: QuickTime Player (⌘+Shift+5) or Kap
- **Linux**: Peek, SimpleScreenRecorder
- **Windows**: OBS Studio, ShareX

Record terminal showing the commands, then convert to GIF if needed.

## Demo Content

The demo should showcase:

1. **cortex status** - Show the project cockpit with:
   - Health status indicator
   - Current sprint from NEXT-TASKS.md
   - File validation results
   - Available commands

2. **cortex migrate** - Show version management:
   - Detect template versions
   - Show LATEST/OUTDATED/CUSTOMIZED status
   - Demonstrate safety features (backup creation)

**Ideal demo duration**: 20-30 seconds
**Target file size**: <1MB for README embedding

## File Specifications

- **Format**: GIF (best GitHub compatibility)
- **Dimensions**: 1200x600px (16:10 aspect ratio)
- **Frame rate**: 10-15 FPS
- **Optimization**: Use gifsicle or ezgif.com to reduce file size

```bash
# Optimize GIF size
gifsicle -O3 --colors 256 assets/demo.gif -o assets/demo-optimized.gif
```
