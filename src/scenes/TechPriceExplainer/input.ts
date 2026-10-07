import {getGlobalTheme} from '../../design/themes/registry';
import {sceneTiming} from './timing';
import type {TechPriceExplainerInput} from './types';

export const validateExplainerInput = (input: TechPriceExplainerInput) => {
  for (const key of ['title', 'subtitle', 'question', 'contextLabel', 'priceNote', 'whySubtitle', 'increaseCaption', 'previousLabel', 'currentLabel'] as const) {
    if (typeof input[key] !== 'string' || !input[key].trim()) throw new Error(`${key} must be a non-empty string.`);
  }
  for (const key of ['previousPrice', 'currentPrice'] as const) {
    if (!Number.isSafeInteger(input[key]) || input[key] < 0) throw new Error(`${key} must be a non-negative integer in KRW.`);
  }
  if (input.currentPrice <= input.previousPrice) throw new Error('This price-increase scene requires currentPrice > previousPrice.');
  if (input.emphasisLabel !== undefined && typeof input.emphasisLabel !== 'string') {
    throw new Error('emphasisLabel must be a string when provided.');
  }
  if (!Array.isArray(input.componentLabels) || input.componentLabels.length < 3 || input.componentLabels.length > 4 ||
    input.componentLabels.some(label => typeof label !== 'string' || !label.trim())) {
    throw new Error('componentLabels must contain 3–4 non-empty strings.');
  }
  getGlobalTheme(input.theme);
  const fps = input.renderFps ?? 30;
  if (fps !== 30 && fps !== 60) throw new Error('renderFps must be 30 or 60.');
  return {fps, durationInFrames: Math.round(fps * sceneTiming.duration)};
};
export const won = (value: number) => `${new Intl.NumberFormat('ko-KR').format(Math.round(value))}원`;
