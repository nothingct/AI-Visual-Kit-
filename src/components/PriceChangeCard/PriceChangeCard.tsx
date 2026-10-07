import {PriceChangeCardCore} from './core/PriceChangeCardCore';
import {normalizePriceChangeInput} from './input';
import {getTheme} from './themes';
import type {PriceChangeCardPublicProps} from './types';

/** Public facade: external input + selected theme → unchanged PriceChangeCard Core. */
export const PriceChangeCard = (props: PriceChangeCardPublicProps) => {
  const input = normalizePriceChangeInput(props);
  return <PriceChangeCardCore input={input} theme={getTheme(input.theme)} />;
};
