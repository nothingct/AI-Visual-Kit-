import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';

const browser = process.env.REMOTION_BROWSER_EXECUTABLE ??
  (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
if (browser) Config.setBrowserExecutable(browser);
Config.setVideoImageFormat('jpeg');
Config.setColorSpace('bt709');
Config.setOverwriteOutput(true);
