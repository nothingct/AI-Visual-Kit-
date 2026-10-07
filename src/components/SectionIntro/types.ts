import type {ThemeName} from '../../design/themes/types';

/** Display strings supplied by callers; no chapter data lives in the Core. */
export type SectionIntroInput = {
  sectionNumber: string;
  title: string;
  subtitle?: string;
  theme?: ThemeName;
  transparent?: boolean;
};
export type SectionIntroCompositionProps = SectionIntroInput & {renderFps?: 30 | 60};
