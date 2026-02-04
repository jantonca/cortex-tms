import {Rect, Txt, Layout} from '@motion-canvas/2d';
import {Reference} from '@motion-canvas/core';

export interface BenefitCardProps {
  cardRef: Reference<Rect>;
  icon: string;
  iconColor: string;
  label: string;
  labelColor: string;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * Reusable benefit card with icon, label, and checkmark
 * Used in value proposition scenes
 */
export function BenefitCard({
  cardRef,
  icon,
  iconColor,
  label,
  labelColor,
  y = 0,
  width = 1400,
  height = 155,
}: BenefitCardProps) {
  return (
    <Rect
      ref={cardRef}
      width={width}
      height={height}
      fill={'#0f0f0f'}
      radius={16}
      y={y}
      opacity={0}
      shadowBlur={20}
      stroke={`${labelColor}80`}
      lineWidth={3}
    >
      <Layout layout direction={'row'} gap={50} alignItems={'center'}>
        <Txt fontSize={95} fill={iconColor}>
          {icon}
        </Txt>
        <Txt fontSize={78} fill={labelColor} fontWeight={800}>
          {label}
        </Txt>
        <Txt fontSize={75} fill={'#20b2aa'}>
          ✓
        </Txt>
      </Layout>
    </Rect>
  );
}
