import {techDynamic} from './techDynamic';
import type {GlobalTheme, ThemeName, ThemeRegistryEntry} from './types';

/** The sole source of truth for theme selection and implementation status. */
export const themeRegistry = {
  techDynamic: {status: 'implemented', tokens: techDynamic},
  premiumMinimal: {status: 'planned'},
  valuePop: {status: 'planned'},
} satisfies Record<ThemeName, ThemeRegistryEntry>;

/** Derived implemented tokens only; planned themes never receive placeholder designs. */
export const globalThemes = Object.fromEntries(
  Object.entries(themeRegistry).flatMap(([name, entry]) =>
    entry.status === 'implemented' ? [[name, entry.tokens]] : []),
) as Partial<Record<ThemeName, GlobalTheme>>;
export const defaultTheme: ThemeName = 'techDynamic';

export const getGlobalTheme = (name: ThemeName = defaultTheme): GlobalTheme => {
  if (!Object.hasOwn(themeRegistry, name)) throw new Error(`Unsupported theme: ${String(name)}`);
  const entry: ThemeRegistryEntry = themeRegistry[name];
  if (entry.status !== 'implemented') {
    throw new Error(`Unsupported theme: ${name} (not implemented)`);
  }
  return entry.tokens;
};
