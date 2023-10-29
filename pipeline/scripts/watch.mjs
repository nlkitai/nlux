import {run} from './run.mjs';
import {info, nl} from "../utils/log.mjs";

nl(1);
info('###############################################');
info(`# 🔎 Pipeline Step: Watch                     #`);
info('###############################################');
nl(1);

try {
    run('yarn workspace @nlux-dev/nlux watch');
    run('yarn workspace @nlux-dev/nlux-react watch');
    run('yarn workspace @nlux-dev/openai watch');
    run('yarn workspace @nlux-dev/openai-react watch');
    run('yarn workspace @nlux-dev/themes watch');
} catch (e) {
    process.exit(1);
}
