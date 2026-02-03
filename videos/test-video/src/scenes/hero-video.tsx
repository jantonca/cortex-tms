import { makeScene2D, Txt, Rect, Layout, Circle, Img } from '@motion-canvas/2d'
import { all, createRef, waitFor } from '@motion-canvas/core'
import logo from '../assets/logo.svg'

export default makeScene2D(function* (view) {
  // Dark background
  view.fill('#0a0a0a')

  // ========== SCENE 1: PROBLEM (10s) ==========
  const logo1 = createRef<Img>()
  const warning = createRef<Txt>()
  const problemText = createRef<Txt>()
  const tagline = createRef<Txt>()

  view.add(
    <>
      <Img
        ref={logo1}
        src={logo}
        width={160}
        y={-420}
        opacity={0}
      />
      <Txt
        ref={warning}
        fontSize={140}
        fill={'#f44336'}
        y={-140}
        opacity={0}
        shadowColor={'rgba(244, 67, 54, 0.5)'}
        shadowBlur={30}
      >
        ⚠️
      </Txt>
      <Txt
        ref={problemText}
        fontSize={72}
        fill={'#ffffff'}
        fontWeight={800}
        textAlign={'center'}
        maxWidth={1700}
        lineHeight={95}
        opacity={0}
        y={60}
        shadowColor={'rgba(0, 0, 0, 0.3)'}
        shadowBlur={10}
      />
      <Txt
        ref={tagline}
        fontSize={48}
        fill={'#f97316'}
        y={220}
        opacity={0}
        fontWeight={600}
      >
        There's a better way.
      </Txt>
    </>,
  )

  // Logo entrance
  logo1().scale(0.8)
  yield* all(logo1().opacity(1, 0.6), logo1().scale(1, 0.6))
  yield* waitFor(0.4)

  // Warning icon with pulse
  yield* all(warning().opacity(1, 0.4), warning().scale(1.3, 0.4))
  yield* warning().scale(1, 0.3)
  yield* waitFor(0.4)

  // Problem text types in
  yield* problemText().opacity(1, 0.4)
  yield* problemText().text(
    'Tired of AI agents hallucinating\nproject conventions?',
    1.2,
  )
  yield* waitFor(1.2)

  // Tagline appears
  yield* tagline().opacity(1, 0.5)
  yield* waitFor(1.8)

  // Exit with fade
  yield* all(
    logo1().opacity(0, 0.6),
    problemText().opacity(0, 0.6),
    warning().opacity(0, 0.6),
    tagline().opacity(0, 0.6),
  )
  yield* waitFor(0.4)

  // ========== SCENE 2: SOLUTION (10s) ==========
  const title = createRef<Txt>()
  const subtitle = createRef<Txt>()
  const hot = createRef<Rect>()
  const warm = createRef<Rect>()
  const cold = createRef<Rect>()

  view.add(
    <>
      <Txt
        ref={title}
        fontSize={80}
        fill={'#ffffff'}
        fontWeight={800}
        y={-420}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.3)'}
        shadowBlur={10}
      >
        Cortex TMS
      </Txt>
      <Txt
        ref={subtitle}
        fontSize={54}
        fill={'#f97316'}
        y={-340}
        opacity={0}
        fontWeight={600}
      >
        Tiered Memory System
      </Txt>
      <Rect
        ref={cold}
        width={800}
        height={140}
        fill={'#0ea5a4'}
        radius={16}
        y={190}
        opacity={0}
        shadowColor={'rgba(14, 165, 164, 0.5)'}
        shadowBlur={25}
        stroke={'rgba(255, 255, 255, 0.1)'}
        lineWidth={2}
      >
        <Txt
          fontSize={60}
          fill={'#ffffff'}
          fontWeight={800}
          y={-12}
        >
          COLD
        </Txt>
        <Txt
          fontSize={32}
          fill={'rgba(255,255,255,0.95)'}
          y={32}
        >
          Archives, history
        </Txt>
      </Rect>
      <Rect
        ref={warm}
        width={650}
        height={140}
        fill={'#facc15'}
        radius={16}
        y={20}
        opacity={0}
        shadowColor={'rgba(250, 204, 21, 0.5)'}
        shadowBlur={25}
        stroke={'rgba(0, 0, 0, 0.1)'}
        lineWidth={2}
      >
        <Txt
          fontSize={60}
          fill={'#111111'}
          fontWeight={800}
          y={-12}
        >
          WARM
        </Txt>
        <Txt
          fontSize={32}
          fill={'rgba(0,0,0,0.85)'}
          y={32}
        >
          Recent decisions
        </Txt>
      </Rect>
      <Rect
        ref={hot}
        width={550}
        height={140}
        fill={'#f97316'}
        radius={16}
        y={-150}
        opacity={0}
        shadowColor={'rgba(249, 115, 22, 0.6)'}
        shadowBlur={30}
        stroke={'rgba(255, 255, 255, 0.15)'}
        lineWidth={2}
      >
        <Txt
          fontSize={60}
          fill={'#ffffff'}
          fontWeight={800}
          y={-12}
        >
          HOT
        </Txt>
        <Txt
          fontSize={32}
          fill={'rgba(255,255,255,0.95)'}
          y={32}
        >
          Active sprint, patterns
        </Txt>
      </Rect>
    </>,
  )

  // Title entrance
  yield* title().opacity(1, 0.6)
  yield* waitFor(0.3)
  yield* subtitle().opacity(1, 0.6)
  yield* waitFor(0.6)

  // Pyramid builds from bottom to top
  cold().scale(0.9)
  yield* all(cold().opacity(1, 0.5), cold().scale(1, 0.5))
  yield* waitFor(0.5)

  warm().scale(0.9)
  yield* all(warm().opacity(1, 0.5), warm().scale(1, 0.5))
  yield* waitFor(0.5)

  hot().scale(0.9)
  yield* all(hot().opacity(1, 0.5), hot().scale(1, 0.5))
  yield* waitFor(1)

  // Emphasize HOT tier
  yield* all(hot().scale(1.1, 0.4), hot().shadowBlur(50, 0.4))
  yield* all(hot().scale(1, 0.4), hot().shadowBlur(30, 0.4))
  yield* waitFor(2)

  // Exit
  yield* all(
    title().opacity(0, 0.6),
    subtitle().opacity(0, 0.6),
    hot().opacity(0, 0.6),
    warm().opacity(0, 0.6),
    cold().opacity(0, 0.6),
  )
  yield* waitFor(0.4)

  // ========== SCENE 3: VALUE (15s) ==========
  const valueTitle = createRef<Txt>()
  const b1 = createRef<Rect>()
  const b2 = createRef<Rect>()
  const b3 = createRef<Rect>()

  view.add(
    <>
      <Txt
        ref={valueTitle}
        fontSize={70}
        fill={'#ffffff'}
        fontWeight={800}
        textAlign={'center'}
        lineHeight={85}
        y={-320}
        opacity={0}
        shadowColor={'rgba(0, 0, 0, 0.3)'}
        shadowBlur={10}
      >
        Your AI reads only what matters.
      </Txt>
      <Rect
        ref={b1}
        width={1400}
        height={155}
        fill={'#0f0f0f'}
        radius={16}
        y={-80}
        opacity={0}
        shadowBlur={20}
        stroke={'#f97316'}
        lineWidth={3}
      >
        <Layout
          layout
          direction={'row'}
          gap={50}
          alignItems={'center'}
        >
          <Txt
            fontSize={95}
            fill={'#f97316'}
          >
            ⚡
          </Txt>
          <Txt
            fontSize={78}
            fill={'#f97316'}
            fontWeight={800}
          >
            Faster
          </Txt>
          <Txt
            fontSize={75}
            fill={'#20b2aa'}
          >
            ✓
          </Txt>
        </Layout>
      </Rect>
      <Rect
        ref={b2}
        width={1400}
        height={155}
        fill={'#0f0f0f'}
        radius={16}
        y={105}
        opacity={0}
        shadowBlur={20}
        stroke={'#facc15'}
        lineWidth={3}
      >
        <Layout
          layout
          direction={'row'}
          gap={50}
          alignItems={'center'}
        >
          <Txt
            fontSize={95}
            fill={'#facc15'}
          >
            💰
          </Txt>
          <Txt
            fontSize={78}
            fill={'#facc15'}
            fontWeight={800}
          >
            Cheaper
          </Txt>
          <Txt
            fontSize={75}
            fill={'#20b2aa'}
          >
            ✓
          </Txt>
        </Layout>
      </Rect>
      <Rect
        ref={b3}
        width={1400}
        height={155}
        fill={'#0f0f0f'}
        radius={16}
        y={290}
        opacity={0}
        shadowBlur={20}
        stroke={'#0ea5a4'}
        lineWidth={3}
      >
        <Layout
          layout
          direction={'row'}
          gap={50}
          alignItems={'center'}
        >
          <Txt
            fontSize={95}
            fill={'#0ea5a4'}
          >
            🎯
          </Txt>
          <Txt
            fontSize={78}
            fill={'#0ea5a4'}
            fontWeight={800}
          >
            No drift
          </Txt>
          <Txt
            fontSize={75}
            fill={'#20b2aa'}
          >
            ✓
          </Txt>
        </Layout>
      </Rect>
    </>,
  )

  // Title
  yield* valueTitle().opacity(1, 0.6)
  yield* waitFor(0.7)

  // Benefits cascade with pop animation
  b1().scale(0.88)
  yield* all(b1().opacity(1, 0.4), b1().scale(1, 0.4))
  yield* waitFor(1.3)

  b2().scale(0.88)
  yield* all(b2().opacity(1, 0.4), b2().scale(1, 0.4))
  yield* waitFor(1.3)

  b3().scale(0.88)
  yield* all(b3().opacity(1, 0.4), b3().scale(1, 0.4))
  yield* waitFor(2.2)

  // Exit
  yield* all(
    valueTitle().opacity(0, 0.6),
    b1().opacity(0, 0.6),
    b2().opacity(0, 0.6),
    b3().opacity(0, 0.6),
  )
  yield* waitFor(0.4)

  // ========== SCENE 4: TERMINAL DEMO (15s) ==========
  const term = createRef<Rect>()
  const cmd1 = createRef<Txt>()
  const out1 = createRef<Txt>()
  const cmd2 = createRef<Txt>()
  const outHeader = createRef<Txt>()
  const hotLine = createRef<Txt>()
  const warmLine = createRef<Txt>()
  const coldLine = createRef<Txt>()
  const totalLine = createRef<Txt>()
  const costLine = createRef<Txt>()

  view.add(
    <Rect
      ref={term}
      width={1750}
      height={850}
      fill={'rgba(15, 15, 15, 0.95)'}
      radius={24}
      shadowColor={'rgba(249, 115, 22, 0.25)'}
      shadowBlur={60}
      shadowOffsetY={20}
      padding={50}
      opacity={0}
      stroke={'rgba(249, 115, 22, 0.3)'}
      lineWidth={2}
    >
      <Layout
        layout
        direction={'column'}
        gap={20}
        alignItems={'start'}
        width={'100%'}
      >
        {/* Terminal header - macOS style */}
        <Layout
          layout
          direction={'row'}
          gap={10}
          marginBottom={25}
          width={'100%'}
          justifyContent={'space-between'}
        >
          <Layout
            layout
            direction={'row'}
            gap={10}
          >
            <Circle
              size={14}
              fill={'#ff5f57'}
            />
            <Circle
              size={14}
              fill={'#febc2e'}
            />
            <Circle
              size={14}
              fill={'#28c840'}
            />
          </Layout>
          <Txt
            fontSize={26}
            fill={'rgba(255, 255, 255, 0.4)'}
            fontFamily={'"Noto Sans Mono", "SF Mono", Monaco, monospace'}
            fontWeight={500}
          >
            terminal
          </Txt>
        </Layout>

        {/* First command: init */}
        <Layout
          layout
          direction={'row'}
          gap={15}
        >
          <Txt
            fontSize={44}
            fill={'rgba(249, 115, 22, 0.8)'}
            fontFamily={'"Noto Sans Mono", monospace'}
          >
            $
          </Txt>
          <Txt
            ref={cmd1}
            fontSize={44}
            fill={'#ffffff'}
            fontFamily={'"Noto Sans Mono", monospace'}
            fontWeight={500}
          />
        </Layout>
        <Txt
          ref={out1}
          fontSize={38}
          fill={'rgba(40, 200, 64, 0.95)'}
          fontFamily={'"Noto Sans Mono", monospace'}
          opacity={0}
          marginLeft={60}
          fontWeight={500}
        >
          ✓ Created 9 documentation files
        </Txt>

        <Layout height={20} />

        {/* Second command: status with flags */}
        <Layout
          layout
          direction={'row'}
          gap={15}
        >
          <Txt
            fontSize={44}
            fill={'rgba(249, 115, 22, 0.8)'}
            fontFamily={'"Noto Sans Mono", monospace'}
          >
            $
          </Txt>
          <Txt
            ref={cmd2}
            fontSize={44}
            fill={'#ffffff'}
            fontFamily={'"Noto Sans Mono", monospace'}
            fontWeight={500}
          />
        </Layout>

        <Layout height={10} />

        {/* Status output header */}
        <Txt
          ref={outHeader}
          fontSize={40}
          fill={'rgba(255, 255, 255, 0.95)'}
          fontFamily={'"Noto Sans Mono", monospace'}
          fontWeight={600}
          opacity={0}
        >
          📊 Token Analysis
        </Txt>

        {/* Tier breakdown */}
        <Txt
          ref={hotLine}
          fontSize={36}
          fill={'rgba(249, 115, 22, 0.95)'}
          fontFamily={'"Noto Sans Mono", monospace'}
          opacity={0}
          marginLeft={40}
        >
          HOT (Active): 32,450 tokens
        </Txt>
        <Txt
          ref={warmLine}
          fontSize={36}
          fill={'rgba(250, 204, 21, 0.95)'}
          fontFamily={'"Noto Sans Mono", monospace'}
          opacity={0}
          marginLeft={40}
        >
          WARM (Truth): 18,230 tokens
        </Txt>
        <Txt
          ref={coldLine}
          fontSize={36}
          fill={'rgba(14, 165, 164, 0.95)'}
          fontFamily={'"Noto Sans Mono", monospace'}
          opacity={0}
          marginLeft={40}
        >
          COLD (Archive): 50,554 tokens
        </Txt>
        <Txt
          ref={totalLine}
          fontSize={36}
          fill={'rgba(255, 255, 255, 0.6)'}
          fontFamily={'"Noto Sans Mono", monospace'}
          opacity={0}
          marginLeft={40}
        >
          Full repository: 101,234 tokens
        </Txt>

        <Layout height={5} />

        {/* Cost savings */}
        <Txt
          ref={costLine}
          fontSize={42}
          fill={'rgba(40, 200, 64, 0.95)'}
          fontFamily={'"Noto Sans Mono", monospace'}
          fontWeight={700}
          opacity={0}
          shadowColor={'rgba(40, 200, 64, 0.4)'}
          shadowBlur={15}
        >
          💰 68% reduction
        </Txt>
      </Layout>
    </Rect>,
  )

  // Terminal entrance with glass-morphism effect
  term().scale(0.94)
  yield* all(term().opacity(1, 0.7), term().scale(1, 0.7))
  yield* waitFor(0.4)

  // First command - init
  yield* cmd1().text('npx cortex-tms init', 1.0)
  yield* waitFor(0.5)
  yield* out1().opacity(1, 0.3)
  yield* waitFor(1.2)

  // Second command - status with flags
  yield* cmd2().text('npx cortex-tms status --tokens', 1.5)
  yield* waitFor(0.7)

  // Output appears with cascade
  yield* outHeader().opacity(1, 0.3)
  yield* waitFor(0.4)

  yield* hotLine().opacity(1, 0.3)
  yield* waitFor(0.4)

  yield* warmLine().opacity(1, 0.3)
  yield* waitFor(0.4)

  yield* coldLine().opacity(1, 0.3)
  yield* waitFor(0.4)

  yield* totalLine().opacity(1, 0.3)
  yield* waitFor(0.5)

  // Highlight savings with pulse
  yield* costLine().opacity(1, 0.4)
  yield* all(costLine().scale(1.08, 0.3), costLine().shadowBlur(25, 0.3))
  yield* all(costLine().scale(1, 0.3), costLine().shadowBlur(15, 0.3))
  yield* waitFor(2)

  // Terminal exit
  yield* term().opacity(0, 0.7)
  yield* waitFor(0.4)

  // ========== SCENE 5: CTA (10s) ==========
  const logo5 = createRef<Img>()
  const ctaTitle = createRef<Txt>()
  const cmdBox = createRef<Rect>()
  const web = createRef<Txt>()
  const ctaTag = createRef<Txt>()

  view.add(
    <>
      <Img
        ref={logo5}
        src={logo}
        width={160}
        y={-400}
        opacity={0}
      />
      <Txt
        ref={ctaTitle}
        fontSize={76}
        fill={'#ffffff'}
        fontWeight={800}
        y={-230}
        opacity={0}
      >
        Install now:
      </Txt>
      <Rect
        ref={cmdBox}
        width={1450}
        height={190}
        fill={'rgba(15, 15, 15, 0.9)'}
        radius={20}
        y={0}
        opacity={0}
        shadowColor={'rgba(249, 115, 22, 0.5)'}
        shadowBlur={50}
        shadowOffsetY={15}
        stroke={'rgba(249, 115, 22, 0.6)'}
        lineWidth={3}
      >
        <Txt
          fontSize={54}
          fill={'#f97316'}
          fontFamily={'"Noto Sans Mono", "SF Mono", Monaco, monospace'}
          fontWeight={700}
          shadowColor={'rgba(249, 115, 22, 0.4)'}
          shadowBlur={15}
        >
          npx cortex-tms init
        </Txt>
      </Rect>
      <Txt
        ref={web}
        fontSize={68}
        fill={'#f97316'}
        fontWeight={700}
        y={230}
        opacity={0}
        shadowColor={'rgba(249, 115, 22, 0.3)'}
        shadowBlur={10}
      >
        cortex-tms.org
      </Txt>
      <Txt
        ref={ctaTag}
        fontSize={42}
        fill={'#888888'}
        y={320}
        opacity={0}
        fontWeight={500}
      >
        Tiered Memory for AI Agents
      </Txt>
    </>,
  )

  // Logo entrance
  logo5().scale(0.8)
  yield* all(logo5().opacity(1, 0.6), logo5().scale(1, 0.6))
  yield* waitFor(0.4)

  // Title
  yield* ctaTitle().opacity(1, 0.5)
  yield* waitFor(0.5)

  // Command box with emphasis
  cmdBox().scale(0.92)
  yield* all(cmdBox().opacity(1, 0.6), cmdBox().scale(1, 0.6))
  yield* waitFor(0.4)

  // Pulse the command box
  yield* all(cmdBox().scale(1.06, 0.4), cmdBox().shadowBlur(50, 0.4))
  yield* all(cmdBox().scale(1, 0.4), cmdBox().shadowBlur(40, 0.4))
  yield* waitFor(0.6)

  // Website
  yield* web().opacity(1, 0.5)
  yield* waitFor(0.4)

  // Tagline
  yield* ctaTag().opacity(1, 0.5)
  yield* waitFor(2.5)

  // Final fade out
  yield* all(
    logo5().opacity(0, 0.8),
    ctaTitle().opacity(0, 0.8),
    cmdBox().opacity(0, 0.8),
    web().opacity(0, 0.8),
    ctaTag().opacity(0, 0.8),
  )
})
