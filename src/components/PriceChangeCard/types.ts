import type {PriceChangeTheme} from './themes';

export type PriceDirection = 'up' | 'down' | 'neutral';
type SharedInput = {
  productName: string;
  delta: string;
  priceType: string;
  direction: PriceDirection;
  theme?: PriceChangeTheme;
  /** Transparent canvas; the readable card surface is retained. */
  transparent?: boolean;
};

/** Canonical data boundary for future callers, including a Control Panel. */
export type PriceChangeCardInput = SharedInput & {
  previousPrice: string;
  currentPrice: string;
  percentage: string;
  period: string;
  source: string;
};

/** v0.2.1 input remains accepted by the public PriceChangeCard entry point. */
export type LegacyPriceChangeCardProps = SharedInput & {
  oldPrice: string;
  newPrice: string;
  deltaPercent: string;
  dateLabel: string;
  sourceLabel: string;
};
/** Preserve the original exported props type for existing typed callers. */
export type PriceChangeCardProps = LegacyPriceChangeCardProps;
export type PriceChangeCardPublicProps = PriceChangeCardInput | PriceChangeCardProps;
export type PriceChangeCompositionProps = PriceChangeCardPublicProps & {renderFps?: 30 | 60};
