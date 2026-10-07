import {techDynamic} from './techDynamic';
import type {PriceChangeCardTheme} from './types';

export const themes = {techDynamic} satisfies Record<string, PriceChangeCardTheme>;
export type PriceChangeTheme = keyof typeof themes;
export const defaultTheme: PriceChangeTheme = 'techDynamic';
export const getTheme = (name: PriceChangeTheme = defaultTheme): PriceChangeCardTheme => {
  if (!Object.hasOwn(themes, name)) throw new Error(`Unsupported theme: ${String(name)}`);
  return themes[name];
};
export type {PriceChangeCardTheme, ThemeTokens} from './types';
