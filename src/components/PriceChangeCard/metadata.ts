import {tokens} from '../../design/tokens';
import type {PriceChangeCompositionProps} from './types';

export const priceChangeMetadata = (props: PriceChangeCompositionProps) => {
  const fps = props.renderFps ?? tokens.canvas.fps;
  if (fps !== 30 && fps !== 60) throw new Error('renderFps must be 30 or 60.');
  for (const field of [
    'productName', 'oldPrice', 'newPrice', 'delta', 'deltaPercent',
    'dateLabel', 'priceType', 'sourceLabel',
  ] as const) {
    if (typeof props[field] !== 'string' || !props[field].trim()) {
      throw new Error(`${field} must be a nonempty string.`);
    }
  }
  if (!['up', 'down', 'neutral'].includes(props.direction)) {
    throw new Error('direction must be up, down, or neutral.');
  }
  if (props.transparent !== undefined && typeof props.transparent !== 'boolean') {
    throw new Error('transparent must be a boolean.');
  }
  return {fps, durationInFrames: Math.round(fps * tokens.canvas.durationSeconds)};
};
