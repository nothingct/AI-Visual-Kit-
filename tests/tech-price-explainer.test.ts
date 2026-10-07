import assert from 'node:assert/strict';
import {test} from 'node:test';
import {validateExplainerInput, won} from '../src/scenes/TechPriceExplainer/input.ts';
import {explainerMotion, sceneTiming} from '../src/scenes/TechPriceExplainer/timing.ts';
import type {TechPriceExplainerInput} from '../src/scenes/TechPriceExplainer/types.ts';
import sample from '../src/data/tech-price-explainer.sample.json';
const input = sample as TechPriceExplainerInput;

test('provided Korean prices and exact increase stay consistent', () => {
  assert.equal(input.previousPrice, 1254000);
  assert.equal(input.currentPrice, 1403600);
  assert.equal(input.currentPrice - input.previousPrice, 149600);
  assert.equal(input.emphasisLabel, `+${won(input.currentPrice-input.previousPrice)}`);
  assert.equal(won(input.currentPrice), '1,403,600원');
});
test('scene rejects unusable numeric prices, missing copy and unsupported themes', () => {
  for (const invalid of [NaN, Infinity, -1, 1.5, '1254000']) {
    assert.throws(() => validateExplainerInput({...input, previousPrice: invalid} as TechPriceExplainerInput), /previousPrice/);
  }
  assert.throws(() => validateExplainerInput({...input, currentPrice: input.previousPrice}), /currentPrice/);
  assert.throws(() => validateExplainerInput({...input, title: ''}), /title/);
  for (const theme of ['premiumMinimal', 'valuePop', 'unknown']) {
    assert.throws(() => validateExplainerInput({...input, theme} as TechPriceExplainerInput), /Unsupported theme/);
  }
  assert.throws(() => validateExplainerInput({...input, renderFps: 24} as never), /renderFps/);
});
test('component network accepts 3–4 nonempty labels and emphasis can be generated', () => {
  const {emphasisLabel: _, ...automatic} = input;
  assert.equal(validateExplainerInput({...automatic, componentLabels: ['AP','DRAM','NAND']}).fps, 30);
  for (const labels of [[], ['AP'], ['AP','DRAM',''], ['A','B','C','D','E']]) {
    assert.throws(() => validateExplainerInput({...input, componentLabels: labels}), /componentLabels/);
  }
});
test('three beats include a genuine earlier-price hold before count-up', () => {
  assert.equal(explainerMotion(90,30).count, 0);
  assert.equal(explainerMotion(90,30).price, 1);
  assert.equal(explainerMotion(150,30).count, 1);
  assert.equal(explainerMotion(150,30).why, 0);
  assert.equal(explainerMotion(260,30).connections(3), 1);
});
test('30/60fps keep 9.5 seconds and identical timing including final hold', () => {
  assert.deepEqual(validateExplainerInput(input), {fps:30,durationInFrames:285});
  assert.deepEqual(validateExplainerInput({...input,renderFps:60}), {fps:60,durationInFrames:570});
  for (let f=0;f<285;f++) {
    const a=explainerMotion(f,30); const b=explainerMotion(f*2,60);
    for (const key of ['phone','title','shift','price','count','emphasis','why','question','pulse'] as const) assert.equal(a[key],b[key]);
    for(let i=0;i<4;i++) assert.equal(a.connections(i),b.connections(i));
  }
  assert.equal(sceneTiming.duration,9.5);
  assert.equal(explainerMotion(284,30).question,1);
});
