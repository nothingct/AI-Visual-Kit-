import type {CSSProperties} from 'react';
import type {PriceDirection} from '../types';
import type {PriceChangeCardTheme} from './types';

/** Resolve visual slots, independently of content layout and frame-based motion. */
export const getThemeAppearance = (theme: PriceChangeCardTheme, direction: PriceDirection, transparent?: boolean) => {
  const color = {up: theme.increase, down: theme.decrease, neutral: theme.neutral}[direction];
  const {typography: type, appearance: style} = theme;
  const chipSurface: CSSProperties = {
    backgroundColor: theme.chipSurface, backgroundImage: theme.chipLayer,
    border: `1px solid ${theme.chipBorder}`, boxShadow: theme.chipShadow,
  };
  return {
    canvas: {backgroundColor: transparent ? 'transparent' : theme.background,
      backgroundImage: transparent ? 'none' : theme.backgroundDepth,
      color: theme.primaryText, fontFamily: type.fontFamily},
    card: {backgroundColor: theme.surface, backgroundImage: theme.surfaceLayer,
      border: `1px solid ${theme.border}`, borderRadius: theme.radius.card,
      boxShadow: transparent ? theme.glow : `${theme.shadow}, ${theme.glow}`},
    edge: {background: theme.edgeHighlight},
    product: {...style.product, fontSize: type.product},
    badge: {...style.badge, ...chipSurface, color, fontSize: type.label, borderRadius: theme.radius.pill},
    meta: {...style.meta, fontSize: type.label, color: theme.secondaryText},
    accent: {background: theme.accent},
    divider: {background: theme.border},
    label: {fontSize: type.label, color: theme.secondaryText},
    previousValue: {...style.previousValue, color: theme.secondaryText},
    currentLabel: {...style.currentLabel, fontSize: type.label, color: theme.secondaryText},
    currentValue: style.currentValue,
    chip: {...style.chip, ...chipSurface, borderRadius: theme.radius.chip,
      color: theme.primaryText, fontSize: type.delta},
    percent: {color},
    source: {...style.source, fontSize: type.source, color: theme.secondaryText},
    sourceLabel: {fontSize: type.label},
  };
};
