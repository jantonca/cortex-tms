import {Rect, Txt, Circle, Layout, Node} from '@motion-canvas/2d';
import {makeRef, Reference} from '@motion-canvas/core';
import {BRAND_COLORS, BRAND_FONTS, BRAND_EFFECTS} from '../../brand';

export interface TerminalProps {
  width?: number;
  height?: number;
  padding?: number;
}

export function Terminal(props: TerminalProps) {
  const {
    width = 1600,
    height = 800,
    padding = 40,
  } = props;

  return (
    <Rect
      width={width}
      height={height}
      fill={BRAND_COLORS.bgTerminal}
      radius={12}
      shadowColor={'rgba(0, 0, 0, 0.5)'}
      shadowBlur={30}
      shadowOffsetY={10}
      padding={padding}
      layout
      direction={'column'}
      gap={20}
      alignItems={'start'}
    >
      {/* Terminal header with traffic lights */}
      <Layout
        layout
        direction={'row'}
        gap={8}
        marginBottom={10}
        width={'100%'}
        justifyContent={'space-between'}
      >
        <Layout layout direction={'row'} gap={8}>
          <Circle size={14} fill={'#ff5f56'} />
          <Circle size={14} fill={'#ffbd2e'} />
          <Circle size={14} fill={'#27c93f'} />
        </Layout>
        <Txt
          fontSize={24}
          fill={BRAND_COLORS.textMuted}
          fontFamily={BRAND_FONTS.mono}
        >
          cortex-tms
        </Txt>
      </Layout>
    </Rect>
  );
}

export interface CommandLineProps {
  command: Reference<Txt>;
  prompt?: string;
}

export function CommandLine({command, prompt = '$'}: CommandLineProps) {
  return (
    <Layout layout direction={'row'} gap={12}>
      <Txt
        fontSize={45}
        fill={BRAND_COLORS.textMuted}
        fontFamily={BRAND_FONTS.mono}
      >
        {prompt}
      </Txt>
      <Txt
        ref={command}
        fontSize={45}
        fill={BRAND_COLORS.teal}
        fontFamily={BRAND_FONTS.mono}
        fontWeight={600}
      />
    </Layout>
  );
}

export interface OutputLineProps {
  text: Reference<Txt>;
  color?: string;
  icon?: string;
  highlight?: boolean;
}

export function OutputLine({
  text,
  color = BRAND_COLORS.textPrimary,
  icon,
  highlight = false,
}: OutputLineProps) {
  return (
    <Layout layout direction={'row'} gap={12} alignItems={'center'}>
      {icon && (
        <Txt fontSize={38} fill={color}>
          {icon}
        </Txt>
      )}
      <Txt
        ref={text}
        fontSize={highlight ? 42 : 38}
        fill={color}
        fontFamily={BRAND_FONTS.mono}
        fontWeight={highlight ? 700 : 400}
        shadowColor={highlight ? BRAND_EFFECTS.glowTeal : undefined}
        shadowBlur={highlight ? 20 : 0}
      />
    </Layout>
  );
}
