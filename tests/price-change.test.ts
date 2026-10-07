import assert from 'node:assert/strict';
import {test} from 'node:test';
import {priceChangeTiming} from '../src/components/PriceChangeCard/timing.ts';
import {priceChangeMetadata} from '../src/components/PriceChangeCard/metadata.ts';
import type {PriceChangeCompositionProps} from '../src/components/PriceChangeCard/types.ts';

const sample: PriceChangeCompositionProps = {
  productName: 'Test', oldPrice: '100원', newPrice: '110원', delta: '+10원',
  deltaPercent: '+10%', dateLabel: '2026.03 → 2026.10', priceType: '공식 출고가',
  sourceLabel: 'Source', direction: 'up',
};
test('30 and 60fps preserve the 2.5 second duration', () => {
  assert.deepEqual(priceChangeMetadata(sample), {fps: 30, durationInFrames: 75});
  assert.deepEqual(priceChangeMetadata({...sample, renderFps: 60}), {fps: 60, durationInFrames: 150});
});
test('stages follow the same clock at both frame rates, with a stable final hold', () => {
  for (const fps of [30, 60]) {
    assert.deepEqual(priceChangeTiming(0, fps), {intro: 0, previous: 0, current: 0, delta: 0});
    assert.equal(priceChangeTiming(0.4 * fps, fps).intro, 1);
    assert.equal(priceChangeTiming(0.4 * fps, fps).current, 0);
    assert.equal(priceChangeTiming(1.5 * fps, fps).current, 1);
    assert.equal(priceChangeTiming(1.5 * fps, fps).delta, 0);
    assert.deepEqual(priceChangeTiming(2.2 * fps, fps), {intro: 1, previous: 1, current: 1, delta: 1});
    assert.deepEqual(priceChangeTiming(2.5 * fps - 1, fps), priceChangeTiming(2.2 * fps, fps));
  }
  assert.deepEqual(priceChangeTiming(30, 30), priceChangeTiming(60, 60));
});
test('bad input is rejected, all directions and optional transparent canvas are supported', () => {
  for (const direction of ['up', 'down', 'neutral'] as const) {
    assert.equal(priceChangeMetadata({...sample, direction, transparent: true}).fps, 30);
  }
  assert.throws(() => priceChangeMetadata({...sample, newPrice: ''}), /newPrice/);
  assert.throws(() => priceChangeMetadata({...sample, renderFps: 24 as 30}), /renderFps/);
  assert.throws(() => priceChangeMetadata({...sample, direction: 'other' as 'up'}), /direction/);
  assert.throws(() => priceChangeMetadata({...sample, transparent: 'false' as unknown as boolean}), /transparent/);
});
