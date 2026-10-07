import {normalizeSectionIntroInput} from './input';
import {sectionIntroDurationSeconds} from './timing';
import type {SectionIntroCompositionProps} from './types';

export const sectionIntroMetadata = (props: SectionIntroCompositionProps) => {
  normalizeSectionIntroInput(props);
  const fps = props.renderFps ?? 30;
  if (fps !== 30 && fps !== 60) throw new Error('renderFps must be 30 or 60.');
  return {fps, durationInFrames: Math.round(fps * sectionIntroDurationSeconds)};
};
