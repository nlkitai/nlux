import clc from 'cli-color';
import {info, nl} from '../utils/log.mjs';
import {run} from './run.mjs';

nl(1);
info(clc.bgWhite.red(' ############################################### '));
info(clc.bgWhite.red(` # 🏗️  Pipeline Step: Build                     # `));
info(clc.bgWhite.red(' ############################################### '));
nl(1);

try {
    await run('NODE_ENV=production yarn workspace @nlux-dev/core build');
    await run('NODE_ENV=production yarn workspace @nlux-dev/react build');

    await run('NODE_ENV=production yarn workspace @nlux-dev/openai build');
    await run('NODE_ENV=production yarn workspace @nlux-dev/openai-react build');

    await run('NODE_ENV=production yarn workspace @nlux-dev/hf build');
    await run('NODE_ENV=production yarn workspace @nlux-dev/hf-react build');

    await run('NODE_ENV=production yarn workspace @nlux-dev/highlighter build');
    await run('NODE_ENV=production yarn workspace @nlux-dev/themes build');
} catch (e) {
    process.exit(1);
}
