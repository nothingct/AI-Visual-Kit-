import type {CSSProperties} from 'react';
import type {SectionIntroTheme} from './types';

/** Color/font sources are exclusively GlobalTheme, never copied literals. */
export const sectionIntroAppearance = (theme: SectionIntroTheme, transparent?: boolean) => {
  const {language, typography} = theme;
  return {
    canvas: {backgroundColor: transparent ? 'transparent' : language.background,
      backgroundImage: transparent ? 'none' : language.backgroundDepth,
      fontFamily: language.fontFamily, color: language.primaryText},
    number: {fontSize: typography.number, fontWeight: 500, letterSpacing: '-0.055em',
      lineHeight: 1.05, fontVariantNumeric: 'tabular-nums', color: language.accent},
    title: {fontSize: typography.title, fontWeight: 600, letterSpacing: '-0.045em', lineHeight: 1.3},
    subtitle: {fontSize: typography.subtitle, fontWeight: 400, lineHeight: 1.5,
      color: language.secondaryText},
    line: {backgroundColor: language.accent},
    baseline: {backgroundColor: language.border},
  } satisfies Record<string, CSSProperties>;
};
