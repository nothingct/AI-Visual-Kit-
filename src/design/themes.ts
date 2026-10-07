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
  glow: string;
  shadow: string;
  radius: {card: number; chip: number; pill: number};
  spacing: {canvasX: number; canvasY: number; cardX: number; cardTop: number; cardBottom: number; gap: number};
};

export const themes = {
  techDynamic: {
    background: '#060B15',
    backgroundDepth: 'radial-gradient(ellipse at 72% 22%, #142A43 0%, #0B1525 42%, #060B15 82%)',
    surface: '#101C2D',
    surfaceLayer: 'linear-gradient(145deg, rgba(35, 56, 79, 0.78), rgba(16, 28, 45, 0.96) 55%, rgba(10, 20, 34, 0.98))',
    primaryText: '#F2F7FD',
    secondaryText: '#AFBFD3',
    accent: '#83CFFF',
    increase: '#FFB38B',
    decrease: '#8DDACB',
    neutral: '#BFCDE0',
    border: 'rgba(131, 175, 213, 0.25)',
    edgeHighlight: 'linear-gradient(90deg, transparent, rgba(131, 207, 255, 0.42), transparent)',
    chipSurface: '#162438',
    glow: 'inset 0 1px 0 rgba(153, 209, 255, 0.08)',
    shadow: '0 24px 64px rgba(0, 0, 0, 0.22)',
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
