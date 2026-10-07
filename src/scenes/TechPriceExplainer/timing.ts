/** Edit chapter timing here, in seconds; 30/60fps use the exact same clock. */
export const sceneTiming = {
  duration: 9.5,
  phoneIn: [0, 0.9],
  titleIn: [0.2, 1.05],
  layoutShift: [1.65, 2.45],
  priceIn: [2.15, 2.8],
  shock: [3.7, 4.28],
  emphasisIn: [3.92, 4.62],
  questionTransition: [6.1, 6.95],
  questionIn: [6.35, 7.15],
  connectionsStart: 7.05,
  connectionStagger: 0.18,
  connectionDuration: 0.55,
} as const;
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const progress = (seconds: number, range: readonly [number, number]) =>
  clamp((seconds - range[0]) / (range[1] - range[0]));
export const easeOut = (n: number) => 1 - (1 - n) ** 3;
export const easeInOut = (n: number) => n < 0.5 ? 4 * n ** 3 : 1 - (-2 * n + 2) ** 3 / 2;
export const lerp = (a: number, b: number, n: number) => a + (b - a) * n;
export const explainerMotion = (frame: number, fps: number) => {
  const t = frame / fps;
  return {
    t,
    phone: easeOut(progress(t, sceneTiming.phoneIn)),
    title: easeOut(progress(t, sceneTiming.titleIn)),
    shift: easeInOut(progress(t, sceneTiming.layoutShift)),
    price: easeOut(progress(t, sceneTiming.priceIn)),
    count: easeOut(progress(t, sceneTiming.shock)),
    emphasis: easeOut(progress(t, sceneTiming.emphasisIn)),
    why: easeInOut(progress(t, sceneTiming.questionTransition)),
    question: easeOut(progress(t, sceneTiming.questionIn)),
    pulse: progress(t, [sceneTiming.shock[0], sceneTiming.shock[0] + 0.85]),
    connections: (index: number) => easeOut(progress(t, [
      sceneTiming.connectionsStart + index * sceneTiming.connectionStagger,
      sceneTiming.connectionsStart + index * sceneTiming.connectionStagger + sceneTiming.connectionDuration,
    ])),
  };
};
