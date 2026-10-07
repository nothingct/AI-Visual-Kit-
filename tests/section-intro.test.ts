import assert from 'node:assert/strict';
import {test} from 'node:test';
import {normalizeSectionIntroInput} from '../src/components/SectionIntro/input.ts';
import {sectionIntroMetadata} from '../src/components/SectionIntro/metadata.ts';
import {sectionIntroTiming} from '../src/components/SectionIntro/timing.ts';
import {adaptSectionIntroTheme} from '../src/components/SectionIntro/theme/adapter.ts';
import {sectionIntroAppearance} from '../src/components/SectionIntro/theme/appearance.ts';
import {getGlobalTheme} from '../src/design/themes/registry.ts';
import type {SectionIntroInput} from '../src/components/SectionIntro/types.ts';
import sample from '../src/data/section-intro.sample.json';
const input = sample as SectionIntroInput;

test('required chapter fields reject missing, blank and non-string input', () => {
  for (const key of ['sectionNumber', 'title'] as const) {
    for (const invalid of [undefined, null, '', '  ', 1]) {
      assert.throws(() => normalizeSectionIntroInput({...input, [key]: invalid} as SectionIntroInput), new RegExp(key));
    }
  }
});
test('subtitle is optional; blank text omits the slot and invalid types fail', () => {
  const {subtitle: _, ...withoutSubtitle} = input;
  assert.equal(normalizeSectionIntroInput(withoutSubtitle).subtitle, undefined);
  assert.equal(normalizeSectionIntroInput({...input, subtitle: '  '}).subtitle, undefined);
  assert.throws(() => normalizeSectionIntroInput({...input, subtitle: 1} as unknown as SectionIntroInput), /subtitle/);
  assert.equal(sectionIntroMetadata(withoutSubtitle).durationInFrames, 66);
});
test('default techDynamic uses shared language and responds to external token changes', () => {
  assert.equal(normalizeSectionIntroInput({...input, theme: undefined}).theme, 'techDynamic');
  const global = {...getGlobalTheme(), accent: 'changed-accent', fontFamily: 'changed-font'};
  const adapter = adaptSectionIntroTheme(global);
  const appearance = sectionIntroAppearance(adapter);
  assert.equal(adapter.language, global);
  assert.equal(appearance.number.color, global.accent);
  assert.equal(appearance.line.backgroundColor, global.accent);
  assert.equal(appearance.canvas.fontFamily, global.fontFamily);
  assert.equal(appearance.subtitle.color, global.secondaryText);
  assert.equal(sectionIntroAppearance(adapter, true).canvas.backgroundColor, 'transparent');
});
test('planned and unsupported themes fail at both input and metadata boundaries', () => {
  for (const name of ['premiumMinimal', 'valuePop', '__proto__', 'unknown']) {
    const props = {...input, theme: name} as SectionIntroInput;
    assert.throws(() => normalizeSectionIntroInput(props), /Unsupported theme/);
    assert.throws(() => sectionIntroMetadata(props), /Unsupported theme/);
  }
});
test('30/60fps keep a 2.2 second duration, identical real-time motion and final hold', () => {
  assert.deepEqual(sectionIntroMetadata({...input, renderFps: 30}), {fps: 30, durationInFrames: 66});
  assert.deepEqual(sectionIntroMetadata({...input, renderFps: 60}), {fps: 60, durationInFrames: 132});
  for (let frame = 0; frame < 66; frame++) {
    assert.deepEqual(sectionIntroTiming(frame, 30), sectionIntroTiming(frame * 2, 60));
  }
  assert.deepEqual(sectionIntroTiming(41, 30), {line: 1, number: 1, title: 1, subtitle: 1});
  assert.deepEqual(sectionIntroTiming(65, 30), sectionIntroTiming(131, 60));
  assert.throws(() => sectionIntroMetadata({...input, renderFps: 24} as never), /renderFps/);
});
