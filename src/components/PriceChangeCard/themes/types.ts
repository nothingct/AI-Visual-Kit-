import type {CSSProperties} from 'react';

/** Visual values only: structure, positioning and animation belong to Core. */
export type VisualStyle = Pick<CSSProperties,
  'fontVariantNumeric' | 'letterSpacing' | 'fontWeight' | 'lineHeight'>;

/** Shared contract for implemented and future PriceChangeCard themes. */
export type PriceChangeCardTheme = {
  typography: {
    fontFamily: string; price: number; oldPrice: number; delta: number;
    product: number; label: number; source: number;
  };
  appearance: Record<'number' | 'product' | 'badge' | 'meta' | 'previousValue' |
    'currentLabel' | 'currentValue' | 'chip' | 'source', VisualStyle>;
  arrow: {strokeWidth: number; strokeLinecap: 'round'; strokeLinejoin: 'round'};
  background: string;
  backgroundDepth: string;
  surface: string;
  surfaceLayer: string;
  primaryText: string;
  secondaryText: string;
  accent: string;
  increase: string;
  decrease: string;
  neutral: string;
  border: string;
  edgeHighlight: string;
  chipSurface: string;
  chipLayer: string;
  chipBorder: string;
  chipShadow: string;
  glow: string;
  shadow: string;
  radius: {card: number; chip: number; pill: number};
  spacing: {canvasX: number; canvasY: number; cardX: number; cardTop: number; cardBottom: number; gap: number};
};

/** Compatibility name for existing imports. */
export type ThemeTokens = PriceChangeCardTheme;
