import {defaultTheme, getGlobalTheme} from '../../../design/themes/registry';
import type {ThemeName} from '../../../design/themes/types';
import {adaptPriceChangeTheme} from './adapter';

export {defaultTheme, adaptPriceChangeTheme};
export type PriceChangeTheme = ThemeName;
export type {PriceChangeCardTheme, ThemeTokens} from './types';
/** Compatibility registry of resolved PriceChangeCard adapters, not global tokens. */
export const themes = {techDynamic: adaptPriceChangeTheme(getGlobalTheme('techDynamic'))};
export const getTheme = (name: ThemeName = defaultTheme) => adaptPriceChangeTheme(getGlobalTheme(name));
