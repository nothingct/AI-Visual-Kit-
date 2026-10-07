import type {PriceChangeCardInput, PriceChangeCardPublicProps} from './types';

/** Canonical keys win over legacy keys merged in by Remotion defaultProps. */
export const normalizePriceChangeInput = (props: PriceChangeCardPublicProps): PriceChangeCardInput => {
  const raw = props as Partial<PriceChangeCardInput & {
    oldPrice: string; newPrice: string; deltaPercent: string; dateLabel: string; sourceLabel: string;
  }>;
  const input: PriceChangeCardInput = {
    productName: props.productName,
    previousPrice: raw.previousPrice !== undefined ? raw.previousPrice : raw.oldPrice!,
    currentPrice: raw.currentPrice !== undefined ? raw.currentPrice : raw.newPrice!,
    delta: props.delta,
    percentage: raw.percentage !== undefined ? raw.percentage : raw.deltaPercent!,
    period: raw.period !== undefined ? raw.period : raw.dateLabel!,
    priceType: props.priceType,
    source: raw.source !== undefined ? raw.source : raw.sourceLabel!,
    direction: props.direction,
    theme: props.theme,
    transparent: props.transparent,
  };
  for (const [field, label] of [
    ['productName', 'productName'], ['previousPrice', 'previousPrice / oldPrice'],
    ['currentPrice', 'currentPrice / newPrice'], ['delta', 'delta'],
    ['percentage', 'percentage / deltaPercent'], ['period', 'period / dateLabel'],
    ['priceType', 'priceType'], ['source', 'source / sourceLabel'],
  ] as const) {
    if (typeof input[field] !== 'string' || !input[field].trim()) {
      throw new Error(`${label} must be a nonempty string.`);
    }
  }
  if (!['up', 'down', 'neutral'].includes(input.direction)) {
    throw new Error('direction must be up, down, or neutral.');
  }
  if (input.transparent !== undefined && typeof input.transparent !== 'boolean') {
    throw new Error('transparent must be a boolean.');
  }
  return input;
};
