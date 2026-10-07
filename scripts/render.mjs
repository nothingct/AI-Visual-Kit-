import {existsSync} from 'node:fs';
import {mkdir, readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {bundle} from '@remotion/bundler';
import {openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';

const root = fileURLToPath(new URL('..', import.meta.url));
const {values, positionals} = parseArgs({
  allowPositionals: true,
  options: {
    fps: {type: 'string'},
    composition: {type: 'string', default: 'PriceChangeCard'},
    props: {type: 'string'},
    output: {type: 'string'},
    frame: {type: 'string'},
    transparent: {type: 'boolean', default: false},
    help: {type: 'boolean', default: false},
    scale: {type: 'string'},
    'frame-range': {type: 'string'},
  },
});
const format = positionals[0];
if (values.help) {
  console.log('npm run render:mp4|render:png -- [--composition PriceChangeCard|SectionIntro|TechPriceExplainer] [--fps 30|60] [--props data.json] [--output path] [--frame N (PNG)] [--transparent (PNG)] [--scale 0.5|1] [--frame-range 0-89 (MP4)]');
  process.exit(0);
}
if (!['mp4', 'png'].includes(format) || positionals.length !== 1) throw new Error('Choose mp4 or png.');
if (values.fps && !['30', '60'].includes(values.fps)) throw new Error('--fps must be 30 or 60.');
if (format === 'mp4' && values.transparent) throw new Error('Transparent output is supported for PNG only. H.264 MP4 has no alpha channel.');
if (format === 'mp4' && values.frame !== undefined) throw new Error('--frame is only supported for PNG.');
const id = values.composition;
if (!['PriceChangeCard', 'SectionIntro', 'TechPriceExplainer'].includes(id)) throw new Error('Unknown composition: ' + id);
const basename = {PriceChangeCard: 'price-change', SectionIntro: 'section-intro', TechPriceExplainer: 'tech-price-explainer'}[id];
if (id === 'TechPriceExplainer' && values.transparent) throw new Error('This full-frame scene does not support transparent export.');
const scale = values.scale === undefined ? 1 : Number(values.scale);
if (![0.5, 1].includes(scale)) throw new Error('--scale must be 0.5 or 1.');
if (format === 'png' && values['frame-range']) throw new Error('--frame-range is only supported for MP4.');
const custom = values.props ? JSON.parse(await readFile(resolve(values.props), 'utf8')) : {};
if (!custom || typeof custom !== 'object' || Array.isArray(custom)) throw new Error('Props JSON must be an object.');
const inputProps = {...custom};
// A custom SectionIntro input may intentionally omit its optional subtitle.
if (id === 'SectionIntro' && values.props && !Object.hasOwn(custom, 'subtitle')) inputProps.subtitle = '';
// Clear a sample emphasis when custom scene data omits it: derive the exact difference.
if (id === 'TechPriceExplainer' && values.props && !Object.hasOwn(custom, 'emphasisLabel')) inputProps.emphasisLabel = '';
if (values.fps) inputProps.renderFps = Number(values.fps);
if (values.transparent) inputProps.transparent = true;
if (id === 'TechPriceExplainer' && inputProps.transparent === true) throw new Error('This full-frame scene does not support transparent export.');
if (format === 'mp4' && inputProps.transparent === true) throw new Error('Use PNG for transparent overlays, or set transparent to false for MP4.');

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ??
  (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const outputLocation = resolve(values.output ?? `${root}/out/${basename}.${format}`);
const serveUrl = await bundle({entryPoint: resolve(root, 'src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable});
try {
  const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: browser});
  let frameRange;
  if (values['frame-range']) {
    if (!/^\d+-\d+$/.test(values['frame-range'])) throw new Error('--frame-range must be start-end.');
    frameRange = values['frame-range'].split('-').map(Number);
    if (frameRange[0] > frameRange[1] || frameRange[1] >= composition.durationInFrames) throw new Error('Frame range outside composition duration.');
  }
  await mkdir(dirname(outputLocation), {recursive: true});
  if (format === 'png') {
    const frame = values.frame === undefined ? composition.durationInFrames - 1 : Number(values.frame);
    if (!Number.isInteger(frame) || frame < 0 || frame >= composition.durationInFrames) {
      throw new Error(`--frame must be an integer between 0 and ${composition.durationInFrames - 1}.`);
    }
    await renderStill({serveUrl, composition, inputProps, output: outputLocation, frame,
      imageFormat: 'png', scale, puppeteerInstance: browser});
  } else {
    await renderMedia({serveUrl, composition, inputProps, outputLocation,
      scale, frameRange, codec: 'h264', pixelFormat: 'yuv420p', colorSpace: 'bt709', crf: 18,
      concurrency: 2, puppeteerInstance: browser,
      onProgress: ({progress}) => {if (progress === 1) console.log('Encoding complete.');}});
  }
  console.log(`Rendered ${composition.width * scale}x${composition.height * scale}, ${composition.fps}fps, ${frameRange ? frameRange[1] - frameRange[0] + 1 : composition.durationInFrames} frames → ${outputLocation}`);
} finally {
  await browser.close({silent: true});
}
