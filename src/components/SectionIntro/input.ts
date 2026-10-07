import {getGlobalTheme, defaultTheme} from '../../design/themes/registry';
import type {SectionIntroInput} from './types';

export const normalizeSectionIntroInput = (input: SectionIntroInput): SectionIntroInput => {
  for (const key of ['sectionNumber', 'title'] as const) {
    if (typeof input[key] !== 'string' || !input[key].trim()) {
      throw new Error(`${key} must be a non-empty string.`);
    }
  }
  if (input.subtitle !== undefined && typeof input.subtitle !== 'string') {
    throw new Error('subtitle must be a string when provided.');
  }
  if (input.transparent !== undefined && typeof input.transparent !== 'boolean') {
    throw new Error('transparent must be a boolean.');
  }
  const theme = input.theme ?? defaultTheme;
  getGlobalTheme(theme);
  return {...input, theme, subtitle: input.subtitle?.trim() || undefined};
};
