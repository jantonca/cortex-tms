/**
 * Hero Video Scene Helpers
 *
 * Individual scene generators for the hero video.
 * Each function is responsible for one conceptual scene.
 */

import {Txt, Rect, Circle, Img, Layout, View2D} from '@motion-canvas/2d';
import {all, createRef, waitFor, Reference} from '@motion-canvas/core';
import {BRAND_COLORS} from '../brand';

// ========== SCENE 1: PROBLEM ==========
export interface ProblemSceneRefs {
  logo: Reference<Img>;
  warning: Reference<Txt>;
  problemText: Reference<Txt>;
  tagline: Reference<Txt>;
  bgContainer: Reference<Layout>; // Container for ambient background
}

export function* playProblemScene(refs: ProblemSceneRefs) {
  const {logo, warning, problemText, tagline, bgContainer} = refs;

  // 1. Logo entrance FIRST (on dark background, no ambient yet)
  logo().scale(0.8);
  yield* all(logo().opacity(1, 0.6), logo().scale(1, 0.6));
  yield* waitFor(0.5);

  // 2. Fade in ambient background AFTER logo
  yield* bgContainer().opacity(1, 1.0);
  yield* waitFor(0.3);

  // 3. Warning icon with pulse
  yield* all(warning().opacity(1, 0.4), warning().scale(1.3, 0.4));
  yield* warning().scale(1, 0.3);
  yield* waitFor(0.4);

  // 4. Problem text types in
  yield* problemText().opacity(1, 0.4);
  yield* problemText().text(
    'Tired of AI agents hallucinating\nproject conventions?',
    1.2,
  );
  yield* waitFor(1.2);

  // 5. Tagline appears
  yield* tagline().opacity(1, 0.5);
  yield* waitFor(1.8);

  // Exit with fade
  yield* all(
    logo().opacity(0, 0.6),
    problemText().opacity(0, 0.6),
    warning().opacity(0, 0.6),
    tagline().opacity(0, 0.6),
  );
  yield* waitFor(0.4);
}

// ========== SCENE 2: SOLUTION (TIERED MEMORY) ==========
export interface SolutionSceneRefs {
  title: Reference<Txt>;
  subtitle: Reference<Txt>;
  hot: Reference<Rect>;
  warm: Reference<Rect>;
  cold: Reference<Rect>;
}

export function* playSolutionScene(refs: SolutionSceneRefs) {
  const {title, subtitle, hot, warm, cold} = refs;

  // Title entrance
  yield* title().opacity(1, 0.6);
  yield* waitFor(0.3);
  yield* subtitle().opacity(1, 0.6);
  yield* waitFor(0.6);

  // Pyramid builds from bottom to top
  cold().scale(0.9);
  yield* all(cold().opacity(1, 0.5), cold().scale(1, 0.5));
  yield* waitFor(0.5);

  warm().scale(0.9);
  yield* all(warm().opacity(1, 0.5), warm().scale(1, 0.5));
  yield* waitFor(0.5);

  hot().scale(0.9);
  yield* all(hot().opacity(1, 0.5), hot().scale(1, 0.5));
  yield* waitFor(1);

  // Emphasize HOT tier
  yield* all(hot().scale(1.1, 0.4), hot().shadowBlur(50, 0.4));
  yield* all(hot().scale(1, 0.4), hot().shadowBlur(30, 0.4));
  yield* waitFor(2);

  // Exit
  yield* all(
    title().opacity(0, 0.6),
    subtitle().opacity(0, 0.6),
    hot().opacity(0, 0.6),
    warm().opacity(0, 0.6),
    cold().opacity(0, 0.6),
  );
  yield* waitFor(0.4);
}

// ========== SCENE 3: VALUE PROPOSITION ==========
export interface ValueSceneRefs {
  valueTitle: Reference<Txt>;
  b1: Reference<Rect>;
  b2: Reference<Rect>;
  b3: Reference<Rect>;
}

export function* playValueScene(refs: ValueSceneRefs) {
  const {valueTitle, b1, b2, b3} = refs;

  // Title
  yield* valueTitle().opacity(1, 0.6);
  yield* waitFor(0.7);

  // Benefits cascade with pop animation
  b1().scale(0.88);
  yield* all(b1().opacity(1, 0.4), b1().scale(1, 0.4));
  yield* waitFor(1.3);

  b2().scale(0.88);
  yield* all(b2().opacity(1, 0.4), b2().scale(1, 0.4));
  yield* waitFor(1.3);

  b3().scale(0.88);
  yield* all(b3().opacity(1, 0.4), b3().scale(1, 0.4));
  yield* waitFor(2.2);

  // Exit
  yield* all(
    valueTitle().opacity(0, 0.6),
    b1().opacity(0, 0.6),
    b2().opacity(0, 0.6),
    b3().opacity(0, 0.6),
  );
  yield* waitFor(0.4);
}

