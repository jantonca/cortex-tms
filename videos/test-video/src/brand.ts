// Cortex TMS Brand Identity
// Colors from logo and website

export const BRAND_COLORS = {
  // Primary brand colors (from logo)
  orange: '#f97316',      // Pumpkin Spice - primary
  yellow: '#facc15',      // Gold accent
  teal: '#0ea5a4',        // Cyan/teal accent
  black: '#111111',       // Onyx
  white: '#ffffff',       // Pure white

  // Semantic colors
  success: '#20b2aa',     // Light Sea Green
  warning: '#ffa500',     // Bright Amber
  error: '#f44336',       // Red

  // Backgrounds
  bgDark: '#0a0a0a',      // Very dark (video background)
  bgTerminal: '#1a1a1a',  // Terminal background

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textMuted: '#666666',
};

export const BRAND_FONTS = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: '"Noto Sans Mono", "SF Mono", Monaco, Consolas, monospace',
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
