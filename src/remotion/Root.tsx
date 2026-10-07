import {Composition} from 'remotion';
import {PriceChangeCard} from '../components/PriceChangeCard/PriceChangeCard';
import {priceChangeMetadata} from '../components/PriceChangeCard/metadata';
import type {PriceChangeCompositionProps} from '../components/PriceChangeCard/types';
import sample from '../data/price-change.sample.json';
import {tokens} from '../design/tokens';
import {defaultTheme} from '../design/themes';

const defaultProps: PriceChangeCompositionProps = {
  ...sample, direction: sample.direction as PriceChangeCompositionProps['direction'],
  renderFps: 30, transparent: false, theme: defaultTheme,
};

/** Composition registry, not an additional graphic component. */
export const RemotionRoot = () => (
  <Composition
    id="PriceChangeCard"
    component={PriceChangeCard}
    width={tokens.canvas.width}
    height={tokens.canvas.height}
    fps={tokens.canvas.fps}
    durationInFrames={tokens.canvas.fps * tokens.canvas.durationSeconds}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => priceChangeMetadata(props)}
  />
);
