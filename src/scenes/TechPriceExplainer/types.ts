import type {ThemeName} from '../../design/themes/types';

/** All editorial content is external; prices are numeric for deterministic count-up. */
export type TechPriceExplainerInput = {
  title: string;
  subtitle: string;
  previousPrice: number;
  currentPrice: number;
  emphasisLabel?: string;
  increaseCaption: string;
  previousLabel: string;
  currentLabel: string;
  question: string;
  componentLabels: string[];
  contextLabel: string;
  priceNote: string;
  whySubtitle: string;
  theme?: ThemeName;
  renderFps?: 30 | 60;
};
