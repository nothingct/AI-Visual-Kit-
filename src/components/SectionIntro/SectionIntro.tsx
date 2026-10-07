import {getGlobalTheme} from '../../design/themes/registry';
import {SectionIntroCore} from './core/SectionIntroCore';
import {normalizeSectionIntroInput} from './input';
import {adaptSectionIntroTheme} from './theme/adapter';
import type {SectionIntroInput} from './types';

export const SectionIntro = (props: SectionIntroInput) => {
  const input = normalizeSectionIntroInput(props);
  const theme = adaptSectionIntroTheme(getGlobalTheme(input.theme));
  return <SectionIntroCore input={input} theme={theme} />;
};
