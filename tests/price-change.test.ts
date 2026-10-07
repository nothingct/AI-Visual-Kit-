import assert from 'node:assert/strict';
import {test} from 'node:test';
import {priceChangeDetailTiming, priceChangeTiming} from '../src/components/PriceChangeCard/timing.ts';
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
    assert.equal(priceChangeTiming(0.35 * fps, fps).intro, 1);
    assert.equal(priceChangeTiming(0.35 * fps, fps).current, 0);
    assert.equal(priceChangeTiming(1.25 * fps, fps).current, 1);
    assert.equal(priceChangeTiming(1.25 * fps, fps).delta, 0);
    assert.deepEqual(priceChangeTiming(1.95 * fps, fps), {intro: 1, previous: 1, current: 1, delta: 1});
    assert.deepEqual(priceChangeTiming(2.5 * fps - 1, fps), priceChangeTiming(1.95 * fps, fps));
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

test('arrow sweep and both chips settle by 1.95 seconds at either FPS', () => {
  for (const fps of [30, 60]) {
    assert.deepEqual(priceChangeDetailTiming(0.35 * fps, fps), {arrow: 0, percent: 0});
    assert.equal(priceChangeDetailTiming(0.95 * fps, fps).arrow, 1);
    assert.equal(priceChangeDetailTiming(1.25 * fps, fps).percent, 0);
    assert.deepEqual(priceChangeDetailTiming(1.95 * fps, fps), {arrow: 1, percent: 1});
    assert.deepEqual(priceChangeDetailTiming(2.5 * fps - 1, fps), {arrow: 1, percent: 1});
    for (let frame = 0; frame < 2.5 * fps; frame++) {
      for (const amount of Object.values({...priceChangeTiming(frame, fps), ...priceChangeDetailTiming(frame, fps)})) {
        assert.ok(amount >= 0 && amount <= 1, 'motion must stay bounded without bounce');
      }
    }
  }
});

test('legacy props need no theme; explicit techDynamic works; unimplemented themes fail clearly', () => {
  assert.deepEqual(priceChangeMetadata({...sample, theme: 'techDynamic'}), priceChangeMetadata(sample));
  for (const theme of ['premiumMinimal', 'valuePop', '__proto__']) {
    assert.throws(() => priceChangeMetadata({...sample, theme: theme as 'techDynamic'}), /Unsupported theme/);
  }
});
