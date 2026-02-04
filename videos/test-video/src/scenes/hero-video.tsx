/**
 * Hero Video - Refactored Version
 *
 * 60-second hero video for Cortex TMS homepage
 * Demonstrates tiered memory system and value proposition
 *
 * Scenes:
 * 1. Problem (8s) - AI agents hallucinating conventions
 * 2. Solution (9s) - Tiered memory (HOT/WARM/COLD)
 * 3. Value (8s) - Faster, Cheaper, No drift
 * 4. Terminal Demo (17s) - CLI commands with token savings
 * 5. CTA (8s) - npx cortex-tms init
 */

import {makeScene2D, Txt, Rect, Layout, Circle, Img} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';
import {AmbientBackground, BenefitCard, TierBox} from '../components';
import {BRAND_COLORS, BRAND_FONTS} from '../brand';
import logo from '../assets/logo.svg';
import {
  playProblemScene,
  playSolutionScene,
  playValueScene,
  playTerminalScene,
  playCTAScene,
} from './hero-video-scenes';

export default makeScene2D(function* (view) {
  // Create container reference for ambient background
  const bgContainer = createRef<Layout>();

  // Setup animated ambient background (starts hidden, will fade in during Scene 1)
  yield* AmbientBackground({view, startHidden: true, containerRef: bgContainer});

  // ========== SCENE 1: PROBLEM (8s) ==========
  const logo1 = createRef<Img>();
  const warning = createRef<Txt>();
  const problemText = createRef<Txt>();
  const tagline = createRef<Txt>();

  view.add(
    <>
      <Img ref={logo1} src={logo} width={160} y={-420} opacity={0} />
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
  );

  yield* playProblemScene({logo: logo1, warning, problemText, tagline, bgContainer});

  // ========== SCENE 2: SOLUTION (9s) ==========
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const hot = createRef<Rect>();
  const warm = createRef<Rect>();
  const cold = createRef<Rect>();

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
      <TierBox
        tierRef={cold}
        tierName="COLD"
        description="Archives, history"
        color={BRAND_COLORS.teal}
        width={800}
        y={190}
      />
      <TierBox
        tierRef={warm}
        tierName="WARM"
        description="Recent decisions"
        color={BRAND_COLORS.yellow}
        width={650}
        y={20}
      />
      <TierBox
        tierRef={hot}
        tierName="HOT"
        description="Active sprint, patterns"
        color={BRAND_COLORS.orange}
        width={550}
        y={-150}
      />
    </>,
  );

  yield* playSolutionScene({title, subtitle, hot, warm, cold});

  // ========== SCENE 3: VALUE (8s) ==========
  const valueTitle = createRef<Txt>();
  const b1 = createRef<Rect>();
  const b2 = createRef<Rect>();
  const b3 = createRef<Rect>();

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
      <BenefitCard
        cardRef={b1}
        icon="⚡"
        iconColor={BRAND_COLORS.orange}
        label="Faster"
        labelColor={BRAND_COLORS.orange}
        y={-80}
      />
      <BenefitCard
        cardRef={b2}
        icon="💰"
        iconColor={BRAND_COLORS.yellow}
        label="Cheaper"
        labelColor={BRAND_COLORS.yellow}
        y={105}
      />
      <BenefitCard
        cardRef={b3}
        icon="🎯"
        iconColor={BRAND_COLORS.teal}
        label="No drift"
        labelColor={BRAND_COLORS.teal}
        y={290}
      />
    </>,
  );

  yield* playValueScene({valueTitle, b1, b2, b3});

  // ========== SCENE 4: TERMINAL DEMO (17s) ==========
  const term = createRef<Rect>();
  const cmd1 = createRef<Txt>();
  const out1 = createRef<Txt>();
  const cmd2Prompt = createRef<Layout>();
  const cmd2 = createRef<Txt>();
  const outHeader = createRef<Txt>();
  const hotLine = createRef<Txt>();
  const warmLine = createRef<Txt>();
  const coldLine = createRef<Txt>();
  const totalLine = createRef<Txt>();
  const costLine = createRef<Txt>();

  view.add(
    <Rect
      ref={term}
      width={1750}
      height={850}
      fill={'rgba(40, 35, 32, 0.58)'}
      radius={22}
      shadowColor={'rgba(0, 0, 0, 0.55)'}
      shadowBlur={60}
      shadowOffsetY={26}
      padding={0}
      opacity={0}
      stroke={'rgba(255, 255, 255, 0.08)'}
      lineWidth={2}
    >
      <Layout
        layout
        direction={'column'}
        gap={0}
        width={1750}
        height={850}
        justifyContent={'start'}
        alignItems={'center'}
      >
        {/* Terminal header */}
        <Rect width={1750} height={70} fill={'rgba(30, 28, 26, 0.9)'} radius={[20, 20, 0, 0]}>
          <Layout
            layout
            direction={'row'}
            width={1750}
            height={70}
            alignItems={'center'}
            paddingLeft={18}
            paddingRight={18}
          >
            <Layout layout direction={'row'} gap={8} alignItems={'center'}>
              <Circle size={10} fill={'#ff5f57'} />
              <Circle size={10} fill={'#febc2e'} />
              <Circle size={10} fill={'#28c840'} />
            </Layout>
            <Layout layout direction={'row'} grow={1} alignItems={'center'} justifyContent={'center'}>
              <Txt
                fontSize={16}
                fill={'rgba(255, 255, 255, 0.4)'}
                fontFamily={'"Inter", "San Francisco", "Helvetica Neue", Helvetica, Arial, sans-serif'}
                fontWeight={400}
              >
                Terminal
              </Txt>
            </Layout>
            <Layout width={60} />
          </Layout>
        </Rect>

        {/* Content area */}
        <Layout
          layout
          direction={'column'}
          gap={20}
          width={1650}
          paddingLeft={50}
          paddingRight={50}
          paddingTop={30}
          alignItems={'start'}
        >
          {/* First command: init */}
          <Layout layout direction={'row'} gap={15}>
            <Txt fontSize={44} fill={'rgba(249, 115, 22, 0.8)'} fontFamily={BRAND_FONTS.mono}>
              $
            </Txt>
            <Txt ref={cmd1} fontSize={44} fill={'#ffffff'} fontFamily={BRAND_FONTS.mono} fontWeight={500} />
          </Layout>
          <Txt
            ref={out1}
            fontSize={38}
            fill={'rgba(40, 200, 64, 0.95)'}
            fontFamily={BRAND_FONTS.mono}
            opacity={0}
            fontWeight={500}
            x={60}
          >
            ✓ Created 9 documentation files
          </Txt>

          <Layout height={20} />

          {/* Second command: status with flags */}
          <Layout ref={cmd2Prompt} layout direction={'row'} gap={15} opacity={0}>
            <Txt fontSize={44} fill={'rgba(249, 115, 22, 0.8)'} fontFamily={BRAND_FONTS.mono}>
              $
            </Txt>
            <Txt ref={cmd2} fontSize={44} fill={'#ffffff'} fontFamily={BRAND_FONTS.mono} fontWeight={500} />
          </Layout>

          <Layout height={10} />

          {/* Status output */}
          <Txt ref={outHeader} fontSize={40} fill={'rgba(255, 255, 255, 0.95)'} fontFamily={BRAND_FONTS.mono} fontWeight={600} opacity={0}>
            📊 Token Analysis
          </Txt>
          <Txt ref={hotLine} fontSize={36} fill={'rgba(249, 115, 22, 0.95)'} fontFamily={BRAND_FONTS.mono} opacity={0} x={40}>
            HOT (Active): 32,450 tokens
          </Txt>
          <Txt ref={warmLine} fontSize={36} fill={'rgba(250, 204, 21, 0.95)'} fontFamily={BRAND_FONTS.mono} opacity={0} x={40}>
            WARM (Truth): 18,230 tokens
          </Txt>
          <Txt ref={coldLine} fontSize={36} fill={'rgba(14, 165, 164, 0.95)'} fontFamily={BRAND_FONTS.mono} opacity={0} x={40}>
            COLD (Archive): 50,554 tokens
          </Txt>
          <Txt ref={totalLine} fontSize={36} fill={'rgba(255, 255, 255, 0.6)'} fontFamily={BRAND_FONTS.mono} opacity={0} x={40}>
            Full repository: 101,234 tokens
          </Txt>

          <Layout height={5} />

          {/* Cost savings */}
          <Txt
            ref={costLine}
            fontSize={42}
            fill={'rgba(40, 200, 64, 0.95)'}
            fontFamily={BRAND_FONTS.mono}
            fontWeight={700}
            opacity={0}
            shadowColor={'rgba(40, 200, 64, 0.4)'}
            shadowBlur={15}
            x={0}
          >
            💰 68% reduction
          </Txt>
        </Layout>
      </Layout>
    </Rect>,
  );

  yield* playTerminalScene({
    term,
    cmd1,
    out1,
    cmd2Prompt,
    cmd2,
    outHeader,
    hotLine,
    warmLine,
    coldLine,
    totalLine,
    costLine,
  });

  // ========== SCENE 5: CTA (8s) ==========
  const logo5 = createRef<Img>();
  const ctaTitle = createRef<Txt>();
  const cmdBox = createRef<Rect>();
  const web = createRef<Txt>();
  const ctaTag = createRef<Txt>();

  view.add(
    <>
      <Img ref={logo5} src={logo} width={160} y={-400} opacity={0} />
      <Txt ref={ctaTitle} fontSize={76} fill={'#ffffff'} fontWeight={800} y={-230} opacity={0}>
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
          fontFamily={BRAND_FONTS.mono}
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
      <Txt ref={ctaTag} fontSize={42} fill={'#888888'} y={320} opacity={0} fontWeight={500}>
        Tiered Memory for AI Agents
      </Txt>
    </>,
  );

  yield* playCTAScene({logo: logo5, ctaTitle, cmdBox, web, ctaTag});
});
