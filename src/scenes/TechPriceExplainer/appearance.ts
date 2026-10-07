import type {GlobalTheme} from '../../design/themes/types';

/** Scene-only art direction. Shared tech language is reused; warm shock is intentional. */
export const explainerAppearance = (language: GlobalTheme) => ({
  language,
  shock: '#FF995E',
  device: {
    metal: '#8294A9', rim: '#273342', glass: '#03070C',
    highlight: '#DDE7F3', lens: '#182A3B',
  },
  type: {title: 108, price: 128, emphasis: 94, question: 108, label: 32, component: 40},
});
export type ExplainerAppearance = ReturnType<typeof explainerAppearance>;
