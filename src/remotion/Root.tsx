import {sceneTiming} from '../scenes/TechPriceExplainer/timing';
import {TechPriceExplainer} from '../scenes/TechPriceExplainer/TechPriceExplainer';
import {validateExplainerInput} from '../scenes/TechPriceExplainer/input';
import type {TechPriceExplainerInput} from '../scenes/TechPriceExplainer/types';
import explainerSample from '../data/tech-price-explainer.sample.json';
import {Composition} from 'remotion';
import {SectionIntro} from '../components/SectionIntro/SectionIntro';
import {sectionIntroMetadata} from '../components/SectionIntro/metadata';
import {sectionIntroDurationSeconds} from '../components/SectionIntro/timing';
import type {SectionIntroCompositionProps} from '../components/SectionIntro/types';
import sectionIntroSample from '../data/section-intro.sample.json';
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

const sectionIntroDefaultProps: SectionIntroCompositionProps = {
  ...sectionIntroSample, theme: sectionIntroSample.theme as SectionIntroCompositionProps['theme'], renderFps: 30,
};

/** Composition registry, not an additional graphic component. */
export const RemotionRoot = () => (
  <>
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
    <Composition
      id="SectionIntro"
      component={SectionIntro}
      width={tokens.canvas.width}
      height={tokens.canvas.height}
      fps={30}
      durationInFrames={Math.round(30 * sectionIntroDurationSeconds)}
      defaultProps={sectionIntroDefaultProps}
      calculateMetadata={({props}) => sectionIntroMetadata(props)}
    />
    <Composition
      id="TechPriceExplainer"
      component={TechPriceExplainer}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={Math.round(30 * sceneTiming.duration)}
      defaultProps={explainerSample as TechPriceExplainerInput}
      calculateMetadata={({props}) => validateExplainerInput(props)}
    />
  </>
);
