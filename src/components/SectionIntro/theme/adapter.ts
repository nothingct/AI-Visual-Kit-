import type {GlobalTheme} from '../../../design/themes/types';
import type {SectionIntroTheme} from './types';

/** Local scale and treatment only; the shared language stays a reference. */
export const adaptSectionIntroTheme = (language: GlobalTheme): SectionIntroTheme => ({
  language,
  typography: {number: 224, title: 100, subtitle: 42},
  spacing: {safeX: 160, safeY: 130, numberGap: 34, subtitleGap: 32},
  line: {width: 480, thickness: 2, gap: 40},
});
