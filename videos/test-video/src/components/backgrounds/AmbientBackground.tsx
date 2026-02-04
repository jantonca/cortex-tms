import {Circle, View2D, Layout, blur} from '@motion-canvas/2d';
import {
  all,
  createRef,
  loop,
  easeInOutSine,
  Reference,
} from '@motion-canvas/core';

export interface AmbientBackgroundProps {
  view: View2D;
  bgColor?: string;
  /** Pumpkin Spice glow color */
  glow1Color?: string;
  /** Amber glow color */
  glow2Color?: string;
  /** White glow color */
  glow3Color?: string;
  /** Start with circles hidden (for delayed reveal) */
  startHidden?: boolean;
  /** Reference to container for controlling visibility */
  containerRef?: Reference<Layout>;
}

/**
 * Animated ambient background with 3 glowing circles
 * Creates a liquid, website-style background effect
 */
export function* AmbientBackground({
  view,
  bgColor = '#111111',
  glow1Color = '#f97316', // Pumpkin Spice
  glow2Color = '#ffa500', // Amber
  glow3Color = '#ffffff', // White
  startHidden = false,
  containerRef,
}: AmbientBackgroundProps) {
  // Set background color
  view.fill(bgColor);

  const bgGlow1 = createRef<Circle>();
  const bgGlow2 = createRef<Circle>();
  const bgGlow3 = createRef<Circle>();

  const container = containerRef || createRef<Layout>();
  const initialOpacity = startHidden ? 0 : 1;

  view.add(
    <Layout ref={container} opacity={initialOpacity}>
      {/* Pumpkin Spice glow at 15% 50% */}
      <Circle
        ref={bgGlow1}
        size={2000}
        x={-640}
        y={0}
        opacity={0.15}
        fill={glow1Color}
        shadowColor={glow1Color}
        shadowBlur={400}
        filters={[blur(10)]}
      />
      {/* Amber glow at 85% 30% */}
      <Circle
        ref={bgGlow2}
        size={1800}
        x={640}
        y={-200}
        opacity={0.1}
        fill={glow2Color}
        shadowColor={glow2Color}
        shadowBlur={350}
        filters={[blur(10)]}
      />
      {/* White glow at 50% 90% */}
      <Circle
        ref={bgGlow3}
        size={1600}
        x={0}
        y={400}
        opacity={0.03}
        fill={glow3Color}
        shadowColor={glow3Color}
        shadowBlur={300}
        filters={[blur(10)]}
      />
    </Layout>,
  );

  // Animate ambient background with smooth movements
  yield loop(Infinity, function* () {
    yield* all(
      bgGlow1().position.x(-640 + 100, 8, easeInOutSine),
      bgGlow1().position.y(0 + 50, 8, easeInOutSine),
      bgGlow2().position.x(640 - 80, 10, easeInOutSine),
      bgGlow2().position.y(-200 + 60, 10, easeInOutSine),
      bgGlow3().position.x(0 + 40, 12, easeInOutSine),
      bgGlow3().position.y(400 - 30, 12, easeInOutSine),
    );
    yield* all(
      bgGlow1().position.x(-640 - 100, 8, easeInOutSine),
      bgGlow1().position.y(0 - 50, 8, easeInOutSine),
      bgGlow2().position.x(640 + 80, 10, easeInOutSine),
      bgGlow2().position.y(-200 - 60, 10, easeInOutSine),
      bgGlow3().position.x(0 - 40, 12, easeInOutSine),
      bgGlow3().position.y(400 + 30, 12, easeInOutSine),
    );
  });
}
