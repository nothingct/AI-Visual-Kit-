import {getTheme} from './themes';
import {normalizePriceChangeInput} from './input';
import {tokens} from '../../design/tokens';
import type {PriceChangeCompositionProps} from './types';

export const priceChangeMetadata = (props: PriceChangeCompositionProps) => {
  getTheme(props.theme);
  const fps = props.renderFps ?? tokens.canvas.fps;
  if (fps !== 30 && fps !== 60) throw new Error('renderFps must be 30 or 60.');
  normalizePriceChangeInput(props);
  return {fps, durationInFrames: Math.round(fps * tokens.canvas.durationSeconds)};
};
