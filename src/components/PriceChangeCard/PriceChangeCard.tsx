import {useEffect, useState, type CSSProperties} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';
import {tokens} from '../../design/tokens';
import {getTheme} from '../../design/themes';
import {priceChangeDetailTiming, priceChangeTiming} from './timing';
import type {PriceChangeCardProps} from './types';

const reveal = (amount: number, offset = 12): CSSProperties => ({
  opacity: amount,
  transform: `translateY(${(1 - amount) * offset}px)`,
});
const numberStyle: CSSProperties = {
  fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.035em', whiteSpace: 'nowrap',
};

/** The only graphic in v0.2. Theme and direction are independent of product data. */
export const PriceChangeCard = (props: PriceChangeCardProps) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const motion = priceChangeTiming(frame, fps);
  const detail = priceChangeDetailTiming(frame, fps);
  const theme = getTheme(props.theme);
  const [fontHandle] = useState(() => delayRender('Loading local Korean font'));
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {if (active) continueRender(fontHandle);});
    return () => {active = false;};
  }, [fontHandle]);

  const color = {up: theme.increase, down: theme.decrease, neutral: theme.neutral}[props.direction];
  const directionLabel = {up: '가격 상승', down: '가격 하락', neutral: '가격 유지'}[props.direction];
  const directionSymbol = {up: '↑', down: '↓', neutral: '—'}[props.direction];
  const spacing = theme.spacing;
  const contentWidth = width - 2 * spacing.canvasX - 2 * spacing.cardX - 2;
  const columnUnit = (contentWidth - 112 - 2 * spacing.gap) / 2.35;
  // Fit within each price column, without truncating currency values.
  const priceSize = Math.min(tokens.typography.price, columnUnit * 1.55 / (Math.max(props.newPrice.length, 1) * 0.62));
  const previousSize = Math.min(tokens.typography.oldPrice, columnUnit * 0.8 / (Math.max(props.oldPrice.length, 1) * 0.62));
  const divider: CSSProperties = {height: 1, background: theme.border, flexShrink: 0};
  const chip: CSSProperties = {
    ...numberStyle, display: 'inline-flex', alignItems: 'center', padding: '12px 24px',
    background: theme.chipSurface, border: `1px solid ${theme.border}`, borderRadius: theme.radius.chip,
    color, fontSize: tokens.typography.delta, fontWeight: 650, lineHeight: 1.3,
  };

  return (
    <AbsoluteFill style={{
      backgroundColor: props.transparent ? 'transparent' : theme.background,
      backgroundImage: props.transparent ? 'none' : theme.backgroundDepth,
      color: theme.primaryText, fontFamily: tokens.typography.fontFamily,
      padding: `${spacing.canvasY}px ${spacing.canvasX}px`,
    }}>
      <div data-price-card style={{
        ...reveal(motion.intro, 10), flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
        backgroundColor: theme.surface, backgroundImage: theme.surfaceLayer,
        border: `1px solid ${theme.border}`, borderRadius: theme.radius.card,
        boxShadow: props.transparent ? theme.glow : `${theme.shadow}, ${theme.glow}`,
        padding: `${spacing.cardTop}px ${spacing.cardX}px ${spacing.cardBottom}px`, overflow: 'hidden',
      }}>
        <div aria-hidden style={{position: 'absolute', height: 1, top: 0, left: 32, right: 32,
          background: theme.edgeHighlight}} />
        <div style={{display: 'flex', alignItems: 'center', gap: spacing.gap}}>
          <div data-product-name style={{fontSize: tokens.typography.product, fontWeight: 600, flex: 1,
            minWidth: 0, lineHeight: 1.35, letterSpacing: '-0.025em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {props.productName}
          </div>
          <div data-direction-badge style={{color, background: theme.chipSurface,
            fontSize: tokens.typography.label, fontWeight: 600, padding: '10px 22px',
            border: `1px solid ${theme.border}`, borderRadius: theme.radius.pill, whiteSpace: 'nowrap'}}>
            {directionSymbol} {directionLabel}
          </div>
        </div>
        <div data-meta style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 24,
          fontSize: tokens.typography.label, lineHeight: 1.5, color: theme.secondaryText}}>
          <span>{props.dateLabel}</span>
          <span aria-hidden style={{width: 4, height: 4, borderRadius: 2, background: theme.accent}} />
          <span>{props.priceType}</span>
        </div>
        <div style={{...divider, marginTop: 30}} />
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36}}>
          <div data-price-flow style={{display: 'grid', gridTemplateColumns: 'minmax(0, 0.8fr) 112px minmax(0, 1.55fr)',
            columnGap: spacing.gap, alignItems: 'center'}}>
            <div data-previous-price style={{...reveal(motion.previous), minWidth: 0}}>
              <div style={{fontSize: tokens.typography.label, color: theme.secondaryText, marginBottom: 12}}>이전 가격</div>
              <div style={{...numberStyle, fontSize: previousSize, fontWeight: 500,
                lineHeight: 1.35, color: theme.secondaryText}}>{props.oldPrice}</div>
            </div>
            <div data-price-arrow aria-hidden style={{opacity: detail.arrow, marginTop: 38,
              clipPath: `inset(0 ${(1 - detail.arrow) * 100}% 0 0)`}}>
              <svg width="112" height="40" viewBox="0 0 112 40" style={{display: 'block', overflow: 'visible'}}>
                <path d="M 2 20 H 105 M 90 5 L 105 20 L 90 35" fill="none" stroke={color}
                  strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div data-current-price style={{...reveal(motion.current, 14), minWidth: 0,
              transform: `translateY(${(1 - motion.current) * 14}px) scale(${0.985 + motion.current * 0.015})`,
              transformOrigin: 'left center'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
                fontSize: tokens.typography.label, fontWeight: 600, color: theme.accent}}>
                <span aria-hidden style={{width: 24, height: 2, background: theme.accent}} />현재 가격
              </div>
              <div data-current-price-value style={{...numberStyle, fontSize: priceSize,
                fontWeight: 800, lineHeight: 1.35}}>{props.newPrice}</div>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20}}>
            <span data-delta-chip style={{...chip, ...reveal(motion.delta)}}>{props.delta}</span>
            <span data-percent-chip style={{...chip, ...reveal(detail.percent)}}>{props.deltaPercent}</span>
          </div>
        </div>
        <div style={{...divider}} />
        <div data-source style={{paddingTop: 24, fontSize: tokens.typography.source,
          color: theme.secondaryText, lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{fontSize: tokens.typography.label}}>출처</span>
          <span>{props.sourceLabel}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
