import type {GlobalTheme} from '../../../design/themes/types';
import type {PriceChangeCardTheme} from './types';

const cache = new WeakMap<GlobalTheme, PriceChangeCardTheme>();

/** Apply an immutable global language to PriceChangeCard-specific visual rules. */
export const adaptPriceChangeTheme = (global: GlobalTheme): PriceChangeCardTheme => {
  const existing = cache.get(global);
  if (existing) return existing;
  const {fontFamily, radius, controlSurface, controlLayer, controlBorder, controlShadow, ...shared} = global;
  const resolved: PriceChangeCardTheme = {
    ...shared,
    typography: {fontFamily, price: 134, oldPrice: 70, delta: 50, product: 44, label: 34, source: 40},
    appearance: {
      number: {fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.035em'},
      product: {fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.025em'},
      badge: {fontWeight: 600},
      meta: {lineHeight: 1.5},
      previousValue: {fontWeight: 500, lineHeight: 1.35},
      currentLabel: {fontWeight: 500, letterSpacing: '-0.015em'},
      currentValue: {fontWeight: 800, lineHeight: 1.35},
      chip: {fontWeight: 650, lineHeight: 1.3},
      source: {lineHeight: 1.4},
    },
    arrow: {strokeWidth: 2.25, strokeLinecap: 'round', strokeLinejoin: 'round'},
    chipSurface: controlSurface, chipLayer: controlLayer,
    chipBorder: controlBorder, chipShadow: controlShadow,
    radius: {card: radius.panel, chip: radius.control, pill: radius.pill},
    spacing: {canvasX: 160, canvasY: 130, cardX: 64, cardTop: 48, cardBottom: 40, gap: 28},
  };
  cache.set(global, resolved);
  return resolved;
};
