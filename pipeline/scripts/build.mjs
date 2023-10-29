import {run} from './run.mjs';
import {info, nl} from "../utils/log.mjs";


nl(1);
info('###############################################');
info(`# 🏗️  Pipeline Step: Build                     #`);
info('###############################################');
nl(1);


try {
    await run('NODE_ENV=production yarn workspace @nlux-dev/nlux build');
    await run('NODE_ENV=production yarn workspace @nlux-dev/openai build');

    await run('NODE_ENV=production yarn workspace @nlux-dev/nlux-react build');
    await run('NODE_ENV=production yarn workspace @nlux-dev/openai-react build');

    await run('NODE_ENV=production yarn workspace @nlux-dev/themes build');
} catch (e) {
    process.exit(1);
}
