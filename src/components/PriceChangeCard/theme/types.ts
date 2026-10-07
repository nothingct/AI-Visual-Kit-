import type {CSSProperties} from 'react';
import type {GlobalTheme} from '../../../design/themes/types';

/** Visual values only: structure, positioning and animation belong to Core. */
export type VisualStyle = Pick<CSSProperties,
  'fontVariantNumeric' | 'letterSpacing' | 'fontWeight' | 'lineHeight'>;

/** Resolved component adapter contract; GlobalTheme has no PriceChangeCard geometry. */
export type PriceChangeCardTheme = Omit<GlobalTheme,
  'fontFamily' | 'radius' | 'controlSurface' | 'controlLayer' | 'controlBorder' | 'controlShadow'> & {
  chipSurface: string; chipLayer: string; chipBorder: string; chipShadow: string;
  typography: {
    fontFamily: string; price: number; oldPrice: number; delta: number;
    product: number; label: number; source: number;
  };
  appearance: Record<'number' | 'product' | 'badge' | 'meta' | 'previousValue' |
    'currentLabel' | 'currentValue' | 'chip' | 'source', VisualStyle>;
  arrow: {strokeWidth: number; strokeLinecap: 'round'; strokeLinejoin: 'round'};
  radius: {card: number; chip: number; pill: number};
  spacing: {canvasX: number; canvasY: number; cardX: number; cardTop: number; cardBottom: number; gap: number};
};

/** Compatibility name for existing imports. */
export type ThemeTokens = PriceChangeCardTheme;
