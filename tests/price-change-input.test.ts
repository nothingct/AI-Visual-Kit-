import assert from 'node:assert/strict';
import {test} from 'node:test';
import {normalizePriceChangeInput} from '../src/components/PriceChangeCard/input.ts';
import {priceChangeMetadata} from '../src/components/PriceChangeCard/metadata.ts';
import {getTheme} from '../src/components/PriceChangeCard/themes/index.ts';
import {getTheme as compatibilityTheme} from '../src/design/themes.ts';
import type {LegacyPriceChangeCardProps, PriceChangeCardInput, PriceChangeCardProps} from '../src/components/PriceChangeCard/types.ts';

const legacy: LegacyPriceChangeCardProps = {
  productName: 'External product', oldPrice: '100원', newPrice: '120원', delta: '+20원',
  deltaPercent: '+20%', dateLabel: 'March → October', priceType: '출고가',
  sourceLabel: 'External source', direction: 'up', theme: 'techDynamic',
};
const input: PriceChangeCardInput = {
  productName: 'External product', previousPrice: '100원', currentPrice: '120원', delta: '+20원',
  percentage: '+20%', period: 'March → October', priceType: '출고가',
  source: 'External source', direction: 'up', theme: 'techDynamic',
};

test('legacy and canonical callers resolve to identical Core input and metadata', () => {
  const oldTypedCaller = (props: PriceChangeCardProps) => props.newPrice;
  assert.equal(oldTypedCaller(legacy), '120원');
  assert.deepEqual(normalizePriceChangeInput(legacy), normalizePriceChangeInput(input));
  assert.deepEqual(priceChangeMetadata(legacy), priceChangeMetadata(input));
  assert.deepEqual(priceChangeMetadata({...input, renderFps: 60}), {fps: 60, durationInFrames: 150});
});
test('canonical fields override legacy Preview defaults without dropping formatted text', () => {
  const caller = {...legacy, previousPrice: '$999.00', currentPrice: '$849.00',
    percentage: '-15.0%', period: '2026.01 → 2026.10', source: 'Independent source',
    delta: '-$150.00', direction: 'down' as const};
  const resolved = normalizePriceChangeInput(caller);
  assert.equal(resolved.previousPrice, '$999.00');
  assert.equal(resolved.currentPrice, '$849.00');
  assert.equal(resolved.percentage, '-15.0%');
  assert.equal(resolved.period, '2026.01 → 2026.10');
  assert.equal(resolved.source, 'Independent source');
  assert.equal(resolved.direction, 'down');
  assert.equal(resolved.delta, '-$150.00');
  assert.ok(!('newPrice' in resolved), 'Core must not depend on legacy aliases');
});
test('invalid canonical overrides cannot silently fall back to valid defaults', () => {
  assert.throws(() => normalizePriceChangeInput({...legacy, currentPrice: ''}), /currentPrice/);
  assert.throws(() => normalizePriceChangeInput({...legacy, currentPrice: null as unknown as string}), /currentPrice/);
  assert.throws(() => normalizePriceChangeInput({...input, source: ' '}), /source/);
});
test('original theme imports remain compatible and only techDynamic is implemented', () => {
  assert.equal(getTheme(), compatibilityTheme());
  assert.equal(getTheme().typography.price, 134);
  assert.throws(() => getTheme('valuePop' as 'techDynamic'), /Unsupported theme/);
});