// ========== SCENE 4: TERMINAL DEMO ==========
export interface TerminalSceneRefs {
  term: Reference<Rect>;
  cmd1: Reference<Txt>;
  out1: Reference<Txt>;
  cmd2: Reference<Txt>;
  outHeader: Reference<Txt>;
  hotLine: Reference<Txt>;
  warmLine: Reference<Txt>;
  coldLine: Reference<Txt>;
  totalLine: Reference<Txt>;
  costLine: Reference<Txt>;
  cmd2Prompt: Reference<Layout>;
}

export function* playTerminalScene(refs: TerminalSceneRefs) {
  const {
    term,
    cmd1,
    out1,
    cmd2,
    outHeader,
    hotLine,
    warmLine,
    coldLine,
    totalLine,
    costLine,
    cmd2Prompt,
  } = refs;

  // Terminal entrance with glass-morphism effect
  term().scale(0.94);
  yield* all(term().opacity(1, 0.7), term().scale(1, 0.7));
  yield* waitFor(0.4);

  // First command - init
  yield* cmd1().text('npx cortex-tms init', 1.0);
  yield* waitFor(0.5);
  yield* out1().opacity(1, 0.3);
  yield* waitFor(1.2);

  // Second command - status with flags
  yield* cmd2Prompt().opacity(1, 0.2);
  yield* cmd2().text('npx cortex-tms status --tokens', 1.5);
  yield* waitFor(0.7);

  // Output appears with cascade
  yield* outHeader().opacity(1, 0.3);
  yield* waitFor(0.4);

  yield* hotLine().opacity(1, 0.3);
  yield* waitFor(0.4);

  yield* warmLine().opacity(1, 0.3);
  yield* waitFor(0.4);

  yield* coldLine().opacity(1, 0.3);
  yield* waitFor(0.4);

  yield* totalLine().opacity(1, 0.3);
  yield* waitFor(0.5);

  // Highlight savings with pulse
  yield* costLine().opacity(1, 0.4);
  yield* all(costLine().scale(1.08, 0.3), costLine().shadowBlur(25, 0.3));
  yield* all(costLine().scale(1, 0.3), costLine().shadowBlur(15, 0.3));
  yield* waitFor(2);

  // Terminal exit
  yield* term().opacity(0, 0.7);
  yield* waitFor(0.4);
}

// ========== SCENE 5: CALL TO ACTION ==========
export interface CTASceneRefs {
  logo: Reference<Img>;
  ctaTitle: Reference<Txt>;
  cmdBox: Reference<Rect>;
  web: Reference<Txt>;
  ctaTag: Reference<Txt>;
}

export function* playCTAScene(refs: CTASceneRefs) {
  const {logo, ctaTitle, cmdBox, web, ctaTag} = refs;

  // Logo entrance
  logo().scale(0.8);
  yield* all(logo().opacity(1, 0.6), logo().scale(1, 0.6));
  yield* waitFor(0.4);

  // Title
  yield* ctaTitle().opacity(1, 0.5);
  yield* waitFor(0.5);

  // Command box with emphasis
  cmdBox().scale(0.92);
  yield* all(cmdBox().opacity(1, 0.6), cmdBox().scale(1, 0.6));
  yield* waitFor(0.4);

  // Pulse the command box
  yield* all(cmdBox().scale(1.06, 0.4), cmdBox().shadowBlur(50, 0.4));
  yield* all(cmdBox().scale(1, 0.4), cmdBox().shadowBlur(40, 0.4));
  yield* waitFor(0.6);

  // Website
  yield* web().opacity(1, 0.5);
  yield* waitFor(0.4);

  // Tagline
  yield* ctaTag().opacity(1, 0.5);
  yield* waitFor(2.5);

  // Final fade out
  yield* all(
    logo().opacity(0, 0.8),
    ctaTitle().opacity(0, 0.8),
    cmdBox().opacity(0, 0.8),
    web().opacity(0, 0.8),
    ctaTag().opacity(0, 0.8),
  );
}
