import type {GlobalTheme} from './types';

/** Shared techDynamic language; migrated values are identical to v0.3. */
export const techDynamic = {
  fontFamily: '"Noto Sans KR Variable", "Noto Sans KR", sans-serif',
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
  controlSurface: '#0E1B2D',
  controlLayer: 'linear-gradient(160deg, rgba(54, 102, 147, 0.18), rgba(8, 18, 31, 0.2))',
  controlBorder: 'rgba(130, 207, 255, 0.26)',
  controlShadow: 'inset 0 1px 0 rgba(172, 219, 255, 0.08), 0 6px 12px rgba(0, 0, 0, 0.12)',
  glow: 'inset 0 1px 0 rgba(168, 223, 255, 0.09)',
  shadow: '0 24px 64px rgba(0, 0, 0, 0.2)',
  radius: {panel: 32, control: 18, pill: 999},
} satisfies GlobalTheme;
