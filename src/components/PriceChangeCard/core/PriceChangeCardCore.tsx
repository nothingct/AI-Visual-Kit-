import {useEffect, useState, type CSSProperties} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame, useVideoConfig} from 'remotion';
import {getThemeAppearance} from '../themes/appearance';
import type {PriceChangeCardTheme} from '../themes/types';
import {priceChangeDetailTiming, priceChangeTiming} from '../timing';
import type {PriceChangeCardInput} from '../types';

const reveal = (amount: number, offset = 12): CSSProperties => ({
  opacity: amount,
  transform: `translateY(${(1 - amount) * offset}px)`,
});
/** Information structure, geometry and frame-based animation; no theme selection here. */
export const PriceChangeCardCore = ({input: props, theme}: {
  input: PriceChangeCardInput; theme: PriceChangeCardTheme;
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const motion = priceChangeTiming(frame, fps);
  const detail = priceChangeDetailTiming(frame, fps);
  const styles = getThemeAppearance(theme, props.direction, props.transparent);
  const numberStyle = {...theme.appearance.number, whiteSpace: 'nowrap'} as CSSProperties;
  const [fontHandle] = useState(() => delayRender('Loading local Korean font'));
  useEffect(() => {
    let active = true;
    document.fonts.ready.then(() => {if (active) continueRender(fontHandle);});
    return () => {active = false;};
  }, [fontHandle]);

  const directionLabel = {up: '가격 상승', down: '가격 하락', neutral: '가격 유지'}[props.direction];
  const directionSymbol = {up: '↑', down: '↓', neutral: '—'}[props.direction];
  const spacing = theme.spacing;
  const contentWidth = width - 2 * spacing.canvasX - 2 * spacing.cardX - 2;
  const columnUnit = (contentWidth - 112 - 2 * spacing.gap) / 2.35;
  // Fit within each price column, without truncating currency values.
  const priceSize = Math.min(theme.typography.price, columnUnit * 1.55 / (Math.max(props.currentPrice.length, 1) * 0.62));
  const previousSize = Math.min(theme.typography.oldPrice, columnUnit * 0.8 / (Math.max(props.previousPrice.length, 1) * 0.62));
  const divider: CSSProperties = {...styles.divider, height: 1, flexShrink: 0};
  const chip: CSSProperties = {...numberStyle, ...styles.chip, display: 'inline-flex', alignItems: 'center', padding: '12px 24px'};

  return (
    <AbsoluteFill style={{
      ...styles.canvas,
      padding: `${spacing.canvasY}px ${spacing.canvasX}px`,
    }}>
      <div data-price-card style={{
        ...reveal(motion.intro, 10), flex: 1, position: 'relative', display: 'flex', flexDirection: 'column',
        ...styles.card,
        padding: `${spacing.cardTop}px ${spacing.cardX}px ${spacing.cardBottom}px`, overflow: 'hidden',
      }}>
        <div aria-hidden style={{position: 'absolute', height: 1, top: 0, left: 32, right: 32,
          ...styles.edge}} />
        <div style={{display: 'flex', alignItems: 'center', gap: spacing.gap}}>
          <div data-product-name style={{...styles.product, flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {props.productName}
          </div>
          <div data-direction-badge style={{...styles.badge, padding: '10px 22px',
            whiteSpace: 'nowrap'}}>
            {directionSymbol} {directionLabel}
          </div>
        </div>
        <div data-meta style={{marginTop: 16, display: 'flex', alignItems: 'center', gap: 24,
          ...styles.meta}}>
          <span>{props.period}</span>
          <span aria-hidden style={{width: 4, height: 4, borderRadius: 2, ...styles.accent}} />
          <span>{props.priceType}</span>
        </div>
        <div style={{...divider, marginTop: 30}} />
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36}}>
          <div data-price-flow style={{display: 'grid', gridTemplateColumns: 'minmax(0, 0.8fr) 112px minmax(0, 1.55fr)',
            columnGap: spacing.gap, alignItems: 'center'}}>
            <div data-previous-price style={{...reveal(motion.previous), minWidth: 0}}>
              <div style={{...styles.label, marginBottom: 12}}>이전 가격</div>
              <div style={{...numberStyle, ...styles.previousValue, fontSize: previousSize}}>{props.previousPrice}</div>
            </div>
            <div data-price-arrow aria-hidden style={{opacity: detail.arrow, marginTop: 38,
              clipPath: `inset(0 ${(1 - detail.arrow) * 100}% 0 0)`}}>
              <svg width="112" height="40" viewBox="0 0 112 40" style={{display: 'block', overflow: 'visible'}}>
                <path d="M 4 20 H 105 M 92 9 L 105 20 L 92 31" fill="none" stroke={theme.accent}
                  strokeWidth={theme.arrow.strokeWidth} strokeLinecap={theme.arrow.strokeLinecap} strokeLinejoin={theme.arrow.strokeLinejoin} />
              </svg>
            </div>
            <div data-current-price style={{...reveal(motion.current, 14), minWidth: 0,
              transform: `translateY(${(1 - motion.current) * 14}px) scale(${0.985 + motion.current * 0.015})`,
              transformOrigin: 'left center'}}>
              <div data-current-price-label style={{marginBottom: 12, ...styles.currentLabel}}>현재 가격</div>
              <div data-current-price-value style={{...numberStyle, ...styles.currentValue, fontSize: priceSize}}>{props.currentPrice}</div>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 20}}>
            <span data-delta-chip style={{...chip, ...reveal(motion.delta)}}>{props.delta}</span>
            <span data-percent-chip style={{...chip, ...styles.percent, ...reveal(detail.percent)}}>{props.percentage}</span>
          </div>
        </div>
        <div style={{...divider}} />
        <div data-source style={{paddingTop: 22, ...styles.source, display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{...styles.sourceLabel}}>출처</span>
          <span>{props.source}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
