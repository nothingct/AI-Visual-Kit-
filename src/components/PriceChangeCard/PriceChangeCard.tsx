import {useEffect, useState, type CSSProperties} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';
import {tokens} from '../../design/tokens';
import {priceChangeTiming} from './timing';
import type {PriceChangeCardProps} from './types';

const reveal = (amount: number, offset = 16): CSSProperties => ({
  opacity: amount,
  transform: `translateY(${(1 - amount) * offset}px)`,
});

/** The only video graphic in v0.1. Values are display strings supplied by props. */
export const PriceChangeCard = (props: PriceChangeCardProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const motion = priceChangeTiming(frame, fps);
  const [fontHandle] = useState(() => delayRender('Loading local Korean font'));
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {if (active) continueRender(fontHandle);});
    return () => {active = false;};
  }, [fontHandle]);

  const color = tokens.colors[props.direction];
  const directionLabel = {up: '가격 상승', down: '가격 하락', neutral: '가격 유지'}[props.direction];
  const directionSymbol = {up: '↑', down: '↓', neutral: '—'}[props.direction];
  // Keep large numbers legible when another product uses longer currency strings.
  const priceSize = Math.min(tokens.typography.price, 1320 / (Math.max(props.newPrice.length, 1) * 0.67));
  const numberStyle: CSSProperties = {fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.035em', whiteSpace: 'nowrap'};

  return (
    <AbsoluteFill style={{
      background: props.transparent ? 'transparent' : tokens.colors.background,
      color: tokens.colors.text,
      fontFamily: tokens.typography.fontFamily,
      padding: tokens.spacing.safeArea,
    }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: tokens.colors.surface, border: `2px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.card, padding: '52px 64px 42px', overflow: 'hidden',
      }}>
        <div style={{...reveal(motion.intro), display: 'flex', alignItems: 'center', gap: 24}}>
          <div style={{fontSize: tokens.typography.product, fontWeight: 700, flex: 1, lineHeight: 1.3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {props.productName}
          </div>
          <div style={{color: color, fontSize: tokens.typography.label, fontWeight: 700,
            padding: '12px 22px', border: `2px solid ${tokens.colors.border}`, borderRadius: tokens.radius.badge,
            whiteSpace: 'nowrap'}}>{directionSymbol} {directionLabel}</div>
        </div>
        <div style={{...reveal(motion.intro), marginTop: 14, display: 'flex', gap: 24,
          fontSize: tokens.typography.label, lineHeight: 1.5, color: tokens.colors.muted}}>
          <span>{props.dateLabel}</span><span style={{color: tokens.colors.border}}>│</span><span>{props.priceType}</span>
        </div>
        <div style={{height: 2, background: tokens.colors.border, marginTop: 30}} />
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14}}>
          <div style={{...reveal(motion.previous), display: 'flex', alignItems: 'baseline', gap: 24, color: tokens.colors.muted}}>
            <span style={{fontSize: tokens.typography.label}}>이전</span>
            <span style={{...numberStyle, fontSize: tokens.typography.oldPrice, fontWeight: 500}}>{props.oldPrice}</span>
            <span style={{fontSize: 58, color, lineHeight: 1}} aria-hidden>→</span>
            <span style={{fontSize: tokens.typography.label}}>현재</span>
          </div>
          <div style={{...reveal(motion.current, 20), ...numberStyle,
            fontSize: priceSize, fontWeight: 900, lineHeight: 1.3}}>{props.newPrice}</div>
          <div style={{...reveal(motion.delta), display: 'flex', alignItems: 'center', gap: 26, color,
            fontSize: tokens.typography.delta, fontWeight: 700, lineHeight: 1.4}}>
            <span style={{...numberStyle}}>{props.delta}</span>
            <span style={{width: 2, height: 42, background: tokens.colors.border}} />
            <span style={{...numberStyle}}>{props.deltaPercent}</span>
          </div>
        </div>
        <div style={{...reveal(motion.intro), borderTop: `2px solid ${tokens.colors.border}`,
          paddingTop: 22, fontSize: tokens.typography.source, color: tokens.colors.subtle,
          display: 'flex', justifyContent: 'space-between', gap: 32}}>
          <span>출처 · {props.sourceLabel}</span>
          <span>{props.priceType}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
