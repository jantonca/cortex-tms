# GitHub Assets

This directory contains assets for GitHub repository customization.

## Social Preview Image

**File**: `social-preview.svg`
**Purpose**: Custom image shown when repository is shared on social media (Twitter, LinkedIn, Slack, etc.)
**Dimensions**: 1200x630px (OpenGraph standard)

### How to Set Up

1. **Convert SVG to PNG** (GitHub requires PNG for social preview):
   ```bash
   # Using ImageMagick (install: brew install imagemagick)
   convert -density 300 social-preview.svg -resize 1200x630 social-preview.png

   # Or using Inkscape
   inkscape social-preview.svg --export-png=social-preview.png --export-width=1200 --export-height=630

   # Or use an online converter: https://cloudconvert.com/svg-to-png
   ```

2. **Upload to GitHub**:
   - Go to: https://github.com/cortex-tms/cortex-tms/settings
   - Scroll to "Social preview"
   - Click "Edit"
   - Upload `social-preview.png`
   - Save changes

3. **Test it**:
   - Share your repo URL on Twitter/LinkedIn
   - Use https://www.opengraph.xyz/ to preview
   - Check https://cards-dev.twitter.com/validator

### Customization

To update the image:
1. Edit `social-preview.svg`
2. Re-convert to PNG
3. Re-upload to GitHub

**Alternative**: Use your existing logo by replacing the simplified circles in the SVG with your actual logo from `website/public/logo.svg`.

---

## Impact

With **146 stars** and growing traffic, this ensures professional presentation when your repo is shared, increasing:
- Click-through rates from social shares
- Professional perception
- Community engagement
