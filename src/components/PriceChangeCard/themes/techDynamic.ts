import {tokens} from '../../../design/tokens';
import type {PriceChangeCardTheme} from './types';

/** v0.2.1 visual reference, unchanged in v0.3. */
export const techDynamic = {
  typography: tokens.typography,
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
  background: '#040810',
  backgroundDepth: 'radial-gradient(ellipse at 74% 18%, #10253E 0%, #081221 44%, #040810 84%)',
  surface: '#0C1727',
  surfaceLayer: 'radial-gradient(ellipse at 76% 8%, rgba(43, 112, 171, 0.13), transparent 64%), linear-gradient(145deg, #142338, #0B1422 68%, #08101B)',
  primaryText: '#F5F9FF',
  secondaryText: '#ACBED5',
  accent: '#82CFFF',
  increase: '#96DBFF',
  decrease: '#B5C7F3',
  neutral: '#BFCDE0',
  border: 'rgba(118, 176, 221, 0.23)',
  edgeHighlight: 'linear-gradient(90deg, transparent, rgba(153, 219, 255, 0.38), transparent)',
  chipSurface: '#0E1B2D',
  chipLayer: 'linear-gradient(160deg, rgba(54, 102, 147, 0.18), rgba(8, 18, 31, 0.2))',
  chipBorder: 'rgba(130, 207, 255, 0.26)',
  chipShadow: 'inset 0 1px 0 rgba(172, 219, 255, 0.08), 0 6px 12px rgba(0, 0, 0, 0.12)',
  glow: 'inset 0 1px 0 rgba(168, 223, 255, 0.09)',
  shadow: '0 24px 64px rgba(0, 0, 0, 0.2)',
  radius: {card: 32, chip: 18, pill: 999},
  spacing: {canvasX: 160, canvasY: 130, cardX: 64, cardTop: 48, cardBottom: 40, gap: 28},
} satisfies PriceChangeCardTheme;
