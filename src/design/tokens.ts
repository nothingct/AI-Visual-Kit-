/** Shared tokens for future graphics; all dimensions refer to the 1080p canvas. */
export const tokens = {
  canvas: {width: 1920, height: 1080, fps: 30, durationSeconds: 2.5},
  typography: {
    fontFamily: '"Noto Sans KR Variable", "Noto Sans KR", sans-serif',
    price: 134,
    oldPrice: 70,
    delta: 50,
    product: 44,
    label: 34,
    source: 40,
  },
  motion: {introEnd: 0.35, previousEnd: 0.6, arrowEnd: 0.95, currentStart: 0.65, priceEnd: 1.25, deltaEnd: 1.95, end: 2.5},
} as const;
