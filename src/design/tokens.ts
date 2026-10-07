/** Shared tokens for future graphics; all dimensions refer to the 1080p canvas. */
export const tokens = {
  canvas: {width: 1920, height: 1080, fps: 30, durationSeconds: 2.5},
  colors: {
    background: '#10151E',
    surface: '#1B2330',
    border: '#354153',
    text: '#F5F7FB',
    muted: '#B2BDCC',
    subtle: '#8796AA',
    up: '#FFB58D',
    down: '#8DDAC0',
    neutral: '#BFCDE0',
  },
  typography: {
    fontFamily: '"Noto Sans KR Variable", "Noto Sans KR", sans-serif',
    price: 154,
    oldPrice: 68,
    delta: 54,
    product: 46,
    label: 30,
    source: 26,
  },
  spacing: {xs: 12, sm: 24, md: 40, lg: 64, safeArea: 96},
  radius: {card: 36, badge: 16},
  motion: {introEnd: 0.4, priceEnd: 1.5, deltaEnd: 2.2, end: 2.5},
} as const;
