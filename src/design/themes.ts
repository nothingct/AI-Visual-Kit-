/** Theme contract: add future themes here, without changing PriceChangeCard's layout. */
export type ThemeTokens = {
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

export const themes = {
  techDynamic: {
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
  },
} satisfies Record<string, ThemeTokens>;

/** Only implemented themes are accepted. premiumMinimal/valuePop can be added later. */
export type PriceChangeTheme = keyof typeof themes;
export const defaultTheme: PriceChangeTheme = 'techDynamic';
export const getTheme = (name: PriceChangeTheme = defaultTheme): ThemeTokens => {
  if (!Object.hasOwn(themes, name)) throw new Error(`Unsupported theme: ${String(name)}`);
  return themes[name];
};
