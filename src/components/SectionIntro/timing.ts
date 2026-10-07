export const sectionIntroDurationSeconds = 2.2;
const reveal = (seconds: number, start: number, end: number) => {
  const progress = Math.max(0, Math.min(1, (seconds - start) / (end - start)));
  return 1 - (1 - progress) ** 3;
};

/** Seconds-based deterministic motion, independent of render FPS. */
export const sectionIntroTiming = (frame: number, fps: number) => {
  const seconds = frame / fps;
  return {
    line: reveal(seconds, 0, 0.35),
    number: reveal(seconds, 0.1, 0.55),
    title: reveal(seconds, 0.35, 1),
    subtitle: reveal(seconds, 0.8, 1.35),
  };
};
