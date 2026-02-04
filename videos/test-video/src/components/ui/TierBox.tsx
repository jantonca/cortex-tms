import {Rect, Txt} from '@motion-canvas/2d';
import {Reference} from '@motion-canvas/core';

export interface TierBoxProps {
  tierRef: Reference<Rect>;
  tierName: string;
  description: string;
  color: string;
  width: number;
  y: number;
  textColor?: string;
}

/**
 * Reusable tier box for HOT/WARM/COLD tiers
 * Used in tiered memory visualization
 */
export function TierBox({
  tierRef,
  tierName,
  description,
  color,
  width,
  y,
  textColor,
}: TierBoxProps) {
  // Auto-determine text color based on tier
  const mainTextColor = textColor || (tierName === 'WARM' ? '#111111' : '#ffffff');
  const descTextColor = tierName === 'WARM' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)';
  const strokeColor = tierName === 'WARM' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';

  return (
    <Rect
      ref={tierRef}
      width={width}
      height={140}
      fill={color}
      radius={16}
      y={y}
      opacity={0}
      shadowColor={`${color}80`}
      shadowBlur={25}
      stroke={strokeColor}
      lineWidth={2}
    >
      <Txt fontSize={60} fill={mainTextColor} fontWeight={800} y={-12}>
        {tierName}
      </Txt>
      <Txt fontSize={32} fill={descTextColor} y={32}>
        {description}
      </Txt>
    </Rect>
  );
}
