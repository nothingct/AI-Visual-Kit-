import {tokens} from '../../design/tokens';

const progress = (time: number, start: number, end: number) =>
  Math.max(0, Math.min(1, (time - start) / (end - start)));
const easeOut = (value: number) => 1 - (1 - value) ** 3;

/** Frame-derived animation: no timers, random values, or FPS-dependent durations. */
export const priceChangeTiming = (frame: number, fps: number) => {
  const time = frame / fps;
  return {
    intro: easeOut(progress(time, 0, tokens.motion.introEnd)),
    previous: easeOut(progress(time, tokens.motion.introEnd, 0.65)),
    current: easeOut(progress(time, 0.65, tokens.motion.priceEnd)),
    delta: easeOut(progress(time, tokens.motion.priceEnd, tokens.motion.deltaEnd)),
  };
};
