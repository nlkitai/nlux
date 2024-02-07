import {existsSync} from 'fs';
import {info, nl} from '../utils/log.mjs';
import {run} from './run.mjs';

if (!existsSync('dist')) {
    nl(1);
    info(' No dist directory found ❌ ! Run `yarn set` or `yarn reset` first.');
    nl(1);
    process.exit(1);
}

nl(1);
info(' ############################################### ');
info(` # 🚂 Pipeline Step: Test                      # `);
info(' ############################################### ');
nl(1);

try {
    //
    // Run tests
    //
    run('cd specs && yarn js:build && yarn js:run', true)
        .then(() => process.exitCode = 0)
        .catch(() => process.exitCode = 1);
} catch (e) {
    process.exit(1);
}
