import {info, nl} from '../utils/log.mjs';
import {packagesList} from './packages.mjs';
import {run} from './run.mjs';

nl(1);
info(' ############################################### ');
info(` # 🏗️  Pipeline Step: Build                     # `);
info(' ############################################### ');
nl(1);

try {
    for (const pkg of packagesList) {
        await run(`NODE_ENV=production yarn workspace ${pkg.devName} build`);
    }
} catch (e) {
    process.exit(1);
}
