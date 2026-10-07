/** Known kit-wide theme languages. Planned names have no fallback design. */
export type ThemeName = 'techDynamic' | 'premiumMinimal' | 'valuePop';

/** Immutable shared design language, independent of any component or React. */
export type GlobalTheme = Readonly<{
  fontFamily: string;
  background: string; backgroundDepth: string;
  surface: string; surfaceLayer: string;
  primaryText: string; secondaryText: string; accent: string;
  increase: string; decrease: string; neutral: string;
  border: string; edgeHighlight: string;
  controlSurface: string; controlLayer: string; controlBorder: string; controlShadow: string;
  glow: string; shadow: string;
  radius: Readonly<{panel: number; control: number; pill: number}>;
}>;

export type ThemeRegistryEntry =
  | {status: 'implemented'; tokens: GlobalTheme}
  | {status: 'planned'};
