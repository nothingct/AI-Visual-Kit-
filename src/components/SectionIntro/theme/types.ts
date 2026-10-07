import type {GlobalTheme} from '../../../design/themes/types';

export type SectionIntroTheme = Readonly<{
  language: GlobalTheme;
  typography: Readonly<{number: number; title: number; subtitle: number}>;
  spacing: Readonly<{safeX: number; safeY: number; numberGap: number; subtitleGap: number}>;
  line: Readonly<{width: number; thickness: number; gap: number}>;
}>;
