import type {PriceChangeTheme} from '../../design/themes';

export type PriceDirection = 'up' | 'down' | 'neutral';

export type PriceChangeCardProps = {
  productName: string;
  oldPrice: string;
  newPrice: string;
  delta: string;
  deltaPercent: string;
  dateLabel: string;
  priceType: string;
  sourceLabel: string;
  direction: PriceDirection;
  /** Defaults to techDynamic; only implemented themes are accepted. */
  theme?: PriceChangeTheme;
  /** A transparent canvas for PNG overlays; the readable card surface is retained. */
  transparent?: boolean;
};

export type PriceChangeCompositionProps = PriceChangeCardProps & {
  renderFps?: 30 | 60;
};
