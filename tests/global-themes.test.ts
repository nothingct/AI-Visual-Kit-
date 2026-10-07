import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getGlobalTheme, themeRegistry, globalThemes} from '../src/design/themes/registry.ts';
import type {ThemeName} from '../src/design/themes/types.ts';
import {adaptPriceChangeTheme} from '../src/components/PriceChangeCard/theme/adapter.ts';
import {getThemeAppearance} from '../src/components/PriceChangeCard/theme/appearance.ts';
import {getTheme as legacyTheme} from '../src/components/PriceChangeCard/themes/index.ts';
import {techDynamic as legacyTokens} from '../src/components/PriceChangeCard/themes/techDynamic.ts';

test('global language contains no PriceChangeCard typography, geometry or visual slots', () => {
  const global = getGlobalTheme();
  for (const key of ['typography', 'appearance', 'spacing', 'arrow', 'price', 'oldPrice', 'chipSurface']) {
    assert.ok(!(key in global), `${key} belongs to the component adapter`);
  }
  assert.equal(themeRegistry.techDynamic.status, 'implemented');
  assert.equal(globalThemes.techDynamic, global);
  assert.equal(globalThemes.premiumMinimal, undefined);
  assert.equal(globalThemes.valuePop, undefined);
});
test('planned and unknown themes fail instead of falling back', () => {
  for (const name of ['premiumMinimal', 'valuePop'] as const) {
    assert.equal(themeRegistry[name].status, 'planned');
    assert.throws(() => getGlobalTheme(name), /not implemented/);
    assert.throws(() => legacyTheme(name), /not implemented/);
  }
  assert.throws(() => getGlobalTheme('__proto__' as ThemeName), /Unsupported theme/);
});
test('adapter inherits global color, surface and font changes without copying colors', () => {
  const custom = {...getGlobalTheme(), accent: '#ABCDEF', primaryText: '#FAFAFA',
    controlSurface: '#123456', fontFamily: 'External shared font'};
  const adapted = adaptPriceChangeTheme(custom);
  const styles = getThemeAppearance(adapted, 'up');
  assert.equal(styles.accent.background, custom.accent);
  assert.equal(styles.chip.color, custom.primaryText);
  assert.equal(styles.chip.backgroundColor, custom.controlSurface);
  assert.equal(styles.canvas.fontFamily, custom.fontFamily);
  assert.equal(adapted.typography.price, 134);
  assert.equal(adapted.arrow.strokeWidth, 2.25);
  assert.deepEqual(adapted.spacing, {canvasX: 160, canvasY: 130, cardX: 64, cardTop: 48, cardBottom: 40, gap: 28});
});
test('resolved legacy adapters retain stable identity and never replace global token objects', () => {
  const global = getGlobalTheme();
  assert.equal(adaptPriceChangeTheme(global), legacyTheme());
  assert.equal(legacyTokens, legacyTheme());
  assert.notEqual(global, legacyTheme());
  assert.equal(global.radius.panel, legacyTheme().radius.card);
});
