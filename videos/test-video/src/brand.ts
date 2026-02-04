// Cortex TMS Brand Identity
// Source: cortex-tms-internal/branding/colors/palette.scss
// Official palette: https://coolors.co/111111-f97316-facc15-0ea5a4

export const BRAND_COLORS = {
  // Official brand palette (4 core colors)
  onyx: '#111111',        // Onyx - deep black
  pumpkinSpice: '#f97316', // Pumpkin Spice - primary orange
  brightAmber: '#facc15',  // Bright Amber - yellow/gold
  lightSeaGreen: '#0ea5a4', // Light Sea Green - teal

  // Aliases for convenience
  orange: '#f97316',      // Pumpkin Spice (alias)
  yellow: '#facc15',      // Bright Amber (alias)
  teal: '#0ea5a4',        // Light Sea Green (alias)
  black: '#111111',       // Onyx (alias)
  white: '#ffffff',       // Pure white

  // Semantic colors
  success: '#0ea5a4',     // Light Sea Green (official teal)
  warning: '#facc15',     // Bright Amber (official yellow)
  error: '#f44336',       // Red (not in official palette, but needed)

  // Backgrounds
  bgDark: '#0a0a0a',      // Very dark (video background)
  bgTerminal: '#1a1a1a',  // Terminal background

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textMuted: '#666666',
};

// Official typography (from website/src/styles/custom.css)
// Note: Motion Canvas uses canvas rendering, so fonts must be installed on system
// or loaded via @font-face in the HTML. Fallbacks ensure rendering works.
export const BRAND_FONTS = {
  // Noto font family (official brand fonts)
  sans: '"Noto Sans Variable", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  serif: '"Noto Serif Variable", Georgia, "Times New Roman", serif',
  mono: '"Noto Sans Mono", "Fira Code", "Consolas", "Monaco", "Courier New", ui-monospace, monospace',

  // Heading font (uses serif)
  heading: '"Noto Serif Variable", Georgia, serif',
};

export const BRAND_TIMING = {
  // Standard animation durations
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.0,

  // Typewriter effect
  charDelay: 0.05,  // Per character
};

export const BRAND_EFFECTS = {
  // Shadow for depth
  shadow: 'rgba(0, 0, 0, 0.3) 0px 4px 12px',
  shadowStrong: 'rgba(0, 0, 0, 0.5) 0px 8px 24px',

  // Glow effects
  glowOrange: `0 0 20px ${BRAND_COLORS.orange}40`,
  glowTeal: `0 0 20px ${BRAND_COLORS.teal}40`,
  glowGreen: `0 0 20px ${BRAND_COLORS.success}40`,
};
